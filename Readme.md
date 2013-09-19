## Simple Journal

This is a small server I use for writing a journal. It has the following features:

 * Password Protected
 * Can add your current location
 * Can add current weather conditions (based on location)
 * Can add long-form text.
 * Each entry is saved as a JSON File.

## Prerequisites

This program works with [Forecast.io](https://developer.forecast.io/), so you'll need a free API key to get this properly running.

## Install

```sh
#install dependencies
npm install commander express hbs

#generate keys - when asked for a name, type the URL it will be served from
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

#configure the server
echo '{"password": "YOUR-PASSWORD", "forecastApi": "YOUR-API-KEY"}' >> config.json

#run the server
node main.js -p [YOUR-PORT]
```

## Trust the Keys
Make sure that once you have generated the "cert.pem" certificate file, you double click it in OSX or open it in iOS in order to add it to the list of trusted certificates. This will make the scary warning in browsers go away.

Note that this will only work if you have added the correct "name" to the certificate, which should be asked when you generate it with openssl. The name must be set to the URL from which it will be served, i.e.: mysite.com (no port is necessary).

## Screenshots

![Log In](/screenshots/login.png "Log In") ![Access Denied](/screenshots/denied.png "Access Denied") ![Journal](/screenshots/main.png "Journal") ![Complete](/screenshots/posted.png "Complete")

## Security

Please note - this is not necessarily secure! It uses HTTPS with your own key to encrypt traffic, so it should be safe from man-in-the-middle (so long as you get your computers to trust the certificate prior to use). However, it stores the password in plaintext on each client that logs in, meaning it is not safe for use on computers that you do not own.

It is intended for use with very personal devices, such as your phone, where you would like to remain logged in anyway.

A user that has your password can flood your disk with false entries, but cannot delete entries you have written.
