const Discord = require("discord.js");
const https = require("https");
const config = require("./auth.json");

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

		let requestUrl = "https://leaderboard.isengrim.org/api/usernames/"+username;
		if(season != null) requestUrl += '/seasons/'+season;

		https.get(requestUrl, (resp) => {
			let data = '';

			resp.on("data",(chunk) => {
				data += chunk;
			});

			resp.on("end",() => {
				let stats = '';
				data = JSON.parse(data);
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
});

bot.login(config.token);