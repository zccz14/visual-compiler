import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
/**
 * BaseType ST
 * <BaseType> ::= <Keyword int> | 
 *                <Keyword float> |
 *                <Keyword char> |
 *                <Keyword bool>
 */
@SyntaxTreeType
export default class BaseType implements ISyntaxTree {
    static parse(ts: ITokenIterator): BaseType {
        let res = new BaseType();
        if (ts.cur().getType() === 'keyword') {
            let t = ts.cur().text;
            if (BaseTypeSet.has(t)) {
                ts.accept();
                res.type = t;
            } else {
                throw new Error('SyntaxError: Expect basetype');
            }
        } else {
            throw new Error('SyntaxError: Expect basetype');
        }
        return res;
    }
    type: string;
}

export const BaseTypeSet: ReadonlySet<string> = new Set(['int', 'float', 'char', 'bool']);
