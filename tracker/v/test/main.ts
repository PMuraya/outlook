//
import * as outlook from '../../../outlook/v/code/outlook.js';
//
import * as app from "../../../outlook/v/code/app.js";
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
import * as mod from '../../../outlook/v/code/module.js';
//
import * as reg from './reg.js';
//
import * as rep from './reply_msg.js';
//
import * as eve from './event_planner.js';
//
import * as load from './load.js';
//
//
//The structure of a definer.
export type Idef = {
    def: string;
    caption: string;
    organization: string;
    seq: number;
};
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
    public msg?:Array<{text:string, subject: string, event:string}>;
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
                        title: "Create an event" ,
                        id: "create_event",
                        listener: ["event", () => this.create_event()]
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
                        listener: ["event", () => this.complete_lv_registration()]
                    },
                    {
                        title: "Reply message",
                        id: "reply_message",
                        listener: ["event", () => this.reply_msg()]
                    },
                    {
                        title: "Load_table",
                        id: "load_table",
                        listener: ["event", ()=> this.load_table_data()]
                    }
                ]
            }];
    }
    //
    //Load the first table of mutallco_rental.
    async load_table_data(): Promise<void> {
         //
        //Create an instance of the class
        const table_load = new load.load_tables(this);
        //
        //Call crud page and close when done.
        const result = await table_load.administer();
        //
        //check the validity of the data
        if (result === undefined ) return;
    }
    //
    //cd v/test
    async complete_lv_registration(): Promise<void> {
        //
        //create a new instance.???
        const Regist = new reg.complete_lv1_registration(this);
        //
        const result = await Regist.administer();
        //
        //collect all the user data
        if (result === undefined) return;

    }
    //
    //Create event and display on the events panel
    async create_event(): Promise<void>{
        //
        //Create an instance of the class
        const Event = new eve.event_planner(this);
        //
        //Call crud page and close when done.
        const result = await Event.administer();
        //
        //check the validity of the data
        if (result === undefined ) return;
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
        const reply = new rep.Reply_message(this);
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
        return this.msg![0].text;
    }
   
}

