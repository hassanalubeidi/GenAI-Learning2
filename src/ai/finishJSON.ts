// Description: This file contains the code for completing an incomplete JSON string

// Function to generate patterns for JSON completion
const generatePatterns = (depth, memo = {}) => {
    // Base case: If depth is 0 or less, return an array with an empty string
    if (depth <= 0) return [''];

    // Check if this depth has been computed before, return the result if so
    if (memo[depth]) return memo[depth];

    // Define the base patterns to be used for JSON completion
    const basePatterns = ['}', ']', '"', '', ' '];

    // Recursive call to get patterns for one depth less
    const previousPatterns = generatePatterns(depth - 1, memo);
    let patterns = [];

    // Concatenate each base pattern with each of the previous patterns
    for (let base of basePatterns) {
        for (let prev of previousPatterns) {
            patterns.push(prev + base);
        }
    }

    // Store the computed patterns in the memo object for future reference
    memo[depth] = patterns;
    return patterns;
};


// Function to complete and parse the incomplete JSON string
export const completeAndParseJSON = (incompleteJSON) => {
    const memo = {}; // Memoization object for generatePatterns
    

    // Trim the input JSON string to remove any leading/trailing whitespaces
    const trimmedJSON = incompleteJSON.trim();

    // Find the position of the last comma in the trimmed string
    const lastIndex = trimmedJSON.lastIndexOf(',');

    // Remove the part of the string after the last comma to keep valid JSON structure
    const validPartJSON = lastIndex !== -1 ? trimmedJSON.slice(0, lastIndex) : trimmedJSON;

    // Optimization: Start with a depth of 1 and increase it until a valid JSON is found
    // This is done to avoid unnecessary computation
    // Future work: Analyze the input JSON to determine the depth
    for (let depth of [1, 2, 3, 4, 5]) {
        // Generate patterns for the current depth
        const patterns = generatePatterns(depth, memo);
        for (let pattern of patterns) {
            try {
                // Try to parse the JSON string concatenated with the current pattern
                const potentialJSON = JSON.parse(validPartJSON + pattern);
    
                // If parsing is successful, return the parsed JSON object
                return potentialJSON;
            } catch (error) {
                // If parsing fails, continue to the next pattern
            }
        }
    }
    

    // If no pattern results in a valid JSON, return null or throw an error
    return null; // or throw new Error("Unable to complete JSON");
};