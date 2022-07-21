//
import * as outlook from '../../../outlook/v/code/outlook.js'
//
//Resolve the modules.
import * as mod from '../../../outlook/v/code/module.js';
//
//Import layout from the schema library.
import * as quest from  '../../../schema/v/code/questionnaire.js';
import * as schema from '../../../schema/v/code/schema.js';
//
//Import event class.
import {event_planner} from './event_planner.js'
//
//Import class main.
import main from './main.js';
//
//Expoert the msg interface.
export type Imsg = {msg:string};
//
//This class allows us to write a message to the database and send it.
export class new_message
    //
    //A special quiz class that returns a result that is either true or undefined
    //depending on whether the operation was succesful or not.
    extends outlook.terminal
    implements 
        //
        //This interface allows this page to send the message to users of the
        // current business.
        mod.message,
        //
        //This interface allows this page to write the message to the database.
        mod.questionnaire
 {
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother:main;
    //
    //The database to save to.
    public dbname = "mutall_users";
    //
    //The language of the message.
    public language?:string;
    //
    //The message to send.
    public message?:string;
    //
    //The event associated with the message.
    public event_name?:string;
    //
    //The date the message is sent.
    public date?:string;
    //
    //The subject of the message.
    public subject?: string;
    //
    //The planner class is used to create an event.
    public planner?: event_planner;
    //
    //The business that the user is logged in to.
    public organization?: string;
    //
    //Create a new instance of the message class.
    constructor(mother: main) {
        //
        //1. Call the constructor of the parent class with the mother page and file name.
        super(mother, "create_message.html");
    }
    //
    //Get the sender of the message.
    get_sender(): string {
        //
        //Get the user from the currently logged in user.
        const sender = this.mother.user;
        //
        //Ensure that the user is available.
        if(sender === undefined) throw new schema.mutall_error(`There is no user found`);
        //
        //Return the user name.
        return sender.name!; 
    }
    //
    //Get the content of the message.
    get_body(): string {
        throw new Error('Method not implemented.');
    }
    //
    //Collect as many labels as there are properties for saving.
    get_layouts(): Array<quest.layout> {
        //
        //5. Return the layout.
        return Array.from(this.collect_msg());
    }
    *collect_msg(): Generator<quest.layout> {
        //
        //1. Get the language.
        yield[this.dbname, "msg", [], "language", this.language!];
        //
        //2. Get the message.
        yield[this.dbname, "msg", [], "text", this.message!]
        //
        //3. Get the subject.
        yield[this.dbname, "msg", [], "subject", this.subject!];
        //
        //4. Get the date.
        yield[this.dbname, "msg", [], "date", this.date!]
        //
        //5. Get the organization.
        yield[this.dbname, "business", [], "id", this.organization!];
        //
        //6. Get the event.
    }
    //
    //In future, check if a file json containing iquestionare is selected??
    //
    //Collect and check the data entered by the user sending the message,
    //then write to the data database where appropriate and send the message.
   async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect the language if necessary.
        if(this.language_exists())
            this.language = this.get_selected_value('language');
        //
        //1.2 Collect the message
        this.message = this.get_input_value("msg");
        //
        //1.3 Collect the subject
        this.subject = this.get_input_value("subject");
        //
        //1.4 Collect the date in the mysql format.(not from the input)
        this.date = this.get_input_value('date');
        //
        //1.5 Collect the organization.
        this.organization = this.get_business();
        //
        //1.6 Collect the event if any. This must already have been done during
        //event admistration so its not necessary.
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        //Abort this process if the message was not saved succesfully.
        if(!save) return false;
        //
        //3. Send the message text to the users of the business that the 
        //current user belongs to.
        return await this.mother.messenger.send(this);
    }
    //
    //Get the business from the current logged in user.
    get_business(): string | undefined {
        //
        const business = this.mother.user!.business!;
        //Get the user.
        if(business.source === 'selector') return business.pk;
    }
    //
    //Add additional data to the page after it has loaded.
    async show_panels(): Promise<void> {
        //
        //1. Fill the language selector if necessar.
        if(this.language_exists()) {
            //
            //1. Show the language.
            //
            //2.Populate the selector.
            this.fill_selector("msg","mutall_users", "language");
        } else{
            //
            //hide the language label.
        }
        //
        //2. Initialize the date field with todays date.
        //
        //2.1 Get the date input.
        const input = this.get_element('date');
        //
        //2.1.1 Ensure that the input is a HTMLInputElement.
        if(!(input instanceof HTMLInputElement)) 
            throw new schema.mutall_error(`The element identified by '${input}' is not a HTMLInputElement`);
        //
        //2.2 Append the date to the Input.
        input.valueAsDate = new Date();
        //
        //
        //3. Add a listener to the create event button.
        const create = this.get_element('create_event');
        //
        //create the event using an onclick event.
        create.onclick = async () => await this.create_event();
    }
    //
    //Check the language.
    language_exists(): boolean {
        //
    }
    //
    //Create an event.
    async create_event(): Promise<void>{
        //
        //Create a new instance of the event.
        const planner = new event_planner(this.mother);
        //
        //administer the class and return the result.
        const result = await planner.administer();
        //
        //Check if the event was created or not. If not abort this process.
        if(result === undefined) return;
        //
        //If the event was created, get the name of the event from the planner and
        //save it.
        this.event_name = planner.event_name;
    }
 }