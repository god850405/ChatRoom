import {ToDateTime} from "../utils/Common.mjs";

export default class Message {
    constructor({userName, message, type} = {}) {
        this.userName = userName;
        this.message = message;
        this.type = type
        this.time = ToDateTime();
    }
}