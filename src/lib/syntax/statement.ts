import { ISyntaxTree, SyntaxTreeType, SyntaxTreeNode } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";

import Expression from "./expression";
import WhileDo from "./while-do";
import DoWhile from "./do-while";
import { BaseTypeSet } from "./base-type";
import Definition from "./definition";
import Switch from "./switch";
import { IDENTIFIER, LITERAL } from "../token";
import Context from "../context";
import { IIntermediate } from "../compiler";
import Condition from "./condition";
import Quad, { merge, backpatch } from "../quad";

/**
 * <Statement> ::= <Expression> | <WhileDo> | <DoWhile> | <Definition> | <Switch>
 *                 <Delimiter LeftBrace> <StatementList> <Delimiter RightBrace>
 */
@SyntaxTreeType
export default class Statement implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        if (this.statement) {
            this.statement.gen(list);
            this['CHAIN'] = this.statement['CHAIN'] || 0;
        }
    }
    check(context: Context): void {
        if (this.statement instanceof StatementList) {
            // Code Block
            context = new Context(context);
        }
        if (this.statement) {
            this.statement.check(context);
        } else {
            // empty statement
        }
    }
    static parse(ts: ITokenIterator): Statement {
        let res = new Statement();
        if (ts.cur().text === 'while') {
            res.statement = WhileDo.parse(ts);
        } else if (ts.cur().text === 'do') {
            res.statement = DoWhile.parse(ts);
        } else if (ts.cur().text === 'case') {
            res.statement = Switch.parse(ts);
        } else if (ts.cur().text === 'if') {
            res.statement = Condition.parse(ts);
        } else if (BaseTypeSet.has(ts.cur().text)) {
            res.statement = Definition.parse(ts);
        } else if (ts.cur().type === IDENTIFIER || ts.cur().type === LITERAL
            || ts.cur().text === '┐' || ts.cur().text === '('
            || ts.cur().text === '+' || ts.cur().text === '-'
            || ts.cur().text === '++' || ts.cur().text === '--') {
            res.statement = Expression.parse(ts);
        } else if (ts.cur().text === '{') {
            ts.accept();
            res.statement = StatementList.parse(ts);
            if (ts.cur().text === '}') {
                ts.accept();
            } else {
                throw new Error('SyntaxError: Expect }');
            }
        }
        return res;
    }
    statement: ISyntaxTree;
    _type: string = 'Statement';
}

/**
 * <StatementList> ::= <Statement> <Delimiter semicolon> <StatementList>
 */
@SyntaxTreeNode('root')
export class StatementList implements ISyntaxTree {
    gen(list: Quad[]): void {
        this['CHAIN'] = 0;
        this.list.forEach((v, i) => {
            v.gen(list);
            if (i + 1 < this.list.length) {
                backpatch(list, v['CHAIN'], list.length + 1);
            } else {
                this['CHAIN'] = merge(list, this['CHAIN'], v['CHAIN']);
            }
        });
    }
    check(context: Context): void {
        this.list.forEach(v => v.check(context));
    }
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
    type: string = 'StatementList';
}