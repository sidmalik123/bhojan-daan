'use strict'

function getDate(timestamp){
	var date = new Date(timestamp);
	var month = date.getMonth() + 1;
	var year = date.getFullYear()%100;
	var day = date.getDate();

	return ''+day+'/'+month+'/'+year;

}

function getTime(timestamp) {
  var date = new Date(timestamp)
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

module.exports.getDate = getDate;
module.exports.getTime = getTime;