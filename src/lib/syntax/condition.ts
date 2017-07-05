import {ISyntaxTree, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";

/**
 * <Condition> ::= <Keyword if> <Expression> <Keyword then> <Statement> |
 *                 <Keyword if> <Expression> <Keyword then> <Statement> <Keyword else> <Statement>
 */
@SyntaxTreeType
export default class Condition implements ISyntaxTree {
    static parse(ts: ITokenIterator): Condition {
	let res = new Condition();
	if (ts.cur().text === 'if') {
	    ts.accept();
	    res.condition = Expression.parse(ts);
	    if (ts.cur().text === 'then') {
		ts.accept();
		res.statementT = Statement.parse(ts);
		if (ts.cur().text === 'else') {
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
