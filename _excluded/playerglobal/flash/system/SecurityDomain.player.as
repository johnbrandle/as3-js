/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	public class SecurityDomain 
	{
		public function SecurityDomain()
		{
		}
		

		public static function get currentDomain():flash.system.SecurityDomain
		{
			return new SecurityDomain();
		}
	}
}
