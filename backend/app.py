from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import re
import spacy

app = Flask(__name__)
CORS(app)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_info_from_text(text):
    # Process the text with spaCy
    doc = nlp(text)
    
    # Initialize dictionary for extracted information
    info = {
        "name": "",
        "phone": "",
        "address": ""
    }
    
    # Extract phone numbers using regex
    phone_pattern = re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b')
    phones = phone_pattern.findall(text)
    if phones:
        info["phone"] = phones[0]
    
    # Extract names using spaCy's NER
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not info["name"]:
            info["name"] = ent.text
        elif ent.label_ in ["GPE", "LOC"] and not info["address"]:
            info["address"] = ent.text
    
    return info

@app.route('/extract', methods=['POST'])
def extract_info():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    try:
        # Extract text from PDF
        with pdfplumber.open(file) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
        
        # Extract information from text
        extracted_info = extract_info_from_text(text)
        return jsonify(extracted_info)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)