/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class IllegalOperationError extends Error
	{
		public function IllegalOperationError (message:String="", id:int=0)
		{
			throw new Error('IllegalOperationError: attempted call to an unimplemented constructor');
		}

	}
}
