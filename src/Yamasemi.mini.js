function on_yamasemi(t,u){function r(p,d){function f(a,b){for(var d=0;d<b.length;d++)for(var e=b[d],f=e.src.length,k=0;0===k;)for(var k=1,g=0;g<=a.length-f;g++){var l=g;"<-"===e.d&&(l=a.length-f-g);for(var h=0,m="";h<f;)if(m=e.src[h],a[l+h].b===m)h++;else if(a[l+h].b+a[l+h].a===m)h++;else break;if(h===f){k=e.c(a,l);m="";for(h=0;h<f;h++)"dbln"in a[l+h]&&(m+=a[l+h].e);""!==m&&(k.e=m);h=[];for(g=0;g<a.length;)g===l?(h.push(k),g+=f):(h.push(a[g]),g++);a=h;k=0;break}}return a}function n(a,b){for(var d=a[b+1].a.split(","),
e="(enum "+a[b].a+" ",f=0;f<d.length;f++)e+=d[f]+" ";return{b:"expr:",a:e+")"}}for(var e="",l=f(p,[{d:"->",src:["a:break"],c:function(a,b){return{b:"break:",a:a[b].a}}},{d:"->",src:["a:continue"],c:function(a,b){return{b:"continue:",a:a[b].a}}},{d:"->",src:["a:return"],c:function(a,b){return{b:"return:",a:a[b].a}}},{d:"->",src:["x:@"],c:function(a,b){return{b:"ident:",a:a[b].a}}},{d:"->",src:["0:",".:.","0:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["a:"],c:function(a,b){return{b:"ident:",
a:a[b].a}}},{d:"->",src:["0:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["s:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["S:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["(:(","):)"],c:function(){return{b:"func_call?:",a:""}}},{d:"->",src:["[:[","]:]"],c:function(){return{b:"table_select?:",a:""}}},{d:"->",src:["{:{","}:}"],c:function(){return{b:"func_body:",a:"{ }"}}}]),m=[],k=0;k<l.length;k++){var h=l[k].b+l[k].a,g={};if("):)"===h){for(var h=[],q=!1;g=
m.pop();)if("(:("!==g.b+g.a)h.unshift(g);else{m.push({b:"func_call?:",a:("dbln"in g?g.e+" ":"")+r(h,d)});q=!0;break}if(!1==q)throw"syntax-error: ')'"+(""===e?"":"\n\t"+e);}else if("]:]"===h){h=[];for(q=!1;g=m.pop();)if("[:["!==g.b+g.a)h.unshift(g);else{m.push({b:"table_select?:",a:("dbln"in g?g.e+" ":"")+r(h,d)});q=!0;break}if(!1==q)throw"syntax-error: ']'"+(""===e?"":"\n\t"+e);}else if("}:}}"===h){h=[];for(q=!1;g=m.pop();)if("{:{{"!==g.b+g.a)h.unshift(g);else{m.push({b:"loop_body:",a:"{ "+("dbln"in
g?g.e+" ":"")+r(h,d)+" }"});q=!0;break}if(!1==q)throw"syntax-error: '}}'"+(""===e?"":"\n\t"+e);}else if("}:}"===h){h=[];for(q=!1;g=m.pop();)if("{:{"!==g.b+g.a)h.unshift(g);else{m.push({b:"func_body:",a:"{ "+("dbln"in g?g.e+" ":"")+r(h,d)+" }"});q=!0;break}if(!1==q)throw"syntax-error: '}'"+(""===e?"":"\n\t"+e);}else if(";:;"===h){for(h=[];g=m.pop();){if("{:{"===g.b+g.a){m.push(g);break}if("{:{{"===g.b+g.a){m.push(g);break}if("(:("===g.b+g.a){m.push(g);break}if("[:["===g.b+g.a){m.push(g);break}h.unshift(g)}m.push({b:"statement:",
a:r(h,d)})}else"line:"===l[k].b?(!0===d&&(0<m.length?m[m.length-1].e='\n(line "'+l[k].a+'" )':m.push({b:"debug-line:",a:'\n(line "'+l[k].a+'" )'})),e=l[k].a):m.push(l[k])}l=f(m,[{d:"->",src:["func_body:",".:.","ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["table_select?:",".:.","ident:"],c:function(a,b){return{b:"expr:",a:"(. [ "+a[b].a+" ] ."+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:.","ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+
a[b+2].a+" )"}}},{d:"->",src:["func_body:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["ident:","table_select?:"],c:function(a,b){return{b:"expr:",a:"(at "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["expr:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["expr:","table_select?:"],
c:function(a,b){return{b:"expr:",a:"(at "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["table_select?:","table_select?:"],c:function(a,b){return{b:"expr:",a:"(at "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["func_call?:"],c:function(a,b){return{b:"expr:",a:"( "+a[b].a+" )"}}},{d:"->",src:["table_select?:"],c:function(a,b){return{b:"expr:",a:"[ "+a[b].a+" ]"}}},{d:"->",src:["expr:",".:.","ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:.","expr:"],
c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["expr:",".:.","expr:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:.","loop_body:"],c:function(a,b){return{b:"expr:",a:"(each "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",".:.","loop_body:"],c:function(a,b){return{b:"expr:",a:"(each "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:[".:.","ident:"],c:function(a,b){return{b:"ident:",a:a[b].a+a[b+1].a}}},{d:"<-",src:["x:++",
"ident:"],c:function(a,b){return{b:"expr:",a:"(++ "+a[b+1].a+" )"}}},{d:"<-",src:["x:--","ident:"],c:function(a,b){return{b:"expr:",a:"(-- "+a[b+1].a+" )"}}},{d:"<-",src:["ident:","x:="],c:function(a,b){return{b:"set_var:",a:"= "+a[b].a}}},{d:"<-",src:["ident:","x:*="],c:function(a,b){return{b:"set_var:",a:"*= "+a[b].a}}},{d:"<-",src:["ident:","x:/="],c:function(a,b){return{b:"set_var:",a:"/= "+a[b].a}}},{d:"<-",src:["ident:","x:+="],c:function(a,b){return{b:"set_var:",a:"+= "+a[b].a}}},{d:"<-",src:["ident:",
"x:-="],c:function(a,b){return{b:"set_var:",a:"-= "+a[b].a}}},{d:"<-",src:["ident:","x:&="],c:function(a,b){return{b:"set_var:",a:"&= "+a[b].a}}},{d:"<-",src:["ident:","x:|="],c:function(a,b){return{b:"set_var:",a:"|= "+a[b].a}}},{d:"<-",src:["ident:","x:^="],c:function(a,b){return{b:"set_var:",a:"^= "+a[b].a}}},{d:"<-",src:["ident:","x:<<="],c:function(a,b){return{b:"set_var:",a:"<<= "+a[b].a}}},{d:"<-",src:["ident:","x:>>="],c:function(a,b){return{b:"set_var:",a:">>= "+a[b].a}}},{d:"<-",src:["expr:",
"x:="],c:function(a,b){return{b:"set_var:",a:"= "+a[b].a}}},{d:"<-",src:["expr:","x:*="],c:function(a,b){return{b:"set_var:",a:"*= "+a[b].a}}},{d:"<-",src:["expr:","x:/="],c:function(a,b){return{b:"set_var:",a:"/= "+a[b].a}}},{d:"<-",src:["expr:","x:%="],c:function(a,b){return{b:"set_var:",a:"%= "+a[b].a}}},{d:"<-",src:["expr:","x:+="],c:function(a,b){return{b:"set_var:",a:"+= "+a[b].a}}},{d:"<-",src:["expr:","x:-="],c:function(a,b){return{b:"set_var:",a:"-= "+a[b].a}}},{d:"<-",src:["expr:","x:&="],
c:function(a,b){return{b:"set_var:",a:"&= "+a[b].a}}},{d:"<-",src:["expr:","x:|="],c:function(a,b){return{b:"set_var:",a:"|= "+a[b].a}}},{d:"<-",src:["expr:","x:^="],c:function(a,b){return{b:"set_var:",a:"^= "+a[b].a}}},{d:"<-",src:["expr:","x:<<="],c:function(a,b){return{b:"set_var:",a:"<<= "+a[b].a}}},{d:"<-",src:["expr:","x:>>="],c:function(a,b){return{b:"set_var:",a:">>= "+a[b].a}}},{d:"->",src:["ident:","::::"],c:function(a,b){return{b:"define:",a:a[b].a}}},{d:"->",src:["ident:",":::"],c:function(a,
b){return{b:"const-define:",a:a[b].a}}},{d:"->",src:["ident:","x:->"],c:function(a,b){return{b:"const-define:",a:a[b].a}}},{d:"->",src:["ident:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["expr:","x:*","expr:"],c:function(a,b){return{b:"expr:",a:"(* "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:/","expr:"],c:function(a,b){return{b:"expr:",a:"(/ "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:%","expr:"],c:function(a,b){return{b:"expr:",a:"(% "+a[b].a+" "+a[b+2].a+" )"}}},
{d:"->",src:["expr:","x:+","expr:"],c:function(a,b){return{b:"expr:",a:"(+ "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:-","expr:"],c:function(a,b){return{b:"expr:",a:"(- "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:&","expr:"],c:function(a,b){return{b:"expr:",a:"(& "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:|","expr:"],c:function(a,b){return{b:"expr:",a:"(| "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:^","expr:"],c:function(a,b){return{b:"expr:",a:"(^ "+a[b].a+
" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<<","expr:"],c:function(a,b){return{b:"expr:",a:"(<< "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>>","expr:"],c:function(a,b){return{b:"expr:",a:"(>> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<","expr:"],c:function(a,b){return{b:"condition:",a:"(< "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>","expr:"],c:function(a,b){return{b:"condition:",a:"(> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<=","expr:"],c:function(a,
b){return{b:"condition:",a:"(<= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>=","expr:"],c:function(a,b){return{b:"condition:",a:"(>= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:==","expr:"],c:function(a,b){return{b:"condition:",a:"(== "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:!=","expr:"],c:function(a,b){return{b:"condition:",a:"(!= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["condition:","x:&&","condition:"],c:function(a,b){return{b:"condition:",a:"(&& "+a[b].a+" "+
a[b+2].a+" )"}}},{d:"->",src:["condition:","x:||","condition:"],c:function(a,b){return{b:"condition:",a:"(|| "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["set_var:","expr:"],c:function(a,b){return{b:"expr:",a:"("+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["set_var:","func_body:"],c:function(a,b){return{b:"expr:",a:"("+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["set_var:","func_call?:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["set_var:","table_select?:"],c:function(a,b){return{b:"expr:",
a:a[b].a}}},{d:"->",src:["loop_body:"],c:function(a,b){return{b:"expr:",a:"(loop noname "+a[b].a+" )"}}},{d:"<-",src:["const-define:","expr:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["const-define:","enum-list:"],c:n,f:"expr:"},{d:"<-",src:["const-define:","func_body:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["define:","expr:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["define:",
"enum-list:"],c:n,f:"expr:"},{d:"<-",src:["define:","func_body:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["func_body:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["expr:","::::","expr:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",":::","expr:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",",:,"],c:function(a,b){return{b:"arg-list:",a:a[b].a}}},{d:"->",
src:["arg-list:","arg-list:"],c:function(a,b){return{b:"arg-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["arg-list:","expr:"],c:function(a,b){return{b:"arg-list:",a:a[b].a+" "+a[b+1].a}}},{d:"<-",src:["define:","arg-list:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["enum:",",:,"],c:function(a,b){return{b:"enum-list:",a:a[b].a}}},{d:"->",src:["enum-list:","enum-list:"],c:function(a,b){return{b:"enum-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["enum-list:",
"enum:"],c:function(a,b){return{b:"enum-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["break:break","ident:","expr:"],c:function(a,b){return{b:"statement:",a:"(break "+a[b+1].a+" "+a[b+2].a+" "+a[b+3].a+" )"}}},{d:"->",src:["break:break","expr:"],c:function(a,b){return{b:"statement:",a:"(break noname "+a[b+1].a+" )"}}},{d:"->",src:["return:return","expr:"],c:function(a,b){return{b:"statement:",a:"(return "+a[b+1].a+" )"}}},{d:"->",src:["continue:continue","ident:","expr:"],c:function(a,b){return{b:"statement:",
a:"(continue "+a[b+1].a+" "+a[b+2].a+" )"}}},{d:"->",src:["continue:continue"],c:function(){return{b:"statement:",a:"(continue noname )"}}},{d:"<-",src:["condition:","x:??","expr:","x:!!","expr:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","expr:","x:!!","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:","x:!!","expr:"],
c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:","x:!!","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","expr:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } )"}}},{d:"->",src:["condition:"],
c:function(a,b){return{b:"expr:",a:a[b].a}}}]);for(k in l)if("expr:"!==l[k].b&&"statement:"!==l[k].b&&"arg-list:"!==l[k].b&&"debug-line:"!==l[k].b)throw"syntax-error: "+l[k].b+l[k].a+(""===e?"":"\n\t"+e);e="";for(k in l)e+=(""===e?"":" ")+l[k].a+("dbln"in l[k]?l[k].e+" ":"");return e}var v=function(p){for(var d="",f=0;f<p.length;f++)switch(p[f]){case "\n":d+="L";break;case " ":d+=" ";break;case "!":d+="x";break;case '"':d+="S";break;case "#":d+="x";break;case "$":d+="x";break;case "%":d+="x";break;
case "&":d+="x";break;case "'":d+="s";break;case "(":d+="(";break;case ")":d+=")";break;case "*":d+="x";break;case "+":d+="x";break;case ",":d+=",";break;case "-":d+="x";break;case ".":d+=".";break;case "/":d+="x";break;case "0":d+="0";break;case "1":d+="0";break;case "2":d+="0";break;case "3":d+="0";break;case "4":d+="0";break;case "5":d+="0";break;case "6":d+="0";break;case "7":d+="0";break;case "8":d+="0";break;case "9":d+="0";break;case ":":d+=":";break;case ";":d+=";";break;case "<":d+="x";break;
case "=":d+="x";break;case ">":d+="x";break;case "?":d+="x";break;case "@":d+="x";break;case "A":d+="a";break;case "B":d+="a";break;case "C":d+="a";break;case "D":d+="a";break;case "E":d+="a";break;case "F":d+="a";break;case "G":d+="a";break;case "H":d+="a";break;case "I":d+="a";break;case "J":d+="a";break;case "K":d+="a";break;case "L":d+="a";break;case "M":d+="a";break;case "N":d+="a";break;case "O":d+="a";break;case "P":d+="a";break;case "Q":d+="a";break;case "R":d+="a";break;case "S":d+="a";break;
case "T":d+="a";break;case "U":d+="a";break;case "V":d+="a";break;case "W":d+="a";break;case "X":d+="a";break;case "Y":d+="a";break;case "Z":d+="a";break;case "[":d+="[";break;case "\\":d+="x";break;case "]":d+="]";break;case "^":d+="x";break;case "_":d+="a";break;case "`":d+="x";break;case "a":d+="a";break;case "b":d+="a";break;case "c":d+="a";break;case "d":d+="a";break;case "e":d+="a";break;case "f":d+="a";break;case "g":d+="a";break;case "h":d+="a";break;case "i":d+="a";break;case "j":d+="a";
break;case "k":d+="a";break;case "l":d+="a";break;case "m":d+="a";break;case "n":d+="a";break;case "o":d+="a";break;case "p":d+="a";break;case "q":d+="a";break;case "r":d+="a";break;case "s":d+="a";break;case "t":d+="a";break;case "u":d+="a";break;case "v":d+="a";break;case "w":d+="a";break;case "x":d+="a";break;case "y":d+="a";break;case "z":d+="a";break;case "{":d+="{";break;case "|":d+="x";break;case "}":d+="}";break;case "~":d+="x";break;default:d+=" "}for(var n="",e=" ",f=0;f<d.length;f++){switch(d[f]){case "s":"s"===
e?e=" ":"S"!==e&&(e="s");break;case "S":"S"===e?e=" ":"s"!==e&&(e="S")}" "===e&&0<f&&"a"===d[f-1]&&"0"===d[f]?e="a":"a"===e&&"a"!==d[f]&&"0"!==d[f]&&(e=" ");n=" "!==e?n+e:n+d[f]}for(var d="",e=n[0],l=[],m=1,k=0;k<n.length&&"L"!==n[k];k++);var h=p.substr(0,k),h=h.split('"').join("'");""!==h&&l.push({b:"line:",a:""+m+": "+h});for(f=0;f<n.length;f++){if(e===n[f])d+=p[f];else{if(" "!==e)if("L"===e){for(k=f;k<n.length&&"L"!==n[k];k++);h=p.substr(f,k-f);h=h.split('"').join("'");""!==h&&l.push({b:"line:",
a:""+m+": "+h})}else if("("===e||")"===e||"["===e||"]"===e)for(k=0;k<d.length;k++)l.push({b:e+":",a:e});else l.push({b:e+":",a:d});d=p[f];e=n[f]}"L"===n[f]&&m++}" "!==e&&"L"!==e&&l.push({b:e+":",a:d});for(k in l)"S:"===l[k].b&&(l[k].b="s:",l[k].a="'"+l[k].a.substr(1,l[k].a.length-2)+"'");return l}(function(p){for(var d="",f=0;f<p.length;f++)switch(p[f]){case "'":d+="s";break;case '"':d+="S";break;case "/":d+="b";break;case "-":d+="b";break;case ".":d+="b";break;case "\n":d+="e";break;default:d+=" "}for(var n=
"",e=" ",f=0;f<d.length;f++){switch(d[f]){case "s":e="s"===e?" ":"s";break;case "S":e="S"===e?" ":"S"}n=" "!==e?n+e:n+d[f]}d="";e=" ";for(f=0;f<n.length;f++){c=n[f];switch(e+c){case " b":case "eb":"//"===p.substr(f,2)&&(c="c"),"---"===p.substr(f,3)&&(c="c"),"..."===p.substr(f,3)&&(c="c")}switch(c){case "c":e="c";break;case "e":e=" "}" "===e&&(d+=p[f])}return d}(t));try{var s=r(v,u)}catch(w){s=w}return s};