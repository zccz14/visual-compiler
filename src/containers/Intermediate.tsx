import * as React from "react";
import { connect } from "react-redux";
import QuadTable from "../components/QuadTable";
import Quad from "../lib/quad";
import { Dispatch } from "redux";

class QuadIntermediate extends React.Component<{ dispatch: Dispatch<any>; code: Quad[] }, {}> {
    render() {
        let { code = [] } = this.props;
        return (
            <div>
                <QuadTable
                    data={code}
                />
            </div>
        )
    }
}
function select(state: any) {
    return {
        code: state.core.code
    }
}
export default connect(select)(QuadIntermediate);