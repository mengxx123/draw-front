<template>
    <div class="page page-home">
        <!-- 头部 -->
        <header class="layout-header navbar navbar-light navbar-h5" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse"
                            data-target="#navbar-collapse">
                        <span class="sr-only">切换导航</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Draw</a>
                </div>
                <div id="navbar-collapse" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav" id="menu-layoutit">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                                文件 <i class="icon icon-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a id="open" href="#">打开</a></li>
                                <li><a id="new" href="#">新建</a></li>
                                <li><a id="save" href="#"><!--<i class="draw-icon draw-icon-save"></i>--> 保存</a></li>
                                <li><a id="download" href="#" download="picture.png"><!--<i class="draw-icon draw-icon-download"></i>--> 下载</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                                窗口 <i class="icon icon-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a id="layer" href="#">图层</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                                帮助 <i class="icon icon-down"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a href="#" @click="help">帮助</a></li>
                                <!--<li><a id="version" href="#">版本介绍</a></li>-->
                                <li><a id="about" href="#">关于</a></li>
                            </ul>
                        </li>
                        <li class="nav-item navbar-form">
                            <button id="quick-help" class="btn btn-info" href="#">快速导航</button>
                            <button class="btn btn-info" @click="test">测试</button>
                        </li>
                        <!--<li class="nav-item"><a class="nav-link" href="">链接</a> </li>
                        <li class="nav-item navbar-form">
                            <button id="insert-text" class="btn btn-info" href="#undo">文字</button>
                            <button id="insert-img" class="btn btn-info" href="#undo"><i class="glyphicon glyphicon-arrow-left"></i> 图片</button>
                            <button id="insert-shape" class="btn btn-info" href="#undo">形状</button>
                        </li>-->
                    </ul>
                    <ul class="nav navbar-nav pull-right">
                        <li class="nav-item">
                            <a class="nav-link" href="http://tool.yunser.com" target="_blank">更多工具</a>
                        </li>

                        <!--<li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                                更多 <i class="caret"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a href="#">我的作品</a></li>
                                <li><a href="#">我的收藏</a></li>
                                <li class="divider"></li>
                                <li><a href="#">退出</a></li>
                            </ul>
                        </li>-->
                    </ul>
                </div>
            </div>
        </header>
        <!-- /头部 -->
        <div class="layout-body">
            <div id="tool-box" class="tool-box bootstro" data-bootstro-width="200px" data-bootstro-title="工具栏" data-bootstro-content="这里有常用的工具" data-bootstro-placement="right">
                <h4 class="title">常用</h4>
                <div class="tool-list">
                    <button class="btn btn-default" data-type="pointer" type="button" data-toggle="tooltip" title="移动图像"><i class="draw-icon draw-icon-pointer"></i></button>
                    <button class="btn btn-default" data-type="text" type="button" data-toggle="tooltip" title="文字"><i class="draw-icon draw-icon-text"></i></button>

                    <button class="btn btn-default" data-type="eraser" type="button" data-toggle="tooltip" title="橡皮擦"><i class="draw-icon draw-icon-eraser"></i></button>
                    <button class="btn btn-default" data-type="magic_eraser" type="button" data-toggle="tooltip" title="魔术橡皮擦"><i class="draw-icon draw-icon-eraser"></i></button>

                    <button class="btn btn-default" data-type="straw" type="button" data-toggle="tooltip" title="取色"><i class="draw-icon draw-icon-straw"></i></button>
                </div>
                <h4 class="title">画笔</h4>
                <div class="tool-list">
                    <button class="btn btn-default active" data-type="pencil" type="button" data-toggle="tooltip" title="铅笔"><i class="draw-icon draw-icon-pencil"></i></button>
                    <button class="btn btn-default" data-type="crayon" type="button" data-toggle="tooltip" title="蜡笔"><i class="draw-icon draw-icon-pen2"></i></button>
                    <button class="btn btn-default" data-type="liuye" type="button" data-toggle="tooltip" title="柳叶笔"><i class="draw-icon draw-icon-pen3"></i></button>
                    <button class="btn btn-default" data-type="paint_bucket" type="button" data-toggle="tooltip" title="颜料桶"><i class="draw-icon draw-icon-bucket"></i></button>
                </div>
                <h4 class="title">图形</h4>
                <div class="tool-list">
                    <button class="btn btn-default" data-type="line" type="button" data-toggle="tooltip" title="直线"><i class="draw-icon draw-icon-line"></i></button>
                    <button class="btn btn-default" data-type="round" type="button" data-toggle="tooltip" title="圆"><i class="draw-icon draw-icon-round"></i></button>
                    <button class="btn btn-default" data-type="rect" type="button" data-toggle="tooltip" title="矩形"><i class="draw-icon draw-icon-rect"></i></button>
                    <button class="btn btn-default" data-type="ellipse" type="button" data-toggle="tooltip" title="椭圆"><i class="draw-icon draw-icon-ellipse"></i></button>
                    <button class="btn btn-default" data-type="arrow" type="button" data-toggle="tooltip" title="箭头"><i class="draw-icon draw-icon-arrow"></i></button>

                    <button class="btn btn-default" data-type="pen" type="button" data-toggle="tooltip" title="钢笔"><i class="draw-icon draw-icon-pen"></i></button>
                </div>
                <h4 class="title">其他</h4>
                <div class="tool-list">
                    <button class="btn btn-default" data-type="cut" type="button" data-toggle="tooltip" title="剪裁"><i class="draw-icon draw-icon-cut"></i></button>
                    <button class="btn btn-default" data-type="select" type="button" data-toggle="tooltip" title="区域剪裁"><i class="draw-icon draw-icon-area"></i></button>
                </div>
                <!--<h4 class="title">开发中</h4>
                <div class="tool-list">
                    <button class="btn btn-default" data-type="hand" type="button" data-toggle="tooltip" title="移动"><i class="draw-icon draw-icon-hand"></i></button>
                    <button class="btn btn-default" data-type="vague_eraser" type="button" data-toggle="tooltip" title="模糊橡皮擦"><i class="draw-icon draw-icon-eraser"></i></button>
                    <button class="btn btn-default" data-type="brush" type="button" data-toggle="tooltip" title="喷枪"><i class="draw-icon draw-icon-pencel"></i></button>
                    <button class="btn btn-default" data-type="ink" type="button" data-toggle="tooltip" title="墨水笔"><i class="draw-icon draw-icon-pencel"></i></button>

                    <a id="select2" class="btn btn-default" data-toggle="tooltip" title="选择"><i class="draw-icon draw-icon-save"></i></a>
                    <a id="rotate" class="btn btn-default" data-toggle="tooltip" title="旋转"><i class="draw-icon draw-icon-save"></i></a>
                    <a id="resize" class="btn btn-default" data-toggle="tooltip" title="调整大小"><i class="draw-icon draw-icon-save"></i></a>
                    <a id="small" class="btn btn-default" data-toggle="tooltip" title="缩小"><i class="draw-icon draw-icon-save"></i></a>
                </div>-->
            </div>
            <div id="workplace-box" class="workplace-box">
                <div id="workplace" class="workplace bootstro"  data-bootstro-step='1' data-bootstro-width="200px" data-bootstro-title="编辑区" data-bootstro-content="可以在这里涂鸦、修图" data-bootstro-placement="right">
                    <div id="drawboard" class="drawboard">
                        <div id="cut-box" class="cut-box">
                            <div class="cut-overlay-top"></div>
                            <div class="cut-overlay-left"></div>
                            <div class="cut-overlay-right"></div>
                            <div class="cut-overlay-bottom"></div>
                            <div class="ui-cut">
                                <div class="ui-scale ui-scale-n"></div>
                                <div class="ui-scale ui-scale-ne"></div>
                                <div class="ui-scale ui-scale-e"></div>
                                <div class="ui-scale ui-scale-se"></div>
                                <div class="ui-scale ui-scale-s"></div>
                                <div class="ui-scale ui-scale-sw"></div>
                                <div class="ui-scale ui-scale-w"></div>
                                <div class="ui-scale ui-scale-nw"></div>
                                <div class="line1"></div>
                                <div class="line2"></div>
                                <div class="line3"></div>
                                <div class="line4"></div>
                            </div>
                        </div>
                    </div>
                    <!--<div class="back-img"></div>-->
                </div>
            </div>
            <div class="edit-tool">
                <ul id="tool-tab" class="nav nav-tabs">
                    <div class="nav-item active"><a id="tab-style" class="nav-link" href="#tab11" data-toggle="tab">编辑</a></div>
                    <div class="nav-item"><a class="nav-link" href="#tab12" data-toggle="tab">效果</a></div>
                    <div class="nav-item"><a id="tab-index" class="nav-link" href="#tab13" data-toggle="tab">画布</a></div>
                </ul>
                <div class="tab-content">
                    <div id="tab11" class="tab-pane fade active in">
                        <div class="form-horizontal">
                            <div class="form-groups">
                                <h4 class="title">工具</h4>
                                <div class="btn-group bootstro"  data-bootstro-step='3' data-bootstro-width="200px" data-bootstro-title="" data-bootstro-content="点击回放按钮，可以回顾作图过程哦" data-bootstro-placement="left">
                                    <a id="undo" class="btn btn-default" data-toggle="tooltip" title="撤销"><i class="draw-icon draw-icon-undo"></i></a>
                                    <a id="redo" class="btn btn-default" data-toggle="tooltip" title="重做"><i class="draw-icon draw-icon-redo"></i></a>
                                    <a id="clear" class="btn btn-default" data-toggle="tooltip" title="清除"><i class="draw-icon draw-icon-clear"></i></a>
                                    <a id="play" class="btn btn-default" data-toggle="tooltip" title="回放"><i class="draw-icon draw-icon-play"></i></a>
                                </div>
                                <div id="pen-tools" class="pen-tools">
                                    <div class="title">钢笔工具</div>
                                    <div id="pen-list" class="btn-group">
                                        <button id="pen-draw" class="btn btn-default active" type="button" data-toggle="tooltip" title="钢笔工具"><i class="draw-icon draw-icon-pen"></i></button>
                                        <button id="pen-point" class="btn btn-default" type="button" data-toggle="tooltip" title="锚点工具"><i class="draw-icon draw-icon-pen"></i></button>
                                        <button id="pen-delete" class="btn btn-default" type="button" data-toggle="tooltip" title="删除锚点工具"><i class="draw-icon draw-icon-pen"></i></button>
                                        <button id="pen-add" class="btn btn-default" type="button" data-toggle="tooltip" title="添加锚点工具"><i class="draw-icon draw-icon-pen"></i></button>
                                        <button id="pen-move" class="btn btn-default" type="button" data-toggle="tooltip" title="移动锚点工具"><i class="draw-icon draw-icon-pen"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-groups">
                                <h4 class="title">画笔</h4>
                                <div class="form-group">
                                    <label class="control-label">大小</label>
                                    <div id="paint-width" style="width: 210px"></div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">透明度</label>
                                    <div id="paint-opacity" style="width: 210px"></div>
                                </div>
                            </div>
                            <div class="form-groups">
                                <h4 class="title">颜色</h4>
                                <div class="form-group">
                                    <label class="control-label">颜色</label>
                                    <input id="editor-color" class="form-control" type="text">
                                </div>
                                <div class="form-group">
                                    <ul id="color-list" class="color-list">
                                        <li class="color-item" style="background-color: #000" data-color="#000"></li>
                                        <li class="color-item" style="background-color: #f00" data-color="#f00"></li>
                                        <li class="color-item" style="background-color: #80FF00" data-color="#80FF00"></li>
                                        <li class="color-item" style="background-color: #00FFFF" data-color="#00FFFF"></li>
                                        <li class="color-item" style="background-color: #808080" data-color="#808080"></li>
                                        <li class="color-item" style="background-color: #FF8000" data-color="#FF8000"></li>
                                        <li class="color-item" style="background-color: #408080" data-color="#408080"></li>
                                        <li class="color-item" style="background-color: #8000FF" data-color="#8000FF"></li>
                                        <li class="color-item" style="background-color: #CCCC00" data-color="#CCCC00"></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab12" class="tab-pane fade">
                        <div class="form-horizontal">
                            <div class="form-groups">
                                <h4 class="title">滤镜和调整</h4>
                                <div class="form-group">
                                    <label class="control-label">滤镜</label>
                                    <select id="filter" class="form-control">
                                        <option value="blur">无</option>
                                        <optgroup label="效果">
                                            <option value="blur">模糊</option>
                                            <option value="relief">浮雕</option>
                                            <option value="mirror">水平翻转（镜像）</option>
                                            <option value="fliph">垂直翻转</option>
                                            <option value="mosaic">马赛克</option>
                                        </optgroup>
                                        <optgroup label="其他">
                                            <option value="grayLigtness">明度灰</option>
                                            <option value="grayLuminosity">亮度灰</option>
                                            <option value="grayLuminosity">平均亮度</option>
                                            <option value="sepiaTone">棕褐色灰度图（老照片效果）</option>
                                            <option value="swapChannels">修改颜色通道的顺序</option>
                                            <option value="monoColor">mono</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">调整</label>
                                    <select id="filter3" class="form-control">
                                        <option value="blur">无</option>
                                        <option value="invert">反相（反色）</option>
                                        <option value="gray">去色（灰度）</option>
                                    </select>
                                </div>
                                <!--<div>
                                    <span>混合模式</span>
                                    <select id="filter2">
                                        <option value="blur">正常</option>
                                        <option value="dissolve">溶解</option>
                                        <optgroup label="变暗">
                                            <option value="multiply">正片叠底</option>
                                            <option value="colorBurn">颜色加深</option>
                                        </optgroup>
                                        <optgroup label="变亮">
                                            <option value="linearDodge">线性减淡</option>
                                        </optgroup>
                                        <optgroup label="饱和度">
                                            <option value="softLight">柔光</option>
                                        </optgroup>
                                        <optgroup label="差集">
                                            <option value="difference">差值</option>
                                        </optgroup>
                                        <optgroup label="颜色">
                                        </optgroup>
                                    </select>
                                </div>-->
                            </div>
                        </div>
                    </div>
                    <div id="tab13" class="tab-pane fade">
                        <div class="form-horizontal">
                            <div class="form-groups">
                                <h4 class="title">画布属性</h4>
                                <div class="form-group">
                                    <label class="control-label">画布宽度</label>
                                    <div id="editor-canvas-width" class="form-control-static">500px</div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">画布高度</label>
                                    <div id="editor-canvas-height" class="form-control-static">500px</div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">背景颜色</label>
                                    <input id="editor-bg-color" class="form-control" type="text">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="text-box" class="text-box">
            <input id="text-box-input" class="input">
        </div>

        <div id="position" class="position">(0, 0)</div>
        <img id="save-test" class="save-demo">
        <div id="board" class="board-box">
            <img class="board" src="/static/img/board.svg">
            <ul id="board-color" class="board-color">
                <li id="board-color4" class="color1" style="background-color: #80FF00" data-color="#80FF00"></li>
                <li id="board-color3" class="color2" style="background-color: #00FFFF" data-color="#00FFFF"></li>
                <li id="board-color2" class="color3" style="background-color: #808080" data-color="#808080"></li>
                <li id="board-color1" class="color4" style="background-color: #408080" data-color="#408080"></li>
            </ul>
            <div id="current-color" class="current-color" style="background-color: #000"></div>
        </div>
        <div id="layer-box" class="layer-box">
            <ul id="layer-list" class="layer-list">
                <li class="layer-item active" data-layer="2">
                    <a class="visiable" href="#"><i class="draw-icon draw-icon-visible"></i></a>
                    <canvas width="100" height="100" id="layer-preview-2"></canvas>
                    <div>
                        <span class="layer-name">图层2</span>
                        <div class="type">普通图层</div>
                    </div>
                </li>
                <li class="layer-item" data-layer="1">
                    <a class="visiable" href="#"><i class="draw-icon draw-icon-visible"></i></a>
                    <canvas width="100" height="100" id="layer-preview-1"></canvas>
                    <div>
                        <span class="layer-name">图层1</span>
                        <div class="type">普通图层</div>
                    </div>
                </li>
            </ul>
            <!--<a id="add-layer" href="#" title="添加图层"><i class="draw-icon draw-icon-add2"></i> 添加图层</a>
            <a id="delete-layer" href="#" title="删除图层"><i class="icon icon-de"></i>删除图层</a>
            <a id="merge-layer" href="#">合并图层</a>
            <a id="merge-layer2" href="#">合并可见图层</a>-->
        </div>
        <div id="new-dialog" class="new-dialog">
            <form class="form-horizontal">
                <div class="form-group">
                    <label class="control-label col-sm-4">宽度(px)</label>
                    <div class="col-sm-4">
                        <input id="new-dialog-width" class="form-control" value="500" type="number">
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-4">高度(px)</label>
                    <div class="col-sm-4">
                        <input id="new-dialog-height" class="form-control" value="500" type="number">
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-4">背景内容</label>
                    <div class="col-sm-4">
                        <select id="new-dialog-bg" class="form-control">
                            <option value="0">白色</option>
                            <option value="1">透明</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-4"></label>
                    <div class="col-sm-4">
                        <button id="new-dialog-ok" class="btn btn-primary">确定</button>
                    </div>
                </div>
            </form>
        </div>
        <div id="open-dialog" class="open-dialog">
            <ul id="file-list" class="file-list">
                <li class="list-item"><a class="link" href="#"><img class="img" src="/static/img/demo1.jpg"></a>  </li>
                <li class="list-item"><a class="link" href="#"><img class="img" src="/static/img/demo2.png"></a>  </li>
                <li class="list-item"><a class="link" href="#"><img class="img" src="/static/img/demo3.jpg"></a>  </li>
                <li class="list-item"><a class="link" href="#"><img class="img" src="/static/img/demo5.jpg"></a>  </li>
            </ul>
            <div id="drop-box" class="drop-box">
                <button id="open-dialog-file" class="btn btn-primary" type="button">选择文件</button>
                <div class="tip">可将图片拖拽到这里或者直接将图片拖到画板</div>
            </div>
        </div>
        <div id="color-dialog" class="color-dialog"></div>

        <!-- 剪切右键菜单 -->
        <ul id="cut-menu" class="elem-menu dropdown-menu">
            <li><a id="cut-menu-cut" href="#">剪裁</a></li>
            <li><a id="cut-menu-cancel" href="#">取消</a></li>
        </ul>
        <div id="play-box" class="play-box">
            <div class="masks">
                <div id="mask-left" class="mask-left"></div>
                <div id="mask-right" class="mask-right"></div>
                <div id="mask-top" class="mask-top"></div>
                <div id="mask-bottom" class="mask-bottom"></div>
            </div>
            <div class="control">
                <a id="play-box-close" class="play-box-close" href=""><i class="icon icon-close"></i></a>
            </div>
        </div>
        <div id="pencil-dialog" class="dialog pencil-dialog">
            <header class="dialog-header">
                <h3>铅笔设置</h3>
            </header>
            <div class="dialog-body">
                <div class="title">画笔大小</div>
                <!--<div id="paint-width" style="width: 210px"></div>-->
            </div>
        </div>
        <div id="eraser-dialog" class="dialog pencil-dialog">
            <header class="dialog-header">
                <h3>橡皮擦设置</h3>
            </header>
            <div class="dialog-body">
                <div class="title">橡皮擦大小</div>
                <div>
                    <div id="eraser-width" style="width: 210px"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data () {
            return {
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            help() {
                this.$router.push('/help')
            },
            init() {
                var db = new DrawBoard('drawboard', {
                    width: 500,
                    height: 500,
                    log: true // 默认保存操作记录
                });
                db.loadStorage();
                db.usePlugin('pencil');
                db.dropImage();
                //db.canvasSize(800, 800);
                db.setWidth(2);
                //db.setOpacity(0.5);
                setTimeout(function () {
                    //showLayer();
                }, 1000);

                // 保存
                $('#save').on('click', function () {
                    db.save();
                    ui.msg('本地保存成功');
                });

                // 快捷键支持
                $(document).on('keydown', function (e) {
                    if (e.ctrlKey) {
                        //ui.msg(e.keyCode);
                        switch (e.keyCode) {
                            case 83: // s
                                db.save();
                                ui.msg('保存成功');
                                return false;
                            case 89: // y
                                db.redo();
                                return false;
                            case 90: // z
                                db.undo();
                                return false;
                        }
                    } else {
                        switch (e.keyCode) {
                            case 32: // blank
                                ui.msg('移动成功');
                                return false;
                        }
                    }
                });

                $(document).on('keyup', function (e) {
                    switch (e.keyCode) {
                        case 32: // blank
                            //ui.msg('移动成功');
                            return false;
                    }
                });

                // 清除
                $('#clear').on('click', function () {
                    db.clear();
                });

                // 画笔大小
                $('#paint-width').range({
                    value: 1,
                    min: 1,
                    max: 300,
                    step: 1
                }).on('slide', function (e) {
                    var width = e.value;
                    if (width == 0) {
                        width = 1;
                    }
                    db.setWidth(width);
                });

                // 画笔透明度
                $('#paint-opacity').range({
                    value: 1,
                    min: 0.01,
                    max: 1,
                    step: 0.01
                }).on('slide', function (e) {
                    var opacity = e.value;
                    db.setOpacity(opacity);
                });


                /*$('#paint-width').on('change', function () {
                 var width = $(this).val();
                 if (width == 0) {
                 width = 1;
                 }
                 db.setWidth(width);

                 });*/

                $('#eraser-width').range({
                    value: 1,
                    min: 1,
                    max: 300,
                    step: 1
                }).on('slide', function (e) {
                    var width = e.value;
                    if (width == 0) {
                        width = 1;
                    }
                    db.setEraserWidth(width);
                });
                /*$('#eraser-width').on('change', function () {
                 var width = $(this).val();
                 db.setEraserWidth(width);
                 });*/

                $('#resize').on('click', function () {
                    db.canvasSize(800, 800);
                });

                // 工具栏选择
                $('#tool-box').selectable({
                    item: '.btn'
                });
                $(document).on('click', '[data-type]', function () {
                    var type = $(this).data('type');
                    db.usePlugin(type);
                });

                $('#drop-box')[0].addEventListener('drop', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var fileList = e.dataTransfer.files;　　//获取拖拽文件
                    db.loadImageFile(fileList[0]); // 这里只取拖拽的第一个，实际中你可以遍历处理file列表
                    $('#open-dialog').dialog('hide');
                }, false);
                $('#drop-box')[0].addEventListener('dragover', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                }, false);
                $('#file-list').on('click', '.link', function () {
                    var img = $(this).find('img')[0];
                    db.open(img);
                    $('#open-dialog').dialog('hide');
                });
                $('#open-dialog-file').on('click', function () {
                    var $fileInput = $('<input type="file">');
                    $(document.body).append($fileInput);
                    $fileInput.on('change', function () {
                        if ($(this).val()) {
                            var fileList = this.files;　　//获取拖拽文件
                            db.loadImageFile(fileList[0]);
                            $('#open-dialog').dialog('hide');
                        }
                    });
                    $fileInput.hide();
                    $fileInput.trigger('click');
                });
                $('#open').on('click', function (e) {
                    e.preventDefault();
                    $('#open-dialog').dialog({
                        title: '打开',
                        btn: false
                    });
                });

                $('#new').on('click', function (e) {
                    e.preventDefault();

                    $('#new-dialog').dialog({
                        title: '新建',
                        btn: false
                    });

                    $('#new-dialog-ok').one('click', function (e) {
                        e.preventDefault();

                        var width = $('#new-dialog-width').val() || 500;
                        var height = $('#new-dialog-height').val() || 500;
                        var bg = $('#new-dialog-bg').val();
                        $('#new-dialog').dialog('hide');
                        db.new(width, height, bg);
                    });
                });

                $('#undo').on('click', function () {
                    db.undo();
                });

                $('#redo').on('click', function () {
                    db.redo();
                });

                $('#download').on('click', function () {
                    db.save();
                });

                $('#rotate').on('click', function () {
                    db.rotate();
                });

                $('#small').on('click', function () {
                    db.small();
                });

                // 滤镜和调整
                $('#filter,#filter3').on('change', function () {
                    var filerName = $(this).val();
                    switch (filerName) {
                        case 'asd':
                            break;
                        default:
                            db.filter(filerName);
                            break;
                    }
                });

                // 混合模式
                $('#filter2').on('change', function () {
                    var filerName = $(this).val();
                    switch (filerName) {
                        case 'asd':
                            break;
                        default:
                            db.filter2(filerName);
                            break;
                    }
                });

                $('#play').on('click', function () {
                    if (db.isPlaying) {
                        db.cancelPlay();
                    } else {
                        db.play();
                        $('#play-box').show();
                        var rect = document.getElementById('drawboard').getBoundingClientRect();
                        $('#mask-left').css({
                            width: rect.left,
                            top: rect.top,
                            height: rect.height
                        });
                        $('#mask-top').css({
                            height: rect.top
                        });
                        $('#mask-bottom').css({
                            top: rect.top + rect.height
                        });
                        $('#mask-right').css({
                            top: rect.top,
                            height: rect.height,
                            left: rect.left + rect.width
                        });
                        console.log(rect);
                    }

                });

                // 颜料板
                $('#board').draggable({
                    containment: window
                });

                var colors = ['#000', '#80FF00', '#00FFFF', '#808080', '#408080'];

                function selectColor(color) {
                    db.setColor(color);
                    $('#current-color').css('background-color', color);

                }


                $('#board-color').on('click', '[data-color]', function () {
                    var color = $(this).data('color');
                    selectColor(color);
                });

                // 背景颜色
                $('#editor-color').colorpicker({
                    //color: '#000000',
                    format: 'hex',
                }).on('changeColor', function (e) {
                    db.setColor(e.color.toHex());
                    //selectColor(e.color.toHex());
                });
                $('#editor-color').colorpicker('setValue', '#000');

                $('#editor-bg-color').colorpicker({
                    //color: '#000000',
                    format: 'hex',
                }).on('changeColor', function (e) {
                    db.setBgColor(e.color.toHex());
                    //selectColor(e.color.toHex());
                });
                $('#editor-bg-color').colorpicker('setValue', '#fff');

                // 颜色选择
                $('#color-list').on('click', '.color-item', function() {
                    var color = $(this).data('color');
                    db.setColor(color);
                    $('#editor-color').colorpicker('setValue', color);

                    /*selectColor(color);
                     $('#color-list').dialog('hide');
                     colors.unshift(color);
                     colors.pop();
                     for (var i = 1; i <= 4; i++) {
                     $('#board-color' + i).css('background-color', colors[i])
                     .attr('data-color', colors[i]);
                     }*/
                });

                //#current-color
                $('#color-dialog').colorpicker({
                    inline: true,
                    format: 'rgb',
                    container: '#color-dialog'
                }).on('changeColor', function (e) {
                    selectColor(e.color.toHex());
                });
                $('#current-color').on('click', function () {
                    $('#color-dialog').dialog({
                        btn: false
                    });
                    /*$('#color-list').dialog({
                     title: '选择颜色',
                     shadeClose: true
                     });*/
                });

                $("[data-toggle='tooltip']").tooltip();

                // 图层
                $('#layer-list').selectable({
                    item: '.layer-item',
                    selected: function(event, item) {
                        var layer = $(item).data('layer');
                        db.setLayer(layer);
                        updateLayer();
                    }
                });
                $('#layer-list').on('click', '.visiable', function () {
                    var layer = $(this).parent().data('layer');
                    if (db.layers[layer - 1].visibility) {
                        $(this).parent().find('.draw-icon-visible').removeClass('draw-icon-visible').addClass('draw-icon-invisible');
                        db.layers[layer - 1].hide();
                    } else {
                        $(this).parent().find('.draw-icon-invisible').removeClass('draw-icon-invisible').addClass('draw-icon-visible');
                        db.layers[layer - 1].show();
                    }
                });
                // 添加图层
                $('#add-layer').on('click', function (e) {
                    e.preventDefault();
                    db.addLayer();
                });
                // 删除图层
                $('#delete-layer').on('click', function (e) {
                    e.preventDefault();
                    db.removeLayer(db.curLayer);
                });


                $('#drawboard').css('background-color', '#fff');
                $('#drawboard').css('background-image', 'none');

                // 显示图层
                function updateLayer() {
                    for (var i = 0; i < 2; i++) {
                        var layer = document.getElementById('layer-preview-' + (i + 1));
                        var ctx = layer.getContext("2d");
                        ctx.clearRect(0, 0, 500, 500);
                        ctx.drawImage(db.layers[i].canvas, 0, 0, 500, 500, 0, 0, 100, 100);
                    }
                }

                function showLayer() {
                    $('#layer-box').dialog({
                        title: '图层',
                        shade: false,
                        btn: false,
                        size: ['500px'],
                        position:  { x: 'leftEdge', y: 'bottomEdge' }
                    });

                    updateLayer();

                    // 水印 TODO
                }

                $('#layer').on('click', function (e) {
                    e.preventDefault();
                    showLayer();
                });

                $('#select2').on('click', function (e) {
                    e.preventDefault();
                    db.select();
                });

                $('#select').on('click', function (e) {
                    e.preventDefault();
                    db.usePlugin('select');
                });

                // 钢笔工具
                $('#pen-list').selectable({
                    item: '.btn'
                });

                $('#pen-draw').on('click', function () {
                    db.setPenMode(1);
                });
                $('#pen-point').on('click', function () {
                    db.setPenMode(2);
                });
                $('#pen-delete').on('click', function () {
                    db.setPenMode(3);
                });
                $('#pen-add').on('click', function () {
                    db.setPenMode(4);
                });
                $('#pen-move').on('click', function () {
                    db.setPenMode(5);
                });

                $('#quick-help').on('click', function (e) {
                    e.preventDefault();
                    bootstro.start('.bootstro', {
                        nextButtonText: '继续 >>',
                        prevButtonText: '<< 返回',
                        finishButtonText: '关闭'
                    });
                });
                $('#help').on('click', function () {
                    ui.frame('help.html', {
                        title: '帮助',
                        //maxmin: true
                    });
                });

                $('#about').on('click', function () {
                    ui.alert('在线涂鸦 v17.5.3', {
                        shade: false,
                        icon: 'icon icon-info'
                    });
                });

                $('#version').on('click', function () {
                    ui.frame('/draw/version.html', {
                        title: '帮助',
                        size: ['600px', '500px']
                        //maxmin: true
                    });
                });

                $('#play-box-close').on('click', function (e) {
                    e.preventDefault();
                    $('#play-box').hide();
                })
            },
            test() {
                this.$router.push('/about')
            }
        }
    }
</script>

<style scoped>

</style>
