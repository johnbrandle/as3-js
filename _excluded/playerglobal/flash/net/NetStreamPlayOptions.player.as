/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;

	public dynamic UNIMPLEMENTED class NetStreamPlayOptions extends EventDispatcher
	{

		public var len : Number;


		public var offset : Number;


		public var oldStreamName : String;


		public var start : Number;


		public var streamName : String;


		public var transition : String;


		public function NetStreamPlayOptions ()
		{
			throw new Error('NetStreamPlayOptions: attempted call to an unimplemented constructor');
		}

	}
}
