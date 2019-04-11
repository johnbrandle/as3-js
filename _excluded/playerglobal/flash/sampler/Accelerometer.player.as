/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.sampler
{
	import flash.events.EventDispatcher;

	public UNIMPLEMENTED class Accelerometer extends EventDispatcher
	{

		public static function get isSupported () : Boolean
		{
			throw new Error('Accelerometer: attempted call to an unimplemented function "isSupported"');
		}


		public function get muted () : Boolean
		{
			throw new Error('Accelerometer: attempted call to an unimplemented function "muted"');
		}


		public function Accelerometer ()
		{
			throw new Error('Accelerometer: attempted call to an unimplemented constructor');
		}


		public function setRequestedUpdateInterval (interval:Number) : void
		{
			throw new Error('Accelerometer: attempted call to an unimplemented function "setRequestedUpdateInterval"');
		}

	}
}
