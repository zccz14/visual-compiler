import {ISyntaxTree, ISyntaxTreeConstructor, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";
/**
 * <Expression> ::= <ExpressionTop>
 */
@SyntaxTreeType
export default class Expression implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression {
        let res = new Expression();
        res.expr = Expression.Top.parse(ts);
        return res;
    }

    static Top: ISyntaxTreeConstructor;
    expr: ISyntaxTree;
}

/**
 * <ExpressionButtom> ::= (<Expression>) | <Identifier> | <Literal Numeric>
 */

@SyntaxTreeType
export class ExpressionBottom implements ISyntaxTree {
    static parse(ts: ITokenIterator): ExpressionBottom {
        let res = new ExpressionBottom();
        if (ts.cur().getType() === 'identifier') {
            // Identifier
            res.id = ts.cur().text;
            ts.accept();
        } else if (ts.cur().getType() === 'literal') {
            res.value = parseInt(ts.cur().text, 10);
            ts.accept();
        } else if (ts.cur().getType() === 'delimiter' && ts.cur().text === '(') {
            ts.accept();
            res.expr = Expression.parse(ts);
            if (ts.cur().getType() === 'delimiter' && ts.cur().text === ')') {
                ts.accept();
            } else {
                throw new Error('SyntaxError: Expect )');
            }
        }
        return res;
    }

    id: string;
    expr: Expression;
    value: number;
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
export class Expression1 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression1 {
        let res = new Expression1();
        res.operand = ExpressionBottom.parse(ts);
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
            res = t;
        }
        return res;
    }

    operator: string;
    operand: ISyntaxTree;
    arrayArg: Expression;
    funcArgs: Expression[];
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
export class Expression2 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression2 {
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
        return res;
    }

    operator: string;
    operand: ISyntaxTree;
}
/**
 * Left-to-Right Association 2-ary Operators (Multiply)
 * <Expression3> ::= <Expression3> <Operator Multiply> <Expression2> |
 *                   <Expression2>
 */
@SyntaxTreeType
export class Expression3 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression3 {
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
        return res;
    }

    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}
/**
 * Left-to-Right Association 2-ary Operators (Addition / Subtraction)
 * <Expression4> ::= <Expression4> <Operator Plus> <Expression3> |
 *                   <Expression4> <Operator Minus> <Expression3> |
 *                   <Expression3>
 */
@SyntaxTreeType
export class Expression4 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression4 {
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
        return res;
    }

    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
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
export class Expression5 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression5 {
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
        return res;
    }
    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}
/**
 * Left-to-Right Association, Relation Operator
 * <Expression6> ::= <Expression6> <Operator Equal> <Expression5> |
 *                   <Expression6> <Operator NotEqual> <Expression5> |
 *                   <Expression5>
 */
@SyntaxTreeType
export class Expression6 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression6 {
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
        return res;
    }
    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}
/**
 * Left-to-Right Association, Logical Or
 * <Expression7> ::= <Expression7> <Operator Or> <Expression6> |
 *                   <Expression6>
 */
@SyntaxTreeType
export class Expression7 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression7 {
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
        return res;
    }
    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}
/**
 * Left-to-Right Association, Logical And
 * <Expression8> ::= <Expression8> <Operator And> <Expression7> |
 *                   <Expression7>
 */
@SyntaxTreeType
export class Expression8 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression8 {
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
        return res;
    }
    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}
/**
 * Right-to-Left Association, Assignment Operator
 * <Expression9> ::= <Expression8> <Operator Assignment> <Expression9> |
 *                   <Expression8>
 */
@SyntaxTreeType
export class Expression9 implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression9 {
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
	return res;  
    }
    operator: string;
    operand1: ISyntaxTree;
    operand2: ISyntaxTree;
}

Expression.Top = Expression9;
