

// Set up the Subspace logo overlay
/*function addSubspaceLogo(container) {

    // Set up the div
    $('<div id="subspaceLogo"><a href="http://subspace.research.nicta.com.au/"><img src="../shared/images/subspace_overlay.png" alt="subspace"></a></div>').appendTo(container);

    var v_offset = 0;
    var h_offset = 5;

    // If there's a timeline div
    if ($('.cesium-viewer-timelineContainer').length) {
        v_offset += 30;
    }

    // If there's a timeline div
    if ($('.cesium-viewer-fullscreenContainer').length) {
        if (v_offset === 0) {
            h_offset += 30;
        }
    }
    // Place in bottom right (allowing enough room for timeline)
    $('#subspaceLogo').css({
        'position': 'absolute',
        'width': 'auto',
        'height': 'auto',
        'right': '' + (h_offset) + 'px',
        'bottom': '' + (v_offset) + 'px'
    });
}*/

function getCameraFocus(scene) {
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var window_center = new Cesium.Cartesian2(window.innerWidth / 2, window.innerHeight / 2);
    var cartesian = scene.getCamera().controller.pickEllipsoid(window_center, ellipsoid);
    if (cartesian) {
        return ellipsoid.cartesianToCartographic(cartesian);
    }
}



function getCameraParameters(pos, azimuth, angle, dolly) {
    var ht = Math.sin(angle);
    var dt = Math.cos(angle);
    var x = Math.sin(azimuth);
    var y = -Math.cos(azimuth);
    var fac = 0.00001;
    var ellipsoid = Cesium.Ellipsoid.WGS84;

    //Doing this in world space for now
    var target = ellipsoid.cartographicToCartesian(
                    Cesium.Cartographic.fromDegrees(pos[0], pos[1], pos[2]));

    var cam_dir = ellipsoid.cartographicToCartesian(
                    Cesium.Cartographic.fromDegrees(pos[0] + x * dt * fac, pos[1] + y * dt * fac, pos[2] + ht));
    cam_dir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(cam_dir, target));
    var eye = Cesium.Cartesian3.add(target, Cesium.Cartesian3.multiplyByScalar(cam_dir, dolly));
    var tgt = ellipsoid.cartographicToCartesian(
                    Cesium.Cartographic.fromDegrees(pos[0] + y, pos[1] - x, pos[2]));
    tgt = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(tgt, target));
    var up = Cesium.Cartesian3.cross(tgt, cam_dir);
    return { eye: eye, view: Cesium.Cartesian3.negate(cam_dir), up: up };
}


//determine the distance from the camera to a point
function getCameraDistance(scene, pos) {
    var tx_pos = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
                    Cesium.Cartographic.fromDegrees(pos[0], pos[1], pos[2]));
    return Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(tx_pos, scene.getCamera().position));
};


//determine the distance from the camera to a point
function getCameraHeight(scene) {
    var tx_pos = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
                    Cesium.Cartographic.fromDegrees(150, -40, 0));
    return Cesium.Cartesian3.magnitude(scene.getCamera().position) - Cesium.Cartesian3.magnitude(tx_pos);
}



function updateCamera(scene, min_pos, max_pos) {
    var pos = [(max_pos[0] + min_pos[0]) / 2.0, (max_pos[1] + min_pos[1]) / 2.0, 0];
    var dist = Math.max(Math.max((max_pos[0] - min_pos[0]), (max_pos[1] - min_pos[1])) * 100000.0, 10000);
    var dur = 2500.0;
    var cam = getCameraParameters(pos, 0, Math.PI / 2, dist);
    flyTo({ scene: scene, eye: cam.eye, view: cam.view, up: cam.up, duration: dur });
}

function updateCameraFromExtent(scene, extent) {
    updateCamera(scene, [Cesium.Math.toDegrees(extent.west), Cesium.Math.toDegrees(extent.south)],
        [Cesium.Math.toDegrees(extent.east), Cesium.Math.toDegrees(extent.north)]);
}


//Generalized flyTo function
function flyTo(description) {
    var scene = description.scene;
    var ellipsoid = scene.getPrimitives().getCentralBody().getEllipsoid();

//    resetCameraReferenceFrame(scene.getCamera());

    if (typeof description.eye !== 'undefined') {
        var completeAction;
        if (typeof description.center !== 'undefined') {
            completeAction = function () { setCameraReferenceFrame(scene, description.center); };
        }

        var flight = Cesium.CameraFlightPath.createAnimation(scene, {
            destination: description.eye,
            direction: description.view,
            up: description.up,
            duration: description.duration,
        });
        scene.getAnimations().add(flight);
    }

    if (typeof description.sphere !== 'undefined') {
        var s = description.sphere;
        var center = Cartesian3.clone(s.center);
        var dir = Cartesian3.normalize(Cartesian3.clone(center));
        var endPos = Cartesian3.add(center, Cartesian3.multiplyByScalar(dir, s.radius * 2.0));
        var endLoc = ellipsoid.cartesianToCartographic(endPos);
        var endDir = Cartesian3.multiplyByScalar(Cartesian3.clone(dir), -1.0);
        var endUp = new Cesium.Cartesian3(0.0, 0.0, 1.0);

        console.log('loc: ' + JSON.stringify(endLoc));
        console.log('dir: ' + endDir);
        console.log('up: ' + endUp);

        var flight = Cesium.CameraFlightPath.createAnimation(scene, {
            destination: endPos,
            direction: endDir,
            up: endUp,
            duration: description.duration,
            onComplete: function () {
                setCameraReferenceFrame(scene, center);
            }
        });
        scene.getAnimations().add(flight);
    }
}

/**
 * Allow slow spinning camera rotations
 *
 * @alias SpinCam
 * @constructor
 */
var SpinCam = function () {
    this.prev = new Date();
    this.active = true;
};

/**
 * Spin the camera based on time since last call
 *
 * @param {Scene} [scene] Scene to operate on
 * @param {Cartographic} [cartographic] Cartographic location to spin around
 * @param {float} [angularSpeed] Speed of spin
 */
SpinCam.prototype.constantSpeedSpin = function (scene, cartographic, angularSpeed) {
    if (!this.active) {
        return;
    }

    // only support 3d scene atm
    if (scene.mode !== Cesium.SceneMode.SCENE3D) {
        return;
    }

    var camera = scene.getCamera();
    var ellipsoid = scene.getPrimitives().getCentralBody().getEllipsoid();

    // use elapsed time for constant speed rotation
    var now = new Date();
    var et = (now - this.prev) / 1000;
    // protect against very low frame rate (high et)
    et = Math.min(et, 0.1);
    this.prev = now;

    // work out rotation axis based on vertical cartographic
    var c0 = cartographic;
    var c1 = cartographic.clone();
    c1.height += 10.0;
    var axis = Cesium.Cartesian3.subtract(ellipsoid.cartographicToCartesian(c1), ellipsoid.cartographicToCartesian(c0));

    // now apply the transform to the camera
    var center = ellipsoid.cartographicToCartesian(cartographic);
    var transform = Cesium.Matrix4.fromTranslation(center);
    camera.controller.rotate(axis, -et * angularSpeed, transform);
};



/**
 * DrawExtentHelper from the cesium sample code
 *
*/

var DrawExtentHelper = function (scene, handler) {
    this._canvas = scene.getCanvas();
    this._scene = scene;
    this._ellipsoid = scene.getPrimitives().getCentralBody().getEllipsoid();
    this._finishHandler = handler;
    this._mouseHandler = new Cesium.ScreenSpaceEventHandler(this._canvas);
    this._extentPrimitive = new Cesium.ExtentPrimitive();
    this._extentPrimitive.asynchronous = false;
    this._scene.getPrimitives().add(this._extentPrimitive);
};

DrawExtentHelper.prototype.enableInput = function () {
    var controller = this._scene.getScreenSpaceCameraController();

    controller.enableTranslate = true;
    controller.enableZoom = true;
    controller.enableRotate = true;
    controller.enableTilt = true;
    controller.enableLook = true;
};

DrawExtentHelper.prototype.disableInput = function () {
    var controller = this._scene.getScreenSpaceCameraController();

    controller.enableTranslate = false;
    controller.enableZoom = false;
    controller.enableRotate = false;
    controller.enableTilt = false;
    controller.enableLook = false;
};

DrawExtentHelper.prototype.getExtent = function (mn, mx) {
    var e = new Cesium.Extent();

    // Re-order so west < east and south < north
    e.west = Math.min(mn.longitude, mx.longitude);
    e.east = Math.max(mn.longitude, mx.longitude);
    e.south = Math.min(mn.latitude, mx.latitude);
    e.north = Math.max(mn.latitude, mx.latitude);

    // Check for approx equal (shouldn't require abs due to re-order)
    var epsilon = Cesium.Math.EPSILON7;

    if ((e.east - e.west) < epsilon) {
        e.east += epsilon * 2.0;
    }

    if ((e.north - e.south) < epsilon) {
        e.north += epsilon * 2.0;
    }

    return e;
};

DrawExtentHelper.prototype.setPolyPts = function (mn, mx) {
    this._extentPrimitive.extent = this.getExtent(mn, mx);
};

DrawExtentHelper.prototype.setToDegrees = function (w, s, e, n) {
    var toRad = Cesium.Math.toRadians;
    var mn = new Cesium.Cartographic(toRad(w), toRad(s));
    var mx = new Cesium.Cartographic(toRad(e), toRad(n));
    this.setPolyPts(mn, mx);
};

DrawExtentHelper.prototype.handleRegionStop = function (movement) {
    this.enableInput();
    var cartesian = this._scene.getCamera().controller.pickEllipsoid(movement.position,
            this._ellipsoid);
    if (cartesian) {
        this._click2 = this._ellipsoid.cartesianToCartographic(cartesian);
    }
    this._mouseHandler.destroy();

    this._finishHandler(this.getExtent(this._click1, this._click2));
};

DrawExtentHelper.prototype.handleRegionInter = function (movement) {
    var cartesian = this._scene.getCamera().controller.pickEllipsoid(movement.endPosition,
            this._ellipsoid);
    if (cartesian) {
        var cartographic = this._ellipsoid.cartesianToCartographic(cartesian);
        this.setPolyPts(this._click1, cartographic);
    }
};

DrawExtentHelper.prototype.handleRegionStart = function (movement) {
    var cartesian = this._scene.getCamera().controller.pickEllipsoid(movement.position,
            this._ellipsoid);
    if (cartesian) {
        var that = this;
        this._click1 = this._ellipsoid.cartesianToCartographic(cartesian);
        this._mouseHandler.setInputAction(function (movement) {
            that.handleRegionStop(movement);
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        this._mouseHandler.setInputAction(function (movement) {
            that.handleRegionInter(movement);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
};

DrawExtentHelper.prototype.start = function () {
    this.disableInput();

    var that = this;

    // Now wait for start
    this._mouseHandler.setInputAction(function (movement) {
        that.handleRegionStart(movement);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
};

DrawExtentHelper.prototype.destroy = function () {
    this._scene.getPrimitives().remove(this._extentPrimitive);

}

/**
* A thin wrapper over the cesium viewer to at least add our logo and change home to Australia
* Also provides some consistent ui additions and more startup settings.
*
* @param {Object} the Cesium viewer widget.
* @param {Object} [options] Configuration options for the widget.
* @param {Boolean} [options.showSkyBox=true] Set to <code>false</true> to show the background skybox
* @param {Boolean} [options.showTerrain=false] Set to <code>true</true> to show terrain
* @param {Object} [options.startPosition] override the start position.
* @param {Object} [options.homeButton] override the home button.
*
* @exception {DeveloperError} viewer is required.
*
* @example
* // For each example, include a link to CesiumViewerWidget.css stylesheet in HTML head,
* // and in the body, include: &lt;div id="cesiumContainer"&gt;&lt;/div&gt;
*
* //Widget with no terrain and default Bing Maps imagery provider.
* var widget = new Cesium.CesiumWidget('cesiumContainer');
*
* //Widget with default settings as well as terrain and timeline
* CesiumWidget('cesiumContainer', {
*     showTerrain : true
* });
*
*/

function subspaceViewer(container, options) {

    var viewer = new Cesium.Viewer('cesiumContainer', options);

    var scene = viewer.scene;

    options = Cesium.defaultValue(options, {});

    function defaultOn(flag) {
        return (flag === undefined || flag);
    }
    function defaultOff(flag) {
        return (flag !== undefined && flag);
    }


    if (!defaultOn(options.showSkybox)) {
        //turn off sun when timeline is on
        scene.sun.show = false;
        scene.skyBox.show = false;
    }

    //show terrain
    if (defaultOff(options.showTerrain)) {
        var cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
            url: 'http://cesium.agi.com/smallterrain',
            credit: 'Terrain data courtesy Analytical Graphics, Inc.'
        });
        cesiumTerrainProvider.hasWaterMask = function () { return false; };

        var srtmTerrainProvider = new Subspace.SRTMTerrainProvider({
            url: 'http://subspace-ext.research.nicta.com.au/terrain/topo30/',
            credit: 'Terrain data courtesy SRTM30 Plus V8.0'
        });
        var cb = scene.getPrimitives().getCentralBody();
        cb.terrainProvider = cesiumTerrainProvider;
        cb.depthTestAgainstTerrain = true;
    }


    // ----------------
    //cache the key state
    // ----------------
    var keyState = { ctrlKey: false, shiftKey: false, altKey: false };
    function cacheKeyState(event) {
        for (var p in keyState) {
            keyState[p] = event[p];
        }
    }
    document.onkeydown = cacheKeyState;
    document.onkeyup = cacheKeyState;
    $(window).blur(function () {
        for (var p in keyState) {
            keyState[p] = false;
        }
    });

    // ----------------
    // Add double click zoom
    // ----------------
    function zoomCamera(pos, distFactor) {
        var camera = scene.getCamera();
        if (scene.mode === Cesium.SceneMode.SCENE3D) {
            var cartesian = camera.controller.pickEllipsoid(pos, Cesium.Ellipsoid.WGS84);
            if (cartesian) {
//TODO: add ability to reset target                camera.controller.lookAt(camera.position, cartesian, Cesium.Cartesian3.normalize(cartesian));
                var dist = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(cartesian, camera.position));
                camera.controller.moveForward(dist * distFactor);
            }
        }
        else {
            var dist = camera.controller.getMagnitude();
            camera.controller.moveForward(dist * distFactor);
        }
    }

    var canvas = scene.getCanvas();
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(
        function (movement) {
            zoomCamera(movement.position, -1.5);
        },
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK, Cesium.KeyboardEventModifier.SHIFT);

    handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(
        function (movement) {
            zoomCamera(movement.position, 2.0 / 3.0);
        },
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // -----------------------------------------------
    // moved over from subspace since only called here
    // -----------------------------------------------
    function logView(cam) {
        // an alert makes it easy to copy/paste
        var msg = 'var e = new Cesium.Cartesian3' + cam.positionWC + ';\n'
				+ 'var v = new Cesium.Cartesian3' + cam.directionWC + ';\n'
				+ 'var u = new Cesium.Cartesian3' + cam.upWC + ';\n'
				+ 'scene.getCamera().controller.lookAt(e, e.add(v), u);';
        alert(msg);
    }

    // -----------------------------------------------
    // moved over from subspace since only called here
    // -----------------------------------------------
    function lookAtAustralia(scene, duration, cesium_mode) {
        var e = new Cesium.Cartesian3(-5802994.915164497, 5694926.250766534, -5132847.621559966);
        var v = new Cesium.Cartesian3(0.5481376740820586, -0.5487699130887894, 0.6311867178105279);
        var u = new Cesium.Cartesian3(-0.49546208456325513, 0.3949482453304194, 0.7736492785950537);
        if (duration === undefined) {
            scene.getCamera().controller.lookAt(e, Cesium.Cartesian3.add(e, v), u);
        }
        else {
            var useCesium = Cesium.defaultValue(cesium_mode, false);
            flyTo({ scene: scene, eye: e, view: v, up: u, duration: duration, useCesium: useCesium });
        }
    }
    // ----------------
    //replace home button functionality
    // ----------------
    function subspaceHome(e, options) {
        if (e.shiftKey) {
            logView(scene.getCamera());
        }
        else if (e.ctrlKey) {
            spinCentre = getCameraFocus(scene);
        }
        else {
            if (scene.mode === Cesium.SceneMode.MORPHING) {
                viewer.transitioner.completeMorph();
            }
            if (options) {
                var settings = options;
                settings.scene = scene;
                flyTo(settings);
            }
            else {
                lookAtAustralia(scene);
            }
        }
    }

    function resetHomeButton(viewer, options) {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
            function (commandInfo) {
                commandInfo.cancel = true;
                subspaceHome(keyState, options);
            });
    }

    resetHomeButton(viewer, options.homeButton);

    //add the spin camera on control click
    var spinCamera = new SpinCam();
    var spinCentre = options.spinCentre;

    window.addEventListener("mousedown", function (ev) {
        spinCentre = undefined;
    }, false);

    scene.subview_render = scene.render;
    scene.render = function (tm) {
        if (spinCentre) {
            spinCamera.constantSpeedSpin(scene, spinCentre, 0.02);
        }
        scene.subview_render(tm);
    };

    //add our logo
    //addSubspaceLogo(viewer.container);

    lookAtAustralia(scene);

    //set startup location
    if (options.startPosition) {
        var pos = options.startPosition;
        if (pos.duration) {
            pos.scene = scene;
            flyTo(pos);
        }
        else {
            scene.getCamera().controller.lookAt(pos.eye, Cesium.Cartesian3.add(pos.eye, pos.view), pos.up);
        }
    }

    return viewer;
}


