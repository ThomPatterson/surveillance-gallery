const path = require('path');
const fs = require('fs');
const moment = require('moment');

/*
         YYYY-MM-DD   HH  Array of objects for that hour
results['2018-05-31'][19][{filename:<filename>, datetime: <datetime>},...]
*/
var results;

function findFilesInDir(startPath, filter, earliestDateMs) {

  if (!fs.existsSync(startPath)) {
    console.log("directory unavailable: ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory() && stat.ctimeMs > earliestDateMs) {
      findFilesInDir(filename, filter, earliestDateMs); //department of redundancy department
    } else if (filename.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
      addFileToResults(filename, stat);
    }
  }
}

function addFileToResults(filename, stat) {
  var date = moment(stat.ctimeMs);
  let dateStr = date.format('YYYY_MM_DD');
  let hourStr = 'h' + date.format('HH');

  if (!results.hasOwnProperty(dateStr)) { //this date isn't already in results
    results[dateStr] = {}
  }

  if (!results[dateStr].hasOwnProperty(hourStr)) { //this hour isn't already in results
    results[dateStr][hourStr] = [];
  }

  results[dateStr][hourStr].push({
    filename,
    datetime: stat.ctimeMs
  });

}

module.exports = function(startDir, ext, daysToFetch) {
  results = [];
  let now = new Date();
  now.setHours(23,59,59,999);//today at midnight
  let timeLimit = daysToFetch * 24 * 60 * 60 * 1000;
  let earliestDate = now - timeLimit;
  findFilesInDir(startDir, ext, earliestDate);
  return results;
}
