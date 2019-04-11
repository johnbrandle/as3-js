/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.accessibility
{
	import flash.geom.Rectangle;

	public UNIMPLEMENTED class AccessibilityImplementation 
	{
		public var errno : uint;

		public var stub : Boolean;

		public function accDoDefaultAction (childID:uint) : void
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "accDoDefaultAction"');
		}

		public function AccessibilityImplementation ()
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented constructor');
		}

		public function accLocation (childID:uint) : *
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "accLocation"');
		}

		public function accSelect (operation:uint, childID:uint) : void
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "accSelect"');
		}

		public function get_accDefaultAction (childID:uint) : String
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accDefaultAction"');
		}

		public function get_accFocus () : uint
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accFocus"');
		}

		public function get_accName (childID:uint) : String
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accName"');
		}

		public function get_accRole (childID:uint) : uint
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accRole"');
		}

		public function get_accSelection () : Array
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accSelection"');
		}

		public function get_accState (childID:uint) : uint
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accState"');
		}

		public function get_accValue (childID:uint) : String
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "get_accValue"');
		}

		public function getChildIDArray () : Array
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "getChildIDArray"');
		}

		public function isLabeledBy (labelBounds:Rectangle) : Boolean
		{
			throw new Error('AccessibilityImplementation: attempted call to an unimplemented function "isLabeledBy"');
		}
	}
}
