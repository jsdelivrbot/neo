module.exports = class ImportantDate {
  /**
   * An important date.
   * Construct an ImportantDate object.
   * The name and start time must be provided during construction
   * and are immutable. End time is optional.
   * @constructor
   * @param {Object=} $actioninfo an object with the following immutable properties:
   * @param {string} $actioninfo.name the name of the important date
   * @param {Date} $actioninfo.start_time the start time of the important date
   * @param {Date=} $actioninfo.end_time the start end of the important date
   */
  constructor($actioninfo = {}) {
    /** @private @final */ this._NAME  = $actioninfo.name
    /** @private @final */ this._START = $actioninfo.start_time
    /** @private @final */ this._END   = $actioninfo.end_time
    /** @private */ this._url          = ''
    /** @private */ this._is_starred   = false
  }

  /**
   * Get the name of this important date.
   * @return {string} the name of this important date
   */
  get name() {
    return this._NAME
  }

  /**
   * Return the start date value of this important date.
   * @return {Date} the start date of this important date
   */
  get startTime() {
    return this._START || new Date()
  }

  /**
   * Return the end date value of this important date.
   * @return {?Date} the end date of this important date
   */
  get endTime() {
    return this._END || null
  }

  /**
   * Set or get the url of this important date.
   * @param  {string=} url the url of this important date
   * @return {(ImportantDate|string)} this important date || the url of this important date
   */
  url(url) {
    if (arguments.length) {
      this._url = url
      return this
    } else return this._url
  }

  /**
   * Mark this important date as starred.
   * @param  {boolean=true} bool if true, mark as starred
   * @return {ImportantDate} this important date
   */
  star(bool) {
    this._is_starred = (arguments.length) ? bool : true
    return this
  }
  /**
   * Get the starred status of this important date.
   * @return {boolean} whether this important date is starred
   */
  isStarred() {
    return this._is_starred
  }
}
