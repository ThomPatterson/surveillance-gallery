//set daysToFetch to 1 to just get today's snapshots
//set to 2 to get yesterday and today, etc.
//set to something like 999999 to get all available days

module.exports = [
  {
    name: "Breezeway",
    directory: "/Volumes/surveillance-breezeway",
    fileExt: '.jpg',
    daysToFetch: 7
  },{
    name: "Driveway",
    directory: "/Volumes/surveillance-driveway",
    fileExt: '.jpg',
    daysToFetch: 7
  },{
    name: "Backyard",
    directory: "/Volumes/surveillance-backyard",
    fileExt: '.jpg',
    daysToFetch: 7
  }
]
