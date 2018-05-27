const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}
const View = require('extrajs-view')

const Person             = require('./Person.class.js')

const xListSupporterLevel = require('../tpl/x-list-supporter-level.tpl.js')
const xListExhibitor      = require('../tpl/x-list-exhibitor.tpl.js')

const xHero           = require('../tpl/x-hero.tpl.js')
const xOtheryear      = require('../tpl/x-otheryear.tpl.js')
const xProgram        = require('../tpl/x-program.tpl.js')
const xDateblock      = require('../tpl/x-dateblock.tpl.js')


/**
 * A conference event.
 * It may have a name, theme, dates, (promoted) location,
 * passes, sessions, venues, speakers,
 * supporter levels and supporters, exhibitors, contact information,
 * important dates, organizers, and other properties.
 */
class Conference {
  /**
   * @summary Construct a Conference object.
   * @description The name, url, theme, start date, end date, and promoted location
   * are immutable and must be provided during construction.
   * @param {sdo.Event} jsondata a JSON object that validates against http://schema.org/Event and `/neo.jsd#/definitions/Conference`
   * @param {string} jsondata.name                       http://schema.org/name
   * @param {string} jsondata.url                        http://schema.org/url
   * @param {string=} jsondata.description               http://schema.org/description
   * @param {string=} jsondata.image                     http://schema.org/image
   * @param {string=} jsondata.startDate                 http://schema.org/startDate
   * @param {string=} jsondata.endDate                   http://schema.org/endDate
   * @param {Array<!Object>=} jsondata.location          http://schema.org/location
   * @param {Array<sdo.AggregateOffer>=} jsondata.offers http://schema.org/offers
   * @param {string=} jsondata.$currentRegistrationPeriod
   * @param {Array<!Object>=} jsondata.$passes
   * @param {Array<sdo.Event>=} jsondata.subEvent         http://schema.org/subEvent
   * @param {Array<sdo.Action>=} jsondata.potentialAction http://schema.org/potentialAction
   * @param {Array<sdo.Person>=} jsondata.performer       http://schema.org/performer
   * @param {Array<sdo.Organization>=} jsondata.sponsor   http://schema.org/sponsor
   * @param {Array<sdo.Person>=} jsondata.organizer       http://schema.org/organizer
   * @param {Array<sdo.Organization>=} jsondata.$exhibitors
   * @param {Array<sdo.WebPageElement>=} jsondata.$social
   */
  constructor(jsondata) {
    /**
     * All the data for this conference.
     * @private
     * @final
     * @type {!Object}
     */
    this._DATA = jsondata

    /** @private */ this._supporter_levels = []
    /** @private */ this._supporter_lists  = {}
    /** @private */ this._social          = {}
  }

  /**
   * @summary The name of this conference.
   * @type {string}
   */
  get name() {
    return this._DATA.name
  }

  /**
   * @summary The URL of this conference.
   * @type {string}
   */
  get url() {
    return this._DATA.url
  }

  /**
   * @summary The theme of this conference.
   * @description The theme is a one-sentence or one-phrase motif,
   * and may be changed from year to year (from conference to conference).
   * @type {string}
   */
  get theme() {
    return this._DATA.description || ''
  }

  /**
   * @summary The hero image of this conference.
   * @type {string}
   */
  get heroImage() {
    return this._DATA.image || ''
  }

  /**
   * @summary The starting date of this conference.
   * @type {Date}
   */
  get startDate() {
    return new Date(this._DATA.startDate || null)
  }

  /**
   * @summary The ending date of this conference.
   * @type {Date}
   */
  get endDate() {
    return new Date(this._DATA.endDate || null)
  }

  /**
   * @summary Get the promoted location of this conference.
   * @description The promoted location is not necessarily the actual postal address of the conference,
   * but rather a major city nearest to the conference used for
   * promotional and advertising purposes.
   * @type {sdo.PostalAddress}
   */
  get promoLoc() {
    return this._DATA.location && this._DATA.location[0] || { "@type": "PostalAddress" }
  }

  /**
   * @summary The location image of this conference.
   * @type {string}
   */
  get promoLocImage() {
    return this._DATA.location && this._DATA.location[0] && this._DATA.location[0].image || ''
  }

  /**
   * @summary Retrieve all registration periods of this conference.
   * @returns {Array<sdo.AggregateOffer>} a shallow array of all registration periods of this conference.
   */
  getRegistrationPeriodsAll() {
    return (this._DATA.offers || []).slice()
  }

  /**
   * @summary The current registration period.
   * @description The current registration period is the registration period that is active at this time.
   * If none has been set, the first registration period is returned.
   * @type {sdo.AggregateOffer}
   */
  get currentRegistrationPeriod() {
    let default_ = {
      "@type": "AggregateOffer",
      "name" : "default",
    }
    return (this._DATA.$currentRegistrationPeriod) ?
      this.getRegistrationPeriodsAll().find((pd) => pd.name === this._DATA.$currentRegistrationPeriod) || default_ :
      this._DATA.offers && this._DATA.offers[0] || default_
  }

  /**
   * @summary Retrieve all passes of this conference.
   * @returns {Array<!Object>} a shallow array of all passes of this conference
   */
  getPassesAll() {
    return (this._DATA.$passes || []).slice()
  }

  /**
   * @summary Retrieve all venues of this conference.
   * @returns {Array<sdo.Accommodation>} a shallow copy of the venues object of this conference
   */
  getVenuesAll() {
    return (this._DATA.location || []).slice(1)
  }

  /**
   * @summary Retrieve all speakers of this conference.
   * @returns {Array<sdo.Person>} a shallow array of all speakers of this conference
   */
  getSpeakersAll() {
    return (this._DATA.performer || []).slice()
  }

  /**
   * @summary Retrieve all organizers of this conference.
   * @returns {Array<sdo.Person>} a shallow array of all organizers of this conference
   */
  getOrganizersAll() {
    return (this._DATA.organizer || []).slice()
  }

  /**
   * @summary Return an object representing all social network profiles of this conference.
   * @returns {Array<!Object>} all this conference’s social media networks
   */
  getSocialAll() {
    return (this._DATA.$social || []).slice()
  }

  // setPrice(reg_period, pass, membership, price) {
  //   reg_period = reg_period.name || reg_period
  //   pass        = pass.name        || pass
  //   membership  = membership.name  || membership
  //   this.registration = this.registration || {}
  //   this.registration[reg_period][pass][membership] = price
  //   return this
  // }


  /**
   * @summary Render this conference in HTML.
   * @see Conference.VIEW
   * @type {View}
   */
  get view() {
    /**
     * @summary This view object is a set of functions returning HTML output.
     * @description Available displays:
     * - `Conference#view.hero()`      - Hero Organism
     * - `Conference#view.otherYear()` - Other Year Organism
     * - `Conference#view.program()`   - Program Tabs Organism
     * - `Conference#view.supporterLevels()` - multiple SupporterBlock Components
     * @namespace Conference.VIEW
     * @type {View}
     */
    return new View(null, this)
      /**
       * Return a `<header>` element with hero image marking up this conference’s main info.
       * @summary Call `Conference#view.hero()` to render this display.
       * @function Conference.VIEW.hero
       * @returns {string} HTML output
       */
      .addDisplay(function hero() {
        return new xjs.DocumentFragment(xHero.render({
          ...this._DATA,
          location: this._DATA.location && this._DATA.location[0] || { "@type": "PostalAddress" },
        })).innerHTML()
      })
      /**
       * Return an `<aside>` element with other year backdrop marking up this conference’s main info.
       * @summary Call `Conference#view.otherYear()` to render this display.
       * @function Conference.VIEW.otherYear
       * @returns {string} HTML output
       */
      .addDisplay(function otherYear() {
        return new xjs.DocumentFragment(xOtheryear.render({
          ...this._DATA,
          location: this._DATA.location && this._DATA.location[0] || { "@type": "PostalAddress" },
        })).innerHTML()
      })
      /**
       * Return a `xDateblock` component marking up this conference’s important dates.
       * @summary Call `Conference#view.importantDates()` to render this display.
       * @function Conference.VIEW.importantDates
       * @param   {boolean=} starred `true` if you want only starred dates to display
       * @returns {string} HTML output
       */
      .addDisplay(function importantDates(starred = false) {
        return new xjs.DocumentFragment(xDateblock.render(
          (this._DATA.potentialAction || []).filter((d) => (starred) ? d.$starred : true)
        )).innerHTML()
      })
      /**
       * Return an `<.o-Tablist[role="tablist"]>` marking up this conference’s program sessions.
       * Each tab contains a Program Heading Component
       * and its panel contains a Time Block Component for that date.
       * @summary Call `Conference#view.program()` to render this display.
       * @function Conference.VIEW.program
       * @param   {string} id unique id for form elements
       * @param   {boolean=} starred `true` if you want only starred sessions to display
       * @returns {string} HTML output
       */
      .addDisplay(function program(id, starred = false) {
        return new xjs.DocumentFragment(xProgram.render(
          (this._DATA.subEvent || []).filter((s) => (starred) ? s.$starred : true),
          null,
          { id, starred }
        )).innerHTML()
      })
      /**
       * Return a list of `<section.c-SupporterBlock>` components containing this conference’s supporters
       * that have the specified levels.
       * @summary Call `Conference#view.supporterLevels()` to render this display.
       * @function Conference.VIEW.supporterLevels
       * @param   {sdo.ItemList} queue http://schema.org/ItemList
       * @param   {boolean=} small should logo sizing be overridden to small?
       * @returns {string} HTML output
       */
      .addDisplay(function supporterLevels(queue, small = false) {
        return new xjs.DocumentFragment(xListSupporterLevel.render(queue, this._DATA, { small })).innerHTML()
      })
      /**
       * Return a list of `<div>` elements marking up this conference’s exhibitors.
       * @summary Call `Conference#view.exhibitorList()` to render this display.
       * @function Conference.VIEW.exhibitorList
       * @returns {string} HTML output
       */
      .addDisplay(function exhibitorList() {
        return new xjs.DocumentFragment(xListExhibitor.render(this._DATA.$exhibitors || [])).innerHTML()
      })
  }
}

module.exports = Conference
