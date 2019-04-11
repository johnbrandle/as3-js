/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.filters
{
	import flash.filters.BitmapFilter;

	public final UNIMPLEMENTED class BlurFilter extends BitmapFilter
	{
		public function get blurX () : Number
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "blurX"');
		}

		public function set blurX (value:Number) : void
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "blurX"');
		}

		public function get blurY () : Number
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "blurY"');
		}

		public function set blurY (value:Number) : void
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "blurY"');
		}

		public function get quality () : int
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "quality"');
		}

		public function set quality (value:int) : void
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "quality"');
		}

		public function BlurFilter (blurX:Number=4, blurY:Number=4, quality:int=1)
		{
			throw new Error('BlurFilter: attempted call to an unimplemented constructor');
		}

		public function clone () : flash.filters.BitmapFilter
		{
			throw new Error('BlurFilter: attempted call to an unimplemented function "clone"');
		}

	}
}
