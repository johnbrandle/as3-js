/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.Graphics;

	public class Shape extends DisplayObject
	{
		private var $_properties:*;
	
		public function Shape()
		{
			if ($_properties === undefined) $__properties({});

			super();
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.ShapeScope = {};
				
				return $_properties = object;
			}
			
			return $_properties;
		}
	
		public function get graphics():flash.display.Graphics
		{
			return ($_properties.ShapeScope.$_graphics) ? $_properties.ShapeScope.$_graphics : $_properties.ShapeScope.$_graphics = new Graphics(this);
		}
	}
}
