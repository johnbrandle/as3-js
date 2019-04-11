/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.DisplayObject;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.media.SoundTransform;

	public class SimpleButton extends InteractiveObject
	{
		private var $_properties:*;
		
		private static const MOUSE_BOUNDS_STATE_OUT:int = 1;
		private static const MOUSE_BOUNDS_STATE_OVER:int = 2;
		private static const MOUSE_PRESS_STATE_DOWN:int = 3;
		private static const MOUSE_PRESS_STATE_UP:int = 4;
		
		private var _mouseBoundsState:int = MOUSE_BOUNDS_STATE_OUT;
		private var _mousePressState:int = MOUSE_PRESS_STATE_UP;
		
		private var _stage:Stage;
		
		public function SimpleButton(upState:DisplayObject=null, overState:DisplayObject=null, downState:DisplayObject=null, hitTestState:DisplayObject=null)
		{
			if ($_properties === undefined) $__properties({});
			
			super();
			
			$_properties.InteractiveObjectScope.$_tabEnabled = true;
			$_properties.DisplayObjectScope.$_domView.setAttribute('role', $_properties.InteractiveObjectScope.$_role = 'button');
			$_properties.DisplayObjectScope.$_domView.style.cursor = 'pointer';
			
			addEventListener(Event.REMOVED_FROM_STAGE, $onRemovedFromStage);
		}
		
		private function $onRemovedFromStage(event:Event):void
		{
			if (_stage)
			{
				_stage.removeEventListener(MouseEvent.MOUSE_UP, $onUpEvent);
				_stage = null;
			}
			
			_mouseBoundsState = MOUSE_BOUNDS_STATE_OUT;
			_mousePressState = MOUSE_PRESS_STATE_UP;
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.SimpleButtonScope = {$_upState:null, $_overState:null, $_downState:null, $_hitTestState:null, $_enabled:true, $_useHandCursor:true, $_currentState:null};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public override function dispatchEvent(event:Event):Boolean
		{
			if (!(event is MouseEvent) || !event.$__properties().EventScope.$_originalTarget) return super.dispatchEvent(event);
				
			if (!$_properties.SimpleButtonScope.$_hitTestState) return false;
			
			var domView:* = $_properties.DisplayObjectScope.$_domView;
			var parent:* = event.$__properties().EventScope.$_originalTarget;
			var hitTest:* = $_properties.SimpleButtonScope.$_hitTestState.$__properties().DisplayObjectScope.$_domView;
			
			var found:Boolean = parent == hitTest;
			while (parent != document.body && parent != domView)
			{
				if (parent == hitTest) 
				{
					found = true;
					break;
				}
				
				parent = parent.parentNode;
			}
			
			if (found)
			{
				var type:String = event.type;
				if (type == MouseEvent.CLICK) return $onClickEvent(event as MouseEvent);
				if (type == MouseEvent.MOUSE_OUT) return $onOutEvent(event as MouseEvent);
				if (type == MouseEvent.MOUSE_OVER) return $onOverEvent(event as MouseEvent);
				if (type == MouseEvent.MOUSE_DOWN) return $onDownEvent(event as MouseEvent);
				if (type == MouseEvent.MOUSE_UP) return $onUpEvent(event as MouseEvent);
				else return false;
			}
			
			if (event.type == MouseEvent.CLICK) return false;
			
			return super.dispatchEvent(event);
		}
		
		public function get downState () : flash.display.DisplayObject
		{
			return $_properties.SimpleButtonScope.$_downState;
		}

		public function set downState (value:DisplayObject) : void
		{
			if ($_properties.SimpleButtonScope.$_downState)
			{
				var oldState:DisplayObject = $_properties.SimpleButtonScope.$_downState;
				
				if (oldState != $_properties.SimpleButtonScope.$_upState && oldState != $_properties.SimpleButtonScope.$_overState && $_properties.SimpleButtonScope.$_currentState == oldState) 
				{
					$_properties.SimpleButtonScope.$_currentState = null;
					if (oldState != $_properties.SimpleButtonScope.$_hitTestState) $_properties.DisplayObjectScope.$_domView.removeChild(oldState.$__properties().DisplayObjectScope.$_domView);
				}
			}
			
			$_properties.SimpleButtonScope.$_downState = value;
			
			$_refreshVisualState();
		}

		public function get enabled():Boolean
		{
			return $_properties.SimpleButtonScope.$_enabled;
		}

		public function set enabled(value:Boolean):void
		{
			$_properties.SimpleButtonScope.$_enabled = value;
			
			$_properties.DisplayObjectScope.$_domView.setAttribute('aria-disabled', !value);
			
			//if (value && $_properties.InteractiveObjectScope.$_tabEnabled) $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', $_properties.InteractiveObjectScope.$_tabIndex);
			//else $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', -1);
			
			if (value && $_properties.SimpleButtonScope.$_useHandCursor) $_properties.DisplayObjectScope.$_domView.style.cursor = 'pointer';
			else $_properties.DisplayObjectScope.$_domView.style.cursor = 'auto';
			
			$_properties.DisplayObjectScope.$_domView.style.pointerEvents = (value) ? 'auto' : 'none';
		}

		public function get hitTestState () : flash.display.DisplayObject
		{
			return $_properties.SimpleButtonScope.$_hitTestState;
		}

		public function set hitTestState (value:DisplayObject):void
		{
			if ($_properties.SimpleButtonScope.$_hitTestState)
			{
				var oldHitTestState:DisplayObject = $_properties.SimpleButtonScope.$_hitTestState;
				
				if (oldHitTestState != $_properties.SimpleButtonScope.$_upState && oldHitTestState != $_properties.SimpleButtonScope.$_overState && oldHitTestState != $_properties.SimpleButtonScope.$_downState) $_properties.DisplayObjectScope.$_domView.removeChild(oldHitTestState.$__properties().DisplayObjectScope.$_domView);
			}
			
			$_properties.SimpleButtonScope.$_hitTestState = value;
			
			if (value && value != $_properties.SimpleButtonScope.$_upState && value != $_properties.SimpleButtonScope.$_overState && value != $_properties.SimpleButtonScope.$_downState) $_properties.DisplayObjectScope.$_domView.appendChild(value.$__properties().DisplayObjectScope.$_domView);
			
			$_refreshVisualState();
		}

		public function get overState () : flash.display.DisplayObject
		{
			return $_properties.SimpleButtonScope.$_overState;
		}

		public function set overState (value:DisplayObject) : void
		{
			if ($_properties.SimpleButtonScope.$_overState)
			{
				var oldState:DisplayObject = $_properties.SimpleButtonScope.$_overState;
				
				if (oldState != $_properties.SimpleButtonScope.$_upState && oldState != $_properties.SimpleButtonScope.$_downState && $_properties.SimpleButtonScope.$_currentState == oldState) 
				{
					$_properties.SimpleButtonScope.$_currentState = null;
					if (oldState != $_properties.SimpleButtonScope.$_hitTestState) $_properties.DisplayObjectScope.$_domView.removeChild(oldState.$__properties().DisplayObjectScope.$_domView);
				}
			}
			
			$_properties.SimpleButtonScope.$_overState = value;
			
			$_refreshVisualState();
		}

		public function get soundTransform () : flash.media.SoundTransform
		{
			throw new Error('SimpleButton: attempted call to an unimplemented function "soundTransform"');
		}

		public function set soundTransform (sndTransform:SoundTransform) : void
		{
			throw new Error('SimpleButton: attempted call to an unimplemented function "soundTransform"');
		}

		public function get trackAsMenu () : Boolean
		{
			throw new Error('SimpleButton: attempted call to an unimplemented function "trackAsMenu"');
		}

		public function set trackAsMenu (value:Boolean) : void
		{
			throw new Error('SimpleButton: attempted call to an unimplemented function "trackAsMenu"');
		}

		public function get upState () : flash.display.DisplayObject
		{
			return $_properties.SimpleButtonScope.$_upState;
		}

		public function set upState (value:DisplayObject) : void
		{
			if ($_properties.SimpleButtonScope.$_upState)
			{
				var oldState:DisplayObject = $_properties.SimpleButtonScope.$_upState;
				
				if (oldState != $_properties.SimpleButtonScope.$_downState && oldState != $_properties.SimpleButtonScope.$_overState && $_properties.SimpleButtonScope.$_currentState == oldState) 
				{
					$_properties.SimpleButtonScope.$_currentState = null;
					if (oldState != $_properties.SimpleButtonScope.$_hitTestState) $_properties.DisplayObjectScope.$_domView.removeChild(oldState.$__properties().DisplayObjectScope.$_domView);
				}
			}
			
			$_properties.SimpleButtonScope.$_upState = value;
			
			$_refreshVisualState();
		}
		
		private function $_refreshVisualState():void
		{
			var currentState:DisplayObject =  $_properties.SimpleButtonScope.$_currentState;
			var upState:DisplayObject = $_properties.SimpleButtonScope.$_upState;
			var downState:DisplayObject = $_properties.SimpleButtonScope.$_downState;
			var overState:DisplayObject = $_properties.SimpleButtonScope.$_overState;
			var hitTestState:DisplayObject = $_properties.SimpleButtonScope.$_hitTestState;
			var state:DisplayObject;
			if (_mousePressState == MOUSE_PRESS_STATE_DOWN) state = downState || currentState || overState || upState;
			else if (_mouseBoundsState == MOUSE_BOUNDS_STATE_OVER) state = overState || currentState || upState;
			else state = upState || currentState;
			
			if (state == null || state == currentState) return;
			
			if (currentState && currentState != $_properties.SimpleButtonScope.$_hitTestState) $_properties.DisplayObjectScope.$_domView.removeChild(currentState.$__properties().DisplayObjectScope.$_domView);
			
			if ($_properties.DisplayObjectScope.$_domView.firstChild) $_properties.DisplayObjectScope.$_domView.insertBefore(state.$__properties().DisplayObjectScope.$_domView, $_properties.DisplayObjectScope.$_domView.firstChild);
			else $_properties.DisplayObjectScope.$_domView.appendChild(state.$__properties().DisplayObjectScope.$_domView);
			
			if (hitTestState)
			{
				if (state != hitTestState) hitTestState.$__properties().DisplayObjectScope.$_domView.style.opacity = 0;
				else hitTestState.$__properties().DisplayObjectScope.$_domView.style.opacity = hitTestState.$__properties().DisplayObjectScope.$_opacity;
			}
			
			$_properties.SimpleButtonScope.$_currentState = state;
		}

		public function get useHandCursor () : Boolean
		{
			return $_properties.SimpleButtonScope.$_useHandCursor;
		}

		public function set useHandCursor (value:Boolean) : void
		{
			$_properties.SimpleButtonScope.$_useHandCursor = value;
			
			if (value) $_properties.DisplayObjectScope.$_domView.style.cursor = 'pointer';
			else $_properties.DisplayObjectScope.$_domView.style.cursor = 'auto';
		}
		
		private function $onClickEvent(event:MouseEvent):Boolean
		{	
			event.stopImmediatePropagation();
			
			if (!$_properties.SimpleButtonScope.$_enabled || !$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			event = event.clone() as MouseEvent;
			event.$__properties().EventScope.$_withTarget(event, this);
			return dispatchEvent(event);
		}
		
		private function $onOverEvent(event:MouseEvent):Boolean
		{
			_mouseBoundsState = MOUSE_BOUNDS_STATE_OVER;
			
			event.stopImmediatePropagation();
			
			if (!$_properties.SimpleButtonScope.$_enabled || !$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			$_refreshVisualState();
			
			event = event.clone() as MouseEvent;
			event.$__properties().EventScope.$_withTarget(event, this);
			return dispatchEvent(event);
		}
		
		private function $onOutEvent(event:MouseEvent):Boolean
		{
			_mouseBoundsState = MOUSE_BOUNDS_STATE_OUT;
			
			event.stopImmediatePropagation();
			
			if (!$_properties.SimpleButtonScope.$_enabled || !$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			$_refreshVisualState();
			
			event = event.clone() as MouseEvent;
			event.$__properties().EventScope.$_withTarget(event, this);
			return dispatchEvent(event);
		}
		
		private function $onDownEvent(event:MouseEvent):Boolean
		{
			_mousePressState = MOUSE_PRESS_STATE_DOWN;
			
			_stage = event.target.stage;
			_stage.addEventListener(MouseEvent.MOUSE_UP, $onUpEvent);
			
			event.stopImmediatePropagation();
			
			if (!$_properties.SimpleButtonScope.$_enabled || !$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			$_refreshVisualState();
			
			event = event.clone() as MouseEvent;
			event.$__properties().EventScope.$_withTarget(event, this);
			return dispatchEvent(event);
		}
		
		private function $onUpEvent(event:MouseEvent):Boolean
		{
			_mousePressState = MOUSE_PRESS_STATE_UP;
			
			if (_stage)
			{
				_stage.removeEventListener(MouseEvent.MOUSE_UP, $onUpEvent);
				_stage = null;
			}
			
			event.stopImmediatePropagation();
			
			if (!$_properties.SimpleButtonScope.$_enabled || !$_properties.InteractiveObjectScope.$_mouseEnabled) return false;
			
			$_refreshVisualState();
			
			event = event.clone() as MouseEvent;
			event.$__properties().EventScope.$_withTarget(event, this);
			return dispatchEvent(event);
		}
	}
}
