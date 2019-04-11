/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class SecurityErrorEvent extends ErrorEvent
	{
		public function SecurityErrorEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, text:String="", id:int=0)
		{
			super(type, bubbles, cancelable, text, id);
		}
		
		public static const SECURITY_ERROR : String = "securityError";

		public override function clone():flash.events.Event
		{
			return new SecurityErrorEvent(type, bubbles, cancelable, text, errorID);
		}

		public override function toString():String
		{
			return formatToString('SecurityErrorEvent', 'bubbles', 'cancelable', 'text', 'errorID');
		}
	}
}
