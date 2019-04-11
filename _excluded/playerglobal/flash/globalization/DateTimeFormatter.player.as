/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.globalization
{
	public final UNIMPLEMENTED class DateTimeFormatter 
	{
		public function get actualLocaleIDName () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "actualLocaleIDName"');
		}

		public function get lastOperationStatus () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "lastOperationStatus"');
		}

		public function get requestedLocaleIDName () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "requestedLocaleIDName"');
		}

		public function DateTimeFormatter (requestedLocaleIDName:String, dateStyle:String="long", timeStyle:String="long")
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented constructor');
		}

		public function format (dateTime:Date) : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "format"');
		}

		public function formatUTC (dateTime:Date) : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "formatUTC"');
		}

		public static function getAvailableLocaleIDNames () : Vector.<String>
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getAvailableLocaleIDNames"');
		}

		public function getDateStyle () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getDateStyle"');
		}

		public function getDateTimePattern () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getDateTimePattern"');
		}

		public function getFirstWeekday () : int
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getFirstWeekday"');
		}

		public function getMonthNames (nameStyle:String="full", context:String="standalone") : Vector.<String>
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getMonthNames"');
		}

		public function getTimeStyle () : String
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getTimeStyle"');
		}

		public function getWeekdayNames (nameStyle:String="full", context:String="standalone") : Vector.<String>
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "getWeekdayNames"');
		}

		public function setDateTimePattern (pattern:String) : void
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "setDateTimePattern"');
		}

		public function setDateTimeStyles (dateStyle:String, timeStyle:String) : void
		{
			throw new Error('DateTimeFormatter: attempted call to an unimplemented function "setDateTimeStyles"');
		}

	}
}
