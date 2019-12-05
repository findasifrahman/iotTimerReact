import { LOGIN_STATE } from '../actions/types';

const initialState = {
    username:'unknown',
    logState: 'false'
}

const loginStateReducer = (state = initialState,action) => {
    switch (action.type) {
        case LOGIN_STATE:
            return{
                ...state,
                username: action.payload.username,
                logState: action.payload.logState
                
            }
    
        default:
            return state;
            
    }

}
export default loginStateReducer;