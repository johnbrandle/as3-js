/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.core
{
	import sweetrush.*;
    import sweetrush.obj.Construct;
    import sweetrush.obj.Token;

    public class Analyzer
    {
        private var _rootConstruct;
        private var _rootConstructs:Object;
        private var _translationMode:int;
        private var _doNotTreatPrivateMethodsAsNative:Boolean = false;
        private var _treatThisAsDynamic:Boolean = false;

        private var _indent = -1;
        private var _count = -1; //for for each loops
        private var _level:int = 0; //for identifier, namespace, and type scope

        private var _inClosure = false;
        private var _inNamespacedFunction = false;
        private var _inStaticFunction = false;
        private var _inIfStatement = 0;
        private var _returnTypeStack = [];

        //NOTE: prefixing all identifier, namespace, type, keys with '_' to prevent collisions with Object properties. Example: 'hasOwnProperty'
        private var _identifiers = [{}];
        private var _namespaces = [{}];
        private var _useNamespaces = [[]];
        private var _types = {};

        private static const globalIdentifiers:Array =
        [
            //as3
            {name:'trace', returnType:'void'},
            {name:'parseInt', returnType:'Number'},
            {name:'parseFloat', returnType:'Number'},
            {name:'isNaN', returnType:'Boolean'},
            {name:'isFinite', returnType:'Boolean'},
            {name:'escape', returnType:'String'},
            {name:'unescape', returnType:'String'},
            {name:'decodeURIComponent', returnType:'String'},
            {name:'encodeURIComponent', returnType:'String'},
            {name:'decodeURI', returnType:'String'},
            {name:'encodeURI', returnType:'String'},
            {name:'isXMLName', returnType:'Boolean'},

            //internal
            {name:'$es4', returnType:'Object'},

            //non-as3-identifiers, browser/node specific
            {name:'window', returnType:'Object'},
            {name:'document', returnType:'Object'},
            {name:'console', returnType:'Object'},
            {name:'$', returnType:'Object'},
            {name:'_', returnType:'Object'},
            {name:'alert', returnType:'Object'},
            {name:'debugger', returnType:'Object'},
            {name:'setInterval', returnType:'Object'},
            {name:'clearInterval', returnType:'Object'},
            {name:'setTimeout', returnType:'Object'},
            {name:'clearTimeout', returnType:'Object'},

            //node specific
            {name:'require', returnType:'Object'},
            {name:'global', returnType:'Object'},
            {name:'process', returnType:'Object'},
            {name:'__dirname', returnType:'String'}
        ];

        private static const _globals:Object = {'ArgumentError':1, 'Array':1, 'Boolean':1, 'Class':1, 'JSON':1, 'Walker':1, 'UninitializedError':1,
            'Date':1, 'DefinitionError':1, 'Error':1, 'EvalError':1, 'Function':1, 'int':1, 'Math':1, 'Namespace':1,
            'Number':1, 'Object':1, 'QName':1, 'RangeError':1, 'ReferenceError':1, 'RegExp':1, 'SecurityError':1,
            'String':1, 'SyntaxError':1, 'TypeError':1, 'uint':1, 'URIError':1, 'Vector':1, 'VerifyError':1, 'XML':1, 'XMLList':1};

        public static function analyze(rootConstruct, rootConstructs, translationMode:Number, doNotTreatPrivateMethodsAsNative:Boolean=false, treatThisAsDynamic:Boolean=false):Object
        {
            return new Analyzer().analyze(rootConstruct, rootConstructs, translationMode, doNotTreatPrivateMethodsAsNative, treatThisAsDynamic);
        }

        public function analyze(rootConstruct, rootConstructs, translationMode:Number, doNotTreatPrivateMethodsAsNative:Boolean=false, treatThisAsDynamic:Boolean=false):Object
        {
            _rootConstruct = rootConstruct;
            _rootConstructs = rootConstructs;
            _translationMode = translationMode;
            _treatThisAsDynamic = treatThisAsDynamic;
            _doNotTreatPrivateMethodsAsNative = (translationMode == 1 || translationMode == 3) || doNotTreatPrivateMethodsAsNative;

            registerNamespace('public');
            registerNamespace('private');
            registerNamespace('protected');
            registerNamespace('internal');

            registerType('void', null, null, true);
            registerType('*', null, null, true);
            registerType('PACKAGE', null, null, true);

            for (var name in _rootConstructs)
            {
                var construct = _rootConstructs[name];

                if (!construct.packageConstruct) continue;

                if (construct.packageConstruct.classConstruct) registerType(name, construct, construct.packageConstruct.classConstruct, _globals[name]);
                if (construct.packageConstruct.interfaceConstruct) registerType(name, construct, construct.packageConstruct.interfaceConstruct, _globals[name]);
            }

            for (var i = 0; i < globalIdentifiers.length; i++) registerIdentifier(globalIdentifiers[i].name);

            var packageConstruct = _rootConstruct.packageConstruct;

            ////////REGISTER IDENTIFIER - INTERNAL CLASSES////////
            for (var i = 0; i < _rootConstruct.classConstructs.length; i++) registerIdentifier(_rootConstruct.classConstructs[i], _rootConstruct.classConstructs[i]);

            ////////REGISTER IDENTIFIER - INTERNAL INTERFACES////////
            for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++) registerIdentifier(_rootConstruct.interfaceConstructs[i], _rootConstruct.interfaceConstructs[i]);

            ////////REGISTER IDENTIFIER - INTERNAL PROPERTIES////////
            for (var i = 0; i < _rootConstruct.propertyConstructs.length; i++) registerIdentifier(_rootConstruct.propertyConstructs[i], _rootConstruct.propertyConstructs[i]);

            ////////REGISTER IDENTIFIER - INTERNAL METHODS////////
            for (var i = 0; i < _rootConstruct.methodConstructs.length; i++) registerIdentifier(_rootConstruct.methodConstructs[i], _rootConstruct.methodConstructs[i]);

            ////////REGISTER USE NAMESPACE - PACKAGE////////
            for (var i = 0; i < packageConstruct.useConstructs.length; i++) registerUseNamespace(packageConstruct.useConstructs[i]);

            if (packageConstruct.classConstruct != null && packageConstruct.classConstruct.UNIMPLEMENTEDToken == null) analyzeClassConstruct(packageConstruct.classConstruct);
            if (packageConstruct.interfaceConstruct != null && packageConstruct.interfaceConstruct.UNIMPLEMENTEDToken == null) analyzeInterfaceConstruct(packageConstruct.interfaceConstruct);
            if (packageConstruct.methodConstruct != null && packageConstruct.methodConstruct.UNIMPLEMENTEDToken == null) analyzeFunctionConstruct(packageConstruct.methodConstruct);
            if (packageConstruct.propertyConstruct != null) analyzePropertyConstruct(packageConstruct.propertyConstruct);

            return _rootConstruct;
        }

        private function upLevel()
        {
            _indent++;
            _level++;
            _identifiers[_level] = {};
            _namespaces[_level] = {};
            _useNamespaces[_level] = [];
            return _level;
        }

        private function downLevel()
        {
            delete _identifiers[_level];
            delete _namespaces[_level];
            delete _useNamespaces[_level];
            _indent--;
            _level--;
            return _level;
        }

        private function output()
        {
            trace('outputing...');
            var level = _level;
            while (level >= 0)
            {
                trace('level: ' + level);
                for (var name in _namespaces[level]) trace('\t' + _namespaces[level][name] + '\t\t\t [[[' + name.substring(1) + ']]]');
                for (var name in _identifiers[level]) trace('\t' + _identifiers[level][name] + '\t\t\t [[[' + name.substring(1) + ']]]');
                level--;
            }
            for (var name in _types) trace('\t' + _types[name] + '\t\t\t [[[' + name.substring(1) + ']]]');
            for (var i = 0; i < getUseNamespaces().length; i++) trace('UseNamespace: ' + getUseNamespaces()[i]);
        }

        private function lookupConstructInRootConstruct(rootConstruct, object)
        {
            if (!rootConstruct || !object)
            {
                output();
                throw new Error('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object);
            }
            else if (object is String)
            {
                for (var i = 0; i < rootConstruct.classConstructs.length; i++) if (rootConstruct.classConstructs[i].identifierToken.data == object) return rootConstruct.classConstructs[i];
                for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++) if (rootConstruct.interfaceConstructs[i].identifierToken.data == object) return rootConstruct.interfaceConstructs[i];
                if (rootConstruct.packageConstruct.classConstruct) return rootConstruct.packageConstruct.classConstruct;
                if (rootConstruct.packageConstruct.interfaceConstruct) return rootConstruct.packageConstruct.interfaceConstruct;
                if (rootConstruct.packageConstruct.propertyConstruct) return rootConstruct.packageConstruct.propertyConstruct;
                if (rootConstruct.packageConstruct.methodConstruct) return rootConstruct.packageConstruct.methodConstruct;

                throw new Error('could not lookup construct in construct: ' + object);
            }
            if (object.constructor == Construct.NameConstruct) return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object));
            else if (object.constructor == Construct.ImportConstruct) return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));
        }

        private function lookupRootConstruct(rootConstruct, object)
        {
            if (!rootConstruct || !object) throw new Error('cannot find empty rootConstruct/object: ' + rootConstruct + ', ' + object);
            else if (object is String)
            {
                for (var i = 0; i < rootConstruct.classConstructs.length; i++) if (rootConstruct.classConstructs[i].identifierToken.data == object) return rootConstruct;
                for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++) if (rootConstruct.interfaceConstructs[i].identifierToken.data == object) return rootConstruct;
                var rootConstructs = _rootConstructs;
                if (rootConstructs[object]) return rootConstructs[object];

                throw new Error('could not lookup root construct: ' + object);
            }
            else if (object.constructor == Construct.ImportConstruct) return lookupRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));

            throw new Error('unknown object passed into lookupRootConstruct: ' + object.constructor);
        }

        private function lookupPackageName(construct, object)
        {
            var fullyQualifiedName = lookupFullyQualifiedName(construct, object);
            var parts = fullyQualifiedName.split('.');
            if (parts.length > 1)
            {
                parts.pop();
                return parts.join('.');
            }

            return '';
        }

        private function lookupFullyQualifiedName(construct, object)
        {
            if (!construct || !object) throw new Error('cannot find empty construct/object: ' + construct + ', ' + object);
            else if (object is String)
            {
                //if has a . it should already be a fullyQualifiedName
                if (object.split('.').length > 1)
                {
                    if (_rootConstructs[object]) return object;
                    throw new Error('could not lookup fully qualified name: ' + object);
                }

                if (construct.identifierToken.data == object)
                {
                    if (construct.packageConstruct) return Construct.nameConstructToString(construct.packageConstruct.nameConstruct) + '.' + object;
                    else return object;
                }

                //check internal classes / interfaces
                for (var i = 0; i < construct.rootConstruct.classConstructs.length; i++) if (construct.rootConstruct.classConstructs[i].identifierToken.data == object) return object;
                for (var i = 0; i < construct.rootConstruct.interfaceConstructs.length; i++) if (construct.rootConstruct.interfaceConstructs[i].identifierToken.data == object) return object;

                //check imports
                var importConstructs = (construct.isInternal) ? construct.rootConstruct.importConstructs : construct.packageConstruct.importConstructs;
                for (var i = 0; i < importConstructs.length; i++)
                {
                    var nameConstruct = importConstructs[i].nameConstruct;

                    if (nameConstruct.identifierTokens[nameConstruct.identifierTokens.length - 1].data == object)
                    {
                        if (_rootConstructs[Construct.nameConstructToString(nameConstruct)]) return Construct.nameConstructToString(nameConstruct);
                        throw new Error('could not lookup fully qualified name: ' + object + ', ' + Construct.nameConstructToString(nameConstruct));
                    }
                }

                //check implicit imports
                if (!construct.isInternal)
                {
                    var packageName = (construct.packageConstruct.nameConstruct) ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '';
                    for (var id in _rootConstructs)
                    {
                        var innerPackageName = (_rootConstructs[id].packageConstruct.nameConstruct) ? Construct.nameConstructToString(_rootConstructs[id].packageConstruct.nameConstruct) : '';
                        var name = id.split('.').pop();
                        if (packageName == innerPackageName && object == name)
                        {
                            if (_rootConstructs[id]) return id;
                            throw new Error('could not lookup fully qualified name: ' + object + ', ' + id);
                        }
                    }
                }

                //global type
                if (_types.hasOwnProperty('_' + object)) return object;

                output();
                throw new Error('could not lookup fully qualified name: ' + object + ' in ' + construct.identifierToken.data);
            }
            else if (object.constructor == Construct.NameConstruct) return lookupFullyQualifiedName(construct, Construct.nameConstructToString(object));

            throw new Error('could not lookup fully qualified name: ' + object);
        }

        private function registerNamespace(object, construct=null)
        {
            if (!object) return;
            else if (object == 'public' || object == 'private' || object == 'protected' || object == 'internal')
            {
                _namespaces[_level]['_' + object] = new NamespaceObj(object);
                _namespaces[_level]['_' + object].isCustom = false;
                return;
            }

            throw new Error('unknown object passed into registerNamespace: ' + object.constructor);
        }

        private function lookupNamespace(object)
        {
            if (!object) return lookupNamespace('internal');
            if (object is String)
            {
                var level = _level;
                while (level >= 0)
                {
                    if (_namespaces[level].hasOwnProperty('_' + object)) return _namespaces[level]['_' + object];
                    level--;
                }

                output();
                throw new Error('could not lookup namespace: ' + object);
            }
            if (object.constructor == "token" && object.type == Token.IdentifierTokenType) return lookupNamespace(object.data);

            throw new Error('unknown object passed into lookupNamespace: ' + object.constructor);
        }

        private function hasNamespace(object)
        {
            if (!object) return true;
            if (object is String)
            {
                var level = _level;
                while (level >= 0)
                {
                    if (_namespaces[level].hasOwnProperty('_' + object)) return true;
                    level--;
                }

                return false;
            }
            if (object.constructor == Construct.PropertyConstruct) return hasNamespace(object.identifierConstruct);
            if (object.constructor == "token" && object.type == Token.IdentifierTokenType) return hasNamespace(object.data);

            throw new Error('unknown object passed into lookupNamespace: ' + object.constructor);
        }

        private function registerUseNamespace(object)
        {
            if (!object) throw new Error('null object passed to registerUseNamespace');
            if (object.constructor == Construct.UseConstruct || object.constructor == Construct.UseStatement)
            {
                _useNamespaces[_level].push(object.namespaceIdentifierToken.data);
                return;
            }

            throw new Error('unknown object passed into registerUseNamespace: ' + object.constructor);
        }

        private function getUseNamespaces()
        {
            var useNamespaces = [];
            var level = _level;
            while (level >= 0)
            {
                for (var i = 0; i < _useNamespaces[level].length; i++) useNamespaces.push(_useNamespaces[level][i]);
                level--;
            }

            return useNamespaces;
        }

        private function registerIdentifier(object, construct=null)
        {
            if (!object) return;
            var identifier;
            var vectorType;
            if (object.constructor == Construct.PackageConstruct)
            {
                var packageName = object.nameConstruct ? Construct.nameConstructToString(object.nameConstruct) : '';
                var name = packageName.split('.').shift(); //get first part of package name ('flash.display' would be registered as 'flash')
                if (name) identifier = new Identifier(name, lookupType('PACKAGE', construct));

                if (object.classConstruct)
                {
                    identifier = registerIdentifier(object.classConstruct, object.classConstruct);
                    if (!object.isInternal && Construct.nameConstructToString(object.classConstruct.packageConstruct.nameConstruct)) _identifiers[_level]['_' + identifier.type.fullyQualifiedName] = identifier
                }
                else if (object.interfaceConstruct)
                {
                    identifier = registerIdentifier(object.interfaceConstruct, object.interfaceConstruct);
                    if (!object.isInternal && Construct.nameConstructToString(object.interfaceConstruct.packageConstruct.nameConstruct)) _identifiers[_level]['_' + identifier.type.fullyQualifiedName] = identifier
                }
                else if (object.methodConstruct) identifier = registerIdentifier(object.methodConstruct, object.methodConstruct);
                else if (object.propertyConstruct) identifier = registerIdentifier(object.propertyConstruct, object.propertyConstruct);
                else throw new Error('could not register type: ' + object);

                if (!identifier) return;

                identifier.isImport = true;

                return identifier;
            }
            else if (object.constructor == Construct.ClassConstruct || object.constructor == Construct.InterfaceConstruct)
            {
                var type;
                if (object.isInternal) type = lookupType(object.identifierToken.data, construct);
                else if (Construct.nameConstructToString(object.packageConstruct.nameConstruct)) type = lookupType(Construct.nameConstructToString(object.packageConstruct.nameConstruct) + '.' + object.identifierToken.data);
                else type = lookupType(object.identifierToken.data);

                identifier = new Identifier(object.identifierToken.data, type);
                identifier.isType = true;
                identifier.construct = construct;
                identifier.isInternal = object.isInternal;

                var type = new Type(object.identifierToken.data, identifier.type.fullyQualifiedName, object.rootConstruct, construct);
                _types['_' + identifier.type.fullyQualifiedName] = type;
                _types['_' + identifier.type.name] = type;
            }
            else if (object.constructor == Construct.ImportConstruct)
            {
                var rootConstruct = lookupRootConstruct(_rootConstruct, object);
                var innerConstruct = lookupConstructInRootConstruct(rootConstruct, object);

                identifier = new Identifier(object.nameConstruct.identifierTokens[0].data, lookupType('PACKAGE', construct), null);
                identifier.isPackage = true;

                _identifiers[_level]['_' + identifier.name] = identifier;

                identifier = new Identifier(innerConstruct.identifierToken.data, lookupType(innerConstruct.typeConstruct, construct), vectorType);
                identifier.isType = (innerConstruct.constructor == Construct.ClassConstruct || innerConstruct.constructor == Construct.InterfaceConstruct);
                identifier.construct = innerConstruct;
                identifier.isImport = true;
                identifier.isInternal = innerConstruct.isInternal;
                identifier.fullPackageName = Construct.nameConstructToString(object.nameConstruct);

                if (innerConstruct.namespaceKeywordToken)
                {
                    var namespaceObj = _namespaces[_level]['_' + innerConstruct.identifierToken.data] = new NamespaceObj(innerConstruct.identifierToken.data, lookupFullyQualifiedName(construct, innerConstruct.identifierToken.data), identifier);
                    namespaceObj.isStatic = true;
                    namespaceObj.namespaceIsPrivate = false;
                    identifier.isNamespace = namespaceObj;
                }

                identifier.namespaceObj = lookupNamespace(innerConstruct.namespaceToken);

                var type = new Type(innerConstruct.identifierToken.data, Construct.nameConstructToString(object.nameConstruct), rootConstruct, innerConstruct);
                _types['_' + innerConstruct.identifierToken.data] = type;
                _types['_' + Construct.nameConstructToString(object.nameConstruct)] = type;

                return _identifiers[_level]['_' + identifier.name] = _identifiers[_level]['_' + Construct.nameConstructToString(object.nameConstruct)] = identifier;
            }
            else if (object.constructor == Construct.ParameterConstruct)
            {
                identifier = new Identifier(object.identifierToken.data, lookupType(object.typeConstruct, construct));
                identifier.isVar = true;
            }
            else if (object.constructor == Construct.LabelStatement)
            {
                identifier = new Identifier(object.identifierToken.data, lookupType('void', construct));
                identifier.isVar = true;
            }
            else if (object.constructor == Construct.VarStatement || object.constructor == Construct.CatchStatement)
            {
                if (object.typeConstruct && object.typeConstruct.vectorNameConstruct) vectorType = lookupType(object.typeConstruct.vectorNameConstruct, construct);

                identifier = new Identifier(object.identifierToken.data, lookupType(object.typeConstruct, construct), vectorType);
                identifier.isVar = true;
            }
            else if (object.constructor == Construct.FunctionExpression)
            {
                identifier = new Identifier(object.identifierToken.data, lookupType(object.typeConstruct, construct));
                identifier.isVar = true;
            }
            else if (object == 'super') identifier = new Identifier(object, lookupType(construct.identifierToken.name, construct));
            else if (object == 'this')
            {
                if (!_treatThisAsDynamic) identifier = new Identifier(object, lookupType(construct.identifierToken.name, construct));
                else identifier = new Identifier(object, lookupType('Object', construct));
            }
            else if (object == '$thisp') identifier = new Identifier(object, lookupType(construct.identifierToken.name, construct));
            else if (object == 'arguments') identifier = new Identifier(object, lookupType('Array'));
            else if (object is String)
            {
                var globalIdentifier = null;
                for (var i = 0; i < globalIdentifiers.length; i++)
                {
                    if (object != globalIdentifiers[i].name) continue;

                    globalIdentifier = globalIdentifiers[i];
                    break;
                }

                if (globalIdentifier)
                {
                    identifier = new Identifier(object, lookupType(globalIdentifier.returnType, construct));
                    identifier.isGlobal = true;
                }
                else
                {
                    identifier = new Identifier(object, lookupType(object, construct));
                    identifier.isType = true;
                    identifier.isGlobal = true;
                    identifier.construct = lookupType(object, construct).construct;
                }
            }
            if (object.constructor == Construct.PropertyConstruct || object.constructor == Construct.MethodConstruct || object.constructor == Construct.VarStatement)
            {
                if (object.typeConstruct && object.typeConstruct.vectorNameConstruct) vectorType = lookupType(object.typeConstruct.vectorNameConstruct, construct);
            }
            if (object.constructor == Construct.PropertyConstruct)
            {
                if (object.namespaceToken && object.namespaceToken.data == 'private' && !_doNotTreatPrivateMethodsAsNative) object.isNative = true;
                if (object.namespaceToken && object.namespaceToken.data == 'private') object.isPrivate = true;

                var type = lookupType(object.typeConstruct, construct);

                if (object.isNative && !object.valueExpression && type.fullyQualifiedName != '*' && type.fullyQualifiedName != 'void')
                {
                    switch (type.fullyQualifiedName)
                    {
                        case 'Number':
                            object.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
                            break;
                        case 'uint':
                        case 'int':
                            object.valueExpression = Construct.getNewNumberExpression();
                            object.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
                            break;
                        case 'Boolean':
                            object.valueExpression = Construct.getNewBooleanExpression();
                            object.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
                            break;
                        default:
                            object.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
                    }
                }

                identifier = new Identifier(object.identifierToken.data, type, vectorType);
                identifier.isProperty = !object.isNative;
                identifier.isInternal = object.isInternal;
                identifier.isNative = object.isNative;
                identifier.isVar = identifier.isVarInitialized = object.isNative;
                identifier.isPrivate = object.isPrivate && !object.isNative;

                if (object.isNative && object.valueExpression)
                {
                    object.coerce = isCoerceRequired(analyzeExpression(object.valueExpression, _indent, false, construct), identifier.type, identifier);
                }

                if (object.namespaceKeywordToken)
                {
                    var namespaceObj = _namespaces[_level]['_' + object.identifierToken.data] = new NamespaceObj(object.identifierToken.data, undefined, identifier);
                    if (object.staticToken) namespaceObj.isStatic = true;
                    namespaceObj.namespaceIsPrivate = object.namespaceToken.data == 'private';
                    identifier.isNamespace = namespaceObj;
                }

                identifier.namespaceObj = lookupNamespace(object.namespaceToken);

                if (object.staticToken)
                {
                    identifier.isStatic = true;
                    identifier.scope = lookupType(construct.identifierToken.data, construct);
                }
            }
            else if (object.constructor == Construct.MethodConstruct)
            {
                if (object.namespaceToken && object.namespaceToken.data == 'private' && !_doNotTreatPrivateMethodsAsNative) object.isNative = true;
                if (object.namespaceToken && object.namespaceToken.data == 'private') object.isPrivate = true;

                identifier = new Identifier(object.identifierToken.data, lookupType(object.typeConstruct, construct), vectorType);
                identifier.isMethod = !object.isNative;
                identifier.isInternal = object.isInternal;
                identifier.isNative = object.isNative;
                identifier.isVar = identifier.isVarInitialized = object.isNative;
                identifier.isPrivate = object.isPrivate && !object.isNative;

                if (object.namespaceKeywordToken)
                {
                    /*
					var namespaceObj = _namespaces[_level]['_' + object.identifierToken.data] = new Namespace(object.identifierToken.data, undefined, identifier);
					if (object.staticToken) namespaceObj.isStatic = true;
					identifier.isNamespace = namespaceObj;
					*/
                    throw new Error('test');
                }

                identifier.namespaceObj = lookupNamespace(object.namespaceToken);

                if (object.staticToken)
                {
                    identifier.isStatic = true;
                    identifier.scope = lookupType(construct.identifierToken.data, construct);
                }
            }
            else if (object.constructor == Construct.VarStatement)
            {
                identifier = new Identifier(object.identifierToken.data, lookupType(object.typeConstruct, construct), vectorType);
                identifier.isVar = true;
            }
            else if (object is Type) identifier = new Identifier(object.name, object);

            if (identifier)
            {
                var name = (identifier.namespaceObj && identifier.namespaceObj.isCustom ? identifier.namespaceObj.name + ':::' : '') + identifier.name;
                return _identifiers[_level]['_' + name] = identifier;
            }
            throw new Error('unknown object passed into registerIdentifier: ' + object.constructor);
        }

        private function lookupIdentifier(object, namespaceObj=null)
        {
            if (!object) throw new Error('cannot find empty identifier');
            else if (object is String)
            {
                if (object == 'Vector') object = 'Array';
                if (namespaceObj && namespaceObj.isCustom) object = namespaceObj.name + ':::' + object;

                var level = _level;
                var useNamespaces = getUseNamespaces();

                while (level >= 0)
                {
                    if (_identifiers[level].hasOwnProperty('_' + object)) return _identifiers[level]['_' + object];
                    if (!namespaceObj && useNamespaces.length)
                    {
                        for (var i = 0; i < useNamespaces.length; i++)
                        {
                            var innerObject = useNamespaces[i] + ':::' + object;
                            if (_identifiers[level].hasOwnProperty('_' + innerObject)) return _identifiers[level]['_' + innerObject];
                        }
                    }
                    level--;
                }

                output();
                throw new Error('could not lookup identifier: ' + object);
            }
            else if (object.constructor == Construct.IdentifierConstruct) return lookupIdentifier(object.identifierToken.data, namespaceObj);
            else if (object.constructor == Construct.MethodConstruct || object.constructor == Construct.PropertyConstruct) return lookupIdentifier(object.identifierToken.data, lookupNamespace(object.namespaceToken));
            else if (object.constructor == Construct.ThisConstruct) return lookupIdentifier('this');
            else if (object.constructor == Construct.SuperConstruct) return lookupIdentifier('super');
            else if (object.constructor == Construct.NameConstruct) return lookupIdentifier(Construct.nameConstructToString(object), namespaceObj);
            else if (object.constructor == Construct.PackageConstruct)
            {
                if (object.classConstruct) return lookupIdentifier(object.classConstruct.identifierToken.data);
                else if (object.interfaceConstruct) return lookupIdentifier(object.interfaceConstruct.identifierToken.data);
                else if (object.methodConstruct) return lookupIdentifier(object.methodConstruct.identifierToken.data);
                else if (object.propertyConstruct) return lookupIdentifier(object.propertyConstruct.identifierToken.data);
            }

            throw new Error('unknown object passed into lookupIdentifier: ' + object.constructor);
        }

        private function hasIdentifier(object, namespaceObj=null, currentLevel:Boolean=false)
        {
            if (!object) throw new Error('cannot find empty identifier');
            else if (object is String)
            {
                if (object == 'Vector') object = 'Array';
                if (namespaceObj && namespaceObj.isCustom) object = namespaceObj.name + ':::' + object;

                var level = _level;
                var useNamespaces = getUseNamespaces();

                while (level >= 0)
                {
                    if (_identifiers[level].hasOwnProperty('_' + object)) return true;
                    if (!namespaceObj && useNamespaces.length)
                    {
                        for (var i = 0; i < useNamespaces.length; i++)
                        {
                            var innerObject = useNamespaces[i] + ':::' + object;
                            if (_identifiers[level].hasOwnProperty('_' + innerObject)) return true;
                        }
                    }

                    if (currentLevel) break; //only search in the current level
                    level--;
                }

                return false;
            }
            else if (object.constructor == Construct.PropertyConstruct)
            {
                return hasIdentifier(object.identifierToken.data, lookupNamespace(object.namespaceToken)); //TODO
            }
            else if (object.constructor == Construct.MethodConstruct)
            {
                return hasIdentifier(object.identifierToken.data, lookupNamespace(object.namespaceToken)); //TODO
            }

            throw new Error('unknown object passed into hasIdentifier: ' + object.constructor);
        }

        private function registerType(object, rootConstruct, construct, isGlobal)
        {
            if (!object) throw new Error('cannot register empty type');
            else if (object == 'PACKAGE')
            {
                var type = new Type(object, object, rootConstruct, construct);
                type.isGlobal = isGlobal;
                _types['_' + object] = type;
                return;
            }
            else if (object is String)
            {
                if (object == 'Vector') return;
                var type = new Type(object, object, rootConstruct, construct);
                type.isGlobal = isGlobal;
                _types['_' + object] = type;

                if (isGlobal) registerIdentifier(object, rootConstruct);
                return;
            }

            throw new Error('unknown object passed into registerType: ' + object.constructor);
        }

        private function lookupType(object, construct=null)
        {
            if (!object) return lookupType('void', construct);
            else if (object is String)
            {
                if (object == 'Vector') object = 'Array';
                if (_types.hasOwnProperty('_' + object)) return _types['_' + object];

                if (!construct)
                {
                    output();
                    throw new Error('cound not lookup type: ' + object);
                }

                var fullyQualifiedName = lookupFullyQualifiedName(construct, object);

                return _types['_' + object] = (construct.isInternal) ? new Type(object, fullyQualifiedName, _rootConstructs[fullyQualifiedName], construct) : new Type(object, fullyQualifiedName, _rootConstructs[fullyQualifiedName], lookupConstructInRootConstruct(_rootConstructs[fullyQualifiedName], fullyQualifiedName));
            }
            else if (object.constructor == Construct.TypeConstruct)
            {
                if (!object.nameConstruct) return lookupType('void', construct);
                var name = (Construct.nameConstructToString(object.nameConstruct) == 'Vector') ? 'Array' : Construct.nameConstructToString(object.nameConstruct);
                return lookupType(name, construct);
            }
            else if (object.constructor == Construct.NameConstruct) return lookupType(Construct.nameConstructToString(object), construct);

            throw new Error('unknown object passed into lookupType: ' + object.constructor);
        }

        private function analyzeImplicitImports(construct)
        {
            if (construct.isInternal) return;

            var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;

            var rootConstructs = {};
            outer: for (var id in _rootConstructs)
            {
                var rootConstruct = _rootConstructs[id];

                if (!rootConstruct) throw new Error('Root construct null for id: ' + id);
                if (!rootConstruct.packageConstruct) throw new Error('Package construct missing in: ' + id);
                if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct) continue;
                if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct) continue;
                if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct)) continue;

                var identifier = lookupIdentifier(rootConstruct.packageConstruct);
                if (identifier.isGlobal) continue;

                var fullyQualifiedName = lookupFullyQualifiedName(construct, identifier.name);

                if (!lookupType(identifier.name, construct).accessed && !lookupIdentifier(identifier.name).accessed) continue;

                rootConstructs[id] = rootConstruct;

                construct.packageName = lookupPackageName(construct, identifier.name);
                var packageName = construct.packageName.split('.');

                var nameConstruct = Construct.getNewNameConstruct();

                for (var i = 0; i < packageName.length; i++) nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, packageName[i]));
                nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, identifier.name));

                var importConstruct = Construct.getNewImportConstruct();
                importConstruct.nameConstruct = nameConstruct;

                for (var i = 0; i < importConstructs.length; i++) if (Construct.nameConstructToString(importConstruct.nameConstruct) == Construct.nameConstructToString(importConstructs[i].nameConstruct)) continue outer;

                importConstructs.push(importConstruct);
            }
        }

        private function analyzeInterfaceConstruct(construct)
        {
            upLevel();

            registerConstruct(construct, true);
            analyzeImplicitImports(construct);

            if (construct.extendsNameConstructs.length)
            {
                for (var i = 0; i < construct.extendsNameConstructs.length; i++)
                {
                    var identifier = construct.extendsNameConstructs[i].identifier = lookupIdentifier(construct.extendsNameConstructs[i], construct);
                    var type = construct.extendsNameConstructs[i].type = lookupType(construct.extendsNameConstructs[i], construct);
                    type.accessed = true;
                }
            }

            var packageName = lookupPackageName(construct, construct.identifierToken.data);
            construct.packageName = packageName;

            downLevel();
        }

        private function analyzePropertyConstruct(construct)
        {
            analyzeExpression(construct.valueExpression, _indent, false, construct);
        }

        private function analyzeFunctionConstruct(construct)
        {
            upLevel();

            var importConstructs = _rootConstruct.packageConstruct.importConstructs;

            var accessor = construct.getToken || construct.setToken;

            ////////REGISTER IDENTIFIER - THIS////////
            registerIdentifier('this', construct);
            registerIdentifier('arguments', construct);

            ////////REGISTER IDENTIFIER/NAMESPACE - IMPLICIT IMPORTS////////
            for (var id in _rootConstructs)
            {
                var rootConstruct = _rootConstructs[id];

                if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct) continue;
                if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct) continue;
                if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct)) continue;
                if (_globals[id]) continue; //don't implicitly import any global objects

                ////////REGISTER IDENTIFIER/NAMESPACE - IMPLICIT IMPORT STATEMENT////////
                registerIdentifier(rootConstruct.packageConstruct, construct);
            }

            ////////REGISTER TYPE/IDENTIFIER/NAMESPACE - EXPLICIT IMPORTS////////
            for (var i = 0; i < importConstructs.length; i++)
            {
                ////////REGISTER TYPE/IDENTIFIER/NAMESPACE - EXPLICIT IMPORT STATEMENT////////
                registerIdentifier(importConstructs[i], construct);
            }

            analyzeClassFunction(construct);
            analyzeImplicitImports(construct);

            downLevel();

            function analyzeClassFunction(construct)
            {
                upLevel();

                ////////REGISTER IDENTIFIERS - INNER NAMED FUNCTIONS////////
                for (var j = 0; j < construct.namedFunctionExpressions.length; j++)
                {
                    ///////REGISTER IDENTIFIER - INNER NAMED FUNCTION////////
                    registerIdentifier(construct.namedFunctionExpressions[j], construct);
                }

                analyzeParameters(construct, construct);

                if (!construct.isJavaScript)
                {
                    _returnTypeStack.push(lookupType(construct.typeConstruct, construct));
                    analyzeStatements(construct.bodyStatements, _indent + 1, construct);
                    _returnTypeStack.pop();
                }

                downLevel();
            }
        }

        private function analyzeClassConstruct(construct)
        {
            upLevel();

            registerConstruct(construct, true);

            ////////REGISTER USE NAMESPACE - CLASS////////
            for (var i = 0; i < construct.useConstructs.length; i++) registerUseNamespace(construct.useConstructs[i]);

            analyzeNamespaces(construct);
            analyzeProperties(construct, true);
            analyzeClassInitializer(construct);
            analyzeMethods(construct, true);
            analyzeAccessors(construct, true);
            analyzeClassFunction(construct);
            analyzeInternalClasses(construct);
            analyzeInternalInterfaces(construct);
            analyzeClassReturnStatement(construct);

            analyzeImplicitImports(construct);

            downLevel();
        }

        private function analyzeClassInitializer(construct)
        {
            _inStaticFunction = true;

            //class initializers
            analyzeStatements(construct.initializerStatements, _indent + 2, construct);

            _inStaticFunction = false;
        }

        private function analyzeClassFunction(construct)
        {
            upLevel();

            registerConstruct(construct, false);

            //analyzeNamespaces(construct);
            analyzeProperties(construct, false);
            analyzeConstructor(construct);
            analyzeMethods(construct, false);
            analyzeAccessors(construct, false);

            downLevel();
        }

        private function analyzeInternalClasses(construct)
        {
            if (construct.isInternal) return;

            for (var i = 0; i < _rootConstruct.classConstructs.length; i++) analyzeClassConstruct(_rootConstruct.classConstructs[i]);
        }

        private function analyzeInternalInterfaces(construct)
        {
            if (construct.isInternal) return;

            for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++) analyzeInterfaceConstruct(_rootConstruct.interfaceConstructs[i]);
        }

        private function analyzeClassReturnStatement(construct)
        {
            if (construct.extendsNameConstruct)
            {
                var identifier = construct.extendsNameConstruct.identifier = lookupIdentifier(construct.extendsNameConstruct, construct);
                var type = construct.extendsNameConstruct.type = lookupType(construct.extendsNameConstruct, construct);
                type.accessed = true;
            }
            if (construct.implementsNameConstructs.length)
            {
                for (var i = 0; i < construct.implementsNameConstructs.length; i++)
                {
                    var identifier = construct.implementsNameConstructs[i].identifier = lookupIdentifier(construct.implementsNameConstructs[i], construct);
                    var type = construct.implementsNameConstructs[i].type = lookupType(construct.implementsNameConstructs[i], construct);
                    type.accessed = true;
                }
            }

            var packageName = lookupPackageName(construct, construct.identifierToken.data);
            construct.packageName = packageName;
        }

        private function analyzeConstructor(construct)
        {
            upLevel();

            var methodConstruct = construct.constructorMethodConstruct;

            ////////REGISTER IDENTIFIERS - INNER NAMED FUNCTIONS////////
            if (methodConstruct) for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
            {
                ///////REGISTER IDENTIFIER - INNER NAMED FUNCTION////////
                registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
            }

            if (methodConstruct) analyzeParameters(methodConstruct, construct);
            if (methodConstruct) analyzeStatements(methodConstruct.bodyStatements, _indent + 1, construct);

            downLevel();
        }

        private function analyzeNamespaces(construct)
        {
            for (var i = 0; i < construct.propertyConstructs.length; i++)
            {
                var propertyConstruct = construct.propertyConstructs[i];

                if (!propertyConstruct.namespaceKeywordToken) continue;

                var identifier = lookupIdentifier(propertyConstruct);
                identifier.type.accessed = true;

                propertyConstruct.identifier = identifier;

                construct.namespacePropertyConstructs.push(propertyConstruct);
                if (propertyConstruct.valueExpression) analyzeExpression(propertyConstruct.valueExpression, _indent, false, construct);
            }
        }

        private function analyzeProperties(construct, isClassLevel)
        {
            for (var i = 0; i < construct.propertyConstructs.length; i++)
            {
                var propertyConstruct = construct.propertyConstructs[i];

                if (isClassLevel && !propertyConstruct.staticToken || !isClassLevel && propertyConstruct.staticToken) continue;
                if (propertyConstruct.namespaceKeywordToken) continue;

                var identifier = lookupIdentifier(propertyConstruct);
                identifier.type.accessed = true;

                propertyConstruct.identifier = identifier;

                if (isClassLevel) construct.staticPropertyConstructs.push(propertyConstruct);
                else construct.instancePropertyConstructs.push(propertyConstruct);

                if (propertyConstruct.valueExpression) analyzeExpression(propertyConstruct.valueExpression, _indent, false, construct);
            }
        }

        private function analyzeMethods(construct, isClassLevel)
        {
            if (isClassLevel) _inStaticFunction = true;

            for (var i = 0; i < construct.methodConstructs.length; i++)
            {
                var methodConstruct = construct.methodConstructs[i];
                if (isClassLevel && !methodConstruct.staticToken || !isClassLevel && methodConstruct.staticToken) continue;
                if (methodConstruct.setToken || methodConstruct.getToken) continue;

                var identifier = lookupIdentifier(methodConstruct);
                identifier.type.accessed = true;

                methodConstruct.identifier = identifier;

                if (isClassLevel) construct.staticMethodConstructs.push(methodConstruct);
                else construct.instanceMethodConstructs.push(methodConstruct);

                upLevel();

                registerIdentifier('arguments', construct);

                ////////REGISTER IDENTIFIERS - INNER NAMED FUNCTIONS////////
                for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
                {
                    ///////REGISTER IDENTIFIER - INNER NAMED FUNCTION////////
                    registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
                }

                analyzeParameters(methodConstruct, construct);

                if (!methodConstruct.isJavaScript)
                {
                    if (methodConstruct.identifier.namespaceObj.isCustom) _inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$thisp.' + methodConstruct.identifier.namespaceObj.name;

                    _returnTypeStack.push(lookupType(methodConstruct.typeConstruct, construct));
                    analyzeStatements(methodConstruct.bodyStatements, _indent + 1, construct);
                    _returnTypeStack.pop();

                    _inNamespacedFunction = false;
                }

                downLevel();
            }

            if (isClassLevel) _inStaticFunction = false;
        }

        private function analyzeAccessors(construct, isClassLevel)
        {
            if (isClassLevel) _inStaticFunction = true;

            var foundIndexes = [];

            function getMethodConstructJS(methodConstruct, type)
            {
                if (!methodConstruct) return;

                upLevel();

                ////////REGISTER IDENTIFIERS - INNER NAMED FUNCTIONS////////
                for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
                {
                    ///////REGISTER IDENTIFIER - INNER NAMED FUNCTION////////
                    registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
                }

                analyzeParameters(methodConstruct, construct);

                if (!methodConstruct.isJavaScript)
                {
                    if (methodConstruct.identifier.namespaceObj.isCustom) _inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$thisp.' + methodConstruct.identifier.namespaceObj.name;

                    _returnTypeStack.push(type);
                    analyzeStatements(methodConstruct.bodyStatements, _indent + 1, construct);
                    _returnTypeStack.pop();

                    _inNamespacedFunction = false;
                }

                downLevel();
            }

            for (var i = 0; i < construct.methodConstructs.length; i++)
            {
                var methodConstruct = construct.methodConstructs[i];
                if (foundIndexes[i]) continue;
                if (!methodConstruct.setToken && !methodConstruct.getToken) continue;
                if (isClassLevel && !methodConstruct.staticToken || !isClassLevel && methodConstruct.staticToken) continue;

                var setterMethodConstruct = null;
                var getterMethodConstruct = null;
                if (methodConstruct.setToken)
                {
                    setterMethodConstruct = methodConstruct;
                    for (var j = 0; j < construct.methodConstructs.length; j++)
                    {
                        var innerMethodConstruct = construct.methodConstructs[j];
                        if (!innerMethodConstruct.getToken) continue;
                        if (innerMethodConstruct.identifierToken.data != setterMethodConstruct.identifierToken.data) continue;
                        if (isClassLevel && !innerMethodConstruct.staticToken || !isClassLevel && innerMethodConstruct.staticToken) continue;
                        if (lookupNamespace(innerMethodConstruct.namespaceToken) != lookupNamespace(setterMethodConstruct.namespaceToken)) continue;

                        var namespace1 = lookupNamespace(setterMethodConstruct.namespaceToken);
                        var namespace2 = lookupNamespace(innerMethodConstruct.namespaceToken);
                        if (namespace1 != namespace2) continue;

                        getterMethodConstruct = innerMethodConstruct;
                        foundIndexes[j] = true;
                    }
                }
                else
                {
                    getterMethodConstruct = methodConstruct;
                    for (var j = 0; j < construct.methodConstructs.length; j++)
                    {
                        var innerMethodConstruct = construct.methodConstructs[j];
                        if (!innerMethodConstruct.setToken) continue;
                        if (innerMethodConstruct.identifierToken.data != getterMethodConstruct.identifierToken.data) continue;
                        if (isClassLevel && !innerMethodConstruct.staticToken || !isClassLevel && innerMethodConstruct.staticToken) continue;
                        if (lookupNamespace(innerMethodConstruct.namespaceToken) != lookupNamespace(getterMethodConstruct.namespaceToken)) continue;

                        var namespace1 = lookupNamespace(getterMethodConstruct.namespaceToken);
                        var namespace2 = lookupNamespace(innerMethodConstruct.namespaceToken);
                        if (namespace1 != namespace2) continue;

                        setterMethodConstruct = innerMethodConstruct;
                        foundIndexes[j] = true;
                    }
                }

                if (setterMethodConstruct)
                {
                    var identifier = lookupIdentifier(setterMethodConstruct);
                    identifier.type.accessed = true;

                    setterMethodConstruct.identifier = identifier;
                }
                if (getterMethodConstruct)
                {
                    var identifier = lookupIdentifier(getterMethodConstruct);
                    identifier.type.accessed = true;

                    getterMethodConstruct.identifier = identifier;
                }
                var isCNamespace = methodConstruct.identifier.namespaceObj.isCustom;

                if (isClassLevel) construct.staticAccessorConstructs.push({getter:getterMethodConstruct, setter:setterMethodConstruct});
                else construct.instanceAccessorConstructs.push({getter:getterMethodConstruct, setter:setterMethodConstruct});

                if (getterMethodConstruct) getMethodConstructJS(getterMethodConstruct, getterMethodConstruct.identifier.type);
                if (setterMethodConstruct) getMethodConstructJS(setterMethodConstruct, setterMethodConstruct.identifier.type);
            }

            if (isClassLevel) _inStaticFunction = false;
        }

        private function registerConstruct(construct, isClassLevel)
        {
            if (isClassLevel)
            {
                ////////REGISTER IDENTIFIER/NAMESPACE - IMPLICIT IMPORTS////////
                if (!construct.isInternal) for (var id in _rootConstructs)
                {
                    var rootConstruct = _rootConstructs[id];

                    if (!rootConstruct) throw new Error('Root construct null for id: ' + id);
                    if (!rootConstruct.packageConstruct) throw new Error('Package construct missing in: ' + id);
                    if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct) continue;
                    if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct) continue;
                    if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct)) continue;

                    if (hasIdentifier(id) && lookupIdentifier(id).isGlobal) continue;

                    ////////REGISTER IDENTIFIER/NAMESPACE - IMPLICIT IMPORT STATEMENT////////
                    registerIdentifier(rootConstruct.packageConstruct, construct);
                }

                ////////REGISTER IDENTIFIER/NAMESPACE - EXPLICIT IMPORTS////////
                var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
                for (var i = 0; i < importConstructs.length; i++)
                {
                    ////////REGISTER IDENTIFIER/NAMESPACE - EXPLICIT IMPORT STATEMENT////////
                    registerIdentifier(importConstructs[i], construct);
                }
            }
            else
            {
                ////////REGISTER IDENTIFIER - THIS////////
                registerIdentifier('this', construct);
                registerIdentifier('$thisp', construct);

                ////////REGISTER IDENTIFIER - SUPER////////
                if (construct.extendsNameConstruct) registerIdentifier('super', construct);
            }

            var name = construct.identifierToken.data;
            var nextConstruct = construct;
            while (true)
            {
                ////////REGISTER IDENTIFIER - NON-PRIVATE (except for the first time through the loop) PROPERTIES/NAMESPACES THAT ARE NOT YET DEFINED////////
                for (var i = 0; i < nextConstruct.propertyConstructs.length; i++)
                {
                    var propertyConstruct = nextConstruct.propertyConstructs[i];
                    if (!isClassLevel) continue;
                    if (!propertyConstruct.namespaceKeywordToken) continue;

                    ////////REGISTER IDENTIFIER/NAMESPACE - PROPERTY////////
                    registerIdentifier(propertyConstruct, nextConstruct);
                }

                if (!nextConstruct.extendsNameConstruct) break;
                var fullyQualifiedName = lookupFullyQualifiedName(nextConstruct, nextConstruct.extendsNameConstruct);

                if (fullyQualifiedName.split('.').pop() == name) construct.extendsNameConflict = true;

                nextConstruct = lookupConstructInRootConstruct(lookupRootConstruct(nextConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
            }


            var firstIteration = true;
            while (true)
            {
                ////////REGISTER IDENTIFIER - NON-PRIVATE (except for the first time through the loop) METHODS THAT ARE NOT YET DEFINED////////
                for (var i = 0; i < construct.methodConstructs.length; i++)
                {
                    var methodConstruct = construct.methodConstructs[i];
                    if (Boolean(methodConstruct.staticToken) != isClassLevel) continue;
                    if (!firstIteration && !hasNamespace(methodConstruct.namespaceToken)) continue;
                    var namespace = lookupNamespace(methodConstruct.namespaceToken);
                    if (hasIdentifier(methodConstruct, namespace))
                    {
                        var identifier = lookupIdentifier(methodConstruct, namespace);
                        if (!identifier.isGlobal && !identifier.isStatic) continue;
                    }
                    if (!firstIteration && methodConstruct.namespaceToken && methodConstruct.namespaceToken.data == 'private') continue;

                    ////////REGISTER IDENTIFIER - METHOD//////// but do not overwrite any identifiers defined in the top level
                    if (firstIteration || !hasIdentifier(methodConstruct, namespace, true)) registerIdentifier(methodConstruct, construct);
                }

                ////////REGISTER IDENTIFIER - NON-PRIVATE (except for the first time through the loop) PROPERTIES/NAMESPACES THAT ARE NOT YET DEFINED////////
                for (var i = 0; i < construct.propertyConstructs.length; i++)
                {
                    var propertyConstruct = construct.propertyConstructs[i];
                    if (Boolean(propertyConstruct.staticToken) != isClassLevel && !propertyConstruct.namespaceKeywordToken) continue;
                    if (!firstIteration && !hasNamespace(propertyConstruct.namespaceToken)) continue;
                    var namespace = lookupNamespace(propertyConstruct.namespaceToken);
                    if (hasIdentifier(propertyConstruct, namespace))
                    {
                        var identifier = lookupIdentifier(propertyConstruct, namespace);
                        if (!identifier.isGlobal && !identifier.isStatic) continue;
                    }
                    if (!firstIteration && propertyConstruct.namespaceToken && propertyConstruct.namespaceToken.data == 'private') continue;

                    ////////REGISTER IDENTIFIER/NAMESPACE - PROPERTY//////// but do not overwrite any identifiers defined in the top level
                    if (firstIteration || !hasIdentifier(propertyConstruct, namespace, true)) registerIdentifier(propertyConstruct, construct);
                }

                if (!construct.extendsNameConstruct) break;
                firstIteration = false;
                var fullyQualifiedName = lookupFullyQualifiedName(construct, construct.extendsNameConstruct);

                construct = lookupConstructInRootConstruct(lookupRootConstruct(construct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
            }
        }

        private function analyzeParameters(methodConstruct, construct)
        {
            for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
            {
                var parameterConstruct = methodConstruct.parameterConstructs[i];

                ////////REGISTER IDENTIFIER - PARAMETER////////
                registerIdentifier(parameterConstruct, construct);

                var identifier = lookupIdentifier(parameterConstruct.identifierToken.data);
                identifier.type.accessed = true;
                identifier.isVarInitialized = true; //default value set

                parameterConstruct.identifier = identifier;

                if (parameterConstruct.valueExpression) analyzeExpression(parameterConstruct.valueExpression, 0, false, construct);
            }
        }

        private function analyzeStatements(statements, indent, construct)
        {
            for (var i = 0; i < statements.length; i++) analyzeStatement(statements[i], indent + 1, false, construct);
        }

        private function analyzeStatement(statement, _indent, inline, construct)
        {
            if (!construct) throw new Error('construct null in analyze statement');

            switch (statement.constructor)
            {
                case Construct.EmptyStatement:
                    break;
                case Construct.IfStatement:
                    _inIfStatement++;
                    analyzeExpression(statement.conditionExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    for (var i = 0; i < statement.elseIfStatements.length; i++) analyzeStatement(statement.elseIfStatements[i], _indent, false, construct);
                    if (statement.elseStatement) analyzeStatement(statement.elseStatement, _indent, false, construct);
                    _inIfStatement--;
                    break;
                case Construct.ElseIfStatement:
                    _inIfStatement++;
                    analyzeExpression(statement.conditionExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.ElseStatement:
                    _inIfStatement++;
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.WhileStatement:
                    _inIfStatement++;
                    analyzeExpression(statement.conditionExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.DoWhileStatement:
                    _inIfStatement++;
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    analyzeExpression(statement.conditionExpression, _indent, false, construct);
                    _inIfStatement--;
                    break;
                case Construct.ForStatement:
                    _inIfStatement++;
                    if (statement.variableStatement) analyzeStatement(statement.variableStatement, 0, true, construct);
                    if (statement.conditionExpression) analyzeExpression(statement.conditionExpression, _indent, false, construct);
                    if (statement.afterthoughtExpression) analyzeExpression(statement.afterthoughtExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.ForEachStatement:
                    _count++;
                    _inIfStatement++;
                    statement.index = _count;
                    statement.variableStatement.doNotSetDefaultValue = true;
                    analyzeStatement(statement.variableStatement, 0, true, construct);
                    analyzeExpression(statement.arrayExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.ForInStatement:
                    _count++;
                    _inIfStatement++;
                    statement.index = _count;
                    statement.variableStatement.doNotSetDefaultValue = true;
                    analyzeStatement(statement.variableStatement, 0, true, construct);
                    analyzeExpression(statement.objectExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    _inIfStatement--;
                    break;
                case Construct.BreakStatement:
                    if (statement.identifierToken) statement.identifier = lookupIdentifier(statement.identifierToken.data);
                    break
                case Construct.ContinueStatement:
                    if (statement.identifierToken) statement.identifier = lookupIdentifier(statement.identifierToken.data);
                    break;
                case Construct.ThrowStatement:
                    if (statement.expression) analyzeExpression(statement.expression, _indent, false, construct);
                    break;
                case Construct.TryStatement:
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);

                    for (var i = 0; i < statement.catchStatements.length; i++)
                    {
                        upLevel();

                        var catchStatement = statement.catchStatements[i];

                        _count++;
                        catchStatement.index = _count;

                        ////////REGISTER IDENTIFIER - CATCH VAR////////
                        var identifier = registerIdentifier(catchStatement, construct);
                        identifier.isVarInitialized = true; //default value set
                        catchStatement.identifier = identifier;

                        analyzeStatements(catchStatement.bodyStatements, _indent + 2, construct);

                        downLevel();
                    }

                    if (statement.finallyStatement) analyzeStatements(statement.finallyStatement.bodyStatements, _indent + 1, construct);
                    break;
                case Construct.UseStatement:
                    ////////REGISTER USE NAMESPACE - STATEMENT////////
                    registerUseNamespace(statement);
                    break;
                case Construct.VarStatement:
                    for (var i = 0; i < statement.innerVarStatements.length; i++)
                    {
                        ////////REGISTER IDENTIFIER - VAR////////  var foo1, foo2, foo3 (registers foo2 and foo3)
                        var identifier = registerIdentifier(statement.innerVarStatements[i], construct);
                        statement.innerVarStatements[i].identifier = identifier;
                    }

                    ////////REGISTER IDENTIFIER - VAR////////
                    var identifier = registerIdentifier(statement, construct);
                    statement.identifier = identifier;

                    if (!statement.valueExpression && statement.identifier.type.fullyQualifiedName != '*' && statement.identifier.type.fullyQualifiedName != 'void' && !statement.doNotSetDefaultValue)
                    {
                        switch (statement.identifier.type.fullyQualifiedName)
                        {
                            case 'Number':
                                statement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
                                break;
                            case 'uint':
                            case 'int':
                                statement.valueExpression = Construct.getNewNumberExpression();
                                statement.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
                                break;
                            case 'Boolean':
                                statement.valueExpression = Construct.getNewBooleanExpression();
                                statement.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
                                break;
                            default:
                                statement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
                        }
                    }

                    if (statement.valueExpression)
                    {
                        var expressionResult = analyzeExpression(statement.valueExpression, _indent, false, construct);
                        if (isCoerceRequired(expressionResult, statement.identifier.type, statement.identifier)) statement.coerce = true;
                    }
                    statement.identifier.isVarInitialized = true; //default value set

                    for (var i = 0; i < statement.innerVarStatements.length; i++)
                    {
                        var innerVarStatement = statement.innerVarStatements[i];

                        if (!innerVarStatement.valueExpression && innerVarStatement.identifier.type.fullyQualifiedName != '*' && innerVarStatement.identifier.type.fullyQualifiedName != 'void')
                        {
                            switch (innerVarStatement.identifier.type.fullyQualifiedName)
                            {
                                case 'Number':
                                    innerVarStatement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
                                    break;
                                case 'uint':
                                case 'int':
                                    innerVarStatement.valueExpression = Construct.getNewNumberExpression();
                                    innerVarStatement.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
                                    break;
                                case 'Boolean':
                                    innerVarStatement.valueExpression = Construct.getNewBooleanExpression();
                                    innerVarStatement.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
                                    break;
                                default:
                                    innerVarStatement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
                            }
                        }
                        if (innerVarStatement.valueExpression)
                        {
                            expressionResult = analyzeExpression(innerVarStatement.valueExpression, _indent, false, construct);
                            if (isCoerceRequired(expressionResult, innerVarStatement.identifier.type, innerVarStatement.identifier)) innerVarStatement.coerce = true;
                        }
                        innerVarStatement.identifier.isVarInitialized = true; //default value set
                    }
                    break;
                case Construct.SwitchStatement:
                    analyzeExpression(statement.valueExpression, _indent, false, construct);
                    for (var i = 0; i < statement.caseStatements.length; i++) analyzeStatement(statement.caseStatements[i], _indent + 1, false, construct);
                    break;
                case Construct.CaseStatement:
                    if (!statement.defaultToken) analyzeExpression(statement.valueExpression, _indent, false, construct);
                    analyzeStatements(statement.bodyStatements, _indent + 1, construct);
                    break;
                case Construct.LabelStatement:
                    ////////REGISTER IDENTIFIER - LABEL////////
                    var identifier = registerIdentifier(statement, construct);
                    identifier.isVarInitialized = true; //default value set
                    statement.identifier = identifier;
                    break;
                default:
                    analyzeExpression(statement, _indent, false, construct);
            }
        }

        private function analyzeExpression(expression, _indent, toString, construct, operator=null, expressionString=null)
        {
            if (!construct) throw new Error('construct null in analyze expression');

            var expressionResult = new ExpressionResult(null, false, false, false, false);

            outerSwitch: switch (expression.constructor)
            {
                case Construct.ParenExpression:
                    expressionResult = analyzeExpression(expression.expression, _indent, toString, construct, operator, expressionString);
                    break;
                case Construct.PropertyExpression:
                    expressionResult = analyzePropertyExpression(expression, toString, construct);
                    break;
                case Construct.NumberExpression:
                    if (expression.numberToken.data == new Number(parseFloat(expression.numberToken.data) >> 0))
                    {
                        expressionResult.type = lookupType('int');
                    }
                    else if (expression.numberToken.data == new Number(parseFloat(expression.numberToken.data) >>> 0))
                    {
                        expressionResult.type = lookupType('uint');
                    }
                    else expressionResult.type = lookupType('Number');
                    break;
                case Construct.StringExpression:
                    expressionResult.type = lookupType('String');
                    break;
                case Construct.ReturnExpression:
                    if (expression.expression)
                    {
                        expression.expectedType = _returnTypeStack[_returnTypeStack.length - 1];
                        expressionResult = analyzeExpression(expression.expression, 0, toString, construct);
                        expression.coerce = isCoerceRequired(expressionResult, expression.expectedType);
                    }
                    else expressionResult.type = lookupType('void');
                    break;
                case Construct.DeleteExpression:
                    expressionResult = analyzeExpression(expression.expression, 0, toString, construct);
                    break;
                case Construct.FunctionExpression:
                    //IN CLOSURE
                    var wasInClosure = _inClosure;
                    _inClosure = true;

                    if (expression.identifierToken)
                    {
                        if (_inIfStatement) throw new Error('support for named closures in if/elseif/else statements is not supported at this time. function name: ' + expression.identifierToken.data);

                        ////////REGISTER IDENTIFIER - NAMED FUNCTION////////
                        var identifier = registerIdentifier(expression, construct);
                        identifier.isVarInitialized = true; //default value set
                        expression.identifier = identifier;
                        expressionResult.type = identifier.type;
                    }
                    else expressionResult.type = lookupType(expression.typeConstruct);

                    ////////REGISTER IDENTIFIERS - INNER NAMED FUNCTIONS////////
                    for (var i = 0; i < expression.namedFunctionExpressions.length; i++)
                    {
                        ///////REGISTER IDENTIFIER - INNER NAMED FUNCTION////////
                        var identifier = registerIdentifier(expression.namedFunctionExpressions[i], construct);
                        identifier.isVarInitialized = true; //default value set
                        expression.namedFunctionExpressions[i].identifier = identifier;
                        expression.namedFunctionExpressions[i].type = identifier.type;
                    }

                    upLevel();

                    analyzeParameters(expression, construct);

                    ////////REGISTER IDENTIFIER - THIS////////
                    registerIdentifier('this', construct);

                    _returnTypeStack.push(expressionResult.type);
                    analyzeStatements(expression.bodyStatements, _indent + 1, construct);
                    _returnTypeStack.pop();

                    //OUT CLOSURE
                    if (!wasInClosure) _inClosure = false;

                    downLevel();
                    break;
                case Construct.ObjectExpression:
                    for (var i = 0; i < expression.objectPropertyConstructs.length; i++)
                    {
                        if (expression.objectPropertyConstructs[i].expression.constructor != Construct.PropertyExpression) analyzeExpression(expression.objectPropertyConstructs[i].expression, 0, toString, construct);
                        analyzeExpression(expression.objectPropertyConstructs[i].valueExpression, 0, toString, construct);
                    }
                    expressionResult.type = lookupType('Object');
                    break;
                case Construct.ArrayExpression:
                    for (var i = 0; i < expression.valueExpressions.length; i++) analyzeExpression(expression.valueExpressions[i], 0, toString, construct);
                    expressionResult.type = lookupType('Array');
                    break;
                case Construct.BooleanExpression:
                    expressionResult.type = lookupType('Boolean');
                    break;
                case Construct.Expression:
                    if (expression.token.type == Token.TypeofTokenType)
                    {
                        analyzeExpression(expression.expression, 0, toString, construct);
                        expressionResult.type = lookupType('String');
                        break;
                    }

                    if (expression.token.type == Token.VoidTokenType)
                    {
                        if (expression.expression.constructor != Construct.EmptyExpression) analyzeExpression(expression.expression, 0, toString, construct);
                        expressionResult.type = lookupType('void');
                        break;
                    }

                    if (expression.token.type == Token.NaNTokenType)
                    {
                        expressionResult.isNaN = true;
                        break;
                    }

                    if (expression.token.type == Token.UndefinedTokenType)
                    {
                        expressionResult.isUndefined = true;
                        break;
                    }

                    if (expression.token.type == Token.NullTokenType)
                    {
                        expressionResult.isNull = true;
                        break;
                    }

                    if (expression.expression)
                    {
                        expressionResult = analyzeExpression(expression.expression, 0, toString, construct);
                        break;
                    }

                    throw new Error('unhandled expression type');
                    break;
                case Construct.XMLExpression:
                    expressionResult.type = lookupType('XML');
                    break
                case Construct.XMLListExpression:
                    expressionResult.type = lookupType('XMLList');
                    break
                case Construct.EmptyExpression:
                    expressionResult.type = lookupType('void');
                    break;
                case Construct.RegExpression:
                    expressionResult.type = lookupType('RegExp');
                    break;
                case Construct.PrefixExpression:
                case Construct.PostfixExpression:
                    expressionResult = analyzeExpression(expression.expression, 0 , toString, construct);
                    //if (innerExpressionResult.type == lookupType('Number') || innerExpressionResult.type == lookupType('int') || innerExpressionResult.type == lookupType('uint')) expressionResult = innerExpressionResult;
                    //else expressionResult.type = lookupType('Number');
                    break;
                case Construct.NewExpression:
                    expressionResult = analyzePropertyExpression(expression.expression, toString, construct, true);
                    break;
                case Construct.BinaryExpression:
                    if (expression.token.type == Token.IsTokenType)
                    {
                        analyzeExpression(expression.leftExpression, 0, toString, construct);
                        analyzeExpression(expression.rightExpression, 0, toString, construct);
                        expressionResult.type = lookupType('Boolean');
                        break;
                    }
                    if (expression.token.type == Token.InstanceofTokenType)
                    {
                        analyzeExpression(expression.leftExpression, 0, toString, construct);
                        analyzeExpression(expression.rightExpression, 0, toString, construct);
                        expressionResult.type = lookupType('Boolean');
                        break;
                    }
                    if (expression.token.type == Token.AsTokenType)
                    {
                        analyzeExpression(expression.leftExpression, 0, toString, construct);
                        expressionResult = analyzeExpression(expression.rightExpression, 0, toString, construct);
                        break;
                    }
                    innerSwitch: switch (expression.token.type)
                    {
                        case Token.BitwiseLeftShiftAssignmentTokenType:
                        case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
                        case Token.BitwiseRightShiftAssignmentTokenType:
                        case Token.AddWithAssignmentTokenType:
                        case Token.DivWithAssignmentTokenType:
                        case Token.ModWithAssignmentTokenType:
                        case Token.MulWithAssignmentTokenType:
                        case Token.SubWithAssignmentTokenType:
                        case Token.AssignmentTokenType:
                        case Token.AndWithAssignmentTokenType:
                        case Token.OrWithAssignmentTokenType:
                        case Token.BitwiseAndAssignmentTokenType:
                        case Token.BitwiseOrAssignmentTokenType:
                        case Token.BitwiseXorAssignmentTokenType:
                            var leftExpression = expression.leftExpression;
                            while (leftExpression.constructor == Construct.ParenExpression) leftExpression = leftExpression.expression;

                            var innerOperator = expression.token.data;
                            var innerExpressionFound = false;
                            var expressionResult;
                            while (leftExpression.constructor == Construct.BinaryExpression)
                            {
                                var binaryExpression = Construct.getNewBinaryExpression(); //we don't want to modify the original expression
                                binaryExpression.token = expression.token;
                                binaryExpression.rightExpression = expression.rightExpression;
                                binaryExpression.leftExpression = leftExpression.rightExpression;

                                if (!innerExpressionFound) expressionResult = analyzeExpression(binaryExpression, _indent, toString, construct);
                                else expressionResult = getGreatestCommonExpressionResult(expressionResult, analyzeExpression(binaryExpression.leftExpression, _indent, toString, construct));

                                innerExpressionFound = true;

                                expression = leftExpression;
                                leftExpression = expression.leftExpression;
                            }

                            var leftExpressionResult = analyzeExpression(leftExpression, 0, toString, construct);
                            var rightExpressionResult;

                            if (innerExpressionFound) rightExpressionResult = expressionResult;
                            else rightExpressionResult = analyzeExpression(expression.rightExpression, 0, toString, construct);

                            expressionResult = getGreatestCommonExpressionResult(leftExpressionResult, rightExpressionResult);
                            if (isCoerceRequired(expressionResult, leftExpressionResult.type, leftExpressionResult.varIdentifier)) leftExpression.coerce = true;
                            if (leftExpressionResult.varIdentifier) leftExpressionResult.varIdentifier.isVarInitialized = true; //default value set

                            break outerSwitch;
                        case Token.AddTokenType:
                            var leftExpressionResult = analyzeExpression(expression.leftExpression, 0, toString, construct);
                            var rightExpressionResult = analyzeExpression(expression.rightExpression, 0, toString, construct);

                            //deal with string concatination
                            if (leftExpressionResult.type && leftExpressionResult.type.fullyQualifiedName == 'String')
                            {
                                expressionResult = leftExpressionResult;
                            }
                            else if (rightExpressionResult.type && rightExpressionResult.type.fullyQualifiedName == 'String')
                            {
                                expressionResult = rightExpressionResult;
                            }
                            else expressionResult = getGreatestCommonExpressionResult(leftExpressionResult, rightExpressionResult);
                            break outerSwitch;
                    }

                    expressionResult = getGreatestCommonExpressionResult(analyzeExpression(expression.leftExpression, 0, toString, construct), analyzeExpression(expression.rightExpression, 0, toString, construct));
                    break;
                case Construct.TernaryExpression:
                    analyzeExpression(expression.conditionExpression, 0, toString, construct);
                    expressionResult = getGreatestCommonExpressionResult(analyzeExpression(expression.trueExpression, 0, toString, construct), analyzeExpression(expression.falseExpression, 0, toString, construct));
                    break;
                default:
                    throw new Error('Unexpected expression found: ' + expression.constructor);
            }

            return expressionResult;
        }



        /*
		private function $is(object, Type)
	{
		if ($instanceof(object, Type)) return true;

		var proto = object;
		while (proto != null)
		{
			if (proto.constructor.$_implements !== undefined && proto.constructor.$_implements.indexOf(Type) !== -1) return true;
			proto = proto.__proto__;
		}

		return false
	}

	private function $instanceof(object, Type)
	{
		if (object == null) return false;
		if (Type === Class && object.$isclass !== undefined) return true;
		if (Type === Object && object.$isclass === undefined) return true;
		if (object instanceof Type) return true;
		if (typeof object === 'function' && object.$isclass === undefined && Type === Function) return true;

		if (Type === Boolean) return (object === true || object === false)
		if (Type === String) return typeof object === 'string';
		if (Type === uint) return uint(object) == object;
		if (Type === int) return int(object) == object;
		if (Type === Number) return typeof object === 'number';

		if (typeof object === 'function' && object.$isclass !== undefined)
		{
			if (Type === Function) return false;

			var proto = object.__proto__;
			while (proto !== null)
			{
				if (proto === Type) return true;
				proto = proto.__proto__;
			}
		}

		return false;
	}

		private function ExpressionResult(type, isNaN, isNull, isUndefined, isVoid)
	{
		this.type = type;
		this.isNaN = isNaN;
		this.isNull = isNull;
		this.isUndefined = isUndefined;
		this.isVoid = isVoid;
	}

	private function Type(name, fullyQualifiedName, rootConstruct, construct)
	{
		this.name = name;
		this.fullyQualifiedName = (fullyQualifiedName) ? fullyQualifiedName : name;

		var parts = fullyQualifiedName.split('.');
		if (parts.length > 1)
		{
			parts.pop();
			this.packageName = parts.join('.');
		}
		else this.packageName = '';
		this.rootConstruct = rootConstruct;
		this.construct = construct;
		this.isGlobal = false;
		this.isInterface = false;
		this.accessed = false;

		if (this.construct) this.toString = function () { return 'Type::: ' + this.name + ' Construct: ' + ((this.construct.identifierToken) ? this.construct.identifierToken.data : '')};
		else this.toString = function () { return 'Type::: ' + this.name; };
	}
	*/



        private function isCoerceRequired(expressionResultFrom, typeTo, varIdentifierTo=null)
        {
            if (expressionResultFrom.varIdentifier && !expressionResultFrom.varIdentifier.isVarInitialized) throw new Error('cannot declare and set var: [ ' + expressionResultFrom.varIdentifier + ' ] in same line, example: var i:uint = i;');
            if (typeTo.fullyQualifiedName == '*' || typeTo.fullyQualifiedName == 'void') return false; //we are not trying to coerce it to anything
            if (expressionResultFrom.isNull) return (typeTo.fullyQualifiedName == 'Boolean' || typeTo.fullyQualifiedName == 'int' || typeTo.fullyQualifiedName == 'uint'|| typeTo.fullyQualifiedName == 'Number'); //these cannot be null
            if (expressionResultFrom.isUndefined || expressionResultFrom.isVoid) return true; //unly untyped objects or dict keys can be undefined, and those were caught in the first if statement, so always return true here
            if (expressionResultFrom.isNaN) return (typeTo.fullyQualifiedName != 'Number'); //if you're setting to NaN and it is not a number, coerce
            if (expressionResultFrom.type == typeTo || typeTo.fullyQualifiedName == expressionResultFrom.type.fullyQualifiedName) return false; //the types are equal
            if (typeTo.fullyQualifiedName == 'Object') return false; //everything should be at least an object by this point

            var greatestCommonType = getGreatestCommonType(expressionResultFrom.type, typeTo);
            if (greatestCommonType == typeTo || greatestCommonType.fullyQualifiedName == typeTo.fullyQualifiedName) return false;

            return true;
        }

        private function getGreatestCommonExpressionResult(expressionResult1, expressionResult2)
        {
            var defaultExpressionResult = new ExpressionResult(lookupType('*'), false, false, false, false);

            if (expressionResult1 == expressionResult2) return expressionResult2;
            if (expressionResult1.isNull || expressionResult2.isNull) return (expressionResult1.isNull && expressionResult2.isNull) ? expressionResult2 : defaultExpressionResult;
            if (expressionResult1.isUndefined || expressionResult2.isUndefined) return (expressionResult1.isUndefined && expressionResult2.isUndefined) ? expressionResult2 : defaultExpressionResult;
            if (expressionResult1.isNaN || expressionResult2.isNaN) return (expressionResult1.isNaN && expressionResult2.isNaN) ? expressionResult2 : defaultExpressionResult;

            var type = getGreatestCommonType(expressionResult1.type, expressionResult2.type);

            return new ExpressionResult(type, false, false, false, false);
        }

        private function getGreatestCommonType(type1, type2)
        {
            if (type1 == type2 || type1.fullyQualifiedName == type2.fullyQualifiedName) return type2;

            if (type1.fullyQualifiedName == '*' || type2.fullyQualifiedName == '*')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'void' || type2.fullyQualifiedName == 'void')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'String' || type2.fullyQualifiedName == 'String')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'Function' || type2.fullyQualifiedName == 'Function')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'Class' || type2.fullyQualifiedName == 'Class')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'Boolean' || type2.fullyQualifiedName == 'Boolean')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'Array' || type2.fullyQualifiedName == 'Array')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            if (type1.fullyQualifiedName == 'uint' || type2.fullyQualifiedName == 'uint')
            {
                if (type1.fullyQualifiedName == type2.fullyQualifiedName) return type2;

                if (type1.fullyQualifiedName == 'Number') return type1;
                if (type2.fullyQualifiedName == 'Number') return type2;

                return lookupType('*');
            }

            if (type1.fullyQualifiedName == 'int' || type2.fullyQualifiedName == 'int')
            {
                if (type1.fullyQualifiedName == type2.fullyQualifiedName) return type2;

                if (type1.fullyQualifiedName == 'Number') return type1;
                if (type2.fullyQualifiedName == 'Number') return type2;

                return lookupType('*');
            }

            if (type1.fullyQualifiedName == 'Number' || type2.fullyQualifiedName == 'Number')
            {
                return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : lookupType('*');
            }

            var typea = checkForType(type1, type2);
            var typeb = checkForType(type2, type1);

            return (typea.fullyQualifiedName == lookupType('*').fullyQualifiedName) ? typeb : typea;

            function checkForType(type, typeToCheckFor)
            {
                var visitedInterfaces = {}; //prevent infinite loop

                var typeConstruct = type.construct;
                var typeToCheckForConstruct = typeToCheckFor.construct;

                if (typeConstruct.constructor == Construct.InterfaceConstruct)
                {
                    var result = hasConstructInInterface(typeConstruct, typeToCheckForConstruct);
                    if (result) return typeToCheckFor;
                }
                else
                {
                    var result = hasConstructInClass(typeConstruct, typeToCheckForConstruct);
                    if (result) return typeToCheckFor;
                }

                return lookupType('*');

                function hasConstructInInterface(interfaceConstruct, constructToCheckFor)
                {
                    if (interfaceConstruct == constructToCheckFor) return true;

                    if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
                    {
                        var extendsNameConstructs = interfaceConstruct.extendsNameConstructs;
                        for (var i = extendsNameConstructs.length; i--;)
                        {
                            if (visitedInterfaces[Construct.nameConstructToString(extendsNameConstructs[i])]) continue;
                            visitedInterfaces[Construct.nameConstructToString(extendsNameConstructs[i])] = true;

                            var fullyQualifiedName = lookupFullyQualifiedName(interfaceConstruct, extendsNameConstructs[i]);
                            var innerConstruct = lookupConstructInRootConstruct(lookupRootConstruct(interfaceConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);

                            var result = hasConstructInInterface(interfaceConstruct, innerConstruct);
                            if (result) return true;
                        }
                    }

                    return false;
                }

                function hasConstructInClass(classConstruct, constructToCheckFor)
                {
                    if (classConstruct == constructToCheckFor) return true;

                    if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
                    {
                        var implementsNameConstructs = classConstruct.implementsNameConstructs;
                        for (var i = implementsNameConstructs.length; i--;)
                        {
                            if (visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])]) continue;
                            visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])] = true;

                            var fullyQualifiedName = lookupFullyQualifiedName(classConstruct, implementsNameConstructs[i]);
                            var innerConstruct = lookupConstructInRootConstruct(lookupRootConstruct(classConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);

                            var result = hasConstructInInterface(constructToCheckFor, innerConstruct);
                            if (result) return true;
                        }
                    }

                    var extendsNameConstruct;
                    while (extendsNameConstruct = classConstruct.extendsNameConstruct)
                    {
                        var fullyQualifiedName = lookupFullyQualifiedName(classConstruct, extendsNameConstruct);
                        var extendsConstruct = lookupConstructInRootConstruct(lookupRootConstruct(classConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);

                        if (extendsConstruct == constructToCheckFor) return true;

                        if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
                        {
                            var implementsNameConstructs = extendsConstruct.implementsNameConstructs;
                            for (var i = implementsNameConstructs.length; i--;)
                            {
                                if (visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])]) continue;
                                visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])] = true;

                                var fullyQualifiedName = lookupFullyQualifiedName(extendsConstruct, implementsNameConstructs[i]);
                                var innerConstruct = lookupConstructInRootConstruct(lookupRootConstruct(extendsConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);

                                var result = hasConstructInInterface(constructToCheckFor, innerConstruct);
                                if (result) return true;
                            }
                        }

                        classConstruct = extendsConstruct;
                    }

                    return false;
                }

            }
        }

        private function analyzePropertyExpression(expression, toString, construct, isNew=false)
        {
            var innerExpression = expression;
            while (innerExpression.constructor == Construct.ParenExpression) innerExpression = innerExpression.expression;
            if (!innerExpression.construct) throw new Error('invalid expression passed to analyzePropertyExpression: ' + innerExpression.constructor);

            var identifier;
            var namespaceIdentifier;
            var thisConstruct = false;
            switch (innerExpression.construct.constructor)
            {
                case Construct.ThisConstruct:
                    thisConstruct = true;
                case Construct.SuperConstruct:
                case Construct.IdentifierConstruct:
                    identifier = innerExpression.construct.identifier = lookupIdentifier(innerExpression.construct);
                    identifier.accessed = true;
                    break;
                case Construct.ParenConstruct:
                case Construct.ArrayConstruct:
                case Construct.ObjectConstruct:
                    break;
                case Construct.NamespaceQualifierConstruct:
                    namespaceIdentifier = innerExpression.construct.namespaceIdentifier = lookupIdentifier(innerExpression.construct.identifierToken.data);
                    namespaceIdentifier.accessed = true;
                    identifier = innerExpression.construct.identifier = lookupIdentifier(innerExpression.construct.namespaceIdentifierToken.data, lookupNamespace(namespaceIdentifier.name));
                    identifier.accessed = true;
                    break;
                default:
                    throw new Error('unknown inner property expression: ' + innerExpression.construct.constructor);
            }

            if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom) namespaceIdentifier = identifier.namespaceObj.identifier;
            else if (identifier && identifier.isPackage)
            {
                var tempInnerExpression;
                while ((tempInnerExpression = innerExpression.nextPropertyExpression) && tempInnerExpression.construct.constructor == Construct.DotConstruct)
                {
                    if (!tempInnerExpression.nextPropertyExpression || tempInnerExpression.nextPropertyExpression.construct.construct != Construct.IdentifierConstruct) break;
                    var innerIdentifier = tempInnerExpression.nextPropertyExpression.construct.construct.identifier = lookupIdentifier(tempInnerExpression.nextPropertyExpression.construct.construct.identifierToken.data);

                    if (!innerIdentifier.isPackage) break;

                    innerExpression = innerExpression.nextPropertyExpression;
                }
            }

            var expressionResult;
            var lastPropertyName;
            var lastExpressionResult;
            var lastIdentifier;
            var packageName = '';
            if (identifier)
            {
                if (!identifier.isVar) expressionResult = new ExpressionResult(identifier.type, false, false, false, false);
                else expressionResult = new ExpressionResult(identifier.type, false, false, false, false, identifier);
                lastPropertyName = identifier.name;
                innerExpression.identifier = identifier;
                lastExpressionResult = expressionResult;
                lastIdentifier = identifier;
                if (identifier.isPackage) packageName += identifier.name;
                if (!identifier.isType) identifier = null;
                else thisConstruct = true;
            }
            else expressionResult = analyzeExpression(innerExpression.construct.expression, 0, toString, construct);

            while (innerExpression = innerExpression.nextPropertyExpression)
            {
                if (innerExpression.construct.constructor == Construct.DotConstruct || innerExpression.construct.constructor == Construct.IdentifierConstruct)
                {
                    if (lastIdentifier && lastIdentifier.name == 'this')
                    {
                        if (_treatThisAsDynamic) innerExpression.construct.identifier = lookupIdentifier('global');
                        else innerExpression.construct.identifier = lookupIdentifier(innerExpression.construct.identifierToken.data);
                    }
                    lastExpressionResult = expressionResult;
                    lastIdentifier = identifier;

                    if (thisConstruct && hasIdentifier(innerExpression.construct.identifierToken.data) && lookupIdentifier(innerExpression.construct.identifierToken.data).isNative) throw new Error('cannot use "this" or classname scope before private native property: ' + innerExpression.construct.identifierToken.data);
                    thisConstruct = false;

                    var invalidated = false;
                    if (packageName)
                    {
                        packageName += '.' + innerExpression.construct.identifierToken.data;

                        if (_rootConstructs[packageName])
                        {
                            lastExpressionResult = expressionResult = new ExpressionResult(lookupType(packageName), false, false, false, false);
                            lastIdentifier = lookupIdentifier(packageName);
                            identifier = null;
                            packageName = '';

                            //handle this: sweetrush.os.utils.JXONUtil.parse(xmlString);
                            if (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor != Construct.FunctionCallConstruct) //this is likely just a patch/hack
                            {
                                identifier = lastIdentifier;
                                innerExpression = innerExpression.nextPropertyExpression;
                            }
                        }
                        else invalidated = true;
                    }

                    if (!invalidated)
                    {
                        var next = (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct && !isNew);

                        //trace(identifier + ', ' + innerExpression.construct.identifierToken.data + ', ' + expressionResult.type);
                        expressionResult = new ExpressionResult(lookupPropertyType(expressionResult.type, namespaceIdentifier, identifier, innerExpression.construct.identifierToken.data, next), false, false, false, false);
                        //trace(expressionResult.type);

                        identifier = null;
                        namespaceIdentifier = null;
                        lastPropertyName = innerExpression.construct.identifierToken.data;

                        if (next)
                        {
                            var functionCallExpression = innerExpression.nextPropertyExpression;

                            for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++) analyzeExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);

                            innerExpression = innerExpression.nextPropertyExpression;
                            continue;
                        }
                    }
                }
                else if (innerExpression.construct.constructor == Construct.ArrayAccessorConstruct)
                {
                    analyzeExpression(innerExpression.construct.expression, 0, toString, construct);
                    expressionResult = new ExpressionResult(lookupType('*'), false, false, false, false);
                    identifier = null;
                    namespaceIdentifier = null;
                    lastPropertyName = null;
                }
                else if (innerExpression.construct.constructor == Construct.NamespaceQualifierConstruct)
                {
                    namespaceIdentifier = innerExpression.construct.namespaceIdentifier = lookupIdentifier(innerExpression.construct.identifierToken.data);

                    innerExpression.construct.identifier = lookupIdentifier(innerExpression.construct.namespaceIdentifierToken.data, lookupNamespace(namespaceIdentifier.name));
                }
                else if (innerExpression.construct.constructor == Construct.ParenConstruct)
                {
                    expressionResult = analyzeExpression(innerExpression.construct.expression, 0, toString, construct);
                    namespaceIdentifier = null;
                    identifier = null;
                    lastPropertyName = null;
                }
                else if (innerExpression.construct.constructor == Construct.AtIdentifierConstruct)
                {
                    expressionResult = new ExpressionResult(lookupType('Object'), false, false, false, false);
                }
                if (innerExpression.construct.constructor == Construct.FunctionCallConstruct || (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
                {
                    var functionCallExpression = (innerExpression.construct.constructor == Construct.FunctionCallConstruct) ? innerExpression : innerExpression.nextPropertyExpression;

                    for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++) analyzeExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);

                    if (isNew)
                    {
                        if (lastPropertyName)
                        {
                            if (lastIdentifier && lastIdentifier.isType) expressionResult = new ExpressionResult(lookupType(lastIdentifier.fullPackageName), false, false, false, false);
                            else expressionResult = lastExpressionResult;
                        }
                        else expressionResult = new ExpressionResult(lookupType('Object'), false, false, false, false);

                        isNew = false;
                    }
                    else
                    {
                        if (lastPropertyName)
                        {
                            if (lastIdentifier && lastIdentifier.isType) expressionResult = lastExpressionResult;
                            else expressionResult = new ExpressionResult(lookupPropertyType(lastExpressionResult.type, namespaceIdentifier, lastIdentifier, lastPropertyName, true), false, false, false, false);
                        }
                        else expressionResult = new ExpressionResult(lookupType('*'), false, false, false, false);
                    }

                    namespaceIdentifier = null;
                    identifier = null;
                    lastPropertyName = null;
                    lastIdentifier = null;
                    lastExpressionResult = null;
                    thisConstruct = false;

                    if (innerExpression.nextPropertyExpression) innerExpression = functionCallExpression;
                    continue;
                }

                thisConstruct = false;
            }

            if (isNew)
            {
                if (lastPropertyName)
                {
                    if (lastExpressionResult) expressionResult = lastExpressionResult;
                    else
                    {
                        expressionResult = new ExpressionResult(lookupPropertyType(lastExpressionResult, namespaceIdentifier, lastIdentifier, lastPropertyName), false, false, false, false);
                        if (expressionResult.type.name == '*') expressionResult = new ExpressionResult(lookupType('Object'), false, false, false, false);
                    }
                }
                else expressionResult = new ExpressionResult(lookupType('Object'), false, false, false, false);
            }

            return expressionResult;
        }

        //identifier should only be supplied if doing static property lookup: for example, MyClass.Foo;  (MyClass would be identifier);
        private function lookupPropertyType(type, namespaceIdentifier, identifier, name, functionReturnType=null)
        {
            if (identifier && !identifier.isType)
            {
                return identifier.type;
            }
            else if (identifier)
            {
                if (name == 'prototype') return lookupType('Object'); //temp?

                var propertyConstructs = identifier.construct.methodConstructs.concat(identifier.construct.propertyConstructs);
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (!propertyConstruct.staticToken) continue;
                    if (!propertyConstruct.namespaceToken && namespaceIdentifier) continue;
                    if (namespaceIdentifier && namespaceIdentifier.name != propertyConstruct.namespaceToken.data) continue;
                    if (propertyConstruct.identifierToken.data != name) continue;

                    if (propertyConstruct.constructor == Construct.MethodConstruct)
                    {
                        if (propertyConstruct.setToken)
                        {
                            if (!propertyConstruct.parameterConstructs[0] || !propertyConstruct.parameterConstructs[0].typeConstruct) throw new Error('::10');
                            return getType(identifier.construct, propertyConstruct.parameterConstructs[0].typeConstruct);
                        }
                        if (propertyConstruct.getToken)
                        {
                            if (!propertyConstruct.typeConstruct) throw new Error('::9');
                            return getType(identifier.construct, propertyConstruct.typeConstruct);
                        }

                        if (functionReturnType)
                        {
                            if (!propertyConstruct.typeConstruct) throw new Error('::8');
                            return getType(identifier.construct, propertyConstruct.typeConstruct);
                        }

                        return lookupType('Function');
                    }

                    if (!propertyConstruct || !propertyConstruct.typeConstruct) throw new Error('::7');
                    return getType(identifier.construct, propertyConstruct.typeConstruct);
                }

                throw new Error('cound not lookup static property ' + name + ' in: ' + type + ', ' + identifier + ', possible cause: compiling against out of date swc');
            }

            if (type.isGlobal && (type.name == '*' || type.name == 'void')) return type;

            var construct = type.construct;

            if (!construct)
            {
                output();
                throw new Error('could not find construct in type: ' + type + ', property name: ' + name);
            }

            if (construct.constructor == Construct.ClassConstruct && construct.identifierToken.data == name) return type;

            if (construct.constructor == Construct.MethodConstruct)
            {
                if (construct.setToken) return getType(construct, construct.parameterConstructs[0].typeConstruct);
                if (construct.getToken) return getType(construct, construct.typeConstruct);

                if (functionReturnType)
                {
                    if (!construct.typeConstruct) throw new Error('::6');
                    return getType(construct, construct.typeConstruct);
                }

                return lookupType('Function');
            }

            function findTypeInInterfaceConstruct(construct)
            {
                var type = getTypeInConstruct(construct);
                if (type) return type;

                for (var i = 0; i < construct.extendsNameConstructs.length; i++)
                {
                    var fullyQualifiedName = lookupFullyQualifiedName(construct, construct.extendsNameConstructs[i]);
                    var innerConstruct = lookupConstructInRootConstruct(lookupRootConstruct(construct.rootConstruct, fullyQualifiedName), fullyQualifiedName);

                    type = findTypeInInterfaceConstruct(innerConstruct);
                    if (type) return type;
                }

                return null;
            }

            var innerConstruct = construct;
            var object = false;
            while (true)
            {
                if (innerConstruct.extendsNameConstructs) //interface
                {
                    var innerType = findTypeInInterfaceConstruct(innerConstruct);
                    if (innerType) return innerType;
                }
                else //class
                {
                    var innerType = getTypeInConstruct(innerConstruct);
                    if (innerType) return innerType;
                }

                if (innerConstruct.extendsNameConstruct &&Construct.nameConstructToString( innerConstruct.extendsNameConstruct) == 'Object') object = true;

                if (!innerConstruct.extendsNameConstruct && object) break;
                else if (!innerConstruct.extendsNameConstruct)
                {
                    innerConstruct = lookupType('Object').construct;
                    object = true;
                }
                else
                {
                    innerConstruct = getType(innerConstruct, innerConstruct.extendsNameConstruct).construct;
                }
            }

            if (construct.dynamicToken) return lookupType('*');

            //output();

            throw new Error('could not find property ' + name + ' in type ' + type + ' construct: ' + construct.identifierToken.data);

            function getTypeInConstruct(construct)
            {
                var propertyConstructs = (construct.constructor == Construct.InterfaceConstruct) ? construct.methodConstructs : construct.methodConstructs.concat(construct.propertyConstructs);

                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (propertyConstruct.staticToken) continue;
                    if (!propertyConstruct.namespaceToken && namespaceIdentifier) continue;
                    if (namespaceIdentifier && namespaceIdentifier.name != propertyConstruct.namespaceToken.data) continue;
                    if (propertyConstruct.identifierToken.data != name) continue;

                    if (propertyConstruct.constructor == Construct.MethodConstruct)
                    {
                        if (propertyConstruct.setToken)
                        {
                            if (!propertyConstruct.parameterConstructs[0] || !propertyConstruct.parameterConstructs[0].typeConstruct) throw new Error('::4');
                            return getType(construct, propertyConstruct.parameterConstructs[0].typeConstruct);
                        }
                        if (propertyConstruct.getToken)
                        {
                            if (!propertyConstruct.typeConstruct) throw new Error('::3');
                            return getType(construct, propertyConstruct.typeConstruct);
                        }

                        if (functionReturnType)
                        {
                            if (!propertyConstruct.typeConstruct) throw new Error('::1');
                            return getType(construct, propertyConstruct.typeConstruct);
                        }

                        return lookupType('Function');
                    }

                    if (!propertyConstruct || !propertyConstruct.typeConstruct) throw new Error('::2');
                    return getType(construct, propertyConstruct.typeConstruct);
                }

                return null;
            }

            function getType(construct, typeOrNameConstruct)
            {
                var importConstructs;
                var packageName;
                var typeName;
                if (construct.isInternal)
                {
                    importConstructs = construct.rootConstruct.importConstructs;
                    packageName = '';
                }
                else
                {
                    importConstructs = construct.packageConstruct.importConstructs;
                    if (construct.packageConstruct.nameConstruct == null) throw new Error('invalid: ' + construct.identifierToken.data + ', ' + construct.packageConstruct.constructor);
                    packageName = Construct.nameConstructToString(construct.packageConstruct.nameConstruct);
                }

                if (!typeOrNameConstruct)
                {
                    trace(construct.identifierToken.data);
                    output();
                }
                if (typeOrNameConstruct.constructor == Construct.TypeConstruct)
                {
                    if (!typeOrNameConstruct.nameConstruct && typeOrNameConstruct.mulToken) return lookupType('*');
                    if (!typeOrNameConstruct.nameConstruct && typeOrNameConstruct.voidToken) return lookupType('void');

                    if (!typeOrNameConstruct.nameConstruct) throw new Error('invalid: ' + construct.identifierToken.data + ', name: ' + name);
                    typeName = Construct.nameConstructToString(typeOrNameConstruct.nameConstruct);
                }
                else if (typeOrNameConstruct.constructor == Construct.NameConstruct) typeName = Construct.nameConstructToString(typeOrNameConstruct);
                else throw new Error('invalid type or name construct');

                if (typeName.split('.').length > 1) return lookupType(typeOrNameConstruct);

                //first check if it's a global
                if (!typeName) throw new Error("invalid type name");
                if (hasIdentifier(typeName) && lookupIdentifier(typeName).isGlobal) return lookupType(typeName);

                //then check in imports
                for (var i = 0; i < importConstructs.length; i++)
                {
                    var importConstruct = importConstructs[i];
                    var innerName = importConstruct.nameConstruct.identifierTokens[importConstruct.nameConstruct.identifierTokens.length - 1].data;

                    if (innerName == typeName) return lookupType(Construct.nameConstructToString(importConstruct.nameConstruct));
                }

                //search for implicit imports
                for (var id in _rootConstructs)
                {
                    var rootConstruct = _rootConstructs[id];

                    if (!rootConstruct) throw new Error('Root construct null for id: ' + id);
                    if (!rootConstruct.packageConstruct) throw new Error('Package construct missing in: ' + id);
                    if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct) continue;
                    if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct) continue;
                    if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
                    {
                        var a:String = Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct);
                        var b:String = Construct.nameConstructToString(construct.packageConstruct.nameConstruct);

                        if (a && (a != b)) continue;
                    }

                    if (hasIdentifier(id) && lookupIdentifier(id).isGlobal) continue;

                    if (!rootConstruct.packageConstruct.classConstruct && !rootConstruct.packageConstruct.interfaceConstruct) continue;

                    if (id.split('.').pop() != typeName) continue;

                    return lookupType(id);
                }

                if (typeName == construct.identifierToken.data) return lookupType(typeName);

                throw new Error('could not find type: ' + typeName + ' in ' + construct.identifierToken.data);
            }
        }

        private function print(string, tabs, newlines, preNewLines)
        {
            if (tabs) for (var i = 0; i < tabs; i++) string = '\t' + string;
            if (newlines) for (var i = 0; i < newlines; i++) string += '\n';
            if (preNewLines) for (var i = 0; i < preNewLines; i++) string = '\n' + string;
            return string;
        }
    }
}

internal class NamespaceObj
{
    public var name:*;
    public var normalizedName:String;
    public var isCustom:Boolean;
    public var isPrivate:Boolean;
    public var namespaceIsPrivate:Boolean;
    public var normalizedImportID:String;
    public var importID:String;
    public var identifier:Identifier;
	public var isStatic:Boolean;

    public function NamespaceObj(name:String, importID:String=null, identifier:Identifier=null)
    {
        this.name = name;

        var parts = name.split('.');
        var part = parts.pop();

        this.normalizedName = (parts.length) ? '$[\'' + parts.join('.') + '\'].' + part : part;
        this.isCustom = true;
        this.isPrivate = name == 'private';
        this.namespaceIsPrivate = false;

        if (importID) {
            parts = importID.split('.');
            part = parts.pop();

            this.normalizedImportID = (parts.length) ? '$[\'' + parts.join('.') + '\'].' + part : part;
        }

        this.importID = importID;
        this.identifier = identifier;
    }

    public function toString():String
    {
        return 'Namespace::: ' + this.name;
    }
}

internal class Type
{
    public var name:*;
    public var fullyQualifiedName:String;
    public var packageName:String;
    public var rootConstruct:Object;
    public var construct:*;
    public var isGlobal:Boolean;
    public var isInterface:Boolean;
    public var accessed:Boolean;

    public function Type(name:String, fullyQualifiedName:String, rootConstruct:Object, construct:*)
    {
        this.name = name;
        this.fullyQualifiedName = (fullyQualifiedName) ? fullyQualifiedName : name;

        var parts:Array = fullyQualifiedName.split('.');
        if (parts.length > 1)
        {
            parts.pop();
            this.packageName = parts.join('.');
        }
        else this.packageName = '';

        this.rootConstruct = rootConstruct;
        this.construct = construct;
        this.isGlobal = false;
        this.isInterface = false;
        this.accessed = false;


    }

    public function toString():String
    {
        if (this.construct) return 'Type::: ' + this.name + ' Construct: ' + ((this.construct.identifierToken) ? this.construct.identifierToken.data : '')
        else return 'Type::: ' + this.name;
    }
}
internal class ExpressionResult
{
    public var type:*;
    public var isNaN:Boolean;
    public var isNull:Boolean;
    public var isUndefined:Boolean;
    public var isVoid:Boolean;
    public var varIdentifier:Identifier;

    public function ExpressionResult(type:*, isNaN:Boolean, isNull:Boolean, isUndefined:Boolean, isVoid:Boolean, varIdentifier:Identifier=null)
    {
        this.type = type;
        this.isNaN = isNaN;
        this.isNull = isNull;
        this.isUndefined = isUndefined;
        this.isVoid = isVoid;
        this.varIdentifier = varIdentifier;
    }
}

internal class Identifier
{
    public var name:*;
    public var type:*;
    public var vectorType:*;

    public var namespaceObj:*;
    public var construct:*;
    public var isStatic:Boolean;
    public var isNative:Boolean;
    public var isPrivate:Boolean;
    public var isPackage:Boolean;
    public var isProperty:Boolean;
    public var isMethod:Boolean;
    public var isGlobal:Boolean;
    public var isType:Boolean;
    public var isImport:Boolean;
    public var isNamespace:Boolean;
    public var isInternal:Boolean;
    public var scope:*;
    public var accessed:Boolean;
    public var fullPackageName:String;

    public var isVar:Boolean;
    public var isVarInitialized:Boolean;

    function Identifier(name, type, vectorType=null)
    {
        this.name = name;
        this.type = type;
        this.vectorType = vectorType;

        this.namespaceObj;
        this.construct;
        this.isStatic = false;
        this.isNative = false;
        this.isPrivate = false;
        this.isPackage = false;
        this.isProperty = false;
        this.isMethod = false;
        this.isGlobal = false;
        this.isType = false;
        this.isImport = false;
        this.isNamespace = false;
        this.scope;
        this.accessed = false;
        this.fullPackageName;

        this.isVar = false;
        this.isVarInitialized = false; //the value has been set at least once
    }

    public function toString():String
    {
        return 'Identifier::: ' + this.name + ', scope: ' + this.scope;
    }
}