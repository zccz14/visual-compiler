import Compiler from '../lib';
import { combineReducers, Action } from "redux";
import Lexer from "../lib/lex";
import { StatementList } from "../lib/syntax/statement";
const defaultText = 'int a, b;\na := 1;\nb := 0;\nwhile a < 10 do {\n\tb := b + a\n}\n';

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