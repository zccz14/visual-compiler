type TokenType = "keyword" | "identifier" | "literal" | "operator" | "delimiter" | "error";

export interface ITokenConstructor {
  new (str: string, bp: number, cp: number): IToken;
}

export interface IToken {
  readonly text: string;
  getType(): TokenType;
}

export const TokenTypeHub: Map<string, ITokenConstructor> = new Map();

class BaseToken implements IToken {
  readonly text: string;
  readonly bp: number;
  readonly cp: number;
  constructor(str: string, bp: number, cp: number) {
    this.text = str.slice(bp, cp);
    this.bp = bp;
    this.cp = cp;
  }
  getType(): TokenType {
    throw new Error("No Type for BaseToken");
  }
}

export class KeywordToken extends BaseToken {
  getType(): TokenType {
    return "keyword";
  }
}
TokenTypeHub.set('keyword', KeywordToken);

export class IdentifierToken extends BaseToken {
  getType(): TokenType {
    return "identifier";
  }
}
TokenTypeHub.set('identifier', IdentifierToken);

export class LiteralToken extends BaseToken {
  getType(): TokenType {
    return "literal";
  }
}
TokenTypeHub.set('literal', LiteralToken);

export class OperatorToken extends BaseToken {
  getType(): TokenType {
    return "operator";
  }
}
TokenTypeHub.set('operator', OperatorToken);

export class DelimiterToken extends BaseToken {
  getType(): TokenType {
    return "delimiter";
  }
}
TokenTypeHub.set('delimiter', DelimiterToken);

export class ErrorToken extends BaseToken {
  getType(): TokenType {
    return "error";
  }
}
TokenTypeHub.set('error', ErrorToken);
