# Changelly x CoolBitX

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Now hosted on [GitHub page](https://coolbitx-technology.github.io/changelly-log/).

## Usage

Search Changelly transaction by ID, or use filter to search through all transactions created by CoolBitX.

![changelly](https://i.imgur.com/SqLPLz3.png)

### Search by ID

Put in changelly id (12-char-long) and get transactino status. Possible status (reference: [Changelly API](https://github.com/changelly/api-changelly)) :

|**Status**|**Description**|
|----------|---------------|
|waiting|Transaction is waiting for an incoming payment.|
|confirming|We have received payin and are waiting for certain amount of confirmations depending of incoming currency.|
|exchanging|Payment was confirmed and is being exchanged.|
|sending|Coins are being sent to the recipient address.|
|finished|Coins were successfully sent to the recipient address.|
|failed|Transaction has failed. In most cases, the amount was less than the minimum. Please contact support and provide a transaction id.|
|refunded|Exchange failed and coins were refunded to user's wallet. The wallet address should be provided by user.|
|overdue|We did not receive any payment since 36 hours from transaction creation.|
|hold|Due to AML/KYC procedure, exchange may be delayed|
|expired|In case payin was not sent within the indicated timeframe|

### Search by filter

Filter all transaction generated with CoolBitX's Changelly key.

## Deployment

Push commit to `master` branch to automatically deploy to GitHub page. 