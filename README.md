# The Fork & Flame — Restaurant Menu + Order System

A full-stack restaurant web application where users can browse a menu, add items to a cart, place orders, and view order history.

Built as part of the **UNIT IV & UNIT V** college syllabus covering Bootstrap, Vue.js, Node.js and MongoDB.

---

## Live Features

- Browse menu items by category (Starters, Mains, Desserts, Drinks)
- Add items to cart with live quantity controls and real-time total
- Place orders — saved to MongoDB instantly
- View full order history with item breakdown
- Admin panel to add, edit and delete menu items

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 3 (CDN), Bootstrap 5 (CDN) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |

---

## Project Structure

```
restaurant-app/
├── backend/
│   ├── server.js              → Express server
│   ├── models/
│   │   ├── MenuItem.js        → Menu item schema
│   │   └── Order.js           → Order schema (nested documents)
│   └── routes/
│       ├── menu.js            → CRUD API for menu items
│       └── orders.js          → API for placing and fetching orders
├── frontend/
│   ├── index.html             → Bootstrap 5 + Vue 3 shell
│   └── app.js                 → All Vue components + Router
├── seed.js                    → Seed script for sample data
└── package.json
```

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Menu | Browse items by category |
| `/cart` | Cart | Adjust quantities, place order |
| `/orders` | Order History | View all past orders |
| `/admin` | Admin Panel | Full CRUD on menu items |

---

## API Endpoints

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | Get all menu items |
| POST | `/api/menu` | Add new item |
| PUT | `/api/menu/:id` | Update item |
| DELETE | `/api/menu/:id` | Delete item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place a new order |

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
echo MONGO_URI=mongodb://127.0.0.1:27017/restaurant > .env
echo PORT=3000 >> .env

# 3. Seed the database
node seed.js

# 4. Start the server
npm start

# 5. Open in browser
http://localhost:3000
```

---

## MongoDB Schema

### menuItems collection
```json
{
  "name": "Margherita Pizza",
  "description": "Classic tomato sauce, fresh mozzarella and basil",
  "price": 299,
  "category": "Mains",
  "available": true
}
```

### orders collection (with nested documents)
```json
{
  "placedAt": "2024-01-15T10:30:00Z",
  "status": "confirmed",
  "items": [
    { "name": "Margherita Pizza", "price": 299, "quantity": 2 },
    { "name": "Coke", "price": 60, "quantity": 1 }
  ],
  "total": 658
}
```

---

## Syllabus Coverage

### UNIT IV — Bootstrap & Vue.js

| Topic | Implementation |
|---|---|
| Bootstrap Grid | 3-col responsive menu grid (`row-cols-1 row-cols-md-2 row-cols-lg-3`) |
| Bootstrap Components | Navbar, Cards, Badges, Buttons, Table, Accordion, Toast, Spinner |
| Vue Instance & Template Syntax | `createApp()`, `setup()`, `{{ }}` bindings |
| Vue Directives | `v-for`, `v-if`, `v-else`, `v-bind`, `v-show` |
| Vue Components | MenuPage, CartPage, OrdersPage, AdminPage |
| Vue Events | `@click` on all interactive buttons |
| Event Modifiers | `@submit.prevent` on Admin form |
| Forms & Two-way Binding | `v-model` on cart quantity inputs and all admin form fields |
| Vue Routing | 4 routes via Vue Router 4, `<router-link>`, `router.push()` |
| Vue + Database | `fetch()` API connecting Vue to Node.js backend |

### UNIT V — Node.js & MongoDB

| Topic | Implementation |
|---|---|
| Node.js Server | Express app on port 3000, serves static frontend + REST API |
| MongoDB Documents | `menuItems` collection with full document structure |
| Nested Documents | `items` array embedded inside each order document |
| CRUD Operations | Full create/read/update/delete on menuItems via Express routes |
| `.sort()` | Orders sorted by `placedAt` descending |
| `.limit()` | Orders capped at 50 results |
| `.find()` | All read queries across both collections |
| `.map()` | Cart items mapped to order payload before POST |

---

## Seed Data

Pre-loaded with:
- **4 Starters** — Crispy Calamari, Bruschetta, Chicken Soup, Garlic Bread
- **4 Mains** — Margherita Pizza, Grilled Chicken, Pasta Arrabiata, Beef Burger
- **3 Desserts** — Chocolate Lava Cake, Tiramisu, Vanilla Ice Cream
- **3 Drinks** — Coke, Fresh Lime Soda, Mango Lassi
- **3 sample orders** with nested item arrays
