/**
 * @extends Error
 */
class InactiveUser extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 422;
    this.printMsg = message ? message : 'User is inactive!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = InactiveUser;
