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
            if (t === 'int' || t === 'float' || t === 'char' || t === 'bool') {
                res.type = ts.cur().text;
                ts.accept();
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
