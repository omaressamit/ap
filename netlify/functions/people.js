const mongoose = require('mongoose');
const Person = require('../../src/models/Person');
const connectDB = require('../../src/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();

    if (event.httpMethod === 'GET') {
      const people = await Person.find();
      return {
        statusCode: 200,
        body: JSON.stringify(people)
      };
    } else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const person = new Person(data);
      const newPerson = await person.save();
      return {
        statusCode: 201,
        body: JSON.stringify(newPerson)
      };
    } else if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      await Person.findByIdAndDelete(id);
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
