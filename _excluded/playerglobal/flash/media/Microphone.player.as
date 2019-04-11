/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.events.EventDispatcher;
	import flash.events.SampleDataEvent;
	import flash.events.StatusEvent;
	import flash.media.Microphone;
	import flash.media.SoundTransform;
	import flash.media.MicrophoneEnhancedOptions;
	import browser.Browser;

	import flash.utils.ByteArray;

	public final class Microphone extends EventDispatcher
	{
		private var _codec:String = SoundCodec.NELLYMOSER;

		public UNIMPLEMENTED static function getEnhancedMicrophone (index:int=-1) : flash.media.Microphone
		{
			throw new Error('Microphone: attempted call to an unimplemented function "getEnhancedMicrophone"');
		}

		public UNIMPLEMENTED static function get isSupported () : Boolean
		{
			throw new Error('Microphone: attempted call to an unimplemented function "isSupported"');
		}

		public UNIMPLEMENTED static function get names () : Array
		{
			throw new Error('Microphone: attempted call to an unimplemented function "names"');
		}

		public static function getMicrophone (index:int=-1) : flash.media.Microphone
		{
			var navigator:* = Browser.getWindow().navigator;
			navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

			var microphone = new Microphone();
			navigator.getUserMedia({ audio: true, video: false }, microphone.$__onStream, microphone.$__onError);

			return microphone;
		}

		public function Microphone()
		{
		}

		private function $__onStream(stream:*):void
		{
			var audioContext = Browser.getNewAudioContext();
			var audioInput = audioContext.createMediaStreamSource(stream);
			var bufferSize = 2048;

			var recorder = audioContext.createScriptProcessor(bufferSize, 1, 1);

			recorder.onaudioprocess = recorderProcess;
			audioInput.connect(recorder);

			recorder.connect(audioContext.destination);

			function recorderProcess(event:*):void
			{
				var left:* = event.inputBuffer.getChannelData(0);

				var byteArray:ByteArray = new ByteArray();
				byteArray.$__setArrayBuffer(left.buffer);

				dispatchEvent(new SampleDataEvent(SampleDataEvent.SAMPLE_DATA, false, false, 0, byteArray));
			}

			dispatchEvent(new StatusEvent(StatusEvent.STATUS, false, false, 'Microphone.Unmuted', ''));
		}

		private function $__onError():void
		{
			dispatchEvent(new StatusEvent(StatusEvent.STATUS, false, false, 'Microphone.Muted', ''));
		}

		public UNIMPLEMENTED function get activityLevel () : Number
		{
			throw new Error('Microphone: attempted call to an unimplemented function "activityLevel"');
		}

		public function get codec () : String
		{
			return _codec;
		}

		public UNIMPLEMENTED function set codec (codec:String) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "codec"');
		}

		public UNIMPLEMENTED function get enableVAD () : Boolean
		{
			throw new Error('Microphone: attempted call to an unimplemented function "enableVAD"');
		}

		public UNIMPLEMENTED function set enableVAD (enable:Boolean) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "enableVAD"');
		}

		public UNIMPLEMENTED function get encodeQuality () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "encodeQuality"');
		}

		public UNIMPLEMENTED function set encodeQuality (quality:int) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "encodeQuality"');
		}

		public UNIMPLEMENTED function get enhancedOptions () : flash.media.MicrophoneEnhancedOptions
		{
			throw new Error('Microphone: attempted call to an unimplemented function "enhancedOptions"');
		}

		public UNIMPLEMENTED function set enhancedOptions (options:MicrophoneEnhancedOptions) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "enhancedOptions"');
		}

		public UNIMPLEMENTED function get framesPerPacket () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "framesPerPacket"');
		}

		public UNIMPLEMENTED function set framesPerPacket (frames:int) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "framesPerPacket"');
		}

		public UNIMPLEMENTED function get gain () : Number
		{
			throw new Error('Microphone: attempted call to an unimplemented function "gain"');
		}

		public UNIMPLEMENTED function set gain (gain:Number) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "gain"');
		}

		public UNIMPLEMENTED function get index () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "index"');
		}

		public UNIMPLEMENTED function get muted () : Boolean
		{
			throw new Error('Microphone: attempted call to an unimplemented function "muted"');
		}

		public UNIMPLEMENTED function get name () : String
		{
			throw new Error('Microphone: attempted call to an unimplemented function "name"');
		}

		public UNIMPLEMENTED function get noiseSuppressionLevel () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "noiseSuppressionLevel"');
		}

		public UNIMPLEMENTED function set noiseSuppressionLevel (level:int) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "noiseSuppressionLevel"');
		}

		public UNIMPLEMENTED function get rate () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "rate"');
		}

		public function set rate (rate:int) : void
		{
			//throw new Error('Microphone: attempted call to an unimplemented function "rate"');
		}

		public UNIMPLEMENTED function get silenceLevel () : Number
		{
			throw new Error('Microphone: attempted call to an unimplemented function "silenceLevel"');
		}

		public UNIMPLEMENTED function get silenceTimeout () : int
		{
			throw new Error('Microphone: attempted call to an unimplemented function "silenceTimeout"');
		}

		public UNIMPLEMENTED function get soundTransform () : flash.media.SoundTransform
		{
			throw new Error('Microphone: attempted call to an unimplemented function "soundTransform"');
		}

		public UNIMPLEMENTED function set soundTransform (sndTransform:SoundTransform) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "soundTransform"');
		}

		public UNIMPLEMENTED function get useEchoSuppression () : Boolean
		{
			throw new Error('Microphone: attempted call to an unimplemented function "useEchoSuppression"');
		}

		public UNIMPLEMENTED function setLoopBack (state:Boolean=true) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "setLoopBack"');
		}

		public UNIMPLEMENTED function setSilenceLevel (silenceLevel:Number, timeout:int=-1) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "setSilenceLevel"');
		}

		public UNIMPLEMENTED function setUseEchoSuppression (useEchoSuppression:Boolean) : void
		{
			throw new Error('Microphone: attempted call to an unimplemented function "setUseEchoSuppression"');
		}

	}
}
