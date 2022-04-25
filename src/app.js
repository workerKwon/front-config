/**
 * css 파일을 js파일처럼 가져와서 사용하려면 css-loader와 style-loader를 이용해야한다.
 */
import './app.css'
import math from './math'

console.log(math.sum(1, 2))

console.log(process.env.NODE_ENV)
console.log(TWO)
console.log(api.domain)
