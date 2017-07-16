
import { Compiler } from "./compiler";
import { STHub } from "./syntax-tree";

// it('root syntax', async () => {
//     console.log(STHub.keys());
// })


it('basic compile', async () => {
    let text = 'int a, b; a := 3; b := 2; a := 1 + a + 2 + a - b;';
    let res = await Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
})

it('context', async () => {
    let text = 'int a; if a < 1 then { a := 1;}';
    let res = await Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
});

it('basic compile', async () => {
    let text = 'int a, b;\na := 1;\nb := 0;\nwhile a < 10 do {\n\tb := b + a\n}\n';
    let res = await Compiler.compile(text);
    // console.log(res.tokens);
    console.log(JSON.stringify(res.trees, null, 2));
    console.log(res.context);
    console.log(res.code);
    console.log(res.errors);
});
