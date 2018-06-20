const Discord = require("discord.js");
const https = require("https");
const config = require("./auth.json");
const fs = require("fs");

var mechIDs = {};

const bot = new Discord.Client();

bot.on("ready", () => {
	console.log('All systems nominal.');
	bot.user.setActivity('!jarl [name] for epeen measurement', { type: 'PLAYING' });
});

bot.on("message", msg => {
	if(msg.author.bot) return;
	if(msg.content.indexOf(config.prefix) !== 0) return;

	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "jarl") {
		let season = args.join().split('-s')[1] || null;
		let username = season === null ? args.join(' ') : args.slice(0,-1).join(' ');

		let requestUrl = 'https://leaderboard.isengrim.org/api/usernames/'+username;
		if(season != null) requestUrl += '/seasons/'+season;

		https.get(requestUrl, (resp) => {
			let data = '';

			resp.on("data",(chunk) => {
				data += chunk;
			});

			resp.on("end",() => {
				let stats = '';
				data = JSON.parse(data);
				console.log(data);
				for (var key in data) {
					if(key === 'Rank' && data[key] === 0) {
						data[key] = 'Retired';
					}
					stats += '**'+key+'** ' + data[key] + '\n';
				}
				msg.channel.send(stats);
			});
		}).on("error",(err) => {
			console.log('Error: ' + err.message);
		});
	}

	if(command === "smurfy") {
		let requestedMech = args.toString().toLowerCase();
		console.log(requestedMech);
		let requestUrl = 'https://mwo.smurfy-net.de/api/data/mechs.json';

		https.get(requestUrl, (resp) => {
			let data = '';

			resp.on("data",(chunk) => {
				data += chunk;
			});

			resp.on("end",() => {

				data = JSON.parse(data);
				console.log(data[1]['name']);
				//console.log(Object.keys(data['name']));

				for (var i = 1, len = 711; i<len; i++) {
					if(data[i]) {
						mechIDs[i] = data[i]['name'];
					}
				};

				fs.writeFile('test.txt',JSON.stringify(mechIDs), function(err){
					if(err) {
						console.log(err);
					}
				});

				// function findArr(arr, value) {
				// 	for (var i = 1, len = Object.keys(arr).length; i<len; i++) {
				// 		console.log(arr[i]);
				// 		if (arr[i]['name'] == value) return arr[i];
				// 	};
				// 	return false;
				// }

				// let selectedMech = findArr(data, requestedMech);
				// let hardpoints = '';
				// if(selectedMech) {
				// 	for (var key in selectedMech['details']['hardpoints']) {
				// 		hardpoints += '**'+key+'** ' + selectedMech['details']['hardpoints'][key] + '\n';
				// 	}
				// 	msg.channel.send(hardpoints);
				// }
			}).on("error",(err) => {
				console.log('Error: ' + err.message);
			});
		});
	}
});

bot.login(config.token);