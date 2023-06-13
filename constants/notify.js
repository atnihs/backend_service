const TYPE = {
    SYSTEM: 'system',
    ADVERTISEMENT: 'advertisement',
    TRANSACTION: 'transaction'
}

const SEND_TO = {
    ALL: 1,
    USERS: 2
}

const ACTION = {
    OPEN_URL: 1,
    WEB_VIEW: 2,
    GOTO_SCREEN: 3,
    ON_APP_MODAL: 4,
}

module.exports = {
    TYPE,
    SEND_TO,
    ACTION
}