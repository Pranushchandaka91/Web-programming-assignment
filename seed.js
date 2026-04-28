const mongoose = require('mongoose');
const MenuItem = require('./backend/models/MenuItem');
const Order = require('./backend/models/Order');

const MONGO_URI = 'mongodb://127.0.0.1:27017/restaurant';

const menuItems = [
  { name: 'Crispy Calamari', description: 'Lightly battered squid rings with aioli dip', price: 220, category: 'Starters' },
  { name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic and basil', price: 160, category: 'Starters' },
  { name: 'Chicken Soup', description: 'Hearty chicken broth with vegetables and noodles', price: 180, category: 'Starters' },
  { name: 'Garlic Bread', description: 'Toasted baguette with herb garlic butter', price: 120, category: 'Starters' },

  { name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella and basil', price: 299, category: 'Mains' },
  { name: 'Grilled Chicken', description: 'Herb-marinated chicken breast with roasted veggies', price: 349, category: 'Mains' },
  { name: 'Pasta Arrabiata', description: 'Penne in spicy tomato sauce with fresh herbs', price: 279, category: 'Mains' },
  { name: 'Beef Burger', description: 'Juicy beef patty with lettuce, tomato and fries', price: 329, category: 'Mains' },

  { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten center', price: 180, category: 'Desserts' },
  { name: 'Tiramisu', description: 'Classic Italian coffee-flavored layered dessert', price: 160, category: 'Desserts' },
  { name: 'Vanilla Ice Cream', description: 'Two scoops of creamy vanilla with waffle cone', price: 120, category: 'Desserts' },

  { name: 'Coke', description: 'Chilled Coca-Cola, 330ml can', price: 60, category: 'Drinks' },
  { name: 'Fresh Lime Soda', description: 'Freshly squeezed lime with sparkling water', price: 80, category: 'Drinks' },
  { name: 'Mango Lassi', description: 'Thick and creamy mango yogurt drink', price: 100, category: 'Drinks' },
];

const sampleOrders = [
  {
    placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'confirmed',
    items: [
      { name: 'Margherita Pizza', price: 299, quantity: 2 },
      { name: 'Coke', price: 60, quantity: 2 }
    ],
    total: 718
  },
  {
    placedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'confirmed',
    items: [
      { name: 'Grilled Chicken', price: 349, quantity: 1 },
      { name: 'Garlic Bread', price: 120, quantity: 1 },
      { name: 'Mango Lassi', price: 100, quantity: 2 }
    ],
    total: 669
  },
  {
    placedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'confirmed',
    items: [
      { name: 'Bruschetta', price: 160, quantity: 2 },
      { name: 'Pasta Arrabiata', price: 279, quantity: 1 },
      { name: 'Chocolate Lava Cake', price: 180, quantity: 1 },
      { name: 'Fresh Lime Soda', price: 80, quantity: 1 }
    ],
    total: 859
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await MenuItem.deleteMany({});
  await Order.deleteMany({});
  console.log('Cleared existing data');

  await MenuItem.insertMany(menuItems);
  console.log(`Inserted ${menuItems.length} menu items`);

  await Order.insertMany(sampleOrders);
  console.log(`Inserted ${sampleOrders.length} sample orders`);

  await mongoose.disconnect();
  console.log('Done! Database seeded successfully.');
}

seed().catch(err => {
  console.error('Seed error:', err.message);
  process.exit(1);
});
