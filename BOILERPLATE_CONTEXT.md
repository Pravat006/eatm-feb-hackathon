# 📦 Boilerplate — Project Context

This document provides a comprehensive context for the **Boilerplate** platform, specifically tailored for frontend development.

---

## 🏗️ Project Identity
**Boilerplate** is a robust starting point for modern full-stack applications. It provides authentication, user management, and a robust microservice-ready architecture.

### Core Value Props:
- **Scalable Architecture**: Monorepo using Turborepo.
- **Authentication**: JWT, HttpOnly Cookies, and Role-Based Access.
- **Real-Time Ready**: Pre-configured Socket.IO and Redis pub/sub.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand
- **API Client**: Axios (Cookie-based, Interceptor-driven for auto-refresh)
- **Real-Time**: Socket.IO
- **Database**: PostgreSQL with Prisma ORM

---

## 🔐 Authentication & Security
- **Pattern**: Secure HTTP-only Cookie-based authentication.
- **Entities**:
  - `accessToken`: 15m expiry (Cookie).
  - `refreshToken`: 7d expiry (Cookie).
- **Roles**:
  - `ADMIN`, `MANAGER`, `USER`, `VIEWER`.

---

## 📦 Data Models (Entities)
1. **Users**:
   - Fields: `name`, `username`, `email`, `role`, `isActive`, `lastSeen`.
   - Relationships: Base entity for authentication.

---

## 📊 Dashboard Modules & Features
The "vibe" should be premium, data-rich, and interactive.

### 1. Global Command Center (Home)
- **Stats Grid**: High level platform metrics.

---

## 🎨 Design Language (Aesthetics)
- **Vibe**: Dark mode by default, sleek, high-contrast.
- **Elements**: 
  - Glassmorphism for sidebar/modals.
  - Subtle micro-animations.

---

## 📍 Implementation Status
- [x] **Backend Core**: Fully implemented auth server.
- [x] **Auth**: Fully secure cookie-based auth implemented.
- [x] **WS Server**: Base handlers and connections ready.
- [x] **Frontend Main**: Login/Register exist. Dashboard layout ready.
