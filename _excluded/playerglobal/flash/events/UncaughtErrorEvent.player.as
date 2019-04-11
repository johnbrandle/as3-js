/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public UNIMPLEMENTED class UncaughtErrorEvent extends ErrorEvent
	{
		public static const UNCAUGHT_ERROR : String = "uncaughtError";

		public function get error () : *
		{
			throw new Error('UncaughtErrorEvent: attempted call to an unimplemented function "error"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('UncaughtErrorEvent: attempted call to an unimplemented function "clone"');
		}

		public function toString () : String
		{
			throw new Error('UncaughtErrorEvent: attempted call to an unimplemented function "toString"');
		}

		public function UncaughtErrorEvent (type:String="uncaughtError", bubbles:Boolean=true, cancelable:Boolean=true, error_in:*=null)
		{
			throw new Error('UncaughtErrorEvent: attempted call to an unimplemented constructor');
		}

	}
}
