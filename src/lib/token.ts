export default class Token {
  readonly text: string;
  readonly bp: number;
  readonly cp: number;
  readonly type: string;
  readonly rc: number;
  readonly cc: number;
  constructor(type: string, text: string, bp: number, cp: number, rc: number, cc: number) {
    this.type = type;
    this.text = text;
    this.bp = bp;
    this.cp = cp;
    this.rc = rc;
    this.cc = cc;
  }
  toString() {
    return `[${this.type}] ${this.text} (line ${this.rc}, column ${this.cc})`;
  }
}

export const KEYWORD = 'keyword';
export const IDENTIFIER = 'identifier';
export const LITERAL = 'literal';
export const OPERATOR = 'operator';
export const DELIMITER = 'delimiter';
export const ERROR = 'error';
