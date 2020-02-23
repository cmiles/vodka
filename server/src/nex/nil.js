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



class Nil extends ValueNex {
	constructor() {
		super('', '^', 'nil')
	}

	makeCopy() {
		let r = new Nil();
		this.copyFieldsTo(r);
		return r;
	}

	isEmpty() {
		return true;
	}

	getKeyFunnel() {
		return new NilKeyFunnel(this);
	}

	deleteLastLetter() {
		return;
	}

	appendText(txt) {
		return;
	}


	getEventTable(context) {
		let defaultHandle = function(txt) {
			if (!(/^.$/.test(txt))) {
				return;
			}
			let letterRegex = /^[a-zA-Z0-9']$/;
			let isSeparator = !letterRegex.test(txt);

			if (isSeparator) {
				manipulator.insertAfterSelectedAndSelect(new Separator(txt))
			} else {
				let w = new Word();
				w.appendChild(new Letter(txt));
				manipulator.insertAfterSelectedAndSelect(w);
				w.setSelected();
			}
		}.bind(this);
		return {
			'ShiftTab': 'select-parent',
			'Tab': 'select-next-sibling',
			'ArrowUp': 'move-left-up',
			'ArrowDown': 'move-right-down',
			'ArrowLeft': 'move-left-up',
			'ArrowRight': 'move-right-down',
			'ShiftBackspace': 'remove-selected-and-select-previous-leaf',
			'Backspace': 'remove-selected-and-select-previous-leaf',
			'Enter': 'do-line-break-always',
			'ShiftEnter': 'evaluate-nex',
			'~': 'insert-command-as-next-sibling',
			'!': 'insert-bool-as-next-sibling',
			'@': 'insert-symbol-as-next-sibling',
			'#': 'insert-integer-as-next-sibling',
			'$': 'insert-string-as-next-sibling',
			'%': 'insert-float-as-next-sibling',
			'^': 'insert-nil-as-next-sibling',
			'&': 'insert-lambda-as-next-sibling',
			'(': 'insert-word-as-next-sibling',
			'[': 'insert-line-as-next-sibling',
			'{': 'insert-doc-as-next-sibling',
			'defaultHandle': defaultHandle
		}
	}
}