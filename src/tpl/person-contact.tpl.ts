import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'

import {PersonJobtitle} from '../interfaces'

const {xPersonFullname} = require('aria-patterns')


const template = xjs.HTMLTemplateElement
  .fromFileSync(path.resolve(__dirname, '../../tpl/x-person-contact.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content()).importLinks(__dirname)
  })
  .node

/**
 * Markup for a person and contact information.
 * @param   frag the template content to process
 * @param   data a person that has a job title
 */
function instructions(frag: DocumentFragment, data: PersonJobtitle): void {
  frag.querySelector('[itemprop="name"]').append(xPersonFullname.render(data))
  frag.querySelector('[itemprop="jobTitle"]' ).textContent = data.jobTitle

  new xjs.HTMLAnchorElement(frag.querySelector('[itemprop="email"]'))
    .href(data.email ? `mailto:${data.email}` : null)
    .attr('itemprop', data.email ? 'email' : null)

  if (data.telephone) {
    new xjs.HTMLAnchorElement(frag.querySelector('[itemprop="telephone"]'))
      .href(data.telephone)
      .attr('itemprop', data.telephone)
      .textContent(data.telephone)
  } else {
    frag.querySelector('[itemprop="jobTitle"] + span').remove()
    frag.querySelector('[itemprop="telephone"]').remove()
  }
}

export default new Processor(template, instructions)
