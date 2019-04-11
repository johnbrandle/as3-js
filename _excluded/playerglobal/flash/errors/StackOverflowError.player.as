/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class StackOverflowError extends Error
	{
		public function StackOverflowError (message:String="", id:int=0)
		{
			throw new Error('StackOverflowError: attempted call to an unimplemented constructor');
		}

	}
}
