/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;
	import flash.net.NetConnection;
	import flash.net.NetGroupInfo;

	public UNIMPLEMENTED class NetGroup extends EventDispatcher
	{
		public function get estimatedMemberCount () : Number
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "estimatedMemberCount"');
		}


		public function get info () : flash.net.NetGroupInfo
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "info"');
		}


		public function get localCoverageFrom () : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "localCoverageFrom"');
		}


		public function get localCoverageTo () : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "localCoverageTo"');
		}


		public function get neighborCount () : Number
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "neighborCount"');
		}


		public function get receiveMode () : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "receiveMode"');
		}

		public function set receiveMode (mode:String) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "receiveMode"');
		}


		public function get replicationStrategy () : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "replicationStrategy"');
		}

		public function set replicationStrategy (s:String) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "replicationStrategy"');
		}


		public function addHaveObjects (startIndex:Number, endIndex:Number) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "addHaveObjects"');
		}


		public function addMemberHint (peerID:String) : Boolean
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "addMemberHint"');
		}


		public function addNeighbor (peerID:String) : Boolean
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "addNeighbor"');
		}


		public function addWantObjects (startIndex:Number, endIndex:Number) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "addWantObjects"');
		}


		public function close () : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "close"');
		}


		public function convertPeerIDToGroupAddress (peerID:String) : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "convertPeerIDToGroupAddress"');
		}


		public function denyRequestedObject (requestID:int) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "denyRequestedObject"');
		}

		public function NetGroup (connection:NetConnection, groupspec:String)
		{
			throw new Error('NetGroup: attempted call to an unimplemented constructor');
		}


		public function post (message:Object) : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "post"');
		}


		public function removeHaveObjects (startIndex:Number, endIndex:Number) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "removeHaveObjects"');
		}


		public function removeWantObjects (startIndex:Number, endIndex:Number) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "removeWantObjects"');
		}


		public function sendToAllNeighbors (message:Object) : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "sendToAllNeighbors"');
		}


		public function sendToNearest (message:Object, groupAddress:String) : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "sendToNearest"');
		}


		public function sendToNeighbor (message:Object, sendMode:String) : String
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "sendToNeighbor"');
		}


		public function writeRequestedObject (requestID:int, object:Object) : void
		{
			throw new Error('NetGroup: attempted call to an unimplemented function "writeRequestedObject"');
		}

	}
}
