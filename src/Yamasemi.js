/*

https://github.com/yamazaki3104/BirdsScript

Copyright (c) YAMAZAKI Satoshi. All rights reserved.

YAMASEMI COMPILER 1.0 for Javascript

*/
//-------------------------------------

function yamasemi_compiler( _txt, _flag )
{
    //-------------------------------------
    // 構文解析
    function yamasemi_parser( _tbl, _debug_mode )
    {
        //-------------------------------------
        // 構文解析（その２）
        function yamasemi_parser2( _in, _chk_tbl )
        {
            do
            {{
                var  re_try = false ;

                for ( var cc=0 ; cc<_chk_tbl.length ; cc++ )
                {{
                    var chk = _chk_tbl[cc] ;
                    var m   = chk.src.length ;

                    for ( var ii=0 ; ii<=_in.length-m ; ii++ ) // '->' 左から右に一致確認
                    {{
                        var i = ii ;

                        if ( chk.lr === '<-' )
                            i = _in.length - m - ii ; // 右から左

                        var k=0 ;
                        var kdb = '' ;
                        for ( ; k<m ; )
                        {{
                            var c = chk.src[k] ;
                            if ( _in[i+k].lt === c ) k++ ;
                            else if ( (_in[i+k].lt+_in[i+k].rt) === c ) k++  ;
                            else break ;
                        }}

                        if ( k === m ) {
                            // Hit !! 一致した
                            var r = chk.fn( _in, i ) ; // 指定された関数をコール
                            // _in を置き換える
                            var kdb = '' ;
                            for ( k=0; k<m ; k++)
                            {{
                                if ( 'dbln' in _in[i+k] )
                                    kdb += _in[i+k].dbln ;
                            }}
                            if ( kdb !== '' )
                                r.dbln = kdb ;
                            var tmp = [] ;
                            for ( var j=0 ; j<_in.length ; )
                            {{
                                if ( j === i ) { tmp.push( r      ) ; j+=m ; }
                                else           { tmp.push( _in[j] ) ; j++  ; }
                            }}

                            _in = tmp ;
                            re_try = true ;

                            break ;
                        }
                    }}
                    // for ii
                    if ( re_try == true ) break ;
                }}
                // for cc

            }}
            while ( re_try == true )

            return _in ;
        }

        //-------------------------------------
        // 'var def:'
        function enum_def_f( _tbl, _i )
        {
            var name = _tbl[_i].rt ; // 'define:name'
            var enum_list = _tbl[_i+1].rt.split(',') ;  // 'enum-list:enum1,enum2'

            var def = '(enum '+_tbl[_i].rt+' ' ;
            for ( var i=0 ; i<enum_list.length ; i++ )
                def += enum_list[i] + ' ' ;

            def += ')' ;

            return { lt:'expr:', rt:def } ;
        }

        //-------------------------------------
        // ここからー

        var debug_line = '' ;

        // 構文解析
        var out1 = yamasemi_parser2( _tbl, [
            { lr:'->', src:['a:break'   ], fn:function(_tbl,_i){return{lt:'break:',    rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:continue'], fn:function(_tbl,_i){return{lt:'continue:', rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:return'  ], fn:function(_tbl,_i){return{lt:'return:',   rt:_tbl[_i].rt };} },

            { lr:'->', src:['a:catch'   ], fn:function(_tbl,_i){return{lt:'catch:',   rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:throw'   ], fn:function(_tbl,_i){return{lt:'throw:',   rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:exit'    ], fn:function(_tbl,_i){return{lt:'exit:',    rt:_tbl[_i].rt };} },

            { lr:'->', src:['a:repeat'  ], fn:function(_tbl,_i){return{lt:'repeat:',  rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:label'   ], fn:function(_tbl,_i){return{lt:'label:',   rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:until'   ], fn:function(_tbl,_i){return{lt:'until:',   rt:_tbl[_i].rt };} },
            { lr:'->', src:['a:goto'    ], fn:function(_tbl,_i){return{lt:'goto:',    rt:_tbl[_i].rt };} },

            { lr:'->', src:['x:@'       ], fn:function(_tbl,_i){return{lt:'ident:', rt:_tbl[_i].rt };} },

            { lr:'->', src:['a:' ], fn:function(_tbl,_i){return{lt:'ident:', rt:_tbl[_i].rt };} },
            { lr:'->', src:['0:' ], fn:function(_tbl,_i){return{lt:'expr:',  rt:_tbl[_i].rt };} },
            { lr:'->', src:['s:' ], fn:function(_tbl,_i){return{lt:'expr:',  rt:_tbl[_i].rt };} },
            { lr:'->', src:['S:' ], fn:function(_tbl,_i){return{lt:'expr:',  rt:_tbl[_i].rt };} },

            { lr:'->', src:['(:(', '):)' ], fn:function(_tbl,_i){return{lt:'func_call?:',    rt:''    };} },
            { lr:'->', src:['[:[', ']:]' ], fn:function(_tbl,_i){return{lt:'table_select?:', rt:''    };} },
            { lr:'->', src:['{:{', '}:}' ], fn:function(_tbl,_i){return{lt:'func_body:',     rt:'{ }' };} }
        ] ) ;

        // 括弧 ( ) や [ ], { }, {{ }}, ;, で分割。
        var out2 = [] ;
        for ( var i=0 ; i<out1.length ; i++ )
        {{
            var o = (out1[i].lt+out1[i].rt) ;
            var e = {} ;
            // ( ) expr or arg-list
            if ( o === '):)' ) {
                // '(' まで out2 から tmp に移動
                var tmp = [] ;
                var hit = false ;
                while ( e = out2.pop() )
                {{
                    if ( (e.lt+e.rt) !== '(:(' ) {
                        tmp.unshift( e ) ;
                    }
                    else {
                        out2.push( { lt:'func_call?:', rt:(('dbln' in e )?e.dbln+' ':'')+yamasemi_parser( tmp, _debug_mode ) } ) ;
                        hit = true ;
                        break ;
                    }
                }}
                if ( hit == false )
                    throw "syntax-error: ')'" + (debug_line==='' ? '' : "\n\t"+debug_line) ;
            }
            // [ ] list
            else if ( o === ']:]' ) {
                var tmp = [] ;
                var hit = false ;
                while ( e = out2.pop() )
                {{
                    if ( (e.lt+e.rt) !== '[:[' ) {
                        tmp.unshift( e ) ;
                    }
                    else {
                        out2.push( { lt:'table_select?:', rt:(('dbln' in e )?e.dbln+' ':'')+yamasemi_parser( tmp, _debug_mode ) } ) ;
                        hit = true ;
                        break ;
                    }
                }}
                if ( hit == false )
                    throw "syntax-error: ']'" + (debug_line==='' ? '' : "\n\t"+debug_line) ;
            }
            // {{ }} loop
            else if ( o === '}:}}' ) {
                var tmp = [] ;
                var hit = false ;
                while ( e = out2.pop() )
                {{
                    if ( (e.lt+e.rt) !== '{:{{' ) {
                        tmp.unshift( e ) ;
                    }
                    else {
                        out2.push( { lt:'loop_body:', rt:'{ ' +(('dbln' in e )?e.dbln+' ':'')+ yamasemi_parser( tmp, _debug_mode ) + ' }' } ) ;
                        hit = true ;
                        break ;
                    }
                }}
                if ( hit == false )
                    throw "syntax-error: '}}'" + (debug_line==='' ? '' : "\n\t"+debug_line) ;
            }
            // { } func
            else if ( o === '}:}' ) {
                var tmp = [] ;
                var hit = false ;
                while ( e = out2.pop() )
                {{
                    if ( (e.lt+e.rt) !== '{:{' ) {
                        tmp.unshift( e ) ;
                    }
                    else {
                        out2.push( { lt:'func_body:', rt:'{ ' +(('dbln' in e )?e.dbln+' ':'')+ yamasemi_parser( tmp, _debug_mode ) + ' }' } ) ;
                        hit = true ;
                        break ;
                    }
                }}
                if ( hit == false )
                    throw "syntax-error: '}'" + (debug_line==='' ? '' : "\n\t"+debug_line) ;
            }
            // ; statement
            else if ( o === ';:;' ) {
                var tmp = [] ;
                while ( e = out2.pop() )
                {{
                    if ( (e.lt+e.rt) === '{:{'  ) { out2.push(e); break; }
                    if ( (e.lt+e.rt) === '{:{{' ) { out2.push(e); break; }
                    if ( (e.lt+e.rt) === '(:('  ) { out2.push(e); break; }
                    if ( (e.lt+e.rt) === '[:['  ) { out2.push(e); break; }
                    if ( (e.lt+e.rt) === ',:,'  ) { out2.push(e); break; }
                    if ( e.lt === 'statement:'  ) { out2.push(e); break; }
                    tmp.unshift( e ) ;
                }}

                out2.push( { lt:'statement:', rt:'(; '+yamasemi_parser( tmp, _debug_mode )+' )' } ) ; // 確定
            }
            else if ( out1[i].lt==='line:' ) {
                if ( _debug_mode === true ) {
                    if ( out2.length > 0 )
                        out2[out2.length-1].dbln = '\n(line "'+out1[i].rt+'" )' ;
                    else
                        out2.push( { lt:'debug-line:', rt:'\n(line "'+out1[i].rt+'" )' } ) ;
                }
                debug_line = out1[i].rt ;
            }
            else {
                out2.push( out1[i] ) ;
            }
        }}

        var out21 = yamasemi_parser2( out2, [
            { lr:'->', src:['.:.', 'ident:'], fn:function(_tbl,_i){return{lt:'dot_ident:', rt:_tbl[_i].rt+_tbl[_i+1].rt };} },

            // {}.type
            { lr:'->', src:['func_body:',     'dot_ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },
            // [].type
            { lr:'->', src:['table_select?:', 'dot_ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. [ '+_tbl[_i].rt+' ] '+_tbl[_i+1].rt+' )'};} },

            // throw aaa() ; exit aaa() ;
            { lr:'->', src:['throw:throw', 'ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(throw '+_tbl[_i+1].rt+' [ '+_tbl[_i+2].rt+' ] )'};} },
            { lr:'->', src:['exit:exit',   'ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(throw '+_tbl[_i+1].rt+' [ '+_tbl[_i+2].rt+' ] )'};} },

            // until aaa() ; goto aaa() ;
            { lr:'->', src:['until:until', 'ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(until '+_tbl[_i+1].rt+' [ '+_tbl[_i+2].rt+' ] )'};} },
            { lr:'->', src:['goto:goto',   'ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(until '+_tbl[_i+1].rt+' [ '+_tbl[_i+2].rt+' ] )'};} }
        ] ) ;

        // 分割後の余り、すなわち文 statment を評価
        var out22 = yamasemi_parser2( out21, [
            // a..b
            { lr:'->', src:['expr:',   '.:..', 'expr:'  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(range '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['ident:',  '.:..', 'expr:'  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(range '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:',   '.:..', 'ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(range '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['ident:',  '.:..', 'ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(range '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },

            // 10.{{ ... }}
            { lr:'->', src:['expr:',  '.:.', 'loop_body:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(each '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['ident:', '.:.', 'loop_body:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(each '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },

            // { aaa }() ;
            { lr:'->', src:['func_body:','func_call?:'   ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(call '+_tbl[_i].rt+' [ '+_tbl[_i+1].rt+' ] )'};} },

            // aaa() ; aaa[] ;
            { lr:'->', src:['ident:',    'func_call?:'   ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(call '+_tbl[_i].rt+' [ '+_tbl[_i+1].rt+' ] )'};} },
            { lr:'->', src:['ident:',    'table_select?:'], fn:function(_tbl,_i){return{lt:'expr:', rt:'(at '  +_tbl[_i].rt+' '  +_tbl[_i+1].rt+' )'  };} },
            { lr:'->', src:['expr:',     'func_call?:'   ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(call '+_tbl[_i].rt+' [ '+_tbl[_i+1].rt+' ] )'};} },
            { lr:'->', src:['expr:',     'table_select?:'], fn:function(_tbl,_i){return{lt:'expr:', rt:'(at '  +_tbl[_i].rt+' '  +_tbl[_i+1].rt+' )'  };} },
            { lr:'->', src:['table_select?:',  'table_select?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(at [ '  +_tbl[_i].rt + ' ] '  +_tbl[_i+1].rt+' )'  };} },

            // aaa.bbb()
            { lr:'->', src:['ident:', 'dot_ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(call (. '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' ) [ '+_tbl[_i+2].rt+' ] )'};} },
            { lr:'->', src:['expr:',  'dot_ident:', 'func_call?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(call (. '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' ) [ '+_tbl[_i+2].rt+' ] )'};} },

            // aaa.bbb
            { lr:'->', src:['ident:', 'dot_ident:'    ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },
            { lr:'->', src:['ident:', '.:.', 'expr:'  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. '+_tbl[_i].rt+' .'+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:',  'dot_ident:'    ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },
            { lr:'->', src:['expr:',  '.:.', 'expr:'  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(. '+_tbl[_i].rt+' .'+_tbl[_i+2].rt+' )'};} },

            // ( ... )
            { lr:'->', src:['func_call?:'               ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(scope { '+_tbl[_i].rt+' } )'};} },

            // [ ... ]
            { lr:'->', src:['table_select?:'            ], fn:function(_tbl,_i){return{lt:'expr:', rt:'[ '+_tbl[_i].rt+' ]'};} },

            // {{ ... }}
            { lr:'->', src:['loop_body:'                  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(loop '+_tbl[_i].rt+' )'};} }
        ] ) ;

        var out3 = yamasemi_parser2( out22, [

            { lr:'->', src:['dot_ident:'              ], fn:function(_tbl,_i){return{lt:'ident:', rt:_tbl[_i].rt};} },

            { lr:'<-', src:['x:++', 'ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(++ '+_tbl[_i+1].rt+' )'};} },
            { lr:'<-', src:['x:--', 'ident:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(-- '+_tbl[_i+1].rt+' )'};} },

            { lr:'<-', src:['ident:', 'x:='   ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'= '  +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:*='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'*= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:/='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'/= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:%='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'%= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:+='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'+= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:-='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'-= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:&='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'&= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:|='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'|= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:^='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'^= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:<<=' ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'<<= '+_tbl[_i].rt };} },
            { lr:'<-', src:['ident:', 'x:>>=' ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'>>= '+_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:='   ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'= '  +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:*='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'*= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:/='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'/= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:%='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'%= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:+='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'+= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:-='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'-= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:&='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'&= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:|='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'|= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:^='  ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'^= ' +_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:<<=' ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'<<= '+_tbl[_i].rt };} },
            { lr:'<-', src:['expr:',  'x:>>=' ], fn:function(_tbl,_i){return{ lt:'set_var:', rt:'>>= '+_tbl[_i].rt };} },

            { lr:'->', src:['ident:', '::::'   ], fn:function(_tbl,_i){return{lt:'define:',       rt:_tbl[_i].rt };} },
            { lr:'->', src:['ident:', ':::'    ], fn:function(_tbl,_i){return{lt:'const-define:', rt:_tbl[_i].rt };} },

            // catch aaa ->> { ... } ; catch aaa ->> 99 ;
            { lr:'->', src:['catch:catch', 'ident:', 'x:->>', 'func_body:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(->> '+_tbl[_i+1].rt+' '+_tbl[_i+3].rt+' )' };} },
            { lr:'->', src:['catch:catch', 'ident:', 'x:->>', 'expr:'      ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(->> '+_tbl[_i+1].rt+' '+_tbl[_i+3].rt+' )' };} },

            // aaa ->> { ... } ; aaa ->> 99 ;
            { lr:'->', src:['ident:', 'x:->>', 'func_body:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(->> '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )' };} },
            { lr:'->', src:['ident:', 'x:->>', 'expr:'      ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(->> '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )' };} },

            // repeat aaa <<- { ... } ; label aaa <<- { ... } ;
            { lr:'->', src:['repeat:repeat', 'ident:', 'x:<<-', 'func_body:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(<<- '+_tbl[_i+1].rt+' '+_tbl[_i+3].rt+' )' };} },
            { lr:'->', src:['label:label',   'ident:', 'x:<<-', 'func_body:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(<<- '+_tbl[_i+1].rt+' '+_tbl[_i+3].rt+' )' };} },
            { lr:'->', src:['ident:', 'x:<<-', 'func_body:'                  ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(<<- '+_tbl[_i  ].rt+' '+_tbl[_i+2].rt+' )' };} },

            { lr:'->', src:['ident:'           ], fn:function(_tbl,_i){return{lt:'expr:', rt:_tbl[_i].rt };} },

            { lr:'->', src:['expr:', 'x:*',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(* ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:/',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(/ ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:%',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(% ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:+',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(+ ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },  // todo: -> '(call (. aa .add ) [ bb ] )'
            { lr:'->', src:['expr:', 'x:-',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(- ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },  // todo: -> '(call (. aa .sub ) [ bb ] )'
            { lr:'->', src:['expr:', 'x:&',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(& ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:|',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(| ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:^',  'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(^ ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:<<', 'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(<< '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },  // todo: -> '(call (. aa .push ) [ bb ] )'
            { lr:'->', src:['expr:', 'x:>>', 'expr:' ], fn:function(_tbl,_i){return{ lt:'expr:', rt:'(>> '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },

            { lr:'->', src:['expr:', 'x:<',  'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(< ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:>',  'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(> ' +_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:<=', 'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(<= '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:>=', 'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(>= '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:==', 'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(== '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['expr:', 'x:!=', 'expr:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(!= '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['condition:', 'x:&&', 'condition:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(&& '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['condition:', 'x:||', 'condition:' ], fn:function(_tbl,_i){return{ lt:'condition:', rt:'(|| '+_tbl[_i].rt+' '+_tbl[_i+2].rt+' )'};} },

            { lr:'->', src:['set_var:', 'expr:'          ], fn:function(_tbl,_i){return{lt:'expr:', rt:'('+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },
            { lr:'->', src:['set_var:', 'func_body:'     ], fn:function(_tbl,_i){return{lt:'expr:', rt:'('+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },
            { lr:'->', src:['set_var:', 'func_call?:'    ], fn:function(_tbl,_i){return{lt:'expr:', rt:_tbl[_i].rt };} },
            { lr:'->', src:['set_var:', 'table_select?:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:_tbl[_i].rt };} },

            // {{ ... }}
//            { lr:'->', src:['loop_body:'                  ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(loop '+_tbl[_i].rt+' )'};} },

            { lr:'<-', src:['const-define:', 'expr:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(: '+_tbl[_i].rt+' '+_tbl[_i+1].rt  + ' )'};} },
            { lr:'<-', src:['const-define:', 'enum-list:' ], fn:enum_def_f, dis:'expr:'  },
            { lr:'<-', src:['const-define:', 'func_body:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(: '+_tbl[_i].rt+' '+_tbl[_i+1].rt  + ' )'};} },
            { lr:'<-', src:['define:', 'expr:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(:: '+_tbl[_i].rt+' '+_tbl[_i+1].rt  + ' )'};} },
            { lr:'<-', src:['define:', 'enum-list:' ], fn:enum_def_f, dis:'expr:'  },
            { lr:'<-', src:['define:', 'func_body:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(:: '+_tbl[_i].rt+' '+_tbl[_i+1].rt  + ' )'};} },
            { lr:'<-', src:['func_body:'            ], fn:function(_tbl,_i){return{lt:'expr:', rt:_tbl[_i].rt } ;} },

            { lr:'->', src:['expr:', '::::', 'expr:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(:: '+_tbl[_i].rt+' '+_tbl[_i+2].rt  + ' )'};} },
            { lr:'->', src:['expr:', ':::',  'expr:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(: '  + _tbl[_i].rt+' '+_tbl[_i+2].rt  + ' )'};} },

            { lr:'->', src:['expr:', ',:,'              ], fn:function(_tbl,_i){return{lt:'arg-list:', rt:'(, ' + _tbl[_i].rt + ' )'};} },
            { lr:'->', src:['arg-list:', 'arg-list:'    ], fn:function(_tbl,_i){return{lt:'arg-list:', rt:_tbl[_i].rt+' '+_tbl[_i+1].rt };} },
            { lr:'->', src:['arg-list:', 'expr:'        ], fn:function(_tbl,_i){return{lt:'arg-list:', rt:_tbl[_i].rt+' '+_tbl[_i+1].rt };} },

            { lr:'<-', src:['define:', 'arg-list:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(:: '+_tbl[_i].rt+' '+_tbl[_i+1].rt+' )'};} },

            { lr:'->', src:['enum:', ',:,'              ], fn:function(_tbl,_i){return{lt:'enum-list:', rt:_tbl[_i].rt };} },
            { lr:'->', src:['enum-list:', 'enum-list:'  ], fn:function(_tbl,_i){return{lt:'enum-list:', rt:_tbl[_i].rt+' '+_tbl[_i+1].rt };} },
            { lr:'->', src:['enum-list:', 'enum:'       ], fn:function(_tbl,_i){return{lt:'enum-list:', rt:_tbl[_i].rt+' '+_tbl[_i+1].rt };} },

            { lr:'->', src:['break:break', 'ident:', 'expr:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(break ' + _tbl[_i+1].rt+' '+_tbl[_i+2].rt+' '+_tbl[_i+3].rt+' )'};}  },
            // break[ ... ]
            { lr:'->', src:['break:break',   'expr:'         ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(break '+_tbl[_i+1].rt+' )'};} },
            // return[ ... ]
            { lr:'->', src:['return:return', 'expr:'         ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(return '     + _tbl[_i+1].rt+' )'};} },
            // continue name[ ... ]
            { lr:'->', src:['continue:continue', 'ident:', 'expr:' ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(continue '+_tbl[_i+1].rt+' '+_tbl[_i+2].rt+' )'};} },
            { lr:'->', src:['continue:continue'                    ], fn:function(_tbl,_i){return{lt:'statement:', rt:'(continue )'};} },

            // a==b ?? ccc !! ddd
            { lr:'<-', src:['condition:', 'x:??', 'expr:', 'x:!!', 'expr:'           ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } { '+_tbl[_i+4].rt+' } )'};} },
            { lr:'<-', src:['condition:', 'x:??', 'expr:', 'x:!!', 'statement:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } { '+_tbl[_i+4].rt+' } )'};} },
            { lr:'<-', src:['condition:', 'x:??', 'statement:', 'x:!!', 'expr:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } { '+_tbl[_i+4].rt+' } )'};} },
            { lr:'<-', src:['condition:', 'x:??', 'statement:', 'x:!!', 'statement:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } { '+_tbl[_i+4].rt+' } )'};} },

            { lr:'<-', src:['condition:', 'x:??', 'expr:'      ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } )'};} },
            { lr:'<-', src:['condition:', 'x:??', 'statement:' ], fn:function(_tbl,_i){return{lt:'expr:', rt:'(?? '+_tbl[_i].rt+' { '+_tbl[_i+2].rt+' } )'};} },
            { lr:'->', src:['condition:'                       ], fn:function(_tbl,_i){return{lt:'expr:', rt:_tbl[_i].rt };} }
        ] ) ;


        // この時点で、文（statment:）か、式（expr:）以外のが残っているなら、それは syntax-error
        for ( var i in out3 )
            if ( out3[i].lt !== 'expr:' && out3[i].lt !== 'statement:' && out3[i].lt !== 'arg-list:' && out3[i].lt !== 'debug-line:')
                throw 'syntax-error: \'' +out3[i].rt+'\''+ (debug_line==='' ? '' : "\n\t"+debug_line) ;

        // 出力
        var out4a = '' ;
        for ( var i in out3 ) {{
            out4a += (out4a===''?'':' ') + out3[i].rt + (('dbln' in out3[i])?out3[i].dbln+' ':'') ;
        }}

        return out4a ;
    }

    //-------------------------------------
    // コメントを削除
    var com_del_str = (function comment_del( _tx )
    {
        var out1 = "" ;
        for ( var i=0 ; i<_tx.length ; i++ ) {{

            switch ( _tx[i] ) {
                case "'" : out1 += 's' ; break ;
                case '"' : out1 += 'S' ; break ;
                case "/" : out1 += 'b' ; break ;
                case "-" : out1 += 'b' ; break ;
                case "." : out1 += 'b' ; break ;
                case "\n": out1 += 'e' ; break ;
                default  : out1 += ' ' ; break ;
            }
        }}

        // 文字列 '', "" の処理
        var out2 = "" ;
        var mode = ' ' ;
        for ( var i=0 ; i<out1.length ; i++  ) {{

            switch ( out1[i] ) {
                case 's' :
                    if ( mode === 's' ) mode = ' ' ;
                    else                mode = 's' ;
                    break ;
                case 'S' :
                    if ( mode === 'S' ) mode = ' ' ;
                    else                mode = 'S' ;
                    break ;
            } ;
            if ( mode !== ' ' ) out2 += mode ;
            else                out2 += out1[i] ;
        }}

        // コメントの削除処理
        var out3 = "" ;
        mode = ' ' ;
        for ( var i=0 ; i<out2.length ; i++  ) {{

            c = out2[i] ;
            switch ( mode+c ) {
                case ' b' :
                case 'eb' :
                {
                    if ( _tx.substr( i, 2 ) === "//"  ) c = 'c' ;
                    if ( _tx.substr( i, 3 ) === "---" ) c = 'c' ;
                    if ( _tx.substr( i, 3 ) === "..." ) c = 'c' ;
                    break ;
                }
            }

            switch ( c ) {
                case 'c' :
                    mode = 'c' ;
                    break ;
                case 'e' :
                    mode = ' ' ;
                    break ;
            }

            if ( mode === ' ' ) out3 += _tx[i] ;
        }}

        return out3 ;
    })( _txt ) ;

    // 字句解析
    function token_list(_str)
    {
        var out1 = "" ;
        for ( var i=0 ; i<_str.length ; i++ ) {{

            switch( _str[i] )
            {
                case "\n" : out1 += 'L' ; break ;
                case " " : out1 += ' ' ; break ;
                case "!" : out1 += 'x' ; break ;
                case '"' : out1 += 'S' ; break ;
                case "#" : out1 += 'a' ; break ;
                case "$" : out1 += 'x' ; break ;
                case "%" : out1 += 'x' ; break ;
                case "&" : out1 += 'x' ; break ;
                case "'" : out1 += 's' ; break ;
                case "(" : out1 += '(' ; break ;
                case ")" : out1 += ')' ; break ;
                case "*" : out1 += 'x' ; break ;
                case "+" : out1 += 'x' ; break ;
                case "," : out1 += ',' ; break ;
                case "-" : out1 += 'x' ; break ;
                case "." : out1 += '.' ; break ;
                case "/" : out1 += 'x' ; break ;
                case "0" : out1 += '0' ; break ;
                case "1" : out1 += '0' ; break ;
                case "2" : out1 += '0' ; break ;
                case "3" : out1 += '0' ; break ;
                case "4" : out1 += '0' ; break ;
                case "5" : out1 += '0' ; break ;
                case "6" : out1 += '0' ; break ;
                case "7" : out1 += '0' ; break ;
                case "8" : out1 += '0' ; break ;
                case "9" : out1 += '0' ; break ;
                case ":" : out1 += ':' ; break ;
                case ";" : out1 += ';' ; break ;
                case "<" : out1 += 'x' ; break ;
                case "=" : out1 += 'x' ; break ;
                case ">" : out1 += 'x' ; break ;
                case "?" : out1 += 'x' ; break ;
                case "@" : out1 += 'x' ; break ;
                case "A" : out1 += 'a' ; break ;
                case "B" : out1 += 'a' ; break ;
                case "C" : out1 += 'a' ; break ;
                case "D" : out1 += 'a' ; break ;
                case "E" : out1 += 'a' ; break ;
                case "F" : out1 += 'a' ; break ;
                case "G" : out1 += 'a' ; break ;
                case "H" : out1 += 'a' ; break ;
                case "I" : out1 += 'a' ; break ;
                case "J" : out1 += 'a' ; break ;
                case "K" : out1 += 'a' ; break ;
                case "L" : out1 += 'a' ; break ;
                case "M" : out1 += 'a' ; break ;
                case "N" : out1 += 'a' ; break ;
                case "O" : out1 += 'a' ; break ;
                case "P" : out1 += 'a' ; break ;
                case "Q" : out1 += 'a' ; break ;
                case "R" : out1 += 'a' ; break ;
                case "S" : out1 += 'a' ; break ;
                case "T" : out1 += 'a' ; break ;
                case "U" : out1 += 'a' ; break ;
                case "V" : out1 += 'a' ; break ;
                case "W" : out1 += 'a' ; break ;
                case "X" : out1 += 'a' ; break ;
                case "Y" : out1 += 'a' ; break ;
                case "Z" : out1 += 'a' ; break ;
                case "[" : out1 += '[' ; break ;
                case "\\" : out1 += 'x' ; break ;
                case "]" : out1 += ']' ; break ;
                case "^" : out1 += 'x' ; break ;
                case "_" : out1 += 'a' ; break ;
                case "`" : out1 += 'x' ; break ;
                case "a" : out1 += 'a' ; break ;
                case "b" : out1 += 'a' ; break ;
                case "c" : out1 += 'a' ; break ;
                case "d" : out1 += 'a' ; break ;
                case "e" : out1 += 'a' ; break ;
                case "f" : out1 += 'a' ; break ;
                case "g" : out1 += 'a' ; break ;
                case "h" : out1 += 'a' ; break ;
                case "i" : out1 += 'a' ; break ;
                case "j" : out1 += 'a' ; break ;
                case "k" : out1 += 'a' ; break ;
                case "l" : out1 += 'a' ; break ;
                case "m" : out1 += 'a' ; break ;
                case "n" : out1 += 'a' ; break ;
                case "o" : out1 += 'a' ; break ;
                case "p" : out1 += 'a' ; break ;
                case "q" : out1 += 'a' ; break ;
                case "r" : out1 += 'a' ; break ;
                case "s" : out1 += 'a' ; break ;
                case "t" : out1 += 'a' ; break ;
                case "u" : out1 += 'a' ; break ;
                case "v" : out1 += 'a' ; break ;
                case "w" : out1 += 'a' ; break ;
                case "x" : out1 += 'a' ; break ;
                case "y" : out1 += 'a' ; break ;
                case "z" : out1 += 'a' ; break ;
                case "{" : out1 += '{' ; break ;
                case "|" : out1 += 'x' ; break ;
                case "}" : out1 += '}' ; break ;
                case "~" : out1 += 'x' ; break ;
                default  : out1 += ' ' ; break ;
            }
        }}

        // 文字列 string  '', "" の処理
        var out2 = "" ;
        var mode = ' ' ;
        for ( var i=0 ; i<out1.length ; i++ ) {{

            switch ( out1[i] ) {
                case 's' :
                    if      ( mode === 's' ) mode = ' ' ;
                    else if ( mode !== 'S' ) mode = 's' ;
                    break ;
                case 'S' :
                    if      ( mode === 'S' ) mode = ' ' ;
                    else if ( mode !== 's' ) mode = 'S' ;
                    break ;
            } ;

            // ident aaa000
            if      ( mode === ' ' && i>0 && out1[i-1] === 'a' && out1[i] === '0' ) mode = 'a' ;
            else if ( mode === 'a' && out1[i] !== 'a' && out1[i] !== '0' ) mode = ' ' ;

            if ( mode !== ' ' ) out2 += mode ;   // string
            else                out2 += out1[i] ;

        }}

        // 単語単位に分解し、tblに登録
        var out3 = '' ;
        var wd   = '' ;
        mode = out2[0] ;
        var tbl = [] ;

        // 先に１行だけ　line 情報出力
        var line = 1 ;
        for ( var j=0 ; j<out2.length ; j++ )
            if ( out2[j] === 'L' ) break ;

        var s = _str.substr(0, j) ;
        s = s.split('"').join("'"); // " -> '
        if ( s!=='' )
            tbl.push( { lt:'line:', rt:''+line+': '+s } ) ;

        for ( var i=0 ; i<out2.length ; i++ )
        {{
            if ( mode === out2[i] ) {
                wd += _str[i] ;
            }
            else {
                if ( mode!==" " ) {
                    if ( mode === 'L' ) {
                        // 改行 line 情報を出力
                        for ( var j=i ; j<out2.length ; j++ )
                            if ( out2[j] === 'L' ) break ;

                        var s = _str.substr(i, j-i) ;
                        s = s.split('"').join("'"); // " -> '
                        if ( s!=='' )
                            tbl.push( { lt:'line:', rt:''+line+': '+s } ) ;
                    }
                    else {
                        if ( mode==='(' || mode===')' || mode==='[' || mode===']' )
                            for ( var j=0 ; j<wd.length ; j++ )
                                tbl.push( { lt:mode+':', rt:mode } ) ;
                        else
                            tbl.push( { lt:mode+':', rt:wd } ) ;
                    }
                }
                wd   = _str[i] ;
                mode = out2[i] ;
            }

            if ( out2[i] === 'L' )
                line ++ ;
        }}
        if ( mode!==" " && mode!=="L" ) {
            tbl.push( { lt:mode+':', rt:wd } ) ;
        }

        // 文字列 "" -> ''
        for ( var j in tbl )
        {{
            if ( tbl[j].lt !== 'S:' ) continue ;

            // Hit S:
            var s = tbl[j].rt.substr( 1, tbl[j].rt.length-2 ) ;
            var ss = s.split('\\\\') ;

            for ( var k in ss )
            {{
                ss[k] = ss[k].split('\\n').join('\n') ; // \n
                ss[k] = ss[k].split('\\t').join('\t') ; // \t
            }}
            // for k

            tbl[j].lt = 'S:' ;
            tbl[j].rt = "'" + ss.join('\\') +  "'" ;
        }}
        // for j

        return tbl ;

    } ;
    var token_tbl = token_list( com_del_str ) ;

    // "AAA{BBB}CCC" -> "AAA"+BBB+"CCC"
    var token_tbl2 = [] ;
    for ( var i in token_tbl )
    {{
        tkn = token_tbl[i] ;
        if ( tkn.lt !== 'S:' )
        {
            token_tbl2.push( tkn ) ;
            continue ;
        }

        // Hit S:
        var s = tkn.rt.split('{}').join('') ;
        s = s.split('{').join("'+(") ;
        s = s.split('}').join(").str+'") ;
        var tl = token_list( s ) ;
        for ( var j in tl )
        {{
            if ( tl[j].lt === 'S:' )
                tl[j].lt = 's:' ;
            token_tbl2.push( tl[j] ) ;
        }}
    }}

    // 構文解析
    try {
        var s_list = yamasemi_parser( token_tbl2, _flag ) ;
    }
    catch ( e ) {
        s_list = e ;
    }

    return s_list ;
}
