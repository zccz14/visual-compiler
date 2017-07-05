export default class Token {
  readonly text: string;
  readonly bp: number;
  readonly cp: number;
  readonly type: string;
  constructor(type: string, text: string, bp: number, cp: number) {
    this.type = type;
    this.text = text;
    this.bp = bp;
    this.cp = cp;
  }
}

export const KEYWORD = 'keyword';
export const IDENTIFIER = 'identifier';
export const LITERAL = 'literal';
export const OPERATOR = 'operator';
export const DELIMITER = 'delimiter';
export const ERROR = 'error';
