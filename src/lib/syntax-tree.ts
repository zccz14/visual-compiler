import { ITokenIterator } from './token-iterator';
/**
 * Abstract Syntax Tree
 */
export interface ISyntaxTreeConstructor {
    new (): ISyntaxTree;
    parse(ts: ITokenIterator): ISyntaxTree;
}

export interface ISyntaxTree {
}

export const STHub: Map<string, ISyntaxTreeConstructor> = new Map();
export function SyntaxTreeType(func: ISyntaxTreeConstructor): void {
    STHub.set(func.name, func);
}


/**
 * Expression ST
 * Expression ::= <Expression1> + <Expression2> |
 *                <Expression1> - <Expression2> |
 *                <Expression2>
 */
@SyntaxTreeType
export class Expression implements ISyntaxTree {
    static parse(ts: ITokenIterator): Expression {
        return {};
    }
}
