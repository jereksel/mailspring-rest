import crypto from 'crypto';

function idForAccount(emailAddress: string, connectionSettings) {
    // changing your connection security settings / ports shouldn't blow
    // away everything and trash your metadata. Just look at critiical fields.
    // (Me adding more connection settings fields shouldn't break account Ids either!)
    const settingsThatCouldChangeMailContents = {
        imap_username: connectionSettings.imap_username,
        imap_host: connectionSettings.imap_host,
        smtp_username: connectionSettings.smtp_username,
        smtp_host: connectionSettings.smtp_host,
    };

    const idString = `${emailAddress}${JSON.stringify(settingsThatCouldChangeMailContents)}`;
    return crypto
        .createHash('sha256')
        .update(idString, 'utf8')
        .digest('hex')
        .substr(0, 8);
}

// export async function finalizeAndValidateAccount(account: Account) {
export async function finalizeAndValidateAccount(account) {
    if (account.settings.imap_host) {
        account.settings.imap_host = account.settings.imap_host.trim();
    }
    if (account.settings.smtp_host) {
        account.settings.smtp_host = account.settings.smtp_host.trim();
    }

    account.id = idForAccount(account.emailAddress, account.settings);

    // handle special case for exchange/outlook/hotmail username field
    // TODO BG: I don't think this line is in use but not 100% sure
    (account.settings as any).username =
        (account.settings as any).username || (account.settings as any).email;

    if (account.settings.imap_port) {
        account.settings.imap_port /= 1;
    }
    if (account.settings.smtp_port) {
        account.settings.smtp_port /= 1;
    }
    if (account.label && account.label.includes('@')) {
        account.label = account.emailAddress;
    }

    // Test connections to IMAP and SMTP
    const proc = new window.$m.MailsyncProcess(AppEnv.getLoadSettings());
    proc.identity = window.$m.IdentityStore.identity();
    proc.account = account;
    await proc.test();

    // Record the date of successful auth
    account.authedAt = new Date();
    return account;
}