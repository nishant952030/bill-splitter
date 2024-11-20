import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import json  # Make sure to import json for structured output


class IndianExpenseCategorizer:
    def __init__(self, model_path="expense_model"):
        self.model_path = model_path
        os.makedirs(model_path, exist_ok=True)

        self.vectorizer_file = os.path.join(model_path, "vectorizer.joblib")
        self.model_file = os.path.join(model_path, "model.joblib")

        self.categories = {
            "Food": [
                "swiggy",
                "zomato",
                "restaurant",
                "chai",
                "tiffin",
                "lunch",
                "dinner",
                "breakfast",
                "dhaba",
                "cafe",
                "mess",
                "canteen",
                "biryani",
                "dosa",
                "idli",
                "thali",
                "paratha",
                "samosa",
            ],
            "Transport": [
                "uber",
                "ola",
                "auto",
                "rickshaw",
                "metro",
                "bus",
                "train",
                "taxi",
                "petrol",
                "diesel",
                "fuel",
                "irctc",
                "railways",
                "rapido",
                "yulu",
            ],
            "Shopping": [
                "flipkart",
                "amazon",
                "myntra",
                "ajio",
                "big bazaar",
                "dmart",
                "reliance",
                "mall",
                "market",
                "clothes",
                "shoes",
                "electronics",
            ],
            "Bills": [
                "electricity",
                "water",
                "gas",
                "cylinder",
                "broadband",
                "wifi",
                "mobile",
                "recharge",
                "jio",
                "airtel",
                "vi",
                "maintenance",
                "emi",
            ],
            "Entertainment": [
                "movie",
                "bookmyshow",
                "pvr",
                "inox",
                "netflix",
                "amazon prime",
                "hotstar",
                "concert",
                "event",
                "theme park",
                "membership",
            ],
            "Health": [
                "medical",
                "medicine",
                "doctor",
                "hospital",
                "clinic",
                "pharmacy",
                "apollo",
                "diagnostic",
                "test",
                "consultation",
                "pharmeasy",
                "1mg",
            ],
            "Education": [
                "course",
                "class",
                "tuition",
                "books",
                "stationary",
                "fees",
                "school",
                "college",
                "university",
                "coaching",
                "udemy",
                "coursera",
            ],
            "Groceries": [
                "bigbasket",
                "grofers",
                "vegetables",
                "fruits",
                "grocery",
                "supermarket",
                "kirana",
                "milk",
                "dairy",
                "ration",
            ],
            "Rent": [
                "rent",
                "deposit",
                "advance",
                "pg",
                "hostel",
                "accommodation",
                "housing",
                "flat",
                "apartment",
            ],
            "Other": [],
        }

        self._load_or_initialize_model()

    def _load_or_initialize_model(self):
        """Load or initialize model."""
        try:
            self.vectorizer = joblib.load(self.vectorizer_file)
            self.model = joblib.load(self.model_file)
            print("Loaded existing model!")
        except Exception as e:
            print(f"Error loading model: {e}. Initializing new model.")
            self.vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")
            self.model = MultinomialNB()
            self.train(force=True)

    def _generate_training_data(self, num_samples=1000):
        """Generate synthetic data for training."""
        descriptions = []
        categories = []

        for _ in range(num_samples):
            category = np.random.choice(list(self.categories.keys())[:-1])
            keywords = self.categories[category]
            selected_keywords = np.random.choice(
                keywords, np.random.randint(1, 4), replace=False
            )
            description_parts = list(selected_keywords) + np.random.choice(
                ["paid", "for", "the", "on", "in", "at"], 2, replace=False
            )
            np.random.shuffle(description_parts)
            description = " ".join(description_parts)
            descriptions.append(description.lower())
            categories.append(category)

        return descriptions, categories

    def train(self, force=False):
        """Train the model."""
        if force or not (
            os.path.exists(self.model_file) and os.path.exists(self.vectorizer_file)
        ):
            descriptions, categories = self._generate_training_data()
            X = self.vectorizer.fit_transform(descriptions)
            self.model.fit(X, categories)
            joblib.dump(self.vectorizer, self.vectorizer_file)
            joblib.dump(self.model, self.model_file)
            print("Model trained and saved!")
        else:
            print("Model already exists. Use force=True to retrain.")

    def predict_category(self, description):
        """Predict expense category based on description."""
        description = description.lower()

        # Try to match using keywords first
        for category, keywords in self.categories.items():
            if any(keyword in description for keyword in keywords):
                return category

        # If no match found, use the trained model
        X = self.vectorizer.transform([description])
        return self.model.predict(X)[0]

    def categorize_expenses(self, expenses):
        """Categorize expenses based on their descriptions."""
        categorized = {category: [] for category in self.categories.keys()}
        for expense in expenses:
            category = self.predict_category(expense["description"])
            categorized[category].append(expense)

        # Generate summary
        summary = {}
        for category, items in categorized.items():
            total = sum(expense["splitAmount"] for expense in items)
            summary[category] = {"total": total, "count": len(items), "expenses": items}

        # Ensure returning a valid JSON string
        return json.dumps(summary)
