import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import { KEYWORD } from "../token";
import { CESyntax, IIntermediate } from "../compiler";
import Context from "../context";
/**
 * BaseType ST
 * <BaseType> ::= <Keyword int> | 
 *                <Keyword float> |
 *                <Keyword char> |
 *                <Keyword bool>
 */
@SyntaxTreeType
export default class BaseType implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        throw new Error("Method not implemented.");
    }
    check(context: Context): void {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): BaseType {
        let res = new BaseType();
        if (ts.cur().type === KEYWORD) {
            let t = ts.cur().text;
            if (BaseTypeSet.has(t)) {
                ts.accept();
                res.type = t;
            } else {
                throw new CESyntax(`${t} is not a basetype`, ts.cur());
            }
        } else {
            throw new CESyntax('miss a keyword', ts.cur());
        }
        return res;
    }
    type: string;
}

export const BaseTypeSet: ReadonlySet<string> = new Set(['int', 'float', 'char', 'bool']);
