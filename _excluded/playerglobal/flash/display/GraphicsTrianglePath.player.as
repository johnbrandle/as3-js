/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final UNIMPLEMENTED class GraphicsTrianglePath  implements IGraphicsPath, IGraphicsData
	{
		public var indices : Vector.<int>;
		public var uvtData : Vector.<Number>;
		public var vertices : Vector.<Number>;

		public function get culling () : String
		{
			throw new Error('GraphicsTrianglePath: attempted call to an unimplemented function "culling"');
		}

		public function set culling (value:String) : void
		{
			throw new Error('GraphicsTrianglePath: attempted call to an unimplemented function "culling"');
		}

		public function GraphicsTrianglePath (vertices:Vector.<Number>=null, indices:Vector.<int>=null, uvtData:Vector.<Number>=null, culling:String="none")
		{
			throw new Error('GraphicsTrianglePath: attempted call to an unimplemented constructor');
		}

	}
}
