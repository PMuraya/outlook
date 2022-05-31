<?php
//Page for Capturing Water Readings
//
//Include the local Services PHP library and all her ancestors
// require_once 'mutall_rental.php';
//
//Create a new instance of a payment to drive this page
// $wreading_record = new wreading_record();
?>

<html>
    <head>
        <title>Reading</title>
        
        <!-- Make the page phone sensitive -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Style all Buis pages have the same theme-->
        <link id="mutall.css" rel="stylesheet" type="text/css" href="../library/mutall.css"/>
        
        <!-- Local style-->
        <link id="wreading_record.css" rel="stylesheet" type="text/css" href="wreading_record.css"/>
        
        <!-- Include the Services Javascript library and all her ancestors-->
        <script id='library.js' src="../library/library.js"></script>
        
        <!--Use the local services (before sharing them)-->
        <script id='services.js' src="mutall_rental.js"></script>

        <!--Interface between PHP to Javascript objects-->
        <script id='interface'>
            var wreading_record = new wreading_record(<?php echo $wreading_record; ?>);
            //
            //Debug
            //console.log(wreading_record);
        </script>
    </head>
     
    <!-- Properties of water reading that make reference to elements defined in 
    this page are only meaningfully instantiated on page load. Otherwise
    they will be incomplete -->
    <body>
        
        <!-- 
        Show the date water column. It is the reference date for computing 
        previous readings. When changed, it is changes the last reading
       -->
        <label>Date of Reading:
            <input
                id='date'
                type="date"
                value="<?php echo $wreading_record->current_date;?>"
                onchange='wreading_record.last_reading.onchange()'
                />
        </label>

        <!--
        Show the water meter. On click, it edits the meter. On changing, it
        changes the last reading-->
        <label> Water Meter:
            <input
                id="wmeter"
                type="button"
                value="<?php echo $wreading_record->wmeter;?>"
                onclick='wreading_record.wmeter.edit()'
                onchange='wreading_record.last_reading.onchange()'
                />
        </label>

        <!--The last reading value and date are filled in by show last 
        reading-->
        <label> Last Reading:
            <input
                id="last_reading"
                type="text"
                disabled="true"
                size="10"
                value="<?php echo $wreading_record->last_wreading;?>"
                onchange='wreading_record.retrieve_last_reading()'
                />
            &nbsp; on &nbsp;
            <span id='last_date'><?php echo $wreading_record->last_wreading->date;?></span>
        </label>

        <!-- 
        Show the current water reading value. On changing, it changes the 
        consumption-->
        <label>Current Reading:
            <input
                id="current_reading"
                type="number"
                size="10"
                value="<?php echo $wreading_record->current_wreading;?>"
                oninput="wreading_record.consumption.onchange()"
                />
        </label>

        <!--Show the consumption. When the consuption changes it performs 
        calculations -->
        <label>Consumption:
            <input
                id="consumption"
                disabled="true"
                class ="<?php echo $wreading_record->consumption->status;?>"
                type="number"
                size="5"
                value="<?php echo $wreading_record->consumption->value;?>"
                onchange='wreading_record.calculate_consumption()'
                />
        </label>

        <!-- Save the collected values to the database and clear the screen 
        ready for for input-->
        <label>    
            <input
                id="save"
                type="button"
                value="Save and Clear"
                onclick='wreading_record.save_values()'
                >
        </label>
        
        <!-- Indicate if this is an update or not; by default it is not. Note
        how the value is transferred directlry-->
        <label>Update an earlier record
            <input
                id="update"
                type="checkbox"
                onclick='wreading_record.update = this.value'
                >
        </label>
        
         <!-- Navigate to the water readings page -->
         <a href="wreading.php?dbname=mutallco_rental">View Water Readings</a>
         
        <!-- This tag is needed for reporting mutall errors. On clicking
            clear the error--> 
            <p id='error' onclick='this.innerHTML=""'></p>
    </body>

</html>
