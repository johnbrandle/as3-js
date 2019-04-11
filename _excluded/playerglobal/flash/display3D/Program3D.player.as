/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display3D
{
	import flash.utils.ByteArray;

	public UNIMPLEMENTED class Program3D 
	{
		public function dispose () : void
		{
			throw new Error('Program3D: attempted call to an unimplemented function "dispose"');
		}

		public function Program3D ()
		{
			throw new Error('Program3D: attempted call to an unimplemented constructor');
		}

		public function upload (vertexProgram:ByteArray, fragmentProgram:ByteArray) : void
		{
			throw new Error('Program3D: attempted call to an unimplemented function "upload"');
		}

	}
}
