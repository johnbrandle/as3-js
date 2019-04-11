/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.xml
{
	public class XMLNode 
	{
		private var $_attributes:Object = {};
		
		public var $__childNodes:Array = [];
		
		public var $__localName:String;
		
		public var $__prefix:String;
		
		public var $__namespaceURI:String;
		
		public var $__domObject:Object;
		

		public var firstChild : flash.xml.XMLNode;


		public var lastChild : flash.xml.XMLNode;


		public var nextSibling : flash.xml.XMLNode;


		public var nodeName : String;


		public var nodeType : uint;


		public var nodeValue : String;


		public var parentNode : flash.xml.XMLNode;


		public var previousSibling : flash.xml.XMLNode;


		public function XMLNode(type:uint, value:String)
		{
			nodeType = type;
			
			if (type != XMLNodeType.ELEMENT_NODE) nodeValue = value;
		}
		

		public function get attributes () : Object
		{
			return $_attributes;
		}

		public function set attributes (value:Object) : void
		{
			$_attributes = value;
		}


		public function get childNodes():Array
		{
			return $__childNodes;
		}


		public function get localName () : String
		{
			return $__localName;
		}


		public function get namespaceURI () : String
		{
			return $__namespaceURI;
		}

		public function get prefix () : String
		{
			return $__prefix;
		}


		public function appendChild (node:XMLNode):void
		{
			if (node.parentNode) node.removeNode();
			node.parentNode = this;
			
			$__childNodes.push(node);
		}


		public function cloneNode (deep:Boolean) : flash.xml.XMLNode
		{
			var newNode:XMLNode = new XMLNode(nodeType, nodeValue);
			if (!deep) newNode.$__childNodes = $__childNodes.concat();
			
			return newNode;
		}

		public UNIMPLEMENTED function getNamespaceForPrefix (prefix:String) : String
		{
			throw new Error('XMLNode: attempted call to an unimplemented function "getNamespaceForPrefix"');
		}


		public UNIMPLEMENTED function getPrefixForNamespace (ns:String) : String
		{
			throw new Error('XMLNode: attempted call to an unimplemented function "getPrefixForNamespace"');
		}


		public function hasChildNodes():Boolean
		{
			return $__childNodes.length > 0;
		}


		public function insertBefore (node:XMLNode, before:XMLNode) : void
		{
			var childNodes:Array = $__childNodes;
			var childNodesLength:int = childNodes.length;
			for (var i:int = 0; i < childNodesLength; i++)
			{
				if (childNodes[i] != before) continue;
				
				if (node.parentNode) node.removeNode();
				node.parentNode = this;
				
				childNodes.splice(i, 0, node);
				
				return;
			}
			
			trace('xmlNode insertion failed');
		}


		public function removeNode():void
		{
			if (!parentNode) return;
			parentNode.$__removeNodeChild(this);
		}
		
		protected function $__removeNodeChild(child:XMLNode):Boolean 
		{
			var childNodes:Array = $__childNodes;
			var childNodesLength:int = childNodes.length;
			for (var i:int = 0; i < childNodesLength; i++)
			{
				if (childNodes[i] != child) continue;
				
				childNodes.splice(0, 1);
				i--;
				
				return true;
			}
			
			return false;
		}
		

		public function toString($toXMLString:Boolean=false):String //internal optional param
		{
			if (!nodeName && nodeType != XMLNodeType.CDATA_NODE) return '[XMLNode]';
		
			if (nodeType == XMLNodeType.TEXT_NODE || nodeName == "#text") return nodeValue;
			if (nodeType == XMLNodeType.CDATA_NODE) return ($toXMLString) ? nodeValue : nodeValue.split("<").join("&lt;").split(">").join("&gt;");
			
			var attributesSerialised:String = "";
			var attributes:Object = $_attributes;
			for (var iter:String in attributes) attributesSerialised += " " + iter + "=\"" + attributes[iter] + "\"";
			
			var nodeStr:String = "<" + nodeName + attributesSerialised;
			var nodeEnding:String = "";
			
			if (!childNodes.length) nodeStr += " />"
			else 
			{
				nodeStr += ">";
				nodeEnding = "</" + nodeName + ">";
			}
			
			var innerNodes:String = "";
			var childNodesLength:int = childNodes.length;
			for (var i:int = 0; i < childNodesLength; i++) innerNodes += childNodes[i].toString();
			
			return nodeStr + innerNodes + nodeEnding; 
		}
	}
}
