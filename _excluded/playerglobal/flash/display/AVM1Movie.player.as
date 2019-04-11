/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public UNIMPLEMENTED class AVM1Movie extends DisplayObject
	{
		public function addCallback (functionName:String, closure:Function) : void
		{
			throw new Error('AVM1Movie: attempted call to an unimplemented function "addCallback"');
		}

		public function AVM1Movie ()
		{
			throw new Error('AVM1Movie: attempted call to an unimplemented constructor');
		}

		public function call (functionName:String, ...rest) : *
		{
			throw new Error('AVM1Movie: attempted call to an unimplemented function "call"');
		}

	}
}
