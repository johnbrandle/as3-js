/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class ActivityEvent extends Event
	{
		private var _activating:Boolean;
		
		public static const ACTIVITY:String = "activity";

		public function get activating():Boolean
		{
			return _activating;
		}

		public function set activating(value:Boolean):void
		{
			_activating = value;
		}

		public function ActivityEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, activating:Boolean = false)
		{
			super(type, bubbles, cancelable);
			_activating = activating;
		}

		override public function clone():Event
		{
			return new ActivityEvent(type, bubbles, cancelable, activating);
		}

		override public function toString():String
		{
			return formatToString('ActivityEvent', 'type', 'bubbles', 'cancelable', 'activating');
		}

	}
}
