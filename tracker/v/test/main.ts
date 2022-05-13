//
//Import app from the outlook library.
import {popup} from '../../../outlook/v/code/outlook.js';
//
import * as outlook from '../../../outlook/v/code/outlook.js';

import * as app from "../../../outlook/v/code/app.js";
//
import {input, io, textarea} from '../../../outlook/v/code/io.js';
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
//
import * as library from "../../../schema/v/code/library.js";
//
import * as theme from '../../../outlook/v/code/theme.js'
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
import * as mod from '../../../outlook/v/code/module.js';
import {Imala, questionnaire} from '../../../schema/v/code/library.js';
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
    async show_panels(): Promise<void> {
        //
        //The for loop is used so that the panels can throw
        //exception and stop when this happens
        for (const panel of this.panels.values()) {
            await panel.paint();
        }
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
                    //populate definers from the database
                    {
                        title: "New Definer",
                        id: "definer",
                        listener: ["event", () => this.definer()]
                    },
                    {
                        title: "Water reading",
                        id: "water",
                        listener: ["event", () => this.water()]
                    },
                    {
                        title: "Enter Payments",
                        id: "payment",
                        listener: ["event", () => this.payment()]
                    },

                    {
                        title: "Register (LV1)",
                        id: "complete_lv1_registration",
                        listener: ["event", () => this.complete_lv1_registration()]
                    },
                    {
                        title: "Reply message",
                        id: "reply_message",
                        listener: ["event", () => this.reply_message()]
                    }
                ]
            }];
    }
    async complete_lv1_registration(): Promise<void> {
        //
        //create a new instance.
        const Regist = new complete_lv1_registration(this);
        //
        const result = await Regist.administer();
        //
        //collect all the user data
        if (result === undefined) return;

    }
    //
    //Reply to the message that is currently selected in
    //the message panel of the application.
    async reply_message(): Promise<void> {
        //
        //Create a terminal class to supprot the reply message.
        const reply = new reply_message(this);
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
    }
    //
    async payment(): Promise<void> {
        //
        //create a new instance.
        const Payment = new payment(this);
        //
        const result = await Payment.administer();
        //collect all the data
        if (result === undefined) return;

    }
    //
    async water(): Promise<void> {
        //
        const Water = new water(this);
        //
        const result = await Water.administer();
        //collect all the data
        if (result === undefined) return;
    }
    //
    //
    async definer(): Promise<void> {
        //create a new instance.
        const Definer = new definer(this);
        //
        const result = await Definer.administer();
        //collect all the data
        if (result === undefined) return;
    }
}
//
//Reply to the message that is currently selected in
//the message panel of the application.
class reply_message
    extends mod.terminal
    implements mod.questionnaire, mod.message, mod.journal {
    //
    declare public mother: main;
    //
    //The text obtained from the tab data
    public dbname = "mutall_users";
    //
    public language!: string;
    //
    public message!: string;
    //
    public organization!: string;
    //
    public amount?: string;
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
        //Start with an empty array
        const label: Array<quest.label> = [];
        //
        //1.Get the language.
        label.push([dbname, "msg", [], "language", this.language]);
        //
        //2.Get the message as a label
        label.push([dbname, "msg", [], "text", this.message]);
        //
        //Get the organization/business related with this message and
        //save to the relevant database, providing all the required
        //information.
        label.push([dbname, "business", [], "id", this.organization]);
        //
        //3. Get the amount if applicable.
        //Record the amount in the journal entry in relation to
        //the account to be debited and the account to be credited
        //for book keeping.
        label.push([dbname, "je", [], "amount", this.amount!]);
        //
        //Return the collection of labels as a layout.
        return label;
    }
    //
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the language.
        this.language = this.get_input_value("language");
        //
        //1.2 Collect and check the message.
        this.message = this.get_input_value("message");
        //
        // 1.3 Collect and check the organization.???
        this.organization = this.get_input_value("organization");
        //
        //1.4 Collect and check the amount.
        this.amount = this.get_input_value("amount");
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
    //Collect the message and media of communication specified by the user.
    async get_result(): Promise<true> {return true;}
    //
    async show_panels(): Promise<void> {
        //
        //1.  Fill the language selector.
        //
        //2. Paint the original message on the template.
        //
        //2.1 Get the html element that is linked to the message panel.
        const panel = this.get_element("#message");
        //
        //2.2 Retrieve the selected message from the panel as a primary key 
        //to the message.
        let pk: number = this.get_selected_message_pk(panel);
        //
        //2.3 Use the primary key to retrieve the text message from the database.
        let msg:string = await this.get_message_text(pk);
        //
        //2.4 Paint the message to this template.
        //
        //Get the text area element of where to add the message.
        const text_area = this.get_element("prev_message");
        //
        //Ensure the element we are painting to is a textarea.
        if (!(text_area instanceof HTMLTextAreaElement))
            throw new schema.mutall_error(`The element isentified by prev_message is not a textarea`);
        //
        //Put the message in the text area.
        text_area.value = msg;
        //
        //3. Switch the contribution on and off depending on whether 
        //the original message is associated with an event.
        //
    }
    //
    //Get the selected message primary key.
    get_selected_message_pk(panel: HTMLElement): number { 
        //
        //Get the class of the selected message.
        const message: HTMLElement = this.get_element(".TR");
        //
        //Use the message class to get the primary key 
        const msg_pk: string | null = message.getAttribute("pk");
        //
        //Convert the string to a number.
        const number: number = parseFloat(msg_pk!);
        //
        //Return the primary key.
        return number;
    }
    //
    //Use the given primary key to retrieve and return the message text from the database.
    async get_message_text(pk: number): Promise<string> {
        //
        //Get the message from the database and extract
        //the text from the database.
        const text_msg: string = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [`SELECT text FROM  msg WHERE ${pk}`]
        );
        //
        //return the text message.
        return text_msg;
    }

}
//
class payment
    extends outlook.baby<true>
    implements mod.journal {
    //
    declare public mother: main;
    //
    //Add a definite assignment assertion to all the properties.
    public amount!: string;
    //
    public client!: string;
    //
    public date!: string;
    //
    public mode!: string;
    //
    //create a new payment class instance
    constructor(mother: main) {
        super(mother, "payments.html")
    }
    get_business_id(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_je(): {ref_num: string; purpose: string; date: string; amount: number;} {
        //
        //1.Collect all the field provided.
        // const j = [];
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

        throw new schema.mutall_error('Method not implemented.');
    }
    get_debit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_credit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //In future, check if a file json containing iquestionare is selected
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the Amount.
        this.amount = this.get_input_value("amount");
        //
        //1.2 Collect and check the client.
        this.client = this.get_input_value("client");
        //
        //1.3 Collect and check the date.
        this.date = this.get_input_value("date");
        //
        //1.4 Collect and check the mode.(in line 96 in view)
        this.mode = this.get_checked_value("mode");
        //
        //2. Post the data to the database.
        const post = await this.mother.accountant.post(this);
        //
        return post;
    }
    //
    //Collect the checked values in a form for saving to the database.
    get_checked_value(name: string): string {
        //
        //Get the value from the provided identifier.
        const radio = document.querySelector(`input[name='${name}']:checked`);
        //
        //Alert the user if no  radio button is checked.
        if (radio === null) alert("check one value");
        //
        //Get the checked value.
        const value = (<HTMLInputElement> radio).value;
        //
        return value;
    }
    //
    //
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
        //1. Fill the selector with clients from the database.
        //

    }
}
//
class water
    extends outlook.baby<true>
    implements mod.questionnaire {
    //
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    public date!: string;
    //
    public meter!: string;
    //
    public current_reading!: string;
    //
    //create a new water class instance
    constructor(mother: main) {
        //
        super(mother, 'water.html')
    }
    //
    //
    get_layouts(): Array<quest.layout> {
        //
        //The database name.
        const dbname = "rentize";
        //
        //Start with an empty array
        const w: Array<quest.label> = [];
        //
        //1.Get the date.
        w.push([dbname, "wreading", [], "date", this.date]);
        //
        //2. Get the water meter.
        w.push([dbname, "wreading", [], "meter", this.meter]);
        //
        //3. Get the current reading.
        w.push([dbname, "wreading", [], "value", this.current_reading]);
        //
        return w;
    }
    //
    //In future, check if a file json containing iquestionare is selected
    //
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the date.
        this.date = this.get_input_value("date");
        //
        if (this.date === "") this.report_element!.textContent = "Please select a date";
        //
        //1.2 Collect and check the meter.
        this.meter = this.get_input_value("meter");
        //
        if (this.meter === "") this.report_element!.textContent = "Select a meter";
        //
        //1.3 Collect and check the current reading value.
        this.current_reading = this.get_input_value("current_reading");
        //
        if (this.current_reading === "") this.report_element!.textContent = "Enter a value";
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        return save;
    }
    //
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
        //1. Set the date to current.
        const dateTime = new Date;
        //
        //Get the value of the provided identifier
        const inputValue = <HTMLInputElement> document.getElementById('date');
        //
        //Set the inputfield value to the current date.
        inputValue.valueAsDate = dateTime;
        //
        //2. Fill the selector with the water meters.

        //
        //3. Add an event listener to the selector so that the last readings can be shown
        //automatically on the form.

        //
        //4. Add a listener to the data entry button so that it can compare the last
        // and current readings turning the consuption to green or red.
    }
}
//

//
class definer
    extends outlook.baby<Idef>
    implements mod.questionnaire {
    //
    //
    constructor(public app: main) {
        //
        super(app, 'definers.html')
    }
    //
    //
    get_layouts(): Array<quest.layout> {
        throw new Error('Method not implemented.');
    }
    //
    //In future, check if a file json containing iquestionare is selected
    //
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //2. Save the data to the database.
        const save = await this.app.writer.save(this);
        //
        return true;
    }

    //
    async get_result(): Promise<Idef> {
        //
        //
        //Get the definer id
        const id = this.get_element('id');
        //
        //ensure you have an input element
        if (!(id instanceof HTMLInputElement)) {
            //
            throw new schema.mutall_error(`input for element "identifier" not found`);
        }
        //
        //Get the definer caption
        const caption = this.get_element('caption');
        //
        //ensure you have an input element.
        if (!(caption instanceof HTMLInputElement)) {
            //
            throw new schema.mutall_error(`Input for element "caption" not found`);
        }
        //
        //Get the organisation
        const organization = this.get_element('organization');
        //
        //ensure the is an input element
        if (!(organization instanceof HTMLInputElement)) {
            //
            throw new schema.mutall_error(`Input for element"organization" not found`);
        }
        //
        //Get the sequence
        const seq = this.get_element('seq');
        //
        //Ensure there is an input element
        if (!(seq instanceof HTMLInputElement)) {
            //
            throw new schema.mutall_error(`Input for element "sequence" not found`);
        }
        //
        //compile the message
        const idefi: Idef = {
            def: id.value,
            caption: caption.value,
            organization: organization.value,
            seq: seq.valueAsNumber
        };
        //
        return idefi;
    }
    async show_panels(): Promise<void> {
        //

    }
}
//
//
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
    async get_result(): Promise<void> {}
    //add an event listener.
    async show_panels() {
        //
        //1. Populate the roles fieldset.
        //Hint. Check out how the current roles are being filled in from the database.
        this.fill_user_roles();
        //
        //2. Populate the business selector with businesses.
        //Hint. Use the selector query to populate.
        this.fill_selector("mutall_users", "user", "organization");
    }
    fill_selector(arg0: string, arg1: string, arg2: string) {
        // throw new schema.mutall_error('Method not implemented.');
    }
    async fill_user_roles(): Promise<Array<string> | undefined> {
        //
        //1.Collect from the user the minimum registration requirement.
        //The minimum requirement are the roles
        //
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
        const Role = new outlook.choices<string>(this.config.lev1_reg, inputs, "role_id");
        //
        //Get the user roles
        const role_ids = await Role.administer();
        //
        //Test if the user has aborted registration or not
        if (role_ids === undefined) throw new schema.mutall_error(
            "User has aborted the (level 1) registration"
        );

        //
        // The registration was successful so, return the role ids
        return this.user!.role_ids;
    }


}
