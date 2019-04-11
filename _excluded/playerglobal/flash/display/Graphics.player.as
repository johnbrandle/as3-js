/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.IGraphicsData;
	import flash.display.Shader;
	import flash.geom.Matrix;
	
	import browser.Browser;

	public final class Graphics 
	{
		private static var $_uniqueIDCounter:Number = 0;
		
		private var $_displayObject:DisplayObject;
		
		private var $_domGraphicsView:Object;
		
		private var $_fillType:String = '';
		
		private var $_fillColor:uint;
		private var $_fillAlpha:Number;
		private var $_fillBitmapData:String;
		
		private var $_strokeThickness:Number = 0;
		
		private var $_strokeColor:uint;
		
		private var $_strokeAlpha:Number;
		
		private var $_strokePixelHinting:Boolean;
		
		private var $_strokeScaleMode:String;
		
		private var $_strokeCaps:String;
		
		private var $_strokeJoints:String;
		
		private var $_strokeMiterLimit:Number;

		private var $_domPathView:Object;
	
		private static var $_objects:Array; //hack for mobile: holds svg elements that were cleared and initiated a touchstart event... we listen for the touchend event even though it isn't on the displaylist

		private var $_maxWidth:Number = 0;
		private var $_maxHeight:Number = 0;

		private var $_maxNegX:Number = 0;
		private var $_maxNegY:Number = 0;

		public function Graphics(displayObject:DisplayObject)
		{
			$_displayObject = displayObject;
			
			$_domGraphicsView = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			$_displayObject.$__addDomGraphicsView($_domGraphicsView);
			$_domGraphicsView.setAttribute('version', '1.1');
			$_domGraphicsView.setAttribute('tabindex', '-1');
			$_domGraphicsView.setAttribute('focusable', false);
			$_domGraphicsView.style.display = 'block';
			$_domGraphicsView.style.position = 'absolute';
			$_domGraphicsView.style.pointerEvents = 'none';
			$_domGraphicsView.style[Browser.getTransformOriginString()] = '0% 0%';
			$_domGraphicsView.style[Browser.getTransformString()] = 'translateZ(0)';
			$_domGraphicsView.style[Browser.getBackfaceVisibilityString()] = 'hidden';
		}
		
		private static function $_convertToColorString(color:uint):String
		{
			var colorString:String = color.toString(16);
			while(colorString.length < 6) colorString = '0' + colorString;
			return '#' + colorString;
		}
		
		private function $_doFillAndLine(element:Object):void
		{
			if ($_fillType == 'beginFill') 
			{
				element.setAttribute('fill', $_convertToColorString($_fillColor));
				element.setAttribute('fill-opacity', $_fillAlpha);
			}
			else if ($_fillType == 'beginBitmapFill') element.setAttribute('fill', 'url(#' + $_fillBitmapData + ')');
			else element.setAttribute('fill-opacity', 0);
			
			if (!element.getAttribute('shape-rendering')) element.setAttribute('shape-rendering', (window.mobile) ? 'optimizeSpeed' : 'auto');
			
			var interactiveObject:InteractiveObject = $_displayObject as InteractiveObject;
			element.style.pointerEvents = (interactiveObject && interactiveObject.$__properties().InteractiveObjectScope.$_mouseEnabled) ? 'visible' : 'none';
			
			if (!$_strokeThickness) return;
			
			element.setAttribute('stroke-width', $_strokeThickness);
			element.setAttribute('stroke', $_convertToColorString($_strokeColor));
			element.setAttribute('stroke-opacity', $_strokeAlpha);
			element.setAttribute('stroke-miterlimit', $_strokeMiterLimit);
			
			if ($_strokeCaps == CapsStyle.SQUARE) element.setAttribute('stroke-linecap', 'square');
			else if ($_strokeCaps == CapsStyle.NONE) element.setAttribute('stroke-linecap', 'butt');
			else element.setAttribute('stroke-linecap', 'round');
		}

		public function beginFill(color:uint, alpha:Number=1):void
		{
			$_fillType = 'beginFill';
			$_fillColor = color;
			$_fillAlpha = alpha;
		}

		public function drawRect(x:Number, y:Number, width:Number, height:Number):void
		{
			var rect:Object = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('x', x + 'px');
			rect.setAttribute('y', y + 'px');
			rect.setAttribute('width', width + 'px');
			rect.setAttribute('height', height + 'px');
			
			$_doFillAndLine(rect);
			
			$_domGraphicsView.appendChild(rect);

			var val:*;

			val = width + x + ($_strokeThickness / 2);
			if (val > $_maxWidth) $_maxWidth = val;

			val = height + y + ($_strokeThickness / 2);
			if (val > $_maxHeight) $_maxHeight = val;

			$_domGraphicsView.style.width = $_maxWidth + 'px';
			$_domGraphicsView.style.height = $_maxHeight + 'px';

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public function drawCircle(x:Number, y:Number, radius:Number):void
		{
			var circle:Object = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', x);
			circle.setAttribute('cy', y);
			circle.setAttribute('r', radius);
			
			$_doFillAndLine(circle);
			
			$_domGraphicsView.appendChild(circle);
			
			var minX:Number = x - radius;
			var minY:Number = y - radius;
			var maxX:Number = radius + x;
			var maxY:Number = radius + y;
			
			var xTransform:Number;
			var yTransform:Number;
			if (minX < $_maxNegX) $_maxNegX = xTransform = minX;
			if (minY < $_maxNegY) $_maxNegY = yTransform = minY;
			
			if (!isNaN(xTransform) || !isNaN(yTransform)) 
			{
				circle.style[Browser.getTransformString()] = 'translate3d(' + -($_maxNegX) + 'px, ' + -($_maxNegY) + 'px, 0px)';
				$_domGraphicsView.style[Browser.getTransformString()] = 'translate3d(' + $_maxNegX + 'px, ' + $_maxNegY + 'px, 0px)';
			}
			
			if (maxX + ($_strokeThickness / 2) > $_maxWidth) $_maxWidth = maxX + ($_strokeThickness / 2);
			if (maxY + ($_strokeThickness / 2) > $_maxHeight) $_maxHeight = maxY + ($_strokeThickness / 2);
			$_domGraphicsView.style.width = ($_maxWidth + -($_maxNegX)) + 'px';
			$_domGraphicsView.style.height = ($_maxHeight + -($_maxNegY)) + 'px';

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public function drawEllipse(x:Number, y:Number, width:Number, height:Number):void
		{
			var ellipse:Object = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
			ellipse.setAttribute('cx', x + (width / 2));
			ellipse.setAttribute('cy', y + (height / 2));
			ellipse.setAttribute('rx', width / 2);
			ellipse.setAttribute('ry', height / 2);
			
			$_doFillAndLine(ellipse);
			
			$_domGraphicsView.appendChild(ellipse);
			
			if (width + x + ($_strokeThickness / 2) > $_maxWidth) $_maxWidth = width + x + ($_strokeThickness / 2);
			if (height + y + ($_strokeThickness / 2) > $_maxHeight) $_maxHeight = height + y + ($_strokeThickness / 2);
			$_domGraphicsView.style.width = $_maxWidth + 'px';
			$_domGraphicsView.style.height = $_maxHeight + 'px';

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public function drawRoundRect (x:Number, y:Number, width:Number, height:Number, ellipseWidth:Number, ellipseHeight:Number=NaN) : void
		{
			if (isNaN(ellipseHeight)) ellipseHeight = ellipseWidth;
			
			var rect:Object = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('x', x);
			rect.setAttribute('y', y);
			rect.setAttribute('width', width);
			rect.setAttribute('height', height);
			rect.setAttribute('rx', ellipseWidth / 2);
			rect.setAttribute('ry', ellipseHeight / 2);
			
			$_doFillAndLine(rect);
			
			$_domGraphicsView.appendChild(rect);
			
			if (width + x + ($_strokeThickness / 2) > $_maxWidth) $_maxWidth = width + x + ($_strokeThickness / 2);
			if (height + y + ($_strokeThickness / 2) > $_maxHeight) $_maxHeight = height + y + ($_strokeThickness / 2);
			$_domGraphicsView.style.width = $_maxWidth + 'px';
			$_domGraphicsView.style.height = $_maxHeight + 'px';

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public UNIMPLEMENTED function drawRoundRectComplex (x:Number, y:Number, width:Number, height:Number, topLeftRadius:Number, topRightRadius:Number, bottomLeftRadius:Number, bottomRightRadius:Number) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "drawRoundRectComplex"');
		}

		public function clear():void
		{
			$_fillType = '';
			$_fillColor = 0;
			$_fillAlpha = 0;
			$_fillBitmapData = null;
			
			$_strokeThickness = 0;
			$_strokeColor = 0;
			$_strokeAlpha = 0;
			$_strokePixelHinting = false;
			$_strokeScaleMode = '';
			$_strokeCaps = '';
			$_strokeJoints = '';
			$_strokeMiterLimit = 0;
			
			$_maxNegX = $_maxNegY = 0;
			$_maxWidth = $_maxHeight = 0;
			$_domGraphicsView.style.width = '0px';
			$_domGraphicsView.style.height = '0px';
			$_domGraphicsView.style.transform = 'translate3d(0px, 0px, 0px)';
			$_domPathView = null;

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, null); //should no longer be included in parent's sizing calculations

			var interactiveObject:InteractiveObject = $_displayObject as InteractiveObject;
			var childNode:*;
			var i:*;
			if (interactiveObject)
			{
				if (window.mobile)
				{
					if (interactiveObject.$__properties().InteractiveObjectScope.$_onMouseUp && !$_objects) $_objects = [];
					else if (!interactiveObject.$__properties().InteractiveObjectScope.$_onMouseUp && $_objects)
					{
						for (i = $_objects.length; i--;) 
						{
							var object:* = $_objects[i];
							
							object.removeEventListener('touchend', onMouseUp, false);
							object.removeEventListener('touchmove', onMouseMove, false);
						}
						$_objects = null;	
					}
					
					while ($_domGraphicsView.childElementCount) 
					{
						childNode = $_domGraphicsView.childNodes[0];
						
						if ($_objects)
						{
							$_objects.push(childNode);
							
							childNode.addEventListener('touchend', onMouseUp, false);
							childNode.addEventListener('touchmove', onMouseMove, false);
						}
						
						$_domGraphicsView.removeChild(childNode);
					}
				}
				else
				{
					if (interactiveObject.$__properties().InteractiveObjectScope.$_onMouseOut && !$_objects) $_objects = [];
					else if (!interactiveObject.$__properties().InteractiveObjectScope.$_onMouseOut && $_objects)
					{
						for (i = $_objects.length; i--;) $_objects[i].removeEventListener('mouseout', onMouseOut, false);
						for (i = $_objects.length; i--;) if ($_objects[i].parentNode) $_objects[i].parentNode.removeChild($_objects[i]);
						
						$_objects = null;	
					}
					
					for (i = $_domGraphicsView.childElementCount; i--;) 
					{
						childNode = $_domGraphicsView.childNodes[i];
						
						if ($_objects)
						{
							$_objects.push(childNode);
							childNode.addEventListener('mouseout', onMouseOut, false);
							childNode.addEventListener('mouseup', onMouseOut, false);
						}
						
						childNode.style.opacity = 0;
					}	
				}
			}
			else
			{
				for (i = $_domGraphicsView.childElementCount; i--;) 
				{
					childNode = $_domGraphicsView.childNodes[i];
					
					$_domGraphicsView.removeChild(childNode);
				}
			}
		}
		
		private function onMouseUp(event:Object):void
		{
			if (!$_objects) return;
			
			for (var i:* = $_objects.length; i--;) 
			{
				var object:* = $_objects[i];
				
				object.removeEventListener('touchend', onMouseUp, false);
				object.removeEventListener('touchmove', onMouseMove, false);
			}
			$_objects = null;
			
			($_displayObject as InteractiveObject).$__properties().InteractiveObjectScope.$_onMouseUp(event);
		}
		
		private function onMouseMove(event:Object):void
		{
			var interactiveObject:InteractiveObject = $_displayObject as InteractiveObject;
			var stage:Stage = interactiveObject.stage;
			
			if (stage) 
			{
				Stage.$__pageX = event.touches[0].pageX; //usually stage updates these, but we will need to do it here since mouseMove will not be called directly in Stage
				Stage.$__pageY = event.touches[0].pageY; //usually stage updates these, but we will need to do it here since mouseMove will not be called directly in Stage
				
				stage.$__properties().InteractiveObjectScope.$_onMouseMove(event);
			}
		}
		
		private function onMouseOut(event:Object):void
		{
			if (!$_objects) return;
			
			var i:*;
			for (i = $_objects.length; i--;) 
			{
				$_objects[i].removeEventListener('mouseout', onMouseOut, false);
				$_objects[i].removeEventListener('mouseup', onMouseOut, false);
			}
			for (i = $_objects.length; i--;) if ($_objects[i].parentNode) $_objects[i].parentNode.removeChild($_objects[i]);
			$_objects = null;
			
			var onMouseOut:Function = ($_displayObject as InteractiveObject).$__properties().InteractiveObjectScope.$_onMouseOut;
			if (onMouseOut != null) onMouseOut(event);
		}

		public function endFill(): void
		{
		}

		public function lineStyle(thickness:Number=NaN, color:uint=0, alpha:Number=1, pixelHinting:Boolean=false, scaleMode:String="normal", caps:String=null, joints:String=null, miterLimit:Number=3):void
		{
			$_strokeThickness = thickness;
			$_strokeColor = color;
			$_strokeAlpha = alpha;
			$_strokePixelHinting = pixelHinting;
			$_strokeScaleMode = scaleMode;
			$_strokeCaps = caps;
			$_strokeJoints = joints;
			$_strokeMiterLimit = miterLimit;
			
			$_domPathView = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			$_domGraphicsView.appendChild($_domPathView);
		}

		public function moveTo(x:Number, y:Number):void
		{
			if (!$_domPathView) lineStyle(0);
			
			var d:String = ($_domPathView.getAttribute('d')) ? $_domPathView.getAttribute('d') : '';
			$_domPathView.setAttribute('d', d + ' M ' + x + ',' + y);
			
			$_doFillAndLine($_domPathView);
		}

		public function lineTo(x:Number, y:Number):void
		{
			var d:String = ($_domPathView.getAttribute('d')) ? $_domPathView.getAttribute('d') : '';
			$_domPathView.setAttribute('d', d + ' L ' + x + ',' + y);
			
			$_doFillAndLine($_domPathView);
			
			var xTransform:Number;
			var yTransform:Number;
			if (x < $_maxNegX) $_maxNegX = xTransform = x;
			if (y < $_maxNegY) $_maxNegY = yTransform = y;
			
			if (!isNaN(xTransform) || !isNaN(yTransform)) 
			{
				$_domPathView.style[Browser.getTransformString()] = 'translate3d(' + -($_maxNegX) + 'px, ' + -($_maxNegY) + 'px, 0px)';
				$_domGraphicsView.style[Browser.getTransformString()] = 'translate3d(' + $_maxNegX + 'px, ' + $_maxNegY + 'px, 0px)';
			}
			
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			
			if (x + ($_strokeThickness / 2) > $_maxWidth) $_maxWidth = x + ($_strokeThickness / 2);
			if (y + ($_strokeThickness / 2) > $_maxHeight) $_maxHeight = y + ($_strokeThickness / 2);
			$_domGraphicsView.style.width = ($_maxWidth + -($_maxNegX)) + 'px';
			$_domGraphicsView.style.height = ($_maxHeight + -($_maxNegY)) + 'px';

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void
		{
			var d:String = ($_domPathView.getAttribute('d')) ? $_domPathView.getAttribute('d') : '';
			$_domPathView.setAttribute('d', d + ' Q ' + controlX + ',' + controlY + ', ' + anchorX + ',' + anchorY);
			
			$_doFillAndLine($_domPathView);
		}

		public function beginBitmapFill (bitmapData:BitmapData, matrix:Matrix=null, repeat:Boolean=true, smooth:Boolean=false) : void
		{
			$_fillType = 'beginBitmapFill';
			$_fillBitmapData = '__' + ($_uniqueIDCounter++) + '_GraphicsID__';
			
			var defs:Object = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			var pattern:Object = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
			var image:Object = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			
			pattern.setAttribute('id', $_fillBitmapData);
			pattern.setAttribute('patternUnits', 'userSpaceOnUse');
			pattern.setAttribute('width', bitmapData.width);
			pattern.setAttribute('height', bitmapData.height);
			
			var canvas:Object = bitmapData.$__properties().BitmapDataScope.$_createOrGetCanvas(bitmapData);
			var dataURL:String = canvas.toDataURL();
			image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataURL);
			image.setAttribute('x', 0);
			image.setAttribute('y', 0);
			image.setAttribute('width', bitmapData.width);
			image.setAttribute('height', bitmapData.height);
			
			pattern.appendChild(image);
			defs.appendChild(pattern);
			$_domGraphicsView.appendChild(defs);

			var scope:* = $_displayObject.$__properties().DisplayObjectScope;
			scope.$_onChildBoundsChange('graphics_' + scope.$_id, ($_maxWidth !== 0 || $_maxHeight !== 0) ? [$_maxNegX, $_maxNegY, $_maxWidth, $_maxHeight] : null);
		}

		public UNIMPLEMENTED function beginGradientFill (type:String, colors:Array, alphas:Array, ratios:Array, matrix:Matrix=null, spreadMethod:String="pad", interpolationMethod:String="rgb", focalPointRatio:Number=0) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "beginGradientFill"');
		}

		public UNIMPLEMENTED function beginShaderFill (shader:Shader, matrix:Matrix=null) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "beginShaderFill"');
		}

		public UNIMPLEMENTED function copyFrom (sourceGraphics:Graphics) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "copyFrom"');
		}

		public UNIMPLEMENTED function drawGraphicsData (graphicsData:Vector.<flash.display.IGraphicsData>) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "drawGraphicsData"');
		}

		public UNIMPLEMENTED function drawPath (commands:Vector.<int>, data:Vector.<Number>, winding:String="evenOdd") : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "drawPath"');
		}

		public UNIMPLEMENTED function drawTriangles (vertices:Vector.<Number>, indices:Vector.<int>=null, uvtData:Vector.<Number>=null, culling:String="none") : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "drawTriangles"');
		}

		public UNIMPLEMENTED function lineBitmapStyle (bitmap:BitmapData, matrix:Matrix=null, repeat:Boolean=true, smooth:Boolean=false) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "lineBitmapStyle"');
		}

		public UNIMPLEMENTED function lineGradientStyle (type:String, colors:Array, alphas:Array, ratios:Array, matrix:Matrix=null, spreadMethod:String="pad", interpolationMethod:String="rgb", focalPointRatio:Number=0) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "lineGradientStyle"');
		}

		public UNIMPLEMENTED function lineShaderStyle (shader:Shader, matrix:Matrix=null) : void
		{
			throw new Error('Graphics: attempted call to an unimplemented function "lineShaderStyle"');
		}
	}
}
