//startgnumessage//
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
//endgnumessage//
//testname// functions_make_makeline
//startdescription//
/*
makes a line
*/
//enddescription//
//testspec// |Shift|~|m|a|k|e|-|l|i|n|e|Tab|a|b|c|d|Shift|Tab|Enter
//starttest//
var harness = require('../testharness');

var testactions = [];

testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Backquote'});
testactions.push({type:'keyup',code:'Backquote'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'KeyM'});
testactions.push({type:'keyup',code:'KeyM'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyK'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyK'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keydown',code:'Minus'});
testactions.push({type:'keyup',code:'Minus'});
testactions.push({type:'keydown',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyI'});
testactions.push({type:'keyup',code:'KeyL'});
testactions.push({type:'keydown',code:'KeyN'});
testactions.push({type:'keydown',code:'KeyE'});
testactions.push({type:'keyup',code:'KeyN'});
testactions.push({type:'keyup',code:'KeyE'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keydown',code:'KeyA'});
testactions.push({type:'keyup',code:'KeyA'});
testactions.push({type:'keydown',code:'KeyB'});
testactions.push({type:'keyup',code:'KeyB'});
testactions.push({type:'keydown',code:'KeyC'});
testactions.push({type:'keyup',code:'KeyC'});
testactions.push({type:'keydown',code:'KeyD'});
testactions.push({type:'keyup',code:'KeyD'});
testactions.push({type:'keydown',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Tab'});
testactions.push({type:'keyup',code:'Tab'});
testactions.push({type:'keyup',code:'ShiftRight'});
testactions.push({type:'keydown',code:'Enter'});
testactions.push({type:'keyup',code:'Enter'});

harness.runTestNew(testactions, 'direct');
//endtest//
