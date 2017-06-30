import { ISyntaxTree, ISyntaxTreeConstructor, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Expression from "./expression";
import WhileDo from "./while-do";
import DoWhile from "./do-while";
import { BaseTypeSet } from "./base-type";
import Definition from "./definition";
import Switch from "./switch";

/**
 * <Statement> ::= <Expression> | <WhileDo> | <DoWhile> | <Definition> | <Switch>
 *                 <Delimiter LeftBrace> <StatementList> <Delimiter RightBrace>
 */
@SyntaxTreeType
export default class Statement implements ISyntaxTree {
    static parse(ts: ITokenIterator): Statement {
        let res = new Statement();
        if (ts.cur().text === 'while') {
            res.statement = WhileDo.parse(ts);
        } else if (ts.cur().text === 'do') {
            res.statement = DoWhile.parse(ts);
        } else if (ts.cur().text === 'switch') {
            res.statement = Switch.parse(ts);
        } else if (BaseTypeSet.has(ts.cur().text)) {
            res.statement = Definition.parse(ts);
        } else if (ts.cur().getType() === 'identifier' || ts.cur().getType() === 'literal') {
            res.statement = Expression.parse(ts);
        } else if (ts.cur().text === '{') {
            ts.accept();
            res.statement = StatementList.parse(ts);
            if (ts.cur().text === '}') {
                ts.accept();
            } else {
                throw new Error('SyntaxError: Expect }');
            }
        } else {
            throw new Error('SyntaxError: Statement');
        }
        return res;
    }
    statement: ISyntaxTree;
}

/**
 * <StatementList> ::= <Statement> <Delimiter semicolon> <StatementList>
 */
@SyntaxTreeType
export class StatementList implements ISyntaxTree {
    static parse(ts: ITokenIterator): StatementList {
        let res = new StatementList();
        while (ts.cur()) {
            res.list.push(Statement.parse(ts));
            if (ts.cur() && ts.cur().text === ';') {
                ts.accept();
            } else {
                break;
            }
        }
        return res;
    }
    list: Statement[] = [];
}