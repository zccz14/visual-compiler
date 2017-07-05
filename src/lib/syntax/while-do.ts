import {ISyntaxTree, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";

import Statement from "./statement";
import Expression from "./expression";

/**
 * <WhileDo> ::= <Keyword while> <Expression> <Keyword do> <Statement>
 */
@SyntaxTreeType
export default class WhileDo implements ISyntaxTree {
    static parse(ts: ITokenIterator): WhileDo {
	let res = new WhileDo();
	if (ts.cur().text === 'while') {
	    ts.accept();
	    res.condition = Expression.parse(ts);
	    if (ts.cur().text === 'do') {
		ts.accept();
		res.statement = Statement.parse(ts);
	    } else {
		throw new Error('SyntaxError: expect do');	    
	    }
	} else {
	    throw new Error('SyntaxError: expect while');
	}
	return res;
    }
    condition: Expression;
    statement: Statement;
}
