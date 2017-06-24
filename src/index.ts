import Lexer from './lex';

let tit = new Lexer().lex('int a, b;\na := 1;\nb := 0;\nwhile a < 10 {\n\tb := b + a;\n}\n');

console.log(tit);