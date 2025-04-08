import { z } from "zod";
import { oAuthClient } from "../oAuthClient";

export function createDiscordOAuthClient(){
    const authClient = new oAuthClient({
        provider:'discord',
        urls:{
            authUrl:'https://discord.com/oauth2/authorize',
            tokenUrl:'https://discord.com/api/oauth2/token',
            userUrl:'https://discord.com/api/users/@me'
        },
        scopes:['identify','email'],
        client_id:process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '',
        client_secret:process.env.NEXT_PRIVATE_DISCORD_CLIENT_SECRET || '',
        user:{
            schema:discordSchema,
            parser:(data)=>({
                id:data.id,
                email:data.email,
                name:data.global_name ?? data.username
            })
        }
    })

    return authClient
}
const discordSchema = z.object({
    id:z.string(),
    username:z.string(),
    global_name:z.string().nullable(),
    email:z.string()
})