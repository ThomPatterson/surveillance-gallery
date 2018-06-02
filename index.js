const fs = require('fs');
const path = require('path');
const childProc = require('child_process');
const Handlebars = require('handlebars');

const fileFinder = require('./fileFinder.js');
const registerHelpers = require('./hbsHelpers.js');

//to begin, assume the remote directory is mounted locally on this machine
let dvrWorkDir = '/Volumes/surveillance-breezeway';

let fileExt = '.jpg';

//set to 1 to just get today's snapshots
//set to 2 to get yesterday and today, etc.
//set to something like 999999 to get all available days
let daysToFetch = 2;


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


getTemplate()
  .then(templateSrc => {
    registerHelpers();
    let galleryTemplate = Handlebars.compile(templateSrc);
    let files = fileFinder(dvrWorkDir, fileExt, daysToFetch);
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
