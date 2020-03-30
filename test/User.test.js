const assert = require('assert');
const sinon = require('sinon');

const router = require('../src/Routes');

describe('Routes', () => {
    
  describe('register', () => {
    const event = {};

    describe('validations', () => {
      it('should throw an error if body is not an object', () => {
        assert.rejects(
          router.register.bind(null),
          /register route requires an event/
        );
      });

      it('should throw an error if nomralizedHeaders is not an object', () => {
        assert.rejects(
          router.register.bind(null, event),
          /expected normalizedHeaders to be an object/
        );
      });

      it('should throw an error if body is not an object', () => {
        event.normalizedHeaders = {apiKey: 'testApiKey'};
        assert.rejects(
          router.register.bind(null, event),
          /expected body to be an object/
        );
      });

      it('should throw an error if email is not a string', () => {
        event.body = {};
        assert.rejects(
          router.register.bind(null, event),
          /expected body.email to be a string/
        );
      });

      it('should throw an error if group is not a string', () => {
        event.body.email = 'email';
        assert.rejects(
          router.register.bind(null, event),
          /expected body.group to be a string/
        );
      });

      it('should throw an error if password is not a string', () => {
        event.body.group = 'group';
        assert.rejects(
          router.register.bind(null, event),
          /expected body.password to be a string/
        );
      });

      it('should throw an error if firstName is not a string', () => {
        event.body.password = 'password';
        assert.rejects(
          router.register.bind(null, event),
          /expected body.firstName to be a string/
        );
      });

      it('should throw an error if lastName is not a string', () => {
        event.body.firstName = 'fName';
        assert.rejects(
          router.register.bind(null, event),
          /expected body.lastName to be a string/
        );
      });

      it('should throw an error if lastName is not a string', () => {
        event.body.lastName = 'lName';
        assert.doesNotThrow(
          router.register.bind(null, event, {get: () => { return {promise: () => { return {Item:{ok: 'notEmpty'}}; }}; }})
        );
      });
    });

    describe('behavior', () => {
      
      it('should throw an error if the dynamo call rejects', async () => {
        const origConsole = console.log;
        console.log = () => {};
        const expectedRejects = {error: true, message: 'error occurred in registration'};
        const groupNotExistsStub = sinon.stub().rejects();

        const result2 = await router.register(event, {
          get: (args) => {
            assert.equal(args.Key.pk, 'group::group');
            return {
              promise: groupNotExistsStub
            };
          }
        });
        assert.deepEqual(result2, expectedRejects, 'expected rejection');
        console.log = origConsole;
      });
      
      it('should return an error if a group doesn\'t exist', async () => {
        const emptyGroupResponse = sinon.stub().resolves({Item: {}});
        const result1 = await router.register(event, {
          get: (args) => {
            assert.equal(args.Key.pk, 'group::group');
            return {
              promise: emptyGroupResponse
            };
          }
        });
        assert.deepEqual(result1, {error: true, message: 'group does not exist'});
      });

      it('should return an error if the password is not the group\'s password', async () => {
        const wrongGroupPassword = sinon.stub().resolves({Item: {password: 'secret'}});
        const result1 = await router.register(event, {
          get: (args) => {
            assert.equal(args.Key.pk, 'group::group');
            return {
              promise: wrongGroupPassword
            };
          }
        });
        assert.deepEqual(result1, {error: true, message: 'group password incorrect'});
      });
      it('should save the user if the group exists, password matches, and no other user with that name is registered yet', async () => {
        const goodResponse = sinon.stub().resolves({Item: {password: 'password'}});
        const result1 = await router.register(event, {
          get: (args) => {
            assert.equal(args.Key.pk, 'group::group');
            return {
              promise: goodResponse
            };
          },
          update: (args) => {
            assert.equal(args.Key.pk, 'group::group');
            assert.equal(args.UpdateExpression, 'ADD users :newUser');
            assert.equal(args.ExpressionAttributeValues[':newUser'], 'email');
            return {
              promise: goodResponse
            };
          }
        });
        assert.deepEqual(result1, {success: true, message: 'added to group'});
      });
    });
  });
  
});
