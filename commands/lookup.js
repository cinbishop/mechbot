exports.run = (client, message, args) => {

	let requestedMech = args.join(' ').toUpperCase();

	const requestedMechData = client.mechdata.findAll('chassis_translated',requestedMech);

	if(requestedMechData.length == 0) {
		message.channel.send('That ain\'t no mech I ever heard of!');
		return;
	} else {
		let botresponse = client.functions.getVariants(requestedMech, requestedMechData);
		let approvedUser = message.author.username;
		message.channel.send(botresponse)
		.then(() => {
			message.channel.awaitMessages(response => (/[0-9]/).test(response.content) && response.author.username == approvedUser, {
				max: 1,
				time: 10000,
				errors: ['time'],
			})
			.then((collected) => {
				let selectedVariant = parseInt(collected.first().content)-1;
				selectedVariant = requestedMechData[selectedVariant];
				botresponse = client.functions.formatMechData(selectedVariant);
				message.channel.send(botresponse);
			})
			.catch(() => {
				console.log('Time Expired.');
			});
		})
	}

}