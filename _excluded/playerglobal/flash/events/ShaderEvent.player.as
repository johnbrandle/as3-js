/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.display.BitmapData;
	import flash.utils.ByteArray;

	public UNIMPLEMENTED class ShaderEvent extends Event
	{
		public static const COMPLETE : String = "complete";

		public function get bitmapData () : flash.display.BitmapData
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "bitmapData"');
		}

		public function set bitmapData (bmpData:BitmapData) : void
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "bitmapData"');
		}

		public function get byteArray () : flash.utils.ByteArray
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "byteArray"');
		}

		public function set byteArray (bArray:ByteArray) : void
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "byteArray"');
		}

		public function get vector () : Vector.<Number>
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "vector"');
		}

		public function set vector (v:Vector.<Number>) : void
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "vector"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "clone"');
		}

		public function ShaderEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, bitmap:BitmapData=null, array:ByteArray=null, vector:Vector.<Number>=null)
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented constructor');
		}

		public function toString () : String
		{
			throw new Error('ShaderEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
