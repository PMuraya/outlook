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
import * as piq from "./piq.js";
//Import the test msg class.
import * as msg from "./msg.js"        
//
import * as svg from "./svg.js"
import * as mod from '../../../outlook/v/code/module.js';
//
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
                    {
                        title: "Create message",
                        id: "create_msg",
                        listener: ["event", ()=>{this.new_msg()}]
                    }
                ]
            },
            {
                title: "Tea Services",
                id: 'tea_services',
                solutions: [
                    //
                    //Registering tea delivery 
                    {
                        title: "Tea Delivery",
                        id: "tea_delivery",
                        listener: ["event", () => this.tea_delivery()]
                    }, 
                    //
                    //Tea payments
                    {
                        title: "Pay Tea",
                        id: "pay_tea",
                        listener: ["event", () => this.pay_tea()]
                    }                  
                ]
            },
            {
                title:"Assignments",
                id: 'assignments',
                solutions: [
                    //
                    //Allow users to input assignments and save to the database 
                    //from GUI.
                    {
                        title: "Input Assignments",
                        id: "input_assignments",
                        listener: ["event", () => this.input_assignments()]
                    },//
                    //View due assignments 
                    {
                        title: "View due assignments",
                        id: "view_due_assignments",
                        listener: ["event", () => this.view_due_assignments()]
                    }
                ]
            },
            {
                title: "Event planner",
                id: 'event_planner',
                solutions: [
                       //
                       //Add a service for creating new events.
                       {
                          title: "Create an event" ,
                          id: "create_event",
                          listener: ["event", () => this.create_event()]
                       }
                ]
            },
            {
                title: "Registration",
                id: 'registration',
                solutions: [
                    //
                    //add intern registration to services.
                    {
                    title: "Register intern(LV2)",
                    id: "piq",
                    listener: ["event", ()=> this.register_intern()]
                    }
                ]
            },
            {
                title: "Website",
                id:"add_definer",
                solutions: [
                    //
                    {
                        title: "View website",
                        id: "website",
                        listener: [ "event", () => this.website()]
                    },
                    //populate definers from the database
                    {
                        title: "New Definer",
                        id: "definer",
                        listener: ["event", () => this.definer()]
                    }
                ]
            },
            {
                title: "SVG Work",
                id: "svg_work",
                solutions:[
                    {
                        title: "SVG",
                        id: "svg",
                        listener: [ "event", async() => this.svg()]
                    }
                ]
            }];
        }
    //
    //Create event and display on the events panel
    async create_event(): Promise<void>{
        //
        //Create an instance of the class
        const Event = new create_event(this);
        //
        //Call crud page and close when done.
        const result = await Event.administer();
        //
        //check the validity of the data
        if (result === undefined ) return;
    }
    //
    //
    async svg(): Promise<void> {
        //
        //Create an instance of the  class
        const Svg = new svg.svg(this);
        //
        //Call crud page and close when done.
        const result: svg.Isvg | undefined =  await Svg.administer();
        //
        //check the validity of the data
        if (result === undefined) return;
        //
        
    }
    //
    //
    async website(): Promise<void>{
        //
        //create an instance of the class 
        const Website = new website(this);
        //
        //Call crud page and close when done.
        const result = await Website.administer();
        //
        //check the validity of the data
        if (result === undefined) return;

    }
    //
    //List all assignments that are due and have not been reported.
    //Ordered by Date. 
    view_due_assignments(): void {
       //
       //1.Create a SQL to get data from the database.
       const sql = `select 
                          todo.id,
                          todo.description,
                          developer.email,
                          datediff(now(),
                          todo.start_date) as days_due
                     from
                          todo
                          inner join developer on developer.developer =
                          todo.developer
                     where
                           datediff(now(),
                           todo.start_date) >= 14`;
         //
         //2. Create a new SQL form using the sql.
         
         
         //
         //3. Administer the form.
                  
    }
    //
    //Tea delivery
    async tea_delivery(): Promise<true> {
        //
        //Create an instance of the tea_delivery class
        const delivery = new tea_delivery(this);
        //
        //Open the popup and close when the user is done.
        await delivery.administer();
        //
        //
        return true;
    }
    //
    //Tea payment
    async pay_tea(): Promise<boolean>{
        //
        //Create an instance of the tea payment class.
        const payment = new pay_tea();
        //
        // Open the popup and close when the user is done.
        await payment.administer();
        //
        //
        return true;
    }
    //
    //Allow users to input assignments from a UI
    async input_assignments(): Promise<void> {
        //
        //Create an instance of input assignments.
        const input = new input_assignments();
        // 
        //Call crud page and close when done.
        await input.administer();
    }
    
    //
    //An event listener for registering a new user.
    async register_intern(): Promise<true | undefined> {
        //
        //create an instance
        const Piq = new piq.register_intern(this);
        //
        //check whether the result is true or false(if we have successfully 
        //registered an intern)
        //Cast to define true or undefined.
        const result/*: true | undefined */= await Piq.administer();
        //
        //continue only if a user was successfully registered.
        if (result === undefined) return;
        //
        //update the homepage with the new intern(s).
        return true;
    }
    //An event listener for creating a new message.
    async new_msg(): Promise<void> {
        //
        //create a popup that facilitates sending a new message
        const Msg = new msg.new_msg(this);
        //
        //collect all the data from the user
        const result: true | undefined = await Msg.administer();
        //
        //check the validity of the data
        if (result === undefined) return;
        //
        //The message was succesfully sent so update the page.
        //??
    }
    //
    async definer(): Promise<void> {
        //
        //
        const select = this.get_element("definer");
        //
        //List of definers
        const definer: Array < { id: string } > = await server.exec(
            "database", 
            ["mutall_tracker"],
            "get_sql_data", 
            ["select id from definer"]
        );
        //
        //Formulate the option from the definers list.
        const options: Array < string > = definer.map(
            (definer) => `<option value= '${definer.id}'>${definer.id}</option>`
        );
        //
        //Convert option to text
        const options_str: string = options.join("\n");
        //
        //Attach the options to the select element.
        select.innerHTML = options_str;
    } 
}

class definer extends outlook.baby<Idef>{
   //
    static innerHTML: HTMLElement;
    //
    //
    constructor(app: main) {
        //
      super(app,'definers.html')  
    }
    //In future, check if a file json file containing Iquestionnaire is selected.
    //For now, do nothing
   async check(): Promise<boolean>{return true;}
    //
    show_panels(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    //
    async get_result(): Promise<Idef> {
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
}
class tea_delivery 
    extends outlook.baby<true>
    implements mod.journal 
{
    //
    declare public mother:main;
    //
    constructor(mother: main){
      super(mother, 'tea_delivery.html')
    }
    get_business_id(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_je(): {
        ref_num: string; 
        purpose: string; 
        date: string;
        amount: number;
    } {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_debit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    get_credit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //check if a file json file containing Iquestionnaire is selected.
    //For now, do nothing
    async check():Promise<boolean> {
        //
        //1. Post to the accounts module.
        const post: boolean = await this.mother.accountant.post(this);
        //
        //At this point if an error occurs during posting, its handled at the module level
        //See the implmentation in the module class.
        //
        return post;
    }
    //
    //Collect data to show whether we should update the home page or not.
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    //Add an event listener to the ok button.
    async show_panels() {
      //
      //1.Populate the merchants selector.
      //
      //Get the ok button
      const save = this.get_element("go");
      
    }
  }
  //
  //Tea payment 
class pay_tea extends popup<void>{
    //
    constructor(){  
        super('pay_tea.html')
    }
    //
    //Collect data to show show if we should update the homepage or not.
    async check(): Promise<boolean> {return true};
    //
    //Collect data to show whether we should update the home page or not.
    async get_result(): Promise<void> {}
    //
    //Add an event listener to the ok button.
    async show_panels() {
        //
        //Get the ok button
        const save = this.get_element("go");
        //
        //Add an event listener to the ok button.
        save.onclick = async () => this.pay_tea();
    }
    pay_tea (){
        //
        alert('Success');
     }
}
//
//Assignments input. 
class input_assignments extends popup<void>{
    //
    constructor(){
        super('')
    }
    //
    //
    async check(): Promise<boolean> {return true};
    //
    //Check if a file json containing Iquestionare is selected.
    async get_result(): Promise<void> {}
    //
    //add an event listener.
    async show_panels() {
        //
        //Get the ok button
        const save = this.get_element("go");
        //
        //
        save.onclick = async () => this.input_assignments();
    }
    input_assignments(){
        alert('Success');
    }
}
//
//
class website extends outlook.baby<true>{
    //
    //Construct class website.
    constructor(app: main){
        //
        super(app, "web.html")
    }
    //
    //check the entered data and if correct return true else return false.
    //And prevents one from leaving the page.
    async check(): Promise<true> {
        //
        return true;        
    }
    //
    //Implement abstract method
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
        //  1. Populate the definers panel with our definers id and desription.
        //
        //2. Populate the content panel with a query results derived from content and definers.
        //
        //3. Populate the header panel with definers id only
        
    }
}
//
//
class create_event 
    extends outlook.baby<true> 
    implements  mod.questionnaire, mod.message, mod.cron_job, mod.journal 
{
    //
    declare public mother: main;
    //
    //Create an instance of class create_event.
    constructor(mother: main) {
        //
        super(mother, 'Event_form.html')
    }
    get_sender(): string {
        throw new Error('Method not implemented.');
    }
    get_body(): string {
        throw new Error('Method not implemented.');
    }
    //
    get_business_id(): string {
        throw new Error("Method not implemented.");
    }
    get_je(): {
        ref_num: string; purpose: string; date: string; amount: number; //
    } {
        throw new Error("Method not implemented.");
    }
    get_debit(): string {
        throw new Error("Method not implemented.");
    }
    get_credit(): string {
        throw new Error("Method not implemented.");
    }
    //
    report_error(): void {
        throw new Error('Method not implemented.');
    }
    //
    // Implement the scheduler for scheduling tasks.
    exec(crj: mod.cron_job): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    //
    //
    //Collect all the labels as there are many inputs.
    get_layouts(): Array<quest.layout> {
        throw new Error("Method not implemented.");
    }
    
    //
    //
    async check(): Promise<boolean> {
        //
         //1. Collect and check the data that the user has entered.
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        //3. Send the appropriate message to the user(s).
        const send = await this.mother.messenger.send(this);
        //
        //4. Update the accounting book keeping system.
       const post = await this.mother.accountant.post(this);
        //
        //5. Schedule tasks if necessary.
        const exec = await this.mother.scheduler.exec(this);
        //
        return save && send && post && exec;
    }
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
    }
}