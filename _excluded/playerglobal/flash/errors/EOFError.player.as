/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.errors
{
	public dynamic UNIMPLEMENTED class EOFError extends IOError
	{
		public function EOFError (message:String="", id:int=0)
		{
			throw new Error('EOFError: attempted call to an unimplemented constructor');
		}

	}
}
