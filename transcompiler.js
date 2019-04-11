/**
 * @author		John Brandle
 * @license	see "NOTICE" file
 * @date		04.15.2013
 */

"use strict";

const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const properties_reader = require('properties-reader');
const babel_core = require("babel-core");
const transcompiler = require('./_excluded/_generated/transcompiler');

var args = process.argv.slice(2);
var buildName = args[0];
var buildType = args[1];
var projectParentDirectoryName = args.length > 2 ? args[2] : 'source';
var compileConstantsOverride = args.length > 3 ? JSON.parse(Buffer.from(args[3], 'base64').toString('utf8')) : {};

var baseDir = path.join(__dirname, '..', '..');
var sourceDir = path.join(baseDir, projectParentDirectoryName);
var toolsDir = path.join(baseDir, 'tools');
var transcompilerDir = path.join(toolsDir, 'transcompiler');

var properties = properties_reader(path.join(sourceDir, buildName, 'build.properties'));
var debug = getProperty('debug');
var bundle = getProperty('bundle');
var expose = getProperty('expose');
var platform = getProperty('platform');
var min = getProperty('min');
var server = getProperty('server');
var excludeDirectories = getProperty('excludeDirectories') ? JSON.parse(getProperty('excludeDirectories')) : [];
var deploy = getProperty('deploy') ? JSON.parse(getProperty('deploy')) : [];
var translationMode = getProperty('translationMode') ? parseInt(getProperty('translationMode')) : 3;
var compileConstants = getProperty('compileConstants') ? JSON.parse(getProperty('compileConstants')) : {};
for (var prop in compileConstantsOverride) compileConstants[prop] = compileConstantsOverride[prop];
var iframeID = getProperty('iframeID');


var srcDir = path.join(sourceDir, buildName);
var buildDir = path.join(baseDir, "build_" + buildType); //helium/cocoa support

if (!fs.existsSync(buildDir)) buildDir = path.join(baseDir, buildType);

var mainFile = getProperty('mainFile');

var outputFiles = [];
var outputDirectories = JSON.parse(getProperty('outputDirs'));
for (var i = 0; i < outputDirectories.length; i++) 
{
	var dir = path.join(buildDir, outputDirectories[i]);
	fs.ensureDirSync(dir);
	outputFiles[i] = path.join(dir, buildName + '.js');
}

function getProperty(name)
{
	var value = properties.get(buildType + '.' + name);
	value = (value === null) ? properties.get('debug.' + name) : value;
	
	if (value == 'false') value = false;
	else if (value == 'true') value = true;
	
	return value;
}

var fork = null;
var watch = null;
var exit = function() { process.exit(); };
process.on('SIGINT', exit); // catch ctrl-c
process.on('SIGTERM', exit); // catch kill
process.on('exit', function() 
{
	if (watch) watch.close();
	
	if (fork) 
	{
		fork.kill('SIGINT');
		child_process.spawn("taskkill", ["/pid", fork.pid, '/f', '/t']);
	}
	fork = null;
});

if (debug)
{
	var hash = {};
	
	var files = getFiles(srcDir);
	for (var i = 0; i < files.length; i++)
	{
		var file = files[i];
		if (file.indexOf('.as') != (file.length - 3)) continue;
		
		var contents = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
		hash[file] = contents;
	}
	
	watch = fs.watch(srcDir, {recursive:true}, function (event, filename) //watch will call change twice (tested on windows), the first appears to  be before the file is fully written..so check the contents
	{
		setTimeout(function() 
		{
			try
			{
				var file = path.join(srcDir, filename);
				
				if (file.indexOf('.as') != (file.length - 3)) return;
				
				var contents = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
				
				if (hash[file] !== undefined && hash[file] === contents) return;
				
				hash[file] = contents;
				
				console.log('file changed:', filename);
				
				create();
			}
			catch(error) {}
		}, 0);
	});
}

function create()
{
	if (fork) 
	{
		fork.kill('SIGINT');
		child_process.spawn("taskkill", ["/pid", fork.pid, '/f', '/t']);
		fork = null;
	}
	
	try
	{
		var bootstrapJS = '';
		
		var result = transcompiler.compile({srcDir:srcDir, mainFile:mainFile, includeBootstrap:bundle, includePlayerGlobal:bundle, expose:expose, iframeID:iframeID, excludeDirectories:excludeDirectories, translationMode:translationMode, compileConstants:compileConstants}, platform);
		for (var i = 0; i < outputFiles.length; i++) 
		{
			if (min) 
			{
				var name = outputFiles[i];
				var parts = name.split('.js');
				parts.pop();
				name = parts.join('.js') + '.min.js';
				if (!debug) fs.writeFileSync(name, babel_core.transform(result.js, {presets:[require.resolve('babel-preset-minify', {paths:[transcompilerDir]})], compact: false, babelrc:false}).code, 'utf8'); //does not work more than once... try babel v7
				else fs.writeFileSync(name, result.js, 'utf8');
			}
			
			fs.writeFileSync(outputFiles[i], result.js, 'utf8');
		}
		if (server != true) 
		{
			var swcDir = path.join(buildDir + '/js/transcompiler/swc');
			fs.ensureDirSync(swcDir);
			fs.writeFileSync(swcDir + '/' + buildName + '.swc', result.swc, 'utf8');
		}
		
		for (var i = 0; i < deploy.length; i++) 
		{
			var fromDir = path.join(srcDir, deploy[i]['from']);
			var toDir = path.join(buildDir, deploy[i]['to']);
			var overwrite = deploy[i]['overwrite'] === undefined ? true : deploy[i]['overwrite'];
			
			var stat = fs.lstatSync(fromDir);
			if (stat.isDirectory())
			{
				var files = getFiles(fromDir);
				for (var j = 0; j < files.length; j++) 
				{
					var file = files[j];
					
					fs.copySync(file, path.join(toDir, file.substring(fromDir.length)), {overwrite:overwrite});
				}
			}
			else fs.copySync(fromDir, toDir, {overwrite:overwrite});
		}
		
		console.log('done.');
		
		if (platform != 'node' || buildType != 'debug' || server != true) return;
		
		fork = child_process.fork(outputFiles[0], args, {detached:false});
		fork.on('message', function(message) 
		{
			switch (message)
			{
				case 'build':
					fork.kill('SIGINT');
					child_process.spawn("taskkill", ["/pid", fork.pid, '/f', '/t']);
					fork = null;
					create();
					break;
				default:
					throw new Error('unknown message from forked process: ' + message);
			}
		});	
	}
	catch(error)
	{
		console.log(error);
	}
}

function getFiles(dir, filelist = [])  
{
	fs.readdirSync(dir).forEach(file => 
	{
		filelist = fs.statSync(path.join(dir, file)).isDirectory() ? getFiles(path.join(dir, file), filelist) : filelist.concat(path.join(dir, file));
	});
	return filelist;
}

create();