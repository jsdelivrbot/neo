const path = require('path')

const xjs = {
  Date: require('extrajs').Date,
  ...require('extrajs-dom'),
}

/**
 * @summary xListRegistrationicon renderer.
 * @description A `<ul>` element listing the registration periods in a legend.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.AggregateOffer} data a registration period, with:
 * @param {string} data.name the name of the registration period (e.g., 'Early Bird')
 * @param {string=} data.availabilityStarts the date on which this registration period starts
 * @param {string=} data.availabilityEnds the date on which this registration period ends
 * @param {string=} data.$icon the icon keyword of this registration period
 * @param   {!Object=} opts additional rendering options
 */
function xListRegistrationicon_renderer(frag, data, opts = {}) {
  let date_start = (data.availabilityStarts) ? new Date(data.availabilityStarts) : null
  let date_end   = (data.availabilityEnds  ) ? new Date(data.availabilityEnds  ) : null

  frag.querySelector('i').textContent = data.$icon
  frag.querySelector('b').textContent = data.name

  let times = [...frag.querySelectorAll('time')]
  let colon = frag.querySelector('slot[name="colon"]')
  let dash  = frag.querySelector('slot[name="dash"]')
    if (date_start) {
      new xjs.HTMLTimeElement(times[0])
        .dateTime(date_start.toISOString())
        .textContent(xjs.Date.format(date_start, 'M j'))
    } else {
      colon.textContent = ' ends '
      times[0].remove()
      dash.remove()
    }
    if (date_end) {
      new xjs.HTMLTimeElement(times[1])
        .dateTime(date_end.toISOString())
        .textContent(xjs.Date.format(date_end, 'M j'))
    } else {
      colon.textContent = ' begins '
      dash.remove()
      times[1].remove()
    }

  new xjs.HTMLElement(frag.querySelector('small')).trimInner()
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-registrationicon.tpl.html'))
  .setRenderer(xListRegistrationicon_renderer)