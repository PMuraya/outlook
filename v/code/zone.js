//The panel hierarchy
import { view } from "../../../outlook/v/code/view.js";
import { mutall_error } from "../../../schema/v/code/schema.js";
import { exec } from "../../../schema/v/code/server.js";
import { io } from "../../../schema/v/code/io.js";
//Modelling the panels that take part in the neigbourhood strategy.
export class zone extends view {
    parent;
    //
    //The only HTML table element to be associated with all the zones. It is 
    //initialized only by the zone that is at the root level. 
    table;
    //
    //The origin of thos zone
    origin;
    //
    //The size of the zone in HTML td cells
    size;
    //
    //The current reference cell for this zone. This designed to define the axes 
    //that should be searched for labels. 
    cell;
    //
    //The default parent is the body element of the current document 
    constructor(parent = 'body') {
        super();
        this.parent = parent;
    }
    //Returns the size of a zone as a pair of cooordinates
    async get_sizes() {
        //
        //Return the size its already known
        if (this.size)
            return this.size;
        //
        //Compute the size for each dimension (without any constraint)
        const size = [
            await this.get_size(0),
            await this.get_size(1)
        ];
        //
        //Save the size, so we dont have to recompute it if requsted
        this.size = size;
        //
        //return the requested size
        return size;
    }
    //The id of a zone is important for reporting. Its derived from the parent
    //zone and its relative psoition in the heterozone
    get id() {
        //
        //Get the parent of this zone
        const parent = this.parent;
        //
        //If teh parent is a string, then its the id
        if (typeof parent === 'string')
            return parent;
        //
        //Formulate the id as that of the parent with a corrdinate index,
        //e.g., body[1,2]
        return `${parent.zone.id}[${parent.index[0]},${parent.index[1]}]`;
    }
    //Initialize the HTML table cells, if necessary.
    fill_html_table() {
        //
        //Initialize the HTML table cells
        //
        //Get the parent of this zone
        const parent = this.parent;
        //
        //Continue only if this zone is at the root level, i.e., it is not a childe
        //of any other zone
        if (typeof parent !== 'string')
            return;
        //
        //Create the shell table from a css string
        this.table = this.create_table(parent);
        //
        //Create a tbody section
        const tbody = this.create_element('tbody', this.table);
        //
        //Get the size of the table; do not assume that it is known
        const size = this.myget(this.size, `${this.constructor.name}.size`);
        //
        //Destructure the size
        const [rmax, cmax] = size;
        //
        //Create the table rows and columns. This is done differently for glades
        this.create_table_cells(rmax, cmax, tbody);
    }
    //Create the table rows and columns
    create_table_cells(rmax, cmax, tbody) {
        //
        //Loop through all the rows to create rows and tds
        for (let r = 0; r < rmax; r++) {
            //
            //Create a table row, tr
            const tr = tbody.insertRow();
            //
            //Insert as many tds as suggested by the size of columns
            for (let c = 0; c < cmax; c++)
                tr.insertCell();
        }
    }
    //Create a HTML table using the give css string. If css points to a valid 
    //HTML table element, return it.  If it is just an ordinary string, then get 
    //the element and create a table under it.
    create_table(str) {
        //
        //Use the css to get the element
        const element = this.document.querySelector(str);
        //
        //The element must be a valid
        if (!element)
            throw new mutall_error(`Unable to find element identified by css '${parent}'`);
        //
        //If the element is a table then return it; otherwise construct one under
        //that element
        const table = element instanceof HTMLTableElement
            ? element
            //
            //Create a table with a border of 1 pixel
            : this.create_element('table', element, { border: '1' });
        //
        return table;
    }
    //Climb the zone hierarchy until you get a table that is defined. Report
    //an error if none is found
    get_table() {
        //
        //Try the table of this element
        if (this.table)
            return this.table;
        //
        //Test if this is a root zone. The root of a root zone is a css
        const parent = this.parent;
        //
        if (typeof parent === 'string')
            throw new mutall_error(`No valid HTMLT table found`);
        //
        //Get the parent zone
        const zone = parent.zone;
        //
        //Return the table of the zone
        return zone.get_table();
    }
    //The origin of a zone is its top left coordinate in a HTML table element, 
    //a.k.a, the shell. It is determined by using the (left and above) 
    //neighbors of this zone in the table.
    async get_origin() {
        //
        //Return the origin if it is already known
        if (this.origin)
            return this.origin;
        //
        //Use neighborhood to compute the origin components
        this.origin = [
            this.get_origin_component(0),
            this.get_origin_component(1)
        ];
        //
        return this.origin;
    }
    //Use neigborhood to compute one component of an origin in the requested 
    //dimension. It is the same as the of the neigboring zone plus its size 
    //of a compo
    get_origin_component(dim) {
        //
        //Get the older neighbor (i.e., the one on the left or top) of this zone; 
        //there may be none.
        const zone = this.get_neighbor(dim, -1);
        //
        //If there is no neigbhbor, the origin component is 0
        if (!zone)
            return 0;
        //
        //Get the origin of the neigbouring zone. It must be found (as it is 
        //older than this one)
        const origin0 = this.myget(zone.origin)[dim];
        //
        //Get the size of the neigboring zone. It must be found
        const size = this.myget(zone.size)[dim];
        //
        //Comput the new origin component
        const origin2 = origin0 + size;
        //
        //Comple and retirn the origin 
        return origin2;
    }
    //Returns the neigbour of this zone by searching ahead of(+1) or behind (-1)
    //this zone in the given dimension
    get_neighbor(dim, delta) {
        //
        //The following neigborhood analysis is necessary only if the parent of
        //this zone is a heterozone; otherwise we return undefined
        const parent = this.parent;
        if (typeof parent === 'string')
            return undefined;
        //
        //Get the other siblings of this zone
        const children = parent.zone.children;
        //
        //Get the position of this zone amongst the siblings
        const position = parent.index;
        //
        //Define the desired result by searching to the left and at the top 
        const result = this.search_neighbor(dim, delta, position, children);
        //
        return result;
    }
    //Look for a neigboring zone in the requested dimension
    search_neighbor(dim, delta, position, children) {
        //
        //Let p be the new position, starting with the current one. NB. It is not
        //wise to say p=position, because we might change the position inadvertently
        const p = [position[0], position[1]];
        //
        //Apply the change to this position 
        p[dim] += delta;
        //
        //Get the neigbouring sibling; there may be none. Prepare for indexing
        //failure
        try {
            //Destructure the new position
            const [r, c] = p;
            //
            //Get the indexed zone; there may be  none -- in wich case an excepion
            //is raised
            return children[r][c];
        }
        catch (err) {
            return undefined;
        }
    }
}
//Modelling the source of data that drives a homozone. They key charateristic of
//a source is that it must support popluating of a pair axes and a homozone 
export class source extends view {
    driver_source;
    //
    driver;
    //
    //If teh axes data source is not defined, then we assume we can deduce it
    //from the driver; its an error if the driver is null
    constructor(driver_source) {
        //
        //Initialize the view
        super();
        this.driver_source = driver_source;
        //
    }
    //The data for a homozone is an object (matrix) of basic values or null
    async get_driver() {
        //
        //Return the driver if it is already known
        if (this.driver)
            return this.driver;
        //
        //If a driver option is not available, then teh driver cannot be determined
        if (!this.driver_source)
            throw new mutall_error(`driver_source not found. Add it to your options`);
        //
        //Compute the driver by simplifying the source
        const driver = await this.simplify(this.driver_source);
        //
        //Save teh driver for future references
        this.driver = driver;
        //
        //Return the driver
        return driver;
    }
    //Simplifying a data source is to standardise it to an object of the basic value
    //type
    async simplify(driver_source) {
        //
        //Define the desired output
        let result;
        //
        //If the source is empty, then return an empty object
        if (driver_source === null)
            return {};
        //
        //Convert the source to desired output
        switch (driver_source.type) {
            //
            //The tiniwst non-null data used for testing purposes
            case 'scalar':
                //
                //A scalar has string 0 indices
                result = { '0': { '0': { value: driver_source.scalar } } };
                break;
            //
            //Convert a simple array of basic values, i.e., Array<basic_value>, 
            //to a driver, i.e., obj<basic_value, which expands to 
            //{[row:string]:{[col:string]:basic}} where row is set row '0' and
            //as the  vertical indexer. The case when the indices are the same
            // as the values is a special one
            case 'array':
                //
                //There is only one row in an array; its axis value is the string '0'
                result = { '0': {} };
                //
                //Loop thru the vector values and addd them to the result structure.
                //NB. If the array data source is special, then the values are used also as indices, otherwise the indices are numeric
                driver_source.array.forEach((value, i) => result['0'][driver_source.special ? String(value) : String(i)] = { value });
                //
                break;
            //
            //Assume the row and column axes of a regular matrix have values 
            //that match the numeric indices
            case 'matrix':
                result = {};
                driver_source.matrix.forEach((r, i) => {
                    //
                    result[String(i)] = {};
                    //
                    r.forEach((c, j) => result[String(i)][String(j)] = { value: c });
                });
                break;
            //
            //A specification that says that the data of this zone is its driver.
            case 'driver':
                result = driver_source.driver;
                break;
            //
            //Modelling data generated by executing a query (using the 
            //get_sql_data route)     
            case 'sql.fuel':
                //
                //Exeute tte sql to get the fuel
                const fuel = await exec('database', [driver_source.dbname, false], 'get_sql_data', [driver_source.sql]);
                //
                //Simplify the  fuel
                result = await this.simplify({
                    type: 'array.fuel',
                    fuel,
                    row_index: driver_source.row_index
                });
                break;
            //
            //The data generated by executing an sql that is structured to give 
            //an obj<cell_value> structure     
            case 'sql.obj':
                //
                //Get the structured data frommthe database 
                const x = await this.get_data(driver_source.sql, driver_source.dbname);
                //
                //If the result is null, then return an empty object
                result = x ?? {};
                break;
            //
            //Result of transposing the given data source    
            case 'transpose':
                result = this.transpose(await this.simplify(driver_source.source));
                break;
            //
            //Any user defined dat    
            case 'udf':
                result = await this.get_udf_data(driver_source.data);
                break;
            case 'array.fuel':
                //
                //Convert from Array{fuel} to obj<basic_value>, assuming col has 
                //the the row indices
                result = this.convert_fuel_2_obj(driver_source.fuel, driver_source.row_index);
                break;
            //
            //Read all teh detata from the named entity    
            case 'ename':
                //
                //Compile a source of type sql.fuel
                const src = {
                    type: 'sql.fuel',
                    sql: `select * from ${driver_source.ename}`,
                    //
                    //The primary key is indexes the row
                    row_index: driver_source.ename,
                    dbname: driver_source.dbname
                };
                result = await this.simplify(src);
                break;
            //
            //Returns the array (or double array depending on the axis), of the data
            //that defines the axis of the given dimension
            //{type:'axis', dim:0|1, ds:driver_source|homozone}
            case 'axis':
                //
                //Destructure the driver source
                const dim = driver_source.dim;
                const ds2 = driver_source.ds;
                //
                //Simplify the ds1 as follows:-
                const axis = 
                //
                //If ds2 is a homozone... 
                ds2 instanceof homozone
                    //
                    //...get its requested axis
                    ? await ds2.get_axis(dim)
                    //
                    //..if its a source, also get its axis (as well)
                    : await new source(ds2).get_axis(dim);
                //
                //If the axis is undefined, then set set teh result to an empty
                //object    
                if (!axis) {
                    result = {};
                }
                else {
                    //Convert the array of strings to an array of cell values
                    //
                    //Define an array as a special data source, i.e., one where the
                    //axis values are the indexes
                    const ds = { type: 'array', array: axis, special: true };
                    //
                    //The row component (dim==0) should be transposed 
                    const newds = dim == 0 ? { type: 'transpose', source: ds } : ds;
                    //
                    //Simplify the new data source
                    result = await this.simplify(newds);
                }
                //
                break;
            //Another sql source that produces data in a long format. The names refer
            //to the columns of the query which provide:-
            //-the array of values that form the row axis
            //-the array of values that form the column axis
            //-the (measurement) values to be tabulated
            //This kind of data is the our motivation for tabulation as it is not ver
            //easy to sport the underlying patterns
            //{type:'long', source:source, row:cname, col:cname, measurement:cname}
            case 'sql.long':
                //Destructure the source
                const { sql, row, col, cell_value, dbname } = driver_source;
                result = await this.simplify_long_source(sql, row, col, cell_value, dbname);
                break;
        }
        //
        return result;
    }
    //Use the sql that produces data in a long format. The names refer
    //to the columns of the query which provide:-
    //-the array of values that form the row axis
    //-the array of values that form the column axis
    //-the (measurement) values to be tabulated
    //This kind of data was the motivation for tabulation as it is not very
    //easy to sport the underlying patterns
    //{type:'sql.long', source:source, row:cname, col:cname, measurement:cname, dbname:string}
    async simplify_long_source(sql_in, row, col, measurement, dbname) {
        //
        //Change the input sql to one that fits the 'sql.obj' format
        const sql = `
        with
            #Wrap the incoming sql as a CTE
            sql_in as (
                ${sql_in}
            ),
            #Group by rows using the column name for indexing
            myrows as(
                select
                    \`${row}\`,
                    json_objectagg(\`${col}\`, \`${measurement}\`) as measurement
                from
                    sql_in
                group by
                    \`${row}\`

            )
        #
        #Group by everything using the row name for indexing 
        select
            json_objectagg(\`${row}\`, measurement)
        from 
            myrows
        `;
        //
        //Change the given sql to the that of type obj
        const source = { type: 'sql.obj', sql, dbname };
        //
        //Get the driver for the source and return it
        const driver = await this.simplify(source);
        //
        //Standardise the result
        return driver;
    }
    //Returns user defined data type (i) from a database (not just the simple fuel)
    //assuming the fuel to be single json string that can be casted to the user
    //defined type. NB. In cases where we expected an empty object {}, mysql 
    //returned null instead. Hence the null option
    async get_data(sql, dbname) {
        //
        //Execute the sql to get the usual fuel
        const fuels = await exec('database', 
        //
        //Create the (incomplete, i.e., false parameter) database and execute 
        //the sql to return the data
        [dbname, false], 'get_sql_data', [sql]);
        //
        //The expected fuel is an array of one element only 
        if (fuels.length !== 1)
            throw new mutall_error(`Expected 1 row of data. '${fuels.length}' found `);
        //
        //Get the array of values of the one row
        const values = Object.values(fuels[0]);
        //
        //Only 1 value is expected
        if (values.length !== 1)
            throw new mutall_error(`Expected 1 column of values; '${values.length}' found`);
        //
        //Get the only value
        const value = values[0];
        //
        //It is possible that teh value is null; iof so return it
        if (value === null)
            return null;
        //
        //The value must be a (json) string
        if (typeof value !== 'string')
            throw new mutall_error(`String value is expected. '${typeof value}' found`);
        //
        //Decode the json string. What if it is not? This will crash
        const result = JSON.parse(value);
        //
        //Cast the json into the desired shape. (You are on your own here)
        return result;
    }
    //Transpose data by determining the row and column axes, then using them
    //to step through data and recompile them by interchanging coordinates 
    transpose(driver) {
        //
        //Expand the structure of a driver
        const d = driver;
        //
        //Get the row axis
        const rows = Object.keys(driver);
        //
        //Get the column axes (from the first row of the driver)
        const cols = Object.keys(Object.values(driver)[0]);
        //
        //Start with ane empty result
        const result = {};
        //
        //Step through the column axis (rather than row)
        for (const col of cols) {
            //
            //Create an empty object of row values
            const c = {};
            //
            //Loop through all the rows
            for (const row of rows) {
                c[row] = d[row][col];
            }
            //
            //Save row values
            result[col] = c;
        }
        return result;
    }
    //
    //Convert fuel to the data that drives a homozone. The column indices
    //are part of the data. The row indices come from the given field
    convert_fuel_2_obj(fuel, row_index) {
        //
        //Expand the structure of the fuel fully
        const driver = fuel;
        //
        //Start with an empty result
        const result = {};
        //
        //Loop thru all the rows of the fuel to create driver rows
        for (const row of driver) {
            //
            //Create an empty driver row
            const r = {};
            //
            //Loop thru all the key columns of the row
            for (let col in row) {
                //
                //Ignore the column that matches the row index
                if (col === row_index)
                    continue;
                //
                //Get the columns value
                const bvalue = row[col];
                //
                //Convert the basic value to a cell value
                const cell_value = this.convert_2_cell_value(bvalue);
                //
                //Save the cell value
                r[col] = cell_value;
            }
            //
            //Get the name of the givem field to get a row index key
            const value = row[row_index];
            //
            //Convert the basic value to a string key
            const key = String(value);
            //
            //If an error if the row index does yields nothing
            if (!key)
                throw new mutall_error(`This row indexing field '${row_index}' is not found`);
            //
            //Use the key to save the new row, r, into the result
            //
            result[key] = r;
        }
        //
        return result;
    }
    //Convert a basic value to a cell value
    convert_2_cell_value(value) {
        //
        //Conver a basic type to a plain cell value 
        if (value === null)
            return { value };
        if (typeof value === 'number')
            return { value };
        if (typeof value === 'boolean')
            return { value };
        //
        //At this point the value must be a string. Try to convert it to object
        try {
            //Parse thr strinn
            const x = JSON.parse(value);
            //
            //Its an error if the value is not a cell value
            if (x.value === undefined)
                throw new mutall_error(`Unable to convert '${value}' to a cell_value`);
            //
            //Cast the value to a cell value
            return x;
        }
        catch (err) {
            return { value };
        }
    }
    //Implement your oen version by overiding this method
    async get_udf_data(source) {
        throw new mutall_error(`Please override this method by implementing your own version`);
    }
    //Extract the requested axis from this source's driver. There is an issue if
    //the driver is empty, i.e., {}, as this is not useful. Consider using the 
    //metadata. Also, there is an issue of ordering of elements in the axis. To
    //address this, consider obtaining without using the Object.keys() approach
    //which does not remember the order in which keys were inserted into an object
    async get_axis(dim) {
        //
        //Take care of the special sql.fuel in the column dimension. 
        //When the presure is down, implement versions that match every known 
        //data source.
        if (this.driver_source.type === 'sql.fuel') {
            //
            //Destructure the driver source
            const { sql, row_index, dbname } = this.driver_source;
            //        
            switch (dim) {
                //
                //Craft an appropriate sql to get the elements of the row axis
                case 0:
                    //
                    //Formulate the sql for retrieving he elements
                    const mysql = `select ${row_index} from (${sql}) as mysql`;
                    //
                    //Execute the sql to get an array of fuel
                    const fuels = await exec('database', [dbname, false], 'get_sql_data', [mysql]);
                    //
                    //Map the returned array of fuel to an array of strings
                    return fuels.map(fuel => String(fuel[row_index]));
                //Use the sql metadata to get the elements of the column axis      
                case 1:
                    //
                    //Return the axis elements of the column index as metadata of the 
                    //undelying sql 
                    return await this.sqlfuel_get_metadata(sql, row_index, dbname);
            }
        }
        //Avoid the Object.keys method for array.fuel, row dimension cases
        if (this.driver_source.type === 'array.fuel' && dim === 0) {
            //
            //Destructure the driver source
            const { fuel, row_index } = this.driver_source;
            //
            //Return the axis elements of the column index as a mapping of
            //the indexing  column
            return fuel.map(item => String(item[row_index]));
        }
        //
        //The default method of getting an axis uses the driver directly
        else {
            //
            const driver = await this.get_driver();
            //
            //Extract the values of the row axis
            if (dim === 0)
                return Object.keys(driver);
            //
            //Get the column axes; they are the keys of all the rows. 
            //
            //Start with an empty set of column strings, to ensure that the result
            //is unique
            const cols = new Set();
            //
            //Loop throu the rows keys
            for (const r in driver) {
                //
                //Loop thru the column keys
                for (const c in driver[r]) {
                    cols.add(c);
                }
            }
            //
            //Expand and return the values
            const axis = [...cols];
            //
            //An axis with no elements is undefined
            if (axis.length === 0)
                return undefined;
            //
            //Otherwise return the axis
            return axis;
        }
    }
    //
    //Return the axis elements of the column index as metadata of the 
    //undelying sql 
    async sqlfuel_get_metadata(sql, row_index, dbname) {
        //
        //Retrieve the metadata from the server
        const result = await exec('database', [dbname, false], 'get_column_metadata', [sql]);
        //
        //Extract he column names from the metadata
        const names = result.map(metadata => metadata.name);
        //
        return names;
    }
}
//This class models a homogenous set of cells that can be accessed via a
//string based coordunate system 
export class homozone extends zone {
    options;
    //
    //The source of driver data
    source;
    //
    //The data that drives this homozone; it is derived from the driver source
    driver;
    //
    //The rows and columns that spell the design of a homozone; they are derived
    // from the axes sources
    axes = [undefined, undefined];
    //
    //A homozone is a set of cells indexed by a row and column id. Cell is a
    //panel that has a td element minimum. NB. The data of a homozone shares 
    //the same indexing system as the cells. See populate_shell_cells methods. A
    //cell structure has an iniial value of {},designed to make it easier to
    //specifiy data access expressions, e.g.,
    //this.zone.cells['a']['b'] instead of this.zone!['a']['b'].
    cells = {};
    //
    //Private properties for determining when the margin (header or leftie) 
    //of this homozone is available or not
    margin = [undefined, undefined];
    constructor(options = {}, parent) {
        //
        super(parent);
        this.options = options;
    }
    //Returns the size of a zone as a pair of cooordinates
    async get_sizes() {
        //
        //Return the size if its already known
        if (this.size)
            return this.size;
        //
        //Compute the size for each dimension
        const size = [
            await this.get_size(0),
            await this.get_size(1)
        ];
        //
        //Save the size, so we dont have to recompute it; then return it
        return this.size = size;
    }
    //Get the size of this homozone in the requested dimension. 
    async get_size(dim) {
        //
        //Return the size if its already known
        if (this.size && this.size[dim])
            return this.size[dim];
        //
        //Set the source, if not yet set and if driver is available
        if (!this.source && this.options.driver_source)
            this.source = new source(this.options.driver_source);
        //
        //Initialize the driver source, if it is not yet done. Use the source
        //to set it;  otherwise set the driver to an empty object
        if (!this.driver)
            this.driver = this.source ? await this.source.get_driver() : {};
        //
        //Get the axes; they determine the size of a homozone. 
        //An xis may be explicity set by a user, indirectly deduced from the 
        //either the driver source or the neigborhood
        const axis = await this.get_axis(dim);
        //
        //The size of an sxis is the count of its elements
        const result = axis.length;
        //
        return result;
    }
    //Get the identified axis of this homozone, subject to the given direction 
    //constraint. 
    //The axis may be explicity set by the user, deduced from either the 
    //underlying driver source or from the neigborhood
    async get_axis(dim, delta) {
        //
        //If the axis is already known, then do not waste time; return it as it
        //is.
        const result1 = this.axes[dim];
        if (result1)
            return result1;
        //
        //Get an from 1st principles
        const result2 = await this.get_axis_from_1st_principls(dim, delta);
        //
        //Save the axis result, so we dont have to re-do this in future
        this.axes[dim] = result2;
        //
        //Return the 2nd result
        return result2;
    }
    //Get the given axis of this zone from first principles
    async get_axis_from_1st_principls(dim, delta) {
        //
        //If the axis specification is provided by the user simplify to convert
        //the specs to an axis
        if (this.options.axes_source && this.options.axes_source[dim])
            return await this.simplify_axis(this.options.axes_source[dim], dim);
        //
        //Use the driver source to derive the axis, if it is available
        const drv = await this.get_driver_axis(dim);
        if (drv)
            return drv;
        //        
        //Deduce the axis from the immediate neighborhood
        const result = await this.get_neighboring_axis(dim, delta);
        //
        //Return the result if it is valid
        if (result)
            return result;
        //
        //It is an error if the axis cannot be found for a homozone.
        throw new mutall_error(`Unable to determine the '${dim}' axis of zone '${this.id}'`);
    }
    //Use the driver source of this zone to determine its axis in the requested
    //dimension. The result is undefined if the driver is empty  
    async get_driver_axis(dim) {
        //
        //Define the desired axis
        let axis;
        //
        //If the driver source is available, use it to deduce the axis
        if (this.source && (axis = await this.source.get_axis(dim)))
            return axis;
        //
        //If the driver source specs are available, create the source, then use it
        //compute the axis
        if (this.options.driver_source) {
            //
            //Set the source
            this.source = new source(this.options.driver_source);
            //
            //Use the source to deduce an axis
            return await this.source.get_axis(dim);
        }
    }
    //Returns the common axis with a neigboring zonr
    async get_neighboring_axis(dim, constraint) {
        //
        //If there is no constraint then look both behind and ahead directions; 
        //otherwise look only in the constrained direction. If you don't, you risk
        //getting into an endless loop
        const directions = constraint === undefined ? [-1, 1] : [constraint];
        //
        //Define the desired axis
        let axis;
        //
        for (const direction of directions) {
            //
            //Get the correct neighboring zone in the current direction one. We 
            //ensure the correctness by observing that the neighbor in the 
            //vertical axis is the correct one when we are looking for the 
            //horizontal axis, and vice versa
            let zone = this.get_neighbor(dim === 0 ? 1 : 0, direction);
            //
            //The zone nmust be a homozone
            if (zone instanceof homozone) {
                //
                //Get the axies of the zone, subject to the time constraint
                axis = await zone.get_axis(dim, direction);
                //
                //Return the axis if it is defined
                if (axis)
                    return axis;
            }
        }
        //
        return axis;
    }
    //To simplify an axis is to translate its specification to its standard form
    // -- an array of strings
    async simplify_axis(xs, dim) {
        //
        //If the axis source is an array, then no simplification is needed.; 
        //return the array of strings
        if (Array.isArray(xs))
            return xs;
        //
        //If the axis source is undefined, then deduce it from this homozones 
        //data source if it exist
        const axis = await this.source?.get_axis(dim);
        //
        if (axis)
            return axis;
        //
        throw new mutall_error(`Unable to simplify this axis`);
    }
    //Returns the header/leftie margins of this zone as homozones
    header() { return this.get_margin(1); }
    leftie() { return this.get_margin(0); }
    //Returns the leftie margin of this zone
    get_margin(dim) {
        //
        //Get the desired margin
        let margin = this.margin[dim];
        //
        //If the margin is ready, return it
        if (margin)
            return margin;
        //
        //Use the specified dimension axis to deerive a driver sourcce for the header
        const ds = { type: 'axis', dim, ds: this };
        //
        //Create the margin homozone
        margin = new homozone({ driver_source: ds });
        //
        //Save the margin
        this.margin[dim] = margin;
        //
        //Return the new margin
        return margin;
    }
    //
    //Override the id of a homozone, if it is provided
    get id() {
        //
        //Let i be an id defined in teh options
        const i = this.options.id;
        //
        //Return i if available; otherwise use the defaut version
        return i ?? super.id;
    }
    //
    //Update the axes of this zone to match those of the older neighbours, so 
    //that there is alignment of cells. You may also want to verify that the 
    //teh axes memberships is consistent, i.e., they share same members even though
    //the ordering and sizes may be different
    update_axes() {
        //
        //Define a function that throws an exception
        const mythrow = (dim) => { throw new mutall_error(`Axis '${dim}' not defined`); };
        //
        //Get the current axes of this zone -- the ones to be updated
        const self = [
            //
            //The self axis must be defined by now; its an error if they are not
            this.axes[0] ?? mythrow(0),
            this.axes[1] ?? mythrow(1)
        ];
        //
        //Get the neigbouring zones, if they exist, above or to the let of this 
        //zone. NB. The younger zones do not influence the ordering of this zone's
        //axes 
        const neighbors = [
            this.get_neighbor(0, -1),
            this.get_neighbor(1, -1)
        ];
        //
        //Extract the axes from the neighbors,. NB. The neighbor in the vertical
        //axis defines the horizontal axis, and vices versa. 
        const axes = [
            this.extract_axis(neighbors[1], 0, self),
            this.extract_axis(neighbors[0], 1, self) //The vice versa of the above 
        ];
        //
        return axes;
    }
    //Extract the correct axis from the given neighboring zone. 
    extract_axis(zone, dim, self) {
        //
        //If there is no neighbor, then the axis of this zone is not influenced
        //by anything; it remains the same
        if (!zone)
            return self[dim];
        //
        //If the neighbor is not a homozone, then the targeted axis of this
        //zone is independent
        if (!(zone instanceof homozone))
            return self[dim];
        //
        //Get the neighbor's axis
        const naxis = zone.axes[dim];
        //
        //It is an error if the immediate past neighbor's axis is undefined
        if (naxis === undefined)
            throw new mutall_error(`
                The axis of '${zone.id}' that is a past neigbor of '${this.id}' 
                in the '${dim}' dimension is umdefined`);
        //
        //Get the axis of this zone
        const thisaxis = this.axes[dim];
        //
        //It is an error if both the neighbor and this zone have no axes
        if (thisaxis.length === 0 && naxis.length === 0)
            throw new mutall_error(`Neither of these zone, ${this.id} and ${zone.id} have axes in dimension ${dim}`);
        //
        //If this and neigbouring axes are identical, then no adjustment is needed
        if (String(thisaxis) === String(naxis))
            return thisaxis;
        //
        //Use sets to test for similarities.
        const thisset = new Set(thisaxis);
        const nset = new Set(naxis);
        //
        //Define function which tests if A is a subsetof B
        function subset(A, B) {
            //
            //A is a subset of B all the members of A are contained in B 
            return [...A].every(item => B.has(item));
        }
        //
        //If this axis is a subsest of the neighbour, then return the neighbour...
        if (subset(thisset, nset))
            return naxis;
        //
        //...and vice versa
        if (subset(nset, thisset))
            return thisaxis;
        //
        //Get the assymetric differemce of the 2 sets as an array of strings
        const diff = Array.from(this.get_difference(nset, thisset));
        //
        //It is an error if the axes (of this zone and her neighbor) have 
        //a symmeric difference
        throw new mutall_error(`Axes of zone '${zone.id}' with values '${String(naxis)}' 
            and zone '${this.id}' with values '${String(thisaxis)}' 
            do not interlock in the '${dim}' dimension, i.e., there is
            asymmetric difference of ${diff}`);
    }
    //Returns the asymmetric difference between 2 sets
    get_difference(setA, setB) {
        const difference = new Set();
        for (const elem of setA) {
            if (!setB.has(elem)) {
                difference.add(elem);
            }
        }
        for (const elem of setB) {
            if (!setA.has(elem)) {
                difference.add(elem);
            }
        }
        return difference;
    }
    //Show the cells of this homozone
    async show() {
        //
        //Initialize the size
        this.size = await this.get_sizes();
        //
        //Initialize the origin
        this.origin = await this.get_origin();
        //
        //Fill the HTML table trs and tds
        this.fill_html_table();
        //
        //Create and populate the cells with data
        this.populate_shell();
    }
    //Create this homozone's content cells and map them to the tds of the HTML 
    //table element. The number and type of indices/axes of the neigboring
    //zones to the left (i.e, -1) must match those of this homozone. The order
    //of the cells is dictated by the immediate older neighbors. 
    create_cells() {
        //
        //There is an initial value of empty  cells, so cannot start by testing
        //if there is any. This procedure simply updates updates it.
        //
        //Start with an empty result. NB, obj<string> is shown here in its fully 
        //expanded form.
        const result = {};
        //
        //The 2 axes must be defined
        this.axes.forEach((axis, dim) => { if (!axis)
            throw new mutall_error(`The axis in dim '${dim}' is not defined`); });
        //
        //Loop through all the design rows of this homomozone
        for (let r = 0; r < this.axes[0].length; r++) {
            //
            const row = this.axes[0][r];
            //
            //Create a newshell row
            result[row] = {};
            //
            //Loop through all the design columns of this homozone to build the 
            //cell for row/col this position
            for (let c = 0; c < this.axes[1].length; c++) {
                //
                const col = this.axes[1][c];
                //
                const cell = this.build_cell([r, c], [row, col], this.origin);
                result[row][col] = cell;
            }
        }
        //
        //Save and return teh result
        return (this.cells = result);
    }
    //Build a cell at the given coordinates that are relative to the origin of 
    //the parent heterozone. They help to pinpoint the exact coordinates of 
    //the td in the underlying HTML table 
    build_cell(relative, index, origin) {
        //
        //Destructure the relative coordinates of this cell within this homozone
        const [r, c] = relative;
        //
        //Get the underlying table that is defined
        const table = this.get_table();
        //
        //Get the origin of the parent heterozone. It is provided in the input 
        //parameters
        const [r0, c0] = origin;
        //
        //Let r1 and c1 be the absolute coordinates of the required cell
        const r1 = r0 + r;
        const c1 = c0 + c;
        //
        //Get the tr at the absolute row index
        const tr = table.rows[r1];
        //
        //It is an error if the table row cannot be found
        if (tr === undefined)
            throw new mutall_error(`No tr found in row index ${r1} of this zone '${this.id}'`);
        //
        //Get the td at the absolute colum index 
        const td = tr.cells[c1];
        //
        //It is an error if the table cell cannot be found
        if (td === undefined)
            throw new mutall_error(`No td found in row index ${r1} col ${c1} of this zone '${this.id}'`);
        //
        //Use the io type if available; otherwise assume read-only
        const io_type = this.options.io_type ?? 'read_only';
        //
        //Now use this td to create a cell
        const cell = this.create_cell(td, io_type, relative, index);
        //
        //return  the cell
        return cell;
    }
    //This is the default method of creating a cell. zones should override this
    //to create their desired versions. 
    create_cell(td, io, relative, index) {
        //
        //Create a cell
        const Cell = new cell(td, this, io, relative, index);
        //
        //Add the select click even lisener
        Cell.td.addEventListener('click', () => Cell.select());
        //
        //Add teh user defined click event listener, if provided
        if (this.options.onclick)
            Cell.td.addEventListener('click', (evt) => this.options.onclick(Cell, evt));
        //
        //After a cell is created broadcas this, using the matching event listener 
        //if it is available
        if (this.options.oncell_create)
            this.options.oncell_create(Cell);
        //
        return Cell;
    }
    clear_shell() {
        this.populate_shell_with_null();
    }
    //
    //Paint the mother table cell with empty data. This is a shell driven operation
    //that results in a heterozone cells having the appearances they are expected 
    //to have. It is ia s set-attributes operation attributes. The cells that
    //are painted by this operation are accessed using the the same indexing
    //system as the populate
    paint_shell_cells() {
        //
        //Visit all the cells of the shell and paint them to give them with the 
        //desired appearance
        Object.values(this.cells).forEach((x) => Object.values(x).forEach(cell => cell.paint()));
    }
    //
    //Populate the shell table cells with the given data. This is a data driven 
    //operation
    populate_shell() {
        //
        //Update the axes to match the neighbours behind this one, so that her
        //cells can be aligned with those of the neigbours. You may also want
        //to  verify that the cells interlock, i.e, that teh axes have no 
        //symmetric differences
        this.axes = this.update_axes();
        //
        //Create the zone cells and map them to the HTML table cells
        this.cells = this.create_cells();
        //
        //Fetch the data that drives this zone and use it to populate the shell. 
        if (this.driver)
            this.populate_shell_with_data(this.driver);
    }
    //Use the given data to drive the populating of this homozone. NB. Both the 
    //cells and data of are indexed the same way, i.e., they share the same axes
    populate_shell_with_data(data) {
        //
        //Get the cells for this homozone; they must be defined
        const cells = this.myget(this.cells, 'homozone.cells');
        //
        //Let d be the data being displayed
        const d = data;
        //
        //Loop throuh the rows of the data
        for (const r in d) {
            //
            //Get the r'th row
            const row = d[r];
            //
            //Loop throw all the columns of a row
            for (const c in row) {
                //
                //Get the basic value
                const value = row[c];
                //
                //Get the cell indexed by the row  wnd column
                const cell = cells[r][c];
                //
                //If the cell is undefined there is a mistmatch between matrix<cell>
                //and the incoming data
                if (!cell)
                    throw new mutall_error(`The cells object of homozone ${JSON.stringify(this.parent)} does not match the tabulated data. Cell ['${r}']['${c}'] is not found`);
                //
                //Set the cells io value. This is an overidable method
                this.set_cell_value(cell, value);
            }
        }
    }
    //
    //Set the cell's value. This method can be overriden to implement a user defined
    //version    
    set_cell_value(cell, value) {
        //
        //Save the more complex cell value to be accessible from a click event
        cell.value = value;
        //
        //Get the cells io
        const io = cell.io;
        //
        //Get the basic value from the cell's value
        const basic_value = value.value;
        //
        //Set the io's value
        io.value = basic_value;
    }
    //To flatten a data object
    flatten(data) {
        //
        //Start with an empy list of flats
        const result = [];
        //
        //Loop through all teh data rows
        for (const row in data)
            for (const col in data[row])
                result.push([row, col, data[row][col]]);
        //
        return result;
    }
    //
    //If the there is no data, then the it cannot drive the popultae-shell 
    //operation. We need an alternative driver: the structure of this zone
    //so that we can set its contemt to null
    populate_shell_with_null() {
        //
        //A homozone is a set of cells indexed by a row and column id. Cell is a
        //panel that has a td element minimum. NB. The data for this heterozone shares 
        //the same indexing system as the content. See populate_shell_cells methods
        const content = this.cells;
        //
        //Access the cell, so that we can set its io to null
        this.flatten(content).forEach(([r, c, cell]) => cell.io.value = null);
    }
}
//A heterozone models a container for matrices and other zones. Such panels are 
//distinguisehd by the layout property, which spells the position and size of
//the panel in the global table of html table cells
export class heterozone extends zone {
    children;
    //
    //A heterozone has children which are set after the zone is created. It has 
    //a mother, which is a specialized parent. The parent may or may not support 
    //the neigbourhood stategy. If it does, then the coordinate is the locaction 
    //of this zone in the parent's neigbourhood
    constructor(children, parent) {
        //
        super(parent);
        this.children = children;
        //
        //Use the layout to set the parents of the children to this homozone
        this.set_child_parent();
    }
    //Use the layout to set the parents of the children to this homozone
    set_child_parent() {
        //
        //Destructure the layout type for the children
        const layout = this.children;
        //
        //Loop through the layout rows, using athe numeric indexing method
        for (let r = 0; r < layout.length; r++) {
            //
            //Loop through the columns of a the r'th layout row
            for (let c = 0; c < layout[r].length; c++) {
                //
                //The parent of the current child is of the indexed type
                const parent = { index: [r, c], zone: this };
                //
                //Set the child's parant
                this.children[r][c].parent = parent;
            }
        }
    }
    //Showing a heterozone initializes the child cells in 2 phases
    async show() {
        //
        //Get the children of this heterozone
        const childrens = this.children;
        //
        //Phase 1 of initializing the children of a heterozone 
        for (const children of childrens) {
            for (const child of children) {
                //
                //Initialize the size
                child.size = await child.get_sizes();
                //
                //Initialize the origin
                child.origin = await child.get_origin();
            }
        }
        //
        //Initialize the origin
        this.origin = await this.get_origin();
        //
        //Initialize the size
        this.size = await this.get_sizes();
        //
        //Fill the HTML table trs and tds
        this.fill_html_table();
        //
        //Phase 2 of initializing the children of a heterzone 
        for (const children of childrens) {
            for (const child of children) {
                //
                //Populate the cells with data
                child.populate_shell();
            }
        }
    }
    //
    //Paint the mother table cell with empty data. This is a shell driven operation
    //that results in a heterozone cells having the appearances they are expected 
    //to have. It is a set-attributes operation attributes. The cells that
    //are painted by this operation are accessed using the the same indexing
    //system as the populate
    paint_shell_cells() {
        //
        //Let group be the double array of children in this this zone.
        const group = this.children;
        //
        //Visit all the zones in the group and create its cells 
        group.forEach(neigbors => neigbors.forEach(zone => zone.paint_shell_cells()));
    }
    //The size of a heterozone depends on the sizes of her children. It is the 
    //sum  of the sizes for first row or column of the children, depending on the 
    //dimension
    async get_size(dim) {
        //
        //Get the children of this heterozone; they must be available.
        const children = this.myget(this.children, 'heterozone.children');
        //
        //Collect all the zones in the requested dimension
        const zones = dim === 1
            //
            //For width/horizontal, i.e., column dimension, consider the zones 
            //in the first row only
            ? children[0]
            //
            //For height/vertical, i.e., row dimension, consider all the zones 
            //in the first column for all the rows 
            : children.map((_, x) => children[x][0]);
        //
        //Collect all the sizes that match the requested dimension. 
        const sizes = zones.map(zone => this.myget(zone.size, 'zone.size')[dim]);
        //
        //Sum up all the sizes, starting from 0
        const result = sizes.reduce((sum, x) => sum + x, 0);
        //
        //Return the result
        return result;
    }
    //Populate the shell cells of this zone by populating the children
    populate_shell() {
        //
        //Loop through all the child rows
        for (const zones of this.children) {
            //
            //Loop thru all the child columns
            for (const zone of zones) {
                //
                //Now populate the zone
                zone.populate_shell();
            }
        }
    }
    clear_shell() {
        //
        //Get the children of this zone. NB. They are optional
        const children = this.children;
        //
        //Loop through all the child rows
        for (const zones of children) {
            //
            //Loop thru all the child columns
            for (const zone of zones) {
                //
                //Now populate the zone
                zone.clear_shell();
            }
        }
    }
}
//A glade is a more than homozone with a null data source; it has no axes of 
//its own. It derives its size from the neighbours; is size is 1x1 if there are 
//no neigbours . 
export class glade extends zone {
    //
    constructor(parent) {
        //
        super(parent);
    }
    //A zone must be initialized to complete its construction. This is designed
    //to take care of properties that need asyncronous process to initialize.
    async show() {
        //
        //Initialize the size. This is determined using the size of the neighbors.
        //It also depends on where the neigbors are. Neighbors to the left or above
        //this one, i.e., delta = -1, are initialized before this one, so we can 
        //use their size properties. Neighbors to the right or below this one,
        //i.e., delta = +1, are not initialized by this time, so the size can 
        //only be calculated from the the first principles.   
        this.size = await this.get_sizes();
        //
        //Initialize the origin
        this.origin = await this.get_origin();
        //
        //Fill the HTML table trs and tds
        this.fill_html_table();
    }
    //To create cells of a glade table is to create one row and one td with spans
    //that match the sizes
    create_table_cells(rmax, cmax, tbody) {
        //
        //Create a table row, tr
        const tr = tbody.insertRow();
        //
        //Add a row span that is as high as the height of teh zone
        tr.setAttribute('span', String(rmax));
        //
        //Create a table col, td
        const td = tr.insertCell();
        //
        //Add a col span that is as wide as the width of the glade
        tr.setAttribute('span', String(cmax));
    }
    //
    //Initialize the size of a glade. This is determined using the size of the 
    //neighbors. It also depends on where the neigbors are. Neighbors to the left 
    //or above this one, i.e., delta = -1, are initialized before this one, so we can 
    //use their size properties. Neighbors to the right or below of this one,
    //i.e., delta = +1, are not initialized by this time, so the size can 
    //only be calculated from the the first principles.
    async get_size(dim, constraint) {
        //
        //If there is no constraint then look both behind and ahead directions; 
        //otherwise look only in the constrained direction. If you don't, you risk
        //getting into an endless loop
        const directions = constraint === undefined ? [-1, 1] : [constraint];
        //
        //Loop thru all the allowed directions
        for (const direction of directions) {
            //
            //Get the correct neighboring zone in the current direction one. We 
            //ensure the correctness by observing that the neighbor in the 
            //vertical axis is the correct one when we are looking for the 
            //horizontal axis, and vice versa
            let zone = this.get_neighbor(dim === 0 ? 1 : 0, direction);
            //
            //If the zone is defined then return its size, subject to the constraint
            if (zone) {
                //
                //Get the axies of the zone, subject to the direction constraint
                const size = await zone.get_size(dim, direction);
                return size;
            }
        }
        //Its an error if at this pint, size was not found
        throw new mutall_error(`Unable to determine the size of zone '${this.id}'`);
    }
    //A glades size cannot be computed without relying on the neigborhood
    compute_size() {
        throw new mutall_error(`You require neigbours to compute the size of a glade`);
    }
    //A glade has no data assocuated with it
    async get_driver() { return null; }
    //Clearing and populating a glade does nothing, as it has no cells
    populate_shell() { }
    clear_shell() { }
    //Set the attributes of cells in a glade does nothing
    paint_shell_cells() { }
    //A glade has no use for zone cells, so creating them does noting
    create_zone_cells() { }
}
//Modelling a table's td/th cell. Different table matrices may require more 
//specialized variants of this standard cell. crest, crumb, and bodycell are such
//examples.
//
//Is there any structural difference between the th and td apart from styling?
export class cell extends view {
    td;
    parent;
    io_type;
    relative;
    index;
    //
    //The initial value of a cell is defined to be null
    value = { value: null };
    //
    //A cell has an io to support data entry
    io;
    //
    //The HTML element that provides the visual cue within a cell.  
    constructor(td, parent, io_type, 
    //
    //The following 2 coordinates allow us to access data that are associated 
    //with with axes values. E.g., labeling iformation for data loading
    //
    //The relative coordinates of this cell within the parent homozone
    relative, 
    //
    //The row and column indices of this cell in the cells object of the 
    //parent homozone
    index) {
        super();
        this.td = td;
        this.parent = parent;
        this.io_type = io_type;
        this.relative = relative;
        this.index = index;
        //
        //Define an anchor for the io
        const anchor = { element: td, page: parent };
        //
        //Compile this cell's io options
        //
        //Create an io of the requested type, passing the onblur event istener
        this.io = io.create_io(anchor, io_type);
        //
        //Add the onblur event listener to the io's proxy input element
        //
        //Get the onblur listener of this cell from the parent; it may me absent
        const onblur = this.parent.options.onblur;
        //
        //If the onblur lister exists, and a io proxy is available, then use 
        //teh event this cell
        if (onblur && this.io.proxy)
            this.io.proxy.onblur = () => onblur(this);
    }
    //Paint a cell so that it has the visual look it is expected to have. This 
    //means getting her attributes and applying them
    paint() {
        //
        //Get the attributes of this cell
        const a = this.get_attributes();
        //
        //Set the attributes
        this.set_attributes(a);
    }
    //Return an empty list of attributes. The user overrides this to define their
    //own version
    get_attributes() {
        return {};
    }
    //Setting the attributes of a panel is achieved by changing the properties 
    //of the various components, notably the proxy, so that we can achieve the 
    //desired visual effect effect.
    set_attributes(attr) {
        //
        //If there are no available attributes, return immediately
        if (attr === undefined)
            return;
        //
        //If the attribute's key is a text content, then set that of the proxy
        if (attr.textContent !== undefined)
            this.td.textContent = attr.textContent;
        //
        //The classname to set is that of the proxy
        if (attr.className !== undefined)
            this.td.classList.add(attr.className);
        //
        //The colspan to set is that of the proxy, if it is an isnatnce of a td
        if ((attr.colSpan !== undefined) && this.td instanceof HTMLTableCellElement)
            this.td.colSpan = attr.colSpan;
        //
        //Get ready to fix the left and right margin panels by availing the
        //the left and right bounding positions
        ['left', 'right'].forEach(side => this.fix_panel(attr, side));
        //
        //Set the io type for this element
        if (attr.io !== undefined)
            io.create_io({ element: this.td, page: this.parent }, attr.io);
        //
        //Set the id to that of the proxy
        if (attr.id !== undefined)
            this.td.id = attr.id;
    }
    //Get ready to fix the left and right margin panels by availing the
    //the left and right bounding rectangle positions
    fix_panel(attr, side) {
        //
        //Return if left or right is not defined
        if (attr[side] === undefined)
            return;
        //
        //Set the left pr right styling
        switch (side) {
            case 'left':
                this.td.style.left = `${this.td.getBoundingClientRect().left}px`;
                break;
            case 'right':
                this.td.style.right = `${this.td.getBoundingClientRect().right}px`;
                break;
            default:
                throw new mutall_error(`Side '${side}' not known`);
        }
        //
        //Classify the element as a left or right side. This will helps in fixing 
        //the left or right hand margins
        this.td.classList.add(side);
        //
        //Let the elements come to the fore. This is not working!
        this.td.style.zIndex = '10';
    }
    //Select this cell and its associated  row
    select() {
        //
        //Save this as the current selected cell of the parent homozone
        this.parent.cell = this;
        //
        //Get the td, the table cell element
        const td = this.td;
        //
        //Get the underlying table of this cell. NB. The parant of a cell is a
        //homozone
        const table = this.parent.get_table();
        //
        //Remove all selections from the underlying table
        //
        //Get all tthe selections from the table
        const selections = table.querySelectorAll('.selected');
        //
        //Clear the current selections 
        selections.forEach(s => s.classList.remove('selected'));
        //
        //Add a cell celll selection
        td.classList.add('selected');
        //
        //Select the parent row as well
        const tr = td.parentElement;
        //
        if (tr instanceof HTMLTableRowElement)
            tr.classList.add('selected');
    }
}
