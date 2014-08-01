var GS = require('grooveshark-streaming');
var http = require('http');
var readline = require('readline');

var args = [];
for (i=0;i<process.argv.join(" ").split(' -').length;i++) {if (i!=0) args[i-1] = process.argv.join(" ").split(' -')[i]}

if (args[0] == '-help' || args[0] == 'h') {
	process.stdout.write("grooveshark-cli v0.0.1b, by: Bram \"#96AA48\" van der Veen\n");
	process.stdout.write("Usage : gsm [options] [-s song]\n");
	process.stdout.write("(Also works without arguments)\n\n");
	var options = [
		[
			"-s <song>", "Song to listen to"
		],
		[
			"-o, --offline", "Offline mode/listen to cached songs"
		],
		[
			"-h, --help", "Display helpful information (this stuff)"
		]
	];
	for (i=0;i<options.length;i++) {process.stdout.write(options[i][0] + '\t' + options[i][1] + '\n')}
}