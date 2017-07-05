import * as React from 'react';
import './App.css';
import { Provider } from "react-redux";
import store from "./redux/store";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as inject from "react-tap-event-plugin";
import Layout from "./containers/Layout";
inject();
class App extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
            <MuiThemeProvider>
                <Layout/>
            </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
