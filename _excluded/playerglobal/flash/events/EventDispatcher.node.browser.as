/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.events.IEventDispatcher;
	
	public class EventDispatcher implements IEventDispatcher
	{
		private var $_properties:*;
		
		public function EventDispatcher(target:IEventDispatcher=null)
		{
			if ($_properties === undefined) $__properties({});
		
			$_properties.EventDispatcherScope.$_target = target || this;
		}
		
		public function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object.EventDispatcherScope = {$_listeners:{}};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}

		private static function $_processListeners(event:Event, listeners:Array):void
		{
			listeners = listeners.slice();

			var length:int = listeners.length;
			var properties:* = event.$__properties();
			for (var i:int = 0; i < length; i++)
			{
				var result:* = listeners[i].listener(event);

				if (result === false)
				{
					properties.TLScope.stopPropagation();
					properties.TLScope.preventDefault();
				}
				if (properties.EventScope.$_immediatePropagationStopped) return;
			}
		}

		public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if (useWeakReference) trace('Warning: useWeakReference not supported in EventDispatacher addEventListener');
			if (useCapture) trace('Warning: useCapture not supported in EventDispatacher addEventListener');
			
			/*
			if (type == Event.ENTER_FRAME)
			{
				Stage.$__addEnterFrameListener(this, listener);
				return;
			}
			*/
			
			var listenersByType:Object = $_properties.EventDispatcherScope.$_listeners;

			var obj:Object = {type:type, listener:listener, useCapture:useCapture, priority:priority, useWeakReference:useWeakReference};
			if (listenersByType[type] === undefined) listenersByType[type] = [obj];
			else 
			{
				var listeners:Array = listenersByType[type];
				var length:int = listeners.length;
				for (var i:int = length; i--;) //do not add duplicate listeners
				{
					if (listener === listeners[i].listener) return;
				}
				
				listenersByType[type].push(obj);
			}
    
			listenersByType[type].sort(function (event1:Object, event2:Object):int
			{
				if (event1.priority > event2.priority) return -1;
				if (event1.priority < event2.priority) return 1;

				return 0;
			});
		}

		public function dispatchEvent(event:Event):Boolean
		{
			var properties:* = event.$__properties().TLScope;
			var listeners:Array = $_properties.EventDispatcherScope.$_listeners[event.type];
			var target:Object = $_properties.EventDispatcherScope.$_target;
			var bubble:Boolean = false; /* properties.bubbles && $_properties.EventDispatcherScope.$_target is DisplayObject; */
			
			if (!bubble && !listeners) return !properties.isDefaultPrevented();

			/*
			var parents:Array;
			if (bubble)
			{
				parents = [];
				var currentParent:DisplayObject = target.parent;
				while (currentParent)
				{
					parents.push(currentParent);

					currentParent = currentParent.parent;
				}
			}
			*/
			
			properties = event.$__properties().EventScope;
			if (listeners && !properties.$_propagationStopped && !properties.$_immediatePropagationStopped) 
			{	
				event = properties.$_withTarget(event, target);
				properties = event.$__properties().EventScope;
				
				properties.$_eventPhase = EventPhase.AT_TARGET;
				properties.$_currentTarget = $_properties.EventDispatcherScope.$_target;
				
				$_processListeners(event, listeners);
			}

			/*
			if (bubble && !properties.$_propagationStopped && !properties.$_immediatePropagationStopped)
			{
				var index:Number = 0;
				var parentsLength:Number = parents.length;
				while (parentsLength > index)
				{
					var currentTarget:Object = parents[index];
					var currentBubbleListeners:Array = currentTarget.$__properties().EventDispatcherScope.$_listeners[event.type];
					
					if (currentBubbleListeners && currentBubbleListeners.length)
					{
						event = properties.$_withTarget(event, target);
						properties = event.$__properties().EventScope;
						
						properties.$_eventPhase = EventPhase.BUBBLING_PHASE;
						
						event.$__properties().EventScope.$_currentTarget = currentTarget;
						$_processListeners(event, currentBubbleListeners);
						
						if (properties.$_propagationStopped || properties.$_immediatePropagationStopped) break;
					}
					
					index++;
				}
			}
			 */

			properties = event.$__properties().TLScope;
			return !properties.isDefaultPrevented();
		}

		public function hasEventListener(type:String):Boolean
		{
			return $_properties.EventDispatcherScope.$_listeners[type] !== undefined;
		}

		public function removeEventListener(type:String, listener:Function, useCapture:Boolean=false):void
		{
			if (useCapture) trace('Warning: useCapture not supported in EventDispatacher removeEventListener');
			
			/*
			if (type == Event.ENTER_FRAME)
			{
				Stage.$__removeEnterFrameListener(this, listener);
				return;
			}
			*/
			
			var listenersByType:Object = $_properties.EventDispatcherScope.$_listeners;
			if (listenersByType[type] === undefined) return;
			var listeners:Array = listenersByType[type];
			var length:int = listeners.length;
			for (var i:int = length; i--;)
			{
				if (listeners[i].listener !== listener) continue;

				if (listeners.length == 1) delete listenersByType[type];
				else listeners.splice(i, 1);
			}
		}

		public function willTrigger(type:String):Boolean
		{
			return $_properties.EventDispatcherScope.$_listeners[type];
		}
	}
}
