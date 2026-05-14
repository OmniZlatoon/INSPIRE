import os
import json

# This script generates a mapping of course names to icon files in the public directory.
# It can be used to keep the frontend mapping in sync with the actual files.

ICONS_DIR = "../../../public/CourseIcons"
OUTPUT_FILE = "./icon_mapping.json"

def generate_mapping():
    if not os.path.exists(ICONS_DIR):
        print(f"Error: {ICONS_DIR} not found.")
        return

    mapping = {}
    files = [f for f in os.listdir(ICONS_DIR) if f.endswith(('.png', '.svg', '.jpg'))]
    
    for file in files:
        # Create a key from the filename (e.g., "FullStack.png" -> "fullstack")
        name_key = os.path.splitext(file)[0].lower().replace('_', '').replace('-', '')
        mapping[name_key] = f"/CourseIcons/{file}"
        
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(mapping, f, indent=4)
        
    print(f"Successfully generated mapping for {len(files)} icons to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_mapping()
