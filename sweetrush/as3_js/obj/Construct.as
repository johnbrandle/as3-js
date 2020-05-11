/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.as3_js.obj
{
    public class Construct
    {
        public static const Expression:String = 'Expression';
        public static function getNewExpression(token:*, expression:*=null):*
        {
            return {constructor:Expression, token:token, expression:expression};
        }

        public static const EmptyExpression:String = 'EmptyExpression';
        public static function getNewEmptyExpression():*
        {
            return {constructor:EmptyExpression};
        }

        public static const BinaryExpression:String = 'BinaryExpression';
        public static function getNewBinaryExpression():*
        {
            return {constructor:BinaryExpression, token:null, leftExpression:null, rightExpression:null};
        }

        public static const ObjectExpression:String = 'ObjectExpression';
        public static function getNewObjectExpression():*
        {
            return {constructor:ObjectExpression, objectPropertyConstructs:[]};
        }

        public static const ArrayExpression:String = 'ArrayExpression';
        public static function getNewArrayExpression():*
        {
            return {constructor:ArrayExpression, valueExpressions:[]};
        }

        public static const NewExpression:String = 'NewExpression';
        public static function getNewNewExpression():*
        {
            return {constructor:NewExpression, expression:null};
        }

        public static const PropertyExpression:String = 'PropertyExpression';
        public static function getNewPropertyExpression():*
        {
            return {constructor:PropertyExpression, construct:null, nextPropertyExpression:null, root:false};
        }

        public static const IdentifierConstruct:String = 'IdentifierConstruct';
        public static function getNewIdentifierConstruct():*
        {
            return {constructor:IdentifierConstruct, identifierToken:null,
                identifer:null}; //post analysis
        }

        public static const NamespaceQualifierConstruct:String = 'NamespaceQualifierConstruct';
        public static function getNewNamespaceQualifierConstruct():*
        {
            return {constructor:NamespaceQualifierConstruct, namespaceQualifierToken:null, identifierToken:null, namespaceIdentifierToken:null,
                namespaceIdentifier:null, identifer:null}; //post analysis
        }

        public static const AtIdentifierConstruct:String = 'AtIdentifierConstruct';
        public static function getNewAtIdentifierConstruct():*
        {
            return {constructor:AtIdentifierConstruct};
        }

        public static const DotConstruct:String = 'DotConstruct';
        public static function getNewDotConstruct():*
        {
            return {constructor:DotConstruct, identifierToken:null};
        }

        public static const SuperConstruct:String = 'SuperConstruct';
        public static function getNewSuperConstruct():*
        {
            return {constructor:SuperConstruct, superToken:null,
                identifer:null}; //post analysis
        }

        public static const ThisConstruct:String = 'ThisConstruct';
        public static function getNewThisConstruct():*
        {
            return {constructor:ThisConstruct, thisToken:null,
                identifer:null}; //post analysis
        }

        public static const E4XSearchConstruct:String = 'E4XSearchConstruct';
        public static function getNewE4XSearchConstruct():*
        {
            return {constructor:E4XSearchConstruct, expression:null};
        }

        public static const ArrayAccessorConstruct:String = 'ArrayAccessorConstruct';
        public static function getNewArrayAccessorConstruct():*
        {
            return {constructor:ArrayAccessorConstruct, expression:null};
        }

        public static const VectorConstruct:String = 'VectorConstruct';
        public static function getNewVectorConstruct():*
        {
            return {constructor:VectorConstruct, nameConstruct:null};
        }

        public static const TypeConstruct:String = 'TypeConstruct';
        public static function getNewTypeConstruct():*
        {
            return {constructor:TypeConstruct, mulToken:null, voidToken:null, nameConstruct:null, vectorNameConstruct:null,
                identifer:null}; //post analysis
        }

        public static const ParenConstruct:String = 'ParenConstruct';
        public static function getNewParenConstruct():*
        {
            return {constructor:ParenConstruct, expression:null};
        }

        public static const ObjectConstruct:String = 'ObjectConstruct';
        public static function getNewObjectConstruct(expression:*):*
        {
            return {constructor:ObjectConstruct, expression:expression};
        }

        public static const ArrayConstruct:String = 'ArrayConstruct';
        public static function getNewArrayConstruct(expression:*):*
        {
            return {constructor:ArrayConstruct, expression:expression};
        }

        public static const TernaryExpression:String = 'TernaryExpression';
        public static function getNewTernaryExpression():*
        {
            return {constructor:TernaryExpression, conditionExpression:null, trueExpression:null, falseExpression:null};
        }

        public static const RegExpression:String = 'RegExpression';
        public static function getNewRegExpression():*
        {
            return {constructor:RegExpression, string:null};
        }

        public static const ParenExpression:String = 'ParenExpression';
        public static function getNewParenExpression():*
        {
            return {constructor:ParenExpression, expression:null};
        }

        public static const BooleanExpression:String = 'BooleanExpression';
        public static function getNewBooleanExpression():*
        {
            return {constructor:BooleanExpression, booleanToken:null};
        }

        public static const NumberExpression:String = 'NumberExpression';
        public static function getNewNumberExpression():*
        {
            return {constructor:NumberExpression, numberToken:null};
        }

        public static const PrefixExpression:String = 'PrefixExpression';
        public static function getNewPrefixExpression():*
        {
            return {constructor:PrefixExpression, incrementToken:null, decrementToken:null, expression:null};
        }

        public static const PostfixExpression:String = 'PostfixExpression';
        public static function getNewPostfixExpression():*
        {
            return {constructor:PostfixExpression, incrementToken:null, decrementToken:null, expression:null};
        }

        public static const StringExpression:String = 'StringExpression';
        public static function getNewStringExpression():*
        {
            return {constructor:StringExpression, stringToken:null, stringChunkTokens:[], stringEndToken:null};
        }

        public static const FunctionExpression:String = 'FunctionExpression';
        public static function getNewFunctionExpression():*
        {
            return {constructor:FunctionExpression, identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], namedFunctionExpressions:[],
                identifer:null, type:null}; //post analysis
        }

        public static const FunctionCallConstruct:String = 'FunctionCallConstruct';
        public static function getNewFunctionCallConstruct():*
        {
            return {constructor:FunctionCallConstruct, argumentExpressions:[]};
        }

        public static const RootConstruct:String = 'RootConstruct';
        public static function getNewRootConstruct():*
        {
            return {constructor:RootConstruct, classConstructs:[], interfaceConstructs:[], methodConstructs:[], propertyConstructs:[], importConstructs:[], packageConstruct:null,
                namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[]}; //post analysis
        }

        public static const PackageConstruct:String = 'PackageConstruct';
        public static function getNewPackageConstruct():*
        {
            return {constructor:PackageConstruct, nameConstruct:null, classConstruct:null, importConstructs:[], interfaceConstruct:null, methodConstruct:null, propertyConstruct:null, rootConstruct:null, useConstructs:[]};
        }

        public static const ClassConstruct:String = 'ClassConstruct';
        public static function getNewClassConstruct():*
        {
            return {constructor:ClassConstruct, identifierToken:null, extendsNameConstruct:null, importConstructs:[], initializerStatements:[], implementsNameConstructs:[], metaDataConstructs:[], constructorMethodConstruct:null, propertyConstructs:[], methodConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null, dynamicToken:null, useConstructs:[], UNIMPLEMENTEDToken:null,
                namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[], packageName:null, identifer:null, type:null}; //post analysis
        }

        public static const InterfaceConstruct:String = 'InterfaceConstruct';
        public static function getNewInterfaceConstruct():*
        {
            return {constructor:InterfaceConstruct, identifierToken:null, extendsNameConstructs:[], methodConstructs:[], propertyConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null,
                packageName:null, identifer:null, type:null}; //post analysis
        }

        public static const NameConstruct:String = 'NameConstruct';
        public static function getNewNameConstruct():*
        {
            return {constructor:NameConstruct, identifierTokens:[]};
        }

        public static function nameConstructToString(nameConstruct):*
        {
            if (nameConstruct.identifierTokens.length == 1) return nameConstruct.identifierTokens[0].data;

            var data:* = [];
            for (var i:* = 0; i < nameConstruct.identifierTokens.length; i++) data.push(nameConstruct.identifierTokens[i].data);
            return data.join('.');
        }

        public static const ImportConstruct:String = 'ImportConstruct';
        public static function getNewImportConstruct():*
        {
            return {constructor:ImportConstruct, nameConstruct:null, mulToken:null};
        }

        public static const UseConstruct:String = 'UseConstruct';
        public static function getNewUseConstruct():*
        {
            return {constructor:UseConstruct, useToken:null, namespaceIdentifierToken:null};
        }

        public static const UseStatement:String = 'UseStatement';
        public static function getNewUseStatement():*
        {
            return {constructor:UseStatement, useToken:null, namespaceIdentifierToken:null};
        }

        public static const ForEachStatement:String = 'ForEachStatement';
        public static function getNewForEachStatement():*
        {
            return {constructor:ForEachStatement, variableStatement:null, arrayExpression:null, bodyStatements:[],
                index:null}; //post analysis
        }

        public static const ReturnExpression:String = 'ReturnExpression';
        public static function getNewReturnExpression():*
        {
            return {constructor:ReturnExpression, expression:null,
                type:null, expectedType:null}; //post analysis
        }

        public static const DeleteExpression:String = 'DeleteExpression';
        public static function getNewDeleteExpression():*
        {
            return {constructor:DeleteExpression, expression:null};
        }

        public static const XMLExpression:String = 'XMLExpression';
        public static function getNewXMLExpression():*
        {
            return {constructor:XMLExpression, string:null};
        }

        public static const XMLListExpression:String = 'XMLListExpression';
        public static function getNewXMLListExpression():*
        {
            return {constructor:XMLListExpression, string:null};
        }

        public static const ForStatement:String = 'ForStatement';
        public static function getNewForStatement():*
        {
            return {constructor:ForStatement, variableStatement:null, conditionExpression:null, afterthoughtExpression:null, bodyStatements:[]};
        }

        public static const ForInStatement:String = 'ForInStatement';
        public static function getNewForInStatement():*
        {
            return {constructor:ForInStatement, variableStatement:null, objectExpression:null, bodyStatements:[],
                index:null}; //post analysis
        }

        public static const LabelStatement:String = 'LabelStatement';
        public static function getNewLabelStatement():*
        {
            return {constructor:LabelStatement, identifierToken:null,
                identifer:null}; //post analysis
        }

        public static const WhileStatement:String = 'WhileStatement';
        public static function getNewWhileStatement():*
        {
            return {constructor:WhileStatement, conditionExpression:null, bodyStatements:[]};
        }

        public static const DoWhileStatement:String = 'DoWhileStatement';
        public static function getNewDoWhileStatement():*
        {
            return {constructor:DoWhileStatement, conditionExpression:null, bodyStatements:[]};
        }

        public static const IfStatement:String = 'IfStatement';
        public static function getNewIfStatement():*
        {
            return {constructor:IfStatement, conditionExpression:null, bodyStatements:[], elseIfStatements:[], elseStatement:null};
        }

        public static const ElseIfStatement:String = 'ElseIfStatement';
        public static function getNewElseIfStatement():*
        {
            return {constructor:ElseIfStatement, conditionExpression:null, bodyStatements:[]};
        }

        public static const ElseStatement:String = 'ElseStatement';
        public static function getNewElseStatement():*
        {
            return {constructor:ElseStatement, bodyStatements:[]};
        }

        public static const EmptyStatement:String = 'EmptyStatement';
        public static function getNewEmptyStatement():*
        {
            return {constructor:EmptyStatement, bodyStatements:[]};
        }

        public static const TryStatement:String = 'TryStatement';
        public static function getNewTryStatement():*
        {
            return {constructor:TryStatement, bodyStatements:[], catchStatements:[], finallyStatement:null};
        }

        public static const CatchStatement:String = 'CatchStatement';
        public static function getNewCatchStatement():*
        {
            return {constructor:CatchStatement, identifierToken:null, typeConstruct:null, bodyStatements:[],
                index:null, identifer:null}; //post analysis
        }

        public static const FinallyStatement:String = 'FinallyStatement';
        public static function getNewFinallyStatement():*
        {
            return {constructor:FinallyStatement, bodyStatements:[]};
        }

        public static const BreakStatement:String = 'BreakStatement';
        public static function getNewBreakStatement():*
        {
            return {constructor:BreakStatement, token:null, identifierToken:null,
                identifer:null}; //post analysis
        }

        public static const ContinueStatement:String = 'ContinueStatement';
        public static function getNewContinueStatement():*
        {
            return {constructor:ContinueStatement, token:null, identifierToken:null,
                identifer:null}; //post analysis
        }

        public static const ThrowStatement:String = 'ThrowStatement';
        public static function getNewThrowStatement():*
        {
            return {constructor:ThrowStatement, token:null, expression:null};
        }

        public static const SwitchStatement:String = 'SwitchStatement';
        public static function getNewSwitchStatement():*
        {
            return {constructor:SwitchStatement, valueExpression:null, caseStatements:[]};
        }

        public static const CaseStatement:String = 'CaseStatement';
        public static function getNewCaseStatement():*
        {
            return {constructor:CaseStatement, valueExpression:null, bodyStatements:[], defaultToken:null};
        }

        public static const VarStatement:String = 'VarStatement';
        public static function getNewVarStatement():*
        {
            return {constructor:VarStatement, identifierToken:null, innerVarStatements:[], typeConstruct:null, valueExpression:null,
                identifer:null}; //post analysis
        }

        public static const MethodConstruct:String = 'MethodConstruct';
        public static function getNewMethodConstruct():*
        {
            return {constructor:MethodConstruct, identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], staticToken:null, overrideToken:null, namespaceToken:null, setToken:null, getToken:null, callsSuper:null, isNative:null, isJavaScript:null, javaScriptString:'', namedFunctionExpressions:[], isInternal:null, packageConstruct:null, rootConstruct:null, UNIMPLEMENTEDToken:null,
                identifer:null}; //post analysis
        }

        public static const ObjectPropertyConstruct:String = 'ObjectPropertyConstruct';
        public static function getNewObjectPropertyConstruct():*
        {
            return {constructor:ObjectPropertyConstruct, expression:null, valueExpression:null};
        }

        public static const ParameterConstruct:String = 'ParameterConstruct';
        public static function getNewParameterConstruct():*
        {
            return {constructor:ParameterConstruct, identifierToken:null, typeConstruct:null, valueExpression:null, restToken:null,
                identifer:null}; //post analysis
        }

        public static const PropertyConstruct:String = 'PropertyConstruct';
        public static function getNewPropertyConstruct():*
        {
            return {constructor:PropertyConstruct, identifierToken:null, typeConstruct:null, namespaceToken:null, //flash_proxy
                namespaceValueToken:null, //used when all we have is the value of the namespace, so: http://www.adobe.com/2006/actionscript/flash/proxy
                namespaceKeywordToken:null, //namespace
                staticToken:null, constToken:null, valueExpression:null, isNative:null, isInternal:false, packageConstruct:null, rootConstruct:null,
                identifer:null}; //post analysis
        }

        public static const MetaDataConstruct:String = 'MetaDataConstruct';
        public static function getNewMetaDataConstruct():*
        {
            return {constructor:MetaDataConstruct, tokens:[]};
        }
    }
}
