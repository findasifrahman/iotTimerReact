import { createStore,combineReducers } from 'redux'
import loginStateReducer from './reducers/loginStateReducer';
import ssidModalReducer from './reducers/ssudModalReducers';
import ssidPassReducer from './reducers/ssidPassReducer';
import savedpreferenceReducer from './reducers/savedpreferenceReducers'
import returnmessegeReducer from './reducers/returnmessegeReducers'
const rootReducer = combineReducers({
    loginStateReducer: loginStateReducer,
    ssidModalReducer: ssidModalReducer,
    ssidPassReducer: ssidPassReducer,
    savedpreferenceReducer: savedpreferenceReducer,
    returnmessegeReducer: returnmessegeReducer
}) 

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;