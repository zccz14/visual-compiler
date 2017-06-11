import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
const defaultText = 'int a, b;\na := 1;\nb := 0;\nwhile a < 10 {\n\tb := b + a;\n}\n';
/**
 * @return {string}
 */
function EditorReducer(state = defaultText, action) {
    switch (action.type) {
        case 'EDIT':
            return action.payload;
        default:
            return state;
    }
}
function LexReducer(state = [], action) {
    switch (action.type) {
        case 'TOKEN':
            return action.payload;
        default:
            return state;
    }
}
export default combineReducers({router: routerReducer, editor: EditorReducer, lex: LexReducer});