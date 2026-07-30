import re

def markdown_to_html(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"- (.+)", r"<li>\1</li>", text)
    text = re.sub(r"(<li>.*?</li>(\n?)*)+", lambda m: f"<ul>{m.group(0)}</ul>", text)
    text = text.replace("\n\n", "<br><br>").replace("\n", "<br>")
    return text
