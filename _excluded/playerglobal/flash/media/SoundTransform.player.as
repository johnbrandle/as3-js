/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.media
{
	public final class SoundTransform 
	{
		private var $_volume:Number;
		private var $_panning:Number;
		
		public function SoundTransform (volume:Number=1, panning:Number=0)
		{
			$_volume = volume;
			$_panning = panning;
		}
		
		public UNIMPLEMENTED function get leftToLeft () : Number
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "leftToLeft"');
		}

		public UNIMPLEMENTED function set leftToLeft (leftToLeft:Number) : void
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "leftToLeft"');
		}

		public UNIMPLEMENTED function get leftToRight () : Number
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "leftToRight"');
		}

		public UNIMPLEMENTED function set leftToRight (leftToRight:Number) : void
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "leftToRight"');
		}

		public UNIMPLEMENTED function get pan () : Number
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "pan"');
		}

		public UNIMPLEMENTED function set pan (panning:Number) : void
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "pan"');
		}

		public UNIMPLEMENTED function get rightToLeft () : Number
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "rightToLeft"');
		}

		public UNIMPLEMENTED function set rightToLeft (rightToLeft:Number) : void
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "rightToLeft"');
		}

		public UNIMPLEMENTED function get rightToRight () : Number
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "rightToRight"');
		}

		public UNIMPLEMENTED function set rightToRight (rightToRight:Number) : void
		{
			throw new Error('SoundTransform: attempted call to an unimplemented function "rightToRight"');
		}

		public function get volume () : Number
		{
			return $_volume;
		}

		public function set volume (volume:Number) : void
		{
			$_volume = volume;
		}
	}
}
