/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final dynamic UNIMPLEMENTED class ShaderParameter 
	{
		public function get index () : int
		{
			throw new Error('ShaderParameter: attempted call to an unimplemented function "index"');
		}

		public function get type () : String
		{
			throw new Error('ShaderParameter: attempted call to an unimplemented function "type"');
		}

		public function get value () : Array
		{
			throw new Error('ShaderParameter: attempted call to an unimplemented function "value"');
		}

		public function set value (v:Array) : void
		{
			throw new Error('ShaderParameter: attempted call to an unimplemented function "value"');
		}

		public function ShaderParameter ()
		{
			throw new Error('ShaderParameter: attempted call to an unimplemented constructor');
		}

	}
}
