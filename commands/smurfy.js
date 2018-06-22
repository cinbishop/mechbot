exports.run = (client, message, args) => {

	let requestedMech = args.toString().toLowerCase();

	function formatMechData(requestedMechData) {
		let botresponse = '';
		botresponse += '**'+requestedMechData['chassis_translated']+'**-'+requestedMechData['translated_name'] + '\n';

		if(requestedMechData['details']['hardpoints']['ballistic'] > 0 && requestedMechData['faction'] == 'InnerSphere') {
			botresponse += 'Good news! This mech is most likely RACable!\n\n';
		} else {
			botresponse += 'WARNING: This mech is not RACable!\n\n';
		}

		botresponse += '**HARDPOINTS**' + '\n';
		botresponse += '----------' + '\n';

		for (var key in requestedMechData['details']['hardpoints']) {
			if(requestedMechData['details']['hardpoints'][key] > 0) {
				botresponse += key.toUpperCase()+': ' + requestedMechData['details']['hardpoints'][key] + '\n';
			}
		}

		if(requestedMechData['details']['quirks'].length > 0) {
			botresponse += '\n**QUIRKS**' + '\n';
			botresponse += '----------' + '\n';

			for (var i = 0, len = requestedMechData['details']['quirks'].length; i < len; i++) {
				botresponse += '**'+requestedMechData['details']['quirks'][i]['translated_name'].toUpperCase()+':** '+requestedMechData['details']['quirks'][i]['value'] + '\n';
			}
		}

		return botresponse;
	}

	if(!client.mechdata.has('hbk-4g')) {
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

				if(requestedMechData == null) {
					message.channel.send('That ain\'t no mech I ever heard of!');
					return;
				} else {
					let botresponse = formatMechData(requestedMechData);
					message.channel.send(botresponse);
				}

			}).on("error",(err) => {
				console.log('Error: ' + err.message);
			});
		});
	} else {
		const requestedMechData = client.mechdata.get(requestedMech);

		if(requestedMechData == null) {
			message.channel.send('That ain\'t no mech I ever heard of!');
			return;
		} else {
			let botresponse = formatMechData(requestedMechData);
			message.channel.send(botresponse);
		}
	}

}