/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	[JavaScript]
	public function getDefinitionByName(name:String):Object
	{
		var parts = name.split('::').join('.').split('.');
		var definitionName = parts.pop();
		var packageName = parts.join('.');
		
		if ($es4.$$[packageName] === undefined || $es4.$$[packageName][definitionName] === undefined) throw new Error('Variable ' + name + ' is not defined.');
		
		return $es4.$$[packageName][definitionName];
	}
}