const connectDB = require('../../src/db');
const Settings = require('../../src/models/Settings');
const Person = require('../../src/models/Person');
const Transaction = require('../../src/models/Transaction');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectDB();
    const settings = await Settings.find();
    const people = await Person.find();
    const transactions = await Transaction.find();

    const backup = { settings, people, transactions };

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Backup created successfully', data: backup })
    };
  } catch (error) {
    console.error('Backup error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Server Error', details: error.message }) 
    };
  }
};
