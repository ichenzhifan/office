class StringExtensions {

    public static EMPTY = '';

    /**
     * Verifies wether the string is empty, but not null.
     *
     * @param {string} object The object.
     * @return {boolean} True if the object is empty, false othwerwise.
     */
    public static isEmpty(object: string): boolean {
        return object != null && object.length == 0;
    }

    /**
     * Verifies wether the string is empty or whitespace, but not null.
     *
     * @param {string} object The object.
     * @return {boolean} True if the object is empty or whitespace, false othwerwise.
     */
    public static isEmptyOrWhitespace(object: string): boolean {
        return object != null
            && typeof object.trim == 'function'
            && (object.trim() || '').length == 0;
    }

    /**
     * Verifies wether the string is null or whitespace.
     *
     * @param {string} object The object.
     * @return {boolean} True if the object is null or whitespace, false othwerwise.
     */
    public static isNullOrWhitespace(object: string): boolean {
        return ObjectExtensions.isNullOrUndefined(object) || object.trim().length == 0;
    }

    /**
     * Pad left with padString until the required length is reached.
     */
    public static padLeft(object: string, padString: string, length: number): string {
        if (ObjectExtensions.isNullOrUndefined(padString) || ObjectExtensions.isNullOrUndefined(object)) {
            return object;
        }

        while (object.length < length) {
            object = padString + object;
        }
        return object;
    }

    /**
     * Pad right with padString until the required length is reached.
     */
    public static padRight(object: string, padString: string, length: number): string {
        if (ObjectExtensions.isNullOrUndefined(padString) || ObjectExtensions.isNullOrUndefined(object)) {
            return object;
        }

        while (object.length < length) {
            object += padString;
        }
        return object;
    }

    /**
     * Basic C# like string format function.
     */
    public static format(object: string, ...params: any[]): string {
        if (StringExtensions.isNullOrWhitespace(object)) {
            return object;
        }

        if (params == null) {
            throw "Invalid parameter";
        }

        for (var index = 0; index < params.length; index++) {
            if (params[index] == null) {
                throw "Invalid parameter";
            }

            var regexp = new RegExp('\\{' + index + '\\}', 'gi');
            object = object.replace(regexp, params[index]);
        }

        return object;
    }

    /**
     * Returns an ordinal to indicate the ordering of the strings
     * -1: This object is less than comparison object
     * 0: This object is equal to the comparison object
     * 1: This object is greater than the comparison object
     */
    public static compare(object: string, comparisonObject: string, ignoreCase?: boolean): number {
        if (ObjectExtensions.isNullOrUndefined(object) && ObjectExtensions.isNullOrUndefined(comparisonObject)) {
            return 0;
        } else if (ObjectExtensions.isNullOrUndefined(object)) {
            return -1;
        } else if (ObjectExtensions.isNullOrUndefined(comparisonObject)) {
            return 1;
        }

        var val1: string = ignoreCase ? object.toLowerCase() : object;
        var val2: string = ignoreCase ? comparisonObject.toLowerCase() : comparisonObject;

        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
    }

    /**
     * Replaces new line character with <br /> for display.
     */
    public static replaceNewLineWithBr(text: string) {
        if (text) {
            return text.replace("\n", "<br />");
        }

        return text;
    }

    /**
     * Escapes single quote to be send as part of urls.
     */
    public static escapeSingleQuote(text: string) {
        return text.replace(/(')/g, "\'$1");
    }

    /**
     * Removes the trailing slashes from the URI.
     *
     * @param {string} uri The URI to clean.
     * @return {string} The uri without trailing slashes.
     */
    public static CleanUri(uri: string): string {
        if (StringExtensions.isNullOrWhitespace(uri)) {
            return StringExtensions.EMPTY;
        }

        // the cutoff index for the string
        var cutoffIndex = uri.length - 1;

        while (cutoffIndex >= 0
            && (uri[cutoffIndex] == '/'
            || uri[cutoffIndex] == '\\')) {

            --cutoffIndex;
        }

        // if it ever becomes negative, cutoffIndex + 1 = 0
        return uri.substr(0, cutoffIndex + 1);
    }

    /**
    * Determines whether the end of string matches a specified string.
    *
    * @param {string} str: The string to search in.
    * @param {string} suffix: The string to compare to the substring at the end of str.
    * @param {boolean} caseSensitive: Determines if the comparision case sensitive (false, by default)
    * @return {boolean} true if suffix matches the end of str; otherwise, false.
    */
    public static endsWith(str: string, suffix: string, caseSensitive: boolean= false): boolean {
        if (ObjectExtensions.isNullOrUndefined(str) || ObjectExtensions.isNullOrUndefined(suffix)) {
            return false;
        }
        if (suffix.length > str.length) {
            return false;
        }

        var originalString: string = (caseSensitive) ? str : str.toLowerCase();
        var subString: string = (caseSensitive) ? suffix : suffix.toLowerCase();
        return originalString.indexOf(subString, originalString.length - subString.length) !== -1;
    }
} 