/*
  1978 - Percentage Parser
  -------
  by SSShuai1999 (@SSShuai1999) #medium 
  
  ### Question
  
  Implement PercentageParser<T extends string>.
  According to the `/^(\+|\-)?(\d*)?(\%)?$/` regularity to match T and get three matches.
  
  The structure should be: [`plus or minus`, `number`, `unit`]
  If it is not captured, the default is an empty string.
  
  For example:
  ```ts
  type PString1 = ''
  type PString2 = '+85%'
  type PString3 = '-85%'
  type PString4 = '85%'
  type PString5 = '85'
  
  type R1 = PercentageParser<PString1>  // expected ['', '', '']
  type R2 = PercentageParser<PString2>  // expected ["+", "85", "%"]
  type R3 = PercentageParser<PString3>  // expected ["-", "85", "%"]
  type R4 = PercentageParser<PString4>  // expected ["", "85", "%"]
  type R5 = PercentageParser<PString5>  // expected ["", "85", ""]
  ```
  
  > View on GitHub: https://tsch.js.org/1978
*/


/* _____________ Your Code Here _____________ */

type PercentageParser<A extends string> = any


/* _____________ Test Cases _____________ */
import { Equal, Expect } from './type-challenges-utils'

type Case1 = ['', '', '']
type Case2 = ['+', '', '']
type Case3 = ['+', '1', '']
type Case4 = ['+', '100', '%']
type Case5 = ['', '10', '%']
type Case6 = ['-', '99', '%']

type cases = [
    Expect<Equal<PercentageParser<''>, Case1>>,
    Expect<Equal<PercentageParser<'+'>, Case2>>,
    Expect<Equal<PercentageParser<'+1'>, Case3>>,
    Expect<Equal<PercentageParser<'+100%'>, Case4>>,
    Expect<Equal<PercentageParser<'10%'>, Case5>>,
    Expect<Equal<PercentageParser<'-99%'>, Case6>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/1978/answer
  > View solutions: https://tsch.js.org/1978/solutions
  > More Challenges: https://tsch.js.org
*/

