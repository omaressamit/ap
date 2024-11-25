const connectDB = require('../../src/db');
const Settings = require('../../src/models/Settings');
const Transaction = require('../../src/models/Transaction');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectDB();

    // Reset initial balance in settings
    const settingsResult = await Settings.updateMany({}, { $set: { initialBalance: 0 } });

    // Delete all transactions
    const transactionResult = await Transaction.deleteMany({});

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Balances reset successfully',
        settingsUpdated: settingsResult.nModified,
        transactionsDeleted: transactionResult.deletedCount
      })
    };
  } catch (error) {
    console.error('Reset balances error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Server Error', details: error.message }) 
    };
  }
};
