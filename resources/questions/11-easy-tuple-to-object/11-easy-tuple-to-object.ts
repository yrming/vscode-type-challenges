/*
  11 - Tuple to Object
  -------
  by sinoon (@sinoon) #easy 
  
  ### Question
  
  Give an array, transform into an object type and the key/value must in the given array.
  
  For example
  
  ```ts
  const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
  
  type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
  ```
  
  > View on GitHub: https://tsch.js.org/11
*/


/* _____________ Your Code Here _____________ */

type TupleToObject<T extends readonly any[]> = any


/* _____________ Test Cases _____________ */
import { Equal, Expect } from './type-challenges-utils'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type cases = [
  Expect<Equal<TupleToObject<typeof tuple>, { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y'}>>,
]

// @ts-expect-error
type error = TupleToObject<[[1, 2], {}]>



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/11/answer
  > View solutions: https://tsch.js.org/11/solutions
  > More Challenges: https://tsch.js.org
*/

