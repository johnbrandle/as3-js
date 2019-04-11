/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.filters
{
	import flash.filters.BitmapFilter;

	public final UNIMPLEMENTED class ColorMatrixFilter extends BitmapFilter
	{
		public function get matrix () : Array
		{
			throw new Error('ColorMatrixFilter: attempted call to an unimplemented function "matrix"');
		}

		public function set matrix (value:Array) : void
		{
			throw new Error('ColorMatrixFilter: attempted call to an unimplemented function "matrix"');
		}

		public function clone () : flash.filters.BitmapFilter
		{
			throw new Error('ColorMatrixFilter: attempted call to an unimplemented function "clone"');
		}

		public function ColorMatrixFilter (matrix:Array=null)
		{
			throw new Error('ColorMatrixFilter: attempted call to an unimplemented constructor');
		}
	}
}
