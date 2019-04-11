/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class InvalidSWFError extends Error
	{
		public function InvalidSWFError (message:String="", id:int=0)
		{
			throw new Error('InvalidSWFError: attempted call to an unimplemented constructor');
		}

	}
}
