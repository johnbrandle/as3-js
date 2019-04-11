/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.utils.ByteArray;
	import flash.display.ShaderData;

	public UNIMPLEMENTED class Shader 
	{
		public function set byteCode (code:ByteArray) : void
		{
			throw new Error('Shader: attempted call to an unimplemented function "byteCode"');
		}

		public function get data () : flash.display.ShaderData
		{
			throw new Error('Shader: attempted call to an unimplemented function "data"');
		}

		public function set data (p:ShaderData) : void
		{
			throw new Error('Shader: attempted call to an unimplemented function "data"');
		}

		public function get precisionHint () : String
		{
			throw new Error('Shader: attempted call to an unimplemented function "precisionHint"');
		}

		public function set precisionHint (p:String) : void
		{
			throw new Error('Shader: attempted call to an unimplemented function "precisionHint"');
		}

		public function Shader (code:ByteArray=null)
		{
			throw new Error('Shader: attempted call to an unimplemented constructor');
		}

	}
}
