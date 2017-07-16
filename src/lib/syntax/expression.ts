import { ISyntaxTree, ISyntaxTreeConstructor, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import { IDENTIFIER, LITERAL, DELIMITER } from "../token";
import { CESyntax, CESemantic, IIntermediate } from "../compiler";
import Context from "../context";
import { BaseTypeSet } from "./base-type";
import Quad from "../quad";

abstract class AExpression implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        throw new Error("Method not implemented.");
    }
    check(context: Context): void {
        throw new Error("Method not implemented.");
    }
    AlgebraCast(type1: string, type2: string): string {
        if (BaseTypeSet.has(type1) && BaseTypeSet.has(type2)) {
            if (type1 === type2) {
                return type1;
            }
            if ('float' === type1 || 'float' === type2) {
                return 'float';
            }
            return 'int';
        } else {
            throw new CESemantic('Only Allow BaseType Cast', this);
        }
    }

    type: string;
    lvalue: boolean = false;
    constant: boolean = false;
    value: number;
    name: string;
    get label(): string {
        if (this.name) {
            return this.name;
        }
        if (this.constant) {
            return this.value.toString();
        }
        return this['id'];
    }
}

/**
 * <Expression> ::= <ExpressionTop>
 */
@SyntaxTreeType
export default class Expression extends AExpression {
    gen(list: IIntermediate[]): void {
        this.expr.gen(list);
    }
    check(context: Context): void {
        this.expr.check(context);
        this.type = this.expr.type;
        this.lvalue = this.expr.lvalue;
        this.constant = this.expr.constant;
        if (this.constant) {
            this.value = this.expr.value;
        }
    }
    static parse(ts: ITokenIterator): Expression {
        let res = new Expression();
        res.expr = <AExpression>Expression.Top.parse(ts);
        return res;
    }

    static Top: ISyntaxTreeConstructor;
    expr: AExpression;
    _type: string = 'Expression';
    type: string;
}

/**
 * <Expression0> ::= (<Expression>) | <Identifier> | <Literal Numeric>
 */

@SyntaxTreeType
export class Expression0 extends AExpression {
    gen(list: IIntermediate[]): void {
        if (this.expr) {
            this.expr.gen(list);
        }
    }
    check(context: Context): void {
        if (this.id) {
            // identifier: check if defined
            let ctx = context;
            let isFound = false;
            while (true) {
                let symbol = ctx.content.get(this.id);
                if (symbol) {
                    isFound = true;
                    this.type = symbol.type;
                    this.lvalue = true;
                    this.constant = !!symbol.const;
                    // if (this.constant) { // TODO: const int
                    //     this.value = symbol.value;
                    // }
                    break;
                }
                if (ctx.parent) {
                    ctx = ctx.parent;
                } else {
                    break;
                }
            }
            if (!isFound) {
                throw new CESemantic(`${this.id} is not defined in this scope`, this);
            }
        } else if (this.expr) {
            // (Expr)
            this.expr.check(context);
            // keep type, lvalue and constant
            this.type = this.expr.type;
            this.lvalue = this.expr.lvalue
            this.constant = this.expr.constant;
            if (this.constant) {
                this.value = this.expr.value;
            }
        } else if (this.value !== undefined) {
            this.type = (~~this.value === this.value) ? 'int' : 'float';
            this.lvalue = false;
            this.constant = true;
            // this.value = this.value 
        }
    }
    static parse(ts: ITokenIterator): Expression0 {
        let res = new Expression0();
        if (ts.cur().type === IDENTIFIER) {
            // Identifier
            res.id = ts.cur().text;
            ts.accept();
        } else if (ts.cur().type === LITERAL) {
            res.value = parseFloat(ts.cur().text);
            ts.accept();
        } else if (ts.cur().type === DELIMITER && ts.cur().text === '(') {
            ts.accept();
            res.expr = Expression.parse(ts);
            if (ts.cur().type === DELIMITER && ts.cur().text === ')') {
                ts.accept();
            } else {
                throw new Error('SyntaxError: Expect )');
            }
        } else {
            throw new CESyntax('Miss Expression', ts.cur());
        }
        return res;
    }

    id: string;
    expr: Expression;
    value: number;
    _type: string = 'Expression0';
}

/**
 * <Expression1> ::= <Expression1> <Delimiter LeftParentheses> <Argument List> <Delimiter RightParentheses> |
 *                   <Expression1> <Delimiter LeftBracket> <Expression>  <Delimiter RightBracket> |
 *                   <Expression1> <Operator PlusPlus> |
 *                   <Expression1> <Operator SubtractSubtract> |
 *                   <ExpressionBottom>
 *
 */
@SyntaxTreeType
export class Expression1 extends AExpression {
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression1();
        res.operand = Expression0.parse(ts);
        while (ts.cur()) {
            let t = new Expression1();
            t.operand = res;
            if (ts.cur().text === '(') {
                // Function Call
                ts.accept();
                t.operator = 'function-call';
                // Arguments List
                t.funcArgs = [];
                while (true) {
                    if (ts.cur().text === ')') {
                        break;
                    }
                    t.funcArgs.push(Expression.parse(ts));
                    if (ts.cur().text === ',') {
                        ts.accept();
                    } else if (ts.cur().text === ')') {
                        break;
                    } else {
                        throw new Error('Syntax Error: Function Call');
                    }
                }
                if (ts.cur().text === ')') {
                    ts.accept();
                } else {
                    throw new Error('Syntax Error: Expect ) after function call');
                }
            } else if (ts.cur().text === '[') {
                // Array Access
                ts.accept();
                t.operator = 'array-access';
                t.arrayArg = Expression.parse(ts);
                if (ts.cur().text === ']') {
                    ts.accept();
                } else {
                    throw new Error('Syntax Error: Expect ] after array access');
                }
            } else if (ts.cur().text === '++') {
                // Post-Increment
                ts.accept();
                t.operator = 'post-increment';
            } else if (ts.cur().text === '--') {
                // Post-Decrement
                ts.accept();
                t.operator = 'post-decrement';
            } else {
                break;
            }
            if (res.operator === undefined) {
                t.operand = res.operand;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand;
        }
        return res;
    }

    operator: string;
    operand: AExpression;
    arrayArg: Expression;
    funcArgs: Expression[];
    type: string = 'Expression1';
}

/**
 * Unary Right-to-Left Association
 * <Expression2> ::= <Operator Negation> <Expression2> |
 *                   <Operator Plus> <Expression2> |
 *                   <Operator PlusPlus> <Expression2> |
 *                   <Operator Minus> <Expression2> |
 *                   <Operator MinusMinus> <Expression2> |
 *                   <Expression1>
 */
@SyntaxTreeType
export class Expression2 extends AExpression {
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression2();
        if (ts.cur().text === '┐') {
            ts.accept();
            res.operator = 'logical-negation';
            res.operand = Expression2.parse(ts);
        } else if (ts.cur().text === '+') {
            ts.accept();
            res.operator = 'unary-plus';
            res.operand = Expression2.parse(ts);
        } else if (ts.cur().text === '++') {
            ts.accept();
            res.operator = 'pre-increment';
            res.operand = Expression2.parse(ts);
        } else if (ts.cur().text === '-') {
            ts.accept();
            res.operator = 'unary-minus';
            res.operand = Expression2.parse(ts);
        } else if (ts.cur().text === '--') {
            ts.accept();
            res.operator = 'pre-decrement';
            res.operand = Expression2.parse(ts);
        } else {
            res.operand = Expression1.parse(ts);
        }
        if (res.operator === undefined) {
            return res.operand;
        }
        return res;
    }

    operator: string;
    operand: AExpression;
    type: string = 'Expression2';
}
/**
 * Left-to-Right Association 2-ary Operators (Multiply)
 * <Expression3> ::= <Expression3> <Operator Multiply> <Expression2> |
 *                   <Expression2>
 */
@SyntaxTreeType
export class Expression3 extends AExpression {
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression3();
        res.operand1 = Expression2.parse(ts);
        while (ts.cur()) {
            let t = new Expression3();
            t.operand1 = res;
            if (ts.cur().text === '×') {
                ts.accept();
                res.operator = 'multiplication';
                res.operand2 = Expression2.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }

    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    type: string = 'Expression3';
}
/**
 * Left-to-Right Association 2-ary Operators (Addition / Subtraction)
 * <Expression4> ::= <Expression4> <Operator Plus> <Expression3> |
 *                   <Expression4> <Operator Minus> <Expression3> |
 *                   <Expression3>
 */
@SyntaxTreeType
export class Expression4 extends AExpression {
    gen(list: IIntermediate[]): void {
        if (!this.operand1.constant) {
            this.operand1.gen(list);
        }
        if (!this.operand2.constant) {
            this.operand2.gen(list);
        }
        if (!this.constant) {
            this.name = `T${list.length}`;
            list.push(new Quad(this.operator, this.operand1.label, this.operand2.label, this.label));
        }
    }
    check(context: Context): void {
        this.operand1.check(context);
        this.operand2.check(context);
        this.type = this.AlgebraCast(this.operand1.type, this.operand2.type);
        this.lvalue = false;
        this.constant = this.operand1.constant && this.operand2.constant;
        // Constant Calculation
        if (this.constant) {
            switch (this.operator) {
                case 'addition':
                    this.value = this.operand1.value + this.operand2.value;
                    break;
                case 'subtraction':
                    this.value = this.operand1.value - this.operand2.value;
                    break;
            }
        }
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression4();
        res.operand1 = Expression3.parse(ts);
        while (ts.cur()) {
            let t = new Expression4();
            t.operand1 = res;
            if (ts.cur().text === '+') {
                ts.accept();
                res.operator = 'addition';
                res.operand2 = Expression3.parse(ts);
            } else if (ts.cur().text === '-') {
                ts.accept();
                res.operator = 'subtraction';
                res.operand2 = Expression3.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }

    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression4';
}
/**
 * Left-to-Right Association, Relation Operator
 * <Expression5> ::= <Expression5> <Operator LessThan> <Expression4> |
 *                   <Expression5> <Operator LessThanOrEqualTo> <Expression4> |
 *                   <Expression5> <Operator GreaterThan> <Expression4> |
 *                   <Expression5> <Operator GreaterThanOrEqualTo> <Expression4> |
 *                   <Expression4>
 */
@SyntaxTreeType
export class Expression5 extends AExpression {
    gen(list: IIntermediate[]): void {
        this['TC'] = list.length + 1;
        list.push(new Quad(`j_${this.operator}`, this.operand1.label, this.operand2.label, 0));
        this['FC'] = list.length + 1;
        list.push(new Quad(`j`, '', '', 0));
    }
    check(context: Context): void {
        this.operand1.check(context);
        this.operand2.check(context);
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression5();
        res.operand1 = Expression4.parse(ts);
        while (ts.cur()) {
            let t = new Expression5();
            t.operand1 = res;
            if (ts.cur().text === '<') {
                ts.accept();
                res.operator = 'less-than';
                res.operand2 = Expression4.parse(ts);
            } else if (ts.cur().text === '>') {
                ts.accept();
                res.operator = 'greater-than';
                res.operand2 = Expression4.parse(ts);
            } else if (ts.cur().text === '≤') {
                ts.accept();
                res.operator = 'less-than-or-equal-to';
                res.operand2 = Expression4.parse(ts);
            } else if (ts.cur().text === '≥') {
                ts.accept();
                res.operator = 'greater-than-or-equal-to';
                res.operand2 = Expression4.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }
    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression5';
}
/**
 * Left-to-Right Association, Relation Operator
 * <Expression6> ::= <Expression6> <Operator Equal> <Expression5> |
 *                   <Expression6> <Operator NotEqual> <Expression5> |
 *                   <Expression5>
 */
@SyntaxTreeType
export class Expression6 extends AExpression {
    type: string;
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression6();
        res.operand1 = Expression5.parse(ts);
        while (ts.cur()) {
            let t = new Expression6();
            t.operand1 = res;
            if (ts.cur().text === '=') {
                ts.accept();
                res.operator = 'equal';
                res.operand2 = Expression5.parse(ts);
            } else if (ts.cur().text === '≠') {
                ts.accept();
                res.operator = 'not-equal';
                res.operand2 = Expression5.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }
    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression6';
}
/**
 * Left-to-Right Association, Logical Or
 * <Expression7> ::= <Expression7> <Operator Or> <Expression6> |
 *                   <Expression6>
 */
@SyntaxTreeType
export class Expression7 extends AExpression {
    type: string;
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression7();
        res.operand1 = Expression6.parse(ts);
        while (ts.cur()) {
            let t = new Expression7();
            t.operand1 = res;
            if (ts.cur().text === '∨') {
                ts.accept();
                res.operator = 'logical-or';
                res.operand2 = Expression6.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }
    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression7';
}
/**
 * Left-to-Right Association, Logical And
 * <Expression8> ::= <Expression8> <Operator And> <Expression7> |
 *                   <Expression7>
 */
@SyntaxTreeType
export class Expression8 extends AExpression {
    type: string;
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression8();
        res.operand1 = Expression7.parse(ts);
        while (ts.cur()) {
            let t = new Expression8();
            t.operand1 = res;
            if (ts.cur().text === '∧') {
                ts.accept();
                res.operator = 'logical-and';
                res.operand2 = Expression7.parse(ts);
            } else {
                break;
            }
            res = t;
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }
    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression8';
}
/**
 * Right-to-Left Association, Assignment Operator
 * <Expression9> ::= <Expression8> <Operator Assignment> <Expression9> |
 *                   <Expression8>
 */
@SyntaxTreeType
export class Expression9 extends AExpression {
    gen(list: IIntermediate[]): void {
        if (!this.operand2.constant) {
            this.operand2.gen(list);
        }
        if (!this.operand1.constant) {
            this.operand1.gen(list);
        }
        list.push(new Quad(':=', this.operand2.label, '', this.operand1.label));
    }
    check(context: Context): boolean {
        this.operand1.check(context);
        this.operand2.check(context);
        if (!this.operand1.lvalue) {
            throw new CESemantic(`assign to a non-left-value`, this);
        }
        this.lvalue = false;
        this.type = this.operand1.type; // TODO: Type Cast
        this.constant = this.operand2.constant;
        if (this.constant) {
            this.value = this.operand2.value;
        }
        return true;
    }
    static parse(ts: ITokenIterator): AExpression {
        let res = new Expression9();
        res.operand1 = Expression8.parse(ts);
        while (ts.cur()) {
            if (ts.cur().text === ':=') {
                ts.accept();
                res.operator = ':=';
                res.operand2 = Expression9.parse(ts);
            } else {
                break;
            }
        }
        if (res.operator === undefined) {
            return res.operand1;
        }
        return res;
    }
    operator: string;
    operand1: AExpression;
    operand2: AExpression;
    _type: string = 'Expression9';
    type: string;
}

Expression.Top = Expression9;
