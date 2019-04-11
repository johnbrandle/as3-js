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