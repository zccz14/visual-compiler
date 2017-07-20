import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";
import Context from "../context";
import { IIntermediate } from "../compiler";
import Quad, { backpatch, merge } from "../quad";

/**
 * <DoWhile> ::= <Keyword do> <Statement> <Keyword while> <Expression>
 */
@SyntaxTreeType
export default class DoWhile implements ISyntaxTree {
	gen(list: Quad[]): void {
		this['QUAD'] = list.length + 1;
		this.statement.gen(list);
		if (this.condition.constant) { // 
			if (this.condition.value) {
				list.push(new Quad('j', '', '', this['QUAD']));
			} else {
				this['CHAIN'] = this.statement['CHAIN'];
			}
		} else {
			this.condition.gen(list);
			if (this.condition.expr['TC'] === undefined) { // FC === undefined
				this.condition.expr['TC'] = list.length + 1;
				list.push(new Quad('jnz', this.condition.expr.label, '', 0));
				this.condition.expr['FC'] = list.length + 1;
				list.push(new Quad('j', '', '', 0));
			}
			backpatch(list, this.condition.expr['TC'], this['QUAD']);
			this['CHAIN'] = merge(list, this.condition.expr['FC'], this.statement['CHAIN'] || 0);
		}
	}
	check(context: Context): void {
		this.condition.check(context);
		this.statement.check(context);
	}
	static parse(ts: ITokenIterator): DoWhile {
		let res = new DoWhile();
		if (ts.cur().text === 'do') {
			ts.accept();
			res.statement = Statement.parse(ts);
			if (ts.cur().text === 'while') {
				ts.accept();
				res.condition = Expression.parse(ts);
			} else {
				throw new Error('SyntaxError: expect while');
			}
		} else {
			throw new Error('SyntaxError: expect do');
		}
		return res;
	}
	condition: Expression;
	statement: Statement;
}
