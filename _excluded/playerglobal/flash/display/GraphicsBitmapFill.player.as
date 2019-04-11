/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.BitmapData;
	import flash.geom.Matrix;

	public final UNIMPLEMENTED class GraphicsBitmapFill  implements IGraphicsFill, IGraphicsData
	{
		public var bitmapData : flash.display.BitmapData;
		public var matrix : flash.geom.Matrix;
		public var repeat : Boolean;
		public var smooth : Boolean;

		public function GraphicsBitmapFill (bitmapData:BitmapData=null, matrix:Matrix=null, repeat:Boolean=true, smooth:Boolean=false)
		{
			throw new Error('GraphicsBitmapFill: attempted call to an unimplemented constructor');
		}
	}
}
