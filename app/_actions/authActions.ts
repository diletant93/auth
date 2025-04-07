'use server';
import { comparePassword, generateSalt, hashPassword } from "../_auth/passwordHasher";
import { createUserSession, removeUserFromSession } from "../_auth/session";
import { supabase } from "../_lib/supabase";
import { AuthResponse } from "../types/authActionResponse";
import { UserRecord, UserToCreateType } from "../types/UserRecord";

export async function signIn(formData: FormData): Promise<AuthResponse>{
    const {email,password} = Object.fromEntries(formData) as unknown as {email:string; password:string;}
    console.log({email,password})
    try {
        const {data, error} = 
                (await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single()) 
            
        if(error) return {message:'Error occured while getting the user record',status:'error'}

        const existingUser = data as UserRecord
        const {password:hashedPassword , salt} = existingUser
        if(!hashedPassword || !salt) return {message:'User do not exist', status:'error'}

        const isCorrectPassword = await comparePassword({hashedPassword, password, salt})
        if(!isCorrectPassword) return {message:'Password is not corrent', status:'error'}

        const isSessionCreated = await createUserSession(existingUser)

        if(!isSessionCreated) {
           await supabase.from('users').delete().eq('id',existingUser.id)
           return {message:'Could not create user session', status:'error'}
        }

        return {message:'User was logged in', status:'success'}

    } catch (error) {
        if(error instanceof Error) return {message:error.message, status:'error'}
        return {message:'unexpected error', status:'error'}
    }
}
export async function signUp(formData: FormData): Promise<AuthResponse>{
    const {name,email,password} = Object.fromEntries(formData) as unknown as {name:string; email:string; password:string; }
    try {
        const {data:existingUser} =
            await supabase 
            .from('users')
            .select('*')
            .eq('email',email)
            .single()

        if(existingUser) return {message:'User already exists',status:'error'}

        const salt = generateSalt()
        const hashedPassword = await hashPassword(password,salt)
        const userToCreate : UserToCreateType = {
            name,
            email,
            password:hashedPassword,
            salt,
            role:'user'
        }

         const {data:createdUser, error } =
         await supabase
         .from('users')
         .insert([userToCreate])
         .select()
         .single()

         if(error || !createdUser) return {message:'Could not register user',status:'error'}

         const isSessionCreated = await createUserSession(createdUser)

         if(!isSessionCreated) {
            await supabase.from('users').delete().eq('id',createdUser.id)
            return {message:'Could not create user session', status:'error'}
         }

         return {message:'User was created', status:'success'}

    } catch (error) {
        if(error instanceof Error) return {message:error.message, status:'error'}
        return {message:'unexpected error', status:'error'}
    }
}

export async function logOut():Promise<AuthResponse>{
    await removeUserFromSession()
    return {message:'User was logged out', status:'success'}
}