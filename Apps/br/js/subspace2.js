/*!
 * Copyright(c) 2012-2013 National ICT Australia Limited (NICTA).  All rights reserved.
 */
/**
 * almond 0.0.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

(function() {
    var e, t, r; 
    (function(n) {
        function f(e, t) {
            if (e && e.charAt(0) === "." && t) { //charAt()返回指定位置的字符
                t = t.split("/"),
                t = t.slice(0, t.length - 1),
                e = t.concat(e.split("/")); //slice:切割出数组,contact:连接数组
                var n, r;
                for (n = 0; r = e[n]; n++) if (r === ".") e.splice(n, 1),//如果有'.'，则去掉
                n -= 1;
                else if (r === "..") { //slice删除或者添加项目
                    if (n === 1 && (e[2] === ".." || e[0] === "..")) break;
                    n > 0 && (e.splice(n - 1, 2), n -= 2)
                }
                e = e.join("/") //把数组元素放入字符串，并使用分隔符
            }
            return e
        }

        function l(e, t) {
            return function() {
                return a.apply(n, o.call(arguments, 0).concat([e, t])) //对象o，a见69行，call（obj,params）,若obj省略，则自动生成全局对象
            }
        }

        function c(e) {
            return function(t) {
                return f(t, e)
            }
        }

        function h(e) {
            return function(t) {
                i[e] = t //i声明在62行
            }
        }

        function p(e) {
            if (s.hasOwnProperty(e)) { //s声明在68行
                var t = s[e];
                delete s[e],//如果s中有该属性，则删除该属性
                u.apply(n, t)
            }
            return i[e]//返回属性值i[e]
        }

        function d(e, t) {
            var n, r, i = e.indexOf("!");
            return i !== -1 ? (n = f(e.slice(0, i), t)/*调用f(e,t)，其中参数e中去掉'!'*/, e = e.slice(i + 1), r = p(n)/*调用函数p(e)*/, r && r.normalize ? e = r.normalize(e, c(t)) : e = f(e, t)) : e = f(e, t),//f(e,t)第十三行声明，如果i不存在，则返回e=f(e,t)
            {
                f: n ? n + "!" + e: e,
                n: e,
                p: r
            }
        }

        var i = {},
        s = {},
        o = [].slice,
        u,
        a;
        if (typeof r == "function") return;//此处return的用法表示结束函数运行，且无返回值
        u = function(e, t, r, o) {
            var u = [],
            a,
            f,
            c,
            v,
            m,
            g;
            o || (o = e);
            if (typeof r == "function") { ! t.length && r.length && (t = ["require", "exports", "module"]);//在函数r有参数或者且t没有成员时如是处理
                for (v = 0; v < t.length; v++) {
                    g = d(t[v], o),
                    c = g.f;
                    if (c === "require") u[v] = l(e);
                    else if (c === "exports") u[v] = i[e] = {},
                    a = !0;
                    else if (c === "module") f = u[v] = {
                        id: e,
                        uri: "",
                        exports: i[e]
                    };
                    else if (i.hasOwnProperty(c) || s.hasOwnProperty(c)) u[v] = p(c);
                    else {
                        if (!g.p) throw e + " missing " + c;
                        g.p.load(g.n, l(o, !0), h(c), {}),
                        u[v] = i[c]
                    }
                }
                m = r.apply(i[e], u),
                e && (f && f.exports !== n ? i[e] = f.exports: a || (i[e] = m))
            } else e && (i[e] = r)
        },
        e = a = function(e, t, r, i) {
            return typeof e == "string" ? p(d(e, t).f) : (e.splice || (t.splice ? (e = t, t = arguments[2]) : e = []), i ? u(n, e, t, r) : setTimeout(function() {
                u(n, e, t, r)
            },
            15), a)
        },
        a.config = function() {
            return a
        },
        t || (t = a),
        r = function(e, t, n) {
            t.splice || (n = t, t = []),
            r.unordered ? s[e] = [e, t, n] : u(e, t, n)
        },
        r.amd = {
            jQuery: !0
        }
    })(),
    r("../../../ThirdParty/almond-0.2.6/almond.js",
    function() {}),
    r("scene/VarType", [],
    function() {
        var t = {
            LON: "LON",
            LAT: "LAT",
            ALT: "ALT",
            TIME: "TIME",
            SCALAR: "SCALAR",
            ENUM: "ENUM"
        };
        return t
    }),
    r("scene/Variable", ["./VarType"],
    function(e) {
        function s(e) {
            return ! isNaN(parseFloat(e)) && isFinite(e) //isnan 检测参数是否为非数值值,isFinite检测数字是否有限
        }

        function o(e) {
            var t = e.split(/[/ - ] / );
            return t.length === 3 && (e = t[1] + "/" + t[0] + "/" + t[2]),
            e
        }

        var t = Cesium.defaultValue,
        n = Cesium.Enumeration,
        /*Cesium.Enumeration不存在*/
        r = function() {
            this.vals = [],
            this.fNoData = 1e-34,
            this.min = undefined,
            this.max = undefined,
            this.min = undefined,
            this.type = undefined,
            this.time_var = undefined,
            this.enum_list = undefined
        };
        return r.prototype.calculateVarMinMax = function() {
            var e = this.vals,
            t = Number.MAX_VALUE,
            n = -Number.MAX_VALUE; //Number.MAX_VALUE,js表示的最大的数
            for (i = 0; i < e.length; i++) e[i] === undefined || e[i] === null ? e[i] = this.fNoData: (t > e[i] && (t = e[i]), n < e[i] && (n = e[i])); //if语句的简写模式
            //如果e[i]为undefine或者null则...
            this.min = t,
            this.max = n
        },
        r.prototype._calculateTimeMinMax = function() {
            var e = this.vals,
            t = e[0],
            n = e[0];
            for (i = 1; i < e.length; i++) t.greaterThan(e[i]) && (t = e[i]),
            n.lessThan(e[i]) && (n = e[i]);
            this.min = t,
            this.max = n
        },
        r.prototype.calculateTimeVar = function() {
            function t(e) {
                return Cesium.JulianDate.fromDate(new Date(e))
            }

            function n(e) {
                var t = Cesium.JulianDate.fromDate(new Date("January 1, 1970 0:00:00"));
                return t = t.addDays(Math.floor(e) - 25569),
                t = t.addSeconds((e - Math.floor(e)) * 60 * 60 * 24),
                t
            }

            function i(e) {
                return Cesium.JulianDate.fromDate(Date.setTime(e)) //setTime() 以毫秒设置 Date 对象
            }

            function u(e) {
                var t = new Cesium.JulianDate(0, 0),
                n = e.toString(),
                r = parseInt(n.substring(0, 4), 10),
                i = parseInt(n.substring(4, 7), 10);
                if (n.length !== 14 || r < 1950 || r > 2050 || i > 366) return t;
                var s = new Date;
                return s.setUTCFullYear(r),
                s.setUTCHours(n.substring(7, 9), n.substring(9, 11), n.substring(11, 13)),
                t = Cesium.JulianDate.fromDate(s).addDays(i),
                t
            }

            if (this.type !== e.TIME) return;
            var a = new r,
            f = this.vals,
            l;
            parseInt(f[0], 10) > 5e5 ? u(f[0]).getJulianDayNumber() !== 0 ? l = u: l = i: s(f[0]) ? l = n: l = t;
            var c = !1;
            try {
                for (var h = 0; h < f.length; h++) a.vals[h] = l(f[h]);
                c = !0
            } catch(p) {
                if (l === t) {
                    console.log("Trying swap of day and month in date strings"),
                    a.vals = [];
                    try {
                        for (var h = 0; h < f.length; h++) a.vals[h] = l(o(f[h]));
                        c = !0
                    } catch(p) {}
                }
            }
            c ? (a._calculateTimeMinMax(), this.time_var = a) : (this.type = e.SCALAR, console.log("Unable to parse time variable"))
        },
        r.prototype.calculateEnumVar = function() {
            if (this.type !== e.ENUM) return;
            var t = [];
            for (var n = 0; n < this.vals.length; n++) {
                this.vals[n] === this.fNoData && (this.vals[n] = "undefined");
                var r = t.indexOf(this.vals[n]);
                r === -1 && (r = t.length, t.push(this.vals[n])),
                this.vals[n] = parseFloat(r)
            }
            this.enum_list = t,
            this.calculateVarMinMax()
        },
        r.prototype.guess_var_type = function(t) {
            function n(e, t) {
                var e = e.toLowerCase();
                for (var n in t) {
                    var r = t[n].toLowerCase();
                    if (e.indexOf(r) === 0 || e.indexOf(" " + r) !== -1 || e.indexOf("_" + r) !== -1) return ! 0
                }
                return ! 1
            }

            var r = [{
                hints: ["lon"],
                type: e.LON
            },
            {
                hints: ["lat"],
                type: e.LAT
            },
            {
                hints: ["depth", "height", "elevation"],
                type: e.ALT
            },
            {
                hints: ["time", "date"],
                type: e.TIME
            }];
            for (var i in r) if (n(t, r[i].hints)) {
                this.type = r[i].type;
                return
            }
            this.type = e.SCALAR
        },
        r.prototype.destroy = function() {
            return Cesium.destroyObject(this)
        },
        r
    }), r("scene/Dataset", ["./VarType", "./Variable"],
    function(e, t) {
        function s(e, t) {
            return Math.abs((e - t) / t) < 1e-5
        }

        var n = Cesium.defaultValue,
        r = {},
        i = function(e) {
            e = n(e, r),
            this._nodata_val = n(e.NoDataValue, 1e-34),
            this._pnt_cnt = 0,
            this._data_shape = undefined,
            this._varID = [],
            this._variables = undefined,
            this._loading_data = !1,
            this.loadDataset(e)
        };
        return i.prototype.getMetadata = function(t) {
            t === undefined && (t = "\n");
            var n = b_out = "";
            t === "<br>" && (n = "<b>", b_out = "</b>");
            var r = n + "dataset" + b_out + ": " + this._url;
            r += t + n + "variable" + b_out + ": " + this._varID[e.SCALAR],
            r += t + n + "points" + b_out + ": " + this._pnt_cnt,
            r += t + n + "shape" + b_out + ": " + this._data_shape;
            for (var i in this._variables) r += t + n + i + b_out + " (" + this._variables[i].type.toString() + ")",
            this._variables[i].type === e.TIME ? r += ": min: " + this._variables[i].time_var.min.toDate().toLocaleString() + t + "max: " + this._variables[i].time_var.max.toDate().toLocaleString() : r += ": min: " + this._variables[i].min + ", max: " + this._variables[i].max;
            return r
        },
        i.prototype.getDataText = function(t, n) {
            n === undefined && (n = "\n");
            var r = b_out = "";
            n === "<br>" && (r = "<b>", b_out = "</b>");
            var i = r + "point" + b_out + ": " + t;
            for (var s in this._variables) i += n + r + s + b_out + ": ",
            this._variables[s].type === e.TIME ? i += this._variables[s].time_var.vals[t].toDate().toLocaleString() : this._variables[s].type === e.ENUM ? i += this._variables[s].enum_list[this._variables[s].vals[t]] : i += this._variables[s].vals[t];
            return i
        },
        i.prototype.getMinPos = function() {
            var t = [0, 0, 0],
            n = [e.LON, e.LAT, e.ALT];
            for (var r in n) this._varID[n[r]] && (t[r] = this._variables[this._varID[n[r]]].min);
            return t
        },
        i.prototype.getMaxPos = function() {
            var t = [0, 0, 0],
            n = [e.LON, e.LAT, e.ALT];
            for (var r in t) this._varID[n[r]] && (t[r] = this._variables[this._varID[n[r]]].max);
            return t
        },
        i.prototype.getMinVal = function() {
            if (this._variables && this._varID[e.SCALAR]) return this._variables[this._varID[e.SCALAR]].min
        },
        i.prototype.getMaxVal = function() {
            if (this._variables && this._varID[e.SCALAR]) return this._variables[this._varID[e.SCALAR]].max
        },
        i.prototype.getMinTime = function() {
            if (this._variables && this._varID[e.TIME]) return this._variables[this._varID[e.TIME]].time_var.min
        },
        i.prototype.getMaxTime = function() {
            if (this._variables && this._varID[e.TIME]) return this._variables[this._varID[e.TIME]].time_var.max
        },
        i.prototype.getVarList = function() {
            var t = [];
            for (var n in this._variables)(this._variables[n].type === e.SCALAR || this._variables[n].type === e.ENUM) && t.push(n);
            return t
        },
        i.prototype._processVariables = function() {
            this._varID = [];
            for (var t in this._variables) {
                var n = this._variables[t];
                n.type === undefined && n.guess_var_type(t),
                n.type === e.TIME && (n.calculateTimeVar(), n.time_var === undefined && (n.type = e.SCALAR)),
                n.type !== e.TIME && n.calculateVarMinMax(),
                n.type === e.SCALAR && n.min > n.max && (n.type = e.ENUM, n.calculateEnumVar());
                for (var r in e) this._varID[e[r]] === undefined && n.type === e[r] && (this._varID[e[r]] = t)
            }
            this._var_name && this._var_name.length && this._variables[this._var_name] && (this._varID[e.SCALAR] = this._var_name),
            this._varID[e.SCALAR] === undefined && (this._varID[e.SCALAR] = this._varID[e.ENUM]),
            this._pnt_cnt = this._variables[this._varID[e.SCALAR]].vals.length,
            this._data_shape === undefined && (this._data_shape = [this._pnt_cnt])
        },
        i.prototype.handleDataset = function(e) {
            var t = {
                positions: [],
                data_values: []
            };
            this._data_shape = undefined;
            if (e[0] === "{") t = JSON.parse(e);
            else if (e[0] === "<") {
                var n = $.xml2json(e);
                console.log(n);
                if (! (n instanceof Array)) return;
                this._variables = {};
                var r = n[0];
                for (var i in r) if (r.hasOwnProperty(i)) {
                    var s = new Subspace.Variable;
                    this._variables[i] = s
                }
                for (var o = 0; o < n.length; o++) for (var u in l) {
                    var a = l[u];
                    for (var f = 1; f < n.length; ++f) s.vals.push(n[f][u])
                }
            } else {
                var n = $.csv.toArrays(e, {
                    onParseValue: $.csv.hooks.castToScalar
                });
                this._variables = {};
                var l = n[0];
                for (var u in l) {
                    var a = l[u],
                    s = new Subspace.Variable;
                    for (var f = 1; f < n.length; ++f) s.vals.push(n[f][u]);
                    this._variables[a] = s
                }
            }
            this._processVariables(),
            this._var_name && this.loadVariable({
                variable: this._var_name
            }),
            console.log(this.getMetadata()),
            this._loading_data = !1,
            this._load_callback && this._load_callback(this)
        },
        i.prototype.loadDataset = function(e) {
            e = n(e, r),
            this._url = n(e.url, this._url),
            this._var_name = n(e.variable, ""),
            this._load_callback = n(e.callback, this._load_callback);
            if (!this._url) return;
            console.log("loading: " + this._url),
            this._loading_data = !0;
            var t = this;
            Cesium.when(Cesium.loadText(this._url),
            function(e) {
                t.handleDataset(e)
            })
        },
        i.prototype.loadVariable = function(t) {
            if (!this._variables[t.variable]) return;
            this._variables[t.variable].vals.length ? (this._var_name = t.variable, this._var_name.length && this._variables[this._var_name] && (this._varID[e.SCALAR] = this._var_name)) : this.loadDataset(t)
        },
        i.prototype.getCurrentVariable = function() {
            return this._varID[e.SCALAR]
        },
        i.prototype.isNoData = function(e) {
            return s(this._nodata_val, e)
        },
        i.prototype.getDataValue = function(e, t) {
            return this._variables[e] === undefined || this._variables[e].vals === undefined ? undefined: this._variables[e].vals[t]
        },
        i.prototype.getEnumValue = function(t, n) {
            return this._variables[t] === undefined || this._variables[t].vals === undefined || this._variables[t].type !== e.ENUM ? undefined: this._variables[t].enum_list[this._variables[t].vals[n]]
        },
        i.prototype.getTimeValue = function(t, n) {
            return this._variables[t] === undefined || this._variables[t].vals === undefined || this._variables[t].type !== e.TIME ? undefined: this._variables[t].time_var.vals[n]
        },
        i.prototype.getDataValues = function(e) {
            return this._variables[e] === undefined || this._variables[e].vals === undefined ? undefined: this._variables[e].vals
        },
        i.prototype.getDataIndex = function(e, t) {
            if (this._variables[e] === undefined || this._variables[e].vals === undefined) return undefined;
            var n = this._variables[e].vals;
            for (var r = 0; r < n.length; r++) if (n[r] === t) return r
        },
        i.prototype.getDispList = function(t, n) {
            var r = this._varID[e.LON] ? this._variables[this._varID[e.LON]].vals: undefined,
            i = this._varID[e.LAT] ? this._variables[this._varID[e.LAT]].vals: undefined,
            s = this._varID[e.ALT] ? this._variables[this._varID[e.ALT]].vals: undefined,
            o = this._variables[this._varID[e.SCALAR]].vals;
            t = Math.max(0, t),
            n = Math.min(n, o.length - 1);
            var u = {
                pos: [],
                val: [],
                idx: []
            };
            if (t >= 0) for (var a = 0,
            f = t; f <= n; a++, f++) u.idx[a] = f,
            u.val[a] = o[f],
            u.pos.push([r ? r[f] : 0, i ? i[f] : 0, s ? s[f] : 0]);
            return u
        },
        i.prototype.getDispListByTime = function(t, n, r) {
            var i = -1,
            s = -1;
            if (this._varID[e.TIME]) {
                var o = this._variables[this._varID[e.TIME]].time_var.vals;
                for (var u in o) {
                    if (t.greaterThan(o[u])) continue;
                    if (i === -1) i = u,
                    s = u;
                    else {
                        if (! (u - i < r && n.greaterThanOrEquals(o[u]))) break;
                        s = u
                    }
                }
            }
            return this.getDispList(i, s)
        },
        i.prototype.destroy = function() {
            return Cesium.destroyObject(this)
        },
        i
    }), r("scene/DataVisualizer", ["./Dataset"],
    function(e) {
        var t = Cesium.defaultValue,
        n = {},
        r = function(e) {},
        i = function() {
            this._points = []
        };
        i.prototype.getDataPointList = function() {
            return this._points
        },
        i.prototype.removeAll = function() {
            this._points = []
        };
        var s = function(n) {
            n = t(n, Cesium.EMPTY_OBJECT),
            this.dataset = t(n.dataset, new e({})),
            this.show = t(n.show, !0),
            this.visualizer = t(n.visualizer, undefined),
            this.points = new i,
            this.color = Cesium.Color.clone(t(n.color, Cesium.Color.WHITE)),
            this.pts_max = t(n.pointsMax, 100),
            this.leadTimeMin = t(n.leadTimeMin, 60),
            this.trailTimeMin = t(n.trailTimeMin, 60),
            this.scale = t(n.scale, 1),
            this.scale_by_val = t(n.scaleByValue, !1),
            this.clr_grad = t(n.colorGradient, undefined),
            this.clr_flip = t(n.colorFlip, !1),
            this.clr_bin = t(n.colorBin, 0),
            this.onLoadComplete = t(n.onLoadComplete, undefined),
            n.gradPath && this.loadColourGradient(n.gradPath),
            this.loadDataset(n.dataPath, n.variable)
        };
        return s.prototype.update = function(e) {
            var t = this.dataset;
            if (t._loading_data) return;
            var n = {
                val: []
            };
            this.show && (t.getMinTime() ? n = t.getDispListByTime(e.addMinutes( - this.leadTimeMin), e.addMinutes(this.trailTimeMin), this.pts_max) : n = t.getDispList(0, this.pts_max));
            var i = this.points.getDataPointList(),
            s = t.getMinVal(),
            o = t.getMaxVal();
            for (var u in n.val) {
                i.length <= u && i.push(new r);
                var a = i[u],
                f = n.val[u];
                a._value = f,
                a.data_index = n.idx[u],
                a._color = this.mapValue2Color(f),
                a._scale = this.mapValue2Scale(f),
                a._position = [];
                for (var l = 0; l < 3; l++) a._position[l] = n.pos[u][l]
            }
            for (var u = i.length - 1; u >= n.val.length; u--) i.pop();
            this.visualizer !== undefined && this.visualizer(this)
        },
        s.prototype.finishLoading = function() {
            var e = this.dataset;
            this.onLoadComplete !== undefined && this.onLoadComplete(this),
            this.points.removeAll()
        },
        s.prototype.mapValue2Scale = function(e) {
            var t = this.dataset,
            n = this.scale;
            if (t !== undefined && !t.isNoData(e)) {
                var r = t.getMinVal(),
                i = t.getMaxVal();
                e = i === r ? 0 : (e - r) / (i - r),
                n *= this.scale_by_val ? 1 * e + .5 : 1
            }
            return n
        },
        s.prototype.setLeadTimeByPercent = function(e) {
            if (this.dataset) {
                var t = this.dataset;
                this.leadTimeMin = t.getMinTime().getMinutesDifference(t.getMaxTime()) * e / 100
            }
        },
        s.prototype.setTrailTimeByPercent = function(e) {
            if (this.dataset) {
                var t = this.dataset;
                this.trailTimeMin = t.getMinTime().getMinutesDifference(t.getMaxTime()) * e / 100
            }
        },
        s.prototype.mapValue2Color = function(e) {
            var t = this.dataImage;
            if (t === undefined) return this.color;
            var n = this.dataset;
            if (n === undefined || n.isNoData(e)) return Cesium.Color.fromBytes(0, 0, 0, 0);
            var r = n.getMinVal(),
            i = n.getMaxVal();
            e = i === r ? 0 : (e - r) / (i - r),
            this.clr_flip && (e = 1 - e),
            this.clr_bin >= 1 && (e = Math.floor(e * this.clr_bin) / this.clr_bin);
            var s = Math.floor(e * (t.data.length / 4 - 1)) * 4;
            return Cesium.Color.fromBytes(t.data[s], t.data[s + 1], t.data[s + 2], t.data[s + 3] * this.color.alpha)
        },
        s.prototype.loadColourGradient = function(e) {
            function n(e) {
                $("body").append('<div id="grad_div"></div>'),
                $("<canvas/>", {
                    id: "gradCanvas",
                    Width: 256,
                    Height: 128,
                    Style: "display: none"
                }).appendTo("#grad_div");
                var n = $("#gradCanvas")[0],
                r = n.getContext("2d");
                r.drawImage(e, 0, 0, 256, 1),
                t.dataImage = r.getImageData(0, 0, 256, 1)
            }

            var t = this;
            t.grad_path = e,
            Cesium.when(Cesium.loadImage(e), n)
        },
        s.prototype.loadDataset = function(e, t) {
            var n = this;
            this.dataset.loadDataset({
                url: e,
                variable: t,
                callback: function(e) {
                    n.finishLoading(e)
                }
            })
        },
        s.prototype.loadVariable = function(e) {
            var t = this;
            this.dataset.loadVariable({
                variable: e,
                callback: function(e) {
                    t.finishLoading(e)
                }
            })
        },
        s.prototype.destroy = function() {
            return Cesium.destroyObject(this)
        },
        s
    }), r("scene/FileText", [],
    function() {
        var e = function() {};
        return e.loadFile = function(e) {
            if (typeof e == "undefined") throw new Cesium.DeveloperError("path is required");
            var t = new FileReader;//创建一个filereader对象，准备读取文件
            t.readAsText(e);//将文件读取为文本
            var n = Cesium.when.defer();
            return t.onload = function(e) {
                var t = e.target.result;
                n.resolve(t)
            },
            t.onerror = function(e) {
                n.reject(e)
            },
            n.promise
        },
        e.loadHTTP = function(e, t) {
            if (typeof e == "undefined") throw new Cesium.DeveloperError("url is required");
            return Cesium.loadText(e, t)
        },
        e
    }), r("scene/LiveTracker", [],
    function() {
        var e = function(e, t, n, r, i, s) {
            this.billboardScale = typeof i != "undefined" ? i: 1,
            this.fontSize = Math.floor((this.billboardScale + 1) * .5 * 12 + .5),
            r = typeof r != "undefined" ? r: 5e3,
            r *= .95 + Math.random() * .1,
            this.scene = e,
            this.dataSource = t,
            this.ellipsoid = e.primitives.getCentralBody().getEllipsoid(),
            this.pathColor = Cesium.defaultValue(t.pathColor, new Cesium.Color(1, .75, .03, .7)),
            this.routePolylines = new Cesium.PolylineCollection,
            this.billboards = new Cesium.BillboardCollection,
            this.labels = new Cesium.LabelCollection,
            e.primitives.add(this.routePolylines),
            e.primitives.add(this.billboards),
            e.primitives.add(this.labels);
            var o = this;
            if (typeof s == "undefined" || s.textureAtlas === "undefined") {
                var u = new Image;
                u.onload = function() {
                    o.textureAtlas = e.getContext().createTextureAtlas({
                        image: u
                    }),
                    o.billboards.setTextureAtlas(o.textureAtlas),
                    o.updatePositions()
                },
                u.src = n
            } else this.textureAtlas = s.textureAtlas,
            this.billboards.setTextureAtlas(s.textureAtlas),
            this.updatePositions();
            this.dataTimer = setInterval(function() {
                o.updatePositions()
            },
            r),
            this.updateRoute()
        };
        return e.prototype.destroy = function() {
            clearInterval(this.dataTimer),
            this.scene.primitives.remove(this.routePolylines),
            this.scene.primitives.remove(this.billboards),
            this.scene.primitives.remove(this.labels),
            Cesium.destroyObject(this)
        },
        e.prototype.setCount = function(e) {
            if (typeof this.billboards == "undefined") return;
            var t = e - this.billboards.getLength();
            if (t === 0) return;
            this.billboards.removeAll(),
            this.labels.removeAll();
            for (var n = 0; n < e; ++n) this.billboards.add({
                position: this.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees( - 75.1, 39.57)),
                scale: this.billboardScale,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                imageIndex: 0
            }),
            this.labels.add({
                position: this.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees( - 75.1, 39.57)),
                text: "foo",
                font: this.fontSize + "px sans-serif",
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                scale: 1,
                pixelOffset: new Cesium.Cartesian2(0, 50 * this.billboardScale)
            })
        },
        e.prototype.updatePositions = function() {
            this.dataSource.update();
            if (typeof this.billboards == "undefined") return;
            var e = this.dataSource.getLength();
            this.setCount(e);
            for (var t = 0; t < e; ++t) {
                var n = this.dataSource.getLatLong(t),
                r = this.billboards.get(t),
                i = this.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(n.lon, n.lat));
                r.setPosition(i),
                r.setColor(this.dataSource.getColor(t));
                var s = this.labels.get(t);
                s.setText(this.dataSource.getText(t)),
                s.setPosition(i)
            }
        },
        e.prototype.updateRoute = function() {
            var e = this.dataSource.getRoute();
            this.routePolylines.removeAll();
            if (typeof e == "undefined") return;
            for (var t = 0; t < e.length; ++t) {
                var n = e[t].point,
                r = new Array(n.length);
                for (var i = 0; i < n.length; ++i) r[i] = new Cesium.Cartographic.fromDegrees(n[i].lon, n[i].lat);
                var s = this.routePolylines.add({
                    positions: this.ellipsoid.cartographicArrayToCartesianArray(r),
                    width: 2
                }),
                o = Cesium.Material.fromType("Color");
                o.uniforms.color = this.pathColor,
                o.uniforms.outlineColor = this.pathColor,
                o.uniforms.outlineWidth = 2,
                s.setMaterial(o)
            }
        },
        e.prototype.getExtent = function() {
            var e = this.dataSource;
            e.update();
            var t, n, r, i, s = e.getLength();
            if (s === 0) return undefined;
            var o = e.getLatLong(0);
            t = r = o.lon,
            n = i = o.lat;
            for (var u = 1; u < s; ++u) {
                var o = e.getLatLong(u);
                if (typeof o == "undefined") continue;
                var a = o.lat,
                f = o.lon;
                f < t && (t = f),
                a < n && (n = a),
                f > r && (r = f),
                a > i && (i = a)
            }
            return new Cesium.Rectangle(Cesium.Math.toRadians(t), Cesium.Math.toRadians(n), Cesium.Math.toRadians(r), Cesium.Math.toRadians(i))
        },
        e
    }), r("scene/MeshType", [],
    function() {
        var t = {
            SPHERE: "SPHERE",
            CUBE: "CUBE",
            PYRAMID: "PYRAMID",
            CYLINDER: "CYLINDER",
            CONE: "CONE",
            ARROW: "ARROW",
            CIRCLE: "CIRCLE",
            PANEL: "PANEL"
        };
        return t
    }), r("scene/MeshGenerator", ["./MeshType"],
    function(e) {
        function s(e, t, n) {
            var r = t.length,
            i = new e(r + n.length);
            return i.set(t),
            i.set(n, r),
            i
        }

        var t = Cesium.defaultValue,
        n = Cesium.Enumeration,
        r = Cesium.DeveloperError,
        i = function() {};
        i.prototype.createGeometry = function(e, t, n, r) {
            var i = new Cesium.BoxGeometry({
                maximumCorner: new Cesium.Cartesian3(1, 1, 1),
                minimumCorner: new Cesium.Cartesian3( - 1, -1, -1)
            }),
            s = Cesium.BoxGeometry.createGeometry(i);
            return s.attributes.position.values = e,
            s.indices = r,
            t ? s.attributes.normal = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: t
            }) : s.attributes.normal = undefined,
            n ? s.attributes.st = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: n
            }) : s.attributes.st = undefined,
            s
        },
        i.prototype.create_box = function(e, t, n) {
            var r = new Cesium.BoxGeometry({
                maximumCorner: new Cesium.Cartesian3(e / 2, t / 2, n / 2),
                minimumCorner: new Cesium.Cartesian3( - e / 2, -t / 2, -n / 2)
            }),
            i = Cesium.BoxGeometry.createGeometry(r);
            return i
        },
        i.prototype.create_pyramid = function(e, t, n) {
            var r = [0, 0, e, -t / 2, n / 2, 0, t / 2, n / 2, 0, 0, 0, e, t / 2, n / 2, 0, t / 2, -n / 2, 0, 0, 0, e, t / 2, -n / 2, 0, -t / 2, -n / 2, 0, 0, 0, e, -t / 2, -n / 2, 0, -t / 2, n / 2, 0, -t / 2, -n / 2, 0, t / 2, -n / 2, 0, t / 2, n / 2, 0, -t / 2, n / 2, 0],
            i = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 12, 14, 15],
            s = [0, .7, .7, 0, .7, .7, 0, .7, .7, .7, .7, 0, .7, .7, 0, .7, .7, 0, 0, .7, -0.7, 0, .7, -0.7, 0, .7, -0.7, -0.7, .7, 0, -0.7, .7, 0, -0.7, .7, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0],
            o = [.5, 1, 1, 0, 0, 0, .5, 1, 1, 0, 0, 0, .5, 1, 1, 0, 0, 0, .5, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0];
            return this.createGeometry(r, s, o, i)
        },
        i.prototype.create_sphere = function(e, t, n) {
            var r = new Cesium.SphereGeometry({
                radius: e,
                numberOfPartitions: t
            }),
            i = Cesium.SphereGeometry.createGeometry(r);
            return i
        },
        i.prototype.create_cylinder = function(e, t, n, r, i) {
            var s = new Cesium.CylinderGeometry({
                length: n,
                topRadius: t,
                bottomRadius: e,
                slices: r
            }),
            o = Cesium.CylinderGeometry.createGeometry(s);
            return o
        },
        i.prototype.concat = function(e, n, i) {
            if (typeof e == "undefined" || typeof n == "undefined") throw new r("base_mesh and new_mesh are required");
            i = t(i, [0, 0, 0]);
            var o = e.attributes.position.values.length;
            e.attributes.position.values = s(Float64Array, e.attributes.position.values, n.attributes.position.values);
            for (var u = 0; u < n.attributes.position.values.length; u++) e.attributes.position.values[o + u] += i[u % 3];
            var a = e.indices.length;
            e.indices = s(Int16Array, e.indices, n.indices);
            for (var u = 0; u < n.indices.length; u++) e.indices[a + u] += o / 3;
            return e.attributes.normal.values = s(Float32Array, e.attributes.normal.values, n.attributes.normal.values),
            e.attributes.st.values = s(Float32Array, e.attributes.st.values, n.attributes.st.values),
            e
        },
        i.prototype._create_list = function() {
            var t = [];
            t[e.SPHERE.value] = o.create_sphere(1, 32, 32),
            t[e.CUBE.value] = o.create_box(1, 1, 1),
            t[e.PYRAMID.value] = o.create_pyramid(1, 1, 1),
            t[e.CYLINDER.value] = o.create_cylinder(.5, .5, 1, 32, 2),
            t[e.CONE.value] = o.create_cylinder(.5, 0, 1, 32, 2);
            var n = o.create_cylinder(.3, .3, 1, 32, 2);
            return n = o.concat(n, o.create_cylinder(.5, 0, 1, 32, 2), [0, 0, 1]),
            t[e.ARROW.value] = n,
            t[e.CIRCLE.value] = o.create_cylinder(.5, .5, .001, 32, 2),
            t[e.PANEL.value] = o.create_box(1, .001, 1),
            t
        };
        var o = new i,
        u = o._create_list();
        return i.prototype.getMeshList = function() {
            return u
        },
        i
    }), r("scene/Model", [],
    function() {
        var e = Cesium.defaultValue,
        t = {},
        r = function(e) {};
        return r.prototype.load = function(n) {
            function o(e) {
                e.object ? (s._handleJSONModelSet(r, e), s._loading_start < s._loading_cnt && s._loadModelSet(r)) : e.scenes ? s._loadCollada2JSONModel(r, e) : r._mesh = s._handleJSONModel(e)
            }

            n = e(n, t);
            var r = e(n.obj, undefined);
            this.mesh_args = e(n.mesh_args, undefined);
            if (typeof r == "undefined" || typeof this.mesh_args == "undefined") throw new DeveloperError("object needed with _mesh_args");
            var i = this.mesh_args.path;
            this._loading_start = 0,
            this._loading_cnt = 1;
            var s = this;
            console.log("loading: " + i),
            Cesium.when(Cesium.loadJson(i), o)
        },
        r.prototype._handleJSONModel = function(e) {
            if (e.positions === undefined || e.indices === undefined) throw new DeveloperError("Not a valid model object.");
            var t = (new Subspace.MeshGenerator).createGeometry(e.positions, e.normals, e.texture_coordinates, e.indices);
            return t
        },
        r.prototype._handleJSONModelSet = function(e, t) {
            if (this._loading_start === 0) {
                this._loading_cnt = t.time_steps.length,
                e._mesh = [];
                for (var n = 0; n < this._loading_cnt; n++) e._mesh[n] = undefined
            }
            var r = 0;
            for (var n = 0; n < t.object.length; n++) {
                var i = t.object[n].time;
                r = Math.max(r, i),
                e._mesh[i] = this._handleJSONModel(t.object[n])
            }
            this._loading_start = r + 1
        },
        r.prototype._loadModelSet = function(e) {
            function i(t) {
                r._handleJSONModelSet(e, t),
                r._loading_start < r._loading_cnt && r._loadModelSet(e)
            }

            var t = this.mesh_args.path,
            n = t.substring(0, t.length - 5) + "_" + this._loading_start + ".json";
            console.log("loading: " + n);
            var r = this;
            Cesium.when(Cesium.loadJson(n), i)
        },
        r.prototype._processCollada2JSONModel = function(e, t, r) {
            function a(e, n) {
                var r = Cesium.defaultValue(e.type, e.type),
                i = 1;
                r.indexOf("VEC2") !== -1 ? i = 2 : r.indexOf("VEC3") !== -1 && (i = 3);
                var s = Cesium.defaultValue(e.count, 0),
                o = Cesium.defaultValue(e.byteOffset, 0);
                if (e.bufferView) {
                    var u = t.bufferViews[e.bufferView];
                    o += u.byteOffset
                }
                var a;
                if (r.indexOf("UNSIGNED_SHORT") !== -1) a = new Uint16Array(n, o, s * i);
                else if (r.indexOf("FLOAT") !== -1) {
                    var f = n.slice(o, o + s * i * 4);
                    a = new Float32Array(f, 0, s * i)
                }
                return a
            }

            function f(i, l) {
                var c = t.nodes[i];
                console.log("- processing: " + i + "  name: " + c.name);
                var h = l.clone();
                c.matrix && (h = Cesium.Matrix4.multiply(h, new Cesium.Matrix4.fromColumnMajorArray(c.matrix)));
                for (l in c.meshes) {
                    var d = o[c.meshes[l]],
                    v = {};
                    for (p in d.primitives) {
                        var m = d.primitives[p];
                        v.texture_coordinates = undefined,
                        m.material && (v.material = m.material),
                        m.indices && (v.indices = a(t.indices[m.indices], r));
                        for (s in m.semantics) {
                            var g = m.semantics[s],
                            y = a(t.attributes[g], r);
                            switch (s) {
                            case "POSITION":
                                v.positions = y;
                                break;
                            case "NORMAL":
                                v.normals = y;
                                break;
                            case "TEXCOORD_0":
                                v.texture_coordinates = y;
                                break;
                            default:
                                console.log("JSON MODEL LOADING ERROR: Sematic unrecognized")
                            }
                        }
                        var b = e._mesh.length;
                        e._mesh[b] = u._handleJSONModel(v),
                        e._mesh[b].material = v.material,
                        e._mesh[b]._node_mat = h
                    }
                }
                if (c.children) {
                    var w = c.children;
                    for (n in w) f(w[n], h)
                }
            }

            var i = t.nodes,
            o = t.meshes;
            e._mesh = [];
            var u = this;
            for (s in t.scenes) {
                var l = t.scenes[s],
                c = Cesium.Matrix4.IDENTITY;
                for (var h = 0; h < l.nodes.length; h++) f(l.nodes[h], c)
            }
            e._dirty = !0
        },
        r.prototype._loadTexture = function(e, t, n) {
            function i(t) {
                var i = r.createTexture2D({
                    source: t,
                    pixelFormat: Cesium.PixelFormat.RGB
                });
                n ? e._textures[n] = i: e._texture = i,
                e._dirty = !0
            }

            console.log("loading: " + t);
            if (typeof e == "undefined" || typeof this.mesh_args == "undefined" || this.mesh_args.scene === "undefined") throw new Cesium.DeveloperError("object needed with _mesh_args");
            var r = this.mesh_args.scene.getContext();
            e._textures[n] = r.createTexture2D({
                width: 1,
                height: 1
            }),
            Cesium.when(Cesium.loadImage(t), i)
        },
        r.prototype._loadCollada2JSONModel = function(e, t) {
            if (typeof e == "undefined" || typeof this.mesh_args == "undefined") throw new Cesium.DeveloperError("object needed with _mesh_args");
            var n = this.mesh_args.path,
            r = n.substring(0, n.lastIndexOf("/") + 1);
            e._textures = [];
            for (img_idx in t.images) t.images[img_idx].path && this._loadTexture(e, r + t.images[img_idx].path, img_idx);
            e._materials = [];
            for (mat in t.materials) {
                cur_mat = t.materials[mat];
                for (instance in cur_mat) {
                    var i = cur_mat[instance].technique,
                    s = cur_mat[instance].values,
                    o = undefined,
                    u = 1;
                    for (var a in s) s[a].parameter === "diffuse" ? s[a].value.image !== undefined ? e._materials[mat] = {
                        image: s[a].value.image
                    }: o = s[a].value: s[a].parameter === "transparency" && (u = 1 - s[a].value);
                    o !== undefined && (e._materials[mat] = {
                        red: o[0],
                        green: o[1],
                        blue: o[2],
                        alpha: u
                    })
                }
            }
            for (sp in t.shaders) if (t.shaders[sp].path) {
                var f = r + t.shaders[sp].path;
                console.log("Skipping download of shader: ", t.shaders[sp].path)
            }
            for (buf in t.buffers) if (t.buffers[buf].path) {
                var f = r + t.buffers[buf].path,
                l = this;
                Cesium.when(Cesium.loadArrayBuffer(f),
                function(n) {
                    l._processCollada2JSONModel(e, t, n)
                })
            }
        },
        r.prototype.destroy = function() {
            return Cesium.destroyObject(this)
        },
        r
    }), r("scene/Points", [],
    function() {
        function g(e, t) {++e._propertiesChanged[t];
            var n = e._PointsCollection;
            typeof n != "undefined" && (n._updatePoints(e, t), e._dirty = !0)
        }

        function y(e, t) {
            if (e.length !== t.length) return ! 1;
            for (var n = 0,
            r = e.length; n < r; ++n) if (!i.equals(e[n], t[n])) return ! 1;
            return ! 0
        }

        var e = Cesium.defaultValue,
        t = Cesium.DeveloperError,
        n = Cesium.destroyObject,
        r = Cesium.BoundingSphere,
        i = Cesium.Cartesian3,
        s = Cesium.Color,
        o = Cesium.PolylinePipeline,
        u = {},
        a = function(t, n) {
            t = e(t, u),
            this._show = e(t.show, !0),
            this._width = e(t.width, 1),
            this._outlineWidth = e(t.outlineWidth, 1),
            this._color = s.clone(e(t.color, s.WHITE)),
            this._outlineColor = s.clone(e(t.outlineColor, s.WHITE));
            var i = t.positions;
            typeof i == "undefined" && (i = []),
            this._positions = i,
            this._positionsLength = i.length,
            this._actualLength = i.length;
            var o = t.colors;
            this._colors = o,
            this._propertiesChanged = new Uint32Array(m),
            this._PointsCollection = n,
            this._dirty = !1,
            this._pickId = undefined,
            this._pickIdThis = t._pickIdThis,
            this._segments = undefined,
            this._boundingVolume = r.fromPoints(this._positions),
            this._boundingVolume2D = new r
        },
        f = a.SHOW_INDEX = 0,
        l = a.POSITION_INDEX = 1,
        c = a.COLOR_INDEX = 2,
        h = a.OUTLINE_COLOR_INDEX = 3,
        p = a.WIDTH_INDEX = 4,
        d = a.OUTLINE_WIDTH_INDEX = 5,
        v = a.POSITION_SIZE_INDEX = 6,
        m = a.NUMBER_OF_PROPERTIES = 7;
        return a.prototype.getShow = function() {
            return this._show
        },
        a.prototype.setShow = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            e !== this._show && (this._show = e, g(this, f))
        },
        a.prototype.getPositions = function() {
            return this._positions
        },
        a.prototype.setPositions = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            this._positionsLength !== e.length && (this._positionsLength = e.length, g(this, v)),
            this._positions = e,
            this._boundingVolume = r.fromPoints(this._positions, this._boundingVolume),
            g(this, l)
        },
        a.prototype.getColor = function() {
            return this._color
        },
        a.prototype.getColors = function() {
            return this._colors
        },
        a.prototype.setColor = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            var n = this._color;
            s.equals(n, e) || (s.clone(e, n), g(this, c)),
            this._colors = undefined
        },
        a.prototype.setColors = function(e) {
            this._colors = e,
            g(this, c)
        },
        a.prototype.getWidth = function() {
            return this._width
        },
        a.prototype.setWidth = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            var n = this._width;
            e !== n && (this._width = e, g(this, p))
        },
        a.prototype.getOutlineWidth = function() {
            return this._outlineWidth
        },
        a.prototype.setOutlineWidth = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            var n = this._outlineWidth;
            e !== n && (this._outlineWidth = e, g(this, d))
        },
        a.prototype.getOutlineColor = function() {
            return this._outlineColor
        },
        a.prototype.setOutlineColor = function(e) {
            if (typeof e == "undefined") throw new t("value is required.");
            var n = this._outlineColor;
            s.equals(n, e) || (s.clone(e, n), g(this, h))
        },
        a.prototype.getPickId = function(e) {
            return this._pickId = this._pickId || e.createPickId(this._pickIdThis || this),
            this._pickId
        },
        a.prototype._clean = function() {
            this._dirty = !1;
            var e = this._propertiesChanged;
            for (var t = 0; t < m - 1; ++t) e[t] = 0
        },
        a.prototype._getPositions2D = function() {
            var e = this._segments,
            t = [],
            n = e.length;
            for (var r = 0; r < n; ++r) {
                var i = e[r],
                s = i.length;
                for (var o = 0; o < s; ++o) t.push(i[o].cartesian)
            }
            return t
        },
        a.prototype._createSegments = function(e) {
            return Cesium.PolylinePipeline.wrapLongitude(e, this.getPositions())
        },
        a.prototype._setSegments = function(e) {
            this._segments = e;
            var t = e.length,
            n = 0;
            for (var r = 0; r < t; ++r) {
                var i = e[r],
                s = i.length;
                n += s
            }
            return n
        },
        a.prototype._getSegments = function() {
            return this._segments
        },
        a.prototype._segmentsLengthChanged = function(e) {
            var t = this._segments;
            if (typeof t != "undefined") {
                var n = e.length;
                if (n !== t.length) return ! 0;
                for (var r = 0; r < n; ++r) if (e[r].length !== t[r].length) return ! 0;
                return ! 1
            }
            return ! 0
        },
        a.prototype.equals = function(e) {
            return this === e || typeof e != "undefined" && this._show === e._show && this._width === e._width && this._outlineWidth === e._outlineWidth && this._horizontalOrigin === e._horizontalOrigin && y(this._positions, e._positions) && s.equals(this._color, e._color) && s.equals(this._outlineColor, e._outlineColor)
        },
        a.prototype._destroy = function() {
            this._pickId = this._pickId && this._pickId.destroy(),
            this._PointsCollection = undefined
        },
        a
    }), r("shaders/PointsVS", [],
    function() {
        return "attribute vec3 position3DHigh;\nattribute vec3 position3DLow;\nattribute vec3 position2DHigh;\nattribute vec3 position2DLow;\nattribute vec4 color;\nattribute float show;\nvarying vec4 v_color;\nuniform float u_morphTime;\nvarying float v_ptSize;\nvoid main()\n{\nvec4 p;\nif (u_morphTime == 1.0)\n{\np = czm_translateRelativeToEye(position3DHigh, position3DLow);\n}\nelse if (u_morphTime == 0.0)\n{\np = czm_translateRelativeToEye(position2DHigh.zxy, position2DLow.zxy);\n}\nelse\n{\np = czm_columbusViewMorph(\nczm_translateRelativeToEye(position2DHigh.zxy, position2DLow.zxy),\nczm_translateRelativeToEye(position3DHigh, position3DLow),\nu_morphTime);\n}\ngl_Position = czm_modelViewProjectionRelativeToEye * p * show;\nv_color = color;\ngl_PointSize = 4.0;\nv_ptSize = gl_PointSize;\n}\n"
    }), r("shaders/PointsFS", [],
    function() {
        return "varying vec4 v_color;\nvarying float v_ptSize;\nvoid main()\n{\nfloat a = 1.0;\nvec2 coord =  vec2(gl_PointCoord.x*2.0-1.0,gl_PointCoord.y*2.0-1.0);\nfloat dist = sqrt(coord.x*coord.x+coord.y*coord.y);\nif( dist > 1.0 ) discard;\na = 1.0;\ngl_FragColor = vec4(1.0,1.0,1.0,a) * v_color;\n}\n"
    }), r("scene/PointsCollection", ["../shaders/PointsVS", "../shaders/PointsFS", "./Points"],
    function(e, t, n) {
        function j(e, t, n) {
            this.count = e,
            this.offset = t,
            this.rsOne = n.rsOne,
            this.rsTwo = n.rsTwo,
            this.rsThree = n.rsThree,
            this.rsPick = n.rsPick
        }

        function I(e) {
            return o.dot(o.UNIT_X, e._boundingVolume.center) < 0 || e._boundingVolume.intersect(u.UNIT_Y) === v.INTERSECTING
        }

        var r = Cesium.DeveloperError,
        i = Cesium.combine,
        s = Cesium.destroyObject,
        o = Cesium.Cartesian3,
        u = Cesium.Cartesian4,
        a = Cesium.EncodedCartesian3,
        f = Cesium.Matrix4,
        l = Cesium.ComponentDatatype,
        c = Cesium.IndexDatatype,
        h = Cesium.PrimitiveType,
        p = Cesium.Color,
        d = Cesium.BoundingSphere,
        v = Cesium.Intersect,
        m = Cesium.BlendingState,
        g = Cesium.BufferUsage,
        y = Cesium.CommandLists,
        b = Cesium.DrawCommand,
        w = Cesium.SceneMode,
        E = Cesium.Polyline,
        S = Cesium.PolylineVS,
        x = Cesium.PolylineFS,
        T = Cesium.StencilFunction,
        N = Cesium.StencilOperation,
        C = n.SHOW_INDEX,
        k = n.POSITION_INDEX,
        L = n.COLOR_INDEX,
        A = n.OUTLINE_COLOR_INDEX,
        O = n.WIDTH_INDEX,
        M = n.OUTLINE_WIDTH_INDEX,
        _ = n.POSITION_SIZE_INDEX,
        D = n.NUMBER_OF_PROPERTIES,
        P = 65536,
        H = {
            position3DHigh: 0,
            position3DLow: 1,
            position2DHigh: 2,
            position2DLow: 3,
            color: 4,
            pickColor: 5,
            show: 6
        },
        B = function() {
            this.morphTime = 1,
            this.modelMatrix = f.IDENTITY.clone(),
            this._modelMatrix = f.IDENTITY.clone(),
            this._sp = undefined,
            this._boundingVolume = undefined,
            this._boundingVolume2D = undefined,
            this._commandLists = new y,
            this._PointssUpdated = !1,
            this._PointssRemoved = !1,
            this._createVertexArray = !1,
            this._propertiesChanged = new Uint32Array(D),
            this._Pointss = [],
            this._PointsBuckets = {},
            this._buffersUsage = [{
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            },
            {
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            },
            {
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            },
            {
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            },
            {
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            },
            {
                bufferUsage: g.STATIC_DRAW,
                frameCount: 0
            }],
            this._mode = undefined;
            var e = this;
            this._uniforms = {
                u_morphTime: function() {
                    return e.morphTime
                }
            },
            this._PointssToUpdate = [],
            this._colorVertexArrays = [],
            this._outlineColorVertexArrays = [],
            this._pickColorVertexArrays = [],
            this._positionBuffer = undefined,
            this._outlineColorBuffer = undefined,
            this._colorBuffer = undefined,
            this._pickColorBuffer = undefined,
            this._showBuffer = undefined
        };
        B.prototype.add = function(e) {
            var t = new n(e, this);
            return t._index = this._Pointss.length,
            this._Pointss.push(t),
            this._createVertexArray = !0,
            t
        },
        B.prototype.remove = function(e) {
            return this.contains(e) ? (this._Pointss[e._index] = null, this._PointssRemoved = !0, this._createVertexArray = !0, e._destroy(), !0) : !1
        },
        B.prototype.removeAll = function() {
            this._destroyPointss(),
            this._PointsBuckets = {},
            this._PointssRemoved = !1,
            this._Pointss.length = 0,
            this._PointssToUpdate.length = 0,
            this._createVertexArray = !0
        },
        B.prototype.contains = function(e) {
            return typeof e != "undefined" && e._PointsCollection === this
        },
        B.prototype.get = function(e) {
            if (typeof e == "undefined") throw new r("index is required.");
            return this._removePointss(),
            this._Pointss[e]
        },
        B.prototype.getLength = function() {
            return this._removePointss(),
            this._Pointss.length
        },
        B.prototype.update = function(n, r, i) {
            typeof this._sp == "undefined" && (this._sp = n.getShaderCache().getShaderProgram(e, t, H)),
            this._removePointss(),
            this._updateMode(r);
            var s, o, u, a, l, c, p, d = this._propertiesChanged;
            if (this._createVertexArray || this._computeNewBuffersUsage()) this._createVertexArrays(n);
            else if (this._PointssUpdated) {
                var v = this._PointssToUpdate,
                m = !1;
                if (this._mode !== w.SCENE3D) {
                    var g = v.length;
                    for (var y = 0; y < g; ++y) {
                        o = v[y];
                        var E = o._propertiesChanged;
                        if (E[k] && I(o)) {
                            var S = o._createSegments(this._projection._ellipsoid);
                            if (o._segmentsLengthChanged(S)) {
                                m = !0;
                                break
                            }
                            o._setSegments(S)
                        }
                    }
                }
                if (d[_] || d[O] || d[M] || m) this._createVertexArrays(n);
                else {
                    u = v.length,
                    l = this._PointsBuckets;
                    for (var x = 0; x < u; ++x) {
                        o = v[x],
                        d = o._propertiesChanged,
                        s = o._bucket;
                        var T = 0;
                        for (var N in l) if (l.hasOwnProperty(N)) {
                            if (l[N] === s) {
                                d[k] && s.writePositionsUpdate(T, o, this._positionBuffer),
                                d[L] && s.writeColorUpdate(T, o, this._colorBuffer),
                                d[A] && s.writeColorUpdate(T, o, this._outlineColorBuffer),
                                d[C] && s.writeShowUpdate(T, o, this._showBuffer);
                                break
                            }
                            T += l[N].lengthOfPositions
                        }
                        o._clean()
                    }
                }
                v.length = 0,
                this._PointssUpdated = !1
            }
            for (var P = 0; P < D; ++P) d[P] = 0;
            var B, j = f.IDENTITY;
            r.mode === w.SCENE3D ? (B = this._boundingVolume, j = this.modelMatrix) : r.mode === w.COLUMBUS_VIEW || r.mode === w.SCENE2D ? B = this._boundingVolume2D: B = this._boundingVolume && this._boundingVolume2D && this._boundingVolume.union(this._boundingVolume2D);
            var F = r.passes,
            q, R;
            l = this._PointsBuckets;
            var U = this._sp;
            this._commandLists.removeAll();
            if (typeof l != "undefined") {
                if (F.color) {
                    u = this._colorVertexArrays.length,
                    q = this._commandLists.opaqueList;
                    for (var z = 0; z < u; ++z) {
                        var W = this._colorVertexArrays[z],
                        X = this._outlineColorVertexArrays[z];
                        a = this._colorVertexArrays[z].buckets,
                        c = a.length;
                        var V = q.length;
                        q.length += c * 3;
                        for (var $ = 0; $ < c; ++$, V += 3) p = a[$],
                        R = q[V],
                        typeof R == "undefined" && (R = q[V] = new b),
                        R.boundingVolume = B,
                        R.modelMatrix = j,
                        R.primitiveType = h.POINTS,
                        R.count = p.count,
                        R.offset = p.offset,
                        R.shaderProgram = U,
                        R.uniformMap = this._uniforms,
                        R.vertexArray = W.va,
                        R.renderState = p.rsOne,
                        R = q[V + 1],
                        typeof R == "undefined" && (R = q[V + 1] = new b),
                        R.boundingVolume = B,
                        R.modelMatrix = j,
                        R.primitiveType = h.POINTS,
                        R.count = p.count,
                        R.offset = p.offset,
                        R.shaderProgram = U,
                        R.uniformMap = this._uniforms,
                        R.vertexArray = W.va,
                        R.renderState = p.rsTwo,
                        R = q[V + 2],
                        typeof R == "undefined" && (R = q[V + 2] = new b),
                        R.boundingVolume = B,
                        R.modelMatrix = j,
                        R.primitiveType = h.POINTS,
                        R.count = p.count,
                        R.offset = p.offset,
                        R.shaderProgram = U,
                        R.uniformMap = this._uniforms,
                        R.vertexArray = W.va,
                        R.renderState = p.rsThree
                    }
                }
                if (F.pick) {
                    u = this._pickColorVertexArrays.length,
                    q = this._commandLists.pickList;
                    for (var J = 0; J < u; ++J) {
                        var K = this._pickColorVertexArrays[J];
                        a = K.buckets,
                        c = a.length,
                        q.length += c;
                        for (var Q = 0; Q < c; ++Q) p = a[Q],
                        R = q[Q],
                        typeof R == "undefined" && (R = q[Q] = new b),
                        R.boundingVolume = B,
                        R.modelMatrix = j,
                        R.primitiveType = h.POINTS,
                        R.count = p.count,
                        R.offset = p.offset,
                        R.shaderProgram = U,
                        R.uniformMap = this._uniforms,
                        R.vertexArray = K.va,
                        R.renderState = p.rsPick
                    }
                }
            }
            this._commandLists.empty() || i.push(this._commandLists)
        },
        B.prototype.isDestroyed = function() {
            return ! 1
        },
        B.prototype.destroy = function() {
            return this._sp = this._sp && this._sp.release(),
            this._destroyVertexArrays(),
            this._destroyPointss(),
            s(this)
        },
        B.prototype._computeNewBuffersUsage = function() {
            var e = this._buffersUsage,
            t = !1,
            n = this._propertiesChanged;
            for (var r = 0; r < D - 1; ++r) {
                var i = e[r];
                n[r] ? i.bufferUsage !== g.STREAM_DRAW ? (t = !0, i.bufferUsage = g.STREAM_DRAW, i.frameCount = 100) : i.frameCount = 100 : i.bufferUsage !== g.STATIC_DRAW && (i.frameCount === 0 ? (t = !0, i.bufferUsage = g.STATIC_DRAW) : i.frameCount--)
            }
            return t
        },
        B.prototype._createVertexArrays = function(e) {
            this._createVertexArray = !1,
            this._destroyVertexArrays(),
            this._sortPointssIntoBuckets();
            var t = [],
            n = [],
            r = [0];
            t.push(n);
            var i = 0,
            s = 0,
            o = [[]],
            u = 0,
            a = this._PointsBuckets,
            f,
            h;
            for (f in a) a.hasOwnProperty(f) && (h = a[f], h.updateRenderState(e, s), u += h.lengthOfPositions);
            if (u > 0) {
                var p = new Float32Array(2 * u * 3),
                d = new Uint8Array(u * 4),
                v = new Uint8Array(u * 4),
                m = new Uint8Array(u * 4),
                y = new Uint8Array(u),
                b,
                E = 0,
                S = 0,
                x = 0;
                for (f in a) if (a.hasOwnProperty(f)) {
                    h = a[f],
                    h.write(p, v, d, m, y, E, x, S, e),
                    this._mode === w.MORPHING && (typeof b == "undefined" && (b = new Float32Array(2 * u * 3)), h.writeForMorph(b, E));
                    var T = h.lengthOfPositions;
                    E += 2 * T * 3,
                    x += T,
                    S += T * 4,
                    i = h.updateIndices(t, r, o, i)
                }
                this._positionBuffer = e.createVertexBuffer(p, this._buffersUsage[k].bufferUsage);
                var N;
                typeof b != "undefined" && (N = e.createVertexBuffer(b, this._buffersUsage[k].bufferUsage)),
                this._outlineColorBuffer = e.createVertexBuffer(d, this._buffersUsage[A].bufferUsage),
                this._colorBuffer = e.createVertexBuffer(v, this._buffersUsage[L].bufferUsage),
                this._pickColorBuffer = e.createVertexBuffer(m, g.STATIC_DRAW),
                this._showBuffer = e.createVertexBuffer(y, this._buffersUsage[C].bufferUsage);
                var O = 4 * Uint8Array.BYTES_PER_ELEMENT,
                M = 3 * Float32Array.BYTES_PER_ELEMENT,
                _ = 0,
                D = t.length;
                for (var B = 0; B < D; ++B) {
                    n = t[B];
                    if (n.length > 0) {
                        var j = new Uint16Array(n),
                        F = e.createIndexBuffer(j, g.STATIC_DRAW, c.UNSIGNED_SHORT);
                        F.setVertexArrayDestroyable(!1),
                        _ += r[B];
                        var I = 2 * (B * M * P - _ * M),
                        q = M + I,
                        R = B * O * P - _ * O,
                        U = B * P - _,
                        z = [{
                            index: H.position3DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position3DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.color,
                            componentsPerAttribute: 4,
                            normalize: !0,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._colorBuffer,
                            offsetInBytes: R
                        },
                        {
                            index: H.show,
                            componentsPerAttribute: 1,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._showBuffer,
                            offsetInBytes: U
                        }],
                        W = [{
                            index: H.position3DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position3DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.color,
                            componentsPerAttribute: 4,
                            normalize: !0,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._outlineColorBuffer,
                            offsetInBytes: R
                        },
                        {
                            index: H.show,
                            componentsPerAttribute: 1,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._showBuffer,
                            offsetInBytes: U
                        }],
                        X = [{
                            index: H.position3DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position3DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DHigh,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: I,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.position2DLow,
                            componentsPerAttribute: 3,
                            componentDatatype: l.FLOAT,
                            offsetInBytes: q,
                            strideInBytes: 2 * M
                        },
                        {
                            index: H.color,
                            componentsPerAttribute: 4,
                            normalize: !0,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._pickColorBuffer,
                            offsetInBytes: R
                        },
                        {
                            index: H.show,
                            componentsPerAttribute: 1,
                            componentDatatype: l.UNSIGNED_BYTE,
                            vertexBuffer: this._showBuffer,
                            offsetInBytes: U
                        }];
                        this._mode === w.SCENE3D ? (z[0].vertexBuffer = this._positionBuffer, z[1].vertexBuffer = this._positionBuffer, z[2].value = [0, 0, 0], z[3].value = [0, 0, 0], W[0].vertexBuffer = this._positionBuffer, W[1].vertexBuffer = this._positionBuffer, W[2].value = [0, 0, 0], W[3].value = [0, 0, 0], X[0].vertexBuffer = this._positionBuffer, X[1].vertexBuffer = this._positionBuffer, X[2].value = [0, 0, 0], X[3].value = [0, 0, 0]) : this._mode === w.SCENE2D || this._mode === w.COLUMBUS_VIEW ? (z[0].value = [0, 0, 0], z[1].value = [0, 0, 0], z[2].vertexBuffer = this._positionBuffer, z[3].vertexBuffer = this._positionBuffer, W[0].value = [0, 0, 0], W[1].value = [0, 0, 0], W[2].vertexBuffer = this._positionBuffer, W[3].vertexBuffer = this._positionBuffer, X[0].value = [0, 0, 0], X[1].value = [0, 0, 0], X[2].vertexBuffer = this._positionBuffer, X[3].vertexBuffer = this._positionBuffer) : (z[0].vertexBuffer = N, z[1].vertexBuffer = N, z[2].vertexBuffer = this._positionBuffer, z[3].vertexBuffer = this._positionBuffer, W[0].vertexBuffer = N, W[1].vertexBuffer = N, W[2].vertexBuffer = this._positionBuffer, W[3].vertexBuffer = this._positionBuffer, X[0].vertexBuffer = N, X[1].vertexBuffer = N, X[2].vertexBuffer = this._positionBuffer, X[3].vertexBuffer = this._positionBuffer);
                        var V = e.createVertexArray(z, F),
                        $ = e.createVertexArray(W, F),
                        J = e.createVertexArray(X, F);
                        this._colorVertexArrays.push({
                            va: V,
                            buckets: o[B]
                        }),
                        this._outlineColorVertexArrays.push({
                            va: $,
                            buckets: o[B]
                        }),
                        this._pickColorVertexArrays.push({
                            va: J,
                            buckets: o[B]
                        })
                    }
                }
            }
        },
        B.prototype._sortPointssIntoBuckets = function() {
            var e = this._PointsBuckets = {},
            t = this._Pointss,
            n = t.length;
            for (var r = 0; r < n; ++r) {
                var i = t[r],
                s = i.getOutlineWidth(),
                o = i.getWidth(),
                u = "OL" + s + "W" + o,
                a = e[u];
                typeof a == "undefined" && (a = e[u] = new F(s, o, this._mode, this._projection, this._modelMatrix)),
                a.addPoints(i)
            }
        },
        B.prototype._updateMode = function(e) {
            var t = e.mode,
            n = e.scene2D.projection;
            this._mode !== t && typeof t.morphTime != "undefined" && (this.morphTime = t.morphTime);
            if (this._mode !== t || this._projection !== n || !this._modelMatrix.equals(this.modelMatrix)) this._mode = t,
            this._projection = n,
            this._modelMatrix = this.modelMatrix.clone(),
            this._createVertexArray = !0
        },
        B.prototype._removePointss = function() {
            if (this._PointssRemoved) {
                this._PointssRemoved = !1;
                var e = [],
                t = this._Pointss.length;
                for (var n = 0,
                r = 0; n < t; ++n) {
                    var i = this._Pointss[n];
                    i && (i._index = r++, e.push(i))
                }
                this._Pointss = e
            }
        },
        B.prototype._destroyVertexArrays = function() {
            var e = this._colorVertexArrays.length;
            for (var t = 0; t < e; ++t) this._colorVertexArrays[t].va.destroy(),
            this._pickColorVertexArrays[t].va.destroy(),
            this._outlineColorVertexArrays[t].va.destroy();
            this._colorVertexArrays.length = 0,
            this._pickColorVertexArrays.length = 0,
            this._outlineColorVertexArrays.length = 0
        },
        B.prototype._updatePoints = function(e, t) {
            this._PointssUpdated = !0,
            this._PointssToUpdate.push(e),
            ++this._propertiesChanged[t]
        },
        B.prototype._destroyPointss = function() {
            var e = this._Pointss,
            t = e.length;
            for (var n = 0; n < t; ++n) e[n] && e[n]._destroy()
        };
        var F = function(e, t, n, r, i) {
            this.width = t,
            this.outlineWidth = e,
            this.Pointss = [],
            this.lengthOfPositions = 0,
            this.rsOne = undefined,
            this.rsTwo = undefined,
            this.rsThree = undefined,
            this.rsPick = undefined,
            this.mode = n,
            this.projection = r,
            this.ellipsoid = r.getEllipsoid(),
            this.modelMatrix = i
        };
        F.prototype.addPoints = function(e) {
            var t = this.Pointss;
            t.push(e),
            e._actualLength = this.getPointsPositionsLength(e),
            this.lengthOfPositions += e._actualLength,
            e._bucket = this
        },
        F.prototype.updateRenderState = function(e, t) {
            var n = this._clampWidth(e, this.width),
            r = this._clampWidth(e, this.outlineWidth),
            i = e.createRenderState({
                depthTest: {
                    enabled: !0
                },
                blending: m.ALPHA_BLEND
            });
            i.lineWidth = r,
            this.rsOne = this.rsTwo = this.rsThree = this.rsPick = i
        },
        F.prototype.getPointsPositionsLength = function(e) {
            if (this.mode === w.SCENE3D || !I(e)) return e.getPositions().length;
            var t = e._createSegments(this.ellipsoid);
            return e._setSegments(t)
        };
        var q = new o;
        return F.prototype.write = function(e, t, n, r, i, s, o, u, f) {
            var l = this.Pointss,
            c = l.length;
            for (var h = 0; h < c; ++h) {
                var d = l[h],
                v = d.getColor(),
                m = d.getColors(),
                g = d.getShow(),
                y = d.getOutlineColor(),
                b = d.getPickId(f).color,
                E = this._getPositions(d),
                S = E.length;
                for (var x = 0; x < S; ++x) {
                    var T = E[x];
                    q.x = T.x,
                    q.y = T.y,
                    q.z = this.mode !== w.SCENE2D ? T.z: 0,
                    a.writeElements(q, e, s),
                    n[u] = p.floatToByte(y.red),
                    n[u + 1] = p.floatToByte(y.green),
                    n[u + 2] = p.floatToByte(y.blue),
                    n[u + 3] = p.floatToByte(y.alpha),
                    typeof m == "undefined" ? (t[u] = p.floatToByte(v.red), t[u + 1] = p.floatToByte(v.green), t[u + 2] = p.floatToByte(v.blue), t[u + 3] = p.floatToByte(v.alpha)) : (t[u] = p.floatToByte(m[x].red), t[u + 1] = p.floatToByte(m[x].green), t[u + 2] = p.floatToByte(m[x].blue), t[u + 3] = p.floatToByte(m[x].alpha)),
                    r[u] = b.red,
                    r[u + 1] = b.green,
                    r[u + 2] = b.blue,
                    r[u + 3] = 255,
                    i[o++] = g,
                    s += 6,
                    u += 4
                }
            }
        },
        F.prototype.writeForMorph = function(e, t) {
            var n = this.modelMatrix,
            r, i = this.Pointss,
            s = i.length;
            for (var o = 0; o < s; ++o) {
                var u = i[o],
                f = u.getPositions(),
                l,
                c;
                if (I(u)) {
                    var h = u._getSegments();
                    l = h.length;
                    for (c = 0; c < l; ++c) {
                        var p = h[c],
                        d = p.length;
                        for (var v = 0; v < d; ++v) r = f[p[v].index],
                        r = n.multiplyByPoint(r),
                        a.writeElements(r, e, t),
                        t += 6
                    }
                } else {
                    l = f.length;
                    for (c = 0; c < l; ++c) r = f[c],
                    r = n.multiplyByPoint(r),
                    a.writeElements(r, e, t),
                    t += 6
                }
            }
        },
        F.prototype._clampWidth = function(e, t) {
            var n = e.getMinimumAliasedLineWidth(),
            r = e.getMaximumAliasedLineWidth();
            return Math.min(Math.max(t, n), r)
        },
        F.prototype._updateIndices3D = function(e, t, n, r) {
            var i = n.length - 1,
            s = new j(0, r, this);
            n[i].push(s);
            var o = 0,
            u = e[e.length - 1],
            a = 0;
            u.length > 0 && (a = u[u.length - 1] + 1);
            var f = this.Pointss,
            l = f.length;
            for (var c = 0; c < l; ++c) {
                var h = f[c],
                p = h.getPositions(),
                d = p.length;
                if (p.length > 0) {
                    for (var v = 0; v < d; ++v) v !== d - 1 && (a === P - 1 && (t.push(1), u = [], e.push(u), a = 0, s.count = o, o = 0, r = 0, s = new j(0, 0, this), n[++i] = [s]), o += 2, r += 2, u.push(a++), u.push(a));
                    a < P - 1 ? a++:(t.push(0), u = [], e.push(u), a = 0, s.count = o, r = 0, o = 0, s = new j(0, 0, this), n[++i] = [s])
                }
                h._clean()
            }
            return s.count = o,
            r
        },
        F.prototype._updateIndices2D = function(e, t, n, r) {
            var i = n.length - 1,
            s = new j(0, r, this);
            n[i].push(s);
            var o = 0,
            u = e[e.length - 1],
            a = 0;
            u.length > 0 && (a = u[u.length - 1] + 1);
            var f = this.Pointss,
            l = f.length;
            for (var c = 0; c < l; ++c) {
                var h = f[c];
                if (I(h)) {
                    var p = h._segments,
                    d = p.length;
                    if (d > 0) {
                        for (var v = 0; v < d; ++v) {
                            var m = p[v],
                            g = m.length;
                            for (var y = 0; y < g; ++y) y !== g - 1 && (a === P - 1 && (t.push(1), u = [], e.push(u), a = 0, s.count = o, o = 0, r = 0, s = new j(0, 0, this), n[++i] = [s]), o += 2, r += 2, u.push(a++), u.push(a));
                            v !== d - 1 && a++
                        }
                        a < P - 1 ? a++:(t.push(0), u = [], e.push(u), a = 0, s.count = o, r = 0, o = 0, s = new j(0, 0, this), n[++i] = [s])
                    }
                } else {
                    var b = h.getPositions(),
                    w = b.length;
                    for (var E = 0; E < w; ++E) E !== w - 1 && (a === P - 1 && (t.push(1), u = [], e.push(u), a = 0, s.count = o, o = 0, r = 0, s = new j(0, 0, this), n[++i] = [s]), o += 2, r += 2, u.push(a++), u.push(a));
                    a < P - 1 ? a++:(t.push(0), u = [], e.push(u), a = 0, s.count = o, r = 0, o = 0, s = new j(0, 0, this), n[++i] = [s])
                }
                h._clean()
            }
            return s.count = o,
            r
        },
        F.prototype.updateIndices = function(e, t, n, r) {
            return this.mode === w.SCENE3D ? this._updateIndices3D(e, t, n, r) : this._updateIndices2D(e, t, n, r)
        },
        F.prototype._getPointsStartIndex = function(e) {
            var t = this.Pointss,
            n = 0,
            r = t.length;
            for (var i = 0; i < r; ++i) {
                var s = t[i];
                if (s === e) break;
                n += s._actualLength
            }
            return n
        },
        F.prototype._getPositions = function(e) {
            var t = e.getPositions();
            t.length > 0 && (typeof e._PointsCollection._boundingVolume == "undefined" ? e._PointsCollection._boundingVolume = d.clone(e._boundingVolume) : e._PointsCollection._boundingVolume = e._PointsCollection._boundingVolume.union(e._boundingVolume, e._PointsCollection._boundingVolume));
            if (this.mode === w.SCENE3D) return t;
            I(e) && (t = e._getPositions2D());
            var n = this.ellipsoid,
            r = this.projection,
            i = [],
            s = this.modelMatrix,
            u = t.length,
            a,
            f;
            for (var l = 0; l < u; ++l) a = t[l],
            f = s.multiplyByPoint(a),
            i.push(r.project(n.cartesianToCartographic(o.fromCartesian4(f))));
            if (i.length > 0) {
                e._boundingVolume2D = d.fromPoints(i, e._boundingVolume2D);
                var c = e._boundingVolume2D.center;
                e._boundingVolume2D.center = new o(c.z, c.x, c.y),
                typeof e._PointsCollection._boundingVolume2D == "undefined" ? e._PointsCollection._boundingVolume2D = d.clone(e._boundingVolume2D) : e._PointsCollection._boundingVolume2D = e._PointsCollection._boundingVolume2D.union(e._boundingVolume2D, e._PointsCollection._boundingVolume2D)
            }
            return i
        },
        F.prototype.writePositionsUpdate = function(e, t, n) {
            var r = t._actualLength;
            if (r) {
                e += this._getPointsStartIndex(t);
                var i = new Float32Array(2 * r * 3),
                s = 0,
                o = this._getPositions(t);
                for (var u = 0; u < r; ++u) {
                    var f = o[u];
                    q.x = f.x,
                    q.y = f.y,
                    q.z = this.mode !== w.SCENE2D ? f.z: 0,
                    a.writeElements(q, i, s),
                    s += 6
                }
                n.copyFromArrayView(i, 24 * e)
            }
        },
        F.prototype.writeColorUpdate = function(e, t, n) {
            var r = t._actualLength;
            if (r) {
                e += this._getPointsStartIndex(t);
                var i = new Uint8Array(r * 4);
                if (t.getColors() === "undefined") {
                    var s = 0,
                    o = t.getColor(),
                    u = p.floatToByte(o.red),
                    a = p.floatToByte(o.green),
                    f = p.floatToByte(o.blue),
                    l = p.floatToByte(o.alpha);
                    for (var c = 0; c < r; ++c) i[s] = u,
                    i[s + 1] = a,
                    i[s + 2] = f,
                    i[s + 3] = l,
                    s += 4
                } else {
                    var h = t.getColors();
                    for (var c = 0; c < r; ++c) {
                        var o = h[c],
                        u = p.floatToByte(o.red),
                        a = p.floatToByte(o.green),
                        f = p.floatToByte(o.blue),
                        l = p.floatToByte(o.alpha);
                        i[s] = u,
                        i[s + 1] = a,
                        i[s + 2] = f,
                        i[s + 3] = l,
                        s += 4
                    }
                }
                n.copyFromArrayView(i, 4 * e)
            }
        },
        F.prototype.writeShowUpdate = function(e, t, n) {
            var r = t._actualLength;
            if (r) {
                e += this._getPointsStartIndex(t);
                var i = t.getShow(),
                s = new Uint8Array(r);
                for (var o = 0; o < r; ++o) s[o] = i;
                n.copyFromArrayView(s, e)
            }
        },
        B
    }), r("scene/SRTMTerrainProvider", [],
    function() {
        var e = Cesium.defaultValue,
        t = Cesium.loadArrayBuffer,
        n = Cesium.throttleRequestByServer,
        r = Cesium.writeTextToCanvas,
        i = Cesium.DeveloperError,
        s = Cesium.Event,
        o = Cesium.Credit,
        u = Cesium.GeographicTilingScheme,
        a = Cesium.HeightmapTerrainData,
        f = Cesium.TerrainProvider,
        l = Cesium.when,
        c = function(n) {
            if (typeof n == "undefined" || typeof n.url == "undefined") throw new i("description.url is required.");
            this._url = n.url,
            this._proxy = n.proxy,
            this._heightOffset = e(n.heightOffset, 0),
            this._tilingScheme = new u({
                numberOfLevelZeroTilesX: 2,
                numberOfLevelZeroTilesY: 1
            }),
            this._heightmapWidth = 65,
            this._levelZeroMaximumGeometricError = f.getEstimatedLevelZeroGeometricErrorForAHeightmap(this._tilingScheme.getEllipsoid(), this._heightmapWidth, this._tilingScheme.getNumberOfXTilesAtLevel(0)),
            this._terrainDataStructure = {
                heightScale: 1,
                heightOffset: this._heightOffset,
                elementsPerHeight: 1,
                stride: 1,
                elementMultiplier: 256,
                isBigEndian: !1
            },
            this._errorEvent = new s;
            var r = n.credit;
            typeof r == "string" && (r = new o(r)),
            this._credit = r
        };
        return c.prototype.requestTileGeometry = function(r, i, s, o) {
            var u = this._tilingScheme.getNumberOfYTilesAtLevel(s),
            f = this._url + "/" + s + "/" + r + "/" + (u - i - 1) + ".terrain",
            c = this._proxy;
            typeof c != "undefined" && (f = c.getURL(f));
            var h;
            o = e(o, !0);
            if (o) {
                h = n(f, t);
                if (typeof h == "undefined") return undefined
            } else h = t(f);
            var p = this;
            return l(h,
            function(e) {
                var t = new Int16Array(e, 0, p._heightmapWidth * p._heightmapWidth);
                return new a({
                    buffer: t,
                    childTileMask: (new Uint8Array(e, t.byteLength, 1))[0],
                    waterMask: new Uint8Array(e, t.byteLength + 1, e.byteLength - t.byteLength - 1),
                    width: p._heightmapWidth,
                    height: p._heightmapWidth,
                    structure: p._terrainDataStructure
                })
            })
        },
        c.prototype.getErrorEvent = function() {
            return this._errorEvent
        },
        c.prototype.getLevelMaximumGeometricError = function(e) {
            return this._levelZeroMaximumGeometricError / (1 << e)
        },
        c.prototype.getCredit = function() {
            return this._credit
        },
        c.prototype.getTilingScheme = function() {
            return this._tilingScheme
        },
        c.prototype.hasWaterMask = function() {
            return ! 1
        },
        c.prototype.isReady = function() {
            return ! 0
        },
        c.prototype.setHeightScale = function(e) {
            this._terrainDataStructure.heightScale = e
        },
        c
    }), r("shaders/ShapeVS", [],
    function() {
        return "attribute vec3 position;\nattribute vec3 normal;\nattribute vec2 textureCoordinates;\nvarying vec3 vLightWeighting;\nvarying vec2 vTextureCoord;\nvoid main()\n{\ngl_Position = czm_modelViewProjection * vec4(position, 1.0);\nvTextureCoord = textureCoordinates;\nvec3 transformedNormal = normalize(czm_normal * normal);\nfloat diffuse = max(dot(transformedNormal, vec3(.71,0,.71)), 0.0);\nvLightWeighting = vec3(0.2, 0.2, 0.2) + vec3(0.8, 0.8, 0.8) * diffuse;\n}\n"
    }), r("shaders/ShapeFS_Clr", [],
    function() {
        return "uniform vec4 u_color;\nvarying vec3 vLightWeighting;\nvoid main()\n{\ngl_FragColor = vec4(u_color.rgb * vLightWeighting, u_color.a);\n}\n"
    }), r("shaders/ShapeFS_Tex", [],
    function() {
        return "varying vec3 vLightWeighting;\nvarying vec2 vTextureCoord;\nuniform sampler2D u_texture;\nuniform vec4 u_color;\nuniform bool u_flip_tex;\nuniform bool u_repeat_tex;\nvoid main()\n{\nvec2 tx = vTextureCoord;\nif (u_flip_tex) tx.t = 1.0-vTextureCoord.t;\nvec4 fragmentColor = texture2D(u_texture, u_repeat_tex ? fract(tx) : tx);\ngl_FragColor = vec4(u_color.rgb * fragmentColor.rgb * vLightWeighting, fragmentColor.a * u_color.a);\n}\n"
    }), r("shaders/ShapeFS_Pick", [],
    function() {
        return "uniform vec4 u_pick_color;\nvoid main()\n{\ngl_FragColor = u_pick_color;\n}\n"
    }), r("scene/Shape", ["../shaders/ShapeVS", "../shaders/ShapeFS_Clr", "../shaders/ShapeFS_Tex", "../shaders/ShapeFS_Pick"],
    function(e, t, n, r) {
        var i = Cesium.defaultValue,
        s = Cesium.Cartesian3,
        o = {},
        u = function(e) {
            this._show = i(e.show, !0),
            this._position = i(e.position, [0, 0, 0]),
            this._rotation = i(e.rotation, [0, 0, 0]),
            this._scale = i(e.scale, [1, 1, 1]),
            this._color = Cesium.Color.clone(i(e.color, Cesium.Color.WHITE)),
            this._magnification = i(e.magnification, 1),
            this._texture = i(e.texture, undefined),
            this._flip_tex = i(e.flip_tex, !1),
            this._repeat_tex = i(e.repeat_tex, !1),
            this._mesh = i(e.mesh, undefined),
            this._mesh_show_all = i(e.mesh_show_all, !1),
            this._mesh_index = i(e.mesh_index, 0),
            this._mesh_loader = i(e.mesh_loader, undefined),
            this._mesh_args = i(e.mesh_args, undefined);
            var t = this;
            this._mesh_loader && (this._mesh = this._mesh_loader({
                obj: this,
                mesh_args: this._mesh_args
            })),
            this._colorCommands = [],
            this._pickCommands = [],
            this._commandLists = new Object(),
            this._pickId = undefined,
            this._dirty = !0
        };
        return u.prototype._get_color_umap = function() {
            var e = this;
            return {
                u_color: function() {
                    return e._color
                },
                u_texture: function() {
                    return e._texture
                },
                u_flip_tex: function() {
                    return e._flip_tex
                },
                u_repeat_tex: function() {
                    return e._repeat_tex
                }
            }
        },
        u.prototype._get_pick_umap = function() {
            var e = this;
            return {
                u_pick_color: function() {
                    return e._pickId.color
                }
            }
        },
        u.prototype.clone = function() {
            var e = new u({});
            return e._mesh = this._mesh,
            e._mesh_index = this._mesh_index,
            e._mesh_show_all = this._mesh_show_all,
            e._texture = this._texture,
            e._materials = this._materials,
            e._textures = this._textures,
            e._rotation = this._rotation.slice(),
            e._scale = this._scale.slice(),
            e._color = this._color,
            e._flip_tex = this._flip_tex,
            e
        },
        u.prototype.update = function(i, o, u) {
            if (!this._show) return;
            if (this._dirty) {
                if (!this._mesh) return;
                this._pickId === undefined && (this._pickId = i.createPickId(this));
                var a = this,
                f = this._mesh instanceof Array && this._mesh_show_all ? this._mesh.length: 1;
                for (var l = 0; l < f; l++) {
                    var c = this._colorCommands[l] = new Cesium.DrawCommand;
                    c.uniformMap = this._get_color_umap();
                    var h = this._pickCommands[l] = new Cesium.DrawCommand;
                    h.uniformMap = this._get_pick_umap(),
                    c.primitiveType = h.primitiveType = Cesium.PrimitiveType.TRIANGLES,
                    c.boundingVolume = h.boundingVolume = new Cesium.BoundingSphere,
                    c.skip_beginDraw = h.skip_beginDraw = this.skip_beginDraw,
                    c.skip_endDraw = h.skip_endDraw = this.skip_endDraw;
                    var p = this._mesh instanceof Array ? this._mesh[this._mesh_index + l] : this._mesh,
                    d = Cesium.GeometryPipeline.createAttributeLocations(p),
                    v = new s(5e5, 5e5, 5e5),
                    m = s.multiplyByScalar(v, .5),
                    g = s.negate(m);
                    Cesium.BoundingSphere.fromPoints([g, m], c.boundingVolume),
                    c.vertexArray = h.vertexArray = i.createVertexArrayFromGeometry({
                        geometry: p,
                        attributeIndices: d,
                        bufferUsage: Cesium.BufferUsage.STATIC_DRAW
                    });
                    var y;
                    if (this._materials) {
                        var b = this._materials[p.material];
                        if (b.image) {
                            var w = this._textures[b.image];
                            c.uniformMap.u_texture = function(e) {
                                return function() {
                                    return e
                                }
                            } (w),
                            y = n
                        } else {
                            var E = b.red ? b: Cesium.Color.WHITE;
                            c.uniformMap.u_color = function(e) {
                                return function() {
                                    return e
                                }
                            } (E),
                            y = t
                        }
                    } else y = this._texture ? n: t;
                    var S = e,
                    x = r;
                    c.shaderProgram = i.getShaderCache().getShaderProgram(S, y, d),
                    h.shaderProgram = i.getShaderCache().getShaderProgram(S, x, d),
                    c.renderState = h.renderState = i.createRenderState({
                        depthTest: {
                            enabled: !0
                        },
                        blending: Cesium.BlendingState.ALPHA_BLEND
                    });
                    var T, N, C;
                    C = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromDegrees(this._position[0], this._position[1], this._position[2])));
                    if (o.mode === Cesium.SceneMode.SCENE3D) N = Cesium.Matrix4.getTranslation(C);
                    else {
                        var k = Cesium.Matrix4.multiplyByVector(C, new Cesium.Cartesian4(0, 0, 0, 1));
                        k = o.scene2D.projection.project(Cesium.Ellipsoid.WGS84.cartesianToCartographic(s.fromCartesian4(k))),
                        N = new s(k.z, k.x, k.y)
                    }
                    o.mode === Cesium.SceneMode.SCENE3D ? T = Cesium.Matrix4.getRotation(C) : T = Cesium.Matrix3.fromRowMajorArray([0, 0, 1, 1, 0, 0, 0, 1, 0]),
                    T = Cesium.Matrix3.multiply(T, Cesium.Matrix3.fromQuaternion(Cesium.Quaternion.fromAxisAngle(new s( - 1, 0, 0), Cesium.Math.toRadians(this._rotation[0])))),
                    T = Cesium.Matrix3.multiply(T, Cesium.Matrix3.fromQuaternion(Cesium.Quaternion.fromAxisAngle(new s(0, -1, 0), Cesium.Math.toRadians(this._rotation[1])))),
                    T = Cesium.Matrix3.multiply(T, Cesium.Matrix3.fromQuaternion(Cesium.Quaternion.fromAxisAngle(new s(0, 0, -1), Cesium.Math.toRadians(this._rotation[2])))),
                    T = Cesium.Matrix3.multiply(T, Cesium.Matrix3.fromScale(new s(this._scale[0] * this._magnification, this._scale[1] * this._magnification, this._scale[2] * this._magnification)));
                    var L = p._node_mat ? p._node_mat: Cesium.Matrix4.IDENTITY;
                    c.modelMatrix = h.modelMatrix = Cesium.Matrix4.multiply(Cesium.Matrix4.fromRotationTranslation(T, N), L)
                }
            }
            var A = o.passes;
            this._commandLists.length = 0;
            this._commandLists.opaqueList = new Array();
            this._commandLists.pickList = new Array();
            if (A.color) for (var O = 0; O < this._colorCommands.length; O++) this._commandLists.opaqueList.push(this._colorCommands[O]);
            if (A.pick) for (var M = 0; M < this._pickCommands.length; M++) this._commandLists.pickList.push(this._pickCommands[M]);
            u.push(this._commandLists),
            this._dirty = !1
        },
        u.prototype.destroy = function() {
            for (var e = 0; e < this._colorCommands.length; e++) {
                var t = this._colorCommands[e];
                t.vertexArray = t.vertexArray && t.vertexArray.destroy(),
                t.shaderProgram = t.shaderProgram && t.shaderProgram.release()
            }
            return this._pickId = this._pickId && this._pickId.destroy(),
            Cesium.destroyObject(this)
        },
        u
    }), r("scene/ShapeCollection", ["./Shape"],
    function(e) {
        var t = Cesium.defaultValue,
        n = {},
        r = function() {
            this._shape_set = [],
            this._dirty = !1,
            this.show = !0
        };
        return r.prototype.add = function(e) {
            return this._shape_set.push(e),
            e
        },
        r.prototype.setDirty = function() {
            this._dirty = !0
        },
        r.prototype.getDirty = function() {
            return this._dirty
        },
        r.prototype.getShapeList = function() {
            return this._shape_set
        },
        r.prototype.removeAll = function() {
            var e = this._shape_set;
            this._shape_set = [];
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                n.destroy()
            }
            this.setDirty()
        },
        r.prototype.update = function(e, t, n) {
            if (!this.show) return;
            var r = n.length,
            i = this._shape_set.length;
            for (var s = 0; s < this._shape_set.length; s++) {
                var o = this._shape_set[s];
                s = parseInt(s, 10);
                var u = this._shape_set[Math.max(0, s - 1)];
                o._mesh === undefined && o._mesh_loader === undefined && (o._mesh = u._mesh, o._mesh_index = u._mesh_index, o._materials = u._materials, o._textures = u._textures, o._texture = u._texture, o._mesh_show_all = u._mesh_show_all),
                o._dirty |= this._dirty,
                this._shape_set[s].update(e, t, n);
                if (o._mesh_loader === undefined && !o._mesh_show_all && o._mesh === u._mesh) {
                    var a = t.passes,
                    f;
                    a.color && (f = n[r + s].opaqueList[0]),
                    a.pick && (f = n[r + s].pickList[0]),
                    f.boundingVolume = undefined,
                    f.skip_beginDraw = parseInt(s, 10) > 0,
                    f.skip_endDraw = parseInt(s, 10) < i - 1
                }
            }
            this._dirty = !1
        },
        r.prototype._destroy = function() {
            this.removeAll()
        },
        r
    }), r("scene/flyTo", [],
    function() {
        function n(t, n) {
            var r = e.cross(t, n);
            n = e.cross(r, t);
            var i = new Cesium.Matrix3(r.x, r.y, r.z, n.x, n.y, n.z, -t.x, -t.y, -t.z);
            return Cesium.Quaternion.fromRotationMatrix(i)
        }

        function r(e, t, n) {
            var r, i, s;
            if (e instanceof Cesium.PerspectiveFrustum) {
                var o = Math.tan(.5 * e.fovy);
                return r = e.near,
                i = e.near * o,
                s = e.aspectRatio * i,
                Math.max(t * r / s, n * r / i)
            }
            return e instanceof Cesium.PerspectiveOffCenterFrustum ? (r = e.near, i = e.top, s = e.right, Math.max(t * r / s, n * r / i)) : Math.max(t, n)
        }

        function i(e) {
            if (e.length > 2) return new Cesium.HermiteSpline(e);
            var t = e[0],
            n = e[1];
            return {
                getControlPoints: function() {
                    return e
                },
                evaluate: function(e) {
                    e = Cesium.Math.clamp(e, t.time, n.time);
                    var r = (e - t.time) / (n.time - t.time);
                    return Cesium.Cartesian3.lerp(t.point, n.point, r)
                }
            }
        }

        function s(t, n, s, o, u) {
            var a = n.getMaximumRadius(),
            f = t.frustum,
            l = r(f, a, a),
            c = e.dot(e.normalize(s), e.normalize(o)),
            h,
            p,
            d;
            if (e.magnitude(s) > l) p = a + .6 * (l - a),
            d = .35;
            else {
                var v = e.subtract(s, o);
                p = e.magnitude(e.add(e.multiplyByScalar(v, .5), o));
                var m = e.magnitude(e.multiplyByScalar(t.up, e.dot(v, t.up))),
                g = e.magnitude(e.multiplyByScalar(t.right, e.dot(v, t.right)));
                p += r(f, m, g),
                d = Cesium.Math.clamp(c + 1, .25, .5)
            }
            var y = e.multiplyByScalar(e.normalize(o), p),
            b = e.multiplyByScalar(e.normalize(s), p),
            w,
            E,
            S,
            x;
            e.magnitude(o) > l && c > .75 ? (x = e.add(e.multiplyByScalar(e.subtract(s, o), .5), o), h = [{
                point: s
            },
            {
                point: o
            }]) : e.magnitude(s) > l && c > 0 ? (x = e.add(e.multiplyByScalar(e.subtract(s, y), .5), y), h = [{
                point: s
            },
            {
                point: o
            }]) : (h = [{
                point: s
            }], h.push({
                point: o
            }));
            var T = u / (h.length - 1);
            for (var N = 0; N < h.length; ++N) h[N].time = N * T;
            return i(h)
        }

        function o(t, r, i, s) {
            r[0].orientation = n(t.direction, t.up);
            var o, u, a, f, l = r.length - 1;
            for (var c = 1; c < l; ++c) o = r[c],
            u = e.normalize(e.negate(o.point)),
            a = e.normalize(e.cross(u, Cesium.Cartesian3.UNIT_Z)),
            f = e.cross(a, u),
            o.orientation = n(u, f);
            return o = r[l],
            typeof i != "undefined" && typeof s != "undefined" ? o.orientation = n(i, s) : (u = e.normalize(e.negate(o.point)), a = e.normalize(e.cross(u, Cesium.Cartesian3.UNIT_Z)), f = e.cross(a, u), o.orientation = n(u, f)),
            new Cesium.OrientationInterpolator(r)
        }

        function u(t, n, r, i, u) {
            var a = t.camera,
            f = t.scene2D.projection.getEllipsoid(),
            l = s(a, f, a.position, n, r),
            c = o(a, l.getControlPoints(), i, u),
            h = function(t) {
                var n = t.time,
                r = c.evaluate(n),
                i = Cesium.Matrix3.fromQuaternion(r);
                a.position = l.evaluate(n),
                a.right = Cesium.Matrix3.getRow(i, 0),
                a.up = Cesium.Matrix3.getRow(i, 1),
                a.direction = e.negate(Cesium.Matrix3.getRow(i, 2))
            };
            return h
        }

        function a(t, n, s, o, u) {
            var a = n.getMaximumRadius(),
            f = t.frustum,
            l = r(f, Math.PI * a, Cesium.Math.PI_OVER_TWO * a),
            c,
            h,
            p = .5;
            if (s.z > l) h = .6 * l;
            else {
                var d = e.subtract(s, o);
                h = r(f, Math.abs(d.y), Math.abs(d.x))
            }
            var v = o.clone();
            v.z = h;
            var m = s.clone();
            m.z = h;
            var g;
            if (o.z > l) g = e.add(e.multiplyByScalar(e.subtract(s, o), .5), o),
            c = [{
                point: s
            },
            {
                point: g
            },
            {
                point: o
            }];
            else if (s.z > l) g = e.add(e.multiplyByScalar(e.subtract(s, v), .5), v),
            c = [{
                point: s
            },
            {
                point: g
            },
            {
                point: o
            }];
            else {
                c = [{
                    point: s
                }];
                var y = e.subtract(m, v),
                b = e.magnitude(y);
                y = e.normalize(y);
                var w = p * b,
                E = b - w;
                for (var S = E; S > 0; S -= w) c.push({
                    point: e.add(e.multiplyByScalar(y, S), v)
                });
                c.push({
                    point: o
                })
            }
            var x = u / (c.length - 1);
            for (var T = 0; T < c.length; ++T) c[T].time = T * x;
            return i(c)
        }

        function f(t, r, i, s) {
            r[0].orientation = n(t.direction, t.up);
            var o, u, a, f, l = r.length - 1;
            for (var c = 1; c < l; ++c) o = r[c],
            u = e.negate(e.UNIT_Z),
            a = e.normalize(e.cross(u, Cesium.Cartesian3.UNIT_Y)),
            f = e.cross(a, u),
            o.orientation = n(u, f);
            return o = r[l],
            typeof i != "undefined" && typeof s != "undefined" ? o.orientation = n(i, s) : (u = e.negate(e.UNIT_Z), a = e.normalize(e.cross(u, Cesium.Cartesian3.UNIT_Y)), f = e.cross(a, u), o.orientation = n(u, f)),
            new Cesium.OrientationInterpolator(r)
        }

        function l(t, n, r, i, s) {
            var o = t.camera,
            u = t.scene2D.projection.getEllipsoid(),
            l = a(o, u, o.position.clone(), n, r),
            c = f(o, l.getControlPoints(), i, s),
            h = function(t) {
                var n = t.time,
                r = c.evaluate(n),
                i = Cesium.Matrix3.fromQuaternion(r);
                o.position = l.evaluate(n),
                o.right = Matrix3.getRow(i, 0),
                o.up = Matrix3.getRow(i, 1),
                o.direction = e.negate(Matrix3.getRow(i, 2))
            };
            return h
        }

        function c(t, n, r, i, s) {
            var o = t.camera,
            u = t.scene2D.projection.getEllipsoid(),
            l = o.position.clone();
            l.z = o.frustum.right - o.frustum.left;
            var c = a(o, u, l, n, r),
            h = c.getControlPoints(),
            p = f(o, h, e.negate(e.UNIT_Z), s),
            d = o.position.z,
            v = function(t) {
                var n = t.time,
                r = p.evaluate(n),
                i = Cesium.Matrix3.fromQuaternion(r);
                o.position = c.evaluate(n);
                var s = o.position.z;
                o.position.z = d,
                o.right = Matrix3.getRow(i, 0),
                o.up = Matrix3.getRow(i, 1),
                o.direction = e.negate(Matrix3.getRow(i, 2));
                var u = o.frustum,
                a = u.top / u.right,
                f = (s - (u.right - u.left)) * .5;
                u.right += f,
                u.left -= f,
                u.top = a * u.right,
                u.bottom = -u.top
            };
            return v
        }

        function h(t) {
            if (t.transform.equals(Cesium.Matrix4.IDENTITY)) return;
            var n = t.positionWC,
            r = t.directionWC,
            i = t.upWC;
            t.transform = Cesium.Matrix4.IDENTITY,
            t.controller.constrainedAxis = undefined,
            t.controller.lookAt(n, e.add(n, r), i)
        }

        function p(t, n) {
            var r = t.getCamera(),
            i = Cesium.Transforms.eastNorthUpToFixedFrame(n),
            s = Cesium.Matrix4.inverse(i),
            o = r.positionWC,
            u = e.multiplyByScalar(e.normalize(r.directionWC), 1e3),
            a = e.add(o, u),
            f = r.upWC;
            r.controller.constrainedAxis = Cesium.Cartesian3.UNIT_Z,
            r.transform = i;
            var l = t.getScreenSpaceCameraController();
            l.setEllipsoid(Cesium.Ellipsoid.UNIT_SPHERE),
            l.enableTilt = !1;
            var c = Cesium.Matrix4.multiplyByPoint(s, o),
            h = Cesium.Matrix4.multiplyByPoint(s, a),
            p = e.subtract(h, c),
            d = Cesium.Matrix4.multiplyByVector(s, new Cesium.Cartesian4(f.x, f.y, f.z, 0));
            r.controller.lookAt(c, p, d)
        }

        function d(e, n) {
            return n.useCesium ? (console.log("using cesium"), Cesium.CameraFlightPath.createAnimation(e, n)) : t.createAnimation(e.getFrameState(), n)
        }

        function v(t) {
            var n = t.scene,
            r = n.primitives.getCentralBody().getEllipsoid();
            h(n.getCamera());
            if (typeof t.eye != "undefined") {
                var i;
                typeof t.center != "undefined" && (i = function() {
                    p(n, t.center)
                });
                var s = d(n, {
                    destination: t.eye,
                    direction: t.view,
                    up: t.up,
                    duration: t.duration,
                    useCesium: t.useCesium
                });
                n.getAnimations().add(s)
            }
            if (typeof t.sphere != "undefined") {
                var o = t.sphere,
                u = e.clone(o.center),
                a = e.normalize(e.clone(u)),
                f = e.add(u, e.multiplyByScalar(a, o.radius * 2)),
                l = r.cartesianToCartographic(f),
                c = e.multiplyByScalar(e.clone(a), -1),
                v = new Cesium.Cartesian3(0, 0, 1);
                console.log("loc: " + JSON.stringify(l)),
                console.log("dir: " + c),
                console.log("up: " + v);
                var s = d(n, {
                    destination: f,
                    direction: c,
                    up: v,
                    duration: t.duration,
                    useCesium: t.useCesium,
                    onComplete: function() {
                        p(n, u)
                    }
                });
                n.getAnimations().add(s)
            }
        }

        var e = Cesium.Cartesian3,
        t = {};
        return t.createAnimation = function(e, t) {
            t = Cesium.defaultValue(t, {});
            var n = t.destination,
            r = t.direction,
            i = t.up;
            if (typeof e == "undefined") throw new Cesium.DeveloperError("frameState is required.");
            if (typeof n == "undefined") throw new Cesium.DeveloperError("destination is required.");
            var s = Cesium.defaultValue(t.duration, 3e3),
            o = t.onComplete,
            a;
            return e.mode === Cesium.SceneMode.SCENE3D ? a = u(e, n, s, r, i) : e.mode === Cesium.SceneMode.SCENE2D ? a = c(e, n, s, r, i) : a = l(e, n, s, r, i),
            {
                duration: s,
                easingFunction: Cesium.Tween.Easing.Sinusoidal.InOut,
                startValue: {
                    time: 0
                },
                stopValue: {
                    time: s
                },
                onUpdate: a,
                onComplete: o
            }
        },
        t.createAnimationCartographic = function(e, t) {
            t = Cesium.defaultValue(t, {});
            var n = t.destination;
            if (typeof e == "undefined") throw new Cesium.DeveloperError("frameState is required.");
            if (typeof n == "undefined") throw new Cesium.DeveloperError("description.destination is required.");
            var r, i = e.scene2D.projection;
            if (e.mode === Cesium.SceneMode.SCENE3D) {
                var s = i.getEllipsoid();
                r = s.cartographicToCartesian(n)
            } else r = i.project(n);
            return t.destination = r,
            this.createAnimation(e, t)
        },
        v
    }), r("subspace", ["scene/DataVisualizer", "scene/Dataset", "scene/FileText", "scene/LiveTracker", "scene/MeshGenerator", "scene/MeshType", "scene/Model", "scene/Points", "scene/PointsCollection", "scene/SRTMTerrainProvider", "scene/Shape", "scene/ShapeCollection", "scene/VarType", "scene/Variable", "scene/flyTo", "shaders/PointsFS", "shaders/PointsVS", "shaders/ShapeFS_Clr", "shaders/ShapeFS_Pick", "shaders/ShapeFS_Tex", "shaders/ShapeVS"],
    function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w) {
        var E = {
            _shaders: {}
        };
        return E.DataVisualizer = e,
        E.Dataset = t,
        E.FileText = n,
        E.LiveTracker = r,
        E.MeshGenerator = i,
        E.MeshType = s,
        E.Model = o,
        E.Points = u,
        E.PointsCollection = a,
        E.SRTMTerrainProvider = f,
        E.Shape = l,
        E.ShapeCollection = c,
        E.VarType = h,
        E.Variable = p,
        E.flyTo = d,
        E.PointsFS = v,
        E.PointsVS = m,
        E.ShapeFS_Clr = g,
        E.ShapeFS_Pick = y,
        E.ShapeFS_Tex = b,
        E.ShapeVS = w,
        E
    }), t(["subspace"],
    function(e) {
        var t = typeof window != "undefined" ? window: typeof self != "undefined" ? self: {}; //self即window对象本身，t声明为window对象（先检测window对象是否已经定义）
        t.Subspace = e
    },
    undefined, !0), r("main",
    function() {})
})()