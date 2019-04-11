/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.Scene;
	
	
	
	import player.Player;
	
	public dynamic class MovieClip extends Sprite
	{
		private var $_properties:*;
		
		private var $_lwf:*; //lwf
		private var $_player:*; //flwebgl
		
		private var $_stage:*;
		
		public function MovieClip()
		{
			if ($_properties === undefined) $__properties({});
			
			super();
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.MovieClipScope = {$_setupLWF:$_setupLWF, $_setupFLWebGL:$_setupFLWebGL};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		protected override function $__createDomView():*
		{
			return document.createElement('canvas');
		}
		
		private function $_setupLWF():void
		{
			$_lwf = $_properties.DisplayObjectScope.$_domView.lwf;
			$_stage = $_lwf.rootMovie;
			
			//var frameRate:int = Player.getFrameRate(); //use framerate of lwf file....
			
			//$_lwf.setFrameRate(frameRate);  //$__render should check for changes to framerate, and set again
		}
		
		private function $_setupFLWebGL():void
		{
			$_player = $_properties.DisplayObjectScope.$_domView.player;
			$_stage = $_player.getStage();
		}
		
		public override function $__notify(name:String, args:*):void
		{	
			if (name === 'enterFrame')
			{
				if ($_lwf)
				{
					var lwf:Object = $_lwf;
					lwf.exec(args * .001);
					lwf.render();
				}
				else if ($_player) $_player.update();
			}
			
			super.$__notify(name, args);
		}
		
		public function get currentFrame () : int
		{
			return $_stage.currentFrame;
		}

		public UNIMPLEMENTED function get currentFrameLabel () : String
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "currentFrameLabel"');
		}

		public UNIMPLEMENTED function get currentLabel () : String
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "currentLabel"');
		}

		public UNIMPLEMENTED function get currentLabels () : Array
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "currentLabels"');
		}

		public UNIMPLEMENTED function get currentScene () : flash.display.Scene
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "currentScene"');
		}

		public UNIMPLEMENTED function get enabled () : Boolean
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "enabled"');
		}

		public UNIMPLEMENTED function set enabled (value:Boolean) : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "enabled"');
		}

		public UNIMPLEMENTED function get framesLoaded () : int
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "framesLoaded"');
		}

		public UNIMPLEMENTED function get scenes () : Array
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "scenes"');
		}

		public function get totalFrames () : int
		{
			return $_stage.totalFrames;
		}

		public UNIMPLEMENTED function get trackAsMenu () : Boolean
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "trackAsMenu"');
		}

		public UNIMPLEMENTED function set trackAsMenu (value:Boolean) : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "trackAsMenu"');
		}

		public UNIMPLEMENTED function addFrameScript (...rest) : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "addFrameScript"');
		}

		public function gotoAndPlay (frame:Object, scene:String=null) : void
		{
			$_stage.gotoAndPlay(frame);
		}

		public function gotoAndStop (frame:Object, scene:String=null) : void
		{
			$_stage.gotoAndStop(frame);
		}

		public UNIMPLEMENTED function nextFrame () : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "nextFrame"');
		}

		public UNIMPLEMENTED function nextScene () : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "nextScene"');
		}

		public function play () : void
		{
			$_stage.play();
		}

		public UNIMPLEMENTED function prevFrame () : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "prevFrame"');
		}

		public UNIMPLEMENTED function prevScene () : void
		{
			throw new Error('MovieClip: attempted call to an unimplemented function "prevScene"');
		}

		public function stop () : void
		{
			$_stage.stop();
		}
	}
}
