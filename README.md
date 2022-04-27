[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# Accord

A Real Time Chat Application built using Node.js, Express, Mongoose, Socket.io, Peerjs.

## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

## Index

- [Features](#features)
- [Installation](#installation)
- [Todo](#todo)
- [Support](#support)
- [Contribute](#contribute)
- [License](#license)

## Features<a name="features"></a>

- Uses Express as the application Framework.
- Manages Authentication using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package.
- Authenticates via email and password.
- Passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt) package.
- Real-time communication between a client and a server using [Socket.io](https://github.com/socketio/socket.io).
- Uses [MongoDB](https://github.com/mongodb/mongo), [Mongoose](https://github.com/Automattic/mongoose) for storing and querying data.

  ### Users

  - Signup, Login.
  - Change Profile Image.
  - Change Password, Reset Password.
  - Delete your account.

  ### Servers

  - Create your own Servers like discord.
  - User can join & leave the Server.
  - Author can fully manage his Servers.

  ### Channels

  - Create multiple voice & text Channels in a Server.
  - Chat with your friends in the Server of your choice.
  - Group voice chat by creating Voice Channels.
  - Only Server author can Create & Delete Channels.

  ### Messages

  - Enjoy group chat with your friends by sending real-time chat messages.
  - Edit & Delete messages.
  - Reply to a specific message.

## Installation<a name="installation"></a>

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/SelinJodhani/Accord
    $ cd Accord
    $ npm install

## Configure app

Open `./.env` then edit it with your settings. You will need:

- MONGO_CONNECTION_STRING;
- JWT_SECRET;
- JWT_EXPIRES_IN;

## Running the project

    $ npm start

## Simple build for production

    $ npm build

## Todo<a name="todo"></a>

- [ ] Unfriend a friend
- [ ] Implementation of socket for receiving real-time friend requests

### Done ✓

- [x] Sending friend requests
- [x] Accepting/Rejecting friend request
- [x] Cancel friend request
- [x] Private chat with your friends

## Support <a name="support"></a>

I've written this script in my free time during my studies. If you find it useful, please support the project by spreading the word.

## Contribute <a name="contribute"></a>

Contribute by creating new issues, sending pull requests on Github or you can send an email at: jodhaniselin.sj@gmail.com

## License <a name="license"></a>

Built under [MIT](http://www.opensource.org/licenses/mit-license.php) license.
