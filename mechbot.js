const Discord = require("discord.js");
const Enmap = require("enmap");
const https = require("https");
const fs = require("fs");

const client = new Discord.Client();
const config = require("./auth.json");

client.config = config;
client.https = https;

client.mechdata = new Enmap();

client.on("ready", () => {
	console.log('All systems nominal.');
	client.user.setActivity('!help for a list of commands', { type: 'PLAYING' });
	getMechData();
});

/*! GET EVENTS **/
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

/*! GET COMMANDS **/
client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

/*! GET SMURFY MECH DATA **/
function getMechData() {
	let requestUrl = 'https://mwo.smurfy-net.de/api/data/mechs.json';

	client.https.get(requestUrl, (resp) => {
		let data = '';

		resp.on("data",(chunk) => {
			data += chunk;
		});

		resp.on("end",() => {

			data = JSON.parse(data);

			Object.keys(data).forEach(function(mech,i) {
				client.mechdata.set(data[mech]['name'],data[mech]);
			});

			console.log('Mech data loaded.')

		}).on("error",(err) => {
			console.log('Error: ' + err.message);
		});
	});
}

client.login(config.token);