exports.run = (client, message, args) => {

	const randomMech = client.mechdata.randomKey(1);
	const requestedMechData = client.mechdata.get(randomMech[0][0][0]);

	let botresponse = client.functions.formatMechData(requestedMechData);
	message.channel.send(botresponse);

}