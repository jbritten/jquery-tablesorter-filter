This tablesorterFilter plugin extends the jQuery TableSorter plugin (http://tablesorter.com), written by Christian Bach, and provides the ability to search the table and filter the results.

USAGE / EXAMPLE

<script type="text/javascript">
    jQuery(document).ready(function() {
        $("#myTable")
        .tablesorter({debug: false, widgets: ['zebra'], sortList: [[0,0]]})
        .tablesorterFilter({filterContainer: "#filter-box",
                            filterClearContainer: "#filter-clear-button",
                            filterColumns: [0]});
    });
</script>

Search: <input name="filter" id="filter-box" value="" maxlength="30" size="30" type="text">
<input id="filter-clear-button" type="submit" value="Clear"/>

<table id="myTable">
<thead>
<tr>
    <th>Last Name</th>
    <th>First Name</th>
    <th>Email</th>
    <th>Web Site</th>
</tr>
</thead>
<tbody>
<tr>
    <td>Smith</td>
    <td>John</td>
    <td>jsmith@gmail.com</td>
    <td>http://www.jsmith.com</td>
</tr>
<tr>
    <td>Doe</td>
    <td>Jason</td>
    <td>jdoe@hotmail.com</td>
    <td>http://www.jdoe.com</td>
</tr>
</tbody>
</table>


CONFIGURATION

tablesorterFilter takes up to six parameters:

    * filterContainer - (optional) The DOM id of the input box where the user will type the search string. The default is "#filter-box".
    * filterClearContainer - (optional) The DOM id of the button (or image, ...) which will clear the search string and reset the table to it's original, unfiltered state. The default is "#filter-clear-button".
    * filterColumns - (optional) An array of columns, starting at 0, which will be searched. The default is null so all columns will be searched.
    * filterCaseSensitive - (optional) Boolean stating whether the search string is case sensitive. The default is false.
    * filterWaitTime - (optional) Time after last key press to start filtering. The default is 500 (milliseconds).
    * filterFunction - (optional) Custom function to filter by column text. The default is the plugin function has_words.

You may provide multiple filters, i.e.: .tablesorterFilter( { filterColumns: [0, 1] },
                                                            { filterContainer: "#filter-box-date", filterColumns: [2], filterFunction: filterByDate } )
Please note that you always have to use only one .tablesorterFilter() call, in this example with 2 object parameters.

Search words are separated by spaces, words with a leading dash will be excluded.
Example: "include -exclude" will filter for all rows which do contain the (partitial) word "include" but at the same time do not contain the word "exclude".

You may filter programmatically: $("#filter-box").trigger("keyup").


REQUIREMENTS

jQuery version 1.2.1 or higher and a slightly modified jquery.tablesorter.js version 2.0.3.  Both are included in this repo.


LICENSE

tablesorter_filter is (c) 2008 Justin Britten (justinbritten at gmail dot com) and is dual licensed under the MIT and GPL licenses.

