import * as React from "react";
import Code from "../containers/Code";

const select = (label: string) => {
    switch (label) {
        case 'code':
            return Code;
        default:
            return null;
    }
}

const StageSwitch = (props: { stage: string; }) => {
    let Com = select(props.stage);
    return (
        <div>
            {Com ? <Com /> : props.stage}
        </div>
    )
};

export default StageSwitch;