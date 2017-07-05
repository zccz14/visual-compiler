import { combineReducers, Action } from "redux";
import Lexer from "../lib/lex";
import { StatementList } from "../lib/syntax/statement";
const defaultText = 'int a, b;\na := 1;\nb := 0;\nwhile a < 10 {\n\tb := b + a;\n}\n';

function CoreReducer(state = { text: defaultText, tokenIterator: { tokens: [], base: 0 } }, action: any) {
    switch (action.type) {
        case 'EDIT':
            return Object.assign({}, state, { text: action.payload });
        case 'COMPILE': {
            let ti = Lexer.lex(action.payload);
            let st = StatementList.parse(ti);
            return Object.assign({}, state, { tokenIterator: ti, syntaxTree: st });
        }
        default:
            return state;
    }
}
function LexReducer(state = [], action: any) {
    switch (action.type) {
        case 'TOKEN':
            return action.payload;
        default:
            return state;
    }
}


function SyntaxReducer(state = { a: [{}, {}, {}] }, action: any) {
    switch (action.type) {
        default:
            return state;
    }
}

interface FSA<S> extends Action {
    payload: S;
}

function StageReducer(state = 'code', action: FSA<string>) {
    switch (action.type) {
        case 'STAGE_CHANGE':
            state = action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    core: CoreReducer,
    lex: LexReducer,
    syntax: SyntaxReducer,
    stage: StageReducer
});