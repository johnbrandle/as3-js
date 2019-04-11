/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;
	import flash.utils.IDataInput;

	public UNIMPLEMENTED class URLStream extends EventDispatcher implements IDataInput
	{

		public function get bytesAvailable () : uint
		{
			throw new Error('URLStream: attempted call to an unimplemented function "bytesAvailable"');
		}


		public function get connected () : Boolean
		{
			throw new Error('URLStream: attempted call to an unimplemented function "connected"');
		}


		public function get endian () : String
		{
			throw new Error('URLStream: attempted call to an unimplemented function "endian"');
		}

		public function set endian (type:String) : void
		{
			throw new Error('URLStream: attempted call to an unimplemented function "endian"');
		}


		public function get objectEncoding () : uint
		{
			throw new Error('URLStream: attempted call to an unimplemented function "objectEncoding"');
		}

		public function set objectEncoding (version:uint) : void
		{
			throw new Error('URLStream: attempted call to an unimplemented function "objectEncoding"');
		}


		public function close () : void
		{
			throw new Error('URLStream: attempted call to an unimplemented function "close"');
		}

		public function load (request:URLRequest) : void
		{
			throw new Error('URLStream: attempted call to an unimplemented function "load"');
		}

		public function readBoolean () : Boolean
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readBoolean"');
		}

		public function readByte () : int
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readByte"');
		}

		public function readBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readBytes"');
		}

		public function readDouble () : Number
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readDouble"');
		}

		public function readFloat () : Number
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readFloat"');
		}

		public function readInt () : int
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readInt"');
		}


		public function readMultiByte (length:uint, charSet:String) : String
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readMultiByte"');
		}

		public function readObject () : *
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readObject"');
		}

		public function readShort () : int
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readShort"');
		}

		public function readUnsignedByte () : uint
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readUnsignedByte"');
		}

		public function readUnsignedInt () : uint
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readUnsignedInt"');
		}

		public function readUnsignedShort () : uint
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readUnsignedShort"');
		}

		public function readUTF () : String
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readUTF"');
		}

		public function readUTFBytes (length:uint) : String
		{
			throw new Error('URLStream: attempted call to an unimplemented function "readUTFBytes"');
		}

		public function URLStream ()
		{
			throw new Error('URLStream: attempted call to an unimplemented constructor');
		}

	}
}
