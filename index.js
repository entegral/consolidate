const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2'
});
const docClient = new AWS.DynamoDB.DocumentClient();
process.env.TABLE = 'consolidate';
process.env.REGION = 'us-west-2';

const { 
  register
} = require('./src/Routes');

api.post(
  '/register',
  (event) => { return register.bind(null, event, docClient); },
  {
    apiKeyRequired: true,
    error: { code: 500 },
    success: { contentType: 'application/json' }
  }
);

module.exports = api;

