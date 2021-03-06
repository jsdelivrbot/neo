const path = require('path')

const xjs = require('extrajs-dom')

const xSupporterLevel = require('./x-supporter-level.tpl.js')


/**
 * @summary xListSupporterLevel renderer.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {!Object} data JSON object
 * @param {Array<string>} data.supporterlevels the list of supporter levels to display
 * @param {boolean=} data.small should logo sizing be overridden to small?
 */
function xListSupporterLevel_renderer(frag, data) {
  new xjs.HTMLOListElement(frag.querySelector('ol')).populate(data.supporterlevels.map((name, index) => ({ name, index })), function (f, d) {
    new xjs.HTMLLIElement(f.querySelector('li')).empty().append(
      xSupporterLevel.render({
        name: d.name,
        classname: (data.small) ? 'c-SupporterBlock--sml' : (d.index + 1  <  data.supporterlevels.length / 2) ? 'c-SupporterBlock--lrg' : 'c-SupporterBlock--med', // TODO make small the default size
        supporters: (this.sponsor || []).filter((supporter) => supporter.$level === d.name),
      })
    )
  }, this)
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-list-supporter-level.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content().querySelector('template').content).importLinks(__dirname)
  })
  .setRenderer(xListSupporterLevel_renderer)
