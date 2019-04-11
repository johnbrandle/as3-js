/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class PressAndTapGestureEvent extends GestureEvent
	{
		public static const GESTURE_PRESS_AND_TAP : String = "gesturePressAndTap";

		public function get tapLocalX () : Number
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapLocalX"');
		}

		public function set tapLocalX (value:Number) : void
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapLocalX"');
		}

		public function get tapLocalY () : Number
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapLocalY"');
		}

		public function set tapLocalY (value:Number) : void
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapLocalY"');
		}

		public function get tapStageX () : Number
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapStageX"');
		}

		public function get tapStageY () : Number
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "tapStageY"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "clone"');
		}

		public function PressAndTapGestureEvent (type:String, bubbles:Boolean=true, cancelable:Boolean=false, phase:String=null, localX:Number=0, localY:Number=0, tapLocalX:Number=0, tapLocalY:Number=0, ctrlKey:Boolean=false, altKey:Boolean=false, shiftKey:Boolean=false)
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented constructor');
		}

		public function toString () : String
		{
			throw new Error('PressAndTapGestureEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
