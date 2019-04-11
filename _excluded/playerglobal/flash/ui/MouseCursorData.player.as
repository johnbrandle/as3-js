/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.ui
{
	import flash.display.BitmapData;
	import flash.geom.Point;

	public final UNIMPLEMENTED class MouseCursorData 
	{

		public function get data () : Vector.<flash.display.BitmapData>
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "data"');
		}

		public function set data (data:Vector.<BitmapData>) : void
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "data"');
		}


		public function get frameRate () : Number
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "frameRate"');
		}

		public function set frameRate (data:Number) : void
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "frameRate"');
		}


		public function get hotSpot () : flash.geom.Point
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "hotSpot"');
		}

		public function set hotSpot (data:Point) : void
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented function "hotSpot"');
		}


		public function MouseCursorData ()
		{
			throw new Error('MouseCursorData: attempted call to an unimplemented constructor');
		}

	}
}
