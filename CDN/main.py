from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import json
import os

app = FastAPI()

# Allow frontend served from localhost:8080
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "storage.json"

class TextInput(BaseModel):
    text: str

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"text": "", "hashes": []}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.get("/text")
def get_text():
    return load_data()

@app.put("/text")
def update_text(input: TextInput):
    data = {"text": input.text, "hashes": []}
    for line in input.text.splitlines():
        if "from acct:" in line and "to acct:" in line:
            hash = hashlib.sha256(line.encode()).hexdigest()
            data["hashes"].append({"line": line, "hash": hash})
    save_data(data)
    return {"status": "updated", "hashes": data["hashes"]}

