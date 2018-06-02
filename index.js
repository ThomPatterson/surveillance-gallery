const fs = require('fs');
const path = require('path');
const childProc = require('child_process');
const Handlebars = require('handlebars');

const fileFinder = require('./fileFinder.js');
const registerHelpers = require('./hbsHelpers.js');
const config = require('./config.js');

let galleryTemplate;


function getTemplate() {
  return new Promise((resolve, reject) => {
    fs.readFile('./gallery.hbs', (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    })
  });
}

function writeHtml(html, name) {
  return new Promise((resolve, reject) => {
    let filePath = 'output/' + name + '.html';
    fs.writeFile(filePath, html, function(err) {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
}

function recProcessFiles(configIndex) {
  if (configIndex < config.length) {
    let location = config[configIndex];
    let files = fileFinder(location.directory, location.fileExt, location.daysToFetch);
    let html = galleryTemplate({
      name: location.name,
      files
    });
    writeHtml(html, location.name).then(filePath => {
      let cmd = 'open -a "Google Chrome" "file://' + __dirname + '/' + filePath + '"';
      childProc.exec(cmd);
      recProcessFiles(configIndex+1);
    }).catch(err => {
      console.error(err);
    });
  }
}

function processFiles() {
  recProcessFiles(0);
}

getTemplate()
  .then(templateSrc => {
    registerHelpers();
    galleryTemplate = Handlebars.compile(templateSrc);
    processFiles();
  }).catch(err => {
    console.error(err);
  });
