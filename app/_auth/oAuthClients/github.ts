import { z } from "zod";
import { oAuthClient } from "../oAuthClient";

export function createGithubOAuthClient(){
    return new oAuthClient({
        provider:'github',
        urls:{
            authUrl:'https://github.com/login/oauth/authorize',
            tokenUrl:'https://github.com/login/oauth/access_token',
            userUrl:'https://api.github.com/user'
        },
        scopes:['read:user','user:email'],
        client_id:process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
        client_secret:process.env.NEXT_PRIVATE_GITHUB_CLIENT_SECRET || '',
        user:{
            schema:githubUserSchema,
            parser:(data)=> ({
                id:data.id.toString(),
                email:data.email,
                name:data.name ?? data.login
            })
        }
    })
}
//schema
const githubUserSchema = z.object({
    id:z.number(),
    email:z.string().email(),
    login:z.string(),
    name:z.string().nullable()
})
