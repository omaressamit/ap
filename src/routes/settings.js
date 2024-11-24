
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Get settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ initialBalance: 0, companyName: 'شركة الشريف' });
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update settings
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings.initialBalance = req.body.initialBalance || settings.initialBalance;
            settings.companyName = req.body.companyName || settings.companyName;
        } else {
            settings = new Settings({
                initialBalance: req.body.initialBalance,
                companyName: req.body.companyName
            });
        }
        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Backup data
router.get('/backup', async (req, res) => {
    try {
        const settings = await Settings.find();
        const transactions = await Transaction.find();
        const backupData = { settings, transactions };
        const backupPath = path.join(__dirname, '..', '..', 'backup.json');
        fs.writeFileSync(backupPath, JSON.stringify(backupData));
        res.download(backupPath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Restore data
router.post('/restore', upload.single('backup'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const backupData = JSON.parse(fs.readFileSync(req.file.path));
        await Settings.deleteMany({});
        await Transaction.deleteMany({});
        await Settings.insertMany(backupData.settings);
        await Transaction.insertMany(backupData.transactions);
        fs.unlinkSync(req.file.path); // Delete the uploaded file
        res.json({ message: 'Data restored successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reset balances
router.post('/reset-balances', async (req, res) => {
    try {
        await Transaction.deleteMany({});
        let settings = await Settings.findOne();
        if (settings) {
            settings.initialBalance = 0;
            await settings.save();
        }
        res.json({ message: 'Balances reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
