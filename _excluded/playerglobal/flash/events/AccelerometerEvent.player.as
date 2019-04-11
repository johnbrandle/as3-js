/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class AccelerometerEvent extends Event
	{
		private var _accelerationX:Number;
		private var _accelerationY:Number;
		private var _accelerationZ:Number;
		private var _timestamp:Number;

		public static const UPDATE:String = "update";

		public function get accelerationX():Number
		{
			return _accelerationX;
		}

		public function set accelerationX(value:Number):void
		{
			_accelerationX = value;
		}

		public function get accelerationY():Number
		{
			return _accelerationY;
		}

		public function set accelerationY(value:Number):void
		{
			_accelerationY = value;
		}

		public function get accelerationZ():Number
		{
			return _accelerationZ;
		}

		public function set accelerationZ(value:Number):void
		{
			_accelerationZ = value;
		}

		public function get timestamp():Number
		{
			return _timestamp;
		}

		public function set timestamp(value:Number):void
		{
			_timestamp = value;
		}

		public function AccelerometerEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, timestamp:Number = 0, accelerationX:Number = 0, accelerationY:Number = 0, accelerationZ:Number = 0)
		{
			super(type, bubbles, cancelable);
			_timestamp = timestamp;
			_accelerationX = accelerationX;
			_accelerationY = accelerationY;
			_accelerationZ = accelerationZ;
		}

		override public function clone():Event
		{
			return new AccelerometerEvent(type, bubbles, cancelable, timestamp, accelerationX, accelerationY, accelerationZ);
		}

		override public function toString():String
		{
			return formatToString('AccelerometerEvent', 'bubbles', 'cancelable', 'timestamp', 'accelerationX', 'accelerationY', 'accelerationZ');
		}

	}
}
