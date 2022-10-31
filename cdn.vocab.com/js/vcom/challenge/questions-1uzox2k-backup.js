Module.define("vcom/challenge/questions", ["jquery"], function() {
    function t(b, e) {
        b.hasClass("active") && !e.terminal && window.setTimeout(function() {
            b.trigger("challenge.questionComplete")
        }, parseInt(e.delayNext) || 750)
    }
    function u(b, c) {
        if (b.hasClass("active")) {
            var d = this
              , a = e.Deferred()
              , g = b.find(".choices a").not(".correct, .incorrect")
              , k = b.attr("hintsUsed") || ""
              , f = k.includes("F") ? 2 - g.length : 4 - g.length
              , l = +new Date;
            c && c.answer && a.resolve(c.answer);
            b.find(".blocker").remove();
            g.on("click", function() {
                if (!b.hasClass("complete")) {
                    var c = +new Date;
                    if (c - l < (0 == f ? 900 : 450))
                        v(b, f);
                    else {
                        l = c;
                        var k = e(this).off("click").addClass("loading")
                          , h = {
                            tries: ++f
                        };
                        a.then(function(a) {
                            h.correct = k.index() == a.correct_choice;
                            k.trigger(e.Event("challenge.pick", h)).removeClass("loading");
                            !b.hasClass("complete") && (h.correct ? (g.off("click"),
                            k.addClass("correct"),
                            b.addClass("complete " + (1 == h.tries ? "correct" : "incorrect")),
                            b.trigger("challenge.questionComplete", a)) : (k.addClass("incorrect").removeClass("loading"),
                            1 === h.tries && b.find(".pointValue").html("0")),
                            a = h.correct ? p : m[h.tries - 1]) && (a = a[Math.floor(Math.random() * a.length)],
                            d.message(e('\x3ch3 data-audio-prompt\x3d"' + a.audio + '"\x3e' + a.text + "\x3c/h3\x3e"), h.correct))
                        });
                        1 === h.tries && d.saveAnswer(b, {
                            a: k.attr("nonce")
                        }).then(function(b) {
                            a.resolve(b.answer)
                        })
                    }
                }
            });
            (function() {
                var a = c.hints;
                if (a && a.length) {
                    var g = b.find(".lifeLines")
                      , h = b.find(".lifeLineContent");
                    0 == f && (b.one("challenge.pick", function() {
                        b.doTimeout("showlifelines");
                        g.slideUp().find("a").off("click");
                        h.slideUp()
                    }),
                    b.doTimeout("showlifelines", 7E3, function() {
                        g.empty().append('\x3cspan class\x3d"label"\x3eNot sure? Get a hint:\x3c/span\x3e').append(e('\x3cspan style\x3d"white-space: nowrap;"\x3e\x3c/span\x3e').append(a.map(function(b) {
                            switch (b) {
                            case "F":
                                return e('\x3ca data-type\x3d"F" class\x3d"fiftyfifty button v2" title\x3d"We\'ll eliminate two choices for you." href\x3d"javascript:void(0);"\x3e50/50\x3c/a\x3e');
                            case "D":
                                return e('\x3ca data-type\x3d"D" class\x3d"seedef button v2" title\x3d"See the definition of this word" href\x3d"javascript:void(0);"\x3eDefinition\x3c/a\x3e');
                            case "E":
                                return e('\x3ca data-type\x3d"E" class\x3d"inthewild button v2" title\x3d"See examples of this word used in context." href\x3d"javascript:void(0);"\x3eWord in the Wild\x3c/a\x3e')
                            }
                        }))).fadeIn().find("a").one("click", function() {
                            g.slideUp().find("a").off("click");
                            var a = e(this).data("type")
                              , c = b.find(".pointValue");
                            c.text(parseInt(c.text()) / 2);
                            e.ajaxq("challenge", {
                                url: "/challenge/hint.json",
                                type: "POST",
                                dataType: "json",
                                data: {
                                    secret: d.getSecret(),
                                    type: a,
                                    v: VCOM.Challenge.clientVersion
                                },
                                success: function(g) {
                                    try {
                                        switch (d.trigger("update", g),
                                        a) {
                                        case "E":
                                            h.empty().append(e('\x3cvcom:examples count\x3d"1" /\x3e').attr("word", g.word));
                                            VCOM.parse(h);
                                            h.fadeIn().trigger("resize");
                                            b.attr("hintsUsed", k + "E");
                                            break;
                                        case "F":
                                            g.nonces.forEach(function(a) {
                                                e(".choices a[nonce\x3d" + a + "]").addClass("incorrect").off("click")
                                            });
                                            b.attr("hintsUsed", k + "F");
                                            break;
                                        case "D":
                                            h.empty().append(g.def).fadeIn().trigger("resize");
                                            b.attr("hintsUsed", k + "D");
                                            break;
                                        default:
                                            h.fadeIn().trigger("resize")
                                        }
                                    } catch (w) {
                                        VCOM.error({
                                            cause: w,
                                            message: "There was an error rendering the lifelines"
                                        })
                                    }
                                },
                                error: function(a) {
                                    a.responseJSON && (a = a.responseJSON);
                                    alert((a.message || "Sorry, we encountered an error.") + " We'll need to restart your game. code: 14");
                                    document.location.reload()
                                }
                            })
                        }).trigger("resize")
                    }))
                }
            }
            )();
            var m = [[{
                text: "Try again!",
                audio: 11
            }], [{
                text: "Keep trying!",
                audio: 12
            }], [{
                text: "Sorry, incorrect...",
                audio: 13
            }]]
              , p = [{
                text: "Nice job!",
                audio: 2
            }, {
                text: "Correct!",
                audio: 3
            }, {
                text: "Wonderful!",
                audio: 4
            }, {
                text: "Terrific!",
                audio: 5
            }, {
                text: "Super!",
                audio: 6
            }, {
                text: "Good work!",
                audio: 7
            }, {
                text: "Excellent!",
                audio: 8
            }, {
                text: "Brilliant!",
                audio: 9
            }, {
                text: "Well done!",
                audio: 10
            }]
        }
    }
    function x(b, c) {
        function d() {
            var d = l.val().trim().toLowerCase();
            if (0 == d.length)
                e(".playword", b).trigger("click");
            else {
                var c = {
                    tries: parseInt(b.attr("guesses") || 0) + 1
                };
                    c.tries = 1;
                b.attr("guesses", "" + c.tries);
                f.then(function(f) {
                    c.correct = f && -1 != f.accepted_answers.indexOf(d);
                    b.attr("guesses", "" + c.tries);
                    b.trigger(e.Event("challenge.pick", c));
                    k.hasClass("small") && (l.blur(),
                    setTimeout(function() {
                        l.trigger("focus")
                    }, 2E3));
                    f = Math.min(3, c.tries);
                    var n = c.correct ? h : r[f - 1];
                    f = c.correct || 3 > f ? n[Math.floor(Math.random() * n.length)] : n[(c.tries - 1) % n.length];
                    g.message('\x3ch3 data-audio-prompt\x3d"' + f.audio + '"\x3e' + f.text + "\x3c/h3\x3e", c.correct)
                });
                1 == c.tries && g.saveAnswer(b, {
                    a: d
                }).then(function(a) {
                    a.answer.accepted_answers = a.answer.accepted_answers.map(function(a) {
                        return a.toLowerCase().trim()
                    });
                    f.resolve(a.answer)
                })
            }
        }
        function a(a) {
            answered = !0;
            l.attr("disabled", !0);
            l.blur();
            l.off("keypress focus");
            p.off("click");
            m.off("click");
            q.html(a.sentence_html);
            k.focus();
            b.trigger("challenge.questionComplete", a)
        }
            
        if (b.hasClass("active") || true) {
            var g = this
              , k = this.element
              , f = e.Deferred();
            c.answer && f.resolve(c.answer);
            var l = e("input.wordspelling", b).on("keypress", function(a) {
                true && d()
            }).focus();
            e(".playword", b).on("click", y(function() {
                VCOM.playAudio({
                    name: c.audio || b.data("audio"),
                    nodeName: "audio"
                });
                l.focus()
            }, 1200));
                
            {
                f.then(function(c) {
                    b.addClass("incorrect");
                    a(c);
                console.log(c.word)
                    g.message('\x3ch3\x3eThe correct spelling is \x3cspan class\x3d"correctspelling"\x3e' + c.word + "\x3c/span\x3e.\x3c/h3\x3e")
                })
            b.addClass("cansurrender")
            }
        e("button.spellit", b).on("click", function() {
                f.then(function(c) {
                    b.addClass("incorrect");
                    a(c);
                console.log(c.word)
                    g.message('\x3ch3\x3eThe correct spelling is \x3cspan class\x3d"correctspelling"\x3e' + c.word + "\x3c/span\x3e.\x3c/h3\x3e")
                })
            })
            var m = e("button.spellit", b).on("click", d)
              , p = e("button.surrender", b).on("click", function() {
                f.then(function(c) {
                    b.addClass("incorrect");
                    a(c);
                console.log(c.word)
                    g.message('\x3ch3\x3eThe correct spelling is \x3cspan class\x3d"correctspelling"\x3e' + c.word + "\x3c/span\x3e.\x3c/h3\x3e")
                })
            })
              , q = e(".questionContent .blanked", b)
              , r = [[{
                text: "Try again!",
                audio: 11
            }], [{
                text: "Keep trying!",
                audio: 12
            }], [{
                text: "Sorry, incorrect...",
                audio: 13
            }]]
              , h = [{
                text: "Nice job!",
                audio: 2
            }, {
                text: "Correct!",
                audio: 3
            }, {
                text: "Wonderful!",
                audio: 4
            }, {
                text: "Terrific!",
                audio: 5
            }, {
                text: "Super!",
                audio: 6
            }, {
                text: "Good work!",
                audio: 7
            }, {
                text: "Excellent!",
                audio: 8
            }, {
                text: "Brilliant!",
                audio: 9
            }, {
                text: "Well done!",
                audio: 10
            }]
        }
    }
    function z(b) {
        var c = (VCOM.playerData().lists || []).reduce(function(a, b) {
            a[b.listId] = b;
            return a
        }, {})
          , d = b.lists_mastered.map(function(a) {
            return c[a] ? e('\x3cli\x3e\x3ca class\x3d"list"\x3e\x3ccanvas class\x3d"progress" data-progress\x3d"100"\x3e\x3c/canvas\x3e\x3c/a\x3e\x3c/li\x3e').find("a").attr("href", "/lists/" + a).append(document.createTextNode(c[a].name)).end() : ""
        });
        return e('\x3cdiv class\x3d"challenge-slide summary" \x3e\n\t\t\t\t \x3cdiv class\x3d"list-complete-slide activity-summary"\x3e\n\t\t\t\t    \x3cdiv class\x3d"limited-width"\x3e\n\t\t\t\t\t\t\x3csection\x3e\x3ch1\x3eCongratulations!\x3cbr\x3e You\'ve mastered all the words on the following list\x3cspan class\x3d"plural"\x3e\x3c/span\x3e:\x3c/h1\x3e\n\t\t\t            \x3cul class\x3d"listslearned" \x3e\x3c/ul\x3e\n\t\t                \x3c/section\x3e\n\t\t                \x3csection class\x3d"nowWhat"\x3e\x3ch2\x3eWhat Next?\x3c/h2\x3e\x3cnav class\x3d"cards" data-module\x3d"vcom/challenge/cardnav" data-activity-type\x3d"c"\x3e\x3c/nav\x3e\x3c/section\x3e\n\t\t            \x3c/div\x3e\n\t\t        \x3c/div\x3e\n\t\t        \x3c/div\x3e').data("slot", b).find(".plural").text(1 == b.lists_mastered.length ? "" : "s").end().find("ul").append(d).end()
    }
    function A(b) {
        var c = e('\x3cdiv class\x3d"challenge-slide wrapper"\x3e\x3c/div\x3e');
        b = this.getLastQuestion().answer;
        var d = JSON.parse(localStorage.getItem("challenge.interstitials") || "{}")
          , a = null
          , g = 5;
        d.nicetomeet ? !b.correct && (d.onewrong || 0) < b.turn ? (g = 10,
        a = "onewrong") : 3 == b.streak && (d.onaroll || 0) < b.turn ? (g = 15,
        a = "onaroll") : 4 == b.streak && (d.yourgood || 0) < b.turn ? (g = 15,
        a = "yourgood") : null != b.achievements && (d.achievement || 0) < b.turn ? (g = 15,
        a = "achievement") : (a = "wordsyouneed grow science reading studentlove teacherlove everyonelove dictionarysoul".split(" "),
        a = a[b.turn % a.length]) : (g = 100,
        a = "nicetomeet");
        d[a] = b.turn + g;
        localStorage.setItem("challenge.interstitials", JSON.stringify(d));
        c.load("/challenge/interstitial/" + a, function() {
            c.trigger("resize")
        });
        return c
    }
    function v(b, c) {
        var d = VCOM.challenge.element;
        if (!d.hasClass("with-blocker") && false) {
            var a = [["Take your time!"], ["Try not to rush!"]]
              , g = d.data("blockcount") || 0;
            c = 0 == c ? a[0] : a[1];
            var k = Math.min(10, 2 * (g + 1))
              , f = e('\x3cdiv class\x3d"blocker"\x3e\x3cblockquote\x3e' + c[g % c.length] + '\x3cdiv class\x3d"countdown"\x3e' + k + "\x3c/div\x3e\x3c/blockquote\x3e\x3c/div\x3e").data("remain", 5).appendTo(b.find(".choices")).doTimeout("countdown", 1E3, function() {
                f.find(".countdown").text(--k);
                0 == k && f.fadeOut(function() {
                    f.remove();
                    d.removeClass("with-blocker")
                });
                return 0 != k
            });
            d.addClass("with-blocker").data("blockcount", ++g)
        }
    }
    function y(b, c) {
        var d = 0;
        return function() {
            var a = +new Date;
            a - d > c && (b.apply(this, arguments),
            d = a)
        }
    }
    var e = jQuery;
    VCOM = window.VCOM || (window.VCOM = {});
    VCOM._challengePlugins = VCOM._challengePlugins || [];
    VCOM._challengePlugins.push(function() {
        function b(a) {
            var b = Math.min(250, d.width() / 2) * (window.devicePixelRatio || 1);
            b = 250 > b ? 250 : 400 > b ? 400 : 800;
            800 > b && a.find(".choices a").each(function() {
                var a = e(this)
                  , c = a.css("background-image");
                c && c.endsWith('.jpg")') && a.css("background-image", c.substring(0, c.length - 2) + "?w\x3d" + b + '")')
            });
            return a
        }
        var c = this;
        this.slideTypes = e.extend(this.slideTypes, {
            question: {
                renderSlot: function(a) {
                    if (a && a.code) {
                        var c = a.code;
                        var d = {}, f, l = 0, m, p = 0, q, r = "", h = String.fromCharCode, n = c.length;
                        for (f = 0; 64 > f; f++)
                            d["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f)] = f;
                        for (m = 0; m < n; m++)
                            for (f = d[c.charAt(m)],
                            l = (l << 6) + f,
                            p += 6; 8 <= p; )
                                ((q = l >>> (p -= 8) & 255) || m < n - 2) && (r += h(q));
                        c = decodeURIComponent(escape(r));
                        delete a.code;
                        c = e(c).addClass("audio-enabled").data("slot", a);
                        return "I" == a.type ? b(c) : c
                    }
                },
                activate: function(a, b) {
                    return "T" == b.type ? x.call(this, a, b) : u.call(this, a, b)
                }
            },
            welcome: {
                renderSlot: A,
                activate: t
            },
            listsmastered: {
                renderSlot: z,
                activate: t
            },
            practicecomplete: {
                renderSlot: function(a) {
                    a.terminal = !0;
                    var b = e('\x3cdiv class\x3d"challenge-slide summary" data-slide-type\x3d"interstitial" data-terminal\x3d"true" \x3e\x3c/div\x3e').data({
                        slot: a
                    });
                    Module.after("vcom/challenge/practiceComplete", function() {
                        b.html(modules.vcom.challenge.practiceComplete(c));
                        VCOM.parse(b)
                    });
                    return b
                },
                activate: t
            }
        });
        var d = this.element;
        d.one("challenge.resume", function() {
            d.find(".vcom_questionRater, form.questionRater").remove();
            d.find(".question.rating_inprog").show().removeClass(".rating_inprog")
        });
        d.on("challenge.nextQuestion", function(a) {
            d.find(".vcom_questionRater").remove();
            if ((a = a.slide) && a.hasClass("active")) {
                var b = a.find(".question");
                e('\x3ca class\x3d"vcom_questionRater" href\x3d"javascript:void(0)"\x3eImprove this question\x3c/a\x3e').appendTo(b).on("click", function() {
                    Module.after("vcom/challenge/questionrater", function() {
                        modules.vcom.challenge.questionrater.rateQuestion(b).then(function() {
                            d.focus()
                        })
                    });
                    return !1
                })
            }
        })
    })
});
