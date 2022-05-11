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
import * as library from "../../../schema/v/code/library.js";
//
import * as theme from '../../../outlook/v/code/theme.js'
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js'; 
//
import * as mod from '../../../outlook/v/code/module.js';
import { Imala, questionnaire } from '../../../schema/v/code/library.js';
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
                id:"definers",
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
                        title:"Register (LV1)",
                        id:"complete_lv1_registration",
                        listener: ["event", () => this.complete_lv1_registration()]
                    },
                    {
                        title: "Reply message",
                        id:"reply_message",
                        listener: ["event", ()=> this.reply_message()]
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
    async reply_message(): Promise<void>{
        //
        //create a new instance
        const Reply = new reply_message(this);
        //
        const result = await Reply.administer();
        //collect all the user data
        if (result === undefined) return;
    }
    //
    async payment(): Promise<void> {
        //
        //create a new instance.
        const Payment = new payment(this);
        //
        const result = await Payment.administer();
        //collect all the data
        if (result === undefined ) return;

    }
    //
    async water(): Promise<void> {
        //
        const Water = new water(this);
        //
        const result = await Water.administer();
        //collect all the data
        if(result=== undefined)return;
    }
    //
    //
     async definer(): Promise<void> {
         //create a new instance.
         const Definer = new definer(this);
         //
         const result = await Definer.administer();
         //collect all the data
         if(result=== undefined)return;
    }
}
//
//Reply to a message.
class reply_message 
    extends outlook.baby<true>
    implements mod.questionnaire, mod.message, mod.journal
{
    //
    declare public mother:main;
    //
    //
    public language!: string;
    //
    public message!:string;
    //
    public organization!: string;
    //
    public amount!: string;
    //
    //create a new reply message class instance
    constructor(mother:main){
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
<<<<<<< Updated upstream
    get_layout(): Array<quest.label> {
=======
    get_layouts(): Array<quest.label> {
>>>>>>> Stashed changes
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
        label.push([dbname,"business",[],"id", this.organization]);
        //
        //3. Get the amount if applicable.
        //Record the amount in the journal entry in relation to
        //the account to be debited and the account to be credited
        //for book keeping.
        label.push([dbname,"je",[],"amount", this.amount]);
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
    async get_result(): Promise<true> { return true;}
    //
    async show_panels(): Promise<void> {
        //
        //1. Fill the message source.
        //
        //1.1 Let the message panel be the anchor tag.
        const anchor = this.get_element("message");
        //
        //
        //1.2 Get the selected message and extract the text.
        //
        //
        //1.3 Get the result.
        //
        //1.4 Get the textarea and add the result as the value.
        //
        //2. Fill the language selector.
        
        //
        //3. Switch the contribution on and off as depending on the message sent.
        //
    }
    //
    //Populate the selector with clients from the current database
    //  populate_selector(): void {
    //     //
    //     //1.Get the current database: It must EXIST by THIS TIME
    //     const dbase = this.dbase;
        
    //     if (dbase === undefined) throw new Error("No current db found");
    //     //
    //     //2.Get the client selector.
    //     const selector = <HTMLSelectElement>this.get_element("selection");
    //     //
    //     //3.Loop through all the clients of the database
    //     //using a for-in statement
    //     for (const ename in dbase.entities) {
    //         //
    //         //3.1 Create a selector option
    //         const option = this.document.createElement('option');
    //         //
    //         //  Add the name that is returned when you select
    //         option.value = ename;
    //         //
    //         //3.2 Populate the option
    //         option.textContent = ename;
    //         //
    //         //Set the option as selected if it matches the current subject
    //         if (ename === this.subject[0]) option.selected = true;
    //         // 
    //         //3.3 Add the option to the subject selector
    //         selector.appendChild(option);
    //     }
    // }
}
//
class payment 
    extends outlook.baby<true>
    implements mod.journal
{
    //
    declare public mother:main;
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
    constructor(mother: main){
        super(mother, "payments.html")
    }
    get_business_id(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_je(): { ref_num: string; purpose: string; date: string; amount: number; } {
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
    get_checked_value(name: string):string{
        //
        //Get the value from the provided identifier.
        const radio = document.querySelector(`input[name='${name}']:checked`);
        //
        //Alert the user if no  radio button is checked.
        if (radio===null) alert("check one value");
        //
        //Get the checked value.
        const value = (<HTMLInputElement>radio).value;
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
    implements mod.questionnaire
{
    //
    declare public mother:main;
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
    public current_reading!:string;
    //
    //create a new water class instance
    constructor(mother: main) {
       //
      super(mother,'water.html')  
    }
    //
    //
<<<<<<< Updated upstream
    get_layout(): Array<quest.layout> {
=======
    get_layouts(): Array<quest.layout> {
>>>>>>> Stashed changes
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
        if(this.date === "") this.report_element!.textContent = "Please select a date";
        //
        //1.2 Collect and check the meter.
        this.meter = this.get_input_value("meter");
        //
        if(this.meter === "") this.report_element!.textContent = "Select a meter";
        //
        //1.3 Collect and check the current reading value.
        this.current_reading = this.get_input_value("current_reading");
        //
        if(this.current_reading === "") this.report_element!.textContent = "Enter a value";
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
        const inputValue = <HTMLInputElement>document.getElementById('date');
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
    implements mod.questionnaire
{
    //
    //
    constructor(public app: main) {
        //
      super(app,'definers.html')  
    }
    //
    //
<<<<<<< Updated upstream
    get_layout(): Array<quest.layout> {
=======
    get_layouts(): Array<quest.layout> {
>>>>>>> Stashed changes
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
         if (!(id instanceof HTMLInputElement)){
             //
             throw new schema.mutall_error(`input for element "identifier" not found`);
         }
         //
         //Get the definer caption
         const caption = this.get_element('caption');
         //
         //ensure you have an input element.
         if(!(caption instanceof HTMLInputElement)){
             //
             throw new schema.mutall_error(`Input for element "caption" not found`);
         }
         //
         //Get the organisation
         const organization = this.get_element('organization');
         //
         //ensure the is an input element
         if(!(organization instanceof HTMLInputElement)){
             //
             throw new schema.mutall_error(`Input for element"organization" not found`);
         }
         //
         //Get the sequence
         const seq = this.get_element('seq');
         //
         //Ensure there is an input element
         if(!(seq instanceof HTMLInputElement)){
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
        ){
        super("lv1_reg.html" )
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
