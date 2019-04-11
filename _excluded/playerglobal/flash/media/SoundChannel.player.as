/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.media.Sound;
	import flash.media.SoundTransform;
	
	import browser.Browser;

	import flash.utils.clearTimeout;

	import flash.utils.setTimeout;

	public final class SoundChannel extends EventDispatcher
	{
		protected var $__gainNode:Object;
		protected var $__audio:Object;
		protected var $__sound:Sound;
		public var $__source:Object;
		protected var $__sourceStartTime:Number = 0;
		protected var $__sourcePauseTime:Number = 0;
		protected var $__sourceOffsetTime:Number = 0;
		protected var $__loops:int = 0;

		protected var $__soundTransform:SoundTransform = new SoundTransform();
		protected var $_timeoutID:Number;

		public function SoundChannel()
		{
			super();
		}

		public function $_onEndedTimeout(event:*):void
		{
			if (!$__source) return;

			if (position < $__sound.length)
			{
				$_timeoutID = setTimeout($_onEndedTimeout, 500);
				return;
			}

			trace('soundChannel setTimeout ended');

			$_onEnded(null);
		}

		public function $_onEnded(event:*):void
		{
			trace('on ended called');

			if (!isNaN($_timeoutID)) clearTimeout($_timeoutID);
			if ($__source) $__source.removeEventListener('ended', $_onEnded); //Audio uses this method, too
			dispatchEvent(new Event(Event.SOUND_COMPLETE));
		}

		internal static function $__getNewSoundChannel(sound:Sound, startTime:Number, loops:int, sndTransform:SoundTransform):SoundChannel
		{				
			trace('getting new sound channel');

			var soundChannel:SoundChannel;
			var source:Object;
			if (sound.$__audioContext && !sound.$__base64String) //two different ways of playing audio... check if $__audioContext is null to determine which way we are using   also, data not supported for audioContext
			{		
				trace('new sound channel via audio context');
				
				soundChannel = (sound.$__soundChannel) ? sound.$__soundChannel : new SoundChannel();
				if (sndTransform) soundChannel.$__soundTransform = sndTransform;
				soundChannel.$__sound = sound;
				soundChannel.$__loops = loops;
				sound.$__soundChannel = soundChannel;
			
				if (soundChannel.$__source) 
				{
					trace('soundChannel.$__source exists');

					clearTimeout(soundChannel.$_timeoutID);
					soundChannel.$__source.removeEventListener('ended', soundChannel.$_onEnded);
					soundChannel.$__source.stop(0);
					soundChannel.$__gainNode.disconnect();
					soundChannel.$__source.disconnect();
				}

				var callback:Function = function():void
				{
					source = sound.$__audioContext.createBufferSource();
					source.buffer = sound.$__audioSourceBuffer;
					
					var gainNode:Object = soundChannel.$__gainNode = sound.$__audioContext.createGain();
					source.connect(gainNode);
					gainNode.connect(sound.$__audioContext.destination);
					gainNode.gain.value = soundChannel.$__soundTransform.volume;

					trace('sample rates: ' + sound.$__audioContext.sampleRate + ', ' + source.buffer.sampleRate);
					trace('duration: ' + source.buffer.duration);
					var time:Number = Math.max(0, Math.min(source.buffer.duration - .001, (startTime - 1) / 1000)); //subtract 1 millisecond due to ios bug. //attempting to play sound from start time >= duration, ios will throw an InvalidStateError
					trace('time: ' + time);
					trace('audio context current time: ' + sound.$__audioContext.currentTime);

					soundChannel.$__sourceStartTime = sound.$__audioContext.currentTime;
					soundChannel.$__sourceOffsetTime = time;
					soundChannel.$__sourcePauseTime = 0;

					soundChannel.$__source = source;
					soundChannel.$_timeoutID = setTimeout(soundChannel.$_onEndedTimeout, sound.length - startTime);
					source.addEventListener('ended', soundChannel.$_onEnded);

					source.start(0, time);
				}

				if (sound.$__waitForAudioSourceBuffer)
				{					
					sound.$__waitForAudioSourceBuffer = callback;
					return soundChannel;
				}	
				
				callback();
				
				return soundChannel;
			}
			
			trace('no AudioContext support. Using standard Audio');
		
			if (sound.$__soundChannel)
			{
				soundChannel = sound.$__soundChannel;
				if (sndTransform) soundChannel.$__soundTransform = sndTransform;
				soundChannel.$__audio.currentTime = startTime / 1000;
				
				soundChannel.$__audio.play();
				soundChannel.$__audio.volume = soundChannel.$__soundTransform.volume;
				return soundChannel;
			}
			
			if (startTime) trace('SoundChannel: startTime in sound.play is not supported on first call');
			
			soundChannel = new SoundChannel();
			if (sndTransform) soundChannel.$__soundTransform = sndTransform;
			sound.$__soundChannel = soundChannel;
			soundChannel.$__sound = sound;

			soundChannel.$__audio = Browser.getNewAudio();
			soundChannel.$__audio.src = (sound.$__base64String) ? sound.$__base64String : sound.url;
			
			soundChannel.$__audio.load();
			
			soundChannel.$__audio.addEventListener('ended', soundChannel.$_onEnded);
			
			soundChannel.$__audio.play();
			soundChannel.$__audio.volume = soundChannel.$__soundTransform.volume;
			
			return soundChannel;
		}

		public UNIMPLEMENTED function get leftPeak () : Number
		{
			throw new Error('SoundChannel: attempted call to an unimplemented function "leftPeak"');
		}

		public function get position () : Number
		{
			if ($__sound && $__sound.$__audioContext) 
			{
				var position:Number = (($__source) ? ($__sound.$__audioContext.currentTime + $__sourceOffsetTime) - $__sourceStartTime : $__sourcePauseTime) * 1000;
				return (position > $__sound.length) ? $__sound.length : position;
			}
			
			return ($__audio) ? $__audio.currentTime * 1000 : 0;
		}

		public UNIMPLEMENTED function get rightPeak () : Number
		{
			throw new Error('SoundChannel: attempted call to an unimplemented function "rightPeak"');
		}

		public function get soundTransform():flash.media.SoundTransform
		{
			return $__soundTransform;
		}

		public function set soundTransform(soundTransform:SoundTransform):void
		{
			$__soundTransform = soundTransform;
			
			if ($__sound && $__sound.$__audioContext)
			{
				$__gainNode.gain.value = soundTransform.volume;
				return;
			}
			
			if ($__audio) $__audio.volume = soundTransform.volume;
		}

		public function stop () : void
		{
			if ($__sound && $__sound.$__audioContext)
			{
				if ($__source)
				{
					clearTimeout($_timeoutID);
					$__source.removeEventListener('ended', $_onEnded);
					$__sourcePauseTime = position;
					$__source.stop(0);
					$__gainNode.disconnect();
					$__source.disconnect();
					$__source = null;
				}
				
				return;
			}
					
			if ($__audio) $__audio.pause();
		}

	}
}
