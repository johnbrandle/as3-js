/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

if (global.$es4 === undefined)
{	
	global.$es4 = global;
	$es4.$$window = global;
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
		if (proto.$$hasOwnProperty === undefined) return false; //nodejs depd blows up without this
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
		
		var argumentsLength = arguments.length;
		var output = '';
		for (var i = 0; i < argumentsLength; i++) output += arguments[i] + ' ';
		
		console.log(output);
		
		return true;
	}

	$es4.$$window.toString = function() { return '[object global]'; }
	Function.__proto__.toString = function() { return 'function Function() {}'; }

	$es4.$$throwArgumentError = function()
	{
		throw new Error('Argument count mismatch on class coercion.  Expected 1, got 0.');
		/*
		throw new ArgumentError('Argument count mismatch on class coercion.  Expected 1, got 0.');
		*/
	}

	$es4.$$window.isXMLName = function()
	{
		throw new Error('isXMLName is not supported at this time.');
	}

	/*
	$es4.$$window.onerror = function(errorMsg, url, lineNumber, colno, error) 
	{
		var event = new CustomEvent('ERROR', {'detail':{'msg':errorMsg, 'url':url, 'line':lineNumber, 'error':error}});
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
			return (arguments.length !== 0) ? ((typeof arguments[0] === 'function') ? arguments[0] : $es4.$$Function.apply(null, arguments)) : this;
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

	/*
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
	*/
	$es4.$$[''].Function.$$pcinit();
	$es4.$$[''].Class.$$pcinit();
	$es4.$$[''].int.$$pcinit();
	$es4.$$[''].uint.$$pcinit();
	$es4.$$[''].Namespace.$$pcinit();
	$es4.$$[''].QName.$$pcinit();
	/*
	$es4.$$[''].Error.$$pcinit();
	$es4.$$[''].ArgumentError.$$pcinit();
	$es4.$$[''].DefinitionError.$$pcinit();
	$es4.$$[''].SecurityError.$$pcinit();
	$es4.$$[''].VerifyError.$$pcinit();
	$es4.$$[''].TypeError.$$pcinit();
	*/
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

//flash.utils.flash_proxy
$es4.$$package('flash.utils').flash_proxy = $es4.$$namespace('http://www.sweetrush.com/flash/proxy', true);
//flash.utils.flash_proxy


//flash.events.Event
$es4.$$package('flash.events').Event = (function ()
{
	//imports
	var Event;

	//class initializer
	Event.$$cinit = (function ()
	{
		Event.$$cinit = undefined;

		//initialize imports
	});

	//method
	$es4.$$private_function('$_withTarget', Event, (function ($$$$event, $$$$target)
	{
		if (Event.$$cinit !== undefined) Event.$$cinit();

		//set default parameter values
		var event = $es4.$$coerce($$$$event, $es4.$$['flash.events'].Event);
		var target = $es4.$$coerce($$$$target, Object);

		var properties = $es4.$$call(event, null, null, '$__properties', $es4.$$EMPTY_ARRAY);
		event = $es4.$$get(properties, null, null, 'EventScope', '$_target') ? $es4.$$call(event, null, null, 'clone', $es4.$$EMPTY_ARRAY) : event;
		$es4.$$set($es4.$$call(event, null, null, '$__properties', $es4.$$EMPTY_ARRAY), null, null, 'EventScope', '$_target', target, '=');
		return event;
	}));

	function Event()
	{
		//initialize class if not initialized
		if (Event.$$cinit !== undefined) Event.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Event) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Event) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('$_properties', $$thisp);

		//constructor
		$es4.$$constructor($$thisp, (function ($$$$type, $$$$bubbles, $$$$cancelable)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);
			var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
			var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);

			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				$es4.$$call($$this, $$this, $$thisp, '$__properties', [{}]);
			}
			var properties = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope');
			$es4.$$set(properties, $$this, $$thisp, '$_type', type, '=');
			$es4.$$set(properties, $$this, $$thisp, '$_bubbles', bubbles, '=');
			$es4.$$set(properties, $$this, $$thisp, '$_cancelable', cancelable, '=');
		}));

		//method
		$es4.$$public_function('$__properties', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = (0 > arguments.length - 1) ? null : $$$$object;

			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				$es4.$$set(object, $$this, $$thisp, 'EventScope', {$_target:null, $_currentTarget:null, $_eventPhase:null, $_withTarget:$es4.$$get(Event, $$this, $$thisp, '$_withTarget'), $_originalTarget:null}, '=');
				$es4.$$set(object, $$this, $$thisp, 'TLScope', $$this, '=');
				return $es4.$$set($$thisp, $$this, $$thisp, '$_properties', object, '=');
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties');
		}));

		//method
		$es4.$$public_function('clone', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$primitive(new (Event)($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_type'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_bubbles'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_cancelable'))), $es4.$$['flash.events'].Event);
		}));

		//method
		$es4.$$public_function('formatToString', $$thisp, (function ($$$$className, $$$$args)
		{
			//set default parameter values
			var className = $es4.$$coerce($$$$className, String);
			for (var $$i = 1, $$length = arguments.length, args = new Array($$length - 1); $$i < $$length; $$i += 1) args[$$i - 1] = arguments[$$i];

			var str = '[' + className;
			for (var i = 0; i < $es4.$$get(args, $$this, $$thisp, 'length'); i++)
			{
				str += ' ' + $es4.$$get(args, $$this, $$thisp, i) + '="' + $es4.$$get($$this, $$this, $$thisp, $es4.$$get(args, $$this, $$thisp, i)) + '"';
			}
			str += ']';
			return str;
		}));

		//method
		$es4.$$public_function('isDefaultPrevented', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_defaultPrevented'), Boolean);
		}));

		//method
		$es4.$$public_function('preventDefault', $$thisp, (function ()
		{
			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_cancelable'))
			{
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_defaultPrevented', true, '=');
			}
		}));

		//method
		$es4.$$public_function('stopImmediatePropagation', $$thisp, (function ()
		{
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_immediatePropagationStopped', true, '=');
		}));

		//method
		$es4.$$public_function('stopPropagation', $$thisp, (function ()
		{
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_propagationStopped', true, '=');
		}));

		//method
		$es4.$$public_function('toString', $$thisp, (function ()
		{
			return $es4.$$call($$this, $$this, $$thisp, 'formatToString', ['Event', 'type', 'bubbles', 'cancelable']);
		}));

		//accessor
		$es4.$$public_accessor('bubbles', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_bubbles'), Boolean);
		}), null);

		//accessor
		$es4.$$public_accessor('cancelable', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_cancelable'), Boolean);
		}), null);

		//accessor
		$es4.$$public_accessor('currentTarget', $$thisp, (function ()
		{
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_currentTarget');
		}), null);

		//accessor
		$es4.$$public_accessor('eventPhase', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_eventPhase'), uint);
		}), null);

		//accessor
		$es4.$$public_accessor('target', $$thisp, (function ()
		{
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_target');
		}), null);

		//accessor
		$es4.$$public_accessor('type', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventScope', '$_type'), String);
		}), null);

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Event, null, 'flash.events::Event');
})();
//flash.events.Event


//flash.net.ObjectEncoding
$es4.$$package('flash.net').ObjectEncoding = (function ()
{
	//imports
	var IDynamicPropertyWriter;

	//properties
	ObjectEncoding.AMF0 = 0;
	ObjectEncoding.AMF3 = 3;
	ObjectEncoding.DEFAULT = 3;

	//class initializer
	ObjectEncoding.$$cinit = (function ()
	{
		ObjectEncoding.$$cinit = undefined;

		//initialize imports
		IDynamicPropertyWriter = $es4.$$['flash.net'].IDynamicPropertyWriter;
	});

	//accessor
	$es4.$$public_accessor('dynamicPropertyWriter', ObjectEncoding, (function ()
	{
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		throw $es4.$$primitive(new (Error)('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"'));
	}), (function ($$$$object)
	{
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		//set default parameter values
		var object = $es4.$$coerce($$$$object, IDynamicPropertyWriter);

		throw $es4.$$primitive(new (Error)('ObjectEncoding: attempted call to an unimplemented function "dynamicPropertyWriter"'));
	}));

	function ObjectEncoding()
	{
		//initialize class if not initialized
		if (ObjectEncoding.$$cinit !== undefined) ObjectEncoding.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof ObjectEncoding) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ObjectEncoding) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
			throw $es4.$$primitive(new (Error)('ObjectEncoding: attempted call to an unimplemented constructor'));
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(ObjectEncoding, null, 'flash.net::ObjectEncoding');
})();
//flash.net.ObjectEncoding


//flash.display.Sprite
$es4.$$package('flash.display').Sprite = (function ()
{
	//class initializer
	Sprite.$$cinit = (function ()
	{
		Sprite.$$cinit = undefined;

	});

	function Sprite()
	{
		//initialize class if not initialized
		if (Sprite.$$cinit !== undefined) Sprite.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Sprite) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Sprite) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

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

	//class initializer
	EventDispatcher.$$cinit = (function ()
	{
		EventDispatcher.$$cinit = undefined;

		//initialize imports
		Event = $es4.$$['flash.events'].Event;
		IEventDispatcher = $es4.$$['flash.events'].IEventDispatcher;
		EventPhase = $es4.$$['flash.events'].EventPhase;
	});

	//method
	$es4.$$private_function('$_processListeners', EventDispatcher, (function ($$$$event, $$$$listeners)
	{
		if (EventDispatcher.$$cinit !== undefined) EventDispatcher.$$cinit();

		//set default parameter values
		var event = $es4.$$coerce($$$$event, Event);
		var listeners = $es4.$$coerce($$$$listeners, Array);

		listeners = $es4.$$call(listeners, null, null, 'slice', $es4.$$EMPTY_ARRAY);
		var listenersLength = $es4.$$get(listeners, null, null, 'length');
		var properties = $es4.$$call(event, null, null, '$__properties', $es4.$$EMPTY_ARRAY);
		for (var i = 0; i < listenersLength; i++)
		{
			if ($es4.$$call(listeners, null, null, i, 'method', [event]) === false)
			{
				$es4.$$call(properties, null, null, 'TLScope', 'stopPropagation', $es4.$$EMPTY_ARRAY);
				$es4.$$call(properties, null, null, 'TLScope', 'preventDefault', $es4.$$EMPTY_ARRAY);
			}
			if ($es4.$$get(properties, null, null, 'EventScope', '$_immediatePropagationStopped'))
			{
				break;
			}
		}
	}));

	function EventDispatcher()
	{
		//initialize class if not initialized
		if (EventDispatcher.$$cinit !== undefined) EventDispatcher.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof EventDispatcher) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], EventDispatcher) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('$_properties', $$thisp);

		//constructor
		$es4.$$constructor($$thisp, (function ($$$$target)
		{
			//set default parameter values
			var target = (0 > arguments.length - 1) ? null : $es4.$$coerce($$$$target, IEventDispatcher);

			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				$es4.$$call($$this, $$this, $$thisp, '$__properties', [{}]);
			}
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_target', target || $$this, '=');
		}));

		//method
		$es4.$$public_function('$__properties', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = (0 > arguments.length - 1) ? null : $$$$object;

			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				$es4.$$set(object, $$this, $$thisp, 'EventDispatcherScope', {$_listeners:{}}, '=');
				$es4.$$set(object, $$this, $$thisp, 'TLScope', $$this, '=');
				return $es4.$$set($$thisp, $$this, $$thisp, '$_properties', object, '=');
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties');
		}));

		//method
		$es4.$$public_function('addEventListener', $$thisp, (function ($$$$type, $$$$listener, $$$$useCapture, $$$$priority, $$$$useWeakReference)
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
			var listenersByType = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_listeners');
			var eventObj = {type:type, method:listener, useCapture:useCapture, priority:priority, useWeakReference:useWeakReference};
			if (!(type in listenersByType))
			{
				$es4.$$set(listenersByType, $$this, $$thisp, type, [eventObj], '=');
			}
			else
			{
				var listeners = $es4.$$coerce($es4.$$get(listenersByType, $$this, $$thisp, type), Array);
				for (var i = $es4.$$coerce($es4.$$get(listeners, $$this, $$thisp, 'length'), int); i--;)
				{
					if (listener == $es4.$$get(listeners, $$this, $$thisp, i, 'method'))
					{
						return;
					}
				}
				$es4.$$call(listenersByType, $$this, $$thisp, type, 'push', [eventObj]);
			}
			$es4.$$call(listenersByType, $$this, $$thisp, type, 'sort', [eventCompare]);

			function eventCompare($$$$item1, $$$$item2) 
			{
				//set default parameter values
				var item1 = $es4.$$coerce($$$$item1, Object);
				var item2 = $es4.$$coerce($$$$item2, Object);

				if ($es4.$$get(item1, $$this, $$thisp, 'priority') > $es4.$$get(item2, $$this, $$thisp, 'priority'))
				{
					return -1;
				}
				else if ($es4.$$get(item1, $$this, $$thisp, 'priority') < $es4.$$get(item2, $$this, $$thisp, 'priority'))
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
;
		}));

		//method
		$es4.$$public_function('dispatchEvent', $$thisp, (function ($$$$event)
		{
			//set default parameter values
			var event = $es4.$$coerce($$$$event, Event);

			var properties = $es4.$$get($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'TLScope');
			var listeners = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_listeners', $es4.$$get(event, $$this, $$thisp, 'type')), Array);
			var target = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_target');
			var bubble = false;
			if (!bubble && !listeners)
			{
				return $es4.$$coerce(!$es4.$$call(properties, $$this, $$thisp, 'isDefaultPrevented', $es4.$$EMPTY_ARRAY), Boolean);
			}
			var parents = null;
			properties = $es4.$$get($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'EventScope');
			if (listeners && !$es4.$$get(properties, $$this, $$thisp, '$_propagationStopped') && !$es4.$$get(properties, $$this, $$thisp, '$_immediatePropagationStopped'))
			{
				event = $es4.$$coerce($es4.$$call(properties, $$this, $$thisp, '$_withTarget', [event, target]), Event);
				properties = $es4.$$get($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'EventScope');
				$es4.$$set(properties, $$this, $$thisp, '$_eventPhase', $es4.$$get(EventPhase, $$this, $$thisp, 'AT_TARGET'), '=');
				$es4.$$set(properties, $$this, $$thisp, '$_currentTarget', $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_target'), '=');
				$es4.$$call(EventDispatcher, $$this, $$thisp, '$_processListeners', [event, listeners]);
			}
			if (bubble && !$es4.$$get(properties, $$this, $$thisp, '$_propagationStopped') && !$es4.$$get(properties, $$this, $$thisp, '$_immediatePropagationStopped'))
			{
				var index = 0;
				var parentsLength = $es4.$$get(parents, $$this, $$thisp, 'length');
				while (parentsLength > index)
				{
					var currentTarget = $es4.$$get(parents, $$this, $$thisp, index);
					var currentBubbleListeners = $es4.$$coerce($es4.$$get($es4.$$call(currentTarget, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'EventDispatcherScope', '$_listeners', $es4.$$get(event, $$this, $$thisp, 'type')), Array);
					if (currentBubbleListeners && $es4.$$get(currentBubbleListeners, $$this, $$thisp, 'length'))
					{
						event = $es4.$$coerce($es4.$$call(properties, $$this, $$thisp, '$_withTarget', [event, target]), Event);
						properties = $es4.$$get($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'EventScope');
						$es4.$$set(properties, $$this, $$thisp, '$_eventPhase', $es4.$$get(EventPhase, $$this, $$thisp, 'BUBBLING_PHASE'), '=');
						$es4.$$set($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'EventScope', '$_currentTarget', currentTarget, '=');
						$es4.$$call(EventDispatcher, $$this, $$thisp, '$_processListeners', [event, currentBubbleListeners]);
						if ($es4.$$get(properties, $$this, $$thisp, '$_propagationStopped') || $es4.$$get(properties, $$this, $$thisp, '$_immediatePropagationStopped'))
						{
							break;
						}
					}
					index++;
				}
			}
			properties = $es4.$$get($es4.$$call(event, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'TLScope');
			return $es4.$$coerce(!$es4.$$call(properties, $$this, $$thisp, 'isDefaultPrevented', $es4.$$EMPTY_ARRAY), Boolean);
		}));

		//method
		$es4.$$public_function('hasEventListener', $$thisp, (function ($$$$type)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);

			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_listeners', type), Boolean);
		}));

		//method
		$es4.$$public_function('removeEventListener', $$thisp, (function ($$$$type, $$$$listener, $$$$useCapture)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);
			var listener = $es4.$$coerce($$$$listener, Function);
			var useCapture = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$useCapture, Boolean);

			if (useCapture)
			{
				trace('Warning: useCapture not supported in EventDispatacher removeEventListener');
			}
			var listenersByType = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_listeners');
			var listeners = $es4.$$coerce($es4.$$get(listenersByType, $$this, $$thisp, type), Array);
			if (!listeners)
			{
				return;
			}
			for (var i = $es4.$$get(listeners, $$this, $$thisp, 'length'); i--;)
			{
				if ($es4.$$get(listeners, $$this, $$thisp, i, 'method') != listener)
				{
					continue;
				}
				if ($es4.$$get(listeners, $$this, $$thisp, 'length') == 1)
				{
					$es4.$$delete(listenersByType, $$this, $$thisp, type);
				}
				else
				{
					$es4.$$call(listeners, $$this, $$thisp, 'splice', [i, 1]);
				}
			}
		}));

		//method
		$es4.$$public_function('willTrigger', $$thisp, (function ($$$$type)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);

			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'EventDispatcherScope', '$_listeners', type), Boolean);
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(EventDispatcher, {IMPLEMENTS:['flash.events.IEventDispatcher']}, 'flash.events::EventDispatcher');
})();
//flash.events.EventDispatcher


//flash.events.TextEvent
$es4.$$package('flash.events').TextEvent = (function ()
{
	//imports
	var TextEvent;
	var Event;

	//properties
	TextEvent.LINK = "link";
	TextEvent.TEXT_INPUT = "textInput";

	//class initializer
	TextEvent.$$cinit = (function ()
	{
		TextEvent.$$cinit = undefined;

		//initialize imports
		Event = $es4.$$['flash.events'].Event;
	});

	function TextEvent()
	{
		//initialize class if not initialized
		if (TextEvent.$$cinit !== undefined) TextEvent.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof TextEvent) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TextEvent) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('_text', $$thisp, String);

		//constructor
		$es4.$$constructor($$thisp, (function ($$$$type, $$$$bubbles, $$$$cancelable, $$$$text)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);
			var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
			var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);
			var text = (3 > arguments.length - 1) ? "" : $es4.$$coerce($$$$text, String);

			$es4.$$super($$thisp).$$z(type, bubbles, cancelable);
			$es4.$$set($$thisp, $$this, $$thisp, '_text', text, '=');
		}));

		//method
		$es4.$$public_function('clone', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$primitive(new (TextEvent)($es4.$$get($$this, $$this, $$thisp, 'type'), $es4.$$get($$this, $$this, $$thisp, 'bubbles'), $es4.$$get($$this, $$this, $$thisp, 'cancelable'), $es4.$$get($$this, $$this, $$thisp, 'text'))), Event);
		}));

		//method
		$es4.$$public_function('toString', $$thisp, (function ()
		{
			return $es4.$$call($$this, $$this, $$thisp, 'formatToString', ['TextEvent', 'bubbles', 'cancelable', 'text']);
		}));

		//accessor
		$es4.$$public_accessor('text', $$thisp, (function ()
		{
			return $es4.$$get($$thisp, $$this, $$thisp, '_text');
		}), (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, String);

			$es4.$$set($$thisp, $$this, $$thisp, '_text', value, '=');
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(TextEvent, {EXTENDS:'flash.events.Event'}, 'flash.events::TextEvent');
})();
//flash.events.TextEvent


//flash.utils.Proxy
$es4.$$package('flash.utils').Proxy = (function ()
{
	//imports
	var flash_proxy;

	//class initializer
	Proxy.$$cinit = (function ()
	{
		Proxy.$$cinit = undefined;

		//initialize imports
		flash_proxy = $es4.$$['flash.utils'].flash_proxy;
	});

	function Proxy()
	{
		//initialize class if not initialized
		if (Proxy.$$cinit !== undefined) Proxy.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Proxy) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Proxy) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('$$isProxy', $$thisp, Boolean);
		$es4.$$private_property('$keys', $$thisp, Array);
		$es4.$$private_property('$values', $$thisp, Array);

		//initializer
		$es4.$$iinit($$thisp, (function ()
		{
			//initialize properties
			$es4.$$set($$this, $$this, $$thisp, '$$isProxy', true, '=');
			$es4.$$set($$this, $$this, $$thisp, '$keys', [], '=');
			$es4.$$set($$this, $$this, $$thisp, '$values', [], '=');
		}));

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//custom namespace method
		$es4.$$cnamespace_function('deleteProperty', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name)
		{
			//set default parameter values
			var name = $$$$name;

			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'); i++)
			{
				if ($es4.$$get($$thisp, $$this, $$thisp, '$keys', i) == name)
				{
					break;
				}
			}
			if (i == $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'))
			{
				return false;
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$keys', 'splice', [i, 1]);
			$es4.$$call($$thisp, $$this, $$thisp, '$values', 'splice', [i, 1]);
			return true;
		}));

		//custom namespace method
		$es4.$$cnamespace_function('getProperty', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name)
		{
			//set default parameter values
			var name = $$$$name;

			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'); i++)
			{
				if ($es4.$$get($$thisp, $$this, $$thisp, '$keys', i) == name)
				{
					break;
				}
			}
			if (i == $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'))
			{
				return undefined;
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '$values', i);
		}));

		//custom namespace method
		$es4.$$cnamespace_function('setProperty', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name, $$$$value)
		{
			//set default parameter values
			var name = $$$$name;
			var value = $$$$value;

			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'); i++)
			{
				if ($es4.$$get($$thisp, $$this, $$thisp, '$keys', i) == name)
				{
					break;
				}
			}
			$es4.$$set($$thisp, $$this, $$thisp, '$keys', i, name, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$values', i, value, '=');
		}));

		//custom namespace method
		$es4.$$cnamespace_function('hasProperty', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name)
		{
			//set default parameter values
			var name = $$$$name;

			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'); i++)
			{
				if ($es4.$$get($$thisp, $$this, $$thisp, '$keys', i) == name)
				{
					return true;
				}
			}
			return false;
		}));

		//custom namespace method
		$es4.$$cnamespace_function('nextName', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$keys', index - 1), String);
		}));

		//custom namespace method
		$es4.$$cnamespace_function('nextNameIndex', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return (index < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length')) ? index + 1 : 0;
		}));

		//custom namespace method
		$es4.$$cnamespace_function('nextValue', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$get($$thisp, $$this, $$thisp, '$values', index - 1);
		}));

		//custom namespace method
		$es4.$$cnamespace_function('callProperty', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name, $$$$rest)
		{
			//set default parameter values
			var name = $$$$name;
			for (var $$i = 1, $$length = arguments.length, rest = new Array($$length - 1); $$i < $$length; $$i += 1) rest[$$i - 1] = arguments[$$i];

			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'); i++)
			{
				if ($es4.$$get($$thisp, $$this, $$thisp, '$keys', i) == name)
				{
					break;
				}
			}
			if (i == $es4.$$get($$thisp, $$this, $$thisp, '$keys', 'length'))
			{
				throw $es4.$$primitive(new (Error)('property not found'));
			}
			return $es4.$$call($$thisp, $$this, $$thisp, '$values', i, 'apply', [$$this, rest]);
		}));

		//custom namespace method
		$es4.$$cnamespace_function('getDescendants', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name)
		{
			//set default parameter values
			var name = $$$$name;

			throw $es4.$$primitive(new (Error)('Proxy: not implemented'));
		}));

		//custom namespace method
		$es4.$$cnamespace_function('isAttribute', $$this, $$thisp, $['flash.utils'].flash_proxy, (function ($$$$name)
		{
			//set default parameter values
			var name = $$$$name;

			throw $es4.$$primitive(new (Error)('Proxy: not implemented'));
		}));

		//method
		$es4.$$private_function('$$get', $$thisp, (function ($$$$key)
		{
			//set default parameter values
			var key = $$$$key;

			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'getProperty', [key]);
		}));

		//method
		$es4.$$private_function('$$set', $$thisp, (function ($$$$key, $$$$value)
		{
			//set default parameter values
			var key = $$$$key;
			var value = $$$$value;

			$es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'setProperty', [key, value]);
			return value;
		}));

		//method
		$es4.$$private_function('$$call', $$thisp, (function ($$$$name, $$$$args)
		{
			//set default parameter values
			var name = $$$$name;
			var args = $es4.$$coerce($$$$args, Array);

			$es4.$$call(args, $$this, $$thisp, 'unshift', [name]);
			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'callProperty', 'apply', [$$this, args]);
		}));

		//method
		$es4.$$private_function('$$delete', $$thisp, (function ($$$$key)
		{
			//set default parameter values
			var key = $$$$key;

			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'deleteProperty', [key]);
		}));

		//method
		$es4.$$private_function('$$nextName', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'nextName', [index]);
		}));

		//method
		$es4.$$private_function('$$nextNameIndex', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'nextNameIndex', [index]);
		}));

		//method
		$es4.$$private_function('$$nextValue', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$call($es4.$$get($$this, $$this, $$thisp).$$namespace($$this.flash_proxy), $$this, $$thisp, 'nextValue', [index]);
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Proxy, null, 'flash.utils::Proxy');
})();
//flash.utils.Proxy


//flash.events.ErrorEvent
$es4.$$package('flash.events').ErrorEvent = (function ()
{
	//imports
	var TextEvent;
	var Event;
	var ErrorEvent;

	//properties
	ErrorEvent.ERROR = 'error';

	//class initializer
	ErrorEvent.$$cinit = (function ()
	{
		ErrorEvent.$$cinit = undefined;

		//initialize imports
		TextEvent = $es4.$$['flash.events'].TextEvent;
		Event = $es4.$$['flash.events'].Event;
	});

	function ErrorEvent()
	{
		//initialize class if not initialized
		if (ErrorEvent.$$cinit !== undefined) ErrorEvent.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof ErrorEvent) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ErrorEvent) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('_errorID', $$thisp, int);

		//initializer
		$es4.$$iinit($$thisp, (function ()
		{
			//initialize properties
			$es4.$$set($$this, $$this, $$thisp, '_errorID', 0, '=');
		}));

		//constructor
		$es4.$$constructor($$thisp, (function ($$$$type, $$$$bubbles, $$$$cancelable, $$$$text, $$$$id)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);
			var bubbles = (1 > arguments.length - 1) ? false : $es4.$$coerce($$$$bubbles, Boolean);
			var cancelable = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$cancelable, Boolean);
			var text = (3 > arguments.length - 1) ? "" : $es4.$$coerce($$$$text, String);
			var id = (4 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$id, int);

			$es4.$$super($$thisp).$$z(type, bubbles, cancelable, text);
			$es4.$$set($$thisp, $$this, $$thisp, '_errorID', id, '=');
		}));

		//method
		$es4.$$public_function('clone', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$primitive(new (ErrorEvent)($es4.$$get($$this, $$this, $$thisp, 'type'), $es4.$$get($$this, $$this, $$thisp, 'bubbles'), $es4.$$get($$this, $$this, $$thisp, 'cancelable'), $es4.$$get($$this, $$this, $$thisp, 'text'), $es4.$$get($$this, $$this, $$thisp, 'errorID'))), Event);
		}));

		//method
		$es4.$$public_function('toString', $$thisp, (function ()
		{
			return $es4.$$call($$this, $$this, $$thisp, 'formatToString', ['ErrorEvent', 'bubbles', 'cancelable', 'text', 'errorID']);
		}));

		//accessor
		$es4.$$public_accessor('errorID', $$thisp, (function ()
		{
			return $es4.$$get($$thisp, $$this, $$thisp, '_errorID');
		}), null);

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(ErrorEvent, {EXTENDS:'flash.events.TextEvent'}, 'flash.events::ErrorEvent');
})();
//flash.events.ErrorEvent


//flash.utils.Endian
$es4.$$package('flash.utils').Endian = (function ()
{
	//properties
	Endian.BIG_ENDIAN = "bigEndian";
	Endian.LITTLE_ENDIAN = "littleEndian";

	//class initializer
	Endian.$$cinit = (function ()
	{
		Endian.$$cinit = undefined;

	});

	function Endian()
	{
		//initialize class if not initialized
		if (Endian.$$cinit !== undefined) Endian.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Endian) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Endian) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Endian, null, 'flash.utils::Endian');
})();
//flash.utils.Endian


//flash.utils.Dictionary
$es4.$$package('flash.utils').Dictionary = (function ()
{
	//class initializer
	Dictionary.$$cinit = (function ()
	{
		Dictionary.$$cinit = undefined;

	});

	function Dictionary()
	{
		//initialize class if not initialized
		if (Dictionary.$$cinit !== undefined) Dictionary.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Dictionary) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Dictionary) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('$$isProxy', $$thisp, Boolean);
		$es4.$$private_property('$map', $$thisp);
		$es4.$$private_property('$keys', $$thisp, Array);
		$es4.$$private_property('$values', $$thisp, Array);

		//initializer
		$es4.$$iinit($$thisp, (function ()
		{
			//initialize properties
			$es4.$$set($$this, $$this, $$thisp, '$$isProxy', true, '=');
			$es4.$$set($$this, $$this, $$thisp, '$map', $es4.$$primitive(new ($es4.$$get(global, $$this, $$thisp, 'Map'))()), '=');
			$es4.$$set($$this, $$this, $$thisp, '$keys', [], '=');
			$es4.$$set($$this, $$this, $$thisp, '$values', [], '=');
		}));

		//constructor
		$es4.$$constructor($$thisp, (function ($$$$weakKeys)
		{
			//set default parameter values
			var weakKeys = (0 > arguments.length - 1) ? false : $es4.$$coerce($$$$weakKeys, Boolean);

			if (weakKeys)
			{
				trace('Warning: Dictionary: does not support weakKeys at this time');
			}
		}));

		//method
		$es4.$$public_function('toJSON', $$thisp, (function ($$$$k)
		{
			//set default parameter values
			var k = $es4.$$coerce($$$$k, String);

			throw $es4.$$primitive(new (Error)('Dictionary: does not support toJSON at this time'));
		}));

		//method
		$es4.$$private_function('$$get', $$thisp, (function ($$$$key)
		{
			//set default parameter values
			var key = $$$$key;

			if (!$es4.$$call($$thisp, $$this, $$thisp, '$map', 'has', [key]))
			{
				return undefined;
			}
			return $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, '$map', 'get', [key]), $$this, $$thisp, 'value');
		}));

		//method
		$es4.$$private_function('$$set', $$thisp, (function ($$$$key, $$$$value)
		{
			//set default parameter values
			var key = $$$$key;
			var value = $$$$value;

			$es4.$$call($$thisp, $$this, $$thisp, '$map', 'set', [key, {index:$es4.$$get($$thisp, $$this, $$thisp, '$values', 'length'), value:value}]);
			$es4.$$call($$thisp, $$this, $$thisp, '$keys', 'push', [key]);
			$es4.$$call($$thisp, $$this, $$thisp, '$values', 'push', [value]);
		}));

		//method
		$es4.$$private_function('$$call', $$thisp, (function ($$$$name, $$$$args)
		{
			//set default parameter values
			var name = $$$$name;
			var args = $es4.$$coerce($$$$args, Array);

			return $es4.$$call($es4.$$call($$thisp, $$this, $$thisp, '$map', 'get', [name]), $$this, $$thisp, 'value', 'apply', [$$this, args]);
		}));

		//method
		$es4.$$private_function('$$delete', $$thisp, (function ($$$$key)
		{
			//set default parameter values
			var key = $$$$key;

			if ($es4.$$call($$thisp, $$this, $$thisp, '$map', 'has', [key]))
			{
				var value = $es4.$$call($$thisp, $$this, $$thisp, '$map', 'get', [key]);
				$es4.$$call($$thisp, $$this, $$thisp, '$values', 'splice', [$es4.$$get(value, $$this, $$thisp, 'index'), 1]);
				$es4.$$call($$thisp, $$this, $$thisp, '$keys', 'splice', [$es4.$$get(value, $$this, $$thisp, 'index'), 1]);
			}
			return $es4.$$coerce($es4.$$call($$thisp, $$this, $$thisp, '$map', 'delete', [key]), Boolean);
		}));

		//method
		$es4.$$private_function('$$nextName', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$get($$thisp, $$this, $$thisp, '$keys', index - 1);
		}));

		//method
		$es4.$$private_function('$$nextNameIndex', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return (index < $es4.$$get($$thisp, $$this, $$thisp, '$values', 'length')) ? index + 1 : 0;
		}));

		//method
		$es4.$$private_function('$$nextValue', $$thisp, (function ($$$$index)
		{
			//set default parameter values
			var index = $es4.$$coerce($$$$index, int);

			return $es4.$$get($$thisp, $$this, $$thisp, '$values', index - 1);
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Dictionary, null, 'flash.utils::Dictionary');
})();
//flash.utils.Dictionary


//flash.events.EventPhase
$es4.$$package('flash.events').EventPhase = (function ()
{
	//properties
	EventPhase.AT_TARGET = 2;
	EventPhase.BUBBLING_PHASE = 3;
	EventPhase.CAPTURING_PHASE = 1;

	//class initializer
	EventPhase.$$cinit = (function ()
	{
		EventPhase.$$cinit = undefined;

	});

	function EventPhase()
	{
		//initialize class if not initialized
		if (EventPhase.$$cinit !== undefined) EventPhase.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof EventPhase) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], EventPhase) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(EventPhase, null, 'flash.events::EventPhase');
})();
//flash.events.EventPhase


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
	ByteArray.BYTES_GROW_SIZE = 1024;

	//class initializer
	ByteArray.$$cinit = (function ()
	{
		ByteArray.$$cinit = undefined;

		//initialize imports
		ObjectEncoding = $es4.$$['flash.net'].ObjectEncoding;
		IDataInput = $es4.$$['flash.utils'].IDataInput;
		Endian = $es4.$$['flash.utils'].Endian;
		IDataOutput = $es4.$$['flash.utils'].IDataOutput;
	});

	//accessor
	$es4.$$public_accessor('defaultObjectEncoding', ByteArray, (function ()
	{
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		return $es4.$$get(ObjectEncoding, null, null, 'AMF3');
	}), (function ($$$$version)
	{
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		//set default parameter values
		var version = $es4.$$coerce($$$$version, uint);

		if (version != $es4.$$get(ObjectEncoding, null, null, 'AMF3'))
		{
			throw $es4.$$primitive(new (Error)('ByteArray: desired object encoding not supported at this time'));
		}
	}));

	function ByteArray()
	{
		//initialize class if not initialized
		if (ByteArray.$$cinit !== undefined) ByteArray.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof ByteArray) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ByteArray) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('$_properties', $$thisp);

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				$es4.$$call($$this, $$this, $$thisp, '$__properties', [{}]);
			}
		}));

		//method
		$es4.$$public_function('$__properties', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = (0 > arguments.length - 1) ? null : $$$$object;

			if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties') === undefined)
			{
				var buffer = $es4.$$call(global, $$this, $$thisp, 'Buffer', 'alloc', [$es4.$$get(ByteArray, $$this, $$thisp, 'BYTES_GROW_SIZE')]);
				$es4.$$set(object, $$this, $$thisp, 'ByteArrayScope', {$_buffer:buffer, $_bytePosition:0, $_byteLength:0, $_endian:$es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN'), $_growSize:$es4.$$get(ByteArray, $$this, $$thisp, 'BYTES_GROW_SIZE')}, '=');
				$es4.$$set(object, $$this, $$thisp, 'TLScope', $$this, '=');
				return $es4.$$set($$thisp, $$this, $$thisp, '$_properties', object, '=');
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties');
		}));

		//method
		$es4.$$public_function('$__getBuffer', $$thisp, (function ()
		{
			return $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'slice', [0, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength')]);
		}));

		//method
		$es4.$$public_function('$__setBuffer', $$thisp, (function ($$$$buffer)
		{
			//set default parameter values
			var buffer = $$$$buffer;

			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', buffer, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', $es4.$$get(buffer, $$this, $$thisp, 'length'), '=');
		}));

		//method
		$es4.$$public_function('$__getArrayBuffer', $$thisp, (function ()
		{
			return $es4.$$call($$this, $$this, $$thisp, '$__getArrayBuffer', $es4.$$EMPTY_ARRAY);
		}));

		//method
		$es4.$$public_function('$__setArrayBuffer', $$thisp, (function ($$$$arrayBuffer)
		{
			//set default parameter values
			var arrayBuffer = $$$$arrayBuffer;

			$es4.$$call($$this, $$this, $$thisp, '$__setBuffer', [arrayBuffer]);
		}));

		//method
		$es4.$$public_function('clear', $$thisp, (function ()
		{
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', null, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 0, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', 0, '=');
		}));

		//method
		$es4.$$public_function('readBoolean', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$call($$this, $$this, $$thisp, 'readByte', $es4.$$EMPTY_ARRAY) !== 0, Boolean);
		}));

		//method
		$es4.$$public_function('readByte', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readInt8', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 1, '+=');
			return $es4.$$coerce(value, int);
		}));

		//method
		$es4.$$public_function('readBytes', $$thisp, (function ($$$$writeTo, $$$$offset, $$$$length)
		{
			//set default parameter values
			var writeTo = $es4.$$coerce($$$$writeTo, $es4.$$['flash.utils'].ByteArray);
			var offset = (1 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$offset, uint);
			var length = (2 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$length, uint);

			var position = $es4.$$get(writeTo, $$this, $$thisp, 'position');
			var bytesAvailable = $es4.$$coerce($es4.$$get($$this, $$this, $$thisp, 'bytesAvailable'), uint);
			$es4.$$call(writeTo, $$this, $$thisp, 'writeBytes', [$$this, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), length]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', bytesAvailable, '+=');
			$es4.$$set(writeTo, $$this, $$thisp, 'position', position, '=');
		}));

		//method
		$es4.$$public_function('readDouble', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readDoubleBE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 8, '+=');
			return $es4.$$coerce(value, Number);
		}));

		//method
		$es4.$$public_function('readFloat', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readFloatBE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, Number);
		}));

		//method
		$es4.$$public_function('readInt', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readInt32BE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, int);
		}));

		//method
		$es4.$$public_function('readMultiByte', $$thisp, (function ($$$$length, $$$$charSet)
		{
			//set default parameter values
			var length = $es4.$$coerce($$$$length, uint);
			var charSet = $es4.$$coerce($$$$charSet, String);

			if (charSet === 'utf-8')
			{
				return $es4.$$call($$this, $$this, $$thisp, 'readUTFBytes', [length]);
			}
			throw $es4.$$primitive(new (Error)('ByteArray: your selected charSet is not supported at this time, use: "utf-8"'));
		}));

		//method
		$es4.$$public_function('readShort', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readInt16BE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
			return $es4.$$coerce(value, int);
		}));

		//method
		$es4.$$public_function('readUnsignedByte', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readUInt8', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 1, '+=');
			return $es4.$$coerce(value, uint);
		}));

		//method
		$es4.$$public_function('readUnsignedInt', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readUInt32BE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, uint);
		}));

		//method
		$es4.$$public_function('readUnsignedShort', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'readUInt16BE', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
			return $es4.$$coerce(value, uint);
		}));

		//method
		$es4.$$public_function('readUTF', $$thisp, (function ()
		{
			var length = $es4.$$call($$this, $$this, $$thisp, 'readUnsignedShort', $es4.$$EMPTY_ARRAY);
			return $es4.$$call($$this, $$this, $$thisp, 'readUTFBytes', [length]);
		}));

		//method
		$es4.$$public_function('readUTFBytes', $$thisp, (function ($$$$length)
		{
			//set default parameter values
			var length = $es4.$$coerce($$$$length, uint);

			if (length == 0)
			{
				return '';
			}
			var string = '';
			var index = 0;
			var bytes = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'slice', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition') + length]);
			if ($es4.$$get(bytes, $$this, $$thisp, 'length') >= 3 && $es4.$$get(bytes, $$this, $$thisp, 0) === 0xEF && $es4.$$get(bytes, $$this, $$thisp, 1) === 0xBB && $es4.$$get(bytes, $$this, $$thisp, 2) === 0xBF)
			{
				index = 3;
			}
			var byte1 = 0;
			var byte2 = 0;
			var byte3 = 0;
			var byte4 = 0;
			while (index < $es4.$$get(bytes, $$this, $$thisp, 'length'))
			{
				byte1 = $es4.$$coerce($es4.$$get(bytes, $$this, $$thisp, index), int);
				if (byte1 < 0x80)
				{
					string += $es4.$$call(String, $$this, $$thisp, 'fromCharCode', [byte1]);
					index++;
					continue;
				}
				if (byte1 > 0xBF && byte1 < 0xE0)
				{
					if (index + 1 >= $es4.$$get(bytes, $$this, $$thisp, 'length'))
					{
						throw "UTF-8 Decode failed. Two byte character was truncated.";
					}
					byte2 = $es4.$$coerce($es4.$$get(bytes, $$this, $$thisp, index + 1), int);
					string += $es4.$$call(String, $$this, $$thisp, 'fromCharCode', [((byte1 & 31) << 6) | (byte2 & 63)]);
					index += 2;
					continue;
				}
				if (byte1 > 0xDF && byte1 < 0xF0)
				{
					if (index + 2 >= $es4.$$get(bytes, $$this, $$thisp, 'length'))
					{
						throw "UTF-8 Decode failed. Multi byte character was truncated.";
					}
					byte2 = $es4.$$coerce($es4.$$get(bytes, $$this, $$thisp, index + 1), int);
					byte3 = $es4.$$coerce($es4.$$get(bytes, $$this, $$thisp, index + 2), int);
					string += $es4.$$call(String, $$this, $$thisp, 'fromCharCode', [((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63)]);
					index += 3;
					continue;
				}
				var charCode = ((byte1 & 0x07) << 18 | ($es4.$$get(bytes, $$this, $$thisp, index + 1) & 0x3F) << 12 | ($es4.$$get(bytes, $$this, $$thisp, index + 2) & 0x3F) << 6 | $es4.$$get(bytes, $$this, $$thisp, index + 3) & 0x3F) - 0x010000;
				string += $es4.$$call(String, $$this, $$thisp, 'fromCharCode', [charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00]);
				index += 4;
			}
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', length, '+=');
			return string;
		}));

		//method
		$es4.$$public_function('writeBoolean', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, Boolean);

			$es4.$$call($$this, $$this, $$thisp, 'writeByte', [int(value)]);
		}));

		//method
		$es4.$$public_function('writeByte', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, int);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 1, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeInt8', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 1, '+=');
		}));

		//method
		$es4.$$private_function('writeUnsignedByte', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, int);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 1, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeUInt8', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 1, '+=');
		}));

		//method
		$es4.$$public_function('writeBytes', $$thisp, (function ($$$$readFrom, $$$$offset, $$$$length)
		{
			//set default parameter values
			var readFrom = $es4.$$coerce($$$$readFrom, $es4.$$['flash.utils'].ByteArray);
			var offset = (1 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$offset, uint);
			var length = (2 > arguments.length - 1) ? 0 : $es4.$$coerce($$$$length, uint);

			if (length == 0)
			{
				length = $es4.$$get(readFrom, $$this, $$thisp, 'length') - offset;
			}
			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = bytePosition + length;
			var buffer = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer');
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					buffer = $es4.$$call(global, $$this, $$thisp, 'Buffer', 'concat', [[$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer'), $es4.$$call(global, $$this, $$thisp, 'Buffer', 'alloc', [newBytePosition + ($es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize', $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize') * 2, '='))])]]);
				}
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
			}
			$es4.$$call($es4.$$call(readFrom, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'ByteArrayScope', '$_buffer', 'copy', [buffer, bytePosition, offset, offset + length]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', buffer, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', newBytePosition, '=');
		}));

		//method
		$es4.$$public_function('writeDouble', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, Number);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 8, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeDoubleBE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 8, '+=');
		}));

		//method
		$es4.$$public_function('writeFloat', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, Number);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeFloatBE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
		}));

		//method
		$es4.$$public_function('writeInt', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, int);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeInt32BE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
		}));

		//method
		$es4.$$public_function('writeMultiByte', $$thisp, (function ($$$$string, $$$$charSet)
		{
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);
			var charSet = $es4.$$coerce($$$$charSet, String);

			if (charSet != 'utf-8')
			{
				throw $es4.$$primitive(new (Error)('ByteArray: your selected charSet is not supported at this time, use: "utf-8"'));
			}
			$es4.$$call($$thisp, $$this, $$thisp, 'internalWriteUTFBytes', [string]);
		}));

		//method
		$es4.$$public_function('writeShort', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, int);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeInt16BE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
		}));

		//method
		$es4.$$private_function('writeUnsignedShort', $$thisp, (function ($$$$value, $$$$endian)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, int);
			var endian = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$endian, String);

			if (!endian)
			{
				endian = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian'), String);
			}
			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeUInt16BE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
		}));

		//method
		$es4.$$public_function('writeUnsignedInt', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, uint);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 4, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeUInt32BE', [value, bytePosition, true]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
		}));

		//method
		$es4.$$public_function('writeUTF', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, String);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + 2, uint);
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
			var length = $es4.$$call($$thisp, $$this, $$thisp, 'internalWriteUTFBytes', [value]);
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'writeUInt16BE', [length, bytePosition, true]);
		}));

		//method
		$es4.$$private_function('internalWriteUTFBytes', $$thisp, (function ($$$$string)
		{
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);

			var bytePosition = $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
			var newBytePosition = $es4.$$coerce(bytePosition + ($es4.$$get(string, $$this, $$thisp, 'length') * 4), uint);
			var buffer = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer');
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
			}
			var length = $es4.$$coerce($es4.$$call(buffer, $$this, $$thisp, 'write', [string, bytePosition]), Number);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', $es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', bytePosition + length, '='), '=');
			return $es4.$$coerce(length, uint);
		}));

		//method
		$es4.$$public_function('writeUTFBytes', $$thisp, (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, String);

			$es4.$$call($$thisp, $$this, $$thisp, 'internalWriteUTFBytes', [value]);
		}));

		//method
		$es4.$$public_function('writeObject', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = $$$$object;

			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "writeObject"'));
		}));

		//method
		$es4.$$public_function('readObject', $$thisp, (function ()
		{
			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "readObject"'));
		}));

		//method
		$es4.$$public_function('toString', $$thisp, (function ()
		{
			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "toString"'));
		}));

		//method
		$es4.$$public_function('compress', $$thisp, (function ($$$$algorithm)
		{
			//set default parameter values
			var algorithm = (0 > arguments.length - 1) ? "zlib" : $es4.$$coerce($$$$algorithm, String);

			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "compress"'));
		}));

		//method
		$es4.$$public_function('deflate', $$thisp, (function ()
		{
			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "deflate"'));
		}));

		//method
		$es4.$$public_function('inflate', $$thisp, (function ()
		{
			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "inflate"'));
		}));

		//method
		$es4.$$public_function('uncompress', $$thisp, (function ($$$$algorithm)
		{
			//set default parameter values
			var algorithm = (0 > arguments.length - 1) ? "zlib" : $es4.$$coerce($$$$algorithm, String);

			throw $es4.$$primitive(new (Error)('ByteArray: attempted call to an unimplemented function "uncompress"'));
		}));

		//accessor
		$es4.$$public_accessor('bytesAvailable', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength') - $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
		}), null);

		//accessor
		$es4.$$public_accessor('endian', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian'), String);
		}), (function ($$$$type)
		{
			//set default parameter values
			var type = $es4.$$coerce($$$$type, String);

			throw $es4.$$primitive(new (Error)('set endian not supported'));
		}));

		//accessor
		$es4.$$public_accessor('length', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'), uint);
		}), (function ($$$$value)
		{
			//set default parameter values
			var value = $es4.$$coerce($$$$value, uint);

			if (value == $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				return;
			}
			var buffer;
			if (value < $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize', $es4.$$get(ByteArray, $$this, $$thisp, 'BYTES_GROW_SIZE'), '=');
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', value, '=');
				if ($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition') > value)
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', value, '=');
				}
				return;
			}
			if (value > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', 'length'))
			{
				buffer = $es4.$$call(global, $$this, $$thisp, 'Buffer', 'concat', [[$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer'), $es4.$$call(global, $$this, $$thisp, 'Buffer', 'alloc', [value + ($es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize', $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize') * 2, '='))])]]);
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_buffer', buffer, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', value, '=');
			}
		}));

		//accessor
		$es4.$$public_accessor('position', $$thisp, (function ()
		{
			return $es4.$$coerce($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), uint);
		}), (function ($$$$offset)
		{
			//set default parameter values
			var offset = $es4.$$coerce($$$$offset, uint);

			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', offset, '=');
		}));

		//accessor
		$es4.$$public_accessor('objectEncoding', $$thisp, (function ()
		{
			return $es4.$$get(ObjectEncoding, $$this, $$thisp, 'AMF3');
		}), (function ($$$$version)
		{
			//set default parameter values
			var version = $es4.$$coerce($$$$version, uint);

			if (version != $es4.$$get(ObjectEncoding, $$this, $$thisp, 'AMF3'))
			{
				throw $es4.$$primitive(new (Error)('ByteArray: desired object encoding not supported at this time'));
			}
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(ByteArray, {IMPLEMENTS:['flash.utils.IDataInput', 'flash.utils.IDataOutput']}, 'flash.utils::ByteArray');
})();
//flash.utils.ByteArray


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

		return $es4.$$coerce($es4.$$call($es4.$$primitive(new (Date)()), $$this, $$thisp, 'getTime', $es4.$$EMPTY_ARRAY) - $es4.$$get(global, $$this, $$thisp, '$es4', '$$startTime'), int);
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

		if ($es4.$$get(object, $$this, $$thisp, '$$isclass') !== undefined)
		{
			return $es4.$$coerce($es4.$$get(object, $$this, $$thisp, '$$fullyQualifiedName'), String);
		}
		else if ($es4.$$get(object, $$this, $$thisp, '$$ismethod') !== undefined)
		{
			return 'builtin.as$0::MethodClosure';
		}
		else if ($es4.$$get(object, $$this, $$thisp, 'constructor', 'name') === 'Number')
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
		else if ($es4.$$get(object, $$this, $$thisp, 'constructor', '$$isclass') !== undefined)
		{
			return $es4.$$coerce($es4.$$get(object, $$this, $$thisp, 'constructor', '$$fullyQualifiedName'), String);
		}
		return $es4.$$coerce($es4.$$get(object, $$this, $$thisp, 'constructor', 'name'), String);
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

		return $es4.$$coerce($es4.$$call(global, $$this, $$thisp, 'setInterval', [function () 
{
	$es4.$$call(closure, $$this, $$thisp, 'apply', [this, rest]);
}
, delay]), uint);
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
		if ($es4.$$get(object, $$this, $$thisp, '$$isclass') !== undefined)
		{
			if (object === Array)
			{
				return 'Object';
			}
			return getQualifiedClassName($es4.$$get(object, $$this, $$thisp, '__proto__'));
		}
		else if ($es4.$$get(object, $$this, $$thisp, '$$ismethod') !== undefined)
		{
			return 'Function';
		}
		else if ($es4.$$get(object, $$this, $$thisp, 'constructor', '$$isclass') !== undefined)
		{
			return getQualifiedClassName($es4.$$get(object, $$this, $$thisp, 'constructor', '__proto__'));
		}
		return $es4.$$coerce($es4.$$get(object, $$this, $$thisp, 'constructor', '__proto__', 'name'), String);
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

		$es4.$$call(global, $$this, $$thisp, 'clearTimeout', [id]);
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

		$es4.$$call(global, $$this, $$thisp, 'clearInterval', [id]);
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

		return $es4.$$coerce($es4.$$call(global, $$this, $$thisp, 'setTimeout', [function () 
{
	$es4.$$call(closure, $$this, $$thisp, 'apply', [this, rest]);
}
, delay]), uint);
}

	return $es4.$$function (setTimeout);
})();
//flash.utils.setTimeout


$es4.$$['flash.utils'].IDataInput.$$pcinit();

$es4.$$['flash.net'].IDynamicPropertyWriter.$$pcinit();

$es4.$$['flash.events'].IEventDispatcher.$$pcinit();

$es4.$$['flash.utils'].IDataOutput.$$pcinit();

$es4.$$['flash.events'].Event.$$pcinit();

$es4.$$['flash.net'].ObjectEncoding.$$pcinit();

$es4.$$['flash.display'].Sprite.$$pcinit();

$es4.$$['flash.events'].EventDispatcher.$$pcinit();

$es4.$$['flash.events'].TextEvent.$$pcinit();

$es4.$$['flash.utils'].Proxy.$$pcinit();

$es4.$$['flash.events'].ErrorEvent.$$pcinit();

$es4.$$['flash.utils'].Endian.$$pcinit();

$es4.$$['flash.utils'].Dictionary.$$pcinit();

$es4.$$['flash.events'].EventPhase.$$pcinit();

$es4.$$['flash.utils'].ByteArray.$$pcinit();

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
	$es4.$$public_property('DEBUG', Transcompiler, Boolean);
	$es4.$$private_property('_swcs', Transcompiler, Object);

	//class initializer
	Transcompiler.$$cinit = (function ()
	{
		Transcompiler.$$cinit = undefined;

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

		//initialize properties
		Transcompiler.DEBUG = true;
		Transcompiler._swcs = {builtin:{}, playerGlobal:{}};
	});

	function Transcompiler()
	{
		//initialize class if not initialized
		if (Transcompiler.$$cinit !== undefined) Transcompiler.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Transcompiler) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Transcompiler) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
			$es4.$$super($$thisp).$$z();
		}));

		//method
		$es4.$$public_function('compileTranscompiler', $$thisp, (function ($$$$translationMode, $$$$platform)
		{
			//set default parameter values
			var translationMode = (0 > arguments.length - 1) ? 1 : $es4.$$coerce($$$$translationMode, Number);
			var platform = (1 > arguments.length - 1) ? 'node' : $es4.$$coerce($$$$platform, String);

			return $es4.$$call($$this, $$this, $$thisp, 'compile', [{srcDir:$es4.$$call(FileUtil, $$this, $$thisp, 'getBasePath', $es4.$$EMPTY_ARRAY), mainFile:"sweetrush/Transcompiler.as", compileConstants:{'CONFIG::air':'false', 'CONFIG::node':'true'}, includeBootstrap:true, includePlayerGlobal:true, expose:'as3_js', translationMode:translationMode, excludeDirectories:['_excluded', 'node_modules'], platform:platform}]);
		}));

		//method
		$es4.$$public_function('compile', $$thisp, (function ($$$$params)
		{
			//set default parameter values
			var params = $es4.$$coerce($$$$params, Object);

			var srcDir = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'srcDir'), String);
			var mainFile = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'mainFile'), String);
			var swcs = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'swcs') || [], Array);
			var srcFiles = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'srcFiles') || [], Array);
			var translationMode = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'translationMode') === undefined ? 3 : $es4.$$get(params, $$this, $$thisp, 'translationMode'), Number);
			var compileConstants = $es4.$$get(params, $$this, $$thisp, 'compileConstants') || {};
			var release = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'release'), Boolean);
			var rootConstructs = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'rootConstructs') || [], Array);
			var swcOnly = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'swcOnly'), Boolean);
			var excludeDirectories = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'excludeDirectories') || [], Array);
			var includeBootstrap = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'includeBootstrap') !== undefined ? $es4.$$get(params, $$this, $$thisp, 'includeBootstrap') : true, Boolean);
			var includePlayerGlobal = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'includePlayerGlobal') !== undefined ? $es4.$$get(params, $$this, $$thisp, 'includePlayerGlobal') : includeBootstrap, Boolean);
			var expose = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'expose'), String);
			var platform = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'platform') || 'node', String);
			var special = $es4.$$coerce($es4.$$get(params, $$this, $$thisp, 'special'), Boolean);
			srcDir = $es4.$$coerce($es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [srcDir]), String);
			if (mainFile)
			{
				mainFile = $es4.$$coerce($es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [mainFile]), String);
			}
			if (!special)
			{
				for (var i = 0; i < $es4.$$get(swcs, $$this, $$thisp, 'length'); i++)
				{
					$es4.$$set(swcs, $$this, $$thisp, i, $es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [$es4.$$get(swcs, $$this, $$thisp, i)]), '=');
				}
			}
			var files = $es4.$$call($$thisp, $$this, $$thisp, 'getSrcFiles', [srcDir, srcFiles, excludeDirectories, platform]);
			var innerRootConstruct = null;
			if (!special)
			{
				innerRootConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'getBuiltinSWC', [platform]);
				for (var $$i0 = (innerRootConstruct || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i0 != 0; $$i0 = innerRootConstruct.$$nextNameIndex($$i0))
				{
					var prop = innerRootConstruct.$$nextName($$i0);

					$es4.$$set(rootConstructs, $$this, $$thisp, prop, $es4.$$get(innerRootConstruct, $$this, $$thisp, prop), '=');
				}
				innerRootConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'getPlayerGlobalSWC', [translationMode, platform]);
				for (var $$i1 = (innerRootConstruct || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i1 != 0; $$i1 = innerRootConstruct.$$nextNameIndex($$i1))
				{
					var prop = innerRootConstruct.$$nextName($$i1);

					$es4.$$set(rootConstructs, $$this, $$thisp, prop, $es4.$$get(innerRootConstruct, $$this, $$thisp, prop), '=');
				}
			}
			for (var i = 0; i < $es4.$$get(swcs, $$this, $$thisp, 'length'); i++)
			{
				innerRootConstruct = $es4.$$get(swcs, $$this, $$thisp, i);
				for (var $$i2 = (innerRootConstruct || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i2 != 0; $$i2 = innerRootConstruct.$$nextNameIndex($$i2))
				{
					var prop = innerRootConstruct.$$nextName($$i2);

					$es4.$$set(rootConstructs, $$this, $$thisp, prop, $es4.$$get(innerRootConstruct, $$this, $$thisp, prop), '=');
				}
			}
			var filePaths = {};
			var mainID;
			var rootConstructsToTranslate = {};
			var tokens;
			var rootConstruct;
			for (var $$i3 = (files || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i3 != 0; $$i3 = files.$$nextNameIndex($$i3))
			{
				var filePath = files.$$nextName($$i3);

				if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
				{
					trace('Lexing: ' + filePath);
				}
				tokens = $es4.$$get($es4.$$call(Lexer, $$this, $$thisp, 'lex', [$es4.$$get(files, $$this, $$thisp, filePath)]), $$this, $$thisp, 'tokens');
				if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
				{
					trace('Parsing: ' + filePath);
				}
				rootConstruct = $es4.$$call(Parser, $$this, $$thisp, 'parse', [tokens, compileConstants, release]);
				var id = $es4.$$call($es4.$$call($es4.$$call($es4.$$call(filePath, $$this, $$thisp, 'split', [srcDir]), $$this, $$thisp, 1, 'slice', [1, -3]), $$this, $$thisp, 'split', ['/']), $$this, $$thisp, 'join', ['.']);
				if (filePath == srcDir + '/' + mainFile)
				{
					mainID = id;
				}
				$es4.$$set(rootConstructsToTranslate, $$this, $$thisp, id, $es4.$$set(rootConstructs, $$this, $$thisp, id, rootConstruct, '='), '=');
				$es4.$$set(filePaths, $$this, $$thisp, id, filePath, '=');
			}
			if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
			{
				trace('Creating: swc');
			}
			var jsSWC = $es4.$$call(SwcUtil, $$this, $$thisp, 'stringifySWC', [rootConstructsToTranslate]);
			if (swcOnly)
			{
				return {js:null, rootConstructs:rootConstructsToTranslate, swc:jsSWC};
			}
			$es4.$$call($$thisp, $$this, $$thisp, 'normalizeWildcardImports', [rootConstructs]);
			var js = [];
			var translated = {interfaces:[], classes:[], methods:[], properties:[]};
			var mainJS = '//' + mainID + '\n';
			for (var $$i4 = (rootConstructsToTranslate || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i4 != 0; $$i4 = rootConstructsToTranslate.$$nextNameIndex($$i4))
			{
				var id = rootConstructsToTranslate.$$nextName($$i4);

				if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
				{
					trace('Analyzing: ' + $es4.$$get(filePaths, $$this, $$thisp, id));
				}
				var rootConstruct = $es4.$$call(Analyzer, $$this, $$thisp, 'analyze', [$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id), rootConstructs, translationMode]);
				if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
				{
					trace('Translating: ' + $es4.$$get(filePaths, $$this, $$thisp, id));
				}
				var innerJS = '//' + id + '\n';
				var translatedJS = (translationMode == 3) ? $es4.$$call(TranslatorPrototype, $$this, $$thisp, 'translate', [rootConstruct, rootConstructs, translationMode, release]) : $es4.$$call(TranslatorProto, $$this, $$thisp, 'translate', [rootConstruct, rootConstructs, translationMode, release]);
				innerJS += translatedJS + '//' + id + '\n';
				if (id == mainID)
				{
					mainJS += translatedJS + '//' + mainID + '\n';
				}
				else if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'classConstruct'))
				{
					$es4.$$call(translated, $$this, $$thisp, 'classes', 'push', [innerJS]);
				}
				else if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct'))
				{
					$es4.$$call(translated, $$this, $$thisp, 'interfaces', 'push', [innerJS]);
				}
				else if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'methodConstruct'))
				{
					$es4.$$call(translated, $$this, $$thisp, 'methods', 'push', [innerJS]);
				}
				else if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'propertyConstruct'))
				{
					$es4.$$call(translated, $$this, $$thisp, 'properties', 'push', [innerJS]);
				}
				else
				{
					throw $es4.$$primitive(new (Error)('unknown construct'));
				}
			}
			for (var i = 0; i < $es4.$$get(translated, $$this, $$thisp, 'properties', 'length'); i++)
			{
				$es4.$$call(js, $$this, $$thisp, 'push', [$es4.$$get(translated, $$this, $$thisp, 'properties', i)]);
			}
			if (mainID)
			{
				$es4.$$call(js, $$this, $$thisp, 'push', [mainJS]);
			}
			for (var i = 0; i < $es4.$$get(translated, $$this, $$thisp, 'classes', 'length'); i++)
			{
				$es4.$$call(js, $$this, $$thisp, 'push', [$es4.$$get(translated, $$this, $$thisp, 'classes', i)]);
			}
			for (var i = 0; i < $es4.$$get(translated, $$this, $$thisp, 'interfaces', 'length'); i++)
			{
				$es4.$$call(js, $$this, $$thisp, 'push', [$es4.$$get(translated, $$this, $$thisp, 'interfaces', i)]);
			}
			for (var i = 0; i < $es4.$$get(translated, $$this, $$thisp, 'methods', 'length'); i++)
			{
				$es4.$$call(js, $$this, $$thisp, 'push', [$es4.$$get(translated, $$this, $$thisp, 'methods', i)]);
			}
			translated = null;
			mainJS = null;
			for (var $$i5 = (rootConstructsToTranslate || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i5 != 0; $$i5 = rootConstructsToTranslate.$$nextNameIndex($$i5))
			{
				var id = rootConstructsToTranslate.$$nextName($$i5);

				if (!$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'interfaceConstruct'))
				{
					continue;
				}
				var parts = $es4.$$call(id, $$this, $$thisp, 'split', ['.']);
				var part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				var packageName = ($es4.$$get(parts, $$this, $$thisp, 'length')) ? $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) : '';
				$es4.$$call(js, $$this, $$thisp, 'push', ['$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();']);
			}
			for (var $$i6 = (rootConstructsToTranslate || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i6 != 0; $$i6 = rootConstructsToTranslate.$$nextNameIndex($$i6))
			{
				var id = rootConstructsToTranslate.$$nextName($$i6);

				if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'interfaceConstruct') || $es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'propertyConstruct'))
				{
					continue;
				}
				if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'classConstruct') && $es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'classConstruct', 'UNIMPLEMENTEDToken'))
				{
					continue;
				}
				if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct') && ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'UNIMPLEMENTEDToken') || (!$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'getToken') && !$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'setToken'))))
				{
					continue;
				}
				var parts = $es4.$$call(id, $$this, $$thisp, 'split', ['.']);
				var part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				var packageName = ($es4.$$get(parts, $$this, $$thisp, 'length')) ? $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) : '';
				$es4.$$call(js, $$this, $$thisp, 'push', ['$es4.$$[\'' + packageName + '\'].' + part + '.$$pcinit();']);
			}
			if (translationMode === 3)
			{
				for (var $$i7 = (rootConstructsToTranslate || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i7 != 0; $$i7 = rootConstructsToTranslate.$$nextNameIndex($$i7))
				{
					var id = rootConstructsToTranslate.$$nextName($$i7);

					if (!$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'interfaceConstruct'))
					{
						continue;
					}
					if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'interfaceConstruct', 'UNIMPLEMENTEDToken'))
					{
						continue;
					}
					var parts = $es4.$$call(id, $$this, $$thisp, 'split', ['.']);
					var part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
					var packageName = ($es4.$$get(parts, $$this, $$thisp, 'length')) ? $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) : '';
					$es4.$$call(js, $$this, $$thisp, 'push', ['if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();']);
				}
				for (var $$i8 = (rootConstructsToTranslate || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i8 != 0; $$i8 = rootConstructsToTranslate.$$nextNameIndex($$i8))
				{
					var id = rootConstructsToTranslate.$$nextName($$i8);

					if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'interfaceConstruct') || $es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'propertyConstruct'))
					{
						continue;
					}
					if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'classConstruct') && $es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'classConstruct', 'UNIMPLEMENTEDToken'))
					{
						continue;
					}
					if ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct') && ($es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'UNIMPLEMENTEDToken') || (!$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'getToken') && !$es4.$$get(rootConstructsToTranslate, $$this, $$thisp, id, 'packageConstruct', 'methodConstruct', 'setToken'))))
					{
						continue;
					}
					var parts = $es4.$$call(id, $$this, $$thisp, 'split', ['.']);
					var part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
					var packageName = ($es4.$$get(parts, $$this, $$thisp, 'length')) ? $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) : '';
					$es4.$$call(js, $$this, $$thisp, 'push', ['if ($es4.$$[\'' + packageName + '\'].' + part + '.$$sinit !== undefined) $es4.$$[\'' + packageName + '\'].' + part + '.$$sinit();']);
				}
			}
			var returnObject = '';
			if (mainID)
			{
				var parts = $es4.$$call(mainID, $$this, $$thisp, 'split', ['.']);
				var name = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				var packageName = ($es4.$$get(parts, $$this, $$thisp, 'length')) ? $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) : '';
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
				$es4.$$call(js, $$this, $$thisp, 'push', [lastLine]);
			}
			if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 2)
			{
				trace('\nOutput: \n' + js);
			}
			var bootstrapJS = [];
			if (includeBootstrap)
			{
				var bootstrapJSFileDir = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/bootstrap';
				var list = $es4.$$call(FileUtil, $$this, $$thisp, 'getList', [bootstrapJSFileDir, true, $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_filters', [[$es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_directories', $es4.$$EMPTY_ARRAY), $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_hidden', $es4.$$EMPTY_ARRAY), $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_extension', ['js', true])]])]);
				for (var i = 0; i < $es4.$$get(list, $$this, $$thisp, 'length'); i++)
				{
					var filePath = $es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [$es4.$$get(list, $$this, $$thisp, i, 'src')]);
					var parts = $es4.$$call(filePath, $$this, $$thisp, 'split', ['.']);
					var found = $es4.$$get(parts, $$this, $$thisp, 'length') == 2;
					for (var j = 1; j < $es4.$$get(parts, $$this, $$thisp, 'length') - 1; j++)
					{
						if ($es4.$$get(parts, $$this, $$thisp, j) != platform)
						{
							continue;
						}
						found = true;
						break;
					}
					if (found)
					{
						$es4.$$call(bootstrapJS, $$this, $$thisp, 'push', [$es4.$$call(FileUtil, $$this, $$thisp, 'read', [filePath])]);
					}
				}
				if (includePlayerGlobal)
				{
					$es4.$$call(bootstrapJS, $$this, $$thisp, 'push', [$es4.$$call($$thisp, $$this, $$thisp, 'getPlayerGlobalJS', [translationMode, platform])]);
				}
			}
			var pre = (platform != 'node') ? '//__ES4__\n\n(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; \n\n' : '';
			var post = (platform != 'node') ? '})();' : '';
			return {js:pre + $es4.$$call($es4.$$call(bootstrapJS, $$this, $$thisp, 'concat', [js]), $$this, $$thisp, 'join', ['\n\n']) + post, rootConstructs:rootConstructsToTranslate, swc:jsSWC};
		}));

		//method
		$es4.$$private_function('getSrcFiles', $$thisp, (function ($$$$srcDir, $$$$srcFiles, $$$$excludeDirectories, $$$$platform)
		{
			//set default parameter values
			var srcDir = $es4.$$coerce($$$$srcDir, String);
			var srcFiles = $es4.$$coerce($$$$srcFiles, Array);
			var excludeDirectories = $es4.$$coerce($$$$excludeDirectories, Array);
			var platform = $es4.$$coerce($$$$platform, String);

			var filters = [$es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_directories', $es4.$$EMPTY_ARRAY), $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_hidden', $es4.$$EMPTY_ARRAY), $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_extension', ['as', true])];
			for (var i = 0; i < $es4.$$get(excludeDirectories, $$this, $$thisp, 'length'); i++)
			{
				$es4.$$call(filters, $$this, $$thisp, 'push', [$es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_directory', [$es4.$$call(FileUtil, $$this, $$thisp, 'resolvePath', [srcDir, $es4.$$get(excludeDirectories, $$this, $$thisp, i)])])]);
			}
			var list = $es4.$$call(FileUtil, $$this, $$thisp, 'getList', [srcDir, true, $es4.$$call(FileUtil, $$this, $$thisp, 'getListFilter_filters', [filters])]);
			var files = {};
			for (var i = 0; i < $es4.$$get(list, $$this, $$thisp, 'length'); i++)
			{
				var filePath = $es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [$es4.$$get(list, $$this, $$thisp, i, 'src')]);
				var parts = $es4.$$call(filePath, $$this, $$thisp, 'split', ['.']);
				var found = $es4.$$get(parts, $$this, $$thisp, 'length') == 2;
				for (var j = 1; j < $es4.$$get(parts, $$this, $$thisp, 'length') - 1; j++)
				{
					if ($es4.$$get(parts, $$this, $$thisp, j) != platform)
					{
						continue;
					}
					found = true;
					filePath = $es4.$$get(parts, $$this, $$thisp, 0) + '.' + $es4.$$get(parts, $$this, $$thisp, $es4.$$get(parts, $$this, $$thisp, 'length') - 1);
					break;
				}
				if (!found)
				{
					continue;
				}
				if ($es4.$$get(srcFiles, $$this, $$thisp, 'length'))
				{
					var found = false;
					for (var j = 0; j < $es4.$$get(srcFiles, $$this, $$thisp, 'length'); j++)
					{
						if ($es4.$$call(filePath, $$this, $$thisp, 'indexOf', [$es4.$$get(srcFiles, $$this, $$thisp, j)]) != -1)
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
				$es4.$$set(files, $$this, $$thisp, $es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [filePath]), $es4.$$call(FileUtil, $$this, $$thisp, 'read', [$es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [$es4.$$get(list, $$this, $$thisp, i, 'src')])]), '=');
			}
			if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
			{
				trace('Normalizing Includes');
			}

			function insertIncludes($$$$filePath, $$$$fileContents, $$$$includes) 
			{
				//set default parameter values
				var filePath = $$$$filePath;
				var fileContents = $$$$fileContents;
				var includes = $$$$includes;

				return $es4.$$call(fileContents, $$this, $$thisp, 'replace', [/include\s*["|'][0-9A-Za-z._\/\\]+["|'];*/g, doReplace]);

				function doReplace($$$$match, $$$$offset, $$$$string) 
				{
					//set default parameter values
					var match = $$$$match;
					var offset = $$$$offset;
					var string = $$$$string;

					var includePath = $es4.$$get($es4.$$call(match, $$this, $$thisp, 'match', [/["|']([0-9A-Za-z._\/\\]+)["|']/]), $$this, $$thisp, 1);
					var parts = $es4.$$call($es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [filePath]), $$this, $$thisp, 'split', ['/']);
					$es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
					var path = $es4.$$call(parts, $$this, $$thisp, 'join', ['/']);
					includePath = $es4.$$call(FileUtil, $$this, $$thisp, 'resolvePath', [path, includePath]);
					trace('found include: ' + includePath + ' in: ' + filePath);
					var parts = $es4.$$call(includePath, $$this, $$thisp, 'split', ['.']);
					var includeFilePath = $es4.$$get(parts, $$this, $$thisp, 0) + '.' + $es4.$$get(parts, $$this, $$thisp, $es4.$$get(parts, $$this, $$thisp, 'length') - 1);
					$es4.$$set(includes, $$this, $$thisp, includeFilePath, includeFilePath, '=');
					return insertIncludes(includePath, $es4.$$call(FileUtil, $$this, $$thisp, 'read', [includePath]), includes);
				}
;
			}
;

			var includes = {};
			for (var $$i9 = (files || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i9 != 0; $$i9 = files.$$nextNameIndex($$i9))
			{
				var filePath = files.$$nextName($$i9);

				$es4.$$set(files, $$this, $$thisp, filePath, insertIncludes(filePath, $es4.$$get(files, $$this, $$thisp, filePath), includes), '=');
			}
			for (var $$i10 = (includes || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i10 != 0; $$i10 = includes.$$nextNameIndex($$i10))
			{
				var filePath = includes.$$nextName($$i10);

				$es4.$$delete(files, $$this, $$thisp, filePath);
			}
			return files;
		}));

		//method
		$es4.$$private_function('normalizeWildcardImports', $$thisp, (function ($$$$rootConstructs)
		{
			//set default parameter values
			var rootConstructs = $es4.$$coerce($$$$rootConstructs, Object);

			if ($es4.$$get(Transcompiler, $$this, $$thisp, 'DEBUG') >= 1)
			{
				trace('Normalizing Imports');
			}
			for (var $$i11 = (rootConstructs || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i11 != 0; $$i11 = rootConstructs.$$nextNameIndex($$i11))
			{
				var id = rootConstructs.$$nextName($$i11);

				var innerRootConstruct = $es4.$$get(rootConstructs, $$this, $$thisp, id);
				var imports = [$es4.$$get(innerRootConstruct, $$this, $$thisp, 'importConstructs'), $es4.$$get(innerRootConstruct, $$this, $$thisp, 'packageConstruct', 'importConstructs')];
				while ($es4.$$get(imports, $$this, $$thisp, 'length'))
				{
					var importConstructs = $es4.$$call(imports, $$this, $$thisp, 'shift', $es4.$$EMPTY_ARRAY);
					var packages = [];
					for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
					{
						var importConstruct = $es4.$$get(importConstructs, $$this, $$thisp, i);
						if (!$es4.$$get(importConstruct, $$this, $$thisp, 'mulToken'))
						{
							continue;
						}
						$es4.$$call(importConstructs, $$this, $$thisp, 'splice', [i, 1]);
						i--;
						$es4.$$call(packages, $$this, $$thisp, 'push', [$es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(importConstruct, $$this, $$thisp, 'nameConstruct')])]);
					}
					while ($es4.$$get(packages, $$this, $$thisp, 'length'))
					{
						var packageName = $es4.$$call(packages, $$this, $$thisp, 'shift', $es4.$$EMPTY_ARRAY);
						for (var $$i12 = (rootConstructs || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i12 != 0; $$i12 = rootConstructs.$$nextNameIndex($$i12))
						{
							var innerId = rootConstructs.$$nextName($$i12);

							if ($es4.$$call(innerId, $$this, $$thisp, 'indexOf', [packageName]) != 0)
							{
								continue;
							}
							var importConstruct = $es4.$$call(Construct, $$this, $$thisp, 'getNewImportConstruct', $es4.$$EMPTY_ARRAY);
							var nameConstruct = $es4.$$call(Construct, $$this, $$thisp, 'getNewNameConstruct', $es4.$$EMPTY_ARRAY);
							var parts = $es4.$$call(innerId, $$this, $$thisp, 'split', ['.']);
							for (var j = 0; j < $es4.$$get(parts, $$this, $$thisp, 'length'); j++)
							{
								var identifierToken = $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'IdentifierTokenType'), $es4.$$get(parts, $$this, $$thisp, j)]);
								$es4.$$call(nameConstruct, $$this, $$thisp, 'identifierTokens', 'push', [identifierToken]);
							}
							$es4.$$set(importConstruct, $$this, $$thisp, 'nameConstruct', nameConstruct, '=');
							$es4.$$call(importConstructs, $$this, $$thisp, 'push', [importConstruct]);
						}
					}
				}
			}
		}));

		//method
		$es4.$$private_function('getBuiltinSWC', $$thisp, (function ($$$$platform)
		{
			//set default parameter values
			var platform = $es4.$$coerce($$$$platform, String);

			if ($es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'builtin', platform))
			{
				return $es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'builtin', platform);
			}
			var builtinSWCFile = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/_generated/builtin.' + platform + '.swc';
			var builtinSWCString = $es4.$$coerce($es4.$$call(FileUtil, $$this, $$thisp, 'exists', [builtinSWCFile]) ? $es4.$$call(FileUtil, $$this, $$thisp, 'read', [builtinSWCFile]) : null, String);
			if (!builtinSWCString || !$es4.$$call(SwcUtil, $$this, $$thisp, 'isValidSWCString', [builtinSWCString]))
			{
				var srcDir = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/builtin';
				var result = $es4.$$call($$this, $$this, $$thisp, 'compile', [{srcDir:srcDir, translationMode:1, special:true, includeBootstrap:false, includePlayerGlobal:false, platform:platform}]);
				$es4.$$call(FileUtil, $$this, $$thisp, 'write', [builtinSWCFile, $es4.$$get(result, $$this, $$thisp, 'swc')]);
				builtinSWCString = $es4.$$coerce($es4.$$get(result, $$this, $$thisp, 'swc'), String);
			}
			return $es4.$$set(Transcompiler, $$this, $$thisp, '_swcs', 'builtin', platform, $es4.$$call(SwcUtil, $$this, $$thisp, 'parseSWCString', [builtinSWCString]), '=');
		}));

		//method
		$es4.$$private_function('getPlayerGlobalSWC', $$thisp, (function ($$$$translationMode, $$$$platform)
		{
			//set default parameter values
			var translationMode = $es4.$$coerce($$$$translationMode, Number);
			var platform = $es4.$$coerce($$$$platform, String);

			if ($es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode))
			{
				return $es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode, 1);
			}
			var playerGlobalSWCFile = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/_generated/playerglobal.' + platform + '.swc';
			var playerGlobalJSFile = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/_generated/playerglobal.' + platform + '.' + translationMode + '.js';
			var playerGlobalSWCString = $es4.$$coerce($es4.$$call(FileUtil, $$this, $$thisp, 'exists', [playerGlobalSWCFile]) ? $es4.$$call(FileUtil, $$this, $$thisp, 'read', [playerGlobalSWCFile]) : null, String);
			var playerGlobalJS = $es4.$$coerce($es4.$$call(FileUtil, $$this, $$thisp, 'exists', [playerGlobalJSFile]) ? $es4.$$call(FileUtil, $$this, $$thisp, 'read', [playerGlobalJSFile]) : null, String);
			if (!playerGlobalSWCString || !playerGlobalJS || !$es4.$$call(SwcUtil, $$this, $$thisp, 'isValidSWCString', [playerGlobalSWCString]))
			{
				var srcDir = $es4.$$call(FileUtil, $$this, $$thisp, 'getExcludedPath', $es4.$$EMPTY_ARRAY) + '/playerglobal';
				var result = $es4.$$call($$this, $$this, $$thisp, 'compile', [{srcDir:srcDir, translationMode:translationMode, swcs:[$es4.$$call($$thisp, $$this, $$thisp, 'getBuiltinSWC', [platform])], special:true, includeBootstrap:false, includePlayerGlobal:false, platform:platform}]);
				$es4.$$call(FileUtil, $$this, $$thisp, 'write', [playerGlobalSWCFile, $es4.$$get(result, $$this, $$thisp, 'swc')]);
				$es4.$$call(FileUtil, $$this, $$thisp, 'write', [playerGlobalJSFile, $es4.$$get(result, $$this, $$thisp, 'js')]);
				playerGlobalSWCString = $es4.$$coerce($es4.$$get(result, $$this, $$thisp, 'swc'), String);
				playerGlobalJS = $es4.$$coerce($es4.$$get(result, $$this, $$thisp, 'js'), String);
			}
			$es4.$$set(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode, [playerGlobalJS], '=');
			return $es4.$$set(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode, 1, $es4.$$call(SwcUtil, $$this, $$thisp, 'parseSWCString', [playerGlobalSWCString]), '=');
		}));

		//method
		$es4.$$private_function('getPlayerGlobalJS', $$thisp, (function ($$$$translationMode, $$$$platform)
		{
			//set default parameter values
			var translationMode = $es4.$$coerce($$$$translationMode, Number);
			var platform = $es4.$$coerce($$$$platform, String);

			if (!$es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode))
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'getPlayerGlobalSWC', [translationMode, platform]);
			}
			return $es4.$$get(Transcompiler, $$this, $$thisp, '_swcs', 'playerGlobal', platform + '_' + translationMode, 0);
		}));

		//method
		$es4.$$public_function('getLexer', $$thisp, (function ()
		{
			return $es4.$$coerce(Lexer, Class);
		}));

		//method
		$es4.$$public_function('getParser', $$thisp, (function ()
		{
			return $es4.$$coerce(Parser, Class);
		}));

		//method
		$es4.$$public_function('getAnalyzer', $$thisp, (function ()
		{
			return $es4.$$coerce(Analyzer, Class);
		}));

		//method
		$es4.$$public_function('getTranslator', $$thisp, (function ($$$$prototype)
		{
			//set default parameter values
			var prototype = (0 > arguments.length - 1) ? true : $es4.$$coerce($$$$prototype, Boolean);

			return $es4.$$coerce(prototype ? TranslatorPrototype : TranslatorProto, Class);
		}));

		//method
		$es4.$$public_function('getSwcUtil', $$thisp, (function ()
		{
			return $es4.$$coerce(SwcUtil, Class);
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Transcompiler, {EXTENDS:'flash.display.Sprite'}, 'sweetrush::Transcompiler');
})();
//sweetrush.Transcompiler


//sweetrush.obj.Construct
$es4.$$package('sweetrush.obj').Construct = (function ()
{
	//properties
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

	//class initializer
	Construct.$$cinit = (function ()
	{
		Construct.$$cinit = undefined;

	});

	//method
	$es4.$$public_function('getNewExpression', Construct, (function ($$$$token, $$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var token = $$$$token;
		var expression = (1 > arguments.length - 1) ? null : $$$$expression;

		return {constructor:$es4.$$get(Construct, null, null, 'Expression'), token:token, expression:expression};
	}));

	//method
	$es4.$$public_function('getNewEmptyExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'EmptyExpression')};
	}));

	//method
	$es4.$$public_function('getNewBinaryExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'BinaryExpression'), token:null, leftExpression:null, rightExpression:null};
	}));

	//method
	$es4.$$public_function('getNewObjectExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ObjectExpression'), objectPropertyConstructs:[]};
	}));

	//method
	$es4.$$public_function('getNewArrayExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ArrayExpression'), valueExpressions:[]};
	}));

	//method
	$es4.$$public_function('getNewNewExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'NewExpression'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewPropertyExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'PropertyExpression'), construct:null, nextPropertyExpression:null, root:false};
	}));

	//method
	$es4.$$public_function('getNewIdentifierConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'IdentifierConstruct'), identifierToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewNamespaceQualifierConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'), namespaceQualifierToken:null, identifierToken:null, namespaceIdentifierToken:null, namespaceIdentifier:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewAtIdentifierConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'AtIdentifierConstruct')};
	}));

	//method
	$es4.$$public_function('getNewDotConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'DotConstruct'), identifierToken:null};
	}));

	//method
	$es4.$$public_function('getNewSuperConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'SuperConstruct'), superToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewThisConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ThisConstruct'), thisToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewE4XSearchConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'E4XSearchConstruct'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewArrayAccessorConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ArrayAccessorConstruct'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewVectorConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'VectorConstruct'), nameConstruct:null};
	}));

	//method
	$es4.$$public_function('getNewTypeConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'TypeConstruct'), mulToken:null, voidToken:null, nameConstruct:null, vectorNameConstruct:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewParenConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ParenConstruct'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewObjectConstruct', Construct, (function ($$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var expression = $$$$expression;

		return {constructor:$es4.$$get(Construct, null, null, 'ObjectConstruct'), expression:expression};
	}));

	//method
	$es4.$$public_function('getNewArrayConstruct', Construct, (function ($$$$expression)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var expression = $$$$expression;

		return {constructor:$es4.$$get(Construct, null, null, 'ArrayConstruct'), expression:expression};
	}));

	//method
	$es4.$$public_function('getNewTernaryExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'TernaryExpression'), conditionExpression:null, trueExpression:null, falseExpression:null};
	}));

	//method
	$es4.$$public_function('getNewRegExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'RegExpression'), string:null};
	}));

	//method
	$es4.$$public_function('getNewParenExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ParenExpression'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewBooleanExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'BooleanExpression'), booleanToken:null};
	}));

	//method
	$es4.$$public_function('getNewNumberExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'NumberExpression'), numberToken:null};
	}));

	//method
	$es4.$$public_function('getNewPrefixExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'PrefixExpression'), incrementToken:null, decrementToken:null, expression:null};
	}));

	//method
	$es4.$$public_function('getNewPostfixExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'PostfixExpression'), incrementToken:null, decrementToken:null, expression:null};
	}));

	//method
	$es4.$$public_function('getNewStringExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'StringExpression'), stringToken:null, stringChunkTokens:[], stringEndToken:null};
	}));

	//method
	$es4.$$public_function('getNewFunctionExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'FunctionExpression'), identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], namedFunctionExpressions:[], identifer:null, type:null};
	}));

	//method
	$es4.$$public_function('getNewFunctionCallConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'FunctionCallConstruct'), argumentExpressions:[]};
	}));

	//method
	$es4.$$public_function('getNewRootConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'RootConstruct'), classConstructs:[], interfaceConstructs:[], methodConstructs:[], propertyConstructs:[], importConstructs:[], packageConstruct:null, namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[]};
	}));

	//method
	$es4.$$public_function('getNewPackageConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'PackageConstruct'), nameConstruct:null, classConstruct:null, importConstructs:[], interfaceConstruct:null, methodConstruct:null, propertyConstruct:null, rootConstruct:null, useConstructs:[]};
	}));

	//method
	$es4.$$public_function('getNewClassConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ClassConstruct'), identifierToken:null, extendsNameConstruct:null, importConstructs:[], initializerStatements:[], implementsNameConstructs:[], metaDataConstructs:[], constructorMethodConstruct:null, propertyConstructs:[], methodConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null, dynamicToken:null, useConstructs:[], UNIMPLEMENTEDToken:null, namespacePropertyConstructs:[], instancePropertyConstructs:[], staticPropertyConstructs:[], instanceMethodConstructs:[], staticMethodConstructs:[], instanceAccessorConstructs:[], staticAccessorConstructs:[], packageName:null, identifer:null, type:null};
	}));

	//method
	$es4.$$public_function('getNewInterfaceConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'InterfaceConstruct'), identifierToken:null, extendsNameConstructs:[], methodConstructs:[], propertyConstructs:[], isInternal:false, packageConstruct:null, rootConstruct:null, packageName:null, identifer:null, type:null};
	}));

	//method
	$es4.$$public_function('getNewNameConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'NameConstruct'), identifierTokens:[]};
	}));

	//method
	$es4.$$public_function('nameConstructToString', Construct, (function ($$$$nameConstruct)
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//set default parameter values
		var nameConstruct = $$$$nameConstruct;

		if ($es4.$$get(nameConstruct, null, null, 'identifierTokens', 'length') == 1)
		{
			return $es4.$$get(nameConstruct, null, null, 'identifierTokens', 0, 'data');
		}
		var data = [];
		for (var i = 0; i < $es4.$$get(nameConstruct, null, null, 'identifierTokens', 'length'); i++)
		{
			$es4.$$call(data, null, null, 'push', [$es4.$$get(nameConstruct, null, null, 'identifierTokens', i, 'data')]);
		}
		return $es4.$$call(data, null, null, 'join', ['.']);
	}));

	//method
	$es4.$$public_function('getNewImportConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ImportConstruct'), nameConstruct:null, mulToken:null};
	}));

	//method
	$es4.$$public_function('getNewUseConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'UseConstruct'), useToken:null, namespaceIdentifierToken:null};
	}));

	//method
	$es4.$$public_function('getNewUseStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'UseStatement'), useToken:null, namespaceIdentifierToken:null};
	}));

	//method
	$es4.$$public_function('getNewForEachStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ForEachStatement'), variableStatement:null, arrayExpression:null, bodyStatements:[], index:null};
	}));

	//method
	$es4.$$public_function('getNewReturnExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ReturnExpression'), expression:null, type:null, expectedType:null};
	}));

	//method
	$es4.$$public_function('getNewDeleteExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'DeleteExpression'), expression:null};
	}));

	//method
	$es4.$$public_function('getNewXMLExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'XMLExpression'), string:null};
	}));

	//method
	$es4.$$public_function('getNewXMLListExpression', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'XMLListExpression'), string:null};
	}));

	//method
	$es4.$$public_function('getNewForStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ForStatement'), variableStatement:null, conditionExpression:null, afterthoughtExpression:null, bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewForInStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ForInStatement'), variableStatement:null, objectExpression:null, bodyStatements:[], index:null};
	}));

	//method
	$es4.$$public_function('getNewLabelStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'LabelStatement'), identifierToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewWhileStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'WhileStatement'), conditionExpression:null, bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewDoWhileStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'DoWhileStatement'), conditionExpression:null, bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewIfStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'IfStatement'), conditionExpression:null, bodyStatements:[], elseIfStatements:[], elseStatement:null};
	}));

	//method
	$es4.$$public_function('getNewElseIfStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ElseIfStatement'), conditionExpression:null, bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewElseStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ElseStatement'), bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewEmptyStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'EmptyStatement'), bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewTryStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'TryStatement'), bodyStatements:[], catchStatements:[], finallyStatement:null};
	}));

	//method
	$es4.$$public_function('getNewCatchStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'CatchStatement'), identifierToken:null, typeConstruct:null, bodyStatements:[], index:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewFinallyStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'FinallyStatement'), bodyStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewBreakStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'BreakStatement'), token:null, identifierToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewContinueStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ContinueStatement'), token:null, identifierToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewThrowStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ThrowStatement'), token:null, expression:null};
	}));

	//method
	$es4.$$public_function('getNewSwitchStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'SwitchStatement'), valueExpression:null, caseStatements:[]};
	}));

	//method
	$es4.$$public_function('getNewCaseStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'CaseStatement'), valueExpression:null, bodyStatements:[], defaultToken:null};
	}));

	//method
	$es4.$$public_function('getNewVarStatement', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'VarStatement'), identifierToken:null, innerVarStatements:[], typeConstruct:null, valueExpression:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewMethodConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'MethodConstruct'), identifierToken:null, parameterConstructs:[], typeConstruct:null, bodyStatements:[], staticToken:null, overrideToken:null, namespaceToken:null, setToken:null, getToken:null, callsSuper:null, isNative:null, isJavaScript:null, javaScriptString:'', namedFunctionExpressions:[], isInternal:null, packageConstruct:null, rootConstruct:null, UNIMPLEMENTEDToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewObjectPropertyConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ObjectPropertyConstruct'), expression:null, valueExpression:null};
	}));

	//method
	$es4.$$public_function('getNewParameterConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'ParameterConstruct'), identifierToken:null, typeConstruct:null, valueExpression:null, restToken:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewPropertyConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'PropertyConstruct'), identifierToken:null, typeConstruct:null, namespaceToken:null, namespaceValueToken:null, namespaceKeywordToken:null, staticToken:null, constToken:null, valueExpression:null, isNative:null, isInternal:false, packageConstruct:null, rootConstruct:null, identifer:null};
	}));

	//method
	$es4.$$public_function('getNewMetaDataConstruct', Construct, (function ()
	{
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		return {constructor:$es4.$$get(Construct, null, null, 'MetaDataConstruct'), tokens:[]};
	}));

	function Construct()
	{
		//initialize class if not initialized
		if (Construct.$$cinit !== undefined) Construct.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Construct) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Construct) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Construct, null, 'sweetrush.obj::Construct');
})();
//sweetrush.obj.Construct


//sweetrush.core.TranslatorProto
$es4.$$package('sweetrush.core').TranslatorProto = (function ()
{
	//imports
	var Construct;
	var Token;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//class initializer
	TranslatorProto.$$cinit = (function ()
	{
		TranslatorProto.$$cinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Parser = $es4.$$['sweetrush.core'].Parser;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
	});

	//method
	$es4.$$public_function('translate', TranslatorProto, (function ($$$$rootConstruct, $$$$rootConstructs, $$$$dynamicPropertyAccess, $$$$release, $$$$fastPropertyAccess)
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
				throw $es4.$$primitive(new (Error)('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < $es4.$$get(rootConstruct, null, null, 'classConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, null, null, 'classConstructs', i);
					}
				}
				for (var i = 0; i < $es4.$$get(rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, null, null, 'interfaceConstructs', i);
					}
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'classConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'classConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'interfaceConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'interfaceConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'propertyConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'propertyConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'methodConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'methodConstruct');
				}
				throw $es4.$$primitive(new (Error)('could not lookup construct in construct: ' + object));
			}
			if ($es4.$$get(object, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'NameConstruct'))
			{
				return lookupConstructInRootConstruct(rootConstruct, $es4.$$call(Construct, null, null, 'nameConstructToString', [object]));
			}
			else if ($es4.$$get(object, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ImportConstruct'))
			{
				return lookupConstructInRootConstruct(rootConstruct, $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(object, null, null, 'nameConstruct')]));
			}
		}
;

		var packageConstruct = $es4.$$get(rootConstruct, null, null, 'packageConstruct');
		var js = print('$es4.$$package(\'' + ($es4.$$get(packageConstruct, null, null, 'nameConstruct') ? $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) : '') + '\').', _indent, 0);
		if ($es4.$$get(packageConstruct, null, null, 'classConstruct'))
		{
			if ($es4.$$get(packageConstruct, null, null, 'classConstruct', 'UNIMPLEMENTEDToken'))
			{
				if (release)
				{
					js += $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data') + ' = null;\n';
					return js;
				}
				js = ($es4.$$get(packageConstruct, null, null, 'nameConstruct')) ? '$es4.$$package(\'' + $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) + '\')' : 'global';
				js += '.' + $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data');
				js += ' = function () { throw new Error(\'Use of unimplemented class: ' + $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data') + '\'); }';
				js += '\n';
				return js;
			}
			js += print(translateClassConstruct($es4.$$get(packageConstruct, null, null, 'classConstruct')), _indent, 0);
		}
		js += ($es4.$$get(packageConstruct, null, null, 'interfaceConstruct')) ? print(translateInterfaceConstruct($es4.$$get(packageConstruct, null, null, 'interfaceConstruct')), _indent, 0) : '';
		js += ($es4.$$get(packageConstruct, null, null, 'propertyConstruct')) ? print(translatePropertyConstruct($es4.$$get(packageConstruct, null, null, 'propertyConstruct')), _indent, 0) : '';
		if ($es4.$$get(packageConstruct, null, null, 'methodConstruct'))
		{
			if ($es4.$$get(packageConstruct, null, null, 'methodConstruct', 'UNIMPLEMENTEDToken'))
			{
				if (release)
				{
					js += $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data') + ' = null;\n';
					return js;
				}
				js = ($es4.$$get(packageConstruct, null, null, 'nameConstruct')) ? '$es4.$$package(\'' + $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) + '\')' : 'global';
				js += '.' + $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data');
				js += ' = function () { throw new Error(\'Use of unimplemented function: ' + $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data') + '\'); }';
				js += '\n';
				return js;
			}
			_inStaticFunction = true;
			js += print(translateFunctionConstruct($es4.$$get(packageConstruct, null, null, 'methodConstruct')), _indent, 0);
		}
		return js;

		function getTranslatedTypeName($$$$type) 
		{
			//set default parameter values
			var type = $$$$type;

			if ($es4.$$get(type, null, null, 'name') == '*' || $es4.$$get(type, null, null, 'name') == 'void')
			{
				return '';
			}
			if ($es4.$$get(_importNameConflicts, null, null, $es4.$$get(type, null, null, 'name')))
			{
				var fullyQualifiedName = $es4.$$get(type, null, null, 'fullyQualifiedName');
				var parts = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
				var name = $es4.$$call(parts, null, null, 'pop', $es4.$$EMPTY_ARRAY);
				return '$es4.$$[\'' + $es4.$$call(parts, null, null, 'join', ['.']) + '\'].' + name;
			}
			return $es4.$$get(type, null, null, 'name');
		}
;

		function translateInterfaceConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//handle cast', _indent + 2, 1);
			js += print('return $es4.$$as(arguments[0], ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ');', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var comma = false;
			var innerJS = '';
			if ($es4.$$get(construct, null, null, 'extendsNameConstructs', 'length'))
			{
				innerJS += 'IMPLEMENTS:[';
				for (var i = 0; i < $es4.$$get(construct, null, null, 'extendsNameConstructs', 'length'); i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = $es4.$$get(construct, null, null, 'extendsNameConstructs', i, 'type');
					var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'extendsNameConstructs', i));
					if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
					{
						innerJS += comma = $es4.$$get(type, null, null, 'fullyQualifiedName');
					}
					else
					{
						innerJS += comma = '\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!$es4.$$get(construct, null, null, 'isInternal'))
			{
				if ($es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
				if ($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
			}
			var packageName = $es4.$$get(construct, null, null, 'packageName');
			var fullyQualifiedName = (packageName) ? packageName + '::' + $es4.$$get(construct, null, null, 'identifierToken', 'data') : $es4.$$get(construct, null, null, 'identifierToken', 'data');
			if (innerJS)
			{
				js += print('return $es4.$$interface(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', ', _indent + 1, 0, 1);
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js += print('return $es4.$$interface(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', null, ', _indent + 1, 0);
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

			return print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = $es4.$$namespace(' + translateExpression($es4.$$get(construct, null, null, 'valueExpression'), _indent, false, construct) + ', true);', 0, 1);
		}
;

		function translateFunctionConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var importConstructs = $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			var js = '';
			var innerJS;
			var cr = false;
			var accessor = $es4.$$get(construct, null, null, 'getToken') || $es4.$$get(construct, null, null, 'setToken');
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('var $$this = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', $$thisp = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			if (accessor)
			{
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$pcinit = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1, 1);
				js += print('return ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1, 0);
			}
			else
			{
				js += print('return $es4.$$function (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ');', _indent + 1, 1, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;

			function translateImports($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				var js = '';
				if ($es4.$$get(importConstructs, null, null, 'length'))
				{
					js += print('//imports', _indent + 1, 1);
				}
				for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
				{
					js += print('var ' + $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data') + ';', _indent + 1, 1);
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
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = (function ()', _indent + 1, 1);
				js += print('{', _indent + 1, 1);
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = undefined;', _indent + 2, 1);
				var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
				if ($es4.$$get(importConstructs, null, null, 'length'))
				{
					js += print('//initialize imports', _indent + 2, 1, 1);
				}
				var importNames = {};
				$es4.$$set(importNames, null, null, $es4.$$get(construct, null, null, 'identifierToken', 'data'), true, '=');
				for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
				{
					var name = $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data');
					var packageName = '';
					if ($es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') > 1)
					{
						var fullyQualifiedName = $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(importConstructs, null, null, i, 'nameConstruct')]);
						fullyQualifiedName = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
						$es4.$$call(fullyQualifiedName, null, null, 'pop', $es4.$$EMPTY_ARRAY);
						packageName = $es4.$$call(fullyQualifiedName, null, null, 'join', ['.']);
					}
					if ($es4.$$get(importNames, null, null, name))
					{
						$es4.$$set(_importNameConflicts, null, null, name, true, '=');
						continue;
					}
					else
					{
						$es4.$$set(importNames, null, null, name, true, '=');
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
					var name = $es4.$$get(construct, null, null, 'getToken') ? 'getter' : 'setter';
					js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '() { $$' + name + '(\'' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '\', ' + '$es4.$$package(\'' + ($es4.$$get(construct, null, null, 'packageConstruct', 'nameConstruct') ? $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(construct, null, null, 'packageConstruct', 'nameConstruct')]) : '') + '\'), (function ()', _indent, 1);
				}
				else
				{
					js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				}
				js += translateParameters(construct, construct);
				if (!accessor)
				{
					js += print(')', 0, (_indent) ? 1 : 0);
				}
				js += print('{', _indent, (_indent) ? 1 : 0);
				js += print('//initialize function if not initialized', _indent + 1, 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(construct, construct);
				if (accessor)
				{
					js += print('//change reference', _indent + 1, 1, 1);
					js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = this;', _indent + 1, $es4.$$get(construct, null, null, 'bodyStatements', 'length') ? 2 : 1);
				}
				if ($es4.$$get(construct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(construct, null, null, 'javaScriptString');
				}
				else
				{
					js += translateStatements($es4.$$get(construct, null, null, 'bodyStatements'), _indent + 1, construct);
				}
				if (accessor)
				{
					js += print('})', ($es4.$$get(construct, null, null, 'isJavaScript')) ? 0 : _indent, 0);
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = undefined;', _indent + 2, 2);
			var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			if ($es4.$$get(importConstructs, null, null, 'length'))
			{
				js += print('//initialize imports', _indent + 2, 1);
			}
			var found = false;
			var importNames = {};
			$es4.$$set(importNames, null, null, $es4.$$get(construct, null, null, 'identifierToken', 'data'), true, '=');
			for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
			{
				found = true;
				var name = $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data');
				var packageName = '';
				if ($es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') > 1)
				{
					var fullyQualifiedName = $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(importConstructs, null, null, i, 'nameConstruct')]);
					fullyQualifiedName = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
					$es4.$$call(fullyQualifiedName, null, null, 'pop', $es4.$$EMPTY_ARRAY);
					packageName = $es4.$$call(fullyQualifiedName, null, null, 'join', ['.']);
				}
				if ($es4.$$get(importNames, null, null, name))
				{
					$es4.$$set(_importNameConflicts, null, null, name, true, '=');
					continue;
				}
				else
				{
					$es4.$$set(importNames, null, null, name, true, '=');
				}
				js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
			}
			var found = false;
			for (var i = 0; i < $es4.$$get(construct, null, null, 'propertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, null, null, 'propertyConstructs', i);
				if (!$es4.$$get(propertyConstruct, null, null, 'staticToken'))
				{
					continue;
				}
				if (!$es4.$$get(propertyConstruct, null, null, 'valueExpression'))
				{
					continue;
				}
				if ($es4.$$get(propertyConstruct, null, null, 'translatedEarlier'))
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1, ($es4.$$get(importConstructs, null, null, 'length')) ? 1 : 0);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var namespaceString;
				if ($es4.$$get(namespaceObj, null, null, 'importID'))
				{
					namespaceString = $es4.$$get(namespaceObj, null, null, 'importID');
				}
				else
				{
					namespaceString = ($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(namespaceObj, null, null, 'name'));
				}
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					js += print('$es4.$$namespace(' + namespaceString + ', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ').' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data'), _indent + 2, 0);
					js += ' = ' + translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
					js += print(';', 0, 1);
				}
				else
				{
					if ($es4.$$get(propertyConstruct, null, null, 'isNative'))
					{
						js += print($es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data'), _indent + 2, 0);
					}
					else
					{
						js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data'), _indent + 2, 0);
					}
					var valueJS = translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
					var typeString = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
					if ($es4.$$get(propertyConstruct, null, null, 'isNative') && $es4.$$get(propertyConstruct, null, null, 'coerce') && isCoerceRequired(propertyConstruct, typeString, valueJS))
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
			js += translateStatements($es4.$$get(construct, null, null, 'initializerStatements'), _indent + 2, construct);
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
			var js = print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '()', _indent, 1);
			js += print('{', _indent, 1);
			js += print('//initialize class if not initialized', _indent + 1, 1);
			js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
			js += print('//save scope', _indent + 1, 1);
			js += print('var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;', _indent + 1, 1);
			js += print('var $$thisp = this;', _indent + 1, 2);
			js += print('//handle possible cast', _indent + 1, 1);
			js += print('if ($$this === $$thisp && (!($$this instanceof ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ') || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ') : $es4.$$throwArgumentError();', _indent + 1, 1);
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

			if ($es4.$$get(construct, null, null, 'isInternal'))
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL CLASS////////////////', _indent + 1, 1);
				js += print('var ' + translateClassConstruct($es4.$$get(_rootConstruct, null, null, 'classConstructs', i)), 1, 0);
			}
			return js;
		}
;

		function translateInternalInterfaces($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, null, null, 'isInternal'))
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL INTERFACE////////////////', _indent + 1, 1);
				js += print('var ' + translateInterfaceConstruct($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i)), 1, 0);
			}
			return js;
		}
;

		function translateClassReturnStatement($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = print('return $es4.$$class(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', ', _indent + 1, 0);
			var comma = false;
			var innerJS = '';
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct'))
			{
				var type = $es4.$$get(construct, null, null, 'extendsNameConstruct', 'type');
				var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'extendsNameConstruct'));
				if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
				{
					innerJS += comma = 'EXTENDS:' + $es4.$$get(type, null, null, 'fullyQualifiedName');
				}
				else
				{
					innerJS += comma = 'EXTENDS:\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
				}
			}
			if ($es4.$$get(construct, null, null, 'implementsNameConstructs', 'length'))
			{
				if (comma)
				{
					innerJS += ', ';
				}
				innerJS += 'IMPLEMENTS:[';
				comma = false;
				for (var i = 0; i < $es4.$$get(construct, null, null, 'implementsNameConstructs', 'length'); i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = $es4.$$get(construct, null, null, 'implementsNameConstructs', i, 'type');
					var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'implementsNameConstructs', i));
					if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
					{
						innerJS += comma = $es4.$$get(type, null, null, 'fullyQualifiedName');
					}
					else
					{
						innerJS += comma = '\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!$es4.$$get(construct, null, null, 'isInternal'))
			{
				if ($es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
				if ($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
			}
			var packageName = $es4.$$get(construct, null, null, 'packageName');
			var fullyQualifiedName = (packageName) ? packageName + '::' + $es4.$$get(construct, null, null, 'identifierToken', 'data') : $es4.$$get(construct, null, null, 'identifierToken', 'data');
			if (innerJS)
			{
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js = print('return $es4.$$class(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', null, ', _indent + 1, 0);
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instancePropertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, null, null, 'instancePropertyConstructs', i);
				if (!$es4.$$get(propertyConstruct, null, null, 'valueExpression'))
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 1, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					var namespaceString = '$$thisp.' + $es4.$$get(propertyConstruct, null, null, 'namespaceToken', 'data');
					if ($es4.$$get(namespaceObj, null, null, 'importID'))
					{
						namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
					}
					js += print('$es4.$$namespace(' + namespaceString + ', $$this).' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 1, 0);
					js += translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
					js += print(';', 0, 1);
				}
				else
				{
					if ($es4.$$get(propertyConstruct, null, null, 'isNative'))
					{
						js += print($es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 1, 0);
						var valueJS = translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
						var typeString = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
						if ($es4.$$get(propertyConstruct, null, null, 'coerce') && isCoerceRequired(propertyConstruct, typeString, valueJS))
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
						js += print('$es4.$$set($$this, $$this, $$thisp, \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct) + ', \'=\')', _indent + 1, 0);
						js += print(';', 0, 1);
					}
					else
					{
						if ($es4.$$get(namespaceObj, null, null, 'isPrivate'))
						{
							js += print('$$thisp.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 1, 0);
						}
						else
						{
							js += print('$$this.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 1, 0);
						}
						js += translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
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
			var methodConstruct = $es4.$$get(construct, null, null, 'constructorMethodConstruct');
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
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct') && (!methodConstruct || (methodConstruct && !$es4.$$get(methodConstruct, null, null, 'callsSuper'))))
			{
				js += print('$es4.$$super($$thisp).$$z();', _indent + 1, 1);
				carriage = true;
			}
			if (methodConstruct)
			{
				var innerJS = print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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
			var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			if ($es4.$$get(importConstructs, null, null, 'length'))
			{
				js += print('//imports', _indent + 1, 1);
			}
			for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
			{
				js += print('var ' + $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data') + ';', _indent + 1, 1);
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
			var propertyConstructs = $es4.$$get(construct, null, null, 'namespacePropertyConstructs');
			var counter = 0;
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//namespaces', _indent + 1, 1);
				}
				js += print('$es4.$$' + $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_namespace(' + ($es4.$$get(propertyConstruct, null, null, 'valueExpression') ? translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '\'') + ', ' + ((isClassLevel) ? $es4.$$get(construct, null, null, 'identifierToken', 'data') : ($es4.$$get(propertyConstruct, null, null, 'namespaceToken', 'data') == 'private' ? '$$thisp' : '$$this')) + ', \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\');', _indent + 1, 1);
			}
			return js;
		}
;

		function translateStaticProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = $es4.$$get(construct, null, null, 'staticPropertyConstructs');
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var type = $es4.$$get(propertyConstruct, null, null, 'identifier', 'type');
				var scope = $es4.$$get(construct, null, null, 'identifierToken', 'data');
				var returnString = ($es4.$$get(type, null, null, 'isGlobal')) ? getTranslatedTypeName(type) : '\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
				var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'importID') : ', ' + ($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(namespaceObj, null, null, 'name'));
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					js += print('$$cnamespace_property(\'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
				else if ($es4.$$get(propertyConstruct, null, null, 'isNative'))
				{
					js += print('var ' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
				}
				else
				{
					if ($es4.$$get(propertyConstruct, null, null, 'constToken') && $es4.$$get(propertyConstruct, null, null, 'valueExpression'))
					{
						if (returnString == 'String' || returnString == 'uint' || returnString == 'int' || returnString == 'Number' || returnString == 'Boolean')
						{
							var constructor = $es4.$$get(propertyConstruct, null, null, 'valueExpression', 'constructor');
							if (constructor === $es4.$$get(Construct, null, null, 'StringExpression') || constructor === $es4.$$get(Construct, null, null, 'NumberExpression') || constructor === $es4.$$get(Construct, null, null, 'BooleanExpression'))
							{
								var valueJS = translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
								var coerce = false;
								if (constructor === $es4.$$get(Construct, null, null, 'StringExpression') && returnString != 'String')
								{
									coerce = true;
								}
								else if (constructor === $es4.$$get(Construct, null, null, 'BooleanExpression') && returnString != 'Boolean')
								{
									coerce = true;
								}
								else if (constructor === $es4.$$get(Construct, null, null, 'NumberExpression'))
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
									js += print(scope + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce(' + valueJS + ', ' + returnString + ');', _indent + 1, 1);
								}
								else
								{
									js += print(scope + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ' + valueJS + ';', _indent + 1, 1);
								}
								$es4.$$set(propertyConstruct, null, null, 'translatedEarlier', true, '=');
								continue;
							}
						}
					}
					js += print('$es4.$$' + $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_property(\'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
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
			var propertyConstructs = $es4.$$get(construct, null, null, 'instancePropertyConstructs');
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var isCNamespace = $es4.$$get(namespaceObj, null, null, 'isCustom');
				var scope = (isCNamespace) ? '$$this, $$thisp' : '$$thisp';
				var returnString = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
				var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'importID') : ', $$thisp.' + $es4.$$get(namespaceObj, null, null, 'name');
				if (isCNamespace)
				{
					js += print('$es4.$$cnamespace_property(\'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + scope + namespaceString + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
				}
				else if ($es4.$$get(propertyConstruct, null, null, 'isNative'))
				{
					js += print('var ' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
				}
				else
				{
					js += print('$es4.$$' + $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_property(\'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + scope + ((returnString) ? ', ' + returnString : '') + ');', _indent + 1, 1);
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'staticMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'staticMethodConstructs', i);
				upLevel();
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var isCNamespace = $es4.$$get(namespaceObj, null, null, 'isCustom');
				var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					if (isCNamespace)
					{
						throw $es4.$$primitive(new (Error)('cannot have native custom namespace native static'));
					}
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
					{
						if (getTranslatedTypeName(type))
						{
							js += print('//method', _indent, 1, (js) ? 1 : 0);
							js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '() { return $es4.$$coerce((function (', _indent, 0);
							js += translateParameters(methodConstruct, construct);
							js += print(')', 0, 1);
							js += print('{', _indent, 1);
							js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
							js += translateDefaultParameterValues(methodConstruct, construct);
							js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
							js += print('}).apply(this, arguments), ' + getTranslatedTypeName(type) + '); }', _indent, 1);
						}
						else
						{
							js += print('//method', _indent, 1, (js) ? 1 : 0);
							js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
							js += translateParameters(methodConstruct, construct);
							js += print(')', 0, 1);
							js += print('{', _indent, 1);
							js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
							js += translateDefaultParameterValues(methodConstruct, construct);
							js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
							js += print('}', _indent, 1);
						}
					}
					else
					{
						js += print('//method', _indent, 1, (js) ? 1 : 0);
						js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
						js += translateParameters(methodConstruct, construct);
						js += print(')', 0, 1);
						js += print('{', _indent, 1);
						js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
						js += translateDefaultParameterValues(methodConstruct, construct);
						if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
						{
							js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
						}
						else
						{
							js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
						}
						js += print('}', _indent, 1);
					}
				}
				else if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += print('//method', _indent, 1, (js) ? 1 : 0);
					js += print('$es4.$$' + $es4.$$get(namespaceObj, null, null, 'name') + '_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 1);
					js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
					{
						js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
					}
					else
					{
						js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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
					var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'normalizedImportID') : ', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(namespaceObj, null, null, 'normalizedName');
					js += print('$$cnamespace_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + namespaceString + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 1);
					js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
					{
						js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
					}
					else
					{
						_inNamespacedFunction = ($es4.$$get(namespaceObj, null, null, 'importID')) ? $es4.$$get(namespaceObj, null, null, 'importID') : ($es4.$$get(namespaceObj, null, null, 'namespaceIsPrivate') ? '$$thisp.' : '$$this.') + $es4.$$get(namespaceObj, null, null, 'name');
						js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
						_inNamespacedFunction = false;
					}
					js += print('})', _indent, 0);
					js += print(');', 0, 1);
				}
				else
				{
					js += print('//method', _indent, 1, (js) ? 1 : 0);
					js += print('$es4.$$' + $es4.$$get(namespaceObj, null, null, 'name') + '_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', (function (', _indent, 0);
					js += translateParameters(methodConstruct, construct);
					js += print(')', 0, 1);
					js += print('{', _indent, 1);
					js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
					js += translateDefaultParameterValues(methodConstruct, construct);
					if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
					{
						js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
					}
					else
					{
						js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'instanceMethodConstructs', i);
				upLevel();
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var isCNamespace = $es4.$$get(namespaceObj, null, null, 'isCustom');
				var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
				js += print((isCNamespace) ? '//custom namespace method' : '//method', _indent, 1, (js) ? 1 : 0);
				var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'normalizedImportID') : ', ' + ($es4.$$get(namespaceObj, null, null, 'namespaceIsPrivate') ? '$$thisp.' : '$$this.') + $es4.$$get(namespaceObj, null, null, 'normalizedName');
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				}
				else
				{
					if (isCNamespace)
					{
						js += print('$es4.$$cnamespace_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', $$this, $$thisp' + namespaceString + ', (function (', _indent, 0);
					}
					else if (!$es4.$$get(methodConstruct, null, null, 'ITERABLEToken') && _fastPropertyAccess)
					{
						js += print('$$thisp.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = function (', _indent, 0);
					}
					else
					{
						js += print('$es4.$$' + $es4.$$get(namespaceObj, null, null, 'name') + '_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', $$thisp, (function (', _indent, 0);
					}
				}
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				}
				else if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					if (isCNamespace)
					{
						_inNamespacedFunction = ($es4.$$get(namespaceObj, null, null, 'importID')) ? $es4.$$get(namespaceObj, null, null, 'importID') : '$$thisp.' + $es4.$$get(namespaceObj, null, null, 'name');
					}
					js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
					_inNamespacedFunction = false;
				}
				if ($es4.$$get(methodConstruct, null, null, 'isNative') || (!$es4.$$get(methodConstruct, null, null, 'ITERABLEToken') && _fastPropertyAccess && !isCNamespace))
				{
					js += print('}', _indent, 1);
				}
				else
				{
					js += print('})', ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : _indent, 0);
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript') && getTranslatedTypeName(type))
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
				js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					throw $es4.$$primitive(new (Error)('accessor cannot be native: ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data')));
				}
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				}
				else if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
					{
						_inNamespacedFunction = ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'importID')) ? $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'importID') : '$es4.$$thisp.' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name');
					}
					js += translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct);
					_inNamespacedFunction = false;
				}
				js += print('})', ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < $es4.$$get(construct, null, null, 'staticAccessorConstructs', 'length'); i++)
			{
				var setterMethodConstruct = $es4.$$get(construct, null, null, 'staticAccessorConstructs', i, 'setter');
				var getterMethodConstruct = $es4.$$get(construct, null, null, 'staticAccessorConstructs', i, 'getter');
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				js += print(($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom')) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'importID') : ', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(namespaceObj, null, null, 'name');
				if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
				{
					js += print('$es4.$$cnamespace_accessor(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + namespaceString + ', ', _indent + 1, 0);
				}
				else
				{
					js += print('$es4.$$' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_accessor(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', ', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? $es4.$$get(getterMethodConstruct, null, null, 'identifier', 'type') : $es4.$$get(setterMethodConstruct, null, null, 'identifier', 'type');
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
				if (!setterMethodConstruct && $es4.$$get(methodConstruct, null, null, 'overrideToken'))
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
				js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					throw $es4.$$primitive(new (Error)('accessor cannot be native: ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data')));
				}
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				}
				else if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
					{
						_inNamespacedFunction = ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'importID')) ? $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'importID') : '$$thisp.' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name');
					}
					js += translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct);
					_inNamespacedFunction = false;
				}
				js += print('})', ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceAccessorConstructs', 'length'); i++)
			{
				var setterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'setter');
				var getterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'getter');
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				js += print(($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom')) ? '//custom namespace accessor' : '//accessor', _indent + 1, 1, (js) ? 1 : 0);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'importID') : ', $$thisp.' + $es4.$$get(namespaceObj, null, null, 'name');
				if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
				{
					js += print('$es4.$$cnamespace_accessor(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', $$this, $$thisp' + namespaceString + ', ', _indent + 1, 0);
				}
				else
				{
					js += print('$es4.$$' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_accessor(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', $$thisp, ', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? $es4.$$get(getterMethodConstruct, null, null, 'identifier', 'type') : $es4.$$get(setterMethodConstruct, null, null, 'identifier', 'type');
				if (!getterMethodConstruct && $es4.$$get(methodConstruct, null, null, 'overrideToken'))
				{
					js += '(function ()';
					js += print('{', _indent + 1, 1, 1);
					js += print('return $es4.$$super($$thisp).' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 2, 0);
					js += print('}), ', _indent + 1, 0, 1);
				}
				else
				{
					js += getMethodConstructJS(getterMethodConstruct, type) + ', ';
				}
				if (!setterMethodConstruct && $es4.$$get(methodConstruct, null, null, 'overrideToken'))
				{
					js += '(function ($$value)';
					js += print('{', _indent + 1, 1, 1);
					js += print('$es4.$$super($$thisp).' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = $$value;', _indent + 2, 0);
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
			for (var i = 0; i < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'); i++)
			{
				var parameterConstruct = $es4.$$get(methodConstruct, null, null, 'parameterConstructs', i);
				js += '$$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data');
				if ((i + 1) < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'))
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
			for (var i = 0; i < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'); i++)
			{
				var parameterConstruct = $es4.$$get(methodConstruct, null, null, 'parameterConstructs', i);
				if (!js)
				{
					js += print('//set default parameter values', _indent + 1, 1);
				}
				if ($es4.$$get(parameterConstruct, null, null, 'restToken') || $es4.$$get(parameterConstruct, null, null, 'valueExpression'))
				{
					if ($es4.$$get(parameterConstruct, null, null, 'restToken'))
					{
						js += print('for (var $$i = ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + ', $$length = arguments.length, ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = new Array($$length - ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + '); $$i < $$length; $$i += 1) ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + '[$$i - ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + '] = arguments[$$i];', _indent + 1, 1);
					}
					else if ($es4.$$get(parameterConstruct, null, null, 'valueExpression'))
					{
						var coerceType = getTranslatedTypeName($es4.$$get(parameterConstruct, null, null, 'identifier', 'type'));
						if (coerceType)
						{
							js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression($es4.$$get(parameterConstruct, null, null, 'valueExpression'), 0, false, construct) + ' : $es4.$$coerce($$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ', ' + coerceType + ');', _indent + 1, 1);
						}
						else
						{
							js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression($es4.$$get(parameterConstruct, null, null, 'valueExpression'), 0, false, construct) + ' : $$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
						}
					}
				}
				else
				{
					var coerceType = getTranslatedTypeName($es4.$$get(parameterConstruct, null, null, 'identifier', 'type'));
					if (coerceType)
					{
						js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce($$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ', ' + coerceType + ');', _indent + 1, 1);
					}
					else
					{
						js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = $$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
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
			for (var i = 0; i < $es4.$$get(statements, null, null, 'length'); i++)
			{
				var statement = $es4.$$get(statements, null, null, i);
				if (i != 0 && $es4.$$get(statements, null, null, i - 1, 'constructor') != $es4.$$get(Construct, null, null, 'FunctionExpression') && $es4.$$get(statements, null, null, i, 'constructor') == $es4.$$get(Construct, null, null, 'FunctionExpression'))
				{
					js += '\n';
				}
				js += translateStatement(statement, indent + 1, false, construct);
				if (i + 1 < $es4.$$get(statements, null, null, 'length') && $es4.$$get(statement, null, null, 'constructor') == 'FunctionExpression')
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
				throw $es4.$$primitive(new (Error)('construct null in translate statement'));
			}
			var js = '';
			switch ($es4.$$get(statement, null, null, 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'EmptyStatement'):
					break;
				case $es4.$$get(Construct, null, null, 'IfStatement'):
					_inIfStatement++;
					js += print('if (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'elseIfStatements', 'length'); i++)
					{
						js += translateStatement($es4.$$get(statement, null, null, 'elseIfStatements', i), _indent, false, construct);
					}
					if ($es4.$$get(statement, null, null, 'elseStatement'))
					{
						js += translateStatement($es4.$$get(statement, null, null, 'elseStatement'), _indent, false, construct);
					}
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'ElseIfStatement'):
					_inIfStatement++;
					js += print('else if (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'ElseStatement'):
					_inIfStatement++;
					js += print('else', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'WhileStatement'):
					js += print('while (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'DoWhileStatement'):
					js += print('do', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					js += print('while (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForStatement'):
					js += print('for (', _indent, 0);
					if ($es4.$$get(statement, null, null, 'variableStatement'))
					{
						js += translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct);
					}
					js += ';';
					if ($es4.$$get(statement, null, null, 'conditionExpression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct);
					}
					js += ';';
					if ($es4.$$get(statement, null, null, 'afterthoughtExpression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'afterthoughtExpression'), _indent, false, construct);
					}
					js += ')\n';
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForEachStatement'):
					_count++;
					var object = translateExpression($es4.$$get(statement, null, null, 'arrayExpression'), _indent, false, construct);
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
					var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'variableStatement', 'identifier', 'type'));
					if (typeString)
					{
						js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
					}
					else
					{
						js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForInStatement'):
					_count++;
					var object = translateExpression($es4.$$get(statement, null, null, 'objectExpression'), _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (' + translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' in ' + translateExpression($es4.$$get(statement, null, null, 'objectExpression'), _indent, false, construct) + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					if (_dynamicPropertyAccess)
					{
						valueJS = object + '.$$nextName(' + index + ')';
						var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'variableStatement', 'identifier', 'type'));
						if (typeString)
						{
							js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
						}
						else
						{
							js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
						}
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'BreakStatement'):
					js += print('break', _indent, 0);
					if ($es4.$$get(statement, null, null, 'identifierToken'))
					{
						js += ' ' + $es4.$$get(statement, null, null, 'identifierToken', 'data');
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'ContinueStatement'):
					js += print('continue', _indent, 0);
					if ($es4.$$get(statement, null, null, 'identifierToken'))
					{
						js += ' ' + $es4.$$get(statement, null, null, 'identifierToken', 'data');
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'ThrowStatement'):
					js += print('throw', _indent, 0);
					if ($es4.$$get(statement, null, null, 'expression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'expression'), _indent, false, construct);
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'TryStatement'):
					js += print('try', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					if ($es4.$$get(statement, null, null, 'catchStatements', 'length') == 1)
					{
						js += print('catch (' + $es4.$$get(statement, null, null, 'catchStatements', 0, 'identifierToken', 'data') + ')', _indent, 1);
					}
					else
					{
						js += print('catch ($$error)', _indent, 1);
					}
					js += print('{', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'catchStatements', 'length'); i++)
					{
						upLevel();
						var catchStatement = $es4.$$get(statement, null, null, 'catchStatements', i);
						var typeName = $es4.$$get(catchStatement, null, null, 'identifier', 'type', 'name');
						if (i == 0 && $es4.$$get(statement, null, null, 'catchStatements', 'length') == 1)
						{
							if (typeName == 'void' || typeName == 'Error')
							{
								js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 1, construct);
							}
							else
							{
								js += print('if ($es4.$$is(' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ', ' + getTranslatedTypeName($es4.$$get(catchStatement, null, null, 'identifier', 'type')) + '))', _indent + 1, 1);
								js += print('{', _indent + 1, 1);
								js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
								js += print('}', _indent + 1, 1);
							}
							downLevel();
							break;
						}
						if (typeName == 'void' || typeName == 'Error')
						{
							js += print('else', _indent + 1, 1);
							js += print('{', _indent + 1, 1);
							js += print('var ' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ' = $$error;', _indent + 2, 1);
							js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
							js += print('}', _indent + 1, 1);
							downLevel();
							break;
						}
						js += print(((i == 0) ? 'if' : 'else if') + ' ($es4.$$is($$error, ' + typeName + '))', _indent + 1, 1);
						js += print('{', _indent + 1, 1);
						js += print('var ' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ' = $$error;', _indent + 2, 1);
						js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
						js += print('}', _indent + 1, 1);
						downLevel();
					}
					js += print('}', _indent, 1);
					if ($es4.$$get(statement, null, null, 'finallyStatement'))
					{
						js += print('finally', _indent, 1);
						js += print('{', _indent, 1);
						js += translateStatements($es4.$$get(statement, null, null, 'finallyStatement', 'bodyStatements'), _indent + 1, construct);
						js += print('}', _indent, 1);
					}
					break;
				case $es4.$$get(Construct, null, null, 'UseStatement'):
					break;
				case $es4.$$get(Construct, null, null, 'VarStatement'):
					var translateVarValueExpression = function ($$$$statement) 
					{
				//set default parameter values
				var statement = $$$$statement;

						var valueJS = translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct);
						var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'identifier', 'type'));
						if (isCoerceRequired(statement, typeString, valueJS))
						{
							valueJS = '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
						}
						return ' = ' + valueJS;
					}
;
					js += print('var ' + $es4.$$get(statement, null, null, 'identifierToken', 'data'), _indent, 0);
					if ($es4.$$get(statement, null, null, 'valueExpression'))
					{
						js += translateVarValueExpression(statement);
					}
					for (var i = 0; i < $es4.$$get(statement, null, null, 'innerVarStatements', 'length'); i++)
					{
						var innerVarStatement = $es4.$$get(statement, null, null, 'innerVarStatements', i);
						js += ', ' + $es4.$$get(innerVarStatement, null, null, 'identifierToken', 'data');
						if ($es4.$$get(innerVarStatement, null, null, 'valueExpression'))
						{
							js += translateVarValueExpression(innerVarStatement);
						}
					}
					if (!inline)
					{
						js += ';\n';
					}
					break;
				case $es4.$$get(Construct, null, null, 'SwitchStatement'):
					js += print('switch (' + translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'caseStatements', 'length'); i++)
					{
						js += translateStatement($es4.$$get(statement, null, null, 'caseStatements', i), _indent + 1, false, construct);
					}
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'CaseStatement'):
					if ($es4.$$get(statement, null, null, 'defaultToken'))
					{
						js += print('default:', _indent, 1);
					}
					else
					{
						js += print('case ' + translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct) + ':', _indent, 1);
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					break;
				case $es4.$$get(Construct, null, null, 'LabelStatement'):
					js += print($es4.$$get(statement, null, null, 'identifierToken', 'data') + ':', _indent, 0);
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
				throw $es4.$$primitive(new (Error)('construct null in translate expression'));
			}
			if (!_indent)
			{
				_indent = 0;
			}
			var js = '';
			outerSwitch:			switch ($es4.$$get(expression, null, null, 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'ParenExpression'):
					js += '(' + translateExpression($es4.$$get(expression, null, null, 'expression'), _indent, toString, construct, operator, expressionString) + ')';
					break;
				case $es4.$$get(Construct, null, null, 'PropertyExpression'):
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
					}
					else
					{
						js += translatePropertyExpression(expression, toString, construct);
					}
					break;
				case $es4.$$get(Construct, null, null, 'NumberExpression'):
					js += $es4.$$get(expression, null, null, 'numberToken', 'data');
					break;
				case $es4.$$get(Construct, null, null, 'StringExpression'):
					if (toString && $es4.$$get(expression, null, null, 'stringToken', 'data') == "'")
					{
						js += '\\' + $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					else
					{
						js += $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					for (var i = 0; i < $es4.$$get(expression, null, null, 'stringChunkTokens', 'length'); i++)
					{
						js += $es4.$$get(expression, null, null, 'stringChunkTokens', i, 'data');
						if (i + 1 < $es4.$$get(expression, null, null, 'stringChunkTokens', 'length'))
						{
							js += '\n';
						}
					}
					if (toString && $es4.$$get(expression, null, null, 'stringToken', 'data') == "'")
					{
						js += '\\' + $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					else
					{
						js += $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					break;
				case $es4.$$get(Construct, null, null, 'ReturnExpression'):
					js += 'return';
					if ($es4.$$get(expression, null, null, 'expression'))
					{
						var typeName = getTranslatedTypeName($es4.$$get(expression, null, null, 'expectedType'));
						var valueJS = translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
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
				case $es4.$$get(Construct, null, null, 'DeleteExpression'):
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, undefined, undefined, construct, true);
					}
					else
					{
						js += 'delete ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
					}
					break;
				case $es4.$$get(Construct, null, null, 'FunctionExpression'):
					upLevel();
					var wasInClosure = _inClosure;
					_inClosure = true;
					if (!$es4.$$get(expression, null, null, 'identifierToken'))
					{
						js += print('function (', 0, 0);
					}
					else
					{
						if (_inIfStatement)
						{
							throw $es4.$$primitive(new (Error)('support for named closures in if/elseif/else statements is not supported at this time.'));
						}
						js += print('function ' + $es4.$$get(expression, null, null, 'identifierToken', 'data') + '(', 0, 0);
					}
					js += translateParameters(expression, construct);
					js += print(') ', 0, 1);
					js += print('{', _indent, 1);
					js += translateDefaultParameterValues(expression, construct);
					js += translateStatements($es4.$$get(expression, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					if (!wasInClosure)
					{
						_inClosure = false;
					}
					downLevel();
					break;
				case $es4.$$get(Construct, null, null, 'ObjectExpression'):
					js += '{';
					for (var i = 0; i < $es4.$$get(expression, null, null, 'objectPropertyConstructs', 'length'); i++)
					{
						var prop;
						if ($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'PropertyExpression'))
						{
							prop = $es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression', 'construct', 'identifierToken', 'data');
						}
						else
						{
							prop = translateExpression($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression'), 0, toString, construct);
						}
						js += prop + ':' + translateExpression($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'valueExpression'), 0, toString, construct);
						if ((i + 1) < $es4.$$get(expression, null, null, 'objectPropertyConstructs', 'length'))
						{
							js += ', ';
						}
					}
					js += '}';
					break;
				case $es4.$$get(Construct, null, null, 'ArrayExpression'):
					js += '[';
					for (var i = 0; i < $es4.$$get(expression, null, null, 'valueExpressions', 'length'); i++)
					{
						if (!$es4.$$get(expression, null, null, 'valueExpressions', i))
						{
							trace('invalid 20');
						}
						js += translateExpression($es4.$$get(expression, null, null, 'valueExpressions', i), 0, toString, construct);
						if ((i + 1) < $es4.$$get(expression, null, null, 'valueExpressions', 'length'))
						{
							js += ', ';
						}
					}
					js += ']';
					break;
				case $es4.$$get(Construct, null, null, 'BooleanExpression'):
					js += $es4.$$get(expression, null, null, 'booleanToken', 'data');
					break;
				case $es4.$$get(Construct, null, null, 'Expression'):
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'TypeofTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 21');
						}
						js += '$es4.$$typeof(' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'VoidTokenType'))
					{
						if ($es4.$$get(expression, null, null, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'EmptyExpression'))
						{
							js += 'void 0';
						}
						else
						{
							if (!$es4.$$get(expression, null, null, 'expression'))
							{
								trace('invalid 01');
							}
							js += 'void ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
						}
						break;
					}
					js += $es4.$$get(expression, null, null, 'token', 'data');
					if ($es4.$$get(expression, null, null, 'expression'))
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 22');
						}
						js += translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
					}
					break;
				case $es4.$$get(Construct, null, null, 'XMLExpression'):
					js += 'new XML(\'' + $es4.$$get(expression, null, null, 'string') + '\')';
					break;
				case $es4.$$get(Construct, null, null, 'XMLListExpression'):
					js += 'new XMLList(\'' + $es4.$$get(expression, null, null, 'string') + '\')';
					break;
				case $es4.$$get(Construct, null, null, 'EmptyExpression'):
					break;
				case $es4.$$get(Construct, null, null, 'RegExpression'):
					js += $es4.$$get(expression, null, null, 'string');
					break;
				case $es4.$$get(Construct, null, null, 'PrefixExpression'):
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, '\'prefix\'', ($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++', construct);
					}
					else
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 25');
						}
						js += (($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++') + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
					}
					break;
				case $es4.$$get(Construct, null, null, 'PostfixExpression'):
					if (_dynamicPropertyAccess)
					{
						js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, '\'postfix\'', ($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++', construct);
					}
					else
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 26');
						}
						js += translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + (($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++');
					}
					break;
				case $es4.$$get(Construct, null, null, 'NewExpression'):
					if (_dynamicPropertyAccess)
					{
						if ($es4.$$get(expression, null, null, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
						{
							if (!$es4.$$get(expression, null, null, 'expression'))
							{
								trace('invalid 02');
							}
							js += '$es4.$$primitive(new ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + ')';
						}
						else
						{
							js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, null, null, construct, null, true);
						}
					}
					else
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 03');
						}
						js += '$es4.$$primitive(new ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + ')';
					}
					break;
				case $es4.$$get(Construct, null, null, 'BinaryExpression'):
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'IsTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 04');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 05');
						}
						js += '$es4.$$is(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'InstanceofTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 06');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 07');
						}
						js += '$es4.$$instanceof(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'AsTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 08');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 09');
						}
						js += '$es4.$$as(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					innerSwitch:					switch ($es4.$$get(expression, null, null, 'token', 'type'))
					{
						case $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'):
							var leftExpression = $es4.$$get(expression, null, null, 'leftExpression');
							while ($es4.$$get(leftExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
							{
								leftExpression = $es4.$$get(leftExpression, null, null, 'expression');
							}
							var innerOperator = $es4.$$get(expression, null, null, 'token', 'data');
							var innerExpressionString = '';
							while ($es4.$$get(leftExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'BinaryExpression'))
							{
								$es4.$$set(expression, null, null, 'leftExpression', $es4.$$get(leftExpression, null, null, 'rightExpression'), '=');
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
									if (!$es4.$$get(expression, null, null, 'leftExpression'))
									{
										trace('invalid 11');
									}
									if (_dynamicPropertyAccess)
									{
										innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'leftExpression'), _indent, toString, construct, innerOperator, innerExpressionString);
									}
									else
									{
										innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'leftExpression'), _indent, toString, construct) + ' ' + innerOperator + ' ' + innerExpressionString;
									}
								}
								expression = leftExpression;
								innerOperator = $es4.$$get(expression, null, null, 'token', 'data');
								leftExpression = $es4.$$get(expression, null, null, 'leftExpression');
							}
							var typeString;
							if (!$es4.$$get(leftExpression, null, null, 'nextPropertyExpression') && $es4.$$get(leftExpression, null, null, 'construct') && $es4.$$get(leftExpression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'IdentifierConstruct'))
							{
								var identifier = $es4.$$get(leftExpression, null, null, 'construct', 'identifier');
								typeString = ($es4.$$get(identifier, null, null, 'isVar') && $es4.$$get(identifier, null, null, 'type')) ? getTranslatedTypeName($es4.$$get(identifier, null, null, 'type')) : '';
							}
							if (_dynamicPropertyAccess)
							{
								if (!innerExpressionString)
								{
									if (!$es4.$$get(expression, null, null, 'rightExpression'))
									{
										trace('invalid 12');
									}
									innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
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
								if (!$es4.$$get(expression, null, null, 'leftExpression'))
								{
									trace('invalid 13');
								}
								js += translateExpression(leftExpression, 0, toString, construct);
								if (!innerExpressionString)
								{
									if (!$es4.$$get(expression, null, null, 'rightExpression'))
									{
										trace('invalid 14');
									}
									innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
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
					if (!$es4.$$get(expression, null, null, 'leftExpression'))
					{
						trace('invalid 15');
					}
					if (!$es4.$$get(expression, null, null, 'rightExpression'))
					{
						trace('invalid 16');
					}
					js += translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ' ' + $es4.$$get(expression, null, null, 'token', 'data') + ' ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
					break;
				case $es4.$$get(Construct, null, null, 'TernaryExpression'):
					if (!$es4.$$get(expression, null, null, 'trueExpression'))
					{
						trace('invalid 34');
					}
					if (!$es4.$$get(expression, null, null, 'conditionExpression'))
					{
						trace('invalid 35');
					}
					if (!$es4.$$get(expression, null, null, 'falseExpression'))
					{
						trace('invalid 36');
					}
					js += translateExpression($es4.$$get(expression, null, null, 'conditionExpression'), 0, toString, construct) + ' ? ' + translateExpression($es4.$$get(expression, null, null, 'trueExpression'), 0, toString, construct) + ' : ' + translateExpression($es4.$$get(expression, null, null, 'falseExpression'), 0, toString, construct);
					break;
				default:
					throw $es4.$$primitive(new (Error)('Unexpected expression found: ' + $es4.$$get(expression, null, null, 'constructor')));
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
			if (!$es4.$$get(expression, null, null, 'construct'))
			{
				throw $es4.$$primitive(new (Error)('invalid expression passed to translatePropertyExpression: ' + $es4.$$get(expression, null, null, 'constructor')));
			}
			var identifier;
			var namespaceIdentifier;
			switch ($es4.$$get(expression, null, null, 'construct', 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'SuperConstruct'):
				case $es4.$$get(Construct, null, null, 'ThisConstruct'):
				case $es4.$$get(Construct, null, null, 'IdentifierConstruct'):
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				case $es4.$$get(Construct, null, null, 'ParenConstruct'):
				case $es4.$$get(Construct, null, null, 'ArrayConstruct'):
				case $es4.$$get(Construct, null, null, 'ObjectConstruct'):
					break;
				case $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'):
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				default:
					throw $es4.$$primitive(new (Error)('unknown inner property expression: ' + $es4.$$get(expression, null, null, 'construct', 'constructor')));
			}
			var pname;
			var name;
			if (identifier && !namespaceIdentifier && ($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport') && $es4.$$get(identifier, null, null, 'namespaceObj', 'isCustom'))
			{
				namespaceIdentifier = $es4.$$get(identifier, null, null, 'namespaceObj', 'identifier');
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = ($es4.$$get(namespaceIdentifier, null, null, 'isStatic')) ? $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') : '$$this';
				var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
				var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
				if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
				{
					namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				else if (!namespaceString)
				{
					namespaceString = ($es4.$$get(namespaceIdentifier, null, null, 'namespaceObj') && $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj', 'isPrivate') ? '$$thisp.' : '$$this.') + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				pname += '.$$namespace(' + namespaceString + ')';
				name = $es4.$$get(identifier, null, null, 'name');
			}
			else if (identifier)
			{
				name = $es4.$$get(identifier, null, null, 'name');
				if ($es4.$$get(identifier, null, null, 'isStatic') && !$es4.$$get(identifier, null, null, 'isImport') && !$es4.$$get(identifier, null, null, 'isNative'))
				{
					pname = $es4.$$get(identifier, null, null, 'scope', 'name');
				}
				else if ($es4.$$get(identifier, null, null, 'isPrivate') && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$thisp';
				}
				else if (($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$this';
				}
				else if ($es4.$$get(identifier, null, null, 'isPackage'))
				{
					name = '$es4.$$[\'' + $es4.$$get(identifier, null, null, 'name');
					var packageName = $es4.$$get(identifier, null, null, 'name');
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = $es4.$$get(tempInnerExpression, null, null, 'nextPropertyExpression'))
					{
						if ($es4.$$get(_rootConstructs, null, null, packageName + '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data')))
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						name += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				if (name == 'super')
				{
					if (_inNamespacedFunction && $es4.$$get(expression, null, null, 'nextPropertyExpression'))
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = ($es4.$$get(expression, null, null, 'nextPropertyExpression')) ? '$es4.$$super($$thisp)' : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					name = '$$this';
				}
			}
			else
			{
				if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
				{
					trace('invalid 37');
				}
				name = translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct);
			}
			js += (!pname) ? name : (pname + '.' + name);
			while (expression = $es4.$$get(expression, null, null, 'nextPropertyExpression'))
			{
				if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'DotConstruct') || $es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'IdentifierConstruct'))
				{
					if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'DotConstruct'))
					{
						js += '.';
					}
					js += $es4.$$get(expression, null, null, 'construct', 'identifierToken', 'data');
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'ArrayAccessorConstruct'))
				{
					if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
					{
						trace('invalid 38');
					}
					js += '[' + translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct) + ']';
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'))
				{
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
					var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
					if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
					{
						namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					else if (!namespaceString)
					{
						namespaceString = ($es4.$$get(identifier, null, null, 'isPrivate')) ? '$$thisp.' + $es4.$$get(namespaceIdentifier, null, null, 'name') : '$$this.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					js += '.$$namespace(' + namespaceString + ').' + $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifierToken', 'data');
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'ParenConstruct'))
				{
					if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
					{
						trace('invalid 39');
					}
					js += '(' + translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct) + ')';
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'AtIdentifierConstruct'))
				{
					throw $es4.$$primitive(new (Error)('E4X is not supported'));
				}
				if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct') || ($es4.$$get(expression, null, null, 'nextPropertyExpression') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')))
				{
					var functionCallExpression = ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')) ? expression : $es4.$$get(expression, null, null, 'nextPropertyExpression');
					if (js == '$es4.$$super($$thisp)')
					{
						js += '.$$z';
					}
					js += '(';
					for (var i = 0; i < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'); i++)
					{
						if (!$es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', i))
						{
							trace('invalid 40');
						}
						js += translateExpression($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', i), 0, toString, construct);
						if ((i + 1) < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
						{
							js += ', ';
						}
					}
					js += ')';
					if ($es4.$$get(expression, null, null, 'nextPropertyExpression'))
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
			if ($es4.$$get(expression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'DeleteExpression'))
			{
				return translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, setString, operator, construct, true, doNew);
			}
			if ($es4.$$get(expression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'NewExpression'))
			{
				return translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, setString, operator, construct, doDelete, true);
			}
			if (!$es4.$$get(expression, null, null, 'construct'))
			{
				throw $es4.$$primitive(new (Error)('invalid expression passed to translatePropertyExpression: ' + $es4.$$get(expression, null, null, 'constructor')));
			}
			var identifier;
			var namespaceIdentifier;
			switch ($es4.$$get(expression, null, null, 'construct', 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'SuperConstruct'):
				case $es4.$$get(Construct, null, null, 'ThisConstruct'):
				case $es4.$$get(Construct, null, null, 'IdentifierConstruct'):
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				case $es4.$$get(Construct, null, null, 'ParenConstruct'):
				case $es4.$$get(Construct, null, null, 'ArrayConstruct'):
				case $es4.$$get(Construct, null, null, 'ObjectConstruct'):
					break;
				case $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'):
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				default:
					throw $es4.$$primitive(new (Error)('unknown inner property expression: ' + $es4.$$get(expression, null, null, 'construct', 'constructor')));
			}
			var pname;
			var name;
			var isUseNamespace = false;
			if (identifier && !namespaceIdentifier && ($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport') && $es4.$$get(identifier, null, null, 'namespaceObj', 'isCustom'))
			{
				isUseNamespace = namespaceIdentifier = $es4.$$get(identifier, null, null, 'namespaceObj', 'identifier');
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = ($es4.$$get(namespaceIdentifier, null, null, 'isStatic')) ? $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') : '$$this';
				var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
				var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
				if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
				{
					namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				else if (!namespaceString)
				{
					namespaceString = ($es4.$$get(namespaceIdentifier, null, null, 'namespaceObj') && $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj', 'isPrivate') ? '$$thisp.' : '$$this.') + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				if (isUseNamespace)
				{
					pname += '.$$namespace(' + namespaceString + ')';
				}
				name = $es4.$$get(identifier, null, null, 'name');
			}
			else if (identifier)
			{
				name = $es4.$$get(identifier, null, null, 'name');
				if ($es4.$$get(identifier, null, null, 'isStatic') && !$es4.$$get(identifier, null, null, 'isImport') && !$es4.$$get(identifier, null, null, 'isNative'))
				{
					pname = $es4.$$get(identifier, null, null, 'scope', 'name');
				}
				else if ($es4.$$get(identifier, null, null, 'isPrivate') && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$thisp';
				}
				else if (($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$this';
				}
				else if ($es4.$$get(identifier, null, null, 'isPackage'))
				{
					name = '$es4.$$[\'' + $es4.$$get(identifier, null, null, 'name');
					var packageName = $es4.$$get(identifier, null, null, 'name');
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = $es4.$$get(tempInnerExpression, null, null, 'nextPropertyExpression'))
					{
						if ($es4.$$get(_rootConstructs, null, null, packageName + '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data')))
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						name += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				if (name == 'super')
				{
					if (_inNamespacedFunction && $es4.$$get(expression, null, null, 'nextPropertyExpression'))
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = ($es4.$$get(expression, null, null, 'nextPropertyExpression')) ? '$es4.$$super($$thisp)' : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					name = '$$this';
				}
			}
			else
			{
				name = translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct);
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
				expression = $es4.$$get(expression, null, null, 'nextPropertyExpression');
				js += name;
			}
			var lastAccessTypeWasArrayAccessor = false;
			var closed = false;
			while (expression)
			{
				var expressionConstruct = $es4.$$get(expression, null, null, 'construct');
				var expressionConstructor = $es4.$$get(expressionConstruct, null, null, 'constructor');
				if (expressionConstructor == $es4.$$get(Construct, null, null, 'DotConstruct') || expressionConstructor == $es4.$$get(Construct, null, null, 'IdentifierConstruct') || expressionConstructor == $es4.$$get(Construct, null, null, 'ArrayAccessorConstruct') || expressionConstructor == $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct') || $es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'AtIdentifierConstruct'))
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
				if (expressionConstructor == $es4.$$get(Construct, null, null, 'DotConstruct') || expressionConstructor == $es4.$$get(Construct, null, null, 'IdentifierConstruct'))
				{
					js += ', \'' + $es4.$$get(expressionConstruct, null, null, 'identifierToken', 'data') + '\'';
					lastAccessTypeWasArrayAccessor = false;
				}
				else if (expressionConstructor == $es4.$$get(Construct, null, null, 'ArrayAccessorConstruct'))
				{
					js += ', ' + translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct);
					lastAccessTypeWasArrayAccessor = true;
				}
				else if (expressionConstructor == $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'))
				{
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
					var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
					if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
					{
						namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					else if (!namespaceString)
					{
						namespaceString = ($es4.$$get(identifier, null, null, 'isPrivate')) ? '$$thisp.' + $es4.$$get(namespaceIdentifier, null, null, 'name') : '$$this.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					if (_inStaticFunction)
					{
						js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), null, null, \'' + $es4.$$get(expressionConstruct, null, null, 'namespaceIdentifierToken', 'data') + '\'';
					}
					else
					{
						js = accessString + '(' + js + ').$$namespace(' + namespaceString + '), $$this, $$thisp, \'' + $es4.$$get(expressionConstruct, null, null, 'namespaceIdentifierToken', 'data') + '\'';
					}
					propListCount = 2;
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'ParenConstruct'))
				{
					throw $es4.$$primitive(new (Error)('check translator.js for this error.'));
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'AtIdentifierConstruct'))
				{
					js += ', \'$$attributes\'';
					lastAccessTypeWasArrayAccessor = false;
				}
				if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct') || ($es4.$$get(expression, null, null, 'nextPropertyExpression') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')))
				{
					var functionCallExpression = ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')) ? expression : $es4.$$get(expression, null, null, 'nextPropertyExpression');
					if (js == '$es4.$$super($$thisp)')
					{
						js += '.$$z';
					}
					var start = null;
					if (propListCount == 1)
					{
						if ($es4.$$get(state, null, null, 'doNew'))
						{
							if ($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
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
						if ($es4.$$get(state, null, null, 'doNew'))
						{
							js = '$es4.$$primitive(new (' + js + '))(';
						}
						else
						{
							if (!lastAccessTypeWasArrayAccessor)
							{
								start = $es4.$$call(js, null, null, 'substring', [10]);
								js = '$es4.$$call' + start;
								if ($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
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
					for (var i = 0; i < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'); i++)
					{
						js += translateExpression($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', i), 0, toString, construct);
						if ((i + 1) < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
						{
							js += ', ';
						}
					}
					if ($es4.$$get(state, null, null, 'doNew'))
					{
						js += ')';
					}
					$es4.$$set(state, null, null, 'doNew', false, '=');
					if (start && $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
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
					if ($es4.$$get(expression, null, null, 'nextPropertyExpression'))
					{
						expression = functionCallExpression;
					}
				}
				expression = $es4.$$get(expression, null, null, 'nextPropertyExpression');
			}
			if (!pname)
			{
				if (!$es4.$$get(state, null, null, 'doPostfix') && !$es4.$$get(state, null, null, 'doPrefix'))
				{
					if ($es4.$$get(state, null, null, 'doAssignment') && operator == '||=' || operator == '&&=')
					{
						js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
					}
					else if ($es4.$$get(state, null, null, 'doAssignment'))
					{
						js += ' ' + operator + ' ' + setString;
					}
				}
				else if ($es4.$$get(state, null, null, 'doPrefix'))
				{
					js = operator + js;
				}
				else if ($es4.$$get(state, null, null, 'doPostfix'))
				{
					js += operator;
				}
				if ($es4.$$get(state, null, null, 'doDelete'))
				{
					js = 'delete ' + js;
				}
				if ($es4.$$get(state, null, null, 'doNew'))
				{
					js = '$es4.$$primitive(new (' + js + '()))';
				}
			}
			else
			{
				if ($es4.$$get(state, null, null, 'doAssignment'))
				{
					js = '$es4.$$set' + $es4.$$call(js, null, null, 'slice', [10]);
					js += ', ' + setString + ', \'' + operator + '\'';
				}
				else if ($es4.$$get(state, null, null, 'doDelete'))
				{
					js = '$es4.$$delete' + $es4.$$call(js, null, null, 'slice', [10]);
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

			if (!$es4.$$get(statementOrExpression, null, null, 'coerce'))
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
	}));

	function TranslatorProto()
	{
		//initialize class if not initialized
		if (TranslatorProto.$$cinit !== undefined) TranslatorProto.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof TranslatorProto) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TranslatorProto) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(TranslatorProto, null, 'sweetrush.core::TranslatorProto');
})();
//sweetrush.core.TranslatorProto


//sweetrush.utils.Base64Util
$es4.$$package('sweetrush.utils').Base64Util = (function ()
{
	//imports
	var ByteArray;

	//class initializer
	Base64Util.$$cinit = (function ()
	{
		Base64Util.$$cinit = undefined;

		//initialize imports
		ByteArray = $es4.$$['flash.utils'].ByteArray;
	});

	//method
	$es4.$$public_function('encodeString', Base64Util, (function ($$$$value)
	{
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//set default parameter values
		var value = $es4.$$coerce($$$$value, String);

		if (false)
		{
		}
		if (true)
		{
			if ($es4.$$get(global, null, null, 'btoa') !== undefined)
			{
				return $es4.$$coerce($es4.$$call(global, null, null, 'btoa', [value]), String);
			}
			return $es4.$$coerce($es4.$$call($es4.$$call(global, null, null, 'Buffer', 'from', [value]), null, null, 'toString', ['base64']), String);
		}
	}));

	//method
	$es4.$$public_function('decodeString', Base64Util, (function ($$$$str)
	{
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//set default parameter values
		var str = $es4.$$coerce($$$$str, String);

		if (false)
		{
		}
		if (true)
		{
			if ($es4.$$get(global, null, null, 'atob') !== undefined)
			{
				return $es4.$$coerce($es4.$$call(global, null, null, 'atob', [str]), String);
			}
			return $es4.$$coerce($es4.$$call($es4.$$call(global, null, null, 'Buffer', 'from', [str, 'base64']), null, null, 'toString', $es4.$$EMPTY_ARRAY), String);
		}
	}));

	function Base64Util()
	{
		//initialize class if not initialized
		if (Base64Util.$$cinit !== undefined) Base64Util.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Base64Util) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Base64Util) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Base64Util, null, 'sweetrush.utils::Base64Util');
})();
//sweetrush.utils.Base64Util


//sweetrush.utils.SwcUtil
$es4.$$package('sweetrush.utils').SwcUtil = (function ()
{
	//imports
	var JsonUtil;

	//class initializer
	SwcUtil.$$cinit = (function ()
	{
		SwcUtil.$$cinit = undefined;

		//initialize imports
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
	});

	//method
	$es4.$$public_function('stringifySWC', SwcUtil, (function ($$$$obj)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var obj = $$$$obj;

		return '_SWC_' + ($es4.$$call($es4.$$primitive(new (JsonUtil)()), null, null, 'stringify', [obj]));
	}));

	//method
	$es4.$$public_function('parseSWCString', SwcUtil, (function ($$$$contents)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var contents = $$$$contents;

		return $es4.$$call($es4.$$primitive(new (JsonUtil)()), null, null, 'parse', [$es4.$$call(contents, null, null, 'substring', [5])]);
	}));

	//method
	$es4.$$public_function('isValidSWCString', SwcUtil, (function ($$$$contents)
	{
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//set default parameter values
		var contents = $$$$contents;

		return $es4.$$call(contents, null, null, 'indexOf', ['_SWC_']) == 0;
	}));

	function SwcUtil()
	{
		//initialize class if not initialized
		if (SwcUtil.$$cinit !== undefined) SwcUtil.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof SwcUtil) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], SwcUtil) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(SwcUtil, null, 'sweetrush.utils::SwcUtil');
})();
//sweetrush.utils.SwcUtil


//sweetrush.obj.Token
$es4.$$package('sweetrush.obj').Token = (function ()
{
	//imports
	var Lexer;

	//properties
	$es4.$$private_property('whitespaceCharacters', Token, Object);
	$es4.$$private_property('identifierStartCharacters', Token, Object);
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
	$es4.$$public_property('tokenFunctions', Token, Object);

	//class initializer
	Token.$$cinit = (function ()
	{
		Token.$$cinit = undefined;

		//initialize imports
		Lexer = $es4.$$['sweetrush.core'].Lexer;

		//initialize properties
		Token.whitespaceCharacters = {'\u0020':true, '\u0009':true, '\u000A':true, '\u000C':true, '\u000D':true};
		Token.identifierStartCharacters = {'_':true, '$':true, 'a':true, 'b':true, 'c':true, 'd':true, 'e':true, 'f':true, 'g':true, 'h':true, 'i':true, 'j':true, 'k':true, 'l':true, 'm':true, 'n':true, 'o':true, 'p':true, 'q':true, 'r':true, 's':true, 't':true, 'u':true, 'v':true, 'w':true, 'x':true, 'y':true, 'z':true, 'A':true, 'B':true, 'C':true, 'D':true, 'E':true, 'F':true, 'G':true, 'H':true, 'I':true, 'J':true, 'K':true, 'L':true, 'M':true, 'N':true, 'O':true, 'P':true, 'Q':true, 'R':true, 'S':true, 'T':true, 'U':true, 'V':true, 'W':true, 'X':true, 'Y':true, 'Z':true};
		Token.tokenFunctions = {};
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenParenTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedParenTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenBraceTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedBraceTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenBracketTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedBracketTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EOSTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'PackageTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImportTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClassTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InterfaceTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UseTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CaseTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FunctionTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'GetTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SetTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RestTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ExtendsTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImplementsTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CommentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CommentChunkTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MultiLineCommentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MultiLineCommentChunkTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MultiLineCommentEndTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OverrideTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StaticTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DynamicTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinalTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VarTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ConstTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IdentifierTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BooleanTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThisTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TypeofTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NullTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VoidTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UndefinedTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IsTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NaNTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InstanceofTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ReturnTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SwitchTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SuperTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThrowTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DotDotTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DotTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NotTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseNotTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ColonTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CommaTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TernaryTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IncrementTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DecrementTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BreakTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ContinueTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DefaultTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AsTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DeleteTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IfTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ElseTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EachTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ForTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WhileTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DoTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WithTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TryTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CatchTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RegExpTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SpecialUFOTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinallyTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AtTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EqualityTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RelationalTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseAndTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseXorTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseOrTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AndTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OrTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SubTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AddTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DivTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MulTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ModTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AssignmentTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLIdentifierTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLTextTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLCDATATokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLCDATAChunkTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLCDATAEndTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringChunkTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringMultiLineDelimiterTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringEndTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SpaceTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TabTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewLineTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UFOTokenType'), {}, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenParenTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '(') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'OpenParenTokenType'), '(']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedParenTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ')') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'ClosedParenTokenType'), ')']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenBraceTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '{') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'OpenBraceTokenType'), '{']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedBraceTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '}') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'ClosedBraceTokenType'), '}']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OpenBracketTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '[') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'OpenBracketTokenType'), '[']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClosedBracketTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ']') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'ClosedBracketTokenType'), ']']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EOSTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ';') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'EOSTokenType'), ';']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'PackageTokenType'), 'keyword', 'package', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'PackageTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'PackageTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'p' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'PackageTokenType'), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType'), $es4.$$get(Token, null, null, 'DotTokenType')]]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImportTokenType'), 'keyword', 'import', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImportTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'm') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'import', $es4.$$get(Token, null, null, 'ImportTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClassTokenType'), 'keyword', 'class', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ClassTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'c' || $es4.$$call(input, null, null, 'charAt', [1]) != 'l') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'class', $es4.$$get(Token, null, null, 'ClassTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InterfaceTokenType'), 'keyword', 'interface', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InterfaceTokenType'), 'terminator', /^[\s]/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InterfaceTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'n') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'interface', $es4.$$get(Token, null, null, 'InterfaceTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewTokenType'), 'keyword', 'new', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewTokenType'), 'terminator', /^[\s]/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'n' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'NewTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UseTokenType'), 'keyword', 'use', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UseTokenType'), 'terminator', /^[\s]/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UseTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'u' || $es4.$$call(input, null, null, 'charAt', [1]) != 's') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'UseTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CaseTokenType'), 'keyword', 'case', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CaseTokenType'), 'terminator', /^[\s]/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CaseTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'c' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'CaseTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FunctionTokenType'), 'keyword', 'function', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FunctionTokenType'), 'terminator', /^[\s]|\(/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FunctionTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != 'f')
	{
		return null;
	}
	var result = $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'FunctionTokenType'), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'GetTokenType'), $es4.$$get(Token, null, null, 'SetTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType')]]);
	if (!result)
	{
		return null;
	}
	var tokens = $es4.$$get(result, null, null, 'tokens');
	var index = $es4.$$get(result, null, null, 'index');
	result = $es4.$$call(Lexer, null, null, 'lex', [$es4.$$call(input, null, null, 'slice', [index + 1]), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'OpenParenTokenType'), $es4.$$get(Token, null, null, 'ClosedParenTokenType'), $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), $es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'), $es4.$$get(Token, null, null, 'VoidTokenType'), $es4.$$get(Token, null, null, 'StringTokenType'), $es4.$$get(Token, null, null, 'BooleanTokenType'), $es4.$$get(Token, null, null, 'SubTokenType'), $es4.$$get(Token, null, null, 'AddTokenType'), $es4.$$get(Token, null, null, 'RestTokenType'), $es4.$$get(Token, null, null, 'NumberTokenType'), $es4.$$get(Token, null, null, 'NullTokenType'), $es4.$$get(Token, null, null, 'UndefinedTokenType'), $es4.$$get(Token, null, null, 'NaNTokenType'), $es4.$$get(Token, null, null, 'ColonTokenType'), $es4.$$get(Token, null, null, 'MulTokenType'), $es4.$$get(Token, null, null, 'CommaTokenType'), $es4.$$get(Token, null, null, 'AssignmentTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType'), $es4.$$get(Token, null, null, 'DotTokenType')], true]);
	tokens = $es4.$$call(tokens, null, null, 'concat', [$es4.$$get(result, null, null, 'tokens')]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, $es4.$$get(result, null, null, 'index') + index]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'GetTokenType'), 'keyword', 'get', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'GetTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'g' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'get', $es4.$$get(Token, null, null, 'GetTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SetTokenType'), 'keyword', 'set', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SetTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 's' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'set', $es4.$$get(Token, null, null, 'SetTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RestTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '.' || $es4.$$call(input, null, null, 'charAt', [1]) != '.') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, '...', $es4.$$get(Token, null, null, 'RestTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), false]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ExtendsTokenType'), 'keyword', 'extends', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ExtendsTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'e' || $es4.$$call(input, null, null, 'charAt', [1]) != 'x') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'extends', $es4.$$get(Token, null, null, 'ExtendsTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImplementsTokenType'), 'keyword', 'implements', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ImplementsTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'm') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'implements', $es4.$$get(Token, null, null, 'ImplementsTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CommentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '/' || $es4.$$call(input, null, null, 'charAt', [1]) != '/')
	{
		return null;
	}
	var tokens = [];
	var i = 2;
	var commentChunk = '';
	var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'CommentTokenType'), $es4.$$call(input, null, null, 'charAt', [0]) + $es4.$$call(input, null, null, 'charAt', [1])]);
	$es4.$$call(tokens, null, null, 'push', [token]);
	while (i < $es4.$$get(input, null, null, 'length'))
	{
		if ($es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [/[\r\n]/]))
		{
			break;
		}
		commentChunk += $es4.$$call(input, null, null, 'charAt', [i]);
		i++;
	}
	if (i > 2)
	{
		token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'CommentChunkTokenType'), commentChunk]);
		$es4.$$call(tokens, null, null, 'push', [token]);
	}
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i - 1]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MultiLineCommentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '/' || $es4.$$call(input, null, null, 'charAt', [1]) != '*')
	{
		return null;
	}
	var tokens = [];
	var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MultiLineCommentTokenType'), $es4.$$call(input, null, null, 'charAt', [0]) + $es4.$$call(input, null, null, 'charAt', [1])]);
	$es4.$$call(tokens, null, null, 'push', [token]);
	var i = 2;
	var lastChar;
	var commentChunk = '';
	while (i < $es4.$$get(input, null, null, 'length'))
	{
		if ($es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [/[\r\n]/]))
		{
			if ($es4.$$get(commentChunk, null, null, 'length') > 0)
			{
				token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MultiLineCommentChunkTokenType'), commentChunk]);
				$es4.$$call(tokens, null, null, 'push', [token]);
			}
			token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$call(input, null, null, 'charAt', [i])]);
			$es4.$$call(tokens, null, null, 'push', [token]);
			commentChunk = '';
		}
		else if (lastChar == '*' && $es4.$$call(input, null, null, 'charAt', [i]) == '/')
		{
			commentChunk = $es4.$$call(commentChunk, null, null, 'slice', [0, $es4.$$get(commentChunk, null, null, 'length') - 1]);
			i--;
			break;
		}
		else
		{
			commentChunk += $es4.$$call(input, null, null, 'charAt', [i]);
		}
		lastChar = $es4.$$call(input, null, null, 'charAt', [i]);
		i++;
	}
	if ($es4.$$get(commentChunk, null, null, 'length') > 0)
	{
		token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MultiLineCommentChunkTokenType'), commentChunk]);
		$es4.$$call(tokens, null, null, 'push', [token]);
	}
	token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MultiLineCommentEndTokenType'), $es4.$$call(input, null, null, 'charAt', [i]) + $es4.$$call(input, null, null, 'charAt', [i + 1])]);
	$es4.$$call(tokens, null, null, 'push', [token]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i + 1]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OverrideTokenType'), 'keyword', 'override', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OverrideTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'o' || $es4.$$call(input, null, null, 'charAt', [1]) != 'v') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'override', $es4.$$get(Token, null, null, 'OverrideTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StaticTokenType'), 'keyword', 'static', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StaticTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 's' || $es4.$$call(input, null, null, 'charAt', [1]) != 't') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'static', $es4.$$get(Token, null, null, 'StaticTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DynamicTokenType'), 'keyword', 'dynamic', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DynamicTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'd' || $es4.$$call(input, null, null, 'charAt', [1]) != 'y') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'dynamic', $es4.$$get(Token, null, null, 'DynamicTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinalTokenType'), 'keyword', 'final', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinalTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'f' || $es4.$$call(input, null, null, 'charAt', [1]) != 'i') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'final', $es4.$$get(Token, null, null, 'FinalTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VarTokenType'), 'keyword', 'var', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VarTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'v' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'var', $es4.$$get(Token, null, null, 'VarTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ConstTokenType'), 'keyword', 'const', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ConstTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'c' || $es4.$$call(input, null, null, 'charAt', [1]) != 'o') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'const', $es4.$$get(Token, null, null, 'ConstTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IdentifierTokenType'), 'regex', /^[a-zA-Z_$][a-zA-Z_0-9$]*/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IdentifierTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'IdentifierTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BooleanTokenType'), 'regex', /^(true|false)(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BooleanTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 't' && $es4.$$call(input, null, null, 'charAt', [0]) != 'f') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BooleanTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThisTokenType'), 'regex', /^this(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThisTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 't' || $es4.$$call(input, null, null, 'charAt', [1]) != 'h') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'ThisTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TypeofTokenType'), 'regex', /^typeof(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TypeofTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 't' || $es4.$$call(input, null, null, 'charAt', [1]) != 'y') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'TypeofTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NullTokenType'), 'regex', /^null(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NullTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'n' || $es4.$$call(input, null, null, 'charAt', [1]) != 'u') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'NullTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VoidTokenType'), 'regex', /^void(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VoidTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'v' || $es4.$$call(input, null, null, 'charAt', [1]) != 'o') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'VoidTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UndefinedTokenType'), 'regex', /^undefined(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UndefinedTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'u' || $es4.$$call(input, null, null, 'charAt', [1]) != 'n') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'UndefinedTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IsTokenType'), 'regex', /^is(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IsTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 's') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'IsTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NaNTokenType'), 'regex', /^NaN(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NaNTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'N' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'NaNTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InstanceofTokenType'), 'regex', /^instanceof(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InstanceofTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'n') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'InstanceofTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ReturnTokenType'), 'regex', /^return(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ReturnTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'r' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'ReturnTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SwitchTokenType'), 'regex', /^switch(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SwitchTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 's' || $es4.$$call(input, null, null, 'charAt', [1]) != 'w') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'SwitchTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SuperTokenType'), 'regex', /^super(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SuperTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 's' || $es4.$$call(input, null, null, 'charAt', [1]) != 'u') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'SuperTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThrowTokenType'), 'regex', /^throw(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ThrowTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 't' || $es4.$$call(input, null, null, 'charAt', [1]) != 'h') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'ThrowTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DotDotTokenType'), 'regex', /^\.\./, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DotDotTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '.' || $es4.$$call(input, null, null, 'charAt', [1]) != '.') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'DotDotTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DotTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '.') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'DotTokenType'), '.']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NotTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '!') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NotTokenType'), '!']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseNotTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '~') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseNotTokenType'), '~']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ColonTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ':') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'ColonTokenType'), ':']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CommaTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ',') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'CommaTokenType'), ',']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TernaryTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '?') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'TernaryTokenType'), '?']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IncrementTokenType'), 'regex', /^\+\+/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IncrementTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '+' || $es4.$$call(input, null, null, 'charAt', [1]) != '+') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'IncrementTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DecrementTokenType'), 'regex', /^\-\-/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DecrementTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '-' || $es4.$$call(input, null, null, 'charAt', [1]) != '-') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'DecrementTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BreakTokenType'), 'regex', /^break(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BreakTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'b' || $es4.$$call(input, null, null, 'charAt', [1]) != 'r') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BreakTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ContinueTokenType'), 'regex', /^continue(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ContinueTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'c' || $es4.$$call(input, null, null, 'charAt', [1]) != 'o') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'ContinueTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DefaultTokenType'), 'regex', /^default(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DefaultTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'd' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'DefaultTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InTokenType'), 'regex', /^in(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'InTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'n') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'InTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AsTokenType'), 'regex', /^as(?![a-zA-Z0-9_])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AsTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'a' || $es4.$$call(input, null, null, 'charAt', [1]) != 's') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'AsTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DeleteTokenType'), 'regex', /^delete(?![a-zA-Z0-9_.(])/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DeleteTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'd' || $es4.$$call(input, null, null, 'charAt', [1]) != 'e') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'DeleteTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IfTokenType'), 'keyword', 'if', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'IfTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'i' || $es4.$$call(input, null, null, 'charAt', [1]) != 'f') ? null : $es4.$$call(Token, null, null, 'keywordFind2', [input, 'if', $es4.$$get(Token, null, null, 'IfTokenType'), '(', false]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ElseTokenType'), 'keyword', 'else', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ElseTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ElseTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'e' || $es4.$$call(input, null, null, 'charAt', [1]) != 'l') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'ElseTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EachTokenType'), 'keyword', 'each', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EachTokenType'), 'terminator', /^([\s]|\()/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EachTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'e' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'EachTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ForTokenType'), 'keyword', 'for', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ForTokenType'), 'terminator', /^([\s]|\()/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ForTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'f' || $es4.$$call(input, null, null, 'charAt', [1]) != 'o') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'ForTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WhileTokenType'), 'keyword', 'while', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WhileTokenType'), 'terminator', /^([\s]|\()/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WhileTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'w' || $es4.$$call(input, null, null, 'charAt', [1]) != 'h') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'WhileTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DoTokenType'), 'keyword', 'do', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DoTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DoTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'd' || $es4.$$call(input, null, null, 'charAt', [1]) != 'o') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'DoTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WithTokenType'), 'keyword', 'with', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WithTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'WithTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'w' || $es4.$$call(input, null, null, 'charAt', [1]) != 'i') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'WithTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TryTokenType'), 'keyword', 'try', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TryTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TryTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 't' || $es4.$$call(input, null, null, 'charAt', [1]) != 'r') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'TryTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CatchTokenType'), 'keyword', 'catch', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CatchTokenType'), 'terminator', /^([\s]|\()/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'CatchTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != 'c' || $es4.$$call(input, null, null, 'charAt', [1]) != 'a')
	{
		return null;
	}
	var result = $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'CatchTokenType'), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType')]]);
	if (!result)
	{
		return null;
	}
	var tokens = $es4.$$get(result, null, null, 'tokens');
	var index = $es4.$$get(result, null, null, 'index');
	result = $es4.$$call(Lexer, null, null, 'lex', [$es4.$$call(input, null, null, 'slice', [index + 1]), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'OpenParenTokenType'), $es4.$$get(Token, null, null, 'ClosedParenTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType'), $es4.$$get(Token, null, null, 'DotTokenType'), $es4.$$get(Token, null, null, 'ColonTokenType')], true]);
	tokens = $es4.$$call(tokens, null, null, 'concat', [$es4.$$get(result, null, null, 'tokens')]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, $es4.$$get(result, null, null, 'index') + index]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RegExpTokenType'), 'find', function ($$$$input, $$$$foundTokens) 
{
		//set default parameter values
		var input = $$$$input;
		var foundTokens = $$$$foundTokens;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '/')
	{
		return null;
	}
	outer:	for (var j = $es4.$$get(foundTokens, null, null, 'length') - 1; j >= 0; j--)
	{
		var tokens = $es4.$$get(foundTokens, null, null, j);
		var token;
		var i;
		for (i = $es4.$$get(tokens, null, null, 'length') - 1; i >= 0; i--)
		{
			token = $es4.$$get(tokens, null, null, i);
			switch ($es4.$$get(token, null, null, 'type'))
			{
				case $es4.$$get(Token, null, null, 'SpaceTokenType'):
				case $es4.$$get(Token, null, null, 'TabTokenType'):
				case $es4.$$get(Token, null, null, 'NewLineTokenType'):
					break;
				case $es4.$$get(Token, null, null, 'EOSTokenType'):
				case $es4.$$get(Token, null, null, 'OpenBracketTokenType'):
				case $es4.$$get(Token, null, null, 'OpenParenTokenType'):
				case $es4.$$get(Token, null, null, 'EqualityTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'):
				case $es4.$$get(Token, null, null, 'RelationalTokenType'):
				case $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'AssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'CommaTokenType'):
				case $es4.$$get(Token, null, null, 'DeleteTokenType'):
				case $es4.$$get(Token, null, null, 'InTokenType'):
				case $es4.$$get(Token, null, null, 'WithTokenType'):
				case $es4.$$get(Token, null, null, 'TypeofTokenType'):
				case $es4.$$get(Token, null, null, 'VoidTokenType'):
				case $es4.$$get(Token, null, null, 'ReturnTokenType'):
				case $es4.$$get(Token, null, null, 'ThrowTokenType'):
				case $es4.$$get(Token, null, null, 'NewTokenType'):
				case $es4.$$get(Token, null, null, 'CaseTokenType'):
				case $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'AndTokenType'):
				case $es4.$$get(Token, null, null, 'OrTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseAndTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseNotTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseOrTokenType'):
				case $es4.$$get(Token, null, null, 'BitwiseXorTokenType'):
				case $es4.$$get(Token, null, null, 'NotTokenType'):
				case $es4.$$get(Token, null, null, 'IncrementTokenType'):
				case $es4.$$get(Token, null, null, 'DecrementTokenType'):
				case $es4.$$get(Token, null, null, 'OpenBraceTokenType'):
				case $es4.$$get(Token, null, null, 'IsTokenType'):
				case $es4.$$get(Token, null, null, 'InstanceofTokenType'):
				case $es4.$$get(Token, null, null, 'AddTokenType'):
				case $es4.$$get(Token, null, null, 'RegExpTokenType'):
				case $es4.$$get(Token, null, null, 'SubTokenType'):
				case $es4.$$get(Token, null, null, 'DivTokenType'):
				case $es4.$$get(Token, null, null, 'MulTokenType'):
				case $es4.$$get(Token, null, null, 'ModTokenType'):
					break outer;
				default:
					return null;
			}
		}
	}
	var result = $es4.$$call(Lexer, null, null, 'lex', [$es4.$$call(input, null, null, 'slice', [1]), [$es4.$$get(Token, null, null, 'SpecialUFOTokenType')], true]);
	var previousToken;
	var tokens = $es4.$$get(result, null, null, 'tokens');
	var foundEnd = false;
	for (i = 0; i < $es4.$$get(tokens, null, null, 'length'); i++)
	{
		token = $es4.$$get(tokens, null, null, i);
		if (foundEnd)
		{
			if ($es4.$$get(token, null, null, 'data') == ',' || $es4.$$get(token, null, null, 'data') == ';' || $es4.$$get(token, null, null, 'data') == ']' || $es4.$$get(token, null, null, 'data') == ')' || $es4.$$get(token, null, null, 'data') == ']' || $es4.$$get(token, null, null, 'data') == '.' || $es4.$$get(token, null, null, 'data') == ' ' || $es4.$$get(token, null, null, 'data') == '	' || $es4.$$call(token, null, null, 'data', 'match', [/[\r\n]/]))
			{
				i++;
				break;
			}
		}
		else if ($es4.$$get(token, null, null, 'data') == '/' && previousToken && $es4.$$get(previousToken, null, null, 'data') != '\\')
		{
			foundEnd = true;
		}
		previousToken = token;
	}
	if (!foundEnd)
	{
		return null;
	}
	tokens = $es4.$$call(tokens, null, null, 'splice', [0, i - 1]);
	$es4.$$call(tokens, null, null, 'unshift', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'RegExpTokenType'), '/'])]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i - 1]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SpecialUFOTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewLineTokenType'), 'find', [input]) != null)
	{
		return null;
	}
	return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'SpecialUFOTokenType'), $es4.$$call(input, null, null, 'charAt', [0])]), 0]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinallyTokenType'), 'keyword', 'finally', '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinallyTokenType'), 'terminator', /^([\s]|\{)/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'FinallyTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != 'f' || $es4.$$call(input, null, null, 'charAt', [1]) != 'i') ? null : $es4.$$call(Token, null, null, 'keywordFind', [input, $es4.$$get(Token, null, null, 'FinallyTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AtTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '@') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'AtTokenType'), '@']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'), 'regex', /^<<=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '<' || $es4.$$call(input, null, null, 'charAt', [1]) != '<') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'), 'regex', /^>>=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '>' || $es4.$$call(input, null, null, 'charAt', [1]) != '>') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'), 'regex', /^>>>=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '>' || $es4.$$call(input, null, null, 'charAt', [1]) != '>') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'), 'regex', /^&=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '&' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'), 'regex', /^\|=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '|' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'), 'regex', /^\^=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '^' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'), 'regex', /^\+\=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '+' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'), 'regex', /^\/\=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '/' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'), 'regex', /^\%\=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '%' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'), 'regex', /^\*\=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '*' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'), 'regex', /^\-\=/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '-' || $es4.$$call(input, null, null, 'charAt', [1]) != '=') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EqualityTokenType'), 'operators', ['===', '!==', '==', '!='], '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EqualityTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '=' && $es4.$$call(input, null, null, 'charAt', [0]) != '!')
	{
		return null;
	}
	for (var i = 0; i < $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EqualityTokenType'), 'operators', 'length'); i++)
	{
		var operator = $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'EqualityTokenType'), 'operators', i);
		var match = $es4.$$call(input, null, null, 'match', [$es4.$$primitive(new (RegExp)("^" + operator))]);
		if (!match)
		{
			continue;
		}
		var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'EqualityTokenType'), operator]);
		return $es4.$$call(Token, null, null, 'getNewResult', [token, $es4.$$get(operator, null, null, 'length') - 1]);
	}
	return null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RelationalTokenType'), 'operators', ['>=', '>', '<=', '<'], '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RelationalTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '>' && $es4.$$call(input, null, null, 'charAt', [0]) != '<')
	{
		return null;
	}
	for (var i = 0; i < $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RelationalTokenType'), 'operators', 'length'); i++)
	{
		var operator = $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'RelationalTokenType'), 'operators', i);
		var match = $es4.$$call(input, null, null, 'match', [$es4.$$primitive(new (RegExp)("^" + operator))]);
		if (!match)
		{
			continue;
		}
		var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'RelationalTokenType'), operator]);
		return $es4.$$call(Token, null, null, 'getNewResult', [token, $es4.$$get(operator, null, null, 'length') - 1]);
	}
	return null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseAndTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '&') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseAndTokenType'), '&']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseXorTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '^') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseXorTokenType'), '^']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseOrTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '|') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseOrTokenType'), '|']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AndTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '&' && $es4.$$call(input, null, null, 'charAt', [1]) == '&') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'AndTokenType'), '&&']), 1]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '&' && $es4.$$call(input, null, null, 'charAt', [1]) == '&' && $es4.$$call(input, null, null, 'charAt', [2]) == '=') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'), '&&=']), 2]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OrTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '|' && $es4.$$call(input, null, null, 'charAt', [1]) == '|') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'OrTokenType'), '||']), 1]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '|' && $es4.$$call(input, null, null, 'charAt', [1]) == '|' && $es4.$$call(input, null, null, 'charAt', [2]) == '=') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'), '||=']), 2]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '<' && $es4.$$call(input, null, null, 'charAt', [1]) == '<') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'), '<<']), 1]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '>' && $es4.$$call(input, null, null, 'charAt', [1]) == '>') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'), '>>']), 1]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '>' && $es4.$$call(input, null, null, 'charAt', [1]) == '>' && $es4.$$call(input, null, null, 'charAt', [2]) == '>') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'), '>>>']), 2]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SubTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '-') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'SubTokenType'), '-']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AddTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '+') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'AddTokenType'), '+']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'DivTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '/') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'DivTokenType'), '/']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'MulTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '*') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'ModTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '%') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'ModTokenType'), '%']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'AssignmentTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '=') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'AssignmentTokenType'), '=']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == 'n') ? $es4.$$call(Token, null, null, 'keywordFind2', [input, 'namespace', $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'), $es4.$$get(Token, null, null, 'identifierStartCharacters'), true]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '<')
	{
		return null;
	}
	var isXMLList = $es4.$$call(input, null, null, 'charAt', [1]) == '>';
	var resultTokens = [];
	var index = -1;
	var openNodes = 0;
	while (true)
	{
		var result = $es4.$$call(Lexer, null, null, 'lex', [input, [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'StringTokenType'), $es4.$$get(Token, null, null, 'AssignmentTokenType'), $es4.$$get(Token, null, null, 'ColonTokenType'), $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'), $es4.$$get(Token, null, null, 'XMLIdentifierTokenType'), $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType')], true]);
		if (!$es4.$$get(result, null, null, 'tokens', 'length'))
		{
			break;
		}
		if ($es4.$$call(input, null, null, 'charAt', [$es4.$$get(result, null, null, 'index')]) != '>')
		{
			break;
		}
		var tokens = $es4.$$call(result, null, null, 'tokens', 'concat', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'), '>'])]);
		input = $es4.$$call(input, null, null, 'slice', [$es4.$$get(result, null, null, 'index') + 1]);
		index += $es4.$$get(result, null, null, 'index') + 1;
		resultTokens = $es4.$$call(resultTokens, null, null, 'concat', [tokens]);
		if ($es4.$$get(tokens, null, null, 1, 'type') != $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'))
		{
			openNodes++;
		}
		if ($es4.$$get(tokens, null, null, 1, 'type') == $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'))
		{
			openNodes--;
		}
		else if ($es4.$$get(tokens, null, null, $es4.$$get(tokens, null, null, 'length') - 2, 'type') == $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'))
		{
			openNodes--;
		}
		if (!openNodes)
		{
			break;
		}
		if (isXMLList && openNodes == 1)
		{
			result = $es4.$$call(Lexer, null, null, 'lex', [input, [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType')], true]);
			if (!$es4.$$get(result, null, null, 'tokens', 'length'))
			{
				continue;
			}
			input = $es4.$$call(input, null, null, 'slice', [$es4.$$get(result, null, null, 'index')]);
			index += $es4.$$get(result, null, null, 'index');
			resultTokens = $es4.$$call(resultTokens, null, null, 'concat', [$es4.$$get(result, null, null, 'tokens')]);
		}
		else
		{
			result = $es4.$$call(Lexer, null, null, 'lex', [input, [$es4.$$get(Token, null, null, 'XMLTextTokenType'), $es4.$$get(Token, null, null, 'XMLCDATATokenType')], true]);
			if (!$es4.$$get(result, null, null, 'tokens', 'length'))
			{
				continue;
			}
			input = $es4.$$call(input, null, null, 'slice', [$es4.$$get(result, null, null, 'index')]);
			index += $es4.$$get(result, null, null, 'index');
			resultTokens = $es4.$$call(resultTokens, null, null, 'concat', [$es4.$$get(result, null, null, 'tokens')]);
		}
	}
	if (openNodes || !$es4.$$get(resultTokens, null, null, 'length'))
	{
		return null;
	}
	return $es4.$$call(Token, null, null, 'getNewResult', [resultTokens, index]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLIdentifierTokenType'), 'regex', /^[a-zA-Z_][a-zA-Z_0-9]*/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLIdentifierTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'XMLIdentifierTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLTextTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) == '<')
	{
		return null;
	}
	var token;
	var tokens = [];
	var i = 0;
	var chunk = '';
	while (i < $es4.$$get(input, null, null, 'length'))
	{
		if ($es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [/[\r\n]/]))
		{
			if ($es4.$$get(chunk, null, null, 'length') > 0)
			{
				token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLTextTokenType'), chunk]);
				$es4.$$call(tokens, null, null, 'push', [token]);
			}
			token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$call(input, null, null, 'charAt', [i])]);
			$es4.$$call(tokens, null, null, 'push', [token]);
			chunk = '';
		}
		else if ($es4.$$call(input, null, null, 'charAt', [i]) == '<')
		{
			i--;
			break;
		}
		else
		{
			chunk += $es4.$$call(input, null, null, 'charAt', [i]);
		}
		i++;
	}
	if ($es4.$$get(chunk, null, null, 'length') > 0)
	{
		token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLTextTokenType'), chunk]);
		$es4.$$call(tokens, null, null, 'push', [token]);
	}
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLCDATATokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '<' || $es4.$$call(input, null, null, 'charAt', [1]) != '!' || $es4.$$call(input, null, null, 'charAt', [2]) != '[' || $es4.$$call(input, null, null, 'indexOf', ['<![CDATA[']) != 0)
	{
		return null;
	}
	var tokens = [];
	var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLCDATATokenType'), '<![CDATA[']);
	$es4.$$call(tokens, null, null, 'push', [token]);
	var i = 9;
	var chunk = '';
	while (i < $es4.$$get(input, null, null, 'length'))
	{
		if ($es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [/[\r\n]/]))
		{
			if ($es4.$$get(chunk, null, null, 'length') > 0)
			{
				token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLCDATAChunkTokenType'), chunk]);
				$es4.$$call(tokens, null, null, 'push', [token]);
			}
			token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$call(input, null, null, 'charAt', [i])]);
			$es4.$$call(tokens, null, null, 'push', [token]);
			chunk = '';
		}
		else if ($es4.$$call(input, null, null, 'charAt', [i - 2]) == ']' && $es4.$$call(input, null, null, 'charAt', [i - 1]) == ']' && $es4.$$call(input, null, null, 'charAt', [i]) == '>')
		{
			chunk = $es4.$$call(chunk, null, null, 'slice', [0, $es4.$$get(chunk, null, null, 'length') - 2]);
			break;
		}
		else
		{
			chunk += $es4.$$call(input, null, null, 'charAt', [i]);
		}
		i++;
	}
	if ($es4.$$get(chunk, null, null, 'length') > 0)
	{
		token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLCDATAChunkTokenType'), chunk]);
		$es4.$$call(tokens, null, null, 'push', [token]);
	}
	token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLCDATAEndTokenType'), ']]>']);
	$es4.$$call(tokens, null, null, 'push', [token]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '<') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'), '<']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '>') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'), '>']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'), 'regex', /^\//, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != '/') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType'), 'regex', /^::/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) != ':' || $es4.$$call(input, null, null, 'charAt', [1]) != ':') ? null : $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), 'regex', /^\.\</, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != '.')
	{
		return null;
	}
	var result = $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType')]);
	if (!result)
	{
		return null;
	}
	var tokens = $es4.$$get(result, null, null, 'tokens');
	var index = $es4.$$get(result, null, null, 'index');
	result = $es4.$$call(Lexer, null, null, 'lex', [$es4.$$call(input, null, null, 'slice', [index + 1]), [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType'), $es4.$$get(Token, null, null, 'DotTokenType'), $es4.$$get(Token, null, null, 'VectorClosedArrowTokenType')], true]);
	tokens = $es4.$$call(tokens, null, null, 'concat', [$es4.$$get(result, null, null, 'tokens')]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, $es4.$$get(result, null, null, 'index') + index]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '>') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'), '>']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringTokenType'), 'prefixAllowed', ["'", '"'], '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'StringTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) != "'" && $es4.$$call(input, null, null, 'charAt', [0]) != '"')
	{
		return null;
	}
	var tokens = [];
	var token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'StringTokenType'), $es4.$$call(input, null, null, 'charAt', [0])]);
	$es4.$$call(tokens, null, null, 'push', [token]);
	var i = 1;
	var ignore = false;
	var lastChar;
	var stringChunk = '';
	while (i < $es4.$$get(input, null, null, 'length') && ($es4.$$call(input, null, null, 'charAt', [0]) != $es4.$$call(input, null, null, 'charAt', [i]) || ignore))
	{
		if (lastChar == '\\' && $es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [/[\r\n]/]) && !ignore)
		{
			if ($es4.$$get(stringChunk, null, null, 'length') - 1 > 0)
			{
				token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'StringChunkTokenType'), $es4.$$call(stringChunk, null, null, 'slice', [0, $es4.$$get(stringChunk, null, null, 'length') - 1])]);
				$es4.$$call(tokens, null, null, 'push', [token]);
			}
			token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'StringMultiLineDelimiterTokenType'), lastChar]);
			$es4.$$call(tokens, null, null, 'push', [token]);
			token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$call(input, null, null, 'charAt', [i])]);
			$es4.$$call(tokens, null, null, 'push', [token]);
			stringChunk = '';
		}
		else
		{
			stringChunk += $es4.$$call(input, null, null, 'charAt', [i]);
		}
		lastChar = $es4.$$call(input, null, null, 'charAt', [i]);
		ignore = lastChar == '\\' && !ignore;
		i++;
	}
	if ($es4.$$get(stringChunk, null, null, 'length') > 0)
	{
		token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'StringChunkTokenType'), stringChunk]);
		$es4.$$call(tokens, null, null, 'push', [token]);
	}
	token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'StringEndTokenType'), $es4.$$call(input, null, null, 'charAt', [i])]);
	$es4.$$call(tokens, null, null, 'push', [token]);
	return $es4.$$call(Token, null, null, 'getNewResult', [tokens, i]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), 'regex1', /^([0-9]|[\.][0-9\.]+)[0-9\.]*(e[+-][0-9]+)*/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), 'regex2', /^0x[a-fA-F0-9]+/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	if ($es4.$$call(input, null, null, 'charAt', [0]) == '0' && $es4.$$call(input, null, null, 'charAt', [1]) == 'x')
	{
		return $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'NumberTokenType'), $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), 'regex2')]);
	}
	if ($es4.$$call(input, null, null, 'charAt', [0]) != '0' && $es4.$$call(input, null, null, 'charAt', [0]) != '1' && $es4.$$call(input, null, null, 'charAt', [0]) != '2' && $es4.$$call(input, null, null, 'charAt', [0]) != '3' && $es4.$$call(input, null, null, 'charAt', [0]) != '4' && $es4.$$call(input, null, null, 'charAt', [0]) != '5' && $es4.$$call(input, null, null, 'charAt', [0]) != '6' && $es4.$$call(input, null, null, 'charAt', [0]) != '7' && $es4.$$call(input, null, null, 'charAt', [0]) != '8' && $es4.$$call(input, null, null, 'charAt', [0]) != '9' && $es4.$$call(input, null, null, 'charAt', [0]) != '.')
	{
		return;
	}
	return $es4.$$call(Token, null, null, 'regexFind', [input, $es4.$$get(Token, null, null, 'NumberTokenType'), $es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NumberTokenType'), 'regex1')]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'SpaceTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == ' ') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'SpaceTokenType'), ' ']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'TabTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return ($es4.$$call(input, null, null, 'charAt', [0]) == '	') ? $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'TabTokenType'), '	']), 0]) : null;
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewLineTokenType'), 'regex', /[\r\n]/, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewLineTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	var tokens;
	var index = -1;
	while ($es4.$$call($es4.$$call(input, null, null, 'charAt', [index + 1]), null, null, 'match', [$es4.$$get(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'NewLineTokenType'), 'regex')]))
	{
		if (!tokens)
		{
			tokens = [];
		}
		$es4.$$call(tokens, null, null, 'push', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$call(input, null, null, 'charAt', [index + 1])])]);
		index++;
	}
	return (index == -1) ? null : $es4.$$call(Token, null, null, 'getNewResult', [tokens, index]);
}
, '=');
		$es4.$$set(Token, null, null, 'tokenFunctions', $es4.$$get(Token, null, null, 'UFOTokenType'), 'find', function ($$$$input) 
{
		//set default parameter values
		var input = $$$$input;

	return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'UFOTokenType'), $es4.$$call(input, null, null, 'charAt', [0])]), 0]);
}
, '=');
	});

	//method
	$es4.$$public_function('getNewToken', Token, (function ($$$$type, $$$$data)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var type = $es4.$$coerce($$$$type, String);
		var data = $$$$data;

		return {constructor:"token", type:type, data:data, line:NaN, position:NaN};
	}));

	//method
	$es4.$$public_function('getNewResult', Token, (function ($$$$tokens, $$$$index)
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
	}));

	//method
	$es4.$$public_function('keywordFind2', Token, (function ($$$$input, $$$$keyword, $$$$TokenType, $$$$matchNext, $$$$requireWhitespace)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var keyword = $$$$keyword;
		var TokenType = $$$$TokenType;
		var matchNext = $$$$matchNext;
		var requireWhitespace = $es4.$$coerce($$$$requireWhitespace, Boolean);

		if ($es4.$$call(input, null, null, 'substring', [0, $es4.$$get(keyword, null, null, 'length')]) != keyword)
		{
			return null;
		}
		var cur = null;
		var whitespace = 0;
		var inputLength = $es4.$$get(input, null, null, 'length');
		for (var i = $es4.$$get(keyword, null, null, 'length'); i < inputLength; i++)
		{
			cur = $es4.$$call(input, null, null, 'charAt', [i]);
			if ($es4.$$get(Token, null, null, 'whitespaceCharacters', cur) === undefined)
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
			if ($es4.$$get(matchNext, null, null, cur) === undefined)
			{
				return null;
			}
		}
		return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [TokenType, keyword]), $es4.$$get(keyword, null, null, 'length') - 1]);
	}));

	//method
	$es4.$$public_function('keywordFind', Token, (function ($$$$input, $$$$TokenType, $$$$grammer)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var TokenType = $$$$TokenType;
		var grammer = (2 > arguments.length - 1) ? null : $$$$grammer;

		for (var i = 0; i < $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword', 'length'); i++)
		{
			if ($es4.$$call(Token, null, null, 'tokenFunctions', TokenType, 'keyword', 'charAt', [i]) !== $es4.$$call(input, null, null, 'charAt', [i]))
			{
				return null;
			}
		}
		if (!$es4.$$call($es4.$$call(input, null, null, 'charAt', [i]), null, null, 'match', [$es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'terminator')]))
		{
			return null;
		}
		if (!grammer)
		{
			return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [TokenType, $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword')]), $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword', 'length') - 1]);
		}
		var result = $es4.$$call(Lexer, null, null, 'lex', [$es4.$$call(input, null, null, 'slice', [$es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword', 'length')]), grammer, true]);
		$es4.$$call(result, null, null, 'tokens', 'unshift', [$es4.$$call(Token, null, null, 'getNewToken', [TokenType, $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword')])]);
		return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$get(result, null, null, 'tokens'), $es4.$$get(result, null, null, 'index') + $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'keyword', 'length') - 1]);
	}));

	//method
	$es4.$$public_function('regexFind', Token, (function ($$$$input, $$$$TokenType, $$$$regex)
	{
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//set default parameter values
		var input = $$$$input;
		var TokenType = $$$$TokenType;
		var regex = (2 > arguments.length - 1) ? null : $$$$regex;

		if (!regex)
		{
			regex = $es4.$$get(Token, null, null, 'tokenFunctions', TokenType, 'regex');
		}
		var match = $es4.$$call(input, null, null, 'match', [regex]);
		if (!match)
		{
			return null;
		}
		return $es4.$$call(Token, null, null, 'getNewResult', [$es4.$$call(Token, null, null, 'getNewToken', [TokenType, $es4.$$get(match, null, null, 0)]), $es4.$$get(match, null, null, 0, 'length') - 1]);
	}));

	function Token()
	{
		//initialize class if not initialized
		if (Token.$$cinit !== undefined) Token.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Token) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Token) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Token, null, 'sweetrush.obj::Token');
})();
//sweetrush.obj.Token


//sweetrush.core.Analyzer
$es4.$$package('sweetrush.core').Analyzer = (function ()
{
	//imports
	var Construct;
	var Token;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//properties
	$es4.$$private_property('globalIdentifiers', Analyzer, Array);
	$es4.$$private_property('_globals', Analyzer, Object);

	//class initializer
	Analyzer.$$cinit = (function ()
	{
		Analyzer.$$cinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Parser = $es4.$$['sweetrush.core'].Parser;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;

		//initialize properties
		Analyzer.globalIdentifiers = [{name:'trace', returnType:'void'}, {name:'parseInt', returnType:'Number'}, {name:'parseFloat', returnType:'Number'}, {name:'isNaN', returnType:'Boolean'}, {name:'isFinite', returnType:'Boolean'}, {name:'escape', returnType:'String'}, {name:'unescape', returnType:'String'}, {name:'decodeURIComponent', returnType:'String'}, {name:'encodeURIComponent', returnType:'String'}, {name:'decodeURI', returnType:'String'}, {name:'encodeURI', returnType:'String'}, {name:'isXMLName', returnType:'Boolean'}, {name:'$es4', returnType:'Object'}, {name:'window', returnType:'Object'}, {name:'document', returnType:'Object'}, {name:'console', returnType:'Object'}, {name:'$', returnType:'Object'}, {name:'_', returnType:'Object'}, {name:'alert', returnType:'Object'}, {name:'debugger', returnType:'Object'}, {name:'setInterval', returnType:'Object'}, {name:'clearInterval', returnType:'Object'}, {name:'setTimeout', returnType:'Object'}, {name:'clearTimeout', returnType:'Object'}, {name:'require', returnType:'Object'}, {name:'global', returnType:'Object'}, {name:'process', returnType:'Object'}, {name:'__dirname', returnType:'String'}];
		Analyzer._globals = {'ArgumentError':1, 'Array':1, 'Boolean':1, 'Class':1, 'JSON':1, 'Walker':1, 'UninitializedError':1, 'Date':1, 'DefinitionError':1, 'Error':1, 'EvalError':1, 'Function':1, 'int':1, 'Math':1, 'Namespace':1, 'Number':1, 'Object':1, 'QName':1, 'RangeError':1, 'ReferenceError':1, 'RegExp':1, 'SecurityError':1, 'String':1, 'SyntaxError':1, 'TypeError':1, 'uint':1, 'URIError':1, 'Vector':1, 'VerifyError':1, 'XML':1, 'XMLList':1};
	});

	//method
	$es4.$$public_function('analyze', Analyzer, (function ($$$$rootConstruct, $$$$rootConstructs, $$$$translationMode, $$$$doNotTreatPrivateMethodsAsNative, $$$$treatThisAsDynamic)
	{
		if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit();

		//set default parameter values
		var rootConstruct = $$$$rootConstruct;
		var rootConstructs = $$$$rootConstructs;
		var translationMode = $es4.$$coerce($$$$translationMode, Number);
		var doNotTreatPrivateMethodsAsNative = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$doNotTreatPrivateMethodsAsNative, Boolean);
		var treatThisAsDynamic = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$treatThisAsDynamic, Boolean);

		return $es4.$$call($es4.$$primitive(new (Analyzer)()), null, null, 'analyze', [rootConstruct, rootConstructs, translationMode, doNotTreatPrivateMethodsAsNative, treatThisAsDynamic]);
	}));

	function Analyzer()
	{
		//initialize class if not initialized
		if (Analyzer.$$cinit !== undefined) Analyzer.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Analyzer) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Analyzer) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//properties
		$es4.$$private_property('_rootConstruct', $$thisp);
		$es4.$$private_property('_rootConstructs', $$thisp, Object);
		$es4.$$private_property('_translationMode', $$thisp, int);
		$es4.$$private_property('_doNotTreatPrivateMethodsAsNative', $$thisp, Boolean);
		$es4.$$private_property('_treatThisAsDynamic', $$thisp, Boolean);
		$es4.$$private_property('_indent', $$thisp);
		$es4.$$private_property('_count', $$thisp);
		$es4.$$private_property('_level', $$thisp, int);
		$es4.$$private_property('_inClosure', $$thisp);
		$es4.$$private_property('_inNamespacedFunction', $$thisp);
		$es4.$$private_property('_inStaticFunction', $$thisp);
		$es4.$$private_property('_inIfStatement', $$thisp);
		$es4.$$private_property('_returnTypeStack', $$thisp);
		$es4.$$private_property('_identifiers', $$thisp);
		$es4.$$private_property('_namespaces', $$thisp);
		$es4.$$private_property('_useNamespaces', $$thisp);
		$es4.$$private_property('_types', $$thisp);

		//initializer
		$es4.$$iinit($$thisp, (function ()
		{
			//initialize properties
			$es4.$$set($$this, $$this, $$thisp, '_doNotTreatPrivateMethodsAsNative', false, '=');
			$es4.$$set($$this, $$this, $$thisp, '_treatThisAsDynamic', false, '=');
			$es4.$$set($$this, $$this, $$thisp, '_indent', -1, '=');
			$es4.$$set($$this, $$this, $$thisp, '_count', -1, '=');
			$es4.$$set($$this, $$this, $$thisp, '_level', 0, '=');
			$es4.$$set($$this, $$this, $$thisp, '_inClosure', false, '=');
			$es4.$$set($$this, $$this, $$thisp, '_inNamespacedFunction', false, '=');
			$es4.$$set($$this, $$this, $$thisp, '_inStaticFunction', false, '=');
			$es4.$$set($$this, $$this, $$thisp, '_inIfStatement', 0, '=');
			$es4.$$set($$this, $$this, $$thisp, '_returnTypeStack', [], '=');
			$es4.$$set($$this, $$this, $$thisp, '_identifiers', [{}], '=');
			$es4.$$set($$this, $$this, $$thisp, '_namespaces', [{}], '=');
			$es4.$$set($$this, $$this, $$thisp, '_useNamespaces', [[]], '=');
			$es4.$$set($$this, $$this, $$thisp, '_types', {}, '=');
		}));

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//method
		$es4.$$public_function('analyze', $$thisp, (function ($$$$rootConstruct, $$$$rootConstructs, $$$$translationMode, $$$$doNotTreatPrivateMethodsAsNative, $$$$treatThisAsDynamic)
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;
			var rootConstructs = $$$$rootConstructs;
			var translationMode = $es4.$$coerce($$$$translationMode, Number);
			var doNotTreatPrivateMethodsAsNative = (3 > arguments.length - 1) ? false : $es4.$$coerce($$$$doNotTreatPrivateMethodsAsNative, Boolean);
			var treatThisAsDynamic = (4 > arguments.length - 1) ? false : $es4.$$coerce($$$$treatThisAsDynamic, Boolean);

			$es4.$$set($$thisp, $$this, $$thisp, '_rootConstruct', rootConstruct, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_rootConstructs', rootConstructs, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_translationMode', translationMode, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_treatThisAsDynamic', treatThisAsDynamic, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_doNotTreatPrivateMethodsAsNative', (translationMode == 1 || translationMode == 3) || doNotTreatPrivateMethodsAsNative, '=');
			$es4.$$call($$thisp, $$this, $$thisp, 'registerNamespace', ['public']);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerNamespace', ['private']);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerNamespace', ['protected']);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerNamespace', ['internal']);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerType', ['void', null, null, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerType', ['*', null, null, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerType', ['PACKAGE', null, null, true]);
			for (var $$i0 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i0 != 0; $$i0 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i0))
			{
				var name = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i0);

				var construct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', name);
				if (!$es4.$$get(construct, $$this, $$thisp, 'packageConstruct'))
				{
					continue;
				}
				if ($es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'classConstruct'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerType', [name, construct, $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'classConstruct'), $es4.$$get(Analyzer, $$this, $$thisp, '_globals', name)]);
				}
				if ($es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerType', [name, construct, $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct'), $es4.$$get(Analyzer, $$this, $$thisp, '_globals', name)]);
				}
			}
			for (var i = 0; i < $es4.$$get(Analyzer, $$this, $$thisp, 'globalIdentifiers', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(Analyzer, $$this, $$thisp, 'globalIdentifiers', i, 'name')]);
			}
			var packageConstruct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'packageConstruct');
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'classConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'classConstructs', i), $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'classConstructs', i)]);
			}
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'interfaceConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'interfaceConstructs', i), $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'interfaceConstructs', i)]);
			}
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'propertyConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'propertyConstructs', i), $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'propertyConstructs', i)]);
			}
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'methodConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'methodConstructs', i), $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'methodConstructs', i)]);
			}
			for (var i = 0; i < $es4.$$get(packageConstruct, $$this, $$thisp, 'useConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerUseNamespace', [$es4.$$get(packageConstruct, $$this, $$thisp, 'useConstructs', i)]);
			}
			if ($es4.$$get(packageConstruct, $$this, $$thisp, 'classConstruct') != null && $es4.$$get(packageConstruct, $$this, $$thisp, 'classConstruct', 'UNIMPLEMENTEDToken') == null)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeClassConstruct', [$es4.$$get(packageConstruct, $$this, $$thisp, 'classConstruct')]);
			}
			if ($es4.$$get(packageConstruct, $$this, $$thisp, 'interfaceConstruct') != null && $es4.$$get(packageConstruct, $$this, $$thisp, 'interfaceConstruct', 'UNIMPLEMENTEDToken') == null)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeInterfaceConstruct', [$es4.$$get(packageConstruct, $$this, $$thisp, 'interfaceConstruct')]);
			}
			if ($es4.$$get(packageConstruct, $$this, $$thisp, 'methodConstruct') != null && $es4.$$get(packageConstruct, $$this, $$thisp, 'methodConstruct', 'UNIMPLEMENTEDToken') == null)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeFunctionConstruct', [$es4.$$get(packageConstruct, $$this, $$thisp, 'methodConstruct')]);
			}
			if ($es4.$$get(packageConstruct, $$this, $$thisp, 'propertyConstruct') != null)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzePropertyConstruct', [$es4.$$get(packageConstruct, $$this, $$thisp, 'propertyConstruct')]);
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct');
		}));

		//method
		$es4.$$private_function('upLevel', $$thisp, (function ()
		{
			$es4.$$set($$thisp, $$this, $$thisp, '_indent', 'postfix', '++');
			$es4.$$set($$thisp, $$this, $$thisp, '_level', 'postfix', '++');
			$es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), {}, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), {}, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '_useNamespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), [], '=');
			return $es4.$$get($$thisp, $$this, $$thisp, '_level');
		}));

		//method
		$es4.$$private_function('downLevel', $$thisp, (function ()
		{
			$es4.$$delete($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'));
			$es4.$$delete($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'));
			$es4.$$delete($$thisp, $$this, $$thisp, '_useNamespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'));
			$es4.$$set($$thisp, $$this, $$thisp, '_indent', 'postfix', '--');
			$es4.$$set($$thisp, $$this, $$thisp, '_level', 'postfix', '--');
			return $es4.$$get($$thisp, $$this, $$thisp, '_level');
		}));

		//method
		$es4.$$private_function('output', $$thisp, (function ()
		{
			trace('outputing...');
			var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
			while (level >= 0)
			{
				trace('level: ' + level);
				for (var $$i1 = ($es4.$$get($$thisp, $$this, $$thisp, '_namespaces', level) || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i1 != 0; $$i1 = $es4.$$get($$thisp, $$this, $$thisp, '_namespaces', level).$$nextNameIndex($$i1))
				{
					var name = $es4.$$get($$thisp, $$this, $$thisp, '_namespaces', level).$$nextName($$i1);

					trace('\t' + $es4.$$get($$thisp, $$this, $$thisp, '_namespaces', level, name) + '\t\t\t [[[' + $es4.$$call(name, $$this, $$thisp, 'substring', [1]) + ']]]');
				}
				for (var $$i2 = ($es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level) || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i2 != 0; $$i2 = $es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level).$$nextNameIndex($$i2))
				{
					var name = $es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level).$$nextName($$i2);

					trace('\t' + $es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level, name) + '\t\t\t [[[' + $es4.$$call(name, $$this, $$thisp, 'substring', [1]) + ']]]');
				}
				level--;
			}
			for (var $$i3 = ($es4.$$get($$thisp, $$this, $$thisp, '_types') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i3 != 0; $$i3 = $es4.$$get($$thisp, $$this, $$thisp, '_types').$$nextNameIndex($$i3))
			{
				var name = $es4.$$get($$thisp, $$this, $$thisp, '_types').$$nextName($$i3);

				trace('\t' + $es4.$$get($$thisp, $$this, $$thisp, '_types', name) + '\t\t\t [[[' + $es4.$$call(name, $$this, $$thisp, 'substring', [1]) + ']]]');
			}
			for (var i = 0; i < $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'getUseNamespaces', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'length'); i++)
			{
				trace('UseNamespace: ' + $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'getUseNamespaces', $es4.$$EMPTY_ARRAY), $$this, $$thisp, i));
			}
		}));

		//method
		$es4.$$private_function('lookupConstructInRootConstruct', $$thisp, (function ($$$$rootConstruct, $$$$object)
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;
			var object = $$$$object;

			if (!rootConstruct || !object)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				throw $es4.$$primitive(new (Error)('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < $es4.$$get(rootConstruct, $$this, $$thisp, 'classConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'classConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, $$this, $$thisp, 'classConstructs', i);
					}
				}
				for (var i = 0; i < $es4.$$get(rootConstruct, $$this, $$thisp, 'interfaceConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'interfaceConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, $$this, $$thisp, 'interfaceConstructs', i);
					}
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'classConstruct'))
				{
					return $es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'classConstruct');
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct'))
				{
					return $es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct');
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'propertyConstruct'))
				{
					return $es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'propertyConstruct');
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'methodConstruct'))
				{
					return $es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'methodConstruct');
				}
				throw $es4.$$primitive(new (Error)('could not lookup construct in construct: ' + object));
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NameConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [rootConstruct, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [object])]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ImportConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [rootConstruct, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')])]);
			}
		}));

		//method
		$es4.$$private_function('lookupRootConstruct', $$thisp, (function ($$$$rootConstruct, $$$$object)
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;
			var object = $$$$object;

			if (!rootConstruct || !object)
			{
				throw $es4.$$primitive(new (Error)('cannot find empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < $es4.$$get(rootConstruct, $$this, $$thisp, 'classConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'classConstructs', i, 'identifierToken', 'data') == object)
					{
						return rootConstruct;
					}
				}
				for (var i = 0; i < $es4.$$get(rootConstruct, $$this, $$thisp, 'interfaceConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'interfaceConstructs', i, 'identifierToken', 'data') == object)
					{
						return rootConstruct;
					}
				}
				var rootConstructs = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs');
				if ($es4.$$get(rootConstructs, $$this, $$thisp, object))
				{
					return $es4.$$get(rootConstructs, $$this, $$thisp, object);
				}
				throw $es4.$$primitive(new (Error)('could not lookup root construct: ' + object));
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ImportConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [rootConstruct, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')])]);
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into lookupRootConstruct: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('lookupPackageName', $$thisp, (function ($$$$construct, $$$$object)
		{
			//set default parameter values
			var construct = $$$$construct;
			var object = $$$$object;

			var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, object]);
			var parts = $es4.$$call(fullyQualifiedName, $$this, $$thisp, 'split', ['.']);
			if ($es4.$$get(parts, $$this, $$thisp, 'length') > 1)
			{
				$es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				return $es4.$$call(parts, $$this, $$thisp, 'join', ['.']);
			}
			return '';
		}));

		//method
		$es4.$$private_function('lookupFullyQualifiedName', $$thisp, (function ($$$$construct, $$$$object)
		{
			//set default parameter values
			var construct = $$$$construct;
			var object = $$$$object;

			if (!construct || !object)
			{
				throw $es4.$$primitive(new (Error)('cannot find empty construct/object: ' + construct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				if ($es4.$$get($es4.$$call(object, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'length') > 1)
				{
					if ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', object))
					{
						return object;
					}
					throw $es4.$$primitive(new (Error)('could not lookup fully qualified name: ' + object));
				}
				if ($es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data') == object)
				{
					if ($es4.$$get(construct, $$this, $$thisp, 'packageConstruct'))
					{
						return $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) + '.' + object;
					}
					else
					{
						return object;
					}
				}
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'classConstructs', 'length'); i++)
				{
					if ($es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'classConstructs', i, 'identifierToken', 'data') == object)
					{
						return object;
					}
				}
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'interfaceConstructs', 'length'); i++)
				{
					if ($es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'interfaceConstructs', i, 'identifierToken', 'data') == object)
					{
						return object;
					}
				}
				var importConstructs = ($es4.$$get(construct, $$this, $$thisp, 'isInternal')) ? $es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'importConstructs') : $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'importConstructs');
				for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
				{
					var nameConstruct = $es4.$$get(importConstructs, $$this, $$thisp, i, 'nameConstruct');
					if ($es4.$$get(nameConstruct, $$this, $$thisp, 'identifierTokens', $es4.$$get(nameConstruct, $$this, $$thisp, 'identifierTokens', 'length') - 1, 'data') == object)
					{
						if ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [nameConstruct])))
						{
							return $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [nameConstruct]);
						}
						throw $es4.$$primitive(new (Error)('could not lookup fully qualified name: ' + object + ', ' + $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [nameConstruct])));
					}
				}
				if (!$es4.$$get(construct, $$this, $$thisp, 'isInternal'))
				{
					var packageName = ($es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')) ? $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) : '';
					for (var $$i4 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i4 != 0; $$i4 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i4))
					{
						var id = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i4);

						var innerPackageName = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id, 'packageConstruct', 'nameConstruct')) ? $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id, 'packageConstruct', 'nameConstruct')]) : '';
						var name = $es4.$$call($es4.$$call(id, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
						if (packageName == innerPackageName && object == name)
						{
							if ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id))
							{
								return id;
							}
							throw $es4.$$primitive(new (Error)('could not lookup fully qualified name: ' + object + ', ' + id));
						}
					}
				}
				if ($es4.$$call($$thisp, $$this, $$thisp, '_types', 'hasOwnProperty', ['_' + object]))
				{
					return object;
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				throw $es4.$$primitive(new (Error)('could not lookup fully qualified name: ' + object + ' in ' + $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data')));
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NameConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [object])]);
			}
			throw $es4.$$primitive(new (Error)('could not lookup fully qualified name: ' + object));
		}));

		//method
		$es4.$$private_function('registerNamespace', $$thisp, (function ($$$$object, $$$$construct)
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
				$es4.$$set($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + object, $es4.$$primitive(new (NamespaceObj)(object)), '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + object, 'isCustom', false, '=');
				return;
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into registerNamespace: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('lookupNamespace', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = $$$$object;

			if (!object)
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', ['internal']);
			}
			if ($es4.$$is(object, String))
			{
				var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
				while (level >= 0)
				{
					if ($es4.$$call($$thisp, $$this, $$thisp, '_namespaces', level, 'hasOwnProperty', ['_' + object]))
					{
						return $es4.$$get($$thisp, $$this, $$thisp, '_namespaces', level, '_' + object);
					}
					level--;
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				throw $es4.$$primitive(new (Error)('could not lookup namespace: ' + object));
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == "token" && $es4.$$get(object, $$this, $$thisp, 'type') == $es4.$$get(Token, $$this, $$thisp, 'IdentifierTokenType'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'data')]);
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into lookupNamespace: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('hasNamespace', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = $$$$object;

			if (!object)
			{
				return true;
			}
			if ($es4.$$is(object, String))
			{
				var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
				while (level >= 0)
				{
					if ($es4.$$call($$thisp, $$this, $$thisp, '_namespaces', level, 'hasOwnProperty', ['_' + object]))
					{
						return true;
					}
					level--;
				}
				return false;
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PropertyConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'hasNamespace', [$es4.$$get(object, $$this, $$thisp, 'identifierConstruct')]);
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == "token" && $es4.$$get(object, $$this, $$thisp, 'type') == $es4.$$get(Token, $$this, $$thisp, 'IdentifierTokenType'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'hasNamespace', [$es4.$$get(object, $$this, $$thisp, 'data')]);
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into lookupNamespace: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('registerUseNamespace', $$thisp, (function ($$$$object)
		{
			//set default parameter values
			var object = $$$$object;

			if (!object)
			{
				throw $es4.$$primitive(new (Error)('null object passed to registerUseNamespace'));
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'UseConstruct') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'UseStatement'))
			{
				$es4.$$call($$thisp, $$this, $$thisp, '_useNamespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), 'push', [$es4.$$get(object, $$this, $$thisp, 'namespaceIdentifierToken', 'data')]);
				return;
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into registerUseNamespace: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('getUseNamespaces', $$thisp, (function ()
		{
			var useNamespaces = [];
			var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
			while (level >= 0)
			{
				for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_useNamespaces', level, 'length'); i++)
				{
					$es4.$$call(useNamespaces, $$this, $$thisp, 'push', [$es4.$$get($$thisp, $$this, $$thisp, '_useNamespaces', level, i)]);
				}
				level--;
			}
			return useNamespaces;
		}));

		//method
		$es4.$$private_function('registerIdentifier', $$thisp, (function ($$$$object, $$$$construct)
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
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PackageConstruct'))
			{
				var packageName = $es4.$$get(object, $$this, $$thisp, 'nameConstruct') ? $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]) : '';
				var name = $es4.$$call($es4.$$call(packageName, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'shift', $es4.$$EMPTY_ARRAY);
				if (name)
				{
					identifier = $es4.$$primitive(new (Identifier)(name, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['PACKAGE', construct])));
				}
				if ($es4.$$get(object, $$this, $$thisp, 'classConstruct'))
				{
					identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(object, $$this, $$thisp, 'classConstruct'), $es4.$$get(object, $$this, $$thisp, 'classConstruct')]);
					if (!$es4.$$get(object, $$this, $$thisp, 'isInternal') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'classConstruct', 'packageConstruct', 'nameConstruct')]))
					{
						$es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(identifier, $$this, $$thisp, 'type', 'fullyQualifiedName'), identifier, '=');
					}
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'interfaceConstruct'))
				{
					identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(object, $$this, $$thisp, 'interfaceConstruct'), $es4.$$get(object, $$this, $$thisp, 'interfaceConstruct')]);
					if (!$es4.$$get(object, $$this, $$thisp, 'isInternal') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'interfaceConstruct', 'packageConstruct', 'nameConstruct')]))
					{
						$es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(identifier, $$this, $$thisp, 'type', 'fullyQualifiedName'), identifier, '=');
					}
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'methodConstruct'))
				{
					identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(object, $$this, $$thisp, 'methodConstruct'), $es4.$$get(object, $$this, $$thisp, 'methodConstruct')]);
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'propertyConstruct'))
				{
					identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(object, $$this, $$thisp, 'propertyConstruct'), $es4.$$get(object, $$this, $$thisp, 'propertyConstruct')]);
				}
				else
				{
					throw $es4.$$primitive(new (Error)('could not register type: ' + object));
				}
				if (!identifier)
				{
					return;
				}
				$es4.$$set(identifier, $$this, $$thisp, 'isImport', true, '=');
				return identifier;
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ClassConstruct') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct'))
			{
				var type;
				if ($es4.$$get(object, $$this, $$thisp, 'isInternal'))
				{
					type = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), construct]);
				}
				else if ($es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]))
				{
					type = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) + '.' + $es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data')]);
				}
				else
				{
					type = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data')]);
				}
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), type));
				$es4.$$set(identifier, $$this, $$thisp, 'isType', true, '=');
				$es4.$$set(identifier, $$this, $$thisp, 'construct', construct, '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isInternal', $es4.$$get(object, $$this, $$thisp, 'isInternal'), '=');
				var type = $es4.$$primitive(new (Type)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$get(identifier, $$this, $$thisp, 'type', 'fullyQualifiedName'), $es4.$$get(object, $$this, $$thisp, 'rootConstruct'), construct));
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + $es4.$$get(identifier, $$this, $$thisp, 'type', 'fullyQualifiedName'), type, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + $es4.$$get(identifier, $$this, $$thisp, 'type', 'name'), type, '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ImportConstruct'))
			{
				var rootConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct'), object]);
				var innerConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [rootConstruct, object]);
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'nameConstruct', 'identifierTokens', 0, 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['PACKAGE', construct]), null));
				$es4.$$set(identifier, $$this, $$thisp, 'isPackage', true, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(identifier, $$this, $$thisp, 'name'), identifier, '=');
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(innerConstruct, $$this, $$thisp, 'typeConstruct'), construct]), vectorType));
				$es4.$$set(identifier, $$this, $$thisp, 'isType', ($es4.$$get(innerConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ClassConstruct') || $es4.$$get(innerConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct')), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'construct', innerConstruct, '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isImport', true, '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isInternal', $es4.$$get(innerConstruct, $$this, $$thisp, 'isInternal'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'fullPackageName', $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]), '=');
				if ($es4.$$get(innerConstruct, $$this, $$thisp, 'namespaceKeywordToken'))
				{
					var namespaceObj = $es4.$$set($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$primitive(new (NamespaceObj)($es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, $es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data')]), identifier)), '=');
					$es4.$$set(namespaceObj, $$this, $$thisp, 'isStatic', true, '=');
					$es4.$$set(namespaceObj, $$this, $$thisp, 'namespaceIsPrivate', false, '=');
					$es4.$$set(identifier, $$this, $$thisp, 'isNamespace', namespaceObj, '=');
				}
				$es4.$$set(identifier, $$this, $$thisp, 'namespaceObj', $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(innerConstruct, $$this, $$thisp, 'namespaceToken')]), '=');
				var type = $es4.$$primitive(new (Type)($es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]), rootConstruct, innerConstruct));
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + $es4.$$get(innerConstruct, $$this, $$thisp, 'identifierToken', 'data'), type, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]), type, '=');
				return $es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(identifier, $$this, $$thisp, 'name'), $es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]), identifier, '='), '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ParameterConstruct'))
			{
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct])));
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', true, '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'LabelStatement'))
			{
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void', construct])));
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', true, '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'VarStatement') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'CatchStatement'))
			{
				if ($es4.$$get(object, $$this, $$thisp, 'typeConstruct') && $es4.$$get(object, $$this, $$thisp, 'typeConstruct', 'vectorNameConstruct'))
				{
					vectorType = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct', 'vectorNameConstruct'), construct]);
				}
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct]), vectorType));
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', true, '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'FunctionExpression'))
			{
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct])));
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', true, '=');
			}
			else if (object == 'super')
			{
				identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'name'), construct])));
			}
			else if (object == 'this')
			{
				if (!$es4.$$get($$thisp, $$this, $$thisp, '_treatThisAsDynamic'))
				{
					identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'name'), construct])));
				}
				else
				{
					identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object', construct])));
				}
			}
			else if (object == '$thisp')
			{
				identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'name'), construct])));
			}
			else if (object == 'arguments')
			{
				identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Array'])));
			}
			else if ($es4.$$is(object, String))
			{
				var globalIdentifier = null;
				for (var i = 0; i < $es4.$$get(Analyzer, $$this, $$thisp, 'globalIdentifiers', 'length'); i++)
				{
					if (object != $es4.$$get(Analyzer, $$this, $$thisp, 'globalIdentifiers', i, 'name'))
					{
						continue;
					}
					globalIdentifier = $es4.$$get(Analyzer, $$this, $$thisp, 'globalIdentifiers', i);
					break;
				}
				if (globalIdentifier)
				{
					identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(globalIdentifier, $$this, $$thisp, 'returnType'), construct])));
					$es4.$$set(identifier, $$this, $$thisp, 'isGlobal', true, '=');
				}
				else
				{
					identifier = $es4.$$primitive(new (Identifier)(object, $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [object, construct])));
					$es4.$$set(identifier, $$this, $$thisp, 'isType', true, '=');
					$es4.$$set(identifier, $$this, $$thisp, 'isGlobal', true, '=');
					$es4.$$set(identifier, $$this, $$thisp, 'construct', $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [object, construct]), $$this, $$thisp, 'construct'), '=');
				}
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PropertyConstruct') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'VarStatement'))
			{
				if ($es4.$$get(object, $$this, $$thisp, 'typeConstruct') && $es4.$$get(object, $$this, $$thisp, 'typeConstruct', 'vectorNameConstruct'))
				{
					vectorType = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct', 'vectorNameConstruct'), construct]);
				}
			}
			if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PropertyConstruct'))
			{
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceToken') && $es4.$$get(object, $$this, $$thisp, 'namespaceToken', 'data') == 'private' && !$es4.$$get($$thisp, $$this, $$thisp, '_doNotTreatPrivateMethodsAsNative'))
				{
					$es4.$$set(object, $$this, $$thisp, 'isNative', true, '=');
				}
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceToken') && $es4.$$get(object, $$this, $$thisp, 'namespaceToken', 'data') == 'private')
				{
					$es4.$$set(object, $$this, $$thisp, 'isPrivate', true, '=');
				}
				var type = $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct]);
				if ($es4.$$get(object, $$this, $$thisp, 'isNative') && !$es4.$$get(object, $$this, $$thisp, 'valueExpression') && $es4.$$get(type, $$this, $$thisp, 'fullyQualifiedName') != '*' && $es4.$$get(type, $$this, $$thisp, 'fullyQualifiedName') != 'void')
				{
					switch ($es4.$$get(type, $$this, $$thisp, 'fullyQualifiedName'))
					{
						case 'Number':
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NaNTokenType'), 'NaN'])]), '=');
							break;
						case 'uint':
						case 'int':
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewNumberExpression', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', 'numberToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NumberTokenType'), '0']), '=');
							break;
						case 'Boolean':
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewBooleanExpression', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', 'booleanToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'BooleanTokenType'), 'false']), '=');
							break;
						default:
							$es4.$$set(object, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NullTokenType'), 'null'])]), '=');
					}
				}
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), type, vectorType));
				$es4.$$set(identifier, $$this, $$thisp, 'isProperty', !$es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isInternal', $es4.$$get(object, $$this, $$thisp, 'isInternal'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isNative', $es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', $es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', $es4.$$get(object, $$this, $$thisp, 'isNative'), '='), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isPrivate', $es4.$$get(object, $$this, $$thisp, 'isPrivate') && !$es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				if ($es4.$$get(object, $$this, $$thisp, 'isNative') && $es4.$$get(object, $$this, $$thisp, 'valueExpression'))
				{
					$es4.$$set(object, $$this, $$thisp, 'coerce', $es4.$$call($$thisp, $$this, $$thisp, 'isCoerceRequired', [$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(object, $$this, $$thisp, 'valueExpression'), $es4.$$get($$thisp, $$this, $$thisp, '_indent'), false, construct]), $es4.$$get(identifier, $$this, $$thisp, 'type'), identifier]), '=');
				}
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceKeywordToken'))
				{
					var namespaceObj = $es4.$$set($$thisp, $$this, $$thisp, '_namespaces', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + $es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$primitive(new (NamespaceObj)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), undefined, identifier)), '=');
					if ($es4.$$get(object, $$this, $$thisp, 'staticToken'))
					{
						$es4.$$set(namespaceObj, $$this, $$thisp, 'isStatic', true, '=');
					}
					$es4.$$set(namespaceObj, $$this, $$thisp, 'namespaceIsPrivate', $es4.$$get(object, $$this, $$thisp, 'namespaceToken', 'data') == 'private', '=');
					$es4.$$set(identifier, $$this, $$thisp, 'isNamespace', namespaceObj, '=');
				}
				$es4.$$set(identifier, $$this, $$thisp, 'namespaceObj', $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'namespaceToken')]), '=');
				if ($es4.$$get(object, $$this, $$thisp, 'staticToken'))
				{
					$es4.$$set(identifier, $$this, $$thisp, 'isStatic', true, '=');
					$es4.$$set(identifier, $$this, $$thisp, 'scope', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data'), construct]), '=');
				}
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct'))
			{
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceToken') && $es4.$$get(object, $$this, $$thisp, 'namespaceToken', 'data') == 'private' && !$es4.$$get($$thisp, $$this, $$thisp, '_doNotTreatPrivateMethodsAsNative'))
				{
					$es4.$$set(object, $$this, $$thisp, 'isNative', true, '=');
				}
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceToken') && $es4.$$get(object, $$this, $$thisp, 'namespaceToken', 'data') == 'private')
				{
					$es4.$$set(object, $$this, $$thisp, 'isPrivate', true, '=');
				}
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct]), vectorType));
				$es4.$$set(identifier, $$this, $$thisp, 'isMethod', !$es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isInternal', $es4.$$get(object, $$this, $$thisp, 'isInternal'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isNative', $es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', $es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', $es4.$$get(object, $$this, $$thisp, 'isNative'), '='), '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isPrivate', $es4.$$get(object, $$this, $$thisp, 'isPrivate') && !$es4.$$get(object, $$this, $$thisp, 'isNative'), '=');
				if ($es4.$$get(object, $$this, $$thisp, 'namespaceKeywordToken'))
				{
					throw $es4.$$primitive(new (Error)('test'));
				}
				$es4.$$set(identifier, $$this, $$thisp, 'namespaceObj', $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'namespaceToken')]), '=');
				if ($es4.$$get(object, $$this, $$thisp, 'staticToken'))
				{
					$es4.$$set(identifier, $$this, $$thisp, 'isStatic', true, '=');
					$es4.$$set(identifier, $$this, $$thisp, 'scope', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data'), construct]), '=');
				}
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'VarStatement'))
			{
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(object, $$this, $$thisp, 'typeConstruct'), construct]), vectorType));
				$es4.$$set(identifier, $$this, $$thisp, 'isVar', true, '=');
			}
			else if ($es4.$$is(object, Type))
			{
				identifier = $es4.$$primitive(new (Identifier)($es4.$$get(object, $$this, $$thisp, 'name'), object));
			}
			if (identifier)
			{
				var name = ($es4.$$get(identifier, $$this, $$thisp, 'namespaceObj') && $es4.$$get(identifier, $$this, $$thisp, 'namespaceObj', 'isCustom') ? $es4.$$get(identifier, $$this, $$thisp, 'namespaceObj', 'name') + ':::' : '') + $es4.$$get(identifier, $$this, $$thisp, 'name');
				return $es4.$$set($$thisp, $$this, $$thisp, '_identifiers', $es4.$$get($$thisp, $$this, $$thisp, '_level'), '_' + name, identifier, '=');
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into registerIdentifier: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('lookupIdentifier', $$thisp, (function ($$$$object, $$$$namespaceObj)
		{
			//set default parameter values
			var object = $$$$object;
			var namespaceObj = (1 > arguments.length - 1) ? null : $$$$namespaceObj;

			if (!object)
			{
				throw $es4.$$primitive(new (Error)('cannot find empty identifier'));
			}
			else if ($es4.$$is(object, String))
			{
				if (object == 'Vector')
				{
					object = 'Array';
				}
				if (namespaceObj && $es4.$$get(namespaceObj, $$this, $$thisp, 'isCustom'))
				{
					object = $es4.$$get(namespaceObj, $$this, $$thisp, 'name') + ':::' + object;
				}
				var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
				var useNamespaces = $es4.$$call($$thisp, $$this, $$thisp, 'getUseNamespaces', $es4.$$EMPTY_ARRAY);
				while (level >= 0)
				{
					if ($es4.$$call($$thisp, $$this, $$thisp, '_identifiers', level, 'hasOwnProperty', ['_' + object]))
					{
						return $es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level, '_' + object);
					}
					if (!namespaceObj && $es4.$$get(useNamespaces, $$this, $$thisp, 'length'))
					{
						for (var i = 0; i < $es4.$$get(useNamespaces, $$this, $$thisp, 'length'); i++)
						{
							var innerObject = $es4.$$get(useNamespaces, $$this, $$thisp, i) + ':::' + object;
							if ($es4.$$call($$thisp, $$this, $$thisp, '_identifiers', level, 'hasOwnProperty', ['_' + innerObject]))
							{
								return $es4.$$get($$thisp, $$this, $$thisp, '_identifiers', level, '_' + innerObject);
							}
						}
					}
					level--;
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				throw $es4.$$primitive(new (Error)('could not lookup identifier: ' + object));
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'IdentifierConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), namespaceObj]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct') || $es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PropertyConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'namespaceToken')])]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ThisConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', ['this']);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'SuperConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', ['super']);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NameConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [object]), namespaceObj]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PackageConstruct'))
			{
				if ($es4.$$get(object, $$this, $$thisp, 'classConstruct'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'classConstruct', 'identifierToken', 'data')]);
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'interfaceConstruct'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'interfaceConstruct', 'identifierToken', 'data')]);
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'methodConstruct'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'methodConstruct', 'identifierToken', 'data')]);
				}
				else if ($es4.$$get(object, $$this, $$thisp, 'propertyConstruct'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(object, $$this, $$thisp, 'propertyConstruct', 'identifierToken', 'data')]);
				}
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into lookupIdentifier: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('hasIdentifier', $$thisp, (function ($$$$object, $$$$namespaceObj, $$$$currentLevel)
		{
			//set default parameter values
			var object = $$$$object;
			var namespaceObj = (1 > arguments.length - 1) ? null : $$$$namespaceObj;
			var currentLevel = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$currentLevel, Boolean);

			if (!object)
			{
				throw $es4.$$primitive(new (Error)('cannot find empty identifier'));
			}
			else if ($es4.$$is(object, String))
			{
				if (object == 'Vector')
				{
					object = 'Array';
				}
				if (namespaceObj && $es4.$$get(namespaceObj, $$this, $$thisp, 'isCustom'))
				{
					object = $es4.$$get(namespaceObj, $$this, $$thisp, 'name') + ':::' + object;
				}
				var level = $es4.$$get($$thisp, $$this, $$thisp, '_level');
				var useNamespaces = $es4.$$call($$thisp, $$this, $$thisp, 'getUseNamespaces', $es4.$$EMPTY_ARRAY);
				while (level >= 0)
				{
					if ($es4.$$call($$thisp, $$this, $$thisp, '_identifiers', level, 'hasOwnProperty', ['_' + object]))
					{
						return true;
					}
					if (!namespaceObj && $es4.$$get(useNamespaces, $$this, $$thisp, 'length'))
					{
						for (var i = 0; i < $es4.$$get(useNamespaces, $$this, $$thisp, 'length'); i++)
						{
							var innerObject = $es4.$$get(useNamespaces, $$this, $$thisp, i) + ':::' + object;
							if ($es4.$$call($$thisp, $$this, $$thisp, '_identifiers', level, 'hasOwnProperty', ['_' + innerObject]))
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
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'PropertyConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'namespaceToken')])]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [$es4.$$get(object, $$this, $$thisp, 'identifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(object, $$this, $$thisp, 'namespaceToken')])]);
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into hasIdentifier: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('registerType', $$thisp, (function ($$$$object, $$$$rootConstruct, $$$$construct, $$$$isGlobal)
		{
			//set default parameter values
			var object = $$$$object;
			var rootConstruct = $$$$rootConstruct;
			var construct = $$$$construct;
			var isGlobal = $$$$isGlobal;

			if (!object)
			{
				throw $es4.$$primitive(new (Error)('cannot register empty type'));
			}
			else if (object == 'PACKAGE')
			{
				var type = $es4.$$primitive(new (Type)(object, object, rootConstruct, construct));
				$es4.$$set(type, $$this, $$thisp, 'isGlobal', isGlobal, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + object, type, '=');
				return;
			}
			else if ($es4.$$is(object, String))
			{
				if (object == 'Vector')
				{
					return;
				}
				var type = $es4.$$primitive(new (Type)(object, object, rootConstruct, construct));
				$es4.$$set(type, $$this, $$thisp, 'isGlobal', isGlobal, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + object, type, '=');
				if (isGlobal)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [object, rootConstruct]);
				}
				return;
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into registerType: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('lookupType', $$thisp, (function ($$$$object, $$$$construct)
		{
			//set default parameter values
			var object = $$$$object;
			var construct = (1 > arguments.length - 1) ? null : $$$$construct;

			if (!object)
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void', construct]);
			}
			else if ($es4.$$is(object, String))
			{
				if (object == 'Vector')
				{
					object = 'Array';
				}
				if ($es4.$$call($$thisp, $$this, $$thisp, '_types', 'hasOwnProperty', ['_' + object]))
				{
					return $es4.$$get($$thisp, $$this, $$thisp, '_types', '_' + object);
				}
				if (!construct)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
					throw $es4.$$primitive(new (Error)('cound not lookup type: ' + object));
				}
				var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, object]);
				return $es4.$$set($$thisp, $$this, $$thisp, '_types', '_' + object, ($es4.$$get(construct, $$this, $$thisp, 'isInternal')) ? $es4.$$primitive(new (Type)(object, fullyQualifiedName, $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', fullyQualifiedName), construct)) : $es4.$$primitive(new (Type)(object, fullyQualifiedName, $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', fullyQualifiedName), $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', fullyQualifiedName), fullyQualifiedName]))), '=');
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'TypeConstruct'))
			{
				if (!$es4.$$get(object, $$this, $$thisp, 'nameConstruct'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void', construct]);
				}
				var name = ($es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]) == 'Vector') ? 'Array' : $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(object, $$this, $$thisp, 'nameConstruct')]);
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [name, construct]);
			}
			else if ($es4.$$get(object, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NameConstruct'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [object]), construct]);
			}
			throw $es4.$$primitive(new (Error)('unknown object passed into lookupType: ' + $es4.$$get(object, $$this, $$thisp, 'constructor')));
		}));

		//method
		$es4.$$private_function('analyzeImplicitImports', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, $$this, $$thisp, 'isInternal'))
			{
				return;
			}
			var importConstructs = ($es4.$$get(construct, $$this, $$thisp, 'isInternal')) ? $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'importConstructs') : $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'packageConstruct', 'importConstructs');
			var rootConstructs = {};
			outer:			for (var $$i5 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i5 != 0; $$i5 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i5))
			{
				var id = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i5);

				var rootConstruct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id);
				if (!rootConstruct)
				{
					throw $es4.$$primitive(new (Error)('Root construct null for id: ' + id));
				}
				if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct'))
				{
					throw $es4.$$primitive(new (Error)('Package construct missing in: ' + id));
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && !$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
				{
					continue;
				}
				if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
				{
					continue;
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) != $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]))
				{
					continue;
				}
				var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct')]);
				if ($es4.$$get(identifier, $$this, $$thisp, 'isGlobal'))
				{
					continue;
				}
				var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, $es4.$$get(identifier, $$this, $$thisp, 'name')]);
				if (!$es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(identifier, $$this, $$thisp, 'name'), construct]), $$this, $$thisp, 'accessed') && !$es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(identifier, $$this, $$thisp, 'name')]), $$this, $$thisp, 'accessed'))
				{
					continue;
				}
				$es4.$$set(rootConstructs, $$this, $$thisp, id, rootConstruct, '=');
				$es4.$$set(construct, $$this, $$thisp, 'packageName', $es4.$$call($$thisp, $$this, $$thisp, 'lookupPackageName', [construct, $es4.$$get(identifier, $$this, $$thisp, 'name')]), '=');
				var packageName = $es4.$$call(construct, $$this, $$thisp, 'packageName', 'split', ['.']);
				var nameConstruct = $es4.$$call(Construct, $$this, $$thisp, 'getNewNameConstruct', $es4.$$EMPTY_ARRAY);
				for (var i = 0; i < $es4.$$get(packageName, $$this, $$thisp, 'length'); i++)
				{
					$es4.$$call(nameConstruct, $$this, $$thisp, 'identifierTokens', 'push', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'IdentifierTokenType'), $es4.$$get(packageName, $$this, $$thisp, i)])]);
				}
				$es4.$$call(nameConstruct, $$this, $$thisp, 'identifierTokens', 'push', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'IdentifierTokenType'), $es4.$$get(identifier, $$this, $$thisp, 'name')])]);
				var importConstruct = $es4.$$call(Construct, $$this, $$thisp, 'getNewImportConstruct', $es4.$$EMPTY_ARRAY);
				$es4.$$set(importConstruct, $$this, $$thisp, 'nameConstruct', nameConstruct, '=');
				for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
				{
					if ($es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(importConstruct, $$this, $$thisp, 'nameConstruct')]) == $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(importConstructs, $$this, $$thisp, i, 'nameConstruct')]))
					{
						continue outer;
					}
				}
				$es4.$$call(importConstructs, $$this, $$thisp, 'push', [importConstruct]);
			}
		}));

		//method
		$es4.$$private_function('analyzeInterfaceConstruct', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerConstruct', [construct, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeImplicitImports', [construct]);
			if ($es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', 'length'))
			{
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', 'length'); i++)
				{
					var identifier = $es4.$$set(construct, $$this, $$thisp, 'extendsNameConstructs', i, 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', i), construct]), '=');
					var type = $es4.$$set(construct, $$this, $$thisp, 'extendsNameConstructs', i, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', i), construct]), '=');
					$es4.$$set(type, $$this, $$thisp, 'accessed', true, '=');
				}
			}
			var packageName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupPackageName', [construct, $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data')]);
			$es4.$$set(construct, $$this, $$thisp, 'packageName', packageName, '=');
			$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
		}));

		//method
		$es4.$$private_function('analyzePropertyConstruct', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(construct, $$this, $$thisp, 'valueExpression'), $es4.$$get($$thisp, $$this, $$thisp, '_indent'), false, construct]);
		}));

		//method
		$es4.$$private_function('analyzeFunctionConstruct', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
			var importConstructs = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'packageConstruct', 'importConstructs');
			var accessor = $es4.$$get(construct, $$this, $$thisp, 'getToken') || $es4.$$get(construct, $$this, $$thisp, 'setToken');
			$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['this', construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['arguments', construct]);
			for (var $$i6 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i6 != 0; $$i6 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i6))
			{
				var id = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i6);

				var rootConstruct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id);
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && !$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
				{
					continue;
				}
				if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
				{
					continue;
				}
				if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) != $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]))
				{
					continue;
				}
				if ($es4.$$get(Analyzer, $$this, $$thisp, '_globals', id))
				{
					continue;
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct'), construct]);
			}
			for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(importConstructs, $$this, $$thisp, i), construct]);
			}
			analyzeClassFunction(construct);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeImplicitImports', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);

			function analyzeClassFunction($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
				for (var j = 0; j < $es4.$$get(construct, $$this, $$thisp, 'namedFunctionExpressions', 'length'); j++)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(construct, $$this, $$thisp, 'namedFunctionExpressions', j), construct]);
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeParameters', [construct, construct]);
				if (!$es4.$$get(construct, $$this, $$thisp, 'isJavaScript'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'push', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'typeConstruct'), construct])]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(construct, $$this, $$thisp, 'bodyStatements'), $es4.$$get($$thisp, $$this, $$thisp, '_indent') + 1, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'pop', $es4.$$EMPTY_ARRAY);
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
			}
;
		}));

		//method
		$es4.$$private_function('analyzeClassConstruct', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerConstruct', [construct, true]);
			for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'useConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerUseNamespace', [$es4.$$get(construct, $$this, $$thisp, 'useConstructs', i)]);
			}
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeNamespaces', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeProperties', [construct, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeClassInitializer', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeMethods', [construct, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeAccessors', [construct, true]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeClassFunction', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeInternalClasses', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeInternalInterfaces', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeClassReturnStatement', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeImplicitImports', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
		}));

		//method
		$es4.$$private_function('analyzeClassInitializer', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', true, '=');
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(construct, $$this, $$thisp, 'initializerStatements'), $es4.$$get($$thisp, $$this, $$thisp, '_indent') + 2, construct]);
			$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', false, '=');
		}));

		//method
		$es4.$$private_function('analyzeClassFunction', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
			$es4.$$call($$thisp, $$this, $$thisp, 'registerConstruct', [construct, false]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeProperties', [construct, false]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeConstructor', [construct]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeMethods', [construct, false]);
			$es4.$$call($$thisp, $$this, $$thisp, 'analyzeAccessors', [construct, false]);
			$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
		}));

		//method
		$es4.$$private_function('analyzeInternalClasses', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, $$this, $$thisp, 'isInternal'))
			{
				return;
			}
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'classConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeClassConstruct', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'classConstructs', i)]);
			}
		}));

		//method
		$es4.$$private_function('analyzeInternalInterfaces', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, $$this, $$thisp, 'isInternal'))
			{
				return;
			}
			for (var i = 0; i < $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'interfaceConstructs', 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeInterfaceConstruct', [$es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'interfaceConstructs', i)]);
			}
		}));

		//method
		$es4.$$private_function('analyzeClassReturnStatement', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct'))
			{
				var identifier = $es4.$$set(construct, $$this, $$thisp, 'extendsNameConstruct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct'), construct]), '=');
				var type = $es4.$$set(construct, $$this, $$thisp, 'extendsNameConstruct', 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct'), construct]), '=');
				$es4.$$set(type, $$this, $$thisp, 'accessed', true, '=');
			}
			if ($es4.$$get(construct, $$this, $$thisp, 'implementsNameConstructs', 'length'))
			{
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'implementsNameConstructs', 'length'); i++)
				{
					var identifier = $es4.$$set(construct, $$this, $$thisp, 'implementsNameConstructs', i, 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(construct, $$this, $$thisp, 'implementsNameConstructs', i), construct]), '=');
					var type = $es4.$$set(construct, $$this, $$thisp, 'implementsNameConstructs', i, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(construct, $$this, $$thisp, 'implementsNameConstructs', i), construct]), '=');
					$es4.$$set(type, $$this, $$thisp, 'accessed', true, '=');
				}
			}
			var packageName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupPackageName', [construct, $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data')]);
			$es4.$$set(construct, $$this, $$thisp, 'packageName', packageName, '=');
		}));

		//method
		$es4.$$private_function('analyzeConstructor', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
			var methodConstruct = $es4.$$get(construct, $$this, $$thisp, 'constructorMethodConstruct');
			if (methodConstruct)
			{
				for (var j = 0; j < $es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', 'length'); j++)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', j), construct]);
				}
			}
			if (methodConstruct)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeParameters', [methodConstruct, construct]);
			}
			if (methodConstruct)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(methodConstruct, $$this, $$thisp, 'bodyStatements'), $es4.$$get($$thisp, $$this, $$thisp, '_indent') + 1, construct]);
			}
			$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
		}));

		//method
		$es4.$$private_function('analyzeNamespaces', $$thisp, (function ($$$$construct)
		{
			//set default parameter values
			var construct = $$$$construct;

			for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', i);
				if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceKeywordToken'))
				{
					continue;
				}
				var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [propertyConstruct]);
				$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
				$es4.$$set(propertyConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				$es4.$$call(construct, $$this, $$thisp, 'namespacePropertyConstructs', 'push', [propertyConstruct]);
				if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'valueExpression'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(propertyConstruct, $$this, $$thisp, 'valueExpression'), $es4.$$get($$thisp, $$this, $$thisp, '_indent'), false, construct]);
				}
			}
		}));

		//method
		$es4.$$private_function('analyzeProperties', $$thisp, (function ($$$$construct, $$$$isClassLevel)
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = $$$$isClassLevel;

			for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', i);
				if (isClassLevel && !$es4.$$get(propertyConstruct, $$this, $$thisp, 'staticToken') || !isClassLevel && $es4.$$get(propertyConstruct, $$this, $$thisp, 'staticToken'))
				{
					continue;
				}
				if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceKeywordToken'))
				{
					continue;
				}
				var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [propertyConstruct]);
				$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
				$es4.$$set(propertyConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				if (isClassLevel)
				{
					$es4.$$call(construct, $$this, $$thisp, 'staticPropertyConstructs', 'push', [propertyConstruct]);
				}
				else
				{
					$es4.$$call(construct, $$this, $$thisp, 'instancePropertyConstructs', 'push', [propertyConstruct]);
				}
				if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'valueExpression'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(propertyConstruct, $$this, $$thisp, 'valueExpression'), $es4.$$get($$thisp, $$this, $$thisp, '_indent'), false, construct]);
				}
			}
		}));

		//method
		$es4.$$private_function('analyzeMethods', $$thisp, (function ($$$$construct, $$$$isClassLevel)
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = $$$$isClassLevel;

			if (isClassLevel)
			{
				$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', true, '=');
			}
			for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', i);
				if (isClassLevel && !$es4.$$get(methodConstruct, $$this, $$thisp, 'staticToken') || !isClassLevel && $es4.$$get(methodConstruct, $$this, $$thisp, 'staticToken'))
				{
					continue;
				}
				if ($es4.$$get(methodConstruct, $$this, $$thisp, 'setToken') || $es4.$$get(methodConstruct, $$this, $$thisp, 'getToken'))
				{
					continue;
				}
				var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [methodConstruct]);
				$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
				$es4.$$set(methodConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				if (isClassLevel)
				{
					$es4.$$call(construct, $$this, $$thisp, 'staticMethodConstructs', 'push', [methodConstruct]);
				}
				else
				{
					$es4.$$call(construct, $$this, $$thisp, 'instanceMethodConstructs', 'push', [methodConstruct]);
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['arguments', construct]);
				for (var j = 0; j < $es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', 'length'); j++)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', j), construct]);
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeParameters', [methodConstruct, construct]);
				if (!$es4.$$get(methodConstruct, $$this, $$thisp, 'isJavaScript'))
				{
					if ($es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'isCustom'))
					{
						$es4.$$set($$thisp, $$this, $$thisp, '_inNamespacedFunction', ($es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'importID')) ? $es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'importID') : '$thisp.' + $es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'name'), '=');
					}
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'push', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(methodConstruct, $$this, $$thisp, 'typeConstruct'), construct])]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(methodConstruct, $$this, $$thisp, 'bodyStatements'), $es4.$$get($$thisp, $$this, $$thisp, '_indent') + 1, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'pop', $es4.$$EMPTY_ARRAY);
					$es4.$$set($$thisp, $$this, $$thisp, '_inNamespacedFunction', false, '=');
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
			}
			if (isClassLevel)
			{
				$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', false, '=');
			}
		}));

		//method
		$es4.$$private_function('analyzeAccessors', $$thisp, (function ($$$$construct, $$$$isClassLevel)
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = $$$$isClassLevel;

			if (isClassLevel)
			{
				$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', true, '=');
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
				$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
				for (var j = 0; j < $es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', 'length'); j++)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(methodConstruct, $$this, $$thisp, 'namedFunctionExpressions', j), construct]);
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeParameters', [methodConstruct, construct]);
				if (!$es4.$$get(methodConstruct, $$this, $$thisp, 'isJavaScript'))
				{
					if ($es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'isCustom'))
					{
						$es4.$$set($$thisp, $$this, $$thisp, '_inNamespacedFunction', ($es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'importID')) ? $es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'importID') : '$thisp.' + $es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'name'), '=');
					}
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'push', [type]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(methodConstruct, $$this, $$thisp, 'bodyStatements'), $es4.$$get($$thisp, $$this, $$thisp, '_indent') + 1, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'pop', $es4.$$EMPTY_ARRAY);
					$es4.$$set($$thisp, $$this, $$thisp, '_inNamespacedFunction', false, '=');
				}
				$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
			}
;

			for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', i);
				if ($es4.$$get(foundIndexes, $$this, $$thisp, i))
				{
					continue;
				}
				if (!$es4.$$get(methodConstruct, $$this, $$thisp, 'setToken') && !$es4.$$get(methodConstruct, $$this, $$thisp, 'getToken'))
				{
					continue;
				}
				if (isClassLevel && !$es4.$$get(methodConstruct, $$this, $$thisp, 'staticToken') || !isClassLevel && $es4.$$get(methodConstruct, $$this, $$thisp, 'staticToken'))
				{
					continue;
				}
				var setterMethodConstruct = null;
				var getterMethodConstruct = null;
				if ($es4.$$get(methodConstruct, $$this, $$thisp, 'setToken'))
				{
					setterMethodConstruct = methodConstruct;
					for (var j = 0; j < $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', 'length'); j++)
					{
						var innerMethodConstruct = $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', j);
						if (!$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'getToken'))
						{
							continue;
						}
						if ($es4.$$get(innerMethodConstruct, $$this, $$thisp, 'identifierToken', 'data') != $es4.$$get(setterMethodConstruct, $$this, $$thisp, 'identifierToken', 'data'))
						{
							continue;
						}
						if (isClassLevel && !$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'staticToken') || !isClassLevel && $es4.$$get(innerMethodConstruct, $$this, $$thisp, 'staticToken'))
						{
							continue;
						}
						if ($es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'namespaceToken')]) != $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(setterMethodConstruct, $$this, $$thisp, 'namespaceToken')]))
						{
							continue;
						}
						var namespace1 = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(setterMethodConstruct, $$this, $$thisp, 'namespaceToken')]);
						var namespace2 = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'namespaceToken')]);
						if (namespace1 != namespace2)
						{
							continue;
						}
						getterMethodConstruct = innerMethodConstruct;
						$es4.$$set(foundIndexes, $$this, $$thisp, j, true, '=');
					}
				}
				else
				{
					getterMethodConstruct = methodConstruct;
					for (var j = 0; j < $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', 'length'); j++)
					{
						var innerMethodConstruct = $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', j);
						if (!$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'setToken'))
						{
							continue;
						}
						if ($es4.$$get(innerMethodConstruct, $$this, $$thisp, 'identifierToken', 'data') != $es4.$$get(getterMethodConstruct, $$this, $$thisp, 'identifierToken', 'data'))
						{
							continue;
						}
						if (isClassLevel && !$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'staticToken') || !isClassLevel && $es4.$$get(innerMethodConstruct, $$this, $$thisp, 'staticToken'))
						{
							continue;
						}
						if ($es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'namespaceToken')]) != $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(getterMethodConstruct, $$this, $$thisp, 'namespaceToken')]))
						{
							continue;
						}
						var namespace1 = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(getterMethodConstruct, $$this, $$thisp, 'namespaceToken')]);
						var namespace2 = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(innerMethodConstruct, $$this, $$thisp, 'namespaceToken')]);
						if (namespace1 != namespace2)
						{
							continue;
						}
						setterMethodConstruct = innerMethodConstruct;
						$es4.$$set(foundIndexes, $$this, $$thisp, j, true, '=');
					}
				}
				if (setterMethodConstruct)
				{
					var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [setterMethodConstruct]);
					$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
					$es4.$$set(setterMethodConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				}
				if (getterMethodConstruct)
				{
					var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [getterMethodConstruct]);
					$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
					$es4.$$set(getterMethodConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				}
				var isCNamespace = $es4.$$get(methodConstruct, $$this, $$thisp, 'identifier', 'namespaceObj', 'isCustom');
				if (isClassLevel)
				{
					$es4.$$call(construct, $$this, $$thisp, 'staticAccessorConstructs', 'push', [{getter:getterMethodConstruct, setter:setterMethodConstruct}]);
				}
				else
				{
					$es4.$$call(construct, $$this, $$thisp, 'instanceAccessorConstructs', 'push', [{getter:getterMethodConstruct, setter:setterMethodConstruct}]);
				}
				if (getterMethodConstruct)
				{
					getMethodConstructJS(getterMethodConstruct, $es4.$$get(getterMethodConstruct, $$this, $$thisp, 'identifier', 'type'));
				}
				if (setterMethodConstruct)
				{
					getMethodConstructJS(setterMethodConstruct, $es4.$$get(setterMethodConstruct, $$this, $$thisp, 'identifier', 'type'));
				}
			}
			if (isClassLevel)
			{
				$es4.$$set($$thisp, $$this, $$thisp, '_inStaticFunction', false, '=');
			}
		}));

		//method
		$es4.$$private_function('registerConstruct', $$thisp, (function ($$$$construct, $$$$isClassLevel)
		{
			//set default parameter values
			var construct = $$$$construct;
			var isClassLevel = $$$$isClassLevel;

			if (isClassLevel)
			{
				if (!$es4.$$get(construct, $$this, $$thisp, 'isInternal'))
				{
					for (var $$i7 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i7 != 0; $$i7 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i7))
					{
						var id = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i7);

						var rootConstruct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id);
						if (!rootConstruct)
						{
							throw $es4.$$primitive(new (Error)('Root construct null for id: ' + id));
						}
						if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct'))
						{
							throw $es4.$$primitive(new (Error)('Package construct missing in: ' + id));
						}
						if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && !$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
						{
							continue;
						}
						if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
						{
							continue;
						}
						if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]) != $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]))
						{
							continue;
						}
						if ($es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [id]) && $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [id]), $$this, $$thisp, 'isGlobal'))
						{
							continue;
						}
						$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct'), construct]);
					}
				}
				var importConstructs = ($es4.$$get(construct, $$this, $$thisp, 'isInternal')) ? $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'importConstructs') : $es4.$$get($$thisp, $$this, $$thisp, '_rootConstruct', 'packageConstruct', 'importConstructs');
				for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(importConstructs, $$this, $$thisp, i), construct]);
				}
			}
			else
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['this', construct]);
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['$thisp', construct]);
				if ($es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['super', construct]);
				}
			}
			var name = $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data');
			var nextConstruct = construct;
			while (true)
			{
				for (var i = 0; i < $es4.$$get(nextConstruct, $$this, $$thisp, 'propertyConstructs', 'length'); i++)
				{
					var propertyConstruct = $es4.$$get(nextConstruct, $$this, $$thisp, 'propertyConstructs', i);
					if (!isClassLevel)
					{
						continue;
					}
					if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceKeywordToken'))
					{
						continue;
					}
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [propertyConstruct, nextConstruct]);
				}
				if (!$es4.$$get(nextConstruct, $$this, $$thisp, 'extendsNameConstruct'))
				{
					break;
				}
				var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [nextConstruct, $es4.$$get(nextConstruct, $$this, $$thisp, 'extendsNameConstruct')]);
				if ($es4.$$call($es4.$$call(fullyQualifiedName, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY) == name)
				{
					$es4.$$set(construct, $$this, $$thisp, 'extendsNameConflict', true, '=');
				}
				nextConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(nextConstruct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
			}
			var firstIteration = true;
			while (true)
			{
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', 'length'); i++)
				{
					var methodConstruct = $es4.$$get(construct, $$this, $$thisp, 'methodConstructs', i);
					if (Boolean($es4.$$get(methodConstruct, $$this, $$thisp, 'staticToken')) != isClassLevel)
					{
						continue;
					}
					if (!firstIteration && !$es4.$$call($$thisp, $$this, $$thisp, 'hasNamespace', [$es4.$$get(methodConstruct, $$this, $$thisp, 'namespaceToken')]))
					{
						continue;
					}
					var namespace = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(methodConstruct, $$this, $$thisp, 'namespaceToken')]);
					if ($es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [methodConstruct, namespace]))
					{
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [methodConstruct, namespace]);
						if (!$es4.$$get(identifier, $$this, $$thisp, 'isGlobal') && !$es4.$$get(identifier, $$this, $$thisp, 'isStatic'))
						{
							continue;
						}
					}
					if (!firstIteration && $es4.$$get(methodConstruct, $$this, $$thisp, 'namespaceToken') && $es4.$$get(methodConstruct, $$this, $$thisp, 'namespaceToken', 'data') == 'private')
					{
						continue;
					}
					if (firstIteration || !$es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [methodConstruct, namespace, true]))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [methodConstruct, construct]);
					}
				}
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', 'length'); i++)
				{
					var propertyConstruct = $es4.$$get(construct, $$this, $$thisp, 'propertyConstructs', i);
					if (Boolean($es4.$$get(propertyConstruct, $$this, $$thisp, 'staticToken')) != isClassLevel && !$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceKeywordToken'))
					{
						continue;
					}
					if (!firstIteration && !$es4.$$call($$thisp, $$this, $$thisp, 'hasNamespace', [$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken')]))
					{
						continue;
					}
					var namespace = $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken')]);
					if ($es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [propertyConstruct, namespace]))
					{
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [propertyConstruct, namespace]);
						if (!$es4.$$get(identifier, $$this, $$thisp, 'isGlobal') && !$es4.$$get(identifier, $$this, $$thisp, 'isStatic'))
						{
							continue;
						}
					}
					if (!firstIteration && $es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken') && $es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken', 'data') == 'private')
					{
						continue;
					}
					if (firstIteration || !$es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [propertyConstruct, namespace, true]))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [propertyConstruct, construct]);
					}
				}
				if (!$es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct'))
				{
					break;
				}
				firstIteration = false;
				var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, $es4.$$get(construct, $$this, $$thisp, 'extendsNameConstruct')]);
				construct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(construct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
			}
		}));

		//method
		$es4.$$private_function('analyzeParameters', $$thisp, (function ($$$$methodConstruct, $$$$construct)
		{
			//set default parameter values
			var methodConstruct = $$$$methodConstruct;
			var construct = $$$$construct;

			for (var i = 0; i < $es4.$$get(methodConstruct, $$this, $$thisp, 'parameterConstructs', 'length'); i++)
			{
				var parameterConstruct = $es4.$$get(methodConstruct, $$this, $$thisp, 'parameterConstructs', i);
				$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [parameterConstruct, construct]);
				var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(parameterConstruct, $$this, $$thisp, 'identifierToken', 'data')]);
				$es4.$$set(identifier, $$this, $$thisp, 'type', 'accessed', true, '=');
				$es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', true, '=');
				$es4.$$set(parameterConstruct, $$this, $$thisp, 'identifier', identifier, '=');
				if ($es4.$$get(parameterConstruct, $$this, $$thisp, 'valueExpression'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(parameterConstruct, $$this, $$thisp, 'valueExpression'), 0, false, construct]);
				}
			}
		}));

		//method
		$es4.$$private_function('analyzeStatements', $$thisp, (function ($$$$statements, $$$$indent, $$$$construct)
		{
			//set default parameter values
			var statements = $$$$statements;
			var indent = $$$$indent;
			var construct = $$$$construct;

			for (var i = 0; i < $es4.$$get(statements, $$this, $$thisp, 'length'); i++)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statements, $$this, $$thisp, i), indent + 1, false, construct]);
			}
		}));

		//method
		$es4.$$private_function('analyzeStatement', $$thisp, (function ($$$$statement, $$$$_indent, $$$$inline, $$$$construct)
		{
			//set default parameter values
			var statement = $$$$statement;
			var _indent = $$$$_indent;
			var inline = $$$$inline;
			var construct = $$$$construct;

			if (!construct)
			{
				throw $es4.$$primitive(new (Error)('construct null in analyze statement'));
			}
			switch ($es4.$$get(statement, $$this, $$thisp, 'constructor'))
			{
				case $es4.$$get(Construct, $$this, $$thisp, 'EmptyStatement'):
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'IfStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'conditionExpression'), _indent, false, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					for (var i = 0; i < $es4.$$get(statement, $$this, $$thisp, 'elseIfStatements', 'length'); i++)
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'elseIfStatements', i), _indent, false, construct]);
					}
					if ($es4.$$get(statement, $$this, $$thisp, 'elseStatement'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'elseStatement'), _indent, false, construct]);
					}
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ElseIfStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'conditionExpression'), _indent, false, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ElseStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'WhileStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'conditionExpression'), _indent, false, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'DoWhileStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'conditionExpression'), _indent, false, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ForStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					if ($es4.$$get(statement, $$this, $$thisp, 'variableStatement'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'variableStatement'), 0, true, construct]);
					}
					if ($es4.$$get(statement, $$this, $$thisp, 'conditionExpression'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'conditionExpression'), _indent, false, construct]);
					}
					if ($es4.$$get(statement, $$this, $$thisp, 'afterthoughtExpression'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'afterthoughtExpression'), _indent, false, construct]);
					}
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ForEachStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_count', 'postfix', '++');
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$set(statement, $$this, $$thisp, 'index', $es4.$$get($$thisp, $$this, $$thisp, '_count'), '=');
					$es4.$$set(statement, $$this, $$thisp, 'variableStatement', 'doNotSetDefaultValue', true, '=');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'variableStatement'), 0, true, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'arrayExpression'), _indent, false, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ForInStatement'):
					$es4.$$set($$thisp, $$this, $$thisp, '_count', 'postfix', '++');
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '++');
					$es4.$$set(statement, $$this, $$thisp, 'index', $es4.$$get($$thisp, $$this, $$thisp, '_count'), '=');
					$es4.$$set(statement, $$this, $$thisp, 'variableStatement', 'doNotSetDefaultValue', true, '=');
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'variableStatement'), 0, true, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'objectExpression'), _indent, false, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$set($$thisp, $$this, $$thisp, '_inIfStatement', 'postfix', '--');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'BreakStatement'):
					if ($es4.$$get(statement, $$this, $$thisp, 'identifierToken'))
					{
						$es4.$$set(statement, $$this, $$thisp, 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(statement, $$this, $$thisp, 'identifierToken', 'data')]), '=');
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ContinueStatement'):
					if ($es4.$$get(statement, $$this, $$thisp, 'identifierToken'))
					{
						$es4.$$set(statement, $$this, $$thisp, 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(statement, $$this, $$thisp, 'identifierToken', 'data')]), '=');
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ThrowStatement'):
					if ($es4.$$get(statement, $$this, $$thisp, 'expression'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'expression'), _indent, false, construct]);
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'TryStatement'):
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					for (var i = 0; i < $es4.$$get(statement, $$this, $$thisp, 'catchStatements', 'length'); i++)
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
						var catchStatement = $es4.$$get(statement, $$this, $$thisp, 'catchStatements', i);
						$es4.$$set($$thisp, $$this, $$thisp, '_count', 'postfix', '++');
						$es4.$$set(catchStatement, $$this, $$thisp, 'index', $es4.$$get($$thisp, $$this, $$thisp, '_count'), '=');
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [catchStatement, construct]);
						$es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', true, '=');
						$es4.$$set(catchStatement, $$this, $$thisp, 'identifier', identifier, '=');
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(catchStatement, $$this, $$thisp, 'bodyStatements'), _indent + 2, construct]);
						$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
					}
					if ($es4.$$get(statement, $$this, $$thisp, 'finallyStatement'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'finallyStatement', 'bodyStatements'), _indent + 1, construct]);
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'UseStatement'):
					$es4.$$call($$thisp, $$this, $$thisp, 'registerUseNamespace', [statement]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'VarStatement'):
					for (var i = 0; i < $es4.$$get(statement, $$this, $$thisp, 'innerVarStatements', 'length'); i++)
					{
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(statement, $$this, $$thisp, 'innerVarStatements', i), construct]);
						$es4.$$set(statement, $$this, $$thisp, 'innerVarStatements', i, 'identifier', identifier, '=');
					}
					var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [statement, construct]);
					$es4.$$set(statement, $$this, $$thisp, 'identifier', identifier, '=');
					if (!$es4.$$get(statement, $$this, $$thisp, 'valueExpression') && $es4.$$get(statement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName') != '*' && $es4.$$get(statement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName') != 'void' && !$es4.$$get(statement, $$this, $$thisp, 'doNotSetDefaultValue'))
					{
						switch ($es4.$$get(statement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName'))
						{
							case 'Number':
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NaNTokenType'), 'NaN'])]), '=');
								break;
							case 'uint':
							case 'int':
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewNumberExpression', $es4.$$EMPTY_ARRAY), '=');
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', 'numberToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NumberTokenType'), '0']), '=');
								break;
							case 'Boolean':
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewBooleanExpression', $es4.$$EMPTY_ARRAY), '=');
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', 'booleanToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'BooleanTokenType'), 'false']), '=');
								break;
							default:
								$es4.$$set(statement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NullTokenType'), 'null'])]), '=');
						}
					}
					if ($es4.$$get(statement, $$this, $$thisp, 'valueExpression'))
					{
						var expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'valueExpression'), _indent, false, construct]);
						if ($es4.$$call($$thisp, $$this, $$thisp, 'isCoerceRequired', [expressionResult, $es4.$$get(statement, $$this, $$thisp, 'identifier', 'type'), $es4.$$get(statement, $$this, $$thisp, 'identifier')]))
						{
							$es4.$$set(statement, $$this, $$thisp, 'coerce', true, '=');
						}
					}
					$es4.$$set(statement, $$this, $$thisp, 'identifier', 'isVarInitialized', true, '=');
					for (var i = 0; i < $es4.$$get(statement, $$this, $$thisp, 'innerVarStatements', 'length'); i++)
					{
						var innerVarStatement = $es4.$$get(statement, $$this, $$thisp, 'innerVarStatements', i);
						if (!$es4.$$get(innerVarStatement, $$this, $$thisp, 'valueExpression') && $es4.$$get(innerVarStatement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName') != '*' && $es4.$$get(innerVarStatement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName') != 'void')
						{
							switch ($es4.$$get(innerVarStatement, $$this, $$thisp, 'identifier', 'type', 'fullyQualifiedName'))
							{
								case 'Number':
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NaNTokenType'), 'NaN'])]), '=');
									break;
								case 'uint':
								case 'int':
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewNumberExpression', $es4.$$EMPTY_ARRAY), '=');
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', 'numberToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NumberTokenType'), '0']), '=');
									break;
								case 'Boolean':
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewBooleanExpression', $es4.$$EMPTY_ARRAY), '=');
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', 'booleanToken', $es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'BooleanTokenType'), 'false']), '=');
									break;
								default:
									$es4.$$set(innerVarStatement, $$this, $$thisp, 'valueExpression', $es4.$$call(Construct, $$this, $$thisp, 'getNewExpression', [$es4.$$call(Token, $$this, $$thisp, 'getNewToken', [$es4.$$get(Token, $$this, $$thisp, 'NullTokenType'), 'null'])]), '=');
							}
						}
						if ($es4.$$get(innerVarStatement, $$this, $$thisp, 'valueExpression'))
						{
							expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(innerVarStatement, $$this, $$thisp, 'valueExpression'), _indent, false, construct]);
							if ($es4.$$call($$thisp, $$this, $$thisp, 'isCoerceRequired', [expressionResult, $es4.$$get(innerVarStatement, $$this, $$thisp, 'identifier', 'type'), $es4.$$get(innerVarStatement, $$this, $$thisp, 'identifier')]))
							{
								$es4.$$set(innerVarStatement, $$this, $$thisp, 'coerce', true, '=');
							}
						}
						$es4.$$set(innerVarStatement, $$this, $$thisp, 'identifier', 'isVarInitialized', true, '=');
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'SwitchStatement'):
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'valueExpression'), _indent, false, construct]);
					for (var i = 0; i < $es4.$$get(statement, $$this, $$thisp, 'caseStatements', 'length'); i++)
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatement', [$es4.$$get(statement, $$this, $$thisp, 'caseStatements', i), _indent + 1, false, construct]);
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'CaseStatement'):
					if (!$es4.$$get(statement, $$this, $$thisp, 'defaultToken'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(statement, $$this, $$thisp, 'valueExpression'), _indent, false, construct]);
					}
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(statement, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'LabelStatement'):
					var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [statement, construct]);
					$es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', true, '=');
					$es4.$$set(statement, $$this, $$thisp, 'identifier', identifier, '=');
					break;
				default:
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [statement, _indent, false, construct]);
			}
		}));

		//method
		$es4.$$private_function('analyzeExpression', $$thisp, (function ($$$$expression, $$$$_indent, $$$$toString, $$$$construct, $$$$operator, $$$$expressionString)
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
				throw $es4.$$primitive(new (Error)('construct null in analyze expression'));
			}
			var expressionResult = $es4.$$primitive(new (ExpressionResult)(null, false, false, false, false));
			outerSwitch:			switch ($es4.$$get(expression, $$this, $$thisp, 'constructor'))
			{
				case $es4.$$get(Construct, $$this, $$thisp, 'ParenExpression'):
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), _indent, toString, construct, operator, expressionString]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'PropertyExpression'):
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzePropertyExpression', [expression, toString, construct]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'NumberExpression'):
					if ($es4.$$get(expression, $$this, $$thisp, 'numberToken', 'data') == $es4.$$primitive(new (Number)(parseFloat($es4.$$get(expression, $$this, $$thisp, 'numberToken', 'data')) >> 0)))
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['int']), '=');
					}
					else if ($es4.$$get(expression, $$this, $$thisp, 'numberToken', 'data') == $es4.$$primitive(new (Number)(parseFloat($es4.$$get(expression, $$this, $$thisp, 'numberToken', 'data')) >>> 0)))
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['uint']), '=');
					}
					else
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Number']), '=');
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'StringExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['String']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ReturnExpression'):
					if ($es4.$$get(expression, $$this, $$thisp, 'expression'))
					{
						$es4.$$set(expression, $$this, $$thisp, 'expectedType', $es4.$$get($$thisp, $$this, $$thisp, '_returnTypeStack', $es4.$$get($$thisp, $$this, $$thisp, '_returnTypeStack', 'length') - 1), '=');
						expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
						$es4.$$set(expression, $$this, $$thisp, 'coerce', $es4.$$call($$thisp, $$this, $$thisp, 'isCoerceRequired', [expressionResult, $es4.$$get(expression, $$this, $$thisp, 'expectedType')]), '=');
					}
					else
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void']), '=');
					}
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'DeleteExpression'):
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'FunctionExpression'):
					var wasInClosure = $es4.$$get($$thisp, $$this, $$thisp, '_inClosure');
					$es4.$$set($$thisp, $$this, $$thisp, '_inClosure', true, '=');
					if ($es4.$$get(expression, $$this, $$thisp, 'identifierToken'))
					{
						if ($es4.$$get($$thisp, $$this, $$thisp, '_inIfStatement'))
						{
							throw $es4.$$primitive(new (Error)('support for named closures in if/elseif/else statements is not supported at this time. function name: ' + $es4.$$get(expression, $$this, $$thisp, 'identifierToken', 'data')));
						}
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [expression, construct]);
						$es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', true, '=');
						$es4.$$set(expression, $$this, $$thisp, 'identifier', identifier, '=');
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$get(identifier, $$this, $$thisp, 'type'), '=');
					}
					else
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(expression, $$this, $$thisp, 'typeConstruct')]), '=');
					}
					for (var i = 0; i < $es4.$$get(expression, $$this, $$thisp, 'namedFunctionExpressions', 'length'); i++)
					{
						var identifier = $es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', [$es4.$$get(expression, $$this, $$thisp, 'namedFunctionExpressions', i), construct]);
						$es4.$$set(identifier, $$this, $$thisp, 'isVarInitialized', true, '=');
						$es4.$$set(expression, $$this, $$thisp, 'namedFunctionExpressions', i, 'identifier', identifier, '=');
						$es4.$$set(expression, $$this, $$thisp, 'namedFunctionExpressions', i, 'type', $es4.$$get(identifier, $$this, $$thisp, 'type'), '=');
					}
					$es4.$$call($$thisp, $$this, $$thisp, 'upLevel', $es4.$$EMPTY_ARRAY);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeParameters', [expression, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, 'registerIdentifier', ['this', construct]);
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'push', [$es4.$$get(expressionResult, $$this, $$thisp, 'type')]);
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeStatements', [$es4.$$get(expression, $$this, $$thisp, 'bodyStatements'), _indent + 1, construct]);
					$es4.$$call($$thisp, $$this, $$thisp, '_returnTypeStack', 'pop', $es4.$$EMPTY_ARRAY);
					if (!wasInClosure)
					{
						$es4.$$set($$thisp, $$this, $$thisp, '_inClosure', false, '=');
					}
					$es4.$$call($$thisp, $$this, $$thisp, 'downLevel', $es4.$$EMPTY_ARRAY);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ObjectExpression'):
					for (var i = 0; i < $es4.$$get(expression, $$this, $$thisp, 'objectPropertyConstructs', 'length'); i++)
					{
						if ($es4.$$get(expression, $$this, $$thisp, 'objectPropertyConstructs', i, 'expression', 'constructor') != $es4.$$get(Construct, $$this, $$thisp, 'PropertyExpression'))
						{
							$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'objectPropertyConstructs', i, 'expression'), 0, toString, construct]);
						}
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'objectPropertyConstructs', i, 'valueExpression'), 0, toString, construct]);
					}
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ArrayExpression'):
					for (var i = 0; i < $es4.$$get(expression, $$this, $$thisp, 'valueExpressions', 'length'); i++)
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'valueExpressions', i), 0, toString, construct]);
					}
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Array']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'BooleanExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Boolean']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'Expression'):
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'TypeofTokenType'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['String']), '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'VoidTokenType'))
					{
						if ($es4.$$get(expression, $$this, $$thisp, 'expression', 'constructor') != $es4.$$get(Construct, $$this, $$thisp, 'EmptyExpression'))
						{
							$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
						}
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void']), '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'NaNTokenType'))
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'isNaN', true, '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'UndefinedTokenType'))
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'isUndefined', true, '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'NullTokenType'))
					{
						$es4.$$set(expressionResult, $$this, $$thisp, 'isNull', true, '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'expression'))
					{
						expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
						break;
					}
					throw $es4.$$primitive(new (Error)('unhandled expression type'));
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'XMLExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['XML']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'XMLListExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['XMLList']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'EmptyExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'RegExpression'):
					$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['RegExp']), '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'PrefixExpression'):
				case $es4.$$get(Construct, $$this, $$thisp, 'PostfixExpression'):
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), 0, toString, construct]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'NewExpression'):
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzePropertyExpression', [$es4.$$get(expression, $$this, $$thisp, 'expression'), toString, construct, true]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'BinaryExpression'):
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'IsTokenType'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'leftExpression'), 0, toString, construct]);
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct]);
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Boolean']), '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'InstanceofTokenType'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'leftExpression'), 0, toString, construct]);
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct]);
						$es4.$$set(expressionResult, $$this, $$thisp, 'type', $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Boolean']), '=');
						break;
					}
					if ($es4.$$get(expression, $$this, $$thisp, 'token', 'type') == $es4.$$get(Token, $$this, $$thisp, 'AsTokenType'))
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'leftExpression'), 0, toString, construct]);
						expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct]);
						break;
					}
					innerSwitch:					switch ($es4.$$get(expression, $$this, $$thisp, 'token', 'type'))
					{
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseLeftShiftAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseUnsignedRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'AddWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'DivWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'ModWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'MulWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'SubWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'AssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'AndWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'OrWithAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseAndAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseOrAssignmentTokenType'):
						case $es4.$$get(Token, $$this, $$thisp, 'BitwiseXorAssignmentTokenType'):
							var leftExpression = $es4.$$get(expression, $$this, $$thisp, 'leftExpression');
							while ($es4.$$get(leftExpression, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ParenExpression'))
							{
								leftExpression = $es4.$$get(leftExpression, $$this, $$thisp, 'expression');
							}
							var innerOperator = $es4.$$get(expression, $$this, $$thisp, 'token', 'data');
							var innerExpressionFound = false;
							var expressionResult;
							while ($es4.$$get(leftExpression, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'BinaryExpression'))
							{
								var binaryExpression = $es4.$$call(Construct, $$this, $$thisp, 'getNewBinaryExpression', $es4.$$EMPTY_ARRAY);
								$es4.$$set(binaryExpression, $$this, $$thisp, 'token', $es4.$$get(expression, $$this, $$thisp, 'token'), '=');
								$es4.$$set(binaryExpression, $$this, $$thisp, 'rightExpression', $es4.$$get(expression, $$this, $$thisp, 'rightExpression'), '=');
								$es4.$$set(binaryExpression, $$this, $$thisp, 'leftExpression', $es4.$$get(leftExpression, $$this, $$thisp, 'rightExpression'), '=');
								if (!innerExpressionFound)
								{
									expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [binaryExpression, _indent, toString, construct]);
								}
								else
								{
									expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonExpressionResult', [expressionResult, $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(binaryExpression, $$this, $$thisp, 'leftExpression'), _indent, toString, construct])]);
								}
								innerExpressionFound = true;
								expression = leftExpression;
								leftExpression = $es4.$$get(expression, $$this, $$thisp, 'leftExpression');
							}
							var leftExpressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [leftExpression, 0, toString, construct]);
							var rightExpressionResult;
							if (innerExpressionFound)
							{
								rightExpressionResult = expressionResult;
							}
							else
							{
								rightExpressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct]);
							}
							expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonExpressionResult', [leftExpressionResult, rightExpressionResult]);
							if ($es4.$$call($$thisp, $$this, $$thisp, 'isCoerceRequired', [expressionResult, $es4.$$get(leftExpressionResult, $$this, $$thisp, 'type'), $es4.$$get(leftExpressionResult, $$this, $$thisp, 'varIdentifier')]))
							{
								$es4.$$set(leftExpression, $$this, $$thisp, 'coerce', true, '=');
							}
							if ($es4.$$get(leftExpressionResult, $$this, $$thisp, 'varIdentifier'))
							{
								$es4.$$set(leftExpressionResult, $$this, $$thisp, 'varIdentifier', 'isVarInitialized', true, '=');
							}
							break outerSwitch;
						case $es4.$$get(Token, $$this, $$thisp, 'AddTokenType'):
							var leftExpressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'leftExpression'), 0, toString, construct]);
							var rightExpressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct]);
							if ($es4.$$get(leftExpressionResult, $$this, $$thisp, 'type') && $es4.$$get(leftExpressionResult, $$this, $$thisp, 'type', 'fullyQualifiedName') == 'String')
							{
								expressionResult = leftExpressionResult;
							}
							else if ($es4.$$get(rightExpressionResult, $$this, $$thisp, 'type') && $es4.$$get(rightExpressionResult, $$this, $$thisp, 'type', 'fullyQualifiedName') == 'String')
							{
								expressionResult = rightExpressionResult;
							}
							else
							{
								expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonExpressionResult', [leftExpressionResult, rightExpressionResult]);
							}
							break outerSwitch;
					}
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonExpressionResult', [$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'leftExpression'), 0, toString, construct]), $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'rightExpression'), 0, toString, construct])]);
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'TernaryExpression'):
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'conditionExpression'), 0, toString, construct]);
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonExpressionResult', [$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'trueExpression'), 0, toString, construct]), $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(expression, $$this, $$thisp, 'falseExpression'), 0, toString, construct])]);
					break;
				default:
					throw $es4.$$primitive(new (Error)('Unexpected expression found: ' + $es4.$$get(expression, $$this, $$thisp, 'constructor')));
			}
			return expressionResult;
		}));

		//method
		$es4.$$private_function('isCoerceRequired', $$thisp, (function ($$$$expressionResultFrom, $$$$typeTo, $$$$varIdentifierTo)
		{
			//set default parameter values
			var expressionResultFrom = $$$$expressionResultFrom;
			var typeTo = $$$$typeTo;
			var varIdentifierTo = (2 > arguments.length - 1) ? null : $$$$varIdentifierTo;

			if ($es4.$$get(expressionResultFrom, $$this, $$thisp, 'varIdentifier') && !$es4.$$get(expressionResultFrom, $$this, $$thisp, 'varIdentifier', 'isVarInitialized'))
			{
				throw $es4.$$primitive(new (Error)('cannot declare and set var: [ ' + $es4.$$get(expressionResultFrom, $$this, $$thisp, 'varIdentifier') + ' ] in same line, example: var i:uint = i;'));
			}
			if ($es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == '*' || $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'void')
			{
				return false;
			}
			if ($es4.$$get(expressionResultFrom, $$this, $$thisp, 'isNull'))
			{
				return ($es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'Boolean' || $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'int' || $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'uint' || $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'Number');
			}
			if ($es4.$$get(expressionResultFrom, $$this, $$thisp, 'isUndefined') || $es4.$$get(expressionResultFrom, $$this, $$thisp, 'isVoid'))
			{
				return true;
			}
			if ($es4.$$get(expressionResultFrom, $$this, $$thisp, 'isNaN'))
			{
				return ($es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') != 'Number');
			}
			if ($es4.$$get(expressionResultFrom, $$this, $$thisp, 'type') == typeTo || $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(expressionResultFrom, $$this, $$thisp, 'type', 'fullyQualifiedName'))
			{
				return false;
			}
			if ($es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName') == 'Object')
			{
				return false;
			}
			var greatestCommonType = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonType', [$es4.$$get(expressionResultFrom, $$this, $$thisp, 'type'), typeTo]);
			if (greatestCommonType == typeTo || $es4.$$get(greatestCommonType, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(typeTo, $$this, $$thisp, 'fullyQualifiedName'))
			{
				return false;
			}
			return true;
		}));

		//method
		$es4.$$private_function('getGreatestCommonExpressionResult', $$thisp, (function ($$$$expressionResult1, $$$$expressionResult2)
		{
			//set default parameter values
			var expressionResult1 = $$$$expressionResult1;
			var expressionResult2 = $$$$expressionResult2;

			var defaultExpressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']), false, false, false, false));
			if (expressionResult1 == expressionResult2)
			{
				return expressionResult2;
			}
			if ($es4.$$get(expressionResult1, $$this, $$thisp, 'isNull') || $es4.$$get(expressionResult2, $$this, $$thisp, 'isNull'))
			{
				return ($es4.$$get(expressionResult1, $$this, $$thisp, 'isNull') && $es4.$$get(expressionResult2, $$this, $$thisp, 'isNull')) ? expressionResult2 : defaultExpressionResult;
			}
			if ($es4.$$get(expressionResult1, $$this, $$thisp, 'isUndefined') || $es4.$$get(expressionResult2, $$this, $$thisp, 'isUndefined'))
			{
				return ($es4.$$get(expressionResult1, $$this, $$thisp, 'isUndefined') && $es4.$$get(expressionResult2, $$this, $$thisp, 'isUndefined')) ? expressionResult2 : defaultExpressionResult;
			}
			if ($es4.$$get(expressionResult1, $$this, $$thisp, 'isNaN') || $es4.$$get(expressionResult2, $$this, $$thisp, 'isNaN'))
			{
				return ($es4.$$get(expressionResult1, $$this, $$thisp, 'isNaN') && $es4.$$get(expressionResult2, $$this, $$thisp, 'isNaN')) ? expressionResult2 : defaultExpressionResult;
			}
			var type = $es4.$$call($$thisp, $$this, $$thisp, 'getGreatestCommonType', [$es4.$$get(expressionResult1, $$this, $$thisp, 'type'), $es4.$$get(expressionResult2, $$this, $$thisp, 'type')]);
			return $es4.$$primitive(new (ExpressionResult)(type, false, false, false, false));
		}));

		//method
		$es4.$$private_function('getGreatestCommonType', $$thisp, (function ($$$$type1, $$$$type2)
		{
			//set default parameter values
			var type1 = $$$$type1;
			var type2 = $$$$type2;

			if (type1 == type2 || $es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName'))
			{
				return type2;
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == '*' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == '*')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'void' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'void')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'String' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'String')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Function' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Function')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Class' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Class')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Boolean' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Boolean')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Array' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Array')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'uint' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'uint')
			{
				if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName'))
				{
					return type2;
				}
				if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Number')
				{
					return type1;
				}
				if ($es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Number')
				{
					return type2;
				}
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'int' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'int')
			{
				if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName'))
				{
					return type2;
				}
				if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Number')
				{
					return type1;
				}
				if ($es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Number')
				{
					return type2;
				}
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			if ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == 'Number' || $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName') == 'Number')
			{
				return ($es4.$$get(type1, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get(type2, $$this, $$thisp, 'fullyQualifiedName')) ? type2 : $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			var typea = checkForType(type1, type2);
			var typeb = checkForType(type2, type1);
			return ($es4.$$get(typea, $$this, $$thisp, 'fullyQualifiedName') == $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']), $$this, $$thisp, 'fullyQualifiedName')) ? typeb : typea;

			function checkForType($$$$type, $$$$typeToCheckFor) 
			{
				//set default parameter values
				var type = $$$$type;
				var typeToCheckFor = $$$$typeToCheckFor;

				var visitedInterfaces = {};
				var typeConstruct = $es4.$$get(type, $$this, $$thisp, 'construct');
				var typeToCheckForConstruct = $es4.$$get(typeToCheckFor, $$this, $$thisp, 'construct');
				if ($es4.$$get(typeConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct'))
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
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);

				function hasConstructInInterface($$$$interfaceConstruct, $$$$constructToCheckFor) 
				{
					//set default parameter values
					var interfaceConstruct = $$$$interfaceConstruct;
					var constructToCheckFor = $$$$constructToCheckFor;

					if (interfaceConstruct == constructToCheckFor)
					{
						return true;
					}
					if ($es4.$$get(constructToCheckFor, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct'))
					{
						var extendsNameConstructs = $es4.$$get(interfaceConstruct, $$this, $$thisp, 'extendsNameConstructs');
						for (var i = $es4.$$get(extendsNameConstructs, $$this, $$thisp, 'length'); i--;)
						{
							if ($es4.$$get(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(extendsNameConstructs, $$this, $$thisp, i)])))
							{
								continue;
							}
							$es4.$$set(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(extendsNameConstructs, $$this, $$thisp, i)]), true, '=');
							var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [interfaceConstruct, $es4.$$get(extendsNameConstructs, $$this, $$thisp, i)]);
							var innerConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(interfaceConstruct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
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
					if ($es4.$$get(constructToCheckFor, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct'))
					{
						var implementsNameConstructs = $es4.$$get(classConstruct, $$this, $$thisp, 'implementsNameConstructs');
						for (var i = $es4.$$get(implementsNameConstructs, $$this, $$thisp, 'length'); i--;)
						{
							if ($es4.$$get(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(implementsNameConstructs, $$this, $$thisp, i)])))
							{
								continue;
							}
							$es4.$$set(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(implementsNameConstructs, $$this, $$thisp, i)]), true, '=');
							var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [classConstruct, $es4.$$get(implementsNameConstructs, $$this, $$thisp, i)]);
							var innerConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(classConstruct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
							var result = hasConstructInInterface(constructToCheckFor, innerConstruct);
							if (result)
							{
								return true;
							}
						}
					}
					var extendsNameConstruct;
					while (extendsNameConstruct = $es4.$$get(classConstruct, $$this, $$thisp, 'extendsNameConstruct'))
					{
						var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [classConstruct, extendsNameConstruct]);
						var extendsConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(classConstruct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
						if (extendsConstruct == constructToCheckFor)
						{
							return true;
						}
						if ($es4.$$get(constructToCheckFor, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct'))
						{
							var implementsNameConstructs = $es4.$$get(extendsConstruct, $$this, $$thisp, 'implementsNameConstructs');
							for (var i = $es4.$$get(implementsNameConstructs, $$this, $$thisp, 'length'); i--;)
							{
								if ($es4.$$get(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(implementsNameConstructs, $$this, $$thisp, i)])))
								{
									continue;
								}
								$es4.$$set(visitedInterfaces, $$this, $$thisp, $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(implementsNameConstructs, $$this, $$thisp, i)]), true, '=');
								var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [extendsConstruct, $es4.$$get(implementsNameConstructs, $$this, $$thisp, i)]);
								var innerConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(extendsConstruct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
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
		}));

		//method
		$es4.$$private_function('analyzePropertyExpression', $$thisp, (function ($$$$expression, $$$$toString, $$$$construct, $$$$isNew)
		{
			//set default parameter values
			var expression = $$$$expression;
			var toString = $$$$toString;
			var construct = $$$$construct;
			var isNew = (3 > arguments.length - 1) ? false : $$$$isNew;

			var innerExpression = expression;
			while ($es4.$$get(innerExpression, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ParenExpression'))
			{
				innerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'expression');
			}
			if (!$es4.$$get(innerExpression, $$this, $$thisp, 'construct'))
			{
				throw $es4.$$primitive(new (Error)('invalid expression passed to analyzePropertyExpression: ' + $es4.$$get(innerExpression, $$this, $$thisp, 'constructor')));
			}
			var identifier;
			var namespaceIdentifier;
			var thisConstruct = false;
			switch ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor'))
			{
				case $es4.$$get(Construct, $$this, $$thisp, 'ThisConstruct'):
					thisConstruct = true;
				case $es4.$$get(Construct, $$this, $$thisp, 'SuperConstruct'):
				case $es4.$$get(Construct, $$this, $$thisp, 'IdentifierConstruct'):
					identifier = $es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct')]), '=');
					$es4.$$set(identifier, $$this, $$thisp, 'accessed', true, '=');
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'ParenConstruct'):
				case $es4.$$get(Construct, $$this, $$thisp, 'ArrayConstruct'):
				case $es4.$$get(Construct, $$this, $$thisp, 'ObjectConstruct'):
					break;
				case $es4.$$get(Construct, $$this, $$thisp, 'NamespaceQualifierConstruct'):
					namespaceIdentifier = $es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'namespaceIdentifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')]), '=');
					$es4.$$set(namespaceIdentifier, $$this, $$thisp, 'accessed', true, '=');
					identifier = $es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'namespaceIdentifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(namespaceIdentifier, $$this, $$thisp, 'name')])]), '=');
					$es4.$$set(identifier, $$this, $$thisp, 'accessed', true, '=');
					break;
				default:
					throw $es4.$$primitive(new (Error)('unknown inner property expression: ' + $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor')));
			}
			if (identifier && !namespaceIdentifier && ($es4.$$get(identifier, $$this, $$thisp, 'isProperty') || $es4.$$get(identifier, $$this, $$thisp, 'isMethod')) && !$es4.$$get(identifier, $$this, $$thisp, 'isImport') && $es4.$$get(identifier, $$this, $$thisp, 'namespaceObj', 'isCustom'))
			{
				namespaceIdentifier = $es4.$$get(identifier, $$this, $$thisp, 'namespaceObj', 'identifier');
			}
			else if (identifier && $es4.$$get(identifier, $$this, $$thisp, 'isPackage'))
			{
				var tempInnerExpression;
				while ((tempInnerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression')) && $es4.$$get(tempInnerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'DotConstruct'))
				{
					if (!$es4.$$get(tempInnerExpression, $$this, $$thisp, 'nextPropertyExpression') || $es4.$$get(tempInnerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'construct') != $es4.$$get(Construct, $$this, $$thisp, 'IdentifierConstruct'))
					{
						break;
					}
					var innerIdentifier = $es4.$$set(tempInnerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(tempInnerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'construct', 'identifierToken', 'data')]), '=');
					if (!$es4.$$get(innerIdentifier, $$this, $$thisp, 'isPackage'))
					{
						break;
					}
					innerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression');
				}
			}
			var expressionResult;
			var lastPropertyName;
			var lastExpressionResult;
			var lastIdentifier;
			var packageName = '';
			if (identifier)
			{
				if (!$es4.$$get(identifier, $$this, $$thisp, 'isVar'))
				{
					expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$get(identifier, $$this, $$thisp, 'type'), false, false, false, false));
				}
				else
				{
					expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$get(identifier, $$this, $$thisp, 'type'), false, false, false, false, identifier));
				}
				lastPropertyName = $es4.$$get(identifier, $$this, $$thisp, 'name');
				$es4.$$set(innerExpression, $$this, $$thisp, 'identifier', identifier, '=');
				lastExpressionResult = expressionResult;
				lastIdentifier = identifier;
				if ($es4.$$get(identifier, $$this, $$thisp, 'isPackage'))
				{
					packageName += $es4.$$get(identifier, $$this, $$thisp, 'name');
				}
				if (!$es4.$$get(identifier, $$this, $$thisp, 'isType'))
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
				expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'expression'), 0, toString, construct]);
			}
			while (innerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression'))
			{
				if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'DotConstruct') || $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'IdentifierConstruct'))
				{
					if (lastIdentifier && $es4.$$get(lastIdentifier, $$this, $$thisp, 'name') == 'this')
					{
						if ($es4.$$get($$thisp, $$this, $$thisp, '_treatThisAsDynamic'))
						{
							$es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', ['global']), '=');
						}
						else
						{
							$es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')]), '=');
						}
					}
					lastExpressionResult = expressionResult;
					lastIdentifier = identifier;
					if (thisConstruct && $es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')]) && $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')]), $$this, $$thisp, 'isNative'))
					{
						throw $es4.$$primitive(new (Error)('cannot use "this" or classname scope before private native property: ' + $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')));
					}
					thisConstruct = false;
					var invalidated = false;
					if (packageName)
					{
						packageName += '.' + $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data');
						if ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', packageName))
						{
							lastExpressionResult = expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [packageName]), false, false, false, false));
							lastIdentifier = $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [packageName]);
							identifier = null;
							packageName = '';
							if ($es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression') && $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'constructor') != $es4.$$get(Construct, $$this, $$thisp, 'FunctionCallConstruct'))
							{
								identifier = lastIdentifier;
								innerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression');
							}
						}
						else
						{
							invalidated = true;
						}
					}
					if (!invalidated)
					{
						var next = ($es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression') && $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'FunctionCallConstruct') && !isNew);
						expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupPropertyType', [$es4.$$get(expressionResult, $$this, $$thisp, 'type'), namespaceIdentifier, identifier, $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data'), next]), false, false, false, false));
						identifier = null;
						namespaceIdentifier = null;
						lastPropertyName = $es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data');
						if (next)
						{
							var functionCallExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression');
							for (var i = 0; i < $es4.$$get(functionCallExpression, $$this, $$thisp, 'construct', 'argumentExpressions', 'length'); i++)
							{
								$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(functionCallExpression, $$this, $$thisp, 'construct', 'argumentExpressions', i), 0, toString, construct]);
							}
							innerExpression = $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression');
							continue;
						}
					}
				}
				else if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ArrayAccessorConstruct'))
				{
					$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'expression'), 0, toString, construct]);
					expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']), false, false, false, false));
					identifier = null;
					namespaceIdentifier = null;
					lastPropertyName = null;
				}
				else if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NamespaceQualifierConstruct'))
				{
					namespaceIdentifier = $es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'namespaceIdentifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'identifierToken', 'data')]), '=');
					$es4.$$set(innerExpression, $$this, $$thisp, 'construct', 'identifier', $es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'namespaceIdentifierToken', 'data'), $es4.$$call($$thisp, $$this, $$thisp, 'lookupNamespace', [$es4.$$get(namespaceIdentifier, $$this, $$thisp, 'name')])]), '=');
				}
				else if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ParenConstruct'))
				{
					expressionResult = $es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'expression'), 0, toString, construct]);
					namespaceIdentifier = null;
					identifier = null;
					lastPropertyName = null;
				}
				else if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'AtIdentifierConstruct'))
				{
					expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), false, false, false, false));
				}
				if ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'FunctionCallConstruct') || ($es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression') && $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'FunctionCallConstruct')))
				{
					var functionCallExpression = ($es4.$$get(innerExpression, $$this, $$thisp, 'construct', 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'FunctionCallConstruct')) ? innerExpression : $es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression');
					for (var i = 0; i < $es4.$$get(functionCallExpression, $$this, $$thisp, 'construct', 'argumentExpressions', 'length'); i++)
					{
						$es4.$$call($$thisp, $$this, $$thisp, 'analyzeExpression', [$es4.$$get(functionCallExpression, $$this, $$thisp, 'construct', 'argumentExpressions', i), 0, toString, construct]);
					}
					if (isNew)
					{
						if (lastPropertyName)
						{
							if (lastIdentifier && $es4.$$get(lastIdentifier, $$this, $$thisp, 'isType'))
							{
								expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$get(lastIdentifier, $$this, $$thisp, 'fullPackageName')]), false, false, false, false));
							}
							else
							{
								expressionResult = lastExpressionResult;
							}
						}
						else
						{
							expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), false, false, false, false));
						}
						isNew = false;
					}
					else
					{
						if (lastPropertyName)
						{
							if (lastIdentifier && $es4.$$get(lastIdentifier, $$this, $$thisp, 'isType'))
							{
								expressionResult = lastExpressionResult;
							}
							else
							{
								expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupPropertyType', [$es4.$$get(lastExpressionResult, $$this, $$thisp, 'type'), namespaceIdentifier, lastIdentifier, lastPropertyName, true]), false, false, false, false));
							}
						}
						else
						{
							expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']), false, false, false, false));
						}
					}
					namespaceIdentifier = null;
					identifier = null;
					lastPropertyName = null;
					lastIdentifier = null;
					lastExpressionResult = null;
					thisConstruct = false;
					if ($es4.$$get(innerExpression, $$this, $$thisp, 'nextPropertyExpression'))
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
						expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupPropertyType', [lastExpressionResult, namespaceIdentifier, lastIdentifier, lastPropertyName]), false, false, false, false));
						if ($es4.$$get(expressionResult, $$this, $$thisp, 'type', 'name') == '*')
						{
							expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), false, false, false, false));
						}
					}
				}
				else
				{
					expressionResult = $es4.$$primitive(new (ExpressionResult)($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), false, false, false, false));
				}
			}
			return expressionResult;
		}));

		//method
		$es4.$$private_function('lookupPropertyType', $$thisp, (function ($$$$type, $$$$namespaceIdentifier, $$$$identifier, $$$$name, $$$$functionReturnType)
		{
			//set default parameter values
			var type = $$$$type;
			var namespaceIdentifier = $$$$namespaceIdentifier;
			var identifier = $$$$identifier;
			var name = $$$$name;
			var functionReturnType = (4 > arguments.length - 1) ? null : $$$$functionReturnType;

			if (identifier && !$es4.$$get(identifier, $$this, $$thisp, 'isType'))
			{
				return $es4.$$get(identifier, $$this, $$thisp, 'type');
			}
			else if (identifier)
			{
				if (name == 'prototype')
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']);
				}
				var propertyConstructs = $es4.$$call(identifier, $$this, $$thisp, 'construct', 'methodConstructs', 'concat', [$es4.$$get(identifier, $$this, $$thisp, 'construct', 'propertyConstructs')]);
				for (var i = 0; i < $es4.$$get(propertyConstructs, $$this, $$thisp, 'length'); i++)
				{
					var propertyConstruct = $es4.$$get(propertyConstructs, $$this, $$thisp, i);
					if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'staticToken'))
					{
						continue;
					}
					if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken') && namespaceIdentifier)
					{
						continue;
					}
					if (namespaceIdentifier && $es4.$$get(namespaceIdentifier, $$this, $$thisp, 'name') != $es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken', 'data'))
					{
						continue;
					}
					if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'identifierToken', 'data') != name)
					{
						continue;
					}
					if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct'))
					{
						if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'setToken'))
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0) || !$es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::10'));
							}
							return getType($es4.$$get(identifier, $$this, $$thisp, 'construct'), $es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0, 'typeConstruct'));
						}
						if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'getToken'))
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::9'));
							}
							return getType($es4.$$get(identifier, $$this, $$thisp, 'construct'), $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
						}
						if (functionReturnType)
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::8'));
							}
							return getType($es4.$$get(identifier, $$this, $$thisp, 'construct'), $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
						}
						return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Function']);
					}
					if (!propertyConstruct || !$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
					{
						throw $es4.$$primitive(new (Error)('::7'));
					}
					return getType($es4.$$get(identifier, $$this, $$thisp, 'construct'), $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
				}
				throw $es4.$$primitive(new (Error)('cound not lookup static property ' + name + ' in: ' + type + ', ' + identifier + ', possible cause: compiling against out of date swc'));
			}
			if ($es4.$$get(type, $$this, $$thisp, 'isGlobal') && ($es4.$$get(type, $$this, $$thisp, 'name') == '*' || $es4.$$get(type, $$this, $$thisp, 'name') == 'void'))
			{
				return type;
			}
			var construct = $es4.$$get(type, $$this, $$thisp, 'construct');
			if (!construct)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				throw $es4.$$primitive(new (Error)('could not find construct in type: ' + type + ', property name: ' + name));
			}
			if ($es4.$$get(construct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'ClassConstruct') && $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data') == name)
			{
				return type;
			}
			if ($es4.$$get(construct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct'))
			{
				if ($es4.$$get(construct, $$this, $$thisp, 'setToken'))
				{
					return getType(construct, $es4.$$get(construct, $$this, $$thisp, 'parameterConstructs', 0, 'typeConstruct'));
				}
				if ($es4.$$get(construct, $$this, $$thisp, 'getToken'))
				{
					return getType(construct, $es4.$$get(construct, $$this, $$thisp, 'typeConstruct'));
				}
				if (functionReturnType)
				{
					if (!$es4.$$get(construct, $$this, $$thisp, 'typeConstruct'))
					{
						throw $es4.$$primitive(new (Error)('::6'));
					}
					return getType(construct, $es4.$$get(construct, $$this, $$thisp, 'typeConstruct'));
				}
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Function']);
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
				for (var i = 0; i < $es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', 'length'); i++)
				{
					var fullyQualifiedName = $es4.$$call($$thisp, $$this, $$thisp, 'lookupFullyQualifiedName', [construct, $es4.$$get(construct, $$this, $$thisp, 'extendsNameConstructs', i)]);
					var innerConstruct = $es4.$$call($$thisp, $$this, $$thisp, 'lookupConstructInRootConstruct', [$es4.$$call($$thisp, $$this, $$thisp, 'lookupRootConstruct', [$es4.$$get(construct, $$this, $$thisp, 'rootConstruct'), fullyQualifiedName]), fullyQualifiedName]);
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
				if ($es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstructs'))
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
				if ($es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstruct') && $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstruct')]) == 'Object')
				{
					object = true;
				}
				if (!$es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstruct') && object)
				{
					break;
				}
				else if (!$es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstruct'))
				{
					innerConstruct = $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Object']), $$this, $$thisp, 'construct');
					object = true;
				}
				else
				{
					innerConstruct = $es4.$$get(getType(innerConstruct, $es4.$$get(innerConstruct, $$this, $$thisp, 'extendsNameConstruct')), $$this, $$thisp, 'construct');
				}
			}
			if ($es4.$$get(construct, $$this, $$thisp, 'dynamicToken'))
			{
				return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
			}
			throw $es4.$$primitive(new (Error)('could not find property ' + name + ' in type ' + type + ' construct: ' + $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data')));

			function getTypeInConstruct($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				var propertyConstructs = ($es4.$$get(construct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'InterfaceConstruct')) ? $es4.$$get(construct, $$this, $$thisp, 'methodConstructs') : $es4.$$call(construct, $$this, $$thisp, 'methodConstructs', 'concat', [$es4.$$get(construct, $$this, $$thisp, 'propertyConstructs')]);
				for (var i = 0; i < $es4.$$get(propertyConstructs, $$this, $$thisp, 'length'); i++)
				{
					var propertyConstruct = $es4.$$get(propertyConstructs, $$this, $$thisp, i);
					if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'staticToken'))
					{
						continue;
					}
					if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken') && namespaceIdentifier)
					{
						continue;
					}
					if (namespaceIdentifier && $es4.$$get(namespaceIdentifier, $$this, $$thisp, 'name') != $es4.$$get(propertyConstruct, $$this, $$thisp, 'namespaceToken', 'data'))
					{
						continue;
					}
					if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'identifierToken', 'data') != name)
					{
						continue;
					}
					if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'MethodConstruct'))
					{
						if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'setToken'))
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0) || !$es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::4'));
							}
							return getType(construct, $es4.$$get(propertyConstruct, $$this, $$thisp, 'parameterConstructs', 0, 'typeConstruct'));
						}
						if ($es4.$$get(propertyConstruct, $$this, $$thisp, 'getToken'))
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::3'));
							}
							return getType(construct, $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
						}
						if (functionReturnType)
						{
							if (!$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
							{
								throw $es4.$$primitive(new (Error)('::1'));
							}
							return getType(construct, $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
						}
						return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['Function']);
					}
					if (!propertyConstruct || !$es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'))
					{
						throw $es4.$$primitive(new (Error)('::2'));
					}
					return getType(construct, $es4.$$get(propertyConstruct, $$this, $$thisp, 'typeConstruct'));
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
				if ($es4.$$get(construct, $$this, $$thisp, 'isInternal'))
				{
					importConstructs = $es4.$$get(construct, $$this, $$thisp, 'rootConstruct', 'importConstructs');
					packageName = '';
				}
				else
				{
					importConstructs = $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'importConstructs');
					if ($es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') == null)
					{
						throw $es4.$$primitive(new (Error)('invalid: ' + $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data') + ', ' + $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'constructor')));
					}
					packageName = $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]);
				}
				if (!typeOrNameConstruct)
				{
					trace($es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data'));
					$es4.$$call($$thisp, $$this, $$thisp, 'output', $es4.$$EMPTY_ARRAY);
				}
				if ($es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'TypeConstruct'))
				{
					if (!$es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'nameConstruct') && $es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'mulToken'))
					{
						return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['*']);
					}
					if (!$es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'nameConstruct') && $es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'voidToken'))
					{
						return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', ['void']);
					}
					if (!$es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'nameConstruct'))
					{
						throw $es4.$$primitive(new (Error)('invalid: ' + $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data') + ', name: ' + name));
					}
					typeName = $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'nameConstruct')]);
				}
				else if ($es4.$$get(typeOrNameConstruct, $$this, $$thisp, 'constructor') == $es4.$$get(Construct, $$this, $$thisp, 'NameConstruct'))
				{
					typeName = $es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [typeOrNameConstruct]);
				}
				else
				{
					throw $es4.$$primitive(new (Error)('invalid type or name construct'));
				}
				if ($es4.$$get($es4.$$call(typeName, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'length') > 1)
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [typeOrNameConstruct]);
				}
				if (!typeName)
				{
					throw $es4.$$primitive(new (Error)("invalid type name"));
				}
				if ($es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [typeName]) && $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [typeName]), $$this, $$thisp, 'isGlobal'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [typeName]);
				}
				for (var i = 0; i < $es4.$$get(importConstructs, $$this, $$thisp, 'length'); i++)
				{
					var importConstruct = $es4.$$get(importConstructs, $$this, $$thisp, i);
					var innerName = $es4.$$get(importConstruct, $$this, $$thisp, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstruct, $$this, $$thisp, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data');
					if (innerName == typeName)
					{
						return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [$es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(importConstruct, $$this, $$thisp, 'nameConstruct')])]);
					}
				}
				for (var $$i8 = ($es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs') || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i8 != 0; $$i8 = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextNameIndex($$i8))
				{
					var id = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs').$$nextName($$i8);

					var rootConstruct = $es4.$$get($$thisp, $$this, $$thisp, '_rootConstructs', id);
					if (!rootConstruct)
					{
						throw $es4.$$primitive(new (Error)('Root construct null for id: ' + id));
					}
					if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct'))
					{
						throw $es4.$$primitive(new (Error)('Package construct missing in: ' + id));
					}
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && !$es4.$$get(construct, $$this, $$thisp, 'packageConstruct'))
					{
						continue;
					}
					if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
					{
						continue;
					}
					if ($es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct') && $es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct'))
					{
						var a = $es4.$$coerce($es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]), String);
						var b = $es4.$$coerce($es4.$$call(Construct, $$this, $$thisp, 'nameConstructToString', [$es4.$$get(construct, $$this, $$thisp, 'packageConstruct', 'nameConstruct')]), String);
						if (a && (a != b))
						{
							continue;
						}
					}
					if ($es4.$$call($$thisp, $$this, $$thisp, 'hasIdentifier', [id]) && $es4.$$get($es4.$$call($$thisp, $$this, $$thisp, 'lookupIdentifier', [id]), $$this, $$thisp, 'isGlobal'))
					{
						continue;
					}
					if (!$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'classConstruct') && !$es4.$$get(rootConstruct, $$this, $$thisp, 'packageConstruct', 'interfaceConstruct'))
					{
						continue;
					}
					if ($es4.$$call($es4.$$call(id, $$this, $$thisp, 'split', ['.']), $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY) != typeName)
					{
						continue;
					}
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [id]);
				}
				if (typeName == $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data'))
				{
					return $es4.$$call($$thisp, $$this, $$thisp, 'lookupType', [typeName]);
				}
				throw $es4.$$primitive(new (Error)('could not find type: ' + typeName + ' in ' + $es4.$$get(construct, $$this, $$thisp, 'identifierToken', 'data')));
			}
;
		}));

		//method
		$es4.$$private_function('print', $$thisp, (function ($$$$string, $$$$tabs, $$$$newlines, $$$$preNewLines)
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
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	////////////////INTERNAL CLASS////////////////
	var NamespaceObj = (function ()
	{
		//class initializer
		NamespaceObj.$$cinit = (function ()
		{
			NamespaceObj.$$cinit = undefined;

		});

		function NamespaceObj()
		{
			//initialize class if not initialized
			if (NamespaceObj.$$cinit !== undefined) NamespaceObj.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof NamespaceObj) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], NamespaceObj) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$public_property('name', $$thisp);
			$es4.$$public_property('normalizedName', $$thisp, String);
			$es4.$$public_property('isCustom', $$thisp, Boolean);
			$es4.$$public_property('isPrivate', $$thisp, Boolean);
			$es4.$$public_property('namespaceIsPrivate', $$thisp, Boolean);
			$es4.$$public_property('normalizedImportID', $$thisp, String);
			$es4.$$public_property('importID', $$thisp, String);
			$es4.$$public_property('identifier', $$thisp, Identifier);
			$es4.$$public_property('isStatic', $$thisp, Boolean);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$name, $$$$importID, $$$$identifier)
			{
				//set default parameter values
				var name = $es4.$$coerce($$$$name, String);
				var importID = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$importID, String);
				var identifier = (2 > arguments.length - 1) ? null : $es4.$$coerce($$$$identifier, Identifier);

				$es4.$$set($$this, $$this, $$thisp, 'name', name, '=');
				var parts = $es4.$$call(name, $$this, $$thisp, 'split', ['.']);
				var part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				$es4.$$set($$this, $$this, $$thisp, 'normalizedName', ($es4.$$get(parts, $$this, $$thisp, 'length')) ? '$[\'' + $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) + '\'].' + part : part, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isCustom', true, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isPrivate', name == 'private', '=');
				$es4.$$set($$this, $$this, $$thisp, 'namespaceIsPrivate', false, '=');
				if (importID)
				{
					parts = $es4.$$call(importID, $$this, $$thisp, 'split', ['.']);
					part = $es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
					$es4.$$set($$this, $$this, $$thisp, 'normalizedImportID', ($es4.$$get(parts, $$this, $$thisp, 'length')) ? '$[\'' + $es4.$$call(parts, $$this, $$thisp, 'join', ['.']) + '\'].' + part : part, '=');
				}
				$es4.$$set($$this, $$this, $$thisp, 'importID', importID, '=');
				$es4.$$set($$this, $$this, $$thisp, 'identifier', identifier, '=');
			}));

			//method
			$es4.$$public_function('toString', $$thisp, (function ()
			{
				return 'Namespace::: ' + $es4.$$get($$this, $$this, $$thisp, 'name');
			}));

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(NamespaceObj, null, 'NamespaceObj');
	})();

	////////////////INTERNAL CLASS////////////////
	var Type = (function ()
	{
		//class initializer
		Type.$$cinit = (function ()
		{
			Type.$$cinit = undefined;

		});

		function Type()
		{
			//initialize class if not initialized
			if (Type.$$cinit !== undefined) Type.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Type) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Type) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$public_property('name', $$thisp);
			$es4.$$public_property('fullyQualifiedName', $$thisp, String);
			$es4.$$public_property('packageName', $$thisp, String);
			$es4.$$public_property('rootConstruct', $$thisp, Object);
			$es4.$$public_property('construct', $$thisp);
			$es4.$$public_property('isGlobal', $$thisp, Boolean);
			$es4.$$public_property('isInterface', $$thisp, Boolean);
			$es4.$$public_property('accessed', $$thisp, Boolean);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$name, $$$$fullyQualifiedName, $$$$rootConstruct, $$$$construct)
			{
				//set default parameter values
				var name = $es4.$$coerce($$$$name, String);
				var fullyQualifiedName = $es4.$$coerce($$$$fullyQualifiedName, String);
				var rootConstruct = $es4.$$coerce($$$$rootConstruct, Object);
				var construct = $$$$construct;

				$es4.$$set($$this, $$this, $$thisp, 'name', name, '=');
				$es4.$$set($$this, $$this, $$thisp, 'fullyQualifiedName', (fullyQualifiedName) ? fullyQualifiedName : name, '=');
				var parts = $es4.$$call(fullyQualifiedName, $$this, $$thisp, 'split', ['.']);
				if ($es4.$$get(parts, $$this, $$thisp, 'length') > 1)
				{
					$es4.$$call(parts, $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
					$es4.$$set($$this, $$this, $$thisp, 'packageName', $es4.$$call(parts, $$this, $$thisp, 'join', ['.']), '=');
				}
				else
				{
					$es4.$$set($$this, $$this, $$thisp, 'packageName', '', '=');
				}
				$es4.$$set($$this, $$this, $$thisp, 'rootConstruct', rootConstruct, '=');
				$es4.$$set($$this, $$this, $$thisp, 'construct', construct, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isGlobal', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isInterface', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'accessed', false, '=');
			}));

			//method
			$es4.$$public_function('toString', $$thisp, (function ()
			{
				if ($es4.$$get($$this, $$this, $$thisp, 'construct'))
				{
					return 'Type::: ' + $es4.$$get($$this, $$this, $$thisp, 'name') + ' Construct: ' + (($es4.$$get($$this, $$this, $$thisp, 'construct', 'identifierToken')) ? $es4.$$get($$this, $$this, $$thisp, 'construct', 'identifierToken', 'data') : '');
				}
				else
				{
					return 'Type::: ' + $es4.$$get($$this, $$this, $$thisp, 'name');
				}
			}));

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(Type, null, 'Type');
	})();

	////////////////INTERNAL CLASS////////////////
	var ExpressionResult = (function ()
	{
		//class initializer
		ExpressionResult.$$cinit = (function ()
		{
			ExpressionResult.$$cinit = undefined;

		});

		function ExpressionResult()
		{
			//initialize class if not initialized
			if (ExpressionResult.$$cinit !== undefined) ExpressionResult.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof ExpressionResult) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ExpressionResult) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$public_property('type', $$thisp);
			$es4.$$public_property('isNaN', $$thisp, Boolean);
			$es4.$$public_property('isNull', $$thisp, Boolean);
			$es4.$$public_property('isUndefined', $$thisp, Boolean);
			$es4.$$public_property('isVoid', $$thisp, Boolean);
			$es4.$$public_property('varIdentifier', $$thisp, Identifier);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$type, $$$$isNaN, $$$$isNull, $$$$isUndefined, $$$$isVoid, $$$$varIdentifier)
			{
				//set default parameter values
				var type = $$$$type;
				var isNaN = $es4.$$coerce($$$$isNaN, Boolean);
				var isNull = $es4.$$coerce($$$$isNull, Boolean);
				var isUndefined = $es4.$$coerce($$$$isUndefined, Boolean);
				var isVoid = $es4.$$coerce($$$$isVoid, Boolean);
				var varIdentifier = (5 > arguments.length - 1) ? null : $es4.$$coerce($$$$varIdentifier, Identifier);

				$es4.$$set($$this, $$this, $$thisp, 'type', type, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isNaN', isNaN, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isNull', isNull, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isUndefined', isUndefined, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isVoid', isVoid, '=');
				$es4.$$set($$this, $$this, $$thisp, 'varIdentifier', varIdentifier, '=');
			}));

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(ExpressionResult, null, 'ExpressionResult');
	})();

	////////////////INTERNAL CLASS////////////////
	var Identifier = (function ()
	{
		//class initializer
		Identifier.$$cinit = (function ()
		{
			Identifier.$$cinit = undefined;

		});

		function Identifier()
		{
			//initialize class if not initialized
			if (Identifier.$$cinit !== undefined) Identifier.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Identifier) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Identifier) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$public_property('name', $$thisp);
			$es4.$$public_property('type', $$thisp);
			$es4.$$public_property('vectorType', $$thisp);
			$es4.$$public_property('namespaceObj', $$thisp);
			$es4.$$public_property('construct', $$thisp);
			$es4.$$public_property('isStatic', $$thisp, Boolean);
			$es4.$$public_property('isNative', $$thisp, Boolean);
			$es4.$$public_property('isPrivate', $$thisp, Boolean);
			$es4.$$public_property('isPackage', $$thisp, Boolean);
			$es4.$$public_property('isProperty', $$thisp, Boolean);
			$es4.$$public_property('isMethod', $$thisp, Boolean);
			$es4.$$public_property('isGlobal', $$thisp, Boolean);
			$es4.$$public_property('isType', $$thisp, Boolean);
			$es4.$$public_property('isImport', $$thisp, Boolean);
			$es4.$$public_property('isNamespace', $$thisp, Boolean);
			$es4.$$public_property('isInternal', $$thisp, Boolean);
			$es4.$$public_property('scope', $$thisp);
			$es4.$$public_property('accessed', $$thisp, Boolean);
			$es4.$$public_property('fullPackageName', $$thisp, String);
			$es4.$$public_property('isVar', $$thisp, Boolean);
			$es4.$$public_property('isVarInitialized', $$thisp, Boolean);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$name, $$$$type, $$$$vectorType)
			{
				//set default parameter values
				var name = $$$$name;
				var type = $$$$type;
				var vectorType = (2 > arguments.length - 1) ? null : $$$$vectorType;

				$es4.$$set($$this, $$this, $$thisp, 'name', name, '=');
				$es4.$$set($$this, $$this, $$thisp, 'type', type, '=');
				$es4.$$set($$this, $$this, $$thisp, 'vectorType', vectorType, '=');
				$es4.$$get($$this, $$this, $$thisp, 'namespaceObj');
				$es4.$$get($$this, $$this, $$thisp, 'construct');
				$es4.$$set($$this, $$this, $$thisp, 'isStatic', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isNative', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isPrivate', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isPackage', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isProperty', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isMethod', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isGlobal', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isType', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isImport', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isNamespace', false, '=');
				$es4.$$get($$this, $$this, $$thisp, 'scope');
				$es4.$$set($$this, $$this, $$thisp, 'accessed', false, '=');
				$es4.$$get($$this, $$this, $$thisp, 'fullPackageName');
				$es4.$$set($$this, $$this, $$thisp, 'isVar', false, '=');
				$es4.$$set($$this, $$this, $$thisp, 'isVarInitialized', false, '=');
			}));

			//method
			$es4.$$public_function('toString', $$thisp, (function ()
			{
				return 'Identifier::: ' + $es4.$$get($$this, $$this, $$thisp, 'name') + ', scope: ' + $es4.$$get($$this, $$this, $$thisp, 'scope');
			}));

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(Identifier, null, 'Identifier');
	})();

	return $es4.$$class(Analyzer, {CLASSES:[NamespaceObj, Type, ExpressionResult, Identifier]}, 'sweetrush.core::Analyzer');
})();
//sweetrush.core.Analyzer


//sweetrush.core.Parser
$es4.$$package('sweetrush.core').Parser = (function ()
{
	//imports
	var Construct;
	var Token;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//class initializer
	Parser.$$cinit = (function ()
	{
		Parser.$$cinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
	});

	//method
	$es4.$$public_function('parse', Parser, (function ($$$$tokens, $$$$compileConstants, $$$$release)
	{
		if (Parser.$$cinit !== undefined) Parser.$$cinit();

		//set default parameter values
		var tokens = $es4.$$coerce($$$$tokens, Array);
		var compileConstants = $es4.$$coerce($$$$compileConstants, Object);
		var release = (2 > arguments.length - 1) ? false : $es4.$$coerce($$$$release, Boolean);

		if (!$es4.$$get(tokens, null, null, 'length'))
		{
			return null;
		}
		if (!compileConstants)
		{
			compileConstants = {};
		}
		var index = -1;
		var ahead = 1;
		var rootConstruct = $es4.$$call(Construct, null, null, 'getNewRootConstruct', $es4.$$EMPTY_ARRAY);
		var callsSuper = false;
		var inCompileConstant = false;
		var add = true;
		var previousAddValue = add;
		var token;
		var statementImportConstructs = [];
		loopa:		while (token = peek(ahead))
		{
			ahead++;
			switch ($es4.$$get(token, null, null, 'type'))
			{
				case $es4.$$get(Token, null, null, 'PackageTokenType'):
					var p = matchPackageConstruct(rootConstruct);
					if (add)
					{
						$es4.$$set(rootConstruct, null, null, 'packageConstruct', p, '=');
						$es4.$$set(rootConstruct, null, null, 'packageConstruct', 'rootConstruct', rootConstruct, '=');
					}
					break;
				case $es4.$$get(Token, null, null, 'ImportTokenType'):
					var p = matchImportConstruct();
					if (add)
					{
						$es4.$$call(rootConstruct, null, null, 'importConstructs', 'push', [p]);
					}
					break;
				case $es4.$$get(Token, null, null, 'ElseTokenType'):
					match($es4.$$get(Token, null, null, 'ElseTokenType'));
					if (inCompileConstant)
					{
						throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
					}
					inCompileConstant = true;
					add = !previousAddValue;
					match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
					break;
				case $es4.$$get(Token, null, null, 'IfTokenType'):
					match($es4.$$get(Token, null, null, 'IfTokenType'));
					match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					if (inCompileConstant)
					{
						throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
					}
				case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
					if ($es4.$$get(peek(ahead, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType') && $es4.$$get(peek(ahead + 1, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType'))
					{
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
						var compileConstantIdentifier = '';
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')), null, null, 'data');
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true);
						inCompileConstant = true;
						add = $es4.$$get(compileConstants, null, null, compileConstantIdentifier) == 'true';
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						break;
					}
					continue loopa;
				case $es4.$$get(Token, null, null, 'ClosedBraceTokenType'):
					if (inCompileConstant)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						inCompileConstant = false;
						previousAddValue = add;
						add = true;
						break;
					}
				case $es4.$$get(Token, null, null, 'FinalTokenType'):
				case $es4.$$get(Token, null, null, 'DynamicTokenType'):
					continue loopa;
				case $es4.$$get(Token, null, null, 'ClassTokenType'):
					var classConstruct = matchClassConstruct();
					if (add)
					{
						$es4.$$set(classConstruct, null, null, 'isInternal', true, '=');
						$es4.$$set(classConstruct, null, null, 'rootConstruct', rootConstruct, '=');
						$es4.$$set(rootConstruct, null, null, 'importConstructs', $es4.$$call(classConstruct, null, null, 'importConstructs', 'concat', [$es4.$$get(rootConstruct, null, null, 'importConstructs')]), '=');
						$es4.$$call(rootConstruct, null, null, 'classConstructs', 'push', [classConstruct]);
					}
					break;
				case $es4.$$get(Token, null, null, 'InterfaceTokenType'):
					var interfaceConstruct = matchInterfaceConstruct();
					if (add)
					{
						$es4.$$set(interfaceConstruct, null, null, 'isInternal', true, '=');
						$es4.$$set(interfaceConstruct, null, null, 'rootConstruct', rootConstruct, '=');
						$es4.$$call(rootConstruct, null, null, 'interfaceConstructs', 'push', [interfaceConstruct]);
					}
					break;
				case $es4.$$get(Token, null, null, 'FunctionTokenType'):
					var methodConstruct = matchMethodConstruct();
					if (add)
					{
						$es4.$$set(methodConstruct, null, null, 'isInternal', true, '=');
						$es4.$$set(methodConstruct, null, null, 'rootConstruct', rootConstruct, '=');
						if (!($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release))
						{
							$es4.$$call(rootConstruct, null, null, 'methodConstructs', 'push', [methodConstruct]);
						}
					}
					break;
				case $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'):
				case $es4.$$get(Token, null, null, 'VarTokenType'):
					var propertyConstruct = matchPropertyConstruct();
					if (add)
					{
						$es4.$$set(propertyConstruct, null, null, 'isInternal', true, '=');
						$es4.$$set(propertyConstruct, null, null, 'rootConstruct', rootConstruct, '=');
						$es4.$$call(rootConstruct, null, null, 'propertyConstructs', 'push', [propertyConstruct]);
					}
					break;
				default:
					throw error('Unexpected token found11.', token);
			}
			ahead = 1;
		}

		function matchTypeConstruct() 
		{
			var typeConstruct = $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY);
			var token = peek(1);
			if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'MulTokenType'))
			{
				$es4.$$set(typeConstruct, null, null, 'mulToken', match($es4.$$get(Token, null, null, 'MulTokenType')), '=');
			}
			else if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'VoidTokenType'))
			{
				$es4.$$set(typeConstruct, null, null, 'voidToken', match($es4.$$get(Token, null, null, 'VoidTokenType')), '=');
			}
			else
			{
				$es4.$$set(typeConstruct, null, null, 'nameConstruct', matchNameConstruct(), '=');
				if (match($es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), true))
				{
					$es4.$$set(typeConstruct, null, null, 'vectorNameConstruct', matchNameConstruct(), '=');
					match($es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'));
				}
			}
			return typeConstruct;
		}
;

		function matchPackageConstruct($$$$rootConstruct) 
		{
			//set default parameter values
			var rootConstruct = $$$$rootConstruct;

			var packageConstruct = $es4.$$call(Construct, null, null, 'getNewPackageConstruct', $es4.$$EMPTY_ARRAY);
			match($es4.$$get(Token, null, null, 'PackageTokenType'));
			if ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType'))
			{
				$es4.$$set(packageConstruct, null, null, 'nameConstruct', matchNameConstruct(), '=');
			}
			else
			{
				$es4.$$set(packageConstruct, null, null, 'nameConstruct', $es4.$$call(Construct, null, null, 'getNewNameConstruct', $es4.$$EMPTY_ARRAY), '=');
			}
			match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
			var ahead = 1;
			var metaDataConstructs = [];
			var token;
			var inCompileConstant = false;
			var add = true;
			var previousAddValue = add;
			loopb:			while (token = peek(ahead, 0, true))
			{
				ahead++;
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'ImportTokenType'):
						var c = matchImportConstruct();
						if (add)
						{
							$es4.$$call(packageConstruct, null, null, 'importConstructs', 'push', [c]);
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBracketTokenType'):
						var c = matchMetaDataConstruct();
						if (add)
						{
							$es4.$$call(metaDataConstructs, null, null, 'push', [c]);
						}
						ahead = 1;
						continue loopb;
					case $es4.$$get(Token, null, null, 'StaticTokenType'):
					case $es4.$$get(Token, null, null, 'FinalTokenType'):
					case $es4.$$get(Token, null, null, 'OverrideTokenType'):
					case $es4.$$get(Token, null, null, 'DynamicTokenType'):
						continue loopb;
					case $es4.$$get(Token, null, null, 'UseTokenType'):
						var useConstruct = matchUseConstruct();
						if (add)
						{
							$es4.$$call(packageConstruct, null, null, 'useConstructs', 'push', [useConstruct]);
						}
						break;
					case $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'):
						var p = matchPropertyConstruct(metaDataConstructs);
						if (add)
						{
							$es4.$$set(packageConstruct, null, null, 'propertyConstruct', p, '=');
							$es4.$$set(packageConstruct, null, null, 'propertyConstruct', 'packageConstruct', packageConstruct, '=');
							$es4.$$set(packageConstruct, null, null, 'propertyConstruct', 'rootConstruct', rootConstruct, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'FunctionTokenType'):
						var m = matchMethodConstruct(metaDataConstructs);
						if (add)
						{
							$es4.$$set(packageConstruct, null, null, 'methodConstruct', m, '=');
							$es4.$$set(packageConstruct, null, null, 'methodConstruct', 'packageConstruct', packageConstruct, '=');
							$es4.$$set(packageConstruct, null, null, 'methodConstruct', 'rootConstruct', rootConstruct, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'ClassTokenType'):
						if (add && $es4.$$get(packageConstruct, null, null, 'classConstruct'))
						{
							throw error('Multiple definitions found in package.', token);
						}
						var c = matchClassConstruct();
						if (add)
						{
							$es4.$$set(packageConstruct, null, null, 'classConstruct', c, '=');
							$es4.$$set(packageConstruct, null, null, 'classConstruct', 'packageConstruct', packageConstruct, '=');
							$es4.$$set(packageConstruct, null, null, 'importConstructs', $es4.$$call(packageConstruct, null, null, 'classConstruct', 'importConstructs', 'concat', [$es4.$$get(packageConstruct, null, null, 'importConstructs')]), '=');
							$es4.$$set(packageConstruct, null, null, 'classConstruct', 'rootConstruct', rootConstruct, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'InterfaceTokenType'):
						if (add && $es4.$$get(packageConstruct, null, null, 'interfaceConstruct'))
						{
							throw error('Multiple definitions found in package.', token);
						}
						var c = matchInterfaceConstruct();
						if (add)
						{
							$es4.$$set(packageConstruct, null, null, 'interfaceConstruct', c, '=');
							$es4.$$set(packageConstruct, null, null, 'interfaceConstruct', 'packageConstruct', packageConstruct, '=');
							$es4.$$set(packageConstruct, null, null, 'interfaceConstruct', 'rootConstruct', rootConstruct, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'ElseTokenType'):
						match($es4.$$get(Token, null, null, 'ElseTokenType'));
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
						inCompileConstant = true;
						add = !previousAddValue;
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						break;
					case $es4.$$get(Token, null, null, 'IfTokenType'):
						match($es4.$$get(Token, null, null, 'IfTokenType'));
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						if ($es4.$$get(peek(ahead, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType') && $es4.$$get(peek(ahead + 1, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType'))
						{
							if (inCompileConstant)
							{
								throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
							}
							var compileConstantIdentifier = '';
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')), null, null, 'data');
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
							match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true);
							inCompileConstant = true;
							add = $es4.$$get(compileConstants, null, null, compileConstantIdentifier) == 'true';
							match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
							break;
						}
						continue loopb;
					case $es4.$$get(Token, null, null, 'ClosedBraceTokenType'):
						if (inCompileConstant)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
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
			match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
			return packageConstruct;
		}
;

		function matchMetaDataConstruct() 
		{
			var metaDataConstruct = $es4.$$call(Construct, null, null, 'getNewMetaDataConstruct', $es4.$$EMPTY_ARRAY);
			match($es4.$$get(Token, null, null, 'OpenBracketTokenType'));
			while (!match($es4.$$get(Token, null, null, 'ClosedBracketTokenType'), true))
			{
				$es4.$$call(metaDataConstruct, null, null, 'tokens', 'push', [next()]);
			}
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			return metaDataConstruct;
		}
;

		function matchClassConstruct() 
		{
			var classConstruct = $es4.$$call(Construct, null, null, 'getNewClassConstruct', $es4.$$EMPTY_ARRAY);
			var token;
			loop1a:			while (token = next(0, true))
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						if ($es4.$$get(token, null, null, 'data') == 'UNIMPLEMENTED')
						{
							$es4.$$set(classConstruct, null, null, 'UNIMPLEMENTEDToken', token, '=');
						}
						else
						{
							$es4.$$set(classConstruct, null, null, 'namespaceToken', token, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'StaticTokenType'):
						$es4.$$set(classConstruct, null, null, 'staticToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'FinalTokenType'):
						$es4.$$set(classConstruct, null, null, 'finalToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'DynamicTokenType'):
						$es4.$$set(classConstruct, null, null, 'dynamicToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'ClassTokenType'):
						break loop1a;
					default:
						throw error('Unexpected token found2.', token);
				}
			}
			$es4.$$set(classConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			loop2a:			while (token = next())
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'ExtendsTokenType'):
						$es4.$$set(classConstruct, null, null, 'extendsNameConstruct', matchNameConstruct(), '=');
						break;
					case $es4.$$get(Token, null, null, 'ImplementsTokenType'):
						$es4.$$call(classConstruct, null, null, 'implementsNameConstructs', 'push', [matchNameConstruct()]);
						while (token = peek(1))
						{
							if ($es4.$$get(token, null, null, 'type') != $es4.$$get(Token, null, null, 'CommaTokenType'))
							{
								continue loop2a;
							}
							match($es4.$$get(Token, null, null, 'CommaTokenType'));
							$es4.$$call(classConstruct, null, null, 'implementsNameConstructs', 'push', [matchNameConstruct()]);
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBraceTokenType'):
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
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'ImportTokenType'):
						var c = matchImportConstruct();
						if (add)
						{
							$es4.$$call(classConstruct, null, null, 'importConstructs', 'push', [c]);
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBracketTokenType'):
						var c = matchMetaDataConstruct();
						if (add)
						{
							$es4.$$call(metaDataConstructs, null, null, 'push', [c]);
						}
						ahead = 1;
						continue loop3a;
					case $es4.$$get(Token, null, null, 'OpenBraceTokenType'):
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						var innerInnerToken;
						while ((innerInnerToken = peek(1)) && ($es4.$$get(innerInnerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							var s = matchStatement();
							if (add)
							{
								$es4.$$call(classConstruct, null, null, 'initializerStatements', 'push', [s]);
							}
						}
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						break;
					case $es4.$$get(Token, null, null, 'ElseTokenType'):
						match($es4.$$get(Token, null, null, 'ElseTokenType'));
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
						inCompileConstant = true;
						add = !previousAddValue;
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						break;
					case $es4.$$get(Token, null, null, 'IfTokenType'):
						match($es4.$$get(Token, null, null, 'IfTokenType'));
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						if ($es4.$$get(peek(ahead, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType') && $es4.$$get(peek(ahead + 1, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType'))
						{
							if (inCompileConstant)
							{
								throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
							}
							var compileConstantIdentifier = '';
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')), null, null, 'data');
							compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
							match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true);
							inCompileConstant = true;
							add = $es4.$$get(compileConstants, null, null, compileConstantIdentifier) == 'true';
							match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
							break;
						}
					case $es4.$$get(Token, null, null, 'OverrideTokenType'):
					case $es4.$$get(Token, null, null, 'StaticTokenType'):
					case $es4.$$get(Token, null, null, 'FinalTokenType'):
						continue loop3a;
					case $es4.$$get(Token, null, null, 'VarTokenType'):
					case $es4.$$get(Token, null, null, 'ConstTokenType'):
					case $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'):
						var propertyConstruct = matchPropertyConstruct(metaDataConstructs);
						if (add)
						{
							$es4.$$call(classConstruct, null, null, 'propertyConstructs', 'push', [propertyConstruct]);
						}
						break;
					case $es4.$$get(Token, null, null, 'FunctionTokenType'):
						var methodConstruct = matchMethodConstruct(metaDataConstructs);
						if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
						{
							break;
						}
						if ($es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') == $es4.$$get(classConstruct, null, null, 'identifierToken', 'data'))
						{
							if (add)
							{
								$es4.$$set(classConstruct, null, null, 'constructorMethodConstruct', methodConstruct, '=');
							}
							if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
							{
								throw error('Constructor cannot be declared as native.', $es4.$$get(methodConstruct, null, null, 'identifierToken'));
							}
						}
						else if (add)
						{
							$es4.$$call(classConstruct, null, null, 'methodConstructs', 'push', [methodConstruct]);
						}
						break;
					case $es4.$$get(Token, null, null, 'UseTokenType'):
						var useConstruct = matchUseConstruct();
						if (add)
						{
							$es4.$$call(classConstruct, null, null, 'useConstructs', 'push', [useConstruct]);
						}
						break;
					case $es4.$$get(Token, null, null, 'ClosedBraceTokenType'):
						if (inCompileConstant)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
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
			match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
			return classConstruct;
		}
;

		function matchUseConstruct() 
		{
			var useConstruct = $es4.$$call(Construct, null, null, 'getNewUseConstruct', $es4.$$EMPTY_ARRAY);
			$es4.$$set(useConstruct, null, null, 'useToken', match($es4.$$get(Token, null, null, 'UseTokenType')), '=');
			match($es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'));
			$es4.$$set(useConstruct, null, null, 'namespaceIdentifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			return useConstruct;
		}
;

		function matchInterfaceConstruct() 
		{
			var interfaceConstruct = $es4.$$call(Construct, null, null, 'getNewInterfaceConstruct', $es4.$$EMPTY_ARRAY);
			var token;
			loop1b:			while (token = next())
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						$es4.$$set(interfaceConstruct, null, null, 'namespaceToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'InterfaceTokenType'):
						break loop1b;
					default:
						throw error('Unexpected token found5.', token);
				}
			}
			$es4.$$set(interfaceConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			loop2b:			while (token = next())
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'ExtendsTokenType'):
						$es4.$$call(interfaceConstruct, null, null, 'extendsNameConstructs', 'push', [matchNameConstruct()]);
						while (token = peek(1))
						{
							if ($es4.$$get(token, null, null, 'type') != $es4.$$get(Token, null, null, 'CommaTokenType'))
							{
								continue loop2b;
							}
							match($es4.$$get(Token, null, null, 'CommaTokenType'));
							$es4.$$call(interfaceConstruct, null, null, 'extendsNameConstructs', 'push', [matchNameConstruct()]);
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBraceTokenType'):
						break loop2b;
					default:
						throw error('Unexpected token found6.', token);
				}
			}
			var ahead = 1;
			loop3b:			while (token = peek(ahead))
			{
				ahead++;
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'FunctionTokenType'):
						var methodConstruct = $es4.$$call(Construct, null, null, 'getNewMethodConstruct', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'FunctionTokenType'));
						$es4.$$set(methodConstruct, null, null, 'setToken', match($es4.$$get(Token, null, null, 'SetTokenType'), true), '=');
						if (!$es4.$$get(methodConstruct, null, null, 'setToken'))
						{
							$es4.$$set(methodConstruct, null, null, 'getToken', match($es4.$$get(Token, null, null, 'GetTokenType'), true), '=');
						}
						$es4.$$set(methodConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						while (!match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true))
						{
							$es4.$$call(methodConstruct, null, null, 'parameterConstructs', 'push', [matchParameterConstruct()]);
							match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
						}
						if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
						{
							$es4.$$set(methodConstruct, null, null, 'typeConstruct', matchTypeConstruct(), '=');
						}
						else
						{
							$es4.$$set(methodConstruct, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(methodConstruct, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
						}
						match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
						$es4.$$call(interfaceConstruct, null, null, 'methodConstructs', 'push', [methodConstruct]);
						break;
					case $es4.$$get(Token, null, null, 'ClosedBraceTokenType'):
						break loop3b;
					default:
						throw error('Unexpected token found7.', token);
				}
				ahead = 1;
			}
			match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
			return interfaceConstruct;
		}
;

		function matchNameConstruct() 
		{
			var nameConstruct = $es4.$$call(Construct, null, null, 'getNewNameConstruct', $es4.$$EMPTY_ARRAY);
			$es4.$$call(nameConstruct, null, null, 'identifierTokens', 'push', [match($es4.$$get(Token, null, null, 'IdentifierTokenType'))]);
			var token1;
			var token2;
			while ((token1 = peek(1)) && (token2 = peek(2)))
			{
				if ($es4.$$get(token1, null, null, 'type') != $es4.$$get(Token, null, null, 'DotTokenType'))
				{
					break;
				}
				if ($es4.$$get(token2, null, null, 'type') != $es4.$$get(Token, null, null, 'IdentifierTokenType'))
				{
					break;
				}
				match($es4.$$get(Token, null, null, 'DotTokenType'));
				$es4.$$call(nameConstruct, null, null, 'identifierTokens', 'push', [match($es4.$$get(Token, null, null, 'IdentifierTokenType'))]);
			}
			return nameConstruct;
		}
;

		function matchImportConstruct() 
		{
			var importConstruct = $es4.$$call(Construct, null, null, 'getNewImportConstruct', $es4.$$EMPTY_ARRAY);
			match($es4.$$get(Token, null, null, 'ImportTokenType'));
			$es4.$$set(importConstruct, null, null, 'nameConstruct', matchNameConstruct(), '=');
			if (match($es4.$$get(Token, null, null, 'DotTokenType'), true))
			{
				$es4.$$set(importConstruct, null, null, 'mulToken', match($es4.$$get(Token, null, null, 'MulTokenType')), '=');
			}
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			return importConstruct;
		}
;

		function matchPropertyConstruct($$$$metaDataConstructs) 
		{
			//set default parameter values
			var metaDataConstructs = (0 > arguments.length - 1) ? null : $$$$metaDataConstructs;

			var propertyConstruct = $es4.$$call(Construct, null, null, 'getNewPropertyConstruct', $es4.$$EMPTY_ARRAY);
			var token;
			loop1c:			while (token = next(0, true))
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						$es4.$$set(propertyConstruct, null, null, 'namespaceToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'StaticTokenType'):
						$es4.$$set(propertyConstruct, null, null, 'staticToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'):
						$es4.$$set(propertyConstruct, null, null, 'namespaceKeywordToken', token, '=');
						break loop1c;
					case $es4.$$get(Token, null, null, 'ConstTokenType'):
						$es4.$$set(propertyConstruct, null, null, 'constToken', token, '=');
						break loop1c;
					case $es4.$$get(Token, null, null, 'VarTokenType'):
						break loop1c;
					default:
						throw error('Unexpected token found8.', token);
				}
			}
			$es4.$$set(propertyConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
			{
				$es4.$$set(propertyConstruct, null, null, 'typeConstruct', matchTypeConstruct(), '=');
			}
			else
			{
				$es4.$$set(propertyConstruct, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
				$es4.$$set(propertyConstruct, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
			}
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			if (metaDataConstructs)
			{
				for (var i = 0; i < $es4.$$get(metaDataConstructs, null, null, 'length'); i++)
				{
					var metaDataConstruct = $es4.$$get(metaDataConstructs, null, null, i);
					if ($es4.$$get(metaDataConstruct, null, null, 'tokens', 0, 'data') == 'Native')
					{
						$es4.$$set(propertyConstruct, null, null, 'isNative', true, '=');
						if (!$es4.$$get(propertyConstruct, null, null, 'namespaceToken') || $es4.$$get(propertyConstruct, null, null, 'namespaceToken', 'data') != 'private')
						{
							throw $es4.$$primitive(new (Error)('native properties must be defined as private'));
						}
						if ($es4.$$get(propertyConstruct, null, null, 'typeConstruct') && !$es4.$$get(propertyConstruct, null, null, 'typeConstruct', 'mulToken'))
						{
							throw $es4.$$primitive(new (Error)('native properties must be defined as type *'));
						}
						$es4.$$set(propertyConstruct, null, null, 'namespaceToken', null, '=');
					}
				}
			}
			if (!match($es4.$$get(Token, null, null, 'AssignmentTokenType'), true))
			{
				return propertyConstruct;
			}
			$es4.$$set(propertyConstruct, null, null, 'valueExpression', matchExpression(), '=');
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			return propertyConstruct;
		}
;

		function matchMethodConstruct($$$$metaDataConstructs) 
		{
			//set default parameter values
			var metaDataConstructs = (0 > arguments.length - 1) ? null : $$$$metaDataConstructs;

			var methodConstruct = $es4.$$call(Construct, null, null, 'getNewMethodConstruct', $es4.$$EMPTY_ARRAY);
			var token;
			loop1d:			while (token = next(0, true))
			{
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						if ($es4.$$get(token, null, null, 'data') == 'UNIMPLEMENTED')
						{
							$es4.$$set(methodConstruct, null, null, 'UNIMPLEMENTEDToken', token, '=');
						}
						else
						{
							$es4.$$set(methodConstruct, null, null, 'namespaceToken', token, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'StaticTokenType'):
						$es4.$$set(methodConstruct, null, null, 'staticToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'OverrideTokenType'):
						$es4.$$set(methodConstruct, null, null, 'overrideToken', token, '=');
						break;
					case $es4.$$get(Token, null, null, 'FinalTokenType'):
						break;
					case $es4.$$get(Token, null, null, 'FunctionTokenType'):
						break loop1d;
					default:
						throw error('Unexpected token found9.', token);
				}
			}
			$es4.$$set(methodConstruct, null, null, 'setToken', match($es4.$$get(Token, null, null, 'SetTokenType'), true), '=');
			if (!$es4.$$get(methodConstruct, null, null, 'setToken'))
			{
				$es4.$$set(methodConstruct, null, null, 'getToken', match($es4.$$get(Token, null, null, 'GetTokenType'), true), '=');
			}
			$es4.$$set(methodConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
			while (!match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true))
			{
				$es4.$$call(methodConstruct, null, null, 'parameterConstructs', 'push', [matchParameterConstruct()]);
				match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
			}
			if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
			{
				$es4.$$set(methodConstruct, null, null, 'typeConstruct', matchTypeConstruct(), '=');
			}
			else
			{
				$es4.$$set(methodConstruct, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
				$es4.$$set(methodConstruct, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
			}
			if (metaDataConstructs)
			{
				for (var i = 0; i < $es4.$$get(metaDataConstructs, null, null, 'length'); i++)
				{
					var metaDataConstruct = $es4.$$get(metaDataConstructs, null, null, i);
					if ($es4.$$get(metaDataConstruct, null, null, 'tokens', 0, 'data') == 'JavaScript')
					{
						$es4.$$set(methodConstruct, null, null, 'isJavaScript', true, '=');
					}
					if ($es4.$$get(metaDataConstruct, null, null, 'tokens', 0, 'data') == 'Native')
					{
						$es4.$$set(methodConstruct, null, null, 'isNative', true, '=');
						if (!$es4.$$get(methodConstruct, null, null, 'namespaceToken') || $es4.$$get(methodConstruct, null, null, 'namespaceToken', 'data') != 'private')
						{
							throw $es4.$$primitive(new (Error)('native methods must be defined as private'));
						}
						$es4.$$set(methodConstruct, null, null, 'namespaceToken', null, '=');
					}
				}
			}
			match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), undefined, undefined);
			callsSuper = false;
			var open = 1;
			var closed = 0;
			if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
			{
				while (token = next(2, undefined))
				{
					if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'ClosedBraceTokenType'))
					{
						closed++;
						if (closed == open)
						{
							break;
						}
					}
					if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'OpenBraceTokenType'))
					{
						open++;
					}
					$es4.$$set(methodConstruct, null, null, 'javaScriptString', $es4.$$get(token, null, null, 'data'), '+=');
				}
			}
			else
			{
				while (!match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'), true, undefined))
				{
					$es4.$$call(methodConstruct, null, null, 'bodyStatements', 'push', [matchStatement(false, $es4.$$get(methodConstruct, null, null, 'namedFunctionExpressions'))]);
				}
			}
			$es4.$$set(methodConstruct, null, null, 'callsSuper', callsSuper, '=');
			match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
			return methodConstruct;
		}
;

		function matchParameterConstruct() 
		{
			var argumentConstruct = $es4.$$call(Construct, null, null, 'getNewParameterConstruct', $es4.$$EMPTY_ARRAY);
			$es4.$$set(argumentConstruct, null, null, 'restToken', match($es4.$$get(Token, null, null, 'RestTokenType'), true), '=');
			$es4.$$set(argumentConstruct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			if ($es4.$$get(argumentConstruct, null, null, 'restToken'))
			{
				return argumentConstruct;
			}
			if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
			{
				$es4.$$set(argumentConstruct, null, null, 'typeConstruct', matchTypeConstruct(), '=');
			}
			else
			{
				$es4.$$set(argumentConstruct, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
				$es4.$$set(argumentConstruct, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
			}
			if (match($es4.$$get(Token, null, null, 'AssignmentTokenType'), true) && !match($es4.$$get(Token, null, null, 'MulTokenType'), true))
			{
				$es4.$$set(argumentConstruct, null, null, 'valueExpression', matchExpression(true), '=');
			}
			return argumentConstruct;
		}
;

		function matchPropertyExpression($$$$construct) 
		{
			//set default parameter values
			var construct = (0 > arguments.length - 1) ? null : $$$$construct;

			var token = peek(1);
			if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'ThisTokenType'))
			{
				construct = $es4.$$call(Construct, null, null, 'getNewThisConstruct', $es4.$$EMPTY_ARRAY);
				$es4.$$set(construct, null, null, 'thisToken', match($es4.$$get(Token, null, null, 'ThisTokenType')), '=');
			}
			else if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'SuperTokenType'))
			{
				construct = $es4.$$call(Construct, null, null, 'getNewSuperConstruct', $es4.$$EMPTY_ARRAY);
				$es4.$$set(construct, null, null, 'superToken', match($es4.$$get(Token, null, null, 'SuperTokenType')), '=');
				callsSuper = true;
			}
			else if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'AtTokenType'))
			{
				match($es4.$$get(Token, null, null, 'AtTokenType'));
				construct = $es4.$$call(Construct, null, null, 'getNewAtIdentifierConstruct', $es4.$$EMPTY_ARRAY);
			}
			else if (!construct)
			{
				construct = $es4.$$call(Construct, null, null, 'getNewIdentifierConstruct', $es4.$$EMPTY_ARRAY);
				$es4.$$set(construct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
			}
			var propertyExpression = $es4.$$call(Construct, null, null, 'getNewPropertyExpression', $es4.$$EMPTY_ARRAY);
			$es4.$$set(propertyExpression, null, null, 'construct', construct, '=');
			var innerPropertyExpression;
			var nextPropertyExpression = propertyExpression;
			loopc:			while (token = peek(1))
			{
				innerPropertyExpression = null;
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'):
						match($es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'));
						construct = $es4.$$call(Construct, null, null, 'getNewVectorConstruct', $es4.$$EMPTY_ARRAY);
						$es4.$$set(construct, null, null, 'nameConstruct', matchNameConstruct(), '=');
						match($es4.$$get(Token, null, null, 'VectorClosedArrowTokenType'));
						break;
					case $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType'):
						construct = $es4.$$call(Construct, null, null, 'getNewNamespaceQualifierConstruct', $es4.$$EMPTY_ARRAY);
						$es4.$$set(construct, null, null, 'namespaceQualifierToken', match($es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')), '=');
						$es4.$$set(construct, null, null, 'identifierToken', $es4.$$get(nextPropertyExpression, null, null, 'construct', 'identifierToken'), '=');
						$es4.$$set(construct, null, null, 'namespaceIdentifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						$es4.$$set(nextPropertyExpression, null, null, 'construct', construct, '=');
						continue loopc;
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						construct = $es4.$$call(Construct, null, null, 'getNewIdentifierConstruct', $es4.$$EMPTY_ARRAY);
						$es4.$$set(construct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						break;
					case $es4.$$get(Token, null, null, 'DotTokenType'):
						match($es4.$$get(Token, null, null, 'DotTokenType'));
						if (match($es4.$$get(Token, null, null, 'AtTokenType'), true))
						{
							construct = $es4.$$call(Construct, null, null, 'getNewAtIdentifierConstruct', $es4.$$EMPTY_ARRAY);
						}
						else if (match($es4.$$get(Token, null, null, 'OpenParenTokenType'), true))
						{
							throw $es4.$$primitive(new (Error)('E4X is not supported'));
							construct = $es4.$$call(Construct, null, null, 'getNewE4XSearchConstruct', $es4.$$EMPTY_ARRAY);
							$es4.$$set(construct, null, null, 'expression', matchExpression(), '=');
							if ($es4.$$get(construct, null, null, 'expression', 'constructor') == 'PropertyExpression')
							{
								$es4.$$set(construct, null, null, 'expression', 'root', false, '=');
							}
							match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						}
						else
						{
							construct = $es4.$$call(Construct, null, null, 'getNewDotConstruct', $es4.$$EMPTY_ARRAY);
							$es4.$$set(construct, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBracketTokenType'):
						match($es4.$$get(Token, null, null, 'OpenBracketTokenType'));
						construct = $es4.$$call(Construct, null, null, 'getNewArrayAccessorConstruct', $es4.$$EMPTY_ARRAY);
						$es4.$$set(construct, null, null, 'expression', matchExpression(), '=');
						if ($es4.$$get(construct, null, null, 'expression', 'constructor') == 'PropertyExpression')
						{
							$es4.$$set(construct, null, null, 'expression', 'root', false, '=');
						}
						match($es4.$$get(Token, null, null, 'ClosedBracketTokenType'));
						break;
					case $es4.$$get(Token, null, null, 'OpenParenTokenType'):
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						construct = $es4.$$call(Construct, null, null, 'getNewFunctionCallConstruct', $es4.$$EMPTY_ARRAY);
						while (!match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true))
						{
							$es4.$$call(construct, null, null, 'argumentExpressions', 'push', [matchExpression(true)]);
							match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
						}
						break;
					default:
						break loopc;
				}
				if (!innerPropertyExpression)
				{
					innerPropertyExpression = $es4.$$call(Construct, null, null, 'getNewPropertyExpression', $es4.$$EMPTY_ARRAY);
					$es4.$$set(innerPropertyExpression, null, null, 'construct', construct, '=');
				}
				$es4.$$set(nextPropertyExpression, null, null, 'nextPropertyExpression', innerPropertyExpression, '=');
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
			var tokenType = $es4.$$get(token, null, null, 'type');
			var foundCompileConstantIdentifier = false;
			if ($es4.$$get(peek(2, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType') && $es4.$$get(compileConstants, null, null, $es4.$$get(token, null, null, 'data') + $es4.$$get(peek(2, 0, true), null, null, 'data') + $es4.$$get(peek(3, 0, true), null, null, 'data')) !== undefined)
			{
				foundCompileConstantIdentifier = true;
				tokenType = $es4.$$get(Token, null, null, 'IfTokenType');
			}
			switch (tokenType)
			{
				case $es4.$$get(Token, null, null, 'ImportTokenType'):
					var p = matchImportConstruct();
					$es4.$$call(statementImportConstructs, null, null, 'push', [p]);
					statement = $es4.$$call(Construct, null, null, 'getNewEmptyStatement', $es4.$$EMPTY_ARRAY);
					break;
				case $es4.$$get(Token, null, null, 'IfTokenType'):
					if (!foundCompileConstantIdentifier)
					{
						match($es4.$$get(Token, null, null, 'IfTokenType'));
					}
					statement = $es4.$$call(Construct, null, null, 'getNewIfStatement', $es4.$$EMPTY_ARRAY);
					if (!foundCompileConstantIdentifier)
					{
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					}
					var inCompileConstant = false;
					var inCompileConstantLocal = false;
					var innerStatement;
					var add = true;
					if ($es4.$$get(peek(1, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType') && $es4.$$get(peek(2, 0, true), null, null, 'type') == $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType') && $es4.$$get(compileConstants, null, null, $es4.$$get(peek(1, 0, true), null, null, 'data') + $es4.$$get(peek(2, 0, true), null, null, 'data') + $es4.$$get(peek(3, 0, true), null, null, 'data')) !== undefined)
					{
						if (inCompileConstant)
						{
							throw $es4.$$primitive(new (Error)('nested compile constants are not supported'));
						}
						inCompileConstantLocal = true;
						inCompileConstant = true;
						var compileConstantIdentifier = '';
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'NamespaceQualifierTokenType')), null, null, 'data');
						compileConstantIdentifier += $es4.$$get(match($es4.$$get(Token, null, null, 'IdentifierTokenType')), null, null, 'data');
						add = $es4.$$get(compileConstants, null, null, compileConstantIdentifier) == 'true';
						var booleanExpression = $es4.$$call(Construct, null, null, 'getNewBooleanExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(booleanExpression, null, null, 'booleanToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'BooleanTokenType'), $es4.$$call(add, null, null, 'toString', $es4.$$EMPTY_ARRAY)]), '=');
						$es4.$$set(statement, null, null, 'conditionExpression', booleanExpression, '=');
					}
					else
					{
						$es4.$$set(statement, null, null, 'conditionExpression', matchExpression(false, namedFunctionExpressions), '=');
					}
					if (!foundCompileConstantIdentifier)
					{
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
					}
					foundCompileConstantIdentifier = false;
					openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					loopd:					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
					{
						innerStatement = matchStatement(false, namedFunctionExpressions);
						if (add)
						{
							$es4.$$call(statement, null, null, 'bodyStatements', 'push', [innerStatement]);
						}
						if (!openBraceTokenType)
						{
							break loopd;
						}
					}
					if (openBraceTokenType)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					}
					while (((innerToken1 = peek(1)) && (innerToken2 = peek(2))) && ($es4.$$get(innerToken1, null, null, 'type') == $es4.$$get(Token, null, null, 'ElseTokenType') && $es4.$$get(innerToken2, null, null, 'type') == $es4.$$get(Token, null, null, 'IfTokenType')))
					{
						match($es4.$$get(Token, null, null, 'ElseTokenType'));
						match($es4.$$get(Token, null, null, 'IfTokenType'));
						var elseIfStatement = $es4.$$call(Construct, null, null, 'getNewElseIfStatement', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						$es4.$$set(elseIfStatement, null, null, 'conditionExpression', matchExpression(false, namedFunctionExpressions), '=');
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						loope:						while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							$es4.$$call(elseIfStatement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
							if (!openBraceTokenType)
							{
								break loope;
							}
						}
						if (openBraceTokenType)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						$es4.$$call(statement, null, null, 'elseIfStatements', 'push', [elseIfStatement]);
					}
					while ((innerToken1 = peek(1)) && ($es4.$$get(innerToken1, null, null, 'type') == $es4.$$get(Token, null, null, 'ElseTokenType')))
					{
						var elseStatement = $es4.$$call(Construct, null, null, 'getNewElseStatement', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'ElseTokenType'));
						openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						loopf:						while ((innerInnerToken = peek(1)) && ($es4.$$get(innerInnerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							innerStatement = matchStatement(false, namedFunctionExpressions);
							if (inCompileConstantLocal)
							{
								if (!add)
								{
									$es4.$$call(elseStatement, null, null, 'bodyStatements', 'push', [innerStatement]);
								}
							}
							else
							{
								$es4.$$call(elseStatement, null, null, 'bodyStatements', 'push', [innerStatement]);
							}
							if (!openBraceTokenType)
							{
								break loopf;
							}
						}
						if (openBraceTokenType)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						$es4.$$set(statement, null, null, 'elseStatement', elseStatement, '=');
					}
					if (inCompileConstantLocal)
					{
						inCompileConstant = false;
					}
					break;
				case $es4.$$get(Token, null, null, 'WhileTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewWhileStatement', $es4.$$EMPTY_ARRAY);
					match($es4.$$get(Token, null, null, 'WhileTokenType'));
					match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					$es4.$$set(statement, null, null, 'conditionExpression', matchExpression(false, namedFunctionExpressions), '=');
					match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
					openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					loopg:					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
					{
						$es4.$$call(statement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
						if (!openBraceTokenType)
						{
							break loopg;
						}
					}
					if (openBraceTokenType)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					}
					break;
				case $es4.$$get(Token, null, null, 'DoTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewDoWhileStatement', $es4.$$EMPTY_ARRAY);
					match($es4.$$get(Token, null, null, 'DoTokenType'));
					openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					looph:					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
					{
						$es4.$$call(statement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
						if (!openBraceTokenType)
						{
							break looph;
						}
					}
					if (openBraceTokenType)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					}
					match($es4.$$get(Token, null, null, 'WhileTokenType'));
					match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					$es4.$$set(statement, null, null, 'conditionExpression', matchExpression(false, namedFunctionExpressions), '=');
					match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
					break;
				case $es4.$$get(Token, null, null, 'ForTokenType'):
					match($es4.$$get(Token, null, null, 'ForTokenType'));
					if ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'EachTokenType'))
					{
						match($es4.$$get(Token, null, null, 'EachTokenType'));
						statement = $es4.$$call(Construct, null, null, 'getNewForEachStatement', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						$es4.$$set(statement, null, null, 'variableStatement', matchStatement(false, namedFunctionExpressions, true), '=');
						match($es4.$$get(Token, null, null, 'InTokenType'));
						$es4.$$set(statement, null, null, 'arrayExpression', matchExpression(false, namedFunctionExpressions), '=');
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						loopi:						while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							$es4.$$call(statement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
							if (!openBraceTokenType)
							{
								break loopi;
							}
						}
						if (openBraceTokenType)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						break;
					}
					match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					var ahead = 1;
					var openParens = 1;
					var closedParens = 0;
					var inTokenFound = false;
					while (innerToken = peek(ahead))
					{
						if ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'OpenParenTokenType'))
						{
							openParens++;
						}
						if ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'ClosedParenTokenType'))
						{
							closedParens++;
						}
						if ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'InTokenType'))
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
						statement = $es4.$$call(Construct, null, null, 'getNewForInStatement', $es4.$$EMPTY_ARRAY);
						$es4.$$set(statement, null, null, 'variableStatement', matchStatement(false, namedFunctionExpressions, true), '=');
						match($es4.$$get(Token, null, null, 'InTokenType'));
						$es4.$$set(statement, null, null, 'objectExpression', matchExpression(false, namedFunctionExpressions), '=');
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
					}
					else
					{
						statement = $es4.$$call(Construct, null, null, 'getNewForStatement', $es4.$$EMPTY_ARRAY);
						var eosTokenType = match($es4.$$get(Token, null, null, 'EOSTokenType'), 1);
						if (!eosTokenType)
						{
							$es4.$$set(statement, null, null, 'variableStatement', matchStatement(true, namedFunctionExpressions), '=');
							match($es4.$$get(Token, null, null, 'EOSTokenType'));
						}
						eosTokenType = match($es4.$$get(Token, null, null, 'EOSTokenType'), 1);
						if (!eosTokenType)
						{
							$es4.$$set(statement, null, null, 'conditionExpression', matchExpression(false, namedFunctionExpressions), '=');
							match($es4.$$get(Token, null, null, 'EOSTokenType'));
						}
						var closedParenTokenType = match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), 1);
						if (!closedParenTokenType)
						{
							$es4.$$set(statement, null, null, 'afterthoughtExpression', matchExpression(false, namedFunctionExpressions), '=');
							match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						}
					}
					openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					loop2f:					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
					{
						$es4.$$call(statement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
						if (!openBraceTokenType)
						{
							break loop2f;
						}
					}
					if (openBraceTokenType)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					}
					break;
				case $es4.$$get(Token, null, null, 'BreakTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewBreakStatement', $es4.$$EMPTY_ARRAY);
					$es4.$$set(statement, null, null, 'token', match($es4.$$get(Token, null, null, 'BreakTokenType')), '=');
					$es4.$$set(statement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType'), true), '=');
					break;
				case $es4.$$get(Token, null, null, 'ContinueTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewContinueStatement', $es4.$$EMPTY_ARRAY);
					$es4.$$set(statement, null, null, 'token', match($es4.$$get(Token, null, null, 'ContinueTokenType')), '=');
					$es4.$$set(statement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType'), true), '=');
					break;
				case $es4.$$get(Token, null, null, 'ThrowTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewThrowStatement', $es4.$$EMPTY_ARRAY);
					$es4.$$set(statement, null, null, 'token', match($es4.$$get(Token, null, null, 'ThrowTokenType')), '=');
					$es4.$$set(statement, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
					break;
				case $es4.$$get(Token, null, null, 'UseTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewUseStatement', $es4.$$EMPTY_ARRAY);
					$es4.$$set(statement, null, null, 'useToken', match($es4.$$get(Token, null, null, 'UseTokenType')), '=');
					match($es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'));
					$es4.$$set(statement, null, null, 'namespaceIdentifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
					break;
				case $es4.$$get(Token, null, null, 'TryTokenType'):
					match($es4.$$get(Token, null, null, 'TryTokenType'));
					statement = $es4.$$call(Construct, null, null, 'getNewTryStatement', $es4.$$EMPTY_ARRAY);
					openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					loop2g:					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
					{
						$es4.$$call(statement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
						if (!openBraceTokenType)
						{
							break loop2g;
						}
					}
					if (openBraceTokenType)
					{
						match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					}
					while (match($es4.$$get(Token, null, null, 'CatchTokenType'), true))
					{
						var catchStatement = $es4.$$call(Construct, null, null, 'getNewCatchStatement', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						$es4.$$set(catchStatement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
						{
							$es4.$$set(catchStatement, null, null, 'typeConstruct', matchTypeConstruct(), '=');
						}
						else
						{
							$es4.$$set(catchStatement, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(catchStatement, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
						}
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						loopt:						while ((innerInnerToken = peek(1)) && ($es4.$$get(innerInnerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							$es4.$$call(catchStatement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
							if (!openBraceTokenType)
							{
								break loopt;
							}
						}
						if (openBraceTokenType)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						$es4.$$call(statement, null, null, 'catchStatements', 'push', [catchStatement]);
					}
					while (match($es4.$$get(Token, null, null, 'FinallyTokenType'), true))
					{
						var finallyStatement = $es4.$$call(Construct, null, null, 'getNewFinallyStatement', $es4.$$EMPTY_ARRAY);
						openBraceTokenType = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						loopx:						while ((innerInnerToken = peek(1)) && ($es4.$$get(innerInnerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							$es4.$$call(finallyStatement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
							if (!openBraceTokenType)
							{
								break loopx;
							}
						}
						if (openBraceTokenType)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						$es4.$$set(statement, null, null, 'finallyStatement', finallyStatement, '=');
					}
					break;
				case $es4.$$get(Token, null, null, 'VarTokenType'):
				case $es4.$$get(Token, null, null, 'ConstTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewVarStatement', $es4.$$EMPTY_ARRAY);
					if (match($es4.$$get(Token, null, null, 'VarTokenType'), true))
					{
					}
					else
					{
						match($es4.$$get(Token, null, null, 'ConstTokenType'), true);
					}
					$es4.$$set(statement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
					if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
					{
						$es4.$$set(statement, null, null, 'typeConstruct', matchTypeConstruct(), '=');
					}
					else
					{
						$es4.$$set(statement, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
						$es4.$$set(statement, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
					}
					if (match($es4.$$get(Token, null, null, 'AssignmentTokenType'), true))
					{
						$es4.$$set(statement, null, null, 'valueExpression', matchExpression(true, namedFunctionExpressions), '=');
					}
					while (match($es4.$$get(Token, null, null, 'CommaTokenType'), true))
					{
						var innerVarStatement = $es4.$$call(Construct, null, null, 'getNewVarStatement', $es4.$$EMPTY_ARRAY);
						$es4.$$set(innerVarStatement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
						{
							$es4.$$set(innerVarStatement, null, null, 'typeConstruct', matchTypeConstruct(), '=');
						}
						else
						{
							$es4.$$set(innerVarStatement, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(innerVarStatement, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
						}
						if (match($es4.$$get(Token, null, null, 'AssignmentTokenType'), true))
						{
							$es4.$$set(innerVarStatement, null, null, 'valueExpression', matchExpression(true, namedFunctionExpressions), '=');
						}
						$es4.$$call(statement, null, null, 'innerVarStatements', 'push', [innerVarStatement]);
					}
					break;
				case $es4.$$get(Token, null, null, 'SwitchTokenType'):
					statement = $es4.$$call(Construct, null, null, 'getNewSwitchStatement', $es4.$$EMPTY_ARRAY);
					match($es4.$$get(Token, null, null, 'SwitchTokenType'));
					match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
					$es4.$$set(statement, null, null, 'valueExpression', matchExpression(false, namedFunctionExpressions), '=');
					match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
					match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
					while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'CaseTokenType') || $es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'DefaultTokenType')))
					{
						var caseStatement = $es4.$$call(Construct, null, null, 'getNewCaseStatement', $es4.$$EMPTY_ARRAY);
						if ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'CaseTokenType'))
						{
							match($es4.$$get(Token, null, null, 'CaseTokenType'));
							$es4.$$set(caseStatement, null, null, 'valueExpression', matchExpression(false, namedFunctionExpressions), '=');
						}
						if ($es4.$$get(innerToken, null, null, 'type') == $es4.$$get(Token, null, null, 'DefaultTokenType'))
						{
							$es4.$$set(caseStatement, null, null, 'defaultToken', match($es4.$$get(Token, null, null, 'DefaultTokenType')), '=');
						}
						match($es4.$$get(Token, null, null, 'ColonTokenType'));
						var openFound = match($es4.$$get(Token, null, null, 'OpenBraceTokenType'), true);
						while ((innerToken = peek(1)) && ($es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'CaseTokenType') && $es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'DefaultTokenType') && $es4.$$get(innerToken, null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType')))
						{
							$es4.$$call(caseStatement, null, null, 'bodyStatements', 'push', [matchStatement(false, namedFunctionExpressions)]);
						}
						if (openFound)
						{
							match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
						}
						$es4.$$call(statement, null, null, 'caseStatements', 'push', [caseStatement]);
					}
					match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'));
					break;
				default:
					if ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'IdentifierTokenType') && (peek(2) && $es4.$$get(peek(2), null, null, 'type') == $es4.$$get(Token, null, null, 'ColonTokenType')))
					{
						statement = $es4.$$call(Construct, null, null, 'getNewLabelStatement', $es4.$$EMPTY_ARRAY);
						$es4.$$set(statement, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType')), '=');
						match($es4.$$get(Token, null, null, 'ColonTokenType'));
						break;
					}
					statement = matchExpression(false, namedFunctionExpressions, false, false, dontReadIn);
			}
			if (!dontmatchEOS)
			{
				match($es4.$$get(Token, null, null, 'EOSTokenType'), true, true);
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
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'OpenParenTokenType'):
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						expression = $es4.$$call(Construct, null, null, 'getNewParenExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
						match($es4.$$get(Token, null, null, 'ClosedParenTokenType'));
						if (peek(1) && ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'DotTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenBracketTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenParenTokenType')))
						{
							construct = $es4.$$call(Construct, null, null, 'getNewParenConstruct', $es4.$$EMPTY_ARRAY);
							$es4.$$set(construct, null, null, 'expression', expression, '=');
							expression = matchPropertyExpression(construct);
						}
						break;
					case $es4.$$get(Token, null, null, 'NumberTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewNumberExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'numberToken', match($es4.$$get(Token, null, null, 'NumberTokenType')), '=');
						break;
					case $es4.$$get(Token, null, null, 'StringTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewStringExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'stringToken', match($es4.$$get(Token, null, null, 'StringTokenType')), '=');
						while (token = match($es4.$$get(Token, null, null, 'StringChunkTokenType'), true))
						{
							$es4.$$call(expression, null, null, 'stringChunkTokens', 'push', [token]);
						}
						$es4.$$set(expression, null, null, 'stringEndToken', match($es4.$$get(Token, null, null, 'StringEndTokenType')), '=');
						if (peek(1) && ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'DotTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenBracketTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenParenTokenType')))
						{
							construct = $es4.$$call(Construct, null, null, 'getNewParenConstruct', $es4.$$EMPTY_ARRAY);
							$es4.$$set(construct, null, null, 'expression', expression, '=');
							expression = matchPropertyExpression(construct);
						}
						break;
					case $es4.$$get(Token, null, null, 'ReturnTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewReturnExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'ReturnTokenType'));
						if ($es4.$$get(peek(1), null, null, 'type') != $es4.$$get(Token, null, null, 'ClosedBraceTokenType') && $es4.$$get(peek(1), null, null, 'type') != $es4.$$get(Token, null, null, 'EOSTokenType'))
						{
							$es4.$$set(expression, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'DeleteTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewDeleteExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'DeleteTokenType'));
						$es4.$$set(expression, null, null, 'expression', matchExpression(ignoreCommas, namedFunctionExpressions, true), '=');
						break;
					case $es4.$$get(Token, null, null, 'FunctionTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewFunctionExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'FunctionTokenType'));
						$es4.$$set(expression, null, null, 'identifierToken', match($es4.$$get(Token, null, null, 'IdentifierTokenType'), true), '=');
						if ($es4.$$get(expression, null, null, 'identifierToken') && namedFunctionExpressions)
						{
							$es4.$$call(namedFunctionExpressions, null, null, 'push', [expression]);
						}
						match($es4.$$get(Token, null, null, 'OpenParenTokenType'));
						while (!match($es4.$$get(Token, null, null, 'ClosedParenTokenType'), true))
						{
							$es4.$$call(expression, null, null, 'parameterConstructs', 'push', [matchParameterConstruct()]);
							match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
						}
						if (match($es4.$$get(Token, null, null, 'ColonTokenType'), true))
						{
							$es4.$$set(expression, null, null, 'typeConstruct', matchTypeConstruct(), '=');
						}
						else
						{
							$es4.$$set(expression, null, null, 'typeConstruct', $es4.$$call(Construct, null, null, 'getNewTypeConstruct', $es4.$$EMPTY_ARRAY), '=');
							$es4.$$set(expression, null, null, 'typeConstruct', 'mulToken', $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'MulTokenType'), '*']), '=');
						}
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						while (!match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'), true))
						{
							$es4.$$call(expression, null, null, 'bodyStatements', 'push', [matchStatement(false, $es4.$$get(expression, null, null, 'namedFunctionExpressions'))]);
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBraceTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewObjectExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'OpenBraceTokenType'));
						while (!match($es4.$$get(Token, null, null, 'ClosedBraceTokenType'), true))
						{
							var objectPropertyConstruct = $es4.$$call(Construct, null, null, 'getNewObjectPropertyConstruct', $es4.$$EMPTY_ARRAY);
							$es4.$$set(objectPropertyConstruct, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
							match($es4.$$get(Token, null, null, 'ColonTokenType'));
							$es4.$$set(objectPropertyConstruct, null, null, 'valueExpression', matchExpression(true, namedFunctionExpressions), '=');
							$es4.$$call(expression, null, null, 'objectPropertyConstructs', 'push', [objectPropertyConstruct]);
							match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
						}
						if (peek(1) && ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'DotTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenBracketTokenType')))
						{
							expression = matchPropertyExpression($es4.$$call(Construct, null, null, 'getNewObjectConstruct', [expression]));
						}
						break;
					case $es4.$$get(Token, null, null, 'OpenBracketTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewArrayExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'OpenBracketTokenType'));
						while (!match($es4.$$get(Token, null, null, 'ClosedBracketTokenType'), true))
						{
							$es4.$$call(expression, null, null, 'valueExpressions', 'push', [matchExpression(true, namedFunctionExpressions)]);
							match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
						}
						if (peek(1) && ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'DotTokenType') || $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'OpenBracketTokenType')))
						{
							expression = matchPropertyExpression($es4.$$call(Construct, null, null, 'getNewArrayConstruct', [expression]));
						}
						break;
					case $es4.$$get(Token, null, null, 'BooleanTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewBooleanExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'booleanToken', match($es4.$$get(Token, null, null, 'BooleanTokenType')), '=');
						break;
					case $es4.$$get(Token, null, null, 'NaNTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'NaNTokenType'))]);
						break;
					case $es4.$$get(Token, null, null, 'UndefinedTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'UndefinedTokenType'))]);
						break;
					case $es4.$$get(Token, null, null, 'ThisTokenType'):
						expression = matchPropertyExpression();
						break;
					case $es4.$$get(Token, null, null, 'NullTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'NullTokenType'))]);
						break;
					case $es4.$$get(Token, null, null, 'AddTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'AddTokenType')), matchExpression(true, namedFunctionExpressions, true)]);
						break;
					case $es4.$$get(Token, null, null, 'SubTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'SubTokenType')), matchExpression(true, namedFunctionExpressions, true)]);
						break;
					case $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'):
						match($es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'));
						var isXMLList = $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType');
						var openTags = 1;
						var xmlString = '<';
						if (isXMLList)
						{
							expression = $es4.$$call(Construct, null, null, 'getNewXMLListExpression', $es4.$$EMPTY_ARRAY);
							match($es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'));
							match($es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'));
						}
						else
						{
							expression = $es4.$$call(Construct, null, null, 'getNewXMLExpression', $es4.$$EMPTY_ARRAY);
						}
						var inNode = true;
						while ((openTags || inNode || isXMLList) && (token = next(1)))
						{
							if (isXMLList)
							{
								if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType') && peek(1) && $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType') && peek(2) && $es4.$$get(peek(2), null, null, 'type') == $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'))
								{
									match($es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'));
									match($es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'));
									break;
								}
							}
							else
							{
								if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'))
								{
									inNode = true;
								}
								if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType') && peek(1) && $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType'))
								{
									openTags--;
								}
								else if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLOpenArrowTokenType'))
								{
									openTags++;
								}
								if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLForwardSlashTokenType') && peek(1) && $es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'))
								{
									openTags--;
								}
								if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'XMLClosedArrowTokenType'))
								{
									inNode = false;
								}
							}
							if ($es4.$$get(token, null, null, 'data') == "'")
							{
								$es4.$$set(token, null, null, 'data', "\\'", '=');
							}
							if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'NewLineTokenType'))
							{
								xmlString += '\\' + $es4.$$get(token, null, null, 'data');
							}
							else
							{
								xmlString += $es4.$$get(token, null, null, 'data');
							}
						}
						$es4.$$set(expression, null, null, 'string', xmlString, '=');
						break;
					case $es4.$$get(Token, null, null, 'RegExpTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewRegExpression', $es4.$$EMPTY_ARRAY);
						regExpString = $es4.$$get(match($es4.$$get(Token, null, null, 'RegExpTokenType')), null, null, 'data');
						while ((token = peek(1, 1)) && $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'SpecialUFOTokenType'))
						{
							token = next();
							regExpString += $es4.$$get(token, null, null, 'data');
						}
						$es4.$$set(expression, null, null, 'string', regExpString, '=');
						break;
					case $es4.$$get(Token, null, null, 'DivTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewRegExpression', $es4.$$EMPTY_ARRAY);
						regExpString = $es4.$$get(match($es4.$$get(Token, null, null, 'DivTokenType')), null, null, 'data');
						while (token = next(2))
						{
							regExpString += $es4.$$get(token, null, null, 'data');
							if ($es4.$$call(regExpString, null, null, 'charAt', [$es4.$$get(regExpString, null, null, 'length') - 1]) == '/' && $es4.$$call(regExpString, null, null, 'charAt', [$es4.$$get(regExpString, null, null, 'length') - 2]) != '\\')
							{
								break;
							}
						}
						while (token = peek(1, 1))
						{
							if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'NewLineTokenType') || $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'TabTokenType') || $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'SpaceTokenType') || $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'EOSTokenType') || $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'CommaTokenType'))
							{
								break;
							}
							token = next();
							regExpString += $es4.$$get(token, null, null, 'data');
						}
						$es4.$$set(expression, null, null, 'string', regExpString, '=');
						break;
					case $es4.$$get(Token, null, null, 'IncrementTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewPrefixExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'incrementToken', match($es4.$$get(Token, null, null, 'IncrementTokenType')), '=');
						$es4.$$set(expression, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
						if ($es4.$$get(expression, null, null, 'expression', 'constructor') != $es4.$$get(Construct, null, null, 'BinaryExpression'))
						{
							break;
						}
						prefixExpression = expression;
						binaryExpression = expression = $es4.$$get(expression, null, null, 'expression');
						binaryExpressionParent = binaryExpression;
						while ($es4.$$get(binaryExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'BinaryExpression'))
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = $es4.$$get(binaryExpression, null, null, 'leftExpression');
						}
						while ($es4.$$get(binaryExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = $es4.$$get(binaryExpression, null, null, 'expression');
						}
						$es4.$$set(prefixExpression, null, null, 'expression', binaryExpression, '=');
						if ($es4.$$get(binaryExpressionParent, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
						{
							$es4.$$set(binaryExpressionParent, null, null, 'expression', prefixExpression, '=');
						}
						else
						{
							$es4.$$set(binaryExpressionParent, null, null, 'leftExpression', prefixExpression, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'DecrementTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewPrefixExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'decrementToken', match($es4.$$get(Token, null, null, 'DecrementTokenType')), '=');
						$es4.$$set(expression, null, null, 'expression', matchExpression(false, namedFunctionExpressions), '=');
						if ($es4.$$get(expression, null, null, 'expression', 'constructor') != $es4.$$get(Construct, null, null, 'BinaryExpression'))
						{
							break;
						}
						prefixExpression = expression;
						binaryExpression = expression = $es4.$$get(expression, null, null, 'expression');
						binaryExpressionParent = binaryExpression;
						while ($es4.$$get(binaryExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'BinaryExpression'))
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = $es4.$$get(binaryExpression, null, null, 'leftExpression');
						}
						while ($es4.$$get(binaryExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
						{
							binaryExpressionParent = binaryExpression;
							binaryExpression = $es4.$$get(binaryExpression, null, null, 'expression');
						}
						$es4.$$set(prefixExpression, null, null, 'expression', binaryExpression, '=');
						if ($es4.$$get(binaryExpressionParent, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
						{
							$es4.$$set(binaryExpressionParent, null, null, 'expression', prefixExpression, '=');
						}
						else
						{
							$es4.$$set(binaryExpressionParent, null, null, 'leftExpression', prefixExpression, '=');
						}
						break;
					case $es4.$$get(Token, null, null, 'BitwiseNotTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'BitwiseNotTokenType')), matchExpression(false, namedFunctionExpressions, true)]);
						break;
					case $es4.$$get(Token, null, null, 'NotTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'NotTokenType')), matchExpression(false, namedFunctionExpressions, true)]);
						break;
					case $es4.$$get(Token, null, null, 'TypeofTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'TypeofTokenType')), matchExpression(false, namedFunctionExpressions, true)]);
						break;
					case $es4.$$get(Token, null, null, 'SuperTokenType'):
						expression = matchPropertyExpression();
						break;
					case $es4.$$get(Token, null, null, 'NewTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewNewExpression', $es4.$$EMPTY_ARRAY);
						match($es4.$$get(Token, null, null, 'NewTokenType'));
						if ($es4.$$get(peek(1), null, null, 'type') == $es4.$$get(Token, null, null, 'RelationalTokenType'))
						{
							next();
							next();
							next();
							expression = matchExpression(ignoreCommas, namedFunctionExpressions, true);
							break;
						}
						$es4.$$set(expression, null, null, 'expression', matchExpression(ignoreCommas, namedFunctionExpressions, true), '=');
						break;
					case $es4.$$get(Token, null, null, 'IdentifierTokenType'):
						expression = matchPropertyExpression();
						$es4.$$set(expression, null, null, 'root', true, '=');
						break;
					case $es4.$$get(Token, null, null, 'AtTokenType'):
						expression = matchPropertyExpression();
						break;
					case $es4.$$get(Token, null, null, 'VoidTokenType'):
						expression = $es4.$$call(Construct, null, null, 'getNewExpression', [match($es4.$$get(Token, null, null, 'VoidTokenType')), matchExpression(false, namedFunctionExpressions, null, true)]);
						break;
					default:
						if (optional)
						{
							expression = $es4.$$call(Construct, null, null, 'getNewEmptyExpression', $es4.$$EMPTY_ARRAY);
							break;
						}
						throw error('Unexpected token found10.', token);
				}
				token = match($es4.$$get(Token, null, null, 'IncrementTokenType'), true) || match($es4.$$get(Token, null, null, 'DecrementTokenType'), true);
				if (token)
				{
					var originalExpression = expression;
					expression = $es4.$$call(Construct, null, null, 'getNewPostfixExpression', $es4.$$EMPTY_ARRAY);
					if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'IncrementTokenType'))
					{
						$es4.$$set(expression, null, null, 'incrementToken', token, '=');
					}
					else
					{
						$es4.$$set(expression, null, null, 'decrementToken', token, '=');
					}
					$es4.$$set(expression, null, null, 'expression', originalExpression, '=');
				}
				if (operand)
				{
					return expression;
				}
				$es4.$$call(expressions, null, null, 'push', [expression]);
				token = match($es4.$$get(Token, null, null, 'AssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'AddTokenType'), true) || match($es4.$$get(Token, null, null, 'AsTokenType'), true) || match((dontReadIn) ? $es4.$$get(Token, null, null, 'SubTokenType') : $es4.$$get(Token, null, null, 'InTokenType'), true) || match($es4.$$get(Token, null, null, 'SubTokenType'), true) || match($es4.$$get(Token, null, null, 'MulTokenType'), true) || match($es4.$$get(Token, null, null, 'DivTokenType'), true) || match($es4.$$get(Token, null, null, 'ModTokenType'), true) || match($es4.$$get(Token, null, null, 'TernaryTokenType'), true) || match($es4.$$get(Token, null, null, 'IsTokenType'), true) || match($es4.$$get(Token, null, null, 'InstanceofTokenType'), true) || match($es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'AndTokenType'), true) || match($es4.$$get(Token, null, null, 'OrTokenType'), true) || match($es4.$$get(Token, null, null, 'EqualityTokenType'), true) || match($es4.$$get(Token, null, null, 'RelationalTokenType'), true) || match($es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseAndTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseOrTokenType'), true) || match($es4.$$get(Token, null, null, 'BitwiseXorTokenType'), true);
				if (!ignoreCommas && !token)
				{
					token = match($es4.$$get(Token, null, null, 'CommaTokenType'), true);
				}
				if (token && $es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'TernaryTokenType'))
				{
					ternaryTokens++;
				}
				else if (!token && ternaryTokens)
				{
					token = match($es4.$$get(Token, null, null, 'ColonTokenType'));
					ternaryTokens--;
				}
				if (!token)
				{
					break loopy;
				}
				$es4.$$call(expressions, null, null, 'push', [token]);
			}
			return combineExpressions(expressions);

			function getBinaryTernaryOperatorPrecedence($$$$token) 
			{
				//set default parameter values
				var token = $$$$token;

				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'ColonTokenType'):
						return -1;
					case $es4.$$get(Token, null, null, 'CommaTokenType'):
						return 1;
					case $es4.$$get(Token, null, null, 'AssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'):
					case $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'):
						return 2;
					case $es4.$$get(Token, null, null, 'TernaryTokenType'):
						return 3;
					case $es4.$$get(Token, null, null, 'OrTokenType'):
						return 4;
					case $es4.$$get(Token, null, null, 'AndTokenType'):
						return 5;
					case $es4.$$get(Token, null, null, 'BitwiseOrTokenType'):
						return 6;
					case $es4.$$get(Token, null, null, 'BitwiseXorTokenType'):
						return 7;
					case $es4.$$get(Token, null, null, 'BitwiseAndTokenType'):
						return 8;
					case $es4.$$get(Token, null, null, 'EqualityTokenType'):
						return 9;
					case $es4.$$get(Token, null, null, 'RelationalTokenType'):
					case $es4.$$get(Token, null, null, 'AsTokenType'):
					case $es4.$$get(Token, null, null, 'InTokenType'):
					case $es4.$$get(Token, null, null, 'InstanceofTokenType'):
					case $es4.$$get(Token, null, null, 'IsTokenType'):
						return 10;
					case $es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'):
					case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'):
						return 11;
					case $es4.$$get(Token, null, null, 'AddTokenType'):
					case $es4.$$get(Token, null, null, 'SubTokenType'):
						return 12;
					case $es4.$$get(Token, null, null, 'MulTokenType'):
					case $es4.$$get(Token, null, null, 'DivTokenType'):
					case $es4.$$get(Token, null, null, 'ModTokenType'):
						return 13;
					default:
						throw $es4.$$primitive(new (Error)('unknown binary/ternary operator: ' + $es4.$$get(token, null, null, 'type', 'name')));
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
				while ($es4.$$get(expressions, null, null, 'length') > 1 && currentOperatorPrecedence)
				{
					if (i >= $es4.$$get(expressions, null, null, 'length') - 1)
					{
						i = -1;
						currentOperatorPrecedence--;
					}
					i++;
					if (i % 2 == 0)
					{
						continue;
					}
					var token = $es4.$$get(expressions, null, null, i);
					if (getBinaryTernaryOperatorPrecedence(token) != currentOperatorPrecedence)
					{
						continue;
					}
					if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'TernaryTokenType'))
					{
						expression = $es4.$$call(Construct, null, null, 'getNewTernaryExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'conditionExpression', $es4.$$get(expressions, null, null, i - 1), '=');
						var index = i + 1;
						var ternaryTokens = 1;
						var colonTokens = 0;
						var innerExpressions = [];
						while (ternaryTokens != colonTokens && index < $es4.$$get(expressions, null, null, 'length') - 1)
						{
							$es4.$$call(innerExpressions, null, null, 'push', [$es4.$$get(expressions, null, null, index)]);
							if (index % 2 == 0)
							{
								index++;
								continue;
							}
							if ($es4.$$get(expressions, null, null, index, 'type') == $es4.$$get(Token, null, null, 'TernaryTokenType'))
							{
								ternaryTokens++;
							}
							else if ($es4.$$get(expressions, null, null, index, 'type') == $es4.$$get(Token, null, null, 'ColonTokenType'))
							{
								colonTokens++;
							}
							index++;
						}
						$es4.$$set(expression, null, null, 'trueExpression', combineExpressions($es4.$$call(innerExpressions, null, null, 'slice', [0, $es4.$$get(innerExpressions, null, null, 'length') - 1])), '=');
						$es4.$$set(expression, null, null, 'falseExpression', combineExpressions($es4.$$call(expressions, null, null, 'slice', [index])), '=');
						begin = $es4.$$call(expressions, null, null, 'slice', [0, i - 1]);
						expressions = $es4.$$call(begin, null, null, 'concat', [[expression]]);
					}
					else
					{
						expression = $es4.$$call(Construct, null, null, 'getNewBinaryExpression', $es4.$$EMPTY_ARRAY);
						$es4.$$set(expression, null, null, 'token', token, '=');
						$es4.$$set(expression, null, null, 'leftExpression', $es4.$$get(expressions, null, null, i - 1), '=');
						$es4.$$set(expression, null, null, 'rightExpression', $es4.$$get(expressions, null, null, i + 1), '=');
						begin = $es4.$$call(expressions, null, null, 'slice', [0, i - 1]);
						var end = $es4.$$call(expressions, null, null, 'slice', [i + 2]);
						expressions = $es4.$$call(begin, null, null, 'concat', [[expression], end]);
					}
					i = -1;
				}
				return $es4.$$get(expressions, null, null, 0);
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
				throw error('Expected token type: ' + $es4.$$get(type, null, null, 'name') + '. No token found.', null);
			}
			if (!token)
			{
				return false;
			}
			if ($es4.$$get(token, null, null, 'type') != type && !optional)
			{
				throw error('Expected token type: ' + type + '. Got', token);
			}
			if ($es4.$$get(token, null, null, 'type') != type)
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
			while (index < $es4.$$get(tokens, null, null, 'length') - 1)
			{
				var token = $es4.$$get(tokens, null, null, ++index);
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'CommentTokenType'):
					case $es4.$$get(Token, null, null, 'CommentChunkTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentChunkTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentEndTokenType'):
						if (includeLevel == 1 || includeLevel == 0)
						{
							break;
						}
					case $es4.$$get(Token, null, null, 'NewLineTokenType'):
					case $es4.$$get(Token, null, null, 'TabTokenType'):
					case $es4.$$get(Token, null, null, 'SpaceTokenType'):
						if (includeLevel == 0)
						{
							break;
						}
					default:
						if (keywordStrictMode)
						{
							return token;
						}
						if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'StaticTokenType'))
						{
							token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'IdentifierTokenType'), 'static']);
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
				if (ahead > 0 && i >= $es4.$$get(tokens, null, null, 'length') - 1)
				{
					break;
				}
				if (ahead < 0 && i < 1)
				{
					break;
				}
				var token = (ahead > 0) ? $es4.$$get(tokens, null, null, ++i) : $es4.$$get(tokens, null, null, --i);
				switch ($es4.$$get(token, null, null, 'type'))
				{
					case $es4.$$get(Token, null, null, 'CommentTokenType'):
					case $es4.$$get(Token, null, null, 'CommentChunkTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentChunkTokenType'):
					case $es4.$$get(Token, null, null, 'MultiLineCommentEndTokenType'):
						break;
					case $es4.$$get(Token, null, null, 'TabTokenType'):
					case $es4.$$get(Token, null, null, 'SpaceTokenType'):
					case $es4.$$get(Token, null, null, 'NewLineTokenType'):
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
							if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'StaticTokenType'))
							{
								token = $es4.$$call(Token, null, null, 'getNewToken', [$es4.$$get(Token, null, null, 'IdentifierTokenType'), 'static']);
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
				trace($es4.$$get(tokens, null, null, i, 'line') + ' : ' + $es4.$$get(tokens, null, null, i, 'position') + ' : ' + $es4.$$get(tokens, null, null, i, 'type') + ' => ' + $es4.$$get(tokens, null, null, i, 'data'));
			}
			if (token)
			{
				return $es4.$$primitive(new (Error)(string + ' token type ' + $es4.$$get(token, null, null, 'type') + ' found on line ' + $es4.$$get(token, null, null, 'line') + ', at position ' + $es4.$$get(token, null, null, 'position')));
			}
			else
			{
				return $es4.$$primitive(new (Error)(string));
			}
		}
;

		if ($es4.$$get(statementImportConstructs, null, null, 'length'))
		{
			$es4.$$set(rootConstruct, null, null, 'packageConstruct', 'importConstructs', $es4.$$call(rootConstruct, null, null, 'packageConstruct', 'importConstructs', 'concat', [statementImportConstructs]), '=');
		}
		return rootConstruct;
	}));

	function Parser()
	{
		//initialize class if not initialized
		if (Parser.$$cinit !== undefined) Parser.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Parser) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Parser) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Parser, null, 'sweetrush.core::Parser');
})();
//sweetrush.core.Parser


//sweetrush.core.TranslatorPrototype
$es4.$$package('sweetrush.core').TranslatorPrototype = (function ()
{
	//imports
	var Construct;
	var Token;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//class initializer
	TranslatorPrototype.$$cinit = (function ()
	{
		TranslatorPrototype.$$cinit = undefined;

		//initialize imports
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Parser = $es4.$$['sweetrush.core'].Parser;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;
	});

	//method
	$es4.$$public_function('translate', TranslatorPrototype, (function ($$$$rootConstruct, $$$$rootConstructs, $$$$dynamicPropertyAccess, $$$$release, $$$$fastPropertyAccess)
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
				throw $es4.$$primitive(new (Error)('cannot lookup empty rootConstruct/object: ' + rootConstruct + ', ' + object));
			}
			else if ($es4.$$is(object, String))
			{
				for (var i = 0; i < $es4.$$get(rootConstruct, null, null, 'classConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, null, null, 'classConstructs', i);
					}
				}
				for (var i = 0; i < $es4.$$get(rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
				{
					if ($es4.$$get(rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data') == object)
					{
						return $es4.$$get(rootConstruct, null, null, 'interfaceConstructs', i);
					}
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'classConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'classConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'interfaceConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'interfaceConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'propertyConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'propertyConstruct');
				}
				if ($es4.$$get(rootConstruct, null, null, 'packageConstruct', 'methodConstruct'))
				{
					return $es4.$$get(rootConstruct, null, null, 'packageConstruct', 'methodConstruct');
				}
				throw $es4.$$primitive(new (Error)('could not lookup construct in construct: ' + object));
			}
			if ($es4.$$get(object, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'NameConstruct'))
			{
				return lookupConstructInRootConstruct(rootConstruct, $es4.$$call(Construct, null, null, 'nameConstructToString', [object]));
			}
			else if ($es4.$$get(object, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ImportConstruct'))
			{
				return lookupConstructInRootConstruct(rootConstruct, $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(object, null, null, 'nameConstruct')]));
			}
		}
;

		var packageConstruct = $es4.$$get(rootConstruct, null, null, 'packageConstruct');
		var js = print('$es4.$$package(\'' + ($es4.$$get(packageConstruct, null, null, 'nameConstruct') ? $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) : '') + '\').', _indent, 0);
		if ($es4.$$get(packageConstruct, null, null, 'classConstruct'))
		{
			if ($es4.$$get(packageConstruct, null, null, 'classConstruct', 'UNIMPLEMENTEDToken'))
			{
				if (release)
				{
					js += $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data') + ' = null;\n';
					return js;
				}
				js = ($es4.$$get(packageConstruct, null, null, 'nameConstruct')) ? '$$package(\'' + $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) + '\')' : 'global';
				js += '.' + $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data');
				js += ' = function () { throw new Error(\'Use of unimplemented class: ' + $es4.$$get(packageConstruct, null, null, 'classConstruct', 'identifierToken', 'data') + '\'); }';
				js += '\n';
				return js;
			}
			js += print(translateClassConstruct($es4.$$get(packageConstruct, null, null, 'classConstruct')), _indent, 0);
		}
		js += ($es4.$$get(packageConstruct, null, null, 'interfaceConstruct')) ? print(translateInterfaceConstruct($es4.$$get(packageConstruct, null, null, 'interfaceConstruct')), _indent, 0) : '';
		js += ($es4.$$get(packageConstruct, null, null, 'propertyConstruct')) ? print(translatePropertyConstruct($es4.$$get(packageConstruct, null, null, 'propertyConstruct')), _indent, 0) : '';
		if ($es4.$$get(packageConstruct, null, null, 'methodConstruct'))
		{
			if ($es4.$$get(packageConstruct, null, null, 'methodConstruct', 'UNIMPLEMENTEDToken'))
			{
				if (release)
				{
					js += $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data') + ' = null;\n';
					return js;
				}
				js = ($es4.$$get(packageConstruct, null, null, 'nameConstruct')) ? '$es4.$$package(\'' + $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(packageConstruct, null, null, 'nameConstruct')]) + '\')' : 'global';
				js += '.' + $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data');
				js += ' = function () { throw new Error(\'Use of unimplemented function: ' + $es4.$$get(packageConstruct, null, null, 'methodConstruct', 'identifierToken', 'data') + '\'); }';
				js += '\n';
				return js;
			}
			_inStaticFunction = true;
			js += print(translateFunctionConstruct($es4.$$get(packageConstruct, null, null, 'methodConstruct')), _indent, 0);
		}
		return js;

		function getTranslatedTypeName($$$$type) 
		{
			//set default parameter values
			var type = $$$$type;

			if ($es4.$$get(type, null, null, 'name') == '*' || $es4.$$get(type, null, null, 'name') == 'void')
			{
				return '';
			}
			if ($es4.$$get(_importNameConflicts, null, null, $es4.$$get(type, null, null, 'name')))
			{
				var fullyQualifiedName = $es4.$$get(type, null, null, 'fullyQualifiedName');
				var parts = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
				var name = $es4.$$call(parts, null, null, 'pop', $es4.$$EMPTY_ARRAY);
				return '$es4.$$[\'' + $es4.$$call(parts, null, null, 'join', ['.']) + '\'].' + name;
			}
			return $es4.$$get(type, null, null, 'name');
		}
;

		function translateInterfaceConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var js = print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//handle cast', _indent + 2, 1);
			js += print('return $es4.$$as(arguments[0], ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ');', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var comma = false;
			var innerJS = '';
			if ($es4.$$get(construct, null, null, 'extendsNameConstructs', 'length'))
			{
				innerJS += 'IMPLEMENTS:[';
				for (var i = 0; i < $es4.$$get(construct, null, null, 'extendsNameConstructs', 'length'); i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = $es4.$$get(construct, null, null, 'extendsNameConstructs', i, 'type');
					var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'extendsNameConstructs', i));
					if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
					{
						innerJS += comma = $es4.$$get(type, null, null, 'fullyQualifiedName');
					}
					else
					{
						innerJS += comma = '\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!$es4.$$get(construct, null, null, 'isInternal'))
			{
				if ($es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
				if ($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
			}
			var packageName = $es4.$$get(construct, null, null, 'packageName');
			var fullyQualifiedName = (packageName) ? packageName + '::' + $es4.$$get(construct, null, null, 'identifierToken', 'data') : $es4.$$get(construct, null, null, 'identifierToken', 'data');
			if (innerJS)
			{
				js += print('return $es4.$$interface(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', ', _indent + 1, 0, 1);
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js += print('return $es4.$$interface(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', null, ', _indent + 1, 0);
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

			return print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = $es4.$$namespace(' + translateExpression($es4.$$get(construct, null, null, 'valueExpression'), _indent, false, construct) + ', true);', 0, 1);
		}
;

		function translateFunctionConstruct($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			upLevel();
			var importConstructs = $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			var js = '';
			var innerJS;
			var cr = false;
			var accessor = $es4.$$get(construct, null, null, 'getToken') || $es4.$$get(construct, null, null, 'setToken');
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
			js += print('{', _indent, 1);
			js += print('var $$this = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', $$thisp = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
			js += (innerJS = translateImports(construct)) ? cr = innerJS : '';
			js += (innerJS = translateClassInitializer(construct)) ? cr = print(innerJS, 0, 0, (cr) ? 1 : 0) : '';
			js += (innerJS = translateClassFunction(construct)) ? print(innerJS, 0, 0, 1) : '';
			if (accessor)
			{
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$pcinit = ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1, 1);
				js += print('return ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1, 0);
			}
			else
			{
				js += print('return $es4.$$function (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ');', _indent + 1, 1, 1);
			}
			js += print('})();', _indent, 1);
			downLevel();
			return js;

			function translateImports($$$$construct) 
			{
				//set default parameter values
				var construct = $$$$construct;

				var js = '';
				if ($es4.$$get(importConstructs, null, null, 'length'))
				{
					js += print('//imports', _indent + 1, 1);
				}
				for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
				{
					js += print('var ' + $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data') + ';', _indent + 1, 1);
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
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = (function ()', _indent + 1, 1);
				js += print('{', _indent + 1, 1);
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = undefined;', _indent + 2, 1);
				var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
				if ($es4.$$get(importConstructs, null, null, 'length'))
				{
					js += print('//initialize imports', _indent + 2, 1, 1);
				}
				var importNames = {};
				$es4.$$set(importNames, null, null, $es4.$$get(construct, null, null, 'identifierToken', 'data'), true, '=');
				for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
				{
					var name = $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data');
					var packageName = '';
					if ($es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') > 1)
					{
						var fullyQualifiedName = $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(importConstructs, null, null, i, 'nameConstruct')]);
						fullyQualifiedName = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
						$es4.$$call(fullyQualifiedName, null, null, 'pop', $es4.$$EMPTY_ARRAY);
						packageName = $es4.$$call(fullyQualifiedName, null, null, 'join', ['.']);
					}
					if ($es4.$$get(importNames, null, null, name))
					{
						$es4.$$set(_importNameConflicts, null, null, name, true, '=');
						continue;
					}
					else
					{
						$es4.$$set(importNames, null, null, name, true, '=');
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
					var name = $es4.$$get(construct, null, null, 'getToken') ? 'getter' : 'setter';
					js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '() { $es4.$$' + name + '(\'' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '\', ' + '$es4.$$package(\'' + ($es4.$$get(construct, null, null, 'packageConstruct', 'nameConstruct') ? $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(construct, null, null, 'packageConstruct', 'nameConstruct')]) : '') + '\'), (function ()', _indent, 1);
				}
				else
				{
					js += print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				}
				js += translateParameters(construct, construct);
				if (!accessor)
				{
					js += print(')', 0, (_indent) ? 1 : 0);
				}
				js += print('{', _indent, (_indent) ? 1 : 0);
				js += print('//initialize function if not initialized', _indent + 1, 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(construct, construct);
				if (accessor)
				{
					js += print('//change reference', _indent + 1, 1, 1);
					js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = this;', _indent + 1, $es4.$$get(construct, null, null, 'bodyStatements', 'length') ? 2 : 1);
				}
				if ($es4.$$get(construct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(construct, null, null, 'javaScriptString');
				}
				else
				{
					js += translateStatements($es4.$$get(construct, null, null, 'bodyStatements'), _indent + 1, construct);
				}
				if (accessor)
				{
					js += print('})', ($es4.$$get(construct, null, null, 'isJavaScript')) ? 0 : _indent, 0);
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
			_extendsNameConflict = $es4.$$get(construct, null, null, 'extendsNameConflict');
			var innerJS;
			var cr = false;
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + ' = (function ()', 0, 1);
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$sinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$sinit = undefined;', _indent + 2, 2);
			var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			if ($es4.$$get(importConstructs, null, null, 'length'))
			{
				js += print('//initialize imports', _indent + 2, 1);
			}
			var found = false;
			var extraCR = 0;
			var importNames = {};
			$es4.$$set(importNames, null, null, $es4.$$get(construct, null, null, 'identifierToken', 'data'), true, '=');
			for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
			{
				found = true;
				var name = $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data');
				var packageName = '';
				if ($es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') > 1)
				{
					var fullyQualifiedName = $es4.$$call(Construct, null, null, 'nameConstructToString', [$es4.$$get(importConstructs, null, null, i, 'nameConstruct')]);
					fullyQualifiedName = $es4.$$call(fullyQualifiedName, null, null, 'split', ['.']);
					$es4.$$call(fullyQualifiedName, null, null, 'pop', $es4.$$EMPTY_ARRAY);
					packageName = $es4.$$call(fullyQualifiedName, null, null, 'join', ['.']);
				}
				if ($es4.$$get(importNames, null, null, name))
				{
					$es4.$$set(_importNameConflicts, null, null, name, true, '=');
					continue;
				}
				else
				{
					$es4.$$set(importNames, null, null, name, true, '=');
				}
				extraCR = 1;
				js += print(name + ' = $es4.$$[\'' + packageName + '\'].' + name + ';', _indent + 2, 1);
			}
			var className = $es4.$$get(construct, null, null, 'identifierToken', 'data');
			var superClassName = 'Object';
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct'))
			{
				superClassName = getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type'));
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = (function ()', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit = undefined;', _indent + 2, 1);
			var found = false;
			for (var i = 0; i < $es4.$$get(construct, null, null, 'propertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, null, null, 'propertyConstructs', i);
				if (!$es4.$$get(propertyConstruct, null, null, 'staticToken'))
				{
					continue;
				}
				if ($es4.$$get(propertyConstruct, null, null, 'translatedEarlier'))
				{
					continue;
				}
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var type = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
				js += print('$$j.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 2, 0);
				if (type)
				{
					js += '$es4.$$coerce(';
				}
				js += ($es4.$$get(propertyConstruct, null, null, 'valueExpression')) ? translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct) : 'undefined';
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
			js += translateStatements($es4.$$get(construct, null, null, 'initializerStatements'), _indent + 2, construct);
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
			var js = print('function ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '()', _indent, 1);
			js += print('{', _indent, 1);
			js += print('var $$this;', _indent + 1, 2);
			js += print('//save scope', _indent + 1, 1);
			js += print('if (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) $$this = arguments[1];', _indent + 1, 1);
			js += print('else', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('var $$this = this;', _indent + 2, 2);
			js += print('if (!($$this instanceof ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ') || $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + ' !== undefined) return (arguments.length !== 0) ? $es4.$$as(arguments[0], ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ') : $es4.$$throwArgumentError();', _indent + 2, 1);
			js += print('}', _indent + 1, 1);
			var innerJS;
			js += print('//call construct if no arguments, or argument zero does not equal manual construct', _indent + 1, 1, 1);
			js += print('if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];', _indent + 2, 2);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$construct($$this, $$args);', _indent + 2, 1);
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$construct = (function ($$this, args)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			js += print('//initialize function if not initialized', _indent + 2, 1);
			js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 2, 2);
			js += print('//hold property values, and methods', _indent + 2, 1);
			js += print('Object.defineProperty($$this, \'$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '\', {value:{$$this:$$this, $$p:{}, $$ns:{}}});', _indent + 2, 2);
			upLevel();
			var innerJS;
			innerJS = translateNamespaces(construct, false);
			if (innerJS)
			{
				js += print(innerJS, 0, 0, 1);
			}
			js += translateNamespaceInstanceMethods(construct);
			downLevel();
			var propertyConstructs = $es4.$$get(construct, null, null, 'instancePropertyConstructs');
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				if (!$es4.$$get(namespaceObj, null, null, 'isPrivate'))
				{
					continue;
				}
				js += print('Object.defineProperty($$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + ', \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ');', _indent + 2, 1);
			}
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceAccessorConstructs', 'length'); i++)
			{
				var setterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'setter');
				var getterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'getter');
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var isPrivate = $es4.$$get(methodConstruct, null, null, 'namespaceToken', 'data') == 'private';
				if (!isPrivate)
				{
					continue;
				}
				js += print('Object.defineProperty($$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + ', \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ');', _indent + 2, 1);
			}
			js += print(innerJS, 0, 0, 1);
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'instanceMethodConstructs', i);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					continue;
				}
				if (!$es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isPrivate'))
				{
					continue;
				}
				var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
				js += print('//' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + ' instance method', _indent + 2, 1);
				js += print('Object.defineProperty($$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + ', \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ');', _indent + 2, 2);
			}
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct'))
			{
				var superClassName = getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type'));
				js += print('//call construct on super', _indent + 2, 1);
				js += print(superClassName + '.$$construct($$this);', _indent + 2, 2, 0);
			}
			js += print('//initialize properties', _indent + 2, 1);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$iinit($$this);', _indent + 2, 2, 0);
			js += print('//call constructor', _indent + 2, 1);
			js += print('if (args !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$constructor.apply($$this, args);', _indent + 2, 1, 0);
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
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$iinit = (function ($$this)', _indent + 1, 1);
			js += print('{', _indent + 1, 1);
			var found = false;
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instancePropertyConstructs', 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(construct, null, null, 'instancePropertyConstructs', i);
				if (!found)
				{
					found = true;
					js += print('//initialize properties', _indent + 2, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var type = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
				if (!$es4.$$get(namespaceObj, null, null, 'isPrivate'))
				{
					js += print('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 2, 0);
				}
				else
				{
					js += print('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ', _indent + 2, 0);
				}
				if (type)
				{
					js += '$es4.$$coerce(';
				}
				js += ($es4.$$get(propertyConstruct, null, null, 'valueExpression')) ? translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct) : 'undefined';
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
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct'))
			{
				var superClassName = getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type'));
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
			var methodConstruct = $es4.$$get(construct, null, null, 'constructorMethodConstruct');
			var js = print('//constructor', _indent, 1);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$constructor = (function (', _indent, 0);
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
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct') && (!methodConstruct || (methodConstruct && !$es4.$$get(methodConstruct, null, null, 'callsSuper'))))
			{
				var superClassName = getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type'));
				js += print(superClassName + '.$$constructor.call($$this);', _indent + 1, 1, 1);
				carriage = true;
			}
			if (methodConstruct)
			{
				var innerJS = print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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

			if ($es4.$$get(construct, null, null, 'isInternal'))
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL CLASS////////////////', _indent + 1, 1);
				js += print('var ' + translateClassConstruct($es4.$$get(_rootConstruct, null, null, 'classConstructs', i)), 1, 0);
			}
			return js;
		}
;

		function translateInternalInterfaces($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			if ($es4.$$get(construct, null, null, 'isInternal'))
			{
				return '';
			}
			var js = '';
			for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
			{
				if (js)
				{
					js += print('', 0, 1);
				}
				js += print('////////////////INTERNAL INTERFACE////////////////', _indent + 1, 1);
				js += print('var ' + translateInterfaceConstruct($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i)), 1, 0);
			}
			return js;
		}
;

		function translateClassReturnStatement($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = print('return $es4.$$class(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', ', _indent + 1, 0);
			var comma = false;
			var innerJS = '';
			if ($es4.$$get(construct, null, null, 'extendsNameConstruct'))
			{
				var type = $es4.$$get(construct, null, null, 'extendsNameConstruct', 'type');
				var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'extendsNameConstruct'));
				if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
				{
					innerJS += comma = 'EXTENDS:' + $es4.$$get(type, null, null, 'fullyQualifiedName');
				}
				else
				{
					innerJS += comma = 'EXTENDS:\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
				}
			}
			if ($es4.$$get(construct, null, null, 'implementsNameConstructs', 'length'))
			{
				if (comma)
				{
					innerJS += ', ';
				}
				innerJS += 'IMPLEMENTS:[';
				comma = false;
				for (var i = 0; i < $es4.$$get(construct, null, null, 'implementsNameConstructs', 'length'); i++)
				{
					if (comma)
					{
						innerJS += ', ';
					}
					var type = $es4.$$get(construct, null, null, 'implementsNameConstructs', i, 'type');
					var innerConstruct = lookupConstructInRootConstruct($es4.$$get(construct, null, null, 'rootConstruct'), $es4.$$get(construct, null, null, 'implementsNameConstructs', i));
					if ($es4.$$get(innerConstruct, null, null, 'isInternal'))
					{
						innerJS += comma = $es4.$$get(type, null, null, 'fullyQualifiedName');
					}
					else
					{
						innerJS += comma = '\'' + $es4.$$get(type, null, null, 'fullyQualifiedName') + '\'';
					}
				}
				innerJS += comma = ']';
			}
			if (!$es4.$$get(construct, null, null, 'isInternal'))
			{
				if ($es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'CLASSES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'classConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'classConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
				if ($es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'))
				{
					if (comma)
					{
						innerJS += ', ';
					}
					innerJS += 'INTERFACES:[';
					comma = false;
					for (var i = 0; i < $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', 'length'); i++)
					{
						if (comma)
						{
							innerJS += ', ';
						}
						innerJS += comma = $es4.$$get(_rootConstruct, null, null, 'interfaceConstructs', i, 'identifierToken', 'data');
					}
					innerJS += comma = ']';
				}
			}
			var packageName = $es4.$$get(construct, null, null, 'packageName');
			var fullyQualifiedName = (packageName) ? packageName + '::' + $es4.$$get(construct, null, null, 'identifierToken', 'data') : $es4.$$get(construct, null, null, 'identifierToken', 'data');
			if (innerJS)
			{
				js += '{' + innerJS + '}';
				js += print(', \'' + fullyQualifiedName + '\');', 0, 1);
			}
			else
			{
				js = print('return $es4.$$class(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', null, ', _indent + 1, 0);
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
			var importConstructs = ($es4.$$get(construct, null, null, 'isInternal')) ? $es4.$$get(_rootConstruct, null, null, 'importConstructs') : $es4.$$get(_rootConstruct, null, null, 'packageConstruct', 'importConstructs');
			if ($es4.$$get(importConstructs, null, null, 'length'))
			{
				js += print('//imports', _indent + 1, 1);
			}
			for (var i = 0; i < $es4.$$get(importConstructs, null, null, 'length'); i++)
			{
				js += print('var ' + $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', $es4.$$get(importConstructs, null, null, i, 'nameConstruct', 'identifierTokens', 'length') - 1, 'data') + ';', _indent + 1, 1);
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
			var propertyConstructs = $es4.$$get(construct, null, null, 'namespacePropertyConstructs');
			var counter = 0;
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//namespaces', _indent + 1, 1);
				}
				js += print('$es4.$$' + $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj', 'name') + '_namespace(' + ($es4.$$get(propertyConstruct, null, null, 'valueExpression') ? translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct) : '\'$$uniqueNS_' + (counter++) + '_' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '\'') + ', ' + ((isClassLevel) ? $es4.$$get(construct, null, null, 'identifierToken', 'data') : ($es4.$$get(propertyConstruct, null, null, 'namespaceToken', 'data') == 'private' ? ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns') : '$$this')) + ', \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\');', _indent + 1, 1);
			}
			return js;
		}
;

		function translateStaticProperties($$$$construct) 
		{
			//set default parameter values
			var construct = $$$$construct;

			var js = '';
			var propertyConstructs = $es4.$$get(construct, null, null, 'staticPropertyConstructs');
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//properties', _indent + 1, 1);
					js += print('var $$j = {};', _indent + 1, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				var type = $es4.$$get(propertyConstruct, null, null, 'identifier', 'type');
				var scope = $es4.$$get(construct, null, null, 'identifierToken', 'data');
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					throw $es4.$$primitive(new (Error)('custom static properties not supported at the moment'));
				}
				var returnString = getTranslatedTypeName(type);
				if ($es4.$$get(propertyConstruct, null, null, 'constToken') && $es4.$$get(propertyConstruct, null, null, 'valueExpression'))
				{
					if (returnString == 'String' || returnString == 'uint' || returnString == 'int' || returnString == 'Number' || returnString == 'Boolean')
					{
						var constructor = $es4.$$get(propertyConstruct, null, null, 'valueExpression', 'constructor');
						if (constructor === $es4.$$get(Construct, null, null, 'StringExpression') || constructor === $es4.$$get(Construct, null, null, 'NumberExpression') || constructor === $es4.$$get(Construct, null, null, 'BooleanExpression'))
						{
							var valueJS = translateExpression($es4.$$get(propertyConstruct, null, null, 'valueExpression'), _indent, false, construct);
							var coerce = false;
							if (constructor === $es4.$$get(Construct, null, null, 'StringExpression') && returnString != 'String')
							{
								coerce = true;
							}
							else if (constructor === $es4.$$get(Construct, null, null, 'BooleanExpression') && returnString != 'Boolean')
							{
								coerce = true;
							}
							else if (constructor === $es4.$$get(Construct, null, null, 'NumberExpression'))
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
								js += print(scope + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce(' + valueJS + ', ' + returnString + ');', _indent + 1, 1);
							}
							else
							{
								js += print(scope + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = ' + valueJS + ';', _indent + 1, 1);
							}
							$es4.$$set(propertyConstruct, null, null, 'translatedEarlier', true, '=');
							continue;
						}
					}
				}
				js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent + 1, 1);
				js += print('get:function () { ', _indent + 1, 0);
				js += 'if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit(); ';
				js += print('return $$j.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '; },', 0, 1);
				js += print('set:function (value) { ', _indent + 1, 0);
				js += 'if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit(); ';
				if (returnString)
				{
					js += print('$$j.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce(value, ' + returnString + '); }', 0, 1);
				}
				else
				{
					js += print('$$j.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = value }', 0, 1);
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
			var propertyConstructs = $es4.$$get(construct, null, null, 'instancePropertyConstructs');
			for (var i = 0; i < $es4.$$get(propertyConstructs, null, null, 'length'); i++)
			{
				var propertyConstruct = $es4.$$get(propertyConstructs, null, null, i);
				if (!js)
				{
					js += print('//properties', _indent + 2, 1);
				}
				var namespaceObj = $es4.$$get(propertyConstruct, null, null, 'identifier', 'namespaceObj');
				if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					throw $es4.$$primitive(new (Error)('custom namespace properties not supported at this time'));
				}
				var returnString = getTranslatedTypeName($es4.$$get(propertyConstruct, null, null, 'identifier', 'type'));
				if ($es4.$$get(namespaceObj, null, null, 'isPrivate'))
				{
					js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = {', _indent + 2, 1);
					js += print('get:function () { var $$this = this.$$this; return $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '; },', _indent + 2, 1);
					if (returnString)
					{
						js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
					}
					else
					{
						js += print('set:function (value) { var $$this = this.$$this; $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = value }', _indent + 2, 1);
					}
					js += print('};', _indent + 2, 2);
					continue;
				}
				js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype, \'' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent + 2, 1);
				js += print('get:function () { var $$this = this; return $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + '; },', _indent + 2, 1);
				if (returnString)
				{
					js += print('set:function (value) { var $$this = this; $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce(value, ' + returnString + '); }', _indent + 2, 1);
				}
				else
				{
					js += print('set:function (value) { var $$this = this; $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(propertyConstruct, null, null, 'identifierToken', 'data') + ' = value }', _indent + 2, 1);
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'staticMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'staticMethodConstructs', i);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
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
					if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
					{
						js += translateCustomNamespaceStaticMethod(construct, methodConstruct);
					}
					else
					{
						js += translateNoCustomNamespaceStaticMethod(construct, methodConstruct);
					}
				}
				if (i + 1 < $es4.$$get(construct, null, null, 'staticMethodConstructs', 'length'))
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
			var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
			var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
			upLevel();
			js += print('//' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + ' static method', _indent, 1, (js) ? 1 : 0);
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
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = (function () { return $es4.$$coerce((function (', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
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
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = (function (', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
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
			var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
			upLevel();
			var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
			js += print('//' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + ' static method', _indent, 1, (js) ? 1 : 0);
			js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = (function (', _indent, 0);
			js += translateParameters(methodConstruct, construct);
			js += print(')', 0, 1);
			js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 1);
			js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, 2);
			js += translateDefaultParameterValues(methodConstruct, construct);
			if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
			{
				js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
			}
			else
			{
				js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'instanceMethodConstructs', i);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
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
					if ($es4.$$get(namespaceObj, null, null, 'isCustom'))
					{
						continue;
					}
					else
					{
						js += translateNoCustomNamespaceInstanceMethod(construct, methodConstruct);
					}
				}
				if (i + 1 < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'))
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
			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'); i++)
			{
				var methodConstruct = $es4.$$get(construct, null, null, 'instanceMethodConstructs', i);
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
				if (!$es4.$$get(namespaceObj, null, null, 'isCustom'))
				{
					continue;
				}
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += translateCustomNamespaceJavaScriptInstanceMethod(construct, methodConstruct);
				}
				else
				{
					js += translateCustomNamespaceInstanceMethod(construct, methodConstruct);
				}
				if (i + 1 < $es4.$$get(construct, null, null, 'instanceMethodConstructs', 'length'))
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
			var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
			var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
			js += print('//custom namespace method', _indent, 1, 1);
			var namespaceString = ($es4.$$get(namespaceObj, null, null, 'importID')) ? ', ' + $es4.$$get(namespaceObj, null, null, 'normalizedImportID') : ', ' + ($es4.$$get(namespaceObj, null, null, 'namespaceIsPrivate') ? ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns.') : '$$this.') + $es4.$$get(namespaceObj, null, null, 'normalizedName');
			js += print('$es4.$$cnamespace_function(\'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', $$this, ' + ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns') + namespaceString + ', (function (', _indent, 0);
			js += translateParameters(methodConstruct, construct);
			js += print(')', 0, 1);
			js += print('{', _indent, 1);
			js += translateDefaultParameterValues(methodConstruct, construct);
			if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
			{
				js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
			}
			else
			{
				_inNamespacedFunction = ($es4.$$get(namespaceObj, null, null, 'importID')) ? $es4.$$get(namespaceObj, null, null, 'importID') : ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns.') + $es4.$$get(namespaceObj, null, null, 'name');
				js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
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
			var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
			var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
			js += print('//' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + ' instance method', _indent, 1);
			js += ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isPrivate')) ? translatePrivate() : translateOther();
			downLevel();
			downLevel();
			return js;

			function translatePrivate() 
			{
				var js = '';
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this.$$this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
				}
				js += print('}', _indent, 2);
				var name = '$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.$$' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data');
				js += print('return ' + name + ' || (' + name + ' = ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ');', _indent, 1);
				downLevel();
				js += print('}};', _indent, 1);
				return js;
			}
;

			function translateOther() 
			{
				var js = '';
				js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype, \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					js += print(translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct), 0, 0);
				}
				js += print('}', _indent, 2);
				var name = '$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data');
				js += print('return ' + name + ' || (' + name + ' = ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ');', _indent, 1);
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
			var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
			var type = $es4.$$get(methodConstruct, null, null, 'identifier', 'type');
			js += print('//' + $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'name') + ' instance method', _indent, 1);
			js += ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isPrivate')) ? translatePrivate() : translateOther();
			downLevel();
			downLevel();
			return js;

			function translatePrivate() 
			{
				var js = '';
				js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = {', _indent, 1);
				js += print('get:function ()', _indent, 1);
				js += print('{', _indent, 1);
				js += print('var $$this = this.$$this;', _indent + 1, 2);
				upLevel();
				js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				js += print('', 0, 1);
				js += print('}', _indent, 2);
				var name = '$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$p.$$' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data');
				if (getTranslatedTypeName(type))
				{
					js += print('return ' + name + ' || (' + name + ' = function () { return $es4.$$coerce(' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); });', _indent, 1);
				}
				else
				{
					js += print('return ' + name + ' || (' + name + ' = function () { return ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '.apply($$this, arguments); });', _indent, 1);
				}
				downLevel();
				js += print('}};', _indent, 1);
				return js;
			}
;

			function translateOther() 
			{
				var js = '';
				js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype, \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent, 0);
				js += print(' get:function ()', 0, 0);
				js += print(' {', 0, 0);
				js += print(' var $$this = this; ', 0, 0);
				js += print('return $$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' || ' + '($$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = ', 0, 0);
				if (getTranslatedTypeName(type))
				{
					js += print('function () { return $es4.$$coerce(' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '.apply($$this, arguments), ' + getTranslatedTypeName(type) + '); }); }});', 0, 1);
				}
				else
				{
					js += print('function () { return ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '.apply($$this, arguments); }); }});', 0, 1);
				}
				js += print('function ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '(', _indent, 0);
				js += translateParameters(methodConstruct, construct);
				js += print(')', 0, 1);
				js += print('{', _indent, (!$es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length')) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
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
				js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : 1);
				js += print('if (' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit !== undefined) ' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.$$cinit();', _indent + 1, ($es4.$$get(methodConstruct, null, null, 'isJavaScript')) ? 0 : 2);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					throw $es4.$$primitive(new (Error)('accessor cannot be native: ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data')));
				}
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				}
				else if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					js += translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct);
				}
				js += print('}', ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < $es4.$$get(construct, null, null, 'staticAccessorConstructs', 'length'); i++)
			{
				var setterMethodConstruct = $es4.$$get(construct, null, null, 'staticAccessorConstructs', i, 'setter');
				var getterMethodConstruct = $es4.$$get(construct, null, null, 'staticAccessorConstructs', i, 'getter');
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
				{
					throw $es4.$$primitive(new (Error)('custom namespaced accessor not supported at this time'));
				}
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + ', \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent + 1, 0);
				var type = (getterMethodConstruct) ? $es4.$$get(getterMethodConstruct, null, null, 'identifier', 'type') : $es4.$$get(setterMethodConstruct, null, null, 'identifier', 'type');
				if (getterMethodConstruct)
				{
					js += 'get:';
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript') && getTranslatedTypeName(type))
					{
						js += 'function () { return $es4.$$coerce((';
					}
					js += getMethodConstructJS(getterMethodConstruct, type);
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript') && getTranslatedTypeName(type))
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
				js += print('{', _indent, ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : 1);
				js += translateDefaultParameterValues(methodConstruct, construct);
				if ($es4.$$get(methodConstruct, null, null, 'isNative'))
				{
					throw $es4.$$primitive(new (Error)('accessor cannot be native: ' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data')));
				}
				if (!isPrivate)
				{
					js += print('var $$this = this;', _indent + 1, 1);
				}
				else
				{
					js += print('var $$this = this.$$this;', _indent + 1, 1);
				}
				if ($es4.$$get(methodConstruct, null, null, 'isJavaScript'))
				{
					js += $es4.$$get(methodConstruct, null, null, 'javaScriptString');
				}
				else if ($es4.$$get(methodConstruct, null, null, 'UNIMPLEMENTEDToken') && release)
				{
					js += print("throw new Error('" + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + "');", 0, 0);
				}
				else
				{
					js += translateStatements($es4.$$get(methodConstruct, null, null, 'bodyStatements'), _indent + 1, construct);
				}
				js += print('}', ($es4.$$get(methodConstruct, null, null, 'javaScriptString')) ? 0 : _indent, 0);
				downLevel();
				return js;
			}
;

			for (var i = 0; i < $es4.$$get(construct, null, null, 'instanceAccessorConstructs', 'length'); i++)
			{
				var setterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'setter');
				var getterMethodConstruct = $es4.$$get(construct, null, null, 'instanceAccessorConstructs', i, 'getter');
				var methodConstruct = setterMethodConstruct || getterMethodConstruct;
				if ($es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj', 'isCustom'))
				{
					throw $es4.$$primitive(new (Error)('custom namespaced accessor not supported at this time'));
				}
				var namespaceObj = $es4.$$get(methodConstruct, null, null, 'identifier', 'namespaceObj');
				var isPrivate = $es4.$$get(methodConstruct, null, null, 'namespaceToken', 'data') == 'private';
				var hasGet = false;
				if (isPrivate)
				{
					js += print($es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype.$$v.' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + ' = {', _indent + 1, 0);
				}
				else
				{
					js += print('Object.defineProperty(' + $es4.$$get(construct, null, null, 'identifierToken', 'data') + '.prototype, \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', {', _indent + 1, 0);
				}
				var type = (getterMethodConstruct) ? $es4.$$get(getterMethodConstruct, null, null, 'identifier', 'type') : $es4.$$get(setterMethodConstruct, null, null, 'identifier', 'type');
				if (!getterMethodConstruct && $es4.$$get(methodConstruct, null, null, 'overrideToken'))
				{
					hasGet = true;
					js += 'get:function ()';
					js += print('{', _indent + 1, 1, 1);
					js += print('var $$this = this; return $es4.$$super2($$this, ' + getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type')) + ', \'$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '\', \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', \'get\');', _indent + 2, 0);
					js += print('}', _indent + 1, 0, 1);
				}
				else if (getterMethodConstruct)
				{
					hasGet = true;
					js += 'get:';
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript') && getTranslatedTypeName(type))
					{
						js += 'function () { return $es4.$$coerce((';
					}
					js += getMethodConstructJS(getterMethodConstruct, type, isPrivate);
					if ($es4.$$get(methodConstruct, null, null, 'isJavaScript') && getTranslatedTypeName(type))
					{
						js += ')(), ' + getTranslatedTypeName(type) + ');}';
					}
				}
				if (!setterMethodConstruct && $es4.$$get(methodConstruct, null, null, 'overrideToken'))
				{
					if (hasGet)
					{
						js += ', ';
					}
					js += 'set:function ($$value)';
					js += print('{', _indent + 1, 1, 1);
					js += print('var $$this = this; $es4.$$super2($$this, ' + getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type')) + ', \'$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '\', \'' + $es4.$$get(methodConstruct, null, null, 'identifierToken', 'data') + '\', \'set\', $$value);', _indent + 2, 0);
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
			for (var i = 0; i < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'); i++)
			{
				var parameterConstruct = $es4.$$get(methodConstruct, null, null, 'parameterConstructs', i);
				js += '$$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data');
				if ((i + 1) < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'))
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
			for (var i = 0; i < $es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length'); i++)
			{
				var parameterConstruct = $es4.$$get(methodConstruct, null, null, 'parameterConstructs', i);
				if (!js)
				{
					js += print('//set default parameter values', _indent + 1, 1);
				}
				if ($es4.$$get(parameterConstruct, null, null, 'restToken') || $es4.$$get(parameterConstruct, null, null, 'valueExpression'))
				{
					if ($es4.$$get(parameterConstruct, null, null, 'restToken'))
					{
						js += print('for (var $$i = ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + ', $$length = arguments.length, ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = new Array($$length - ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + '); $$i < $$length; $$i += 1) ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + '[$$i - ' + ($es4.$$get(methodConstruct, null, null, 'parameterConstructs', 'length') - 1) + '] = arguments[$$i];', _indent + 1, 1);
					}
					else if ($es4.$$get(parameterConstruct, null, null, 'valueExpression'))
					{
						var coerceType = getTranslatedTypeName($es4.$$get(parameterConstruct, null, null, 'identifier', 'type'));
						if (coerceType)
						{
							js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression($es4.$$get(parameterConstruct, null, null, 'valueExpression'), 0, false, construct) + ' : $es4.$$coerce($$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ', ' + coerceType + ');', _indent + 1, 1);
						}
						else
						{
							js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = (' + i + ' > arguments.length - 1) ? ' + translateExpression($es4.$$get(parameterConstruct, null, null, 'valueExpression'), 0, false, construct) + ' : $$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
						}
					}
				}
				else
				{
					var coerceType = getTranslatedTypeName($es4.$$get(parameterConstruct, null, null, 'identifier', 'type'));
					if (coerceType)
					{
						js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = $es4.$$coerce($$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ', ' + coerceType + ');', _indent + 1, 1);
					}
					else
					{
						js += print('var ' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ' = $$$$' + $es4.$$get(parameterConstruct, null, null, 'identifierToken', 'data') + ';', _indent + 1, 1);
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
			for (var i = 0; i < $es4.$$get(statements, null, null, 'length'); i++)
			{
				var statement = $es4.$$get(statements, null, null, i);
				if (i != 0 && $es4.$$get(statements, null, null, i - 1, 'constructor') != $es4.$$get(Construct, null, null, 'FunctionExpression') && $es4.$$get(statements, null, null, i, 'constructor') == $es4.$$get(Construct, null, null, 'FunctionExpression'))
				{
					js += '\n';
				}
				js += translateStatement(statement, indent + 1, false, construct);
				if (i + 1 < $es4.$$get(statements, null, null, 'length') && $es4.$$get(statement, null, null, 'constructor') == 'FunctionExpression')
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
				throw $es4.$$primitive(new (Error)('construct null in translate statement'));
			}
			var js = '';
			switch ($es4.$$get(statement, null, null, 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'EmptyStatement'):
					break;
				case $es4.$$get(Construct, null, null, 'IfStatement'):
					_inIfStatement++;
					js += print('if (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'elseIfStatements', 'length'); i++)
					{
						js += translateStatement($es4.$$get(statement, null, null, 'elseIfStatements', i), _indent, false, construct);
					}
					if ($es4.$$get(statement, null, null, 'elseStatement'))
					{
						js += translateStatement($es4.$$get(statement, null, null, 'elseStatement'), _indent, false, construct);
					}
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'ElseIfStatement'):
					_inIfStatement++;
					js += print('else if (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'ElseStatement'):
					_inIfStatement++;
					js += print('else', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					_inIfStatement--;
					break;
				case $es4.$$get(Construct, null, null, 'WhileStatement'):
					js += print('while (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'DoWhileStatement'):
					js += print('do', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					js += print('while (' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct) + ')', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForStatement'):
					js += print('for (', _indent, 0);
					if ($es4.$$get(statement, null, null, 'variableStatement'))
					{
						js += translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct);
					}
					js += ';';
					if ($es4.$$get(statement, null, null, 'conditionExpression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'conditionExpression'), _indent, false, construct);
					}
					js += ';';
					if ($es4.$$get(statement, null, null, 'afterthoughtExpression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'afterthoughtExpression'), _indent, false, construct);
					}
					js += ')\n';
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForEachStatement'):
					_count++;
					var object = translateExpression($es4.$$get(statement, null, null, 'arrayExpression'), _indent, false, construct);
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
					var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'variableStatement', 'identifier', 'type'));
					if (typeString)
					{
						js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
					}
					else
					{
						js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'ForInStatement'):
					_count++;
					var object = translateExpression($es4.$$get(statement, null, null, 'objectExpression'), _indent, false, construct);
					var index = '$$i' + _count;
					if (_dynamicPropertyAccess)
					{
						js += print('for (var ' + index + ' = (' + object + ' || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); ' + index + ' != 0; ' + index + ' = ' + object + '.$$nextNameIndex(' + index + '))', _indent, 1);
					}
					else
					{
						js += print('for (' + translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' in ' + translateExpression($es4.$$get(statement, null, null, 'objectExpression'), _indent, false, construct) + ')', _indent, 1);
					}
					js += print('{', _indent, 1);
					if (_dynamicPropertyAccess)
					{
						valueJS = object + '.$$nextName(' + index + ')';
						var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'variableStatement', 'identifier', 'type'));
						if (typeString)
						{
							js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = $es4.$$coerce(' + valueJS + ', ' + typeString + ');', _indent + 1, 2);
						}
						else
						{
							js += print(translateStatement($es4.$$get(statement, null, null, 'variableStatement'), 0, true, construct) + ' = ' + valueJS + ';', _indent + 1, 2);
						}
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'BreakStatement'):
					js += print('break', _indent, 0);
					if ($es4.$$get(statement, null, null, 'identifierToken'))
					{
						js += ' ' + $es4.$$get(statement, null, null, 'identifierToken', 'data');
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'ContinueStatement'):
					js += print('continue', _indent, 0);
					if ($es4.$$get(statement, null, null, 'identifierToken'))
					{
						js += ' ' + $es4.$$get(statement, null, null, 'identifierToken', 'data');
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'ThrowStatement'):
					js += print('throw', _indent, 0);
					if ($es4.$$get(statement, null, null, 'expression'))
					{
						js += ' ' + translateExpression($es4.$$get(statement, null, null, 'expression'), _indent, false, construct);
					}
					js += ';\n';
					break;
				case $es4.$$get(Construct, null, null, 'TryStatement'):
					js += print('try', _indent, 1);
					js += print('{', _indent, 1);
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					if ($es4.$$get(statement, null, null, 'catchStatements', 'length') == 1)
					{
						js += print('catch (' + $es4.$$get(statement, null, null, 'catchStatements', 0, 'identifierToken', 'data') + ')', _indent, 1);
					}
					else
					{
						js += print('catch ($$error)', _indent, 1);
					}
					js += print('{', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'catchStatements', 'length'); i++)
					{
						upLevel();
						var catchStatement = $es4.$$get(statement, null, null, 'catchStatements', i);
						var typeName = $es4.$$get(catchStatement, null, null, 'identifier', 'type', 'name');
						if (i == 0 && $es4.$$get(statement, null, null, 'catchStatements', 'length') == 1)
						{
							if (typeName == 'void' || typeName == 'Error')
							{
								js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 1, construct);
							}
							else
							{
								js += print('if ($es4.$$is(' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ', ' + typeName + '))', _indent + 1, 1);
								js += print('{', _indent + 1, 1);
								js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
								js += print('}', _indent + 1, 1);
							}
							downLevel();
							break;
						}
						if (typeName == 'void' || typeName == 'Error')
						{
							js += print('else', _indent + 1, 1);
							js += print('{', _indent + 1, 1);
							js += print('var ' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ' = $$error;', _indent + 2, 1);
							js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
							js += print('}', _indent + 1, 1);
							downLevel();
							break;
						}
						js += print(((i == 0) ? 'if' : 'else if') + ' ($es4.$$is($$error, ' + typeName + '))', _indent + 1, 1);
						js += print('{', _indent + 1, 1);
						js += print('var ' + $es4.$$get(catchStatement, null, null, 'identifierToken', 'data') + ' = $$error;', _indent + 2, 1);
						js += translateStatements($es4.$$get(catchStatement, null, null, 'bodyStatements'), _indent + 2, construct);
						js += print('}', _indent + 1, 1);
						downLevel();
					}
					js += print('}', _indent, 1);
					if ($es4.$$get(statement, null, null, 'finallyStatement'))
					{
						js += print('finally', _indent, 1);
						js += print('{', _indent, 1);
						js += translateStatements($es4.$$get(statement, null, null, 'finallyStatement', 'bodyStatements'), _indent + 1, construct);
						js += print('}', _indent, 1);
					}
					break;
				case $es4.$$get(Construct, null, null, 'UseStatement'):
					break;
				case $es4.$$get(Construct, null, null, 'VarStatement'):
					var translateVarValueExpression = function ($$$$statement) 
					{
				//set default parameter values
				var statement = $$$$statement;

						var valueJS = translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct);
						var typeString = getTranslatedTypeName($es4.$$get(statement, null, null, 'identifier', 'type'));
						if (isCoerceRequired(statement, typeString, valueJS))
						{
							valueJS = '$es4.$$coerce(' + valueJS + ', ' + typeString + ')';
						}
						return ' = ' + valueJS;
					}
;
					js += print('var ' + $es4.$$get(statement, null, null, 'identifierToken', 'data'), _indent, 0);
					if ($es4.$$get(statement, null, null, 'valueExpression'))
					{
						js += translateVarValueExpression(statement);
					}
					for (var i = 0; i < $es4.$$get(statement, null, null, 'innerVarStatements', 'length'); i++)
					{
						var innerVarStatement = $es4.$$get(statement, null, null, 'innerVarStatements', i);
						js += ', ' + $es4.$$get(innerVarStatement, null, null, 'identifierToken', 'data');
						if ($es4.$$get(innerVarStatement, null, null, 'valueExpression'))
						{
							js += translateVarValueExpression(innerVarStatement);
						}
					}
					if (!inline)
					{
						js += ';\n';
					}
					break;
				case $es4.$$get(Construct, null, null, 'SwitchStatement'):
					js += print('switch (' + translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct) + ')', _indent, 1);
					js += print('{', _indent, 1);
					for (var i = 0; i < $es4.$$get(statement, null, null, 'caseStatements', 'length'); i++)
					{
						js += translateStatement($es4.$$get(statement, null, null, 'caseStatements', i), _indent + 1, false, construct);
					}
					js += print('}', _indent, 1);
					break;
				case $es4.$$get(Construct, null, null, 'CaseStatement'):
					if ($es4.$$get(statement, null, null, 'defaultToken'))
					{
						js += print('default:', _indent, 1);
					}
					else
					{
						js += print('case ' + translateExpression($es4.$$get(statement, null, null, 'valueExpression'), _indent, false, construct) + ':', _indent, 1);
					}
					js += translateStatements($es4.$$get(statement, null, null, 'bodyStatements'), _indent + 1, construct);
					break;
				case $es4.$$get(Construct, null, null, 'LabelStatement'):
					js += print($es4.$$get(statement, null, null, 'identifierToken', 'data') + ':', _indent, 0);
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
				throw $es4.$$primitive(new (Error)('construct null in translate expression'));
			}
			if (!_indent)
			{
				_indent = 0;
			}
			var js = '';
			outerSwitch:			switch ($es4.$$get(expression, null, null, 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'ParenExpression'):
					js += '(' + translateExpression($es4.$$get(expression, null, null, 'expression'), _indent, toString, construct, operator, expressionString) + ')';
					break;
				case $es4.$$get(Construct, null, null, 'PropertyExpression'):
					js += translatePropertyExpressionDynamic(expression, toString, expressionString, operator, construct);
					break;
				case $es4.$$get(Construct, null, null, 'NumberExpression'):
					js += $es4.$$get(expression, null, null, 'numberToken', 'data');
					break;
				case $es4.$$get(Construct, null, null, 'StringExpression'):
					if (toString && $es4.$$get(expression, null, null, 'stringToken', 'data') == "'")
					{
						js += '\\' + $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					else
					{
						js += $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					for (var i = 0; i < $es4.$$get(expression, null, null, 'stringChunkTokens', 'length'); i++)
					{
						js += $es4.$$get(expression, null, null, 'stringChunkTokens', i, 'data');
						if (i + 1 < $es4.$$get(expression, null, null, 'stringChunkTokens', 'length'))
						{
							js += '\n';
						}
					}
					if (toString && $es4.$$get(expression, null, null, 'stringToken', 'data') == "'")
					{
						js += '\\' + $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					else
					{
						js += $es4.$$get(expression, null, null, 'stringToken', 'data');
					}
					break;
				case $es4.$$get(Construct, null, null, 'ReturnExpression'):
					js += 'return';
					if ($es4.$$get(expression, null, null, 'expression'))
					{
						var typeName = getTranslatedTypeName($es4.$$get(expression, null, null, 'expectedType'));
						var valueJS = translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
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
				case $es4.$$get(Construct, null, null, 'DeleteExpression'):
					js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, undefined, undefined, construct, true);
					break;
				case $es4.$$get(Construct, null, null, 'FunctionExpression'):
					upLevel();
					var wasInClosure = _inClosure;
					_inClosure = true;
					if (!$es4.$$get(expression, null, null, 'identifierToken'))
					{
						js += print('function (', 0, 0);
					}
					else
					{
						if (_inIfStatement)
						{
							throw $es4.$$primitive(new (Error)('support for named closures in if/elseif/else statements is not supported at this time.'));
						}
						js += print('function ' + $es4.$$get(expression, null, null, 'identifierToken', 'data') + '(', 0, 0);
					}
					js += translateParameters(expression, construct);
					js += print(') ', 0, 1);
					js += print('{', _indent, 1);
					js += translateDefaultParameterValues(expression, construct);
					js += translateStatements($es4.$$get(expression, null, null, 'bodyStatements'), _indent + 1, construct);
					js += print('}', _indent, 1);
					if (!wasInClosure)
					{
						_inClosure = false;
					}
					downLevel();
					break;
				case $es4.$$get(Construct, null, null, 'ObjectExpression'):
					js += '{';
					for (var i = 0; i < $es4.$$get(expression, null, null, 'objectPropertyConstructs', 'length'); i++)
					{
						var prop;
						if ($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'PropertyExpression'))
						{
							prop = $es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression', 'construct', 'identifierToken', 'data');
						}
						else
						{
							prop = translateExpression($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'expression'), 0, toString, construct);
						}
						js += prop + ':' + translateExpression($es4.$$get(expression, null, null, 'objectPropertyConstructs', i, 'valueExpression'), 0, toString, construct);
						if ((i + 1) < $es4.$$get(expression, null, null, 'objectPropertyConstructs', 'length'))
						{
							js += ', ';
						}
					}
					js += '}';
					break;
				case $es4.$$get(Construct, null, null, 'ArrayExpression'):
					js += '[';
					for (var i = 0; i < $es4.$$get(expression, null, null, 'valueExpressions', 'length'); i++)
					{
						if (!$es4.$$get(expression, null, null, 'valueExpressions', i))
						{
							trace('invalid 20');
						}
						js += translateExpression($es4.$$get(expression, null, null, 'valueExpressions', i), 0, toString, construct);
						if ((i + 1) < $es4.$$get(expression, null, null, 'valueExpressions', 'length'))
						{
							js += ', ';
						}
					}
					js += ']';
					break;
				case $es4.$$get(Construct, null, null, 'BooleanExpression'):
					js += $es4.$$get(expression, null, null, 'booleanToken', 'data');
					break;
				case $es4.$$get(Construct, null, null, 'Expression'):
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'TypeofTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 21');
						}
						js += '$es4.$$typeof(' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'VoidTokenType'))
					{
						if ($es4.$$get(expression, null, null, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'EmptyExpression'))
						{
							js += 'void 0';
						}
						else
						{
							if (!$es4.$$get(expression, null, null, 'expression'))
							{
								trace('invalid 01');
							}
							js += 'void ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
						}
						break;
					}
					js += $es4.$$get(expression, null, null, 'token', 'data');
					if ($es4.$$get(expression, null, null, 'expression'))
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 22');
						}
						js += translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct);
					}
					break;
				case $es4.$$get(Construct, null, null, 'XMLExpression'):
					js += 'new XML(\'' + $es4.$$get(expression, null, null, 'string') + '\')';
					break;
				case $es4.$$get(Construct, null, null, 'XMLListExpression'):
					js += 'new XMLList(\'' + $es4.$$get(expression, null, null, 'string') + '\')';
					break;
				case $es4.$$get(Construct, null, null, 'EmptyExpression'):
					break;
				case $es4.$$get(Construct, null, null, 'RegExpression'):
					js += $es4.$$get(expression, null, null, 'string');
					break;
				case $es4.$$get(Construct, null, null, 'PrefixExpression'):
					js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, '\'prefix\'', ($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++', construct);
					break;
				case $es4.$$get(Construct, null, null, 'PostfixExpression'):
					js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, '\'postfix\'', ($es4.$$get(expression, null, null, 'decrementToken')) ? '--' : '++', construct);
					break;
				case $es4.$$get(Construct, null, null, 'NewExpression'):
					if ($es4.$$get(expression, null, null, 'expression', 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
					{
						if (!$es4.$$get(expression, null, null, 'expression'))
						{
							trace('invalid 02');
						}
						js += '$es4.$$primitive(new ' + translateExpression($es4.$$get(expression, null, null, 'expression'), 0, toString, construct) + ')';
					}
					else
					{
						js += translatePropertyExpressionDynamic($es4.$$get(expression, null, null, 'expression'), toString, null, null, construct, null, true);
					}
					break;
				case $es4.$$get(Construct, null, null, 'BinaryExpression'):
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'IsTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 04');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 05');
						}
						js += '$es4.$$is(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'InstanceofTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 06');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 07');
						}
						js += '$es4.$$instanceof(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					if ($es4.$$get(expression, null, null, 'token', 'type') == $es4.$$get(Token, null, null, 'AsTokenType'))
					{
						if (!$es4.$$get(expression, null, null, 'leftExpression'))
						{
							trace('invalid 08');
						}
						if (!$es4.$$get(expression, null, null, 'rightExpression'))
						{
							trace('invalid 09');
						}
						js += '$es4.$$as(' + translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ', ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct) + ')';
						break;
					}
					innerSwitch:					switch ($es4.$$get(expression, null, null, 'token', 'type'))
					{
						case $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'):
						case $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'):
							var leftExpression = $es4.$$get(expression, null, null, 'leftExpression');
							while ($es4.$$get(leftExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'ParenExpression'))
							{
								leftExpression = $es4.$$get(leftExpression, null, null, 'expression');
							}
							var innerOperator = $es4.$$get(expression, null, null, 'token', 'data');
							var innerExpressionString = '';
							while ($es4.$$get(leftExpression, null, null, 'constructor') == $es4.$$get(Construct, null, null, 'BinaryExpression'))
							{
								$es4.$$set(expression, null, null, 'leftExpression', $es4.$$get(leftExpression, null, null, 'rightExpression'), '=');
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
									if (!$es4.$$get(expression, null, null, 'leftExpression'))
									{
										trace('invalid 11');
									}
									if (_dynamicPropertyAccess)
									{
										innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'leftExpression'), _indent, toString, construct, innerOperator, innerExpressionString);
									}
									else
									{
										innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'leftExpression'), _indent, toString, construct) + ' ' + innerOperator + ' ' + innerExpressionString;
									}
								}
								expression = leftExpression;
								innerOperator = $es4.$$get(expression, null, null, 'token', 'data');
								leftExpression = $es4.$$get(expression, null, null, 'leftExpression');
							}
							var typeString;
							if (!$es4.$$get(leftExpression, null, null, 'nextPropertyExpression') && $es4.$$get(leftExpression, null, null, 'construct') && $es4.$$get(leftExpression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'IdentifierConstruct'))
							{
								var identifier = $es4.$$get(leftExpression, null, null, 'construct', 'identifier');
								typeString = ($es4.$$get(identifier, null, null, 'isVar') && $es4.$$get(identifier, null, null, 'type')) ? getTranslatedTypeName($es4.$$get(identifier, null, null, 'type')) : '';
							}
							if (true)
							{
								if (!innerExpressionString)
								{
									if (!$es4.$$get(expression, null, null, 'rightExpression'))
									{
										trace('invalid 12');
									}
									innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
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
								if (!$es4.$$get(expression, null, null, 'leftExpression'))
								{
									trace('invalid 13');
								}
								js += translateExpression(leftExpression, 0, toString, construct);
								if (!innerExpressionString)
								{
									if (!$es4.$$get(expression, null, null, 'rightExpression'))
									{
										trace('invalid 14');
									}
									innerExpressionString = translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
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
					if (!$es4.$$get(expression, null, null, 'leftExpression'))
					{
						trace('invalid 15');
					}
					if (!$es4.$$get(expression, null, null, 'rightExpression'))
					{
						trace('invalid 16');
					}
					js += translateExpression($es4.$$get(expression, null, null, 'leftExpression'), 0, toString, construct) + ' ' + $es4.$$get(expression, null, null, 'token', 'data') + ' ' + translateExpression($es4.$$get(expression, null, null, 'rightExpression'), 0, toString, construct);
					break;
				case $es4.$$get(Construct, null, null, 'TernaryExpression'):
					if (!$es4.$$get(expression, null, null, 'trueExpression'))
					{
						trace('invalid 34');
					}
					if (!$es4.$$get(expression, null, null, 'conditionExpression'))
					{
						trace('invalid 35');
					}
					if (!$es4.$$get(expression, null, null, 'falseExpression'))
					{
						trace('invalid 36');
					}
					js += translateExpression($es4.$$get(expression, null, null, 'conditionExpression'), 0, toString, construct) + ' ? ' + translateExpression($es4.$$get(expression, null, null, 'trueExpression'), 0, toString, construct) + ' : ' + translateExpression($es4.$$get(expression, null, null, 'falseExpression'), 0, toString, construct);
					break;
				default:
					throw $es4.$$primitive(new (Error)('Unexpected expression found: ' + $es4.$$get(expression, null, null, 'constructor')));
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
			if (!$es4.$$get(expression, null, null, 'construct'))
			{
				throw $es4.$$primitive(new (Error)('invalid expression passed to translatePropertyExpression: ' + $es4.$$get(expression, null, null, 'constructor')));
			}
			var identifier;
			var namespaceIdentifier;
			switch ($es4.$$get(expression, null, null, 'construct', 'constructor'))
			{
				case $es4.$$get(Construct, null, null, 'SuperConstruct'):
				case $es4.$$get(Construct, null, null, 'ThisConstruct'):
				case $es4.$$get(Construct, null, null, 'IdentifierConstruct'):
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				case $es4.$$get(Construct, null, null, 'ParenConstruct'):
				case $es4.$$get(Construct, null, null, 'ArrayConstruct'):
				case $es4.$$get(Construct, null, null, 'ObjectConstruct'):
					break;
				case $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'):
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					identifier = $es4.$$get(expression, null, null, 'construct', 'identifier');
					break;
				default:
					throw $es4.$$primitive(new (Error)('unknown inner property expression: ' + $es4.$$get(expression, null, null, 'construct', 'constructor')));
			}
			var pname;
			var name;
			if (identifier && !namespaceIdentifier && ($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport') && $es4.$$get(identifier, null, null, 'namespaceObj', 'isCustom'))
			{
				namespaceIdentifier = $es4.$$get(identifier, null, null, 'namespaceObj', 'identifier');
			}
			if (identifier && namespaceIdentifier)
			{
				var pname = ($es4.$$get(namespaceIdentifier, null, null, 'isStatic')) ? $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') : '$$this';
				var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
				var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
				if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
				{
					namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				else if (!namespaceString)
				{
					namespaceString = ($es4.$$get(namespaceIdentifier, null, null, 'namespaceObj') && $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj', 'isPrivate') ? ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns.') : '$$this.') + $es4.$$get(namespaceIdentifier, null, null, 'name');
				}
				pname += '.$$namespace(' + namespaceString + ')';
				name = $es4.$$get(identifier, null, null, 'name');
			}
			else if (identifier)
			{
				name = $es4.$$get(identifier, null, null, 'name');
				if ($es4.$$get(identifier, null, null, 'isStatic') && !$es4.$$get(identifier, null, null, 'isImport') && !$es4.$$get(identifier, null, null, 'isNative'))
				{
					pname = $es4.$$get(identifier, null, null, 'scope', 'name');
				}
				else if ($es4.$$get(identifier, null, null, 'isPrivate') && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']);
				}
				else if (($es4.$$get(identifier, null, null, 'isProperty') || $es4.$$get(identifier, null, null, 'isMethod')) && !$es4.$$get(identifier, null, null, 'isImport'))
				{
					pname = '$$this';
				}
				else if ($es4.$$get(identifier, null, null, 'isPackage'))
				{
					name = '$es4.$$[\'' + $es4.$$get(identifier, null, null, 'name');
					var packageName = $es4.$$get(identifier, null, null, 'name');
					var tempInnerExpression = expression;
					var lastExpression = tempInnerExpression;
					while (tempInnerExpression = $es4.$$get(tempInnerExpression, null, null, 'nextPropertyExpression'))
					{
						if ($es4.$$get(_rootConstructs, null, null, packageName + '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data')))
						{
							expression = lastExpression;
							break;
						}
						packageName += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						name += '.' + $es4.$$get(tempInnerExpression, null, null, 'construct', 'identifierToken', 'data');
						lastExpression = tempInnerExpression;
					}
					name += '\']';
				}
				var superString = ($es4.$$get(construct, null, null, 'extendsNameConstruct')) ? '$es4.$$super2($$this, ' + getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type')) + ', \'$$' + $es4.$$get(construct, null, null, 'extendsNameConstruct', 'type', 'name') + '\', ***REPLACE1***, \'***REPLACE2***\', ***REPLACE3***)' : '____________________';
				if (name == 'super')
				{
					if (_inNamespacedFunction && $es4.$$get(expression, null, null, 'nextPropertyExpression'))
					{
						name = '$$this.$$namespace(' + _inNamespacedFunction + ', $$this, $es4.$$super($$thisp))';
					}
					else
					{
						name = ($es4.$$get(expression, null, null, 'nextPropertyExpression')) ? superString : 'this';
					}
				}
				if (name == 'this' && !_inClosure)
				{
					if ($es4.$$get(expression, null, null, 'nextPropertyExpression') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'DotConstruct') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'identifier', 'isPrivate'))
					{
						name = '$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']);
					}
					else
					{
						name = '$$this';
					}
				}
			}
			else
			{
				if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
				{
					trace('invalid 37');
				}
				name = translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct);
			}
			js += (!pname) ? name : (pname + '.' + name);
			var state = {doAssignment:setString != null, doDelete:doDelete, doNew:doNew, doPostfix:setString == '\'postfix\'', doPrefix:setString == '\'prefix\''};
			var doSuper = name == superString;
			var doSuperConstructor = doSuper && ($es4.$$get(expression, null, null, 'nextPropertyExpression') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct'));
			var superExpression;
			while (expression = $es4.$$get(expression, null, null, 'nextPropertyExpression'))
			{
				if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'DotConstruct') || $es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'IdentifierConstruct'))
				{
					if (doSuper && !superExpression)
					{
						superExpression = '\'' + $es4.$$get(expression, null, null, 'construct', 'identifierToken', 'data') + '\'';
					}
					else
					{
						if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'DotConstruct'))
						{
							js += '.';
						}
						js += $es4.$$get(expression, null, null, 'construct', 'identifierToken', 'data');
					}
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'ArrayAccessorConstruct'))
				{
					if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
					{
						trace('invalid 38');
					}
					if (doSuper && !superExpression)
					{
						superExpression = translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct);
					}
					else
					{
						js += '[' + translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct) + ']';
					}
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'NamespaceQualifierConstruct'))
				{
					namespaceIdentifier = $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifier');
					var namespaceObj = $es4.$$get(namespaceIdentifier, null, null, 'namespaceObj');
					var namespaceString = $es4.$$get(namespaceObj, null, null, 'normalizedImportID');
					if ($es4.$$get(namespaceIdentifier, null, null, 'isStatic') && !namespaceString)
					{
						namespaceString = $es4.$$get(namespaceIdentifier, null, null, 'scope', 'name') + '.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					else if (!namespaceString)
					{
						namespaceString = ($es4.$$get(identifier, null, null, 'isPrivate')) ? ('$$this.$$' + $es4.$$call($es4.$$call((($es4.$$get(construct, null, null, 'packageName') && _extendsNameConflict ? $es4.$$get(construct, null, null, 'packageName') : '') + $es4.$$get(construct, null, null, 'identifierToken', 'data')), null, null, 'split', ['.']), null, null, 'join', ['']) + '.$$ns.') + $es4.$$get(namespaceIdentifier, null, null, 'name') : '$$this.' + $es4.$$get(namespaceIdentifier, null, null, 'name');
					}
					js += '.$$namespace(' + namespaceString + ').' + $es4.$$get(expression, null, null, 'construct', 'namespaceIdentifierToken', 'data');
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'ParenConstruct'))
				{
					if (!$es4.$$get(expression, null, null, 'construct', 'expression'))
					{
						trace('invalid 39');
					}
					js += '(' + translateExpression($es4.$$get(expression, null, null, 'construct', 'expression'), 0, toString, construct) + ')';
				}
				else if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'AtIdentifierConstruct'))
				{
					throw $es4.$$primitive(new (Error)('E4X is not supported'));
				}
				if ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct') || ($es4.$$get(expression, null, null, 'nextPropertyExpression') && $es4.$$get(expression, null, null, 'nextPropertyExpression', 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')))
				{
					var functionCallExpression = ($es4.$$get(expression, null, null, 'construct', 'constructor') == $es4.$$get(Construct, null, null, 'FunctionCallConstruct')) ? expression : $es4.$$get(expression, null, null, 'nextPropertyExpression');
					if (doSuperConstructor)
					{
						js = getTranslatedTypeName($es4.$$get(construct, null, null, 'extendsNameConstruct', 'type')) + '.$$constructor.call($$this';
						if ($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
						{
							js += ', ';
						}
						doSuperConstructor = false;
					}
					else
					{
						js += '(';
					}
					for (var i = 0; i < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'); i++)
					{
						if (!$es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', i))
						{
							trace('invalid 40');
						}
						js += translateExpression($es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', i), 0, toString, construct);
						if ((i + 1) < $es4.$$get(functionCallExpression, null, null, 'construct', 'argumentExpressions', 'length'))
						{
							js += ', ';
						}
					}
					js += ')';
					if ($es4.$$get(expression, null, null, 'nextPropertyExpression'))
					{
						expression = functionCallExpression;
					}
					continue;
				}
			}
			if (doSuper && superExpression)
			{
				js = $es4.$$call($es4.$$call(js, null, null, 'split', ['***REPLACE1***']), null, null, 'join', [superExpression]);
				if (setString)
				{
					js = $es4.$$call($es4.$$call(js, null, null, 'split', ['***REPLACE2***']), null, null, 'join', ['set']);
					js = $es4.$$call($es4.$$call(js, null, null, 'split', ['***REPLACE3***']), null, null, 'join', [setString]);
					$es4.$$set(state, null, null, 'doAssignment', false, '=');
				}
				else
				{
					js = $es4.$$call($es4.$$call(js, null, null, 'split', ['***REPLACE2***']), null, null, 'join', ['func']);
					js = $es4.$$call($es4.$$call(js, null, null, 'split', ['***REPLACE3***']), null, null, 'join', ['undefined']);
				}
			}
			if (!$es4.$$get(state, null, null, 'doPostfix') && !$es4.$$get(state, null, null, 'doPrefix'))
			{
				if ($es4.$$get(state, null, null, 'doAssignment') && operator == '||=' || operator == '&&=')
				{
					js += ' = ' + js + ((operator == '&&=') ? ' && (' : ' || (') + setString + ')';
				}
				else if ($es4.$$get(state, null, null, 'doAssignment'))
				{
					js += ' ' + operator + ' ' + setString;
				}
			}
			else if ($es4.$$get(state, null, null, 'doPrefix'))
			{
				js = operator + js;
			}
			else if ($es4.$$get(state, null, null, 'doPostfix'))
			{
				js += operator;
			}
			if ($es4.$$get(state, null, null, 'doDelete'))
			{
				js = 'delete ' + js;
			}
			if ($es4.$$get(state, null, null, 'doNew'))
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

			if (!$es4.$$get(statementOrExpression, null, null, 'coerce'))
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
	}));

	function TranslatorPrototype()
	{
		//initialize class if not initialized
		if (TranslatorPrototype.$$cinit !== undefined) TranslatorPrototype.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof TranslatorPrototype) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], TranslatorPrototype) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(TranslatorPrototype, null, 'sweetrush.core::TranslatorPrototype');
})();
//sweetrush.core.TranslatorPrototype


//sweetrush.utils.JsonUtil
$es4.$$package('sweetrush.utils').JsonUtil = (function ()
{
	//class initializer
	JsonUtil.$$cinit = (function ()
	{
		JsonUtil.$$cinit = undefined;

	});

	function JsonUtil()
	{
		//initialize class if not initialized
		if (JsonUtil.$$cinit !== undefined) JsonUtil.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof JsonUtil) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], JsonUtil) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//method
		$es4.$$public_function('parse', $$thisp, (function ($$$$string)
		{
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);

			return $es4.$$get($es4.$$primitive(new (Hydrate)(string)), $$this, $$thisp, 'result');
		}));

		//method
		$es4.$$public_function('stringify', $$thisp, (function ($$$$obj)
		{
			//set default parameter values
			var obj = $$$$obj;

			return $es4.$$coerce($es4.$$get($es4.$$primitive(new (Dehydrate)(obj)), $$this, $$thisp, 'result'), String);
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	////////////////INTERNAL CLASS////////////////
	var Hydrate = (function ()
	{
		//imports
		var getDefinitionByName;
		var getQualifiedClassName;
		var Dictionary;
		var Base64Util;

		//class initializer
		Hydrate.$$cinit = (function ()
		{
			Hydrate.$$cinit = undefined;

			//initialize imports
			getDefinitionByName = $es4.$$['flash.utils'].getDefinitionByName;
			getQualifiedClassName = $es4.$$['flash.utils'].getQualifiedClassName;
			Dictionary = $es4.$$['flash.utils'].Dictionary;
			Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		});

		function Hydrate()
		{
			//initialize class if not initialized
			if (Hydrate.$$cinit !== undefined) Hydrate.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Hydrate) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Hydrate) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$private_property('_dehydratedObj', $$thisp, Object);
			$es4.$$private_property('_hydratedIDs', $$thisp, Object);
			$es4.$$private_property('_result', $$thisp, Object);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$string)
			{
				//set default parameter values
				var string = $es4.$$coerce($$$$string, String);

				if (!string)
				{
					return;
				}
				$es4.$$set($$thisp, $$this, $$thisp, '_dehydratedObj', $es4.$$call(JSON, $$this, $$thisp, 'parse', [string]) || {}, '=');
				$es4.$$get($$thisp, $$this, $$thisp, '_dehydratedObj', 'dehydrated') || {};
				$es4.$$set($$thisp, $$this, $$thisp, '_hydratedIDs', {}, '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_result', $es4.$$call($$thisp, $$this, $$thisp, 'hydrateObject', [$es4.$$get($$thisp, $$this, $$thisp, '_dehydratedObj', 'dehydrated'), $es4.$$get($$thisp, $$this, $$thisp, '_dehydratedObj', 'type')]), '=');
			}));

			//method
			$es4.$$private_function('hydrateObject', $$thisp, (function ($$$$object, $$$$type)
			{
				//set default parameter values
				var object = $es4.$$coerce($$$$object, Object);
				var type = $es4.$$coerce($$$$type, String);

				if ($es4.$$get($$thisp, $$this, $$thisp, '_hydratedIDs', $es4.$$get(object, $$this, $$thisp, 'id')) !== undefined)
				{
					return $es4.$$get($$thisp, $$this, $$thisp, '_hydratedIDs', $es4.$$get(object, $$this, $$thisp, 'id'));
				}
				var properties = null;
				var propertyName = null;
				var robject = type === 'array' ? [] : {};
				$es4.$$set($$thisp, $$this, $$thisp, '_hydratedIDs', $es4.$$get(object, $$this, $$thisp, 'id'), robject, '=');
				properties = $es4.$$get(object, $$this, $$thisp, 'p') || {};
				for (var $$i0 = (properties || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i0 != 0; $$i0 = properties.$$nextNameIndex($$i0))
				{
					propertyName = $es4.$$coerce(properties.$$nextName($$i0), String);

					$es4.$$set(robject, $$this, $$thisp, propertyName, $es4.$$call($$thisp, $$this, $$thisp, 'getValueObject', [$es4.$$get(properties, $$this, $$thisp, propertyName)]), '=');
				}
				return robject;
			}));

			//method
			$es4.$$private_function('getValueObject', $$thisp, (function ($$$$object)
			{
				//set default parameter values
				var object = $$$$object;

				if ($es4.$$is(object, String) && object == '__NaN__')
				{
					return $es4.$$coerce(NaN, Object);
				}
				if ($es4.$$is(object, String))
				{
					return $es4.$$call(Base64Util, $$this, $$thisp, 'decodeString', [object]);
				}
				if ($es4.$$is(object, Number) || $es4.$$is(object, Boolean) || object == null)
				{
					return object;
				}
				if ($es4.$$get(object, $$this, $$thisp, 'constructor') == Object)
				{
					if ($es4.$$get(object, $$this, $$thisp, 'r') !== undefined)
					{
						var id = $es4.$$coerce($es4.$$get(object, $$this, $$thisp, 'r'), String);
						var obj = $es4.$$get($$thisp, $$this, $$thisp, '_dehydratedObj', 'o');
						return $es4.$$call($$thisp, $$this, $$thisp, 'hydrateObject', [$es4.$$get(obj, $$this, $$thisp, id), $es4.$$get(obj, $$this, $$thisp, id, 'type')]);
					}
				}
				throw $es4.$$primitive(new (Error)('unknown value type'));
			}));

			//accessor
			$es4.$$public_accessor('result', $$thisp, (function ()
			{
				return $es4.$$get($$thisp, $$this, $$thisp, '_result');
			}), null);

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

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

		//class initializer
		Dehydrate.$$cinit = (function ()
		{
			Dehydrate.$$cinit = undefined;

			//initialize imports
			getDefinitionByName = $es4.$$['flash.utils'].getDefinitionByName;
			getQualifiedClassName = $es4.$$['flash.utils'].getQualifiedClassName;
			Dictionary = $es4.$$['flash.utils'].Dictionary;
			Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		});

		function Dehydrate()
		{
			//initialize class if not initialized
			if (Dehydrate.$$cinit !== undefined) Dehydrate.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof Dehydrate) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Dehydrate) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$private_property('_dehydratedObjects', $$thisp, Object);
			$es4.$$private_property('_dehydratedNodes', $$thisp, Dictionary);
			$es4.$$private_property('_idCounter', $$thisp, int);
			$es4.$$private_property('_result', $$thisp, String);

			//initializer
			$es4.$$iinit($$thisp, (function ()
			{
				//initialize properties
				$es4.$$set($$this, $$this, $$thisp, '_dehydratedObjects', {}, '=');
				$es4.$$set($$this, $$this, $$thisp, '_dehydratedNodes', $es4.$$primitive(new (Dictionary)()), '=');
				$es4.$$set($$this, $$this, $$thisp, '_idCounter', 1, '=');
			}));

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$persistable)
			{
				//set default parameter values
				var persistable = $$$$persistable;

				var dehydrated = $es4.$$call($$thisp, $$this, $$thisp, 'dehydrateObject', [persistable]);
				var obj = {};
				$es4.$$set(obj, $$this, $$thisp, 'dehydrated', dehydrated, '=');
				$es4.$$set(obj, $$this, $$thisp, 'type', $es4.$$is(persistable, Array) ? 'array' : 'object', '=');
				$es4.$$set(obj, $$this, $$thisp, 'o', $es4.$$get($$thisp, $$this, $$thisp, '_dehydratedObjects'), '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_result', $es4.$$call(JSON, $$this, $$thisp, 'stringify', [obj]), '=');
			}));

			//method
			$es4.$$private_function('dehydrateObject', $$thisp, (function ($$$$object)
			{
				//set default parameter values
				var object = $es4.$$coerce($$$$object, Object);

				var dehydrated = $es4.$$call($$thisp, $$this, $$thisp, 'getDehydrated', [object]);
				if (dehydrated)
				{
					return dehydrated;
				}
				dehydrated = {};
				$es4.$$set(dehydrated, $$this, $$thisp, 'id', $es4.$$call($$thisp, $$this, $$thisp, 'generateID', $es4.$$EMPTY_ARRAY), '=');
				$es4.$$set(dehydrated, $$this, $$thisp, 'type', $es4.$$is(object, Array) ? 'array' : 'object', '=');
				$es4.$$set($$thisp, $$this, $$thisp, '_dehydratedNodes', object, dehydrated, '=');
				if ($es4.$$is(object, Array) || $es4.$$is($es4.$$typeof($es4.$$call(object, $$this, $$thisp, 'valueOf', $es4.$$EMPTY_ARRAY)), Object))
				{
					$es4.$$set($$thisp, $$this, $$thisp, '_dehydratedObjects', $es4.$$get(dehydrated, $$this, $$thisp, 'id'), dehydrated, '=');
					for (var $$i1 = (object || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i1 != 0; $$i1 = object.$$nextNameIndex($$i1))
					{
						var property = $es4.$$coerce(object.$$nextName($$i1), String);

						if ($es4.$$get(dehydrated, $$this, $$thisp, 'p') === undefined)
						{
							$es4.$$set(dehydrated, $$this, $$thisp, 'p', {}, '=');
						}
						$es4.$$set(dehydrated, $$this, $$thisp, 'p', property, $es4.$$call($$thisp, $$this, $$thisp, 'getValue', [$es4.$$get(object, $$this, $$thisp, property)]), '=');
					}
					return dehydrated;
				}
				throw $es4.$$primitive(new (Error)('Type is not supported for dehydration'));
			}));

			//method
			$es4.$$private_function('getDehydrated', $$thisp, (function ($$$$object)
			{
				//set default parameter values
				var object = $es4.$$coerce($$$$object, Object);

				return $es4.$$get($$thisp, $$this, $$thisp, '_dehydratedNodes', object);
			}));

			//method
			$es4.$$private_function('getValue', $$thisp, (function ($$$$object)
			{
				//set default parameter values
				var object = $es4.$$coerce($$$$object, Object);

				if ($es4.$$is(object, String))
				{
					return $es4.$$call(Base64Util, $$this, $$thisp, 'encodeString', [$es4.$$as(object, String)]);
				}
				if ($es4.$$is(object, Number) && isNaN($es4.$$as(object, Number)))
				{
					return '__NaN__';
				}
				if ($es4.$$is(object, Number) || $es4.$$is(object, Boolean) || object == null)
				{
					return object;
				}
				object = $es4.$$call($$thisp, $$this, $$thisp, 'dehydrateObject', [object]);
				return {r:$es4.$$get(object, $$this, $$thisp, 'id')};
			}));

			//method
			$es4.$$private_function('generateID', $$thisp, (function ()
			{
				return $es4.$$call(($es4.$$set($$thisp, $$this, $$thisp, '_idCounter', 'postfix', '++')), $$this, $$thisp, 'toString', $es4.$$EMPTY_ARRAY);
			}));

			//accessor
			$es4.$$public_accessor('result', $$thisp, (function ()
			{
				return $es4.$$get($$thisp, $$this, $$thisp, '_result');
			}), null);

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(Dehydrate, null, 'Dehydrate');
	})();

	return $es4.$$class(JsonUtil, {CLASSES:[Hydrate, Dehydrate]}, 'sweetrush.utils::JsonUtil');
})();
//sweetrush.utils.JsonUtil


//sweetrush.core.Lexer
$es4.$$package('sweetrush.core').Lexer = (function ()
{
	//imports
	var Transcompiler;
	var Token;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//properties
	$es4.$$private_property('grammar', Lexer, Array);

	//class initializer
	Lexer.$$cinit = (function ()
	{
		Lexer.$$cinit = undefined;

		//initialize imports
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Token = $es4.$$['sweetrush.obj'].Token;
		FileUtil = $es4.$$['sweetrush.utils'].FileUtil;
		Parser = $es4.$$['sweetrush.core'].Parser;
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;

		//initialize properties
		Lexer.grammar = [$es4.$$get(Token, null, null, 'SpaceTokenType'), $es4.$$get(Token, null, null, 'TabTokenType'), $es4.$$get(Token, null, null, 'EOSTokenType'), $es4.$$get(Token, null, null, 'NewLineTokenType'), $es4.$$get(Token, null, null, 'OpenBracketTokenType'), $es4.$$get(Token, null, null, 'ClosedBracketTokenType'), $es4.$$get(Token, null, null, 'OpenParenTokenType'), $es4.$$get(Token, null, null, 'ClosedParenTokenType'), $es4.$$get(Token, null, null, 'VectorDotOpenArrowTokenType'), $es4.$$get(Token, null, null, 'XMLTokenType'), $es4.$$get(Token, null, null, 'XMLCDATATokenType'), $es4.$$get(Token, null, null, 'EqualityTokenType'), $es4.$$get(Token, null, null, 'BitwiseLeftShiftAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseRightShiftAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseLeftShiftTokenType'), $es4.$$get(Token, null, null, 'BitwiseUnsignedRightShiftTokenType'), $es4.$$get(Token, null, null, 'BitwiseRightShiftTokenType'), $es4.$$get(Token, null, null, 'RelationalTokenType'), $es4.$$get(Token, null, null, 'AddWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'DivWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'ModWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'MulWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'SubWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'AssignmentTokenType'), $es4.$$get(Token, null, null, 'NamespaceQualifierTokenType'), $es4.$$get(Token, null, null, 'ColonTokenType'), $es4.$$get(Token, null, null, 'CommaTokenType'), $es4.$$get(Token, null, null, 'BooleanTokenType'), $es4.$$get(Token, null, null, 'StringTokenType'), $es4.$$get(Token, null, null, 'AsTokenType'), $es4.$$get(Token, null, null, 'DeleteTokenType'), $es4.$$get(Token, null, null, 'IfTokenType'), $es4.$$get(Token, null, null, 'ElseTokenType'), $es4.$$get(Token, null, null, 'EachTokenType'), $es4.$$get(Token, null, null, 'ForTokenType'), $es4.$$get(Token, null, null, 'WhileTokenType'), $es4.$$get(Token, null, null, 'DoTokenType'), $es4.$$get(Token, null, null, 'TryTokenType'), $es4.$$get(Token, null, null, 'CatchTokenType'), $es4.$$get(Token, null, null, 'BreakTokenType'), $es4.$$get(Token, null, null, 'InTokenType'), $es4.$$get(Token, null, null, 'ContinueTokenType'), $es4.$$get(Token, null, null, 'DefaultTokenType'), $es4.$$get(Token, null, null, 'ConstTokenType'), $es4.$$get(Token, null, null, 'WithTokenType'), $es4.$$get(Token, null, null, 'FinallyTokenType'), $es4.$$get(Token, null, null, 'ThisTokenType'), $es4.$$get(Token, null, null, 'TypeofTokenType'), $es4.$$get(Token, null, null, 'NullTokenType'), $es4.$$get(Token, null, null, 'UndefinedTokenType'), $es4.$$get(Token, null, null, 'VoidTokenType'), $es4.$$get(Token, null, null, 'SuperTokenType'), $es4.$$get(Token, null, null, 'ReturnTokenType'), $es4.$$get(Token, null, null, 'ThrowTokenType'), $es4.$$get(Token, null, null, 'TernaryTokenType'), $es4.$$get(Token, null, null, 'ClassTokenType'), $es4.$$get(Token, null, null, 'ImportTokenType'), $es4.$$get(Token, null, null, 'ExtendsTokenType'), $es4.$$get(Token, null, null, 'ImplementsTokenType'), $es4.$$get(Token, null, null, 'OverrideTokenType'), $es4.$$get(Token, null, null, 'StaticTokenType'), $es4.$$get(Token, null, null, 'DynamicTokenType'), $es4.$$get(Token, null, null, 'InterfaceTokenType'), $es4.$$get(Token, null, null, 'FinalTokenType'), $es4.$$get(Token, null, null, 'NamespaceKeywordTokenType'), $es4.$$get(Token, null, null, 'NewTokenType'), $es4.$$get(Token, null, null, 'UseTokenType'), $es4.$$get(Token, null, null, 'CaseTokenType'), $es4.$$get(Token, null, null, 'FunctionTokenType'), $es4.$$get(Token, null, null, 'VarTokenType'), $es4.$$get(Token, null, null, 'NumberTokenType'), $es4.$$get(Token, null, null, 'AndWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'OrWithAssignmentTokenType'), $es4.$$get(Token, null, null, 'AndTokenType'), $es4.$$get(Token, null, null, 'OrTokenType'), $es4.$$get(Token, null, null, 'BitwiseAndAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseOrAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseXorAssignmentTokenType'), $es4.$$get(Token, null, null, 'BitwiseAndTokenType'), $es4.$$get(Token, null, null, 'BitwiseNotTokenType'), $es4.$$get(Token, null, null, 'BitwiseOrTokenType'), $es4.$$get(Token, null, null, 'BitwiseXorTokenType'), $es4.$$get(Token, null, null, 'AtTokenType'), $es4.$$get(Token, null, null, 'SwitchTokenType'), $es4.$$get(Token, null, null, 'DotDotTokenType'), $es4.$$get(Token, null, null, 'DotTokenType'), $es4.$$get(Token, null, null, 'NotTokenType'), $es4.$$get(Token, null, null, 'IncrementTokenType'), $es4.$$get(Token, null, null, 'DecrementTokenType'), $es4.$$get(Token, null, null, 'OpenBraceTokenType'), $es4.$$get(Token, null, null, 'ClosedBraceTokenType'), $es4.$$get(Token, null, null, 'PackageTokenType'), $es4.$$get(Token, null, null, 'IsTokenType'), $es4.$$get(Token, null, null, 'NaNTokenType'), $es4.$$get(Token, null, null, 'InstanceofTokenType'), $es4.$$get(Token, null, null, 'IdentifierTokenType'), $es4.$$get(Token, null, null, 'CommentTokenType'), $es4.$$get(Token, null, null, 'MultiLineCommentTokenType'), $es4.$$get(Token, null, null, 'AddTokenType'), $es4.$$get(Token, null, null, 'SubTokenType'), $es4.$$get(Token, null, null, 'RegExpTokenType'), $es4.$$get(Token, null, null, 'DivTokenType'), $es4.$$get(Token, null, null, 'MulTokenType'), $es4.$$get(Token, null, null, 'ModTokenType'), $es4.$$get(Token, null, null, 'UFOTokenType')];
	});

	//method
	$es4.$$public_function('lex', Lexer, (function ($$$$input, $$$$grammar, $$$$internal_)
	{
		if (Lexer.$$cinit !== undefined) Lexer.$$cinit();

		//set default parameter values
		var input = $es4.$$coerce($$$$input, String);
		var grammar = (1 > arguments.length - 1) ? null : $es4.$$coerce($$$$grammar, Array);
		var internal_ = (2 > arguments.length - 1) ? null : $$$$internal_;

		var s = $es4.$$call(($es4.$$primitive(new (Date)())), null, null, 'getTime', $es4.$$EMPTY_ARRAY);
		if (!grammar)
		{
			grammar = $es4.$$get(Lexer, null, null, 'grammar');
		}
		if (!internal_)
		{
			input = $es4.$$call($es4.$$call(input, null, null, 'split', [/\r\n/]), null, null, 'join', ['\n']);
		}
		var token;
		var tokens = [];
		var matcherObj = $es4.$$call(Lexer, null, null, 'matcher', [input, grammar, internal_]);
		while ((token = $es4.$$call(matcherObj, null, null, 'find', $es4.$$EMPTY_ARRAY)) != null)
		{
			$es4.$$call(tokens, null, null, 'push', [token]);
		}
		if ($es4.$$get(Transcompiler, null, null, 'DEBUG') >= 5 && !internal_)
		{
			trace('Tokens length: ' + $es4.$$get(tokens, null, null, 'length') + ', Total time: ' + (($es4.$$call(($es4.$$primitive(new (Date)())), null, null, 'getTime', $es4.$$EMPTY_ARRAY) - s) / 1000) + ' seconds.\n');
		}
		return $es4.$$call(Token, null, null, 'getNewResult', [tokens, $es4.$$call(matcherObj, null, null, 'getIndex', $es4.$$EMPTY_ARRAY)]);
	}));

	//method
	$es4.$$private_function('matcher', Lexer, (function ($$$$input, $$$$grammar, $$$$internal_)
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
		var length = $es4.$$get(input, null, null, 'length');
		var foundTokens = [];
		var find = function () 
		{
			if ($es4.$$get(tokens, null, null, 'length'))
			{
				var token = $es4.$$get(tokens, null, null, tokensIndex);
				if ($es4.$$get(token, null, null, 'type') == $es4.$$get(Token, null, null, 'NewLineTokenType'))
				{
					$es4.$$set(token, null, null, 'position', currentPosition + 1, '=');
					$es4.$$set(token, null, null, 'line', currentLine, '=');
					currentLine++;
					currentPosition = 0;
				}
				else
				{
					$es4.$$set(token, null, null, 'position', currentPosition + 1, '=');
					$es4.$$set(token, null, null, 'line', currentLine, '=');
					currentPosition += $es4.$$get(token, null, null, 'data', 'length');
				}
				if ($es4.$$get(Transcompiler, null, null, 'DEBUG') >= 4 && !internal_)
				{
					trace($es4.$$get(token, null, null, 'line') + ' : ' + $es4.$$get(token, null, null, 'position') + ' : ' + $es4.$$get(token, null, null, 'type', 'name') + ' => ' + $es4.$$get(token, null, null, 'data'));
				}
				if (++tokensIndex == $es4.$$get(tokens, null, null, 'length'))
				{
					tokens = [];
					tokensIndex = 0;
				}
				return token;
			}
			if (!$es4.$$get(input, null, null, 'length'))
			{
				return null;
			}
			var grammarLength = $es4.$$get(grammar, null, null, 'length');
			for (var i = 0; i < grammarLength; i++)
			{
				var type = $es4.$$get(grammar, null, null, i);
				var result = $es4.$$call(Token, null, null, 'tokenFunctions', type, 'find', [input, foundTokens]);
				if (result)
				{
					input = $es4.$$call(input, null, null, 'slice', [$es4.$$get(result, null, null, 'index') + 1]);
					tokens = $es4.$$get(result, null, null, 'tokens');
					tokensIndex = 0;
					$es4.$$call(foundTokens, null, null, 'push', [tokens]);
					return find();
				}
			}
			if (!internal_ && $es4.$$get(input, null, null, 'length'))
			{
				throw $es4.$$primitive(new (Error)('Unknown token found on line ' + currentLine + ', at position ' + (currentPosition + 1)));
			}
			return null;
		}
;
		var getIndex = function () 
		{
			return length - $es4.$$get(input, null, null, 'length');
		}
;
		var api = {};
		$es4.$$set(api, null, null, 'find', find, '=');
		$es4.$$set(api, null, null, 'getIndex', getIndex, '=');
		return api;
	}));

	function Lexer()
	{
		//initialize class if not initialized
		if (Lexer.$$cinit !== undefined) Lexer.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof Lexer) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], Lexer) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	return $es4.$$class(Lexer, null, 'sweetrush.core::Lexer');
})();
//sweetrush.core.Lexer


//sweetrush.utils.FileUtil
$es4.$$package('sweetrush.utils').FileUtil = (function ()
{
	//imports
	var ByteArray;
	var FileUtil;
	var Transcompiler;
	var Parser;
	var Token;
	var Lexer;
	var Construct;
	var Base64Util;
	var JsonUtil;
	var Analyzer;
	var SwcUtil;
	var TranslatorPrototype;
	var TranslatorProto;

	//properties
	$es4.$$private_property('fs', FileUtil);
	$es4.$$private_property('path', FileUtil);

	//class initializer
	FileUtil.$$cinit = (function ()
	{
		FileUtil.$$cinit = undefined;

		//initialize imports
		ByteArray = $es4.$$['flash.utils'].ByteArray;
		Transcompiler = $es4.$$['sweetrush'].Transcompiler;
		Parser = $es4.$$['sweetrush.core'].Parser;
		Token = $es4.$$['sweetrush.obj'].Token;
		Lexer = $es4.$$['sweetrush.core'].Lexer;
		Construct = $es4.$$['sweetrush.obj'].Construct;
		Base64Util = $es4.$$['sweetrush.utils'].Base64Util;
		JsonUtil = $es4.$$['sweetrush.utils'].JsonUtil;
		Analyzer = $es4.$$['sweetrush.core'].Analyzer;
		SwcUtil = $es4.$$['sweetrush.utils'].SwcUtil;
		TranslatorPrototype = $es4.$$['sweetrush.core'].TranslatorPrototype;
		TranslatorProto = $es4.$$['sweetrush.core'].TranslatorProto;

		//initialize properties
		FileUtil.fs = require('fs');
		FileUtil.path = require('path');
	});

	//method
	$es4.$$public_function('getBasePath', FileUtil, (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		if (true)
		{
			return $es4.$$call(FileUtil, null, null, 'path', 'join', [__dirname, '../../../', 'as3-js']);
		}
		if (false)
		{
		}
	}));

	//method
	$es4.$$public_function('getExcludedPath', FileUtil, (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		if (true)
		{
			return $es4.$$call(FileUtil, null, null, 'path', 'join', [__dirname, '../../../', 'as3-js', '_excluded']);
		}
		if (false)
		{
		}
	}));

	//method
	$es4.$$public_function('resolvePath', FileUtil, (function ($$$$src, $$$$append)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var src = $$$$src;
		var append = $$$$append;

		if (true)
		{
			return $es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$call(FileUtil, null, null, 'path', 'join', [src, append])]);
		}
		if (false)
		{
		}
	}));

	//method
	$es4.$$public_function('read', FileUtil, (function ($$$$file)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var file = $$$$file;

		if (false)
		{
		}
		if (true)
		{
			return $es4.$$call($es4.$$call(FileUtil, null, null, 'fs', 'readFileSync', [file, 'utf8']), null, null, 'replace', [/^\uFEFF/, '']);
		}
	}));

	//method
	$es4.$$public_function('write', FileUtil, (function ($$$$file, $$$$contents)
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
			$es4.$$call(FileUtil, null, null, 'fs', 'writeFileSync', [file, contents, 'utf8']);
		}
	}));

	//method
	$es4.$$public_function('readDirectory', FileUtil, (function ($$$$directory)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var directory = $$$$directory;

		if (false)
		{
		}
		if (true)
		{
			var files = $es4.$$coerce($es4.$$call(FileUtil, null, null, 'fs', 'readdirSync', [directory]), Array);
			for (var i = 0; i < $es4.$$get(files, null, null, 'length'); i++)
			{
				$es4.$$set(files, null, null, i, directory + '/' + $es4.$$get(files, null, null, i), '=');
			}
			return files;
		}
	}));

	//method
	$es4.$$public_function('fixPath', FileUtil, (function ($$$$path)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;

		return $es4.$$call($es4.$$call($es4.$$call($es4.$$call(path, null, null, 'split', ['\\\\']), null, null, 'join', ['/']), null, null, 'split', ['\\']), null, null, 'join', ['/']);
	}));

	//method
	$es4.$$public_function('exists', FileUtil, (function ($$$$file)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var file = $$$$file;

		if (false)
		{
		}
		if (true)
		{
			return $es4.$$call(FileUtil, null, null, 'fs', 'existsSync', [file]);
		}
	}));

	//method
	$es4.$$public_function('getList', FileUtil, (function ($$$$path, $$$$recursive, $$$$filter)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;
		var recursive = $$$$recursive;
		var filter = $$$$filter;

		var returnList = innerGetList(path, recursive, filter, path);
		$es4.$$set(returnList, null, null, 'basepath', $es4.$$call(FileUtil, null, null, 'fixPath', [path]), '=');
		return returnList;

		function innerGetList($$$$path, $$$$recursive, $$$$filter, $$$$basePath) 
		{
			//set default parameter values
			var path = $$$$path;
			var recursive = $$$$recursive;
			var filter = $$$$filter;
			var basePath = $$$$basePath;

			path = $es4.$$call(FileUtil, null, null, 'fixPath', [path]);
			basePath = $es4.$$call(FileUtil, null, null, 'fixPath', [basePath]);
			var file = $es4.$$primitive(new (VFile)(path));
			var list = $es4.$$call(file, null, null, 'listFiles', $es4.$$EMPTY_ARRAY);
			var returnList = $es4.$$primitive(new (Array)());
			for (var i = 0; i < $es4.$$get(list, null, null, 'length'); i++)
			{
				file = $es4.$$get(list, null, null, i);
				var result = filter(file, basePath);
				if (result)
				{
					$es4.$$call(returnList, null, null, 'push', [result]);
				}
				if ($es4.$$call(file, null, null, 'isDirectory', $es4.$$EMPTY_ARRAY) && recursive)
				{
					var innerList = innerGetList($es4.$$get(file, null, null, 'src'), recursive, filter, basePath);
					returnList = $es4.$$call(returnList, null, null, 'concat', [innerList]);
				}
			}
			return returnList;
		}
;
	}));

	//method
	$es4.$$public_function('filterList', FileUtil, (function ($$$$list, $$$$filter)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var list = $$$$list;
		var filter = $$$$filter;

		var returnList = [];
		$es4.$$set(returnList, null, null, 'basepath', $es4.$$get(list, null, null, 'basepath'), '=');
		for (var i = 0; i < $es4.$$get(list, null, null, 'length'); i++)
		{
			var file = filter($es4.$$get(list, null, null, i), $es4.$$get(list, null, null, 'basepath'));
			if (!file)
			{
				continue;
			}
			$es4.$$call(returnList, null, null, 'push', [file]);
		}
		return returnList;
	}));

	//method
	$es4.$$public_function('getListFilter_none', FileUtil, (function ()
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
	}));

	//method
	$es4.$$public_function('getListFilter_hidden', FileUtil, (function ()
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
	}));

	//method
	$es4.$$public_function('getListFilter_extension', FileUtil, (function ($$$$extension, $$$$include_)
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

			var result = $es4.$$call(file, null, null, 'src', 'slice', [-$es4.$$get(extension, null, null, 'length')]);
			if (result == extension)
			{
				return (include_) ? file : null;
			}
			return (include_) ? null : file;
		}
;

		return filter;
	}));

	//method
	$es4.$$public_function('getListFilter_name', FileUtil, (function ($$$$name, $$$$include_)
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

			var result = $es4.$$call($es4.$$call($es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$get(file, null, null, 'src')]), null, null, 'split', ['/']), null, null, 'pop', $es4.$$EMPTY_ARRAY);
			if (result == name)
			{
				return (include_) ? file : null;
			}
			return (include_) ? null : file;
		}
;

		return filter;
	}));

	//method
	$es4.$$public_function('getListFilter_directories', FileUtil, (function ()
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			if ($es4.$$call(file, null, null, 'isDirectory', $es4.$$EMPTY_ARRAY))
			{
				return null;
			}
			return file;
		}
;

		return filter;
	}));

	//method
	$es4.$$public_function('getListFilter_directory', FileUtil, (function ($$$$path)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var path = $$$$path;

		path = $es4.$$call(FileUtil, null, null, 'fixPath', [path]);

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			basePath = $es4.$$call(FileUtil, null, null, 'fixPath', [basePath]);
			if ($es4.$$call($es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$get(file, null, null, 'src')]), null, null, 'indexOf', [path]) == 0)
			{
				return null;
			}
			return file;
		}
;

		return filter;
	}));

	//method
	$es4.$$public_function('getListFilter_list', FileUtil, (function ($$$$list)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var list = $$$$list;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			basePath = $es4.$$call(FileUtil, null, null, 'fixPath', [basePath]);
			var compare1 = $es4.$$get($es4.$$call($es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$get(file, null, null, 'src')]), null, null, 'split', [basePath]), null, null, 1);
			for (var i = 0; i < $es4.$$get(list, null, null, 'length'); i++)
			{
				var compare2 = $es4.$$get($es4.$$call($es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$get(list, null, null, i, 'src')]), null, null, 'split', [$es4.$$call(FileUtil, null, null, 'fixPath', [$es4.$$get(list, null, null, 'basepath')])]), null, null, 1);
				if (compare1 == compare2)
				{
					return null;
				}
			}
			return file;
		}
;

		return filter;
	}));

	//method
	$es4.$$public_function('getListFilter_filters', FileUtil, (function ($$$$filters)
	{
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//set default parameter values
		var filters = $$$$filters;

		function filter($$$$file, $$$$basePath) 
		{
			//set default parameter values
			var file = $$$$file;
			var basePath = $$$$basePath;

			for (var i = 0; i < $es4.$$get(filters, null, null, 'length'); i++)
			{
				var result = $es4.$$get(filters, null, null, i)(file, basePath);
				if (!result)
				{
					return null;
				}
			}
			return file;
		}
;

		return filter;
	}));

	function FileUtil()
	{
		//initialize class if not initialized
		if (FileUtil.$$cinit !== undefined) FileUtil.$$cinit();

		//save scope
		var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
		var $$thisp = this;

		//handle possible cast
		if ($$this === $$thisp && (!($$this instanceof FileUtil) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], FileUtil) : $es4.$$throwArgumentError();
		Object.defineProperty($$this, '$$t', {value:1});

		//constructor
		$es4.$$constructor($$thisp, (function ()
		{
		}));

		//call construct if no arguments, or argument zero does not equal manual construct
		if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
		{
			for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

			$es4.$$construct($$this, $$args);
		}
	}

	////////////////INTERNAL CLASS////////////////
	var VFile = (function ()
	{
		//imports
		var FileUtil;

		//properties
		$es4.$$private_property('fs', VFile);
		$es4.$$private_property('path', VFile);

		//class initializer
		VFile.$$cinit = (function ()
		{
			VFile.$$cinit = undefined;

			//initialize imports
			FileUtil = $es4.$$['sweetrush.utils'].FileUtil;

			//initialize properties
			VFile.fs = require('fs');
			VFile.path = require('path');
		});

		function VFile()
		{
			//initialize class if not initialized
			if (VFile.$$cinit !== undefined) VFile.$$cinit();

			//save scope
			var $$this = (arguments.length !== 0 && arguments[0] === $es4.$$MANUAL_CONSTRUCT && arguments[1] !== undefined) ? arguments[1] : this;
			var $$thisp = this;

			//handle possible cast
			if ($$this === $$thisp && (!($$this instanceof VFile) || $$this.$$t !== undefined)) return (arguments.length !== 0) ? $es4.$$as(arguments[0], VFile) : $es4.$$throwArgumentError();
			Object.defineProperty($$this, '$$t', {value:1});

			//properties
			$es4.$$public_property('src', $$thisp, String);

			//constructor
			$es4.$$constructor($$thisp, (function ($$$$src)
			{
				//set default parameter values
				var src = $$$$src;

				if (true)
				{
					$es4.$$set($$this, $$this, $$thisp, 'src', $es4.$$call(FileUtil, $$this, $$thisp, 'fixPath', [$es4.$$call(VFile, $$this, $$thisp, 'path', 'normalize', [src])]), '=');
				}
				if (false)
				{
				}
			}));

			//method
			$es4.$$public_function('listFiles', $$thisp, (function ()
			{
				function getFiles($$$$dir, $$$$files_) 
				{
					//set default parameter values
					var dir = $$$$dir;
					var files_ = $$$$files_;

					files_ = files_ || [];
					var files = $es4.$$call(FileUtil, $$this, $$thisp, 'readDirectory', [dir]);
					for (var $$i0 = (files || $es4.$$EMPTY_OBJECT).$$nextNameIndex(0); $$i0 != 0; $$i0 = files.$$nextNameIndex($$i0))
					{
						var i = files.$$nextName($$i0);

						var name = $es4.$$get(files, $$this, $$thisp, i);
						if ($es4.$$call($es4.$$primitive(new (VFile)(name)), $$this, $$thisp, 'isDirectory', $es4.$$EMPTY_ARRAY))
						{
							getFiles(name, files_);
						}
						else
						{
							$es4.$$call(files_, $$this, $$thisp, 'push', [$es4.$$primitive(new (VFile)(name))]);
						}
					}
					return files_;
				}
;

				return getFiles($es4.$$get($$this, $$this, $$thisp, 'src'), []);
			}));

			//method
			$es4.$$public_function('getPath', $$thisp, (function ()
			{
				if (false)
				{
				}
				if (true)
				{
					return $es4.$$call($es4.$$call($es4.$$call(VFile, $$this, $$thisp, 'path', 'dirname', [$es4.$$get($$this, $$this, $$thisp, 'src')]), $$this, $$thisp, 'split', ['/']), $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				}
			}));

			//method
			$es4.$$public_function('getParent', $$thisp, (function ()
			{
				if (false)
				{
				}
				if (true)
				{
					return $es4.$$call($es4.$$call($es4.$$call(VFile, $$this, $$thisp, 'path', 'dirname', [$es4.$$get($$this, $$this, $$thisp, 'src')]), $$this, $$thisp, 'split', ['/']), $$this, $$thisp, 'pop', $es4.$$EMPTY_ARRAY);
				}
			}));

			//method
			$es4.$$public_function('isHidden', $$thisp, (function ()
			{
				return false;
			}));

			//method
			$es4.$$public_function('equals', $$thisp, (function ($$$$file)
			{
				//set default parameter values
				var file = $$$$file;

				return $es4.$$get($$this, $$this, $$thisp, 'src') == $es4.$$get(file, $$this, $$thisp, 'src');
			}));

			//method
			$es4.$$public_function('isDirectory', $$thisp, (function ()
			{
				if (false)
				{
				}
				if (true)
				{
					return $es4.$$call($es4.$$call(VFile, $$this, $$thisp, 'fs', 'statSync', [$es4.$$get($$this, $$this, $$thisp, 'src')]), $$this, $$thisp, 'isDirectory', $es4.$$EMPTY_ARRAY);
				}
			}));

			//method
			$es4.$$public_function('toString', $$thisp, (function ()
			{
				return $es4.$$get($$this, $$this, $$thisp, 'src');
			}));

			//call construct if no arguments, or argument zero does not equal manual construct
			if (arguments.length === 0 || arguments[0] !== $es4.$$MANUAL_CONSTRUCT)
			{
				for (var $$i = 0, $$length = arguments.length, $$args = new Array($$length); $$i < $$length; $$i += 1) $$args[$$i] = arguments[$$i];

				$es4.$$construct($$this, $$args);
			}
		}

		return $es4.$$class(VFile, null, 'VFile');
	})();

	return $es4.$$class(FileUtil, {CLASSES:[VFile]}, 'sweetrush.utils::FileUtil');
})();
//sweetrush.utils.FileUtil


$es4.$$['sweetrush.obj'].Construct.$$pcinit();

$es4.$$['sweetrush.core'].TranslatorProto.$$pcinit();

$es4.$$['sweetrush'].Transcompiler.$$pcinit();

$es4.$$['sweetrush.utils'].Base64Util.$$pcinit();

$es4.$$['sweetrush.utils'].SwcUtil.$$pcinit();

$es4.$$['sweetrush.obj'].Token.$$pcinit();

$es4.$$['sweetrush.core'].Analyzer.$$pcinit();

$es4.$$['sweetrush.core'].Parser.$$pcinit();

$es4.$$['sweetrush.core'].TranslatorPrototype.$$pcinit();

$es4.$$['sweetrush.utils'].JsonUtil.$$pcinit();

$es4.$$['sweetrush.core'].Lexer.$$pcinit();

$es4.$$['sweetrush.utils'].FileUtil.$$pcinit();

var _object = module.exports = new $es4.$$['sweetrush'].Transcompiler($es4.$$MANUAL_CONSTRUCT)
$es4.$$construct(_object, $es4.$$EMPTY_ARRAY);
_object;