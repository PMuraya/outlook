//
//Resolves references to the asset.products data type.
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import schema.
import * as schema from "../../../schema/v/code/schema.js";
//
export type Imsg = {msg:string};
//
//use popup to create a new message
export class msg extends outlook.baby<Imsg> {
    //
    constructor(base:outlook.page) {
        super(base, "new_msg.html");
    }
    //
    //In future, check if a file json containing iquestionare is selected
    //
    check(): boolean {
        //
        //Get the message text.
        const text = <HTMLTextAreaElement>this.get_element('msg');
        //
        if (text.value==="") {
            //
            this.win.alert('Please enter a message');
            //
            return false;
        }
        //
        //compile message.
        this.result = <Imsg>{msg: text.value};
        //
        return true;
    }
    //
    //Collect the message and media of communication specified by the user.
    async get_result(): Promise<Imsg> {
        //
        return this.result!;
    }
    //
    async show_panels(): Promise<void> {
        const myalert = this.get_element('alert');
        myalert.onclick = () =>this.win.alert('Alert');
    }
}