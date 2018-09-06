import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'

import Supporter from './supporter.tpl'


const template = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, '../../tpl/x-supporter-level.tpl.html'))
  .exe(function () {
    new xjs.DocumentFragment(this.content().querySelector('template').content).importLinks(__dirname)
  })
  .node

type DataType = sdo.Offer & {
	name: string;
	/** if given, either `Small`, `Medium`, or `Large`; the logo size to render */
	$logosize? : string;
	/** is the level awarded to financial contributors? */
	$isSponsor?: boolean;
}

interface OptsType {
	/** should logo sizing be overridden to `Small`? */
	small?: boolean;
  /** any other class(es) to add to the `<section>` */
	classname?: string;
	/** the conference to which this supporter level belongs */
	conference: Conference; // FIXME this should not be required
}

/**
 * A `<section.c-SupporterBlock>` marking up a group of supporter logos belonging to one level.
 * @param   frag the template content to process
 * @param   data the supporter level
 * @param   opts additional processing options
 */
function instructions(frag: DocumentFragment, data: DataType, opts: OptsType): void {
  /**
   * Array of supporters in the level.
   * @type {Array<sdo.Organization>}
   */
  let supporters = (opts.conference._DATA.sponsor || []).filter((org) => org.$level === data.name)
  new xjs.HTMLElement(frag.querySelector('.c-SupporterBlock')).addClass(({
    'Small' : 'c-SupporterBlock--sml',
    'Medium': 'c-SupporterBlock--med',
    'Large' : 'c-SupporterBlock--lrg',
  })[(opts.small) ? 'Small' : (data.$logoSize || 'Small')], opts.classname || '')
  frag.querySelector('.c-SupporterBlock__Hn').textContent = data.name
  new xjs.HTMLUListElement(frag.querySelector('.c-SupporterBlock__List')).populate(function (f, d, o = {}) {
    new xjs.HTMLLIElement(f.querySelector('li')).empty().append(Supporter.process(d, { is_sponsor: data.$isSponsor }))
  }, supporters)
}

export default new Processor(template, instructions)
