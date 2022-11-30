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
    this.statusCode = 500;
    this.printMsg = message ? message : 'Something went wrong!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = InvalidData;
