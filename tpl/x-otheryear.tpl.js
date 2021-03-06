const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

const {xAddress} = require('aria-patterns')


/**
 * @summary xOtheryear renderer.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.Event} data a JSON object representing a single conference event
 * @param {string}  data.name the name of the conference
 * @param {string}  data.url the url of the conference
 * @param {string=} data.image the hero image for the conference
 * @param {string=} data.startDate the starting date of the conference, in ISO string format
 * @param {sdo.PostalAddress=} data.location the promoted location of the conference
 * @param {string=} data.location.image the promoted location of the conference
 * @param {string=} data.disambiguatingDescription blurb promoting the prev/next conference
 */
function xOtheryear_renderer(frag, data) {
  /* // BUG https://github.com/jsdom/jsdom/issues/1895
  new xjs.HTMLElement(frag.querySelector('.c-Banner')).style('--banner-img', (data.image) ? `url('${data.image}')` : null)
   */ frag.querySelector('.c-Banner').setAttribute('style', `--banner-img: ${(data.image) ? `url('${data.image}')` : null};`)


  frag.querySelector('[itemprop="name"]'         ).textContent  = data.name
  frag.querySelector('a[itemprop="url"]'         ).href = data.url
  frag.querySelector('meta[itemprop="startDate"]').content      = data.startDate
  frag.querySelector('slot[name="location"]'     ).append(xAddress.render({
    ...data.location,
    $itemprop: 'location',
    $regionName: true,
  }))

  if (data.disambiguatingDescription) {
    frag.querySelector('[itemprop="disambiguatingDescription"]').textContent = data.disambiguatingDescription
  } else {
    frag.querySelector('[itemprop="disambiguatingDescription"]').remove()
  }
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-otheryear.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content()).importLinks(__dirname)
  })
  .setRenderer(xOtheryear_renderer)
