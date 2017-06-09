import React, {Component} from "react";
import MuiRoot from "./components/MuiRoot";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Result from "./components/Result";
import inject from "react-tap-event-plugin";
inject();
const DefaultText =
    `int a, b;
while a<20∧b>8 do {
    if a>10∨b<16 then {
        if a<15 then {
            a:=19; 
            b:=15
        } else {
            a:=11;
            b:=9
        };
    }
    else {a:=1; b:=17};
};
`;

class App extends Component {
    state = {
        text: DefaultText
    };
    render() {
        return (
            <MuiRoot>
                <div>
                    <AppBar title="Visual Compiler"/>
                    <TextField
                        ref="input"
                        floatingLabelText="input"
                        fullWidth={true}
                        multiLine={true}
                        inputStyle={{fontFamily: 'Consolas'}}
                        defaultValue={DefaultText}
                    />
                    <RaisedButton
                        onTouchTap={() => {
                            this.setState({text: this.refs.input.getValue()});
                        }}
                    >
                        COMPILE
                    </RaisedButton>
                    <Result text={this.state.text}/>
                </div>
            </MuiRoot>
        );
    }
}
export default App;
