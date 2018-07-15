const express = require('express');
const app = express();
const path = require('path');
const config = require('./config.js'); //eventually try loading this from ENV var first
const galleryBuilder = require('./galleryBuilder.js');

config.forEach(location => {
  //create gallery endpoint
  app.get('/'+location.name.toLowerCase(), (req, res) => {
    galleryBuilder(location).then(html => {
      res.send(html);
    });
  });

  //create static proxy for images
  app.use(`/images/${location.name.toLowerCase()}`, express.static(location.directory));

  //inform the caller of the url
  console.log(`http://localhost:8080/${location.name.toLowerCase()}`);
});


app.use('/gallery-resources', express.static('gallery-resources'));

app.listen(8080);


//http://localhost:8080/12/00/06/25[M][0@0][0].jpg
