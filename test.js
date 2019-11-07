const fetch = require('node-fetch');
const proxyurl = "https://cors-anywhere.herokuapp.com/";
var subj = "COMP";

// fetch(proxyurl + "https://courses.rice.edu/admweb/!SWKSECX.main?term=202020&subj=" + subj, {"credentials":"omit","headers":{"accept":"application/xml, text/xml, */*; q=0.01","accept-language":"en-US,en;q=0.9","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"}})
//     .then((resp) => resp.text())
//     .then(x => console.log(x));
    
fetch("https://courses.rice.edu/admweb/!SWKSECX.main?term=202020&subj=" + subj,)
.then((resp) => resp.text())
.then(x => console.log(x));