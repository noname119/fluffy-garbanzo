var router = require("express").Router()

const path = require("path")
const csurf = require("csurf")

const user = require(path.join(global.rboxlo.root, "websites", "eclipse", "lib", "user"))

var csrf = csurf({ cookie: true })

// It sounds so beautiful

router.post("/create", user.loggedOut, csrf, (req, res) => {
    user.createAccount(req.body, req.rboxlo.ip, true).then(async (response) => {
        if (response.success) {
            req.session.user = await user.getNecessarySessionInfoForUser(response.id)
            res.redirect("/my/dashboard")
        } else {
            let objects = {
                form: {username: {invalid: false}, email: {invalid: false}, password1: {invalid: false}, password2: {invalid: false}}
            }
            objects.csrf = req.csrfToken()
    
            for (const [target, value] of Object.entries(response.targets)) {
                objects.form[target].invalid = true
                objects.form[target].message = value
            }
    
            res.render(
                "account/create",
                {
                    page: {
                        title: "Register",
                        register: true
                    },
                    objects: objects
                }
            )
        }
    })
})

router.get("/create", user.loggedOut, csrf, (req, res) => {
    res.render("account/create", { page: { title: "Register", register: true }, objects: { csrf: req.csrfToken() } })
})

router.post("/login", user.loggedOut, csrf, async (req, res) => {
    let information = req.body
    let out = {
        page: {
            title: "Login",
            login: true
        },
        objects: {
            form: {
                username: { invalid: false },
                password: { invalid: false }
            },
            csrf: req.csrfToken()
        }
    }

    var stop = false
    var rememberMe = (information.rememberMe && information.rememberMe.length != 0 && information.rememberMe.toLowerCase() == "true")

    if (await user.needsAuthenticationChallenge(req.rboxlo.ip)) {
        if (!information.captcha || information.captcha.length == 0) {
            out.objects.form.captcha = "Please solve the captcha challenge."
        }

        if (!out.objects.form.captcha) {
            if (!user.verifyCaptcha(information.captcha)) {
                out.objects.form.captcha = "You failed to solve the captcha challenge. Please try again."
            }
        }
        stop = (out.objects.form.captcha !== undefined)
    }
    
    // CAPTCHA IS BROKEN THIS IS A SHORT TERM FIX
    // TODO TODO TODO
    stop = false
    delete out.objects.form.captcha
    // OK CONTINUE!

    if (!stop) {
        user.authenticate(information, req.rboxlo.ip, req.headers["user-agent"], 3, rememberMe, true, true, true).then(async (response) => {
            if (response.success) {
                if (rememberMe) {
                    res.cookie("remember_me", user.formatLongTermSession(response.longTermSession.selector, response.longTermSession.validator), {
                        maxAge: (response.longTermSession.expires * 1000), // something like that.
                        httpOnly: true
                    })
                }
                
                req.session.user = (await user.getNecessarySessionInfoForUser(response.id))
                res.redirect(req.session.redirect !== undefined ? req.session.redirect : "/my/dashboard")

                delete req.session.redirect
            } else {
                for (const [target, value] of Object.entries(response.targets)) {
                    out.objects.form[target].invalid = true
                    out.objects.form[target].message = value
                }

                delete req.session.redirect // WTF IS THIS SYNTAX
                res.render("account/login", out)
            }
        })
    } else {
        res.render("account/login", out)
    }
})

router.get("/login", user.loggedOut, csrf, async (req, res) => {
    let out = { page: { title: "Login", login: true }, objects: { csrf: req.csrfToken() } }
    if (await user.needsAuthenticationChallenge(req.rboxlo.ip)) {
        out.objects = { challenge: true }
    }

    res.render("account/login", out)
})

// This method is not barred
router.get("/logout", (req, res) => {
    if (req.session.hasOwnProperty("user")) {
        delete req.session.user
    }

    if (req.cookies.remember_me) {
        res.clearCookie("remember_me")
    }

    res.redirect("/account/login")
})

module.exports = router