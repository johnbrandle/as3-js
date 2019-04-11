/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package sweetrush
{
	import sweetrush.core.Analyzer;
	import sweetrush.core.Lexer;
	import sweetrush.core.Parser;

	import sweetrush.core.TranslatorProto;
	import sweetrush.core.TranslatorPrototype;
	import sweetrush.obj.Construct;
	import sweetrush.obj.Token;
	import sweetrush.utils.FileUtil;

	import sweetrush.utils.SwcUtil;
	import sweetrush.utils.FileUtil;

	CONFIG::air
	{
		import flash.events.Event;
	}

	import flash.display.Sprite;

	public class Transcompiler extends Sprite
	{
		public static var DEBUG:Boolean = true;

		private static var _builtinSWCString:String;
		private static var _builtinSWC:Object;

		private static var _playerGlobalSWCString:String;
		private static var _playerGlobalSWC:Object;
		private static var _playerGlobalJS:String;

		CONFIG::air
		{
			public static var baseDir = 'S:/Source_Control/git/transcompiler/tools/transcompiler';
			//public static var baseDir = 'S:/Source_Control/srf/helium/4/framework/tools/transcompiler';

			public function Transcompiler()
			{
				addEventListener(flash.events.Event.ADDED_TO_STAGE, onAddedToStage);
			}

			private function onAddedToStage(event:Event):void
			{
				removeEventListener(flash.events.Event.ADDED_TO_STAGE, onAddedToStage);

				var command:String = 'transcompiler';
				var translationMode:uint = 3;

				switch (command)
				{
					case 'transcompiler':
						var result:Object = compileTranscompiler(1, 'node');
						FileUtil.write(FileUtil.getExcludedPath() + '/_generated/transcompiler.js', result.js);
						break;
					case 'tests':
						var result:Object = compile({srcDir:FileUtil.getBasePath() + '/_excluded/tests', mainFile:"", compileConstants:{'CONFIG::air':'false', 'CONFIG::node':'true'}, includeBootstrap:false, includePlayerGlobal:false, expose:'', translationMode:translationMode, excludeDirectories:['_excluded', 'node_modules']}, 'node');
						trace(result.js);
						break;

				}
			}
		}

		public function compileTranscompiler(translationMode:Number=1, platform:String='node')
		{
			return compile({srcDir:FileUtil.getBasePath(), mainFile:"sweetrush/Transcompiler.as", compileConstants:{'CONFIG::air':'false', 'CONFIG::node':'true'}, includeBootstrap:true, includePlayerGlobal:true, expose:'transcompiler', translationMode:translationMode, excludeDirectories:['_excluded', 'node_modules']}, platform);
		}

		public function compile(params:Object, platform:String='node') //the platform we are building for (node, browser, player (browser+))
		{
			var srcDir:String = params.srcDir; //where your *.as files are located
			var mainFile:String = params.mainFile; //e.g., sweetrush/Application.as
			var swcs:Array = params.swcs || []; //js swcs e.g., [foo1.swc, foo2.swc]
			var srcFiles:Array = params.srcFiles || []; //partial compile, e.g., ['Application.as', 'Event']
			var translationMode:Number = params.translationMode === undefined ? 3 : params.translationMode; //0 is proto, fast mode; 1 is proto, full mode; 3 is prototype, fast mode
			var compileConstants:Object = params.compileConstants || {}; //e.g., {'DEBUG::test':true}
			var release:Boolean = params.release; //the compiler will remove anything with the UNIMPLEMENTED keyword if release is true [TODO] change UNIMPLEMENTED to metadata [Unimplemented]
			var rootConstructs:Array = params.rootConstructs || []; //alternative to using swc
			var swcOnly:Boolean = params.swcOnly; //compile swc only
			var excludeDirectories:Array = params.excludeDirectories || []; //directories to exclude
			var includeBootstrap:Boolean = params.includeBootstrap; //should bootstrap js be included in js output?
			var includePlayerGlobal:Boolean = params.includePlayerGlobal; //should playerglobal js be included in the js output?
			var expose:String = params.expose ? params.expose : null; //what, if any, variable name we will set the created instance to
			var special:Boolean = params.special; //we are compiling either playerglobal or builtin; either way, do not add builtin or playerglobal swcs automatically

			//fix all the paths
			srcDir = FileUtil.fixPath(srcDir);
			if (mainFile) mainFile = FileUtil.fixPath(mainFile);
			if (!special) for (var i = 0; i < swcs.length; i++) swcs[i] = FileUtil.fixPath(swcs[i]);

			//get the list of as files we will be compiling
			var files = getSrcFiles(srcDir, srcFiles, excludeDirectories, platform);

			//load swcs and add their constructs
			var innerRootConstruct:Object;
			if (!special)
			{
				innerRootConstruct = getBuiltinSWC(platform);
				for (var prop in innerRootConstruct) rootConstructs[prop] = innerRootConstruct[prop];

				innerRootConstruct = getPlayerGlobalSWC(translationMode, platform);
				for (var prop in innerRootConstruct) rootConstructs[prop] = innerRootConstruct[prop];
			}
			for (var i = 0; i < swcs.length; i++)
			{
				innerRootConstruct = swcs[i];
				for (var prop in innerRootConstruct) rootConstructs[prop] = innerRootConstruct[prop];
			}

			//lex and parse; add rootConstructs; set mainID
			var filePaths = {};
			var mainID;
			var rootConstructsToTranslate = {};
			var tokens;
			var rootConstruct;
			for (var filePath in files)
			{
				if (DEBUG >= 1) trace('Lexing: ' + filePath);

				tokens = Lexer.lex(files[filePath]).tokens;

				if (DEBUG >= 1) trace('Parsing: ' + filePath);

				rootConstruct = Parser.parse(tokens, compileConstants, release);

				var id = filePath.split(srcDir)[1].slice(1, -3).split('/').join('.');
				if (filePath == srcDir + '/' + mainFile) mainID = id;

				rootConstructsToTranslate[id] = rootConstructs[id] = rootConstruct;
				filePaths[id] = filePath;
			}

			//create swc file
			if (DEBUG >= 1) trace('Creating: swc');
			var jsSWC = SwcUtil.stringifySWC(rootConstructsToTranslate);
			if (swcOnly) return {js:null, rootConstructs:rootConstructsToTranslate, swc:jsSWC};

			//turn import flash.display.*; to import flash.display.Sprite, ...
			normalizeWildcardImports(rootConstructs);

			//analyze and translate
			var js = [];
			var translated = {interfaces:[], classes:[], methods:[], properties:[]};
			var mainJS = '//' + mainID + '\n';
			for (var id in rootConstructsToTranslate)
			{
				if (DEBUG >= 1) trace('Analyzing: ' + filePaths[id]);

				var rootConstruct = Analyzer.analyze(rootConstructsToTranslate[id], rootConstructs, translationMode);

				if (DEBUG >= 1) trace('Translating: ' + filePaths[id]);

				var innerJS = '//' + id + '\n';
				var translatedJS = (translationMode == 3) ? TranslatorPrototype.translate(rootConstruct, rootConstructs, translationMode, release) : TranslatorProto.translate(rootConstruct, rootConstructs, translationMode, release);
				innerJS += translatedJS + '//' + id + '\n';

				if (id == mainID) mainJS += translatedJS + '//' + mainID + '\n';
				else if (rootConstruct.packageConstruct.classConstruct) translated.classes.push(innerJS);
				else if (rootConstruct.packageConstruct.interfaceConstruct) translated.interfaces.push(innerJS);
				else if (rootConstruct.packageConstruct.methodConstruct) translated.methods.push(innerJS);
				else if (rootConstruct.packageConstruct.propertyConstruct) translated.properties.push(innerJS);
				else throw new Error('unknown construct');
			}

			for (var i = 0; i < translated.properties.length; i++) js.push(translated.properties[i]);
			if (mainID) js.push(mainJS);
			for (var i = 0; i < translated.classes.length; i++) js.push(translated.classes[i]);
			for (var i = 0; i < translated.interfaces.length; i++) js.push(translated.interfaces[i]);
			for (var i = 0; i < translated.methods.length; i++) js.push(translated.methods[i]);
			translated = null;
			mainJS = null;

			//call $$pcinit interfaces
			for (var id in rootConstructsToTranslate)
			{
				if (!rootConstructsToTranslate[id].packageConstruct.interfaceConstruct) continue;

				var parts = id.split('.');
				var part = parts.pop();
				var packageName = (parts.length) ? parts.join('.') : '';

				js.push('$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();');
			}

			//call $$pcinit other
			for (var id in rootConstructsToTranslate)
			{
				if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct || rootConstructsToTranslate[id].packageConstruct.propertyConstruct) continue;
				if (rootConstructsToTranslate[id].packageConstruct.classConstruct && rootConstructsToTranslate[id].packageConstruct.classConstruct.UNIMPLEMENTEDToken) continue;
				if (rootConstructsToTranslate[id].packageConstruct.methodConstruct && (rootConstructsToTranslate[id].packageConstruct.methodConstruct.UNIMPLEMENTEDToken || (!rootConstructsToTranslate[id].packageConstruct.methodConstruct.getToken && !rootConstructsToTranslate[id].packageConstruct.methodConstruct.setToken))) continue;

				var parts = id.split('.');
				var part = parts.pop();
				var packageName = (parts.length) ? parts.join('.') : '';

				js.push('$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();');
			}

			if (translationMode === 3)
			{
				//call $$sinit interfaces
				for (var id in rootConstructsToTranslate)
				{
					if (!rootConstructsToTranslate[id].packageConstruct.interfaceConstruct) continue;
					if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct.UNIMPLEMENTEDToken) continue;

					var parts = id.split('.');
					var part = parts.pop();
					var packageName = (parts.length) ? parts.join('.') : '';

					js.push('if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();');
				}

				//call $$sinit other
				for (var id in rootConstructsToTranslate)
				{
					if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct || rootConstructsToTranslate[id].packageConstruct.propertyConstruct) continue;
					if (rootConstructsToTranslate[id].packageConstruct.classConstruct && rootConstructsToTranslate[id].packageConstruct.classConstruct.UNIMPLEMENTEDToken) continue;
					if (rootConstructsToTranslate[id].packageConstruct.methodConstruct && (rootConstructsToTranslate[id].packageConstruct.methodConstruct.UNIMPLEMENTEDToken || (!rootConstructsToTranslate[id].packageConstruct.methodConstruct.getToken && !rootConstructsToTranslate[id].packageConstruct.methodConstruct.setToken))) continue;

					var parts = id.split('.');
					var part = parts.pop();
					var packageName = (parts.length) ? parts.join('.') : '';

					js.push('if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();');
				}
			}

			//create document class object
			var returnObject = '';
			if (mainID)
			{
				var parts = mainID.split('.');
				var name = parts.pop();
				var packageName = (parts.length) ? parts.join('.') : '';

				returnObject = "new $es4.$$['" + packageName + "']." + name + '($es4.$$MANUAL_CONSTRUCT)';
			}
			else returnObject = "new $es4.$$['flash.display'].Sprite($es4.$$MANUAL_CONSTRUCT)";

			var lastLine = '';
			if (expose)
			{
				var exposeAs:String = (platform != 'node') ? ('window.' + expose) : 'var _object = module.exports';
				lastLine = exposeAs + ' = ' + returnObject + '\n';
				lastLine += '$es4.$$construct(' + (platform != 'node' ? ('window.' + expose) : '_object') + ', $es4.$$EMPTY_ARRAY);\n';
				returnObject = (platform != 'node') ? ('window.' + expose) : '_object';
			}

			if (includeBootstrap && includePlayerGlobal && !mainFile) lastLine += "$es4.$$['player'].Player;";
			else lastLine += returnObject + ';';

			if (!special) js.push(lastLine);

			//write js to output
			if (DEBUG >= 2) trace('\nOutput: \n' + js);

			var bootstrapJS = [];
			if (includeBootstrap)
			{
				var bootstrapJSFileDir:String = FileUtil.getExcludedPath() + '/bootstrap';
				var list = FileUtil.getList(bootstrapJSFileDir, true, FileUtil.getListFilter_filters([FileUtil.getListFilter_directories(), FileUtil.getListFilter_hidden(), FileUtil.getListFilter_extension('js', true)]));
				for (var i = 0; i < list.length; i++)
				{
					var filePath = FileUtil.fixPath(list[i].src);

					//filter out platform specific files, e.g., ByteArray.node.as or ByteArray.player.browser.as
					var parts = filePath.split('.');
					var found = parts.length == 2;
					for (var j = 1; j < parts.length - 1; j++)
					{
						if (parts[j] != platform) continue;

						found = true;
						break;
					}

					if (found) bootstrapJS.push(FileUtil.read(filePath));
				}

				if (includePlayerGlobal) bootstrapJS.push(getPlayerGlobalJS(translationMode, platform));
			}

			var pre = (platform != 'node') ? '//__ES4__\n\n(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; \n\n' : '';
			var post = (platform != 'node') ? '})();' : '';

			return {js:pre + bootstrapJS.concat(js).join('\n\n') + post, rootConstructs:rootConstructsToTranslate, swc:jsSWC};
		}

		private function getSrcFiles(srcDir:String, srcFiles:Array, excludeDirectories:Array, platform:String):Object
		{
			var filters = [FileUtil.getListFilter_directories(), FileUtil.getListFilter_hidden(), FileUtil.getListFilter_extension('as', true)];
			for (var i = 0; i < excludeDirectories.length; i++) filters.push(FileUtil.getListFilter_directory(FileUtil.resolvePath(srcDir, excludeDirectories[i])));
			var list = FileUtil.getList(srcDir, true, FileUtil.getListFilter_filters(filters));

			//read all as files unless we are doing a partial compile (see 'srcFiles')
			var files = {};
			for (var i = 0; i < list.length; i++)
			{
				var filePath = FileUtil.fixPath(list[i].src);

				//filter out platform specific files, e.g., ByteArray.node.as or ByteArray.player.browser.as
				var parts = filePath.split('.');
				var found = parts.length == 2;
				for (var j = 1; j < parts.length - 1; j++)
				{
					if (parts[j] != platform) continue;

					found = true;
					filePath = parts[0] + '.' + parts[parts.length - 1];
					break;
				}
				if (!found) continue;

				if (srcFiles.length)
				{
					var found = false;
					for (var j = 0; j < srcFiles.length; j++)
					{
						if (filePath.indexOf(srcFiles[j]) != -1)
						{
							found = true;
							break;
						}
					}

					if (!found) continue;
				}

				files[FileUtil.fixPath(filePath)] = FileUtil.read(FileUtil.fixPath(list[i].src));
			}

			//looks for include directive and replaces it with file contents, any include file that is found is added the the includes object
			if (DEBUG >= 1) trace('Normalizing Includes');
			function insertIncludes(filePath, fileContents, includes)
			{
				return fileContents.replace(/include\s*["|'][0-9A-Za-z._\/\\]+["|'];*/g, doReplace);

				function doReplace(match, offset, string)
				{
					var includePath = match.match(/["|']([0-9A-Za-z._\/\\]+)["|']/)[1];

					var parts = FileUtil.fixPath(filePath).split('/');
					parts.pop();
					var path = parts.join('/');

					includePath = FileUtil.resolvePath(path, includePath);
					trace('found include: ' + includePath + ' in: ' + filePath);

					//filter out platform specific files, e.g., ByteArray.node.as or ByteArray.player.browser.as
					var parts = includePath.split('.');
					var includeFilePath = parts[0] + '.' + parts[parts.length - 1];

					includes[includeFilePath] = includeFilePath;

					return insertIncludes(includePath, FileUtil.read(includePath), includes);
				}
			}
			//call insert includes on every file
			var includes = {};
			for (var filePath in files) files[filePath] = insertIncludes(filePath, files[filePath], includes);

			//remove any includes we found from the files object
			for (var filePath in includes) delete files[filePath];

			return files;
		}

		private function normalizeWildcardImports(rootConstructs:Object):void
		{
			//normalize wildcard imports, such as: import flash.display.*;
			if (DEBUG >= 1) trace('Normalizing Imports');
			for (var id in rootConstructs)
			{
				var innerRootConstruct = rootConstructs[id];

				var imports = [innerRootConstruct.importConstructs, innerRootConstruct.packageConstruct.importConstructs];
				while (imports.length)
				{
					var importConstructs = imports.shift();
					var packages = [];
					for (var i = 0; i < importConstructs.length; i++)
					{
						var importConstruct = importConstructs[i];
						if (!importConstruct.mulToken) continue;

						importConstructs.splice(i, 1);
						i--;

						packages.push(Construct.nameConstructToString(importConstruct.nameConstruct));
					}

					while (packages.length)
					{
						var packageName = packages.shift();

						for (var innerId in rootConstructs)
						{
							if (innerId.indexOf(packageName) != 0) continue;

							var importConstruct = Construct.getNewImportConstruct();
							var nameConstruct = Construct.getNewNameConstruct();

							var parts = innerId.split('.');
							for (var j = 0; j < parts.length; j++)
							{
								var identifierToken = Token.getNewToken(Token.IdentifierTokenType, parts[j]);
								nameConstruct.identifierTokens.push(identifierToken);
							}

							importConstruct.nameConstruct = nameConstruct;
							importConstructs.push(importConstruct);
						}
					}
				}
			}
		}

		private function getBuiltinSWC(platform:String):Object
		{
			var builtinSWCFile:String = FileUtil.getExcludedPath() + '/_generated/builtin.' + platform + '.swc';
			var builtinSWCString:String = FileUtil.exists(builtinSWCFile) ? FileUtil.read(builtinSWCFile) : null;
			if (builtinSWCString && _builtinSWCString != builtinSWCString && SwcUtil.isValidSWCString(builtinSWCString))
			{
				_builtinSWC = SwcUtil.parseSWCString(builtinSWCString);
				_builtinSWCString = builtinSWCString;
			}

			if (!_builtinSWC)
			{
				var srcDir = FileUtil.getExcludedPath() + '/builtin';
				var result = compile({srcDir:srcDir, translationMode:1, special:true}, platform);
				FileUtil.write(builtinSWCFile, result.swc);

				_builtinSWC = SwcUtil.parseSWCString(result.swc);
				_builtinSWCString = result.swc;
			}

			return _builtinSWC;
		}

		private function getPlayerGlobalSWC(translationMode:Number, platform:String):Object
		{
			var playerGlobalSWCFile:String = FileUtil.getExcludedPath() + '/_generated/playerglobal.' + platform + '.swc';
			var playerGlobalJSFile:String = FileUtil.getExcludedPath() + '/_generated/playerglobal.' + platform + '.' + translationMode + '.js';
			var playerGlobalSWCString:String = FileUtil.exists(playerGlobalSWCFile) ? FileUtil.read(playerGlobalSWCFile) : null;
			var playerGlobalJS:String = FileUtil.exists(playerGlobalJSFile) ? FileUtil.read(playerGlobalJSFile) : null;
			if (playerGlobalSWCString && playerGlobalJS && _playerGlobalSWCString != playerGlobalSWCString && SwcUtil.isValidSWCString(playerGlobalSWCString))
			{
				_playerGlobalSWC = SwcUtil.parseSWCString(playerGlobalSWCString);
				_playerGlobalJS = playerGlobalJS;
				_playerGlobalSWCString = playerGlobalSWCString;
			}

			if (!_playerGlobalSWC)
			{
				var srcDir = FileUtil.getExcludedPath() + '/playerglobal';
				var result = compile({srcDir:srcDir, translationMode:translationMode, swcs:[getBuiltinSWC(platform)], special:true}, platform);
				FileUtil.write(playerGlobalSWCFile, result.swc);
				FileUtil.write(playerGlobalJSFile, result.js);

				_playerGlobalSWC = SwcUtil.parseSWCString(result.swc);
				_playerGlobalSWCString = result.swc;
				_playerGlobalJS = result.js;
			}

			return _playerGlobalSWC;
		}

		private function getPlayerGlobalJS(translationMode:Number, platform:String):Object
		{
			if (!_playerGlobalSWC) getPlayerGlobalSWC(translationMode, platform);

			return _playerGlobalJS;
		}

		public function getLexer():Class
		{
			return Lexer;
		}

		public function getParser():Class
		{
			return Parser;
		}

		public function getAnalyzer():Class
		{
			return Analyzer;
		}

		public function getTranslator(prototype:Boolean=true):Class
		{
			return prototype ? TranslatorPrototype : TranslatorProto;
		}

		public function getSwcUtil():Class
		{
			return SwcUtil;
		}
	}
}