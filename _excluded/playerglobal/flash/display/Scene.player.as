/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final UNIMPLEMENTED class Scene 
	{
		public function get labels () : Array
		{
			throw new Error('Scene: attempted call to an unimplemented function "labels"');
		}

		public function get name () : String
		{
			throw new Error('Scene: attempted call to an unimplemented function "name"');
		}

		public function get numFrames () : int
		{
			throw new Error('Scene: attempted call to an unimplemented function "numFrames"');
		}

		public function Scene (name:String, labels:Array, numFrames:int)
		{
			throw new Error('Scene: attempted call to an unimplemented constructor');
		}

	}
}
