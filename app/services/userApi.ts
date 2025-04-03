import { supabase } from "../_lib/supabase";
import { UserRecord } from "../types/UserRecord";

export async function getUserById(userId:string):Promise<UserRecord | null>{
    const  {data} = await supabase.from('users').select('*').eq('id',userId).single()
    return data
}   