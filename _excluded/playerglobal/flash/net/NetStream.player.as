/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.NetStatusEvent;
	import flash.media.Camera;
	import flash.media.Microphone;
	import flash.media.SoundTransform;
	import flash.media.VideoStreamSettings;
	import flash.utils.ByteArray;
	
	import browser.Browser;

	public class NetStream extends EventDispatcher
	{
		protected static var $__PLAYING:String = 'playing';
		protected static var $__VIDEO_CREATED:String = 'videoCreated';

		private var $_soundTransform:SoundTransform = new SoundTransform();
		
		private var $_wasPaused:Boolean;
		
		private var $_wasEnded:Boolean = true;
		
		private var $_endTime:Number = 0;
		
		private var $_realPause:Boolean;  //ios hack

		public var $__suspended:Boolean;
		
		private var $_duration:Number = -1;
		
		public var $__domVideoView:Object;

		protected var $_client:Object;


		public static const CONNECT_TO_FMS : String = "connectToFMS";


		public static const DIRECT_CONNECTIONS : String = "directConnections";


		public function NetStream (connection:NetConnection, peerID:String="connectToFMS")
		{
			super();

			$_client = this;
		}

		public function play(...rest):void
		{
			$__domVideoView = Browser.getNewVideo();

			dispatchEvent(new Event($__VIDEO_CREATED));

			var window:Object = Browser.getWindow();
			var isPlaying:Boolean = false;
			var isIE:Boolean = window.ie;
			var setTimeout:Function = window.setTimeout;
			var firefoxMobile:Boolean = (window.mobile && window.firefox);
			var safariMobile:Boolean = (window.mobile && window.safari);
			var canPlayThrough:Boolean = false;
			
			$__domVideoView.addEventListener('loadedmetadata', onLoadedMetaData);
			$__domVideoView.addEventListener('play', onPlay);
			$__domVideoView.addEventListener('canplaythrough', onCanPlay); //canplay

			$__domVideoView.src = rest[0];
			
			if (safariMobile)
			{
				$__domVideoView.load();
				$__domVideoView.play();
				$__domVideoView.pause();
			}
			else if (firefoxMobile) $__domVideoView.play(); //firefox mobile doesn't load or call metadata automatically

			function onLoadedMetaData(event:Event):void
			{
				$__domVideoView.removeEventListener('loadedmetadata', onLoadedMetaData);

				if (!$_client.onMetaData) return;

				$_duration = $__domVideoView.duration;
				
				trace('reported video duration: ' + $_duration);
				if ($_duration == 1)
				{
					trace('incorrect video duration metadata detected. loading metadata file');
					
					var parts:Array = rest[0].split('.');
					parts.pop();
					
					var uri:String = parts.join('.') + '.metadata';
					
					var xmlHttpRequest:Object = new window.XMLHttpRequest();
					xmlHttpRequest.open('GET', uri, false);
					xmlHttpRequest.overrideMimeType('text/javascript');
					xmlHttpRequest.send(null);
					
					trace('metadata file reported duration: ' + xmlHttpRequest.responseText);
					$_duration = xmlHttpRequest.responseText;	
				}
				
				$_client.onMetaData({width:$__domVideoView.videoWidth, height:$__domVideoView.videoHeight, duration:$_duration, framerate:30});
				
				//if (safariMobile) $__domVideoView.load(); //safari mobile doesn't load automatically
			}
			
			function onCanPlay(event:Event):void
			{
				$__domVideoView.removeEventListener('canplaythrough', onCanPlay); //canplay
				
				trace('can play through');
				
				canPlayThrough = true;
				
				if (!firefoxMobile) $__domVideoView.play();
			}
			
			function onPlay(event:Event):void
			{
				if (!canPlayThrough) return;
				
				if ($_wasEnded) 
				{
					dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.Play.Start'}));
					$_wasEnded = false;
				}
				
				if (!isPlaying) onPlaying();	
			}
			
			function onPlaying():void
			{
				isPlaying = true;
				
				if (!$__domVideoView) 
				{
					isPlaying = false;
					return;
				}
				
				if ($__domVideoView.paused || $__domVideoView.ended)
				{					
					isPlaying = false;
					
					if ($__suspended) return;
					else if ($__domVideoView.ended) onEnded();
					else if ($_realPause) 
					{
						dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.Pause.Notify'}));
						$_wasPaused = true;
					}
					else 
					{
						trace('unbuffered edge case');
						$__domVideoView.play();  //ios likes to pause when seeking to unbuffered location, so we are forcing play to be called once the buffering is ready
					}
					
					return;
				}
				else if ($_wasPaused)
				{
					dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.Unpause.Notify'}));
					$_wasPaused = false;
				}
				else if ($__domVideoView.currentTime > $_duration) //ie bug, see https://gist.github.com/timmhayes
				{
					trace('ie reporting currentTime greater than duration');
					
					onEnded();
					$__domVideoView.pause();
					
					return;
				}
				
				dispatchEvent(new Event(NetStream.$__PLAYING));
				
				setTimeout(onPlaying, (isIE) ? 50 : 250); //check more often for ie given the ie bug workaround we are using
			}
			
			function onEnded():void
			{	
				$_wasEnded = true;
				$_endTime = time;
				
				trace('onEnded called, end time: ' + $_endTime);
				
				dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.Play.Stop'}));
				
				if ($_client.onPlayStatus) $_client.onPlayStatus({code:'NetStream.Play.Complete'}); 
			}
		}

		public function get client ():Object
		{
			return $_client;
		}

		public function set client(object:Object):void
		{
			if (!object) object = this;

			$_client = object;
		}

		public UNIMPLEMENTED function get audioCodec () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "audioCodec"');
		}


		public UNIMPLEMENTED function get audioReliable () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "audioReliable"');
		}

		public UNIMPLEMENTED function set audioReliable (reliable:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "audioReliable"');
		}


		public UNIMPLEMENTED function get audioSampleAccess () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "audioSampleAccess"');
		}

		public UNIMPLEMENTED function set audioSampleAccess (reliable:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "audioSampleAccess"');
		}


		public UNIMPLEMENTED function get backBufferLength () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "backBufferLength"');
		}


		public UNIMPLEMENTED function get backBufferTime () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "backBufferTime"');
		}

		public UNIMPLEMENTED function set backBufferTime (backBufferTime:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "backBufferTime"');
		}


		public UNIMPLEMENTED function get bufferLength () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bufferLength"');
		}

		public UNIMPLEMENTED function get bufferTime () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bufferTime"');
		}

		public UNIMPLEMENTED function set bufferTime (bufferTime:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bufferTime"');
		}


		public UNIMPLEMENTED function get bufferTimeMax () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bufferTimeMax"');
		}

		public UNIMPLEMENTED function set bufferTimeMax (bufferTimeMax:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bufferTimeMax"');
		}


		public UNIMPLEMENTED function get bytesLoaded () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bytesLoaded"');
		}


		public UNIMPLEMENTED function get bytesTotal () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "bytesTotal"');
		}

		public UNIMPLEMENTED function get checkPolicyFile () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "checkPolicyFile"');
		}

		public UNIMPLEMENTED function set checkPolicyFile (state:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "checkPolicyFile"');
		}


		public UNIMPLEMENTED function get currentFPS () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "currentFPS"');
		}


		public UNIMPLEMENTED function get dataReliable () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "dataReliable"');
		}

		public UNIMPLEMENTED function set dataReliable (reliable:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "dataReliable"');
		}

		public UNIMPLEMENTED function get decodedFrames () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "decodedFrames"');
		}


		public UNIMPLEMENTED function get farID () : String
		{
			throw new Error('NetStream: attempted call to an unimplemented function "farID"');
		}


		public UNIMPLEMENTED function get farNonce () : String
		{
			throw new Error('NetStream: attempted call to an unimplemented function "farNonce"');
		}


		public UNIMPLEMENTED function get inBufferSeek () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "inBufferSeek"');
		}

		public UNIMPLEMENTED function set inBufferSeek (value:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "inBufferSeek"');
		}


		public UNIMPLEMENTED function get info () : flash.net.NetStreamInfo
		{
			throw new Error('NetStream: attempted call to an unimplemented function "info"');
		}


		public UNIMPLEMENTED function get liveDelay () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "liveDelay"');
		}


		public UNIMPLEMENTED function get maxPauseBufferTime () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "maxPauseBufferTime"');
		}


		public UNIMPLEMENTED function set maxPauseBufferTime (pauseBufferTime:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "maxPauseBufferTime"');
		}


		public UNIMPLEMENTED function get multicastAvailabilitySendToAll () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastAvailabilitySendToAll"');
		}

		public UNIMPLEMENTED function set multicastAvailabilitySendToAll (value:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastAvailabilitySendToAll"');
		}


		public UNIMPLEMENTED function get multicastAvailabilityUpdatePeriod () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastAvailabilityUpdatePeriod"');
		}

		public UNIMPLEMENTED function set multicastAvailabilityUpdatePeriod (seconds:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastAvailabilityUpdatePeriod"');
		}


		public UNIMPLEMENTED function get multicastFetchPeriod () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastFetchPeriod"');
		}

		public UNIMPLEMENTED function set multicastFetchPeriod (seconds:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastFetchPeriod"');
		}


		public UNIMPLEMENTED function get multicastInfo () : flash.net.NetStreamMulticastInfo
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastInfo"');
		}


		public UNIMPLEMENTED function get multicastPushNeighborLimit () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastPushNeighborLimit"');
		}

		public UNIMPLEMENTED function set multicastPushNeighborLimit (neighbors:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastPushNeighborLimit"');
		}


		public UNIMPLEMENTED function get multicastRelayMarginDuration () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastRelayMarginDuration"');
		}

		public UNIMPLEMENTED function set multicastRelayMarginDuration (seconds:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastRelayMarginDuration"');
		}


		public UNIMPLEMENTED function get multicastWindowDuration () : Number
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastWindowDuration"');
		}

		public UNIMPLEMENTED function set multicastWindowDuration (seconds:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "multicastWindowDuration"');
		}


		public UNIMPLEMENTED function get nearNonce () : String
		{
			throw new Error('NetStream: attempted call to an unimplemented function "nearNonce"');
		}


		public UNIMPLEMENTED function get objectEncoding () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "objectEncoding"');
		}


		public UNIMPLEMENTED function get peerStreams () : Array
		{
			throw new Error('NetStream: attempted call to an unimplemented function "peerStreams"');
		}


		public function get soundTransform():flash.media.SoundTransform
		{
			return $_soundTransform;
		}

		public function set soundTransform (soundTransform:SoundTransform):void
		{
			$_soundTransform = soundTransform;
			
			$__domVideoView.volume = soundTransform.volume;
		}


		public function get time () : Number
		{			
			return Math.min($__domVideoView.currentTime, $_duration);
		}

		public UNIMPLEMENTED function get useHardwareDecoder () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "useHardwareDecoder"');
		}

		public UNIMPLEMENTED function set useHardwareDecoder (v:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "useHardwareDecoder"');
		}

		public UNIMPLEMENTED function get videoCodec () : uint
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoCodec"');
		}


		public UNIMPLEMENTED function get videoReliable () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoReliable"');
		}

		public UNIMPLEMENTED function set videoReliable (reliable:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoReliable"');
		}


		public UNIMPLEMENTED function get videoSampleAccess () : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoSampleAccess"');
		}

		public UNIMPLEMENTED function set videoSampleAccess (reliable:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoSampleAccess"');
		}

		public UNIMPLEMENTED function get videoStreamSettings () : VideoStreamSettings
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoStreamSettings"');
		}

		public UNIMPLEMENTED function set videoStreamSettings (settings:VideoStreamSettings) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "videoStreamSettings"');
		}


		public UNIMPLEMENTED function appendBytes (bytes:ByteArray) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "appendBytes"');
		}


		public UNIMPLEMENTED function appendBytesAction (netStreamAppendBytesAction:String) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "appendBytesAction"');
		}


		public UNIMPLEMENTED function attach (connection:NetConnection) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "attach"');
		}

		public UNIMPLEMENTED function attachAudio (microphone:Microphone) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "attachAudio"');
		}


		public UNIMPLEMENTED function attachCamera (theCamera:Camera, snapshotMilliseconds:int=-1) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "attachCamera"');
		}


		public function close () : void
		{
			if (!$__domVideoView) return;
			
			$__domVideoView.pause();
			$__domVideoView.src = '';
			$__domVideoView.removeAttribute('src');
		}

		public function dispose () : void
		{
			if (!$__domVideoView) return;
			
			close();
			if ($__domVideoView.parentNode) $__domVideoView.parentNode.displayObject.attachNetStream(null);
			$__domVideoView = null;
		}

		/**
		 * Invoked when a peer-publishing stream matches a peer-subscribing stream. Before the subscriber is
		 * connected to the publisher, call this method to allow the ActionScript code fine access control for
		 * peer-to-peer publishing. The following code shows an example of how to create a callback function for this method:
		 *
		 *   <codeblock>
		 *
		 *   var c:Object = new Object;
		 * c.onPeerConnect = function(subscriber:NetStream):Boolean {
		 * if (accept)
		 * return true;
		 * else
		 * return false;
		 * };
		 * m_netStream.client = c;
		 *
		 *   </codeblock>
		 * If a peer-publisher does not implement this method, all peers are allowed to play any published content.
		 */
		public UNIMPLEMENTED function onPeerConnect (subscriber:NetStream) : Boolean
		{
			throw new Error('NetStream: attempted call to an unimplemented function "onPeerConnect"');
		}


		public function pause ():void
		{
			if ($_wasEnded && $_endTime) return;
			
			$_realPause = true;
			$__domVideoView.pause();
		}


		public UNIMPLEMENTED function play2 (param:NetStreamPlayOptions) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "play2"');
		}


		public UNIMPLEMENTED function publish (name:String=null, type:String=null) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "publish"');
		}


		public UNIMPLEMENTED function receiveAudio (flag:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "receiveAudio"');
		}


		public UNIMPLEMENTED function receiveVideo (flag:Boolean) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "receiveVideo"');
		}


		public UNIMPLEMENTED function receiveVideoFPS (FPS:Number) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "receiveVideoFPS"');
		}


		public function resume():void
		{
			if ($_wasEnded && $_endTime) return;
			
			$_realPause = false;
			$__domVideoView.play();
		}

		/**
		 * Seeks the keyframe (also called an I-frame in the video industry) closest to
		 * the specified location. The keyframe is placed at an offset, in seconds, from
		 * the beginning of the stream.
		 *
		 *   Video streams are usually encoded with two types of frames, keyframes (or I-frames)
		 * and P-frames. A keyframe contains an entire image, while a P-frame is an
		 * interim frame that provides additional video information between keyframes.
		 * A video stream typically has a keyframe every 10-50 frames.
		 * Flash Media Server has several types of seek behavior: enhanced seeking and smart seeking.Enhanced seeking Enhanced seeking is enabled by default. To disable enhanced seeking, on Flash Media Server set the EnhancedSeek
		 * element in the Application.xml configuration file to false.
		 * If enhanced seeking is enabled, the server generates
		 * a new keyframe at offset based on the previous keyframe and any
		 * intervening P-frames. However, generating keyframes creates a high processing load on the server
		 * and distortion might occur in the generated keyframe.
		 * If the video codec is On2, the keyframe before the seek point and any
		 * P-frames between the keyframe and the seek point are sent to the client.
		 *
		 *   If enhanced seeking is disabled, the server starts streaming
		 * from the nearest keyframe. For example, suppose a video has keyframes at 0 seconds
		 * and 10 seconds. A seek to 4 seconds causes playback to start at 4 seconds
		 * using the keyframe at 0 seconds. The video stays frozen until it reaches the
		 * next keyframe at 10 seconds. To get a better seeking experience, you need to
		 * reduce the keyframe interval. In normal seek mode, you cannot start the video
		 * at a point between the keyframes.
		 * Smart seekingTo enable smart seeking, set NetStream.inBufferSeek to true.Smart seeking allows Flash Player to seek within an existing back buffer and forward buffer. When smart seeking is disabled,
		 * each time seek() is called Flash Player flushes the buffer and requests data from the server.
		 * For more information, see NetStream.inBufferSeek.Seeking in Data Generation ModeWhen you call seek() on a NetStream in Data Generation Mode, all bytes passed to
		 * appendBytes() are discarded (not placed in the buffer, accumulated in the partial message FIFO, or parsed for seek points)
		 * until you call appendBytesAction(NetStreamAppendBytesAction.RESET_BEGIN) or appendBytesAction(NetStreamAppendBytesAction.RESET_SEEK)
		 * to reset the parser. For information about Data Generation Mode, see NetStream.play().
		 * @param	offset	The approximate time value, in seconds, to move to in a video file.
		 *   With Flash Media Server, if <EnhancedSeek> is set to true in the Application.xml
		 *   configuration file (which it is by default), the server
		 *   generates a keyframe at offset.
		 *
		 *     To return to the beginning of the stream, pass 0 for offset.To seek forward from the beginning of the stream, pass the number of seconds to advance.
		 *   For example, to position the playhead at 15 seconds from the beginning (or the keyframe
		 *   before 15 seconds), use myStream.seek(15).To seek relative to the current position, pass NetStream.time + n
		 *   or NetStream.time - n
		 *   to seek n seconds forward or backward, respectively, from the current position.
		 *   For example, to rewind 20 seconds from the current position, use
		 *   NetStream.seek(NetStream.time - 20).
		 */
		public function seek (offset:Number) : void
		{
			if (offset == $__domVideoView.currentTime) return;
			if ($_wasEnded) 
			{
				if (offset >= $_endTime) return;
				$_wasEnded = false;
				$_endTime = 0;
				$_realPause = false;
				$__domVideoView.play();
			}
			
			dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.SeekStart.Notify'}));
			
			if ($_duration == -1 && offset > $__domVideoView.buffered.end(0)) offset = $__domVideoView.buffered.end(0) - 1;
			else if ($_duration != -1 && offset >= $_duration) offset = $_duration - 1;
				
			$__domVideoView.currentTime = offset;
			
			dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false, {code:'NetStream.Seek.Notify'}));
		}


		public UNIMPLEMENTED function send (handlerName:String, ...rest) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "send"');
		}


		public UNIMPLEMENTED function step (frames:int) : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "step"');
		}


		public UNIMPLEMENTED function togglePause () : void
		{
			throw new Error('NetStream: attempted call to an unimplemented function "togglePause"');
		}

	}
}
