export function isAlpha(ch: string): boolean {
  return ('a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z');
}

export function isAlphaOrUnderline(ch: string) {
  return isAlpha(ch) || ch === '_';
}

export function isNumber(ch: string) {
  return '0' <= ch && ch <= '9';
}

export function isElementOfWord(ch: string): boolean{
  return isAlpha(ch) || isNumber(ch) || ch === '_';
}

var space = new Set([' ', '\n', '\t', '\r']);
export function isSpace(ch: string): boolean {
  return space.has(ch);
}