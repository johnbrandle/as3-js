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
				var arrayBuffer:* = new window.ArrayBuffer();
				var dataView:* = new window.DataView(arrayBuffer);
				object.ByteArrayScope = {$_arrayBuffer:arrayBuffer, $_dataView:dataView, $_bytePosition:0, $_byteLength:0, $_endian:Endian.BIG_ENDIAN, $_growSize:BYTES_GROW_SIZE};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public function $__getArrayBuffer():Object
		{
			return $_properties.ByteArrayScope.$_arrayBuffer.slice(0, $_properties.ByteArrayScope.$_byteLength);
		}
		
		public function $__setArrayBuffer(arrayBuffer:*):void
		{
			$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
			$_properties.ByteArrayScope.$_dataView = new window.DataView(arrayBuffer);
			$_properties.ByteArrayScope.$_byteLength = arrayBuffer.byteLength;
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
			$_properties.ByteArrayScope.$_endian = type;
		}


		public function get length () : uint
		{
			return $_properties.ByteArrayScope.$_byteLength;
		}

		public function set length (value:uint) : void
		{
			if (value == $_properties.ByteArrayScope.$_byteLength) return;
			
			var arrayBuffer:*;
			if (value < $_properties.ByteArrayScope.$_byteLength)
			{
				$_properties.ByteArrayScope.$_growSize = BYTES_GROW_SIZE;
				$_properties.ByteArrayScope.$_byteLength = value;
				if ($_properties.ByteArrayScope.$_bytePosition > value) $_properties.ByteArrayScope.$_bytePosition = value;
				return;
			}
		
			if (value > $_properties.ByteArrayScope.$_arrayBuffer.byteLength)
			{
				arrayBuffer = new window.ArrayBuffer(value + ($_properties.ByteArrayScope.$_growSize = ($_properties.ByteArrayScope.$_growSize * 2)));
				new window.Uint8Array(arrayBuffer).set(new window.Uint8Array($_properties.ByteArrayScope.$_arrayBuffer));
				$_properties.ByteArrayScope.$_dataView = new window.DataView(arrayBuffer);
				$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
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
			$_properties.ByteArrayScope.$_arrayBuffer = null;
			$_properties.ByteArrayScope.$_dataView = null;
			$_properties.ByteArrayScope.$_bytePosition = 0;
			$_properties.ByteArrayScope.$_byteLength = 0;
		}


		public function readBoolean () : Boolean
		{
			return readByte() !== 0;
		}


		public function readByte () : int
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getInt8($_properties.ByteArrayScope.$_bytePosition);
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
			var value:* = $_properties.ByteArrayScope.$_dataView.getFloat64($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 8;
			
			return value;
		}


		public function readFloat () : Number
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getFloat32($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;
		}


		public function readInt () : int
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getInt32($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;		
		}


		public function readMultiByte(length:uint, charSet:String):String
		{
			if (charSet !== 'iso-8859-1' && charSet != 'utf-8') throw new Error('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"');
			
			if (charSet === 'utf-8') return readUTFBytes(length);
			
			var value:* =  String.fromCharCode.apply(null, new window.Uint8Array($_properties.ByteArrayScope.$_arrayBuffer, $_properties.ByteArrayScope.$_bytePosition, length)); //FYI: iso-8859-1 is single byte only, so endianness does not apply here
			$_properties.ByteArrayScope.$_bytePosition += length;
			
			return value;
		}


		public function readShort () : int
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getInt16($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 2;
			
			return value;
		}


		public function readUnsignedByte () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getUint8($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 1;
			
			return value;
		}


		public function readUnsignedInt () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getUint32($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
			
			return value;
		}


		public function readUnsignedShort () : uint
		{
			var value:* = $_properties.ByteArrayScope.$_dataView.getUint16($_properties.ByteArrayScope.$_bytePosition, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
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
			var bytes:* = new window.Uint8Array($_properties.ByteArrayScope.$_arrayBuffer, $_properties.ByteArrayScope.$_bytePosition, length);
			
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
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setInt8(bytePosition, value);
			$_properties.ByteArrayScope.$_bytePosition += 1;
		}
		
		private function writeUnsignedByte (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 1;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setUint8(bytePosition, value);
			$_properties.ByteArrayScope.$_bytePosition += 1;
		}


		public function writeBytes (readFrom:ByteArray, offset:uint=0, length:uint=0) : void
		{
			if (length == 0) length = readFrom.length - offset;
			
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + length;
			
			var arrayBuffer:* = $_properties.ByteArrayScope.$_arrayBuffer;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength) 
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) 
				{
					var oldArrayBuffer:* = arrayBuffer;
					arrayBuffer = new window.ArrayBuffer(newBytePosition + ($_properties.ByteArrayScope.$_growSize = ($_properties.ByteArrayScope.$_growSize * 2)));
					new window.Uint8Array(arrayBuffer).set(new window.Uint8Array(oldArrayBuffer));
				}
				$_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			new window.Uint8Array(arrayBuffer).set(new window.Uint8Array(readFrom.$__properties().ByteArrayScope.$_arrayBuffer.slice(offset, offset + length)), bytePosition);
			$_properties.ByteArrayScope.$_dataView = new window.DataView(arrayBuffer);
			$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
			$_properties.ByteArrayScope.$_bytePosition = newBytePosition;
		}


		public function writeDouble (value:Number) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 8;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setFloat64(bytePosition, value, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 8;
		}


		public function writeFloat (value:Number) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setFloat32(bytePosition, value, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}


		public function writeInt (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setInt32(bytePosition, value, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}


		public function writeMultiByte (string:String, charSet:String) : void
		{
			if (charSet !== 'iso-8859-1' && charSet !== 'utf-8') throw new Error('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"');
			
			if (charSet == 'utf-8')
			{
				internalWriteUTFBytes(string);
				return;
			}
			
			var index:uint = 0;
			while (index < string.length)
			{
				var charCode:uint = string.charCodeAt(index++); //16 bit int
				
				writeUnsignedByte(charCode);
			}
		}


		public function writeShort (value:int) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setInt16(bytePosition, value, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 2;
		}
		
		private function writeUnsignedShort (value:int, endian:String=null) : void
		{
			if (!endian) endian = $_properties.ByteArrayScope.$_endian; 
			
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setUint16(bytePosition, value, endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 2;
		}


		public function writeUnsignedInt (value:uint) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 4;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_dataView.setUint32(bytePosition, value, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			$_properties.ByteArrayScope.$_bytePosition += 4;
		}


		public function writeUTF (value:String) : void
		{
			var bytePosition:uint = $_properties.ByteArrayScope.$_bytePosition;
			var newBytePosition:uint = bytePosition + 2;
			if (newBytePosition > $_properties.ByteArrayScope.$_byteLength)
			{
				if (newBytePosition > $_properties.ByteArrayScope.$_arrayBuffer.byteLength) length = newBytePosition;
				else $_properties.ByteArrayScope.$_byteLength = newBytePosition;
			}
			
			$_properties.ByteArrayScope.$_bytePosition += 2;
			
			var length:uint = internalWriteUTFBytes(value);
			$_properties.ByteArrayScope.$_dataView.setUint16(bytePosition, length, $_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
		}

		private function internalWriteUTFBytes(string:String):uint //https://gist.github.com/joni/3760795
		{	
			var utf8:Array = [];
			for (var i:* = 0; i < string.length; i++) 
			{
				var charcode:* = string.charCodeAt(i);
				if (charcode < 0x80) utf8.push(charcode);
				else if (charcode < 0x800) 
				{
					utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
				}
				else if (charcode < 0xd800 || charcode >= 0xe000) 
				{
					utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
				}	
				else // surrogate pair 
				{
					i++;
					
					// UTF-16 encodes 0x10000-0x10FFFF by
					// subtracting 0x10000 and splitting the
					// 20 bits of 0x0-0xFFFFF into two halves
					charcode = 0x10000 + (((charcode & 0x3ff)<<10) | (string.charCodeAt(i) & 0x3ff));
					utf8.push(0xf0 | (charcode >>18), 0x80 | ((charcode>>12) & 0x3f), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
				}
			}
			
			var index:uint = 0;
			var bytesLength:uint = utf8.length;
			
			while (index < bytesLength)
			{
				writeUnsignedByte(utf8[index]);
				index++;
			}
			
			return bytesLength;
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