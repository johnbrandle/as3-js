/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.errors.IOError;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	import flash.utils.IDataInput;
	import flash.utils.IDataOutput;
	import flash.utils.clearInterval;
	import flash.utils.getTimer;
	import flash.utils.setInterval;
	
	

	public class Socket extends EventDispatcher implements IDataInput, IDataOutput
	{
		private var _socket:Object;
		private var _writeByteArray:ByteArray;
		private var _readByteArray:ByteArray;
		private var _endian:String = Endian.BIG_ENDIAN;
		private var _connected:Boolean = false;
		
		private var _connectStartTime:int;
		private var _timeout:Number = 20000;
		
		private var _intervalID:uint;
		

		public function Socket (host:String=null, port:int=0)
		{
			if (host !== null) connect(host, port);
		}


		public function connect (host:String, port:int):void
		{
			if (_socket) throw new Error('socket connect already called');
			if (_intervalID) throw new Error('failed to close interval');
			
			_writeByteArray = new ByteArray();
			_writeByteArray.endian = _endian;
			
			_readByteArray = new ByteArray();
			_readByteArray.endian = _endian;
			
			_connectStartTime = getTimer();
			_intervalID = setInterval(updateProgress, 50);
			
			var uri:* = window.URI(host);
			uri.port(port);
			
			if (!uri.protocol() || uri.protocol() === 'http') uri.protocol('ws');
			if (uri.protocol() === 'https') uri.protocol('wss');
			
			_socket = new window.WebSocket(uri.toString());
			_socket.binaryType = 'arraybuffer';
			
			_socket.onopen = function(event:Object):void
			{
				_socket.onopen = null;
				
				clearInterval(_intervalID);
				_intervalID = 0;
				
				_connected = true;
				dispatchEvent(new Event(Event.CONNECT));
			}
			
			_socket.onerror = function(event:Object):void
			{
				if (_connected) dispatchEvent(new SecurityErrorEvent(SecurityErrorEvent.SECURITY_ERROR, false, false, "SOCKET could not connect to server."));
				else dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "SOCKET trouble sending and or receiving data."));
			}
			
			_socket.onmessage = function(event:Object):void
			{
				var byteArray:ByteArray = new ByteArray();
				byteArray.$__setArrayBuffer(event.data);
				
				var readByteArray:ByteArray = new ByteArray(); //we want to purge older data from _readByteArray
				readByteArray.writeBytes(_readByteArray, _readByteArray.position); //position should be at the end
				
				readByteArray.writeBytes(byteArray); //write additional bytes
				readByteArray.position = 0; //set position to 0
				
				_readByteArray = readByteArray;
				
				dispatchEvent(new ProgressEvent(ProgressEvent.SOCKET_DATA, false, false, byteArray.bytesAvailable));
			}
			
			_socket.onclose = function(event:Object):void
			{
				close();
				dispatchEvent(new Event(Event.CLOSE));
			}
		}

		public function flush () : void
		{
			if (!_connected) throw new IOError('Socket not open'); 
			
			var arrayBuffer:Object = _writeByteArray.$__getArrayBuffer();
			
			_writeByteArray = new ByteArray();
			_writeByteArray.endian = _endian;
			_socket.send(arrayBuffer);
		}
		
		private function updateProgress():void
		{
			if (!_socket) throw new Error('no socket');
			if (_connected) throw new Error('connected');
			
			var diff:int = getTimer() - _connectStartTime;
			if (_timeout > diff) return;
			
			close();
			throw new IOError('SOCKET connect timeout');
		}
		

		public function get bytesAvailable () : uint
		{
			return _readByteArray.bytesAvailable;
		}

		public function get bytesPending () : uint
		{
			return _writeByteArray.bytesAvailable;
		}


		public function get connected () : Boolean
		{
			return _connected;
		}


		public function get endian () : String
		{
			return _endian;
		}

		public function set endian (type:String) : void
		{
			if (_socket)
			{
				_writeByteArray.endian = type;
				_readByteArray.endian = type;
			}
			
			_endian = type;
		}


		public function get objectEncoding ():uint
		{
			return ObjectEncoding.AMF3;
		}

		public function set objectEncoding (version:uint):void
		{
			if (version != ObjectEncoding.AMF3) throw new Error('desired object encoding not supported at this time');
		}


		public function get timeout () : uint
		{
			return _timeout;
		}


		public function set timeout (value:uint) : void
		{
			_timeout = value;
		}


		public function close () : void
		{
			if (!_socket) throw new IOError('socket was not open');
			
			_connected = false;
			
			_writeByteArray = null;
			_readByteArray = null;
			
			_connectStartTime = 0;
			if (_intervalID) 
			{
				clearInterval(_intervalID);
				_intervalID = 0;
			}
			
			_socket.onopen = null;
			_socket.onerror = null;
			_socket.onmessage = null;
			_socket.onclose = null;
			_socket.close();
			_socket = null;
		}

		public function readBoolean () : Boolean
		{
			return _readByteArray.readBoolean();
		}

		public function readByte () : int
		{
			return _readByteArray.readByte();
		}

		public function readBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void
		{
			return _readByteArray.readBytes(bytes, offset, length);
		}

		public function readDouble () : Number
		{
			return _readByteArray.readDouble();
		}

		public function readFloat () : Number
		{
			return _readByteArray.readFloat();
		}

		public function readInt () : int
		{
			return _readByteArray.readInt();
		}


		public function readMultiByte (length:uint, charSet:String) : String
		{
			return _readByteArray.readMultiByte(length, charSet);
		}

		public function readObject () : *
		{
			return _readByteArray.readObject();
		}

		public function readShort () : int
		{
			return _readByteArray.readShort();
		}

		public function readUnsignedByte () : uint
		{
			return _readByteArray.readUnsignedByte();
		}

		public function readUnsignedInt () : uint
		{
			return _readByteArray.readUnsignedInt();
		}

		public function readUnsignedShort () : uint
		{
			return _readByteArray.readUnsignedShort();
		}

		public function readUTF () : String
		{
			return _readByteArray.readUTF();
		}

		public function readUTFBytes (length:uint) : String
		{
			return _readByteArray.readUTFBytes(length);
		}

		public function writeBoolean (value:Boolean) : void
		{
			_writeByteArray.writeBoolean(value);
		}

		public function writeByte (value:int) : void
		{
			_writeByteArray.writeByte(value);
		}

		public function writeBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void
		{
			_writeByteArray.writeBytes(bytes, offset, length);
		}

		public function writeDouble (value:Number) : void
		{
			_writeByteArray.writeDouble(value);
		}

		public function writeFloat (value:Number) : void
		{
			_writeByteArray.writeFloat(value);
		}

		public function writeInt (value:int) : void
		{
			_writeByteArray.writeInt(value);
		}


		public function writeMultiByte (value:String, charSet:String) : void
		{
			_writeByteArray.writeMultiByte(value, charSet);
		}

		public function writeObject (object:*) : void
		{
			_writeByteArray.writeObject(object);
		}

		public function writeShort (value:int) : void
		{
			_writeByteArray.writeShort(value);
		}

		public function writeUnsignedInt (value:uint) : void
		{
			_writeByteArray.writeUnsignedInt(value);
		}

		public function writeUTF (value:String) : void
		{
			_writeByteArray.writeUTF(value);
		}

		public function writeUTFBytes (value:String) : void
		{
			_writeByteArray.writeUTFBytes(value);
		}

	}
}
