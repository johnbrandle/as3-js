/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public class Bitmap extends DisplayObject
	{	
		private var $_properties:*;
	
		public function Bitmap(bitmapData:BitmapData=null, pixelSnapping:String='auto', smoothing:Boolean=false)
		{
			var properties:* = $_properties || $__properties({});
		
			super();
			
			properties.BitmapScope.$_pixelSnapping = pixelSnapping;
			properties.BitmapScope.$_smoothing = smoothing;
			
			$_properties.DisplayObjectScope.$_domView.style.pointerEvents = 'inherit';
			
			if (bitmapData !== null) setBitmapData(bitmapData);
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				var pscope:* = $es4.$$getOwnScope(this, Bitmap);
				object.BitmapScope = {pscope:pscope};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		protected override function $__createDomView():*
		{
			var canvas:* = document.createElement('canvas');
			canvas.setAttribute('tabindex', -1);
			
			return canvas;
		}

		/*
		public override function set width(value:Number):void
		{
			var properties:* = $_properties;
			
			properties.BitmapScope.$_width = value;
			
			var canvas:* = properties.DisplayObjectScope.$_domView;
			if (!properties.BitmapScope.$_bitmapData) 
			{
				canvas.width = value;
				return;
			}
			
			var tempCanvas:* = document.createElement('canvas');
			tempCanvas.width = canvas.width;
			tempCanvas.height = canvas.height;
			
			tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
			
			canvas.width = value;
			
			canvas.getContext('2d').drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
			//canvas.setAttribute('rawData', canvas.toDataURL());
		}

		public override function set height(value:Number):void
		{
			var properties:* = $_properties;
		
			properties.BitmapScope.$_height = value;
			
			var canvas:* = properties.DisplayObjectScope.$_domView;
			if (!properties.BitmapScope.$_bitmapData) 
			{
				canvas.height = value;
				return;
			}
			
			var tempCanvas:* = document.createElement('canvas');
			tempCanvas.width = canvas.width;
			tempCanvas.height = canvas.height;
			
			tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
			
			canvas.height = value;
			
			canvas.getContext('2d').drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
			//canvas.setAttribute('rawData', canvas.toDataURL());
		}
		*/
		
		/**
		 * The BitmapData object being referenced.
		 */
		public function get bitmapData():BitmapData
		{
			return $_properties.BitmapScope.$_bitmapData;
		}

		private function setBitmapData(value:BitmapData):void
		{
			var properties:* = $_properties;
			var canvas:* = properties.DisplayObjectScope.$_domView;
			var bitmapDataProperties:*;
			if (value === null)
			{
				var bitmapData:BitmapData = properties.BitmapScope.$_bitmapData;
				if (bitmapData)
				{
					bitmapDataProperties = bitmapData.$__properties();
					bitmapDataProperties.BitmapDataScope.$_canvas = null;
					bitmapDataProperties.BitmapDataScope.$_createOrGetCanvas(bitmapData);
				}
				
				properties.BitmapScope.$_bitmapData = null;
				canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
				canvas.width = 0;
				canvas.height = 0;

				properties.DisplayObjectScope.$_setExplicitBounds(0, 0);
				return;
			}
			
			bitmapDataProperties = value.$__properties();
			canvas.width = bitmapDataProperties.BitmapDataScope.$_width;
			canvas.height = bitmapDataProperties.BitmapDataScope.$_height;
			canvas.getContext('2d').drawImage(bitmapDataProperties.BitmapDataScope.$_createOrGetCanvas(value), 0, 0);
			bitmapDataProperties.BitmapDataScope.$_canvas = canvas;
			properties.BitmapScope.$_bitmapData = value;

			properties.DisplayObjectScope.$_setExplicitBounds(canvas.width, canvas.height);
			//canvas.setAttribute('rawData', canvas.toDataURL());
		}
		
		public function set bitmapData(value:BitmapData):void
		{
			setBitmapData(value);
		}

		public function get pixelSnapping () : String
		{
			return $_properties.BitmapScope.$_pixelSnapping;
		}

		public function set pixelSnapping (value:String) : void
		{
			$_properties.BitmapScope.$_pixelSnapping = value;
		}

		public function get smoothing () : Boolean
		{
			return $_properties.BitmapScope.$_smoothing;
		}

		public function set smoothing (value:Boolean) : void
		{
			$_properties.BitmapScope.$_smoothing = value;
		}
	}
}
