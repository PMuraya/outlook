//Import app from the outlook library.
//
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Resolve the modules.
import * as mod from '../../../outlook/v/code/module.js';
//
//Resolve main class.
import main from './main.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
export class tea_delivery 
    extends outlook.terminal
    implements mod.journal 
{
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother:main;
    //
    //Reference number
    public ref_num?:string;
    //
    //Merchant name.
    public merchant?:string;
    //
    //The purpose.
    public purpose?:string;
    //
    //Date of transaction.
    public date?:string;
    //
    //The amount paid.
    public amount?:number;
    //
    //Create a new instance of tea_delivery class.
    constructor(mother: main){
        //
        //Call the constructor of the parent class with the mother page and file name. 
      super(mother, 'tea_delivery.html')
    }
    //
    //
    get_business_id(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //Collect all the required details to post the details into the journal.
    get_je(): {
        ref_num: string; 
        purpose: string; 
        date: string;
        amount: number;
    } {
        //
        //. Return the values.
        return { 
                ref_num:this.ref_num!, 
                purpose: this.purpose!,
                date: this.date!,
                amount: this.amount!,
        }
    }
    //
    //The account to debit the transactiom.
    get_debit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //The account the transaction.
    get_credit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //check if a file json file containing Iquestionnaire is selected.
    //For now, do nothing
    async check():Promise<boolean> {
        //
        //1.Collect and check all the fields provided.
        //
        //1.1 Get the reference number.
        this.ref_num = this.get_input_value('ref_num')
        //
        //1.2 Get the purpose of the transaction.
        this.purpose = this.get_input_value('purpose');
        //
        //1.3 Get the date.
        this.date = this.get_input_value('date');
        //
        //1.4 Get the amount payed.
        this.amount = parseFloat(this.get_input_value('amount'));
        //
        //2. Post to the accounts module.
        const post: boolean = await this.mother.accountant.post(this);
        //
        //At this point if an error occurs during posting, its handled at the module level
        //See the implmentation in the module class.
        return post;
    }
    //
    //Collect data to show whether we should update the home page or not.
    async get_result(): Promise<true> { return true;}
    //
    //Add an event listener to the ok button.
    async show_panels() {
      //
      //1.Populate the merchants selector.
      this.fill_selector("account","mutall_users","merchant");      
      //
      //2. Set the date to the current date and time.
      const date =<HTMLInputElement> this.get_element('date');
      date.valueAsDate = new Date();
      //
      //
    }
}
//
//Tea payment 
export class pay_tea extends outlook.popup<void>{
    //
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