# Simple Social Media Project

This is a simple social media project that consists of two main components:

1. **Cloneproject** - A React frontend application.
2. **myproject** - A Django backend application.

## Project Overview

The project allows users to register through the Django admin panel and then log in through the React app using JWT tokens. Once logged in, users can create posts, comment on posts, like other users' posts, and update their profiles.

## Features

- **User Registration**: Admins can create user accounts through the Django admin panel.
- **User Authentication**: Users can log in using JWT tokens.
- **Posts**: Users can create, edit, and delete posts.
- **Comments**: Users can comment on posts.
- **Likes**: Users can like other users' posts.
- **Profile Management**: Users can update their profile information.

## Installation

### Backend (Django)

1. **Clone the backend repository:**
    ```bash
    git clone <your-backend-repo-url> myproject
    cd myproject
    ```

2. **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

3. **Run migrations:**
    ```bash
    python manage.py migrate
    ```

4. **Create a superuser for the admin panel:**
    ```bash
    python manage.py createsuperuser
    ```

5. **Start the Django server:**
    ```bash
    python manage.py runserver
    ```

### Frontend (React)

1. **Clone the frontend repository:**
    ```bash
    git clone <your-frontend-repo-url> cloneproject
    cd cloneproject
    ```

2. **Install the required packages:**
    ```bash
    npm install
    ```

3. **Start the React development server:**
    ```bash
    npm run dev
    ```

## Usage

1. **Admin Panel**: Access the Django admin panel at `http://127.0.0.1:8000/admin` and create user accounts.
2. **Login**: Open the React app at `http://localhost:3000` and log in with the created user credentials.
3. **Social Media Features**: After logging in, you can create posts, comment on posts, like posts, and update your profile.
