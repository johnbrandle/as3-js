/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final UNIMPLEMENTED class GraphicsSolidFill  implements IGraphicsFill, IGraphicsData
	{
		public var alpha : Number;
		public var color : uint;

		public function GraphicsSolidFill (color:uint=0, alpha:Number=1)
		{
			throw new Error('GraphicsSolidFill: attempted call to an unimplemented constructor');
		}
	}
}
