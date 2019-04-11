/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class NetStatusEvent extends Event
	{
		private var $_info:Object;
	
		public static const NET_STATUS : String = "netStatus";

		public function get info () : Object
		{
			return $_info;
		}

		public function set info (value:Object) : void
		{
			$_info = value;
		}

		public function clone () : flash.events.Event
		{
			return new NetStatusEvent(type, bubbles, cancelable, $_info);
		}

		public function NetStatusEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, info:Object=null)
		{
			super(type, bubbles, cancelable);
			
			$_info = info;
		}

		public function toString () : String
		{
			return formatToString('NetStatusEvent', 'type', 'bubbles', 'cancelable', 'info');
		}

	}
}
