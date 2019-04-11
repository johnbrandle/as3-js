/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.accessibility
{
	import flash.display.DisplayObject;

	public class AccessibilityProperties 
	{
		private var $_description:String = '';

		public var forceSimple:Boolean;

		private var $_name:String = '';

		public var noAutoLabeling:Boolean;

		public var shortcut:String = '';

		public var silent:Boolean;
		
		private var $_owner:DisplayObject;

		public function AccessibilityProperties()
		{
		}
		
		public function get name():String
		{
			return $_name;
		}
		
		public function set name(name:String):void
		{
			$_name = name;
			
			if ($_owner) 
			{
				var scope:Object = $_owner.$__properties().DisplayObjectScope;
				
				scope.$_domView.setAttribute('title', name);
			}
		}
		
		public function get description():String
		{
			return $_description;
		}
		
		public function set description(description:String):void
		{
			$_description = description;
			
			if ($_owner) 
			{
				var scope:Object = $_owner.$__properties().DisplayObjectScope;
				
				scope.$_domView.setAttribute('data-description', description);
			}
		}
		
		public function $_setOwner(owner:DisplayObject):void
		{
			$_owner = owner;
			
			$_applyProperties($_owner.$__properties().DisplayObjectScope.$_domView);
		}
		
		public function $_applyProperties(object:Object):void
		{
			object.setAttribute('title', $_name);
			object.setAttribute('data-description', $_description);	
		}
	}
}
