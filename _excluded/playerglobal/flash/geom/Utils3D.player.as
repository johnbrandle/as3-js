/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	import flash.geom.Vector3D;
	import flash.geom.Matrix3D;

	public UNIMPLEMENTED class Utils3D 
	{
		public static function pointTowards (percent:Number, mat:Matrix3D, pos:Vector3D, at:Vector3D=null, up:Vector3D=null) : flash.geom.Matrix3D
		{
			throw new Error('Utils3D: attempted call to an unimplemented function "pointTowards"');
		}

		public static function projectVector (m:Matrix3D, v:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Utils3D: attempted call to an unimplemented function "projectVector"');
		}

		public static function projectVectors (m:Matrix3D, verts:Vector.<Number>, projectedVerts:Vector.<Number>, uvts:Vector.<Number>) : void
		{
			throw new Error('Utils3D: attempted call to an unimplemented function "projectVectors"');
		}

		public function Utils3D ()
		{
			throw new Error('Utils3D: attempted call to an unimplemented constructor');
		}

	}
}
