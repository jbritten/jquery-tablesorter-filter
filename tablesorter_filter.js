/*
 * Copyright (c) 2008 Justin Britten justinbritten at gmail.com
 *
 * Some code was borrowed from:
 * 1. Greg Weber's uiTableFilter project (http://gregweber.info/projects/uitablefilter)
 * 2. Denny Ferrassoli & Charles Christolini's TypeWatch project (www.dennydotnet.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */


(function($) {
	$.extend({
		tablesorterFilter: new function() {

			function has_words(str, words, caseSensitive) {
				var text = caseSensitive ? str : str.toLowerCase();

				for (var i=0; i < words.length; i++) {
					if (words[i].charAt(0) == '-') {
						if (text.indexOf(words[i].substr(1)) != -1) return false; // Negated word must not be in text
					} else if (text.indexOf(words[i]) == -1) return false; // Normal word must be in text
				}

				return true;
			}

		
			function doFilter(table, phrase) {
				if(table.config.debug) { var cacheTime = new Date(); }
				
				var phrase_length = phrase.length;
				var caseSensitive = table.config.filterCaseSensitive;
				var words = caseSensitive ? phrase.split(" ") : phrase.toLowerCase().split(" ");
				var columns = table.config.filterColumns;
				var resultRows = [];
				
				var success = function(elem) { 
					elem.show();
					resultRows.push(elem);
				}
				var failure = function(elem) {;}


				if ( columns ) {
					var findStr = "";
					for (var i=0; i < columns.length; i++) {
						findStr += "td:eq(" + columns[i] + "),";
					}

					var search_text = function() {
						var elem = jQuery(this);

						has_words( elem.find(findStr).text(), words, caseSensitive ) ? success(elem) : failure(elem);
					}
				} else {
					var search_text = function() {
						var elem = jQuery(this);

						has_words( elem.text(), words, caseSensitive ) ? success(elem) : failure(elem);
					}
				}
				
				// Walk through all of the table's rows and search.
				// Rows which match the string will be pushed into the resultRows array.
				var allRows = table.config.cache.row;
				
				var allRowsCount = allRows.length;
				for (var i=0; i < allRowsCount; i++) {
					allRows[i].each ( search_text );
				}

				// Clear the table
				$.tablesorter.clearTableBody(table);
				
				// Push all rows which matched the search string onto the table for display.
				var resultRowsCount = resultRows.length;
				for (var i=0; i < resultRowsCount; i++) {
					$(table.tBodies[0]).append(resultRows[i]);
				}
				
				// Update the table by executing some of tablesorter's triggers
				// This will apply any widgets or pagination, if used.
				$(table).trigger("update");
				if (resultRows.length) {
					$(table).trigger("appendCache");
					// Apply current sorting after restoring rows
					$(table).trigger("sorton", [table.config.sortList]);
				}

				if(table.config.debug) { $.tablesorter.benchmark("Apply filter:", cacheTime); }

				// Inform subscribers that filtering finished
				$(table).trigger("filterEnd");

				return table;
			};
			
			function clearFilter(table) {
				if(table.config.debug) { var cacheTime = new Date(); }

				var allRows = table.config.cache.row;
				
				$.tablesorter.clearTableBody(table);
				
				for (var i=0; i < allRows.length; i++) {
					$(table.tBodies[0]).append(allRows[i]);
				}

				$(table).trigger("update");
				$(table).trigger("appendCache");
				// Apply current sorting after restoring all rows
				$(table).trigger("sorton", [table.config.sortList]);

				if(table.config.debug) { $.tablesorter.benchmark("Clear filter:", cacheTime); }
				
				$(table).trigger("filterCleared");

				return table;
			};
				


			this.defaults = {
				filterContainer: '#filter-box',
				filterClearContainer: '#filter-clear-button',
				filterColumns: null,
				filterCaseSensitive: false,
				filterWaitTime: 500
			};
			
			
			this.construct = function(settings) {

				return this.each(function() {	

					config = $.extend(this.config, $.tablesorterFilter.defaults, settings);

					var table = this;

					// Create a timer which gets reset upon every keyup event.
					//
					// Perform filter only when the timer's wait is reached (user finished typing or paused long enough to elapse the timer).
					//
					// Do not perform the filter is the query has not changed.
					//
					// Immediately perform the filter if the ENTER key is pressed.
					
					function checkInputBox(inputBox, override) {
						var value = inputBox.value;

						if ((value != inputBox.lastValue) || (override)) {
							inputBox.lastValue = value;
							doFilter( table, value );
						}
					};

					var timer;
					
					$(config.filterContainer).keyup(function() {
						var timerWait = config.filterWaitTime || 500;
						var overrideBool = false;
						var inputBox = this;

						// Was ENTER pushed?
						if (inputBox.keyCode == 13) {
							timerWait = 1;
							overrideBool = true;
						}

						var timerCallback = function()
						{
							checkInputBox(inputBox, overrideBool)
						}

						// Reset the timer			
						clearTimeout(timer);
						timer = setTimeout(timerCallback, timerWait);				

						return false;
					});
					
					// Avoid binding click event to whole document if no clearContainer has been defined
					if(config.filter[i].filterClearContainer) {
						$(config.filterClearContainer).click(function() {
							clearFilter(table);
							var container = $(config.filterContainer);
							container.val("");
							// Support entering the same filter text after clearing
							container[0].lastValue = "";
							if(container[0].type != 'hidden')
								container.focus();
						});
					}
					
					$(table).bind("doFilter",function() {
						doFilter(table);
					});
					$(table).bind("clearFilter",function() {
						clearFilter(table);
					});
				});
			};

		}
	});
	
	// extend plugin scope
	$.fn.extend({
        tablesorterFilter: $.tablesorterFilter.construct
	});

})(jQuery);			
