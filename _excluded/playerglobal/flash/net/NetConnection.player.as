/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;
	import flash.net.Responder;

	public class NetConnection extends EventDispatcher
	{
		public function NetConnection()
		{
			super();
		}
		

		public function connect(command:String, ...rest):void
		{
		}
	

		public UNIMPLEMENTED function get client () : Object
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "client"');
		}

		public UNIMPLEMENTED function set client (object:Object) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "client"');
		}


		public UNIMPLEMENTED function get connected () : Boolean
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "connected"');
		}


		public UNIMPLEMENTED function get connectedProxyType () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "connectedProxyType"');
		}


		public UNIMPLEMENTED static function get defaultObjectEncoding () : uint
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "defaultObjectEncoding"');
		}

		public UNIMPLEMENTED static function set defaultObjectEncoding (version:uint) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "defaultObjectEncoding"');
		}


		public UNIMPLEMENTED function get farID () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "farID"');
		}


		public UNIMPLEMENTED function get farNonce () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "farNonce"');
		}


		public UNIMPLEMENTED function get maxPeerConnections () : uint
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "maxPeerConnections"');
		}

		public UNIMPLEMENTED function set maxPeerConnections (maxPeers:uint) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "maxPeerConnections"');
		}


		public UNIMPLEMENTED function get nearID () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "nearID"');
		}


		public UNIMPLEMENTED function get nearNonce () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "nearNonce"');
		}


		public UNIMPLEMENTED function get objectEncoding () : uint
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "objectEncoding"');
		}

		public UNIMPLEMENTED function set objectEncoding (version:uint) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "objectEncoding"');
		}


		public UNIMPLEMENTED function get protocol () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "protocol"');
		}

		public UNIMPLEMENTED function get proxyType () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "proxyType"');
		}

		public UNIMPLEMENTED function set proxyType (ptype:String) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "proxyType"');
		}


		public UNIMPLEMENTED function get unconnectedPeerStreams () : Array
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "unconnectedPeerStreams"');
		}


		public UNIMPLEMENTED function get uri () : String
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "uri"');
		}


		public UNIMPLEMENTED function get usingTLS () : Boolean
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "usingTLS"');
		}


		public UNIMPLEMENTED function addHeader (operation:String, mustUnderstand:Boolean=false, param:Object=null) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "addHeader"');
		}

		public UNIMPLEMENTED function call (command:String, responder:Responder, ...rest) : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "call"');
		}


		public UNIMPLEMENTED function close () : void
		{
			throw new Error('NetConnection: attempted call to an unimplemented function "close"');
		}
	}
}
