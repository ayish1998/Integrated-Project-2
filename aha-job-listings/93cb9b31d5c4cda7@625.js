// https://observablehq.com/@bmschmidt/aha-job-listings@625
import define1 from "./04cea1c983a65552@46.js";

function _1(md){return(
md`# History Jobs

This is a database of every job listing targeted to historians on historians.org, shared by permission of the American Historical Association. Thanks to Liz Townsend for providing the data.

When you start up, it loads an Excel spreadsheet with every listed by the AHA from 2002 through May 2020.
This may take a while, but also makes live filtering possible.

I then do a few things to classify as tenure-track or not, and so forth. All of that is Javascript running in this notebook. If you know Javascript or are overly confident, you can edit it yourself and suggest changes; if not, leave a comment here or on Twitter.
This is a workbook, not a publication, and it's messy. If you have questions about specific fields or data integrity, raise them on the [Twitter thread](https://twitter.com/benmschmidt/status/1442913179286179840) or as a comment here. I note some of the data issues at the bottom. Please note that if you are a professional historian and your response to this kind of data is "I don't want to make conclusions because of insufficient evidence about sampling bias," I will scour your published work for p-values and mock you if I don't find any not because I love p-values because you do, apparently?

A few different charts. The one below lets you type in any individual word and see what number of jobs contain it. It starts with 'Japan'--you can change it to include anything else. Try "Russia", "African American", "Hispanic|Latino|Latinx", "Civil War", "Digital Humanities|Digital History". (The bars allow you to search for any of multiple phrases--the search is treated as a [regular expression.](https://en.wikipedia.org/wiki/Regular_expression) I'd advise looking at some of the samples below to see if you're capturing what you want to.).`
)}

function _ranked(rows,ttOnly){return(
rows.filter(d => d.year >= 2004)
  .filter(d => ttOnly.length == 0 || d.tt == "Tenure-Track")
  .map(d => {
    if (!d.tt) return d
    const ranks = []
    for (let k of ["Assistant", "Associate", "Full", "Chair in"]) {
      if (d.Description.match(new RegExp(" " + k + "", 'i'))) {
        ranks.push(k)
      }
    }
    if (ranks.length == 1) {
      d.rank = ranks[0] == "Assistant" ? "Assistant" : "Associate/Full"
    }
    else if (ranks.length == 0) {
      d.rank = "Unknown"
    }
    else if (ranks.length >= 1) {
      if ("Assistant".indexOf(ranks) >= -1) {
        d.rank = "Multiple"
      } else {
        d.rank = "Associate/Full"
      }
    }
    return d
  })
)}

function _searchin(Inputs){return(
Inputs.checkbox(["Title", "Description"], {label: "Search text in", value : ["Title", "Description"]})
)}

function _us_only(Inputs){return(
Inputs.checkbox(["Show only jobs in the USA"], {value : ["Show only jobs in the USA"]})
)}

function _ttOnly(Inputs){return(
Inputs.checkbox(["Only Tenure-track Jobs"], {value : ["Only Tenure-track jobs"]})
)}

function _filter_a(Inputs){return(
Inputs.radio(["Japan", "Russia", "Germany|France|Italy", "African American|Black", "Latino|Latinx|Hispanic", "Capitalism", "Latin America|Carribean", "Early Modern", "Arab|Muslim|Islam", "American History", "(twentieth|20th) century"], {value: "Japan"})
)}

function _filter(Inputs,filter_a){return(
Inputs.text({label: "Filter by search (case insensitive, partial word matching)", value : filter_a})
)}

function _exclude(Inputs){return(
Inputs.text({label: "Exclude a phrase from results (advanced)", value : ""})
)}

function _9(embed,filtered,filter,width){return(
embed({
  // start in 2004 because there's not much text before then.
  data: { values : filtered},
  mark: "line",
  title : `Jobs listed containing phrase ${filter} in title or description`,
  width: width * .75,
  height: 300,
  encoding: {
    tooltip : {
      field : "year",
      type: "ordinal",
    },
    x : {
      field : "year",
      type: "ordinal",
    },
    y : {
      aggregate : "count"
    },
/*    row : {
      field : "tt",
      type : "nominal"
    }, */
    color : {
      field : "tt",
      type: "nominal"
    }
  }
})
)}

function _10(filtered,filter,d3,html)
{
  const sample = filtered.slice(0, 15).map(d => d.Title + d.Description).map(
    d => {
      d = d.replace("\n", " ")
      const ix = d.match(new RegExp(filter , "i")).index
      return d.slice(d3.max([0, ix - 40]), ix + 50)
    })
  return html`<h3> Sample matched text</h3><pre><code>
  ${sample.join("\n")}
  </code></pre>`
  return sample
}


function _11(rows,searchin,filter,d3,md)
{
  
  const plotting = rows.filter(d => d.year >= 2004)
    .filter(d => ("" + 
                  searchin.indexOf("Description") > -1 ? d.Description : "" +
                  searchin.indexOf("Title") > -1 ? d.Title : "" +
                  
                  "\n" ).match(new RegExp(filter, 'i'))) 
  d3.shuffle(plotting)
  let output = `<div style="font-size:smaller;">\n\n <h2> Sample jobs for search above.</h2> <ul>`
  for (let job of plotting.slice(0, 5)) {
    output += `<li> <strong>${job.Title}</strong> (${("" + (job.DateTimePosted)).slice(0, 15)}): ${job.Description}</li>` 
  }
  return md`${output}\n\n</div>`
}


function _filtered(rows,searchin,filter,exclude,d3)
{
  const r = rows.filter(d => d.year >= 2004)
    .filter(d => ("" + 
                  searchin.indexOf("Description") > -1 ? d.Description : "" +
                  searchin.indexOf("Title") > -1 ? d.Title : "" +
                  
                  "\n" )
    .match(new RegExp(filter, 'i')))
    .filter(d => exclude === '' || !("" + 
                  searchin.indexOf("Description") > -1 ? d.Description : "" +
                  searchin.indexOf("Title") > -1 ? d.Title : "" +
                  
                  "\n").match(new RegExp(exclude, 'i'))
            )
  d3.shuffle(r)
  return r
}


function _data(FileAttachment){return(
FileAttachment("2002-21ads_external.xlsx").xlsx()
)}

function _14(md){return(
md`

# The Specific collapse of the Assistant Professor Market

Let's pull out ranks from the titles of tenure-track jobs explicitly. This is interesting: It seems that jobs that mention only "Assistant" are much, much rarer than they used to be and more places are listing multiple ranks in their ads. The explicitly Associate/Full searches have never been very common, but have not fallen nearly as much as assistant jobs.
`
)}

function _15(embed,ranked,width){return(
embed({
  // start in 2004 because there's not much text before then.
  data: { values : ranked},
  mark: "line",
  title : `Assistant-only lines vanished before the pandemic. New Jobs listed in the AHA Career Center by year and rank (Tenure track only)`,
  width: width * .5,
  height: 500,
  encoding: {
    tooltip : {
      aggregate : "count"
    },
    x : {
      field : "year",
      type: "ordinal",
    },
    y : {
      aggregate : "count"
    },
/*    row : {
      field : "tt",
      type : "nominal"
    }, */
    color : {
      field : "rank",
      type: "nominal"
    }
  }
})
)}

function _16(md){return(
md`
## Seasonal issues and data integrity.

No data is perfect. The AHA shifted to an outside contractor for its jobs in 2015, which led many jobs to pile up as if they were listed in late 2014. The yearly results also clearly show too many jobs in 2015 and too few in 2014, which is surely associated with this. I attempt to cut off all jobs at a June line to count by academic year.

Here's a chart of total number of jobs by month.
`
)}

function _17(embed,rows,width){return(
embed({
  data: { values : rows.filter(d => d.year >= 2002) },
  mark: "line",
  title : "Jobs listed, seasonal.",
  width: width * .75,
  height: 300,
  encoding: {
    tooltip : {
      field : "DateTimePosted",
      type: "temporal",
      timeUnit : "yearmonth"
    },
    x : {
      field : "DateTimePosted",
      type: "temporal",
      timeUnit : "yearmonth"
    },
    y : {
      aggregate : "count"
    },
/*    row : {
      field : "tt",
      type : "nominal"
    }, */
    color : {
      field : "tt",
      type: "nominal"
    }
  }
})
)}

function _18(md){return(
md`
# Diversity encouragement statements.

Searching African American or "Women" in this database is problematic, because sometimes they're simply "urged to apply." Rather than solve that thorny technical problem, I'll just let you read a bunch of random diversity statements and think about the form.

`
)}

function _19(d3,rows,md)
{
  d3.shuffle(rows)
  const diversity_language = rows.slice(0, 1000).map(d => d.Description).map(d => d.match(/[^\.]*(to apply|diversity|encouraged)[^\.]*/)).filter(d => d).map(d => d[0])
  d3.shuffle(diversity_language)
  return md`${diversity_language.slice(0, 30).join("\n\n")}`
}


function _20(html,sentences){return(
html`${sentences[0]}`
)}

function _sentences(rows)
{
  let s = rows.map(d => d.Description.match(/[^\.\n>]*/).map(m => [m.length, m, d.JobID]))
  s = s.flat()
  s.sort((a, b) => b[0] - a[0])
  return s
}


function _22(rows){return(
rows[3]
)}

function _23(rows){return(
rows
)}

function _24(rows){return(
rows[0]
)}

function _25(rows_raw){return(
rows_raw
)}

function _rows(us_only,rows_raw,state_info){return(
us_only.length > 0 ? rows_raw.filter(d => d.CountryCode == "USA" || state_info.get(d.StateCode)) : rows_raw
)}

function _27(us_only){return(
us_only.length
)}

function _rows_raw(data,tt_type)
{
  const rows = data.sheet("tblJoblistings", {headers: true})
  for (let job of rows) {
    job['tt'] = tt_type(job)
    job['year'] = job.DateTimePosted.getFullYear()
    if (job.DateTimePosted.getMonth() <= 5) {
      job.year -= 1
    }
  }
  return rows
}


function _tt_type(){return(
function tt_type(job) {
  if (job === undefined) {return "ambiguous"}
  for (let t of ["Temporary", "Researcher", "Not Applicable", "Part-Time Faculty",
                 "Full-Time Non-Tenure-Track Faculty", "Management/Leadership", 
                 "Fellowship", "Librarian/Archivist/Curator", "Visiting Faculty", "Other",
                "Full-Time Faculty with No Tenure System","K-12 Teacher", "Internship"]) {
    if (job['Employment TypeList'] !== undefined) {
          for (let portion of job['Employment TypeList'].split(",")) {
        if (portion == t) {
          return "Non Tenure-Track"
        }
      }
    }
  }
  if (job.Title.startsWith("Tenure-Track Position")) return "Tenure-Track"
  if (job["CategoryList"] == "History Education") {
    return "Non Tenure-Track"
  }
  for (let t of ["Tenure-track", "Full-Time Tenure-Track/Tenured Faculty", "Tenured", "Tenured Faculty"]) {
    if (job['Employment TypeList'] == t) return "Tenure-Track"
  }
  for (let t of ["Full-Time Non-Tenure-Track Faculty,Full-Time Tenure-Track/Tenured Faculty"]) {
    if (job['Employment TypeList'] == t) return "ambiguous"
  }
  for (let t of ["Instructor/Lecturer"]) {
    if (job['MaxRank'] == t) return "Non Tenure-Track"
  }
  for (let title of ["Assistant Professor", "Associate Professor", "Full Professor"]) {
    if (job['MinRank'] == title) return "Tenure-Track"
    if (job.Title.startsWith(title)) return "Tenure-Track"
  }
  if (job.Title.match(/.* Chair in .*/)) return "Tenure-Track"
  return "ambiguous"
}
)}

function _d3(require){return(
require("d3", "d3-random")
)}

function _embed(require){return(
require('vega-embed')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["2002-21ads_external.xlsx", {url: new URL("./files/d9554d31f65c46a412a60c56736948d9f9fee845ffb5b6726aa7077d50b57c44d61d0650d094b3c297812f1aefe8f0b4cbaf593473a1c73b6fb0e8ad86f55b33.xlsx", import.meta.url), mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("ranked")).define("ranked", ["rows","ttOnly"], _ranked);
  main.variable(observer("viewof searchin")).define("viewof searchin", ["Inputs"], _searchin);
  main.variable(observer("searchin")).define("searchin", ["Generators", "viewof searchin"], (G, _) => G.input(_));
  main.variable(observer("viewof us_only")).define("viewof us_only", ["Inputs"], _us_only);
  main.variable(observer("us_only")).define("us_only", ["Generators", "viewof us_only"], (G, _) => G.input(_));
  main.variable(observer("viewof ttOnly")).define("viewof ttOnly", ["Inputs"], _ttOnly);
  main.variable(observer("ttOnly")).define("ttOnly", ["Generators", "viewof ttOnly"], (G, _) => G.input(_));
  main.variable(observer("viewof filter_a")).define("viewof filter_a", ["Inputs"], _filter_a);
  main.variable(observer("filter_a")).define("filter_a", ["Generators", "viewof filter_a"], (G, _) => G.input(_));
  main.variable(observer("viewof filter")).define("viewof filter", ["Inputs","filter_a"], _filter);
  main.variable(observer("filter")).define("filter", ["Generators", "viewof filter"], (G, _) => G.input(_));
  main.variable(observer("viewof exclude")).define("viewof exclude", ["Inputs"], _exclude);
  main.variable(observer("exclude")).define("exclude", ["Generators", "viewof exclude"], (G, _) => G.input(_));
  main.variable(observer()).define(["embed","filtered","filter","width"], _9);
  main.variable(observer()).define(["filtered","filter","d3","html"], _10);
  main.variable(observer()).define(["rows","searchin","filter","d3","md"], _11);
  main.variable(observer("filtered")).define("filtered", ["rows","searchin","filter","exclude","d3"], _filtered);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["embed","ranked","width"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["embed","rows","width"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["d3","rows","md"], _19);
  main.variable(observer()).define(["html","sentences"], _20);
  main.variable(observer("sentences")).define("sentences", ["rows"], _sentences);
  main.variable(observer()).define(["rows"], _22);
  main.variable(observer()).define(["rows"], _23);
  main.variable(observer()).define(["rows"], _24);
  main.variable(observer()).define(["rows_raw"], _25);
  main.variable(observer("rows")).define("rows", ["us_only","rows_raw","state_info"], _rows);
  main.variable(observer()).define(["us_only"], _27);
  main.variable(observer("rows_raw")).define("rows_raw", ["data","tt_type"], _rows_raw);
  const child1 = runtime.module(define1);
  main.import("state_info", child1);
  main.variable(observer("tt_type")).define("tt_type", _tt_type);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("embed")).define("embed", ["require"], _embed);
  return main;
}
