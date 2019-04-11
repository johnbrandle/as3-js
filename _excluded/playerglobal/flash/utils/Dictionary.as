/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	public dynamic class Dictionary 
	{
		private var $$isProxy:Boolean = true;

		private var $map:* = new global.Map();

		private var $keys:Array = [];
		private var $values:Array = [];
		

		public function Dictionary(weakKeys:Boolean=false)
		{
			if (weakKeys) trace('Warning: Dictionary: does not support weakKeys at this time');
		}
		
		public UNIMPLEMENTED function toJSON(k:String):*
		{
			throw new Error('Dictionary: does not support toJSON at this time');
		}
		
		private function $$get(key:*):*
		{
			if (!$map.has(key)) return undefined;
			return $map.get(key).value;
		}
		
		private function $$set(key:*, value:*):*
		{
			$map.set(key, {index:$values.length, value:value});
			$keys.push(key);
			$values.push(value);
		}
		
		private function $$call(name:*, args:Array):*
		{
			return $map.get(name).value.apply(this, args);
		}
		
		private function $$delete(key:*):Boolean
		{
			if ($map.has(key))
			{
				var value = $map.get(key);
				$values.splice(value.index, 1);
				$keys.splice(value.index, 1);
			}

			return $map.delete(key);
		}
		
		private function $$nextName(index:int):*
		{
			return $keys[index - 1];
		}
		
		private function $$nextNameIndex(index:int):int
		{
			return (index < $values.length) ? index + 1 : 0;
		}
		
		private function $$nextValue(index:int):*
		{
			return $values[index - 1];
		}
	}
}