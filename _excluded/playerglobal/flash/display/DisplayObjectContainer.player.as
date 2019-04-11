/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.events.Event;
	import flash.geom.Point;
	import flash.text.TextSnapshot;

	public class DisplayObjectContainer extends InteractiveObject
	{
		private var $_properties:*;
		
		public function DisplayObjectContainer()
		{
			if ($_properties === undefined) $__properties({});
		
			super();
		}
		
		internal override function $__addDomGraphicsView(domGraphicsView:Object):Object
		{
			var properties:* = $_properties.DisplayObjectScope;
			var domView:* = properties.$_domView;
			if (domView.childElementCount) domView.insertBefore(domGraphicsView, domView.childNodes[0]);
			else domView.appendChild(domGraphicsView);
		
			return properties.$_domGraphicsView = domGraphicsView;
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.DisplayObjectContainerScope = {$_children:[], $_mouseChildren:true, $_internalAddChildAt:$_internalAddChildAt, $_internalRemoveChild:$_internalRemoveChild};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public override function $__notify(name:String, args:*):void
		{
			var children:Array = $_properties.DisplayObjectContainerScope.$_children;
			for (var i:int = children.length; i--;) children[i].$__notify(name, args);
			
			super.$__notify(name, args);
		}
		
		private static function $_internalAddChildAt(displayObjectContainer:DisplayObjectContainer, child:DisplayObject, index:int, dispatchEvents:Boolean=true):DisplayObject
		{
			if (child === null) throw new Error('attempting to add null child to display list');
			
			var childProperties:* = child.$__properties();
			var properties:* = displayObjectContainer.$__properties();
			var children:Array = properties.DisplayObjectContainerScope.$_children;
			var originalIndex:int = children.indexOf(child);
			var childWasOnStage:Boolean = childProperties.TLScope.stage != null;
			var hasChild:Boolean = originalIndex != -1;
			var parent:*;
			if (hasChild)
			{
				if (index > originalIndex) index--;
				$_internalRemoveChild(displayObjectContainer, child, false, true);
			}
			else
			{
				parent = childProperties.TLScope.parent;
				if (parent) parent.$__properties().DisplayObjectContainerScope.$_internalRemoveChild(parent, child, true, true);
			}
			
			var childrenLength:uint = children.length;
			if (index > childrenLength) throw new RangeError('out of range index provided');
			if (index == childrenLength) properties.DisplayObjectScope.$_domView.appendChild(childProperties.DisplayObjectScope.$_domView);
			else
			{
				var displayObject:* = children[index];
				properties.DisplayObjectScope.$_domView.insertBefore(childProperties.DisplayObjectScope.$_domView, displayObject.$__properties().DisplayObjectScope.$_domView);
			}
			
			children.splice(index, 0, child);

			if (childProperties.DisplayObjectScope.$_height !== 0 || childProperties.DisplayObjectScope.$_width !== 0 || childProperties.DisplayObjectScope.$_scrollRect !== null) childProperties.DisplayObjectScope.$_notifyParentOfBoundsChange(); //notify the child that it should notify its parent (this) that it has been added and bounds will need to be recalculated for the parent (assuming the child has bounds)
						
			if (!hasChild && dispatchEvents) childProperties.TLScope.dispatchEvent(new Event(Event.ADDED, true));
			
			if (!childWasOnStage && properties.TLScope.stage) 
			{
				if (!childProperties.DisplayObjectScope.$_root)
				{
					parent = child;
					var found:Boolean = false;
					while (parent)
					{
						var parentProperties:* = parent.$__properties();
						if (parentProperties.DisplayObjectScope.$_isRoot) 
						{
							found = true;
							parentProperties.DisplayObjectScope.$_root = parent;
							break;
						}
						
						parent = parentProperties.TLScope.parent;
					}
					
					if (!found) throw new Error('no root found');		
				}
				
				if (dispatchEvents) notifyAddedToStage(child);
			}
			
			function notifyAddedToStage(child:*):void
			{
				var childProperties:* = child.$__properties();
				if (childProperties.EventDispatcherScope.$_listeners[Event.ADDED_TO_STAGE]) childProperties.TLScope.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
				
				var displayObjectContainer:DisplayObjectContainer = child as DisplayObjectContainer;
				
				if (displayObjectContainer == null) return;
				
				var children:Array = childProperties.DisplayObjectContainerScope.$_children;
				var childrenLength:uint = children.length;
				
				for (var i:uint = 0; i < childrenLength; i++) notifyAddedToStage(children[i]);
			}
			
			return child;
		}
		
		private static function $_internalRemoveChild(displayObjectContainer:DisplayObjectContainer, child:DisplayObject, dispatchRemovedEvent:Boolean=true, beingAdded:Boolean=false):DisplayObject
		{
			if (child === null) throw new Error('attempting to remove null child from display list');
			
			var properties:* = displayObjectContainer.$__properties();
			var childProperties:* = child.$__properties(); 
			if (childProperties.DisplayObjectScope.$_domView.parentNode != properties.DisplayObjectScope.$_domView) throw new ArgumentError('Error removing child from parent that is not a child of parent');
			
			var children:Array = properties.DisplayObjectContainerScope.$_children;
			
			if (dispatchRemovedEvent) childProperties.TLScope.dispatchEvent(new Event(Event.REMOVED, true));
			
			if (properties.TLScope.stage && !beingAdded) notifyRemovedFromStage(child);
			
			properties.DisplayObjectScope.$_domView.removeChild(childProperties.DisplayObjectScope.$_domView);
			
			children.splice(children.indexOf(child), 1);

			
			properties.DisplayObjectScope.$_onChildBoundsChange(childProperties.DisplayObjectScope.$_id, null); //notify parent (this) that it needs to recalculate its bounds to account for the removed child.

			
			function notifyRemovedFromStage(child:*):void
			{
				var childProperties:* = child.$__properties();
				if (childProperties.EventDispatcherScope.$_listeners[Event.REMOVED_FROM_STAGE]) childProperties.TLScope.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
				
				var displayObjectContainer:DisplayObjectContainer = child as DisplayObjectContainer;
				
				if (displayObjectContainer == null) return;
				
				var children:Array = childProperties.DisplayObjectContainerScope.$_children;
				var childrenLength:uint = children.length;
				
				for (var i:uint = 0; i < childrenLength; i++) notifyRemovedFromStage(children[i]);
			}
			
			return child;
		}

		public function addChild(child:DisplayObject):DisplayObject
		{
			return $_internalAddChildAt(this, child, $_properties.DisplayObjectContainerScope.$_children.length);
		}
		
		public function addChildAt(child:DisplayObject, index:int):DisplayObject
		{
			return $_internalAddChildAt(this, child, index);
		}
		
		public function get numChildren():int
		{
			return $_properties.DisplayObjectContainerScope.$_children.length;
		}
		
		public function getChildAt(index:int):DisplayObject
		{
			return $_properties.DisplayObjectContainerScope.$_children[index];
		}

		public function getChildByName(name:String):DisplayObject
		{
			var children:Array = $_properties.DisplayObjectContainerScope.$_children;
			var childrenLength:uint = children.length;
			for (var i:uint = 0; i < childrenLength; i++) if (name == children[i].name) return children[i];
			
			throw new ArgumentError('getChildByName, Child is not a child of this DisplayObjectContainer');
		}

		public function getChildIndex(child:DisplayObject):int
		{
			var index:int = $_properties.DisplayObjectContainerScope.$_children.indexOf(child);
			if (index == -1) throw new ArgumentError('getChildIndex, Child is not a child of this DisplayObjectContainer');
			
			return index;
		}

		public function contains(child:DisplayObject):Boolean
		{
			if (child === this) return true;

			return containsInner(this);

			function containsInner(parent:DisplayObjectContainer):Boolean
			{
				var displayObjectScope:* = parent.$__properties().DisplayObjectContainerScope;

				var numChildren:uint = displayObjectScope.$_children.length;
				for (var i:int = numChildren; i--;)
				{
					var innerChild:DisplayObject = displayObjectScope.$_children[i];

					if (child === innerChild) return true;

					var innerParent:DisplayObjectContainer = innerChild as DisplayObjectContainer;
					if (innerParent)
					{
						var value:Boolean = containsInner(innerParent);
						if (value) return true;
					}
				}

				return false;
			}
		}

		public function removeChild(child:DisplayObject):DisplayObject
		{
			return $_internalRemoveChild(this, child);
		}

		public function removeChildAt(index:int):DisplayObject
		{
			return $_internalRemoveChild(this, $_properties.DisplayObjectContainerScope.$_children[index]);
		}
		
		public function removeChildren(beginIndex:int = 0, endIndex:int = 0x7fffffff):void
		{
			var children:Array = $_properties.DisplayObjectContainerScope.$_children.slice(beginIndex, endIndex);
			var length:Number = children.length;
			
			for (var i:* = 0; i < length; i++) $_internalRemoveChild(this, children[i]);
		}

		public function setChildIndex(child:DisplayObject, index:int):void
		{
			var children:Array = $_properties.DisplayObjectContainerScope.$_children;
			var currentIndex:int = children.indexOf(child);
			
			if (currentIndex == -1) throw new ArgumentError('not a child of parent');
			if (index >= children.length) throw new RangeError('out of range index provided');
			if (currentIndex == index) return;
			
			if (index == (children.length - 1)) $_properties.DisplayObjectScope.$_domView.appendChild(child.$__properties().DisplayObjectScope.$_domView);
			else
			{
				var displayObject:* = children[index];
				$_properties.DisplayObjectScope.$_domView.insertBefore(child.$__properties().DisplayObjectScope.$_domView, displayObject.$__properties().DisplayObjectScope.$_domView);
			}
			
			children.splice(currentIndex, 1);
			children.splice(index, 0, child);
		}

		public UNIMPLEMENTED function swapChildren (child1:DisplayObject, child2:DisplayObject) : void
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "swapChildren"');
		}

		public UNIMPLEMENTED function swapChildrenAt (index1:int, index2:int) : void
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "swapChildrenAt"');
		}

		public function get mouseChildren():Boolean
		{
			return $_properties.DisplayObjectContainerScope.$_mouseChildren;
		}

		public function set mouseChildren(enable:Boolean):void
		{
			$_properties.DisplayObjectContainerScope.$_mouseChildren = enable;
		}

		public UNIMPLEMENTED function get tabChildren () : Boolean
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "tabChildren"');
		}

		public UNIMPLEMENTED function set tabChildren (enable:Boolean) : void
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "tabChildren"');
		}

		public UNIMPLEMENTED function get textSnapshot () : TextSnapshot
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "textSnapshot"');
		}

		public UNIMPLEMENTED function areInaccessibleObjectsUnderPoint (point:Point) : Boolean
		{
			throw new Error('DisplayObjectContainer: attempted call to an unimplemented function "areInaccessibleObjectsUnderPoint"');
		}

		public function getObjectsUnderPoint(point:Point):Array
		{
			var win:Object = window;
			var displayObjectScope:*;
			var pscope:Object;
			var x:Number;
			var y:Number;
			var width:Number;
			var height:Number;
			var visible:Boolean;
			var graphicsDomView:*;
			var add:Boolean = true;

			displayObjectScope = $_properties.DisplayObjectScope;
			pscope = displayObjectScope.pscope;
			visible = win.$$getDescriptor(pscope, 'visible').get.call(this);
			
			if (!visible) return [];

			x = win.$$getDescriptor(pscope, 'x').get.call(this);

			if (point.x < x) add = false; //don't return. instead continue checking children that are to the left of the parent (negative position)
			else
			{
				width = win.$$getDescriptor(pscope, 'width').get.call(this);

				if (point.x > x + width) return [];
			}

			y = win.$$getDescriptor(pscope, 'y').get.call(this);

			if (point.y < y) add = false; //don't return. instead continue checking children that are above the parent (negative position)
			else
			{
				height = win.$$getDescriptor(pscope, 'height').get.call(this);

				if (point.y > y + height) return [];
			}

			graphicsDomView = displayObjectScope.$_domGraphicsView;
			var children:Array = (add && graphicsDomView && (graphicsDomView.width || graphicsDomView.height)) ? [this] : []; //todo, need to check the graphics bounds as well.... i.e. if they don't actually click over the graphic, it doesn't count as clicking on the parent
			
			getChildrenAtPoint(this);
			
			function getChildrenAtPoint(parent:DisplayObjectContainer):void
			{
				var innerPoint:Point = parent.globalToLocal(point);

				var displayObjectScope:*;
				var pscope:Object;
				var x:Number;
				var y:Number;
				var width:Number;
				var height:Number;
				var visible:Boolean;
				var graphicsDomView:*;
				var add:Boolean;

				var numChildren:uint = parent.numChildren;
				for (var i:int = 0; i < numChildren; i++)
				{
					var child:DisplayObject = parent.getChildAt(i);

					displayObjectScope = child.$__properties().DisplayObjectScope;
					pscope = displayObjectScope.pscope;
					add = true;

					visible = win.$$getDescriptor(pscope, 'visible').get.call(child);

					if (!visible) continue;

					x = win.$$getDescriptor(pscope, 'x').get.call(child);

					if (innerPoint.x < x) add = false;
					else
					{
						width = win.$$getDescriptor(pscope, 'width').get.call(child);

						if (innerPoint.x > x + width) continue;
					}

					y = win.$$getDescriptor(pscope, 'y').get.call(child);

					if (innerPoint.y < y) add = false;
					else
					{
						height = win.$$getDescriptor(pscope, 'height').get.call(child);

						if (innerPoint.y > y + height) continue;
					}

					var innerParent:DisplayObjectContainer = child as DisplayObjectContainer;

					if (innerParent)
					{
						graphicsDomView = displayObjectScope.$_domGraphicsView;
						if (add && graphicsDomView && (graphicsDomView.width || graphicsDomView.height)) children.push(child);  //todo, need to check the graphics bounds as well.... i.e. if they don't actually click over the graphic, it doesn't count as clicking on the parent

						getChildrenAtPoint(innerParent);
					}
					else if (add) children.push(child);
				}
			}

			return children;
		}
	}
}
