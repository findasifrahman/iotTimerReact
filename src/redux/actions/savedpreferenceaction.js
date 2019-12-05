import { SAVED_PREFERENCE } from './types';

export const savedprefAction = savedpreference => {
    return{
        type: SAVED_PREFERENCE,
        payload: savedpreference
    }
}