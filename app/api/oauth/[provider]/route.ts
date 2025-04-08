import { createOAuthClient, getAuthState } from "@/app/_auth/oAuthClient";
import { createUserSession } from "@/app/_auth/session";
import { supabase } from "@/app/_lib/supabase";
import { AuthProvider } from "@/app/types/oAuthProvider";
import { UserRecord } from "@/app/types/UserRecord";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:Promise<{provider:AuthProvider}>}){
    const provider = (await params).provider
    const code = request.nextUrl.searchParams.get('code')
    const state = request.nextUrl.searchParams.get('state')
    
    if(typeof code !== 'string' || typeof state !== 'string'){
        redirect(`/sign-in?oautherror=${encodeURIComponent('invalid code or state')}`)
    }
    
    const cookieState = await getAuthState()
    if(!cookieState) redirect(`/sign-in?oautherror=${encodeURIComponent('state expired')}`)

    if(cookieState !== state) redirect(`/sign-in?oautherror=${encodeURIComponent('invalid state')}`)

    try {
        const oAuthClient = createOAuthClient(provider)
        const authAccount =  await oAuthClient.fetchUser(code)
        const user = await connectAuthAccountToUser(provider, authAccount)
        const isCreatedUserSession = await createUserSession(user)
        if(!isCreatedUserSession) redirect(`/sign-in?oautherror=${encodeURIComponent('could not create session')}`)
        redirect('/')
    } catch (error) {   
        console.error(error)
        redirect(`/sign-in?oautherror=${encodeURIComponent('could not authorize')}`)
    }
}

async function connectAuthAccountToUser(provider:string, {id,email,name}: {id:string; email:string; name:string;}){
    //check if exists
    //if it does not create the user 
    //if such a authAccount exists (check by the id related to the user) 
    //if not create the auth Account
    //return the user
    let user: UserRecord;
    const {data:existingUser} = 
    await supabase
    .from('users')
    .select('*')
    .eq('email',email)
    .single()

    user = existingUser
    if(!existingUser){
        const {data:createdUser} = await supabase
        .from('users')
        .insert([{
            email,
            name
        }])
        .select('*')
        .single()
        if(!createdUser) throw new Error('Could not create user in connect auth')
        user = createdUser
    }
    

    const {data:existingAuthAccount} =
    await supabase
    .from('o_auth_accounts')
    .select('*')
    .eq('userId',user.id)
    .eq('provider',provider)
    .single()

    if(!existingAuthAccount){
        const {data:createdAuthAccount} = await 
        supabase
        .from('o_auth_accounts')
        .insert([{
            userId:user.id,
            provider,
            providerAccountId: id,
        }])
        .select('*')
        .single()
        console.log(createdAuthAccount)
        if(!createdAuthAccount) throw new Error('Could not create auth account in connect auth')
    }
    return user
}