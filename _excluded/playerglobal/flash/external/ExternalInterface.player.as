/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.external
{
	import player.Player;
	
	public final class ExternalInterface 
	{
		public static function get marshallExceptions():Boolean
		{
			return false;
		}
		public static function set marshallExceptions(value:Boolean):void
		{
			if (!value) return;
			
			throw new Error('ExternalInterface.marshallExceptions is not supported.');
		}

		public static function get available () : Boolean
		{
			return true;
		}

		public static function get objectID () : String
		{
			return Player.getDomStageContainerID();
		}

		public static function addCallback (functionName:String, closure:Function) : void
		{
			Player.getCallObject()[functionName] = closure;
		}

		public static function call (functionName:String, ...rest) : *
		{
			var scope:* = window;
			var properties:Array = functionName.split('.');
			for (var i:int = 0; i < properties.length - 1; i++)
			{
				scope = scope[properties[i]];
				
				if (typeof scope === "undefined" || scope === null) throw new Error('undefined scope in External Interface call method');
			}
			
			var fn:* = scope[properties[properties.length - 1]];
			return typeof fn === 'function' ? Function(fn).apply(scope, rest) : null;
		}
	}
}