//
//Import app from the outlook library.
import {popup} from '../../../outlook/v/code/outlook.js';
//
import * as outlook from '../../../outlook/v/code/outlook.js';

import * as app from "../../../outlook/v/code/app.js";
//
import {input, io} from '../../../outlook/v/code/io.js';
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
import * as mod from '../../../outlook/v/code/module.js';
import * as lib from '../../../schema/v/code/library.js';
//
//
//The structure of a definer.
export type Idef = {
    def: string;
    caption: string;
    organization: string;
    seq: number;
}
//System for daily management of organization activities.
export default class main extends app.app {
    //
    //
    public writer: mod.writer;
    public messenger: mod.messenger;
    public accountant: mod.accountant;
    public scheduler: mod.scheduler;
    //
    //
    public msg!:Array<{text:string}>;
    //
    //Initialize the main application.
    constructor(config: app.Iconfig) {
        super(config);
        //
        //initialize the above
        this.writer = new mod.writer();
        this.messenger = new mod.messenger();
        this.accountant = new mod.accountant();
        this.scheduler = new mod.scheduler();
    }

    //
    //
    //Retuns all the inbuilt products that are specific to
    //thus application
    get_products_specific(): Array<outlook.assets.uproduct> {
        return [
            {
                title: "Actions",
                id: 'actions',
                solutions: [
                    //
                    //View due assignments
                    {
                        title: "Manage Events",
                        id: "events",
                        listener: ["crud", 'event', ['review'], '+', "mutall_users"]
                    },
                    {
                        title: "Manage Messages",
                        id: "messages",
                        listener: ["crud", 'msg', ['review'], '+', "mutall_users"]
                    },

                ]
            },
            {
                title: "Website",
                id: "definers",
                solutions: [
                    //
                    {
                        title: "Register (LV1)",
                        id: "complete_lv1_registration",
                        listener: ["event", () => this.complete_lv1_registration()]
                    },
                    {
                        title: "Reply message",
                        id: "reply_message",
                        listener: ["event", () => this.reply_msg()]
                    }
                ]
            }];
    }
    async complete_lv1_registration(): Promise<void> {
        //
        //create a new instance.???
        const Regist = new complete_lv1_registration(this.config);
        //
        const result = await Regist.administer();
        //
        //collect all the user data
        if (result === undefined) return;

    }
    //
    //Reply to the message that is currently selected in
    //the message panel of the application.
    async reply_msg(): Promise<void>{
        //       
        //1. Get the message panel    
        const panel = this.get_element("message");
        //
        //2. Get the primary key using the message panel.
        const pk: number =await this.get_selected_message_pk(panel);
        //
        //2.3 Use the primary key to retrieve the text message from the database.
        const msg:string = await this.get_message_text(pk);
        //
        //Get the message (msg) from above and store it locally to be able to access it 
        //when the reply message fires.
        localStorage.setItem('msg', JSON.stringify(msg));
        //
        //Create a terminal class to supprot the reply message.
        const reply = new Reply_message(this);
        //
        //Wait for the user to reply.
        const response: true | undefined = await reply.administer();
        //
        //Check the response to see whether the user aborted the reply
        //or not. If aborted, discontinue this process.
        if (response === undefined) return;
        //
        //At this point we are successful to replying to the message.
        //Refresh the message panel to see the response. This is a drastic action
        //that causes the page to flash. A better method would be to add the reply
        //to the message panel. Thats the challenge, but for this version we shall take
        //the less sophisticated method.
        //
    }
    //
    ///Get the primary key of the selected message using the panel.
    async get_selected_message_pk(panel: HTMLElement): Promise<number> {
        //
        //Get the class of the selected message.
        const message: Element | null = panel.querySelector(".TR");
        //
        //Use the message class to get the primary key
        const msg_pk = message!.getAttribute("pk");
        //
        //Convert the string to a number.
        const number = parseFloat(msg_pk!);
        //
        //Return the primary key.
        return number;
    }
    //
    //Get the message from the database using the primary key above.
    async get_message_text(pk: number): Promise<string> {
        //
        //Get the message from the database and extract
        //the text from the database.
        this.msg = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [`SELECT text FROM  msg WHERE msg.msg = ${pk}`]
        );
        //Verify that your data retrievel extracted one and only one message
        //
        //return the text message.
        return this.msg[0].text;
    }
   
}
//
//Reply to the message that is currently selected in
//the message panel of the application.
class Reply_message
    extends mod.terminal
    implements mod.questionnaire, mod.message, mod.journal {
    //
    declare public mother: main;
    //
    public language!: string;
    //
    public message!: string;
    //
    public organization!: string;
    //
    public amount!: string;
    //
    //create a new reply message class instance
    constructor(mother: main) {
        //
        super(mother, "rep_msg.html")
    }
    get_business_id(): string {
        throw new Error('Method not implemented.');
    }
    get_je(): {
        ref_num: string;
        //
        purpose: string;
        //
        date: string;
        //
        amount: number;
    } {
        //
        //1.Collect all the field provided.
        //
        //1.1 Get the reference number.
        //
        //1.2 Get the purpose of the transaction.
        //
        //1.3 Get the date.
        //
        //1.4 Get the amount payed.
        //
        //2.
        //
        //. Return the values.
        // return ;
        throw new Error('Method not implemented.');
    }
    get_debit(): string {
        throw new Error('Method not implemented.');
    }
    get_credit(): string {
        throw new Error('Method not implemented.');
    }
    get_sender(): string {
        throw new Error('Method not implemented.');
    }
    get_body(): string {
        throw new Error('Method not implemented.');
    }
    //
    //Collect all the label layouts from the messaging reply dialogue box.
    get_layouts(): Array<quest.label> {
        //
        //The database name.
        const dbname = "mutall_users";
        //
        //Start with an empty array.
        const l: Array<quest.label> = [];
        //
        //1.Get the language.
        l.push([dbname, "msg", [], "language", this.language]);
        //
        //2.Get the message as a label
        l.push([dbname, "msg", [], "text", this.message]);
        //
        //Get the organization/business related with this message and
        //save to the relevant database, providing all the required
        //information.
        l.push([dbname, "business", [], "id", this.organization]);
        //
        //3. Get the amount if applicable.
        //Record the amount in the journal entry in relation to
        //the account to be debited and the account to be credited
        //for book keeping.
        l.push([dbname, "je", [], "amount", this.amount!]);
        //
        //Return the layouts ;
        return l;
    }
    //
    //Collect and check the repy message data and set the result.
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the language.
        this.language = this.get_selected_value("language");
        //
        //Check the selected language.
        if (this.language === null) alert ("Select a language");
        //
        //1.2 Collect and check the message.
        this.message = this.get_input_value("message");
        //
        //Check the message
        if (this.message ===null) alert ("Please write a message");
        //
        //Collect and check the amount data where the value is checked.
        const checked = this.get_checked_value("contribution");
        console.log(checked);
        //
        if(checked === "yes") {
            //
            //1.4 Collect and check the amount.
            this.amount = this.get_input_value("amount_no");
            //
            //Check the amount.
            if (this.amount === null) alert ("Enter a valid amount.")
        } else{
            //
            //Do nothing.
        }
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        //3. Reply the appropriate message from the user(s).
        const send = await this.mother.messenger.send(this);
        //
        //4. Decide whether the accounting and scheduler modules are neccesary.
        //if yes invoke them.
        //
        return save && send;
    }
    //
    //Additional information needed after the page fires.
    async show_panels(): Promise<void> {
        //
        //1.  Fill the language selector.
        this.fill_selector("msg", "mutall_users","language");
        //
        //2. Paint the original message on the template.
        //
        //2.2 Get the text area element of where to add the message.
        const text_area: HTMLElement = this.get_element("prev_message");
        //
        //2.2 Ensure the element we are painting to is a textarea.
        if (!(text_area instanceof HTMLTextAreaElement))
            throw new schema.mutall_error(`The element identified by prev_message is not a textarea`);
        //
        //Retrieve the message (msg) from the local storage.
        var text_msg = localStorage.getItem('msg');
        //
        // 2.3 Put the retrieved message in the text area.???
        text_area.value =(JSON.parse(text_msg!));
        //
        //3. Switch the contribution on and off depending on whether
        //the original message is associated with an event.
        //
    }
}
//
//Make it a part of the registration.
//
//Complete the level one registration of the user after logging into the system.
class complete_lv1_registration extends popup<void>
// type role: Array<string>, org:string}
{
    //
    //
    public dbname!: string;
    //
    public dbase!: schema.database;
    //
    public user!: outlook.user;
    //
    //construct the reg class
    constructor(
        //
        public config: app.Iconfig
    ) {
        super("lv1_reg.html")
    }
    async check(): Promise<boolean> {
        // const save = await this.mother.writer.save(this);
        //
        return true;
    }
    //
    async get_result(): Promise<void> {}
    //
    //add an event listener.
    async show_panels() {
        //
        //1. Populate the roles fieldset.
        //Hint. Check out how the current roles are being filled in from the database.
        const roles =  this.fill_user_roles();
        //
        //Get the roles div and add the roles
        const set_roles = this.get_element("content");
        //
        //2. Populate the business selector with businesses.
        //Hint. Use the selector query to populate.
        this.fill_selector( "user","mutall_users", "organization");
    }
    
    async fill_user_roles(): Promise<Array<string> | undefined> {
        //
        //1.Collect from the user the minimum registration requirement.
        //The minimum requirement are the roles
        //
        //Collect the user roles for this application from its
        //products
        const inputs = this.dbase!.get_roles();
        //
        //If these roles are undefined alert the user
        if (inputs === undefined || inputs.length < 0) {
            alert("No roles found");
            // return;
        }
        //
        //Open the popup page for roles
        const Role = new outlook.choices<string>(this.config.general, inputs, "role_id");
        //
        //Get the user roles
        const role_ids = await Role.administer();
        //
        //Test if the user has aborted registration or not
        if (role_ids === undefined) throw new schema.mutall_error(
            "user aborted"
        );
        //
        // The registration was successful so, return the role ids
        return this.user!.role_ids;
    }


}

