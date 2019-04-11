/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.accessibility.AccessibilityProperties;
	import flash.debugger.enterDebugger;
	import flash.display.DisplayObjectContainer;
	import flash.display.IBitmapDrawable;
	import flash.display.LoaderInfo;
	import flash.display.Shader;
	import flash.display.Stage;
	import flash.events.EventDispatcher;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.geom.Transform;
	import flash.geom.Vector3D;
	
	import browser.Browser;

	public class DisplayObject extends EventDispatcher implements IBitmapDrawable
	{
		private static var $_instanceCounter:int = 0;

		private var $_previousTransformValues:* = {x:0, y:0, rotation:0, scaleX:1, scaleY:1};

		private var $_properties:*;

		public function DisplayObject()
		{
			var properties:* = $_properties || $__properties({});
		
			super();

			var domView:* = properties.DisplayObjectScope.$_domView = $__createDomView();
			domView.setAttribute('name', properties.DisplayObjectScope.$_id);
			domView.setAttribute('data-type', Object(this).constructor.name);
			domView.setAttribute('tabindex', -1);
			domView.setAttribute('role', 'presentation');
			domView.displayObject = this;
			domView.style.position = 'absolute';
			domView.style.pointerEvents = 'auto';
			domView.style[Browser.getTapHighlightColorString()] = 'rgba(0, 0, 0, 0)';
			domView.style[Browser.getTransformOriginString()] = '0% 0%';
		}
		
		protected function $__createDomView():*
		{
			return document.createElement('div');
		}

		internal function $__addDomGraphicsView(domGraphicsView:Object):void
		{
			$_properties.DisplayObjectScope.$_domGraphicsView = domGraphicsView;
			$_properties.DisplayObjectScope.$_domView.appendChild(domGraphicsView);

			if ($_properties.DisplayObjectScope.accessibilityProperties) $_properties.DisplayObjectScope.accessibilityProperties.$_applyProperties(domGraphicsView);
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);

				var pscope:* = $es4.$$getOwnScope(this, DisplayObject);
				var id:* = 'instance' + ($_instanceCounter++);
				var matrix:* = new Matrix();
				
				//$_x and $_y hold the real x,y values set by the programmer
				//$_matrix holds these same values, but property access is slower through matrix so we are using $_x $_y for faster lookup
				//$_x1 and $_y1, is the non-transformed x and y calculated based on children, or non-child content
				//$_width and $_height is the non-transformed width and height calculated based on children, or non-child content.
				//$_bounds represent the bounding box after transformations, and children are accounted for.
				object.DisplayObjectScope = {pscope:pscope, $_id:id,
											$_sudoScaleX:1, $_sudoScaleY:1, $_sudoRotation:0,
											$_childBoundsData:{}, $_matrix:matrix, $_scaleX:1, $_scaleY:1, $_rotation:0, $_x:0, $_y:0, $_x1:0, $_y1:0, $_width:0, $_height:0,
											$_bounds:[0, 0, 0, 0],
											$_onChildBoundsChange:$_onChildBoundsChange, $_notifyParentOfBoundsChange:$_notifyParentOfBoundsChange,
											$_setExplicitBounds:$_setExplicitBounds,
											$_scrollRectXOffset:0, $_scrollRectYOffset:0, $_opacity:1, $_visible:true, $_cacheAsBitmap:false, $_toCanvas:$_toCanvas, $_scrollRect:null};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public function $__notify(name:String, args:*):void
		{
		}

		public function get x():Number
		{
			return $_properties.DisplayObjectScope.$_x; //the explicit, non-calculated, value
		}

		public function set x(value:Number):void
		{
			if (isNaN(value)) value = 0;
			else if (Math.abs(value) >= 107374182.4) value = -107374182.4;
			else value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip

			var scope:* = $_properties.DisplayObjectScope;
			var matrix:* = scope.$_matrix;
			if (value === matrix.tx) return;

			matrix.translate(-matrix.tx, 0); //undo first to avoid floating point errors i.e, those potentially caused by: (value - matrix.tx)
			matrix.translate(value, 0);
			scope.$_x = value;
			
			$_recalculateChildBasedBounds(); //
		}

		public function get y():Number
		{
			return $_properties.DisplayObjectScope.$_y; //the explicit, non-calculated, value
		}

		public function set y(value:Number):void
		{
			if (isNaN(value)) value = 0;
			else if (Math.abs(value) >= 107374182.4) value = -107374182.4;
			else value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip

			var scope:* = $_properties.DisplayObjectScope;
			var matrix:* = scope.$_matrix;
			if (value === matrix.ty) return;

			matrix.translate(0, -matrix.ty); //undo first to avoid floating point errors i.e, those potentially caused by: (value - matrix.ty)
			matrix.translate(0, value);
			scope.$_y = value;
			
			$_recalculateChildBasedBounds(); //
		}

		public function get height():Number
		{
			var value:* = $_properties.DisplayObjectScope.$_bounds[3]; //height after transformations have been applied
			return (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
		}

		public function get width():Number
		{
			var value:* = $_properties.DisplayObjectScope.$_bounds[2]; //width after transformations have been applied
			return (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
		}

		public function set height(value:Number):void
		{
			if (value < 0) return; //negative values are not allowed

			var scope:* = $_properties.DisplayObjectScope;
			var scaleY:* = scope.$_scaleY;
			var matrix:* = scope.$_matrix; //transformation matrix
			var height:* = scope.$_height; //non-transformed height

			if (isNaN(value)) value = 0; //NaN is converted to 0

			if (value === 0 || height === 0) //value of 0 will cause both scaleY and scaleX to go to 0
			{
				var scaleX:* = scope.$_scaleX;

				if (scaleY !== 0 || scaleX !== 0) //if was not already 0
				{
					if (scaleY !== 0) matrix.$__scale(1, 1 / scaleY); //undo current y scaling
					if (scaleX !== 0) matrix.$__scale(1 / scaleX, 1); //undo current x scaling

					scope.$_sudoScaleX = scope.$_sudoScaleY = scope.$_scaleX = scope.$_scaleY = 0;

					scope.$_bounds[2] = 0;
					scope.$_bounds[3] = 0;

					$_notifyParentOfBoundsChange(); //no need to recalculate bounds, as we just set them. notify parent of change.
				}
				
				return;
			}
			
			//todo, may need to convert height to twips before i calculate scale. do not do this for value..

			var desiredYScale:* = value / height;
			if (desiredYScale === scaleY) return; //no change in scale is being made. return

			if (desiredYScale > 0x8000) desiredYScale = 0x8000; //maximum scale factor
			if (desiredYScale * height > 0x6666660) desiredYScale = 0x6666660 / height; //maximum height. not factoring in rotation. not sure if i should..

			if (scaleY !== 0) matrix.$__scale(1, 1 / scaleY); //undo current y scaling, unless it is at 0 (it was already undone in that case --see above)
			matrix.$__scale(1, desiredYScale); //apply desired scaling

			scope.$_sudoScaleY = scope.$_scaleY = desiredYScale;
			
			if (scope.$_rotation)
			{
				//http://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
				//http://blog.anselmbradford.com/2009/02/12/flash-movie-clip-transformational-properties-explorer-x-y-width-height-more/
				//http://stackoverflow.com/questions/20610103/as3-bug-on-resizing-after-rotation
				throw new Error('changing the width/height of a rotated object does not appear to function properly in flash. recommend setting object to rotation 0, then resizing, then rotating back to desired position; or, resize via scaleX and scaleY');
			}

			$_recalculateBounds();
		}

		public function set width(value:Number):void
		{
			if (value < 0) return; //negative values are not allowed

			var scope:* = $_properties.DisplayObjectScope;
			var scaleX:* = scope.$_scaleX;
			var matrix:* = scope.$_matrix; //transformation matrix
			var width:* = scope.$_width; //non-transformed width

			if (isNaN(value)) value = 0; //NaN is converted to 0

			if (value === 0 || width === 0) //value of 0 will cause both scaleY and scaleX to go to 0
			{
				var scaleY:* = scope.$_scaleY;

				if (scaleY !== 0 || scaleX !== 0) //if was not already 0
				{
					if (scaleY !== 0) matrix.$__scale(1, 1 / scaleY); //undo current y scaling
					if (scaleX !== 0) matrix.$__scale(1 / scaleX, 1); //undo current x scaling

					scope.$_sudoScaleX = scope.$_sudoScaleY = scope.$_scaleX = scope.$_scaleY = 0;

					scope.$_bounds[2] = 0;
					scope.$_bounds[3] = 0;

					$_notifyParentOfBoundsChange(); //no need to recalculate bounds, as we just set them. notify parent of change.
				}

				return;
			}
			
			//todo, may need to convert width to twips before i calculate scale. do not do this for value..

			var desiredXScale:* = value / width;
			if (desiredXScale === scaleX) return; //no change in scale is being made. return

			if (desiredXScale > 0x8000) desiredXScale = 0x8000; //maximum scale factor
			if (desiredXScale * width > 0x6666660) desiredXScale = 0x6666660 / width; //maximum width. not factoring in rotation. not sure if i should..

			if (scaleX !== 0) matrix.$__scale(1 / scaleX, 1); //undo current y scaling, unless it is at 0 (it was already undone in that case --see above)
			matrix.$__scale(desiredXScale, 1); //apply desired scaling

			scope.$_sudoScaleX = scope.$_scaleX = desiredXScale;
			
			if (scope.$_rotation)
			{
				//http://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
				//http://blog.anselmbradford.com/2009/02/12/flash-movie-clip-transformational-properties-explorer-x-y-width-height-more/
				//http://stackoverflow.com/questions/20610103/as3-bug-on-resizing-after-rotation
				throw new Error('changing the width/height of a rotated object does not appear to function properly in flash. recommend setting object to rotation 0, then resizing, then rotating back to desired position; or, resize via scaleX and scaleY');
			}
			
			$_recalculateBounds();
		}
		
		public function get scaleX():Number
		{
			return $_properties.DisplayObjectScope.$_sudoScaleX; //the same, unaltered, value that was given
		}

		public function set scaleX(value:Number):void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var sudoScaleX:* = scope.$_sudoScaleX; //the scale value that is set, but not necessarily what is actually being used
			var scaleX:* = scope.$_scaleX;
			var matrix:* = scope.$_matrix; //transformation matrix
			var width:* = scope.$_scrollRect !== null ? scope.$_scrollRect.width : scope.$_width; //non-transformed width
			
			if (value === sudoScaleX) return;
			scope.$_sudoScaleX = value;
			
			if (isNaN(value)) value = 0;
			else if (Math.abs(value) > 0x8000) value = 0x8000;
			else if (value < 0) value = Math.abs(value);

			if (value === scaleX) return;

			if (value === 0)
			{
				if (scaleX !== 0) //if was not already 0
				{
					if (scaleX !== 0) matrix.$__scale(1 / scaleX, 1); //undo current x scaling

					scope.$_scaleX = 0;
					scope.$_bounds[2] = 0;

					$_notifyParentOfBoundsChange(); //no need to recalculate bounds, as we just set it. notify parent of bounds change.
				}

				return;
			}

			if (value * width > 0x6666660) //maximum width. not factoring in rotation. not sure if i should..
			{
				value = 0x6666660 / width;
			}

			var rotation:* = scope.$_rotation;
			if (rotation !== 0) matrix.$__rotate(-(rotation * (Math.PI / 180)));
			if (scaleX !== 0) matrix.$__scale(1 / scaleX, 1); //undo current x scaling, unless it is at 0 (it was already undone in that case --see above)
			
			value = Math.floor(value * 16384) / 16384; //reduce the precision to match Flash
			matrix.$__scale(value, 1); //apply desired scaling

			if (rotation !== 0) matrix.$__rotate(rotation * (Math.PI / 180));
			
			scope.$_scaleX = value;
			
			$_recalculateBounds();
		}

		public function get scaleY():Number
		{
			return $_properties.DisplayObjectScope.$_sudoScaleY; //the same, unaltered, value that was given
		}

		public function set scaleY(value:Number):void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var sudoScaleY:* = scope.$_sudoScaleY; //the scale value that is set, but not necessarily what is actually being used
			var scaleY:* = scope.$_scaleY;
			var matrix:* = scope.$_matrix; //transformation matrix
			var height:* = scope.$_scrollRect !== null ? scope.$_scrollRect.height : scope.$_height; //non-transformed height
			
			if (value === sudoScaleY) return;
			scope.$_sudoScaleY = value;

			if (isNaN(value)) value = 0;
			else if (Math.abs(value) > 0x8000) value = 0x8000;
			else if (value < 0) value = Math.abs(value);
			
			if (value === scaleY) return;

			if (value === 0)
			{
				if (scaleY !== 0) //if was not already 0
				{
					if (scaleY !== 0) matrix.$__scale(1, 1 / scaleY); //undo current y scaling

					scope.$_scaleY = 0;
					scope.$_bounds[3] = 0;

					$_notifyParentOfBoundsChange(); //no need to recalculate bounds, as we just set it. notify parent of bounds change.
				}

				return;
			}

			if (value * height > 0x6666660) //maximum height. not factoring in rotation. not sure if i should..
			{
				value = 0x6666660 / height;
			}
			
			var rotation:* = scope.$_rotation;
			if (rotation !== 0) matrix.$__rotate(-(rotation * (Math.PI / 180)));
			if (scaleY !== 0) matrix.$__scale(1, 1 / scaleY); //undo current y scaling, unless it is at 0 (it was already undone in that case --see above)
			
			value = Math.floor(value * 16384) / 16384; //reduce the precision to match Flash
			matrix.$__scale(1, value); //apply desired scaling

			if (rotation !== 0) matrix.$__rotate(rotation * (Math.PI / 180));
			
			scope.$_scaleY = value;

			$_recalculateBounds();
		}

		public function get rotation():Number
		{
			return $_properties.DisplayObjectScope.$_sudoRotation; //an possibly altered version of the value that was given, and that we are really using for rotation
		}

		public function set rotation(value:Number):void //there appears to be some serious accuracy issues with Flash's rotation implementation. let's not try to reproduce the inaccuracy as I see no discernable pattern to it
		{
			var scope:* = $_properties.DisplayObjectScope;
			var sudoRotation:* = scope.$_sudoRotation; //the rotational value that is set, but not necessarily what is actually being used
			var rotation:* = scope.$_rotation;
			var matrix:* = scope.$_matrix; //transformation matrix
			
			if (value === sudoRotation || value === rotation) return; //check if value is the same as the current sudoRotation value, or the current rotation value
			scope.$_sudoRotation = value;
			
			if (isNaN(value)) value = 0;
			else if (!isFinite(value))
			{
				scope.$_sudoRotation = NaN;
				value = 0;
			}
			else if (Math.abs(value) > 180)
			{
				if (Math.abs(value) > 32767) throw new Error('cannot set rotation to value greater than 32767 due to flash rotation bug'); //http://www.pixelwit.com/blog/2008/01/flash-rotation-bug/
				
				value =  value % 360; 
				value = (value + 360) % 360;  
				if (value > 180) value -= 360;
				
				scope.$_sudoRotation = value;
			}
			
			if (scope.$_sudoRotation === sudoRotation || value === rotation) return; //check if updated sudo rotation value has changed, or if rotation has changed
			
			if (rotation !== 0) matrix.$__rotate(-(rotation * (Math.PI / 180))); //undo current rotation
			matrix.$__rotate((value * (Math.PI / 180))); //apply desired rotation
			
			scope.$_rotation = value;
			
			$_recalculateBounds();
		}
		
		public function get visible():Boolean
		{
			return $_properties.DisplayObjectScope.$_visible;
		}
		
		public function set visible(value:Boolean):void
		{
			var scope:* = $_properties.DisplayObjectScope;
			if (scope.$_visible === value) return;
			
			if (value === false) $__notify('visibleFalse', null); //firefox (ie may not as well) does not dispatch focus out when focused element becomes invisible. we will use notify functionality to does this manuall for those browsers
			
			scope.$_visible = value;
			
			$_properties.DisplayObjectScope.$_domView.style.visibility = (value === true) ? 'inherit' : 'hidden';

			$_recalculateBounds();
		}
		
		public function get scrollRect():flash.geom.Rectangle
		{
			return $_properties.DisplayObjectScope.$_scrollRect;
		}

		public function set scrollRect(rectangle:Rectangle):void
		{
			var properties:* = $_properties.DisplayObjectScope;
			var style:* = properties.$_domView.style;
			if (!rectangle)
			{
				style.removeProperty('clip');
				style.removeProperty('width');
				style.removeProperty('height');
				properties.$_scrollRectXOffset = 0;
				properties.$_scrollRectYOffset = 0;
				
				properties.$_scrollRect = null;
				
				$_recalculateBounds();
				return;
			}
			
			style.clip = 'rect(' + int(rectangle.y) + 'px ' + int(rectangle.x + rectangle.width) + 'px ' + int(rectangle.y + rectangle.height) + 'px ' + int(rectangle.x) + 'px)';
			
			properties.$_scrollRectXOffset = int(-rectangle.x);
			properties.$_scrollRectYOffset = int(-rectangle.y);
			
			properties.$_scrollRect = rectangle;
			
			style.width = rectangle.width + 'px';
			style.height = rectangle.height + 'px';
			
			$_recalculateBounds();
		}

		public function get transform():flash.geom.Transform
		{
			return new Transform(this);
		}
		
		public UNIMPLEMENTED function set transform (value:Transform) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "transform"');
		}

		private function $_setExplicitBounds(width:Number, height:Number):void
		{
			var scope:* = $_properties.DisplayObjectScope;
			scope.$_width = width;
			scope.$_height = height;

			$_recalculateBounds();
		}
		
		private function $_notifyParentOfBoundsChange():void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var domView:* = scope.$_domView;
			var parent:* = domView.parentNode ? domView.parentNode.displayObject : null;

			if (!parent) return;
			
			if (scope.$_visible === true) $_transform(); //visual update
			
			var parentScope:* = parent.$__properties().DisplayObjectScope;
			parentScope.$_onChildBoundsChange(scope.$_id, scope.$_height !== 0 || scope.$_width !== 0 || scope.$_scrollRect !== null ? scope.$_bounds : null); //children with no pre-transform width or height are not included in parent size calcuations
		}

		private function $_onChildBoundsChange(childID:*, bounds:*):void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var childBoundsData:* = scope.$_childBoundsData;
			
			if (!bounds) delete childBoundsData[childID]; //bounds will be null when child is removed from displaylist, or when child has no dimensions of its own
			else childBoundsData[childID] = bounds.slice();
			
			$_recalculateChildBasedBounds();
		}
		
		private function $_recalculateChildBasedBounds():void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var childBoundsData:* = scope.$_childBoundsData;
			
			var x1:* = Number.POSITIVE_INFINITY;
			var y1:* = Number.POSITIVE_INFINITY;
			var x2:* = Number.NEGATIVE_INFINITY;
			var y2:* = Number.NEGATIVE_INFINITY;
			var x:* = 0;
			var y:* = 0;
			var width:* = 0;
			var height:* = 0;
			var abs:* = Math.abs;
			for (var eachChildID:* in childBoundsData)
			{
				var eachBounds:* = childBoundsData[eachChildID];
				
				var innerX:* = eachBounds[0];
				var innerY:* = eachBounds[1];
				
				if (innerX < x1) x1 = innerX;
				if (innerY < y1) y1 = innerY;
				
				if (innerX + eachBounds[2] > x2) x2 = innerX + eachBounds[2];
				if (innerY + eachBounds[3] > y2) y2 = innerY + eachBounds[3];
			}
			
			if (x1 === Number.POSITIVE_INFINITY) //no children to base bounds off of
			{
				scope.$_x1 = scope.$_x;
				scope.$_y1 = scope.$_y;
				
				$_recalculateBounds();
				return;
			}
			
			x = x1 + scope.$_x;
			y = y1 + scope.$_y;
			width = abs(x2 - x1);
			height = abs(y2 - y1);
			
			if (height === scope.$_height && width === scope.$_width && x === scope.$_x1 && y === scope.$_y1) return; //OPTIMIZATION. child bounds changed, but ours did not.
			
			scope.$_x1 = x;
			scope.$_y1 = y;
			scope.$_height = height;
			scope.$_width = width;
			
			if (scope.$_scrollRect !== null) 
			{
				$_notifyParentOfBoundsChange();
				return; //width/height bounds are dependent on scrollRect not on children or content
			}
			
			$_recalculateBounds();
		}
		
		private function $_recalculateBounds():void
		{
			var scope:* = $_properties.DisplayObjectScope;
			var matrix:* = scope.$_matrix; //transformation matrix
			var width:* = scope.$_scrollRect !== null ? scope.$_scrollRect.width : scope.$_width; //non-transformed width
			var height:* = scope.$_scrollRect !== null ? scope.$_scrollRect.height : scope.$_height; //non-transformed height
			var rotation:* = scope.$_rotation;
			var value:*;
			var bounds:* = scope.$_bounds;
			
			if (rotation)
			{
				var xDiff:Number = scope.$_x1 - scope.$_x;
				var yDiff:Number = scope.$_y1 - scope.$_y;
				var point1:* = matrix.$__transformPoint(xDiff, yDiff); //top, left
				var point2:* = matrix.$__transformPoint(xDiff + width, yDiff); //top, right
				var point3:* = matrix.$__transformPoint(xDiff + width, yDiff + height); //bottom, right
				var point4:* = matrix.$__transformPoint(xDiff, yDiff + height); //bottom, left
				
				var left:* = Math.min(point1[0], point2[0], point3[0], point4[0]);
				var right:* = Math.max(point1[0], point2[0], point3[0], point4[0]);
				var top:* = Math.min(point1[1], point2[1], point3[1], point4[1]);
				var bottom:* = Math.max(point1[1], point2[1], point3[1], point4[1]);
				
				var x2:* = right - left;
				var y2:* = bottom - top;

				bounds[0] = left;
				bounds[1] = top;
				
				bounds[2] = x2;
				bounds[3] = y2;
			}
			else
			{
				value = matrix.$__transformPoint(scope.$_x1 - scope.$_x, 0)[0];
				bounds[0] = value;
				
				value = matrix.$__transformPoint(0, scope.$_y1 - scope.$_y)[1];
				bounds[1] = value;
				
				value = matrix.$__deltaTransformPoint(width, 0)[0];
				bounds[2] = value;
				
				value = matrix.$__deltaTransformPoint(0, height)[1];
				bounds[3] = value;
			}
		
			$_notifyParentOfBoundsChange();
		}
		
		private function $_transform():void
		{
			var properties:* = $_properties.DisplayObjectScope;
			var previousTransformValues:* = $_previousTransformValues;
			var style:* = properties.$_domView.style;
			var cacheAsBitmap:Boolean = properties.$_cacheAsBitmap;
			
			if (cacheAsBitmap)
			{
				if (previousTransformValues.rotation != properties.$_rotation || previousTransformValues.scaleX != properties.$_scaleX || previousTransformValues.scaleY != properties.$_scaleY || previousTransformValues.x != (properties.$_x + properties.$_scrollRectXOffset) || previousTransformValues.y != (properties.$_y + properties.$_scrollRectYOffset))
				{	
					style[Browser.getTransformString()] = 'translate3d(' + (properties.$_x + properties.$_scrollRectXOffset) + 'px, ' + (properties.$_y + properties.$_scrollRectYOffset) + 'px, 0px) rotate3d(0, 0, 1,' + properties.$_rotation + 'deg) scale3d(' + properties.$_scaleX + ',' + properties.$_scaleY + ', 1)';
					previousTransformValues.y = properties.$_y + properties.$_scrollRectYOffset;
					previousTransformValues.x = properties.$_x + properties.$_scrollRectXOffset;	
					previousTransformValues.rotation = properties.$_rotation;
					previousTransformValues.scaleX = properties.$_scaleX;
					previousTransformValues.scaleY = properties.$_scaleY;
				}
				
				return;
			}
			
			if (previousTransformValues.x != (properties.$_x + properties.$_scrollRectXOffset))
			{
				style.left = (properties.$_x + properties.$_scrollRectXOffset) + 'px';
				previousTransformValues.x = properties.$_x + properties.$_scrollRectXOffset;
			}
			if (previousTransformValues.y != (properties.$_y + properties.$_scrollRectYOffset))
			{
				style.top = (properties.$_y + properties.$_scrollRectYOffset) + 'px';
				previousTransformValues.y = properties.$_y + properties.$_scrollRectYOffset;
			}
			
			if (previousTransformValues.rotation != properties.$_rotation || previousTransformValues.scaleX != properties.$_scaleX || previousTransformValues.scaleY != properties.$_scaleY)
			{
				style[Browser.getTransformString()] = 'rotate(' + properties.$_rotation + 'deg) scale(' + properties.$_scaleX + ',' + properties.$_scaleY + ')';
				previousTransformValues.rotation = properties.$_rotation;
				previousTransformValues.scaleX = properties.$_scaleX;
				previousTransformValues.scaleY = properties.$_scaleY;
			}
		}

		public UNIMPLEMENTED function get mask():flash.display.DisplayObject
		{
			throw new Error('DisplayObject: attempted call to an unimplemented accessor "mask"');
		}
		
		public UNIMPLEMENTED function set mask(displayObject:DisplayObject):void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented accessor "mask"');
		}
		
		public function localToGlobal(point:Point):Point
		{
			if (this is Stage) return point.clone();
			
			var thisScope:* = $_properties.DisplayObjectScope;
			var thisBoundsRelativeToParent:* = thisScope.$_bounds;
			
			var current:DisplayObjectContainer;
			var currentScope:*;
			var width:* = thisScope.$_width;
			var height:* = thisScope.$_height;
			var value:*;
			var x1:*;
			var y1:*;
			
			var thisMatrix:Matrix = thisScope.$_matrix.clone();
			current = thisScope.$_domView.parentNode ? thisScope.$_domView.parentNode.displayObject : null;
			while (current !== null)
			{
				currentScope = current.$__properties().DisplayObjectScope;
				thisMatrix.concat(currentScope.$_matrix);
				current = currentScope.$_domView.parentNode ? currentScope.$_domView.parentNode.displayObject : null;
			}
			
			var xDiff:Number = 0;//thisScope.$_x1 - thisScope.$_x;
			var yDiff:Number = 0;//thisScope.$_y1 - thisScope.$_y;
			var array:* = thisMatrix.$__transformPoint(xDiff + point.x, yDiff + point.y);
			
			value = array[0];
			x1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			
			value = array[1];
			y1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			
			return new Point(x1, y1);
		}

		public function globalToLocal(point:Point):Point
		{
			if (this is Stage) return point.clone();
			
			var thisScope:* = $_properties.DisplayObjectScope;
			var thisBoundsRelativeToParent:* = thisScope.$_bounds;
			
			var current:DisplayObjectContainer;
			var currentScope:*;
			var width:* = thisScope.$_width;
			var height:* = thisScope.$_height;
			var value:*;
			var x1:*;
			var y1:*;
			
			var thisMatrix:Matrix = thisScope.$_matrix.clone();
			current = thisScope.$_domView.parentNode ? thisScope.$_domView.parentNode.displayObject : null;
			while (current !== null)
			{
				currentScope = current.$__properties().DisplayObjectScope;
				thisMatrix.concat(currentScope.$_matrix);
				current = currentScope.$_domView.parentNode ? currentScope.$_domView.parentNode.displayObject : null;
			}
			
			thisMatrix.invert();
			
			var xDiff:Number = 0;//thisScope.$_x1 - thisScope.$_x;
			var yDiff:Number = 0;//thisScope.$_y1 - thisScope.$_y;
			var array:* = thisMatrix.$__transformPoint(xDiff + point.x, yDiff + point.y);
			
			value = array[0];
			x1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			
			value = array[1];
			y1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			
			return new Point(x1, y1);
		}

		public UNIMPLEMENTED function hitTestObject (obj:DisplayObject) : Boolean
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "hitTestObject"');
		}

		public UNIMPLEMENTED function hitTestPoint (x:Number, y:Number, shapeFlag:Boolean=false) : Boolean
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "hitTestPoint"');
		}

		public function getBounds(targetCoordinateSpace:DisplayObject):Rectangle
		{			
			targetCoordinateSpace = targetCoordinateSpace || this;
			
			var thisScope:* = $_properties.DisplayObjectScope;
			var thisBoundsRelativeToParent:* = thisScope.$_bounds;
			
			var targetScope:* = targetCoordinateSpace.$__properties().DisplayObjectScope;
			var targetBoundsRelativeToParent:* = targetScope.$_bounds;
			
			var x1:*;
			var y1:*;
			var x2:*;
			var y2:*;
			var width:* = thisScope.$_width;
			var height:* = thisScope.$_height;
			var value:*;
			
			if (targetCoordinateSpace === this) //bounds relative to itself do not include transformations
			{
				value = thisScope.$_x1 - thisScope.$_x; //real non-transformed x minus set x 
				x1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
				
				value = thisScope.$_y1 - thisScope.$_y; //real non-transformed y minus set y
				y1 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
				
				value = width;
				x2 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
				
				value = height;
				y2 = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
				
				return new Rectangle(x1, y1, x2, y2);
			}
			
			var current:DisplayObjectContainer;
			var currentScope:*;
			var matrix:Matrix;
			
			var thisMatrix:Matrix = thisScope.$_matrix.clone();
			current = thisScope.$_domView.parentNode ? thisScope.$_domView.parentNode.displayObject : null;
			while (current !== null && current !== targetCoordinateSpace)
			{
				currentScope = current.$__properties().DisplayObjectScope;
				thisMatrix.concat(currentScope.$_matrix);
				current = currentScope.$_domView.parentNode ? currentScope.$_domView.parentNode.displayObject : null;
			}
			
			if (current === targetCoordinateSpace) matrix = thisMatrix;
			else 
			{
				var targetMatrix:Matrix = targetScope.$_matrix.clone();
				current = targetScope.$_domView.parentNode ? targetScope.$_domView.parentNode.displayObject : null;
				
				while (current !== null && current !== this) 
				{
					currentScope = current.$__properties().DisplayObjectScope;
					targetMatrix.concat(currentScope.$_matrix);
					current = currentScope.$_domView.parentNode ? currentScope.$_domView.parentNode.displayObject : null;
				}
				
				targetMatrix.invert();
				
				if (current === this) matrix = targetMatrix;
			}
			
			if (matrix === null)
			{
				thisMatrix.concat(targetMatrix);
				matrix = thisMatrix;
			}
			
			var xDiff:Number = thisScope.$_x1 - thisScope.$_x;
			var yDiff:Number = thisScope.$_y1 - thisScope.$_y;
			var point1:* = matrix.$__transformPoint(xDiff, yDiff); //top, left
			var point2:* = matrix.$__transformPoint(xDiff + width, yDiff); //top, right
			var point3:* = matrix.$__transformPoint(xDiff + width, yDiff + height); //bottom, right
			var point4:* = matrix.$__transformPoint(xDiff, yDiff + height); //bottom, left
			
			var left:* = Math.min(point1[0], point2[0], point3[0], point4[0]);
			var right:* = Math.max(point1[0], point2[0], point3[0], point4[0]);
			var top:* = Math.min(point1[1], point2[1], point3[1], point4[1]);
			var bottom:* = Math.max(point1[1], point2[1], point3[1], point4[1]);
			
			value = right - left;
			value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			var x2:* = value;
			
			value = bottom - top;
			value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			var y2:* = value;
			
			value = left;
			value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			var x1:* = value;
			
			value = top;
			value = (Math.round((Math.floor(Math.abs(value + .00125) * 1000) / 1000) * 20) / 20) * (value > 0 ? 1 : -1); //convert to twip
			var y1:* = value;
			
			return new Rectangle(x1, y1, x2, y2);
		}
		
		private function $_toCanvas():*
		{
			var node:* = $_properties.DisplayObjectScope.$_domView;
			var canvas:*;
			var bitmapData:BitmapData;
			
			if (node.nodeName == 'CANVAS') //shortcut if already a canvas element
			{
				canvas = document.createElement('canvas');
				canvas.width = node.width;
				canvas.height = node.height;
				
				canvas.getContext('2d').drawImage(node, 0, 0);
				
				return canvas;
			}
			
			//unfortunately the rest only seems to work in chrome... img.src does not appear to be be synchro in other browsers
			var clone:* = node.cloneNode(true);
			var img:*;
			var wrap:*;
			var data:String;
			var bin:*;
			
			var childNodesArray:Array = [clone.childNodes];
			while (childNodesArray.length)
			{
				var childNodes:* = childNodesArray.pop();
				
				for (var i:int = childNodes.length; i--;)
				{
					var child:* = childNodes[i];
					
					if (child.nodeName == 'SVG')
					{
						img = document.createElement('img');
						img.style.cssText = child.style.cssText;
						
						child.parentNode.replaceChild(img, child);
						
						wrap = document.createElement('div');
						wrap.appendChild(child);
						
						data = wrap.innerHTML;
						bin = window.btoa(data);
						
						img.setAttribute('src', 'data:' + 'image/svg+xml;charset=utf-8' + ';base64,' + bin);
					}
					else if (child.nodeName == 'CANVAS')
					{
						img = document.createElement('img');
						img.style.cssText = child.style.cssText;
						
						//img.setAttribute('src', child.getAttribute('rawData')); //find another way... i think this may be too memory and processor intensive
						child.parentNode.replaceChild(img, child);
					}
					else if (child.childNodes) childNodesArray.push(child.childNodes);
				}
			}
			
			wrap = document.createElement('div');
			wrap.appendChild(clone);
			
			var doc:* = document.implementation.createHTMLDocument('');
			doc.body.innerHTML = wrap.innerHTML;
			var wellFormedHTML:* = new window.XMLSerializer().serializeToString(doc.body.firstChild);
			
			var width:Number = this.width;
			var height:Number = this.height;
			
			data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"><foreignObject width="' + width + '" height="' + height + '">' + wellFormedHTML + '</foreignObject></svg>';
			
			bin = window.btoa(data);
			
			img = document.createElement('img');
			img.setAttribute('src', 'data:' + 'image/svg+xml;charset=utf-8' + ';base64,' + bin);
			
			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d').drawImage(img, 0, 0);
			
			return canvas;
		}

		public function get mouseX():Number
		{
			var mouseXPositionRelativeToStage:Number = Math.max(0, Stage.$__pageX - Stage.$__stageLeft);
			var mouseYPositionRelativeToStage:Number = Math.max(0, Stage.$__pageY - Stage.$__stageTop);
			
			return globalToLocal(new Point(mouseXPositionRelativeToStage / window.globalScale, mouseYPositionRelativeToStage / window.globalScale)).x;
		}

		public function get mouseY():Number
		{
			var mouseXPositionRelativeToStage:Number = Math.max(0, Stage.$__pageX - Stage.$__stageLeft);
			var mouseYPositionRelativeToStage:Number = Math.max(0, Stage.$__pageY - Stage.$__stageTop);
			
			return globalToLocal(new Point(mouseXPositionRelativeToStage / window.globalScale, mouseYPositionRelativeToStage / window.globalScale)).y;
		}

		public function get cacheAsBitmap():Boolean
		{
			return $_properties.DisplayObjectScope.$_cacheAsBitmap;
		}
		
		public function set cacheAsBitmap(value:Boolean):void
		{
			var properties:* = $_properties.DisplayObjectScope;
			
			if (value == properties.$_cacheAsBitmap) return;
			
			var previousTransformValues:* = $_previousTransformValues;
			var style:* = properties.$_domView.style;
			
			properties.$_cacheAsBitmap = value;
			
			if (value) style.top = style.left = '0px';
			
			previousTransformValues.y = NaN;
			previousTransformValues.x = NaN;	
			previousTransformValues.rotation = NaN;
			previousTransformValues.scaleX = NaN;
			previousTransformValues.scaleY = NaN;
			
			$_transform();
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		/**
		 * Indicates the instance name of the DisplayObject. The object can be identified in
		 * the child list of its parent display object container by calling the
		 * getChildByName() method of the display object container.
		 * @throws	IllegalOperationError If you are attempting to set this property on an object that was
		 *   placed on the timeline in the Flash authoring tool.
		 */
		public function get name():String
		{
			return $_properties.DisplayObjectScope.$_domView.getAttribute('name');
		}
		
		public function set name(value:String):void
		{
			$_properties.DisplayObjectScope.$_domView.setAttribute('name', value);
		}
		
		/**
		 * Indicates the alpha transparency value of the object specified.
		 * Valid values are 0 (fully transparent) to 1 (fully opaque).
		 * The default value is 1. Display objects with alpha
		 * set to 0 are active, even though they are invisible.
		 */
		public function get alpha():Number
		{
			return $_properties.DisplayObjectScope.$_opacity;
		}
		
		public function set alpha(value:Number):void
		{
			$_properties.DisplayObjectScope.$_opacity = value;
			$_properties.DisplayObjectScope.$_domView.style.opacity = value;
		}
				
		/**
		 * Indicates the DisplayObjectContainer object that contains this display object. Use the parent
		 * property to specify a relative path to display objects that are above the
		 * current display object in the display list hierarchy.
		 *
		 *   You can use parent to move up multiple levels in the display list as in the following:
		 * <codeblock>
		 *
		 *   this.parent.parent.alpha = 20;
		 *
		 *   </codeblock>
		 * @throws	SecurityError The parent display object belongs to a security sandbox
		 *   to which you do not have access. You can avoid this situation by having
		 *   the parent movie call the Security.allowDomain() method.
		 */
		public function get parent():DisplayObjectContainer
		{
			var domView:* = $_properties.DisplayObjectScope.$_domView;
			return domView.parentNode ? domView.parentNode.displayObject : null;
		}
		
		/**
		 * For a display object in a loaded SWF file, the root property is the
		 * top-most display object in the portion of the display list's tree structure represented by that SWF file.
		 * For a Bitmap object representing a loaded image file, the root property is the Bitmap object
		 * itself. For the instance of the main class of the first SWF file loaded, the root property is the
		 * display object itself. The root property of the Stage object is the Stage object itself. The root
		 * property is set to null for any display object that has not been added to the display list, unless
		 * it has been added to a display object container that is off the display list but that is a child of the
		 * top-most display object in a loaded SWF file.
		 *
		 *   For example, if you create a new Sprite object by calling the Sprite() constructor method,
		 * its root property is null until you add it to the display list (or to a display
		 * object container that is off the display list but that is a child of the top-most display object in a SWF file).For a loaded SWF file, even though the Loader object used to load the file may not be on the display list,
		 * the top-most display object in the SWF file has its root property set to itself.  The Loader object
		 * does not have its root property set until it is added as a child of a display object for which the
		 * root property is set.
		 */
		public function get root():DisplayObject
		{
			return $_properties.DisplayObjectScope.$_root;
		}
		
		/**
		 * The Stage of the display object. A Flash runtime application has only one Stage object.
		 * For example, you can create and load multiple display objects into the display list, and the
		 * stage property of each display object refers to the same Stage object (even if the
		 * display object belongs to a loaded SWF file).
		 *
		 *   If a display object is not added to the display list, its stage property is set to
		 * null.
		 */
		public function get stage():Stage
		{
			var parent:DisplayObject = this;
			while (parent) 
			{
				if (parent is Stage) return parent as Stage;
				
				var domView:* = parent.$__properties().DisplayObjectScope.$_domView;
				parent = domView.parentNode ? domView.parentNode.displayObject : null;
			}
			
			return null;
		}
		
		/**
		 * Returns a LoaderInfo object containing information about loading the file
		 * to which this display object belongs. The loaderInfo property is defined only
		 * for the root display object of a SWF file or for a loaded Bitmap (not for a Bitmap that is drawn
		 * with ActionScript). To find the loaderInfo object associated with the SWF file that contains
		 * a display object named myDisplayObject, use myDisplayObject.root.loaderInfo.
		 *
		 *   A large SWF file can monitor its download by calling
		 * this.root.loaderInfo.addEventListener(Event.COMPLETE, func).
		 */
		public function get loaderInfo():flash.display.LoaderInfo
		{
			return $_properties.DisplayObjectScope.$_loaderInfo;
		}
		
		/**
		 * A value from the BlendMode class that specifies which blend mode to use.
		 * A bitmap can be drawn internally in two ways. If you have a blend mode enabled or an
		 * external clipping mask, the bitmap is drawn by adding a bitmap-filled square shape to the vector
		 * render. If you attempt to set this property to an invalid value, Flash runtimes set the value
		 * to BlendMode.NORMAL.
		 *
		 *   The blendMode property affects each pixel of the display object.
		 * Each pixel is composed of three constituent
		 * colors (red, green, and blue), and each constituent color has a value between 0x00 and 0xFF.
		 * Flash Player or Adobe AIR compares each constituent color of one pixel in the movie clip with
		 * the corresponding color of the pixel in the background. For example, if blendMode
		 * is set to BlendMode.LIGHTEN, Flash Player or Adobe AIR compares the red value of the display object with
		 * the red value of the background, and uses the lighter of the two as the
		 * value for the red component of the displayed color.The following table describes the blendMode settings.
		 * The BlendMode class defines string values you can use.
		 * The illustrations in the table show blendMode values applied to a circular
		 * display object (2) superimposed on another display object (1).BlendMode ConstantIllustrationDescriptionBlendMode.NORMALThe display object appears in front of the background. Pixel values of the display object
		 * override those of the background. Where the display object is transparent, the background is
		 * visible.BlendMode.LAYERForces the creation of a transparency group for the display object. This means that the display
		 * object is pre-composed in a temporary buffer before it is processed further. This is done
		 * automatically if the display object is pre-cached using bitmap caching or if the display object is
		 * a display object container with at least one child object with a blendMode
		 * setting other than BlendMode.NORMAL. Not supported under GPU rendering.
		 * BlendMode.MULTIPLYMultiplies the values of the display object constituent colors by the colors of the background color,
		 * and then normalizes by dividing by 0xFF,
		 * resulting in darker colors. This setting is commonly used for shadows and depth effects.
		 *
		 *   For example, if a constituent color (such as red) of one pixel in the display object and the
		 * corresponding color of the pixel in the background both have the value 0x88, the multiplied
		 * result is 0x4840. Dividing by 0xFF yields a value of 0x48 for that constituent color,
		 * which is a darker shade than the color of the display object or the color of the background.BlendMode.SCREENMultiplies the complement (inverse) of the display object color by the complement of the background
		 * color, resulting in a bleaching effect. This setting is commonly used for highlights or to remove black
		 * areas of the display object.BlendMode.LIGHTENSelects the lighter of the constituent colors of the display object and the color of the background (the
		 * colors with the larger values). This setting is commonly used for superimposing type.
		 *
		 *   For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background
		 * pixel has an RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is
		 * 0xFFF833 (because 0xFF > 0xDD, 0xCC < 0xF8, and 0x33 > 0x00 = 33). Not supported under GPU rendering.BlendMode.DARKENSelects the darker of the constituent colors of the display object and the colors of the
		 * background (the colors with the smaller values). This setting is commonly used for superimposing type.
		 *
		 *   For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background
		 * pixel has an RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is
		 * 0xDDCC00 (because 0xFF > 0xDD, 0xCC < 0xF8, and 0x33 > 0x00 = 33). Not supported under GPU rendering.BlendMode.DIFFERENCECompares the constituent colors of the display object with the colors of its background, and subtracts
		 * the darker of the values of the two constituent colors from the lighter value. This setting is commonly
		 * used for more vibrant colors.
		 *
		 *   For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background
		 * pixel has an RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is
		 * 0x222C33 (because 0xFF - 0xDD = 0x22, 0xF8 - 0xCC = 0x2C, and 0x33 - 0x00 = 0x33).BlendMode.ADDAdds the values of the constituent colors of the display object to the colors of its background, applying a
		 * ceiling of 0xFF. This setting is commonly used for animating a lightening dissolve between
		 * two objects.
		 *
		 *   For example, if the display object has a pixel with an RGB value of 0xAAA633, and the background
		 * pixel has an RGB value of 0xDD2200, the resulting RGB value for the displayed pixel is
		 * 0xFFC833 (because 0xAA + 0xDD > 0xFF, 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).BlendMode.SUBTRACTSubtracts the values of the constituent colors in the display object from the values of the
		 * background color, applying a floor of 0. This setting is commonly used for animating a
		 * darkening dissolve between two objects.
		 *
		 *   For example, if the display object has a pixel with an RGB value of 0xAA2233, and the background
		 * pixel has an RGB value of 0xDDA600, the resulting RGB value for the displayed pixel is
		 * 0x338400 (because 0xDD - 0xAA = 0x33, 0xA6 - 0x22 = 0x84, and 0x00 - 0x33 < 0x00).BlendMode.INVERTInverts the background.BlendMode.ALPHAApplies the alpha value of each pixel of the display object to the background.
		 * This requires the blendMode setting of the parent display object to be set to
		 * BlendMode.LAYER.
		 * For example, in the illustration, the parent display object, which is a white background,
		 * has blendMode = BlendMode.LAYER. Not supported under GPU rendering.BlendMode.ERASEErases the background based on the alpha value of the display object. This requires the
		 * blendMode of the parent display object to be set to
		 * BlendMode.LAYER. For example, in the
		 * illustration, the parent display object, which is a white background, has
		 * blendMode = BlendMode.LAYER. Not supported under GPU rendering.BlendMode.OVERLAYAdjusts the color of each pixel based on the darkness of the background.
		 * If the background is lighter than 50% gray, the display object and background colors are
		 * screened, which results in a lighter color. If the background is darker than 50% gray,
		 * the colors are multiplied, which results in a darker color.
		 * This setting is commonly used for shading effects. Not supported under GPU rendering.BlendMode.HARDLIGHTAdjusts the color of each pixel based on the darkness of the display object.
		 * If the display object is lighter than 50% gray, the display object and background colors are
		 * screened, which results in a lighter color. If the display object is darker than 50% gray,
		 * the colors are multiplied, which results in a darker color.
		 * This setting is commonly used for shading effects. Not supported under GPU rendering.BlendMode.SHADERN/AAdjusts the color using a custom shader routine. The shader that is used is specified
		 * as the Shader instance assigned to the blendShader property. Setting the
		 * blendShader property of a display object to a Shader instance
		 * automatically sets the display object's blendMode property to
		 * BlendMode.SHADER. If the blendMode property is set to
		 * BlendMode.SHADER without first setting the blendShader property,
		 * the blendMode property is set to BlendMode.NORMAL. Not supported under GPU rendering.
		 */
		public UNIMPLEMENTED function get blendMode () : String
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "blendMode"');
		}

		public UNIMPLEMENTED function set blendMode (value:String) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "blendMode"');
		}

		/**
		 * Sets a shader that is used for blending the foreground and background. When the
		 * blendMode property is set to BlendMode.SHADER, the specified
		 * Shader is used to create the blend mode output for the display object.
		 *
		 *   Setting the blendShader property of a display object to a Shader instance
		 * automatically sets the display object's blendMode property to
		 * BlendMode.SHADER. If the blendShader property is set (which sets the
		 * blendMode property to BlendMode.SHADER), then the value of the
		 * blendMode property is changed, the blend mode can be reset to use the blend
		 * shader simply by setting the blendMode property to BlendMode.SHADER.
		 * The blendShader property does not need to be set again except to change the
		 * shader that's used for the blend mode.The Shader assigned to the blendShader property must specify at least two
		 * image4 inputs. The inputs do not need to be specified in code using the
		 * associated ShaderInput objects' input properties. The background display object
		 * is automatically
		 * used as the first input (the input with index 0). The foreground display object
		 * is used as the second input (the input with index 1). A shader used as a blend
		 * shader can specify more than two inputs. In that case, any additional input must be specified
		 * by setting its ShaderInput instance's input property.When you assign a Shader instance to this property the shader is copied internally. The
		 * blend operation uses that internal copy, not a reference to the original shader. Any changes
		 * made to the shader, such as changing a parameter value, input, or bytecode, are not applied
		 * to the copied shader that's used for the blend mode.
		 * @throws	ArgumentError When the shader output type is not compatible with this operation
		 *   (the shader must specify a pixel4
		 *   output).
		 * @throws	ArgumentError When the shader specifies fewer than two image inputs or the first
		 *   two inputs are not image4 inputs.
		 * @throws	ArgumentError When the shader specifies an image input that isn't provided.
		 * @throws	ArgumentError When a ByteArray or Vector.<Number> instance is used as
		 *   an input and the width
		 *   and height properties aren't specified for the
		 *   ShaderInput, or the specified values don't match the amount of
		 *   data in the input object. See the ShaderInput.input
		 *   property for more information.
		 */
		public UNIMPLEMENTED function set blendShader (value:Shader) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "blendShader"');
		}

		/**
		 * An indexed array that contains each filter object currently associated with the display object.
		 * The flash.filters package contains several classes that define specific filters you can
		 * use.
		 *
		 *   Filters can be applied in Flash Professional at design time, or at run time by using
		 * ActionScript code. To apply a filter by using ActionScript, you must make a temporary copy of the
		 * entire filters array, modify the temporary array, then assign the value
		 * of the temporary array back to the filters array. You cannot directly
		 * add a new filter object to the filters array.To add a filter by using ActionScript, perform the following steps (assume that the
		 * target display object is named myDisplayObject):Create a new filter object by using the constructor method of your chosen filter
		 * class.Assign the value of the myDisplayObject.filters array to a temporary array, such
		 * as one named myFilters.Add the new filter object to the myFilters temporary array.Assign the value of the temporary array to the myDisplayObject.filters array.If the filters array is undefined, you do not need to use a temporary array.
		 * Instead, you can directly assign an array literal that contains one or more filter objects that
		 * you create. The first example in the Examples section adds a drop shadow filter by using
		 * code that handles both defined and undefined filters arrays.To modify an existing filter object,
		 * you must use the technique of modifying a copy of the filters array:Assign the value of the filters array to a temporary array, such as one
		 * named myFilters.Modify the property by using the temporary array, myFilters. For example,
		 * to set the quality property of the first filter in the array, you could use the
		 * following code: myFilters[0].quality = 1;Assign the value of the temporary array to the filters array.At load time, if a display object has an associated filter, it is marked to cache itself as a
		 * transparent bitmap. From this point forward, as long as the display object has a valid filter list,
		 * the player caches the display object as a bitmap. This source bitmap is used as a source
		 * image for the filter effects. Each display object usually has two bitmaps: one with the
		 * original unfiltered source display object and another for the final image after filtering.
		 * The final image is used when rendering. As long as the display object does not
		 * change, the final image does not need updating.The flash.filters package includes classes for filters. For example, to create a DropShadow
		 * filter, you would write:
		 * <codeblock>
		 *
		 *   import flash.filters.DropShadowFilter
		 * var myFilter:DropShadowFilter = new DropShadowFilter (distance, angle, color, alpha, blurX, blurY, quality, inner, knockout)
		 *
		 *   </codeblock>
		 * You can use the is operator to determine the type of filter assigned to
		 * each index position in the filter array. For example, the following code shows
		 * how to determine the position of the first filter in the filters array that
		 * is a DropShadowFilter:
		 *
		 *   <codeblock>
		 *
		 *   import flash.text.TextField;
		 * import flash.filters.~~;
		 * var tf:TextField = new TextField();
		 * var filter1:DropShadowFilter = new DropShadowFilter();
		 * var filter2:GradientGlowFilter = new GradientGlowFilter();
		 * tf.filters = [filter1, filter2];
		 *
		 *   tf.text = "DropShadow index: " + filterPosition(tf, DropShadowFilter).toString(); // 0
		 * addChild(tf)
		 *
		 *   function filterPosition(displayObject:DisplayObject, filterClass:Class):int {
		 * for (var i:uint = 0; i < displayObject.filters.length; i++) {
		 * if (displayObject.filters[i] is filterClass) {
		 * return i;
		 * }
		 * }
		 * return -1;
		 * }
		 *
		 *   </codeblock>
		 * Note: Since you cannot directly add a new filter object to the
		 * DisplayObject.filters array, the following code has no
		 * effect on the target display object, named myDisplayObject:
		 * <codeblock>
		 *
		 *   myDisplayObject.filters.push(myDropShadow);
		 *
		 *   </codeblock>
		 * @throws	ArgumentError When filters includes a ShaderFilter and the shader
		 *   output type is not compatible with this operation
		 *   (the shader must specify a pixel4
		 *   output).
		 * @throws	ArgumentError When filters includes a ShaderFilter and the shader
		 *   doesn't specify any image input or the first
		 *   input is not an image4 input.
		 * @throws	ArgumentError When filters includes a ShaderFilter and the shader
		 *   specifies an image input that isn't provided.
		 * @throws	ArgumentError When filters includes a ShaderFilter, a
		 *   ByteArray or Vector.<Number> instance as
		 *   a shader input, and the width
		 *   and height properties aren't specified for the
		 *   ShaderInput object, or the specified values don't match the amount of
		 *   data in the input data. See the ShaderInput.input
		 *   property for more information.
		 */
		public UNIMPLEMENTED function get filters () : Array
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "filters"');
		}

		public UNIMPLEMENTED function set filters (value:Array) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "filters"');
		}

		/**
		 * Specifies whether the display object is opaque with a certain background color.
		 * A transparent bitmap contains alpha
		 * channel data and is drawn transparently. An opaque bitmap has no alpha channel (and renders faster
		 * than a transparent bitmap). If the bitmap is opaque, you specify its own background color to use.
		 *
		 *   If set to a number value, the surface is opaque (not transparent) with the RGB background
		 * color that the number specifies. If set to null (the default value), the display
		 * object has a transparent background.The opaqueBackground property is intended mainly for use with the
		 * cacheAsBitmap property, for rendering optimization. For display objects in which the
		 * cacheAsBitmap property is set to true, setting opaqueBackground can
		 * improve rendering performance.The opaque background region is not matched when calling the hitTestPoint()
		 * method with the shapeFlag parameter set to true.The opaque background region does not respond to mouse events.
		 */
		public UNIMPLEMENTED function get opaqueBackground () : Object
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "opaqueBackground"');
		}

		public UNIMPLEMENTED function set opaqueBackground (value:Object) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "opaqueBackground"');
		}

		/**
		 * Indicates the x-axis rotation of the DisplayObject instance, in degrees, from its original orientation relative to the 3D parent container. Values from 0 to 180 represent
		 * clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or
		 * subtracted from 360 to obtain a value within the range.
		 */
		public UNIMPLEMENTED function get rotationX () : Number
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationX"');
		}

		public UNIMPLEMENTED function set rotationX (value:Number) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationX"');
		}

		/**
		 * Indicates the y-axis rotation of the DisplayObject instance, in degrees, from its original orientation relative to the 3D parent container. Values from 0 to 180 represent
		 * clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or
		 * subtracted from 360 to obtain a value within the range.
		 */
		public UNIMPLEMENTED function get rotationY () : Number
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationY"');
		}

		public UNIMPLEMENTED function set rotationY (value:Number) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationY"');
		}

		/**
		 * Indicates the z-axis rotation of the DisplayObject instance, in degrees, from its original orientation relative to the 3D parent container. Values from 0 to 180 represent
		 * clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or
		 * subtracted from 360 to obtain a value within the range.
		 */
		public UNIMPLEMENTED function get rotationZ () : Number
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationZ"');
		}

		public UNIMPLEMENTED function set rotationZ (value:Number) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "rotationZ"');
		}

		/**
		 * The current scaling grid that is in effect. If set to null,
		 * the entire display object is scaled normally when any scale transformation is
		 * applied.
		 *
		 *   When you define the scale9Grid property, the display object is divided into a
		 * grid with nine regions based on the scale9Grid rectangle, which defines the
		 * center region of the grid. The eight other regions of the grid are the following areas: The upper-left corner outside of the rectangleThe area above the rectangle The upper-right corner outside of the rectangleThe area to the left of the rectangleThe area to the right of the rectangleThe lower-left corner outside of the rectangleThe area below the rectangleThe lower-right corner outside of the rectangleYou can think of the eight regions outside of the center (defined by the rectangle)
		 * as being like a picture frame that has special rules applied to it when scaled.When the scale9Grid property is set and a display object is scaled, all text and
		 * gradients are scaled normally; however, for other types of objects the following rules apply:Content in the center region is scaled normally. Content in the corners is not scaled. Content in the top and bottom regions is scaled horizontally only. Content in the
		 * left and right regions is scaled vertically only.All fills (including bitmaps, video, and gradients) are stretched to fit their shapes.If a display object is rotated, all subsequent scaling is normal (and the
		 * scale9Grid property is ignored).For example, consider the following display object and a rectangle that is applied as the display
		 * object's scale9Grid:The display object.The red rectangle shows the scale9Grid.When the display object is scaled or stretched, the objects within the rectangle scale
		 * normally, but the objects outside of the rectangle scale according to the
		 * scale9Grid rules:Scaled to 75%:Scaled to 50%:Scaled to 25%:Stretched horizontally 150%: A common use for setting scale9Grid is to set up a display object to be used
		 * as a component, in which edge regions retain the same width when the component is scaled.
		 * @maelexample	The following creates a movie clip that contains a 20-pixel line (which forms a border)
		 *   and a gradient fill. The movie clip scales based on the mouse position, and because of the
		 *   <code>scale9Grid</code> set for the movie clip, the thickness of the 20-pixel line does not
		 *   vary when the clip scales (although the gradient in the movie clip <em>does</em> scale):
		 *
		 *     <listing version="2.0">
		 *   import flash.geom.Rectangle;
		 *   import flash.geom.Matrix;
		 *
		 *     this.createEmptyMovieClip("my_mc", this.getNextHighestDepth());
		 *
		 *     var grid:Rectangle = new Rectangle(20, 20, 260, 260);
		 *   my_mc.scale9Grid = grid ;
		 *
		 *     my_mc._x = 50;
		 *   my_mc._y = 50;
		 *
		 *     function onMouseMove()
		 *   {
		 *   my_mc._width  = _xmouse;
		 *   my_mc._height = _ymouse;
		 *   }
		 *
		 *     my_mc.lineStyle(20, 0xff3333, 100);
		 *   var gradient_matrix:Matrix = new Matrix();
		 *   gradient_matrix.createGradientBox(15, 15, Math.PI, 10, 10);
		 *   my_mc.beginGradientFill("radial", [0xffff00, 0x0000ff],
		 *   [100, 100], [0, 0xFF], gradient_matrix,
		 *   "reflect", "RGB", 0.9);
		 *   my_mc.moveTo(0, 0);
		 *   my_mc.lineTo(0, 300);
		 *   my_mc.lineTo(300, 300);
		 *   my_mc.lineTo(300, 0);
		 *   my_mc.lineTo(0, 0);
		 *   my_mc.endFill();
		 *   </listing>
		 * @throws	ArgumentError If you pass an invalid argument to the method.
		 */
		public UNIMPLEMENTED function get scale9Grid () : flash.geom.Rectangle
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "scale9Grid"');
		}

		public UNIMPLEMENTED function set scale9Grid (innerRectangle:Rectangle) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "scale9Grid"');
		}

		/**
		 * Indicates the depth scale (percentage) of an object as applied from the registration point of the object. The
		 * default registration point is (0,0). 1.0 is 100% scale.
		 *
		 *   Scaling the local coordinate system changes the x, y and z property values, which are defined in
		 * whole pixels.
		 */
		public UNIMPLEMENTED function get scaleZ () : Number
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "scaleZ"');
		}

		public UNIMPLEMENTED function set scaleZ (value:Number) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "scaleZ"');
		}
		
		/**
		 * Indicates the z coordinate position along the z-axis of the DisplayObject
		 * instance relative to the 3D parent container. The z property is used for
		 * 3D coordinates, not screen or pixel coordinates.
		 * When you set a z property for a display object to something other than the default
		 * value of 0, a corresponding Matrix3D object is automatically created. for adjusting a
		 * display object's position and orientation
		 * in three dimensions. When working with the z-axis,
		 * the existing behavior of x and y properties changes from screen or pixel coordinates to
		 * positions relative to the 3D parent container.For example, a child of the _root  at position x = 100, y = 100, z = 200
		 * is not drawn at pixel location (100,100). The child is drawn wherever the 3D projection
		 * calculation puts it. The calculation is: (x~~cameraFocalLength/cameraRelativeZPosition, y~~cameraFocalLength/cameraRelativeZPosition)
		 */
		public UNIMPLEMENTED function get z () : Number
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "z"');
		}

		public UNIMPLEMENTED function set z (value:Number) : void
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "z"');
		}

		/**
		 * Converts a two-dimensional point from the Stage (global) coordinates to a
		 * three-dimensional display object's (local) coordinates.
		 *
		 *   To use this method, first create an instance of the Point class.
		 * The x and y values that you assign to the Point object represent global
		 * coordinates because they are relative to the origin (0,0) of the main display area.
		 * Then pass the Point object to the globalToLocal3D()
		 * method as the point parameter. The method returns three-dimensional
		 * coordinates as a Vector3D object containing x, y, and
		 * z values that are relative to the origin
		 * of the three-dimensional display object.
		 * @param	point	A two dimensional Point object representing global x and y coordinates.
		 * @return	A Vector3D object with coordinates relative to the three-dimensional
		 *   display object.
		 */
		public UNIMPLEMENTED function globalToLocal3D (point:Point) : flash.geom.Vector3D
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "globalToLocal3D"');
		}

		/**
		 * Converts a three-dimensional point of the three-dimensional display
		 * object's (local) coordinates to a two-dimensional point in the Stage (global) coordinates.
		 *
		 *   For example, you can only use two-dimensional coordinates (x,y) to
		 * draw with the display.Graphics methods. To draw a three-dimensional
		 * object, you need to map the three-dimensional coordinates of a
		 * display object to two-dimensional coordinates. First, create an instance of
		 * the Vector3D class that holds the x-, y-, and z- coordinates of the three-dimensional
		 * display object. Then pass the Vector3D object to the local3DToGlobal()
		 * method as the point3d parameter. The method returns a two-dimensional Point
		 * object that can be used
		 * with the Graphics API to draw the three-dimensional object.
		 * @param	point3d	A Vector3D object containing either a three-dimensional point or
		 *   the coordinates of the three-dimensional display object.
		 * @return	A two-dimensional point representing a three-dimensional point
		 *   in two-dimensional space.
		 */
		public UNIMPLEMENTED function local3DToGlobal (point3d:Vector3D) : flash.geom.Point
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "local3DToGlobal"');
		}
		
		/**
		 * Returns a rectangle that defines the boundary of the display object,
		 * based on the coordinate system defined by the targetCoordinateSpace
		 * parameter, excluding any strokes on shapes. The values that the getRect() method
		 * returns are the same or smaller than those returned by the getBounds() method.
		 *
		 *   Note: Use localToGlobal() and globalToLocal() methods
		 * to convert the display object's local coordinates to Stage coordinates, or Stage coordinates to
		 * local coordinates, respectively.
		 * @param	targetCoordinateSpace	The display object that defines the coordinate system to use.
		 * @return	The rectangle that defines the area of the display object relative to
		 *   the targetCoordinateSpace object's coordinate system.
		 */
		public UNIMPLEMENTED function getRect (targetCoordinateSpace:DisplayObject) : flash.geom.Rectangle
		{
			throw new Error('DisplayObject: attempted call to an unimplemented function "getRect"');
		}

		/**
		 * The current accessibility options for this display object. If you modify the accessibilityProperties
		 * property or any of the fields within accessibilityProperties, you must call
		 * the Accessibility.updateProperties() method to make your changes take effect.
		 *
		 *   Note: For an object created in the Flash authoring environment, the value of accessibilityProperties
		 * is prepopulated with any information you entered in the Accessibility panel for
		 * that object.
		 */
		public function get accessibilityProperties():AccessibilityProperties
		{
			return $_properties.DisplayObjectScope.accessibilityProperties;
		}

		public function set accessibilityProperties(accessibilityProperties:AccessibilityProperties):void
		{
			$_properties.DisplayObjectScope.accessibilityProperties = accessibilityProperties;
			
			if (accessibilityProperties) accessibilityProperties.$_setOwner(this);
		}
	}
}
