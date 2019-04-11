/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.text.ime.IIMEClient;
	import flash.events.Event;

	public UNIMPLEMENTED class IMEEvent extends TextEvent
	{
		public static const IME_COMPOSITION : String = "imeComposition";

		public static const IME_START_COMPOSITION : String = "imeStartComposition";

		public function get imeClient () : flash.text.ime.IIMEClient
		{
			throw new Error('IMEEvent: attempted call to an unimplemented function "imeClient"');
		}

		public function set imeClient (value:IIMEClient) : void
		{
			throw new Error('IMEEvent: attempted call to an unimplemented function "imeClient"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('IMEEvent: attempted call to an unimplemented function "clone"');
		}

		public function IMEEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, text:String="", imeClient:IIMEClient=null)
		{
			throw new Error('IMEEvent: attempted call to an unimplemented constructor');
		}

		public function toString () : String
		{
			throw new Error('IMEEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
