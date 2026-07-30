import json
import re
import random
from pathlib import Path
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

KB_PATH = Path(__file__).parent / "knowledge_base.json"

with open(KB_PATH) as f:
    knowledge_base = json.load(f)


def preprocess(text: str) -> str:
    return re.sub(r"[^a-z0-9\s]", "", text.lower().strip())


def match_intent(user_input: str) -> str | None:
    cleaned = preprocess(user_input)

    scores: dict[str, int] = {}
    for intent, data in knowledge_base.items():
        score = 0
        for pattern in data["patterns"]:
            if pattern in cleaned:
                score += len(pattern)
        if score > 0:
            scores[intent] = score

    if not scores:
        return None

    return max(scores, key=scores.get)


def get_response(user_input: str) -> str:
    intent = match_intent(user_input)

    if intent:
        return random.choice(knowledge_base[intent]["responses"])

    return (
        "I'm not sure I understand that. Could you rephrase?\n\n"
        "I can help with:\n"
        "- Order status & tracking\n"
        "- Returns & refunds\n"
        "- Shipping info\n"
        "- Payment questions\n"
        "- Account help\n"
        "- Product info\n"
        "- Warranty claims\n\n"
        "Or type **'contact'** to reach a human agent."
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    bot_reply = get_response(user_message)
    return jsonify({"reply": bot_reply})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
