/**
 * Returns true if api key is valid
 * 
 * @param  {string} key the key to check
 * @returns true if valid. false otherwise
 */
export const apiKeyCompare = (key: string): boolean => {
  // usually check against a database here
  // for simplicity, api key is defined as an env for the lambda
  
  return key === process.env.API_KEY
}