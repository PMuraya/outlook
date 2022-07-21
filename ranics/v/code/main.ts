//
//Imort the outlook service.
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import app from the outlook library.
import * as app from "../../../outlook/v/code/app.js";
//
//Import server from the outlook library.
import * as server from '../../../schema/v/code/server.js';
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
            },
            {
                title: "Vehicle Analysis",
                id: 'analyses',
                solutions: [
                    //
                    {
                        title: "View vehicle duration",
                        id: "vehicle_duration",
                        listener: ["event", async () => await this.vehicle_duration()],
                    }
                ]
            }
        ];
    }
    //
    //Display the rate of total erroneous records collected within a day
    async daily_error_rate():Promise<void>{
        //
        //Construct the query to retrieve the erronoeous records
        const sql:string=`
            #
            #
            with
                #
                #Split the datetime to date and time as the base of our queries
                flow as (
                    select
                            flow,
                        upper(vehicle .reg_no) as reg,
                        cast(flow.datetime as date) as siku,
                        cast(flow.datetime as time) as saa,
                        flow.direction as dir,
                        operator.name as operator
                    from flow
                            inner join vehicle on flow.vehicle= vehicle.vehicle
                            inner join operator on flow.operator =operator.operator
                    order by reg,siku,saa
                ),
                #
                #Show the lead direction and time
                leads as(
                    select
                            reg,
                            siku,
                            dir as dir1,
                            saa as saa1,
                            lead(dir) over(PARTITION BY reg,siku)as dir2,
                            lead(saa) over(PARTITION BY reg,siku)as saa2,
                            operator
                    from flow	
                ),
                #
                #Isolate cases with Incoming and outgoing errors
                ioerr as(
                    select
                            *
                    from leads
                    where dir1=dir2
                ),
                #
                #Find the errors per day
                dailyerr as(
                    select 
                            siku,
                            count(reg)as err
                    from ioerr
                    group by siku
                ),
                #
                #Get all the flows per day
                dailyflow as(
                    select
                            siku,
                            count(reg) as total		
                    from leads
                    group by siku
                ),
                #
                #Find out the error rate per day
                performance as(
                    select
                            dailyflow.siku,
                            dailyflow.total,
                            dailyerr.err,
                            format((err/total)*100,1)as 'rate'
                    from dailyflow
                            left join dailyerr on dailyflow.siku= dailyerr.siku
                    order by siku desc
                ),
                #
                #Find out the duration of each visit of each car
                car_dur as(
                    select
                        reg,
                        siku,
                        saa1,
                        dir1,
                        saa2,
                        dir2,
                        timestampdiff(minute, saa1,saa2) as duration
                    from leads
                    where dir1 !=dir2
                ) 
            #
            select * from performance order by siku desc limit 0,2
        `;
        //
        //2.0 Run the query to retrieve the error rate input from the database
        const rate:Array<{siku:string, total:string, err:string, rate:string}>=
            await server.exec("database",["mutall_ranix"],"get_sql_data",[sql]);
        //
        //3.0 Get the error table at the header section.
        const section = this.get_element("rate");
        //
        //3.1. Create the table
        const table= <HTMLTableElement>this.create_element(section,"table",{});
        //
        //3.2 Create the table's header
        const thead= this.create_element(table,"thead",{});
        //
        //3.3. The table's body
        const body= this.create_element(table,"tbody",{});
        //
        //3.3. Create the th(table's head)
        const th_r= this.create_element(thead,"tr",{});
        //
        //3.4 Create the table header rows.
        const head_data= rate[0];
        //
        //3.5 Retrieve the header objects
        const thead_row= Object.keys(head_data!);
        //
        //3.6 Add the headers to the table
        this.create_element(th_r,"th",{textContent:thead_row[0]});
        this.create_element(th_r,"th",{textContent:thead_row[1]});
        this.create_element(th_r,"th",{textContent:thead_row[2]});
        this.create_element(th_r,"th",{textContent:thead_row[3]+"(%)"});
        //
        //3.7 Create the rows to the files
        rate.forEach(row=>{
            //
            //Destructure the row to obtain the row data
            const {siku, total,err,rate}= row;
            //
            //Create a table row inside the body
            const tr= this.create_element(body,"tr",{});
            //
            //Insert the table data inside the table
            this.create_element(tr,"td",{textContent:siku});
            this.create_element(tr,"td",{textContent:total});
            this.create_element(tr,"td",{textContent:err});
            this.create_element(tr,"td",{textContent:rate});
        });
        
    }
    //
    //Visualize the vehicle duration within the carpark
    async vehicle_duration(){
        //
        //Get the vehicle duration class
        const Dur = new vehicle_duration(this,"duration.html");
        //
        //Administer the results
        Dur.administer();
    }
    //
    //Create a new class instance of a record stock
    async stock(): Promise<void> {
        //
        //Create a new class instance of a record stock.
        const Stock = new record_stock(this,"stock.html");
        //
        //Administer the new class and return the result
        const result: true | undefined = await Stock.administer();
        //
        //Check the result and if undefined do not leave the page.
        if (result === undefined) return;
        //
        //Update the application page to feedback the user.
    }
    //
    //Create a new class instance of record flow
    async flow(): Promise<void> {
        //
        //Create a new class instance of record flow.
        const Flow = new record_flow(this, "flow.html");
        //
        //Administer the new class and return the result
        const result: true | undefined = await Flow.administer();
        //
        //Check the result and if undefined do not leave the page.
        if (result === undefined) return;
        //
        //Update the application page to feedback the user.
    }
}
//
//Collect the stock and all the data related to the:-
//-the operator
//-the business associated with.
class record_stock
    extends outlook.terminal
    implements mod.questionnaire {
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    //
    //The registration number.
    public reg_no?: string;
    //
    //The day time is the current time.
    public daytime?: string;
    //
    //The type of vehicle.
    public category?: string;
    //
    //The date of the stock.
    public datetime?: string;
    //
    //The person collecting the stock.
    public operator?: string;
    //
    //The business associated with this stock.
    public business?: string;
    //
    //The email of the operator.
    public operator_email?:string;
    //
    //Construct the stock class.
    constructor(
        // 
        //This popup parent page.
        mother: outlook.page,
        //
        //The html file to use
        filename: string
    ) {
        //pass on a url to the class.
        super(mother, filename);
    }
    //
    //Collect the following label layouts:-
    //1. Car registration details directly from the form.
    //2. Business and user details indirectly from the login credentials .
    get_layouts(): Array<quest.layout> {
        //
        //6. Return the collection.
        return Array.from(this.collect_stock_layouts());
    }
    //
    //Collect all labels related to this stock
    *collect_stock_layouts(): Generator<quest.layout> {
        //
        //Database to save to
        const dbname = "mutall_ranix";
        //
        //Add the operator, depends on who is logged in.
        yield[dbname, "operator", [], "name", this.operator!];
        //
        //Add the operator email
        yield[dbname, "operator", [], "email",this.operator_email!];
        //
        //Add the operator to mutall_users database.
        yield["mutall_users", "user", [], "name", this.operator!];
        //
        //1. Add the Car registration number to the collection.
        yield[dbname, "vehicle", [], "reg_no", this.reg_no!];
        //
        //2. Add the Time of the day.
        yield[dbname, "stock", [], "session", this.daytime!];
        //
        //3. Add the type of vehicle.
        yield[dbname, "vehicle", [], "category", this.category!];
        //
        //4. Add the the business associated with this stock this in the
        //users database
        yield["mutall_users", "business", [], "id", this.business!];
        //
        //and in the carpark database organization.
        yield[dbname, "organization", [], "id", this.business!];
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
        //
        //1.2 Collect and check Time of the day.
        this.daytime = this.get_checked_value("daytime");
        //
        //1.3 Collect and check  type of vehicle.
        this.category = this.get_checked_value("category");
        //
        //1.5 Collect and check the operator data.
        this.operator = this.get_operator();
        //
        //1.6 Collect and check the business info.
        this.business = await this.get_business();
        //
        //Get the email related to the operator.
        this.operator_email = await this.get_operator_email();
        //
        //2. Save the data to the database.
        const success = await this.mother.writer.save(this);
        //
        //Get the report element and attach a message to show the user that
        //the record was saved successfully.
        const report = this.get_element('reports');
        //
        //Add the ans to the element if ans = true;
        if (success === true) (report.innerHTML = `The following vehicle ${this.reg_no} was saved successfully`) && this.clear_page(); 
        //
        //Return the final value.
        return false;
    }
    clear_page(): void{
        //
        //1 Get the reg_no and 
        const reg = this.get_element('reg_no');
        //
        //Set the value to empty.
        if(reg instanceof HTMLInputElement)  reg.value = "";
        //
        //2. Get the category and 
        const categry = this.get_element('category');
        //
        //Set the value to empty.
        if(categry instanceof HTMLInputElement) categry.checked = false;
        //
        //3. Get the direction and
        const direct = this.get_element('daytime');
        //
        //Set the value to empty.
        if(direct instanceof HTMLInputElement) direct.checked = false;
    }
    //
    //Get the operator from the user who is logged in.
    get_operator(): string {
        //
        //Get the operator from the currently logged in user.
        // const operater = this.win.localStorage.getItem("user");
        const operater = this.mother.user;
        //
        //Ensure that the operator is not empty.
        if (operater === undefined) throw new schema.mutall_error("There is no user found");
        //
        //Return the operator.
        return operater.name!;
    }
    //
    //Get the business related with the stock,
    //from the user logged in
    async get_business(): Promise<string> {
        //
        //Use the current logged in user to get the business associated.
        const user: string = this.get_operator();
        //
        //Structure the sql.
        const sql = `
            select 
                business.id
            from 
                member
                inner join business on member.business = business.business 
                inner join user on member.user = user.user
            where
                user.name = '${user}'
        `;
        //
        //Get the business data from the database.
        const business: Array<{id: string,name: string;}> = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [sql]
        );
        //
        //Return the value 
        return business[0].id;
    }
     //
    //Get the operator email as the email field in the database is mandatory.
    async get_operator_email(): Promise<string> {
        //
        //Get the operator name
        const user = this.get_operator();
        //
        //Get the user email from the database.
        const mail: Array<{email: string}> = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [`select email from user where user.name = '${user}'`]
        );
        //
        //Return the email
        return mail[0].email;
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
        //2.1 Get the operater input field.
        const field = this.get_element("name");
        //
        //2.2 Ensure the field is a HTMLInputElement.
        if (!(field instanceof HTMLInputElement)) throw new schema.mutall_error(`The field identified by '${field}' is not a HTMLInputElement`);
        //
        //2.3Assign the field the operator from the current logged in user.
        field.value = this.get_operator();
    }
}
//
//Collect the flow and all the data related to the:-
//-the operator
//-the business associated with.
class record_flow
    extends outlook.terminal
    implements mod.questionnaire {
    //
    //Why declare? To allow us to access the modules currently defined in
    //the main class. NB: Mother is already a property that is of type Page and
    //page does not have the modules.
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    public reg_no?: string;
    //
    //The direction of the flow.
    public direction?: string;
    //
    //The type of vehicle.
    public category?: string;
    //
    //The time of the day.
    public datetime?: string;
    //
    //The operator related to this flow record.
    public operator?: string;
    //
    //The business associated with this flow record.
    public business?: string;
    //
    //The email of the operator.
    public operator_email?: string;
    //
    //Construct the flow class
    constructor(
         // 
        //This popup parent page.
        mother: outlook.page,
        //
        //The html file to use
        filename: string
    ) {
        //pass on a url to the class.
        super(mother, filename);
    }
    //
    //Collect as many layouts as there are fields in the flow form.
    get_layouts(): Array<quest.layout> {
        //
        //6. Return the collection.
        return Array.from(this.collect_flow_layouts());
    }
    //
    //Collect the layouts for the flow form.
    *collect_flow_layouts(): Generator<quest.layout> {
        //
        //The database for saving.
        const dbname = "mutall_ranix";
        //
        //1. Add the Car registration number to the collection.
        yield[dbname, "vehicle", [], "reg_no", this.reg_no!];
        //
        //2. Add the direction.
        yield[dbname, "flow", [], "direction", this.direction!];
        //
        //3. Add the type of vehicle.
        yield[dbname, "vehicle", [], "category", this.category!];
        //
        //Add the operator.
        yield[dbname, "operator", [], "name", this.operator!];
        //
        //Add the operator email
        yield[dbname, "operator", [], "email",this.operator_email!];
        //
        //Add the operator to mutall_users database.
        yield["mutall_users", "user", [], "name", this.operator!];
        //
        //5. Add the the business associated with this flow this
        //depends on who is logged in.
        yield["mutall_users", "business", [], "id", this.business!];
        //
        //and in the carpark database organization.
        yield[dbname, "organization", [], "id", this.business!];
    }
    //
    //Collect the flow data, check it and save to the database.
    //Return false if the check fails.
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.0 Collect and check the operator data.
        this.operator = this.get_operator();
        //
        //add the operator email.
        this.operator_email = await this.get_operator_email();
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
        //1.6 Collect and check the business info.
        this.business = await this.get_business();
        //
        //2. Report this flow if it is suspicious. 
        //- 
        const valid: boolean = await this.valid_flow_direction();
        //
        //2.1 Abort this process if the flow direction is suspicious.
        if(!valid) return false;
        //
        //3. Save the data to the database.
        const ans = await this.mother.writer.save(this);
        //
        //Get the report element and attach a message to show the user that
        //the record was saved successfully.
        const report = this.get_element('reports');
        //
        //Add the ans to the element if ans = true;
        if (ans === true) (report.innerHTML = `The following vehicle ${this.reg_no} was saved successfully`) && this.clear_page(); 
        //
        //Return the final value.
        return false;
    }
    clear_page(): void{
        //
        //1 Get the reg_no and clear the value.
        const reg = this.get_element('reg_no');
        //
        if(!(reg instanceof HTMLInputElement)) throw new schema.mutall_error(`Invalid  HTMLInputElement`);
        //
        reg.value = "";
        //
        //2. Get the category and clear
        const categry = this.get_element('category');
        //
        if (!(categry instanceof HTMLInputElement)) throw new schema.mutall_error(`Category not type  HTMLInputElement`);
        //
        categry.checked = false;
        //
        //3. Get the direction
        const direct = this.get_element('direction');
        //
        if(!(direct instanceof HTMLInputElement)) throw new schema.mutall_error(`Direction not type  HTMLInputElement`);
        //
        direct.checked = false;
    }
    //
    //Validate the flow direction by getting the last record from the database
    //and compare with the current checked value. Will be done as follows :-
    //- get the checked value from the form.
    //- use the car reg_no from the form to get the last direction record from the database.
    //- validate the direction and return a true if the record is valid.
    //- otherwise, return false with an error message to guide the user.
    //If the user submits the same values again, the method returns with 
    //a default value of true. Allowing the process to continue.
    async valid_flow_direction(): Promise<boolean>{
        //
        //1. Get the checked value from the form.
        //
        //2. Add an event listener to the radio button to check the value
        //against the one in the database.
        //
        //3. Validate the direction.
        //
        //return.
        return true;
    }
    //
    //Get the operator name from the user who is logged in.
    get_operator(): string {
        //
        //Get the operator from the currently logged in user.
        // const operater = this.win.localStorage.getItem("user");
        const operater = this.mother.user;
        //
        //Ensure the operator is not null.
        if (operater === undefined) throw new schema.mutall_error("There is no user found");
        //
        //Return the operator.
        return operater.name!;
    }
    //
    //Get the business related with the flow,
    //from the user logged in
    async get_business(): Promise<string> {
        //
        //Use the current logged in user to get the business associated.
        const user = this.get_operator();
        //
        //Structure the sql.
        const sql = `
            select 
                business.id
            from 
                member
                inner join business on member.business = business.business 
                inner join user on member.user = user.user
            where
                user.name = '${user}'
        `;
        //
        //Get the business id from the database.
        const business: Array<{id: string;}> = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [sql]
        );
        //
        //Return the value 
        return business[0].id;
    }
     //
    //Get the operator email as the email field in the database is mandatory.
    async get_operator_email(): Promise<string> {
        //
        //Get the operator name
        const user = this.operator;
        //
        //Get the user email from the database.
        const mail: Array<{email: string}> = await server.exec(
            "database",
            ["mutall_users"],
            "get_sql_data",
            [`select email from user where user.name = '${user}'`]
        );
        //
        //Return the email
        return mail[0].email;
    }
    //
    //Show the time and operator of the flow.
    async show_panels(): Promise<void> {
        //
        //1. Show the current time
        const input = <HTMLInputElement>this.get_element('datetime');
        input.valueAsDate = new Date();
        //
        //2.Show the operator.
        //
        //2.1 Get the operater input field.
        const field = this.get_element("name");
        //
        //2.2 Ensure the field is a HTMLInputElement.
        if (!(field instanceof HTMLInputElement)) throw new schema.mutall_error(`The field identified by this id '${field}' is not a HTMLInputElement`);
        //
        //2.3Assign the field the operator from the current logged in user.
        field.value = this.get_operator();
    }
}
//
//This is the class that display the current vehicle's duration
class vehicle_duration extends outlook.terminal{
    //
    //The vehicle duration in the parking lot
    public duration?:Array<{reg:string,siku:string, saa1:string,dir1:string,saa2:string, dir2:string, duration:string}>;
    //
    //The daily performance in vehicle flow recording
    public performance?:Array<{siku:string,total:string, err:string,rate:string}>;
    //
    //The class constructor
    constructor(
        //
        //The parent page of this page
        mother: outlook.page,
        //
        //The file that displays the carpark duration information
        filename:string
        ){
        //
        //Reference to the super to handle the inheritance
        super(mother,filename);
    }
    //
    //The check method that ensures that all user inputs are checked for quality
    async check():Promise<boolean>{return true}
        //
    //Get the duration of the vehicle in the parking lot
    async get_duration():Promise<void>{
        //
        //1. Construct the complete query that provides the output for the number
        //of vehicles and the rate of data collection accuracy
        const query:string=`
            with
                #
                #Split the datetime to date and time as the base of our queries
                flow as (
                    select
                        flow,
                        upper(vehicle .reg_no) as reg,
                        cast(flow.datetime as date) as siku,
                        cast(flow.datetime as time) as saa,
                        flow.direction as dir,
                        operator.name as operator
                    from flow
                        inner join vehicle on flow.vehicle= vehicle.vehicle
                        inner join operator on flow.operator =operator.operator
                    order by reg,siku,saa
                ),
                #
                #Show the lead direction and time
                leads as(
                    select
                        reg,
                        siku,
                        dir as dir1,
                        saa as saa1,
                        lead(dir) over(PARTITION BY reg,siku)as dir2,
                        lead(saa) over(PARTITION BY reg,siku)as saa2,
                        operator
                    from flow	
                ),
                #
                #Isolate cases with Incoming and outgoing errors
                ioerr as(
                    select
                        *
                    from leads
                    where dir1=dir2
                ),
                #
                #Find the errors per day
                dailyerr as(
                    select 
                        siku,
                        count(reg)as err
                    from ioerr
                    group by siku
                ),
                #
                #Get all the flows per day
                dailyflow as(
                    select
                        siku,
                        count(reg) as total		
                    from leads
                    group by siku
                ),
                #
                #Find out the error rate per day
                performance as(
                    select
                            dailyflow.siku,
                            dailyflow.total,
                            dailyerr.err,
                            format((err/total)*100,1)as rate
                    from dailyflow
                            left join dailyerr on dailyflow.siku= dailyerr.siku
                    order by siku desc
                ),
                #
                #Find out the duration of each visit of each car
                car_dur as(
                    select
                        reg,
                        siku,
                        saa1,
                        dir1,
                        saa2,
                        dir2,
                        timestampdiff(minute, saa1,saa2) as duration
                    from leads
                    where dir1 !=dir2
                ) 
                select * from car_dur order by siku desc`;
        //
        //2.0 Execute the car_duration query to retrieve the duration of a vehicle
        //in the parking lot.Expected output Array<{reg:string,siku:string, saa1:string,dir1:string,saa2:string, dir2:String, duration:string}
        this.duration = await server.exec("database",["mutall_ranix"],"get_sql_data",[query]);
    }
    //
    //Provides the page the capabilities to interact smartly with the page. In
    //the carpark application, it shows the duration of the vehicle in the
    //parking lot.
    async show_panels():Promise<void>{
        //
        //Get the duration
        await this.get_duration();
        //
        // Get the content panel to create the table from
        const content = this.get_element("content");
        //
        //Create the table inside the content
        const table = this.create_element(content, "table",{});
        //
        //Create the header of the table
        const thead = this.create_element(table,"thead",{});
        //
        //Create the body of the table
        const body= this.create_element(table,"tbody",{});
        //
        //create the table row headers
        const th=this.create_element(thead,"tr",{});
        //
        //Get the first record of the duration....
        const header_data = this.duration![0];
        //
        //..get the header data as an array.
        const header = Object.keys(header_data!);
        //
        //Create the table header??
        this.create_element(th,"th",{textContent:header[0]});
        this.create_element(th,"th",{textContent:header[1]});
        this.create_element(th,"th",{textContent:header[2]});
        this.create_element(th,"th",{textContent:header[3]});
        this.create_element(th,"th",{textContent:header[4]});
        this.create_element(th,"th",{textContent:header[5]});
        this.create_element(th,"th",{textContent:header[6]});
        //
        //Add the row values to the table
        this.duration!.forEach(row=>{
            //
            //Destructure the rows
            const {reg,siku, saa1,dir1,saa2,dir2,duration}=row;
            //
            //Create a table row inside the body
            const tr= this.create_element(body,"tr",{});
            //
            //Populate the registration cell
            this.create_element(tr, 'td', { textContent:reg });
            //
            //Populate the siku data cell
            this.create_element(tr, 'td', { textContent: siku });
            //
            //Populate the saa 1 data cell
            this.create_element(tr, 'td', { textContent: saa1 });
            //
            //Populate the incoming direction flow
            this.create_element(tr, 'td', { textContent: dir1 });
            //
            //Populate the time of arrival of a vehicle
            this.create_element(tr, 'td', { textContent: saa2 });
            //
            //Populate the outgoing direction flow
            this.create_element(tr, 'td', { textContent: dir2 });
            //
            //Populate the vehicle's duration
            this.create_element(tr, 'td', { textContent: duration });
        }); 
    }

}