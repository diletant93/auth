import { AuthProvider } from "../types/oAuthProvider";
import crypto from 'crypto'
import { cookies } from "next/headers";
import { COOKIE_CODE_VERIFIER_KEY, COOKIE_STATE_EXPIRATION_SECCONDS, COOKIE_STATE_KEY } from "../constants/authenticationRelated";
import { createDiscordOAuthClient } from "./oAuthClients/discord";
type oAuthClientConstructorProps = {
    provider:AuthProvider;
    urls:{
        authUrl:string;
        tokenUrl:string;
    };
    scopes:string[];
    client_id:string;
    client_secret:string;
}
export class oAuthClient<T>{
    private readonly provider:AuthProvider;
    private readonly urls:{
        authUrl:string;
        tokenUrl:string;
    };
    private readonly scopes:string[];
    private readonly client_id:string;
    private readonly client_secret:string;

    constructor({
        provider,
        urls,
        scopes,
        client_id,
        client_secret
    }:oAuthClientConstructorProps){
        this.provider = provider
        this.urls = urls
        this.scopes = scopes
        this.client_id = client_id
        this.client_secret = client_secret
    }

    private get redirectUrl(){
        return new URL(this.provider, process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL_BASE)
    }

    async getAuthUrl(){
        const state = await createAuthState()
        const url = new URL(this.urls.authUrl)

        url.searchParams.set('scope', this.scopes.join(' '))
        url.searchParams.set('redirect_uri', this.redirectUrl.toString())
        url.searchParams.set('client_id', this.client_id)
        url.searchParams.set('state',state)
        url.searchParams.set('response_type','code')

        return url.toString()
    }

    async fetchToken(code:string){
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await fetch(this.urls.tokenUrl,{
                method:'POST',
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                },
                body:new URLSearchParams({
                    code,
                    grant_type:'authorization_code',
                    redirect_uri:this.redirectUrl.toString(),
                    client_id:this.client_id,
                    client_secret:this.client_secret,
                    code_verifier: await createCodeVerifier()
                })
            })
            const data = await response.json()
            console.log('RAW DATA=>>>',data)
        } catch (error) {
            throw error
        }
    }
}

export function createOAuthClient(provider:AuthProvider){
    switch(provider){
        case 'github':
            return createDiscordOAuthClient()
        case 'discord':
            return createDiscordOAuthClient()
        default:
            throw new Error('The provider is not defined')
    }
}

async function createAuthState(){
    const state = crypto.randomBytes(64).toString('hex').normalize()
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_STATE_KEY, state, {
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        expires:Date.now() + COOKIE_STATE_EXPIRATION_SECCONDS * 1000
    })
    return state
}
export async function getAuthState(){
    const cookieStore = await cookies()
    const state = cookieStore.get(COOKIE_STATE_KEY)?.value
    return state
}
async function createCodeVerifier(){
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize()
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_CODE_VERIFIER_KEY, codeVerifier, {
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        expires:Date.now() + COOKIE_STATE_EXPIRATION_SECCONDS * 1000
    })
    return codeVerifier
}
export async function getCodeVerifier(){
    const cookieStore = await cookies()
    const codeVerifier = cookieStore.get(COOKIE_CODE_VERIFIER_KEY)?.value
    return codeVerifier
}