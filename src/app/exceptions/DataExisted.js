/**
 * @extends Error
 */
class DataExisted extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = 422;
    this.printMsg = message ? message : 'Data Existed!';
  }
  /**
   * Custom action when error occurs
   */
  handle() {

  }
}

module.exports = DataExisted;
