import React from "react";
import {connect} from "react-redux";
import TokenTable from "../components/TokenTable";
class Lex extends React.Component {
    render() {
        const {tokens} = this.props;
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
function select(state) {
    return {
        tokens: state.lex
    }
}
export default connect(select)(Lex);