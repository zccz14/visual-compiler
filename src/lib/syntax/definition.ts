import {ISyntaxTree, SyntaxTreeType} from "../syntax-tree";
import {ITokenIterator} from "../token-iterator";
import DefineObjectList from "./define-object-list";
import BaseType from "./base-type";
import DefineObject from "./define-object";
/**
 * <Definition> ::= <BaseType> <Define Object List>
 */
@SyntaxTreeType
export default class Definition implements ISyntaxTree {
    static parse(ts: ITokenIterator): Definition {
        let res = new Definition();
        res.type = BaseType.parse(ts).type;
        res.list = DefineObjectList.parse(ts).list;
        return res;
    }
    type: string;
    list: DefineObject[];
}