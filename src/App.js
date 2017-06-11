import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import Translate from "material-ui/svg-icons/action/translate";
import {connect} from "react-redux";
import Bottom from "./components/Bottom";
import {Route, Switch} from "react-router-dom";
import {push} from "react-router-redux";
import Code from "./containers/Code";
import Lex from "./containers/Lex";
const NotFound = () => (
    <div>TBD, TODO</div>
);
class App extends Component {
    render() {
        const {dispatch, pathLabel} = this.props;
        const handleChangeNav = (label) => dispatch(push(`/${label}`));
        return (
            <div>
                <AppBar
                    title="Visual Compiler"
                    iconElementLeft={<IconButton><Translate/></IconButton>}
                    style={{
                        position: 'fixed',
                        top: 0
                    }}
                />
                <div
                    style={{
                        position: 'relative',
                        top: 64
                    }}
                >

                    <Switch>
                        <Route path="/code" component={Code}/>
                        <Route path="/lex" component={Lex}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
                <Bottom
                    label={pathLabel}
                    onChange={handleChangeNav}
                />
            </div>
        );
    }
}
function select(state) {
    return {
        pathLabel: state.router.location.pathname.split('/')[1]
    }
}
export default connect(select)(App);
