import React from "react";
import ReduxRoot from "./containers/ReduxRoot";
import RouterRoot from "./containers/RouterRoot";
import MuiRoot from "./containers/MuiRoot";
import Layout from "./Layout";
const App = () => (
    <ReduxRoot>
        <RouterRoot>
            <MuiRoot>
                <Layout/>
            </MuiRoot>
        </RouterRoot>
    </ReduxRoot>
);
export default App;