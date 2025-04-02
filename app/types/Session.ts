import { Role } from "./Role";

export type Session = {
    sessionId:string;
    userId:string;
    role:Role;
    expire:Date;
}