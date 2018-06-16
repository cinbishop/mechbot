const Discord = require("discord.js");
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
				var oReq = new XMLHttpRequest();

				function reqListener() {
					console.log(this.responseText);
				}

				oReq.addEventListener('load',reqListner);
				oReq.open("GET",'https://leadeboard.isengrim.org/api/usernames/'+username);
				oReq.send();

				//msg.channel.send('yup');
			}
		}
	}
});

bot.login(authKey.token);