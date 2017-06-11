import React from "react";
import history from "../redux/history";
import {ConnectedRouter} from "react-router-redux";
export default class RouterRoot extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                {this.props.children}
            </ConnectedRouter>
        )
    }
}