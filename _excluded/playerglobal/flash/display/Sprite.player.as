/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.DisplayObject;
	import flash.display.Graphics;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.media.SoundTransform;

	public class Sprite extends DisplayObjectContainer
	{
		private static var $_dragging:Sprite;
		private static var $_lockCenter:Boolean;
		private static var $_bounds:Rectangle;
		private static var $_dragPoint:Point;
		
		private var $_properties:*;

		public function Sprite()
		{
			if ($_properties === undefined) $__properties({});
		
			super();
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.SpriteScope = {$_useHandCursor:true, $_buttonMode:false};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}

		public function get graphics():flash.display.Graphics
		{
			return ($_properties.SpriteScope.$_graphics) ? $_properties.SpriteScope.$_graphics : $_properties.SpriteScope.$_graphics = new Graphics(this);
		}

		public function get buttonMode():Boolean
		{
			return $_properties.SpriteScope.$_buttonMode;
		}

		public function set buttonMode(value:Boolean):void
		{
			$_properties.SpriteScope.$_buttonMode = value;
			
			if ($_properties.SpriteScope.$_buttonMode && $_properties.SpriteScope.$_useHandCursor) $_properties.DisplayObjectScope.$_domView.style.cursor = 'pointer';
			else $_properties.DisplayObjectScope.$_domView.style.cursor = 'auto';
			
			var enabled:Boolean = $_properties.InteractiveObjectScope.$_tabEnabled;
			
			if (enabled || $_properties.SpriteScope.$_buttonMode) $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', $_properties.InteractiveObjectScope.$_tabIndex);
			else $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', -1);
			
			if ($_properties.DisplayObjectScope.$_domView.getAttribute('role') != 'presentation') $_properties.InteractiveObjectScope.$_role = $_properties.DisplayObjectScope.$_domView.getAttribute('role');
			
			if ((!enabled && !$_properties.SpriteScope.$_buttonMode) || $_properties.InteractiveObjectScope.$_tabIndex == -1) $_properties.DisplayObjectScope.$_domView.setAttribute('role', 'presentation');
			else $_properties.DisplayObjectScope.$_domView.setAttribute('role', $_properties.InteractiveObjectScope.$_role);
		}
		
		public override function set tabEnabled(enabled:Boolean):void
		{
			$_properties.InteractiveObjectScope.$_tabEnabled = enabled;
			
			if (enabled || $_properties.SpriteScope.$_buttonMode) $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', $_properties.InteractiveObjectScope.$_tabIndex);
			else $_properties.DisplayObjectScope.$_domView.setAttribute('tabindex', -1);
			
			if ($_properties.DisplayObjectScope.$_domView.getAttribute('role') != 'presentation') $_properties.InteractiveObjectScope.$_role = $_properties.DisplayObjectScope.$_domView.getAttribute('role');
			
			if ((!enabled && !$_properties.SpriteScope.$_buttonMode) || $_properties.InteractiveObjectScope.$_tabIndex == -1) $_properties.DisplayObjectScope.$_domView.setAttribute('role', 'presentation');
			else $_properties.DisplayObjectScope.$_domView.setAttribute('role', $_properties.InteractiveObjectScope.$_role);
		}
		
		public override function set mouseEnabled(enabled:Boolean):void
		{
			if ($_properties.DisplayObjectScope.$_domGraphicsView)
			{
				var childNodes:Object = $_properties.DisplayObjectScope.$_domGraphicsView.childNodes;
				for (var i:int = childNodes.length; i--;) childNodes[i].style.pointerEvents = (enabled) ? 'visible' : 'none';
			}
			
			super.mouseEnabled = enabled;
		}

		public UNIMPLEMENTED function get dropTarget () : flash.display.DisplayObject
		{
			throw new Error('Sprite: attempted call to an unimplemented function "dropTarget"');
		}

		public UNIMPLEMENTED function get hitArea () : flash.display.Sprite
		{
			throw new Error('Sprite: attempted call to an unimplemented function "hitArea"');
		}

		public UNIMPLEMENTED function set hitArea (value:Sprite) : void
		{
			throw new Error('Sprite: attempted call to an unimplemented function "hitArea"');
		}

		public UNIMPLEMENTED function get soundTransform () : flash.media.SoundTransform
		{
			throw new Error('Sprite: attempted call to an unimplemented function "soundTransform"');
		}

		public UNIMPLEMENTED function set soundTransform (sndTransform:SoundTransform) : void
		{
			throw new Error('Sprite: attempted call to an unimplemented function "soundTransform"');
		}

		public function get useHandCursor():Boolean
		{
			return $_properties.SpriteScope.$_useHandCursor;
		}

		public function set useHandCursor(value:Boolean):void
		{
			$_properties.SpriteScope.$_useHandCursor = value;
			
			if ($_properties.SpriteScope.$_buttonMode && $_properties.SpriteScope.$_useHandCursor) $_properties.DisplayObjectScope.$_domView.style.cursor = 'pointer';
			else $_properties.DisplayObjectScope.$_domView.style.cursor = 'auto';
		}

		public function startDrag(lockCenter:Boolean=false, bounds:Rectangle=null):void
		{
			if ($_dragging) stopDrag();
			
			$_dragging = this;
			$_lockCenter = lockCenter;
			$_bounds = bounds;
			$_dragPoint = new Point(mouseX, mouseY);
			
			stage.addEventListener(MouseEvent.MOUSE_MOVE, $_onMouseMove);
		}

		public UNIMPLEMENTED function startTouchDrag (touchPointID:int, lockCenter:Boolean=false, bounds:Rectangle=null) : void
		{
			throw new Error('Sprite: attempted call to an unimplemented function "startTouchDrag"');
		}

		public function stopDrag():void
		{
			if (!$_dragging) return;
			
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, $_onMouseMove);
			
			$_dragging = null;
			$_bounds = null;
			$_dragPoint = null;
		}
		
		private static function $_onMouseMove(mouseEvent:*):void
		{
			var sprite:Sprite = $_dragging;
			var x:Number;
			var y:Number;
			
			if ($_lockCenter)
			{
				x = sprite.$__properties().TLScope.parent.$__properties().TLScope.mouseX;
				y = sprite.$__properties().TLScope.parent.$__properties().TLScope.mouseY;
			}
			else
			{
				x = sprite.$__properties().TLScope.parent.$__properties().TLScope.mouseX - $_dragPoint.x;
				y = sprite.$__properties().TLScope.parent.$__properties().TLScope.mouseY - $_dragPoint.y;
			}
			
			if ($_bounds)
			{
				var bounds:Rectangle = $_bounds;
				
				x = Math.max(Math.min(x, bounds.width + bounds.x), bounds.x);
				y = Math.max(Math.min(y, bounds.height + bounds.y), bounds.y);
			}
			
			sprite.$__properties().TLScope.x = x;
			sprite.$__properties().TLScope.y = y;
		}

		public UNIMPLEMENTED function stopTouchDrag (touchPointID:int) : void
		{
			throw new Error('Sprite: attempted call to an unimplemented function "stopTouchDrag"');
		}

		/*
		public override function get width():Number 
		{
			var width:Number = super.width;
			
			if ($_properties.SpriteScope.$_graphics) width = ($_properties.SpriteScope.$_graphics.$__maxWidth > width) ? $_properties.SpriteScope.$_graphics.$__maxWidth : width;
			
			return width;
		}
		
		public override function set width(value:Number):void
		{
			var scaleX:Number = value / this.width;
			
			this.scaleX = isFinite(scaleX) ? scaleX : 1;
		}

		public override function get height():Number 
		{
			var height:Number = super.height;
			
			if ($_properties.SpriteScope.$_graphics) height = ($_properties.SpriteScope.$_graphics.$__maxHeight > height) ? $_properties.SpriteScope.$_graphics.$__maxHeight : height;
			
			return height;
		}
		
		public override function set height(value:Number):void
		{
			var scaleY:Number = value / this.height;
			
			this.scaleY = isFinite(scaleY) ? scaleY : 1;
		}
		*/
	}
}
