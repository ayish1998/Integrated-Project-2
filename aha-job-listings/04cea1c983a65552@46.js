// https://observablehq.com/@bmschmidt/state-info@46
function _1(md){return(
md`# US state lookup Rosetta stone.

\`\`\`javascript
import { state_info } from "@bmschmidt/state-info"
\`\`\`

Every week or so I google "State FIPS codes" and get frustrated that the top hit doesn't include DC, and then have reshape a dictionary to look up by FIPS codes, or by abbreviation or by name. 

Also, [Puerto Rico is part of the United States](https://observablehq.com/@bmschmidt/little-known-fact).

So this is a utility notebook that exists just to create a simple map that can look up basic information about Alabama (say) by any of the following keys:

* 1
* "1"
* "01"
* "AL"
* "al"
* "Alabama"
* "ALABAMA"

and return
\`\`\`
  {"name":"Alabama","abbrev":"AL","fips":"01"}
\`\`\`

At some point perhaps I'll put some basic info about the states in there, too (populations, plot order, etc.), so if you import this, don't expect that only the three fields here will exist.

Would also be good to have the old postal abbreviations ("Penna," etc.)

`
)}

function _state_info(states)
{
  
  const m = new Map()
  for (let k of ["name", "abbrev", "fips"]) {
    for (let row of states) {
      m.set(row[k], row) 
      m.set(row[k].toUpperCase(), row)
      m.set(row[k].toLowerCase(), row)
      if (k === "fips") {
        m.set(+row[k], row)
        // "01" => "1". Weird way to do it, I know.
        m.set("" + parseInt(row[k]), row)
      }
    }
  }
  return m

}


function _states(){return(
[
  {"name":"Alabama","abbrev":"AL","fips":"01"},
  {"name":"Alaska","abbrev":"AK","fips":"02"},
  {"name":"Arizona","abbrev":"AZ","fips":"04"},
  {"name":"Arkansas","abbrev":"AR","fips":"05"},
  {"name":"California","abbrev":"CA","fips":"06"},
  {"name":"Colorado","abbrev":"CO","fips":"08"},
  {"name":"Connecticut","abbrev":"CT","fips":"09"},
  {"name":"Delaware","abbrev":"DE","fips":"10"},
  {"name":"District of Columbia","abbrev":"DC","fips":"11"},
  {"name":"Florida","abbrev":"FL","fips":"12"},
  {"name":"Georgia","abbrev":"GA","fips":"13"},
  {"name":"Hawaii","abbrev":"HI","fips":"15"},
  {"name":"Idaho","abbrev":"ID","fips":"16"},
  {"name":"Illinois","abbrev":"IL","fips":"17"},
  {"name":"Indiana","abbrev":"IN","fips":"18"},
  {"name":"Iowa","abbrev":"IA","fips":"19"},
  {"name":"Kansas","abbrev":"KS","fips":"20"},
  {"name":"Kentucky","abbrev":"KY","fips":"21"},
  {"name":"Louisiana","abbrev":"LA","fips":"22"},
  {"name":"Maine","abbrev":"ME","fips":"23"},
  {"name":"Maryland","abbrev":"MD","fips":"24"},
  {"name":"Massachusetts","abbrev":"MA","fips":"25"},
  {"name":"Michigan","abbrev":"MI","fips":"26"},
  {"name":"Minnesota","abbrev":"MN","fips":"27"},
  {"name":"Mississippi","abbrev":"MS","fips":"28"},
  {"name":"Missouri","abbrev":"MO","fips":"29"},
  {"name":"Montana","abbrev":"MT","fips":"30"},
  {"name":"Nebraska","abbrev":"NE","fips":"31"},
  {"name":"Nevada","abbrev":"NV","fips":"32"},
  {"name":"New Hampshire","abbrev":"NH","fips":"33"},
  {"name":"New Jersey","abbrev":"NJ","fips":"34"},
  {"name":"New Mexico","abbrev":"NM","fips":"35"},
  {"name":"New York","abbrev":"NY","fips":"36"},
  {"name":"North Carolina","abbrev":"NC","fips":"37"},
  {"name":"North Dakota","abbrev":"ND","fips":"38"},
  {"name":"Ohio","abbrev":"OH","fips":"39"},
  {"name":"Oklahoma","abbrev":"OK","fips":"40"},
  {"name":"Oregon","abbrev":"OR","fips":"41"},
  {"name":"Pennsylvania","abbrev":"PA","fips":"42"},
  {"name": "Guam", "abbrev": "GU", "fips":	"66"},
  {"name": "Northern Mariana Islands", "abbrev": "MP", "fips":	"69"},
  {"name": "Puerto Rico", "abbrev": "PR", "fips":	"72"},
  {"name": "Virgin Islands", "abbrev": "VI", "fips":	"78"},
  {"name": "American Samoa", "abbrev": "AS", "fips":	"60"},
  {"name":"Rhode Island","abbrev":"RI","fips":"44"},
  {"name":"South Carolina","abbrev":"SC","fips":"45"},
  {"name":"South Dakota","abbrev":"SD","fips":"46"},
  {"name":"Tennessee","abbrev":"TN","fips":"47"},
  {"name":"Texas","abbrev":"TX","fips":"48"},
  {"name":"Utah","abbrev":"UT","fips":"49"},
  {"name":"Vermont","abbrev":"VT","fips":"50"},
  {"name":"Virginia","abbrev":"VA","fips":"51"},
  {"name":"Washington","abbrev":"WA","fips":"53"},
  {"name":"West Virginia","abbrev":"WV","fips":"54"},
  {"name":"Wisconsin","abbrev":"WI","fips":"55"},
  {"name":"Wyoming","abbrev":"WY","fips":"56"}
]
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("state_info")).define("state_info", ["states"], _state_info);
  main.variable(observer("states")).define("states", _states);
  return main;
}
