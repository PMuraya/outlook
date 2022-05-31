//
//Resolves references to the asset.products data type.
import * as mod from '../../../outlook/v/code/module.js';
import * as outlook from '../../../outlook/v/code/outlook.js';
import { layout } from '../../../schema/v/code/questionnaire.js';
//
//Import schema.
import * as schema from "../../../schema/v/code/schema.js";
//
import main from './main.js';
//
export type Imsg = {msg:string};
//
//use popup to create a new message
export class new_msg 
    extends mod.terminal
    implements mod.message, mod.questionnaire, mod.journal, mod.cron_job
 {
    //
    declare public mother:main;
    //
    //The database to save to 
    public dbname = "mutall_users";
    //
    public language!:string;
    //
    public message!:string;
    //
    public event!:string;
    //
    public amount!:string;
    //
    public date!:string;
    //
    public ref_num!:string;
    //
    constructor(mother: main) {
        super(mother, "new_msg.html");
    }
    //
    get_sender(): string {
        throw new Error('Method not implemented.');
    }
    get_body(): string {
        throw new Error('Method not implemented.');
    }
    
    get_business_id(): string {
        throw new Error('Method not implemented.');
    }
    get_je(): { ref_num: string; purpose: string; date: string; amount: number; } {
        //
        //Accounting submodal entity for journal recordings.
        const ename = "je";
        //
        //1.Collect all the field provided.
        const j = [];
        //
        //1.1 Get the reference number.
        j.push([this.dbname, ename, [], "ref_num", this.ref_num])
        //
        //1.2 Get the purpose of the transaction.
        j.push([this.dbname, ename, [], "purpose", this.event]);
        //
        //1.3 Get the date.
        j.push([this.dbname, ename, [], "date", this.date]);
        //
        //1.4 Get the amount payed.
        j.push([this.dbname, ename, [], "amount", this.amount]);
        //
        //2.
        //
        //. Return the values.
        return j;
    }
    get_debit(): string {
        throw new Error('Method not implemented.');
    }
    get_credit(): string {
        throw new Error('Method not implemented.');
    }
    get_layouts(): Array<layout> {
        //
        //1. Start with an empty array
        const m:Array<layout> = [ ];
        //2. Get the language.
        m.push([ this.dbname, "msg", [], "language", this.language ]);
        //
        //3. Get the message.
        m.push([this.dbname, "msg", [], "text", this.message]);
        //
        //4. Get the event.
        m.push([this.dbname, "event", [], "id", this.event]);
        //
        //5. Return the messages.
        return m;
    }
    //
    //In future, check if a file json containing iquestionare is selected??
    //
    //Collect and check the data entered by the user sending the message.
   async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect the language??
        this.language = this.get_input_value('languages');
        //
        //Find a more friendly way to tell the user to select.
        //Check that the language is selected.
        if (this.language === null) throw new schema.mutall_error(`Select a language`);
        //
        //1.2 Collect the message
        this.message = this.get_input_value("msg");
        //
        //Check the message
        if (this.message === null) throw new schema.mutall_error(`Enter a message`);
        //
        //1.3 Collect the selected event.
        this.event = this.get_input_value("event_assoc");
        //
        //Get the ref num by combining the event and date.
        this.ref_num = this.get_ref_num();
        //
        //Check the event.
        if (this.event === null) throw new schema.mutall_error(`Select an event`);
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        //3. Send the appropriate message to the user(s).
        const send = await this.mother.messenger.send(this);
        //
        //Execute this only if there is any event and contribution.
            //
            //4. Update the journal entry(je) 
            const post = await this.mother.accountant.post(this);
            //
            //5. Schedule tasks if available.
            const exec = await this.mother.scheduler.exec(this);
        //
        return save && send && post && exec;
    }
    //
    //Get the reference number by generating from existing data about the message
    //i.e using the event and the date
    //Ask (pm)
    get_ref_num(): string {
        throw new Error('Method not implemented.');
    }
    //
    //
    async show_panels(): Promise<void> {
        //
        //Fill the language selector.
        this.fill_selector("msg","mutall_users", "languages");
        
    }
 }