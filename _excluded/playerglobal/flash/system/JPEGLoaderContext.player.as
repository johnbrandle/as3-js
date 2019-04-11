/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.system.ApplicationDomain;
	import flash.system.SecurityDomain;

	public UNIMPLEMENTED class JPEGLoaderContext extends LoaderContext
	{

		public var deblockingFilter : Number;


		public function JPEGLoaderContext (deblockingFilter:Number=0, checkPolicyFile:Boolean=false, applicationDomain:ApplicationDomain=null, securityDomain:SecurityDomain=null)
		{
			throw new Error('JPEGLoaderContext: attempted call to an unimplemented constructor');
		}

	}
}
