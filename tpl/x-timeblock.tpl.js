const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}


/**
 * @summary A `<tr.c-TimeBlock__Item>` subcomponent containing a pair of `<td>`s,
 * marking up this date range as a session with time and name.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {Array<sdo.Event>} data an arry of sessions, each with:
 * @param {string}  data.name the name of the session
 * @param {string}  data.startDate the start date, in ISO string format, of the session
 * @param {string}  data.endDate   the end   date, in ISO string format, of the session
 * @param {string=} data.url the url of the session
 * @param   {!Object=} opts additional rendering options
 */
function xTimeblock_renderer(frag, data, opts = {}) {
  new xjs.HTMLTableSectionElement(frag.querySelector('.c-TimeBlock')).populate(data, function (f, d, o = {}) {
    let time_start = new Date(d.startDate)
    let time_end   = new Date(d.endDate  )
    /**
     * @summary References to formatting elements.
     * @description We want to create these references before removing any elements from the DOM.
     * @private
     * @constant {!Object}
     */
    const formatting = {
      /** Start and end times. */ times: [...f.querySelectorAll('.c-TimeBlock__Times')],
    }
    f.querySelectorAll('[itemprop~="startDate"]').forEach((time) => {
      new xjs.HTMLTimeElement(time)
        .dateTime(time_start)
        .textContent(xjs.Date.format(time_start, 'g:ia'))
    })
    new xjs.HTMLTimeElement(f.querySelector('[itemprop="endDate"]'))
      .dateTime(time_end)
      .textContent(xjs.Date.format(time_end, 'g:ia'))
    if (time_start.toISOString() === time_end.toISOString()) {
      formatting.times[1].remove()
    } else {
      formatting.times[0].remove()
    }
    new xjs.HTMLElement(f.querySelector('.c-TimeBlock__Times')).trimInner()

    new xjs.HTMLAnchorElement(f.querySelector('a')).attr({
      href    : d.url || null,
      itemprop: (d.url) ? 'url' : null,
    }).textContent(d.name)
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-timeblock.tpl.html'))
  .setRenderer(xTimeblock_renderer)
