import { compose, createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { AutoCompile } from "./middleware";
declare global {
    interface Window {
        devToolsExtension: Function
    }
}
const enhancer = compose(
    (window.devToolsExtension ? window.devToolsExtension() : (f: any) => f)
);
const store = applyMiddleware(AutoCompile)(createStore)(reducer, enhancer);
export default store;