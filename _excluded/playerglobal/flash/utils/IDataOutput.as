/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	import flash.utils.ByteArray;

	public interface IDataOutput
	{
		function get endian () : String;
		function set endian (type:String) : void;

		function get objectEncoding () : uint;
		function set objectEncoding (version:uint) : void;

		function writeBoolean (value:Boolean) : void;

		function writeByte (value:int) : void;

		function writeBytes (bytes:ByteArray, offset:uint=0, length:uint=0) : void;

		function writeDouble (value:Number) : void;

		function writeFloat (value:Number) : void;

		function writeInt (value:int) : void;

		function writeMultiByte (value:String, charSet:String) : void;

		function writeObject (object:*) : void;

		function writeShort (value:int) : void;

		function writeUnsignedInt (value:uint) : void;

		function writeUTF (value:String) : void;

		function writeUTFBytes (value:String) : void;
	}
}
