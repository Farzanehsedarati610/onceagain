from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
import hashlib, json

app = FastAPI()
DATA_FILE = "backend/storage.json"

class TextInput(BaseModel):
    text: str

def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return {"text": "", "hashes": []}

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.get("/text")
def get_text():
    return load_data()

@app.put("/text")
def update_text(input: TextInput):
    data = load_data()
    data["text"] = input.text
    data["hashes"] = []
    for line in input.text.splitlines():
        if "from acct:" in line and "to acct:" in line:
            hash = hashlib.sha256(line.encode()).hexdigest()
            data["hashes"].append({"line": line, "hash": hash})
    save_data(data)
    return {"status": "updated", "hashes": data["hashes"]}

@app.get("/hashes")
def get_hashes():
    return load_data().get("hashes", [])

