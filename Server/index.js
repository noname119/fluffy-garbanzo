const express = require("express")
const path = require("path")
const vhost = require("vhost")

const manifest = require(path.join(__dirname, "websites", "manifest.json"))
const util = require(path.join(__dirname, "util"))

const magic = "INDEX"

global.rboxlo = {}

let app = express()
let hosting = []

if (!process.env.DOCKER) {
    // This is an unmentioned, undocumented environment override. Debugging only
    if (!process.env.SERVER_OVERRIDE_DOCKER) {
        console.log("Not running in Docker, exiting...")
        process.exit(1)
    }

    // Person isn't running in Docker and they're overriding the check.
    // They must be debugging. If they aren't, they're stupid.
    // Will consume all host environment variables into global.rboxlo.env.

    require("dotenv").config({
        path: require("path").join(__dirname, "..", ".env")
    })
}

// Set environment variables to a table named global.rboxlo.env
// These are separate from process.env as they are parsed for booleans, and are cached; accessing process.env directly blocks for each call
global.rboxlo.env = {}
let keys = Object.keys(process.env)

for (let i = 0; i < keys.length; i++) {
    let value = process.env[keys[i]]
    
    if (value.toLowerCase() == "false") {
        value = false
    } else if (value.toLowerCase() == "true") {
        value = true
    }
    
    global.rboxlo.env[keys[i]] = value
}

// Set root
global.rboxlo.root = __dirname

// Set Node debugging variables
process.env.NODE_ENV = (global.rboxlo.env.PRODUCTION ? "production" : "development")
if (!global.rboxlo.env.PRODUCTION) process.env.DEBUG = "express:*"

// Autoload websites
for (const [name, website] of Object.entries(manifest)) {
    for (let i = 0; i < website.domains.length; i++) {
        let domain = (website.domains[i] === magic ? "" : website.domains[i].toLowerCase())

        if (hosting.includes(domain)) {
            throw `Duplicate vhost was found for website "${name}", vhost was "${domain}"`
        }

        hosting.push(domain)
        app.use(vhost(`${domain}${domain == "" ? "" : "."}${global.rboxlo.env.SERVER_DOMAIN}`, require(path.join(__dirname, website.entrypoint)).app))
    }
}

// Autoload services

// Boot everything up
// 1: Website master server
app.listen(global.rboxlo.env.SERVER_PORT, () => {
    console.log(`Running ${util.titlecase(global.rboxlo.env.NAME)} on port ${global.rboxlo.env.SERVER_PORT}`)
})

// 2: Services (Okra, etc.)
// TODO