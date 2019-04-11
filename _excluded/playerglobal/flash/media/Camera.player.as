/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.events.EventDispatcher;
	import flash.media.Camera;

	public final UNIMPLEMENTED class Camera extends EventDispatcher
	{
		public function get activityLevel () : Number
		{
			throw new Error('Camera: attempted call to an unimplemented function "activityLevel"');
		}

		public function get bandwidth () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "bandwidth"');
		}

		public function get currentFPS () : Number
		{
			throw new Error('Camera: attempted call to an unimplemented function "currentFPS"');
		}

		public function get fps () : Number
		{
			throw new Error('Camera: attempted call to an unimplemented function "fps"');
		}

		public function get height () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "height"');
		}

		public function get index () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "index"');
		}

		public static function get isSupported () : Boolean
		{
			throw new Error('Camera: attempted call to an unimplemented function "isSupported"');
		}

		public function get keyFrameInterval () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "keyFrameInterval"');
		}

		public function get loopback () : Boolean
		{
			throw new Error('Camera: attempted call to an unimplemented function "loopback"');
		}

		public function get motionLevel () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "motionLevel"');
		}

		public function get motionTimeout () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "motionTimeout"');
		}

		public function get muted () : Boolean
		{
			throw new Error('Camera: attempted call to an unimplemented function "muted"');
		}

		public function get name () : String
		{
			throw new Error('Camera: attempted call to an unimplemented function "name"');
		}

		public static function get names () : Array
		{
			throw new Error('Camera: attempted call to an unimplemented function "names"');
		}

		public function get position () : String
		{
			throw new Error('Camera: attempted call to an unimplemented function "position"');
		}

		public function get quality () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "quality"');
		}

		public function get width () : int
		{
			throw new Error('Camera: attempted call to an unimplemented function "width"');
		}

		static function _scanHardware () : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "_scanHardware"');
		}

		public function Camera ()
		{
			throw new Error('Camera: attempted call to an unimplemented constructor');
		}

		public static function getCamera (name:String=null) : flash.media.Camera
		{
			throw new Error('Camera: attempted call to an unimplemented function "getCamera"');
		}

		public function setCursor (value:Boolean) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setCursor"');
		}

		public function setKeyFrameInterval (keyFrameInterval:int) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setKeyFrameInterval"');
		}

		public function setLoopback (compress:Boolean=false) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setLoopback"');
		}

		public function setMode (width:int, height:int, fps:Number, favorArea:Boolean=true) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setMode"');
		}

		public function setMotionLevel (motionLevel:int, timeout:int=2000) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setMotionLevel"');
		}

		public function setQuality (bandwidth:int, quality:int) : void
		{
			throw new Error('Camera: attempted call to an unimplemented function "setQuality"');
		}

	}
}
