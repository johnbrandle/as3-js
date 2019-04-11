/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.filters.BitmapFilter;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.ByteArray;

	public class BitmapData implements IBitmapDrawable
	{
		private var $_properties:*;

		public function BitmapData (width:int, height:int, transparent:Boolean=true, fillColor:uint=0xFFFFFFFF)
		{
			var properties:* = $_properties || $__properties({});
		
			properties.BitmapDataScope.$_width = width;
			properties.BitmapDataScope.$_height = height;
			properties.BitmapDataScope.$_transparent = transparent;
			properties.BitmapDataScope.$_fillColor = fillColor;
		}
		
		public function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object.BitmapDataScope = {$_createOrGetCanvas:$_createOrGetCanvas};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		private static function $_createOrGetCanvas(bitmapData:BitmapData):*
		{
			var properties:* = bitmapData.$__properties().BitmapDataScope;
			if (!properties.$_canvas)
			{
				var canvas:* = document.createElement('canvas');
				canvas.width = properties.$_width;
				canvas.height = properties.$_height;
				var context:* = canvas.getContext('2d');
				context.rect(0, 0, properties.$_width, properties.$_height);

				var argb:uint = properties.$_fillColor;
				var alpha:int = argb >> 24;
				var red:int = argb >> 16 & 0xff;
				var green:int = argb >> 8 & 0xff;
				var blue:int = argb & 0xff;
				
				context.fillStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
				context.fill();
				
				//canvas.setAttribute('rawData', canvas.toDataURL());
				properties.$_canvas = canvas;
			}
			
			return properties.$_canvas;
		}

		public function get height () : int
		{
			return $_properties.BitmapDataScope.$_height;
		}

		public UNIMPLEMENTED function get rect () : flash.geom.Rectangle
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "rect"');
		}

		public function get transparent () : Boolean
		{
			return $_properties.BitmapDataScope.$_transparent;
		}

		public function get width () : int
		{
			return $_properties.BitmapDataScope.$_width;
		}

		public UNIMPLEMENTED function applyFilter (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, filter:BitmapFilter) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "applyFilter"');
		}

		public function clone () : flash.display.BitmapData
		{
			var bitmapData:BitmapData = new BitmapData($_properties.BitmapDataScope.$_width, $_properties.BitmapDataScope.$_height, $_properties.BitmapDataScope.$_transparent, $_properties.BitmapDataScope.$_fillColor);
			
			if ($_properties.BitmapDataScope.$_canvas)
			{
				var canvas:* = document.createElement('canvas');
				canvas.width = $_properties.BitmapDataScope.$_width;
				canvas.height = $_properties.BitmapDataScope.$_height;
				canvas.getContext('2d').drawImage($_properties.BitmapDataScope.$_canvas, 0, 0);
				
				//canvas.setAttribute('rawData', canvas.toDataURL());
				bitmapData.$__properties().BitmapDataScope.$_canvas = canvas;
			}
			
			return bitmapData;
		}

		public UNIMPLEMENTED function colorTransform (rect:Rectangle, colorTransform:ColorTransform) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "colorTransform"');
		}

		public UNIMPLEMENTED function compare (otherBitmapData:BitmapData) : Object
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "compare"');
		}

		public UNIMPLEMENTED function copyChannel (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, sourceChannel:uint, destChannel:uint) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "copyChannel"');
		}

		public UNIMPLEMENTED function copyPixels (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, alphaBitmapData:BitmapData=null, alphaPoint:Point=null, mergeAlpha:Boolean=false) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "copyPixels"');
		}

		public function dispose () : void
		{
		}

		include "draw.player.as"

		public function fillRect (rect:Rectangle, argb:uint):void
		{
			var canvas:* = $_createOrGetCanvas(this);
			var context:* = canvas.getContext('2d');

			var alpha:int = argb >> 24;
			var red:int = argb >> 16 & 0xff;
			var green:int = argb >> 8 & 0xff;
			var blue:int = argb & 0xff;
			
			context.fillStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
			context.clearRect(rect.x, rect.y, rect.width, rect.height);
			context.fillRect(rect.x, rect.y, rect.width, rect.height);
		}

		public UNIMPLEMENTED function floodFill (x:int, y:int, color:uint) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "floodFill"');
		}

		public UNIMPLEMENTED function generateFilterRect (sourceRect:Rectangle, filter:BitmapFilter) : flash.geom.Rectangle
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "generateFilterRect"');
		}

		public UNIMPLEMENTED function getColorBoundsRect (mask:uint, color:uint, findColor:Boolean=true) : flash.geom.Rectangle
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "getColorBoundsRect"');
		}

		public UNIMPLEMENTED function getPixel (x:int, y:int) : uint
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "getPixel"');
		}

		public UNIMPLEMENTED function getPixel32 (x:int, y:int) : uint
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "getPixel32"');
		}

		public UNIMPLEMENTED function getPixels (rect:Rectangle) : flash.utils.ByteArray
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "getPixels"');
		}

		public UNIMPLEMENTED function getVector (rect:Rectangle) : Vector.<uint>
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "getVector"');
		}

		public UNIMPLEMENTED function histogram (hRect:Rectangle=null) : Vector.<Number>
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "histogram"');
		}

		public UNIMPLEMENTED function hitTest (firstPoint:Point, firstAlphaThreshold:uint, secondObject:Object, secondBitmapDataPoint:Point=null, secondAlphaThreshold:uint=1) : Boolean
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "hitTest"');
		}

		public UNIMPLEMENTED function lock () : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "lock"');
		}

		public UNIMPLEMENTED function merge (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, redMultiplier:uint, greenMultiplier:uint, blueMultiplier:uint, alphaMultiplier:uint) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "merge"');
		}

		public UNIMPLEMENTED function noise (randomSeed:int, low:uint=0, high:uint=255, channelOptions:uint=7, grayScale:Boolean=false) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "noise"');
		}

		public UNIMPLEMENTED function paletteMap (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, redArray:Array=null, greenArray:Array=null, blueArray:Array=null, alphaArray:Array=null) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "paletteMap"');
		}

		public UNIMPLEMENTED function perlinNoise (baseX:Number, baseY:Number, numOctaves:uint, randomSeed:int, stitch:Boolean, fractalNoise:Boolean, channelOptions:uint=7, grayScale:Boolean=false, offsets:Array=null) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "perlinNoise"');
		}

		public UNIMPLEMENTED function pixelDissolve (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, randomSeed:int=0, numPixels:int=0, fillColor:uint=0) : int
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "pixelDissolve"');
		}

		public UNIMPLEMENTED function scroll (x:int, y:int) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "scroll"');
		}

		public UNIMPLEMENTED function setPixel (x:int, y:int, color:uint) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "setPixel"');
		}

		public UNIMPLEMENTED function setPixel32 (x:int, y:int, color:uint) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "setPixel32"');
		}

		public UNIMPLEMENTED function setPixels (rect:Rectangle, inputByteArray:ByteArray) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "setPixels"');
		}

		public UNIMPLEMENTED function setVector (rect:Rectangle, inputVector:Vector.<uint>) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "setVector"');
		}

		public UNIMPLEMENTED function threshold (sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, operation:String, threshold:uint, color:uint=0, mask:uint=4294967295, copySource:Boolean=false) : uint
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "threshold"');
		}

		public UNIMPLEMENTED function unlock (changeRect:Rectangle=null) : void
		{
			throw new Error('BitmapData: attempted call to an unimplemented function "unlock"');
		}
	}
}
