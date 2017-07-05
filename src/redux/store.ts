import { compose, createStore } from "redux";
import reducer from "./reducer";
declare global {
    interface Window {
        devToolsExtension: Function
    }
}
const enhancer = compose(
    (window.devToolsExtension ? window.devToolsExtension() : (f: any) => f)
);
const store = createStore(reducer, enhancer);
export default store;