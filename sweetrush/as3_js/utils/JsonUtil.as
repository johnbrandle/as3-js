/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013 
 */

package sweetrush.as3_js.utils
{
	public class JsonUtil
	{
		public function parse(string:String):Object
		{
			return new Hydrate(string).result;
		}

		public function stringify(obj):String
		{
			return new Dehydrate(obj).result;
		}
	}
}


import flash.utils.getDefinitionByName;
import flash.utils.getQualifiedClassName;
import flash.utils.Dictionary;

import sweetrush.as3_js.utils.Base64Util;


internal class Hydrate
{
	private var _dehydratedObj:Object;
	private var _hydratedIDs:Object;
	private var _result:Object;

	public function Hydrate(string:String)
	{
		if (!string) return;

		_dehydratedObj = JSON.parse(string) || {};
		_dehydratedObj.dehydrated || {};
		_hydratedIDs = {};

		_result = hydrateObject(_dehydratedObj.dehydrated, _dehydratedObj.type);
	}

	private function hydrateObject(object:Object, type:String):Object
	{
		if (_hydratedIDs[object.id] !== undefined) return _hydratedIDs[object.id];

		var properties:Object;
		var propertyName:String;

		var robject:Object = type === 'array' ? [] : {};

		_hydratedIDs[object.id] = robject;

		properties = object.p || {};
		for (propertyName in properties) robject[propertyName] = getValueObject(properties[propertyName]);

		return robject;
	}

	private function getValueObject(object:*):Object
	{
		if (object is String && object == '__NaN__') return NaN;
		if (object is String) return Base64Util.decodeString(object);
		if (object is Number || object is Boolean || object == null) return object;
		if (object.constructor == Object)
		{
			//if (object.c !== undefined) return getDefinitionByName(Base64Util.decodeString(getQualifiedClassName(object.c)));
			if (object.r !== undefined)
			{
				var id:String = object.r;

				var obj:Object = _dehydratedObj.o;
				return hydrateObject(obj[id], obj[id].type);
			}
		}

		throw new Error('unknown value type');
	}

	public function get result():Object
	{
		return _result;
	}
}

internal class Dehydrate
{
	private var _dehydratedObjects:Object = {};

	private var _dehydratedNodes:Dictionary = new Dictionary();

	private var _idCounter:int = 1;

	private var _result:String;

	public function Dehydrate(persistable)
	{
		var dehydrated = dehydrateObject(persistable);

		var obj:Object = {};
		obj.dehydrated = dehydrated;
		obj.type = persistable is Array ? 'array' : 'object';
		obj.o = _dehydratedObjects;

		_result = JSON.stringify(obj);
	}

	private function dehydrateObject(object:Object):Object
	{
		var dehydrated:Object = getDehydrated(object);
		if (dehydrated) return dehydrated;

		//if (getQualifiedClassName(object).indexOf('::') == 0) throw new Error('cannot persist object created from internal class');

		dehydrated = {};
		dehydrated.id = generateID();
		dehydrated.type = object is Array ? 'array' : 'object';
		_dehydratedNodes[object] = dehydrated;

		if (object is Array || typeof object.valueOf() is Object)
		{
			_dehydratedObjects[dehydrated.id] = dehydrated;

			for (var property:String in object)
			{
				if (dehydrated.p === undefined) dehydrated.p = {};
				dehydrated.p[property] = getValue(object[property]);
			}

			return dehydrated;
		}

		throw new Error('Type is not supported for dehydration');
	}

	private function getDehydrated(object:Object):*
	{
		return _dehydratedNodes[object];
	}

	private function getValue(object:Object):*
	{
		if (object is String) return Base64Util.encodeString(object as String);
		if (object is Number && isNaN(object as Number)) return '__NaN__';
		if (object is Number || object is Boolean || object == null) return object;
		//if (object is Class)
		//{
		//	if (getQualifiedClassName(object).indexOf('::') == 0) throw new Error('cannot persist internal class reference');

		//	return {c:Base64Util.encodeString(getQualifiedClassName(object))};
		//}

		object = dehydrateObject(object);
		return {r:object.id};
	}

	public function get result():String
	{
		return _result;
	}

	private function generateID():String
	{
		return (_idCounter++).toString();
	}
}