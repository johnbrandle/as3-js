/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public class ErrorEvent extends TextEvent
	{
		private var _errorID:int = 0;

		public static const ERROR:String = 'error';

		public function get errorID():int
		{
			return _errorID;
		}

		override public function clone():Event
		{
			return new ErrorEvent(type, bubbles, cancelable, text, errorID);
		}

		public function ErrorEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, text:String = "", id:int = 0)
		{
			super(type, bubbles, cancelable, text);
			_errorID = id;
		}

		override public function toString():String
		{
			return formatToString('ErrorEvent', 'bubbles', 'cancelable', 'text', 'errorID');
		}

	}
}
