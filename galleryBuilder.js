const fs = require('fs');
const Handlebars = require('handlebars');
const fileFinder = require('./fileFinder.js');
const registerHelpers = require('./hbsHelpers.js');

let galleryTemplate;

function getTemplate() {
  return new Promise((resolve, reject) => {
    fs.readFile('./gallery.hbs', (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    })
  });
}

function processFiles(location) {
  let files = fileFinder(location.directory, location.fileExt, location.daysToFetch);
  let html = galleryTemplate({
    name: location.name,
    origDir: location.directory,
    files
  });
  return html;
}

module.exports = location => {
  return new Promise((resolve, reject) => {
    getTemplate()
      .then(templateSrc => {
        registerHelpers();
        galleryTemplate = Handlebars.compile(templateSrc);
        return resolve(processFiles(location));
      }).catch(err => {
        console.error(err);
        return reject(err);
      });
  });
}
