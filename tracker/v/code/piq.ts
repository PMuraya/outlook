//
//Resolves reference to the asset.products data type
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import schema from the schema library.
import * as schema from '../../../schema/v/code/schema.js';
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
//Resolve the modules.
import * as mod from '../../../outlook/v/code/module.js';
//
//Import server from the schema library.
import * as server from '../../../schema/v/code/server.js';
//
//import main from tracker
import main from './main.js';
//
//import basic value from schema library.
import { basic_value } from '../../../schema/v/code/library.js';
//
export type Ipiq = {piq: string};
//
//Completing level 2  registration of the user.
export class register_intern
    extends outlook.terminal
    implements mod.questionnaire, mod.message, mod.journal {
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother: main;
    //
    //Create a new class instance
    constructor(mother: main) {
        //
        //Call the super class constructor with the mother page and the file name.
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
    //- ??? 
    get_result(): Promise<true> {
        throw new Error('Method not implemented.');
    }
    //
    //This is the business that an intern is registering to.
    get_business_id(): string {
        //
        //Use the current logged in user to get the business associated.
        return this.mother.user!.business!.source;
        
    }
    //
    //Get the user currently logged in.
    get_user(): string {
        //
        //Get the user from the  logged session.
        const user_name: outlook.user| undefined = this.mother.user;
        //
        //Ensure that the user logged in has a name.
        if(user_name === undefined) throw new schema.mutall_error(`No user found`);
        //
        //Return the user.
        return user_name.name!;
    }
    //
    //Get the business name from the database.
    async get_business(user: any) {
        //
        //Formulate the query.
        const sql = `
        select 
            business.name
        from 
            member
            inner join business on member.business = business.business 
            inner join user on member.user = user.user
        where
            user.name = '${user}'
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
        //Return the business name.
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
        //
        //1.1 Get the reference number.
        //
        //1.2 Get the purpose of the transaction.
        //
        //1.3 Get the date.
        //
        //1.4 Get the amount payed.
        //
        //2. Return the values.
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
        const inputs: Generator<quest.layout> = this.get_label_layouts();
        //
        //2.Retrieve all table based layout from the registration form.
        const tables: Array<quest.layout> = this.get_table_layouts();
        //
        //Return both the inputs and tables.
        return [...inputs, ...tables];
    }
    //
    //Retrieves all the label based layouts from the registration form.
    //That are outside of any table. Use the following CSS :-
    //:where(input[type="date"],input[type="text"], input[type="radio"]:checked, select)
    //:not(table *)
    //The input[type="checked"] needs to be treated differently.
    *get_label_layouts(): Generator<quest.layout> {
        //
        //Collect labels for the first group that excludes checkboxes.
        yield * this.get_inputs_without_checkboxes();
        //
        //Collect labels for the checkboxes.
        yield * this.get_checkbox_layouts();
    }
    //
    //Collect labels for the first group that excludes checkboxes.
    *get_inputs_without_checkboxes(): Generator<quest.layout> {
        //
        //1. Define the css required for the inputs.
        const css: string = `:where(
            input[type="text"], 
            input[type="number"],
            input[type="date"], 
            input[type="radio"]:checked,
            input[type="checkbox"]:checked
        )
        :not(table *)`;
        //
        //2. Retrieve the inputs and convert them to an array.
        const inputs: Array<HTMLInputElement> = Array.from(document.querySelectorAll(css));
        //
        //3. Loop through all the inputs and yield a label for each of them.
        for(let input of inputs){
            //
            //3.1. Set the alias to take care of multiple values in checkboxes
            const alias = input.type === "checkbox" ? [input.value]:[];
            //
            //3.2. Construct the label of the elements
            //NB: a label is a tuple comprising of 5 elements,
            //viz, dbname, ename, [], cname, basic_value. The basic_value comes from the input.
            const label: quest.label = [
                //
                //The database name
                input.dataset.dbname!,
                //
                //The entity name
                input.dataset.ename!,
                //
                //The alias
                alias,
                //
                //The column name
                input.name,
                //
                //The value of the input
                input.value
            ];
            //
            //Yield this label if the value is not empty
            if(input.value!== "")yield label;
        }
    }
    //
    //Collect labels for the checkboxes.
    *get_checkbox_layouts(): Generator<quest.layout> {
        //
        //Define the css required for the inputs.
        //
        //Retrieve the inputs and convert them to an array.
        //
        //Loop through all the inputs and yield a label for each of them.
        //NB: a label is a tuple comprising of 5 elements,
        //viz, dbname, ename, [], cname, basic_value. The basic_value comes from the input.
        //For checkboxes, the alias needs to be indexed.
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
        const body: Array<Array<basic_value>> = this.get_body_values(element);
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
            //Return the name.
            return name;
        });
        //
        //Return the column.
        return names;
    }
    //
    //Compile the body rows and columns
    get_body_values(element: HTMLTableElement):Array<Array<basic_value>> {
        //
        //1. Get the input values of the table fields.
        //
        //Get the table body element.
        const tbody: HTMLTableSectionElement | null = element.querySelector("tbody");
        //
        //If the tbody is null, throw a new exception.
        if(tbody === null) throw new schema.mutall_error(`Table is empty`);
        //
        //Get the table rows.And 
        const row_list: NodeListOf<HTMLTableRowElement> = tbody!.querySelectorAll("tr");
        //
        //convert the nodelist to an array
        const rows:Array<HTMLTableRowElement> = Array.from(row_list);
        // 
        //2. Get the td's of all the rows and map them to the input value
        const values: Array<Array<basic_value>>  = rows.map( row =>
             {
                //Get the inputs in the row.
                const inputs: Array<HTMLInputElement> = Array.from(row.querySelectorAll("input"));
                //
                //Map every value to a td.(use a yield method)
                const td_values: Array<basic_value> = inputs.map(cell =>
                    {
                      return (this.get_cell_value(cell));
                    });
                //
                //Return the array of string of td.
                return td_values;
            }
        );
        //
        //Return the body value.
        return values;
    }
    *get_cell_value(cell: HTMLInputElement): any {
            //
            //Get the value of the td. As an array
            const td_val: basic_value = this.convert_to_basic(cell.value);
            //
            //Return the td.
           yield td_val;
        
    }
    
    //
    //Check the basic value to get the data types of the values collected.
    //-empty | undefined return null
    //number return number use"parseFloat"
    //otherwise return a string.
    convert_to_basic(value: string): basic_value {
        //
        //Convert empty | undefined to return null
        if (value === "" || value ===  undefined) return null;
        //
        //Convert value to return a number
        if(parseFloat(value) !== NaN) return parseFloat(value);
        //
        //Convert value to boolean.
        if (value === "true") return true; else if (value === "false") return false;
        //
        //Otherwise return a string.
        return value;
    }
    //
    //check the entered data and if correct return true else return false.
    //And prevents one from leaving the page.
    async check(): Promise<boolean> {
        //
        //0.Clear all the previous checks. Collect all error and warnings and clear.
        //
        //1. Collect and check all the data entered by the user.
        //
        //1.1 Get all the simple inputs and check.
        const inputs = this.check_simple_inputs();
        //
        //1.2 Get all the tables in the form.
        const tables = this.check_table();
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
        //Return true.
        return save && post && send;
    }
    check_table():boolean {
         //
        //1 Define the css required  for retrieving the inputs
        const css: string = `
            :where(input[type="text"], 
                input[type="date"], 
                input[type="radio"]:checked, 
                input[type="checkbox"]:checked
            :checked):not(table *)`;
        //
        //2. Retrieve the inputs and convert then to an array
        const inputs: Array<HTMLInputElement> = Array.from(document.querySelectorAll(css));
        //
        //3.Loop through all the inputs and yield a label for each of them
        for(let input of inputs){
            //
            //Check for the dbname
            if (input.dataset.dbname === undefined)
                throw new schema.mutall_error(`Database name for ${input} is missing`);
            //
            //Check for the ename
            if (input.dataset.ename=== undefined)
                throw new schema.mutall_error(`Entity name for ${input} is missing`);
            //
            //Check for the column name
            if(input.name===undefined)
                throw new schema.mutall_error(`Column name for ${input} is missing`);
            //
            //Check if the input has a required property and highlight it as an error
            if (input.required&& input.value=== "")
                throw new schema.mutall_error(`The value for input ${input.name} is missing
                and it is required`);
            //
            //Check whether an input is not required and if it is not provided,
            //show a warning
            if (!(input.required) && input.value === "") input.classList.add(".warning");
            }
            return true;
    }
    //
    //Check the simple inputs
    check_simple_inputs():boolean{
        //
        //1 Define the css required  for retrieving the inputs
        const css: string = `
            :where(input[type="text"], 
                input[type="date"], 
                input[type="radio"]:checked, 
                input[type="checkbox"]:checked
            :checked):not(table *)`;
        //
        //2. Retrieve the inputs and convert then to an array
        const inputs: Array<HTMLInputElement> = Array.from(document.querySelectorAll(css));
        //
        //3.Loop through all the inputs and yield a label for each of them
        for(let input of inputs){
            //
            //Check for the dbname
            if (input.dataset.dbname === undefined)
                throw new schema.mutall_error(`Database name for ${input} is missing`);
            //
            //Check for the ename
            if (input.dataset.ename=== undefined)
                throw new schema.mutall_error(`Entity name for ${input} is missing`);
            //
            //Check for the column name
            if(input.name===undefined)
                throw new schema.mutall_error(`Column name for ${input} is missing`);
            //
            //Check if the input has a required property and highlight it as an error
            if (input.required&& input.value=== "")
                throw new schema.mutall_error(`The value for input ${input.name} is missing
                and it is required`);
            //
            //Check whether an input is not required and if it is not provided,
            //show a warning
            if (!(input.required) && input.value === "") input.classList.add(".warning");
            }
            return true;
    }
    
    // //
    // //Check the table input values and return true if the table data is correct
    // //or provided.
    // check_table(element: HTMLTableElement) {
    //     //
    //     //1.Get the table body element.
    //     const rows = element.querySelector('tbody');
    //     //
    //     //2. Get the table rows.
    //     const tr = rows!.querySelectorAll('tr');
    //     //
    //     //3. Get the input field and check for errors.
    //     const row = Array.from(tr).map(input =>{
    //         //
    //         //Get the input fields.
    //         const inputs = input.querySelectorAll('input');
    //         //
    //         //Check the value.
    //         const value = Array.from(inputs).map(valu => {
    //             //
    //             //check all the input values.
    //             const cell_input = valu.value;
    //             //
    //             if (cell_input === ""){
    //                 //
    //                 const error_msg = this.get_element("#error");
    //                 //
    //                 error_msg.innerText = `No value found for ${valu}`;
    //                 //
    //                 return error_msg.innerText;
    //             }
    //         });
    //         //
    //         return value;
    //     });
    //     //
    //     return row;
    //     //
    //     //4. Get the table rows.And for every input field in the row,
    //     //check the data entered and if correct  return true.
    //     //otherwise show an error message on hover. ???
    // }
    //
    //Add additional data after the page has loaded if necessary otherwise do nothing
    async show_panels(): Promise<void> {
        //
    }
    
}