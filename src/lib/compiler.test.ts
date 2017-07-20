import * as fs from 'fs';
import { Compiler, IIntermediate } from './compiler';
import { STHub } from "./syntax-tree";
import Quad from './quad';

function printCode(list: IIntermediate[]): void {
    console.log(list.map((v, i) => `${i + 1} \t${v}`).join('\n'));
}

// it('root syntax', async () => {
//     console.log(STHub.keys());
// })


it('basic compile', () => {
    let text = 'int a, b; a := 3; b := 2; a := 1 + a + 2 + a - b;';
    let res = Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
})

it('context', () => {
    let text = 'int a; if a < 1 then { a := 1;}';
    let res = Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
});

it('basic compile', () => {
    let text = 'int a, b;\na := 1;\nb := 0;\nwhile a < 10 do {\n\tb := b + a\n}\n';
    let res = Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
});

it('sample-1', () => {
    let text = 'int a, b;\nwhile a<20∧b>8 do{\nif a>10∨b<16 then\n{if a<15 then {a:=19; b:=15} else {a:=11; b:=9};}\nelse {a:=1; b:=17};};';
    let res = Compiler.compile(text);
    fs.writeFile('../syntax.json', JSON.stringify(res.trees, null, 2));
    // console.log(JSON.stringify(res.trees, null, 2));
    // console.log(res.context);
    printCode(res.code);
    // console.log(res.errors);
});

it('sample-2', () => {
    let text = 'int a;\na:=a×b;';
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});

it('sample-3', () => {
    let text = 'int a;\nif a>10 {a:=10}';
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
})

it('const expr', () => {
    let text = 'int a, b;\nb:=2; a := 1+2+b×3-4+(b + 3) ×4+b +b';
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});

it('sample-4', () => {
    let text = 'do {} while 1';
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});

it('sample-5: multi-demension array access', () => {
    let text = 'int a[20][30]; a[5][6];';
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});


it('sample-6: case', () => {
    let text =
        `int a, b;
case a of
	1: a:=1
   2: b:=3
   3: a:=5
   otherwise: b:= 7
end`;
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});

it('sample-6: case', () => {
    let text =
`int a, b, c[20][50];
while a < 20 ∧ b > 8 do {
    if a > 10 ∨ b < 16 then {
        if a < 15 then {
            a := 19;
            b := 15
        } else {
            a := 11;
            b := 9
        }
    } else {
        a := 1;
        b := 17;
			c[a][b + 1] := b - a
    };
};
`;
    let res = Compiler.compile(text);
    printCode(res.code);
    console.log(res.errors);
});