/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.globalization
{
	public final UNIMPLEMENTED class LocaleID 
	{
		public static const DEFAULT : String = "i-default";

		public function get lastOperationStatus () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "lastOperationStatus"');
		}

		public function get name () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "name"');
		}

		public static function determinePreferredLocales (want:Vector.<String>, have:Vector.<String>, keyword:String="userinterface") : Vector.<String>
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "determinePreferredLocales"');
		}

		public function getKeysAndValues () : Object
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "getKeysAndValues"');
		}

		public function getLanguage () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "getLanguage"');
		}

		public function getRegion () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "getRegion"');
		}

		public function getScript () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "getScript"');
		}

		public function getVariant () : String
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "getVariant"');
		}

		public function isRightToLeft () : Boolean
		{
			throw new Error('LocaleID: attempted call to an unimplemented function "isRightToLeft"');
		}

		public function LocaleID (name:String)
		{
			throw new Error('LocaleID: attempted call to an unimplemented constructor');
		}

	}
}
