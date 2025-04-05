import os
import openai

# Load API key from environment variable
api_key = "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"

if not api_key:
    raise ValueError("API key not found. Set the GROQ_API_KEY environment variable.")

# Initialize Groq client
client = openai.OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")

# Chat completion request
response = client.chat.completions.create(
    model="mixtral-8x7b-32768",
    messages=[{"role": "user", "content": "Can you provide diet plans for breakfast, lunch and dinner for weight gain?"}]
)

print(response.choices[0].message.content)
