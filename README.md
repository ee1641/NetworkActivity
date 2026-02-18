# Network Activity Project

This project is a full-stack application with a Spring Boot backend and a React (Vite) frontend. It uses Supabase for authentication and database services.

## Prerequisites

- **Java 21**: Required for the backend.
- **Node.js & npm**: Required for the frontend.
- **Supabase Account**: You need a Supabase project with a `posts` table and authentication enabled.

---

## 🍎 Running on macOS (Apple Silicon/Intel)

### 1. Backend Setup

1.  **Install Java 21** (if not already installed):
    ```bash
    brew install openjdk@21
    ```
    *If you don't have Homebrew, install it from [brew.sh](https://brew.sh).*

2.  **Configure Java Environment**:
    Run these commands in your terminal to set the Java version for the current session:
    ```bash
    export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
    export PATH="$JAVA_HOME/bin:$PATH"
    ```
    *(Note: For Intel Macs, the path might be `/usr/local/opt/openjdk@21`)*

3.  **Run the Backend**:
    Navigate to the project root directory and run:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Frontend**:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173` (or similar).

---

## 🪟 Running on Windows

### 1. Backend Setup

1.  **Install Java 21**:
    - Download and install the JDK 21 from [Oracle](https://www.oracle.com/java/technologies/downloads/#java21) or [Adoptium](https://adoptium.net/).
    - Ensure you set the `JAVA_HOME` environment variable during installation or manually afterwards.

2.  **Run the Backend**:
    Open Command Prompt or PowerShell, navigate to the project root, and run:
    ```cmd
    mvnw.cmd spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

    For the api:
    ```
    cd thor-sdk
    ```
    npm run dev
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```cmd
    cd frontend
    ```

2.  **Install Dependencies**:
    ```cmd
    npm install
    ```

3.  **Run the Frontend**:
    ```cmd
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

---

## 🔑 Environment Variables

The frontend requires a `.env` file in the `frontend` directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠 Troubleshooting

- **"Auth session missing!"**: This usually happens if you try to access the update password page directly without a valid recovery link, or if the link has expired. Request a new password reset email.
- **Backend Connection Refused**: Ensure the Spring Boot app is running on port 8080. Check the terminal output for any startup errors.
"# NetworkActivity" 
"# NetworkActivity" 
