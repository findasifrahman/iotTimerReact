import { RETURN_MESSEGE } from '../actions/types';

const initialState = {
    returnmessege:''
}

const returnmessegeReducer = (state = initialState,action) => {
    switch (action.type) {
        case RETURN_MESSEGE:
            return{
                ...state,
                returnmessege: action.payload
                
            }
    
        default:
            return state;
            
    }

}
export default returnmessegeReducer;