//--测试用卡车模型代码--//
/* var milkTruck = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
        121.444565,
        31.035253,
        0.0),
    scale: 20,
    model: {
        uri: 'model/CesiumMilkTruck.gltf'
    }
});
viewer.zoomTo(milkTruck);  */
//--测试用卡车模型代码

//--全局变量--//
var geoProj = new Cesium.GeographicProjection();
var webMercatorProj = new Cesium.WebMercatorProjection();//投影转换，将wgs84转换为墨卡托

var scene = viewer.scene;
var globe = scene.globe;
var ellipsoid = globe.ellipsoid;
var camera = viewer.camera;

var d_polyline;
var d_polyline2;
var d_polygon;
var billboard;
var pointCollection = new Cesium.PointPrimitiveCollection();
scene.primitives.add(pointCollection);
var movingPolyline = new Cesium.PolylineCollection();
scene.primitives.add(movingPolyline);
var polygonPolyline = new Cesium.PolylineCollection();
scene.primitives.add(polygonPolyline);

var drawing = false;//判断是否已经有绘制的内容了
var editing = false;
var vertexMoving = false;
var movingindex = -1;
var positions = [];
var startPoint;

var leftClick;
var dbClick;
//屏幕事件句柄
var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

var draggingbox = false;
var startX;
var startY;
var startLeft;
var startTop;

var startSceneMode;

var R = 6371000; // 地球半径km

var terrainSamplePositions = [];
var terrainProvider = new Cesium.CesiumTerrainProvider({
	url: '//assets.agi.com/stk-terrain/world'
});

var show = true;
//--全局变量--//




//--DOM元素--//
/*最上面选择按钮添加图标*/
var btn = document.createElement('button');
btn.setAttribute('type','button');
btn.setAttribute('title','MeasureBox');
btn.setAttribute('onclick','toggleMeasureBox()');
btn.setAttribute('class','cesium-button cesium-toolbar-button');
btn.innerHTML = '<img style="padding:1px;" src="img/ruler.png">';
document.getElementsByClassName('cesium-viewer-toolbar')[0].appendChild(btn);//加到右上方选项按钮

var measureBox = document.createElement('div');
measureBox.setAttribute('id', 'measureBox');
measureBox.setAttribute('style','relative');

document.getElementById('cesiumContainer').appendChild(measureBox);
var h1=parseInt(getStyle(title,"height"))+25;
var l1=parseInt(getStyle(navigation,"width"))+10;
measureBox.setAttribute('style', 'left:'+l1+'px;top:'+h1+'px;');

/*操作框 信息框*/
var boxBody = document.createElement('div');
boxBody.setAttribute('id', 'boxBody');
measureBox.appendChild(boxBody);

var boxBody_tit = document.createElement('div');
boxBody_tit.setAttribute('id', 'boxBody_tit');
boxBody_tit.setAttribute('onmousedown', 'mousedown(event)');
document.body.setAttribute('onmousemove', 'mousemove(event)');
boxBody_tit.setAttribute('onmouseup', 'mouseup()');
boxBody.appendChild(boxBody_tit);

var closebtn = document.createElement('span');
closebtn.setAttribute('style','float:left;');
closebtn.innerHTML='<button type="button" class="cesium-infoBox-close" onclick="toggleMeasureBox()" style="position:relative;top:0;left:10px;">×</button>';
boxBody_tit.appendChild(closebtn);

var topTit = document.createElement('p');
topTit.setAttribute('class', 'topTit');
topTit.innerHTML = '测量工具';
boxBody_tit.appendChild(topTit);

var topC0s = ['线条', '路径', '面积', '3D路径', '3D面积'];
for (var i = 0; i < topC0s.length; i++) {
	var topC0 = document.createElement('p');
	topC0.setAttribute('class', 'topC0');
	topC0.innerHTML = topC0s[i];
	boxBody_tit.appendChild(topC0);
	 
}

var boxBody_cnt = document.createElement('div');
boxBody_cnt.setAttribute('id', 'boxBody_cnt');
boxBody.appendChild(boxBody_cnt);

var contents = [
    [{
        id: 'lineTip',
        type: 'tip',
        description: '鼠标单击开始绘制，再次单击结束绘制'
    },{
        id: 'lineDes',
        type: 'description',
        description: '测量地面上两点之间的距离'
    }, {
        id: 'gclength',
        type: 'a',
        name: '地球长度：',
        unit: ['米', '公里']
    }, {
        id: 'geoplength',
        type: 'a',
        name: '地图投影长度：',
        unit: ['米', '公里']
    }, {
        id: 'headingangle',
        type: 'a',
        name: '方位角：',
        unit: ['度']
    }],

    [{
        id: 'pathTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: 'pathDes',
        type: 'description',
        description: '测量地面上多个点之间的距离'
    }, {
        id: 'pathlength',
        type: 'a',
        name: '路径长度：',
        unit: ['米', '公里']
    }, {
        id: 'profile',
        type: 'checkbox',
        name: '显示海拔剖面图'
    }],

    [{
        id: 'areaTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: 'areaDes',
        type: 'description',
        description: '测量地面上几何形状的周长和面积'
    }, {
        id: 'globeA',
        type: 'a',
        name: '面积：',
        unit: ['平方米', '平方公里']
    }, {
        id: 'perimeter',
        type: 'a',
        name: '周长：',
        unit: ['米', '公里']
    }
    ],

    [{
        id: '3DLineTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: '3DLineDes',
        type: 'description',
        description: '测量三维建筑物的高度和宽度，以及从建筑物上的点到地面的距离'
    }, {
        id: '3DLength',
        type: 'a',
        name: '长度：',
        unit: ['厘米', '米', '公里']
    }],

    [{
        id: '3DAreaTip',
        type: 'tip',
        description: '鼠标单击绘制，双击结束绘制'
    },{
        id: '3DAreaDes',
        type: 'description',
        description: '测量三维建筑物上几何形状的面积'
    }, {
        id: '3DArea',
        type: 'a',
        name: '面积：',
        unit: ['平方厘米', '平方米', '平方公里']
    }, {
        id: '3DPerimeter',
        type: 'a',
        name: '周长：',
        unit: ['厘米', '米', '公里']
    }]
];
var emptytag = document.createElement('SPAN');
//emptytag.innerHTML = "鼠标单击绘制，双击结束绘制";
boxBody_cnt.appendChild(emptytag);
for (i = 0; i < contents.length; i++) {
    var content = contents[i];
    var tag = document.createElement('SPAN');
    boxBody_cnt.appendChild(tag);
    for (var j = 0; j < content.length; j++) {
        if (content[j].type == 'a') {
            tag.innerHTML += '<A>' + content[j].name + '</A><A id="' + content[j].id + '"> </A>';
            var units = content[j].unit;
            var selectbox = document.createElement('select');
            selectbox.setAttribute('id', 'sb_' + content[j].id);
            selectbox.setAttribute('onchange', 'calc_' + (i + 1) + '(positions)');
            selectbox.setAttribute('class', 'selectbox');
            tag.appendChild(selectbox);
            //tag.innerHTML+='<select>';
            for (var k = 0; k < units.length; k++) {
                var option = document.createElement('option');
                option.setAttribute('value', units[k]);
                option.innerHTML = units[k];
                selectbox.appendChild(option);
                //selectbox.innerHTML+='<option value="'+units[k]+'">'+units[k]+'</option>';
            }
            //tag.innerHTML+='</select><BR>'
        }
        else if (content[j].type == 'checkbox') {
            tag.innerHTML += '<label style="vertical-align:middle;"><input type="checkbox" style="vertical-align:middle;" id="cb_' + content[j].id + '" /> ' + content[j].name + '</label>';
        }
        else if (content[j].type == 'description') {
            tag.innerHTML += '<P><strong style="color:yellow">' + content[j].description + '<strong></P>';
        }
		else if(content[j].type == 'tip'){
			tag.innerHTML += '<P><strong style="color:yellow">提示: ' + content[j].description + '<strong></P>';
		}
        tag.innerHTML += '<BR>';
    }

}

var footer = document.createElement('div');
footer.setAttribute('id', 'footer');
boxBody.appendChild(footer);

footer.innerHTML += '<label id="mouseControl" style="vertical-align:middle;"><input type="checkbox" id="cb_mouseControl" style="vertical-align:middle;" onchange="toggleMouse(checked)" checked="true" /> 鼠标导航     </label>' + '<label id="editVertex" style="vertical-align:middle;"><input type="checkbox" id="cb_edit" style="vertical-align:middle;" onchange="toggleEdit(checked)" /> 编辑节点 <span style="color:yellow;">(此时不可绘制)</span></label>' +
    '<input type="button" id="clearAll" onclick="clearAll()" value=" 清除 " />';



/*显示剖面图*/
var profileBox = document.createElement('div');
profileBox.setAttribute('id', 'profileBox');
document.body.appendChild(profileBox);


var title1 = document.createElement('A');
title1.setAttribute('id', 'title1');
title1.innerHTML = '海拔（米）  最大值：   平均值：   最小值：';
profileBox.appendChild(title1);

var title2 = document.createElement('A');
title2.setAttribute('id', 'title2');
title2.innerHTML = '距离：   坡度（度）：';
profileBox.appendChild(title2);

var closebtn2 = document.createElement('A');
closebtn2.setAttribute('class','closebtn');
closebtn2.innerHTML='<button type="button" class="cesium-infoBox-close" onclick="toggleProfile()" style="position:relative;top:0;">×</button>';
profileBox.appendChild(closebtn2);

var sampleSelect = document.createElement('A');
sampleSelect.setAttribute('id','sampleSelect');
sampleSelect.innerHTML = '采样点数量：'
profileBox.appendChild(sampleSelect);
var sb_interval = document.createElement('select');
sb_interval.setAttribute('id', 'sb_interval');
sb_interval.setAttribute('onchange', 'drawProfile(positions)');
sb_interval.innerHTML = '<option value=20>20</option><option value=50>50</option><option value=100>100</option>'
sampleSelect.appendChild(sb_interval);

var profileBody = document.createElement('div');
profileBody.setAttribute('id', 'profileBody');
profileBox.appendChild(profileBody);

var charts = document.createElement('div');
charts.setAttribute('id', 'charts');
//charts.setAttribute('style','width:'+profileBox.style.width-40+'px;height:180px;');
//获取网页可视区域的宽度
var winWidth = document.body.clientWidth;
charts.setAttribute('style', 'width:' + winWidth * 0.82+ 'px;height:191px;');

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(charts);

// 指定图表的配置项和数据
var chartOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: '3%',
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                formatter: '{value} 米'
            }
        }
    ],
    series: [
        {
            name: '高度',
            type: 'line',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data: []
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(chartOption);
myChart.on('click', function (params) {
    // 控制台打印数据的名称
    console.log(params);
    viewer.entities.remove(billboard);
    //当在图标上选中某一采样点时，在地球上标记相应的点
    if (terrainSamplePositions.length > 0) {
        var longitude = terrainSamplePositions[params.dataIndex].longitude;
        var latitude = terrainSamplePositions[params.dataIndex].latitude;
        billboard = viewer.entities.add({
            position: Cesium.Cartesian3.fromRadians(longitude, latitude),
            billboard: {
                image: './img/arrow3.png',
                pixelOffset: new Cesium.Cartesian2(0.0, -25),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.0, 1.5e6, 0.8)
            }
        });
    }
    else console.log('terrainSamplePositions is empty');

});
profileBody.appendChild(charts);

//tagNames对应的是测量盒主体里如线条选项中地球长度项的值
tagNames = ['gclength', 'geoplength', 'headingangle', 'pathlength', 'globeA', 'perimeter', '3DLength', '3DArea', '3DPerimeter'];
var Tags = document.getElementById('boxBody_tit').getElementsByTagName('p');
var TagsCnt = document.getElementById('boxBody_cnt').getElementsByTagName('span');
var len = Tags.length;//测量工具盒上方项目的个数
var flag = 1;//修改默认值
for (i = 1; i < len; i++) {
    Tags[i].value = i;
    //Tags[i].onmouseover=function(){changeNav(this.value)};
    Tags[i].onclick = function () {
        //当Tags上的选项被点击时，改变信息框显示部分（#boxBody_tit）的class属性等操作
        changeNav(this.value)
    };
  
    TagsCnt[i].className = 'undis';

}

Tags[flag].className = 'topC1';
TagsCnt[flag].className = 'dis';

//当屏幕大小被改变时，echarts实例对象自适应改变大小
window.onresize = windowResize;

var cb_profile = document.getElementById('cb_profile');
//这个元素及事件控制录制选项中 是否显示海拔剖面图
cb_profile.setAttribute('onchange', 'change_cb(checked)');
//--DOM元素--//


//--功能函数--//
function mousedown(event){
	startX = event.clientX;
	startY = event.clientY;
	startLeft = getNum(getStyle(measureBox,'left'));//获取measure元素的left值,并转化为浮点值
	startTop = getNum(getStyle(measureBox,'top'));
	draggingbox = true;//true表示可以拖动元素
}
function mouseup(){
	draggingbox = false;
}
function mousemove(event){
	if(draggingbox){
		var offsetLeft = startLeft+event.clientX-startX;
		var offsetTop = startTop+event.clientY-startY;
		measureBox.style.left = offsetLeft+'px';
		measureBox.style.top = offsetTop+'px';
		//console.log(offsetLeft,offsetTop);
	}

}
function getNum(text){
	//var value = text.replace(/[^0-9]/ig,"");
	return parseFloat(text)?parseFloat(text):0;		
	//return value;
}

//获取元素相应的样式值
function getStyle(para, attr){  
    //此处不用style获取，是因为style只能获取内联的样式
    //判断是不是IE浏览器，并获取属性值
    var obj;
    obj=(para instanceof HTMLElement)?para:(document.getElementById("para"));
	if(obj.currentStyle)  

	{  
		return obj.currentStyle[attr];  
	}  
    //其他浏览器
	else  
	{  
		return getComputedStyle(obj,null)[attr];  
	}  
}
//清除内容
function clearAll() {
    viewer.entities.remove(d_polyline);
    viewer.entities.remove(d_polyline2);
    viewer.entities.remove(d_polygon);
    viewer.entities.remove(billboard);
    viewer.entities.remove(startPoint);
    clearText();
    positions = [];
    terrainSamplePositions = [];
    movingPolyline.removeAll();
    pointCollection.removeAll();
    polygonPolyline.removeAll();
}

//鼠标导航功能，当“鼠标导航”选项框没有选中时，鼠标不能执行转动地球等操作
function toggleMouse(checked) {
    if (checked) {
        // enable the default event handlers
        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableZoom = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;
    }
    else {
        // disable the default event handlers
        scene.screenSpaceCameraController.enableRotate = false;
        scene.screenSpaceCameraController.enableTranslate = false;
        scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.enableTilt = false;
        scene.screenSpaceCameraController.enableLook = false;
    }
}
//根据是否选中选项框判断是否可以编辑节点（即自由改变已画的节点的位置）
function toggleEdit(checked) {
    if (checked) {
        editing = true;
        drawing = false;
    }
    else {
        editing = false;
    }
}
//当scene发生转变时（即2D，2.5D，3D之间的切换），触发事件
scene.morphStart.addEventListener(morphStart);
scene.morphComplete.addEventListener(morphComplete);
function morphStart(){
	startSceneMode = camera._mode;
	var tags = document.getElementById('boxBody_tit').getElementsByTagName('p');
	//从2D视图变换到其他视图
	if(startSceneMode == Cesium.SceneMode.SCENE2D){
		tags[4].className = 'topC0';
		tags[5].className = 'topC0';
		tags[4].onclick = function () {
				changeNav(this.value)
			};
		tags[5].onclick = function () {
				changeNav(this.value)
			};
	}
}
function morphComplete(){
	var tags = document.getElementById('boxBody_tit').getElementsByTagName('p');
	//从其他视图转到2D视图
	if(camera._mode == Cesium.SceneMode.SCENE2D){		
		for(var i=1;i<tags.length;i++){
			if(tags[i].className == 'topC1' && i<4){
				tags[4].className = 'disable';
				tags[5].className = 'disable';
				tags[4].onclick = '';
				tags[5].onclick = '';
			}
			else if(tags[i].className == 'topC1' && i>3){
				changeNav(1);
				tags[4].className = 'disable';
				tags[5].className = 'disable';
				tags[4].onclick = '';
				tags[5].onclick = '';
			}
		}
	}
	//从3D视图变换到2.5D视图

}


//开始绘制
function startDrawing() {
    globe.depthTestAgainstTerrain = false;
    leftClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    dbClick = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


//为Cesium.ScreenSpaceEventType.LEFT_CLICK设立事件触发时执行的函数
    handler.setInputAction(
        function (click) {
            if(camera._mode === Cesium.SceneMode.SCENE3D){
				var cartesian = scene.pickPosition(click.position);	//将屏幕坐标转化为笛卡尔坐标		
				var ray = camera.getPickRay(click.position);//根据点击时的屏幕坐标产生 Cartesian3 的一条射线，方向指向cartesian的坐标变量
				var intersection = globe.pick(ray, scene);//得到射线与地面的交点cartesian3坐标
				if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
					if (flag == 1) {  //falg=1代表线条测量
						console.log('flag 1');
						if (drawing) {//如果已经有绘制的内容了
							clear();
							positions.push(intersection);
							draw(positions);//绘制线条
							// drawEP(positions[positions.length-1]);
							calc_1(positions);
							drawing = !drawing;
						}
						else if (editing) {
							if(vertexMoving==false) {//判断是否有节点移动了
								var pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								draw(positions);
								calc_1(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//画起始点
							clear();
							positions = [];
							positions.push(intersection);
							drawSP(intersection);
							drawing = !drawing;
						}
					}
					else if (flag == 2) {
						console.log('flag 2');
						if (drawing) {
							clear();
							positions.push(intersection);
							draw(positions);
							//console.log(intersection);
							calc_2(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								draw(positions);
								calc_2(positions);
								drawProfile(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(intersection);
							drawSP(intersection);
							drawing = !drawing;
						}
					}
					else if (flag == 3) {
						console.log('flag 3');
						if (drawing) {
							clear();
							positions.push(intersection);
							drawP(positions);
							calc_3(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								drawP(positions);
								calc_3(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(intersection);
							drawSP(intersection);
							drawing = !drawing;
						}
					}
					else if (flag == 4) {
						console.log('flag 4');
						if (drawing) {//中间点
							clear();
							positions.push(cartesian);
							draw(positions);
							calc_4(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								draw(positions);
								calc_4(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(cartesian);
							drawSP(cartesian);
							drawing = !drawing;
						}
					}
					else if (flag == 5) {
						console.log('flag 5');
						if (drawing) {//中间点
							clear();
							positions.push(cartesian);
							drawP3(positions);
							calc_5(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								drawP3(positions);
								calc_5(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(cartesian);
							drawSP(cartesian);
							drawing = !drawing;
						}
						// console.log(Cesium.Cartographic.fromCartesian(cartesian));
					}
					changeCursor(drawing);
				}
			}
			else if(camera._mode === Cesium.SceneMode.SCENE2D){
				var cartesian2d = camera.pickEllipsoid(click.position,ellipsoid);
				if (Cesium.defined(cartesian2d)) {
					if (flag == 1) {
						console.log('flag 1');
						if (drawing) {
							console.log(2);
							clear();
							//positions.push(intersection);
							positions.push(cartesian2d);
							//draw(positions);
							draw2d(positions);
							// drawEP(positions[positions.length-1]);
							calc_1(positions);
							drawing = !drawing;
						}
						else if (editing) {
							if(vertexMoving==false) {
								var pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								draw2d(positions);
								calc_1(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							console.log(1);
							clear();
							positions = [];
							positions.push(cartesian2d);
							drawSP(cartesian2d);
							drawing = !drawing;
						}
					}
					else if (flag == 2) {
						console.log('flag 2');
						if (drawing) {
							clear();
							positions.push(cartesian2d);
							draw2d(positions);
							//console.log(cartesian2d);
							calc_2(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								draw2d(positions);
								calc_2(positions);
								drawProfile(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(cartesian2d);
							drawSP(cartesian2d);
							drawing = !drawing;
						}
					}
					else if (flag == 3) {
						console.log('flag 3');
						if (drawing) {
							clear();
							positions.push(cartesian2d);
							drawP2d(positions);
							calc_3(positions);
						}
						else if (editing) {
							if(vertexMoving==false) {
								pickedObject = scene.pick(click.position);
								if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
									movingindex = pickedObject.primitive._index;
									vertexMoving = !vertexMoving;
								}
							}
							else{
								clear();
								drawP2d(positions);
								calc_3(positions);
								vertexMoving = !vertexMoving;
								movingindex = -1;
							}
						}
						else {//起始点
							clear();
							positions = [];
							positions.push(cartesian2d);
							drawSP(cartesian2d);
							drawing = !drawing;
						}
					}
					else if (flag == 4) {
						
					}
					else if (flag == 5) {

					}
					changeCursor(drawing);
				}
				
			}
			else if(camera._mode === Cesium.SceneMode.COLUMBUS_VIEW){
/* 				console.log(scene.pickPositionSupported);
				console.log(click.position);
				var cartesian = scene.pickPosition(click.position);
				var cartesian2d = camera.pickEllipsoid(click.position, ellipsoid);
				var ray = camera.getPickRay(click.position);
				var intersection = globe.pick(ray, scene);
				console.log(cartesian);
				//console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(cartesian)));
				console.log(intersection);
				var carto = Cesium.Cartographic.fromCartesian(intersection)
				var lng = Cesium.Math.toDegrees(carto.longitude);
				var lat = Cesium.Math.toDegrees(carto.latitude);
				console.log(lng,lat); */

			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(
        function (dbclick) {
			if(camera._mode === Cesium.SceneMode.SCENE3D){
				var cartesian = scene.pickPosition(dbclick.position);
				var ray = camera.getPickRay(dbclick.position);
				var intersection = globe.pick(ray, scene);
				if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
					if (flag == 1) {
						/* 				if(drawing){
						 clear();
						 //positions.push(intersection);
						 positions.pop();
						 draw(positions);
						 calc_1(positions);
						 positions = [];
						 }
						 drawing = !drawing; */
					}
					else if (flag == 2) {
						if (drawing) {
							clear();
							//positions.push(intersection);
							positions.pop();
							draw(positions);
							// drawEP(positions[positions.length-1]);
							calc_2(positions);
							drawProfile(positions);
							//positions = [];
							drawing = !drawing;
						}

					}
					else if (flag == 3) {
						if (drawing) {
							clear();
							//positions.push(intersection);
							positions.pop();
							drawP(positions);
							calc_3(positions);
							//positions = [];
							drawing = !drawing;
						}
					}
					else if (flag == 4) {
						if (drawing) {
							clear();
							//positions.push(cartesian);
							positions.pop();
							draw(positions);
							// drawEP(positions[positions.length-1]);
							calc_4(positions);
							//positions = [];
							drawing = !drawing;
						}
					}
					else if (flag == 5) {
						if (drawing) {
							clear();
							//positions.push(cartesian);
							positions.pop();
							drawP3(positions);
							calc_5(positions);
							//positions = [];
							drawing = !drawing;
						}
					}
					changeCursor(drawing);
				}				
			}
			else if(camera._mode === Cesium.SceneMode.SCENE2D){
				var cartesian2d = camera.pickEllipsoid(dbclick.position,ellipsoid);
				if (Cesium.defined(cartesian2d)) {
					if (flag == 1) {

					}
					else if (flag == 2) {
						if (drawing) {
							clear();
							//positions.push(intersection);
							positions.pop();
							draw2d(positions);
							// drawEP(positions[positions.length-1]);
							calc_2(positions);
							drawProfile(positions);
							//positions = [];
							drawing = !drawing;
						}

					}
					else if (flag == 3) {
						if (drawing) {
							clear();
							//positions.push(intersection);
							positions.pop();
							drawP2d(positions);
							calc_3(positions);
							//positions = [];
							drawing = !drawing;
						}
					}
					else if (flag == 4) {

					}
					else if (flag == 5) {

					}
					changeCursor(drawing);
				}
			}
		}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    handler.setInputAction(
        function (movement) {                     
			if(camera._mode === Cesium.SceneMode.SCENE3D){
				var cartesian = scene.pickPosition(movement.endPosition);
				var ray = camera.getPickRay(movement.endPosition);
				var intersection = globe.pick(ray, scene);
				if (scene.pickPositionSupported && (Cesium.defined(cartesian) || Cesium.defined(intersection))) {
					if (flag == 1) {
						if (drawing) {
							// calc_1(positions);
							var index = positions.length - 1;
							moveDraw1(positions[index], intersection);
							// positions.pop();
						}
						else if (editing) {
							var pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								// console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, intersection);
								draw(positions);
								calc_1(positions);
							}
						}
					}
					else if (flag == 2) {
						if (drawing) {
							index = positions.length - 1;
							moveDraw1(positions[index], intersection);
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, intersection);
								draw(positions);
								calc_2(positions);
							}
						}
					}
					else if (flag == 3) {
						if (drawing) {
							/* var index = positions.length - 1;
							if (positions.length < 3) moveDraw1(positions[index], intersection);
							else {
								moveDraw2(positions[index], intersection, positions[0]);
							} */
							if(positions.length<2) moveDraw1(positions[0], intersection);
							else{
								clear();
								positions.push(intersection);
								drawP(positions);
								positions.pop();
							}
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, intersection);
								drawP(positions);
								calc_3(positions);
							}
						}
					}
					else if (flag == 4) {
						if (drawing) {
							index = positions.length - 1;
							moveDraw3(positions[index], cartesian);
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, cartesian);
								draw(positions);
								calc_4(positions);
							}
						}
					}
					else if (flag == 5) {
						if (drawing) {
							index = positions.length - 1;
							if (positions.length < 3) moveDraw3(positions[index], cartesian);
							else {
								moveDraw4(positions[index], cartesian, positions[0]);
							}
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, cartesian);
								drawP3(positions);
								calc_5(positions);
							}
						}
					}
				}				
			}
			else if(camera._mode === Cesium.SceneMode.SCENE2D){
				var cartesian2d = camera.pickEllipsoid(movement.endPosition,ellipsoid);
				if (Cesium.defined(cartesian2d)) {
					if (flag == 1) {
						if (drawing) {
							console.log(3);
							// calc_1(positions);
							var index = positions.length - 1;
							moveDraw2d(positions[index], cartesian2d);
							//draw2d(positions);
							// positions.pop();
						}
						else if (editing) {
							var pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								// console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, cartesian2d);
								draw2d(positions);
								calc_1(positions);
							}
						}
					}
					else if (flag == 2) {
						if (drawing) {
							index = positions.length - 1;
							moveDraw2d(positions[index], cartesian2d);
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, cartesian2d);
								draw2d(positions);
								calc_2(positions);
							}
						}
					}
					else if (flag == 3) {
						if (drawing) {
							if(positions.length<2) moveDraw2d(positions[0], cartesian2d);
							else{
								clear();
								positions.push(cartesian2d);
								drawP2d(positions);
								positions.pop();
							}
						}
						else if(editing) {
							pickedObject = scene.pick(movement.endPosition);
							if (Cesium.defined(pickedObject) && pickedObject.id == 'point') {
								scene.canvas.style.cursor = "pointer";
							}
							else scene.canvas.style.cursor = "auto";
							
							if (vertexMoving) {
								console.log("start vertexMoving");
								clear();
								positions = editMoveDraw(movingindex, positions, cartesian2d);
								drawP2d(positions);
								calc_3(positions);
							}
						}
					}
				}
			}
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function stopDrawing() {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(leftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(dbClick, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}
  //之前画的内容全部清除
function clear() {
    viewer.entities.remove(d_polyline);
    viewer.entities.remove(d_polyline2);
    viewer.entities.remove(d_polygon);
    viewer.entities.remove(billboard);
    viewer.entities.remove(startPoint);
    movingPolyline.removeAll();
    polygonPolyline.removeAll();
    pointCollection.removeAll();
}
//改变鼠标放在元素上的形状
function changeCursor(drawing) {
    if (drawing) scene.canvas.style.cursor = "crosshair";
    else scene.canvas.style.cursor = "auto";
}
function drawSP(position) {
    startPoint = viewer.entities.add({
        position: position,
        point: {
            color: Cesium.Color.RED,
            pixelSize: 8
        }
    }); 
}

function lineCut(left, right) {
    // if(Cesium.Cartesian3.distance(left,right))
    var c = Cesium.Cartesian3.angleBetween(left, right);
    if (Cesium.defined(c) && c >= Cesium.Math.RADIANS_PER_DEGREE * 10) {
        var cartoLeft = Cesium.Cartographic.fromCartesian(left);
        var cartoRight = Cesium.Cartographic.fromCartesian(right);
        var num = 10;
        var line = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [Cesium.Math.toDegrees(cartoLeft.longitude), Cesium.Math.toDegrees(cartoLeft.latitude)],
                    [Cesium.Math.toDegrees(cartoRight.longitude), Cesium.Math.toDegrees(cartoRight.latitude)]
                ]
            }
        };
        var length = turf.lineDistance(line, 'kilometers');
        var movingPositions = [];
        for (var i = 0; i <= num; i++) {
            var along = turf.along(line, length / num * i, 'kilometers');
            var longitude = along.geometry.coordinates[0];
            var latitude = along.geometry.coordinates[1];
            var position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
            movingPositions.push(position);
        }
        return movingPositions;
    }
    else {
        return [left, right];
    }
}
function lineCut_Mercator(curPositions){
	var interval = 10;
	var result = [];
	for(var j=0;j<curPositions.length-1;j++){
		var c = Cesium.Cartesian3.angleBetween(curPositions[j], curPositions[j+1]);		
		var cartoLeft = Cesium.Cartographic.fromCartesian(curPositions[j]);//转化为弧度
		var cartoRight = Cesium.Cartographic.fromCartesian(curPositions[j+1]);
		if (Cesium.defined(c) && c >= Cesium.Math.RADIANS_PER_DEGREE * 10) {//c >= Cesium.Math.RADIANS_PER_DEGREE * 10判断C是否大于10度
			if(cartoLeft.longitude!=cartoRight.longitude && cartoLeft.latitude!=cartoRight.latitude){
				var log2 = Math.log(Math.tan(cartoRight.latitude)+1/Math.cos(cartoRight.latitude));
				var log1 = Math.log(Math.tan(cartoLeft.latitude)+1/Math.cos(cartoLeft.latitude));
				var tanK = (cartoRight.longitude-cartoLeft.longitude)/ (log2-log1);
				var K = Math.atan(tanK);
				var c = cartoLeft.longitude - tanK * log1;			
				
				var lat0 = cartoLeft.latitude;
				var dlat = cartoRight.latitude-cartoLeft.latitude;
				var d = dlat/interval;
				var lat;
				var lng;
				for(var i=0;i<interval;i++){
					lat = lat0+i*d;
					lng = c+tanK * Math.log(Math.tan(lat)+1/Math.cos(lat));
					result.push(lng);
					result.push(lat);
				}
				//var c=lngr-math.tan(ar)*math.log(math.tan(latr)+1/math.cos(latr))
				
			}
			else{
				result.push(cartoLeft.longitude);
				result.push(cartoLeft.latitude);
				// result.push(cartoRight.longitude);
				// result.push(cartoRight.latitude);
			}
		}
		else{
			result.push(cartoLeft.longitude);
			result.push(cartoLeft.latitude);
			// result.push(cartoRight.longitude);
			// result.push(cartoRight.latitude);
		}
	}
	result.push(cartoRight.longitude);
	result.push(cartoRight.latitude);
	return result;	
}
function moveDraw1(left, right) {
    var movingPositions = lineCut(left, right);
    var material = Cesium.Material.fromType('Color', {
        color: (flag == 1 || flag == 3) ? Cesium.Color.BLUE : Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: movingPositions,
        material: material,
        width: 3
    });

}
function moveDraw2d(left,right){
	console.log('moveDraw2d start');
	if(left.equals(right)) return;	
	var movingPositions = lineCut_Mercator([left, right]);
    var material = Cesium.Material.fromType('Color', {
        color: (flag == 1 || flag == 3) ? Cesium.Color.BLUE : Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: Cesium.Cartesian3.fromRadiansArray(movingPositions),
        material: material,
        width: 3
    });
	console.log('moveDraw2d stop');
}
function drawVertices(currentPositions) {
    for (var i = 0; i < currentPositions.length; i++) {
        pointCollection.add({
            id: 'point',
            position: currentPositions[i],
            pixelSize: 8,
            color: Cesium.Color.RED
        })
    }

}

function moveDraw3(left, right) {
    var material = Cesium.Material.fromType('Color', {
        color: Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: [left, right],
        material: material,
        width: 3
    });
}
function moveDraw4(left, center, right) {
    var material = Cesium.Material.fromType('Color', {
        color: Cesium.Color.YELLOW
    });
    movingPolyline.removeAll();
    movingPolyline.add({
        positions: [left, center, right],
        material: material,
        width: 3
    });
}
function editMoveDraw(currentIndex, currentPositions, position) {
    if (currentIndex == 0) {
        currentPositions[0] = position;
    }
    else if (currentIndex == (currentPositions.length - 1)) {
        currentPositions[currentPositions.length - 1] = position;
    }
    else{
        currentPositions[currentIndex] = position;
    }
    return currentPositions;
}


//绘制线条poyline
function draw(currentPositions) {
	drawVertices(currentPositions);//绘制点
    d_polyline = viewer.entities.add({//绘制线
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return currentPositions;
            }, false),
            material: (flag == 1) ? Cesium.Color.BLUE : Cesium.Color.YELLOW,
            width: 3
        }
    });
    
}

function draw2d(currentPositions){
	drawVertices(currentPositions);
    d_polyline = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return Cesium.Cartesian3.fromRadiansArray(lineCut_Mercator(currentPositions));
            }, false),
            material: (flag == 1) ? Cesium.Color.BLUE : Cesium.Color.YELLOW,
            width: 3
        }
    });
	console.log('draw2d');
}
function drawP(currentPositions) {
	for(var i = 0; i<currentPositions.length;i++){		
		var material = Cesium.Material.fromType('Color', {
			color: Cesium.Color.BLUE
		});
		if(i==currentPositions.length-1){
			var cutPositions = lineCut(currentPositions[i], currentPositions[0]);
			polygonPolyline.add({
				positions: cutPositions,
				material: material,
				width: 3
			})
		}
		else{
			cutPositions = lineCut(currentPositions[i], currentPositions[i+1]);
			polygonPolyline.add({
				positions: cutPositions,
				material: material,
				width: 3
			})
		}		
	}
    drawVertices(currentPositions);
}
function drawP2d(currentPositions) {	
	var material1 = Cesium.Material.fromType('Color', {
	color: Cesium.Color.BLUE
	});	
	var material2 = Cesium.Material.fromType('Color', {
	color: Cesium.Color.BLUE
	});
	var len = currentPositions.length;
	var cutPositions1 = Cesium.Cartesian3.fromRadiansArray(lineCut_Mercator([currentPositions[len-1], currentPositions[0]]));
	polygonPolyline.add({
		positions: cutPositions1,
		material: material1,
		width: 3
	})

	var cutPositions2 = Cesium.Cartesian3.fromRadiansArray(lineCut_Mercator(currentPositions));
	polygonPolyline.add({
		positions: cutPositions2,
		material: material2,
		width: 3
	})
	
    drawVertices(currentPositions);
}
function drawP3(currentPositions) {
    //currentPositions.push(currentPositions[0]);
    //console.log('before draw: '+currentPositions);
    d_polyline = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return currentPositions;
            }, false),
            material: Cesium.Color.YELLOW,
            width: 3
        }
    });
    if (currentPositions.length > 2) {
        d_polyline2 = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(function () {
                    return [currentPositions[0], currentPositions[currentPositions.length - 1]];
                }, false),
                material: Cesium.Color.YELLOW,
                width: 3
            }
        });
    }
    drawVertices(currentPositions);
}

function gcDist(left, right) {
    //基于Haversine formula计算大圆线长度
    var carto1 = Cesium.Cartographic.fromCartesian(left);
    var carto2 = Cesium.Cartographic.fromCartesian(right);

    var lat1 = carto1.latitude;
    var lat2 = carto2.latitude;
    var lon1 = carto1.longitude;
    var lon2 = carto2.longitude;

    var dLat = Math.abs(lat1 - lat2);
    var dLon = Math.abs(lon1 - lon2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    return {angle: c, dist: d};
}
function calc_1(curPositions) {
    var len = curPositions.length;
    //var length = 0;//Cartesian3 distance
    var length1 = 0;//GeographicProjection distance
    //var length2 = 0;//WebMercatorProjection distance
    var length3 = 0;//大圆线
    var left1, right1, left2, right2;
	//if(camera._mode === Cesium.SceneMode.SCENE3D) var carto = Cesium.Cartographic.fromCartesian(curPositions[0]);
	//else var carto = ellipsoid.cartesianToCartographic(curPositions[0]);
	var carto = Cesium.Cartographic.fromCartesian(curPositions[0]);//获得包含地理坐标（经度，纬度和高度）的实例
    right1 = geoProj.project(carto);//转换为Cartesian3坐标
    right1.height = 0;
    right2 = webMercatorProj.project(carto);//转化为webMercatorProj投影下的坐标
    right2.height = 0;
    for (var i = 0; i < len - 1; i++) {
        var carto0 = Cesium.Cartographic.fromCartesian(curPositions[i + 1]);
        carto0.height = 0;

        left1 = right1;
        right1 = geoProj.project(carto0);
        left2 = right2;
        right2 = webMercatorProj.project(carto0);

        //length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i+1]);
        //计算长度
        length1 += Cesium.Cartesian3.distance(left1, right1);

        //length2 += Cesium.Cartesian3.distance(left2, right2);

        //基于Haversine formula计算大圆线长度
        length3 += gcDist(curPositions[i], curPositions[i + 1]).dist;
    }

    var A = 0;
    var a = Cesium.Cartographic.fromCartesian(curPositions[0]);
    var b = Cesium.Cartographic.fromCartesian(curPositions[1]);
    var c = Cesium.Cartesian3.angleBetween(curPositions[0], curPositions[1]);//两个点之间的夹角，弧度

    var sin_c = Math.sqrt(1 - Math.cos(c) * Math.cos(c));
    A = Math.asin((Math.sin(Math.PI / 2 - b.latitude) * Math.sin(b.longitude - a.longitude)) / sin_c);
    if (Math.abs(b.longitude - a.longitude) < Math.PI) {
        if (b.longitude > a.longitude && b.latitude > a.latitude) A = A;
        else if (b.longitude <= a.longitude && b.latitude > a.latitude) A = Math.PI * 2 + A;
        else A = Math.PI - A;
    }
    else {
        if (b.longitude < a.longitude && b.latitude > a.latitude) A = A;
        else if (b.longitude >= a.longitude && b.latitude > a.latitude) A = Math.PI * 2 + A;
        else A = Math.PI - A;
    }
    A = Cesium.Math.toDegrees(A);//得到方位角
    unitDetect_1(document.getElementById('sb_gclength').value, 'gclength', length3);//得到地球长度
    unitDetect_1(document.getElementById('sb_geoplength').value, 'geoplength', length1);//得到地图投影长度
    document.getElementById('headingangle').innerHTML = A.toFixed(2);

    console.log('Azimuth: ' + Cesium.Math.toDegrees(A));
    //console.log('Cartesian3 distance: '+length);
    //document.getElementById('3DLength').innerHTML = length.toFixed(2);
    console.log('GeographicProjection distance: ' + length1);
    //document.getElementById('geoplength').innerHTML = length1.toFixed(2);
    console.log('Great Circle distance: ' + length3);
    //document.getElementById('gclength').innerHTML = length3.toFixed(2);

    return [length3, length1, A];
}
function calc_2(curPositions) {
    var len = curPositions.length;
    //var length2 = 0;//WebMercatorProjection distance
    var length = 0;//大圆线
    for (var i = 0; i < len - 1; i++) {
        //基于Haversine formula计算大圆线长度
        var carto1 = Cesium.Cartographic.fromCartesian(curPositions[i]);
        var carto2 = Cesium.Cartographic.fromCartesian(curPositions[i + 1]);

        var lat1 = carto1.latitude;
        var lat2 = carto2.latitude;
        var lon1 = carto1.longitude;
        var lon2 = carto2.longitude;

        var dLat = Math.abs(lat1 - lat2);
        var dLon = Math.abs(lon1 - lon2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        length += R * c;
    }
    console.log('Great Circle distance: ' + length);
    //console.log('WebMercatorProjection distance: '+length2);
    unitDetect_1(document.getElementById('sb_pathlength').value, 'pathlength', length);

    return length;
}
function calc_3(curPositions) {
    var carto;
    var cartoArray = [];
    for (var i = 0; i < curPositions.length; i++) {
        carto = Cesium.Cartographic.fromCartesian(curPositions[i]);
        //console.log(carto);
        cartoArray.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
    }
    /* cartoArray.pop();
     cartoArray.pop(); */
    carto = Cesium.Cartographic.fromCartesian(curPositions[0]);
    cartoArray.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);

    var polygon = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [cartoArray]
        }
    };
    var line = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": cartoArray
        }
    };
    var a = turf.area(polygon);
    var length = 1000 * (turf.lineDistance(line, 'kilometers'));
    unitDetect_1(document.getElementById('sb_perimeter').value, 'perimeter', length);
    unitDetect_2(document.getElementById('sb_globeA').value, 'globeA', a);
    console.log('turf area: ' + a);
    console.log('turf length: ' + length);
    return [a, length];
}
function calc_4(curPositions) {
    var len = curPositions.length;
    var length = 0;//Cartesian3 distance

    for (var i = 0; i < len - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DLength').value, '3DLength', length);
    return length;
}
function calc_5_1(curPositions) {
    var len = curPositions.length;
    var p0 = curPositions[0];
    var a0 = 0;

    for (i = 1; i < len - 1; i++) {
        var p1 = curPositions[i];
        var p2 = curPositions[i + 1];
        var p0p1 = vec3sub(p1, p0);
        var p0p2 = vec3sub(p2, p0);
        var cross = vec3cross(p0p1, p0p2);
        a0 += vec3mod(cross);

    }
    a0 = a0 / 2;

    var length = 0;//Cartesian3 distance

    for (i = 0; i < len - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    length += Cesium.Cartesian3.distance(curPositions[len - 1], curPositions[0]);
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DPerimeter').value, '3DPerimeter', length);

    console.log('Cartesian3 Area: ' + a0);
    unitDetect_2(document.getElementById('sb_3DArea').value, '3DArea', a0);
    return [a0, length];
}
function calc_5(curPositions){
    var error = 1;//判断多边形共面的角度误差
    var a0 = 0;
    var preCross = new Cesium.Cartesian3();
    var final = false;
    var p0 = curPositions[0];
    if(curPositions.length>2){
        for (i = 1; i < curPositions.length - 1;i++) {
            var p1 = curPositions[i];
            var p2 = curPositions[i+1];
            var p0p1 = vec3sub(p1, p0);
            var p0p2 = vec3sub(p2, p0);
            var cross = vec3cross(p0p1, p0p2);
            var angle = Cesium.Cartesian3.angleBetween(cross, preCross)/Math.PI*180;
            console.log(angle);
            if(Math.abs(angle-0)<error||Math.abs(angle-180)<error||!angle) {
                // console.log('共面');
                preCross = vec3add(preCross,cross);
                final =true;
            }
            else {
                // console.log('不共面');
                a0 +=vec3mod(preCross);
                preCross = cross;
                final = false;

            }
            // a0 += vec3mod(cross);
        }
        if(final) a0+=vec3mod(preCross);
        else a0+=vec3mod(cross);
        a0 = a0 / 2;
    }

    var length = 0;//Cartesian3 distance

    for (i = 0; i < curPositions.length - 1; i++) {
        length += Cesium.Cartesian3.distance(curPositions[i], curPositions[i + 1]);
    }
    length += Cesium.Cartesian3.distance(curPositions[curPositions.length - 1], curPositions[0]);
    console.log('Cartesian3 distance: ' + length);
    unitDetect_1(document.getElementById('sb_3DPerimeter').value, '3DPerimeter', length);

    console.log('Cartesian3 Area: ' + a0);
    unitDetect_2(document.getElementById('sb_3DArea').value, '3DArea', a0);
    return [a0, length];
}
function vec3add(left, right) {
    var result = new Cesium.Cartesian3();
    result.x = left.x + right.x;
    result.y = left.y + right.y;
    result.z = left.z + right.z;
    return result;
}
function vec3sub(left, right) {
    var result = new Cesium.Cartesian3();

    result.x = left.x - right.x;
    result.y = left.y - right.y;
    result.z = left.z - right.z;
    return result;
}
function vec3cross(left, right) {
    var leftX = left.x;
    var leftY = left.y;
    var leftZ = left.z;
    var rightX = right.x;
    var rightY = right.y;
    var rightZ = right.z;

    var x = leftY * rightZ - leftZ * rightY;
    var y = leftZ * rightX - leftX * rightZ;
    var z = leftX * rightY - leftY * rightX;

    var result = new Cesium.Cartesian3();
    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}
function vec3mod(cartesian) {
    return Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
}
function maxMeanMin(arrays) {
    var max = -1000;
    var min = 10000000;
    var sum = 0;
    for (var i = 0; i < arrays.length; i++) {
        sum += arrays[i];
        max = Math.max(max, arrays[i]);
        min = Math.min(min, arrays[i]);
    }
    var mean = sum / (arrays.length);
    return [max, mean, min];
}

//document.body.setAttribute('onresize','windowResize');
function windowResize() {
    var winWidth = document.body.clientWidth;
    //alert(winWidth);
    //var charts = document.getElementById('charts');
    charts.setAttribute('style', 'width:' + winWidth * 0.99 + 'px;height:191px;');
    myChart.resize();
}


//控制是否显示海拔剖面图
function change_cb(checked) {
    if (checked) document.getElementById('profileBox').className = 'show';
    else document.getElementById('profileBox').className = 'hide';
}
function toggleProfile(){
	var cb_profile = document.getElementById('cb_profile');
	if(cb_profile.checked){
		document.getElementById('profileBox').className = 'hide';
		cb_profile.checked = false;
	}
}

//将测量盒的显示内容切换到当前选中选项，并进行相关处理
function changeNav(v) {
    clear();
    positions = [];
    terrainSamplePositions = [];
    drawing = false;
    changeCursor(drawing);
    /* for(var i = 0;i<tagNames.length;i++){
     console.log(tagNames[i]);
     document.getElementById(tagNames[i]).innerHTML = ' ';
     } */
    clearText();//清楚测量盒中测量结果的值
    Tags[flag].className = 'topC0';
    TagsCnt[flag].className = 'undis';
    flag = v;
    //将V值所代表的当前选项改变其类名
    Tags[v].className = 'topC1';
    TagsCnt[v].className = 'dis';
    console.log(flag);
    //前三个选项中不具备三维测量功能
    if (flag == 1 || flag == 2 || flag == 3) globe.depthTestAgainstTerrain = false;
    else globe.depthTestAgainstTerrain = true;
}

//清除测量盒中测量结果的值
function clearText() {
    for (var i = 0; i < tagNames.length; i++) {
        console.log(tagNames[i]);
        document.getElementById(tagNames[i]).innerHTML = ' ';
    }
}
function unitDetect_1(unit, id, value) {
    if (unit == '米') document.getElementById(id).innerHTML = value.toFixed(2);
    else if (unit == '公里') document.getElementById(id).innerHTML = (value / 1000).toFixed(2);
    else if (unit == '厘米') document.getElementById(id).innerHTML = (value * 100).toFixed(2);
}
function unitDetect_2(unit, id, value) {
    if (unit == '平方米') document.getElementById(id).innerHTML = value.toFixed(2);
    else if (unit == '平方公里') document.getElementById(id).innerHTML = (value / 1000000).toFixed(2);
    else if (unit == '平方厘米') document.getElementById(id).innerHTML = (value * 10000).toFixed(2);
}

function drawProfile(curPositions) {
	if(curPositions.length>1){
		var interval = parseInt(document.getElementById('sb_interval').value);
		console.log(interval);
		terrainSamplePositions = [];
		var cartoArr = [];
		for (i = 0; i < curPositions.length; i++) {
			var carto = Cesium.Cartographic.fromCartesian(curPositions[i]);
			cartoArr.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)]);
		}
		var line = {
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": cartoArr
			}
		};
		//var line = turf.lineString(cartoArr);
		var length = turf.lineDistance(line, 'kilometers');

		for (i = 0; i <= interval; i++) {
			var along = turf.along(line, length / interval * i, 'kilometers');
			var longitude = along.geometry.coordinates[0];
			var latitude = along.geometry.coordinates[1];
			var position = Cesium.Cartographic.fromDegrees(longitude, latitude);
			terrainSamplePositions.push(position);
		}
		
		 myChart.showLoading();
		var promise = Cesium.sampleTerrain(terrainProvider, 9, terrainSamplePositions);

		var categories = [];
		var heights = [];
		promise.then(function () {
			var m2km = false;
			if (Math.round(length / interval * 1000) > 1000) m2km = true;
			for (var i = 0; i < terrainSamplePositions.length; i++) {
				//var height = terrainSamplePositions[i].height;
				var height = parseFloat(terrainSamplePositions[i].height.toFixed(2));
				var tag = m2km ? ((length / interval * i).toFixed(0) + '公里') : ((length / interval * i * 1000).toFixed(0) + '米');//单位转换
				categories.push(tag);
				heights.push(height);
				//console.log(height);
				myChart.hideLoading();
				myChart.setOption({
					xAxis: {
						data: categories
					},
					series: [{
						// 根据名字对应到相应的系列
						data: heights
					}]
				});
				var data = maxMeanMin(heights);
				document.getElementById('title1').innerHTML = '海拔（米）  最大值：<span style="color:red"><strong>' + data[0] + '</strong> 米</span>   平均值：<span style="color:red"><strong>' + data[1].toFixed(2) + '</strong> 米</span>   最小值：<span style="color:red"><strong>' + data[2] + '</strong> 米</span>';
				document.getElementById('title2').innerHTML = '距离：<span style="color:red"><strong>' + (m2km ? length.toFixed(0) + ' 公里</strong>' : (length * 1000).toFixed(0) + ' 米</strong>') + '</span>';
			}
			//loading.className='hide';
		}).otherwise(function (error) {
			//Display any errrors encountered while loading.
			console.log(error);
		}); 
	}
    
}


//当测量盒开启式执行的函数
function toggleMeasureBox() {
    var measureBox = document.getElementById('measureBox');
    var profile = document.getElementById('profileBox');
    var cb_profile = document.getElementById('cb_profile');//是否显示海拔剖面的选项
    var cb_mouseControl = document.getElementById('cb_mouseControl');//鼠标是否具有导航功能的元素
    if (show) {
        console.log('show: ' + show);
        measureBox.className = 'show';
        startDrawing();//可以绘制了
    }
    else {
        console.log('show: ' + show);
        measureBox.className = 'hide';
        profile.className = 'hide';
        cb_profile.checked = false;
        cb_mouseControl.checked = true;
        toggleMouse(true);
        clear();
        clearAll();
        stopDrawing();//停止绘制
		globe.depthTestAgainstTerrain = false;
    }
    show = !show;
}
