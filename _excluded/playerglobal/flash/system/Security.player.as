/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	public final UNIMPLEMENTED class Security 
	{

		public static const APPLICATION : String = "application";


		public static const LOCAL_TRUSTED : String = "localTrusted";


		public static const LOCAL_WITH_FILE : String = "localWithFile";


		public static const LOCAL_WITH_NETWORK : String = "localWithNetwork";


		public static const REMOTE : String = "remote";

		public static function get disableAVM1Loading () : Boolean
		{
			throw new Error('Security: attempted call to an unimplemented function "disableAVM1Loading"');
		}

		public static function set disableAVM1Loading (value:Boolean) : void
		{
			throw new Error('Security: attempted call to an unimplemented function "disableAVM1Loading"');
		}


		public static function get exactSettings () : Boolean
		{
			throw new Error('Security: attempted call to an unimplemented function "exactSettings"');
		}

		public static function set exactSettings (value:Boolean) : void
		{
			throw new Error('Security: attempted call to an unimplemented function "exactSettings"');
		}

		public static function get pageDomain () : String
		{
			throw new Error('Security: attempted call to an unimplemented function "pageDomain"');
		}


		public static function get sandboxType () : String
		{
			throw new Error('Security: attempted call to an unimplemented function "sandboxType"');
		}


		public static function allowDomain (...rest) : void
		{
			throw new Error('Security: attempted call to an unimplemented function "allowDomain"');
		}


		public static function allowInsecureDomain (...rest) : void
		{
			throw new Error('Security: attempted call to an unimplemented function "allowInsecureDomain"');
		}

		static function duplicateSandboxBridgeInputArguments (toplevel:Object, args:Array) : Array
		{
			throw new Error('Security: attempted call to an unimplemented function "duplicateSandboxBridgeInputArguments"');
		}

		static function duplicateSandboxBridgeOutputArgument (toplevel:Object, arg:*) : *
		{
			throw new Error('Security: attempted call to an unimplemented function "duplicateSandboxBridgeOutputArgument"');
		}


		public static function loadPolicyFile (url:String) : void
		{
			throw new Error('Security: attempted call to an unimplemented function "loadPolicyFile"');
		}

		public function Security ()
		{
			throw new Error('Security: attempted call to an unimplemented constructor');
		}


		public static function showSettings (panel:String="default") : void
		{
			throw new Error('Security: attempted call to an unimplemented function "showSettings"');
		}

	}
}
