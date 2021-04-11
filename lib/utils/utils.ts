import * as cdk from '@aws-cdk/core'

/**
 * Converts kebab case to camel case
 * 
 * @param  {string} s string to convert to camel case
 * @returns {string} the camelized string
 */
export const camelize = (str: string): string => {
  if(!str) return 'SomeResource'
  
  str =  str.replace(/-./g, (x: string) => x[1].toUpperCase())

  return str[0].toUpperCase() + str.slice(1)
}

/**
 *  Adds tags to an aws resource
 * 
 * @param  {cdk.IConstruct} resource the resource to be tagged
 * @param  {Record<string,string>} tagsObj the tags in the form { key1: 'value', key2: 'value'}
 */
export const addTags = function(resource: cdk.IConstruct, tagsObj: Record<string, string>): void {
  for(const [key, value] of Object.entries(tagsObj))
    cdk.Tags.of(resource).add(key, value)
}