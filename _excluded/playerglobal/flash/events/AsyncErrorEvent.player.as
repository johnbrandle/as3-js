/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class AsyncErrorEvent extends ErrorEvent
	{
		public static const ASYNC_ERROR:String = "asyncError";

		public var error:Error;

		public function AsyncErrorEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, text:String = "", error:Error = null)
		{
			super(type, bubbles, cancelable, text, (error) ? error.errorID : 0);
			this.error = error;
		}

		override public function clone():Event
		{
			return new AsyncErrorEvent(type, bubbles, cancelable, text, error);
		}

		override public function toString():String
		{
			return formatToString('AsyncErrorEvent', 'type', 'bubbles', 'cancelable', 'text', 'error');
		}

	}
}
