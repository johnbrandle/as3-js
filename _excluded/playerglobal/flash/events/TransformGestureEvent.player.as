/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public UNIMPLEMENTED class TransformGestureEvent extends GestureEvent
	{
		public static const GESTURE_PAN : String = "gesturePan";
		public static const GESTURE_ROTATE : String = "gestureRotate";
		public static const GESTURE_SWIPE : String = "gestureSwipe";
		public static const GESTURE_ZOOM : String = "gestureZoom";

		public function get offsetX () : Number
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "offsetX"');
		}

		public function set offsetX (value:Number) : void
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "offsetX"');
		}

		public function get offsetY () : Number
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "offsetY"');
		}

		public function set offsetY (value:Number) : void
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "offsetY"');
		}

		public function get rotation () : Number
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "rotation"');
		}

		public function set rotation (value:Number) : void
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "rotation"');
		}

		public function get scaleX () : Number
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "scaleX"');
		}

		public function set scaleX (value:Number) : void
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "scaleX"');
		}

		public function get scaleY () : Number
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "scaleY"');
		}

		public function set scaleY (value:Number) : void
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "scaleY"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "clone"');
		}

		public function toString () : String
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented function "toString"');
		}

		public function TransformGestureEvent (type:String, bubbles:Boolean=true, cancelable:Boolean=false, phase:String=null, localX:Number=0, localY:Number=0, scaleX:Number=1, scaleY:Number=1, rotation:Number=0, offsetX:Number=0, offsetY:Number=0, ctrlKey:Boolean=false, altKey:Boolean=false, shiftKey:Boolean=false)
		{
			throw new Error('TransformGestureEvent: attempted call to an unimplemented constructor');
		}

	}
}
