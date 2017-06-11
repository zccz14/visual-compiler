import React from "react";
import {Provider} from "react-redux";
import store from "../redux/store";
export default class ReduxRoot extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}