const mongoose = require('mongoose');
const Settings = require('../../src/models/Settings');
const connectDB = require('../../src/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();

    if (event.httpMethod === 'GET') {
      const settings = await Settings.findOne();
      return {
        statusCode: 200,
        body: JSON.stringify(settings)
      };
    } else if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      let settings = await Settings.findOne();
      if (settings) {
        settings = Object.assign(settings, data);
      } else {
        settings = new Settings(data);
      }
      const updatedSettings = await settings.save();
      return {
        statusCode: 200,
        body: JSON.stringify(updatedSettings)
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
