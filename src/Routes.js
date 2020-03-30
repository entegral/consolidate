const assert = require('assert');
const apiKey = process.env.API_KEY || 'testApiKey';

const authenticate = (key) => { return key !== apiKey; };

const validateRegistrationInput = (event) => {
  assert.strictEqual(typeof event, 'object', 'register route requires an event');
  assert.strictEqual(typeof event.normalizedHeaders, 'object', 'expected normalizedHeaders to be an object');
  
  assert.strictEqual(typeof event.body, 'object', 'expected body to be an object');
  assert.strictEqual(typeof event.body.email, 'string', 'expected body.email to be a string');
  assert.strictEqual(typeof event.body.group, 'string', 'expected body.group to be a string');
  assert.strictEqual(typeof event.body.password, 'string', 'expected body.password to be a string');
  assert.strictEqual(typeof event.body.firstName, 'string', 'expected body.firstName to be a string');
  assert.strictEqual(typeof event.body.lastName, 'string', 'expected body.lastName to be a string');
};

const register = async (event, docClient) => {

  // validate body parameters
  validateRegistrationInput(event);

  // auth
  if (authenticate(event.normalizedHeaders.apiKey)) { return {status: 404, 'message': 'please check apiKey'}; }

  // retrieve group details
  const getParams = {
    TableName: process.env.MEGATABLE,
    Key: {
      pk: `group::${event.body.group}`,
      sk: 'config'
    }
  };

  let group;
  try {
    const response = await docClient.get(getParams).promise();
    group = response.Item;
  } catch (error) {
    console.log('!!! [registration error]', error);
    return {error: true, message: 'error occurred in registration'};
  }

  if (Object.keys(group).length === 0) {
    return { error: true, message: 'group does not exist'};
  }

  if (event.body.password !== group.password) {
    return {error: true, message: 'group password incorrect'};
  }

  // add user to group config
  const updateParams = getParams;
  updateParams.UpdateExpression = 'ADD users :newUser',
  updateParams.ExpressionAttributeValues = { ':newUser': [event.body.email]};
  try {
    await docClient.update(updateParams).promise();
  } catch (error) {
    console.log('!!! [update group error]', error);
    return {error: true, message: 'error adding user to group'};
  }

  return { success: true, message: 'added to group'};

};

module.exports.register = register;
