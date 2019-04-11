/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.display.DisplayObjectContainer;
	import flash.system.ApplicationDomain;
	import flash.system.SecurityDomain;

	public class LoaderContext 
	{

		public var allowCodeImport : Boolean;


		public var applicationDomain : flash.system.ApplicationDomain;


		public var checkPolicyFile : Boolean;


		public var imageDecodingPolicy : String;

		public var parameters : Object;


		public var requestedContentParent : flash.display.DisplayObjectContainer;


		public var securityDomain : flash.system.SecurityDomain;


		public function LoaderContext (checkPolicyFile:Boolean=false, applicationDomain:ApplicationDomain=null, securityDomain:SecurityDomain=null)
		{
			this.applicationDomain = applicationDomain || new ApplicationDomain();
		}
		

		public UNIMPLEMENTED function get allowLoadBytesCodeExecution () : Boolean
		{
			throw new Error('LoaderContext: attempted call to an unimplemented function "allowLoadBytesCodeExecution"');
		}

		public UNIMPLEMENTED function set allowLoadBytesCodeExecution (allow:Boolean) : void
		{
			throw new Error('LoaderContext: attempted call to an unimplemented function "allowLoadBytesCodeExecution"');
		}
	}
}
