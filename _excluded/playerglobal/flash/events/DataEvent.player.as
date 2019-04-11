/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class DataEvent extends TextEvent
	{
		private var _data:String;

		public static const DATA:String = "data";

		public static const UPLOAD_COMPLETE_DATA:String = "uploadCompleteData";

		public function get data():String
		{
			return _data;
		}

		public function set data(value:String):void
		{
			data = value;
		}

		override public function clone():flash.events.Event
		{
			return new DataEvent(type, bubbles, cancelable, data);
		}

		public function DataEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, data:String = "")
		{
			super(type, bubbles, cancelable);
			_data = data;
		}

		override public function toString():String
		{
			return formatToString('DataEvent', 'bubbles', 'cancelable', 'data');
		}
	}
}
