const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

const xTimeblock = require('../tpl/x-timeblock.tpl.js')


/**
 * @summary xProgram renderer.
 * @description A `<div.o-Tablist[role="tablist"]>` component containing panels of `.c-Timeblock` components.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {Array<sdo.Event>} data an array of sessions to mark up
 * @param   {!Object=} opts additional rendering options
 * @param   {string} opts.id unique id of the program block
 * @param   {boolean=} opts.starred whether to filter out unstarred sessions
 */
function xProgram_renderer(frag, data, opts = {}) {
  let container = frag.querySelector('[role="tablist"]')
  const xProgramPanel = new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (f, d, o = {}) {
    f.querySelector('[role="tabpanel"]' ).id          = `${opts.id}-panel${o.index}`
    f.querySelector('time.c-ProgramHn'  ).dateTime    = d.date.toISOString()
    f.querySelector('slot[name="day"]'  ).textContent = xjs.Date.DAY_NAMES[d.date.getUTCDay()]
    f.querySelector('slot[name="date"]' ).textContent = xjs.Date.format(d.date, 'M j')
    new xjs.HTMLElement(f.querySelector('slot[name="panel"]')).empty()
      .append(xTimeblock.render(d.items))
    new xjs.HTMLTimeElement(f.querySelector('.c-ProgramHn')).trimInner()
  })
  /**
   * @summary Categorize all the sessions of the conference by date.
   * @description
   * An array of objects, each with a `dateobj` property: a Date;
   * and a `sessions` property: an array of {@link http://schema.org/Event|sdo.Event} objects,
   * all of which share the same date (excluding time of day).
   * @private
   * @type {Array<{dateobj:Date, sessions:Array<sdo.Event>}>} an array grouping the sessions together
   */
  const grouped_sessions = (function () {
    const returned = []
    data.forEach((datum) => {
      let time_start = new Date(datum.startDate)
      let time_end   = new Date(datum.endDate  )
      if (!returned.find((group) => xjs.Date.sameDate(group.date, time_start))) {
        returned.push({
          date : time_start,
          items: data.filter((s) => xjs.Date.sameDate(new Date(s.startDate), time_start)),
        })
      }
    })
    return returned
  })()
  container.append(...grouped_sessions.map((group, index) => xProgramPanel.render(group, null, { index })))
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-program.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content().querySelector('template').content).importLinks(__dirname)
  })
  .setRenderer(xProgram_renderer)
