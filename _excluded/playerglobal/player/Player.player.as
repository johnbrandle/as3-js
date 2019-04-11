/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package player
{
	import flash.display.Stage;
	
	public final class Player
	{
		private static var $_domStageContainerID:String;
		private static var $_frameRate:*;
		private static var $_callObject:Object;
		
		private static var $_stage:Stage;
		
		private static var $_uid:* = 0;
		
		public static function $__init(domStageContainerID:String, frameRate:int=7, callObject:Object=null):void
		{
			$_domStageContainerID = domStageContainerID;
			$_frameRate = frameRate;
			$_callObject = callObject;
		}
		
		public static function $__getStage():Stage
		{
			if ($_stage) return $_stage;
			
			var domStageContainer:* = document.getElementById($_domStageContainerID);
			var stage:* = Stage['$__init'](domStageContainer); //if we use Stage.$__init we will get an error when doing selective compilation and excluding stage, example: ant all -Dh=FlipCardScenarioActivity.as+FlipCardView.as+FlipCardItem.as
			var setTimeout:Function = window.setTimeout;
			var requestAnimationFrame:Function = window.requestAnimationFrame;
			var beginTime:* = new Date().getTime();
			
			//may be causing issues... comment out for now, but unless an issue is found this should be uncommented again.. if issue is found, this code will be removed... so if code not removed, uncomment this!
			//update. no issue found. uncommented.
			document.addEventListener('visibilitychange', onVisibilityChange, false); 
			
			function onVisibilityChange(event:*):void
			{
				stage.$__notify('visibilityChange', document.hidden);
				
				if (!window.audioContexts) return;
				
				for (var i:int = window.audioContexts.length; i--;) //suspend/resume all audio
				{
					var audioContext:* = window.audioContexts[i];
					
					try
					{
						if (document.hidden) audioContext.suspend();
						else audioContext.resume();
					}
					catch (error:*) {}
				}
			}
			
			render();
			
			function render():void
			{
				setTimeout(onTimeout, 1000 / $_frameRate);	
				
				var endTime:* = new Date().getTime();
				var timeElapsed:* = endTime - beginTime;
				beginTime = endTime;
				
				stage.$__notify('enterFrame', timeElapsed);
			}
			
			function onTimeout():void
			{ 
				if (requestAnimationFrame != null) requestAnimationFrame(render);
				else render();
			}
			
			return $_stage = stage;
		}
		
		public static function getFrameRate():int
		{
			return $_frameRate;
		}
		
		public static function setFrameRate(frameRate:int):void
		{
			$_frameRate = frameRate;
		}
		
		public static function getUniqueID(prefix:String='uid'):String
		{
			return prefix + '_' + $_uid++;
		}
		
		public static function getDomStageContainerID():String
		{
			return $_domStageContainerID;	
		}
		
		public static function getCallObject():Object
		{
			return $_callObject;
		}
	}
}