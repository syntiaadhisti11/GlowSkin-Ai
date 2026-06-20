import os
import json
import logging
import httpx
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RAGService")

class RAGService:
    def __init__(self, dataset_path: str = None):
        if dataset_path is None:
            # Get path relative to this file
            dir_path = os.path.dirname(os.path.realpath(__file__))
            dataset_path = os.path.join(dir_path, "dataset.json")
            
        self.dataset_path = dataset_path
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip('/')
        self.embedding_model = "nomic-embed-text"
        
        self.data = self._load_dataset()
        self.ingredients = self.data.get("ingredients", [])
        self.products = self.data.get("products", [])
        self.skin_type_tips = self.data.get("skin_type_tips", {})
        
        # Cache for embeddings
        self.ingredient_embeddings = {}
        self.embeddings_loaded = False
        
        # Precompute embeddings on startup if possible
        # We do this asynchronously or lazily. Let's do a lazy load or simple attempt.
        
    def _load_dataset(self) -> Dict[str, Any]:
        try:
            with open(self.dataset_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load dataset from {self.dataset_path}: {e}")
            return {"ingredients": [], "products": [], "skin_type_tips": {}}

    def _get_embedding(self, text: str) -> List[float]:
        """Fetch embedding from Ollama nomic-embed-text model. Returns empty list on failure."""
        try:
            url = f"{self.ollama_url}/api/embeddings"
            payload = {
                "model": self.embedding_model,
                "prompt": text
            }
            # Timeout of 2 seconds to keep it fast
            response = httpx.post(url, json=payload, timeout=2.0)
            if response.status_code == 200:
                return response.json().get("embedding", [])
        except Exception as e:
            logger.debug(f"Ollama embedding failed for text: '{text[:20]}...': {e}")
        return []

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = sum(a * a for a in vec_a) ** 0.5
        norm_b = sum(b * b for b in vec_b) ** 0.5
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    def load_embeddings(self):
        """Precompute embeddings for all ingredients using Ollama in background/lazy style."""
        if self.embeddings_loaded:
            return
        
        logger.info("Initializing vector embeddings for ingredients...")
        success_count = 0
        for ing in self.ingredients:
            # We embed the name + description for better semantic search context
            text_to_embed = f"Ingredient: {ing['name']}. Aliases: {', '.join(ing.get('aliases', []))}. Description: {ing['description']}"
            embedding = self._get_embedding(text_to_embed)
            if embedding:
                self.ingredient_embeddings[ing["name"]] = embedding
                success_count += 1
                
        if success_count > 0:
            self.embeddings_loaded = True
            logger.info(f"Loaded {success_count} ingredient embeddings successfully.")
        else:
            logger.warning("Failed to load any embeddings. Falling back to keyword search.")

    def search_ingredient(self, query: str, threshold: float = 0.5) -> Dict[str, Any]:
        """Search for an ingredient in the RAG dataset using hybrid Semantic + Keyword matching."""
        if not query:
            return None
            
        query_clean = query.strip().lower()
        
        # 1. Exact or Substring Keyword Match (Highest Priority)
        # Check names
        for ing in self.ingredients:
            if query_clean == ing["name"].lower():
                return ing
                
        # Check aliases
        for ing in self.ingredients:
            for alias in ing.get("aliases", []):
                if query_clean == alias.lower():
                    return ing

        # Check partial/substring matching
        for ing in self.ingredients:
            if query_clean in ing["name"].lower() or ing["name"].lower() in query_clean:
                return ing
            for alias in ing.get("aliases", []):
                if query_clean in alias.lower() or alias.lower() in query_clean:
                    return ing

        # 2. Semantic Search (If Ollama embeddings are available)
        self.load_embeddings() # Make sure embeddings are tried
        if self.embeddings_loaded:
            query_embedding = self._get_embedding(query)
            if query_embedding:
                best_similarity = -1.0
                best_match = None
                
                for ing_name, ing_embedding in self.ingredient_embeddings.items():
                    sim = self._cosine_similarity(query_embedding, ing_embedding)
                    if sim > best_similarity:
                        best_similarity = sim
                        # Find the actual ingredient object
                        best_match = next((i for i in self.ingredients if i["name"] == ing_name), None)
                        
                if best_similarity >= threshold and best_match:
                    logger.info(f"Semantic match found: {best_match['name']} with similarity {best_similarity:.2f}")
                    return best_match

        return None

    def analyze_ingredients_text(self, text: str, skin_type: str = "normal") -> List[Dict[str, Any]]:
        """Parses a block of text containing ingredients (comma-separated), searches RAG, and evaluates compatibility."""
        if not text:
            return []
            
        # Clean and split ingredients list (split by comma, semicolon, or newlines)
        raw_parts = []
        for delimiter in [",", ";", "\n"]:
            if delimiter in text:
                raw_parts = [p.strip() for p in text.split(delimiter) if p.strip()]
                break
        if not raw_parts:
            raw_parts = [text.strip()]
            
        results = []
        for part in raw_parts:
            # Clean up common cosmetic list text prefix/suffixes like water (aqua), oils etc.
            clean_part = part.strip(". *\"'").split("(")[0].strip() # Get main name before parentheses
            if not clean_part or len(clean_part) < 2:
                continue
                
            matched_ing = self.search_ingredient(clean_part)
            
            if matched_ing:
                # Determine compatibility based on skin type
                suitability = matched_ing.get("skin_suitability", {}).get(skin_type.lower(), "Good")
                
                results.append({
                    "searched_name": part,
                    "matched_name": matched_ing["name"],
                    "description": matched_ing["description"],
                    "benefits": matched_ing["benefits"],
                    "risk_rating": matched_ing["risk_rating"],
                    "risk_category": matched_ing["risk_category"],
                    "safety_details": matched_ing["safety_details"],
                    "skin_suitability": suitability,
                    "interactions": matched_ing.get("interactions", {}),
                    "tips": matched_ing.get("tips", ""),
                    "found": True
                })
            else:
                # Ingredient not in database - return generic "unknown but neutral/safe"
                results.append({
                    "searched_name": part,
                    "matched_name": clean_part,
                    "description": "Bahan ini belum terindeks secara detail dalam database lokal kami, namun umumnya berfungsi sebagai bahan pelarut, pengemulsi, pengawet, atau ekstrak pembantu.",
                    "benefits": [],
                    "risk_rating": 1,
                    "risk_category": "Unknown/Safe",
                    "safety_details": "Tidak ada laporan bahaya tinggi untuk bahan ini dalam database standar.",
                    "skin_suitability": "Good",
                    "interactions": {},
                    "tips": "",
                    "found": False
                })
                
        return results

    def get_recommendations(self, skin_type: str) -> Dict[str, Any]:
        """Generate tailored skincare routine recommendations from the RAG database."""
        skin_type = skin_type.lower()
        if skin_type not in ["oily", "dry", "sensitive", "acne_prone"]:
            skin_type = "oily" # fallback default
            
        recommended_ingredients = []
        avoid_ingredients = []
        
        # Check ingredients suitability
        for ing in self.ingredients:
            suit = ing.get("skin_suitability", {}).get(skin_type, "Good")
            if suit == "Excellent":
                recommended_ingredients.append(ing)
            elif suit == "Avoid":
                avoid_ingredients.append(ing)
                
        # Find matching products
        recommended_products = []
        for prod in self.products:
            suit = prod.get("skin_suitability", {}).get(skin_type, "Good")
            if suit in ["Excellent", "Good"]:
                recommended_products.append(prod)
                
        # Get custom skin tips
        tips = self.skin_type_tips.get(skin_type, [])
        
        return {
            "skin_type": skin_type,
            "recommended_ingredients": [
                {"name": ing["name"], "benefits": ing["benefits"], "tips": ing["tips"]}
                for ing in recommended_ingredients[:4]
            ],
            "avoid_ingredients": [
                {"name": ing["name"], "reason": ing["safety_details"]}
                for ing in avoid_ingredients[:4]
            ],
            "products": recommended_products,
            "tips": tips
        }
# Simple test code
if __name__ == "__main__":
    service = RAGService()
    print("Testing Keyword Search for Niacinamide...")
    print(service.search_ingredient("Niacinamide"))
    print("\nTesting Analysis of Ingredients List...")
    print(service.analyze_ingredients_text("Water, Salicylic Acid, Niacinamide, Fragrance", "sensitive"))
