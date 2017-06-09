import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
export default class MuiRoot extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}