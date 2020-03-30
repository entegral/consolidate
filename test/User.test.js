const assert = require('assert');
const router = require('../src/Routes');

describe('Routes', () => {
    
  describe('register', () => {
    describe('validations', () => {
      it('should throw an error if body is not an object', () => {
        assert.throws(
          router.register.bind(null),
          /register route requires an event/
        );
      });

      const event = {};
      it('should throw an error if nomralizedHeaders is not an object', () => {
        assert.throws(
          router.register.bind(null, event),
          /expected normalizedHeaders to be an object/
        );
      });

      it('should throw an error if body is not an object', () => {
        event.normalizedHeaders = {apiKey: 'testApiKey'};
        assert.throws(
          router.register.bind(null, event),
          /expected body to be an object/
        );
      });

      it('should throw an error if email is not a string', () => {
        event.body = {};
        assert.throws(
          router.register.bind(null, event),
          /expected body.email to be a string/
        );
      });

      it('should throw an error if group is not a string', () => {
        event.body.email = 'email';
        assert.throws(
          router.register.bind(null, event),
          /expected body.group to be a string/
        );
      });

      it('should throw an error if password is not a string', () => {
        event.body.group = 'group';
        assert.throws(
          router.register.bind(null, event),
          /expected body.password to be a string/
        );
      });

      it('should throw an error if firstName is not a string', () => {
        event.body.password = 'password';
        assert.throws(
          router.register.bind(null, event),
          /expected body.firstName to be a string/
        );
      });

      it('should throw an error if lastName is not a string', () => {
        event.body.firstName = 'fName';
        assert.throws(
          router.register.bind(null, event),
          /expected body.lastName to be a string/
        );
      });

      it('should throw an error if lastName is not a string', () => {
        event.body.lastName = 'lName';
        assert.doesNotThrow(
          router.register.bind(null, event)
        );
      });
    });

    describe('behavior', () => {
      
      it('should validate the requested group exists');
      it('should return an error if that user already exists in the group');
      it('should return an error if the password is not the group\'s password');
      it('should save the user if the group exists, password matches, and no other user with that name is registered yet');
    });
  });
  
});
