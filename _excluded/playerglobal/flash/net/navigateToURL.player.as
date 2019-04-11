/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.net.URLRequest;
	

	public function navigateToURL(request:URLRequest, name:String=null):void
	{
		window.open(request.url, name);
	}
}
