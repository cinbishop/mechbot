exports.run = (client, message, args) => {

	let requestedMech = args.join(' ').toUpperCase();
	console.log(requestedMech);

	function formatMechData(requestedMechData) {
		let botresponse = '';
		botresponse += '**'+requestedMech+' chassis variants:**\n';

		requestedMechData.forEach(function(mech){
			botresponse += mech['translated_short_name']+'\n';
		});

		return botresponse
	}

	const requestedMechData = client.mechdata.findAll('chassis_translated',requestedMech);

	if(requestedMechData.length == 0) {
		message.channel.send('That ain\'t no mech I ever heard of!');
		return;
	} else {
		console.log(requestedMechData);
		let botresponse = formatMechData(requestedMechData);
		message.channel.send(botresponse);
	}

}