/*
  9 - Deep Readonly
  -------
  by Anthony Fu (@antfu) #medium #readonly #object-keys #deep
  
  ### Question
  
  Implement a generic `DeepReadonly<T>` which make every parameter of an object - and its sub-objects recursively - readonly.
  
  You can assume that we are only dealing with Objects in this challenge. Arrays, Functions, Classes and so on are no need to take into consideration. However, you can still challenge your self by covering different cases as many as possible.
  
  For example
  
  ```ts
  type X = { 
    x: { 
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }
  
  type Expected = { 
    readonly x: { 
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey' 
  }
  
  type Todo = DeepReadonly<X> // should be same as `Expected`
  ```
  
  > View on GitHub: https://tsch.js.org/9
*/


/* _____________ Your Code Here _____________ */

type DeepReadonly<T> = any


/* _____________ Test Cases _____________ */
import { Equal, Expect } from './type-challenges-utils'

type cases = [
  Expect<Equal<DeepReadonly<X>, Expected>>,
]

type X = {
  a: () => 22
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: 'string'
        }
        k: 'hello'
      }
    }
  }
}

type Expected = {
  readonly a: () => 22
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: 'string'
        }
        readonly k: 'hello'
      }
    }
  }
}



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9/answer
  > View solutions: https://tsch.js.org/9/solutions
  > More Challenges: https://tsch.js.org
*/

