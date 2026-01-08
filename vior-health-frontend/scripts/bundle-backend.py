#!/usr/bin/env python3
"""
Script to prepare Python backend for bundling with Electron application.
This script creates a standalone Python distribution that can be bundled with the app.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and return the result."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    print(result.stdout)
    return True

def main():
    # Get paths
    script_dir = Path(__file__).parent
    frontend_dir = script_dir
    backend_dir = frontend_dir.parent / "vior_health_backend"
    resources_dir = frontend_dir / "resources"
    python_dir = resources_dir / "python"
    backend_bundle_dir = resources_dir / "backend"

    print("=" * 60)
    print("ViorHealth Backend Bundling Script")
    print("=" * 60)
    print(f"Frontend directory: {frontend_dir}")
    print(f"Backend directory: {backend_dir}")
    print(f"Resources directory: {resources_dir}")
    print()

    # Check if backend exists
    if not backend_dir.exists():
        print(f"Error: Backend directory not found at {backend_dir}")
        return False

    # Create resources directory
    resources_dir.mkdir(exist_ok=True)
    
    print("Step 1: Installing PyInstaller...")
    if not run_command([sys.executable, "-m", "pip", "install", "pyinstaller"]):
        print("Failed to install PyInstaller")
        return False

    print("\nStep 2: Creating backend bundle...")
    # Copy backend to resources
    if backend_bundle_dir.exists():
        shutil.rmtree(backend_bundle_dir)
    
    shutil.copytree(
        backend_dir, 
        backend_bundle_dir,
        ignore=shutil.ignore_patterns(
            '__pycache__', 
            '*.pyc', 
            'venv', 
            'env',
            '.git',
            'node_modules',
            '*.sqlite3',
            'db.sqlite3'
        )
    )
    print(f"Backend copied to {backend_bundle_dir}")

    print("\nStep 3: Installing backend dependencies...")
    requirements_file = backend_bundle_dir / "requirements.txt"
    if requirements_file.exists():
        if not run_command([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ]):
            print("Warning: Some dependencies might not have been installed")

    print("\nStep 4: Creating SQLite database...")
    # Create initial database
    manage_py = backend_bundle_dir / "manage.py"
    if manage_py.exists():
        print("Running migrations...")
        run_command([sys.executable, str(manage_py), "migrate"], cwd=str(backend_bundle_dir))

    print("\n" + "=" * 60)
    print("Backend bundling complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Make sure you have created application icons in the 'build' folder")
    print("2. Run 'npm run electron:build:win' to create the Windows installer")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
