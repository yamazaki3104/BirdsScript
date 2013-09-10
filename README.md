つい、カッ！となってLL言語を作りはじめてしまいました。名前は「BirdsScript」です。
（2013/09/10 現在、未完成。）

Source Layout
=============

プロジェクトには、以下のファイルが含まれます。

    README.md             このファイル
    src/                  ソースコード
    src/BirdsScript.html  HTMLによるコンパイラ(Yamasemi)＆実行系(Kawasemi)の呼び出しとテスト。それから仕様メモ。
    src/Kawasemi.mini.js  Javascriptによる実行系の試作。
    src/Yamasemi.mini.js  Javascriptによるコンパイラの試作。

特徴：
--------

すべてのプログラマーのために「軽量で」「安全で」「大規模開発に耐えられる」「使って楽しい」言語を目指して設計してみました。
（C/C++ や JavaScript に近い文法だと勝手に思っています）


「軽量で」
--------

  ・記述量が軽量（ var とか function とか class とか private とか public とか書く必要はありません。型名も int とか string とか （いまのところ）ほとんんど記述する必要がない。）

  ・文法も軽量。予約語も少ない。（ if, for, each, switch, case, などの予約語は存在せず、代替の記述方法があります ）

  ・実装も軽量。いまのところコンパイラ(Yamasemi)も、実行系(Kawasemi)も、JavaScriptで1000行程度。（最終的にはC/C++で4000行程度になるはず。）

「安全で」
--------

  ・定数宣言を重視（不必要な変数はバグの元となると考えて（関数型言語を見習って））

  ・空の変数は存在できない（変数の値が未定という状態は無い）

  ・コンテナにも更新の可、不可がある。
  （STLでいうコンテナ。JavaやC#でいうコレクション。配列：listと 連想配列map の両方の機能を持つ）

  ・カプセル化がデフォルト。メンバは private になる（デフォルトで隠蔽され、外部からのアクセス可能にするには手間（'.'の記述）が必要）

  ・ポインタは存在しない（ポインタはバグの温床という考え）

  ・class継承は存在しない。代わりにprototype系のオブジェクト継承を考えています。（実装の継承は過度に隠ぺいされて可読性、メンテナンス性・保守性が悪いと考えて）

  ・GCではなく、ブロックスコープで解放され、デストラクタが走ります（GCは処理が重いときに走り始めるので嫌いです）

  ・例外を多数実装。無限ループする前に例外が発生してループを抜けます。（未実装ですが、ゼロ除算、最大最小値超え、範囲外アクセス、スタックメモリ枯渇、などなど）

  ・タイプセーフ（静的型付け）な言語にしたい思いは強い（インターフェースが一致しない、型が一致しない場合はコンパイルエラー。予定＆希望＆未実装）

「大規模開発に耐えられる」
--------

  ・オブジェクト指向（クラスとか、オブジェクトとか、カプセル化とか）の概念は入っている

  ・STLのようなジェネリックな言語にしたい思いは強いです（希望＆未実装）。

  ・テストも重視。デバッグも重視。（未実装）

  ・可読性もメンテナンス性も重視。（希望）

「使って楽しい」
--------

  ・コンテナがある。

  ・each がある。

  ・関数とクラスは同じ記述、同じ実装。

  ・無名関数がある。無名クラスがある。

  ・クロージャーも・・・？

とにかく、プログラマが苦労しない言語を目指しています。


概要：
--------

コンパイラというか中間言語へのトランスレータ「Yamasemi」と、中間言語の実行部(いわゆるVM)「Kawasemi」の２段構成になっています。

現状、言語設計+試験期間な意味からコンパイラよりもインタープリタに近い状態です。現在は実装の確認という意味で JavaScript 書いています。
今後の予定としては、やはり C/C++ への移植です。JavaScriptで 1000行程度なので、C/C++ でも 4000行程度の軽量な実装になると予想しています。

型は現在、整数型(int)と文字列型(str)しかありません。早めに、bool, enum（シンボル？）はサポートしたいと思っています。
float やその他の型は外部のライブラリとして用意するつもり。（言語そのもののの実装を軽くしたいので。）

クラスやオブジェクトのようなものは JavaScript と同じようなプロトタイプで用意する方向です。
継承（実装の継承は可読性とメンテナンス性が悪い）は嫌いなので、おそらく永遠にサポートされないでしょう。

逆に STL のようなジェネリックプログラミングは優先度高めでサポートします。

そしてテストとデバッグのしやすさを売りにしたいので test() や assert(), trace() とかを早めに実装したい。



The BSD 2-Clause License
------------------------

Copyright (c) 2013, YAMAZAKI Satoshi.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

　Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
　Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


BSDライセンス
----------

Copyright (c) 2013, YAMAZAKI Satoshi.
All rights reserved.

ソースコード形式かバイナリ形式か、変更するかしないかを問わず、以下の条件を満たす場合に限り、再頒布および使用が許可されます。

・ソースコードを再頒布する場合、上記の著作権表示、本条件一覧、および下記免責条項を含めること。
・バイナリ形式で再頒布する場合、頒布物に付属のドキュメント等の資料に、上記の著作権表示、本条件一覧、および下記免責条項を含めること。
・書面による特別の許可なしに、本ソフトウェアから派生した製品の宣伝または販売促進に、著作権者およびコントリビューターの名前を使用してはならない。

本ソフトウェアは、著作権者およびコントリビューターによって「現状のまま」提供されており、明示黙示を問わず、商業的な使用可能性、および特定の目的に対する適合性に関する暗黙の保証も含め、またそれに限定されない、いかなる保証もありません。著作権者もコントリビューターも、事由のいかんを問わず、 損害発生の原因いかんを問わず、かつ責任の根拠が契約であるか厳格責任であるか（過失その他の）不法行為であるかを問わず、仮にそのような損害が発生する可能性を知らされていたとしても、本ソフトウェアの使用によって発生した（代替品または代用サービスの調達、使用の喪失、データの喪失、利益の喪失、業務の中断も含め、またそれに限定されない）直接損害、間接損害、偶発的な損害、特別損害、懲罰的損害、または結果損害について、一切責任を負わないものとします。

