import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";
import Context from "../context";
import { IIntermediate } from "../compiler";

/**
 * <Condition> ::= <Keyword if> <Expression> <Keyword then> <Statement> |
 *                 <Keyword if> <Expression> <Keyword then> <Statement> <Keyword else> <Statement>
 */
@SyntaxTreeType
export default class Condition implements ISyntaxTree {
	gen(list: IIntermediate[]): void {
		this.condition.gen(list);
		this.statementT.gen(list);
		if (this.statementF) {
			this.statementF.gen(list);
		}
	}
	check(context: Context): void {
		this.condition.check(context);
		this.statementT.check(context);
		if (this.statementF) {
			this.statementF.check(context);
		}
	}
	static parse(ts: ITokenIterator): Condition {
		let res = new Condition();
		if (ts.cur() && ts.cur().text === 'if') {
			ts.accept();
			res.condition = Expression.parse(ts);
			if (ts.cur() && ts.cur().text === 'then') {
				ts.accept();
				res.statementT = Statement.parse(ts);
				if (ts.cur() && ts.cur().text === 'else') {
					ts.accept();
					res.statementF = Statement.parse(ts);
				}
			} else {
				throw new Error('SyntaxError: Expect then');
			}
		} else {
			throw new Error('SyntaxError: Expect if');
		}
		return res;
	}
	condition: Expression;
	statementT: Statement;
	statementF: Statement;
}
