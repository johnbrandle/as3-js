/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	public dynamic class URLVariables 
	{
		public function URLVariables (source:String=null)
		{
		}
		
		public function decode (source:String) : void
		{
			throw new Error('URLVariables: attempted call to an unimplemented function "decode"');
		}

		public function toString () : String
		{
			throw new Error('URLVariables: attempted call to an unimplemented function "toString"');
		}
	}
}
