# 🏟️ ArenaLock Backend: Real-Time Booking Engine

A robust, production-ready Node.js backend application designed to handle high-concurrency arena and venue bookings. This system leverages real-time WebSockets communication, lightning-fast Redis caching, and containerized multi-service deployment.

---

## 🏗️ System Architecture & Workflow

Following a clean Model-Service-Controller pattern, the system executes operations through this structured pipeline:

```text
[ Client Request ] 
       │
       ▼
 [ WebSockets / HTTP ] ──► [ Booking Controller ] ──► [ Booking Service ]
                                                            │
                                    ┌───────────────────────┴───────────────────────┐
                                    ▼                                               ▼
                           [ Redis Cache Layer ]                          [ Database Migrations ]
                           (Session & Lock States)                         (Persistent Storage)
```

---

## 📂 Project Structure

```text
arenalock-backend/
├── database/
│   └── migration.sql         # Database schema initialization scripts
├── src/
│   ├── config/
│   │   ├── database.js       # Relational database configurations
│   │   ├── redis.js          # Redis connection initialization
│   │   └── websocket.js      # WebSocket server lifecycle handlers
│   ├── controllers/
│   │   └── bookingController.js # Handles incoming requests and routing logic
│   ├── services/
│   │   └── bookingService.js    # Houses core business rules & booking validation
│   └── server.js             # Application entrypoint & server orchestration
├── .env.example              # Template for environment configuration secrets
└── docker-compose.yml        # Multi-container orchestration (App, Redis, DB)
```

---

## ⚡ Tech Stack

* **Runtime Environment:** Node.js
* **Real-Time Layer:** WebSockets
* **Caching & Mutex Locking:** Redis
* **Database:** SQL / Relational Engine
* **DevOps & Infrastructure:** Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* Node.js (v18+ recommended)
* Docker Desktop

### 2. Environment Setup
Clone the configuration environment file and fill in your local credentials:
```bash
cp .env.example .env
```

### 3. Local Installation
```bash
# Install node dependencies
npm install

# Start the application locally
npm start
```

### 4. Running with Docker (Recommended)
Spin up the entire application stack—including the Node.js server, Redis instance, and Database instance—with a single command:
```bash
docker-compose up --build
```

---

## 🔒 Security & Concurrency Safety
* **Race Condition Prevention:** Utilizes atomic locks via Redis to ensure no double-booking occurs on identical slots.
* **Safe WebSocket Closures:** Implements robust health checks to safely initialize and terminate client socket connections without memory leaks.
