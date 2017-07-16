import { ITokenIterator } from './token-iterator';
import Context  from "./context";
import { IIntermediate } from "./compiler";
/**
 * Abstract Syntax Tree
 */
export interface ISyntaxTreeConstructor {
    new (): ISyntaxTree;
    parse(ts: ITokenIterator): ISyntaxTree;
}

export interface ISyntaxTree {
    check(context: Context): void;
    gen(list: IIntermediate[]): void;
}

export const STHub: Map<string, ISyntaxTreeConstructor> = new Map();
/**
 * Super prototype for Syntax Tree
 */
export function SyntaxTreeNode(type: string) {
    return function decorator(constructor: ISyntaxTreeConstructor): void {
        STHub.set(type, constructor);
    }
}
/**
 * Decorator of Syntax Tree
 */
export function SyntaxTreeType(func: ISyntaxTreeConstructor): void {
    STHub.set(func.name, func);
}

/**
 * SyntaxTree
 */
export class SyntaxTree {
    static parse(it: ITokenIterator): ISyntaxTree {
        let con = STHub.get('root');
        if (!con) {
            throw new Error('Syntax: No Root Node Defined!');
        }
        let st = con.parse(it);
        return st;
    }
}