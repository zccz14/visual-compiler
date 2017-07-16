import {ISyntaxTree, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";
import Context from "../context";
import { IIntermediate } from "../compiler";

/**
 * <DoWhile> ::= <Keyword do> <Statement> <Keyword while> <Expression>
 */
@SyntaxTreeType
export default class DoWhile implements ISyntaxTree {
	gen(list: IIntermediate[]): void {
		throw new Error("Method not implemented.");
	}
	check(context: Context): void {
		throw new Error("Method not implemented.");
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
