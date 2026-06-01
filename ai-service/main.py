from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from PIL import Image
import imagehash
import numpy as np
import io
import uvicorn
from typing import Optional, List
import json

app = FastAPI(title="AI Real Estate Duplicate Detection API")

# CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP Model
print("Loading AI model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ AI Model loaded!")

# Store property embeddings
property_store = []

def get_text_similarity(text1: str, text2: str) -> float:
    embeddings = model.encode([text1, text2])
    similarity = np.dot(embeddings[0], embeddings[1]) / (
        np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])
    )
    return float(similarity)

def get_image_similarity(img1_bytes: bytes, img2_bytes: bytes) -> float:
    try:
        img1 = Image.open(io.BytesIO(img1_bytes))
        img2 = Image.open(io.BytesIO(img2_bytes))
        hash1 = imagehash.phash(img1)
        hash2 = imagehash.phash(img2)
        max_diff = len(hash1.hash) ** 2
        diff = hash1 - hash2
        similarity = 1 - (diff / max_diff)
        return float(similarity)
    except Exception as e:
        print(f"Image similarity error: {e}")
        return 0.0

@app.get("/")
def root():
    return {
        "message": "🤖 AI Real Estate Duplicate Detection API",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/detect-duplicate-text")
async def detect_duplicate_text(
    title: str = Form(...),
    description: str = Form(...),
    property_id: str = Form(...),
):
    try:
        combined_text = f"{title} {description}"
        duplicates = []

        for stored in property_store:
            if stored['id'] == property_id:
                continue
            stored_text = f"{stored['title']} {stored['description']}"
            similarity = get_text_similarity(combined_text, stored_text)
            if similarity > 0.85:
                duplicates.append({
                    'property_id': stored['id'],
                    'similarity_score': round(similarity * 100, 2),
                    'is_duplicate': True
                })

        property_store.append({
            'id': property_id,
            'title': title,
            'description': description,
        })

        is_duplicate = len(duplicates) > 0

        return {
            'success': True,
            'property_id': property_id,
            'is_duplicate': is_duplicate,
            'duplicates': duplicates,
            'message': f"Found {len(duplicates)} duplicate(s)" if is_duplicate else "No duplicates found"
        }

    except Exception as e:
        return {'success': False, 'error': str(e)}

@app.post("/detect-duplicate-image")
async def detect_duplicate_image(
    property_id: str = Form(...),
    images: List[UploadFile] = File(...),
):
    try:
        uploaded_hashes = []

        for image in images:
            img_bytes = await image.read()
            img = Image.open(io.BytesIO(img_bytes))
            img_hash = imagehash.phash(img)
            uploaded_hashes.append(str(img_hash))

        duplicates = []

        for stored in property_store:
            if stored['id'] == property_id:
                continue
            if 'image_hashes' not in stored:
                continue

            for uploaded_hash in uploaded_hashes:
                for stored_hash in stored['image_hashes']:
                    hash1 = imagehash.hex_to_hash(uploaded_hash)
                    hash2 = imagehash.hex_to_hash(stored_hash)
                    diff = hash1 - hash2
                    similarity = round((1 - diff / 64) * 100, 2)

                    if diff < 15:
                        duplicates.append({
                            'property_id': stored['id'],
                            'similarity_score': similarity,
                            'is_duplicate': True
                        })
                        break

        # Store karo image hashes
        existing = next((p for p in property_store if p['id'] == property_id), None)
        if existing:
            existing['image_hashes'] = uploaded_hashes
        else:
            property_store.append({
                'id': property_id,
                'title': '',
                'description': '',
                'image_hashes': uploaded_hashes
            })

        is_duplicate = len(duplicates) > 0
        max_score = max([d['similarity_score'] for d in duplicates], default=0)

        return {
            'success': True,
            'property_id': property_id,
            'is_duplicate': is_duplicate,
            'duplicate_score': max_score,
            'duplicates': duplicates,
            'message': f"⚠️ AI detected {max_score}% image similarity with existing property!" if is_duplicate else "No duplicate images found"
        }

    except Exception as e:
        return {'success': False, 'error': str(e)}

@app.post("/detect-duplicate-combined")
async def detect_duplicate_combined(
    title: str = Form(...),
    description: str = Form(...),
    property_id: str = Form(...),
):
    try:
        combined_text = f"{title} {description}"
        duplicates = []

        for stored in property_store:
            if stored['id'] == property_id:
                continue
            stored_text = f"{stored['title']} {stored['description']}"
            text_similarity = get_text_similarity(combined_text, stored_text)

            if text_similarity > 0.80:
                duplicates.append({
                    'property_id': stored['id'],
                    'text_similarity': round(text_similarity * 100, 2),
                    'is_duplicate': True,
                    'reason': 'Similar title and description'
                })

        existing = next((p for p in property_store if p['id'] == property_id), None)
        if not existing:
            property_store.append({
                'id': property_id,
                'title': title,
                'description': description,
            })

        is_duplicate = len(duplicates) > 0
        max_score = max([d['text_similarity'] for d in duplicates], default=0)

        return {
            'success': True,
            'property_id': property_id,
            'is_duplicate': is_duplicate,
            'duplicate_score': max_score,
            'duplicates': duplicates,
            'total_properties_checked': len(property_store),
            'message': f"⚠️ Duplicate detected! {len(duplicates)} similar propert(ies) found" if is_duplicate else "✅ No duplicates found"
        }

    except Exception as e:
        return {'success': False, 'error': str(e)}

@app.post("/load-properties")
async def load_properties(properties: list):
    try:
        for prop in properties:
            existing = next((p for p in property_store if p['id'] == prop['id']), None)
            if not existing:
                property_store.append({
                    'id': prop['id'],
                    'title': prop.get('title', ''),
                    'description': prop.get('description', ''),
                    'image_hashes': prop.get('image_hashes', [])
                })
        return {'success': True, 'loaded': len(property_store)}
    except Exception as e:
        return {'success': False, 'error': str(e)}

@app.get("/properties-count")
def get_properties_count():
    return {
        'total': len(property_store),
        'properties': [{'id': p['id'], 'title': p['title']} for p in property_store]
    }

@app.delete("/clear-store")
def clear_store():
    property_store.clear()
    return {'message': 'Store cleared', 'total': 0}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


