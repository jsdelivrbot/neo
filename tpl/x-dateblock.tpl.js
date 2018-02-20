const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}


/**
 * @summary A `<tr.c-DateBlock__Item>` subcomponent containing a pair of `<td>`s,
 * marking up this date range as an important date with date and description.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.Action} data a JSON object representing an important date
 * @param {string}  data.name the name of the date range
 * @param {string}  data.startTime the start time, in ISO string format
 * @param {string=} data.endTime   the end   time, in ISO string format
 * @param {string=} data.url the url of the important date
 */
function xDateblock(frag, data) {
  let date_start = new Date(data.startTime)
  let date_end   = (data.endTime) ? new Date(data.endTime) : null

  frag.querySelector('[itemprop="startTime"]').dateTime    = date_start.toISOString()
  frag.querySelector('[itemprop="startTime"]').textContent = xjs.Date.format(date_start, 'M j, Y')
  if (date_end) {
    frag.querySelector('[itemprop="endTime"]').dateTime    = date_end.toISOString()
    frag.querySelector('[itemprop="endTime"]').textContent = xjs.Date.format(date_end, 'M j, Y')
  } else {
    frag.querySelector('[itemprop="startTime"] + span').remove()
    frag.querySelector('[itemprop="endTime"]').remove()
    frag.querySelector('[itemprop="startTime"]').setAttribute('itemprop', 'startTime endTime')
  }

  new xjs.HTMLAnchorElement(frag.querySelector('a')).attr({
    href: data.url || null,
    itemprop: (data.url) ? 'url' : null,
  }).textContent(data.name)
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-dateblock.tpl.html'))
  .setRenderer(xDateblock)
