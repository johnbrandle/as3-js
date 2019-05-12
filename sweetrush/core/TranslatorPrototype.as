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

    public class TranslatorPrototype
    {
        public static function translate(rootConstruct, rootConstructs, dynamicPropertyAccess:Boolean=false, release:Boolean=false, fastPropertyAccess:Boolean=false)
        {
            var _rootConstruct = rootConstruct;
            var _rootConstructs = rootConstructs;
            var _indent = -1;
            var _count = -1; //for for each loops
            var _level = 0; //for identifier, namespace, and type scope


            var _fastPropertyAccess = fastPropertyAccess = false; //does not appear to have a significant performance impact (20ms max), so not using for now considering the tradeoff in compatiblity
            var _dynamicPropertyAccess = false;

            var _inClosure = false;
            var _inNamespacedFunction = false;
            var _inStaticFunction = false;
            var _inIfStatement = 0;

            var _importNameConflicts = {};
            var _extendsNameConflict = false;

            function upLevel()
            {
                _indent++;
                _level++;
                return _level;
            }

            function downLevel()
            {
                _indent--;
                _level--;
                return _level;
            }

            function lookupConstructInRootConstruct(rootConstruct, object)
            {
                if (!rootConstruct || !object) throw new Error('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object);
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

            var packageConstruct = rootConstruct.packageConstruct;
            var js = print('$es4.$$package(\'' + (packageConstruct.nameConstruct ? Construct.nameConstructToString(packageConstruct.nameConstruct) : '') + '\').', _indent, 0);

            if (packageConstruct.classConstruct)
            {
                if (packageConstruct.classConstruct.UNIMPLEMENTEDToken)
                {
                    if (release)
                    {
                        js += packageConstruct.classConstruct.identifierToken.data + ' = null;\n';
                        return js;
                    }
                    js = (packageConstruct.nameConstruct) ? '$es4.$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
                    js += '.' + packageConstruct.classConstruct.identifierToken.data;
                    js += ' = function () { throw new Error(\'Use of unimplemented class: ' + packageConstruct.classConstruct.identifierToken.data + '\'); }';
                    js += '\n';

                    return js;
                }

                js += print(translateClassConstruct(packageConstruct.classConstruct), _indent, 0);
            }
            js += (packageConstruct.interfaceConstruct) ? print(translateInterfaceConstruct(packageConstruct.interfaceConstruct), _indent, 0) : '';
            js += (packageConstruct.propertyConstruct) ? print(translatePropertyConstruct(packageConstruct.propertyConstruct), _indent, 0) : '';
            if (packageConstruct.methodConstruct)
            {
                if (packageConstruct.methodConstruct.UNIMPLEMENTEDToken)
                {
                    if (release)
                    {
                        js += packageConstruct.methodConstruct.identifierToken.data + ' = null;\n';
                        return js;
                    }
                    js = (packageConstruct.nameConstruct) ? '$es4.$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
                    js += '.' + packageConstruct.methodConstruct.identifierToken.data;
                    js += ' = function () { throw new Error(\'Use of unimplemented function: ' + packageConstruct.methodConstruct.identifierToken.data + '\'); }';
                    js += '\n';

                    return js;
                }

                _inStaticFunction = true;
                js += print(translateFunctionConstruct(packageConstruct.methodConstruct), _indent, 0);
            }

            return js;

            function getTranslatedTypeName(type)
            {
                if (type.name == '*' || type.name == 'void') return '';

                if (_importNameConflicts[type.name])
                {
                    var fullyQualifiedName = type.fullyQualifiedName;
                    var parts = fullyQualifiedName.split('.');
                    var name = parts.pop();
                    return '$es4.$$[\'' + parts.join('.') + '\'].' + name;
                }

                return type.name;
            }

            function translateInterfaceConstruct(construct)
            {
                upLevel();

                var js = print(construct.identifierToken.data + ' = (function ()', 0, 1);
                js += print('{', _indent, 1);

                //class function
                js += print('function ' + construct.identifierToken.data + '()', _indent + 1, 1);
                js += print('{', _indent + 1, 1);

                //deal with casting
                js += print('//handle cast', _indent + 2, 1);
                js += print('return $es4.$$as(arguments[0], ' + construct.identifierToken.data + ');', _indent + 2, 1);

                js += print('}', _indent + 1, 1);

                var comma = false;
                var innerJS = '';
                if (construct.extendsNameConstructs.length)
                {
                    innerJS += 'IMPLEMENTS:[';
                    for (var i = 0; i < construct.extendsNameConstructs.length; i++)
                    {
                        if (comma) innerJS += ', ';
                        var type = construct.extendsNameConstructs[i].type;

                        var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstructs[i]);
                        if (innerConstruct.isInternal) innerJS += comma = type.fullyQualifiedName;
                        else innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
                    }

                    innerJS += comma = ']';
                }
                if (!construct.isInternal)
                {
                    if (_rootConstruct.classConstructs.length)
                    {
                        if (comma) innerJS += ', ';
                        innerJS += 'CLASSES:[';
                        comma = false;
                        for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
                        {
                            if (comma) innerJS += ', ';
                            innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data
                        }

                        innerJS += comma = ']';
                    }
                    if (_rootConstruct.interfaceConstructs.length)
                    {
                        if (comma) innerJS += ', ';
                        innerJS += 'INTERFACES:[';
                        comma = false;
                        for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
                        {
                            if (comma) innerJS += ', ';
                            innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data
                        }

                        innerJS += comma = ']';
                    }
                }

                var packageName = construct.packageName;
                var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;

                if (innerJS)
                {
                    js += print('return $es4.$$interface(' + construct.identifierToken.data + ', ', _indent + 1, 0, 1);
                    js += '{' + innerJS + '}';
                    js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
                }
                else
                {
                    js += print('return $es4.$$interface(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
                    js += print('\'' + fullyQualifiedName + '\');', 0, 1);
                }

                js += print('})();', _indent, 1);

                downLevel();

                return js;
            }

            function translatePropertyConstruct(construct)
            {
                return print(construct.identifierToken.data + ' = $es4.$$namespace(' + translateExpression(construct.valueExpression, _indent, false, construct) + ', true);', 0, 1);
            }

            function translateFunctionConstruct(construct)
            {
                upLevel();

                var importConstructs = _rootConstruct.packageConstruct.importConstructs;

                var js = '';
                var innerJS;
                var cr = false;

                var accessor = construct.getToken || construct.setToken;

                js += print(construct.identifierToken.data + ' = (function ()', 0, 1);

                js += print('{', _indent, 1);
                js += print('var $$this = ' + construct.identifierToken.data + ', $$thisp = ' + construct.identifierToken.data + ';', _indent + 1, 1);

                js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
                js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
                js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
                if (accessor)
                {
                    js += print(construct.identifierToken.data + '.$$pcinit = ' + construct.identifierToken.data + ';', _indent + 1, 1, 1);
                    js += print('return ' + construct.identifierToken.data + ';', _indent + 1, 1, 0);
                }
                else js += print('return $es4.$$function (' + construct.identifierToken.data + ');', _indent + 1, 1, 1);

                js += print('})();', _indent, 1);

                downLevel();

                return js;

                function translateImports(construct)
                {
                    var js = '';
                    if (importConstructs.length) js += print('//imports', _indent + 1, 1);

                    for (var i = 0; i < importConstructs.length; i++)
                    {
                        js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
                    }

                    return js;
                }

                function translateClassInitializer(construct)
                {
                    _inStaticFunction = true;
                    var js = print('//function initializer', _indent + 1, 1);
                    js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
                    js += print('{', _indent + 1, 1);
                    js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 1);

                    //initialize import aliases
                    var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
                    if (importConstructs.length) js += print('//initialize imports', _indent + 2, 1, 1);

                    var importNames = {};
                    importNames[construct.identifierToken.data] = true;

                    for (var i = 0; i < importConstructs.length; i++)
                    {
                        var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
                        var packageName = '';
                        if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
                        {
                            var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
                            fullyQualifiedName = fullyQualifiedName.split('.');
                            fullyQualifiedName.pop();
                            packageName = fullyQualifiedName.join('.');
                        }

                        if (importNames[name])
                        {
                            _importNameConflicts[name] = true;
                            continue;
                        }
                        else importNames[name] = true;

                        js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
                    }

                    js += print('});', _indent + 1, 1);
                    _inStaticFunction = false;
                    return js;
                }

                function translateClassFunction(construct)
                {
                    upLevel();

                    var js = '';

                    if (accessor)
                    {
                        var name = construct.getToken ? 'getter' : 'setter';
                        js += print('function ' + construct.identifierToken.data + '() { $es4.$$' + name + '(\'' + construct.identifierToken.data + '\', ' + '$es4.$$package(\'' + (construct.packageConstruct.nameConstruct ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '') + '\'), (function ()', _indent, 1);
                    }
                    else js += print('function ' + construct.identifierToken.data + '(', _indent, 0);

                    js += translateParameters(construct, construct);
                    if (!accessor) js += print(')', 0, (_indent) ? 1 : 0);
                    js += print('{', _indent, (_indent) ? 1 : 0);

                    //initialize class if not initialized
                    js += print('//initialize function if not initialized', _indent + 1, 1);
                    js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                    js += translateDefaultParameterValues(construct, construct);

                    if (accessor)
                    {
                        js += print('//change reference', _indent + 1, 1, 1);
                        js += print(construct.identifierToken.data + ' = this;', _indent + 1, construct.bodyStatements.length ? 2 : 1);
                    }

                    if (construct.isJavaScript) js += construct.javaScriptString;
                    else
                    {
                        js += translateStatements(construct.bodyStatements, _indent + 1, construct);
                    }

                    if (accessor)
                    {
                        js += print('})', (construct.isJavaScript) ? 0 : _indent, 0);
                        js += print(');}', 0, 1);
                    }
                    else js += print('}', 0, 1);

                    downLevel();

                    return js;
                }
            }

            function translateClassConstruct(construct)
            {
                var js = '';

                upLevel();

                _extendsNameConflict = construct.extendsNameConflict;

                var innerJS;
                var cr = false;
                js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
                js += print('{', _indent, 1);
                js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
                js += (innerJS = translateNamespaces(construct, true)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
                js += (innerJS = translateStaticProperties(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';

                js += (innerJS = translateClassPreInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';

                js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';

                js += (innerJS = translateStaticMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateStaticAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += (innerJS = translateConstruct(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInitializer(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateConstructor(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += (innerJS = translateInternalClasses(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInternalInterfaces(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateClassReturnStatement(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += print('})();', _indent, 1);

                downLevel();

                return js;
            }

            function translateClassPreInitializer(construct)
            {
                _inStaticFunction = true;
                var js = print('//class pre initializer', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$sinit = (function ()', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$sinit = undefined;', _indent + 2, 2);

                //initialize import aliases
                var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
                if (importConstructs.length) js += print('//initialize imports', _indent + 2, 1);
                var found = false;

                var extraCR = 0;
                var importNames = {};
                importNames[construct.identifierToken.data] = true;

                for (var i = 0; i < importConstructs.length; i++)
                {
                    found = true;

                    var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
                    var packageName = '';
                    if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
                    {
                        var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
                        fullyQualifiedName = fullyQualifiedName.split('.');
                        fullyQualifiedName.pop();
                        packageName = fullyQualifiedName.join('.');
                    }

                    if (importNames[name])
                    {
                        _importNameConflicts[name] = true;
                        continue;
                    }
                    else importNames[name] = true;

                    extraCR = 1;
                    js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
                }

                var className = construct.identifierToken.data;
                var superClassName = 'Object';
                if (construct.extendsNameConstruct)
                {
                    superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
                    js += print('//ensure $$sinit is called on super class', _indent + 2, 1, extraCR);
                    js += print('if (' + superClassName + '.$$sinit !== undefined) ' + superClassName + '.$$sinit();', _indent + 2, 1);
                }

                js += print('//set prototype and constructor', _indent + 2, 1, extraCR);
                js += print(className + '.prototype = Object.create(' + superClassName + '.prototype);', _indent + 2, 1);
                js += print('Object.defineProperty(' + className + '.prototype, "constructor", { value: ' + className + ', enumerable: false });', _indent + 2, 2);

				extraCR = 0;

                //js += print('Object.defineProperty(' + className + '.prototype, \'$$construct\', {value:' + className + '.$$construct});', _indent + 2, 1);
                js += print('//hold private values', _indent + 2, 1);
                js += print('Object.defineProperty(' + className + '.prototype, \'$$v\', {value:{}});', _indent + 2, 1);

                var innerJS;
                js += (innerJS = translateInstanceMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInstanceAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInstanceProperties(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += print('});', _indent + 1, 1);
                _inStaticFunction = false;
                return js;
            }

            function translateClassInitializer(construct)
            {
                _inStaticFunction = true;
                var js = print('//class initializer', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 1);

                //initialize statics
                var found = false;
                for (var i = 0; i < construct.propertyConstructs.length; i++)
                {
                    var propertyConstruct = construct.propertyConstructs[i];
                    if (!propertyConstruct.staticToken) continue;
                    if (propertyConstruct.translatedEarlier) continue; //todo, add this property to propertyConstruct definition. we are currently using this for primitive static constants

                    if (!found)
                    {
                        found = true;
                        js += print('//initialize properties', _indent + 2, 1, 1);
                    }

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var type = getTranslatedTypeName(propertyConstruct.identifier.type);

                    js += print('$$j.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);

                    if (type) js += '$es4.$$coerce(';
                    js += (propertyConstruct.valueExpression) ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : 'undefined';
                    if (type) js += ', ' + type + ')'

                    js += print(';', 0, 1);
                }

                if (found) js += print('', _indent + 1, 1);

                //class initializers
                js += translateStatements(construct.initializerStatements, _indent + 2, construct);

                js += print('});', _indent + 1, 1);
                _inStaticFunction = false;
                return js;
            }

            function translateClassFunction(construct)
            {
                var js = '';

                upLevel();

                var js = print('function ' + construct.identifierToken.data + '()', _indent, 1);
                js += print('{', _indent, 1);

                //initialize class if not initialized
                js += print('var $$this;', _indent + 1, 2);

                //js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                //save scope
                js += print('//save scope', _indent + 1, 1);
                js += print('if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];', _indent + 1, 1);
                js += print('else', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print('var $$this = this;', _indent + 2, 2);
                js += print('if (!($$this instanceof ' + construct.identifierToken.data + ') || $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ' !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + construct.identifierToken.data + ') : $es4.$$throwArgumentError();', _indent + 2, 1);
                js += print('}', _indent + 1, 1);

                var innerJS;

                //js += (innerJS = translateInstanceProperties(construct)) ? print(innerJS, 0, 0, 1) : '';
                //js += (innerJS = translateInitializer(construct)) ? print(innerJS, 0, 0, 1) : '';
                //js += (innerJS = translateConstructor(construct)) ? print(innerJS, 0, 0, 1) : '';
                //js += (innerJS = translateInstanceMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
                //js += (innerJS = translateInstanceAccessors(construct, false)) ? print(innerJS, 0, 0, 1) : '';

                js += print('//call construct if no arguments, or argument zero does not equal manual construct', _indent + 1, 1, 1);
                js += print('if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print('for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];', _indent + 2, 2);
                js += print(construct.identifierToken.data + '.$$construct($$this, $$args);', _indent + 2, 1);
                js += print('}', _indent + 1, 1);

                js += print('}', _indent, 1);

                downLevel();

                return js;
            }

            function translateConstruct(construct)
            {
                _inStaticFunction = true;
                var js = print('//construct', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$construct = (function ($$this, args)', _indent + 1, 1);
                js += print('{', _indent + 1, 1);

                //initialize class if not initialized
                js += print('//initialize function if not initialized', _indent + 2, 1);
                js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 2, 2);

                //hold property values, and methods
                js += print('//hold property values, and methods', _indent + 2, 1);
                js += print('Object.defineProperty($$this, \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', {value:{$$this:$$this, $$p:{}, $$ns:{}}});', _indent + 2, 2);

                upLevel();
                var innerJS;
                innerJS = translateNamespaces(construct, false);
                if (innerJS) js += print(innerJS, 0, 0, 1);

                js += translateNamespaceInstanceMethods(construct);
                downLevel();

                var propertyConstructs = construct.instancePropertyConstructs;
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;

                    if (!namespaceObj.isPrivate) continue;

                    js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + propertyConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + propertyConstruct.identifierToken.data + ');', _indent + 2, 1);
                }

                //TODO create private properties, accessors, and methods here.
                for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
                {
                    var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
                    var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;

                    var methodConstruct = setterMethodConstruct || getterMethodConstruct;

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var isPrivate = methodConstruct.namespaceToken.data == 'private';

                    if (!isPrivate) continue;

                    js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ');', _indent + 2, 1);
                }

                js += print(innerJS, 0, 0, 1);

                for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.instanceMethodConstructs[i];

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    if (namespaceObj.isCustom) continue;
                    if (!methodConstruct.identifier.namespaceObj.isPrivate) continue;

                    var type = methodConstruct.identifier.type;

                    js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent + 2, 1);
                    js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ');', _indent + 2, 2);
                }

                //call construct on super
                if (construct.extendsNameConstruct)
                {
                    var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
                    js += print('//call construct on super', _indent + 2, 1);
                    js += print(superClassName + '.$$construct($$this);', _indent + 2, 2, 0);
                }

                js += print('//initialize properties', _indent + 2, 1);
                js += print(construct.identifierToken.data + '.$$iinit($$this);', _indent + 2, 2, 0);

                js += print('//call constructor', _indent + 2, 1);
                js += print('if (args !== undefined) ' + construct.identifierToken.data + '.$$constructor.apply($$this, args);', _indent + 2, 1, 0);

                js += print('});', _indent + 1, 1);
                _inStaticFunction = false;
                return js;
            }

            function translateInitializer(construct)
            {
                _inStaticFunction = true;
                var js = print('//initializer', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$iinit = (function ($$this)', _indent + 1, 1);
                js += print('{', _indent + 1, 1);

                //initialize properties
                var found = false;
                for (var i = 0; i < construct.instancePropertyConstructs.length; i++)
                {
                    var propertyConstruct = construct.instancePropertyConstructs[i];

                    if (!found)
                    {
                        found = true;
                        js += print('//initialize properties', _indent + 2, 1);
                    }

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var type = getTranslatedTypeName(propertyConstruct.identifier.type);

                    if (!namespaceObj.isPrivate) js += print('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);
                    else js += print('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);

                    if (type) js += '$es4.$$coerce(';
                    js += (propertyConstruct.valueExpression) ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : 'undefined';
                    if (type) js += ', ' + type + ')'

                    js += print(';', 0, 1);
                }

                if (found) js += print('', _indent + 1, 1);

                //call initialize on super
                if (construct.extendsNameConstruct)
                {
                    var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
                    js += print('//call iinit on super', _indent + 2, 1);
                    js += print(superClassName + '.$$iinit($$this);', _indent + 2, 1, 0);
                }

                js += print('});', _indent + 1, 1);
                _inStaticFunction = false;
                return js;
            }

            function translateConstructor(construct)
            {
                upLevel();

                var methodConstruct = construct.constructorMethodConstruct;

                var js = print('//constructor', _indent, 1);
                js += print(construct.identifierToken.data + '.$$constructor = (function (', _indent, 0);
                if (methodConstruct) js += translateParameters(methodConstruct, construct);
                js += print(')', 0, 1);
                js += print('{', _indent, 1);

                js += print('var $$this = this;', _indent + 1, 1, 0);

                if (methodConstruct) js += translateDefaultParameterValues(methodConstruct, construct);

                //deal with super if we are extending a class
                var carriage = false;
                if (construct.extendsNameConstruct && (!methodConstruct || (methodConstruct && !methodConstruct.callsSuper)))
                {
                    var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
                    js += print(superClassName + '.$$constructor.call($$this);', _indent + 1, 1, 1);
                    carriage = true;
                }

                //body statements
                if (methodConstruct)
                {
                    var innerJS = print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
                    if (innerJS && carriage) js += print('', 0, 1);
                    if (innerJS) js += innerJS;
                }

                js += print('});', _indent, 1);
                downLevel();

                return js;
            }

            function translateInternalClasses(construct)
            {
                if (construct.isInternal) return '';

                var js = '';
                for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
                {
                    if (js) js += print('', 0, 1);
                    js += print('////////////////INTERNAL CLASS////////////////', _indent + 1, 1);
                    js += print('var ' + translateClassConstruct(_rootConstruct.classConstructs[i]), 1, 0);
                }
                return js;
            }

            function translateInternalInterfaces(construct)
            {
                if (construct.isInternal) return '';

                var js = '';
                for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
                {
                    if (js) js += print('', 0, 1);
                    js += print('////////////////INTERNAL INTERFACE////////////////', _indent + 1, 1);
                    js += print('var ' + translateInterfaceConstruct(_rootConstruct.interfaceConstructs[i]), 1, 0);
                }
                return js;
            }

            function translateClassReturnStatement(construct)
            {
                var js = print('return $es4.$$class(' + construct.identifierToken.data + ', ', _indent + 1, 0);
                var comma = false;
                var innerJS = '';
                if (construct.extendsNameConstruct)
                {
                    var type = construct.extendsNameConstruct.type;

                    var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstruct);
                    if (innerConstruct.isInternal) innerJS += comma = 'EXTENDS:' + type.fullyQualifiedName;
                    else innerJS += comma = 'EXTENDS:\'' + type.fullyQualifiedName + '\'';
                }
                if (construct.implementsNameConstructs.length)
                {
                    if (comma) innerJS += ', ';
                    innerJS += 'IMPLEMENTS:[';
                    comma = false;
                    for (var i = 0; i < construct.implementsNameConstructs.length; i++)
                    {
                        if (comma) innerJS += ', ';
                        var type = construct.implementsNameConstructs[i].type;

                        var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.implementsNameConstructs[i]);
                        if (innerConstruct.isInternal) innerJS += comma = type.fullyQualifiedName;
                        else innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
                    }

                    innerJS += comma = ']';
                }
                if (!construct.isInternal)
                {
                    if (_rootConstruct.classConstructs.length)
                    {
                        if (comma) innerJS += ', ';
                        innerJS += 'CLASSES:[';
                        comma = false;
                        for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
                        {
                            if (comma) innerJS += ', ';
                            innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data;
                        }

                        innerJS += comma = ']';
                    }
                    if (_rootConstruct.interfaceConstructs.length)
                    {
                        if (comma) innerJS += ', ';
                        innerJS += 'INTERFACES:[';
                        comma = false;
                        for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
                        {
                            if (comma) innerJS += ', ';
                            innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data;
                        }

                        innerJS += comma = ']';
                    }
                }

                var packageName = construct.packageName;
                var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;

                if (innerJS)
                {
                    js += '{' + innerJS + '}';
                    js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
                }
                else
                {
                    js = print('return $es4.$$class(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
                    js += print('\'' + fullyQualifiedName + '\');', 0, 1);
                }

                return js;
            }

            /*
            function translateInitializer(construct)
            {
                upLevel();

                var js = print('//initializer', _indent, 1);
                js += print('$es4.$$iinit($$thisp, (function ()', _indent, 1);
                js += print('{', _indent, 1);

                //initialize properties
                var found = false;
                for (var i = 0; i < construct.instancePropertyConstructs.length; i++)
                {
                    var propertyConstruct = construct.instancePropertyConstructs[i];
                    if (!propertyConstruct.valueExpression) continue;

                    if (!found)
                    {
                        found = true;
                        js += print('//initialize properties', _indent + 1, 1);
                    }

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    if (namespaceObj.isCustom)
                    {
                        var namespaceString = '$$thisp.' + propertyConstruct.namespaceToken.data;
                        if (namespaceObj.importID) namespaceString = namespaceObj.normalizedImportID;
                        js += print('$es4.$$namespace(' + namespaceString + ', $$this).' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
                        js += translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                        js += print(';', 0, 1);
                    }
                    else
                    {
                        if (propertyConstruct.isNative)
                        {
                            js += print(propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);

                            var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                            var typeString = getTranslatedTypeName(propertyConstruct.identifier.type);

                            if (propertyConstruct.coerce && isCoerceRequired(propertyConstruct, typeString, valueJS)) js += '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
                            else js += valueJS;
                            js += print(';', 0, 1);
                        }
                        else if (_dynamicPropertyAccess)
                        {
                            js += print('$es4.$$set($$this, $$this, $$thisp, \'' +  propertyConstruct.identifierToken.data + '\', ' + translateExpression(propertyConstruct.valueExpression, _indent, false, construct) + ', \'=\')', _indent + 1, 0);
                            js += print(';', 0, 1);
                        }
                        else
                        {
                            js += print('$$this.' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
                            js += translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                            js += print(';', 0, 1);
                        }
                    }
                }

                js += print('}));', _indent, 1);

                downLevel();

                return (found) ? js : '';
            }
            */

            function translateImports(construct)
            {
                var js = '';

                var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;

                if (importConstructs.length) js += print('//imports', _indent + 1, 1);

                for (var i = 0; i < importConstructs.length; i++)
                {
                    js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
                }

                return js;
            }

            function translateNamespaces(construct, isClassLevel)
            {
                var js = '';
                var propertyConstructs = construct.namespacePropertyConstructs;
                var counter = 0;
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (!js) js += print('//namespaces', _indent + 1, 1);
                    js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_namespace(' + (propertyConstruct.valueExpression ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + construct.identifierToken.data + '\'') + ', ' + ((isClassLevel) ? construct.identifierToken.data : (propertyConstruct.namespaceToken.data == 'private' ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns') : '$$this')) + ', \'' + propertyConstruct.identifierToken.data + '\');', _indent + 1, 1);
                }

                return js;
            }

            function translateStaticProperties(construct)
            {
                var js = '';
                var propertyConstructs = construct.staticPropertyConstructs;
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (!js)
                    {
                        js += print('//properties', _indent + 1, 1);
                        js += print('var $$j = {};', _indent + 1, 1);
                    }
                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var type = propertyConstruct.identifier.type;
                    var scope = construct.identifierToken.data;

                    if (namespaceObj.isCustom) throw new Error('custom static properties not supported at the moment');

                    var returnString = getTranslatedTypeName(type);

                    if (propertyConstruct.constToken && propertyConstruct.valueExpression) //handling consts diff. hack.. for now
                    {
                        if (returnString == 'String' || returnString == 'uint' || returnString == 'int' || returnString == 'Number' || returnString == 'Boolean')
                        {
                            var constructor = propertyConstruct.valueExpression.constructor;
                            if (constructor === Construct.StringExpression || constructor === Construct.NumberExpression || constructor === Construct.BooleanExpression)
                            {
                                var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);

                                var coerce = false;
                                if (constructor === Construct.StringExpression && returnString != 'String') coerce = true;
                                else if (constructor === Construct.BooleanExpression && returnString != 'Boolean') coerce = true;
                                else if (constructor === Construct.NumberExpression)
                                {
                                    if (returnString == 'uint')
                                    {
                                        if (parseInt(valueJS) != (valueJS >>> 0)) coerce = true;
                                    }
                                    else if (returnString == 'int')
                                    {
                                        if (parseInt(valueJS) != (valueJS >> 0)) coerce = true;
                                    }
                                }

                                if (coerce) js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(' + valueJS + ', ' + returnString + ');', _indent + 1, 1);
                                else js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = ' + valueJS + ';', _indent + 1, 1);
                                propertyConstruct.translatedEarlier = true; //todo. add this to property construct definition
                                continue;
                            }
                        }
                    }

                    js += print('Object.defineProperty(' + construct.identifierToken.data + ', \'' + propertyConstruct.identifierToken.data + '\', {', _indent + 1, 1);
                    js += print('get:function () { ', _indent + 1, 0);;
                    js += 'if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit(); ';
                    js += print('return $$j.' + propertyConstruct.identifierToken.data + '; },', 0, 1);
                    js += print('set:function (value) { ', _indent + 1, 0);;
                    js += 'if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit(); ';
                    if (returnString) js += print('$$j.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', 0, 1);
                    else js += print('$$j.' + propertyConstruct.identifierToken.data + ' = value }', 0, 1);
                    js += print('});', _indent + 1, 2);
                }

                return js;
            }

            function translateInstanceProperties(construct)
            {
                var js = '';
                var propertyConstructs = construct.instancePropertyConstructs;
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (!js) js += print('//properties', _indent + 2, 1);

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;

                    if (namespaceObj.isCustom) throw new Error('custom namespace properties not supported at this time');

                    var returnString = getTranslatedTypeName(propertyConstruct.identifier.type);

                    if (namespaceObj.isPrivate)
                    {
                        js += print(construct.identifierToken.data + '.prototype.$$v.' + propertyConstruct.identifierToken.data + ' = {', _indent + 2, 1);
                        js += print('get:function () { var $$this = this.$$this; return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + '; },', _indent + 2, 1);
                        if (returnString) js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
                        else js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = value }', _indent + 2, 1);
                        js += print('};', _indent + 2, 2);
                        continue;
                    }

                    js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + propertyConstruct.identifierToken.data + '\', {', _indent + 2, 1);
                    js += print('get:function () { var $$this = this; return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + '; },', _indent + 2, 1);
                    if (returnString) js += print('set:function (value) { var $$this = this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
                    else js += print('set:function (value) { var $$this = this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = value }', _indent + 2, 1);
                    js += print('});', _indent + 2, 2);
                }

                return js;
            }

            function translateStaticMethods(construct)
            {
                var js = '';
                for (var i = 0; i < construct.staticMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.staticMethodConstructs[i];

                    var namespaceObj = methodConstruct.identifier.namespaceObj;

                    if (methodConstruct.isJavaScript)
                    {
                        if (namespaceObj.isCustom) js += translateCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct);
                        else js += translateNoCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct);
                    }
                    else
                    {
                        if (namespaceObj.isCustom) js += translateCustomNamespaceStaticMethod(construct, methodConstruct);
                        else js += translateNoCustomNamespaceStaticMethod(construct, methodConstruct);
                    }

                    if (i + 1 < construct.staticMethodConstructs.length) js += print('', 0, 2);
                }

                return js;
            }

            function translateNoCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct)
            {
                _inStaticFunction = true;

                var js = '';
                var namespaceObj = methodConstruct.identifier.namespaceObj;
                var type = methodConstruct.identifier.type;

                upLevel();

                js += print('//' + methodConstruct.identifier.namespaceObj.name + ' static method', _indent, 1, (js) ? 1 : 0);

                if (getTranslatedTypeName(type)) js += translateJavaScriptWithReturnTypeStaticMethod(construct, methodConstruct);
                else js += translateJavaScriptWithoutReturnTypeStaticMethod(construct, methodConstruct);

                downLevel();

                _inStaticFunction = false;

                return js;

                function translateJavaScriptWithReturnTypeStaticMethod(construct, methodConstruct)
                {
                    var js = '';

                    js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function () { return $es4.$$coerce((function (', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, 1);
                    js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    js += methodConstruct.javaScriptString;

                    js += print('', 0, 1);
                    js += print('}).apply(this, arguments), ' + getTranslatedTypeName(type) + ');});', _indent, 1);

                    return js;
                }

                function translateJavaScriptWithoutReturnTypeStaticMethod(construct, methodConstruct)
                {
                    var js = '';

                    js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function (', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, 1);
                    js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    js += methodConstruct.javaScriptString;

                    js += print('', _indent, 1);
                    js += print('});', _indent, 0);

                    return js;
                }
            }

            function translateCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct)
            {
                return 'TODO translateCustomNamespaceJavaScriptStaticMethod';
            }

            function translateNoCustomNamespaceStaticMethod(construct, methodConstruct)
            {
                _inStaticFunction = true;
                var js = '';

                var namespaceObj = methodConstruct.identifier.namespaceObj;

                upLevel();

                var type = methodConstruct.identifier.type;

                js += print('//' + methodConstruct.identifier.namespaceObj.name + ' static method', _indent, 1, (js) ? 1 : 0);

                js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function (', _indent, 0);

                js += translateParameters(methodConstruct, construct);
                js += print(')', 0, 1);
                js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
                js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                js += translateDefaultParameterValues(methodConstruct, construct);
                if (methodConstruct.UNIMPLEMENTEDToken && release)
                {
                    js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                }
                else
                {
                    js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
                }

                js += print('});', _indent, 0);

                downLevel();

                _inStaticFunction = false;

                return js;
            }

            function translateCustomNamespaceStaticMethod(construct, methodConstruct)
            {
                return 'TODO translateCustomNamespaceStaticMethod';
            }

            function translateInstanceMethods(construct)
            {
                var js = '';
                for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.instanceMethodConstructs[i];

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var type = methodConstruct.identifier.type;

                    if (methodConstruct.isJavaScript)
                    {
                        if (namespaceObj.isCustom) continue;
                        else js += translateNoCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct);
                    }
                    else
                    {
                        if (namespaceObj.isCustom) continue;
                        else js += translateNoCustomNamespaceInstanceMethod(construct, methodConstruct);
                    }

                    if (i + 1 < construct.instanceMethodConstructs.length) js += print('', 0, 2);
                }

                return js;
            }

            function translateNamespaceInstanceMethods(construct)
            {
                var js = '';
                for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.instanceMethodConstructs[i];

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var type = methodConstruct.identifier.type;

                    if (!namespaceObj.isCustom) continue;

                    if (methodConstruct.isJavaScript) js += translateCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct);
                    else js += translateCustomNamespaceInstanceMethod(construct, methodConstruct);

                    if (i + 1 < construct.instanceMethodConstructs.length) js += print('', 0, 2);
                }

                return js;
            }


            function translateCustomNamespaceInstanceMethod(construct, methodConstruct)
            {
                upLevel();
                upLevel();

                var js = '';

                var namespaceObj = methodConstruct.identifier.namespaceObj;
                var type = methodConstruct.identifier.type;

                js += print('//custom namespace method', _indent, 1, 1);
                var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + (namespaceObj.namespaceIsPrivate ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') : '$$this.') + namespaceObj.normalizedName;

                js += print('$es4.$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', $$this, ' + ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns') + namespaceString + ', (function (', _indent, 0);

                js += translateParameters(methodConstruct, construct);
                js += print(')', 0, 1);
                js += print('{', _indent, 1);

                js += translateDefaultParameterValues(methodConstruct, construct);
                if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                else
                {
                    _inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') + namespaceObj.name;

                    js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                    _inNamespacedFunction = false;
                }

                js += print('})', _indent, 0);
                js += print(');', 0, 1);

                downLevel();
                downLevel();

                return js;
            }

            function translateNoCustomNamespaceInstanceMethod(construct, methodConstruct)
            {
                upLevel();
                upLevel();

                var js = '';
                var namespaceObj = methodConstruct.identifier.namespaceObj;
                var type = methodConstruct.identifier.type;

                js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent, 1);
                js += (methodConstruct.identifier.namespaceObj.isPrivate) ? translatePrivate() : translateOther();

                downLevel();
                downLevel();

                return js;

                function translatePrivate()
                {
                    var js = '';
                    js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent, 1);

                    js += print('get:function ()', _indent, 1);
                    js += print('{', _indent, 1);

                    js += print('var $$this = this.$$this;', _indent + 1, 2);

                    upLevel();

                    js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, 1);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    else js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                    js += print('}', _indent, 2);

                    var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.$$' + methodConstruct.identifierToken.data;
                    js += print('return ' + name + ' || (' + name + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);

                    //js += print('return ($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== undefined && $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ') ? $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' : ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);

                    downLevel();

                    js += print('}};', _indent, 1);

                    return js;
                }

                function translateOther()
                {
                    var js = '';
                    js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent, 1);

                    js += print('get:function ()', _indent, 1);
                    js += print('{', _indent, 1);

                    js += print('var $$this = this;', _indent + 1, 2);

                    upLevel();

                    js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, 1);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    else js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                    js += print('}', _indent, 2);

                    var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$' + methodConstruct.identifierToken.data;
                    js += print('return ' + name + ' || (' + name + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);

                    //js += print('return ($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' !== undefined && $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' !== $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ') ? $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' : ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);

                    downLevel();

                    js += print('}});', _indent, 1);

                    return js;
                }
            }

            function translateNoCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct)
            {
                upLevel();
                upLevel();

                var js = '';
                var namespaceObj = methodConstruct.identifier.namespaceObj;
                var type = methodConstruct.identifier.type;

                js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent, 1);
                js += (methodConstruct.identifier.namespaceObj.isPrivate) ? translatePrivate() : translateOther();

                downLevel();
                downLevel();

                return js;

                function translatePrivate()
                {
                    var js = '';
                    js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent, 1);

                    js += print('get:function ()', _indent, 1);
                    js += print('{', _indent, 1);

                    js += print('var $$this = this.$$this;', _indent + 1, 2);

                    upLevel();

                    js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, 1);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    js += methodConstruct.javaScriptString;
                    js += print('', 0, 1);
                    js += print('}', _indent, 2);

                    //throw new Error('test');
                    var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.$$' + methodConstruct.identifierToken.data;

                    if (getTranslatedTypeName(type)) js += print('return ' + name + ' || (' + name + ' = function () { return $es4.$$coerce(' + methodConstruct.identifierToken.data + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); });', _indent, 1);//js += print('return ($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== undefined && $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ') ? $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' : ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' = function () { return ' + methodConstruct.identifierToken.data + '.apply($$this, arguments); });', _indent, 1);
                    else js += print('return ' + name + ' || (' + name + ' = function () { return ' + methodConstruct.identifierToken.data + '.apply($$this, arguments); });', _indent, 1);//js += print('return ($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== undefined && $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' !== $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ') ? $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' : ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + methodConstruct.identifierToken.data + ' = function () { return $es4.$$coerce(' + methodConstruct.identifierToken.data + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); });', _indent, 1);

                    downLevel();

                    js += print('}};', _indent, 1);

                    return js;
                }

                function translateOther()
                {
                    var js = '';
                    js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent, 0);
                    js += print(' get:function ()', 0, 0);
                    js += print(' {', 0, 0);
                    js += print(' var $$this = this; ', 0, 0);
                    js += print('return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' || ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' = ', 0, 0);
                    if (getTranslatedTypeName(type)) js += print('function () { return $es4.$$coerce(' + methodConstruct.identifierToken.data + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); }); }});', 0, 1);
                    else js += print('function () { return ' + methodConstruct.identifierToken.data + '.apply($$this, arguments); }); }});', 0, 1);

                    js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, (!methodConstruct.parameterConstructs.length) ? 0 : 1);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    js += methodConstruct.javaScriptString;

                    js += print('}', 0, 1);

                    return js;
                }
            }

            function translateCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct)
            {
                return 'TODO translateCustomNamespaceJavaScriptInstanceMethod';
            }

            function translateStaticAccessors(construct)
            {
                _inStaticFunction = true;

                var js = '';
                function getMethodConstructJS(methodConstruct, type)
                {
                    if (!methodConstruct) return 'null';

                    upLevel();

                    var js = 'function (';
                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
                    js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, (methodConstruct.isJavaScript) ? 0 : 2);
                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.isNative) throw new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data);
                    if (methodConstruct.isJavaScript) js += methodConstruct.javaScriptString;
                    else if (methodConstruct.UNIMPLEMENTEDToken && release)
                    {
                        js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    }
                    else
                    {
                        js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
                    }
                    js += print('}', (methodConstruct.javaScriptString) ? 0 : _indent, 0);

                    downLevel();

                    return js;
                }

                for (var i = 0; i < construct.staticAccessorConstructs.length; i++)
                {
                    var setterMethodConstruct = construct.staticAccessorConstructs[i].setter;
                    var getterMethodConstruct = construct.staticAccessorConstructs[i].getter;

                    var methodConstruct = setterMethodConstruct || getterMethodConstruct;

                    if (methodConstruct.identifier.namespaceObj.isCustom) throw new Error('custom namespaced accessor not supported at this time');

                    var namespaceObj = methodConstruct.identifier.namespaceObj;

                    js += print('Object.defineProperty(' + construct.identifierToken.data + ', \'' + methodConstruct.identifierToken.data + '\', {', _indent + 1, 0);

                    var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;

                    if (getterMethodConstruct)
                    {
                        js += 'get:';
                        if (methodConstruct.isJavaScript && getTranslatedTypeName(type)) js += 'function () { return $es4.$$coerce((';
                        js += getMethodConstructJS(getterMethodConstruct, type);
                        if (methodConstruct.isJavaScript && getTranslatedTypeName(type)) js += ')(), ' + getTranslatedTypeName(type) + ');}';
                        if (setterMethodConstruct) js += ', ';
                    }

                    if (setterMethodConstruct)
                    {
                        js += 'set:';
                        js += getMethodConstructJS(setterMethodConstruct, type);
                    }

                    js += print('});', 0, 1);
                }

                _inStaticFunction = false;

                return js;
            }

            function translateInstanceAccessors(construct)
            {
                upLevel();
                var js = '';
                function getMethodConstructJS(methodConstruct, type, isPrivate)
                {
                    if (!methodConstruct) return 'null';

                    upLevel();

                    var js = 'function (';
                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.isNative) throw new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data);
                    if (!isPrivate) js += print('var $$this = this;', _indent + 1, 1);
                    else js += print('var $$this = this.$$this;', _indent + 1, 1);
                    if (methodConstruct.isJavaScript) js += methodConstruct.javaScriptString;
                    else if (methodConstruct.UNIMPLEMENTEDToken && release)
                    {
                        js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    }
                    else
                    {
                        js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
                    }
                    js += print('}', (methodConstruct.javaScriptString) ? 0 : _indent, 0);

                    downLevel();

                    return js;
                }

                for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
                {
                    var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
                    var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;

                    var methodConstruct = setterMethodConstruct || getterMethodConstruct;

                    if (methodConstruct.identifier.namespaceObj.isCustom) throw new Error('custom namespaced accessor not supported at this time');

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var isPrivate = methodConstruct.namespaceToken.data == 'private';
                    var hasGet = false;

                    if (isPrivate) js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent + 1, 0);
                    else js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent + 1, 0);

                    var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;

                    if (!getterMethodConstruct && methodConstruct.overrideToken)
                    {
                        hasGet = true;
                        js += 'get:function ()';
                        js += print('{', _indent + 1, 1, 1);
                        js += print('var $$this = this; return $es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', \'' + methodConstruct.identifierToken.data + '\', \'get\');', _indent + 2, 0);
                        js += print('}', _indent + 1, 0, 1);
                    }
                    else if (getterMethodConstruct)
                    {
                        hasGet = true;
                        js += 'get:';
                        if (methodConstruct.isJavaScript && getTranslatedTypeName(type)) js += 'function () { return $es4.$$coerce((';
                        js += getMethodConstructJS(getterMethodConstruct, type, isPrivate);
                        if (methodConstruct.isJavaScript && getTranslatedTypeName(type)) js += ')(), ' + getTranslatedTypeName(type) + ');}';
                    }
                    if (!setterMethodConstruct && methodConstruct.overrideToken)
                    {
                        if (hasGet) js += ', ';
                        js += 'set:function ($$value)';
                        js += print('{', _indent + 1, 1, 1);
                        js += print('var $$this = this; $es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', \'' + methodConstruct.identifierToken.data + '\', \'set\', $$value);', _indent + 2, 0);
                        js += print('}', _indent + 1, 0, 1);
                    }
                    else if (setterMethodConstruct)
                    {
                        if (hasGet) js += ', ';
                        js += 'set:';
                        js += getMethodConstructJS(setterMethodConstruct, type, isPrivate);
                    }

                    if (isPrivate) js += print('};', 0, 1);
                    else js += print('});', 0, 1);
                }

                downLevel();

                return js;
            }

            function translateParameters(methodConstruct, construct)
            {
                var js = '';
                for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
                {
                    var parameterConstruct = methodConstruct.parameterConstructs[i];

                    js += '$$$$' + parameterConstruct.identifierToken.data;
                    if ((i + 1) < methodConstruct.parameterConstructs.length) js += ', ';
                }
                return js;
            }

            function translateDefaultParameterValues(methodConstruct, construct)
            {
                var js = '';
                for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
                {
                    var parameterConstruct = methodConstruct.parameterConstructs[i];
                    if (!js) js += print('//set default parameter values', _indent + 1, 1);

                    if (parameterConstruct.restToken || parameterConstruct.valueExpression)
                    {
                        if (parameterConstruct.restToken) js += print('for (var $$i = ' + (methodConstruct.parameterConstructs.length - 1) + ', $$length = arguments.length, ' + parameterConstruct.identifierToken.data + ' = new Array($$length - ' + (methodConstruct.parameterConstructs.length - 1) + '); $$i < $$length; $$i += 1) ' + parameterConstruct.identifierToken.data + '[$$i - ' + (methodConstruct.parameterConstructs.length - 1) + '] = arguments[$$i];', _indent + 1, 1);
                        else if (parameterConstruct.valueExpression)
                        {
                            var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
                            if (coerceType) js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
                            else js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
                        }
                    }
                    else
                    {
                        var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
                        if (coerceType) js += print('var ' + parameterConstruct.identifierToken.data + ' = $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
                        else js += print('var ' + parameterConstruct.identifierToken.data + ' = $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
                    }
                }
                if (js) js += print('', 0, 1);

                return js;
            }

            function translateStatements(statements, indent, construct)
            {
                if (!indent) indent = _indent;
                else indent--;
                var js = '';
                for (var i = 0; i < statements.length; i++)
                {
                    var statement = statements[i];
                    if (i != 0 && statements[i - 1].constructor != Construct.FunctionExpression && statements[i].constructor == Construct.FunctionExpression) js += '\n';
                    js += translateStatement(statement, indent + 1, false, construct);
                    if (i + 1 < statements.length && statement.constructor == 'FunctionExpression') js += '\n';
                }

                return js;
            }

            function translateStatement(statement, _indent, inline, construct)
            {
                if (!construct) throw new Error('construct null in translate statement');

                var js = '';
                switch (statement.constructor)
                {
                    case Construct.EmptyStatement:
                        break;
                    case Construct.IfStatement:
                        _inIfStatement++;
                        js += print('if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        for (var i = 0; i < statement.elseIfStatements.length; i++) js += translateStatement(statement.elseIfStatements[i], _indent, false, construct);
                        if (statement.elseStatement) js += translateStatement(statement.elseStatement, _indent, false, construct);
                        _inIfStatement--;
                        break;
                    case Construct.ElseIfStatement:
                        _inIfStatement++;
                        js += print('else if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        _inIfStatement--;
                        break;
                    case Construct.ElseStatement:
                        _inIfStatement++;
                        js += print('else', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        _inIfStatement--;
                        break;
                    case Construct.WhileStatement:
                        js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        break;
                    case Construct.DoWhileStatement:
                        js += print('do', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
                        break;
                    case Construct.ForStatement:
                        js += print('for (', _indent, 0);
                        if (statement.variableStatement) js += translateStatement(statement.variableStatement, 0, true, construct);
                        js += ';';
                        if (statement.conditionExpression) js += ' ' + translateExpression(statement.conditionExpression, _indent, false, construct);
                        js += ';';
                        if (statement.afterthoughtExpression) js += ' ' + translateExpression(statement.afterthoughtExpression, _indent, false, construct);
                        js += ')\n';
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        break;
                    case Construct.ForEachStatement:
                        _count++;
                        var object = translateExpression(statement.arrayExpression, _indent, false, construct);
                        var index = '$$i' + _count;

                        if (_dynamicPropertyAccess) js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
                        else js += print('for (var ' + index + ' in ' + object + ')', _indent, 1);
                        js += print('{', _indent, 1);

                        var valueJS = '';
                        if (_dynamicPropertyAccess) valueJS += object + '.$$nextValue(' + index + ')';
                        else valueJS += object + '[' + index + ']';

                        var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
                        if (typeString) js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
                        else js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);

                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        break;
                    case Construct.ForInStatement:
                        _count++;
                        var object = translateExpression(statement.objectExpression, _indent, false, construct);
                        var index = '$$i' + _count;

                        if (_dynamicPropertyAccess)
                        {
                            js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);

                        }
                        else js += print('for (' + translateStatement(statement.variableStatement, 0, true, construct) + ' in ' + translateExpression(statement.objectExpression, _indent, false, construct) + ')', _indent, 1);
                        js += print('{', _indent, 1);

                        if (_dynamicPropertyAccess)
                        {
                            valueJS = object + '.$$nextName(' + index + ')';

                            var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
                            if (typeString) js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
                            else js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
                        }

                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        break;
                    case Construct.BreakStatement:
                        js += print('break', _indent, 0);
                        if (statement.identifierToken) js += ' ' + statement.identifierToken.data;
                        js += ';\n';
                        break
                    case Construct.ContinueStatement:
                        js += print('continue', _indent, 0);
                        if (statement.identifierToken) js += ' ' + statement.identifierToken.data;
                        js += ';\n';
                        break;
                    case Construct.ThrowStatement:
                        js += print('throw', _indent, 0);
                        if (statement.expression) js += ' ' + translateExpression(statement.expression, _indent, false, construct);
                        js += ';\n';
                        break;
                    case Construct.TryStatement:
                        js += print('try', _indent, 1);
                        js += print('{', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        js += print('}', _indent, 1);
                        if (statement.catchStatements.length == 1) js += print('catch (' + statement.catchStatements[0].identifierToken.data + ')', _indent, 1);
                        else js += print('catch ($$error)', _indent, 1);
                        js += print('{', _indent, 1);

                        for (var i = 0; i < statement.catchStatements.length; i++)
                        {
                            upLevel();

                            var catchStatement = statement.catchStatements[i];

                            var typeName = catchStatement.identifier.type.name;
                            if (i == 0 && statement.catchStatements.length == 1)
                            {
                                if (typeName == 'void' || typeName == 'Error') js += translateStatements(catchStatement.bodyStatements, _indent + 1, construct);
                                else
                                {
                                    js += print('if ($es4.$$is(' + catchStatement.identifierToken.data + ', ' + typeName + '))', _indent + 1, 1);
                                    js += print('{', _indent + 1, 1);
                                    js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
                                    js += print('}', _indent + 1, 1);
                                }

                                downLevel();
                                break;
                            }

                            if (typeName == 'void' || typeName == 'Error')
                            {
                                js += print('else', _indent + 1, 1);
                                js += print('{', _indent + 1, 1);

                                js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
                                js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);

                                js += print('}', _indent + 1, 1);

                                downLevel();
                                break;
                            }


                            js += print(((i == 0) ? 'if' : 'else if') + ' ($es4.$$is($$error, ' + typeName + '))', _indent + 1, 1);
                            js += print('{', _indent + 1, 1);

                            js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
                            js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);

                            js += print('}', _indent + 1, 1);

                            downLevel();
                        }

                        js += print('}', _indent, 1);

                        if (statement.finallyStatement)
                        {
                            js += print('finally', _indent, 1);
                            js += print('{', _indent, 1);
                            js += translateStatements(statement.finallyStatement.bodyStatements, _indent + 1, construct);
                            js += print('}', _indent, 1);
                        }
                        break;
                    case Construct.UseStatement:
                        break;
                    case Construct.VarStatement:
                        var translateVarValueExpression = function (statement)
                        {
                            var valueJS = translateExpression(statement.valueExpression, _indent, false, construct);
                            var typeString = getTranslatedTypeName(statement.identifier.type);
                            if (isCoerceRequired(statement, typeString, valueJS)) valueJS = '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';

                            return ' = ' + valueJS;
                        }

                        js += print('var ' + statement.identifierToken.data, _indent, 0);

                        if (statement.valueExpression) js += translateVarValueExpression(statement);

                        for (var i = 0; i < statement.innerVarStatements.length; i++)
                        {
                            var innerVarStatement = statement.innerVarStatements[i];

                            js += ', ' + innerVarStatement.identifierToken.data;
                            if (innerVarStatement.valueExpression) js += translateVarValueExpression(innerVarStatement);
                        }

                        if (!inline) js += ';\n';
                        break;
                    case Construct.SwitchStatement:
                        js += print('switch (' + translateExpression(statement.valueExpression, _indent, false, construct) + ')', _indent, 1);
                        js += print('{', _indent, 1);
                        for (var i = 0; i < statement.caseStatements.length; i++) js += translateStatement(statement.caseStatements[i], _indent + 1, false, construct);
                        js += print('}', _indent, 1);
                        break;
                    case Construct.CaseStatement:
                        if (statement.defaultToken) js += print('default:', _indent, 1);
                        else js += print('case ' + translateExpression(statement.valueExpression, _indent, false, construct) + ':', _indent, 1);
                        js += translateStatements(statement.bodyStatements, _indent + 1, construct);
                        break;
                    case Construct.LabelStatement:
                        js += print(statement.identifierToken.data + ':', _indent, 0);
                        break;
                    default:
                        if (inline) js += print(translateExpression(statement, _indent, false, construct), _indent, 0);
                        else js += print(translateExpression(statement, _indent, false, construct) + ';', _indent, 1);
                }

                return js;
            }

            function translateExpression(expression, _indent, toString, construct, operator=null, expressionString=null)
            {
                if (!construct) throw new Error('construct null in translate expression');
                if (!_indent) _indent = 0;

                var js = '';
                outerSwitch: switch (expression.constructor)
                {
                    case Construct.ParenExpression:
                        js += '(' + translateExpression(expression.expression, _indent, toString, construct, operator, expressionString) + ')';
                        break;
                    case Construct.PropertyExpression:
                        js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
                        break;
                    case Construct.NumberExpression:
                        js += expression.numberToken.data;
                        break;
                    case Construct.StringExpression:
                        if (toString && expression.stringToken.data == "'") js += '\\' + expression.stringToken.data;
                        else js += expression.stringToken.data;
                        for (var i = 0; i < expression.stringChunkTokens.length; i++)
                        {
                            js += expression.stringChunkTokens[i].data;
                            if (i + 1 < expression.stringChunkTokens.length) js += '\n';
                        }
                        if (toString && expression.stringToken.data == "'") js += '\\' + expression.stringToken.data;
                        else js += expression.stringToken.data;
                        break;
                    case Construct.ReturnExpression:
                        js += 'return';
                        if (expression.expression)
                        {
                            var typeName = getTranslatedTypeName(expression.expectedType);
                            var valueJS = translateExpression(expression.expression, 0, toString, construct);
                            if (typeName && isCoerceRequired(expression, typeName, valueJS)) js += ' $es4.$$coerce(' + valueJS + ', ' + typeName + ')';
                            else js += ' ' + valueJS;
                        }

                        break;
                    case Construct.DeleteExpression:
                        js += translatePropertyExpressionDynamic(expression.expression, toString, undefined, undefined, construct, true);
                        break;
                    case Construct.FunctionExpression:
                        upLevel();

                        //IN CLOSURE
                        var wasInClosure = _inClosure;
                        _inClosure = true;

                        if (!expression.identifierToken) js += print('function (', 0, 0);
                        else
                        {
                            if (_inIfStatement) throw new Error('support for named closures in if/elseif/else statements is not supported at this time.');

                            js += print('function ' + expression.identifierToken.data + '(', 0, 0);
                        }

                        js += translateParameters(expression, construct);
                        js += print(') ', 0, 1);
                        js += print('{', _indent, 1);
                        js += translateDefaultParameterValues(expression, construct);

                        js += translateStatements(expression.bodyStatements, _indent + 1, construct);

                        js += print('}', _indent, 1);

                        //OUT CLOSURE
                        if (!wasInClosure) _inClosure = false;

                        downLevel();
                        break;
                    case Construct.ObjectExpression:
                        js += '{';
                        for (var i = 0; i < expression.objectPropertyConstructs.length; i++)
                        {
                            var prop;
                            if (expression.objectPropertyConstructs[i].expression.constructor == Construct.PropertyExpression) prop = expression.objectPropertyConstructs[i].expression.construct.identifierToken.data;
                            else prop = translateExpression(expression.objectPropertyConstructs[i].expression, 0, toString, construct);
                            js += prop + ':' + translateExpression(expression.objectPropertyConstructs[i].valueExpression, 0, toString, construct);
                            if ((i + 1) < expression.objectPropertyConstructs.length) js += ', ';
                        }
                        js += '}';
                        break;
                    case Construct.ArrayExpression:
                        js += '[';
                        for (var i = 0; i < expression.valueExpressions.length; i++)
                        {
                            if (!expression.valueExpressions[i]) trace('invalid 20');
                            js += translateExpression(expression.valueExpressions[i], 0, toString, construct);
                            if ((i + 1) < expression.valueExpressions.length) js += ', ';
                        }
                        js += ']';
                        break;
                    case Construct.BooleanExpression:
                        js += expression.booleanToken.data;
                        break;
                    case Construct.Expression:
                        if (expression.token.type == Token.TypeofTokenType)
                        {
                            if (!expression.expression) trace('invalid 21');
                            js += '$es4.$$typeof(' + translateExpression(expression.expression, 0, toString, construct) + ')';
                            break;
                        }
                        if (expression.token.type == Token.VoidTokenType)
                        {
                            if (expression.expression.constructor == Construct.EmptyExpression) js += 'void 0';
                            else
                            {
                                if (!expression.expression) trace('invalid 01');
                                js += 'void ' + translateExpression(expression.expression, 0, toString, construct);
                            }

                            break;
                        }
                        js += expression.token.data;
                        if (expression.expression)
                        {
                            if (!expression.expression) trace('invalid 22');
                            js += translateExpression(expression.expression, 0, toString, construct);
                        }
                        break;
                    case Construct.XMLExpression:
                        js += 'new XML(\'' + expression.string + '\')';
                        break
                    case Construct.XMLListExpression:
                        js += 'new XMLList(\'' + expression.string + '\')';
                        break
                    case Construct.EmptyExpression:
                        break;
                    case Construct.RegExpression:
                        js += expression.string;
                        break;
                    case Construct.PrefixExpression:
                        js += translatePropertyExpressionDynamic(expression.expression, toString, '\'prefix\'', (expression.decrementToken) ? '--' : '++', construct);
                        break;
                    case Construct.PostfixExpression:
                        js += translatePropertyExpressionDynamic(expression.expression, toString, '\'postfix\'', (expression.decrementToken) ? '--' : '++', construct);
                        break;
                    case Construct.NewExpression:
                        if (expression.expression.constructor == Construct.ParenExpression)
                        {
                            if (!expression.expression) trace('invalid 02');
                            js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
                        }
                        else js += translatePropertyExpressionDynamic(expression.expression, toString, null, null, construct, null, true);
                        break;
                    case Construct.BinaryExpression:
                        if (expression.token.type == Token.IsTokenType)
                        {
                            if (!expression.leftExpression) trace('invalid 04');
                            if (!expression.rightExpression) trace('invalid 05');
                            js += '$es4.$$is(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
                            break;
                        }
                        if (expression.token.type == Token.InstanceofTokenType)
                        {
                            if (!expression.leftExpression) trace('invalid 06');
                            if (!expression.rightExpression) trace('invalid 07');
                            js += '$es4.$$instanceof(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
                            break;
                        }
                        if (expression.token.type == Token.AsTokenType)
                        {
                            if (!expression.leftExpression) trace('invalid 08');
                            if (!expression.rightExpression) trace('invalid 09');
                            js += '$es4.$$as(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
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
                                var innerExpressionString = '';
                                while (leftExpression.constructor == Construct.BinaryExpression)
                                {
                                    expression.leftExpression = leftExpression.rightExpression;

                                    if (!innerExpressionString)
                                    {
                                        if (!expression) trace('invalid 10');
                                        innerExpressionString = translateExpression(expression, _indent, toString, construct);
                                    }
                                    else
                                    {
                                        if (!expression.leftExpression) trace('invalid 11');

                                        if (_dynamicPropertyAccess) innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct, innerOperator, innerExpressionString);
                                        else innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct) + ' ' + innerOperator + ' ' + innerExpressionString;
                                    }

                                    expression = leftExpression;
                                    innerOperator = expression.token.data;
                                    leftExpression = expression.leftExpression;
                                }

                                var typeString;
                                if (!leftExpression.nextPropertyExpression && leftExpression.construct && leftExpression.construct.constructor == Construct.IdentifierConstruct)
                                {
                                    var identifier = leftExpression.construct.identifier;
                                    typeString = (identifier.isVar && identifier.type) ? getTranslatedTypeName(identifier.type) : '';
                                }

                                if (true) //if (_dynamicPropertyAccess)
                                {
                                    if (!innerExpressionString)
                                    {
                                        if (!expression.rightExpression) trace('invalid 12');
                                        innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
                                    }

                                    if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
                                    {
                                        js += translatePropertyExpressionDynamic(leftExpression, toString, '$es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')', innerOperator, construct);
                                    }
                                    else
                                    {
                                        js += translatePropertyExpressionDynamic(leftExpression, toString, innerExpressionString, innerOperator, construct);
                                    }
                                }
                                else
                                {
                                    if (!expression.leftExpression) trace('invalid 13');
                                    js += translateExpression(leftExpression, 0, toString, construct);
                                    if (!innerExpressionString)
                                    {
                                        if (!expression.rightExpression) trace('invalid 14');
                                        innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
                                    }

                                    if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
                                    {
                                        js += ' ' + innerOperator + ' $es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')';
                                    }
                                    else
                                    {
                                        js += ' ' + innerOperator + ' ' + innerExpressionString;
                                    }

                                }

                                break outerSwitch;
                        }

                        if (!expression.leftExpression) trace('invalid 15');
                        if (!expression.rightExpression) trace('invalid 16');
                        js += translateExpression(expression.leftExpression, 0, toString, construct) + ' ' + expression.token.data + ' ' + translateExpression(expression.rightExpression, 0, toString, construct);
                        break;
                    case Construct.TernaryExpression:
                        if (!expression.trueExpression) trace('invalid 34');
                        if (!expression.conditionExpression) trace('invalid 35');
                        if (!expression.falseExpression) trace('invalid 36');
                        js += translateExpression(expression.conditionExpression, 0, toString, construct) + ' ? ' + translateExpression(expression.trueExpression, 0, toString, construct) + ' : ' + translateExpression(expression.falseExpression, 0, toString, construct);
                        break;
                    default:
                        throw new Error('Unexpected expression found: ' + expression.constructor);
                }

                return js;
            }

            function translatePropertyExpressionDynamic(expression, toString, setString, operator, construct, doDelete=null, doNew=null)
            {
                var js = '';

                if (!expression.construct) throw new Error('invalid expression passed to translatePropertyExpression: ' + expression.constructor);

                var identifier;
                var namespaceIdentifier;
                switch (expression.construct.constructor)
                {
                    case Construct.SuperConstruct:
                    case Construct.ThisConstruct:
                    case Construct.IdentifierConstruct:
                        identifier = expression.construct.identifier;
                        break;
                    case Construct.ParenConstruct:
                    case Construct.ArrayConstruct:
                    case Construct.ObjectConstruct:
                        break;
                    case Construct.NamespaceQualifierConstruct:
                        namespaceIdentifier = expression.construct.namespaceIdentifier;
                        identifier = expression.construct.identifier;
                        break;
                    default:
                        throw new Error('unknown inner property expression: ' + expression.construct.constructor);
                }

                var pname;
                var name;

                if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom) namespaceIdentifier = identifier.namespaceObj.identifier;

                if (identifier && namespaceIdentifier)
                {
                    var pname = (namespaceIdentifier.isStatic) ? namespaceIdentifier.scope.name : '$$this';
                    var namespaceObj = namespaceIdentifier.namespaceObj;
                    var namespaceString = namespaceObj.normalizedImportID;
                    if (namespaceIdentifier.isStatic && !namespaceString) namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
                    else if (!namespaceString) namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') : '$$this.') + namespaceIdentifier.name;

                    pname += '.$$namespace(' + namespaceString + ')';
                    name = identifier.name;
                }
                else if (identifier)
                {
                    name = identifier.name;

                    //we need to manually add the correct scope for identifiers that do not already specify one ie.. myProperty vs this.myProperty
                    if (identifier.isStatic && !identifier.isImport && !identifier.isNative) pname = identifier.scope.name;
                    else if (identifier.isPrivate && !identifier.isImport) pname = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('');
                    else if ((identifier.isProperty || identifier.isMethod) && !identifier.isImport) pname = '$$this';
                    else if (identifier.isPackage)
                    {
                        name = '$es4.$$[\'' + identifier.name;
                        var packageName = identifier.name;
                        var tempInnerExpression = expression;
                        var lastExpression = tempInnerExpression;
                        while (tempInnerExpression = tempInnerExpression.nextPropertyExpression)
                        {
                            if (_rootConstructs[packageName + '.' + tempInnerExpression.construct.identifierToken.data])
                            {
                                expression = lastExpression;
                                break;
                            }

                            packageName += '.' + tempInnerExpression.construct.identifierToken.data;
                            name += '.' + tempInnerExpression.construct.identifierToken.data;

                            lastExpression = tempInnerExpression;
                        }

                        name += '\']';
                    }

                    //change super to '$es4.$$super($$thisp)' or 'this', 'this' if a property is not being accessed or it's not being called as a function
                    var superString = (construct.extendsNameConstruct) ? '$es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + construct.extendsNameConstruct.type.name + '\', ***REPLACE1***, \'***REPLACE2***\', ***REPLACE3***)' : '____________________';
                    if (name == 'super')
                    {
                        if (_inNamespacedFunction && expression.nextPropertyExpression) name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
                        else name = (expression.nextPropertyExpression) ? superString : 'this';
                    }

                    if (name == 'this' && !_inClosure)
                    {
                        if (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.DotConstruct && expression.nextPropertyExpression.construct.identifier.isPrivate) name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('');
                        else name = '$$this';
                    }
                }
                else
                {
                    if (!expression.construct.expression) trace('invalid 37');
                    name = translateExpression(expression.construct.expression, 0, toString, construct);
                }
                js += (!pname) ? name : (pname + '.' + name);

                var state = {doAssignment:setString != null,
                    doDelete:doDelete,
                    doNew:doNew,
                    doPostfix:setString == '\'postfix\'',
                    doPrefix:setString == '\'prefix\''};

                var doSuper = name == superString;
                var doSuperConstructor = doSuper && (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct);
                var superExpression;

                while (expression = expression.nextPropertyExpression)
                {
                    if (expression.construct.constructor == Construct.DotConstruct || expression.construct.constructor == Construct.IdentifierConstruct)
                    {
                        //if (expression.construct.constructor == IdentifierConstruct) identifierConstructEncountered = true;

                        if (doSuper && !superExpression) superExpression = '\'' + expression.construct.identifierToken.data + '\'';
                        else
                        {
                            if (expression.construct.constructor == Construct.DotConstruct) js += '.';

                            js += expression.construct.identifierToken.data;
                        }
                    }
                    else if (expression.construct.constructor == Construct.ArrayAccessorConstruct)
                    {
                        if (!expression.construct.expression) trace('invalid 38');

                        if (doSuper && !superExpression) superExpression = translateExpression(expression.construct.expression, 0, toString, construct);
                        else js += '[' + translateExpression(expression.construct.expression, 0, toString, construct) + ']';
                    }
                    else if (expression.construct.constructor == Construct.NamespaceQualifierConstruct)
                    {
                        namespaceIdentifier = expression.construct.namespaceIdentifier;

                        var namespaceObj = namespaceIdentifier.namespaceObj;
                        var namespaceString = namespaceObj.normalizedImportID;

                        if (namespaceIdentifier.isStatic && !namespaceString) namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
                        else if (!namespaceString) namespaceString = (identifier.isPrivate) ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;


                        js += '.$$namespace(' + namespaceString + ').' + expression.construct.namespaceIdentifierToken.data;
                    }
                    else if (expression.construct.constructor == Construct.ParenConstruct)
                    {
                        if (!expression.construct.expression) trace('invalid 39');
                        js += '(' + translateExpression(expression.construct.expression, 0, toString, construct) + ')';
                    }
                    else if (expression.construct.constructor == Construct.AtIdentifierConstruct) throw new Error('E4X is not supported');

                    if (expression.construct.constructor == Construct.FunctionCallConstruct || (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
                    {
                        var functionCallExpression = (expression.construct.constructor == Construct.FunctionCallConstruct) ? expression : expression.nextPropertyExpression;

                        if (doSuperConstructor)
                        {
                            js = getTranslatedTypeName(construct.extendsNameConstruct.type) + '.$$constructor.call($$this';
                            if (functionCallExpression.construct.argumentExpressions.length) js += ', ';
                            doSuperConstructor = false;
                        }
                        else js += '(';

                        for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
                        {
                            if (!functionCallExpression.construct.argumentExpressions[i]) trace('invalid 40');
                            js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
                            if ((i + 1) < functionCallExpression.construct.argumentExpressions.length) js += ', ';
                        }
                        js += ')';

                        if (expression.nextPropertyExpression) expression = functionCallExpression;
                        continue;
                    }
                }

                if (doSuper && superExpression)
                {
                    js = js.split('***REPLACE1***').join(superExpression);
                    if (setString)
                    {
                        js = js.split('***REPLACE2***').join('set');
                        js = js.split('***REPLACE3***').join(setString);
                        state.doAssignment = false;
                    }
                    else
                    {
                        js = js.split('***REPLACE2***').join('func');
                        js = js.split('***REPLACE3***').join('undefined');
                    }
                }

                if (!state.doPostfix && !state.doPrefix)
                {
                    if (state.doAssignment && operator == '||=' || operator == '&&=') js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
                    else if (state.doAssignment) js += ' ' + operator + ' ' + setString;
                }
                else if (state.doPrefix) js = operator + js;
                else if (state.doPostfix) js += operator;

                if (state.doDelete) js = 'delete ' + js;
                if (state.doNew) js = '$es4.$$primitive(new ' + js + ')';

                return js;
            }

            /*
            function translatePropertyExpressionDynamic2(expression, toString, setString, operator, construct, doDelete, doNew)
            {
                var js = '';

                if (expression.constructor == Construct.DeleteExpression) return translatePropertyExpressionDynamic(expression.expression, toString, setString, operator, construct, true, doNew);
                if (expression.constructor == Construct.NewExpression) return translatePropertyExpressionDynamic(expression.expression, toString, setString, operator, construct, doDelete, true);
                if (!expression.construct) throw new Error('invalid expression passed to translatePropertyExpression: ' + expression.constructor);

                var identifier;
                var namespaceIdentifier;
                switch (expression.construct.constructor)
                {
                    case Construct.SuperConstruct:
                    case Construct.ThisConstruct:
                    case Construct.IdentifierConstruct:
                        identifier = expression.construct.identifier;
                        break;
                    case Construct.ParenConstruct:
                    case Construct.ArrayConstruct:
                    case Construct.ObjectConstruct:
                        break;
                    case Construct.NamespaceQualifierConstruct:
                        namespaceIdentifier = expression.construct.namespaceIdentifier;
                        identifier = expression.construct.identifier;
                        break;
                    default:
                        throw new Error('unknown inner property expression: ' + expression.construct.constructor);
                }

                var pname;
                var name;

                var isUseNamespace = false;
                if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom) isUseNamespace = namespaceIdentifier = identifier.namespaceObj.identifier;
                if (identifier && namespaceIdentifier)
                {
                    var pname = (namespaceIdentifier.isStatic) ? namespaceIdentifier.scope.name : '$$this';
                    var namespaceObj = namespaceIdentifier.namespaceObj;
                    var namespaceString = namespaceObj.normalizedImportID;
                    if (namespaceIdentifier.isStatic && !namespaceString) namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
                    else if (!namespaceString) namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? '$$thisp.' : '$$this.') + namespaceIdentifier.name;

                    if (isUseNamespace) pname += '.$$namespace(' + namespaceString + ')';
                    name = identifier.name;
                }
                else if (identifier)
                {
                    name = identifier.name;

                    //we need to manually add the correct scope for identifiers that do not already specify one ie.. myProperty vs this.myProperty
                    if (identifier.isStatic && !identifier.isImport && !identifier.isNative) pname = identifier.scope.name;
                    else if (identifier.isPrivate && !identifier.isImport) pname = '$$thisp';
                    else if ((identifier.isProperty || identifier.isMethod) && !identifier.isImport) pname = '$$this';
                    else if (identifier.isPackage)
                    {
                        name = '$es4.$$[\'' + identifier.name;
                        var packageName = identifier.name;
                        var tempInnerExpression = expression;
                        var lastExpression = tempInnerExpression;
                        while (tempInnerExpression = tempInnerExpression.nextPropertyExpression)
                        {
                            if (_rootConstructs[packageName + '.' + tempInnerExpression.construct.identifierToken.data])
                            {
                                expression = lastExpression;
                                break;
                            }

                            packageName += '.' + tempInnerExpression.construct.identifierToken.data;
                            name += '.' + tempInnerExpression.construct.identifierToken.data;

                            lastExpression = tempInnerExpression;
                        }

                        name += '\']';
                    }

                    //change super to '$es4.$$super($$thisp)' or 'this', 'this' if a property is not being accessed or it's not being called as a function
                    if (name == 'super')
                    {
                        if (_inNamespacedFunction && expression.nextPropertyExpression) name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
                        else name = (expression.nextPropertyExpression) ? '$es4.$$super($$thisp)' : 'this';
                    }
                    if (name == 'this' && !_inClosure) name = '$$this';
                }
                else name = translateExpression(expression.construct.expression, 0, toString, construct); //example: {}.p = 4;

                var state = {doAssignment:setString != null,
                    doDelete:doDelete,
                    doNew:doNew,
                    doPostfix:setString == '\'postfix\'',
                    doPrefix:setString == '\'prefix\''};

                var propListCount = (pname) ? 2 : 1;
                var accessString = '$es4.$$get';

                if (pname)
                {
                    if (_inStaticFunction) js += accessString + '(' + pname + ', null, null';
                    else js += accessString + '(' + pname + ', $$this, $$thisp';
                }
                else
                {
                    expression = expression.nextPropertyExpression; //name was taken from the current expression, so move to the next one
                    js += name;
                }

                var lastAccessTypeWasArrayAccessor = false;
                var closed = false;
                while (expression)
                {
                    var expressionConstruct = expression.construct;
                    var expressionConstructor = expressionConstruct.constructor;

                    if (expressionConstructor == Construct.DotConstruct || expressionConstructor == Construct.IdentifierConstruct || expressionConstructor == Construct.ArrayAccessorConstruct || expressionConstructor == Construct.NamespaceQualifierConstruct || expression.construct.constructor == Construct.AtIdentifierConstruct)
                    {
                        propListCount++;

                        if (!pname || closed)
                        {
                            if (_inStaticFunction) js = accessString + '(' + js + ', null, null';
                            else js = accessString + '(' + js + ', $$this, $$thisp';

                            closed = false;
                            pname = js;
                        }
                    }

                    if (expressionConstructor == Construct.DotConstruct || expressionConstructor == Construct.IdentifierConstruct)
                    {
                        js += ', \'' + expressionConstruct.identifierToken.data + '\'';
                        lastAccessTypeWasArrayAccessor = false;
                    }
                    else if (expressionConstructor == Construct.ArrayAccessorConstruct)
                    {
                        js += ', ' + translateExpression(expression.construct.expression, 0, toString, construct);
                        lastAccessTypeWasArrayAccessor = true;
                    }
                    else if (expressionConstructor == Construct.NamespaceQualifierConstruct)
                    {
                        namespaceIdentifier = expression.construct.namespaceIdentifier;

                        var namespaceObj;
                        var namespaceString;
                        if (namespaceIdentifier.isNamespace) namespaceObj = namespaceIdentifier.isNamespace;
                        else namespaceObj = namespaceIdentifier.namespaceObj;

                        namespaceString = namespaceObj.normalizedImportID;

                        if (namespaceIdentifier.isStatic && !namespaceString) namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
                        else if (!namespaceString) namespaceString = (identifier.isPrivate) ? '$$thisp.' + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;

                        if (_inStaticFunction) js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), null, null, \'' + expressionConstruct.namespaceIdentifierToken.data + '\'';
                        else js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), $$this, $$thisp, \'' + expressionConstruct.namespaceIdentifierToken.data + '\'';
                        propListCount = 2;
                    }
                    else if (expression.construct.constructor == Construct.ParenConstruct) throw new Error('check translator.js for this error.'); //js += '(' + translateExpression(expression.construct.expression, 0, toString, construct) + ')';
                    else if (expression.construct.constructor == Construct.AtIdentifierConstruct)
                    {
                        js += ', \'$$attributes\'';
                        lastAccessTypeWasArrayAccessor = false;
                    }

                    if (expression.construct.constructor == Construct.FunctionCallConstruct || (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
                    {
                        var functionCallExpression = (expression.construct.constructor == Construct.FunctionCallConstruct) ? expression : expression.nextPropertyExpression;

                        if (js == '$es4.$$super($$thisp)') js += '.$$z';

                        var start = null;
                        if (propListCount == 1)
                        {
                            if (state.doNew) js = '$es4.$$primitive(new ' + js + ')';
                            js += '(';
                        }
                        else
                        {
                            if (state.doNew)
                            {
                                js = '$es4.$$primitive(new ' + js + ')';
                                js += ')(';
                            }
                            else
                            {
                                if (!lastAccessTypeWasArrayAccessor)
                                {
                                    start = js.substring(4);
                                    js = '$es4.$$call' + start;
                                    if (functionCallExpression.construct.argumentExpressions.length) js += ', [';
                                }
                                else js += ')(';
                            }
                            closed = true;
                            propListCount = 2;
                        }

                        state.doNew = false;

                        for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
                        {
                            js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
                            if ((i + 1) < functionCallExpression.construct.argumentExpressions.length) js += ', ';
                        }

                        if (start && functionCallExpression.construct.argumentExpressions.length) js += '])';
                        else if (start) js += ', $es4.$$EMPTY_ARRAY)';
                        else js += ')';

                        if (expression.nextPropertyExpression) expression = functionCallExpression;
                    }

                    expression = expression.nextPropertyExpression;
                }

                if (!pname)
                {
                    if (!state.doPostfix && !state.doPrefix)
                    {
                        if (state.doAssignment && operator == '||=' || operator == '&&=') js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
                        else if (state.doAssignment) js += ' ' + operator + ' ' + setString;
                    }
                    else if (state.doPrefix) js = operator + js;
                    else if (state.doPostfix) js += operator;

                    if (state.doDelete) js = 'delete ' + js;
                    if (state.doNew) js = '$es4.$$primitive(new ' + js + ')';
                }
                else
                {
                    if (state.doAssignment)
                    {
                        js = '$es4.$$set' + js.slice(4);
                        js += ', ' + setString + ', \'' + operator + '\'';
                    }
                    else if (state.doDelete) js = '$es4.$$delete' + js.slice(4);
                    if (!closed) js += ')';
                }

                return js;
            }
            */
            function isCoerceRequired(statementOrExpression, typeName, valueJS)
            {
                if (!statementOrExpression.coerce) return false;

                switch (typeName)
                {
                    case 'uint':
                        if (Number(valueJS) == (valueJS >>> 0)) return false;
                        break;
                    case 'int':
                        if (Number(valueJS) == (valueJS >> 0)) return false;
                        break;
                }

                return true;
            }

            function print(string, tabs, newlines, preNewLines=null)
            {
                if (tabs) for (var i = 0; i < tabs; i++) string = '\t' + string;
                if (newlines) for (var i = 0; i < newlines; i++) string += '\n';
                if (preNewLines) for (var i = 0; i < preNewLines; i++) string = '\n' + string;
                return string;
            }
        }
    }
}
