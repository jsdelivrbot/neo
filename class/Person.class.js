const HTMLElement = require('extrajs-dom').HTMLElement
const View    = require('extrajs-view')
const Util    = require('./Util.class.js')

/**
 * A person.
 * Can be used for any role on the site,
 * e.g., speaker, chair, or ASCE staff member.
 */
class Person {
  /**
   * Construct a new Person object.
   * @param {string} id a unique identifier of the person
   * @param {Object=} $name an object containing the following:
   * @param {string} $name.honorific_prefix a prefix, if any (e.g. 'Mr.', 'Ms.', 'Dr.')
   * @param {string} $name.given_name the person’s first name
   * @param {string} $name.additional_name  the person’s middle name or initial
   * @param {string} $name.family_name the person’s last name
   * @param {string} $name.honorific_suffix the suffix, if any (e.g. 'M.D.', 'P.ASCE')
   */
  constructor(id, $name = {}) {
    /** @private @final */ this._ID   = id
    /** @private @final */ this._NAME = {
      honorific_prefix: $name.honorific_prefix,
      given_name      : $name.given_name,
      additional_name : $name.additional_name,
      family_name     : $name.family_name,
      honorific_suffix: $name.honorific_suffix,
    }
    /** @private */ this._jobTitle    = ''
    /** @private */ this._affiliation = ''
    /** @private */ this._img         = ''
    /** @private */ this._email       = ''
    /** @private */ this._telephone   = ''
    /** @private */ this._url         = ''
    /** @private */ this._social      = {}
    /** @private */ this._is_starred  = false
  }

  /**
   * @summary Get the id of this person.
   * @type {string}
   */
  get id() {
    return this._ID
  }

  /**
   * @summary Get the name object of this person.
   * @type {Object}
   */
  get name() {
    return Object.assign({}, this._NAME)
  }

  /**
   * @summary Set or get this person’s job title.
   * @param   {string=} text the job title
   * @returns {(Person|string)} this person || the job title
   */
  jobTitle(text) {
    if (arguments.length) {
      this._jobTitle = text
      return this
    } else return this._jobTitle
  }

  /**
   * @summary Set or get this person’s affiliation.
   * @param   {string=} text the affiliation
   * @returns {(Person|string)} this person || the affiliation
   */
  affiliation(text) {
    if (arguments.length) {
      this._affiliation = text
      return this
    } else return this._affiliation
  }

  /**
   * @summary Set or get this person’s headshot image.
   * @param   {string=} text the url pointing to the headshot image
   * @returns {(Person|string)} this person || the headshot image url
   */
  img(url) {
    if (arguments.length) {
      this._img = url
      return this
    } else return this._img
  }

  /**
   * @summary Set or get this person’s email address.
   * @param   {string=} text the email address
   * @returns {(Person|string)} this person || the email address
   */
  email(text) {
    if (arguments.length) {
      this._email = text
      return this
    } else return this._email
  }

  /**
   * @summary Set or get this person’s telephone number.
   * @param   {string=} text the telephone number
   * @returns {(Person|string)} this person || the telephone number
   */
  phone(text) {
    if (arguments.length) {
      this._telephone = text
      return this
    } else return this._telephone
  }

  /**
   * @summary Set or get this person’s homepage.
   * @param   {string=} text the homepage
   * @returns {(Person|string)} this person || the homepage
   */
  url(text) {
    if (arguments.length) {
      this._url = text
      return this
    } else return this._url
  }

  /**
   * @summary Add a social network profile to this person.
   * @param   {string} network_name the name of the social network
   * @param   {string} url the URL of this person’s profile on the network
   * @param   {string=} text optional advisory text
   * @returns {Person} this person
   */
  addSocial(network_name, url, text) {
    this._social[network_name] = { url: url, text: text }
    return this
  }
  /**
   * @summary Retrieve a social network profile of this person.
   * @param   {string} network_name the name of the social network
   * @returns {Object} an object representing the social network profile
   */
  getSocial(network_name) {
    return this._social[network_name]
  }
  /**
   * @summary Return an object representing all social network profiles of this person.
   * @returns {Object} shallow clone of this person’s social object
   */
  getSocialAll() {
    //- NOTE returns shallow clone (like arr.slice())
    return Object.assign({}, this._social)
  }

  /**
   * @summary Mark this person as starred.
   * @param   {boolean=} bool if true, mark as starred
   * @returns {Person} this person
   */
  star(bool = true) {
    this._is_starred = bool
    return this
  }
  /**
   * @summary Get the starred status of this person.
   * @returns {boolean} whether this person is starred
   */
  isStarred() {
    return this._is_starred
  }


  /**
   * @summary Render this person in HTML.
   * @see Person.VIEW
   * @type {View}
   */
  get view() {
    /**
     * @summary This view object is a set of functions returning HTML output.
     * @description Available displays:
     * - `Person#view()`             - default display - “First Last”
     * - `Person#view.fullName()`    - “First Middle Last”
     * - `Person#view.entireName()`  - “Px. First Middle Last, Sx.”
     * - `Person#view.affiliation()` - “First Middle Last, Affiliation”
     * - `Person#view.contact()`     - “First Last, Director of ... | 555-555-5555”
     * - `Person#view.speaker()`     - Speaker Component
     * @namespace Person.VIEW
     * @type {View}
     */
    /**
     * Default display. Takes no arguments.
     * Return this person’s name in "First Last" format.
     * @summary Call `Person#view()` to render this display.
     * @function Person.VIEW.default
     * @returns {string} HTML output
     */
    return new View(function () {
      return new HTMLElement('span').attr('itemprop','name')
        .addContent([
          new HTMLElement('span').attr('itemprop','givenName').addContent(this.name.given_name),
          ` `,
          new HTMLElement('span').attr('itemprop','familiyName').addContent(this.name.family_name),
        ])
        .html()
    }, this)
      /**
       * Return this person’s name in "First Middle Last" format.
       * @summary Call `Person#view.fullName()` to render this display.
       * @function Person.VIEW.fullName
       * @returns {string} HTML output
       */
      .addDisplay(function fullName() {
        return new HTMLElement('span').attr('itemprop','name')
          .addContent([
            new HTMLElement('span').attr('itemprop','givenName').addContent(this.name.given_name),
            ` `,
            new HTMLElement('span').attr('itemprop','additionalName').addContent(this.name.additional_name),
            ` `,
            new HTMLElement('span').attr('itemprop','familiyName').addContent(this.name.family_name),
          ])
          .html()
      })
      /**
       * Return this person’s name in "Px. First Middle Last, Sx." format.
       * @summary Call `Person#view.entireName()` to render this display.
       * @function Person.VIEW.entireName
       * @returns {string} HTML output
       */
      .addDisplay(function entireName() {
        let returned = this.view.fullName()
        if (this.name.honorific_prefix) {
          returned = `${
            new HTMLElement('span').attr('itemprop','honorificPrefix').addContent(this.name.honorific_prefix).html()
          } ${returned}`
        }
        if (this.name.honorific_suffix) {
          returned = `${returned}, ${
            new HTMLElement('span').attr('itemprop','honorificSuffix').addContent(this.name.honorific_suffix).html()
          }`
        }
        return returned
      })
      /**
       * Return this person’s name in "First Middle Last, Affiliation" format.
       * @summary Call `Person#view.affiliation()` to render this display.
       * @function Person.VIEW.affiliation
       * @returns {string} HTML output
       */
      .addDisplay(function affiliation() {
        return `${this.view.entireName()}, ${new HTMLElement('span').class('-fs-t')
          .attr({ itemprop: 'affiliation', itemscope: '', itemtype: 'http://schema.org/Organization' })
          .addContent(new HTMLElement('span').attr('itemprop','name').addContent(this.affiliation()))
          .html()}`
      })
      /**
       * Return this person’s name in "First Last, Director of ... | 555-555-5555" format.
       * @summary Call `Person#view.contact()` to render this display.
       * @function Person.VIEW.contact
       * @returns {string} HTML output
       */
      .addDisplay(function contact() {
        let returned = new HTMLElement('a')
          .attr('href',`mailto:${this.email()}`)
          .addContent(this.view())
          .html()
        if (this.jobTitle()) {
          returned = `${returned}, ${
            new HTMLElement('span').attr('itemprop','jobTitle').addContent(this.jobTitle()).html()
          }`
        }
        if (this.phone()) {
          returned = `${returned} | ${
            new HTMLElement('a')
              .attr('href',`tel:${this.phone()}`)
              .attr('itemprop','telephone')
              .addContent(this.phone())
              .html()
          }`
        }
        return returned
      })
      /**
       * Return an `<article.c-Speaker>` component marking up this person’s info.
       * @summary Call `Person#view.speaker()` to render this display.
       * @function Person.VIEW.speaker
       * @returns {string} HTML output
       */
      .addDisplay(function speaker() {
        /* filler placeholder */ function pug(strings, ...exprs) { return strings.join('') }
        return new HTMLElement('article').class('c-Speaker').attr({
          'data-instanceof': 'Person',
          itemprop : 'performer',
          itemscope: '',
          itemtype : 'http://schema.org/Person',
        }).addContent([
          new HTMLElement('img').class('c-Speaker__Img h-Block')
            .attr('src', this.img())
            .attr('itemprop','image'),
          new HTMLElement('header').class('c-Speaker__Head').addContent([
            new HTMLElement('h1').class('c-Speaker__Name')
              .id(this.id)
              .addContent(this.view.entireName()),
            new HTMLElement('p').class('c-Speaker__JobTitle')
              .attr('itemprop','jobTitle')
              .addContent(this.jobTitle()),
            new HTMLElement('p').class('c-Speaker__Affiliation').attr({
              itemprop : 'affiliation',
              itemscope: '',
              itemtype : 'http://schema.org/Organization',
            }).addContent(new HTMLElement('span').attr('itemprop','name').addContent(this.affiliation())),
          ]),
          // new HTMLElement('div').class('c-Speaker__Body').attr('itemprop','description'),
          new HTMLElement('footer').class('c-Speaker__Foot').addContent(pug`
            include ../_views/_c-SocialList.view.pug
            +socialList(${this.getSocialAll()}).c-SocialList--speaker
              if ${this.email()}
                li.o-List__Item.o-Flex__Item.c-SocialList__Item
                  a.c-SocialList__Link.c-SocialList__Link--email.h-Block(href="mailto:${this.email()}" title="${this.email()}" itemprop="email")
                    span.h-Hidden send email
                    //- i.material-icons(role="none") email
              if ${this.phone()}
                li.o-List__Item.o-Flex__Item.c-SocialList__Item
                  a.c-SocialList__Link.c-SocialList__Link--phone.h-Block(href="tel:${Util.toURL(this.phone())}" title="${this.phone()}" itemprop="telephone")
                    span.h-Hidden call
                    //- i.material-icons(role="none") phone
              if ${this.url()}
                li.o-List__Item.o-Flex__Item.c-SocialList__Item
                  a.c-SocialList__Link.c-SocialList__Link--explore.h-Block(href="${this.url()}" title="visit homepage" itemprop="url")
                    span.h-Hidden visit homepage
                    //- i.material-icons(role="none") explore
          `),
        ])
        .html()
      })
  }
}

module.exports = Person