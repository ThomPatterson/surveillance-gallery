# dahua-event-viewer
Recursively scan a directory to find all files with a specified extension (e.g. jpg) and build an image gallery from the results, sorted by day and by hour.

Modify config.js to include the path to the directory.

Execute with `node index.js`

Assumptions:
* directories are locally mounted
* you are running on a Mac
* you have Chrome installed

Rewrite this to reflect new express.js approach
also mention that you can start by passing in config as an ENV.  for example

```
CONFIG=[{\"name\":\"Backyard\",\"directory\":\"/Users/thom/Desktop/local-backyard-copy\",\"fileExt\":\".jpg\",\"daysToFetch\":4}] node index.js
```

# Examples of the galleries created
![Main Gallery View](/example1.png?raw=true "Main Gallery View")
![Single Photo View](/example2.png?raw=true "Single Photo View")
