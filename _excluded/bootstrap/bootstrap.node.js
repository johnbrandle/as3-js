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

	var DEFAULT_STACK_TRACE_LIMIT = 10;

	// Polyfill Error.captureStackTrace, which exists only in v8 (Chrome). This is
	// used in depd, which is used by ast-types. https://github.com/esnext/es6-module-transpiler/blob/master/lib/browser/capture_stack_trace_polyfill.js
	if (!Error.captureStackTrace) {

	  Error.captureStackTrace = function(obj) {
		var stack = new $es4.$$Error().stack;
		var prepare = Error.prepareStackTrace;

		if (prepare) {
		  stack = prepare(stack, parseStack(stack));
		}

		obj.stack = stack;
	  };
	}

	if (typeof Error.stackTraceLimit === 'undefined') {
	  Error.stackTraceLimit = DEFAULT_STACK_TRACE_LIMIT;
	}

	function parseStack(stack) {
	  return stack.split('\n').slice(0, Error.stackTraceLimit).map(CallSite.parse);
	}

	CallSite.parse = function(stackTraceLine) {
	  var fnNameAndLocation = stackTraceLine.split('@');
	  var fnName = fnNameAndLocation[0];
	  var location = fnNameAndLocation[1];

	  var fileAndLineAndColumn = location ? location.split(':') : [];
	  var fileName = fileAndLineAndColumn[0];
	  var lineNumber = parseInt(fileAndLineAndColumn[1], 10);
	  var columnNumber = parseInt(fileAndLineAndColumn[2], 10);

	  return new CallSite(fnName, fileName, lineNumber, columnNumber, fnName === 'eval', '');
	};


	function CallSite(fnName, fileName, lineNumber, columnNumber, isEval, evalOrigin) {
	  this.getFunctionName = function() { return fnName; };
	  this.getFileName = function() { return fileName; };
	  this.getLineNumber = function() { return lineNumber; };
	  this.getColumnNumber = function() { return columnNumber; };
	  this.isEval = function() { return isEval; };
	  this.getEvalOrigin = function() { return evalOrigin; };
	}

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