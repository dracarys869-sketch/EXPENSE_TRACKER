# Modern Expense Tracker System (Django + React)

A full-stack, production-ready **Expense Tracker Application** built with **Python Django REST API** and **React.js / Vite Frontend**.

## Saved Accounts

The local database currently contains these accounts:

| Name | Email | Role | Status |
|------|-------|------|--------|
| Expense Admin | `expenseadmin@gmail.com` | Administrator | Active | Admin123
| Gian | `dracarys869@gmail.com` | User | Active | Gian_123

Passwords are stored securely as hashes and are not included in this README.

## Project Structure

```text
backend/
   api/             Django application and API endpoints
   expense_tracker/ Django project configuration
   instance/        Local runtime database files
   manage.py        Django management commands
frontend/
   src/             React/Vite application
```

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
   python manage.py runserver
   # or simply: python app.py
   ```
   The backend API will run on `http://127.0.0.1:8000` with either command.

---

### 2. Run Frontend

#### Using Node.js / Vite
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

### 3. Starting Again Later

Start `python manage.py runserver` from `backend` and `npm run dev` from `frontend`, then open `http://localhost:3000`. Keep both terminals running while using the app.

The frontend forwards API requests to port **8000**, which matches Django's default and `python app.py`. If you deliberately use a different backend port, update the proxy target in `frontend/vite.config.js` to match.

Accounts and expenses are saved in `backend/instance/expense_tracker.db` and remain available after closing and restarting the app.
