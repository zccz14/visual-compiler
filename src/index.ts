import Lexer from './lex';

// let tit = Lexer.lex('int a, b;\na := 1;\nb := 0;\nwhile a < 10 {\n\tb := b + a;\n}\n');

// console.log(tit);

import { STHub } from './syntax-tree';
import BaseType from './syntax/base-type';
import DefineObject from './syntax/define-object';
import DemensionList from './syntax/demension-list';
import DefineArray from "./syntax/define-array";
import DefineObjectList from "./syntax/define-object-list";
import Definition from "./syntax/definition";
import Expression from "./syntax/expression";
import Statement, { StatementList } from "./syntax/statement";
function log(v) {
    console.log(JSON.stringify(v, null, 2));
}
console.log(STHub);
// let tit = Lexer.lex('int a, b[1][2][4] float c,d');
// let tit = Lexer.lex('d()++[] 10[1] a(d[1 ][2], -a)');
// let tit = Lexer.lex('d(1 × (2 + b) × a++)');
// let tit = Lexer.lex('d((2))');
// let tit = Lexer.lex('d((2 + 1))');
// let tit = Lexer.lex('int a; a > 1 ∧ a < 10');
// let tit = Lexer.lex('case a of 0: a++ 1: a-- end');
// let tit = Lexer.lex('++a');
let tit = Lexer.lex('{case a of 0: a++ 1: a-- otherwise: a := a + 1 end}; a');
let st = StatementList.parse(tit);
log(st);