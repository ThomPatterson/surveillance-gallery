const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

//to begin, assume the remote directory is mounted locally on this machine
let dvrWorkDir = '/Volumes/backyard-ptz';

//also assuming there is only one camera
let jpgDir = '/001/jpg';

//store jpg paths in multi dimension array, [date][hour][minute] = [paths]

function getAvailableDates() {
	let data = {};
	return new Promise((resolve, reject) => {
		fs.readdir(dvrWorkDir, (err, fileNames) => {

			if (err) reject('Unable to read directory ' + dvrWorkDir + '  ' + err);

			let datePattern = /[\d]{4}-[\d]{2}-[\d]{2}/

			fileNames.forEach(fileName => {
				if (datePattern.test(fileName)) {
					data[fileName] = {};
				}
			});

			resolve(data);
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

					if (err) rej('Unable to read directory ' + dateDir + '  ' + err);

					fileNames.forEach(fileName => {
						data[keyDate][fileName] = {}
					});

					res();

				});
			}));
		}

		Promise.all(promises).then(() => {
			//console.log("in hour resolving");
			//console.log(data);
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
				let dir = path.join(dvrWorkDir, date, jpgDir, hour);

				promises.push(new Promise((res, rej) => {
					let keyDate = date;
					let keyHour = hour;

					fs.readdir(dir, (err, fileNames) => {

						if (err) rej('Unable to read directory ' + dir + '  ' + err);

						fileNames.forEach(fileName => {
							data[keyDate][keyHour][fileName] = [];
						});

						res();
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
					let dir = path.join(dvrWorkDir, date, jpgDir, hour, minute);

					promises.push(new Promise((res, rej) => {
						let keyDate = date;
						let keyHour = hour;
						let keyMin = minute;

						fs.readdir(dir, (err, fileNames) => {

							if (err) rej('Unable to read directory ' + dir + '  ' + err);

							fileNames.forEach(fileName => {
								data[keyDate][keyHour][keyMin].push(path.join(dir, fileName));
							});

							res();
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

let galleryTemplate;
getTemplate()
	.then(templateSrc => {
    galleryTemplate = Handlebars.compile(templateSrc);
		return getAvailableDates();
	})
	.then(data => {
		return getAvailableHours(data);
	})
	.then(data => {
		return getAvailableMinutes(data);
	})
	.then(data => {
		return getAvailableSnapshots(data);
	}).then(data => {
		let html = galleryTemplate({date: data});
		console.log(html);
	}).catch(err => {
		console.error(err);
	});
