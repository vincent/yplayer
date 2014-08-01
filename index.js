var GS = require('grooveshark-streaming');
var http = require('http');
var fs = require('fs');
var mplayer = require('child_process').spawn;
var readline = require('readline');
var nullstream = require('dev-null-stream');

var input = readline.createInterface({input:process.stdin, output:process.stdout});

input.question('What song are you looking for?\n', function (answer) {
	input.close();
	var query = answer;
	var nresults = 20;

	//console.log(query);

	http.get('http://tinysong.com/s/' + query + '?format=json&limit=' + nresults + '&key=0131065fac026c65c87e3658dfa66b88', function (res) {
		var body = '';
		res.on('data', function (data) {
			body += data;
		});	
		res.on('end', function () {
			show(body);

		});

	});

});

function show(data) {
	data = JSON.parse(data);

	for (i = 0; i < data.length; i++) {
		console.log('[' + i + '] ' + data[i].SongName + ' - ' + data[i].ArtistName);
	}
	
	var rl = readline.createInterface({input:process.stdin, output:process.stdout})

	rl.question('What song do you want to download?', function (answer) {
		console.log('Downloading #' + answer);
		download(data[answer]);	
		rl.close();
	});
}

function download (songInfo) {

	GS.Grooveshark.getStreamingUrl(songInfo.SongID, function (err, streamUrl) { 
		var filename = __dirname + '/' + songInfo.SongName + '.mp3';
		http.get(streamUrl, function(res) {
			res.on('data', function (data){
				if (fs.existsSync(filename)) {
				fs.appendFileSync(filename, data);
				}
				else {
				fs.writeFileSync(filename, data);
				}
			});

			res.on('end', function () {
				var player = mplayer('mplayer', ['-ao','alsa', filename]);
				player.on('error', function (data) {
					console.log(data);
				});

				player.stdout.pipe(new nullstream());
				process.stdin.pipe(player.stdin);
			});

		});	
	
	});
}

