import * as path from 'path'

import * as xjs1 from 'extrajs'
import * as xjs2 from 'extrajs-dom'
import {Processor} from 'template-processor'

const xjs = { ...xjs1, ...xjs2 }


const template = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, '../../tpl/x-directory.tpl.html'))
  .node

type DataType = sdo.WebPage & {
	hasPart?: sdo.WebPage|sdo.WebPage[];
}

interface OptsType {
	/** A non-negative integer, or `Infinity`: how many levels deep the outline should be; default is `Infinity` */
	depth?: number;
	/** which subpage to start at, non-negative integer; default is `0` */
	start?: number;
	/** which subpage to end at, non-negative integer or `Infinity`; default is `Infinity` */
	end?: number;
	/** group set of css class configurations */
	classes?: null|{
		/** list classes (`<ol>`) */
		list?: string;
		/** item classes (`<li>`) */
		item?: string;
		/** link classes (`<a>`) */
		link?: string;
		/** classes for page icon */
		icon?: string;
		/** classes for `expand_more` icon */
		expand?: string;
	};
	/** unknown docs */
	links?: object;
	/** configurations for nested outlines */
	options?: OptsType;
}

/**
 * A nested `<ol>` marking up a site directory.
 * @param   frag the template content to process
 * @param   data a webpage with possible subpages
 * @param   opts additional processing options
*/
function instructions(frag: DocumentFragment, data: DataType, opts: OptsType): void {
  let subpages = (xjs.Object.typeOf(data.hasPart) === 'array' ) ? data.hasPart : [data.hasPart]
  let depth    = (xjs.Object.typeOf(opts.depth)   === 'number') ? opts.depth   : Infinity
  new xjs.HTMLOListElement(frag.querySelector('ol'))
    .replaceClassString('{{ classes.list }}', opts.classes && opts.classes.list || '')
    .populate(function (f, d, o = {}) {
      new xjs.HTMLLIElement(f.querySelector('[itemprop="hasPart"]')).replaceClassString('{{ classes.item }}', opts.classes && opts.classes.item || '')
      new xjs.HTMLAnchorElement(f.querySelector('[itemprop="url"]'))
        .replaceClassString('{{ classes.link }}', opts.classes && opts.classes.link || '')
        .href(d.url()) // TODO don’t use Page#url()
      f.querySelector('slot[itemprop="name"]').textContent = d.name() // TODO don’t use Page#name()

      /**
       * @summary References to formatting elements.
       * @description We want to create these references before removing any elements from the DOM.
       * @private
       * @constant {!Object}
       */
      const formatting = {
        /** Icons for links. */ icons: [...f.querySelectorAll('i.material-icons')],
      }
      if (xjs.Object.typeOf(opts.classes && opts.classes.icon) === 'string') {
        new xjs.HTMLElement(formatting.icons[0])
          .replaceClassString('{{ classes.icon }}', opts.classes && opts.classes.icon || '')
          .textContent(d.getIcon()) // TODO don’t use ConfPage#getIcon()
      } else {
        formatting.icons[0].remove()
      }
      if (xjs.Object.typeOf(opts.classes && opts.classes.expand) === 'string' && d.findAll().length) { // TODO don’t use Page#findAll
        new xjs.HTMLElement(formatting.icons[1])
          .replaceClassString('{{ classes.expand }}', opts.classes && opts.classes.expand || '')
      } else {
        formatting.icons[1].remove()
      }

      if (d.findAll().length && depth > 0) { // TODO don’t use Page#findAll
        f.querySelector('[itemprop="hasPart"]').append(
          require(__filename).template.render(instructions, {
            ...d,
            hasPart: d.findAll().filter((p) => !p.isHidden()),
          }, {
            ...(opts.options || {}),
            depth: depth - 1,
          })
        )
      }
    }, subpages)
}

export default new Processor(template, instructions)
