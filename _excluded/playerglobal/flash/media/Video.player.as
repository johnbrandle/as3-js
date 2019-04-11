/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.display.DisplayObject;
	import flash.events.Event;
	import flash.media.Camera;
	import flash.net.NetStream;

	public class Video extends DisplayObject
	{
		private var $_netStream:NetStream;
		private var $_domVideoView:Object;
		
		private var $_properties:*;

		public function Video(width:int=320, height:int=240)
		{
			if ($_properties === undefined) $__properties({});
		
			super();

			$_properties.DisplayObjectScope.$_setExplicitBounds(width, height);
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				object.VideoScope = {};
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public override function $__notify(name:String, args:*):void
		{	
			if (name === 'visibilityChange' && $_domVideoView && $_netStream)
			{
				if (args) //visibility is hidden: example: user minimizes browser in ios
				{
					if (!$_domVideoView.paused) 
					{
						$_netStream.$__suspended = true;
						$_domVideoView.pause();
					}
				}
				else
				{
					if ($_netStream.$__suspended) 
					{
						$_netStream.$__suspended = false;
						$_domVideoView.play();
					}
				}
			}
			
			super.$__notify(name, args);
		}
		

		protected function $_applySize():void
		{
			if (!$_domVideoView) return;
			
			$_domVideoView.setAttribute('width', $_properties.DisplayObjectScope.$_width + 'px');
			$_domVideoView.setAttribute('height', $_properties.DisplayObjectScope.$_height + 'px');
		}

		override public function set width(value:Number):void
		{
			var width:Number = (value > 0) ? value : 320;
			$_properties.DisplayObjectScope.$_setExplicitBounds(width, $_properties.DisplayObjectScope.$_height);
			
			$_applySize();
		}

		override public function set height(value:Number):void
		{
			var height:Number = (value > 0) ? value : 240;
			$_properties.DisplayObjectScope.$_setExplicitBounds($_properties.DisplayObjectScope.$_width, height);
			
			$_applySize();
		}

		public function attachNetStream(netStream:NetStream):void
		{
			if ($_netStream)
			{
				$_netStream.removeEventListener('videoCreated', onVideoCreated);
				if ($_domVideoView) $_properties.DisplayObjectScope.$_domView.removeChild($_domVideoView);
				$_netStream = null;
				return;
			}
			
			if (!netStream) return;

			$_netStream = netStream;
			if ($_netStream.$__domVideoView)
			{
				onVideoCreated(null);
				return;
			}
			else $_netStream.addEventListener('videoCreated', onVideoCreated);
		}

		private function onVideoCreated(event:Event):void
		{
			$_domVideoView = $_netStream.$__domVideoView;
			$_properties.DisplayObjectScope.$_domView.appendChild($_domVideoView);

			$_applySize();
		}

		public UNIMPLEMENTED function get deblocking () : int
		{
			throw new Error('Video: attempted call to an unimplemented function "deblocking"');
		}

		public UNIMPLEMENTED function set deblocking (value:int) : void
		{
			throw new Error('Video: attempted call to an unimplemented function "deblocking"');
		}

		public UNIMPLEMENTED function get smoothing () : Boolean
		{
			throw new Error('Video: attempted call to an unimplemented function "smoothing"');
		}

		public UNIMPLEMENTED function set smoothing (value:Boolean) : void
		{
			throw new Error('Video: attempted call to an unimplemented function "smoothing"');
		}

		public function get videoHeight():int
		{
			return ($_domVideoView) ? $_domVideoView.videoHeight : 0;
		}

		public function get videoWidth () : int
		{
			return ($_domVideoView) ? $_domVideoView.videoWidth : 0;
		}

		public UNIMPLEMENTED function attachCamera (camera:Camera) : void
		{
			throw new Error('Video: attempted call to an unimplemented function "attachCamera"');
		}

		public UNIMPLEMENTED function clear () : void
		{
			throw new Error('Video: attempted call to an unimplemented function "clear"');
		}
	}
}
