import {ISyntaxTree, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";
import DefineObject from "./define-object";
import { IDENTIFIER, DELIMITER } from "../token";
/**
 * <Define Object List> ::= <Define Object> <Delimiter comma> <Define Object List>
 */
@SyntaxTreeType
export default class DefineObjectList implements ISyntaxTree {
    static parse(ts: ITokenIterator): DefineObjectList {
        let res = new DefineObjectList();
        if (ts.cur().type === IDENTIFIER) {
            while (true) {
                res.list.push(DefineObject.parse(ts));
                if (ts.cur() && ts.cur().type === DELIMITER && ts.cur().text === ',') {
                    ts.accept();
                } else {
                    break;
                }
            }
        } else {
            throw new Error("Syntax Error: Expect Identifier")
        }
        return res;
    }
    list: DefineObject[] = [];
}
