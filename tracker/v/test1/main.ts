//
//Import app from the outlook library.
import {assets, baby, popup} from '../../../outlook/v/code/outlook.js';
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
import * as viewer from "../../../outlook/v/code/viewer.js"
//System for tracking assignments for employees of an organization.
//
//A column on the application database that is linked to a corresponding one
//on the user database. Sometimes this link is broken and needs to be
//re-established.
//
//The structure of a definer.
export type Idef = {
    def: string;
    caption: string;
    organization: string;
    seq: number;
}
//
export default class main extends app.app {
    //
    //Initialize the main application.
    constructor(config: app.Iconfig) {
        super(config);
    }
    //
    //
    //Retuns all the inbuilt products that are specific to
    //thus application
    get_products_specific(): Array<outlook.assets.uproduct> {
        return [
            {
                title: "Actions",
                id:"definer",
                solutions: [
                    //
                    //populate definers from the database
                    {
                        title: "New Definer",
                        id: "definer",
                        listener: ["event", () => this.definer()]
                    }
                ]
            }
            ];
        }
        async definer() {
            //List of definers
            const definer: Array < { id: string } > = await server.exec(
            
             //selects data from a database in regard to the pk.
//               "selector",
//               ["definer", app.app.current.dbname],
//               "execute",
//               []
            
                "database",
                ["mutall_tracker"],
                "get_sql_data",
                ["select id from definer"]
            );
            //get after running sql
            const select = this.get_element("definer");
            //Formulate the option from the definers list.
            const options: Array < string > = definer.map(
                (definer) => `<option value= '${definer.id}'>${definer.id}</option>`
            );
            //
            //Convert option to text
            const options_str: string = options.join("\n");
            //
            //Attach the options to the select element.
            select.innerHTML = options_str;
        }
}

class definer extends outlook.baby<Idef> {
    //
    constructor(public app: main){
        super(app, 'definers.html')
    }
    //In future, check if a file json file containing Iquestionnaire is selected.
    //For now, do nothing
     check():Promise<boolean>{
        return result;
        }
    //
    //
    async get_result(): Promise<Idef> {
        //
        //Get the definer id
        const id = this.get_element('id');
        //
        //ensure you have an input element
        if (!(id instanceof HTMLInputElement)){
            //
            throw new schema.mutall_error(`input for element "identifier" not found`);
        }
        //
        //Get the definer caption
        const caption = this.get_element('caption');
        //
        //ensure you have an input element.
        if(!(caption instanceof HTMLInputElement)){
            //
            throw new schema.mutall_error(`Input for element "caption" not found`);
        }
        //
        //Get the organisation
        const organization = this.get_element('organization');
        //
        //ensure the is an input element
        if(!(organization instanceof HTMLInputElement)){
            //
            throw new schema.mutall_error(`Input for element"organization" not found`);
        }
        //
        //Get the sequence
        const seq = this.get_element('seq');
        //
        //Ensure there is an input element
        if(!(seq instanceof HTMLInputElement)){
            //
            throw new schema.mutall_error(`Input for element "sequence" not found`);
        }
        //
        //compile the message 
        const idefi: Idef = {
            def: id.value,
            caption: caption.value,
            organization: organization.value,
            seq: seq.valueAsNumber
        };
        //
        return idefi;
     }
}


  