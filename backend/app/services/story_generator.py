class StoryGenerator:
    def __init__(self):
        self.api_key = None

    def set_api_key(self, key: str):
        if not key or not isinstance(key, str):
            raise ValueError("Invalid API key")
        self.api_key = key
        return True

    def generate_story(self, prompt: str = None):
        if not self.api_key:
            raise ValueError("API key not set")
        else:
            pass
        # Add your story generation logic here
        return "Generated story based on prompt: " + (prompt or "default prompt")

    def save_story(self, story_data: dict):
        # Add your story saving logic here
        try:
            # Save story to database or file
            return True
        except Exception as e:
            print(f"Error saving story: {e}")
            return False
