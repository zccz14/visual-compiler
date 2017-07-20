import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";
import Context from "../context";
import { CESyntax, IIntermediate } from '../compiler';
import Quad, { backpatch, merge } from '../quad';

/**
 * <Condition> ::= <Keyword if> <Expression> <Keyword then> <Statement> |
 *                 <Keyword if> <Expression> <Keyword then> <Statement> <Keyword else> <Statement>
 */
@SyntaxTreeType
export default class Condition implements ISyntaxTree {
	gen(list: Quad[]): void {
		this.condition.gen(list);
		backpatch(list, this.condition['TC'], list.length + 1);
		this.statementT.gen(list);
		this['CHAIN'] = merge(list, this.condition['FC'], this.statementT['CHAIN']);
		if (this.statementF) {
			list.push(new Quad('j', '_', '_', 0)); // avoid drop
			this['CHAIN'] = merge(list, this.condition['CHAIN'], list.length);
			backpatch(list, this.condition['FC'], list.length + 1);
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
				throw new CESyntax('miss "then"', ts.cur());
			}
		} else {
			throw new CESyntax('miss "if"', ts.cur());
		}
		return res;
	}
	condition: Expression;
	statementT: Statement;
	statementF: Statement;
}
