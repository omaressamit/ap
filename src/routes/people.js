
const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// Get all people
router.get('/', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new person or delete a person
router.post('/:id?', async (req, res) => {
  if (req.params.id && req.body.action === 'delete') {
    // Delete a person
    try {
      const person = await Person.findByIdAndDelete(req.params.id);
      if (!person) {
        return res.status(404).json({ message: 'Person not found' });
      }
      res.json({ message: 'Person deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // Add a new person
    const person = new Person({
      name: req.body.name,
      jobTitle: req.body.jobTitle
    });

    try {
      const newPerson = await person.save();
      res.status(201).json(newPerson);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

module.exports = router;
