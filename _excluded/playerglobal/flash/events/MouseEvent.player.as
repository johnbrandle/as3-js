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
	import flash.display.InteractiveObject;
	import flash.events.Event;
	import flash.geom.Point;

	public class MouseEvent extends Event
	{
		private var _relatedObject:InteractiveObject;
		
		private var _ctrlKey:Boolean;
		
		private var _delta:int;
		
		private var _buttonDown:Boolean;
		
		private var _shiftKey:Boolean;
		
		private var _altKey:Boolean;
		
		internal var $__localPoint:Point;
		
		public var $__stagePoint:Point;
		
		public static const CLICK : String = "click";
		public static const CONTEXT_MENU : String = "contextMenu";
		public static const DOUBLE_CLICK : String = "doubleClick";
		public static const MIDDLE_CLICK : String = "middleClick";
		public static const MIDDLE_MOUSE_DOWN : String = "middleMouseDown";
		public static const MIDDLE_MOUSE_UP : String = "middleMouseUp";
		public static const MOUSE_DOWN : String = "mouseDown";
		public static const MOUSE_MOVE : String = "mouseMove";
		public static const MOUSE_OUT : String = "mouseOut";
		public static const MOUSE_OVER : String = "mouseOver";
		public static const MOUSE_UP : String = "mouseUp";
		public static const MOUSE_WHEEL : String = "mouseWheel";
		public static const RELEASE_OUTSIDE : String = "releaseOutside";
		public static const RIGHT_CLICK : String = "rightClick";
		public static const RIGHT_MOUSE_DOWN : String = "rightMouseDown";
		public static const RIGHT_MOUSE_UP : String = "rightMouseUp";
		public static const ROLL_OUT : String = "rollOut";
		public static const ROLL_OVER : String = "rollOver";

		public function MouseEvent (type:String, bubbles:Boolean=true, cancelable:Boolean=false, localX:Number=null, localY:Number=null, relatedObject:InteractiveObject=null, ctrlKey:Boolean=false, altKey:Boolean=false, shiftKey:Boolean=false, buttonDown:Boolean=false, delta:int=0)
		{
			super(type, bubbles, cancelable);
			
			$__localPoint = (isNaN(localX) || isNaN(localY)) ? null : new Point(localX, localY);
			this.relatedObject = relatedObject;
			this.ctrlKey = ctrlKey;
			this.altKey = altKey;
			this.shiftKey = shiftKey;
			this.buttonDown = buttonDown;
			this.delta = delta;
		}
		
		public function get altKey () : Boolean
		{
			return _altKey;
		}

		public function set altKey (value:Boolean) : void
		{
			_altKey = value;
		}

		public function get buttonDown () : Boolean
		{
			return _buttonDown;
		}

		public function set buttonDown (value:Boolean) : void
		{
			_buttonDown = value;
		}

		public function get ctrlKey () : Boolean
		{
			return _ctrlKey;
		}

		public function set ctrlKey (value:Boolean) : void
		{
			_ctrlKey = value;
		}

		public function get delta () : int
		{
			return _delta;
		}

		public function set delta (value:int) : void
		{
			_delta = value;
		}

		public UNIMPLEMENTED function get isRelatedObjectInaccessible () : Boolean
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "isRelatedObjectInaccessible"');
		}

		public UNIMPLEMENTED function set isRelatedObjectInaccessible (value:Boolean) : void
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "isRelatedObjectInaccessible"');
		}

		public function get localX () : Number
		{
			if (!$__localPoint)
			{
				if (!target) 
				{
					return NaN;
				}
				$__localPoint = target.globalToLocal($__stagePoint);
			}
			return $__localPoint.x;
		}

		public function set localX (value:Number) : void
		{
			if (!$__localPoint) 
			{
				$__localPoint = new Point(value, 0);
			} else 
			{
				$__localPoint.x = value;
			}
			$__stagePoint = null;
		}

		public function get localY () : Number
		{
			if (!$__localPoint) 
			{
				if (!target)
				{
					return NaN;
				}
				$__localPoint = target.globalToLocal($__stagePoint);
			}
			return $__localPoint.y;
		}

		public function set localY (value:Number) : void
		{
			if (!$__localPoint)
			{
				$__localPoint = new Point(0, value);
			} else 
			{
				$__localPoint.y = value;
			}
			$__stagePoint = null;
		}

		public UNIMPLEMENTED function get movementX () : Number
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "movementX"');
		}

		public UNIMPLEMENTED function set movementX (value:Number) : void
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "movementX"');
		}

		public UNIMPLEMENTED function get movementY () : Number
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "movementY"');
		}

		public UNIMPLEMENTED function set movementY (value:Number) : void
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "movementY"');
		}

		public function get relatedObject():InteractiveObject
		{
			return _relatedObject;
		}

		public function set relatedObject (value:InteractiveObject):void
		{
			_relatedObject = value;
		}

		public function get shiftKey () : Boolean
		{
			return _shiftKey;
		}

		public function set shiftKey (value:Boolean) : void
		{
			_shiftKey = value;;
		}

		public function get stageX () : Number
		{
			if (!$__stagePoint)
			{
				if (!target) 
				{
					return NaN;
				}
				$__stagePoint = target.localToGlobal($__localPoint);
			}
			return $__stagePoint.x;
		}

		public function get stageY () : Number
		{
			if (!$__stagePoint)
			{
				if (!target)
				{
					return NaN;
				}
				$__stagePoint = target.localToGlobal($__localPoint);
			}
			return $__stagePoint.y;
		}

		override public function clone():Event
		{
			var mouseEvent:MouseEvent = new MouseEvent(type, bubbles, cancelable, NaN, NaN, relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta);
			mouseEvent.$__localPoint = $__localPoint;
			mouseEvent.$__stagePoint = $__stagePoint;
			return mouseEvent;
		}
		
		override public function toString():String
		{
			return formatToString("MouseEvent", "type", "bubbles", "cancelable","localX", "localY", "stageX", "stageY", "relatedObject", "ctrlKey", "altKey", "shiftKey", "buttonDown", "delta");
		}

		public UNIMPLEMENTED function updateAfterEvent () : void
		{
			throw new Error('MouseEvent: attempted call to an unimplemented function "updateAfterEvent"');
		}

	}
}
