const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerece', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobileNumber: String,
    dob: Date,
    gender: String,
    password: String,
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); app.use(express.static('public'));
app.use(session({
    secret: 'your_session_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware for token verification (for protected routes)
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.redirect('/products');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/products');
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Home page
});
app.get('/index', (req, res) => {
    res.render('index'); // Home page
});
app.get('/registration', (req, res) => {
    res.render('registration'); // Registration page
});

app.get('/login', (req, res) => {
    res.render('login'); // Login products page
});

app.get('/profile', authenticateToken, (req, res) => {
    res.render('profile'); // Profile page
});
app.get('/products', authenticateToken, (req, res) => {
    res.render('products'); // Profile page
});

// User Registration Route
app.post('/registration', async (req, res) => {
    const { name, email, mobileNumber, dob, gender, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, mobileNumber, dob, gender, password: hashedPassword });
        await user.save();
        res.redirect('/loginproducts'); // Redirect to login page after registration
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('Email already exists. Please use a different email.');
        } else {
            console.error('Error saving user to database:', error.message);
            res.status(400).send('Error saving user to database.');
        }
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
