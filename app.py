import subprocess
import os
import sys
import time

def run_all():
    print("--- Starting Credential Manager (Full Stack) ---")

    # 1. Start the Flask Backend
    # Use sys.executable to ensure we use the same Python environment
    print("[1/2] Launching Flask Backend...")
    flask_proc = subprocess.Popen([sys.executable, "server.py"])

    # 2. Start the React Frontend
    # shell=True is required for 'npm' on Windows
    print("[2/2] Launching React Frontend...")
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    react_proc = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir, shell=True)

    print("\nApplication is running!")
    print("Backend: http://localhost:5000")
    print("Frontend: http://localhost:5173")
    print("\nPress Ctrl+C to stop both servers.")

    try:
        # Keep the script running while the processes are alive
        while True:
            time.sleep(1)
            if flask_proc.poll() is not None or react_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\nStopping servers...")
    finally:
        flask_proc.terminate()
        react_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    run_all()

