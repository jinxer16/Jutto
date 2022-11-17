import { ActionTypes } from "../types";
import { financeAppContractAddress, financeAppContract_Abi } from "../../utilies/Contract";
export const withdrawInfo = (acc) => {
    return async (dispatch) => {
        try {
            const web3 = window.web3;
            let financeAppcontractOf = new web3.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
            let obj = {}
                let reward_info = await financeAppcontractOf.methods.rewardInfo(acc).call();
                let ctoAll = await financeAppcontractOf.methods._calCurAllCTO(acc).call()
                let cto1=(web3.utils.fromWei(ctoAll[0]))
                let cto2=(web3.utils.fromWei(ctoAll[1]))
                ctoAll=parseFloat(cto1)+parseFloat(cto2)
                let all_val = parseFloat(cto1)+parseFloat(cto2)+ (parseInt(web3.utils.fromWei((reward_info.capitals))) + parseInt(web3.utils.fromWei((reward_info.statics))) + parseInt(web3.utils.fromWei((reward_info.directs)))  + parseInt(web3.utils.fromWei((reward_info.level2Income ))) + parseInt(web3.utils.fromWei((reward_info.level3_6Income))) + parseInt(web3.utils.fromWei((reward_info.level7_10Income))) + parseInt(web3.utils.fromWei((reward_info.level11_14Income)))+ parseInt(web3.utils.fromWei((reward_info.top))))

                obj["all_val"] = all_val;

                obj['statics'] = Number(web3.utils.fromWei(reward_info.statics)).toFixed(2)
                obj['capitals'] = Number(web3.utils.fromWei(reward_info.directs)).toFixed(2)
                obj['level2Income'] = Number(web3.utils.fromWei(reward_info.level2Income)).toFixed(2)
                obj['level3_6Income'] = Number(web3.utils.fromWei(reward_info.level3_6Income)).toFixed(2);
                obj['level7_10Income'] = Number(web3.utils.fromWei(reward_info.level7_10Income)).toFixed(2);
                obj['level11_14Income'] = Number(web3.utils.fromWei(reward_info.level11_14Income)).toFixed(2); 
                obj['top'] = Number(web3.utils.fromWei(reward_info.top)).toFixed(2)
                obj['unlock'] = Number(web3.utils.fromWei(reward_info.capitals)).toFixed(2);
                obj['cto'] = ctoAll.toFixed(2) 

                dispatch({ type: ActionTypes.WITHDRAW_INFO, payload: obj });
        } catch (error) {
            
        }
    }

}

