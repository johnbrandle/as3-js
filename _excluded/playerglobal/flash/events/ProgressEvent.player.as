/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class ProgressEvent extends Event
	{		
		public static const PROGRESS : String = "progress";

		public static const SOCKET_DATA : String = "socketData";
	
		private var _bytesLoaded:Number;
		private var _bytesTotal:Number;
		
		public function ProgressEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, bytesLoaded:Number=0, bytesTotal:Number=0)
		{
			super(type, bubbles, cancelable);
			
			_bytesLoaded = bytesLoaded;
			_bytesTotal = bytesTotal;
		}
	
		public function get bytesLoaded():Number
		{
			return _bytesLoaded;
		}

		public function set bytesLoaded(value:Number):void
		{
			_bytesLoaded = value;
		}

		public function get bytesTotal():Number
		{
			return _bytesTotal;
		}

		public function set bytesTotal(value:Number):void
		{
			_bytesTotal = value;
		}

		public override function clone():flash.events.Event
		{
			return new ProgressEvent(type, bubbles, cancelable, bytesLoaded, bytesTotal);
		}

		public override function toString():String
		{
			return formatToString('ProgressEvent', 'type', 'bubbles', 'cancelable', 'bytesLoaded', 'bytesTotal');
		}

	}
}
