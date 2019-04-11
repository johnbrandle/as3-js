/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.display.InteractiveObject;

	public UNIMPLEMENTED class TouchEvent extends Event
	{
		public static const PROXIMITY_BEGIN : String;
		public static const PROXIMITY_END : String;
		public static const PROXIMITY_MOVE : String;
		public static const PROXIMITY_OUT : String;
		public static const PROXIMITY_OVER : String;
		public static const PROXIMITY_ROLL_OUT : String;
		public static const PROXIMITY_ROLL_OVER : String;

		public static const TOUCH_BEGIN : String = "touchBegin";
		public static const TOUCH_END : String = "touchEnd";
		public static const TOUCH_MOVE : String = "touchMove";
		public static const TOUCH_OUT : String = "touchOut";
		public static const TOUCH_OVER : String = "touchOver";
		public static const TOUCH_ROLL_OUT : String = "touchRollOut";
		public static const TOUCH_ROLL_OVER : String = "touchRollOver";
		public static const TOUCH_TAP : String = "touchTap";

		public function get altKey () : Boolean
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "altKey"');
		}

		public function set altKey (value:Boolean) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "altKey"');
		}

		public function get ctrlKey () : Boolean
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "ctrlKey"');
		}

		public function set ctrlKey (value:Boolean) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "ctrlKey"');
		}

		public function get isPrimaryTouchPoint () : Boolean
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "isPrimaryTouchPoint"');
		}

		public function set isPrimaryTouchPoint (value:Boolean) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "isPrimaryTouchPoint"');
		}

		public function get isRelatedObjectInaccessible () : Boolean
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "isRelatedObjectInaccessible"');
		}

		public function set isRelatedObjectInaccessible (value:Boolean) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "isRelatedObjectInaccessible"');
		}

		public function get localX () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "localX"');
		}

		public function set localX (value:Number) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "localX"');
		}

		public function get localY () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "localY"');
		}

		public function set localY (value:Number) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "localY"');
		}

		public function get pressure () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "pressure"');
		}

		public function set pressure (value:Number) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "pressure"');
		}

		public function get relatedObject () : flash.display.InteractiveObject
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "relatedObject"');
		}

		public function set relatedObject (value:InteractiveObject) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "relatedObject"');
		}

		public function get shiftKey () : Boolean
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "shiftKey"');
		}

		public function set shiftKey (value:Boolean) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "shiftKey"');
		}

		public function get sizeX () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "sizeX"');
		}

		public function set sizeX (value:Number) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "sizeX"');
		}

		public function get sizeY () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "sizeY"');
		}

		public function set sizeY (value:Number) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "sizeY"');
		}

		public function get stageX () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "stageX"');
		}

		public function get stageY () : Number
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "stageY"');
		}

		public function get touchPointID () : int
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "touchPointID"');
		}

		public function set touchPointID (value:int) : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "touchPointID"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "clone"');
		}

		public function toString () : String
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "toString"');
		}

		public function TouchEvent (type:String, bubbles:Boolean=true, cancelable:Boolean=false, touchPointID:int=0, isPrimaryTouchPoint:Boolean=false, localX:Number=NaN, localY:Number=NaN, sizeX:Number=NaN, sizeY:Number=NaN, pressure:Number=NaN, relatedObject:InteractiveObject=null, ctrlKey:Boolean=false, altKey:Boolean=false, shiftKey:Boolean=false)
		{
			throw new Error('TouchEvent: attempted call to an unimplemented constructor');
		}

		public function updateAfterEvent () : void
		{
			throw new Error('TouchEvent: attempted call to an unimplemented function "updateAfterEvent"');
		}

	}
}
