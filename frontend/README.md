# Order Management Frontend

A **React + TypeScript frontend** for managing customer orders with **real-time updates**.
Users can create orders, select items, view orders, and see changes instantly without refreshing the page.

---

## Table of Contents

1. [Project Overview]
2. [Features]
3. [Technologies & Packages]
4. [Forms & Validation]
5. [How It Works]

---

## Project Overview

This project provides a user-friendly interface to manage orders:

- Create orders with **customer details** and **items**
- Validate inputs before submission
- View and filter order listings
- View order stats
- Handle **pagination** of items
- Get **real-time updates** when orders are added or updated

---

## Features

- **Order Creation Form**

  - Customer Name, Email, Phone with proper validation
  - Select order type (`delivery`, `pickup`, `dine_in`)
  - Add multiple items with quantity and price
  - Prevent duplicate items in an order

- **Validation**

  - Using `utils/createOrderValidation.ts` for modular validation
  - Validates:
    - Name (required)
    - Email (format and required)
    - Phone (supports `+` prefix, 7–15 digits)

- **Order Listing**

  - Display orders in a list/table
  - Pagination support
  - Real-time updates using WebSockets
  - Updating status of orders

- **Item Management**

  - Items from backend (paginated)
  - Auto-calculates item price
  - Remove items from the order

- **Real-Time Updates (Socket.io)**

  - Orders update in real-time without refreshing
  - New orders are prepended to the list
  - Updates dashboard when new order is received showing counter on dashboard

- **Notifications**
  - Success and error notifications using `react-toastify`

---

## Technologies & Packages

- **React** - Frontend UI
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Components & styling
- **react-toastify** - Notifications
- **Socket.io-client** - Real-time updates

---

## Forms & Validation

- The Create Order Form uses real-time and submission-based validation.
- Each field validates as the user types.
- Errors are displayed instantly under each field.
- Form submission is blocked until all fields are valid.
- Required fields include: customer name, phone number, email, order type, items.
- Email must match a valid email format.
- Phone number must follow the +XXXXXXXX pattern (7–15 digits).
- Item list must include at least one selected item.
- Item quantities must be greater than zero.
- Whitespace-only inputs are rejected.
- Full form validation runs again on submit.
- Backend validation errors are also displayed to the user.
- All validation logic is managed inside createOrderValidation.ts.
- Clean error messages help guide users to correct their inputs

---

## How It Works

- The user fills out the Create Order Form with customer details and order type.
- All inputs are validated live as the user types, and again on submission, using a centralized validation utility.
- The user selects and adds items to the order. Items are fetched from the backend with infinite scrolling pagination, and duplicate items are prevented
- When the form is submitted, the order is sent to the backend using the Orders API. Success and error messages are displayed using toast notifications.
- After a new order is created, the backend emits a Socket.io event, allowing the frontend to immediately update without refreshing.
- The Dashboard Page displays real-time order listings and overall order statistics.
- The order list automatically updates in real-time when a new order arrives via Socket.io.
- By clicking on any order in the list, the user can open the Order Details Dialog, where full order information is displayed.
- Inside the Order Details Dialog, the user can update the order status (e.g., Pending → Preparing → Completed), and once updated, the dashboard and list refresh automatically.
- Notifications are used throughout the app to provide clear feedback for actions such as order creation, updates, validation errors, and API issues.

---

## 📥 Clone the Repository

Clone the project to your local machine:

```sh
git clone git@github.com:jokey-dev/restaunax-assessment.git
```

```sh
cd frontend
```

```sh
npm install
```

## 📦 Prerequisites

Before running the project, ensure you have:

- **Node 22**

---

## 🧰 Getting Started

### Start Frontend Server

```sh
npm run dev
```

### Home Page

```sh
http://localhost:5173/
```

## THE END 🔥
