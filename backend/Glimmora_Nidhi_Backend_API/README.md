# Glimmora Nidhi — Backend API

> Production-grade REST API for **Glimmora Nidhi Limited** — a Nidhi (financial cooperative) company management system built with **FastAPI** and **SQLite**.

---

## Features

- **JWT Authentication** with Role-Based Access Control (6 roles)
- **79 REST API endpoints** across 17 business modules
- **SQLite** database (drop-in replaceable with PostgreSQL for production)
- **Auto-generated Swagger UI** at `/api/docs`
- **Full seed data** to get started immediately
- Modular project structure — easy to extend

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| Database | SQLite (via SQLAlchemy ORM) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Validation | Pydantic v2 |
| Server | Uvicorn (ASGI) |
| Python | 3.10+ |

---

## Project Structure

```
glimmora-nidhi-api/
│
├── main.py                     # FastAPI app entry point & router registration
├── seed.py                     # Database seeder with sample data
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
│
└── app/
    ├── core/
    │   ├── config.py           # App settings (pydantic-settings)
    │   ├── database.py         # SQLAlchemy engine + session
    │   ├── security.py         # JWT creation/verification, bcrypt hashing
    │   ├── dependencies.py     # Auth guards, role checkers, pagination
    │   └── exceptions.py       # Custom HTTP exceptions
    │
    ├── models/                 # SQLAlchemy ORM models (database tables)
    │   ├── user.py
    │   ├── member.py
    │   ├── chit_scheme.py
    │   ├── chit_enrollment.py
    │   ├── auction.py
    │   ├── loan.py
    │   ├── deposit.py
    │   ├── collection.py
    │   ├── compliance.py
    │   ├── fraud.py
    │   ├── notification.py
    │   ├── config.py
    │   ├── audit_log.py
    │   └── password_reset.py
    │
    ├── schemas/                # Pydantic request/response schemas
    │   ├── auth.py
    │   ├── member.py
    │   ├── chit_scheme.py
    │   ├── chit_enrollment.py
    │   ├── auction.py
    │   ├── loan.py
    │   ├── deposit.py
    │   ├── collection.py
    │   ├── compliance.py
    │   ├── fraud.py
    │   ├── notification.py
    │   ├── report.py
    │   ├── config.py
    │   ├── ai_risk.py
    │   ├── ai_assistant.py
    │   ├── dashboard.py
    │   └── common.py
    │
    ├── routers/                # FastAPI route handlers (one file per module)
    │   ├── auth.py
    │   ├── members.py
    │   ├── chit_schemes.py
    │   ├── chit_enrollments.py
    │   ├── auctions.py
    │   ├── loans.py
    │   ├── deposits.py
    │   ├── collections.py
    │   ├── compliance.py
    │   ├── fraud.py
    │   ├── ai_risk.py
    │   ├── notifications.py
    │   ├── reports.py
    │   ├── config.py
    │   ├── dashboard.py
    │   ├── ai_assistant.py
    │   └── profile.py
    │
    └── services/               # Business logic layer (extendable)
```

---

## Getting Started

### Prerequisites

- Python **3.10** or higher
- `pip`

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/glimmora-nidhi-api.git
cd glimmora-nidhi-api
```

---

### 2. Create & Activate a Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

```bash
# Copy the template
cp .env.example .env
```

Open `.env` and set your `SECRET_KEY` to a long random string:

```env
SECRET_KEY=your-very-long-random-secret-key-at-least-32-characters
DATABASE_URL=sqlite:///./glimmora_nidhi.db
```

> **Important:** Never commit your `.env` file. It is already in `.gitignore`.

---

### 5. Seed the Database

This creates all tables and loads sample data (members, loans, chit schemes, users, etc.):

```bash
python seed.py
```

---

### 6. Run the API Server

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API is now running at **http://localhost:8000**

---

## API Documentation

Once the server is running, open in your browser:

| URL | Description |
|-----|-------------|
| http://localhost:8000/api/docs | **Swagger UI** — Interactive docs (try all endpoints here) |
| http://localhost:8000/api/redoc | **ReDoc** — Clean reference docs |
| http://localhost:8000/api/openapi.json | Raw OpenAPI JSON spec |
| http://localhost:8000/health | Health check |

---

## Default Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@glimmora.com` | `Super@123` |
| Admin | `admin@glimmora.com` | `Admin@123` |
| Branch Manager | `manager@glimmora.com` | `Manager@123` |
| Loan Officer | `loanofficer@glimmora.com` | `Loan@123` |
| Field Agent | `agent@glimmora.com` | `Agent@123` |

---

## API Overview — 17 Modules, 79 Endpoints

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | 6 | Login, Register, Google OAuth, Password reset |
| Members | 6 | CRUD + STI (Trust Score) |
| Chit Schemes | 3 | Create and manage chit fund schemes |
| Chit Enrollment | 2 | Enroll members in chit schemes |
| Chit Auctions | 4 | Live bidding, close auctions |
| Loans | 9 | Full loan lifecycle (Apply → Approve → Disburse → EMI) |
| Deposits | 5 | FD, RD, Savings accounts + maturity tracking |
| Collections & Payments | 7 | EMI collection, self-service payments, recovery |
| Compliance | 6 | KYC, AML, regulatory filings, audit logs |
| Fraud Intelligence | 4 | Fraud cases, pattern analysis |
| AI Risk Control | 4 | AI agents, member risk scores, liquidity |
| Notifications | 3 | User alerts and notification management |
| Reports | 4 | Financial, member growth, loan portfolio, PDF/Excel |
| Configuration | 6 | System settings, user management, roles |
| Dashboard | 4 | KPIs, charts (liquidity, deposits, risk heatmap) |
| AI Assistant | 3 | Natural language chat, structured queries, insights |
| Profile | 3 | Personal profile, change password |

---

## Authentication

All endpoints (except Auth) require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Get the token by calling `POST /api/v1/auth/login`.

---

## Role-Based Access Control

| Role | Access Level |
|------|-------------|
| `SUPER_ADMIN` | Full access to everything |
| `ADMIN` | Full access except super-admin-only settings |
| `BRANCH_MANAGER` | Members, loans, deposits, reports |
| `LOAN_OFFICER` | Loans, collections, members (read) |
| `FIELD_AGENT` | Collections, members (read) |
| `MEMBER` | Own loans, deposits, payments, profile |

---

## Running in Production

### Switch to PostgreSQL

1. Install PostgreSQL driver:
   ```bash
   pip install psycopg2-binary
   ```

2. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/glimmora_nidhi
   DEBUG=false
   SECRET_KEY=<strong-random-64-char-key>
   ```

### Run with Gunicorn (production server)

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | *(required)* | JWT signing secret — use a long random string |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token validity (24 hours) |
| `DATABASE_URL` | `sqlite:///./glimmora_nidhi.db` | Database connection string |
| `DEBUG` | `false` | Enable debug mode |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Built with FastAPI | Glimmora Nidhi Limited © 2026*
