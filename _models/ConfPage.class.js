var Page = require('sitepage').Page
var Util = require('./Util.class.js')

module.exports = class ConfPage extends Page {
  /**
   * Any page or subpage within a ConfSite.
   * Construct a ConfPage object, given a name and url.
   * @see ConfSite
   * @constructor
   * @extends Page
   * @param {string} name name of this page
   * @param {string} url  url of this page
   */
  constructor(name, url) {
    super({ name: name, url: url })
    /** @private */ this._icon     = null
    /** @private */ this._is_hidden = false
  }

  /**
   * Set the icon for this page.
   * @param {string} key the keyword for the icon
   */
  setIcon(key) {
    this._icon = Util.ICON_DATA.find(function ($icon) { return $icon.content === key })
    return this
  }
  /**
   * Get the icon of this page.
   * @param  {boolean=} fallback if true, get the unicode code point
   * @return {string} if fallback, the unicode code point, else, the keyword of the icon
   */
  getIcon(fallback) {
    return (this._icon) ? Util.iconToString(this._icon, fallback) : ''
  }

  /**
   * Hide or show this page.
   * @param  {boolean=true} bool hides or shows this page
   * @return {Page} this page
   */
  hide(bool) {
    this._is_hidden = (arguments.length) ? bool : true
    return this
  }
  /**
   * Get the hidden status of this page.
   * @return {boolean} true if this page is hidden; false otherwise
   */
  isHidden() {
    return this._is_hidden
  }
}
