/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class HTTPStatusEvent extends Event
	{
		private var _status:int;
		
		public function HTTPStatusEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, status:int=0)
		{
			super(type, bubbles, cancelable);
			
			_status = status;
		}
		
		public static const HTTP_RESPONSE_STATUS : String = "httpResponseStatus";
		public static const HTTP_STATUS : String = "httpStatus";

		public function get responseHeaders () : Array
		{
			throw new Error('HTTPStatusEvent: attempted call to an unimplemented function "responseHeaders"');
		}

		public function set responseHeaders (value:Array) : void
		{
			throw new Error('HTTPStatusEvent: attempted call to an unimplemented function "responseHeaders"');
		}

		public function get responseURL () : String
		{
			throw new Error('HTTPStatusEvent: attempted call to an unimplemented function "responseURL"');
		}

		public function set responseURL (value:String) : void
		{
			throw new Error('HTTPStatusEvent: attempted call to an unimplemented function "responseURL"');
		}

		public function get status():int
		{
			return _status;
		}

		public override function clone():Event
		{
			return new HTTPStatusEvent(type, bubbles, cancelable, _status);
		}

		public override function toString():String
		{
			return formatToString('HTTPStatusEvent', 'type', 'bubbles', 'cancelable', 'status');
		}
	}
}
