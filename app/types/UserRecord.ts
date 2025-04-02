import { Role } from "./Role";

export type UserRecord = {
    id?:string;
    created_at?:string;
    name?:string;
    email?:string;
    password?:string;
    salt?:string;
    role?:Role;
}