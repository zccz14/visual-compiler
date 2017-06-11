import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducer";
import {routerMiddleware} from "react-router-redux";
import history from "./history";
const middleware = routerMiddleware(history);
const enhancer = compose(
    applyMiddleware(middleware),
    (window.devToolsExtension ? window.devToolsExtension() : f => f)
);
const store = createStore(reducer, enhancer);
export default store;