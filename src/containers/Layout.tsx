import Intermediate from './Intermediate';
import * as React from 'react';
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import Translate from "material-ui/svg-icons/action/translate";
import { connect } from "react-redux";
import Bottom from "../components/Bottom";
import { Dispatch } from "redux";

import Code from "./Code";
import Lex from "./Lex";
import Syntax from "./Syntax";
import { ICompilerError } from "../lib/compiler";

class Layout extends React.Component<{ dispatch: Dispatch<any>; stage: string; core: { text: string; errors: ICompilerError[] }; }, {}> {
    render() {
        const { dispatch, stage, core } = this.props;
        const { text } = core;
        return (
            <div>
                <AppBar
                    title="Visual Compiler"
                    iconElementLeft={<IconButton><Translate /></IconButton>}
                    onLeftIconButtonTouchTap={() => dispatch({ type: 'COMPILE', payload: text })}
                    style={{
                        position: 'fixed',
                        top: 0
                    }}
                />
                <div
                    style={{
                        position: 'relative',
                        padding: '64px 15px'
                    }}
                >
                    <div>
                        {core.errors ? core.errors.map((v, i) => <p key={i}>{v.toString()}</p>) : null}
                    </div>
                    <div className={stage === 'code' ? 'active' : 'hide'}>
                        <Code />
                    </div>
                    <div className={stage === 'lex' ? 'active' : 'hide'}>
                        <Lex />
                    </div>
                    <div className={stage === 'syntax' ? 'active' : 'hide'}>
                        <Syntax />
                    </div>
                    <div className={stage === 'intermediate' ? 'active' : 'hide'}>
                        <Intermediate />
                    </div>
                </div>
                <Bottom
                    label={stage}
                    onChange={(label: string) => dispatch({ type: 'STAGE_CHANGE', payload: { next: label, prev: stage } })}
                />
            </div>
        );
    }
}
function select(state: any) {
    return {
        stage: state.stage,
        core: state.core
    }
}
export default connect(select)(Layout);
