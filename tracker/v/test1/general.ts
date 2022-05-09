//
import * as app from "../../../outlook/v/code/app.js";
import * as server from "../../../schema/v/code/server.js";
//
//Populate the select element with the necessaru businesses that the user who is registering 
//wants to associate with.
async function get_business(select: HTMLSelectElement) {
    //
    //The list of businesses.
    const organizations: Array<{name: string}> = await server.exec(
        "database",
        [app.app.current.dbname],
        "get_sql_data",
        ["select name from organization"]);
    //
    //Formulate the options from the list of orgnizations.
    const options: Array<string> = organizations.map(
        (organization) => `<option value='${organization.name}'>${organization.name}</option>`
    );
    //
    //Convert the options into some text.
    const options_str: string = options.join("\n");
    //
    //Attach the options to the select element.
    select.innerHTML = options_str;
}