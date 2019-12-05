import { SSID_MODAL_VISIBLE } from '../actions/types';

const initialState = {
    ssid_modal_visible:'false'
}

const ssidModalReducer = (state = initialState,action) => {
    switch (action.type) {
        case SSID_MODAL_VISIBLE:
            return{
                ...state,
                ssid_modal_visible: action.payload
                
            }
    
        default:
            return state;
            
    }

}
export default ssidModalReducer;