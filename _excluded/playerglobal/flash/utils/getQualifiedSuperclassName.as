/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public function getQualifiedSuperclassName(object:*):String
	{
		if (object == Object) return null;
		if (object.$$isclass !== undefined)
		{
			if (object === Array) return 'Object';
			return getQualifiedClassName(object.__proto__);
		}
		else if (object.$$ismethod !== undefined) return 'Function';
		else if (object.constructor.$$isclass !== undefined) return getQualifiedClassName(object.constructor.__proto__);
		return object.constructor.__proto__.name;
	}
}