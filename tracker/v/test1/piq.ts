//
//
//Resolves reference to the asset.products data type
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import schema.
import * as schema from "../../../schema/v/code/schema.js";
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js'; 
//
export type Ipiq = {piq: string};
//
//Completing level 2 registration
export class piq extends outlook.baby<quest.Iquestionnaire>{
    //
    constructor(base: outlook.page){
        super(base, "definers.html" )
    }
    //
    check():boolean{
        //
        
        //
        return true;
    }
    //
    //
    async get_result():lib.Iquestionnaire{
        //
        const start_date = document.querySelector("{name = start_date}")
        //
        const result:lib.Iquestionnare = []
        result.push([
            "dbname",
            "ename",
            "cname",
            ""
        ]); 
    }
}