const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2'
});
global.docClient = new AWS.DynamoDB.DocumentClient();
process.env.TABLE = 'pick-me-up';
process.env.REGION = 'us-west-2';

const { 
  register
} = require('./src/Routes');

api.post(
  '/register',
  register
);

module.exports = api;

