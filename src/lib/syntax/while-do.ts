import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";
import { CESyntax, IIntermediate } from "../compiler";
import Context from "../context";
import Quad, { backpatch, merge } from "../quad";

/**
 * <WhileDo> ::= <Keyword while> <Expression> <Keyword do> <Statement>
 */
@SyntaxTreeType
export default class WhileDo implements ISyntaxTree {
	gen(list: Quad[]): void {
		this['QUAD'] = list.length + 1;
		if (this.condition.constant) {
			if (this.condition.value) {
				this.statement.gen(list);
				this['CHAIN'] = this.statement['CHAIN'];
			} else {
				// while false: do not generate statement
				return;
			}
		} else {
			this.condition.gen(list);
			backpatch(list, this.condition.expr['TC'], list.length + 1);
			this.statement.gen(list);
			this['CHAIN'] = merge(list, this.condition.expr['FC'], this.statement['CHAIN'] || 0);
		}
		list.push(new Quad('j', '', '', this['QUAD']));
	}
	check(context: Context): void {
		this.condition.check(context);
		this.statement.check(context);
	}
	static parse(ts: ITokenIterator): WhileDo {
		let res = new WhileDo();
		if (ts.cur().text === 'while') {
			ts.accept();
			res.condition = Expression.parse(ts);
			if (ts.cur().text === 'do') {
				ts.accept();
				res.statement = Statement.parse(ts);
			} else {
				throw new CESyntax('miss do', ts.cur());
			}
		} else {
			throw new CESyntax('miss while', ts.cur());
		}
		return res;
	}
	condition: Expression;
	statement: Statement;
}
