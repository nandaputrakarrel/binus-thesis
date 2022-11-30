/**
 * @extends Error
 */
class InvalidCredentials extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 401;
    this.printMsg = message ? message : 'Invalid Credentials.';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = InvalidCredentials;
