// One-off seed script: run with `node seed.js` from backend/ after `npm run build`,
// or directly with ts-node. Seeds categories, products, and one admin user.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  // Categories
  const categories = [
    { name: 'For Boys', slug: 'for-boys', gender: 'boys' },
    { name: 'For Girls', slug: 'for-girls', gender: 'girls' },
  ];
  for (const c of categories) {
    await db.collection('categories').updateOne(
      { slug: c.slug },
      { $set: c, $setOnInsert: { createdAt: new Date() }, $currentDate: { updatedAt: true } },
      { upsert: true },
    );
  }
  console.log('Categories seeded');

  // Products
  const products = [
    {
      name: 'Shanu Noir', slug: 'shanu-noir', gender: 'boys', price: 4500,
      description: 'A bold, smoky signature scent for the modern man.',
      images: ['/products/shanu-noir-dark.jpg'], notes: ['Oud', 'Black Pepper', 'Amber'],
      size: '100ml', stock: 25, rating: 0, reviewCount: 0,
    },
    {
      name: 'Rasko', slug: 'rasko', gender: 'boys', price: 3800,
      description: 'Fresh and energetic, built for everyday confidence.',
      images: [], notes: ['Citrus', 'Vetiver', 'Musk'],
      size: '100ml', stock: 18, rating: 0, reviewCount: 0,
    },
    {
      name: 'ÉLITE', slug: 'elite', gender: 'boys', price: 5200,
      description: 'A premium statement scent for those who lead.',
      images: [], notes: ['Leather', 'Sandalwood', 'Bergamot'],
      size: '100ml', stock: 12, rating: 0, reviewCount: 0,
    },
    {
      name: 'ZAYNAR', slug: 'zaynar', gender: 'boys', price: 4200,
      description: 'Warm and daring, a scent that commands attention.',
      images: [], notes: ['Spice', 'Cedarwood', 'Tobacco'],
      size: '100ml', stock: 20, rating: 0, reviewCount: 0,
    },
    {
      name: 'Bloom', slug: 'bloom', gender: 'girls', price: 4800,
      description: 'A soft floral bouquet that blooms all day long.',
      images: ['/products/bloom.jpg'], notes: ['Jasmine', 'Rose', 'Vanilla'],
      size: '100ml', stock: 22, rating: 0, reviewCount: 0,
    },
  ];
  for (const p of products) {
    await db.collection('products').updateOne(
      { slug: p.slug },
      { $set: p, $setOnInsert: { createdAt: new Date() }, $currentDate: { updatedAt: true } },
      { upsert: true },
    );
  }
  console.log('Products seeded');

  // Admin user
  const adminEmail = 'admin@ysrfragrances.com';
  const adminPassword = 'Admin@123';
  const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await db.collection('users').insertOne({
      name: 'YSR Admin',
      email: adminEmail,
      phone: '03000000000',
      password: hashed,
      role: 'admin',
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
