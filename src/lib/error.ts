import Token from './token';

export class SyntaxError {
    constructor(msg: string, token: Token) {
        this.msg = msg;
        this.token = token;
    }
    token: Token;
    msg: string;
}
