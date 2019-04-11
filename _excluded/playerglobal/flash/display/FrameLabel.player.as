/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final UNIMPLEMENTED class FrameLabel 
	{
		public function get frame () : int
		{
			throw new Error('FrameLabel: attempted call to an unimplemented function "frame"');
		}

		public function get name () : String
		{
			throw new Error('FrameLabel: attempted call to an unimplemented function "name"');
		}

		public function FrameLabel (name:String, frame:int)
		{
			throw new Error('FrameLabel: attempted call to an unimplemented constructor');
		}

	}
}
