(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (factory((global.Formik = {}),global.React));
}(this, (function (exports,React) { 'use strict';

    var React__default = 'default' in React ? React['default'] : React;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    var isArray = Array.isArray;
    var keyList = Object.keys;
    var hasProp = Object.prototype.hasOwnProperty;
    var hasElementType = typeof Element !== 'undefined';

    function equal(a, b) {
      // fast-deep-equal index.js 2.0.1
      if (a === b) return true;

      if (a && b && typeof a == 'object' && typeof b == 'object') {
        var arrA = isArray(a)
          , arrB = isArray(b)
          , i
          , length
          , key;

        if (arrA && arrB) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0;)
            if (!equal(a[i], b[i])) return false;
          return true;
        }

        if (arrA != arrB) return false;

        var dateA = a instanceof Date
          , dateB = b instanceof Date;
        if (dateA != dateB) return false;
        if (dateA && dateB) return a.getTime() == b.getTime();

        var regexpA = a instanceof RegExp
          , regexpB = b instanceof RegExp;
        if (regexpA != regexpB) return false;
        if (regexpA && regexpB) return a.toString() == b.toString();

        var keys = keyList(a);
        length = keys.length;

        if (length !== keyList(b).length)
          return false;

        for (i = length; i-- !== 0;)
          if (!hasProp.call(b, keys[i])) return false;
        // end fast-deep-equal

        // start react-fast-compare
        // custom handling for DOM elements
        if (hasElementType && a instanceof Element && b instanceof Element)
          return a === b;

        // custom handling for React
        for (i = length; i-- !== 0;) {
          key = keys[i];
          if (key === '_owner' && a.$$typeof) {
            // React-specific: avoid traversing React elements' _owner.
            //  _owner contains circular references
            // and is not needed when comparing the actual elements (and not their owners)
            // .$$typeof and ._store on just reasonable markers of a react element
            continue;
          } else {
            // all other properties should be traversed as usual
            if (!equal(a[key], b[key])) return false;
          }
        }
        // end react-fast-compare

        // fast-deep-equal index.js 2.0.1
        return true;
      }

      return a !== a && b !== b;
    }
    // end fast-deep-equal

    var reactFastCompare = function exportedEqual(a, b) {
      try {
        return equal(a, b);
      } catch (error) {
        if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
          // warn on circular references, don't crash
          // browsers give this different errors name and messages:
          // chrome/safari: "RangeError", "Maximum call stack size exceeded"
          // firefox: "InternalError", too much recursion"
          // edge: "Error", "Out of stack space"
          console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
          return false;
        }
        // some other error. we should definitely know about these
        throw error;
      }
    };

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
    	return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, options) {
    	return (options.clone !== false && options.isMergeableObject(value))
    		? deepmerge(emptyTarget(value), value, options)
    		: value
    }

    function defaultArrayMerge(target, source, options) {
    	return target.concat(source).map(function(element) {
    		return cloneUnlessOtherwiseSpecified(element, options)
    	})
    }

    function mergeObject(target, source, options) {
    	var destination = {};
    	if (options.isMergeableObject(target)) {
    		Object.keys(target).forEach(function(key) {
    			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    		});
    	}
    	Object.keys(source).forEach(function(key) {
    		if (!options.isMergeableObject(source[key]) || !target[key]) {
    			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    		} else {
    			destination[key] = deepmerge(target[key], source[key], options);
    		}
    	});
    	return destination
    }

    function deepmerge(target, source, options) {
    	options = options || {};
    	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

    	var sourceIsArray = Array.isArray(source);
    	var targetIsArray = Array.isArray(target);
    	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    	if (!sourceAndTargetTypesMatch) {
    		return cloneUnlessOtherwiseSpecified(source, options)
    	} else if (sourceIsArray) {
    		return options.arrayMerge(target, source, options)
    	} else {
    		return mergeObject(target, source, options)
    	}
    }

    deepmerge.all = function deepmergeAll(array, options) {
    	if (!Array.isArray(array)) {
    		throw new Error('first argument should be an array')
    	}

    	return array.reduce(function(prev, next) {
    		return deepmerge(prev, next, options)
    	}, {})
    };

    var deepmerge_1 = deepmerge;

    /**
     * Copyright 2015, Yahoo! Inc.
     * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
     */
    var REACT_STATICS = {
        childContextTypes: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true
    };

    var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
    };

    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

    function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

            if (objectPrototype) {
                var inheritedComponent = getPrototypeOf(sourceComponent);
                if (inheritedComponent && inheritedComponent !== objectPrototype) {
                    hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
                }
            }

            var keys = getOwnPropertyNames(sourceComponent);

            if (getOwnPropertySymbols) {
                keys = keys.concat(getOwnPropertySymbols(sourceComponent));
            }

            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                    try { // Avoid failures from read-only properties
                        defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                }
            }

            return targetComponent;
        }

        return targetComponent;
    }

    var hoistNonReactStatics_cjs = hoistNonReactStatics;

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     *
     * 
     */

    function makeEmptyFunction(arg) {
      return function () {
        return arg;
      };
    }

    /**
     * This function accepts and discards inputs; it has no side effects. This is
     * primarily useful idiomatically for overridable function endpoints which
     * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
     */
    var emptyFunction = function emptyFunction() {};

    emptyFunction.thatReturns = makeEmptyFunction;
    emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction.thatReturnsThis = function () {
      return this;
    };
    emptyFunction.thatReturnsArgument = function (arg) {
      return arg;
    };

    var emptyFunction_1 = emptyFunction;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     *
     */

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var validateFormat = function validateFormat(format) {};

    {
      validateFormat = function validateFormat(format) {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      };
    }

    function invariant(condition, format, a, b, c, d, e, f) {
      validateFormat(format);

      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    var invariant_1 = invariant;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = emptyFunction_1;

    {
      var printWarning = function printWarning(format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };

      warning = function warning(condition, format) {
        if (format === undefined) {
          throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
        }

        if (format.indexOf('Failed Composite propType: ') === 0) {
          return; // Ignore CompositeComponent proptype check.
        }

        if (!condition) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          printWarning.apply(undefined, [format].concat(args));
        }
      };
    }

    var warning_1 = warning;

    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
    	if (val === null || val === undefined) {
    		throw new TypeError('Object.assign cannot be called with null or undefined');
    	}

    	return Object(val);
    }

    function shouldUseNative() {
    	try {
    		if (!Object.assign) {
    			return false;
    		}

    		// Detect buggy property enumeration order in older V8 versions.

    		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
    		test1[5] = 'de';
    		if (Object.getOwnPropertyNames(test1)[0] === '5') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test2 = {};
    		for (var i = 0; i < 10; i++) {
    			test2['_' + String.fromCharCode(i)] = i;
    		}
    		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    			return test2[n];
    		});
    		if (order2.join('') !== '0123456789') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test3 = {};
    		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    			test3[letter] = letter;
    		});
    		if (Object.keys(Object.assign({}, test3)).join('') !==
    				'abcdefghijklmnopqrst') {
    			return false;
    		}

    		return true;
    	} catch (err) {
    		// We don't expect any of the above to throw, but better to be safe.
    		return false;
    	}
    }

    var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty.call(from, key)) {
    				to[key] = from[key];
    			}
    		}

    		if (getOwnPropertySymbols$1) {
    			symbols = getOwnPropertySymbols$1(from);
    			for (var i = 0; i < symbols.length; i++) {
    				if (propIsEnumerable.call(from, symbols[i])) {
    					to[symbols[i]] = from[symbols[i]];
    				}
    			}
    		}
    	}

    	return to;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret;

    {
      var invariant$1 = invariant_1;
      var warning$1 = warning_1;
      var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
      var loggedTypeFailures = {};
    }

    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      {
        for (var typeSpecName in typeSpecs) {
          if (typeSpecs.hasOwnProperty(typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              invariant$1(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
            } catch (ex) {
              error = ex;
            }
            warning$1(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error.message] = true;

              var stack = getStack ? getStack() : '';

              warning$1(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
            }
          }
        }
      }
    }

    var checkPropTypes_1 = checkPropTypes;

    var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
      /* global Symbol */
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }

      /**
       * Collection of methods that allow declaration and validation of props that are
       * supplied to React components. Example usage:
       *
       *   var Props = require('ReactPropTypes');
       *   var MyArticle = React.createClass({
       *     propTypes: {
       *       // An optional string prop named "description".
       *       description: Props.string,
       *
       *       // A required enum prop named "category".
       *       category: Props.oneOf(['News','Photos']).isRequired,
       *
       *       // A prop named "dialog" that requires an instance of Dialog.
       *       dialog: Props.instanceOf(Dialog).isRequired
       *     },
       *     render: function() { ... }
       *   });
       *
       * A more formal specification of how these methods are used:
       *
       *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
       *   decl := ReactPropTypes.{type}(.isRequired)?
       *
       * Each and every declaration produces a function with the same signature. This
       * allows the creation of custom validation functions. For example:
       *
       *  var MyLink = React.createClass({
       *    propTypes: {
       *      // An optional string or URI prop named "href".
       *      href: function(props, propName, componentName) {
       *        var propValue = props[propName];
       *        if (propValue != null && typeof propValue !== 'string' &&
       *            !(propValue instanceof URI)) {
       *          return new Error(
       *            'Expected a string or an URI for ' + propName + ' in ' +
       *            componentName
       *          );
       *        }
       *      }
       *    },
       *    render: function() {...}
       *  });
       *
       * @internal
       */

      var ANONYMOUS = '<<anonymous>>';

      // Important!
      // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),

        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker,
      };

      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      /*eslint-disable no-self-compare*/
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }
      /*eslint-enable no-self-compare*/

      /**
       * We use an Error-like object for backward compatibility as people may call
       * PropTypes directly and inspect their output. However, we don't use real
       * Errors anymore. We don't inspect their stack anyway, and creating them
       * is prohibitively expensive if they are created too often, such as what
       * happens in oneOfType() for any type before the one that matched.
       */
      function PropTypeError(message) {
        this.message = message;
        this.stack = '';
      }
      // Make `instanceof Error` still work for returned errors.
      PropTypeError.prototype = Error.prototype;

      function createChainableTypeChecker(validate) {
        {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;

          if (secret !== ReactPropTypesSecret_1) {
            if (throwOnDirectAccess) {
              // New behavior only for users of `prop-types` package
              invariant_1(
                false,
                'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                'Use `PropTypes.checkPropTypes()` to call them. ' +
                'Read more at http://fb.me/use-check-prop-types'
              );
            } else if (typeof console !== 'undefined') {
              // Old behavior for people using React.PropTypes
              var cacheKey = componentName + ':' + propName;
              if (
                !manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3
              ) {
                warning_1(
                  false,
                  'You are manually calling a React.PropTypes validation ' +
                  'function for the `%s` prop on `%s`. This is deprecated ' +
                  'and will throw in the standalone `prop-types` package. ' +
                  'You may be seeing this warning due to a third-party PropTypes ' +
                  'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
                  propFullName,
                  componentName
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }

        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);

        return chainedCheckType;
      }

      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            // `propValue` being instance of, say, date/regexp, pass the 'object'
            // check, but we can offer a more precise error message here rather than
            // 'of type `object`'.
            var preciseType = getPreciseType(propValue);

            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
      }

      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          warning_1(false, 'Invalid argument supplied to oneOf, expected an instance of array.');
          return emptyFunction_1.thatReturnsNull;
        }

        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }

          var valuesString = JSON.stringify(expectedValues);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (propValue.hasOwnProperty(key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          warning_1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.');
          return emptyFunction_1.thatReturnsNull;
        }

        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== 'function') {
            warning_1(
              false,
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
              'received %s at index %s.',
              getPostfixForTypeWarning(checker),
              i
            );
            return emptyFunction_1.thatReturnsNull;
          }
        }

        function validate(props, propName, componentName, location, propFullName) {
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
              return null;
            }
          }

          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (!checker) {
              continue;
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          // We need to check all keys in case some are required but missing from
          // props.
          var allKeys = objectAssign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (!checker) {
              return new PropTypeError(
                'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
                '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
                '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
            if (error) {
              return error;
            }
          }
          return null;
        }

        return createChainableTypeChecker(validate);
      }

      function isNode(propValue) {
        switch (typeof propValue) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }

            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                // Iterator will provide entry [k,v] tuples rather than values.
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }

            return true;
          default:
            return false;
        }
      }

      function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
          return true;
        }

        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }

        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }

        return false;
      }

      // Equivalent of `typeof` but with special handling for array and regexp.
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          // Old webkits (at least until Android 4.0) return 'function' rather than
          // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
          // passes PropTypes.object.
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }

      // This handles more types than `getPropType`. Only used for error messages.
      // See `createPrimitiveTypeChecker`.
      function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
          return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }

      // Returns a string that is postfixed to a warning about an invalid type.
      // For example, "undefined" or "of type array"
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case 'array':
          case 'object':
            return 'an ' + type;
          case 'boolean':
          case 'date':
          case 'regexp':
            return 'a ' + type;
          default:
            return type;
        }
      }

      // Returns class name of the object, if any.
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }

      ReactPropTypes.checkPropTypes = checkPropTypes_1;
      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    var propTypes = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    {
      var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
        Symbol.for &&
        Symbol.for('react.element')) ||
        0xeac7;

      var isValidElement = function(object) {
        return typeof object === 'object' &&
          object !== null &&
          object.$$typeof === REACT_ELEMENT_TYPE;
      };

      // By explicitly using `prop-types` you are opting into new development behavior.
      // http://fb.me/prop-types-in-prod
      var throwOnDirectAccess = true;
      module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
    }
    });
    var propTypes_1 = propTypes.object;
    var propTypes_2 = propTypes.oneOfType;
    var propTypes_3 = propTypes.string;
    var propTypes_4 = propTypes.node;
    var propTypes_5 = propTypes.func;
    var propTypes_6 = propTypes.bool;
    var propTypes_7 = propTypes.element;

    var key = '__global_unique_id__';

    var gud = function() {
      return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
    };

    var implementation = createCommonjsModule(function (module, exports) {

    exports.__esModule = true;



    var _react2 = _interopRequireDefault(React__default);



    var _propTypes2 = _interopRequireDefault(propTypes);



    var _gud2 = _interopRequireDefault(gud);



    var _warning2 = _interopRequireDefault(warning_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var MAX_SIGNED_31_BIT_INT = 1073741823;

    // Inlined Object.is polyfill.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    function objectIs(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }

    function createEventEmitter(value) {
      var handlers = [];
      return {
        on: function on(handler) {
          handlers.push(handler);
        },
        off: function off(handler) {
          handlers = handlers.filter(function (h) {
            return h !== handler;
          });
        },
        get: function get() {
          return value;
        },
        set: function set(newValue, changedBits) {
          value = newValue;
          handlers.forEach(function (handler) {
            return handler(value, changedBits);
          });
        }
      };
    }

    function onlyChild(children) {
      return Array.isArray(children) ? children[0] : children;
    }

    function createReactContext(defaultValue, calculateChangedBits) {
      var _Provider$childContex, _Consumer$contextType;

      var contextProp = '__create-react-context-' + (0, _gud2.default)() + '__';

      var Provider = function (_Component) {
        _inherits(Provider, _Component);

        function Provider() {
          var _temp, _this, _ret;

          _classCallCheck(this, Provider);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.emitter = createEventEmitter(_this.props.value), _temp), _possibleConstructorReturn(_this, _ret);
        }

        Provider.prototype.getChildContext = function getChildContext() {
          var _ref;

          return _ref = {}, _ref[contextProp] = this.emitter, _ref;
        };

        Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          if (this.props.value !== nextProps.value) {
            var oldValue = this.props.value;
            var newValue = nextProps.value;
            var changedBits = void 0;

            if (objectIs(oldValue, newValue)) {
              changedBits = 0; // No change
            } else {
              changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;
              {
                (0, _warning2.default)((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: %s', changedBits);
              }

              changedBits |= 0;

              if (changedBits !== 0) {
                this.emitter.set(nextProps.value, changedBits);
              }
            }
          }
        };

        Provider.prototype.render = function render() {
          return this.props.children;
        };

        return Provider;
      }(React__default.Component);

      Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = _propTypes2.default.object.isRequired, _Provider$childContex);

      var Consumer = function (_Component2) {
        _inherits(Consumer, _Component2);

        function Consumer() {
          var _temp2, _this2, _ret2;

          _classCallCheck(this, Consumer);

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, _Component2.call.apply(_Component2, [this].concat(args))), _this2), _this2.state = {
            value: _this2.getValue()
          }, _this2.onUpdate = function (newValue, changedBits) {
            var observedBits = _this2.observedBits | 0;
            if ((observedBits & changedBits) !== 0) {
              _this2.setState({ value: _this2.getValue() });
            }
          }, _temp2), _possibleConstructorReturn(_this2, _ret2);
        }

        Consumer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          var observedBits = nextProps.observedBits;

          this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
          : observedBits;
        };

        Consumer.prototype.componentDidMount = function componentDidMount() {
          if (this.context[contextProp]) {
            this.context[contextProp].on(this.onUpdate);
          }
          var observedBits = this.props.observedBits;

          this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
          : observedBits;
        };

        Consumer.prototype.componentWillUnmount = function componentWillUnmount() {
          if (this.context[contextProp]) {
            this.context[contextProp].off(this.onUpdate);
          }
        };

        Consumer.prototype.getValue = function getValue() {
          if (this.context[contextProp]) {
            return this.context[contextProp].get();
          } else {
            return defaultValue;
          }
        };

        Consumer.prototype.render = function render() {
          return onlyChild(this.props.children)(this.state.value);
        };

        return Consumer;
      }(React__default.Component);

      Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = _propTypes2.default.object, _Consumer$contextType);


      return {
        Provider: Provider,
        Consumer: Consumer
      };
    }

    exports.default = createReactContext;
    module.exports = exports['default'];
    });

    unwrapExports(implementation);

    var lib = createCommonjsModule(function (module, exports) {

    exports.__esModule = true;



    var _react2 = _interopRequireDefault(React__default);



    var _implementation2 = _interopRequireDefault(implementation);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = _react2.default.createContext || _implementation2.default;
    module.exports = exports['default'];
    });

    var createContext = unwrapExports(lib);

    var _a;
    var FormikProvider = (_a =
    /*#__PURE__*/
    createContext({}), _a.Provider),
        FormikConsumer = _a.Consumer;
    function connect(Comp) {
      var C = function (props) {
        return React.createElement(FormikConsumer, null, function (formik) {
          return React.createElement(Comp, __assign({}, props, {
            formik: formik
          }));
        });
      };

      var componentDisplayName = Comp.displayName || Comp.name || Comp.constructor && Comp.constructor.name || 'Component';
      C.WrappedComponent = Comp;
      C.displayName = "FormikConnect(" + componentDisplayName + ")";
      return hoistNonReactStatics_cjs(C, Comp);
    }

    function warning$2(condition, message) {
      {
        if (condition) {
          return;
        }

        var text = "Warning: " + message;

        if (typeof console !== 'undefined') {
          console.warn(text);
        }

        try {
          throw Error(text);
        } catch (x) {}
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */
    var Symbol$1 = root.Symbol;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$1.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString$1.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag$1 && symToStringTag$1 in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype,
        objectProto$2 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */
    var Map = getNative(root, 'Map');

    /* Built-in method references that are verified to be native. */
    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    var defineProperty$1 = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty$1) {
        defineProperty$1(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$5.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray$1 = Array.isArray;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /** Detect free variable `exports`. */
    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
    }

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag$1 = '[object Function]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
    typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag] = typedArrayTags[numberTag] =
    typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
    typedArrayTags[setTag] = typedArrayTags[stringTag] =
    typedArrayTags[weakMapTag] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /** Detect free variable `exports`. */
    var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports$1 && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$7.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray$1(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$7.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

      return value === proto;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = overArg(Object.keys, Object);

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$a = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$a.hasOwnProperty;

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn$1(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn$1(source), object);
    }

    /** Detect free variable `exports`. */
    var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

    /** Built-in value references. */
    var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
        allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable$1.call(object, symbol);
      });
    };

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /** Built-in value references. */
    var getPrototype = overArg(Object.getPrototypeOf, Object);

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
    }

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView');

    /* Built-in method references that are verified to be native. */
    var Promise$1 = getNative(root, 'Promise');

    /* Built-in method references that are verified to be native. */
    var Set = getNative(root, 'Set');

    /* Built-in method references that are verified to be native. */
    var WeakMap$1 = getNative(root, 'WeakMap');

    /** `Object#toString` result references. */
    var mapTag$1 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$1 = '[object Set]',
        weakMapTag$1 = '[object WeakMap]';

    var dataViewTag$1 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise$1),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap$1);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
        (Map && getTag(new Map) != mapTag$1) ||
        (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag$1) ||
        (WeakMap$1 && getTag(new WeakMap$1) != weakMapTag$1)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$1;
            case mapCtorString: return mapTag$1;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$1;
            case weakMapCtorString: return weakMapTag$1;
          }
        }
        return result;
      };
    }

    var getTag$1 = getTag;

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$a = objectProto$c.hasOwnProperty;

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty$a.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /** Built-in value references. */
    var Uint8Array = root.Uint8Array;

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /** `Object#toString` result references. */
    var boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        symbolTag = '[object Symbol]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$2 = '[object DataView]',
        float32Tag$1 = '[object Float32Array]',
        float64Tag$1 = '[object Float64Array]',
        int8Tag$1 = '[object Int8Array]',
        int16Tag$1 = '[object Int16Array]',
        int32Tag$1 = '[object Int32Array]',
        uint8Tag$1 = '[object Uint8Array]',
        uint8ClampedTag$1 = '[object Uint8ClampedArray]',
        uint16Tag$1 = '[object Uint16Array]',
        uint32Tag$1 = '[object Uint32Array]';

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag$1:
          return cloneArrayBuffer(object);

        case boolTag$1:
        case dateTag$1:
          return new Ctor(+object);

        case dataViewTag$2:
          return cloneDataView(object, isDeep);

        case float32Tag$1: case float64Tag$1:
        case int8Tag$1: case int16Tag$1: case int32Tag$1:
        case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
          return cloneTypedArray(object, isDeep);

        case mapTag$2:
          return new Ctor;

        case numberTag$1:
        case stringTag$1:
          return new Ctor(object);

        case regexpTag$1:
          return cloneRegExp(object);

        case setTag$2:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /** Built-in value references. */
    var objectCreate = Object.create;

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /** `Object#toString` result references. */
    var mapTag$3 = '[object Map]';

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag$1(value) == mapTag$3;
    }

    /* Node.js helper references. */
    var nodeIsMap = nodeUtil && nodeUtil.isMap;

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /** `Object#toString` result references. */
    var setTag$3 = '[object Set]';

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag$1(value) == setTag$3;
    }

    /* Node.js helper references. */
    var nodeIsSet = nodeUtil && nodeUtil.isSet;

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG = 1,
        CLONE_FLAT_FLAG = 2,
        CLONE_SYMBOLS_FLAG = 4;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$2 = '[object Boolean]',
        dateTag$2 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag$2 = '[object Function]',
        genTag$1 = '[object GeneratorFunction]',
        mapTag$4 = '[object Map]',
        numberTag$2 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$2 = '[object RegExp]',
        setTag$4 = '[object Set]',
        stringTag$2 = '[object String]',
        symbolTag$1 = '[object Symbol]',
        weakMapTag$2 = '[object WeakMap]';

    var arrayBufferTag$2 = '[object ArrayBuffer]',
        dataViewTag$3 = '[object DataView]',
        float32Tag$2 = '[object Float32Array]',
        float64Tag$2 = '[object Float64Array]',
        int8Tag$2 = '[object Int8Array]',
        int16Tag$2 = '[object Int16Array]',
        int32Tag$2 = '[object Int32Array]',
        uint8Tag$2 = '[object Uint8Array]',
        uint8ClampedTag$2 = '[object Uint8ClampedArray]',
        uint16Tag$2 = '[object Uint16Array]',
        uint32Tag$2 = '[object Uint32Array]';

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
    cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
    cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
    cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
    cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
    cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
    cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
    cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
    cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
    cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
    cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
    cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
    cloneableTags[weakMapTag$2] = false;

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray$1(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag$1(value),
            isFunc = tag == funcTag$2 || tag == genTag$1;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });

        return result;
      }

      if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });

        return result;
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG$1 = 1,
        CLONE_SYMBOLS_FLAG$1 = 4;

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
    }

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /** `Object#toString` result references. */
    var symbolTag$2 = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag$2);
    }

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray$1(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray$1(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    function getIn(obj, key, def, p) {
      if (p === void 0) {
        p = 0;
      }

      var path = toPath(key);

      while (obj && p < path.length) {
        obj = obj[path[p++]];
      }

      return obj === undefined ? def : obj;
    }
    function setIn(obj, path, value) {
      var res = {};
      var resVal = res;
      var i = 0;
      var pathArray = toPath(path);

      for (; i < pathArray.length - 1; i++) {
        var currentPath = pathArray[i];
        var currentObj = getIn(obj, pathArray.slice(0, i + 1));

        if (resVal[currentPath]) {
          resVal = resVal[currentPath];
        } else if (currentObj) {
          resVal = resVal[currentPath] = cloneDeep(currentObj);
        } else {
          var nextPath = pathArray[i + 1];
          resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
      }

      if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
        return obj;
      }

      if (value === undefined) {
        delete resVal[pathArray[i]];
      } else {
        resVal[pathArray[i]] = value;
      }

      var result = __assign({}, obj, res);

      if (i === 0 && value === undefined) {
        delete result[pathArray[i]];
      }

      return result;
    }
    function setNestedObjectValues(object, value, visited, response) {
      if (visited === void 0) {
        visited = new WeakMap();
      }

      if (response === void 0) {
        response = {};
      }

      for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
        var k = _a[_i];
        var val = object[k];

        if (isObject$1(val)) {
          if (!visited.get(val)) {
            visited.set(val, true);
            response[k] = Array.isArray(val) ? [] : {};
            setNestedObjectValues(val, value, visited, response[k]);
          }
        } else {
          response[k] = value;
        }
      }

      return response;
    }
    var isFunction$1 = function (obj) {
      return typeof obj === 'function';
    };
    var isObject$1 = function (obj) {
      return obj !== null && typeof obj === 'object';
    };
    var isInteger = function (obj) {
      return String(Math.floor(Number(obj))) === obj;
    };
    var isString = function (obj) {
      return Object.prototype.toString.call(obj) === '[object String]';
    };
    var isNaN = function (obj) {
      return obj !== obj;
    };
    var isEmptyChildren = function (children) {
      return React.Children.count(children) === 0;
    };
    var isPromise = function (value) {
      return isObject$1(value) && isFunction$1(value.then);
    };
    function getActiveElement(doc) {
      doc = doc || (typeof document !== 'undefined' ? document : undefined);

      if (typeof doc === 'undefined') {
        return null;
      }

      try {
        return doc.activeElement || doc.body;
      } catch (e) {
        return doc.body;
      }
    }
    function makeCancelable(promise) {
      var hasCanceled = false;
      var wrappedPromise = new Promise(function (resolve, reject) {
        promise.then(function (val) {
          return hasCanceled ? reject({
            isCanceled: true
          }) : resolve(val);
        }, function (error) {
          return hasCanceled ? reject({
            isCanceled: true
          }) : reject(error);
        });
      });
      return [wrappedPromise, function cancel() {
        hasCanceled = true;
      }];
    }

    var Formik =
    /*#__PURE__*/
    function (_super) {
      __extends(Formik, _super);

      function Formik(props) {
        var _this = _super.call(this, props) || this;

        _this.hcCache = {};
        _this.hbCache = {};

        _this.registerField = function (name, Comp) {
          _this.fields[name] = Comp;
        };

        _this.unregisterField = function (name) {
          delete _this.fields[name];
        };

        _this.setErrors = function (errors) {
          _this.setState({
            errors: errors
          });
        };

        _this.setTouched = function (touched) {
          _this.setState({
            touched: touched
          }, function () {
            if (_this.props.validateOnBlur) {
              _this.runValidations(_this.state.values);
            }
          });
        };

        _this.setValues = function (values) {
          _this.setState({
            values: values
          }, function () {
            if (_this.props.validateOnChange) {
              _this.runValidations(values);
            }
          });
        };

        _this.setStatus = function (status) {
          _this.setState({
            status: status
          });
        };

        _this.setError = function (error) {
          {
            console.warn("Warning: Formik's setError(error) is deprecated and may be removed in future releases. Please use Formik's setStatus(status) instead. It works identically. For more info see https://github.com/jaredpalmer/formik#setstatus-status-any--void");
          }

          _this.setState({
            error: error
          });
        };

        _this.setSubmitting = function (isSubmitting) {
          if (_this.didMount) {
            _this.setState({
              isSubmitting: isSubmitting
            });
          }
        };

        _this.validateField = function (field) {
          _this.setState({
            isValidating: true
          });

          return _this.runSingleFieldLevelValidation(field, getIn(_this.state.values, field)).then(function (error) {
            if (_this.didMount) {
              _this.setState({
                errors: setIn(_this.state.errors, field, error),
                isValidating: false
              });
            }

            return error;
          });
        };

        _this.runSingleFieldLevelValidation = function (field, value) {
          return new Promise(function (resolve) {
            return resolve(_this.fields[field].props.validate(value));
          }).then(function (x) {
            return x;
          }, function (e) {
            return e;
          });
        };

        _this.runValidationSchema = function (values) {
          return new Promise(function (resolve) {
            var validationSchema = _this.props.validationSchema;
            var schema = isFunction$1(validationSchema) ? validationSchema() : validationSchema;
            validateYupSchema(values, schema).then(function () {
              resolve({});
            }, function (err) {
              resolve(yupToFormErrors(err));
            });
          });
        };

        _this.runValidations = function (values) {
          if (values === void 0) {
            values = _this.state.values;
          }

          if (_this.validator) {
            _this.validator();
          }

          var _a = makeCancelable(Promise.all([_this.runFieldLevelValidations(values), _this.props.validationSchema ? _this.runValidationSchema(values) : {}, _this.props.validate ? _this.runValidateHandler(values) : {}]).then(function (_a) {
            var fieldErrors = _a[0],
                schemaErrors = _a[1],
                handlerErrors = _a[2];
            return deepmerge_1.all([fieldErrors, schemaErrors, handlerErrors], {
              arrayMerge: arrayMerge
            });
          })),
              promise = _a[0],
              cancel = _a[1];

          _this.validator = cancel;
          return promise.then(function (errors) {
            _this.setState(function (prevState) {
              if (!reactFastCompare(prevState.errors, errors)) {
                return {
                  errors: errors
                };
              }

              return null;
            });

            return errors;
          }).catch(function (x) {
            return x;
          });
        };

        _this.handleChange = function (eventOrPath) {
          var executeChange = function (eventOrTextValue, maybePath) {
            var field = maybePath;
            var val = eventOrTextValue;
            var parsed;

            if (!isString(eventOrTextValue)) {
              if (eventOrTextValue.persist) {
                eventOrTextValue.persist();
              }

              var _a = eventOrTextValue.target,
                  type = _a.type,
                  name_1 = _a.name,
                  id = _a.id,
                  value = _a.value,
                  checked = _a.checked,
                  outerHTML = _a.outerHTML;
              field = maybePath ? maybePath : name_1 ? name_1 : id;

              if (!field && "development" !== 'production') {
                warnAboutMissingIdentifier({
                  htmlContent: outerHTML,
                  documentationAnchorLink: 'handlechange-e-reactchangeeventany--void',
                  handlerName: 'handleChange'
                });
              }

              val = /number|range/.test(type) ? (parsed = parseFloat(value), isNaN(parsed) ? '' : parsed) : /checkbox/.test(type) ? checked : value;
            }

            if (field) {
              _this.setState(function (prevState) {
                return __assign({}, prevState, {
                  values: setIn(prevState.values, field, val)
                });
              }, function () {
                if (_this.props.validateOnChange) {
                  _this.runValidations(setIn(_this.state.values, field, val));
                }
              });
            }
          };

          if (isString(eventOrPath)) {
            return isFunction$1(_this.hcCache[eventOrPath]) ? _this.hcCache[eventOrPath] : _this.hcCache[eventOrPath] = function (event) {
              return executeChange(event, eventOrPath);
            };
          } else {
            executeChange(eventOrPath);
          }
        };

        _this.setFieldValue = function (field, value, shouldValidate) {
          if (shouldValidate === void 0) {
            shouldValidate = true;
          }

          if (_this.didMount) {
            _this.setState(function (prevState) {
              return __assign({}, prevState, {
                values: setIn(prevState.values, field, value)
              });
            }, function () {
              if (_this.props.validateOnChange && shouldValidate) {
                _this.runValidations(_this.state.values);
              }
            });
          }
        };

        _this.handleSubmit = function (e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }

          if (typeof document !== 'undefined') {
            var activeElement = getActiveElement();

            if (activeElement !== null && activeElement instanceof HTMLButtonElement) {
              warning$2(!!(activeElement.attributes && activeElement.attributes.getNamedItem('type')), 'You submitted a Formik form using a button with an unspecified `type` attribute.  Most browsers default button elements to `type="submit"`. If this is not a submit button, please add `type="button"`.');
            }
          }

          _this.submitForm();
        };

        _this.submitForm = function () {
          _this.setState(function (prevState) {
            return {
              touched: setNestedObjectValues(prevState.values, true),
              isSubmitting: true,
              isValidating: true,
              submitCount: prevState.submitCount + 1
            };
          });

          return _this.runValidations(_this.state.values).then(function (combinedErrors) {
            _this.setState({
              isValidating: false
            });

            var isValid = Object.keys(combinedErrors).length === 0;

            if (isValid) {
              return Promise.resolve(_this.executeSubmit());
            } else if (_this.didMount) {
              _this.setState({
                isSubmitting: false
              });
            }

            return;
          });
        };

        _this.executeSubmit = function () {
          return _this.props.onSubmit(_this.state.values, _this.getFormikActions());
        };

        _this.handleBlur = function (eventOrString) {
          var executeBlur = function (e, path) {
            if (e.persist) {
              e.persist();
            }

            var _a = e.target,
                name = _a.name,
                id = _a.id,
                outerHTML = _a.outerHTML;
            var field = path ? path : name ? name : id;

            if (!field && "development" !== 'production') {
              warnAboutMissingIdentifier({
                htmlContent: outerHTML,
                documentationAnchorLink: 'handleblur-e-any--void',
                handlerName: 'handleBlur'
              });
            }

            _this.setState(function (prevState) {
              return {
                touched: setIn(prevState.touched, field, true)
              };
            });

            if (_this.props.validateOnBlur) {
              _this.runValidations(_this.state.values);
            }
          };

          if (isString(eventOrString)) {
            return isFunction$1(_this.hbCache[eventOrString]) ? _this.hbCache[eventOrString] : _this.hbCache[eventOrString] = function (event) {
              return executeBlur(event, eventOrString);
            };
          } else {
            executeBlur(eventOrString);
          }
        };

        _this.setFieldTouched = function (field, touched, shouldValidate) {
          if (touched === void 0) {
            touched = true;
          }

          if (shouldValidate === void 0) {
            shouldValidate = true;
          }

          _this.setState(function (prevState) {
            return __assign({}, prevState, {
              touched: setIn(prevState.touched, field, touched)
            });
          }, function () {
            if (_this.props.validateOnBlur && shouldValidate) {
              _this.runValidations(_this.state.values);
            }
          });
        };

        _this.setFieldError = function (field, message) {
          _this.setState(function (prevState) {
            return __assign({}, prevState, {
              errors: setIn(prevState.errors, field, message)
            });
          });
        };

        _this.resetForm = function (nextValues) {
          var values = nextValues ? nextValues : _this.props.initialValues;
          _this.initialValues = values;

          _this.setState({
            isSubmitting: false,
            isValidating: false,
            errors: {},
            touched: {},
            error: undefined,
            status: undefined,
            values: values,
            submitCount: 0
          });
        };

        _this.handleReset = function () {
          if (_this.props.onReset) {
            var maybePromisedOnReset = _this.props.onReset(_this.state.values, _this.getFormikActions());

            if (isPromise(maybePromisedOnReset)) {
              maybePromisedOnReset.then(_this.resetForm);
            } else {
              _this.resetForm();
            }
          } else {
            _this.resetForm();
          }
        };

        _this.setFormikState = function (s, callback) {
          return _this.setState(s, callback);
        };

        _this.validateForm = function (values) {
          _this.setState({
            isValidating: true
          });

          return _this.runValidations(values).then(function (errors) {
            _this.setState({
              isValidating: false
            });

            return errors;
          });
        };

        _this.getFormikActions = function () {
          return {
            resetForm: _this.resetForm,
            submitForm: _this.submitForm,
            validateForm: _this.validateForm,
            validateField: _this.validateField,
            setError: _this.setError,
            setErrors: _this.setErrors,
            setFieldError: _this.setFieldError,
            setFieldTouched: _this.setFieldTouched,
            setFieldValue: _this.setFieldValue,
            setStatus: _this.setStatus,
            setSubmitting: _this.setSubmitting,
            setTouched: _this.setTouched,
            setValues: _this.setValues,
            setFormikState: _this.setFormikState
          };
        };

        _this.getFormikComputedProps = function () {
          var isInitialValid = _this.props.isInitialValid;
          var dirty = !reactFastCompare(_this.initialValues, _this.state.values);
          return {
            dirty: dirty,
            isValid: dirty ? _this.state.errors && Object.keys(_this.state.errors).length === 0 : isInitialValid !== false && isFunction$1(isInitialValid) ? isInitialValid(_this.props) : isInitialValid,
            initialValues: _this.initialValues
          };
        };

        _this.getFormikBag = function () {
          return __assign({}, _this.state, _this.getFormikActions(), _this.getFormikComputedProps(), {
            registerField: _this.registerField,
            unregisterField: _this.unregisterField,
            handleBlur: _this.handleBlur,
            handleChange: _this.handleChange,
            handleReset: _this.handleReset,
            handleSubmit: _this.handleSubmit,
            validateOnChange: _this.props.validateOnChange,
            validateOnBlur: _this.props.validateOnBlur
          });
        };

        _this.getFormikContext = function () {
          return __assign({}, _this.getFormikBag(), {
            validationSchema: _this.props.validationSchema,
            validate: _this.props.validate,
            initialValues: _this.initialValues
          });
        };

        _this.state = {
          values: props.initialValues || {},
          errors: {},
          touched: {},
          isSubmitting: false,
          isValidating: false,
          submitCount: 0
        };
        _this.didMount = false;
        _this.fields = {};
        _this.initialValues = props.initialValues || {};
        warning$2(!(props.component && props.render), 'You should not use <Formik component> and <Formik render> in the same <Formik> component; <Formik render> will be ignored');
        warning$2(!(props.component && props.children && !isEmptyChildren(props.children)), 'You should not use <Formik component> and <Formik children> in the same <Formik> component; <Formik children> will be ignored');
        warning$2(!(props.render && props.children && !isEmptyChildren(props.children)), 'You should not use <Formik render> and <Formik children> in the same <Formik> component; <Formik children> will be ignored');
        return _this;
      }

      Formik.prototype.componentDidMount = function () {
        this.didMount = true;
      };

      Formik.prototype.componentWillUnmount = function () {
        this.didMount = false;

        if (this.validator) {
          this.validator();
        }
      };

      Formik.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.enableReinitialize && !reactFastCompare(prevProps.initialValues, this.props.initialValues)) {
          this.initialValues = this.props.initialValues;
          this.resetForm(this.props.initialValues);
        }
      };

      Formik.prototype.runFieldLevelValidations = function (values) {
        var _this = this;

        var fieldKeysWithValidation = Object.keys(this.fields).filter(function (f) {
          return _this.fields && _this.fields[f] && _this.fields[f].props.validate && isFunction$1(_this.fields[f].props.validate);
        });
        var fieldValidations = fieldKeysWithValidation.length > 0 ? fieldKeysWithValidation.map(function (f) {
          return _this.runSingleFieldLevelValidation(f, getIn(values, f));
        }) : [Promise.resolve('DO_NOT_DELETE_YOU_WILL_BE_FIRED')];
        return Promise.all(fieldValidations).then(function (fieldErrorsList) {
          return fieldErrorsList.reduce(function (prev, curr, index) {
            if (curr === 'DO_NOT_DELETE_YOU_WILL_BE_FIRED') {
              return prev;
            }

            if (!!curr) {
              prev = setIn(prev, fieldKeysWithValidation[index], curr);
            }

            return prev;
          }, {});
        });
      };

      Formik.prototype.runValidateHandler = function (values) {
        var _this = this;

        return new Promise(function (resolve) {
          var maybePromisedErrors = _this.props.validate(values);

          if (maybePromisedErrors === undefined) {
            resolve({});
          } else if (isPromise(maybePromisedErrors)) {
            maybePromisedErrors.then(function () {
              resolve({});
            }, function (errors) {
              resolve(errors);
            });
          } else {
            resolve(maybePromisedErrors);
          }
        });
      };

      Formik.prototype.render = function () {
        var _a = this.props,
            component = _a.component,
            render = _a.render,
            children = _a.children;
        var props = this.getFormikBag();
        var ctx = this.getFormikContext();
        return React.createElement(FormikProvider, {
          value: ctx
        }, component ? React.createElement(component, props) : render ? render(props) : children ? isFunction$1(children) ? children(props) : !isEmptyChildren(children) ? React.Children.only(children) : null : null);
      };

      Formik.defaultProps = {
        validateOnChange: true,
        validateOnBlur: true,
        isInitialValid: false,
        enableReinitialize: false
      };
      return Formik;
    }(React.Component);

    function warnAboutMissingIdentifier(_a) {
      var htmlContent = _a.htmlContent,
          documentationAnchorLink = _a.documentationAnchorLink,
          handlerName = _a.handlerName;
      console.warn("Warning: Formik called `" + handlerName + "`, but you forgot to pass an `id` or `name` attribute to your input:\n\n    " + htmlContent + "\n\n    Formik cannot determine which value to update. For more info see https://github.com/jaredpalmer/formik#" + documentationAnchorLink + "\n  ");
    }

    function yupToFormErrors(yupError) {
      var errors = {};

      if (yupError.inner.length === 0) {
        return setIn(errors, yupError.path, yupError.message);
      }

      for (var _i = 0, _a = yupError.inner; _i < _a.length; _i++) {
        var err = _a[_i];

        if (!errors[err.path]) {
          errors = setIn(errors, err.path, err.message);
        }
      }

      return errors;
    }
    function validateYupSchema(values, schema, sync, context) {
      if (sync === void 0) {
        sync = false;
      }

      if (context === void 0) {
        context = {};
      }

      var validateData = {};

      for (var k in values) {
        if (values.hasOwnProperty(k)) {
          var key = String(k);
          validateData[key] = values[key] !== '' ? values[key] : undefined;
        }
      }

      return schema[sync ? 'validateSync' : 'validate'](validateData, {
        abortEarly: false,
        context: context
      });
    }

    function arrayMerge(target, source, options) {
      var destination = target.slice();
      source.forEach(function (e, i) {
        if (typeof destination[i] === 'undefined') {
          var cloneRequested = options.clone !== false;
          var shouldClone = cloneRequested && options.isMergeableObject(e);
          destination[i] = shouldClone ? deepmerge_1(Array.isArray(e) ? [] : {}, e, options) : e;
        } else if (options.isMergeableObject(e)) {
          destination[i] = deepmerge_1(target[i], e, options);
        } else if (target.indexOf(e) === -1) {
          destination.push(e);
        }
      });
      return destination;
    }

    var FieldInner =
    /*#__PURE__*/
    function (_super) {
      __extends(FieldInner, _super);

      function FieldInner(props) {
        var _this = _super.call(this, props) || this;

        var render = props.render,
            children = props.children,
            component = props.component;
        warning$2(!(component && render), 'You should not use <Field component> and <Field render> in the same <Field> component; <Field component> will be ignored');
        warning$2(!(component && children && isFunction$1(children)), 'You should not use <Field component> and <Field children> as a function in the same <Field> component; <Field component> will be ignored.');
        warning$2(!(render && children && !isEmptyChildren(children)), 'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored');
        return _this;
      }

      FieldInner.prototype.componentDidMount = function () {
        this.props.formik.registerField(this.props.name, this);
      };

      FieldInner.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.name !== prevProps.name) {
          this.props.formik.unregisterField(prevProps.name);
          this.props.formik.registerField(this.props.name, this);
        }

        if (this.props.validate !== prevProps.validate) {
          this.props.formik.registerField(this.props.name, this);
        }
      };

      FieldInner.prototype.componentWillUnmount = function () {
        this.props.formik.unregisterField(this.props.name);
      };

      FieldInner.prototype.render = function () {
        var _a = this.props,
            validate = _a.validate,
            name = _a.name,
            render = _a.render,
            children = _a.children,
            _b = _a.component,
            component = _b === void 0 ? 'input' : _b,
            formik = _a.formik,
            props = __rest(_a, ["validate", "name", "render", "children", "component", "formik"]);

        var _validate = formik.validate,
            _validationSchema = formik.validationSchema,
            restOfFormik = __rest(formik, ["validate", "validationSchema"]);

        var field = {
          value: props.type === 'radio' || props.type === 'checkbox' ? props.value : getIn(formik.values, name),
          name: name,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur
        };
        var bag = {
          field: field,
          form: restOfFormik
        };

        if (render) {
          return render(bag);
        }

        if (isFunction$1(children)) {
          return children(bag);
        }

        if (typeof component === 'string') {
          var innerRef = props.innerRef,
              rest = __rest(props, ["innerRef"]);

          return React.createElement(component, __assign({
            ref: innerRef
          }, field, rest, {
            children: children
          }));
        }

        return React.createElement(component, __assign({}, bag, props, {
          children: children
        }));
      };

      return FieldInner;
    }(React.Component);

    var Field =
    /*#__PURE__*/
    connect(FieldInner);

    var Form =
    /*#__PURE__*/
    connect(function (_a) {
      var _b = _a.formik,
          handleReset = _b.handleReset,
          handleSubmit = _b.handleSubmit,
          props = __rest(_a, ["formik"]);

      return React.createElement("form", __assign({
        onReset: handleReset,
        onSubmit: handleSubmit
      }, props));
    });
    Form.displayName = 'Form';

    function withFormik(_a) {
      var _b = _a.mapPropsToValues,
          mapPropsToValues = _b === void 0 ? function (vanillaProps) {
        var val = {};

        for (var k in vanillaProps) {
          if (vanillaProps.hasOwnProperty(k) && typeof vanillaProps[k] !== 'function') {
            val[k] = vanillaProps[k];
          }
        }

        return val;
      } : _b,
          config = __rest(_a, ["mapPropsToValues"]);

      return function createFormik(Component) {
        var componentDisplayName = Component.displayName || Component.name || Component.constructor && Component.constructor.name || 'Component';

        var C = function (_super) {
          __extends(C, _super);

          function C() {
            var _this = _super !== null && _super.apply(this, arguments) || this;

            _this.validate = function (values) {
              return config.validate(values, _this.props);
            };

            _this.validationSchema = function () {
              return isFunction$1(config.validationSchema) ? config.validationSchema(_this.props) : config.validationSchema;
            };

            _this.handleSubmit = function (values, actions) {
              return config.handleSubmit(values, __assign({}, actions, {
                props: _this.props
              }));
            };

            _this.renderFormComponent = function (formikProps) {
              return React.createElement(Component, __assign({}, _this.props, formikProps));
            };

            return _this;
          }

          C.prototype.render = function () {
            var _a = this.props,
                children = _a.children,
                props = __rest(_a, ["children"]);

            return React.createElement(Formik, __assign({}, props, config, {
              validate: config.validate && this.validate,
              validationSchema: config.validationSchema && this.validationSchema,
              initialValues: mapPropsToValues(this.props),
              onSubmit: this.handleSubmit,
              render: this.renderFormComponent
            }));
          };

          C.displayName = "WithFormik(" + componentDisplayName + ")";
          return C;
        }(React.Component);

        return hoistNonReactStatics_cjs(C, Component);
      };
    }

    var move = function (array, from, to) {
      var copy = (array || []).slice();
      var value = copy[from];
      copy.splice(from, 1);
      copy.splice(to, 0, value);
      return copy;
    };
    var swap = function (array, indexA, indexB) {
      var copy = (array || []).slice();
      var a = copy[indexA];
      copy[indexA] = copy[indexB];
      copy[indexB] = a;
      return copy;
    };
    var insert = function (array, index, value) {
      var copy = (array || []).slice();
      copy.splice(index, 0, value);
      return copy;
    };
    var replace = function (array, index, value) {
      var copy = (array || []).slice();
      copy[index] = value;
      return copy;
    };

    var FieldArrayInner =
    /*#__PURE__*/
    function (_super) {
      __extends(FieldArrayInner, _super);

      function FieldArrayInner(props) {
        var _this = _super.call(this, props) || this;

        _this.updateArrayField = function (fn, alterTouched, alterErrors) {
          var _a = _this.props,
              name = _a.name,
              validateOnChange = _a.validateOnChange,
              _b = _a.formik,
              setFormikState = _b.setFormikState,
              validateForm = _b.validateForm;
          setFormikState(function (prevState) {
            return __assign({}, prevState, {
              values: setIn(prevState.values, name, fn(getIn(prevState.values, name))),
              errors: alterErrors ? setIn(prevState.errors, name, fn(getIn(prevState.errors, name))) : prevState.errors,
              touched: alterTouched ? setIn(prevState.touched, name, fn(getIn(prevState.touched, name))) : prevState.touched
            });
          }, function () {
            if (validateOnChange) {
              validateForm();
            }
          });
        };

        _this.push = function (value) {
          return _this.updateArrayField(function (array) {
            return (array || []).concat([cloneDeep(value)]);
          }, false, false);
        };

        _this.handlePush = function (value) {
          return function () {
            return _this.push(value);
          };
        };

        _this.swap = function (indexA, indexB) {
          return _this.updateArrayField(function (array) {
            return swap(array, indexA, indexB);
          }, true, true);
        };

        _this.handleSwap = function (indexA, indexB) {
          return function () {
            return _this.swap(indexA, indexB);
          };
        };

        _this.move = function (from, to) {
          return _this.updateArrayField(function (array) {
            return move(array, from, to);
          }, true, true);
        };

        _this.handleMove = function (from, to) {
          return function () {
            return _this.move(from, to);
          };
        };

        _this.insert = function (index, value) {
          return _this.updateArrayField(function (array) {
            return insert(array, index, value);
          }, true, true);
        };

        _this.handleInsert = function (index, value) {
          return function () {
            return _this.insert(index, value);
          };
        };

        _this.replace = function (index, value) {
          return _this.updateArrayField(function (array) {
            return replace(array, index, value);
          }, false, false);
        };

        _this.handleReplace = function (index, value) {
          return function () {
            return _this.replace(index, value);
          };
        };

        _this.unshift = function (value) {
          var length = -1;

          _this.updateArrayField(function (array) {
            var arr = array ? [value].concat(array) : [value];

            if (length < 0) {
              length = arr.length;
            }

            return arr;
          }, true, true);

          return length;
        };

        _this.handleUnshift = function (value) {
          return function () {
            return _this.unshift(value);
          };
        };

        _this.handleRemove = function (index) {
          return function () {
            return _this.remove(index);
          };
        };

        _this.handlePop = function () {
          return function () {
            return _this.pop();
          };
        };

        _this.remove = _this.remove.bind(_this);
        _this.pop = _this.pop.bind(_this);
        return _this;
      }

      FieldArrayInner.prototype.remove = function (index) {
        var result;
        this.updateArrayField(function (array) {
          var copy = array ? array.slice() : [];

          if (!result) {
            result = copy[index];
          }

          if (isFunction$1(copy.splice)) {
            copy.splice(index, 1);
          }

          return copy;
        }, true, true);
        return result;
      };

      FieldArrayInner.prototype.pop = function () {
        var result;
        this.updateArrayField(function (array) {
          var tmp = array;

          if (!result) {
            result = tmp && tmp.pop && tmp.pop();
          }

          return tmp;
        }, true, true);
        return result;
      };

      FieldArrayInner.prototype.render = function () {
        var arrayHelpers = {
          push: this.push,
          pop: this.pop,
          swap: this.swap,
          move: this.move,
          insert: this.insert,
          replace: this.replace,
          unshift: this.unshift,
          remove: this.remove,
          handlePush: this.handlePush,
          handlePop: this.handlePop,
          handleSwap: this.handleSwap,
          handleMove: this.handleMove,
          handleInsert: this.handleInsert,
          handleReplace: this.handleReplace,
          handleUnshift: this.handleUnshift,
          handleRemove: this.handleRemove
        };

        var _a = this.props,
            component = _a.component,
            render = _a.render,
            children = _a.children,
            name = _a.name,
            _b = _a.formik,
            _validate = _b.validate,
            _validationSchema = _b.validationSchema,
            restOfFormik = __rest(_b, ["validate", "validationSchema"]);

        var props = __assign({}, arrayHelpers, {
          form: restOfFormik,
          name: name
        });

        return component ? React.createElement(component, props) : render ? render(props) : children ? typeof children === 'function' ? children(props) : !isEmptyChildren(children) ? React.Children.only(children) : null : null;
      };

      FieldArrayInner.defaultProps = {
        validateOnChange: true
      };
      return FieldArrayInner;
    }(React.Component);

    var FieldArray =
    /*#__PURE__*/
    connect(FieldArrayInner);

    var FastFieldInner =
    /*#__PURE__*/
    function (_super) {
      __extends(FastFieldInner, _super);

      function FastFieldInner(props) {
        var _this = _super.call(this, props) || this;

        var render = props.render,
            children = props.children,
            component = props.component;
        warning$2(!(component && render), 'You should not use <FastField component> and <FastField render> in the same <FastField> component; <FastField component> will be ignored');
        warning$2(!(component && children && isFunction$1(children)), 'You should not use <FastField component> and <FastField children> as a function in the same <FastField> component; <FastField component> will be ignored.');
        warning$2(!(render && children && !isEmptyChildren(children)), 'You should not use <FastField render> and <FastField children> in the same <FastField> component; <FastField children> will be ignored');
        return _this;
      }

      FastFieldInner.prototype.shouldComponentUpdate = function (props) {
        if (this.props.shouldUpdate) {
          return this.props.shouldUpdate(props, this.props);
        } else if (getIn(this.props.formik.values, this.props.name) !== getIn(props.formik.values, this.props.name) || getIn(this.props.formik.errors, this.props.name) !== getIn(props.formik.errors, this.props.name) || getIn(this.props.formik.touched, this.props.name) !== getIn(props.formik.touched, this.props.name) || Object.keys(this.props).length !== Object.keys(props).length || this.props.formik.isSubmitting !== props.formik.isSubmitting) {
          return true;
        } else {
          return false;
        }
      };

      FastFieldInner.prototype.componentDidMount = function () {
        this.props.formik.registerField(this.props.name, this);
      };

      FastFieldInner.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.name !== prevProps.name) {
          this.props.formik.unregisterField(prevProps.name);
          this.props.formik.registerField(this.props.name, this);
        }

        if (this.props.validate !== prevProps.validate) {
          this.props.formik.registerField(this.props.name, this);
        }
      };

      FastFieldInner.prototype.componentWillUnmount = function () {
        this.props.formik.unregisterField(this.props.name);
      };

      FastFieldInner.prototype.render = function () {
        var _a = this.props,
            validate = _a.validate,
            name = _a.name,
            render = _a.render,
            children = _a.children,
            _b = _a.component,
            component = _b === void 0 ? 'input' : _b,
            formik = _a.formik,
            props = __rest(_a, ["validate", "name", "render", "children", "component", "formik"]);

        var _validate = formik.validate,
            _validationSchema = formik.validationSchema,
            restOfFormik = __rest(formik, ["validate", "validationSchema"]);

        var field = {
          value: props.type === 'radio' || props.type === 'checkbox' ? props.value : getIn(formik.values, name),
          name: name,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur
        };
        var bag = {
          field: field,
          form: restOfFormik
        };

        if (render) {
          return render(bag);
        }

        if (isFunction$1(children)) {
          return children(bag);
        }

        if (typeof component === 'string') {
          var innerRef = props.innerRef,
              rest = __rest(props, ["innerRef"]);

          return React.createElement(component, __assign({
            ref: innerRef
          }, field, rest, {
            children: children
          }));
        }

        return React.createElement(component, __assign({}, bag, props, {
          children: children
        }));
      };

      return FastFieldInner;
    }(React.Component);

    var FastField =
    /*#__PURE__*/
    connect(FastFieldInner);

    var ErrorMessageImpl =
    /*#__PURE__*/
    function (_super) {
      __extends(ErrorMessageImpl, _super);

      function ErrorMessageImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      ErrorMessageImpl.prototype.shouldComponentUpdate = function (props) {
        if (getIn(this.props.formik.errors, this.props.name) !== getIn(props.formik.errors, this.props.name) || getIn(this.props.formik.touched, this.props.name) !== getIn(props.formik.touched, this.props.name) || Object.keys(this.props).length !== Object.keys(props).length) {
          return true;
        } else {
          return false;
        }
      };

      ErrorMessageImpl.prototype.render = function () {
        var _a = this.props,
            component = _a.component,
            formik = _a.formik,
            render = _a.render,
            children = _a.children,
            name = _a.name,
            rest = __rest(_a, ["component", "formik", "render", "children", "name"]);

        var touch = getIn(formik.touched, name);
        var error = getIn(formik.errors, name);
        return !!touch && !!error ? render ? isFunction$1(render) ? render(error) : null : children ? isFunction$1(children) ? children(error) : null : component ? React.createElement(component, rest, error) : error : null;
      };

      return ErrorMessageImpl;
    }(React.Component);

    var ErrorMessage =
    /*#__PURE__*/
    connect(ErrorMessageImpl);

    exports.Formik = Formik;
    exports.yupToFormErrors = yupToFormErrors;
    exports.validateYupSchema = validateYupSchema;
    exports.Field = Field;
    exports.Form = Form;
    exports.withFormik = withFormik;
    exports.move = move;
    exports.swap = swap;
    exports.insert = insert;
    exports.replace = replace;
    exports.FieldArray = FieldArray;
    exports.getIn = getIn;
    exports.setIn = setIn;
    exports.setNestedObjectValues = setNestedObjectValues;
    exports.isFunction = isFunction$1;
    exports.isObject = isObject$1;
    exports.isInteger = isInteger;
    exports.isString = isString;
    exports.isNaN = isNaN;
    exports.isEmptyChildren = isEmptyChildren;
    exports.isPromise = isPromise;
    exports.getActiveElement = getActiveElement;
    exports.makeCancelable = makeCancelable;
    exports.FastField = FastField;
    exports.FormikProvider = FormikProvider;
    exports.FormikConsumer = FormikConsumer;
    exports.connect = connect;
    exports.ErrorMessage = ErrorMessage;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=formik.umd.development.js.map
