/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.accessibility.AccessibilityImplementation;
	import flash.display.DisplayObjectContainer;
	import flash.events.Event;
	import flash.events.FocusEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.ui.ContextMenu;
	import flash.ui.Keyboard;
	import flash.utils.getTimer;

	public class InteractiveObject extends DisplayObject
	{		
		private var $_properties:*;
		
		private var _window:Object;
		
		public function InteractiveObject()
		{
			if ($_properties === undefined) $__properties({});
					
			super();
			
			var domView:* = $_properties.DisplayObjectScope.$_domView;
			domView.style.pointerEvents = 'auto';
			
			//initializeInteractiveListeners
			var over:Boolean = false;
			var ref:InteractiveObject = this;
			var win:Object = _window = window;
			var mobile:Boolean = win.mobile;
			
			var refIsStage:Boolean = ref is Stage;
			var view:* = (refIsStage) ? Stage.$__domDocument : domView;
			
			var onDOMBodyOut:Function;
			var onMouseUp:Function;
			
			var onMouseOut:Function = function(event:*, forceDispatch:*=false):void 
			{
				if (!forceDispatch && (!visible || !$_isMouseEventDispatchable()))
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					event.originalTarget = event.target;
					return;
				}
				
				over = false;
				
				if (!mobile) $_properties.InteractiveObjectScope.$_onMouseOut = null;
				
				var clientX:Number = (mobile && event.clientX === undefined) ? getTouch(event).pageX : event.clientX;
				var clientY:Number = (mobile && event.clientY === undefined) ? getTouch(event).pageY : event.clientY;
				var localPoint:Point = globalToLocal(new Point(clientX, clientY));
				
				var mouseOutEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_OUT, true, true, localPoint.x, localPoint.y);
				mouseOutEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseOutEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseOutEvent);
				
				var mouseRollOutEvent:MouseEvent = new MouseEvent(MouseEvent.ROLL_OUT, true, true, localPoint.x, localPoint.y);
				mouseRollOutEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseRollOutEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseRollOutEvent);
				
				event.stopPropagation();;
			}
				
			var onMouseOver:Function = function(event:*, forceDispatch:*=false):void 
			{
				if (!forceDispatch && (!visible || !$_isMouseEventDispatchable()))
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					event.originalTarget = event.target;
					return;
				}
				
				if (over) return;
				over = true;
				
				if (!mobile) $_properties.InteractiveObjectScope.$_onMouseOut = onMouseOut;
				
				var clientX:Number = (mobile && event.clientX === undefined) ? getTouch(event).pageX : event.clientX;
				var clientY:Number = (mobile && event.clientY === undefined) ? getTouch(event).pageY : event.clientY;
				var localPoint:Point = globalToLocal(new Point(clientX, clientY));
				
				var mouseOverEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_OVER, true, true, localPoint.x, localPoint.y);
				mouseOverEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseOverEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseOverEvent);
				
				var mouseRollOverEvent:MouseEvent = new MouseEvent(MouseEvent.ROLL_OVER, true, true, localPoint.x, localPoint.y);
				mouseRollOverEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseRollOverEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseRollOverEvent);
				
				event.stopPropagation();;
			}
				
			var doubleClickTime:int = 0;
			var onMouseDown:Function = function(event:*, forceDispatch:*=false):void
			{	
				if (!forceDispatch && (!visible || !$_isMouseEventDispatchable()))
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					event.originalTarget = event.target;
					return;
				}
				
				if (mobile) 
				{
					$_properties.InteractiveObjectScope.$_onMouseUp = onMouseUp;
					onMouseOver(event, true);
				}
				else
				{
					win.addEventListener('mouseup', onDOMBodyOut, true);
					ref.addEventListener(Event.REMOVED_FROM_STAGE, onDOMBodyOut); //protect from garbage collection issues
				}				
				
				var clientX:Number = (mobile && event.clientX === undefined) ? getTouch(event).pageX : event.clientX;
				var clientY:Number = (mobile && event.clientY === undefined) ? getTouch(event).pageY : event.clientY;
				var localPoint:Point = globalToLocal(new Point(clientX, clientY));
				
				var mouseDownEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_DOWN, true, true, localPoint.x, localPoint.y);
				mouseDownEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;		
				mouseDownEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseDownEvent);
				
				event.stopPropagation();
				if (mobile && (event.target.nodeName != 'A' && event.target.nodeName != 'TEXTAREA' && !(event.target.contentEditable === 'true'))) event.preventDefault(); //don't prevent default on links or they will not work  //dragging won't work without
			}
			
			onMouseUp = function(event:*, forceDispatch:*=false):void 
			{
				if (!forceDispatch && (!visible || !$_isMouseEventDispatchable()))
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					event.originalTarget = event.target;
					return;
				}
				
				if (!mobile)
				{
					win.removeEventListener('mouseup', onDOMBodyOut, true);
					ref.removeEventListener(Event.REMOVED_FROM_STAGE, onDOMBodyOut); //protect from garbage collection issues
					ref.removeEventListener(Event.ADDED_TO_STAGE, onDOMBodyOut); //protect from garbage collection issues
				}
				else $_properties.InteractiveObjectScope.$_onMouseUp = null;
				
				var doDoubleClickEvent:Boolean = false;
				if (doubleClickEnabled)
				{
					doubleClickTime = getTimer() - doubleClickTime;
					if (doubleClickTime < 500) doDoubleClickEvent = true;
					else doubleClickTime = getTimer();
				}
				
				var clientX:Number = (mobile && event.clientX === undefined) ? getTouch(event).pageX : event.clientX;
				var clientY:Number = (mobile && event.clientY === undefined) ? getTouch(event).pageY : event.clientY;
				var localPoint:Point = globalToLocal(new Point(clientX, clientY));
				
				var mouseUpEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_UP, true, true, localPoint.x, localPoint.y);
				mouseUpEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseUpEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseUpEvent);
				
				var mouseClickEvent:MouseEvent = new MouseEvent(MouseEvent.CLICK, true, true, localPoint.x, localPoint.y, null, event.ctrlKey, event.altKey, event.shiftKey);
				mouseClickEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				mouseClickEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
				dispatchEvent(mouseClickEvent);
				
				if (doDoubleClickEvent) 
				{
					var mouseDoubleClickEvent:MouseEvent = new MouseEvent(MouseEvent.DOUBLE_CLICK, true, true, localPoint.x, localPoint.y);
					mouseDoubleClickEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;
					mouseDoubleClickEvent.$__properties().EventScope.$_originalTarget = event.originalTarget || event.target;	
					dispatchEvent(mouseDoubleClickEvent);
				}
				
				if (mobile) onMouseOut(event, true);
				
				event.stopPropagation();
			}
								
			onDOMBodyOut = function(event:*):void //ensure mouseout and mouseup are called in the event the user drags off the stage while pressing down, and then releases the mouse
			{
				if (event.type == 'mouseup' && domView.parent)
				{
					var target:Object = event.target;
					
					while (target)
					{
						if (target == domView) return;
						
						target = target.parentNode;
					}
				}
				
				win.removeEventListener('mouseup', onDOMBodyOut, true);
				ref.removeEventListener(Event.REMOVED_FROM_STAGE, onDOMBodyOut); //protect from garbage collection issues
				ref.removeEventListener(Event.ADDED_TO_STAGE, onDOMBodyOut); //protect from garbage collection issues

				if (event.type == Event.ADDED_TO_STAGE)
				{
					win.addEventListener('mouseup', onDOMBodyOut, true);
					ref.addEventListener(Event.REMOVED_FROM_STAGE, onDOMBodyOut); //protect from garbage collection issues
					return;	
				}
				
				if (event.type == Event.REMOVED_FROM_STAGE) 
				{
					ref.addEventListener(Event.ADDED_TO_STAGE, onDOMBodyOut); //protect from garbage collection issues					
					return;
				}
				
				if (over) onMouseOut(event);
				onMouseUp(event);
			}
				
			if (mobile) //TODO bugs need to be worked out with other browsers
			{	
				var onTouchCancel:Function = function(event:*):void 
				{
					trace('onTouchCancel');
					
					onMouseUp(event);
				}
				
				view.addEventListener('touchstart', onMouseDown, false);
				view.addEventListener('touchend', onMouseUp, false);
				view.addEventListener('touchcancel', onTouchCancel, false);
			}
			else
			{				
				view.addEventListener('mousedown', onMouseDown, false);
				view.addEventListener('mouseup', onMouseUp, false);
				view.addEventListener('mouseover', onMouseOver, false);
				view.addEventListener('mouseout', onMouseOut, false);
			}
			
			//FOCUS
			if (win.ie) //ie dispatches 'focus' aysnch, so we use 'focusin' instead   http://jsfiddle.net/3duLyr4a/5/
			{
				view.addEventListener('focusin', onFocusIn, false);
				view.addEventListener('focusout', onFocusOut, false);
			}
			else
			{
				view.addEventListener('focus', onFocusIn, false);
				view.addEventListener('blur', onFocusOut, false);
			}
			
			function onFocusIn(event:*):void
			{
				//if (!visible)
				//{
				//	event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
				//	return;
				//}
				
				var lastKeyPressedEvent:Object = Stage.$__lastKeyPressedObject;
				var keyEvent:Object = lastKeyPressedEvent || event;
				
				var focusEvent:FocusEvent;
				if (lastKeyPressedEvent === null)
				{
					focusEvent = new FocusEvent(FocusEvent.MOUSE_FOCUS_CHANGE, true, true, ref, keyEvent.shiftKey, keyEvent.which || keyEvent.keyCode);
					focusEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
					var success:Boolean = dispatchEvent(focusEvent);	
					
					if (!success) throw new Error('preventDefault not supported on FocusEvent.MOUSE_FOCUS_CHANGE');
				}
				
				focusEvent = new FocusEvent(FocusEvent.FOCUS_IN, true, false, ref, keyEvent.shiftKey, keyEvent.which || keyEvent.keyCode);
				focusEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
				dispatchEvent(focusEvent);
				
				event.stopPropagation();
			}
			
			function onFocusOut(event:*):void
			{
				//if (!visible)
				//{
				//	event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
				//	return;
				//}
				
				var keyEvent:Object = Stage.$__lastKeyPressedObject || event;
				
				var focusEvent:FocusEvent = new FocusEvent(FocusEvent.FOCUS_OUT, true, false, ref, keyEvent.shiftKey, keyEvent.which || keyEvent.keyCode);
				focusEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;
				dispatchEvent(focusEvent);
				
				event.stopPropagation();
			}
			
			view.addEventListener('keyup', onKeyUp, false);
			view.addEventListener('keydown', onKeyDown, false);
			
			function onKeyUp(event:*):void
			{
				if (!visible)
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					return;
				}
				
				var keyboardEvent:KeyboardEvent = new KeyboardEvent(KeyboardEvent.KEY_UP, true, false, event.charCode || event.keyCode, event.which || event.keyCode, event.location, event.ctrlKey, event.altKey, event.shiftKey);
				keyboardEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;
				dispatchEvent(keyboardEvent);
				
				event.stopPropagation();
			}
			
			function onKeyDown(event:*):void
			{
				if (!visible)
				{
					event.originalDisplayObjectTarget = $_getOriginalInteractiveObjectTarget(event.target);
					return;
				}
				
				var keyCode:* = event.which || event.keyCode;
				
				var keyboardEvent:KeyboardEvent = new KeyboardEvent(KeyboardEvent.KEY_DOWN, true, false, event.charCode || keyCode, keyCode, event.location, event.ctrlKey, event.altKey, event.shiftKey);
				keyboardEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;
				dispatchEvent(keyboardEvent);
				
				if (keyCode == Keyboard.TAB)
				{
					var focusEvent:FocusEvent = new FocusEvent(FocusEvent.KEY_FOCUS_CHANGE, true, true, ref, event.shiftKey, keyCode);
					focusEvent.$__properties().EventScope.$_target = event.originalDisplayObjectTarget || ref;	
					var success:Boolean = dispatchEvent(focusEvent);
					
					if (!success) event.preventDefault();
				}	
				
				event.stopPropagation();
			}
		}
		
		public override function $__notify(name:String, args:*):void
		{
			if (name === 'visibleFalse' && (_window.firefox || _window.ie)) //firefox (and maybe ie) does not automatically set focus to null when visibility is set to false, so we need to do this manually
			{
				var activeElement:* = document.activeElement;
				if (activeElement && activeElement.displayObject == this) stage.focus = null;
			}	
			
			super.$__notify(name, args);
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.InteractiveObjectScope = {$_mouseEnabled:true, $_tabEnabled:null, $_tabIndex:-1, $_role:'presentation', $_isMouseEventDispatchable:$_isMouseEventDispatchable};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public static function $_getOriginalInteractiveObjectTarget(target:*):InteractiveObject
		{
			while (target)
			{
				if (target.displayObject && target.displayObject is InteractiveObject && target.displayObject.$__properties().InteractiveObjectScope.$_isMouseEventDispatchable()) return target.displayObject as InteractiveObject;
				target = target.parentNode;	
			}
			
			return null;
		}
		
		public static function getTouch(event:*):*
		{
			if (event.touches.length) return event.touches[0];
			
			return event.changedTouches[0];
		}
		
		private function $_isMouseEventDispatchable():Boolean
		{
			if (!$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			var parent:DisplayObjectContainer = $_properties.TLScope.parent;
			while ($_properties.InteractiveObjectScope.$_mouseEnabled && parent)
			{
				var properties:* = parent.$__properties().TLScope;
				
				if (!properties.mouseChildren) return false;
				
				parent = properties.parent;
			}
			
			return true;
		}

		public function get mouseEnabled():Boolean
		{
			return $_properties.InteractiveObjectScope.$_mouseEnabled;
		}
		
		public function set mouseEnabled(enabled:Boolean):void
		{
			$_properties.InteractiveObjectScope.$_mouseEnabled = enabled;
			
			$_properties.DisplayObjectScope.$_domView.style.pointerEvents = (enabled) ? 'auto' : 'none';
		}
		
		public function get doubleClickEnabled():Boolean
		{
			return $_properties.InteractiveObjectScope.$_doubleClickEnabled;
		}
		
		public function set doubleClickEnabled(enabled:Boolean):void
		{
			$_properties.InteractiveObjectScope.$_doubleClickEnabled = enabled;
		}
		
		public UNIMPLEMENTED function set contextMenu (cm:ContextMenu):void
		{
			throw new Error('InteractiveObject: attempted call to an unimplemented function "contextMenu"');
		}

		public function get tabEnabled():Boolean
		{
			return $_properties.InteractiveObjectScope.$_tabEnabled;
		}
		
		public function set tabEnabled(enabled:Boolean):void
		{
			$_properties.InteractiveObjectScope.$_tabEnabled = enabled;
			
			if (enabled) $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', $_properties.InteractiveObjectScope.$_tabIndex);
			else $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', -1);
			
			if ($_properties.DisplayObjectScope.$_domView.getAttribute('role') != 'presentation') $_properties.InteractiveObjectScope.$_role = $_properties.DisplayObjectScope.$_domView.getAttribute('role');
			
			if (!enabled || $_properties.InteractiveObjectScope.$_tabIndex == -1) $_properties.DisplayObjectScope.$_domView.setAttribute('role', 'presentation');
			else $_properties.DisplayObjectScope.$_domView.setAttribute('role', $_properties.InteractiveObjectScope.$_role);
		}

		public function get tabIndex():int
		{
			return $_properties.InteractiveObjectScope.$_tabIndex;
		}
		
		public function set tabIndex(index:int):void
		{	
			$_properties.InteractiveObjectScope.$_tabIndex = index;
			
			if ($_properties.InteractiveObjectScope.$_tabEnabled !== false) $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', index);
			else $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', -1);
			
			var role:String = $_properties.DisplayObjectScope.$_domView.getAttribute('role');
			if (role !== 'presentation') $_properties.InteractiveObjectScope.$_role = $_properties.DisplayObjectScope.$_domView.getAttribute('role');
			
			if (($_properties.InteractiveObjectScope.$_tabEnabled === false || index === -1) && role !== 'progressbar') $_properties.DisplayObjectScope.$_domView.setAttribute('role', 'presentation');
			else $_properties.DisplayObjectScope.$_domView.setAttribute('role', $_properties.InteractiveObjectScope.$_role);
		}

		public UNIMPLEMENTED function get focusRect():Object
		{
			throw new Error('InteractiveObject: attempted call to an unimplemented function "focusRect"');
		}
		
		public UNIMPLEMENTED function set focusRect(focusRect:Object):void
		{
			throw new Error('InteractiveObject: attempted call to an unimplemented function "focusRect"');
		}

		public UNIMPLEMENTED function get accessibilityImplementation () : flash.accessibility.AccessibilityImplementation
		{
			throw new Error('InteractiveObject: attempted call to an unimplemented function "accessibilityImplementation"');
		}
		
		public UNIMPLEMENTED function set accessibilityImplementation (value:AccessibilityImplementation) : void
		{
			throw new Error('InteractiveObject: attempted call to an unimplemented function "accessibilityImplementation"');
		}
	}
}