/*global sharedObject, d3*/

(function() {
    "use strict";

    var polylines = [];
	var colorScale = d3.scale.category20c();//构造一个另外20种颜色的序数比例尺
	var selectedData = "health";
	var selectedNation = 'undefined'
	
	
	$("#radio").buttonset();//选择按钮集中的所有后代
	$("#radio").css("font-size", "12px");
	$("#radio").css("font-size", "12px");
	$("body").css("background-color", "black");
	
	$("input[name='healthwealth']").change(function(d){
		selectedData = d.target.id;//target确定具体哪个元素触发了事件
		updateLineData();
	});

    // Load the data.
    d3.json("nations_geo.json", function(nations) {


        var ellipsoid = viewer.scene.globe.ellipsoid;
        var primitives = viewer.scene.primitives;
        var polylineCollection = new Cesium.PolylineCollection();

        // for each nation defined in nations_geo.json, create a polyline at that lat, lon
        for (var i = 0; i < nations.length; i++){
            var nation = nations[i];

            var widePolyline = polylineCollection.add();
            widePolyline.positions = ellipsoid.cartographicArrayToCartesianArray([
                Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, 0.0),//Cartographic:地理坐标，且经纬度是用弧度表示的//此方法是表示将度数表示的地理坐标转化为弧度表示的地理坐标
                Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, 100.0)
            ]);

            // Set a polyline's width
            var outlineMaterial = Cesium.Material.fromType('PolylineOutline');//选择渲染材料类型PolylineOutline
            outlineMaterial.uniforms.outlineWidth = 3.0;
            outlineMaterial.uniforms.outlineColor = new Cesium.Color(0.0, 0.0, 0.0, 1.0);
            outlineMaterial.uniforms.color = Cesium.Color.fromCssColorString(colorScale(nation.region));//颜色设置为css方式的颜色值,具体颜色用d3中的colorScale来构造
            widePolyline.material = outlineMaterial;

            polylines.push(widePolyline);
        }

        primitives.add(polylineCollection);//在视图中加载polylineCollection
    });

    // called from our custom animate() function whenever the timeline advances 1 year
    // - update all polylines by resizing the polyline，当每年的数据产生变化时，都更新线条
    // - show jquery info window
    function updateLineData() {
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var xScale = d3.scale.log().domain([300, 1e5]).range([0, 10000000.0]);
		var yScale = d3.scale.linear().domain([10, 85]).range([0, 10000000.0]);//此处创建比例尺是为了设置线条的高度，这与d3example中设置的不同（那个是为了显示图表）
        var widthScale = d3.scale.sqrt().domain([0, 5e8]).range([5, 30]);

        for (var i=0; i<polylines.length; i++) {
            var nation = sharedObject.yearData[i];//获取第i个国家在某一年的数据
            var polyline = polylines[i];

			if (selectedData === "health") {
				polyline.positions = ellipsoid.cartographicArrayToCartesianArray([
							   Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, 0.0),
							   Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, yScale(nation.lifeExpectancy))
							   ]);
			} else {
				polyline.positions = ellipsoid.cartographicArrayToCartesianArray([
							   Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, 0.0),
							   Cesium.Cartographic.fromDegrees(nation.lon, nation.lat, xScale(nation.income))
							   ]);
			}
            polyline.width = widthScale(nation.population);

            // push data to polyline so that we have mouseover information available
            polyline.nationData = nation;//将nation数据（即年份数据赋值给polyline.nationData）
			
			if (nation.name === selectedNation) {
				$("#info table").remove();
				$("#info").append("<table> \
				<tr><td>预期寿命:</td><td>" +parseFloat(nation.lifeExpectancy).toFixed(1)+"</td><td>（岁）</td></tr>\
				<tr><td>人均财富:</td><td>" +parseFloat(nation.income).toFixed(1)+"</td><td>（美元）</td></tr>\
				<tr><td>人口总数:</td><td>" +parseFloat(nation.population).toFixed(1)+"</td><td>（人）</td></tr>\
				</table>\
				");
				$("#info table").css("font-size", "12px");
			}

            //polyline.material.uniforms.outlineWidth = yScale(nation.lifeExpectancy);
        }

    }


    var viewer = new Cesium.Viewer('cesiumContainer', 
    		{
    	          fullscreenElement : document.body
    		});
    
	var year = 1800;
    function animate() {
       // var gregorianDate = viewer.clock.currentTime.toGregorianDate();
          var currentTime1 = viewer.clock.currentTime; //JulianDate
          var gregorianDate = Cesium.JulianDate.toGregorianDate(currentTime1);//时间格式转换


        var currentYear = gregorianDate.year + gregorianDate.month/12;// + gregorianDate.day/31;
        if (currentYear !== year && typeof window.displayYear !== 'undefined'){//当year与时间轴上的年份currentYear不等时，更新线条
            window.displayYear(currentYear);//更新显示年份，以及年份数据，该函数写在d3example第138行
            year = currentYear;

            updateLineData();
        }

    }
    
    function tick() {
        viewer.scene.initializeFrame();//初始化框架，useDefaultRenderLoop设置为false
        animate();//根据年份变化更新线条
        viewer.scene.render();//渲染scene,默认情况下是自动渲染的，当useDefaultRenderLoop is set to false时，不自动渲染，
        Cesium.requestAnimationFrame(tick);//反复迭代，以更新时间和线条
    }
    tick();

    //viewer.fullscreenButton.viewModel.fullscreenElement = document.body;
    
    var stamenTonerImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[8];
    viewer.baseLayerPicker.viewModel.selectedImagery = stamenTonerImagery;//选择默认加载的图层

	// setup clockview model
    var yearPerSec = 86400*365;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;//设置时间轴时间循环重新开始
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601("1800-01-02");
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("1800-01-02");
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2009-01-02");
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    viewer.clock.multiplier = yearPerSec*3;//设置tick每次调用时的步长，必须先将Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER设置好//实际上就是设置速度，自己可以调试一下看看
    viewer.clock.shouldAnimate = false;
    viewer.animation.viewModel.setShuttleRingTicks([yearPerSec, yearPerSec*5, yearPerSec*10, yearPerSec*50]);//animation就是指圆形的小钟//此处就是设置ring的范围，就是小钟边上那个小三角形，不懂自己可以注释掉运行看看有什么变化
	
    viewer.animation.viewModel.dateFormatter = function(date, viewModel) {//设置小钟上的时间显示格式
       // var gregorianDate = date.toGregorianDate();
          var gregorianDate = Cesium.JulianDate.toGregorianDate(date);

       

        return 'Year: ' + gregorianDate.year;
    };
    
	// setup timeline  设置时间条
	function onTimelineScrub(e) {
		viewer.clock.currentTime = e.timeJulian;
		viewer.clock.shouldAnimate = false;
	}
	viewer.timeline.addEventListener('settime', onTimelineScrub, false);
	viewer.timeline.updateFromClock();//时间条与时钟同步更新
	viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);	//设置时间条的起始时间
	
	//viewer.scene.morphToColumbusView();
	
	// If the mouse is over the billboard, change its scale and color
	var highlightBarHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);//声明一个屏幕事件处理句柄，参数为待加入事件的元素
	highlightBarHandler.setInputAction(
		function (movement) {
			var pickedObject = viewer.scene.pick(movement.endPosition);
			if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive)) {
				if (Cesium.defined(pickedObject.primitive.nationData)) {
					sharedObject.dispatch.nationMouseover(pickedObject.primitive.nationData);
				}
			}
		},
		Cesium.ScreenSpaceEventType.MOUSE_MOVE
	);
	
	var flyToHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	flyToHandler.setInputAction(
		function (movement) {
			var pickedObject = viewer.scene.pick(movement.position);

			if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive)) {
				if (Cesium.defined(pickedObject.primitive.nationData)) {
					sharedObject.flyTo(pickedObject.primitive.nationData);
				}
			}
		},
		Cesium.ScreenSpaceEventType.LEFT_CLICK
	);
	
	// Response to a nation's mouseover event
	sharedObject.dispatch.on("nationMouseover.cesium", function(nationObject) {
        for (var i=0; i<polylines.length; i++) {
			var polyline = polylines[i];
			if (polyline.nationData.name === nationObject.name) {
				polyline.material.uniforms.color = Cesium.Color.fromCssColorString('#00ff00');
			}
			else {
				polyline.material.uniforms.color = Cesium.Color.fromCssColorString(colorScale(polyline.nationData.region));
			}
        }
		
		selectedNation = nationObject.name;
		
		$("#info table").remove();
		$("#info").append("<table> \
		<tr><td>预期寿命:</td><td>" +parseFloat(nationObject.lifeExpectancy).toFixed(1)+"</td><td>（岁）</td></tr>\
		<tr><td>人均财富:</td><td>" +parseFloat(nationObject.income).toFixed(1)+"</td><td>（美元）</td></tr>\
		<tr><td>人口总数:</td><td>" +parseFloat(nationObject.population).toFixed(1)+"</td><td>（人）</td></tr>\
		</table>\
		");
		$("#info table").css("font-size", "12px");
		$("#info").dialog({
			title : nationObject.name,
			width: 300,
			height: 150,
			modal: false,
			position: {my: "right center", at: "right center", of: "canvas"},
			show: "slow"
		});
      });


	// define functionality for flying to a nation
	// this callback is triggered when a nation is clicked
	var dirCartesian = new Cesium.Cartesian3();
        sharedObject.flyTo = function(d) {//定义flyTo方法
        var ellipsoid = viewer.scene.globe.ellipsoid;
		
        var destination = Cesium.Cartographic.fromDegrees(d.lon, d.lat-20.0, 10000000.0);
        var destCartesian = ellipsoid.cartographicToCartesian(destination);
        destination = ellipsoid.cartesianToCartographic(destCartesian);

        // only fly there if it is not the camera's current position
        if (!ellipsoid
                   .cartographicToCartesian(destination)
                   .equalsEpsilon(viewer.scene.camera.positionWC, Cesium.Math.EPSILON6)) {//Cesium.Math.EPSILON6:即0.000001
                   //viewer.scene.camera.positionWC:得到笛卡尔坐标系表示的世界坐标

           /* var flight = Cesium.CameraFlightPath.createAnimationCartographic(viewer.scene, {
                destination : destination
            });
            viewer.scene.animations.add(flight);
           */
         

           viewer.camera.flyTo({
              destination : Cesium.Cartesian3.fromDegrees(d.lon, d.lat-20.0, 10000000.0)
           });
           
        }
    };

})();