import { isAlphaOrUnderline, isElementOfWord, isNumber, isSpace } from './utils';
import { IToken, ITokenConstructor, TokenTypeHub } from './token';
import { ITokenIterator, TokenIterator } from './token-iterator';
export interface ILexer {
  lex(text: string): ITokenIterator;
}

const KeywordSet = new Set([
  "int", "float", "char", "bool",
  "if", "then", "else",
  "case", "of", "otherwise", "end",
  "while", "do",
  "call", "return"
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
DelimiterSet.forEach(func('delimiter'));
OperatorSet.forEach(func('operator'));
console.log(JSON.stringify(symbolTrie, null, 2))

export default class Lexer implements ILexer {

  public lex(text: string): ITokenIterator {
    const res: TokenIterator = new TokenIterator();
    let bp: number = 0, cp: number = 0; // text[bp, cp)
    while (bp < text.length) {
      let type = '';
      let con: ITokenConstructor;
      let ch = text[cp++];
      if (isAlphaOrUnderline(ch)) {
        // Keyword | Identifier
        while (isElementOfWord(text[cp])) cp++;
        let t = text.slice(bp, cp);
        if (KeywordSet.has(t)) {
          type = 'keyword';
        } else {
          type = 'identifier';
        }
      } else if (isNumber(ch)) {
        // Numeric Literal | Error
        while (isNumber(text[cp])) cp++;
        if (isAlphaOrUnderline(text[cp])) {
          while (isElementOfWord(text[cp])) cp++;
          type = 'error';
        } else {
          type = 'literal';
        }
      } else if (SpaceSet.has(ch)) {
        bp = cp;
        continue;
      } else {
        // Symbol: Delimiter | Operator
        // Policy: Match as long as possible
        type = 'error';
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
      res.append(new (TokenTypeHub.get(type))(text, bp, cp));
      bp = cp; // update base ptr
    }
    return res;
  }
}