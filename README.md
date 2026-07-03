# Royal Hostel Management System

This is a premium, state-of-the-art Next.js application built with Prisma and MongoDB to manage hostel branches, rooms, wardens, staff, payments, complaints, and student records.

---

## 🚀 Deployment Guide (Vercel)

Follow these steps to deploy the application on Vercel using GitHub.

### Step 1: Create a GitHub Repository & Push Code

If you haven't pushed the project to GitHub yet, run the following commands in your project's root folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Configure project for Vercel deployment with dynamic database seeding"

# Create a new repository on GitHub and link it
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# Push the code to GitHub
git push -u origin main
```

---

### Step 2: Set up a MongoDB Database (Atlas)

1. Sign up/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) since Vercel's serverless functions use dynamic IP addresses.
5. In your Cluster dashboard, click **Connect** -> **Drivers** -> Copy the connection string.
6. The connection string will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/royal_hostel?retryWrites=true&w=majority`

---

### Step 3: Deploy on Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   * **Key**: `DATABASE_URL`
   * **Value**: Your MongoDB Atlas connection string (from Step 2).
5. Click **Deploy**.
6. Once the deployment finishes, Vercel will provide your live URL.

---

## 🔑 Login Credentials

The project includes an **Auto-Seeding** feature. If you deploy to a fresh, empty database, the application will automatically populate all demo data on the first sign-in attempt (student or admin).

You can log in immediately using these default accounts:

### 👤 Student Account (Student Portal)
* **Username**: `student`
* **Password**: `password`

### ⚙️ Admin Account (Admin Portal)
* **Username**: `admin`
* **Password**: `password`

---

## 🛠️ Local Development

To run the project locally:

1. Make sure you have a local MongoDB instance running or use a remote Atlas URL.
2. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/royal_hostel"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Prisma client generation:
   ```bash
   npx prisma generate
   ```
5. Seed the database locally (optional):
   ```bash
   npx prisma db seed
   ```
6. Run the dev server:
   ```bash
   npm run dev
   ```
