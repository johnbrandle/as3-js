/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.system.ApplicationDomain;
	import flash.system.LoaderContext;

	import player.Player;
	
	public final class Stage extends DisplayObjectContainer
	{		
		private static var $_enterFrameListeners:Array = [];
		
		public static var $__domDocument:Object;
		
		public static var $__stageReference:Stage;
		
		public static var $__stageLeft:Number;
		public static var $__stageTop:Number;
		
		public static var $__pageX:Number;
		public static var $__pageY:Number;
		
		public static var $__lastKeyPressedObject:Object;
		
		private static var $__lastMouseMoveEvent:*;
		private static var $_last:* = 0;
		
		private var $_stageFocusRectStyle:Object;
		
		private var $_properties:*;
		
		public function Stage()
		{
			if ($_properties === undefined) $__properties({});
		
			super();
			
			$__domDocument.appendChild($_properties.DisplayObjectScope.$_domView);
			
			$__onResize();
			$__stageReference = this;
			var mobile:Boolean = window.mobile;
			
			if (mobile)
			{
				document.body.addEventListener('touchstart', function(event:*):void 
				{ 
					var target:* = event.target;
					
					if (target.nodeName != 'A' && target.nodeName != 'TEXTAREA' && !(target.contentEditable === 'true')) event.preventDefault(); //don't prevent default on links or they will not work
					
					$__pageX = event.touches[0].pageX; 
					$__pageY = event.touches[0].pageY;
				}, true); //must use capture phase here
				document.body.addEventListener('touchmove', function(event:*):void 
				{
					var target:* = event.target;
					
					if (target.nodeName != 'A' && target.nodeName != 'TEXTAREA' && !(target.contentEditable === 'true')) event.preventDefault();
					
					$__pageX = event.touches[0].pageX;
					$__pageY = event.touches[0].pageY;
				}, true); //must use capture phase here
			}
			else
			{
				document.body.addEventListener('mousemove', function(event:*):void 
				{
					$__pageX = event.pageX; 
					$__pageY = event.pageY; 
				}, true); //must use capture phase here

				document.body.addEventListener('mousedown', function(event:*):void
				{
					$__lastKeyPressedObject = null;
				}, true); //must use capture phase here
				
				document.body.addEventListener('keydown', function(event:*):void
				{
					$__lastKeyPressedObject = {which:event.which, keyCode:event.keyCode, shiftKey:event.shiftKey};
				}, true); //must use capture phase here
			}
			
			var doMouseMove:Boolean = false;
			var requestAnimationFrame:Function = window.requestAnimationFrame;
			var view:Object = Stage.$__domDocument;
			
			var onMouseMove:Function = function(event:*):void
			{
				$__lastMouseMoveEvent = event;
				event.stopPropagation();
			}
			
			var onMouseWheel:Function = function(event:*):void
			{
				if (!hasEventListener(MouseEvent.MOUSE_WHEEL)) //check if listener is present first for performance reasons
				{
					event.stopPropagation();
					return; 
				}
				
				var mouseMoveEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_WHEEL, false, false, null, null, null, false, false, false, false, -event.deltaY); //do not bubble for performance reasons, but should not make a diff for now since stage is only dispatcher
				mouseMoveEvent.$__properties().EventScope.$_target = InteractiveObject.$_getOriginalInteractiveObjectTarget(event.target);	
				dispatchEvent(mouseMoveEvent);
				
				event.stopPropagation();
			}
			
			if (mobile) 
			{
				view.addEventListener('touchmove', onMouseMove, false); //for performance reasons let's support mousemove only for the stage
				$_properties.InteractiveObjectScope.$_onMouseMove = onMouseMove;
			}
			else view.addEventListener('mousemove', onMouseMove, true); //for performance reasons let's support mousemove only for the stage
			
			view.addEventListener('wheel', onMouseWheel, false); //for performance reasons let's support mousemove only for the stage
			
			$_properties.DisplayObjectScope.$_isRoot = true;
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.StageScope = {$_color:0xffffff, $_align:'', $_scaleMode:'', $_stageFocusRect:true};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public static function $__init(domDocument:*):Stage
		{
			$__domDocument = domDocument;
			
			var stage:Stage = new Stage();
			var loader:Loader = new Loader();
			var properties:* = loader.$__properties().LoaderScope;
			
			properties.$_loaderContext = new LoaderContext(false, null);
			stage.$__properties().DisplayObjectScope.$_loaderInfo = properties.$_contentLoaderInfo;
			
			return stage;
		}
		
		public function $__onResize():void
		{
			var boundingClientRect:* = $_properties.DisplayObjectScope.$_domView.getBoundingClientRect();
			$__stageTop = boundingClientRect.top;
			$__stageLeft = boundingClientRect.left;
			
			$_properties.TLScope.dispatchEvent(new Event(Event.RESIZE));
		}
		
		public function $__internalAddChild(child:Sprite):void
		{
			var loader:Loader = new Loader();
			var properties:* = loader.$__properties().LoaderScope;
			
			properties.$_loaderContext = new LoaderContext(false, ApplicationDomain.currentDomain);
			child.$__properties().DisplayObjectScope.$_loaderInfo = properties.$_contentLoaderInfo;
			child.$__properties().DisplayObjectScope.$_isRoot = true;
			
			addChild(child);
		}
		
		public override function $__notify(name:String, args:*):void
		{
			var event:*;
			if (name === 'enterFrame')
			{
				if ($__lastMouseMoveEvent)
				{
					if ($_last < 1) //only dispatch mouse move once every other frame
					{
						$_last = 1;
						return;
					}
					$_last = 0;
					
					var mobile:Boolean = window.mobile;
					
					event = $__lastMouseMoveEvent;
					$__lastMouseMoveEvent = null;
					
					if (!hasEventListener(MouseEvent.MOUSE_MOVE)) return; //check if listener is present first for performance reasons
					
					var clientX:Number = (mobile && event.clientX === undefined) ? InteractiveObject.getTouch(event).pageX : event.clientX;
					var clientY:Number = (mobile && event.clientY === undefined) ? InteractiveObject.getTouch(event).pageY : event.clientY;
					var localPoint:Point = globalToLocal(new Point(clientX, clientY));
					
					var mouseMoveEvent:MouseEvent = new MouseEvent(MouseEvent.MOUSE_MOVE, false, false, localPoint.x, localPoint.y); //do not bubble for performance reasons, but should not make a diff for now since stage is only dispatcher
					mouseMoveEvent.$__properties().EventScope.$_target = InteractiveObject.$_getOriginalInteractiveObjectTarget(event.target);		
					dispatchEvent(mouseMoveEvent);
				}
				
				for (var i:uint = $_enterFrameListeners.length; i--;)
				{
					event = new Event(Event.ENTER_FRAME);
					$_enterFrameListeners[i].func(event.$__properties().EventScope.$_withTarget(event, $_enterFrameListeners[i].listener));
				}
			}	
				
			super.$__notify(name, args);
		}
		
		public static function $__addEnterFrameListener(listener:Object, func:Function):void
		{
			$_enterFrameListeners.push({listener:listener, func:func});
		}
		
		public static function $__removeEnterFrameListener(listener:Object, func:Function):void
		{
			for (var i:uint = $_enterFrameListeners.length; i--;)
			{
				if ($_enterFrameListeners[i].listener != listener || $_enterFrameListeners[i].func != func) continue;
				
				$_enterFrameListeners.splice(i, 1);
			}
		}
		
		public function set color(value:uint):void
		{
			$__domDocument.style.background = value.toString(16);
		}
		
		public function get color():uint
		{
			return parseInt($__domDocument.style.background.split('#').pop(), 16);
		}

		public function get frameRate():Number
		{
			return Player.getFrameRate();
		}
		
		public function set frameRate(value:Number):void
		{
			Player.setFrameRate(value);
		}
		
		public function get align():String
		{
			return $_properties.StageScope.$_align;
		}
		
		public function set align(value:String):void
		{
			$_properties.StageScope.$_align = value;
		}

		public UNIMPLEMENTED function get colorCorrection():String
		{
			throw new Error('Stage: attempted call to an unimplemented function "colorCorrection"');
		}
		
		public UNIMPLEMENTED function set colorCorrection(value:String):void
		{
			throw new Error('Stage: attempted call to an unimplemented function "colorCorrection"');
		}

		public UNIMPLEMENTED function get colorCorrectionSupport():String
		{
			throw new Error('Stage: attempted call to an unimplemented function "colorCorrectionSupport"');
		}

		public UNIMPLEMENTED function get displayState():String
		{
			throw new Error('Stage: attempted call to an unimplemented function "displayState"');
		}
		
		public UNIMPLEMENTED function set displayState(value:String):void
		{
			throw new Error('Stage: attempted call to an unimplemented function "displayState"');
		}

		public function get focus():flash.display.InteractiveObject
		{
			var element:* = document.activeElement;
			if (!element || element.displayObject === undefined) return null;
			
			return element.displayObject;
		}
		
		public function set focus(newFocus:InteractiveObject):void
		{
			$__lastKeyPressedObject = null;
			
			if (newFocus == null) 
			{
				if (document.activeElement) 
				{
					if (document.activeElement.blur !== undefined) document.activeElement.blur();
				}
				else window.focus();
				
				return;
			}
			
			newFocus.$__properties().DisplayObjectScope.$_domView.focus();
		}

		public function get fullScreenHeight():uint
		{
			return window.screen.height;
		}

		public UNIMPLEMENTED function get fullScreenSourceRect():flash.geom.Rectangle
		{
			throw new Error('Stage: attempted call to an unimplemented function "fullScreenSourceRect"');
		}
		
		public UNIMPLEMENTED function set fullScreenSourceRect(value:Rectangle):void
		{
			throw new Error('Stage: attempted call to an unimplemented function "fullScreenSourceRect"');
		}

		public function get fullScreenWidth():uint
		{
			return window.screen.width;
		}

		public UNIMPLEMENTED function get quality():String
		{
			throw new Error('Stage: attempted call to an unimplemented function "quality"');
		}
		
		public UNIMPLEMENTED function set quality(value:String):void
		{
			throw new Error('Stage: attempted call to an unimplemented function "quality"');
		}

		public function get scaleMode():String
		{
			return $_properties.StageScope.$_scaleMode;
		}
		
		public function set scaleMode(value:String):void
		{
			$_properties.StageScope.$_scaleMode = value;
		}

		public UNIMPLEMENTED function get showDefaultContextMenu():Boolean
		{
			throw new Error('Stage: attempted call to an unimplemented function "showDefaultContextMenu"');
		}
		
		public UNIMPLEMENTED function set showDefaultContextMenu(value:Boolean):void
		{
			throw new Error('Stage: attempted call to an unimplemented function "showDefaultContextMenu"');
		}

		public function get stageFocusRect():Boolean
		{
			return $_properties.StageScope.$_stageFocusRect;
		}
		
		public function set stageFocusRect(value:Boolean):void
		{
			if (value == $_properties.StageScope.$_stageFocusRect) return;
			
			$_properties.StageScope.$_stageFocusRect = value;
			
			if (!value)
			{
				var css:String = '*:focus { outline: none; }';
				var style:Object = document.createElement('style');
				style.type='text/css';
				if (style.styleSheet) style.styleSheet.cssText = css;
				else style.appendChild(document.createTextNode(css));
				
				document.getElementsByTagName('head')[0].appendChild(style);
				
				$_stageFocusRectStyle = style;
			}
			else 
			{
				$_stageFocusRectStyle.parentNode.removeChild($_stageFocusRectStyle);
				$_stageFocusRectStyle = null;
			}
		}

		public function get stageHeight():int
		{
			return $__domDocument.offsetHeight;
		}
		
		public function set stageHeight(value:int):void
		{
			$__domDocument.style.height = value + 'px';
		}

		public function get stageWidth():int
		{
			return $__domDocument.offsetWidth;
		}
		
		public function set stageWidth(value:int):void
		{
			$__domDocument.style.width = value + 'px';
		}

		public UNIMPLEMENTED function get wmodeGPU():Boolean
		{
			throw new Error('Stage: attempted call to an unimplemented function "wmodeGPU"');
		}

		public function invalidate():void
		{
			document.body.removeChild(document.body.appendChild(document.createElement('style'))); //force repaint
		}

		public UNIMPLEMENTED function isFocusInaccessible():Boolean
		{
			throw new Error('Stage: attempted call to an unimplemented function "isFocusInaccessible"');
		}	
	}
}