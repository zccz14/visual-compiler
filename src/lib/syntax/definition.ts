import { ISyntaxTree, SyntaxTreeType } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import DefineObjectList from "./define-object-list";
import BaseType from "./base-type";
import DefineObject from "./define-object";
import Context from "../context";
import { CESemantic, IIntermediate } from "../compiler";
/**
 * <Definition> ::= <BaseType> <Define Object List>
 */
@SyntaxTreeType
export default class Definition implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        // Do nothing
    }
    check(context: Context): void {
        this.list.forEach(v => {
            if (context.content.get(v.id)) {
                throw new CESemantic(`${v.id} has been defined in this scope`, v);
            }
            context.content.set(v.id, { type: `${this.type} ${v.array.map(v => `[${v}]`).join('')}`.trim(), const: false });
        });
    }
    static parse(ts: ITokenIterator): Definition {
        let res = new Definition();
        res.type = BaseType.parse(ts).type;
        res.list = DefineObjectList.parse(ts).list;
        return res;
    }
    type: string;
    list: DefineObject[];
}