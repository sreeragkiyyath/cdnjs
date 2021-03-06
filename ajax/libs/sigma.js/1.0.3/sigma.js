/* sigma.js - A JavaScript library dedicated to graph drawing. - Version: 1.0.3 - Author: Alexis Jacomy, Sciences-Po Médialab - License: MIT */
(function() {
    "use strict";
    var a = {},
        b = function(c) {
            var d, e, f, g, h;
            b.classes.dispatcher.extend(this);
            var i = this,
                j = c || {};
            if ("string" == typeof j || j instanceof HTMLElement ? j = {
                    renderers: [j]
                } : "[object Array]" === Object.prototype.toString.call(j) && (j = {
                    renderers: j
                }), g = j.renderers || j.renderer || j.container, j.renderers && 0 !== j.renderers.length || ("string" == typeof g || g instanceof HTMLElement || "object" == typeof g && "container" in g) && (j.renderers = [g]), j.id) {
                if (a[j.id]) throw 'sigma: Instance "' + j.id + '" already exists.';
                Object.defineProperty(this, "id", {
                    value: j.id
                })
            } else {
                for (h = 0; a[h];) h++;
                Object.defineProperty(this, "id", {
                    value: "" + h
                })
            }
            for (a[this.id] = this, this.settings = new b.classes.configurable(b.settings, j.settings || {}), Object.defineProperty(this, "graph", {
                    value: new b.classes.graph(this.settings),
                    configurable: !0
                }), Object.defineProperty(this, "middlewares", {
                    value: [],
                    configurable: !0
                }), Object.defineProperty(this, "cameras", {
                    value: {},
                    configurable: !0
                }), Object.defineProperty(this, "renderers", {
                    value: {},
                    configurable: !0
                }), Object.defineProperty(this, "renderersPerCamera", {
                    value: {},
                    configurable: !0
                }), Object.defineProperty(this, "cameraFrames", {
                    value: {},
                    configurable: !0
                }), Object.defineProperty(this, "camera", {
                    get: function() {
                        return this.cameras[0]
                    }
                }), this._handler = function(a) {
                    var b, c = {};
                    for (b in a.data) c[b] = a.data[b];
                    c.renderer = a.target, this.dispatchEvent(a.type, c)
                }.bind(this), f = j.renderers || [], d = 0, e = f.length; e > d; d++) this.addRenderer(f[d]);
            for (f = j.middlewares || [], d = 0, e = f.length; e > d; d++) this.middlewares.push("string" == typeof f[d] ? b.middlewares[f[d]] : f[d]);
            "object" == typeof j.graph && j.graph && (this.graph.read(j.graph), this.refresh()), window.addEventListener("resize", function() {
                i.settings && i.refresh()
            })
        };
    if (b.prototype.addCamera = function(a) {
            var c, d = this;
            if (!arguments.length) {
                for (a = 0; this.cameras["" + a];) a++;
                a = "" + a
            }
            if (this.cameras[a]) throw 'sigma.addCamera: The camera "' + a + '" already exists.';
            return c = new b.classes.camera(a, this.graph, this.settings), this.cameras[a] = c, c.quadtree = new b.classes.quad, c.bind("coordinatesUpdated", function() {
                d.renderCamera(c, c.isAnimated)
            }), this.renderersPerCamera[a] = [], c
        }, b.prototype.killCamera = function(a) {
            if (a = "string" == typeof a ? this.cameras[a] : a, !a) throw "sigma.killCamera: The camera is undefined.";
            var b, c, d = this.renderersPerCamera[a.id];
            for (c = d.length, b = c - 1; b >= 0; b--) this.killRenderer(d[b]);
            return delete this.renderersPerCamera[a.id], delete this.cameraFrames[a.id], delete this.cameras[a.id], a.kill && a.kill(), this
        }, b.prototype.addRenderer = function(a) {
            var c, d, e, f, g = a || {};
            if ("string" == typeof g ? g = {
                    container: document.getElementById(g)
                } : g instanceof HTMLElement && (g = {
                    container: g
                }), "id" in g) c = g.id;
            else {
                for (c = 0; this.renderers["" + c];) c++;
                c = "" + c
            }
            if (this.renderers[c]) throw 'sigma.addRenderer: The renderer "' + c + '" already exists.';
            if (d = "function" == typeof g.type ? g.type : b.renderers[g.type], d = d || b.renderers.def, e = "camera" in g ? g.camera instanceof b.classes.camera ? g.camera : this.cameras[g.camera] || this.addCamera(g.camera) : this.addCamera(), this.cameras[e.id] !== e) throw "sigma.addRenderer: The camera is not properly referenced.";
            return f = new d(this.graph, e, this.settings, g), this.renderers[c] = f, Object.defineProperty(f, "id", {
                value: c
            }), f.bind && f.bind(["click", "rightClick", "clickStage", "doubleClickStage", "rightClickStage", "clickNode", "clickNodes", "doubleClickNode", "doubleClickNodes", "rightClickNode", "rightClickNodes", "overNode", "overNodes", "outNode", "outNodes", "downNode", "downNodes", "upNode", "upNodes"], this._handler), this.renderersPerCamera[e.id].push(f), f
        }, b.prototype.killRenderer = function(a) {
            if (a = "string" == typeof a ? this.renderers[a] : a, !a) throw "sigma.killRenderer: The renderer is undefined.";
            var b = this.renderersPerCamera[a.camera.id],
                c = b.indexOf(a);
            return c >= 0 && b.splice(c, 1), a.kill && a.kill(), delete this.renderers[a.id], this
        }, b.prototype.refresh = function() {
            var a, c, d, e, f, g, h = 0;
            for (e = this.middlewares || [], a = 0, c = e.length; c > a; a++) e[a].call(this, 0 === a ? "" : "tmp" + h + ":", a === c - 1 ? "ready:" : "tmp" + ++h + ":");
            for (d in this.cameras) f = this.cameras[d], f.settings("autoRescale") && this.renderersPerCamera[f.id] && this.renderersPerCamera[f.id].length ? b.middlewares.rescale.call(this, e.length ? "ready:" : "", f.readPrefix, {
                width: this.renderersPerCamera[f.id][0].width,
                height: this.renderersPerCamera[f.id][0].height
            }) : b.middlewares.copy.call(this, e.length ? "ready:" : "", f.readPrefix), g = b.utils.getBoundaries(this.graph, f.readPrefix), f.quadtree.index(this.graph.nodes(), {
                prefix: f.readPrefix,
                bounds: {
                    x: g.minX,
                    y: g.minY,
                    width: g.maxX - g.minX,
                    height: g.maxY - g.minY
                }
            });
            for (e = Object.keys(this.renderers), a = 0, c = e.length; c > a; a++)
                if (this.renderers[e[a]].process)
                    if (this.settings("skipErrors")) try {
                        this.renderers[e[a]].process()
                    } catch (i) {
                        console.log('Warning: The renderer "' + e[a] + '" crashed on ".process()"')
                    } else this.renderers[e[a]].process();
            return this.render(), this
        }, b.prototype.render = function() {
            var a, b, c;
            for (c = Object.keys(this.renderers), a = 0, b = c.length; b > a; a++)
                if (this.settings("skipErrors")) try {
                    this.renderers[c[a]].render()
                } catch (d) {
                    this.settings("verbose") && console.log('Warning: The renderer "' + c[a] + '" crashed on ".render()"')
                } else this.renderers[c[a]].render();
            return this
        }, b.prototype.renderCamera = function(a, b) {
            var c, d, e, f = this;
            if (b)
                for (e = this.renderersPerCamera[a.id], c = 0, d = e.length; d > c; c++)
                    if (this.settings("skipErrors")) try {
                        e[c].render()
                    } catch (g) {
                        this.settings("verbose") && console.log('Warning: The renderer "' + e[c].id + '" crashed on ".render()"')
                    } else e[c].render();
                    else if (!this.cameraFrames[a.id]) {
                for (e = this.renderersPerCamera[a.id], c = 0, d = e.length; d > c; c++)
                    if (this.settings("skipErrors")) try {
                        e[c].render()
                    } catch (g) {
                        this.settings("verbose") && console.log('Warning: The renderer "' + e[c].id + '" crashed on ".render()"')
                    } else e[c].render();
                this.cameraFrames[a.id] = requestAnimationFrame(function() {
                    delete f.cameraFrames[a.id]
                })
            }
            return this
        }, b.prototype.kill = function() {
            var b;
            this.graph.kill(), delete this.middlewares;
            for (b in this.renderers) this.killRenderer(this.renderers[b]);
            for (b in this.cameras) this.killCamera(this.cameras[b]);
            delete this.renderers, delete this.cameras;
            for (b in this) this.hasOwnProperty(b) && delete this[b];
            delete a[this.id]
        }, b.instances = function(c) {
            return arguments.length ? a[c] : b.utils.extend({}, a)
        }, b.version = "1.0.3", "undefined" != typeof this.sigma) throw "An object called sigma is already in the global scope.";
    this.sigma = b
}).call(this),
    function(a) {
        "use strict";

        function b(a, c) {
            var d, e, f, g;
            if (arguments.length)
                if (1 === arguments.length && Object(arguments[0]) === arguments[0])
                    for (a in arguments[0]) b(a, arguments[0][a]);
                else if (arguments.length > 1)
                for (g = Array.isArray(a) ? a : a.split(/ /), d = 0, e = g.length; d !== e; d += 1) f = g[d], C[f] || (C[f] = []), C[f].push({
                    handler: c
                })
        }

        function c(a, b) {
            var c, d, e, f, g, h, i = Array.isArray(a) ? a : a.split(/ /);
            if (arguments.length)
                if (b)
                    for (c = 0, d = i.length; c !== d; c += 1) {
                        if (h = i[c], C[h]) {
                            for (g = [], e = 0, f = C[h].length; e !== f; e += 1) C[h][e].handler !== b && g.push(C[h][e]);
                            C[h] = g
                        }
                        C[h] && 0 === C[h].length && delete C[h]
                    } else
                        for (c = 0, d = i.length; c !== d; c += 1) delete C[i[c]];
                else C = Object.create(null)
        }

        function d(a, b) {
            var c, d, e, f, g, h, i = Array.isArray(a) ? a : a.split(/ /);
            for (b = void 0 === b ? {} : b, c = 0, e = i.length; c !== e; c += 1)
                if (h = i[c], C[h])
                    for (g = {
                            type: h,
                            data: b || {}
                        }, d = 0, f = C[h].length; d !== f; d += 1) try {
                        C[h][d].handler(g)
                    } catch (j) {}
        }

        function e() {
            var a, b, c, d, e = !1,
                f = s(),
                g = x.shift();
            if (c = g.job(), f = s() - f, g.done++, g.time += f, g.currentTime += f, g.weightTime = g.currentTime / (g.weight || 1), g.averageTime = g.time / g.done, d = g.count ? g.count <= g.done : !c, !d) {
                for (a = 0, b = x.length; b > a; a++)
                    if (x[a].weightTime > g.weightTime) {
                        x.splice(a, 0, g), e = !0;
                        break
                    }
                e || x.push(g)
            }
            return d ? g : null
        }

        function f(a) {
            var b = x.length;
            w[a.id] = a, a.status = "running", b && (a.weightTime = x[b - 1].weightTime, a.currentTime = a.weightTime * (a.weight || 1)), a.startTime = s(), d("jobStarted", q(a)), x.push(a)
        }

        function g() {
            var a, b, c;
            for (a in v) b = v[a], b.after ? y[a] = b : f(b), delete v[a];
            for (u = !!x.length; x.length && s() - t < B.frameDuration;)
                if (c = e()) {
                    i(c.id);
                    for (a in y) y[a].after === c.id && (f(y[a]), delete y[a])
                }
            u ? (t = s(), d("enterFrame"), setTimeout(g, 0)) : d("stop")
        }

        function h(a, b) {
            var c, e, f;
            if (Array.isArray(a)) {
                for (A = !0, c = 0, e = a.length; e > c; c++) h(a[c].id, p(a[c], b));
                A = !1, u || (t = s(), d("start"), g())
            } else if ("object" == typeof a)
                if ("string" == typeof a.id) h(a.id, a);
                else {
                    A = !0;
                    for (c in a) "function" == typeof a[c] ? h(c, p({
                        job: a[c]
                    }, b)) : h(c, p(a[c], b));
                    A = !1, u || (t = s(), d("start"), g())
                } else {
                if ("string" != typeof a) throw new Error("[conrad.addJob] Wrong arguments.");
                if (k(a)) throw new Error('[conrad.addJob] Job with id "' + a + '" already exists.');
                if ("function" == typeof b) f = {
                    id: a,
                    done: 0,
                    time: 0,
                    status: "waiting",
                    currentTime: 0,
                    averageTime: 0,
                    weightTime: 0,
                    job: b
                };
                else {
                    if ("object" != typeof b) throw new Error("[conrad.addJob] Wrong arguments.");
                    f = p({
                        id: a,
                        done: 0,
                        time: 0,
                        status: "waiting",
                        currentTime: 0,
                        averageTime: 0,
                        weightTime: 0
                    }, b)
                }
                v[a] = f, d("jobAdded", q(f)), u || A || (t = s(), d("start"), g())
            }
            return this
        }

        function i(a) {
            var b, c, e, f, g = !1;
            if (Array.isArray(a))
                for (b = 0, c = a.length; c > b; b++) i(a[b]);
            else {
                if ("string" != typeof a) throw new Error("[conrad.killJob] Wrong arguments.");
                for (e = [w, y, v], b = 0, c = e.length; c > b; b++) a in e[b] && (f = e[b][a], B.history && (f.status = "done", z.push(f)), d("jobEnded", q(f)), delete e[b][a], "function" == typeof f.end && f.end(), g = !0);
                for (e = x, b = 0, c = e.length; c > b; b++)
                    if (e[b].id === a) {
                        e.splice(b, 1);
                        break
                    }
                if (!g) throw new Error('[conrad.killJob] Job "' + a + '" not found.')
            }
            return this
        }

        function j() {
            var a, b = p(v, w, y);
            if (B.history)
                for (a in b) b[a].status = "done", z.push(b[a]), "function" == typeof b[a].end && b[a].end();
            return v = {}, y = {}, w = {}, x = [], u = !1, this
        }

        function k(a) {
            var b = v[a] || w[a] || y[a];
            return b ? p(b) : null
        }

        function l() {
            var a;
            if ("string" == typeof a1 && 1 === arguments.length) return B[a1];
            a = "object" == typeof a1 && 1 === arguments.length ? a1 || {} : {}, "string" == typeof a1 && (a[a1] = a2);
            for (var b in a) void 0 !== a[b] ? B[b] = a[b] : delete B[b];
            return this
        }

        function m() {
            return u
        }

        function n() {
            return z = [], this
        }

        function o(a, b) {
            var c, d, e, f, g, h, i;
            if (!arguments.length) {
                g = [];
                for (d in v) g.push(v[d]);
                for (d in y) g.push(y[d]);
                for (d in w) g.push(w[d]);
                g = g.concat(z)
            }
            if ("string" == typeof a) switch (a) {
                case "waiting":
                    g = r(y);
                    break;
                case "running":
                    g = r(w);
                    break;
                case "done":
                    g = z;
                    break;
                default:
                    h = a
            }
            if (a instanceof RegExp && (h = a), !h && ("string" == typeof b || b instanceof RegExp) && (h = b), h) {
                if (i = "string" == typeof h, g instanceof Array) c = g;
                else if ("object" == typeof g) {
                    c = [];
                    for (d in g) c = c.concat(g[d])
                } else {
                    c = [];
                    for (d in v) c.push(v[d]);
                    for (d in y) c.push(y[d]);
                    for (d in w) c.push(w[d]);
                    c = c.concat(z)
                }
                for (g = [], e = 0, f = c.length; f > e; e++)(i ? c[e].id === h : c[e].id.match(h)) && g.push(c[e])
            }
            return q(g)
        }

        function p() {
            var a, b, c = {},
                d = arguments.length;
            for (a = d - 1; a >= 0; a--)
                for (b in arguments[a]) c[b] = arguments[a][b];
            return c
        }

        function q(a) {
            var b, c, d;
            if (!a) return a;
            if (Array.isArray(a))
                for (b = [], c = 0, d = a.length; d > c; c++) b.push(q(a[c]));
            else if ("object" == typeof a) {
                b = {};
                for (c in a) b[c] = q(a[c])
            } else b = a;
            return b
        }

        function r(a) {
            var b, c = [];
            for (b in a) c.push(a[b]);
            return c
        }

        function s() {
            return Date.now ? Date.now() : (new Date).getTime()
        }
        if (a.conrad) throw new Error("conrad already exists");
        var t, u = !1,
            v = {},
            w = {},
            x = [],
            y = {},
            z = [],
            A = !1,
            B = {
                frameDuration: 20,
                history: !0
            },
            C = Object.create(null);
        Array.isArray || (Array.isArray = function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        });
        var D = {
            hasJob: k,
            addJob: h,
            killJob: i,
            killAll: j,
            settings: l,
            getStats: o,
            isRunning: m,
            clearHistory: n,
            bind: b,
            unbind: c,
            version: "0.1.0"
        };
        "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (exports = module.exports = D), exports.conrad = D), a.conrad = D
    }(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        var b = this;
        sigma.utils = sigma.utils || {}, sigma.utils.extend = function() {
            var a, b, c = {},
                d = arguments.length;
            for (a = d - 1; a >= 0; a--)
                for (b in arguments[a]) c[b] = arguments[a][b];
            return c
        }, sigma.utils.dateNow = function() {
            return Date.now ? Date.now() : (new Date).getTime()
        }, sigma.utils.pkg = function(a) {
            return (a || "").split(".").reduce(function(a, b) {
                return b in a ? a[b] : a[b] = {}
            }, b)
        }, sigma.utils.id = function() {
            var a = 0;
            return function() {
                return ++a
            }
        }(), sigma.utils.floatColor = function(a) {
            var b = [0, 0, 0];
            return a.match(/^#/) ? (a = (a || "").replace(/^#/, ""), b = 3 === a.length ? [parseInt(a.charAt(0) + a.charAt(0), 16), parseInt(a.charAt(1) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(2), 16)] : [parseInt(a.charAt(0) + a.charAt(1), 16), parseInt(a.charAt(2) + a.charAt(3), 16), parseInt(a.charAt(4) + a.charAt(5), 16)]) : a.match(/^ *rgba? *\(/) && (a = a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/), b = [+a[1], +a[2], +a[3]]), 256 * b[0] * 256 + 256 * b[1] + b[2]
        }, sigma.utils.zoomTo = function(a, b, c, d, e) {
            var f, g, h, i = a.settings;
            g = Math.max(i("zoomMin"), Math.min(i("zoomMax"), a.ratio * d)), g !== a.ratio && (d = g / a.ratio, h = {
                x: b * (1 - d) + a.x,
                y: c * (1 - d) + a.y,
                ratio: g
            }, e && e.duration ? (f = sigma.misc.animation.killAll(a), e = sigma.utils.extend(e, {
                easing: f ? "quadraticOut" : "quadraticInOut"
            }), sigma.misc.animation.camera(a, h, e)) : (a.goTo(h), e && e.onComplete && e.onComplete()))
        }, sigma.utils.getX = function(b) {
            return b.offsetX !== a && b.offsetX || b.layerX !== a && b.layerX || b.clientX !== a && b.clientX
        }, sigma.utils.getY = function(b) {
            return b.offsetY !== a && b.offsetY || b.layerY !== a && b.layerY || b.clientY !== a && b.clientY
        }, sigma.utils.getDelta = function(b) {
            return b.wheelDelta !== a && b.wheelDelta || b.detail !== a && -b.detail
        }, sigma.utils.getOffset = function(a) {
            for (var b = 0, c = 0; a;) c += parseInt(a.offsetTop), b += parseInt(a.offsetLeft), a = a.offsetParent;
            return {
                top: c,
                left: b
            }
        }, sigma.utils.doubleClick = function(a, b, c) {
            var d, e = 0;
            a._doubleClickHandler = a._doubleClickHandler || {}, a._doubleClickHandler[b] = a._doubleClickHandler[b] || [], d = a._doubleClickHandler[b], d.push(function(a) {
                return e++, 2 === e ? (e = 0, c(a)) : void(1 === e && setTimeout(function() {
                    e = 0
                }, sigma.settings.doubleClickTimeout))
            }), a.addEventListener(b, d[d.length - 1], !1)
        }, sigma.utils.unbindDoubleClick = function(a, b) {
            for (var c, d = (a._doubleClickHandler || {})[b] || []; c = d.pop();) a.removeEventListener(b, c);
            delete(a._doubleClickHandler || {})[b]
        }, sigma.utils.easings = sigma.utils.easings || {}, sigma.utils.easings.linearNone = function(a) {
            return a
        }, sigma.utils.easings.quadraticIn = function(a) {
            return a * a
        }, sigma.utils.easings.quadraticOut = function(a) {
            return a * (2 - a)
        }, sigma.utils.easings.quadraticInOut = function(a) {
            return (a *= 2) < 1 ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
        }, sigma.utils.easings.cubicIn = function(a) {
            return a * a * a
        }, sigma.utils.easings.cubicOut = function(a) {
            return --a * a * a + 1
        }, sigma.utils.easings.cubicInOut = function(a) {
            return (a *= 2) < 1 ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
        }, sigma.utils.loadShader = function(a, b, c, d) {
            var e, f = a.createShader(c);
            return a.shaderSource(f, b), a.compileShader(f), e = a.getShaderParameter(f, a.COMPILE_STATUS), e ? f : (d && d('Error compiling shader "' + f + '":' + a.getShaderInfoLog(f)), a.deleteShader(f), null)
        }, sigma.utils.loadProgram = function(a, b, c, d, e) {
            var f, g, h = a.createProgram();
            for (f = 0; f < b.length; ++f) a.attachShader(h, b[f]);
            if (c)
                for (f = 0; f < c.length; ++f) a.bindAttribLocation(h, locations ? locations[f] : f, opt_attribs[f]);
            return a.linkProgram(h), g = a.getProgramParameter(h, a.LINK_STATUS), g ? h : (e && e("Error in program linking: " + a.getProgramInfoLog(h)), a.deleteProgram(h), null)
        }, sigma.utils.pkg("sigma.utils.matrices"), sigma.utils.matrices.translation = function(a, b) {
            return [1, 0, 0, 0, 1, 0, a, b, 1]
        }, sigma.utils.matrices.rotation = function(a, b) {
            var c = Math.cos(a),
                d = Math.sin(a);
            return b ? [c, -d, d, c] : [c, -d, 0, d, c, 0, 0, 0, 1]
        }, sigma.utils.matrices.scale = function(a, b) {
            return b ? [a, 0, 0, a] : [a, 0, 0, 0, a, 0, 0, 0, 1]
        }, sigma.utils.matrices.multiply = function(a, b, c) {
            var d = c ? 2 : 3,
                e = a[0 * d + 0],
                f = a[0 * d + 1],
                g = a[0 * d + 2],
                h = a[1 * d + 0],
                i = a[1 * d + 1],
                j = a[1 * d + 2],
                k = a[2 * d + 0],
                l = a[2 * d + 1],
                m = a[2 * d + 2],
                n = b[0 * d + 0],
                o = b[0 * d + 1],
                p = b[0 * d + 2],
                q = b[1 * d + 0],
                r = b[1 * d + 1],
                s = b[1 * d + 2],
                t = b[2 * d + 0],
                u = b[2 * d + 1],
                v = b[2 * d + 2];
            return c ? [e * n + f * q, e * o + f * r, h * n + i * q, h * o + i * r] : [e * n + f * q + g * t, e * o + f * r + g * u, e * p + f * s + g * v, h * n + i * q + j * t, h * o + i * r + j * u, h * p + i * s + j * v, k * n + l * q + m * t, k * o + l * r + m * u, k * p + l * s + m * v]
        }
    }.call(this),
    function(a) {
        "use strict";
        var b, c = 0,
            d = ["ms", "moz", "webkit", "o"];
        for (b = 0; b < d.length && !a.requestAnimationFrame; b++) a.requestAnimationFrame = a[d[b] + "RequestAnimationFrame"], a.cancelAnimationFrame = a[d[b] + "CancelAnimationFrame"] || a[d[b] + "CancelRequestAnimationFrame"];
        a.requestAnimationFrame || (a.requestAnimationFrame = function(b) {
            var d = (new Date).getTime(),
                e = Math.max(0, 16 - (d - c)),
                f = a.setTimeout(function() {
                    b(d + e)
                }, e);
            return c = d + e, f
        }), a.cancelAnimationFrame || (a.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        }), Function.prototype.bind || (Function.prototype.bind = function(a) {
            if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var b, c, d = Array.prototype.slice.call(arguments, 1),
                e = this;
            return b = function() {}, c = function() {
                return e.apply(this instanceof b && a ? this : a, d.concat(Array.prototype.slice.call(arguments)))
            }, b.prototype = this.prototype, c.prototype = new b, c
        })
    }(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.settings");
        var a = {
            clone: !0,
            immutable: !0,
            verbose: !1,
            defaultLabelColor: "#000",
            defaultEdgeColor: "#000",
            defaultNodeColor: "#000",
            defaultLabelSize: 14,
            edgeColor: "source",
            font: "arial",
            fontStyle: "",
            labelColor: "default",
            labelSize: "fixed",
            labelSizeRatio: 1,
            labelThreshold: 8,
            webglOversamplingRatio: 2,
            borderSize: 0,
            defaultNodeBorderColor: "#000",
            hoverFont: "",
            singleHover: !1,
            hoverFontStyle: "",
            labelHoverShadow: "default",
            labelHoverShadowColor: "#000",
            nodeHoverColor: "node",
            defaultNodeHoverColor: "#000",
            labelHoverBGColor: "default",
            defaultHoverLabelBGColor: "#fff",
            labelHoverColor: "default",
            defaultLabelHoverColor: "#000",
            drawLabels: !0,
            drawEdges: !0,
            drawNodes: !0,
            batchEdgesDrawing: !1,
            hideEdgesOnMove: !1,
            canvasEdgesBatchSize: 500,
            webglEdgesBatchSize: 1e3,
            scalingMode: "inside",
            sideMargin: 0,
            minEdgeSize: .5,
            maxEdgeSize: 1,
            minNodeSize: 1,
            maxNodeSize: 8,
            touchEnabled: !0,
            mouseEnabled: !0,
            doubleClickEnabled: !0,
            eventsEnabled: !0,
            zoomingRatio: 1.7,
            doubleClickZoomingRatio: 2.2,
            zoomMin: .0625,
            zoomMax: 2,
            mouseZoomDuration: 200,
            doubleClickZoomDuration: 200,
            mouseInertiaDuration: 200,
            mouseInertiaRatio: 3,
            touchInertiaDuration: 200,
            touchInertiaRatio: 3,
            doubleClickTimeout: 300,
            doubleTapTimeout: 300,
            dragTimeout: 200,
            autoResize: !0,
            autoRescale: !0,
            enableCamera: !0,
            enableHovering: !0,
            rescaleIgnoreSize: !1,
            skipErrors: !1,
            nodesPowRatio: .5,
            edgesPowRatio: .5,
            animationsTime: 200
        };
        sigma.settings = sigma.utils.extend(sigma.settings || {}, a)
    }.call(this),
    function() {
        "use strict";
        var a = function() {
            Object.defineProperty(this, "_handlers", {
                value: {}
            })
        };
        a.prototype.bind = function(a, b) {
            var c, d, e, f;
            if (1 === arguments.length && "object" == typeof arguments[0])
                for (a in arguments[0]) this.bind(a, arguments[0][a]);
            else {
                if (2 !== arguments.length || "function" != typeof arguments[1]) throw "bind: Wrong arguments.";
                for (f = "string" == typeof a ? a.split(" ") : a, c = 0, d = f.length; c !== d; c += 1) e = f[c], e && (this._handlers[e] || (this._handlers[e] = []), this._handlers[e].push({
                    handler: b
                }))
            }
            return this
        }, a.prototype.unbind = function(a, b) {
            var c, d, e, f, g, h, i, j = "string" == typeof a ? a.split(" ") : a;
            if (!arguments.length) {
                for (g in this._handlers) delete this._handlers[g];
                return this
            }
            if (b)
                for (c = 0, d = j.length; c !== d; c += 1) {
                    if (i = j[c], this._handlers[i]) {
                        for (h = [], e = 0, f = this._handlers[i].length; e !== f; e += 1) this._handlers[i][e].handler !== b && h.push(this._handlers[i][e]);
                        this._handlers[i] = h
                    }
                    this._handlers[i] && 0 === this._handlers[i].length && delete this._handlers[i]
                } else
                    for (c = 0, d = j.length; c !== d; c += 1) delete this._handlers[j[c]];
            return this
        }, a.prototype.dispatchEvent = function(a, b) {
            var c, d, e, f, g, h, i, j = this,
                k = "string" == typeof a ? a.split(" ") : a;
            for (b = void 0 === b ? {} : b, c = 0, d = k.length; c !== d; c += 1)
                if (i = k[c], this._handlers[i]) {
                    for (h = j.getEvent(i, b), g = [], e = 0, f = this._handlers[i].length; e !== f; e += 1) this._handlers[i][e].handler(h), this._handlers[i][e].one || g.push(this._handlers[i][e]);
                    this._handlers[i] = g
                }
            return this
        }, a.prototype.getEvent = function(a, b) {
            return {
                type: a,
                data: b || {},
                target: this
            }
        }, a.extend = function(b, c) {
            var d;
            for (d in a.prototype) a.prototype.hasOwnProperty(d) && (b[d] = a.prototype[d]);
            a.apply(b, c)
        }, "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {}, this.sigma.classes.dispatcher = a) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = a), exports.dispatcher = a) : this.dispatcher = a
    }.call(this),
    function() {
        "use strict";
        var a = function() {
            var b, c, d = {},
                e = Array.prototype.slice.call(arguments, 0),
                f = function(a, g) {
                    var h, i;
                    if (1 === arguments.length && "string" == typeof a) {
                        if (a in d && void 0 !== d[a]) return d[a];
                        for (b = 0, c = e.length; c > b; b++)
                            if (a in e[b] && void 0 !== e[b][a]) return e[b][a];
                        return void 0
                    }
                    if ("object" == typeof a && "string" == typeof g) return g in (a || {}) ? a[g] : f(g);
                    h = "object" == typeof a && void 0 === g ? a : {}, "string" == typeof a && (h[a] = g);
                    for (i in h) d[i] = h[i];
                    return this
                };
            for (f.embedObjects = function() {
                    var b = e.concat(d).concat(Array.prototype.splice.call(arguments, 0));
                    return a.apply({}, b)
                }, b = 0, c = arguments.length; c > b; b++) f(arguments[b]);
            return f
        };
        "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {}, this.sigma.classes.configurable = a) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = a), exports.configurable = a) : this.configurable = a
    }.call(this),
    function() {
        "use strict";

        function a(a, b, c) {
            var d = function() {
                var d, e;
                for (d in g[a]) g[a][d].apply(b, arguments);
                e = c.apply(b, arguments);
                for (d in f[a]) f[a][d].apply(b, arguments);
                return e
            };
            return d
        }

        function b(a) {
            var b;
            for (b in a) "hasOwnProperty" in a && !a.hasOwnProperty(b) || delete a[b];
            return a
        }
        var c = Object.create(null),
            d = Object.create(null),
            e = Object.create(null),
            f = Object.create(null),
            g = Object.create(null),
            h = {
                immutable: !0,
                clone: !0
            },
            i = function(a) {
                return h[a]
            },
            j = function(b) {
                var d, f, g;
                g = {
                    settings: b || i,
                    nodesArray: [],
                    edgesArray: [],
                    nodesIndex: Object.create(null),
                    edgesIndex: Object.create(null),
                    inNeighborsIndex: Object.create(null),
                    outNeighborsIndex: Object.create(null),
                    allNeighborsIndex: Object.create(null),
                    inNeighborsCount: Object.create(null),
                    outNeighborsCount: Object.create(null),
                    allNeighborsCount: Object.create(null)
                };
                for (d in e) e[d].call(g);
                for (d in c) f = a(d, g, c[d]), this[d] = f, g[d] = f
            };
        j.addMethod = function(a, b) {
            if ("string" != typeof a || "function" != typeof b || 2 !== arguments.length) throw "addMethod: Wrong arguments.";
            if (c[a] || j[a]) throw 'The method "' + a + '" already exists.';
            return c[a] = b, f[a] = Object.create(null), g[a] = Object.create(null), this
        }, j.hasMethod = function(a) {
            return !(!c[a] && !j[a])
        }, j.attach = function(a, b, c, d) {
            if ("string" != typeof a || "string" != typeof b || "function" != typeof c || arguments.length < 3 || arguments.length > 4) throw "attach: Wrong arguments.";
            var h;
            if ("constructor" === a) h = e;
            else if (d) {
                if (!g[a]) throw 'The method "' + a + '" does not exist.';
                h = g[a]
            } else {
                if (!f[a]) throw 'The method "' + a + '" does not exist.';
                h = f[a]
            }
            if (h[b]) throw 'A function "' + b + '" is already attached to the method "' + a + '".';
            return h[b] = c, this
        }, j.attachBefore = function(a, b, c) {
            return this.attach(a, b, c, !0)
        }, j.addIndex = function(a, b) {
            if ("string" != typeof a || Object(b) !== b || 2 !== arguments.length) throw "addIndex: Wrong arguments.";
            if (d[a]) throw 'The index "' + a + '" already exists.';
            var c;
            d[a] = b;
            for (c in b) {
                if ("function" != typeof b[c]) throw "The bindings must be functions.";
                j.attach(c, a, b[c])
            }
            return this
        }, j.addMethod("addNode", function(a) {
            if (Object(a) !== a || 1 !== arguments.length) throw "addNode: Wrong arguments.";
            if ("string" != typeof a.id) throw "The node must have a string id.";
            if (this.nodesIndex[a.id]) throw 'The node "' + a.id + '" already exists.';
            var b, c = a.id,
                d = Object.create(null);
            if (this.settings("clone"))
                for (b in a) "id" !== b && (d[b] = a[b]);
            else d = a;
            return this.settings("immutable") ? Object.defineProperty(d, "id", {
                value: c,
                enumerable: !0
            }) : d.id = c, this.inNeighborsIndex[c] = Object.create(null), this.outNeighborsIndex[c] = Object.create(null), this.allNeighborsIndex[c] = Object.create(null), this.inNeighborsCount[c] = 0, this.outNeighborsCount[c] = 0, this.allNeighborsCount[c] = 0, this.nodesArray.push(d), this.nodesIndex[d.id] = d, this
        }), j.addMethod("addEdge", function(a) {
            if (Object(a) !== a || 1 !== arguments.length) throw "addEdge: Wrong arguments.";
            if ("string" != typeof a.id) throw "The edge must have a string id.";
            if ("string" != typeof a.source || !this.nodesIndex[a.source]) throw "The edge source must have an existing node id.";
            if ("string" != typeof a.target || !this.nodesIndex[a.target]) throw "The edge target must have an existing node id.";
            if (this.edgesIndex[a.id]) throw 'The edge "' + a.id + '" already exists.';
            var b, c = Object.create(null);
            if (this.settings("clone"))
                for (b in a) "id" !== b && "source" !== b && "target" !== b && (c[b] = a[b]);
            else c = a;
            return this.settings("immutable") ? (Object.defineProperty(c, "id", {
                value: a.id,
                enumerable: !0
            }), Object.defineProperty(c, "source", {
                value: a.source,
                enumerable: !0
            }), Object.defineProperty(c, "target", {
                value: a.target,
                enumerable: !0
            })) : (c.id = a.id, c.source = a.source, c.target = a.target), this.edgesArray.push(c), this.edgesIndex[c.id] = c, this.inNeighborsIndex[c.target][c.source] || (this.inNeighborsIndex[c.target][c.source] = Object.create(null)), this.inNeighborsIndex[c.target][c.source][c.id] = c, this.outNeighborsIndex[c.source][c.target] || (this.outNeighborsIndex[c.source][c.target] = Object.create(null)), this.outNeighborsIndex[c.source][c.target][c.id] = c, this.allNeighborsIndex[c.source][c.target] || (this.allNeighborsIndex[c.source][c.target] = Object.create(null)), this.allNeighborsIndex[c.source][c.target][c.id] = c, this.allNeighborsIndex[c.target][c.source] || (this.allNeighborsIndex[c.target][c.source] = Object.create(null)), this.allNeighborsIndex[c.target][c.source][c.id] = c, this.inNeighborsCount[c.target] ++, this.outNeighborsCount[c.source] ++, this.allNeighborsCount[c.target] ++, this.allNeighborsCount[c.source] ++, this
        }), j.addMethod("dropNode", function(a) {
            if ("string" != typeof a || 1 !== arguments.length) throw "dropNode: Wrong arguments.";
            if (!this.nodesIndex[a]) throw 'The node "' + a + '" does not exist.';
            var b, c, d;
            for (delete this.nodesIndex[a], b = 0, d = this.nodesArray.length; d > b; b++)
                if (this.nodesArray[b].id === a) {
                    this.nodesArray.splice(b, 1);
                    break
                }
            for (b = this.edgesArray.length - 1; b >= 0; b--)(this.edgesArray[b].source === a || this.edgesArray[b].target === a) && this.dropEdge(this.edgesArray[b].id);
            delete this.inNeighborsIndex[a], delete this.outNeighborsIndex[a], delete this.allNeighborsIndex[a], delete this.inNeighborsCount[a], delete this.outNeighborsCount[a], delete this.allNeighborsCount[a];
            for (c in this.nodesIndex) delete this.inNeighborsIndex[c][a], delete this.outNeighborsIndex[c][a], delete this.allNeighborsIndex[c][a];
            return this
        }), j.addMethod("dropEdge", function(a) {
            if ("string" != typeof a || 1 !== arguments.length) throw "dropEdge: Wrong arguments.";
            if (!this.edgesIndex[a]) throw 'The edge "' + a + '" does not exist.';
            var b, c, d;
            for (d = this.edgesIndex[a], delete this.edgesIndex[a], b = 0, c = this.edgesArray.length; c > b; b++)
                if (this.edgesArray[b].id === a) {
                    this.edgesArray.splice(b, 1);
                    break
                }
            return delete this.inNeighborsIndex[d.target][d.source][d.id], Object.keys(this.inNeighborsIndex[d.target][d.source]).length || delete this.inNeighborsIndex[d.target][d.source], delete this.outNeighborsIndex[d.source][d.target][d.id], Object.keys(this.outNeighborsIndex[d.source][d.target]).length || delete this.outNeighborsIndex[d.source][d.target], delete this.allNeighborsIndex[d.source][d.target][d.id], Object.keys(this.allNeighborsIndex[d.source][d.target]).length || delete this.allNeighborsIndex[d.source][d.target], delete this.allNeighborsIndex[d.target][d.source][d.id], Object.keys(this.allNeighborsIndex[d.target][d.source]).length || delete this.allNeighborsIndex[d.target][d.source], this.inNeighborsCount[d.target] --, this.outNeighborsCount[d.source] --, this.allNeighborsCount[d.source] --, this.allNeighborsCount[d.target] --, this
        }), j.addMethod("kill", function() {
            this.nodesArray.length = 0, this.edgesArray.length = 0, delete this.nodesArray, delete this.edgesArray, delete this.nodesIndex, delete this.edgesIndex, delete this.inNeighborsIndex, delete this.outNeighborsIndex, delete this.allNeighborsIndex, delete this.inNeighborsCount, delete this.outNeighborsCount, delete this.allNeighborsCount
        }), j.addMethod("clear", function() {
            return this.nodesArray.length = 0, this.edgesArray.length = 0, b(this.nodesIndex), b(this.edgesIndex), b(this.nodesIndex), b(this.inNeighborsIndex), b(this.outNeighborsIndex), b(this.allNeighborsIndex), b(this.inNeighborsCount), b(this.outNeighborsCount), b(this.allNeighborsCount), this
        }), j.addMethod("read", function(a) {
            var b, c, d;
            for (c = a.nodes || [], b = 0, d = c.length; d > b; b++) this.addNode(c[b]);
            for (c = a.edges || [], b = 0, d = c.length; d > b; b++) this.addEdge(c[b]);
            return this
        }), j.addMethod("nodes", function(a) {
            if (!arguments.length) return this.nodesArray.slice(0);
            if (1 === arguments.length && "string" == typeof a) return this.nodesIndex[a];
            if (1 === arguments.length && "[object Array]" === Object.prototype.toString.call(a)) {
                var b, c, d = [];
                for (b = 0, c = a.length; c > b; b++) {
                    if ("string" != typeof a[b]) throw "nodes: Wrong arguments.";
                    d.push(this.nodesIndex[a[b]])
                }
                return d
            }
            throw "nodes: Wrong arguments."
        }), j.addMethod("degree", function(a, b) {
            if (b = {
                    "in": this.inNeighborsCount,
                    out: this.outNeighborsCount
                }[b || ""] || this.allNeighborsCount, "string" == typeof a) return b[a];
            if ("[object Array]" === Object.prototype.toString.call(a)) {
                var c, d, e = [];
                for (c = 0, d = a.length; d > c; c++) {
                    if ("string" != typeof a[c]) throw "degree: Wrong arguments.";
                    e.push(b[a[c]])
                }
                return e
            }
            throw "degree: Wrong arguments."
        }), j.addMethod("edges", function(a) {
            if (!arguments.length) return this.edgesArray.slice(0);
            if (1 === arguments.length && "string" == typeof a) return this.edgesIndex[a];
            if (1 === arguments.length && "[object Array]" === Object.prototype.toString.call(a)) {
                var b, c, d = [];
                for (b = 0, c = a.length; c > b; b++) {
                    if ("string" != typeof a[b]) throw "edges: Wrong arguments.";
                    d.push(this.edgesIndex[a[b]])
                }
                return d
            }
            throw "edges: Wrong arguments."
        }), "undefined" != typeof sigma ? (sigma.classes = sigma.classes || Object.create(null), sigma.classes.graph = j) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = j), exports.graph = j) : this.graph = j
    }.call(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.classes"), sigma.classes.camera = function(a, b, c, d) {
            sigma.classes.dispatcher.extend(this), Object.defineProperty(this, "graph", {
                value: b
            }), Object.defineProperty(this, "id", {
                value: a
            }), Object.defineProperty(this, "readPrefix", {
                value: "read_cam" + a + ":"
            }), Object.defineProperty(this, "prefix", {
                value: "cam" + a + ":"
            }), this.x = 0, this.y = 0, this.ratio = 1, this.angle = 0, this.isAnimated = !1, this.settings = "object" == typeof d && d ? c.embedObject(d) : c
        }, sigma.classes.camera.prototype.goTo = function(b) {
            if (!this.settings("enableCamera")) return this;
            var c, d, e = b || {},
                f = ["x", "y", "ratio", "angle"];
            for (c = 0, d = f.length; d > c; c++)
                if (e[f[c]] !== a) {
                    if ("number" != typeof e[f[c]] || isNaN(e[f[c]])) throw 'Value for "' + f[c] + '" is not a number.';
                    this[f[c]] = e[f[c]]
                }
            return this.dispatchEvent("coordinatesUpdated"), this
        }, sigma.classes.camera.prototype.applyView = function(b, c, d) {
            d = d || {}, c = c !== a ? c : this.prefix, b = b !== a ? b : this.readPrefix;
            var e, f, g, h = d.nodes || this.graph.nodes(),
                i = d.edges || this.graph.edges(),
                j = Math.cos(this.angle),
                k = Math.sin(this.angle);
            for (e = 0, f = h.length; f > e; e++) g = h[e], g[c + "x"] = (((g[b + "x"] || 0) - this.x) * j + ((g[b + "y"] || 0) - this.y) * k) / this.ratio + (d.width || 0) / 2, g[c + "y"] = (((g[b + "y"] || 0) - this.y) * j - ((g[b + "x"] || 0) - this.x) * k) / this.ratio + (d.height || 0) / 2, g[c + "size"] = (g[b + "size"] || 0) / Math.pow(this.ratio, this.settings("nodesPowRatio"));
            for (e = 0, f = i.length; f > e; e++) i[e][c + "size"] = (i[e][b + "size"] || 0) / Math.pow(this.ratio, this.settings("edgesPowRatio"));
            return this
        }, sigma.classes.camera.prototype.graphPosition = function(a, b, c) {
            var d = 0,
                e = 0,
                f = Math.cos(this.angle),
                g = Math.sin(this.angle);
            return c || (d = -(this.x * f + this.y * g) / this.ratio, e = -(this.y * f - this.x * g) / this.ratio), {
                x: (a * f + b * g) / this.ratio + d,
                y: (b * f - a * g) / this.ratio + e
            }
        }, sigma.classes.camera.prototype.cameraPosition = function(a, b, c) {
            var d = 0,
                e = 0,
                f = Math.cos(this.angle),
                g = Math.sin(this.angle);
            return c || (d = -(this.x * f + this.y * g) / this.ratio, e = -(this.y * f - this.x * g) / this.ratio), {
                x: ((a - d) * f - (b - e) * g) * this.ratio,
                y: ((b - e) * f + (a - d) * g) * this.ratio
            }
        }, sigma.classes.camera.prototype.getMatrix = function() {
            var a = sigma.utils.matrices.scale(1 / this.ratio),
                b = sigma.utils.matrices.rotation(this.angle),
                c = sigma.utils.matrices.translation(-this.x, -this.y),
                d = sigma.utils.matrices.multiply(c, sigma.utils.matrices.multiply(b, a));
            return d
        }, sigma.classes.camera.prototype.getRectangle = function(a, b) {
            var c = this.cameraPosition(a, 0, !0),
                d = this.cameraPosition(0, b, !0),
                e = this.cameraPosition(a / 2, b / 2, !0),
                f = this.cameraPosition(a / 4, 0, !0).x,
                g = this.cameraPosition(0, b / 4, !0).y;
            return {
                x1: this.x - e.x - f,
                y1: this.y - e.y - g,
                x2: this.x - e.x + f + c.x,
                y2: this.y - e.y - g + c.y,
                height: Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y + 2 * g, 2))
            }
        }
    }.call(this),
    function(a) {
        "use strict";

        function b(a, b) {
            var c = b.x + b.width / 2,
                d = b.y + b.height / 2,
                e = a.y < d,
                f = a.x < c;
            return e ? f ? 0 : 1 : f ? 2 : 3
        }

        function c(a, b) {
            for (var c = [], d = 0; 4 > d; d++) a.x2 >= b[d][0].x && a.x1 <= b[d][1].x && a.y1 + a.height >= b[d][0].y && a.y1 <= b[d][2].y && c.push(d);
            return c
        }

        function d(a, b) {
            for (var c = [], d = 0; 4 > d; d++) j.collision(a, b[d]) && c.push(d);
            return c
        }

        function e(a, b) {
            var c, d, e = b.level + 1,
                f = Math.round(b.bounds.width / 2),
                g = Math.round(b.bounds.height / 2),
                h = Math.round(b.bounds.x),
                j = Math.round(b.bounds.y);
            switch (a) {
                case 0:
                    c = h, d = j;
                    break;
                case 1:
                    c = h + f, d = j;
                    break;
                case 2:
                    c = h, d = j + g;
                    break;
                case 3:
                    c = h + f, d = j + g
            }
            return i({
                x: c,
                y: d,
                width: f,
                height: g
            }, e, b.maxElements, b.maxLevel)
        }

        function f(b, d, g) {
            if (g.level < g.maxLevel)
                for (var h = c(d, g.corners), i = 0, j = h.length; j > i; i++) g.nodes[h[i]] === a && (g.nodes[h[i]] = e(h[i], g)), f(b, d, g.nodes[h[i]]);
            else g.elements.push(b)
        }

        function g(c, d) {
            if (d.level < d.maxLevel) {
                var e = b(c, d.bounds);
                return d.nodes[e] !== a ? g(c, d.nodes[e]) : []
            }
            return d.elements
        }

        function h(b, c, d, e) {
            if (e = e || {}, c.level < c.maxLevel)
                for (var f = d(b, c.corners), g = 0, i = f.length; i > g; g++) c.nodes[f[g]] !== a && h(b, c.nodes[f[g]], d, e);
            else
                for (var j = 0, k = c.elements.length; k > j; j++) e[c.elements[j].id] === a && (e[c.elements[j].id] = c.elements[j]);
            return e
        }

        function i(a, b, c, d) {
            return {
                level: b || 0,
                bounds: a,
                corners: j.splitSquare(a),
                maxElements: c || 20,
                maxLevel: d || 4,
                elements: [],
                nodes: []
            }
        }
        var j = {
                pointToSquare: function(a) {
                    return {
                        x1: a.x - a.size,
                        y1: a.y - a.size,
                        x2: a.x + a.size,
                        y2: a.y - a.size,
                        height: 2 * a.size
                    }
                },
                isAxisAligned: function(a) {
                    return a.x1 === a.x2 || a.y1 === a.y2
                },
                axisAlignedTopPoints: function(a) {
                    return a.y1 === a.y2 && a.x1 < a.x2 ? a : a.x1 === a.x2 && a.y2 > a.y1 ? {
                        x1: a.x1 - a.height,
                        y1: a.y1,
                        x2: a.x1,
                        y2: a.y1,
                        height: a.height
                    } : a.x1 === a.x2 && a.y2 < a.y1 ? {
                        x1: a.x1,
                        y1: a.y2,
                        x2: a.x2 + a.height,
                        y2: a.y2,
                        height: a.height
                    } : {
                        x1: a.x2,
                        y1: a.y1 - a.height,
                        x2: a.x1,
                        y2: a.y1 - a.height,
                        height: a.height
                    }
                },
                lowerLeftCoor: function(a) {
                    var b = Math.sqrt(Math.pow(a.x2 - a.x1, 2) + Math.pow(a.y2 - a.y1, 2));
                    return {
                        x: a.x1 - (a.y2 - a.y1) * a.height / b,
                        y: a.y1 + (a.x2 - a.x1) * a.height / b
                    }
                },
                lowerRightCoor: function(a, b) {
                    return {
                        x: b.x - a.x1 + a.x2,
                        y: b.y - a.y1 + a.y2
                    }
                },
                rectangleCorners: function(a) {
                    var b = this.lowerLeftCoor(a),
                        c = this.lowerRightCoor(a, b);
                    return [{
                        x: a.x1,
                        y: a.y1
                    }, {
                        x: a.x2,
                        y: a.y2
                    }, {
                        x: b.x,
                        y: b.y
                    }, {
                        x: c.x,
                        y: c.y
                    }]
                },
                splitSquare: function(a) {
                    return [
                        [{
                            x: a.x,
                            y: a.y
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y
                        }, {
                            x: a.x,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y + a.height / 2
                        }],
                        [{
                            x: a.x + a.width / 2,
                            y: a.y
                        }, {
                            x: a.x + a.width,
                            y: a.y
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x + a.width,
                            y: a.y + a.height / 2
                        }],
                        [{
                            x: a.x,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x,
                            y: a.y + a.height
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y + a.height
                        }],
                        [{
                            x: a.x + a.width / 2,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x + a.width,
                            y: a.y + a.height / 2
                        }, {
                            x: a.x + a.width / 2,
                            y: a.y + a.height
                        }, {
                            x: a.x + a.width,
                            y: a.y + a.height
                        }]
                    ]
                },
                axis: function(a, b) {
                    return [{
                        x: a[1].x - a[0].x,
                        y: a[1].y - a[0].y
                    }, {
                        x: a[1].x - a[3].x,
                        y: a[1].y - a[3].y
                    }, {
                        x: b[0].x - b[2].x,
                        y: b[0].y - b[2].y
                    }, {
                        x: b[0].x - b[1].x,
                        y: b[0].y - b[1].y
                    }]
                },
                projection: function(a, b) {
                    var c = (a.x * b.x + a.y * b.y) / (Math.pow(b.x, 2) + Math.pow(b.y, 2));
                    return {
                        x: c * b.x,
                        y: c * b.y
                    }
                },
                axisCollision: function(a, b, c) {
                    for (var d = [], e = [], f = 0; 4 > f; f++) {
                        var g = this.projection(b[f], a),
                            h = this.projection(c[f], a);
                        d.push(g.x * a.x + g.y * a.y), e.push(h.x * a.x + h.y * a.y)
                    }
                    var i = Math.max.apply(Math, d),
                        j = Math.max.apply(Math, e),
                        k = Math.min.apply(Math, d),
                        l = Math.min.apply(Math, e);
                    return i >= l && j >= k
                },
                collision: function(a, b) {
                    for (var c = this.axis(a, b), d = !0, e = 0; 4 > e; e++) d *= this.axisCollision(c[e], a, b);
                    return !!d
                }
            },
            k = function() {
                this._geom = j, this._tree = null, this._cache = {
                    query: !1,
                    result: !1
                }
            };
        k.prototype.index = function(a, b) {
            if (!b.bounds) throw "sigma.classes.quad.index: bounds information not given.";
            var c = b.prefix || "";
            this._tree = i(b.bounds, 0, b.maxElements, b.maxLevel);
            for (var d = 0, e = a.length; e > d; d++) f(a[d], j.pointToSquare({
                x: a[d][c + "x"],
                y: a[d][c + "y"],
                size: a[d][c + "size"]
            }), this._tree);
            return this._cache = {
                query: !1,
                result: !1
            }, this._tree
        }, k.prototype.point = function(a, b) {
            return this._tree ? g({
                x: a,
                y: b
            }, this._tree) || [] : []
        }, k.prototype.area = function(a) {
            var b, e, f = JSON.stringify(a);
            if (this._cache.query === f) return this._cache.result;
            j.isAxisAligned(a) ? (b = c, e = j.axisAlignedTopPoints(a)) : (b = d, e = j.rectangleCorners(a));
            var g = this._tree ? h(e, this._tree, b) : [],
                i = [];
            for (var k in g) i.push(g[k]);
            return this._cache.query = f, this._cache.result = i, i
        }, "undefined" != typeof this.sigma ? (this.sigma.classes = this.sigma.classes || {}, this.sigma.classes.quad = k) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = k), exports.quad = k) : this.quad = k
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.captors"), sigma.captors.mouse = function(a, b, c) {
            function d(a) {
                var b, c, d;
                return w("mouseEnabled") && t.dispatchEvent("mousemove", {
                    x: sigma.utils.getX(a) - a.target.width / 2,
                    y: sigma.utils.getY(a) - a.target.height / 2,
                    clientX: a.clientX,
                    clientY: a.clientY,
                    ctrlKey: a.ctrlKey,
                    metaKey: a.metaKey,
                    altKey: a.altKey,
                    shiftKey: a.shiftKey
                }), w("mouseEnabled") && q ? (r = !0, s && clearTimeout(s), s = setTimeout(function() {
                    r = !1
                }, w("dragTimeout")), sigma.misc.animation.killAll(v), v.isMoving = !0, d = v.cameraPosition(sigma.utils.getX(a) - o, sigma.utils.getY(a) - p, !0), b = k - d.x, c = l - d.y, (b !== v.x || c !== v.y) && (m = v.x, n = v.y, v.goTo({
                    x: b,
                    y: c
                })), a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation(), !1) : void 0
            }

            function e(a) {
                if (w("mouseEnabled") && q) {
                    q = !1, s && clearTimeout(s), v.isMoving = !1;
                    var b = sigma.utils.getX(a),
                        c = sigma.utils.getY(a);
                    r ? (sigma.misc.animation.killAll(v), sigma.misc.animation.camera(v, {
                        x: v.x + w("mouseInertiaRatio") * (v.x - m),
                        y: v.y + w("mouseInertiaRatio") * (v.y - n)
                    }, {
                        easing: "quadraticOut",
                        duration: w("mouseInertiaDuration")
                    })) : (o !== b || p !== c) && v.goTo({
                        x: v.x,
                        y: v.y
                    }), t.dispatchEvent("mouseup", {
                        x: b - a.target.width / 2,
                        y: c - a.target.height / 2,
                        clientX: a.clientX,
                        clientY: a.clientY,
                        ctrlKey: a.ctrlKey,
                        metaKey: a.metaKey,
                        altKey: a.altKey,
                        shiftKey: a.shiftKey
                    }), r = !1
                }
            }

            function f(a) {
                if (w("mouseEnabled")) switch (k = v.x, l = v.y, m = v.x, n = v.y, o = sigma.utils.getX(a), p = sigma.utils.getY(a), a.which) {
                    case 2:
                        break;
                    case 3:
                        t.dispatchEvent("rightclick", {
                            x: o - a.target.width / 2,
                            y: p - a.target.height / 2,
                            clientX: a.clientX,
                            clientY: a.clientY,
                            ctrlKey: a.ctrlKey,
                            metaKey: a.metaKey,
                            altKey: a.altKey,
                            shiftKey: a.shiftKey
                        });
                        break;
                    default:
                        q = !0, t.dispatchEvent("mousedown", {
                            x: o - a.target.width / 2,
                            y: p - a.target.height / 2,
                            clientX: a.clientX,
                            clientY: a.clientY,
                            ctrlKey: a.ctrlKey,
                            metaKey: a.metaKey,
                            altKey: a.altKey,
                            shiftKey: a.shiftKey
                        })
                }
            }

            function g() {
                w("mouseEnabled") && t.dispatchEvent("mouseout")
            }

            function h(a) {
                return w("mouseEnabled") && t.dispatchEvent("click", {
                    x: sigma.utils.getX(a) - a.target.width / 2,
                    y: sigma.utils.getY(a) - a.target.height / 2,
                    clientX: a.clientX,
                    clientY: a.clientY,
                    ctrlKey: a.ctrlKey,
                    metaKey: a.metaKey,
                    altKey: a.altKey,
                    shiftKey: a.shiftKey
                }), a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation(), !1
            }

            function i(a) {
                var b, c, d;
                return w("mouseEnabled") ? (c = 1 / w("doubleClickZoomingRatio"), t.dispatchEvent("doubleclick", {
                    x: o - a.target.width / 2,
                    y: p - a.target.height / 2,
                    clientX: a.clientX,
                    clientY: a.clientY,
                    ctrlKey: a.ctrlKey,
                    metaKey: a.metaKey,
                    altKey: a.altKey,
                    shiftKey: a.shiftKey
                }), w("doubleClickEnabled") && (b = v.cameraPosition(sigma.utils.getX(a) - a.target.width / 2, sigma.utils.getY(a) - a.target.height / 2, !0), d = {
                    duration: w("doubleClickZoomDuration")
                }, sigma.utils.zoomTo(v, b.x, b.y, c, d)), a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation(), !1) : void 0
            }

            function j(a) {
                var b, c, d;
                return w("mouseEnabled") ? (c = sigma.utils.getDelta(a) > 0 ? 1 / w("zoomingRatio") : w("zoomingRatio"), b = v.cameraPosition(sigma.utils.getX(a) - a.target.width / 2, sigma.utils.getY(a) - a.target.height / 2, !0), d = {
                    duration: w("mouseZoomDuration")
                }, sigma.utils.zoomTo(v, b.x, b.y, c, d), a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation(), !1) : void 0
            }
            var k, l, m, n, o, p, q, r, s, t = this,
                u = a,
                v = b,
                w = c;
            sigma.classes.dispatcher.extend(this), sigma.utils.doubleClick(u, "click", i), u.addEventListener("DOMMouseScroll", j, !1), u.addEventListener("mousewheel", j, !1), u.addEventListener("mousemove", d, !1), u.addEventListener("mousedown", f, !1), u.addEventListener("click", h, !1), u.addEventListener("mouseout", g, !1), document.addEventListener("mouseup", e, !1), this.kill = function() {
                sigma.utils.unbindDoubleClick(u, "click"), u.removeEventListener("DOMMouseScroll", j), u.removeEventListener("mousewheel", j), u.removeEventListener("mousemove", d), u.removeEventListener("mousedown", f), u.removeEventListener("click", h), u.removeEventListener("mouseout", g), document.removeEventListener("mouseup", e)
            }
        }
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.captors"), sigma.captors.touch = function(a, b, c) {
            function d(a) {
                var b = sigma.utils.getOffset(B);
                return {
                    x: a.pageX - b.left,
                    y: a.pageY - b.top
                }
            }

            function e(a) {
                if (D("touchEnabled")) {
                    var b, c, e, f, g, h;
                    switch (E = a.touches, E.length) {
                        case 1:
                            C.isMoving = !0, w = 1, i = C.x, j = C.y, m = C.x, n = C.y, g = d(E[0]), q = g.x, r = g.y;
                            break;
                        case 2:
                            return C.isMoving = !0, w = 2, g = d(E[0]), h = d(E[1]), b = g.x, e = g.y, c = h.x, f = h.y, m = C.x, n = C.y, k = C.angle, l = C.ratio, i = C.x, j = C.y, q = b, r = e, s = c, t = f, u = Math.atan2(t - r, s - q), v = Math.sqrt(Math.pow(t - r, 2) + Math.pow(s - q, 2)), a.preventDefault(), !1
                    }
                }
            }

            function f(a) {
                if (D("touchEnabled")) {
                    E = a.touches;
                    var b = D("touchInertiaRatio");
                    switch (z && (x = !1, clearTimeout(z)), w) {
                        case 2:
                            if (1 === a.touches.length) {
                                e(a), a.preventDefault();
                                break
                            }
                        case 1:
                            C.isMoving = !1, A.dispatchEvent("stopDrag"), x && (y = !1, sigma.misc.animation.camera(C, {
                                x: C.x + b * (C.x - m),
                                y: C.y + b * (C.y - n)
                            }, {
                                easing: "quadraticOut",
                                duration: D("touchInertiaDuration")
                            })), x = !1, w = 0
                    }
                }
            }

            function g(a) {
                if (!y && D("touchEnabled")) {
                    var b, c, e, f, g, h, B, F, G, H, I, J, K, L, M, N, O;
                    switch (E = a.touches, x = !0, z && clearTimeout(z), z = setTimeout(function() {
                        x = !1
                    }, D("dragTimeout")), w) {
                        case 1:
                            F = d(E[0]), b = F.x, e = F.y, H = C.cameraPosition(b - q, e - r, !0), L = i - H.x, M = j - H.y, (L !== C.x || M !== C.y) && (m = C.x, n = C.y, C.goTo({
                                x: L,
                                y: M
                            }), A.dispatchEvent("mousemove", {
                                x: F.x - a.target.width / 2,
                                y: F.y - a.target.height / 2,
                                clientX: a.clientX,
                                clientY: a.clientY,
                                ctrlKey: a.ctrlKey,
                                metaKey: a.metaKey,
                                altKey: a.altKey,
                                shiftKey: a.shiftKey
                            }), A.dispatchEvent("drag"));
                            break;
                        case 2:
                            F = d(E[0]), G = d(E[1]), b = F.x, e = F.y, c = G.x, f = G.y, I = C.cameraPosition((q + s) / 2 - a.target.width / 2, (r + t) / 2 - a.target.height / 2, !0), B = C.cameraPosition((b + c) / 2 - a.target.width / 2, (e + f) / 2 - a.target.height / 2, !0), J = Math.atan2(f - e, c - b) - u, K = Math.sqrt(Math.pow(f - e, 2) + Math.pow(c - b, 2)) / v, b = I.x, e = I.y, N = l / K, b *= K, e *= K, O = k - J, g = Math.cos(-J), h = Math.sin(-J), c = b * g + e * h, f = e * g - b * h, b = c, e = f, L = b - B.x + i, M = e - B.y + j, (N !== C.ratio || O !== C.angle || L !== C.x || M !== C.y) && (m = C.x, n = C.y, o = C.angle, p = C.ratio, C.goTo({
                                x: L,
                                y: M,
                                angle: O,
                                ratio: N
                            }), A.dispatchEvent("drag"))
                    }
                    return a.preventDefault(), !1
                }
            }

            function h(a) {
                var b, c, e;
                return a.touches && 1 === a.touches.length && D("touchEnabled") ? (y = !0, c = 1 / D("doubleClickZoomingRatio"), b = d(a.touches[0]), A.dispatchEvent("doubleclick", {
                    x: b.x - a.target.width / 2,
                    y: b.y - a.target.height / 2,
                    clientX: a.clientX,
                    clientY: a.clientY,
                    ctrlKey: a.ctrlKey,
                    metaKey: a.metaKey,
                    altKey: a.altKey,
                    shiftKey: a.shiftKey
                }), D("doubleClickEnabled") && (b = C.cameraPosition(b.x - a.target.width / 2, b.y - a.target.height / 2, !0), e = {
                    duration: D("doubleClickZoomDuration"),
                    onComplete: function() {
                        y = !1
                    }
                }, sigma.utils.zoomTo(C, b.x, b.y, c, e)), a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation(), !1) : void 0
            }
            var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A = this,
                B = a,
                C = b,
                D = c,
                E = [];
            sigma.classes.dispatcher.extend(this), sigma.utils.doubleClick(B, "touchstart", h), B.addEventListener("touchstart", e, !1), B.addEventListener("touchend", f, !1), B.addEventListener("touchcancel", f, !1), B.addEventListener("touchleave", f, !1), B.addEventListener("touchmove", g, !1), this.kill = function() {
                sigma.utils.unbindDoubleClick(B, "touchstart"), B.addEventListener("touchstart", e), B.addEventListener("touchend", f), B.addEventListener("touchcancel", f), B.addEventListener("touchleave", f), B.addEventListener("touchmove", g)
            }
        }
    }.call(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        if ("undefined" == typeof conrad) throw "conrad is not declared";
        sigma.utils.pkg("sigma.renderers"), sigma.renderers.canvas = function(a, b, c, d) {
            if ("object" != typeof d) throw "sigma.renderers.canvas: Wrong arguments.";
            if (!(d.container instanceof HTMLElement)) throw "Container not found.";
            var e, f, g, h;
            for (sigma.classes.dispatcher.extend(this), Object.defineProperty(this, "conradId", {
                    value: sigma.utils.id()
                }), this.graph = a, this.camera = b, this.contexts = {}, this.domElements = {}, this.options = d, this.container = this.options.container, this.settings = "object" == typeof d.settings && d.settings ? c.embedObjects(d.settings) : c, this.nodesOnScreen = [], this.edgesOnScreen = [], this.jobs = {}, this.options.prefix = "renderer" + this.conradId + ":", this.settings("batchEdgesDrawing") ? (this.initDOM("canvas", "edges"), this.initDOM("canvas", "scene"), this.contexts.nodes = this.contexts.scene, this.contexts.labels = this.contexts.scene) : (this.initDOM("canvas", "scene"), this.contexts.edges = this.contexts.scene, this.contexts.nodes = this.contexts.scene, this.contexts.labels = this.contexts.scene), this.initDOM("canvas", "mouse"), this.contexts.hover = this.contexts.mouse, this.captors = [], g = this.options.captors || [sigma.captors.mouse, sigma.captors.touch], e = 0, f = g.length; f > e; e++) h = "function" == typeof g[e] ? g[e] : sigma.captors[g[e]], this.captors.push(new h(this.domElements.mouse, this.camera, this.settings));
            window.addEventListener("resize", this.boundResize = this.resize.bind(this), !1), sigma.misc.bindEvents.call(this, this.options.prefix), sigma.misc.drawHovers.call(this, this.options.prefix), this.resize(!1)
        }, sigma.renderers.canvas.prototype.render = function(b) {
            b = b || {};
            var c, d, e, f, g, h, i, j, k, l, m, n, o, p = {},
                q = this.graph,
                r = this.graph.nodes,
                s = (this.options.prefix || "", this.settings(b, "drawEdges")),
                t = this.settings(b, "drawNodes"),
                u = this.settings(b, "drawLabels"),
                v = this.settings.embedObjects(b, {
                    prefix: this.options.prefix
                });
            this.settings(b, "hideEdgesOnMove") && (this.camera.isAnimated || this.camera.isMoving) && (s = !1), this.camera.applyView(a, this.options.prefix, {
                width: this.width,
                height: this.height
            }), this.clear();
            for (e in this.jobs) conrad.hasJob(e) && conrad.killJob(e);
            for (this.edgesOnScreen = [], this.nodesOnScreen = this.camera.quadtree.area(this.camera.getRectangle(this.width, this.height)), c = this.nodesOnScreen, d = 0, f = c.length; f > d; d++) p[c[d].id] = c[d];
            if (s) {
                for (c = q.edges(), d = 0, f = c.length; f > d; d++) g = c[d], !p[g.source] && !p[g.target] || g.hidden || r(g.source).hidden || r(g.target).hidden || this.edgesOnScreen.push(g);
                if (this.settings(b, "batchEdgesDrawing")) h = "edges_" + this.conradId, n = v("canvasEdgesBatchSize"), l = this.edgesOnScreen, f = l.length, k = 0, i = Math.min(l.length, k + n), j = function() {
                    for (o = this.contexts.edges.globalCompositeOperation, this.contexts.edges.globalCompositeOperation = "destination-over", m = sigma.canvas.edges, d = k; i > d; d++) g = l[d], (m[g.type] || m.def)(g, q.nodes(g.source), q.nodes(g.target), this.contexts.edges, v);
                    return this.contexts.edges.globalCompositeOperation = o, i === l.length ? (delete this.jobs[h], !1) : (k = i + 1, i = Math.min(l.length, k + n), !0)
                }, this.jobs[h] = j, conrad.addJob(h, j.bind(this));
                else
                    for (m = sigma.canvas.edges, c = this.edgesOnScreen, d = 0, f = c.length; f > d; d++) g = c[d], (m[g.type] || m.def)(g, q.nodes(g.source), q.nodes(g.target), this.contexts.edges, v)
            }
            if (t)
                for (m = sigma.canvas.nodes, c = this.nodesOnScreen, d = 0, f = c.length; f > d; d++) c[d].hidden || (m[c[d].type] || m.def)(c[d], this.contexts.nodes, v);
            if (u)
                for (m = sigma.canvas.labels, c = this.nodesOnScreen, d = 0, f = c.length; f > d; d++) c[d].hidden || (m[c[d].type] || m.def)(c[d], this.contexts.labels, v);
            return this.dispatchEvent("render"), this
        }, sigma.renderers.canvas.prototype.initDOM = function(a, b) {
            var c = document.createElement(a);
            c.style.position = "absolute", c.setAttribute("class", "sigma-" + b), this.domElements[b] = c, this.container.appendChild(c), "canvas" === a.toLowerCase() && (this.contexts[b] = c.getContext("2d"))
        }, sigma.renderers.canvas.prototype.resize = function(b, c) {
            var d, e = this.width,
                f = this.height,
                g = 1;
            if (b !== a && c !== a ? (this.width = b, this.height = c) : (this.width = this.container.offsetWidth, this.height = this.container.offsetHeight, b = this.width, c = this.height), e !== this.width || f !== this.height)
                for (d in this.domElements) this.domElements[d].style.width = b + "px", this.domElements[d].style.height = c + "px", "canvas" === this.domElements[d].tagName.toLowerCase() && (this.domElements[d].setAttribute("width", b * g + "px"), this.domElements[d].setAttribute("height", c * g + "px"), 1 !== g && this.contexts[d].scale(g, g));
            return this
        }, sigma.renderers.canvas.prototype.clear = function() {
            var a;
            for (a in this.domElements) "CANVAS" === this.domElements[a].tagName && (this.domElements[a].width = this.domElements[a].width);
            return this
        }, sigma.renderers.canvas.prototype.kill = function() {
            var a, b;
            for (window.removeEventListener("resize", this.boundResize); b = this.captors.pop();) b.kill();
            delete this.captors;
            for (a in this.domElements) this.domElements[a].parentNode.removeChild(this.domElements[a]), delete this.domElements[a], delete this.contexts[a];
            delete this.domElements, delete this.contexts
        }, sigma.utils.pkg("sigma.canvas.nodes"), sigma.utils.pkg("sigma.canvas.edges"), sigma.utils.pkg("sigma.canvas.labels")
    }.call(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.renderers"), sigma.renderers.webgl = function(a, b, c, d) {
            if ("object" != typeof d) throw "sigma.renderers.webgl: Wrong arguments.";
            if (!(d.container instanceof HTMLElement)) throw "Container not found.";
            var e, f, g, h;
            for (sigma.classes.dispatcher.extend(this), this.jobs = {}, Object.defineProperty(this, "conradId", {
                    value: sigma.utils.id()
                }), this.graph = a, this.camera = b, this.contexts = {}, this.domElements = {}, this.options = d, this.container = this.options.container, this.settings = "object" == typeof d.settings && d.settings ? c.embedObjects(d.settings) : c, this.options.prefix = this.camera.readPrefix, Object.defineProperty(this, "nodePrograms", {
                    value: {}
                }), Object.defineProperty(this, "edgePrograms", {
                    value: {}
                }), Object.defineProperty(this, "nodeFloatArrays", {
                    value: {}
                }), Object.defineProperty(this, "edgeFloatArrays", {
                    value: {}
                }), this.settings(d, "batchEdgesDrawing") ? (this.initDOM("canvas", "edges", !0), this.initDOM("canvas", "nodes", !0)) : (this.initDOM("canvas", "scene", !0), this.contexts.nodes = this.contexts.scene, this.contexts.edges = this.contexts.scene), this.initDOM("canvas", "labels"), this.initDOM("canvas", "mouse"), this.contexts.hover = this.contexts.mouse, this.captors = [], g = this.options.captors || [sigma.captors.mouse, sigma.captors.touch], e = 0, f = g.length; f > e; e++) h = "function" == typeof g[e] ? g[e] : sigma.captors[g[e]], this.captors.push(new h(this.domElements.mouse, this.camera, this.settings));
            window.addEventListener("resize", this.boundResize = this.resize.bind(this), !1), sigma.misc.bindEvents.call(this, this.camera.prefix), sigma.misc.drawHovers.call(this, this.camera.prefix), this.resize()
        }, sigma.renderers.webgl.prototype.process = function() {
            var a, b, c, d, e, f = this.graph,
                g = sigma.utils.extend(g, this.options);
            for (d in this.nodeFloatArrays) delete this.nodeFloatArrays[d];
            for (d in this.edgeFloatArrays) delete this.edgeFloatArrays[d];
            for (a = f.edges(), b = 0, c = a.length; c > b; b++) d = a[b].type && sigma.webgl.edges[a[b].type] ? a[b].type : "def", this.edgeFloatArrays[d] || (this.edgeFloatArrays[d] = {
                edges: []
            }), this.edgeFloatArrays[d].edges.push(a[b]);
            for (a = f.nodes(), b = 0, c = a.length; c > b; b++) d = a[b].type && sigma.webgl.nodes[a[b].type] ? d : "def", this.nodeFloatArrays[d] || (this.nodeFloatArrays[d] = {
                nodes: []
            }), this.nodeFloatArrays[d].nodes.push(a[b]);
            for (d in this.edgeFloatArrays)
                for (e = sigma.webgl.edges[d], a = this.edgeFloatArrays[d].edges, b = 0, c = a.length; c > b; b++) this.edgeFloatArrays[d].array || (this.edgeFloatArrays[d].array = new Float32Array(a.length * e.POINTS * e.ATTRIBUTES)), a[b].hidden || f.nodes(a[b].source).hidden || f.nodes(a[b].target).hidden || e.addEdge(a[b], f.nodes(a[b].source), f.nodes(a[b].target), this.edgeFloatArrays[d].array, b * e.POINTS * e.ATTRIBUTES, g.prefix, this.settings);
            for (d in this.nodeFloatArrays)
                for (e = sigma.webgl.nodes[d], a = this.nodeFloatArrays[d].nodes, b = 0, c = a.length; c > b; b++) this.nodeFloatArrays[d].array || (this.nodeFloatArrays[d].array = new Float32Array(a.length * e.POINTS * e.ATTRIBUTES)), a[b].hidden || e.addNode(a[b], this.nodeFloatArrays[d].array, b * e.POINTS * e.ATTRIBUTES, g.prefix, this.settings);
            return this
        }, sigma.renderers.webgl.prototype.render = function(b) {
            var c, d, e, f, g, h, i = this,
                j = (this.graph, this.contexts.nodes),
                k = this.contexts.edges,
                l = this.camera.getMatrix(),
                m = sigma.utils.extend(b, this.options),
                n = this.settings(m, "drawLabels"),
                o = this.settings(m, "drawEdges"),
                p = this.settings(m, "drawNodes");
            this.settings(m, "hideEdgesOnMove") && (this.camera.isAnimated || this.camera.isMoving) && (o = !1), this.clear(), l = sigma.utils.matrices.multiply(l, sigma.utils.matrices.translation(this.width / 2, this.height / 2));
            for (f in this.jobs) conrad.hasJob(f) && conrad.killJob(f);
            if (o)
                if (this.settings(m, "batchEdgesDrawing"))(function() {
                    var a, b, c, d, e, f, g, h, i;
                    c = "edges_" + this.conradId, i = this.settings(m, "webglEdgesBatchSize"), a = Object.keys(this.edgeFloatArrays), a.length && (b = 0, h = sigma.webgl.edges[a[b]], e = this.edgeFloatArrays[a[b]].array, g = 0, f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES), d = function() {
                        return this.edgePrograms[a[b]] || (this.edgePrograms[a[b]] = h.initProgram(k)), f > g && (k.useProgram(this.edgePrograms[a[b]]), h.render(k, this.edgePrograms[a[b]], e, {
                            settings: this.settings,
                            matrix: l,
                            width: this.width,
                            height: this.height,
                            ratio: this.camera.ratio,
                            scalingRatio: this.settings("webglOversamplingRatio"),
                            start: g,
                            count: f - g
                        })), f >= e.length / h.ATTRIBUTES && b === a.length - 1 ? (delete this.jobs[c], !1) : (f >= e.length / h.ATTRIBUTES ? (b++, e = this.edgeFloatArrays[a[b]].array, h = sigma.webgl.edges[a[b]], g = 0, f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES)) : (g = f, f = Math.min(g + i * h.POINTS, e.length / h.ATTRIBUTES)), !0)
                    }, this.jobs[c] = d, conrad.addJob(c, d.bind(this)))
                }).call(this);
                else
                    for (f in this.edgeFloatArrays) h = sigma.webgl.edges[f], this.edgePrograms[f] || (this.edgePrograms[f] = h.initProgram(k)), this.edgeFloatArrays[f] && (k.useProgram(this.edgePrograms[f]), h.render(k, this.edgePrograms[f], this.edgeFloatArrays[f].array, {
                        settings: this.settings,
                        matrix: l,
                        width: this.width,
                        height: this.height,
                        ratio: this.camera.ratio,
                        scalingRatio: this.settings("webglOversamplingRatio")
                    }));
            if (p) {
                j.blendFunc(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA), j.enable(j.BLEND);
                for (f in this.nodeFloatArrays) h = sigma.webgl.nodes[f], this.nodePrograms[f] || (this.nodePrograms[f] = h.initProgram(j)), this.nodeFloatArrays[f] && (j.useProgram(this.nodePrograms[f]), h.render(j, this.nodePrograms[f], this.nodeFloatArrays[f].array, {
                    settings: this.settings,
                    matrix: l,
                    width: this.width,
                    height: this.height,
                    ratio: this.camera.ratio,
                    scalingRatio: this.settings("webglOversamplingRatio")
                }))
            }
            if (n)
                for (c = this.camera.quadtree.area(this.camera.getRectangle(this.width, this.height)), this.camera.applyView(a, a, {
                        nodes: c,
                        edges: [],
                        width: this.width,
                        height: this.height
                    }), g = function(a) {
                        return i.settings({
                            prefix: i.camera.prefix
                        }, a)
                    }, d = 0, e = c.length; e > d; d++) c[d].hidden || (sigma.canvas.labels[c[d].type] || sigma.canvas.labels.def)(c[d], this.contexts.labels, g);
            return this.dispatchEvent("render"), this
        }, sigma.renderers.webgl.prototype.initDOM = function(a, b, c) {
            var d = document.createElement(a);
            d.style.position = "absolute", d.setAttribute("class", "sigma-" + b), this.domElements[b] = d, this.container.appendChild(d), "canvas" === a.toLowerCase() && (this.contexts[b] = d.getContext(c ? "experimental-webgl" : "2d", {
                preserveDrawingBuffer: !0
            }))
        }, sigma.renderers.webgl.prototype.resize = function(b, c) {
            var d, e = this.width,
                f = this.height;
            if (b !== a && c !== a ? (this.width = b, this.height = c) : (this.width = this.container.offsetWidth, this.height = this.container.offsetHeight, b = this.width, c = this.height), e !== this.width || f !== this.height)
                for (d in this.domElements) this.domElements[d].style.width = b + "px", this.domElements[d].style.height = c + "px", "canvas" === this.domElements[d].tagName.toLowerCase() && (this.contexts[d] && this.contexts[d].scale ? (this.domElements[d].setAttribute("width", b + "px"), this.domElements[d].setAttribute("height", c + "px")) : (this.domElements[d].setAttribute("width", b * this.settings("webglOversamplingRatio") + "px"), this.domElements[d].setAttribute("height", c * this.settings("webglOversamplingRatio") + "px")));
            for (d in this.contexts) this.contexts[d] && this.contexts[d].viewport && this.contexts[d].viewport(0, 0, this.width * this.settings("webglOversamplingRatio"), this.height * this.settings("webglOversamplingRatio"));
            return this
        }, sigma.renderers.webgl.prototype.clear = function() {
            var a;
            for (a in this.domElements) "CANVAS" === this.domElements[a].tagName && (this.domElements[a].width = this.domElements[a].width);
            return this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT), this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT), this
        }, sigma.renderers.webgl.prototype.kill = function() {
            var a, b;
            for (window.removeEventListener("resize", this.boundResize); b = this.captors.pop();) b.kill();
            delete this.captors;
            for (a in this.domElements) this.domElements[a].parentNode.removeChild(this.domElements[a]), delete this.domElements[a], delete this.contexts[a];
            delete this.domElements, delete this.contexts
        }, sigma.utils.pkg("sigma.webgl.nodes"), sigma.utils.pkg("sigma.webgl.edges"), sigma.utils.pkg("sigma.canvas.labels")
    }.call(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.renderers");
        var b, c = !!a.WebGLRenderingContext;
        if (c) {
            b = document.createElement("canvas");
            try {
                c = !(!b.getContext("webgl") && !b.getContext("experimental-webgl"))
            } catch (d) {
                c = !1
            }
        }
        sigma.renderers.def = c ? sigma.renderers.webgl : sigma.renderers.canvas
    }(this),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.webgl.nodes"), sigma.webgl.nodes.def = {
            POINTS: 3,
            ATTRIBUTES: 5,
            addNode: function(a, b, c, d, e) {
                var f = sigma.utils.floatColor(a.color || e("defaultNodeColor"));
                b[c++] = a[d + "x"], b[c++] = a[d + "y"], b[c++] = a[d + "size"], b[c++] = f, b[c++] = 0, b[c++] = a[d + "x"], b[c++] = a[d + "y"], b[c++] = a[d + "size"], b[c++] = f, b[c++] = 2 * Math.PI / 3, b[c++] = a[d + "x"], b[c++] = a[d + "y"], b[c++] = a[d + "size"], b[c++] = f, b[c++] = 4 * Math.PI / 3
            },
            render: function(a, b, c, d) {
                var e, f = a.getAttribLocation(b, "a_position"),
                    g = a.getAttribLocation(b, "a_size"),
                    h = a.getAttribLocation(b, "a_color"),
                    i = a.getAttribLocation(b, "a_angle"),
                    j = a.getUniformLocation(b, "u_resolution"),
                    k = a.getUniformLocation(b, "u_matrix"),
                    l = a.getUniformLocation(b, "u_ratio"),
                    m = a.getUniformLocation(b, "u_scale");
                e = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, e), a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW), a.uniform2f(j, d.width, d.height), a.uniform1f(l, 1 / Math.pow(d.ratio, d.settings("nodesPowRatio"))), a.uniform1f(m, d.scalingRatio), a.uniformMatrix3fv(k, !1, d.matrix), a.enableVertexAttribArray(f), a.enableVertexAttribArray(g), a.enableVertexAttribArray(h), a.enableVertexAttribArray(i), a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0), a.vertexAttribPointer(g, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8), a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12), a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16), a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
            },
            initProgram: function(a) {
                var b, c, d;
                return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_size;", "attribute float a_color;", "attribute float a_angle;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "varying vec4 color;", "varying vec2 center;", "varying float radius;", "void main() {", "radius = a_size * u_ratio;", "vec2 position = (u_matrix * vec3(a_position, 1)).xy;", "center = position * u_scale;", "center = vec2(center.x, u_scale * u_resolution.y - center.y);", "position = position +", "2.0 * radius * vec2(cos(a_angle), sin(a_angle));", "position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);", "radius = radius * u_scale;", "gl_Position = vec4(position, 0, 1);", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER), c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "varying vec2 center;", "varying float radius;", "void main(void) {", "vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);", "vec2 m = gl_FragCoord.xy - center;", "float diff = radius - sqrt(m.x * m.x + m.y * m.y);", "if (diff > 0.0)", "gl_FragColor = color;", "else", "gl_FragColor = color0;", "}"].join("\n"), a.FRAGMENT_SHADER), d = sigma.utils.loadProgram(a, [b, c])
            }
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.webgl.nodes"), sigma.webgl.nodes.fast = {
            POINTS: 1,
            ATTRIBUTES: 4,
            addNode: function(a, b, c, d, e) {
                b[c++] = a[d + "x"], b[c++] = a[d + "y"], b[c++] = a[d + "size"], b[c++] = sigma.utils.floatColor(a.color || e("defaultNodeColor"))
            },
            render: function(a, b, c, d) {
                var e, f = a.getAttribLocation(b, "a_position"),
                    g = a.getAttribLocation(b, "a_size"),
                    h = a.getAttribLocation(b, "a_color"),
                    i = a.getUniformLocation(b, "u_resolution"),
                    j = a.getUniformLocation(b, "u_matrix"),
                    k = a.getUniformLocation(b, "u_ratio"),
                    l = a.getUniformLocation(b, "u_scale");
                e = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, e), a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW), a.uniform2f(i, d.width, d.height), a.uniform1f(k, 1 / Math.pow(d.ratio, d.settings("nodesPowRatio"))), a.uniform1f(l, d.scalingRatio), a.uniformMatrix3fv(j, !1, d.matrix), a.enableVertexAttribArray(f), a.enableVertexAttribArray(g), a.enableVertexAttribArray(h), a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0), a.vertexAttribPointer(g, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8), a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 12), a.drawArrays(a.POINTS, d.start || 0, d.count || c.length / this.ATTRIBUTES)
            },
            initProgram: function(a) {
                var b, c, d;
                return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_size;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "varying vec4 color;", "void main() {", "gl_Position = vec4(", "((u_matrix * vec3(a_position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "gl_PointSize = a_size * u_ratio * u_scale * 2.0;", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER), c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER), d = sigma.utils.loadProgram(a, [b, c])
            }
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.webgl.edges"), sigma.webgl.edges.def = {
            POINTS: 6,
            ATTRIBUTES: 7,
            addEdge: function(a, b, c, d, e, f, g) {
                var h = (a[f + "size"] || 1) / 2,
                    i = b[f + "x"],
                    j = b[f + "y"],
                    k = c[f + "x"],
                    l = c[f + "y"],
                    m = a.color;
                if (!m) switch (g("edgeColor")) {
                    case "source":
                        m = b.color || g("defaultNodeColor");
                        break;
                    case "target":
                        m = c.color || g("defaultNodeColor");
                        break;
                    default:
                        m = g("defaultEdgeColor")
                }
                m = sigma.utils.floatColor(m), d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = 0, d[e++] = m, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = 1, d[e++] = m, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = 0, d[e++] = m, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = 0, d[e++] = m, d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = 1, d[e++] = m, d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = 0, d[e++] = m
            },
            render: function(a, b, c, d) {
                var e, f = a.getAttribLocation(b, "a_color"),
                    g = a.getAttribLocation(b, "a_position1"),
                    h = a.getAttribLocation(b, "a_position2"),
                    i = a.getAttribLocation(b, "a_thickness"),
                    j = a.getAttribLocation(b, "a_minus"),
                    k = a.getUniformLocation(b, "u_resolution"),
                    l = a.getUniformLocation(b, "u_matrix"),
                    m = a.getUniformLocation(b, "u_matrixHalfPi"),
                    n = a.getUniformLocation(b, "u_matrixHalfPiMinus"),
                    o = a.getUniformLocation(b, "u_ratio"),
                    p = a.getUniformLocation(b, "u_scale");
                e = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, e), a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW), a.uniform2f(k, d.width, d.height), a.uniform1f(o, d.ratio / Math.pow(d.ratio, d.settings("edgesPowRatio"))), a.uniform1f(p, d.scalingRatio), a.uniformMatrix3fv(l, !1, d.matrix), a.uniformMatrix2fv(m, !1, sigma.utils.matrices.rotation(Math.PI / 2, !0)), a.uniformMatrix2fv(n, !1, sigma.utils.matrices.rotation(-Math.PI / 2, !0)), a.enableVertexAttribArray(f), a.enableVertexAttribArray(g), a.enableVertexAttribArray(h), a.enableVertexAttribArray(i), a.enableVertexAttribArray(j), a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0), a.vertexAttribPointer(h, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8), a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16), a.vertexAttribPointer(j, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20), a.vertexAttribPointer(f, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24), a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
            },
            initProgram: function(a) {
                var b, c, d;
                return b = sigma.utils.loadShader(a, ["attribute vec2 a_position1;", "attribute vec2 a_position2;", "attribute float a_thickness;", "attribute float a_minus;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_scale;", "uniform mat3 u_matrix;", "uniform mat2 u_matrixHalfPi;", "uniform mat2 u_matrixHalfPiMinus;", "varying vec4 color;", "void main() {", "vec2 position = a_thickness * u_ratio *", "normalize(a_position2 - a_position1);", "mat2 matrix = a_minus * u_matrixHalfPiMinus +", "(1.0 - a_minus) * u_matrixHalfPi;", "position = matrix * position + a_position1;", "gl_Position = vec4(", "((u_matrix * vec3(position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER), c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER), d = sigma.utils.loadProgram(a, [b, c])
            }
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.webgl.edges"), sigma.webgl.edges.fast = {
            POINTS: 2,
            ATTRIBUTES: 3,
            addEdge: function(a, b, c, d, e, f, g) {
                var h = ((a[f + "size"] || 1) / 2, b[f + "x"]),
                    i = b[f + "y"],
                    j = c[f + "x"],
                    k = c[f + "y"],
                    l = a.color;
                if (!l) switch (g("edgeColor")) {
                    case "source":
                        l = b.color || g("defaultNodeColor");
                        break;
                    case "target":
                        l = c.color || g("defaultNodeColor");
                        break;
                    default:
                        l = g("defaultEdgeColor")
                }
                l = sigma.utils.floatColor(l), d[e++] = h, d[e++] = i, d[e++] = l, d[e++] = j, d[e++] = k, d[e++] = l
            },
            render: function(a, b, c, d) {
                var e, f = a.getAttribLocation(b, "a_color"),
                    g = a.getAttribLocation(b, "a_position"),
                    h = a.getUniformLocation(b, "u_resolution"),
                    i = a.getUniformLocation(b, "u_matrix");
                e = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, e), a.bufferData(a.ARRAY_BUFFER, c, a.DYNAMIC_DRAW), a.uniform2f(h, d.width, d.height), a.uniformMatrix3fv(i, !1, d.matrix), a.enableVertexAttribArray(g), a.enableVertexAttribArray(f), a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0), a.vertexAttribPointer(f, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8), a.lineWidth(3), a.drawArrays(a.LINES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
            },
            initProgram: function(a) {
                var b, c, d;
                return b = sigma.utils.loadShader(a, ["attribute vec2 a_position;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform mat3 u_matrix;", "varying vec4 color;", "void main() {", "gl_Position = vec4(", "((u_matrix * vec3(a_position, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER), c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER), d = sigma.utils.loadProgram(a, [b, c])
            }
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.webgl.edges"), sigma.webgl.edges.arrow = {
            POINTS: 9,
            ATTRIBUTES: 11,
            addEdge: function(a, b, c, d, e, f, g) {
                var h = (a[f + "size"] || 1) / 2,
                    i = b[f + "x"],
                    j = b[f + "y"],
                    k = c[f + "x"],
                    l = c[f + "y"],
                    m = c[f + "size"],
                    n = a.color;
                if (!n) switch (g("edgeColor")) {
                    case "source":
                        n = b.color || g("defaultNodeColor");
                        break;
                    case "target":
                        n = c.color || g("defaultNodeColor");
                        break;
                    default:
                        n = g("defaultEdgeColor")
                }
                n = sigma.utils.floatColor(n), d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = m, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 1, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = m, d[e++] = 0, d[e++] = 1, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = i, d[e++] = j, d[e++] = k, d[e++] = l, d[e++] = h, d[e++] = m, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = 0, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 0, d[e++] = 1, d[e++] = -1, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 0, d[e++] = 1, d[e++] = 0, d[e++] = n, d[e++] = k, d[e++] = l, d[e++] = i, d[e++] = j, d[e++] = h, d[e++] = m, d[e++] = 1, d[e++] = 0, d[e++] = 1, d[e++] = 1, d[e++] = n
            },
            render: function(a, b, c, d) {
                var e, f = a.getAttribLocation(b, "a_pos1"),
                    g = a.getAttribLocation(b, "a_pos2"),
                    h = a.getAttribLocation(b, "a_thickness"),
                    i = a.getAttribLocation(b, "a_tSize"),
                    j = a.getAttribLocation(b, "a_delay"),
                    k = a.getAttribLocation(b, "a_minus"),
                    l = a.getAttribLocation(b, "a_head"),
                    m = a.getAttribLocation(b, "a_headPosition"),
                    n = a.getAttribLocation(b, "a_color"),
                    o = a.getUniformLocation(b, "u_resolution"),
                    p = a.getUniformLocation(b, "u_matrix"),
                    q = a.getUniformLocation(b, "u_matrixHalfPi"),
                    r = a.getUniformLocation(b, "u_matrixHalfPiMinus"),
                    s = a.getUniformLocation(b, "u_ratio"),
                    t = a.getUniformLocation(b, "u_nodeRatio"),
                    u = a.getUniformLocation(b, "u_arrowHead"),
                    v = a.getUniformLocation(b, "u_scale");
                e = a.createBuffer(), a.bindBuffer(a.ARRAY_BUFFER, e), a.bufferData(a.ARRAY_BUFFER, c, a.STATIC_DRAW), a.uniform2f(o, d.width, d.height), a.uniform1f(s, d.ratio / Math.pow(d.ratio, d.settings("edgesPowRatio"))), a.uniform1f(t, Math.pow(d.ratio, d.settings("nodesPowRatio")) / d.ratio), a.uniform1f(u, 5), a.uniform1f(v, d.scalingRatio), a.uniformMatrix3fv(p, !1, d.matrix), a.uniformMatrix2fv(q, !1, sigma.utils.matrices.rotation(Math.PI / 2, !0)), a.uniformMatrix2fv(r, !1, sigma.utils.matrices.rotation(-Math.PI / 2, !0)), a.enableVertexAttribArray(f), a.enableVertexAttribArray(g), a.enableVertexAttribArray(h), a.enableVertexAttribArray(i), a.enableVertexAttribArray(j), a.enableVertexAttribArray(k), a.enableVertexAttribArray(l), a.enableVertexAttribArray(m), a.enableVertexAttribArray(n), a.vertexAttribPointer(f, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0), a.vertexAttribPointer(g, 2, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8), a.vertexAttribPointer(h, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16), a.vertexAttribPointer(i, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20), a.vertexAttribPointer(j, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24), a.vertexAttribPointer(k, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 28), a.vertexAttribPointer(l, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 32), a.vertexAttribPointer(m, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 36), a.vertexAttribPointer(n, 1, a.FLOAT, !1, this.ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 40), a.drawArrays(a.TRIANGLES, d.start || 0, d.count || c.length / this.ATTRIBUTES)
            },
            initProgram: function(a) {
                var b, c, d;
                return b = sigma.utils.loadShader(a, ["attribute vec2 a_pos1;", "attribute vec2 a_pos2;", "attribute float a_thickness;", "attribute float a_tSize;", "attribute float a_delay;", "attribute float a_minus;", "attribute float a_head;", "attribute float a_headPosition;", "attribute float a_color;", "uniform vec2 u_resolution;", "uniform float u_ratio;", "uniform float u_nodeRatio;", "uniform float u_arrowHead;", "uniform float u_scale;", "uniform mat3 u_matrix;", "uniform mat2 u_matrixHalfPi;", "uniform mat2 u_matrixHalfPiMinus;", "varying vec4 color;", "void main() {", "vec2 pos = normalize(a_pos2 - a_pos1);", "mat2 matrix = (1.0 - a_head) *", "(", "a_minus * u_matrixHalfPiMinus +", "(1.0 - a_minus) * u_matrixHalfPi", ") + a_head * (", "a_headPosition * u_matrixHalfPiMinus * 0.6 +", "(a_headPosition * a_headPosition - 1.0) * mat2(1.0)", ");", "pos = a_pos1 + (", "(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +", "a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +", "a_delay * pos * (", "a_tSize / u_nodeRatio +", "u_arrowHead * a_thickness * u_ratio", ")", ");", "gl_Position = vec4(", "((u_matrix * vec3(pos, 1)).xy /", "u_resolution * 2.0 - 1.0) * vec2(1, -1),", "0,", "1", ");", "float c = a_color;", "color.b = mod(c, 256.0); c = floor(c / 256.0);", "color.g = mod(c, 256.0); c = floor(c / 256.0);", "color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;", "color.a = 1.0;", "}"].join("\n"), a.VERTEX_SHADER), c = sigma.utils.loadShader(a, ["precision mediump float;", "varying vec4 color;", "void main(void) {", "gl_FragColor = color;", "}"].join("\n"), a.FRAGMENT_SHADER), d = sigma.utils.loadProgram(a, [b, c])
            }
        }
    }(),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.canvas.labels"), sigma.canvas.labels.def = function(a, b, c) {
            var d, e = c("prefix") || "",
                f = a[e + "size"];
            f < c("labelThreshold") || "string" == typeof a.label && (d = "fixed" === c("labelSize") ? c("defaultLabelSize") : c("labelSizeRatio") * f, b.font = (c("fontStyle") ? c("fontStyle") + " " : "") + d + "px " + c("font"), b.fillStyle = "node" === c("labelColor") ? a.color || c("defaultNodeColor") : c("defaultLabelColor"), b.fillText(a.label, Math.round(a[e + "x"] + f + 3), Math.round(a[e + "y"] + d / 3)))
        }
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.canvas.hovers"), sigma.canvas.hovers.def = function(a, b, c) {
            var d, e, f, g, h, i = c("hoverFontStyle") || c("fontStyle"),
                j = c("prefix") || "",
                k = a[j + "size"],
                l = "fixed" === c("labelSize") ? c("defaultLabelSize") : c("labelSizeRatio") * k;
            b.font = (i ? i + " " : "") + l + "px " + (c("hoverFont") || c("font")), b.beginPath(), b.fillStyle = "node" === c("labelHoverBGColor") ? a.color || c("defaultNodeColor") : c("defaultHoverLabelBGColor"), a.label && c("labelHoverShadow") && (b.shadowOffsetX = 0, b.shadowOffsetY = 0, b.shadowBlur = 8, b.shadowColor = c("labelHoverShadowColor")), a.label && "string" == typeof a.label && (d = Math.round(a[j + "x"] - l / 2 - 2), e = Math.round(a[j + "y"] - l / 2 - 2), f = Math.round(b.measureText(a.label).width + l / 2 + k + 7), g = Math.round(l + 4), h = Math.round(l / 2 + 2), b.moveTo(d, e + h), b.arcTo(d, e, d + h, e, h), b.lineTo(d + f, e), b.lineTo(d + f, e + g), b.lineTo(d + h, e + g), b.arcTo(d, e + g, d, e + g - h, h), b.lineTo(d, e + h), b.closePath(), b.fill(), b.shadowOffsetX = 0, b.shadowOffsetY = 0, b.shadowBlur = 0), c("borderSize") > 0 && (b.beginPath(), b.fillStyle = "node" === c("nodeBorderColor") ? a.color || c("defaultNodeColor") : c("defaultNodeBorderColor"), b.arc(a[j + "x"], a[j + "y"], k + c("borderSize"), 0, 2 * Math.PI, !0), b.closePath(), b.fill());
            var m = sigma.canvas.nodes[a.type] || sigma.canvas.nodes.def;
            m(a, b, c), "string" == typeof a.label && (b.fillStyle = "node" === c("labelHoverColor") ? a.color || c("defaultNodeColor") : c("defaultLabelHoverColor"), b.fillText(a.label, Math.round(a[j + "x"] + k + 3), Math.round(a[j + "y"] + l / 3)))
        }
    }.call(this),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.canvas.nodes"), sigma.canvas.nodes.def = function(a, b, c) {
            var d = c("prefix") || "";
            b.fillStyle = a.color || c("defaultNodeColor"), b.beginPath(), b.arc(a[d + "x"], a[d + "y"], a[d + "size"], 0, 2 * Math.PI, !0), b.closePath(), b.fill()
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.canvas.edges"), sigma.canvas.edges.def = function(a, b, c, d, e) {
            var f = a.color,
                g = e("prefix") || "",
                h = e("edgeColor"),
                i = e("defaultNodeColor"),
                j = e("defaultEdgeColor");
            if (!f) switch (h) {
                case "source":
                    f = b.color || i;
                    break;
                case "target":
                    f = c.color || i;
                    break;
                default:
                    f = j
            }
            d.strokeStyle = f, d.lineWidth = a[g + "size"] || 1, d.beginPath(), d.moveTo(b[g + "x"], b[g + "y"]), d.lineTo(c[g + "x"], c[g + "y"]), d.stroke(), e("drawEdgeLabels") && sigma.canvas.labels.edges.def(a, b, c, d, e)
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.canvas.edges"), sigma.canvas.edges.curve = function(a, b, c, d, e) {
            var f, g, h, i, j = a.color,
                k = e("prefix") || "",
                l = e("edgeColor"),
                m = e("defaultNodeColor"),
                n = e("defaultEdgeColor"),
                o = b[k + "size"],
                p = b[k + "x"],
                q = b[k + "y"],
                r = c[k + "x"],
                s = c[k + "y"];
            if (b.id === c.id ? (f = p - 7 * o, g = q, h = p, i = q + 7 * o) : (f = (p + r) / 2 + (s - q) / 4, g = (q + s) / 2 + (p - r) / 4), !j) switch (l) {
                case "source":
                    j = b.color || m;
                    break;
                case "target":
                    j = c.color || m;
                    break;
                default:
                    j = n
            }
            d.strokeStyle = j, d.lineWidth = a[k + "size"] || 1, d.beginPath(), d.moveTo(p, q), b.id === c.id ? d.bezierCurveTo(h, i, f, g, r, s) : d.quadraticCurveTo(f, g, r, s), d.stroke()
        }
    }(),
    function() {
        "use strict";
        sigma.utils.pkg("sigma.canvas.edges"), sigma.canvas.edges.arrow = function(a, b, c, d, e) {
            var f = a.color,
                g = e("prefix") || "",
                h = e("edgeColor"),
                i = e("defaultNodeColor"),
                j = e("defaultEdgeColor"),
                k = a[g + "size"] || 1,
                l = c[g + "size"],
                m = b[g + "x"],
                n = b[g + "y"],
                o = c[g + "x"],
                p = c[g + "y"],
                q = 2.5 * k,
                r = Math.sqrt(Math.pow(o - m, 2) + Math.pow(p - n, 2)),
                s = m + (o - m) * (r - q - l) / r,
                t = n + (p - n) * (r - q - l) / r,
                u = (o - m) * q / r,
                v = (p - n) * q / r;
            if (!f) switch (h) {
                case "source":
                    f = b.color || i;
                    break;
                case "target":
                    f = c.color || i;
                    break;
                default:
                    f = j
            }
            d.strokeStyle = f, d.lineWidth = k, d.beginPath(), d.moveTo(m, n), d.lineTo(s, t), d.stroke(), d.fillStyle = f, d.beginPath(), d.moveTo(s + u, t + v), d.lineTo(s + .6 * v, t - .6 * u), d.lineTo(s - .6 * v, t + .6 * u), d.lineTo(s + u, t + v), d.closePath(), d.fill(), e("drawEdgeLabels") && sigma.canvas.labels.edges.def(a, b, c, d, e)
        }
    }(),
    function() {
        "use strict";
        var a = sigma.utils.pkg("sigma.canvas.edges");
        a.curvedArrow = function(a, b, c, d, e) {
            var f, g, h, i, j = a.color,
                k = e("prefix") || "",
                l = e("edgeColor"),
                m = e("defaultNodeColor"),
                n = e("defaultEdgeColor"),
                o = c[k + "size"],
                p = b[k + "x"],
                q = b[k + "y"],
                r = c[k + "x"],
                s = c[k + "y"];
            b.id === c.id ? (f = p - 7 * o, g = q, h = p, i = q + 7 * o) : (f = (p + r) / 2 + (s - q) / 4, g = (q + s) / 2 + (p - r) / 4);
            var t = Math.sqrt(Math.pow(r - f, 2) + Math.pow(s - g, 2)),
                u = 2.5 * (a[k + "size"] || 1),
                v = f + (r - f) * (t - u - o) / t,
                w = g + (s - g) * (t - u - o) / t,
                x = (r - f) * u / t,
                y = (s - g) * u / t;
            if (!j) switch (l) {
                case "source":
                    j = b.color || m;
                    break;
                case "target":
                    j = c.color || m;
                    break;
                default:
                    j = n
            }
            d.strokeStyle = j, d.lineWidth = a[k + "size"] || 1, d.beginPath(), d.moveTo(p, q), b.id === c.id ? d.bezierCurveTo(h, i, f, g, v, w) : d.quadraticCurveTo(f, g, v, w), d.stroke(), d.fillStyle = j, d.beginPath(), d.moveTo(v + x, w + y), d.lineTo(v + .6 * y, w - .6 * x), d.lineTo(v - .6 * y, w + .6 * x), d.lineTo(v + x, w + y), d.closePath(), d.fill()
        }
    }(),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.middlewares"), sigma.utils.pkg("sigma.utils"), sigma.middlewares.rescale = function(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this.graph.nodes(),
                m = this.graph.edges(),
                n = this.settings.embedObjects(c || {}),
                o = n("bounds") || sigma.utils.getBoundaries(this.graph, a, !0),
                p = o.minX,
                q = o.minY,
                r = o.maxX,
                s = o.maxY,
                t = o.sizeMax,
                u = o.weightMax,
                v = n("width") || 1,
                w = n("height") || 1,
                x = n("autoRescale");
            x instanceof Array || (x = ["nodePosition", "nodeSize", "edgeSize"]);
            var y = ~x.indexOf("nodePosition"),
                z = ~x.indexOf("nodeSize"),
                A = ~x.indexOf("edgeSize");
            for (j = "outside" === n("scalingMode") ? Math.max(v / Math.max(r - p, 1), w / Math.max(s - q, 1)) : Math.min(v / Math.max(r - p, 1), w / Math.max(s - q, 1)), k = (n("rescaleIgnoreSize") ? 0 : (n("maxNodeSize") || t) / j) + (n("sideMargin") || 0), r += k, p -= k, s += k, q -= k, j = "outside" === n("scalingMode") ? Math.max(v / Math.max(r - p, 1), w / Math.max(s - q, 1)) : Math.min(v / Math.max(r - p, 1), w / Math.max(s - q, 1)), n("maxNodeSize") || n("minNodeSize") ? n("maxNodeSize") === n("minNodeSize") ? (f = 0, g = +n("maxNodeSize")) : (f = (n("maxNodeSize") - n("minNodeSize")) / t, g = +n("minNodeSize")) : (f = 1, g = 0), n("maxEdgeSize") || n("minEdgeSize") ? n("maxEdgeSize") === n("minEdgeSize") ? (h = 0, i = +n("minEdgeSize")) : (h = (n("maxEdgeSize") - n("minEdgeSize")) / u, i = +n("minEdgeSize")) : (h = 1, i = 0), d = 0, e = m.length; e > d; d++) m[d][b + "size"] = m[d][a + "size"] * (A ? h : 1) + (A ? i : 0);
            for (d = 0, e = l.length; e > d; d++) l[d][b + "size"] = l[d][a + "size"] * (z ? f : 1) + (z ? g : 0), l[d][b + "x"] = (l[d][a + "x"] - (r + p) / 2) * (y ? j : 1), l[d][b + "y"] = (l[d][a + "y"] - (s + q) / 2) * (y ? j : 1)
        }, sigma.utils.getBoundaries = function(a, b, c) {
            var d, e, f = a.edges(),
                g = a.nodes(),
                h = -1 / 0,
                i = -1 / 0,
                j = 1 / 0,
                k = 1 / 0,
                l = -1 / 0,
                m = -1 / 0;
            if (c)
                for (d = 0, e = f.length; e > d; d++) h = Math.max(f[d][b + "size"], h);
            for (d = 0, e = g.length; e > d; d++) i = Math.max(g[d][b + "size"], i), l = Math.max(g[d][b + "x"], l), j = Math.min(g[d][b + "x"], j), m = Math.max(g[d][b + "y"], m), k = Math.min(g[d][b + "y"], k);
            return h = h || 1, i = i || 1, {
                weightMax: h,
                sizeMax: i,
                minX: j,
                minY: k,
                maxX: l,
                maxY: m
            }
        }
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.middlewares"), sigma.middlewares.copy = function(a, b) {
            var c, d, e;
            if (b + "" != a + "") {
                for (e = this.graph.nodes(), c = 0, d = e.length; d > c; c++) e[c][b + "x"] = e[c][a + "x"], e[c][b + "y"] = e[c][a + "y"], e[c][b + "size"] = e[c][a + "size"];
                for (e = this.graph.edges(), c = 0, d = e.length; d > c; c++) e[c][b + "size"] = e[c][a + "size"]
            }
        }
    }.call(this),
    function(a) {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.misc.animation.running");
        var b = function() {
            var a = 0;
            return function() {
                return "" + ++a
            }
        }();
        sigma.misc.animation.camera = function(c, d, e) {
            if (!(c instanceof sigma.classes.camera && "object" == typeof d && d)) throw "animation.camera: Wrong arguments.";
            if ("number" != typeof d.x && "number" != typeof d.y && "number" != typeof d.ratio && "number" != typeof d.angle) throw "There must be at least one valid coordinate in the given val.";
            var f, g, h, i, j, k, l = e || {},
                m = sigma.utils.dateNow();
            return k = {
                x: c.x,
                y: c.y,
                ratio: c.ratio,
                angle: c.angle
            }, j = l.duration, i = "function" != typeof l.easing ? sigma.utils.easings[l.easing || "quadraticInOut"] : l.easing, f = function() {
                var b, e = l.duration ? (sigma.utils.dateNow() - m) / l.duration : 1;
                e >= 1 ? (c.isAnimated = !1, c.goTo({
                    x: d.x !== a ? d.x : k.x,
                    y: d.y !== a ? d.y : k.y,
                    ratio: d.ratio !== a ? d.ratio : k.ratio,
                    angle: d.angle !== a ? d.angle : k.angle
                }), cancelAnimationFrame(g), delete sigma.misc.animation.running[g], "function" == typeof l.onComplete && l.onComplete()) : (b = i(e), c.isAnimated = !0, c.goTo({
                    x: d.x !== a ? k.x + (d.x - k.x) * b : k.x,
                    y: d.y !== a ? k.y + (d.y - k.y) * b : k.y,
                    ratio: d.ratio !== a ? k.ratio + (d.ratio - k.ratio) * b : k.ratio,
                    angle: d.angle !== a ? k.angle + (d.angle - k.angle) * b : k.angle
                }), "function" == typeof l.onNewFrame && l.onNewFrame(), h.frameId = requestAnimationFrame(f))
            }, g = b(), h = {
                frameId: requestAnimationFrame(f),
                target: c,
                type: "camera",
                options: l,
                fn: f
            }, sigma.misc.animation.running[g] = h, g
        }, sigma.misc.animation.kill = function(a) {
            if (1 !== arguments.length || "number" != typeof a) throw "animation.kill: Wrong arguments.";
            var b = sigma.misc.animation.running[a];
            return b && (cancelAnimationFrame(a), delete sigma.misc.animation.running[b.frameId], "camera" === b.type && (b.target.isAnimated = !1), "function" == typeof(b.options || {}).onComplete && b.options.onComplete()), this
        }, sigma.misc.animation.killAll = function(a) {
            var b, c, d = 0,
                e = "string" == typeof a ? a : null,
                f = "object" == typeof a ? a : null,
                g = sigma.misc.animation.running;
            for (c in g) e && g[c].type !== e || f && g[c].target !== f || (b = sigma.misc.animation.running[c], cancelAnimationFrame(b.frameId), delete sigma.misc.animation.running[c], "camera" === b.type && (b.target.isAnimated = !1), d++, "function" == typeof(b.options || {}).onComplete && b.options.onComplete());
            return d
        }, sigma.misc.animation.has = function(a) {
            var b, c = "string" == typeof a ? a : null,
                d = "object" == typeof a ? a : null,
                e = sigma.misc.animation.running;
            for (b in e)
                if (!(c && e[b].type !== c || d && e[b].target !== d)) return !0;
            return !1
        }
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.misc"), sigma.misc.bindEvents = function(a) {
            function b(b) {
                b && (f = "x" in b.data ? b.data.x : f, g = "y" in b.data ? b.data.y : g);
                var c, d, e, i, j, k, l, m, n = [],
                    o = f + h.width / 2,
                    p = g + h.height / 2,
                    q = h.camera.cameraPosition(f, g),
                    r = h.camera.quadtree.point(q.x, q.y);
                if (r.length)
                    for (c = 0, e = r.length; e > c; c++)
                        if (i = r[c], j = i[a + "x"], k = i[a + "y"], l = i[a + "size"], !i.hidden && o > j - l && j + l > o && p > k - l && k + l > p && Math.sqrt(Math.pow(o - j, 2) + Math.pow(p - k, 2)) < l) {
                            for (m = !1, d = 0; d < n.length; d++)
                                if (i.size > n[d].size) {
                                    n.splice(d, 0, i), m = !0;
                                    break
                                }
                            m || n.push(i)
                        }
                return n
            }

            function c(a) {
                function c(a) {
                    h.settings("eventsEnabled") && (h.dispatchEvent("click", a.data), i = b(a), i.length ? (h.dispatchEvent("clickNode", {
                        node: i[0],
                        captor: a.data
                    }), h.dispatchEvent("clickNodes", {
                        node: i,
                        captor: a.data
                    })) : h.dispatchEvent("clickStage", {
                        captor: a.data
                    }))
                }

                function d(a) {
                    h.settings("eventsEnabled") && (h.dispatchEvent("doubleClick", a.data), i = b(a), i.length ? (h.dispatchEvent("doubleClickNode", {
                        node: i[0],
                        captor: a.data
                    }), h.dispatchEvent("doubleClickNodes", {
                        node: i,
                        captor: a.data
                    })) : h.dispatchEvent("doubleClickStage", {
                        captor: a.data
                    }))
                }

                function e(a) {
                    h.settings("eventsEnabled") && (h.dispatchEvent("rightClick", a.data), i.length ? (h.dispatchEvent("rightClickNode", {
                        node: i[0],
                        captor: a.data
                    }), h.dispatchEvent("rightClickNodes", {
                        node: i,
                        captor: a.data
                    })) : h.dispatchEvent("rightClickStage", {
                        captor: a.data
                    }))
                }

                function f(a) {
                    if (h.settings("eventsEnabled")) {
                        var b, c, d, e = [];
                        for (b in j) e.push(j[b]);
                        for (j = {}, c = 0, d = e.length; d > c; c++) h.dispatchEvent("outNode", {
                            node: e[c],
                            captor: a.data
                        });
                        e.length && h.dispatchEvent("outNodes", {
                            nodes: e,
                            captor: a.data
                        })
                    }
                }

                function g(a) {
                    if (h.settings("eventsEnabled")) {
                        i = b(a);
                        var c, d, e, f = [],
                            g = [],
                            k = {},
                            l = i.length;
                        for (c = 0; l > c; c++) e = i[c], k[e.id] = e, j[e.id] || (g.push(e), j[e.id] = e);
                        for (d in j) k[d] || (f.push(j[d]), delete j[d]);
                        for (c = 0, l = g.length; l > c; c++) h.dispatchEvent("overNode", {
                            node: g[c],
                            captor: a.data
                        });
                        for (c = 0, l = f.length; l > c; c++) h.dispatchEvent("outNode", {
                            node: f[c],
                            captor: a.data
                        });
                        g.length && h.dispatchEvent("overNodes", {
                            nodes: g,
                            captor: a.data
                        }), f.length && h.dispatchEvent("outNodes", {
                            nodes: f,
                            captor: a.data
                        })
                    }
                }
                var i, j = {};
                a.bind("click", c), a.bind("mousedown", g), a.bind("mouseup", g), a.bind("mousemove", g), a.bind("mouseout", f), a.bind("doubleclick", d), a.bind("rightclick", e), h.bind("render", g)
            }
            var d, e, f, g, h = this;
            for (d = 0, e = this.captors.length; e > d; d++) c(this.captors[d])
        }
    }.call(this),
    function() {
        "use strict";
        if ("undefined" == typeof sigma) throw "sigma is not declared";
        sigma.utils.pkg("sigma.misc"), sigma.misc.drawHovers = function(a) {
            function b() {
                c.contexts.hover.canvas.width = c.contexts.hover.canvas.width;
                var b = sigma.canvas.hovers,
                    e = c.settings.embedObjects({
                        prefix: a
                    });
                if (e("enableHovering") && e("singleHover") && d.length && (d[d.length - 1].hidden || (b[d[d.length - 1].type] || b.def)(d[d.length - 1], c.contexts.hover, e)), e("enableHovering") && !e("singleHover") && d.length)
                    for (var f = 0; f < d.length; f++) d[f].hidden || (b[d[f].type] || b.def)(d[f], c.contexts.hover, e)
            }
            var c = this,
                d = [];
            this.bind("overNode", function(a) {
                d.push(a.data.node), b()
            }), this.bind("outNode", function(a) {
                var c = d.map(function(a) {
                    return a
                }).indexOf(a.data.node);
                d.splice(c, 1), b()
            }), this.bind("render", function() {
                b()
            })
        }
    }.call(this);
