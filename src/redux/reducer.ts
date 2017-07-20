import Compiler from '../lib';
import { combineReducers, Action } from "redux";
import Lexer from "../lib/lex";
import { StatementList } from "../lib/syntax/statement";
import { CompileResult } from "../lib/compiler";
const defaultText = 
`int a, b;
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
        b := 17
    };
};
`;

function CoreReducer(state = { text: defaultText }, action: { type: string; payload: any }) {
    switch (action.type) {
        case 'EDIT':
            return Object.assign({}, state, { text: action.payload });
        case 'COMPILE':
            return Object.assign({}, state, Compiler.compile(action.payload));
        default:
            return state;
    }
}
interface FSA<S> extends Action {
    payload: S;
}

function StageReducer(state = 'code', action: FSA<{ next: string; prev: string }>) {
    switch (action.type) {
        case 'STAGE_CHANGE':
            state = action.payload.next;
        default:
            return state;
    }
}

export default combineReducers({
    core: CoreReducer,
    stage: StageReducer
});