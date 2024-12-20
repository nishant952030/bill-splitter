from flask import Flask, request, jsonify
from classiferMainFunction import IndianExpenseCategorizer
import os

# Initialize the Flask app
app = Flask(__name__)

# Initialize the expense categorizer
categorizer = IndianExpenseCategorizer()


@app.route("/classify", methods=["POST"])
def classify_expenses():
    try:
        data = request.get_json()
        if not data or "expenses" not in data:
            return (
                jsonify({"error": "Invalid input. 'expenses' field is required"}),
                400,
            )

        # Categorize expenses
        expenses = data["expenses"]
        results = categorizer.categorize_expenses(expenses)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(
        os.environ.get("PORT", 5000)
    )  # Use Render's port, default to 5000 locally
    app.run(host="0.0.0.0", port=port)
