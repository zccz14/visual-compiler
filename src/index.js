import React from "react";
import ReactDOM from "react-dom";
import ReduxRoot from "./containers/ReduxRoot";
import RouterRoot from "./containers/RouterRoot";
import MuiRoot from "./containers/MuiRoot";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
ReactDOM.render((
    <ReduxRoot>
        <RouterRoot>
            <MuiRoot>
                <App/>
            </MuiRoot>
        </RouterRoot>
    </ReduxRoot>
), document.getElementById('root'));
registerServiceWorker();
