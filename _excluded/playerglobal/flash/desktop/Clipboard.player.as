/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.desktop
{
	public UNIMPLEMENTED class Clipboard
	{
		public function get formats () : Array
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "formats"');
		}

		public static function get generalClipboard () : flash.desktop.Clipboard
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "generalClipboard"');
		}

		public function clear () : void
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "clear"');
		}

		public function clearData (format:String) : void
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "clearData"');
		}

		public function Clipboard ()
		{
			throw new Error('Clipboard: attempted call to an unimplemented constructor');
		}

		public function getData (format:String, transferMode:String="originalPreferred") : Object
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "getData"');
		}

		public function hasFormat (format:String) : Boolean
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "hasFormat"');
		}

		public function setData (format:String, data:Object, serializable:Boolean=true) : Boolean
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "setData"');
		}

		public function setDataHandler (format:String, handler:Function, serializable:Boolean=true) : Boolean
		{
			throw new Error('Clipboard: attempted call to an unimplemented function "setDataHandler"');
		}

	}
}
