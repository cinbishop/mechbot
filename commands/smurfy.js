exports.run = (client, message, args) => {

	let requestedMech = args.toString().toLowerCase();

	function formatMechData(requestedMechData) {
		let botresponse = '';
		let detailsArr = [];
		botresponse += '**'+requestedMechData['chassis_translated']+'**-'+requestedMechData['translated_name'] + '\n';

		if(requestedMechData['details']['hardpoints']['ballistic'] > 0 && requestedMechData['faction'] == 'InnerSphere') {
			botresponse += '*Good news! This mech is most likely RACable!*\n';
		} else {
			botresponse += '*WARNING: This mech is not RACable!*\n';
		}

		if(requestedMechData['details']['jump_jets'] > 0) {
			detailsArr.push('JJ: '+requestedMechData['details']['jump_jets']);
		}

		if(requestedMechData['details']['ecm']) {
			detailsArr.push('ECM');
		}

		if(detailsArr.length > 0) {
			botresponse += detailsArr.join(' | ') + '\n\n';
		} else {
			botresponse += '\n';
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

	const requestedMechData = client.mechdata.get(requestedMech);

	if(requestedMechData == null) {
		message.channel.send('That ain\'t no mech I ever heard of!');
		return;
	} else {
		let botresponse = formatMechData(requestedMechData);
		message.channel.send(botresponse);
	}

}