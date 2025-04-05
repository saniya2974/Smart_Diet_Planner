import os
import json
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS  

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

# ✅ API Keys
GROQ_API_KEY = "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"
UNSPLASH_ACCESS_KEY = "l1Gne6Mn9YI_tVO92F72IBkDGk0Z3s6tYJS5GT_y5ps"  # 🔹 Replace with your Unsplash key

# ✅ API URLs
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"

def fetch_unsplash_image(query):
    """Fetch a relevant food image from Unsplash API."""
    try:
        response = requests.get(
            UNSPLASH_API_URL,
            params={"query": query, "per_page": 1, "client_id": UNSPLASH_ACCESS_KEY},
        )
        data = response.json()
        if data["results"]:
            return data["results"][0]["urls"]["small"]
    except requests.exceptions.RequestException as e:
        print(f"❌ Unsplash API Error: {str(e)}")
    return "https://yourwebsite.com/default.jpg"  # Fallback image

@app.route("/generate-diet", methods=["POST"])
def generate_diet():
    """Fetch a meal plan from Groq API and enhance it with real food images."""
    try:
        data = request.json  
        print("🔹 Received Request Data:", data)  

        user_goal = data.get("goal", "general")
        user_target = data.get("target", "balanced diet")
        exclusion = data.get("exclusion", "none")
        other_exclusion = data.get("otherExc", "")
        
        bmi = data.get("bmi", "unknown")
        body_fat = data.get("bodyFat", "unknown")
        activity = data.get("activity", "unknown")
        diet_pref = data.get("dietPref", "Anything")
        
         # ✅ Merge exclusions with meal type selection
        if diet_pref == "Veg":
            exclusion += ", chicken, fish, meat, eggs"
        elif diet_pref == "Keto":
            exclusion += ", bread, rice, pasta, cereals, high-sugar fruits"
        elif diet_pref == "Paleo":
            exclusion += ", dairy, grains, legumes, starchy vegetables"
        
        all_exclusions = f"{exclusion}, {other_exclusion}".strip(", ")

        
        print("🔹 Final Data Sent to AI Model:")
        print(json.dumps({
            "goal": user_goal,
            "target": user_target,
            "bmi": bmi,
            "bodyFat": body_fat,
            "activity": activity,
            "exclusion": all_exclusions
        }, indent=4))
       
       
       
        prompt = f"""
        Generate a **valid JSON Indian food based meal plan** for a person whose goal is **{user_goal}**, 
        targeting **{user_target}**, with a **BMI of {bmi}**, **Body Fat of {body_fat}%**, 
        and a **{activity} activity level**, while avoiding **{all_exclusions}**.  

        The response **must** be valid JSON without any additional text.
        
        {{
          "Breakfast": {{
              "calories": 450,
              "items": [
                  {{"name": "Oatmeal", "image": "", "servings": 1}}
              ]
          }},
          "Lunch": {{
              "calories": 600,
              "items": [
                  {{"name": "Grilled Chicken", "image": "", "servings": 1}}
              ]
          }},
          "Dinner": {{
              "calories": 500,
              "items": [
                  {{"name": "Salmon Salad", "image": "", "servings": 1}}
              ]
          }}
        }}

        **DO NOT** include any explanations before or after the JSON.
        """

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "You are a professional dietitian."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
        }

        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        print("🔹 Full Groq API Response:", response.text)  

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from Groq API"}), 500

        response_data = response.json()
        diet_plan_text = response_data["choices"][0]["message"]["content"]
        print("🔹 Raw AI Response:", diet_plan_text)  

        try:
            diet_plan_text = re.sub(r'(\d+)/(\d+)', r'\1.\2', diet_plan_text)
            diet_plan_json = json.loads(diet_plan_text)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON format from Groq API"}), 500

        # 🔹 Fetch real food images from Unsplash
        for meal_type in diet_plan_json:
            for item in diet_plan_json[meal_type]["items"]:
                item["image"] = fetch_unsplash_image(item["name"])

        return jsonify({"dietPlan": diet_plan_json})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Error connecting to Groq API"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
