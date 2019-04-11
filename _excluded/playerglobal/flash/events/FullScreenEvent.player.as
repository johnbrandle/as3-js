/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class FullScreenEvent extends ActivityEvent
	{
		private var _fullScreen:Boolean;
		
		public static const FULL_SCREEN:String = "fullScreen";

		public function get fullScreen():Boolean
		{
			return _fullScreen;
		}

		override public function clone():Event
		{
			return new FullScreenEvent(type, bubbles, cancelable, fullScreen);
		}

		public function FullScreenEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, fullScreen:Boolean = false)
		{
			super(type, bubbles, cancelable);
			_fullScreen = fullScreen;
		}

		override public function toString():String
		{
			return formatToString('FullScreenEvent', 'type', 'bubbles', 'cancelable', 'fullScreen');
		}

	}
}
