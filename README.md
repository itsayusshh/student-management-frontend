# Student Management System – Frontend

React frontend for the Student Management System. Uses React Router, Axios, and Tailwind CSS.

## Folder structure

```
src/
├── api/
│   └── api.js           # Axios instance + all API calls (students, courses, enrollments, auth)
├── components/
│   ├── Button.js        # Reusable button (primary, secondary, danger, ghost)
│   ├── Card.js          # Card container with optional title
│   ├── ErrorMessage.js  # Error banner with optional retry
│   ├── Input.js         # Labeled input with error state
│   ├── Layout.js        # Header nav + main content wrapper
│   ├── Loading.js        # Spinner + message
│   ├── Modal.js         # Modal dialog (e.g. delete confirm)
│   └── ProtectedRoute.js # Optional JWT protection (toggle via REQUIRE_AUTH)
├── context/
│   └── AuthContext.js   # Auth state + login/logout (JWT in localStorage)
├── pages/
│   ├── Dashboard.js     # Stats cards (students, courses, enrollments)
│   ├── Students.js      # List, search, delete; link to add/edit
│   ├── StudentForm.js   # Add/Edit student with validation
│   ├── Courses.js       # List courses
│   ├── Enroll.js        # Enroll student in course + list enrollments
│   └── Login.js         # Login page (when JWT auth enabled)
├── App.js               # Routes + AuthProvider + Layout
├── index.js
└── index.css            # Tailwind directives
```

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

Runs at [http://localhost:3000](http://localhost:3000). Set the backend base URL in `src/api/api.js` (default: `http://localhost:5000/api`).

## Features

- **Dashboard** – Counts for students, courses, enrollments (from API or derived from list endpoints).
- **Students** – List, search by name/email, delete with confirmation, add/edit form with validation.
- **Courses** – List courses.
- **Enroll** – Select student + course to enroll; list and unenroll.
- **Protected routes** – Wrapped in `ProtectedRoute`; set `REQUIRE_AUTH = true` in `ProtectedRoute.js` when your backend uses JWT.
- **UI** – Loading states, error messages with retry, Tailwind-based layout.

## Enabling JWT protection

1. In `src/components/ProtectedRoute.js`, set `REQUIRE_AUTH = true`.
2. Ensure the backend exposes `/api/auth/login` and returns a JWT and `/api/auth/me` for the current user.
3. The axios instance in `src/api/api.js` sends `Authorization: Bearer <token>` and redirects to `/login` on 401.
