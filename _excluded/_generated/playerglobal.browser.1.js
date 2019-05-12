//__ES4__

(function() { var $window = this; var window = $window.parent || $window; var global = window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$; var alert = window.alert; 

//flash.utils.flash_proxy
$es4.$$package('flash.utils').flash_proxy = $es4.$$namespace('http://www.sweetrush.com/flash/proxy', true);
//flash.utils.flash_proxy


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
	var Event;
	var TextEvent;
	var ErrorEvent;

	//properties
	ErrorEvent.ERROR = 'error';

	//class initializer
	ErrorEvent.$$cinit = (function ()
	{
		ErrorEvent.$$cinit = undefined;

		//initialize imports
		Event = $es4.$$['flash.events'].Event;
		TextEvent = $es4.$$['flash.events'].TextEvent;
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


//flash.utils.ByteArray
$es4.$$package('flash.utils').ByteArray = (function ()
{
	//imports
	var ObjectEncoding;
	var IDataOutput;
	var Endian;
	var ByteArray;
	var IDataInput;

	//properties
	ByteArray.BYTES_GROW_SIZE = 1024;

	//class initializer
	ByteArray.$$cinit = (function ()
	{
		ByteArray.$$cinit = undefined;

		//initialize imports
		ObjectEncoding = $es4.$$['flash.net'].ObjectEncoding;
		IDataOutput = $es4.$$['flash.utils'].IDataOutput;
		Endian = $es4.$$['flash.utils'].Endian;
		IDataInput = $es4.$$['flash.utils'].IDataInput;
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
				var arrayBuffer = $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'ArrayBuffer'))());
				var dataView = $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'DataView'))(arrayBuffer));
				$es4.$$set(object, $$this, $$thisp, 'ByteArrayScope', {$_arrayBuffer:arrayBuffer, $_dataView:dataView, $_bytePosition:0, $_byteLength:0, $_endian:$es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN'), $_growSize:$es4.$$get(ByteArray, $$this, $$thisp, 'BYTES_GROW_SIZE')}, '=');
				$es4.$$set(object, $$this, $$thisp, 'TLScope', $$this, '=');
				return $es4.$$set($$thisp, $$this, $$thisp, '$_properties', object, '=');
			}
			return $es4.$$get($$thisp, $$this, $$thisp, '$_properties');
		}));

		//method
		$es4.$$public_function('$__getArrayBuffer', $$thisp, (function ()
		{
			return $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'slice', [0, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength')]);
		}));

		//method
		$es4.$$public_function('$__setArrayBuffer', $$thisp, (function ($$$$arrayBuffer)
		{
			//set default parameter values
			var arrayBuffer = $$$$arrayBuffer;

			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', arrayBuffer, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'DataView'))(arrayBuffer)), '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', $es4.$$get(arrayBuffer, $$this, $$thisp, 'byteLength'), '=');
		}));

		//method
		$es4.$$public_function('clear', $$thisp, (function ()
		{
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', null, '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', null, '=');
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
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getInt8', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition')]);
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
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getFloat64', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 8, '+=');
			return $es4.$$coerce(value, Number);
		}));

		//method
		$es4.$$public_function('readFloat', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getFloat32', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, Number);
		}));

		//method
		$es4.$$public_function('readInt', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getInt32', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, int);
		}));

		//method
		$es4.$$public_function('readMultiByte', $$thisp, (function ($$$$length, $$$$charSet)
		{
			//set default parameter values
			var length = $es4.$$coerce($$$$length, uint);
			var charSet = $es4.$$coerce($$$$charSet, String);

			if (charSet !== 'iso-8859-1' && charSet != 'utf-8')
			{
				throw $es4.$$primitive(new (Error)('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"'));
			}
			if (charSet === 'utf-8')
			{
				return $es4.$$call($$this, $$this, $$thisp, 'readUTFBytes', [length]);
			}
			var value = $es4.$$call(String, $$this, $$thisp, 'fromCharCode', 'apply', [null, $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), length))]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', length, '+=');
			return $es4.$$coerce(value, String);
		}));

		//method
		$es4.$$public_function('readShort', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getInt16', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 2, '+=');
			return $es4.$$coerce(value, int);
		}));

		//method
		$es4.$$public_function('readUnsignedByte', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getUint8', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 1, '+=');
			return $es4.$$coerce(value, uint);
		}));

		//method
		$es4.$$public_function('readUnsignedInt', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getUint32', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
			return $es4.$$coerce(value, uint);
		}));

		//method
		$es4.$$public_function('readUnsignedShort', $$thisp, (function ()
		{
			var value = $es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'getUint16', [$es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
			var bytes = $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer'), $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition'), length));
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setInt8', [bytePosition, value]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setUint8', [bytePosition, value]);
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
			var arrayBuffer = $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer');
			if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength'))
			{
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					var oldArrayBuffer = arrayBuffer;
					arrayBuffer = $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'ArrayBuffer'))(newBytePosition + ($es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize', ($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize') * 2), '='))));
					$es4.$$call($es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))(arrayBuffer)), $$this, $$thisp, 'set', [$es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))(oldArrayBuffer))]);
				}
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
			}
			$es4.$$call($es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))(arrayBuffer)), $$this, $$thisp, 'set', [$es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))($es4.$$call($es4.$$call(readFrom, $$this, $$thisp, '$__properties', $es4.$$EMPTY_ARRAY), $$this, $$thisp, 'ByteArrayScope', '$_arrayBuffer', 'slice', [offset, offset + length]))), bytePosition]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'DataView'))(arrayBuffer)), '=');
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', arrayBuffer, '=');
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setFloat64', [bytePosition, value, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setFloat32', [bytePosition, value, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setInt32', [bytePosition, value, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_bytePosition', 4, '+=');
		}));

		//method
		$es4.$$public_function('writeMultiByte', $$thisp, (function ($$$$string, $$$$charSet)
		{
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);
			var charSet = $es4.$$coerce($$$$charSet, String);

			if (charSet !== 'iso-8859-1' && charSet !== 'utf-8')
			{
				throw $es4.$$primitive(new (Error)('ByteArray: your selected charSet is not supported at this time, use: "iso-8859-1" or "utf-8"'));
			}
			if (charSet == 'utf-8')
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'internalWriteUTFBytes', [string]);
				return;
			}
			var index = 0;
			while (index < $es4.$$get(string, $$this, $$thisp, 'length'))
			{
				var charCode = $es4.$$coerce($es4.$$call(string, $$this, $$thisp, 'charCodeAt', [index++]), uint);
				$es4.$$call($$thisp, $$this, $$thisp, 'writeUnsignedByte', [charCode]);
			}
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setInt16', [bytePosition, value, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setUint16', [bytePosition, value, endian != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
				{
					$es4.$$set($$this, $$this, $$thisp, 'length', newBytePosition, '=');
				}
				else
				{
					$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_byteLength', newBytePosition, '=');
				}
			}
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setUint32', [bytePosition, value, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
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
				if (newBytePosition > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
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
			$es4.$$call($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', 'setUint16', [bytePosition, length, $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian') != $es4.$$get(Endian, $$this, $$thisp, 'BIG_ENDIAN')]);
		}));

		//method
		$es4.$$private_function('internalWriteUTFBytes', $$thisp, (function ($$$$string)
		{
			//set default parameter values
			var string = $es4.$$coerce($$$$string, String);

			var utf8 = [];
			for (var i = 0; i < $es4.$$get(string, $$this, $$thisp, 'length'); i++)
			{
				var charcode = $es4.$$call(string, $$this, $$thisp, 'charCodeAt', [i]);
				if (charcode < 0x80)
				{
					$es4.$$call(utf8, $$this, $$thisp, 'push', [charcode]);
				}
				else if (charcode < 0x800)
				{
					$es4.$$call(utf8, $$this, $$thisp, 'push', [0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f)]);
				}
				else if (charcode < 0xd800 || charcode >= 0xe000)
				{
					$es4.$$call(utf8, $$this, $$thisp, 'push', [0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f)]);
				}
				else
				{
					i++;
					charcode = 0x10000 + (((charcode & 0x3ff) << 10) | ($es4.$$call(string, $$this, $$thisp, 'charCodeAt', [i]) & 0x3ff));
					$es4.$$call(utf8, $$this, $$thisp, 'push', [0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f)]);
				}
			}
			var index = 0;
			var bytesLength = $es4.$$get(utf8, $$this, $$thisp, 'length');
			while (index < bytesLength)
			{
				$es4.$$call($$thisp, $$this, $$thisp, 'writeUnsignedByte', [$es4.$$get(utf8, $$this, $$thisp, index)]);
				index++;
			}
			return bytesLength;
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

			$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_endian', type, '=');
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
			var arrayBuffer;
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
			if (value > $es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', 'byteLength'))
			{
				arrayBuffer = $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'ArrayBuffer'))(value + ($es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize', ($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_growSize') * 2), '='))));
				$es4.$$call($es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))(arrayBuffer)), $$this, $$thisp, 'set', [$es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'Uint8Array'))($es4.$$get($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer')))]);
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_dataView', $es4.$$primitive(new ($es4.$$get(window, $$this, $$thisp, 'DataView'))(arrayBuffer)), '=');
				$es4.$$set($$thisp, $$this, $$thisp, '$_properties', 'ByteArrayScope', '$_arrayBuffer', arrayBuffer, '=');
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
	var Event;
	var TextEvent;

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


$es4.$$['flash.utils'].IDataOutput.$$pcinit();

$es4.$$['flash.events'].IEventDispatcher.$$pcinit();

$es4.$$['flash.net'].IDynamicPropertyWriter.$$pcinit();

$es4.$$['flash.utils'].IDataInput.$$pcinit();

$es4.$$['flash.display'].Sprite.$$pcinit();

$es4.$$['flash.net'].ObjectEncoding.$$pcinit();

$es4.$$['flash.utils'].Proxy.$$pcinit();

$es4.$$['flash.events'].ErrorEvent.$$pcinit();

$es4.$$['flash.utils'].Endian.$$pcinit();

$es4.$$['flash.utils'].ByteArray.$$pcinit();

$es4.$$['flash.events'].Event.$$pcinit();

$es4.$$['flash.events'].EventPhase.$$pcinit();

$es4.$$['flash.utils'].Dictionary.$$pcinit();

$es4.$$['flash.events'].EventDispatcher.$$pcinit();

$es4.$$['flash.events'].TextEvent.$$pcinit();})();