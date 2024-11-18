import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np
import joblib
import os


class IndianExpenseCategorizer:
    def __init__(self, model_path="expense_model"):
        # Create model directory if it doesn't exist
        self.model_path = model_path
        os.makedirs(model_path, exist_ok=True)

        # Define file paths for model components
        self.vectorizer_file = os.path.join(model_path, "vectorizer.joblib")
        self.model_file = os.path.join(model_path, "model.joblib")

        # Define common Indian expense categories
        self.categories = {
            "Food": [
                "swiggy", "zomato", "restaurant", "chai", "tiffin", "lunch", "dinner",
                "breakfast", "dhaba", "cafe", "mess", "canteen", "biryani", "dosa",
                "idli", "thali", "paratha", "samosa"
            ],
            "Transport": [
                "uber", "ola", "auto", "rickshaw", "metro", "bus", "train", "taxi",
                "petrol", "diesel", "fuel", "irctc", "railways", "rapido", "yulu"
            ],
            "Shopping": [
                "flipkart", "amazon", "myntra", "ajio", "big bazaar", "dmart",
                "reliance", "mall", "market", "clothes", "shoes", "electronics"
            ],
            "Bills": [
                "electricity", "water", "gas", "cylinder", "broadband", "wifi",
                "mobile", "recharge", "jio", "airtel", "vi", "maintenance", "emi"
            ],
            "Entertainment": [
                "movie", "bookmyshow", "pvr", "inox", "netflix", "amazon prime",
                "hotstar", "concert", "event", "theme park", "membership"
            ],
            "Health": [
                "medical", "medicine", "doctor", "hospital", "clinic", "pharmacy",
                "apollo", "diagnostic", "test", "consultation", "pharmeasy", "1mg"
            ],
            "Education": [
                "course", "class", "tuition", "books", "stationary", "fees", "school",
                "college", "university", "coaching", "udemy", "coursera"
            ],
            "Groceries": [
                "bigbasket", "grofers", "vegetables", "fruits", "grocery", "supermarket",
                "kirana", "milk", "dairy", "ration"
            ],
            "Rent": [
                "rent", "deposit", "advance", "pg", "hostel", "accommodation",
                "housing", "flat", "apartment"
            ],
            "Other": []
        }
        # Try to load existing model, or create new one if not found
        self._load_or_initialize_model()

    def _load_or_initialize_model(self):
        """Load existing model or initialize new one"""
        try:
            self.vectorizer = joblib.load(self.vectorizer_file)
            self.model = joblib.load(self.model_file)
            print("Loaded existing model successfully!")
        except:
            print("No existing model found. Initializing new model...")
            self.vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")
            self.model = MultinomialNB()
            self._train_and_save_model()

    def _generate_training_data(self, num_samples=1000):
        """Generate synthetic training data"""
        descriptions = []
        categories = []

        for _ in range(num_samples):
            category = np.random.choice(list(self.categories.keys())[:-1])
            keywords = self.categories[category]
            if keywords:
                num_keywords = np.random.randint(1, 4)
                selected_keywords = np.random.choice(
                    keywords, num_keywords, replace=False
                )

                noise_words = ["paid", "for", "at", "in", "the", "to", "from"]
                description_parts = list(selected_keywords) + list(
                    np.random.choice(noise_words, 2, replace=False)
                )
                np.random.shuffle(description_parts)
                description = " ".join(description_parts)
                descriptions.append(description.lower())
                categories.append(category)

        return descriptions, categories

    def _train_and_save_model(self):
        """Train the model and save it to disk"""
        # Generate and train on synthetic data
        descriptions, categories = self._generate_training_data()
        X = self.vectorizer.fit_transform(descriptions)
        self.model.fit(X, categories)

        # Save model components
        joblib.dump(self.vectorizer, self.vectorizer_file)
        joblib.dump(self.model, self.model_file)
        print("Model trained and saved successfully!")

    def train(self, force=False):
        """Train the model (only if forced or no existing model)"""
        if force or not (
            os.path.exists(self.model_file) and os.path.exists(self.vectorizer_file)
        ):
            self._train_and_save_model()
        else:
            print("Model already exists! Use force=True to retrain.")

    def predict_category(self, description):
        """Predict category for a given expense description"""
        description = description.lower()

        # First try direct keyword matching
        for category, keywords in self.categories.items():
            if any(keyword.lower() in description for keyword in keywords):
                return category

        # If no direct match, use the trained model
        X = self.vectorizer.transform([description])
        return self.model.predict(X)[0]

    def categorize_expenses(self, expenses):
        """Categorize a list of expenses"""
        categorized = {category: [] for category in self.categories.keys()}

        for expense in expenses:
            category = self.predict_category(expense["description"])
            categorized[category].append(expense)

        # Calculate summary
        summary = {}
        for category in categorized:
            total = sum(expense["splitAmount"] for expense in categorized[category])
            summary[category] = {
                "total": total,
                "count": len(categorized[category]),
                "expenses": categorized[category],
            }

        return summary


def demo_categorizer():
    # Sample expenses
    sample_expenses = [
        {
            "description": "Swiggy order from Biriyani House",
            "splitAmount": 450,
            "createdAt": "2024-03-15",
        },
        {
            "description": "Uber to office",
            "splitAmount": 200,
            "createdAt": "2024-03-15",
        },
        {
            "description": "Monthly rent payment",
            "splitAmount": 15000,
            "createdAt": "2024-03-01",
        },
        {
            "description": "BigBasket grocery shopping",
            "splitAmount": 2500,
            "createdAt": "2024-03-10",
        },
        {
            "description": "Amazon purchase - earphones",
            "splitAmount": 999,
            "createdAt": "2024-03-05",
        },
        {
            "description": "Zomato order from Domino's",
            "splitAmount": 600,
            "createdAt": "2024-03-08",
        },
        {
            "description": "Bus ticket to city center",
            "splitAmount": 50,
            "createdAt": "2024-03-12",
        },
        {
            "description": "Movie tickets at PVR",
            "splitAmount": 500,
            "createdAt": "2024-03-14",
        },
        {
            "description": "Electricity bill payment",
            "splitAmount": 2000,
            "createdAt": "2024-03-20",
        },
        {
            "description": "Myntra purchase - shirt",
            "splitAmount": 1200,
            "createdAt": "2024-03-06",
        },
        {
            "description": "Train ticket to home",
            "splitAmount": 800,
            "createdAt": "2024-03-09",
        },
        {
            "description": "Uber ride to airport",
            "splitAmount": 500,
            "createdAt": "2024-03-18",
        },
        {
            "description": "Grocery shopping at Reliance Fresh",
            "splitAmount": 3000,
            "createdAt": "2024-03-07",
        },
        {
            "description": "Lunch at McDonald's",
            "splitAmount": 300,
            "createdAt": "2024-03-19",
        },
        {
            "description": "Netflix monthly subscription",
            "splitAmount": 499,
            "createdAt": "2024-03-01",
        },
        {
            "description": "Doctor's consultation fee",
            "splitAmount": 1000,
            "createdAt": "2024-03-11",
        },
        {
            "description": "Pizza Hut dinner",
            "splitAmount": 700,
            "createdAt": "2024-03-04",
        },
        {
            "description": "Fuel for car", 
            "splitAmount": 1500, 
            "createdAt": "2024-03-03"},
        {
            "description": "Phone recharge",
            "splitAmount": 199,
            "createdAt": "2024-03-02",
        },
        {
            "description": "Weekend brunch at Cafe Coffee Day",
            "splitAmount": 800,
            "createdAt": "2024-03-16",
        },
        {
            "description": "BigBasket - household items",
            "splitAmount": 2200,
            "createdAt": "2024-03-05",
        },
        {
            "description": "Gym membership fee",
            "splitAmount": 2500,
            "createdAt": "2024-03-13",
        },
        {
            "description": "Spotify monthly subscription",
            "splitAmount": 129,
            "createdAt": "2024-03-01",
        },
        {
            "description": "Medical shop purchase - medicines",
            "splitAmount": 450,
            "createdAt": "2024-03-17",
        },
        {
            "description": "Laptop EMI payment",
            "splitAmount": 5000,
            "createdAt": "2024-03-05",
        },
        {
            "description": "Weekend dinner at Punjab Grill",
            "splitAmount": 1200,
            "createdAt": "2024-03-15",
        },
        {
            "description": "Taxi ride from station",
            "splitAmount": 350,
            "createdAt": "2024-03-10",
        },
        {
            "description": "Amazon purchase - books",
            "splitAmount": 450,
            "createdAt": "2024-03-09",
        },
        {
            "description": "Water bill payment",
            "splitAmount": 600,
            "createdAt": "2024-03-03",
        },
        {
            "description": "Snacks at a roadside stall",
            "splitAmount": 100,
            "createdAt": "2024-03-12",
        },
        {
            "description": "Train ticket for business trip",
            "splitAmount": 1200,
            "createdAt": "2024-03-08",
        },
        {
            "description": "Haircut at salon",
            "splitAmount": 500,
            "createdAt": "2024-03-04",
        },
        {
            "description": "Weekend trek - registration fee",
            "splitAmount": 1500,
            "createdAt": "2024-03-07",
        },
        {
            "description": "Hotel booking for trip",
            "splitAmount": 4000,
            "createdAt": "2024-03-15",
        },
        {
            "description": "Swiggy - late night snacks",
            "splitAmount": 350,
            "createdAt": "2024-03-14",
        },
        {
            "description": "Movie tickets - IMAX",
            "splitAmount": 600,
            "createdAt": "2024-03-13",
        },
        {
            "description": "Dinner at a 5-star hotel",
            "splitAmount": 5000,
            "createdAt": "2024-03-06",
        },
        {
            "description": "Amazon purchase - kitchen items",
            "splitAmount": 800,
            "createdAt": "2024-03-03",
        },
        {
            "description": "Petrol for bike",
            "splitAmount": 700,
            "createdAt": "2024-03-08",
        },
        {
            "description": "Cabs for local travel",
            "splitAmount": 300,
            "createdAt": "2024-03-11",
        },
        {
            "description": "Lunch at a roadside dhaba",
            "splitAmount": 250,
            "createdAt": "2024-03-10",
        },
        {
            "description": "Shopping at a mall",
            "splitAmount": 2000,
            "createdAt": "2024-03-19",
        },
        {
            "description": "Electricity bill - overdue",
            "splitAmount": 1800,
            "createdAt": "2024-03-02",
        },
        {
            "description": "Insurance premium payment",
            "splitAmount": 12000,
            "createdAt": "2024-03-09",
        },
        {
            "description": "BigBasket - fresh vegetables",
            "splitAmount": 1000,
            "createdAt": "2024-03-17",
        },
        {
            "description": "Zomato order from Burger King",
            "splitAmount": 450,
            "createdAt": "2024-03-16",
        },
        {
            "description": "Gaming console purchase",
            "splitAmount": 15000,
            "createdAt": "2024-03-05",
        },
        {
            "description": "Bus ticket for outstation travel",
            "splitAmount": 600,
            "createdAt": "2024-03-12",
        },
        {
            "description": "Birthday party - cake and gifts",
            "splitAmount": 3000,
            "createdAt": "2024-03-14",
        },
    ]

    # Initialize categorizer
    categorizer = IndianExpenseCategorizer()

    # The model will automatically load if it exists, or train if it doesn't
    # You can force retrain with:
    # categorizer.train(force=True)

    # Categorize expenses
    results = categorizer.categorize_expenses(sample_expenses)

    # Print results
    for category, data in results.items():
        if data["count"] > 0:
            print(f"\n{category}:")
            print(f"Total amount: ₹{data['total']}")
            print(f"Number of expenses: {data['count']}")
            for expense in data["expenses"]:
                print(f"  - ₹{expense['splitAmount']}: {expense['description']}")


if __name__ == "__main__":
    demo_categorizer()
