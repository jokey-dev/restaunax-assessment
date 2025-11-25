# Order Management Backend

A lightweight and containerized backend server built with **Express**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Docker Compose**. Designed for simplicity, scalability, and clean architecture.

---

## 🧱 Architecture Overview

This project follows a structured **MVC (Model–View–Controller)** architecture, implemented using **TypeScript classes** for improved modularity, maintainability, and testability.

### **Models**

The data layer is powered by **Prisma ORM**, which defines the database schema and provides type-safe, auto-generated model clients. All database operations are handled through Prisma’s strongly typed interfaces.

### **Controllers (Class-Based)**

Controllers are implemented as **TypeScript classes**, with each public method mapped to a specific API endpoint.  
This approach provides:

- Clear organization of route handlers
- Improved separation of concerns
- Easy dependency handling
- More maintainable and testable code

### **Services (Class-Based)**

Business logic resides in dedicated **service classes**, ensuring controllers remain thin and focused.  
Services interact with Prisma models and return structured results back to the controllers.

### **Routes**

Route files map HTTP endpoints to controller methods.  
Each route imports its corresponding controller instance and connects it directly to Express route handlers.

### **Middleware**

Reusable middleware (validation, error handling) is organized under a dedicated directory and follows standard Express middleware patterns.

### **Dependency Flow**

This layered, class-based design ensures the project remains clean, scalable, and easy to extend over time.

---

## 📥 Clone the Repository

Clone the project to your local machine:

```sh
git clone git@github.com:jokey-dev/restaunax-assessment.git
```

```sh
cd backend
```

```sh
cp .env.example .env
```

## 📦 Prerequisites

Before running the project, ensure you have:

- **Docker**
- **Docker Compose**

---

## 🧰 Getting Started [With Docker]

### Start Server (It Will Also Seed Database)

```sh
docker compose up --build
```

### Containers Logs

```sh
docker compose logs -f
```

### Health

```sh
http://localhost:3005/health
```

### Shutdown Containers

```sh
docker compose down
```

## THE END 🔥
