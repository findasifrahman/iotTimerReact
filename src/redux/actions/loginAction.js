import { LOGIN_STATE } from './types';

export const loginAction = loginStateObj => {
    return{
        type: LOGIN_STATE,
        payload: loginStateObj
    }
}