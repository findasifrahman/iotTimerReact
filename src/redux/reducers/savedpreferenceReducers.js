import { SAVED_PREFERENCE } from '../actions/types';

const initialState = {
    savedpreference:''
}

const savedpreferenceReducer = (state = initialState,action) => {
    switch (action.type) {
        case SAVED_PREFERENCE:
            return{
                ...state,
                savedpreference: action.payload
                
            }
    
        default:
            return state;
            
    }

}
export default savedpreferenceReducer;