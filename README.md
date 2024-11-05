[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT license.

# Overview

EventVerse is a decentralized application (DApp) leveraging blockchain technology and smart contracts to streamline the creation of events and ticketing.
This DApp offers users a reliable and efficient solution for managing their events.
It also offers a user-friendly platform that ensures the accurate management of ticket sales while maintaining the highest standards of security and privacy.

# Project Structure

# Software Requirements:

>**Note**: It is necessary to download the following desktop applications for your Windows, Mac, or Linux OS.

1. [Git](https://git-scm.com/downloads)

2. [Node.js](https://nodejs.org/en/download/package-manager)

3. [MongoDB](https://www.mongodb.com/try/download/community)

4. [Ganache](https://archive.trufflesuite.com/ganache/)

6. [MetaMask](https://MetaMask.io/download/)

# Setup Installation:

### Step 1. Clone the Repository

Open a new terminal, and run the following commands step-by-step:

```bash
    $ cd Desktop
    $ git clone https://github.com/Dennis-Maigua/eventverse.git
```

### Step 2. Install Packages & Dependencies

Open another terminal separately, and install all the requirements for the project.

- Terminal 1 (Backend):

```bash
    $ cd Desktop/eventverse/server
    $ npm i
```

- Terminal 2 (Frontend):

```bash
    $ cd Desktop/eventverse/client
    $ npm i
```

### Step 3. Connect Ganache to MetaMask & Project

- Open Ganache in your local desktop, and click `New Workspace (Ethereum)`.

- Click `Add Project`, select the `truffle.config.js` file from your project folder, then click `Open` >> `Start`.

- Choose any `Address` below the first one, click on its `key` and copy the `Private Key`.

- Open MetaMask extension in your Browser, click `Import an Existing Account`, and enter the `12-word phrase/mnemonic` displayed on Ganache in the `Accounts` tab.

- Click `Ethereum Mainnet` >> `+ Add network` >> `Add a network manually`.

- Enter Network name: `Ganache`, New RPC URL: `HTTP://127.0.0.1:7545`, Chain ID: `1337`, Currency symbol: `ETH`, then click `Save` >> `Switch to Ganache`. 

- Install and open MetaMask extension in another Browser, click `Create a New Wallet`, then repeat the above two steps immediately before this one.

- Click `Account 1` >> `+ Add account or hardware wallet` >> `Import account`.

- Finally, paste in the Private Key that you had previously copied from Ganache, then click `Import`.

>**Note**: Do not close Ganache from this point onwards, otherwise it will reset everything and you will have to repeat this process again manually. However, you can close it when you are done with the project.

### Step 4. Compile & Deploy Smart Contracts

Go back to `Terminal 2` above, and run the commands below:

```bash
    $ truffle compile
    $ truffle migrate --network development

    # in case of contracts/migrations file changes. if not, skip this commands
    $ truffle compile
    $ truffle migrate --reset
```

>**Note**: If you close or exit Ganache, repeat the above steps 3 and 4 only before restarting the project.

# Usage

### Step 5. Run the Project

Start the `client` and `server` in both terminals.

- Terminal 1 and 2:

```bash
    $ npm start
```

>**Note**: If everything is set up correctly, you should see the web application running smoothly in your Web Browser provided you have all the requirements needed.
   
# Contributing:

We welcome contributions from developers, IT experts, and technology enthusiasts. Feel free to fork the repository, make improvements, and submit pull requests.
