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
    extends outlook.baby<true>
    implements mod.message, mod.questionnaire, mod.journal, mod.cron_job
 {
    //
    declare public mother:main;
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
<<<<<<< Updated upstream
    get_layout(): layout[] {
=======
    get_layouts(): layout[] {
>>>>>>> Stashed changes
        throw new Error('Method not implemented.');
    }
    get_business_id(): string {
        throw new Error('Method not implemented.');
    }
    get_je(): { ref_num: string; purpose: string; date: string; amount: number; } {
        throw new Error('Method not implemented.');
    }
    get_debit(): string {
        throw new Error('Method not implemented.');
    }
    get_credit(): string {
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
        const save = await this.mother.writer.save(this);
        //
        //3. Send the appropriate message to the user(s).
        const send = await this.mother.messenger.send(this);
        //
        //4. Update the journal entry(je) 
        const post = await this.mother.accountant.post(this);
        //
        //5. Schedule tasks if available.
        const exec = await this.mother.scheduler.exec(this);
        //
        return true;
    }
    //
    //Collect the message and media of communication specified by the user.
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
        
    }
}