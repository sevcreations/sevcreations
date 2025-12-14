const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================================
// --- DATABASE CONNECTION (CLOUD) ---
// =============================================================

// ✅ CONNECTION STRING (Password: dress123)
const connectionString = 'mongodb+srv://sevcreations:dress123@sevcreations.7pzdg1y.mongodb.net/sev_creations?retryWrites=true&w=majority';

mongoose.connect(connectionString)
.then(() => console.log('✅ Connected to CLOUD Database (Atlas)'))
.catch(err => {
    console.log('❌ Cloud Connection Error:', err.codeName || err.code);
    console.log('   (Message: ' + err.message + ')');
});


// =============================================================
// --- SCHEMAS ---
// =============================================================

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    subCategory: String,
    image: String,
    description: String
});
const Product = mongoose.model('Product', ProductSchema);

// Contact Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);


// =============================================================
// --- ROUTES ---
// =============================================================

// Test Route
app.get('/', (req, res) => {
    res.send('Backend Running!');
});

// ADD PRODUCT
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        console.log("✅ Product Saved:", newProduct.name);
        res.status(201).json({ success: true, message: "Product Added!" });
    } catch (error) {
        console.error("❌ Save Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        console.log(`📤 Sending ${products.length} products`);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// SAVE CONTACT
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});