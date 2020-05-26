interface IAppEnv {
    getLoadSettings(): any;
    menu: IMenu
    commands: CommandRegistry
}

interface IMenu {
    update(): void;
    template: IMenuItem[]
}

type IMenuItem = {
    label?: string;
    submenu?: IMenuItem[];
    type?: 'separator';

    id?: string; //unlocalized label
    command?: string;
    enabled?: boolean;
    hideWhenDisabled?: boolean;
    visible?: boolean;
};

declare var AppEnv: IAppEnv;

type CommandCallback = (event: CustomEvent) => void;

interface CommandRegistry {
  add(
    target: Element,
    commandName: string | { [command: string]: CommandCallback },
    callback?: CommandCallback
  ) : void 

}

interface MailAccount {
  new (args): MailAccount
}

interface MailspringExports {
  AccountStore: any;
  IdentityStore: any;
  MailsyncProcess: any;
  Account: MailAccount
}

interface Window {
  $m: MailspringExports
}