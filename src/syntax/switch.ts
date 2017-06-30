import { ISyntaxTree, ISyntaxTreeConstructor, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Statement, { StatementList } from "./statement";
import Expression from "./expression";

/**
 * <Switch> ::= <Keyword switch> <Expression> <Keyword of> <BranchList> <Keyword end>
 */
@SyntaxTreeType
export default class Switch implements ISyntaxTree {
    static parse(ts: ITokenIterator): Switch {
        let res = new Switch();
        if (ts.cur().text === 'switch') {
            ts.accept();
            res.expr = Expression.parse(ts);
            if (ts.cur().text === 'of') {
                ts.accept();
                while (ts.cur()) {
                    // parse branchs
                    if (ts.cur().text === 'case') {
                        res.branchs.push(Branch.parse(ts));
                    } else {
                        break;
                    }
                }
                if (ts.cur().text === 'end') {
                    ts.accept();
                } else {
                    throw new Error('SyntaxError: end');
                }
            } else {
                throw new Error('SyntaxError: of');
            }
        } else {
            throw new Error('SyntaxError: Switch');
        }
        return res;
    }
    expr: Expression;
    branchs: Branch[] = [];
}

/**
 * <Branch> ::= <Keyword case> <Expression> <Delimiter colon> <StatementList>
 */
@SyntaxTreeType
export class Branch implements ISyntaxTree {
    static parse(ts: ITokenIterator): Branch {
        let res = new Branch();
        if (ts.cur().text === 'case') {
            ts.accept();
            res.expr = Expression.parse(ts);
            if (ts.cur().text === ':') {
                ts.accept();
                res.statements = StatementList.parse(ts);
            } else {
                throw new Error('SyntaxError: expect :');
            }
        } else {
            throw new Error('SyntaxError: expect case');
        }
        return res;
    }
    expr: Expression;
    statements: StatementList;
}