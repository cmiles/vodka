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

import * as Utils from '../utils.js';

import { ContextType } from '../contexttype.js'
import { NexContainer } from './nexcontainer.js'
import { EError } from './eerror.js'
import { experiments } from '../globalappflags.js'
import { RENDER_FLAG_EXPLODED } from '../globalconstants.js'

/**
 * Represents a line in a document.
 * @extends NexContainer
 */
class Line extends NexContainer {

	/**
	 * Creates a line.
	 */
	constructor() {
		super();
		this.pfstring = null;
		this.setHorizontal();
	}

	/** @override */
	getTypeName() {
		return '-line-';
	}

	makeCopy(shallow) {
		let r = new Line();
		this.copyChildrenTo(r, shallow);
		this.copyFieldsTo(r);
		return r;
	}

	toString(version) {
		if (version == 'v2') {
			return this.toStringV2();
		}
		return '[' + super.childrenToString() + ']';
	}

	toStringV2() {
		return `[line]${this.listStartV2()}${this.toStringV2TagList()}${super.childrenToString('v2')}${this.listEndV2()}`;
	}

	prettyPrintInternal(lvl, hdir) {
		return this.standardListPrettyPrint(lvl, '[line]', hdir);
	}

	toggleDir() {} // can only be horizontal
	setVertical() {}

	getValueAsString() {
		let s = '';
		this.doForEachChild(c => {
			if (c.getTypeName() == '-letter-') {
				s += c.getText();
			} else if (c.getTypeName() == '-separator-') {
				s += c.getText();
			} else if (c.getTypeName() == '-newline-') {
				s += '\n';
			} else if (c.getTypeName() == '-word-') {
				s += c.getValueAsString();
			} else {
				throw new EError('cannot convert line to string, invalid format');
			}
		});
		return s;
	}

	getKeyFunnelForContext(context) {
		if (context == KeyContext.DOC) {
			return new LineKeyFunnel(this);
		}
		return null;
	}

	setPfont(pfstring) {
		this.pfstring = pfstring;
		this.doForEachChild(function(c) {
			c.setPfont(pfstring);
		})
	}

	insertChildAt(c, i) {
		if (this.pfstring) {
			c.setPfont(this.pfstring);
		}
		super.insertChildAt(c, i);
	}

	getContextType() {
		return ContextType.LINE;
	}

	// deprecated
	getKeyFunnel() {
		return new LineKeyFunnel(this);
	}

	renderInto(renderNode, renderFlags, withEditor) {
		let domNode = renderNode.getDomNode();
		super.renderInto(renderNode, renderFlags, withEditor);
		domNode.classList.add('line');
		domNode.classList.add('data');
		// weird
		let hasDocChild = false;
		for (let i = 0; i < this.numChildren() ;i++) {
			let c = this.getChildAt(i);
			if (Utils.isDocElement(c)) {
				hasDocChild = true;
				break;
			}
		}
		if ((!(renderFlags & RENDER_FLAG_EXPLODED)) && !hasDocChild) {
			domNode.classList.add('emptyline');
		} else {
			domNode.classList.remove('emptyline');
		}
	}

	getEventOverrides() {
		return {
			'-newline-': {
				'Tab': 'move-to-next-leaf',
				'ArrowUp': 'move-to-corresponding-letter-in-previous-line',
				'ArrowDown': 'move-to-corresponding-letter-in-next-line',
				'ArrowLeft': 'move-to-previous-leaf',
				'ArrowRight': 'move-to-next-leaf',
				'Enter': 'do-line-break-after-letter'
			},
			'*': {
				'Enter': 'do-line-break-in-line'
			}
		}
	}

	getDefaultHandler() {
		return 'lineDefault';
	}

	getEventTable(context) {
		return {
			'ShiftBackspace': 'remove-selected-and-select-previous-leaf-v2',
			'Backspace': 'remove-selected-and-select-previous-leaf-v2',
			'Enter': 'do-line-break-from-line-v2',
			'ArrowUp': 'move-to-corresponding-letter-in-previous-line-v2',
			'ArrowDown': 'move-to-corresponding-letter-in-next-line-v2',
			'ArrowLeft': 'move-to-previous-leaf-v2',
			'ArrowRight': 'move-to-next-leaf-v2',
		}
	}
}

export { Line }

