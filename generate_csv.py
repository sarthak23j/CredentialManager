import csv
import random
import string

services = [
    "Google", "Netflix", "Facebook", "Twitter", "Amazon", "Spotify", "GitHub", "LinkedIn", "Instagram", "Dropbox",
    "Slack", "Zoom", "Trello", "Asana", "Jira", "Notion", "Reddit", "Pinterest", "Tumblr", "Flickr",
    "Twitch", "Discord", "Steam", "Epic Games", "Origin", "PlayStation", "Xbox", "Nintendo", "Apple", "Microsoft",
    "Adobe", "Salesforce", "Oracle", "IBM", "SAP", "Cisco", "Intel", "AMD", "Nvidia", "Samsung",
    "LG", "Sony", "Panasonic", "Toshiba", "Sharp", "Hitachi", "Fujitsu", "NEC", "Canon", "Nikon"
]

def generate_password(length=12):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(chars) for _ in range(length))

def generate_username(service):
    return f"user_{service.lower().replace(' ', '')}_{random.randint(100, 999)}"

def generate_email(username):
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com"]
    return f"{username}@{random.choice(domains)}"

headers = ["Service", "Username", "Password", "Email", "URL", "Notes"]
rows = []

for i in range(50):
    service = services[i]
    username = generate_username(service)
    password = generate_password()
    email = generate_email(username)
    url = f"https://www.{service.lower().replace(' ', '')}.com"
    notes = f"Account for {service} - Created via script" if random.random() > 0.5 else ""
    
    rows.append([service, username, password, email, url, notes])

with open("dummy_credentials.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("dummy_credentials.csv created successfully with 50 entries.")
