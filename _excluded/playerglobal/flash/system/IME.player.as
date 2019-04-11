/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.events.EventDispatcher;

	public final UNIMPLEMENTED class IME extends EventDispatcher
	{

		public static function get conversionMode () : String
		{
			throw new Error('IME: attempted call to an unimplemented function "conversionMode"');
		}

		public static function set conversionMode (mode:String) : void
		{
			throw new Error('IME: attempted call to an unimplemented function "conversionMode"');
		}


		public static function get enabled () : Boolean
		{
			throw new Error('IME: attempted call to an unimplemented function "enabled"');
		}

		public static function set enabled (enabled:Boolean) : void
		{
			throw new Error('IME: attempted call to an unimplemented function "enabled"');
		}


		public static function get isSupported () : Boolean
		{
			throw new Error('IME: attempted call to an unimplemented function "isSupported"');
		}


		public static function compositionAbandoned () : void
		{
			throw new Error('IME: attempted call to an unimplemented function "compositionAbandoned"');
		}


		public static function compositionSelectionChanged (start:int, end:int) : void
		{
			throw new Error('IME: attempted call to an unimplemented function "compositionSelectionChanged"');
		}


		public static function doConversion () : void
		{
			throw new Error('IME: attempted call to an unimplemented function "doConversion"');
		}

		public function IME ()
		{
			throw new Error('IME: attempted call to an unimplemented constructor');
		}


		public static function setCompositionString (composition:String) : void
		{
			throw new Error('IME: attempted call to an unimplemented function "setCompositionString"');
		}

	}
}
