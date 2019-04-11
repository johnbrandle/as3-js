/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	public class Error
	{
		public var message:String;
		public var name:String;
		
		public function getStackTrace():String { return null; }
		public function get errorID():int { return 0; }
	}
}