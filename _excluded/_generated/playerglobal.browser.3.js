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