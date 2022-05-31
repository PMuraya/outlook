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
import * as mod from '../../../outlook/v/code/module.js';
//
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
    //Returns all the inbuilt products that are specific to
    //this application
    get_products_specific(): Array<outlook.assets.uproduct> {
        return [
            {
                title: "Data management",
                id: 'actions',
                solutions: [
                    //
                    {
                        title: "Enter stock",
                        id: "stock",
                        listener: ["event", async () => await this.stock()],
                    },
                    {
                        title: "Enter flow",
                        id: "flow",
                        listener: ["event", () => this.flow()],
                    }
                ]
            }
        ];
    }
    async stock(): Promise<void> {
        //
        const Stock = new record_stock(this);
        //
        const result: true | undefined = await Stock.administer();
        //
        if (result === undefined) return;
        //
        //Update the application page to feedback the user.
    }
    //
    async flow(): Promise<void> {
        //
        const Flow = new record_flow(this);
        //
        const result: true | undefined = await Flow.administer();
        //
        if (result === undefined) return;
    }
}
//
//Collect the stock and all the data related to the:-
//-the operator
//-the business associated with.
class record_stock
    extends mod.terminal
    implements mod.questionnaire {
    //
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    public reg_no!: string;
    //
    public daytime!: string;
    //
    public category!: string;
    //
    public datetime!: string;
    //
    public operator!: string;
    //
    public business!: string;
    //
    //construct the stock class.
    constructor(app: main) {
        //pass on a url to the class.
        super(app, "stock.html")
    }
    //
    //Collect the following label layouts:-
    //1. Car registration details directly from the form.
    //2. Business and user details indirectly from the login credentials .
    get_layouts(): Array<quest.layout> {
        //
        //0. Start with an empty collection.
        const c: Array<quest.label> = [];
        //
        //1. Add the Car registration number to the collection.
        c.push(["mutall_ranix", "vehicle", [], "reg_no", this.reg_no]);
        //
        //2. Add the Time of the day.
        c.push(["mutall_ranix", "stock", [], "daytime", this.daytime]);
        //
        //3. Add the type of vehicle.
        c.push(["mutall_ranix", "vehicle", [], "category", this.category]);
        //
        //4. Add the current datetime
        c.push(["mutall_ranix", "stock", [], "datetime", this.datetime]);
        //
        //5. Add the the business associated with this stock this
        //depends on who is logged in.
        //
        //6. Return the collection.
        return c;
    }
    //
    //Implement a baby's abstract method to verify that indeed the user has
    //has filled in the required input fields.
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check  Car registration number.
        this.reg_no = this.get_input_value("reg_no");
        if (this.reg_no === "") this.report_element!.textContent = "Please provide a registration number";
        //
        //1.2 Collect and check Time of the day.
        this.daytime = this.get_checked_value("daytime");
        if (this.reg_no === "") this.report_element!.textContent = "Please select the daytime";
        //
        //1.3 Collect and check  type of vehicle.
        this.category = this.get_checked_value("category");
        if (this.category === "") this.report_element!.textContent = "Please select a category";
        //
        //1.4 Collect and check current datetime.
        this.datetime = this.get_input_value("datetime");        
        if (this.datetime === "") this.report_element!.textContent = "Should be current time";
        //
        //1.5 Collect and check the operator data.
        this.operator = this.get_operator();
        //
        //1.6 Collect and check the business info.
        this.business = await this.get_business();
        //
        //2. Save the data to the database.
        const success: boolean = await this.mother.writer.save(this);
        //
        return success;
    }
    //
    //Get the operator from the user who is logged in.
    get_operator(): string {
        //
        //Get the operator from the currently logged in user.
        const operater:string | null = this.win.localStorage.getItem("user");
        //
        //If no user is found.
        if (operater === null) throw new schema.mutall_error("There is no user found");
        //
        //Destructure
        const {email}=  JSON.parse(operater);
        //
        //Return the user.
        return email;
    }
    //
    //Get the business related with the flow,
    //from the user logged in
    async get_business(): Promise<string> {
        //
        //Use the current logged in user to get the business associated.
        //
        const user: string = this.get_operator();
        console.log(user);
        //
        //Structure the sql.
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
        console.log(ope[0].name);
        return ope[0].name;
    }
    //
    async show_panels(): Promise<void> {
        //
        //1. Show the current time
        const input = <HTMLInputElement>this.get_element('datetime');
        input.value = (new Date()).toDateString();
        //
        //2.Show the operator.
        //
        //Get the operater input field.
        const field = this.get_element("email");
        //
        //Ensure the field is a HTMLInputElement.
        if (!(field instanceof HTMLInputElement)) throw new schema.mutall_error("The field is not a HTMLInputElement");
        //
        //Assign the field the operator from the current logged in user.
        field.value = this.get_operator();
    }

}
//
//Collect the flow and all the data related to the:-
//-the operator
//-the business associated with.
class record_flow
    extends mod.terminal
    implements mod.questionnaire {
    //
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    public reg_no!: string;
    //
    //
    public direction!: string;
    //
    //
    public category!: string;
    //
    //
    public datetime!: string;
    //
    public operator!: string;
    //
    public business!: string;
    //
    //construct the flow class
    constructor(app: main) {
        super(app, "flow.html")
    }
    //
    //
    get_layouts(): Array<quest.layout> {
        //
        //0. Start with an empty collection.
        const s: Array<quest.label> = [];
        //
        //1. Add the Car registration number to the collection.
        s.push(["mutall_ranix", "vehicle", [], "reg_no", this.reg_no]);
        if (this.reg_no === "") this.report_element!.textContent = "Please provide a registration number";
        //
        //2. Add the Time of the day.
        s.push(["mutall_ranix", "flow", [], "direction", this.direction]);
        if (this.direction === "") this.report_element!.textContent = "Select the direction of the vehicle";
        //
        //3. Add the type of vehicle.
        s.push(["mutall_ranix", "vehicle", [], "category", this.category]);
        if (this.category === "") this.report_element!.textContent = "Select a category";        
        //
        //4. Add the current datetime
        s.push(["mutall_ranix", "flow", [], "datetime", this.datetime]);
        if (this.datetime === "") this.report_element!.textContent = "Should be current time";
        //
        //5. Add the the business associated with this stock this
        //depends on who is logged in.
        //
        //6. Return the collection.
        return s;
    }
    //
    //Collect the flow data, check it and save to the database.
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Colect and check the registration number
        this.reg_no = this.get_input_value("reg_no");
        //
        //1.2 Collect and check the category.
        this.category = this.get_checked_value("category");
        //
        //1.3 Collect and check the direction.
        this.direction = this.get_checked_value("direction");
        //
        //1.4 Collect and check the datetime.
        this.datetime = this.get_input_value("datetime");
                //
        //1.5 Collect and check the operator data.
        this.operator = this.get_operator();
        //
        //1.6 Collect and check the business info.
        this.business = await this.get_business();

        //
        //2. Save the data to the database.
        const ans = this.mother.writer.save(this);
        //
        return ans;
    }
    //
    //Get the operator from the user who is logged in.
    get_operator(): string {
        //
        //Get the operator from the currently logged in user.
        const operater = this.win.localStorage.getItem("user");
        //
        //If no user is found.
        if (operater === null) throw new schema.mutall_error("There is no user found");
        //
        //Destructure
        const {email}=  JSON.parse(operater);
        //
        //Return the user.
        return email;
    }
    //
    //Get the business related with the flow,
    //from the user logged in
    async get_business(): Promise<string> {
        //
        //Use the current logged in user to get the business associated.
        //
        const user = this.get_operator();
        //Structure the sql.
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
    //Show the time and operator of the flow.
    async show_panels(): Promise<void> {
        //
        //1. Show the current time
        const input = <HTMLInputElement>this.get_element('datetime');
        input.value = (new Date()).toDateString();
        //
        //2.Show the operator.
        //
        //Get the operater input field.
        const field = this.get_element("email");
        //
        //Ensure the field is a HTMLInputElement.
        if (!(field instanceof HTMLInputElement)) throw new schema.mutall_error("The field is not a HTMLInputElement");
        //
        //Assign the field the operator from the current logged in user.
        field.value = this.get_operator();
    }
}