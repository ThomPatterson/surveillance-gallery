const fs = require('fs');
const path = require('path');
const childProc = require('child_process');
const Handlebars = require('handlebars');

const fileFinder = require('./fileFinder.js');
const registerHelpers = require('./hbsHelpers.js');

//to begin, assume the remote directory is mounted locally on this machine
let dvrWorkDir = '/Volumes/surveillance-breezeway';

let fileExt = '.jpg';

//also assuming there is only one camera
let jpgDir = '/001/jpg';

//set to 1 to just get today's snapshots
//set to 2 to get yesterday and today, etc.
//set to something like 999999 to get all available days
let daysToFetch = 2;

//array of filenames to ignore
let ignoreFiles = ['.DS_Store']

//store jpg paths in multi dimension array, [date][hour][minute] = [paths]

//TODO
//using hours and minutes (str) as object keys results in sorting where 10, 20, 30, etc come before 00, 01.  Resorted to prefixing time with letter.




function getTemplate() {
  return new Promise((resolve, reject) => {
    fs.readFile('./gallery.hbs', (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    })
  });
}

function writeHtml(html) {
  return new Promise((resolve, reject) => {
    let filePath = 'output/gallery.html';
    fs.writeFile(filePath, html, function(err) {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
}




/*
let galleryTemplate;
getTemplate()
  .then(templateSrc => {
    galleryTemplate = Handlebars.compile(templateSrc);
    return getAvailableDates();
  })
  .then(data => {
    let filteredDates = filterDates(data, daysToFetch);
    return getAvailableHours(filteredDates);
  })
  .then(data => {
    return getAvailableMinutes(data);
  })
  .then(data => {
    return getAvailableSnapshots(data);
  }).then(data => {
    let html = galleryTemplate({
      date: data
    });
    return writeHtml(html);
  }).then(filePath => {
    let cmd = 'open -a "Google Chrome" "file://' + __dirname + '/' + filePath + '"';
    childProc.exec(cmd);
  }).catch(err => {
    console.error(err);
  });

  */

let files = fileFinder(dvrWorkDir, fileExt, daysToFetch);

getTemplate()
  .then(templateSrc => {
    registerHelpers();
    let galleryTemplate = Handlebars.compile(templateSrc);
    let html = galleryTemplate(
      files
    );
    return writeHtml(html);
  }).then(filePath => {
    let cmd = 'open -a "Google Chrome" "file://' + __dirname + '/' + filePath + '"';
    childProc.exec(cmd);
  }).catch(err => {
    console.error(err);
  });
