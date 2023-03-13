const as3_js = require('./_excluded/_generated/as3_js.node.1.js');
const path = require('path');
const fs = require('fs');

var modes = [1, 3];
var platforms = ['node', 'browser', 'player'];
for (var i = platforms.length; i--;)
{
	var platform = platforms[i];

	for (var j = modes.length; j--;)
	{
		var mode = modes[j];
		
		let excludedPath = path.join(__dirname, '_excluded');

		var result = as3_js.compileCompiler(mode, platform);
		fs.writeFileSync(excludedPath + '/_generated/as3_js.' + platform + '.' + mode + '.js', result.js, 'utf8');
		fs.writeFileSync(excludedPath + '/_generated/as3_js.swc', result.swc);
	}
}

//as3_js.executeCommand('as3_js'); //compile the compiler using the compiler