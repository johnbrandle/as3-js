/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.TextJustifier;

	public final UNIMPLEMENTED class EastAsianJustifier extends TextJustifier
	{
		public function get composeTrailingIdeographicSpaces () : Boolean
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented function "composeTrailingIdeographicSpaces"');
		}

		public function set composeTrailingIdeographicSpaces (value:Boolean) : void
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented function "composeTrailingIdeographicSpaces"');
		}


		public function get justificationStyle () : String
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented function "justificationStyle"');
		}

		public function set justificationStyle (value:String) : void
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented function "justificationStyle"');
		}

		public function clone () : flash.text.engine.TextJustifier
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented function "clone"');
		}


		public function EastAsianJustifier (locale:String="ja", lineJustification:String="allButLast", justificationStyle:String="pushInKinsoku")
		{
			throw new Error('EastAsianJustifier: attempted call to an unimplemented constructor');
		}

	}
}
