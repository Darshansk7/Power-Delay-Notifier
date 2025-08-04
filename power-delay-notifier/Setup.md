# Power Delay Notifier — Complete Setup Guide

This guide will walk you through setting up the Power Delay Notifier project from scratch, including all backend, frontend, database, and email configurations. Follow each step carefully for a smooth setup.

---

## 1. Prerequisites

- **Node.js**: v14 or higher ([Download Node.js](https://nodejs.org/))
- **MySQL**: v8.0 or higher ([Download MySQL](https://dev.mysql.com/downloads/mysql/))
- **Gmail Account**: For sending email notifications (with 2FA enabled and an App Password)
- **Git** (optional, for cloning the repo)

---

## 2. Clone the Repository

If you haven't already, clone the project:

```bash
git clone <your-repo-url>
cd power-delay-notifier
```

---

## 3. Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

---

## 4. Configure Environment Variables

### Option 1: Interactive Setup (Recommended)

Run the setup script to generate your `.env` file:

```bash
npm run setup
```

- Answer each prompt (MySQL host, user, password, database name, port, JWT secret, Gmail address, Gmail app password).
- The script will create a `.env` file in your project root.

### Option 2: Manual Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- MySQL credentials
- JWT secret (use a strong random string)
- Gmail address and app password (see below)

---

## 5. Set Up MySQL Database

1. **Start MySQL** (ensure the server is running)
2. **Create the database**:

```sql
CREATE DATABASE power_delay_notifier;
```

> The required tables will be created automatically when you start the app for the first time.

---

## 6. Configure Gmail for Email Notifications

1. **Enable 2-Step Verification** on your Gmail account ([Google 2FA Guide](https://myaccount.google.com/security)).
2. **Generate an App Password**:
   - Go to your [Google Account Security](https://myaccount.google.com/security)
   - Under "Signing in to Google" → "App passwords"
   - Select "Mail" and your device, then generate
   - Copy the 16-character app password
3. **Use this app password** as `EMAIL_PASS` in your `.env` file

---

## 7. Start the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

- The server will initialize the database tables if they do not exist.
- You should see console messages confirming DB and server startup.

---

## 8. Access the Application

- **Homepage:** [http://localhost:3000](http://localhost:3000)
- **Customer Portal:** [http://localhost:3000/customer.html](http://localhost:3000/customer.html)
- **Technician Portal:** [http://localhost:3000/technician.html](http://localhost:3000/technician.html)
- **API Documentation:** [http://localhost:3000/api](http://localhost:3000/api)

---

## 9. First-Time Use

### Register a Customer
- Go to the Customer Portal
- Fill in your name, email, and area
- Submit the form

### Register a Technician
- (For demo: use the API or add via DB, or enable registration endpoint)
- Register with name, email, and password
- Login via Technician Portal

### Send a Notification
- Login as a technician
- Enter area and message
- Send notification (customers in that area will receive an email)

---

## 10. Database Schema (Auto-Created)

- **customers**: id, name, email, area, created_at, updated_at
- **technicians**: id, email, password, name, created_at
- **notifications**: id, area, message, recipients_count, sent_by, created_at

---

## 11. Troubleshooting

- **Cannot connect to MySQL**: Check your `.env` DB settings and that MySQL is running
- **Emails not sending**: Double-check Gmail app password and that less secure apps are allowed (with app password, this is handled)
- **Port in use**: Change `PORT` in `.env` or stop other services on that port
- **CORS errors**: Ensure you are accessing from allowed origins (see `server.js`)
- **Frontend not loading**: Make sure you are visiting the correct URLs and the server is running

---

## 12. Useful Commands

- **Run setup script:** `npm run setup`
- **Start dev server:** `npm run dev`
- **Start prod server:** `npm start`
- **Reset DB tables:** Delete tables in MySQL, restart app

---

## 13. Security & Production Notes

- Use a strong, unique `JWT_SECRET` in production
- Use a dedicated Gmail account for notifications
- Set `NODE_ENV=production` in your `.env` for production
- Use a process manager like PM2 for production deployments

---

## 14. Further Help

- See `README.md` for API usage and more details
- Check server logs for errors
- For MySQL issues, use a GUI like MySQL Workbench or `mysql` CLI
- For email issues, test with a different Gmail account/app password

---

**You are now ready to use the Power Delay Notifier!** 