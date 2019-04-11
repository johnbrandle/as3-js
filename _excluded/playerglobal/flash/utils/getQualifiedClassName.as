/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public function getQualifiedClassName(object:*):String
	{
		if (object.$$isclass !== undefined) return object.$$fullyQualifiedName;
		else if (object.$$ismethod !== undefined) return 'builtin.as$0::MethodClosure';
		else if (object.constructor.name === 'Number')
		{
			if (object = int(object)) return 'int';
			else if (object = uint(object)) return 'uint';
			return 'Number';
		}
		else if (object.constructor.$$isclass !== undefined) return object.constructor.$$fullyQualifiedName;
		return object.constructor.name;
	}
}