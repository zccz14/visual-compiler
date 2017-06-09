/**
 * Token
 */
export default class Token {
    constructor(str, bp, cp, line, column) {
        this.name = str.slice(bp, cp);
        this.bp = bp;
        this.cp = cp;
        this.line = line;
        this.column = column;
    }

    get type() {
        return "token";
    }
}
export class SpaceToken extends Token {
    get type() {
        return "space";
    }
}
export class Keyword extends Token {
    get type() {
        return "keyword";
    }
}
export class Identifier extends Token {
    get type() {
        return "identifier";
    }
}
export class Delimiter extends Token {
    get type() {
        return "delimiter";
    }
}
export class Operator extends Token {
    get type() {
        return "operator";
    }
}
export class Literal extends Token {
    constructor(str, bp, cp, line, column) {
        super(str, bp, cp, line, column);
        this.value = null;
    }

    get type() {
        return "literal";
    }
}
export class Number extends Literal {
    constructor(str, bp, cp, line, column) {
        super(str, bp, cp, line, column);
        this.value = parseInt(this.name, 10);
    }

    get type() {
        return "literal-numeric";
    }
}
export class ErrorToken extends Token {
    get type() {
        return "error";
    }
}
