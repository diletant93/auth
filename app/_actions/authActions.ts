'use server'
;
import { generateSalt, hashPassword } from "../_auth/passwordHasher";
import { supabase } from "../_lib/supabase";
import { AuthResponse } from "../types/authActionResponse";
import { UserRecord } from "../types/UserRecord";

export async function signIn(formData: FormData){
    const {email,password} = Object.fromEntries(formData) as unknown as {email:string; password:string;}
    const {data} = await supabase.from('Users').select('*')
    console.log(data)
}
export async function signUp(formData: FormData): Promise<AuthResponse>{
    const {name,email,password} = Object.fromEntries(formData) as unknown as {email:string; password:string; name:string;}
    try {
        const {data:existingUser} =
            await supabase 
            .from('Users')
            .select('*')
            .eq('email',email)
            .single()

        if(existingUser) return {message:'User already exists',status:'error'}

        const salt = generateSalt()
        const hashedPassword = await hashPassword(password,salt)
        const userToCreate : UserRecord = {
            name,
            email,
            password:hashedPassword,
            salt
        }

         const {data:createdUser, error } =
         await supabase
         .from('Users')
         .insert([{userToCreate}])

         if(error) return {message:'Could not register user',status:'error'}
         
         return {message:hashedPassword, status:'success'}

    } catch (error) {
        if(error instanceof Error) return {message:error.message, status:'error'}
        return {message:'unexpected error', status:'error'}
    }
}