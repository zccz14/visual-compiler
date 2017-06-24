import { IToken } from "./token";
export interface ITokenIteratorConstructor {
  new (tokens: IToken[]);
}
export interface ITokenIterator {
  accept(): void;
  append(token: IToken): void;
  reset(): void;
  skip(count: number): void;
  peek(index: number): IToken;
  load(tokens: IToken[]): void;
  isEnded(): boolean;
  cur(): IToken;
}
export class TokenIterator implements ITokenIterator {
  reset(): void {
    this.base = 0;
  }
  private tokens: IToken[] = [];
  private base: number = 0;
  public cur() { return this.tokens[this.base]; }
  public accept(): void {
    if (this.base < this.tokens.length) {
      this.base++;
    }
  }

  public load(tokens: IToken[]): void {
    this.tokens = tokens;
    this.base = 0;
  }

  public peek(index: number): IToken {
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

  public append(token: IToken): void {
    console.log(token);
    this.tokens.push(token);
  }
}