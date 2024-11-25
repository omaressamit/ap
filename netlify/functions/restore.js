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
    const backupData = JSON.parse(event.body);

    // Clear existing data
    await Settings.deleteMany({});
    await Person.deleteMany({});
    await Transaction.deleteMany({});

    // Restore data from backup
    if (backupData.settings) await Settings.insertMany(backupData.settings);
    if (backupData.people) await Person.insertMany(backupData.people);
    if (backupData.transactions) await Transaction.insertMany(backupData.transactions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data restored successfully' })
    };
  } catch (error) {
    console.error('Restore error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Server Error', details: error.message }) 
    };
  }
};
