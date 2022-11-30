/**
 * @extends Error
 */
class RoleNotFound extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 404;
    this.printMsg = message ? message : 'Invalid Role!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = RoleNotFound;
