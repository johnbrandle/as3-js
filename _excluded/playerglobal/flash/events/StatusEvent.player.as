/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class StatusEvent extends Event
	{
		public static const STATUS : String = "status";

		private var _code:String;

		public function StatusEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, code:String="", level:String="")
		{
			super(type, bubbles, cancelable);

			_code = code;
		}

		public function get code () : String
		{
			return _code;
		}

		public UNIMPLEMENTED function set code (value:String) : void
		{
			throw new Error('StatusEvent: attempted call to an unimplemented function "code"');
		}

		public UNIMPLEMENTED function get level () : String
		{
			throw new Error('StatusEvent: attempted call to an unimplemented function "level"');
		}

		public UNIMPLEMENTED function set level (value:String) : void
		{
			throw new Error('StatusEvent: attempted call to an unimplemented function "level"');
		}

		public UNIMPLEMENTED function clone () : flash.events.Event
		{
			throw new Error('StatusEvent: attempted call to an unimplemented function "clone"');
		}

		public UNIMPLEMENTED function toString () : String
		{
			throw new Error('StatusEvent: attempted call to an unimplemented function "toString"');
		}
	}
}
