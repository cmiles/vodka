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

function createAsyncBuiltins() {
	Builtin.createBuiltin(
		'ff-after',
		[
			{name: 'exp,', type:'Expectation'},
			{name: 'time#', type:'Integer'}
		],
		function(env, argEnv) {
			let time = env.lb('time#').getTypedValue();
			let exp = env.lb('exp,');
			let newexp = exp.makeCopy();
			setTimeout(function() {
				eventQueue.enqueueExpectationFulfill(newexp);
//				newexp.fulfill();
			}, time);
			return newexp;
		}
	);


	Builtin.createBuiltin(
		'ff-with',
		[
			{name: 'exp,', type:'Expectation'},
			{name: 'func&', type:'Lambda'}
		],
		function(env, argEnv) {
			let lambda = env.lb('func&');
			let exp = env.lb('exp,');
			// because we are making a copy, we check children
			// immediately - if we were not copying, we could
			// check children upon fulfillment
			let newexp = exp.makeCopy();
			newexp.checkChildren();
			let fff = function() {
				let cmd = new Command('');
				cmd.appendChild(lambda);
				cmd.appendChild(newexp.getChildAt(0));
				return evaluateNexSafely(cmd, argEnv);
			};
			newexp.setFFF(fff);
			return newexp;
		}
	);

	Builtin.createBuiltin(
		'discontinue',
		[
			{name: 'exp,', type: 'Expectation', skipeval: true}
		],
		function(env, argEnv) {
			let exp = env.lb('exp,').makeCopy();
			exp.discontinue();
			return exp;
		}
	);

	Builtin.createBuiltin(
		'ff-after-child',
		[
			{name: 'exp1,', type:'Expectation'},
			{name: 'exp2,', type:'Expectation'},
		],
		function(env, argEnv) {
			let exp1 = env.lb('exp1,');
			if (exp1.numChildren() == 0) {
				throw new EError('ff-after-child: cannot chain an empty expectation');
			}
			if (exp1.numChildren() > 1) {
				throw new EError('ff-after-child: too many children, cannot chain');
			}
			let exp2 = exp1.getChildAt(0);
			exp2.addCompletionListener(exp1);
			return exp1;
		}
	);	

	// deprecated
	Builtin.createBuiltin(
		'do-when-fulfilled',
		[
			{name: 'func&', type:'Lambda'},
			{name: 'exp,', type:'Expectation'}
		],
		function(env, argEnv) {
			let lambda = env.lb('func&');
			let exp = env.lb('exp,');
			let retExp = new Expectation();
			exp.addCompletionListener(function(result) {
				let cmd = new Command('');
				cmd.appendChild(lambda);
				cmd.appendChild(result);
				let newresult = evaluateNexSafely(cmd, argEnv);
				retExp.fulfill(newresult);
			})
			return retExp;
		}
	);

	// deprecated
	Builtin.createBuiltin(
		'eval-after',
		[
			{name: 'cmd', type:'*'},
			{name: 'time#', type:'Integer'}
		],
		function(env, argEnv) {
			let time = env.lb('time#').getTypedValue();
			let toEval = env.lb('cmd');
			let exp = new Expectation();
			setTimeout(function() {
				exp.fulfill(evaluateNexSafely(toEval, argEnv));
			}, time);
			return exp;
		}
	);

	Builtin.createBuiltin(
		'make-expectation',
		[
			{name: 'nex', type:'*'}
		],
		function(env, argEnv) {
			let exp = new Expectation();
			exp.appendChild(env.lb('nex'));
			return exp;
		}
	);



	Builtin.createBuiltin(
		'do-on-after',
		[
			{name: 'func&', type:'Lambda'},
			{name: 'arg', type:'*'},
			{name: 'delay#', type:'Integer'}
		],
		function(env, argEnv) {
			let lambda = env.lb('func&');
			let arg = env.lb('arg');
			let delay = env.lb('delay#');
			let e = new Expectation();
			e.appendChild(arg);
			let clearVar = setTimeout(function() {
				let cmd = new Command('');
				cmd.appendChild(lambda);
				e.removeChild(arg); // eventually not needed
				cmd.appendChild(arg);
				let result = evaluateNexSafely(cmd, argEnv);
				e.fulfill(result);
			}.bind(this), delay.getTypedValue());
			e.setDeleteHandler(function() {
				clearTimeout(clearVar);
			}.bind(this));
			return e;
		}
	);
}