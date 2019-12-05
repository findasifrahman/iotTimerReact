import {SSID_PASS_STATE} from '../actions/types';

const initialState = {
    savedSSID:'',
    savedPass: '',
    //DirectOrRouter: 'false',
    //savedPreference: '' 
}
const ssidPassReducer = (state = initialState,action) =>{
    switch (action.type) {
        case SSID_PASS_STATE:
            return{
                ...state,
                savedSSID: action.payload.savedSSID,
                savedPass: action.payload.savedPass,
                //savedPreference: action.payload.savedPreference,
                //DirectOrRouter: action.payload.DirectOrRouter,
                //returnMessege: action.payload.returnMessege
            }
    
        default:
            return state;
    }
}

export default ssidPassReducer;