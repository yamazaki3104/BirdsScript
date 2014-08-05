/*

https://github.com/yamazaki3104/BirdsScript

Copyright (c) YAMAZAKI Satoshi. All rights reserved.

KAWASEMI INTERPRETER 1.0 for Javascript

*/
//-------------------------------------
function kawasemi_interpreter( _txt )
{
    //-------------------------------------
    //
    var  g_token_tbl = [] ;
    var  g_stack_tbl = [] ;

    var  g_err_list  = [] ; // error list
    var  g_output    = "" ;

    var  debug_line  = '' ;

    /*-------------------------------------
        _mode,     _type,       _val
        '[event]', 'error',     'syntax-error : '+_str,
        '[event]', 'exception', _name:func
        '[event]', 'break',     list-object
        '[event]', 'continue',  null
        '[event]', 'return',    list-object

        '[stack]', 'list',      [], _name:'', _const:false
    */

    //-------------------------------------
    // null
    function get_null()
    {
        return { _mode:'[stack]', _type:'list', _val:[], _name:'', _const:false, _prototype:'null' } ; // null
    }

    //-------------------------------------
    //
    function clone( _v ) {
    //     return _v ;
    // }
    // function clone2( _v ) {
        if ( _v._prototype )
            return { _mode:_v._mode, _type:_v._type, _val:_v._val, _name:_v._name, _const:_v._const, _prototype:_v._prototype } ;
        else
            return { _mode:_v._mode, _type:_v._type, _val:_v._val, _name:_v._name, _const:_v._const } ;
    }

    //-------------------------------------
    // デストラクタの実行（再帰する）
    function list_dtor( _lst ) {
        for ( var i in _lst ) {{
            var it = _lst[i] ;

            if ( it._type === 'list' ) {
                list_dtor( it._val ) ;
            }
            else if ( it._mode === '[catch]' && it._type === 'func_no' && it._name === 'on_dtor' ) {
                // デストラクタの実行
                kawa_parser( g_token_tbl[ it._val ] ) ;
            }
        }}
    }

    //-------------------------------------
    // block scope / func scope の開放（デストラクタの実行もする）  dtorやcatchの実行結果を返す
    function g_stack_pop_and_dotr_and_catch( _pos, _ev, _catch_flg ) {

        var r = _ev ;

        for ( ; g_stack_tbl.length > _pos ; ) {{
            var it = g_stack_tbl.pop() ;

            if ( it._mode==='[catch]' && _ev._mode==='[event]' && it._name===_ev._name ) {

                // throw -> catch
                if ( it._type === 'func_no' ) {

                    // _ev._val が Array なら引数として積む  .a -> _a
                    var ls = _ev._val ;
                    if ( ls instanceof Array ) {
                        for ( var j in ls ) {{
                            var lss = clone( ls[j] ) ;
                            if ( lss._name[0] === '.' )
                                lss._name = '_' + lss._name.substr( 1, lss._name.length-1 ) ;
                            g_stack_tbl.push( lss ) ;
                        }}
                    }
                    // catch func 実行
                    return kawa_parser( g_token_tbl[ it._val ] ) ;
                    // あれ？ 引数を積んだg_stack_tbl.push をもどしていないけどいいの？？戻った先で消し pop ているの？確認すること。
                }
                else {
                    // catch literal は listに入れて返す
                    var r2 = { _mode:'[stack]', _type:'list', _val:[], _name:'literal', _const:false, _prototype:'catch' } ;
                    it._this = r2 ;
                    r2._val.push( it ) ;

                    return r2 ;
                }
            }
            else if ( it._mode === '[catch]' && it._name === 'on_dtor' ) {
                // デストラクタの実行
                if ( it._type === 'func_no' )
                    // to do check １つのオブジェクトを複数で参照しているときに、複数回デストラクタが動いてしまう問題がある。解決すること。
                    return kawa_parser( g_token_tbl[ it._val ] ) ;
                else
                    // literal は listに入れて返す
                    return { _mode:'[stack]', _type:it._type, _val:it._val, _name:'literal', _const:false, _prototype:'on_dtor' } ;
            }
            else if ( it._type === 'list' ) {
                list_dtor( it._val ) ;
            }
        }}

        return r ;
    }

    //-------------------------------------
    // 構文解析
    function kawa_parser( _token_list )
    {
        if ( !_token_list ) return [] ; // undefined の確認。なぜか[]ではなくundefinedが来る

        //-------------------------------------
        // 実行時エラー run-time error
        function run_time_error( _str ) {
            return { _mode:'[event]', _type:'run-time error', _val:_str, debug_line:debug_line } ;
        }

        //-------------------------------------
        //
        function get_var( _v ) {
            if ( _v._type === 'list_no' ) { // list_no の場合、実行して list にする

                var arg_it = g_stack_tbl.length ;
                var r = kawa_parser( g_token_tbl[_v._val] ) ;
                var out = g_stack_pop_and_dotr_and_catch( arg_it, r, true ) ; // g_stack_tbl を削る dtorやcatchを実行
                if ( out._mode === '[event]' ) return out ;

                for ( var it in out._val ) {{
                    if ( out._val[it]._mode === '[stack]' && out._val[it]._name[0] !== '.' )
                        out._val[it]._name = '.' + out._val[it]._name ;
                }}

                return out ;
            }

            if ( _v._type !== 'ident' )
                return _v ;

            // global stack から探す
            for ( var i=g_stack_tbl.length-1 ; i>=0 ; i-- )
                if ( g_stack_tbl[i]._mode === '[stack]' )
                    if ( g_stack_tbl[i]._name === _v._val )
                        return g_stack_tbl[i] ;

            var o = clone( _v ) ; o._name = '_' ;
            return {
                _mode:'[event]', _type:'exception', _name:'on_undefined', debug_line:(debug_line===''?'':debug_line),
                _val:[
                    { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'undefined symbol.: '+_v._val },
                    o
                ]
            } ;
        }

        //-------------------------------------
        //
        function exp( _c, _v1, _v2 ) {

            var v2 = get_var( _v2 ) ;
            if ( v2._mode === '[event]' )
                return v2 ;

            if ( v2._type !== 'int' )
                return run_time_error( 'variable type mismatch.: ' + format_var( v2 ) ) ;

            var o = false ;
            if ( _v1._type !== 'ident' ) {
                o = _v1 ; // リファレンス（クローンしたら値が更新されないから）を返す
            }
            else {
                for ( var i=g_stack_tbl.length-1 ; i>=0 ; i-- ) {{
                    if ( g_stack_tbl[i]._name === _v1._val ) {
                        o = g_stack_tbl[i] ; // リファレンス（クローンしたら値が更新されないから）を返す
                        break ;
                    }
                }}
            }
            if ( o !== false ) {
                if ( o._const === true  )
                    return run_time_error( 'cannot be set to a read-only property.: ' + o._name+'.'+o._type ) ;

                if ( o._type  !== 'int' )
                    return run_time_error( 'variable type mismatch.: ' + format_var( o ) ) ;

                if ( _c === '*='  ) { o._val *= v2._val ; return clone( o ) ; } ;
                if ( _c === '/='  ) {
                    if ( v2._val === 0 ) {
                        var o1 = clone( o ) ;  o1._name = '_' ;    // _
                        var o2 = clone( v2 ) ; o2._name = '_idx' ; // _idx
                        return {
                            _mode:'[event]', _type:'exception', _name:'on_division_by_zero', debug_line:(debug_line===''?'':debug_line),
                            _val:[ { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'division by zero.: '+format_detail_var(o)+' /= 0' }, o1, o2 ]
                        } ;
                    }
                    o._val = Math.floor(o._val/v2._val) ;
                    return clone( o ) ;
                } ;
                if ( _c === '%='  ) {
                    if ( v2._val === 0 ) {
                        var o1 = clone( o ) ;  o1._name = '_' ;    // _
                        var o2 = clone( v2 ) ; o2._name = '_idx' ; // _idx
                        return {
                            _mode:'[event]', _type:'exception', _name:'on_division_by_zero', debug_line:(debug_line===''?'':debug_line),
                            _val:[ { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'division by zero.: '+format_detail_var(o)+' %= 0' }, o1, o2 ]
                        } ;
                    }
                    o._val %= v2._val ;
                    return clone( o ) ;
                } ;
                if ( _c === '+='  ) { o._val += v2._val ; return clone( o ) ; } ;
                if ( _c === '-='  ) { o._val -= v2._val ; return clone( o ) ; } ;
            }

            o = clone( _v1 ) ; o._name = '_' ;
            return {
                _mode:'[event]', _type:'exception', _name:'on_undefined', debug_line:(debug_line===''?'':debug_line),
                _val:[
                    { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'undefined symbol.: '+_v1._val },
                    o
                ]
            } ;
        }

        //-------------------------------------
        //
        function format_var( _v ) {

            if ( _v._type === 'int' || _v._type === 'str' || _v._type === 'bool' )
                return _v._val ;

            if ( _v._type === 'list' ) {
                var r = '[ ' ;
                for ( var j in _v._val ) {
                    var vv = _v._val[j] ;
                    if ( vv._mode==='[stack]' && vv._name[0] === '.' )
                        r += format_var( get_var( vv ) ) + ', ' ;
                }
                r += ']' ;
                return r ;
            }
            if ( _v._type === 'func_no' ) {
                // func_no は実行しないとメンバに何があるかとかわからないのでなにも表示できない・・・どうしたものかと
                return '{ }' ;
            }

            return _v._type ;
        }

        //-------------------------------------
        //
        function format_detail_var( _v ) {

            if ( _v._type === 'str' )
                return _v._name+":'"+_v._val + "'.str" ;

            if ( _v._type === 'int' || _v._type === 'bool' )
                return _v._name+":"+_v._val+"."+_v._type ;

            if ( _v._type === 'list' ) {
                var r = _v._name+':[ ' ;
                for ( var j in _v._val ) {
                    var vv = _v._val[j] ;
                    if ( vv._mode==='[stack]' )
                        r += format_detail_var( get_var( vv ) ) + ', ' ;
                }
                r += ']' ;
                if ( _v._prototype )
                    r += '.' + _v._prototype ;
                return r ;
            }

            if ( _v._type === 'func_no' ) {
                // func_no は実行しないとメンバに何があるかとかわからないのでなにも表示できない・・・どうしたものかと
                return (_v._name?_v._name:'literal')+':{ }' ;
            }

            return _v._name+":"+_v._val+"."+_v._type ;
        }

        //-------------------------------------
        //
        function var_to_string( _v ) {

            if ( _v._type === 'str' )
                return _v._val ;

            if ( _v._type === 'int' || _v._type === 'bool' )
                return ''+_v._val ;

            if ( _v._type === 'list' ) {
                var r = '[ ' ;
                for ( var j in _v._val ) {
                    var vv = _v._val[j] ;
                    if ( vv._mode==='[stack]' )
                        r += var_to_string( get_var( vv ) ) + ', ' ;
                }
                r += ']' ;
                return r ;
            }

            if ( _v._type === 'func_no' ) {
                // func_no は実行しないとメンバに何があるかとかわからないのでなにも表示できない・・・どうしたものかと
                return '{ }' ;
            }

            return '' ;
        }

        //-------------------------------------
        // ここから本体（上は内部関数群）

        var local_token = [] ;

        // 括弧 () で分割。
        for ( var i=0 ; i<_token_list.length ; i++ ) {{
            var tkn = _token_list[i] ;
            if ( tkn._type !== 'ident' || tkn._val !== ')' ) {
                local_token.push( tkn ) ;
                continue ;
            }

            // '(xx' まで local_token から tmp に移動
            var tmp = [] ;
            for ( var ii=local_token.length-1 ; ii>=0 ; --ii ) {{
                var c = local_token.pop() ;
                tmp.unshift( c ) ;
                if ( c._type==='ident' && c._val[0]==='(' )
                    break ;
            }}

            if ( tmp.length <= 0 ) continue ;

            // ステートメントごとに分割＆実行
            tkn = tmp[0]._val ;

            if ( tkn === '(scope' ) {
                // (scope { xxx } )  <-  ( xxx )
                // event処理を追加のために func 呼び出しに変更

                var stack_label = g_stack_tbl.length ;
                var r = kawa_parser( g_token_tbl[ tmp[1]._val ] ) ;
                // r には local_stack の値が Array としても入るし、[event] オブジェクトとしても返る
                var out = g_stack_pop_and_dotr_and_catch( stack_label, r, false ) ; // g_stack_tbl を削る dtorやcatchを実行
                if ( out._mode === '[event]' ) return out ;

                // (scope ) は list-object の最後の object を１つ返す
                if ( out._type === 'list' && out._val.length > 0 )
                    local_token.push( out._val[out._val.length-1] ) ;
                else
                    local_token.push( out ) ;
            }
            else if ( tkn === '(,' ) {
                // (, xxx ) <- xxx,

                if ( tmp.length < 2 )
                    return run_time_error( 'arg_size < 2 : ' + tkn ) ;
                if ( tmp.length > 2 )
                    return run_time_error( 'arg_size > 2 : ' + tkn ) ;

                var v1 = get_var( tmp[1] ) ;
                if ( v1._mode === '[event]' ) return v1 ;
                local_token.push( clone( v1 ) )  ;
            }
            else if ( tkn === '(;' ) {
                // (; xxx ) <- xxx ;
                // 全引数を評価 get_var する(戻り値は捨てる)
                for( var j in tmp ) {{
                    if ( j === '0' ) continue ;
                    var v1 = get_var( tmp[j] ) ;
                    if ( v1._mode === '[event]' ) return v1 ;

                }}
            }
            else if ( tkn === '(at' || tkn === '(.' ) {

                // (at xxx yyy )  <-  xxx[yyy]
                // (. xxx yyy )   <-  xxx.yyy
                if ( tmp.length < 3 )
                    return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 )
                    return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                var v1 = get_var( tmp[1] ) ;
                if ( v1._mode === '[event]' ) {
                    return v1 ;
                }

                var v2 = tmp[2] ;
                if ( tkn === '(at' ) {
                    v2 = get_var( tmp[2] ) ;
                    if ( v2._mode === '[event]' ) {
                        return v2 ;
                    }
                }

                if ( v2._type === 'ident' || v2._type === 'int' ||  v2._type === 'str' ) {

                    var mat = (v2._val[0]==='.'?'':'.') + v2._val ; // 数値(int)→文字列(str)

                    // まずは組み込み関数を試す。 .type, .size, detail
                    var hit = false ;
                    if ( tkn === '(.' && mat === '.type' ) { // .type 型を文字列で返す予約メンバ
                        // hit
                        var typ = v1._type ;
                        if ( typ === 'func_no' ) typ = 'func' ;
                        hit = { _mode:'[stack]', _type:'str', _val:typ, _name:'literal', _const:false } ;
                        local_token.push( hit ) ;
                    }
                    else if ( tkn === '(.' && mat === '.size' ) { // .size 返す予約メンバ
                        // hit
                        var typ = v1._type ;
                        if ( typ === 'list' ) {
                            hit = { _mode:'[stack]', _type:'int', _val:v1._val.length, _name:'literal', _const:false } ;
                            local_token.push( hit ) ;
                        }
                        else if ( typ === 'str' ) {
                            hit = { _mode:'[stack]', _type:'int', _val:v1._val.length, _name:'literal', _const:false } ;
                            local_token.push( hit ) ;
                        }
                    }
                    else if ( tkn === '(.' && mat === '.detail' ) {
                        // hit
                        hit = { _mode:'[stack]', _type:'str', _val:format_detail_var( v1 ), _name:'literal', _const:false } ;
                        local_token.push( hit ) ;
                    }
                    else if ( tkn === '(.' && mat === '.str' ) {
                        // hit
                        hit = { _mode:'[stack]', _type:'str', _val:var_to_string(v1), _name:'literal', _const:false } ;
                        local_token.push( hit ) ;
                    }
                    else if ( tkn === '(.' && mat === '.int' ) {
                        // hit
                        hit = { _mode:'[stack]', _type:'int', _val:parseInt( v1._val, 10 ), _name:'literal', _const:false } ;
                        local_token.push( hit ) ;
                    }

                    if ( hit === false && v1._mode === '[stack]' && v1._type === 'list' ) {
                        if ( hit === false ) {
                            for ( var j in v1._val ) {
                                hit = v1._val[j] ;
                                if ( hit._name === mat ) {
                                    // hit
                                    local_token.push( hit ) ;
                                    break ; // hit
                                }
                                hit = false ;
                            }
                        }

                        if ( hit === false ) {
                            var nm = '' ;
                            // global stack から探す
                            for ( var j=g_stack_tbl.length-1 ; j>=0 ; j-- )
                                if ( g_stack_tbl[j]._mode === '[stack]' )
                                    if ( g_stack_tbl[j]._name === mat ) {
                                        hit = g_stack_tbl[j] ;
                                        break ;
                                    }
                            if ( hit !== false && hit._type === 'int' && hit._val >= 0 && hit._val < v1._val.length ) {
                                // hit
                                local_token.push( v1._val[hit._val] ) ;
                            }
                        }

                        if ( hit === false ) {
                            // list-object 内に添字が見つからないが、.unmatchはある場合の特殊処理。この処理を入れなくても、例外の通常処理でカバーできるとうれしい。
                            // '.unmatch 'がある場合は、その値を返す
                            for ( var j in v1._val ) {{
                                hit = v1._val[j] ;
                                if ( hit._name === '.unmatch' ) { // todo .unmatch ではなくunmatch にする
                                    // hit
                                    hit = clone( hit ) ;
                                    local_token.push( hit ) ;
                                    break ; // hit
                                }
                                hit = false ;
                            }}
                        }
                    }
                    if ( hit === false && v1._mode === '[stack]' && v1._type === 'func_no' ) {

                        // func + at はここを通る func[a] の a は it に乗せる
                        // 引数 it を乗せる
                        var arg_it2 = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                        var o = clone( v2 ) ; o._name = 'it' ;
                        g_stack_tbl.push( o ) ;

                        // func 実行
                        hit = kawa_parser( g_token_tbl[ v1._val ] ) ;
                        var out = g_stack_pop_and_dotr_and_catch( arg_it2, hit, false ) ; // g_stack_tbl を削る dtorやcatchを実行

                        if ( hit._mode === '[event]' ) {
                            if ( hit._type === 'return' && hit._val.length > 0 )
                                // 関数を return で抜けて返ってきた
                                local_token.push( { _mode:'[stack]', _type:'list', _val:hit._val, _name:'literal', _const:false, _prototype:mat } ) ;
                            else
                                return hit ;
                        }
                        hit._prototype = v1._name ;

                        // 関数内であたらしく生成されたメンバやメンバ関数は戻り値 list に転送。
                        for ( ; arg_it2<g_stack_tbl.length ; ) {{
                            var mem = g_stack_tbl.pop() ; // 転送なのでdtorは実行しない
                            mem._this = r ;
                            hit._val.unshift( mem ) ; // 前方からつみなおし（転送）
                        }}
                        // 引数は捨てる
                        for ( ; arg_it<g_stack_tbl.length ; ) {{
                            var mem = g_stack_tbl.pop() ; // todo check dtorの実行が必要でしょ
                        }}
                        local_token.push( hit ) ;

                    }
                    if ( hit === false ) {
                        // ここで unmatch の関数を探して、あれば実行する。（外部ライブラリ対応）
                        var m = '' + v2._val ;
                        m = '#' + m.substr( 1, m.length-1 ) ;

                        // global stack から探す
                        for ( var j=g_stack_tbl.length-1 ; j>=0 ; j-- )
                            if ( g_stack_tbl[j]._mode === '[stack]' )
                                if ( g_stack_tbl[j]._name === m ) {
                                    hit = clone( g_stack_tbl[j] ) ;
                                    break ;
                                }
                        if ( hit !== false ) {
                            if ( hit._type === 'func_no' ) {

                                // 引数を乗せる
                                var arg_it2 = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                                var o = clone( v1 ) ; o._name = '#' ;
                                g_stack_tbl.push( o ) ; // _
                                g_stack_tbl.push( { _mode:'[stack]', _type:'str', _name:'idx', _const:false, _val:v2._val } ) ; // _idx

                                // func 実行
                                hit = kawa_parser( g_token_tbl[ hit._val ] ) ;
                                var out = g_stack_pop_and_dotr_and_catch( arg_it2, hit, false ) ; // g_stack_tbl を削る dtorやcatchを実行

                                if ( hit._mode === '[event]' ) {
                                    if ( hit._type === 'return' && hit._val.length > 0 )
                                        // 関数を return で抜けて返ってきた
                                        local_token.push( { _mode:'[stack]', _type:'list', _val:hit._val, _name:'literal', _const:false, _prototype:mat } ) ;
                                    else
                                        return hit ;
                                }
                                else {
                                    // [ ] が返ってきた場合は、on_unmatch exception
                                    if ( hit._mode === '[stack]' && hit._val.length > 0 )
                                        local_token.push( hit ) ;
                                    else
                                        hit = false ;
                                }
                            }
                        }
                    }
                    if ( hit === false ) {
                        // ここで unmatch の関数を探して、あれば実行する。（外部ライブラリ対応）

                        // global stack から探す
                        for ( var j=g_stack_tbl.length-1 ; j>=0 ; j-- )
                            if ( g_stack_tbl[j]._mode === '[stack]' )
                                if ( g_stack_tbl[j]._name === 'unmatch' ) {
                                    hit = clone( g_stack_tbl[j] ) ;
                                    break ;
                                }
                        if ( hit !== false ) {
                            if ( hit._type === 'func_no' ) {

                                // 引数を乗せる
                                var arg_it2 = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                                var o = clone( v1 ) ; o._name = '_' ;
                                g_stack_tbl.push( o ) ; // _
                                g_stack_tbl.push( { _mode:'[stack]', _type:'str', _name:'_idx', _const:false, _val:v2._val } ) ; // _idx

                                // func 実行
                                hit = kawa_parser( g_token_tbl[ hit._val ] ) ;
                                var out = g_stack_pop_and_dotr_and_catch( arg_it2, hit, false ) ; // g_stack_tbl を削る dtorやcatchを実行

                                if ( hit._mode === '[event]' ) {
                                    if ( hit._type === 'return' && hit._val.length > 0 )
                                        // 関数を return で抜けて返ってきた
                                        local_token.push( { _mode:'[stack]', _type:'list', _val:hit._val, _name:'literal', _const:false, _prototype:mat } ) ;
                                    else
                                        return hit ;
                                }
                                else {
                                    // [ ] が返ってきた場合は、on_unmatch exception
                                    if ( hit._mode === '[stack]' && hit._val.length > 0 )
                                        local_token.push( hit ) ;
                                    else
                                        hit = false ;
                                }
                            }
                        }
                    }

                    if ( hit === false ) {
                        var o1 = clone( v1 ) ; o1._name = '_' ;    // _
                        return {
                            _mode:'[event]', _type:'exception', _name:'on_unmatch', debug_line:(debug_line===''?'':debug_line),
                            _val:[
                                { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'unmatch member-name.: '+mat }, // _e エラーメッセージ
                                o1, // _
                                { _mode:'[stack]', _type:'str', _name:'_idx', _const:false, _val:v2._val }  // _idx
                            ]
                        } ;
                    }
                }
                else if ( v2._type === 'list' ) {

                    // 暫定 対策中
                    if ( v1._type === 'list' && v2._type === 'list' ) {
                        // hit
                        var hit = { _mode:'[stack]', _type:'list', _val:[], _name:'literal', _const:false, _prototype:mat } ;
                        for ( var j in v2._val ) {{
                            var v2j = '.' + v2._val[j]._val ;
                            var hit_flag = false ;
                            for ( var v1j in v1._val ) {{
                                var h = v1._val[v1j] ;
                                if ( v2j === h._name ) {
                                    // hit
                                    var c = clone( h ) ;
                                    c._name = '.' + hit._val.length ;
                                    hit._val.push( c ) ;
                                    hit_flag = true ;
                                    break ;
                                }
                            }}
                            if ( hit_flag === false ) {

                                // list-object 内に添字が見つからないが、unmatchはある場合の特殊処理、この処理を入れなくても、例外の通常処理でカバーできるとうれしい。
                                // 'unmatch 'がある場合は、その値を返す
                                for ( var v1j in v1._val ) {{
                                    var h = v1._val[v1j] ;
                                    if ( h._name === '.unmatch' ) { // todo .unmatch -> unmatch
                                        // hit
                                        h = clone( h ) ;
                                        hit._val.push( h ) ;
                                        break ; // j
                                    }
                                }}
                            }
                        }}
                        local_token.push( hit ) ;

                        // todo list どうしでも hit しない場合は例外をなげるべきでしょ
                    }

                }
            }
            else if ( tkn === '(:' || tkn === '(::' || tkn === '(->>' || tkn === '(<<-' ) {
                // (: xxx yyy )   <- xxx : yyy
                // (:: xxx yyy )  <- xxx :: yyy
                // (->> xxx yyy ) <- catch xxx ->> yyy
                // (<<- xxx yyy ) <- until xxx <<- yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                var v1 = tmp[1]._val ;

                if ( tmp[1]._type !== 'ident' )
                    if ( tmp[1]._type !== 'int' ) {
                        return run_time_error( 'cannot define.: ' + v1 ) ;
                    }
                    else {
                        // 数値は文字列に変える
                        v1 = '' + v1 ;
                    }

                var v2 = get_var( tmp[2] ) ;
                if ( v2._mode === '[event]' )
                    return v2 ;

                var r = { _mode:'[stack]', _type:v2._type, _val:v2._val, _name:v1, _const:(tkn!=='(::'), _prototype:v2._prototype } ;
                if      ( tkn === '(->>' ) r._mode='[catch]' ;
                else if ( tkn === '(<<-' ) r._mode='[label]' ;

                g_stack_tbl.push( r ) ;
                local_token.push( r ) ;
            }
            else if ( tkn === '(=' ) {
                // (= xxx yyy )  <-  xxx = yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                //-------------------------------------
                // set_var
                var r = (function ( _n, _v )
                {
                    var vv = get_var( _v ) ;
                    if ( vv._mode === '[event]' )
                        return vv ;

                    if ( _n._type !== 'ident' ) {
                        if ( _n._const === true )
                            if ( _n._this._const === true )
                                return run_time_error( 'cannot be set to a read-only property.: ' + _n._this._name+'.'+_n._this._type ) ;

                        // set val
                        // _n._type が list-object の場合はデストラクタの実行が必要では？？
                        _n._val  = vv._val ;
                        _n._type = vv._type ;
                        return _n ;
                    }

                    // global stack から探す
                    var o = false ;
                    for ( var i=g_stack_tbl.length-1 ; i>=0 ; i-- ) {{
                        o = g_stack_tbl[i] ;
                        if ( o._mode === '[stack]' && o._name === _n._val )
                        {
                            if ( o._const === true )
                                return run_time_error( 'cannot be set to a read-only property.: ' + o._name+'.'+o._type ) ;
                            if ( o._type !== vv._type )
                                return run_time_error( 'type mismatch.: ' + o._name + '.' + o._type + " != " + vv._name + "." + vv._type ) ;

                            // set val
                            // o._type が list-object の場合はデストラクタの実行が必要では？？
                            o._val  = vv._val ;
                            o._type = vv._type ;

                            var r = clone( o ) ;
                            r._name = 'literal' ;

                            return r ;
                        }
                    }}

                    o = clone( _n ) ; o._name = '_' ;
                    return {
                        _mode:'[event]', _type:'exception', _name:'on_undefined', debug_line:(debug_line===''?'':debug_line),
                        _val:[
                            { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'undefined symbol.: '+_n._val },
                            o
                        ]
                    } ;
                })( tmp[1], tmp[2] ) ;

                if ( r._mode === '[event]' )
                    return r ;
                local_token.push( r ) ;
            }
            else if ( tkn === '(<<' ) {
                // (<< xxx yyy )  <-  xxx << yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                if ( tmp[1]._prototype === 'out_stream' && tmp[1]._val === '' ) // todo check 特別コード（暫定的に実装中）
                {
                    var t2 = get_var( tmp[2] ) ;
                    if ( t2._mode === '[event]' )
                        return t2 ;

                    g_output += format_var( t2 ) ; // 画面に出力する

                    local_token.push( tmp[1] ) ;
                }
                else if ( tmp[1]._type !== 'ident' )
                    return run_time_error( 'syntax-error?: ' + tkn + ' ' + format_detail_var( tmp[1] ) ) ;

                // tmp[1]._type == 'ident' ならば global stack から探す
                for ( var j=g_stack_tbl.length-1 ; j>=0 ; j-- ) {{
                    var o = g_stack_tbl[j] ;

                    if ( o._mode === '[stack]' )
                    if ( o._name === tmp[1]._val ) {
                        // hit
                        if ( o._const === true ) return run_time_error( 'cannot be set to a read-only property.: ' + o._name+'.'+o._type ) ;

                        if ( o._type === 'list' ) {
                            // 出力先がコンテナの場合
                            var t2 = get_var( tmp[2] ) ;
                            if ( t2._mode === '[event]' ) {
                                return t2 ;
                            }

                            if ( t2._name === 'literal' ) {
                                o._val.push( { _mode:t2._mode, _type:t2._type, _val:t2._val, _name:'.'+o._val.length, _const:t2._const, _this:o } ) ;
                            }
                            else {
                                // list [] << a
                                var c = clone( t2 ) ;
                                if ( c._name[0]!=='.') c._name = '.'+o._val.length ;
                                o._val.push( c ) ;
                            }
                        }
                        else {
                            // 出力先が非コンテナの場合、文字列にして追加。
                            if ( o._type === 'str' )
                                o._val  = '' + o._val + get_var( tmp[2] )._val  ;
                            else if ( o._type === 'int' ) {
                                local_token.push( { _mode:'[stack]', _type:o._type, _val:(o._val << get_var( tmp[2] )._val), _name:'literal', _const:true } ) ;
                                break ;
                            }
                        }

                        local_token.push( tmp[1] ) ;
                        break ;
                    }
                }}
            }
            else if ( tkn === '(<'  || tkn === '(>'  || tkn === '(<=' || tkn === '(>=' || tkn === '(=='
                   || tkn === '(!=' || tkn === '(&&' || tkn === '(||' || tkn === '(*'  || tkn === '(/' || tkn === '(%'
                   || tkn === '(+'  || tkn === '(-'  || tkn === '(&'  || tkn === '(|'  || tkn === '(^' || tkn === '(>>' )
            {
                // (< xxx yyy )  <-  xxx < yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                //-------------------------------------
                // cmp()
                var r = (function( _c, _v1, _v2 )
                {
                    var v1 = get_var( _v1 ) ;
                    if ( v1._mode === '[event]' ) return v1 ;

                    var v2 = get_var( _v2 ) ;
                    if ( v2._mode === '[event]' ) return v2 ;

                    if ( v1._type !== v2._type )
                        return { _mode:'[stack]', _type:'bool', _val:false, _name:'literal', _const:true } ;

                    if ( _c === '(>'  ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val >   v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(<'  ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val <   v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(>=' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val >=  v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(<=' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val <=  v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(==' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val === v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(!=' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val !== v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(&&' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val &&  v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(||' ) return  { _mode:'[stack]', _type:'bool', _val:(v1._val ||  v2._val), _name:'literal', _const:true } ;

                    if ( v1._type === 'str' && v2._type === 'str' && v1._val.length === 1 && v2._val.length === 1 ) {
                        if ( _c === '(+' ) return  { _mode:'[stack]', _type:v1._type, _val:String.fromCharCode(v1._val.charCodeAt(0) + v2._val.charCodeAt(0)), _name:'literal', _const:true } ;
                        if ( _c === '(-' ) return  { _mode:'[stack]', _type:v1._type, _val:String.fromCharCode(v1._val.charCodeAt(0) - v2._val.charCodeAt(0)), _name:'literal', _const:true } ;
                    }

                    if ( _c === '(*' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val * v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(/' ) {
                        if ( v2._val === 0 ) {
                            var o1 = clone( v1 ) ; o1._name = '_' ;    // _
                            var o2 = clone( v2 ) ; o2._name = '_idx' ; // _idx
                            return {
                                _mode:'[event]', _type:'exception', _name:'on_division_by_zero', debug_line:(debug_line===''?'':debug_line),
                                _val:[ { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'division by zero.: '+format_detail_var(v1)+' / 0' }, o1, o2 ]
                            } ;
                        }

                        return  { _mode:'[stack]', _type:v1._type, _val:Math.floor(v1._val / v2._val), _name:'literal', _const:true } ;
                    }
                    if ( _c === '(%' ) {
                        if ( v2._val === 0 ) {
                            var o1 = clone( v1 ) ; o1._name = '_' ;    // _
                            var o2 = clone( v2 ) ; o2._name = '_idx' ; // _idx
                            return {
                                _mode:'[event]', _type:'exception', _name:'on_division_by_zero', debug_line:(debug_line===''?'':debug_line),
                                _val:[ { _mode:'[stack]', _type:'str', _name:'_e', _const:false, _val:'division by zero.: '+format_detail_var(v1)+' % 0' }, o1, o2 ]
                            } ;
                        }
                        return  { _mode:'[stack]', _type:v1._type, _val:(v1._val % v2._val), _name:'literal', _const:true } ;
                    }
                    if ( _c === '(+' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val + v2._val), _name:'literal', _const:true } ;
                    if ( _c === '(-' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val - v2._val), _name:'literal', _const:true } ; // todo check 文字列の引き算は出来ないよ

                    if ( _c === '(&' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val & v2._val), _name:'literal', _const:true } ; // todo check 文字列は出来ないよ
                    if ( _c === '(|' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val | v2._val), _name:'literal', _const:true } ; // todo check 文字列は出来ないよ
                    if ( _c === '(^' ) return  { _mode:'[stack]', _type:v1._type, _val:(v1._val ^ v2._val), _name:'literal', _const:true } ; // todo check 文字列は出来ないよ
                    if ( _c === '(>>') return  { _mode:'[stack]', _type:v1._type, _val:(v1._val >> v2._val), _name:'literal', _const:true } ; // todo check 文字列は出来ないよ

                    return run_time_error( _c ) ;

                })( tkn, tmp[1], tmp[2] ) ;

                if ( r._mode === '[event]' )
                    return r ;

                local_token.push( r ) ;

            }
            else if ( tkn === '(??' ) {
                // (?? xxx { yyy } )          <-  xxx ?? yyy
                // (?? xxx { yyy } { zzz } )  <-  xxx ?? yyy !! zzz

                // if文
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 4 ) return run_time_error( 'arg_size > 4 : ' + tkn ) ;
                if ( tmp[1]._type !== 'bool' )
                    return run_time_error( 'argument type is not bool.: ' + tmp[1]._name+'.'+tmp[1]._type ) ;

                if ( tmp[1]._val===true ) {
                    // true
                    var r = kawa_parser( g_token_tbl[ tmp[2]._val ] ) ;
                    if ( r._mode === '[event]' )
                        return r ;

                    // r._val をlocal_token に積み直す　g_stack_tbl もそのまま（デストラクタも走らせない）
                    for ( var k in r._val )
                        local_token.push( r._val[k] ) ;
                }
                else if ( tmp.length === 4 ) {
                    // false
                    var r = kawa_parser( g_token_tbl[ tmp[3]._val ] ) ;
                    if ( r._mode === '[event]' )
                        return r ;
                    // r._val を local_token に積み直す　g_stack_tbl もそのまま（デストラクタも走らせない）
                    for ( var k in r._val )
                        local_token.push( r._val[k] ) ;
                }
                // else ... false は乗せないほうが直観的に使いやすいと思う
                //     local_token.push( { _mode:'[token]', _type:'bool', _val:false, _const:true } ) ; // false
            }
            else if ( tkn === '(loop' ) {
                // (loop { xxx } )  <-  {{ xxx }}

                // loop文
                if ( tmp.length < 2 ) return run_time_error( 'arg_size < 2 : ' + tkn ) ;
                if ( tmp.length > 2 ) return run_time_error( 'arg_size > 2 : ' + tkn ) ;

                var max = 999 ;

                var arg_it  = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                var out_val = { _mode:'[stack]', _type:'list', _val:[],  _name:'literal', _const:false, _prototype:'loop' } ;

                // idx
                g_stack_tbl.push( { _mode:'[stack]', _type:'int', _val:0, _name:'idx', _const:true  } ) ;

                var ech = 0 ;
                for ( ; ech<max ; ech ++ ) {{

                    // idx
                    g_stack_tbl[arg_it]._val = ech ;

                    var arg_it2 = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                    var r = kawa_parser( g_token_tbl[ tmp[1]._val ] ) ;
                    var out = g_stack_pop_and_dotr_and_catch( arg_it2, r, false ) ; // g_stack_tbl を削る  dtorやcatchを実行

                    // break check
                    if ( r._mode === '[event]' && r._type === 'break' ) {
                        // break[ hoge ] 戻り値hoge r._val を out_val (list-object)に積む
                        // 先に public なメンバ変数から転送
                        for ( var j in r._val._val ) {{
                            var rj = clone( r._val._val[j] ) ;
                            if ( rj._name[0] !== '.' ) continue ;
                            rj._this = out_val._val ;
                            rj._name = '.' + out_val._val.length ; // 数字の名前を付ける
                            out_val._val.push( rj ) ;
                        }}
                        // // 次に private なメンバ変数を転送
                        // for ( var j in r._val._val ) {{
                        //     var rj = clone( r._val._val[j] ) ;
                        //     if ( rj._name[0] === '.' ) continue ;
                        //     rj._this = out_val._val ;
                        //     out_val._val.push( rj ) ;
                        // }}
                        break ; // loop
                    }
                    // continue check
                    if ( r._mode === '[event]' && r._type === 'continue' ) {
                        continue ; // loop
                    }

                    if ( r._mode === '[event]' && out._mode !== '[event]' ) {
                        r = out ; // catch したなら処理を継続
                        break ; // loop
                    }
                    if ( r._mode === '[event]' )
                        return r ; // catch されないその他のイベントはそのまま return

                    // 戻り値 out._val を out_val (list-object)に積みなおす
                    for ( var j in out._val ) {{
                        var rj = clone( out._val[j] ) ;
                        rj._this = out_val._val ;
                        rj._name = '.' + out_val._val.length ;   // 数字の名前を付ける
                        out_val._val.push( rj ) ;
                    }}
                }}
                if ( ech >= max )
                    // exception on_loop_limit_over
                    return { _mode:'[event]', _type:'exception', _name:'on_loop_limit_over', debug_line:(debug_line===''?'':debug_line),
                        _val:[ { _mode:'[stack]', _type:'str', _name:'e', _const:false, _val:'loop limit over.: '+max } ] } ;

                // ループを抜けるので、idx を解放する
                for ( ; g_stack_tbl.length > arg_it ; )
                    g_stack_tbl.pop() ; // idx なのでわざわざ dtor はしない

                // out_val を返す
                local_token.push( out_val ) ;
            }
            else if ( tkn === '(each' ) {
                // (each xxx { yyy } )  <-  xxx.{{ yyy }}

                // each文
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                // ループ回数 xxx を取得
                var v1 = get_var( tmp[1] ) ;
                if ( v1._mode === '[event]' ) {
                    // g_err_list.push( 'token: ' + tkn + (debug_line===''?'':"\n\tline:"+debug_line) ) ;
                    return v1 ;
                }

                var max = 0 ;
                if      ( v1._type === 'str'  ) max = v1._val.length ;
                else if ( v1._type === 'int'  ) max = v1._val ;
                else if ( v1._type === 'list' ) max = v1._val.length ;
                else return run_time_error( 'each type error: ' + v1._type ) ;

                var arg_it = g_stack_tbl.length ;
                var out_val = { _mode:'[stack]', _type:'list', _val:[], _name:'literal', _const:false, _prototype:'each' } ;

                g_stack_tbl.push( { _mode:'[stack]', _type:v1._type, _val:0, _name:'it',  _const:true  } ) ;
                g_stack_tbl.push( { _mode:'[stack]', _type:'int',    _val:0, _name:'idx', _const:true  } ) ;

                var r = get_null() ;

                for ( var ech=0 ; ech<max ; ech ++ ) {{
                    // it
                    if      ( v1._type === 'str'  ) g_stack_tbl[arg_it]._val = v1._val.substr(ech,1) ;
                    else if ( v1._type === 'int'  ) g_stack_tbl[arg_it]._val = ech ;
                    else if ( v1._type === 'list' ) { var c=clone(get_var(v1._val[ech]));c._name='it';g_stack_tbl[arg_it]=c; }

                    // idx
                    if ( v1._type === 'list' ) {
                        var c = get_var( v1._val[ech] )._name ;
                        if ( c==='literal') { } // もう少しなんとかしたい処理
                        else if (c[0] !== '.' ) { continue ; } // private はスキップ
                        else {
                            var str = c.substr( 1, c.length-1 ) ;
                            var num = parseInt( str, 10 ) ;
                            if ( isNaN(num) ) {
                                // NaN
                                g_stack_tbl[arg_it+1]._val  =  str ;    // idx._val
                                g_stack_tbl[arg_it+1]._type = 'str' ;   // idx._type
                            }
                            else {
                                g_stack_tbl[arg_it+1]._val  =  num ;   // idx._val
                                g_stack_tbl[arg_it+1]._type = 'int' ;  // idx._type
                            }
                        }
                    }
                    else
                        g_stack_tbl[arg_it+1]._val = ech ;

                    var arg_it2 = g_stack_tbl.length ; // g_stack_tbl をここまで戻す
                    var r = kawa_parser( g_token_tbl[ tmp[2]._val ] ) ;
                    var out = g_stack_pop_and_dotr_and_catch( arg_it2, r, false ) ; // g_stack_tbl を削る dtorやcatchを実行

                    // break check
                    if ( r._mode === '[event]' && r._type === 'break' ) {
                        // 戻り値 r を out_val (list-object)に積む
                        for ( var j in r._val._val ) {{
                            var rj = clone( r._val._val[j] ) ;
                            rj._this = out_val._val ;   // out._val
                            rj._name = '.' + out_val._val.length ;
                            out_val._val.push( rj ) ;   // out._val
                        }}

                        break ; // ech
                    }
                    // continue check
                    if ( r._mode === '[event]' && r._type === 'continue' ) {
                        continue ; // ech
                    }

                    if ( r._mode === '[event]' && out._mode !== '[event]' ) {
                        r = out ; // catch したなら処理を継続
                        break ; // ech
                    }
                    if ( r._mode === '[event]' )
                        return r ; // catch されないその他のイベントはそのまま return

                    // 戻り値 out._val を out_val (list-object)に積みなおす
                    for ( var j in out._val ) {{
                        var rj = clone( out._val[j] ) ;
                        rj._this = out_val._val ;
                        rj._name = '.' + out_val._val.length ;
                        out_val._val.push( rj ) ;
                    }}
                }}

                // ループを抜けるので、it と idx を解放する。
                for ( ; g_stack_tbl.length > arg_it ; )
                    g_stack_tbl.pop() ; // わざわざ dtor はしない

                // out_val を返す
                local_token.push( out_val ) ;
            }
            else if ( tkn === '(break' ) {
                // (break [ yyy ] )  <-  break[ xxx ]

                if ( tmp.length < 2 ) return run_time_error( 'arg_size < 2 : ' + tkn ) ;
                if ( tmp.length > 2 ) return run_time_error( 'arg_size > 2 : ' + tkn ) ;
                var rj = get_var( tmp[1] ) ;
                if ( rj._type !== 'list_no' && rj._type !== 'list' ) return run_time_error( 'argument type is not list-object.: ' + tkn ) ;
                return { _mode:'[event]', _type:'break', _val:rj } ;
            }
            else if ( tkn === '(continue' ) {
                // (continue )  <-  continue

                if ( tmp.length < 1 ) return run_time_error( 'arg_size < 1 : ' + tkn ) ;
                if ( tmp.length > 1 ) return run_time_error( 'arg_size > 1 : ' + tkn ) ;
                return { _mode:'[event]', _type:'continue', _val:get_null() } ;
            }
            else if ( tkn === '(throw' ) {
                // (throw xxx [ yyy ] )  <-  throw xxx( yyy )  <-  exit xxx( yyy )

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                if ( tmp[1]._type !== 'ident' ) return run_time_error( 'argument is not catch-name.: ' + tkn ) ;
                if ( tmp[2]._type !== 'list_no' && tmp[2]._type !== 'list' ) return run_time_error( 'argument type is not list-object.: ' + tkn ) ;
                return { _mode:'[event]', _type:'exception', _name:tmp[1]._val, _val:get_var(tmp[2])._val } ;
            }
            else if ( tkn === '(until' ) {
                // (until xxx [ yyy ] )  <-  repeat xxx( yyy )  <- goto xxx ( yyy )

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                if ( tmp[1]._type !== 'ident' ) return run_time_error( 'argument is not repeat-name.: ' + tkn ) ;
                if ( tmp[2]._type !== 'list_no' && tmp[2]._type !== 'list' ) return run_time_error( 'argument is not list-object.: ' + tkn ) ;
                return { _mode:'[event]', _type:'until', _name:tmp[1]._val, _val:get_var(tmp[2])._val } ;
            }
            else if ( tkn === '(++' ) {
                // (++ xxx )  <-  ++xxx

                if ( tmp.length < 2 ) return run_time_error( 'arg_size < 2 : ' + tkn  ) ;
                if ( tmp.length > 2 ) return run_time_error( 'arg_size > 2 : ' + tkn  ) ;
                else                  local_token.push( exp( '+=', tmp[1], { _mode:'[token]', _type:'int', _val:1 } ) ) ;
            }
            else if ( tkn === '(--' ) {
                if ( tmp.length < 2 ) return run_time_error( 'arg_size < 2 : ' + tkn  ) ;
                if ( tmp.length > 2 ) return run_time_error( 'arg_size > 2 : ' + tkn  ) ;
                else                  local_token.push( exp( '-=', tmp[1], { _mode:'[token]', _type:'int', _val:1 } ) ) ;
            }
            else if ( tkn === '(+=' ) {
                // (+= xxx yyy )  <-  xxx += yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                else                  local_token.push( exp( '+=', tmp[1], tmp[2] ) ) ;
            }
            else if ( tkn === '(-=' ) {
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                else                  local_token.push( exp( '-=', tmp[1], tmp[2] ) ) ;
            }
            else if ( tkn === '(*=' ) {
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                else                  local_token.push( exp( '*=', tmp[1], tmp[2] ) ) ;
            }
            else if ( tkn === '(/=' ) {
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                else                  local_token.push( exp( '/=', tmp[1], tmp[2] ) ) ;
            }
            else if ( tkn === '(%=' ) {
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;
                else                  local_token.push( exp( '%=', tmp[1], tmp[2] ) ) ;
            }
            else if ( tkn === '(call' ) {
                // (call xxx [ yyy ] )  <-  xxx(yyy)

                // function call
                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                var v1 = get_var( tmp[1] ) ;
                if ( v1._mode === '[event]' )
                    return v1 ;

                // arg取得 （ ._name に '_' を追加し、g_stack_tbl[] に積む）
                var arg_it = g_stack_tbl.length ;

                if ( tmp.length === 3 ) {
                    // arg list exec.
                    var r = kawa_parser( g_token_tbl[tmp[2]._val] ) ;
                    if ( r._mode === '[event]' )
                        return r ;

                    // 増えた g_stack_tbl は引数として名前を付け直す
                    // a -> _a
                    for ( var j=g_stack_tbl.length-1 ; arg_it-1 < j ; j-- )
                        g_stack_tbl[j]._name = '_' + g_stack_tbl[j]._name ;

                    // arg_size は積まないことになった
                    // g_stack_tbl.push( { _mode:'[stack]', _type:'int', _val:g_stack_tbl.length-arg_it, _name:'arg_size', _const:true } ) ;
                }

                // arg を追加する前に既存の引数を隠ぺいする _a -> _._a
                {
                    for ( var ag=0 ; ag<arg_it ; ag++ ) {{
                        var nm = g_stack_tbl[ag]._name ;
                        if ( nm[0] === '_' )
                            g_stack_tbl[ag]._name = '_.' + nm ;
                    }}
                }

                // メンバ変数＆メンバ関数の転送（メンバを参照できるように g_stack_tbl に乗せる。なお_は付けない） loc_stk[] -> g_stack_tbl[]
                if ( v1._this ) {
                    var loc_stk = v1._this._val ;
                    for ( var j=loc_stk.length-1 ; j>=0 ; j-- )
                        if ( loc_stk[j]._mode === '[stack]' )
                            g_stack_tbl.push( loc_stk[j] ) ;
                }

                // function実行
                var arg_it2 = g_stack_tbl.length ;
                if ( v1._type !== 'func_no' )
                    return run_time_error( 'not function.: ' + v1._name+'.'+v1._type ) ;

                var r = kawa_parser( g_token_tbl[ v1._val ] ) ;
                if ( r._mode === '[event]' ) {
                    if ( r._type !== 'return' ) {
                        // return 以外の break, continue, event 系
                        r = g_stack_pop_and_dotr_and_catch( arg_it2, r, false ) ; // g_stack_tbl を削る dtorやcatchを実行
                        if ( r._mode === '[event]' )
                            return r ;

                        // catch されたので return せずに継続
                    }
                    else {
                        // 関数を return で抜けて返ってきた
                        r = { _mode:'[stack]', _type:'list', _val:r._val, _name:'literal', _const:false, _prototype:v1._name } ;
                    }
                }
                r._prototype = v1._name ;

                // 関数内であたらしく生成されたメンバやメンバ関数は戻り値 list に転送。
                for ( ; arg_it2<g_stack_tbl.length ; ) {{
                    var mem = g_stack_tbl.pop() ; // 転送なのでdtorは実行しない
                    mem._this = r ;
                    r._val.unshift( mem ) ; // 前方からつみなおし（転送）
                }}
                // 引数は捨てる
                for ( ; arg_it<g_stack_tbl.length ; ) {{
                    var mem = g_stack_tbl.pop() ; // todo check dtorの実行が必要でしょ
                }}

                // _._a -> _a 隠ぺいした引数の名前をもとに戻す
                {
                    for ( var ag in g_stack_tbl ) {{
                        var nm = g_stack_tbl[ag]._name ;
                        if ( nm[0] === '_' && nm[1] === '.' )
                            g_stack_tbl[ag]._name = nm.substr(2, nm.length-2) ;
                    }}
                }

                local_token.push( r ) ;
            }
            else if ( tkn === '(return' ) {
                // (return [ xxx ] )  <- return [ xxx ]

                if ( tmp.length < 2 ) return run_time_error( 'arg_size < 2 : ' + tkn ) ;
                if ( tmp.length > 2 ) return run_time_error( 'arg_size > 2 : ' + tkn ) ;

                var r = get_var( tmp[1] ) ;
                if ( r._mode === '[event]' ) return r ;
                if ( r._type !== 'list' ) return run_time_error( 'argument type is not list-object.: ' + tkn ) ;

                // 戻り値リスト l に引数を push
                var l = [] ;
                for ( var j in local_token ) {{
                    var t = local_token[j] ;
                    if ( t._mode !== '[stack]' ) continue ;
                    if ( t._name ) {
                        if ( t._name === 'literal' ) // name ありで literal は、 public .0 に
                            t._name = '.' + l.length ;
                        else if ( t._name[0] !== '.' ) // name ありで plivate は、 public .0 に
                            t._name = '.' + t.length ;
                    }
                    else {
                        // name 無しは public .0 に
                        t._name = '.' + l.length ;
                    }
                    l.push( t ) ;
                }}
                for ( var j in r._val ) {{
                    var t = clone( r._val[j] ) ;
                    if ( r._val[j]._name )
                        { if (t._name[0]!=='.') t._name = '.' + l.length ; } // name あり plivate は、 public .0 に
                    else
                        { t = clone(get_var(t)) ; t._name = '.' + l.length ; } // name 無しは public .0 に
                    l.push( t ) ;
                }}
                // 戻り値リスト l を返す
                return { _mode:'[event]', _type:'return', _val:l } ;
            }
            else if ( tkn === '(range' ) {
                // (range xxx yyy )  <- xxx..yyy

                if ( tmp.length < 3 ) return run_time_error( 'arg_size < 3 : ' + tkn ) ;
                if ( tmp.length > 3 ) return run_time_error( 'arg_size > 3 : ' + tkn ) ;

                var fm = get_var( tmp[1] ) ;
                if ( fm._mode === '[event]' ) {
                    return fm ;
                }
                if ( fm._type !== 'int' ) return run_time_error( 'argument type is not int : ' + fm._name+'.'+fm._type ) ;

                var to = get_var( tmp[2] ) ;
                if ( to._mode === '[event]' ) {
                    return to ;
                }
                if ( to._type !== 'int' ) return run_time_error( 'argument type is not int : ' + to._name+'.'+to._type ) ;

                var r = { _mode:'[stack]', _type:'list', _val:[], _name:'literal', _const:false, _prototype:'range' } ;
                for ( var it = fm._val ; ; ) {
                    r._val.push( { _mode:'[stack]', _type:'int', _val:it, _name:'.'+r._val.length, _const:false } ) ;
                    if ( fm._val < to._val ) { ++it ; if ( it > to._val ) break ; }
                    else                     { --it ; if ( it < to._val ) break ; }
                }

                local_token.push( r ) ;
            }
            else if ( tkn === '(line' ) {
                // デバッグ情報
                debug_line = tmp[1]._val ;
            }
            else return run_time_error( 'unsupported token.: ' + tkn ) ;
        }}

        var r2 = { _mode:'[stack]', _type:'list', _val:[], _name:'literal', _const:false, _prototype:'noname' } ;

        if ( local_token.length === 0 ) return r2 ;

        // 数字の name を付け r2._val に積む
        for ( var it in local_token ) {{
            var lt = local_token[it] ;
            if ( lt._type === 'ident' ) {
                lt = get_var( lt ) ; // [token],ident （変数） -> [stack],literal （実数）
            }
            else if ( lt._type === 'list_no' ) // list_no の場合、実行して list にする
                lt = get_var( lt ) ;

            if ( lt._mode === '[event]' ) // get_var で例外発生
                return lt ;

            // 名前をつける（全部公開）
            lt = clone( lt ) ;
            if ( lt._mode === '[stack]' ) {
                if ( lt._name    === 'literal' ) lt._name = '' + r2._val.length ;
                if ( lt._name[0] !== '.'       ) lt._name = '.' + lt._name ; // listの場合、ここでpublic にするのだけど、関数の場合は .0 にしたいんだよねー。対応をどうするか、ちょっと悩む。
                lt._this = r2 ;
                r2._val.push( lt ) ;
            }
            else if ( lt._mode === '[token]' ) {
                if ( lt._type === 'func_no' ) {
                    lt._mode = '[stack]'
                    lt._name = '.' + r2._val.length ;
                    lt._this = r2 ;
                    r2._val.push( lt ) ;
                }
            }
        }}

        return r2 ;
    }

    //-------------------------------------
    // コメントを削除
    var str = (function( _tx ) {
        var out1 = "" ;
        for ( var i=0 ; i<_tx.length ; i++ ) {{
            switch( _tx[i] )
            {
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
            switch( out1[i] )
            {
                case 's' :
                    if      ( mode === 's' ) mode = ' ' ;
                    else if ( mode !== 'S' ) mode = 's' ;
                    break ;
                case 'S' :
                    if      ( mode === 'S' ) mode = ' ' ;
                    else if ( mode !== 's' ) mode = 'S' ;
                    break ;
            } ;
            if ( mode !== ' ' ) out2 += mode ;
            else                out2 += out1[i] ;
        }}

        // コメントの削除処理
        var out3 = "" ;
        mode = ' ' ;
        for ( var i=0 ; i<out2.length ; i++ ) {{
            c = out2[i] ;
            switch( mode+c )
            {
                case ' b' :
                case 'eb' :
                {
                    if ( _tx.substr( i, 2 ) === "//"  ) c = 'c' ;
                    if ( _tx.substr( i, 3 ) === "---" ) c = 'c' ;
                    if ( _tx.substr( i, 3 ) === "..." ) c = 'c' ;
                    break ;
                }
            }

            switch( c )
            {
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
    })(_txt);

    // 字句解析
    var token_tbl = (function( _str ) {
        var out1 = "" ;
        for ( var i=0 ; i<str.length ; i++ ) {{
            switch( _str[i] )
            {
                case " " : out1 += ' ' ; break ;
                case "!" : out1 += 'a' ; break ;
                case '"' : out1 += 'S' ; break ;
                case "#" : out1 += 'a' ; break ;
                case "$" : out1 += 'a' ; break ;
                case "%" : out1 += 'a' ; break ;
                case "&" : out1 += 'a' ; break ;
                case "'" : out1 += 's' ; break ;
                case "(" : out1 += 'a' ; break ;
                case ")" : out1 += ')' ; break ;
                case "*" : out1 += 'a' ; break ;
                case "+" : out1 += 'a' ; break ;
                case "," : out1 += 'a' ; break ;
                case "-" : out1 += 'a' ; break ;
                case "." : out1 += 'a' ; break ;
                case "/" : out1 += 'a' ; break ;
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
                case ":" : out1 += 'a' ; break ;
                case ";" : out1 += 'a' ; break ;
                case "<" : out1 += 'a' ; break ;
                case "=" : out1 += 'a' ; break ;
                case ">" : out1 += 'a' ; break ;
                case "?" : out1 += 'a' ; break ;
                case "@" : out1 += 'a' ; break ;
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
                case "\\" : out1 += 'a' ; break ;
                case "]" : out1 += ']' ; break ;
                case "^" : out1 += 'a' ; break ;
                case "_" : out1 += 'a' ; break ;
                case "`" : out1 += 'a' ; break ;
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
                case "|" : out1 += 'a' ; break ;
                case "}" : out1 += '}' ; break ;
                case "~" : out1 += 'a' ; break ;
                default  : out1 += ' ' ; break ;
            }
        }}

        // 文字列 string  '', "" の処理
        var out2 = "" ;
        var mode = ' ' ;
        for ( var i=0 ; i<out1.length ; i++ ) {{
            switch( out1[i] )
            {
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
            if ( mode === ' ' && i>0 && out1[i-1] === 'a' && out1[i] === '0' ) mode = 'a' ;
            else if ( mode === 'a' && out1[i] !== 'a' && out1[i] !== '0' ) mode = ' ' ;

            if ( mode !== ' ' ) out2 += mode ;   // string
            else                out2 += out1[i] ;
        }}

        // 単語単位に分解し、tblに登録
        var out3 = "" ;
        var wd   = "" ;
        mode = out2[0] ;
        var tbl  = [] ;
        for ( var i=0 ; i<out2.length ; i++ ) {{
            if ( mode === out2[i] ) {
                wd += _str[i] ;
            }
            else {
                if ( mode !== " " )
                    tbl.push( mode + ":" + wd ) ;

                wd   = _str[i] ;
                mode = out2[i] ;
            }
        }}
        if ( mode !== " " )
            tbl.push( mode + ":" + wd ) ;

        return tbl ;
    })(str) ;

    //-------------------------------------
    // 字句解析器 (lexical analyzer, 略称：lexer )
    // 文字の並びを、トークン (token) の並びに変換し、g_token_tbl[] に分解＆登録する。
    function lexer( _in_tbl ) {
        /*-------------------------------------
            _mode,     _type,     _val
            '[token]', 'int',     int
            '[token]', 'str',     str
            '[token]', 'bool',    bool
            '[token]', 'ident',   str
            '[token]', 'func_no', int
            '[token]', 'list_no', int
        */

        //-------------------------------------
        // 文字の並びを、トークン (token or stack) の並びに変換
        function token( _str ) {
            if ( _str === 'a:true'  ) return { _mode:'[stack]', _type:'bool', _val:true,  _name:'literal', _const:true } ;
            if ( _str === 'a:false' ) return { _mode:'[stack]', _type:'bool', _val:false, _name:'literal', _const:true } ;

            var t = _str.substr( 0, 2 ) ;

            if ( t === '0:' ) return { _mode:'[stack]', _type:'int', _val:parseInt( _str.substr( 2, _str.length-2 ), 10 ), _name:'literal', _const:true } ;
            if ( t === 's:' ) return { _mode:'[stack]', _type:'str', _val:_str.substr( 3, _str.length-2-2 ),               _name:'literal', _const:true } ;

            return { _mode:'[token]', _type:'ident', _val:_str.substr( 2, _str.length-2 ) } ;
        }

        // 初期化
        g_token_tbl = [] ; //

        // 括弧 { } 分割。
        var root = [] ;
        for ( var i=0 ; i<_in_tbl.length ; i++ ) {{
            // { } func
            if ( _in_tbl[i] === '}:}' ) {
                var tmp = [] ;
                var e ;
                while ( e = root.pop() ) {{
                    if ( e._type === 'ident' && e._val === '{' ) {
                        var func_no = g_token_tbl.length ;
                        g_token_tbl.push( tmp ) ;
                        root.push( { _mode:'[token]', _type:'func_no', _val:func_no } ) ;
                        break ;
                    }
                    else  tmp.unshift( e ) ;
                }}
            }
            // [ ] list
            else if ( _in_tbl[i] === ']:]' ) {
                var tmp = [] ;
                var e ;
                while ( e = root.pop() ) {{
                    if ( e._type === 'ident' && e._val === '[' ) {
                        var list_no = g_token_tbl.length ;
                        g_token_tbl.push( tmp ) ;
                        root.push( { _mode:'[token]', _type:'list_no', _val:list_no } ) ;
                        break ;
                    }
                    else  tmp.unshift( e ) ;
                }}
            }
            else {
                // 文字の並びを、トークン (token) の並びに変換
                root.push( token( _in_tbl[i] ) ) ;
            }
        }}

        // lexer結果出力
        g_token_tbl.push( root ) ;
    }
    lexer( token_tbl ) ;

    // 構文解析
    // 先に @.co を宣言したことにしておく
    var at_list = { _mode:'[stack]', _type:'list', _val:[], _name:'@', _const:false, _prototype:'system_root' } ;
    at_list._val.push( { _mode:'[stack]', _type:'list', _val:'', _name:'.co', _const:false, _prototype:'out_stream' } )
    g_stack_tbl.push( at_list ) ;

    // 実行
    var r = kawa_parser( g_token_tbl[g_token_tbl.length-1] ) ;
    var out = g_stack_pop_and_dotr_and_catch( 0, r, false ) ; // g_stack_tbl を削る dtorやcatchを実行
    if ( out._mode==='[event]' ) // ↓例外throwしか、考慮されていない。return, break, continue, など間違った使い方の時のエラー処理が抜けている
        g_err_list.push( '' + out._type + ': '+
            ((out._type==='exception')?((out._val.length>0) ? out._name+' '+out._val[0]._val : out._name ):out._val) +
            (out.hasOwnProperty( 'debug_line' )&&out.debug_line!==""?"\n\tline:"+out.debug_line:"")
        ) ;

    // 実行結果
    for ( var j in g_err_list ) {{
        g_output += '\n' + g_err_list[j] ;
    }}

    return g_output ;
}
