import React from "react";
import "./Highlight.css";
export default class Highlight extends React.Component {
    render() {
        let {tokens} = this.props;
        let lines = [];
        for (let token of tokens) {
            if (!lines[tokens.line - 1]) {
                lines[token.line - 1] = [];
            }
            lines[token.line - 1].push(token);
        }
        return (
            <pre>
                <code>
                    {tokens.map((v, i) => <span key={i} className={v.type}>{v.name}</span>)}
                </code>
            </pre>
        );
    }
}