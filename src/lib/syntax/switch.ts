import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import { StatementList } from "./statement";
import Expression from "./expression";
import Context from "../context";
import { IIntermediate, CESyntax } from "../compiler";
import Quad, { merge, backpatch } from "../quad";

/**
 * <Switch> ::= <Keyword case> <Expression> <Keyword of> <BranchList> <Keyword end>
 */
@SyntaxTreeType
export default class Switch implements ISyntaxTree {
    gen(list: Quad[]): void {
        this.expr.gen(list);
        this.branchs.forEach((v, i) => {
            v.expr.gen(list);
            let t = list.length + 1;
            list.push(new Quad('jne', this.expr.expr.label, v.expr.expr.label, 0));
            v.statements.gen(list);
            this['CHAIN'] = merge(list, this['CHAIN'], v['CHAIN']);
            list.push(new Quad('j', '', '', 0));
            this['CHAIN'] = merge(list, this['CHAIN'], list.length);
            if (i + 1 < list.length || this.otherwise) {
                backpatch(list, t, list.length + 1);
            } else {
                this['CHAIN'] = merge(list, this['CHAIN'], t);
            }
        });
        if (this.otherwise) {
            this.otherwise.gen(list);
            this['CHAIN'] = merge(list, this['CHAIN'], this.otherwise['CHAIN']);
        }
    }
    check(context: Context): void {
        this.expr.check(context);
        this.branchs.forEach(v => v.check(context));
        if (this.otherwise) {
            this.otherwise.check(context);
        }
    }
    static parse(ts: ITokenIterator): Switch {
        let res = new Switch();
        if (ts.cur().text === 'case') {
            ts.accept();
            res.expr = Expression.parse(ts);
            if (ts.cur().text === 'of') {
                ts.accept();
                while (ts.cur()) {
                    // parse branchs
                    if (ts.cur().text === 'otherwise') {
                        ts.accept();
                        if (ts.cur().text === ':') {
                            ts.accept();
                            res.otherwise = StatementList.parse(ts);
                        } else {
                            throw new CESyntax('miss colon after otherwise', ts.cur());
                        }
                    } else if (ts.cur().text !== 'end') {
                        res.branchs.push(Branch.parse(ts));
                    } else {
                        break;
                    }
                }
                if (ts.cur().text === 'end') {
                    ts.accept();
                } else {
                    throw new CESyntax('miss end', ts.cur());
                }
            } else {
                throw new CESyntax('miss of', ts.cur());
            }
        } else {
            throw new CESyntax('miss case', ts.cur());
        }
        return res;
    }
    expr: Expression;
    branchs: Branch[] = [];
    otherwise: StatementList;
}

/**
 * <Branch> ::= <Expression> <Delimiter colon> <StatementList>
 */
@SyntaxTreeType
export class Branch implements ISyntaxTree {
    gen(list: Quad[]): void {
    }
    check(context: Context): void {
        this.expr.check(context);
        this.statements.check(context);
    }
    static parse(ts: ITokenIterator): Branch {
        let res = new Branch();
        res.expr = Expression.parse(ts);
        if (ts.cur().text === ':') {
            ts.accept();
            res.statements = StatementList.parse(ts);
        } else {
            throw new Error('SyntaxError: expect :');
        }
        return res;
    }
    expr: Expression;
    statements: StatementList;
}