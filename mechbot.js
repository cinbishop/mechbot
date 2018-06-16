const Discord = require("discord.js");
const authKey = require("./auth.json");

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('All systems nominal.');
});

bot.on('message', msg => {
	if (msg.content === 'ping') {
		msg.channel.send('shut up');
	}
});

bot.login(authKey);