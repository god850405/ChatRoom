export class User{
    constructor({ sessionID,userName } = {}){
        this.sessionID = sessionID;
        this.userName = userName;
    }
}

export const Users = [];
