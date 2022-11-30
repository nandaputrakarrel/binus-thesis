/**
 * @extends Error
 */
class InvalidData extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 422;
    this.printMsg = message ? message : 'Invalid Data!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = InvalidData;
