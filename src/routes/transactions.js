
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Person = require('../models/Person');

// Get all transactions or search by person name
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.person) {
            const persons = await Person.find({ name: { $regex: req.query.person, $options: 'i' } });
            const personIds = persons.map(person => person._id);
            query.person = { $in: personIds };
        }
        const transactions = await Transaction.find(query).populate('person');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new transaction
router.post('/', async (req, res) => {
    const transaction = new Transaction({
        person: req.body.person,
        type: req.body.type,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Generate receipt
router.post('/receipt', async (req, res) => {
    try {
        const { personId, startDate, endDate } = req.body;
        const person = await Person.findById(personId);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        const transactions = await Transaction.find({
            person: personId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).sort({ date: 1 });

        let total = 0;
        let trustTotal = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'revenue') {
                total += transaction.amount;
            } else if (transaction.type === 'expense') {
                total -= transaction.amount;
            } else if (transaction.type === 'trust_revenue') {
                trustTotal += transaction.amount;
            }
        });

        res.json({
            personName: person.name,
            transactions,
            total,
            trustTotal
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
