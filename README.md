# Credential Manager

A secure, full-stack credential management application built with React, Flask, and MongoDB. Designed to be self-hosted, specifically compatible with Docker for easy deployment on Raspberry Pi or any Linux server.

## Features

- **Secure Storage:** Credentials stored in MongoDB.
- **Modern UI:** Responsive React frontend with dark mode styling.
- **Search & Filtering:** Instantly search through your stored services.
- **Import/Export:** Support for bulk import via CSV/JSON and export to CSV.
- **Dockerized:** Ready-to-deploy Docker Compose setup for 24/7 self-hosting.
- **Encryption:** Passwords hashed using `bcrypt`.

## Tech Stack

- **Frontend:** React (Vite), CSS3
- **Backend:** Python (Flask)
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose, Nginx

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Quick Start (Docker)

The easiest way to run the application is using Docker. This works on Windows, Mac, Linux, and Raspberry Pi (ARM64).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sarthak23j/CredentialManager.git
    cd CredentialManager
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the App:**
    Open your browser and navigate to `http://localhost:3000` (or `http://<your-pi-ip>:3000`).

### Development Setup (Manual)

If you want to run the app without Docker for development:

**1. Backend:**
```bash
# Install dependencies
pip install -r requirements.txt

# Start MongoDB (ensure it's running locally on port 27017)

# Run Flask server
python server.py
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Running on Raspberry Pi

1.  Clone this repo on your Pi.
2.  Run `docker-compose up -d --build`.
3.  The build process handles the ARM64 architecture automatically.

## Project Structure

- `/frontend` - React application source code.
- `server.py` - Flask API entry point.
- `credentialActions.py` - Database logic for credentials.
- `userManagement.py` - User authentication logic.
- `Dockerfile` - Backend image definition.
- `docker-compose.yml` - Service orchestration.
