function on_yamasemi(u,v){function s(p,d){function f(a,b){for(var d=0;d<b.length;d++)for(var e=b[d],f=e.src.length,k=0;0===k;)for(var k=1,g=0;g<=a.length-f;g++){var l=g;"<-"===e.lr&&(l=a.length-f-g);for(var h=0,m="";h<f;)if(m=e.src[h],a[l+h].lt===m)h++;else if(a[l+h].lt+a[l+h].rt===m)h++;else break;if(h===f){k=e.fn(a,l);m="";for(h=0;h<f;h++)"dbln"in a[l+h]&&(m+=a[l+h].dbln);""!==m&&(k.dbln=m);h=[];for(g=0;g<a.length;)g===l?(h.push(k),g+=f):(h.push(a[g]),g++);a=h;k=0;break}}return a}function n(a,b){for(var d=
a[b+1].rt.split(","),e="(enum "+a[b].rt+" ",f=0;f<d.length;f++)e+=d[f]+" ";return{lt:"expr:",rt:e+")"}}q+="\nyamasemi_parser() start ----\n[in]: ";for(var e in p)q+=p[e].lt+p[e].rt+", ";var h="",m=f(p,[{lr:"->",src:["a:break"],fn:function(a,b){return{lt:"break:",rt:a[b].rt}}},{lr:"->",src:["a:continue"],fn:function(a,b){return{lt:"continue:",rt:a[b].rt}}},{lr:"->",src:["a:return"],fn:function(a,b){return{lt:"return:",rt:a[b].rt}}},{lr:"->",src:["x:@"],fn:function(a,b){return{lt:"ident:",rt:a[b].rt}}},
{lr:"->",src:["0:",".:.","0:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["a:"],fn:function(a,b){return{lt:"ident:",rt:a[b].rt}}},{lr:"->",src:["0:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["s:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["S:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["(:(","):)"],fn:function(a,b){return{lt:"func_call?:",rt:""}}},{lr:"->",src:["[:[","]:]"],fn:function(a,b){return{lt:"table_select?:",
rt:""}}},{lr:"->",src:["{:{","}:}"],fn:function(a,b){return{lt:"func_body:",rt:"{ }"}}}]),g=[];for(e=0;e<m.length;e++){var l=m[e].lt+m[e].rt,k={};if("):)"===l){for(var l=[],r=!1;k=g.pop();)if("(:("!==k.lt+k.rt)l.unshift(k);else{g.push({lt:"func_call?:",rt:("dbln"in k?k.dbln+" ":"")+s(l,d)});r=!0;break}if(!1==r)throw"SyntaxError: ')'"+(""===h?"":"\n\t"+h);}else if("]:]"===l){l=[];for(r=!1;k=g.pop();)if("[:["!==k.lt+k.rt)l.unshift(k);else{g.push({lt:"table_select?:",rt:("dbln"in k?k.dbln+" ":"")+s(l,
d)});r=!0;break}if(!1==r)throw"SyntaxError: ']'"+(""===h?"":"\n\t"+h);}else if("}:}}"===l){l=[];for(r=!1;k=g.pop();)if("{:{{"!==k.lt+k.rt)l.unshift(k);else{g.push({lt:"loop_body:",rt:"{ "+("dbln"in k?k.dbln+" ":"")+s(l,d)+" }"});r=!0;break}if(!1==r)throw"SyntaxError: '}}'"+(""===h?"":"\n\t"+h);}else if("}:}"===l){l=[];for(r=!1;k=g.pop();)if("{:{"!==k.lt+k.rt)l.unshift(k);else{g.push({lt:"func_body:",rt:"{ "+("dbln"in k?k.dbln+" ":"")+s(l,d)+" }"});r=!0;break}if(!1==r)throw"SyntaxError: '}'"+(""===
h?"":"\n\t"+h);}else if(";:;"===l){for(l=[];k=g.pop();){if("{:{"===k.lt+k.rt){g.push(k);break}if("{:{{"===k.lt+k.rt){g.push(k);break}if("(:("===k.lt+k.rt){g.push(k);break}if("[:["===k.lt+k.rt){g.push(k);break}l.unshift(k)}g.push({lt:"statement:",rt:s(l,d)})}else"line:"===m[e].lt?(!0===d&&(0<g.length?g[g.length-1].dbln='\n(line "'+m[e].rt+'" )':g.push({lt:"debug-line:",rt:'\n(line "'+m[e].rt+'" )'})),h=m[e].rt):g.push(m[e])}m=f(g,[{lr:"->",src:["table_select?:",".:.","ident:"],fn:function(a,b){return{lt:"expr:",
rt:"(. [ "+a[b].rt+" ] "+a[b+2].rt+" )"}}},{lr:"->",src:["ident:",".:.","ident:"],fn:function(a,b){return{lt:"expr:",rt:"(. "+a[b].rt+" ."+a[b+2].rt+" )"}}},{lr:"->",src:["ident:","func_call?:"],fn:function(a,b){return{lt:"expr:",rt:"(call "+a[b].rt+" [ "+a[b+1].rt+" ] )"}}},{lr:"->",src:["ident:","table_select?:"],fn:function(a,b){return{lt:"expr:",rt:"(at "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"->",src:["expr:","func_call?:"],fn:function(a,b){return{lt:"expr:",rt:"(call "+a[b].rt+" [ "+a[b+1].rt+" ] )"}}},
{lr:"->",src:["expr:","table_select?:"],fn:function(a,b){return{lt:"expr:",rt:"(at "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"->",src:["func_call?:"],fn:function(a,b){return{lt:"expr:",rt:"( "+a[b].rt+" )"}}},{lr:"->",src:["table_select?:"],fn:function(a,b){return{lt:"expr:",rt:"[ "+a[b].rt+" ]"}}},{lr:"->",src:["expr:",".:.","ident:"],fn:function(a,b){return{lt:"expr:",rt:"(. "+a[b].rt+" ."+a[b+2].rt+" )"}}},{lr:"->",src:["ident:",".:.","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(. "+a[b].rt+" ."+
a[b+2].rt+" )"}}},{lr:"->",src:["expr:",".:.","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(. "+a[b].rt+" ."+a[b+2].rt+" )"}}},{lr:"->",src:[".:.","ident:"],fn:function(a,b){return{lt:"ident:",rt:a[b].rt+a[b+1].rt}}},{lr:"<-",src:["x:++","ident:"],fn:function(a,b){return{lt:"expr:",rt:"(++ "+a[b+1].rt+" )"}}},{lr:"<-",src:["x:--","ident:"],fn:function(a,b){return{lt:"expr:",rt:"(-- "+a[b+1].rt+" )"}}},{lr:"<-",src:["ident:","x:="],fn:function(a,b){return{lt:"set_var:",rt:"= "+a[b].rt}}},{lr:"<-",
src:["ident:","x:*="],fn:function(a,b){return{lt:"set_var:",rt:"*= "+a[b].rt}}},{lr:"<-",src:["ident:","x:/="],fn:function(a,b){return{lt:"set_var:",rt:"/= "+a[b].rt}}},{lr:"<-",src:["ident:","x:+="],fn:function(a,b){return{lt:"set_var:",rt:"+= "+a[b].rt}}},{lr:"<-",src:["ident:","x:-="],fn:function(a,b){return{lt:"set_var:",rt:"-= "+a[b].rt}}},{lr:"<-",src:["ident:","x:&="],fn:function(a,b){return{lt:"set_var:",rt:"&= "+a[b].rt}}},{lr:"<-",src:["ident:","x:|="],fn:function(a,b){return{lt:"set_var:",
rt:"|= "+a[b].rt}}},{lr:"<-",src:["ident:","x:^="],fn:function(a,b){return{lt:"set_var:",rt:"^= "+a[b].rt}}},{lr:"<-",src:["ident:","x:<<="],fn:function(a,b){return{lt:"set_var:",rt:"<<= "+a[b].rt}}},{lr:"<-",src:["ident:","x:>>="],fn:function(a,b){return{lt:"set_var:",rt:">>= "+a[b].rt}}},{lr:"<-",src:["expr:","x:="],fn:function(a,b){return{lt:"set_var:",rt:"= "+a[b].rt}}},{lr:"<-",src:["expr:","x:*="],fn:function(a,b){return{lt:"set_var:",rt:"*= "+a[b].rt}}},{lr:"<-",src:["expr:","x:/="],fn:function(a,
b){return{lt:"set_var:",rt:"/= "+a[b].rt}}},{lr:"<-",src:["expr:","x:+="],fn:function(a,b){return{lt:"set_var:",rt:"+= "+a[b].rt}}},{lr:"<-",src:["expr:","x:-="],fn:function(a,b){return{lt:"set_var:",rt:"-= "+a[b].rt}}},{lr:"<-",src:["expr:","x:&="],fn:function(a,b){return{lt:"set_var:",rt:"&= "+a[b].rt}}},{lr:"<-",src:["expr:","x:|="],fn:function(a,b){return{lt:"set_var:",rt:"|= "+a[b].rt}}},{lr:"<-",src:["expr:","x:^="],fn:function(a,b){return{lt:"set_var:",rt:"^= "+a[b].rt}}},{lr:"<-",src:["expr:",
"x:<<="],fn:function(a,b){return{lt:"set_var:",rt:"<<= "+a[b].rt}}},{lr:"<-",src:["expr:","x:>>="],fn:function(a,b){return{lt:"set_var:",rt:">>= "+a[b].rt}}},{lr:"->",src:["ident:","::::"],fn:function(a,b){return{lt:"define:",rt:a[b].rt}}},{lr:"->",src:["ident:",":::"],fn:function(a,b){return{lt:"const-define:",rt:a[b].rt}}},{lr:"->",src:["ident:","x:<-"],fn:function(a,b){return{lt:"const-define:",rt:a[b].rt}}},{lr:"->",src:["ident:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["expr:",
"expr:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["expr:","x:*","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(* "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:/","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(/ "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:+","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(+ "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:-","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(- "+a[b].rt+" "+a[b+2].rt+" )"}}},
{lr:"->",src:["expr:","x:&","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(& "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:|","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(| "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:^","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(^ "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:<<","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(<< "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:>>","expr:"],fn:function(a,b){return{lt:"expr:",
rt:"(>> "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:<","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(< "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:>","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(> "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:<=","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(<= "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:>=","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(>= "+a[b].rt+" "+a[b+2].rt+" )"}}},
{lr:"->",src:["expr:","x:==","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(== "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:","x:!=","expr:"],fn:function(a,b){return{lt:"condition:",rt:"(!= "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["condition:","x:&&","condition:"],fn:function(a,b){return{lt:"condition:",rt:"(&& "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["condition:","x:||","condition:"],fn:function(a,b){return{lt:"condition:",rt:"(|| "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",
src:["set_var:","expr:"],fn:function(a,b){return{lt:"expr:",rt:"("+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"->",src:["set_var:","func_body:"],fn:function(a,b){return{lt:"expr:",rt:"("+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"->",src:["set_var:","func_call?:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["set_var:","table_select?:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["ident:",".:.","loop_body:"],fn:function(a,b){return{lt:"expr:",rt:"(each "+a[b].rt+" "+a[b+2].rt+
" )"}}},{lr:"->",src:["expr:",".:.","loop_body:"],fn:function(a,b){return{lt:"expr:",rt:"(each "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["loop_body:"],fn:function(a,b){return{lt:"expr:",rt:"(loop noname "+a[b].rt+" )"}}},{lr:"<-",src:["const-define:","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(: "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"<-",src:["const-define:","enum-list:"],fn:n,dis:"expr:"},{lr:"<-",src:["const-define:","func_body:"],fn:function(a,b){return{lt:"expr:",rt:"(: "+a[b].rt+" "+a[b+
1].rt+" )"}}},{lr:"<-",src:["define:","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(:: "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"<-",src:["define:","enum-list:"],fn:n,dis:"expr:"},{lr:"<-",src:["define:","func_body:"],fn:function(a,b){return{lt:"expr:",rt:"(:: "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"<-",src:["func_body:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}},{lr:"->",src:["expr:","::::","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(:: "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:",
":::","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(: "+a[b].rt+" "+a[b+2].rt+" )"}}},{lr:"->",src:["expr:",",:,"],fn:function(a,b){return{lt:"arg-list:",rt:a[b].rt}}},{lr:"->",src:["arg-list:","arg-list:"],fn:function(a,b){return{lt:"arg-list:",rt:a[b].rt+" "+a[b+1].rt}}},{lr:"->",src:["arg-list:","expr:"],fn:function(a,b){return{lt:"arg-list:",rt:a[b].rt+" "+a[b+1].rt}}},{lr:"<-",src:["define:","arg-list:"],fn:function(a,b){return{lt:"expr:",rt:"(:: "+a[b].rt+" "+a[b+1].rt+" )"}}},{lr:"->",src:["enum:",
",:,"],fn:function(a,b){return{lt:"enum-list:",rt:a[b].rt}}},{lr:"->",src:["enum-list:","enum-list:"],fn:function(a,b){return{lt:"enum-list:",rt:a[b].rt+" "+a[b+1].rt}}},{lr:"->",src:["enum-list:","enum:"],fn:function(a,b){return{lt:"enum-list:",rt:a[b].rt+" "+a[b+1].rt}}},{lr:"->",src:["break:break","ident:","arg-list:"],fn:function(a,b){return{lt:"statement:",rt:"(break "+a[b+1].rt+" "+a[b+2].rt+" "+a[b+3].rt+" )"}}},{lr:"->",src:["break:break","arg-list:"],fn:function(a,b){return{lt:"statement:",
rt:"(break noname "+a[b+1].rt+" )"}}},{lr:"->",src:["return:return","arg-list:"],fn:function(a,b){return{lt:"statement:",rt:"(return [ "+a[b+1].rt+" ] )"}}},{lr:"->",src:["break:break","ident:","expr:"],fn:function(a,b){return{lt:"statement:",rt:"(break "+a[b+1].rt+" "+a[b+2].rt+" "+a[b+3].rt+" )"}}},{lr:"->",src:["break:break","expr:"],fn:function(a,b){return{lt:"statement:",rt:"(break noname "+a[b+1].rt+" )"}}},{lr:"->",src:["return:return","expr:"],fn:function(a,b){return{lt:"statement:",rt:"(return [ "+
a[b+1].rt+" ] )"}}},{lr:"->",src:["break:break"],fn:function(a,b){return{lt:"statement:",rt:"(break noname )"}}},{lr:"->",src:["return:return"],fn:function(a,b){return{lt:"statement:",rt:"(return [  ] )"}}},{lr:"->",src:["continue:continue","ident:"],fn:function(a,b){return{lt:"statement:",rt:"(continue "+a[b+1].rt+" )"}}},{lr:"->",src:["continue:continue"],fn:function(a,b){return{lt:"statement:",rt:"(continue noname )"}}},{lr:"<-",src:["condition:","x:??","expr:","x:!!","expr:"],fn:function(a,b){return{lt:"expr:",
rt:"(?? "+a[b].rt+" { "+a[b+2].rt+" } { "+a[b+4].rt+" } )"}}},{lr:"<-",src:["condition:","x:??","expr:","x:!!","statement:"],fn:function(a,b){return{lt:"expr:",rt:"(?? "+a[b].rt+" { "+a[b+2].rt+" } { "+a[b+4].rt+" } )"}}},{lr:"<-",src:["condition:","x:??","statement:","x:!!","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(?? "+a[b].rt+" { "+a[b+2].rt+" } { "+a[b+4].rt+" } )"}}},{lr:"<-",src:["condition:","x:??","statement:","x:!!","statement:"],fn:function(a,b){return{lt:"expr:",rt:"(?? "+a[b].rt+
" { "+a[b+2].rt+" } { "+a[b+4].rt+" } )"}}},{lr:"<-",src:["condition:","x:??","expr:"],fn:function(a,b){return{lt:"expr:",rt:"(?? "+a[b].rt+" { "+a[b+2].rt+" } )"}}},{lr:"<-",src:["condition:","x:??","statement:"],fn:function(a,b){return{lt:"expr:",rt:"(?? "+a[b].rt+" { "+a[b+2].rt+" } )"}}},{lr:"->",src:["condition:"],fn:function(a,b){return{lt:"expr:",rt:a[b].rt}}}]);for(e in m)if("expr:"!==m[e].lt&&"statement:"!==m[e].lt&&"arg-list:"!==m[e].lt&&"debug-line:"!==m[e].lt)throw"SyntaxError: "+m[e].lt+
m[e].rt+(""===h?"":"\n\t"+h);h="";for(e in m)h+=(""===h?"":" ")+m[e].rt+("dbln"in m[e]?m[e].dbln+" ":"");return h}var q="",w=function(p){for(var d="",f=0;f<p.length;f++)switch(p[f]){case "\n":d+="L";break;case " ":d+=" ";break;case "!":d+="x";break;case '"':d+="S";break;case "#":d+="x";break;case "$":d+="x";break;case "%":d+="x";break;case "&":d+="x";break;case "'":d+="s";break;case "(":d+="(";break;case ")":d+=")";break;case "*":d+="x";break;case "+":d+="x";break;case ",":d+=",";break;case "-":d+=
"x";break;case ".":d+=".";break;case "/":d+="x";break;case "0":d+="0";break;case "1":d+="0";break;case "2":d+="0";break;case "3":d+="0";break;case "4":d+="0";break;case "5":d+="0";break;case "6":d+="0";break;case "7":d+="0";break;case "8":d+="0";break;case "9":d+="0";break;case ":":d+=":";break;case ";":d+=";";break;case "<":d+="x";break;case "=":d+="x";break;case ">":d+="x";break;case "?":d+="x";break;case "@":d+="x";break;case "A":d+="a";break;case "B":d+="a";break;case "C":d+="a";break;case "D":d+=
"a";break;case "E":d+="a";break;case "F":d+="a";break;case "G":d+="a";break;case "H":d+="a";break;case "I":d+="a";break;case "J":d+="a";break;case "K":d+="a";break;case "L":d+="a";break;case "M":d+="a";break;case "N":d+="a";break;case "O":d+="a";break;case "P":d+="a";break;case "Q":d+="a";break;case "R":d+="a";break;case "S":d+="a";break;case "T":d+="a";break;case "U":d+="a";break;case "V":d+="a";break;case "W":d+="a";break;case "X":d+="a";break;case "Y":d+="a";break;case "Z":d+="a";break;case "[":d+=
"[";break;case "\\":d+="x";break;case "]":d+="]";break;case "^":d+="x";break;case "_":d+="a";break;case "`":d+="x";break;case "a":d+="a";break;case "b":d+="a";break;case "c":d+="a";break;case "d":d+="a";break;case "e":d+="a";break;case "f":d+="a";break;case "g":d+="a";break;case "h":d+="a";break;case "i":d+="a";break;case "j":d+="a";break;case "k":d+="a";break;case "l":d+="a";break;case "m":d+="a";break;case "n":d+="a";break;case "o":d+="a";break;case "p":d+="a";break;case "q":d+="a";break;case "r":d+=
"a";break;case "s":d+="a";break;case "t":d+="a";break;case "u":d+="a";break;case "v":d+="a";break;case "w":d+="a";break;case "x":d+="a";break;case "y":d+="a";break;case "z":d+="a";break;case "{":d+="{";break;case "|":d+="x";break;case "}":d+="}";break;case "~":d+="x";break;default:d+=" "}for(var n="",e=" ",f=0;f<d.length;f++){switch(d[f]){case "s":"s"===e?e=" ":"S"!==e&&(e="s");break;case "S":"S"===e?e=" ":"s"!==e&&(e="S")}" "===e&&0<f&&"a"===d[f-1]&&"0"===d[f]?e="a":"a"===e&&"a"!==d[f]&&"0"!==d[f]&&
(e=" ");n=" "!==e?n+e:n+d[f]}for(var d="",e=n[0],h=[],m=1,g=0;g<n.length&&"L"!==n[g];g++);var l=p.substr(0,g),l=l.split('"').join("'");""!==l&&h.push({lt:"line:",rt:""+m+": "+l});for(f=0;f<n.length;f++){if(e===n[f])d+=p[f];else{if(" "!==e)if("L"===e){for(g=f+1;g<n.length&&"L"!==n[g];g++);l=p.substr(f+1,g-f-1);l=l.split('"').join("'");""!==l&&h.push({lt:"line:",rt:""+m+": "+l})}else h.push({lt:e+":",rt:d});d=p[f];e=n[f]}"L"===n[f]&&m++}" "!==e&&"L"!==e&&h.push({lt:e+":",rt:d});for(g in h)"S:"===h[g].lt&&
(h[g].lt="s:",h[g].rt="'"+h[g].rt.substr(1,h[g].rt.length-2)+"'");return h}(function(p){for(var d="",f=0;f<p.length;f++)switch(p[f]){case "'":d+="s";break;case '"':d+="S";break;case "/":d+="b";break;case "-":d+="b";break;case ".":d+="b";break;case "\n":d+="e";break;default:d+=" "}for(var n="",e=" ",f=0;f<d.length;f++){switch(d[f]){case "s":e="s"===e?" ":"s";break;case "S":e="S"===e?" ":"S"}n=" "!==e?n+e:n+d[f]}d="";e=" ";for(f=0;f<n.length;f++){c=n[f];switch(e+c){case " b":case "eb":"//"===p.substr(f,
2)&&(c="c"),"---"===p.substr(f,3)&&(c="c"),"..."===p.substr(f,3)&&(c="c")}switch(c){case "c":e="c";break;case "e":e=" "}" "===e&&(d+=p[f])}return d}(u)),q=q+"\n[start]------";try{var x=document.getElementById("debug_check"),t=s(w,x.checked),q=q+("\n[end s-list]: "+t),q=q+"\n------\n"}catch(y){t=y}if(v===t)return"d(^-^)b";document.getElementById("yamasemi_debug").value+=q;document.getElementById("kawasemi").value+=t;return"NG! q(ToT)p -> "+u};
