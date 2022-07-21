//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js'; 
//
//Resolve the modules.
import * as mod from '../../../outlook/v/code/module.js';
//
//import main class.
import main from './main.js';
//
//Import app class from outlook library.
import * as outlook from '../../../outlook/v/code/outlook.js';
import * as schema from '../../../schema/v/code/schema.js';
//
//Create an instance of class create_event.
export class event_planner 
    extends outlook.terminal
    implements  mod.questionnaire, mod.message, mod.cron_job, mod.journal 
{
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother: main;
    //
    //The name of the event.
    public event_name?: string;
    //
    //The description of the event.
    public description?: string;
    //
    //The start of the event.
    public start_date?: string;
    //
    //The end of the event.
    public end_date?: string;
    //
    //The contribution
    public contributory?: string;
    //
    //If the contribution is mandatory.
    public mandatory?: string;
    //
    //The amount contributed.
    public amount?: number;
    //
    //reference of transaction.
    public ref_num?:string;
    //
    //Purppose of transaction.
    public purpose?:string;
    //
    //The database.
    public dbname = "mutall_users";
    //
    //Create an instance of class create_event.
    constructor(mother: main) {
        //
        super(mother, 'Event_form.html')
    }
    //
    //Get the sender of the message.
    get_sender(): string {
        throw new Error('Method not implemented.');
    }
    //
    //Get the body of the message.
    get_body(): string {
        throw new Error('Method not implemented.');
    }
    //
    //Get the business id of the user who is currently logged in.
    get_business_id(): string {
        throw new schema.mutall_error('nothing')
    }
    //
    //Get the journal entry data for double entry.
    get_je(): {
        ref_num: string; purpose: string; date: string; amount: number; 
    } {
        //
        //1.Collect all the field provided.
        
        this.ref_num = this.get_ref_num();
        //
        //1.2 Get the purpose of the transaction.
        this.purpose = this.event_name!;
        //
        //1.3 Get the date.
        const date = this.start_date!;
        //
        //1.4 Get the amount payed.
        const amount = this.amount!;
        //
        //2. Return the values.
        return  {ref_num:this.ref_num, purpose:this.purpose, date: date, amount: amount};
        
    }
    //
    //Generate the reference number from the event name and the datetime.
    get_ref_num(): string {
        //
        //Get the event name.
        const name = this.event_name!;
        //
        //Get the datetime.
        const date = new Date();
        //
        //Combine the two.
        const ref = `${name}` + `${date}`;
        //
        //return the reference.
        return ref;
    }
    //
    //Get the account to be debited.
    get_debit(): string {
        throw new Error("Method not implemented.");
    }
    //
    //Get the account to be credited.
    get_credit(): string {
        throw new Error("Method not implemented.");
    }
    //
    //For error reporting.
    report_error(): void {
        throw new Error('Method not implemented.');
    }
    //
    // Implement the scheduler for scheduling tasks.
    exec(crj: mod.cron_job): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    //
    //Collect as many labels as there are in the form.
    get_layouts(): Array<quest.layout> {
        //
        //Return the event data.
        return Array.from(this.get_event_data());
    }
    *get_event_data(): Generator<quest.layout> {
        //
        //Get the event name.
        yield [this.dbname, "event", [], "id", this.event_name!];
        //
        //Get the description.
        yield [this.dbname, "event", [], "name", this.description!];
        //
        //Get the start date and
        yield [this.dbname, "event", [], "start_date", this.start_date!];
        //
        //The end date.
        yield [this.dbname, "event", [], "end_date", this.end_date!];
        //
        //Get the contributory.
        yield [this.dbname, "event", [], "contributory", this.contributory!];
        //
        //get the mandatory only if its contributory.
        if (this.contributory === 'yes') {
            //
            //Get the mandatory.
            yield [this.dbname, "event", [], "mandatory", this.mandatory!];
            //
            //Get the amount only if the mandatory value is yes
            if(this.mandatory === 'yes') {
                //
                //Get the amount
                yield [this.dbname, "event", [], "amount", this.amount!];
            } 
        }
    }
    //
    //Collect and check the data that the user has entered.
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //Collect the event name.
        this.event_name = this.get_input_value('name');
        //
        //Collect the description.
        this.description = this.get_input_value('description');
        //
        //Collect the start date and 
        this.start_date = this.get_input_value('start_date');
        //
        //Collect end date.
        this.end_date = this.get_input_value('end_date');
        //
        //Collect the contributory.
        this.contributory = this.get_checked_value('contributory');
        //
        //Collect the mandatory only if the contribution value is yes.
        if (this.contributory === 'yes') {
            //
            //Collect the mandatory.
            this.mandatory  = this.get_checked_value('mandatory');
            //
            //Collect the amount only if the mandatory value is yes
            if(this.mandatory === 'yes') {
                //
                //Collect the amount
                this.amount = parseFloat(this.get_input_value('amount'));
            } 
        }
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
        //6. Return the result.
        return save && send && post && exec;
    }
    //
    //Get the result and return true if successful.
    async get_result(): Promise<true> { return true;}
    //
    //Add additional data to the page after it has loaded. If necessary.
    async show_panels(): Promise<void> {
        //
    }
}
