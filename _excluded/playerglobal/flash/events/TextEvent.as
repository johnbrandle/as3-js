/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public class TextEvent extends Event
	{
		private var _text:String;

		public static const LINK:String = "link";
		public static const TEXT_INPUT:String = "textInput";

		public function get text():String
		{
			return _text;
		}

		public function set text(value:String):void
		{
			_text = value;
		}

		override public function clone():Event
		{
			return new TextEvent(type, bubbles, cancelable, text);
		}

		public function TextEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, text:String = "")
		{
			super(type, bubbles, cancelable);
			_text = text;
		}

		override public function toString():String
		{
			return formatToString('TextEvent', 'bubbles', 'cancelable', 'text');
		}

	}
}
