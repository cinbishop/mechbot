module.exports = function (client) {
	var functions = {};

	/*! GET SMURFY MECH DATA **/
	functions.getMechData = function() {
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
	};

	functions.formatMechData = function(requestedMechData) {
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
	};

	functions.getVariants = function(requestedMech, requestedMechData) {
		let botresponse = '';
		botresponse += '**'+requestedMech+' VARIANTS:**\n';

		requestedMechData.forEach(function(mech, i){
			botresponse += i+1+': '+mech['translated_short_name']+'\n';
		});

		botresponse += '\nType 1-'+requestedMechData.length+' to select a variant!'

		return botresponse
	};

	return functions;
}