/**
 * Copyright (c) 2008-2014 CoreMedia AG, Hamburg. Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this software except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */

/**
 * NOTICE: FILE HAS BEEN CHANGED FROM ORIGINAL
 *
 * @contributor	 John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	import flash.geom.Point;
	import flash.geom.Vector3D;

	public class Matrix 
	{
		
		public static const MAGIC_GRADIENT_FACTOR:Number = 16384 / 10;
		
		public var a : Number;
		public var b : Number;
		public var c : Number;
		public var d : Number;
		public var tx : Number;
		public var ty : Number;

		public function Matrix (a:Number=1, b:Number=0, c:Number=0, d:Number=1, tx:Number=0, ty:Number=0)
		{
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;
		}

		public function clone () : flash.geom.Matrix
		{
			return new Matrix(a, b, c, d, tx, ty);
		}

		public function concat (m:Matrix) : void
		{
			var a : Number = this.a;
			var b : Number = this.b;
			var c : Number = this.c;
			var d : Number = this.d;
			var tx : Number = this.tx;
			var ty : Number = this.ty;
			this.a  = m.a*a  + m.c*b;
			this.b  = m.b*a  + m.d*b;
			this.c  = m.a*c  + m.c*d;
			this.d  = m.b*c  + m.d*d;
			this.tx = m.a*tx + m.c*ty + m.tx;
			this.ty = m.b*tx + m.d*ty+m.ty;
		}

		public UNIMPLEMENTED function copyColumnFrom (column:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix: attempted call to an unimplemented function "copyColumnFrom"');
		}

		public UNIMPLEMENTED function copyColumnTo (column:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix: attempted call to an unimplemented function "copyColumnTo"');
		}

		public UNIMPLEMENTED function copyFrom (sourceMatrix:Matrix) : void
		{
			throw new Error('Matrix: attempted call to an unimplemented function "copyFrom"');
		}

		public UNIMPLEMENTED function copyRowFrom (row:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix: attempted call to an unimplemented function "copyRowFrom"');
		}

		public UNIMPLEMENTED function copyRowTo (row:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix: attempted call to an unimplemented function "copyRowTo"');
		}

		public function createBox (scaleX:Number, scaleY:Number, rotation:Number=0, tx:Number=0, ty:Number=0) : void
		{
			// all inlined for higher performance:
			if (rotation === 0) {
				a = d = 1;
				b = c = 0;
			} else {
				a = Math.cos(rotation);
				b = Math.sin(rotation);
				c = -b;
				d = a;
			}
			if (scaleX !== 1) {
				a *= scaleX;
				c *= scaleX;
			}
			if (scaleY !== 1) {
				b *= scaleY;
				d *= scaleY;
			}
			this.tx = tx;
			this.ty = ty;
		}

		public function createGradientBox (width:Number, height:Number, rotation:Number=0, tx:Number=0, ty:Number=0) : void
		{
			this.createBox(width/MAGIC_GRADIENT_FACTOR, height/MAGIC_GRADIENT_FACTOR, rotation, tx + width/2, ty + height/2);
		}

		public function deltaTransformPoint (point:Point) : flash.geom.Point
		{
			return new Point(a*point.x + c*point.y, b*point.x + d*point.y);
		}

		public function $__deltaTransformPoint(x:Number, y:Number) : Array
		{
			return [a*x + c*y, b*x + d*y];
		}

		public function identity () : void
		{
			a = d = 1;
			b = c = tx = ty = 0;
		}
		
		public function invert () : void
		{
			var a : Number = this.a;
			var b : Number = this.b;
			var c : Number = this.c;
			var d : Number = this.d;
			var tx : Number = this.tx;
			var ty : Number = this.ty;
			// Cremer's rule: inverse = adjugate / determinant
			// A-1 = adj(A) / det(A)
			var det : Number = a*d - c*b;
			//     [a11 a12 a13]
			// A = [a21 a22 a23]
			//     [a31 a32 a33]
			// according to http://de.wikipedia.org/wiki/Inverse_Matrix#Formel_f.C3.BCr_3x3-Matrizen (sorry, German):
			//          [a22*a33-a32*a23 a13*a32-a12*a33 a12*a23-a13*a22]
			// adj(A) = [a23*a31-a21*a33 a11*a33-a13*a31 a13*a21-a11*a23]
			//          [a21*a32-a22*a31 a12*a31-a11*a32 a11*a22-a12*a21]
			// with a11 = a, a12 = c, a13 = tx,
			//      a21 = b, a22 = d, a23 = ty,
			//      a31 = 0, a32 = 0, a33 = 1:
			//          [d *1-0*ty  tx*0-c *1  c *ty-tx*d ]
			// adj(A) = [ty*0-b* 1  a *1-tx*0  tx* b-a *ty]
			//          [b *0-d* 0  c *0-a *0  a * d-c *b ]
			//          [ d -c  c*ty-tx*d]
			//        = [-b  a  tx*b-a*ty]
			//          [ 0  0  a*d -c*b ]
			this.a = d/det;
			this.b = -b/det;
			this.c = -c/det;
			this.d = a/det;
			//this.tx = (c*ty-tx*d)/det;
			//this.ty = (tx*b-a*ty)/det;
			// Dart version:
			this.tx = - (this.a * tx + this.c * ty);
			this.ty = - (this.b * tx + this.d * ty);
		}

		public function rotate (angle:Number) : void
		{
			/*
				with sin = sin(angle) and cos = cos(angle):

							  [a            c            tx           ]
							  [b            d            ty           ]
							  [0            0            1            ]

			  [cos   -sin  0] [a*cos-b*sin  c*cos-d*sin  tx*cos-ty*sin]
			  [sin   cos   0] [a*sin+b*cos  c*sin+d*cos  tx*sin+ty*cos]
			  [0     0     1] [0            0            1            ]
			*/
			if (angle != 0)
			{
				var cos : Number = Math.cos(angle);
				var sin : Number = Math.sin(angle);
				var a : Number = this.a;
				var b : Number = this.b;
				var c : Number = this.c;
				var d : Number = this.d;
				var tx : Number = this.tx;
				var ty : Number = this.ty;
				this.a   = a*cos  - b*sin;
				this.b   = a*sin  + b*cos;
				this.c   = c*cos  - d*sin;
				this.d   = c*sin  + d*cos;
				this.tx  = tx*cos - ty*sin;
				this.ty  = tx*sin + ty*cos;
			}
		}
		
		//don't modify tx, ty
		public function $__rotate (angle:Number) : void
		{
			/*
			with sin = sin(angle) and cos = cos(angle):
			
			[a            c            tx           ]
			[b            d            ty           ]
			[0            0            1            ]
			
			[cos   -sin  0] [a*cos-b*sin  c*cos-d*sin  tx*cos-ty*sin]
			[sin   cos   0] [a*sin+b*cos  c*sin+d*cos  tx*sin+ty*cos]
			[0     0     1] [0            0            1            ]
			*/
			if (angle != 0)
			{
				var cos : Number = Math.cos(angle);
				var sin : Number = Math.sin(angle);
				var a : Number = this.a;
				var b : Number = this.b;
				var c : Number = this.c;
				var d : Number = this.d;
				this.a   = a*cos  - b*sin;
				this.b   = a*sin  + b*cos;
				this.c   = c*cos  - d*sin;
				this.d   = c*sin  + d*cos;
			}
		}

		public function scale (sx:Number, sy:Number) : void
		{
			/*
						  [a     c    tx   ]
						  [b     d    ty   ]
						  [0     0    1    ]

			[sx    0     0] [a*sx  c*sx tx*sx]
			[0     sy    0] [b*sy  d*sy ty*sy]
			[0     0     1] [0     0    1    ]
			*/
			if (sx !== 1)
			{
				a *= sx;
				c *= sx;
				tx *= sx;
			}
			if (sy !== 1)
			{
				b *= sy;
				d *= sy;
				ty *= sy;
			}
		}
		
		//don't scale ty, or tx
		public function $__scale (sx:Number, sy:Number) : void
		{
			/*
			[a     c    tx   ]
			[b     d    ty   ]
			[0     0    1    ]
			
			[sx    0     0] [a*sx  c*sx tx*sx]
			[0     sy    0] [b*sy  d*sy ty*sy]
			[0     0     1] [0     0    1    ]
			*/
			if (sx !== 1)
			{
				a *= sx;
				c *= sx;
			}
			if (sy !== 1)
			{
				b *= sy;
				d *= sy;
			}
		}

		public function setTo (aa:Number, ba:Number, ca:Number, da:Number, txa:Number, tya:Number) : void
		{
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;
		}

		public function toString () : String
		{
			return "("+["a="+a,"b="+b,"c="+c,"d="+d,"tx="+tx,"ty="+ty].join(", ")+")";
		}

		public function transformPoint (point:Point) : flash.geom.Point
		{
			return new Point(a * point.x + c * point.y + tx, b * point.x + d * point.y + ty);
		}

		public function $__transformPoint(x:Number, y:Number):Array
		{
			return [a * x + c * y + tx, b * x + d * y + ty];
		}

		public function translate (dx:Number, dy:Number) : void
		{
			/*
							  [a     c    tx   ]
							  [b     d    ty   ]
							  [0     0    1    ]
			  
			  [1     0   dx]  [a     c    tx+dx]
			  [0     1   dy]  [b     d    ty+dy]
			  [0     0    1]  [0     0    1    ]
			*/
			tx += dx;
			ty += dy;
		}

	}
}
