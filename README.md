# Mailspring REST plugin

This plugin adds simple REST API for adding new accounts

## How to install
https://github.com/Foundry376/Mailspring-Plugin-Starter#building-a-plugin

## How to start

Open menu -> Developer -> Enable REST API

## Server documentation

Server creates one endpoint `PUT /` that expects following body with account data:

```
{
        "emailAddress": string,
        "name": string,
        "imap_host": string,
        "imap_port": number,
        "imap_username": string,
        "imap_password": string,
        "smtp_password": string,
        "smtp_host": string,
        "smtp_port": number,
        "smtp_username": string
}
```