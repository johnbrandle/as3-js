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
	public class Point 
	{
		private var _x : Number;
		private var _y : Number;

		public function get y():Number
		{
			return _y;
		}
		
		public function get x():Number
		{
			return _x;
		}
		
		public function set y(y:Number):void
		{
			_y = y;
		}
		
		public function set x(x:Number):void
		{
			_x = x;
		}
		
		public function get length () : Number
		{
			return diagonalLength(_x, _y);
		}
		
		private static function diagonalLength(x:Number, y:Number):Number 
		{
			return x === 0 ? Math.abs(y) : y === 0 ? Math.abs(x) : Math.sqrt(x * x + y * y);
		}

		public function add (v:Point) : flash.geom.Point
		{
			return new Point(_x+v.x, _y+v.y);
		}

		public function clone () : flash.geom.Point
		{
			return new Point(_x, _y);
		}

		public UNIMPLEMENTED function copyFrom (sourcePoint:Point) : void
		{
			throw new Error('Point: attempted call to an unimplemented function "copyFrom"');
		}

		public static function distance (pt1:Point, pt2:Point) : Number
		{
			return diagonalLength(pt2.x - pt1.x, pt2.y - pt1.y);
		}

		public function equals (toCompare:Point) : Boolean
		{
			return _x == toCompare.x && _y == toCompare.y;
		}

		public static function interpolate (pt1:Point, pt2:Point, f:Number) : flash.geom.Point
		{
			return new Point(pt1.x * f + pt2.x * (1 - f), pt1.y * f + pt2.y * (1 - f));
		}

		public function normalize (thickness:Number) : void
		{
			if (_x !== 0 || _y !== 0) 
			{
				var relativeThickness:Number = thickness / length;
				_x *= relativeThickness;
				_y *= relativeThickness;
			}
		}

		public function offset (dx:Number, dy:Number) : void
		{
			_x += dx;
			_y += dy;
		}

		public function Point (x:Number=0, y:Number=0)
		{
			_x = x;
			_y = y;
		}

		public static function polar (len:Number, angle:Number) : flash.geom.Point
		{
			return new Point(len * Math.cos(angle), len * Math.sin(angle));
		}

		public function setTo (xa:Number, ya:Number) : void
		{
			_x = xa;
			_y = ya;
		}

		public function subtract (v:Point) : flash.geom.Point
		{
			return new Point(_x - v.x, _y - v.y);
		}

		public function toString () : String
		{
			return ["(x=",_x,", y=",_y,")"].join("");
		}

	}
}
