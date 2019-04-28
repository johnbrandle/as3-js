//__ES4__

(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; 

/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

if ($es4.$$window === undefined)
{	 
	$es4.$$window = $window;
	$es4.$$startTime = new Date().getTime();
	 
	$es4.$$EMPTY_ARRAY = [];
	$es4.$$EMPTY_OBJECT = {};
	$es4.$$VALUE_OBJECT = {};
	$es4.$$DEFAULT_PROPERTY_VALUE = {};
	$es4.$$MANUAL_CONSTRUCT = {};
	 
	Object.defineProperty(Object.prototype, '$$hasOwnProperty', {value:Object.prototype.hasOwnProperty});
	Object.defineProperty(Object.prototype, '$$propertyIsEnumerable', {value:Object.prototype.propertyIsEnumerable});

	Object.defineProperty(Object.prototype, 'hasOwnProperty', {value:function(property)
	{
		var proto = this;
		while (proto !== null)
		{
			if (proto.$$hasOwnProperty(property)) return true;
			
			proto = proto.__proto__;
		}
		
		return false;
	}});
	Object.defineProperty(Object.prototype, '$$hasOwnProperty_private', {value:Object.prototype.hasOwnProperty});

	Object.defineProperty(Object.prototype, 'propertyIsEnumerable', {value:function(property)
	{
		var proto = this;
		while (proto !== null)
		{
			if (proto.$$hasOwnProperty(property)) return proto.$$propertyIsEnumerable(property);
			
			proto = proto.__proto__;
		}
		
		return false;
	}});

	Object.defineProperty(Object.prototype, 'toString', {value:function() 
	{ 
		var val = (this.constructor !== undefined) ? this.constructor.name : this; //nodejs depd blows up without this
		return '[object ' + val + ']'; 
	}});

	Object.defineProperty(Object.prototype, '$$nextNameIndex', {value:function(index)
	{
		if (this.$$names === undefined || index === 0)
		{
			if (this.$$names === undefined) Object.defineProperty(this, '$$names', void ($es4.$$VALUE_OBJECT.value = []) || $es4.$$VALUE_OBJECT);
			else this.$$names.splice(0, this.$$names.length);
		
			var i = 0;
			for (var name in this) this.$$names[i++] = name;
		}
		
		return (index < this.$$names.length) ? index + 1 : 0;
	}});

	Object.defineProperty(Object.prototype, '$$nextName', {value:function(index)
	{	
		if (this.$$names === undefined) 
		{
			Object.defineProperty(this, '$$names', void ($es4.$$VALUE_OBJECT.value = []) || $es4.$$VALUE_OBJECT);
			
			var i = 0;
			for (var name in this) this.$$names[i++] = name;
		}

		var name = this.$$names[index - 1];
		if (!(name in this))
		{
			this.$$nextNameIndex(0);
			return this.$$nextName(index);
		}
		
		return name;
	}});

	Object.defineProperty(Object.prototype, '$$nextValue', {value:function(index)
	{
		if (this.$$names === undefined) 
		{
			Object.defineProperty(this, '$$names', void ($es4.$$VALUE_OBJECT.value = []) || $es4.$$VALUE_OBJECT);
			
			var i = 0;
			for (var name in this) this.$$names[i++] = name;
		}
		
		var name = this.$$names[index - 1];
		if (!(name in this))
		{
			this.$$nextNameIndex(0);
			return this.$$nextValue(index);
		}
		
		return this[name]; //TODO $$get(this, $$this, $$thisp, name);
	}});

	$es4.requestAnimationFrame = $es4.$$window.requestAnimationFrame || $es4.$$window.webkitRequestAnimationFrame || $es4.$$window.mozRequestAnimationFrame || $es4.$$window.oRequestAnimationFrame || $es4.$$window.msRequestAnimationFrame;

	$es4.$$class = function(Type, info, fullyQualifiedName)
	{
		if (Type.name === undefined) Object.defineProperty(Type, 'name', {value:fullyQualifiedName.split('::').pop()});
		Type.$$isclass = true;
		Type.$$fullyQualifiedName = fullyQualifiedName;
		Type.$$info = info;
		Type.toString = function() { return '[class ' + Type.name + ']'; };
		
		if (info === undefined) return Type;  //basic type
		
		Type.$$pcinit = function()
		{	
			info = Type.$$info;
		
			Type.$$info = undefined;
			Type.$$pcinit = undefined;
			
			if (info === null) 
			{
				$es4.$$extends(Type, Object);
				return;
			}
			
			if (info.INTERFACES !== undefined)
			{
				for (var i = info.INTERFACES.length; i--;) 
				{
					info.INTERFACES[i].$$pcinit();
					if (info.INTERFACES[i].$$sinit !== undefined) info.INTERFACES[i].$$sinit();
				}
			}

			if (info.EXTENDS !== undefined) 
			{
				var extendsInfo = info.EXTENDS;
				if (typeof extendsInfo === 'string')
				{ 
					var index = extendsInfo.lastIndexOf('.');
					if (index === -1) $es4.$$extends(Type, $es4.$$[''][extendsInfo]);
					else $es4.$$extends(Type, $es4.$$[extendsInfo.substring(0, index)][extendsInfo.substring(index + 1)]);
				}
				else $es4.$$extends(Type, extendsInfo);
			}
			else $es4.$$extends(Type, Object);
			
			if (info.IMPLEMENTS !== undefined)
			{
				var implementsInfo = info.IMPLEMENTS;
				for (var i = implementsInfo.length; i--;)
				{
					var implementInfo = implementsInfo[i];
					
					if (typeof implementInfo !== 'string') continue;
					
					var index = implementInfo.lastIndexOf('.');
					if (index === -1) implementsInfo[i] = $es4.$$[''][implementInfo];
					else implementsInfo[i] = $es4.$$[implementInfo.substring(0, index)][implementInfo.substring(index + 1)];
				}
				
				implementsInfo.unshift(Type);
				
				Type.$$implementsInterfaces = implementsInfo;
				Type.$$_implements = [];
				switch (implementsInfo.length)
				{
					case 1:
						break;
					case 2:
						$es4.$$implements(implementsInfo[0], implementsInfo[1]);
						break;
					case 3:
						$es4.$$implements(implementsInfo[0], implementsInfo[1], implementsInfo[2]);
						break;
					case 4:
						$es4.$$implements(implementsInfo[0], implementsInfo[1], implementsInfo[2], implementsInfo[3]);
						break;
					default:
						$es4.$$implements.apply(null, implementsInfo);
						break;
				}
			}
			else Type.$$implementsInterfaces = $es4.$$EMPTY_ARRAY;
			
			if (info.CLASSES !== undefined)
			{
				for (var i = info.CLASSES.length; i--;) 
				{
					info.CLASSES[i].$$pcinit();
					if (info.CLASSES[i].$$sinit !== undefined) info.CLASSES[i].$$sinit();
				}
			}
		};
		
		return Type;
	}

	$es4.$$function = function(Type)
	{
		Type.$$ismethod = true;
		
		return Type;
	}

	$es4.$$interface = function(Type, info, fullyQualifiedName)
	{
		if (Type.name === undefined) Object.defineProperty(Type, 'name', {value:fullyQualifiedName.split('::').pop()});
		Type.$$isclass = true;
		Type.$$fullyQualifiedName = fullyQualifiedName;
		Type.$$info = info;
		Type.toString = function() { return '[class ' + Type.name + ']'; };
		
		Type.$$pcinit = function()
		{
			info = Type.$$info;
			
			Type.$$info = undefined;
			Type.$$pcinit = undefined;
			
			if (info === null) 
			{
				Type.$$implementsInterfaces = $es4.$$EMPTY_ARRAY;
				return;
			}

			if (info.IMPLEMENTS !== undefined) 
			{
				var implementsInfo = info.IMPLEMENTS;
				for (var i = implementsInfo.length; i--;)
				{
					var implementInfo = implementsInfo[i];
					
					if (typeof implementInfo !== 'string') continue;
					
					var index = implementInfo.lastIndexOf('.');
					if (index === -1) implementsInfo[i] = $es4.$$[''][implementInfo];
					else implementsInfo[i] = $es4.$$[implementInfo.substring(0, index)][implementInfo.substring(index + 1)];
				}
				
				Type.$$implementsInterfaces = info.IMPLEMENTS;
			}
			else Type.$$implementsInterfaces = $es4.$$EMPTY_ARRAY;
		};

		return Type;
	}

	$es4.$$super = function(object)
	{
		var s = {};
		Object.defineProperty(s, '$$z', {value:function()
		{
			if (object.__proto__.$$constructor === undefined) throw new Error('trouble calling super for: ' + object.constructor.name + ', ' + object.__proto__.constructor.name);
			switch (arguments.length)
			{
				case 0:
					object.__proto__.$$constructor();
					break;
				case 1:
					object.__proto__.$$constructor(arguments[0]);
					break;
				case 2:
					object.__proto__.$$constructor(arguments[0], arguments[1]);
					break;
				case 3:
					object.__proto__.$$constructor(arguments[0], arguments[1], arguments[2]);
					break;
				default:
					object.__proto__.$$constructor.apply(null, arguments);
					break;
			}
			
		}});
		s.__proto__ = object.__proto__;
		return s;
	}

	$es4.$$super2 = function($$this, Type, $$typeString, propertyName, type, arg)
	{
		while (!Type.prototype.$$hasOwnProperty(propertyName)) Type = Type.__proto__;	
		
		if (type == 'func') 
		{
			//if ($$this[$$typeString].$$hasOwnProperty(propertyName)) return $$this[$$typeString][propertyName];
			return Object.getOwnPropertyDescriptor(Type.prototype, propertyName).get.call($$this);
		}
		
		if (type == 'get') return Object.getOwnPropertyDescriptor(Type.prototype, propertyName).get.call($$this);
		if (type == 'set') return Object.getOwnPropertyDescriptor(Type.prototype, propertyName).set.call($$this, arg);
		
		throw new Error('unknown type');
	}

	$es4.$$getOwnScope = function(scope, Type)
	{
		if (Type.prototype.$$v !== undefined) return Type.prototype;
		
		//proto method
		while (scope.constructor != Type) scope = scope.__proto__;	
		return scope;
	}

	$es4.$$getDescriptor = function(scope, propertyName)
	{
		return Object.getOwnPropertyDescriptor(scope, propertyName);
	}

	$es4.$$primitive = function(object)
	{
		if (object !== undefined && object !== null) 
		{
			switch (object.constructor.name)
			{
				case 'Boolean':
				case 'String':
				case 'Number':
				case 'uint':
				case 'int':
					return object.valueOf();
			}
		}
		
		return object;
	}

	$es4.$$construct = function(object, args)
	{	
		if (object.constructor.$$construct !== undefined) return object.constructor.$$construct(object, args);
		
		var objectTypeObject = object.__proto__;
		var Type = object.constructor.__proto__;
		var innerObject = object;
		var innerTypeObject = objectTypeObject;
		var innerObjectSave;
		var innerObjectSaveConstructor;
		var VALUE_OBJECT = $es4.$$VALUE_OBJECT;
		var MANUAL_CONSTRUCT = $es4.$$MANUAL_CONSTRUCT;
		while (Type.$$isclass !== undefined && Type !== Class)
		{
			innerObjectSave = innerObject;
			innerObjectSaveConstructor = innerObject.constructor;
			innerObject = innerObject.__proto__ = (Type !== Object) ? new Type(MANUAL_CONSTRUCT, object) : {};
			Object.defineProperty(innerObjectSave, 'constructor', void (VALUE_OBJECT.value = innerObjectSaveConstructor) || VALUE_OBJECT);
			
			innerTypeObject = innerTypeObject.__proto__ = innerObject.__proto__;
			
			Type = Type.__proto__;
		}
		innerObject.__proto__ = objectTypeObject;
		
		innerObject = object;
		while (innerObject !== objectTypeObject)
		{
			if (innerObject.$$iinit !== undefined) innerObject.$$iinit();
			innerObject = innerObject.__proto__;
		}
		
		switch (args.length)
		{
			case 0:
				object.$$constructor();
				break;
			case 1:
				object.$$constructor(args[0]);
				break;
			case 2:
				object.$$constructor(args[0], args[1]);
				break;
			case 3:
				object.$$constructor(args[0], args[1], args[2]);
				break;
			case 4:
				object.$$constructor(args[0], args[1], args[2], args[3]);
				break;
			default:
				object.$$constructor.apply(object, args);
				break;
		}
	}

	$es4.$$extends = function(object, Type)
	{
		object.__proto__ = Type;
	}

	$es4.$$implements = function(object)
	{
		var argumentsLength = arguments.length;
		for (var i = 1; i < argumentsLength; i++)
		{
			var Type = arguments[i];
			
			var implementsInterfaces = Type.$$implementsInterfaces;
			for (var j = implementsInterfaces.length; j--;) $es4.$$implements(object, implementsInterfaces[j]);
			
			object.$$_implements.push(Type);
		}
	}

	$es4.$$is = function(object, Type)
	{
		if ($es4.$$instanceof(object, Type)) return true;
		
		var proto = object;
		while (proto != null)
		{
			if (proto.constructor.$$_implements !== undefined && proto.constructor.$$_implements.indexOf(Type) !== -1) return true;
			proto = proto.__proto__;
		}
		
		return false
	}

	$es4.$$instanceof = function(object, Type)
	{
		if (object === null || object === undefined) return false;
		if (Type === Class && object.$$isclass !== undefined) return true;
		if (Type === Object && object.$$isclass === undefined) return true;
		if (object instanceof Type) return true;
		
		var typeOfObject = typeof object;
		
		switch (typeOfObject)
		{
			case 'string':
				return Type === String;
			case 'number':
				if (Type === Number) return true;
				if (Type === uint || Type === int) return Type(object) == object;
				break;
			case 'boolean':
				return Type === Boolean;
			case 'function':
				if (object.$$isclass === undefined) return Type === Function;
				if (Type === Function) return false;

				var proto = object.__proto__;
				while (proto !== null)
				{
					if (proto === Type) return true;
					proto = proto.__proto__;
				}
				
				return false;
		}
		
		return false;
	}

	$es4.$$typeof = function(object)
	{
		return (object !== null && object !== undefined && object.$$isclass !== undefined) ? 'object' : typeof object;
	}

	$es4.$$as = function(object, Type)
	{
		return (object === null || object === undefined) ? null : ($es4.$$is(object, Type)) ? object : null;
	}

	$es4.$$coerce = function(value, coerceType)
	{
		switch (coerceType)
		{
			case Object:
			case Function:
			case Array:
			case Date:
				return (!$es4.$$is(value, coerceType)) ? null : value;
			case String:
				return (value === null || value === undefined) ? null : String(value);
			case Boolean:
				if (value === true || value === false) return value;
				return Boolean(value);
			case Number:
			case uint:
			case int:
				return coerceType(value);
			default:			
				return coerceType(value);
		}
	}

	$es4.$$isPrivateProperty = function(scope, object)
	{
		if (typeof object !== 'string') return false;
		
		var proto = scope;
		while (proto !== null)
		{
			if (proto.$$hasOwnProperty(object)) return (scope.$$private !== undefined && scope.$$private.$$hasOwnProperty(object));
			
			proto = proto.__proto__;
		}
		
		throw new Error('$$isPrivateProperty:: property not found: ' + object);
	}

	$es4.$$delete = function(scope, $$this, $$thisp)
	{
		var argumentsLength = arguments.length;

		if (argumentsLength > 4) 
		{
			var i, args = new Array(argumentsLength - 1);
			for (i = 0; i < argumentsLength - 1; i += 1) args[i] = arguments[i];		
			
			scope = $es4.$$get.apply(this, args);
		}
		
		var object = arguments[argumentsLength - 1];
		
		if (scope.$$hasOwnProperty_private('$$isProxy') && (typeof object !== 'string' || !scope.$$hasOwnProperty_private(object) || ($es4.$$isPrivateProperty(scope, object) && scope !== $$thisp))) return scope.$$delete(object);
		else return delete scope[object];
	}

	$es4.$$get = function(scope, $$this, $$thisp)
	{
		var argumentsLength = arguments.length;
		if (argumentsLength === 3) return scope;
		
		var originalScope = scope;
		var index = 3;
		while (index < argumentsLength)
		{
			var object = arguments[index];
			if (scope.$$hasOwnProperty_private('$$isProxy') && (typeof object !== 'string' || !scope.$$hasOwnProperty_private(object) || ($es4.$$isPrivateProperty(scope, object) && scope !== $$thisp))) scope = scope.$$get(object);
			else if (scope.constructor.$$isclass !== undefined && scope === $$this && $$thisp.$$private !== undefined && $$thisp.$$private.$$hasOwnProperty(object)) scope = $$thisp[object];
			else scope = scope[object];
			
			index++;
		}
		
		return (scope != null && scope.call !== undefined && scope.apply !== undefined && scope.bind !== undefined && scope.$$isclass === undefined && scope.$$ismethod === undefined && Function.prototype.$$hasOwnProperty(object)) ? scope.bind(originalScope) : scope;  //this is supposed to bind things like myarray.split //instead of doing this it this way, check if the scope is an array, then see if the name of the prop is a native function, like split, then bind as necessary
	}

	$es4.$$call = function(scope, $$this, $$thisp)
	{
		var argumentsLength = arguments.length;
		
		if (argumentsLength > 5) 
		{
			var i, args = new Array(argumentsLength - 2);
			for (i = 0; i < argumentsLength - 2; i += 1) args[i] = arguments[i];	
			
			scope = $es4.$$get.apply(this, args);
		}
		
		var args = arguments[argumentsLength - 1];
		var object = arguments[argumentsLength - 2];
		
		scope = (scope.constructor.$$isclass !== undefined && scope === $$this && $$thisp.$$private !== undefined && $$thisp.$$private.$$hasOwnProperty(object)) ? $$thisp : scope;
		if (scope.$$hasOwnProperty_private('$$isProxy') && (typeof object !== 'string' || !scope.$$hasOwnProperty_private(object) || ($es4.$$isPrivateProperty(scope, object) && scope !== $$thisp))) return scope.$$call(object, args);
		else 
		{
			try { return scope[object].apply(scope, args); }
			catch (error)
			{
				if ($es4.$$window.navigator.userAgent.indexOf("Firefox") > 0 && scope && $es4.$$is(scope[object], Function)) try { trace(scope[object].toSource()); } catch (error2) {}
				
				throw error;
			}
		}
	}

	$es4.$$set = function(scope, $$this, $$thisp)
	{
		var argumentsLength = arguments.length;
		
		if (argumentsLength > 5) 
		{
			var i, args = new Array(argumentsLength - 3);
			for (i = 0; i < argumentsLength - 3; i += 1) args[i] = arguments[i];	
			
			scope = $es4.$$get.apply(this, args);
		}
		
		var operator = arguments[argumentsLength - 1];
		var value = arguments[argumentsLength - 2];
		var object = arguments[argumentsLength - 3];
		
		scope = (scope.constructor.$$isclass !== undefined && scope === $$this && $$thisp.$$private !== undefined && $$thisp.$$private.$$hasOwnProperty(object)) ? $$thisp : scope;
		
		var useSet = (scope.$$hasOwnProperty_private('$$isProxy') && (typeof object !== 'string' || !scope.$$hasOwnProperty_private(object) || ($es4.$$isPrivateProperty(scope, object) && scope !== $$thisp)));
		switch (operator)
		{
			case '=':
				return (useSet) ? scope.$$set(object, value) : scope[object] = value;
			case '+=':
				if (useSet) { return (scope instanceof XMLList && !isNaN(object)) ? scope.$$append(object, value) : scope.$$set(object, scope.$$get(object) + value); }
				return scope[object] += value;
			case '-=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) - value) : (scope[object] -= value);
			case '/=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) / value) : (scope[object] /= value);
			case '*=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) * value) : (scope[object] *= value);
			case '%=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) % value) : (scope[object] %= value);
			case '|=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) | value) : (scope[object] |= value);
			case '&=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) & value) : (scope[object] &= value);
			case '^=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) ^ value) : (scope[object] ^= value);
			case '<<':
				return (useSet) ? scope.$$set(object, scope.$$get(object) << value) : (scope[object]= scope[object] << value);
			case '>>':
				return (useSet) ? scope.$$set(object, scope.$$get(object) >> value) : (scope[object] = scope[object] >> value);
			case '>>>':
				return (useSet) ? scope.$$set(object, scope.$$get(object) >>> value) : (scope[object] = scope[object] >>> value);
			case '||=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) || value) : (scope[object] = scope[object] || value);
			case '&&=':
				return (useSet) ? scope.$$set(object, scope.$$get(object) && value) : (scope[object] = scope[object] && value);
			case '++':
			case '--':
				if (value === 'prefix')
				{
					if (useSet) return scope.$$prefix(object, operator);  //TODO
					if (operator === '++') return ++scope[object];
					else return --scope[object];
				}
				else if (value === 'postfix')
				{
					if (useSet) return scope.$$postfix(object, operator);  //TODO
					if (operator === '++') return scope[object]++;
					else return scope[object]--;
				}
			default:
				throw new Error('unknown operator used in $$set: ' + operator);
		}
	}

	$es4.$$ = {};
	$es4.$$package = function($package)
	{
		return ($es4.$$[$package] !== undefined) ? $es4.$$[$package] : $es4.$$[$package] = ($package != '') ? {} : $es4.$$window;
	}

	Object.defineProperty(Object.prototype, '$$namespace', {value:function(namespace, object, pscope)
	{
		if (object === undefined) object = this;
		if (namespace.constructor === String) return ($es4.$$namespaces[namespace] === undefined) ? $es4.$$namespaces[namespace] = {name:namespace, toString:function() { return namespace; }} : $es4.$$namespaces[namespace];
		if (object.$$namespaces === undefined) Object.defineProperty(object, '$$namespaces', void ($es4.$$VALUE_OBJECT.value = {}) || $es4.$$VALUE_OBJECT);
		namespace = (object.$$namespaces && object.$$namespaces[namespace.name]) ? object.$$namespaces[namespace.name] : object.$$namespaces[namespace.name] = {};
		if (pscope === object || pscope === undefined) return namespace;
		
		var Class;
		var SuperClass;
		var Type;
		var objectProto;
		
		//for whatever reason, mobile safari inconsistently fails when testing if Type and SuperClass are equal 
		//an empty try catch try {} catch(e) {) appears to fix this issue... MAGIC!
		//to reproduce, create about 15 - 20 new TextField() objects in a row, and remove the try catch below
		//UPDATE: THIS MAY BE UNNECESSARY NOW
		try { Class = null; } catch(e) {}; //Note: Class = null is only there to prevent closure compiler warning
		
		Class = object.constructor;
		SuperClass = pscope.constructor;
		Type = Class;
		objectProto = $es4.$$EMPTY_OBJECT.__proto__;
		
		while (Type !== SuperClass)
		{
			if (!namespace.__proto__ || namespace.__proto__ === objectProto) namespace.__proto__ = {};
			namespace = namespace.__proto__;
			Type = Type.__proto__;
		}
		return namespace;
	}});
	$es4.$$namespaces = {};

	$es4.$$expose = function(functionName, closure)
	{
		$es4.$$exposed.functionName = closure;
	}
	$es4.$$exposed = {};

	$es4.$$constructor = function(scope, func)
	{	
		Object.defineProperty(scope, '$$constructor', void ($es4.$$VALUE_OBJECT.value = func) || $es4.$$VALUE_OBJECT);
	}

	$es4.$$iinit = function(scope, func)
	{
		Object.defineProperty(scope, '$$iinit', void ($es4.$$VALUE_OBJECT.value = func) || $es4.$$VALUE_OBJECT);
	}

	$es4.$$public_namespace = function(name, scope, propName)
	{
		if ($es4.$$namespaces[name] === undefined) $es4.$$namespaces[name] = {name:name, toString:function() { return name; }};
		
		Object.defineProperty(scope, propName, {value:$es4.$$namespaces[name]});
	}
	$es4.$$private_namespace = function(name, scope, propName)
	{
		if ($es4.$$namespaces[name] === undefined) $es4.$$namespaces[name] = {name:name, toString:function() { return name; }};
		
		if (scope.$$private === undefined) Object.defineProperty(scope, '$$private', {value:{}});
		scope.$$private[name] = name;
		
		Object.defineProperty(scope, propName, {value:$es4.$$namespaces[name]});
	}
	$es4.$$protected_namespace = $es4.$$public_namespace;
	$es4.$$internal_namespace = $es4.$$public_namespace;
	$es4.$$cnamespace_namespace = function(name, scope, namespace, propName)
	{
		$es4.$$public_namespace(name, $es4.$$namespace(namespace, scope), propName);
	}

	$es4.$$getDefaultPropertyValue = function(type)
	{
		if (type == null) return undefined;
		
		switch (type)
		{
			case int:
			case uint:
				return 0;
			case Number:
				return NaN;
			case Boolean:
				return false;
		}
		
		return null;
	}

	$es4.$$public_property = function(name, scope, coerceType)
	{
		if (coerceType === undefined)
		{
			Object.defineProperty(scope, name, {value:undefined, writable:true});
			return;
		}
		
		var obj;
		var getFunc;
		var setFunc;
		if (typeof scope === 'function')
		{
			var normalized = false;
			
			getFunc = function() 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				if (normalized === true) return obj;
				
				if (typeof coerceType === 'string')
				{
					var index = coerceType.lastIndexOf('.');
					if (index === -1) coerceType = $es4.$$[''][coerceType];
					else coerceType = $es4.$$[coerceType.substring(0, index)][coerceType.substring(index + 1)];
				}
				normalized = true;
				
				return obj = $es4.$$getDefaultPropertyValue(coerceType);
			}
			setFunc = function(value) 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				if (normalized === true)
				{
					obj = $es4.$$coerce(value, coerceType);
					return;
				}
				
				if (typeof coerceType === 'string')
				{
					var index = coerceType.lastIndexOf('.');
					if (index === -1) coerceType = $es4.$$[''][coerceType];
					else coerceType = $es4.$$[coerceType.substring(0, index)][coerceType.substring(index + 1)];
				}
				normalized = true;
				
				obj = $es4.$$coerce(value, coerceType);
			}
		}
		else 
		{
			obj = $es4.$$getDefaultPropertyValue(coerceType);
			getFunc = function() { return obj; };
			setFunc = function(value) { obj = $es4.$$coerce(value, coerceType); };
		}
		
		Object.defineProperty(scope, name, {get:getFunc, set:setFunc});
	}
	 
	$es4.$$private_property = function(name, scope, coerceType)
	{
		if (scope.$$private === undefined) Object.defineProperty(scope, '$$private', void ($es4.$$VALUE_OBJECT.value = {}) || $es4.$$VALUE_OBJECT);
		scope.$$private[name] = name;
		
		if (coerceType === undefined)
		{
			Object.defineProperty(scope, name, {value:undefined, writable:true});
			return;
		}
		
		var obj;
		var getFunc;
		var setFunc;
		if (typeof scope === 'function')
		{
			var normalized = false;
			
			getFunc = function() 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				if (normalized === true) return obj;
				
				if (typeof coerceType === 'string')
				{
					var index = coerceType.lastIndexOf('.');
					if (index === -1) coerceType = $es4.$$[''][coerceType];
					else coerceType = $es4.$$[coerceType.substring(0, index)][coerceType.substring(index + 1)];
				}
				normalized = true;
				
				return obj = $es4.$$getDefaultPropertyValue(coerceType);
			}
			setFunc = function(value) 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				if (normalized === true)
				{
					obj = $es4.$$coerce(value, coerceType);
					return;
				}
				
				if (typeof coerceType === 'string')
				{
					var index = coerceType.lastIndexOf('.');
					if (index === -1) coerceType = $es4.$$[''][coerceType];
					else coerceType = $es4.$$[coerceType.substring(0, index)][coerceType.substring(index + 1)];
				}
				normalized = true;
				
				obj = $es4.$$coerce(value, coerceType);
			}
		}
		else 
		{
			obj = $es4.$$getDefaultPropertyValue(coerceType);
			getFunc = function() { return obj; };
			setFunc = function(value) { obj = $es4.$$coerce(value, coerceType); };
		}
		
		Object.defineProperty(scope, name, {get:getFunc, set:setFunc});
	}
	$es4.$$protected_property = $es4.$$public_property;
	$es4.$$internal_property = $es4.$$public_property;
	$es4.$$cnamespace_property = function(name, scope, pscope, namespace, castType)
	{
		var obj = $es4.$$DEFAULT_PROPERTY_VALUE;
		var getFunc;
		var setFunc;
		if (typeof scope === 'function')
		{
			var resolved = castType === undefined;
			
			castType = namespace;
			namespace = pscope;
			pscope = undefined;
			
			getFunc = function() 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				if (obj !== $es4.$$DEFAULT_PROPERTY_VALUE) return obj;
				
				return obj = (resolved) ? $es4.$$getDefaultPropertyValue(castType) : $es4.$$getDefaultPropertyValue(resolved = castType = castType());
			}
			setFunc = function(value) 
			{ 
				if (scope.$$cinit !== undefined) scope.$$cinit(); 
				
				obj = (resolved) ? $es4.$$coerce(value, castType) : $es4.$$coerce(value, resolved = castType = castType());
			}
		}
		else 
		{
			obj = $es4.$$getDefaultPropertyValue(castType);
			getFunc = function() { return obj; };
			setFunc = function(value) { obj = $es4.$$coerce(value, castType); };
		}
		Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, {get:getFunc, set:setFunc});
	}

	$es4.$$public_function = function(name, scope, func, returnCastType)
	{
		if (returnCastType === undefined)
		{
			Object.defineProperty(scope, name, void ($es4.$$VALUE_OBJECT.value = func) || $es4.$$VALUE_OBJECT);
			func.$$ismethod = true;
			return;
		}
		
		var wrapFunc;
		
		if (typeof scope === 'function')
		{
			var normalized = false;
			wrapFunc = function() 
			{ 
				if (normalized === false)
				{
					if (typeof returnCastType === 'string')
					{
						var index = returnCastType.lastIndexOf('.');
						if (index === -1) returnCastType = $es4.$$[''][returnCastType];
						else returnCastType = $es4.$$[returnCastType.substring(0, index)][returnCastType.substring(index + 1)];
					}
					
					normalized = true;
				}
				
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
				
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		else 
		{
			wrapFunc = function() 
			{ 
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
			
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		
		Object.defineProperty(scope, name, void ($es4.$$VALUE_OBJECT.value = wrapFunc) || $es4.$$VALUE_OBJECT);
		wrapFunc.$$ismethod = true;
	}
	$es4.$$private_function = function(name, scope, func, returnCastType)
	{
		if (scope.$$private === undefined) Object.defineProperty(scope, '$$private', void ($es4.$$VALUE_OBJECT.value = {}) || $es4.$$VALUE_OBJECT);
		scope.$$private[name] = name;
		
		if (returnCastType === undefined)
		{
			Object.defineProperty(scope, name, void ($es4.$$VALUE_OBJECT.value = func) || $es4.$$VALUE_OBJECT);
			func.$$ismethod = true;
			return;
		}
		
		var wrapFunc;
		
		if (typeof scope === 'function')
		{
			var normalized = false;
			wrapFunc = function() 
			{ 
				if (normalized === false)
				{
					if (typeof returnCastType === 'string')
					{
						var index = returnCastType.lastIndexOf('.');
						if (index === -1) returnCastType = $es4.$$[''][returnCastType];
						else returnCastType = $es4.$$[returnCastType.substring(0, index)][returnCastType.substring(index + 1)];
					}
					
					normalized = true;
				}
				
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
				
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		else 
		{
			wrapFunc = function() 
			{ 
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
			
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		
		Object.defineProperty(scope, name, void ($es4.$$VALUE_OBJECT.value = wrapFunc) || $es4.$$VALUE_OBJECT);
		wrapFunc.$$ismethod = true;
	}
	$es4.$$protected_function = $es4.$$public_function;
	$es4.$$internal_function = $es4.$$public_function;
	$es4.$$cnamespace_function = function(name, scope, pscope, namespace, func, returnCastType)
	{
		if (returnCastType === undefined)
		{
			if (typeof scope === 'function')
			{
				returnCastType = func;
				func = namespace;
				namespace = pscope;
				pscope = undefined;
			}
			
			Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, void ($es4.$$VALUE_OBJECT.value = func) || $es4.$$VALUE_OBJECT);
			func.$$ismethod = true;
			return;
		}
		
		var wrapFunc;

		if (typeof scope === 'function')
		{
			returnCastType = func;
			func = namespace;
			namespace = pscope;
			pscope = undefined;
			
			var normalized = false;
			wrapFunc = function() 
			{ 
				if (normalized === false)
				{
					if (typeof returnCastType === 'string')
					{
						var index = returnCastType.lastIndexOf('.');
						if (index === -1) returnCastType = $es4.$$[''][returnCastType];
						else returnCastType = $es4.$$[returnCastType.substring(0, index)][returnCastType.substring(index + 1)];
					}
					
					normalized = true;
				}
				
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
				
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		else
		{
			wrapFunc = function() 
			{ 
				var result;
				switch (arguments.length)
				{
					case 0:
						result = func();
						break;
					case 1:
						result = func(arguments[0]);
						break;
					case 2:
						result = func(arguments[0], arguments[1]);
						break;
					case 3:
						result = func(arguments[0], arguments[1], arguments[2]);
						break;
					default:
						var i, length = arguments.length, args = new Array(length);
						for (i = 0; i < length; i += 1) args[i] = arguments[i];
						result = func.apply(null, args);
						break;
				}
			
				return $es4.$$coerce(result, returnCastType); 
			};
		}
		
		Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, void ($es4.$$VALUE_OBJECT.value = wrapFunc) || $es4.$$VALUE_OBJECT);
		wrapFunc.$$ismethod = true;
	}

	$es4.$$getter = function(name, scope, get_func, castType)
	{
		Object.defineProperty(scope, name, {get:get_func});
	}
	$es4.$$setter = function(name, scope, set_func, castType)
	{
		Object.defineProperty(scope, name, {set:set_func});
	}

	$es4.$$public_accessor = function(name, scope, get_func, set_func)
	{
		if (get_func !== null && set_func !== null) Object.defineProperty(scope, name, {get:get_func, set:set_func});
		else if (get_func !== null) Object.defineProperty(scope, name, {get:get_func});
		else Object.defineProperty(scope, name, {set:set_func});
	}
	$es4.$$private_accessor = function(name, scope, get_func, set_func)
	{
		if (scope.$$private === undefined) Object.defineProperty(scope, '$$private', void ($es4.$$VALUE_OBJECT.value = {}) || $es4.$$VALUE_OBJECT);
		scope.$$private[name] = name;
		
		if (get_func !== null && set_func !== null) Object.defineProperty(scope, name, {get:get_func, set:set_func});
		else if (get_func !== null) Object.defineProperty(scope, name, {get:get_func});
		else Object.defineProperty(scope, name, {set:set_func});
	}
	$es4.$$protected_accessor = $es4.$$public_accessor;
	$es4.$$internal_accessor = $es4.$$public_accessor;
	$es4.$$cnamespace_accessor = function(name, scope, pscope, namespace, get_func, set_func)
	{
		if (typeof scope === 'function')
		{
			set_func = get_func;
			get_func = namespace;
			namespace = pscope;
			pscope = undefined;
		}
		
		if (get_func !== null && set_func !== null) Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, {get:get_func, set:set_func});
		else if (get_func !== null) Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, {get:get_func});
		else Object.defineProperty($es4.$$namespace(namespace, scope, pscope), name, {set:set_func});
	}

	$es4.$$window.trace = function() //returns false if trace returns before outputting to console
	{
		//if (!$es4.$$window.loaderInfoParams || ($es4.$$window.loaderInfoParams['debug'] !== 'true' && $es4.$$window.loaderInfoParams['trace'] !== 'true')) return false;
		
		if (arguments[0] === ':::benchmark:::') arguments[0] = 'benchmark time: ' + (new Date().getTime() - $es4.$$['player'].Player.getStartTime());
		
		var trace = document.getElementById('traceOutJS');
		var argumentsLength = arguments.length;
		var output = '';
		for (var i = 0; i < argumentsLength; i++) output += arguments[i] + ' ';
		
		console.log(output);
		
		if (!trace) return true;
		
		var div = document.createElement('div');
		div.setAttribute('tabindex', -1);
		div.innerHTML = output;
		
		if (trace.firstChild) trace.insertBefore(div, trace.firstChild);
		else trace.appendChild(div);
		
		return true;
	}

	$es4.$$window.toString = function() { return '[object global]'; }
	Function.__proto__.toString = function() { return 'function Function() {}'; }

	$es4.$$throwArgumentError = function()
	{
		throw new ArgumentError('Argument count mismatch on class coercion.  Expected 1, got 0.');
	}

	$es4.$$window.isXMLName = function()
	{
		throw new Error('isXMLName is not supported at this time.');
	}

	/*
	$es4.$$window.onerror = function(errorMsg, url, lineNumber, colno, error) 
	{
		var event = document.createEvent('CustomEvent');
		event.initCustomEvent('ERROR', false, false, {'msg':errorMsg, 'url':url, 'line':lineNumber, 'error':error});
		$es4.$$window.dispatchEvent(event);
		
		var message = errorMsg + ', ' + url + ', ' + lineNumber;
		if (!trace(message)) console.log(message);
	};
	*/

	$es4.$$class(Number, undefined, 'Number');
	$es4.$$class(String, undefined, 'String');
	$es4.$$class(Array, undefined, 'Array');
	$es4.$$class(Object, undefined, 'Object');
	$es4.$$class(Boolean, undefined, 'Boolean');

	$es4.$$package('').Class = (function()
	{
		function Class()
		{
			if (arguments.length !== 0) return (arguments[0] !== null && arguments[0].$$isclass !== undefined) ? arguments[0] : null;
			else throw new TypeError('Class$$ is not a constructor.');
		}
		
		return $es4.$$class(Class, null, 'Class');
	})();

	$es4.$$Function = Function;
	$es4.$$package('').Function = (function()
	{
		function Function()
		{
			return (arguments.length !== 0) ? ((typeof arguments[0] === 'function') ? arguments[0] : null) : this;
		}
		Function.prototype = $es4.$$Function;

		return $es4.$$class(Function, null, 'Function');
	})();

	$es4.$$package('').int = (function()
	{
		int.MAX_VALUE = 2147483647;
		int.MIN_VALUE = -2147483648;
		
		function int(value)
		{
			var value = new Number(value >> 0);
		
			return (this instanceof int) ? value : value.valueOf();
		}
		int.prototype = Number;
		
		return $es4.$$class(int, null, 'int');
	})();

	$es4.$$package('').uint = (function()
	{
		uint.MAX_VALUE = 4294967295;
		uint.MIN_VALUE = 0;
		
		function uint(value)
		{
			var value = new Number(value >>> 0);
		
			return (this instanceof uint) ? value : value.valueOf();
		}
		
		return $es4.$$class(uint, null, 'uint');
	})();

	$es4.$$package('').Namespace = (function()
	{	
		function Namespace()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Namespace) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Namespace) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});
			
			//constructor
			$es4.$$constructor($$thisp, (function()
			{
			}));
			
			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
			
			throw new Error('Namespace is not supported at this time.');
		}
		
		return $es4.$$class(Namespace, null, 'Namespace');
	})();

	$es4.$$package('').QName = (function()
	{	
		function QName()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof QName) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], QName) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});
			
			//constructor
			$es4.$$constructor($$thisp, (function()
			{
			}));
			
			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
			
			throw new Error('QName is not supported at this time.');
		}
		
		return $es4.$$class(QName, null, 'QName');
	})();

	$es4.$$Error = Error;
	$es4.$$package('').Error = (function()
	{	
		function Error()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Error) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Error) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});
			
			//properties
			$es4.$$protected_property('name', $$thisp, String);
			$es4.$$public_property('message', $$thisp, String);
			
			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);

				$$this.name = $$this.constructor.name;
				$$this.message = message;
				
				//$$Error.call($$this);
				//if (Error.captureStackTrace !== undefined) Error.captureStackTrace($$this, $$this.constructor);
			}));
			
			//method
			$es4.$$public_function('toString', $$thisp, (function()
			{
				return $$this.name + ': ' + $$this.message;
			}));
			
			//method
			$es4.$$public_function('getStackTrace', $$thisp, (function()
			{
				return $$this.name + ': ' + $$this.message;
			}));
			
			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		Error.prototype = new $es4.$$Error;
		
		return $es4.$$class(Error, null, 'Error');
	})();


	$es4.$$package('').ArgumentError = (function()
	{
		function ArgumentError()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof ArgumentError) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ArgumentError) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);
				
				$es4.$$super($$thisp)(message);

				$$this.name = $$this.constructor.name;
			}));		

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		
		return $es4.$$class(ArgumentError, {EXTENDS:'Error'}, 'ArgumentError');
	})();

	$es4.$$package('').DefinitionError = (function()
	{
		function DefinitionError()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof DefinitionError) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], DefinitionError) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);
				
				$es4.$$super($$thisp)(message);
				
				$$this.name = $$this.constructor.name;
			}));		

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		
		return $es4.$$class(DefinitionError, {EXTENDS:'Error'}, 'DefinitionError');
	})();

	$es4.$$package('').SecurityError = (function()
	{
		function SecurityError()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof SecurityError) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], SecurityError) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);
				
				$es4.$$super($$thisp)(message);
				
				$$this.name = $$this.constructor.name;
			}));		

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		
		return $es4.$$class(SecurityError, {EXTENDS:'Error'}, 'SecurityError');
	})();

	$es4.$$package('').VerifyError = (function()
	{
		function VerifyError()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof VerifyError) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], VerifyError) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);
				
				$es4.$$super($$thisp)(message);
				
				$$this.name = $$this.constructor.name;
			}));
			
			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		
		return $es4.$$class(VerifyError, {EXTENDS:'Error'}, 'Error');
	})();

	$es4.$$package('').TypeError = (function()
	{
		function TypeError()
		{
			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;
			
			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof TypeError) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TypeError) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//constructor
			$es4.$$constructor($$thisp, (function($$$$message)
			{
				//set default parameter values
				var message = (0 > arguments.length - 1) ? '' : $es4.$$coerce($$$$message, String);
				
				$es4.$$super($$thisp)(message);
				
				$$this.name = $$this.constructor.name;
			}));
			
			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT) 
			{
				var $$i, $$length = arguments.length, $$args = new Array($$length);
				for ($$i = 0; $$i < $$length; $$i += 1) $$args[$$i]  = arguments[$$i];
			
				$es4.$$construct($$this, $$args);
			}
		}
		
		return $es4.$$class(TypeError, {EXTENDS:'Error'}, 'TypeError');
	})();

	$es4.$$[''].Function.$$pcinit();
	$es4.$$[''].Class.$$pcinit();
	$es4.$$[''].int.$$pcinit();
	$es4.$$[''].uint.$$pcinit();
	$es4.$$[''].Namespace.$$pcinit();
	$es4.$$[''].QName.$$pcinit();
	$es4.$$[''].Error.$$pcinit();
	$es4.$$[''].ArgumentError.$$pcinit();
	$es4.$$[''].DefinitionError.$$pcinit();
	$es4.$$[''].SecurityError.$$pcinit();
	$es4.$$[''].VerifyError.$$pcinit();
	$es4.$$[''].TypeError.$$pcinit();
}

/*
---

script: Array.sortOn.js

description: Adds Array.sortOn function and related constants that works like in ActionScript for sorting arrays of objects (applying all same strict rules)

license: MIT-style license.

authors:
- gonchuki

docs: http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/Array.html#sortOn()

requires:
- core/1.2.4: [Array]

provides: 
- [Array.sortOn, Array.CASEINSENSITIVE, Array.DESCENDING, Array.UNIQUESORT, Array.RETURNINDEXEDARRAY, Array.NUMERIC]

...
*/

if (Array.prototype.$sort === undefined)
{
	Array.CASEINSENSITIVE = 1;
	Array.DESCENDING = 2;
	Array.UNIQUESORT = 4;
	Array.RETURNINDEXEDARRAY = 8;
	Array.NUMERIC = 16;

	var dup_fn = function(field, field_options) 
	{
		var filtered = (field_options & Array.NUMERIC) 
					   ? this.map(function(item) {return parseFloat(item[field]); })
					   : (field_options & Array.CASEINSENSITIVE)
					   ? this.map(function(item) {return item[field].toLowerCase(); })
					   : this.map(function(item) {return item[field]; });
		return filtered.length !== [].combine(filtered).length;
	};
	  
	  var sort_fn = function(item_a, item_b, fields, options) 
	  {
		return (function sort_by(fields, options) 
		{
			var ret, a, b, 
			opts = options[0],
			sub_fields = fields[0].match(/[^.]+/g);
		  
			(function get_values(s_fields, s_a, s_b) 
			{
				var field = s_fields[0];
				if (s_fields.length > 1) 
				{
					get_values(s_fields.slice(1), s_a[field], s_b[field]);
				} 
				else 
				{
					a = s_a[field].toString();
					b = s_b[field].toString();
				}
			})(sub_fields, item_a, item_b);
		  
			if (opts & Array.NUMERIC) 
			{
				ret = parseFloat(a) - parseFloat(b);
			} 
			else 
			{
				if (opts & Array.CASEINSENSITIVE) { a = a.toLowerCase(); b = b.toLowerCase(); }
			
				ret = (a > b) ? 1 : (a < b) ? -1 : 0;
			}
		  
			if ((ret === 0) && (fields.length > 1)) 
			{
				ret = sort_by(fields.slice(1), options.slice(1));
			} 
			else if (opts & Array.DESCENDING) 
			{
				ret *= -1;
			}
		  
			return ret;
		})(fields, options);
	  };
	  
	  var sort_fn2 = function(item_a, item_b, options) 
	  {
		return (function sort_by(options) 
		{
			var ret, a, b;
			var opts = options[0];
			a = item_a;
			b = item_b;
			
			if (opts & Array.NUMERIC) 
			{
				ret = parseFloat(a) - parseFloat(b);
			} 
			else 
			{
				if (opts & Array.CASEINSENSITIVE) { a = a.toLowerCase(); b = b.toLowerCase(); }
			
				ret = (a > b) ? 1 : (a < b) ? -1 : 0;
			}
		  
			if ((ret === 0) && (fields.length > 1)) 
			{
				ret = sort_by(options.slice(1));
			} 
			else if (opts & Array.DESCENDING) 
			{
				ret *= -1;
			}
		  
			return ret;
		})(options);
	  };
	  
	  Object.defineProperty(Array.prototype, 'combine', {enumerable:false, value:function(array) 
	  {
		for (var i = 0, l = array.length; i < l; i++) 
		{
			if (this.indexOf(array[i]) == -1) this.push(array[i]); 
		}
		
		return this;
	  }});
	  
	  Object.defineProperty(Array.prototype, 'sortOn', {enumerable:false, value:function(fields, options) 
	  {
		  fields = (fields instanceof Array) ? fields : [fields];
		  options = (options instanceof Array) ? options : [options];
		  
		  if (options.length !== fields.length) options = [];
		  
		  if ((options[0] & Array.UNIQUESORT) && (fields.some(function(field, i){return dup_fn(field, options[i]);}))) return 0;
		  
		  var curry_sort = function(item_a, item_b) {
			return sort_fn(item_a, item_b, fields, options);
		  };
		  
		  if (options[0] & Array.RETURNINDEXEDARRAY)
			return this.slice().sort(curry_sort);
		  else
			this.sort(curry_sort);
		}
	  });
	  
	Object.defineProperty(Array.prototype, '$sort', {value:Array.prototype.sort});
	  
	Object.defineProperty(Array.prototype, 'sort', {enumerable:false, value:function() 
	{
		if (arguments.length == 0) return this.$sort();
		if (typeof arguments[0] === "function") return this.$sort(arguments[0]);
	  
		options = [arguments[0]];
	  
		if (options[0] & Array.UNIQUESORT) throw new Error('sort option not supported at this time');
	  
		var curry_sort = function(item_a, item_b) 
		{
			return sort_fn2(item_a, item_b, options);
		};
		  
		if (options[0] & Array.RETURNINDEXEDARRAY) return this.slice().$sort(curry_sort);
		else return this.$sort(curry_sort);
	}
	});
}

//__ES4__

(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; 

//flash.utils.flash_proxy
$es4.$$package('flash.utils').flash_proxy = $es4.$$namespace('http://www.sweetrush.com/flash/proxy', true);
//flash.utils.flash_proxy


//flash.net.ObjectEncoding
$es4.$$package('flash.net').ObjectEncoding = (function ()
{
	//imports
	var IDynamicPropertyWriter;

	//properties
	var $$j = {};
	ObjectEncoding.AMF0 = 0;
	ObjectEncoding.AMF3 = 3;
	ObjectEncoding.DEFAULT = 3;

	//class pre initializer
	ObjectEncoding.$$sinit = (function ()
	{
		ObjectEncoding.$$sinit = undefined;

		//initialize imports
		IDynamicPropertyWriter = $es4.$$['flash.net'].IDynamicPropertyWriter;

		//set prototype and constructor
		ObjectEncoding.prototype = Object.create(Object.prototype);
		Object.defineProperty(ObjectEncoding.prototype, "constructor", { value: ObjectEncoding, enumerable: false });

		//hold private values
		Object.defineProperty(ObjectEncoding.prototype, '$$v', {value:{}});
	});

	//class initializer
	ObjectEncoding.$$cinit = (function ()
	{
		ObjectEncoding.$$cinit = undefined;
	});

	Object.defineProperty(ObjectEncoding, 'dynamicPropertyWriter', {get:function ()
	{
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		throw $es4.$$primitive(new Error('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"'));
	}, set:function ($$$$object)
	{
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		//set default parameter values
		var object = $es4.$$coerce($$$$object, IDynamicPropertyWriter);

		throw $es4.$$primitive(new Error('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"'));
	}});

	function ObjectEncoding()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof ObjectEncoding) || $$this.$$ObjectEncoding !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ObjectEncoding) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			ObjectEncoding.$$construct($$this, $$args);
		}
	}

	//construct
	ObjectEncoding.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$ObjectEncoding', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		ObjectEncoding.$$iinit($$this);

		//call constructor
		if (args !== undefined) ObjectEncoding.$$constructor.apply($$this, args);
	});

	//initializer
	ObjectEncoding.$$iinit = (function ($$this)
	{
	});

	//constructor
	ObjectEncoding.$$constructor = (function ()
	{
		var $$this = this;
		throw $es4.$$primitive(new Error('ObjectEncoding: attempted call to an unimplemented constructor'));
	});

	return $es4.$$class(ObjectEncoding, null, 'flash.net::ObjectEncoding');
})();
//flash.net.ObjectEncoding


//flash.display.Sprite
$es4.$$package('flash.display').Sprite = (function ()
{
	//class pre initializer
	Sprite.$$sinit = (function ()
	{
		Sprite.$$sinit = undefined;

		//set prototype and constructor
		Sprite.prototype = Object.create(Object.prototype);
		Object.defineProperty(Sprite.prototype, "constructor", { value: Sprite, enumerable: false });

		//hold private values
		Object.defineProperty(Sprite.prototype, '$$v', {value:{}});
	});

	//class initializer
	Sprite.$$cinit = (function ()
	{
		Sprite.$$cinit = undefined;
	});

	function Sprite()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Sprite) || $$this.$$Sprite !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Sprite) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Sprite.$$construct($$this, $$args);
		}
	}

	//construct
	Sprite.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Sprite.$$cinit !== undefined) Sprite.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Sprite', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Sprite.$$iinit($$this);

		//call constructor
		if (args !== undefined) Sprite.$$constructor.apply($$this, args);
	});

	//initializer
	Sprite.$$iinit = (function ($$this)
	{
	});

	//constructor
	Sprite.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Sprite, null, 'flash.display::Sprite');
})();
//flash.display.Sprite


//flash.events.EventDispatcher
$es4.$$package('flash.events').EventDispatcher = (function ()
{
	//imports
	var Event;
	var IEventDispatcher;
	var EventPhase;

	//class pre initializer
	EventDispatcher.$$sinit = (function ()
	{
		EventDispatcher.$$sinit = undefined;

		//initialize imports
		Event = $es4.$$['flash.events'].Event;
		IEventDispatcher = $es4.$$['flash.events'].IEventDispatcher;
		EventPhase = $es4.$$['flash.events'].EventPhase;

		//set prototype and constructor
		EventDispatcher.prototype = Object.create(Object.prototype);
		Object.defineProperty(EventDispatcher.prototype, "constructor", { value: EventDispatcher, enumerable: false });

		//hold private values
		Object.defineProperty(EventDispatcher.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(EventDispatcher.prototype, '$__properties', {
		get:function ()
		{
			var $$this = this;

			function $__properties($$$$object)
			{
				//set default parameter values
				var object = (0 > arguments.length - 1) ? null : $$$$object;

				if ($$this.$$EventDispatcher.$_properties === undefined)
				{
					object.EventDispatcherScope = {$_listeners:{}};
					object.TLScope = $$this;
					return $$this.$$EventDispatcher.$_properties = object;
				}
				return $$this.$$EventDispatcher.$_properties;
			}

			return $$this.$$EventDispatcher.$$$__properties || ($$this.$$EventDispatcher.$$$__properties = $__properties);
		}});


		//public instance method
		Object.defineProperty(EventDispatcher.prototype, 'addEventListener', {
		get:function ()
		{
			var $$this = this;

			function addEventListener($$$$type, $$$$listener, $$$$useCapture, $$$$priority, $$$$useWeakReference)
			{
				//set default parameter values
				var type = $es4.$$coerce($$$$type, String);
				var listener = $es4.$$coerce($$$$listener, Function);
				var useCapture = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$useCapture, Boolean);
				var priority = (3 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$priority, int);
				var useWeakReference = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$useWeakReference, Boolean);

				if (useWeakReference)
				{
					trace('Warning: useWeakReference not supported in EventDispatacher addEventListener');
				}
				if (useCapture)
				{
					trace('Warning: useCapture not supported in EventDispatacher addEventListener');
				}
				var listenersByType = $$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_listeners;
				var eventObj = {type:type, method:listener, useCapture:useCapture, priority:priority, useWeakReference:useWeakReference};
				if (!(type in listenersByType))
				{
					listenersByType[type] = [eventObj];
				}
				else
				{
					var listeners = $es4.$$coerce(listenersByType[type], Array);
					for (var i = $es4.$$coerce(listeners.length, int); i--;)
					{
						if (listener == listeners[i].method)
						{
							return;
						}
					}
					listenersByType[type].push(eventObj);
				}
				listenersByType[type].sort(eventCompare);

				function eventCompare($$$$item1, $$$$item2) 
				{
					//set default parameter values
					var item1 = $es4.$$coerce($$$$item1, Object);
					var item2 = $es4.$$coerce($$$$item2, Object);

					if (item1.priority > item2.priority)
					{
						return -1;
					}
					else if (item1.priority < item2.priority)
					{
						return 1;
					}
					else
					{
						return 0;
					}
				}
;
			}

			return $$this.$$EventDispatcher.$$addEventListener || ($$this.$$EventDispatcher.$$addEventListener = addEventListener);
		}});


		//public instance method
		Object.defineProperty(EventDispatcher.prototype, 'dispatchEvent', {
		get:function ()
		{
			var $$this = this;

			function dispatchEvent($$$$event)
			{
				//set default parameter values
				var event = $es4.$$coerce($$$$event, Event);

				var properties = event.$__properties().TLScope;
				var listeners = $es4.$$coerce($$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_listeners[event.type], Array);
				var target = $$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_target;
				var bubble = false;
				if (!bubble && !listeners)
				{
					return $es4.$$coerce(!properties.isDefaultPrevented(), Boolean);
				}
				var parents = null;
				properties = event.$__properties().EventScope;
				if (listeners && !properties.$_propagationStopped && !properties.$_immediatePropagationStopped)
				{
					event = $es4.$$coerce(properties.$_withTarget(event, target), Event);
					properties = event.$__properties().EventScope;
					properties.$_eventPhase = EventPhase.AT_TARGET;
					properties.$_currentTarget = $$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_target;
					EventDispatcher.$_processListeners(event, listeners);
				}
				if (bubble && !properties.$_propagationStopped && !properties.$_immediatePropagationStopped)
				{
					var index = 0;
					var parentsLength = parents.length;
					while (parentsLength > index)
					{
						var currentTarget = parents[index];
						var currentBubbleListeners = $es4.$$coerce(currentTarget.$__properties().EventDispatcherScope.$_listeners[event.type], Array);
						if (currentBubbleListeners && currentBubbleListeners.length)
						{
							event = $es4.$$coerce(properties.$_withTarget(event, target), Event);
							properties = event.$__properties().EventScope;
							properties.$_eventPhase = EventPhase.BUBBLING_PHASE;
							event.$__properties().EventScope.$_currentTarget = currentTarget;
							EventDispatcher.$_processListeners(event, currentBubbleListeners);
							if (properties.$_propagationStopped || properties.$_immediatePropagationStopped)
							{
								break;
							}
						}
						index++;
					}
				}
				properties = event.$__properties().TLScope;
				return $es4.$$coerce(!properties.isDefaultPrevented(), Boolean);
			}

			return $$this.$$EventDispatcher.$$dispatchEvent || ($$this.$$EventDispatcher.$$dispatchEvent = dispatchEvent);
		}});


		//public instance method
		Object.defineProperty(EventDispatcher.prototype, 'hasEventListener', {
		get:function ()
		{
			var $$this = this;

			function hasEventListener($$$$type)
			{
				//set default parameter values
				var type = $es4.$$coerce($$$$type, String);

				return $es4.$$coerce($$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_listeners[type], Boolean);
			}

			return $$this.$$EventDispatcher.$$hasEventListener || ($$this.$$EventDispatcher.$$hasEventListener = hasEventListener);
		}});


		//public instance method
		Object.defineProperty(EventDispatcher.prototype, 'removeEventListener', {
		get:function ()
		{
			var $$this = this;

			function removeEventListener($$$$type, $$$$listener, $$$$useCapture)
			{
				//set default parameter values
				var type = $es4.$$coerce($$$$type, String);
				var listener = $es4.$$coerce($$$$listener, Function);
				var useCapture = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$useCapture, Boolean);

				if (useCapture)
				{
					trace('Warning: useCapture not supported in EventDispatacher removeEventListener');
				}
				var listenersByType = $$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_listeners;
				var listeners = $es4.$$coerce(listenersByType[type], Array);
				if (!listeners)
				{
					return;
				}
				for (var i = listeners.length; i--;)
				{
					if (listeners[i].method != listener)
					{
						continue;
					}
					if (listeners.length == 1)
					{
						delete listenersByType[type];
					}
					else
					{
						listeners.splice(i, 1);
					}
				}
			}

			return $$this.$$EventDispatcher.$$removeEventListener || ($$this.$$EventDispatcher.$$removeEventListener = removeEventListener);
		}});


		//public instance method
		Object.defineProperty(EventDispatcher.prototype, 'willTrigger', {
		get:function ()
		{
			var $$this = this;

			function willTrigger($$$$type)
			{
				//set default parameter values
				var type = $es4.$$coerce($$$$type, String);

				return $es4.$$coerce($$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_listeners[type], Boolean);
			}

			return $$this.$$EventDispatcher.$$willTrigger || ($$this.$$EventDispatcher.$$willTrigger = willTrigger);
		}});

		//properties
		EventDispatcher.prototype.$$v.$_properties = {
		get:function () { var $$this = this.$$this; return $$this.$$EventDispatcher.$$p.$_properties; },
		set:function (value) { var $$this = this.$$this; $$this.$$EventDispatcher.$$p.$_properties = value }
		};

	});

	//class initializer
	EventDispatcher.$$cinit = (function ()
	{
		EventDispatcher.$$cinit = undefined;
	});

	//private static method
	EventDispatcher.$_processListeners = (function ($$$$event, $$$$listeners)
	{
		if (EventDispatcher.$$cinit !== undefined) EventDispatcher.$$cinit();

		//set default parameter values
		var event = $es4.$$coerce($$$$event, Event);
		var listeners = $es4.$$coerce($$$$listeners, Array);

		listeners = listeners.slice();
		var listenersLength = listeners.length;
		var properties = event.$__properties();
		for (var i = 0; i < listenersLength; i++)
		{
			if (listeners[i].method(event) === false)
			{
				properties.TLScope.stopPropagation();
				properties.TLScope.preventDefault();
			}
			if (properties.EventScope.$_immediatePropagationStopped)
			{
				break;
			}
		}
	});
	function EventDispatcher()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof EventDispatcher) || $$this.$$EventDispatcher !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], EventDispatcher) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			EventDispatcher.$$construct($$this, $$args);
		}
	}

	//construct
	EventDispatcher.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (EventDispatcher.$$cinit !== undefined) EventDispatcher.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$EventDispatcher', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$EventDispatcher, '$_properties', EventDispatcher.prototype.$$v.$_properties);

		//initialize properties
		EventDispatcher.$$iinit($$this);

		//call constructor
		if (args !== undefined) EventDispatcher.$$constructor.apply($$this, args);
	});

	//initializer
	EventDispatcher.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$EventDispatcher.$$p.$_properties = undefined;
	
	});

	//constructor
	EventDispatcher.$$constructor = (function ($$$$target)
	{
		var $$this = this;
		//set default parameter values
		var target = (0 > arguments.length - 1) ? null : $es4.$$coerce($$$$target, IEventDispatcher);

		if ($$this.$$EventDispatcher.$_properties === undefined)
		{
			$$this.$__properties({});
		}
		$$this.$$EventDispatcher.$_properties.EventDispatcherScope.$_target = target || $$this;
	});

	return $es4.$$class(EventDispatcher, {IMPLEMENTS:['flash.events.IEventDispatcher']}, 'flash.events::EventDispatcher');
})();
//flash.events.EventDispatcher


//flash.events.ErrorEvent
$es4.$$package('flash.events').ErrorEvent = (function ()
{
	//imports
	var TextEvent;
	var Event;
	var ErrorEvent;

	//properties
	var $$j = {};
	ErrorEvent.ERROR = 'error';

	//class pre initializer
	ErrorEvent.$$sinit = (function ()
	{
		ErrorEvent.$$sinit = undefined;

		//initialize imports
		TextEvent = $es4.$$['flash.events'].TextEvent;
		Event = $es4.$$['flash.events'].Event;

		//ensure $$sinit is called on super class
		if (TextEvent.$$sinit !== undefined) TextEvent.$$sinit();

		//set prototype and constructor
		ErrorEvent.prototype = Object.create(TextEvent.prototype);
		Object.defineProperty(ErrorEvent.prototype, "constructor", { value: ErrorEvent, enumerable: false });

		//hold private values
		Object.defineProperty(ErrorEvent.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(ErrorEvent.prototype, 'clone', {
		get:function ()
		{
			var $$this = this;

			function clone()
			{
				return $es4.$$coerce($es4.$$primitive(new ErrorEvent($$this.type, $$this.bubbles, $$this.cancelable, $$this.text, $$this.errorID)), Event);
			}

			return $$this.$$ErrorEvent.$$clone || ($$this.$$ErrorEvent.$$clone = clone);
		}});


		//public instance method
		Object.defineProperty(ErrorEvent.prototype, 'toString', {
		get:function ()
		{
			var $$this = this;

			function toString()
			{
				return $$this.formatToString('ErrorEvent', 'bubbles', 'cancelable', 'text', 'errorID');
			}

			return $$this.$$ErrorEvent.$$toString || ($$this.$$ErrorEvent.$$toString = toString);
		}});

		Object.defineProperty(ErrorEvent.prototype, 'errorID', {get:function ()
		{
			var $$this = this;
			return $$this.$$ErrorEvent._errorID;
		}});

		//properties
		ErrorEvent.prototype.$$v._errorID = {
		get:function () { var $$this = this.$$this; return $$this.$$ErrorEvent.$$p._errorID; },
		set:function (value) { var $$this = this.$$this; $$this.$$ErrorEvent.$$p._errorID = $es4.$$coerce(value, int); }
		};

	});

	//class initializer
	ErrorEvent.$$cinit = (function ()
	{
		ErrorEvent.$$cinit = undefined;
	});

	function ErrorEvent()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof ErrorEvent) || $$this.$$ErrorEvent !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ErrorEvent) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			ErrorEvent.$$construct($$this, $$args);
		}
	}

	//construct
	ErrorEvent.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (ErrorEvent.$$cinit !== undefined) ErrorEvent.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$ErrorEvent', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$ErrorEvent, '_errorID', ErrorEvent.prototype.$$v._errorID);

		//call construct on super
		TextEvent.$$construct($$this);

		//initialize properties
		ErrorEvent.$$iinit($$this);

		//call constructor
		if (args !== undefined) ErrorEvent.$$constructor.apply($$this, args);
	});

	//initializer
	ErrorEvent.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$ErrorEvent.$$p._errorID = $es4.$$coerce(0, int);
	
		//call iinit on super
		TextEvent.$$iinit($$this);
	});

	//constructor
	ErrorEvent.$$constructor = (function ($$$$type, $$$$bubbles, $$$$cancelable, $$$$text, $$$$id)
	{
		var $$this = this;
		//set default parameter values
		var type = $es4.$$coerce($$$$type, String);
		var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
		var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);
		var text = (3 > arguments.length - 1) ? "" : $es4.$$coerce($$$$text, String);
		var id = (4 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$id, int);

		TextEvent.$$constructor.call($$this, type, bubbles, cancelable, text);
		$$this.$$ErrorEvent._errorID = id;
	});

	return $es4.$$class(ErrorEvent, {EXTENDS:'flash.events.TextEvent'}, 'flash.events::ErrorEvent');
})();
//flash.events.ErrorEvent


//flash.events.EventPhase
$es4.$$package('flash.events').EventPhase = (function ()
{
	//properties
	var $$j = {};
	EventPhase.AT_TARGET = 2;
	EventPhase.BUBBLING_PHASE = 3;
	EventPhase.CAPTURING_PHASE = 1;

	//class pre initializer
	EventPhase.$$sinit = (function ()
	{
		EventPhase.$$sinit = undefined;

		//set prototype and constructor
		EventPhase.prototype = Object.create(Object.prototype);
		Object.defineProperty(EventPhase.prototype, "constructor", { value: EventPhase, enumerable: false });

		//hold private values
		Object.defineProperty(EventPhase.prototype, '$$v', {value:{}});
	});

	//class initializer
	EventPhase.$$cinit = (function ()
	{
		EventPhase.$$cinit = undefined;
	});

	function EventPhase()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof EventPhase) || $$this.$$EventPhase !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], EventPhase) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			EventPhase.$$construct($$this, $$args);
		}
	}

	//construct
	EventPhase.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (EventPhase.$$cinit !== undefined) EventPhase.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$EventPhase', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		EventPhase.$$iinit($$this);

		//call constructor
		if (args !== undefined) EventPhase.$$constructor.apply($$this, args);
	});

	//initializer
	EventPhase.$$iinit = (function ($$this)
	{
	});

	//constructor
	EventPhase.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(EventPhase, null, 'flash.events::EventPhase');
})();
//flash.events.EventPhase


//flash.utils.Proxy
$es4.$$package('flash.utils').Proxy = (function ()
{
	//imports
	var flash_proxy;

	//class pre initializer
	Proxy.$$sinit = (function ()
	{
		Proxy.$$sinit = undefined;

		//initialize imports
		flash_proxy = $es4.$$['flash.utils'].flash_proxy;

		//set prototype and constructor
		Proxy.prototype = Object.create(Object.prototype);
		Object.defineProperty(Proxy.prototype, "constructor", { value: Proxy, enumerable: false });

		//hold private values
		Object.defineProperty(Proxy.prototype, '$$v', {value:{}});

		//private instance method
		Proxy.prototype.$$v.$$get = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$get($$$$key)
			{
				//set default parameter values
				var key = $$$$key;

				return $$this.$$namespace($$this.flash_proxy).getProperty(key);
			}

			return $$this.$$Proxy.$$p.$$$$get || ($$this.$$Proxy.$$p.$$$$get = $$get);
		}};


		//private instance method
		Proxy.prototype.$$v.$$set = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$set($$$$key, $$$$value)
			{
				//set default parameter values
				var key = $$$$key;
				var value = $$$$value;

				$$this.$$namespace($$this.flash_proxy).setProperty(key, value);
				return value;
			}

			return $$this.$$Proxy.$$p.$$$$set || ($$this.$$Proxy.$$p.$$$$set = $$set);
		}};


		//private instance method
		Proxy.prototype.$$v.$$call = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$call($$$$name, $$$$args)
			{
				//set default parameter values
				var name = $$$$name;
				var args = $es4.$$coerce($$$$args, Array);

				args.unshift(name);
				return $$this.$$namespace($$this.flash_proxy).callProperty.apply($$this, args);
			}

			return $$this.$$Proxy.$$p.$$$$call || ($$this.$$Proxy.$$p.$$$$call = $$call);
		}};


		//private instance method
		Proxy.prototype.$$v.$$delete = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$delete($$$$key)
			{
				//set default parameter values
				var key = $$$$key;

				return $$this.$$namespace($$this.flash_proxy).deleteProperty(key);
			}

			return $$this.$$Proxy.$$p.$$$$delete || ($$this.$$Proxy.$$p.$$$$delete = $$delete);
		}};


		//private instance method
		Proxy.prototype.$$v.$$nextName = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextName($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$namespace($$this.flash_proxy).nextName(index);
			}

			return $$this.$$Proxy.$$p.$$$$nextName || ($$this.$$Proxy.$$p.$$$$nextName = $$nextName);
		}};


		//private instance method
		Proxy.prototype.$$v.$$nextNameIndex = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextNameIndex($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$namespace($$this.flash_proxy).nextNameIndex(index);
			}

			return $$this.$$Proxy.$$p.$$$$nextNameIndex || ($$this.$$Proxy.$$p.$$$$nextNameIndex = $$nextNameIndex);
		}};


		//private instance method
		Proxy.prototype.$$v.$$nextValue = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextValue($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$namespace($$this.flash_proxy).nextValue(index);
			}

			return $$this.$$Proxy.$$p.$$$$nextValue || ($$this.$$Proxy.$$p.$$$$nextValue = $$nextValue);
		}};

		//properties
		Proxy.prototype.$$v.$$isProxy = {
		get:function () { var $$this = this.$$this; return $$this.$$Proxy.$$p.$$isProxy; },
		set:function (value) { var $$this = this.$$this; $$this.$$Proxy.$$p.$$isProxy = $es4.$$coerce(value, Boolean); }
		};

		Proxy.prototype.$$v.$keys = {
		get:function () { var $$this = this.$$this; return $$this.$$Proxy.$$p.$keys; },
		set:function (value) { var $$this = this.$$this; $$this.$$Proxy.$$p.$keys = $es4.$$coerce(value, Array); }
		};

		Proxy.prototype.$$v.$values = {
		get:function () { var $$this = this.$$this; return $$this.$$Proxy.$$p.$values; },
		set:function (value) { var $$this = this.$$this; $$this.$$Proxy.$$p.$values = $es4.$$coerce(value, Array); }
		};

	});

	//class initializer
	Proxy.$$cinit = (function ()
	{
		Proxy.$$cinit = undefined;
	});

	function Proxy()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Proxy) || $$this.$$Proxy !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Proxy) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Proxy.$$construct($$this, $$args);
		}
	}

	//construct
	Proxy.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Proxy.$$cinit !== undefined) Proxy.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Proxy', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//custom namespace method
			$es4.$$cnamespace_function('deleteProperty', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name)
			{
				//set default parameter values
				var name = $$$$name;

				for (var i = 0; i < $$this.$$Proxy.$keys.length; i++)
				{
					if ($$this.$$Proxy.$keys[i] == name)
					{
						break;
					}
				}
				if (i == $$this.$$Proxy.$keys.length)
				{
					return false;
				}
				$$this.$$Proxy.$keys.splice(i, 1);
				$$this.$$Proxy.$values.splice(i, 1);
				return true;
			}));



			//custom namespace method
			$es4.$$cnamespace_function('getProperty', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name)
			{
				//set default parameter values
				var name = $$$$name;

				for (var i = 0; i < $$this.$$Proxy.$keys.length; i++)
				{
					if ($$this.$$Proxy.$keys[i] == name)
					{
						break;
					}
				}
				if (i == $$this.$$Proxy.$keys.length)
				{
					return undefined;
				}
				return $$this.$$Proxy.$values[i];
			}));



			//custom namespace method
			$es4.$$cnamespace_function('setProperty', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name, $$$$value)
			{
				//set default parameter values
				var name = $$$$name;
				var value = $$$$value;

				for (var i = 0; i < $$this.$$Proxy.$keys.length; i++)
				{
					if ($$this.$$Proxy.$keys[i] == name)
					{
						break;
					}
				}
				$$this.$$Proxy.$keys[i] = name;
				$$this.$$Proxy.$values[i] = value;
			}));



			//custom namespace method
			$es4.$$cnamespace_function('hasProperty', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name)
			{
				//set default parameter values
				var name = $$$$name;

				for (var i = 0; i < $$this.$$Proxy.$keys.length; i++)
				{
					if ($$this.$$Proxy.$keys[i] == name)
					{
						return true;
					}
				}
				return false;
			}));



			//custom namespace method
			$es4.$$cnamespace_function('nextName', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $es4.$$coerce($$this.$$Proxy.$keys[index - 1], String);
			}));



			//custom namespace method
			$es4.$$cnamespace_function('nextNameIndex', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return (index < $$this.$$Proxy.$keys.length) ? index + 1 : 0;
			}));



			//custom namespace method
			$es4.$$cnamespace_function('nextValue', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$Proxy.$values[index - 1];
			}));



			//custom namespace method
			$es4.$$cnamespace_function('callProperty', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name, $$$$rest)
			{
				//set default parameter values
				var name = $$$$name;
				for (var $$i = 1, $$length = arguments.length, rest = new Array($$length - 1); $$i < $$length; $$i += 1) rest[$$i - 1] = arguments[$$i];

				for (var i = 0; i < $$this.$$Proxy.$keys.length; i++)
				{
					if ($$this.$$Proxy.$keys[i] == name)
					{
						break;
					}
				}
				if (i == $$this.$$Proxy.$keys.length)
				{
					throw $es4.$$primitive(new Error('property not found'));
				}
				return $$this.$$Proxy.$values[i].apply($$this, rest);
			}));



			//custom namespace method
			$es4.$$cnamespace_function('getDescendants', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name)
			{
				//set default parameter values
				var name = $$$$name;

				throw $es4.$$primitive(new Error('Proxy: not implemented'));
			}));



			//custom namespace method
			$es4.$$cnamespace_function('isAttribute', $$this, $$this.$$Proxy.$$ns, $['flash.utils'].flash_proxy, (function ($$$$name)
			{
				//set default parameter values
				var name = $$$$name;

				throw $es4.$$primitive(new Error('Proxy: not implemented'));
			}));


		Object.defineProperty($$this.$$Proxy, '$$isProxy', Proxy.prototype.$$v.$$isProxy);
		Object.defineProperty($$this.$$Proxy, '$keys', Proxy.prototype.$$v.$keys);
		Object.defineProperty($$this.$$Proxy, '$values', Proxy.prototype.$$v.$values);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$get', Proxy.prototype.$$v.$$get);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$set', Proxy.prototype.$$v.$$set);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$call', Proxy.prototype.$$v.$$call);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$delete', Proxy.prototype.$$v.$$delete);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$nextName', Proxy.prototype.$$v.$$nextName);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$nextNameIndex', Proxy.prototype.$$v.$$nextNameIndex);

		//private instance method
		Object.defineProperty($$this.$$Proxy, '$$nextValue', Proxy.prototype.$$v.$$nextValue);

		//initialize properties
		Proxy.$$iinit($$this);

		//call constructor
		if (args !== undefined) Proxy.$$constructor.apply($$this, args);
	});

	//initializer
	Proxy.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$Proxy.$$p.$$isProxy = $es4.$$coerce(true, Boolean);
		$$this.$$Proxy.$$p.$keys = $es4.$$coerce([], Array);
		$$this.$$Proxy.$$p.$values = $es4.$$coerce([], Array);
	
	});

	//constructor
	Proxy.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Proxy, null, 'flash.utils::Proxy');
})();
//flash.utils.Proxy


//flash.utils.Endian
$es4.$$package('flash.utils').Endian = (function ()
{
	//properties
	var $$j = {};
	Endian.BIG_ENDIAN = "bigEndian";
	Endian.LITTLE_ENDIAN = "littleEndian";

	//class pre initializer
	Endian.$$sinit = (function ()
	{
		Endian.$$sinit = undefined;

		//set prototype and constructor
		Endian.prototype = Object.create(Object.prototype);
		Object.defineProperty(Endian.prototype, "constructor", { value: Endian, enumerable: false });

		//hold private values
		Object.defineProperty(Endian.prototype, '$$v', {value:{}});
	});

	//class initializer
	Endian.$$cinit = (function ()
	{
		Endian.$$cinit = undefined;
	});

	function Endian()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Endian) || $$this.$$Endian !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Endian) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Endian.$$construct($$this, $$args);
		}
	}

	//construct
	Endian.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Endian.$$cinit !== undefined) Endian.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Endian', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Endian.$$iinit($$this);

		//call constructor
		if (args !== undefined) Endian.$$constructor.apply($$this, args);
	});

	//initializer
	Endian.$$iinit = (function ($$this)
	{
	});

	//constructor
	Endian.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Endian, null, 'flash.utils::Endian');
})();
//flash.utils.Endian


//flash.utils.Dictionary
$es4.$$package('flash.utils').Dictionary = (function ()
{
	//class pre initializer
	Dictionary.$$sinit = (function ()
	{
		Dictionary.$$sinit = undefined;

		//set prototype and constructor
		Dictionary.prototype = Object.create(Object.prototype);
		Object.defineProperty(Dictionary.prototype, "constructor", { value: Dictionary, enumerable: false });

		//hold private values
		Object.defineProperty(Dictionary.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(Dictionary.prototype, 'toJSON', {
		get:function ()
		{
			var $$this = this;

			function toJSON($$$$k)
			{
				//set default parameter values
				var k = $es4.$$coerce($$$$k, String);

				throw $es4.$$primitive(new Error('Dictionary: does not support toJSON at this time'));
			}

			return $$this.$$Dictionary.$$toJSON || ($$this.$$Dictionary.$$toJSON = toJSON);
		}});


		//private instance method
		Dictionary.prototype.$$v.$$get = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$get($$$$key)
			{
				//set default parameter values
				var key = $$$$key;

				if (!$$this.$$Dictionary.$map.has(key))
				{
					return undefined;
				}
				return $$this.$$Dictionary.$map.get(key).value;
			}

			return $$this.$$Dictionary.$$p.$$$$get || ($$this.$$Dictionary.$$p.$$$$get = $$get);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$set = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$set($$$$key, $$$$value)
			{
				//set default parameter values
				var key = $$$$key;
				var value = $$$$value;

				$$this.$$Dictionary.$map.set(key, {index:$$this.$$Dictionary.$values.length, value:value});
				$$this.$$Dictionary.$keys.push(key);
				$$this.$$Dictionary.$values.push(value);
			}

			return $$this.$$Dictionary.$$p.$$$$set || ($$this.$$Dictionary.$$p.$$$$set = $$set);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$call = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$call($$$$name, $$$$args)
			{
				//set default parameter values
				var name = $$$$name;
				var args = $es4.$$coerce($$$$args, Array);

				return $$this.$$Dictionary.$map.get(name).value.apply($$this, args);
			}

			return $$this.$$Dictionary.$$p.$$$$call || ($$this.$$Dictionary.$$p.$$$$call = $$call);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$delete = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$delete($$$$key)
			{
				//set default parameter values
				var key = $$$$key;

				if ($$this.$$Dictionary.$map.has(key))
				{
					var value = $$this.$$Dictionary.$map.get(key);
					$$this.$$Dictionary.$values.splice(value.index, 1);
					$$this.$$Dictionary.$keys.splice(value.index, 1);
				}
				return $es4.$$coerce($$this.$$Dictionary.$map.delete(key), Boolean);
			}

			return $$this.$$Dictionary.$$p.$$$$delete || ($$this.$$Dictionary.$$p.$$$$delete = $$delete);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$nextName = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextName($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$Dictionary.$keys[index - 1];
			}

			return $$this.$$Dictionary.$$p.$$$$nextName || ($$this.$$Dictionary.$$p.$$$$nextName = $$nextName);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$nextNameIndex = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextNameIndex($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return (index < $$this.$$Dictionary.$values.length) ? index + 1 : 0;
			}

			return $$this.$$Dictionary.$$p.$$$$nextNameIndex || ($$this.$$Dictionary.$$p.$$$$nextNameIndex = $$nextNameIndex);
		}};


		//private instance method
		Dictionary.prototype.$$v.$$nextValue = {
		get:function ()
		{
			var $$this = this.$$this;

			function $$nextValue($$$$index)
			{
				//set default parameter values
				var index = $es4.$$coerce($$$$index, int);

				return $$this.$$Dictionary.$values[index - 1];
			}

			return $$this.$$Dictionary.$$p.$$$$nextValue || ($$this.$$Dictionary.$$p.$$$$nextValue = $$nextValue);
		}};

		//properties
		Dictionary.prototype.$$v.$$isProxy = {
		get:function () { var $$this = this.$$this; return $$this.$$Dictionary.$$p.$$isProxy; },
		set:function (value) { var $$this = this.$$this; $$this.$$Dictionary.$$p.$$isProxy = $es4.$$coerce(value, Boolean); }
		};

		Dictionary.prototype.$$v.$map = {
		get:function () { var $$this = this.$$this; return $$this.$$Dictionary.$$p.$map; },
		set:function (value) { var $$this = this.$$this; $$this.$$Dictionary.$$p.$map = value }
		};

		Dictionary.prototype.$$v.$keys = {
		get:function () { var $$this = this.$$this; return $$this.$$Dictionary.$$p.$keys; },
		set:function (value) { var $$this = this.$$this; $$this.$$Dictionary.$$p.$keys = $es4.$$coerce(value, Array); }
		};

		Dictionary.prototype.$$v.$values = {
		get:function () { var $$this = this.$$this; return $$this.$$Dictionary.$$p.$values; },
		set:function (value) { var $$this = this.$$this; $$this.$$Dictionary.$$p.$values = $es4.$$coerce(value, Array); }
		};

	});

	//class initializer
	Dictionary.$$cinit = (function ()
	{
		Dictionary.$$cinit = undefined;
	});

	function Dictionary()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Dictionary) || $$this.$$Dictionary !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Dictionary) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Dictionary.$$construct($$this, $$args);
		}
	}

	//construct
	Dictionary.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Dictionary.$$cinit !== undefined) Dictionary.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Dictionary', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$Dictionary, '$$isProxy', Dictionary.prototype.$$v.$$isProxy);
		Object.defineProperty($$this.$$Dictionary, '$map', Dictionary.prototype.$$v.$map);
		Object.defineProperty($$this.$$Dictionary, '$keys', Dictionary.prototype.$$v.$keys);
		Object.defineProperty($$this.$$Dictionary, '$values', Dictionary.prototype.$$v.$values);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$get', Dictionary.prototype.$$v.$$get);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$set', Dictionary.prototype.$$v.$$set);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$call', Dictionary.prototype.$$v.$$call);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$delete', Dictionary.prototype.$$v.$$delete);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$nextName', Dictionary.prototype.$$v.$$nextName);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$nextNameIndex', Dictionary.prototype.$$v.$$nextNameIndex);

		//private instance method
		Object.defineProperty($$this.$$Dictionary, '$$nextValue', Dictionary.prototype.$$v.$$nextValue);

		//initialize properties
		Dictionary.$$iinit($$this);

		//call constructor
		if (args !== undefined) Dictionary.$$constructor.apply($$this, args);
	});

	//initializer
	Dictionary.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$Dictionary.$$p.$$isProxy = $es4.$$coerce(true, Boolean);
		$$this.$$Dictionary.$$p.$map = $es4.$$primitive(new global.Map());
		$$this.$$Dictionary.$$p.$keys = $es4.$$coerce([], Array);
		$$this.$$Dictionary.$$p.$values = $es4.$$coerce([], Array);
	
	});

	//constructor
	Dictionary.$$constructor = (function ($$$$weakKeys)
	{
		var $$this = this;
		//set default parameter values
		var weakKeys = (0 > arguments.length - 1) ? false : $es4.$$coerce($$$$weakKeys, Boolean);

		if (weakKeys)
		{
			trace('Warning: Dictionary: does not support weakKeys at this time');
		}
	});

	return $es4.$$class(Dictionary, null, 'flash.utils::Dictionary');
})();
//flash.utils.Dictionary


//flash.events.TextEvent
$es4.$$package('flash.events').TextEvent = (function ()
{
	//imports
	var TextEvent;
	var Event;

	//properties
	var $$j = {};
	TextEvent.LINK = "link";
	TextEvent.TEXT_INPUT = "textInput";

	//class pre initializer
	TextEvent.$$sinit = (function ()
	{
		TextEvent.$$sinit = undefined;

		//initialize imports
		Event = $es4.$$['flash.events'].Event;

		//ensure $$sinit is called on super class
		if (Event.$$sinit !== undefined) Event.$$sinit();

		//set prototype and constructor
		TextEvent.prototype = Object.create(Event.prototype);
		Object.defineProperty(TextEvent.prototype, "constructor", { value: TextEvent, enumerable: false });

		//hold private values
		Object.defineProperty(TextEvent.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(TextEvent.prototype, 'clone', {
		get:function ()
		{
			var $$this = this;

			function clone()
			{
				return $es4.$$coerce($es4.$$primitive(new TextEvent($$this.type, $$this.bubbles, $$this.cancelable, $$this.text)), Event);
			}

			return $$this.$$TextEvent.$$clone || ($$this.$$TextEvent.$$clone = clone);
		}});


		//public instance method
		Object.defineProperty(TextEvent.prototype, 'toString', {
		get:function ()
		{
			var $$this = this;

			function toString()
			{
				return $$this.formatToString('TextEvent', 'bubbles', 'cancelable', 'text');
			}

			return $$this.$$TextEvent.$$toString || ($$this.$$TextEvent.$$toString = toString);
		}});

		Object.defineProperty(TextEvent.prototype, 'text', {get:function ()
		{
			var $$this = this;
			return $$this.$$TextEvent._text;
		}, set:function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, String);

			var $$this = this;
			$$this.$$TextEvent._text = value;
		}});

		//properties
		TextEvent.prototype.$$v._text = {
		get:function () { var $$this = this.$$this; return $$this.$$TextEvent.$$p._text; },
		set:function (value) { var $$this = this.$$this; $$this.$$TextEvent.$$p._text = $es4.$$coerce(value, String); }
		};

	});

	//class initializer
	TextEvent.$$cinit = (function ()
	{
		TextEvent.$$cinit = undefined;
	});

	function TextEvent()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof TextEvent) || $$this.$$TextEvent !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TextEvent) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			TextEvent.$$construct($$this, $$args);
		}
	}

	//construct
	TextEvent.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (TextEvent.$$cinit !== undefined) TextEvent.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$TextEvent', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$TextEvent, '_text', TextEvent.prototype.$$v._text);

		//call construct on super
		Event.$$construct($$this);

		//initialize properties
		TextEvent.$$iinit($$this);

		//call constructor
		if (args !== undefined) TextEvent.$$constructor.apply($$this, args);
	});

	//initializer
	TextEvent.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$TextEvent.$$p._text = $es4.$$coerce(undefined, String);
	
		//call iinit on super
		Event.$$iinit($$this);
	});

	//constructor
	TextEvent.$$constructor = (function ($$$$type, $$$$bubbles, $$$$cancelable, $$$$text)
	{
		var $$this = this;
		//set default parameter values
		var type = $es4.$$coerce($$$$type, String);
		var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
		var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);
		var text = (3 > arguments.length - 1) ? "" : $es4.$$coerce($$$$text, String);

		Event.$$constructor.call($$this, type, bubbles, cancelable);
		$$this.$$TextEvent._text = text;
	});

	return $es4.$$class(TextEvent, {EXTENDS:'flash.events.Event'}, 'flash.events::TextEvent');
})();
//flash.events.TextEvent


//flash.utils.ByteArray
$es4.$$package('flash.utils').ByteArray = (function ()
{
	//imports
	var ObjectEncoding;
	var IDataInput;
	var Endian;
	var ByteArray;
	var IDataOutput;

	//properties
	var $$j = {};
	ByteArray.BYTES_GROW_SIZE = 1024;

	//class pre initializer
	ByteArray.$$sinit = (function ()
	{
		ByteArray.$$sinit = undefined;

		//initialize imports
		ObjectEncoding = $es4.$$['flash.net'].ObjectEncoding;
		IDataInput = $es4.$$['flash.utils'].IDataInput;
		Endian = $es4.$$['flash.utils'].Endian;
		IDataOutput = $es4.$$['flash.utils'].IDataOutput;

		//set prototype and constructor
		ByteArray.prototype = Object.create(Object.prototype);
		Object.defineProperty(ByteArray.prototype, "constructor", { value: ByteArray, enumerable: false });

		//hold private values
		Object.defineProperty(ByteArray.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(ByteArray.prototype, '$__properties', {
		get:function ()
		{
			var $$this = this;

			function $__properties($$$$object)
			{
				//set default parameter values
				var object = (0 > arguments.length - 1) ? null : $$$$object;

				if ($$this.$$ByteArray.$_properties === undefined)
				{
					var arrayBuffer = $es4.$$primitive(new window.ArrayBuffer());
					var dataView = $es4.$$primitive(new window.DataView(arrayBuffer));
					object.ByteArrayScope = {$_arrayBuffer:arrayBuffer, $_dataView:dataView, $_bytePosition:0, $_byteLength:0, $_endian:Endian.BIG_ENDIAN, $_growSize:ByteArray.BYTES_GROW_SIZE};
					object.TLScope = $$this;
					return $$this.$$ByteArray.$_properties = object;
				}
				return $$this.$$ByteArray.$_properties;
			}

			return $$this.$$ByteArray.$$$__properties || ($$this.$$ByteArray.$$$__properties = $__properties);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, '$__getArrayBuffer', {
		get:function ()
		{
			var $$this = this;

			function $__getArrayBuffer()
			{
				return $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.slice(0, $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength);
			}

			return $$this.$$ByteArray.$$$__getArrayBuffer || ($$this.$$ByteArray.$$$__getArrayBuffer = $__getArrayBuffer);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, '$__setArrayBuffer', {
		get:function ()
		{
			var $$this = this;

			function $__setArrayBuffer($$$$arrayBuffer)
			{
				//set default parameter values
				var arrayBuffer = $$$$arrayBuffer;

				$$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView = $es4.$$primitive(new window.DataView(arrayBuffer));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = arrayBuffer.byteLength;
			}

			return $$this.$$ByteArray.$$$__setArrayBuffer || ($$this.$$ByteArray.$$$__setArrayBuffer = $__setArrayBuffer);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'clear', {
		get:function ()
		{
			var $$this = this;

			function clear()
			{
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer = null;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView = null;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition = 0;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = 0;
			}

			return $$this.$$ByteArray.$$clear || ($$this.$$ByteArray.$$clear = clear);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readBoolean', {
		get:function ()
		{
			var $$this = this;

			function readBoolean()
			{
				return $es4.$$coerce($$this.readByte() !== 0, Boolean);
			}

			return $$this.$$ByteArray.$$readBoolean || ($$this.$$ByteArray.$$readBoolean = readBoolean);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readByte', {
		get:function ()
		{
			var $$this = this;

			function readByte()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getInt8($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 1;
				return $es4.$$coerce(value, int);
			}

			return $$this.$$ByteArray.$$readByte || ($$this.$$ByteArray.$$readByte = readByte);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readBytes', {
		get:function ()
		{
			var $$this = this;

			function readBytes($$$$writeTo, $$$$offset, $$$$length)
			{
				//set default parameter values
				var writeTo = $es4.$$coerce($$$$writeTo, $es4.$$['flash.utils'].ByteArray);
				var offset = (1 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$offset, uint);
				var length = (2 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$length, uint);

				var position = writeTo.position;
				var bytesAvailable = $es4.$$coerce($$this.bytesAvailable, uint);
				writeTo.writeBytes($$this, $$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, length);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += bytesAvailable;
				writeTo.position = position;
			}

			return $$this.$$ByteArray.$$readBytes || ($$this.$$ByteArray.$$readBytes = readBytes);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readDouble', {
		get:function ()
		{
			var $$this = this;

			function readDouble()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getFloat64($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 8;
				return $es4.$$coerce(value, Number);
			}

			return $$this.$$ByteArray.$$readDouble || ($$this.$$ByteArray.$$readDouble = readDouble);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readFloat', {
		get:function ()
		{
			var $$this = this;

			function readFloat()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getFloat32($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
				return $es4.$$coerce(value, Number);
			}

			return $$this.$$ByteArray.$$readFloat || ($$this.$$ByteArray.$$readFloat = readFloat);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readInt', {
		get:function ()
		{
			var $$this = this;

			function readInt()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getInt32($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
				return $es4.$$coerce(value, int);
			}

			return $$this.$$ByteArray.$$readInt || ($$this.$$ByteArray.$$readInt = readInt);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readMultiByte', {
		get:function ()
		{
			var $$this = this;

			function readMultiByte($$$$length, $$$$charSet)
			{
				//set default parameter values
				var length = $es4.$$coerce($$$$length, uint);
				var charSet = $es4.$$coerce($$$$charSet, String);

				if (charSet !== 'iso-8859-1' && charSet != 'utf-8')
				{
					throw $es4.$$primitive(new Error('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"'));
				}
				if (charSet === 'utf-8')
				{
					return $$this.readUTFBytes(length);
				}
				var value = String.fromCharCode.apply(null, $es4.$$primitive(new window.Uint8Array($$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer, $$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, length)));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += length;
				return $es4.$$coerce(value, String);
			}

			return $$this.$$ByteArray.$$readMultiByte || ($$this.$$ByteArray.$$readMultiByte = readMultiByte);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readShort', {
		get:function ()
		{
			var $$this = this;

			function readShort()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getInt16($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 2;
				return $es4.$$coerce(value, int);
			}

			return $$this.$$ByteArray.$$readShort || ($$this.$$ByteArray.$$readShort = readShort);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readUnsignedByte', {
		get:function ()
		{
			var $$this = this;

			function readUnsignedByte()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getUint8($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 1;
				return $es4.$$coerce(value, uint);
			}

			return $$this.$$ByteArray.$$readUnsignedByte || ($$this.$$ByteArray.$$readUnsignedByte = readUnsignedByte);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readUnsignedInt', {
		get:function ()
		{
			var $$this = this;

			function readUnsignedInt()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getUint32($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
				return $es4.$$coerce(value, uint);
			}

			return $$this.$$ByteArray.$$readUnsignedInt || ($$this.$$ByteArray.$$readUnsignedInt = readUnsignedInt);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readUnsignedShort', {
		get:function ()
		{
			var $$this = this;

			function readUnsignedShort()
			{
				var value = $$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.getUint16($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 2;
				return $es4.$$coerce(value, uint);
			}

			return $$this.$$ByteArray.$$readUnsignedShort || ($$this.$$ByteArray.$$readUnsignedShort = readUnsignedShort);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readUTF', {
		get:function ()
		{
			var $$this = this;

			function readUTF()
			{
				var length = $$this.readUnsignedShort();
				return $$this.readUTFBytes(length);
			}

			return $$this.$$ByteArray.$$readUTF || ($$this.$$ByteArray.$$readUTF = readUTF);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readUTFBytes', {
		get:function ()
		{
			var $$this = this;

			function readUTFBytes($$$$length)
			{
				//set default parameter values
				var length = $es4.$$coerce($$$$length, uint);

				if (length == 0)
				{
					return '';
				}
				var string = '';
				var index = 0;
				var bytes = $es4.$$primitive(new window.Uint8Array($$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer, $$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, length));
				if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF)
				{
					index = 3;
				}
				var byte1 = 0;
				var byte2 = 0;
				var byte3 = 0;
				var byte4 = 0;
				while (index < bytes.length)
				{
					byte1 = $es4.$$coerce(bytes[index], int);
					if (byte1 < 0x80)
					{
						string += String.fromCharCode(byte1);
						index++;
						continue;
					}
					if (byte1 > 0xBF && byte1 < 0xE0)
					{
						if (index + 1 >= bytes.length)
						{
							throw "UTF-8 Decode failed. Two byte character was truncated.";
						}
						byte2 = $es4.$$coerce(bytes[index + 1], int);
						string += String.fromCharCode(((byte1 & 31) << 6) | (byte2 & 63));
						index += 2;
						continue;
					}
					if (byte1 > 0xDF && byte1 < 0xF0)
					{
						if (index + 2 >= bytes.length)
						{
							throw "UTF-8 Decode failed. Multi byte character was truncated.";
						}
						byte2 = $es4.$$coerce(bytes[index + 1], int);
						byte3 = $es4.$$coerce(bytes[index + 2], int);
						string += String.fromCharCode(((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63));
						index += 3;
						continue;
					}
					var charCode = ((byte1 & 0x07) << 18 | (bytes[index + 1] & 0x3F) << 12 | (bytes[index + 2] & 0x3F) << 6 | bytes[index + 3] & 0x3F) - 0x010000;
					string += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
					index += 4;
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += length;
				return string;
			}

			return $$this.$$ByteArray.$$readUTFBytes || ($$this.$$ByteArray.$$readUTFBytes = readUTFBytes);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeBoolean', {
		get:function ()
		{
			var $$this = this;

			function writeBoolean($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, Boolean);

				$$this.writeByte(int(value));
			}

			return $$this.$$ByteArray.$$writeBoolean || ($$this.$$ByteArray.$$writeBoolean = writeBoolean);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeByte', {
		get:function ()
		{
			var $$this = this;

			function writeByte($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, int);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 1, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setInt8(bytePosition, value);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 1;
			}

			return $$this.$$ByteArray.$$writeByte || ($$this.$$ByteArray.$$writeByte = writeByte);
		}});


		//private instance method
		ByteArray.prototype.$$v.writeUnsignedByte = {
		get:function ()
		{
			var $$this = this.$$this;

			function writeUnsignedByte($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, int);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 1, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setUint8(bytePosition, value);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 1;
			}

			return $$this.$$ByteArray.$$p.$$writeUnsignedByte || ($$this.$$ByteArray.$$p.$$writeUnsignedByte = writeUnsignedByte);
		}};


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeBytes', {
		get:function ()
		{
			var $$this = this;

			function writeBytes($$$$readFrom, $$$$offset, $$$$length)
			{
				//set default parameter values
				var readFrom = $es4.$$coerce($$$$readFrom, $es4.$$['flash.utils'].ByteArray);
				var offset = (1 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$offset, uint);
				var length = (2 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$length, uint);

				if (length == 0)
				{
					length = readFrom.length - offset;
				}
				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = bytePosition + length;
				var arrayBuffer = $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer;
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						var oldArrayBuffer = arrayBuffer;
						arrayBuffer = $es4.$$primitive(new window.ArrayBuffer(newBytePosition + ($$this.$$ByteArray.$_properties.ByteArrayScope.$_growSize = ($$this.$$ByteArray.$_properties.ByteArrayScope.$_growSize * 2))));
						$es4.$$primitive(new window.Uint8Array(arrayBuffer).set($es4.$$primitive(new window.Uint8Array(oldArrayBuffer))));
					}
					$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
				}
				$es4.$$primitive(new window.Uint8Array(arrayBuffer).set($es4.$$primitive(new window.Uint8Array(readFrom.$__properties().ByteArrayScope.$_arrayBuffer.slice(offset, offset + length))), bytePosition));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView = $es4.$$primitive(new window.DataView(arrayBuffer));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition = newBytePosition;
			}

			return $$this.$$ByteArray.$$writeBytes || ($$this.$$ByteArray.$$writeBytes = writeBytes);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeDouble', {
		get:function ()
		{
			var $$this = this;

			function writeDouble($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, Number);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 8, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setFloat64(bytePosition, value, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 8;
			}

			return $$this.$$ByteArray.$$writeDouble || ($$this.$$ByteArray.$$writeDouble = writeDouble);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeFloat', {
		get:function ()
		{
			var $$this = this;

			function writeFloat($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, Number);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setFloat32(bytePosition, value, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
			}

			return $$this.$$ByteArray.$$writeFloat || ($$this.$$ByteArray.$$writeFloat = writeFloat);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeInt', {
		get:function ()
		{
			var $$this = this;

			function writeInt($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, int);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setInt32(bytePosition, value, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
			}

			return $$this.$$ByteArray.$$writeInt || ($$this.$$ByteArray.$$writeInt = writeInt);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeMultiByte', {
		get:function ()
		{
			var $$this = this;

			function writeMultiByte($$$$string, $$$$charSet)
			{
				//set default parameter values
				var string = $es4.$$coerce($$$$string, String);
				var charSet = $es4.$$coerce($$$$charSet, String);

				if (charSet !== 'iso-8859-1' && charSet !== 'utf-8')
				{
					throw $es4.$$primitive(new Error('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"'));
				}
				if (charSet == 'utf-8')
				{
					$$this.$$ByteArray.internalWriteUTFBytes(string);
					return;
				}
				var index = 0;
				while (index < string.length)
				{
					var charCode = $es4.$$coerce(string.charCodeAt(index++), uint);
					$$this.$$ByteArray.writeUnsignedByte(charCode);
				}
			}

			return $$this.$$ByteArray.$$writeMultiByte || ($$this.$$ByteArray.$$writeMultiByte = writeMultiByte);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeShort', {
		get:function ()
		{
			var $$this = this;

			function writeShort($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, int);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setInt16(bytePosition, value, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 2;
			}

			return $$this.$$ByteArray.$$writeShort || ($$this.$$ByteArray.$$writeShort = writeShort);
		}});


		//private instance method
		ByteArray.prototype.$$v.writeUnsignedShort = {
		get:function ()
		{
			var $$this = this.$$this;

			function writeUnsignedShort($$$$value, $$$$endian)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, int);
				var endian = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$endian, String);

				if (!endian)
				{
					endian = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_endian, String);
				}
				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setUint16(bytePosition, value, endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 2;
			}

			return $$this.$$ByteArray.$$p.$$writeUnsignedShort || ($$this.$$ByteArray.$$p.$$writeUnsignedShort = writeUnsignedShort);
		}};


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeUnsignedInt', {
		get:function ()
		{
			var $$this = this;

			function writeUnsignedInt($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, uint);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setUint32(bytePosition, value, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 4;
			}

			return $$this.$$ByteArray.$$writeUnsignedInt || ($$this.$$ByteArray.$$writeUnsignedInt = writeUnsignedInt);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeUTF', {
		get:function ()
		{
			var $$this = this;

			function writeUTF($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, String);

				var bytePosition = $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
				var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
				if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
				{
					if (newBytePosition > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
					{
						$$this.length = newBytePosition;
					}
					else
					{
						$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = newBytePosition;
					}
				}
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition += 2;
				var length = $$this.$$ByteArray.internalWriteUTFBytes(value);
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView.setUint16(bytePosition, length, $$this.$$ByteArray.$_properties.ByteArrayScope.$_endian != Endian.BIG_ENDIAN);
			}

			return $$this.$$ByteArray.$$writeUTF || ($$this.$$ByteArray.$$writeUTF = writeUTF);
		}});


		//private instance method
		ByteArray.prototype.$$v.internalWriteUTFBytes = {
		get:function ()
		{
			var $$this = this.$$this;

			function internalWriteUTFBytes($$$$string)
			{
				//set default parameter values
				var string = $es4.$$coerce($$$$string, String);

				var utf8 = [];
				for (var i = 0; i < string.length; i++)
				{
					var charcode = string.charCodeAt(i);
					if (charcode < 0x80)
					{
						utf8.push(charcode);
					}
					else if (charcode < 0x800)
					{
						utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
					}
					else if (charcode < 0xd800 || charcode >= 0xe000)
					{
						utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
					}
					else
					{
						i++;
						charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (string.charCodeAt(i) & 0x3ff));
						utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
					}
				}
				var index = 0;
				var bytesLength = utf8.length;
				while (index < bytesLength)
				{
					$$this.$$ByteArray.writeUnsignedByte(utf8[index]);
					index++;
				}
				return bytesLength;
			}

			return $$this.$$ByteArray.$$p.$$internalWriteUTFBytes || ($$this.$$ByteArray.$$p.$$internalWriteUTFBytes = internalWriteUTFBytes);
		}};


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeUTFBytes', {
		get:function ()
		{
			var $$this = this;

			function writeUTFBytes($$$$value)
			{
				//set default parameter values
				var value = $es4.$$coerce($$$$value, String);

				$$this.$$ByteArray.internalWriteUTFBytes(value);
			}

			return $$this.$$ByteArray.$$writeUTFBytes || ($$this.$$ByteArray.$$writeUTFBytes = writeUTFBytes);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'writeObject', {
		get:function ()
		{
			var $$this = this;

			function writeObject($$$$object)
			{
				//set default parameter values
				var object = $$$$object;

				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "writeObject"'));
			}

			return $$this.$$ByteArray.$$writeObject || ($$this.$$ByteArray.$$writeObject = writeObject);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'readObject', {
		get:function ()
		{
			var $$this = this;

			function readObject()
			{
				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "readObject"'));
			}

			return $$this.$$ByteArray.$$readObject || ($$this.$$ByteArray.$$readObject = readObject);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'toString', {
		get:function ()
		{
			var $$this = this;

			function toString()
			{
				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "toString"'));
			}

			return $$this.$$ByteArray.$$toString || ($$this.$$ByteArray.$$toString = toString);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'compress', {
		get:function ()
		{
			var $$this = this;

			function compress($$$$algorithm)
			{
				//set default parameter values
				var algorithm = (0 > arguments.length - 1) ? "zlib" : $es4.$$coerce($$$$algorithm, String);

				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "compress"'));
			}

			return $$this.$$ByteArray.$$compress || ($$this.$$ByteArray.$$compress = compress);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'deflate', {
		get:function ()
		{
			var $$this = this;

			function deflate()
			{
				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "deflate"'));
			}

			return $$this.$$ByteArray.$$deflate || ($$this.$$ByteArray.$$deflate = deflate);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'inflate', {
		get:function ()
		{
			var $$this = this;

			function inflate()
			{
				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "inflate"'));
			}

			return $$this.$$ByteArray.$$inflate || ($$this.$$ByteArray.$$inflate = inflate);
		}});


		//public instance method
		Object.defineProperty(ByteArray.prototype, 'uncompress', {
		get:function ()
		{
			var $$this = this;

			function uncompress($$$$algorithm)
			{
				//set default parameter values
				var algorithm = (0 > arguments.length - 1) ? "zlib" : $es4.$$coerce($$$$algorithm, String);

				throw $es4.$$primitive(new Error('ByteArray: attempted call to an unimplemented function "uncompress"'));
			}

			return $$this.$$ByteArray.$$uncompress || ($$this.$$ByteArray.$$uncompress = uncompress);
		}});

		Object.defineProperty(ByteArray.prototype, 'bytesAvailable', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength - $$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
		}});
		Object.defineProperty(ByteArray.prototype, 'endian', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_endian, String);
		}, set:function ($$$$type)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);

			var $$this = this;
			$$this.$$ByteArray.$_properties.ByteArrayScope.$_endian = type;
		}});
		Object.defineProperty(ByteArray.prototype, 'length', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength, uint);
		}, set:function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, uint);

			var $$this = this;
			if (value == $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
			{
				return;
			}
			var arrayBuffer;
			if (value < $$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength)
			{
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_growSize = ByteArray.BYTES_GROW_SIZE;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = value;
				if ($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition > value)
				{
					$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition = value;
				}
				return;
			}
			if (value > $$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer.byteLength)
			{
				arrayBuffer = $es4.$$primitive(new window.ArrayBuffer(value + ($$this.$$ByteArray.$_properties.ByteArrayScope.$_growSize = ($$this.$$ByteArray.$_properties.ByteArrayScope.$_growSize * 2))));
				$es4.$$primitive(new window.Uint8Array(arrayBuffer).set($es4.$$primitive(new window.Uint8Array($$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer))));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_dataView = $es4.$$primitive(new window.DataView(arrayBuffer));
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_arrayBuffer = arrayBuffer;
				$$this.$$ByteArray.$_properties.ByteArrayScope.$_byteLength = value;
			}
		}});
		Object.defineProperty(ByteArray.prototype, 'position', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition, uint);
		}, set:function ($$$$offset)
		{
			//set default parameter values
			var offset = $es4.$$coerce($$$$offset, uint);

			var $$this = this;
			$$this.$$ByteArray.$_properties.ByteArrayScope.$_bytePosition = offset;
		}});
		Object.defineProperty(ByteArray.prototype, 'objectEncoding', {get:function ()
		{
			var $$this = this;
			return ObjectEncoding.AMF3;
		}, set:function ($$$$version)
		{
			//set default parameter values
			var version = $es4.$$coerce($$$$version, uint);

			var $$this = this;
			if (version != ObjectEncoding.AMF3)
			{
				throw $es4.$$primitive(new Error('ByteArray: desired object encoding not supported at this time'));
			}
		}});

		//properties
		ByteArray.prototype.$$v.$_properties = {
		get:function () { var $$this = this.$$this; return $$this.$$ByteArray.$$p.$_properties; },
		set:function (value) { var $$this = this.$$this; $$this.$$ByteArray.$$p.$_properties = value }
		};

	});

	//class initializer
	ByteArray.$$cinit = (function ()
	{
		ByteArray.$$cinit = undefined;
	});

	Object.defineProperty(ByteArray, 'defaultObjectEncoding', {get:function ()
	{
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		return ObjectEncoding.AMF3;
	}, set:function ($$$$version)
	{
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		//set default parameter values
		var version = $es4.$$coerce($$$$version, uint);

		if (version != ObjectEncoding.AMF3)
		{
			throw $es4.$$primitive(new Error('ByteArray: desired object encoding not supported at this time'));
		}
	}});

	function ByteArray()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof ByteArray) || $$this.$$ByteArray !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ByteArray) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			ByteArray.$$construct($$this, $$args);
		}
	}

	//construct
	ByteArray.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$ByteArray', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$ByteArray, '$_properties', ByteArray.prototype.$$v.$_properties);

		//private instance method
		Object.defineProperty($$this.$$ByteArray, 'writeUnsignedByte', ByteArray.prototype.$$v.writeUnsignedByte);

		//private instance method
		Object.defineProperty($$this.$$ByteArray, 'writeUnsignedShort', ByteArray.prototype.$$v.writeUnsignedShort);

		//private instance method
		Object.defineProperty($$this.$$ByteArray, 'internalWriteUTFBytes', ByteArray.prototype.$$v.internalWriteUTFBytes);

		//initialize properties
		ByteArray.$$iinit($$this);

		//call constructor
		if (args !== undefined) ByteArray.$$constructor.apply($$this, args);
	});

	//initializer
	ByteArray.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$ByteArray.$$p.$_properties = undefined;
	
	});

	//constructor
	ByteArray.$$constructor = (function ()
	{
		var $$this = this;
		if ($$this.$$ByteArray.$_properties === undefined)
		{
			$$this.$__properties({});
		}
	});

	return $es4.$$class(ByteArray, {IMPLEMENTS:['flash.utils.IDataInput', 'flash.utils.IDataOutput']}, 'flash.utils::ByteArray');
})();
//flash.utils.ByteArray


//flash.events.Event
$es4.$$package('flash.events').Event = (function ()
{
	//imports
	var Event;

	//class pre initializer
	Event.$$sinit = (function ()
	{
		Event.$$sinit = undefined;

		//initialize imports
		//set prototype and constructor
		Event.prototype = Object.create(Object.prototype);
		Object.defineProperty(Event.prototype, "constructor", { value: Event, enumerable: false });

		//hold private values
		Object.defineProperty(Event.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(Event.prototype, '$__properties', {
		get:function ()
		{
			var $$this = this;

			function $__properties($$$$object)
			{
				//set default parameter values
				var object = (0 > arguments.length - 1) ? null : $$$$object;

				if ($$this.$$Event.$_properties === undefined)
				{
					object.EventScope = {$_target:null, $_currentTarget:null, $_eventPhase:null, $_withTarget:Event.$_withTarget, $_originalTarget:null};
					object.TLScope = $$this;
					return $$this.$$Event.$_properties = object;
				}
				return $$this.$$Event.$_properties;
			}

			return $$this.$$Event.$$$__properties || ($$this.$$Event.$$$__properties = $__properties);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'clone', {
		get:function ()
		{
			var $$this = this;

			function clone()
			{
				return $es4.$$coerce($es4.$$primitive(new Event($$this.$$Event.$_properties.EventScope.$_type, $$this.$$Event.$_properties.EventScope.$_bubbles, $$this.$$Event.$_properties.EventScope.$_cancelable)), $es4.$$['flash.events'].Event);
			}

			return $$this.$$Event.$$clone || ($$this.$$Event.$$clone = clone);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'formatToString', {
		get:function ()
		{
			var $$this = this;

			function formatToString($$$$className, $$$$args)
			{
				//set default parameter values
				var className = $es4.$$coerce($$$$className, String);
				for (var $$i = 1, $$length = arguments.length, args = new Array($$length - 1); $$i < $$length; $$i += 1) args[$$i - 1] = arguments[$$i];

				var str = '[' + className;
				for (var i = 0; i < args.length; i++)
				{
					str += ' ' + args[i] + '="' + $$this[args[i]] + '"';
				}
				str += ']';
				return str;
			}

			return $$this.$$Event.$$formatToString || ($$this.$$Event.$$formatToString = formatToString);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'isDefaultPrevented', {
		get:function ()
		{
			var $$this = this;

			function isDefaultPrevented()
			{
				return $es4.$$coerce($$this.$$Event.$_properties.EventScope.$_defaultPrevented, Boolean);
			}

			return $$this.$$Event.$$isDefaultPrevented || ($$this.$$Event.$$isDefaultPrevented = isDefaultPrevented);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'preventDefault', {
		get:function ()
		{
			var $$this = this;

			function preventDefault()
			{
				if ($$this.$$Event.$_properties.EventScope.$_cancelable)
				{
					$$this.$$Event.$_properties.EventScope.$_defaultPrevented = true;
				}
			}

			return $$this.$$Event.$$preventDefault || ($$this.$$Event.$$preventDefault = preventDefault);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'stopImmediatePropagation', {
		get:function ()
		{
			var $$this = this;

			function stopImmediatePropagation()
			{
				$$this.$$Event.$_properties.EventScope.$_immediatePropagationStopped = true;
			}

			return $$this.$$Event.$$stopImmediatePropagation || ($$this.$$Event.$$stopImmediatePropagation = stopImmediatePropagation);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'stopPropagation', {
		get:function ()
		{
			var $$this = this;

			function stopPropagation()
			{
				$$this.$$Event.$_properties.EventScope.$_propagationStopped = true;
			}

			return $$this.$$Event.$$stopPropagation || ($$this.$$Event.$$stopPropagation = stopPropagation);
		}});


		//public instance method
		Object.defineProperty(Event.prototype, 'toString', {
		get:function ()
		{
			var $$this = this;

			function toString()
			{
				return $$this.formatToString('Event', 'type', 'bubbles', 'cancelable');
			}

			return $$this.$$Event.$$toString || ($$this.$$Event.$$toString = toString);
		}});

		Object.defineProperty(Event.prototype, 'bubbles', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$Event.$_properties.EventScope.$_bubbles, Boolean);
		}});
		Object.defineProperty(Event.prototype, 'cancelable', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$Event.$_properties.EventScope.$_cancelable, Boolean);
		}});
		Object.defineProperty(Event.prototype, 'currentTarget', {get:function ()
		{
			var $$this = this;
			return $$this.$$Event.$_properties.EventScope.$_currentTarget;
		}});
		Object.defineProperty(Event.prototype, 'eventPhase', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$Event.$_properties.EventScope.$_eventPhase, uint);
		}});
		Object.defineProperty(Event.prototype, 'target', {get:function ()
		{
			var $$this = this;
			return $$this.$$Event.$_properties.EventScope.$_target;
		}});
		Object.defineProperty(Event.prototype, 'type', {get:function ()
		{
			var $$this = this;
			return $es4.$$coerce($$this.$$Event.$_properties.EventScope.$_type, String);
		}});

		//properties
		Event.prototype.$$v.$_properties = {
		get:function () { var $$this = this.$$this; return $$this.$$Event.$$p.$_properties; },
		set:function (value) { var $$this = this.$$this; $$this.$$Event.$$p.$_properties = value }
		};

	});

	//class initializer
	Event.$$cinit = (function ()
	{
		Event.$$cinit = undefined;
	});

	//private static method
	Event.$_withTarget = (function ($$$$event, $$$$target)
	{
		if (Event.$$cinit !== undefined) Event.$$cinit();

		//set default parameter values
		var event = $es4.$$coerce($$$$event, $es4.$$['flash.events'].Event);
		var target = $es4.$$coerce($$$$target, Object);

		var properties = event.$__properties();
		event = properties.EventScope.$_target ? event.clone() : event;
		event.$__properties().EventScope.$_target = target;
		return event;
	});
	function Event()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Event) || $$this.$$Event !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Event) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Event.$$construct($$this, $$args);
		}
	}

	//construct
	Event.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Event.$$cinit !== undefined) Event.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Event', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$Event, '$_properties', Event.prototype.$$v.$_properties);

		//initialize properties
		Event.$$iinit($$this);

		//call constructor
		if (args !== undefined) Event.$$constructor.apply($$this, args);
	});

	//initializer
	Event.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$Event.$$p.$_properties = undefined;
	
	});

	//constructor
	Event.$$constructor = (function ($$$$type, $$$$bubbles, $$$$cancelable)
	{
		var $$this = this;
		//set default parameter values
		var type = $es4.$$coerce($$$$type, String);
		var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
		var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);

		if ($$this.$$Event.$_properties === undefined)
		{
			$$this.$__properties({});
		}
		var properties = $$this.$$Event.$_properties.EventScope;
		properties.$_type = type;
		properties.$_bubbles = bubbles;
		properties.$_cancelable = cancelable;
	});

	return $es4.$$class(Event, null, 'flash.events::Event');
})();
//flash.events.Event


//flash.utils.IDataInput
$es4.$$package('flash.utils').IDataInput = (function ()
{
	function IDataInput()
	{
		//handle cast
		return $es4.$$as(arguments[0], IDataInput);
	}
	return $es4.$$interface(IDataInput, null, 'flash.utils::IDataInput');
})();
//flash.utils.IDataInput


//flash.net.IDynamicPropertyWriter
$es4.$$package('flash.net').IDynamicPropertyWriter = (function ()
{
	function IDynamicPropertyWriter()
	{
		//handle cast
		return $es4.$$as(arguments[0], IDynamicPropertyWriter);
	}
	return $es4.$$interface(IDynamicPropertyWriter, null, 'flash.net::IDynamicPropertyWriter');
})();
//flash.net.IDynamicPropertyWriter


//flash.events.IEventDispatcher
$es4.$$package('flash.events').IEventDispatcher = (function ()
{
	function IEventDispatcher()
	{
		//handle cast
		return $es4.$$as(arguments[0], IEventDispatcher);
	}
	return $es4.$$interface(IEventDispatcher, null, 'flash.events::IEventDispatcher');
})();
//flash.events.IEventDispatcher


//flash.utils.IDataOutput
$es4.$$package('flash.utils').IDataOutput = (function ()
{
	function IDataOutput()
	{
		//handle cast
		return $es4.$$as(arguments[0], IDataOutput);
	}
	return $es4.$$interface(IDataOutput, null, 'flash.utils::IDataOutput');
})();
//flash.utils.IDataOutput


//flash.utils.setTimeout
$es4.$$package('flash.utils').setTimeout = (function ()
{
	var $$this = setTimeout, $$thisp = setTimeout;
	//function initializer
	setTimeout.$$cinit = (function ()
	{
		setTimeout.$$cinit = undefined;
	});

	function setTimeout($$$$closure, $$$$delay, $$$$rest)
	{
		//initialize function if not initialized
		if (setTimeout.$$cinit !== undefined) setTimeout.$$cinit();

		//set default parameter values
		var closure = $es4.$$coerce($$$$closure, Function);
		var delay = $es4.$$coerce($$$$delay, Number);
		for (var $$i = 2, $$length = arguments.length, rest = new Array($$length - 2); $$i < $$length; $$i += 1) rest[$$i - 2] = arguments[$$i];

		return $es4.$$coerce(global.setTimeout(function () 
{
	closure.apply(this, rest);
}
, delay), uint);
}

	return $es4.$$function (setTimeout);
})();
//flash.utils.setTimeout


//flash.utils.getTimer
$es4.$$package('flash.utils').getTimer = (function ()
{
	var $$this = getTimer, $$thisp = getTimer;
	//function initializer
	getTimer.$$cinit = (function ()
	{
		getTimer.$$cinit = undefined;
	});

	function getTimer()
	{
		//initialize function if not initialized
		if (getTimer.$$cinit !== undefined) getTimer.$$cinit();

		return $es4.$$coerce($es4.$$primitive(new Date().getTime()) - global.$es4.$$startTime, int);
}

	return $es4.$$function (getTimer);
})();
//flash.utils.getTimer


//flash.utils.getQualifiedClassName
$es4.$$package('flash.utils').getQualifiedClassName = (function ()
{
	var $$this = getQualifiedClassName, $$thisp = getQualifiedClassName;
	//function initializer
	getQualifiedClassName.$$cinit = (function ()
	{
		getQualifiedClassName.$$cinit = undefined;
	});

	function getQualifiedClassName($$$$object)
	{
		//initialize function if not initialized
		if (getQualifiedClassName.$$cinit !== undefined) getQualifiedClassName.$$cinit();

		//set default parameter values
		var object = $$$$object;

		if (object.$$isclass !== undefined)
		{
			return $es4.$$coerce(object.$$fullyQualifiedName, String);
		}
		else if (object.$$ismethod !== undefined)
		{
			return 'builtin.as$0::MethodClosure';
		}
		else if (object.constructor.name === 'Number')
		{
			if (object = int(object))
			{
				return 'int';
			}
			else if (object = uint(object))
			{
				return 'uint';
			}
			return 'Number';
		}
		else if (object.constructor.$$isclass !== undefined)
		{
			return $es4.$$coerce(object.constructor.$$fullyQualifiedName, String);
		}
		return $es4.$$coerce(object.constructor.name, String);
}

	return $es4.$$function (getQualifiedClassName);
})();
//flash.utils.getQualifiedClassName


//flash.utils.setInterval
$es4.$$package('flash.utils').setInterval = (function ()
{
	var $$this = setInterval, $$thisp = setInterval;
	//function initializer
	setInterval.$$cinit = (function ()
	{
		setInterval.$$cinit = undefined;
	});

	function setInterval($$$$closure, $$$$delay, $$$$rest)
	{
		//initialize function if not initialized
		if (setInterval.$$cinit !== undefined) setInterval.$$cinit();

		//set default parameter values
		var closure = $es4.$$coerce($$$$closure, Function);
		var delay = $es4.$$coerce($$$$delay, Number);
		for (var $$i = 2, $$length = arguments.length, rest = new Array($$length - 2); $$i < $$length; $$i += 1) rest[$$i - 2] = arguments[$$i];

		return $es4.$$coerce(global.setInterval(function () 
{
	closure.apply(this, rest);
}
, delay), uint);
}

	return $es4.$$function (setInterval);
})();
//flash.utils.setInterval


//flash.utils.getQualifiedSuperclassName
$es4.$$package('flash.utils').getQualifiedSuperclassName = (function ()
{
	var $$this = getQualifiedSuperclassName, $$thisp = getQualifiedSuperclassName;
	//imports
	var getQualifiedClassName;

	//function initializer
	getQualifiedSuperclassName.$$cinit = (function ()
	{
		getQualifiedSuperclassName.$$cinit = undefined;

		//initialize imports
		getQualifiedClassName = $es4.$$['flash.utils'].getQualifiedClassName;
	});

	function getQualifiedSuperclassName($$$$object)
	{
		//initialize function if not initialized
		if (getQualifiedSuperclassName.$$cinit !== undefined) getQualifiedSuperclassName.$$cinit();

		//set default parameter values
		var object = $$$$object;

		if (object == Object)
		{
			return null;
		}
		if (object.$$isclass !== undefined)
		{
			if (object === Array)
			{
				return 'Object';
			}
			return getQualifiedClassName(object.__proto__);
		}
		else if (object.$$ismethod !== undefined)
		{
			return 'Function';
		}
		else if (object.constructor.$$isclass !== undefined)
		{
			return getQualifiedClassName(object.constructor.__proto__);
		}
		return $es4.$$coerce(object.constructor.__proto__.name, String);
}

	return $es4.$$function (getQualifiedSuperclassName);
})();
//flash.utils.getQualifiedSuperclassName


//flash.utils.clearTimeout
$es4.$$package('flash.utils').clearTimeout = (function ()
{
	var $$this = clearTimeout, $$thisp = clearTimeout;
	//function initializer
	clearTimeout.$$cinit = (function ()
	{
		clearTimeout.$$cinit = undefined;
	});

	function clearTimeout($$$$id)
	{
		//initialize function if not initialized
		if (clearTimeout.$$cinit !== undefined) clearTimeout.$$cinit();

		//set default parameter values
		var id = $es4.$$coerce($$$$id, uint);

		global.clearTimeout(id);
}

	return $es4.$$function (clearTimeout);
})();
//flash.utils.clearTimeout


//flash.utils.clearInterval
$es4.$$package('flash.utils').clearInterval = (function ()
{
	var $$this = clearInterval, $$thisp = clearInterval;
	//function initializer
	clearInterval.$$cinit = (function ()
	{
		clearInterval.$$cinit = undefined;
	});

	function clearInterval($$$$id)
	{
		//initialize function if not initialized
		if (clearInterval.$$cinit !== undefined) clearInterval.$$cinit();

		//set default parameter values
		var id = $es4.$$coerce($$$$id, uint);

		global.clearInterval(id);
}

	return $es4.$$function (clearInterval);
})();
//flash.utils.clearInterval


//flash.utils.getDefinitionByName
$es4.$$package('flash.utils').getDefinitionByName = (function ()
{
	var $$this = getDefinitionByName, $$thisp = getDefinitionByName;
	//function initializer
	getDefinitionByName.$$cinit = (function ()
	{
		getDefinitionByName.$$cinit = undefined;
	});

	function getDefinitionByName($$$$name)
	{
		//initialize function if not initialized
		if (getDefinitionByName.$$cinit !== undefined) getDefinitionByName.$$cinit();

		//set default parameter values
		var name = $es4.$$coerce($$$$name, String);


		var parts = name.split('::').join('.').split('.');
		var definitionName = parts.pop();
		var packageName = parts.join('.');
		
		if ($$[packageName] === undefined || $$[packageName][definitionName] === undefined) throw new Error('Variable ' + name + ' is not defined.');
		
		return $$[packageName][definitionName];
	}

	return $es4.$$function (getDefinitionByName);
})();
//flash.utils.getDefinitionByName


//flash.debugger.enterDebugger
$es4.$$package('flash.debugger').enterDebugger = (function ()
{
	var $$this = enterDebugger, $$thisp = enterDebugger;
	//function initializer
	enterDebugger.$$cinit = (function ()
	{
		enterDebugger.$$cinit = undefined;
	});

	function enterDebugger()
	{
		//initialize function if not initialized
		if (enterDebugger.$$cinit !== undefined) enterDebugger.$$cinit();


		debugger;
	}

	return $es4.$$function (enterDebugger);
})();
//flash.debugger.enterDebugger


$es4.$$['flash.utils'].IDataInput.$$pcinit();

$es4.$$['flash.net'].IDynamicPropertyWriter.$$pcinit();

$es4.$$['flash.events'].IEventDispatcher.$$pcinit();

$es4.$$['flash.utils'].IDataOutput.$$pcinit();

$es4.$$['flash.net'].ObjectEncoding.$$pcinit();

$es4.$$['flash.display'].Sprite.$$pcinit();

$es4.$$['flash.events'].EventDispatcher.$$pcinit();

$es4.$$['flash.events'].ErrorEvent.$$pcinit();

$es4.$$['flash.events'].EventPhase.$$pcinit();

$es4.$$['flash.utils'].Proxy.$$pcinit();

$es4.$$['flash.utils'].Endian.$$pcinit();

$es4.$$['flash.utils'].Dictionary.$$pcinit();

$es4.$$['flash.events'].TextEvent.$$pcinit();

$es4.$$['flash.utils'].ByteArray.$$pcinit();

$es4.$$['flash.events'].Event.$$pcinit();

if ($es4.$$['flash.utils'].IDataInput.$$sinit !== undefined) $es4.$$['flash.utils'].IDataInput.$$sinit();

if ($es4.$$['flash.net'].IDynamicPropertyWriter.$$sinit !== undefined) $es4.$$['flash.net'].IDynamicPropertyWriter.$$sinit();

if ($es4.$$['flash.events'].IEventDispatcher.$$sinit !== undefined) $es4.$$['flash.events'].IEventDispatcher.$$sinit();

if ($es4.$$['flash.utils'].IDataOutput.$$sinit !== undefined) $es4.$$['flash.utils'].IDataOutput.$$sinit();

if ($es4.$$['flash.net'].ObjectEncoding.$$sinit !== undefined) $es4.$$['flash.net'].ObjectEncoding.$$sinit();

if ($es4.$$['flash.display'].Sprite.$$sinit !== undefined) $es4.$$['flash.display'].Sprite.$$sinit();

if ($es4.$$['flash.events'].EventDispatcher.$$sinit !== undefined) $es4.$$['flash.events'].EventDispatcher.$$sinit();

if ($es4.$$['flash.events'].ErrorEvent.$$sinit !== undefined) $es4.$$['flash.events'].ErrorEvent.$$sinit();

if ($es4.$$['flash.events'].EventPhase.$$sinit !== undefined) $es4.$$['flash.events'].EventPhase.$$sinit();

if ($es4.$$['flash.utils'].Proxy.$$sinit !== undefined) $es4.$$['flash.utils'].Proxy.$$sinit();

if ($es4.$$['flash.utils'].Endian.$$sinit !== undefined) $es4.$$['flash.utils'].Endian.$$sinit();

if ($es4.$$['flash.utils'].Dictionary.$$sinit !== undefined) $es4.$$['flash.utils'].Dictionary.$$sinit();

if ($es4.$$['flash.events'].TextEvent.$$sinit !== undefined) $es4.$$['flash.events'].TextEvent.$$sinit();

if ($es4.$$['flash.utils'].ByteArray.$$sinit !== undefined) $es4.$$['flash.utils'].ByteArray.$$sinit();

if ($es4.$$['flash.events'].Event.$$sinit !== undefined) $es4.$$['flash.events'].Event.$$sinit();})();

//sweetrush.Transcompiler
$es4.$$package('sweetrush').Transcompiler = (function ()
{
	//imports
	var Analyzer;
	var Lexer;
	var Parser;
	var TranslatorProto;
	var TranslatorPrototype;
	var Construct;
	var Token;
	var FileUtil;
	var SwcUtil;
	var FileUtil;
	var Sprite;

	//properties
	var $$j = {};
	Object.defineProperty(Transcompiler, 'DEBUG', {
	get:function () { if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit(); return $$j.DEBUG; },
	set:function (value) { if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit(); $$j.DEBUG = $es4.$$coerce(value, Boolean); }
	});

	Object.defineProperty(Transcompiler, '_swcs', {
	get:function () { if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit(); return $$j._swcs; },
	set:function (value) { if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit(); $$j._swcs = $es4.$$coerce(value, Object); }
	});


	//class pre initializer
	Transcompiler.$$sinit = (function ()
	{
		Transcompiler.$$sinit = undefined;

		//initialize imports
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Parser = $es4.$$['sweetrush.core'].Parser;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		Sprite = $es4.$$['flash.display'].Sprite;

		//ensure $$sinit is called on super class
		if (Sprite.$$sinit !== undefined) Sprite.$$sinit();

		//set prototype and constructor
		Transcompiler.prototype = Object.create(Sprite.prototype);
		Object.defineProperty(Transcompiler.prototype, "constructor", { value: Transcompiler, enumerable: false });

		//hold private values
		Object.defineProperty(Transcompiler.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'compileTranscompiler', {
		get:function ()
		{
			var $$this = this;

			function compileTranscompiler($$$$translationMode, $$$$platform)
			{
				//set default parameter values
				var translationMode = (0 > arguments.length - 1) ? 1 : $es4.$$coerce($$$$translationMode, Number);
				var platform = (1 > arguments.length - 1) ? 'node' : $es4.$$coerce($$$$platform, String);

				return $$this.compile({srcDir:FileUtil.getBasePath(), mainFile:"sweetrush/Transcompiler.as", compileConstants:{'CONFIG::air':'false', 'CONFIG::node':'true'}, includeBootstrap:true, includePlayerGlobal:true, expose:'as3_js', translationMode:translationMode, excludeDirectories:['_excluded', 'node_modules'], platform:platform});
			}

			return $$this.$$Transcompiler.$$compileTranscompiler || ($$this.$$Transcompiler.$$compileTranscompiler = compileTranscompiler);
		}});


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'compile', {
		get:function ()
		{
			var $$this = this;

			function compile($$$$params)
			{
				//set default parameter values
				var params = $es4.$$coerce($$$$params, Object);

				var srcDir = $es4.$$coerce(params.srcDir, String);
				var mainFile = $es4.$$coerce(params.mainFile, String);
				var swcs = $es4.$$coerce(params.swcs || [], Array);
				var srcFiles = $es4.$$coerce(params.srcFiles || [], Array);
				var translationMode = $es4.$$coerce(params.translationMode === undefined ? 3 : params.translationMode, Number);
				var compileConstants = params.compileConstants || {};
				var release = $es4.$$coerce(params.release, Boolean);
				var rootConstructs = $es4.$$coerce(params.rootConstructs || [], Array);
				var swcOnly = $es4.$$coerce(params.swcOnly, Boolean);
				var excludeDirectories = $es4.$$coerce(params.excludeDirectories || [], Array);
				var includeBootstrap = $es4.$$coerce(params.includeBootstrap !== undefined ? params.includeBootstrap : true, Boolean);
				var includePlayerGlobal = $es4.$$coerce(params.includePlayerGlobal !== undefined ? params.includePlayerGlobal : includeBootstrap, Boolean);
				var expose = $es4.$$coerce(params.expose, String);
				var platform = $es4.$$coerce(params.platform || 'node', String);
				var special = $es4.$$coerce(params.special, Boolean);
				srcDir = $es4.$$coerce(FileUtil.fixPath(srcDir), String);
				if (mainFile)
				{
					mainFile = $es4.$$coerce(FileUtil.fixPath(mainFile), String);
				}
				if (!special)
				{
					for (var i = 0; i < swcs.length; i++)
					{
						swcs[i] = FileUtil.fixPath(swcs[i]);
					}
				}
				var files = $$this.$$Transcompiler.getSrcFiles(srcDir, srcFiles, excludeDirectories, platform);
				var innerRootConstruct = null;
				if (!special)
				{
					innerRootConstruct = $$this.$$Transcompiler.getBuiltinSWC(platform);
					for (var prop in innerRootConstruct)
					{
						rootConstructs[prop] = innerRootConstruct[prop];
					}
					innerRootConstruct = $$this.$$Transcompiler.getPlayerGlobalSWC(translationMode, platform);
					for (var prop in innerRootConstruct)
					{
						rootConstructs[prop] = innerRootConstruct[prop];
					}
				}
				for (var i = 0; i < swcs.length; i++)
				{
					innerRootConstruct = swcs[i];
					for (var prop in innerRootConstruct)
					{
						rootConstructs[prop] = innerRootConstruct[prop];
					}
				}
				var filePaths = {};
				var mainID;
				var rootConstructsToTranslate = {};
				var tokens;
				var rootConstruct;
				for (var filePath in files)
				{
					if (Transcompiler.DEBUG >= 1)
					{
						trace('Lexing: ' + filePath);
					}
					tokens = Lexer.lex(files[filePath]).tokens;
					if (Transcompiler.DEBUG >= 1)
					{
						trace('Parsing: ' + filePath);
					}
					rootConstruct = Parser.parse(tokens, compileConstants, release);
					var id = filePath.split(srcDir)[1].slice(1, -3).split('/').join('.');
					if (filePath == srcDir + '/' + mainFile)
					{
						mainID = id;
					}
					rootConstructsToTranslate[id] = rootConstructs[id] = rootConstruct;
					filePaths[id] = filePath;
				}
				if (Transcompiler.DEBUG >= 1)
				{
					trace('Creating: swc');
				}
				var jsSWC = SwcUtil.stringifySWC(rootConstructsToTranslate);
				if (swcOnly)
				{
					return {js:null, rootConstructs:rootConstructsToTranslate, swc:jsSWC};
				}
				$$this.$$Transcompiler.normalizeWildcardImports(rootConstructs);
				var js = [];
				var translated = {interfaces:[], classes:[], methods:[], properties:[]};
				var mainJS = '//' + mainID + '\n';
				for (var id in rootConstructsToTranslate)
				{
					if (Transcompiler.DEBUG >= 1)
					{
						trace('Analyzing: ' + filePaths[id]);
					}
					var rootConstruct = Analyzer.analyze(rootConstructsToTranslate[id], rootConstructs, translationMode);
					if (Transcompiler.DEBUG >= 1)
					{
						trace('Translating: ' + filePaths[id]);
					}
					var innerJS = '//' + id + '\n';
					var translatedJS = (translationMode == 3) ? TranslatorPrototype.translate(rootConstruct, rootConstructs, translationMode, release) : TranslatorProto.translate(rootConstruct, rootConstructs, translationMode, release);
					innerJS += translatedJS + '//' + id + '\n';
					if (id == mainID)
					{
						mainJS += translatedJS + '//' + mainID + '\n';
					}
					else if (rootConstruct.packageConstruct.classConstruct)
					{
						translated.classes.push(innerJS);
					}
					else if (rootConstruct.packageConstruct.interfaceConstruct)
					{
						translated.interfaces.push(innerJS);
					}
					else if (rootConstruct.packageConstruct.methodConstruct)
					{
						translated.methods.push(innerJS);
					}
					else if (rootConstruct.packageConstruct.propertyConstruct)
					{
						translated.properties.push(innerJS);
					}
					else
					{
						throw $es4.$$primitive(new Error('unknown construct'));
					}
				}
				for (var i = 0; i < translated.properties.length; i++)
				{
					js.push(translated.properties[i]);
				}
				if (mainID)
				{
					js.push(mainJS);
				}
				for (var i = 0; i < translated.classes.length; i++)
				{
					js.push(translated.classes[i]);
				}
				for (var i = 0; i < translated.interfaces.length; i++)
				{
					js.push(translated.interfaces[i]);
				}
				for (var i = 0; i < translated.methods.length; i++)
				{
					js.push(translated.methods[i]);
				}
				translated = null;
				mainJS = null;
				for (var id in rootConstructsToTranslate)
				{
					if (!rootConstructsToTranslate[id].packageConstruct.interfaceConstruct)
					{
						continue;
					}
					var parts = id.split('.');
					var part = parts.pop();
					var packageName = (parts.length) ? parts.join('.') : '';
					js.push('$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();');
				}
				for (var id in rootConstructsToTranslate)
				{
					if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct || rootConstructsToTranslate[id].packageConstruct.propertyConstruct)
					{
						continue;
					}
					if (rootConstructsToTranslate[id].packageConstruct.classConstruct && rootConstructsToTranslate[id].packageConstruct.classConstruct.UNIMPLEMENTEDToken)
					{
						continue;
					}
					if (rootConstructsToTranslate[id].packageConstruct.methodConstruct && (rootConstructsToTranslate[id].packageConstruct.methodConstruct.UNIMPLEMENTEDToken || (!rootConstructsToTranslate[id].packageConstruct.methodConstruct.getToken && !rootConstructsToTranslate[id].packageConstruct.methodConstruct.setToken)))
					{
						continue;
					}
					var parts = id.split('.');
					var part = parts.pop();
					var packageName = (parts.length) ? parts.join('.') : '';
					js.push('$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();');
				}
				if (translationMode === 3)
				{
					for (var id in rootConstructsToTranslate)
					{
						if (!rootConstructsToTranslate[id].packageConstruct.interfaceConstruct)
						{
							continue;
						}
						if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct.UNIMPLEMENTEDToken)
						{
							continue;
						}
						var parts = id.split('.');
						var part = parts.pop();
						var packageName = (parts.length) ? parts.join('.') : '';
						js.push('if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();');
					}
					for (var id in rootConstructsToTranslate)
					{
						if (rootConstructsToTranslate[id].packageConstruct.interfaceConstruct || rootConstructsToTranslate[id].packageConstruct.propertyConstruct)
						{
							continue;
						}
						if (rootConstructsToTranslate[id].packageConstruct.classConstruct && rootConstructsToTranslate[id].packageConstruct.classConstruct.UNIMPLEMENTEDToken)
						{
							continue;
						}
						if (rootConstructsToTranslate[id].packageConstruct.methodConstruct && (rootConstructsToTranslate[id].packageConstruct.methodConstruct.UNIMPLEMENTEDToken || (!rootConstructsToTranslate[id].packageConstruct.methodConstruct.getToken && !rootConstructsToTranslate[id].packageConstruct.methodConstruct.setToken)))
						{
							continue;
						}
						var parts = id.split('.');
						var part = parts.pop();
						var packageName = (parts.length) ? parts.join('.') : '';
						js.push('if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();');
					}
				}
				var returnObject = '';
				if (mainID)
				{
					var parts = mainID.split('.');
					var name = parts.pop();
					var packageName = (parts.length) ? parts.join('.') : '';
					returnObject = "new $es4.$$['" + packageName + "']." + name + '($es4.$$MANUAL_CONSTRUCT)';
				}
				else
				{
					returnObject = "new $es4.$$['flash.display'].Sprite($es4.$$MANUAL_CONSTRUCT)";
				}
				var lastLine = '';
				if (expose)
				{
					var exposeAs = (platform != 'node') ? ('window.' + expose) : 'var _object = module.exports';
					lastLine = exposeAs + ' = ' + returnObject + '\n';
					lastLine += '$es4.$$construct(' + (platform != 'node' ? ('window.' + expose) : '_object') + ', $es4.$$EMPTY_ARRAY);\n';
					returnObject = (platform != 'node') ? ('window.' + expose) : '_object';
				}
				if (includeBootstrap && includePlayerGlobal && !mainFile)
				{
					lastLine += "$es4.$$['player'].Player;";
				}
				else
				{
					lastLine += returnObject + ';';
				}
				if (!special)
				{
					js.push(lastLine);
				}
				if (Transcompiler.DEBUG >= 2)
				{
					trace('\nOutput: \n' + js);
				}
				var bootstrapJS = [];
				if (includeBootstrap)
				{
					var bootstrapJSFileDir = FileUtil.getExcludedPath() + '/bootstrap';
					var list = FileUtil.getList(bootstrapJSFileDir, true, FileUtil.getListFilter_filters([FileUtil.getListFilter_directories(), FileUtil.getListFilter_hidden(), FileUtil.getListFilter_extension('js', true)]));
					for (var i = 0; i < list.length; i++)
					{
						var filePath = FileUtil.fixPath(list[i].src);
						var parts = filePath.split('.');
						var found = parts.length == 2;
						for (var j = 1; j < parts.length - 1; j++)
						{
							if (parts[j] != platform)
							{
								continue;
							}
							found = true;
							break;
						}
						if (found)
						{
							bootstrapJS.push(FileUtil.read(filePath));
						}
					}
					if (includePlayerGlobal)
					{
						bootstrapJS.push($$this.$$Transcompiler.getPlayerGlobalJS(translationMode, platform));
					}
				}
				var pre = (platform != 'node') ? '//__ES4__\n\n(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; \n\n' : '';
				var post = (platform != 'node') ? '})();' : '';
				return {js:pre + bootstrapJS.concat(js).join('\n\n') + post, rootConstructs:rootConstructsToTranslate, swc:jsSWC};
			}

			return $$this.$$Transcompiler.$$compile || ($$this.$$Transcompiler.$$compile = compile);
		}});


		//private instance method
		Transcompiler.prototype.$$v.getSrcFiles = {
		get:function ()
		{
			var $$this = this.$$this;

			function getSrcFiles($$$$srcDir, $$$$srcFiles, $$$$excludeDirectories, $$$$platform)
			{
				//set default parameter values
				var srcDir = $es4.$$coerce($$$$srcDir, String);
				var srcFiles = $es4.$$coerce($$$$srcFiles, Array);
				var excludeDirectories = $es4.$$coerce($$$$excludeDirectories, Array);
				var platform = $es4.$$coerce($$$$platform, String);

				var filters = [FileUtil.getListFilter_directories(), FileUtil.getListFilter_hidden(), FileUtil.getListFilter_extension('as', true)];
				for (var i = 0; i < excludeDirectories.length; i++)
				{
					filters.push(FileUtil.getListFilter_directory(FileUtil.resolvePath(srcDir, excludeDirectories[i])));
				}
				var list = FileUtil.getList(srcDir, true, FileUtil.getListFilter_filters(filters));
				var files = {};
				for (var i = 0; i < list.length; i++)
				{
					var filePath = FileUtil.fixPath(list[i].src);
					var parts = filePath.split('.');
					var found = parts.length == 2;
					for (var j = 1; j < parts.length - 1; j++)
					{
						if (parts[j] != platform)
						{
							continue;
						}
						found = true;
						filePath = parts[0] + '.' + parts[parts.length - 1];
						break;
					}
					if (!found)
					{
						continue;
					}
					if (srcFiles.length)
					{
						var found = false;
						for (var j = 0; j < srcFiles.length; j++)
						{
							if (filePath.indexOf(srcFiles[j]) != -1)
							{
								found = true;
								break;
							}
						}
						if (!found)
						{
							continue;
						}
					}
					files[FileUtil.fixPath(filePath)] = FileUtil.read(FileUtil.fixPath(list[i].src));
				}
				if (Transcompiler.DEBUG >= 1)
				{
					trace('Normalizing Includes');
				}

				function insertIncludes($$$$filePath, $$$$fileContents, $$$$includes) 
				{
					//set default parameter values
					var filePath = $$$$filePath;
					var fileContents = $$$$fileContents;
					var includes = $$$$includes;

					return fileContents.replace(/include\s*["|'][0-9A-Za-z._\/\\]+["|'];*/g, doReplace);

					function doReplace($$$$match, $$$$offset, $$$$string) 
					{
						//set default parameter values
						var match = $$$$match;
						var offset = $$$$offset;
						var string = $$$$string;

						var includePath = match.match(/["|']([0-9A-Za-z._\/\\]+)["|']/)[1];
						var parts = FileUtil.fixPath(filePath).split('/');
						parts.pop();
						var path = parts.join('/');
						includePath = FileUtil.resolvePath(path, includePath);
						trace('found include: ' + includePath + ' in: ' + filePath);
						var parts = includePath.split('.');
						var includeFilePath = parts[0] + '.' + parts[parts.length - 1];
						includes[includeFilePath] = includeFilePath;
						return insertIncludes(includePath, FileUtil.read(includePath), includes);
					}
;
				}
;

				var includes = {};
				for (var filePath in files)
				{
					files[filePath] = insertIncludes(filePath, files[filePath], includes);
				}
				for (var filePath in includes)
				{
					delete files[filePath];
				}
				return files;
			}

			return $$this.$$Transcompiler.$$p.$$getSrcFiles || ($$this.$$Transcompiler.$$p.$$getSrcFiles = getSrcFiles);
		}};


		//private instance method
		Transcompiler.prototype.$$v.normalizeWildcardImports = {
		get:function ()
		{
			var $$this = this.$$this;

			function normalizeWildcardImports($$$$rootConstructs)
			{
				//set default parameter values
				var rootConstructs = $es4.$$coerce($$$$rootConstructs, Object);

				if (Transcompiler.DEBUG >= 1)
				{
					trace('Normalizing Imports');
				}
				for (var id in rootConstructs)
				{
					var innerRootConstruct = rootConstructs[id];
					var imports = [innerRootConstruct.importConstructs, innerRootConstruct.packageConstruct.importConstructs];
					while (imports.length)
					{
						var importConstructs = imports.shift();
						var packages = [];
						for (var i = 0; i < importConstructs.length; i++)
						{
							var importConstruct = importConstructs[i];
							if (!importConstruct.mulToken)
							{
								continue;
							}
							importConstructs.splice(i, 1);
							i--;
							packages.push(Construct.nameConstructToString(importConstruct.nameConstruct));
						}
						while (packages.length)
						{
							var packageName = packages.shift();
							for (var innerId in rootConstructs)
							{
								if (innerId.indexOf(packageName) != 0)
								{
									continue;
								}
								var importConstruct = Construct.getNewImportConstruct();
								var nameConstruct = Construct.getNewNameConstruct();
								var parts = innerId.split('.');
								for (var j = 0; j < parts.length; j++)
								{
									var identifierToken = Token.getNewToken(Token.IdentifierTokenType, parts[j]);
									nameConstruct.identifierTokens.push(identifierToken);
								}
								importConstruct.nameConstruct = nameConstruct;
								importConstructs.push(importConstruct);
							}
						}
					}
				}
			}

			return $$this.$$Transcompiler.$$p.$$normalizeWildcardImports || ($$this.$$Transcompiler.$$p.$$normalizeWildcardImports = normalizeWildcardImports);
		}};


		//private instance method
		Transcompiler.prototype.$$v.getBuiltinSWC = {
		get:function ()
		{
			var $$this = this.$$this;

			function getBuiltinSWC($$$$platform)
			{
				//set default parameter values
				var platform = $es4.$$coerce($$$$platform, String);

				if (Transcompiler._swcs['builtin'][platform])
				{
					return Transcompiler._swcs['builtin'][platform];
				}
				var builtinSWCFile = FileUtil.getExcludedPath() + '/_generated/builtin.' + platform + '.swc';
				var builtinSWCString = $es4.$$coerce(FileUtil.exists(builtinSWCFile) ? FileUtil.read(builtinSWCFile) : null, String);
				if (!builtinSWCString || !SwcUtil.isValidSWCString(builtinSWCString))
				{
					var srcDir = FileUtil.getExcludedPath() + '/builtin';
					var result = $$this.compile({srcDir:srcDir, translationMode:1, special:true, includeBootstrap:false, includePlayerGlobal:false, platform:platform});
					FileUtil.write(builtinSWCFile, result.swc);
					builtinSWCString = $es4.$$coerce(result.swc, String);
				}
				return Transcompiler._swcs['builtin'][platform] = SwcUtil.parseSWCString(builtinSWCString);
			}

			return $$this.$$Transcompiler.$$p.$$getBuiltinSWC || ($$this.$$Transcompiler.$$p.$$getBuiltinSWC = getBuiltinSWC);
		}};


		//private instance method
		Transcompiler.prototype.$$v.getPlayerGlobalSWC = {
		get:function ()
		{
			var $$this = this.$$this;

			function getPlayerGlobalSWC($$$$translationMode, $$$$platform)
			{
				//set default parameter values
				var translationMode = $es4.$$coerce($$$$translationMode, Number);
				var platform = $es4.$$coerce($$$$platform, String);

				if (Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode])
				{
					return Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode][1];
				}
				var playerGlobalSWCFile = FileUtil.getExcludedPath() + '/_generated/playerglobal.' + platform + '.swc';
				var playerGlobalJSFile = FileUtil.getExcludedPath() + '/_generated/playerglobal.' + platform + '.' + translationMode + '.js';
				var playerGlobalSWCString = $es4.$$coerce(FileUtil.exists(playerGlobalSWCFile) ? FileUtil.read(playerGlobalSWCFile) : null, String);
				var playerGlobalJS = $es4.$$coerce(FileUtil.exists(playerGlobalJSFile) ? FileUtil.read(playerGlobalJSFile) : null, String);
				if (!playerGlobalSWCString || !playerGlobalJS || !SwcUtil.isValidSWCString(playerGlobalSWCString))
				{
					var srcDir = FileUtil.getExcludedPath() + '/playerglobal';
					var result = $$this.compile({srcDir:srcDir, translationMode:translationMode, swcs:[$$this.$$Transcompiler.getBuiltinSWC(platform)], special:true, includeBootstrap:false, includePlayerGlobal:false, platform:platform});
					FileUtil.write(playerGlobalSWCFile, result.swc);
					FileUtil.write(playerGlobalJSFile, result.js);
					playerGlobalSWCString = $es4.$$coerce(result.swc, String);
					playerGlobalJS = $es4.$$coerce(result.js, String);
				}
				Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode] = [playerGlobalJS];
				return Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode][1] = SwcUtil.parseSWCString(playerGlobalSWCString);
			}

			return $$this.$$Transcompiler.$$p.$$getPlayerGlobalSWC || ($$this.$$Transcompiler.$$p.$$getPlayerGlobalSWC = getPlayerGlobalSWC);
		}};


		//private instance method
		Transcompiler.prototype.$$v.getPlayerGlobalJS = {
		get:function ()
		{
			var $$this = this.$$this;

			function getPlayerGlobalJS($$$$translationMode, $$$$platform)
			{
				//set default parameter values
				var translationMode = $es4.$$coerce($$$$translationMode, Number);
				var platform = $es4.$$coerce($$$$platform, String);

				if (!Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode])
				{
					$$this.$$Transcompiler.getPlayerGlobalSWC(translationMode, platform);
				}
				return Transcompiler._swcs['playerGlobal'][platform + '_' + translationMode][0];
			}

			return $$this.$$Transcompiler.$$p.$$getPlayerGlobalJS || ($$this.$$Transcompiler.$$p.$$getPlayerGlobalJS = getPlayerGlobalJS);
		}};


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'getLexer', {
		get:function ()
		{
			var $$this = this;

			function getLexer()
			{
				return $es4.$$coerce(Lexer, Class);
			}

			return $$this.$$Transcompiler.$$getLexer || ($$this.$$Transcompiler.$$getLexer = getLexer);
		}});


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'getParser', {
		get:function ()
		{
			var $$this = this;

			function getParser()
			{
				return $es4.$$coerce(Parser, Class);
			}

			return $$this.$$Transcompiler.$$getParser || ($$this.$$Transcompiler.$$getParser = getParser);
		}});


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'getAnalyzer', {
		get:function ()
		{
			var $$this = this;

			function getAnalyzer()
			{
				return $es4.$$coerce(Analyzer, Class);
			}

			return $$this.$$Transcompiler.$$getAnalyzer || ($$this.$$Transcompiler.$$getAnalyzer = getAnalyzer);
		}});


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'getTranslator', {
		get:function ()
		{
			var $$this = this;

			function getTranslator($$$$prototype)
			{
				//set default parameter values
				var prototype = (0 > arguments.length - 1) ? true : $es4.$$coerce($$$$prototype, Boolean);

				return $es4.$$coerce(prototype ? TranslatorPrototype : TranslatorProto, Class);
			}

			return $$this.$$Transcompiler.$$getTranslator || ($$this.$$Transcompiler.$$getTranslator = getTranslator);
		}});


		//public instance method
		Object.defineProperty(Transcompiler.prototype, 'getSwcUtil', {
		get:function ()
		{
			var $$this = this;

			function getSwcUtil()
			{
				return $es4.$$coerce(SwcUtil, Class);
			}

			return $$this.$$Transcompiler.$$getSwcUtil || ($$this.$$Transcompiler.$$getSwcUtil = getSwcUtil);
		}});
	});

	//class initializer
	Transcompiler.$$cinit = (function ()
	{
		Transcompiler.$$cinit = undefined;

		//initialize properties
		$$j.DEBUG = $es4.$$coerce(true, Boolean);
		$$j._swcs = $es4.$$coerce({builtin:{}, playerGlobal:{}}, Object);
	
	});

	function Transcompiler()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Transcompiler) || $$this.$$Transcompiler !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Transcompiler) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Transcompiler.$$construct($$this, $$args);
		}
	}

	//construct
	Transcompiler.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Transcompiler', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//private instance method
		Object.defineProperty($$this.$$Transcompiler, 'getSrcFiles', Transcompiler.prototype.$$v.getSrcFiles);

		//private instance method
		Object.defineProperty($$this.$$Transcompiler, 'normalizeWildcardImports', Transcompiler.prototype.$$v.normalizeWildcardImports);

		//private instance method
		Object.defineProperty($$this.$$Transcompiler, 'getBuiltinSWC', Transcompiler.prototype.$$v.getBuiltinSWC);

		//private instance method
		Object.defineProperty($$this.$$Transcompiler, 'getPlayerGlobalSWC', Transcompiler.prototype.$$v.getPlayerGlobalSWC);

		//private instance method
		Object.defineProperty($$this.$$Transcompiler, 'getPlayerGlobalJS', Transcompiler.prototype.$$v.getPlayerGlobalJS);

		//call construct on super
		Sprite.$$construct($$this);

		//initialize properties
		Transcompiler.$$iinit($$this);

		//call constructor
		if (args !== undefined) Transcompiler.$$constructor.apply($$this, args);
	});

	//initializer
	Transcompiler.$$iinit = (function ($$this)
	{
		//call iinit on super
		Sprite.$$iinit($$this);
	});

	//constructor
	Transcompiler.$$constructor = (function ()
	{
		var $$this = this;

		Sprite.$$constructor.call($$this);
	});

	return $es4.$$class(Transcompiler, {EXTENDS:'flash.display.Sprite'}, 'sweetrush::Transcompiler');
})();
//sweetrush.Transcompiler


//sweetrush.obj.Token
$es4.$$package('sweetrush.obj').Token = (function ()
{
	//imports
	var Lexer;

	//properties
	var $$j = {};
	Object.defineProperty(Token, 'whitespaceCharacters', {
	get:function () { if (Token.$$cinit !== undefined) Token.$$cinit(); return $$j.whitespaceCharacters; },
	set:function (value) { if (Token.$$cinit !== undefined) Token.$$cinit(); $$j.whitespaceCharacters = $es4.$$coerce(value, Object); }
	});

	Object.defineProperty(Token, 'identifierStartCharacters', {
	get:function () { if (Token.$$cinit !== undefined) Token.$$cinit(); return $$j.identifierStartCharacters; },
	set:function (value) { if (Token.$$cinit !== undefined) Token.$$cinit(); $$j.identifierStartCharacters = $es4.$$coerce(value, Object); }
	});

	Token.OpenParenTokenType = 'OpenParenTokenType';
	Token.ClosedParenTokenType = 'ClosedParenTokenType';
	Token.OpenBraceTokenType = 'OpenBraceTokenType';
	Token.ClosedBraceTokenType = 'ClosedBraceTokenType';
	Token.OpenBracketTokenType = 'OpenBracketTokenType';
	Token.ClosedBracketTokenType = 'ClosedBracketTokenType';
	Token.EOSTokenType = 'EOSTokenType';
	Token.PackageTokenType = 'PackageTokenType';
	Token.ImportTokenType = 'ImportTokenType';
	Token.ClassTokenType = 'ClassTokenType';
	Token.InterfaceTokenType = 'InterfaceTokenType';
	Token.NewTokenType = 'NewTokenType';
	Token.UseTokenType = 'UseTokenType';
	Token.CaseTokenType = 'CaseTokenType';
	Token.FunctionTokenType = 'FunctionTokenType';
	Token.GetTokenType = 'GetTokenType';
	Token.SetTokenType = 'SetTokenType';
	Token.RestTokenType = 'RestTokenType';
	Token.ExtendsTokenType = 'ExtendsTokenType';
	Token.ImplementsTokenType = 'ImplementsTokenType';
	Token.CommentTokenType = 'CommentTokenType';
	Token.CommentChunkTokenType = 'CommentChunkTokenType';
	Token.MultiLineCommentTokenType = 'MultiLineCommentTokenType';
	Token.MultiLineCommentChunkTokenType = 'MultiLineCommentChunkTokenType';
	Token.MultiLineCommentEndTokenType = 'MultiLineCommentEndTokenType';
	Token.OverrideTokenType = 'OverrideTokenType';
	Token.StaticTokenType = 'StaticTokenType';
	Token.DynamicTokenType = 'DynamicTokenType';
	Token.FinalTokenType = 'FinalTokenType';
	Token.VarTokenType = 'VarTokenType';
	Token.ConstTokenType = 'ConstTokenType';
	Token.IdentifierTokenType = 'IdentifierTokenType';
	Token.BooleanTokenType = 'BooleanTokenType';
	Token.ThisTokenType = 'ThisTokenType';
	Token.TypeofTokenType = 'TypeofTokenType';
	Token.NullTokenType = 'NullTokenType';
	Token.VoidTokenType = 'VoidTokenType';
	Token.UndefinedTokenType = 'UndefinedTokenType';
	Token.IsTokenType = 'IsTokenType';
	Token.NaNTokenType = 'NaNTokenType';
	Token.InstanceofTokenType = 'InstanceofTokenType';
	Token.ReturnTokenType = 'ReturnTokenType';
	Token.SwitchTokenType = 'SwitchTokenType';
	Token.SuperTokenType = 'SuperTokenType';
	Token.ThrowTokenType = 'ThrowTokenType';
	Token.DotDotTokenType = 'DotDotTokenType';
	Token.DotTokenType = 'DotTokenType';
	Token.NotTokenType = 'NotTokenType';
	Token.BitwiseNotTokenType = 'BitwiseNotTokenType';
	Token.ColonTokenType = 'ColonTokenType';
	Token.CommaTokenType = 'CommaTokenType';
	Token.TernaryTokenType = 'TernaryTokenType';
	Token.IncrementTokenType = 'IncrementTokenType';
	Token.DecrementTokenType = 'DecrementTokenType';
	Token.BreakTokenType = 'BreakTokenType';
	Token.ContinueTokenType = 'ContinueTokenType';
	Token.DefaultTokenType = 'DefaultTokenType';
	Token.InTokenType = 'InTokenType';
	Token.AsTokenType = 'AsTokenType';
	Token.DeleteTokenType = 'DeleteTokenType';
	Token.IfTokenType = 'IfTokenType';
	Token.ElseTokenType = 'ElseTokenType';
	Token.EachTokenType = 'EachTokenType';
	Token.ForTokenType = 'ForTokenType';
	Token.WhileTokenType = 'WhileTokenType';
	Token.DoTokenType = 'DoTokenType';
	Token.WithTokenType = 'WithTokenType';
	Token.TryTokenType = 'TryTokenType';
	Token.CatchTokenType = 'CatchTokenType';
	Token.RegExpTokenType = 'RegExpTokenType';
	Token.SpecialUFOTokenType = 'SpecialUFOTokenType';
	Token.FinallyTokenType = 'FinallyTokenType';
	Token.AtTokenType = 'AtTokenType';
	Token.BitwiseLeftShiftAssignmentTokenType = 'BitwiseLeftShiftAssignmentTokenType';
	Token.BitwiseRightShiftAssignmentTokenType = 'BitwiseRightShiftAssignmentTokenType';
	Token.BitwiseUnsignedRightShiftAssignmentTokenType = 'BitwiseUnsignedRightShiftAssignmentTokenType';
	Token.BitwiseAndAssignmentTokenType = 'BitwiseAndAssignmentTokenType';
	Token.BitwiseOrAssignmentTokenType = 'BitwiseOrAssignmentTokenType';
	Token.BitwiseXorAssignmentTokenType = 'BitwiseXorAssignmentTokenType';
	Token.AddWithAssignmentTokenType = 'AddWithAssignmentTokenType';
	Token.DivWithAssignmentTokenType = 'DivWithAssignmentTokenType';
	Token.ModWithAssignmentTokenType = 'ModWithAssignmentTokenType';
	Token.MulWithAssignmentTokenType = 'MulWithAssignmentTokenType';
	Token.SubWithAssignmentTokenType = 'SubWithAssignmentTokenType';
	Token.EqualityTokenType = 'EqualityTokenType';
	Token.RelationalTokenType = 'RelationalTokenType';
	Token.BitwiseAndTokenType = 'BitwiseAndTokenType';
	Token.BitwiseXorTokenType = 'BitwiseXorTokenType';
	Token.BitwiseOrTokenType = 'BitwiseOrTokenType';
	Token.AndTokenType = 'AndTokenType';
	Token.AndWithAssignmentTokenType = 'AndWithAssignmentTokenType';
	Token.OrTokenType = 'OrTokenType';
	Token.OrWithAssignmentTokenType = 'OrWithAssignmentTokenType';
	Token.BitwiseLeftShiftTokenType = 'BitwiseLeftShiftTokenType';
	Token.BitwiseRightShiftTokenType = 'BitwiseRightShiftTokenType';
	Token.BitwiseUnsignedRightShiftTokenType = 'BitwiseUnsignedRightShiftTokenType';
	Token.SubTokenType = 'SubTokenType';
	Token.AddTokenType = 'AddTokenType';
	Token.DivTokenType = 'DivTokenType';
	Token.MulTokenType = 'MulTokenType';
	Token.ModTokenType = 'ModTokenType';
	Token.AssignmentTokenType = 'AssignmentTokenType';
	Token.NamespaceKeywordTokenType = 'NamespaceKeywordTokenType';
	Token.XMLTokenType = 'XMLTokenType';
	Token.XMLIdentifierTokenType = 'XMLIdentifierTokenType';
	Token.XMLTextTokenType = 'XMLTextTokenType';
	Token.XMLCDATATokenType = 'XMLCDATATokenType';
	Token.XMLCDATAChunkTokenType = 'XMLCDATAChunkTokenType';
	Token.XMLCDATAEndTokenType = 'XMLCDATAEndTokenType';
	Token.XMLOpenArrowTokenType = 'XMLOpenArrowTokenType';
	Token.XMLClosedArrowTokenType = 'XMLClosedArrowTokenType';
	Token.XMLForwardSlashTokenType = 'XMLForwardSlashTokenType';
	Token.NamespaceQualifierTokenType = 'NamespaceQualifierTokenType';
	Token.VectorDotOpenArrowTokenType = 'VectorDotOpenArrowTokenType';
	Token.VectorClosedArrowTokenType = 'VectorClosedArrowTokenType';
	Token.StringTokenType = 'StringTokenType';
	Token.StringChunkTokenType = 'StringChunkTokenType';
	Token.StringMultiLineDelimiterTokenType = 'StringMultiLineDelimiterTokenType';
	Token.StringEndTokenType = 'StringEndTokenType';
	Token.NumberTokenType = 'NumberTokenType';
	Token.SpaceTokenType = 'SpaceTokenType';
	Token.TabTokenType = 'TabTokenType';
	Token.NewLineTokenType = 'NewLineTokenType';
	Token.UFOTokenType = 'UFOTokenType';
	Object.defineProperty(Token, 'tokenFunctions', {
	get:function () { if (Token.$$cinit !== undefined) Token.$$cinit(); return $$j.tokenFunctions; },
	set:function (value) { if (Token.$$cinit !== undefined) Token.$$cinit(); $$j.tokenFunctions = $es4.$$coerce(value, Object); }
	});


	//class pre initializer
	Token.$$sinit = (function ()
	{
		Token.$$sinit = undefined;

		//initialize imports
		Lexer = $es4.$$['sweetrush.core'].Lexer;

		//set prototype and constructor
		Token.prototype = Object.create(Object.prototype);
		Object.defineProperty(Token.prototype, "constructor", { value: Token, enumerable: false });

		//hold private values
		Object.defineProperty(Token.prototype, '$$v', {value:{}});
	});

	//class initializer
	Token.$$cinit = (function ()
	{
		Token.$$cinit = undefined;

		//initialize properties
		$$j.whitespaceCharacters = $es4.$$coerce({'\u0020':true, '\u0009':true, '\u000A':true, '\u000C':true, '\u000D':true}, Object);
		$$j.identifierStartCharacters = $es4.$$coerce({'_':true, '$':true, 'a':true, 'b':true, 'c':true, 'd':true, 'e':true, 'f':true, 'g':true, 'h':true, 'i':true, 'j':true, 'k':true, 'l':true, 'm':true, 'n':true, 'o':true, 'p':true, 'q':true, 'r':true, 's':true, 't':true, 'u':true, 'v':true, 'w':true, 'x':true, 'y':true, 'z':true, 'A':true, 'B':true, 'C':true, 'D':true, 'E':true, 'F':true, 'G':true, 'H':true, 'I':true, 'J':true, 'K':true, 'L':true, 'M':true, 'N':true, 'O':true, 'P':true, 'Q':true, 'R':true, 'S':true, 'T':true, 'U':true, 'V':true, 'W':true, 'X':true, 'Y':true, 'Z':true}, Object);
		$$j.tokenFunctions = $es4.$$coerce({}, Object);
	
		Token.tokenFunctions[Token.OpenParenTokenType] = {};
		Token.tokenFunctions[Token.ClosedParenTokenType] = {};
		Token.tokenFunctions[Token.OpenBraceTokenType] = {};
		Token.tokenFunctions[Token.ClosedBraceTokenType] = {};
		Token.tokenFunctions[Token.OpenBracketTokenType] = {};
		Token.tokenFunctions[Token.ClosedBracketTokenType] = {};
		Token.tokenFunctions[Token.EOSTokenType] = {};
		Token.tokenFunctions[Token.PackageTokenType] = {};
		Token.tokenFunctions[Token.ImportTokenType] = {};
		Token.tokenFunctions[Token.ClassTokenType] = {};
		Token.tokenFunctions[Token.InterfaceTokenType] = {};
		Token.tokenFunctions[Token.NewTokenType] = {};
		Token.tokenFunctions[Token.UseTokenType] = {};
		Token.tokenFunctions[Token.CaseTokenType] = {};
		Token.tokenFunctions[Token.FunctionTokenType] = {};
		Token.tokenFunctions[Token.GetTokenType] = {};
		Token.tokenFunctions[Token.SetTokenType] = {};
		Token.tokenFunctions[Token.RestTokenType] = {};
		Token.tokenFunctions[Token.ExtendsTokenType] = {};
		Token.tokenFunctions[Token.ImplementsTokenType] = {};
		Token.tokenFunctions[Token.CommentTokenType] = {};
		Token.tokenFunctions[Token.CommentChunkTokenType] = {};
		Token.tokenFunctions[Token.MultiLineCommentTokenType] = {};
		Token.tokenFunctions[Token.MultiLineCommentChunkTokenType] = {};
		Token.tokenFunctions[Token.MultiLineCommentEndTokenType] = {};
		Token.tokenFunctions[Token.OverrideTokenType] = {};
		Token.tokenFunctions[Token.StaticTokenType] = {};
		Token.tokenFunctions[Token.DynamicTokenType] = {};
		Token.tokenFunctions[Token.FinalTokenType] = {};
		Token.tokenFunctions[Token.VarTokenType] = {};
		Token.tokenFunctions[Token.ConstTokenType] = {};
		Token.tokenFunctions[Token.IdentifierTokenType] = {};
		Token.tokenFunctions[Token.BooleanTokenType] = {};
		Token.tokenFunctions[Token.ThisTokenType] = {};
		Token.tokenFunctions[Token.TypeofTokenType] = {};
		Token.tokenFunctions[Token.NullTokenType] = {};
		Token.tokenFunctions[Token.VoidTokenType] = {};
		Token.tokenFunctions[Token.UndefinedTokenType] = {};
		Token.tokenFunctions[Token.IsTokenType] = {};
		Token.tokenFunctions[Token.NaNTokenType] = {};
		Token.tokenFunctions[Token.InstanceofTokenType] = {};
		Token.tokenFunctions[Token.ReturnTokenType] = {};
		Token.tokenFunctions[Token.SwitchTokenType] = {};
		Token.tokenFunctions[Token.SuperTokenType] = {};
		Token.tokenFunctions[Token.ThrowTokenType] = {};
		Token.tokenFunctions[Token.DotDotTokenType] = {};
		Token.tokenFunctions[Token.DotTokenType] = {};
		Token.tokenFunctions[Token.NotTokenType] = {};
		Token.tokenFunctions[Token.BitwiseNotTokenType] = {};
		Token.tokenFunctions[Token.ColonTokenType] = {};
		Token.tokenFunctions[Token.CommaTokenType] = {};
		Token.tokenFunctions[Token.TernaryTokenType] = {};
		Token.tokenFunctions[Token.IncrementTokenType] = {};
		Token.tokenFunctions[Token.DecrementTokenType] = {};
		Token.tokenFunctions[Token.BreakTokenType] = {};
		Token.tokenFunctions[Token.ContinueTokenType] = {};
		Token.tokenFunctions[Token.DefaultTokenType] = {};
		Token.tokenFunctions[Token.InTokenType] = {};
		Token.tokenFunctions[Token.AsTokenType] = {};
		Token.tokenFunctions[Token.DeleteTokenType] = {};
		Token.tokenFunctions[Token.IfTokenType] = {};
		Token.tokenFunctions[Token.ElseTokenType] = {};
		Token.tokenFunctions[Token.EachTokenType] = {};
		Token.tokenFunctions[Token.ForTokenType] = {};
		Token.tokenFunctions[Token.WhileTokenType] = {};
		Token.tokenFunctions[Token.DoTokenType] = {};
		Token.tokenFunctions[Token.WithTokenType] = {};
		Token.tokenFunctions[Token.TryTokenType] = {};
		Token.tokenFunctions[Token.CatchTokenType] = {};
		Token.tokenFunctions[Token.RegExpTokenType] = {};
		Token.tokenFunctions[Token.SpecialUFOTokenType] = {};
		Token.tokenFunctions[Token.FinallyTokenType] = {};
		Token.tokenFunctions[Token.AtTokenType] = {};
		Token.tokenFunctions[Token.BitwiseLeftShiftAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseRightShiftAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseUnsignedRightShiftAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseAndAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseOrAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseXorAssignmentTokenType] = {};
		Token.tokenFunctions[Token.AddWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.DivWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.ModWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.MulWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.SubWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.EqualityTokenType] = {};
		Token.tokenFunctions[Token.RelationalTokenType] = {};
		Token.tokenFunctions[Token.BitwiseAndTokenType] = {};
		Token.tokenFunctions[Token.BitwiseXorTokenType] = {};
		Token.tokenFunctions[Token.BitwiseOrTokenType] = {};
		Token.tokenFunctions[Token.AndTokenType] = {};
		Token.tokenFunctions[Token.AndWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.OrTokenType] = {};
		Token.tokenFunctions[Token.OrWithAssignmentTokenType] = {};
		Token.tokenFunctions[Token.BitwiseLeftShiftTokenType] = {};
		Token.tokenFunctions[Token.BitwiseRightShiftTokenType] = {};
		Token.tokenFunctions[Token.BitwiseUnsignedRightShiftTokenType] = {};
		Token.tokenFunctions[Token.SubTokenType] = {};
		Token.tokenFunctions[Token.AddTokenType] = {};
		Token.tokenFunctions[Token.DivTokenType] = {};
		Token.tokenFunctions[Token.MulTokenType] = {};
		Token.tokenFunctions[Token.ModTokenType] = {};
		Token.tokenFunctions[Token.AssignmentTokenType] = {};
		Token.tokenFunctions[Token.NamespaceKeywordTokenType] = {};
		Token.tokenFunctions[Token.XMLTokenType] = {};
		Token.tokenFunctions[Token.XMLIdentifierTokenType] = {};
		Token.tokenFunctions[Token.XMLTextTokenType] = {};
		Token.tokenFunctions[Token.XMLCDATATokenType] = {};
		Token.tokenFunctions[Token.XMLCDATAChunkTokenType] = {};
		Token.tokenFunctions[Token.XMLCDATAEndTokenType] = {};
		Token.tokenFunctions[Token.XMLOpenArrowTokenType] = {};
		Token.tokenFunctions[Token.XMLClosedArrowTokenType] = {};
		Token.tokenFunctions[Token.XMLForwardSlashTokenType] = {};
		Token.tokenFunctions[Token.NamespaceQualifierTokenType] = {};
		Token.tokenFunctions[Token.VectorDotOpenArrowTokenType] = {};
		Token.tokenFunctions[Token.VectorClosedArrowTokenType] = {};
		Token.tokenFunctions[Token.StringTokenType] = {};
		Token.tokenFunctions[Token.StringChunkTokenType] = {};
		Token.tokenFunctions[Token.StringMultiLineDelimiterTokenType] = {};
		Token.tokenFunctions[Token.StringEndTokenType] = {};
		Token.tokenFunctions[Token.NumberTokenType] = {};
		Token.tokenFunctions[Token.SpaceTokenType] = {};
		Token.tokenFunctions[Token.TabTokenType] = {};
		Token.tokenFunctions[Token.NewLineTokenType] = {};
		Token.tokenFunctions[Token.UFOTokenType] = {};
		Token.tokenFunctions[Token.OpenParenTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '(') ? Token.getNewResult(Token.getNewToken(Token.OpenParenTokenType, '('), 0) : null;
}
;
		Token.tokenFunctions[Token.ClosedParenTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ')') ? Token.getNewResult(Token.getNewToken(Token.ClosedParenTokenType, ')'), 0) : null;
}
;
		Token.tokenFunctions[Token.OpenBraceTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '{') ? Token.getNewResult(Token.getNewToken(Token.OpenBraceTokenType, '{'), 0) : null;
}
;
		Token.tokenFunctions[Token.ClosedBraceTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '}') ? Token.getNewResult(Token.getNewToken(Token.ClosedBraceTokenType, '}'), 0) : null;
}
;
		Token.tokenFunctions[Token.OpenBracketTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '[') ? Token.getNewResult(Token.getNewToken(Token.OpenBracketTokenType, '['), 0) : null;
}
;
		Token.tokenFunctions[Token.ClosedBracketTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ']') ? Token.getNewResult(Token.getNewToken(Token.ClosedBracketTokenType, ']'), 0) : null;
}
;
		Token.tokenFunctions[Token.EOSTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ';') ? Token.getNewResult(Token.getNewToken(Token.EOSTokenType, ';'), 0) : null;
}
;
		Token.tokenFunctions[Token.PackageTokenType].keyword = 'package';
		Token.tokenFunctions[Token.PackageTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.PackageTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'p' || input.charAt(1) != 'a') ? null : Token.keywordFind(input, Token.PackageTokenType, [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.IdentifierTokenType, Token.DotTokenType]);
}
;
		Token.tokenFunctions[Token.ImportTokenType].keyword = 'import';
		Token.tokenFunctions[Token.ImportTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'm') ? null : Token.keywordFind2(input, 'import', Token.ImportTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.ClassTokenType].keyword = 'class';
		Token.tokenFunctions[Token.ClassTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'c' || input.charAt(1) != 'l') ? null : Token.keywordFind2(input, 'class', Token.ClassTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.InterfaceTokenType].keyword = 'interface';
		Token.tokenFunctions[Token.InterfaceTokenType].terminator = /^[\s]/;
		Token.tokenFunctions[Token.InterfaceTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : Token.keywordFind2(input, 'interface', Token.InterfaceTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.NewTokenType].keyword = 'new';
		Token.tokenFunctions[Token.NewTokenType].terminator = /^[\s]/;
		Token.tokenFunctions[Token.NewTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'n' || input.charAt(1) != 'e') ? null : Token.keywordFind(input, Token.NewTokenType);
}
;
		Token.tokenFunctions[Token.UseTokenType].keyword = 'use';
		Token.tokenFunctions[Token.UseTokenType].terminator = /^[\s]/;
		Token.tokenFunctions[Token.UseTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'u' || input.charAt(1) != 's') ? null : Token.keywordFind(input, Token.UseTokenType);
}
;
		Token.tokenFunctions[Token.CaseTokenType].keyword = 'case';
		Token.tokenFunctions[Token.CaseTokenType].terminator = /^[\s]/;
		Token.tokenFunctions[Token.CaseTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'c' || input.charAt(1) != 'a') ? null : Token.keywordFind(input, Token.CaseTokenType);
}
;
		Token.tokenFunctions[Token.FunctionTokenType].keyword = 'function';
		Token.tokenFunctions[Token.FunctionTokenType].terminator = /^[\s]|\(/;
		Token.tokenFunctions[Token.FunctionTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != 'f')
	{
		return null;
	}
	var result = Token.keywordFind(input, Token.FunctionTokenType, [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.GetTokenType, Token.SetTokenType, Token.IdentifierTokenType]);
	if (!result)
	{
		return null;
	}
	var tokens = result.tokens;
	var index = result.index;
	result = Lexer.lex(input.slice(index + 1), [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.OpenParenTokenType, Token.ClosedParenTokenType, Token.VectorDotOpenArrowTokenType, Token.VectorClosedArrowTokenType, Token.VoidTokenType, Token.StringTokenType, Token.BooleanTokenType, Token.SubTokenType, Token.AddTokenType, Token.RestTokenType, Token.NumberTokenType, Token.NullTokenType, Token.UndefinedTokenType, Token.NaNTokenType, Token.ColonTokenType, Token.MulTokenType, Token.CommaTokenType, Token.AssignmentTokenType, Token.IdentifierTokenType, Token.DotTokenType], true);
	tokens = tokens.concat(result.tokens);
	return Token.getNewResult(tokens, result.index + index);
}
;
		Token.tokenFunctions[Token.GetTokenType].keyword = 'get';
		Token.tokenFunctions[Token.GetTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'g' || input.charAt(1) != 'e') ? null : Token.keywordFind2(input, 'get', Token.GetTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.SetTokenType].keyword = 'set';
		Token.tokenFunctions[Token.SetTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 's' || input.charAt(1) != 'e') ? null : Token.keywordFind2(input, 'set', Token.SetTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.RestTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '.' || input.charAt(1) != '.') ? null : Token.keywordFind2(input, '...', Token.RestTokenType, Token.identifierStartCharacters, false);
}
;
		Token.tokenFunctions[Token.ExtendsTokenType].keyword = 'extends';
		Token.tokenFunctions[Token.ExtendsTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'e' || input.charAt(1) != 'x') ? null : Token.keywordFind2(input, 'extends', Token.ExtendsTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.ImplementsTokenType].keyword = 'implements';
		Token.tokenFunctions[Token.ImplementsTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'm') ? null : Token.keywordFind2(input, 'implements', Token.ImplementsTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.CommentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '/' || input.charAt(1) != '/')
	{
		return null;
	}
	var tokens = [];
	var i = 2;
	var commentChunk = '';
	var token = Token.getNewToken(Token.CommentTokenType, input.charAt(0) + input.charAt(1));
	tokens.push(token);
	while (i < input.length)
	{
		if (input.charAt(i).match(/[\r\n]/))
		{
			break;
		}
		commentChunk += input.charAt(i);
		i++;
	}
	if (i > 2)
	{
		token = Token.getNewToken(Token.CommentChunkTokenType, commentChunk);
		tokens.push(token);
	}
	return Token.getNewResult(tokens, i - 1);
}
;
		Token.tokenFunctions[Token.MultiLineCommentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '/' || input.charAt(1) != '*')
	{
		return null;
	}
	var tokens = [];
	var token = Token.getNewToken(Token.MultiLineCommentTokenType, input.charAt(0) + input.charAt(1));
	tokens.push(token);
	var i = 2;
	var lastChar;
	var commentChunk = '';
	while (i < input.length)
	{
		if (input.charAt(i).match(/[\r\n]/))
		{
			if (commentChunk.length > 0)
			{
				token = Token.getNewToken(Token.MultiLineCommentChunkTokenType, commentChunk);
				tokens.push(token);
			}
			token = Token.getNewToken(Token.NewLineTokenType, input.charAt(i));
			tokens.push(token);
			commentChunk = '';
		}
		else if (lastChar == '*' && input.charAt(i) == '/')
		{
			commentChunk = commentChunk.slice(0, commentChunk.length - 1);
			i--;
			break;
		}
		else
		{
			commentChunk += input.charAt(i);
		}
		lastChar = input.charAt(i);
		i++;
	}
	if (commentChunk.length > 0)
	{
		token = Token.getNewToken(Token.MultiLineCommentChunkTokenType, commentChunk);
		tokens.push(token);
	}
	token = Token.getNewToken(Token.MultiLineCommentEndTokenType, input.charAt(i) + input.charAt(i + 1));
	tokens.push(token);
	return Token.getNewResult(tokens, i + 1);
}
;
		Token.tokenFunctions[Token.OverrideTokenType].keyword = 'override';
		Token.tokenFunctions[Token.OverrideTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'o' || input.charAt(1) != 'v') ? null : Token.keywordFind2(input, 'override', Token.OverrideTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.StaticTokenType].keyword = 'static';
		Token.tokenFunctions[Token.StaticTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 's' || input.charAt(1) != 't') ? null : Token.keywordFind2(input, 'static', Token.StaticTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.DynamicTokenType].keyword = 'dynamic';
		Token.tokenFunctions[Token.DynamicTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'd' || input.charAt(1) != 'y') ? null : Token.keywordFind2(input, 'dynamic', Token.DynamicTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.FinalTokenType].keyword = 'final';
		Token.tokenFunctions[Token.FinalTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'f' || input.charAt(1) != 'i') ? null : Token.keywordFind2(input, 'final', Token.FinalTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.VarTokenType].keyword = 'var';
		Token.tokenFunctions[Token.VarTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'v' || input.charAt(1) != 'a') ? null : Token.keywordFind2(input, 'var', Token.VarTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.ConstTokenType].keyword = 'const';
		Token.tokenFunctions[Token.ConstTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'c' || input.charAt(1) != 'o') ? null : Token.keywordFind2(input, 'const', Token.ConstTokenType, Token.identifierStartCharacters, true);
}
;
		Token.tokenFunctions[Token.IdentifierTokenType].regex = /^[a-zA-Z_$][a-zA-Z_0-9$]*/;
		Token.tokenFunctions[Token.IdentifierTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return Token.regexFind(input, Token.IdentifierTokenType);
}
;
		Token.tokenFunctions[Token.BooleanTokenType].regex = /^(true|false)(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.BooleanTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 't' && input.charAt(0) != 'f') ? null : Token.regexFind(input, Token.BooleanTokenType);
}
;
		Token.tokenFunctions[Token.ThisTokenType].regex = /^this(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.ThisTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 't' || input.charAt(1) != 'h') ? null : Token.regexFind(input, Token.ThisTokenType);
}
;
		Token.tokenFunctions[Token.TypeofTokenType].regex = /^typeof(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.TypeofTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 't' || input.charAt(1) != 'y') ? null : Token.regexFind(input, Token.TypeofTokenType);
}
;
		Token.tokenFunctions[Token.NullTokenType].regex = /^null(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.NullTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'n' || input.charAt(1) != 'u') ? null : Token.regexFind(input, Token.NullTokenType);
}
;
		Token.tokenFunctions[Token.VoidTokenType].regex = /^void(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.VoidTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'v' || input.charAt(1) != 'o') ? null : Token.regexFind(input, Token.VoidTokenType);
}
;
		Token.tokenFunctions[Token.UndefinedTokenType].regex = /^undefined(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.UndefinedTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'u' || input.charAt(1) != 'n') ? null : Token.regexFind(input, Token.UndefinedTokenType);
}
;
		Token.tokenFunctions[Token.IsTokenType].regex = /^is(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.IsTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 's') ? null : Token.regexFind(input, Token.IsTokenType);
}
;
		Token.tokenFunctions[Token.NaNTokenType].regex = /^NaN(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.NaNTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'N' || input.charAt(1) != 'a') ? null : Token.regexFind(input, Token.NaNTokenType);
}
;
		Token.tokenFunctions[Token.InstanceofTokenType].regex = /^instanceof(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.InstanceofTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : Token.regexFind(input, Token.InstanceofTokenType);
}
;
		Token.tokenFunctions[Token.ReturnTokenType].regex = /^return(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.ReturnTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'r' || input.charAt(1) != 'e') ? null : Token.regexFind(input, Token.ReturnTokenType);
}
;
		Token.tokenFunctions[Token.SwitchTokenType].regex = /^switch(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.SwitchTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 's' || input.charAt(1) != 'w') ? null : Token.regexFind(input, Token.SwitchTokenType);
}
;
		Token.tokenFunctions[Token.SuperTokenType].regex = /^super(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.SuperTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 's' || input.charAt(1) != 'u') ? null : Token.regexFind(input, Token.SuperTokenType);
}
;
		Token.tokenFunctions[Token.ThrowTokenType].regex = /^throw(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.ThrowTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 't' || input.charAt(1) != 'h') ? null : Token.regexFind(input, Token.ThrowTokenType);
}
;
		Token.tokenFunctions[Token.DotDotTokenType].regex = /^\.\./;
		Token.tokenFunctions[Token.DotDotTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '.' || input.charAt(1) != '.') ? null : Token.regexFind(input, Token.DotDotTokenType);
}
;
		Token.tokenFunctions[Token.DotTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '.') ? Token.getNewResult(Token.getNewToken(Token.DotTokenType, '.'), 0) : null;
}
;
		Token.tokenFunctions[Token.NotTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '!') ? Token.getNewResult(Token.getNewToken(Token.NotTokenType, '!'), 0) : null;
}
;
		Token.tokenFunctions[Token.BitwiseNotTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '~') ? Token.getNewResult(Token.getNewToken(Token.BitwiseNotTokenType, '~'), 0) : null;
}
;
		Token.tokenFunctions[Token.ColonTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ':') ? Token.getNewResult(Token.getNewToken(Token.ColonTokenType, ':'), 0) : null;
}
;
		Token.tokenFunctions[Token.CommaTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ',') ? Token.getNewResult(Token.getNewToken(Token.CommaTokenType, ','), 0) : null;
}
;
		Token.tokenFunctions[Token.TernaryTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '?') ? Token.getNewResult(Token.getNewToken(Token.TernaryTokenType, '?'), 0) : null;
}
;
		Token.tokenFunctions[Token.IncrementTokenType].regex = /^\+\+/;
		Token.tokenFunctions[Token.IncrementTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '+' || input.charAt(1) != '+') ? null : Token.regexFind(input, Token.IncrementTokenType);
}
;
		Token.tokenFunctions[Token.DecrementTokenType].regex = /^\-\-/;
		Token.tokenFunctions[Token.DecrementTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '-' || input.charAt(1) != '-') ? null : Token.regexFind(input, Token.DecrementTokenType);
}
;
		Token.tokenFunctions[Token.BreakTokenType].regex = /^break(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.BreakTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'b' || input.charAt(1) != 'r') ? null : Token.regexFind(input, Token.BreakTokenType);
}
;
		Token.tokenFunctions[Token.ContinueTokenType].regex = /^continue(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.ContinueTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'c' || input.charAt(1) != 'o') ? null : Token.regexFind(input, Token.ContinueTokenType);
}
;
		Token.tokenFunctions[Token.DefaultTokenType].regex = /^default(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.DefaultTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'd' || input.charAt(1) != 'e') ? null : Token.regexFind(input, Token.DefaultTokenType);
}
;
		Token.tokenFunctions[Token.InTokenType].regex = /^in(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.InTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'n') ? null : Token.regexFind(input, Token.InTokenType);
}
;
		Token.tokenFunctions[Token.AsTokenType].regex = /^as(?![a-zA-Z0-9_])/;
		Token.tokenFunctions[Token.AsTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'a' || input.charAt(1) != 's') ? null : Token.regexFind(input, Token.AsTokenType);
}
;
		Token.tokenFunctions[Token.DeleteTokenType].regex = /^delete(?![a-zA-Z0-9_.(])/;
		Token.tokenFunctions[Token.DeleteTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'd' || input.charAt(1) != 'e') ? null : Token.regexFind(input, Token.DeleteTokenType);
}
;
		Token.tokenFunctions[Token.IfTokenType].keyword = 'if';
		Token.tokenFunctions[Token.IfTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'i' || input.charAt(1) != 'f') ? null : Token.keywordFind2(input, 'if', Token.IfTokenType, '(', false);
}
;
		Token.tokenFunctions[Token.ElseTokenType].keyword = 'else';
		Token.tokenFunctions[Token.ElseTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.ElseTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'e' || input.charAt(1) != 'l') ? null : Token.keywordFind(input, Token.ElseTokenType);
}
;
		Token.tokenFunctions[Token.EachTokenType].keyword = 'each';
		Token.tokenFunctions[Token.EachTokenType].terminator = /^([\s]|\()/;
		Token.tokenFunctions[Token.EachTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'e' || input.charAt(1) != 'a') ? null : Token.keywordFind(input, Token.EachTokenType);
}
;
		Token.tokenFunctions[Token.ForTokenType].keyword = 'for';
		Token.tokenFunctions[Token.ForTokenType].terminator = /^([\s]|\()/;
		Token.tokenFunctions[Token.ForTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'f' || input.charAt(1) != 'o') ? null : Token.keywordFind(input, Token.ForTokenType);
}
;
		Token.tokenFunctions[Token.WhileTokenType].keyword = 'while';
		Token.tokenFunctions[Token.WhileTokenType].terminator = /^([\s]|\()/;
		Token.tokenFunctions[Token.WhileTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'w' || input.charAt(1) != 'h') ? null : Token.keywordFind(input, Token.WhileTokenType);
}
;
		Token.tokenFunctions[Token.DoTokenType].keyword = 'do';
		Token.tokenFunctions[Token.DoTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.DoTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'd' || input.charAt(1) != 'o') ? null : Token.keywordFind(input, Token.DoTokenType);
}
;
		Token.tokenFunctions[Token.WithTokenType].keyword = 'with';
		Token.tokenFunctions[Token.WithTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.WithTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'w' || input.charAt(1) != 'i') ? null : Token.keywordFind(input, Token.WithTokenType);
}
;
		Token.tokenFunctions[Token.TryTokenType].keyword = 'try';
		Token.tokenFunctions[Token.TryTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.TryTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 't' || input.charAt(1) != 'r') ? null : Token.keywordFind(input, Token.TryTokenType);
}
;
		Token.tokenFunctions[Token.CatchTokenType].keyword = 'catch';
		Token.tokenFunctions[Token.CatchTokenType].terminator = /^([\s]|\()/;
		Token.tokenFunctions[Token.CatchTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != 'c' || input.charAt(1) != 'a')
	{
		return null;
	}
	var result = Token.keywordFind(input, Token.CatchTokenType, [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType]);
	if (!result)
	{
		return null;
	}
	var tokens = result.tokens;
	var index = result.index;
	result = Lexer.lex(input.slice(index + 1), [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.OpenParenTokenType, Token.ClosedParenTokenType, Token.IdentifierTokenType, Token.DotTokenType, Token.ColonTokenType], true);
	tokens = tokens.concat(result.tokens);
	return Token.getNewResult(tokens, result.index + index);
}
;
		Token.tokenFunctions[Token.RegExpTokenType].find = function ($$$$input, $$$$foundTokens) 
{
		//set default parameter values
		var input = $$$$input;
		var foundTokens = $$$$foundTokens;

	if (input.charAt(0) != '/')
	{
		return null;
	}
	outer:	for (var j = foundTokens.length - 1; j >= 0; j--)
	{
		var tokens = foundTokens[j];
		var token;
		var i;
		for (i = tokens.length - 1; i >= 0; i--)
		{
			token = tokens[i];
			switch (token.type)
			{
				case Token.SpaceTokenType:
				case Token.TabTokenType:
				case Token.NewLineTokenType:
					break;
				case Token.EOSTokenType:
				case Token.OpenBracketTokenType:
				case Token.OpenParenTokenType:
				case Token.EqualityTokenType:
				case Token.BitwiseLeftShiftAssignmentTokenType:
				case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
				case Token.BitwiseRightShiftAssignmentTokenType:
				case Token.BitwiseLeftShiftTokenType:
				case Token.BitwiseUnsignedRightShiftTokenType:
				case Token.BitwiseRightShiftTokenType:
				case Token.RelationalTokenType:
				case Token.AddWithAssignmentTokenType:
				case Token.DivWithAssignmentTokenType:
				case Token.ModWithAssignmentTokenType:
				case Token.MulWithAssignmentTokenType:
				case Token.SubWithAssignmentTokenType:
				case Token.AssignmentTokenType:
				case Token.CommaTokenType:
				case Token.DeleteTokenType:
				case Token.InTokenType:
				case Token.WithTokenType:
				case Token.TypeofTokenType:
				case Token.VoidTokenType:
				case Token.ReturnTokenType:
				case Token.ThrowTokenType:
				case Token.NewTokenType:
				case Token.CaseTokenType:
				case Token.AndWithAssignmentTokenType:
				case Token.OrWithAssignmentTokenType:
				case Token.AndTokenType:
				case Token.OrTokenType:
				case Token.BitwiseAndAssignmentTokenType:
				case Token.BitwiseOrAssignmentTokenType:
				case Token.BitwiseXorAssignmentTokenType:
				case Token.BitwiseAndTokenType:
				case Token.BitwiseNotTokenType:
				case Token.BitwiseOrTokenType:
				case Token.BitwiseXorTokenType:
				case Token.NotTokenType:
				case Token.IncrementTokenType:
				case Token.DecrementTokenType:
				case Token.OpenBraceTokenType:
				case Token.IsTokenType:
				case Token.InstanceofTokenType:
				case Token.AddTokenType:
				case Token.RegExpTokenType:
				case Token.SubTokenType:
				case Token.DivTokenType:
				case Token.MulTokenType:
				case Token.ModTokenType:
					break outer;
				default:
					return null;
			}
		}
	}
	var result = Lexer.lex(input.slice(1), [Token.SpecialUFOTokenType], true);
	var previousToken;
	var tokens = result.tokens;
	var foundEnd = false;
	for (i = 0; i < tokens.length; i++)
	{
		token = tokens[i];
		if (foundEnd)
		{
			if (token.data == ',' || token.data == ';' || token.data == ']' || token.data == ')' || token.data == ']' || token.data == '.' || token.data == ' ' || token.data == '	' || token.data.match(/[\r\n]/))
			{
				i++;
				break;
			}
		}
		else if (token.data == '/' && previousToken && previousToken.data != '\\')
		{
			foundEnd = true;
		}
		previousToken = token;
	}
	if (!foundEnd)
	{
		return null;
	}
	tokens = tokens.splice(0, i - 1);
	tokens.unshift(Token.getNewToken(Token.RegExpTokenType, '/'));
	return Token.getNewResult(tokens, i - 1);
}
;
		Token.tokenFunctions[Token.SpecialUFOTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (Token.tokenFunctions[Token.NewLineTokenType].find(input) != null)
	{
		return null;
	}
	return Token.getNewResult(Token.getNewToken(Token.SpecialUFOTokenType, input.charAt(0)), 0);
}
;
		Token.tokenFunctions[Token.FinallyTokenType].keyword = 'finally';
		Token.tokenFunctions[Token.FinallyTokenType].terminator = /^([\s]|\{)/;
		Token.tokenFunctions[Token.FinallyTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != 'f' || input.charAt(1) != 'i') ? null : Token.keywordFind(input, Token.FinallyTokenType);
}
;
		Token.tokenFunctions[Token.AtTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '@') ? Token.getNewResult(Token.getNewToken(Token.AtTokenType, '@'), 0) : null;
}
;
		Token.tokenFunctions[Token.BitwiseLeftShiftAssignmentTokenType].regex = /^<<=/;
		Token.tokenFunctions[Token.BitwiseLeftShiftAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '<' || input.charAt(1) != '<') ? null : Token.regexFind(input, Token.BitwiseLeftShiftAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.BitwiseRightShiftAssignmentTokenType].regex = /^>>=/;
		Token.tokenFunctions[Token.BitwiseRightShiftAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '>' || input.charAt(1) != '>') ? null : Token.regexFind(input, Token.BitwiseRightShiftAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.BitwiseUnsignedRightShiftAssignmentTokenType].regex = /^>>>=/;
		Token.tokenFunctions[Token.BitwiseUnsignedRightShiftAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '>' || input.charAt(1) != '>') ? null : Token.regexFind(input, Token.BitwiseUnsignedRightShiftAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.BitwiseAndAssignmentTokenType].regex = /^&=/;
		Token.tokenFunctions[Token.BitwiseAndAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '&' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.BitwiseAndAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.BitwiseOrAssignmentTokenType].regex = /^\|=/;
		Token.tokenFunctions[Token.BitwiseOrAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '|' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.BitwiseOrAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.BitwiseXorAssignmentTokenType].regex = /^\^=/;
		Token.tokenFunctions[Token.BitwiseXorAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '^' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.BitwiseXorAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.AddWithAssignmentTokenType].regex = /^\+\=/;
		Token.tokenFunctions[Token.AddWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '+' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.AddWithAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.DivWithAssignmentTokenType].regex = /^\/\=/;
		Token.tokenFunctions[Token.DivWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '/' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.DivWithAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.ModWithAssignmentTokenType].regex = /^\%\=/;
		Token.tokenFunctions[Token.ModWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '%' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.ModWithAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.MulWithAssignmentTokenType].regex = /^\*\=/;
		Token.tokenFunctions[Token.MulWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '*' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.MulWithAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.SubWithAssignmentTokenType].regex = /^\-\=/;
		Token.tokenFunctions[Token.SubWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '-' || input.charAt(1) != '=') ? null : Token.regexFind(input, Token.SubWithAssignmentTokenType);
}
;
		Token.tokenFunctions[Token.EqualityTokenType].operators = ['===', '!==', '==', '!='];
		Token.tokenFunctions[Token.EqualityTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '=' && input.charAt(0) != '!')
	{
		return null;
	}
	for (var i = 0; i < Token.tokenFunctions[Token.EqualityTokenType].operators.length; i++)
	{
		var operator = Token.tokenFunctions[Token.EqualityTokenType].operators[i];
		var match = input.match($es4.$$primitive(new RegExp("^" + operator)));
		if (!match)
		{
			continue;
		}
		var token = Token.getNewToken(Token.EqualityTokenType, operator);
		return Token.getNewResult(token, operator.length - 1);
	}
	return null;
}
;
		Token.tokenFunctions[Token.RelationalTokenType].operators = ['>=', '>', '<=', '<'];
		Token.tokenFunctions[Token.RelationalTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '>' && input.charAt(0) != '<')
	{
		return null;
	}
	for (var i = 0; i < Token.tokenFunctions[Token.RelationalTokenType].operators.length; i++)
	{
		var operator = Token.tokenFunctions[Token.RelationalTokenType].operators[i];
		var match = input.match($es4.$$primitive(new RegExp("^" + operator)));
		if (!match)
		{
			continue;
		}
		var token = Token.getNewToken(Token.RelationalTokenType, operator);
		return Token.getNewResult(token, operator.length - 1);
	}
	return null;
}
;
		Token.tokenFunctions[Token.BitwiseAndTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '&') ? Token.getNewResult(Token.getNewToken(Token.BitwiseAndTokenType, '&'), 0) : null;
}
;
		Token.tokenFunctions[Token.BitwiseXorTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '^') ? Token.getNewResult(Token.getNewToken(Token.BitwiseXorTokenType, '^'), 0) : null;
}
;
		Token.tokenFunctions[Token.BitwiseOrTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '|') ? Token.getNewResult(Token.getNewToken(Token.BitwiseOrTokenType, '|'), 0) : null;
}
;
		Token.tokenFunctions[Token.AndTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '&' && input.charAt(1) == '&') ? Token.getNewResult(Token.getNewToken(Token.AndTokenType, '&&'), 1) : null;
}
;
		Token.tokenFunctions[Token.AndWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '&' && input.charAt(1) == '&' && input.charAt(2) == '=') ? Token.getNewResult(Token.getNewToken(Token.AndWithAssignmentTokenType, '&&='), 2) : null;
}
;
		Token.tokenFunctions[Token.OrTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '|' && input.charAt(1) == '|') ? Token.getNewResult(Token.getNewToken(Token.OrTokenType, '||'), 1) : null;
}
;
		Token.tokenFunctions[Token.OrWithAssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '|' && input.charAt(1) == '|' && input.charAt(2) == '=') ? Token.getNewResult(Token.getNewToken(Token.OrWithAssignmentTokenType, '||='), 2) : null;
}
;
		Token.tokenFunctions[Token.BitwiseLeftShiftTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '<' && input.charAt(1) == '<') ? Token.getNewResult(Token.getNewToken(Token.BitwiseLeftShiftTokenType, '<<'), 1) : null;
}
;
		Token.tokenFunctions[Token.BitwiseRightShiftTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '>' && input.charAt(1) == '>') ? Token.getNewResult(Token.getNewToken(Token.BitwiseRightShiftTokenType, '>>'), 1) : null;
}
;
		Token.tokenFunctions[Token.BitwiseUnsignedRightShiftTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '>' && input.charAt(1) == '>' && input.charAt(2) == '>') ? Token.getNewResult(Token.getNewToken(Token.BitwiseUnsignedRightShiftTokenType, '>>>'), 2) : null;
}
;
		Token.tokenFunctions[Token.SubTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '-') ? Token.getNewResult(Token.getNewToken(Token.SubTokenType, '-'), 0) : null;
}
;
		Token.tokenFunctions[Token.AddTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '+') ? Token.getNewResult(Token.getNewToken(Token.AddTokenType, '+'), 0) : null;
}
;
		Token.tokenFunctions[Token.DivTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '/') ? Token.getNewResult(Token.getNewToken(Token.DivTokenType, '/'), 0) : null;
}
;
		Token.tokenFunctions[Token.MulTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '*') ? Token.getNewResult(Token.getNewToken(Token.MulTokenType, '*'), 0) : null;
}
;
		Token.tokenFunctions[Token.ModTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '%') ? Token.getNewResult(Token.getNewToken(Token.ModTokenType, '%'), 0) : null;
}
;
		Token.tokenFunctions[Token.AssignmentTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '=') ? Token.getNewResult(Token.getNewToken(Token.AssignmentTokenType, '='), 0) : null;
}
;
		Token.tokenFunctions[Token.NamespaceKeywordTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == 'n') ? Token.keywordFind2(input, 'namespace', Token.NamespaceKeywordTokenType, Token.identifierStartCharacters, true) : null;
}
;
		Token.tokenFunctions[Token.XMLTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '<')
	{
		return null;
	}
	var isXMLList = input.charAt(1) == '>';
	var resultTokens = [];
	var index = -1;
	var openNodes = 0;
	while (true)
	{
		var result = Lexer.lex(input, [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.StringTokenType, Token.AssignmentTokenType, Token.ColonTokenType, Token.XMLOpenArrowTokenType, Token.XMLIdentifierTokenType, Token.XMLForwardSlashTokenType], true);
		if (!result.tokens.length)
		{
			break;
		}
		if (input.charAt(result.index) != '>')
		{
			break;
		}
		var tokens = result.tokens.concat(Token.getNewToken(Token.XMLClosedArrowTokenType, '>'));
		input = input.slice(result.index + 1);
		index += result.index + 1;
		resultTokens = resultTokens.concat(tokens);
		if (tokens[1].type != Token.XMLForwardSlashTokenType)
		{
			openNodes++;
		}
		if (tokens[1].type == Token.XMLForwardSlashTokenType)
		{
			openNodes--;
		}
		else if (tokens[tokens.length - 2].type == Token.XMLForwardSlashTokenType)
		{
			openNodes--;
		}
		if (!openNodes)
		{
			break;
		}
		if (isXMLList && openNodes == 1)
		{
			result = Lexer.lex(input, [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType], true);
			if (!result.tokens.length)
			{
				continue;
			}
			input = input.slice(result.index);
			index += result.index;
			resultTokens = resultTokens.concat(result.tokens);
		}
		else
		{
			result = Lexer.lex(input, [Token.XMLTextTokenType, Token.XMLCDATATokenType], true);
			if (!result.tokens.length)
			{
				continue;
			}
			input = input.slice(result.index);
			index += result.index;
			resultTokens = resultTokens.concat(result.tokens);
		}
	}
	if (openNodes || !resultTokens.length)
	{
		return null;
	}
	return Token.getNewResult(resultTokens, index);
}
;
		Token.tokenFunctions[Token.XMLIdentifierTokenType].regex = /^[a-zA-Z_][a-zA-Z_0-9]*/;
		Token.tokenFunctions[Token.XMLIdentifierTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return Token.regexFind(input, Token.XMLIdentifierTokenType);
}
;
		Token.tokenFunctions[Token.XMLTextTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) == '<')
	{
		return null;
	}
	var token;
	var tokens = [];
	var i = 0;
	var chunk = '';
	while (i < input.length)
	{
		if (input.charAt(i).match(/[\r\n]/))
		{
			if (chunk.length > 0)
			{
				token = Token.getNewToken(Token.XMLTextTokenType, chunk);
				tokens.push(token);
			}
			token = Token.getNewToken(Token.NewLineTokenType, input.charAt(i));
			tokens.push(token);
			chunk = '';
		}
		else if (input.charAt(i) == '<')
		{
			i--;
			break;
		}
		else
		{
			chunk += input.charAt(i);
		}
		i++;
	}
	if (chunk.length > 0)
	{
		token = Token.getNewToken(Token.XMLTextTokenType, chunk);
		tokens.push(token);
	}
	return Token.getNewResult(tokens, i);
}
;
		Token.tokenFunctions[Token.XMLCDATATokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '<' || input.charAt(1) != '!' || input.charAt(2) != '[' || input.indexOf('<![CDATA[') != 0)
	{
		return null;
	}
	var tokens = [];
	var token = Token.getNewToken(Token.XMLCDATATokenType, '<![CDATA[');
	tokens.push(token);
	var i = 9;
	var chunk = '';
	while (i < input.length)
	{
		if (input.charAt(i).match(/[\r\n]/))
		{
			if (chunk.length > 0)
			{
				token = Token.getNewToken(Token.XMLCDATAChunkTokenType, chunk);
				tokens.push(token);
			}
			token = Token.getNewToken(Token.NewLineTokenType, input.charAt(i));
			tokens.push(token);
			chunk = '';
		}
		else if (input.charAt(i - 2) == ']' && input.charAt(i - 1) == ']' && input.charAt(i) == '>')
		{
			chunk = chunk.slice(0, chunk.length - 2);
			break;
		}
		else
		{
			chunk += input.charAt(i);
		}
		i++;
	}
	if (chunk.length > 0)
	{
		token = Token.getNewToken(Token.XMLCDATAChunkTokenType, chunk);
		tokens.push(token);
	}
	token = Token.getNewToken(Token.XMLCDATAEndTokenType, ']]>');
	tokens.push(token);
	return Token.getNewResult(tokens, i);
}
;
		Token.tokenFunctions[Token.XMLOpenArrowTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '<') ? Token.getNewResult(Token.getNewToken(Token.XMLOpenArrowTokenType, '<'), 0) : null;
}
;
		Token.tokenFunctions[Token.XMLClosedArrowTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '>') ? Token.getNewResult(Token.getNewToken(Token.XMLClosedArrowTokenType, '>'), 0) : null;
}
;
		Token.tokenFunctions[Token.XMLForwardSlashTokenType].regex = /^\//;
		Token.tokenFunctions[Token.XMLForwardSlashTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != '/') ? null : Token.regexFind(input, Token.XMLForwardSlashTokenType);
}
;
		Token.tokenFunctions[Token.NamespaceQualifierTokenType].regex = /^::/;
		Token.tokenFunctions[Token.NamespaceQualifierTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) != ':' || input.charAt(1) != ':') ? null : Token.regexFind(input, Token.NamespaceQualifierTokenType);
}
;
		Token.tokenFunctions[Token.VectorDotOpenArrowTokenType].regex = /^\.\</;
		Token.tokenFunctions[Token.VectorDotOpenArrowTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != '.')
	{
		return null;
	}
	var result = Token.regexFind(input, Token.VectorDotOpenArrowTokenType);
	if (!result)
	{
		return null;
	}
	var tokens = result.tokens;
	var index = result.index;
	result = Lexer.lex(input.slice(index + 1), [Token.NewLineTokenType, Token.TabTokenType, Token.SpaceTokenType, Token.IdentifierTokenType, Token.DotTokenType, Token.VectorClosedArrowTokenType], true);
	tokens = tokens.concat(result.tokens);
	return Token.getNewResult(tokens, result.index + index);
}
;
		Token.tokenFunctions[Token.VectorClosedArrowTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '>') ? Token.getNewResult(Token.getNewToken(Token.VectorClosedArrowTokenType, '>'), 0) : null;
}
;
		Token.tokenFunctions[Token.StringTokenType].prefixAllowed = ["'", '"'];
		Token.tokenFunctions[Token.StringTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) != "'" && input.charAt(0) != '"')
	{
		return null;
	}
	var tokens = [];
	var token = Token.getNewToken(Token.StringTokenType, input.charAt(0));
	tokens.push(token);
	var i = 1;
	var ignore = false;
	var lastChar;
	var stringChunk = '';
	while (i < input.length && (input.charAt(0) != input.charAt(i) || ignore))
	{
		if (lastChar == '\\' && input.charAt(i).match(/[\r\n]/) && !ignore)
		{
			if (stringChunk.length - 1 > 0)
			{
				token = Token.getNewToken(Token.StringChunkTokenType, stringChunk.slice(0, stringChunk.length - 1));
				tokens.push(token);
			}
			token = Token.getNewToken(Token.StringMultiLineDelimiterTokenType, lastChar);
			tokens.push(token);
			token = Token.getNewToken(Token.NewLineTokenType, input.charAt(i));
			tokens.push(token);
			stringChunk = '';
		}
		else
		{
			stringChunk += input.charAt(i);
		}
		lastChar = input.charAt(i);
		ignore = lastChar == '\\' && !ignore;
		i++;
	}
	if (stringChunk.length > 0)
	{
		token = Token.getNewToken(Token.StringChunkTokenType, stringChunk);
		tokens.push(token);
	}
	token = Token.getNewToken(Token.StringEndTokenType, input.charAt(i));
	tokens.push(token);
	return Token.getNewResult(tokens, i);
}
;
		Token.tokenFunctions[Token.NumberTokenType].regex1 = /^([0-9]|[\.][0-9\.]+)[0-9\.]*(e[+-][0-9]+)*/;
		Token.tokenFunctions[Token.NumberTokenType].regex2 = /^0x[a-fA-F0-9]+/;
		Token.tokenFunctions[Token.NumberTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if (input.charAt(0) == '0' && input.charAt(1) == 'x')
	{
		return Token.regexFind(input, Token.NumberTokenType, Token.tokenFunctions[Token.NumberTokenType].regex2);
	}
	if (input.charAt(0) != '0' && input.charAt(0) != '1' && input.charAt(0) != '2' && input.charAt(0) != '3' && input.charAt(0) != '4' && input.charAt(0) != '5' && input.charAt(0) != '6' && input.charAt(0) != '7' && input.charAt(0) != '8' && input.charAt(0) != '9' && input.charAt(0) != '.')
	{
		return;
	}
	return Token.regexFind(input, Token.NumberTokenType, Token.tokenFunctions[Token.NumberTokenType].regex1);
}
;
		Token.tokenFunctions[Token.SpaceTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == ' ') ? Token.getNewResult(Token.getNewToken(Token.SpaceTokenType, ' '), 0) : null;
}
;
		Token.tokenFunctions[Token.TabTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return (input.charAt(0) == '	') ? Token.getNewResult(Token.getNewToken(Token.TabTokenType, '	'), 0) : null;
}
;
		Token.tokenFunctions[Token.NewLineTokenType].regex = /[\r\n]/;
		Token.tokenFunctions[Token.NewLineTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	var tokens;
	var index = -1;
	while (input.charAt(index + 1).match(Token.tokenFunctions[Token.NewLineTokenType].regex))
	{
		if (!tokens)
		{
			tokens = [];
		}
		tokens.push(Token.getNewToken(Token.NewLineTokenType, input.charAt(index + 1)));
		index++;
	}
	return (index == -1) ? null : Token.getNewResult(tokens, index);
}
;
		Token.tokenFunctions[Token.UFOTokenType].find = function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return Token.getNewResult(Token.getNewToken(Token.UFOTokenType, input.charAt(0)), 0);
}
;
	});

	//public static method
	Token.getNewToken = (function ($$$$type, $$$$data)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var type = $es4.$$coerce($$$$type, String);
		var data = $$$$data;

		return {constructor:"token", type:type, data:data, line:NaN, position:NaN};
	});

	//public static method
	Token.getNewResult = (function ($$$$tokens, $$$$index)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var tokens = $$$$tokens;
		var index = $es4.$$coerce($$$$index, Number);

		if (!($es4.$$is(tokens, Array)))
		{
			tokens = [tokens];
		}
		return {tokens:tokens, index:index};
	});

	//public static method
	Token.keywordFind2 = (function ($$$$input, $$$$keyword, $$$$TokenType, $$$$matchNext, $$$$requireWhitespace)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var keyword = $$$$keyword;
		var TokenType = $$$$TokenType;
		var matchNext = $$$$matchNext;
		var requireWhitespace = $es4.$$coerce($$$$requireWhitespace, Boolean);

		if (input.substring(0, keyword.length) != keyword)
		{
			return null;
		}
		var cur = null;
		var whitespace = 0;
		var inputLength = input.length;
		for (var i = keyword.length; i < inputLength; i++)
		{
			cur = input.charAt(i);
			if (Token.whitespaceCharacters[cur] === undefined)
			{
				break;
			}
			whitespace++;
		}
		if (requireWhitespace && whitespace === 0)
		{
			return null;
		}
		if ($es4.$$is(matchNext, String))
		{
			if (cur != matchNext)
			{
				return null;
			}
		}
		else
		{
			if (matchNext[cur] === undefined)
			{
				return null;
			}
		}
		return Token.getNewResult(Token.getNewToken(TokenType, keyword), keyword.length - 1);
	});

	//public static method
	Token.keywordFind = (function ($$$$input, $$$$TokenType, $$$$grammer)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var TokenType = $$$$TokenType;
		var grammer = (2 > arguments.length - 1) ? null : $$$$grammer;

		for (var i = 0; i < Token.tokenFunctions[TokenType].keyword.length; i++)
		{
			if (Token.tokenFunctions[TokenType].keyword.charAt(i) !== input.charAt(i))
			{
				return null;
			}
		}
		if (!input.charAt(i).match(Token.tokenFunctions[TokenType].terminator))
		{
			return null;
		}
		if (!grammer)
		{
			return Token.getNewResult(Token.getNewToken(TokenType, Token.tokenFunctions[TokenType].keyword), Token.tokenFunctions[TokenType].keyword.length - 1);
		}
		var result = Lexer.lex(input.slice(Token.tokenFunctions[TokenType].keyword.length), grammer, true);
		result.tokens.unshift(Token.getNewToken(TokenType, Token.tokenFunctions[TokenType].keyword));
		return Token.getNewResult(result.tokens, result.index + Token.tokenFunctions[TokenType].keyword.length - 1);
	});

	//public static method
	Token.regexFind = (function ($$$$input, $$$$TokenType, $$$$regex)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var TokenType = $$$$TokenType;
		var regex = (2 > arguments.length - 1) ? null : $$$$regex;

		if (!regex)
		{
			regex = Token.tokenFunctions[TokenType].regex;
		}
		var match = input.match(regex);
		if (!match)
		{
			return null;
		}
		return Token.getNewResult(Token.getNewToken(TokenType, match[0]), match[0].length - 1);
	});
	function Token()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Token) || $$this.$$Token !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Token) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Token.$$construct($$this, $$args);
		}
	}

	//construct
	Token.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Token', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Token.$$iinit($$this);

		//call constructor
		if (args !== undefined) Token.$$constructor.apply($$this, args);
	});

	//initializer
	Token.$$iinit = (function ($$this)
	{
	});

	//constructor
	Token.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Token, null, 'sweetrush.obj::Token');
})();
//sweetrush.obj.Token


//sweetrush.core.TranslatorPrototype
$es4.$$package('sweetrush.core').TranslatorPrototype = (function ()
{
	//imports
	var Construct;
	var Token;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//class pre initializer
	TranslatorPrototype.$$sinit = (function ()
	{
		TranslatorPrototype.$$sinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		Parser = $es4.$$['sweetrush.core'].Parser;

		//set prototype and constructor
		TranslatorPrototype.prototype = Object.create(Object.prototype);
		Object.defineProperty(TranslatorPrototype.prototype, "constructor", { value: TranslatorPrototype, enumerable: false });

		//hold private values
		Object.defineProperty(TranslatorPrototype.prototype, '$$v', {value:{}});
	});

	//class initializer
	TranslatorPrototype.$$cinit = (function ()
	{
		TranslatorPrototype.$$cinit = undefined;
	});

	//public static method
	TranslatorPrototype.translate = (function ($$$$rootConstruct, $$$$rootConstructs, $$$$dynamicPropertyAccess, $$$$release, $$$$fastPropertyAccess)
	{
		if (TranslatorPrototype.$$cinit !== undefined) TranslatorPrototype.$$cinit();

		//set default parameter values
		var rootConstruct = $$$$rootConstruct;
		var rootConstructs = $$$$rootConstructs;
		var dynamicPropertyAccess = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$dynamicPropertyAccess, Boolean);
		var release = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$release, Boolean);
		var fastPropertyAccess = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$fastPropertyAccess, Boolean);

		var _rootConstruct = rootConstruct;
		var _rootConstructs = rootConstructs;
		var _indent = -1;
		var _count = -1;
		var _level = 0;
		var _fastPropertyAccess = fastPropertyAccess = false;
		var _dynamicPropertyAccess = false;
		var _inClosure = false;
		var _inNamespacedFunction = false;
		var _inStaticFunction = false;
		var _inIfStatement = 0;
		var _importNameConflicts = {};
		var _extendsNameConflict = false;

		function upLevel() 
		{
			_indent++;
			_level++;
			return _level;
		}
;

		function downLevel() 
		{
			_indent--;
			_level--;
			return _level;
		}
;

		function lookupConstructInRootConstruct($$$$rootConstruct, $$$$object) 
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;
			var object = $$$$object;

			if (!rootConstruct || !object)
			{
				throw $es4.$$primitive(new Error('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < rootConstruct.classConstructs.length; i++)
				{
					if (rootConstruct.classConstructs[i].identifierToken.data == object)
					{
						return rootConstruct.classConstructs[i];
					}
				}
				for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++)
				{
					if (rootConstruct.interfaceConstructs[i].identifierToken.data == object)
					{
						return rootConstruct.interfaceConstructs[i];
					}
				}
				if (rootConstruct.packageConstruct.classConstruct)
				{
					return rootConstruct.packageConstruct.classConstruct;
				}
				if (rootConstruct.packageConstruct.interfaceConstruct)
				{
					return rootConstruct.packageConstruct.interfaceConstruct;
				}
				if (rootConstruct.packageConstruct.propertyConstruct)
				{
					return rootConstruct.packageConstruct.propertyConstruct;
				}
				if (rootConstruct.packageConstruct.methodConstruct)
				{
					return rootConstruct.packageConstruct.methodConstruct;
				}
				throw $es4.$$primitive(new Error('could not lookup construct in construct: ' + object));
			}
			if (object.constructor == Construct.NameConstruct)
			{
				return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object));
			}
			else if (object.constructor == Construct.ImportConstruct)
			{
				return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));
			}
		}
;

		var packageConstruct = rootConstruct.packageConstruct;
		var js = print('$es4.$$package(\'' + (packageConstruct.nameConstruct ? Construct.nameConstructToString(packageConstruct.nameConstruct) : '') + '\').', _indent, 0);
		if (packageConstruct.classConstruct)
		{
			if (packageConstruct.classConstruct.UNIMPLEMENTEDToken)
			{
				if (release)
				{
					js += packageConstruct.classConstruct.identifierToken.data + ' = null;\n';
					return js;
				}
				js = (packageConstruct.nameConstruct) ? '$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
				js += '.' + packageConstruct.classConstruct.identifierToken.data;
				js += ' = function () { throw new Error(\'Use of unimplemented class: ' + packageConstruct.classConstruct.identifierToken.data + '\'); }';
				js += '\n';
				return js;
			}
			js += print(translateClassConstruct(packageConstruct.classConstruct), _indent, 0);
		}
		js += (packageConstruct.interfaceConstruct) ? print(translateInterfaceConstruct(packageConstruct.interfaceConstruct), _indent, 0) : '';
		js += (packageConstruct.propertyConstruct) ? print(translatePropertyConstruct(packageConstruct.propertyConstruct), _indent, 0) : '';
		if (packageConstruct.methodConstruct)
		{
			if (packageConstruct.methodConstruct.UNIMPLEMENTEDToken)
			{
				if (release)
				{
					js += packageConstruct.methodConstruct.identifierToken.data + ' = null;\n';
					return js;
				}
				js = (packageConstruct.nameConstruct) ? '$es4.$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
				js += '.' + packageConstruct.methodConstruct.identifierToken.data;
				js += ' = function () { throw new Error(\'Use of unimplemented function: ' + packageConstruct.methodConstruct.identifierToken.data + '\'); }';
				js += '\n';
				return js;
			}
			_inStaticFunction = true;
			js += print(translateFunctionConstruct(packageConstruct.methodConstruct), _indent, 0);
		}
		return js;

		function getTranslatedTypeName($$$$type) 
		{
			//set default parameter values
			var type = $$$$type;

			if (type.name == '*' || type.name == 'void')
			{
				return '';
			}
			if (_importNameConflicts[type.name])
			{
				var fullyQualifiedName = type.fullyQualifiedName;
				var parts = fullyQualifiedName.split('.');
				var name = parts.pop();
				return '$es4.$$[\'' + parts.join('.') + '\'].' + name;
			}
			return type.name;
		}
;

		function translateInterfaceConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('function ' + construct.identifierToken.data + '()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//handle cast', _indent + 2, 1);
			js += print('return $es4.$$as(arguments[0], ' + construct.identifierToken.data + ');', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var comma = false;
			var innerJS = '';
			if (construct.extendsNameConstructs.length)
			{
				innerJS += 'IMPLEMENTS:[';
				for (var i = 0; i < construct.extendsNameConstructs.length; i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = construct.extendsNameConstructs[i].type;
					var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstructs[i]);
					if (innerConstruct.isInternal)
					{
						innerJS += comma = type.fullyQualifiedName;
					}
					else
					{
						innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!construct.isInternal)
			{
				if (_rootConstruct.classConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
				if (_rootConstruct.interfaceConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
			}
			var packageName = construct.packageName;
			var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;
			if (innerJS)
			{
				js += print('return $es4.$$interface(' + construct.identifierToken.data + ', ', _indent + 1, 0, 1);
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js += print('return $es4.$$interface(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
				js += print('\'' + fullyQualifiedName + '\');', 0, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;
		}
;

		function translatePropertyConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			return print(construct.identifierToken.data + ' = $es4.$$namespace(' + translateExpression(construct.valueExpression, _indent, false, construct) + ', true);', 0, 1);
		}
;

		function translateFunctionConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var importConstructs = _rootConstruct.packageConstruct.importConstructs;
			var js = '';
			var innerJS;
			var cr = false;
			var accessor = construct.getToken || construct.setToken;
			js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('var $$this = ' + construct.identifierToken.data + ', $$thisp = ' + construct.identifierToken.data + ';', _indent + 1, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			if (accessor)
			{
				js += print(construct.identifierToken.data + '.$$pcinit = ' + construct.identifierToken.data + ';', _indent + 1, 1, 1);
				js += print('return ' + construct.identifierToken.data + ';', _indent + 1, 1, 0);
			}
			else
			{
				js += print('return $es4.$$function (' + construct.identifierToken.data + ');', _indent + 1, 1, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;

			function translateImports($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				var js = '';
				if (importConstructs.length)
				{
					js += print('//imports', _indent + 1, 1);
				}
				for (var i = 0; i < importConstructs.length; i++)
				{
					js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
				}
				return js;
			}
;

			function translateClassInitializer($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				_inStaticFunction = true;
				var js = print('//function initializer', _indent + 1, 1);
				js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
				js += print('{', _indent + 1, 1);
				js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 1);
				var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
				if (importConstructs.length)
				{
					js += print('//initialize imports', _indent + 2, 1, 1);
				}
				var importNames = {};
				importNames[construct.identifierToken.data] = true;
				for (var i = 0; i < importConstructs.length; i++)
				{
					var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
					var packageName = '';
					if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
					{
						var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
						fullyQualifiedName = fullyQualifiedName.split('.');
						fullyQualifiedName.pop();
						packageName = fullyQualifiedName.join('.');
					}
					if (importNames[name])
					{
						_importNameConflicts[name] = true;
						continue;
					}
					else
					{
						importNames[name] = true;
					}
					js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
				}
				js += print('});', _indent + 1, 1);
				_inStaticFunction = false;
				return js;
			}
;

			function translateClassFunction($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				upLevel();
				var js = '';
				if (accessor)
				{
					var name = construct.getToken ? 'getter' : 'setter';
					js += print('function ' + construct.identifierToken.data + '() { $es4.$$' + name + '(\'' + construct.identifierToken.data + '\', ' + '$es4.$$package(\'' + (construct.packageConstruct.nameConstruct ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '') + '\'), (function ()', _indent, 1);
				}
				else
				{
					js += print('function ' + construct.identifierToken.data + '(', _indent, 0);
				}
				js += translateParameters(construct, construct);
				if (!accessor)
				{
					js += print(')', 0, (_indent) ? 1 : 0);
				}
				js += print('{', _indent, (_indent) ? 1 : 0);
				js += print('//initialize function if not initialized', _indent + 1, 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(construct, construct);
				if (accessor)
				{
					js += print('//change reference', _indent + 1, 1, 1);
					js += print(construct.identifierToken.data + ' = this;', _indent + 1, construct.bodyStatements.length ? 2 : 1);
				}
				if (construct.isJavaScript)
				{
					js += construct.javaScriptString;
				}
				else
				{
					js += translateStatements(construct.bodyStatements, _indent + 1, construct);
				}
				if (accessor)
				{
					js += print('})', (construct.isJavaScript) ? 0 : _indent, 0);
					js += print(');}', 0, 1);
				}
				else
				{
					js += print('}', 0, 1);
				}
				downLevel();
				return js;
			}
;
		}
;

		function translateClassConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			upLevel();
			_extendsNameConflict = construct.extendsNameConflict;
			var innerJS;
			var cr = false;
			js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateNamespaces(construct, true)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateStaticProperties(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassPreInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateStaticMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateStaticAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateConstruct(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInitializer(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateConstructor(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInternalClasses(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInternalInterfaces(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateClassReturnStatement(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += print('})();', _indent, 1);
			downLevel();
			return js;
		}
;

		function translateClassPreInitializer($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = print('//class pre initializer', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$sinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$sinit = undefined;', _indent + 2, 2);
			var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
			if (importConstructs.length)
			{
				js += print('//initialize imports', _indent + 2, 1);
			}
			var found = false;
			var extraCR = 0;
			var importNames = {};
			importNames[construct.identifierToken.data] = true;
			for (var i = 0; i < importConstructs.length; i++)
			{
				found = true;
				var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
				var packageName = '';
				if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
				{
					var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
					fullyQualifiedName = fullyQualifiedName.split('.');
					fullyQualifiedName.pop();
					packageName = fullyQualifiedName.join('.');
				}
				if (importNames[name])
				{
					_importNameConflicts[name] = true;
					continue;
				}
				else
				{
					importNames[name] = true;
				}
				extraCR = 1;
				js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
			}
			var className = construct.identifierToken.data;
			var superClassName = 'Object';
			if (construct.extendsNameConstruct)
			{
				superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
				js += print('//ensure $$sinit is called on super class', _indent + 2, 1, extraCR);
				js += print('if (' + superClassName + '.$$sinit !== undefined) ' + superClassName + '.$$sinit();', _indent + 2, 1);
			}
			js += print('//set prototype and constructor', _indent + 2, 1, extraCR);
			js += print(className + '.prototype = Object.create(' + superClassName + '.prototype);', _indent + 2, 1);
			js += print('Object.defineProperty(' + className + '.prototype, "constructor", { value: ' + className + ', enumerable: false });', _indent + 2, 2);
			extraCR = 0;
			js += print('//hold private values', _indent + 2, 1);
			js += print('Object.defineProperty(' + className + '.prototype, \'$$v\', {value:{}});', _indent + 2, 1);
			var innerJS;
			js += (innerJS = translateInstanceMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInstanceAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInstanceProperties(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += print('});', _indent + 1, 1);
			_inStaticFunction = false;
			return js;
		}
;

		function translateClassInitializer($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = print('//class initializer', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 1);
			var found = false;
			for (var i = 0; i < construct.propertyConstructs.length; i++)
			{
				var propertyConstruct = construct.propertyConstructs[i];
				if (!propertyConstruct.staticToken)
				{
					continue;
				}
				if (propertyConstruct.translatedEarlier)
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var type = getTranslatedTypeName(propertyConstruct.identifier.type);
				js += print('$$j.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);
				if (type)
				{
					js += '$es4.$$coerce(';
				}
				js += (propertyConstruct.valueExpression) ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : 'undefined';
				if (type)
				{
					js += ', ' + type + ')';
				}
				js += print(';', 0, 1);
			}
			if (found)
			{
				js += print('', _indent + 1, 1);
			}
			js += translateStatements(construct.initializerStatements, _indent + 2, construct);
			js += print('});', _indent + 1, 1);
			_inStaticFunction = false;
			return js;
		}
;

		function translateClassFunction($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			upLevel();
			var js = print('function ' + construct.identifierToken.data + '()', _indent, 1);
			js += print('{', _indent, 1);
			js += print('var $$this;', _indent + 1, 2);
			js += print('//save scope', _indent + 1, 1);
			js += print('if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];', _indent + 1, 1);
			js += print('else', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('var $$this = this;', _indent + 2, 2);
			js += print('if (!($$this instanceof ' + construct.identifierToken.data + ') || $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ' !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + construct.identifierToken.data + ') : $es4.$$throwArgumentError();', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var innerJS;
			js += print('//call construct if no arguments, or argument zero does not equal manual construct', _indent + 1, 1, 1);
			js += print('if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];', _indent + 2, 2);
			js += print(construct.identifierToken.data + '.$$construct($$this, $$args);', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			js += print('}', _indent, 1);
			downLevel();
			return js;
		}
;

		function translateConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = print('//construct', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$construct = (function ($$this, args)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//initialize function if not initialized', _indent + 2, 1);
			js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 2, 2);
			js += print('//hold property values, and methods', _indent + 2, 1);
			js += print('Object.defineProperty($$this, \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', {value:{$$this:$$this, $$p:{}, $$ns:{}}});', _indent + 2, 2);
			upLevel();
			var innerJS;
			innerJS = translateNamespaces(construct, false);
			if (innerJS)
			{
				js += print(innerJS, 0, 0, 1);
			}
			js += translateNamespaceInstanceMethods(construct);
			downLevel();
			var propertyConstructs = construct.instancePropertyConstructs;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				if (!namespaceObj.isPrivate)
				{
					continue;
				}
				js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + propertyConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + propertyConstruct.identifierToken.data + ');', _indent + 2, 1);
			}
			for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
			{
				var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
				var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var isPrivate = methodConstruct.namespaceToken.data == 'private';
				if (!isPrivate)
				{
					continue;
				}
				js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ');', _indent + 2, 1);
			}
			js += print(innerJS, 0, 0, 1);
			for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
			{
				var methodConstruct = construct.instanceMethodConstructs[i];
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				if (namespaceObj.isCustom)
				{
					continue;
				}
				if (!methodConstruct.identifier.namespaceObj.isPrivate)
				{
					continue;
				}
				var type = methodConstruct.identifier.type;
				js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent + 2, 1);
				js += print('Object.defineProperty($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + ', \'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ');', _indent + 2, 2);
			}
			if (construct.extendsNameConstruct)
			{
				var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
				js += print('//call construct on super', _indent + 2, 1);
				js += print(superClassName + '.$$construct($$this);', _indent + 2, 2, 0);
			}
			js += print('//initialize properties', _indent + 2, 1);
			js += print(construct.identifierToken.data + '.$$iinit($$this);', _indent + 2, 2, 0);
			js += print('//call constructor', _indent + 2, 1);
			js += print('if (args !== undefined) ' + construct.identifierToken.data + '.$$constructor.apply($$this, args);', _indent + 2, 1, 0);
			js += print('});', _indent + 1, 1);
			_inStaticFunction = false;
			return js;
		}
;

		function translateInitializer($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = print('//initializer', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$iinit = (function ($$this)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			var found = false;
			for (var i = 0; i < construct.instancePropertyConstructs.length; i++)
			{
				var propertyConstruct = construct.instancePropertyConstructs[i];
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var type = getTranslatedTypeName(propertyConstruct.identifier.type);
				if (!namespaceObj.isPrivate)
				{
					js += print('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);
				}
				else
				{
					js += print('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = ', _indent + 2, 0);
				}
				if (type)
				{
					js += '$es4.$$coerce(';
				}
				js += (propertyConstruct.valueExpression) ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : 'undefined';
				if (type)
				{
					js += ', ' + type + ')';
				}
				js += print(';', 0, 1);
			}
			if (found)
			{
				js += print('', _indent + 1, 1);
			}
			if (construct.extendsNameConstruct)
			{
				var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
				js += print('//call iinit on super', _indent + 2, 1);
				js += print(superClassName + '.$$iinit($$this);', _indent + 2, 1, 0);
			}
			js += print('});', _indent + 1, 1);
			_inStaticFunction = false;
			return js;
		}
;

		function translateConstructor($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var methodConstruct = construct.constructorMethodConstruct;
			var js = print('//constructor', _indent, 1);
			js += print(construct.identifierToken.data + '.$$constructor = (function (', _indent, 0);
			if (methodConstruct)
			{
				js += translateParameters(methodConstruct, construct);
			}
			js += print(')', 0, 1);
			js += print('{', _indent, 1);
			js += print('var $$this = this;', _indent + 1, 1, 0);
			if (methodConstruct)
			{
				js += translateDefaultParameterValues(methodConstruct, construct);
			}
			var carriage = false;
			if (construct.extendsNameConstruct && (!methodConstruct || (methodConstruct && !methodConstruct.callsSuper)))
			{
				var superClassName = getTranslatedTypeName(construct.extendsNameConstruct.type);
				js += print(superClassName + '.$$constructor.call($$this);', _indent + 1, 1, 1);
				carriage = true;
			}
			if (methodConstruct)
			{
				var innerJS = print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
				if (innerJS && carriage)
				{
					js += print('', 0, 1);
				}
				if (innerJS)
				{
					js += innerJS;
				}
			}
			js += print('});', _indent, 1);
			downLevel();
			return js;
		}
;

		function translateInternalClasses($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if (construct.isInternal)
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL CLASS////////////////', _indent + 1, 1);
				js += print('var ' + translateClassConstruct(_rootConstruct.classConstructs[i]), 1, 0);
			}
			return js;
		}
;

		function translateInternalInterfaces($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if (construct.isInternal)
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL INTERFACE////////////////', _indent + 1, 1);
				js += print('var ' + translateInterfaceConstruct(_rootConstruct.interfaceConstructs[i]), 1, 0);
			}
			return js;
		}
;

		function translateClassReturnStatement($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = print('return $es4.$$class(' + construct.identifierToken.data + ', ', _indent + 1, 0);
			var comma = false;
			var innerJS = '';
			if (construct.extendsNameConstruct)
			{
				var type = construct.extendsNameConstruct.type;
				var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstruct);
				if (innerConstruct.isInternal)
				{
					innerJS += comma = 'EXTENDS:' + type.fullyQualifiedName;
				}
				else
				{
					innerJS += comma = 'EXTENDS:\'' + type.fullyQualifiedName + '\'';
				}
			}
			if (construct.implementsNameConstructs.length)
			{
				if (comma)
				{
					innerJS += ', ';
				}
				innerJS += 'IMPLEMENTS:[';
				comma = false;
				for (var i = 0; i < construct.implementsNameConstructs.length; i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = construct.implementsNameConstructs[i].type;
					var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.implementsNameConstructs[i]);
					if (innerConstruct.isInternal)
					{
						innerJS += comma = type.fullyQualifiedName;
					}
					else
					{
						innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!construct.isInternal)
			{
				if (_rootConstruct.classConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
				if (_rootConstruct.interfaceConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
			}
			var packageName = construct.packageName;
			var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;
			if (innerJS)
			{
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js = print('return $es4.$$class(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
				js += print('\'' + fullyQualifiedName + '\');', 0, 1);
			}
			return js;
		}
;

		function translateImports($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
			if (importConstructs.length)
			{
				js += print('//imports', _indent + 1, 1);
			}
			for (var i = 0; i < importConstructs.length; i++)
			{
				js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
			}
			return js;
		}
;

		function translateNamespaces($$$$construct, $$$$isClassLevel) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = $$$$isClassLevel;

			var js = '';
			var propertyConstructs = construct.namespacePropertyConstructs;
			var counter = 0;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//namespaces', _indent + 1, 1);
				}
				js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_namespace(' + (propertyConstruct.valueExpression ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + construct.identifierToken.data + '\'') + ', ' + ((isClassLevel) ? construct.identifierToken.data : (propertyConstruct.namespaceToken.data == 'private' ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns') : '$$this')) + ', \'' + propertyConstruct.identifierToken.data + '\');', _indent + 1, 1);
			}
			return js;
		}
;

		function translateStaticProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = construct.staticPropertyConstructs;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
					js += print('var $$j = {};', _indent + 1, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var type = propertyConstruct.identifier.type;
				var scope = construct.identifierToken.data;
				if (namespaceObj.isCustom)
				{
					throw $es4.$$primitive(new Error('custom static properties not supported at the moment'));
				}
				var returnString = getTranslatedTypeName(type);
				if (propertyConstruct.constToken && propertyConstruct.valueExpression)
				{
					if (returnString == 'String' || returnString == 'uint' || returnString == 'int' || returnString == 'Number' || returnString == 'Boolean')
					{
						var constructor = propertyConstruct.valueExpression.constructor;
						if (constructor === Construct.StringExpression || constructor === Construct.NumberExpression || constructor === Construct.BooleanExpression)
						{
							var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
							var coerce = false;
							if (constructor === Construct.StringExpression && returnString != 'String')
							{
								coerce = true;
							}
							else if (constructor === Construct.BooleanExpression && returnString != 'Boolean')
							{
								coerce = true;
							}
							else if (constructor === Construct.NumberExpression)
							{
								if (returnString == 'uint')
								{
									if (parseInt(valueJS) != (valueJS >>> 0))
									{
										coerce = true;
									}
								}
								else if (returnString == 'int')
								{
									if (parseInt(valueJS) != (valueJS >> 0))
									{
										coerce = true;
									}
								}
							}
							if (coerce)
							{
								js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(' + valueJS + ', ' + returnString + ');', _indent + 1, 1);
							}
							else
							{
								js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = ' + valueJS + ';', _indent + 1, 1);
							}
							propertyConstruct.translatedEarlier = true;
							continue;
						}
					}
				}
				js += print('Object.defineProperty(' + construct.identifierToken.data + ', \'' + propertyConstruct.identifierToken.data + '\', {', _indent + 1, 1);
				js += print('get:function () { ', _indent + 1, 0);
				js += 'if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit(); ';
				js += print('return $$j.' + propertyConstruct.identifierToken.data + '; },', 0, 1);
				js += print('set:function (value) { ', _indent + 1, 0);
				js += 'if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit(); ';
				if (returnString)
				{
					js += print('$$j.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', 0, 1);
				}
				else
				{
					js += print('$$j.' + propertyConstruct.identifierToken.data + ' = value }', 0, 1);
				}
				js += print('});', _indent + 1, 2);
			}
			return js;
		}
;

		function translateInstanceProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = construct.instancePropertyConstructs;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//properties', _indent + 2, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				if (namespaceObj.isCustom)
				{
					throw $es4.$$primitive(new Error('custom namespace properties not supported at this time'));
				}
				var returnString = getTranslatedTypeName(propertyConstruct.identifier.type);
				if (namespaceObj.isPrivate)
				{
					js += print(construct.identifierToken.data + '.prototype.$$v.' + propertyConstruct.identifierToken.data + ' = {', _indent + 2, 1);
					js += print('get:function () { var $$this = this.$$this; return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + '; },', _indent + 2, 1);
					if (returnString)
					{
						js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
					}
					else
					{
						js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.' + propertyConstruct.identifierToken.data + ' = value }', _indent + 2, 1);
					}
					js += print('};', _indent + 2, 2);
					continue;
				}
				js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + propertyConstruct.identifierToken.data + '\', {', _indent + 2, 1);
				js += print('get:function () { var $$this = this; return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + '; },', _indent + 2, 1);
				if (returnString)
				{
					js += print('set:function (value) { var $$this = this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
				}
				else
				{
					js += print('set:function (value) { var $$this = this; $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + propertyConstruct.identifierToken.data + ' = value }', _indent + 2, 1);
				}
				js += print('});', _indent + 2, 2);
			}
			return js;
		}
;

		function translateStaticMethods($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < construct.staticMethodConstructs.length; i++)
			{
				var methodConstruct = construct.staticMethodConstructs[i];
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				if (methodConstruct.isJavaScript)
				{
					if (namespaceObj.isCustom)
					{
						js += translateCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct);
					}
					else
					{
						js += translateNoCustomNamespaceJavaScriptStaticMethod(construct, methodConstruct);
					}
				}
				else
				{
					if (namespaceObj.isCustom)
					{
						js += translateCustomNamespaceStaticMethod(construct, methodConstruct);
					}
					else
					{
						js += translateNoCustomNamespaceStaticMethod(construct, methodConstruct);
					}
				}
				if (i + 1 < construct.staticMethodConstructs.length)
				{
					js += print('', 0, 2);
				}
			}
			return js;
		}
;

		function translateNoCustomNamespaceJavaScriptStaticMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			_inStaticFunction = true;
			var js = '';
			var namespaceObj = methodConstruct.identifier.namespaceObj;
			var type = methodConstruct.identifier.type;
			upLevel();
			js += print('//' + methodConstruct.identifier.namespaceObj.name + ' static method', _indent, 1, (js) ? 1 : 0);
			if (getTranslatedTypeName(type))
			{
				js += translateJavaScriptWithReturnTypeStaticMethod(construct, methodConstruct);
			}
			else
			{
				js += translateJavaScriptWithoutReturnTypeStaticMethod(construct, methodConstruct);
			}
			downLevel();
			_inStaticFunction = false;
			return js;

			function translateJavaScriptWithReturnTypeStaticMethod($$$$construct, $$$$methodConstruct) 
			{
				//set default parameter values
				var construct = $$$$construct;
				var methodConstruct = $$$$methodConstruct;

				var js = '';
				js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function () { return $es4.$$coerce((function (', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += methodConstruct.javaScriptString;
				js += print('', 0, 1);
				js += print('}).apply(this, arguments), ' + getTranslatedTypeName(type) + ');});', _indent, 1);
				return js;
			}
;

			function translateJavaScriptWithoutReturnTypeStaticMethod($$$$construct, $$$$methodConstruct) 
			{
				//set default parameter values
				var construct = $$$$construct;
				var methodConstruct = $$$$methodConstruct;

				var js = '';
				js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function (', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += methodConstruct.javaScriptString;
				js += print('', _indent, 1);
				js += print('});', _indent, 0);
				return js;
			}
;
		}
;

		function translateCustomNamespaceJavaScriptStaticMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			return 'TODO translateCustomNamespaceJavaScriptStaticMethod';
		}
;

		function translateNoCustomNamespaceStaticMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			_inStaticFunction = true;
			var js = '';
			var namespaceObj = methodConstruct.identifier.namespaceObj;
			upLevel();
			var type = methodConstruct.identifier.type;
			js += print('//' + methodConstruct.identifier.namespaceObj.name + ' static method', _indent, 1, (js) ? 1 : 0);
			js += print(construct.identifierToken.data + '.' + methodConstruct.identifierToken.data + ' = (function (', _indent, 0);
			js += translateParameters(methodConstruct, construct);
			js += print(')', 0, 1);
			js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
			js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
			js += translateDefaultParameterValues(methodConstruct, construct);
			if (methodConstruct.UNIMPLEMENTEDToken && release)
			{
				js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
			}
			else
			{
				js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
			}
			js += print('});', _indent, 0);
			downLevel();
			_inStaticFunction = false;
			return js;
		}
;

		function translateCustomNamespaceStaticMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			return 'TODO translateCustomNamespaceStaticMethod';
		}
;

		function translateInstanceMethods($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
			{
				var methodConstruct = construct.instanceMethodConstructs[i];
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var type = methodConstruct.identifier.type;
				if (methodConstruct.isJavaScript)
				{
					if (namespaceObj.isCustom)
					{
						continue;
					}
					else
					{
						js += translateNoCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct);
					}
				}
				else
				{
					if (namespaceObj.isCustom)
					{
						continue;
					}
					else
					{
						js += translateNoCustomNamespaceInstanceMethod(construct, methodConstruct);
					}
				}
				if (i + 1 < construct.instanceMethodConstructs.length)
				{
					js += print('', 0, 2);
				}
			}
			return js;
		}
;

		function translateNamespaceInstanceMethods($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
			{
				var methodConstruct = construct.instanceMethodConstructs[i];
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var type = methodConstruct.identifier.type;
				if (!namespaceObj.isCustom)
				{
					continue;
				}
				if (methodConstruct.isJavaScript)
				{
					js += translateCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct);
				}
				else
				{
					js += translateCustomNamespaceInstanceMethod(construct, methodConstruct);
				}
				if (i + 1 < construct.instanceMethodConstructs.length)
				{
					js += print('', 0, 2);
				}
			}
			return js;
		}
;

		function translateCustomNamespaceInstanceMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			upLevel();
			upLevel();
			var js = '';
			var namespaceObj = methodConstruct.identifier.namespaceObj;
			var type = methodConstruct.identifier.type;
			js += print('//custom namespace method', _indent, 1, 1);
			var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + (namespaceObj.namespaceIsPrivate ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') : '$$this.') + namespaceObj.normalizedName;
			js += print('$es4.$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', $$this, ' + ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns') + namespaceString + ', (function (', _indent, 0);
			js += translateParameters(methodConstruct, construct);
			js += print(')', 0, 1);
			js += print('{', _indent, 1);
			js += translateDefaultParameterValues(methodConstruct, construct);
			if (methodConstruct.UNIMPLEMENTEDToken && release)
			{
				js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
			}
			else
			{
				_inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') + namespaceObj.name;
				js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
				_inNamespacedFunction = false;
			}
			js += print('})', _indent, 0);
			js += print(');', 0, 1);
			downLevel();
			downLevel();
			return js;
		}
;

		function translateNoCustomNamespaceInstanceMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			upLevel();
			upLevel();
			var js = '';
			var namespaceObj = methodConstruct.identifier.namespaceObj;
			var type = methodConstruct.identifier.type;
			js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent, 1);
			js += (methodConstruct.identifier.namespaceObj.isPrivate) ? translatePrivate() : translateOther();
			downLevel();
			downLevel();
			return js;

			function translatePrivate() 
			{
				var js = '';
				js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this.$$this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
				}
				js += print('}', _indent, 2);
				var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.$$' + methodConstruct.identifierToken.data;
				js += print('return ' + name + ' || (' + name + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);
				downLevel();
				js += print('}};', _indent, 1);
				return js;
			}
;

			function translateOther() 
			{
				var js = '';
				js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
				}
				js += print('}', _indent, 2);
				var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$' + methodConstruct.identifierToken.data;
				js += print('return ' + name + ' || (' + name + ' = ' + methodConstruct.identifierToken.data + ');', _indent, 1);
				downLevel();
				js += print('}});', _indent, 1);
				return js;
			}
;
		}
;

		function translateNoCustomNamespaceJavaScriptInstanceMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			upLevel();
			upLevel();
			var js = '';
			var namespaceObj = methodConstruct.identifier.namespaceObj;
			var type = methodConstruct.identifier.type;
			js += print('//' + methodConstruct.identifier.namespaceObj.name + ' instance method', _indent, 1);
			js += (methodConstruct.identifier.namespaceObj.isPrivate) ? translatePrivate() : translateOther();
			downLevel();
			downLevel();
			return js;

			function translatePrivate() 
			{
				var js = '';
				js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this.$$this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += methodConstruct.javaScriptString;
				js += print('', 0, 1);
				js += print('}', _indent, 2);
				var name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$p.$$' + methodConstruct.identifierToken.data;
				if (getTranslatedTypeName(type))
				{
					js += print('return ' + name + ' || (' + name + ' = function () { return $es4.$$coerce(' + methodConstruct.identifierToken.data + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); });', _indent, 1);
				}
				else
				{
					js += print('return ' + name + ' || (' + name + ' = function () { return ' + methodConstruct.identifierToken.data + '.apply($$this, arguments); });', _indent, 1);
				}
				downLevel();
				js += print('}};', _indent, 1);
				return js;
			}
;

			function translateOther() 
			{
				var js = '';
				js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent, 0);
				js += print(' get:function ()', 0, 0);
				js += print(' {', 0, 0);
				js += print(' var $$this = this; ', 0, 0);
				js += print('return $$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' || ' + '($$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.' + methodConstruct.identifierToken.data + ' = ', 0, 0);
				if (getTranslatedTypeName(type))
				{
					js += print('function () { return $es4.$$coerce(' + methodConstruct.identifierToken.data + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); }); }});', 0, 1);
				}
				else
				{
					js += print('function () { return ' + methodConstruct.identifierToken.data + '.apply($$this, arguments); }); }});', 0, 1);
				}
				js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (!methodConstruct.parameterConstructs.length) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += methodConstruct.javaScriptString;
				js += print('}', 0, 1);
				return js;
			}
;
		}
;

		function translateCustomNamespaceJavaScriptInstanceMethod($$$$construct, $$$$methodConstruct) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var methodConstruct = $$$$methodConstruct;

			return 'TODO translateCustomNamespaceJavaScriptInstanceMethod';
		}
;

		function translateStaticAccessors($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = '';

			function getMethodConstructJS($$$$methodConstruct, $$$$type) 
			{
				//set default parameter values
				var methodConstruct = $$$$methodConstruct;
				var type = $$$$type;

				if (!methodConstruct)
				{
					return 'null';
				}
				upLevel();
				var js = 'function (';
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, (methodConstruct.isJavaScript) ? 0 : 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.isNative)
				{
					throw $es4.$$primitive(new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data));
				}
				if (methodConstruct.isJavaScript)
				{
					js += methodConstruct.javaScriptString;
				}
				else if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
				}
				js += print('}', (methodConstruct.javaScriptString) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < construct.staticAccessorConstructs.length; i++)
			{
				var setterMethodConstruct = construct.staticAccessorConstructs[i].setter;
				var getterMethodConstruct = construct.staticAccessorConstructs[i].getter;
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				if (methodConstruct.identifier.namespaceObj.isCustom)
				{
					throw $es4.$$primitive(new Error('custom namespaced accessor not supported at this time'));
				}
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				js += print('Object.defineProperty(' + construct.identifierToken.data + ', \'' + methodConstruct.identifierToken.data + '\', {', _indent + 1, 0);
				var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;
				if (getterMethodConstruct)
				{
					js += 'get:';
					if (methodConstruct.isJavaScript && getTranslatedTypeName(type))
					{
						js += 'function () { return $es4.$$coerce((';
					}
					js += getMethodConstructJS(getterMethodConstruct, type);
					if (methodConstruct.isJavaScript && getTranslatedTypeName(type))
					{
						js += ')(), ' + getTranslatedTypeName(type) + ');}';
					}
					if (setterMethodConstruct)
					{
						js += ', ';
					}
				}
				if (setterMethodConstruct)
				{
					js += 'set:';
					js += getMethodConstructJS(setterMethodConstruct, type);
				}
				js += print('});', 0, 1);
			}
			_inStaticFunction = false;
			return js;
		}
;

		function translateInstanceAccessors($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = '';

			function getMethodConstructJS($$$$methodConstruct, $$$$type, $$$$isPrivate) 
			{
				//set default parameter values
				var methodConstruct = $$$$methodConstruct;
				var type = $$$$type;
				var isPrivate = $$$$isPrivate;

				if (!methodConstruct)
				{
					return 'null';
				}
				upLevel();
				var js = 'function (';
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.isNative)
				{
					throw $es4.$$primitive(new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data));
				}
				if (!isPrivate)
				{
					js += print('var $$this = this;', _indent + 1, 1);
				}
				else
				{
					js += print('var $$this = this.$$this;', _indent + 1, 1);
				}
				if (methodConstruct.isJavaScript)
				{
					js += methodConstruct.javaScriptString;
				}
				else if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
				}
				js += print('}', (methodConstruct.javaScriptString) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
			{
				var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
				var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				if (methodConstruct.identifier.namespaceObj.isCustom)
				{
					throw $es4.$$primitive(new Error('custom namespaced accessor not supported at this time'));
				}
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var isPrivate = methodConstruct.namespaceToken.data == 'private';
				var hasGet = false;
				if (isPrivate)
				{
					js += print(construct.identifierToken.data + '.prototype.$$v.' + methodConstruct.identifierToken.data + ' = {', _indent + 1, 0);
				}
				else
				{
					js += print('Object.defineProperty(' + construct.identifierToken.data + '.prototype, \'' + methodConstruct.identifierToken.data + '\', {', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;
				if (!getterMethodConstruct && methodConstruct.overrideToken)
				{
					hasGet = true;
					js += 'get:function ()';
					js += print('{', _indent + 1, 1, 1);
					js += print('var $$this = this; return $es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', \'' + methodConstruct.identifierToken.data + '\', \'get\');', _indent + 2, 0);
					js += print('}', _indent + 1, 0, 1);
				}
				else if (getterMethodConstruct)
				{
					hasGet = true;
					js += 'get:';
					if (methodConstruct.isJavaScript && getTranslatedTypeName(type))
					{
						js += 'function () { return $es4.$$coerce((';
					}
					js += getMethodConstructJS(getterMethodConstruct, type, isPrivate);
					if (methodConstruct.isJavaScript && getTranslatedTypeName(type))
					{
						js += ')(), ' + getTranslatedTypeName(type) + ');}';
					}
				}
				if (!setterMethodConstruct && methodConstruct.overrideToken)
				{
					if (hasGet)
					{
						js += ', ';
					}
					js += 'set:function ($$value)';
					js += print('{', _indent + 1, 1, 1);
					js += print('var $$this = this; $es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '\', \'' + methodConstruct.identifierToken.data + '\', \'set\', $$value);', _indent + 2, 0);
					js += print('}', _indent + 1, 0, 1);
				}
				else if (setterMethodConstruct)
				{
					if (hasGet)
					{
						js += ', ';
					}
					js += 'set:';
					js += getMethodConstructJS(setterMethodConstruct, type, isPrivate);
				}
				if (isPrivate)
				{
					js += print('};', 0, 1);
				}
				else
				{
					js += print('});', 0, 1);
				}
			}
			downLevel();
			return js;
		}
;

		function translateParameters($$$$methodConstruct, $$$$construct) 
		{
			//set default parameter values
			var methodConstruct = $$$$methodConstruct;
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
			{
				var parameterConstruct = methodConstruct.parameterConstructs[i];
				js += '$$$$' + parameterConstruct.identifierToken.data;
				if ((i + 1) < methodConstruct.parameterConstructs.length)
				{
					js += ', ';
				}
			}
			return js;
		}
;

		function translateDefaultParameterValues($$$$methodConstruct, $$$$construct) 
		{
			//set default parameter values
			var methodConstruct = $$$$methodConstruct;
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
			{
				var parameterConstruct = methodConstruct.parameterConstructs[i];
				if (!js)
				{
					js += print('//set default parameter values', _indent + 1, 1);
				}
				if (parameterConstruct.restToken || parameterConstruct.valueExpression)
				{
					if (parameterConstruct.restToken)
					{
						js += print('for (var $$i = ' + (methodConstruct.parameterConstructs.length - 1) + ', $$length = arguments.length, ' + parameterConstruct.identifierToken.data + ' = new Array($$length - ' + (methodConstruct.parameterConstructs.length - 1) + '); $$i < $$length; $$i += 1) ' + parameterConstruct.identifierToken.data + '[$$i - ' + (methodConstruct.parameterConstructs.length - 1) + '] = arguments[$$i];', _indent + 1, 1);
					}
					else if (parameterConstruct.valueExpression)
					{
						var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
						if (coerceType)
						{
							js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
						}
						else
						{
							js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
						}
					}
				}
				else
				{
					var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
					if (coerceType)
					{
						js += print('var ' + parameterConstruct.identifierToken.data + ' = $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
					}
					else
					{
						js += print('var ' + parameterConstruct.identifierToken.data + ' = $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
					}
				}
			}
			if (js)
			{
				js += print('', 0, 1);
			}
			return js;
		}
;

		function translateStatements($$$$statements, $$$$indent, $$$$construct) 
		{
			//set default parameter values
			var statements = $$$$statements;
			var indent = $$$$indent;
			var construct = $$$$construct;

			if (!indent)
			{
				indent = _indent;
			}
			else
			{
				indent--;
			}
			var js = '';
			for (var i = 0; i < statements.length; i++)
			{
				var statement = statements[i];
				if (i != 0 && statements[i - 1].constructor != Construct.FunctionExpression && statements[i].constructor == Construct.FunctionExpression)
				{
					js += '\n';
				}
				js += translateStatement(statement, indent + 1, false, construct);
				if (i + 1 < statements.length && statement.constructor == 'FunctionExpression')
				{
					js += '\n';
				}
			}
			return js;
		}
;

		function translateStatement($$$$statement, $$$$_indent, $$$$inline, $$$$construct) 
		{
			//set default parameter values
			var statement = $$$$statement;
			var _indent = $$$$_indent;
			var inline = $$$$inline;
			var construct = $$$$construct;

			if (!construct)
			{
				throw $es4.$$primitive(new Error('construct null in translate statement'));
			}
			var js = '';
			switch (statement.constructor)
			{
				case Construct.EmptyStatement:
					break;
				case Construct.IfStatement:
					_inIfStatement++;
					js += print('if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					for (var i = 0; i < statement.elseIfStatements.length; i++)
					{
						js += translateStatement(statement.elseIfStatements[i], _indent, false, construct);
					}
					if (statement.elseStatement)
					{
						js += translateStatement(statement.elseStatement, _indent, false, construct);
					}
					_inIfStatement--;
					break;
				case Construct.ElseIfStatement:
					_inIfStatement++;
					js += print('else if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case Construct.ElseStatement:
					_inIfStatement++;
					js += print('else', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case Construct.WhileStatement:
					js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.DoWhileStatement:
					js += print('do', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					break;
				case Construct.ForStatement:
					js += print('for (', _indent, 0);
					if (statement.variableStatement)
					{
						js += translateStatement(statement.variableStatement, 0, true, construct);
					}
					js += ';';
					if (statement.conditionExpression)
					{
						js += ' ' + translateExpression(statement.conditionExpression, _indent, false, construct);
					}
					js += ';';
					if (statement.afterthoughtExpression)
					{
						js += ' ' + translateExpression(statement.afterthoughtExpression, _indent, false, construct);
					}
					js += ')\n';
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.ForEachStatement:
					_count++;
					var object = translateExpression(statement.arrayExpression, _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (var ' + index + ' in ' + object + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					var valueJS = '';
					if (_dynamicPropertyAccess)
					{
						valueJS += object + '.$$nextValue(' + index + ')';
					}
					else
					{
						valueJS += object + '[' + index + ']';
					}
					var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
					if (typeString)
					{
						js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
					}
					else
					{
						js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.ForInStatement:
					_count++;
					var object = translateExpression(statement.objectExpression, _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (' + translateStatement(statement.variableStatement, 0, true, construct) + ' in ' + translateExpression(statement.objectExpression, _indent, false, construct) + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					if (_dynamicPropertyAccess)
					{
						valueJS = object + '.$$nextName(' + index + ')';
						var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
						if (typeString)
						{
							js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
						}
						else
						{
							js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
						}
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.BreakStatement:
					js += print('break', _indent, 0);
					if (statement.identifierToken)
					{
						js += ' ' + statement.identifierToken.data;
					}
					js += ';\n';
					break;
				case Construct.ContinueStatement:
					js += print('continue', _indent, 0);
					if (statement.identifierToken)
					{
						js += ' ' + statement.identifierToken.data;
					}
					js += ';\n';
					break;
				case Construct.ThrowStatement:
					js += print('throw', _indent, 0);
					if (statement.expression)
					{
						js += ' ' + translateExpression(statement.expression, _indent, false, construct);
					}
					js += ';\n';
					break;
				case Construct.TryStatement:
					js += print('try', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					if (statement.catchStatements.length == 1)
					{
						js += print('catch (' + statement.catchStatements[0].identifierToken.data + ')', _indent, 1);
					}
					else
					{
						js += print('catch ($$error)', _indent, 1);
					}
					js += print('{', _indent, 1);
					for (var i = 0; i < statement.catchStatements.length; i++)
					{
						upLevel();
						var catchStatement = statement.catchStatements[i];
						var typeName = catchStatement.identifier.type.name;
						if (i == 0 && statement.catchStatements.length == 1)
						{
							if (typeName == 'void' || typeName == 'Error')
							{
								js += translateStatements(catchStatement.bodyStatements, _indent + 1, construct);
							}
							else
							{
								js += print('if ($es4.$$is(' + catchStatement.identifierToken.data + ', ' + typeName + '))', _indent + 1, 1);
								js += print('{', _indent + 1, 1);
								js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
								js += print('}', _indent + 1, 1);
							}
							downLevel();
							break;
						}
						if (typeName == 'void' || typeName == 'Error')
						{
							js += print('else', _indent + 1, 1);
							js += print('{', _indent + 1, 1);
							js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
							js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
							js += print('}', _indent + 1, 1);
							downLevel();
							break;
						}
						js += print(((i == 0) ? 'if' : 'else if') + ' ($es4.$$is($$error, ' + typeName + '))', _indent + 1, 1);
						js += print('{', _indent + 1, 1);
						js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
						js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
						js += print('}', _indent + 1, 1);
						downLevel();
					}
					js += print('}', _indent, 1);
					if (statement.finallyStatement)
					{
						js += print('finally', _indent, 1);
						js += print('{', _indent, 1);
						js += translateStatements(statement.finallyStatement.bodyStatements, _indent + 1, construct);
						js += print('}', _indent, 1);
					}
					break;
				case Construct.UseStatement:
					break;
				case Construct.VarStatement:
					var translateVarValueExpression = function ($$$$statement) 
					{
				//set default parameter values
				var statement = $$$$statement;

						var valueJS = translateExpression(statement.valueExpression, _indent, false, construct);
						var typeString = getTranslatedTypeName(statement.identifier.type);
						if (isCoerceRequired(statement, typeString, valueJS))
						{
							valueJS = '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
						}
						return ' = ' + valueJS;
					}
;
					js += print('var ' + statement.identifierToken.data, _indent, 0);
					if (statement.valueExpression)
					{
						js += translateVarValueExpression(statement);
					}
					for (var i = 0; i < statement.innerVarStatements.length; i++)
					{
						var innerVarStatement = statement.innerVarStatements[i];
						js += ', ' + innerVarStatement.identifierToken.data;
						if (innerVarStatement.valueExpression)
						{
							js += translateVarValueExpression(innerVarStatement);
						}
					}
					if (!inline)
					{
						js += ';\n';
					}
					break;
				case Construct.SwitchStatement:
					js += print('switch (' + translateExpression(statement.valueExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					for (var i = 0; i < statement.caseStatements.length; i++)
					{
						js += translateStatement(statement.caseStatements[i], _indent + 1, false, construct);
					}
					js += print('}', _indent, 1);
					break;
				case Construct.CaseStatement:
					if (statement.defaultToken)
					{
						js += print('default:', _indent, 1);
					}
					else
					{
						js += print('case ' + translateExpression(statement.valueExpression, _indent, false, construct) + ':', _indent, 1);
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					break;
				case Construct.LabelStatement:
					js += print(statement.identifierToken.data + ':', _indent, 0);
					break;
				default:
					if (inline)
					{
						js += print(translateExpression(statement, _indent, false, construct), _indent, 0);
					}
					else
					{
						js += print(translateExpression(statement, _indent, false, construct) + ';', _indent, 1);
					}
			}
			return js;
		}
;

		function translateExpression($$$$expression, $$$$_indent, $$$$toString, $$$$construct, $$$$operator, $$$$expressionString) 
		{
			//set default parameter values
			var expression = $$$$expression;
			var _indent = $$$$_indent;
			var toString = $$$$toString;
			var construct = $$$$construct;
			var operator = (4 > arguments.length - 1) ? null : $$$$operator;
			var expressionString = (5 > arguments.length - 1) ? null : $$$$expressionString;

			if (!construct)
			{
				throw $es4.$$primitive(new Error('construct null in translate expression'));
			}
			if (!_indent)
			{
				_indent = 0;
			}
			var js = '';
			outerSwitch:			switch (expression.constructor)
			{
				case Construct.ParenExpression:
					js += '(' + translateExpression(expression.expression, _indent, toString, construct, operator, expressionString) + ')';
					break;
				case Construct.PropertyExpression:
					js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
					break;
				case Construct.NumberExpression:
					js += expression.numberToken.data;
					break;
				case Construct.StringExpression:
					if (toString && expression.stringToken.data == "'")
					{
						js += '\\' + expression.stringToken.data;
					}
					else
					{
						js += expression.stringToken.data;
					}
					for (var i = 0; i < expression.stringChunkTokens.length; i++)
					{
						js += expression.stringChunkTokens[i].data;
						if (i + 1 < expression.stringChunkTokens.length)
						{
							js += '\n';
						}
					}
					if (toString && expression.stringToken.data == "'")
					{
						js += '\\' + expression.stringToken.data;
					}
					else
					{
						js += expression.stringToken.data;
					}
					break;
				case Construct.ReturnExpression:
					js += 'return';
					if (expression.expression)
					{
						var typeName = getTranslatedTypeName(expression.expectedType);
						var valueJS = translateExpression(expression.expression, 0, toString, construct);
						if (typeName && isCoerceRequired(expression, typeName, valueJS))
						{
							js += ' $es4.$$coerce(' + valueJS + ', ' + typeName + ')';
						}
						else
						{
							js += ' ' + valueJS;
						}
					}
					break;
				case Construct.DeleteExpression:
					js += translatePropertyExpressionDynamic(expression.expression, toString, undefined, undefined, construct, true);
					break;
				case Construct.FunctionExpression:
					upLevel();
					var wasInClosure = _inClosure;
					_inClosure = true;
					if (!expression.identifierToken)
					{
						js += print('function (', 0, 0);
					}
					else
					{
						if (_inIfStatement)
						{
							throw $es4.$$primitive(new Error('support for named closures in if/elseif/else statements is not supported at this time.'));
						}
						js += print('function ' + expression.identifierToken.data + '(', 0, 0);
					}
					js += translateParameters(expression, construct);
					js += print(') ', 0, 1);
					js += print('{', _indent, 1);
					js += translateDefaultParameterValues(expression, construct);
					js += translateStatements(expression.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					if (!wasInClosure)
					{
						_inClosure = false;
					}
					downLevel();
					break;
				case Construct.ObjectExpression:
					js += '{';
					for (var i = 0; i < expression.objectPropertyConstructs.length; i++)
					{
						var prop;
						if (expression.objectPropertyConstructs[i].expression.constructor == Construct.PropertyExpression)
						{
							prop = expression.objectPropertyConstructs[i].expression.construct.identifierToken.data;
						}
						else
						{
							prop = translateExpression(expression.objectPropertyConstructs[i].expression, 0, toString, construct);
						}
						js += prop + ':' + translateExpression(expression.objectPropertyConstructs[i].valueExpression, 0, toString, construct);
						if ((i + 1) < expression.objectPropertyConstructs.length)
						{
							js += ', ';
						}
					}
					js += '}';
					break;
				case Construct.ArrayExpression:
					js += '[';
					for (var i = 0; i < expression.valueExpressions.length; i++)
					{
						if (!expression.valueExpressions[i])
						{
							trace('invalid 20');
						}
						js += translateExpression(expression.valueExpressions[i], 0, toString, construct);
						if ((i + 1) < expression.valueExpressions.length)
						{
							js += ', ';
						}
					}
					js += ']';
					break;
				case Construct.BooleanExpression:
					js += expression.booleanToken.data;
					break;
				case Construct.Expression:
					if (expression.token.type == Token.TypeofTokenType)
					{
						if (!expression.expression)
						{
							trace('invalid 21');
						}
						js += '$es4.$$typeof(' + translateExpression(expression.expression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.VoidTokenType)
					{
						if (expression.expression.constructor == Construct.EmptyExpression)
						{
							js += 'void 0';
						}
						else
						{
							if (!expression.expression)
							{
								trace('invalid 01');
							}
							js += 'void ' + translateExpression(expression.expression, 0, toString, construct);
						}
						break;
					}
					js += expression.token.data;
					if (expression.expression)
					{
						if (!expression.expression)
						{
							trace('invalid 22');
						}
						js += translateExpression(expression.expression, 0, toString, construct);
					}
					break;
				case Construct.XMLExpression:
					js += 'new XML(\'' + expression.string + '\')';
					break;
				case Construct.XMLListExpression:
					js += 'new XMLList(\'' + expression.string + '\')';
					break;
				case Construct.EmptyExpression:
					break;
				case Construct.RegExpression:
					js += expression.string;
					break;
				case Construct.PrefixExpression:
					js += translatePropertyExpressionDynamic(expression.expression, toString, '\'prefix\'', (expression.decrementToken) ? '--' : '++', construct);
					break;
				case Construct.PostfixExpression:
					js += translatePropertyExpressionDynamic(expression.expression, toString, '\'postfix\'', (expression.decrementToken) ? '--' : '++', construct);
					break;
				case Construct.NewExpression:
					if (expression.expression.constructor == Construct.ParenExpression)
					{
						if (!expression.expression)
						{
							trace('invalid 02');
						}
						js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
					}
					else
					{
						js += translatePropertyExpressionDynamic(expression.expression, toString, null, null, construct, null, true);
					}
					break;
				case Construct.BinaryExpression:
					if (expression.token.type == Token.IsTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 04');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 05');
						}
						js += '$es4.$$is(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.InstanceofTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 06');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 07');
						}
						js += '$es4.$$instanceof(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.AsTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 08');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 09');
						}
						js += '$es4.$$as(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					innerSwitch:					switch (expression.token.type)
					{
						case Token.BitwiseLeftShiftAssignmentTokenType:
						case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
						case Token.BitwiseRightShiftAssignmentTokenType:
						case Token.AddWithAssignmentTokenType:
						case Token.DivWithAssignmentTokenType:
						case Token.ModWithAssignmentTokenType:
						case Token.MulWithAssignmentTokenType:
						case Token.SubWithAssignmentTokenType:
						case Token.AssignmentTokenType:
						case Token.AndWithAssignmentTokenType:
						case Token.OrWithAssignmentTokenType:
						case Token.BitwiseAndAssignmentTokenType:
						case Token.BitwiseOrAssignmentTokenType:
						case Token.BitwiseXorAssignmentTokenType:
							var leftExpression = expression.leftExpression;
							while (leftExpression.constructor == Construct.ParenExpression)
							{
								leftExpression = leftExpression.expression;
							}
							var innerOperator = expression.token.data;
							var innerExpressionString = '';
							while (leftExpression.constructor == Construct.BinaryExpression)
							{
								expression.leftExpression = leftExpression.rightExpression;
								if (!innerExpressionString)
								{
									if (!expression)
									{
										trace('invalid 10');
									}
									innerExpressionString = translateExpression(expression, _indent, toString, construct);
								}
								else
								{
									if (!expression.leftExpression)
									{
										trace('invalid 11');
									}
									if (_dynamicPropertyAccess)
									{
										innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct, innerOperator, innerExpressionString);
									}
									else
									{
										innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct) + ' ' + innerOperator + ' ' + innerExpressionString;
									}
								}
								expression = leftExpression;
								innerOperator = expression.token.data;
								leftExpression = expression.leftExpression;
							}
							var typeString;
							if (!leftExpression.nextPropertyExpression && leftExpression.construct && leftExpression.construct.constructor == Construct.IdentifierConstruct)
							{
								var identifier = leftExpression.construct.identifier;
								typeString = (identifier.isVar && identifier.type) ? getTranslatedTypeName(identifier.type) : '';
							}
							if (true)
							{
								if (!innerExpressionString)
								{
									if (!expression.rightExpression)
									{
										trace('invalid 12');
									}
									innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
								}
								if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
								{
									js += translatePropertyExpressionDynamic(leftExpression, toString, '$es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')', innerOperator, construct);
								}
								else
								{
									js += translatePropertyExpressionDynamic(leftExpression, toString, innerExpressionString, innerOperator, construct);
								}
							}
							else
							{
								if (!expression.leftExpression)
								{
									trace('invalid 13');
								}
								js += translateExpression(leftExpression, 0, toString, construct);
								if (!innerExpressionString)
								{
									if (!expression.rightExpression)
									{
										trace('invalid 14');
									}
									innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
								}
								if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
								{
									js += ' ' + innerOperator + ' $es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')';
								}
								else
								{
									js += ' ' + innerOperator + ' ' + innerExpressionString;
								}
							}
							break outerSwitch;
					}
					if (!expression.leftExpression)
					{
						trace('invalid 15');
					}
					if (!expression.rightExpression)
					{
						trace('invalid 16');
					}
					js += translateExpression(expression.leftExpression, 0, toString, construct) + ' ' + expression.token.data + ' ' + translateExpression(expression.rightExpression, 0, toString, construct);
					break;
				case Construct.TernaryExpression:
					if (!expression.trueExpression)
					{
						trace('invalid 34');
					}
					if (!expression.conditionExpression)
					{
						trace('invalid 35');
					}
					if (!expression.falseExpression)
					{
						trace('invalid 36');
					}
					js += translateExpression(expression.conditionExpression, 0, toString, construct) + ' ? ' + translateExpression(expression.trueExpression, 0, toString, construct) + ' : ' + translateExpression(expression.falseExpression, 0, toString, construct);
					break;
				default:
					throw $es4.$$primitive(new Error('Unexpected expression found: ' + expression.constructor));
			}
			return js;
		}
;

		function translatePropertyExpressionDynamic($$$$expression, $$$$toString, $$$$setString, $$$$operator, $$$$construct, $$$$doDelete, $$$$doNew) 
		{
			//set default parameter values
			var expression = $$$$expression;
			var toString = $$$$toString;
			var setString = $$$$setString;
			var operator = $$$$operator;
			var construct = $$$$construct;
			var doDelete = (5 > arguments.length - 1) ? null : $$$$doDelete;
			var doNew = (6 > arguments.length - 1) ? null : $$$$doNew;

			var js = '';
			if (!expression.construct)
			{
				throw $es4.$$primitive(new Error('invalid expression passed to translatePropertyExpression: ' + expression.constructor));
			}
			var identifier;
			var namespaceIdentifier;
			switch (expression.construct.constructor)
			{
				case Construct.SuperConstruct:
				case Construct.ThisConstruct:
				case Construct.IdentifierConstruct:
					identifier = expression.construct.identifier;
					break;
				case Construct.ParenConstruct:
				case Construct.ArrayConstruct:
				case Construct.ObjectConstruct:
					break;
				case Construct.NamespaceQualifierConstruct:
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					identifier = expression.construct.identifier;
					break;
				default:
					throw $es4.$$primitive(new Error('unknown inner property expression: ' + expression.construct.constructor));
			}
			var pname;
			var name;
			if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom)
			{
				namespaceIdentifier = identifier.namespaceObj.identifier;
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = (namespaceIdentifier.isStatic) ? namespaceIdentifier.scope.name : '$$this';
				var namespaceObj = namespaceIdentifier.namespaceObj;
				var namespaceString = namespaceObj.normalizedImportID;
				if (namespaceIdentifier.isStatic && !namespaceString)
				{
					namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
				}
				else if (!namespaceString)
				{
					namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') : '$$this.') + namespaceIdentifier.name;
				}
				pname += '.$$namespace(' + namespaceString + ')';
				name = identifier.name;
			}
			else if (identifier)
			{
				name = identifier.name;
				if (identifier.isStatic && !identifier.isImport && !identifier.isNative)
				{
					pname = identifier.scope.name;
				}
				else if (identifier.isPrivate && !identifier.isImport)
				{
					pname = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('');
				}
				else if ((identifier.isProperty || identifier.isMethod) && !identifier.isImport)
				{
					pname = '$$this';
				}
				else if (identifier.isPackage)
				{
					name = '$es4.$$[\'' + identifier.name;
					var packageName = identifier.name;
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = tempInnerExpression.nextPropertyExpression)
					{
						if (_rootConstructs[packageName + '.' + tempInnerExpression.construct.identifierToken.data])
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + tempInnerExpression.construct.identifierToken.data;
						name += '.' + tempInnerExpression.construct.identifierToken.data;
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				var superString = (construct.extendsNameConstruct) ? '$es4.$$super2($$this, ' + getTranslatedTypeName(construct.extendsNameConstruct.type) + ', \'$$' + construct.extendsNameConstruct.type.name + '\', ***REPLACE1***, \'***REPLACE2***\', ***REPLACE3***)' : '____________________';
				if (name == 'super')
				{
					if (_inNamespacedFunction && expression.nextPropertyExpression)
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = (expression.nextPropertyExpression) ? superString : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					if (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.DotConstruct && expression.nextPropertyExpression.construct.identifier.isPrivate)
					{
						name = '$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('');
					}
					else
					{
						name = '$$this';
					}
				}
			}
			else
			{
				if (!expression.construct.expression)
				{
					trace('invalid 37');
				}
				name = translateExpression(expression.construct.expression, 0, toString, construct);
			}
			js += (!pname) ? name : (pname + '.' + name);
			var state = {doAssignment:setString != null, doDelete:doDelete, doNew:doNew, doPostfix:setString == '\'postfix\'', doPrefix:setString == '\'prefix\''};
			var doSuper = name == superString;
			var doSuperConstructor = doSuper && (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct);
			var superExpression;
			while (expression = expression.nextPropertyExpression)
			{
				if (expression.construct.constructor == Construct.DotConstruct || expression.construct.constructor == Construct.IdentifierConstruct)
				{
					if (doSuper && !superExpression)
					{
						superExpression = '\'' + expression.construct.identifierToken.data + '\'';
					}
					else
					{
						if (expression.construct.constructor == Construct.DotConstruct)
						{
							js += '.';
						}
						js += expression.construct.identifierToken.data;
					}
				}
				else if (expression.construct.constructor == Construct.ArrayAccessorConstruct)
				{
					if (!expression.construct.expression)
					{
						trace('invalid 38');
					}
					if (doSuper && !superExpression)
					{
						superExpression = translateExpression(expression.construct.expression, 0, toString, construct);
					}
					else
					{
						js += '[' + translateExpression(expression.construct.expression, 0, toString, construct) + ']';
					}
				}
				else if (expression.construct.constructor == Construct.NamespaceQualifierConstruct)
				{
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					var namespaceObj = namespaceIdentifier.namespaceObj;
					var namespaceString = namespaceObj.normalizedImportID;
					if (namespaceIdentifier.isStatic && !namespaceString)
					{
						namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
					}
					else if (!namespaceString)
					{
						namespaceString = (identifier.isPrivate) ? ('$$this.$$' + ((construct.packageName && _extendsNameConflict ? construct.packageName : '') + construct.identifierToken.data).split('.').join('') + '.$$ns.') + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;
					}
					js += '.$$namespace(' + namespaceString + ').' + expression.construct.namespaceIdentifierToken.data;
				}
				else if (expression.construct.constructor == Construct.ParenConstruct)
				{
					if (!expression.construct.expression)
					{
						trace('invalid 39');
					}
					js += '(' + translateExpression(expression.construct.expression, 0, toString, construct) + ')';
				}
				else if (expression.construct.constructor == Construct.AtIdentifierConstruct)
				{
					throw $es4.$$primitive(new Error('E4X is not supported'));
				}
				if (expression.construct.constructor == Construct.FunctionCallConstruct || (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
				{
					var functionCallExpression = (expression.construct.constructor == Construct.FunctionCallConstruct) ? expression : expression.nextPropertyExpression;
					if (doSuperConstructor)
					{
						js = getTranslatedTypeName(construct.extendsNameConstruct.type) + '.$$constructor.call($$this';
						if (functionCallExpression.construct.argumentExpressions.length)
						{
							js += ', ';
						}
						doSuperConstructor = false;
					}
					else
					{
						js += '(';
					}
					for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
					{
						if (!functionCallExpression.construct.argumentExpressions[i])
						{
							trace('invalid 40');
						}
						js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
						if ((i + 1) < functionCallExpression.construct.argumentExpressions.length)
						{
							js += ', ';
						}
					}
					js += ')';
					if (expression.nextPropertyExpression)
					{
						expression = functionCallExpression;
					}
					continue;
				}
			}
			if (doSuper && superExpression)
			{
				js = js.split('***REPLACE1***').join(superExpression);
				if (setString)
				{
					js = js.split('***REPLACE2***').join('set');
					js = js.split('***REPLACE3***').join(setString);
					state.doAssignment = false;
				}
				else
				{
					js = js.split('***REPLACE2***').join('func');
					js = js.split('***REPLACE3***').join('undefined');
				}
			}
			if (!state.doPostfix && !state.doPrefix)
			{
				if (state.doAssignment && operator == '||=' || operator == '&&=')
				{
					js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
				}
				else if (state.doAssignment)
				{
					js += ' ' + operator + ' ' + setString;
				}
			}
			else if (state.doPrefix)
			{
				js = operator + js;
			}
			else if (state.doPostfix)
			{
				js += operator;
			}
			if (state.doDelete)
			{
				js = 'delete ' + js;
			}
			if (state.doNew)
			{
				js = '$es4.$$primitive(new ' + js + ')';
			}
			return js;
		}
;

		function isCoerceRequired($$$$statementOrExpression, $$$$typeName, $$$$valueJS) 
		{
			//set default parameter values
			var statementOrExpression = $$$$statementOrExpression;
			var typeName = $$$$typeName;
			var valueJS = $$$$valueJS;

			if (!statementOrExpression.coerce)
			{
				return false;
			}
			switch (typeName)
			{
				case 'uint':
					if (Number(valueJS) == (valueJS >>> 0))
					{
						return false;
					}
					break;
				case 'int':
					if (Number(valueJS) == (valueJS >> 0))
					{
						return false;
					}
					break;
			}
			return true;
		}
;

		function print($$$$string, $$$$tabs, $$$$newlines, $$$$preNewLines) 
		{
			//set default parameter values
			var string = $$$$string;
			var tabs = $$$$tabs;
			var newlines = $$$$newlines;
			var preNewLines = (3 > arguments.length - 1) ? null : $$$$preNewLines;

			if (tabs)
			{
				for (var i = 0; i < tabs; i++)
				{
					string = '\t' + string;
				}
			}
			if (newlines)
			{
				for (var i = 0; i < newlines; i++)
				{
					string += '\n';
				}
			}
			if (preNewLines)
			{
				for (var i = 0; i < preNewLines; i++)
				{
					string = '\n' + string;
				}
			}
			return string;
		}
;
	});
	function TranslatorPrototype()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof TranslatorPrototype) || $$this.$$TranslatorPrototype !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TranslatorPrototype) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			TranslatorPrototype.$$construct($$this, $$args);
		}
	}

	//construct
	TranslatorPrototype.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (TranslatorPrototype.$$cinit !== undefined) TranslatorPrototype.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$TranslatorPrototype', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		TranslatorPrototype.$$iinit($$this);

		//call constructor
		if (args !== undefined) TranslatorPrototype.$$constructor.apply($$this, args);
	});

	//initializer
	TranslatorPrototype.$$iinit = (function ($$this)
	{
	});

	//constructor
	TranslatorPrototype.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(TranslatorPrototype, null, 'sweetrush.core::TranslatorPrototype');
})();
//sweetrush.core.TranslatorPrototype


//sweetrush.utils.Base64Util
$es4.$$package('sweetrush.utils').Base64Util = (function ()
{
	//imports
	var ByteArray;

	//class pre initializer
	Base64Util.$$sinit = (function ()
	{
		Base64Util.$$sinit = undefined;

		//initialize imports
		ByteArray = $es4.$$['flash.utils'].ByteArray;

		//set prototype and constructor
		Base64Util.prototype = Object.create(Object.prototype);
		Object.defineProperty(Base64Util.prototype, "constructor", { value: Base64Util, enumerable: false });

		//hold private values
		Object.defineProperty(Base64Util.prototype, '$$v', {value:{}});
	});

	//class initializer
	Base64Util.$$cinit = (function ()
	{
		Base64Util.$$cinit = undefined;
	});

	//public static method
	Base64Util.encodeString = (function ($$$$value)
	{
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//set default parameter values
		var value = $es4.$$coerce($$$$value, String);

		if (false)
		{
		}
		if (true)
		{
			if (global.btoa !== undefined)
			{
				return $es4.$$coerce(global.btoa(value), String);
			}
			return $es4.$$coerce(global.Buffer.from(value).toString('base64'), String);
		}
	});

	//public static method
	Base64Util.decodeString = (function ($$$$str)
	{
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//set default parameter values
		var str = $es4.$$coerce($$$$str, String);

		if (false)
		{
		}
		if (true)
		{
			if (global.atob !== undefined)
			{
				return $es4.$$coerce(global.atob(str), String);
			}
			return $es4.$$coerce(global.Buffer.from(str, 'base64').toString(), String);
		}
	});
	function Base64Util()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Base64Util) || $$this.$$Base64Util !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Base64Util) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Base64Util.$$construct($$this, $$args);
		}
	}

	//construct
	Base64Util.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Base64Util', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Base64Util.$$iinit($$this);

		//call constructor
		if (args !== undefined) Base64Util.$$constructor.apply($$this, args);
	});

	//initializer
	Base64Util.$$iinit = (function ($$this)
	{
	});

	//constructor
	Base64Util.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Base64Util, null, 'sweetrush.utils::Base64Util');
})();
//sweetrush.utils.Base64Util


//sweetrush.obj.Construct
$es4.$$package('sweetrush.obj').Construct = (function ()
{
	//properties
	var $$j = {};
	Construct.Expression = 'Expression';
	Construct.EmptyExpression = 'EmptyExpression';
	Construct.BinaryExpression = 'BinaryExpression';
	Construct.ObjectExpression = 'ObjectExpression';
	Construct.ArrayExpression = 'ArrayExpression';
	Construct.NewExpression = 'NewExpression';
	Construct.PropertyExpression = 'PropertyExpression';
	Construct.IdentifierConstruct = 'IdentifierConstruct';
	Construct.NamespaceQualifierConstruct = 'NamespaceQualifierConstruct';
	Construct.AtIdentifierConstruct = 'AtIdentifierConstruct';
	Construct.DotConstruct = 'DotConstruct';
	Construct.SuperConstruct = 'SuperConstruct';
	Construct.ThisConstruct = 'ThisConstruct';
	Construct.E4XSearchConstruct = 'E4XSearchConstruct';
	Construct.ArrayAccessorConstruct = 'ArrayAccessorConstruct';
	Construct.VectorConstruct = 'VectorConstruct';
	Construct.TypeConstruct = 'TypeConstruct';
	Construct.ParenConstruct = 'ParenConstruct';
	Construct.ObjectConstruct = 'ObjectConstruct';
	Construct.ArrayConstruct = 'ArrayConstruct';
	Construct.TernaryExpression = 'TernaryExpression';
	Construct.RegExpression = 'RegExpression';
	Construct.ParenExpression = 'ParenExpression';
	Construct.BooleanExpression = 'BooleanExpression';
	Construct.NumberExpression = 'NumberExpression';
	Construct.PrefixExpression = 'PrefixExpression';
	Construct.PostfixExpression = 'PostfixExpression';
	Construct.StringExpression = 'StringExpression';
	Construct.FunctionExpression = 'FunctionExpression';
	Construct.FunctionCallConstruct = 'FunctionCallConstruct';
	Construct.RootConstruct = 'RootConstruct';
	Construct.PackageConstruct = 'PackageConstruct';
	Construct.ClassConstruct = 'ClassConstruct';
	Construct.InterfaceConstruct = 'InterfaceConstruct';
	Construct.NameConstruct = 'NameConstruct';
	Construct.ImportConstruct = 'ImportConstruct';
	Construct.UseConstruct = 'UseConstruct';
	Construct.UseStatement = 'UseStatement';
	Construct.ForEachStatement = 'ForEachStatement';
	Construct.ReturnExpression = 'ReturnExpression';
	Construct.DeleteExpression = 'DeleteExpression';
	Construct.XMLExpression = 'XMLExpression';
	Construct.XMLListExpression = 'XMLListExpression';
	Construct.ForStatement = 'ForStatement';
	Construct.ForInStatement = 'ForInStatement';
	Construct.LabelStatement = 'LabelStatement';
	Construct.WhileStatement = 'WhileStatement';
	Construct.DoWhileStatement = 'DoWhileStatement';
	Construct.IfStatement = 'IfStatement';
	Construct.ElseIfStatement = 'ElseIfStatement';
	Construct.ElseStatement = 'ElseStatement';
	Construct.EmptyStatement = 'EmptyStatement';
	Construct.TryStatement = 'TryStatement';
	Construct.CatchStatement = 'CatchStatement';
	Construct.FinallyStatement = 'FinallyStatement';
	Construct.BreakStatement = 'BreakStatement';
	Construct.ContinueStatement = 'ContinueStatement';
	Construct.ThrowStatement = 'ThrowStatement';
	Construct.SwitchStatement = 'SwitchStatement';
	Construct.CaseStatement = 'CaseStatement';
	Construct.VarStatement = 'VarStatement';
	Construct.MethodConstruct = 'MethodConstruct';
	Construct.ObjectPropertyConstruct = 'ObjectPropertyConstruct';
	Construct.ParameterConstruct = 'ParameterConstruct';
	Construct.PropertyConstruct = 'PropertyConstruct';
	Construct.MetaDataConstruct = 'MetaDataConstruct';

	//class pre initializer
	Construct.$$sinit = (function ()
	{
		Construct.$$sinit = undefined;

		//set prototype and constructor
		Construct.prototype = Object.create(Object.prototype);
		Object.defineProperty(Construct.prototype, "constructor", { value: Construct, enumerable: false });

		//hold private values
		Object.defineProperty(Construct.prototype, '$$v', {value:{}});
	});

	//class initializer
	Construct.$$cinit = (function ()
	{
		Construct.$$cinit = undefined;
	});

	//public static method
	Construct.getNewExpression = (function ($$$$token, $$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var token = $$$$token;
		var expression = (1 > arguments.length - 1) ? null : $$$$expression;

		return {constructor:Construct.Expression, token:token, expression:expression};
	});

	//public static method
	Construct.getNewEmptyExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.EmptyExpression};
	});

	//public static method
	Construct.getNewBinaryExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.BinaryExpression, token:null, leftExpression:null, rightExpression:null};
	});

	//public static method
	Construct.getNewObjectExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ObjectExpression, objectPropertyConstructs:[]};
	});

	//public static method
	Construct.getNewArrayExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ArrayExpression, valueExpressions:[]};
	});

	//public static method
	Construct.getNewNewExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.NewExpression, expression:null};
	});

	//public static method
	Construct.getNewPropertyExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.PropertyExpression, construct:null, nextPropertyExpression:null, root:false};
	});

	//public static method
	Construct.getNewIdentifierConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.IdentifierConstruct, identifierToken:null, identifer:null};
	});

	//public static method
	Construct.getNewNamespaceQualifierConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.NamespaceQualifierConstruct, namespaceQualifierToken:null, identifierToken:null, namespaceIdentifierToken:null, namespaceIdentifier:null, identifer:null};
	});

	//public static method
	Construct.getNewAtIdentifierConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.AtIdentifierConstruct};
	});

	//public static method
	Construct.getNewDotConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.DotConstruct, identifierToken:null};
	});

	//public static method
	Construct.getNewSuperConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.SuperConstruct, superToken:null, identifer:null};
	});

	//public static method
	Construct.getNewThisConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ThisConstruct, thisToken:null, identifer:null};
	});

	//public static method
	Construct.getNewE4XSearchConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.E4XSearchConstruct, expression:null};
	});

	//public static method
	Construct.getNewArrayAccessorConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ArrayAccessorConstruct, expression:null};
	});

	//public static method
	Construct.getNewVectorConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.VectorConstruct, nameConstruct:null};
	});

	//public static method
	Construct.getNewTypeConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.TypeConstruct, mulToken:null, voidToken:null, nameConstruct:null, vectorNameConstruct:null, identifer:null};
	});

	//public static method
	Construct.getNewParenConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ParenConstruct, expression:null};
	});

	//public static method
	Construct.getNewObjectConstruct = (function ($$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var expression = $$$$expression;

		return {constructor:Construct.ObjectConstruct, expression:expression};
	});

	//public static method
	Construct.getNewArrayConstruct = (function ($$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var expression = $$$$expression;

		return {constructor:Construct.ArrayConstruct, expression:expression};
	});

	//public static method
	Construct.getNewTernaryExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.TernaryExpression, conditionExpression:null, trueExpression:null, falseExpression:null};
	});

	//public static method
	Construct.getNewRegExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.RegExpression, string:null};
	});

	//public static method
	Construct.getNewParenExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ParenExpression, expression:null};
	});

	//public static method
	Construct.getNewBooleanExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.BooleanExpression, booleanToken:null};
	});

	//public static method
	Construct.getNewNumberExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.NumberExpression, numberToken:null};
	});

	//public static method
	Construct.getNewPrefixExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.PrefixExpression, incrementToken:null, decrementToken:null, expression:null};
	});

	//public static method
	Construct.getNewPostfixExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.PostfixExpression, incrementToken:null, decrementToken:null, expression:null};
	});

	//public static method
	Construct.getNewStringExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.StringExpression, stringToken:null, stringChunkTokens:[], stringEndToken:null};
	});

	//public static method
	Construct.getNewFunctionExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.FunctionExpression, identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], namedFunctionExpressions:[], identifer:null, type:null};
	});

	//public static method
	Construct.getNewFunctionCallConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.FunctionCallConstruct, argumentExpressions:[]};
	});

	//public static method
	Construct.getNewRootConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.RootConstruct, classConstructs:[], interfaceConstructs:[], methodConstructs:[], propertyConstructs:[], importConstructs:[], packageConstruct:null, namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[]};
	});

	//public static method
	Construct.getNewPackageConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.PackageConstruct, nameConstruct:null, classConstruct:null, importConstructs:[], interfaceConstruct:null, methodConstruct:null, propertyConstruct:null, rootConstruct:null, useConstructs:[]};
	});

	//public static method
	Construct.getNewClassConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ClassConstruct, identifierToken:null, extendsNameConstruct:null, importConstructs:[], initializerStatements:[], implementsNameConstructs:[], metaDataConstructs:[], constructorMethodConstruct:null, propertyConstructs:[], methodConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null, dynamicToken:null, useConstructs:[], UNIMPLEMENTEDToken:null, namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[], packageName:null, identifer:null, type:null};
	});

	//public static method
	Construct.getNewInterfaceConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.InterfaceConstruct, identifierToken:null, extendsNameConstructs:[], methodConstructs:[], propertyConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null, packageName:null, identifer:null, type:null};
	});

	//public static method
	Construct.getNewNameConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.NameConstruct, identifierTokens:[]};
	});

	//public static method
	Construct.nameConstructToString = (function ($$$$nameConstruct)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var nameConstruct = $$$$nameConstruct;

		if (nameConstruct.identifierTokens.length == 1)
		{
			return nameConstruct.identifierTokens[0].data;
		}
		var data = [];
		for (var i = 0; i < nameConstruct.identifierTokens.length; i++)
		{
			data.push(nameConstruct.identifierTokens[i].data);
		}
		return data.join('.');
	});

	//public static method
	Construct.getNewImportConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ImportConstruct, nameConstruct:null, mulToken:null};
	});

	//public static method
	Construct.getNewUseConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.UseConstruct, useToken:null, namespaceIdentifierToken:null};
	});

	//public static method
	Construct.getNewUseStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.UseStatement, useToken:null, namespaceIdentifierToken:null};
	});

	//public static method
	Construct.getNewForEachStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ForEachStatement, variableStatement:null, arrayExpression:null, bodyStatements:[], index:null};
	});

	//public static method
	Construct.getNewReturnExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ReturnExpression, expression:null, type:null, expectedType:null};
	});

	//public static method
	Construct.getNewDeleteExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.DeleteExpression, expression:null};
	});

	//public static method
	Construct.getNewXMLExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.XMLExpression, string:null};
	});

	//public static method
	Construct.getNewXMLListExpression = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.XMLListExpression, string:null};
	});

	//public static method
	Construct.getNewForStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ForStatement, variableStatement:null, conditionExpression:null, afterthoughtExpression:null, bodyStatements:[]};
	});

	//public static method
	Construct.getNewForInStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ForInStatement, variableStatement:null, objectExpression:null, bodyStatements:[], index:null};
	});

	//public static method
	Construct.getNewLabelStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.LabelStatement, identifierToken:null, identifer:null};
	});

	//public static method
	Construct.getNewWhileStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.WhileStatement, conditionExpression:null, bodyStatements:[]};
	});

	//public static method
	Construct.getNewDoWhileStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.DoWhileStatement, conditionExpression:null, bodyStatements:[]};
	});

	//public static method
	Construct.getNewIfStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.IfStatement, conditionExpression:null, bodyStatements:[], elseIfStatements:[], elseStatement:null};
	});

	//public static method
	Construct.getNewElseIfStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ElseIfStatement, conditionExpression:null, bodyStatements:[]};
	});

	//public static method
	Construct.getNewElseStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ElseStatement, bodyStatements:[]};
	});

	//public static method
	Construct.getNewEmptyStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.EmptyStatement, bodyStatements:[]};
	});

	//public static method
	Construct.getNewTryStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.TryStatement, bodyStatements:[], catchStatements:[], finallyStatement:null};
	});

	//public static method
	Construct.getNewCatchStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.CatchStatement, identifierToken:null, typeConstruct:null, bodyStatements:[], index:null, identifer:null};
	});

	//public static method
	Construct.getNewFinallyStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.FinallyStatement, bodyStatements:[]};
	});

	//public static method
	Construct.getNewBreakStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.BreakStatement, token:null, identifierToken:null, identifer:null};
	});

	//public static method
	Construct.getNewContinueStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ContinueStatement, token:null, identifierToken:null, identifer:null};
	});

	//public static method
	Construct.getNewThrowStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ThrowStatement, token:null, expression:null};
	});

	//public static method
	Construct.getNewSwitchStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.SwitchStatement, valueExpression:null, caseStatements:[]};
	});

	//public static method
	Construct.getNewCaseStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.CaseStatement, valueExpression:null, bodyStatements:[], defaultToken:null};
	});

	//public static method
	Construct.getNewVarStatement = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.VarStatement, identifierToken:null, innerVarStatements:[], typeConstruct:null, valueExpression:null, identifer:null};
	});

	//public static method
	Construct.getNewMethodConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.MethodConstruct, identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], staticToken:null, overrideToken:null, namespaceToken:null, setToken:null, getToken:null, callsSuper:null, isNative:null, isJavaScript:null, javaScriptString:'', namedFunctionExpressions:[], isInternal:null, packageConstruct:null, rootConstruct:null, UNIMPLEMENTEDToken:null, identifer:null};
	});

	//public static method
	Construct.getNewObjectPropertyConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ObjectPropertyConstruct, expression:null, valueExpression:null};
	});

	//public static method
	Construct.getNewParameterConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.ParameterConstruct, identifierToken:null, typeConstruct:null, valueExpression:null, restToken:null, identifer:null};
	});

	//public static method
	Construct.getNewPropertyConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.PropertyConstruct, identifierToken:null, typeConstruct:null, namespaceToken:null, namespaceValueToken:null, namespaceKeywordToken:null, staticToken:null, constToken:null, valueExpression:null, isNative:null, isInternal:false, packageConstruct:null, rootConstruct:null, identifer:null};
	});

	//public static method
	Construct.getNewMetaDataConstruct = (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:Construct.MetaDataConstruct, tokens:[]};
	});
	function Construct()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Construct) || $$this.$$Construct !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Construct) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Construct.$$construct($$this, $$args);
		}
	}

	//construct
	Construct.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Construct', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Construct.$$iinit($$this);

		//call constructor
		if (args !== undefined) Construct.$$constructor.apply($$this, args);
	});

	//initializer
	Construct.$$iinit = (function ($$this)
	{
	});

	//constructor
	Construct.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Construct, null, 'sweetrush.obj::Construct');
})();
//sweetrush.obj.Construct


//sweetrush.core.TranslatorProto
$es4.$$package('sweetrush.core').TranslatorProto = (function ()
{
	//imports
	var Construct;
	var Token;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//class pre initializer
	TranslatorProto.$$sinit = (function ()
	{
		TranslatorProto.$$sinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		Parser = $es4.$$['sweetrush.core'].Parser;

		//set prototype and constructor
		TranslatorProto.prototype = Object.create(Object.prototype);
		Object.defineProperty(TranslatorProto.prototype, "constructor", { value: TranslatorProto, enumerable: false });

		//hold private values
		Object.defineProperty(TranslatorProto.prototype, '$$v', {value:{}});
	});

	//class initializer
	TranslatorProto.$$cinit = (function ()
	{
		TranslatorProto.$$cinit = undefined;
	});

	//public static method
	TranslatorProto.translate = (function ($$$$rootConstruct, $$$$rootConstructs, $$$$dynamicPropertyAccess, $$$$release, $$$$fastPropertyAccess)
	{
		if (TranslatorProto.$$cinit !== undefined) TranslatorProto.$$cinit();

		//set default parameter values
		var rootConstruct = $$$$rootConstruct;
		var rootConstructs = $$$$rootConstructs;
		var dynamicPropertyAccess = $$$$dynamicPropertyAccess;
		var release = $$$$release;
		var fastPropertyAccess = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$fastPropertyAccess, Boolean);

		var _rootConstruct = rootConstruct;
		var _rootConstructs = rootConstructs;
		var _indent = -1;
		var _count = -1;
		var _level = 0;
		var _fastPropertyAccess = fastPropertyAccess = false;
		var _dynamicPropertyAccess = dynamicPropertyAccess;
		var _inClosure = false;
		var _inNamespacedFunction = false;
		var _inStaticFunction = false;
		var _inIfStatement = 0;
		var _importNameConflicts = {};

		function upLevel() 
		{
			_indent++;
			_level++;
			return _level;
		}
;

		function downLevel() 
		{
			_indent--;
			_level--;
			return _level;
		}
;

		function lookupConstructInRootConstruct($$$$rootConstruct, $$$$object) 
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;
			var object = $$$$object;

			if (!rootConstruct || !object)
			{
				throw $es4.$$primitive(new Error('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < rootConstruct.classConstructs.length; i++)
				{
					if (rootConstruct.classConstructs[i].identifierToken.data == object)
					{
						return rootConstruct.classConstructs[i];
					}
				}
				for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++)
				{
					if (rootConstruct.interfaceConstructs[i].identifierToken.data == object)
					{
						return rootConstruct.interfaceConstructs[i];
					}
				}
				if (rootConstruct.packageConstruct.classConstruct)
				{
					return rootConstruct.packageConstruct.classConstruct;
				}
				if (rootConstruct.packageConstruct.interfaceConstruct)
				{
					return rootConstruct.packageConstruct.interfaceConstruct;
				}
				if (rootConstruct.packageConstruct.propertyConstruct)
				{
					return rootConstruct.packageConstruct.propertyConstruct;
				}
				if (rootConstruct.packageConstruct.methodConstruct)
				{
					return rootConstruct.packageConstruct.methodConstruct;
				}
				throw $es4.$$primitive(new Error('could not lookup construct in construct: ' + object));
			}
			if (object.constructor == Construct.NameConstruct)
			{
				return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object));
			}
			else if (object.constructor == Construct.ImportConstruct)
			{
				return lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));
			}
		}
;

		var packageConstruct = rootConstruct.packageConstruct;
		var js = print('$es4.$$package(\'' + (packageConstruct.nameConstruct ? Construct.nameConstructToString(packageConstruct.nameConstruct) : '') + '\').', _indent, 0);
		if (packageConstruct.classConstruct)
		{
			if (packageConstruct.classConstruct.UNIMPLEMENTEDToken)
			{
				if (release)
				{
					js += packageConstruct.classConstruct.identifierToken.data + ' = null;\n';
					return js;
				}
				js = (packageConstruct.nameConstruct) ? '$es4.$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
				js += '.' + packageConstruct.classConstruct.identifierToken.data;
				js += ' = function () { throw new Error(\'Use of unimplemented class: ' + packageConstruct.classConstruct.identifierToken.data + '\'); }';
				js += '\n';
				return js;
			}
			js += print(translateClassConstruct(packageConstruct.classConstruct), _indent, 0);
		}
		js += (packageConstruct.interfaceConstruct) ? print(translateInterfaceConstruct(packageConstruct.interfaceConstruct), _indent, 0) : '';
		js += (packageConstruct.propertyConstruct) ? print(translatePropertyConstruct(packageConstruct.propertyConstruct), _indent, 0) : '';
		if (packageConstruct.methodConstruct)
		{
			if (packageConstruct.methodConstruct.UNIMPLEMENTEDToken)
			{
				if (release)
				{
					js += packageConstruct.methodConstruct.identifierToken.data + ' = null;\n';
					return js;
				}
				js = (packageConstruct.nameConstruct) ? '$es4.$$package(\'' + Construct.nameConstructToString(packageConstruct.nameConstruct) + '\')' : 'global';
				js += '.' + packageConstruct.methodConstruct.identifierToken.data;
				js += ' = function () { throw new Error(\'Use of unimplemented function: ' + packageConstruct.methodConstruct.identifierToken.data + '\'); }';
				js += '\n';
				return js;
			}
			_inStaticFunction = true;
			js += print(translateFunctionConstruct(packageConstruct.methodConstruct), _indent, 0);
		}
		return js;

		function getTranslatedTypeName($$$$type) 
		{
			//set default parameter values
			var type = $$$$type;

			if (type.name == '*' || type.name == 'void')
			{
				return '';
			}
			if (_importNameConflicts[type.name])
			{
				var fullyQualifiedName = type.fullyQualifiedName;
				var parts = fullyQualifiedName.split('.');
				var name = parts.pop();
				return '$es4.$$[\'' + parts.join('.') + '\'].' + name;
			}
			return type.name;
		}
;

		function translateInterfaceConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('function ' + construct.identifierToken.data + '()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//handle cast', _indent + 2, 1);
			js += print('return $es4.$$as(arguments[0], ' + construct.identifierToken.data + ');', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var comma = false;
			var innerJS = '';
			if (construct.extendsNameConstructs.length)
			{
				innerJS += 'IMPLEMENTS:[';
				for (var i = 0; i < construct.extendsNameConstructs.length; i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = construct.extendsNameConstructs[i].type;
					var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstructs[i]);
					if (innerConstruct.isInternal)
					{
						innerJS += comma = type.fullyQualifiedName;
					}
					else
					{
						innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!construct.isInternal)
			{
				if (_rootConstruct.classConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
				if (_rootConstruct.interfaceConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
			}
			var packageName = construct.packageName;
			var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;
			if (innerJS)
			{
				js += print('return $es4.$$interface(' + construct.identifierToken.data + ', ', _indent + 1, 0, 1);
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js += print('return $es4.$$interface(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
				js += print('\'' + fullyQualifiedName + '\');', 0, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;
		}
;

		function translatePropertyConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			return print(construct.identifierToken.data + ' = $es4.$$namespace(' + translateExpression(construct.valueExpression, _indent, false, construct) + ', true);', 0, 1);
		}
;

		function translateFunctionConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var importConstructs = _rootConstruct.packageConstruct.importConstructs;
			var js = '';
			var innerJS;
			var cr = false;
			var accessor = construct.getToken || construct.setToken;
			js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('var $$this = ' + construct.identifierToken.data + ', $$thisp = ' + construct.identifierToken.data + ';', _indent + 1, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			if (accessor)
			{
				js += print(construct.identifierToken.data + '.$$pcinit = ' + construct.identifierToken.data + ';', _indent + 1, 1, 1);
				js += print('return ' + construct.identifierToken.data + ';', _indent + 1, 1, 0);
			}
			else
			{
				js += print('return $es4.$$function (' + construct.identifierToken.data + ');', _indent + 1, 1, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;

			function translateImports($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				var js = '';
				if (importConstructs.length)
				{
					js += print('//imports', _indent + 1, 1);
				}
				for (var i = 0; i < importConstructs.length; i++)
				{
					js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
				}
				return js;
			}
;

			function translateClassInitializer($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				_inStaticFunction = true;
				var js = print('//function initializer', _indent + 1, 1);
				js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
				js += print('{', _indent + 1, 1);
				js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 1);
				var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
				if (importConstructs.length)
				{
					js += print('//initialize imports', _indent + 2, 1, 1);
				}
				var importNames = {};
				importNames[construct.identifierToken.data] = true;
				for (var i = 0; i < importConstructs.length; i++)
				{
					var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
					var packageName = '';
					if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
					{
						var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
						fullyQualifiedName = fullyQualifiedName.split('.');
						fullyQualifiedName.pop();
						packageName = fullyQualifiedName.join('.');
					}
					if (importNames[name])
					{
						_importNameConflicts[name] = true;
						continue;
					}
					else
					{
						importNames[name] = true;
					}
					js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
				}
				js += print('});', _indent + 1, 1);
				_inStaticFunction = false;
				return js;
			}
;

			function translateClassFunction($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				upLevel();
				var js = '';
				if (accessor)
				{
					var name = construct.getToken ? 'getter' : 'setter';
					js += print('function ' + construct.identifierToken.data + '() { $$' + name + '(\'' + construct.identifierToken.data + '\', ' + '$es4.$$package(\'' + (construct.packageConstruct.nameConstruct ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '') + '\'), (function ()', _indent, 1);
				}
				else
				{
					js += print('function ' + construct.identifierToken.data + '(', _indent, 0);
				}
				js += translateParameters(construct, construct);
				if (!accessor)
				{
					js += print(')', 0, (_indent) ? 1 : 0);
				}
				js += print('{', _indent, (_indent) ? 1 : 0);
				js += print('//initialize function if not initialized', _indent + 1, 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(construct, construct);
				if (accessor)
				{
					js += print('//change reference', _indent + 1, 1, 1);
					js += print(construct.identifierToken.data + ' = this;', _indent + 1, construct.bodyStatements.length ? 2 : 1);
				}
				if (construct.isJavaScript)
				{
					js += construct.javaScriptString;
				}
				else
				{
					js += translateStatements(construct.bodyStatements, _indent + 1, construct);
				}
				if (accessor)
				{
					js += print('})', (construct.isJavaScript) ? 0 : _indent, 0);
					js += print(');}', 0, 1);
				}
				else
				{
					js += print('}', 0, 1);
				}
				downLevel();
				return js;
			}
;
		}
;

		function translateClassConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			upLevel();
			var innerJS;
			var cr = false;
			js += print(construct.identifierToken.data + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateNamespaces(construct, true)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateStaticProperties(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateStaticMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateStaticAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInternalClasses(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInternalInterfaces(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateClassReturnStatement(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += print('})();', _indent, 1);
			downLevel();
			return js;
		}
;

		function translateClassInitializer($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = print('//class initializer', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$cinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print(construct.identifierToken.data + '.$$cinit = undefined;', _indent + 2, 2);
			var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
			if (importConstructs.length)
			{
				js += print('//initialize imports', _indent + 2, 1);
			}
			var found = false;
			var importNames = {};
			importNames[construct.identifierToken.data] = true;
			for (var i = 0; i < importConstructs.length; i++)
			{
				found = true;
				var name = importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data;
				var packageName = '';
				if (importConstructs[i].nameConstruct.identifierTokens.length > 1)
				{
					var fullyQualifiedName = Construct.nameConstructToString(importConstructs[i].nameConstruct);
					fullyQualifiedName = fullyQualifiedName.split('.');
					fullyQualifiedName.pop();
					packageName = fullyQualifiedName.join('.');
				}
				if (importNames[name])
				{
					_importNameConflicts[name] = true;
					continue;
				}
				else
				{
					importNames[name] = true;
				}
				js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
			}
			var found = false;
			for (var i = 0; i < construct.propertyConstructs.length; i++)
			{
				var propertyConstruct = construct.propertyConstructs[i];
				if (!propertyConstruct.staticToken)
				{
					continue;
				}
				if (!propertyConstruct.valueExpression)
				{
					continue;
				}
				if (propertyConstruct.translatedEarlier)
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1, (importConstructs.length) ? 1 : 0);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var namespaceString;
				if (namespaceObj.importID)
				{
					namespaceString = namespaceObj.importID;
				}
				else
				{
					namespaceString = (construct.identifierToken.data + '.' + namespaceObj.name);
				}
				if (namespaceObj.isCustom)
				{
					js += print('$es4.$$namespace(' + namespaceString + ', ' + construct.identifierToken.data + ').' + propertyConstruct.identifierToken.data, _indent + 2, 0);
					js += ' = ' + translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
					js += print(';', 0, 1);
				}
				else
				{
					if (propertyConstruct.isNative)
					{
						js += print(propertyConstruct.identifierToken.data, _indent + 2, 0);
					}
					else
					{
						js += print(construct.identifierToken.data + '.' + propertyConstruct.identifierToken.data, _indent + 2, 0);
					}
					var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
					var typeString = getTranslatedTypeName(propertyConstruct.identifier.type);
					if (propertyConstruct.isNative && propertyConstruct.coerce && isCoerceRequired(propertyConstruct, typeString, valueJS))
					{
						js += ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ')';
					}
					else
					{
						js += ' = ' + valueJS;
					}
					js += print(';', 0, 1);
				}
			}
			js += translateStatements(construct.initializerStatements, _indent + 2, construct);
			js += print('});', _indent + 1, 1);
			_inStaticFunction = false;
			return js;
		}
;

		function translateClassFunction($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			upLevel();
			var js = print('function ' + construct.identifierToken.data + '()', _indent, 1);
			js += print('{', _indent, 1);
			js += print('//initialize class if not initialized', _indent + 1, 1);
			js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
			js += print('//save scope', _indent + 1, 1);
			js += print('var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;', _indent + 1, 1);
			js += print('var $$thisp = this;', _indent + 1, 2);
			js += print('//handle possible cast', _indent + 1, 1);
			js += print('if ($$this === $$thisp && (!($$this instanceof ' + construct.identifierToken.data + ') || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + construct.identifierToken.data + ') : $es4.$$throwArgumentError();', _indent + 1, 1);
			js += print('Object.defineProperty($$this, \'$$t\', {value:1});', _indent + 1, 1);
			var innerJS;
			js += (innerJS = translateNamespaces(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInstanceProperties(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInitializer(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateConstructor(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInstanceMethods(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += (innerJS = translateInstanceAccessors(construct)) ? print(innerJS, 0, 0, 1) : '';
			js += print('//call construct if no arguments, or argument zero does not equal manual construct', _indent + 1, 1, 1);
			js += print('if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];', _indent + 2, 2);
			js += print('$es4.$$construct($$this, $$args);', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			js += print('}', _indent, 1);
			downLevel();
			return js;
		}
;

		function translateInternalClasses($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if (construct.isInternal)
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL CLASS////////////////', _indent + 1, 1);
				js += print('var ' + translateClassConstruct(_rootConstruct.classConstructs[i]), 1, 0);
			}
			return js;
		}
;

		function translateInternalInterfaces($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if (construct.isInternal)
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL INTERFACE////////////////', _indent + 1, 1);
				js += print('var ' + translateInterfaceConstruct(_rootConstruct.interfaceConstructs[i]), 1, 0);
			}
			return js;
		}
;

		function translateClassReturnStatement($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = print('return $es4.$$class(' + construct.identifierToken.data + ', ', _indent + 1, 0);
			var comma = false;
			var innerJS = '';
			if (construct.extendsNameConstruct)
			{
				var type = construct.extendsNameConstruct.type;
				var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.extendsNameConstruct);
				if (innerConstruct.isInternal)
				{
					innerJS += comma = 'EXTENDS:' + type.fullyQualifiedName;
				}
				else
				{
					innerJS += comma = 'EXTENDS:\'' + type.fullyQualifiedName + '\'';
				}
			}
			if (construct.implementsNameConstructs.length)
			{
				if (comma)
				{
					innerJS += ', ';
				}
				innerJS += 'IMPLEMENTS:[';
				comma = false;
				for (var i = 0; i < construct.implementsNameConstructs.length; i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = construct.implementsNameConstructs[i].type;
					var innerConstruct = lookupConstructInRootConstruct(construct.rootConstruct, construct.implementsNameConstructs[i]);
					if (innerConstruct.isInternal)
					{
						innerJS += comma = type.fullyQualifiedName;
					}
					else
					{
						innerJS += comma = '\'' + type.fullyQualifiedName + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!construct.isInternal)
			{
				if (_rootConstruct.classConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.classConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.classConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
				if (_rootConstruct.interfaceConstructs.length)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < _rootConstruct.interfaceConstructs.length; i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = _rootConstruct.interfaceConstructs[i].identifierToken.data;
					}
					innerJS += comma = ']';
				}
			}
			var packageName = construct.packageName;
			var fullyQualifiedName = (packageName) ? packageName + '::' + construct.identifierToken.data : construct.identifierToken.data;
			if (innerJS)
			{
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js = print('return $es4.$$class(' + construct.identifierToken.data + ', null, ', _indent + 1, 0);
				js += print('\'' + fullyQualifiedName + '\');', 0, 1);
			}
			return js;
		}
;

		function translateInitializer($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = print('//initializer', _indent, 1);
			js += print('$es4.$$iinit($$thisp, (function ()', _indent, 1);
			js += print('{', _indent, 1);
			var found = false;
			for (var i = 0; i < construct.instancePropertyConstructs.length; i++)
			{
				var propertyConstruct = construct.instancePropertyConstructs[i];
				if (!propertyConstruct.valueExpression)
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 1, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				if (namespaceObj.isCustom)
				{
					var namespaceString = '$$thisp.' + propertyConstruct.namespaceToken.data;
					if (namespaceObj.importID)
					{
						namespaceString = namespaceObj.normalizedImportID;
					}
					js += print('$es4.$$namespace(' + namespaceString + ', $$this).' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
					js += translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
					js += print(';', 0, 1);
				}
				else
				{
					if (propertyConstruct.isNative)
					{
						js += print(propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
						var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
						var typeString = getTranslatedTypeName(propertyConstruct.identifier.type);
						if (propertyConstruct.coerce && isCoerceRequired(propertyConstruct, typeString, valueJS))
						{
							js += '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
						}
						else
						{
							js += valueJS;
						}
						js += print(';', 0, 1);
					}
					else if (_dynamicPropertyAccess)
					{
						js += print('$es4.$$set($$this, $$this, $$thisp, \'' + propertyConstruct.identifierToken.data + '\', ' + translateExpression(propertyConstruct.valueExpression, _indent, false, construct) + ', \'=\')', _indent + 1, 0);
						js += print(';', 0, 1);
					}
					else
					{
						if (namespaceObj.isPrivate)
						{
							js += print('$$thisp.' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
						}
						else
						{
							js += print('$$this.' + propertyConstruct.identifierToken.data + ' = ', _indent + 1, 0);
						}
						js += translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
						js += print(';', 0, 1);
					}
				}
			}
			js += print('}));', _indent, 1);
			downLevel();
			return (found) ? js : '';
		}
;

		function translateConstructor($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			upLevel();
			var methodConstruct = construct.constructorMethodConstruct;
			js += print('//constructor', _indent, 1);
			js += print('$es4.$$constructor($$thisp, (function (', _indent, 0);
			if (methodConstruct)
			{
				js += translateParameters(methodConstruct, construct);
			}
			js += print(')', 0, 1);
			js += print('{', _indent, 1);
			if (methodConstruct)
			{
				js += translateDefaultParameterValues(methodConstruct, construct);
			}
			var carriage = false;
			if (construct.extendsNameConstruct && (!methodConstruct || (methodConstruct && !methodConstruct.callsSuper)))
			{
				js += print('$es4.$$super($$thisp).$$z();', _indent + 1, 1);
				carriage = true;
			}
			if (methodConstruct)
			{
				var innerJS = print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
				if (innerJS && carriage)
				{
					js += print('', 0, 1);
				}
				if (innerJS)
				{
					js += innerJS;
				}
			}
			js += print('})', _indent, 0);
			js += print(');', 0, 1);
			downLevel();
			return js;
		}
;

		function translateImports($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var importConstructs = (construct.isInternal) ? _rootConstruct.importConstructs : _rootConstruct.packageConstruct.importConstructs;
			if (importConstructs.length)
			{
				js += print('//imports', _indent + 1, 1);
			}
			for (var i = 0; i < importConstructs.length; i++)
			{
				js += print('var ' + importConstructs[i].nameConstruct.identifierTokens[importConstructs[i].nameConstruct.identifierTokens.length - 1].data + ';', _indent + 1, 1);
			}
			return js;
		}
;

		function translateNamespaces($$$$construct, $$$$isClassLevel) 
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = (1 > arguments.length - 1) ? false : $$$$isClassLevel;

			var js = '';
			var propertyConstructs = construct.namespacePropertyConstructs;
			var counter = 0;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//namespaces', _indent + 1, 1);
				}
				js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_namespace(' + (propertyConstruct.valueExpression ? translateExpression(propertyConstruct.valueExpression, _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + construct.identifierToken.data + '\'') + ', ' + ((isClassLevel) ? construct.identifierToken.data : (propertyConstruct.namespaceToken.data == 'private' ? '$$thisp' : '$$this')) + ', \'' + propertyConstruct.identifierToken.data + '\');', _indent + 1, 1);
			}
			return js;
		}
;

		function translateStaticProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = construct.staticPropertyConstructs;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var type = propertyConstruct.identifier.type;
				var scope = construct.identifierToken.data;
				var returnString = (type.isGlobal) ? getTranslatedTypeName(type) : '\'' + type.fullyQualifiedName + '\'';
				var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', ' + (construct.identifierToken.data + '.' + namespaceObj.name);
				if (namespaceObj.isCustom)
				{
					js += print('$$cnamespace_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
				else if (propertyConstruct.isNative)
				{
					js += print('var ' + propertyConstruct.identifierToken.data + ';', _indent + 1, 1);
				}
				else
				{
					if (propertyConstruct.constToken && propertyConstruct.valueExpression)
					{
						if (returnString == 'String' || returnString == 'uint' || returnString == 'int' || returnString == 'Number' || returnString == 'Boolean')
						{
							var constructor = propertyConstruct.valueExpression.constructor;
							if (constructor === Construct.StringExpression || constructor === Construct.NumberExpression || constructor === Construct.BooleanExpression)
							{
								var valueJS = translateExpression(propertyConstruct.valueExpression, _indent, false, construct);
								var coerce = false;
								if (constructor === Construct.StringExpression && returnString != 'String')
								{
									coerce = true;
								}
								else if (constructor === Construct.BooleanExpression && returnString != 'Boolean')
								{
									coerce = true;
								}
								else if (constructor === Construct.NumberExpression)
								{
									if (returnString == 'uint')
									{
										if (parseInt(valueJS) != (valueJS >>> 0))
										{
											coerce = true;
										}
									}
									else if (returnString == 'int')
									{
										if (parseInt(valueJS) != (valueJS >> 0))
										{
											coerce = true;
										}
									}
								}
								if (coerce)
								{
									js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = $es4.$$coerce(' + valueJS + ', ' + returnString + ');', _indent + 1, 1);
								}
								else
								{
									js += print(scope + '.' + propertyConstruct.identifierToken.data + ' = ' + valueJS + ';', _indent + 1, 1);
								}
								propertyConstruct.translatedEarlier = true;
								continue;
							}
						}
					}
					js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
			}
			return js;
		}
;

		function translateInstanceProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = construct.instancePropertyConstructs;
			for (var i = 0; i < propertyConstructs.length; i++)
			{
				var propertyConstruct = propertyConstructs[i];
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
				}
				var namespaceObj = propertyConstruct.identifier.namespaceObj;
				var isCNamespace = namespaceObj.isCustom;
				var scope = (isCNamespace) ? '$$this, $$thisp' : '$$thisp';
				var returnString = getTranslatedTypeName(propertyConstruct.identifier.type);
				var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', $$thisp.' + namespaceObj.name;
				if (isCNamespace)
				{
					js += print('$es4.$$cnamespace_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
				else if (propertyConstruct.isNative)
				{
					js += print('var ' + propertyConstruct.identifierToken.data + ';', _indent + 1, 1);
				}
				else
				{
					js += print('$es4.$$' + propertyConstruct.identifier.namespaceObj.name + '_property(\'' + propertyConstruct.identifierToken.data + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
			}
			return js;
		}
;

		function translateStaticMethods($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = '';
			for (var i = 0; i < construct.staticMethodConstructs.length; i++)
			{
				var methodConstruct = construct.staticMethodConstructs[i];
				upLevel();
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var isCNamespace = namespaceObj.isCustom;
				var type = methodConstruct.identifier.type;
				if (methodConstruct.isNative)
				{
					if (isCNamespace)
					{
						throw $es4.$$primitive(new Error('cannot have native custom namespace native static'));
					}
					if (methodConstruct.isJavaScript)
					{
						if (getTranslatedTypeName(type))
						{
							js += print('//method', _indent, 1, (js) ? 1 : 0);
							js += print('function ' + methodConstruct.identifierToken.data + '() { return $es4.$$coerce((function (', _indent, 0);
							js += translateParameters(methodConstruct, construct);
							js += print(')', 0, 1);
							js += print('{', _indent, 1);
							js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
							js += translateDefaultParameterValues(methodConstruct, construct);
							js += methodConstruct.javaScriptString;
							js += print('}).apply(this, arguments), ' + getTranslatedTypeName(type) + '); }', _indent, 1);
						}
						else
						{
							js += print('//method', _indent, 1, (js) ? 1 : 0);
							js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
							js += translateParameters(methodConstruct, construct);
							js += print(')', 0, 1);
							js += print('{', _indent, 1);
							js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
							js += translateDefaultParameterValues(methodConstruct, construct);
							js += methodConstruct.javaScriptString;
							js += print('}', _indent, 1);
						}
					}
					else
					{
						js += print('//method', _indent, 1, (js) ? 1 : 0);
						js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
						js += translateParameters(methodConstruct, construct);
						js += print(')', 0, 1);
						js += print('{', _indent, 1);
						js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
						js += translateDefaultParameterValues(methodConstruct, construct);
						if (methodConstruct.UNIMPLEMENTEDToken && release)
						{
							js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
						}
						else
						{
							js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
						}
						js += print('}', _indent, 1);
					}
				}
				else if (methodConstruct.isJavaScript)
				{
					js += print('//method', _indent, 1, (js) ? 1 : 0);
					js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
					js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if (methodConstruct.UNIMPLEMENTEDToken && release)
					{
						js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
					}
					else
					{
						js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
					}
					js += print('})', _indent, 0);
					if (getTranslatedTypeName(type))
					{
						js += ', ' + getTranslatedTypeName(type);
					}
					js += print(');', 0, 1);
				}
				else if (isCNamespace)
				{
					js += print('//custom namespace method', _indent, 1, (js) ? 1 : 0);
					var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + construct.identifierToken.data + '.' + namespaceObj.normalizedName;
					js += print('$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + namespaceString + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
					js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if (methodConstruct.UNIMPLEMENTEDToken && release)
					{
						js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
					}
					else
					{
						_inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : (namespaceObj.namespaceIsPrivate ? '$$thisp.' : '$$this.') + namespaceObj.name;
						js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
						_inNamespacedFunction = false;
					}
					js += print('})', _indent, 0);
					js += print(');', 0, 1);
				}
				else
				{
					js += print('//method', _indent, 1, (js) ? 1 : 0);
					js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, 1);
					js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if (methodConstruct.UNIMPLEMENTEDToken && release)
					{
						js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
					}
					else
					{
						js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
					}
					js += print('})', _indent, 0);
					js += print(');', 0, 1);
				}
				downLevel();
			}
			_inStaticFunction = false;
			return js;
		}
;

		function translateInstanceMethods($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < construct.instanceMethodConstructs.length; i++)
			{
				var methodConstruct = construct.instanceMethodConstructs[i];
				upLevel();
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var isCNamespace = namespaceObj.isCustom;
				var type = methodConstruct.identifier.type;
				js += print((isCNamespace) ? '//custom namespace method' : '//method', _indent, 1, (js) ? 1 : 0);
				var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.normalizedImportID : ', ' + (namespaceObj.namespaceIsPrivate ? '$$thisp.' : '$$this.') + namespaceObj.normalizedName;
				if (methodConstruct.isNative)
				{
					js += print('function ' + methodConstruct.identifierToken.data + '(', _indent, 0);
				}
				else
				{
					if (isCNamespace)
					{
						js += print('$es4.$$cnamespace_function(\'' + methodConstruct.identifierToken.data + '\', $$this, $$thisp' + namespaceString + ', (function (', _indent, 0);
					}
					else if (!methodConstruct.ITERABLEToken && _fastPropertyAccess)
					{
						js += print('$$thisp.' + methodConstruct.identifierToken.data + ' = function (', _indent, 0);
					}
					else
					{
						js += print('$es4.$$' + namespaceObj.name + '_function(\'' + methodConstruct.identifierToken.data + '\', $$thisp, (function (', _indent, 0);
					}
				}
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (methodConstruct.isJavaScript) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.isJavaScript)
				{
					js += methodConstruct.javaScriptString;
				}
				else if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					if (isCNamespace)
					{
						_inNamespacedFunction = (namespaceObj.importID) ? namespaceObj.importID : '$$thisp.' + namespaceObj.name;
					}
					js += print(translateStatements(methodConstruct.bodyStatements, _indent + 1, construct), 0, 0);
					_inNamespacedFunction = false;
				}
				if (methodConstruct.isNative || (!methodConstruct.ITERABLEToken && _fastPropertyAccess && !isCNamespace))
				{
					js += print('}', _indent, 1);
				}
				else
				{
					js += print('})', (methodConstruct.isJavaScript) ? 0 : _indent, 0);
					if (methodConstruct.isJavaScript && getTranslatedTypeName(type))
					{
						js += ', ' + getTranslatedTypeName(type);
					}
					js += print(');', 0, 1);
				}
				downLevel();
			}
			return js;
		}
;

		function translateStaticAccessors($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			_inStaticFunction = true;
			var js = '';

			function getMethodConstructJS($$$$methodConstruct, $$$$type) 
			{
				//set default parameter values
				var methodConstruct = $$$$methodConstruct;
				var type = $$$$type;

				if (!methodConstruct)
				{
					return 'null';
				}
				upLevel();
				var js = '(function (';
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
				js += print('if (' + construct.identifierToken.data + '.$$cinit !== undefined) ' + construct.identifierToken.data + '.$$cinit();', _indent + 1, (methodConstruct.isJavaScript) ? 0 : 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.isNative)
				{
					throw $es4.$$primitive(new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data));
				}
				if (methodConstruct.isJavaScript)
				{
					js += methodConstruct.javaScriptString;
				}
				else if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					if (methodConstruct.identifier.namespaceObj.isCustom)
					{
						_inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$es4.$$thisp.' + methodConstruct.identifier.namespaceObj.name;
					}
					js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
					_inNamespacedFunction = false;
				}
				js += print('})', (methodConstruct.javaScriptString) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < construct.staticAccessorConstructs.length; i++)
			{
				var setterMethodConstruct = construct.staticAccessorConstructs[i].setter;
				var getterMethodConstruct = construct.staticAccessorConstructs[i].getter;
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				js += print((methodConstruct.identifier.namespaceObj.isCustom) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', ' + construct.identifierToken.data + '.' + namespaceObj.name;
				if (methodConstruct.identifier.namespaceObj.isCustom)
				{
					js += print('$es4.$$cnamespace_accessor(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + namespaceString + ', ', _indent + 1, 0);
				}
				else
				{
					js += print('$es4.$$' + methodConstruct.identifier.namespaceObj.name + '_accessor(\'' + methodConstruct.identifierToken.data + '\', ' + construct.identifierToken.data + ', ', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;
				if (!getterMethodConstruct)
				{
					js += '(function ()';
					js += print('{', _indent + 1, 1, 1);
					js += print("throw new Error('attempted access to undefined static getter');", _indent + 2, 0);
					js += print('}), ', _indent + 1, 0, 1);
				}
				else
				{
					js += getMethodConstructJS(getterMethodConstruct, type) + ', ';
				}
				if (!setterMethodConstruct && methodConstruct.overrideToken)
				{
					js += '(function ($$value)';
					js += print('{', _indent + 1, 1, 1);
					js += print("throw new Error('attempted access to undefined static setter');", _indent + 2, 0);
					js += print('})', _indent + 1, 0, 1);
				}
				else
				{
					js += getMethodConstructJS(setterMethodConstruct, type);
				}
				js += print(');', 0, 1);
			}
			_inStaticFunction = false;
			return js;
		}
;

		function translateInstanceAccessors($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';

			function getMethodConstructJS($$$$methodConstruct, $$$$type) 
			{
				//set default parameter values
				var methodConstruct = $$$$methodConstruct;
				var type = $$$$type;

				if (!methodConstruct)
				{
					return 'null';
				}
				upLevel();
				var js = '(function (';
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (methodConstruct.javaScriptString) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if (methodConstruct.isNative)
				{
					throw $es4.$$primitive(new Error('accessor cannot be native: ' + methodConstruct.identifierToken.data));
				}
				if (methodConstruct.isJavaScript)
				{
					js += methodConstruct.javaScriptString;
				}
				else if (methodConstruct.UNIMPLEMENTEDToken && release)
				{
					js += print("throw new Error('" + methodConstruct.identifierToken.data + "');", 0, 0);
				}
				else
				{
					if (methodConstruct.identifier.namespaceObj.isCustom)
					{
						_inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$$thisp.' + methodConstruct.identifier.namespaceObj.name;
					}
					js += translateStatements(methodConstruct.bodyStatements, _indent + 1, construct);
					_inNamespacedFunction = false;
				}
				js += print('})', (methodConstruct.javaScriptString) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < construct.instanceAccessorConstructs.length; i++)
			{
				var setterMethodConstruct = construct.instanceAccessorConstructs[i].setter;
				var getterMethodConstruct = construct.instanceAccessorConstructs[i].getter;
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				js += print((methodConstruct.identifier.namespaceObj.isCustom) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
				var namespaceObj = methodConstruct.identifier.namespaceObj;
				var namespaceString = (namespaceObj.importID) ? ', ' + namespaceObj.importID : ', $$thisp.' + namespaceObj.name;
				if (methodConstruct.identifier.namespaceObj.isCustom)
				{
					js += print('$es4.$$cnamespace_accessor(\'' + methodConstruct.identifierToken.data + '\', $$this, $$thisp' + namespaceString + ', ', _indent + 1, 0);
				}
				else
				{
					js += print('$es4.$$' + methodConstruct.identifier.namespaceObj.name + '_accessor(\'' + methodConstruct.identifierToken.data + '\', $$thisp, ', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? getterMethodConstruct.identifier.type : setterMethodConstruct.identifier.type;
				if (!getterMethodConstruct && methodConstruct.overrideToken)
				{
					js += '(function ()';
					js += print('{', _indent + 1, 1, 1);
					js += print('return $es4.$$super($$thisp).' + methodConstruct.identifierToken.data + ';', _indent + 2, 0);
					js += print('}), ', _indent + 1, 0, 1);
				}
				else
				{
					js += getMethodConstructJS(getterMethodConstruct, type) + ', ';
				}
				if (!setterMethodConstruct && methodConstruct.overrideToken)
				{
					js += '(function ($$value)';
					js += print('{', _indent + 1, 1, 1);
					js += print('$es4.$$super($$thisp).' + methodConstruct.identifierToken.data + ' = $$value;', _indent + 2, 0);
					js += print('})', _indent + 1, 0, 1);
				}
				else
				{
					js += getMethodConstructJS(setterMethodConstruct, type);
				}
				js += print(');', 0, 1);
			}
			return js;
		}
;

		function translateParameters($$$$methodConstruct, $$$$construct) 
		{
			//set default parameter values
			var methodConstruct = $$$$methodConstruct;
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
			{
				var parameterConstruct = methodConstruct.parameterConstructs[i];
				js += '$$$$' + parameterConstruct.identifierToken.data;
				if ((i + 1) < methodConstruct.parameterConstructs.length)
				{
					js += ', ';
				}
			}
			return js;
		}
;

		function translateDefaultParameterValues($$$$methodConstruct, $$$$construct) 
		{
			//set default parameter values
			var methodConstruct = $$$$methodConstruct;
			var construct = $$$$construct;

			var js = '';
			for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
			{
				var parameterConstruct = methodConstruct.parameterConstructs[i];
				if (!js)
				{
					js += print('//set default parameter values', _indent + 1, 1);
				}
				if (parameterConstruct.restToken || parameterConstruct.valueExpression)
				{
					if (parameterConstruct.restToken)
					{
						js += print('for (var $$i = ' + (methodConstruct.parameterConstructs.length - 1) + ', $$length = arguments.length, ' + parameterConstruct.identifierToken.data + ' = new Array($$length - ' + (methodConstruct.parameterConstructs.length - 1) + '); $$i < $$length; $$i += 1) ' + parameterConstruct.identifierToken.data + '[$$i - ' + (methodConstruct.parameterConstructs.length - 1) + '] = arguments[$$i];', _indent + 1, 1);
					}
					else if (parameterConstruct.valueExpression)
					{
						var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
						if (coerceType)
						{
							js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
						}
						else
						{
							js += print('var ' + parameterConstruct.identifierToken.data + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression(parameterConstruct.valueExpression, 0, false, construct) + ' : $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
						}
					}
				}
				else
				{
					var coerceType = getTranslatedTypeName(parameterConstruct.identifier.type);
					if (coerceType)
					{
						js += print('var ' + parameterConstruct.identifierToken.data + ' = $es4.$$coerce($$$$' + parameterConstruct.identifierToken.data + ', ' + coerceType + ');', _indent + 1, 1);
					}
					else
					{
						js += print('var ' + parameterConstruct.identifierToken.data + ' = $$$$' + parameterConstruct.identifierToken.data + ';', _indent + 1, 1);
					}
				}
			}
			if (js)
			{
				js += print('', 0, 1);
			}
			return js;
		}
;

		function translateStatements($$$$statements, $$$$indent, $$$$construct) 
		{
			//set default parameter values
			var statements = $$$$statements;
			var indent = $$$$indent;
			var construct = $$$$construct;

			if (!indent)
			{
				indent = _indent;
			}
			else
			{
				indent--;
			}
			var js = '';
			for (var i = 0; i < statements.length; i++)
			{
				var statement = statements[i];
				if (i != 0 && statements[i - 1].constructor != Construct.FunctionExpression && statements[i].constructor == Construct.FunctionExpression)
				{
					js += '\n';
				}
				js += translateStatement(statement, indent + 1, false, construct);
				if (i + 1 < statements.length && statement.constructor == 'FunctionExpression')
				{
					js += '\n';
				}
			}
			return js;
		}
;

		function translateStatement($$$$statement, $$$$_indent, $$$$inline, $$$$construct) 
		{
			//set default parameter values
			var statement = $$$$statement;
			var _indent = $$$$_indent;
			var inline = $$$$inline;
			var construct = $$$$construct;

			if (!construct)
			{
				throw $es4.$$primitive(new Error('construct null in translate statement'));
			}
			var js = '';
			switch (statement.constructor)
			{
				case Construct.EmptyStatement:
					break;
				case Construct.IfStatement:
					_inIfStatement++;
					js += print('if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					for (var i = 0; i < statement.elseIfStatements.length; i++)
					{
						js += translateStatement(statement.elseIfStatements[i], _indent, false, construct);
					}
					if (statement.elseStatement)
					{
						js += translateStatement(statement.elseStatement, _indent, false, construct);
					}
					_inIfStatement--;
					break;
				case Construct.ElseIfStatement:
					_inIfStatement++;
					js += print('else if (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case Construct.ElseStatement:
					_inIfStatement++;
					js += print('else', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case Construct.WhileStatement:
					js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.DoWhileStatement:
					js += print('do', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					js += print('while (' + translateExpression(statement.conditionExpression, _indent, false, construct) + ')', _indent, 1);
					break;
				case Construct.ForStatement:
					js += print('for (', _indent, 0);
					if (statement.variableStatement)
					{
						js += translateStatement(statement.variableStatement, 0, true, construct);
					}
					js += ';';
					if (statement.conditionExpression)
					{
						js += ' ' + translateExpression(statement.conditionExpression, _indent, false, construct);
					}
					js += ';';
					if (statement.afterthoughtExpression)
					{
						js += ' ' + translateExpression(statement.afterthoughtExpression, _indent, false, construct);
					}
					js += ')\n';
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.ForEachStatement:
					_count++;
					var object = translateExpression(statement.arrayExpression, _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (var ' + index + ' in ' + object + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					var valueJS = '';
					if (_dynamicPropertyAccess)
					{
						valueJS += object + '.$$nextValue(' + index + ')';
					}
					else
					{
						valueJS += object + '[' + index + ']';
					}
					var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
					if (typeString)
					{
						js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
					}
					else
					{
						js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.ForInStatement:
					_count++;
					var object = translateExpression(statement.objectExpression, _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (' + translateStatement(statement.variableStatement, 0, true, construct) + ' in ' + translateExpression(statement.objectExpression, _indent, false, construct) + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					if (_dynamicPropertyAccess)
					{
						valueJS = object + '.$$nextName(' + index + ')';
						var typeString = getTranslatedTypeName(statement.variableStatement.identifier.type);
						if (typeString)
						{
							js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
						}
						else
						{
							js += print(translateStatement(statement.variableStatement, 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
						}
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case Construct.BreakStatement:
					js += print('break', _indent, 0);
					if (statement.identifierToken)
					{
						js += ' ' + statement.identifierToken.data;
					}
					js += ';\n';
					break;
				case Construct.ContinueStatement:
					js += print('continue', _indent, 0);
					if (statement.identifierToken)
					{
						js += ' ' + statement.identifierToken.data;
					}
					js += ';\n';
					break;
				case Construct.ThrowStatement:
					js += print('throw', _indent, 0);
					if (statement.expression)
					{
						js += ' ' + translateExpression(statement.expression, _indent, false, construct);
					}
					js += ';\n';
					break;
				case Construct.TryStatement:
					js += print('try', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					if (statement.catchStatements.length == 1)
					{
						js += print('catch (' + statement.catchStatements[0].identifierToken.data + ')', _indent, 1);
					}
					else
					{
						js += print('catch ($$error)', _indent, 1);
					}
					js += print('{', _indent, 1);
					for (var i = 0; i < statement.catchStatements.length; i++)
					{
						upLevel();
						var catchStatement = statement.catchStatements[i];
						var typeName = catchStatement.identifier.type.name;
						if (i == 0 && statement.catchStatements.length == 1)
						{
							if (typeName == 'void' || typeName == 'Error')
							{
								js += translateStatements(catchStatement.bodyStatements, _indent + 1, construct);
							}
							else
							{
								js += print('if ($es4.$$is(' + catchStatement.identifierToken.data + ', ' + getTranslatedTypeName(catchStatement.identifier.type) + '))', _indent + 1, 1);
								js += print('{', _indent + 1, 1);
								js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
								js += print('}', _indent + 1, 1);
							}
							downLevel();
							break;
						}
						if (typeName == 'void' || typeName == 'Error')
						{
							js += print('else', _indent + 1, 1);
							js += print('{', _indent + 1, 1);
							js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
							js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
							js += print('}', _indent + 1, 1);
							downLevel();
							break;
						}
						js += print(((i == 0) ? 'if' : 'else if') + ' ($es4.$$is($$error, ' + typeName + '))', _indent + 1, 1);
						js += print('{', _indent + 1, 1);
						js += print('var ' + catchStatement.identifierToken.data + ' = $$error;', _indent + 2, 1);
						js += translateStatements(catchStatement.bodyStatements, _indent + 2, construct);
						js += print('}', _indent + 1, 1);
						downLevel();
					}
					js += print('}', _indent, 1);
					if (statement.finallyStatement)
					{
						js += print('finally', _indent, 1);
						js += print('{', _indent, 1);
						js += translateStatements(statement.finallyStatement.bodyStatements, _indent + 1, construct);
						js += print('}', _indent, 1);
					}
					break;
				case Construct.UseStatement:
					break;
				case Construct.VarStatement:
					var translateVarValueExpression = function ($$$$statement) 
					{
				//set default parameter values
				var statement = $$$$statement;

						var valueJS = translateExpression(statement.valueExpression, _indent, false, construct);
						var typeString = getTranslatedTypeName(statement.identifier.type);
						if (isCoerceRequired(statement, typeString, valueJS))
						{
							valueJS = '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
						}
						return ' = ' + valueJS;
					}
;
					js += print('var ' + statement.identifierToken.data, _indent, 0);
					if (statement.valueExpression)
					{
						js += translateVarValueExpression(statement);
					}
					for (var i = 0; i < statement.innerVarStatements.length; i++)
					{
						var innerVarStatement = statement.innerVarStatements[i];
						js += ', ' + innerVarStatement.identifierToken.data;
						if (innerVarStatement.valueExpression)
						{
							js += translateVarValueExpression(innerVarStatement);
						}
					}
					if (!inline)
					{
						js += ';\n';
					}
					break;
				case Construct.SwitchStatement:
					js += print('switch (' + translateExpression(statement.valueExpression, _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					for (var i = 0; i < statement.caseStatements.length; i++)
					{
						js += translateStatement(statement.caseStatements[i], _indent + 1, false, construct);
					}
					js += print('}', _indent, 1);
					break;
				case Construct.CaseStatement:
					if (statement.defaultToken)
					{
						js += print('default:', _indent, 1);
					}
					else
					{
						js += print('case ' + translateExpression(statement.valueExpression, _indent, false, construct) + ':', _indent, 1);
					}
					js += translateStatements(statement.bodyStatements, _indent + 1, construct);
					break;
				case Construct.LabelStatement:
					js += print(statement.identifierToken.data + ':', _indent, 0);
					break;
				default:
					if (inline)
					{
						js += print(translateExpression(statement, _indent, false, construct), _indent, 0);
					}
					else
					{
						js += print(translateExpression(statement, _indent, false, construct) + ';', _indent, 1);
					}
			}
			return js;
		}
;

		function translateExpression($$$$expression, $$$$_indent, $$$$toString, $$$$construct, $$$$operator, $$$$expressionString) 
		{
			//set default parameter values
			var expression = $$$$expression;
			var _indent = $$$$_indent;
			var toString = $$$$toString;
			var construct = $$$$construct;
			var operator = (4 > arguments.length - 1) ? null : $$$$operator;
			var expressionString = (5 > arguments.length - 1) ? null : $$$$expressionString;

			if (!construct)
			{
				throw $es4.$$primitive(new Error('construct null in translate expression'));
			}
			if (!_indent)
			{
				_indent = 0;
			}
			var js = '';
			outerSwitch:			switch (expression.constructor)
			{
				case Construct.ParenExpression:
					js += '(' + translateExpression(expression.expression, _indent, toString, construct, operator, expressionString) + ')';
					break;
				case Construct.PropertyExpression:
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
					}
					else
					{
						js += translatePropertyExpression(expression, toString, construct);
					}
					break;
				case Construct.NumberExpression:
					js += expression.numberToken.data;
					break;
				case Construct.StringExpression:
					if (toString && expression.stringToken.data == "'")
					{
						js += '\\' + expression.stringToken.data;
					}
					else
					{
						js += expression.stringToken.data;
					}
					for (var i = 0; i < expression.stringChunkTokens.length; i++)
					{
						js += expression.stringChunkTokens[i].data;
						if (i + 1 < expression.stringChunkTokens.length)
						{
							js += '\n';
						}
					}
					if (toString && expression.stringToken.data == "'")
					{
						js += '\\' + expression.stringToken.data;
					}
					else
					{
						js += expression.stringToken.data;
					}
					break;
				case Construct.ReturnExpression:
					js += 'return';
					if (expression.expression)
					{
						var typeName = getTranslatedTypeName(expression.expectedType);
						var valueJS = translateExpression(expression.expression, 0, toString, construct);
						if (typeName && isCoerceRequired(expression, typeName, valueJS))
						{
							js += ' $es4.$$coerce(' + valueJS + ', ' + typeName + ')';
						}
						else
						{
							js += ' ' + valueJS;
						}
					}
					break;
				case Construct.DeleteExpression:
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic(expression.expression, toString, undefined, undefined, construct, true);
					}
					else
					{
						js += 'delete ' + translateExpression(expression.expression, 0, toString, construct);
					}
					break;
				case Construct.FunctionExpression:
					upLevel();
					var wasInClosure = _inClosure;
					_inClosure = true;
					if (!expression.identifierToken)
					{
						js += print('function (', 0, 0);
					}
					else
					{
						if (_inIfStatement)
						{
							throw $es4.$$primitive(new Error('support for named closures in if/elseif/else statements is not supported at this time.'));
						}
						js += print('function ' + expression.identifierToken.data + '(', 0, 0);
					}
					js += translateParameters(expression, construct);
					js += print(') ', 0, 1);
					js += print('{', _indent, 1);
					js += translateDefaultParameterValues(expression, construct);
					js += translateStatements(expression.bodyStatements, _indent + 1, construct);
					js += print('}', _indent, 1);
					if (!wasInClosure)
					{
						_inClosure = false;
					}
					downLevel();
					break;
				case Construct.ObjectExpression:
					js += '{';
					for (var i = 0; i < expression.objectPropertyConstructs.length; i++)
					{
						var prop;
						if (expression.objectPropertyConstructs[i].expression.constructor == Construct.PropertyExpression)
						{
							prop = expression.objectPropertyConstructs[i].expression.construct.identifierToken.data;
						}
						else
						{
							prop = translateExpression(expression.objectPropertyConstructs[i].expression, 0, toString, construct);
						}
						js += prop + ':' + translateExpression(expression.objectPropertyConstructs[i].valueExpression, 0, toString, construct);
						if ((i + 1) < expression.objectPropertyConstructs.length)
						{
							js += ', ';
						}
					}
					js += '}';
					break;
				case Construct.ArrayExpression:
					js += '[';
					for (var i = 0; i < expression.valueExpressions.length; i++)
					{
						if (!expression.valueExpressions[i])
						{
							trace('invalid 20');
						}
						js += translateExpression(expression.valueExpressions[i], 0, toString, construct);
						if ((i + 1) < expression.valueExpressions.length)
						{
							js += ', ';
						}
					}
					js += ']';
					break;
				case Construct.BooleanExpression:
					js += expression.booleanToken.data;
					break;
				case Construct.Expression:
					if (expression.token.type == Token.TypeofTokenType)
					{
						if (!expression.expression)
						{
							trace('invalid 21');
						}
						js += '$es4.$$typeof(' + translateExpression(expression.expression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.VoidTokenType)
					{
						if (expression.expression.constructor == Construct.EmptyExpression)
						{
							js += 'void 0';
						}
						else
						{
							if (!expression.expression)
							{
								trace('invalid 01');
							}
							js += 'void ' + translateExpression(expression.expression, 0, toString, construct);
						}
						break;
					}
					js += expression.token.data;
					if (expression.expression)
					{
						if (!expression.expression)
						{
							trace('invalid 22');
						}
						js += translateExpression(expression.expression, 0, toString, construct);
					}
					break;
				case Construct.XMLExpression:
					js += 'new XML(\'' + expression.string + '\')';
					break;
				case Construct.XMLListExpression:
					js += 'new XMLList(\'' + expression.string + '\')';
					break;
				case Construct.EmptyExpression:
					break;
				case Construct.RegExpression:
					js += expression.string;
					break;
				case Construct.PrefixExpression:
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic(expression.expression, toString, '\'prefix\'', (expression.decrementToken) ? '--' : '++', construct);
					}
					else
					{
						if (!expression.expression)
						{
							trace('invalid 25');
						}
						js += ((expression.decrementToken) ? '--' : '++') + translateExpression(expression.expression, 0, toString, construct);
					}
					break;
				case Construct.PostfixExpression:
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic(expression.expression, toString, '\'postfix\'', (expression.decrementToken) ? '--' : '++', construct);
					}
					else
					{
						if (!expression.expression)
						{
							trace('invalid 26');
						}
						js += translateExpression(expression.expression, 0, toString, construct) + ((expression.decrementToken) ? '--' : '++');
					}
					break;
				case Construct.NewExpression:
					if (_dynamicPropertyAccess)
					{
						if (expression.expression.constructor == Construct.ParenExpression)
						{
							if (!expression.expression)
							{
								trace('invalid 02');
							}
							js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
						}
						else
						{
							js += translatePropertyExpressionDynamic(expression.expression, toString, null, null, construct, null, true);
						}
					}
					else
					{
						if (!expression.expression)
						{
							trace('invalid 03');
						}
						js += '$es4.$$primitive(new ' + translateExpression(expression.expression, 0, toString, construct) + ')';
					}
					break;
				case Construct.BinaryExpression:
					if (expression.token.type == Token.IsTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 04');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 05');
						}
						js += '$es4.$$is(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.InstanceofTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 06');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 07');
						}
						js += '$es4.$$instanceof(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					if (expression.token.type == Token.AsTokenType)
					{
						if (!expression.leftExpression)
						{
							trace('invalid 08');
						}
						if (!expression.rightExpression)
						{
							trace('invalid 09');
						}
						js += '$es4.$$as(' + translateExpression(expression.leftExpression, 0, toString, construct) + ', ' + translateExpression(expression.rightExpression, 0, toString, construct) + ')';
						break;
					}
					innerSwitch:					switch (expression.token.type)
					{
						case Token.BitwiseLeftShiftAssignmentTokenType:
						case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
						case Token.BitwiseRightShiftAssignmentTokenType:
						case Token.AddWithAssignmentTokenType:
						case Token.DivWithAssignmentTokenType:
						case Token.ModWithAssignmentTokenType:
						case Token.MulWithAssignmentTokenType:
						case Token.SubWithAssignmentTokenType:
						case Token.AssignmentTokenType:
						case Token.AndWithAssignmentTokenType:
						case Token.OrWithAssignmentTokenType:
						case Token.BitwiseAndAssignmentTokenType:
						case Token.BitwiseOrAssignmentTokenType:
						case Token.BitwiseXorAssignmentTokenType:
							var leftExpression = expression.leftExpression;
							while (leftExpression.constructor == Construct.ParenExpression)
							{
								leftExpression = leftExpression.expression;
							}
							var innerOperator = expression.token.data;
							var innerExpressionString = '';
							while (leftExpression.constructor == Construct.BinaryExpression)
							{
								expression.leftExpression = leftExpression.rightExpression;
								if (!innerExpressionString)
								{
									if (!expression)
									{
										trace('invalid 10');
									}
									innerExpressionString = translateExpression(expression, _indent, toString, construct);
								}
								else
								{
									if (!expression.leftExpression)
									{
										trace('invalid 11');
									}
									if (_dynamicPropertyAccess)
									{
										innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct, innerOperator, innerExpressionString);
									}
									else
									{
										innerExpressionString = translateExpression(expression.leftExpression, _indent, toString, construct) + ' ' + innerOperator + ' ' + innerExpressionString;
									}
								}
								expression = leftExpression;
								innerOperator = expression.token.data;
								leftExpression = expression.leftExpression;
							}
							var typeString;
							if (!leftExpression.nextPropertyExpression && leftExpression.construct && leftExpression.construct.constructor == Construct.IdentifierConstruct)
							{
								var identifier = leftExpression.construct.identifier;
								typeString = (identifier.isVar && identifier.type) ? getTranslatedTypeName(identifier.type) : '';
							}
							if (_dynamicPropertyAccess)
							{
								if (!innerExpressionString)
								{
									if (!expression.rightExpression)
									{
										trace('invalid 12');
									}
									innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
								}
								if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
								{
									js += translatePropertyExpressionDynamic(leftExpression, toString, '$es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')', innerOperator, construct);
								}
								else
								{
									js += translatePropertyExpressionDynamic(leftExpression, toString, innerExpressionString, innerOperator, construct);
								}
							}
							else
							{
								if (!expression.leftExpression)
								{
									trace('invalid 13');
								}
								js += translateExpression(leftExpression, 0, toString, construct);
								if (!innerExpressionString)
								{
									if (!expression.rightExpression)
									{
										trace('invalid 14');
									}
									innerExpressionString = translateExpression(expression.rightExpression, 0, toString, construct);
								}
								if (typeString && isCoerceRequired(leftExpression, typeString, innerExpressionString))
								{
									js += ' ' + innerOperator + ' $es4.$$coerce(' + innerExpressionString + ', ' + typeString + ')';
								}
								else
								{
									js += ' ' + innerOperator + ' ' + innerExpressionString;
								}
							}
							break outerSwitch;
					}
					if (!expression.leftExpression)
					{
						trace('invalid 15');
					}
					if (!expression.rightExpression)
					{
						trace('invalid 16');
					}
					js += translateExpression(expression.leftExpression, 0, toString, construct) + ' ' + expression.token.data + ' ' + translateExpression(expression.rightExpression, 0, toString, construct);
					break;
				case Construct.TernaryExpression:
					if (!expression.trueExpression)
					{
						trace('invalid 34');
					}
					if (!expression.conditionExpression)
					{
						trace('invalid 35');
					}
					if (!expression.falseExpression)
					{
						trace('invalid 36');
					}
					js += translateExpression(expression.conditionExpression, 0, toString, construct) + ' ? ' + translateExpression(expression.trueExpression, 0, toString, construct) + ' : ' + translateExpression(expression.falseExpression, 0, toString, construct);
					break;
				default:
					throw $es4.$$primitive(new Error('Unexpected expression found: ' + expression.constructor));
			}
			return js;
		}
;

		function translatePropertyExpression($$$$expression, $$$$toString, $$$$construct) 
		{
			//set default parameter values
			var expression = $$$$expression;
			var toString = $$$$toString;
			var construct = $$$$construct;

			var js = '';
			if (!expression.construct)
			{
				throw $es4.$$primitive(new Error('invalid expression passed to translatePropertyExpression: ' + expression.constructor));
			}
			var identifier;
			var namespaceIdentifier;
			switch (expression.construct.constructor)
			{
				case Construct.SuperConstruct:
				case Construct.ThisConstruct:
				case Construct.IdentifierConstruct:
					identifier = expression.construct.identifier;
					break;
				case Construct.ParenConstruct:
				case Construct.ArrayConstruct:
				case Construct.ObjectConstruct:
					break;
				case Construct.NamespaceQualifierConstruct:
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					identifier = expression.construct.identifier;
					break;
				default:
					throw $es4.$$primitive(new Error('unknown inner property expression: ' + expression.construct.constructor));
			}
			var pname;
			var name;
			if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom)
			{
				namespaceIdentifier = identifier.namespaceObj.identifier;
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = (namespaceIdentifier.isStatic) ? namespaceIdentifier.scope.name : '$$this';
				var namespaceObj = namespaceIdentifier.namespaceObj;
				var namespaceString = namespaceObj.normalizedImportID;
				if (namespaceIdentifier.isStatic && !namespaceString)
				{
					namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
				}
				else if (!namespaceString)
				{
					namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? '$$thisp.' : '$$this.') + namespaceIdentifier.name;
				}
				pname += '.$$namespace(' + namespaceString + ')';
				name = identifier.name;
			}
			else if (identifier)
			{
				name = identifier.name;
				if (identifier.isStatic && !identifier.isImport && !identifier.isNative)
				{
					pname = identifier.scope.name;
				}
				else if (identifier.isPrivate && !identifier.isImport)
				{
					pname = '$$thisp';
				}
				else if ((identifier.isProperty || identifier.isMethod) && !identifier.isImport)
				{
					pname = '$$this';
				}
				else if (identifier.isPackage)
				{
					name = '$es4.$$[\'' + identifier.name;
					var packageName = identifier.name;
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = tempInnerExpression.nextPropertyExpression)
					{
						if (_rootConstructs[packageName + '.' + tempInnerExpression.construct.identifierToken.data])
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + tempInnerExpression.construct.identifierToken.data;
						name += '.' + tempInnerExpression.construct.identifierToken.data;
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				if (name == 'super')
				{
					if (_inNamespacedFunction && expression.nextPropertyExpression)
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = (expression.nextPropertyExpression) ? '$es4.$$super($$thisp)' : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					name = '$$this';
				}
			}
			else
			{
				if (!expression.construct.expression)
				{
					trace('invalid 37');
				}
				name = translateExpression(expression.construct.expression, 0, toString, construct);
			}
			js += (!pname) ? name : (pname + '.' + name);
			while (expression = expression.nextPropertyExpression)
			{
				if (expression.construct.constructor == Construct.DotConstruct || expression.construct.constructor == Construct.IdentifierConstruct)
				{
					if (expression.construct.constructor == Construct.DotConstruct)
					{
						js += '.';
					}
					js += expression.construct.identifierToken.data;
				}
				else if (expression.construct.constructor == Construct.ArrayAccessorConstruct)
				{
					if (!expression.construct.expression)
					{
						trace('invalid 38');
					}
					js += '[' + translateExpression(expression.construct.expression, 0, toString, construct) + ']';
				}
				else if (expression.construct.constructor == Construct.NamespaceQualifierConstruct)
				{
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					var namespaceObj = namespaceIdentifier.namespaceObj;
					var namespaceString = namespaceObj.normalizedImportID;
					if (namespaceIdentifier.isStatic && !namespaceString)
					{
						namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
					}
					else if (!namespaceString)
					{
						namespaceString = (identifier.isPrivate) ? '$$thisp.' + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;
					}
					js += '.$$namespace(' + namespaceString + ').' + expression.construct.namespaceIdentifierToken.data;
				}
				else if (expression.construct.constructor == Construct.ParenConstruct)
				{
					if (!expression.construct.expression)
					{
						trace('invalid 39');
					}
					js += '(' + translateExpression(expression.construct.expression, 0, toString, construct) + ')';
				}
				else if (expression.construct.constructor == Construct.AtIdentifierConstruct)
				{
					throw $es4.$$primitive(new Error('E4X is not supported'));
				}
				if (expression.construct.constructor == Construct.FunctionCallConstruct || (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
				{
					var functionCallExpression = (expression.construct.constructor == Construct.FunctionCallConstruct) ? expression : expression.nextPropertyExpression;
					if (js == '$es4.$$super($$thisp)')
					{
						js += '.$$z';
					}
					js += '(';
					for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
					{
						if (!functionCallExpression.construct.argumentExpressions[i])
						{
							trace('invalid 40');
						}
						js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
						if ((i + 1) < functionCallExpression.construct.argumentExpressions.length)
						{
							js += ', ';
						}
					}
					js += ')';
					if (expression.nextPropertyExpression)
					{
						expression = functionCallExpression;
					}
					continue;
				}
			}
			return js;
		}
;

		function translatePropertyExpressionDynamic($$$$expression, $$$$toString, $$$$setString, $$$$operator, $$$$construct, $$$$doDelete, $$$$doNew) 
		{
			//set default parameter values
			var expression = $$$$expression;
			var toString = $$$$toString;
			var setString = $$$$setString;
			var operator = $$$$operator;
			var construct = $$$$construct;
			var doDelete = (5 > arguments.length - 1) ? null : $$$$doDelete;
			var doNew = (6 > arguments.length - 1) ? null : $$$$doNew;

			var js = '';
			if (expression.constructor == Construct.DeleteExpression)
			{
				return translatePropertyExpressionDynamic(expression.expression, toString, setString, operator, construct, true, doNew);
			}
			if (expression.constructor == Construct.NewExpression)
			{
				return translatePropertyExpressionDynamic(expression.expression, toString, setString, operator, construct, doDelete, true);
			}
			if (!expression.construct)
			{
				throw $es4.$$primitive(new Error('invalid expression passed to translatePropertyExpression: ' + expression.constructor));
			}
			var identifier;
			var namespaceIdentifier;
			switch (expression.construct.constructor)
			{
				case Construct.SuperConstruct:
				case Construct.ThisConstruct:
				case Construct.IdentifierConstruct:
					identifier = expression.construct.identifier;
					break;
				case Construct.ParenConstruct:
				case Construct.ArrayConstruct:
				case Construct.ObjectConstruct:
					break;
				case Construct.NamespaceQualifierConstruct:
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					identifier = expression.construct.identifier;
					break;
				default:
					throw $es4.$$primitive(new Error('unknown inner property expression: ' + expression.construct.constructor));
			}
			var pname;
			var name;
			var isUseNamespace = false;
			if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom)
			{
				isUseNamespace = namespaceIdentifier = identifier.namespaceObj.identifier;
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = (namespaceIdentifier.isStatic) ? namespaceIdentifier.scope.name : '$$this';
				var namespaceObj = namespaceIdentifier.namespaceObj;
				var namespaceString = namespaceObj.normalizedImportID;
				if (namespaceIdentifier.isStatic && !namespaceString)
				{
					namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
				}
				else if (!namespaceString)
				{
					namespaceString = (namespaceIdentifier.namespaceObj && namespaceIdentifier.namespaceObj.isPrivate ? '$$thisp.' : '$$this.') + namespaceIdentifier.name;
				}
				if (isUseNamespace)
				{
					pname += '.$$namespace(' + namespaceString + ')';
				}
				name = identifier.name;
			}
			else if (identifier)
			{
				name = identifier.name;
				if (identifier.isStatic && !identifier.isImport && !identifier.isNative)
				{
					pname = identifier.scope.name;
				}
				else if (identifier.isPrivate && !identifier.isImport)
				{
					pname = '$$thisp';
				}
				else if ((identifier.isProperty || identifier.isMethod) && !identifier.isImport)
				{
					pname = '$$this';
				}
				else if (identifier.isPackage)
				{
					name = '$es4.$$[\'' + identifier.name;
					var packageName = identifier.name;
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = tempInnerExpression.nextPropertyExpression)
					{
						if (_rootConstructs[packageName + '.' + tempInnerExpression.construct.identifierToken.data])
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + tempInnerExpression.construct.identifierToken.data;
						name += '.' + tempInnerExpression.construct.identifierToken.data;
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				if (name == 'super')
				{
					if (_inNamespacedFunction && expression.nextPropertyExpression)
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = (expression.nextPropertyExpression) ? '$es4.$$super($$thisp)' : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					name = '$$this';
				}
			}
			else
			{
				name = translateExpression(expression.construct.expression, 0, toString, construct);
			}
			var state = {doAssignment:setString != null, doDelete:doDelete, doNew:doNew, doPostfix:setString == '\'postfix\'', doPrefix:setString == '\'prefix\''};
			var propListCount = (pname) ? 2 : 1;
			var accessString = '$es4.$$get';
			if (pname)
			{
				if (_inStaticFunction)
				{
					js += accessString + '(' + pname + ', null, null';
				}
				else
				{
					js += accessString + '(' + pname + ', $$this, $$thisp';
				}
			}
			else
			{
				expression = expression.nextPropertyExpression;
				js += name;
			}
			var lastAccessTypeWasArrayAccessor = false;
			var closed = false;
			while (expression)
			{
				var expressionConstruct = expression.construct;
				var expressionConstructor = expressionConstruct.constructor;
				if (expressionConstructor == Construct.DotConstruct || expressionConstructor == Construct.IdentifierConstruct || expressionConstructor == Construct.ArrayAccessorConstruct || expressionConstructor == Construct.NamespaceQualifierConstruct || expression.construct.constructor == Construct.AtIdentifierConstruct)
				{
					propListCount++;
					if (!pname || closed)
					{
						if (_inStaticFunction)
						{
							js = accessString + '(' + js + ', null, null';
						}
						else
						{
							js = accessString + '(' + js + ', $$this, $$thisp';
						}
						closed = false;
						pname = js;
					}
				}
				if (expressionConstructor == Construct.DotConstruct || expressionConstructor == Construct.IdentifierConstruct)
				{
					js += ', \'' + expressionConstruct.identifierToken.data + '\'';
					lastAccessTypeWasArrayAccessor = false;
				}
				else if (expressionConstructor == Construct.ArrayAccessorConstruct)
				{
					js += ', ' + translateExpression(expression.construct.expression, 0, toString, construct);
					lastAccessTypeWasArrayAccessor = true;
				}
				else if (expressionConstructor == Construct.NamespaceQualifierConstruct)
				{
					namespaceIdentifier = expression.construct.namespaceIdentifier;
					var namespaceObj = namespaceIdentifier.namespaceObj;
					var namespaceString = namespaceObj.normalizedImportID;
					if (namespaceIdentifier.isStatic && !namespaceString)
					{
						namespaceString = namespaceIdentifier.scope.name + '.' + namespaceIdentifier.name;
					}
					else if (!namespaceString)
					{
						namespaceString = (identifier.isPrivate) ? '$$thisp.' + namespaceIdentifier.name : '$$this.' + namespaceIdentifier.name;
					}
					if (_inStaticFunction)
					{
						js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), null, null, \'' + expressionConstruct.namespaceIdentifierToken.data + '\'';
					}
					else
					{
						js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), $$this, $$thisp, \'' + expressionConstruct.namespaceIdentifierToken.data + '\'';
					}
					propListCount = 2;
				}
				else if (expression.construct.constructor == Construct.ParenConstruct)
				{
					throw $es4.$$primitive(new Error('check translator.js for this error.'));
				}
				else if (expression.construct.constructor == Construct.AtIdentifierConstruct)
				{
					js += ', \'$$attributes\'';
					lastAccessTypeWasArrayAccessor = false;
				}
				if (expression.construct.constructor == Construct.FunctionCallConstruct || (expression.nextPropertyExpression && expression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
				{
					var functionCallExpression = (expression.construct.constructor == Construct.FunctionCallConstruct) ? expression : expression.nextPropertyExpression;
					if (js == '$es4.$$super($$thisp)')
					{
						js += '.$$z';
					}
					var start = null;
					if (propListCount == 1)
					{
						if (state.doNew)
						{
							if (functionCallExpression.construct.argumentExpressions.length)
							{
								js = '$es4.$$primitive(new (' + js + ')(';
							}
							else
							{
								js = '$es4.$$primitive(new (' + js + ')(';
							}
						}
						else
						{
							js += '(';
						}
					}
					else
					{
						if (state.doNew)
						{
							js = '$es4.$$primitive(new (' + js + '))(';
						}
						else
						{
							if (!lastAccessTypeWasArrayAccessor)
							{
								start = js.substring(10);
								js = '$es4.$$call' + start;
								if (functionCallExpression.construct.argumentExpressions.length)
								{
									js += ', [';
								}
							}
							else
							{
								js += ')(';
							}
						}
						closed = true;
						propListCount = 2;
					}
					for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
					{
						js += translateExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
						if ((i + 1) < functionCallExpression.construct.argumentExpressions.length)
						{
							js += ', ';
						}
					}
					if (state.doNew)
					{
						js += ')';
					}
					state.doNew = false;
					if (start && functionCallExpression.construct.argumentExpressions.length)
					{
						js += '])';
					}
					else if (start)
					{
						js += ', $es4.$$EMPTY_ARRAY)';
					}
					else
					{
						js += ')';
					}
					if (expression.nextPropertyExpression)
					{
						expression = functionCallExpression;
					}
				}
				expression = expression.nextPropertyExpression;
			}
			if (!pname)
			{
				if (!state.doPostfix && !state.doPrefix)
				{
					if (state.doAssignment && operator == '||=' || operator == '&&=')
					{
						js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
					}
					else if (state.doAssignment)
					{
						js += ' ' + operator + ' ' + setString;
					}
				}
				else if (state.doPrefix)
				{
					js = operator + js;
				}
				else if (state.doPostfix)
				{
					js += operator;
				}
				if (state.doDelete)
				{
					js = 'delete ' + js;
				}
				if (state.doNew)
				{
					js = '$es4.$$primitive(new (' + js + '()))';
				}
			}
			else
			{
				if (state.doAssignment)
				{
					js = '$es4.$$set' + js.slice(10);
					js += ', ' + setString + ', \'' + operator + '\'';
				}
				else if (state.doDelete)
				{
					js = '$es4.$$delete' + js.slice(10);
				}
				if (!closed)
				{
					js += ')';
				}
			}
			return js;
		}
;

		function isCoerceRequired($$$$statementOrExpression, $$$$typeName, $$$$valueJS) 
		{
			//set default parameter values
			var statementOrExpression = $$$$statementOrExpression;
			var typeName = $$$$typeName;
			var valueJS = $$$$valueJS;

			if (!statementOrExpression.coerce)
			{
				return false;
			}
			switch (typeName)
			{
				case 'uint':
					if (Number(valueJS) == (valueJS >>> 0))
					{
						return false;
					}
					break;
				case 'int':
					if (Number(valueJS) == (valueJS >> 0))
					{
						return false;
					}
					break;
			}
			return true;
		}
;

		function print($$$$string, $$$$tabs, $$$$newlines, $$$$preNewLines) 
		{
			//set default parameter values
			var string = $$$$string;
			var tabs = $$$$tabs;
			var newlines = $$$$newlines;
			var preNewLines = (3 > arguments.length - 1) ? null : $$$$preNewLines;

			if (tabs)
			{
				for (var i = 0; i < tabs; i++)
				{
					string = '\t' + string;
				}
			}
			if (newlines)
			{
				for (var i = 0; i < newlines; i++)
				{
					string += '\n';
				}
			}
			if (preNewLines)
			{
				for (var i = 0; i < preNewLines; i++)
				{
					string = '\n' + string;
				}
			}
			return string;
		}
;
	});
	function TranslatorProto()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof TranslatorProto) || $$this.$$TranslatorProto !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TranslatorProto) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			TranslatorProto.$$construct($$this, $$args);
		}
	}

	//construct
	TranslatorProto.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (TranslatorProto.$$cinit !== undefined) TranslatorProto.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$TranslatorProto', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		TranslatorProto.$$iinit($$this);

		//call constructor
		if (args !== undefined) TranslatorProto.$$constructor.apply($$this, args);
	});

	//initializer
	TranslatorProto.$$iinit = (function ($$this)
	{
	});

	//constructor
	TranslatorProto.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(TranslatorProto, null, 'sweetrush.core::TranslatorProto');
})();
//sweetrush.core.TranslatorProto


//sweetrush.core.Analyzer
$es4.$$package('sweetrush.core').Analyzer = (function ()
{
	//imports
	var Construct;
	var Token;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//properties
	var $$j = {};
	Object.defineProperty(Analyzer, 'globalIdentifiers', {
	get:function () { if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit(); return $$j.globalIdentifiers; },
	set:function (value) { if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit(); $$j.globalIdentifiers = $es4.$$coerce(value, Array); }
	});

	Object.defineProperty(Analyzer, '_globals', {
	get:function () { if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit(); return $$j._globals; },
	set:function (value) { if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit(); $$j._globals = $es4.$$coerce(value, Object); }
	});


	//class pre initializer
	Analyzer.$$sinit = (function ()
	{
		Analyzer.$$sinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		Parser = $es4.$$['sweetrush.core'].Parser;

		//set prototype and constructor
		Analyzer.prototype = Object.create(Object.prototype);
		Object.defineProperty(Analyzer.prototype, "constructor", { value: Analyzer, enumerable: false });

		//hold private values
		Object.defineProperty(Analyzer.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(Analyzer.prototype, 'analyze', {
		get:function ()
		{
			var $$this = this;

			function analyze($$$$rootConstruct, $$$$rootConstructs, $$$$translationMode, $$$$doNotTreatPrivateMethodsAsNative, $$$$treatThisAsDynamic)
			{
				//set default parameter values
				var rootConstruct = $$$$rootConstruct;
				var rootConstructs = $$$$rootConstructs;
				var translationMode = $es4.$$coerce($$$$translationMode, Number);
				var doNotTreatPrivateMethodsAsNative = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$doNotTreatPrivateMethodsAsNative, Boolean);
				var treatThisAsDynamic = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$treatThisAsDynamic, Boolean);

				$$this.$$Analyzer._rootConstruct = rootConstruct;
				$$this.$$Analyzer._rootConstructs = rootConstructs;
				$$this.$$Analyzer._translationMode = translationMode;
				$$this.$$Analyzer._treatThisAsDynamic = treatThisAsDynamic;
				$$this.$$Analyzer._doNotTreatPrivateMethodsAsNative = (translationMode == 1 || translationMode == 3) || doNotTreatPrivateMethodsAsNative;
				$$this.$$Analyzer.registerNamespace('public');
				$$this.$$Analyzer.registerNamespace('private');
				$$this.$$Analyzer.registerNamespace('protected');
				$$this.$$Analyzer.registerNamespace('internal');
				$$this.$$Analyzer.registerType('void', null, null, true);
				$$this.$$Analyzer.registerType('*', null, null, true);
				$$this.$$Analyzer.registerType('PACKAGE', null, null, true);
				for (var name in $$this.$$Analyzer._rootConstructs)
				{
					var construct = $$this.$$Analyzer._rootConstructs[name];
					if (!construct.packageConstruct)
					{
						continue;
					}
					if (construct.packageConstruct.classConstruct)
					{
						$$this.$$Analyzer.registerType(name, construct, construct.packageConstruct.classConstruct, Analyzer._globals[name]);
					}
					if (construct.packageConstruct.interfaceConstruct)
					{
						$$this.$$Analyzer.registerType(name, construct, construct.packageConstruct.interfaceConstruct, Analyzer._globals[name]);
					}
				}
				for (var i = 0; i < Analyzer.globalIdentifiers.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier(Analyzer.globalIdentifiers[i].name);
				}
				var packageConstruct = $$this.$$Analyzer._rootConstruct.packageConstruct;
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.classConstructs.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier($$this.$$Analyzer._rootConstruct.classConstructs[i], $$this.$$Analyzer._rootConstruct.classConstructs[i]);
				}
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.interfaceConstructs.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier($$this.$$Analyzer._rootConstruct.interfaceConstructs[i], $$this.$$Analyzer._rootConstruct.interfaceConstructs[i]);
				}
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.propertyConstructs.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier($$this.$$Analyzer._rootConstruct.propertyConstructs[i], $$this.$$Analyzer._rootConstruct.propertyConstructs[i]);
				}
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.methodConstructs.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier($$this.$$Analyzer._rootConstruct.methodConstructs[i], $$this.$$Analyzer._rootConstruct.methodConstructs[i]);
				}
				for (var i = 0; i < packageConstruct.useConstructs.length; i++)
				{
					$$this.$$Analyzer.registerUseNamespace(packageConstruct.useConstructs[i]);
				}
				if (packageConstruct.classConstruct != null && packageConstruct.classConstruct.UNIMPLEMENTEDToken == null)
				{
					$$this.$$Analyzer.analyzeClassConstruct(packageConstruct.classConstruct);
				}
				if (packageConstruct.interfaceConstruct != null && packageConstruct.interfaceConstruct.UNIMPLEMENTEDToken == null)
				{
					$$this.$$Analyzer.analyzeInterfaceConstruct(packageConstruct.interfaceConstruct);
				}
				if (packageConstruct.methodConstruct != null && packageConstruct.methodConstruct.UNIMPLEMENTEDToken == null)
				{
					$$this.$$Analyzer.analyzeFunctionConstruct(packageConstruct.methodConstruct);
				}
				if (packageConstruct.propertyConstruct != null)
				{
					$$this.$$Analyzer.analyzePropertyConstruct(packageConstruct.propertyConstruct);
				}
				return $$this.$$Analyzer._rootConstruct;
			}

			return $$this.$$Analyzer.$$analyze || ($$this.$$Analyzer.$$analyze = analyze);
		}});


		//private instance method
		Analyzer.prototype.$$v.upLevel = {
		get:function ()
		{
			var $$this = this.$$this;

			function upLevel()
			{
				$$this.$$Analyzer._indent++;
				$$this.$$Analyzer._level++;
				$$this.$$Analyzer._identifiers[$$this.$$Analyzer._level] = {};
				$$this.$$Analyzer._namespaces[$$this.$$Analyzer._level] = {};
				$$this.$$Analyzer._useNamespaces[$$this.$$Analyzer._level] = [];
				return $$this.$$Analyzer._level;
			}

			return $$this.$$Analyzer.$$p.$$upLevel || ($$this.$$Analyzer.$$p.$$upLevel = upLevel);
		}};


		//private instance method
		Analyzer.prototype.$$v.downLevel = {
		get:function ()
		{
			var $$this = this.$$this;

			function downLevel()
			{
				delete $$this.$$Analyzer._identifiers[$$this.$$Analyzer._level];
				delete $$this.$$Analyzer._namespaces[$$this.$$Analyzer._level];
				delete $$this.$$Analyzer._useNamespaces[$$this.$$Analyzer._level];
				$$this.$$Analyzer._indent--;
				$$this.$$Analyzer._level--;
				return $$this.$$Analyzer._level;
			}

			return $$this.$$Analyzer.$$p.$$downLevel || ($$this.$$Analyzer.$$p.$$downLevel = downLevel);
		}};


		//private instance method
		Analyzer.prototype.$$v.output = {
		get:function ()
		{
			var $$this = this.$$this;

			function output()
			{
				trace('outputing...');
				var level = $$this.$$Analyzer._level;
				while (level >= 0)
				{
					trace('level: ' + level);
					for (var name in $$this.$$Analyzer._namespaces[level])
					{
						trace('\t' + $$this.$$Analyzer._namespaces[level][name] + '\t\t\t [[[' + name.substring(1) + ']]]');
					}
					for (var name in $$this.$$Analyzer._identifiers[level])
					{
						trace('\t' + $$this.$$Analyzer._identifiers[level][name] + '\t\t\t [[[' + name.substring(1) + ']]]');
					}
					level--;
				}
				for (var name in $$this.$$Analyzer._types)
				{
					trace('\t' + $$this.$$Analyzer._types[name] + '\t\t\t [[[' + name.substring(1) + ']]]');
				}
				for (var i = 0; i < $$this.$$Analyzer.getUseNamespaces().length; i++)
				{
					trace('UseNamespace: ' + $$this.$$Analyzer.getUseNamespaces()[i]);
				}
			}

			return $$this.$$Analyzer.$$p.$$output || ($$this.$$Analyzer.$$p.$$output = output);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupConstructInRootConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupConstructInRootConstruct($$$$rootConstruct, $$$$object)
			{
				//set default parameter values
				var rootConstruct = $$$$rootConstruct;
				var object = $$$$object;

				if (!rootConstruct || !object)
				{
					$$this.$$Analyzer.output();
					throw $es4.$$primitive(new Error('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
				}
				else if ($es4.$$is(object, String))
				{
					for (var i = 0; i < rootConstruct.classConstructs.length; i++)
					{
						if (rootConstruct.classConstructs[i].identifierToken.data == object)
						{
							return rootConstruct.classConstructs[i];
						}
					}
					for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++)
					{
						if (rootConstruct.interfaceConstructs[i].identifierToken.data == object)
						{
							return rootConstruct.interfaceConstructs[i];
						}
					}
					if (rootConstruct.packageConstruct.classConstruct)
					{
						return rootConstruct.packageConstruct.classConstruct;
					}
					if (rootConstruct.packageConstruct.interfaceConstruct)
					{
						return rootConstruct.packageConstruct.interfaceConstruct;
					}
					if (rootConstruct.packageConstruct.propertyConstruct)
					{
						return rootConstruct.packageConstruct.propertyConstruct;
					}
					if (rootConstruct.packageConstruct.methodConstruct)
					{
						return rootConstruct.packageConstruct.methodConstruct;
					}
					throw $es4.$$primitive(new Error('could not lookup construct in construct: ' + object));
				}
				if (object.constructor == Construct.NameConstruct)
				{
					return $$this.$$Analyzer.lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object));
				}
				else if (object.constructor == Construct.ImportConstruct)
				{
					return $$this.$$Analyzer.lookupConstructInRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));
				}
			}

			return $$this.$$Analyzer.$$p.$$lookupConstructInRootConstruct || ($$this.$$Analyzer.$$p.$$lookupConstructInRootConstruct = lookupConstructInRootConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupRootConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupRootConstruct($$$$rootConstruct, $$$$object)
			{
				//set default parameter values
				var rootConstruct = $$$$rootConstruct;
				var object = $$$$object;

				if (!rootConstruct || !object)
				{
					throw $es4.$$primitive(new Error('cannot find empty rootConstruct/object: ' + rootConstruct + ', ' + object));
				}
				else if ($es4.$$is(object, String))
				{
					for (var i = 0; i < rootConstruct.classConstructs.length; i++)
					{
						if (rootConstruct.classConstructs[i].identifierToken.data == object)
						{
							return rootConstruct;
						}
					}
					for (var i = 0; i < rootConstruct.interfaceConstructs.length; i++)
					{
						if (rootConstruct.interfaceConstructs[i].identifierToken.data == object)
						{
							return rootConstruct;
						}
					}
					var rootConstructs = $$this.$$Analyzer._rootConstructs;
					if (rootConstructs[object])
					{
						return rootConstructs[object];
					}
					throw $es4.$$primitive(new Error('could not lookup root construct: ' + object));
				}
				else if (object.constructor == Construct.ImportConstruct)
				{
					return $$this.$$Analyzer.lookupRootConstruct(rootConstruct, Construct.nameConstructToString(object.nameConstruct));
				}
				throw $es4.$$primitive(new Error('unknown object passed into lookupRootConstruct: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$lookupRootConstruct || ($$this.$$Analyzer.$$p.$$lookupRootConstruct = lookupRootConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupPackageName = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupPackageName($$$$construct, $$$$object)
			{
				//set default parameter values
				var construct = $$$$construct;
				var object = $$$$object;

				var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(construct, object);
				var parts = fullyQualifiedName.split('.');
				if (parts.length > 1)
				{
					parts.pop();
					return parts.join('.');
				}
				return '';
			}

			return $$this.$$Analyzer.$$p.$$lookupPackageName || ($$this.$$Analyzer.$$p.$$lookupPackageName = lookupPackageName);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupFullyQualifiedName = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupFullyQualifiedName($$$$construct, $$$$object)
			{
				//set default parameter values
				var construct = $$$$construct;
				var object = $$$$object;

				if (!construct || !object)
				{
					throw $es4.$$primitive(new Error('cannot find empty construct/object: ' + construct + ', ' + object));
				}
				else if ($es4.$$is(object, String))
				{
					if (object.split('.').length > 1)
					{
						if ($$this.$$Analyzer._rootConstructs[object])
						{
							return object;
						}
						throw $es4.$$primitive(new Error('could not lookup fully qualified name: ' + object));
					}
					if (construct.identifierToken.data == object)
					{
						if (construct.packageConstruct)
						{
							return Construct.nameConstructToString(construct.packageConstruct.nameConstruct) + '.' + object;
						}
						else
						{
							return object;
						}
					}
					for (var i = 0; i < construct.rootConstruct.classConstructs.length; i++)
					{
						if (construct.rootConstruct.classConstructs[i].identifierToken.data == object)
						{
							return object;
						}
					}
					for (var i = 0; i < construct.rootConstruct.interfaceConstructs.length; i++)
					{
						if (construct.rootConstruct.interfaceConstructs[i].identifierToken.data == object)
						{
							return object;
						}
					}
					var importConstructs = (construct.isInternal) ? construct.rootConstruct.importConstructs : construct.packageConstruct.importConstructs;
					for (var i = 0; i < importConstructs.length; i++)
					{
						var nameConstruct = importConstructs[i].nameConstruct;
						if (nameConstruct.identifierTokens[nameConstruct.identifierTokens.length - 1].data == object)
						{
							if ($$this.$$Analyzer._rootConstructs[Construct.nameConstructToString(nameConstruct)])
							{
								return Construct.nameConstructToString(nameConstruct);
							}
							throw $es4.$$primitive(new Error('could not lookup fully qualified name: ' + object + ', ' + Construct.nameConstructToString(nameConstruct)));
						}
					}
					if (!construct.isInternal)
					{
						var packageName = (construct.packageConstruct.nameConstruct) ? Construct.nameConstructToString(construct.packageConstruct.nameConstruct) : '';
						for (var id in $$this.$$Analyzer._rootConstructs)
						{
							var innerPackageName = ($$this.$$Analyzer._rootConstructs[id].packageConstruct.nameConstruct) ? Construct.nameConstructToString($$this.$$Analyzer._rootConstructs[id].packageConstruct.nameConstruct) : '';
							var name = id.split('.').pop();
							if (packageName == innerPackageName && object == name)
							{
								if ($$this.$$Analyzer._rootConstructs[id])
								{
									return id;
								}
								throw $es4.$$primitive(new Error('could not lookup fully qualified name: ' + object + ', ' + id));
							}
						}
					}
					if ($$this.$$Analyzer._types.hasOwnProperty('_' + object))
					{
						return object;
					}
					$$this.$$Analyzer.output();
					throw $es4.$$primitive(new Error('could not lookup fully qualified name: ' + object + ' in ' + construct.identifierToken.data));
				}
				else if (object.constructor == Construct.NameConstruct)
				{
					return $$this.$$Analyzer.lookupFullyQualifiedName(construct, Construct.nameConstructToString(object));
				}
				throw $es4.$$primitive(new Error('could not lookup fully qualified name: ' + object));
			}

			return $$this.$$Analyzer.$$p.$$lookupFullyQualifiedName || ($$this.$$Analyzer.$$p.$$lookupFullyQualifiedName = lookupFullyQualifiedName);
		}};


		//private instance method
		Analyzer.prototype.$$v.registerNamespace = {
		get:function ()
		{
			var $$this = this.$$this;

			function registerNamespace($$$$object, $$$$construct)
			{
				//set default parameter values
				var object = $$$$object;
				var construct = (1 > arguments.length - 1) ? null : $$$$construct;

				if (!object)
				{
					return;
				}
				else if (object == 'public' || object == 'private' || object == 'protected' || object == 'internal')
				{
					$$this.$$Analyzer._namespaces[$$this.$$Analyzer._level]['_' + object] = $es4.$$primitive(new NamespaceObj(object));
					$$this.$$Analyzer._namespaces[$$this.$$Analyzer._level]['_' + object].isCustom = false;
					return;
				}
				throw $es4.$$primitive(new Error('unknown object passed into registerNamespace: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$registerNamespace || ($$this.$$Analyzer.$$p.$$registerNamespace = registerNamespace);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupNamespace = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupNamespace($$$$object)
			{
				//set default parameter values
				var object = $$$$object;

				if (!object)
				{
					return $$this.$$Analyzer.lookupNamespace('internal');
				}
				if ($es4.$$is(object, String))
				{
					var level = $$this.$$Analyzer._level;
					while (level >= 0)
					{
						if ($$this.$$Analyzer._namespaces[level].hasOwnProperty('_' + object))
						{
							return $$this.$$Analyzer._namespaces[level]['_' + object];
						}
						level--;
					}
					$$this.$$Analyzer.output();
					throw $es4.$$primitive(new Error('could not lookup namespace: ' + object));
				}
				if (object.constructor == "token" && object.type == Token.IdentifierTokenType)
				{
					return $$this.$$Analyzer.lookupNamespace(object.data);
				}
				throw $es4.$$primitive(new Error('unknown object passed into lookupNamespace: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$lookupNamespace || ($$this.$$Analyzer.$$p.$$lookupNamespace = lookupNamespace);
		}};


		//private instance method
		Analyzer.prototype.$$v.hasNamespace = {
		get:function ()
		{
			var $$this = this.$$this;

			function hasNamespace($$$$object)
			{
				//set default parameter values
				var object = $$$$object;

				if (!object)
				{
					return true;
				}
				if ($es4.$$is(object, String))
				{
					var level = $$this.$$Analyzer._level;
					while (level >= 0)
					{
						if ($$this.$$Analyzer._namespaces[level].hasOwnProperty('_' + object))
						{
							return true;
						}
						level--;
					}
					return false;
				}
				if (object.constructor == Construct.PropertyConstruct)
				{
					return $$this.$$Analyzer.hasNamespace(object.identifierConstruct);
				}
				if (object.constructor == "token" && object.type == Token.IdentifierTokenType)
				{
					return $$this.$$Analyzer.hasNamespace(object.data);
				}
				throw $es4.$$primitive(new Error('unknown object passed into lookupNamespace: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$hasNamespace || ($$this.$$Analyzer.$$p.$$hasNamespace = hasNamespace);
		}};


		//private instance method
		Analyzer.prototype.$$v.registerUseNamespace = {
		get:function ()
		{
			var $$this = this.$$this;

			function registerUseNamespace($$$$object)
			{
				//set default parameter values
				var object = $$$$object;

				if (!object)
				{
					throw $es4.$$primitive(new Error('null object passed to registerUseNamespace'));
				}
				if (object.constructor == Construct.UseConstruct || object.constructor == Construct.UseStatement)
				{
					$$this.$$Analyzer._useNamespaces[$$this.$$Analyzer._level].push(object.namespaceIdentifierToken.data);
					return;
				}
				throw $es4.$$primitive(new Error('unknown object passed into registerUseNamespace: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$registerUseNamespace || ($$this.$$Analyzer.$$p.$$registerUseNamespace = registerUseNamespace);
		}};


		//private instance method
		Analyzer.prototype.$$v.getUseNamespaces = {
		get:function ()
		{
			var $$this = this.$$this;

			function getUseNamespaces()
			{
				var useNamespaces = [];
				var level = $$this.$$Analyzer._level;
				while (level >= 0)
				{
					for (var i = 0; i < $$this.$$Analyzer._useNamespaces[level].length; i++)
					{
						useNamespaces.push($$this.$$Analyzer._useNamespaces[level][i]);
					}
					level--;
				}
				return useNamespaces;
			}

			return $$this.$$Analyzer.$$p.$$getUseNamespaces || ($$this.$$Analyzer.$$p.$$getUseNamespaces = getUseNamespaces);
		}};


		//private instance method
		Analyzer.prototype.$$v.registerIdentifier = {
		get:function ()
		{
			var $$this = this.$$this;

			function registerIdentifier($$$$object, $$$$construct)
			{
				//set default parameter values
				var object = $$$$object;
				var construct = (1 > arguments.length - 1) ? null : $$$$construct;

				if (!object)
				{
					return;
				}
				var identifier;
				var vectorType;
				if (object.constructor == Construct.PackageConstruct)
				{
					var packageName = object.nameConstruct ? Construct.nameConstructToString(object.nameConstruct) : '';
					var name = packageName.split('.').shift();
					if (name)
					{
						identifier = $es4.$$primitive(new Identifier(name, $$this.$$Analyzer.lookupType('PACKAGE', construct)));
					}
					if (object.classConstruct)
					{
						identifier = $$this.$$Analyzer.registerIdentifier(object.classConstruct, object.classConstruct);
						if (!object.isInternal && Construct.nameConstructToString(object.classConstruct.packageConstruct.nameConstruct))
						{
							$$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + identifier.type.fullyQualifiedName] = identifier;
						}
					}
					else if (object.interfaceConstruct)
					{
						identifier = $$this.$$Analyzer.registerIdentifier(object.interfaceConstruct, object.interfaceConstruct);
						if (!object.isInternal && Construct.nameConstructToString(object.interfaceConstruct.packageConstruct.nameConstruct))
						{
							$$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + identifier.type.fullyQualifiedName] = identifier;
						}
					}
					else if (object.methodConstruct)
					{
						identifier = $$this.$$Analyzer.registerIdentifier(object.methodConstruct, object.methodConstruct);
					}
					else if (object.propertyConstruct)
					{
						identifier = $$this.$$Analyzer.registerIdentifier(object.propertyConstruct, object.propertyConstruct);
					}
					else
					{
						throw $es4.$$primitive(new Error('could not register type: ' + object));
					}
					if (!identifier)
					{
						return;
					}
					identifier.isImport = true;
					return identifier;
				}
				else if (object.constructor == Construct.ClassConstruct || object.constructor == Construct.InterfaceConstruct)
				{
					var type;
					if (object.isInternal)
					{
						type = $$this.$$Analyzer.lookupType(object.identifierToken.data, construct);
					}
					else if (Construct.nameConstructToString(object.packageConstruct.nameConstruct))
					{
						type = $$this.$$Analyzer.lookupType(Construct.nameConstructToString(object.packageConstruct.nameConstruct) + '.' + object.identifierToken.data);
					}
					else
					{
						type = $$this.$$Analyzer.lookupType(object.identifierToken.data);
					}
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, type));
					identifier.isType = true;
					identifier.construct = construct;
					identifier.isInternal = object.isInternal;
					var type = $es4.$$primitive(new Type(object.identifierToken.data, identifier.type.fullyQualifiedName, object.rootConstruct, construct));
					$$this.$$Analyzer._types['_' + identifier.type.fullyQualifiedName] = type;
					$$this.$$Analyzer._types['_' + identifier.type.name] = type;
				}
				else if (object.constructor == Construct.ImportConstruct)
				{
					var rootConstruct = $$this.$$Analyzer.lookupRootConstruct($$this.$$Analyzer._rootConstruct, object);
					var innerConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct(rootConstruct, object);
					identifier = $es4.$$primitive(new Identifier(object.nameConstruct.identifierTokens[0].data, $$this.$$Analyzer.lookupType('PACKAGE', construct), null));
					identifier.isPackage = true;
					$$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + identifier.name] = identifier;
					identifier = $es4.$$primitive(new Identifier(innerConstruct.identifierToken.data, $$this.$$Analyzer.lookupType(innerConstruct.typeConstruct, construct), vectorType));
					identifier.isType = (innerConstruct.constructor == Construct.ClassConstruct || innerConstruct.constructor == Construct.InterfaceConstruct);
					identifier.construct = innerConstruct;
					identifier.isImport = true;
					identifier.isInternal = innerConstruct.isInternal;
					identifier.fullPackageName = Construct.nameConstructToString(object.nameConstruct);
					if (innerConstruct.namespaceKeywordToken)
					{
						var namespaceObj = $$this.$$Analyzer._namespaces[$$this.$$Analyzer._level]['_' + innerConstruct.identifierToken.data] = $es4.$$primitive(new NamespaceObj(innerConstruct.identifierToken.data, $$this.$$Analyzer.lookupFullyQualifiedName(construct, innerConstruct.identifierToken.data), identifier));
						namespaceObj.isStatic = true;
						namespaceObj.namespaceIsPrivate = false;
						identifier.isNamespace = namespaceObj;
					}
					identifier.namespaceObj = $$this.$$Analyzer.lookupNamespace(innerConstruct.namespaceToken);
					var type = $es4.$$primitive(new Type(innerConstruct.identifierToken.data, Construct.nameConstructToString(object.nameConstruct), rootConstruct, innerConstruct));
					$$this.$$Analyzer._types['_' + innerConstruct.identifierToken.data] = type;
					$$this.$$Analyzer._types['_' + Construct.nameConstructToString(object.nameConstruct)] = type;
					return $$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + identifier.name] = $$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + Construct.nameConstructToString(object.nameConstruct)] = identifier;
				}
				else if (object.constructor == Construct.ParameterConstruct)
				{
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType(object.typeConstruct, construct)));
					identifier.isVar = true;
				}
				else if (object.constructor == Construct.LabelStatement)
				{
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType('void', construct)));
					identifier.isVar = true;
				}
				else if (object.constructor == Construct.VarStatement || object.constructor == Construct.CatchStatement)
				{
					if (object.typeConstruct && object.typeConstruct.vectorNameConstruct)
					{
						vectorType = $$this.$$Analyzer.lookupType(object.typeConstruct.vectorNameConstruct, construct);
					}
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType(object.typeConstruct, construct), vectorType));
					identifier.isVar = true;
				}
				else if (object.constructor == Construct.FunctionExpression)
				{
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType(object.typeConstruct, construct)));
					identifier.isVar = true;
				}
				else if (object == 'super')
				{
					identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType(construct.identifierToken.name, construct)));
				}
				else if (object == 'this')
				{
					if (!$$this.$$Analyzer._treatThisAsDynamic)
					{
						identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType(construct.identifierToken.name, construct)));
					}
					else
					{
						identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType('Object', construct)));
					}
				}
				else if (object == '$thisp')
				{
					identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType(construct.identifierToken.name, construct)));
				}
				else if (object == 'arguments')
				{
					identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType('Array')));
				}
				else if ($es4.$$is(object, String))
				{
					var globalIdentifier = null;
					for (var i = 0; i < Analyzer.globalIdentifiers.length; i++)
					{
						if (object != Analyzer.globalIdentifiers[i].name)
						{
							continue;
						}
						globalIdentifier = Analyzer.globalIdentifiers[i];
						break;
					}
					if (globalIdentifier)
					{
						identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType(globalIdentifier.returnType, construct)));
						identifier.isGlobal = true;
					}
					else
					{
						identifier = $es4.$$primitive(new Identifier(object, $$this.$$Analyzer.lookupType(object, construct)));
						identifier.isType = true;
						identifier.isGlobal = true;
						identifier.construct = $$this.$$Analyzer.lookupType(object, construct).construct;
					}
				}
				if (object.constructor == Construct.PropertyConstruct || object.constructor == Construct.MethodConstruct || object.constructor == Construct.VarStatement)
				{
					if (object.typeConstruct && object.typeConstruct.vectorNameConstruct)
					{
						vectorType = $$this.$$Analyzer.lookupType(object.typeConstruct.vectorNameConstruct, construct);
					}
				}
				if (object.constructor == Construct.PropertyConstruct)
				{
					if (object.namespaceToken && object.namespaceToken.data == 'private' && !$$this.$$Analyzer._doNotTreatPrivateMethodsAsNative)
					{
						object.isNative = true;
					}
					if (object.namespaceToken && object.namespaceToken.data == 'private')
					{
						object.isPrivate = true;
					}
					var type = $$this.$$Analyzer.lookupType(object.typeConstruct, construct);
					if (object.isNative && !object.valueExpression && type.fullyQualifiedName != '*' && type.fullyQualifiedName != 'void')
					{
						switch (type.fullyQualifiedName)
						{
							case 'Number':
								object.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
								break;
							case 'uint':
							case 'int':
								object.valueExpression = Construct.getNewNumberExpression();
								object.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
								break;
							case 'Boolean':
								object.valueExpression = Construct.getNewBooleanExpression();
								object.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
								break;
							default:
								object.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
						}
					}
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, type, vectorType));
					identifier.isProperty = !object.isNative;
					identifier.isInternal = object.isInternal;
					identifier.isNative = object.isNative;
					identifier.isVar = identifier.isVarInitialized = object.isNative;
					identifier.isPrivate = object.isPrivate && !object.isNative;
					if (object.isNative && object.valueExpression)
					{
						object.coerce = $$this.$$Analyzer.isCoerceRequired($$this.$$Analyzer.analyzeExpression(object.valueExpression, $$this.$$Analyzer._indent, false, construct), identifier.type, identifier);
					}
					if (object.namespaceKeywordToken)
					{
						var namespaceObj = $$this.$$Analyzer._namespaces[$$this.$$Analyzer._level]['_' + object.identifierToken.data] = $es4.$$primitive(new NamespaceObj(object.identifierToken.data, undefined, identifier));
						if (object.staticToken)
						{
							namespaceObj.isStatic = true;
						}
						namespaceObj.namespaceIsPrivate = object.namespaceToken.data == 'private';
						identifier.isNamespace = namespaceObj;
					}
					identifier.namespaceObj = $$this.$$Analyzer.lookupNamespace(object.namespaceToken);
					if (object.staticToken)
					{
						identifier.isStatic = true;
						identifier.scope = $$this.$$Analyzer.lookupType(construct.identifierToken.data, construct);
					}
				}
				else if (object.constructor == Construct.MethodConstruct)
				{
					if (object.namespaceToken && object.namespaceToken.data == 'private' && !$$this.$$Analyzer._doNotTreatPrivateMethodsAsNative)
					{
						object.isNative = true;
					}
					if (object.namespaceToken && object.namespaceToken.data == 'private')
					{
						object.isPrivate = true;
					}
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType(object.typeConstruct, construct), vectorType));
					identifier.isMethod = !object.isNative;
					identifier.isInternal = object.isInternal;
					identifier.isNative = object.isNative;
					identifier.isVar = identifier.isVarInitialized = object.isNative;
					identifier.isPrivate = object.isPrivate && !object.isNative;
					if (object.namespaceKeywordToken)
					{
						throw $es4.$$primitive(new Error('test'));
					}
					identifier.namespaceObj = $$this.$$Analyzer.lookupNamespace(object.namespaceToken);
					if (object.staticToken)
					{
						identifier.isStatic = true;
						identifier.scope = $$this.$$Analyzer.lookupType(construct.identifierToken.data, construct);
					}
				}
				else if (object.constructor == Construct.VarStatement)
				{
					identifier = $es4.$$primitive(new Identifier(object.identifierToken.data, $$this.$$Analyzer.lookupType(object.typeConstruct, construct), vectorType));
					identifier.isVar = true;
				}
				else if ($es4.$$is(object, Type))
				{
					identifier = $es4.$$primitive(new Identifier(object.name, object));
				}
				if (identifier)
				{
					var name = (identifier.namespaceObj && identifier.namespaceObj.isCustom ? identifier.namespaceObj.name + ':::' : '') + identifier.name;
					return $$this.$$Analyzer._identifiers[$$this.$$Analyzer._level]['_' + name] = identifier;
				}
				throw $es4.$$primitive(new Error('unknown object passed into registerIdentifier: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$registerIdentifier || ($$this.$$Analyzer.$$p.$$registerIdentifier = registerIdentifier);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupIdentifier = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupIdentifier($$$$object, $$$$namespaceObj)
			{
				//set default parameter values
				var object = $$$$object;
				var namespaceObj = (1 > arguments.length - 1) ? null : $$$$namespaceObj;

				if (!object)
				{
					throw $es4.$$primitive(new Error('cannot find empty identifier'));
				}
				else if ($es4.$$is(object, String))
				{
					if (object == 'Vector')
					{
						object = 'Array';
					}
					if (namespaceObj && namespaceObj.isCustom)
					{
						object = namespaceObj.name + ':::' + object;
					}
					var level = $$this.$$Analyzer._level;
					var useNamespaces = $$this.$$Analyzer.getUseNamespaces();
					while (level >= 0)
					{
						if ($$this.$$Analyzer._identifiers[level].hasOwnProperty('_' + object))
						{
							return $$this.$$Analyzer._identifiers[level]['_' + object];
						}
						if (!namespaceObj && useNamespaces.length)
						{
							for (var i = 0; i < useNamespaces.length; i++)
							{
								var innerObject = useNamespaces[i] + ':::' + object;
								if ($$this.$$Analyzer._identifiers[level].hasOwnProperty('_' + innerObject))
								{
									return $$this.$$Analyzer._identifiers[level]['_' + innerObject];
								}
							}
						}
						level--;
					}
					$$this.$$Analyzer.output();
					throw $es4.$$primitive(new Error('could not lookup identifier: ' + object));
				}
				else if (object.constructor == Construct.IdentifierConstruct)
				{
					return $$this.$$Analyzer.lookupIdentifier(object.identifierToken.data, namespaceObj);
				}
				else if (object.constructor == Construct.MethodConstruct || object.constructor == Construct.PropertyConstruct)
				{
					return $$this.$$Analyzer.lookupIdentifier(object.identifierToken.data, $$this.$$Analyzer.lookupNamespace(object.namespaceToken));
				}
				else if (object.constructor == Construct.ThisConstruct)
				{
					return $$this.$$Analyzer.lookupIdentifier('this');
				}
				else if (object.constructor == Construct.SuperConstruct)
				{
					return $$this.$$Analyzer.lookupIdentifier('super');
				}
				else if (object.constructor == Construct.NameConstruct)
				{
					return $$this.$$Analyzer.lookupIdentifier(Construct.nameConstructToString(object), namespaceObj);
				}
				else if (object.constructor == Construct.PackageConstruct)
				{
					if (object.classConstruct)
					{
						return $$this.$$Analyzer.lookupIdentifier(object.classConstruct.identifierToken.data);
					}
					else if (object.interfaceConstruct)
					{
						return $$this.$$Analyzer.lookupIdentifier(object.interfaceConstruct.identifierToken.data);
					}
					else if (object.methodConstruct)
					{
						return $$this.$$Analyzer.lookupIdentifier(object.methodConstruct.identifierToken.data);
					}
					else if (object.propertyConstruct)
					{
						return $$this.$$Analyzer.lookupIdentifier(object.propertyConstruct.identifierToken.data);
					}
				}
				throw $es4.$$primitive(new Error('unknown object passed into lookupIdentifier: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$lookupIdentifier || ($$this.$$Analyzer.$$p.$$lookupIdentifier = lookupIdentifier);
		}};


		//private instance method
		Analyzer.prototype.$$v.hasIdentifier = {
		get:function ()
		{
			var $$this = this.$$this;

			function hasIdentifier($$$$object, $$$$namespaceObj, $$$$currentLevel)
			{
				//set default parameter values
				var object = $$$$object;
				var namespaceObj = (1 > arguments.length - 1) ? null : $$$$namespaceObj;
				var currentLevel = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$currentLevel, Boolean);

				if (!object)
				{
					throw $es4.$$primitive(new Error('cannot find empty identifier'));
				}
				else if ($es4.$$is(object, String))
				{
					if (object == 'Vector')
					{
						object = 'Array';
					}
					if (namespaceObj && namespaceObj.isCustom)
					{
						object = namespaceObj.name + ':::' + object;
					}
					var level = $$this.$$Analyzer._level;
					var useNamespaces = $$this.$$Analyzer.getUseNamespaces();
					while (level >= 0)
					{
						if ($$this.$$Analyzer._identifiers[level].hasOwnProperty('_' + object))
						{
							return true;
						}
						if (!namespaceObj && useNamespaces.length)
						{
							for (var i = 0; i < useNamespaces.length; i++)
							{
								var innerObject = useNamespaces[i] + ':::' + object;
								if ($$this.$$Analyzer._identifiers[level].hasOwnProperty('_' + innerObject))
								{
									return true;
								}
							}
						}
						if (currentLevel)
						{
							break;
						}
						level--;
					}
					return false;
				}
				else if (object.constructor == Construct.PropertyConstruct)
				{
					return $$this.$$Analyzer.hasIdentifier(object.identifierToken.data, $$this.$$Analyzer.lookupNamespace(object.namespaceToken));
				}
				else if (object.constructor == Construct.MethodConstruct)
				{
					return $$this.$$Analyzer.hasIdentifier(object.identifierToken.data, $$this.$$Analyzer.lookupNamespace(object.namespaceToken));
				}
				throw $es4.$$primitive(new Error('unknown object passed into hasIdentifier: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$hasIdentifier || ($$this.$$Analyzer.$$p.$$hasIdentifier = hasIdentifier);
		}};


		//private instance method
		Analyzer.prototype.$$v.registerType = {
		get:function ()
		{
			var $$this = this.$$this;

			function registerType($$$$object, $$$$rootConstruct, $$$$construct, $$$$isGlobal)
			{
				//set default parameter values
				var object = $$$$object;
				var rootConstruct = $$$$rootConstruct;
				var construct = $$$$construct;
				var isGlobal = $$$$isGlobal;

				if (!object)
				{
					throw $es4.$$primitive(new Error('cannot register empty type'));
				}
				else if (object == 'PACKAGE')
				{
					var type = $es4.$$primitive(new Type(object, object, rootConstruct, construct));
					type.isGlobal = isGlobal;
					$$this.$$Analyzer._types['_' + object] = type;
					return;
				}
				else if ($es4.$$is(object, String))
				{
					if (object == 'Vector')
					{
						return;
					}
					var type = $es4.$$primitive(new Type(object, object, rootConstruct, construct));
					type.isGlobal = isGlobal;
					$$this.$$Analyzer._types['_' + object] = type;
					if (isGlobal)
					{
						$$this.$$Analyzer.registerIdentifier(object, rootConstruct);
					}
					return;
				}
				throw $es4.$$primitive(new Error('unknown object passed into registerType: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$registerType || ($$this.$$Analyzer.$$p.$$registerType = registerType);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupType = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupType($$$$object, $$$$construct)
			{
				//set default parameter values
				var object = $$$$object;
				var construct = (1 > arguments.length - 1) ? null : $$$$construct;

				if (!object)
				{
					return $$this.$$Analyzer.lookupType('void', construct);
				}
				else if ($es4.$$is(object, String))
				{
					if (object == 'Vector')
					{
						object = 'Array';
					}
					if ($$this.$$Analyzer._types.hasOwnProperty('_' + object))
					{
						return $$this.$$Analyzer._types['_' + object];
					}
					if (!construct)
					{
						$$this.$$Analyzer.output();
						throw $es4.$$primitive(new Error('cound not lookup type: ' + object));
					}
					var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(construct, object);
					return $$this.$$Analyzer._types['_' + object] = (construct.isInternal) ? $es4.$$primitive(new Type(object, fullyQualifiedName, $$this.$$Analyzer._rootConstructs[fullyQualifiedName], construct)) : $es4.$$primitive(new Type(object, fullyQualifiedName, $$this.$$Analyzer._rootConstructs[fullyQualifiedName], $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer._rootConstructs[fullyQualifiedName], fullyQualifiedName)));
				}
				else if (object.constructor == Construct.TypeConstruct)
				{
					if (!object.nameConstruct)
					{
						return $$this.$$Analyzer.lookupType('void', construct);
					}
					var name = (Construct.nameConstructToString(object.nameConstruct) == 'Vector') ? 'Array' : Construct.nameConstructToString(object.nameConstruct);
					return $$this.$$Analyzer.lookupType(name, construct);
				}
				else if (object.constructor == Construct.NameConstruct)
				{
					return $$this.$$Analyzer.lookupType(Construct.nameConstructToString(object), construct);
				}
				throw $es4.$$primitive(new Error('unknown object passed into lookupType: ' + object.constructor));
			}

			return $$this.$$Analyzer.$$p.$$lookupType || ($$this.$$Analyzer.$$p.$$lookupType = lookupType);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeImplicitImports = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeImplicitImports($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				if (construct.isInternal)
				{
					return;
				}
				var importConstructs = (construct.isInternal) ? $$this.$$Analyzer._rootConstruct.importConstructs : $$this.$$Analyzer._rootConstruct.packageConstruct.importConstructs;
				var rootConstructs = {};
				outer:				for (var id in $$this.$$Analyzer._rootConstructs)
				{
					var rootConstruct = $$this.$$Analyzer._rootConstructs[id];
					if (!rootConstruct)
					{
						throw $es4.$$primitive(new Error('Root construct null for id: ' + id));
					}
					if (!rootConstruct.packageConstruct)
					{
						throw $es4.$$primitive(new Error('Package construct missing in: ' + id));
					}
					if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct)
					{
						continue;
					}
					if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
					{
						continue;
					}
					if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct))
					{
						continue;
					}
					var identifier = $$this.$$Analyzer.lookupIdentifier(rootConstruct.packageConstruct);
					if (identifier.isGlobal)
					{
						continue;
					}
					var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(construct, identifier.name);
					if (!$$this.$$Analyzer.lookupType(identifier.name, construct).accessed && !$$this.$$Analyzer.lookupIdentifier(identifier.name).accessed)
					{
						continue;
					}
					rootConstructs[id] = rootConstruct;
					construct.packageName = $$this.$$Analyzer.lookupPackageName(construct, identifier.name);
					var packageName = construct.packageName.split('.');
					var nameConstruct = Construct.getNewNameConstruct();
					for (var i = 0; i < packageName.length; i++)
					{
						nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, packageName[i]));
					}
					nameConstruct.identifierTokens.push(Token.getNewToken(Token.IdentifierTokenType, identifier.name));
					var importConstruct = Construct.getNewImportConstruct();
					importConstruct.nameConstruct = nameConstruct;
					for (var i = 0; i < importConstructs.length; i++)
					{
						if (Construct.nameConstructToString(importConstruct.nameConstruct) == Construct.nameConstructToString(importConstructs[i].nameConstruct))
						{
							continue outer;
						}
					}
					importConstructs.push(importConstruct);
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeImplicitImports || ($$this.$$Analyzer.$$p.$$analyzeImplicitImports = analyzeImplicitImports);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeInterfaceConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeInterfaceConstruct($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.upLevel();
				$$this.$$Analyzer.registerConstruct(construct, true);
				$$this.$$Analyzer.analyzeImplicitImports(construct);
				if (construct.extendsNameConstructs.length)
				{
					for (var i = 0; i < construct.extendsNameConstructs.length; i++)
					{
						var identifier = construct.extendsNameConstructs[i].identifier = $$this.$$Analyzer.lookupIdentifier(construct.extendsNameConstructs[i], construct);
						var type = construct.extendsNameConstructs[i].type = $$this.$$Analyzer.lookupType(construct.extendsNameConstructs[i], construct);
						type.accessed = true;
					}
				}
				var packageName = $$this.$$Analyzer.lookupPackageName(construct, construct.identifierToken.data);
				construct.packageName = packageName;
				$$this.$$Analyzer.downLevel();
			}

			return $$this.$$Analyzer.$$p.$$analyzeInterfaceConstruct || ($$this.$$Analyzer.$$p.$$analyzeInterfaceConstruct = analyzeInterfaceConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzePropertyConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzePropertyConstruct($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.analyzeExpression(construct.valueExpression, $$this.$$Analyzer._indent, false, construct);
			}

			return $$this.$$Analyzer.$$p.$$analyzePropertyConstruct || ($$this.$$Analyzer.$$p.$$analyzePropertyConstruct = analyzePropertyConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeFunctionConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeFunctionConstruct($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.upLevel();
				var importConstructs = $$this.$$Analyzer._rootConstruct.packageConstruct.importConstructs;
				var accessor = construct.getToken || construct.setToken;
				$$this.$$Analyzer.registerIdentifier('this', construct);
				$$this.$$Analyzer.registerIdentifier('arguments', construct);
				for (var id in $$this.$$Analyzer._rootConstructs)
				{
					var rootConstruct = $$this.$$Analyzer._rootConstructs[id];
					if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct)
					{
						continue;
					}
					if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
					{
						continue;
					}
					if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct))
					{
						continue;
					}
					if (Analyzer._globals[id])
					{
						continue;
					}
					$$this.$$Analyzer.registerIdentifier(rootConstruct.packageConstruct, construct);
				}
				for (var i = 0; i < importConstructs.length; i++)
				{
					$$this.$$Analyzer.registerIdentifier(importConstructs[i], construct);
				}
				analyzeClassFunction(construct);
				$$this.$$Analyzer.analyzeImplicitImports(construct);
				$$this.$$Analyzer.downLevel();

				function analyzeClassFunction($$$$construct) 
				{
					//set default parameter values
					var construct = $$$$construct;

					$$this.$$Analyzer.upLevel();
					for (var j = 0; j < construct.namedFunctionExpressions.length; j++)
					{
						$$this.$$Analyzer.registerIdentifier(construct.namedFunctionExpressions[j], construct);
					}
					$$this.$$Analyzer.analyzeParameters(construct, construct);
					if (!construct.isJavaScript)
					{
						$$this.$$Analyzer._returnTypeStack.push($$this.$$Analyzer.lookupType(construct.typeConstruct, construct));
						$$this.$$Analyzer.analyzeStatements(construct.bodyStatements, $$this.$$Analyzer._indent + 1, construct);
						$$this.$$Analyzer._returnTypeStack.pop();
					}
					$$this.$$Analyzer.downLevel();
				}
;
			}

			return $$this.$$Analyzer.$$p.$$analyzeFunctionConstruct || ($$this.$$Analyzer.$$p.$$analyzeFunctionConstruct = analyzeFunctionConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeClassConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeClassConstruct($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.upLevel();
				$$this.$$Analyzer.registerConstruct(construct, true);
				for (var i = 0; i < construct.useConstructs.length; i++)
				{
					$$this.$$Analyzer.registerUseNamespace(construct.useConstructs[i]);
				}
				$$this.$$Analyzer.analyzeNamespaces(construct);
				$$this.$$Analyzer.analyzeProperties(construct, true);
				$$this.$$Analyzer.analyzeClassInitializer(construct);
				$$this.$$Analyzer.analyzeMethods(construct, true);
				$$this.$$Analyzer.analyzeAccessors(construct, true);
				$$this.$$Analyzer.analyzeClassFunction(construct);
				$$this.$$Analyzer.analyzeInternalClasses(construct);
				$$this.$$Analyzer.analyzeInternalInterfaces(construct);
				$$this.$$Analyzer.analyzeClassReturnStatement(construct);
				$$this.$$Analyzer.analyzeImplicitImports(construct);
				$$this.$$Analyzer.downLevel();
			}

			return $$this.$$Analyzer.$$p.$$analyzeClassConstruct || ($$this.$$Analyzer.$$p.$$analyzeClassConstruct = analyzeClassConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeClassInitializer = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeClassInitializer($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer._inStaticFunction = true;
				$$this.$$Analyzer.analyzeStatements(construct.initializerStatements, $$this.$$Analyzer._indent + 2, construct);
				$$this.$$Analyzer._inStaticFunction = false;
			}

			return $$this.$$Analyzer.$$p.$$analyzeClassInitializer || ($$this.$$Analyzer.$$p.$$analyzeClassInitializer = analyzeClassInitializer);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeClassFunction = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeClassFunction($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.upLevel();
				$$this.$$Analyzer.registerConstruct(construct, false);
				$$this.$$Analyzer.analyzeProperties(construct, false);
				$$this.$$Analyzer.analyzeConstructor(construct);
				$$this.$$Analyzer.analyzeMethods(construct, false);
				$$this.$$Analyzer.analyzeAccessors(construct, false);
				$$this.$$Analyzer.downLevel();
			}

			return $$this.$$Analyzer.$$p.$$analyzeClassFunction || ($$this.$$Analyzer.$$p.$$analyzeClassFunction = analyzeClassFunction);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeInternalClasses = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeInternalClasses($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				if (construct.isInternal)
				{
					return;
				}
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.classConstructs.length; i++)
				{
					$$this.$$Analyzer.analyzeClassConstruct($$this.$$Analyzer._rootConstruct.classConstructs[i]);
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeInternalClasses || ($$this.$$Analyzer.$$p.$$analyzeInternalClasses = analyzeInternalClasses);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeInternalInterfaces = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeInternalInterfaces($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				if (construct.isInternal)
				{
					return;
				}
				for (var i = 0; i < $$this.$$Analyzer._rootConstruct.interfaceConstructs.length; i++)
				{
					$$this.$$Analyzer.analyzeInterfaceConstruct($$this.$$Analyzer._rootConstruct.interfaceConstructs[i]);
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeInternalInterfaces || ($$this.$$Analyzer.$$p.$$analyzeInternalInterfaces = analyzeInternalInterfaces);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeClassReturnStatement = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeClassReturnStatement($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				if (construct.extendsNameConstruct)
				{
					var identifier = construct.extendsNameConstruct.identifier = $$this.$$Analyzer.lookupIdentifier(construct.extendsNameConstruct, construct);
					var type = construct.extendsNameConstruct.type = $$this.$$Analyzer.lookupType(construct.extendsNameConstruct, construct);
					type.accessed = true;
				}
				if (construct.implementsNameConstructs.length)
				{
					for (var i = 0; i < construct.implementsNameConstructs.length; i++)
					{
						var identifier = construct.implementsNameConstructs[i].identifier = $$this.$$Analyzer.lookupIdentifier(construct.implementsNameConstructs[i], construct);
						var type = construct.implementsNameConstructs[i].type = $$this.$$Analyzer.lookupType(construct.implementsNameConstructs[i], construct);
						type.accessed = true;
					}
				}
				var packageName = $$this.$$Analyzer.lookupPackageName(construct, construct.identifierToken.data);
				construct.packageName = packageName;
			}

			return $$this.$$Analyzer.$$p.$$analyzeClassReturnStatement || ($$this.$$Analyzer.$$p.$$analyzeClassReturnStatement = analyzeClassReturnStatement);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeConstructor = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeConstructor($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				$$this.$$Analyzer.upLevel();
				var methodConstruct = construct.constructorMethodConstruct;
				if (methodConstruct)
				{
					for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
					{
						$$this.$$Analyzer.registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
					}
				}
				if (methodConstruct)
				{
					$$this.$$Analyzer.analyzeParameters(methodConstruct, construct);
				}
				if (methodConstruct)
				{
					$$this.$$Analyzer.analyzeStatements(methodConstruct.bodyStatements, $$this.$$Analyzer._indent + 1, construct);
				}
				$$this.$$Analyzer.downLevel();
			}

			return $$this.$$Analyzer.$$p.$$analyzeConstructor || ($$this.$$Analyzer.$$p.$$analyzeConstructor = analyzeConstructor);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeNamespaces = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeNamespaces($$$$construct)
			{
				//set default parameter values
				var construct = $$$$construct;

				for (var i = 0; i < construct.propertyConstructs.length; i++)
				{
					var propertyConstruct = construct.propertyConstructs[i];
					if (!propertyConstruct.namespaceKeywordToken)
					{
						continue;
					}
					var identifier = $$this.$$Analyzer.lookupIdentifier(propertyConstruct);
					identifier.type.accessed = true;
					propertyConstruct.identifier = identifier;
					construct.namespacePropertyConstructs.push(propertyConstruct);
					if (propertyConstruct.valueExpression)
					{
						$$this.$$Analyzer.analyzeExpression(propertyConstruct.valueExpression, $$this.$$Analyzer._indent, false, construct);
					}
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeNamespaces || ($$this.$$Analyzer.$$p.$$analyzeNamespaces = analyzeNamespaces);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeProperties = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeProperties($$$$construct, $$$$isClassLevel)
			{
				//set default parameter values
				var construct = $$$$construct;
				var isClassLevel = $$$$isClassLevel;

				for (var i = 0; i < construct.propertyConstructs.length; i++)
				{
					var propertyConstruct = construct.propertyConstructs[i];
					if (isClassLevel && !propertyConstruct.staticToken || !isClassLevel && propertyConstruct.staticToken)
					{
						continue;
					}
					if (propertyConstruct.namespaceKeywordToken)
					{
						continue;
					}
					var identifier = $$this.$$Analyzer.lookupIdentifier(propertyConstruct);
					identifier.type.accessed = true;
					propertyConstruct.identifier = identifier;
					if (isClassLevel)
					{
						construct.staticPropertyConstructs.push(propertyConstruct);
					}
					else
					{
						construct.instancePropertyConstructs.push(propertyConstruct);
					}
					if (propertyConstruct.valueExpression)
					{
						$$this.$$Analyzer.analyzeExpression(propertyConstruct.valueExpression, $$this.$$Analyzer._indent, false, construct);
					}
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeProperties || ($$this.$$Analyzer.$$p.$$analyzeProperties = analyzeProperties);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeMethods = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeMethods($$$$construct, $$$$isClassLevel)
			{
				//set default parameter values
				var construct = $$$$construct;
				var isClassLevel = $$$$isClassLevel;

				if (isClassLevel)
				{
					$$this.$$Analyzer._inStaticFunction = true;
				}
				for (var i = 0; i < construct.methodConstructs.length; i++)
				{
					var methodConstruct = construct.methodConstructs[i];
					if (isClassLevel && !methodConstruct.staticToken || !isClassLevel && methodConstruct.staticToken)
					{
						continue;
					}
					if (methodConstruct.setToken || methodConstruct.getToken)
					{
						continue;
					}
					var identifier = $$this.$$Analyzer.lookupIdentifier(methodConstruct);
					identifier.type.accessed = true;
					methodConstruct.identifier = identifier;
					if (isClassLevel)
					{
						construct.staticMethodConstructs.push(methodConstruct);
					}
					else
					{
						construct.instanceMethodConstructs.push(methodConstruct);
					}
					$$this.$$Analyzer.upLevel();
					$$this.$$Analyzer.registerIdentifier('arguments', construct);
					for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
					{
						$$this.$$Analyzer.registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
					}
					$$this.$$Analyzer.analyzeParameters(methodConstruct, construct);
					if (!methodConstruct.isJavaScript)
					{
						if (methodConstruct.identifier.namespaceObj.isCustom)
						{
							$$this.$$Analyzer._inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$thisp.' + methodConstruct.identifier.namespaceObj.name;
						}
						$$this.$$Analyzer._returnTypeStack.push($$this.$$Analyzer.lookupType(methodConstruct.typeConstruct, construct));
						$$this.$$Analyzer.analyzeStatements(methodConstruct.bodyStatements, $$this.$$Analyzer._indent + 1, construct);
						$$this.$$Analyzer._returnTypeStack.pop();
						$$this.$$Analyzer._inNamespacedFunction = false;
					}
					$$this.$$Analyzer.downLevel();
				}
				if (isClassLevel)
				{
					$$this.$$Analyzer._inStaticFunction = false;
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeMethods || ($$this.$$Analyzer.$$p.$$analyzeMethods = analyzeMethods);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeAccessors = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeAccessors($$$$construct, $$$$isClassLevel)
			{
				//set default parameter values
				var construct = $$$$construct;
				var isClassLevel = $$$$isClassLevel;

				if (isClassLevel)
				{
					$$this.$$Analyzer._inStaticFunction = true;
				}
				var foundIndexes = [];

				function getMethodConstructJS($$$$methodConstruct, $$$$type) 
				{
					//set default parameter values
					var methodConstruct = $$$$methodConstruct;
					var type = $$$$type;

					if (!methodConstruct)
					{
						return;
					}
					$$this.$$Analyzer.upLevel();
					for (var j = 0; j < methodConstruct.namedFunctionExpressions.length; j++)
					{
						$$this.$$Analyzer.registerIdentifier(methodConstruct.namedFunctionExpressions[j], construct);
					}
					$$this.$$Analyzer.analyzeParameters(methodConstruct, construct);
					if (!methodConstruct.isJavaScript)
					{
						if (methodConstruct.identifier.namespaceObj.isCustom)
						{
							$$this.$$Analyzer._inNamespacedFunction = (methodConstruct.identifier.namespaceObj.importID) ? methodConstruct.identifier.namespaceObj.importID : '$thisp.' + methodConstruct.identifier.namespaceObj.name;
						}
						$$this.$$Analyzer._returnTypeStack.push(type);
						$$this.$$Analyzer.analyzeStatements(methodConstruct.bodyStatements, $$this.$$Analyzer._indent + 1, construct);
						$$this.$$Analyzer._returnTypeStack.pop();
						$$this.$$Analyzer._inNamespacedFunction = false;
					}
					$$this.$$Analyzer.downLevel();
				}
;

				for (var i = 0; i < construct.methodConstructs.length; i++)
				{
					var methodConstruct = construct.methodConstructs[i];
					if (foundIndexes[i])
					{
						continue;
					}
					if (!methodConstruct.setToken && !methodConstruct.getToken)
					{
						continue;
					}
					if (isClassLevel && !methodConstruct.staticToken || !isClassLevel && methodConstruct.staticToken)
					{
						continue;
					}
					var setterMethodConstruct = null;
					var getterMethodConstruct = null;
					if (methodConstruct.setToken)
					{
						setterMethodConstruct = methodConstruct;
						for (var j = 0; j < construct.methodConstructs.length; j++)
						{
							var innerMethodConstruct = construct.methodConstructs[j];
							if (!innerMethodConstruct.getToken)
							{
								continue;
							}
							if (innerMethodConstruct.identifierToken.data != setterMethodConstruct.identifierToken.data)
							{
								continue;
							}
							if (isClassLevel && !innerMethodConstruct.staticToken || !isClassLevel && innerMethodConstruct.staticToken)
							{
								continue;
							}
							if ($$this.$$Analyzer.lookupNamespace(innerMethodConstruct.namespaceToken) != $$this.$$Analyzer.lookupNamespace(setterMethodConstruct.namespaceToken))
							{
								continue;
							}
							var namespace1 = $$this.$$Analyzer.lookupNamespace(setterMethodConstruct.namespaceToken);
							var namespace2 = $$this.$$Analyzer.lookupNamespace(innerMethodConstruct.namespaceToken);
							if (namespace1 != namespace2)
							{
								continue;
							}
							getterMethodConstruct = innerMethodConstruct;
							foundIndexes[j] = true;
						}
					}
					else
					{
						getterMethodConstruct = methodConstruct;
						for (var j = 0; j < construct.methodConstructs.length; j++)
						{
							var innerMethodConstruct = construct.methodConstructs[j];
							if (!innerMethodConstruct.setToken)
							{
								continue;
							}
							if (innerMethodConstruct.identifierToken.data != getterMethodConstruct.identifierToken.data)
							{
								continue;
							}
							if (isClassLevel && !innerMethodConstruct.staticToken || !isClassLevel && innerMethodConstruct.staticToken)
							{
								continue;
							}
							if ($$this.$$Analyzer.lookupNamespace(innerMethodConstruct.namespaceToken) != $$this.$$Analyzer.lookupNamespace(getterMethodConstruct.namespaceToken))
							{
								continue;
							}
							var namespace1 = $$this.$$Analyzer.lookupNamespace(getterMethodConstruct.namespaceToken);
							var namespace2 = $$this.$$Analyzer.lookupNamespace(innerMethodConstruct.namespaceToken);
							if (namespace1 != namespace2)
							{
								continue;
							}
							setterMethodConstruct = innerMethodConstruct;
							foundIndexes[j] = true;
						}
					}
					if (setterMethodConstruct)
					{
						var identifier = $$this.$$Analyzer.lookupIdentifier(setterMethodConstruct);
						identifier.type.accessed = true;
						setterMethodConstruct.identifier = identifier;
					}
					if (getterMethodConstruct)
					{
						var identifier = $$this.$$Analyzer.lookupIdentifier(getterMethodConstruct);
						identifier.type.accessed = true;
						getterMethodConstruct.identifier = identifier;
					}
					var isCNamespace = methodConstruct.identifier.namespaceObj.isCustom;
					if (isClassLevel)
					{
						construct.staticAccessorConstructs.push({getter:getterMethodConstruct, setter:setterMethodConstruct});
					}
					else
					{
						construct.instanceAccessorConstructs.push({getter:getterMethodConstruct, setter:setterMethodConstruct});
					}
					if (getterMethodConstruct)
					{
						getMethodConstructJS(getterMethodConstruct, getterMethodConstruct.identifier.type);
					}
					if (setterMethodConstruct)
					{
						getMethodConstructJS(setterMethodConstruct, setterMethodConstruct.identifier.type);
					}
				}
				if (isClassLevel)
				{
					$$this.$$Analyzer._inStaticFunction = false;
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeAccessors || ($$this.$$Analyzer.$$p.$$analyzeAccessors = analyzeAccessors);
		}};


		//private instance method
		Analyzer.prototype.$$v.registerConstruct = {
		get:function ()
		{
			var $$this = this.$$this;

			function registerConstruct($$$$construct, $$$$isClassLevel)
			{
				//set default parameter values
				var construct = $$$$construct;
				var isClassLevel = $$$$isClassLevel;

				if (isClassLevel)
				{
					if (!construct.isInternal)
					{
						for (var id in $$this.$$Analyzer._rootConstructs)
						{
							var rootConstruct = $$this.$$Analyzer._rootConstructs[id];
							if (!rootConstruct)
							{
								throw $es4.$$primitive(new Error('Root construct null for id: ' + id));
							}
							if (!rootConstruct.packageConstruct)
							{
								throw $es4.$$primitive(new Error('Package construct missing in: ' + id));
							}
							if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct.nameConstruct)
							{
								continue;
							}
							if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
							{
								continue;
							}
							if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct && Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct) != Construct.nameConstructToString(construct.packageConstruct.nameConstruct))
							{
								continue;
							}
							if ($$this.$$Analyzer.hasIdentifier(id) && $$this.$$Analyzer.lookupIdentifier(id).isGlobal)
							{
								continue;
							}
							$$this.$$Analyzer.registerIdentifier(rootConstruct.packageConstruct, construct);
						}
					}
					var importConstructs = (construct.isInternal) ? $$this.$$Analyzer._rootConstruct.importConstructs : $$this.$$Analyzer._rootConstruct.packageConstruct.importConstructs;
					for (var i = 0; i < importConstructs.length; i++)
					{
						$$this.$$Analyzer.registerIdentifier(importConstructs[i], construct);
					}
				}
				else
				{
					$$this.$$Analyzer.registerIdentifier('this', construct);
					$$this.$$Analyzer.registerIdentifier('$thisp', construct);
					if (construct.extendsNameConstruct)
					{
						$$this.$$Analyzer.registerIdentifier('super', construct);
					}
				}
				var name = construct.identifierToken.data;
				var nextConstruct = construct;
				while (true)
				{
					for (var i = 0; i < nextConstruct.propertyConstructs.length; i++)
					{
						var propertyConstruct = nextConstruct.propertyConstructs[i];
						if (!isClassLevel)
						{
							continue;
						}
						if (!propertyConstruct.namespaceKeywordToken)
						{
							continue;
						}
						$$this.$$Analyzer.registerIdentifier(propertyConstruct, nextConstruct);
					}
					if (!nextConstruct.extendsNameConstruct)
					{
						break;
					}
					var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(nextConstruct, nextConstruct.extendsNameConstruct);
					if (fullyQualifiedName.split('.').pop() == name)
					{
						construct.extendsNameConflict = true;
					}
					nextConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(nextConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
				}
				var firstIteration = true;
				while (true)
				{
					for (var i = 0; i < construct.methodConstructs.length; i++)
					{
						var methodConstruct = construct.methodConstructs[i];
						if (Boolean(methodConstruct.staticToken) != isClassLevel)
						{
							continue;
						}
						if (!firstIteration && !$$this.$$Analyzer.hasNamespace(methodConstruct.namespaceToken))
						{
							continue;
						}
						var namespace = $$this.$$Analyzer.lookupNamespace(methodConstruct.namespaceToken);
						if ($$this.$$Analyzer.hasIdentifier(methodConstruct, namespace))
						{
							var identifier = $$this.$$Analyzer.lookupIdentifier(methodConstruct, namespace);
							if (!identifier.isGlobal && !identifier.isStatic)
							{
								continue;
							}
						}
						if (!firstIteration && methodConstruct.namespaceToken && methodConstruct.namespaceToken.data == 'private')
						{
							continue;
						}
						if (firstIteration || !$$this.$$Analyzer.hasIdentifier(methodConstruct, namespace, true))
						{
							$$this.$$Analyzer.registerIdentifier(methodConstruct, construct);
						}
					}
					for (var i = 0; i < construct.propertyConstructs.length; i++)
					{
						var propertyConstruct = construct.propertyConstructs[i];
						if (Boolean(propertyConstruct.staticToken) != isClassLevel && !propertyConstruct.namespaceKeywordToken)
						{
							continue;
						}
						if (!firstIteration && !$$this.$$Analyzer.hasNamespace(propertyConstruct.namespaceToken))
						{
							continue;
						}
						var namespace = $$this.$$Analyzer.lookupNamespace(propertyConstruct.namespaceToken);
						if ($$this.$$Analyzer.hasIdentifier(propertyConstruct, namespace))
						{
							var identifier = $$this.$$Analyzer.lookupIdentifier(propertyConstruct, namespace);
							if (!identifier.isGlobal && !identifier.isStatic)
							{
								continue;
							}
						}
						if (!firstIteration && propertyConstruct.namespaceToken && propertyConstruct.namespaceToken.data == 'private')
						{
							continue;
						}
						if (firstIteration || !$$this.$$Analyzer.hasIdentifier(propertyConstruct, namespace, true))
						{
							$$this.$$Analyzer.registerIdentifier(propertyConstruct, construct);
						}
					}
					if (!construct.extendsNameConstruct)
					{
						break;
					}
					firstIteration = false;
					var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(construct, construct.extendsNameConstruct);
					construct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(construct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
				}
			}

			return $$this.$$Analyzer.$$p.$$registerConstruct || ($$this.$$Analyzer.$$p.$$registerConstruct = registerConstruct);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeParameters = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeParameters($$$$methodConstruct, $$$$construct)
			{
				//set default parameter values
				var methodConstruct = $$$$methodConstruct;
				var construct = $$$$construct;

				for (var i = 0; i < methodConstruct.parameterConstructs.length; i++)
				{
					var parameterConstruct = methodConstruct.parameterConstructs[i];
					$$this.$$Analyzer.registerIdentifier(parameterConstruct, construct);
					var identifier = $$this.$$Analyzer.lookupIdentifier(parameterConstruct.identifierToken.data);
					identifier.type.accessed = true;
					identifier.isVarInitialized = true;
					parameterConstruct.identifier = identifier;
					if (parameterConstruct.valueExpression)
					{
						$$this.$$Analyzer.analyzeExpression(parameterConstruct.valueExpression, 0, false, construct);
					}
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeParameters || ($$this.$$Analyzer.$$p.$$analyzeParameters = analyzeParameters);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeStatements = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeStatements($$$$statements, $$$$indent, $$$$construct)
			{
				//set default parameter values
				var statements = $$$$statements;
				var indent = $$$$indent;
				var construct = $$$$construct;

				for (var i = 0; i < statements.length; i++)
				{
					$$this.$$Analyzer.analyzeStatement(statements[i], indent + 1, false, construct);
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeStatements || ($$this.$$Analyzer.$$p.$$analyzeStatements = analyzeStatements);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeStatement = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeStatement($$$$statement, $$$$_indent, $$$$inline, $$$$construct)
			{
				//set default parameter values
				var statement = $$$$statement;
				var _indent = $$$$_indent;
				var inline = $$$$inline;
				var construct = $$$$construct;

				if (!construct)
				{
					throw $es4.$$primitive(new Error('construct null in analyze statement'));
				}
				switch (statement.constructor)
				{
					case Construct.EmptyStatement:
						break;
					case Construct.IfStatement:
						$$this.$$Analyzer._inIfStatement++;
						$$this.$$Analyzer.analyzeExpression(statement.conditionExpression, _indent, false, construct);
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						for (var i = 0; i < statement.elseIfStatements.length; i++)
						{
							$$this.$$Analyzer.analyzeStatement(statement.elseIfStatements[i], _indent, false, construct);
						}
						if (statement.elseStatement)
						{
							$$this.$$Analyzer.analyzeStatement(statement.elseStatement, _indent, false, construct);
						}
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.ElseIfStatement:
						$$this.$$Analyzer._inIfStatement++;
						$$this.$$Analyzer.analyzeExpression(statement.conditionExpression, _indent, false, construct);
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.ElseStatement:
						$$this.$$Analyzer._inIfStatement++;
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.WhileStatement:
						$$this.$$Analyzer._inIfStatement++;
						$$this.$$Analyzer.analyzeExpression(statement.conditionExpression, _indent, false, construct);
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.DoWhileStatement:
						$$this.$$Analyzer._inIfStatement++;
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer.analyzeExpression(statement.conditionExpression, _indent, false, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.ForStatement:
						$$this.$$Analyzer._inIfStatement++;
						if (statement.variableStatement)
						{
							$$this.$$Analyzer.analyzeStatement(statement.variableStatement, 0, true, construct);
						}
						if (statement.conditionExpression)
						{
							$$this.$$Analyzer.analyzeExpression(statement.conditionExpression, _indent, false, construct);
						}
						if (statement.afterthoughtExpression)
						{
							$$this.$$Analyzer.analyzeExpression(statement.afterthoughtExpression, _indent, false, construct);
						}
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.ForEachStatement:
						$$this.$$Analyzer._count++;
						$$this.$$Analyzer._inIfStatement++;
						statement.index = $$this.$$Analyzer._count;
						statement.variableStatement.doNotSetDefaultValue = true;
						$$this.$$Analyzer.analyzeStatement(statement.variableStatement, 0, true, construct);
						$$this.$$Analyzer.analyzeExpression(statement.arrayExpression, _indent, false, construct);
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.ForInStatement:
						$$this.$$Analyzer._count++;
						$$this.$$Analyzer._inIfStatement++;
						statement.index = $$this.$$Analyzer._count;
						statement.variableStatement.doNotSetDefaultValue = true;
						$$this.$$Analyzer.analyzeStatement(statement.variableStatement, 0, true, construct);
						$$this.$$Analyzer.analyzeExpression(statement.objectExpression, _indent, false, construct);
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._inIfStatement--;
						break;
					case Construct.BreakStatement:
						if (statement.identifierToken)
						{
							statement.identifier = $$this.$$Analyzer.lookupIdentifier(statement.identifierToken.data);
						}
						break;
					case Construct.ContinueStatement:
						if (statement.identifierToken)
						{
							statement.identifier = $$this.$$Analyzer.lookupIdentifier(statement.identifierToken.data);
						}
						break;
					case Construct.ThrowStatement:
						if (statement.expression)
						{
							$$this.$$Analyzer.analyzeExpression(statement.expression, _indent, false, construct);
						}
						break;
					case Construct.TryStatement:
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						for (var i = 0; i < statement.catchStatements.length; i++)
						{
							$$this.$$Analyzer.upLevel();
							var catchStatement = statement.catchStatements[i];
							$$this.$$Analyzer._count++;
							catchStatement.index = $$this.$$Analyzer._count;
							var identifier = $$this.$$Analyzer.registerIdentifier(catchStatement, construct);
							identifier.isVarInitialized = true;
							catchStatement.identifier = identifier;
							$$this.$$Analyzer.analyzeStatements(catchStatement.bodyStatements, _indent + 2, construct);
							$$this.$$Analyzer.downLevel();
						}
						if (statement.finallyStatement)
						{
							$$this.$$Analyzer.analyzeStatements(statement.finallyStatement.bodyStatements, _indent + 1, construct);
						}
						break;
					case Construct.UseStatement:
						$$this.$$Analyzer.registerUseNamespace(statement);
						break;
					case Construct.VarStatement:
						for (var i = 0; i < statement.innerVarStatements.length; i++)
						{
							var identifier = $$this.$$Analyzer.registerIdentifier(statement.innerVarStatements[i], construct);
							statement.innerVarStatements[i].identifier = identifier;
						}
						var identifier = $$this.$$Analyzer.registerIdentifier(statement, construct);
						statement.identifier = identifier;
						if (!statement.valueExpression && statement.identifier.type.fullyQualifiedName != '*' && statement.identifier.type.fullyQualifiedName != 'void' && !statement.doNotSetDefaultValue)
						{
							switch (statement.identifier.type.fullyQualifiedName)
							{
								case 'Number':
									statement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
									break;
								case 'uint':
								case 'int':
									statement.valueExpression = Construct.getNewNumberExpression();
									statement.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
									break;
								case 'Boolean':
									statement.valueExpression = Construct.getNewBooleanExpression();
									statement.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
									break;
								default:
									statement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
							}
						}
						if (statement.valueExpression)
						{
							var expressionResult = $$this.$$Analyzer.analyzeExpression(statement.valueExpression, _indent, false, construct);
							if ($$this.$$Analyzer.isCoerceRequired(expressionResult, statement.identifier.type, statement.identifier))
							{
								statement.coerce = true;
							}
						}
						statement.identifier.isVarInitialized = true;
						for (var i = 0; i < statement.innerVarStatements.length; i++)
						{
							var innerVarStatement = statement.innerVarStatements[i];
							if (!innerVarStatement.valueExpression && innerVarStatement.identifier.type.fullyQualifiedName != '*' && innerVarStatement.identifier.type.fullyQualifiedName != 'void')
							{
								switch (innerVarStatement.identifier.type.fullyQualifiedName)
								{
									case 'Number':
										innerVarStatement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NaNTokenType, 'NaN'));
										break;
									case 'uint':
									case 'int':
										innerVarStatement.valueExpression = Construct.getNewNumberExpression();
										innerVarStatement.valueExpression.numberToken = Token.getNewToken(Token.NumberTokenType, '0');
										break;
									case 'Boolean':
										innerVarStatement.valueExpression = Construct.getNewBooleanExpression();
										innerVarStatement.valueExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, 'false');
										break;
									default:
										innerVarStatement.valueExpression = Construct.getNewExpression(Token.getNewToken(Token.NullTokenType, 'null'));
								}
							}
							if (innerVarStatement.valueExpression)
							{
								expressionResult = $$this.$$Analyzer.analyzeExpression(innerVarStatement.valueExpression, _indent, false, construct);
								if ($$this.$$Analyzer.isCoerceRequired(expressionResult, innerVarStatement.identifier.type, innerVarStatement.identifier))
								{
									innerVarStatement.coerce = true;
								}
							}
							innerVarStatement.identifier.isVarInitialized = true;
						}
						break;
					case Construct.SwitchStatement:
						$$this.$$Analyzer.analyzeExpression(statement.valueExpression, _indent, false, construct);
						for (var i = 0; i < statement.caseStatements.length; i++)
						{
							$$this.$$Analyzer.analyzeStatement(statement.caseStatements[i], _indent + 1, false, construct);
						}
						break;
					case Construct.CaseStatement:
						if (!statement.defaultToken)
						{
							$$this.$$Analyzer.analyzeExpression(statement.valueExpression, _indent, false, construct);
						}
						$$this.$$Analyzer.analyzeStatements(statement.bodyStatements, _indent + 1, construct);
						break;
					case Construct.LabelStatement:
						var identifier = $$this.$$Analyzer.registerIdentifier(statement, construct);
						identifier.isVarInitialized = true;
						statement.identifier = identifier;
						break;
					default:
						$$this.$$Analyzer.analyzeExpression(statement, _indent, false, construct);
				}
			}

			return $$this.$$Analyzer.$$p.$$analyzeStatement || ($$this.$$Analyzer.$$p.$$analyzeStatement = analyzeStatement);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzeExpression = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzeExpression($$$$expression, $$$$_indent, $$$$toString, $$$$construct, $$$$operator, $$$$expressionString)
			{
				//set default parameter values
				var expression = $$$$expression;
				var _indent = $$$$_indent;
				var toString = $$$$toString;
				var construct = $$$$construct;
				var operator = (4 > arguments.length - 1) ? null : $$$$operator;
				var expressionString = (5 > arguments.length - 1) ? null : $$$$expressionString;

				if (!construct)
				{
					throw $es4.$$primitive(new Error('construct null in analyze expression'));
				}
				var expressionResult = $es4.$$primitive(new ExpressionResult(null, false, false, false, false));
				outerSwitch:				switch (expression.constructor)
				{
					case Construct.ParenExpression:
						expressionResult = $$this.$$Analyzer.analyzeExpression(expression.expression, _indent, toString, construct, operator, expressionString);
						break;
					case Construct.PropertyExpression:
						expressionResult = $$this.$$Analyzer.analyzePropertyExpression(expression, toString, construct);
						break;
					case Construct.NumberExpression:
						if (expression.numberToken.data == $es4.$$primitive(new Number(parseFloat(expression.numberToken.data) >> 0)))
						{
							expressionResult.type = $$this.$$Analyzer.lookupType('int');
						}
						else if (expression.numberToken.data == $es4.$$primitive(new Number(parseFloat(expression.numberToken.data) >>> 0)))
						{
							expressionResult.type = $$this.$$Analyzer.lookupType('uint');
						}
						else
						{
							expressionResult.type = $$this.$$Analyzer.lookupType('Number');
						}
						break;
					case Construct.StringExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('String');
						break;
					case Construct.ReturnExpression:
						if (expression.expression)
						{
							expression.expectedType = $$this.$$Analyzer._returnTypeStack[$$this.$$Analyzer._returnTypeStack.length - 1];
							expressionResult = $$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
							expression.coerce = $$this.$$Analyzer.isCoerceRequired(expressionResult, expression.expectedType);
						}
						else
						{
							expressionResult.type = $$this.$$Analyzer.lookupType('void');
						}
						break;
					case Construct.DeleteExpression:
						expressionResult = $$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
						break;
					case Construct.FunctionExpression:
						var wasInClosure = $$this.$$Analyzer._inClosure;
						$$this.$$Analyzer._inClosure = true;
						if (expression.identifierToken)
						{
							if ($$this.$$Analyzer._inIfStatement)
							{
								throw $es4.$$primitive(new Error('support for named closures in if/elseif/else statements is not supported at this time. function name: ' + expression.identifierToken.data));
							}
							var identifier = $$this.$$Analyzer.registerIdentifier(expression, construct);
							identifier.isVarInitialized = true;
							expression.identifier = identifier;
							expressionResult.type = identifier.type;
						}
						else
						{
							expressionResult.type = $$this.$$Analyzer.lookupType(expression.typeConstruct);
						}
						for (var i = 0; i < expression.namedFunctionExpressions.length; i++)
						{
							var identifier = $$this.$$Analyzer.registerIdentifier(expression.namedFunctionExpressions[i], construct);
							identifier.isVarInitialized = true;
							expression.namedFunctionExpressions[i].identifier = identifier;
							expression.namedFunctionExpressions[i].type = identifier.type;
						}
						$$this.$$Analyzer.upLevel();
						$$this.$$Analyzer.analyzeParameters(expression, construct);
						$$this.$$Analyzer.registerIdentifier('this', construct);
						$$this.$$Analyzer._returnTypeStack.push(expressionResult.type);
						$$this.$$Analyzer.analyzeStatements(expression.bodyStatements, _indent + 1, construct);
						$$this.$$Analyzer._returnTypeStack.pop();
						if (!wasInClosure)
						{
							$$this.$$Analyzer._inClosure = false;
						}
						$$this.$$Analyzer.downLevel();
						break;
					case Construct.ObjectExpression:
						for (var i = 0; i < expression.objectPropertyConstructs.length; i++)
						{
							if (expression.objectPropertyConstructs[i].expression.constructor != Construct.PropertyExpression)
							{
								$$this.$$Analyzer.analyzeExpression(expression.objectPropertyConstructs[i].expression, 0, toString, construct);
							}
							$$this.$$Analyzer.analyzeExpression(expression.objectPropertyConstructs[i].valueExpression, 0, toString, construct);
						}
						expressionResult.type = $$this.$$Analyzer.lookupType('Object');
						break;
					case Construct.ArrayExpression:
						for (var i = 0; i < expression.valueExpressions.length; i++)
						{
							$$this.$$Analyzer.analyzeExpression(expression.valueExpressions[i], 0, toString, construct);
						}
						expressionResult.type = $$this.$$Analyzer.lookupType('Array');
						break;
					case Construct.BooleanExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('Boolean');
						break;
					case Construct.Expression:
						if (expression.token.type == Token.TypeofTokenType)
						{
							$$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
							expressionResult.type = $$this.$$Analyzer.lookupType('String');
							break;
						}
						if (expression.token.type == Token.VoidTokenType)
						{
							if (expression.expression.constructor != Construct.EmptyExpression)
							{
								$$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
							}
							expressionResult.type = $$this.$$Analyzer.lookupType('void');
							break;
						}
						if (expression.token.type == Token.NaNTokenType)
						{
							expressionResult.isNaN = true;
							break;
						}
						if (expression.token.type == Token.UndefinedTokenType)
						{
							expressionResult.isUndefined = true;
							break;
						}
						if (expression.token.type == Token.NullTokenType)
						{
							expressionResult.isNull = true;
							break;
						}
						if (expression.expression)
						{
							expressionResult = $$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
							break;
						}
						throw $es4.$$primitive(new Error('unhandled expression type'));
						break;
					case Construct.XMLExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('XML');
						break;
					case Construct.XMLListExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('XMLList');
						break;
					case Construct.EmptyExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('void');
						break;
					case Construct.RegExpression:
						expressionResult.type = $$this.$$Analyzer.lookupType('RegExp');
						break;
					case Construct.PrefixExpression:
					case Construct.PostfixExpression:
						expressionResult = $$this.$$Analyzer.analyzeExpression(expression.expression, 0, toString, construct);
						break;
					case Construct.NewExpression:
						expressionResult = $$this.$$Analyzer.analyzePropertyExpression(expression.expression, toString, construct, true);
						break;
					case Construct.BinaryExpression:
						if (expression.token.type == Token.IsTokenType)
						{
							$$this.$$Analyzer.analyzeExpression(expression.leftExpression, 0, toString, construct);
							$$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct);
							expressionResult.type = $$this.$$Analyzer.lookupType('Boolean');
							break;
						}
						if (expression.token.type == Token.InstanceofTokenType)
						{
							$$this.$$Analyzer.analyzeExpression(expression.leftExpression, 0, toString, construct);
							$$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct);
							expressionResult.type = $$this.$$Analyzer.lookupType('Boolean');
							break;
						}
						if (expression.token.type == Token.AsTokenType)
						{
							$$this.$$Analyzer.analyzeExpression(expression.leftExpression, 0, toString, construct);
							expressionResult = $$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct);
							break;
						}
						innerSwitch:						switch (expression.token.type)
						{
							case Token.BitwiseLeftShiftAssignmentTokenType:
							case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
							case Token.BitwiseRightShiftAssignmentTokenType:
							case Token.AddWithAssignmentTokenType:
							case Token.DivWithAssignmentTokenType:
							case Token.ModWithAssignmentTokenType:
							case Token.MulWithAssignmentTokenType:
							case Token.SubWithAssignmentTokenType:
							case Token.AssignmentTokenType:
							case Token.AndWithAssignmentTokenType:
							case Token.OrWithAssignmentTokenType:
							case Token.BitwiseAndAssignmentTokenType:
							case Token.BitwiseOrAssignmentTokenType:
							case Token.BitwiseXorAssignmentTokenType:
								var leftExpression = expression.leftExpression;
								while (leftExpression.constructor == Construct.ParenExpression)
								{
									leftExpression = leftExpression.expression;
								}
								var innerOperator = expression.token.data;
								var innerExpressionFound = false;
								var expressionResult;
								while (leftExpression.constructor == Construct.BinaryExpression)
								{
									var binaryExpression = Construct.getNewBinaryExpression();
									binaryExpression.token = expression.token;
									binaryExpression.rightExpression = expression.rightExpression;
									binaryExpression.leftExpression = leftExpression.rightExpression;
									if (!innerExpressionFound)
									{
										expressionResult = $$this.$$Analyzer.analyzeExpression(binaryExpression, _indent, toString, construct);
									}
									else
									{
										expressionResult = $$this.$$Analyzer.getGreatestCommonExpressionResult(expressionResult, $$this.$$Analyzer.analyzeExpression(binaryExpression.leftExpression, _indent, toString, construct));
									}
									innerExpressionFound = true;
									expression = leftExpression;
									leftExpression = expression.leftExpression;
								}
								var leftExpressionResult = $$this.$$Analyzer.analyzeExpression(leftExpression, 0, toString, construct);
								var rightExpressionResult;
								if (innerExpressionFound)
								{
									rightExpressionResult = expressionResult;
								}
								else
								{
									rightExpressionResult = $$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct);
								}
								expressionResult = $$this.$$Analyzer.getGreatestCommonExpressionResult(leftExpressionResult, rightExpressionResult);
								if ($$this.$$Analyzer.isCoerceRequired(expressionResult, leftExpressionResult.type, leftExpressionResult.varIdentifier))
								{
									leftExpression.coerce = true;
								}
								if (leftExpressionResult.varIdentifier)
								{
									leftExpressionResult.varIdentifier.isVarInitialized = true;
								}
								break outerSwitch;
							case Token.AddTokenType:
								var leftExpressionResult = $$this.$$Analyzer.analyzeExpression(expression.leftExpression, 0, toString, construct);
								var rightExpressionResult = $$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct);
								if (leftExpressionResult.type && leftExpressionResult.type.fullyQualifiedName == 'String')
								{
									expressionResult = leftExpressionResult;
								}
								else if (rightExpressionResult.type && rightExpressionResult.type.fullyQualifiedName == 'String')
								{
									expressionResult = rightExpressionResult;
								}
								else
								{
									expressionResult = $$this.$$Analyzer.getGreatestCommonExpressionResult(leftExpressionResult, rightExpressionResult);
								}
								break outerSwitch;
						}
						expressionResult = $$this.$$Analyzer.getGreatestCommonExpressionResult($$this.$$Analyzer.analyzeExpression(expression.leftExpression, 0, toString, construct), $$this.$$Analyzer.analyzeExpression(expression.rightExpression, 0, toString, construct));
						break;
					case Construct.TernaryExpression:
						$$this.$$Analyzer.analyzeExpression(expression.conditionExpression, 0, toString, construct);
						expressionResult = $$this.$$Analyzer.getGreatestCommonExpressionResult($$this.$$Analyzer.analyzeExpression(expression.trueExpression, 0, toString, construct), $$this.$$Analyzer.analyzeExpression(expression.falseExpression, 0, toString, construct));
						break;
					default:
						throw $es4.$$primitive(new Error('Unexpected expression found: ' + expression.constructor));
				}
				return expressionResult;
			}

			return $$this.$$Analyzer.$$p.$$analyzeExpression || ($$this.$$Analyzer.$$p.$$analyzeExpression = analyzeExpression);
		}};


		//private instance method
		Analyzer.prototype.$$v.isCoerceRequired = {
		get:function ()
		{
			var $$this = this.$$this;

			function isCoerceRequired($$$$expressionResultFrom, $$$$typeTo, $$$$varIdentifierTo)
			{
				//set default parameter values
				var expressionResultFrom = $$$$expressionResultFrom;
				var typeTo = $$$$typeTo;
				var varIdentifierTo = (2 > arguments.length - 1) ? null : $$$$varIdentifierTo;

				if (expressionResultFrom.varIdentifier && !expressionResultFrom.varIdentifier.isVarInitialized)
				{
					throw $es4.$$primitive(new Error('cannot declare and set var: [ ' + expressionResultFrom.varIdentifier + ' ] in same line, example: var i:uint = i;'));
				}
				if (typeTo.fullyQualifiedName == '*' || typeTo.fullyQualifiedName == 'void')
				{
					return false;
				}
				if (expressionResultFrom.isNull)
				{
					return (typeTo.fullyQualifiedName == 'Boolean' || typeTo.fullyQualifiedName == 'int' || typeTo.fullyQualifiedName == 'uint' || typeTo.fullyQualifiedName == 'Number');
				}
				if (expressionResultFrom.isUndefined || expressionResultFrom.isVoid)
				{
					return true;
				}
				if (expressionResultFrom.isNaN)
				{
					return (typeTo.fullyQualifiedName != 'Number');
				}
				if (expressionResultFrom.type == typeTo || typeTo.fullyQualifiedName == expressionResultFrom.type.fullyQualifiedName)
				{
					return false;
				}
				if (typeTo.fullyQualifiedName == 'Object')
				{
					return false;
				}
				var greatestCommonType = $$this.$$Analyzer.getGreatestCommonType(expressionResultFrom.type, typeTo);
				if (greatestCommonType == typeTo || greatestCommonType.fullyQualifiedName == typeTo.fullyQualifiedName)
				{
					return false;
				}
				return true;
			}

			return $$this.$$Analyzer.$$p.$$isCoerceRequired || ($$this.$$Analyzer.$$p.$$isCoerceRequired = isCoerceRequired);
		}};


		//private instance method
		Analyzer.prototype.$$v.getGreatestCommonExpressionResult = {
		get:function ()
		{
			var $$this = this.$$this;

			function getGreatestCommonExpressionResult($$$$expressionResult1, $$$$expressionResult2)
			{
				//set default parameter values
				var expressionResult1 = $$$$expressionResult1;
				var expressionResult2 = $$$$expressionResult2;

				var defaultExpressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('*'), false, false, false, false));
				if (expressionResult1 == expressionResult2)
				{
					return expressionResult2;
				}
				if (expressionResult1.isNull || expressionResult2.isNull)
				{
					return (expressionResult1.isNull && expressionResult2.isNull) ? expressionResult2 : defaultExpressionResult;
				}
				if (expressionResult1.isUndefined || expressionResult2.isUndefined)
				{
					return (expressionResult1.isUndefined && expressionResult2.isUndefined) ? expressionResult2 : defaultExpressionResult;
				}
				if (expressionResult1.isNaN || expressionResult2.isNaN)
				{
					return (expressionResult1.isNaN && expressionResult2.isNaN) ? expressionResult2 : defaultExpressionResult;
				}
				var type = $$this.$$Analyzer.getGreatestCommonType(expressionResult1.type, expressionResult2.type);
				return $es4.$$primitive(new ExpressionResult(type, false, false, false, false));
			}

			return $$this.$$Analyzer.$$p.$$getGreatestCommonExpressionResult || ($$this.$$Analyzer.$$p.$$getGreatestCommonExpressionResult = getGreatestCommonExpressionResult);
		}};


		//private instance method
		Analyzer.prototype.$$v.getGreatestCommonType = {
		get:function ()
		{
			var $$this = this.$$this;

			function getGreatestCommonType($$$$type1, $$$$type2)
			{
				//set default parameter values
				var type1 = $$$$type1;
				var type2 = $$$$type2;

				if (type1 == type2 || type1.fullyQualifiedName == type2.fullyQualifiedName)
				{
					return type2;
				}
				if (type1.fullyQualifiedName == '*' || type2.fullyQualifiedName == '*')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'void' || type2.fullyQualifiedName == 'void')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'String' || type2.fullyQualifiedName == 'String')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'Function' || type2.fullyQualifiedName == 'Function')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'Class' || type2.fullyQualifiedName == 'Class')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'Boolean' || type2.fullyQualifiedName == 'Boolean')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'Array' || type2.fullyQualifiedName == 'Array')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'uint' || type2.fullyQualifiedName == 'uint')
				{
					if (type1.fullyQualifiedName == type2.fullyQualifiedName)
					{
						return type2;
					}
					if (type1.fullyQualifiedName == 'Number')
					{
						return type1;
					}
					if (type2.fullyQualifiedName == 'Number')
					{
						return type2;
					}
					return $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'int' || type2.fullyQualifiedName == 'int')
				{
					if (type1.fullyQualifiedName == type2.fullyQualifiedName)
					{
						return type2;
					}
					if (type1.fullyQualifiedName == 'Number')
					{
						return type1;
					}
					if (type2.fullyQualifiedName == 'Number')
					{
						return type2;
					}
					return $$this.$$Analyzer.lookupType('*');
				}
				if (type1.fullyQualifiedName == 'Number' || type2.fullyQualifiedName == 'Number')
				{
					return (type1.fullyQualifiedName == type2.fullyQualifiedName) ? type2 : $$this.$$Analyzer.lookupType('*');
				}
				var typea = checkForType(type1, type2);
				var typeb = checkForType(type2, type1);
				return (typea.fullyQualifiedName == $$this.$$Analyzer.lookupType('*').fullyQualifiedName) ? typeb : typea;

				function checkForType($$$$type, $$$$typeToCheckFor) 
				{
					//set default parameter values
					var type = $$$$type;
					var typeToCheckFor = $$$$typeToCheckFor;

					var visitedInterfaces = {};
					var typeConstruct = type.construct;
					var typeToCheckForConstruct = typeToCheckFor.construct;
					if (typeConstruct.constructor == Construct.InterfaceConstruct)
					{
						var result = hasConstructInInterface(typeConstruct, typeToCheckForConstruct);
						if (result)
						{
							return typeToCheckFor;
						}
					}
					else
					{
						var result = hasConstructInClass(typeConstruct, typeToCheckForConstruct);
						if (result)
						{
							return typeToCheckFor;
						}
					}
					return $$this.$$Analyzer.lookupType('*');

					function hasConstructInInterface($$$$interfaceConstruct, $$$$constructToCheckFor) 
					{
						//set default parameter values
						var interfaceConstruct = $$$$interfaceConstruct;
						var constructToCheckFor = $$$$constructToCheckFor;

						if (interfaceConstruct == constructToCheckFor)
						{
							return true;
						}
						if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
						{
							var extendsNameConstructs = interfaceConstruct.extendsNameConstructs;
							for (var i = extendsNameConstructs.length; i--;)
							{
								if (visitedInterfaces[Construct.nameConstructToString(extendsNameConstructs[i])])
								{
									continue;
								}
								visitedInterfaces[Construct.nameConstructToString(extendsNameConstructs[i])] = true;
								var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(interfaceConstruct, extendsNameConstructs[i]);
								var innerConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(interfaceConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
								var result = hasConstructInInterface(interfaceConstruct, innerConstruct);
								if (result)
								{
									return true;
								}
							}
						}
						return false;
					}
;

					function hasConstructInClass($$$$classConstruct, $$$$constructToCheckFor) 
					{
						//set default parameter values
						var classConstruct = $$$$classConstruct;
						var constructToCheckFor = $$$$constructToCheckFor;

						if (classConstruct == constructToCheckFor)
						{
							return true;
						}
						if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
						{
							var implementsNameConstructs = classConstruct.implementsNameConstructs;
							for (var i = implementsNameConstructs.length; i--;)
							{
								if (visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])])
								{
									continue;
								}
								visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])] = true;
								var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(classConstruct, implementsNameConstructs[i]);
								var innerConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(classConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
								var result = hasConstructInInterface(constructToCheckFor, innerConstruct);
								if (result)
								{
									return true;
								}
							}
						}
						var extendsNameConstruct;
						while (extendsNameConstruct = classConstruct.extendsNameConstruct)
						{
							var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(classConstruct, extendsNameConstruct);
							var extendsConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(classConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
							if (extendsConstruct == constructToCheckFor)
							{
								return true;
							}
							if (constructToCheckFor.constructor == Construct.InterfaceConstruct)
							{
								var implementsNameConstructs = extendsConstruct.implementsNameConstructs;
								for (var i = implementsNameConstructs.length; i--;)
								{
									if (visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])])
									{
										continue;
									}
									visitedInterfaces[Construct.nameConstructToString(implementsNameConstructs[i])] = true;
									var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(extendsConstruct, implementsNameConstructs[i]);
									var innerConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(extendsConstruct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
									var result = hasConstructInInterface(constructToCheckFor, innerConstruct);
									if (result)
									{
										return true;
									}
								}
							}
							classConstruct = extendsConstruct;
						}
						return false;
					}
;
				}
;
			}

			return $$this.$$Analyzer.$$p.$$getGreatestCommonType || ($$this.$$Analyzer.$$p.$$getGreatestCommonType = getGreatestCommonType);
		}};


		//private instance method
		Analyzer.prototype.$$v.analyzePropertyExpression = {
		get:function ()
		{
			var $$this = this.$$this;

			function analyzePropertyExpression($$$$expression, $$$$toString, $$$$construct, $$$$isNew)
			{
				//set default parameter values
				var expression = $$$$expression;
				var toString = $$$$toString;
				var construct = $$$$construct;
				var isNew = (3 > arguments.length - 1) ? false : $$$$isNew;

				var innerExpression = expression;
				while (innerExpression.constructor == Construct.ParenExpression)
				{
					innerExpression = innerExpression.expression;
				}
				if (!innerExpression.construct)
				{
					throw $es4.$$primitive(new Error('invalid expression passed to analyzePropertyExpression: ' + innerExpression.constructor));
				}
				var identifier;
				var namespaceIdentifier;
				var thisConstruct = false;
				switch (innerExpression.construct.constructor)
				{
					case Construct.ThisConstruct:
						thisConstruct = true;
					case Construct.SuperConstruct:
					case Construct.IdentifierConstruct:
						identifier = innerExpression.construct.identifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct);
						identifier.accessed = true;
						break;
					case Construct.ParenConstruct:
					case Construct.ArrayConstruct:
					case Construct.ObjectConstruct:
						break;
					case Construct.NamespaceQualifierConstruct:
						namespaceIdentifier = innerExpression.construct.namespaceIdentifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.identifierToken.data);
						namespaceIdentifier.accessed = true;
						identifier = innerExpression.construct.identifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.namespaceIdentifierToken.data, $$this.$$Analyzer.lookupNamespace(namespaceIdentifier.name));
						identifier.accessed = true;
						break;
					default:
						throw $es4.$$primitive(new Error('unknown inner property expression: ' + innerExpression.construct.constructor));
				}
				if (identifier && !namespaceIdentifier && (identifier.isProperty || identifier.isMethod) && !identifier.isImport && identifier.namespaceObj.isCustom)
				{
					namespaceIdentifier = identifier.namespaceObj.identifier;
				}
				else if (identifier && identifier.isPackage)
				{
					var tempInnerExpression;
					while ((tempInnerExpression = innerExpression.nextPropertyExpression) && tempInnerExpression.construct.constructor == Construct.DotConstruct)
					{
						if (!tempInnerExpression.nextPropertyExpression || tempInnerExpression.nextPropertyExpression.construct.construct != Construct.IdentifierConstruct)
						{
							break;
						}
						var innerIdentifier = tempInnerExpression.nextPropertyExpression.construct.construct.identifier = $$this.$$Analyzer.lookupIdentifier(tempInnerExpression.nextPropertyExpression.construct.construct.identifierToken.data);
						if (!innerIdentifier.isPackage)
						{
							break;
						}
						innerExpression = innerExpression.nextPropertyExpression;
					}
				}
				var expressionResult;
				var lastPropertyName;
				var lastExpressionResult;
				var lastIdentifier;
				var packageName = '';
				if (identifier)
				{
					if (!identifier.isVar)
					{
						expressionResult = $es4.$$primitive(new ExpressionResult(identifier.type, false, false, false, false));
					}
					else
					{
						expressionResult = $es4.$$primitive(new ExpressionResult(identifier.type, false, false, false, false, identifier));
					}
					lastPropertyName = identifier.name;
					innerExpression.identifier = identifier;
					lastExpressionResult = expressionResult;
					lastIdentifier = identifier;
					if (identifier.isPackage)
					{
						packageName += identifier.name;
					}
					if (!identifier.isType)
					{
						identifier = null;
					}
					else
					{
						thisConstruct = true;
					}
				}
				else
				{
					expressionResult = $$this.$$Analyzer.analyzeExpression(innerExpression.construct.expression, 0, toString, construct);
				}
				while (innerExpression = innerExpression.nextPropertyExpression)
				{
					if (innerExpression.construct.constructor == Construct.DotConstruct || innerExpression.construct.constructor == Construct.IdentifierConstruct)
					{
						if (lastIdentifier && lastIdentifier.name == 'this')
						{
							if ($$this.$$Analyzer._treatThisAsDynamic)
							{
								innerExpression.construct.identifier = $$this.$$Analyzer.lookupIdentifier('global');
							}
							else
							{
								innerExpression.construct.identifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.identifierToken.data);
							}
						}
						lastExpressionResult = expressionResult;
						lastIdentifier = identifier;
						if (thisConstruct && $$this.$$Analyzer.hasIdentifier(innerExpression.construct.identifierToken.data) && $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.identifierToken.data).isNative)
						{
							throw $es4.$$primitive(new Error('cannot use "this" or classname scope before private native property: ' + innerExpression.construct.identifierToken.data));
						}
						thisConstruct = false;
						var invalidated = false;
						if (packageName)
						{
							packageName += '.' + innerExpression.construct.identifierToken.data;
							if ($$this.$$Analyzer._rootConstructs[packageName])
							{
								lastExpressionResult = expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType(packageName), false, false, false, false));
								lastIdentifier = $$this.$$Analyzer.lookupIdentifier(packageName);
								identifier = null;
								packageName = '';
								if (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor != Construct.FunctionCallConstruct)
								{
									identifier = lastIdentifier;
									innerExpression = innerExpression.nextPropertyExpression;
								}
							}
							else
							{
								invalidated = true;
							}
						}
						if (!invalidated)
						{
							var next = (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct && !isNew);
							expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupPropertyType(expressionResult.type, namespaceIdentifier, identifier, innerExpression.construct.identifierToken.data, next), false, false, false, false));
							identifier = null;
							namespaceIdentifier = null;
							lastPropertyName = innerExpression.construct.identifierToken.data;
							if (next)
							{
								var functionCallExpression = innerExpression.nextPropertyExpression;
								for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
								{
									$$this.$$Analyzer.analyzeExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
								}
								innerExpression = innerExpression.nextPropertyExpression;
								continue;
							}
						}
					}
					else if (innerExpression.construct.constructor == Construct.ArrayAccessorConstruct)
					{
						$$this.$$Analyzer.analyzeExpression(innerExpression.construct.expression, 0, toString, construct);
						expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('*'), false, false, false, false));
						identifier = null;
						namespaceIdentifier = null;
						lastPropertyName = null;
					}
					else if (innerExpression.construct.constructor == Construct.NamespaceQualifierConstruct)
					{
						namespaceIdentifier = innerExpression.construct.namespaceIdentifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.identifierToken.data);
						innerExpression.construct.identifier = $$this.$$Analyzer.lookupIdentifier(innerExpression.construct.namespaceIdentifierToken.data, $$this.$$Analyzer.lookupNamespace(namespaceIdentifier.name));
					}
					else if (innerExpression.construct.constructor == Construct.ParenConstruct)
					{
						expressionResult = $$this.$$Analyzer.analyzeExpression(innerExpression.construct.expression, 0, toString, construct);
						namespaceIdentifier = null;
						identifier = null;
						lastPropertyName = null;
					}
					else if (innerExpression.construct.constructor == Construct.AtIdentifierConstruct)
					{
						expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('Object'), false, false, false, false));
					}
					if (innerExpression.construct.constructor == Construct.FunctionCallConstruct || (innerExpression.nextPropertyExpression && innerExpression.nextPropertyExpression.construct.constructor == Construct.FunctionCallConstruct))
					{
						var functionCallExpression = (innerExpression.construct.constructor == Construct.FunctionCallConstruct) ? innerExpression : innerExpression.nextPropertyExpression;
						for (var i = 0; i < functionCallExpression.construct.argumentExpressions.length; i++)
						{
							$$this.$$Analyzer.analyzeExpression(functionCallExpression.construct.argumentExpressions[i], 0, toString, construct);
						}
						if (isNew)
						{
							if (lastPropertyName)
							{
								if (lastIdentifier && lastIdentifier.isType)
								{
									expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType(lastIdentifier.fullPackageName), false, false, false, false));
								}
								else
								{
									expressionResult = lastExpressionResult;
								}
							}
							else
							{
								expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('Object'), false, false, false, false));
							}
							isNew = false;
						}
						else
						{
							if (lastPropertyName)
							{
								if (lastIdentifier && lastIdentifier.isType)
								{
									expressionResult = lastExpressionResult;
								}
								else
								{
									expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupPropertyType(lastExpressionResult.type, namespaceIdentifier, lastIdentifier, lastPropertyName, true), false, false, false, false));
								}
							}
							else
							{
								expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('*'), false, false, false, false));
							}
						}
						namespaceIdentifier = null;
						identifier = null;
						lastPropertyName = null;
						lastIdentifier = null;
						lastExpressionResult = null;
						thisConstruct = false;
						if (innerExpression.nextPropertyExpression)
						{
							innerExpression = functionCallExpression;
						}
						continue;
					}
					thisConstruct = false;
				}
				if (isNew)
				{
					if (lastPropertyName)
					{
						if (lastExpressionResult)
						{
							expressionResult = lastExpressionResult;
						}
						else
						{
							expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupPropertyType(lastExpressionResult, namespaceIdentifier, lastIdentifier, lastPropertyName), false, false, false, false));
							if (expressionResult.type.name == '*')
							{
								expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('Object'), false, false, false, false));
							}
						}
					}
					else
					{
						expressionResult = $es4.$$primitive(new ExpressionResult($$this.$$Analyzer.lookupType('Object'), false, false, false, false));
					}
				}
				return expressionResult;
			}

			return $$this.$$Analyzer.$$p.$$analyzePropertyExpression || ($$this.$$Analyzer.$$p.$$analyzePropertyExpression = analyzePropertyExpression);
		}};


		//private instance method
		Analyzer.prototype.$$v.lookupPropertyType = {
		get:function ()
		{
			var $$this = this.$$this;

			function lookupPropertyType($$$$type, $$$$namespaceIdentifier, $$$$identifier, $$$$name, $$$$functionReturnType)
			{
				//set default parameter values
				var type = $$$$type;
				var namespaceIdentifier = $$$$namespaceIdentifier;
				var identifier = $$$$identifier;
				var name = $$$$name;
				var functionReturnType = (4 > arguments.length - 1) ? null : $$$$functionReturnType;

				if (identifier && !identifier.isType)
				{
					return identifier.type;
				}
				else if (identifier)
				{
					if (name == 'prototype')
					{
						return $$this.$$Analyzer.lookupType('Object');
					}
					var propertyConstructs = identifier.construct.methodConstructs.concat(identifier.construct.propertyConstructs);
					for (var i = 0; i < propertyConstructs.length; i++)
					{
						var propertyConstruct = propertyConstructs[i];
						if (!propertyConstruct.staticToken)
						{
							continue;
						}
						if (!propertyConstruct.namespaceToken && namespaceIdentifier)
						{
							continue;
						}
						if (namespaceIdentifier && namespaceIdentifier.name != propertyConstruct.namespaceToken.data)
						{
							continue;
						}
						if (propertyConstruct.identifierToken.data != name)
						{
							continue;
						}
						if (propertyConstruct.constructor == Construct.MethodConstruct)
						{
							if (propertyConstruct.setToken)
							{
								if (!propertyConstruct.parameterConstructs[0] || !propertyConstruct.parameterConstructs[0].typeConstruct)
								{
									throw $es4.$$primitive(new Error('::10'));
								}
								return getType(identifier.construct, propertyConstruct.parameterConstructs[0].typeConstruct);
							}
							if (propertyConstruct.getToken)
							{
								if (!propertyConstruct.typeConstruct)
								{
									throw $es4.$$primitive(new Error('::9'));
								}
								return getType(identifier.construct, propertyConstruct.typeConstruct);
							}
							if (functionReturnType)
							{
								if (!propertyConstruct.typeConstruct)
								{
									throw $es4.$$primitive(new Error('::8'));
								}
								return getType(identifier.construct, propertyConstruct.typeConstruct);
							}
							return $$this.$$Analyzer.lookupType('Function');
						}
						if (!propertyConstruct || !propertyConstruct.typeConstruct)
						{
							throw $es4.$$primitive(new Error('::7'));
						}
						return getType(identifier.construct, propertyConstruct.typeConstruct);
					}
					throw $es4.$$primitive(new Error('cound not lookup static property ' + name + ' in: ' + type + ', ' + identifier + ', possible cause: compiling against out of date swc'));
				}
				if (type.isGlobal && (type.name == '*' || type.name == 'void'))
				{
					return type;
				}
				var construct = type.construct;
				if (!construct)
				{
					$$this.$$Analyzer.output();
					throw $es4.$$primitive(new Error('could not find construct in type: ' + type + ', property name: ' + name));
				}
				if (construct.constructor == Construct.ClassConstruct && construct.identifierToken.data == name)
				{
					return type;
				}
				if (construct.constructor == Construct.MethodConstruct)
				{
					if (construct.setToken)
					{
						return getType(construct, construct.parameterConstructs[0].typeConstruct);
					}
					if (construct.getToken)
					{
						return getType(construct, construct.typeConstruct);
					}
					if (functionReturnType)
					{
						if (!construct.typeConstruct)
						{
							throw $es4.$$primitive(new Error('::6'));
						}
						return getType(construct, construct.typeConstruct);
					}
					return $$this.$$Analyzer.lookupType('Function');
				}

				function findTypeInInterfaceConstruct($$$$construct) 
				{
					//set default parameter values
					var construct = $$$$construct;

					var type = getTypeInConstruct(construct);
					if (type)
					{
						return type;
					}
					for (var i = 0; i < construct.extendsNameConstructs.length; i++)
					{
						var fullyQualifiedName = $$this.$$Analyzer.lookupFullyQualifiedName(construct, construct.extendsNameConstructs[i]);
						var innerConstruct = $$this.$$Analyzer.lookupConstructInRootConstruct($$this.$$Analyzer.lookupRootConstruct(construct.rootConstruct, fullyQualifiedName), fullyQualifiedName);
						type = findTypeInInterfaceConstruct(innerConstruct);
						if (type)
						{
							return type;
						}
					}
					return null;
				}
;

				var innerConstruct = construct;
				var object = false;
				while (true)
				{
					if (innerConstruct.extendsNameConstructs)
					{
						var innerType = findTypeInInterfaceConstruct(innerConstruct);
						if (innerType)
						{
							return innerType;
						}
					}
					else
					{
						var innerType = getTypeInConstruct(innerConstruct);
						if (innerType)
						{
							return innerType;
						}
					}
					if (innerConstruct.extendsNameConstruct && Construct.nameConstructToString(innerConstruct.extendsNameConstruct) == 'Object')
					{
						object = true;
					}
					if (!innerConstruct.extendsNameConstruct && object)
					{
						break;
					}
					else if (!innerConstruct.extendsNameConstruct)
					{
						innerConstruct = $$this.$$Analyzer.lookupType('Object').construct;
						object = true;
					}
					else
					{
						innerConstruct = getType(innerConstruct, innerConstruct.extendsNameConstruct).construct;
					}
				}
				if (construct.dynamicToken)
				{
					return $$this.$$Analyzer.lookupType('*');
				}
				throw $es4.$$primitive(new Error('could not find property ' + name + ' in type ' + type + ' construct: ' + construct.identifierToken.data));

				function getTypeInConstruct($$$$construct) 
				{
					//set default parameter values
					var construct = $$$$construct;

					var propertyConstructs = (construct.constructor == Construct.InterfaceConstruct) ? construct.methodConstructs : construct.methodConstructs.concat(construct.propertyConstructs);
					for (var i = 0; i < propertyConstructs.length; i++)
					{
						var propertyConstruct = propertyConstructs[i];
						if (propertyConstruct.staticToken)
						{
							continue;
						}
						if (!propertyConstruct.namespaceToken && namespaceIdentifier)
						{
							continue;
						}
						if (namespaceIdentifier && namespaceIdentifier.name != propertyConstruct.namespaceToken.data)
						{
							continue;
						}
						if (propertyConstruct.identifierToken.data != name)
						{
							continue;
						}
						if (propertyConstruct.constructor == Construct.MethodConstruct)
						{
							if (propertyConstruct.setToken)
							{
								if (!propertyConstruct.parameterConstructs[0] || !propertyConstruct.parameterConstructs[0].typeConstruct)
								{
									throw $es4.$$primitive(new Error('::4'));
								}
								return getType(construct, propertyConstruct.parameterConstructs[0].typeConstruct);
							}
							if (propertyConstruct.getToken)
							{
								if (!propertyConstruct.typeConstruct)
								{
									throw $es4.$$primitive(new Error('::3'));
								}
								return getType(construct, propertyConstruct.typeConstruct);
							}
							if (functionReturnType)
							{
								if (!propertyConstruct.typeConstruct)
								{
									throw $es4.$$primitive(new Error('::1'));
								}
								return getType(construct, propertyConstruct.typeConstruct);
							}
							return $$this.$$Analyzer.lookupType('Function');
						}
						if (!propertyConstruct || !propertyConstruct.typeConstruct)
						{
							throw $es4.$$primitive(new Error('::2'));
						}
						return getType(construct, propertyConstruct.typeConstruct);
					}
					return null;
				}
;

				function getType($$$$construct, $$$$typeOrNameConstruct) 
				{
					//set default parameter values
					var construct = $$$$construct;
					var typeOrNameConstruct = $$$$typeOrNameConstruct;

					var importConstructs;
					var packageName;
					var typeName;
					if (construct.isInternal)
					{
						importConstructs = construct.rootConstruct.importConstructs;
						packageName = '';
					}
					else
					{
						importConstructs = construct.packageConstruct.importConstructs;
						if (construct.packageConstruct.nameConstruct == null)
						{
							throw $es4.$$primitive(new Error('invalid: ' + construct.identifierToken.data + ', ' + construct.packageConstruct.constructor));
						}
						packageName = Construct.nameConstructToString(construct.packageConstruct.nameConstruct);
					}
					if (!typeOrNameConstruct)
					{
						trace(construct.identifierToken.data);
						$$this.$$Analyzer.output();
					}
					if (typeOrNameConstruct.constructor == Construct.TypeConstruct)
					{
						if (!typeOrNameConstruct.nameConstruct && typeOrNameConstruct.mulToken)
						{
							return $$this.$$Analyzer.lookupType('*');
						}
						if (!typeOrNameConstruct.nameConstruct && typeOrNameConstruct.voidToken)
						{
							return $$this.$$Analyzer.lookupType('void');
						}
						if (!typeOrNameConstruct.nameConstruct)
						{
							throw $es4.$$primitive(new Error('invalid: ' + construct.identifierToken.data + ', name: ' + name));
						}
						typeName = Construct.nameConstructToString(typeOrNameConstruct.nameConstruct);
					}
					else if (typeOrNameConstruct.constructor == Construct.NameConstruct)
					{
						typeName = Construct.nameConstructToString(typeOrNameConstruct);
					}
					else
					{
						throw $es4.$$primitive(new Error('invalid type or name construct'));
					}
					if (typeName.split('.').length > 1)
					{
						return $$this.$$Analyzer.lookupType(typeOrNameConstruct);
					}
					if (!typeName)
					{
						throw $es4.$$primitive(new Error("invalid type name"));
					}
					if ($$this.$$Analyzer.hasIdentifier(typeName) && $$this.$$Analyzer.lookupIdentifier(typeName).isGlobal)
					{
						return $$this.$$Analyzer.lookupType(typeName);
					}
					for (var i = 0; i < importConstructs.length; i++)
					{
						var importConstruct = importConstructs[i];
						var innerName = importConstruct.nameConstruct.identifierTokens[importConstruct.nameConstruct.identifierTokens.length - 1].data;
						if (innerName == typeName)
						{
							return $$this.$$Analyzer.lookupType(Construct.nameConstructToString(importConstruct.nameConstruct));
						}
					}
					for (var id in $$this.$$Analyzer._rootConstructs)
					{
						var rootConstruct = $$this.$$Analyzer._rootConstructs[id];
						if (!rootConstruct)
						{
							throw $es4.$$primitive(new Error('Root construct null for id: ' + id));
						}
						if (!rootConstruct.packageConstruct)
						{
							throw $es4.$$primitive(new Error('Package construct missing in: ' + id));
						}
						if (rootConstruct.packageConstruct.nameConstruct && !construct.packageConstruct)
						{
							continue;
						}
						if (!rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
						{
							continue;
						}
						if (rootConstruct.packageConstruct.nameConstruct && construct.packageConstruct.nameConstruct)
						{
							var a = $es4.$$coerce(Construct.nameConstructToString(rootConstruct.packageConstruct.nameConstruct), String);
							var b = $es4.$$coerce(Construct.nameConstructToString(construct.packageConstruct.nameConstruct), String);
							if (a && (a != b))
							{
								continue;
							}
						}
						if ($$this.$$Analyzer.hasIdentifier(id) && $$this.$$Analyzer.lookupIdentifier(id).isGlobal)
						{
							continue;
						}
						if (!rootConstruct.packageConstruct.classConstruct && !rootConstruct.packageConstruct.interfaceConstruct)
						{
							continue;
						}
						if (id.split('.').pop() != typeName)
						{
							continue;
						}
						return $$this.$$Analyzer.lookupType(id);
					}
					if (typeName == construct.identifierToken.data)
					{
						return $$this.$$Analyzer.lookupType(typeName);
					}
					throw $es4.$$primitive(new Error('could not find type: ' + typeName + ' in ' + construct.identifierToken.data));
				}
;
			}

			return $$this.$$Analyzer.$$p.$$lookupPropertyType || ($$this.$$Analyzer.$$p.$$lookupPropertyType = lookupPropertyType);
		}};


		//private instance method
		Analyzer.prototype.$$v.print = {
		get:function ()
		{
			var $$this = this.$$this;

			function print($$$$string, $$$$tabs, $$$$newlines, $$$$preNewLines)
			{
				//set default parameter values
				var string = $$$$string;
				var tabs = $$$$tabs;
				var newlines = $$$$newlines;
				var preNewLines = $$$$preNewLines;

				if (tabs)
				{
					for (var i = 0; i < tabs; i++)
					{
						string = '\t' + string;
					}
				}
				if (newlines)
				{
					for (var i = 0; i < newlines; i++)
					{
						string += '\n';
					}
				}
				if (preNewLines)
				{
					for (var i = 0; i < preNewLines; i++)
					{
						string = '\n' + string;
					}
				}
				return string;
			}

			return $$this.$$Analyzer.$$p.$$print || ($$this.$$Analyzer.$$p.$$print = print);
		}};

		//properties
		Analyzer.prototype.$$v._rootConstruct = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._rootConstruct; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._rootConstruct = value }
		};

		Analyzer.prototype.$$v._rootConstructs = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._rootConstructs; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._rootConstructs = $es4.$$coerce(value, Object); }
		};

		Analyzer.prototype.$$v._translationMode = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._translationMode; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._translationMode = $es4.$$coerce(value, int); }
		};

		Analyzer.prototype.$$v._doNotTreatPrivateMethodsAsNative = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._doNotTreatPrivateMethodsAsNative; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._doNotTreatPrivateMethodsAsNative = $es4.$$coerce(value, Boolean); }
		};

		Analyzer.prototype.$$v._treatThisAsDynamic = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._treatThisAsDynamic; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._treatThisAsDynamic = $es4.$$coerce(value, Boolean); }
		};

		Analyzer.prototype.$$v._indent = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._indent; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._indent = value }
		};

		Analyzer.prototype.$$v._count = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._count; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._count = value }
		};

		Analyzer.prototype.$$v._level = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._level; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._level = $es4.$$coerce(value, int); }
		};

		Analyzer.prototype.$$v._inClosure = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._inClosure; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._inClosure = value }
		};

		Analyzer.prototype.$$v._inNamespacedFunction = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._inNamespacedFunction; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._inNamespacedFunction = value }
		};

		Analyzer.prototype.$$v._inStaticFunction = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._inStaticFunction; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._inStaticFunction = value }
		};

		Analyzer.prototype.$$v._inIfStatement = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._inIfStatement; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._inIfStatement = value }
		};

		Analyzer.prototype.$$v._returnTypeStack = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._returnTypeStack; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._returnTypeStack = value }
		};

		Analyzer.prototype.$$v._identifiers = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._identifiers; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._identifiers = value }
		};

		Analyzer.prototype.$$v._namespaces = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._namespaces; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._namespaces = value }
		};

		Analyzer.prototype.$$v._useNamespaces = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._useNamespaces; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._useNamespaces = value }
		};

		Analyzer.prototype.$$v._types = {
		get:function () { var $$this = this.$$this; return $$this.$$Analyzer.$$p._types; },
		set:function (value) { var $$this = this.$$this; $$this.$$Analyzer.$$p._types = value }
		};

	});

	//class initializer
	Analyzer.$$cinit = (function ()
	{
		Analyzer.$$cinit = undefined;

		//initialize properties
		$$j.globalIdentifiers = $es4.$$coerce([{name:'trace', returnType:'void'}, {name:'parseInt', returnType:'Number'}, {name:'parseFloat', returnType:'Number'}, {name:'isNaN', returnType:'Boolean'}, {name:'isFinite', returnType:'Boolean'}, {name:'escape', returnType:'String'}, {name:'unescape', returnType:'String'}, {name:'decodeURIComponent', returnType:'String'}, {name:'encodeURIComponent', returnType:'String'}, {name:'decodeURI', returnType:'String'}, {name:'encodeURI', returnType:'String'}, {name:'isXMLName', returnType:'Boolean'}, {name:'$es4', returnType:'Object'}, {name:'window', returnType:'Object'}, {name:'document', returnType:'Object'}, {name:'console', returnType:'Object'}, {name:'$', returnType:'Object'}, {name:'_', returnType:'Object'}, {name:'alert', returnType:'Object'}, {name:'debugger', returnType:'Object'}, {name:'setInterval', returnType:'Object'}, {name:'clearInterval', returnType:'Object'}, {name:'setTimeout', returnType:'Object'}, {name:'clearTimeout', returnType:'Object'}, {name:'require', returnType:'Object'}, {name:'global', returnType:'Object'}, {name:'process', returnType:'Object'}, {name:'__dirname', returnType:'String'}], Array);
		$$j._globals = $es4.$$coerce({'ArgumentError':1, 'Array':1, 'Boolean':1, 'Class':1, 'JSON':1, 'Walker':1, 'UninitializedError':1, 'Date':1, 'DefinitionError':1, 'Error':1, 'EvalError':1, 'Function':1, 'int':1, 'Math':1, 'Namespace':1, 'Number':1, 'Object':1, 'QName':1, 'RangeError':1, 'ReferenceError':1, 'RegExp':1, 'SecurityError':1, 'String':1, 'SyntaxError':1, 'TypeError':1, 'uint':1, 'URIError':1, 'Vector':1, 'VerifyError':1, 'XML':1, 'XMLList':1}, Object);
	
	});

	//public static method
	Analyzer.analyze = (function ($$$$rootConstruct, $$$$rootConstructs, $$$$translationMode, $$$$doNotTreatPrivateMethodsAsNative, $$$$treatThisAsDynamic)
	{
		if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit();

		//set default parameter values
		var rootConstruct = $$$$rootConstruct;
		var rootConstructs = $$$$rootConstructs;
		var translationMode = $es4.$$coerce($$$$translationMode, Number);
		var doNotTreatPrivateMethodsAsNative = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$doNotTreatPrivateMethodsAsNative, Boolean);
		var treatThisAsDynamic = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$treatThisAsDynamic, Boolean);

		return $es4.$$primitive(new Analyzer().analyze(rootConstruct, rootConstructs, translationMode, doNotTreatPrivateMethodsAsNative, treatThisAsDynamic));
	});
	function Analyzer()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Analyzer) || $$this.$$Analyzer !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Analyzer) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Analyzer.$$construct($$this, $$args);
		}
	}

	//construct
	Analyzer.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Analyzer', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

		Object.defineProperty($$this.$$Analyzer, '_rootConstruct', Analyzer.prototype.$$v._rootConstruct);
		Object.defineProperty($$this.$$Analyzer, '_rootConstructs', Analyzer.prototype.$$v._rootConstructs);
		Object.defineProperty($$this.$$Analyzer, '_translationMode', Analyzer.prototype.$$v._translationMode);
		Object.defineProperty($$this.$$Analyzer, '_doNotTreatPrivateMethodsAsNative', Analyzer.prototype.$$v._doNotTreatPrivateMethodsAsNative);
		Object.defineProperty($$this.$$Analyzer, '_treatThisAsDynamic', Analyzer.prototype.$$v._treatThisAsDynamic);
		Object.defineProperty($$this.$$Analyzer, '_indent', Analyzer.prototype.$$v._indent);
		Object.defineProperty($$this.$$Analyzer, '_count', Analyzer.prototype.$$v._count);
		Object.defineProperty($$this.$$Analyzer, '_level', Analyzer.prototype.$$v._level);
		Object.defineProperty($$this.$$Analyzer, '_inClosure', Analyzer.prototype.$$v._inClosure);
		Object.defineProperty($$this.$$Analyzer, '_inNamespacedFunction', Analyzer.prototype.$$v._inNamespacedFunction);
		Object.defineProperty($$this.$$Analyzer, '_inStaticFunction', Analyzer.prototype.$$v._inStaticFunction);
		Object.defineProperty($$this.$$Analyzer, '_inIfStatement', Analyzer.prototype.$$v._inIfStatement);
		Object.defineProperty($$this.$$Analyzer, '_returnTypeStack', Analyzer.prototype.$$v._returnTypeStack);
		Object.defineProperty($$this.$$Analyzer, '_identifiers', Analyzer.prototype.$$v._identifiers);
		Object.defineProperty($$this.$$Analyzer, '_namespaces', Analyzer.prototype.$$v._namespaces);
		Object.defineProperty($$this.$$Analyzer, '_useNamespaces', Analyzer.prototype.$$v._useNamespaces);
		Object.defineProperty($$this.$$Analyzer, '_types', Analyzer.prototype.$$v._types);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'upLevel', Analyzer.prototype.$$v.upLevel);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'downLevel', Analyzer.prototype.$$v.downLevel);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'output', Analyzer.prototype.$$v.output);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupConstructInRootConstruct', Analyzer.prototype.$$v.lookupConstructInRootConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupRootConstruct', Analyzer.prototype.$$v.lookupRootConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupPackageName', Analyzer.prototype.$$v.lookupPackageName);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupFullyQualifiedName', Analyzer.prototype.$$v.lookupFullyQualifiedName);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'registerNamespace', Analyzer.prototype.$$v.registerNamespace);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupNamespace', Analyzer.prototype.$$v.lookupNamespace);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'hasNamespace', Analyzer.prototype.$$v.hasNamespace);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'registerUseNamespace', Analyzer.prototype.$$v.registerUseNamespace);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'getUseNamespaces', Analyzer.prototype.$$v.getUseNamespaces);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'registerIdentifier', Analyzer.prototype.$$v.registerIdentifier);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupIdentifier', Analyzer.prototype.$$v.lookupIdentifier);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'hasIdentifier', Analyzer.prototype.$$v.hasIdentifier);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'registerType', Analyzer.prototype.$$v.registerType);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupType', Analyzer.prototype.$$v.lookupType);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeImplicitImports', Analyzer.prototype.$$v.analyzeImplicitImports);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeInterfaceConstruct', Analyzer.prototype.$$v.analyzeInterfaceConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzePropertyConstruct', Analyzer.prototype.$$v.analyzePropertyConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeFunctionConstruct', Analyzer.prototype.$$v.analyzeFunctionConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeClassConstruct', Analyzer.prototype.$$v.analyzeClassConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeClassInitializer', Analyzer.prototype.$$v.analyzeClassInitializer);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeClassFunction', Analyzer.prototype.$$v.analyzeClassFunction);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeInternalClasses', Analyzer.prototype.$$v.analyzeInternalClasses);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeInternalInterfaces', Analyzer.prototype.$$v.analyzeInternalInterfaces);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeClassReturnStatement', Analyzer.prototype.$$v.analyzeClassReturnStatement);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeConstructor', Analyzer.prototype.$$v.analyzeConstructor);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeNamespaces', Analyzer.prototype.$$v.analyzeNamespaces);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeProperties', Analyzer.prototype.$$v.analyzeProperties);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeMethods', Analyzer.prototype.$$v.analyzeMethods);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeAccessors', Analyzer.prototype.$$v.analyzeAccessors);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'registerConstruct', Analyzer.prototype.$$v.registerConstruct);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeParameters', Analyzer.prototype.$$v.analyzeParameters);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeStatements', Analyzer.prototype.$$v.analyzeStatements);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeStatement', Analyzer.prototype.$$v.analyzeStatement);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzeExpression', Analyzer.prototype.$$v.analyzeExpression);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'isCoerceRequired', Analyzer.prototype.$$v.isCoerceRequired);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'getGreatestCommonExpressionResult', Analyzer.prototype.$$v.getGreatestCommonExpressionResult);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'getGreatestCommonType', Analyzer.prototype.$$v.getGreatestCommonType);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'analyzePropertyExpression', Analyzer.prototype.$$v.analyzePropertyExpression);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'lookupPropertyType', Analyzer.prototype.$$v.lookupPropertyType);

		//private instance method
		Object.defineProperty($$this.$$Analyzer, 'print', Analyzer.prototype.$$v.print);

		//initialize properties
		Analyzer.$$iinit($$this);

		//call constructor
		if (args !== undefined) Analyzer.$$constructor.apply($$this, args);
	});

	//initializer
	Analyzer.$$iinit = (function ($$this)
	{
		//initialize properties
		$$this.$$Analyzer.$$p._rootConstruct = undefined;
		$$this.$$Analyzer.$$p._rootConstructs = $es4.$$coerce(undefined, Object);
		$$this.$$Analyzer.$$p._translationMode = $es4.$$coerce(undefined, int);
		$$this.$$Analyzer.$$p._doNotTreatPrivateMethodsAsNative = $es4.$$coerce(false, Boolean);
		$$this.$$Analyzer.$$p._treatThisAsDynamic = $es4.$$coerce(false, Boolean);
		$$this.$$Analyzer.$$p._indent = -1;
		$$this.$$Analyzer.$$p._count = -1;
		$$this.$$Analyzer.$$p._level = $es4.$$coerce(0, int);
		$$this.$$Analyzer.$$p._inClosure = false;
		$$this.$$Analyzer.$$p._inNamespacedFunction = false;
		$$this.$$Analyzer.$$p._inStaticFunction = false;
		$$this.$$Analyzer.$$p._inIfStatement = 0;
		$$this.$$Analyzer.$$p._returnTypeStack = [];
		$$this.$$Analyzer.$$p._identifiers = [{}];
		$$this.$$Analyzer.$$p._namespaces = [{}];
		$$this.$$Analyzer.$$p._useNamespaces = [[]];
		$$this.$$Analyzer.$$p._types = {};
	
	});

	//constructor
	Analyzer.$$constructor = (function ()
	{
		var $$this = this;
	});

	////////////////INTERNAL CLASS////////////////
	var NamespaceObj = (function ()
	{
		//class pre initializer
		NamespaceObj.$$sinit = (function ()
		{
			NamespaceObj.$$sinit = undefined;

			//set prototype and constructor
			NamespaceObj.prototype = Object.create(Object.prototype);
			Object.defineProperty(NamespaceObj.prototype, "constructor", { value: NamespaceObj, enumerable: false });

			//hold private values
			Object.defineProperty(NamespaceObj.prototype, '$$v', {value:{}});

			//public instance method
			Object.defineProperty(NamespaceObj.prototype, 'toString', {
			get:function ()
			{
				var $$this = this;

				function toString()
				{
					return 'Namespace::: ' + $$this.name;
				}

				return $$this.$$NamespaceObj.$$toString || ($$this.$$NamespaceObj.$$toString = toString);
			}});

			//properties
			Object.defineProperty(NamespaceObj.prototype, 'name', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.name; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.name = value }
			});

			Object.defineProperty(NamespaceObj.prototype, 'normalizedName', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.normalizedName; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.normalizedName = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'isCustom', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.isCustom; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.isCustom = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'isPrivate', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.isPrivate; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.isPrivate = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'namespaceIsPrivate', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.namespaceIsPrivate; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.namespaceIsPrivate = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'normalizedImportID', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.normalizedImportID; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.normalizedImportID = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'importID', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.importID; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.importID = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'identifier', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.identifier; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.identifier = $es4.$$coerce(value, Identifier); }
			});

			Object.defineProperty(NamespaceObj.prototype, 'isStatic', {
			get:function () { var $$this = this; return $$this.$$NamespaceObj.isStatic; },
			set:function (value) { var $$this = this; $$this.$$NamespaceObj.isStatic = $es4.$$coerce(value, Boolean); }
			});

		});

		//class initializer
		NamespaceObj.$$cinit = (function ()
		{
			NamespaceObj.$$cinit = undefined;
		});

		function NamespaceObj()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof NamespaceObj) || $$this.$$NamespaceObj !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], NamespaceObj) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				NamespaceObj.$$construct($$this, $$args);
			}
		}

		//construct
		NamespaceObj.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (NamespaceObj.$$cinit !== undefined) NamespaceObj.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$NamespaceObj', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//initialize properties
			NamespaceObj.$$iinit($$this);

			//call constructor
			if (args !== undefined) NamespaceObj.$$constructor.apply($$this, args);
		});

		//initializer
		NamespaceObj.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$NamespaceObj.name = undefined;
			$$this.$$NamespaceObj.normalizedName = $es4.$$coerce(undefined, String);
			$$this.$$NamespaceObj.isCustom = $es4.$$coerce(undefined, Boolean);
			$$this.$$NamespaceObj.isPrivate = $es4.$$coerce(undefined, Boolean);
			$$this.$$NamespaceObj.namespaceIsPrivate = $es4.$$coerce(undefined, Boolean);
			$$this.$$NamespaceObj.normalizedImportID = $es4.$$coerce(undefined, String);
			$$this.$$NamespaceObj.importID = $es4.$$coerce(undefined, String);
			$$this.$$NamespaceObj.identifier = $es4.$$coerce(undefined, Identifier);
			$$this.$$NamespaceObj.isStatic = $es4.$$coerce(undefined, Boolean);
		
		});

		//constructor
		NamespaceObj.$$constructor = (function ($$$$name, $$$$importID, $$$$identifier)
		{
			var $$this = this;
			//set default parameter values
			var name = $es4.$$coerce($$$$name, String);
			var importID = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$importID, String);
			var identifier = (2 > arguments.length - 1) ? null : $es4.$$coerce($$$$identifier, Identifier);

			$$this.name = name;
			var parts = name.split('.');
			var part = parts.pop();
			$$this.normalizedName = (parts.length) ? '$[\'' + parts.join('.') + '\'].' + part : part;
			$$this.isCustom = true;
			$$this.isPrivate = name == 'private';
			$$this.namespaceIsPrivate = false;
			if (importID)
			{
				parts = importID.split('.');
				part = parts.pop();
				$$this.normalizedImportID = (parts.length) ? '$[\'' + parts.join('.') + '\'].' + part : part;
			}
			$$this.importID = importID;
			$$this.identifier = identifier;
		});

		return $es4.$$class(NamespaceObj, null, 'NamespaceObj');
	})();

	////////////////INTERNAL CLASS////////////////
	var Type = (function ()
	{
		//class pre initializer
		Type.$$sinit = (function ()
		{
			Type.$$sinit = undefined;

			//set prototype and constructor
			Type.prototype = Object.create(Object.prototype);
			Object.defineProperty(Type.prototype, "constructor", { value: Type, enumerable: false });

			//hold private values
			Object.defineProperty(Type.prototype, '$$v', {value:{}});

			//public instance method
			Object.defineProperty(Type.prototype, 'toString', {
			get:function ()
			{
				var $$this = this;

				function toString()
				{
					if ($$this.construct)
					{
						return 'Type::: ' + $$this.name + ' Construct: ' + (($$this.construct.identifierToken) ? $$this.construct.identifierToken.data : '');
					}
					else
					{
						return 'Type::: ' + $$this.name;
					}
				}

				return $$this.$$Type.$$toString || ($$this.$$Type.$$toString = toString);
			}});

			//properties
			Object.defineProperty(Type.prototype, 'name', {
			get:function () { var $$this = this; return $$this.$$Type.name; },
			set:function (value) { var $$this = this; $$this.$$Type.name = value }
			});

			Object.defineProperty(Type.prototype, 'fullyQualifiedName', {
			get:function () { var $$this = this; return $$this.$$Type.fullyQualifiedName; },
			set:function (value) { var $$this = this; $$this.$$Type.fullyQualifiedName = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(Type.prototype, 'packageName', {
			get:function () { var $$this = this; return $$this.$$Type.packageName; },
			set:function (value) { var $$this = this; $$this.$$Type.packageName = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(Type.prototype, 'rootConstruct', {
			get:function () { var $$this = this; return $$this.$$Type.rootConstruct; },
			set:function (value) { var $$this = this; $$this.$$Type.rootConstruct = $es4.$$coerce(value, Object); }
			});

			Object.defineProperty(Type.prototype, 'construct', {
			get:function () { var $$this = this; return $$this.$$Type.construct; },
			set:function (value) { var $$this = this; $$this.$$Type.construct = value }
			});

			Object.defineProperty(Type.prototype, 'isGlobal', {
			get:function () { var $$this = this; return $$this.$$Type.isGlobal; },
			set:function (value) { var $$this = this; $$this.$$Type.isGlobal = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Type.prototype, 'isInterface', {
			get:function () { var $$this = this; return $$this.$$Type.isInterface; },
			set:function (value) { var $$this = this; $$this.$$Type.isInterface = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Type.prototype, 'accessed', {
			get:function () { var $$this = this; return $$this.$$Type.accessed; },
			set:function (value) { var $$this = this; $$this.$$Type.accessed = $es4.$$coerce(value, Boolean); }
			});

		});

		//class initializer
		Type.$$cinit = (function ()
		{
			Type.$$cinit = undefined;
		});

		function Type()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof Type) || $$this.$$Type !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Type) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				Type.$$construct($$this, $$args);
			}
		}

		//construct
		Type.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (Type.$$cinit !== undefined) Type.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$Type', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//initialize properties
			Type.$$iinit($$this);

			//call constructor
			if (args !== undefined) Type.$$constructor.apply($$this, args);
		});

		//initializer
		Type.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$Type.name = undefined;
			$$this.$$Type.fullyQualifiedName = $es4.$$coerce(undefined, String);
			$$this.$$Type.packageName = $es4.$$coerce(undefined, String);
			$$this.$$Type.rootConstruct = $es4.$$coerce(undefined, Object);
			$$this.$$Type.construct = undefined;
			$$this.$$Type.isGlobal = $es4.$$coerce(undefined, Boolean);
			$$this.$$Type.isInterface = $es4.$$coerce(undefined, Boolean);
			$$this.$$Type.accessed = $es4.$$coerce(undefined, Boolean);
		
		});

		//constructor
		Type.$$constructor = (function ($$$$name, $$$$fullyQualifiedName, $$$$rootConstruct, $$$$construct)
		{
			var $$this = this;
			//set default parameter values
			var name = $es4.$$coerce($$$$name, String);
			var fullyQualifiedName = $es4.$$coerce($$$$fullyQualifiedName, String);
			var rootConstruct = $es4.$$coerce($$$$rootConstruct, Object);
			var construct = $$$$construct;

			$$this.name = name;
			$$this.fullyQualifiedName = (fullyQualifiedName) ? fullyQualifiedName : name;
			var parts = fullyQualifiedName.split('.');
			if (parts.length > 1)
			{
				parts.pop();
				$$this.packageName = parts.join('.');
			}
			else
			{
				$$this.packageName = '';
			}
			$$this.rootConstruct = rootConstruct;
			$$this.construct = construct;
			$$this.isGlobal = false;
			$$this.isInterface = false;
			$$this.accessed = false;
		});

		return $es4.$$class(Type, null, 'Type');
	})();

	////////////////INTERNAL CLASS////////////////
	var ExpressionResult = (function ()
	{
		//class pre initializer
		ExpressionResult.$$sinit = (function ()
		{
			ExpressionResult.$$sinit = undefined;

			//set prototype and constructor
			ExpressionResult.prototype = Object.create(Object.prototype);
			Object.defineProperty(ExpressionResult.prototype, "constructor", { value: ExpressionResult, enumerable: false });

			//hold private values
			Object.defineProperty(ExpressionResult.prototype, '$$v', {value:{}});

			//properties
			Object.defineProperty(ExpressionResult.prototype, 'type', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.type; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.type = value }
			});

			Object.defineProperty(ExpressionResult.prototype, 'isNaN', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.isNaN; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.isNaN = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(ExpressionResult.prototype, 'isNull', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.isNull; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.isNull = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(ExpressionResult.prototype, 'isUndefined', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.isUndefined; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.isUndefined = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(ExpressionResult.prototype, 'isVoid', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.isVoid; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.isVoid = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(ExpressionResult.prototype, 'varIdentifier', {
			get:function () { var $$this = this; return $$this.$$ExpressionResult.varIdentifier; },
			set:function (value) { var $$this = this; $$this.$$ExpressionResult.varIdentifier = $es4.$$coerce(value, Identifier); }
			});

		});

		//class initializer
		ExpressionResult.$$cinit = (function ()
		{
			ExpressionResult.$$cinit = undefined;
		});

		function ExpressionResult()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof ExpressionResult) || $$this.$$ExpressionResult !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ExpressionResult) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				ExpressionResult.$$construct($$this, $$args);
			}
		}

		//construct
		ExpressionResult.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (ExpressionResult.$$cinit !== undefined) ExpressionResult.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$ExpressionResult', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//initialize properties
			ExpressionResult.$$iinit($$this);

			//call constructor
			if (args !== undefined) ExpressionResult.$$constructor.apply($$this, args);
		});

		//initializer
		ExpressionResult.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$ExpressionResult.type = undefined;
			$$this.$$ExpressionResult.isNaN = $es4.$$coerce(undefined, Boolean);
			$$this.$$ExpressionResult.isNull = $es4.$$coerce(undefined, Boolean);
			$$this.$$ExpressionResult.isUndefined = $es4.$$coerce(undefined, Boolean);
			$$this.$$ExpressionResult.isVoid = $es4.$$coerce(undefined, Boolean);
			$$this.$$ExpressionResult.varIdentifier = $es4.$$coerce(undefined, Identifier);
		
		});

		//constructor
		ExpressionResult.$$constructor = (function ($$$$type, $$$$isNaN, $$$$isNull, $$$$isUndefined, $$$$isVoid, $$$$varIdentifier)
		{
			var $$this = this;
			//set default parameter values
			var type = $$$$type;
			var isNaN = $es4.$$coerce($$$$isNaN, Boolean);
			var isNull = $es4.$$coerce($$$$isNull, Boolean);
			var isUndefined = $es4.$$coerce($$$$isUndefined, Boolean);
			var isVoid = $es4.$$coerce($$$$isVoid, Boolean);
			var varIdentifier = (5 > arguments.length - 1) ? null : $es4.$$coerce($$$$varIdentifier, Identifier);

			$$this.type = type;
			$$this.isNaN = isNaN;
			$$this.isNull = isNull;
			$$this.isUndefined = isUndefined;
			$$this.isVoid = isVoid;
			$$this.varIdentifier = varIdentifier;
		});

		return $es4.$$class(ExpressionResult, null, 'ExpressionResult');
	})();

	////////////////INTERNAL CLASS////////////////
	var Identifier = (function ()
	{
		//class pre initializer
		Identifier.$$sinit = (function ()
		{
			Identifier.$$sinit = undefined;

			//set prototype and constructor
			Identifier.prototype = Object.create(Object.prototype);
			Object.defineProperty(Identifier.prototype, "constructor", { value: Identifier, enumerable: false });

			//hold private values
			Object.defineProperty(Identifier.prototype, '$$v', {value:{}});

			//public instance method
			Object.defineProperty(Identifier.prototype, 'toString', {
			get:function ()
			{
				var $$this = this;

				function toString()
				{
					return 'Identifier::: ' + $$this.name + ', scope: ' + $$this.scope;
				}

				return $$this.$$Identifier.$$toString || ($$this.$$Identifier.$$toString = toString);
			}});

			//properties
			Object.defineProperty(Identifier.prototype, 'name', {
			get:function () { var $$this = this; return $$this.$$Identifier.name; },
			set:function (value) { var $$this = this; $$this.$$Identifier.name = value }
			});

			Object.defineProperty(Identifier.prototype, 'type', {
			get:function () { var $$this = this; return $$this.$$Identifier.type; },
			set:function (value) { var $$this = this; $$this.$$Identifier.type = value }
			});

			Object.defineProperty(Identifier.prototype, 'vectorType', {
			get:function () { var $$this = this; return $$this.$$Identifier.vectorType; },
			set:function (value) { var $$this = this; $$this.$$Identifier.vectorType = value }
			});

			Object.defineProperty(Identifier.prototype, 'namespaceObj', {
			get:function () { var $$this = this; return $$this.$$Identifier.namespaceObj; },
			set:function (value) { var $$this = this; $$this.$$Identifier.namespaceObj = value }
			});

			Object.defineProperty(Identifier.prototype, 'construct', {
			get:function () { var $$this = this; return $$this.$$Identifier.construct; },
			set:function (value) { var $$this = this; $$this.$$Identifier.construct = value }
			});

			Object.defineProperty(Identifier.prototype, 'isStatic', {
			get:function () { var $$this = this; return $$this.$$Identifier.isStatic; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isStatic = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isNative', {
			get:function () { var $$this = this; return $$this.$$Identifier.isNative; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isNative = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isPrivate', {
			get:function () { var $$this = this; return $$this.$$Identifier.isPrivate; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isPrivate = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isPackage', {
			get:function () { var $$this = this; return $$this.$$Identifier.isPackage; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isPackage = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isProperty', {
			get:function () { var $$this = this; return $$this.$$Identifier.isProperty; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isProperty = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isMethod', {
			get:function () { var $$this = this; return $$this.$$Identifier.isMethod; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isMethod = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isGlobal', {
			get:function () { var $$this = this; return $$this.$$Identifier.isGlobal; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isGlobal = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isType', {
			get:function () { var $$this = this; return $$this.$$Identifier.isType; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isType = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isImport', {
			get:function () { var $$this = this; return $$this.$$Identifier.isImport; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isImport = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isNamespace', {
			get:function () { var $$this = this; return $$this.$$Identifier.isNamespace; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isNamespace = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isInternal', {
			get:function () { var $$this = this; return $$this.$$Identifier.isInternal; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isInternal = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'scope', {
			get:function () { var $$this = this; return $$this.$$Identifier.scope; },
			set:function (value) { var $$this = this; $$this.$$Identifier.scope = value }
			});

			Object.defineProperty(Identifier.prototype, 'accessed', {
			get:function () { var $$this = this; return $$this.$$Identifier.accessed; },
			set:function (value) { var $$this = this; $$this.$$Identifier.accessed = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'fullPackageName', {
			get:function () { var $$this = this; return $$this.$$Identifier.fullPackageName; },
			set:function (value) { var $$this = this; $$this.$$Identifier.fullPackageName = $es4.$$coerce(value, String); }
			});

			Object.defineProperty(Identifier.prototype, 'isVar', {
			get:function () { var $$this = this; return $$this.$$Identifier.isVar; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isVar = $es4.$$coerce(value, Boolean); }
			});

			Object.defineProperty(Identifier.prototype, 'isVarInitialized', {
			get:function () { var $$this = this; return $$this.$$Identifier.isVarInitialized; },
			set:function (value) { var $$this = this; $$this.$$Identifier.isVarInitialized = $es4.$$coerce(value, Boolean); }
			});

		});

		//class initializer
		Identifier.$$cinit = (function ()
		{
			Identifier.$$cinit = undefined;
		});

		function Identifier()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof Identifier) || $$this.$$Identifier !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Identifier) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				Identifier.$$construct($$this, $$args);
			}
		}

		//construct
		Identifier.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (Identifier.$$cinit !== undefined) Identifier.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$Identifier', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//initialize properties
			Identifier.$$iinit($$this);

			//call constructor
			if (args !== undefined) Identifier.$$constructor.apply($$this, args);
		});

		//initializer
		Identifier.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$Identifier.name = undefined;
			$$this.$$Identifier.type = undefined;
			$$this.$$Identifier.vectorType = undefined;
			$$this.$$Identifier.namespaceObj = undefined;
			$$this.$$Identifier.construct = undefined;
			$$this.$$Identifier.isStatic = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isNative = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isPrivate = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isPackage = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isProperty = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isMethod = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isGlobal = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isType = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isImport = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isNamespace = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isInternal = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.scope = undefined;
			$$this.$$Identifier.accessed = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.fullPackageName = $es4.$$coerce(undefined, String);
			$$this.$$Identifier.isVar = $es4.$$coerce(undefined, Boolean);
			$$this.$$Identifier.isVarInitialized = $es4.$$coerce(undefined, Boolean);
		
		});

		//constructor
		Identifier.$$constructor = (function ($$$$name, $$$$type, $$$$vectorType)
		{
			var $$this = this;
			//set default parameter values
			var name = $$$$name;
			var type = $$$$type;
			var vectorType = (2 > arguments.length - 1) ? null : $$$$vectorType;

			$$this.name = name;
			$$this.type = type;
			$$this.vectorType = vectorType;
			$$this.namespaceObj;
			$$this.construct;
			$$this.isStatic = false;
			$$this.isNative = false;
			$$this.isPrivate = false;
			$$this.isPackage = false;
			$$this.isProperty = false;
			$$this.isMethod = false;
			$$this.isGlobal = false;
			$$this.isType = false;
			$$this.isImport = false;
			$$this.isNamespace = false;
			$$this.scope;
			$$this.accessed = false;
			$$this.fullPackageName;
			$$this.isVar = false;
			$$this.isVarInitialized = false;
		});

		return $es4.$$class(Identifier, null, 'Identifier');
	})();

	return $es4.$$class(Analyzer, {CLASSES:[NamespaceObj, Type, ExpressionResult, Identifier]}, 'sweetrush.core::Analyzer');
})();
//sweetrush.core.Analyzer


//sweetrush.core.Lexer
$es4.$$package('sweetrush.core').Lexer = (function ()
{
	//imports
	var Transcompiler;
	var Token;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//properties
	var $$j = {};
	Object.defineProperty(Lexer, 'grammar', {
	get:function () { if (Lexer.$$cinit !== undefined) Lexer.$$cinit(); return $$j.grammar; },
	set:function (value) { if (Lexer.$$cinit !== undefined) Lexer.$$cinit(); $$j.grammar = $es4.$$coerce(value, Array); }
	});


	//class pre initializer
	Lexer.$$sinit = (function ()
	{
		Lexer.$$sinit = undefined;

		//initialize imports
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Token = $es4.$$['sweetrush.obj'].Token;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Construct = $es4.$$['sweetrush.obj'].Construct;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		Parser = $es4.$$['sweetrush.core'].Parser;

		//set prototype and constructor
		Lexer.prototype = Object.create(Object.prototype);
		Object.defineProperty(Lexer.prototype, "constructor", { value: Lexer, enumerable: false });

		//hold private values
		Object.defineProperty(Lexer.prototype, '$$v', {value:{}});
	});

	//class initializer
	Lexer.$$cinit = (function ()
	{
		Lexer.$$cinit = undefined;

		//initialize properties
		$$j.grammar = $es4.$$coerce([Token.SpaceTokenType, Token.TabTokenType, Token.EOSTokenType, Token.NewLineTokenType, Token.OpenBracketTokenType, Token.ClosedBracketTokenType, Token.OpenParenTokenType, Token.ClosedParenTokenType, Token.VectorDotOpenArrowTokenType, Token.XMLTokenType, Token.XMLCDATATokenType, Token.EqualityTokenType, Token.BitwiseLeftShiftAssignmentTokenType, Token.BitwiseUnsignedRightShiftAssignmentTokenType, Token.BitwiseRightShiftAssignmentTokenType, Token.BitwiseLeftShiftTokenType, Token.BitwiseUnsignedRightShiftTokenType, Token.BitwiseRightShiftTokenType, Token.RelationalTokenType, Token.AddWithAssignmentTokenType, Token.DivWithAssignmentTokenType, Token.ModWithAssignmentTokenType, Token.MulWithAssignmentTokenType, Token.SubWithAssignmentTokenType, Token.AssignmentTokenType, Token.NamespaceQualifierTokenType, Token.ColonTokenType, Token.CommaTokenType, Token.BooleanTokenType, Token.StringTokenType, Token.AsTokenType, Token.DeleteTokenType, Token.IfTokenType, Token.ElseTokenType, Token.EachTokenType, Token.ForTokenType, Token.WhileTokenType, Token.DoTokenType, Token.TryTokenType, Token.CatchTokenType, Token.BreakTokenType, Token.InTokenType, Token.ContinueTokenType, Token.DefaultTokenType, Token.ConstTokenType, Token.WithTokenType, Token.FinallyTokenType, Token.ThisTokenType, Token.TypeofTokenType, Token.NullTokenType, Token.UndefinedTokenType, Token.VoidTokenType, Token.SuperTokenType, Token.ReturnTokenType, Token.ThrowTokenType, Token.TernaryTokenType, Token.ClassTokenType, Token.ImportTokenType, Token.ExtendsTokenType, Token.ImplementsTokenType, Token.OverrideTokenType, Token.StaticTokenType, Token.DynamicTokenType, Token.InterfaceTokenType, Token.FinalTokenType, Token.NamespaceKeywordTokenType, Token.NewTokenType, Token.UseTokenType, Token.CaseTokenType, Token.FunctionTokenType, Token.VarTokenType, Token.NumberTokenType, Token.AndWithAssignmentTokenType, Token.OrWithAssignmentTokenType, Token.AndTokenType, Token.OrTokenType, Token.BitwiseAndAssignmentTokenType, Token.BitwiseOrAssignmentTokenType, Token.BitwiseXorAssignmentTokenType, Token.BitwiseAndTokenType, Token.BitwiseNotTokenType, Token.BitwiseOrTokenType, Token.BitwiseXorTokenType, Token.AtTokenType, Token.SwitchTokenType, Token.DotDotTokenType, Token.DotTokenType, Token.NotTokenType, Token.IncrementTokenType, Token.DecrementTokenType, Token.OpenBraceTokenType, Token.ClosedBraceTokenType, Token.PackageTokenType, Token.IsTokenType, Token.NaNTokenType, Token.InstanceofTokenType, Token.IdentifierTokenType, Token.CommentTokenType, Token.MultiLineCommentTokenType, Token.AddTokenType, Token.SubTokenType, Token.RegExpTokenType, Token.DivTokenType, Token.MulTokenType, Token.ModTokenType, Token.UFOTokenType], Array);
	
	});

	//public static method
	Lexer.lex = (function ($$$$input, $$$$grammar, $$$$internal_)
	{
		if (Lexer.$$cinit !== undefined) Lexer.$$cinit();

		//set default parameter values
		var input = $es4.$$coerce($$$$input, String);
		var grammar = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$grammar, Array);
		var internal_ = (2 > arguments.length - 1) ? null : $$$$internal_;

		var s = ($es4.$$primitive(new Date())).getTime();
		if (!grammar)
		{
			grammar = Lexer.grammar;
		}
		if (!internal_)
		{
			input = input.split(/\r\n/).join('\n');
		}
		var token;
		var tokens = [];
		var matcherObj = Lexer.matcher(input, grammar, internal_);
		while ((token = matcherObj.find()) != null)
		{
			tokens.push(token);
		}
		if (Transcompiler.DEBUG >= 5 && !internal_)
		{
			trace('Tokens length: ' + tokens.length + ', Total time: ' + ((($es4.$$primitive(new Date())).getTime() - s) / 1000) + ' seconds.\n');
		}
		return Token.getNewResult(tokens, matcherObj.getIndex());
	});

	//private static method
	Lexer.matcher = (function ($$$$input, $$$$grammar, $$$$internal_)
	{
		if (Lexer.$$cinit !== undefined) Lexer.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var grammar = $$$$grammar;
		var internal_ = $$$$internal_;

		var tokensIndex = 0;
		var tokens = [];
		var currentLine = 1;
		var currentPosition = 0;
		var length = input.length;
		var foundTokens = [];
		var find = function () 
		{
			if (tokens.length)
			{
				var token = tokens[tokensIndex];
				if (token.type == Token.NewLineTokenType)
				{
					token.position = currentPosition + 1;
					token.line = currentLine;
					currentLine++;
					currentPosition = 0;
				}
				else
				{
					token.position = currentPosition + 1;
					token.line = currentLine;
					currentPosition += token.data.length;
				}
				if (Transcompiler.DEBUG >= 4 && !internal_)
				{
					trace(token.line + ' : ' + token.position + ' : ' + token.type.name + ' => ' + token.data);
				}
				if (++tokensIndex == tokens.length)
				{
					tokens = [];
					tokensIndex = 0;
				}
				return token;
			}
			if (!input.length)
			{
				return null;
			}
			var grammarLength = grammar.length;
			for (var i = 0; i < grammarLength; i++)
			{
				var type = grammar[i];
				var result = Token.tokenFunctions[type].find(input, foundTokens);
				if (result)
				{
					input = input.slice(result.index + 1);
					tokens = result.tokens;
					tokensIndex = 0;
					foundTokens.push(tokens);
					return find();
				}
			}
			if (!internal_ && input.length)
			{
				throw $es4.$$primitive(new Error('Unknown token found on line ' + currentLine + ', at position ' + (currentPosition + 1)));
			}
			return null;
		}
;
		var getIndex = function () 
		{
			return length - input.length;
		}
;
		var api = {};
		api.find = find;
		api.getIndex = getIndex;
		return api;
	});
	function Lexer()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Lexer) || $$this.$$Lexer !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Lexer) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Lexer.$$construct($$this, $$args);
		}
	}

	//construct
	Lexer.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Lexer.$$cinit !== undefined) Lexer.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Lexer', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Lexer.$$iinit($$this);

		//call constructor
		if (args !== undefined) Lexer.$$constructor.apply($$this, args);
	});

	//initializer
	Lexer.$$iinit = (function ($$this)
	{
	});

	//constructor
	Lexer.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Lexer, null, 'sweetrush.core::Lexer');
})();
//sweetrush.core.Lexer


//sweetrush.core.Parser
$es4.$$package('sweetrush.core').Parser = (function ()
{
	//imports
	var Construct;
	var Token;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//class pre initializer
	Parser.$$sinit = (function ()
	{
		Parser.$$sinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;

		//set prototype and constructor
		Parser.prototype = Object.create(Object.prototype);
		Object.defineProperty(Parser.prototype, "constructor", { value: Parser, enumerable: false });

		//hold private values
		Object.defineProperty(Parser.prototype, '$$v', {value:{}});
	});

	//class initializer
	Parser.$$cinit = (function ()
	{
		Parser.$$cinit = undefined;
	});

	//public static method
	Parser.parse = (function ($$$$tokens, $$$$compileConstants, $$$$release)
	{
		if (Parser.$$cinit !== undefined) Parser.$$cinit();

		//set default parameter values
		var tokens = $es4.$$coerce($$$$tokens, Array);
		var compileConstants = $es4.$$coerce($$$$compileConstants, Object);
		var release = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$release, Boolean);

		if (!tokens.length)
		{
			return null;
		}
		if (!compileConstants)
		{
			compileConstants = {};
		}
		var index = -1;
		var ahead = 1;
		var rootConstruct = Construct.getNewRootConstruct();
		var callsSuper = false;
		var inCompileConstant = false;
		var add = true;
		var previousAddValue = add;
		var token;
		var statementImportConstructs = [];
		loopa:		while (token = peek(ahead))
		{
			ahead++;
			switch (token.type)
			{
				case Token.PackageTokenType:
					var p = matchPackageConstruct(rootConstruct);
					if (add)
					{
						rootConstruct.packageConstruct = p;
						rootConstruct.packageConstruct.rootConstruct = rootConstruct;
					}
					break;
				case Token.ImportTokenType:
					var p = matchImportConstruct();
					if (add)
					{
						rootConstruct.importConstructs.push(p);
					}
					break;
				case Token.ElseTokenType:
					match(Token.ElseTokenType);
					if (inCompileConstant)
					{
						throw $es4.$$primitive(new Error('nested compile constants are not supported'));
					}
					inCompileConstant = true;
					add = !previousAddValue;
					match(Token.OpenBraceTokenType);
					break;
				case Token.IfTokenType:
					match(Token.IfTokenType);
					match(Token.OpenParenTokenType);
					if (inCompileConstant)
					{
						throw $es4.$$primitive(new Error('nested compile constants are not supported'));
					}
				case Token.IdentifierTokenType:
					if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
					{
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
						var compileConstantIdentifier = '';
						compileConstantIdentifier += match(Token.IdentifierTokenType).data;
						compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
						compileConstantIdentifier += match(Token.IdentifierTokenType).data;
						match(Token.ClosedParenTokenType, true);
						inCompileConstant = true;
						add = compileConstants[compileConstantIdentifier] == 'true';
						match(Token.OpenBraceTokenType);
						break;
					}
					continue loopa;
				case Token.ClosedBraceTokenType:
					if (inCompileConstant)
					{
						match(Token.ClosedBraceTokenType);
						inCompileConstant = false;
						previousAddValue = add;
						add = true;
						break;
					}
				case Token.FinalTokenType:
				case Token.DynamicTokenType:
					continue loopa;
				case Token.ClassTokenType:
					var classConstruct = matchClassConstruct();
					if (add)
					{
						classConstruct.isInternal = true;
						classConstruct.rootConstruct = rootConstruct;
						rootConstruct.importConstructs = classConstruct.importConstructs.concat(rootConstruct.importConstructs);
						rootConstruct.classConstructs.push(classConstruct);
					}
					break;
				case Token.InterfaceTokenType:
					var interfaceConstruct = matchInterfaceConstruct();
					if (add)
					{
						interfaceConstruct.isInternal = true;
						interfaceConstruct.rootConstruct = rootConstruct;
						rootConstruct.interfaceConstructs.push(interfaceConstruct);
					}
					break;
				case Token.FunctionTokenType:
					var methodConstruct = matchMethodConstruct();
					if (add)
					{
						methodConstruct.isInternal = true;
						methodConstruct.rootConstruct = rootConstruct;
						if (!(methodConstruct.UNIMPLEMENTEDToken && release))
						{
							rootConstruct.methodConstructs.push(methodConstruct);
						}
					}
					break;
				case Token.NamespaceKeywordTokenType:
				case Token.VarTokenType:
					var propertyConstruct = matchPropertyConstruct();
					if (add)
					{
						propertyConstruct.isInternal = true;
						propertyConstruct.rootConstruct = rootConstruct;
						rootConstruct.propertyConstructs.push(propertyConstruct);
					}
					break;
				default:
					throw error('Unexpected token found11.', token);
			}
			ahead = 1;
		}

		function matchTypeConstruct() 
		{
			var typeConstruct = Construct.getNewTypeConstruct();
			var token = peek(1);
			if (token.type == Token.MulTokenType)
			{
				typeConstruct.mulToken = match(Token.MulTokenType);
			}
			else if (token.type == Token.VoidTokenType)
			{
				typeConstruct.voidToken = match(Token.VoidTokenType);
			}
			else
			{
				typeConstruct.nameConstruct = matchNameConstruct();
				if (match(Token.VectorDotOpenArrowTokenType, true))
				{
					typeConstruct.vectorNameConstruct = matchNameConstruct();
					match(Token.VectorClosedArrowTokenType);
				}
			}
			return typeConstruct;
		}
;

		function matchPackageConstruct($$$$rootConstruct) 
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;

			var packageConstruct = Construct.getNewPackageConstruct();
			match(Token.PackageTokenType);
			if (peek(1).type == Token.IdentifierTokenType)
			{
				packageConstruct.nameConstruct = matchNameConstruct();
			}
			else
			{
				packageConstruct.nameConstruct = Construct.getNewNameConstruct();
			}
			match(Token.OpenBraceTokenType);
			var ahead = 1;
			var metaDataConstructs = [];
			var token;
			var inCompileConstant = false;
			var add = true;
			var previousAddValue = add;
			loopb:			while (token = peek(ahead, 0, true))
			{
				ahead++;
				switch (token.type)
				{
					case Token.ImportTokenType:
						var c = matchImportConstruct();
						if (add)
						{
							packageConstruct.importConstructs.push(c);
						}
						break;
					case Token.OpenBracketTokenType:
						var c = matchMetaDataConstruct();
						if (add)
						{
							metaDataConstructs.push(c);
						}
						ahead = 1;
						continue loopb;
					case Token.StaticTokenType:
					case Token.FinalTokenType:
					case Token.OverrideTokenType:
					case Token.DynamicTokenType:
						continue loopb;
					case Token.UseTokenType:
						var useConstruct = matchUseConstruct();
						if (add)
						{
							packageConstruct.useConstructs.push(useConstruct);
						}
						break;
					case Token.NamespaceKeywordTokenType:
						var p = matchPropertyConstruct(metaDataConstructs);
						if (add)
						{
							packageConstruct.propertyConstruct = p;
							packageConstruct.propertyConstruct.packageConstruct = packageConstruct;
							packageConstruct.propertyConstruct.rootConstruct = rootConstruct;
						}
						break;
					case Token.FunctionTokenType:
						var m = matchMethodConstruct(metaDataConstructs);
						if (add)
						{
							packageConstruct.methodConstruct = m;
							packageConstruct.methodConstruct.packageConstruct = packageConstruct;
							packageConstruct.methodConstruct.rootConstruct = rootConstruct;
						}
						break;
					case Token.ClassTokenType:
						if (add && packageConstruct.classConstruct)
						{
							throw error('Multiple definitions found in package.', token);
						}
						var c = matchClassConstruct();
						if (add)
						{
							packageConstruct.classConstruct = c;
							packageConstruct.classConstruct.packageConstruct = packageConstruct;
							packageConstruct.importConstructs = packageConstruct.classConstruct.importConstructs.concat(packageConstruct.importConstructs);
							packageConstruct.classConstruct.rootConstruct = rootConstruct;
						}
						break;
					case Token.InterfaceTokenType:
						if (add && packageConstruct.interfaceConstruct)
						{
							throw error('Multiple definitions found in package.', token);
						}
						var c = matchInterfaceConstruct();
						if (add)
						{
							packageConstruct.interfaceConstruct = c;
							packageConstruct.interfaceConstruct.packageConstruct = packageConstruct;
							packageConstruct.interfaceConstruct.rootConstruct = rootConstruct;
						}
						break;
					case Token.ElseTokenType:
						match(Token.ElseTokenType);
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
						inCompileConstant = true;
						add = !previousAddValue;
						match(Token.OpenBraceTokenType);
						break;
					case Token.IfTokenType:
						match(Token.IfTokenType);
						match(Token.OpenParenTokenType);
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
					case Token.IdentifierTokenType:
						if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
						{
							if (inCompileConstant)
							{
								throw $es4.$$primitive(new Error('nested compile constants are not supported'));
							}
							var compileConstantIdentifier = '';
							compileConstantIdentifier += match(Token.IdentifierTokenType).data;
							compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
							compileConstantIdentifier += match(Token.IdentifierTokenType).data;
							match(Token.ClosedParenTokenType, true);
							inCompileConstant = true;
							add = compileConstants[compileConstantIdentifier] == 'true';
							match(Token.OpenBraceTokenType);
							break;
						}
						continue loopb;
					case Token.ClosedBraceTokenType:
						if (inCompileConstant)
						{
							match(Token.ClosedBraceTokenType);
							inCompileConstant = false;
							previousAddValue = add;
							add = true;
							break;
						}
						break loopb;
					default:
						throw error('Unexpected token found1.', token);
				}
				metaDataConstructs = [];
				ahead = 1;
			}
			match(Token.ClosedBraceTokenType);
			return packageConstruct;
		}
;

		function matchMetaDataConstruct() 
		{
			var metaDataConstruct = Construct.getNewMetaDataConstruct();
			match(Token.OpenBracketTokenType);
			while (!match(Token.ClosedBracketTokenType, true))
			{
				metaDataConstruct.tokens.push(next());
			}
			match(Token.EOSTokenType, true, true);
			return metaDataConstruct;
		}
;

		function matchClassConstruct() 
		{
			var classConstruct = Construct.getNewClassConstruct();
			var token;
			loop1a:			while (token = next(0, true))
			{
				switch (token.type)
				{
					case Token.IdentifierTokenType:
						if (token.data == 'UNIMPLEMENTED')
						{
							classConstruct.UNIMPLEMENTEDToken = token;
						}
						else
						{
							classConstruct.namespaceToken = token;
						}
						break;
					case Token.StaticTokenType:
						classConstruct.staticToken = token;
						break;
					case Token.FinalTokenType:
						classConstruct.finalToken = token;
						break;
					case Token.DynamicTokenType:
						classConstruct.dynamicToken = token;
						break;
					case Token.ClassTokenType:
						break loop1a;
					default:
						throw error('Unexpected token found2.', token);
				}
			}
			classConstruct.identifierToken = match(Token.IdentifierTokenType);
			loop2a:			while (token = next())
			{
				switch (token.type)
				{
					case Token.ExtendsTokenType:
						classConstruct.extendsNameConstruct = matchNameConstruct();
						break;
					case Token.ImplementsTokenType:
						classConstruct.implementsNameConstructs.push(matchNameConstruct());
						while (token = peek(1))
						{
							if (token.type != Token.CommaTokenType)
							{
								continue loop2a;
							}
							match(Token.CommaTokenType);
							classConstruct.implementsNameConstructs.push(matchNameConstruct());
						}
						break;
					case Token.OpenBraceTokenType:
						break loop2a;
					default:
						throw error('Unexpected token found3.', token);
				}
			}
			var add = true;
			var inCompileConstant = false;
			var previousAddValue = add;
			var metaDataConstructs = [];
			var ahead = 1;
			loop3a:			while (token = peek(ahead, 0, true))
			{
				ahead++;
				switch (token.type)
				{
					case Token.ImportTokenType:
						var c = matchImportConstruct();
						if (add)
						{
							classConstruct.importConstructs.push(c);
						}
						break;
					case Token.OpenBracketTokenType:
						var c = matchMetaDataConstruct();
						if (add)
						{
							metaDataConstructs.push(c);
						}
						ahead = 1;
						continue loop3a;
					case Token.OpenBraceTokenType:
						match(Token.OpenBraceTokenType);
						var innerInnerToken;
						while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
						{
							var s = matchStatement();
							if (add)
							{
								classConstruct.initializerStatements.push(s);
							}
						}
						match(Token.ClosedBraceTokenType);
						break;
					case Token.ElseTokenType:
						match(Token.ElseTokenType);
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
						inCompileConstant = true;
						add = !previousAddValue;
						match(Token.OpenBraceTokenType);
						break;
					case Token.IfTokenType:
						match(Token.IfTokenType);
						match(Token.OpenParenTokenType);
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
					case Token.IdentifierTokenType:
						if (peek(ahead, 0, true).type == Token.NamespaceQualifierTokenType && peek(ahead + 1, 0, true).type == Token.IdentifierTokenType)
						{
							if (inCompileConstant)
							{
								throw $es4.$$primitive(new Error('nested compile constants are not supported'));
							}
							var compileConstantIdentifier = '';
							compileConstantIdentifier += match(Token.IdentifierTokenType).data;
							compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
							compileConstantIdentifier += match(Token.IdentifierTokenType).data;
							match(Token.ClosedParenTokenType, true);
							inCompileConstant = true;
							add = compileConstants[compileConstantIdentifier] == 'true';
							match(Token.OpenBraceTokenType);
							break;
						}
					case Token.OverrideTokenType:
					case Token.StaticTokenType:
					case Token.FinalTokenType:
						continue loop3a;
					case Token.VarTokenType:
					case Token.ConstTokenType:
					case Token.NamespaceKeywordTokenType:
						var propertyConstruct = matchPropertyConstruct(metaDataConstructs);
						if (add)
						{
							classConstruct.propertyConstructs.push(propertyConstruct);
						}
						break;
					case Token.FunctionTokenType:
						var methodConstruct = matchMethodConstruct(metaDataConstructs);
						if (methodConstruct.UNIMPLEMENTEDToken && release)
						{
							break;
						}
						if (methodConstruct.identifierToken.data == classConstruct.identifierToken.data)
						{
							if (add)
							{
								classConstruct.constructorMethodConstruct = methodConstruct;
							}
							if (methodConstruct.isJavaScript)
							{
								throw error('Constructor cannot be declared as native.', methodConstruct.identifierToken);
							}
						}
						else if (add)
						{
							classConstruct.methodConstructs.push(methodConstruct);
						}
						break;
					case Token.UseTokenType:
						var useConstruct = matchUseConstruct();
						if (add)
						{
							classConstruct.useConstructs.push(useConstruct);
						}
						break;
					case Token.ClosedBraceTokenType:
						if (inCompileConstant)
						{
							match(Token.ClosedBraceTokenType);
							inCompileConstant = false;
							previousAddValue = add;
							add = true;
							break;
						}
						break loop3a;
					default:
						throw error('Unexpected token found4.', token);
				}
				metaDataConstructs = [];
				ahead = 1;
			}
			match(Token.ClosedBraceTokenType);
			return classConstruct;
		}
;

		function matchUseConstruct() 
		{
			var useConstruct = Construct.getNewUseConstruct();
			useConstruct.useToken = match(Token.UseTokenType);
			match(Token.NamespaceKeywordTokenType);
			useConstruct.namespaceIdentifierToken = match(Token.IdentifierTokenType);
			match(Token.EOSTokenType, true, true);
			return useConstruct;
		}
;

		function matchInterfaceConstruct() 
		{
			var interfaceConstruct = Construct.getNewInterfaceConstruct();
			var token;
			loop1b:			while (token = next())
			{
				switch (token.type)
				{
					case Token.IdentifierTokenType:
						interfaceConstruct.namespaceToken = token;
						break;
					case Token.InterfaceTokenType:
						break loop1b;
					default:
						throw error('Unexpected token found5.', token);
				}
			}
			interfaceConstruct.identifierToken = match(Token.IdentifierTokenType);
			loop2b:			while (token = next())
			{
				switch (token.type)
				{
					case Token.ExtendsTokenType:
						interfaceConstruct.extendsNameConstructs.push(matchNameConstruct());
						while (token = peek(1))
						{
							if (token.type != Token.CommaTokenType)
							{
								continue loop2b;
							}
							match(Token.CommaTokenType);
							interfaceConstruct.extendsNameConstructs.push(matchNameConstruct());
						}
						break;
					case Token.OpenBraceTokenType:
						break loop2b;
					default:
						throw error('Unexpected token found6.', token);
				}
			}
			var ahead = 1;
			loop3b:			while (token = peek(ahead))
			{
				ahead++;
				switch (token.type)
				{
					case Token.FunctionTokenType:
						var methodConstruct = Construct.getNewMethodConstruct();
						match(Token.FunctionTokenType);
						methodConstruct.setToken = match(Token.SetTokenType, true);
						if (!methodConstruct.setToken)
						{
							methodConstruct.getToken = match(Token.GetTokenType, true);
						}
						methodConstruct.identifierToken = match(Token.IdentifierTokenType);
						match(Token.OpenParenTokenType);
						while (!match(Token.ClosedParenTokenType, true))
						{
							methodConstruct.parameterConstructs.push(matchParameterConstruct());
							match(Token.CommaTokenType, true);
						}
						if (match(Token.ColonTokenType, true))
						{
							methodConstruct.typeConstruct = matchTypeConstruct();
						}
						else
						{
							methodConstruct.typeConstruct = Construct.getNewTypeConstruct();
							methodConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
						}
						match(Token.EOSTokenType, true, true);
						interfaceConstruct.methodConstructs.push(methodConstruct);
						break;
					case Token.ClosedBraceTokenType:
						break loop3b;
					default:
						throw error('Unexpected token found7.', token);
				}
				ahead = 1;
			}
			match(Token.ClosedBraceTokenType);
			return interfaceConstruct;
		}
;

		function matchNameConstruct() 
		{
			var nameConstruct = Construct.getNewNameConstruct();
			nameConstruct.identifierTokens.push(match(Token.IdentifierTokenType));
			var token1;
			var token2;
			while ((token1 = peek(1)) && (token2 = peek(2)))
			{
				if (token1.type != Token.DotTokenType)
				{
					break;
				}
				if (token2.type != Token.IdentifierTokenType)
				{
					break;
				}
				match(Token.DotTokenType);
				nameConstruct.identifierTokens.push(match(Token.IdentifierTokenType));
			}
			return nameConstruct;
		}
;

		function matchImportConstruct() 
		{
			var importConstruct = Construct.getNewImportConstruct();
			match(Token.ImportTokenType);
			importConstruct.nameConstruct = matchNameConstruct();
			if (match(Token.DotTokenType, true))
			{
				importConstruct.mulToken = match(Token.MulTokenType);
			}
			match(Token.EOSTokenType, true, true);
			return importConstruct;
		}
;

		function matchPropertyConstruct($$$$metaDataConstructs) 
		{
			//set default parameter values
			var metaDataConstructs = (0 > arguments.length - 1) ? null : $$$$metaDataConstructs;

			var propertyConstruct = Construct.getNewPropertyConstruct();
			var token;
			loop1c:			while (token = next(0, true))
			{
				switch (token.type)
				{
					case Token.IdentifierTokenType:
						propertyConstruct.namespaceToken = token;
						break;
					case Token.StaticTokenType:
						propertyConstruct.staticToken = token;
						break;
					case Token.NamespaceKeywordTokenType:
						propertyConstruct.namespaceKeywordToken = token;
						break loop1c;
					case Token.ConstTokenType:
						propertyConstruct.constToken = token;
						break loop1c;
					case Token.VarTokenType:
						break loop1c;
					default:
						throw error('Unexpected token found8.', token);
				}
			}
			propertyConstruct.identifierToken = match(Token.IdentifierTokenType);
			if (match(Token.ColonTokenType, true))
			{
				propertyConstruct.typeConstruct = matchTypeConstruct();
			}
			else
			{
				propertyConstruct.typeConstruct = Construct.getNewTypeConstruct();
				propertyConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
			}
			match(Token.EOSTokenType, true, true);
			if (metaDataConstructs)
			{
				for (var i = 0; i < metaDataConstructs.length; i++)
				{
					var metaDataConstruct = metaDataConstructs[i];
					if (metaDataConstruct.tokens[0].data == 'Native')
					{
						propertyConstruct.isNative = true;
						if (!propertyConstruct.namespaceToken || propertyConstruct.namespaceToken.data != 'private')
						{
							throw $es4.$$primitive(new Error('native properties must be defined as private'));
						}
						if (propertyConstruct.typeConstruct && !propertyConstruct.typeConstruct.mulToken)
						{
							throw $es4.$$primitive(new Error('native properties must be defined as type *'));
						}
						propertyConstruct.namespaceToken = null;
					}
				}
			}
			if (!match(Token.AssignmentTokenType, true))
			{
				return propertyConstruct;
			}
			propertyConstruct.valueExpression = matchExpression();
			match(Token.EOSTokenType, true, true);
			return propertyConstruct;
		}
;

		function matchMethodConstruct($$$$metaDataConstructs) 
		{
			//set default parameter values
			var metaDataConstructs = (0 > arguments.length - 1) ? null : $$$$metaDataConstructs;

			var methodConstruct = Construct.getNewMethodConstruct();
			var token;
			loop1d:			while (token = next(0, true))
			{
				switch (token.type)
				{
					case Token.IdentifierTokenType:
						if (token.data == 'UNIMPLEMENTED')
						{
							methodConstruct.UNIMPLEMENTEDToken = token;
						}
						else
						{
							methodConstruct.namespaceToken = token;
						}
						break;
					case Token.StaticTokenType:
						methodConstruct.staticToken = token;
						break;
					case Token.OverrideTokenType:
						methodConstruct.overrideToken = token;
						break;
					case Token.FinalTokenType:
						break;
					case Token.FunctionTokenType:
						break loop1d;
					default:
						throw error('Unexpected token found9.', token);
				}
			}
			methodConstruct.setToken = match(Token.SetTokenType, true);
			if (!methodConstruct.setToken)
			{
				methodConstruct.getToken = match(Token.GetTokenType, true);
			}
			methodConstruct.identifierToken = match(Token.IdentifierTokenType);
			match(Token.OpenParenTokenType);
			while (!match(Token.ClosedParenTokenType, true))
			{
				methodConstruct.parameterConstructs.push(matchParameterConstruct());
				match(Token.CommaTokenType, true);
			}
			if (match(Token.ColonTokenType, true))
			{
				methodConstruct.typeConstruct = matchTypeConstruct();
			}
			else
			{
				methodConstruct.typeConstruct = Construct.getNewTypeConstruct();
				methodConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
			}
			if (metaDataConstructs)
			{
				for (var i = 0; i < metaDataConstructs.length; i++)
				{
					var metaDataConstruct = metaDataConstructs[i];
					if (metaDataConstruct.tokens[0].data == 'JavaScript')
					{
						methodConstruct.isJavaScript = true;
					}
					if (metaDataConstruct.tokens[0].data == 'Native')
					{
						methodConstruct.isNative = true;
						if (!methodConstruct.namespaceToken || methodConstruct.namespaceToken.data != 'private')
						{
							throw $es4.$$primitive(new Error('native methods must be defined as private'));
						}
						methodConstruct.namespaceToken = null;
					}
				}
			}
			match(Token.OpenBraceTokenType, undefined, undefined);
			callsSuper = false;
			var open = 1;
			var closed = 0;
			if (methodConstruct.isJavaScript)
			{
				while (token = next(2, undefined))
				{
					if (token.type == Token.ClosedBraceTokenType)
					{
						closed++;
						if (closed == open)
						{
							break;
						}
					}
					if (token.type == Token.OpenBraceTokenType)
					{
						open++;
					}
					methodConstruct.javaScriptString += token.data;
				}
			}
			else
			{
				while (!match(Token.ClosedBraceTokenType, true, undefined))
				{
					methodConstruct.bodyStatements.push(matchStatement(false, methodConstruct.namedFunctionExpressions));
				}
			}
			methodConstruct.callsSuper = callsSuper;
			match(Token.EOSTokenType, true, true);
			return methodConstruct;
		}
;

		function matchParameterConstruct() 
		{
			var argumentConstruct = Construct.getNewParameterConstruct();
			argumentConstruct.restToken = match(Token.RestTokenType, true);
			argumentConstruct.identifierToken = match(Token.IdentifierTokenType);
			if (argumentConstruct.restToken)
			{
				return argumentConstruct;
			}
			if (match(Token.ColonTokenType, true))
			{
				argumentConstruct.typeConstruct = matchTypeConstruct();
			}
			else
			{
				argumentConstruct.typeConstruct = Construct.getNewTypeConstruct();
				argumentConstruct.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
			}
			if (match(Token.AssignmentTokenType, true) && !match(Token.MulTokenType, true))
			{
				argumentConstruct.valueExpression = matchExpression(true);
			}
			return argumentConstruct;
		}
;

		function matchPropertyExpression($$$$construct) 
		{
			//set default parameter values
			var construct = (0 > arguments.length - 1) ? null : $$$$construct;

			var token = peek(1);
			if (token.type == Token.ThisTokenType)
			{
				construct = Construct.getNewThisConstruct();
				construct.thisToken = match(Token.ThisTokenType);
			}
			else if (token.type == Token.SuperTokenType)
			{
				construct = Construct.getNewSuperConstruct();
				construct.superToken = match(Token.SuperTokenType);
				callsSuper = true;
			}
			else if (token.type == Token.AtTokenType)
			{
				match(Token.AtTokenType);
				construct = Construct.getNewAtIdentifierConstruct();
			}
			else if (!construct)
			{
				construct = Construct.getNewIdentifierConstruct();
				construct.identifierToken = match(Token.IdentifierTokenType);
			}
			var propertyExpression = Construct.getNewPropertyExpression();
			propertyExpression.construct = construct;
			var innerPropertyExpression;
			var nextPropertyExpression = propertyExpression;
			loopc:			while (token = peek(1))
			{
				innerPropertyExpression = null;
				switch (token.type)
				{
					case Token.VectorDotOpenArrowTokenType:
						match(Token.VectorDotOpenArrowTokenType);
						construct = Construct.getNewVectorConstruct();
						construct.nameConstruct = matchNameConstruct();
						match(Token.VectorClosedArrowTokenType);
						break;
					case Token.NamespaceQualifierTokenType:
						construct = Construct.getNewNamespaceQualifierConstruct();
						construct.namespaceQualifierToken = match(Token.NamespaceQualifierTokenType);
						construct.identifierToken = nextPropertyExpression.construct.identifierToken;
						construct.namespaceIdentifierToken = match(Token.IdentifierTokenType);
						nextPropertyExpression.construct = construct;
						continue loopc;
					case Token.IdentifierTokenType:
						construct = Construct.getNewIdentifierConstruct();
						construct.identifierToken = match(Token.IdentifierTokenType);
						break;
					case Token.DotTokenType:
						match(Token.DotTokenType);
						if (match(Token.AtTokenType, true))
						{
							construct = Construct.getNewAtIdentifierConstruct();
						}
						else if (match(Token.OpenParenTokenType, true))
						{
							throw $es4.$$primitive(new Error('E4X is not supported'));
							construct = Construct.getNewE4XSearchConstruct();
							construct.expression = matchExpression();
							if (construct.expression.constructor == 'PropertyExpression')
							{
								construct.expression.root = false;
							}
							match(Token.ClosedParenTokenType);
						}
						else
						{
							construct = Construct.getNewDotConstruct();
							construct.identifierToken = match(Token.IdentifierTokenType);
						}
						break;
					case Token.OpenBracketTokenType:
						match(Token.OpenBracketTokenType);
						construct = Construct.getNewArrayAccessorConstruct();
						construct.expression = matchExpression();
						if (construct.expression.constructor == 'PropertyExpression')
						{
							construct.expression.root = false;
						}
						match(Token.ClosedBracketTokenType);
						break;
					case Token.OpenParenTokenType:
						match(Token.OpenParenTokenType);
						construct = Construct.getNewFunctionCallConstruct();
						while (!match(Token.ClosedParenTokenType, true))
						{
							construct.argumentExpressions.push(matchExpression(true));
							match(Token.CommaTokenType, true);
						}
						break;
					default:
						break loopc;
				}
				if (!innerPropertyExpression)
				{
					innerPropertyExpression = Construct.getNewPropertyExpression();
					innerPropertyExpression.construct = construct;
				}
				nextPropertyExpression.nextPropertyExpression = innerPropertyExpression;
				nextPropertyExpression = innerPropertyExpression;
			}
			return propertyExpression;
		}
;

		function matchStatement($$$$dontmatchEOS, $$$$namedFunctionExpressions, $$$$dontReadIn) 
		{
			//set default parameter values
			var dontmatchEOS = (0 > arguments.length - 1) ? false : $es4.$$coerce($$$$dontmatchEOS, Boolean);
			var namedFunctionExpressions = (1 > arguments.length - 1) ? null : $$$$namedFunctionExpressions;
			var dontReadIn = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$dontReadIn, Boolean);

			var statement;
			var token = peek(1, undefined, undefined);
			var innerToken;
			var openBraceTokenType;
			var innerToken1;
			var innerToken2;
			var innerInnerToken;
			var tokenType = token.type;
			var foundCompileConstantIdentifier = false;
			if (peek(2, 0, true).type == Token.NamespaceQualifierTokenType && compileConstants[token.data + peek(2, 0, true).data + peek(3, 0, true).data] !== undefined)
			{
				foundCompileConstantIdentifier = true;
				tokenType = Token.IfTokenType;
			}
			switch (tokenType)
			{
				case Token.ImportTokenType:
					var p = matchImportConstruct();
					statementImportConstructs.push(p);
					statement = Construct.getNewEmptyStatement();
					break;
				case Token.IfTokenType:
					if (!foundCompileConstantIdentifier)
					{
						match(Token.IfTokenType);
					}
					statement = Construct.getNewIfStatement();
					if (!foundCompileConstantIdentifier)
					{
						match(Token.OpenParenTokenType);
					}
					var inCompileConstant = false;
					var inCompileConstantLocal = false;
					var innerStatement;
					var add = true;
					if (peek(1, 0, true).type == Token.IdentifierTokenType && peek(2, 0, true).type == Token.NamespaceQualifierTokenType && compileConstants[peek(1, 0, true).data + peek(2, 0, true).data + peek(3, 0, true).data] !== undefined)
					{
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new Error('nested compile constants are not supported'));
						}
						inCompileConstantLocal = true;
						inCompileConstant = true;
						var compileConstantIdentifier = '';
						compileConstantIdentifier += match(Token.IdentifierTokenType).data;
						compileConstantIdentifier += match(Token.NamespaceQualifierTokenType).data;
						compileConstantIdentifier += match(Token.IdentifierTokenType).data;
						add = compileConstants[compileConstantIdentifier] == 'true';
						var booleanExpression = Construct.getNewBooleanExpression();
						booleanExpression.booleanToken = Token.getNewToken(Token.BooleanTokenType, add.toString());
						statement.conditionExpression = booleanExpression;
					}
					else
					{
						statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
					}
					if (!foundCompileConstantIdentifier)
					{
						match(Token.ClosedParenTokenType);
					}
					foundCompileConstantIdentifier = false;
					openBraceTokenType = match(Token.OpenBraceTokenType, true);
					loopd:					while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
					{
						innerStatement = matchStatement(false, namedFunctionExpressions);
						if (add)
						{
							statement.bodyStatements.push(innerStatement);
						}
						if (!openBraceTokenType)
						{
							break loopd;
						}
					}
					if (openBraceTokenType)
					{
						match(Token.ClosedBraceTokenType);
					}
					while (((innerToken1 = peek(1)) && (innerToken2 = peek(2))) && (innerToken1.type == Token.ElseTokenType && innerToken2.type == Token.IfTokenType))
					{
						match(Token.ElseTokenType);
						match(Token.IfTokenType);
						var elseIfStatement = Construct.getNewElseIfStatement();
						match(Token.OpenParenTokenType);
						elseIfStatement.conditionExpression = matchExpression(false, namedFunctionExpressions);
						match(Token.ClosedParenTokenType);
						openBraceTokenType = match(Token.OpenBraceTokenType, true);
						loope:						while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
						{
							elseIfStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
							if (!openBraceTokenType)
							{
								break loope;
							}
						}
						if (openBraceTokenType)
						{
							match(Token.ClosedBraceTokenType);
						}
						statement.elseIfStatements.push(elseIfStatement);
					}
					while ((innerToken1 = peek(1)) && (innerToken1.type == Token.ElseTokenType))
					{
						var elseStatement = Construct.getNewElseStatement();
						match(Token.ElseTokenType);
						openBraceTokenType = match(Token.OpenBraceTokenType, true);
						loopf:						while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
						{
							innerStatement = matchStatement(false, namedFunctionExpressions);
							if (inCompileConstantLocal)
							{
								if (!add)
								{
									elseStatement.bodyStatements.push(innerStatement);
								}
							}
							else
							{
								elseStatement.bodyStatements.push(innerStatement);
							}
							if (!openBraceTokenType)
							{
								break loopf;
							}
						}
						if (openBraceTokenType)
						{
							match(Token.ClosedBraceTokenType);
						}
						statement.elseStatement = elseStatement;
					}
					if (inCompileConstantLocal)
					{
						inCompileConstant = false;
					}
					break;
				case Token.WhileTokenType:
					statement = Construct.getNewWhileStatement();
					match(Token.WhileTokenType);
					match(Token.OpenParenTokenType);
					statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
					match(Token.ClosedParenTokenType);
					openBraceTokenType = match(Token.OpenBraceTokenType, true);
					loopg:					while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
					{
						statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
						if (!openBraceTokenType)
						{
							break loopg;
						}
					}
					if (openBraceTokenType)
					{
						match(Token.ClosedBraceTokenType);
					}
					break;
				case Token.DoTokenType:
					statement = Construct.getNewDoWhileStatement();
					match(Token.DoTokenType);
					openBraceTokenType = match(Token.OpenBraceTokenType, true);
					looph:					while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
					{
						statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
						if (!openBraceTokenType)
						{
							break looph;
						}
					}
					if (openBraceTokenType)
					{
						match(Token.ClosedBraceTokenType);
					}
					match(Token.WhileTokenType);
					match(Token.OpenParenTokenType);
					statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
					match(Token.ClosedParenTokenType);
					break;
				case Token.ForTokenType:
					match(Token.ForTokenType);
					if (peek(1).type == Token.EachTokenType)
					{
						match(Token.EachTokenType);
						statement = Construct.getNewForEachStatement();
						match(Token.OpenParenTokenType);
						statement.variableStatement = matchStatement(false, namedFunctionExpressions, true);
						match(Token.InTokenType);
						statement.arrayExpression = matchExpression(false, namedFunctionExpressions);
						match(Token.ClosedParenTokenType);
						openBraceTokenType = match(Token.OpenBraceTokenType, true);
						loopi:						while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
						{
							statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
							if (!openBraceTokenType)
							{
								break loopi;
							}
						}
						if (openBraceTokenType)
						{
							match(Token.ClosedBraceTokenType);
						}
						break;
					}
					match(Token.OpenParenTokenType);
					var ahead = 1;
					var openParens = 1;
					var closedParens = 0;
					var inTokenFound = false;
					while (innerToken = peek(ahead))
					{
						if (innerToken.type == Token.OpenParenTokenType)
						{
							openParens++;
						}
						if (innerToken.type == Token.ClosedParenTokenType)
						{
							closedParens++;
						}
						if (innerToken.type == Token.InTokenType)
						{
							inTokenFound = true;
						}
						if (openParens == closedParens || inTokenFound)
						{
							break;
						}
						ahead++;
					}
					if (inTokenFound)
					{
						statement = Construct.getNewForInStatement();
						statement.variableStatement = matchStatement(false, namedFunctionExpressions, true);
						match(Token.InTokenType);
						statement.objectExpression = matchExpression(false, namedFunctionExpressions);
						match(Token.ClosedParenTokenType);
					}
					else
					{
						statement = Construct.getNewForStatement();
						var eosTokenType = match(Token.EOSTokenType, 1);
						if (!eosTokenType)
						{
							statement.variableStatement = matchStatement(true, namedFunctionExpressions);
							match(Token.EOSTokenType);
						}
						eosTokenType = match(Token.EOSTokenType, 1);
						if (!eosTokenType)
						{
							statement.conditionExpression = matchExpression(false, namedFunctionExpressions);
							match(Token.EOSTokenType);
						}
						var closedParenTokenType = match(Token.ClosedParenTokenType, 1);
						if (!closedParenTokenType)
						{
							statement.afterthoughtExpression = matchExpression(false, namedFunctionExpressions);
							match(Token.ClosedParenTokenType);
						}
					}
					openBraceTokenType = match(Token.OpenBraceTokenType, true);
					loop2f:					while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
					{
						statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
						if (!openBraceTokenType)
						{
							break loop2f;
						}
					}
					if (openBraceTokenType)
					{
						match(Token.ClosedBraceTokenType);
					}
					break;
				case Token.BreakTokenType:
					statement = Construct.getNewBreakStatement();
					statement.token = match(Token.BreakTokenType);
					statement.identifierToken = match(Token.IdentifierTokenType, true);
					break;
				case Token.ContinueTokenType:
					statement = Construct.getNewContinueStatement();
					statement.token = match(Token.ContinueTokenType);
					statement.identifierToken = match(Token.IdentifierTokenType, true);
					break;
				case Token.ThrowTokenType:
					statement = Construct.getNewThrowStatement();
					statement.token = match(Token.ThrowTokenType);
					statement.expression = matchExpression(false, namedFunctionExpressions);
					break;
				case Token.UseTokenType:
					statement = Construct.getNewUseStatement();
					statement.useToken = match(Token.UseTokenType);
					match(Token.NamespaceKeywordTokenType);
					statement.namespaceIdentifierToken = match(Token.IdentifierTokenType);
					break;
				case Token.TryTokenType:
					match(Token.TryTokenType);
					statement = Construct.getNewTryStatement();
					openBraceTokenType = match(Token.OpenBraceTokenType, true);
					loop2g:					while ((innerToken = peek(1)) && (innerToken.type != Token.ClosedBraceTokenType))
					{
						statement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
						if (!openBraceTokenType)
						{
							break loop2g;
						}
					}
					if (openBraceTokenType)
					{
						match(Token.ClosedBraceTokenType);
					}
					while (match(Token.CatchTokenType, true))
					{
						var catchStatement = Construct.getNewCatchStatement();
						match(Token.OpenParenTokenType);
						catchStatement.identifierToken = match(Token.IdentifierTokenType);
						if (match(Token.ColonTokenType, true))
						{
							catchStatement.typeConstruct = matchTypeConstruct();
						}
						else
						{
							catchStatement.typeConstruct = Construct.getNewTypeConstruct();
							catchStatement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
						}
						match(Token.ClosedParenTokenType);
						openBraceTokenType = match(Token.OpenBraceTokenType, true);
						loopt:						while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
						{
							catchStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
							if (!openBraceTokenType)
							{
								break loopt;
							}
						}
						if (openBraceTokenType)
						{
							match(Token.ClosedBraceTokenType);
						}
						statement.catchStatements.push(catchStatement);
					}
					while (match(Token.FinallyTokenType, true))
					{
						var finallyStatement = Construct.getNewFinallyStatement();
						openBraceTokenType = match(Token.OpenBraceTokenType, true);
						loopx:						while ((innerInnerToken = peek(1)) && (innerInnerToken.type != Token.ClosedBraceTokenType))
						{
							finallyStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
							if (!openBraceTokenType)
							{
								break loopx;
							}
						}
						if (openBraceTokenType)
						{
							match(Token.ClosedBraceTokenType);
						}
						statement.finallyStatement = finallyStatement;
					}
					break;
				case Token.VarTokenType:
				case Token.ConstTokenType:
					statement = Construct.getNewVarStatement();
					if (match(Token.VarTokenType, true))
					{
					}
					else
					{
						match(Token.ConstTokenType, true);
					}
					statement.identifierToken = match(Token.IdentifierTokenType);
					if (match(Token.ColonTokenType, true))
					{
						statement.typeConstruct = matchTypeConstruct();
					}
					else
					{
						statement.typeConstruct = Construct.getNewTypeConstruct();
						statement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
					}
					if (match(Token.AssignmentTokenType, true))
					{
						statement.valueExpression = matchExpression(true, namedFunctionExpressions);
					}
					while (match(Token.CommaTokenType, true))
					{
						var innerVarStatement = Construct.getNewVarStatement();
						innerVarStatement.identifierToken = match(Token.IdentifierTokenType);
						if (match(Token.ColonTokenType, true))
						{
							innerVarStatement.typeConstruct = matchTypeConstruct();
						}
						else
						{
							innerVarStatement.typeConstruct = Construct.getNewTypeConstruct();
							innerVarStatement.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
						}
						if (match(Token.AssignmentTokenType, true))
						{
							innerVarStatement.valueExpression = matchExpression(true, namedFunctionExpressions);
						}
						statement.innerVarStatements.push(innerVarStatement);
					}
					break;
				case Token.SwitchTokenType:
					statement = Construct.getNewSwitchStatement();
					match(Token.SwitchTokenType);
					match(Token.OpenParenTokenType);
					statement.valueExpression = matchExpression(false, namedFunctionExpressions);
					match(Token.ClosedParenTokenType);
					match(Token.OpenBraceTokenType, true);
					while ((innerToken = peek(1)) && (innerToken.type == Token.CaseTokenType || innerToken.type == Token.DefaultTokenType))
					{
						var caseStatement = Construct.getNewCaseStatement();
						if (innerToken.type == Token.CaseTokenType)
						{
							match(Token.CaseTokenType);
							caseStatement.valueExpression = matchExpression(false, namedFunctionExpressions);
						}
						if (innerToken.type == Token.DefaultTokenType)
						{
							caseStatement.defaultToken = match(Token.DefaultTokenType);
						}
						match(Token.ColonTokenType);
						var openFound = match(Token.OpenBraceTokenType, true);
						while ((innerToken = peek(1)) && (innerToken.type != Token.CaseTokenType && innerToken.type != Token.DefaultTokenType && innerToken.type != Token.ClosedBraceTokenType))
						{
							caseStatement.bodyStatements.push(matchStatement(false, namedFunctionExpressions));
						}
						if (openFound)
						{
							match(Token.ClosedBraceTokenType);
						}
						statement.caseStatements.push(caseStatement);
					}
					match(Token.ClosedBraceTokenType);
					break;
				default:
					if (peek(1).type == Token.IdentifierTokenType && (peek(2) && peek(2).type == Token.ColonTokenType))
					{
						statement = Construct.getNewLabelStatement();
						statement.identifierToken = match(Token.IdentifierTokenType);
						match(Token.ColonTokenType);
						break;
					}
					statement = matchExpression(false, namedFunctionExpressions, false, false, dontReadIn);
			}
			if (!dontmatchEOS)
			{
				match(Token.EOSTokenType, true, true);
			}
			return statement;
		}
;

		function matchExpression($$$$ignoreCommas, $$$$namedFunctionExpressions, $$$$operand, $$$$optional, $$$$dontReadIn) 
		{
			//set default parameter values
			var ignoreCommas = (0 > arguments.length - 1) ? false : $es4.$$coerce($$$$ignoreCommas, Boolean);
			var namedFunctionExpressions = (1 > arguments.length - 1) ? null : $$$$namedFunctionExpressions;
			var operand = (2 > arguments.length - 1) ? null : $$$$operand;
			var optional = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$optional, Boolean);
			var dontReadIn = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$dontReadIn, Boolean);

			var expression = null;
			var expressions = [];
			var ternaryTokens = 0;
			var token;
			var construct;
			var regExpString;
			var prefixExpression;
			var binaryExpression;
			var binaryExpressionParent;
			loopy:			while (token = peek(1))
			{
				switch (token.type)
				{
					case Token.OpenParenTokenType:
						match(Token.OpenParenTokenType);
						expression = Construct.getNewParenExpression();
						expression.expression = matchExpression(false, namedFunctionExpressions);
						match(Token.ClosedParenTokenType);
						if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType || peek(1).type == Token.OpenParenTokenType))
						{
							construct = Construct.getNewParenConstruct();
							construct.expression = expression;
							expression = matchPropertyExpression(construct);
						}
						break;
					case Token.NumberTokenType:
						expression = Construct.getNewNumberExpression();
						expression.numberToken = match(Token.NumberTokenType);
						break;
					case Token.StringTokenType:
						expression = Construct.getNewStringExpression();
						expression.stringToken = match(Token.StringTokenType);
						while (token = match(Token.StringChunkTokenType, true))
						{
							expression.stringChunkTokens.push(token);
						}
						expression.stringEndToken = match(Token.StringEndTokenType);
						if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType || peek(1).type == Token.OpenParenTokenType))
						{
							construct = Construct.getNewParenConstruct();
							construct.expression = expression;
							expression = matchPropertyExpression(construct);
						}
						break;
					case Token.ReturnTokenType:
						expression = Construct.getNewReturnExpression();
						match(Token.ReturnTokenType);
						if (peek(1).type != Token.ClosedBraceTokenType && peek(1).type != Token.EOSTokenType)
						{
							expression.expression = matchExpression(false, namedFunctionExpressions);
						}
						break;
					case Token.DeleteTokenType:
						expression = Construct.getNewDeleteExpression();
						match(Token.DeleteTokenType);
						expression.expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
						break;
					case Token.FunctionTokenType:
						expression = Construct.getNewFunctionExpression();
						match(Token.FunctionTokenType);
						expression.identifierToken = match(Token.IdentifierTokenType, true);
						if (expression.identifierToken && namedFunctionExpressions)
						{
							namedFunctionExpressions.push(expression);
						}
						match(Token.OpenParenTokenType);
						while (!match(Token.ClosedParenTokenType, true))
						{
							expression.parameterConstructs.push(matchParameterConstruct());
							match(Token.CommaTokenType, true);
						}
						if (match(Token.ColonTokenType, true))
						{
							expression.typeConstruct = matchTypeConstruct();
						}
						else
						{
							expression.typeConstruct = Construct.getNewTypeConstruct();
							expression.typeConstruct.mulToken = Token.getNewToken(Token.MulTokenType, '*');
						}
						match(Token.OpenBraceTokenType);
						while (!match(Token.ClosedBraceTokenType, true))
						{
							expression.bodyStatements.push(matchStatement(false, expression.namedFunctionExpressions));
						}
						break;
					case Token.OpenBraceTokenType:
						expression = Construct.getNewObjectExpression();
						match(Token.OpenBraceTokenType);
						while (!match(Token.ClosedBraceTokenType, true))
						{
							var objectPropertyConstruct = Construct.getNewObjectPropertyConstruct();
							objectPropertyConstruct.expression = matchExpression(false, namedFunctionExpressions);
							match(Token.ColonTokenType);
							objectPropertyConstruct.valueExpression = matchExpression(true, namedFunctionExpressions);
							expression.objectPropertyConstructs.push(objectPropertyConstruct);
							match(Token.CommaTokenType, true);
						}
						if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType))
						{
							expression = matchPropertyExpression(Construct.getNewObjectConstruct(expression));
						}
						break;
					case Token.OpenBracketTokenType:
						expression = Construct.getNewArrayExpression();
						match(Token.OpenBracketTokenType);
						while (!match(Token.ClosedBracketTokenType, true))
						{
							expression.valueExpressions.push(matchExpression(true, namedFunctionExpressions));
							match(Token.CommaTokenType, true);
						}
						if (peek(1) && (peek(1).type == Token.DotTokenType || peek(1).type == Token.OpenBracketTokenType))
						{
							expression = matchPropertyExpression(Construct.getNewArrayConstruct(expression));
						}
						break;
					case Token.BooleanTokenType:
						expression = Construct.getNewBooleanExpression();
						expression.booleanToken = match(Token.BooleanTokenType);
						break;
					case Token.NaNTokenType:
						expression = Construct.getNewExpression(match(Token.NaNTokenType));
						break;
					case Token.UndefinedTokenType:
						expression = Construct.getNewExpression(match(Token.UndefinedTokenType));
						break;
					case Token.ThisTokenType:
						expression = matchPropertyExpression();
						break;
					case Token.NullTokenType:
						expression = Construct.getNewExpression(match(Token.NullTokenType));
						break;
					case Token.AddTokenType:
						expression = Construct.getNewExpression(match(Token.AddTokenType), matchExpression(true, namedFunctionExpressions, true));
						break;
					case Token.SubTokenType:
						expression = Construct.getNewExpression(match(Token.SubTokenType), matchExpression(true, namedFunctionExpressions, true));
						break;
					case Token.XMLOpenArrowTokenType:
						match(Token.XMLOpenArrowTokenType);
						var isXMLList = peek(1).type == Token.XMLClosedArrowTokenType;
						var openTags = 1;
						var xmlString = '<';
						if (isXMLList)
						{
							expression = Construct.getNewXMLListExpression();
							match(Token.XMLClosedArrowTokenType);
							match(Token.XMLOpenArrowTokenType);
						}
						else
						{
							expression = Construct.getNewXMLExpression();
						}
						var inNode = true;
						while ((openTags || inNode || isXMLList) && (token = next(1)))
						{
							if (isXMLList)
							{
								if (token.type == Token.XMLOpenArrowTokenType && peek(1) && peek(1).type == Token.XMLForwardSlashTokenType && peek(2) && peek(2).type == Token.XMLClosedArrowTokenType)
								{
									match(Token.XMLForwardSlashTokenType);
									match(Token.XMLClosedArrowTokenType);
									break;
								}
							}
							else
							{
								if (token.type == Token.XMLOpenArrowTokenType)
								{
									inNode = true;
								}
								if (token.type == Token.XMLOpenArrowTokenType && peek(1) && peek(1).type == Token.XMLForwardSlashTokenType)
								{
									openTags--;
								}
								else if (token.type == Token.XMLOpenArrowTokenType)
								{
									openTags++;
								}
								if (token.type == Token.XMLForwardSlashTokenType && peek(1) && peek(1).type == Token.XMLClosedArrowTokenType)
								{
									openTags--;
								}
								if (token.type == Token.XMLClosedArrowTokenType)
								{
									inNode = false;
								}
							}
							if (token.data == "'")
							{
								token.data = "\\'";
							}
							if (token.type == Token.NewLineTokenType)
							{
								xmlString += '\\' + token.data;
							}
							else
							{
								xmlString += token.data;
							}
						}
						expression.string = xmlString;
						break;
					case Token.RegExpTokenType:
						expression = Construct.getNewRegExpression();
						regExpString = match(Token.RegExpTokenType).data;
						while ((token = peek(1, 1)) && token.type == Token.SpecialUFOTokenType)
						{
							token = next();
							regExpString += token.data;
						}
						expression.string = regExpString;
						break;
					case Token.DivTokenType:
						expression = Construct.getNewRegExpression();
						regExpString = match(Token.DivTokenType).data;
						while (token = next(2))
						{
							regExpString += token.data;
							if (regExpString.charAt(regExpString.length - 1) == '/' && regExpString.charAt(regExpString.length - 2) != '\\')
							{
								break;
							}
						}
						while (token = peek(1, 1))
						{
							if (token.type == Token.NewLineTokenType || token.type == Token.TabTokenType || token.type == Token.SpaceTokenType || token.type == Token.EOSTokenType || token.type == Token.CommaTokenType)
							{
								break;
							}
							token = next();
							regExpString += token.data;
						}
						expression.string = regExpString;
						break;
					case Token.IncrementTokenType:
						expression = Construct.getNewPrefixExpression();
						expression.incrementToken = match(Token.IncrementTokenType);
						expression.expression = matchExpression(false, namedFunctionExpressions);
						if (expression.expression.constructor != Construct.BinaryExpression)
						{
							break;
						}
						prefixExpression = expression;
						binaryExpression = expression = expression.expression;
						binaryExpressionParent = binaryExpression;
						while (binaryExpression.constructor == Construct.BinaryExpression)
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = binaryExpression.leftExpression;
						}
						while (binaryExpression.constructor == Construct.ParenExpression)
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = binaryExpression.expression;
						}
						prefixExpression.expression = binaryExpression;
						if (binaryExpressionParent.constructor == Construct.ParenExpression)
						{
							binaryExpressionParent.expression = prefixExpression;
						}
						else
						{
							binaryExpressionParent.leftExpression = prefixExpression;
						}
						break;
					case Token.DecrementTokenType:
						expression = Construct.getNewPrefixExpression();
						expression.decrementToken = match(Token.DecrementTokenType);
						expression.expression = matchExpression(false, namedFunctionExpressions);
						if (expression.expression.constructor != Construct.BinaryExpression)
						{
							break;
						}
						prefixExpression = expression;
						binaryExpression = expression = expression.expression;
						binaryExpressionParent = binaryExpression;
						while (binaryExpression.constructor == Construct.BinaryExpression)
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = binaryExpression.leftExpression;
						}
						while (binaryExpression.constructor == Construct.ParenExpression)
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = binaryExpression.expression;
						}
						prefixExpression.expression = binaryExpression;
						if (binaryExpressionParent.constructor == Construct.ParenExpression)
						{
							binaryExpressionParent.expression = prefixExpression;
						}
						else
						{
							binaryExpressionParent.leftExpression = prefixExpression;
						}
						break;
					case Token.BitwiseNotTokenType:
						expression = Construct.getNewExpression(match(Token.BitwiseNotTokenType), matchExpression(false, namedFunctionExpressions, true));
						break;
					case Token.NotTokenType:
						expression = Construct.getNewExpression(match(Token.NotTokenType), matchExpression(false, namedFunctionExpressions, true));
						break;
					case Token.TypeofTokenType:
						expression = Construct.getNewExpression(match(Token.TypeofTokenType), matchExpression(false, namedFunctionExpressions, true));
						break;
					case Token.SuperTokenType:
						expression = matchPropertyExpression();
						break;
					case Token.NewTokenType:
						expression = Construct.getNewNewExpression();
						match(Token.NewTokenType);
						if (peek(1).type == Token.RelationalTokenType)
						{
							next();
							next();
							next();
							expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
							break;
						}
						expression.expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
						break;
					case Token.IdentifierTokenType:
						expression = matchPropertyExpression();
						expression.root = true;
						break;
					case Token.AtTokenType:
						expression = matchPropertyExpression();
						break;
					case Token.VoidTokenType:
						expression = Construct.getNewExpression(match(Token.VoidTokenType), matchExpression(false, namedFunctionExpressions, null, true));
						break;
					default:
						if (optional)
						{
							expression = Construct.getNewEmptyExpression();
							break;
						}
						throw error('Unexpected token found10.', token);
				}
				token = match(Token.IncrementTokenType, true) || match(Token.DecrementTokenType, true);
				if (token)
				{
					var originalExpression = expression;
					expression = Construct.getNewPostfixExpression();
					if (token.type == Token.IncrementTokenType)
					{
						expression.incrementToken = token;
					}
					else
					{
						expression.decrementToken = token;
					}
					expression.expression = originalExpression;
				}
				if (operand)
				{
					return expression;
				}
				expressions.push(expression);
				token = match(Token.AssignmentTokenType, true) || match(Token.AddTokenType, true) || match(Token.AsTokenType, true) || match((dontReadIn) ? Token.SubTokenType : Token.InTokenType, true) || match(Token.SubTokenType, true) || match(Token.MulTokenType, true) || match(Token.DivTokenType, true) || match(Token.ModTokenType, true) || match(Token.TernaryTokenType, true) || match(Token.IsTokenType, true) || match(Token.InstanceofTokenType, true) || match(Token.AndWithAssignmentTokenType, true) || match(Token.OrWithAssignmentTokenType, true) || match(Token.AndTokenType, true) || match(Token.OrTokenType, true) || match(Token.EqualityTokenType, true) || match(Token.RelationalTokenType, true) || match(Token.AddWithAssignmentTokenType, true) || match(Token.DivWithAssignmentTokenType, true) || match(Token.ModWithAssignmentTokenType, true) || match(Token.MulWithAssignmentTokenType, true) || match(Token.SubWithAssignmentTokenType, true) || match(Token.BitwiseLeftShiftAssignmentTokenType, true) || match(Token.BitwiseRightShiftAssignmentTokenType, true) || match(Token.BitwiseUnsignedRightShiftAssignmentTokenType, true) || match(Token.BitwiseLeftShiftTokenType, true) || match(Token.BitwiseRightShiftTokenType, true) || match(Token.BitwiseUnsignedRightShiftTokenType, true) || match(Token.BitwiseAndAssignmentTokenType, true) || match(Token.BitwiseOrAssignmentTokenType, true) || match(Token.BitwiseXorAssignmentTokenType, true) || match(Token.BitwiseAndTokenType, true) || match(Token.BitwiseOrTokenType, true) || match(Token.BitwiseXorTokenType, true);
				if (!ignoreCommas && !token)
				{
					token = match(Token.CommaTokenType, true);
				}
				if (token && token.type == Token.TernaryTokenType)
				{
					ternaryTokens++;
				}
				else if (!token && ternaryTokens)
				{
					token = match(Token.ColonTokenType);
					ternaryTokens--;
				}
				if (!token)
				{
					break loopy;
				}
				expressions.push(token);
			}
			return combineExpressions(expressions);

			function getBinaryTernaryOperatorPrecedence($$$$token) 
			{
				//set default parameter values
				var token = $$$$token;

				switch (token.type)
				{
					case Token.ColonTokenType:
						return -1;
					case Token.CommaTokenType:
						return 1;
					case Token.AssignmentTokenType:
					case Token.MulWithAssignmentTokenType:
					case Token.DivWithAssignmentTokenType:
					case Token.ModWithAssignmentTokenType:
					case Token.AddWithAssignmentTokenType:
					case Token.SubWithAssignmentTokenType:
					case Token.BitwiseLeftShiftAssignmentTokenType:
					case Token.BitwiseRightShiftAssignmentTokenType:
					case Token.BitwiseUnsignedRightShiftAssignmentTokenType:
					case Token.BitwiseAndAssignmentTokenType:
					case Token.BitwiseXorAssignmentTokenType:
					case Token.BitwiseOrAssignmentTokenType:
					case Token.AndWithAssignmentTokenType:
					case Token.OrWithAssignmentTokenType:
						return 2;
					case Token.TernaryTokenType:
						return 3;
					case Token.OrTokenType:
						return 4;
					case Token.AndTokenType:
						return 5;
					case Token.BitwiseOrTokenType:
						return 6;
					case Token.BitwiseXorTokenType:
						return 7;
					case Token.BitwiseAndTokenType:
						return 8;
					case Token.EqualityTokenType:
						return 9;
					case Token.RelationalTokenType:
					case Token.AsTokenType:
					case Token.InTokenType:
					case Token.InstanceofTokenType:
					case Token.IsTokenType:
						return 10;
					case Token.BitwiseLeftShiftTokenType:
					case Token.BitwiseRightShiftTokenType:
					case Token.BitwiseUnsignedRightShiftTokenType:
						return 11;
					case Token.AddTokenType:
					case Token.SubTokenType:
						return 12;
					case Token.MulTokenType:
					case Token.DivTokenType:
					case Token.ModTokenType:
						return 13;
					default:
						throw $es4.$$primitive(new Error('unknown binary/ternary operator: ' + token.type.name));
				}
			}
;

			function combineExpressions($$$$expressions) 
			{
				//set default parameter values
				var expressions = $$$$expressions;

				var currentOperatorPrecedence = 13;
				var i = -1;
				var expression;
				var begin;
				while (expressions.length > 1 && currentOperatorPrecedence)
				{
					if (i >= expressions.length - 1)
					{
						i = -1;
						currentOperatorPrecedence--;
					}
					i++;
					if (i % 2 == 0)
					{
						continue;
					}
					var token = expressions[i];
					if (getBinaryTernaryOperatorPrecedence(token) != currentOperatorPrecedence)
					{
						continue;
					}
					if (token.type == Token.TernaryTokenType)
					{
						expression = Construct.getNewTernaryExpression();
						expression.conditionExpression = expressions[i - 1];
						var index = i + 1;
						var ternaryTokens = 1;
						var colonTokens = 0;
						var innerExpressions = [];
						while (ternaryTokens != colonTokens && index < expressions.length - 1)
						{
							innerExpressions.push(expressions[index]);
							if (index % 2 == 0)
							{
								index++;
								continue;
							}
							if (expressions[index].type == Token.TernaryTokenType)
							{
								ternaryTokens++;
							}
							else if (expressions[index].type == Token.ColonTokenType)
							{
								colonTokens++;
							}
							index++;
						}
						expression.trueExpression = combineExpressions(innerExpressions.slice(0, innerExpressions.length - 1));
						expression.falseExpression = combineExpressions(expressions.slice(index));
						begin = expressions.slice(0, i - 1);
						expressions = begin.concat([expression]);
					}
					else
					{
						expression = Construct.getNewBinaryExpression();
						expression.token = token;
						expression.leftExpression = expressions[i - 1];
						expression.rightExpression = expressions[i + 1];
						begin = expressions.slice(0, i - 1);
						var end = expressions.slice(i + 2);
						expressions = begin.concat([expression], end);
					}
					i = -1;
				}
				return expressions[0];
			}
;
		}
;

		function match($$$$type, $$$$optional, $$$$greedy) 
		{
			//set default parameter values
			var type = $$$$type;
			var optional = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$optional, Boolean);
			var greedy = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$greedy, Boolean);

			var token = (optional) ? peek(1) : next();
			if (!token && !optional)
			{
				throw error('Expected token type: ' + type.name + '. No token found.', null);
			}
			if (!token)
			{
				return false;
			}
			if (token.type != type && !optional)
			{
				throw error('Expected token type: ' + type + '. Got', token);
			}
			if (token.type != type)
			{
				return false;
			}
			if (optional)
			{
				token = next();
			}
			var gtoken = (greedy) ? match(type, true, greedy) : false;
			return (gtoken) ? gtoken : token;
		}
;

		function next($$$$includeLevel, $$$$keywordStrictMode) 
		{
			//set default parameter values
			var includeLevel = (0 > arguments.length - 1) ? false : $es4.$$coerce($$$$includeLevel, Boolean);
			var keywordStrictMode = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$keywordStrictMode, Boolean);

			if (!includeLevel)
			{
				includeLevel = $es4.$$coerce(0, Boolean);
			}
			while (index < tokens.length - 1)
			{
				var token = tokens[++index];
				switch (token.type)
				{
					case Token.CommentTokenType:
					case Token.CommentChunkTokenType:
					case Token.MultiLineCommentTokenType:
					case Token.MultiLineCommentChunkTokenType:
					case Token.MultiLineCommentEndTokenType:
						if (includeLevel == 1 || includeLevel == 0)
						{
							break;
						}
					case Token.NewLineTokenType:
					case Token.TabTokenType:
					case Token.SpaceTokenType:
						if (includeLevel == 0)
						{
							break;
						}
					default:
						if (keywordStrictMode)
						{
							return token;
						}
						if (token.type == Token.StaticTokenType)
						{
							token = Token.getNewToken(Token.IdentifierTokenType, 'static');
						}
						return token;
				}
			}
			return null;
		}
;

		function peek($$$$ahead, $$$$includeLevel, $$$$keywordStrictMode) 
		{
			//set default parameter values
			var ahead = $$$$ahead;
			var includeLevel = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$includeLevel, Boolean);
			var keywordStrictMode = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$keywordStrictMode, Boolean);

			if (!includeLevel)
			{
				includeLevel = $es4.$$coerce(0, Boolean);
			}
			var i = index;
			while (true)
			{
				if (ahead > 0 && i >= tokens.length - 1)
				{
					break;
				}
				if (ahead < 0 && i < 1)
				{
					break;
				}
				var token = (ahead > 0) ? tokens[++i] : tokens[--i];
				switch (token.type)
				{
					case Token.CommentTokenType:
					case Token.CommentChunkTokenType:
					case Token.MultiLineCommentTokenType:
					case Token.MultiLineCommentChunkTokenType:
					case Token.MultiLineCommentEndTokenType:
						break;
					case Token.TabTokenType:
					case Token.SpaceTokenType:
					case Token.NewLineTokenType:
						if (includeLevel != 1)
						{
							break;
						}
					default:
						(ahead > 0) ? ahead-- : ahead++;
						if (!ahead)
						{
							if (keywordStrictMode)
							{
								return token;
							}
							if (token.type == Token.StaticTokenType)
							{
								token = Token.getNewToken(Token.IdentifierTokenType, 'static');
							}
							return token;
						}
				}
			}
			return null;
		}
;

		function error($$$$string, $$$$token) 
		{
			//set default parameter values
			var string = $$$$string;
			var token = $$$$token;

			var i = (index - 25) < 25 ? 0 : index - 25;
			for (i; i <= index; i++)
			{
				trace(tokens[i].line + ' : ' + tokens[i].position + ' : ' + tokens[i].type + ' => ' + tokens[i].data);
			}
			if (token)
			{
				return $es4.$$primitive(new Error(string + ' token type ' + token.type + ' found on line ' + token.line + ', at position ' + token.position));
			}
			else
			{
				return $es4.$$primitive(new Error(string));
			}
		}
;

		if (statementImportConstructs.length)
		{
			rootConstruct.packageConstruct.importConstructs = rootConstruct.packageConstruct.importConstructs.concat(statementImportConstructs);
		}
		return rootConstruct;
	});
	function Parser()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof Parser) || $$this.$$Parser !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Parser) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			Parser.$$construct($$this, $$args);
		}
	}

	//construct
	Parser.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (Parser.$$cinit !== undefined) Parser.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$Parser', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		Parser.$$iinit($$this);

		//call constructor
		if (args !== undefined) Parser.$$constructor.apply($$this, args);
	});

	//initializer
	Parser.$$iinit = (function ($$this)
	{
	});

	//constructor
	Parser.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(Parser, null, 'sweetrush.core::Parser');
})();
//sweetrush.core.Parser


//sweetrush.utils.SwcUtil
$es4.$$package('sweetrush.utils').SwcUtil = (function ()
{
	//imports
	var JsonUtil;

	//class pre initializer
	SwcUtil.$$sinit = (function ()
	{
		SwcUtil.$$sinit = undefined;

		//initialize imports
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;

		//set prototype and constructor
		SwcUtil.prototype = Object.create(Object.prototype);
		Object.defineProperty(SwcUtil.prototype, "constructor", { value: SwcUtil, enumerable: false });

		//hold private values
		Object.defineProperty(SwcUtil.prototype, '$$v', {value:{}});
	});

	//class initializer
	SwcUtil.$$cinit = (function ()
	{
		SwcUtil.$$cinit = undefined;
	});

	//public static method
	SwcUtil.stringifySWC = (function ($$$$obj)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var obj = $$$$obj;

		return '_SWC_' + ($es4.$$primitive(new JsonUtil().stringify(obj)));
	});

	//public static method
	SwcUtil.parseSWCString = (function ($$$$contents)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var contents = $$$$contents;

		return $es4.$$primitive(new JsonUtil().parse(contents.substring(5)));
	});

	//public static method
	SwcUtil.isValidSWCString = (function ($$$$contents)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var contents = $$$$contents;

		return contents.indexOf('_SWC_') == 0;
	});
	function SwcUtil()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof SwcUtil) || $$this.$$SwcUtil !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], SwcUtil) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			SwcUtil.$$construct($$this, $$args);
		}
	}

	//construct
	SwcUtil.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$SwcUtil', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		SwcUtil.$$iinit($$this);

		//call constructor
		if (args !== undefined) SwcUtil.$$constructor.apply($$this, args);
	});

	//initializer
	SwcUtil.$$iinit = (function ($$this)
	{
	});

	//constructor
	SwcUtil.$$constructor = (function ()
	{
		var $$this = this;
	});

	return $es4.$$class(SwcUtil, null, 'sweetrush.utils::SwcUtil');
})();
//sweetrush.utils.SwcUtil


//sweetrush.utils.FileUtil
$es4.$$package('sweetrush.utils').FileUtil = (function ()
{
	//imports
	var ByteArray;
	var Lexer;
	var TranslatorPrototype;
	var FileUtil;
	var Transcompiler;
	var Base64Util;
	var SwcUtil;
	var JsonUtil;
	var Token;
	var Construct;
	var TranslatorProto;
	var Analyzer;
	var Parser;

	//properties
	var $$j = {};
	Object.defineProperty(FileUtil, 'fs', {
	get:function () { if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit(); return $$j.fs; },
	set:function (value) { if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit(); $$j.fs = value }
	});

	Object.defineProperty(FileUtil, 'path', {
	get:function () { if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit(); return $$j.path; },
	set:function (value) { if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit(); $$j.path = value }
	});


	//class pre initializer
	FileUtil.$$sinit = (function ()
	{
		FileUtil.$$sinit = undefined;

		//initialize imports
		ByteArray = $es4.$$['flash.utils'].ByteArray;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Token = $es4.$$['sweetrush.obj'].Token;
		Construct = $es4.$$['sweetrush.obj'].Construct;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		Parser = $es4.$$['sweetrush.core'].Parser;

		//set prototype and constructor
		FileUtil.prototype = Object.create(Object.prototype);
		Object.defineProperty(FileUtil.prototype, "constructor", { value: FileUtil, enumerable: false });

		//hold private values
		Object.defineProperty(FileUtil.prototype, '$$v', {value:{}});
	});

	//class initializer
	FileUtil.$$cinit = (function ()
	{
		FileUtil.$$cinit = undefined;

		//initialize properties
		$$j.fs = require('fs');
		$$j.path = require('path');
	
	});

	//public static method
	FileUtil.getBasePath = (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		if (true)
		{
			return FileUtil.path.join(__dirname, '../../../', 'as3-js');
		}
		if (false)
		{
		}
	});

	//public static method
	FileUtil.getExcludedPath = (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		if (true)
		{
			return FileUtil.path.join(__dirname, '../../../', 'as3-js', '_excluded');
		}
		if (false)
		{
		}
	});

	//public static method
	FileUtil.resolvePath = (function ($$$$src, $$$$append)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var src = $$$$src;
		var append = $$$$append;

		if (true)
		{
			return FileUtil.fixPath(FileUtil.path.join(src, append));
		}
		if (false)
		{
		}
	});

	//public static method
	FileUtil.read = (function ($$$$file)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var file = $$$$file;

		if (false)
		{
		}
		if (true)
		{
			return FileUtil.fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
		}
	});

	//public static method
	FileUtil.write = (function ($$$$file, $$$$contents)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var file = $$$$file;
		var contents = $$$$contents;

		if (false)
		{
		}
		if (true)
		{
			FileUtil.fs.writeFileSync(file, contents, 'utf8');
		}
	});

	//public static method
	FileUtil.readDirectory = (function ($$$$directory)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var directory = $$$$directory;

		if (false)
		{
		}
		if (true)
		{
			var files = $es4.$$coerce(FileUtil.fs.readdirSync(directory), Array);
			for (var i = 0; i < files.length; i++)
			{
				files[i] = directory + '/' + files[i];
			}
			return files;
		}
	});

	//public static method
	FileUtil.fixPath = (function ($$$$path)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;

		return path.split('\\\\').join('/').split('\\').join('/');
	});

	//public static method
	FileUtil.exists = (function ($$$$file)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var file = $$$$file;

		if (false)
		{
		}
		if (true)
		{
			return FileUtil.fs.existsSync(file);
		}
	});

	//public static method
	FileUtil.getList = (function ($$$$path, $$$$recursive, $$$$filter)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;
		var recursive = $$$$recursive;
		var filter = $$$$filter;

		var returnList = innerGetList(path, recursive, filter, path);
		returnList['basepath'] = FileUtil.fixPath(path);
		return returnList;

		function innerGetList($$$$path, $$$$recursive, $$$$filter, $$$$basePath) 
		{
			//set default parameter values
			var path = $$$$path;
			var recursive = $$$$recursive;
			var filter = $$$$filter;
			var basePath = $$$$basePath;

			path = FileUtil.fixPath(path);
			basePath = FileUtil.fixPath(basePath);
			var file = $es4.$$primitive(new VFile(path));
			var list = file.listFiles();
			var returnList = $es4.$$primitive(new Array());
			for (var i = 0; i < list.length; i++)
			{
				file = list[i];
				var result = filter(file, basePath);
				if (result)
				{
					returnList.push(result);
				}
				if (file.isDirectory() && recursive)
				{
					var innerList = innerGetList(file.src, recursive, filter, basePath);
					returnList = returnList.concat(innerList);
				}
			}
			return returnList;
		}
;
	});

	//public static method
	FileUtil.filterList = (function ($$$$list, $$$$filter)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var list = $$$$list;
		var filter = $$$$filter;

		var returnList = [];
		returnList['basepath'] = list['basepath'];
		for (var i = 0; i < list.length; i++)
		{
			var file = filter(list[i], list['basepath']);
			if (!file)
			{
				continue;
			}
			returnList.push(file);
		}
		return returnList;
	});

	//public static method
	FileUtil.getListFilter_none = (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			return file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_hidden = (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			return file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_extension = (function ($$$$extension, $$$$include_)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var extension = $$$$extension;
		var include_ = $$$$include_;

		extension = '.' + extension;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			var result = file.src.slice(-extension.length);
			if (result == extension)
			{
				return (include_) ? file : null;
			}
			return (include_) ? null : file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_name = (function ($$$$name, $$$$include_)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var name = $$$$name;
		var include_ = $$$$include_;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			var result = FileUtil.fixPath(file.src).split('/').pop();
			if (result == name)
			{
				return (include_) ? file : null;
			}
			return (include_) ? null : file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_directories = (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			if (file.isDirectory())
			{
				return null;
			}
			return file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_directory = (function ($$$$path)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;

		path = FileUtil.fixPath(path);

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			basePath = FileUtil.fixPath(basePath);
			if (FileUtil.fixPath(file.src).indexOf(path) == 0)
			{
				return null;
			}
			return file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_list = (function ($$$$list)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var list = $$$$list;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			basePath = FileUtil.fixPath(basePath);
			var compare1 = FileUtil.fixPath(file.src).split(basePath)[1];
			for (var i = 0; i < list.length; i++)
			{
				var compare2 = FileUtil.fixPath(list[i].src).split(FileUtil.fixPath(list['basepath']))[1];
				if (compare1 == compare2)
				{
					return null;
				}
			}
			return file;
		}
;

		return filter;
	});

	//public static method
	FileUtil.getListFilter_filters = (function ($$$$filters)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var filters = $$$$filters;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			for (var i = 0; i < filters.length; i++)
			{
				var result = filters[i](file, basePath);
				if (!result)
				{
					return null;
				}
			}
			return file;
		}
;

		return filter;
	});
	function FileUtil()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof FileUtil) || $$this.$$FileUtil !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], FileUtil) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			FileUtil.$$construct($$this, $$args);
		}
	}

	//construct
	FileUtil.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$FileUtil', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		FileUtil.$$iinit($$this);

		//call constructor
		if (args !== undefined) FileUtil.$$constructor.apply($$this, args);
	});

	//initializer
	FileUtil.$$iinit = (function ($$this)
	{
	});

	//constructor
	FileUtil.$$constructor = (function ()
	{
		var $$this = this;
	});

	////////////////INTERNAL CLASS////////////////
	var VFile = (function ()
	{
		//imports
		var FileUtil;

		//properties
		var $$j = {};
		Object.defineProperty(VFile, 'fs', {
		get:function () { if (VFile.$$cinit !== undefined) VFile.$$cinit(); return $$j.fs; },
		set:function (value) { if (VFile.$$cinit !== undefined) VFile.$$cinit(); $$j.fs = value }
		});

		Object.defineProperty(VFile, 'path', {
		get:function () { if (VFile.$$cinit !== undefined) VFile.$$cinit(); return $$j.path; },
		set:function (value) { if (VFile.$$cinit !== undefined) VFile.$$cinit(); $$j.path = value }
		});


		//class pre initializer
		VFile.$$sinit = (function ()
		{
			VFile.$$sinit = undefined;

			//initialize imports
			FileUtil = $es4.$$['sweetrush.utils'].FileUtil;

			//set prototype and constructor
			VFile.prototype = Object.create(Object.prototype);
			Object.defineProperty(VFile.prototype, "constructor", { value: VFile, enumerable: false });

			//hold private values
			Object.defineProperty(VFile.prototype, '$$v', {value:{}});

			//public instance method
			Object.defineProperty(VFile.prototype, 'listFiles', {
			get:function ()
			{
				var $$this = this;

				function listFiles()
				{
					function getFiles($$$$dir, $$$$files_) 
					{
						//set default parameter values
						var dir = $$$$dir;
						var files_ = $$$$files_;

						files_ = files_ || [];
						var files = FileUtil.readDirectory(dir);
						for (var i in files)
						{
							var name = files[i];
							if ($es4.$$primitive(new VFile(name).isDirectory()))
							{
								getFiles(name, files_);
							}
							else
							{
								files_.push($es4.$$primitive(new VFile(name)));
							}
						}
						return files_;
					}
;

					return getFiles($$this.src, []);
				}

				return $$this.$$VFile.$$listFiles || ($$this.$$VFile.$$listFiles = listFiles);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'getPath', {
			get:function ()
			{
				var $$this = this;

				function getPath()
				{
					if (false)
					{
					}
					if (true)
					{
						return VFile.path.dirname($$this.src).split('/').pop();
					}
				}

				return $$this.$$VFile.$$getPath || ($$this.$$VFile.$$getPath = getPath);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'getParent', {
			get:function ()
			{
				var $$this = this;

				function getParent()
				{
					if (false)
					{
					}
					if (true)
					{
						return VFile.path.dirname($$this.src).split('/').pop();
					}
				}

				return $$this.$$VFile.$$getParent || ($$this.$$VFile.$$getParent = getParent);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'isHidden', {
			get:function ()
			{
				var $$this = this;

				function isHidden()
				{
					return false;
				}

				return $$this.$$VFile.$$isHidden || ($$this.$$VFile.$$isHidden = isHidden);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'equals', {
			get:function ()
			{
				var $$this = this;

				function equals($$$$file)
				{
					//set default parameter values
					var file = $$$$file;

					return $$this.src == file.src;
				}

				return $$this.$$VFile.$$equals || ($$this.$$VFile.$$equals = equals);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'isDirectory', {
			get:function ()
			{
				var $$this = this;

				function isDirectory()
				{
					if (false)
					{
					}
					if (true)
					{
						return VFile.fs.statSync($$this.src).isDirectory();
					}
				}

				return $$this.$$VFile.$$isDirectory || ($$this.$$VFile.$$isDirectory = isDirectory);
			}});


			//public instance method
			Object.defineProperty(VFile.prototype, 'toString', {
			get:function ()
			{
				var $$this = this;

				function toString()
				{
					return $$this.src;
				}

				return $$this.$$VFile.$$toString || ($$this.$$VFile.$$toString = toString);
			}});

			//properties
			Object.defineProperty(VFile.prototype, 'src', {
			get:function () { var $$this = this; return $$this.$$VFile.src; },
			set:function (value) { var $$this = this; $$this.$$VFile.src = $es4.$$coerce(value, String); }
			});

		});

		//class initializer
		VFile.$$cinit = (function ()
		{
			VFile.$$cinit = undefined;

			//initialize properties
			$$j.fs = require('fs');
			$$j.path = require('path');
		
		});

		function VFile()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof VFile) || $$this.$$VFile !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], VFile) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				VFile.$$construct($$this, $$args);
			}
		}

		//construct
		VFile.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (VFile.$$cinit !== undefined) VFile.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$VFile', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


			//initialize properties
			VFile.$$iinit($$this);

			//call constructor
			if (args !== undefined) VFile.$$constructor.apply($$this, args);
		});

		//initializer
		VFile.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$VFile.src = $es4.$$coerce(undefined, String);
		
		});

		//constructor
		VFile.$$constructor = (function ($$$$src)
		{
			var $$this = this;
			//set default parameter values
			var src = $$$$src;

			if (true)
			{
				$$this.src = FileUtil.fixPath(VFile.path.normalize(src));
			}
			if (false)
			{
			}
		});

		return $es4.$$class(VFile, null, 'VFile');
	})();

	return $es4.$$class(FileUtil, {CLASSES:[VFile]}, 'sweetrush.utils::FileUtil');
})();
//sweetrush.utils.FileUtil


//sweetrush.utils.JsonUtil
$es4.$$package('sweetrush.utils').JsonUtil = (function ()
{
	//class pre initializer
	JsonUtil.$$sinit = (function ()
	{
		JsonUtil.$$sinit = undefined;

		//set prototype and constructor
		JsonUtil.prototype = Object.create(Object.prototype);
		Object.defineProperty(JsonUtil.prototype, "constructor", { value: JsonUtil, enumerable: false });

		//hold private values
		Object.defineProperty(JsonUtil.prototype, '$$v', {value:{}});

		//public instance method
		Object.defineProperty(JsonUtil.prototype, 'parse', {
		get:function ()
		{
			var $$this = this;

			function parse($$$$string)
			{
				//set default parameter values
				var string = $es4.$$coerce($$$$string, String);

				return $es4.$$primitive(new Hydrate(string).result);
			}

			return $$this.$$JsonUtil.$$parse || ($$this.$$JsonUtil.$$parse = parse);
		}});


		//public instance method
		Object.defineProperty(JsonUtil.prototype, 'stringify', {
		get:function ()
		{
			var $$this = this;

			function stringify($$$$obj)
			{
				//set default parameter values
				var obj = $$$$obj;

				return $es4.$$coerce($es4.$$primitive(new Dehydrate(obj).result), String);
			}

			return $$this.$$JsonUtil.$$stringify || ($$this.$$JsonUtil.$$stringify = stringify);
		}});
	});

	//class initializer
	JsonUtil.$$cinit = (function ()
	{
		JsonUtil.$$cinit = undefined;
	});

	function JsonUtil()
	{
		var $$this;

		//save scope
		if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
		else
		{
			var $$this = this;

			if (!($$this instanceof JsonUtil) || $$this.$$JsonUtil !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], JsonUtil) : $es4.$$throwArgumentError();
		}

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			JsonUtil.$$construct($$this, $$args);
		}
	}

	//construct
	JsonUtil.$$construct = (function ($$this, args)
	{
		//initialize function if not initialized
		if (JsonUtil.$$cinit !== undefined) JsonUtil.$$cinit();

		//hold property values, and methods
		Object.defineProperty($$this, '$$JsonUtil', {value:{$$this:$$this, $$p:{}, $$ns:{}}});


		//initialize properties
		JsonUtil.$$iinit($$this);

		//call constructor
		if (args !== undefined) JsonUtil.$$constructor.apply($$this, args);
	});

	//initializer
	JsonUtil.$$iinit = (function ($$this)
	{
	});

	//constructor
	JsonUtil.$$constructor = (function ()
	{
		var $$this = this;
	});

	////////////////INTERNAL CLASS////////////////
	var Hydrate = (function ()
	{
		//imports
		var getDefinitionByName;
		var getQualifiedClassName;
		var Dictionary;
		var Base64Util;

		//class pre initializer
		Hydrate.$$sinit = (function ()
		{
			Hydrate.$$sinit = undefined;

			//initialize imports
			getDefinitionByName = $es4.$$['flash.utils'].getDefinitionByName;
			getQualifiedClassName = $es4.$$['flash.utils'].getQualifiedClassName;
			Dictionary = $es4.$$['flash.utils'].Dictionary;
			Base64Util = $es4.$$['sweetrush.utils'].Base64Util;

			//set prototype and constructor
			Hydrate.prototype = Object.create(Object.prototype);
			Object.defineProperty(Hydrate.prototype, "constructor", { value: Hydrate, enumerable: false });

			//hold private values
			Object.defineProperty(Hydrate.prototype, '$$v', {value:{}});

			//private instance method
			Hydrate.prototype.$$v.hydrateObject = {
			get:function ()
			{
				var $$this = this.$$this;

				function hydrateObject($$$$object, $$$$type)
				{
					//set default parameter values
					var object = $es4.$$coerce($$$$object, Object);
					var type = $es4.$$coerce($$$$type, String);

					if ($$this.$$Hydrate._hydratedIDs[object.id] !== undefined)
					{
						return $$this.$$Hydrate._hydratedIDs[object.id];
					}
					var properties = null;
					var propertyName = null;
					var robject = type === 'array' ? [] : {};
					$$this.$$Hydrate._hydratedIDs[object.id] = robject;
					properties = object.p || {};
					for (propertyName in properties)
					{
						robject[propertyName] = $$this.$$Hydrate.getValueObject(properties[propertyName]);
					}
					return robject;
				}

				return $$this.$$Hydrate.$$p.$$hydrateObject || ($$this.$$Hydrate.$$p.$$hydrateObject = hydrateObject);
			}};


			//private instance method
			Hydrate.prototype.$$v.getValueObject = {
			get:function ()
			{
				var $$this = this.$$this;

				function getValueObject($$$$object)
				{
					//set default parameter values
					var object = $$$$object;

					if ($es4.$$is(object, String) && object == '__NaN__')
					{
						return $es4.$$coerce(NaN, Object);
					}
					if ($es4.$$is(object, String))
					{
						return Base64Util.decodeString(object);
					}
					if ($es4.$$is(object, Number) || $es4.$$is(object, Boolean) || object == null)
					{
						return object;
					}
					if (object.constructor == Object)
					{
						if (object.r !== undefined)
						{
							var id = $es4.$$coerce(object.r, String);
							var obj = $$this.$$Hydrate._dehydratedObj.o;
							return $$this.$$Hydrate.hydrateObject(obj[id], obj[id].type);
						}
					}
					throw $es4.$$primitive(new Error('unknown value type'));
				}

				return $$this.$$Hydrate.$$p.$$getValueObject || ($$this.$$Hydrate.$$p.$$getValueObject = getValueObject);
			}};

			Object.defineProperty(Hydrate.prototype, 'result', {get:function ()
			{
				var $$this = this;
				return $$this.$$Hydrate._result;
			}});

			//properties
			Hydrate.prototype.$$v._dehydratedObj = {
			get:function () { var $$this = this.$$this; return $$this.$$Hydrate.$$p._dehydratedObj; },
			set:function (value) { var $$this = this.$$this; $$this.$$Hydrate.$$p._dehydratedObj = $es4.$$coerce(value, Object); }
			};

			Hydrate.prototype.$$v._hydratedIDs = {
			get:function () { var $$this = this.$$this; return $$this.$$Hydrate.$$p._hydratedIDs; },
			set:function (value) { var $$this = this.$$this; $$this.$$Hydrate.$$p._hydratedIDs = $es4.$$coerce(value, Object); }
			};

			Hydrate.prototype.$$v._result = {
			get:function () { var $$this = this.$$this; return $$this.$$Hydrate.$$p._result; },
			set:function (value) { var $$this = this.$$this; $$this.$$Hydrate.$$p._result = $es4.$$coerce(value, Object); }
			};

		});

		//class initializer
		Hydrate.$$cinit = (function ()
		{
			Hydrate.$$cinit = undefined;
		});

		function Hydrate()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof Hydrate) || $$this.$$Hydrate !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Hydrate) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				Hydrate.$$construct($$this, $$args);
			}
		}

		//construct
		Hydrate.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (Hydrate.$$cinit !== undefined) Hydrate.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$Hydrate', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

			Object.defineProperty($$this.$$Hydrate, '_dehydratedObj', Hydrate.prototype.$$v._dehydratedObj);
			Object.defineProperty($$this.$$Hydrate, '_hydratedIDs', Hydrate.prototype.$$v._hydratedIDs);
			Object.defineProperty($$this.$$Hydrate, '_result', Hydrate.prototype.$$v._result);

			//private instance method
			Object.defineProperty($$this.$$Hydrate, 'hydrateObject', Hydrate.prototype.$$v.hydrateObject);

			//private instance method
			Object.defineProperty($$this.$$Hydrate, 'getValueObject', Hydrate.prototype.$$v.getValueObject);

			//initialize properties
			Hydrate.$$iinit($$this);

			//call constructor
			if (args !== undefined) Hydrate.$$constructor.apply($$this, args);
		});

		//initializer
		Hydrate.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$Hydrate.$$p._dehydratedObj = $es4.$$coerce(undefined, Object);
			$$this.$$Hydrate.$$p._hydratedIDs = $es4.$$coerce(undefined, Object);
			$$this.$$Hydrate.$$p._result = $es4.$$coerce(undefined, Object);
		
		});

		//constructor
		Hydrate.$$constructor = (function ($$$$string)
		{
			var $$this = this;
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);

			if (!string)
			{
				return;
			}
			$$this.$$Hydrate._dehydratedObj = JSON.parse(string) || {};
			$$this.$$Hydrate._dehydratedObj.dehydrated || {};
			$$this.$$Hydrate._hydratedIDs = {};
			$$this.$$Hydrate._result = $$this.$$Hydrate.hydrateObject($$this.$$Hydrate._dehydratedObj.dehydrated, $$this.$$Hydrate._dehydratedObj.type);
		});

		return $es4.$$class(Hydrate, null, 'Hydrate');
	})();

	////////////////INTERNAL CLASS////////////////
	var Dehydrate = (function ()
	{
		//imports
		var getDefinitionByName;
		var getQualifiedClassName;
		var Dictionary;
		var Base64Util;

		//class pre initializer
		Dehydrate.$$sinit = (function ()
		{
			Dehydrate.$$sinit = undefined;

			//initialize imports
			getDefinitionByName = $es4.$$['flash.utils'].getDefinitionByName;
			getQualifiedClassName = $es4.$$['flash.utils'].getQualifiedClassName;
			Dictionary = $es4.$$['flash.utils'].Dictionary;
			Base64Util = $es4.$$['sweetrush.utils'].Base64Util;

			//set prototype and constructor
			Dehydrate.prototype = Object.create(Object.prototype);
			Object.defineProperty(Dehydrate.prototype, "constructor", { value: Dehydrate, enumerable: false });

			//hold private values
			Object.defineProperty(Dehydrate.prototype, '$$v', {value:{}});

			//private instance method
			Dehydrate.prototype.$$v.dehydrateObject = {
			get:function ()
			{
				var $$this = this.$$this;

				function dehydrateObject($$$$object)
				{
					//set default parameter values
					var object = $es4.$$coerce($$$$object, Object);

					var dehydrated = $$this.$$Dehydrate.getDehydrated(object);
					if (dehydrated)
					{
						return dehydrated;
					}
					dehydrated = {};
					dehydrated.id = $$this.$$Dehydrate.generateID();
					dehydrated.type = $es4.$$is(object, Array) ? 'array' : 'object';
					$$this.$$Dehydrate._dehydratedNodes[object] = dehydrated;
					if ($es4.$$is(object, Array) || $es4.$$is($es4.$$typeof(object.valueOf()), Object))
					{
						$$this.$$Dehydrate._dehydratedObjects[dehydrated.id] = dehydrated;
						for (var property in object)
						{
							if (dehydrated.p === undefined)
							{
								dehydrated.p = {};
							}
							dehydrated.p[property] = $$this.$$Dehydrate.getValue(object[property]);
						}
						return dehydrated;
					}
					throw $es4.$$primitive(new Error('Type is not supported for dehydration'));
				}

				return $$this.$$Dehydrate.$$p.$$dehydrateObject || ($$this.$$Dehydrate.$$p.$$dehydrateObject = dehydrateObject);
			}};


			//private instance method
			Dehydrate.prototype.$$v.getDehydrated = {
			get:function ()
			{
				var $$this = this.$$this;

				function getDehydrated($$$$object)
				{
					//set default parameter values
					var object = $es4.$$coerce($$$$object, Object);

					return $$this.$$Dehydrate._dehydratedNodes[object];
				}

				return $$this.$$Dehydrate.$$p.$$getDehydrated || ($$this.$$Dehydrate.$$p.$$getDehydrated = getDehydrated);
			}};


			//private instance method
			Dehydrate.prototype.$$v.getValue = {
			get:function ()
			{
				var $$this = this.$$this;

				function getValue($$$$object)
				{
					//set default parameter values
					var object = $es4.$$coerce($$$$object, Object);

					if ($es4.$$is(object, String))
					{
						return Base64Util.encodeString($es4.$$as(object, String));
					}
					if ($es4.$$is(object, Number) && isNaN($es4.$$as(object, Number)))
					{
						return '__NaN__';
					}
					if ($es4.$$is(object, Number) || $es4.$$is(object, Boolean) || object == null)
					{
						return object;
					}
					object = $$this.$$Dehydrate.dehydrateObject(object);
					return {r:object.id};
				}

				return $$this.$$Dehydrate.$$p.$$getValue || ($$this.$$Dehydrate.$$p.$$getValue = getValue);
			}};


			//private instance method
			Dehydrate.prototype.$$v.generateID = {
			get:function ()
			{
				var $$this = this.$$this;

				function generateID()
				{
					return ($$this.$$Dehydrate._idCounter++).toString();
				}

				return $$this.$$Dehydrate.$$p.$$generateID || ($$this.$$Dehydrate.$$p.$$generateID = generateID);
			}};

			Object.defineProperty(Dehydrate.prototype, 'result', {get:function ()
			{
				var $$this = this;
				return $$this.$$Dehydrate._result;
			}});

			//properties
			Dehydrate.prototype.$$v._dehydratedObjects = {
			get:function () { var $$this = this.$$this; return $$this.$$Dehydrate.$$p._dehydratedObjects; },
			set:function (value) { var $$this = this.$$this; $$this.$$Dehydrate.$$p._dehydratedObjects = $es4.$$coerce(value, Object); }
			};

			Dehydrate.prototype.$$v._dehydratedNodes = {
			get:function () { var $$this = this.$$this; return $$this.$$Dehydrate.$$p._dehydratedNodes; },
			set:function (value) { var $$this = this.$$this; $$this.$$Dehydrate.$$p._dehydratedNodes = $es4.$$coerce(value, Dictionary); }
			};

			Dehydrate.prototype.$$v._idCounter = {
			get:function () { var $$this = this.$$this; return $$this.$$Dehydrate.$$p._idCounter; },
			set:function (value) { var $$this = this.$$this; $$this.$$Dehydrate.$$p._idCounter = $es4.$$coerce(value, int); }
			};

			Dehydrate.prototype.$$v._result = {
			get:function () { var $$this = this.$$this; return $$this.$$Dehydrate.$$p._result; },
			set:function (value) { var $$this = this.$$this; $$this.$$Dehydrate.$$p._result = $es4.$$coerce(value, String); }
			};

		});

		//class initializer
		Dehydrate.$$cinit = (function ()
		{
			Dehydrate.$$cinit = undefined;
		});

		function Dehydrate()
		{
			var $$this;

			//save scope
			if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];
			else
			{
				var $$this = this;

				if (!($$this instanceof Dehydrate) || $$this.$$Dehydrate !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Dehydrate) : $es4.$$throwArgumentError();
			}

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				Dehydrate.$$construct($$this, $$args);
			}
		}

		//construct
		Dehydrate.$$construct = (function ($$this, args)
		{
			//initialize function if not initialized
			if (Dehydrate.$$cinit !== undefined) Dehydrate.$$cinit();

			//hold property values, and methods
			Object.defineProperty($$this, '$$Dehydrate', {value:{$$this:$$this, $$p:{}, $$ns:{}}});

			Object.defineProperty($$this.$$Dehydrate, '_dehydratedObjects', Dehydrate.prototype.$$v._dehydratedObjects);
			Object.defineProperty($$this.$$Dehydrate, '_dehydratedNodes', Dehydrate.prototype.$$v._dehydratedNodes);
			Object.defineProperty($$this.$$Dehydrate, '_idCounter', Dehydrate.prototype.$$v._idCounter);
			Object.defineProperty($$this.$$Dehydrate, '_result', Dehydrate.prototype.$$v._result);

			//private instance method
			Object.defineProperty($$this.$$Dehydrate, 'dehydrateObject', Dehydrate.prototype.$$v.dehydrateObject);

			//private instance method
			Object.defineProperty($$this.$$Dehydrate, 'getDehydrated', Dehydrate.prototype.$$v.getDehydrated);

			//private instance method
			Object.defineProperty($$this.$$Dehydrate, 'getValue', Dehydrate.prototype.$$v.getValue);

			//private instance method
			Object.defineProperty($$this.$$Dehydrate, 'generateID', Dehydrate.prototype.$$v.generateID);

			//initialize properties
			Dehydrate.$$iinit($$this);

			//call constructor
			if (args !== undefined) Dehydrate.$$constructor.apply($$this, args);
		});

		//initializer
		Dehydrate.$$iinit = (function ($$this)
		{
			//initialize properties
			$$this.$$Dehydrate.$$p._dehydratedObjects = $es4.$$coerce({}, Object);
			$$this.$$Dehydrate.$$p._dehydratedNodes = $es4.$$coerce($es4.$$primitive(new Dictionary()), Dictionary);
			$$this.$$Dehydrate.$$p._idCounter = $es4.$$coerce(1, int);
			$$this.$$Dehydrate.$$p._result = $es4.$$coerce(undefined, String);
		
		});

		//constructor
		Dehydrate.$$constructor = (function ($$$$persistable)
		{
			var $$this = this;
			//set default parameter values
			var persistable = $$$$persistable;

			var dehydrated = $$this.$$Dehydrate.dehydrateObject(persistable);
			var obj = {};
			obj.dehydrated = dehydrated;
			obj.type = $es4.$$is(persistable, Array) ? 'array' : 'object';
			obj.o = $$this.$$Dehydrate._dehydratedObjects;
			$$this.$$Dehydrate._result = JSON.stringify(obj);
		});

		return $es4.$$class(Dehydrate, null, 'Dehydrate');
	})();

	return $es4.$$class(JsonUtil, {CLASSES:[Hydrate, Dehydrate]}, 'sweetrush.utils::JsonUtil');
})();
//sweetrush.utils.JsonUtil


$es4.$$['sweetrush.obj'].Token.$$pcinit();

$es4.$$['sweetrush'].Transcompiler.$$pcinit();

$es4.$$['sweetrush.core'].TranslatorPrototype.$$pcinit();

$es4.$$['sweetrush.utils'].Base64Util.$$pcinit();

$es4.$$['sweetrush.obj'].Construct.$$pcinit();

$es4.$$['sweetrush.core'].TranslatorProto.$$pcinit();

$es4.$$['sweetrush.core'].Analyzer.$$pcinit();

$es4.$$['sweetrush.core'].Lexer.$$pcinit();

$es4.$$['sweetrush.core'].Parser.$$pcinit();

$es4.$$['sweetrush.utils'].SwcUtil.$$pcinit();

$es4.$$['sweetrush.utils'].FileUtil.$$pcinit();

$es4.$$['sweetrush.utils'].JsonUtil.$$pcinit();

if ($es4.$$['sweetrush.obj'].Token.$$sinit !== undefined) $es4.$$['sweetrush.obj'].Token.$$sinit();

if ($es4.$$['sweetrush'].Transcompiler.$$sinit !== undefined) $es4.$$['sweetrush'].Transcompiler.$$sinit();

if ($es4.$$['sweetrush.core'].TranslatorPrototype.$$sinit !== undefined) $es4.$$['sweetrush.core'].TranslatorPrototype.$$sinit();

if ($es4.$$['sweetrush.utils'].Base64Util.$$sinit !== undefined) $es4.$$['sweetrush.utils'].Base64Util.$$sinit();

if ($es4.$$['sweetrush.obj'].Construct.$$sinit !== undefined) $es4.$$['sweetrush.obj'].Construct.$$sinit();

if ($es4.$$['sweetrush.core'].TranslatorProto.$$sinit !== undefined) $es4.$$['sweetrush.core'].TranslatorProto.$$sinit();

if ($es4.$$['sweetrush.core'].Analyzer.$$sinit !== undefined) $es4.$$['sweetrush.core'].Analyzer.$$sinit();

if ($es4.$$['sweetrush.core'].Lexer.$$sinit !== undefined) $es4.$$['sweetrush.core'].Lexer.$$sinit();

if ($es4.$$['sweetrush.core'].Parser.$$sinit !== undefined) $es4.$$['sweetrush.core'].Parser.$$sinit();

if ($es4.$$['sweetrush.utils'].SwcUtil.$$sinit !== undefined) $es4.$$['sweetrush.utils'].SwcUtil.$$sinit();

if ($es4.$$['sweetrush.utils'].FileUtil.$$sinit !== undefined) $es4.$$['sweetrush.utils'].FileUtil.$$sinit();

if ($es4.$$['sweetrush.utils'].JsonUtil.$$sinit !== undefined) $es4.$$['sweetrush.utils'].JsonUtil.$$sinit();

window.as3_js = new $es4.$$['sweetrush'].Transcompiler($es4.$$MANUAL_CONSTRUCT)
$es4.$$construct(window.as3_js, $es4.$$EMPTY_ARRAY);
window.as3_js;})();