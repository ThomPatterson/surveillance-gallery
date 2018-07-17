const express = require('express');
const app = express();
const path = require('path');
const config = process.env.hasOwnProperty('CONFIG') ? JSON.parse(process.env.CONFIG) : require('./config.js');
const galleryBuilder = require('./galleryBuilder.js');

config.forEach(location => {
  //create gallery endpoint
  app.get('/'+location.name.toLowerCase(), (req, res) => {
    galleryBuilder(location).then(html => {
      res.send(html);
    });
  });

  //create static proxy for images
  app.use(`/images/${location.name.toLowerCase()}`, express.static(location.directory, {
    setHeaders: res => {
      res.setHeader('Cache-Control', 'public, max-age=3600')
    }
  }));

  //inform the caller of the url
  console.log(`http://localhost:8080/${location.name.toLowerCase()}`);
});


app.get('/', (req, res) => {
  let html = config.map(location => `<a href='/${location.name.toLowerCase()}'>${location.name}</a>`);
  res.send(html.join('<br>'));
});


app.use('/gallery-resources', express.static('gallery-resources'));


app.listen(8080);
