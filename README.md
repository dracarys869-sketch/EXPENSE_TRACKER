# Modern Expense Tracker System (Django + React)

A full-stack, production-ready **Expense Tracker Application** built with **Python Django REST API** and **React.js / HTML Frontend**.

---

## 🚀 How to Run Locally

### 1. Run Backend (Python Django)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

3. Run database migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the Django backend server:
   ```bash
   python manage.py runserver 5000
   # or simply: python app.py
   ```
   The backend API will run on `http://127.0.0.1:5000`.

---

### 2. Run Frontend (React Vite / Python Fallback)

#### Option A: Using Node.js / Vite (Recommended)
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies (requires [Node.js](https://nodejs.org/)):
   ```bash
   npm install
   ```

3. Run Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app will open at `http://localhost:3000`.

#### Option B: Using Python Dev Server (Fallback)
If Node.js / `npm` is not installed on your system:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the built-in Python static server:
   ```bash
   python serve.py
   ```
   The static frontend server will run at `http://localhost:3000`.
