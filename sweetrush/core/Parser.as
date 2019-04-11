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

	public class Parser
    {
        public static function parse(tokens:Array, compileConstants:Object, release:Boolean=false):*
        {
            if (!tokens.length) return null;
            if (!compileConstants) compileConstants = {};

            var index:* = -1;
            var ahead:* = 1;
            var rootConstruct:* =  Construct.getNewRootConstruct();
            var callsSuper:* = false; //set to true when a method calls super

            var inCompileConstant:* = false; //used for compiler constants

            var add:* = true; //used for compiler constants
            var previousAddValue:* = add; //used for compiler constants
            var token:*;
            var statementImportConstructs = []; //so we can have import statements inside of functions
            loopa: while (token = peek(ahead))
            {
                ahead++;

                switch (token.type)
                {
                    case Token.PackageTokenType:
                        var p = matchPackageConstruct(rootConstruct);
                        if (add)
                        {
                            rootConstruct.packageConstruct = p;
                            rootConstruct.packageConstruct.rootConstruct = rootConstruct;
                        }
                        break;
                    case Token.ImportTokenType:
                        var p = matchImportConstruct();
                        if (add) rootConstruct.importConstructs.push(p);
                        break;
                    case Token.ElseTokenType:
                        match(Token.ElseTokenType);
                        if (inCompileConstant) throw new Error('nested compile constants are not supported');

                        inCompileConstant = true;
                        add = !previousAddValue;
                        match(Token.OpenBraceTokenType);
                        break;
                    case Token.IfTokenType:
                        match(Token.IfTokenType);
                        match(Token.OpenParenTokenType);
                        if (inCompileConstant) throw new Error('nested compile constants are not supported');
                    case Token.IdentifierTokenType:
                        if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
                        {
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');

                            var compileConstantIdentifier:* = '';
                            compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                            compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
                            compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                            match(Token.ClosedParenTokenType, true); //if statement will have this

                            inCompileConstant = true;
                            add = compileConstants[compileConstantIdentifier] == 'true';
                            match(Token.OpenBraceTokenType);
                            break;
                        }
                        continue loopa;
                    case Token.ClosedBraceTokenType:
                        if (inCompileConstant)
                        {
                            match(Token.ClosedBraceTokenType);
                            inCompileConstant = false;
                            previousAddValue = add;
                            add = true;
                            break;
                        }
                    case Token.FinalTokenType:
                    case Token.DynamicTokenType:
                        continue loopa;
                    case Token.ClassTokenType:
                        var classConstruct:* = matchClassConstruct();
                        if (add)
                        {
                            classConstruct.isInternal = true;
                            classConstruct.rootConstruct = rootConstruct;
                            rootConstruct.importConstructs = classConstruct.importConstructs.concat(rootConstruct.importConstructs);
                            rootConstruct.classConstructs.push(classConstruct);
                        }
                        break;
                    case Token.InterfaceTokenType:
                        var interfaceConstruct:* = matchInterfaceConstruct();
                        if (add)
                        {
                            interfaceConstruct.isInternal = true;
                            interfaceConstruct.rootConstruct = rootConstruct;
                            rootConstruct.interfaceConstructs.push(interfaceConstruct);
                        }
                        break;
                    case Token.FunctionTokenType:
                        var methodConstruct:* = matchMethodConstruct();
                        if (add)
                        {
                            methodConstruct.isInternal = true;
                            methodConstruct.rootConstruct = rootConstruct;
                            if (!(methodConstruct.UNIMPLEMENTEDToken && release)) rootConstruct.methodConstructs.push(methodConstruct);
                        }
                        break;
                    case Token.NamespaceKeywordTokenType:
                    case Token.VarTokenType:
                        var propertyConstruct:* = matchPropertyConstruct();
                        if (add)
                        {
                            propertyConstruct.isInternal = true;
                            propertyConstruct.rootConstruct = rootConstruct;
                            rootConstruct.propertyConstructs.push(propertyConstruct);
                        }
                        break;
                    default:
                        throw error('Unexpected token found11.', token);
                }

                ahead = 1;
            }

            function matchTypeConstruct():*
            {
                var typeConstruct:* =  Construct.getNewTypeConstruct();
                var token:* = peek(1);
                if (token.type == Token.MulTokenType) typeConstruct.mulToken = match(Token.MulTokenType);
                else if (token.type == Token.VoidTokenType) typeConstruct.voidToken = match(Token.VoidTokenType);
                else
                {
                    typeConstruct.nameConstruct = matchNameConstruct();
                    if (match(Token.VectorDotOpenArrowTokenType, true))
                    {
                        typeConstruct.vectorNameConstruct = matchNameConstruct();
                        match(Token.VectorClosedArrowTokenType);
                    }
                }

                return typeConstruct;
            }

            function matchPackageConstruct(rootConstruct:*):*
            {
                var packageConstruct:* =  Construct.getNewPackageConstruct();
                match(Token.PackageTokenType);
                if (peek(1).type == Token.IdentifierTokenType) packageConstruct.nameConstruct = matchNameConstruct();
                else packageConstruct.nameConstruct =  Construct.getNewNameConstruct();
                match(Token.OpenBraceTokenType);

                var ahead:* = 1;
                var metaDataConstructs:* = [];
                var token:*;

                var inCompileConstant:* = false; //used for compiler constants
                var add:* = true; //used for compiler constants
                var previousAddValue:* = add; //used for compiler constants
                loopb: while (token = peek(ahead, 0, true))
                {
                    ahead++;
                    switch (token.type)
                    {
                        case Token.ImportTokenType:
                            var c = matchImportConstruct();
                            if (add) packageConstruct.importConstructs.push(c);
                            break;
                        case Token.OpenBracketTokenType:
                            var c = matchMetaDataConstruct();
                            if (add) metaDataConstructs.push(c);
                            ahead = 1;
                            continue loopb;
                        //case Token.IdentifierTokenType:
                        case Token.StaticTokenType:
                        case Token.FinalTokenType:
                        case Token.OverrideTokenType:
                        case Token.DynamicTokenType:
                            continue loopb;
                        case Token.UseTokenType:
                            var useConstruct:* = matchUseConstruct();
                            if (add) packageConstruct.useConstructs.push(useConstruct);
                            break;
                        case Token.NamespaceKeywordTokenType:
                            var p =  matchPropertyConstruct(metaDataConstructs);
                             if (add)
                             {
                                 packageConstruct.propertyConstruct = p;
                                 packageConstruct.propertyConstruct.packageConstruct = packageConstruct;
                                 packageConstruct.propertyConstruct.rootConstruct = rootConstruct;
                             }
                            break;
                        case Token.FunctionTokenType:
                            var m = matchMethodConstruct(metaDataConstructs);
                            if (add)
                            {
                                packageConstruct.methodConstruct = m;
                                packageConstruct.methodConstruct.packageConstruct = packageConstruct;
                                packageConstruct.methodConstruct.rootConstruct = rootConstruct;
                            }
                            break;
                        case Token.ClassTokenType:
                            if (add && packageConstruct.classConstruct) throw error('Multiple definitions found in package.', token);
                            var c = matchClassConstruct();
                            if (add)
                            {
                                packageConstruct.classConstruct = c;
                                packageConstruct.classConstruct.packageConstruct = packageConstruct;
                                packageConstruct.importConstructs = packageConstruct.classConstruct.importConstructs.concat(packageConstruct.importConstructs);
                                packageConstruct.classConstruct.rootConstruct = rootConstruct;
                            }
                            break;
                        case Token.InterfaceTokenType:
                            if (add && packageConstruct.interfaceConstruct) throw error('Multiple definitions found in package.', token);
                            var c = matchInterfaceConstruct();
                            if (add)
                            {
                                packageConstruct.interfaceConstruct = c;
                                packageConstruct.interfaceConstruct.packageConstruct = packageConstruct;
                                packageConstruct.interfaceConstruct.rootConstruct = rootConstruct;
                            }
                            break;
                        case Token.ElseTokenType:
                            match(Token.ElseTokenType);
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');

                            inCompileConstant = true;
                            add = !previousAddValue;
                            match(Token.OpenBraceTokenType);
                            break;
                        case Token.IfTokenType:
                            match(Token.IfTokenType);
                            match(Token.OpenParenTokenType);
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');
                        case Token.IdentifierTokenType:
                            if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
                            {
                                if (inCompileConstant) throw new Error('nested compile constants are not supported');

                                var compileConstantIdentifier:* = '';
                                compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                                compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
                                compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                                match(Token.ClosedParenTokenType, true); //if statement will have this

                                inCompileConstant = true;
                                add = compileConstants[compileConstantIdentifier] == 'true';
                                match(Token.OpenBraceTokenType);
                                break;
                            }
                            continue loopb;
                        case Token.ClosedBraceTokenType:
                            if (inCompileConstant)
                            {
                                match(Token.ClosedBraceTokenType);
                                inCompileConstant = false;
                                previousAddValue = add;
                                add = true;
                                break;
                            }
                            break loopb;
                        default:
                            throw error('Unexpected token found1.', token);
                    }

                    metaDataConstructs = [];
                    ahead = 1;
                }

                match(Token.ClosedBraceTokenType);

                return packageConstruct;
            }

            function matchMetaDataConstruct():*
            {
                var metaDataConstruct:* =  Construct.getNewMetaDataConstruct();
                match(Token.OpenBracketTokenType);
                while (!match(Token.ClosedBracketTokenType, true)) metaDataConstruct.tokens.push(next());
                match(Token.EOSTokenType, true, true);

                return metaDataConstruct;
            }

            function matchClassConstruct():*
            {
                var classConstruct:* =  Construct.getNewClassConstruct();

                var token:*;
                loop1a: while (token = next(0, true))
                {
                    switch (token.type)
                    {
                        case Token.IdentifierTokenType:
                            if (token.data == 'UNIMPLEMENTED') classConstruct.UNIMPLEMENTEDToken = token;
                            else classConstruct.namespaceToken = token;
                            break;
                        case Token.StaticTokenType:
                            classConstruct.staticToken = token;
                            break;
                        case Token.FinalTokenType:
                            classConstruct.finalToken = token;
                            break;
                        case Token.DynamicTokenType:
                            classConstruct.dynamicToken = token;
                            break;
                        case Token.ClassTokenType:
                            break loop1a;
                        default:
                            throw error('Unexpected token found2.', token);
                    }
                }

                classConstruct.identifierToken = match(Token.IdentifierTokenType);

                loop2a: while (token = next())
                {
                    switch (token.type)
                    {
                        case Token.ExtendsTokenType:
                            classConstruct.extendsNameConstruct = matchNameConstruct();
                            break;
                        case Token.ImplementsTokenType:
                            classConstruct.implementsNameConstructs.push(matchNameConstruct());
                            while (token = peek(1))
                            {
                                if (token.type != Token.CommaTokenType) continue loop2a;
                                match(Token.CommaTokenType);
                                classConstruct.implementsNameConstructs.push(matchNameConstruct());
                            }
                            break;
                        case Token.OpenBraceTokenType:
                            break loop2a;
                        default:
                            throw error('Unexpected token found3.', token);
                    }
                }

                var add:* = true; //used for compiler constants
                var inCompileConstant:* = false; //used for compiler constants
                var previousAddValue:* = add; //used for compiler constants
                var metaDataConstructs:* = [];
                var ahead:* = 1;
                loop3a: while (token = peek(ahead, 0, true))
                {
                    ahead++;
                    switch (token.type)
                    {
                        case Token.ImportTokenType:
                             var c = matchImportConstruct();
                             if (add) classConstruct.importConstructs.push(c);
                             break;
                        case Token.OpenBracketTokenType:
                            var c = matchMetaDataConstruct();
                            if (add) metaDataConstructs.push(c);
                            ahead = 1;
                            continue loop3a;
                        case Token.OpenBraceTokenType:
                            match(Token.OpenBraceTokenType);
                            var innerInnerToken:*;
                            while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
                            {
                                 var s = matchStatement();
                                if (add) classConstruct.initializerStatements.push(s);
                            }
                            match(Token.ClosedBraceTokenType);
                            break;
                        case Token.ElseTokenType:
                            match(Token.ElseTokenType);
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');

                            inCompileConstant = true;
                            add = !previousAddValue;
                            match(Token.OpenBraceTokenType);
                            break;
                        case Token.IfTokenType:
                            match(Token.IfTokenType);
                            match(Token.OpenParenTokenType);
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');
                        case Token.IdentifierTokenType:
                            if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
                            {
                                if (inCompileConstant) throw new Error('nested compile constants are not supported');

                                var compileConstantIdentifier:* = '';
                                compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                                compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
                                compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                                match(Token.ClosedParenTokenType, true); //if statement will have this

                                inCompileConstant = true;
                                add = compileConstants[compileConstantIdentifier] == 'true';
                                match(Token.OpenBraceTokenType);
                                break;
                            }
                        case Token.OverrideTokenType:
                        case Token.StaticTokenType:
                        case Token.FinalTokenType:
                            continue loop3a;
                        case Token.VarTokenType:
                        case Token.ConstTokenType:
                        case Token.NamespaceKeywordTokenType:
                            var propertyConstruct:* = matchPropertyConstruct(metaDataConstructs);
                            if (add) classConstruct.propertyConstructs.push(propertyConstruct);
                            break;
                        case Token.FunctionTokenType:
                            var methodConstruct:* = matchMethodConstruct(metaDataConstructs);

                            if (methodConstruct.UNIMPLEMENTEDToken && release) break;

                            if (methodConstruct.identifierToken.data == classConstruct.identifierToken.data)
                            {
                                if (add) classConstruct.constructorMethodConstruct = methodConstruct;
                                if (methodConstruct.isJavaScript) throw error('Constructor cannot be declared as native.', methodConstruct.identifierToken);
                            }
                            else if (add) classConstruct.methodConstructs.push(methodConstruct);
                            break;
                        case Token.UseTokenType:
                            var useConstruct:* = matchUseConstruct();
                            if (add) classConstruct.useConstructs.push(useConstruct);
                            break;
                        case Token.ClosedBraceTokenType:
                            if (inCompileConstant)
                            {
                                match(Token.ClosedBraceTokenType);
                                inCompileConstant = false;
                                previousAddValue = add;
                                add = true;
                                break;
                            }
                            break loop3a;
                        default:
                            throw error('Unexpected token found4.', token);
                    }

                    metaDataConstructs = [];
                    ahead = 1;
                }

                match(Token.ClosedBraceTokenType);

                return classConstruct;
            }

            function matchUseConstruct():*
            {
                var useConstruct:* =  Construct.getNewUseConstruct();

                useConstruct.useToken = match(Token.UseTokenType);
                match(Token.NamespaceKeywordTokenType);
                useConstruct.namespaceIdentifierToken = match(Token.IdentifierTokenType);
                match(Token.EOSTokenType, true, true);

                return useConstruct;
            }

            function matchInterfaceConstruct():*
            {
                var interfaceConstruct:* =  Construct.getNewInterfaceConstruct();

                var token:*;
                loop1b: while (token = next())
                {
                    switch (token.type)
                    {
                        case Token.IdentifierTokenType:
                            interfaceConstruct.namespaceToken = token;
                            break;
                        case Token.InterfaceTokenType:
                            break loop1b;
                        default:
                            throw error('Unexpected token found5.', token);
                    }
                }

                interfaceConstruct.identifierToken = match(Token.IdentifierTokenType);

                loop2b: while (token = next())
                {
                    switch (token.type)
                    {
                        case Token.ExtendsTokenType:
                            interfaceConstruct.extendsNameConstructs.push(matchNameConstruct());
                            while (token = peek(1))
                            {
                                if (token.type != Token.CommaTokenType) continue loop2b;
                                match(Token.CommaTokenType);
                                interfaceConstruct.extendsNameConstructs.push(matchNameConstruct());
                            }
                            break;
                        case Token.OpenBraceTokenType:
                            break loop2b;
                        default:
                            throw error('Unexpected token found6.', token);
                    }
                }

                var ahead:* = 1;
                loop3b: while (token = peek(ahead))
                {
                    ahead++;
                    switch (token.type)
                    {
                        case Token.FunctionTokenType:
                            var methodConstruct:* =  Construct.getNewMethodConstruct();
                            match(Token.FunctionTokenType);

                            methodConstruct.setToken = match(Token.SetTokenType, true);
                            if (!methodConstruct.setToken) methodConstruct.getToken = match(Token.GetTokenType, true);

                            methodConstruct.identifierToken = match(Token.IdentifierTokenType);

                            match(Token.OpenParenTokenType);
                            while (!match(Token.ClosedParenTokenType, true))
                            {
                                methodConstruct.parameterConstructs.push(matchParameterConstruct());
                                match(Token.CommaTokenType, true);
                            }
                            if (match(Token.ColonTokenType, true)) methodConstruct.typeConstruct = matchTypeConstruct();
                            else
                            {
                                methodConstruct.typeConstruct =  Construct.getNewTypeConstruct();
                                methodConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                            }
                            match(Token.EOSTokenType, true, true);

                            interfaceConstruct.methodConstructs.push(methodConstruct);
                            break;
                        case Token.ClosedBraceTokenType:
                            break loop3b;
                        default:
                            throw error('Unexpected token found7.', token);
                    }

                    ahead = 1;
                }

                match(Token.ClosedBraceTokenType);

                return interfaceConstruct;
            }

            function matchNameConstruct():*
            {
                var nameConstruct:* =  Construct.getNewNameConstruct();

                nameConstruct.identifierTokens.push(match(Token.IdentifierTokenType));
                var token1:*;
                var token2:*;
                while ((token1 = peek(1)) && (token2 = peek(2)))
                {
                    if (token1.type != Token.DotTokenType) break;
                    if (token2.type != Token.IdentifierTokenType) break;
                    match(Token.DotTokenType);
                    nameConstruct.identifierTokens.push(match(Token.IdentifierTokenType));
                }

                return nameConstruct;
            }

            function matchImportConstruct():*
            {
                var importConstruct:* =  Construct.getNewImportConstruct();
                match(Token.ImportTokenType);
                importConstruct.nameConstruct = matchNameConstruct();
                if (match(Token.DotTokenType, true)) importConstruct.mulToken = match(Token.MulTokenType);
                match(Token.EOSTokenType, true, true);
                return importConstruct;
            }

            function matchPropertyConstruct(metaDataConstructs:*=null):*
            {
                var propertyConstruct:* =  Construct.getNewPropertyConstruct();

                var token:*;
                loop1c: while (token = next(0, true))
                {
                    switch (token.type)
                    {
                        case Token.IdentifierTokenType:
                            propertyConstruct.namespaceToken = token;
                            break;
                        case Token.StaticTokenType:
                            propertyConstruct.staticToken = token;
                            break;
                        case Token.NamespaceKeywordTokenType:
                            propertyConstruct.namespaceKeywordToken = token;
                            break loop1c;
                        case Token.ConstTokenType:
                            propertyConstruct.constToken = token;
                            break loop1c;
                        case Token.VarTokenType:
                            break loop1c;
                        default:
                            throw error('Unexpected token found8.', token);
                    }
                }

                propertyConstruct.identifierToken = match(Token.IdentifierTokenType);
                if (match(Token.ColonTokenType, true)) propertyConstruct.typeConstruct = matchTypeConstruct();
                else
                {
                    propertyConstruct.typeConstruct =  Construct.getNewTypeConstruct();
                    propertyConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                }
                match(Token.EOSTokenType, true, true);

                if (metaDataConstructs)
                {
                    for (var i:* = 0; i < metaDataConstructs.length; i++)
                    {
                        var metaDataConstruct:* = metaDataConstructs[i];

                        if (metaDataConstruct.tokens[0].data == 'Native')
                        {
                            propertyConstruct.isNative = true;
                            if (!propertyConstruct.namespaceToken || propertyConstruct.namespaceToken.data != 'private') throw new Error('native properties must be defined as private');
                            if (propertyConstruct.typeConstruct && !propertyConstruct.typeConstruct.mulToken) throw new Error('native properties must be defined as type *');
                            propertyConstruct.namespaceToken = null;
                        }
                    }
                }

                if (!match(Token.AssignmentTokenType, true)) return propertyConstruct;

                propertyConstruct.valueExpression = matchExpression();
                match(Token.EOSTokenType, true, true);

                return propertyConstruct;
            }

            function matchMethodConstruct(metaDataConstructs:*=null):*
            {
                var methodConstruct:* =  Construct.getNewMethodConstruct();

                var token:*;
                loop1d: while (token = next(0, true))
                {
                    switch (token.type)
                    {
                        case Token.IdentifierTokenType:
                            if (token.data == 'UNIMPLEMENTED') methodConstruct.UNIMPLEMENTEDToken = token;
                            else methodConstruct.namespaceToken = token;
                            break;
                        case Token.StaticTokenType:
                            methodConstruct.staticToken = token;
                            break;
                        case Token.OverrideTokenType:
                            methodConstruct.overrideToken = token;
                            break;
                        case Token.FinalTokenType:
                            //nothing
                            break;
                        case Token.FunctionTokenType:
                            break loop1d;
                        default:
                            throw error('Unexpected token found9.', token);
                    }
                }

                methodConstruct.setToken = match(Token.SetTokenType, true);
                if (!methodConstruct.setToken) methodConstruct.getToken = match(Token.GetTokenType, true);

                methodConstruct.identifierToken = match(Token.IdentifierTokenType);

                match(Token.OpenParenTokenType);
                while (!match(Token.ClosedParenTokenType, true))
                {
                    methodConstruct.parameterConstructs.push(matchParameterConstruct());
                    match(Token.CommaTokenType, true);
                }
                if (match(Token.ColonTokenType, true)) methodConstruct.typeConstruct = matchTypeConstruct();
                else
                {
                    methodConstruct.typeConstruct =  Construct.getNewTypeConstruct();
                    methodConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                }

                if (metaDataConstructs)
                {
                    for (var i:* = 0; i < metaDataConstructs.length; i++)
                    {
                        var metaDataConstruct:* = metaDataConstructs[i];

                        if (metaDataConstruct.tokens[0].data == 'JavaScript') methodConstruct.isJavaScript = true;
                        if (metaDataConstruct.tokens[0].data == 'Native')
                        {
                            methodConstruct.isNative = true;
                            if (!methodConstruct.namespaceToken || methodConstruct.namespaceToken.data != 'private') throw new Error('native methods must be defined as private');
                            methodConstruct.namespaceToken = null;
                        }
                    }
                }

                match(Token.OpenBraceTokenType, undefined, undefined);
                callsSuper = false;
                var open:* = 1;
                var closed:* = 0;
                if (methodConstruct.isJavaScript)
                {
                    while (token = next(2, undefined))
                    {
                        if (token.type == Token.ClosedBraceTokenType)
                        {
                            closed++;
                            if (closed == open) break;
                        }
                        if (token.type == Token.OpenBraceTokenType) open++;

                        methodConstruct.javaScriptString += token.data;
                    }
                }
                else while (!match(Token.ClosedBraceTokenType, true, undefined)) methodConstruct.bodyStatements.push(matchStatement(false, methodConstruct.namedFunctionExpressions));
                methodConstruct.callsSuper = callsSuper;
                match(Token.EOSTokenType, true, true);

                return methodConstruct;
            }

            function matchParameterConstruct():*
            {
                var argumentConstruct:* =  Construct.getNewParameterConstruct();
                argumentConstruct.restToken = match(Token.RestTokenType, true);

                argumentConstruct.identifierToken = match(Token.IdentifierTokenType);
                if (argumentConstruct.restToken) return argumentConstruct;

                if (match(Token.ColonTokenType, true)) argumentConstruct.typeConstruct = matchTypeConstruct();
                else
                {
                    argumentConstruct.typeConstruct =  Construct.getNewTypeConstruct();
                    argumentConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                }
                if (match(Token.AssignmentTokenType, true) && !match(Token.MulTokenType, true)) argumentConstruct.valueExpression = matchExpression(true);

                return argumentConstruct;
            }

            function matchPropertyExpression(construct:*=null):*
            {
                var token:* = peek(1);
                if (token.type == Token.ThisTokenType)
                {
                    construct =  Construct.getNewThisConstruct();
                    construct.thisToken = match(Token.ThisTokenType);
                }
                else if (token.type == Token.SuperTokenType)
                {
                    construct =  Construct.getNewSuperConstruct();
                    construct.superToken = match(Token.SuperTokenType);
                    callsSuper = true;
                }
                else if (token.type == Token.AtTokenType)
                {
                    match(Token.AtTokenType);
                    construct =  Construct.getNewAtIdentifierConstruct();
                }
                else if (!construct)
                {
                    construct =  Construct.getNewIdentifierConstruct();
                    construct.identifierToken = match(Token.IdentifierTokenType);
                }

                var propertyExpression:* =  Construct.getNewPropertyExpression();
                propertyExpression.construct = construct;

                var innerPropertyExpression:*;
                var nextPropertyExpression:* = propertyExpression;
                loopc: while (token = peek(1))
                {
                    innerPropertyExpression = null;

                    switch (token.type)
                    {
                        case Token.VectorDotOpenArrowTokenType:
                            match(Token.VectorDotOpenArrowTokenType);
                            construct =  Construct.getNewVectorConstruct();
                            construct.nameConstruct = matchNameConstruct();
                            match(Token.VectorClosedArrowTokenType);
                            break;
                        case Token.NamespaceQualifierTokenType:
                            construct =  Construct.getNewNamespaceQualifierConstruct();
                            construct.namespaceQualifierToken = match(Token.NamespaceQualifierTokenType);
                            construct.identifierToken = nextPropertyExpression.construct.identifierToken;
                            construct.namespaceIdentifierToken = match(Token.IdentifierTokenType);
                            nextPropertyExpression.construct = construct;
                            continue loopc;
                        case Token.IdentifierTokenType:
                            construct =  Construct.getNewIdentifierConstruct();
                            construct.identifierToken = match(Token.IdentifierTokenType);
                            break;
                        case Token.DotTokenType:
                            match(Token.DotTokenType);
                            if (match(Token.AtTokenType, true)) construct =  Construct.getNewAtIdentifierConstruct();
                            else if (match(Token.OpenParenTokenType, true))
                            {
                                throw new Error('E4X is not supported');
                                construct =  Construct.getNewE4XSearchConstruct();
                                construct.expression = matchExpression();
                                if (construct.expression.constructor == 'PropertyExpression') construct.expression.root = false;
                                match(Token.ClosedParenTokenType);
                            }
                            else
                            {
                                construct =  Construct.getNewDotConstruct();
                                construct.identifierToken = match(Token.IdentifierTokenType);
                            }
                            break;
                        case Token.OpenBracketTokenType:
                            match(Token.OpenBracketTokenType);
                            construct =  Construct.getNewArrayAccessorConstruct();
                            construct.expression = matchExpression();
                            if (construct.expression.constructor == 'PropertyExpression') construct.expression.root = false;
                            match(Token.ClosedBracketTokenType);
                            break;
                        case Token.OpenParenTokenType:
                            match(Token.OpenParenTokenType);
                            construct =  Construct.getNewFunctionCallConstruct();
                            while (!match(Token.ClosedParenTokenType, true))
                            {
                                construct.argumentExpressions.push(matchExpression(true));
                                match(Token.CommaTokenType, true);
                            }
                            break;
                        default:
                            break loopc;
                    }

                    if (!innerPropertyExpression)
                    {
                        innerPropertyExpression =  Construct.getNewPropertyExpression();
                        innerPropertyExpression.construct = construct;
                    }
                    nextPropertyExpression.nextPropertyExpression = innerPropertyExpression;
                    nextPropertyExpression = innerPropertyExpression;
                }

                return propertyExpression;
            }

            function matchStatement(dontmatchEOS:Boolean=false, namedFunctionExpressions:*=null, dontReadIn:Boolean=false):*
            {
                var statement:*;
                var token:* = peek(1, undefined, undefined)
                var innerToken:*;
                var openBraceTokenType:*;
                var innerToken1:*;
                var innerToken2:*;
                var innerInnerToken:*;
                var tokenType = token.type;

                var foundCompileConstantIdentifier = false;
                if (peek(2, 0, true).type == Token.NamespaceQualifierTokenType && compileConstants[token.data + peek(2, 0, true).data + peek(3, 0, true).data] !== undefined)
                {
                    foundCompileConstantIdentifier = true;
                    tokenType = Token.IfTokenType;
                }

                switch (tokenType)
                {
                    case Token.ImportTokenType: //so we can support import statements in functions
                        var p = matchImportConstruct();
                        statementImportConstructs.push(p);
                        statement = Construct.getNewEmptyStatement();
                        break;
                    case Token.IfTokenType:
                        if (!foundCompileConstantIdentifier) match(Token.IfTokenType);
                        statement = Construct.getNewIfStatement();
                        if (!foundCompileConstantIdentifier) match(Token.OpenParenTokenType);

                        var inCompileConstant:* = false;
                        var inCompileConstantLocal:* = false;
                        var innerStatement:*;
                        var add:* = true;
                        if (peek(1, 0, true).type == Token.IdentifierTokenType && peek(2, 0, true).type == Token.NamespaceQualifierTokenType && compileConstants[peek(1, 0, true).data + peek(2, 0, true).data + peek(3, 0, true).data] !== undefined)
                        {
                            if (inCompileConstant) throw new Error('nested compile constants are not supported');
                            inCompileConstantLocal = true;
                            inCompileConstant = true;

                            var compileConstantIdentifier:* = '';
                            compileConstantIdentifier += match(Token.IdentifierTokenType).data;
                            compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
                            compileConstantIdentifier += match(Token.IdentifierTokenType).data;

                            add = compileConstants[compileConstantIdentifier] == 'true';
                            var booleanExpression:* =  Construct.getNewBooleanExpression();
                            booleanExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, add.toString());
                            statement.conditionExpression = booleanExpression;
                        }
                        else statement.conditionExpression = matchExpression(false, namedFunctionExpressions);

                        if (!foundCompileConstantIdentifier) match(Token.ClosedParenTokenType);
                        foundCompileConstantIdentifier = false;

                        openBraceTokenType = match(Token.OpenBraceTokenType, true);

                        loopd: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                        {
                            innerStatement = matchStatement(false, namedFunctionExpressions);
                            if (add) statement.bodyStatements.push(innerStatement);
                            if (!openBraceTokenType) break loopd;
                        }
                        if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                        while (((innerToken1 = peek(1)) && (innerToken2 = peek(2))) && (innerToken1.type == Token.ElseTokenType && innerToken2.type == Token.IfTokenType))
                        {
                            match(Token.ElseTokenType);
                            match(Token.IfTokenType);
                            var elseIfStatement:* =  Construct.getNewElseIfStatement();
                            match(Token.OpenParenTokenType);
                            elseIfStatement.conditionExpression = matchExpression(false, namedFunctionExpressions);
                            match(Token.ClosedParenTokenType);
                            openBraceTokenType = match(Token.OpenBraceTokenType, true);

                            loope: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                            {
                                elseIfStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                                if (!openBraceTokenType) break loope;
                            }
                            if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                            statement.elseIfStatements.push(elseIfStatement);
                        }
                        while ((innerToken1 = peek(1)) && (innerToken1.type == Token.ElseTokenType))
                        {
                            var elseStatement:* =  Construct.getNewElseStatement();
                            match(Token.ElseTokenType);
                            openBraceTokenType = match(Token.OpenBraceTokenType, true);

                            loopf: while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
                            {
                                innerStatement = matchStatement(false, namedFunctionExpressions);
                                if (inCompileConstantLocal)
                                {
                                    if (!add) elseStatement.bodyStatements.push(innerStatement);
                                }
                                else elseStatement.bodyStatements.push(innerStatement);
                                if (!openBraceTokenType) break loopf;
                            }
                            if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                            statement.elseStatement = elseStatement;
                        }
                        if (inCompileConstantLocal) inCompileConstant = false;
                        break;
                    case Token.WhileTokenType:
                        statement =  Construct.getNewWhileStatement();
                        match(Token.WhileTokenType);
                        match(Token.OpenParenTokenType);
                        statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
                        match(Token.ClosedParenTokenType);
                        openBraceTokenType = match(Token.OpenBraceTokenType, true);

                        loopg: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                        {
                            statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                            if (!openBraceTokenType) break loopg;
                        }
                        if (openBraceTokenType) match(Token.ClosedBraceTokenType);
                        break;
                    case Token.DoTokenType:
                        statement =  Construct.getNewDoWhileStatement();
                        match(Token.DoTokenType);
                        openBraceTokenType = match(Token.OpenBraceTokenType, true);

                        looph: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                        {
                            statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                            if (!openBraceTokenType) break looph;
                        }
                        if (openBraceTokenType) match(Token.ClosedBraceTokenType);
                        match(Token.WhileTokenType);
                        match(Token.OpenParenTokenType);
                        statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
                        match(Token.ClosedParenTokenType);
                        break;
                    case Token.ForTokenType:
                        match(Token.ForTokenType);
                        if (peek(1).type == Token.EachTokenType)
                        {
                            match(Token.EachTokenType);
                            statement =  Construct.getNewForEachStatement();
                            match(Token.OpenParenTokenType);
                            statement.variableStatement = matchStatement(false, namedFunctionExpressions, true);
                            match(Token.InTokenType);
                            statement.arrayExpression = matchExpression(false, namedFunctionExpressions);
                            match(Token.ClosedParenTokenType);
                            openBraceTokenType = match(Token.OpenBraceTokenType, true);

                            loopi: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                            {
                                statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                                if (!openBraceTokenType) break loopi;
                            }
                            if (openBraceTokenType) match(Token.ClosedBraceTokenType);
                            break;
                        }
                        match(Token.OpenParenTokenType);
                        var ahead:* = 1;
                        var openParens:* = 1;
                        var closedParens:* = 0;
                        var inTokenFound:* = false;
                        while (innerToken = peek(ahead))
                        {
                            if (innerToken.type == Token.OpenParenTokenType) openParens++;
                            if (innerToken.type == Token.ClosedParenTokenType) closedParens++;
                            if (innerToken.type == Token.InTokenType) inTokenFound = true;

                            if (openParens == closedParens || inTokenFound) break;

                            ahead++;
                        }
                        if (inTokenFound)
                        {
                            statement =  Construct.getNewForInStatement();
                            statement.variableStatement = matchStatement(false, namedFunctionExpressions, true);
                            match(Token.InTokenType);
                            statement.objectExpression = matchExpression(false, namedFunctionExpressions);
                            match(Token.ClosedParenTokenType);
                        }
                        else
                        {
                            statement =  Construct.getNewForStatement();
                            var eosTokenType:* = match(Token.EOSTokenType, 1);
                            if (!eosTokenType)
                            {
                                statement.variableStatement = matchStatement(true, namedFunctionExpressions);
                                match(Token.EOSTokenType);
                            }
                            eosTokenType = match(Token.EOSTokenType, 1);
                            if (!eosTokenType)
                            {
                                statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
                                match(Token.EOSTokenType);
                            }
                            var closedParenTokenType:* = match(Token.ClosedParenTokenType, 1);
                            if (!closedParenTokenType)
                            {
                                statement.afterthoughtExpression = matchExpression(false, namedFunctionExpressions);
                                match(Token.ClosedParenTokenType);
                            }
                        }

                        openBraceTokenType = match(Token.OpenBraceTokenType, true);
                        loop2f: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                        {
                            statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                            if (!openBraceTokenType) break loop2f;
                        }
                        if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                        break;
                    case Token.BreakTokenType:
                        statement =  Construct.getNewBreakStatement();
                        statement.token = match(Token.BreakTokenType);
                        statement.identifierToken = match(Token.IdentifierTokenType, true);
                        break
                    case Token.ContinueTokenType:
                        statement =  Construct.getNewContinueStatement();
                        statement.token = match(Token.ContinueTokenType);
                        statement.identifierToken = match(Token.IdentifierTokenType, true);
                        break;
                    case Token.ThrowTokenType:
                        statement =  Construct.getNewThrowStatement();
                        statement.token = match(Token.ThrowTokenType);
                        statement.expression = matchExpression(false, namedFunctionExpressions);
                        break;
                    case Token.UseTokenType:
                        statement =  Construct.getNewUseStatement();
                        statement.useToken = match(Token.UseTokenType);
                        match(Token.NamespaceKeywordTokenType);
                        statement.namespaceIdentifierToken = match(Token.IdentifierTokenType);
                        break;
                    case Token.TryTokenType:
                        match(Token.TryTokenType);
                        statement =  Construct.getNewTryStatement();
                        openBraceTokenType = match(Token.OpenBraceTokenType, true);

                        loop2g: while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
                        {
                            statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                            if (!openBraceTokenType) break loop2g;
                        }
                        if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                        while (match(Token.CatchTokenType, true))
                        {
                            var catchStatement:* =  Construct.getNewCatchStatement();
                            match(Token.OpenParenTokenType);
                            catchStatement.identifierToken = match(Token.IdentifierTokenType);
                            if (match(Token.ColonTokenType, true)) catchStatement.typeConstruct = matchTypeConstruct();
                            else
                            {
                                catchStatement.typeConstruct =  Construct.getNewTypeConstruct();
                                catchStatement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                            }
                            match(Token.ClosedParenTokenType);
                            openBraceTokenType = match(Token.OpenBraceTokenType, true);
                            loopt: while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
                            {
                                catchStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                                if (!openBraceTokenType) break loopt;
                            }
                            if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                            statement.catchStatements.push(catchStatement);
                        }
                        while (match(Token.FinallyTokenType, true))
                        {
                            var finallyStatement:* =  Construct.getNewFinallyStatement();
                            openBraceTokenType = match(Token.OpenBraceTokenType, true);

                            loopx: while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
                            {
                                finallyStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                                if (!openBraceTokenType) break loopx;
                            }
                            if (openBraceTokenType) match(Token.ClosedBraceTokenType);

                            statement.finallyStatement = finallyStatement;
                        }
                        break;
                    case Token.VarTokenType:
                    case Token.ConstTokenType:
                        statement =  Construct.getNewVarStatement();
                        if (match(Token.VarTokenType, true)) {}
                        else match(Token.ConstTokenType, true);
                        statement.identifierToken = match(Token.IdentifierTokenType);
                        if (match(Token.ColonTokenType, true)) statement.typeConstruct = matchTypeConstruct();
                        else
                        {
                            statement.typeConstruct =  Construct.getNewTypeConstruct();
                            statement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                        }
                        if (match(Token.AssignmentTokenType, true)) statement.valueExpression = matchExpression(true, namedFunctionExpressions);
                        while(match(Token.CommaTokenType, true))
                        {
                            var innerVarStatement:* =  Construct.getNewVarStatement();
                            innerVarStatement.identifierToken = match(Token.IdentifierTokenType);
                            if (match(Token.ColonTokenType, true)) innerVarStatement.typeConstruct = matchTypeConstruct();
                            else
                            {
                                innerVarStatement.typeConstruct =  Construct.getNewTypeConstruct();
                                innerVarStatement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                            }
                            if (match(Token.AssignmentTokenType, true)) innerVarStatement.valueExpression = matchExpression(true, namedFunctionExpressions);

                            statement.innerVarStatements.push(innerVarStatement);
                        }
                        break;
                    case Token.SwitchTokenType:
                        statement =  Construct.getNewSwitchStatement();
                        match(Token.SwitchTokenType);
                        match(Token.OpenParenTokenType);
                        statement.valueExpression = matchExpression(false, namedFunctionExpressions);
                        match(Token.ClosedParenTokenType);
                        match(Token.OpenBraceTokenType, true);

                        while ((innerToken = peek(1)) && (innerToken.type == Token.CaseTokenType || innerToken.type == Token.DefaultTokenType))
                        {
                            var caseStatement:* =  Construct.getNewCaseStatement();
                            if (innerToken.type == Token.CaseTokenType)
                            {
                                match(Token.CaseTokenType);
                                caseStatement.valueExpression = matchExpression(false, namedFunctionExpressions);
                            }
                            if (innerToken.type == Token.DefaultTokenType) caseStatement.defaultToken = match(Token.DefaultTokenType);
                            match(Token.ColonTokenType);
                            var openFound:* = match(Token.OpenBraceTokenType, true);

                            while ((innerToken = peek(1)) && (innerToken.type != Token.CaseTokenType && innerToken.type != Token.DefaultTokenType && innerToken.type != Token.ClosedBraceTokenType))
                            {
                                caseStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
                            }

                            if (openFound) match(Token.ClosedBraceTokenType);

                            statement.caseStatements.push(caseStatement);
                        }
                        match(Token.ClosedBraceTokenType);
                        break;
                    default:
                        if (peek(1).type == Token.IdentifierTokenType && (peek(2) && peek(2).type == Token.ColonTokenType))
                        {
                            statement =  Construct.getNewLabelStatement();
                            statement.identifierToken = match(Token.IdentifierTokenType);
                            match(Token.ColonTokenType);
                            break;
                        }
                        statement = matchExpression(false, namedFunctionExpressions, false, false, dontReadIn);
                }
                if (!dontmatchEOS) match(Token.EOSTokenType, true, true);

                return statement;
            }

            function matchExpression(ignoreCommas:Boolean=false, namedFunctionExpressions:*=null, operand:*=null, optional:Boolean=false, dontReadIn:Boolean=false):*
            {
                var expression:* = null;
                var expressions:* = [];
                var ternaryTokens:* = 0;
                var token:*;
                var construct:*;
                var regExpString:*;
                var prefixExpression:*;
                var binaryExpression:*;
                var binaryExpressionParent:*;
                loopy: while (token = peek(1))
                {
                    switch (token.type)
                    {
                        case Token.OpenParenTokenType:
                            match(Token.OpenParenTokenType);
                            expression =  Construct.getNewParenExpression();
                            expression.expression = matchExpression(false, namedFunctionExpressions);
                            match(Token.ClosedParenTokenType);
                            if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType || peek(1).type == Token.OpenParenTokenType))
                            {
                                construct =  Construct.getNewParenConstruct();
                                construct.expression = expression;
                                expression = matchPropertyExpression(construct);
                            }
                            break;
                        case Token.NumberTokenType:
                            expression =  Construct.getNewNumberExpression();
                            expression.numberToken = match(Token.NumberTokenType);
                            break;
                        case Token.StringTokenType:
                            expression =  Construct.getNewStringExpression();
                            expression.stringToken = match(Token.StringTokenType);
                            while (token = match(Token.StringChunkTokenType, true)) expression.stringChunkTokens.push(token);
                            expression.stringEndToken = match(Token.StringEndTokenType);

                            if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType || peek(1).type == Token.OpenParenTokenType))
                            {
                                construct =  Construct.getNewParenConstruct();
                                construct.expression = expression;
                                expression = matchPropertyExpression(construct);
                            }
                            break;
                        case Token.ReturnTokenType:
                            expression =  Construct.getNewReturnExpression();
                            match(Token.ReturnTokenType);
                            if (peek(1).type != Token.ClosedBraceTokenType && peek(1).type != Token.EOSTokenType) expression.expression = matchExpression(false, namedFunctionExpressions);
                            break;
                        case Token.DeleteTokenType:
                            expression =  Construct.getNewDeleteExpression();
                            match(Token.DeleteTokenType);
                            expression.expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
                            break;
                        case Token.FunctionTokenType:
                            expression =  Construct.getNewFunctionExpression();
                            match(Token.FunctionTokenType);
                            expression.identifierToken = match(Token.IdentifierTokenType, true);
                            if (expression.identifierToken && namedFunctionExpressions) namedFunctionExpressions.push(expression);

                            match(Token.OpenParenTokenType);
                            while (!match(Token.ClosedParenTokenType, true))
                            {
                                expression.parameterConstructs.push(matchParameterConstruct());
                                match(Token.CommaTokenType, true);
                            }
                            if (match(Token.ColonTokenType, true)) expression.typeConstruct = matchTypeConstruct();
                            else
                            {
                                expression.typeConstruct =  Construct.getNewTypeConstruct();
                                expression.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
                            }

                            match(Token.OpenBraceTokenType);
                            while (!match(Token.ClosedBraceTokenType, true)) expression.bodyStatements.push(matchStatement(false, expression.namedFunctionExpressions));
                            break;
                        case Token.OpenBraceTokenType:
                            expression =  Construct.getNewObjectExpression();
                            match(Token.OpenBraceTokenType);
                            while (!match(Token.ClosedBraceTokenType, true))
                            {
                                var objectPropertyConstruct:* =  Construct.getNewObjectPropertyConstruct();
                                objectPropertyConstruct.expression = matchExpression(false, namedFunctionExpressions);
                                match(Token.ColonTokenType);
                                objectPropertyConstruct.valueExpression = matchExpression(true, namedFunctionExpressions);
                                expression.objectPropertyConstructs.push(objectPropertyConstruct);
                                match(Token.CommaTokenType, true);
                            }
                            if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType)) expression = matchPropertyExpression( Construct.getNewObjectConstruct(expression));
                            break;
                        case Token.OpenBracketTokenType:
                            expression =  Construct.getNewArrayExpression();
                            match(Token.OpenBracketTokenType);
                            while (!match(Token.ClosedBracketTokenType, true))
                            {
                                expression.valueExpressions.push(matchExpression(true, namedFunctionExpressions));
                                match(Token.CommaTokenType, true);
                            }

                            if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType)) expression = matchPropertyExpression( Construct.getNewArrayConstruct(expression));
                            break;
                        case Token.BooleanTokenType:
                            expression =  Construct.getNewBooleanExpression();
                            expression.booleanToken = match(Token.BooleanTokenType);
                            break;
                        case Token.NaNTokenType:
                            expression =  Construct.getNewExpression(match(Token.NaNTokenType));
                            break;
                        case Token.UndefinedTokenType:
                            expression =  Construct.getNewExpression(match(Token.UndefinedTokenType));
                            break;
                        case Token.ThisTokenType:
                            expression = matchPropertyExpression();
                            break;
                        case Token.NullTokenType:
                            expression =  Construct.getNewExpression(match(Token.NullTokenType));
                            break;
                        case Token.AddTokenType:
                            expression =  Construct.getNewExpression(match(Token.AddTokenType), matchExpression(true, namedFunctionExpressions, true));
                            break;
                        case Token.SubTokenType:
                            expression =  Construct.getNewExpression(match(Token.SubTokenType), matchExpression(true, namedFunctionExpressions, true));
                            break;
                        case Token.XMLOpenArrowTokenType:  //translate it to a string since that's all we need
                            match(Token.XMLOpenArrowTokenType);
                            var isXMLList:* = peek(1).type == Token.XMLClosedArrowTokenType;
                            var openTags:* = 1;
                            var xmlString:* = '<';

                            if (isXMLList)
                            {
                                expression =  Construct.getNewXMLListExpression();
                                match(Token.XMLClosedArrowTokenType);
                                match(Token.XMLOpenArrowTokenType);
                            }
                            else expression =  Construct.getNewXMLExpression();

                            var inNode:* = true;
                            while ((openTags || inNode || isXMLList) && (token = next(1)))
                            {
                                if (isXMLList)
                                {
                                    if (token.type == Token.XMLOpenArrowTokenType && peek(1) && peek(1).type == Token.XMLForwardSlashTokenType && peek(2) && peek(2).type == Token.XMLClosedArrowTokenType)
                                    {
                                        match(Token.XMLForwardSlashTokenType);
                                        match(Token.XMLClosedArrowTokenType);
                                        break;
                                    }
                                }
                                else
                                {
                                    if (token.type == Token.XMLOpenArrowTokenType) inNode = true;
                                    if (token.type == Token.XMLOpenArrowTokenType && peek(1) && peek(1).type == Token.XMLForwardSlashTokenType) openTags--;
                                    else if (token.type == Token.XMLOpenArrowTokenType) openTags++;
                                    if (token.type == Token.XMLForwardSlashTokenType && peek(1) && peek(1).type == Token.XMLClosedArrowTokenType) openTags--;
                                    if (token.type == Token.XMLClosedArrowTokenType) inNode = false;
                                }

                                if (token.data == "'") token.data = "\\'";
                                if (token.type == Token.NewLineTokenType) xmlString += '\\' + token.data;
                                else xmlString += token.data;
                            }

                            expression.string = xmlString;
                            break
                        case Token.RegExpTokenType:
                            expression =  Construct.getNewRegExpression();
                            regExpString = match(Token.RegExpTokenType).data;

                            while ((token = peek(1, 1)) && token.type == Token.SpecialUFOTokenType)
                            {
                                token = next();
                                regExpString += token.data;
                            }

                            expression.string = regExpString;
                            break;
                        case Token.DivTokenType: //should be able to deprecate this now that we have a RegExpTokenType --leaving for now just in-case...
                            expression =  Construct.getNewRegExpression();
                            regExpString = match(Token.DivTokenType).data;
                            while (token = next(2))
                            {
                                regExpString += token.data;
                                if (regExpString.charAt(regExpString.length - 1) == '/' && regExpString.charAt(regExpString.length - 2) != '\\') break;
                            }
                            while (token = peek(1, 1))
                            {
                                if (token.type == Token.NewLineTokenType || token.type == Token.TabTokenType || token.type == Token.SpaceTokenType || token.type == Token.EOSTokenType || token.type == Token.CommaTokenType) break;

                                token = next();
                                regExpString += token.data;
                            }
                            expression.string = regExpString;
                            break;
                        case Token.IncrementTokenType:
                            expression =  Construct.getNewPrefixExpression();
                            expression.incrementToken = match(Token.IncrementTokenType);
                            expression.expression = matchExpression(false, namedFunctionExpressions);

                            if (expression.expression.constructor != Construct.BinaryExpression) break;

                            prefixExpression = expression;
                            binaryExpression = expression = expression.expression;
                            binaryExpressionParent = binaryExpression;
                            while (binaryExpression.constructor == Construct.BinaryExpression)
                            {
                                binaryExpressionParent = binaryExpression;
                                binaryExpression = binaryExpression.leftExpression;
                            }

                            while (binaryExpression.constructor == Construct.ParenExpression)
                            {
                                binaryExpressionParent = binaryExpression;
                                binaryExpression = binaryExpression.expression;
                            }

                            prefixExpression.expression = binaryExpression;
                            if (binaryExpressionParent.constructor == Construct.ParenExpression) binaryExpressionParent.expression = prefixExpression;
                            else binaryExpressionParent.leftExpression = prefixExpression;

                            break;
                        case Token.DecrementTokenType:
                            expression =  Construct.getNewPrefixExpression();
                            expression.decrementToken = match(Token.DecrementTokenType);
                            expression.expression = matchExpression(false, namedFunctionExpressions);

                            if (expression.expression.constructor != Construct.BinaryExpression) break;

                            prefixExpression = expression;
                            binaryExpression = expression = expression.expression;
                            binaryExpressionParent = binaryExpression;
                            while (binaryExpression.constructor == Construct.BinaryExpression)
                            {
                                binaryExpressionParent = binaryExpression;
                                binaryExpression = binaryExpression.leftExpression;
                            }

                            while (binaryExpression.constructor == Construct.ParenExpression)
                            {
                                binaryExpressionParent = binaryExpression;
                                binaryExpression = binaryExpression.expression;
                            }

                            prefixExpression.expression = binaryExpression;
                            if (binaryExpressionParent.constructor == Construct.ParenExpression) binaryExpressionParent.expression = prefixExpression;
                            else binaryExpressionParent.leftExpression = prefixExpression;
                            break;
                        case Token.BitwiseNotTokenType:
                            expression =  Construct.getNewExpression(match(Token.BitwiseNotTokenType), matchExpression(false, namedFunctionExpressions, true));
                            break;
                        case Token.NotTokenType:
                            expression =  Construct.getNewExpression(match(Token.NotTokenType), matchExpression(false, namedFunctionExpressions, true));
                            break;
                        case Token.TypeofTokenType:
                            expression =  Construct.getNewExpression(match(Token.TypeofTokenType), matchExpression(false, namedFunctionExpressions, true));
                            break;
                        case Token.SuperTokenType:
                            expression = matchPropertyExpression();
                            break;
                        case Token.NewTokenType:
                            expression =  Construct.getNewNewExpression();
                            match(Token.NewTokenType);
                            if (peek(1).type == Token.RelationalTokenType) //Vector syntax: new <String>[]
                            {
                                next();
                                next();
                                next();
                                expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
                                break;
                            }
                            expression.expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
                            break;
                        case Token.IdentifierTokenType:
                            expression = matchPropertyExpression();
                            expression.root = true;
                            break;
                        case Token.AtTokenType:
                            expression = matchPropertyExpression();
                            break;
                        case Token.VoidTokenType:
                            expression =  Construct.getNewExpression(match(Token.VoidTokenType), matchExpression(false, namedFunctionExpressions, null, true));
                            break;
                        default:
                            if (optional)
                            {
                                expression =  Construct.getNewEmptyExpression();
                                break;
                            }
                            throw error('Unexpected token found10.', token);
                    }

                    token = match(Token.IncrementTokenType, true) || match(Token.DecrementTokenType, true);
                    if (token)
                    {
                        var originalExpression:* = expression;
                        expression =  Construct.getNewPostfixExpression();
                        if (token.type == Token.IncrementTokenType) expression.incrementToken = token;
                        else expression.decrementToken = token;
                        expression.expression = originalExpression;
                    }

                    if (operand) return expression;

                    expressions.push(expression);

                    token = match(Token.AssignmentTokenType, true) || match(Token.AddTokenType, true) || match(Token.AsTokenType, true) || match((dontReadIn) ? Token.SubTokenType : Token.InTokenType, true) || match(Token.SubTokenType, true) || match(Token.MulTokenType, true) || match(Token.DivTokenType, true) || match(Token.ModTokenType, true) || match(Token.TernaryTokenType, true) || match(Token.IsTokenType, true) || match(Token.InstanceofTokenType, true) || match(Token.AndWithAssignmentTokenType, true) || match(Token.OrWithAssignmentTokenType, true) || match(Token.AndTokenType, true) || match(Token.OrTokenType, true) || match(Token.EqualityTokenType, true) || match(Token.RelationalTokenType, true) || match(Token.AddWithAssignmentTokenType, true) || match(Token.DivWithAssignmentTokenType, true) || match(Token.ModWithAssignmentTokenType, true) || match(Token.MulWithAssignmentTokenType, true) || match(Token.SubWithAssignmentTokenType, true) || match(Token.BitwiseLeftShiftAssignmentTokenType, true) || match(Token.BitwiseRightShiftAssignmentTokenType, true) || match(Token.BitwiseUnsignedRightShiftAssignmentTokenType, true) || match(Token.BitwiseLeftShiftTokenType, true) || match(Token.BitwiseRightShiftTokenType, true) || match(Token.BitwiseUnsignedRightShiftTokenType, true) || match(Token.BitwiseAndAssignmentTokenType, true) || match(Token.BitwiseOrAssignmentTokenType, true) || match(Token.BitwiseXorAssignmentTokenType, true) || match(Token.BitwiseAndTokenType, true) || match(Token.BitwiseOrTokenType, true) || match(Token.BitwiseXorTokenType, true);

                    if (!ignoreCommas && !token) token = match(Token.CommaTokenType, true);
                    if (token && token.type == Token.TernaryTokenType) ternaryTokens++;
                    else if (!token && ternaryTokens)
                    {
                        token = match(Token.ColonTokenType);
                        ternaryTokens--;
                    }
                    if (!token) break loopy;

                    expressions.push(token);
                }

                return combineExpressions(expressions);

                function getBinaryTernaryOperatorPrecedence(token:*):*
                {
                    switch (token.type)
                    {
                        case Token.ColonTokenType:
                            return -1;
                        case Token.CommaTokenType:
                            return 1;
                        case Token.AssignmentTokenType:
                        case Token.MulWithAssignmentTokenType:
                        case Token.DivWithAssignmentTokenType:
                        case Token.ModWithAssignmentTokenType:
                        case Token.AddWithAssignmentTokenType:
                        case Token.SubWithAssignmentTokenType:
                        case Token.BitwiseLeftShiftAssignmentTokenType:
                        case Token.BitwiseRightShiftAssignmentTokenType:
                        case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
                        case Token.BitwiseAndAssignmentTokenType:
                        case Token.BitwiseXorAssignmentTokenType:
                        case Token.BitwiseOrAssignmentTokenType:
                        case Token.AndWithAssignmentTokenType:
                        case Token.OrWithAssignmentTokenType:
                            return 2;
                        case Token.TernaryTokenType:
                            return 3;
                        case Token.OrTokenType:
                            return 4;
                        case Token.AndTokenType:
                            return 5;
                        case Token.BitwiseOrTokenType:
                            return 6;
                        case Token.BitwiseXorTokenType:
                            return 7;
                        case Token.BitwiseAndTokenType:
                            return 8;
                        case Token.EqualityTokenType:
                            return 9;
                        case Token.RelationalTokenType:
                        case Token.AsTokenType:
                        case Token.InTokenType:
                        case Token.InstanceofTokenType:
                        case Token.IsTokenType:
                            return 10;
                        case Token.BitwiseLeftShiftTokenType:
                        case Token.BitwiseRightShiftTokenType:
                        case Token.BitwiseUnsignedRightShiftTokenType:
                            return 11;
                        case Token.AddTokenType:
                        case Token.SubTokenType:
                            return 12;
                        case Token.MulTokenType:
                        case Token.DivTokenType:
                        case Token.ModTokenType:
                            return 13;
                        default:
                            throw new Error('unknown binary/ternary operator: ' + token.type.name);
                    }
                }

                function combineExpressions(expressions:*):*
                {
                    var currentOperatorPrecedence:* = 13;
                    var i:* = -1;
                    var expression:*;
                    var begin:*;
                    while (expressions.length > 1 && currentOperatorPrecedence)
                    {
                        if (i >= expressions.length - 1)
                        {
                            i = -1;
                            currentOperatorPrecedence--;
                        }
                        i++;

                        if (i % 2 == 0) continue;

                        var token:* = expressions[i];
                        if (getBinaryTernaryOperatorPrecedence(token) != currentOperatorPrecedence) continue;

                        if (token.type == Token.TernaryTokenType)
                        {
                            expression =  Construct.getNewTernaryExpression();
                            expression.conditionExpression = expressions[i - 1];

                            var index:* = i + 1;
                            var ternaryTokens:* = 1;
                            var colonTokens:* = 0;
                            var innerExpressions:* = [];
                            while (ternaryTokens != colonTokens && index < expressions.length - 1)
                            {
                                innerExpressions.push(expressions[index]);

                                if (index % 2 == 0)
                                {
                                    index++;
                                    continue;
                                }

                                if (expressions[index].type == Token.TernaryTokenType) ternaryTokens++;
                                else if (expressions[index].type == Token.ColonTokenType) colonTokens++;
                                index++;
                            }

                            expression.trueExpression = combineExpressions(innerExpressions.slice(0, innerExpressions.length - 1));
                            expression.falseExpression = combineExpressions(expressions.slice(index));

                            begin = expressions.slice(0, i - 1);
                            expressions = begin.concat([expression]);
                        }
                        else
                        {
                            expression =  Construct.getNewBinaryExpression();
                            expression.token = token;
                            expression.leftExpression = expressions[i - 1];
                            expression.rightExpression = expressions[i + 1];

                            begin = expressions.slice(0, i - 1);
                            var end:* = expressions.slice(i + 2);
                            expressions = begin.concat([expression], end);
                        }

                        i = -1;
                    }

                    return expressions[0];
                }
            }

            function match(type:*, optional:Boolean=false, greedy:Boolean=false):*
            {
                var token:* = (optional) ? peek(1) : next();
                if (!token && !optional) throw error('Expected token type: ' + type.name + '. No token found.', null);
                if (!token) return false;
                if (token.type != type && !optional) throw error('Expected token type: ' + type + '. Got', token);
                if (token.type != type) return false;
                if (optional) token = next();
                var gtoken:* = (greedy) ? match(type, true, greedy) : false;
                return (gtoken) ? gtoken : token;
            }

            function next(includeLevel:Boolean=false, keywordStrictMode:Boolean=false):*
            {
                if (!includeLevel) includeLevel = 0;

                while (index < tokens.length - 1)
                {
                    var token:* = tokens[++index];
                    switch (token.type)
                    {
                        case Token.CommentTokenType:
                        case Token.CommentChunkTokenType:
                        case Token.MultiLineCommentTokenType:
                        case Token.MultiLineCommentChunkTokenType:
                        case Token.MultiLineCommentEndTokenType:
                            if (includeLevel == 1 || includeLevel == 0) break;
                        case Token.NewLineTokenType:
                        case Token.TabTokenType:
                        case Token.SpaceTokenType:
                            if (includeLevel == 0) break;
                        default:
                            if (keywordStrictMode) return token;

                            if (token.type == Token.StaticTokenType) token = Token.getNewToken(Token.IdentifierTokenType, 'static');

                            return token;
                    }
                }

                return null;
            }

            function peek(ahead:*, includeLevel:Boolean=false, keywordStrictMode:Boolean=false):*
            {
                if (!includeLevel) includeLevel = 0;
                var i:* = index;
                while (true)
                {
                    if (ahead > 0 && i >= tokens.length - 1) break;
                    if (ahead < 0 && i < 1) break;
                    var token:* = (ahead > 0) ? tokens[++i] : tokens[--i];

                    switch (token.type)
                    {
                        case Token.CommentTokenType:
                        case Token.CommentChunkTokenType:
                        case Token.MultiLineCommentTokenType:
                        case Token.MultiLineCommentChunkTokenType:
                        case Token.MultiLineCommentEndTokenType:
                            break;
                        case Token.TabTokenType:
                        case Token.SpaceTokenType:
                        case Token.NewLineTokenType:
                            if (includeLevel != 1) break;
                        default:
                            (ahead > 0) ? ahead-- : ahead++;
                            if (!ahead)
                            {
                                if (keywordStrictMode) return token;

                                if (token.type == Token.StaticTokenType) token = Token.getNewToken(Token.IdentifierTokenType, 'static');

                                return token;
                            }
                    }
                }

                return null;
            }

            function error(string:*, token:*):*
            {
                var i:* = (index - 25) < 25 ? 0 : index - 25;
                for (i; i <= index; i++) trace(tokens[i].line + ' : ' + tokens[i].position + ' : ' + tokens[i].type + ' => ' + tokens[i].data);

                if (token) return new Error(string + ' token type ' + token.type +  ' found on line ' + token.line + ', at position ' + token.position);
                else return new Error(string);
            }


            if (statementImportConstructs.length) rootConstruct.packageConstruct.importConstructs = rootConstruct.packageConstruct.importConstructs.concat(statementImportConstructs);

            return rootConstruct;
        }
    }
}
