const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

const {xAddress} = require('aria-patterns')


/**
 * @summary xOtheryear renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.Event}         data a JSON object representing a single conference event
 * @param   {string}            data.name                      http://schema.org/name
 * @param   {string}            data.url                       http://schema.org/url
 * @param   {string}            data.startDate                 http://schema.org/startDate
 * @param   {string=}           data.image                     http://schema.org/image
 * @param   {sdo.PostalAddress} data.location                  http://schema.org/location
 * @param   {string=}           data.disambiguatingDescription http://schema.org/disambiguatingDescription
 * @param   {!Object=} opts additional rendering options
 */
module.exports.renderer = function xOtheryear_renderer(frag, data, opts = {}) {
  /* // BUG https://github.com/jsdom/jsdom/issues/1895
  new xjs.HTMLElement(frag.querySelector('.c-Banner')).style('--banner-img', (data.image) ? `url('${data.image}')` : null)
   */ frag.querySelector('.c-Banner').setAttribute('style', `--banner-img: ${(data.image) ? `url('${data.image}')` : null};`)


  frag.querySelector('[itemprop="name"]'         ).textContent = data.name
  frag.querySelector('a[itemprop="url"]'         ).href        = data.url
  frag.querySelector('meta[itemprop="startDate"]').content     = data.startDate
  frag.querySelector('[itemprop="location"]'     ).append(xAddress.render({
    ...data.location,
    $regionName: true,
  }))

  if (data.disambiguatingDescription) {
    frag.querySelector('[itemprop="disambiguatingDescription"]').textContent = data.disambiguatingDescription
  } else {
    frag.querySelector('[itemprop="disambiguatingDescription"]').remove()
  }
}

module.exports.template = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-otheryear.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content()).importLinks(__dirname)
  })
