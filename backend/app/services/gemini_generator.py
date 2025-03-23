from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
from docx import Document
import os
from pathlib import Path
import re
import google.generativeai as genai
from PIL import Image, ImageDraw
import io
import base64
from openai import OpenAI

class GeminiGenerator:
    def __init__(self):
        self.api_key = None

    def set_api_key(self, key: str):
        if not key or not isinstance(key, str):
            raise ValueError("Invalid API key")
        self.api_key = key
        return True

    def generate_story(self, prompt: str, apiKey: None, model: str) -> str:
        if apiKey == None:
            raise ValueError("API key not set")
        else:
            genai.configure(api_key=apiKey)
            model = genai.GenerativeModel(model)
            
            response = model.generate_content(prompt)
            if response.text:
                generated_text = response.text
                # print(f"Generated text: {generated_text}")
                return generated_text
                # Clean up the JSON string
                # json_string = generated_text.replace("```json", "").replace("```", "").strip()
                # try:
                #     chapter_dict = json.loads(json_string)
                #     return chapter_dict
                    
                # except json.JSONDecodeError as e:
                #     print(f"Error parsing JSON: {e}")
                #     return None
            return None

    def save_story(self, story_data: dict):
        # Add your story saving logic here
        try:
            # Save story to database or file
            return True
        except Exception as e:
            print(f"Error saving story: {e}")
            return False