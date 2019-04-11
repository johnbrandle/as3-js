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
	public class Event
	{
		/*
		public static const ACTIVATE:String = "activate";
		public static const ADDED:String = "added";
		public static const ADDED_TO_STAGE:String = "addedToStage";
		public static const CANCEL:String = "cancel";
		public static const CHANGE:String = "change";
		public static const CLEAR:String = "clear";
		public static const CLOSE:String = "close";
		public static const COMPLETE:String = "complete";
		public static const CONNECT:String = "connect";
		public static const COPY:String = "copy";
		public static const CUT:String = "cut";
		public static const DEACTIVATE:String = "deactivate";
		public static const ENTER_FRAME:String = "enterFrame";
		public static const EXIT_FRAME:String = "exitFrame";
		public static const FRAME_CONSTRUCTED:String = "frameConstructed";
		public static const FULLSCREEN:String = "fullScreen";
		public static const ID3:String = "id3";
		public static const INIT:String = "init";
		public static const MOUSE_LEAVE:String = "mouseLeave";
		public static const OPEN:String = "open";
		public static const PASTE:String = "paste";
		public static const REMOVED:String = "removed";
		public static const REMOVED_FROM_STAGE:String = "removedFromStage";
		public static const RENDER:String = "render";
		public static const RESIZE:String = "resize";
		public static const SCROLL:String = "scroll";
		public static const SELECT:String = "select";
		public static const SELECT_ALL:String = "selectAll";
		public static const SOUND_COMPLETE:String = "soundComplete";
		public static const TAB_CHILDREN_CHANGE:String = "tabChildrenChange";
		public static const TAB_ENABLED_CHANGE:String = "tabEnabledChange";
		public static const TAB_INDEX_CHANGE:String = "tabIndexChange";
		public static const TEXT_INTERACTION_MODE_CHANGE:String = "textInteractionModeChange";
		public static const UNLOAD:String = "unload";
		*/
		
		private var $_properties:*;
		
		public function Event(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			if ($_properties === undefined) $__properties({});
		
			var properties:* = $_properties.EventScope;
			properties.$_type = type;
			properties.$_bubbles = bubbles;
			properties.$_cancelable = cancelable;
		}
		
		public function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object.EventScope = {$_target:null, $_currentTarget:null, $_eventPhase:null, $_withTarget:$_withTarget, $_originalTarget:null};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		private static function $_withTarget(event:Event, target:Object):Event 
		{
			var properties:* = event.$__properties();
			event = properties.EventScope.$_target ? event.clone() : event;
			event.$__properties().EventScope.$_target = target;
			return event;
		}

		public function get bubbles():Boolean
		{
			return $_properties.EventScope.$_bubbles;
		}

		public function get cancelable():Boolean
		{
			return $_properties.EventScope.$_cancelable;
		}

		public function get currentTarget():Object
		{
			return $_properties.EventScope.$_currentTarget;
		}

		public function get eventPhase():uint
		{
			return $_properties.EventScope.$_eventPhase;
		}

		public function get target():Object
		{
			return $_properties.EventScope.$_target;
		}
		
		public function get type():String
		{
			return $_properties.EventScope.$_type;
		}

		public function clone():flash.events.Event
		{
			return new Event($_properties.EventScope.$_type, $_properties.EventScope.$_bubbles, $_properties.EventScope.$_cancelable);
		}

		public function formatToString(className:String, ...args):String
		{
			var str:String = '[' + className;
			for (var i:int = 0; i < args.length; i++) str += ' ' + args[i] + '="' + this[args[i]] + '"';
			str += ']';
			return str;
		}

		public function isDefaultPrevented():Boolean
		{
			return $_properties.EventScope.$_defaultPrevented;
		}

		public function preventDefault():void
		{
			if ($_properties.EventScope.$_cancelable) $_properties.EventScope.$_defaultPrevented = true;
		}

		public function stopImmediatePropagation():void
		{
			$_properties.EventScope.$_immediatePropagationStopped = true;
		}

		public function stopPropagation():void
		{
			$_properties.EventScope.$_propagationStopped = true;
		}

		public function toString():String
		{
			return formatToString('Event', 'type', 'bubbles', 'cancelable');
		}
	}
}
