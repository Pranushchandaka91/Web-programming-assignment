# The Fork & Flame — Restaurant Menu + Order System

A full-stack web application where users can browse a restaurant menu, add items to a cart, place orders, and view order history. Built as part of the UNIT IV & UNIT V syllabus covering Bootstrap, Vue.js, Node.js, and MongoDB.

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running, then seed the database
node seed.js

# 3. Start the server
npm start

# 4. Open browser at
http://localhost:3000
```

---

## Project Structure

```
restaurant-app/
├── backend/
│   ├── server.js              → Node.js + Express server
│   ├── models/
│   │   ├── MenuItem.js        → Mongoose schema for menu items
│   │   └── Order.js           → Mongoose schema for orders (nested documents)
│   └── routes/
│       ├── menu.js            → API routes for menu CRUD
│       └── orders.js          → API routes for orders
├── frontend/
│   ├── index.html             → Bootstrap 5 shell + Vue 3 CDN
│   └── app.js                 → All Vue components + Router
├── seed.js                    → Populates MongoDB with sample data
└── package.json
```

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Menu | Browse all items by category |
| `/cart` | Cart | Review items, adjust quantities, place order |
| `/orders` | Order History | View all past orders |
| `/admin` | Admin Panel | Add / Edit / Delete menu items |

---

---

# UNIT IV — Bootstrap & Vue.js

---

## Bootstrap

### Introduction to Bootstrap
Bootstrap 5 is loaded via CDN in `frontend/index.html`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```
No installation needed — Bootstrap is pulled directly from the internet. This gives access to all Bootstrap CSS classes and JavaScript components out of the box.

---

### Bootstrap Grid
**File:** `frontend/app.js` — MenuPage component

The menu items are displayed in a **responsive grid** using Bootstrap's grid system:
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
  <div v-for="item in filteredItems" class="col">
    ...
  </div>
</div>
```
- `row-cols-1` → 1 column on mobile
- `row-cols-md-2` → 2 columns on tablet
- `row-cols-lg-3` → 3 columns on desktop
- `g-4` → gap/gutter between cards

The Admin Panel also uses a two-column grid:
```html
<div class="row g-4">
  <div class="col-lg-4"> <!-- Form --> </div>
  <div class="col-lg-8"> <!-- Table --> </div>
</div>
```

---

### Bootstrap Components

Every major Bootstrap component is used across the app:

| Component | Where Used | Code Class |
|---|---|---|
| **Navbar** | Top navigation bar with brand, links, cart badge | `navbar`, `navbar-expand-lg`, `navbar-dark` |
| **Cards** | Each menu item displayed as a card | `card`, `card-body`, `card-title` |
| **Badge** | Category label on each menu card, cart item count, order status | `badge`, `bg-success`, `bg-warning` |
| **Buttons** | Add to Cart, Place Order, Edit, Delete, filter tabs | `btn`, `btn-warning`, `btn-outline-danger` |
| **Table** | Cart items table, Admin items table, Order breakdown | `table`, `table-hover`, `table-sm` |
| **Accordion** | Order History — each order expands/collapses | `accordion`, `accordion-item`, `accordion-collapse` |
| **Spinner** | Loading indicator while fetching data | `spinner-border` |
| **Toast** | "Added to cart!" success notification | `toast`, `toast-body` |
| **Modal** | Confirm before delete (browser confirm used) | — |

---

## Vue.js

### Introduction
Vue 3 is loaded via CDN — no Vite or npm required for the frontend:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
```

---

### Instance and Template Syntax
**File:** `frontend/app.js` — bottom of file

The Vue application instance is created with `createApp()` and mounted on the `#app` div:
```js
const app = createApp({
  setup() {
    const toastMessage = ref('');
    const cartCountVal = computed(() => cartCount());
    return { cartCount: cartCountVal, toastMessage };
  }
});
app.use(router);
app.mount('#app');
```

Template syntax `{{ }}` is used throughout `index.html` and component templates to render data:
```html
<span class="badge bg-warning text-dark ms-1">{{ cartCount }}</span>
<span class="price-tag">{{ formatPrice(item.price) }}</span>
<div class="toast-body">{{ toastMessage }}</div>
```

---

### Directives
**File:** `frontend/app.js` — all page components

All major Vue directives are used:

**`v-for`** — Renders a list of items by looping over an array:
```html
<!-- Renders every menu item as a card -->
<div v-for="item in filteredItems" :key="item._id" class="col">

<!-- Renders every cart row -->
<tr v-for="item in cart" :key="item._id">

<!-- Renders every order in history -->
<div v-for="(order, idx) in orders" :key="order._id">

<!-- Renders items inside each order (nested v-for) -->
<tr v-for="item in order.items" :key="item.name">
```

**`v-if` / `v-else`** — Conditionally shows/hides elements:
```html
<!-- Show spinner while loading -->
<div v-if="loading">...</div>

<!-- Show empty state if no items -->
<div v-else-if="filteredItems.length === 0">No items</div>

<!-- Show grid otherwise -->
<div v-else class="row ...">
```

**`v-bind` (`:`)** — Dynamically binds HTML attributes:
```html
<!-- Dynamically sets badge colour class based on category -->
<span class="badge" :class="badgeClass(item.category)">

<!-- Binds accordion target ID dynamically -->
:data-bs-target="'#order-' + order._id"

<!-- Disables button while order is being placed -->
<button :disabled="placing">
```

**`v-show`** — Used for the cancel button in Admin (shows only when editing):
```html
<button v-if="editingId" type="button" @click="cancelEdit">Cancel</button>
```

---

### Components and Props
**File:** `frontend/app.js`

The app is split into four single-file-style components, each defined as a plain object with a `template` and `setup()`:

```js
const MenuPage = { template: `...`, setup() { ... } };
const CartPage = { template: `...`, setup() { ... } };
const OrdersPage = { template: `...`, setup() { ... } };
const AdminPage = { template: `...`, setup() { ... } };
```

These components are registered with Vue Router and rendered via `<router-view>` in `index.html`. Shared state (the cart array) acts as shared props across components — all components read and write to the same `cart` reactive array defined at the module level.

---

### Events
**File:** `frontend/app.js`

Vue event handling with `@event` (shorthand for `v-on:event`) is used throughout:

```html
<!-- Calls handleAddToCart when button is clicked -->
<button @click="handleAddToCart(item)">Add</button>

<!-- Calls placeOrder when Place Order is clicked -->
<button @click="placeOrder">Place Order</button>

<!-- Calls deleteItem with the item's ID -->
<button @click="deleteItem(item._id)">Delete</button>

<!-- Calls startEdit to pre-fill the form -->
<button @click="startEdit(item)">Edit</button>

<!-- Calls increment / decrement for quantity control -->
<button @click="increment(item)">+</button>
<button @click="decrement(item)">-</button>
```

---

### Event Modifiers
**File:** `frontend/app.js` — AdminPage component

The `.prevent` event modifier is used on the Admin form to stop the default browser form submission and handle it with Vue instead:
```html
<form @submit.prevent="submitForm">
```
Without `.prevent`, the browser would reload the page on submit. This is the standard Vue pattern for handling forms via JavaScript.

---

### Forms and Two-way Binding
**File:** `frontend/app.js` — CartPage and AdminPage components

`v-model` creates two-way data binding — the variable updates when the input changes, and the input updates when the variable changes.

**Cart page** — quantity input stays in sync with the cart item's quantity:
```html
<input type="number" v-model.number="item.quantity" min="1" />
```
`.number` modifier automatically converts the input string to a number.

**Admin page** — all form fields are bound with `v-model`:
```html
<input type="text"   v-model="form.name" />
<textarea            v-model="form.description"></textarea>
<input type="number" v-model.number="form.price" />
<select              v-model="form.category">...</select>
<input type="checkbox" v-model="form.available" />
```
When the user clicks **Edit** on a menu item, `startEdit()` populates the `form` reactive object, and all inputs instantly reflect the item's data — this is two-way binding in action.

---

### Routing
**File:** `frontend/app.js` — router section

Vue Router 4 is used to create a Single Page Application with 4 routes:
```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        component: MenuPage },
    { path: '/cart',    component: CartPage },
    { path: '/orders',  component: OrdersPage },
    { path: '/admin',   component: AdminPage }
  ]
});
```

Navigation links use `<router-link>` instead of `<a>` tags so the page doesn't reload:
```html
<router-link class="nav-link" to="/">Menu</router-link>
<router-link class="nav-link" to="/cart">Cart</router-link>
```

After placing an order, `router.push('/orders')` programmatically navigates the user to Order History.

---

### Connecting Vue.js with Databases
**File:** `frontend/app.js` — all page components

Vue fetches data from the Node.js backend using the browser's built-in `fetch()` API. The backend talks to MongoDB. This connects Vue directly to the database.

**Fetching menu items on page load:**
```js
onMounted(async () => {
  const res = await fetch('/api/menu');
  menuItems.value = await res.json();
});
```

**Posting an order to the database:**
```js
const res = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

**Admin CRUD via fetch:**
```js
// Add
fetch('/api/menu', { method: 'POST', body: JSON.stringify(form) });

// Update
fetch(`/api/menu/${id}`, { method: 'PUT', body: JSON.stringify(form) });

// Delete
fetch(`/api/menu/${id}`, { method: 'DELETE' });
```

---

---

# UNIT V — Node.js & MongoDB

---

## Node.js

### Introduction
Node.js allows JavaScript to run on the server side (outside the browser). This project uses Node.js to run the Express web server that handles API requests and serves the frontend files.

### Server Creation
**File:** `backend/server.js`

The server is created using **Express**, a Node.js framework:
```js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());                              // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

app.use('/api/menu',   require('./routes/menu'));     // Mount menu routes
app.use('/api/orders', require('./routes/orders'));   // Mount order routes

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

The server:
- Listens on **port 3000**
- Serves all frontend HTML/JS files as static assets
- Exposes REST API endpoints under `/api/`
- Connects to MongoDB using Mongoose before starting

---

## MongoDB

### Introduction
MongoDB is a NoSQL document database. Instead of rows and columns (like SQL), data is stored as **JSON-like documents** inside collections. This project uses two collections: `menuItems` and `orders`.

### Importance of NoSQL Databases
- **Flexible schema** — menu items can have different fields without breaking the database
- **JSON-native** — data flows naturally from MongoDB → Node.js → Vue.js without conversion
- **Nested documents** — an order's items are stored inside the order document itself, not in a separate table (no JOINs needed)
- **Scalable** — handles large volumes of unstructured or semi-structured data efficiently

---

### Data Types
**File:** `backend/models/MenuItem.js` and `backend/models/Order.js`

MongoDB data types used in this project via Mongoose schemas:

| Field | Data Type | Where |
|---|---|---|
| `name` | String | MenuItem, Order items |
| `description` | String | MenuItem |
| `price` | Number | MenuItem, Order items |
| `category` | String (enum) | MenuItem |
| `available` | Boolean | MenuItem |
| `quantity` | Number | Order items |
| `total` | Number | Order |
| `placedAt` | Date | Order |
| `status` | String | Order |
| `_id` | ObjectId | Auto-generated on all documents |

---

### Documents
**File:** `backend/models/MenuItem.js`

Each menu item is stored as a MongoDB document:
```js
const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true, enum: ['Starters', 'Mains', 'Desserts', 'Drinks'] },
  available:   { type: Boolean, default: true }
});
```

A sample document stored in MongoDB looks like:
```json
{
  "_id": "ObjectId('...')",
  "name": "Margherita Pizza",
  "description": "Classic tomato and mozzarella",
  "price": 299,
  "category": "Mains",
  "available": true
}
```

---

### Nested Documents
**File:** `backend/models/Order.js`

The `orders` collection uses **nested documents** — each order contains an array of item sub-documents embedded directly inside it:
```js
const orderItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  placedAt: { type: Date,   default: Date.now },
  status:   { type: String, default: 'confirmed' },
  items:    [orderItemSchema],   // ← Array of nested sub-documents
  total:    { type: Number, required: true }
});
```

A sample order document with nested items:
```json
{
  "_id": "ObjectId('...')",
  "placedAt": "2024-01-15T10:30:00Z",
  "status": "confirmed",
  "items": [
    { "name": "Margherita Pizza", "price": 299, "quantity": 2 },
    { "name": "Coke",             "price": 60,  "quantity": 1 }
  ],
  "total": 658
}
```
The `items` array is a nested document array — no separate collection or JOIN is needed.

---

### CRUD Operations
**Files:** `backend/routes/menu.js`, `backend/routes/orders.js`

Full CRUD is implemented on the `menuItems` collection:

**CREATE** — `POST /api/menu` — Adds a new menu item:
```js
router.post('/', async (req, res) => {
  const item = new MenuItem(req.body);
  const saved = await item.save();        // INSERT into MongoDB
  res.status(201).json(saved);
});
```

**READ** — `GET /api/menu` — Fetches all menu items:
```js
router.get('/', async (req, res) => {
  const items = await MenuItem.find();    // SELECT * FROM menuItems
  res.json(items);
});
```

**UPDATE** — `PUT /api/menu/:id` — Updates a menu item by ID:
```js
router.put('/:id', async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  res.json(updated);
});
```

**DELETE** — `DELETE /api/menu/:id` — Deletes a menu item by ID:
```js
router.delete('/:id', async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});
```

---

### Basic Cursor Methods
**File:** `backend/routes/orders.js`

Mongoose wraps MongoDB's cursor methods. The following are used:

**`.sort()`** — Orders results by `placedAt` descending (newest first):
```js
const orders = await Order.find().sort({ placedAt: -1 });
```

**`.limit()`** — Caps the result to 50 orders maximum:
```js
const orders = await Order.find().sort({ placedAt: -1 }).limit(50);
```

Other cursor methods available in MongoDB (used in the seed/model layer):

**`.find()`** — Returns a cursor over all matching documents (equivalent to `forEach`/`toArray`):
```js
await MenuItem.find()           // Returns all documents
await MenuItem.find({ category: 'Mains' })  // Filtered
```

**`.countDocuments()`** — Counts matching documents (equivalent to `.count()`):
```js
await MenuItem.countDocuments()  // Total number of menu items
```

**`.toArray()`** — Mongoose's `.find()` returns a promise that resolves to an array — equivalent to calling `.toArray()` on a raw MongoDB cursor:
```js
const items = await MenuItem.find();  // Already resolves as an array
```

**`.pretty()`** — Used in MongoDB shell for formatted output during development. In this project, `res.json()` in Express serves the same purpose — it pretty-prints JSON to the API response.

**`.forEach()`** — Used in `seed.js` implicitly via `insertMany()`, which iterates over each item in the array and inserts them one by one into MongoDB:
```js
await MenuItem.insertMany(menuItems);  // Internally iterates (forEach) each item
```

**`.map()`** — Used in the frontend when building the order payload — maps cart items to plain objects before sending to the backend:
```js
items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))
```

---

## API Endpoints Summary

### Menu Items
| Method | Endpoint | Operation | Mongoose Method |
|---|---|---|---|
| GET | `/api/menu` | Read all items | `MenuItem.find()` |
| POST | `/api/menu` | Create new item | `new MenuItem().save()` |
| PUT | `/api/menu/:id` | Update item | `findByIdAndUpdate()` |
| DELETE | `/api/menu/:id` | Delete item | `findByIdAndDelete()` |

### Orders
| Method | Endpoint | Operation | Mongoose Method |
|---|---|---|---|
| GET | `/api/orders` | Read all orders | `Order.find().sort().limit()` |
| POST | `/api/orders` | Place new order | `new Order().save()` |

---

## Full Syllabus Coverage Map

| Syllabus Topic | Where It's Used | File |
|---|---|---|
| Bootstrap Introduction | CDN link, all UI styling | `index.html` |
| Bootstrap Grid | 3-col responsive menu grid, admin 2-col layout | `app.js` — MenuPage, AdminPage |
| Bootstrap Components | Navbar, Cards, Badges, Buttons, Table, Accordion, Toast, Spinner | `index.html`, `app.js` |
| Vue Introduction | Vue 3 via CDN, `createApp()`, `mount('#app')` | `index.html`, `app.js` |
| Vue Instance & Template Syntax | `createApp`, `setup()`, `{{ }}` bindings | `app.js` — root app |
| Vue Directives | `v-for`, `v-if`, `v-else`, `v-bind`, `v-show` | `app.js` — all pages |
| Vue Components & Props | MenuPage, CartPage, OrdersPage, AdminPage components | `app.js` |
| Vue Events | `@click` on all buttons | `app.js` — all pages |
| Event Modifiers | `@submit.prevent` on Admin form | `app.js` — AdminPage |
| Forms & Two-way Binding | `v-model` on cart qty, all admin form fields | `app.js` — CartPage, AdminPage |
| Vue Routing | 4 routes, `<router-link>`, `router.push()` | `app.js` — router section |
| Vue + Database | `fetch()` to backend API, reactive data updates | `app.js` — all pages |
| Node.js Introduction | JavaScript runtime powering the backend server | `backend/server.js` |
| Node.js Server Creation | Express app, `app.listen()`, middleware, static files | `backend/server.js` |
| MongoDB Introduction | NoSQL document store via Mongoose | `backend/models/` |
| Importance of NoSQL | Flexible schema, JSON-native, nested docs, no JOINs | `backend/models/Order.js` |
| Data Types | String, Number, Boolean, Date, ObjectId, Array | `backend/models/MenuItem.js`, `Order.js` |
| Documents | MenuItem documents in `menuItems` collection | `backend/models/MenuItem.js` |
| Nested Documents | `items` array of sub-documents inside each Order | `backend/models/Order.js` |
| CRUD Operations | Full create/read/update/delete on menuItems | `backend/routes/menu.js` |
| Cursor — `.sort()` | Orders sorted by date descending | `backend/routes/orders.js` |
| Cursor — `.limit()` | Orders capped at 50 results | `backend/routes/orders.js` |
| Cursor — `.find()` | All read queries | `backend/routes/menu.js`, `orders.js` |
| Cursor — `.toArray()` | Mongoose `.find()` resolves to array | `backend/routes/menu.js` |
| Cursor — `.count()` | `countDocuments()` available on all models | `backend/models/` |
| Cursor — `.forEach()` | `insertMany()` in seed iterates each item | `seed.js` |
| Cursor — `.map()` | Cart items mapped before POST to orders API | `app.js` — CartPage |
| Cursor — `.pretty()` | `res.json()` in Express formats output | `backend/routes/` |
