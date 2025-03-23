from fastapi import APIRouter, HTTPException
from app.services.story_generator import StoryGenerator
from app.services.gemini_generator import GeminiGenerator
from app.services.gpt_generator import GPTGenerator
from app.services.deepseek_generator import DeepseekGenerator
from app.services.write_to_doc import WritetoDocx
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime
import logging
from pathlib import Path
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

today_date = datetime.today()
formatted_date = today_date.strftime("%d_%m_%y")

class SecretKeyRequest(BaseModel):
    secret_key: str

class StoryRequest(BaseModel):
    language: str
    storyType: str
    storyLength: str
    model: str
    settings: Optional[dict] = None

router = APIRouter(
    prefix="/api",
    tags=["story"]
)

story_generator = StoryGenerator()
gemini_generator = GeminiGenerator()
gpt_generator = GPTGenerator()
deepseek_generator = DeepseekGenerator()
write_to_doc = WritetoDocx()

@router.post("/set-key")
async def set_secret_key(key_data: SecretKeyRequest):
    try:
        story_generator.set_api_key(key_data.secret_key)
        return {"message": "API key set successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate")
async def generate_story(request: StoryRequest):
    try:
        logger.debug(f"Received request: {request}")
        
        # Extract settings with default values if settings is None
        settings = request.settings or {}
        deepseekApiKey = settings.get('deepseekApiKey', None)
        geminiApiKey = settings.get('geminiApiKey', None)
        gptApiKey = settings.get('gptApiKey', None)
        storyOutputPath = settings.get('storyOutputPath', os.getcwd())
        storyOutputPath = Path(storyOutputPath)
        gdrivePath = settings.get('gdrivePath', None)

        # Variables
        storyLength = request.storyLength
        storyType = request.storyType
        language = request.language
        model = request.model

        file_path = storyOutputPath / "stories" / formatted_date / language / storyType
        chapter = {"short": 5, "medium": 10, "long": 20, "very long": 30}

        tableIndexPrompt = f"Generate a structured table of contents for a novel in {language}\
            with around {chapter[storyLength]} chapters. The novel follows the {storyType} genre. Each chapter should have\
            a compelling title and a brief description summarizing its main events or themes.\
            The titles should be engaging and hint at key plot points while maintaining suspense and excitement.\
            Ensure the chapters flow logically, gradually building tension and developing the story.\
            Return the result as a dictionary where keys are chapter numbers (as integers), and values are\
            dictionaries with 'title' and 'description' keys. The output should be properly formatted as a JSON-like structure.\
            Also generate name of novel as first element of dictionary with key as 'novel_name' and value as name of novel."


        if "gpt" in request.model:
            # Use GPT integration
            gpt_generator.generate_story(tableIndexPrompt)
        elif "gemini" in request.model:
            # Use Gemini integration
            # Generate Table of Contents
            generate_index = gemini_generator.generate_story(tableIndexPrompt, geminiApiKey, model)

            json_string = generate_index.replace("```json", "").replace("```", "").strip()
            try:
                chapter_dict = json.loads(json_string)                
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON: {e}")

            generate_index = chapter_dict

            story_name = generate_index.get('novel_name', 'Untitled Novel')
            print(f"Story name: {story_name}")
            if generate_index:
                finalFilePath = file_path / story_name / f"{story_name}.docx"
                story_file = write_to_doc.create_story_folder(finalFilePath)
                # print(f"Story file path: {story_file}")
                contents = ""
                # Process each chapter
                for key, value in generate_index.items():
                    if key != 'novel_name':  # Skip the novel name entry
                        if isinstance(value, dict) and 'title' in value:
                            contents += f"Chapter {key}......... {value['title']}\n"
                write_to_doc.write_to_docx(story_name, contents, story_file)

            # Generate Brief Description
            description_file = write_to_doc.create_story_folder(file_path / story_name / "description.docx")
            description_Prompt = f"Generate a brief detailed description for the following story: \n {generate_index}"
            generate_description = gemini_generator.generate_story(description_Prompt, geminiApiKey, model)
            # print(f"Generating description for {story_name}... {generate_description}")
            if generate_description:
                write_to_doc.write_to_docx("Brief Description", generate_description, description_file)

            # Generate Story
            for key, value in generate_index.items():
                    if key != 'novel_name':  # Skip the novel name entry
                        if isinstance(value, dict) and 'title' in value:
                            storyPrompt = f"Generate a {storyType} story chapter based on the following details:\
                                - The story is set in a {language} speaking country.\
                                - Table of Contents: {generate_index}\
                                - Chapter Title: {value['title']}\
                                - Chapter Description: {value['description']}\
                                - Story Context: This chapter is part of a larger {storyType} novel. The atmosphere should be eerie, suspenseful, and immersive. Maintain consistency with previous chapters while gradually building tension.\
                                - Writing Style: Dark, intense, and atmospheric, with vivid descriptions and {storyType} elements.\
                                - Key Elements to Include: [Specify if any particular scene, character action, or twist is required]\
                                - Tone & Mood: [Creepy, suspenseful, terrifying, etc.]\
                                - Length: [full chapter]\
                                - Story language will be {language} language only so write in that language."
                            print(f"Generating story for chapter {key}...")

                            generate_story = gemini_generator.generate_story(storyPrompt, geminiApiKey, model)

                            if generate_story:
                                write_to_doc.write_to_docx(value['title'], generate_story, story_file)

                                # Generate Image Prompt
                                imagePrompt = f"Generate 4 image prompts for the below story: \n {generate_story}"
                                prompt_file = write_to_doc.create_story_folder(file_path / story_name / "imageprompt.docx")
                                generate_prompt = gemini_generator.generate_story(imagePrompt, geminiApiKey, model)
                                if generate_prompt:
                                    write_to_doc.write_to_docx(value['title'], generate_prompt, prompt_file)

            # Generate Coming Up Next
            comingUpNextPrompt = f"Generate 4 image prompts for the below story: \n {generate_story}"
            comingUpNextPrompt_file = write_to_doc.create_story_folder(file_path / story_name / "comingupnext.docx")
            generate_comingUpNext = gemini_generator.generate_story(comingUpNextPrompt, geminiApiKey, model)
            if generate_comingUpNext:
                write_to_doc.write_to_docx("Coming Up Next", generate_comingUpNext, comingUpNextPrompt_file)
            
        elif "deepseek" in request.model:
            # Use DeepSeek integration
            gemini_generator.generate_story(tableIndexPrompt)
        
        return {"story_subjects": [story_name]}
    except Exception as e:
        logger.error(f"Error generating story: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Error generating story",
                "error": str(e)
            }
        )

@router.post("/save")
async def save_story(story_data: dict):
    success = story_generator.save_story(story_data)
    if success:
        return {"message": "Story saved successfully"}
    return {"message": "Failed to save story"}
