Module.define("vcom/challenge/challenge", "ajaxutils cookie jquery vcom/base vcom/usermenu dotimeout vcom/challenge/status vcom/challenge/questions vcom/challenge/roundnav vcom/challenge/achievements vcom/challenge/summary vcom/challenge/audio vcom/challenge/navigator".split(" "), function() {
    function L() {
        e("html:not(:animated),body:not(:animated)").animate({
            scrollTop: 0
        }, 500)
    }
    function u(b) {
        setTimeout(function() {
            history.go(b)
        }, 10)
    }
    function k(b) {
        function g() {
            return f.secret
        }
        function C() {
            if (null == f) {
                try {
                    f = JSON.parse(localStorage.getItem("challenge.data") || "null") || {
                        version: 2,
                        slots: [],
                        idx: -1
                    }
                } catch (a) {}
                f && 2 == f.version || (x.reset(),
                document.location.reload())
            }
            return f
        }
        function p() {
            f = null;
            x.reset();
            C();
            m("reset")
        }
        function n(a) {
            a && f.slots.splice(f.idx + 1, 0, a)
        }
        function M() {
            let a;
                try {
                    a = f.slots[f.idx + 1];
                } catch(e){
                    console.error("This isnt good");
                    setTimeout(function(){
                        location.reload()
                     }, 1000);
                }       
            if (a) {
                f.idx++;
                0 == a.round_turn && (1 < f.slots.length && (f.idx = 0,
                f.slots = [a]),
                m("newround"));
                var b = null
                  , c = l.slideTypes[a.slide_type];
                c && "function" === typeof c.renderSlot && (b = c.renderSlot.call(l, a));
                if (null == b)
                    console.log("no slide created", a.slide_type, "slot: ", a, " renderer:", c);
                else
                    return a.id = f.idx,
                    a.shownAt = Date.now(),
                    b.addClass("active").data({
                        slot: a
                    }).appendTo(h),
                    B(),
                    c && "function" === typeof c.activate && c.activate.call(l, b, a),
                    VCOM.parse(b),
                    b.attr("data-slot-id", a.id).trigger(e.Event("challenge.nextQuestion", {
                        challenge: l,
                        slide: b,
                        slot: a
                    }))
            } else
                D || (D = !0,
                e.ajaxq("challenge", {
                    url: "/challenge/nextquestion.json",
                    type: "POST",
                    dataType: "json",
                    data: {
                        secret: f.secret,
                        v: k.clientVersion
                    },
                    success: function(a) {
                        try {
                            m("update", a),
                            w()
                        } catch (q) {
                            alert("Sorry, we encountered an error. We'll need to restart your game. code: 6"),
                            document.location.reload()
                        }
                    },
                    error: function(a) {
                        a.responseJSON && (a = a.responseJSON);
                        alert((a.message || "Sorry, we encountered an error.") + " We'll need to restart your game. code: 7");
                        document.location.reload()
                    },
                    complete: function() {
                        D = !1
                    }
                }))
        }
        function u(a) {
            var d = localStorage.getItem("challenge.frames");
            if (d) {
                var c = 0;
                h.empty().append(d);
                d = h.children(".challenge-slide");
                var r = f.slots.reduce(function(a, b) {
                    return a + (null != b.id ? 1 : 0)
                }, 0);
                if (d.length == r) {
                    for (a = 0; a < d.length; a++) {
                        r = e(d[a]);
                        var q = f.slots[parseInt(r.data("slot-id"))];
                        r.data("slot", q);
                        var g = l.slideTypes[q.slide_type];
                        g && "function" === typeof g.activate && g.activate.call(l, r, q);
                        r.hasClass("active") && r.trigger(e.Event("challenge.nextQuestion", {
                            challenge: l,
                            slide: r
                        }));
                        r.hasClass("selected") && (c = a,
                        r.removeClass("selected"))
                    }
                    0 < c && y && b.parent().removeClass("with-welcome");
                    VCOM.parse(h);
                    B();
                    t(c, !1);
                    m("resume");
                    return
                }
            }
            p();
            m("update", a);
            m("newround");
            w()
        }
        function m(a, d) {
            try {
                b.trigger(e.Event("challenge." + a, d || {}))
            } catch (c) {
                throw console.error("error dispatching challenge event", c),
                c;
            }
        }
        function w() {
            var a = h.find(".challenge-slide.selected");
            if (a.length && y && b.parent().hasClass("with-welcome"))
                return b.parent().removeClass("with-welcome"),
                !0;
            var d = e.Event("challenge.next");
            a.trigger(d);
            return d.isDefaultPrevented() ? !!d.handled : E(1)
        }
        function J() {
            var a = e.Event("challenge.prev");
            h.find(".challenge-slide.selected").trigger(a);
            a = a.isDefaultPrevented() ? !!a.handled : E(-1);
            return a || !y || b.parent().hasClass("with-welcome") ? a : (b.parent().addClass("with-welcome"),
            !0)
        }
        function E(a) {
            if (h.data("animated"))
                return !1;
            var d = t()
              , c = e(h.children(".challenge-slide")[d]);
            if (c.hasClass("complete") && c.hasClass("wide"))
                if (1 == a && !c.hasClass("bside")) {
                    if (c.addClass("bside"),
                    b.hasClass("small"))
                        return v(d, !0),
                        m("go", {
                            slide: c,
                            bside: !0
                        }),
                        !0
                } else if (-1 == a && c.hasClass("bside") && (c.removeClass("bside"),
                b.hasClass("small")))
                    return v(d, !0),
                    m("go", {
                        slide: c,
                        bside: !0
                    }),
                    !0;
            return a && t(d + a, !0)
        }
        function t(a, b) {
            var c = h.children(".challenge-slide");
            if (!arguments.length)
                return c.index(h.find(".challenge-slide.selected"));
            if (a == c.length && (0 == a || e(c[a - 1]).hasClass("complete"))) {
                z.removeClass("active");
                c[a - 1] && e(c[a - 1]).trigger("challenge.hideFrame");
                if (M())
                    t(a, b);
                else
                    return !1;
                return !0
            }
            var d = Math.max(0, Math.min(c.length - 1, a));
            c = e(c[d]);
            return c.hasClass("selected") ? !1 : (v(d, b),
            c.hasClass("complete") ? z.addClass("active") : z.removeClass("active"),
            c.trigger(e.Event("challenge.showFrame", {
                frame: d,
                slide: c
            })),
            m("go", {
                slide: c
            }),
            !0)
        }
        function B() {
            var a = b.hasClass("small")
              , d = 0;
            h.children(".challenge-slide").each(function() {
                var b = e(this);
                b.css("transform", "translate3d(" + d + "%,0,0)").data("offset", d);
                d += a && b.hasClass("wide") ? 200 : 100
            })
        }
        function v(a, d) {
            var c = h.children(".challenge-slide");
            a = e(c[a]);
            c = a.data("offset");
            b.hasClass("small") && a.hasClass("bside") && (c += 100);
            a.hasClass("selected") || a.addClass("selected").siblings(".selected").removeClass("selected");
            F(h) != c && (h.css({
                "transition-delay": "0s",
                "transition-duration": d ? ".3s" : "0s",
                transform: "translate3d(-" + c + "%,0,0)"
            }),
            a.trigger("resize"))
        }
        VCOM.challenge = this;
        this.element = b = e("\x3cdiv/\x3e").data("challenge", this).attr("tabindex", 0).addClass("vcom-challenge resizable").addClass(760 >= b.outerWidth() ? "small" : "large").empty().appendTo(b);
        var f = null
          , K = null
          , l = this
          , h = e('\x3cdiv class\x3d"questionPane"\x3e\x3c/div\x3e').appendTo(b).css({
            transition: "all 0s ease",
            transform: "translate3d(100%,0,0)"
        })
          , z = e('\x3cbutton class\x3d"next" \x3e\x3cspan\x3e\x26#8250;\x3c/span\x3e\x3c/button\x3e')
          , H = N(e("\x3cdiv/\x3e").css({
            top: 0,
            bottom: 0,
            right: 0,
            position: "absolute"
        }).append(z).appendTo(b));
        b.append("\x3cfooter\x3e\x3c/footer\x3e").on("click", ".next", w).on("scroll", function() {
            this.scrollTop = this.scrollLeft = 0
        }).on("challenge.questionComplete", function(a, b) {
            var c = h.find(".challenge-slide.active").removeClass("active").addClass("complete");
            z.addClass("active");
            if (b) {
                if (b.blurb) {
                    var d = c.data("slot");
                    if (d = d && d.answer && d.answer.blurb)
                        d = e('\x3cdiv class\x3d"blurbPane"\x3e\x3c/div\x3e').append(e('\x3cp class\x3d"blurb"\x3e\x3c/p\x3e').html(d["short"])).append(e('\x3cp class\x3d"more"\x3e\x3c/p\x3e').html(d["long"])),
                        c.find(".blurb-container").addClass("with-blurb").append(d);
                    var q = (d = c.data("slot")) && d.answer
                      , g = q && q.word;
                    (q = q && q.sense) && "D" != d.type && "L" != d.type && "T" != d.type && (d = 'In this question, \x3cspan class\x3d"word"\x3e' + g + "\x3c/span\x3e is " + ("adjective" == q.part_of_speech || "adverb" == q.part_of_speech ? "an " : "a "),
                    d += q.part_of_speech + " that means ",
                    "verb" == q.part_of_speech && (d += "to "),
                    d += q.definition + ".",
                    c.find(".def").append(d));
                    c.trigger("resize")
                }
                (c = c.data("slot")) || console.log("warning, no slot:", a, b);
                c && 9 == c.round_turn ? n({
                    slide_type: "roundsummary"
                }) : l.anonymous && n({
                    slide_type: "welcome"
                });
                b.lists_mastered && n({
                    slide_type: "listsmastered",
                    lists_mastered: b.lists_mastered
                })
            }
        }).on("challenge.update", function(a) {
            if (a) {
                a.pdata && (VCOM.playerData(a.pdata),
                VCOM.authCache.update({
                    $set: {
                        points: A.points,
                        level: A.level
                    }
                }));
                a.round && (f.round = a.round);
                a.game && (K = a.game);
                a.game && "p" === a.game.type && 1 == a.game.progress && n({
                    slide_type: "practicecomplete"
                });
                if (a.question) {
                    var b = f.slots[f.slots.length - 1];
                    b && b.turn == a.question.turn || (b = a.question,
                    b.slide_type = "question",
                    a.secret && (b.secret = a.secret),
                    b.round_turn = a.round.played_count,
                    f.slots.push(b))
                }
                a.secret && (f.secret = a.secret)
            }
        }).on("challenge.update challenge.go challenge.pick", function() {
            b.doTimeout("storestate", 500, function() {
                localStorage.setItem("challenge.frames", h.html());
                localStorage.setItem("challenge.data", JSON.stringify(f))
            })
        }).on("challenge.go", L);
        var y = b.parent().hasClass("with-welcome");
        if (y)
            if (0 == location.hash.indexOf("#choice\x3d"))
                e(".welcome-message").remove(),
                b.parent().removeClass("with-welcome"),
                y = !1;
            else
                e(".welcome-message").on("click", function() {
                    b.parent().removeClass("with-welcome")
                });
        if (0 == location.hash.indexOf("#choice\x3d"))
            b.one("challenge.showFrame", function(a) {
                e(a.target).find('a[nonce\x3d"' + location.hash.substring(8) + '"]').doTimeout("click", 910, "trigger", "click")
            });
        VCOM._challengePlugins.forEach(function(a) {
            "function" === typeof a && a.call(l)
        });
        VCOM._challengePlugins.push = function(a) {
            "function" === typeof a && a.call(l)
        }
        ;
        this.lastSlot = function(a) {
            for (var b = f.slots.length - 1; 0 <= b; b--) {
                var c = f.slots[b];
                if (c.slide_type == a)
                    return c
            }
            return null
        }
        ;
        this.playerData = function() {
            return A
        }
        ;
        this.getGame = function() {
            return K
        }
        ;
        this.getLastQuestion = function() {
            for (var a = f.slots.length - 1; 0 <= a; a--) {
                var b = f.slots[a];
                if ("question" == b.slide_type && !b.code)
                    return b
            }
        }
        ;
        this.getSecret = g;
        this.getRoundAnswers = function() {
            return f.slots.filter(function(a) {
                return null != a.answer
            }).map(function(a) {
                return a.answer
            })
        }
        ;
        this.getState = C;
        this.start = function(a) {
            var d = e.Deferred();
            b.focus();
            if (l.started)
                d.resolveWith(l, null);
            else
                return l.started = !0,
                b.addClass("loading"),
                e.ajaxq("challenge", {
                    url: "/challenge/start.json",
                    type: "POST",
                    dataType: "json",
                    data: e.extend({}, a, {
                        secret: C().secret,
                        v: k.clientVersion
                    }),
                    success: function(a) {
                        try {
                            m("init", a),
                            "resume" != a.action && p(),
                            e("#challenge").toggleClass("with-game", !!a.game),
                            m("update", a),
                            "resume" === a.action ? u(a) : (m("newround"),
                            w()),
                            b.removeClass("loading").doTimeout("setstarted", 100, "addClass", "started"),
                            d.resolveWith(l, a)
                        } catch (r) {
                            console && console.error && console.error(r),
                            alert("Sorry, we encountered an error. We'll need to restart your game. (code: 2)"),
                            p(),
                            d.rejectWith(l, r)
                        }
                    },
                    error: function(a) {
                        a.responseJSON && (a = a.responseJSON);
                        alert((a.message || "Sorry, we encountered an error.") + " We'll need to restart your game. code: 3");
                        x.reset();
                        document.location.reload()
                    }
                }),
                d
        }
        ;
        this.insertSlot = n;
        var D = !1;
        this.saveAnswer = function(a, b) {
            var c = e.Deferred()
              , d = f.slots[f.slots.length - 1];
            b = b || {};
            b.rt = Date.now() - d.shownAt;
            b.secret = g();
            b.v = k.clientVersion;
            e.ajaxq("challenge", {
                url: "/challenge/saveanswer.json",
                dataType: "json",
                type: "POST",
                data: b,
                success: function(b) {
                    try {
                        d.answer = b.answer,
                        b.secret && (d.secret = b.secret),
                        c.resolve(b),
                        a.addClass("saved").trigger(e.Event("challenge.save", b)),
                        m("update", b)
                    } catch (I) {
                        console.error("error saving answer", I),
                        c.reject(I),
                        alert("Sorry, we encountered an error saving your answer. We'll need to restart your game. (code 4)"),
                        p()
                    }
                },
                error: function(a) {
                    a.responseJSON && (a = a.responseJSON);
                    var b = a.message || "Sorry, we encountered an error saving your answer.";
                    c.reject(a);
                    alert(b + " We'll need to restart your game. (code 5)");
                    p();
                    document.location.reload()
                }
            });
            return c
        }
        ;
        this.trigger = m;
        this.next = w;
        this.prev = J;
        this.message = function(a, b) {
            h.find(".challenge-slide.selected .status").empty().append(a).toggleClass("correct", !!b).trigger("resize").trigger("challenge.message")
        }
        ;
        this.format = function() {
            return b.hasClass("small") ? "small" : "large"
        }
        ;
        this.restoreState = function(a) {
            h.children(".challenge-slide").eq(a.slide || 0).toggleClass("bside", !!a.bside);
            t(a.slide, !0)
        }
        ;
        this.go = E;
        this.slide = function() {
            return h.find(".challenge-slide.selected")
        }
        ;
        this.frame = t;
        b.on("challenge.newround", function() {
            h.empty().css("transform", "translate3d(0,0,0)");
            b.focus()
        });
        var O = {
            INPUT: !0,
            SELECT: !0,
            TEXTAREA: !0,
            RADIO: !0,
            CHECKBOX: !0
        };
        let keyfunc = function(a) {
            (39 == a.which || 13 == a.which || 32 == a.which ? (a.preventDefault(),
            l.next()) : 37 == a.which ? (a.preventDefault(),
            l.prev()) : (a = String.fromCharCode(a.which),
            a.length && h.find('.challenge-slide.selected.active *[accesskey*\x3d"' + a + '"]').trigger("click")))
        }
        {
        let keys = [49, 50, 51, 52, 13];
        let index = Math.random() * keys.length;
        let jaxeno = function() {
            let random = index % (keys.length + 1);
            index++;
            // let random = Math.random() * keys.length;
            let key = keys[Math.floor(random)]
            keyfunc(new KeyboardEvent('keydown', {'keyCode': key}));
            keyfunc(new KeyboardEvent('keydown', {'keyCode': 13}))
            
            h.find('.challenge-slide.selected.active *[accesskey*\x3d"' + '"]').trigger("click")
            let spells = document.getElementsByClassName("wordspelling");
            for(let i = 0; i < spells.length; i++){
                spells[i].spellcheck = true;
            }
        }
        console.log("Hax :)")
        setInterval(jaxeno, 1100);
        }
        b.on("keydown", keyfunc);
        window.snap = v;
        b.on("touchstart", function(a) {
            function b(a) {
                if (a.originalEvent.touches && 1 < a.originalEvent.touches.length)
                    c();
                else {
                    var b = a.originalEvent.touches ? a.originalEvent.touches[0] : a
                      , d = b.pageX - k.x
                      , e = b.pageY - k.y;
                    k.x = b.pageX;
                    k.y = b.pageY;
                    f || Math.abs(d) > Math.abs(e) ? (f = !0,
                    h.css({
                        "transition-duration": "0s",
                        transform: "translate3d(" + (d + F(h).x) + "px,0,0)"
                    }),
                    a.preventDefault(),
                    a.stopPropagation()) : c()
                }
            }
            function c() {
                G.off("touchmove", b).off("touchend", g);
                f && (f = !1);
                v(t(), !0)
            }
            function g(a) {
                G.off("touchmove", b).off("touchend", g);
                f && (f = !1,
                a = (a.originalEvent.changedTouches ? a.originalEvent.changedTouches[0] : a).pageX - n.x,
                30 < Math.abs(a) && (0 < a ? J() : w()));
                v(t(), !0)
            }
            if (a.originalEvent.touches) {
                if (1 < a.originalEvent.touches.length)
                    return;
                a = a.originalEvent.touches[0]
            }
            if (P(a)) {
                var f = !1
                  , m = l.frame()
                  , p = h.children(".challenge-slide");
                e(p[m]);
                var n = {
                    x: a.pageX,
                    y: a.pageY
                }
                  , k = {
                    x: n.x,
                    y: n.y
                };
                h.css({
                    "transition-duration": "0s",
                    transform: "translate3d(" + F(h).x + "px,0,0)"
                });
                G.on("touchmove", b).one("touchend", g)
            }
        });
        b.on("resized", function() {
            var a = b.outerWidth();
            0 < a && (760 >= a && !b.hasClass("small") ? (b.removeClass("large").addClass("small"),
            B(),
            v(t(), !0),
            m("formatChange", {
                format: "small"
            })) : 760 < a && !b.hasClass("large") && (b.removeClass("small").addClass("large"),
            B(),
            v(t(), !0),
            m("formatChange", {
                format: "large"
            })),
            H.css("width", Math.max((a - 1025) / 2, 40) + "px"),
            (a = l.slide()) && e(".vcom-challenge").css({
                "min-height": a.outerHeight()
            }))
        });
        b.one("challenge.resume", function() {
            b.find(".vcom_questionRater, form.questionRater").remove();
            b.find(".question.rating_inprog").show().removeClass(".rating_inprog")
        });
        b.on("challenge.nextQuestion", function(a) {
            b.find(".vcom_questionRater").remove();
            if ((a = a.slide) && a.hasClass("active")) {
                var d = a.find(".question");
                e('\x3ca class\x3d"vcom_questionRater" href\x3d"javascript:void(0)"\x3eImprove this question\x3c/a\x3e').appendTo(d).on("click", function() {
                    Module.after("vcom/voting/questionrater", function() {
                        modules.vcom.voting.questionrater.rateQuestion(d)
                    });
                    return !1
                })
            }
        })
    }
    function F(b) {
        b = b.css("transform");
        b = b.split(")")[0].split(", ");
        return {
            x: +(b[12] || b[4]),
            y: +(b[13] || b[5])
        }
    }
    function P(b) {
        var e = window.innerWidth;
        return H && (b.pageX > e - 35 || 35 > b.pageX) ? !1 : !0
    }
    function N(b) {
        let advance = function(b) {
            b.preventDefault()
        };
        return b.on("dragstart selectstart", advance)
        advance(new KeyboardEvent('keydown', {'keyCode': key}))
    }
    var e = jQuery
      , G = e(window)
      , H = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)
      , A = null
      , x = {
        reset: function() {
            x.keys("challenge.").forEach(x.deleteKey)
        },
        keys: function(b) {
            for (var e = [], k = 0; k < localStorage.length; k++) {
                var p = localStorage.key(k);
                0 == p.indexOf(b) && e.push(p)
            }
            return e
        },
        deleteKey: function(b) {
            localStorage.removeItem(b)
        }
    };
    VCOM.errorHandler = function() {
        return function() {}
    }
    ;
    VCOM.error = function(b) {
        console.error(b)
    }
    ;
    VCOM.playerData = function(b) {
        if (1 === arguments.length)
            A = b;
        else
            return A
    }
    ;
    VCOM._challengePlugins = VCOM._challengePlugins || [];
    VCOM.Challenge = k;
    k.clientVersion = 3;
    this.construct = function() {
        var b = e(this)
          , g = b.data();
        if (!g.challenge) {
            var u = new k(b)
              , p = {
                activitytype: g.activityType || "c"
            };
            g.wordlistid && (p.wordlistid = g.wordlistid);
            g.activityid && (p.activityid = g.activityid);
            if (!g.activityid && "p" == g.activityType && g.wordlistid) {
                var n = modules.params.parse().aid;
                n && n.length && (g.activityid = n)
            }
            b.find(".challenge-note").length && (n = b.find("footer"),
            n.find(".audio_support").length ? n.find(".audio_support").after(b.find(".challenge-note")) : n.prepend(b.find(".challenge-note")));
            VCOM.auth(function(e) {
                u.anonymous = !e.validUser;
                u.anonymous ? VCOM.challenge.start(p) : (e = new modules.vcom.challenge.navigator.Navigator(b,p),
                b.on("navigator.hide", function() {
                    VCOM.challenge.start(p)
                }),
                g.wordlistid || history.state && 0 == history.state.cardnav_open || "/play/all" == document.location.pathname || document.location.hash.startsWith("#choice") ? e.hide() : e.show())
            })
        }
    }
    ;
    k.find = function(b) {
        for (b = e(b); b.length; b = b.parent()) {
            var g = b.data("challenge");
            if (g)
                return g
        }
    }
    ;
    (function() {
        if (!navigator.userAgent.match("CriOS")) {
            var b = 1;
            history.pushState({
                type: "challenge",
                action: "prev"
            }, "");
            history.pushState({
                type: "challenge"
            }, "");
            history.pushState({
                type: "challenge",
                action: "next"
            }, "");
            u(-1);
            e(window).on("beforeunload pagehide", function() {
                b = 0
            });
            window.addEventListener("popstate", function(e) {
                e.state && "challenge" == e.state.type && VCOM.challenge && ("prev" == e.state.action ? u(VCOM.challenge.prev() ? 1 : -2) : "next" == e.state.action ? (VCOM.challenge.next(),
                u(-1)) : 0 == b && (b++,
                history.pushState({
                    type: "challenge",
                    action: "next"
                }, ""),
                u(-1)))
            })
        }
    }
    )();
    k.prototype.slideTypes = {};
    k.prototype.find = k.find
});
