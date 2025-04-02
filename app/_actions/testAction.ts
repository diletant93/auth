'use server'

export async function getData(bindedValue:string, defaultValue:string, defaultValue2:string){
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${defaultValue}`)
    const data : {body:string} = await response.json()
    return data
}
