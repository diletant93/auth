import { Role } from "./Role";

export type Session = {
    id:string;
    userId:string;
    role:Role;
    expire:Date;
}