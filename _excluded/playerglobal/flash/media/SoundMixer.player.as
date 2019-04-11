/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	import flash.utils.ByteArray;
	import flash.media.SoundTransform;

	public final UNIMPLEMENTED class SoundMixer 
	{
		public static function get audioPlaybackMode () : String
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "audioPlaybackMode"');
		}

		public static function set audioPlaybackMode (value:String) : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "audioPlaybackMode"');
		}

		public static function get bufferTime () : int
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "bufferTime"');
		}

		public static function set bufferTime (bufferTime:int) : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "bufferTime"');
		}

		public static function get soundTransform () : flash.media.SoundTransform
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "soundTransform"');
		}

		public static function set soundTransform (sndTransform:SoundTransform) : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "soundTransform"');
		}

		public static function get useSpeakerphoneForVoice () : Boolean
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "useSpeakerphoneForVoice"');
		}

		public static function set useSpeakerphoneForVoice (value:Boolean) : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "useSpeakerphoneForVoice"');
		}

		public static function areSoundsInaccessible () : Boolean
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "areSoundsInaccessible"');
		}

		public static function computeSpectrum (outputArray:ByteArray, FFTMode:Boolean=false, stretchFactor:int=0) : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "computeSpectrum"');
		}

		public function SoundMixer ()
		{
			throw new Error('SoundMixer: attempted call to an unimplemented constructor');
		}

		public static function stopAll () : void
		{
			throw new Error('SoundMixer: attempted call to an unimplemented function "stopAll"');
		}

	}
}
