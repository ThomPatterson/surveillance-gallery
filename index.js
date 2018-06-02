const fs = require('fs');
const path = require('path');
const childProc = require('child_process');
const Handlebars = require('handlebars');
const moment = require('moment');

//to begin, assume the remote directory is mounted locally on this machine
let dvrWorkDir = '/Volumes/surveillance-backyard';

//also assuming there is only one camera
let jpgDir = '/001/jpg';

//set to 1 to just get today's snapshots
//set to 2 to get yesterday and today, etc.
//set to something like 999999 to get all available days
let daysToFetch = 7;

//array of filenames to ignore
let ignoreFiles = ['.DS_Store']

//store jpg paths in multi dimension array, [date][hour][minute] = [paths]

//TODO
//using hours and minutes (str) as object keys results in sorting where 10, 20, 30, etc come before 00, 01.  Resorted to prefixing time with letter.

Handlebars.registerHelper('Date', (dateStr) => {
  var date = moment(dateStr);
  return date.format('ddd, MMMM DD, YYYY');
});

Handlebars.registerHelper('Hour', (hour) => {
  var hourInt = parseInt(hour.slice(1));
  let period = 'AM';
  if (hourInt > 12) {
    hourInt = hourInt - 12;
    period = 'PM';
  }
  let retStr = hourInt + ':00 ' + period;
  if (hourInt == 0) {
    retStr = 'Midnight';
  } else if (hourInt == 12) {
    retStr = 'Noon';
  }
  return retStr
});

Handlebars.registerHelper('ImageCountDay', (dayData) => {
  let count = 0;
  for (hourData in dayData) {
    for (minute in dayData[hourData]) {
      count += dayData[hourData][minute].length;
    }
  }
  return count;
});

Handlebars.registerHelper('ImageCountHour', (hourData) => {
  let count = 0;
  for (minute in hourData) {
    count += hourData[minute].length;
  }
  return count;
});

Handlebars.registerHelper('Timestamp', (filePath) => {
  let timeParts = /([\d]{2})\/([\d]{2})\/([\d]{2})([^/]+)\.jpg/.exec(filePath);
  let hourInt = parseInt(timeParts[1]);
  let min = timeParts[2];
  let sec = timeParts[3];
  let period = 'AM';
  if (hourInt > 12) {
    hourInt = hourInt - 12;
    period = 'PM';
  } else if (hourInt == 12) {
    period = 'PM';
  }
  return hourInt + ':' + min + ':' + sec + ' ' + period;
});

function getAvailableDates() {
  let data = {};
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(dvrWorkDir)) return reject(dvrWorkDir + ' is unavailable');

    fs.readdir(dvrWorkDir, (err, fileNames) => {

      if (err) return reject('Unable to read directory ' + dvrWorkDir + '  ' + err);

      let datePattern = /[\d]{4}-[\d]{2}-[\d]{2}/

      fileNames.forEach(fileName => {
        if (datePattern.test(fileName)) {
          data[fileName] = {};
        }
      });

      return resolve(data);
    })
  });
}

function getAvailableHours(data) {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (date in data) {
      let dateDir = path.join(dvrWorkDir, date, jpgDir);

      promises.push(new Promise((res, rej) => {
        let keyDate = date;
        fs.readdir(dateDir, (err, fileNames) => {

          if (err) return rej('Unable to read directory ' + dateDir + '  ' + err);

          fileNames.forEach(fileName => {
            if (!isIgnoredFile(fileName)) data[keyDate]['h' + fileName] = {}
          });

          return res();

        });
      }));
    }

    Promise.all(promises).then(() => {
      return resolve(data);
    }).catch(err => {
      return reject(err);
    });
  });
}

function getAvailableMinutes(data) {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (date in data) {
      for (hour in data[date]) {
        let dir = path.join(dvrWorkDir, date, jpgDir, hour.slice(1));

        promises.push(new Promise((res, rej) => {
          let keyDate = date;
          let keyHour = hour;

          fs.readdir(dir, (err, fileNames) => {

            if (err) return rej('Unable to read directory ' + dir + '  ' + err);

            fileNames.forEach(fileName => {
              if (!isIgnoredFile(fileName)) data[keyDate][keyHour]['m' + fileName] = [];
            });

            return res();
          });

        }));
      }
    }

    Promise.all(promises).then(() => {
      return resolve(data);
    }).catch(err => {
      return reject(err);
    });
  });
}

function getAvailableSnapshots(data) {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (date in data) {
      for (hour in data[date]) {
        for (minute in data[date][hour]) {
          let dir = path.join(dvrWorkDir, date, jpgDir, hour.slice(1), minute.slice(1));

          promises.push(new Promise((res, rej) => {
            let keyDate = date;
            let keyHour = hour;
            let keyMin = minute;

            fs.readdir(dir, (err, fileNames) => {

              if (err) return rej('Unable to read directory ' + dir + '  ' + err);

              fileNames.forEach(fileName => {
                if (!isIgnoredFile(fileName)) data[keyDate][keyHour][keyMin].push(path.join(dir, fileName));
              });

              return res();
            });

          }));
        }
      }
    }

    Promise.all(promises).then(() => {
      return resolve(data);
    }).catch(err => {
      return reject(err);
    });
  });
}

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

function filterDates(data, days) {
  let filteredDates = {};
  let now = new Date();
  let timeLimit = days * 24 * 60 * 60 * 1000;
  for (date in data) {
    let datePattern = /([\d]{4})-([\d]{2})-([\d]{2})/
    let dateParts = datePattern.exec(date);
    let fileDate = new Date(dateParts[1], dateParts[2] - 1, dateParts[3]);
    if ((now - fileDate) < timeLimit) {
      filteredDates[date] = data[date];
    }
  }
  return filteredDates;
}

function isIgnoredFile(fileName) {
  return (ignoreFiles.indexOf(fileName) > -1);
}

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
