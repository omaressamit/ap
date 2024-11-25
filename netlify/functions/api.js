
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  initialBalance: Number
});

// Define models
const Transaction = mongoose.model('Transaction', transactionSchema);
const Settings = mongoose.model('Settings', settingsSchema);

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Wrap the Express app with serverless
const handler = serverless(app);
module.exports = { handler };
