import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import DemensionList from "./demension-list";
/**
 * <Define Array> ::= <Identifier> <Demension List>
 */
@SyntaxTreeType
export default class DefineArray implements ISyntaxTree {
    static parse(ts: ITokenIterator): DefineArray {
        let res = new DefineArray();
        if (ts.cur().getType() === 'identifier') {
            res.id = ts.cur().text;
            ts.accept();
            res.list = DemensionList.parse(ts);
        } else {
            throw new Error('SyntaxError: Expect identifier');
        }
        return res;
    }
    id: string;
    list: DemensionList;
}
