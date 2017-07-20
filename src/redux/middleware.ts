import { Store, Dispatch } from "redux";
export const AutoCompile = (store: Store<any>) => (next: Dispatch<any>) => (action: any) => {
  if (action.type === 'STAGE_CHANGE') {
    if (action.payload.prev === 'code' && store.getState().core.update) {
      store.dispatch({ type: 'COMPILE', payload: store.getState().core.text});
    }
  }
  next(action);
}