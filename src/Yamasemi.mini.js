﻿/*

https://github.com/yamazaki3104/BirdsScript

Copyright (c) YAMAZAKI Satoshi. All rights reserved.

YAMASEMI COMPILER 1.0 for Javascript

*/
function yamasemi_compiler(z,A){function s(n,d){function g(a,b){do for(var d=!1,e=0;e<b.length;e++){for(var f=b[e],g=f.src.length,k=0;k<=a.length-g;k++){var l=k;"<-"===f.d&&(l=a.length-g-k);for(var h=0,m="";h<g;)if(m=f.src[h],a[l+h].b===m)h++;else if(a[l+h].b+a[l+h].a===m)h++;else break;if(h===g){d=f.c(a,l);m="";for(h=0;h<g;h++)"dbln"in a[l+h]&&(m+=a[l+h].e);""!==m&&(d.e=m);h=[];for(f=0;f<a.length;)f===l?(h.push(d),f+=g):(h.push(a[f]),f++);a=h;d=!0;break}}if(!0==d)break}while(!0==d);return a}function p(a,b){for(var d=
a[b+1].a.split(","),e="(enum "+a[b].a+" ",f=0;f<d.length;f++)e+=d[f]+" ";return{b:"expr:",a:e+")"}}for(var e="",h=g(n,[{d:"->",src:["a:break"],c:function(a,b){return{b:"break:",a:a[b].a}}},{d:"->",src:["a:continue"],c:function(a,b){return{b:"continue:",a:a[b].a}}},{d:"->",src:["a:return"],c:function(a,b){return{b:"return:",a:a[b].a}}},{d:"->",src:["a:catch"],c:function(a,b){return{b:"catch:",a:a[b].a}}},{d:"->",src:["a:throw"],c:function(a,b){return{b:"throw:",a:a[b].a}}},{d:"->",src:["a:exit"],c:function(a,
b){return{b:"exit:",a:a[b].a}}},{d:"->",src:["a:repeat"],c:function(a,b){return{b:"repeat:",a:a[b].a}}},{d:"->",src:["a:label"],c:function(a,b){return{b:"label:",a:a[b].a}}},{d:"->",src:["a:until"],c:function(a,b){return{b:"until:",a:a[b].a}}},{d:"->",src:["a:goto"],c:function(a,b){return{b:"goto:",a:a[b].a}}},{d:"->",src:["x:@"],c:function(a,b){return{b:"ident:",a:a[b].a}}},{d:"->",src:["a:"],c:function(a,b){return{b:"ident:",a:a[b].a}}},{d:"->",src:["0:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},
{d:"->",src:["s:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["S:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["(:(","):)"],c:function(){return{b:"func_call?:",a:""}}},{d:"->",src:["[:[","]:]"],c:function(){return{b:"table_select?:",a:""}}},{d:"->",src:["{:{","}:}"],c:function(){return{b:"func_body:",a:"{ }"}}}]),m=[],k=0;k<h.length;k++){var l=h[k].b+h[k].a,f={};if("):)"===l){for(var l=[],q=!1;f=m.pop();)if("(:("!==f.b+f.a)l.unshift(f);else{m.push({b:"func_call?:",a:("dbln"in
f?f.e+" ":"")+s(l,d)});q=!0;break}if(!1==q)throw"syntax-error: ')'"+(""===e?"":"\n\t"+e);}else if("]:]"===l){l=[];for(q=!1;f=m.pop();)if("[:["!==f.b+f.a)l.unshift(f);else{m.push({b:"table_select?:",a:("dbln"in f?f.e+" ":"")+s(l,d)});q=!0;break}if(!1==q)throw"syntax-error: ']'"+(""===e?"":"\n\t"+e);}else if("}:}}"===l){l=[];for(q=!1;f=m.pop();)if("{:{{"!==f.b+f.a)l.unshift(f);else{m.push({b:"loop_body:",a:"{ "+("dbln"in f?f.e+" ":"")+s(l,d)+" }"});q=!0;break}if(!1==q)throw"syntax-error: '}}'"+(""===
e?"":"\n\t"+e);}else if("}:}"===l){l=[];for(q=!1;f=m.pop();)if("{:{"!==f.b+f.a)l.unshift(f);else{m.push({b:"func_body:",a:"{ "+("dbln"in f?f.e+" ":"")+s(l,d)+" }"});q=!0;break}if(!1==q)throw"syntax-error: '}'"+(""===e?"":"\n\t"+e);}else if(";:;"===l){for(l=[];f=m.pop();){if("{:{"===f.b+f.a){m.push(f);break}if("{:{{"===f.b+f.a){m.push(f);break}if("(:("===f.b+f.a){m.push(f);break}if("[:["===f.b+f.a){m.push(f);break}if(",:,"===f.b+f.a){m.push(f);break}if("statement:"===f.b){m.push(f);break}l.unshift(f)}m.push({b:"statement:",
a:"(; "+s(l,d)+" )"})}else"line:"===h[k].b?(!0===d&&(0<m.length?m[m.length-1].e='\n(line "'+h[k].a+'" )':m.push({b:"debug-line:",a:'\n(line "'+h[k].a+'" )'})),e=h[k].a):m.push(h[k])}h=g(m,[{d:"->",src:[".:.","ident:"],c:function(a,b){return{b:"dot_ident:",a:a[b].a+a[b+1].a}}},{d:"->",src:["func_body:","dot_ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["table_select?:","dot_ident:"],c:function(a,b){return{b:"expr:",a:"(. [ "+a[b].a+" ] "+a[b+1].a+" )"}}},
{d:"->",src:["throw:throw","ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(throw "+a[b+1].a+" [ "+a[b+2].a+" ] )"}}},{d:"->",src:["exit:exit","ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(throw "+a[b+1].a+" [ "+a[b+2].a+" ] )"}}},{d:"->",src:["until:until","ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(until "+a[b+1].a+" [ "+a[b+2].a+" ] )"}}},{d:"->",src:["goto:goto","ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(until "+a[b+1].a+" [ "+a[b+
2].a+" ] )"}}}]);h=g(h,[{d:"->",src:["expr:",".:..","expr:"],c:function(a,b){return{b:"expr:",a:"(range "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:..","expr:"],c:function(a,b){return{b:"expr:",a:"(range "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",".:..","ident:"],c:function(a,b){return{b:"expr:",a:"(range "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:..","ident:"],c:function(a,b){return{b:"expr:",a:"(range "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",".:.","loop_body:"],
c:function(a,b){return{b:"expr:",a:"(each "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["ident:",".:.","loop_body:"],c:function(a,b){return{b:"expr:",a:"(each "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["func_body:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["ident:","table_select?:"],c:function(a,b){return{b:"expr:",a:"(at "+a[b].a+
" "+a[b+1].a+" )"}}},{d:"->",src:["expr:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call "+a[b].a+" [ "+a[b+1].a+" ] )"}}},{d:"->",src:["expr:","table_select?:"],c:function(a,b){return{b:"expr:",a:"(at "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["table_select?:","table_select?:"],c:function(a,b){return{b:"expr:",a:"(at [ "+a[b].a+" ] "+a[b+1].a+" )"}}},{d:"->",src:["ident:","dot_ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call (. "+a[b].a+" "+a[b+1].a+" ) [ "+a[b+2].a+" ] )"}}},
{d:"->",src:["expr:","dot_ident:","func_call?:"],c:function(a,b){return{b:"expr:",a:"(call (. "+a[b].a+" "+a[b+1].a+" ) [ "+a[b+2].a+" ] )"}}},{d:"->",src:["ident:","dot_ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["ident:",".:.","expr:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["expr:","dot_ident:"],c:function(a,b){return{b:"expr:",a:"(. "+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["expr:",".:.","expr:"],c:function(a,
b){return{b:"expr:",a:"(. "+a[b].a+" ."+a[b+2].a+" )"}}},{d:"->",src:["func_call?:"],c:function(a,b){return{b:"expr:",a:"(scope { "+a[b].a+" } )"}}},{d:"->",src:["table_select?:"],c:function(a,b){return{b:"expr:",a:"[ "+a[b].a+" ]"}}},{d:"->",src:["loop_body:"],c:function(a,b){return{b:"expr:",a:"(loop "+a[b].a+" )"}}}]);h=g(h,[{d:"->",src:["dot_ident:"],c:function(a,b){return{b:"ident:",a:a[b].a}}},{d:"<-",src:["x:++","ident:"],c:function(a,b){return{b:"expr:",a:"(++ "+a[b+1].a+" )"}}},{d:"<-",src:["x:--",
"ident:"],c:function(a,b){return{b:"expr:",a:"(-- "+a[b+1].a+" )"}}},{d:"<-",src:["ident:","x:="],c:function(a,b){return{b:"set_var:",a:"= "+a[b].a}}},{d:"<-",src:["ident:","x:*="],c:function(a,b){return{b:"set_var:",a:"*= "+a[b].a}}},{d:"<-",src:["ident:","x:/="],c:function(a,b){return{b:"set_var:",a:"/= "+a[b].a}}},{d:"<-",src:["ident:","x:%="],c:function(a,b){return{b:"set_var:",a:"%= "+a[b].a}}},{d:"<-",src:["ident:","x:+="],c:function(a,b){return{b:"set_var:",a:"+= "+a[b].a}}},{d:"<-",src:["ident:",
"x:-="],c:function(a,b){return{b:"set_var:",a:"-= "+a[b].a}}},{d:"<-",src:["ident:","x:&="],c:function(a,b){return{b:"set_var:",a:"&= "+a[b].a}}},{d:"<-",src:["ident:","x:|="],c:function(a,b){return{b:"set_var:",a:"|= "+a[b].a}}},{d:"<-",src:["ident:","x:^="],c:function(a,b){return{b:"set_var:",a:"^= "+a[b].a}}},{d:"<-",src:["ident:","x:<<="],c:function(a,b){return{b:"set_var:",a:"<<= "+a[b].a}}},{d:"<-",src:["ident:","x:>>="],c:function(a,b){return{b:"set_var:",a:">>= "+a[b].a}}},{d:"<-",src:["expr:",
"x:="],c:function(a,b){return{b:"set_var:",a:"= "+a[b].a}}},{d:"<-",src:["expr:","x:*="],c:function(a,b){return{b:"set_var:",a:"*= "+a[b].a}}},{d:"<-",src:["expr:","x:/="],c:function(a,b){return{b:"set_var:",a:"/= "+a[b].a}}},{d:"<-",src:["expr:","x:%="],c:function(a,b){return{b:"set_var:",a:"%= "+a[b].a}}},{d:"<-",src:["expr:","x:+="],c:function(a,b){return{b:"set_var:",a:"+= "+a[b].a}}},{d:"<-",src:["expr:","x:-="],c:function(a,b){return{b:"set_var:",a:"-= "+a[b].a}}},{d:"<-",src:["expr:","x:&="],
c:function(a,b){return{b:"set_var:",a:"&= "+a[b].a}}},{d:"<-",src:["expr:","x:|="],c:function(a,b){return{b:"set_var:",a:"|= "+a[b].a}}},{d:"<-",src:["expr:","x:^="],c:function(a,b){return{b:"set_var:",a:"^= "+a[b].a}}},{d:"<-",src:["expr:","x:<<="],c:function(a,b){return{b:"set_var:",a:"<<= "+a[b].a}}},{d:"<-",src:["expr:","x:>>="],c:function(a,b){return{b:"set_var:",a:">>= "+a[b].a}}},{d:"->",src:["ident:","::::"],c:function(a,b){return{b:"define:",a:a[b].a}}},{d:"->",src:["ident:",":::"],c:function(a,
b){return{b:"const-define:",a:a[b].a}}},{d:"->",src:["catch:catch","ident:","x:->>","func_body:"],c:function(a,b){return{b:"statement:",a:"(->> "+a[b+1].a+" "+a[b+3].a+" )"}}},{d:"->",src:["catch:catch","ident:","x:->>","expr:"],c:function(a,b){return{b:"statement:",a:"(->> "+a[b+1].a+" "+a[b+3].a+" )"}}},{d:"->",src:["ident:","x:->>","func_body:"],c:function(a,b){return{b:"statement:",a:"(->> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["ident:","x:->>","expr:"],c:function(a,b){return{b:"statement:",
a:"(->> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["repeat:repeat","ident:","x:<<-","func_body:"],c:function(a,b){return{b:"statement:",a:"(<<- "+a[b+1].a+" "+a[b+3].a+" )"}}},{d:"->",src:["label:label","ident:","x:<<-","func_body:"],c:function(a,b){return{b:"statement:",a:"(<<- "+a[b+1].a+" "+a[b+3].a+" )"}}},{d:"->",src:["ident:","x:<<-","func_body:"],c:function(a,b){return{b:"statement:",a:"(<<- "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["ident:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",
src:["expr:","x:*","expr:"],c:function(a,b){return{b:"expr:",a:"(* "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:/","expr:"],c:function(a,b){return{b:"expr:",a:"(/ "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:%","expr:"],c:function(a,b){return{b:"expr:",a:"(% "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:+","expr:"],c:function(a,b){return{b:"expr:",a:"(+ "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:-","expr:"],c:function(a,b){return{b:"expr:",a:"(- "+a[b].a+" "+a[b+
2].a+" )"}}},{d:"->",src:["expr:","x:&","expr:"],c:function(a,b){return{b:"expr:",a:"(& "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:|","expr:"],c:function(a,b){return{b:"expr:",a:"(| "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:^","expr:"],c:function(a,b){return{b:"expr:",a:"(^ "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<<","expr:"],c:function(a,b){return{b:"expr:",a:"(<< "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>>","expr:"],c:function(a,b){return{b:"expr:",
a:"(>> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<","expr:"],c:function(a,b){return{b:"condition:",a:"(< "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>","expr:"],c:function(a,b){return{b:"condition:",a:"(> "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:<=","expr:"],c:function(a,b){return{b:"condition:",a:"(<= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:>=","expr:"],c:function(a,b){return{b:"condition:",a:"(>= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",
"x:==","expr:"],c:function(a,b){return{b:"condition:",a:"(== "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:","x:!=","expr:"],c:function(a,b){return{b:"condition:",a:"(!= "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["condition:","x:&&","condition:"],c:function(a,b){return{b:"condition:",a:"(&& "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["condition:","x:||","condition:"],c:function(a,b){return{b:"condition:",a:"(|| "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["set_var:","expr:"],c:function(a,b){return{b:"expr:",
a:"("+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["set_var:","func_body:"],c:function(a,b){return{b:"expr:",a:"("+a[b].a+" "+a[b+1].a+" )"}}},{d:"->",src:["set_var:","func_call?:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["set_var:","table_select?:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"<-",src:["const-define:","expr:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["const-define:","enum-list:"],c:p,f:"expr:"},{d:"<-",src:["const-define:",
"func_body:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["define:","expr:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["define:","enum-list:"],c:p,f:"expr:"},{d:"<-",src:["define:","func_body:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+1].a+" )"}}},{d:"<-",src:["func_body:"],c:function(a,b){return{b:"expr:",a:a[b].a}}},{d:"->",src:["expr:","::::","expr:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+
" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",":::","expr:"],c:function(a,b){return{b:"expr:",a:"(: "+a[b].a+" "+a[b+2].a+" )"}}},{d:"->",src:["expr:",",:,"],c:function(a,b){return{b:"arg-list:",a:"(, "+a[b].a+" )"}}},{d:"->",src:["arg-list:","arg-list:"],c:function(a,b){return{b:"arg-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["arg-list:","expr:"],c:function(a,b){return{b:"arg-list:",a:a[b].a+" "+a[b+1].a}}},{d:"<-",src:["define:","arg-list:"],c:function(a,b){return{b:"expr:",a:"(:: "+a[b].a+" "+a[b+
1].a+" )"}}},{d:"->",src:["enum:",",:,"],c:function(a,b){return{b:"enum-list:",a:a[b].a}}},{d:"->",src:["enum-list:","enum-list:"],c:function(a,b){return{b:"enum-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["enum-list:","enum:"],c:function(a,b){return{b:"enum-list:",a:a[b].a+" "+a[b+1].a}}},{d:"->",src:["break:break","ident:","expr:"],c:function(a,b){return{b:"statement:",a:"(break "+a[b+1].a+" "+a[b+2].a+" "+a[b+3].a+" )"}}},{d:"->",src:["break:break","expr:"],c:function(a,b){return{b:"statement:",
a:"(break "+a[b+1].a+" )"}}},{d:"->",src:["return:return","expr:"],c:function(a,b){return{b:"statement:",a:"(return "+a[b+1].a+" )"}}},{d:"->",src:["continue:continue","ident:","expr:"],c:function(a,b){return{b:"statement:",a:"(continue "+a[b+1].a+" "+a[b+2].a+" )"}}},{d:"->",src:["continue:continue"],c:function(){return{b:"statement:",a:"(continue )"}}},{d:"<-",src:["condition:","x:??","expr:","x:!!","expr:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},
{d:"<-",src:["condition:","x:??","expr:","x:!!","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:","x:!!","expr:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:","x:!!","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } { "+a[b+4].a+" } )"}}},{d:"<-",src:["condition:","x:??","expr:"],
c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } )"}}},{d:"<-",src:["condition:","x:??","statement:"],c:function(a,b){return{b:"expr:",a:"(?? "+a[b].a+" { "+a[b+2].a+" } )"}}},{d:"->",src:["condition:"],c:function(a,b){return{b:"expr:",a:a[b].a}}}]);for(k in h)if("expr:"!==h[k].b&&"statement:"!==h[k].b&&"arg-list:"!==h[k].b&&"debug-line:"!==h[k].b)throw"syntax-error: '"+h[k].a+"'"+(""===e?"":"\n\t"+e);e="";for(k in h)e+=(""===e?"":" ")+h[k].a+("dbln"in h[k]?h[k].e+" ":"");return e}
function w(n){for(var d="",g=0;g<n.length;g++)switch(n[g]){case "\n":d+="L";break;case " ":d+=" ";break;case "!":d+="x";break;case '"':d+="S";break;case "#":d+="x";break;case "$":d+="x";break;case "%":d+="x";break;case "&":d+="x";break;case "'":d+="s";break;case "(":d+="(";break;case ")":d+=")";break;case "*":d+="x";break;case "+":d+="x";break;case ",":d+=",";break;case "-":d+="x";break;case ".":d+=".";break;case "/":d+="x";break;case "0":d+="0";break;case "1":d+="0";break;case "2":d+="0";break;case "3":d+=
"0";break;case "4":d+="0";break;case "5":d+="0";break;case "6":d+="0";break;case "7":d+="0";break;case "8":d+="0";break;case "9":d+="0";break;case ":":d+=":";break;case ";":d+=";";break;case "<":d+="x";break;case "=":d+="x";break;case ">":d+="x";break;case "?":d+="x";break;case "@":d+="x";break;case "A":d+="a";break;case "B":d+="a";break;case "C":d+="a";break;case "D":d+="a";break;case "E":d+="a";break;case "F":d+="a";break;case "G":d+="a";break;case "H":d+="a";break;case "I":d+="a";break;case "J":d+=
"a";break;case "K":d+="a";break;case "L":d+="a";break;case "M":d+="a";break;case "N":d+="a";break;case "O":d+="a";break;case "P":d+="a";break;case "Q":d+="a";break;case "R":d+="a";break;case "S":d+="a";break;case "T":d+="a";break;case "U":d+="a";break;case "V":d+="a";break;case "W":d+="a";break;case "X":d+="a";break;case "Y":d+="a";break;case "Z":d+="a";break;case "[":d+="[";break;case "\\":d+="x";break;case "]":d+="]";break;case "^":d+="x";break;case "_":d+="a";break;case "`":d+="x";break;case "a":d+=
"a";break;case "b":d+="a";break;case "c":d+="a";break;case "d":d+="a";break;case "e":d+="a";break;case "f":d+="a";break;case "g":d+="a";break;case "h":d+="a";break;case "i":d+="a";break;case "j":d+="a";break;case "k":d+="a";break;case "l":d+="a";break;case "m":d+="a";break;case "n":d+="a";break;case "o":d+="a";break;case "p":d+="a";break;case "q":d+="a";break;case "r":d+="a";break;case "s":d+="a";break;case "t":d+="a";break;case "u":d+="a";break;case "v":d+="a";break;case "w":d+="a";break;case "x":d+=
"a";break;case "y":d+="a";break;case "z":d+="a";break;case "{":d+="{";break;case "|":d+="x";break;case "}":d+="}";break;case "~":d+="x";break;default:d+=" "}for(var p="",e=" ",g=0;g<d.length;g++){switch(d[g]){case "s":"s"===e?e=" ":"S"!==e&&(e="s");break;case "S":"S"===e?e=" ":"s"!==e&&(e="S")}" "===e&&0<g&&"a"===d[g-1]&&"0"===d[g]?e="a":"a"===e&&"a"!==d[g]&&"0"!==d[g]&&(e=" ");p=" "!==e?p+e:p+d[g]}for(var h="",e=p[0],d=[],m=1,k=0;k<p.length&&"L"!==p[k];k++);var l=n.substr(0,k),l=l.split('"').join("'");
""!==l&&d.push({b:"line:",a:""+m+": "+l});for(g=0;g<p.length;g++){if(e===p[g])h+=n[g];else{if(" "!==e)if("L"===e){for(k=g;k<p.length&&"L"!==p[k];k++);l=n.substr(g,k-g);l=l.split('"').join("'");""!==l&&d.push({b:"line:",a:""+m+": "+l})}else if("("===e||")"===e||"["===e||"]"===e)for(k=0;k<h.length;k++)d.push({b:e+":",a:e});else d.push({b:e+":",a:h});h=n[g];e=p[g]}"L"===p[g]&&m++}" "!==e&&"L"!==e&&d.push({b:e+":",a:h});for(k in d)if("S:"===d[k].b){l=d[k].a.substr(1,d[k].a.length-2);n=l.split("\\\\");
for(var f in n)n[f]=n[f].split("\\n").join("\n"),n[f]=n[f].split("\\t").join("\t");d[k].b="S:";d[k].a="'"+n.join("\\")+"'"}return d}var t=function(n){for(var d="",g=0;g<n.length;g++)switch(n[g]){case "'":d+="s";break;case '"':d+="S";break;case "/":d+="b";break;case "-":d+="b";break;case ".":d+="b";break;case "\n":d+="e";break;default:d+=" "}for(var p="",e=" ",g=0;g<d.length;g++){switch(d[g]){case "s":e="s"===e?" ":"s";break;case "S":e="S"===e?" ":"S"}p=" "!==e?p+e:p+d[g]}d="";e=" ";for(g=0;g<p.length;g++){c=
p[g];switch(e+c){case " b":case "eb":"//"===n.substr(g,2)&&(c="c"),"---"===n.substr(g,3)&&(c="c"),"..."===n.substr(g,3)&&(c="c")}switch(c){case "c":e="c";break;case "e":e=" "}" "===e&&(d+=n[g])}return d}(z),t=w(t),v=[],x;for(x in t)if(tkn=t[x],"S:"!==tkn.b)v.push(tkn);else{var r=tkn.a.split("{}").join(""),r=r.split("{").join("'+("),r=r.split("}").join(").str+'"),r=w(r),u;for(u in r)"S:"===r[u].b&&(r[u].b="s:"),v.push(r[u])}try{var y=s(v,A)}catch(B){y=B}return y};