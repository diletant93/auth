import { createOAuthClient, getAuthState } from "@/app/_auth/oAuthClient";
import { AuthProvider } from "@/app/types/oAuthProvider";
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
        await oAuthClient.fetchToken(code)
    } catch (error) {   
        console.error(error)
    }

    redirect('/')
}