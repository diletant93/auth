import { SessionUser } from "./UserRecord";

export type Session = {
    sessionId:string;
    expire:Date;
} & SessionUser