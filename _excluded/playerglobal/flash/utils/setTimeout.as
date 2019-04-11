/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public function setTimeout (closure:Function, delay:Number, ...rest) : uint
	{
		return global.setTimeout(function ():void { closure.apply(this, rest); }, delay);
	}
}
