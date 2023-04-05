/**
 * Replaces ` (Whitespaces)`  with `_ (Underscore)` 
 * Fixes Double Quotes around Properties
 * Fixes Double Quotes around Non-Numeric Values
 * Fixes Double Quotes around values in Square Brackets
 * @param {String} str 
 * @returns The string fixed to a JSON format or `null` if impossible to fix
 */
export function validateJSON(str) {
    let fixedStr = str.replace(/\s+/g, '_');
    try {
        JSON.parse(fixedStr);
        return fixedStr;
    } catch (e) {
        if (e instanceof SyntaxError) {
            // Fix missing opening or closing braces

            if (!fixedStr.startsWith('{')) {
                fixedStr = `{${fixedStr}`;
            }
            // Fix strings inside square brackets
            findSquareBracketedSubstrings(fixedStr).forEach(str => {
                fixedStr = fixedStr.replace(str, quoteItems(str))
            })
            // Fix missing quotes around property names
            fixedStr = fixedStr.replace(/([{,]*)(")?([a-zA-Z0-9_]+)(")?\s*:/g, '$1"$3":');
            // Fix missing quotes around property values
            fixedStr = fixMissingQuotesOnValues(fixedStr)

            if (!fixedStr.endsWith('}')) {
                fixedStr = `${fixedStr}}`;
            }
            console.log(fixedStr);
            try {
                JSON.parse(fixedStr);
                return fixedStr
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    function quoteItems(str) {
        const pattern = /(?<=\[|\,|^)\s*([^\[\]\,]+)\s*(?=\]|$|\,)/g;
        return str.replace(pattern, '"$1"');
    }
    function findSquareBracketedSubstrings(str) {
        const pattern = /\[([^\[\]]*)\]/g;
        const matches = str.matchAll(pattern);
        const results = new Set();
        for (const match of matches) {
            results.add(match[1]);
        }
        return results;
    }
    function fixMissingQuotesOnValues(str) {
        const regex = /:\s*([^{\[\]":\s,]+)(,|\})/g;
        return str.replace(regex, ':"$1"$2');
    }
}

