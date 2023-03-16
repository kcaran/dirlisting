'use strict';

const today = Date.now();
const recent = (180 * 24 * 60 * 60 * 1000);
const old_date = new Intl.DateTimeFormat( 'en-us', { month: 'short',
	day: '2-digit', year: 'numeric' } );
const new_date = new Intl.DateTimeFormat( 'en-us', { month: 'short',
	day: '2-digit', hour: '2-digit', minute: 'numeric', hour12: false } );
const fields = { N : 2, M : 3, S : 4, D : 5 };

function convert_date( timestamp ) {
  var ts = Date.parse( timestamp );
  if (!ts) {
    return timestamp;
   }
  var date = new Date( ts );
  var date_parts;
  if (today - ts > recent) {
    date_parts = old_date.formatToParts( date );
   }
  else {
    date_parts = new_date.formatToParts( date );
    // Combine hour and minute
    date_parts[4].value = date_parts[4].value + ':' + date_parts[6].value;
   }
  var formatted = '<div class="date"><span>' + date_parts[0].value + '</span><span>' + date_parts[2].value + '</span><span>' + date_parts[4].value + '</span></div>';

  return formatted;
 }

document.addEventListener('DOMContentLoaded', function () {

// Convert date to Linux dir listing format
document.querySelectorAll( 'td:nth-child(3)' ).forEach( (item) => {
  item.innerHTML = convert_date( item.textContent );
});

// Add additional descriptions
document.querySelectorAll( 'td:nth-child(5)' ).forEach( (item) => {
  if (item.textContent.match( /^\s*$/ )) {
    let filename = item.parentElement.childNodes[1].textContent;
    let suffix = filename.match( /\.(.*)$/ );
    if (suffix) {
      item.innerHTML = suffix[1].toUpperCase() + ' file';
    }
  }
});

// Make entire row a link to the file
document.querySelectorAll( 'tr' ).forEach( (item) => {
  item.addEventListener('click', (event) => {
	window.location = event.currentTarget.innerHTML.match( /href="([^"]+)"/ )[1];
  });
});

// Add sorting caret
var sort = window.location.search.match( /C=(\w).O=(\w)/ );
if (sort) {
  let sortclass = (sort[2] === 'A') ? 'asc' : 'desc';
  document.querySelector( 'table tr:first-child th:nth-child(' + fields[ sort[1] ] + ') a' ).classList.add( sortclass );
 }

}, false );
