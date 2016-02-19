class ObjectExtensions {

    /**
     * Verifies wether the object is null.
     * Remarks: if the object is undefined, this returns false.
     *
     * @param {any} object The object.
     * @return {boolean} True if the object is null, false otherwise.
     */
    public static isNull(object: any): boolean {
        return (object === null);
    }

    /**
     * Verifies whether the object is undefined.
     * Remarks: if the object is null, this returns false.
     *
     * @param {any} object The object.
     * @return {boolean} True if the object is undefined, false otherwise.
     */
    public static isUndefined(object: any): boolean {
        return (typeof object === 'undefined');
    }

    /**
     * Verifies whether the object is of the given type.
     * Remarks: if the object is undefined, this returns false.
     *
     * @param {any} object The object.
     * @param {any} type The type to check against.
     * @return {boolean} True if the object is of the given type, false otherwise.
     */
    public static isOfType(object: any, type: any): boolean {
        return !ObjectExtensions.isUndefined(object) && object instanceof type;
    }

    /**
     * Verifies whether the object is null or undefined.
     *
     * @param {any} object The object.
     * @return {boolean} True if the object is null or undefined, false otherwise.
     */
    public static isNullOrUndefined(object: any): boolean {
        return ObjectExtensions.isNull(object)
            || ObjectExtensions.isUndefined(object);
    }

    /**
     * Verifies wether the object is a function.
     *
     * @param {any} object The object.
     * @return {boolean} True if the object is a function, false otherwise.
     */
    public static isFunction(object: any): boolean {
        return typeof object === "function";
    }

    /**
     * Verifies wether the variable is of type object.
     *
     * @param {any} variable The variable.
     * @return {boolean} True if the variable is an object, false otherwise.
     */
    public static isObject(variable: any): boolean {
        return typeof variable === "object";
    }

    /**
     * Do not use this function directly. Call update method on your proxy object.
     */
    private static updateObservableProxyObject(newValue) {
        if (ObjectExtensions.isNullOrUndefined(newValue)) {
            return;
        }

        // get all properties from the object
        var keys = Object.keys(this);

        // for each property
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var keyValue = this[key];

            if (keyValue == null) {
                continue;
            } else if ('subscribe' in keyValue) {
                // if property is a observable
                // update observable with new value
                keyValue(newValue[key]);
            } else if (typeof keyValue == 'object' && newValue[key] != null) {
                // if it's another complex object, update it as a if it were a new proxy
                keyValue.update(newValue[key]);
            }
        }
    }

    /**
     * Unwraps an proxy observable unwrapping all inner observables.
     */
    public static unwrapObservableProxyObject(proxy): any {
        if (!proxy.__isObservableProxy) {
            return proxy;
        }

        var unwrappedObject = <any>{};

        // get all properties from the object
        var keys = Object.keys(proxy);

        // for each property
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var keyValue = proxy[key];

            if (keyValue == null) {
                continue;
            } else if ('subscribe' in keyValue) {
                // if property is a observable
                // unwrap it
                unwrappedObject[key] = keyValue();

                // if property is array, it may contain observable proxies as well, so  
                // unwrap all elements of it
                if ($.isArray(unwrappedObject[key])) {
                    var array: any[] = unwrappedObject[key];
                    for (var j = 0; j < array.length; j++) {
                        array[j] = ObjectExtensions.unwrapObservableProxyObject(array[j]);
                    }
                }
            } else if (typeof keyValue == 'object' && keyValue.__isObservableProxy) {
                // if it's a proxy inside a proxy, unwrap as well
                unwrappedObject[key] = ObjectExtensions.unwrapObservableProxyObject(keyValue);
            } else {
                // just a property, let's copy it
                unwrappedObject[key] = keyValue;
            }
        }

        delete unwrappedObject.__isObservableProxy;
        delete unwrappedObject.update;

        return unwrappedObject;
    }

    // Makes a copy of an object
    // Alternative for jquery (does not handle arrays correctly and it will break calls with Odata):
    // jquery example call that this method replaces: <any >$.extend(true, { }, <your object to clone >);
    //
    // @param {any} origObject The original object to clone
    // @return {any} The cloned object
    public static clone(origObject: any): any {
        return ObjectExtensions.safeClone(origObject, []);
    }

    // Makes a copy of an object
    // Alternative for jquery (does not handle arrays correctly and it will break calls with Odata):
    //
    // @param {any} origObject The original object to clone
    // @param {any} cloneMap A map of the objects that are being cloned to identify circular references
    // @return {any} The cloned object
    private static safeClone(origObject: any, cloneMap: any[]): any {
        if (ObjectExtensions.isNullOrUndefined(origObject)) {
            return origObject;
        }

        var newObj: any;
        if (origObject instanceof Array) {
            // Use the array reference in the object map if it exists
            if (!cloneMap.some((val: any): boolean => {
                if (val.id === origObject) {
                    newObj = val.value;
                    return true;
                }

                return false;
            })) {
                // Add the cloned array reference to the object map and clone the array
                newObj = [];
                cloneMap.push({ id: origObject, value: newObj });
                for (var i = 0; i < origObject.length; i++) {
                    if (typeof origObject[i] == "object") {
                        newObj.push(ObjectExtensions.safeClone(origObject[i], cloneMap));
                    } else {
                        newObj.push(origObject[i]);
                    }
                }
            }
        } else if (origObject instanceof Date) {
            newObj = new Date((<Date> origObject).valueOf());
        } else if (origObject instanceof Object) {
            // Use the object reference in the object map if it exists
            if (!cloneMap.some((val: any): boolean => {
                if (val.id === origObject) {
                    newObj = val.value;
                    return true;
                }

                return false;
            })) {
                // Add the cloned object reference to the object map and clone the object
                newObj = <any >$.extend(false, {}, origObject);
                cloneMap.push({ id: origObject, value: newObj });
                for (var property in newObj) {
                    if (newObj.hasOwnProperty(property)) {
                        if (typeof newObj[property] == "object") {
                            if (property === "__metadata") {
                                newObj[property] = <any >$.extend(false, {}, origObject[property]);
                            } else {
                                newObj[property] = ObjectExtensions.safeClone(origObject[property], cloneMap);
                            }
                        }
                    }
                }
            }
        } else {
            newObj = origObject;
        }

        return newObj;
    }

    /**
     * Help execute async calls in a sequence.
     *
     * @param {any[]} array The elements array.
     * @param {(entity, () => void) => void)} iterator Async iterator callback.
     * @param {any} [then] Success callback.
     */
    public static forEachAsync(array: any[], iterator: any, then?: any) {

        function next(i: any) {

            if (i < array.length) {
                iterator(array[i], () => { next(i + 1); }, i);
            } else {
                if (then)
                    then();
            }
        };

        next(0);
    }
} 