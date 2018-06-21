exports.run = (client, message, args) => {

	let requestedMech = args.toString().toLowerCase();
	let botresponse = '';

	if(!client.mechdata.has('hbk-4g')) {
		console.log('no mech data');
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
				const requestedMechData = client.mechdata.get(requestedMech);
				for (var key in requestedMechData['details']['hardpoints']) {
					botresponse += '**'+key+'** ' + requestedMechData['details']['hardpoints'][key] + '\n';
				}
				message.channel.send(botresponse);

			}).on("error",(err) => {
				console.log('Error: ' + err.message);
			});
		});

	} else {
		const requestedMechData = client.mechdata.get(requestedMech);
		for (var key in requestedMechData['details']['hardpoints']) {
			botresponse += '**'+key+'** ' + requestedMechData['details']['hardpoints'][key] + '\n';
		}
		message.channel.send(botresponse);
	}

}