import { remote, MessageBoxOptions } from "electron";

const oldEval = window.eval
window.eval = () => { }

import Koa from 'koa'
import * as _ from 'koa-route'
import bodyParser from 'koa-bodyparser';
import { finalizeAndValidateAccount } from "./onboarding-helpers";
import { ApiAccount } from "./ApiAccount";

window.eval = oldEval

export namespace Main {

    export function activate() {
        const menu = AppEnv.menu.template
        const developerMenu = menu.find(item => item.id === "Developer")
        developerMenu.submenu.push({
            type: 'separator'
        })
        developerMenu.submenu.push({
            label: 'Enable REST API',
            command: "rest-api:activate"
        })

        AppEnv.menu.template = menu
        AppEnv.menu.update()

        AppEnv.commands.add(document.body, "rest-api:activate", () => {
            handleCallback()
        })

        console.log(window.$m)

    }

    export function deactive() {

    }

    async function handleCallback() {

        const app = new Koa();
        app.use(bodyParser());
        app.use(_.put("/", async (ctx: Koa.Context) => {

            try {
                const jsonAccount = new ApiAccount(ctx.request.body)
                const account = jsonAccount.toMailspring()
                await finalizeAndValidateAccount(account)
                window.$m.AccountStore.addAccount(account)
                ctx.body = { "error": 0 }
            } catch (e) {
                const errorMessage = e.message || e
                console.log(`Cannot create account: ${errorMessage}`)
                ctx.status = 400
                ctx.body = { "error": 1, "description": errorMessage }
            }

        }))

        const server = app.listen(3000)

        try {

            await asyncMessageBox({
                title: "REST API",
                message: `REST API is enabled.`,
                buttons: ["Stop"],
                type: "info"
            });

        } finally {
            server.close()
        }
    }

    async function asyncMessageBox(options: MessageBoxOptions): Promise<number> {
        return new Promise((resolve) => {
            remote.dialog.showMessageBox(options, (number) => {
                resolve(number)
            })
        });
    }
}