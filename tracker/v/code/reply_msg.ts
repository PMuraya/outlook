//
import * as outlook from '../../../outlook/v/code/outlook.js';
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
//Resolve the modules.
import * as mod from '../../../outlook/v/code/module.js';
//
//Resolve main class
import main from './main.js';
//
//Resolve the event class.
import { event_planner} from './event_planner.js';
//
//Reply to the message that is currently selected in
//the message panel of the application.
export class Reply_message
    extends outlook.terminal
    implements mod.questionnaire, mod.message
{
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother: main;
    //
    //
    public user?: string;
    //
    //Language used.
    public language?: string;
    //
    //The message.
    public message?: string;
    //
    //The business.
    public organization?: string;
    //
    //The evnt info.
    public contribution?: {event: event_planner, amount:string};
    //
    //create a new reply message class instance
    constructor(mother: main) {
        //
        //1. Call the constructor of the parent class with the mother page and file name.
        super(mother, "rep_msg.html")
    }
    //
    //Get the sender of the message.
    get_sender(): string {
        //
        //Get the user who is currently logged in.
        const sender = this.mother.user;
        //
        //Ensure that a user is available.
        if(sender === undefined) throw new schema.mutall_error(`No user found!`);
        //
        //Return the sender name.
        return sender.name!;
    }
    //
    //Get the content of the message.
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
        //0. Get the user
        l.push([dbname, "user", [], "name", this.user!]);
        //
        //1.Get the language.
        l.push([dbname, "msg", [], "language", this.language!]);
        //
        //2.Get the message as a label
        l.push([dbname, "msg", [], "text", this.message!]);
        //
        //Get the organization/business related with this message and
        //save to the relevant database, providing all the required
        //information.
        l.push([dbname, "business", [], "id", this.organization!]);
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
        //1.0 Collect the user.
        this.user = this.get_user();
        //
        //1.1 Collect and check the language.
        this.language = this.get_selected_value("language");
        //
        //1.2 Collect and check the message.
        this.message = this.get_input_value("message");
        //
        //1.3 Work on more to see if there is an event related that is contributory.
        //If there is such an event, proceed to identify the event collect the contribution.???
        this.contribution = this.get_contribution(); 
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        //3. Reply the appropriate message from the user(s).
        const send = await this.mother.messenger.send(this);
        //
        //4. Decide whether the accounting module is neccesary.
        //It is necessary if a contributory event is invoked, call the accountant class
        //to post the.
        if (!(this.contribution === undefined)){
            //
            //1. Update the book of accounts
            //
            //1.0 Get the event.(Required in a new message)
            //  const evt = this.contribution.event;
             //
             //1.1 Get the amount contributed
             const amount = this.contribution.amount;
             //
             //1.2 Construct a journal from the amount.
             const je = new event_journal(amount);
             //
             //2. Effect the payment.
             //
             //3. Post the journal.
             const post = await this.mother.accountant.post(je);
             //
             //If the posting was successful,
             return post;
        }
        //
        return save && send;
    }
    get_contribution(): { event: event_planner, amount: string} {
        //
        //Get the event related to this contribution.
        const event = this.contribution!.event;
        //
        //Get the amount and return the value.
        const amount = this.get_input_value('amount');
        //
        //Return the amount.
        return {event, amount};
    }
    //
    //Get the user who is currently logged in.
    get_user(): string {
        //Get the operator from the currently logged in user.
        const user: outlook.user | undefined = this.mother.user;
        //
        //Ensure that the user is available
        if(user === undefined) throw new schema.mutall_error(`No user found`);
        //
        //Return the user.
        return user.name!;
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
        // var text_msg = localStorage.getItem('msg');
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
//Collect all the information required to post a journal for an event
//contribution.
class event_journal implements mod.journal{
    //
    declare public mother: main
    //
    public ref_num?: string;
    //
    public purpose?: string;
    //
    public date?: string;
    //
    //construct the class
    constructor(public amount: string ){}
    //
    //Get the business related to the message.
    get_business_id(): string {
        //
        //Get the business from the currently logged in user.
        return this.mother.user!.business!.source;
    }
    //
    //Get the journal entries to record the transaction.
    get_je(): {
        ref_num: string; purpose: string; date: string; amount: number;
    } {
        //
        //1. Get the reference number of the transaction.
        //Generate one using the event name and the date.
        this.ref_num = this.get_ref_num();
        //
        //2. Get the purpose of the transaction.
        this.purpose = this.get_message_subject();
        //
        //3. Get the date of the transaction.
        this.date = this.get_date();
        //
        //4. Get the amount in the transaction.
        this.amount = this.get_amount();
        //
        //Return the values of the collection above.
        return {ref_num:this.ref_num , purpose:this.purpose, date:this.date, amount:parseFloat(this.amount) }
    }
    //
    //Generate a reference number for the event contribution.
    get_ref_num(): string {
        //
        //Get the event name.
        //
        //Get the date.
        //
        //Use the above two two create a reference number.
        throw new Error('Method not implemented.');
    }
    //
    //Get the subject of the message.
    get_message_subject(): string {
        //
        throw new Error('Method not implemented.');
    }
    //
    //Get the date from the reply message
    get_date(): string {
        //
        //Get the current date
        const date = (new Date()).toDateString();
        //
        return date;
    }
    //
    //Get the amount from the reply message
    get_amount(): string {
        throw new Error('Method not implemented.');
    }
    //
    //Get the account to debit the transaction.
    //Hint: The acccount of the person that the amount is being sent from
    get_debit(): string {
        //
        //Get the account to debit the amount.
        throw new Error('Method not implemented.');
    }
    //
    //Get the account to credit the transaction.
    get_credit(): string {
        //
        //Get the account to debit the amount
        throw new Error('Method not implemented.');
    }
}