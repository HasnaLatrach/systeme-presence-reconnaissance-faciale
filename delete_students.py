import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000"

def get_all_persons():
    try:
        with urllib.request.urlopen(f"{BASE_URL}/persons") as response:
            data = json.loads(response.read().decode())
            return data.get("persons", [])
    except Exception as e:
        print(f"Error fetching persons: {e}")
        return []

def delete_person(name):
    req = urllib.request.Request(f"{BASE_URL}/person/{name}", method='DELETE')
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"Successfully deleted {name}: {data.get('message')}")
    except urllib.error.HTTPError as e:
        print(f"Failed to delete {name}: {e.code} - {e.reason}")
    except Exception as e:
        print(f"Error deleting {name}: {e}")

if __name__ == "__main__":
    targets = ["mikasa", "douha"]
    print("Fetching student list...")
    persons = get_all_persons()
    print(f"Found {len(persons)} persons in database.")
    
    # Print all names for debugging
    all_names = [p['name'] for p in persons]
    print(f"Current students: {', '.join(all_names)}")

    for target in targets:
        # Find matching name (case-insensitive)
        match = next((p['name'] for p in persons if p['name'].lower() == target.lower()), None)
        if match:
            print(f"Found match for '{target}': '{match}'. Deleting...")
            delete_person(match)
        else:
            print(f"No match found for '{target}'.")
