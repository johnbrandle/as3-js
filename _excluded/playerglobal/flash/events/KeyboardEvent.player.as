/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public class KeyboardEvent extends Event
	{
		public static const KEY_DOWN : String = "keyDown";
		public static const KEY_UP : String = "keyUp";

		
		private var _charCode:uint;
		private var _keyCode:uint;
		private var _keyLocation:uint;
		private var _ctrlKey:Boolean;
		private var _altKey:Boolean;
		private var _shiftKey:Boolean;
		
		public function KeyboardEvent (type:String, bubbles:Boolean=true, cancelable:Boolean=false, charCodeValue:uint=0, keyCodeValue:uint=0, keyLocationValue:uint=0, ctrlKeyValue:Boolean=false, altKeyValue:Boolean=false, shiftKeyValue:Boolean=false)
		{
			super(type, bubbles, cancelable);
			
			_charCode = charCodeValue;
			_keyCode = keyCodeValue;
			_keyLocation = keyLocationValue;
			_ctrlKey = ctrlKeyValue;
			_altKey = altKeyValue;
			_shiftKey = shiftKeyValue;
		}
		
		public function get altKey () : Boolean
		{
			return _altKey;
		}

		public function set altKey (value:Boolean) : void
		{
			_altKey = value;
		}

		public function get charCode () : uint
		{
			return _charCode;
		}

		public function set charCode (value:uint) : void
		{
			_charCode = value;
		}

		public function get ctrlKey () : Boolean
		{
			return _ctrlKey;
		}

		public function set ctrlKey (value:Boolean) : void
		{
			_ctrlKey = value;
		}

		public function get keyCode () : uint
		{
			return _keyCode;
		}

		public function set keyCode (value:uint) : void
		{
			_keyCode = value;
		}

		public function get keyLocation () : uint
		{
			return _keyLocation;
		}

		public function set keyLocation (value:uint) : void
		{
			_keyLocation = value;
		}

		public function get shiftKey () : Boolean
		{
			return _shiftKey;
		}

		public function set shiftKey (value:Boolean) : void
		{
			_shiftKey = shiftKey;
		}

		public function clone () : flash.events.Event
		{
			return new KeyboardEvent(type, bubbles, cancelable, _charCode, _keyCode, _keyLocation, _ctrlKey, _altKey, _shiftKey);
		}

		public UNIMPLEMENTED function toString () : String
		{
			throw new Error('KeyboardEvent: attempted call to an unimplemented function "toString"');
		}

		public UNIMPLEMENTED function updateAfterEvent () : void
		{
			throw new Error('KeyboardEvent: attempted call to an unimplemented function "updateAfterEvent"');
		}

	}
}
