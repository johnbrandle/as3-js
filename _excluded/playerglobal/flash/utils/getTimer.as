/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public function getTimer():int
	{
		return new Date().getTime() - global.$es4.$$startTime;
	}
}