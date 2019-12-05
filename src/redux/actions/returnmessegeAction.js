import { RETURN_MESSEGE } from './types';

export const returnmessegeAction = returnmessege => {
    return{
        type: RETURN_MESSEGE,
        payload: returnmessege
    }
}