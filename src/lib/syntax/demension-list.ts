import { SyntaxTreeType, ISyntaxTree } from "../syntax-tree";
import { ITokenIterator } from "../token-iterator";
import { DELIMITER, LITERAL } from "../token";
import Context from "../context";
import { IIntermediate } from "../compiler";
/**
 * <Demension List> ::= <Delimiter LeftBracket> <Number> <Delimiter RightBracket> <Demension List>
 */
@SyntaxTreeType
export default class DemensionList implements ISyntaxTree {
    gen(list: IIntermediate[]): void {
        throw new Error("Method not implemented.");
    }
    check(context: Context): void {
        throw new Error("Method not implemented.");
    }
    static parse(ts: ITokenIterator): DemensionList {
        let res = new DemensionList();
        if (ts.cur().type === DELIMITER && ts.cur().text === '[') {
            ts.accept();
            while (true) {
                if (ts.cur().type === LITERAL) {
                    let number = parseInt(ts.cur().text, 10);
                    res.list.push(number);
                    ts.accept();
                } else {
                    throw new Error('SyntaxError: Expect Numeric Literal');
                }
                if (ts.cur().type === DELIMITER && ts.cur().text === ']') {
                    ts.accept();
                } else {
                    throw new Error('SyntaxError: Expect Delimiter ]');
                }
                if (ts.cur() && ts.cur().type === DELIMITER && ts.cur().text === '[') {
                    ts.accept();
                } else {
                    break;
                }
            }
        } else {

        }
        return res;
    }
    list: number[] = [];
}