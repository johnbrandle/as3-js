/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	import flash.xml.XMLDocument;

	public final dynamic class XMLList
	{
		private var $$isProxy:Boolean = true;
	
		private var $_parent:Object;
		
		private var $_nodes:Array = [];
		
		public function XMLList(object:Object=null)
		{
			var xml:*;
			var i:*;
			var length:*;
			
			if (!object) {}
			else if (object is XMLList) for (xml in object) $_nodes[$_nodes.length] = xml;
			else if (object is XML) $_nodes[0] = object;
			else if (object is Array) 
			{
				length = object.length;
				for (i = 0; i < length; i++) $_nodes[i] = new XML(object[i]);
			}
			else if (object is String)
			{
				var xmlDocument:XMLDocument = new XMLDocument();
				xmlDocument.ignoreWhite = XML.ignoreWhitespace;
				xmlDocument.parseXML('<root>' + (object as String) + '</root>');
				
				var childNodes:* = xmlDocument.firstChild.childNodes;
				length = childNodes.length;
				for (i = 0; i < length; i++) $_nodes[i] = new XML(childNodes[i]);
			}
			else throw new Error('unknown XMLList value given in XMLList constructor');
		}
	
		public function attribute(attributeName:*):XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			for each (var xml:XML in $_nodes)
			{
				if (xml.nodeKind() != 'element') continue;
				
				xmlList.$__merge(xml.attribute(attributeName));
			}
			
			return xmlList;
		}
		
		public function attributes():XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			for each (var xml:XML in $_nodes)
			{
				if (xml.nodeKind() != 'element') continue;
				
				xmlList.$__merge(xml.attributes());
			}
			
			return xmlList;
		}
		
		public function child(propertyName:Object):XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			for each (var xml:XML in $_nodes) 
			{
				if (xml.nodeKind() != 'element') continue;
				
				xmlList.$__merge(xml.child(propertyName));
			}
			
			return xmlList;
		}
		
		public function children():XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			for each (var xml:XML in $_nodes)
			{
				if (xml.nodeKind() != 'element') continue;
				
				xmlList.$__merge(xml.children());
			}
			
			return xmlList;
		}
		
		internal function get $__nodes():Array
		{
			return $_nodes;	
		}
		
		public function contains(value:XML):Boolean
		{
			var valueString:String = value.toXMLString();
			for each (var xml:XML in $_nodes) if (xml.toXMLString() == valueString) return true;
			
			return false;
		}
		
		public function copy():XMLList
		{
			return new XMLList(this);
		}
		
		public function descendants(name:Object=null):XMLList
		{
			var xmlList:XMLList = new XMLList();
			
			for each (var xml:XML in $_nodes)
			{
				if (xml.nodeKind() != 'element') 
				{
					if (name == null) xmlList[xmlList.length()] = xml;
					continue;
				}
				
				if (name == null || name.toString() == xml.name()) xmlList[xmlList.length()] = xml;
				xmlList.$__merge(xml.descendants(name));
			}
			
			return xmlList;
		}
		
		public function elements(name:Object=null):XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			for each (var xml:XML in $_nodes) if (xml.nodeKind() == 'element') xmlList[xmlList.length()] = xml;
			
			return xmlList;
		}
		
		public function length():int
		{
			return $_nodes.length;
		}
		
		public function parent():Object
		{
			return $_parent;
		}
		
		internal function set $__parent(value:Object):void
		{
			$_parent = value;
			
			for each (var xml:XML in $_nodes) xml.$__parent = value;
		}
				
		public function text():XMLList
		{
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = $_parent;
			
			for each (var xml:XML in $_nodes) if (xml.nodeKind() == 'text') xmlList[xmlList.length()] = xml;
			
			return xmlList;
		}
		
		public function hasOwnProperty(name:String):Boolean
		{
			var index:Number = parseInt(name);
			if (isNaN(index)) return false;
			
			return index >= 0 && index < $_nodes.length;
		}
		
		public function propertyIsEnumerable(name:String):Boolean
		{
			var index:Number = parseInt(name);
			if (isNaN(index)) return false;
			
			return index >= 0 && index < $_nodes.length;
		}
		
		public function toString():String
		{
			var string:String = '';
			for each (var childXML:XML in $_nodes) string += childXML.toString();
			return string;
		}
		
		public function toXMLString():String
		{
			var xmlString:String = '';
			for each (var childXML:XML in $_nodes) xmlString += childXML.toXMLString();
			return xmlString;
		}
		
		internal function $__insertChildAfter(child1:Object, child2:Object):*
		{
			if (!$_parent) throw new Error('XMLList parent must be defined');
			
			var index:int;
			if (child2 is XMLList)
			{
				if (!child1) index = 0;
				else
				{
					if (child1.parent() != $_parent) return $_parent;
					index = child1.childIndex();
					if (index == -1) return $_parent;
					index++;
				}
				
				var length:int = child2.length();
				for (var i:int = 0; i < length; i++) $_nodes.splice(i + index, 0, child2[i]);
				$_parent.$__invalidateString();
				return $_parent;
			}
			
			if (!(child2 is XML) || child2.parent() != $_parent)
			{
				child2 = new XML(child2);
				child2.$__parent = $_parent;
			}
			
			if (!child1) index = 0;
			else
			{
				if (child1.parent() != $_parent) return $_parent;
				index = child1.childIndex();
				if (index == -1) return $_parent;
				index++;
			}
			
			$_nodes.splice(index, 0, child2);
			$_parent.$__invalidateString();
			return $_parent;
		}
		
		internal function $__insertChildBefore(child1:Object, child2:Object):*
		{
			if (!$_parent) throw new Error('XMLList parent must be defined');
			
			var index:int;
			if (child2 is XMLList)
			{
				if (!child1) index = 0;
				else
				{
					if (child1.parent() != $_parent) return $_parent;
					index = child1.childIndex();
					if (index == -1) return $_parent;
					if (index != 0) index--;
				}
				
				var length:int = child2.length();
				for (var i:int = 0; i < length; i++) $_nodes.splice(i + index, 0, child2[i]);
				$_parent.$__invalidateString();
				return $_parent;
			}
			
			if (!(child2 is XML) || child2.parent() != $_parent)
			{
				child2 = new XML(child2);
				child2.$__parent = $_parent;
			}
			
			if (!child1) index = 0;
			else
			{
				if (child1.parent() != $_parent) return $_parent;
				index = child1.childIndex();
				if (index == -1) return $_parent;
				if (index != 0) index--;
			}
			
			$_nodes.splice(index, 0, child2);
			$_parent.$__invalidateString();
			return $_parent;
		}
		
		internal function $__prependChild(value:Object):XML
		{
			return this.$__insertChildAfter(null, value);
		}
		
		internal function $__replace(childList:XMLList, value:XML):XML
		{
			for each (var xml:XML in childList) $$set(xml.childIndex(), value);
			return $_parent as XML;
		}
		
		internal function $__merge(xmlList:XMLList):void
		{
			for each (var xml:XML in xmlList) $_nodes.push(xml);
		}
		
		public UNIMPLEMENTED function comments():XMLList
		{
			throw new Error('XMLList: attempted call to an unimplemented function "comments"');
		}
		
		public UNIMPLEMENTED function hasComplexContent():Boolean
		{
			throw new Error('XMLList: attempted call to an unimplemented function "hasComplexContent"');
		}
		
		public UNIMPLEMENTED function hasSimpleContent():Boolean
		{
			throw new Error('XMLList: attempted call to an unimplemented function "hasSimpleContent"');
		}
		
		public UNIMPLEMENTED function normalize():XMLList
		{
			throw new Error('XMLList: attempted call to an unimplemented function "normalize"');
		}
		
		public UNIMPLEMENTED function processingInstructions(name:String="*"):XMLList
		{
			throw new Error('XMLList: attempted call to an unimplemented function "processingInstructions"');
		}
		
		private function $$get(key:*):*
		{
			if (key == '$attributes') return attributes();
			var index:Number = parseInt(key);
			if (isNaN(index)) 
			{
				if ($_parent && $_parent.attributes() == this)
				{
					var attributes:XMLList = $_parent.attribute(key);
					return (attributes.length()) ? attributes[0] : new XMLList();
				}
				else return child(key);
			}
			
			return $_nodes[index];
		}
		
		private function $$set(key:*, value:*):*
		{
			var index:Number = parseInt(key);
			var xml:XML;
			
			if (isNaN(index)) 
			{
				if ($_parent && $_parent.attributes() == this)
				{
					var attributes:XMLList = $_parent.attribute(key);
					if (attributes.length()) attributes[0] = value;
					else
					{
						attributes = $_parent.attributes();
						xml = new XML('<' + key + '>' + value + '</' + key + '>');
						xml.$__nodeKind = 'attribute';
						xml.$__parent = $_parent;
						attributes[attributes.length()] = xml;
					}
				}
				else if ($_parent)
				{
					var children:XMLList = $_parent.child(key);
					if (children.length()) children[0] = value;
					else
					{
						children = $_parent.children();
						children[children.length()] = value;
					}
				}
				
				return value;
			}
			if (index < 0) throw new Error('XMLList: index out of range: ' + index);
			if (index > $_nodes.length) index = $_nodes.length;
			
			if ($_nodes[index])
			{
				if ($_nodes[index].nodeKind() == 'attribute')
				{
					$_nodes[index].children()[0].$__text = (value) ? value.toString() : '';
					return value;
				}
				else if ($_nodes[index].nodeKind() == 'text') return value;
				else if ($_parent && $_parent.children() == this) 
				{
					if ($_nodes[index].children().length()) $_nodes[index].$__nodes.splice(0);
					
					$_nodes[index].appendChild(value);
					return;
				}
			}
			
			if (value is XMLList)
			{
				for each (xml in value) $$set(index++, xml);
				return;
			}
			else if (!(value is XML))
			{
				value = new XML(value);
				value.$__parent = $_parent;	
			}
			else if (!value.parent())
			{
				value.$__parent = $_parent;
			}
			else if (value.parent() != $_parent && $_parent)
			{
				value = new XML(value);
				value.$__parent = $_parent;
			}
			else if ($_parent) $_parent.$__invalidateString();
			
			return $_nodes[index] = value;
		}
		
		private function $$append(index:int, child2:Object):*
		{
			index++;
			if (child2 is XMLList)
			{
				var length:int = child2.length();
				for (var i:int = 0; i < length; i++) $_nodes.splice(i + index, 0, child2[i]);
				if ($_parent) $_parent.$__invalidateString();
				return child2;
			}
			
			if (!(child2 is XML) || child2.parent() != $_parent)
			{
				child2 = new XML(child2);
				child2.$__parent = $_parent;
			}
			
			$_nodes.splice(index, 0, child2);
			if ($_parent) $_parent.$__invalidateString();
			
			return child2;
		}
		
		private UNIMPLEMENTED function $call(name:*, args:Array):*
		{
			throw new Error('XMLList: call not supported');
		}
		
		private function $$delete(key:*):Boolean
		{	
			var index:Number = parseInt(key);
			if (isNaN(index)) 
			{
				if ($_parent && $_parent.attributes() == this)
				{
					var attributes:XMLList = $_parent.attribute(key);
					if (attributes.length()) return delete attributes[0];
				}
				return true;
			}
			if (index < 0 || index >= $_nodes.length) throw new Error('XMLList: index out of range: ' + index);
			
			var xml:XML = $_nodes[index];
			if (xml.parent())
			{
				if (xml.nodeKind() == 'element' && this != xml.parent().children()) delete xml.parent().children()[xml.childIndex()];
				else if (xml.nodeKind() == 'attribute' && this != xml.parent().attributes()) delete xml.parent().attributes()[xml.childIndex()];
			}
			
			xml.$__parent = null;
			$_nodes.splice(index, 1);
			if ($_parent) $_parent.$__invalidateString();
			return true;
		}
		
		private function $$nextName(index:int):String
		{
			return index.toString();
		}
		
		private function $$nextNameIndex(index:int):int
		{
			return (index < $_nodes.length) ? index + 1 : 0;
		}
		
		private function $$nextValue(index:int):*
		{
			return $_nodes[index - 1];
		}
	}
}