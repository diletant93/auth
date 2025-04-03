import { supabase } from "../_lib/supabase";

export async function deleteSessionById(sessionId:string|undefined){
    const {error} = await supabase.from('sessions').delete().eq('sessionId',sessionId)
}