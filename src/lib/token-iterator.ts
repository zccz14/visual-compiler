import Token from "./token";
export interface ITokenIteratorConstructor {
  new (tokens: Token[]): ITokenIterator;
}
export interface ITokenIterator {
  accept(): void;
  append(token: Token): void;
  reset(): void;
  skip(count: number): void;
  peek(index: number): Token;
  load(tokens: Token[]): void;
  isEnded(): boolean;
  cur(): Token;
}
export class TokenIterator implements ITokenIterator {
  reset(): void {
    this.base = 0;
  }
  private tokens: Token[] = [];
  private base: number = 0;
  public cur() { return this.tokens[this.base]; }
  public accept(): void {
    if (this.base < this.tokens.length) {
      this.base++;
    }
  }

  public load(tokens: Token[]): void {
    this.tokens = tokens;
    this.base = 0;
  }

  public peek(index: number): Token {
    return this.tokens[this.base + index];
  }

  public skip(count: number): void {
    if (this.base + count < this.tokens.length) {
      this.base += count;
    } else {
      this.base = this.tokens.length;
    }
  }

  public isEnded(): boolean {
    return this.base >= this.tokens.length;
  }

  public append(token: Token): void {
    this.tokens.push(token);
  }
}