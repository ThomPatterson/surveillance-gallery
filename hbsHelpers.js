const Handlebars = require('handlebars');
const moment = require('moment');

module.exports = function() {

  Handlebars.registerHelper('eachProperty', function(context, options) {
    //no idea why I need this function, but the built-in each function fails to iterate over this object's keys
    var ret = "";
    for (var prop in context) {
      ret = ret + options.fn({
        property: prop,
        value: context[prop]
      });
    }
    return ret;
  });

  Handlebars.registerHelper('Date', (dateStr) => {
    var date = moment(dateStr, 'YYYY_MM_DD');
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

  Handlebars.registerHelper('Timestamp', (datetime) => {
    return moment(datetime).format('H:mm:ss A');
  });

  Handlebars.registerHelper('ImageCountDay', (dayData) => {
    let count = 0;
    for (hourData in dayData) {
      if (dayData.hasOwnProperty(hourData)) {
        count += dayData[hourData].length;
      }

    }
    return count;
  });

  Handlebars.registerHelper('ImageCountHour', (hourData) => {
    return hourData.length;
  });
}
