const Organization = require('./Organization.class.js')


/**
 * An organization exhibiting at a conference or series of conferences.
 * @extends Organization
 */
class Exhibitor extends Organization {
  /**
   * Construct a new Exhibitor object.
   * @param {!Object} jsondata a JSON object
   * @param {string} jsondata.name the name of the organization
   * @param {string=} jsondata.url the url of the organization
   * @param {string=} jsondata.image the image url of the organization
   * @param {string=} jsondata.description the name of the organization
   * @param {number=} jsondata.$booth the booth number of this exhibitor
   * @param {boolean=} jsondata.$isSponsor whether this exhibitor also happens to be a sponsor
   */
  constructor(jsondata) {
    super(jsondata)
    /**
     * All the data for this supporter.
     * @private
     * @final
     * @type {!Object}
     */
    this._DATA = jsondata
  }
}

module.exports = Exhibitor
