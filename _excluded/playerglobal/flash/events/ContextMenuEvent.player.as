/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.display.InteractiveObject;

	public UNIMPLEMENTED class ContextMenuEvent extends Event
	{
		private var _contextMenuOwner:InteractiveObject;
		private var _isMouseTargetInaccessible:Boolean;
		private var _mouseTarget:InteractiveObject;

		public static const MENU_ITEM_SELECT:String = "menuItemSelect";

		public static const MENU_SELECT:String = "menuSelect";

		public function get contextMenuOwner():InteractiveObject
		{
			return _contextMenuOwner;
		}

		public function set contextMenuOwner(value:InteractiveObject):void
		{
			_contextMenuOwner = value;
		}

		public function get isMouseTargetInaccessible():Boolean
		{
			return _isMouseTargetInaccessible;
		}

		public function set isMouseTargetInaccessible(value:Boolean):void
		{
			_isMouseTargetInaccessible = value;
		}

		public function get mouseTarget():InteractiveObject
		{
			return _mouseTarget;
		}

		public function set mouseTarget(value:InteractiveObject):void
		{
			_mouseTarget = value;
		}

		override public function clone():Event
		{
			return new ContextMenuEvent(type, bubbles, cancelable, mouseTarget, contextMenuOwner);
		}

		public function ContextMenuEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, mouseTarget:InteractiveObject = null, contextMenuOwner:InteractiveObject = null)
		{
			super(type, bubbles, cancelable);
			_mouseTarget = mouseTarget;
			_contextMenuOwner = contextMenuOwner;
		}

		override public function toString():String
		{
			return formatToString('ContextMenuEvent', 'type', 'bubbles', 'cancelable', 'mouseTarget', 'contextMenuOwner');
		}

	}
}
