/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	public UNIMPLEMENTED class Vector3D 
	{
		public var w : Number;
		public var x : Number;

		public static const X_AXIS : flash.geom.Vector3D;

		public var y : Number;

		public static const Y_AXIS : flash.geom.Vector3D;

		public var z : Number;

		public static const Z_AXIS : flash.geom.Vector3D;

		public function get length () : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "length"');
		}

		public function get lengthSquared () : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "lengthSquared"');
		}

		public function add (a:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "add"');
		}

		public static function angleBetween (a:Vector3D, b:Vector3D) : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "angleBetween"');
		}

		public function clone () : flash.geom.Vector3D
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "clone"');
		}

		public function copyFrom (sourceVector3D:Vector3D) : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "copyFrom"');
		}

		public function crossProduct (a:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "crossProduct"');
		}

		public function decrementBy (a:Vector3D) : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "decrementBy"');
		}

		public static function distance (pt1:Vector3D, pt2:Vector3D) : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "distance"');
		}

		public function dotProduct (a:Vector3D) : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "dotProduct"');
		}

		public function equals (toCompare:Vector3D, allFour:Boolean=false) : Boolean
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "equals"');
		}

		public function incrementBy (a:Vector3D) : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "incrementBy"');
		}

		public function nearEquals (toCompare:Vector3D, tolerance:Number, allFour:Boolean=false) : Boolean
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "nearEquals"');
		}

		public function negate () : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "negate"');
		}

		public function normalize () : Number
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "normalize"');
		}

		public function project () : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "project"');
		}

		public function scaleBy (s:Number) : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "scaleBy"');
		}

		public function setTo (xa:Number, ya:Number, za:Number) : void
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "setTo"');
		}

		public function subtract (a:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "subtract"');
		}

		public function toString () : String
		{
			throw new Error('Vector3D: attempted call to an unimplemented function "toString"');
		}

		public function Vector3D (x:Number=0, y:Number=0, z:Number=0, w:Number=0)
		{
			throw new Error('Vector3D: attempted call to an unimplemented constructor');
		}

	}
}
