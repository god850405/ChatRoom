import Message from "./Message.mjs";
import { ToDateTime } from "../utils/Common.mjs";
export class Room{
    constructor({ roomID,title,password,owner } = {}){
        this.roomID = roomID;
        this.title = title;
        this.password = password;
        this.owner = owner;
        this.users = [];
        this.messages = [
            new Message({
                userName: "system",
                message: "Welcome!",
                type: "text",
                time: ToDateTime(new Date()),
            })
        ];
    }
    join(sessionID,password){
        if(this.password !== '' || this.password !==undefined){
            if(this.users.includes(sessionID) || this.password!==password){
                return false;
            }
        }
        this.users.push(sessionID);
        return true;
    }
    leave(sessionID){
        this.users.filter(user!==sessionID);
    }
    post(message){
        this.messages.push(message);
    }   
    allMessage(){
        return this.messages;
    }
}
export const Rooms = [];
