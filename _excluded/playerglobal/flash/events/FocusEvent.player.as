/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.display.InteractiveObject;
	import flash.events.Event;

	public class FocusEvent extends Event
	{
		private var _isRelatedObjectInaccessible:Boolean;
		private var _keyCode:uint;
		private var _shiftKey:Boolean;
		private var _relatedObject:InteractiveObject;

		public static const FOCUS_IN:String = "focusIn";
		public static const FOCUS_OUT:String = "focusOut";
		public static const KEY_FOCUS_CHANGE:String = "keyFocusChange";
		public static const MOUSE_FOCUS_CHANGE:String = "mouseFocusChange";

		public function get isRelatedObjectInaccessible():Boolean
		{
			return _isRelatedObjectInaccessible;
		}

		public function set isRelatedObjectInaccessible(value:Boolean):void
		{
			_isRelatedObjectInaccessible = value;
		}

		public function get keyCode():uint
		{
			return _keyCode;
		}

		public function set keyCode(value:uint):void
		{
			_keyCode = value;
		}

		public function get relatedObject():flash.display.InteractiveObject
		{
			return _relatedObject;
		}

		public function set relatedObject(value:InteractiveObject):void
		{
			_relatedObject = value;
		}

		public function get shiftKey():Boolean
		{
			return _shiftKey;
		}

		public function set shiftKey(value:Boolean):void
		{
			_shiftKey = value;
		}

		override public function clone():flash.events.Event
		{
			return new FocusEvent(type, bubbles, cancelable, relatedObject, shiftKey, keyCode);
		}

		public function FocusEvent(type:String, bubbles:Boolean = true, cancelable:Boolean = false, relatedObject:InteractiveObject = null, shiftKey:Boolean = false, keyCode:uint = 0)
		{
			super(type, bubbles, cancelable);
			
			_relatedObject = relatedObject;
			_shiftKey = shiftKey;
			_keyCode = keyCode;
		}

		override public function toString():String
		{
			return formatToString('FocusEvent', 'type', 'bubbles', 'cancelable', 'relatedObject', 'shiftKey', 'keyCode');
		}

	}
}
