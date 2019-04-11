/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class ScriptTimeoutError extends Error
	{
		public function ScriptTimeoutError (message:String="", id:int=0)
		{
			throw new Error('ScriptTimeoutError: attempted call to an unimplemented constructor');
		}

	}
}
