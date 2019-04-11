/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.ProgressEvent;
	import flash.media.ID3Info;
	import flash.media.SoundChannel;
	import flash.media.SoundLoaderContext;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;
	
	import browser.Browser;
	

	public class Sound extends EventDispatcher
	{
		protected var $_xmlHttpRequest:Object;

		protected var $_stream:URLRequest;
		protected var $_bytesLoaded:uint = 0;
		protected var $_bytesTotal:int = 0;

		protected var $_duration:Number = 0;

		public var $__soundChannel:SoundChannel;  //need to do this to make startTime work in the play method of SoundChannel

		public var $__audioContext:Object;
		public var $__audioSourceBuffer:Object;

		public var $__base64String:String;
		public var $__waitForAudioSourceBuffer:* = false;

		public function Sound(stream:URLRequest = null, context:SoundLoaderContext = null)
		{
			super();

			if (stream) load(stream, context);
		}

		public function load(stream:URLRequest, context:SoundLoaderContext = null):void
		{
			if (!stream || !stream.url) throw new TypeError('stream or stream.url is null');
			if ($_xmlHttpRequest) throw new Error('Sound: load in progress');

			$_stream = stream;

			var onLoad:Function = function (event:Object):void
			{
				if (!$_xmlHttpRequest) return;

				trace('sound loaded');

				var arrayBuffer:Object = $_xmlHttpRequest.response;

				$_xmlHttpRequest.onprogress = null;
				$_xmlHttpRequest.onload = null;
				$_xmlHttpRequest = null;

				//old: may fix an unknown, hard to reproduce, firefox issue where sound sometimes goes away
				//update: see if this will fix an android issue where autoplay stops working.
				//using audio context for ios, so that we can control volume programmatically (hopefully we don't run into the audiocontext/skype issue we ran into before... if so, don't use audiocontext as that was a nightmare)
				//var userAgent:String = window.navigator.userAgent.toLowerCase();
				if (window.AudioContext !== undefined || window.webkitAudioContext !== undefined)// && (window.mobile && (userAgent.indexOf('android') != -1 || userAgent.indexOf('applewebkit') != -1)))
				{
					var audioContext:Object = Browser.getNewAudioContext();
					if (audioContext)
					{
						trace('audio context found');

						$__audioContext = audioContext;

						audioContext.decodeAudioData(arrayBuffer, onDecodeAudioDataSuccess, onDecodeAudioDataFailure);
						return;
					}
				}

				calculateDuration(arrayBuffer);

				dispatchEvent(new Event(Event.COMPLETE));
			}

			var onProgress:Function = function (event:Object):void
			{
				if (!event.lengthComputable) return;

				$_bytesLoaded = event.loaded;
				$_bytesTotal = event.total;
				dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, $_bytesLoaded, $_bytesTotal));
			}

			trace('loading sound');

			$_xmlHttpRequest = Browser.getNewXMLHttpRequest();
			$_xmlHttpRequest.onload = onLoad;
			$_xmlHttpRequest.onprogress = onProgress;
			$_xmlHttpRequest.open('GET', stream.url, true);
			$_xmlHttpRequest.responseType = 'arraybuffer';
			$_xmlHttpRequest.overrideMimeType('text/plain; charset=x-user-defined');
			$_xmlHttpRequest.send(null);
		}

		private function calculateDuration(arrayBuffer:Object):void
		{
			var bytes:Object = Browser.getNewUint8Array(arrayBuffer);
			var bytesOffset:int = 0;

			//handle possible id3 tag
			if (bytes[0] == 73 && bytes[1] == 68 && bytes[2] == 51)
			{
				if (bytes[3] != 3) throw new Error('invalid mp3 id3 major format, expected 3, got: ' + bytes[3]);

				bytesOffset = (bytes[6] * 2097152 + bytes[7] * 16384 + bytes[8] * 128 + bytes[9]) + 10;
			}

			var preFrameSyncBytesOffset:int = bytesOffset;
			var byte2:int = bytes[bytesOffset + 1];

			if (bytes[bytesOffset++] != 255) throw new Error('invalid mp3 format. please use cbr mp3s, only');

			var version:int = (bytes[bytesOffset] & 24) >> 3;
			var layer:int = (bytes[bytesOffset] & 6) >> 1;

			bytesOffset++;

			var bitrateIndex:int = bytes[bytesOffset] >> 4;
			var bitrateLookupTable:Array = [0, 0, 0, 0, 0,
				32, 32, 32, 32, 8,
				64, 48, 40, 48, 16,
				96, 56, 48, 56, 24,
				128, 64, 56, 64, 32,
				160, 80, 64, 80, 40,
				192, 96, 80, 96, 48,
				224, 112, 96, 112, 56,
				256, 128, 112, 128, 64,
				288, 160, 128, 144, 80,
				320, 192, 160, 160, 96,
				352, 224, 192, 176, 112,
				384, 256, 224, 192, 128,
				416, 320, 256, 224, 144,
				448, 384, 320, 256, 160,
				0, 0, 0, 0, 0];

			var row:int = (bitrateIndex * 5);
			var column:int;

			if (version == 3 && layer == 3) column = 0;
			else if (version == 3 && layer == 2) column = 1;
			else if (version == 3 && layer == 1) column = 2;
			else if ((version == 2 || version == 0) && layer == 3) column = 3;
			else if ((version == 2 || version == 0) && (layer == 2 || layer == 1)) column = 4;
			else throw new Error('invalid mp3 given');

			if (!bitrateLookupTable[row + column]) throw new Error('invalid mp3 given');

			var bitrate:int = bitrateLookupTable[row + column];

			var samplerateIndex:int = (bytes[bytesOffset] & 12) >> 2;
			var samplerateLookupTable:Array = [44100, 22050, 11025,
				48000, 24000, 12000,
				32000, 16000, 8000,
				0, 0, 0];

			row = (samplerateIndex * 3);

			if (version == 3) column = 0;
			else if (version == 2) column = 1;
			else if (version == 0) column = 2;
			else throw new Error('invalid mp3 given');

			if (!samplerateLookupTable[row + column]) throw new Error('invalid mp3 given');

			var samplerate:int = samplerateLookupTable[row + column];

			var framesamplesLookupTable:Array = [0, 576, 1152, 384,
				0, 0, 0, 0,
				0, 576, 1152, 384,
				0, 1152, 1152, 384];
			var framesamples:int = framesamplesLookupTable[(version * 4) + layer];

			var slotSizeLookupTable:Array = [0, 1, 1, 4];

			var baseFrameSize:int = Math.floor((((framesamples / 8) * (bitrate * 1000)) / samplerate));

			bytesOffset = preFrameSyncBytesOffset;
			var byteOffset:int = bytesOffset;

			var frames:int = 0;
			while (bytes[byteOffset] == 255 && bytes[byteOffset + 1] == byte2)
			{
				frames++;

				var pad:int = (bytes[byteOffset + 2] & 2) >> 1;
				var frameSize:int = baseFrameSize + ((pad) ? slotSizeLookupTable[layer] : 0);
				byteOffset += frameSize;
			}

			$_duration = ((framesamples / samplerate) * 1000) * (frames - 1);
			trace('reported audio duration: ' + $_duration);
		}

		private function onDecodeAudioDataSuccess(buffer:*):void
		{
			trace('audio context decode data success');

			$__audioSourceBuffer = buffer;
			$_duration = buffer.duration * 1000;

			dispatchEvent(new Event(Event.COMPLETE));
		}

		private function onDecodeAudioDataFailure(error:*):void
		{
			trace("error (decodeAudioData): " + error);

			$__audioContext = null;

			dispatchEvent(new Event(Event.COMPLETE));
		}

		public function play(startTime:Number = 0, loops:int = 0, sndTransform:SoundTransform = null):flash.media.SoundChannel
		{
			//if (!$_stream && !$__base64String && !$__waitForAudioSourceBuffer) throw new Error('cannot play Sound instance, invalid stream url');
			if (!$_duration) throw new Error('Sound not loaded');

			return SoundChannel.$__getNewSoundChannel(this, startTime, loops, sndTransform);
		}

		public function get bytesLoaded():uint
		{
			return $_bytesLoaded;
		}

		public function get bytesTotal():int
		{
			return $_bytesTotal;
		}
		
		public function get url():String
		{
			return $_stream.url;
		}

		public UNIMPLEMENTED function get id3 () : flash.media.ID3Info
		{
			throw new Error('Sound: attempted call to an unimplemented function "id3"');
		}

		public UNIMPLEMENTED function get isBuffering () : Boolean
		{
			throw new Error('Sound: attempted call to an unimplemented function "isBuffering"');
		}

		public UNIMPLEMENTED function get isURLInaccessible () : Boolean
		{
			throw new Error('Sound: attempted call to an unimplemented function "isURLInaccessible"');
		}

		public function get length():Number
		{
			return $_duration;
		}

		public function close () : void
		{
			var soundChannel:SoundChannel = $__soundChannel;
			
			if (soundChannel) soundChannel.stop();
			
			$__audioContext = null;
		}

		public UNIMPLEMENTED function extract (target:ByteArray, length:Number, startPosition:Number=-1) : Number
		{
			throw new Error('Sound: attempted call to an unimplemented function "extract"');
		}

		public function loadCompressedDataFromByteArray (byteArray:ByteArray, bytesLength:uint):void
		{
			var arrayBuffer:Object = byteArray.$__getArrayBuffer();
			
			if (window.AudioContext !== undefined || window.webkitAudioContext !== undefined) //(window.chrome) //https://bugs.chromium.org/p/chromium/issues/detail?id=544988
			{
				var audioContext:Object = Browser.getNewAudioContext();
				if (audioContext)
				{
					$__waitForAudioSourceBuffer = true;
					$__audioContext = audioContext;

					audioContext.decodeAudioData(arrayBuffer, function (buffer:*):void
					{
						$__audioSourceBuffer = buffer;
						$_duration = buffer.duration * 1000;

						var callback:Function;
						if ($__waitForAudioSourceBuffer is Function) callback = $__waitForAudioSourceBuffer;
						$__waitForAudioSourceBuffer = false;

						if (callback !== null) callback();
					}, function (error:*):void { trace("error decoding Audio Data: " + error); });

					return;
				}
			}

			calculateDuration(arrayBuffer);

			//does not appear to play right away in ios (and maybe other browsers) //try using the same method we are using for chrome (even though it may not be synchronous if play is called right after
			var bytes:Object = Browser.getNewUint8Array(arrayBuffer);
			
			var binary:String = '';
			var length:Number = bytes.byteLength;
			
			if (length != bytesLength) throw new Error('Sound: loadCompressedDataFromByteArray does not support a bytesLength value that differs from the ByteArray length at this time'); 
			
			for (var i:int = 0; i < length; i++) binary += String.fromCharCode(bytes[i]);
			
			$__base64String = 'data:audio/mp3;base64,' + window.btoa(binary);
		}

		public UNIMPLEMENTED function loadPCMFromByteArray (bytes:ByteArray, samples:uint, format:String="float", stereo:Boolean=true, sampleRate:Number=44100) : void
		{
			throw new Error('Sound: attempted call to an unimplemented function "loadPCMFromByteArray"');
		}
	}
}
