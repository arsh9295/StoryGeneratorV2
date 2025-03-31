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

promptFilePath = Path(__file__).parent.parent / 'prompts' 
chpaterDescriptionPath = Path(__file__).parent.parent / 'prompts' / 'chapterDescription'

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
        chapter = {"short": 4, "medium": 10, "long": 20, "very long": 30}

        chapterDescriptionFile = chpaterDescriptionPath / f"{chapter[storyLength]}.txt"
        with open(chapterDescriptionFile, 'r', encoding='utf-8') as file:
            chapterDescriptionContent = file.read()

        tableIndexPromptFilePath = promptFilePath / "tableIndexPrompt.txt"
        with open(tableIndexPromptFilePath, 'r') as file:
            content = file.read()
        formatted_content = eval(f"f'''{content}\n{chapterDescriptionContent}'''")
        tableIndexPrompt = formatted_content
        # print(f"Table index prompt: {tableIndexPrompt}")

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
            descriptionPromptFilePath = promptFilePath / "descriptionPrompt.txt"
            with open(descriptionPromptFilePath, 'r') as file:
                content = file.read()
            formatted_content = eval(f"f'''{content}'''")
            description_Prompt = formatted_content            
            generate_description = gemini_generator.generate_story(description_Prompt, geminiApiKey, model)
            # print(f"Generating description for {story_name}... {generate_description}")
            if generate_description:
                write_to_doc.write_to_docx("Brief Description", generate_description, description_file)

            # Generate Story
            for key, value in generate_index.items():
                    if key != 'novel_name':  # Skip the novel name entry
                        if isinstance(value, dict) and 'title' in value:
                            storyPromptFilePath = promptFilePath / "storyPrompt.txt"
                            with open(storyPromptFilePath, 'r') as file:
                                content = file.read()
                            formatted_content = eval(f"f'''{content}'''")
                            storyPrompt = formatted_content                               
                            print(f"Generating story for chapter {key}...")

                            generate_story = gemini_generator.generate_story(storyPrompt, geminiApiKey, model)

                            if generate_story:
                                write_to_doc.write_to_docx(value['title'], generate_story, story_file)

                                # Generate Image Prompt
                                imagePromptFilePath = promptFilePath / "imagePrompt.txt"
                                with open(imagePromptFilePath, 'r') as file:
                                    content = file.read()
                                formatted_content = eval(f"f'''{content}'''")
                                imagePrompt = formatted_content                                   
                                prompt_file = write_to_doc.create_story_folder(file_path / story_name / "imageprompt.docx")
                                generate_prompt = gemini_generator.generate_story(imagePrompt, geminiApiKey, model)
                                if generate_prompt:
                                    write_to_doc.write_to_docx(value['title'], generate_prompt, prompt_file)

            # Generate Coming Up Next
            comingUpNextPromptFilePath = promptFilePath / "comingUpNextPrompt.txt"
            with open(comingUpNextPromptFilePath, 'r') as file:
                content = file.read()
            formatted_content = eval(f"f'''{content}'''")
            comingUpNextPrompt = formatted_content                  
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
