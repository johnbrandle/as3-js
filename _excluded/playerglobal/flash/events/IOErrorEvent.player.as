/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class IOErrorEvent extends ErrorEvent
	{
		public static const DISK_ERROR : String = "diskError";
		public static const IO_ERROR : String = "ioError";
		public static const NETWORK_ERROR : String = "networkError";
		public static const VERIFY_ERROR : String = "verifyError";

		public function IOErrorEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, text:String="", id:int=0)
		{
			super(type, bubbles, cancelable, text, id);
		}
		
		public override function clone():Event
		{
			return new IOErrorEvent(type, bubbles, cancelable, text, errorID);
		}

		override public function toString():String
		{
			return formatToString('IOErrorEvent', 'bubbles', 'cancelable', 'text', 'errorID');
		}
	}
}
