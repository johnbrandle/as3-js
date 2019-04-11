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

    public class TranslatorProto
    {
        public static function translate(rootConstruct, rootConstructs, dynamicPropertyAccess, release, fastPropertyAccess:Boolean=false)
        {
            var _rootConstruct = rootConstruct;
            var _rootConstructs = rootConstructs;
            var _indent = -1;
            var _count = -1; //for for each loops
            var _level = 0; //for identifier, namespace, and type scope


            var _fastPropertyAccess = fastPropertyAccess = false; //does not appear to have a significant performance impact (20ms max), so not using for now considering the tradeoff in compatiblity
            var _dynamicPropertyAccess = dynamicPropertyAccess;

            var _inClosure = false;
            var _inNamespacedFunction = false;
            var _inStaticFunction = false;
            var _inIfStatement = 0;

            var _importNameConflicts = {};

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
                        js += print('function ' + construct.identifierToken.data + '() { $$' + name + '(\'' + construct.identifierToken.data + '\', ' + '$es4.$$package(\'' + (construct.packageConstruct.nameConstruct ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '') + '\'), (function ()', _indent, 1);
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

                var innerJS;
                var cr = false;
                js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
                js += print('{', _indent, 1);
                js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
                js += (innerJS = translateNamespaces(construct, true)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
                js += (innerJS = translateStaticProperties(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
                js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
                js += (innerJS = translateStaticMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateStaticAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInternalClasses(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInternalInterfaces(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateClassReturnStatement(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += print('})();', _indent, 1);

                downLevel();

                return js;
            }

            function translateClassInitializer(construct)
            {
                _inStaticFunction = true;
                var js = print('//class initializer', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 2);

                //initialize import aliases
                var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
                if (importConstructs.length) js += print('//initialize imports', _indent + 2, 1);
                var found = false;

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

                    js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
                }

                //initialize statics
                var found = false;
                for (var i = 0; i < construct.propertyConstructs.length; i++)
                {
                    var propertyConstruct = construct.propertyConstructs[i];
                    if (!propertyConstruct.staticToken) continue;
                    if (!propertyConstruct.valueExpression) continue;
                    if (propertyConstruct.translatedEarlier) continue; //todo, add this property to propertyConstruct definition. we are currently using this for primitive static constants

                    if (!found)
                    {
                        found = true;
                        js += print('//initialize properties', _indent + 2, 1, (importConstructs.length) ? 1 : 0);
                    }

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var namespaceString;
                    if (namespaceObj.importID) namespaceString = namespaceObj.importID;
                    else namespaceString = (construct.identifierToken.data + '.' + namespaceObj.name);
                    if (namespaceObj.isCustom)
                    {
                        js += print('$es4.$$namespace(' + namespaceString + ', ' + construct.identifierToken.data + ').' + propertyConstruct.identifierToken.data, _indent + 2, 0);
                        js += ' = ' + translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                        js += print(';', 0, 1);
                    }
                    else
                    {
                        if (propertyConstruct.isNative) js += print(propertyConstruct.identifierToken.data, _indent + 2, 0);
                        else js += print(construct.identifierToken.data + '.' + propertyConstruct.identifierToken.data, _indent + 2, 0);

                        var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                        var typeString = getTranslatedTypeName(propertyConstruct.identifier.type);

                        if (propertyConstruct.isNative && propertyConstruct.coerce && isCoerceRequired(propertyConstruct, typeString, valueJS)) js += ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ')';
                        else js += ' = ' + valueJS;
                        js += print(';', 0, 1);
                    }
                }

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
                js += print('//initialize class if not initialized', _indent + 1, 1);
                js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                //save scope
                js += print('//save scope', _indent + 1, 1);
                js += print('var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;', _indent + 1, 1);
                js += print('var $$thisp = this;', _indent + 1, 2);

                //deal with casting
                js += print('//handle possible cast', _indent + 1, 1);
                js += print('if ($$this === $$thisp && (!($$this instanceof ' + construct.identifierToken.data + ') || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + construct.identifierToken.data + ') : $es4.$$throwArgumentError();', _indent + 1, 1);
                js += print('Object.defineProperty($$this, \'$$t\', {value:1});', _indent + 1, 1);

                var innerJS;

                js += (innerJS = translateNamespaces(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInstanceProperties(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInitializer(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateConstructor(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInstanceMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
                js += (innerJS = translateInstanceAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';

                js += print('//call construct if no arguments, or argument zero does not equal manual construct', _indent + 1, 1, 1);
                js += print('if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)', _indent + 1, 1);
                js += print('{', _indent + 1, 1);
                js += print('for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];', _indent + 2, 2);
                js += print('$es4.$$construct($$this, $$args);', _indent + 2, 1);
                js += print('}', _indent + 1, 1);

                js += print('}', _indent, 1);

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
                            if (namespaceObj.isPrivate) js += print('$$thisp.' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
                            else js += print('$$this.' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
                            js += translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
                            js += print(';', 0, 1);
                        }
                    }
                }

                js += print('}));', _indent, 1);

                downLevel();

                return (found) ? js : '';
            }

            function translateConstructor(construct)
            {
                var js = '';

                upLevel();

                var methodConstruct = construct.constructorMethodConstruct;

                js += print('//constructor', _indent, 1);
                js += print('$es4.$$constructor($$thisp, (function (', _indent, 0);
                if (methodConstruct) js += translateParameters(methodConstruct, construct);
                js += print(')', 0, 1);
                js += print('{', _indent, 1);
                if (methodConstruct) js += translateDefaultParameterValues(methodConstruct, construct);

                //deal with super if we are extending a class
                var carriage = false;
                if (construct.extendsNameConstruct && (!methodConstruct || (methodConstruct && !methodConstruct.callsSuper)))
                {
                    js += print('$es4.$$super($$thisp).$$z();', _indent + 1, 1);
                    carriage = true;
                }

                //body statements
                if (methodConstruct)
                {
                    var innerJS = print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
                    if (innerJS && carriage) js += print('', 0, 1);
                    if (innerJS) js += innerJS;
                }

                js += print('})', _indent, 0);
                js += print(');', 0, 1);

                downLevel();

                return js;
            }

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

            function translateNamespaces(construct, isClassLevel=false)
            {
                var js = '';
                var propertyConstructs = construct.namespacePropertyConstructs;
                var counter = 0;
                for (var i = 0; i < propertyConstructs.length; i++)
                {
                    var propertyConstruct = propertyConstructs[i];

                    if (!js) js += print('//namespaces', _indent + 1, 1);
                    js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_namespace(' + (propertyConstruct.valueExpression ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + construct.identifierToken.data + '\'') + ', ' + ((isClassLevel) ? construct.identifierToken.data : (propertyConstruct.namespaceToken.data == 'private' ? '$$thisp' : '$$this')) + ', \'' + propertyConstruct.identifierToken.data + '\');', _indent + 1, 1);
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

                    if (!js) js += print('//properties', _indent + 1, 1);

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var type = propertyConstruct.identifier.type;
                    var scope = construct.identifierToken.data;

                    var returnString = (type.isGlobal) ? getTranslatedTypeName(type) : '\'' + type.fullyQualifiedName + '\'';
                    var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', ' + (construct.identifierToken.data + '.' + namespaceObj.name);

                    if (namespaceObj.isCustom) js += print('$$cnamespace_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
                    else if (propertyConstruct.isNative) js += print('var ' + propertyConstruct.identifierToken.data + ';', _indent + 1, 1);
                    else
                    {
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

                        js += print('$es4.$$'+ propertyConstruct.identifier.namespaceObj.name + '_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
                    }
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

                    if (!js) js += print('//properties', _indent + 1, 1);

                    var namespaceObj = propertyConstruct.identifier.namespaceObj;
                    var isCNamespace = namespaceObj.isCustom;
                    var scope = (isCNamespace) ? '$$this, $$thisp' : '$$thisp';

                    var returnString = getTranslatedTypeName(propertyConstruct.identifier.type);
                    var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', $$thisp.' + namespaceObj.name;

                    if (isCNamespace) js += print('$es4.$$cnamespace_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
                    else if (propertyConstruct.isNative) js += print('var ' + propertyConstruct.identifierToken.data + ';', _indent + 1, 1);
                    else js += print('$es4.$$'+ propertyConstruct.identifier.namespaceObj.name + '_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
                }

                return js;
            }

            function translateStaticMethods(construct)
            {
                _inStaticFunction = true;

                var js = '';
                for (var i = 0; i < construct.staticMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.staticMethodConstructs[i];

                    upLevel();

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var isCNamespace = namespaceObj.isCustom;
                    var type = methodConstruct.identifier.type;

                    if (methodConstruct.isNative)
                    {
                        if (isCNamespace) throw new Error('cannot have native custom namespace native static');

                        if (methodConstruct.isJavaScript)
                        {
                            if (getTranslatedTypeName(type))
                            {
                                js += print('//method', _indent, 1, (js) ? 1 : 0);
                                js += print('function ' + methodConstruct.identifierToken.data + '() { return $es4.$$coerce((function (', _indent, 0);

                                js += translateParameters(methodConstruct, construct);
                                js += print(')', 0, 1);
                                js += print('{', _indent, 1);
                                js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                                js += translateDefaultParameterValues(methodConstruct, construct);
                                js += methodConstruct.javaScriptString;

                                js += print('}).apply(this, arguments), ' + getTranslatedTypeName(type) + '); }', _indent, 1);
                            }
                            else
                            {
                                js += print('//method', _indent, 1, (js) ? 1 : 0);
                                js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                                js += translateParameters(methodConstruct, construct);
                                js += print(')', 0, 1);
                                js += print('{', _indent, 1);
                                js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                                js += translateDefaultParameterValues(methodConstruct, construct);
                                js += methodConstruct.javaScriptString;

                                js += print('}', _indent, 1);
                            }
                        }
                        else
                        {
                            js += print('//method', _indent, 1, (js) ? 1 : 0);
                            js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);

                            js += translateParameters(methodConstruct, construct);
                            js += print(')', 0, 1);
                            js += print('{', _indent, 1);
                            js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                            js += translateDefaultParameterValues(methodConstruct, construct);
                            if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                            else js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                            js += print('}', _indent, 1);
                        }
                    }
                    else if (methodConstruct.isJavaScript)
                    {
                        js += print('//method', _indent, 1, (js) ? 1 : 0);
                        js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', (function (', _indent, 0);

                        js += translateParameters(methodConstruct, construct);
                        js += print(')', 0, 1);
                        js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
                        js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                        js += translateDefaultParameterValues(methodConstruct, construct);
                        if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                        else js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                        js += print('})', _indent, 0);

                        if (getTranslatedTypeName(type)) js += ', ' + getTranslatedTypeName(type);

                        js += print(');', 0, 1);
                    }
                    else if (isCNamespace)
                    {
                        js += print('//custom namespace method', _indent, 1, (js) ? 1 : 0);
                        var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + construct.identifierToken.data + '.' + namespaceObj.normalizedName;

                        js += print('$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + namespaceString + ', (function (', _indent, 0);

                        js += translateParameters(methodConstruct, construct);
                        js += print(')', 0, 1);
                        js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
                        js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                        js += translateDefaultParameterValues(methodConstruct, construct);
                        if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                        else
                        {
                            _inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : (namespaceObj.namespaceIsPrivate ? '$$thisp.' : '$$this.') + namespaceObj.name;

                            js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                            _inNamespacedFunction = false;
                        }

                        js += print('})', _indent, 0);
                        js += print(');', 0, 1);
                    }
                    else
                    {
                        js += print('//method', _indent, 1, (js) ? 1 : 0);
                        js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', (function (', _indent, 0);

                        js += translateParameters(methodConstruct, construct);
                        js += print(')', 0, 1);
                        js += print('{', _indent, 1);
                        js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);

                        js += translateDefaultParameterValues(methodConstruct, construct);
                        if (methodConstruct.UNIMPLEMENTEDToken && release) js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                        else js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                        js += print('})', _indent, 0);
                        js += print(');', 0, 1);
                    }

                    downLevel();
                }

                _inStaticFunction = false;

                return js;
            }

            function translateInstanceMethods(construct)
            {
                var js = '';
                for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
                {
                    var methodConstruct = construct.instanceMethodConstructs[i];

                    upLevel();

                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var isCNamespace = namespaceObj.isCustom;
                    var type = methodConstruct.identifier.type;

                    js += print((isCNamespace) ? '//custom namespace method' : '//method', _indent, 1, (js) ? 1 : 0);
                    var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + (namespaceObj.namespaceIsPrivate ? '$$thisp.' : '$$this.') + namespaceObj.normalizedName;

                    if (methodConstruct.isNative)
                    {
                        js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
                    }
                    else
                    {
                        if (isCNamespace) js += print('$es4.$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', $$this, $$thisp' + namespaceString + ', (function (', _indent, 0);
                        else if (!methodConstruct.ITERABLEToken && _fastPropertyAccess) js += print('$$thisp.' + methodConstruct.identifierToken.data + ' = function (', _indent, 0);
                        else js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', $$thisp, (function (', _indent, 0);
                    }

                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);

                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.isJavaScript) js += methodConstruct.javaScriptString;
                    else if (methodConstruct.UNIMPLEMENTEDToken && release)
                    {
                        js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    }
                    else
                    {
                        if (isCNamespace) _inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : '$$thisp.' + namespaceObj.name;

                        js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);

                        _inNamespacedFunction = false;
                    }

                    if (methodConstruct.isNative || (!methodConstruct.ITERABLEToken && _fastPropertyAccess && !isCNamespace))
                    {
                        js += print('}', _indent, 1);
                    }
                    else
                    {
                        js += print('})', (methodConstruct.isJavaScript) ? 0 : _indent, 0);
                        if (methodConstruct.isJavaScript && getTranslatedTypeName(type)) js += ', ' + getTranslatedTypeName(type);
                        js += print(');', 0, 1);
                    }
                    downLevel();
                }

                return js;
            }

            function translateStaticAccessors(construct)
            {
                _inStaticFunction = true;

                var js = '';
                function getMethodConstructJS(methodConstruct, type)
                {
                    if (!methodConstruct) return 'null';

                    upLevel();

                    var js = '(function (';
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
                        if (methodConstruct.identifier.namespaceObj.isCustom) _inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$es4.$$thisp.' + methodConstruct.identifier.namespaceObj.name;

                        js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);

                        _inNamespacedFunction = false;
                    }
                    js += print('})', (methodConstruct.javaScriptString) ? 0 : _indent, 0);

                    downLevel();

                    return js;
                }

                for (var i = 0; i < construct.staticAccessorConstructs.length; i++)
                {
                    var setterMethodConstruct = construct.staticAccessorConstructs[i].setter;
                    var getterMethodConstruct = construct.staticAccessorConstructs[i].getter;

                    var methodConstruct = setterMethodConstruct || getterMethodConstruct;

                    js += print((methodConstruct.identifier.namespaceObj.isCustom) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', ' + construct.identifierToken.data + '.' + namespaceObj.name;

                    if (methodConstruct.identifier.namespaceObj.isCustom) js += print('$es4.$$cnamespace_accessor(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + namespaceString + ', ', _indent + 1, 0);
                    else js += print('$es4.$$' + methodConstruct.identifier.namespaceObj.name + '_accessor(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', ', _indent + 1, 0);

                    var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;

                    if (!getterMethodConstruct)
                    {
                        js += '(function ()';
                        js += print('{', _indent + 1, 1, 1);
                        js += print("throw new Error('attempted access to undefined static getter');", _indent + 2, 0);
                        js += print('}), ', _indent + 1, 0, 1);
                    }
                    else js += getMethodConstructJS(getterMethodConstruct, type) + ', ';

                    if (!setterMethodConstruct && methodConstruct.overrideToken)
                    {
                        js += '(function ($$value)';
                        js += print('{', _indent + 1, 1, 1);
                        js += print("throw new Error('attempted access to undefined static setter');", _indent + 2, 0);
                        js += print('})', _indent + 1, 0, 1);
                    }
                    else js += getMethodConstructJS(setterMethodConstruct, type);

                    js += print(');', 0, 1);
                }

                _inStaticFunction = false;

                return js;
            }

            function translateInstanceAccessors(construct)
            {
                var js = '';
                function getMethodConstructJS(methodConstruct, type)
                {
                    if (!methodConstruct) return 'null';

                    upLevel();

                    var js = '(function (';
                    js += translateParameters(methodConstruct, construct);
                    js += print(')', 0, 1);
                    js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
                    js += translateDefaultParameterValues(methodConstruct, construct);
                    if (methodConstruct.isNative) throw new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data);
                    if (methodConstruct.isJavaScript) js += methodConstruct.javaScriptString;
                    else if (methodConstruct.UNIMPLEMENTEDToken && release)
                    {
                        js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
                    }
                    else
                    {
                        if (methodConstruct.identifier.namespaceObj.isCustom) _inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$$thisp.' + methodConstruct.identifier.namespaceObj.name;

                        js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);

                        _inNamespacedFunction = false;
                    }
                    js += print('})', (methodConstruct.javaScriptString) ? 0 : _indent, 0);

                    downLevel();

                    return js;
                }

                for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
                {
                    var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
                    var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;

                    var methodConstruct = setterMethodConstruct || getterMethodConstruct;

                    js += print((methodConstruct.identifier.namespaceObj.isCustom) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
                    var namespaceObj = methodConstruct.identifier.namespaceObj;
                    var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', $$thisp.' + namespaceObj.name;

                    if (methodConstruct.identifier.namespaceObj.isCustom) js += print('$es4.$$cnamespace_accessor(\'' + methodConstruct.identifierToken.data + '\', $$this, $$thisp' + namespaceString + ', ', _indent + 1, 0);
                    else js += print('$es4.$$' + methodConstruct.identifier.namespaceObj.name + '_accessor(\'' + methodConstruct.identifierToken.data + '\', $$thisp, ', _indent + 1, 0);

                    var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;

                    if (!getterMethodConstruct && methodConstruct.overrideToken)
                    {
                        js += '(function ()';
                        js += print('{', _indent + 1, 1, 1);
                        js += print('return $es4.$$super($$thisp).' + methodConstruct.identifierToken.data + ';', _indent + 2, 0);
                        js += print('}), ', _indent + 1, 0, 1);
                    }
                    else js += getMethodConstructJS(getterMethodConstruct, type) + ', ';

                    if (!setterMethodConstruct && methodConstruct.overrideToken)
                    {
                        js += '(function ($$value)';
                        js += print('{', _indent + 1, 1, 1);
                        js += print('$es4.$$super($$thisp).' + methodConstruct.identifierToken.data + ' = $$value;', _indent + 2, 0);
                        js += print('})', _indent + 1, 0, 1);
                    }
                    else js += getMethodConstructJS(setterMethodConstruct, type);

                    js += print(');', 0, 1);
                }

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
                        //throw new Error('foreach not supported at the moment'); //don't use for in on arrays

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
                                    js += print('if ($es4.$$is(' + catchStatement.identifierToken.data + ', ' + getTranslatedTypeName(catchStatement.identifier.type) + '))', _indent + 1, 1);
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
                        if (_dynamicPropertyAccess) js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
                        else js += translatePropertyExpression(expression, toString, construct);
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
                        if (_dynamicPropertyAccess) js += translatePropertyExpressionDynamic(expression.expression, toString, undefined, undefined, construct, true);
                        else js += 'delete ' + translateExpression(expression.expression, 0, toString, construct);
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
                        if (_dynamicPropertyAccess) js += translatePropertyExpressionDynamic(expression.expression, toString, '\'prefix\'', (expression.decrementToken) ? '--' : '++', construct);
                        else
                        {
                            if (!expression.expression) trace('invalid 25');
                            js += ((expression.decrementToken) ? '--' : '++') + translateExpression(expression.expression, 0 , toString, construct);
                        }
                        break;
                    case Construct.PostfixExpression:
                        if (_dynamicPropertyAccess) js += translatePropertyExpressionDynamic(expression.expression, toString, '\'postfix\'', (expression.decrementToken) ? '--' : '++', construct);
                        else
                        {
                            if (!expression.expression) trace('invalid 26');
                            js += translateExpression(expression.expression, 0 , toString, construct) + ((expression.decrementToken) ? '--' : '++');
                        }
                        break;
                    case Construct.NewExpression:
                        if (_dynamicPropertyAccess)
                        {
                            if (expression.expression.constructor == Construct.ParenExpression)
                            {
                                if (!expression.expression) trace('invalid 02');
                                js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
                            }
                            else js += translatePropertyExpressionDynamic(expression.expression, toString, null, null, construct, null, true);
                        }
                        else
                        {
                            if (!expression.expression) trace('invalid 03');
                            js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
                        }
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

                                if (_dynamicPropertyAccess)
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

            function translatePropertyExpression(expression, toString, construct)
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
                    else if (!namespaceString) namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? '$$thisp.' : '$$this.') + namespaceIdentifier.name;

                    pname += '.$$namespace(' + namespaceString + ')';
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
                else
                {
                    if (!expression.construct.expression) trace('invalid 37');
                    name = translateExpression(expression.construct.expression, 0, toString, construct);
                }
                js += (!pname) ? name : (pname + '.' + name);

                while (expression = expression.nextPropertyExpression)
                {
                    if (expression.construct.constructor == Construct.DotConstruct || expression.construct.constructor == Construct.IdentifierConstruct)
                    {
                        //if (expression.construct.constructor == IdentifierConstruct) identifierConstructEncountered = true;

                        if (expression.construct.constructor == Construct.DotConstruct) js += '.';

                        js += expression.construct.identifierToken.data;
                    }
                    else if (expression.construct.constructor == Construct.ArrayAccessorConstruct)
                    {
                        if (!expression.construct.expression) trace('invalid 38');
                        js += '[' + translateExpression(expression.construct.expression, 0, toString, construct) + ']';
                    }
                    else if (expression.construct.constructor == Construct.NamespaceQualifierConstruct)
                    {
                        namespaceIdentifier = expression.construct.namespaceIdentifier;

                        var namespaceObj = namespaceIdentifier.namespaceObj;
                        var namespaceString = namespaceObj.normalizedImportID;

                        if (namespaceIdentifier.isStatic && !namespaceString) namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
                        else if (!namespaceString) namespaceString = (identifier.isPrivate) ? '$$thisp.' + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;


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

                        if (js == '$es4.$$super($$thisp)') js += '.$$z';

                        js += '(';
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

                return js;
            }

            function translatePropertyExpressionDynamic(expression, toString, setString, operator, construct, doDelete=null, doNew=null)
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

                        var namespaceObj = namespaceIdentifier.namespaceObj;
                        var namespaceString = namespaceObj.normalizedImportID;

                        /* //commenting out for now till i know if this is "correct"
                        var namespaceObj;
                        var namespaceString;
                        if (namespaceIdentifier.isNamespace) namespaceObj = namespaceIdentifier.isNamespace; //this looks incorrect
                        else namespaceObj = namespaceIdentifier.namespaceObj;

                        namespaceString = namespaceObj.normalizedImportID;
                        */
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
							if (state.doNew)
							{
								if (functionCallExpression.construct.argumentExpressions.length) js = '$es4.$$primitive(new (' + js + ')(';
								else js = '$es4.$$primitive(new (' + js + ')(';
							}
							else js += '(';
						}
                        else
                        {
							 if (state.doNew) js = '$es4.$$primitive(new (' + js + '))(';
                            else
                            {
                                if (!lastAccessTypeWasArrayAccessor)
                                {
                                    start = js.substring(10);
                                    js = '$es4.$$call' + start;
                                    if (functionCallExpression.construct.argumentExpressions.length) js += ', [';
                                }
                                else js += ')(';
                            }
                            closed = true;
                            propListCount = 2;
                        }

                        for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
                        {
                            js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
                            if ((i + 1) < functionCallExpression.construct.argumentExpressions.length) js += ', ';
                        }

						if (state.doNew) js += ')';
						state.doNew = false;

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
					 if (state.doNew) js = '$es4.$$primitive(new (' + js + '()))';
                }
                else
                {
                    if (state.doAssignment)
                    {
                        js = '$es4.$$set' + js.slice(10);
                        js += ', ' + setString + ', \'' + operator + '\'';
                    }
                    else if (state.doDelete) js = '$es4.$$delete' + js.slice(10);
                    if (!closed) js += ')';
                }

                return js;
            }

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
