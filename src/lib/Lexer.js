/**
 * Lexer
 * Author: zccz14
 * Keyword, Identifier, Number, Delimiter, Operator
 */
import Token, {Delimiter, ErrorToken, Identifier, Keyword, Number, Operator, SpaceToken} from "./Token";
const Keywords = [
    "int", "float", "char", "bool",
    "if", "then", "else",
    "case", "of", "otherwise", "end",
    "while", "do",
    "call", "return"
];
const Delimiters = [
    ",", ";", ":", "(", ")", "[", "]", "{", "}"
];
const Operators = [
    ":", "+", "-", "×", "<", "≤", "=", "≠", ">", "≥", "∧", "∨", "┐"
];
const Spaces = [
    ' ', '\n', '\t', '\r'
];
function isAlpha(ch) {
    return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z');
}
function isAlphaOrUnderline(ch) {
    return isAlpha(ch) || ch === '_';
}
function isElementOfWord(ch) {
    return isAlpha(ch) || isNumber(ch) || ch === '_';
}
function isNumber(ch) {
    return '0' <= ch && ch <= '9';
}
function isSpace(ch) {
    return Spaces.includes(ch);
}
export default class Lexer {
    /**
     * Get Tokens from String (Lex)
     * Generator of Token
     */
    static GetTokens({space}) {
        return function*(inp) {
            let bp = 0, cp = 0; // base ptr & current ptr
            let line = 1, linebp = 0; // Position for Human reading
            // Always cut token from inp[bp, cp)
            while (bp < inp.length) {
                let type = Token;
                let ch = inp[cp++];
                let notGen = false;
                if (ch === '\n') {
                    line++;
                    linebp = cp;
                }
                if (isAlphaOrUnderline(ch)) {
                    // Keyword | Identifier
                    /**
                     * TODO:
                     * Optimize Point: Multiple Pattern Single Matching (Trie)
                     * Construct Trie from Keywords.
                     * Match string starting from bp, if success means it's a keyword.
                     * Or it's an identifier.
                     */
                    while (isElementOfWord(inp[cp])) cp++;
                    let token = inp.slice(bp, cp);
                    if (Keywords.includes(token)) {
                        type = Keyword;
                    } else {
                        type = Identifier;
                    }
                } else if (isNumber(ch)) {
                    // Number
                    while (isNumber(inp[cp])) cp++;
                    if (isAlphaOrUnderline(inp[cp])) {
                        while (isElementOfWord(inp[cp])) cp++;
                        type = ErrorToken;
                    } else {
                        type = Number;
                    }
                } else if (Delimiters.includes(ch) && (ch !== ':' || inp[cp] !== '=')) {
                    // Delimiter
                    type = Delimiter;
                } else if (Operators.includes(ch)) {
                    // Operators
                    type = Operator;
                    // Exceeding Searching
                    if (ch === ':') {
                        if (inp[cp] === '=') {
                            cp++;
                        }
                    } else if (ch === '+') {
                        if (inp[cp] === '+') {
                            cp++;
                        }
                    } else if (ch === '-') {
                        if (inp[cp] === '-') {
                            cp++;
                        }
                    }
                } else if (isSpace(ch)) {
                    // Space, do not generate token
                    type = SpaceToken;
                    while (isSpace(inp[cp])) cp++;
                    if (!space) {
                        notGen = true;
                    }
                } else {
                    type = ErrorToken;
                }
                if (!notGen) {
                    yield new type(inp, bp, cp, line, bp - linebp + 1);
                }
                bp = cp;
            }
        };
    }

    static getTokens = Lexer.GetTokens({space: true});
    static getTokensWithSpace = Lexer.GetTokens({space: true});
};