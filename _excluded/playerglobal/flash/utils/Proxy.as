/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	import flash.utils.flash_proxy;

	public dynamic class Proxy 
	{
		private var $$isProxy:Boolean = true;
		
		private var $keys:Array = [];
		private var $values:Array = [];
		
		public function Proxy()
		{
		}
		
		flash_proxy function deleteProperty(name:*):Boolean
		{
			for (var i:int = 0; i < $keys.length; i++) if ($keys[i] == name) break;
			
			if (i == $keys.length) return false;
			
			$keys.splice(i, 1);
			$values.splice(i, 1);
			
			return true;
		}	
		
		flash_proxy function getProperty(name:*):*
		{
			for (var i:int = 0; i < $keys.length; i++) if ($keys[i] == name) break;
			
			if (i == $keys.length) return undefined;
		
			return $values[i];
		}
		
		flash_proxy function setProperty(name:*, value:*):void
		{
			for (var i:int = 0; i < $keys.length; i++) if ($keys[i] == name) break;
			
			$keys[i] = name;
			$values[i] = value;
		}
		
		flash_proxy function hasProperty(name:*):Boolean
		{
			for (var i:int = 0; i < $keys.length; i++) if ($keys[i] == name) return true;
			
			return false;
		}
		
		flash_proxy function nextName(index:int):String
		{
			return $keys[index - 1];
		}
				
		flash_proxy function nextNameIndex(index:int):int
		{
			return (index < $keys.length) ? index + 1 : 0;
		}
	
		flash_proxy function nextValue(index:int):*
		{
			return $values[index - 1];
		}
	
		flash_proxy function callProperty(name:*, ... rest):*
		{
			for (var i:int = 0; i < $keys.length; i++) if ($keys[i] == name) break;
			
			if (i == $keys.length) throw new Error('property not found');
			
			return $values[i].apply(this, rest);
		}
		
		flash_proxy function getDescendants(name:*):*
		{
			throw new Error('Proxy: not implemented');
		}
		
		flash_proxy function isAttribute(name:*):Boolean
		{
			throw new Error('Proxy: not implemented');
		}
		
		private function $$get(key:*):*
		{
			return flash_proxy::getProperty(key);
		}
		
		private function $$set(key:*, value:*):*
		{
			flash_proxy::setProperty(key, value);
			return value;
		}
		
		private function $$call(name:*, args:Array):*
		{
			args.unshift(name);
			return flash_proxy::callProperty.apply(this, args);
		}
		
		private function $$delete(key:*):Boolean
		{
			return flash_proxy::deleteProperty(key);
		}
		
		private function $$nextName(index:int):String
		{
			return flash_proxy::nextName(index);
		}
		
		private function $$nextNameIndex(index:int):int
		{
			return flash_proxy::nextNameIndex(index);
		}
		
		private function $$nextValue(index:int):*
		{
			return flash_proxy::nextValue(index);
		}
	}
}