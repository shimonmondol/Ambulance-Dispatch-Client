# 🚑 Ambulance Dispatch

Ambulance Dispatch is a full-stack emergency and fleet management platform built to bridge the critical gap between patients, emergency drivers, and fleet operators through a seamless booking lifecycle secured by role-based authentication.

A comprehensive admin dashboard ensures platform integrity by providing tools for fleet monitoring, trip oversight, user and driver management, automated payment settlements via SSLCommerz, and audit logs.

## 🌐 Live Demo

[https://ambulance-dispatch-client.vercel.app](https://ambulance-dispatch-client.vercel.app)

## 📂 Repository

* Frontend: https://github.com/shimonmondol/ambulance-dispatch-client
* Backend: https://github.com/shimonmondol/ambulance-dispatch-server

## ✨ Main Features

* 🔐 Multi-Role Authentication & Access Control (Customer, Provider/Driver, Admin)
* 🚑 Emergency Ambulance Request & Instant Dispatch System
* 📍 Real-Time Ride Lifecycle Tracking (Requested, Assigned, Picked Up, Completed)
* 💳 Automated Payment Integration with SSLCommerz (Cards, Mobile Banking & Net Banking)
* 🧾 Printable Medical Invoice & Digital Receipt with Unique Transaction ID
* 🔄 Resilient Retry Payment Flow on Cancellation or Decline
* 📊 Provider Portal for Trip Acceptance & Availability Management
* 🛠️ Centralized Admin Dashboard (Fleet Monitoring, User Moderation & Audit Logs)
* 🚗 Automated Vehicle & Provider Availability Synchronization
* 🛡️ Token-Based Route Protection with Persistent Auth Hydration
* 📱 Fully Responsive & Mobile-Friendly Medical UI

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Zustand
* Lucide React

### Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL (Neon DB)
* Prisma ORM
* SSLCommerz (`sslcommerz-lts`)
* JSON Web Token (JWT)
* bcryptjs

### Tools

* Git & GitHub
* Postman
* Beekeeper Studio
* VS Code
* Vercel

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/shimonmondol/ambulance-dispatch-client

```

```bash
cd ambulance-dispatch-client

```

### Install Frontend

```bash
cd client
npm install
npm run dev

```

### Install Backend

```bash
cd server
npm install
npx prisma db push
npm run dev

```

## 📄 License

This project is licensed under the Author License.

## 👨‍💻 Author

**Shimon Kumar Mondol**

* GitHub: [https://github.com/shimonmondol](https://github.com/shimonmondol)
* LinkedIn: [https://www.linkedin.com/in/shimon-mondol/](https://www.linkedin.com/in/shimon-mondol/)
* Portfolio: [https://shimondev.netlify.app/](https://shimondev.netlify.app/)

⭐ If you like this project, don't forget to give it a star!
