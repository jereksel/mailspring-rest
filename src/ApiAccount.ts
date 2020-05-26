export class ApiAccount {

    emailAddress: string
    name: string
    imap_host: string
    imap_port: number
    imap_username: string
    imap_password: string
    smtp_host: string
    smtp_port: number
    smtp_username: string
    smtp_password: string

    constructor(args) {
        this.emailAddress = getParameter(args, "emailAddress")
        this.name = getParameter(args, "name")
        this.imap_host = getParameter(args, "imap_host")
        this.imap_port = getParameter(args, "imap_port")
        this.imap_username = getParameter(args, "imap_username")
        this.imap_password = getParameter(args, "imap_password")

        this.smtp_host = getParameter(args, "smtp_host")
        this.smtp_port = getParameter(args, "smtp_port")
        this.smtp_username = getParameter(args, "smtp_username")
        this.smtp_password = getParameter(args, "smtp_password")
    }

    toMailspring(): MailAccount {
        return new window.$m.Account({
            emailAddress: this.emailAddress,
            name: this.name,
            label: this.emailAddress,
            provider: "imap",
            settings: {
                imap_allow_insecure_ssl: false,
                imap_host: this.imap_host,
                imap_port: this.imap_port,
                imap_security: "SSL / TLS",
                imap_username: this.imap_username,
                imap_password: this.imap_password,
                
                smtp_allow_insecure_ssl: false,
                smtp_host: this.smtp_host,
                smtp_port: this.smtp_port,
                smtp_security: "SSL / TLS",
                smtp_username: this.smtp_username,
                smtp_password: this.smtp_password,
            }
        })
    }

}

function getParameter(args, parameterName: string) {
    return args[parameterName] || throwError(parameterName)
}

function throwError(parameterName: string) {
    throw `Parameter ${parameterName} not set`
}