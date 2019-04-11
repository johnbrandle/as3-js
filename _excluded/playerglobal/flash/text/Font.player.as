/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	public class Font 
	{

		public UNIMPLEMENTED function get fontName () : String
		{
			throw new Error('Font: attempted call to an unimplemented function "fontName"');
		}


		public UNIMPLEMENTED function get fontStyle () : String
		{
			throw new Error('Font: attempted call to an unimplemented function "fontStyle"');
		}


		public UNIMPLEMENTED function get fontType () : String
		{
			throw new Error('Font: attempted call to an unimplemented function "fontType"');
		}


		public static function enumerateFonts (enumerateDeviceFonts:Boolean=false) : Array
		{
			return []; //todo
		}

		public function Font ()
		{
			throw new Error('Font: attempted call to an unimplemented constructor');
		}


		public UNIMPLEMENTED function hasGlyphs (str:String) : Boolean
		{
			throw new Error('Font: attempted call to an unimplemented function "hasGlyphs"');
		}


		public static function registerFont (font:*) : void
		{
			//todo
		}

	}
}
