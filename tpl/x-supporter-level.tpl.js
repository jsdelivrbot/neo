const path = require('path')

const xjs = require('extrajs-dom')

const xSupporter = require('./x-supporter.tpl.js')


/**
 * @summary A `<section.c-SupporterBlock>` marking up a group of supporter logos belonging to one level.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {!Object} data a JSON object representing the supporter level
 * @param {string} data.name the name of the level
 * @param {Array<sdo.Organization>} data.supporters all the supporters in this level
 * @param {string=} data.classname any classname to add to the `<section>`
 */
function xSupporterLevel_renderer(frag, data) {
  new xjs.HTMLElement(frag.querySelector('.c-SupporterBlock')).addClass(data.classname || '')
  frag.querySelector('.c-SupporterBlock__Hn').textContent = data.name
  new xjs.HTMLUListElement(frag.querySelector('.c-SupporterBlock__List')).populate(data.supporters, function (f, d) {
    new xjs.HTMLLIElement(f.querySelector('li')).empty().append(xSupporter.render(d))
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-supporter-level.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content().querySelector('template').content).importLinks(__dirname)
  })
  .setRenderer(xSupporterLevel_renderer)
