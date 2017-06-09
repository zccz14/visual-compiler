/**
 * Created by zccz14 on 2017/6/10.
 */
import React from "react";
import Lexer from "../lib/Lexer";
import TokenTable from "./TokenTable";
import Highlight from "./Highlight";
export default class Result extends React.Component {
    render() {
        let {text} = this.props;
        let tokens = Array.from(Lexer.getTokensWithSpace(text));
        let tokensWithoutSpace = tokens.filter(v => v.type !== 'space');
        return (
            <div>
                <Highlight tokens={tokens}/>
                <TokenTable tokens={tokensWithoutSpace}/>
            </div>
        );
    }
}