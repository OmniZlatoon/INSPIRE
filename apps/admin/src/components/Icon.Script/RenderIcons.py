import os
import json

# This script generates a mapping of course names to icon files in the public directory.
# It can be used to keep the frontend mapping in sync with the actual files.

ICONS_DIR = "../../../public/CourseIcons"
LEADERBOARD_ICONS_DIR = "../../../public/LeaderboardIcons"
OUTPUT_FILE = "./icon_mapping.json"

# Write the script that handles multiple icon directory and generates one Icon_mapping.json file to serve the icons
# This script should be placed in the same directory as the Icon_mapping.json file and should be run before the application is built.

def main():
    """Generates the Icon_mapping.json file with mappings for CourseIcons and LeaderboardIcons directories."""
    icon_mapping = {}

    # Process CourseIcons directory
    if os.path.exists(ICONS_DIR):
        for filename in os.listdir(ICONS_DIR):
            if filename.endswith(('.png', '.jpg', '.jpeg', '.svg', '.gif')):
                base_name = os.path.splitext(filename)[0].lower()
                # Clean up the key: replace spaces with hyphens and convert to lowercase
                # Also handle '&' which is sometimes used
                key = base_name.replace(' ', '-').replace('&', '').replace('+', '').replace('#', '').replace('*', '')
                icon_mapping[key] = f"/CourseIcons/{filename}"
    else:
        print(f"Warning: CourseIcons directory not found: {ICONS_DIR}")

    # Process LeaderboardIcons directory
    if os.path.exists(LEADERBOARD_ICONS_DIR):
        for filename in os.listdir(LEADERBOARD_ICONS_DIR):
            if filename.endswith(('.png', '.jpg', '.jpeg', '.svg', '.gif')):
                base_name = os.path.splitext(filename)[0].lower()
                key = base_name.replace(' ', '-').replace('&', '').replace('+', '').replace('#', '').replace('*', '')
                icon_mapping[key] = f"/LeaderboardIcons/{filename}"
    else:
        print(f"Warning: LeaderboardIcons directory not found: {LEADERBOARD_ICONS_DIR}")

    # Write to output file
    try:
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(icon_mapping, f, indent=4)
        print(f"Successfully generated {OUTPUT_FILE} with {len(icon_mapping)} mappings.")
    except IOError as e:
        print(f"Error writing to output file: {e}")

if __name__ == "__main__":
    main()
