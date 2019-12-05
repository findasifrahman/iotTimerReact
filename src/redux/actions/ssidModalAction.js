import { SSID_MODAL_VISIBLE } from './types';

export const ssidModalAction = ssidModalVisible => {
    return{
        type: SSID_MODAL_VISIBLE,
        payload: ssidModalVisible
    }
}