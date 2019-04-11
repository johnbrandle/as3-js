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

	public class Rectangle 
	{
		public var height : Number;
		public var width : Number;
		public var x : Number;
		public var y : Number;

		public function get bottom () : Number
		{
			return y + height;
		}

		public function set bottom (value:Number) : void
		{
			height = Math.max(value - y, 0);
		}

		public function get bottomRight () : flash.geom.Point
		{
			return new Point(right, bottom);
		}

		public function set bottomRight (value:Point) : void
		{
			right = value.x;
			bottom = value.y;
		}

		public function get left () : Number
		{
			return x;
		}

		public function set left (value:Number) : void
		{
			width += x - value; // TODO: really change width?
			x = value;
		}

		public function get right () : Number
		{
			return x + width;
		}

		public function set right (value:Number) : void
		{
			width = value - x;
		}

		public function get size () : flash.geom.Point
		{
			return new Point(width, height);
		}

		public function set size (value:Point) : void
		{
			this.width = value.x;
			this.height = value.y;
		}

		public function get top () : Number
		{
			return y;
		}

		public function set top (value:Number) : void
		{
			height += y - value;
			y = value;
		}

		public function get topLeft () : flash.geom.Point
		{
			return new Point(x, y);
		}

		public function set topLeft (value:Point) : void
		{
			left = value.x;
			top = value.y;
		}

		public function clone () : flash.geom.Rectangle
		{
			return new Rectangle(x, y, width, height);
		}

		public function contains (x:Number, y:Number) : Boolean
		{
			return this.x <= x && x <= this.right && this.y <= y && y <= this.bottom;
		}

		public function containsPoint (point:Point) : Boolean
		{
			return contains(point.x, point.y);
		}

		public function containsRect (rect:Rectangle) : Boolean
		{
			return containsPoint(rect.topLeft) && containsPoint(rect.bottomRight);
		}

		public UNIMPLEMENTED function copyFrom (sourceRect:Rectangle) : void
		{
			throw new Error('Rectangle: attempted call to an unimplemented function "copyFrom"');
		}

		public function equals (toCompare:Rectangle) : Boolean
		{
			return x == toCompare.x && y == toCompare.y && width == toCompare.width && height == toCompare.height;
		}

		public function inflate (dx:Number, dy:Number) : void
		{
			this.x -= dx;
			this.y -= dy;
			this.width += (dx * 2);
			this.height += (dy * 2);
		}

		public function inflatePoint (point:Point) : void
		{
			inflate(point.x, point.y);
		}

		public function intersection (toIntersect:Rectangle) : flash.geom.Rectangle
		{
			var x:Number = Math.max(this.x, toIntersect.x);
			var right:Number = Math.min(this.right, toIntersect.right);
			if (x <= right)
			{
				var y:Number = Math.max(this.y, toIntersect.y);
				var bottom:Number = Math.min(this.bottom, toIntersect.bottom);
				if (y <= bottom)
				{
					return new Rectangle(x, y, right - x, bottom - y);
				}
			}
			return new Rectangle();
		}

		public function intersects (toIntersect:Rectangle) : Boolean
		{
			return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)&& Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
		}

		public function isEmpty () : Boolean
		{
			return x == 0 && y == 0 && width == 0 && height == 0;
		}

		public function offset (dx:Number, dy:Number) : void
		{
			x += dx;
			y += dy;
		}

		public function offsetPoint (point:Point) : void
		{
			offset(point.x, point.y);
		}

		public function Rectangle (x:Number=0, y:Number=0, width:Number=0, height:Number=0)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

		public function setEmpty () : void
		{
			this.x = this.y = this.width = this.height = 0;
		}

		public UNIMPLEMENTED function setTo (xa:Number, ya:Number, widtha:Number, heighta:Number) : void
		{
			throw new Error('Rectangle: attempted call to an unimplemented function "setTo"');
		}

		public function toString () : String
		{
			return '(x=' + x + ', y=' + y + ', w=' + width + ', h=' + height + ')';
		}

		public function union (toUnion:Rectangle) : flash.geom.Rectangle
		{
			if (toUnion.width === 0 || toUnion.height === 0) 
			{
				return clone();
			}
			if (width === 0 || height === 0) 
			{
				return toUnion.clone();
			}
			var x : Number = Math.min(this.x, toUnion.x);
			var y : Number = Math.min(this.y, toUnion.y);
			return new Rectangle(x, y, Math.max(this.right,toUnion.right)-x, Math.max(this.bottom,toUnion.bottom)-y);
		}
	}
}
