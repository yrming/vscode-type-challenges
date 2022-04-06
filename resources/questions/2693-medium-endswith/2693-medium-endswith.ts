/*
  2693 - EndsWith
  -------
  by jiangshan (@jiangshanmeta) #medium #template-literal
  
  ### Question
  
  Implement `EndsWith<T, U>` which takes two exact string types and returns whether `T` ends with `U`
  
  > View on GitHub: https://tsch.js.org/2693
*/


/* _____________ Your Code Here _____________ */

type EndsWith<T extends string, U extends string> = any


/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from './type-challenges-utils'

type cases = [
  Expect<Equal<EndsWith<'abc', 'bc'>, true>>,
  Expect<Equal<EndsWith<'abc', 'abc'>, true>>,
  Expect<Equal<EndsWith<'abc', 'd'>, false>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2693/answer
  > View solutions: https://tsch.js.org/2693/solutions
  > More Challenges: https://tsch.js.org
*/

