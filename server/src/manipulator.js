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

var CLIPBOARD = null;

import * as Utils from './utils.js'

import { systemState } from './systemstate.js'
import { Nex } from './nex/nex.js' 
import { Root } from './nex/root.js' 
import { InsertionPoint } from './nex/insertionpoint.js' 
import { RenderNode } from './rendernode.js' 
import { Word } from './nex/word.js' 
import { EString } from './nex/estring.js' 
import { Command } from './nex/command.js' 
import { Line } from './nex/line.js' 
import { Newline } from './nex/newline.js' 


class Manipulator {

	conformData(data) {
		if (data instanceof Nex) {
			return new RenderNode(data);
		} else return data;
	}

	doCut() {
		CLIPBOARD = systemState.getGlobalSelectedNode().getNex();
		let x = systemState.getGlobalSelectedNode();
		this.selectPreviousSibling() || this.selectParent();		
		this.removeNex(x);
	}

	doCopy() {
		CLIPBOARD = systemState.getGlobalSelectedNode().getNex();
	}

	doPaste() {
		if (Utils.isInsertionPoint(systemState.getGlobalSelectedNode())) {
			this.replaceSelectedWith(CLIPBOARD.makeCopy())
		} else {
			this.insertAfterSelectedAndSelect(CLIPBOARD.makeCopy())
		}
	}

	findNextSiblingThatSatisfies(f) {
		while (this.selectNextSibling()) {
			if (f(systemState.getGlobalSelectedNode())) {
				return true;
			}
		}
		return false;
	}

	// used for up and down arrows.

	selectCorrespondingLetterInPreviousLine() {
		// get the current line and the previous line.
		let enclosingLine = this.getEnclosingLine(systemState.getGlobalSelectedNode());
		if (!enclosingLine) return false;
		let doc = enclosingLine.getParent();
		if (!doc) return false;
		let previousLine = doc.getChildBefore(enclosingLine);
		if (!previousLine) return false;

		let original = (systemState.getGlobalSelectedNode());
		let targetX = original.getLeftX();
		let c;

		previousLine.setSelected();
		this.selectFirstLeaf();
		let lastX = (systemState.getGlobalSelectedNode()).getLeftX();
		if (targetX <= lastX) {
			return true;
		}

		do {
			if (this.getEnclosingLine((systemState.getGlobalSelectedNode())) != previousLine) {
				this.selectPreviousLeaf();
				break;
			}
			let x = (systemState.getGlobalSelectedNode()).getLeftX();
			if (x > targetX) {
				// this is the one
				break;
			}
		} while(this.selectNextLeaf());

		return true;
	}

	selectCorrespondingLetterInNextLine() {
		// get the current line and the previous line.
		let enclosingLine = this.getEnclosingLine((systemState.getGlobalSelectedNode()));
		if (!enclosingLine) return false;
		let doc = enclosingLine.getParent();
		if (!doc) return false;
		let nextLine = doc.getChildAfter(enclosingLine);
		if (!nextLine) return false;

		let original = (systemState.getGlobalSelectedNode());
		let targetX = original.getLeftX();
		let c;

		nextLine.setSelected();
		this.selectFirstLeaf();
		let lastX = (systemState.getGlobalSelectedNode()).getLeftX();
		if (targetX <= lastX) {
			return true;
		}

		do {
			if (this.getEnclosingLine((systemState.getGlobalSelectedNode())) != nextLine) {
				this.selectPreviousLeaf();
				break;
			}
			let x = (systemState.getGlobalSelectedNode()).getLeftX();
			if (x > targetX) {
				// this is the one
				break;
			}
		} while(this.selectNextLeaf());

		return true;
	}

	getEnclosingLine(s) {
		while(s = s.getParent()) {
			if (Utils.isLine(s)) {
				return s;
			}
		}
		return null;
	}

	// traversal

	selectPreviousLeaf() {
		let first = (systemState.getGlobalSelectedNode());
		while(!this.selectPreviousSibling()) {
			let p = this.selectParent();
			if (!p || Utils.isCodeContainer((systemState.getGlobalSelectedNode()))) {
				first.setSelected();
				return false;
			}
		}
		while(!Utils.isCodeContainer((systemState.getGlobalSelectedNode())) && this.selectLastChild());
		return true;
	}

	selectNextLeaf() {
		let first = (systemState.getGlobalSelectedNode());
		while(!this.selectNextSibling()) {
			let p = this.selectParent();
			if (!p || Utils.isCodeContainer((systemState.getGlobalSelectedNode()))) {
				first.setSelected();
				return false;
			}
		}
		while(!Utils.isCodeContainer((systemState.getGlobalSelectedNode())) && this.selectFirstChild());
		return true;
	}

	selectFirstLeaf() {
		let c = (systemState.getGlobalSelectedNode());
		while(Utils.isNexContainer(c) && c.hasChildren()) {
			c = c.getFirstChild();
		}
		c.setSelected();
		return true;
	}

	// generic selection stuff

	selectLastChild() {
		let s = (systemState.getGlobalSelectedNode());
		if (!Utils.isNexContainer(s)) return false;
		let c = s.getLastChild();
		if (c) {
			c.setSelected();
			return true;
		}
		return false;
	}

	selectFirstChild() {
		let s = (systemState.getGlobalSelectedNode());
		if (!Utils.isNexContainer(s)) return false;
		let c = s.getFirstChild();
		if (c) {
			c.setSelected();
			return true;
		}
		return false;
	}

	selectNthChild(n) {
		let s = (systemState.getGlobalSelectedNode());
		if (n >= s.numChildren()) return false;
		if (n < 0) return false;
		let c = s.getChildAt(n);
		if (!c) return false;
		c.setSelected();
		return true;
	}

	selectNextSibling() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		let nextSib = p.getNextSibling(s);
		if (nextSib) {
			nextSib.setSelected();
			return true;
		}
		return false;
	}

	selectPreviousSibling() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		let sib = p.getPreviousSibling(s);
		if (sib) {
			sib.setSelected();
			return true;
		}
		return false;
	}

	selectParent() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		p.setSelected();
		return true;
	}

	// CRUD operations

	appendNewEString() {
		let s = (systemState.getGlobalSelectedNode());
		let i = 0;
		for(i = 0;
			s.getChildAt(i) && Utils.isEString(s.getChildAt(i));
			i++);
		// i is the insertion point
		let n = new EString();
		s.insertChildAt(n, i);
		n.setSelected();
	}

	wrapSelectedInAndSelect(wrapperNex) {
		let s = systemState.getGlobalSelectedNode();
		let p = systemState.getGlobalSelectedNode().getParent();
		if (!p) return false;
		let selectedNex = s.getNex();
		wrapperNex.appendChild(selectedNex);
		let wrapperNode = new RenderNode(wrapperNex);
		p.replaceChildWith(s, wrapperNode);
		wrapperNode.setSelected();
	}

	appendAndSelect(data) {
		data = this.conformData(data);
		let s = systemState.getGlobalSelectedNode();
		let newNode = s.appendChild(data);
		newNode.setSelected();
		return true;		
	}

	insertAfterSelected(data) {
		data = this.conformData(data);
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		p.insertChildAfter(data, s);
		return true;
	}

	insertAfterSelectedAndSelect(data) {
		data = this.conformData(data);
		return this.insertAfterSelected(data)
			&& this.selectNextSibling();
	}

	insertBeforeSelected(data) {
		data = this.conformData(data);
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		p.insertChildBefore(data, s);
		return true;
	}

	insertBeforeSelectedAndSelect(data) {
		return this.insertBeforeSelected(data)
			&& this.selectPreviousSibling();
	}

	attemptToRemoveLastItemInCommand() {
		let p = (systemState.getGlobalSelectedNode()).getParent();
		if (!p) return false;
		if (p.numChildren() == 1 && Utils.isCodeContainer(p)) {
			if (!this.removeNex((systemState.getGlobalSelectedNode()))) return false;
			p.setSelected();
			this.appendAndSelect(new InsertionPoint());
			return true;
		}
		return false;
	}

	removeSelectedAndSelectPreviousSibling() {
		let toDel = (systemState.getGlobalSelectedNode());
		return (
			this.attemptToRemoveLastItemInCommand()
			||
			(this.selectPreviousSibling() || this.selectParent())
			&&
			this.removeNex(toDel)
		);	
	}

	removeSelectedAndSelectPreviousLeaf() {
		let toDel = (systemState.getGlobalSelectedNode());
		return (
			this.attemptToRemoveLastItemInCommand()
			||
			(this.selectPreviousLeaf() || this.selectParent())
			&&
			this.removeNex(toDel)
		);	
	}

	removeNex(toDel) {
		// toDel must not be a nex, has to be a RenderNode.
		if (!(toDel instanceof RenderNode)) {
			throw new Error('need to delete the rendernode not the nex');
		}
		let p = toDel.getParent();
		if (!p) return false;
		if (
			((p.getNex()) instanceof Root)
			&&
			(p.getNex()).numChildren() == 1
			) {
			toDel.setSelected();
			return false; // can't remove last child of root
		}
		if (toDel.isSelected()) {
			p.setSelected();
		}
		p.removeChild(toDel);
		return true;
	}

	replaceSelectedWith(nex) {
		nex = this.conformData(nex);
		let s = (systemState.getGlobalSelectedNode());
		if (s === nex) return true; // trivially true
		let p = s.getParent(true);
		if (!p) return false;
		p.replaceChildWith(s, nex);
		nex.setSelected();
		return true;
	}

	replaceSelectedWithFirstChildOfSelected() {
		let s = systemState.getGlobalSelectedNode();
		let p = s.getParent(true);
		if (!p) return false;
		if (!(s.numChildren() == 1)) return false;
		let nex = s.getChildAt(0);
		p.replaceChildWith(s, nex);
		nex.setSelected();
		return true;
	}

	replaceSelectedWithNewCommand() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent(true);
		if (!p) return false;
		let nex = new Command();
		p.replaceChildWith(s, nex);
		nex.setSelected();
		return true;
	}

	// split/join

	selectTopmostEnclosingLine() {
		let p = (systemState.getGlobalSelectedNode()).getParent();
		if (!p) return false;
		while(!Utils.isLine(p)) {
			p = p.getParent();
			if (!p) return false;
		}
		while(Utils.isLine(p)) {
			let p2 = p.getParent();
			if (p2 && Utils.isLine(p2)) {
				p = p2;
			} else {
				break;
			}
		}
		p.setSelected();
		return true;
	}

	gatherRemainingSiblingsIntoNewLine() {
		let ln = new Line();
		ln.appendChild(new Newline());
		this.moveRemainingSiblingsInto(ln);
		return ln;
	}

	moveRemainingSiblingsInto(nex) {
		nex = this.conformData(nex);
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		if (p.getLastChild() == s) {
			return true; // nothing to do
		}
		let c;
		while (c = p.getChildAfter(s)) {
			p.removeChild(c);
			nex.appendChild(c);
		}
	}

	split(nex) {
		nex = this.conformData(nex);
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		if (p.getLastChild() == s) {
			return true; // nothing to do
		}
		let c;
		while (c = p.getChildAfter(s)) {
			p.removeChild(c);
			nex.appendChild(c);
		}
		let p2 = p.getParent();
		p2.insertChildAfter(nex, p);
		return true;		
	}

	putAllNextSiblingsInNewLine() {
		return this.split(new Line())
	}

	splitCurrentWordIntoTwo() {
		return this.split(new Word())
	}

	joinSelectedWithNextSibling() {
		// note that after joining, the thing
		// to select is the last thing in
		// the first of the two
		// things being joined.
		let s = (systemState.getGlobalSelectedNode());
		let toSelect = s.getLastChild();
		if (!toSelect) {
			return false;
		}
		let p = s.getParent();
		if (!p) return false;
		let c = p.getChildAfter(s);
		if (!c) return false;		
		let c2;
		while (c2 = c.removeFirstChild()) {
			s.appendChild(c2);
		}
		// now that c is empty, delete it.
		p.removeChild(c);
		toSelect.setSelected();
		return true;
	}

	join(p, a, b) {
		p = this.conformData(p);
		a = this.conformData(a);
		b = this.conformData(b);
		let c;
		while (c = b.removeFirstChild()) {
			a.appendChild(c);
		}
		// now that c is empty, delete it.
		p.removeChild(b);
		return true;
	}

	joinSelectedToNextSiblingIfSameType() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		let c = p.getChildAfter(s);
		if ((Utils.isLine(s) && Utils.isLine(c))
				|| (Utils.isWord(s) && Utils.isWord(c))
				|| (Utils.isDoc(s) && Utils.isDoc(c))) {
			return this.joinSelectedWithNextSibling();
		}
	}

	joinParentOfSelectedToNextSiblingIfSameType() {
		let s = (systemState.getGlobalSelectedNode());
		let p = s.getParent();
		if (!p) return false;
		p.setSelected();
		this.joinSelectedToNextSiblingIfSameType();
	}

	joinToSiblingIfSame(s) {
		s = this.conformData(s);
		let p = s.getParent();
		if (!p) return false;
		let c = p.getChildAfter(s);
		if ((Utils.isLine(s) && Utils.isLine(c))
				|| (Utils.isWord(s) && Utils.isWord(c))
				|| (Utils.isDoc(s) && Utils.isDoc(c))) {
			return this.join(p, s, c);
		}
	}

	// deprecated
	startNewEString() {
		(systemState.getGlobalSelectedNode()).createNewEString();
		return true;
	}

}

const manipulator = new Manipulator();

export { manipulator }

