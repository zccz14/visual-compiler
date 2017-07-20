import * as React from "react";
import { connect } from "react-redux";
import TokenTable from "../components/TokenTable";
import Token from "../lib/token";
import { Dispatch } from "redux";

class Lex extends React.Component<{ dispatch: Dispatch<any>; tokens: Token[] }, {}> {
    render() {
        const { tokens = [] } = this.props;
        let noSpace = tokens.filter(v => v.type !== 'space');
        return (
            <div>
                <TokenTable
                    tokens={noSpace}
                />
            </div>
        )
    }
}
function select(state: any) {
    return {
        tokens: state.core.tokens
    }
}
export default connect(select)(Lex);