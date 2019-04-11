/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net.drm
{
	import flash.events.EventDispatcher;
	import flash.net.drm.DRMManager;
	import flash.utils.ByteArray;
	import flash.net.drm.DRMContentData;
	import flash.events.DRMAuthenticationCompleteEvent;
	import flash.events.DRMAuthenticationErrorEvent;
	import flash.events.DRMStatusEvent;
	import flash.events.DRMErrorEvent;
	import flash.net.drm.DRMVoucher;

	public UNIMPLEMENTED class DRMManager extends EventDispatcher
	{

		public static function get isSupported () : Boolean
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "isSupported"');
		}


		public function authenticate (serverURL:String, domain:String, username:String, password:String) : void
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "authenticate"');
		}

		public function DRMManager ()
		{
			throw new Error('DRMManager: attempted call to an unimplemented constructor');
		}


		public static function getDRMManager () : flash.net.drm.DRMManager
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "getDRMManager"');
		}


		public function loadPreviewVoucher (contentData:DRMContentData) : void
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "loadPreviewVoucher"');
		}

		public function loadVoucher (contentData:DRMContentData, setting:String) : void
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "loadVoucher"');
		}

		public function setAuthenticationToken (serverUrl:String, domain:String, token:ByteArray) : void
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "setAuthenticationToken"');
		}

		public function storeVoucher (voucher:ByteArray) : void
		{
			throw new Error('DRMManager: attempted call to an unimplemented function "storeVoucher"');
		}

	}
}
