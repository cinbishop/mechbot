exports.run = (client, message, args) => {
	//console.log(args);
	let season = args.join().split('-s')[1] || null;
	let username = season === null ? args.join(' ') : args.slice(0,-1).join(' ');

	let requestUrl = 'https://leaderboard.isengrim.org/api/usernames/'+username;
	if(season != null) requestUrl += '/seasons/'+season;

	client.https.get(requestUrl, (resp) => {
		let data = '';

		resp.on("data",(chunk) => {
			data += chunk;
		});

		resp.on("end",() => {
			try {
				let stats = '';
				data = JSON.parse(data);
				//console.log(data);
				for (var key in data) {
					if(key === 'Rank' && data[key] === 0) {
						data[key] = 'Retired';
					}
					stats += '**'+key+'** ' + data[key] + '\n';
				}
				message.channel.send(stats);
			} catch (e) {
				message.channel.send('Jarl\'s List API Is Down!');
				return false;
			}
			return true;
		});
	}).on("error",(err) => {
		console.log('Error: ' + err.message);
	});
}