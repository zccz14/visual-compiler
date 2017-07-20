import { isAlphaOrUnderline, isElementOfWord, isNumber } from './utils';
import Token, * as TokenType from './token';
import { ITokenIterator, TokenIterator } from './token-iterator';

export interface ILexer {
  lex(text: string): ITokenIterator;
}

const KeywordSet = new Set([
  "int", "float", "char", "bool",
  "if", "then", "else",
  "case", "of", "otherwise", "end",
  "while", "do",
  "call", "return",
  "const"
]);

const SpaceSet = new Set([
  " ", "\n", "\t", "\r"
]);

const DelimiterSet = new Set([
  ",", ";", ":", "(", ")", "[", "]", "{", "}"
]);

const OperatorSet = new Set([
  ":=", "+", "-", "×", "<", "≤", "=", "≠", ">", "≥", "∧", "∨", "┐", "++", "--"
]);
const keywordTrie = {};
const symbolTrie = {};

const makeTrie = (container: any) => (type: string) => (str: string) => {
  let ptr = container;
  for (let ch of str) {
    if (ptr[ch] === undefined) {
      ptr[ch] = {};
    }
    ptr = ptr[ch];
  }
  ptr['valid'] = true;
  ptr['type'] = type;
}
let func = makeTrie(symbolTrie);
DelimiterSet.forEach(func(TokenType.DELIMITER));
OperatorSet.forEach(func(TokenType.OPERATOR));
KeywordSet.forEach(makeTrie(keywordTrie)(TokenType.KEYWORD));

export default class Lexer {
  public static lex(text: string): ITokenIterator {
    const res: TokenIterator = new TokenIterator();
    let bp: number = 0, cp: number = 0; // text[bp, cp)
    while (bp < text.length) {
      let type = '';
      let ch = text[cp++];
      if (isAlphaOrUnderline(ch)) {
        // Keyword | Identifier
        while (isElementOfWord(text[cp])) cp++;
        let t = text.slice(bp, cp);
        if (KeywordSet.has(t)) {
          type = TokenType.KEYWORD;
        } else {
          type = TokenType.IDENTIFIER;
        }
      } else if (isNumber(ch)) {
        // Numeric Literal | Error
        while (isNumber(text[cp])) cp++;
        if (isAlphaOrUnderline(text[cp])) {
          while (isElementOfWord(text[cp])) cp++;
          type = TokenType.ERROR;
        } else {
          type = TokenType.LITERAL;
        }
      } else if (SpaceSet.has(ch)) {
        bp = cp;
        continue;
      } else {
        // Symbol: Delimiter | Operator
        // Policy: Match as long as possible
        type = TokenType.ERROR;
        let ptr = symbolTrie[ch];
        if (ptr) {
          while (ptr[text[cp]]) {
            ptr = ptr[text[cp]];
            cp++;
          }
          if (ptr['valid']) {
            type = ptr['type'];
          }
        }
      }
      // gen & append token
      res.append(new Token(type, text.slice(bp, cp), bp, cp));
      bp = cp; // update base ptr
    }
    return res;
  }
}