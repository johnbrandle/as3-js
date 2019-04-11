/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.ui
{
	

	import flash.ui.MouseCursorData;

	public final class Mouse
	{
		private static var _cursor:String = MouseCursor.AUTO;


		public static function get cursor () : String
		{
			return _cursor;
		}

		public static function set cursor (value:String) : void
		{
			if (_cursor !== MouseCursor.AUTO) document.body.classList.remove(_cursor);
			
			_cursor = value;

			if (value === MouseCursor.AUTO) return;

			document.body.classList.add(value);
		}


		public UNIMPLEMENTED static function get supportsCursor () : Boolean
		{
			throw new Error('Mouse: attempted call to an unimplemented function "supportsCursor"');
		}


		public UNIMPLEMENTED  static function get supportsNativeCursor () : Boolean
		{
			throw new Error('Mouse: attempted call to an unimplemented function "supportsNativeCursor"');
		}


		public UNIMPLEMENTED  static function hide () : void
		{
			throw new Error('Mouse: attempted call to an unimplemented function "hide"');
		}

		public function Mouse ()
		{
			throw new Error('Mouse: attempted call to an unimplemented constructor');
		}


		public UNIMPLEMENTED  static function registerCursor (name:String, cursor:MouseCursorData) : void
		{
			throw new Error('Mouse: attempted call to an unimplemented function "registerCursor"');
		}


		public UNIMPLEMENTED  static function show () : void
		{
			throw new Error('Mouse: attempted call to an unimplemented function "show"');
		}


		public UNIMPLEMENTED  static function unregisterCursor (name:String) : void
		{
			throw new Error('Mouse: attempted call to an unimplemented function "unregisterCursor"');
		}

	}
}
