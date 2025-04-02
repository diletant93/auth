import { toast } from "sonner";
import { AuthResponse } from "../types/authActionResponse";

export function useActionToast(){
    function actionToast(response:AuthResponse){
        if(response.status === 'error'){
            toast(response.message,{
                style:{
                backgroundColor:'#eb2828',
                color:'white',
            }})
        }
        if(response.status === 'success'){
            toast(response.message,{
                style:{
                backgroundColor:'#06b806',
                color:'white',
            }
            })
        }
    }
    return actionToast
}