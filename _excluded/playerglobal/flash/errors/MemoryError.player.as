/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class MemoryError extends Error
	{
		public function MemoryError (message:String="", id:int=0)
		{
			throw new Error('MemoryError: attempted call to an unimplemented constructor');
		}

	}
}
