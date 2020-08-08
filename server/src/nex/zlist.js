/*
This file is part of Vodka.

Vodka is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Vodka is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Vodka.  If not, see <https://www.gnu.org/licenses/>.
*/

import { NexContainer } from './nexcontainer.js'
import { ContextType } from '../contexttype.js'
import { RENDER_FLAG_EXPLODED } from '../globalconstants.js'

class Zlist extends NexContainer {
	constructor() {
		super();
	}

	getTypeName() {
		return '-zlist-';
	}

	makeCopy(shallow) {
		let r = new Zlist();
		this.copyChildrenTo(r, shallow);
		this.copyFieldsTo(r);
		return r;
	}

	toString() {
		return '<' + super.childrenToString() + '>';
	}

	getKeyFunnel() {
		return null;
	}

	getContextType() {
		return ContextType.DOC;
	}

	renderInto(renderNode, renderFlags) {
		let domNode = renderNode.getDomNode();
		// set the height before calling super.renderInto so that the height
		// can be overridden by apply-css-style-to
		if (renderFlags & RENDER_FLAG_EXPLODED) {
			domNode.style.height = '' + (this.numChildren() * 10) + 'px'; 
		} else {
			domNode.style.height = '0px';
		}
		super.renderInto(renderNode, renderFlags);
		domNode.classList.add('zlist');
		domNode.classList.add('data');
	}

	getDefaultHandler() {
		return 'zlistDefault';
	}

	getEventTable(context) {
		return {
		}
	}
}


export { Zlist }

