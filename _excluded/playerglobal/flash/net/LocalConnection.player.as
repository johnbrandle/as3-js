/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;

	public UNIMPLEMENTED class LocalConnection extends EventDispatcher
	{

		public function get client () : Object
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "client"');
		}

		public function set client (client:Object) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "client"');
		}

		public function get domain () : String
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "domain"');
		}


		public function get isPerUser () : Boolean
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "isPerUser"');
		}

		public function set isPerUser (newValue:Boolean) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "isPerUser"');
		}


		public static function get isSupported () : Boolean
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "isSupported"');
		}


		public function allowDomain (...rest) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "allowDomain"');
		}

		public function allowInsecureDomain (...rest) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "allowInsecureDomain"');
		}


		public function close () : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "close"');
		}

		public function connect (connectionName:String) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "connect"');
		}

		public function LocalConnection ()
		{
			throw new Error('LocalConnection: attempted call to an unimplemented constructor');
		}


		public function send (connectionName:String, methodName:String, ...rest) : void
		{
			throw new Error('LocalConnection: attempted call to an unimplemented function "send"');
		}

	}
}
