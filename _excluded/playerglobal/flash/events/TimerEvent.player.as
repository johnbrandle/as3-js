/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public class TimerEvent extends Event
	{
		public static const TIMER : String = "timer";

		public static const TIMER_COMPLETE : String = "timerComplete";

		public override function clone () : flash.events.Event
		{
			return new TimerEvent(type, bubbles, cancelable);
		}

		public function TimerEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}

		public override function toString () : String
		{
			throw new Error('TimerEvent: attempted call to an unimplemented function "toString"');
		}

		public function updateAfterEvent () : void
		{
			throw new Error('TimerEvent: attempted call to an unimplemented function "updateAfterEvent"');
		}

	}
}
