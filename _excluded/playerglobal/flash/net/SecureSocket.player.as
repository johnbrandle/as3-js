/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.security.X509Certificate;
	import flash.utils.ByteArray;

	public UNIMPLEMENTED class SecureSocket extends Socket
	{

		public static function get isSupported () : Boolean
		{
			throw new Error('SecureSocket: attempted call to an unimplemented function "isSupported"');
		}

		public function get serverCertificate () : X509Certificate
		{
			throw new Error('SecureSocket: attempted call to an unimplemented function "serverCertificate"');
		}


		public function get serverCertificateStatus () : String
		{
			throw new Error('SecureSocket: attempted call to an unimplemented function "serverCertificateStatus"');
		}

		public function addBinaryChainBuildingCertificate (certificate:ByteArray, trusted:Boolean) : void
		{
			throw new Error('SecureSocket: attempted call to an unimplemented function "addBinaryChainBuildingCertificate"');
		}

		public function connect (host:String, port:int) : void
		{
			throw new Error('SecureSocket: attempted call to an unimplemented function "connect"');
		}


		public function SecureSocket ()
		{
			throw new Error('SecureSocket: attempted call to an unimplemented constructor');
		}

	}
}
