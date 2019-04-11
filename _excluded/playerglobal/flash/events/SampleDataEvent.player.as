/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.utils.ByteArray;

	public class SampleDataEvent extends Event
	{
		public static const SAMPLE_DATA : String = "sampleData";

		private var _data:ByteArray;

		public function SampleDataEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, theposition:Number=0, thedata:ByteArray=null)
		{
			super(type, bubbles, cancelable);

			_data = thedata;
		}

		public function get data () : flash.utils.ByteArray
		{
			return _data;
		}

		public UNIMPLEMENTED function set data (thedata:ByteArray) : void
		{
			throw new Error('SampleDataEvent: attempted call to an unimplemented function "data"');
		}

		public UNIMPLEMENTED function get position () : Number
		{
			throw new Error('SampleDataEvent: attempted call to an unimplemented function "position"');
		}

		public UNIMPLEMENTED function set position (theposition:Number) : void
		{
			throw new Error('SampleDataEvent: attempted call to an unimplemented function "position"');
		}

		public UNIMPLEMENTED function clone () : flash.events.Event
		{
			throw new Error('SampleDataEvent: attempted call to an unimplemented function "clone"');
		}

		public UNIMPLEMENTED function toString () : String
		{
			throw new Error('SampleDataEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
