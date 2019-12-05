import {SSID_PASS_STATE} from './types';

export const ssidPassAction = ssidPassobj =>{
   return{
       type: SSID_PASS_STATE,
       payload:ssidPassobj
   }
} 