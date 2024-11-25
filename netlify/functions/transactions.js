const mongoose = require('mongoose');
const Transaction = require('../../src/models/Transaction');
const Person = require('../../src/models/Person');
const connectDB = require('../../src/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();

    if (event.httpMethod === 'GET') {
      const { personName } = event.queryStringParameters || {};
      let query = {};
      if (personName) {
        const person = await Person.findOne({ name: personName });
        if (person) {
          query.person = person._id;
        }
      }
      const transactions = await Transaction.find(query).populate('person');
      return {
        statusCode: 200,
        body: JSON.stringify(transactions)
      };
    } else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const transaction = new Transaction(data);
      const newTransaction = await transaction.save();
      return {
        statusCode: 201,
        body: JSON.stringify(newTransaction)
      };
    } else if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      await Transaction.findByIdAndDelete(id);
      return {
        statusCode: 204,
        body: ''
      };
    }

    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' })
    };
  }
};
