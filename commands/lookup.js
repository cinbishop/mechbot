exports.run = (client, message, args) => {

	let requestedMech = args.join(' ').toUpperCase();

	const requestedMechData = client.mechdata.findAll('chassis_translated',requestedMech);

	if(requestedMechData.length == 0) {
		message.channel.send('That ain\'t no mech I ever heard of!');
		return;
	} else {
		console.log(requestedMechData);
		let botresponse = client.functions.getVariants(requestedMech, requestedMechData);
		message.channel.send(botresponse);
	}

}