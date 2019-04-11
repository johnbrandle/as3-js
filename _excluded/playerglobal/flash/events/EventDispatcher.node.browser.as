/**
 * Copyright (c) 2008-2014 CoreMedia AG, Hamburg. Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this software except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */

/**
 * NOTICE: FILE HAS BEEN CHANGED FROM ORIGINAL
 *
 * @contributor	 John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	/* import flash.display.DisplayObject; */
	/* import flash.display.Stage; */
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
			
			var listenersLength:uint = listeners.length;
			var properties:* = event.$__properties();
			for (var i:uint = 0; i < listenersLength; i++) 
			{
				if (listeners[i].method(event) === false) 
				{
					properties.TLScope.stopPropagation();
					properties.TLScope.preventDefault();
				}
				if (properties.EventScope.$_immediatePropagationStopped) break;
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

			var eventObj:Object = {type:type, method:listener, useCapture:useCapture, priority:priority, useWeakReference:useWeakReference};
			if (!(type in listenersByType)) listenersByType[type] = [eventObj];
			else 
			{
				var listeners:Array = listenersByType[type];
				for (var i:int = listeners.length; i--;) //do not add duplicate listeners
				{
					if (listener == listeners[i].method) return;
				}
				
				listenersByType[type].push(eventObj);
			}
    
			listenersByType[type].sort(eventCompare);
			
			function eventCompare(item1:Object, item2:Object):int 
			{
				if (item1.priority > item2.priority) return -1;
				else if (item1.priority < item2.priority) return 1;
				else return 0;
			}
		}

		public function dispatchEvent(event:Event):Boolean
		{
			var properties:* = event.$__properties().TLScope;
			var listeners:Array = $_properties.EventDispatcherScope.$_listeners[event.type];
			var target:Object = $_properties.EventDispatcherScope.$_target;
			var bubble:Boolean = false /* properties.bubbles && $_properties.EventDispatcherScope.$_target is DisplayObject; */
			
			if (!bubble && !listeners) return !properties.isDefaultPrevented();
			
			var parents:Array;
			/*
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

			properties = event.$__properties().TLScope;
			return !properties.isDefaultPrevented();
		}

		public function hasEventListener(type:String):Boolean
		{
			return $_properties.EventDispatcherScope.$_listeners[type];
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
			var listeners:Array = listenersByType[type];
			
			if (!listeners) return; 
			
			for (var i:uint = listeners.length; i--;) 
			{
				if (listeners[i].method != listener) continue;

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
