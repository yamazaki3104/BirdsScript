function on_kawasemi(G){function A(){return{d:"[stack]",b:"list",a:[],c:"null",e:!1}}function B(h){for(var a in h){var g=h[a];"list"===g.b?B(g.a):"func_no"===g.b&&"dtor"===g.c&&u(q[g.a])}}function C(w){for(var a=A();w<h.length;){var g=h.pop();"out"===g.c?a=g:"list"===g.b?B(g.a):"func_no"===g.b&&"dtor"===g.c&&(a=u(q[g.a]))}return a}function u(w){function a(a){v.push("syntax-error : "+a+(""===s?"":"\n\tline:"+s));return{d:"[event]",b:"error",a:"syntax-error : "+a,g:"top"}}function g(a){if("list_no"===a.b){var d=
h.length;a=u(q[a.a]);if("[event]"===a.d)return a;for(;d<h.length;)h.pop();d={d:"[stack]",b:"list",a:[],c:"literal",e:!1};if(0===a.length)return d;for(var b in a)"ident"===a[b].b&&(a[b]=g(a[b])),"[stack]"===a[b].d&&("literal"===a[b].c&&(a[b].c=""+b),"."!==a[b].c[0]&&(a[b].c="."+a[b].c),a[b].f=d);d.a=a;return d}if("ident"!==a.b)return a;b=a.a;for(d=h.length-1;0<=d;d--)if("[stack]"===h[d].d&&h[d].c===b)return h[d];v.push("undefined variable.: "+b+(""===s?"":"\n\tline:"+s));return{d:"[event]",b:"error",
a:"undefined-var : "+b,g:"top"}}function l(d,b){var e=g(b);if("[event]"===e.d)return e;if("ident"!==d.b){if(!0===d.e&&!0===d.f.e)return a("cannot be set to a constant.: "+d.f.c);d.a=e.a;d.b=e.b;return d}for(var f=h.length-1;0<=f;f--){var k=h[f];if("[stack]"===k.d&&k.c===d.a){if(!0===k.e)return a("cannot be set to a constant.: "+k.c);if(k.b!==e.b)return a("unmatch types.: '"+k.b+":"+k.c+"' != '"+e.b+"'");k.a=e.a;k.b=e.b;e=x(k);e.c="literal";return e}}v.push("undefined variable.: "+d.a+(""===s?"":"\n\tline:"+
s));return{d:"[event]",b:"error",a:"undefined-var : "+d.a,g:"top"}}function k(d,b,e){b=g(b);if("[event]"===b.d)return b;e=g(e);if("[event]"===e.d)return e;if(b.b!==e.b)return{d:"[stack]",b:"bool",a:!1,c:"literal",e:!0};if("(>"===d)return{d:"[stack]",b:"bool",a:b.a>e.a,c:"literal",e:!0};if("(<"===d)return{d:"[stack]",b:"bool",a:b.a<e.a,c:"literal",e:!0};if("(>="===d)return{d:"[stack]",b:"bool",a:b.a>=e.a,c:"literal",e:!0};if("(<="===d)return{d:"[stack]",b:"bool",a:b.a<=e.a,c:"literal",e:!0};if("(=="===
d)return{d:"[stack]",b:"bool",a:b.a===e.a,c:"literal",e:!0};if("(!="===d)return{d:"[stack]",b:"bool",a:b.a!==e.a,c:"literal",e:!0};if("(&&"===d)return{d:"[stack]",b:"bool",a:b.a&&e.a,c:"literal",e:!0};if("(||"===d)return{d:"[stack]",b:"bool",a:b.a||e.a,c:"literal",e:!0};if("str"===b.b&&"str"===e.b&&1===b.a.length&&1===e.a.length){if("(+"===d)return{d:"[stack]",b:b.b,a:String.fromCharCode(b.a.charCodeAt(0)+e.a.charCodeAt(0)),c:"literal",e:!0};if("(-"===d)return{d:"[stack]",b:b.b,a:String.fromCharCode(b.a.charCodeAt(0)-
e.a.charCodeAt(0)),c:"literal",e:!0}}return"(*"===d?{d:"[stack]",b:b.b,a:b.a*e.a,c:"literal",e:!0}:"(/"===d?{d:"[stack]",b:b.b,a:Math.floor(b.a/e.a),c:"literal",e:!0}:"(%"===d?{d:"[stack]",b:b.b,a:b.a%e.a,c:"literal",e:!0}:"(+"===d?{d:"[stack]",b:b.b,a:b.a+e.a,c:"literal",e:!0}:"(-"===d?{d:"[stack]",b:b.b,a:b.a-e.a,c:"literal",e:!0}:"(&"===d?{d:"[stack]",b:b.b,a:b.a&e.a,c:"literal",e:!0}:"(|"===d?{d:"[stack]",b:b.b,a:b.a|e.a,c:"literal",e:!0}:"(^"===d?{d:"[stack]",b:b.b,a:b.a^e.a,c:"literal",e:!0}:
"(>>"===d?{d:"[stack]",b:b.b,a:b.a>>e.a,c:"literal",e:!0}:a(d)}function y(d,b,e){e=g(e);if("[event]"===e.d)return e;if("int"!==e.b)return a("variable type mismatch.: "+e.a+" "+e.b);if("ident"!==b.b){if(!0===b.e)return a("cannot be set to a constant.: "+b.c);if("int"!==b.b)return a("variable type mismatch.:"+b.a);if("*="===d)return{d:"[stack]",b:"int",a:b.a*=e.a,c:"literal",e:!1};if("/="===d)return{d:"[stack]",b:"int",a:b.a=Math.floor(b.a/e.a),c:"literal",e:!1};if("%="===d)return{d:"[stack]",b:"int",
a:b.a%=e.a,c:"literal",e:!1};if("+="===d)return{d:"[stack]",b:"int",a:b.a+=e.a,c:"literal",e:!1};if("-="===d)return{d:"[stack]",b:"int",a:b.a-=e.a,c:"literal",e:!1};v.push("undefined variable.: "+b.a+" "+d+(""===s?"":"\n\tline:"+s));return{d:"[event]",b:"error",a:"undefined-var:"+b.a,g:"top"}}for(var f=b.a,k=h.length-1;0<=k;k--){var l=h[k];if(l.c===f){if(!0===l.e)return a("cannot be set to a constant.: "+l.c);if("int"!==l.b)return a("variable type mismatch.:"+B(l));if("*="===d)return{d:"[stack]",
b:"int",a:l.a*=e.a,c:"literal",e:!1};if("/="===d)return{d:"[stack]",b:"int",a:l.a=Math.floor(l.a/e.a),c:"literal",e:!1};if("%="===d)return{d:"[stack]",b:"int",a:l.a%=e.a,c:"literal",e:!1};if("+="===d)return{d:"[stack]",b:"int",a:l.a+=e.a,c:"literal",e:!1};if("-="===d)return{d:"[stack]",b:"int",a:l.a-=e.a,c:"literal",e:!1}}}v.push("undefined variable.: "+b.a+" "+d+(""===s?"":"\n\tline:"+s));return{d:"[event]",b:"error",a:"undefined-var:"+b.a,g:"top"}}function x(a){return{d:a.d,b:a.b,a:a.a,c:a.c,e:a.e}}
function B(a){return"func_no"===a.b?"{}":"list"===a.b?"[]":"str"===a.b?"'"+a.a+"'":"int"===a.b?a.a:a.b}if(!w)return[];for(var n=[],D=0;D<w.length;D++){var e=w[D];if("ident"!==e.b||")"!==e.a){if("("===e.a||"(each"===e.a||"(loop"===e.a)e.h=h.length;n.push(e)}else{for(var d=[],f=n.length-1;0<=f;--f){var b=n.pop();d.unshift(b);if("ident"===b.b&&"("===b.a[0])break}if(!(0>=d.length))if(e=d[0].a,"("===e){f=C(d[0].h);if("[event]"===f.d)return f;2>d.length?n.push(A()):n.push(g(d[d.length-1]))}else if("(;"===
e){if(2>d.length)return a("arg_size < 2 : "+e)}else if("(at"===e||"(."===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);if("@"===d[1].a)b=x(d[1]),b.a=d[1].a+d[2].a,b.b="int",n.push(b);else{f=g(d[1]);if("[event]"===f.d)return f;b=d[2];"(at"===e&&(b=g(d[2]));b=("."===b.a[0]?"":".")+b.a;d=!1;".type"===b&&(d=f.b,"func_no"===d&&(d="func"),d={d:"[stack]",b:"str",a:d,c:"literal",e:!1},n.push(d));if(!1===d&&"[stack]"===f.d&&"list"===f.b){if(!1===d)for(var m in f.a){d=
f.a[m];if(d.c===b){n.push(d);break}d=!1}if(!1===d){var r="";for(m=h.length-1;0<=m;m--)if("[stack]"===h[m].d&&h[m].c===b){d=h[m];break}!1!==d&&"int"===d.b&&0<=d.a&&d.a<f.a.length&&n.push(f.a[d.a])}if(!1===d)for(m in f.a){d=f.a[m];if(".unmatch"===d.c){n.push(d);break}d=!1}}if(!1===d)return v.push("undefined variable.: "+f.c+b+(""===s?"":"\n\tline:"+s)),{d:"[event]",b:"error",a:"undefined-var : "+f.c+b,g:"top"}}}else if("(:"===e||"(::"===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+
e);f=d[1].a;if("ident"!==d[1].b){if("int"!==d[1].b)return a("cannot define.: "+f);f=""+f}b=g(d[2]);if("[event]"===b.d)return b;b={d:"[stack]",b:b.b,a:b.a,c:f,e:"(:"===e};h.push(b);n.push(b)}else if("(="===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);b=l(d[1],d[2]);if("[event]"===b.d)return b;n.push(b)}else if("(<<"===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);if("@.co"===d[1].a){b=g(d[2]);if("str"===b.b||
"int"===b.b)t+=b.a;else if("list"===b.b){t+="[ ";for(m in b.a)"."===b.a[m].c[0]&&(t+=B(b.a[m])+", ");t+="]"}n.push(d[1])}else if("ident"!==d[1].b)return a("syntax-error?: "+d[1].a);for(m=h.length-1;0<=m;m--)if(f=h[m],"[stack]"===f.d&&f.c===d[1].a){if(!0===f.e)return a("cannot be set to a constant.: "+f.c);if("list"===f.b)b=g(d[2]),"literal"===b.c?f.a.push({d:b.d,b:b.b,a:b.a,c:"."+f.a.length,e:b.e,f:f}):(b=x(b),"."!==b.c[0]&&(b.c="."+b.c),f.a.push(b));else if("str"===f.b)f.a=""+f.a+g(d[2]).a;else if("int"===
f.b){n.push({d:"[stack]",b:f.b,a:f.a<<g(d[2]).a,c:"literal",e:!0});break}n.push(d[1]);break}}else if("(<"===e||"(>"===e||"(<="===e||"(>="===e||"(=="===e||"(!="===e||"(&&"===e||"(||"===e||"(*"===e||"(/"===e||"(%"===e||"(+"===e||"(-"===e||"(&"===e||"(|"===e||"(^"===e||"(>>"===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);n.push(k(e,d[1],d[2]))}else if("(??"===e){if(3>d.length)return a("arg_size < 3 : "+e);if(4<d.length)return a("arg_size > 4 : "+e);if("bool"===
d[1].b&&!0===d[1].a){b=u(q[d[2].a]);if("[event]"===b.d)return b;for(var z in b)n.push(b[z])}else if(4===d.length){b=u(q[d[3].a]);if("[event]"===b.d)return b;for(z in b)n.push(b[z])}else n.push({d:"[token]",b:"bool",a:!1,e:!0})}else if("(loop"===e){if(2>d.length)return a("arg_size < 2 : "+e);if(2<d.length)return a("arg_size > 2 : "+e);h.push({d:"[stack]",b:"list",a:[],c:"out",e:!1});e=h.length;b=A();for(f=0;100>f;f++){b=u(q[d[1].a]);if("[event]"===b.d&&"break"===b.b){h.pop();b.a.c="out";h.push(b.a);
break}if(("[event]"!==b.d||"continue"!==b.b)&&"[event]"===b.d)return b}if(100<=f)return v.push("exception : loop limit-over."+(""===s?"":"\n\tline:"+s)),{d:"[event]",b:"exception",a:"exception : loop limit-over.",g:"top"};f=C(d[0].h);if("[event]"===f.d)return f;n.push(f)}else if("(each"===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);f=g(d[1]);if("[event]"===f.d)return f;r=0;if("str"===f.b)r=f.a.length;else if("int"===f.b)r=f.a;else if("list"===f.b)r=f.a.length;
else return a("each type error: "+f.b);e=h.length;h.push({d:"[stack]",b:f.b,a:0,c:"it",e:!0});h.push({d:"[stack]",b:"int",a:0,c:"idx",e:!0});h.push({d:"[stack]",b:"int",a:r,c:"max",e:!0});h.push({d:"[stack]",b:"list",a:[],c:"out",e:!1});for(var b=A(),p=0;p<r;p++){"str"===f.b?h[e].a=f.a.substr(p,1):"int"===f.b?h[e].a=p:"list"===f.b&&(b=x(g(f.a[p])),b.c="it",h[e]=b);if("list"===f.b){if(b=g(f.a[p]).c,"literal"!==b)if("."!==b[0])continue;else h[e+1].a=b.substr(1,b.length-1),h[e+1].b="str"}else h[e+1].a=
p;b=u(q[d[2].a]);if("[event]"===b.d&&"break"===b.b){h.pop();b.a.c="out";h.push(b.a);break}if(("[event]"!==b.d||"continue"!==b.b)&&"[event]"===b.d)return b}f=C(d[0].h);if("[event]"===f.d)return f;n.push(f)}else{if("(break"===e)return 2>d.length?a("arg_size < 2 : "+e):2<d.length?a("arg_size > 2 : "+e):"list_no"!==d[1].b?a("argument is not list-object : "+e):{d:"[event]",b:"break",a:g(d[1])};if("(continue"===e)return 1>d.length?a("arg_size < 1 : "+e):1<d.length?a("arg_size > 1 : "+e):{d:"[event]",b:"continue",
a:A()};if("(++"===e){if(2>d.length)return a("arg_size < 2 : "+e);if(2<d.length)return a("arg_size > 2 : "+e);n.push(y("+=",d[1],{d:"[token]",b:"int",a:1}))}else if("(--"===e){if(2>d.length)return a("arg_size < 2 : "+e);if(2<d.length)return a("arg_size > 2 : "+e);n.push(y("-=",d[1],{d:"[token]",b:"int",a:1}))}else if("(+="===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);n.push(y("+=",d[1],d[2]))}else if("(-="===e){if(3<d.length)return a("arg_size > 3 : "+
e);if(3>d.length)return a("arg_size < 3 : "+e);n.push(y("-=",d[1],d[2]))}else if("(*="===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);n.push(y("*=",d[1],d[2]))}else if("(/="===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);n.push(y("/=",d[1],d[2]))}else if("(%="===e){if(3>d.length)return a("arg_size < 3 : "+e);if(3<d.length)return a("arg_size > 3 : "+e);n.push(y("%=",d[1],d[2]))}else if("(call"===e){if(3>d.length)return a("arg_size < 3 : "+
e);if(3<d.length)return a("arg_size > 3 : "+e);f=g(d[1]);if("[event]"===f.d)return f;if(f.f)for(b=f.f.a,m=b.length-1;0<=m;m--)"[stack]"===b[m].d&&h.push(b[m]);e=h.length;if(3===d.length){b=u(q[d[2].a]);if("[event]"===b.d)return b;for(m=h.length-1;e-1<m;m--)h[m].c="_"+h[m].c;h.push({d:"[stack]",b:"int",a:h.length-e,c:"arg_size",e:!0})}for(d=0;d<e;d++)r=h[d].c,"_"===r[0]&&(h[d].c="_."+r);r=h.length;if("func_no"!==f.b)return a("func_no: "+f.a);b=u(q[f.a]);if("[event]"===b.d){if("return"!==b.b){for(;e<
h.length;)h.pop();return b}b={d:"[stack]",b:"list",a:b.a,c:"out",e:!1}}if("list"!==b.b){var E={d:"[stack]",b:"list",a:[],c:"out",e:!1},f=!1;for(m in b)p=x(b[m]),p.c&&".literal"!==p.c&&"literal"!==p.c?"out"===p.c&&(f=p):!1===f&&(f=g(p));!1!==f&&(f.c=".0",f.e=!0,f.f=E,E.a.push(f));b=E}else for(m in b.a)b.a[m]=g(b.a[m]);for(;r<h.length;)f=h.pop(),f.f=b,b.a.unshift(f);for(;e<h.length;)f=h.pop();for(d in h)r=h[d].c,"_"===r[0]&&"."===r[1]&&(h[d].c=r.substr(2,r.length-2));n.push(b)}else{if("(return"===e){if(2>
d.length)return a("arg_size < 2 : "+e);if(2<d.length)return a("arg_size > 2 : "+e);if("list_no"!==d[1].b)return a("argument is not list-object : "+e);b=g(d[1]);if("[event]"===b.d)return b;if("list"===b.b){w=[];z=0;for(m in b.a)p=x(b.a[m]),b.a[m].c?"."!==p.c[0]&&(p.c="."+p.c):(p=x(g(p)),p.c="."+z,z++),w.push(p);return{d:"[event]",b:"return",a:w}}return a("return not list : "+e)}if("(line"===e)s=d[1].a;else return a("token-error: "+e)}}}}return n}var q=[],h=[],v=[],t="",s="",F=function(h){for(var a=
"",g=0;g<h.length;g++)switch(h[g]){case "'":a+="s";break;case '"':a+="S";break;case "/":a+="b";break;case "-":a+="b";break;case ".":a+="b";break;case "\n":a+="e";break;default:a+=" "}for(var l="",k=" ",g=0;g<a.length;g++){switch(a[g]){case "s":"s"===k?k=" ":"S"!==k&&(k="s");break;case "S":"S"===k?k=" ":"s"!==k&&(k="S")}l=" "!==k?l+k:l+a[g]}a="";k=" ";for(g=0;g<l.length;g++){c=l[g];switch(k+c){case " b":case "eb":"//"===h.substr(g,2)&&(c="c"),"---"===h.substr(g,3)&&(c="c"),"..."===h.substr(g,3)&&(c=
"c")}switch(c){case "c":k="c";break;case "e":k=" "}" "===k&&(a+=h[g])}return a}(G);(function(h){q=[];for(var a=[],g=0;g<h.length;g++)if("}:}"===h[g])for(var l=[],k;k=a.pop();)if("ident"===k.b&&"{"===k.a){k=q.length;q.push(l);a.push({d:"[token]",b:"func_no",a:k});break}else l.unshift(k);else if("]:]"===h[g])for(l=[];k=a.pop();)if("ident"===k.b&&"["===k.a){k=q.length;q.push(l);a.push({d:"[token]",b:"list_no",a:k});break}else l.unshift(k);else l=h[g],"a:true"===l?l={d:"[stack]",b:"bool",a:!0,c:"literal",
e:!0}:"a:false"===l?l={d:"[stack]",b:"bool",a:!1,c:"literal",e:!0}:(k=l.substr(0,2),l="0:"===k?{d:"[stack]",b:"int",a:parseInt(l.substr(2,l.length-2)),c:"literal",e:!0}:"s:"===k?{d:"[stack]",b:"str",a:l.substr(3,l.length-2-2),c:"literal",e:!0}:{d:"[token]",b:"ident",a:l.substr(2,l.length-2)}),a.push(l);q.push(a)})(function(h){for(var a="",g=0;g<F.length;g++)switch(h[g]){case " ":a+=" ";break;case "!":a+="a";break;case '"':a+="S";break;case "#":a+="a";break;case "$":a+="a";break;case "%":a+="a";break;
case "&":a+="a";break;case "'":a+="s";break;case "(":a+="a";break;case ")":a+=")";break;case "*":a+="a";break;case "+":a+="a";break;case ",":a+="a";break;case "-":a+="a";break;case ".":a+="a";break;case "/":a+="a";break;case "0":a+="0";break;case "1":a+="0";break;case "2":a+="0";break;case "3":a+="0";break;case "4":a+="0";break;case "5":a+="0";break;case "6":a+="0";break;case "7":a+="0";break;case "8":a+="0";break;case "9":a+="0";break;case ":":a+="a";break;case ";":a+="a";break;case "<":a+="a";break;
case "=":a+="a";break;case ">":a+="a";break;case "?":a+="a";break;case "@":a+="a";break;case "A":a+="a";break;case "B":a+="a";break;case "C":a+="a";break;case "D":a+="a";break;case "E":a+="a";break;case "F":a+="a";break;case "G":a+="a";break;case "H":a+="a";break;case "I":a+="a";break;case "J":a+="a";break;case "K":a+="a";break;case "L":a+="a";break;case "M":a+="a";break;case "N":a+="a";break;case "O":a+="a";break;case "P":a+="a";break;case "Q":a+="a";break;case "R":a+="a";break;case "S":a+="a";break;
case "T":a+="a";break;case "U":a+="a";break;case "V":a+="a";break;case "W":a+="a";break;case "X":a+="a";break;case "Y":a+="a";break;case "Z":a+="a";break;case "[":a+="[";break;case "\\":a+="a";break;case "]":a+="]";break;case "^":a+="a";break;case "_":a+="a";break;case "`":a+="a";break;case "a":a+="a";break;case "b":a+="a";break;case "c":a+="a";break;case "d":a+="a";break;case "e":a+="a";break;case "f":a+="a";break;case "g":a+="a";break;case "h":a+="a";break;case "i":a+="a";break;case "j":a+="a";
break;case "k":a+="a";break;case "l":a+="a";break;case "m":a+="a";break;case "n":a+="a";break;case "o":a+="a";break;case "p":a+="a";break;case "q":a+="a";break;case "r":a+="a";break;case "s":a+="a";break;case "t":a+="a";break;case "u":a+="a";break;case "v":a+="a";break;case "w":a+="a";break;case "x":a+="a";break;case "y":a+="a";break;case "z":a+="a";break;case "{":a+="{";break;case "|":a+="a";break;case "}":a+="}";break;case "~":a+="a";break;default:a+=" "}for(var l="",k=" ",g=0;g<a.length;g++){switch(a[g]){case "s":"s"===
k?k=" ":"S"!==k&&(k="s");break;case "S":"S"===k?k=" ":"s"!==k&&(k="S")}" "===k&&0<g&&"a"===a[g-1]&&"0"===a[g]?k="a":"a"===k&&"a"!==a[g]&&"0"!==a[g]&&(k=" ");l=" "!==k?l+k:l+a[g]}for(var a="",k=l[0],q=[],g=0;g<l.length;g++)k===l[g]?a+=h[g]:(" "!==k&&q.push(k+":"+a),a=h[g],k=l[g]);" "!==k&&q.push(k+":"+a);return q}(F));u(q[q.length-1]);0<v.length&&(t+=v+"\n");return t};