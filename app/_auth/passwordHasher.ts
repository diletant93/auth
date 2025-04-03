import crypto from 'crypto'
export function hashPassword(password:string, salt:string):Promise<string>{
    return new Promise((resolve, reject)=>{
        crypto.scrypt(password.normalize(),salt,64,(error, hash)=>{
            if(error) reject(error)
            resolve(hash.toString('hex').normalize())
        })
    })
}
export function generateSalt(){
    return crypto.randomBytes(16).toString('hex').normalize()
}

type ComparePasswordProps = {
    hashedPassword:string;
    password:string;
     salt:string;
}
export async function comparePassword({hashedPassword, password, salt}: ComparePasswordProps){
    const inputHashedPassword = await hashPassword(password,salt)
    return crypto.timingSafeEqual(
        Buffer.from(inputHashedPassword,'hex'),
        Buffer.from(hashedPassword,'hex')
    )
}