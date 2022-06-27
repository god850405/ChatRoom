import {ToDateTime} from "../utils/Common.mjs";

export default class Message {
    constructor({userName, message, type, time} = {}) {
        this.userName = userName;
        this.message = message;
        this.type = type
        this.time = time||ToDateTime();
    }
}

