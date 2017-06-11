import React from "react";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/theme/github";
import {connect} from "react-redux";
import Lexer from "../lib/Lexer";
class Code extends React.Component {
    render() {
        const {dispatch, text} = this.props;
        const onSubmit = (text) => {
            dispatch({type: 'EDIT', payload: text});
            dispatch({type: 'TOKEN', payload: Array.from(Lexer.getTokens(text))});
        };
        return (
            <AceEditor
                ref="editor"
                mode="c_cpp"
                theme="github"
                width="100%"
                name="editor"
                defaultValue={text}
                fontSize={20}
                height={`${window.innerHeight - 120}px`}
                editorProps={{$blockScrolling: true}}
                onBlur={() => onSubmit(this.refs.editor.editor.getValue())}
            />
        );
    }
}
function select(state) {
    return {text: state.editor};
}
export default connect(select)(Code);