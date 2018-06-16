const Discord = require("discord.js");
const https = require("https");
const authKey = require("./auth.json");

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('All systems nominal.');
});

bot.on('message', msg => {
	if(msg.author.bot) {
		return;
	} else {
		const prefix = "!";
		const hasPrefix = msg.content.startsWith(prefix);
		if(!hasPrefix) {
			return;
		} else {
			var cmd = msg.content.match(/^!(jarl)\s(\S+)/);
			console.log(cmd);
			if(cmd) {
				var username = cmd[2];
				https.get("https://leaderboard.isengrim.org/api/usernames/"+username, (resp) => {
					let data = '';

					resp.on('data',(chunk) => {
						data += chunk;
					});

					resp.on('end', () => {
						var message = "";
						//console.log(JSON.parse(data));
						data = JSON.parse(data);
						for (var key in data) {
							message += '**'+key+':** ' + data[key] + '\n'; 
						}
						msg.channel.send(message);
					});
				}).on("error",(err) => {
					console.log("Error: " + err.message);
				});
			}
		}
	}
});

bot.login(authKey.token);