const assert = require('assert');
const apiKey = process.env.API_KEY || 'testApiKey';

const authenticate = (key) => { return key !== apiKey; };

const register = (event) => {

  // validate body parameters
  assert.strictEqual(typeof event, 'object', 'register route requires an event');
  assert.strictEqual(typeof event.normalizedHeaders, 'object', 'expected normalizedHeaders to be an object');
  if (authenticate(event.normalizedHeaders.apiKey)) { return {status: 404, 'message': 'please check apiKey'}; }
  
  assert.strictEqual(typeof event.body, 'object', 'expected body to be an object');
  assert.strictEqual(typeof event.body.email, 'string', 'expected body.email to be a string');
  assert.strictEqual(typeof event.body.password, 'string', 'expected body.password to be a string');
  assert.strictEqual(typeof event.body.firstName, 'string', 'expected body.firstName to be a string');
  assert.strictEqual(typeof event.body.lastName, 'string', 'expected body.lastName to be a string');
  
  // generate id

  // assign user attributes

  // write to dynamo
};

module.exports.register = register;
