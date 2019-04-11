/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public function setInterval(closure:Function, delay:Number, ...rest):uint
	{
		return global.setInterval(function() { closure.apply(this, rest); }, delay);
	}
}
