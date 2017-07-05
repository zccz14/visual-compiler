import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as CodeMirror from "react-codemirror";

import 'codemirror/mode/clike/clike';
// 加载一些插件
require('codemirror/addon/selection/active-line');
require('codemirror/addon/edit/matchbrackets');
import "codemirror/lib/codemirror.css";

class Code extends React.Component<{ dispatch: Dispatch<any>; text: string; display: boolean; }, {}> {
    render() {
        const { dispatch, text, display } = this.props;
        const onSubmit = (text: string) => {
            dispatch({ type: 'EDIT', payload: text });
            // dispatch({ type: 'TOKEN', payload: Array.from(Lexer.getTokens(text)) });
        };
        let option = {
            // value: "// open a javascript file...",
            lineNumbers: true,
            styleActiveLine: true,
            foldGutter: true,
            lineWrapping: true,
            matchBrackets: true,
            mode: "clike",
        };
        return (
            <div>
                <CodeMirror
                    onChange={v => onSubmit(v)}
                    value={text}
                    options={option}
                />
            </div>
        );
    }
}
function select(state: any) {
    return {
        text: state.core.text,
        display: state.stage === 'code'
    };
}


export default connect(select)(Code);