const { createApp, ref, computed, onMounted, reactive } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// ── Shared cart state (module-level so all components share it) ────────────
const cart = reactive([]);

function cartCount() {
  return cart.reduce((s, i) => s + i.quantity, 0);
}

function addToCart(item) {
  const existing = cart.find(c => c._id === item._id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
}

function removeFromCart(id) {
  const idx = cart.findIndex(c => c._id === id);
  if (idx !== -1) cart.splice(idx, 1);
}

function clearCart() {
  cart.splice(0, cart.length);
}

// ── Utility ────────────────────────────────────────────────────────────────
function formatPrice(p) {
  return '₹' + Number(p).toLocaleString('en-IN');
}

function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Category badge colours ─────────────────────────────────────────────────
const categoryColour = {
  Starters: 'bg-success',
  Mains: 'bg-primary',
  Desserts: 'bg-danger',
  Drinks: 'bg-info text-dark'
};

// ═══════════════════════════════════════════════════════════════════════════
// MENU PAGE
// ═══════════════════════════════════════════════════════════════════════════
const MenuPage = {
  template: `
  <div>
    <div class="page-header">
      <div class="container text-center">
        <h1 class="fw-bold mb-1"><i class="bi bi-card-list me-2"></i>Our Menu</h1>
        <p class="mb-0 opacity-75">Fresh ingredients, bold flavours</p>
      </div>
    </div>

    <div class="container pb-5">
      <!-- Category filter -->
      <div class="d-flex flex-wrap gap-2 justify-content-center mb-4">
        <button v-for="cat in categories" :key="cat"
          class="btn filter-btn"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat">
          {{ cat }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Loading menu…</p>
      </div>

      <!-- No items -->
      <div v-else-if="filteredItems.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-emoji-frown fs-1"></i>
        <p class="mt-2">No items in this category yet.</p>
      </div>

      <!-- Grid -->
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="item in filteredItems" :key="item._id" class="col">
          <div class="card menu-card h-100">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-semibold mb-0">{{ item.name }}</h5>
                <span class="badge category-badge ms-2" :class="badgeClass(item.category)">{{ item.category }}</span>
              </div>
              <p class="card-text text-muted flex-grow-1 small">{{ item.description }}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="price-tag">{{ formatPrice(item.price) }}</span>
                <button class="btn btn-sm btn-warning fw-semibold" @click="handleAddToCart(item)">
                  <i class="bi bi-cart-plus me-1"></i>Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  setup() {
    const menuItems = ref([]);
    const loading = ref(true);
    const activeCategory = ref('All');
    const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

    const filteredItems = computed(() =>
      activeCategory.value === 'All'
        ? menuItems.value
        : menuItems.value.filter(i => i.category === activeCategory.value)
    );

    function badgeClass(cat) {
      return categoryColour[cat] || 'bg-secondary';
    }

    function handleAddToCart(item) {
      addToCart(item);
      window.__showToast(`${item.name} added to cart!`);
    }

    onMounted(async () => {
      const res = await fetch('/api/menu');
      menuItems.value = await res.json();
      loading.value = false;
    });

    return { menuItems, loading, activeCategory, categories, filteredItems, badgeClass, handleAddToCart, formatPrice };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════════════
const CartPage = {
  template: `
  <div>
    <div class="page-header">
      <div class="container text-center">
        <h1 class="fw-bold mb-1"><i class="bi bi-cart3 me-2"></i>Your Cart</h1>
        <p class="mb-0 opacity-75">Review your order before placing it</p>
      </div>
    </div>

    <div class="container pb-5">
      <!-- Empty cart -->
      <div v-if="cart.length === 0" class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <h4 class="mt-3 text-muted">Your cart is empty</h4>
        <router-link to="/" class="btn btn-warning mt-3 fw-semibold">
          <i class="bi bi-arrow-left me-1"></i>Browse Menu
        </router-link>
      </div>

      <div v-else class="row g-4">
        <!-- Cart items -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <table class="table mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Item</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-end">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cart" :key="item._id">
                    <td>
                      <div class="fw-semibold">{{ item.name }}</div>
                      <div class="text-muted small">{{ formatPrice(item.price) }} each</div>
                    </td>
                    <td class="text-center">
                      <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-outline-secondary qty-btn" @click="decrement(item)">
                          <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control form-control-sm text-center"
                          style="width:56px" v-model.number="item.quantity" min="1" />
                        <button class="btn btn-outline-secondary qty-btn" @click="increment(item)">
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="text-end fw-semibold">{{ formatPrice(item.price * item.quantity) }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-danger" @click="removeFromCart(item._id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="col-lg-4">
          <div class="cart-total-box p-4">
            <h5 class="fw-bold mb-3">Order Summary</h5>
            <div class="d-flex justify-content-between mb-2 text-muted">
              <span>Items ({{ cartCount }})</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <hr />
            <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total</span>
              <span class="price-tag">{{ formatPrice(subtotal) }}</span>
            </div>
            <button class="btn btn-warning w-100 fw-semibold mb-2" @click="placeOrder" :disabled="placing">
              <span v-if="placing" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-1"></i>
              {{ placing ? 'Placing Order…' : 'Place Order' }}
            </button>
            <button class="btn btn-outline-secondary w-100" @click="clearCart">
              <i class="bi bi-x-circle me-1"></i>Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  setup() {
    const placing = ref(false);
    const router = VueRouter.useRouter();

    const subtotal = computed(() => cart.reduce((s, i) => s + i.price * i.quantity, 0));
    const cartCountVal = computed(() => cartCount());

    function increment(item) { item.quantity++; }
    function decrement(item) {
      if (item.quantity > 1) item.quantity--;
      else removeFromCart(item._id);
    }

    async function placeOrder() {
      if (cart.length === 0) return;
      placing.value = true;
      const payload = {
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: subtotal.value
      };
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          clearCart();
          window.__showToast('Order placed successfully!');
          router.push('/orders');
        }
      } finally {
        placing.value = false;
      }
    }

    return { cart, cartCount: cartCountVal, subtotal, placing, placeOrder, increment, decrement, removeFromCart, clearCart, formatPrice };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════════════════════════════════════════
const OrdersPage = {
  template: `
  <div>
    <div class="page-header">
      <div class="container text-center">
        <h1 class="fw-bold mb-1"><i class="bi bi-clock-history me-2"></i>Order History</h1>
        <p class="mb-0 opacity-75">All your past orders in one place</p>
      </div>
    </div>

    <div class="container pb-5">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Loading orders…</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-5">
        <i class="bi bi-bag-x fs-1 text-muted"></i>
        <h4 class="mt-3 text-muted">No orders yet</h4>
        <router-link to="/" class="btn btn-warning mt-3 fw-semibold">Start Ordering</router-link>
      </div>

      <div v-else class="accordion" id="ordersAccordion">
        <div v-for="(order, idx) in orders" :key="order._id" class="accordion-item order-card mb-3 border-0 shadow-sm overflow-hidden">
          <h2 class="accordion-header">
            <button class="accordion-button" :class="{ collapsed: idx !== 0 }"
              type="button" data-bs-toggle="collapse"
              :data-bs-target="'#order-' + order._id"
              :aria-expanded="idx === 0">
              <div class="d-flex justify-content-between align-items-center w-100 me-3 flex-wrap gap-2">
                <div>
                  <span class="fw-semibold">Order #{{ order._id.slice(-6).toUpperCase() }}</span>
                  <span class="text-muted small ms-3">{{ formatDate(order.placedAt) }}</span>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <span class="badge bg-success">{{ order.status }}</span>
                  <span class="price-tag">{{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </button>
          </h2>
          <div :id="'order-' + order._id" class="accordion-collapse collapse" :class="{ show: idx === 0 }" data-bs-parent="#ordersAccordion">
            <div class="accordion-body">
              <table class="table table-sm mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Price</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatPrice(item.price) }}</td>
                    <td class="text-end fw-semibold">{{ formatPrice(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Total</td>
                    <td class="text-end fw-bold price-tag">{{ formatPrice(order.total) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  setup() {
    const orders = ref([]);
    const loading = ref(true);

    onMounted(async () => {
      const res = await fetch('/api/orders');
      orders.value = await res.json();
      loading.value = false;
    });

    return { orders, loading, formatDate, formatPrice };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
const AdminPage = {
  template: `
  <div>
    <div class="page-header">
      <div class="container text-center">
        <h1 class="fw-bold mb-1"><i class="bi bi-gear me-2"></i>Admin Panel</h1>
        <p class="mb-0 opacity-75">Manage your menu items</p>
      </div>
    </div>

    <div class="container pb-5">
      <div class="row g-4">

        <!-- Add / Edit Form -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header fw-semibold" style="background: #92400e; color: white;">
              <i class="bi" :class="editingId ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
              {{ editingId ? ' Edit Item' : ' Add New Item' }}
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Name</label>
                  <input type="text" class="form-control" v-model="form.name" required placeholder="e.g. Caesar Salad" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea class="form-control" v-model="form.description" required rows="2" placeholder="Short description"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Price (₹)</label>
                  <input type="number" class="form-control" v-model.number="form.price" required min="1" placeholder="e.g. 249" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Category</label>
                  <select class="form-select" v-model="form.category" required>
                    <option value="" disabled>Select category</option>
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="availableCheck" v-model="form.available" />
                  <label class="form-check-label" for="availableCheck">Available</label>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-warning fw-semibold flex-grow-1" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                    {{ editingId ? 'Update Item' : 'Add Item' }}
                  </button>
                  <button v-if="editingId" type="button" class="btn btn-outline-secondary" @click="cancelEdit">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header fw-semibold d-flex justify-content-between align-items-center" style="background: #92400e; color: white;">
              <span><i class="bi bi-list-ul me-1"></i>All Menu Items ({{ menuItems.length }})</span>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-warning"></div>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover mb-0 align-middle admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th class="text-end">Price</th>
                      <th class="text-center">Available</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in menuItems" :key="item._id">
                      <td>
                        <div class="fw-semibold">{{ item.name }}</div>
                        <div class="text-muted small">{{ item.description }}</div>
                      </td>
                      <td><span class="badge" :class="badgeClass(item.category)">{{ item.category }}</span></td>
                      <td class="text-end fw-semibold">{{ formatPrice(item.price) }}</td>
                      <td class="text-center">
                        <i class="bi" :class="item.available ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
                      </td>
                      <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary me-1" @click="startEdit(item)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteItem(item._id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  `,
  setup() {
    const menuItems = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const editingId = ref(null);
    const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

    const blankForm = () => ({ name: '', description: '', price: '', category: '', available: true });
    const form = reactive(blankForm());

    function badgeClass(cat) {
      return categoryColour[cat] || 'bg-secondary';
    }

    async function loadItems() {
      const res = await fetch('/api/menu');
      menuItems.value = await res.json();
      loading.value = false;
    }

    function startEdit(item) {
      editingId.value = item._id;
      Object.assign(form, { name: item.name, description: item.description, price: item.price, category: item.category, available: item.available });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEdit() {
      editingId.value = null;
      Object.assign(form, blankForm());
    }

    async function submitForm() {
      saving.value = true;
      try {
        const url = editingId.value ? `/api/menu/${editingId.value}` : '/api/menu';
        const method = editingId.value ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form })
        });
        if (res.ok) {
          await loadItems();
          window.__showToast(editingId.value ? 'Item updated!' : 'Item added!');
          cancelEdit();
        }
      } finally {
        saving.value = false;
      }
    }

    async function deleteItem(id) {
      if (!confirm('Delete this item?')) return;
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      await loadItems();
      window.__showToast('Item deleted.');
    }

    onMounted(loadItems);

    return { menuItems, loading, saving, editingId, form, categories, badgeClass, startEdit, cancelEdit, submitForm, deleteItem, formatPrice };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════════════════
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MenuPage },
    { path: '/cart', component: CartPage },
    { path: '/orders', component: OrdersPage },
    { path: '/admin', component: AdminPage }
  ]
});

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
const app = createApp({
  setup() {
    const toastMessage = ref('');
    const cartCountVal = computed(() => cartCount());

    window.__showToast = function(msg) {
      toastMessage.value = msg;
      const el = document.getElementById('liveToast');
      if (el) {
        const toast = bootstrap.Toast.getOrCreateInstance(el, { delay: 2500 });
        toast.show();
      }
    };

    return { cartCount: cartCountVal, toastMessage };
  }
});

app.use(router);
app.mount('#app');
