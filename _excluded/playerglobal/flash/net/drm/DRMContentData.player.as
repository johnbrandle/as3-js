/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net.drm
{
	import flash.utils.ByteArray;
	import flash.net.drm.VoucherAccessInfo;

	public UNIMPLEMENTED class DRMContentData 
	{
		public function get authenticationMethod () : String
		{
			throw new Error('DRMContentData: attempted call to an unimplemented function "authenticationMethod"');
		}

		public function get domain () : String
		{
			throw new Error('DRMContentData: attempted call to an unimplemented function "domain"');
		}

		public function get licenseID () : String
		{
			throw new Error('DRMContentData: attempted call to an unimplemented function "licenseID"');
		}

		public function get serverURL () : String
		{
			throw new Error('DRMContentData: attempted call to an unimplemented function "serverURL"');
		}

		public function DRMContentData (rawData:ByteArray=null)
		{
			throw new Error('DRMContentData: attempted call to an unimplemented constructor');
		}

		public function getVoucherAccessInfo () : Vector.<flash.net.drm.VoucherAccessInfo>
		{
			throw new Error('DRMContentData: attempted call to an unimplemented function "getVoucherAccessInfo"');
		}

	}
}
