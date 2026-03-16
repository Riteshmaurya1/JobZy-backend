<div align="center">

<img src="https://img.shields.io/badge/JobZy-Backend%20API-6366f1?style=for-the-badge&logo=node.js&logoColor=white" alt="JobZy Backend" />

# 🚀 JobZy Backend API

### *Your Smart Job Tracking Platform — Backend Powerhouse*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-AWS%20RDS-336791?style=flat-square&logo=postgresql&logoColor=white)](https://aws.amazon.com/rds/)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20S3%20%7C%20SES%20%7C%20SQS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A?style=flat-square&logo=pm2&logoColor=white)](https://pm2.keymetrics.io)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📋 Table of Contents

- [About JobZy](#-about-jobzy)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Author](#-author)

---

## 🎯 About JobZy

**JobZy** is a comprehensive **Job Tracking SaaS Platform** built for Indian job seekers — especially college students and fresh graduates (0–2 YOE) competing for tech roles. It helps users track job applications, schedule interviews, parse resumes with ATS scoring, and automate job-related workflows.

This repository contains the **entire backend API** powering the JobZy platform.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | JWT-based authentication with bcrypt password hashing |
| 📄 **Resume Parser** | PDF/DOCX resume parsing with AI-powered ATS scoring via Gemini API |
| 💼 **Job Tracking** | Full CRUD for job applications with status tracking |
| 📅 **Interview Scheduler** | Schedule and manage interview rounds with reminders |
| 📧 **Email Automation** | Automated email reminders via AWS SES + SQS FIFO queue |
| ⏰ **Cron Jobs** | Scheduled background tasks using `node-cron` |
| 🧾 **Payment Integration** | Razorpay subscription management for freemium tiers |
| ☁️ **Cloud Storage** | Resume/file uploads with AWS S3 + pre-signed URLs |
| 🛡️ **Security** | Helmet, CORS, express-rate-limit, input validation |
| 📊 **Logging** | Structured logging with Pino + Pino-pretty |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (CommonJS) |
| **Framework** | Express.js v5 |
| **Database** | PostgreSQL (AWS RDS) via Sequelize ORM |
| **Queue** | AWS SQS (FIFO) |
| **Email** | AWS SES + Nodemailer |
| **Storage** | AWS S3 |
| **AI / ATS** | Google Gemini API (`@google/genai`) |
| **Payments** | Razorpay |
| **Auth** | JWT + bcryptjs |
| **Validation** | express-validator |
| **File Parsing** | pdf2json, mammoth (DOCX), pdfkit |
| **Logger** | Pino + Pino-pretty |
| **Process Manager** | PM2 (`ecosystem.config.js`) |
| **Reverse Proxy** | Nginx |
| **CI/CD** | GitHub Actions |

</div>

---

## 📁 Project Structure

```
JobZy-backend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipelines
├── server/
│   ├── src/
│   │   ├── auth/           # Auth helpers & JWT utilities
│   │   ├── config/         # DB config, AWS config, rate limiter
│   │   ├── controllers/    # Route controllers (business logic)
│   │   ├── cron/           # Scheduled cron jobs
│   │   ├── jobs/           # SQS background job workers
│   │   ├── logger/         # Pino logger setup
│   │   ├── middleware/     # Auth, error handling, validation middleware
│   │   ├── models/         # Sequelize ORM models (PostgreSQL)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business service layer
│   │   ├── utils/          # Helper utilities
│   │   └── validations/    # Input validation schemas
│   ├── server.js           # App entry point
│   ├── ecosystem.config.js # PM2 config
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- PostgreSQL database (local or AWS RDS)
- AWS account (S3, SES, SQS)
- Razorpay account (for payments)
- Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Riteshmaurya1/JobZy-backend.git
cd JobZy-backend/server

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start in development mode
npm run dev

# 5. Start in production mode (PM2)
npm run pm2:start
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (PostgreSQL / AWS RDS)
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_NAME=jobzy_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_s3_bucket
AWS_SQS_QUEUE_URL=your_sqs_fifo_queue_url
AWS_SES_FROM_EMAIL=noreply@yourdomain.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ **Never commit your `.env` file to version control!**

---

## 📡 API Overview

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, Login, Logout, Refresh Token |
| User Profile | `/api/user` | Get/Update user profile |
| Jobs | `/api/jobs` | Job application CRUD & status tracking |
| Interviews | `/api/interviews` | Interview scheduling & management |
| Resume | `/api/resume` | Upload, parse & ATS score resumes |
| Payments | `/api/payments` | Razorpay subscription & webhooks |
| Dashboard | `/api/dashboard` | Analytics & stats |

---

## ☁️ Deployment

The backend is deployed on **AWS EC2** with the following setup:

```
┌─────────────────────────────────────────────────┐
│                 AWS EC2 Instance                │
│                                                 │
│   Internet → Nginx (80/443) → Node.js (5000)   │
│                                                 │
│   PM2 Process Manager (auto-restart + logs)     │
└─────────────────────────────────────────────────┘
         │                    │
    AWS RDS              AWS S3 / SES / SQS
  (PostgreSQL)          (Storage / Email / Queue)
```

### PM2 Commands

```bash
npm run pm2:start      # Start with PM2
npm run pm2:restart    # Restart processes
npm run pm2:stop       # Stop all processes
pm2 logs               # View live logs
pm2 status             # Check process status
```

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for automated deployment:

```
Push to main
     │
     ▼
 GitHub Actions Workflow
     │
     ├── Install dependencies
     ├── Run build/lint checks
     └── SSH Deploy to AWS EC2
           │
           └── Pull latest code → PM2 restart
```

Workflow file: `.github/workflows/`

---

## 👨‍💻 Author

<div align="center">

**Ritesh Maurya**

[![GitHub](https://img.shields.io/badge/GitHub-Riteshmaurya1-181717?style=flat-square&logo=github)](https://github.com/Riteshmaurya1)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/riteshmaurya)
[![Instagram](https://img.shields.io/badge/Instagram-@jobzy.in-E4405F?style=flat-square&logo=instagram)](https://instagram.com/jobzy.in)

*Backend Developer | Building JobZy — Smart Job Tracking for Indian Developers*

</div>

---

<div align="center">

⭐ **If you find this project useful, please give it a star!** ⭐

*Built with ❤️ by Ritesh Maurya*

</div>
