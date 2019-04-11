/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

 
package flash.utils
{
	import flash.net.ObjectEncoding;
	
	public class ByteArray implements IDataInput, IDataOutput
	{
		private var $_properties:*;
		
		private static const BYTES_GROW_SIZE:uint = 1024;
		

		public function ByteArray()
		{
			if ($_properties === undefined) $__properties({});	
		}
		
		public function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				var buffer:* = global.Buffer.alloc(BYTES_GROW_SIZE);
				object.ByteArrayScope = {$_buffer:buffer, $_bytePosition:0, $_byteLength:0, $_endian:Endian.BIG_ENDIAN, $_growSize:BYTES_GROW_SIZE};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public function $__getBuffer():Object
		{
			return $_properties.ByteArrayScope.$_buffer.slice(0, $_properties.ByteArrayScope.$_byteLength);
		}
		
		public function $__setBuffer(buffer:*):void
		{
			$_properties.ByteArrayScope.$_buffer = buffer;
			$_properties.ByteArrayScope.$_byteLength = buffer.length;
		}
		
		public function $__getArrayBuffer():Object
		{
			return $__getArrayBuffer();
		}
		
		public function $__setArrayBuffer(arrayBuffer:*):void
		{
			$__setBuffer(arrayBuffer);
		}
		

		public function get bytesAvailable () : uint
		{
			return $_properties.ByteArrayScope.$_byteLength - $_properties.ByteArrayScope.$_bytePosition;
		}
		

		public function get endian () : String
		{
			return $_properties.ByteArrayScope.$_endian;
		}
		
		public function set endian (type:String) : void
		{
			throw new Error('set endian not supported');
		}
		

		public function get length () : uint
		{
			return $_properties.ByteArrayScope.$_byteLength;
		}
		
		public function set length (value:uint) : void
		{
			if (value == $_properties.ByteArrayScope.$_byteLength) return;
			
			var buffer:*;
			if (value < $_properties.ByteArrayScope.$_byteLength)
			{
				$_properties.ByteArrayScope.$_growSize = BYTES_GROW_SIZE;
				$_properties.ByteArrayScope.$_byteLength = value;
				if ($_properties.ByteArrayScope.$_bytePosition > value) $_properties.ByteArrayScope.$_bytePosition = value;
				return;
			}
			
			if (value > $_properties.ByteArrayScope.$_buffer.length)
			{
				buffer = global.Buffer.concat([$_properties.ByteArrayScope.$_buffer, global.Buffer.alloc(value + ($_properties.ByteArrayScope.$_growSize = $_properties.ByteArrayScope.$_growSize * 2))]);
				$_properties.ByteArrayScope.$_buffer = buffer;
				$_properties.ByteArrayScope.$_byteLength = value;
			}
		}
		

		public function get position () : uint
		{
			return $_properties.ByteArrayScope.$_bytePosition;
		}
		
		public function set position (offset:uint) : void
		{
			$_properties.ByteArrayScope.$_bytePosition = offset;
		}
		

		public function clear () : void
		{
			$_properties.ByteArrayScope.$_buffer = null;
			$_properties.ByteArrayScope.$_bytePosition = 0;
			$_properties.ByteArrayScope.$_byteLength = 0;
		}
		

		public function readBoolean () : Boolean
		{
			return readByte() !== 0;
		}
		

		public function readByte () : int
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readInt8($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 1;
			
			return value;
		}
		

		public function readBytes(writeTo:ByteArray, offset:uint=0, length:uint=0):void
		{
			var position:uint = writeTo.position;
			var bytesAvailable:uint = this.bytesAvailable;
			
			writeTo.writeBytes(this, $_properties.ByteArrayScope.$_bytePosition, length);
			
			$_properties.ByteArrayScope.$_bytePosition += bytesAvailable;
			writeTo.position = position;
		}
		

		public function readDouble () : Number
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readDoubleBE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 8;
			
			return value;
		}
		

		public function readFloat () : Number
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readFloatBE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;
		}
		

		public function readInt () : int
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readInt32BE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;		
		}
		

		public function readMultiByte(length:uint, charSet:String):String
		{
			if (charSet === 'utf-8') return readUTFBytes(length);
				
			throw new Error('ByteArray: your selected charSet is not supported at this time, use: "utf-8"');
		}
		

		public function readShort () : int
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readInt16BE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 2;
			
			return value;
		}
		

		public function readUnsignedByte () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readUInt8($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 1;
			
			return value;
		}
		

		public function readUnsignedInt () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readUInt32BE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;
		}
		

		public function readUnsignedShort () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_buffer.readUInt16BE($_properties.ByteArrayScope.$_bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 2;
			
			return value;
		}
		

		public function readUTF():String
		{
			var length:uint = readUnsignedShort();
			return readUTFBytes(length);
		}
		

		public function readUTFBytes(length:uint):String //https://gist.github.com/boushley/5471599  //https://gist.github.com/joni/3760795
		{
			if (length == 0) return '';
			
			var string:String = '';
			
			var index:uint = 0;
			var bytes:* = $_properties.ByteArrayScope.$_buffer.slice($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_bytePosition + length);
			
			if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) index = 3; //skip BOM
			
			var byte1:int;
			var byte2:int;
			var byte3:int;
			var byte4:int;
			while (index < bytes.length) 
			{
				byte1 = bytes[index];
				
				if (byte1 < 0x80) 
				{
					string += String.fromCharCode(byte1);
					index++;
					continue;
				} 
				
				if (byte1 > 0xBF && byte1 < 0xE0) 
				{
					if (index + 1 >= bytes.length) throw "UTF-8 Decode failed. Two byte character was truncated.";
					
					byte2 = bytes[index + 1];
					string += String.fromCharCode(((byte1 & 31) << 6) | (byte2 & 63));
					index += 2;
					continue;
				}
				
				if (byte1 > 0xDF && byte1 < 0xF0)
				{
					if (index + 2 >= bytes.length) throw "UTF-8 Decode failed. Multi byte character was truncated.";
					byte2 = bytes[index + 1];
					byte3 = bytes[index + 2];
					string += String.fromCharCode(((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63));	
					index += 3;
					continue;
				}
				
				// surrogate pair
				var charCode:* = ((byte1 & 0x07) << 18 | (bytes[index + 1] & 0x3F) << 12 | (bytes[index + 2] & 0x3F) << 6 | bytes[index + 3] & 0x3F) - 0x010000;		
				string += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
				index += 4;
			}
			
			$_properties.ByteArrayScope.$_bytePosition += length;
			
			return string;
		}
		

		public function writeBoolean (value:Boolean) : void
		{
			writeByte(int(value));
		}
		

		public function writeByte (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 1;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeInt8(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 1;
		}
		
		private function writeUnsignedByte (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 1;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeUInt8(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 1;
		}
		

		public function writeBytes (readFrom:ByteArray, offset:uint=0, length:uint=0) : void
		{
			if (length == 0) length = readFrom.length - offset;
			
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + length;
			
			var buffer:* = $_properties.ByteArrayScope.$_buffer;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength) 
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) buffer = global.Buffer.concat([$_properties.ByteArrayScope.$_buffer, global.Buffer.alloc(newBytePosition + ($_properties.ByteArrayScope.$_growSize = $_properties.ByteArrayScope.$_growSize * 2))]);
				$_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			readFrom.$__properties().ByteArrayScope.$_buffer.copy(buffer, bytePosition, offset, offset + length);
			$_properties.ByteArrayScope.$_buffer = buffer;
			$_properties.ByteArrayScope.$_bytePosition = newBytePosition;
		}
		

		public function writeDouble (value:Number) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 8;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeDoubleBE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 8;
		}
		

		public function writeFloat (value:Number) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeFloatBE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}
		

		public function writeInt (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeInt32BE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}
		

		public function writeMultiByte (string:String, charSet:String) : void
		{
			if (charSet != 'utf-8') throw new Error('ByteArray: your selected charSet is not supported at this time, use: "utf-8"');	
			
			internalWriteUTFBytes(string);
		}
		

		public function writeShort (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeInt16BE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 2;
		}
		
		private function writeUnsignedShort (value:int, endian:String=null) : void
		{
			if (!endian) endian = $_properties.ByteArrayScope.$_endian; 
			
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeUInt16BE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 2;
		}
		

		public function writeUnsignedInt (value:uint) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_buffer.writeUInt32BE(value, bytePosition, true);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}
		

		public function writeUTF (value:String) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_bytePosition += 2;
			
			var length:uint = internalWriteUTFBytes(value);
			$_properties.ByteArrayScope.$_buffer.writeUInt16BE(length, bytePosition, true);
		}
		
		private function internalWriteUTFBytes(string:String):uint //https://gist.github.com/joni/3760795
		{	
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + (string.length * 4); //estimate 4 bytes per char
			
			var buffer:* = $_properties.ByteArrayScope.$_buffer;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_buffer.length) length = newBytePosition;
			}
			
			var length:Number = buffer.write(string, bytePosition);
			
			$_properties.ByteArrayScope.$_byteLength = $_properties.ByteArrayScope.$_bytePosition = bytePosition + length;
			
			return length;
		}
		

		public function writeUTFBytes (value:String) : void
		{
			internalWriteUTFBytes(value);
		}
		

		public function get objectEncoding () : uint
		{
			return ObjectEncoding.AMF3;
		}
		
		public function set objectEncoding (version:uint) : void
		{
			if (version != ObjectEncoding.AMF3) throw new Error('ByteArray: desired object encoding not supported at this time');
		}
		

		public function writeObject (object:*) : void
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "writeObject"');
		}
		

		public function readObject () : *
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "readObject"');
		}
		

		public static function get defaultObjectEncoding () : uint
		{
			return ObjectEncoding.AMF3;
		}
		
		public static function set defaultObjectEncoding (version:uint) : void
		{
			if (version != ObjectEncoding.AMF3) throw new Error('ByteArray: desired object encoding not supported at this time');
		}
		

		public function toString () : String
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "toString"');
		}
		
		public function compress (algorithm:String="zlib") : void
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "compress"');
		}
		
		public function deflate () : void
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "deflate"');
		}
		
		public function inflate () : void
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "inflate"');
		}

		public function uncompress (algorithm:String="zlib") : void
		{
			throw new Error('ByteArray: attempted call to an unimplemented function "uncompress"');
		}
	}
}