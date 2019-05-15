/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.utils
{
	public class SwcUtil
	{
		public static function stringifySWC(obj)
		{
			return '_SWC_' + (new JsonUtil().stringify(obj));
		}

		public static function parseSWCString(contents)
		{
			return new JsonUtil().parse(contents.substring(5));
		}

		public static function isValidSWCString(contents)
		{
			return contents.indexOf('_SWC_') == 0;
		}

		CONFIG::air
		{
			public static function flashSwcToJsSwc(swcFile:String)
			{
				return stringifySWC(FlashSwcToJS.parse(swcFile));
			}

		}
	}
}

CONFIG::air
{
	import flash.utils.ByteArray;
	import sweetrush.obj.Construct;
	import sweetrush.obj.Token;
	import sweetrush.AS3_JS;

	internal class FlashSwcToJS
	{
		public static function parse(swcFile:String):Object
		{
			var rootConstructs:Object = {};
			if (AS3_JS.DEBUG >= 1) trace('Reading SWC: ' + swcFile);

			//var zipFile = new ZipFile(swcFile);
			//var entry = zipFile.getEntry('library.swf');
			//var inputStream = zipFile.getInputStream(entry);

			var inputStream = null; //TODO
			throw new Error('todo, zip file uncompress');

			var swfff = new SWFFF(inputStream);
			swfff.readHeader();

			var tag;
			while(tag = swfff.readTag())
			{
				if (tag.code != 82) continue;

				var inputStream = new InputStreamWrapper(tag.content);
				inputStream.readUnsignedInt();

				//id = flash.display.Sprite
				//fid = flash.display:Sprite
				//sid = Sprite
				var id = inputStream.readUTF().split('/').join('.');
				var fid = id;
				var sid = id;

				if (id.indexOf('.') != -1)
				{
					var parts = id.split('.');
					sid = parts.pop();
					fid = parts.join('.') + ':' + sid;
				}

				if (AS3_JS.DEBUG >= 4) trace(id);

				//abc header
				inputStream.readUnsignedShort();
				inputStream.readUnsignedShort();

				/*** constant pool ***/
				var const_pool = {ns_sets:[''], strings:[''], namespaces:[{kind:null, name:''}], multinames:[{'namespace':{kind:null, name:''}, name:''}]};

				//get int_count
				var int_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < int_count; i++) inputStream.readUnsignedInt30();

				//get uint_count
				var uint_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < uint_count; i++) inputStream.readUnsignedInt30();

				//get double_count
				var double_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < double_count; i++) inputStream.readDouble();

				//get string_count
				var string_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < string_count; i++)
				{
					var length = inputStream.readUnsignedInt30();
					var val = inputStream.readUTFBytes(length);
					const_pool.strings.push(val);
				}

				//get namespace_count
				var namespace_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < namespace_count; i++)
				{
					var kind = inputStream.readUnsignedByte();
					var name = inputStream.readUnsignedInt30();

					const_pool.namespaces.push({kind:kind, name:const_pool.strings[name]});
				}

				//get ns_set_count
				var ns_set_count = inputStream.readUnsignedInt30() - 1;
				var ns_sets = [''];
				for (var i = 0; i < ns_set_count; i++)
				{
					var set = [];
					var count = inputStream.readUnsignedInt30();
					for (var j = 0; j < count; j++) set.push(const_pool.namespaces[inputStream.readUnsignedInt30()]);
					ns_sets.push(set);
				}

				//get multiname_count
				var multiname_count = inputStream.readUnsignedInt30() - 1;
				for (var i = 0; i < multiname_count; i++)
				{
					var kind = inputStream.readUnsignedByte();
					if ((kind == 0x07) || (kind == 0x0D))
					{
						var namespace = const_pool.namespaces[inputStream.readUnsignedInt30()];
						var name = inputStream.readUnsignedInt30();

						const_pool.multinames.push({'namespace':namespace, name:const_pool.strings[name]});
					}
					else if ((kind == 0x0f) || (kind == 0x10))
					{
						var name = inputStream.readUnsignedInt30();
						const_pool.multinames.push({'namespace':{kind:kind, name:''}, name:const_pool.strings[name]});
					}
					else if ((kind == 0x11) || (kind == 0x12))
					{
						const_pool.multinames.push({'namespace':{kind:kind, name:''}, name:''});
					}
					else if ((kind == 0x09) || (kind == 0x0E)) //used for interfaces
					{
						var name = inputStream.readUnsignedInt30();
						var ns_set = inputStream.readUnsignedInt30();

						var intr = ns_sets[ns_set];

						const_pool.multinames.push({ns_set:intr, name:const_pool.strings[name]});
					}
					else if ((kind == 0x1B) || (kind == 0x1C)) //not used
					{
						var ns_set = inputStream.readUnsignedInt30();
						const_pool.multinames.push({'namespace':{kind:kind, name:''}, name:''});
					}
					else if (kind == 0x1D) //Generics, undocumented //http://stackoverflow.com/questions/553445/how-do-generics-vector-work-inside-the-avm
					{
						var name = inputStream.readUnsignedInt30();

						const_pool.multinames.push({'namespace':{kind:kind, name:''}, name:'Array'});
						//const_pool.multinames.push({namespace:{kind:kind, name:''}, name:const_pool.strings[name]});
						var count = inputStream.readUnsignedInt30();
						while (count--) inputStream.readUnsignedInt30();
					}
					else
					{
						throw new Error('kind unknown');
					}
				}

				/*** method signatures ***/
				var methods = [];
				var method_count = inputStream.readUnsignedInt30(true);

				for (var i = 0; i < method_count; i++)
				{
					var method = {};
					method.param_count = inputStream.readUnsignedInt30();

					var return_type_int = inputStream.readUnsignedInt30();
					method.return_type = (const_pool.multinames[return_type_int]['namespace'].name) ? const_pool.multinames[return_type_int]['namespace'].name + '.' + const_pool.multinames[return_type_int]['name'] : const_pool.multinames[return_type_int]['name'];

					for (var j = 0; j < method.param_count; j++)
					{
						var param_type_int = inputStream.readUnsignedInt30();
						var param_type = const_pool.multinames[param_type_int]['name'];
					}
					method.name = const_pool.strings[inputStream.readUnsignedInt30()];

					var flags = inputStream.readUnsignedByte();
					if (flags & 0x08)
					{
						var option_count = inputStream.readUnsignedInt30();
						for (var j = 0; j < option_count; j++)
						{
							var val = inputStream.readUnsignedInt30();
							var kind = inputStream.readUnsignedByte();
						}
					}

					if (flags & 0x80)
					{
						for (var j = 0; j < method.param_count; j++)
						{
							var param_name = inputStream.readUnsignedInt30();
						}
					}

					methods.push(method);
				}

				/*** metadata ***/
				var metadata_count = inputStream.readUnsignedInt30();
				for (var i = 0; i < metadata_count; i++)
				{
					var name = const_pool.strings[inputStream.readUnsignedInt30()];
					var item_count = inputStream.readUnsignedInt30();
					for (var j = 0; j < item_count; j++)
					{
						var key = inputStream.readUnsignedInt30();
					}
					for (var j = 0; j < item_count; j++)
					{
						var value = inputStream.readUnsignedInt30();
					}
				}

				/*** instance info ***/
				var class_count = inputStream.readUnsignedInt30();
				var methods_in_class = {};
				var classes = [];
				var classConstructs = {};
				for (var i = 0; i < class_count; i++)
				{
					var name_multiname = const_pool.multinames[inputStream.readUnsignedInt30()];
					var super_multiname = const_pool.multinames[inputStream.readUnsignedInt30()];
					var flags = inputStream.readUnsignedByte();

					var classConstruct;
					var isInterface = (flags & 0x04);
					if (isInterface) classConstruct = Construct.getNewInterfaceConstruct();
					else classConstruct = Construct.getNewClassConstruct();

					var isSealed = (flags & 0x01);
					if (!isSealed && !isInterface) classConstruct.dynamicToken = Token.getNewToken(Token.DynamicTokenType, 'dynamic');

					var isInternal = (name_multiname.namespace.name.indexOf('$') != -1);

					var innerID = name_multiname.name;

					if (name_multiname.namespace.name && !isInternal) innerID = name_multiname.namespace.name + '.' + innerID;

					var rootConstruct = rootConstructs[innerID] = Construct.getNewRootConstruct();
					classes.push(innerID);

					var packageConstruct = Construct.getNewPackageConstruct();
					rootConstruct.packageConstruct = packageConstruct;
					packageConstruct.rootConstruct = rootConstruct;

					var nameConstruct = Construct.getNewNameConstruct();
					if (name_multiname.namespace.name)
					{
						var parts = name_multiname.namespace.name.split('.');
						for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
					}
					packageConstruct.nameConstruct = nameConstruct;

					if (isInternal && isInterface) rootConstruct.interfaceConstructs.push(classConstruct);
					else if (isInternal) rootConstruct.classConstructs.push(classConstruct);
					else
					{
						if (isInterface) packageConstruct.interfaceConstruct = classConstruct;
						else packageConstruct.classConstruct = classConstruct;
						classConstruct.packageConstruct = packageConstruct;
					}
					classConstruct.rootConstruct = rootConstruct;
					classConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, name_multiname.name);

					classConstructs[innerID] = classConstruct;

					if (super_multiname.name != 'Object' && super_multiname.name)
					{
						var nameConstruct = Construct.getNewNameConstruct();
						var parts = super_multiname.namespace.name.split('.');
						if (parts.length > 1) for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
						nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, super_multiname.name));

						classConstruct.extendsNameConstruct = nameConstruct;
					}

					var protectedNs;
					if (flags & 0x08) protectedNs = inputStream.readUnsignedInt30();

					var intrf_count = inputStream.readUnsignedInt30();

					for (var j = 0; j < intrf_count; j++)
					{
						var interface_multiname = const_pool.multinames[inputStream.readUnsignedInt30()];
						var nameConstruct = Construct.getNewNameConstruct();

						interface_multiname.namespace = interface_multiname.ns_set[interface_multiname.ns_set.length - 1]; //getting the last multiname in the set... don't know if this is correct...
						var parts = interface_multiname.namespace.name.split('.');

						if (parts.length > 1) for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
						nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, interface_multiname.name));

						if (isInterface) classConstruct.extendsNameConstructs.push(nameConstruct);
						else classConstruct.implementsNameConstructs.push(nameConstruct);
					}

					var iinit = inputStream.readUnsignedInt30();
					methods_in_class[iinit] = iinit;

					var trait_count = inputStream.readUnsignedInt30();
					for (var j = 0; j < trait_count; j++)
					{
						var multiname = const_pool.multinames[inputStream.readUnsignedInt30()];
						var kind = inputStream.readUnsignedByte();

						var mkind = kind & 0xF;
						switch (mkind)
						{
							case 0: //Slot
							case 6: //Const
								var propertyConstruct = Construct.getNewPropertyConstruct();
								propertyConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, multiname.name);

								var slot_id = inputStream.readUnsignedInt30();
								var type_multiname = const_pool.multinames[inputStream.readUnsignedInt30()];

								if (!type_multiname.name) type_multiname.name = '*';
								var return_type = (type_multiname.namespace.name) ? type_multiname.namespace.name + '.' + type_multiname.name : type_multiname.name;

								var typeConstruct = Construct.getNewTypeConstruct();
								var nameConstruct = Construct.getNewNameConstruct();
								var parts = return_type.split('.');
								if (return_type)
								{
									for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
									typeConstruct.nameConstruct = nameConstruct;
								}
								else
								{
									typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
								}
								propertyConstruct.typeConstruct = typeConstruct;

								var vindex = inputStream.readUnsignedInt30();
								var vkind = null;
								if (vindex != 0) vkind = inputStream.readUnsignedByte();

								var ikind = multiname.namespace.kind;
								if (ikind == 5) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'private');
								if (ikind == 22) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'public');
								if (ikind == 24) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'protected');
								if (ikind == 8) propertyConstruct.namespaceValueToken = Token.getNewToken(Token.IdentifierTokenType, multiname.namespace.name);

								if (vkind == 8) propertyConstruct.namespaceKeywordToken = Token.getNewToken(Token.NamespaceKeywordTokenType, 'namespace');

								classConstruct.propertyConstructs.push(propertyConstruct);
								break;
							case 1: //Method
							case 2: //Getter
							case 3: //Setter
								var disp_id = inputStream.readUnsignedInt30();

								var index = inputStream.readUnsignedInt30();
								var method = methods[index];
								methods_in_class[index] = index;

								var methodConstruct = Construct.getNewMethodConstruct();
								methodConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, multiname.name);

								var typeConstruct = Construct.getNewTypeConstruct();
								var nameConstruct = Construct.getNewNameConstruct();
								if (method.return_type)
								{
									var parts = method.return_type.split('.');
									for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
									typeConstruct.nameConstruct = nameConstruct;
								}
								else
								{
									typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
								}
								methodConstruct.typeConstruct = typeConstruct;


								if (mkind == 2) methodConstruct.getToken = Token.getNewToken(Token.GetTokenType, 'get');
								if (mkind == 3)
								{
									methodConstruct.setToken = Token.getNewToken(Token.SetTokenType, 'set');

									var parameterConstruct = Construct.getNewParameterConstruct();
									parameterConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, 'value');
									parameterConstruct.typeConstruct = typeConstruct;

									methodConstruct.parameterConstructs.push(parameterConstruct);
								}
								var parts = method.name.split('/');
								if (mkind == 2 || mkind == 3) parts.pop();
								var part = parts.pop() || '';
								var namespace = 'public';

								if (!isInterface && part.indexOf(':') != -1) namespace = part.split(':')[0];

								var namespaceToken = Token.getNewToken(Token.IdentifierTokenType, namespace);
								methodConstruct.namespaceToken = namespaceToken;

								classConstruct.methodConstructs.push(methodConstruct);
								break;

							case 4: //Class
								var slot_id = inputStream.readUnsignedInt30();
								var classi = inputStream.readUnsignedInt30();
								break;

							case 5: //Function
								var slot_id = inputStream.readUnsignedInt30();

								var index = inputStream.readUnsignedInt30();
								var method = methods[index];
								methods_in_class[index] = index;
								break;
						}

						if (kind & (0x4 << 4))
						{
							var metadata_count = inputStream.readUnsignedInt30();
							for (var k = 0; k < metadata_count; k++)
							{
								inputStream.readUnsignedInt30();
							}
						}
					}
				}

				/*** class info ***/
				for (var i = 0; i < class_count; i++)
				{
					var innerID = classes[i];
					var classConstruct = classConstructs[innerID];

					var cinit = inputStream.readUnsignedInt30();
					methods_in_class[cinit] = cinit;

					var trait_count = inputStream.readUnsignedInt30();
					for (var j = 0; j < trait_count; j++)
					{
						var multiname = const_pool.multinames[inputStream.readUnsignedInt30()];
						var kind = inputStream.readUnsignedByte();

						var mkind = kind & 0xF;
						switch (mkind)
						{
							case 0: //Slot
							case 6: //Const
								var propertyConstruct = Construct.getNewPropertyConstruct();
								propertyConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, multiname.name);
								propertyConstruct.staticToken = Token.getNewToken(Token.StaticTokenType, 'static');

								var slot_id = inputStream.readUnsignedInt30();
								var type_multiname = const_pool.multinames[inputStream.readUnsignedInt30()];

								if (!type_multiname.name) type_multiname.name = '*';
								var return_type = (type_multiname.namespace.name) ? type_multiname.namespace.name + '.' + type_multiname.name : type_multiname.name;

								var typeConstruct = Construct.getNewTypeConstruct();
								var nameConstruct = Construct.getNewNameConstruct();
								var parts = return_type.split('.');
								if (return_type)
								{
									for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
									typeConstruct.nameConstruct = nameConstruct;
								}
								else
								{
									typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
								}
								propertyConstruct.typeConstruct = typeConstruct;

								var vindex = inputStream.readUnsignedInt30();
								var vkind = null;
								if (vindex != 0) vkind = inputStream.readUnsignedByte();

								var ikind = multiname.namespace.kind;
								if (ikind == 5) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'private');
								if (ikind == 22) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'public');
								if (ikind == 24) propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, 'protected');
								if (ikind == 8) propertyConstruct.namespaceValueToken = Token.getNewToken(Token.IdentifierTokenType, multiname.namespace.name);

								if (vkind == 8) propertyConstruct.namespaceKeywordToken = Token.getNewToken(Token.NamespaceKeywordTokenType, 'namespace');

								classConstruct.propertyConstructs.push(propertyConstruct);
								break;

							case 1: //Method
							case 2: //Getter
							case 3: //Setter
								var disp_id = inputStream.readUnsignedInt30();

								var index = inputStream.readUnsignedInt30();
								var method = methods[index];
								methods_in_class[index] = index;

								var methodConstruct = Construct.getNewMethodConstruct();
								methodConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, multiname.name);
								methodConstruct.staticToken = Token.getNewToken(Token.StaticTokenType, 'static');

								var typeConstruct = Construct.getNewTypeConstruct();
								var nameConstruct = Construct.getNewNameConstruct();
								if (method.return_type)
								{
									var parts = method.return_type.split('.');
									for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
									typeConstruct.nameConstruct = nameConstruct;
								}
								else
								{
									typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
								}
								methodConstruct.typeConstruct = typeConstruct;

								if (mkind == 2) methodConstruct.getToken = Token.getNewToken(Token.GetTokenType, 'get');
								if (mkind == 3)
								{
									methodConstruct.setToken = Token.getNewToken(Token.SetTokenType, 'set');

									var parameterConstruct = Construct.getNewParameterConstruct();
									parameterConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, 'value');
									parameterConstruct.typeConstruct = typeConstruct;

									methodConstruct.parameterConstructs.push(parameterConstruct);
								}

								var parts = method.name.split('/');
								if (mkind == 2 || mkind == 3) parts.pop();
								var part = parts.pop() || '';
								var namespace = 'public';
								if (!isInterface && part.indexOf(':') != -1) namespace = part.split(':')[0];

								methodConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, namespace);

								classConstruct.methodConstructs.push(methodConstruct);
								break;

							case 4: //Class
								var slot_id = inputStream.readUnsignedInt30();
								var classi = inputStream.readUnsignedInt30();
								break;

							case 5: //Function
								var slot_id = inputStream.readUnsignedInt30();

								var index = inputStream.readUnsignedInt30();
								var method = methods[index];
								methods_in_class[index] = index;
								break;
						}

						if (kind & (0x4 << 4))
						{
							var metadata_count = inputStream.readUnsignedInt30();
							for (var k = 0; k < metadata_count; k++)
							{
								inputStream.readUnsignedInt30();
							}
						}
					}
				}

				//package functions
				for (var m = 0; m < methods.length; m++)
				{
					if (methods_in_class[m] || !methods[m].name || methods[m].name.split('/').length > 1) continue;

					var method = methods[m];
					var innerID = method.name.split(':').join('.');
					var innerFID = method.name;
					var innerSID = innerID.split('.').pop();

					var innerRootConstruct = rootConstructs[innerID] = Construct.getNewRootConstruct();
					var packageConstruct = Construct.getNewPackageConstruct();
					innerRootConstruct.packageConstruct = packageConstruct;
					packageConstruct.rootConstruct = innerRootConstruct;
					var methodConstruct = Construct.getNewMethodConstruct();
					methodConstruct.rootConstruct = innerRootConstruct;
					methodConstruct.packageConstruct = packageConstruct;
					methodConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, innerSID);
					var typeConstruct = Construct.getNewTypeConstruct();
					var nameConstruct = Construct.getNewNameConstruct();
					if (method.return_type)
					{
						var parts = method.return_type.split('.');
						for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
						typeConstruct.nameConstruct = nameConstruct;
					}
					else
					{
						typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
					}
					methodConstruct.typeConstruct = typeConstruct;

					packageConstruct.methodConstruct = methodConstruct;

					var nameConstruct = Construct.getNewNameConstruct();
					var parts = innerID.split('.');
					parts.pop();
					for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
					packageConstruct.nameConstruct = nameConstruct;
				}

				//package namespaces
				if (!rootConstructs[id])
				{
					var innerSID = id.split('.').pop();

					var innerRootConstruct = rootConstructs[id] = Construct.getNewRootConstruct();
					var packageConstruct = Construct.getNewPackageConstruct();
					innerRootConstruct.packageConstruct = packageConstruct;
					packageConstruct.rootConstruct = innerRootConstruct;
					var propertyConstruct = Construct.getNewPropertyConstruct();
					propertyConstruct.packageConstruct = packageConstruct;
					propertyConstruct.rootConstruct = innerRootConstruct;
					propertyConstruct.identifierToken = Token.getNewToken(Token.IdentifierTokenType, innerSID);
					var typeConstruct = Construct.getNewTypeConstruct();
					var nameConstruct = Construct.getNewNameConstruct();
					nameConstruct.identifierTokens.push('Namespace');
					propertyConstruct.namespaceToken = Token.getNewToken(Token.IdentifierTokenType, innerSID);
					propertyConstruct.namespaceKeywordToken = Token.getNewToken(Token.NamespaceKeywordTokenType, 'namespace');
					packageConstruct.propertyConstruct = propertyConstruct;

					typeConstruct.nameConstruct = nameConstruct;
					propertyConstruct.typeConstruct = typeConstruct;

					var nameConstruct = Construct.getNewNameConstruct();
					var parts = id.split('.');
					parts.pop();
					for (var k = 0; k < parts.length; k++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, parts[k]));
					packageConstruct.nameConstruct = nameConstruct;
				}
			}

			for (var id in rootConstructs) //TODO.. do this check before adding
			{
				//for weeding out classes like: _e9a752f233536079fc4486d6ac92a1b05a633a5657d5b83ad7fac2246298b191_flash_display_Sprite //TODO.. improve
				if (id.indexOf('_') == 0) delete rootConstructs[id];
			}

			return rootConstructs;
		}
	}

	internal class SWFFF
	{
		var _inputStream:InputStreamWrapper;
		var _totalBytes;

		public function SWFFF(inputStream)
		{
			_inputStream = new InputStreamWrapper(inputStream);
		}

		public function readHeader()
		{
			var compressed = _inputStream.readUnsignedByte() == 0x43;
			_inputStream.readUnsignedByte();
			_inputStream.readUnsignedByte();
			_inputStream.readUnsignedByte();

			_totalBytes = _inputStream.readUnsignedInt();
			if (compressed)
			{
				var byteArray = new ByteArray();
				_inputStream.inputStream.readBytes(byteArray, 0, _inputStream.bytesAvailable);
				byteArray.uncompress("deflate");

				_inputStream.inputStream = byteArray;
			}

			var bits = _inputStream.readBits(5, true);
			_inputStream.readBits(bits);
			_inputStream.readBits(bits);
			_inputStream.readBits(bits);
			_inputStream.readBits(bits);

			_inputStream.readUnsignedShort();
			_inputStream.readUnsignedShort();

			return new Header(_totalBytes, compressed);
		}

		public function readTag()
		{
			if (_inputStream.bytesRead == _totalBytes) return null;

			var tagCodeAndLength = _inputStream.readUnsignedShort();
			var tagCode = tagCodeAndLength >> 6;
			var length = ((tagCodeAndLength & 0x3F) != 0x3F) ? tagCodeAndLength & 0x3F : _inputStream.readUnsignedInt();

			return new Tag(tagCode, _inputStream.readBytes(length));
		}


	}

	internal class Header
	{
		var totalBytes;
		var compressed;

		public function Header(totalBytes, compressed)
		{
			this.totalBytes = totalBytes;
			this.compressed = compressed;
		}
	}

	internal class Tag
	{
		var code;
		var content;

		public function Tag(code, content)
		{
			this.code = code;
			this.content = content;
		}
	}

	internal class InputStreamWrapper
	{
		public function set inputStream(inputStream) { _inputStream = inputStream; }

		public function get inputStream() { return _inputStream; }

		public function get bytesRead() { return _inputStream.position; }

		public function get bytesAvailable() { return _inputStream.bytesAvailable; }

		private var _inputStream:ByteArray;
		private var _bitBuffer = 0;
		private var _bitPosition = 0;

		public function InputStreamWrapper(inputStream:ByteArray)
		{
			_inputStream = inputStream;
		}

		public function readBytes(bytesToRead):ByteArray
		{
			var byteArray:ByteArray = new ByteArray();
			_inputStream.readBytes(byteArray, 0, bytesToRead);

			return byteArray;
		}

		public function readUnsignedByte()
		{
			return _inputStream.readUnsignedByte();
		}

		public function readUnsignedShort()
		{
			return (_inputStream.readUnsignedByte()) | _inputStream.readUnsignedByte() << 8;
		}

		public function readUnsignedInt30()
		{
			var result = _inputStream.readUnsignedByte();
			if (!(result & 0x80)) return result;

			result = result & 0x7F | _inputStream.readUnsignedByte() << 7;
			if (!(result & 0x4000)) return result;

			result = result & 0x3FFF | _inputStream.readUnsignedByte() << 14;
			if (!(result & 0x200000)) return result;

			result = result & 0x1FFFFF | _inputStream.readUnsignedByte() << 21;
			if (!(result & 0x10000000)) return result;

			return result & 0x0FFFFFFF | _inputStream.readUnsignedByte() << 28;
		}

		public function readUnsignedInt()
		{
			_inputStream.readUnsignedInt();
		}

		public function readFloat()
		{
			return _inputStream.readFloat();
		}

		public function readDouble()
		{
			return _inputStream.readDouble();
		}

		public function readUTF()
		{
			var position = _inputStream.position;
			while (_inputStream.position < length)
			{
				if (_inputStream.readUnsignedByte() == 0x00) break;
			}

			var bytes = new ByteArray();
			_inputStream.readBytes(bytes, 0, _inputStream.position - position);

			return bytes.readUTFBytes(bytes.length);
		}

		public function readUTFBytes(length)
		{
			return _inputStream.readUTFBytes(length);
		}

		public function readBits(bitsToRead, clearBits:Boolean=false)
		{
			if (clearBits) _bitBuffer = _bitPosition = 0;
			var result = 0;
			for (var i = bitsToRead - 1; i >= 0; i--) result |= readBit() << i;

			return result;
		}

		public function readBit(clearBits:Boolean=false)
		{
			if (clearBits) _bitBuffer = _bitPosition = 0;

			if (!_bitPosition)
			{
				_bitBuffer = _inputStream.readUnsignedByte();
				_bitPosition = 8;
			}

			var bit = _bitBuffer & (1 << (_bitPosition - 1));
			_bitPosition--;

			return bit ? 1 : 0;
		}
	}
}
