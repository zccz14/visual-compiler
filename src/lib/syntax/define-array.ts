import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import DemensionList from "./demension-list";
import { IDENTIFIER } from "../token";
import Context from "../context";
import { IIntermediate } from "../compiler";
/**
 * <Define Array> ::= <Identifier> <Demension List>
 */
@SyntaxTreeType
export default class DefineArray implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        throw new Error("Method not implemented.");
    }
    check(context: Context): boolean {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): DefineArray {
        let res = new DefineArray();
        if (ts.cur().type === IDENTIFIER) {
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
