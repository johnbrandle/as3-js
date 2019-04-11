/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.net.IDynamicPropertyWriter;

	public final class ObjectEncoding 
	{

		public static const AMF0 : uint = 0;


		public static const AMF3 : uint = 3;


		public static const DEFAULT : uint = 3;


		public static function get dynamicPropertyWriter () : flash.net.IDynamicPropertyWriter
		{
			throw new Error('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"');
		}

		public static function set dynamicPropertyWriter (object:IDynamicPropertyWriter) : void
		{
			throw new Error('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"');
		}

		public function ObjectEncoding ()
		{
			throw new Error('ObjectEncoding: attempted call to an unimplemented constructor');
		}

	}
}
