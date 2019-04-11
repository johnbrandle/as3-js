/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	import flash.xml.XMLDocument;
	import flash.xml.XMLNode;
	import flash.xml.XMLNodeType;
	
	import browser.Browser;

	public final dynamic class XML
	{
		private var $$isProxy:Boolean = true;
		
		private static var $_ignoreComments:Boolean = true;
		
		private static var $_ignoreProcessingInstructions:Boolean = true;
		
		private static var $_ignoreWhitespace:Boolean = true;
		
		private static var $_prettyIndent:int = 2;
		
		private static var $_prettyPrinting:Boolean = true;
		
		private var $_name:Object;
		
		private var $_localName:Object;
		
		private var $_parent:Object;
		
		private var $_children:XMLList;
		
		private var $_attributes:XMLList;
		
		private var $_nodeKind:String;
		
		private var $_cdata:Boolean;
		
		private var $_string:String;
		private var $_stringInvalidated:Boolean;
		
		private var $_xmlString:String;
		private var $_xmlStringInvalidated:Boolean;
		
		private var $_xmlNode:XMLNode;
	
		public function XML(object:Object)
		{
			var nodeKind:*;
			if (object is XML)
			{
				nodeKind = object.nodeKind();
				if (nodeKind == 'attribute') object = '<' + object.name() + '>' + object.toXMLString() + '</' + object.name() + '>';
				else object = object.toXMLString();
			}
			else if (object is XMLNode) $_xmlNode = object as XMLNode;
			else if (object == null) $_xmlNode = new XMLNode(XMLNodeType.TEXT_NODE, '');
			
			var xmlDocument:*;
			if (object is String)
			{
				xmlDocument = new XMLDocument();
				xmlDocument.ignoreWhite = XML.ignoreWhitespace;
				xmlDocument.parseXML(object as String);
				
				if (xmlDocument.childNodes.length != 1) throw new TypeError('XML: The markup in the document following the root element must be well-formed.');
				
				$_xmlNode = xmlDocument.firstChild;
			}
			
			if (!$_xmlNode) throw new Error('unknown XML value given in XML constructor');
			
			if ($_xmlNode.nodeType == XMLNodeType.ELEMENT_NODE)
			{
				$_name = $_xmlNode.nodeName;
				$_localName = $_xmlNode.localName;
			}
			else
			{
				if ($_xmlNode.nodeType == XMLNodeType.CDATA_NODE) $_cdata = true;
				if (object is XMLNode)
				{
					$_string = $_xmlString = (object as XMLNode).toString(true);
				}
				else $_string = $_xmlString = object.toString();
				nodeKind = 'text';
			}
					
			$_nodeKind = (nodeKind) ? nodeKind : 'element';
			
			if ($_nodeKind != 'text') $__invalidateString();
		}
		
		[Native("void")]
		private function lazyInitialized():void
		{
			if (!$_xmlNode) throw new Error('XML: already initialized');
			var xmlNode:* = $_xmlNode;
			$_xmlNode = null;
			
			$_attributes = new XMLList();
			$_attributes.$__parent = this;
			
			var attributes:Object = xmlNode.attributes;
			for (var property:String in attributes)
			{
				var attribute:String = '<' + property + '>' + attributes[property] + '</' + property + '>';
				var attributeXML:XML = new XML(attribute);
				attributeXML.$__nodeKind = 'attribute';
				
				$_attributes[$_attributes.length()] = attributeXML;
			}
			
			if ($_cdata || ($_nodeKind == 'attribute' && !xmlNode.childNodes.length)) $_children = new XMLList(['']); //this fixes attributes that have not text foo=""
			else $_children = new XMLList(xmlNode.childNodes);
			
			$_children.$__parent = this;
		}
		
		internal function $__invalidateString():void
		{
			$_stringInvalidated = true;
			$_xmlStringInvalidated = true;
			
			if ($_parent) $_parent.$__invalidateString();
		}
		
		public function appendChild(child:Object):XML
		{
			if ($_nodeKind != 'element') return this;
			if ($_xmlNode) lazyInitialized();
			
			if (child is XMLList)
			{
				child.$__parent = this;
				for each (var xml:XML in child) appendChild(xml);
			}
			else if (child is XML) $_children[$_children.length()] = child;
			else if (child is String) return appendChild(new XML(child.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')));
			
			return this;
		}
		
		public function attribute(attributeName:*):XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			attributeName = attributeName.toString();
			
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = this;
			for each (var xml:XML in $_attributes)
			{
				if (xml.name() == attributeName)
				{
					xmlList[0] = xml;
					break;
				}
			}
			
			return xmlList;
		}
		
		public function attributes():XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			return $_attributes;
		}
		
		public function child(propertyName:Object):XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = this;
			for each (var xml:XML in $_children) if (propertyName == null || xml.name() == propertyName) xmlList[xmlList.length()] = xml;
			
			return xmlList;
		}
		
		public function childIndex():int
		{
			if (!$_parent) return -1;
			if ($_xmlNode) lazyInitialized();
			
			var index:int = 0;
			var xmlList:XMLList = ($_nodeKind == 'attribute') ? $_parent.attributes() : $_parent.children();
			for each (var xml:XML in xmlList)
			{
				if (xml == this) return index;
				
				index++;
			}
			
			return -1;
		}
		
		public function children():XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			return $_children;
		}
		
		public function contains(value:XML):Boolean
		{
			if ($_xmlNode) lazyInitialized();
			
			var valueString:String = value.toXMLString();
			for each (var xml:XML in $_children) if (xml.toXMLString() == valueString) return true;
			
			return false;
		}
		
		public function copy():XML
		{
			if ($_xmlNode) lazyInitialized();
			
			return new XML(this);
		}
		
		public function descendants(name:Object=null):XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			var xmlList:XMLList = new XMLList();
			if ($_nodeKind != 'element') return xmlList;
			
			for each (var xml:XML in $_children)
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
			if ($_xmlNode) lazyInitialized();
			
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = this;
			for each (var xml:XML in $_children) if (xml.nodeKind() == 'element') xmlList[xmlList.length()] = xml;
			
			return xmlList;
		}
		
		public function insertChildAfter(child1:Object, child2:Object):*
		{
			if ($_nodeKind != 'element') return this;
			if ($_xmlNode) lazyInitialized();
			
			return $_children.$__insertChildAfter(child1, child2);
		}
		
		public function insertChildBefore(child1:Object, child2:Object):*
		{
			if ($_nodeKind != 'element') return this;
			if ($_xmlNode) lazyInitialized();
			
			return $_children.$__insertChildBefore(child1, child2);
		}
		
		public function prependChild(value:Object):XML
		{
			if ($_nodeKind != 'element') return this;
			if ($_xmlNode) lazyInitialized();
			
			return $_children.$__prepend(value);
		}
		
		public function replace(propertyName:Object, value:XML):XML
		{
			if ($_nodeKind != 'element') return this;
			if ($_xmlNode) lazyInitialized();
			
			return $_children.$__replace(child(propertyName), value);
		}
		
		public function length():int
		{
			return 1;
		}
		
		public function localName():Object
		{
			return $_localName;
		}
		
		public function name():Object
		{
			return $_name;
		}
		
		public function nodeKind():String
		{
			return $_nodeKind;
		}
		
		protected function set $__nodeKind(value:String):void
		{
			$_nodeKind = value;
		}
		
		public function parent():Object
		{
			return $_parent;
		}
		
		protected function set $__parent(value:Object):void
		{
			if (value) value.$__invalidateString();
			if ($_parent && !value) $_parent.$__invalidateString();
				
			$_parent = value;
		}
		
		public function setChildren(value:Object):XML
		{
			if ($_xmlNode) lazyInitialized();
			
			$_children.$__parent = null;
			$_children = new XMLList(value);
			$_children.$__parent = this;
			return this;
		}
		
		public function setLocalName(name:String):void
		{
			$_localName = name;
			$__invalidateString();
		}
		
		public function setName(name:String):void
		{
			$_name = name;
			$__invalidateString();
		}
		
		public function text():XMLList
		{
			if ($_xmlNode) lazyInitialized();
			
			var xmlList:XMLList = new XMLList();
			xmlList.$__parent = this;
			
			if ($_nodeKind == 'attribute') return xmlList;
			
			for each (var xml:XML in $_children) if (xml.nodeKind() == 'text') xmlList[xmlList.length()] = xml;
			
			return xmlList;
		}
		
		public function hasOwnProperty(name:String):Boolean
		{
			if (name.charAt(0) == '@') return attribute(name.substring(1)).length() > 0;
			
			return child(name).length() > 0;
		}
		
		public function propertyIsEnumerable(name:String):Boolean
		{
			return name == '0';
		}
		
		public function toString():String
		{
			if ($_xmlNode) lazyInitialized();
			
			if ($_nodeKind == 'attribute') return $_children[0].toString();
			if ($_nodeKind == 'text') return $_string;
			
			if (!$_stringInvalidated) return $_string; 
			
			$_stringInvalidated = false;
			if ($_children.length() == 0) return $_string = '';
			if ($_children.length() == 1 && $_children[0].nodeKind() == 'text') return $_string = $_children[0].toString();
			
			return $_string = toXMLString();
		}
		
		public function toXMLString():String
		{
			if ($_xmlNode) lazyInitialized();
			
			if ($_nodeKind == 'attribute') return $_children[0].toXMLString();
			if ($_nodeKind == 'text') 
			{
				if ($_cdata) return '<![CDATA[' + $_xmlString + ']]>';
				return $_xmlString;
			}
			
			if (!$_xmlStringInvalidated) return $_xmlString; 
			
			$_xmlStringInvalidated = false;
			
			var xmlString:String;
			var childXML:XML;
			
			if (!$_attributes.length())
			{
				if (!$_children.length()) return '<' + $_name + '/>';
				
				xmlString = '<' + $_name + '>';
				for each (childXML in $_children) xmlString += childXML.toXMLString();
				xmlString += '</' + $_name + '>';
				return xmlString;
			}
			
			xmlString = '<a>b</a>';
			var xmlDocument:Object = Browser.domParseXML(xmlString);
			for each (var attributeXML:XML in $_attributes) xmlDocument.documentElement.setAttribute(attributeXML.name(), attributeXML.toXMLString());
			xmlString = Browser.getNewXMLSerializer().serializeToString(xmlDocument);
			xmlString = xmlString.substring(2, xmlString.length - 5);
			
			if (!$_children.length()) return '<' + $_name + xmlString.substring(0, xmlString.length - 1) + '/>';
			
			for each (childXML in $_children) xmlString += childXML.toXMLString();
			return $_xmlString = '<' + $_name + xmlString + '</' + $_name + '>';
		}
		
		public UNIMPLEMENTED function hasComplexContent():Boolean
		{
			throw new Error('XML: attempted call to an unimplemented function "hasComplexContent"');
		}
		
		public UNIMPLEMENTED function hasSimpleContent():Boolean
		{
			throw new Error('XML: attempted call to an unimplemented function "hasSimpleContent"');
		}
		
		public UNIMPLEMENTED function addNamespace(ns:Object):XML
		{
			throw new Error('XML: attempted call to an unimplemented function "addNamespace"');
		}
		
		public UNIMPLEMENTED function comments():XMLList
		{
			throw new Error('XML: attempted call to an unimplemented function "comments"');
		}
		
		public UNIMPLEMENTED static function defaultSettings():Object
		{
			throw new Error('XML: attempted call to an unimplemented function "defaultSettings"');
		}
		
		public UNIMPLEMENTED function inScopeNamespaces():Array
		{
			throw new Error('XML: attempted call to an unimplemented function "inScopeNamespaces"');
		}
		
		public UNIMPLEMENTED function namespace(prefix:String=null):*
		{
			throw new Error('XML: attempted call to an unimplemented function "namespace"');
		}
		
		public UNIMPLEMENTED function namespaceDeclarations():Array
		{
			throw new Error('XML: attempted call to an unimplemented function "namespaceDeclarations"');
		}
		
		public UNIMPLEMENTED function normalize():XML
		{
			throw new Error('XML: attempted call to an unimplemented function "normalize"');
		}
		
		public UNIMPLEMENTED function processingInstructions(name:String="*"):XMLList
		{
			throw new Error('XML: attempted call to an unimplemented function "processingInstructions"');
		}
		
		public UNIMPLEMENTED function removeNamespace(ns:Namespace):XML
		{
			throw new Error('XML: attempted call to an unimplemented function "removeNamespace"');
		}
		
		public UNIMPLEMENTED function setNamespace(ns:Namespace):void
		{
			throw new Error('XML: attempted call to an unimplemented function "setNamespace"');
		}
		
		public UNIMPLEMENTED static function setSettings():Object
		{
			throw new Error('XML: attempted call to an unimplemented function "setSettings"');
		}
		
		public UNIMPLEMENTED static function settings():Object
		{
			throw new Error('XML: attempted call to an unimplemented function "settings"');
		}
		
		public UNIMPLEMENTED function toJSON(k:String):*
		{
			throw new Error('XML: attempted call to an unimplemented function "toJSON"');
		}
		
		public static function get ignoreComments():Boolean
		{
			return $_ignoreComments;
		}
		
		public UNIMPLEMENTED static function set ignoreComments(value:Boolean):void
		{
			throw new Error('XML: attempted call to an unimplemented function "ignoreComments"');
		}
		
		public static function get ignoreProcessingInstructions():Boolean
		{
			return $_ignoreProcessingInstructions;
		}
		
		public UNIMPLEMENTED static function set ignoreProcessingInstructions(value:Boolean):void
		{
			throw new Error('XML: attempted call to an unimplemented function "ignoreProcessingInstructions"');
		}
		
		public static function get ignoreWhitespace():Boolean
		{
			return $_ignoreWhitespace;
		}
		
		public static function set ignoreWhitespace(value:Boolean):void
		{
			$_ignoreWhitespace = value;
		}
		
		public static function get prettyIndent():int
		{
			return $_prettyIndent;
		}
		
		public UNIMPLEMENTED static function set prettyIndent(value:int):void
		{
			throw new Error('XML: attempted call to an unimplemented function "prettyIndent"');
		}
		
		public static function get prettyPrinting():Boolean
		{
			return $_prettyPrinting;
		}
		
		public UNIMPLEMENTED static function set prettyPrinting(value:Boolean):void
		{
			throw new Error('XML: attempted call to an unimplemented function "prettyPrinting"');
		}
		
		internal function set $__text(text:String):void
		{
			$_xmlString = $_string = text;
			$__invalidateString();
		}
		
		private function $$get(key:*):*
		{
			if ($_xmlNode) lazyInitialized();
			
			if (key == '$attributes') return $_attributes;
			var index:Number = parseInt(key);
			if (index === 0) return this;
			if (!isNaN(index)) return undefined;
			
			return child(key);
		}
		
		private function $$set(key:*, value:*):*
		{
			if ($_xmlNode) lazyInitialized();
			
			var index:Number = parseInt(key);
			var xml:XML;
			
			if (isNaN(index))
			{
				var xmlList:XMLList = this.child(key);
				if (xmlList.length())
				{
					for each (var child:XML in xmlList)
					{
						xml = new XML(value);
						xml.$__parent = child;
						child.setChildren(xml);
					}
					return value;
				}
				
				xml = new XML('<' + key + '/>');
				xml.appendChild(value);
				value = xml;
				index = $_children.length();
			}
			else throw new Error('XML: Assignment to indexed XML is not allowed: ' + key);
			
			return $_children[index] = value;
		}
		
		private function $$call(name:*, args:Array):*
		{
			var string:String = toString();
			return string[name].apply(string, args);
		}
		
		private function $$delete(key:*):Boolean
		{
			if ($_xmlNode) lazyInitialized();
			
			var index:Number = parseInt(key);
			
			if (isNaN(index))
			{
				var xmlList:XMLList = child(key);
				while (xmlList.length()) delete xmlList[0];
				
				return true;
			}
			else throw new Error('XML: deletion of indexed XML is not allowed: ' + key);
		}
		
		private function $$nextName(index:int):String
		{
			return null;
		}
		
		private function $$nextNameIndex(index:int):int
		{
			return 0;
		}
		
		private function $$nextValue(index:int):*
		{
		}
	}
}