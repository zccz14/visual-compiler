import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import DefineArray from "./define-array";
/**
 * Define Object ST
 * <Define Object> ::= <Identifier> | <Define Array>
 */
@SyntaxTreeType
export default class DefineObject implements ISyntaxTree {
    static parse(ts: ITokenIterator): DefineObject {
        let res = new DefineObject();
        if (ts.cur().getType() === 'identifier') {
            if (ts.peek(1) && ts.peek(1).getType() === 'delimiter' && ts.peek(1).text === '[') {
                // Define Array
                let array = DefineArray.parse(ts);
                res.id = array.id;
                res.array = array.list.list;
            } else {
                res.id = ts.cur().text;
                res.array = undefined;
                ts.accept();
            }
        } else {
            throw new Error('SyntaxError: Expect basetype');
        }
        return res;
    }
    id: string;
    array: number[] = [];
}
