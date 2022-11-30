/**
 * @extends Error
 */
class UserNotFound extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 404;
    this.printMsg = message ? message : 'User Not Found!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = UserNotFound;
