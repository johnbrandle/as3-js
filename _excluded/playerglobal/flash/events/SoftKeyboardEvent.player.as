/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.display.InteractiveObject;

	public UNIMPLEMENTED class SoftKeyboardEvent extends Event
	{
		public static const SOFT_KEYBOARD_ACTIVATE : String = "softKeyboardActivate";

		public static const SOFT_KEYBOARD_ACTIVATING : String = "softKeyboardActivating";

		public static const SOFT_KEYBOARD_DEACTIVATE : String = "softKeyboardDeactivate";

		public function get relatedObject () : flash.display.InteractiveObject
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented function "relatedObject"');
		}

		public function set relatedObject (value:InteractiveObject) : void
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented function "relatedObject"');
		}

		public function get triggerType () : String
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented function "triggerType"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented function "clone"');
		}

		public function SoftKeyboardEvent (type:String, bubbles:Boolean, cancelable:Boolean, relatedObjectVal:InteractiveObject, triggerTypeVal:String)
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented constructor');
		}

		public function toString () : String
		{
			throw new Error('SoftKeyboardEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
