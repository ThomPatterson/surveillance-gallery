# surveillance-gallery
Recursively scan a directory to find all files with a specified extension (e.g. jpg) and build an image gallery from the results, sorted by day and by hour.

Modify config.js to include the path to the directory.

Execute with `node index.js`

Creates web server and listens on port 8080 to serve up a gallery for each location specified in the config.  

See [surveillance-gallery](https://hub.docker.com/r/thompatterson/surveillance-gallery/) on Docker Hub to run this project in a container.


# Examples of the galleries created
![Main Gallery View](/example1.png?raw=true "Main Gallery View")
![Single Photo View](/example2.png?raw=true "Single Photo View")
