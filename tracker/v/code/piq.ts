//
//
//Resolves reference to the asset.products data type
import * as outlook from '../../../outlook/v/code/outlook.js';
//
import * as schema from '../../../schema/v/code/schema.js';
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
import * as mod from '../../../outlook/v/code/module.js';
//
import * as server from '../../../schema/v/code/server.js';
//
//import main from tracker
import main from './main.js';
import { basic_value } from '../../../schema/v/code/library.js';
//
export type Ipiq = {piq: string};
//
// export interface Iregister {
//     true: boolean,
//     undefined: undefined
// }
//
//Completing level 2 registration
export class register_intern
    extends mod.terminal
    implements mod.questionnaire, mod.message, mod.journal {
    //
    declare public mother: main;
    //
    constructor(mother: main) {
        super(mother, "interns_reg-form.html")
    }
    //
    //The person who the message is being send to.
    get_sender(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //The message from the text area to send to a user
    get_body(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    get_result(): Promise<true> {
        throw new Error('Method not implemented.');
    }
    //
    //This is the business that an intern is registering to.
    get_business_id(): string {
        //
        //Use the current logged in user to get the business associated.
        //
        const user = this.get_user();
        //
        const business =  this.get_business(user);
        //
        //Return the business name.
        return business;
        
    }
    //
    //Get the user currently logged in.
    get_user() {
        //
        const user:string | null = this.win.localStorage.getItem("user");
        //
        //If no user is found.
        if (user === null) throw new schema.mutall_error("There is no user found");
        //
        //Destructure
        const {email }=  JSON.parse(user);
        //
        //Return the user.
        return email;
    }
    //
    //Get the business name from the database.
    async get_business(user: any) {
        //
        const sql = `
        select 
            business.name
        from 
            member
            inner join business on member.business = business.business 
            inner join user on member.user = user.user
        where
            user.email = '${user}'
         `;
        //
        //Get the data from the database.
        const ope: Array<{name: string;}> = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [sql]
        );
        //
        //Return the value 
        return ope[0].name;
    }
    //
    //This is to post the accountant journal where the fee is 0.
    get_je(): {
        //
        ref_num: string;
        //
        purpose: string;
        //
        date: string;
        //
        amount: number;
    } {
        //
        //1.Collect all the field provided.
        const j = [];
        //
        //1.1 Get the reference number.
        j.push([""])
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
    //
    //Allows one to debit an acccount without having to see whats being done.
    get_debit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //Allows one to debit an acccount without having to see whats being done.
    get_credit(): string {
        throw new schema.mutall_error('Method not implemented.');
    }
    //
    //Implement the method required by the questionnaire interface.
    //It returns all the layouts derived from the registration of an intern.
    get_layouts(): Array<quest.layout> {
        //
        //1.Retrieve all label layouts (from the registration form) that are outside a table.
        const inputs: Array<quest.layout> = this.get_label_layouts();
        //
        //2.Retrieve all table based layouts from the registration form.
        const tables: Array<quest.layout> = this.get_table_layouts();
        //
        //Return both the inputs and tables.
        return inputs.concat(tables);
    }
    //
    //Retrieves all the label based layouts from the registration form.
    get_label_layouts(): Array<quest.layout> {
        //
        //dummy for test purposes.
        const c: quest.layout[] = []
        //
        c.push(["mutall_users", "user", [], "email", "jane@gmail.com"]);
        c.push(["mutall_users", "user", [], "email", "jae@gmail.com"]);
        //
        return c;
    }
    //
    //Retrieve all table based layouts from the registration form.
    get_table_layouts(): Array<quest.layout> {
        //
        //1. Get all the table elements in the registration form.
        const elements = this.document.querySelectorAll("table");
        //
        //2. Convert the table elements to table layouts.
        const layouts: Array<quest.table> =
            //
            //Convert the node list of elements to a normal array
            Array.from(elements)
                //
                //Map every element to a table layout
                .map(element => this.get_table_layout(element));
        //
        //3. Return the result.
        return layouts;
    }
    //
    //Convert the given table element into a questionnaire table.
    //The structure of a questionnaire table is generally defined as:-
    // {class_name, args}
    //in particular its defined as:-
    //{class_name:"fuel", args: [tname, cnames, ifuel] }
    //where:-
    // tname is the name of the table,
    // cnames is an array of column names to be lookedup,
    // ifuel is a double array that represents the table body.
    get_table_layout(element: HTMLTableElement): quest.table {
        //
        //A. Define the table that is the source of the data.
        //1.Get the tables class name.
        const class_name = "fuel";
        //
        //2. Get the required arguments, i.e., tname, cnames, ifuel
        //
        //2.1 Get the table name. It is the id of the table element
        const tname = element.id;
        //
        //2.2 Get the column names of the table. They are will as many 
        //columns as there are th elements.
        const cnames: Array<string> = this.get_column_names(element);
        //
        //2.3 Get the body of the table as double list of string values.
        const body: Array<Array<basic_value>> = this.get_body_value(element);
        //
        //3. Compile the table layout.
        const table_layout: quest.table = {class_name, args: [tname, cnames, body]}
        //
        //4. Return the table layout.
        return table_layout;
    }
    //
    //get the column names.
    get_column_names(element: HTMLTableElement):Array<string> {
        //
        //Set the table name.
        const tname = element.id
        //
        //1. Get all the table columns as a collection of TableCellElement.
        const elements = element.querySelectorAll("th");
        //
        //Check the nodelist to ensure the table has columns.
        if (elements === null) throw new schema.mutall_error(`There are no columns in this table ${tname}`);
        //
        //Convert the collection to an array.
        const cells =Array.from(elements);
        //
        //Map the array of table cell elements to column names.
        const names = cells.map(cell => {
            //
            //Get the name from the cname datalist.
            const name= cell.dataset.cname;
            //
            //Check to ensure that all the tables have column names.
            if (name === undefined) throw new schema.mutall_error(`No name found for this column in table ${tname}`)
            //
            //Return the names.
            return name;
        });
        //
        //Return the column.
        return names;
    }
    //
    //Compile the body rows and columns
    get_body_value(element: HTMLTableElement):Array<Array<basic_value>> {
        //
        //1. Get the input values of the table fields.
        //
        //Get the table body element.
        const values: HTMLTableSectionElement | null = element.querySelector("tbody");
        //
        //Get the table rows.And 
        const row_name: NodeListOf<HTMLTableRowElement> = values!.querySelectorAll("tr");
        //
        //convert the nodelist to an array
        const rows:Array<HTMLTableRowElement> = Array.from(row_name);
        // 
        //2. Get the td's of all the rows and map them to the input value
        const data: Array<Array<basic_value>>  = rows.map( row =>
             {
                //Get the inputs in the row.
                const inputs: Array<HTMLInputElement> = Array.from(row.querySelectorAll("input"));
                //
                //Map every value to a td.
                const td_value: Array<basic_value> = inputs.map(cell =>
                    {
                        //Get the value of the td. As an array
                        const td_val: basic_value = this.convert_to_basic(cell.value);
                        //
                        //Return the td.
                        return td_val;
                    });
                    //
                    //Return the array of string of td.
                    return td_value;
            }
        );
        //
        //Return the body value.
        return data;
    }
    //
    //Check the basic value to get the data types of the values collected.
    //-empty | undefined return null
    //number return number use"parseFloat"
    //otherwise return a string.
    convert_to_basic(value: string): basic_value {
        //
        //
    }
    //
    //check the entered data and if correct return true else return false.
    //And prevents one from leaving the page.
    async check(): Promise<boolean> {
        //
        //1. Collect and check all the data entered by the user.
        //
        //1.1 collect all the simple labels into an array.
        //
        //1.2 collect all the tables
        //
        //2. Write the data to the database.
        const save = await this.mother.writer.save(this);
        //
        // Registration has charges whis is equal to 0.
        const post = await this.mother.accountant.post(this);
        //
        // send a message to the user.
        const send = await this.mother.messenger.send(this);
        //
        return save && post && send;
    }
    //
    //Do nothing
    async show_panels(): Promise<void> {
        //
    }
    
}