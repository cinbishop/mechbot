exports.run = (client, message, args) => {

	let requestedMech = args.toString().toLowerCase();

	const requestedMechData = client.mechdata.get(requestedMech);

	if(requestedMechData == null) {
		message.channel.send('That ain\'t no mech I ever heard of!');
		return;
	} else {
		let botresponse = client.functions.formatMechData(requestedMechData);
		message.channel.send(botresponse);
	}

}