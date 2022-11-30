/**
 * @extends Error
 */
class DataNotFound extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 404;
    this.printMsg = message ? message : 'Data Not Found!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = DataNotFound;
