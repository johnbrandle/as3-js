/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.as3_js.core
{
	import sweetrush.as3_js.AS3_JS;
	import sweetrush.as3_js.obj.Token;

	public class Lexer
    {
        private static var grammar:Array = [
            Token.SpaceTokenType,
            Token.TabTokenType,
            Token.EOSTokenType,
            Token.NewLineTokenType,
            Token.OpenBracketTokenType,
            Token.ClosedBracketTokenType,
            Token.OpenParenTokenType,
            Token.ClosedParenTokenType,
            Token.VectorDotOpenArrowTokenType,
            Token.XMLTokenType,
            Token.XMLCDATATokenType,
            Token.EqualityTokenType,
            Token.BitwiseLeftShiftAssignmentTokenType,
            Token.BitwiseUnsignedRightShiftAssignmentTokenType,
            Token.BitwiseRightShiftAssignmentTokenType,
            Token.BitwiseLeftShiftTokenType,
            Token.BitwiseUnsignedRightShiftTokenType,
            Token.BitwiseRightShiftTokenType,
            Token.RelationalTokenType,
            Token.AddWithAssignmentTokenType,
            Token.DivWithAssignmentTokenType,
            Token.ModWithAssignmentTokenType,
            Token.MulWithAssignmentTokenType,
            Token.SubWithAssignmentTokenType,
            Token.AssignmentTokenType,
            Token.NamespaceQualifierTokenType,
            Token.ColonTokenType,
            Token.CommaTokenType,
            Token.BooleanTokenType,
            Token.StringTokenType,
            Token.AsTokenType,
            Token.DeleteTokenType,
            Token.IfTokenType,
            Token.ElseTokenType,
            Token.EachTokenType,
            Token.ForTokenType,
            Token.WhileTokenType,
            Token.DoTokenType,
            Token.TryTokenType,
            Token.CatchTokenType,
            Token.BreakTokenType,
            Token.InTokenType,
            Token.ContinueTokenType,
            Token.DefaultTokenType,
            Token.ConstTokenType,
            Token.WithTokenType,
            Token.FinallyTokenType,
            Token.ThisTokenType,
            Token.TypeofTokenType,
            Token.NullTokenType,
            Token.UndefinedTokenType,
            Token.VoidTokenType,
            Token.SuperTokenType,
            Token.ReturnTokenType,
            Token.ThrowTokenType,
            Token.TernaryTokenType,
            Token.ClassTokenType,
            Token.ImportTokenType,
            Token.ExtendsTokenType,
            Token.ImplementsTokenType,
            Token.OverrideTokenType,
            Token.StaticTokenType,
            Token.DynamicTokenType,
            Token.InterfaceTokenType,
            Token.FinalTokenType,
            Token.NamespaceKeywordTokenType,
            Token.NewTokenType,
            Token.UseTokenType,
            Token.CaseTokenType,
            Token.FunctionTokenType,
            Token.VarTokenType,
            Token.NumberTokenType,
            Token.AndWithAssignmentTokenType,
            Token.OrWithAssignmentTokenType,
            Token.AndTokenType,
            Token.OrTokenType,
            Token.BitwiseAndAssignmentTokenType,
            Token.BitwiseOrAssignmentTokenType,
            Token.BitwiseXorAssignmentTokenType,
            Token.BitwiseAndTokenType,
            Token.BitwiseNotTokenType,
            Token.BitwiseOrTokenType,
            Token.BitwiseXorTokenType,
            Token.AtTokenType,
            Token.SwitchTokenType,
            Token.DotDotTokenType,
            Token.DotTokenType,
            Token.NotTokenType,
            Token.IncrementTokenType,
            Token.DecrementTokenType,
            Token.OpenBraceTokenType,
            Token.ClosedBraceTokenType,
            Token.PackageTokenType,
            Token.IsTokenType,
            Token.NaNTokenType,
            Token.InstanceofTokenType,
            Token.IdentifierTokenType,
            Token.CommentTokenType,
            Token.MultiLineCommentTokenType,
            Token.AddTokenType,
            Token.SubTokenType,
            Token.RegExpTokenType,
            Token.DivTokenType,
            Token.MulTokenType,
            Token.ModTokenType,
            Token.UFOTokenType];

        public static function lex(input:String, grammar:Array=null, internal_:*=null):*
        {
            var s:* = (new Date()).getTime();

            if (!grammar) grammar = Lexer.grammar;
            if (!internal_) input = input.split(/\r\n/).join('\n');

            var token:*;
            var tokens:* = [];
            var matcherObj:* = matcher(input, grammar, internal_);
            while ((token = matcherObj.find()) != null) tokens.push(token);

            if (AS3_JS.DEBUG >= 5 && !internal_) trace('Tokens length: ' + tokens.length + ', Total time: ' + (((new Date()).getTime() - s) / 1000) + ' seconds.\n');

            return Token.getNewResult(tokens, matcherObj.getIndex());
        }

        private static function matcher(input:*, grammar:*, internal_:*):*
        {
            var tokensIndex:* = 0;
            var tokens:* = [];
            var currentLine:* = 1;
            var currentPosition:* = 0;
            var length:* = input.length;
            var foundTokens:* = [];

            var find:* = function():*
            {
                if (tokens.length)
                {
                    var token:* = tokens[tokensIndex];
                    if (token.type == Token.NewLineTokenType)
                    {
                        token.position = currentPosition + 1;
                        token.line = currentLine;

                        currentLine++;
                        currentPosition = 0;
                    }
                    else
                    {
                        token.position = currentPosition + 1;
                        token.line = currentLine;
                        currentPosition += token.data.length;
                    }

                    if (AS3_JS.DEBUG >= 4 && !internal_) trace(token.line + ' : ' + token.position + ' : ' + token.type.name + ' => ' + token.data);

                    if (++tokensIndex == tokens.length)
                    {
                        tokens = [];
                        tokensIndex = 0;
                    }

                    return token;
                }

                if (!input.length) return null;

                var grammarLength:* = grammar.length;
                for (var i:* = 0; i < grammarLength; i++)
                {
                    var type:* = grammar[i];

                    var result:* = Token.tokenFunctions[type].find(input, foundTokens);
                    if (result)
                    {
                        input = input.slice(result.index + 1);
                        tokens = result.tokens;
                        tokensIndex = 0;

                        foundTokens.push(tokens);

                        return find();
                    }
                }

                if (!internal_ && input.length) throw new Error('Unknown token found on line ' + currentLine + ', at position ' + (currentPosition + 1));

                return null;
            };

            var getIndex:* = function():*
            {
                return length - input.length;
            };

            var api:* = {};
            api.find = find;
            api.getIndex = getIndex;

            return api;
        }
    }
}
