/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.as3_js.obj
{
	import sweetrush.as3_js.core.Lexer;

	public class Token
    {
        private static var whitespaceCharacters:Object = {'\u0020':true, '\u0009':true, '\u000A':true, '\u000C':true, '\u000D':true};
        private static var identifierStartCharacters:Object = {'_':true, '$':true,
            'a':true, 'b':true, 'c':true, 'd':true, 'e':true, 'f':true, 'g':true, 'h':true, 'i':true, 'j':true, 'k':true, 'l':true, 'm':true, 'n':true, 'o':true, 'p':true, 'q':true, 'r':true, 's':true, 't':true,
            'u':true, 'v':true, 'w':true, 'x':true, 'y':true, 'z':true,
            'A':true, 'B':true, 'C':true, 'D':true, 'E':true, 'F':true, 'G':true, 'H':true, 'I':true, 'J':true, 'K':true, 'L':true, 'M':true, 'N':true, 'O':true, 'P':true, 'Q':true, 'R':true, 'S':true, 'T':true,
            'U':true, 'V':true, 'W':true, 'X':true, 'Y':true, 'Z':true};

        public static const OpenParenTokenType:String = 'OpenParenTokenType';
        public static const ClosedParenTokenType:String = 'ClosedParenTokenType';
        public static const OpenBraceTokenType:String = 'OpenBraceTokenType';
        public static const ClosedBraceTokenType:String = 'ClosedBraceTokenType';
        public static const OpenBracketTokenType:String = 'OpenBracketTokenType';
        public static const ClosedBracketTokenType:String = 'ClosedBracketTokenType';
        public static const EOSTokenType:String = 'EOSTokenType';
        public static const PackageTokenType:String = 'PackageTokenType';
        public static const ImportTokenType:String = 'ImportTokenType';
        public static const ClassTokenType:String = 'ClassTokenType';
        public static const InterfaceTokenType:String = 'InterfaceTokenType';
        public static const NewTokenType:String = 'NewTokenType';
        public static const UseTokenType:String = 'UseTokenType';
        public static const CaseTokenType:String = 'CaseTokenType';
        public static const FunctionTokenType:String = 'FunctionTokenType';
        public static const GetTokenType:String = 'GetTokenType';
        public static const SetTokenType:String = 'SetTokenType';
        public static const RestTokenType:String = 'RestTokenType';
        public static const ExtendsTokenType:String = 'ExtendsTokenType';
        public static const ImplementsTokenType:String = 'ImplementsTokenType';
        public static const CommentTokenType:String = 'CommentTokenType';
        public static const CommentChunkTokenType:String = 'CommentChunkTokenType';
        public static const MultiLineCommentTokenType:String = 'MultiLineCommentTokenType';
        public static const MultiLineCommentChunkTokenType:String = 'MultiLineCommentChunkTokenType';
        public static const MultiLineCommentEndTokenType:String = 'MultiLineCommentEndTokenType';
        public static const OverrideTokenType:String = 'OverrideTokenType';
        public static const StaticTokenType:String = 'StaticTokenType';
        public static const DynamicTokenType:String = 'DynamicTokenType';
        public static const FinalTokenType:String = 'FinalTokenType';
        public static const VarTokenType:String = 'VarTokenType';
        public static const ConstTokenType:String = 'ConstTokenType';
        public static const IdentifierTokenType:String = 'IdentifierTokenType';
        public static const BooleanTokenType:String = 'BooleanTokenType';
        public static const ThisTokenType:String = 'ThisTokenType';
        public static const TypeofTokenType:String = 'TypeofTokenType';
        public static const NullTokenType:String = 'NullTokenType';
        public static const VoidTokenType:String = 'VoidTokenType';
        public static const UndefinedTokenType:String = 'UndefinedTokenType';
        public static const IsTokenType:String = 'IsTokenType';
        public static const NaNTokenType:String = 'NaNTokenType';
        public static const InstanceofTokenType:String = 'InstanceofTokenType';
        public static const ReturnTokenType:String = 'ReturnTokenType';
        public static const SwitchTokenType:String = 'SwitchTokenType';
        public static const SuperTokenType:String = 'SuperTokenType';
        public static const ThrowTokenType:String = 'ThrowTokenType';
        public static const DotDotTokenType:String = 'DotDotTokenType';
        public static const DotTokenType:String = 'DotTokenType';
        public static const NotTokenType:String = 'NotTokenType';
        public static const BitwiseNotTokenType:String = 'BitwiseNotTokenType';
        public static const ColonTokenType:String = 'ColonTokenType';
        public static const CommaTokenType:String = 'CommaTokenType';
        public static const TernaryTokenType:String = 'TernaryTokenType';
        public static const IncrementTokenType:String = 'IncrementTokenType';
        public static const DecrementTokenType:String = 'DecrementTokenType';
        public static const BreakTokenType:String = 'BreakTokenType';
        public static const ContinueTokenType:String = 'ContinueTokenType';
        public static const DefaultTokenType:String = 'DefaultTokenType';
        public static const InTokenType:String = 'InTokenType';
        public static const AsTokenType:String = 'AsTokenType';
        public static const DeleteTokenType:String = 'DeleteTokenType';
        public static const IfTokenType:String = 'IfTokenType';
        public static const ElseTokenType:String = 'ElseTokenType';
        public static const EachTokenType:String = 'EachTokenType';
        public static const ForTokenType:String = 'ForTokenType';
        public static const WhileTokenType:String = 'WhileTokenType';
        public static const DoTokenType:String = 'DoTokenType';
        public static const WithTokenType:String = 'WithTokenType';
        public static const TryTokenType:String = 'TryTokenType';
        public static const CatchTokenType:String = 'CatchTokenType';
        public static const RegExpTokenType:String = 'RegExpTokenType';
        public static const SpecialUFOTokenType:String = 'SpecialUFOTokenType';
        public static const FinallyTokenType:String = 'FinallyTokenType';
        public static const AtTokenType:String = 'AtTokenType';
        public static const BitwiseLeftShiftAssignmentTokenType:String = 'BitwiseLeftShiftAssignmentTokenType';
        public static const BitwiseRightShiftAssignmentTokenType:String = 'BitwiseRightShiftAssignmentTokenType';
        public static const BitwiseUnsignedRightShiftAssignmentTokenType:String = 'BitwiseUnsignedRightShiftAssignmentTokenType';
        public static const BitwiseAndAssignmentTokenType:String = 'BitwiseAndAssignmentTokenType';
        public static const BitwiseOrAssignmentTokenType:String = 'BitwiseOrAssignmentTokenType';
        public static const BitwiseXorAssignmentTokenType:String = 'BitwiseXorAssignmentTokenType';
        public static const AddWithAssignmentTokenType:String = 'AddWithAssignmentTokenType';
        public static const DivWithAssignmentTokenType:String = 'DivWithAssignmentTokenType';
        public static const ModWithAssignmentTokenType:String = 'ModWithAssignmentTokenType';
        public static const MulWithAssignmentTokenType:String = 'MulWithAssignmentTokenType';
        public static const SubWithAssignmentTokenType:String = 'SubWithAssignmentTokenType';
        public static const EqualityTokenType:String = 'EqualityTokenType';
        public static const RelationalTokenType:String = 'RelationalTokenType';
        public static const BitwiseAndTokenType:String = 'BitwiseAndTokenType';
        public static const BitwiseXorTokenType:String = 'BitwiseXorTokenType';
        public static const BitwiseOrTokenType:String = 'BitwiseOrTokenType';
        public static const AndTokenType:String = 'AndTokenType';
        public static const AndWithAssignmentTokenType:String = 'AndWithAssignmentTokenType';
        public static const OrTokenType:String = 'OrTokenType';
        public static const OrWithAssignmentTokenType:String = 'OrWithAssignmentTokenType';
        public static const BitwiseLeftShiftTokenType:String = 'BitwiseLeftShiftTokenType';
        public static const BitwiseRightShiftTokenType:String = 'BitwiseRightShiftTokenType';
        public static const BitwiseUnsignedRightShiftTokenType:String = 'BitwiseUnsignedRightShiftTokenType';
        public static const SubTokenType:String = 'SubTokenType';
        public static const AddTokenType:String = 'AddTokenType';
        public static const DivTokenType:String = 'DivTokenType';
        public static const MulTokenType:String = 'MulTokenType';
        public static const ModTokenType:String = 'ModTokenType';
        public static const AssignmentTokenType:String = 'AssignmentTokenType';
        public static const NamespaceKeywordTokenType:String = 'NamespaceKeywordTokenType';
        public static const XMLTokenType:String = 'XMLTokenType';
        public static const XMLIdentifierTokenType:String = 'XMLIdentifierTokenType';
        public static const XMLTextTokenType:String = 'XMLTextTokenType';
        public static const XMLCDATATokenType:String = 'XMLCDATATokenType';
        public static const XMLCDATAChunkTokenType:String = 'XMLCDATAChunkTokenType';
        public static const XMLCDATAEndTokenType:String = 'XMLCDATAEndTokenType';
        public static const XMLOpenArrowTokenType:String = 'XMLOpenArrowTokenType';
        public static const XMLClosedArrowTokenType:String = 'XMLClosedArrowTokenType';
        public static const XMLForwardSlashTokenType:String = 'XMLForwardSlashTokenType';
        public static const NamespaceQualifierTokenType:String = 'NamespaceQualifierTokenType';
        public static const VectorDotOpenArrowTokenType:String = 'VectorDotOpenArrowTokenType';
        public static const VectorClosedArrowTokenType:String = 'VectorClosedArrowTokenType';
        public static const StringTokenType:String = 'StringTokenType';
        public static const StringChunkTokenType:String = 'StringChunkTokenType';
        public static const StringMultiLineDelimiterTokenType:String = 'StringMultiLineDelimiterTokenType';
        public static const StringEndTokenType:String = 'StringEndTokenType';
        public static const NumberTokenType:String = 'NumberTokenType';
        public static const SpaceTokenType:String = 'SpaceTokenType';
        public static const TabTokenType:String = 'TabTokenType';
        public static const NewLineTokenType:String = 'NewLineTokenType';
        public static const UFOTokenType:String = 'UFOTokenType';

        public static const tokenFunctions:Object = {};
        {
            tokenFunctions[OpenParenTokenType] = {};
            tokenFunctions[ClosedParenTokenType] = {};
            tokenFunctions[OpenBraceTokenType] = {};
            tokenFunctions[ClosedBraceTokenType] = {};
            tokenFunctions[OpenBracketTokenType] = {};
            tokenFunctions[ClosedBracketTokenType] = {};
            tokenFunctions[EOSTokenType] = {};
            tokenFunctions[PackageTokenType] = {};
            tokenFunctions[ImportTokenType] = {};
            tokenFunctions[ClassTokenType] = {};
            tokenFunctions[InterfaceTokenType] = {};
            tokenFunctions[NewTokenType] = {};
            tokenFunctions[UseTokenType] = {};
            tokenFunctions[CaseTokenType] = {};
            tokenFunctions[FunctionTokenType] = {};
            tokenFunctions[GetTokenType] = {};
            tokenFunctions[SetTokenType] = {};
            tokenFunctions[RestTokenType] = {};
            tokenFunctions[ExtendsTokenType] = {};
            tokenFunctions[ImplementsTokenType] = {};
            tokenFunctions[CommentTokenType] = {};
            tokenFunctions[CommentChunkTokenType] = {};
            tokenFunctions[MultiLineCommentTokenType] = {};
            tokenFunctions[MultiLineCommentChunkTokenType] = {};
            tokenFunctions[MultiLineCommentEndTokenType] = {};
            tokenFunctions[OverrideTokenType] = {};
            tokenFunctions[StaticTokenType] = {};
            tokenFunctions[DynamicTokenType] = {};
            tokenFunctions[FinalTokenType] = {};
            tokenFunctions[VarTokenType] = {};
            tokenFunctions[ConstTokenType] = {};
            tokenFunctions[IdentifierTokenType] = {};
            tokenFunctions[BooleanTokenType] = {};
            tokenFunctions[ThisTokenType] = {};
            tokenFunctions[TypeofTokenType] = {};
            tokenFunctions[NullTokenType] = {};
            tokenFunctions[VoidTokenType] = {};
            tokenFunctions[UndefinedTokenType] = {};
            tokenFunctions[IsTokenType] = {};
            tokenFunctions[NaNTokenType] = {};
            tokenFunctions[InstanceofTokenType] = {};
            tokenFunctions[ReturnTokenType] = {};
            tokenFunctions[SwitchTokenType] = {};
            tokenFunctions[SuperTokenType] = {};
            tokenFunctions[ThrowTokenType] = {};
            tokenFunctions[DotDotTokenType] = {};
            tokenFunctions[DotTokenType] = {};
            tokenFunctions[NotTokenType] = {};
            tokenFunctions[BitwiseNotTokenType] = {};
            tokenFunctions[ColonTokenType] = {};
            tokenFunctions[CommaTokenType] = {};
            tokenFunctions[TernaryTokenType] = {};
            tokenFunctions[IncrementTokenType] = {};
            tokenFunctions[DecrementTokenType] = {};
            tokenFunctions[BreakTokenType] = {};
            tokenFunctions[ContinueTokenType] = {};
            tokenFunctions[DefaultTokenType] = {};
            tokenFunctions[InTokenType] = {};
            tokenFunctions[AsTokenType] = {};
            tokenFunctions[DeleteTokenType] = {};
            tokenFunctions[IfTokenType] = {};
            tokenFunctions[ElseTokenType] = {};
            tokenFunctions[EachTokenType] = {};
            tokenFunctions[ForTokenType] = {};
            tokenFunctions[WhileTokenType] = {};
            tokenFunctions[DoTokenType] = {};
            tokenFunctions[WithTokenType] = {};
            tokenFunctions[TryTokenType] = {};
            tokenFunctions[CatchTokenType] = {};
            tokenFunctions[RegExpTokenType] = {};
            tokenFunctions[SpecialUFOTokenType] = {};
            tokenFunctions[FinallyTokenType] = {};
            tokenFunctions[AtTokenType] = {};
            tokenFunctions[BitwiseLeftShiftAssignmentTokenType] = {};
            tokenFunctions[BitwiseRightShiftAssignmentTokenType] = {};
            tokenFunctions[BitwiseUnsignedRightShiftAssignmentTokenType] = {};
            tokenFunctions[BitwiseAndAssignmentTokenType] = {};
            tokenFunctions[BitwiseOrAssignmentTokenType] = {};
            tokenFunctions[BitwiseXorAssignmentTokenType] = {};
            tokenFunctions[AddWithAssignmentTokenType] = {};
            tokenFunctions[DivWithAssignmentTokenType] = {};
            tokenFunctions[ModWithAssignmentTokenType] = {};
            tokenFunctions[MulWithAssignmentTokenType] = {};
            tokenFunctions[SubWithAssignmentTokenType] = {};
            tokenFunctions[EqualityTokenType] = {};
            tokenFunctions[RelationalTokenType] = {};
            tokenFunctions[BitwiseAndTokenType] = {};
            tokenFunctions[BitwiseXorTokenType] = {};
            tokenFunctions[BitwiseOrTokenType] = {};
            tokenFunctions[AndTokenType] = {};
            tokenFunctions[AndWithAssignmentTokenType] = {};
            tokenFunctions[OrTokenType] = {};
            tokenFunctions[OrWithAssignmentTokenType] = {};
            tokenFunctions[BitwiseLeftShiftTokenType] = {};
            tokenFunctions[BitwiseRightShiftTokenType] = {};
            tokenFunctions[BitwiseUnsignedRightShiftTokenType] = {};
            tokenFunctions[SubTokenType] = {};
            tokenFunctions[AddTokenType] = {};
            tokenFunctions[DivTokenType] = {};
            tokenFunctions[MulTokenType] = {};
            tokenFunctions[ModTokenType] = {};
            tokenFunctions[AssignmentTokenType] = {};
            tokenFunctions[NamespaceKeywordTokenType] = {};
            tokenFunctions[XMLTokenType] = {};
            tokenFunctions[XMLIdentifierTokenType] = {};
            tokenFunctions[XMLTextTokenType] = {};
            tokenFunctions[XMLCDATATokenType] = {};
            tokenFunctions[XMLCDATAChunkTokenType] = {};
            tokenFunctions[XMLCDATAEndTokenType] = {};
            tokenFunctions[XMLOpenArrowTokenType] = {};
            tokenFunctions[XMLClosedArrowTokenType] = {};
            tokenFunctions[XMLForwardSlashTokenType] = {};
            tokenFunctions[NamespaceQualifierTokenType] = {};
            tokenFunctions[VectorDotOpenArrowTokenType] = {};
            tokenFunctions[VectorClosedArrowTokenType] = {};
            tokenFunctions[StringTokenType] = {};
            tokenFunctions[StringChunkTokenType] = {};
            tokenFunctions[StringMultiLineDelimiterTokenType] = {};
            tokenFunctions[StringEndTokenType] = {};
            tokenFunctions[NumberTokenType] = {};
            tokenFunctions[SpaceTokenType] = {};
            tokenFunctions[TabTokenType] = {};
            tokenFunctions[NewLineTokenType] = {};
            tokenFunctions[UFOTokenType] = {};


            tokenFunctions[OpenParenTokenType].find = function (input:*):* { return (input.charAt(0) == '(') ? getNewResult(getNewToken(OpenParenTokenType, '('), 0) : null; }
            tokenFunctions[ClosedParenTokenType].find = function (input:*):* { return (input.charAt(0) == ')') ? getNewResult(getNewToken(ClosedParenTokenType, ')'), 0) : null; }
            tokenFunctions[OpenBraceTokenType].find = function (input:*):* { return (input.charAt(0) == '{') ? getNewResult(getNewToken(OpenBraceTokenType, '{'), 0) : null; }
            tokenFunctions[ClosedBraceTokenType].find = function (input:*):* { return (input.charAt(0) == '}') ? getNewResult(getNewToken(ClosedBraceTokenType, '}'), 0) : null; }
            tokenFunctions[OpenBracketTokenType].find = function (input:*):* { return (input.charAt(0) == '[') ? getNewResult(getNewToken(OpenBracketTokenType, '['), 0) : null; }
            tokenFunctions[ClosedBracketTokenType].find = function (input:*):* { return (input.charAt(0) == ']') ? getNewResult(getNewToken(ClosedBracketTokenType, ']'), 0) : null; }
            tokenFunctions[EOSTokenType].find = function (input:*):* { return (input.charAt(0) == ';') ? getNewResult(getNewToken(EOSTokenType, ';'), 0) : null; }

            tokenFunctions[PackageTokenType].keyword = 'package';
            tokenFunctions[PackageTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[PackageTokenType].find = function (input:*):* { return (input.charAt(0) != 'p' || input.charAt(1) != 'a') ? null : keywordFind(input, PackageTokenType, [NewLineTokenType, TabTokenType, SpaceTokenType, IdentifierTokenType, DotTokenType]); }

            tokenFunctions[ImportTokenType].keyword = 'import';
            tokenFunctions[ImportTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'm') ? null : keywordFind2(input, 'import', ImportTokenType, identifierStartCharacters, true); }

            tokenFunctions[ClassTokenType].keyword = 'class';
            tokenFunctions[ClassTokenType].find = function (input:*):* { return (input.charAt(0) != 'c' || input.charAt(1) != 'l') ? null : keywordFind2(input, 'class', ClassTokenType, identifierStartCharacters, true); }

            tokenFunctions[InterfaceTokenType].keyword = 'interface';
            tokenFunctions[InterfaceTokenType].terminator = /^[\s]/;
            tokenFunctions[InterfaceTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : keywordFind2(input, 'interface', InterfaceTokenType, identifierStartCharacters, true); }

            tokenFunctions[NewTokenType].keyword = 'new';
            tokenFunctions[NewTokenType].terminator = /^[\s]/;
            tokenFunctions[NewTokenType].find = function (input:*):* { return (input.charAt(0) != 'n' || input.charAt(1) != 'e') ? null : keywordFind(input, NewTokenType); }

            tokenFunctions[UseTokenType].keyword = 'use';
            tokenFunctions[UseTokenType].terminator = /^[\s]/;
            tokenFunctions[UseTokenType].find = function (input:*):* { return (input.charAt(0) != 'u' || input.charAt(1) != 's') ? null : keywordFind(input, UseTokenType); }

            tokenFunctions[CaseTokenType].keyword = 'case';
            tokenFunctions[CaseTokenType].terminator = /^[\s]/;
            tokenFunctions[CaseTokenType].find = function (input:*):* { return (input.charAt(0) != 'c' || input.charAt(1) != 'a') ? null : keywordFind(input, CaseTokenType); }

            tokenFunctions[FunctionTokenType].keyword = 'function';
            tokenFunctions[FunctionTokenType].terminator = /^[\s]|\(/;
            tokenFunctions[FunctionTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != 'f') return null;
                var result:* = keywordFind(input, FunctionTokenType, [NewLineTokenType, TabTokenType, SpaceTokenType, GetTokenType, SetTokenType, IdentifierTokenType]);
                if (!result) return null;

                var tokens:* = result.tokens;
                var index:* = result.index;

                result = Lexer.lex(input.slice(index + 1), [NewLineTokenType, TabTokenType, SpaceTokenType, OpenParenTokenType, ClosedParenTokenType, VectorDotOpenArrowTokenType, VectorClosedArrowTokenType, VoidTokenType, StringTokenType, BooleanTokenType, SubTokenType, AddTokenType, RestTokenType, NumberTokenType, NullTokenType, UndefinedTokenType, NaNTokenType, ColonTokenType, MulTokenType, CommaTokenType, AssignmentTokenType, IdentifierTokenType, DotTokenType], true);

                tokens = tokens.concat(result.tokens);
                return getNewResult(tokens, result.index + index);
            }

            tokenFunctions[GetTokenType].keyword = 'get';
            tokenFunctions[GetTokenType].find = function (input:*):* { return (input.charAt(0) != 'g' || input.charAt(1) != 'e') ? null : keywordFind2(input, 'get', GetTokenType, identifierStartCharacters, true); }

            tokenFunctions[SetTokenType].keyword = 'set';
            tokenFunctions[SetTokenType].find = function (input:*):* { return (input.charAt(0) != 's' || input.charAt(1) != 'e') ? null : keywordFind2(input, 'set', SetTokenType, identifierStartCharacters, true); }

            tokenFunctions[RestTokenType].find = function (input:*):* { return (input.charAt(0) != '.' || input.charAt(1) != '.') ? null : keywordFind2(input, '...', RestTokenType, identifierStartCharacters, false); }

            tokenFunctions[ExtendsTokenType].keyword = 'extends';
            tokenFunctions[ExtendsTokenType].find = function (input:*):* { return (input.charAt(0) != 'e' || input.charAt(1) != 'x') ? null : keywordFind2(input, 'extends', ExtendsTokenType, identifierStartCharacters, true); }

            tokenFunctions[ImplementsTokenType].keyword = 'implements';
            tokenFunctions[ImplementsTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'm') ? null : keywordFind2(input, 'implements', ImplementsTokenType, identifierStartCharacters, true); }

            tokenFunctions[CommentTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '/' || input.charAt(1) != '/') return null;

                var tokens:* = [];
                var i:* = 2;
                var commentChunk:* = '';

                var token:* = getNewToken(CommentTokenType, input.charAt(0) + input.charAt(1));
                tokens.push(token);

                while (i < input.length)
                {
                    if (input.charAt(i).match(/[\r\n]/)) break;

                    commentChunk += input.charAt(i);
                    i++;
                }

                if (i > 2)
                {
                    token = getNewToken(CommentChunkTokenType, commentChunk);
                    tokens.push(token);
                }

                return getNewResult(tokens, i - 1);
            }

            tokenFunctions[MultiLineCommentTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '/' || input.charAt(1) != '*') return null;

                var tokens:* = [];

                var token:* = getNewToken(MultiLineCommentTokenType, input.charAt(0) + input.charAt(1));
                tokens.push(token);

                var i:* = 2;
                var lastChar:*;
                var commentChunk:* = '';
                while (i < input.length)
                {
                    if (input.charAt(i).match(/[\r\n]/))
                    {
                        if (commentChunk.length > 0)
                        {
                            token = getNewToken(MultiLineCommentChunkTokenType, commentChunk);
                            tokens.push(token);
                        }

                        token = getNewToken(NewLineTokenType, input.charAt(i));
                        tokens.push(token);

                        commentChunk = '';
                    }
                    else if (lastChar == '*' && input.charAt(i) == '/')
                    {
                        commentChunk = commentChunk.slice(0, commentChunk.length - 1);
                        i--;
                        break;
                    }
                    else commentChunk += input.charAt(i);

                    lastChar = input.charAt(i);
                    i++;
                }

                if (commentChunk.length > 0)
                {
                    token = getNewToken(MultiLineCommentChunkTokenType, commentChunk);
                    tokens.push(token);
                }

                token = getNewToken(MultiLineCommentEndTokenType, input.charAt(i) + input.charAt(i + 1));
                tokens.push(token);

                return getNewResult(tokens, i + 1);
            }

            tokenFunctions[OverrideTokenType].keyword = 'override';
            tokenFunctions[OverrideTokenType].find = function (input:*):* { return (input.charAt(0) != 'o' || input.charAt(1) != 'v') ? null : keywordFind2(input, 'override', OverrideTokenType, identifierStartCharacters, true); }

            tokenFunctions[StaticTokenType].keyword = 'static';
            tokenFunctions[StaticTokenType].find = function (input:*):* { return (input.charAt(0) != 's' || input.charAt(1) != 't') ? null : keywordFind2(input, 'static', StaticTokenType, identifierStartCharacters, true); }

            tokenFunctions[DynamicTokenType].keyword = 'dynamic';
            tokenFunctions[DynamicTokenType].find = function (input:*):* { return (input.charAt(0) != 'd' || input.charAt(1) != 'y') ? null : keywordFind2(input, 'dynamic', DynamicTokenType, identifierStartCharacters, true); }

            tokenFunctions[FinalTokenType].keyword = 'final';
            tokenFunctions[FinalTokenType].find = function (input:*):* { return (input.charAt(0) != 'f' || input.charAt(1) != 'i') ? null : keywordFind2(input, 'final', FinalTokenType, identifierStartCharacters, true); }

            tokenFunctions[VarTokenType].keyword = 'var';
            tokenFunctions[VarTokenType].find = function (input:*):* { return (input.charAt(0) != 'v' || input.charAt(1) != 'a') ? null : keywordFind2(input, 'var', VarTokenType, identifierStartCharacters, true); }

            tokenFunctions[ConstTokenType].keyword = 'const';
            tokenFunctions[ConstTokenType].find = function (input:*):* { return (input.charAt(0) != 'c' || input.charAt(1) != 'o') ? null : keywordFind2(input, 'const', ConstTokenType, identifierStartCharacters, true); }

            tokenFunctions[IdentifierTokenType].regex = /^[a-zA-Z_$][a-zA-Z_0-9$]*/;
            tokenFunctions[IdentifierTokenType].find = function (input:*):* { return regexFind(input, IdentifierTokenType); }

            tokenFunctions[BooleanTokenType].regex = /^(true|false)(?![a-zA-Z0-9_])/;
            tokenFunctions[BooleanTokenType].find = function (input:*):* {  return (input.charAt(0) != 't' && input.charAt(0) != 'f') ? null : regexFind(input, BooleanTokenType); }

            tokenFunctions[ThisTokenType].regex = /^this(?![a-zA-Z0-9_])/;
            tokenFunctions[ThisTokenType].find = function (input:*):* { return (input.charAt(0) != 't' || input.charAt(1) != 'h') ? null : regexFind(input, ThisTokenType); }

            tokenFunctions[TypeofTokenType].regex = /^typeof(?![a-zA-Z0-9_])/;
            tokenFunctions[TypeofTokenType].find = function (input:*):* { return (input.charAt(0) != 't' || input.charAt(1) != 'y') ? null : regexFind(input, TypeofTokenType); }

            tokenFunctions[NullTokenType].regex = /^null(?![a-zA-Z0-9_])/;
            tokenFunctions[NullTokenType].find = function (input:*):* { return (input.charAt(0) != 'n' || input.charAt(1) != 'u') ? null : regexFind(input, NullTokenType); }

            tokenFunctions[VoidTokenType].regex = /^void(?![a-zA-Z0-9_])/;
            tokenFunctions[VoidTokenType].find = function (input:*):* { return (input.charAt(0) != 'v' || input.charAt(1) != 'o') ? null : regexFind(input, VoidTokenType); }

            tokenFunctions[UndefinedTokenType].regex = /^undefined(?![a-zA-Z0-9_])/;
            tokenFunctions[UndefinedTokenType].find = function (input:*):* { return (input.charAt(0) != 'u' || input.charAt(1) != 'n') ? null : regexFind(input, UndefinedTokenType); }

            tokenFunctions[IsTokenType].regex = /^is(?![a-zA-Z0-9_])/;
            tokenFunctions[IsTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 's') ? null : regexFind(input, IsTokenType); }

            tokenFunctions[NaNTokenType].regex = /^NaN(?![a-zA-Z0-9_])/;
            tokenFunctions[NaNTokenType].find = function (input:*):* { return (input.charAt(0) != 'N' || input.charAt(1) != 'a') ? null : regexFind(input, NaNTokenType); }

            tokenFunctions[InstanceofTokenType].regex = /^instanceof(?![a-zA-Z0-9_])/;
            tokenFunctions[InstanceofTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : regexFind(input, InstanceofTokenType); }

            tokenFunctions[ReturnTokenType].regex = /^return(?![a-zA-Z0-9_])/;
            tokenFunctions[ReturnTokenType].find = function (input:*):* { return (input.charAt(0) != 'r' || input.charAt(1) != 'e') ? null : regexFind(input, ReturnTokenType); }

            tokenFunctions[SwitchTokenType].regex = /^switch(?![a-zA-Z0-9_])/;
            tokenFunctions[SwitchTokenType].find = function (input:*):* { return (input.charAt(0) != 's' || input.charAt(1) != 'w') ? null : regexFind(input, SwitchTokenType); }

            tokenFunctions[SuperTokenType].regex = /^super(?![a-zA-Z0-9_])/;
            tokenFunctions[SuperTokenType].find = function (input:*):* { return (input.charAt(0) != 's' || input.charAt(1) != 'u') ? null : regexFind(input, SuperTokenType); }

            tokenFunctions[ThrowTokenType].regex = /^throw(?![a-zA-Z0-9_])/;
            tokenFunctions[ThrowTokenType].find = function (input:*):* { return (input.charAt(0) != 't' || input.charAt(1) != 'h') ? null : regexFind(input, ThrowTokenType); }

            tokenFunctions[DotDotTokenType].regex = /^\.\./;
            tokenFunctions[DotDotTokenType].find = function (input:*):* { return (input.charAt(0) != '.' || input.charAt(1) != '.') ? null : regexFind(input, DotDotTokenType); }

            tokenFunctions[DotTokenType].find = function (input:*):* { return (input.charAt(0) == '.') ? getNewResult(getNewToken(DotTokenType, '.'), 0) : null; }
            tokenFunctions[NotTokenType].find = function (input:*):* { return (input.charAt(0) == '!') ? getNewResult(getNewToken(NotTokenType, '!'), 0) : null; }
            tokenFunctions[BitwiseNotTokenType].find = function (input:*):* { return (input.charAt(0) == '~') ? getNewResult(getNewToken(BitwiseNotTokenType, '~'), 0) : null; }
            tokenFunctions[ColonTokenType].find = function (input:*):* { return (input.charAt(0) == ':') ? getNewResult(getNewToken(ColonTokenType, ':'), 0) : null; }
            tokenFunctions[CommaTokenType].find = function (input:*):* { return (input.charAt(0) == ',') ? getNewResult(getNewToken(CommaTokenType, ','), 0) : null; }
            tokenFunctions[TernaryTokenType].find = function (input:*):* { return (input.charAt(0) == '?') ? getNewResult(getNewToken(TernaryTokenType, '?'), 0) : null; }

            tokenFunctions[IncrementTokenType].regex = /^\+\+/;
            tokenFunctions[IncrementTokenType].find = function (input:*):* { return (input.charAt(0) != '+' || input.charAt(1) != '+') ? null : regexFind(input, IncrementTokenType); }

            tokenFunctions[DecrementTokenType].regex = /^\-\-/;
            tokenFunctions[DecrementTokenType].find = function (input:*):* { return (input.charAt(0) != '-' || input.charAt(1) != '-') ? null : regexFind(input, DecrementTokenType); }

            tokenFunctions[BreakTokenType].regex = /^break(?![a-zA-Z0-9_])/;
            tokenFunctions[BreakTokenType].find = function (input:*):* { return (input.charAt(0) != 'b' || input.charAt(1) != 'r') ? null : regexFind(input, BreakTokenType); }

            tokenFunctions[ContinueTokenType].regex = /^continue(?![a-zA-Z0-9_])/;
            tokenFunctions[ContinueTokenType].find = function (input:*):* { return (input.charAt(0) != 'c' || input.charAt(1) != 'o') ? null : regexFind(input, ContinueTokenType); }

            tokenFunctions[DefaultTokenType].regex = /^default(?![a-zA-Z0-9_])/;
            tokenFunctions[DefaultTokenType].find = function (input:*):* { return (input.charAt(0) != 'd' || input.charAt(1) != 'e') ? null : regexFind(input, DefaultTokenType); }

            tokenFunctions[InTokenType].regex = /^in(?![a-zA-Z0-9_])/;
            tokenFunctions[InTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : regexFind(input, InTokenType); }

            tokenFunctions[AsTokenType].regex = /^as(?![a-zA-Z0-9_])/;
            tokenFunctions[AsTokenType].find = function (input:*):* { return (input.charAt(0) != 'a' || input.charAt(1) != 's') ? null : regexFind(input, AsTokenType); }

            tokenFunctions[DeleteTokenType].regex = /^delete(?![a-zA-Z0-9_.(])/;
            tokenFunctions[DeleteTokenType].find = function (input:*):* { return (input.charAt(0) != 'd' || input.charAt(1) != 'e') ? null : regexFind(input, DeleteTokenType); }

            tokenFunctions[IfTokenType].keyword = 'if';
            tokenFunctions[IfTokenType].find = function (input:*):* { return (input.charAt(0) != 'i' || input.charAt(1) != 'f') ? null : keywordFind2(input, 'if', IfTokenType, '(', false); }

            tokenFunctions[ElseTokenType].keyword = 'else';
            tokenFunctions[ElseTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[ElseTokenType].find = function (input:*):* { return (input.charAt(0) != 'e' || input.charAt(1) != 'l') ? null : keywordFind(input, ElseTokenType); }

            tokenFunctions[EachTokenType].keyword = 'each';
            tokenFunctions[EachTokenType].terminator = /^([\s]|\()/;
            tokenFunctions[EachTokenType].find = function (input:*):* { return (input.charAt(0) != 'e' || input.charAt(1) != 'a') ? null : keywordFind(input, EachTokenType); }

            tokenFunctions[ForTokenType].keyword = 'for';
            tokenFunctions[ForTokenType].terminator = /^([\s]|\()/;
            tokenFunctions[ForTokenType].find = function (input:*):* { return (input.charAt(0) != 'f' || input.charAt(1) != 'o') ? null : keywordFind(input, ForTokenType); }

            tokenFunctions[WhileTokenType].keyword = 'while';
            tokenFunctions[WhileTokenType].terminator = /^([\s]|\()/;
            tokenFunctions[WhileTokenType].find = function (input:*):* { return (input.charAt(0) != 'w' || input.charAt(1) != 'h') ? null : keywordFind(input, WhileTokenType); }

            tokenFunctions[DoTokenType].keyword = 'do';
            tokenFunctions[DoTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[DoTokenType].find = function (input:*):* { return (input.charAt(0) != 'd' || input.charAt(1) != 'o') ? null : keywordFind(input, DoTokenType); }

            tokenFunctions[WithTokenType].keyword = 'with';
            tokenFunctions[WithTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[WithTokenType].find = function (input:*):* { return (input.charAt(0) != 'w' || input.charAt(1) != 'i') ? null : keywordFind(input, WithTokenType); }

            tokenFunctions[TryTokenType].keyword = 'try';
            tokenFunctions[TryTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[TryTokenType].find = function (input:*):* { return (input.charAt(0) != 't' || input.charAt(1) != 'r') ? null : keywordFind(input, TryTokenType); }

            tokenFunctions[CatchTokenType].keyword = 'catch';
            tokenFunctions[CatchTokenType].terminator = /^([\s]|\()/;
            tokenFunctions[CatchTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != 'c' || input.charAt(1) != 'a') return null;
                var result:* = keywordFind(input, CatchTokenType, [NewLineTokenType, TabTokenType, SpaceTokenType]);
                if (!result) return null;

                var tokens:* = result.tokens;
                var index:* = result.index;

                result = Lexer.lex(input.slice(index + 1), [NewLineTokenType, TabTokenType, SpaceTokenType, OpenParenTokenType, ClosedParenTokenType, IdentifierTokenType, DotTokenType, ColonTokenType], true);

                tokens = tokens.concat(result.tokens);
                return getNewResult(tokens, result.index + index);
            }

            tokenFunctions[RegExpTokenType].find = function (input:*, foundTokens:*):*
            {
                if (input.charAt(0) != '/') return null;

                outer: for (var j = foundTokens.length - 1; j >= 0; j--)
                {
                    var tokens = foundTokens[j];

                    var token:*;
                    var i:*;
                    for (i = tokens.length - 1; i >= 0; i--)
                    {
                        token = tokens[i];

                        switch (token.type)
                        {
                            case SpaceTokenType:
                            case TabTokenType:
                            case NewLineTokenType:
                                break;
                            case EOSTokenType:
                            case OpenBracketTokenType:
                            case OpenParenTokenType:
                            case EqualityTokenType:
                            case BitwiseLeftShiftAssignmentTokenType:
                            case BitwiseUnsignedRightShiftAssignmentTokenType:
                            case BitwiseRightShiftAssignmentTokenType:
                            case BitwiseLeftShiftTokenType:
                            case BitwiseUnsignedRightShiftTokenType:
                            case BitwiseRightShiftTokenType:
                            case RelationalTokenType:
                            case AddWithAssignmentTokenType:
                            case DivWithAssignmentTokenType:
                            case ModWithAssignmentTokenType:
                            case MulWithAssignmentTokenType:
                            case SubWithAssignmentTokenType:
                            case AssignmentTokenType:
                            case CommaTokenType:
                            case DeleteTokenType:
                            case InTokenType:
                            case WithTokenType:
                            case TypeofTokenType:
                            case VoidTokenType:
                            case ReturnTokenType:
                            case ThrowTokenType:
                            case NewTokenType:
                            case CaseTokenType:
                            case AndWithAssignmentTokenType:
                            case OrWithAssignmentTokenType:
                            case AndTokenType:
                            case OrTokenType:
                            case BitwiseAndAssignmentTokenType:
                            case BitwiseOrAssignmentTokenType:
                            case BitwiseXorAssignmentTokenType:
                            case BitwiseAndTokenType:
                            case BitwiseNotTokenType:
                            case BitwiseOrTokenType:
                            case BitwiseXorTokenType:
                            case NotTokenType:
                            case IncrementTokenType:
                            case DecrementTokenType:
                            case OpenBraceTokenType:
                            case IsTokenType:
                            case InstanceofTokenType:
                            case AddTokenType:
                            case RegExpTokenType:
                            case SubTokenType:
                            case DivTokenType:
                            case MulTokenType:
                            case ModTokenType:
                                break outer;
                            default:
                                return null;
                        }
                    }
                }
                var result:* = Lexer.lex(input.slice(1), [SpecialUFOTokenType], true);

                var previousToken:*;
                var tokens:* = result.tokens;
                var foundEnd:* = false;

                for (i = 0; i < tokens.length; i++)
                {
                    token = tokens[i];

                    if (foundEnd)
                    {
                        if (token.data == ',' || token.data == ';' || token.data == ']' || token.data == ')' || token.data == ']' || token.data == '.' || token.data == ' ' || token.data == '	' || token.data.match(/[\r\n]/))
                        {
                            i++;
                            break;
                        }
                    }
                    else if (token.data == '/' && previousToken && previousToken.data != '\\') foundEnd = true;

                    previousToken = token;
                }
                if (!foundEnd) return null;

                tokens = tokens.splice(0, i - 1);
                tokens.unshift(getNewToken(RegExpTokenType, '/'));

                return getNewResult(tokens, i - 1);
            }

            tokenFunctions[SpecialUFOTokenType].find = function (input:*):*
            {
                if (tokenFunctions[NewLineTokenType].find(input) != null) return null;

                return getNewResult(getNewToken(SpecialUFOTokenType, input.charAt(0)), 0);
            }

            tokenFunctions[FinallyTokenType].keyword = 'finally';
            tokenFunctions[FinallyTokenType].terminator = /^([\s]|\{)/;
            tokenFunctions[FinallyTokenType].find = function (input:*):* { return (input.charAt(0) != 'f' || input.charAt(1) != 'i') ? null : keywordFind(input, FinallyTokenType); }

            tokenFunctions[AtTokenType].find = function (input:*):* { return (input.charAt(0) == '@') ? getNewResult(getNewToken(AtTokenType, '@'), 0) : null; }

            tokenFunctions[BitwiseLeftShiftAssignmentTokenType].regex = /^<<=/;
            tokenFunctions[BitwiseLeftShiftAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) != '<' || input.charAt(1) != '<') ? null : regexFind(input, BitwiseLeftShiftAssignmentTokenType); }

            tokenFunctions[BitwiseRightShiftAssignmentTokenType].regex = /^>>=/;
            tokenFunctions[BitwiseRightShiftAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) != '>' || input.charAt(1) != '>') ? null : regexFind(input, BitwiseRightShiftAssignmentTokenType); }

            tokenFunctions[BitwiseUnsignedRightShiftAssignmentTokenType].regex = /^>>>=/;
            tokenFunctions[BitwiseUnsignedRightShiftAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) != '>' || input.charAt(1) != '>') ? null : regexFind(input, BitwiseUnsignedRightShiftAssignmentTokenType); }

            tokenFunctions[BitwiseAndAssignmentTokenType].regex = /^&=/;
            tokenFunctions[BitwiseAndAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) != '&' || input.charAt(1) != '=') ? null : regexFind(input, BitwiseAndAssignmentTokenType); }

            tokenFunctions[BitwiseOrAssignmentTokenType].regex = /^\|=/;
            tokenFunctions[BitwiseOrAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '|' || input.charAt(1) != '=') ? null : regexFind(input, BitwiseOrAssignmentTokenType); }

            tokenFunctions[BitwiseXorAssignmentTokenType].regex = /^\^=/;
            tokenFunctions[BitwiseXorAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '^' || input.charAt(1) != '=') ? null : regexFind(input, BitwiseXorAssignmentTokenType); }

            tokenFunctions[AddWithAssignmentTokenType].regex = /^\+\=/;
            tokenFunctions[AddWithAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '+' || input.charAt(1) != '=') ? null : regexFind(input, AddWithAssignmentTokenType); }

            tokenFunctions[DivWithAssignmentTokenType].regex = /^\/\=/;
            tokenFunctions[DivWithAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '/' || input.charAt(1) != '=') ? null : regexFind(input, DivWithAssignmentTokenType); }

            tokenFunctions[ModWithAssignmentTokenType].regex = /^\%\=/;
            tokenFunctions[ModWithAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '%' || input.charAt(1) != '=') ? null : regexFind(input, ModWithAssignmentTokenType); }

            tokenFunctions[MulWithAssignmentTokenType].regex = /^\*\=/;
            tokenFunctions[MulWithAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '*' || input.charAt(1) != '=') ? null : regexFind(input, MulWithAssignmentTokenType); }

            tokenFunctions[SubWithAssignmentTokenType].regex = /^\-\=/;
            tokenFunctions[SubWithAssignmentTokenType].find = function (input:*):* {  return (input.charAt(0) != '-' || input.charAt(1) != '=') ? null : regexFind(input, SubWithAssignmentTokenType); }

            tokenFunctions[EqualityTokenType].operators = ['===', '!==', '==', '!='];
            tokenFunctions[EqualityTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '=' && input.charAt(0) != '!') return null;

                for (var i:* = 0; i < tokenFunctions[EqualityTokenType].operators.length; i++)
                {
                    var operator:* = tokenFunctions[EqualityTokenType].operators[i];

                    var match:* = input.match(new RegExp("^" + operator));
                    if (!match) continue;

                    var token:* = getNewToken(EqualityTokenType, operator);
                    return getNewResult(token, operator.length - 1);
                }

                return null;
            }

            tokenFunctions[RelationalTokenType].operators = ['>=', '>', '<=', '<'];
            tokenFunctions[RelationalTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '>' && input.charAt(0) != '<') return null;

                for (var i:* = 0; i < tokenFunctions[RelationalTokenType].operators.length; i++)
                {
                    var operator:* = tokenFunctions[RelationalTokenType].operators[i];

                    var match:* = input.match(new RegExp("^" + operator));
                    if (!match) continue;

                    var token:* = getNewToken(RelationalTokenType, operator);
                    return getNewResult(token, operator.length - 1);
                }

                return null;
            }

            tokenFunctions[BitwiseAndTokenType].find = function (input:*):* { return (input.charAt(0) == '&') ? getNewResult(getNewToken(BitwiseAndTokenType, '&'), 0) : null; }
            tokenFunctions[BitwiseXorTokenType].find = function (input:*):* { return (input.charAt(0) == '^') ? getNewResult(getNewToken(BitwiseXorTokenType, '^'), 0) : null; }
            tokenFunctions[BitwiseOrTokenType].find = function (input:*):* { return (input.charAt(0) == '|') ? getNewResult(getNewToken(BitwiseOrTokenType, '|'), 0) : null; }
            tokenFunctions[AndTokenType].find = function (input:*):* { return (input.charAt(0) == '&' && input.charAt(1) == '&') ? getNewResult(getNewToken(AndTokenType, '&&'), 1) : null; }
            tokenFunctions[AndWithAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) == '&' && input.charAt(1) == '&' && input.charAt(2) == '=') ? getNewResult(getNewToken(AndWithAssignmentTokenType, '&&='), 2) : null; }
            tokenFunctions[OrTokenType].find = function (input:*):* { return (input.charAt(0) == '|' && input.charAt(1) == '|') ? getNewResult(getNewToken(OrTokenType, '||'), 1) : null; }
            tokenFunctions[OrWithAssignmentTokenType].find = function (input:*):* { return (input.charAt(0) == '|' && input.charAt(1) == '|' && input.charAt(2) == '=') ? getNewResult(getNewToken(OrWithAssignmentTokenType, '||='), 2) : null; }
            tokenFunctions[BitwiseLeftShiftTokenType].find = function (input:*):* { return (input.charAt(0) == '<' && input.charAt(1) == '<') ? getNewResult(getNewToken(BitwiseLeftShiftTokenType, '<<'), 1) : null; }
            tokenFunctions[BitwiseRightShiftTokenType].find = function (input:*):* { return (input.charAt(0) == '>' && input.charAt(1) == '>') ? getNewResult(getNewToken(BitwiseRightShiftTokenType, '>>'), 1) : null; }
            tokenFunctions[BitwiseUnsignedRightShiftTokenType].find = function (input:*):* { return (input.charAt(0) == '>' && input.charAt(1) == '>' && input.charAt(2) == '>') ? getNewResult(getNewToken(BitwiseUnsignedRightShiftTokenType, '>>>'), 2) : null; }
            tokenFunctions[SubTokenType].find = function (input:*):* { return (input.charAt(0) == '-') ? getNewResult(getNewToken(SubTokenType, '-'), 0) : null; }
            tokenFunctions[AddTokenType].find = function (input:*):* { return (input.charAt(0) == '+') ? getNewResult(getNewToken(AddTokenType, '+'), 0) : null; }
            tokenFunctions[DivTokenType].find = function (input:*):* { return (input.charAt(0) == '/') ? getNewResult(getNewToken(DivTokenType, '/'), 0) : null; }
            tokenFunctions[MulTokenType].find = function (input:*):* { return (input.charAt(0) == '*') ? getNewResult(getNewToken(MulTokenType, '*'), 0) : null; }
            tokenFunctions[ModTokenType].find = function (input:*):* { return (input.charAt(0) == '%') ? getNewResult(getNewToken(ModTokenType, '%'), 0) : null; }
            tokenFunctions[AssignmentTokenType].find = function (input:*):* { return (input.charAt(0) == '=') ? getNewResult(getNewToken(AssignmentTokenType, '='), 0) : null; }
            tokenFunctions[NamespaceKeywordTokenType].find = function (input:*):* { return (input.charAt(0) == 'n') ? keywordFind2(input, 'namespace', NamespaceKeywordTokenType, identifierStartCharacters, true) : null; }

            tokenFunctions[XMLTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '<') return null;

                //examples
                //<root bal="dfd"></root>
                //<dfdroot444.-_bal/>
                //<></node></node></>
                //<foo/>
                //<namespace:blah xlms:namspace=""/>

                var isXMLList:* = input.charAt(1) == '>';
                var resultTokens:* = [];
                var index:* = -1;
                var openNodes:* = 0;
                while (true)
                {
                    var result:* = Lexer.lex(input, [NewLineTokenType, TabTokenType, SpaceTokenType, StringTokenType, AssignmentTokenType, ColonTokenType, XMLOpenArrowTokenType, XMLIdentifierTokenType, XMLForwardSlashTokenType], true);

                    if (!result.tokens.length) break;
                    if (input.charAt(result.index) != '>') break;

                    var tokens:* = result.tokens.concat(getNewToken(XMLClosedArrowTokenType, '>'));
                    input = input.slice(result.index + 1);
                    index += result.index + 1;

                    resultTokens = resultTokens.concat(tokens);

                    if (tokens[1].type != XMLForwardSlashTokenType) openNodes++;
                    if (tokens[1].type == XMLForwardSlashTokenType) openNodes--;
                    else if (tokens[tokens.length - 2].type == XMLForwardSlashTokenType) openNodes--;

                    if (!openNodes) break;
                    if (isXMLList && openNodes == 1)
                    {
                        result = Lexer.lex(input, [NewLineTokenType, TabTokenType, SpaceTokenType], true);
                        if (!result.tokens.length) continue;

                        input = input.slice(result.index);
                        index += result.index;

                        resultTokens = resultTokens.concat(result.tokens);
                    }
                    else
                    {
                        result = Lexer.lex(input, [XMLTextTokenType, XMLCDATATokenType], true);
                        if (!result.tokens.length) continue;

                        input = input.slice(result.index);
                        index += result.index;

                        resultTokens = resultTokens.concat(result.tokens);
                    }
                }

                if (openNodes || !resultTokens.length) return null;
                return getNewResult(resultTokens, index);
            }
            tokenFunctions[XMLIdentifierTokenType].regex = /^[a-zA-Z_][a-zA-Z_0-9]*/;
            tokenFunctions[XMLIdentifierTokenType].find = function (input:*):* { return regexFind(input, XMLIdentifierTokenType); }

            tokenFunctions[XMLTextTokenType].find = function (input:*):*
            {
                if (input.charAt(0) == '<') return null;

                var token:*;
                var tokens:* = [];
                var i:* = 0;
                var chunk:* = '';
                while (i < input.length)
                {
                    if (input.charAt(i).match(/[\r\n]/))
                    {
                        if (chunk.length > 0)
                        {
                            token = getNewToken(XMLTextTokenType, chunk);
                            tokens.push(token);
                        }

                        token = getNewToken(NewLineTokenType, input.charAt(i));
                        tokens.push(token);

                        chunk = '';
                    }
                    else if (input.charAt(i) == '<')
                    {
                        i--;
                        break;
                    }
                    else chunk += input.charAt(i);

                    i++;
                }

                if (chunk.length > 0)
                {
                    token = getNewToken(XMLTextTokenType, chunk);
                    tokens.push(token);
                }

                return getNewResult(tokens, i);
            }

            tokenFunctions[XMLCDATATokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '<' || input.charAt(1) != '!' || input.charAt(2) != '[' || input.indexOf('<![CDATA[') != 0) return null;

                var tokens:* = [];
                var token:* = getNewToken(XMLCDATATokenType, '<![CDATA[');
                tokens.push(token);

                var i:* = 9;
                var chunk:* = '';
                while (i < input.length)
                {
                    if (input.charAt(i).match(/[\r\n]/))
                    {
                        if (chunk.length > 0)
                        {
                            token = getNewToken(XMLCDATAChunkTokenType, chunk);
                            tokens.push(token);
                        }

                        token = getNewToken(NewLineTokenType, input.charAt(i));
                        tokens.push(token);

                        chunk = '';
                    }
                    else if (input.charAt(i - 2) == ']' && input.charAt(i - 1) == ']' && input.charAt(i) == '>')
                    {
                        chunk = chunk.slice(0, chunk.length - 2);
                        break;
                    }
                    else chunk += input.charAt(i);

                    i++;
                }

                if (chunk.length > 0)
                {
                    token = getNewToken(XMLCDATAChunkTokenType, chunk);
                    tokens.push(token);
                }

                token = getNewToken(XMLCDATAEndTokenType, ']]>');
                tokens.push(token);

                return getNewResult(tokens, i);
            }

            tokenFunctions[XMLOpenArrowTokenType].find = function (input:*):* { return (input.charAt(0) == '<') ? getNewResult(getNewToken(XMLOpenArrowTokenType, '<'), 0) : null; }
            tokenFunctions[XMLClosedArrowTokenType].find = function (input:*):* { return (input.charAt(0) == '>') ? getNewResult(getNewToken(XMLClosedArrowTokenType, '>'), 0) : null; }

            tokenFunctions[XMLForwardSlashTokenType].regex = /^\//;
            tokenFunctions[XMLForwardSlashTokenType].find = function (input:*):* { return (input.charAt(0) != '/') ? null : regexFind(input, XMLForwardSlashTokenType); }

            tokenFunctions[NamespaceQualifierTokenType].regex = /^::/;
            tokenFunctions[NamespaceQualifierTokenType].find = function (input:*):* { return (input.charAt(0) != ':' || input.charAt(1) != ':') ? null : regexFind(input, NamespaceQualifierTokenType); }

            tokenFunctions[VectorDotOpenArrowTokenType].regex = /^\.\</;
            tokenFunctions[VectorDotOpenArrowTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != '.') return null;
                var result:* = regexFind(input, VectorDotOpenArrowTokenType);
                if (!result) return null;

                var tokens:* = result.tokens;
                var index:* = result.index;

                result = Lexer.lex(input.slice(index + 1), [NewLineTokenType, TabTokenType, SpaceTokenType, IdentifierTokenType, DotTokenType, VectorClosedArrowTokenType], true);

                tokens = tokens.concat(result.tokens);
                return getNewResult(tokens, result.index + index);
            }

            tokenFunctions[VectorClosedArrowTokenType].find = function (input:*):* { return (input.charAt(0) == '>') ? getNewResult(getNewToken(VectorClosedArrowTokenType, '>'), 0) : null; }

            tokenFunctions[StringTokenType].prefixAllowed = ["'", '"'];
            tokenFunctions[StringTokenType].find = function (input:*):*
            {
                if (input.charAt(0) != "'" && input.charAt(0) != '"') return null;

                var tokens:* = [];

                var token:* = getNewToken(StringTokenType, input.charAt(0));
                tokens.push(token);

                var i:* = 1;
                var ignore:* = false;
                var lastChar:*;
                var stringChunk:* = '';
                while (i < input.length && (input.charAt(0) != input.charAt(i) || ignore))
                {
                    if (lastChar == '\\' && input.charAt(i).match(/[\r\n]/) && !ignore)
                    {
                        if (stringChunk.length - 1 > 0)
                        {
                            token = getNewToken(StringChunkTokenType, stringChunk.slice(0, stringChunk.length - 1));
                            tokens.push(token);
                        }
                        token = getNewToken(StringMultiLineDelimiterTokenType, lastChar);
                        tokens.push(token);
                        token = getNewToken(NewLineTokenType, input.charAt(i));
                        tokens.push(token);

                        stringChunk = '';
                    }
                    else stringChunk += input.charAt(i);

                    lastChar = input.charAt(i);
                    ignore = lastChar == '\\' && !ignore;
                    i++;
                }

                if (stringChunk.length > 0)
                {
                    token = getNewToken(StringChunkTokenType, stringChunk);
                    tokens.push(token);
                }

                token = getNewToken(StringEndTokenType, input.charAt(i));
                tokens.push(token);

                return getNewResult(tokens, i);
            }

            tokenFunctions[NumberTokenType].regex1 = /^([0-9]|[\.][0-9\.]+)[0-9\.]*(e[+-][0-9]+)*/; //base 10 and exponential
            tokenFunctions[NumberTokenType].regex2 = /^0x[a-fA-F0-9]+/; //hex
            tokenFunctions[NumberTokenType].find = function (input:*):*
            {
                if (input.charAt(0) == '0' && input.charAt(1) == 'x') return regexFind(input, NumberTokenType, tokenFunctions[NumberTokenType].regex2);
                if (input.charAt(0) != '0' && input.charAt(0) != '1' && input.charAt(0) != '2' && input.charAt(0) != '3' && input.charAt(0) != '4' && input.charAt(0) != '5' && input.charAt(0) != '6' && input.charAt(0) != '7' && input.charAt(0) != '8' && input.charAt(0) != '9' && input.charAt(0) != '.') return;

                return regexFind(input, NumberTokenType, tokenFunctions[NumberTokenType].regex1);
            }

            tokenFunctions[SpaceTokenType].find = function (input:*):* { return (input.charAt(0) == ' ') ? getNewResult(getNewToken(SpaceTokenType, ' '), 0) : null; }
            tokenFunctions[TabTokenType].find = function (input:*):* { return (input.charAt(0) == '	') ? getNewResult(getNewToken(TabTokenType, '	'), 0) : null; }

            tokenFunctions[NewLineTokenType].regex = /[\r\n]/;
            tokenFunctions[NewLineTokenType].find = function (input:*):*
            {
                var tokens:*;
                var index:* = -1;
                while (input.charAt(index + 1).match(tokenFunctions[NewLineTokenType].regex))
                {
                    if (!tokens) tokens = [];

                    tokens.push(getNewToken(NewLineTokenType, input.charAt(index + 1)));
                    index++;
                }

                return (index == -1) ? null : getNewResult(tokens, index);
            }

            tokenFunctions[UFOTokenType].find = function (input:*):* { return getNewResult(getNewToken(UFOTokenType, input.charAt(0)), 0); }
        }

        public static function getNewToken(type:String, data:*):Object
        {
            return {constructor:"token", type:type, data:data, line:NaN, position:NaN};
        }

        public static function getNewResult(tokens:*, index:Number):Object
        {
            if (!(tokens is Array)) tokens = [tokens];

            return {tokens:tokens, index:index};
        }

        public static function keywordFind2(input:*, keyword:*, TokenType:*, matchNext:*, requireWhitespace:Boolean):*
        {
            if (input.substring(0, keyword.length) != keyword) return null;

            var cur = null;
            var whitespace = 0;
            var inputLength = input.length;
            for (var i = keyword.length; i < inputLength; i++)
            {
                cur = input.charAt(i);
                if (whitespaceCharacters[cur] === undefined) break;

                whitespace++;
            }

            if (requireWhitespace && whitespace === 0) return null;
            if (matchNext is String)
            {
                if (cur != matchNext) return null;
            }
            else
            {
                if (matchNext[cur] === undefined) return null;
            }

            return getNewResult(getNewToken(TokenType, keyword), keyword.length - 1);
        }

        public static function keywordFind(input:*, TokenType:*, grammer:*=null):*
        {
            for (var i:* = 0; i < tokenFunctions[TokenType].keyword.length; i++) if (tokenFunctions[TokenType].keyword.charAt(i) !== input.charAt(i)) return null;

            if (!input.charAt(i).match(tokenFunctions[TokenType].terminator)) return null;

            if (!grammer) return getNewResult(getNewToken(TokenType, tokenFunctions[TokenType].keyword), tokenFunctions[TokenType].keyword.length - 1);

            var result:* = Lexer.lex(input.slice(tokenFunctions[TokenType].keyword.length), grammer, true);

            result.tokens.unshift(getNewToken(TokenType, tokenFunctions[TokenType].keyword));
            return getNewResult(result.tokens, result.index + tokenFunctions[TokenType].keyword.length - 1);
        }

        public static function regexFind(input:*, TokenType:*, regex:*=null):*
        {
            if (!regex) regex = tokenFunctions[TokenType].regex;
            var match:* = input.match(regex);
            if (!match) return null;

            return getNewResult(getNewToken(TokenType, match[0]), match[0].length - 1);
        }
    }
}
