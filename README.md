<!--Put badges at the very top -->
<!--change the repos -->
<!--change the tracking number -->
<!-- [![Build Status](https://travis-ci.org/IBM/watson-banking-chatbot.svg?branch=master)](https://travis-ci.org/IBM/watson-banking-chatbot) -->

<!--Add a new Title and fill in the blanks -->
# Implement Asset Securitization on a Blockchain Ledger

In this Code Pattern, we'll demonstrate how to simulate a securitization process using React.js, Hyperledger Fabric Node SDK, and an IBM Blockchain service instance.

Securitization is a financial process that can be used to consolidate a set of illquid assets into a set of tradable securities. A common example of an illquid asset would be a home mortgage, as they cannot be readily bought and sold. An example of a tradable asset can be a stock or bond. This process can be useful for financial institutions that are looking to increase the liquidity of their assets and free up capital. This application provides a dashboard that'll allow users to create and view the relationship between Assets, Pools, Investors, and Securities.

When the reader has completed this Code Pattern, they will understand how to:

* Deploy a Hyperledger Blockchain network on IBM Cloud
* Create and enroll a administrative client using the Hyperledger Node SDK
* Deploy and Instantiate a set of smart contracts to handle transactions and pool assets

<!--Remember to dump an image in this path-->
<p align="center">
<img src="./readme-images/arch-flow-securitization.png"  />
</p>

## Flow
<!--Add new flow steps based on the architecture diagram-->
<!-- 1. Upload and Instantiate smart contracts via the Bluemix Network Monitor
2. Deploy the node application locally or on bluemix
3. Input connection information such as service credentials, endpoint, etc into configuration form
4. Submitting form sends a request to pull a json file containing the connection profile. The information from this profile is used to create a "monitoring" client with administrative privileges

5. If form data is valid, user should be able to execute Chaincode operations, view individual blocks and their data, and request state of registered Assets -->

1. A homebuyer leverages the services of a Loan Originator to secure financing for a home mortgage

2. The Loan Originator loads the application, and submits requests to update the Blockchain ledger state with a new Asset

This request is handled by the node.js Express backend formats CRUD request into a [jsonrpc](http://www.jsonrpc.org/specification#examples) object like below, and submits it to a Hyperledger peer as a transaction proposal. The request below would register a mortgage with a value of $540000, an interest rate of 3.3%, and a credit score of 720. The credit score is used to calculate risk for potential investors.
```
{
    jsonrpc: '2.0',
    method: 'invoke',
    params: {
        type: 1,
        chaincodeID: {
            name: 'securitization_contracts'
        },
        ctorMsg: {
            function: 'init_asset',
            args: '["asset1" , "540000", "0.033", "720"]'
        },
        secureContext: 'kkbankol@us.ibm.com'
    },
    id: 5
}
```
<!-- 3. Fabric Node SDK submits CRUD request to Hyperledger peer as a transaction proposal -->

3. Peer uses an "endorsement" service to simulate the proposed transaction against the relevant smart contracts. This endorsement service is used to confirm that the transaction is possible given the current state of the ledger. Examples of invalid proposals might be creating an asset that already exists, querying the state of an asset that does not exist, etc.
<!-- to simulate the transaction request against smart contracts and the current ledger state -->

4. If the simulation is successful, the proposal is then "signed" by the peer's endorser.

5. The signed transaction is forwarded to an ordering service, which executes the transaction. In this case, the newly created "Asset" would be placed in an "Asset Pool"

6. The updated state is commited to the blockchain ledger

7. The Securitization UI queries the updated ledger state and renders tables with the updated information

8. If the Asset Pool has been split up into "Securities", an investor has the ability to buy and sell them. The security price should be updated every time there is a change to the ledger state

9. A creditor checks the ledger state to determine the risk of losses by late payments or mortgages going into default. If a significant change is found, the security credit rating will be recalculated by the creditor and updated in the ledger.
<!-- The response is sent back to the Monitoring UI and printed in the "Response Payloads" view.  to show latest blockchain transactions -->

<!-- TODO expand on this -->

## Install Prerequisites:
### IBM Cloud CLI
To interact with the hosted offerings, the IBM Cloud CLI will need to be installed beforehand. The latest CLI releases can be found at the link [here](https://console.bluemix.net/docs/cli/reference/bluemix_cli/download_cli.html#download_install). An install script is maintained at the mentioned link, which can be executed with one of the following commands

```
# Mac OSX
curl -fsSL https://clis.ng.bluemix.net/install/osx | sh

# Linux
curl -fsSL https://clis.ng.bluemix.net/install/linux | sh

# Powershell
iex(New-Object Net.WebClient).DownloadString('https://clis.ng.bluemix.net/install/powershell')
```
After installation is complete, confirm the CLI is working by printing the version like so
```
bx -v
```

### Node.js packages
If expecting to run this application locally, please continue by installing [Node.js](https://nodejs.org/en/) runtime and NPM. Currently the Hyperledger Fabric SDK only appears to work with node v8.9.0+, but [is not yet supported](https://github.com/hyperledger/fabric-sdk-node#build-and-test) on node v9.0+. If your system requires newer versions of node for other projects, we'd suggest using [nvm](https://github.com/creationix/nvm) to easily switch between node versions. We did so with the following commands
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# Place next three lines in ~/.bash_profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v8.9.0
nvm use 8.9.0
```

To run the Securitization UI locally, we'll need to install a few node libraries which are listed in our `package.json` file.
- [React.js](https://reactjs.org/): Used to simplify the generation of front-end components
- [MQTT](http://mqtt.org/): Client package to subscribe to Watson IoT Platform and handle incoming messages
- [Hyperledger Fabric SDK](https://fabric-sdk-node.github.io/): Enables backend to connect to IBM Blockchain service

<!--Update this section-->
## Included components
* [IBM Blockchain](https://console.bluemix.net/catalog/services/blockchain)

<!--Update this section-->
## Featured technologies
<!-- Select components from [here](https://github.ibm.com/developer-journeys/journey-docs/tree/master/_content/dev#technologies), copy and paste the raw text for ease -->
* [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-1.1/)
* [Hyperledger Node.js SDK](https://github.com/hyperledger/fabric-sdk-node)
* [NPM](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en/)
* [React.js](https://reactjs.org/)

<!--Update this section when the video is created-->
<!-- # Watch the Video
In progress

https://www.youtube.com/watch?v=DYvdN_p_Ldk

https://www.youtube.com/watch?v=Mw6924hCAIc -->


# Steps
There are two methods we can use to deploy the application, either run everything locally on your development machine, *OR* initialize a hosted blockchain service and run in IBM Cloud. These seperate steps are labeled as **local** or **hosted**, respectively
1. [Clone repository](#1-clone-the-repository)
2. [Setup repository codebase locally](#2-deploy-application-locally) OR [Deploy to IBM Cloud](#2-deploy-application-to-ibm-cloud)
3. [Create Watson services with IBM Cloud](#3-create-services)
4. [Upload and Instantiate Chaincode](#4-upload-and-instantiate-chaincode)
5. [Start the Application](#5-run-the-application)
6. [Retrieve service credentials](#6-obtain-service-credentials)
7. [Configure and run the application](#7-ui-configuration)

## 1. Clone the repository

Clone the `securitization_blockchain` project locally. In a terminal, run:

```
git clone github.com/IBM/securitization_blockchain
```

## 2. Deploy Application (**local**)
Install the Securitization UI node packages by running `npm install` in the project root directory and in the [react-backend](sc-ui/react-backend) directory. Both `python` and `build-essential` are required for these dependencies to install properly:
```
# install react dependencies
cd sc-ui
npm install
npm run build

# install express/hyperledger dependencies
cd react-backend
npm install

# return to the root project directory
cd ../../
```

As an alternative to installing these additional dependencies on your system, you can build the application and dependencies in a docker container like so
```
docker build -t securitization_blockchain .
```

<!-- Finally, run the application
```
cd sc-ui
npm start | PORT=3001 node react-backend/bin/www
``` -->

<!-- ### Docker setup (optional)
If you have Docker installed, you can install these dependencies in a virtual container instead. Run the application with the following commands, and then skip to [Step 5](#5-configure-credentials)
```
docker build -t monitoring_ui .
docker run -d -p 8081:8081 monitoring_ui
``` -->

> NOTE: These steps are only needed when running locally instead of using the ``Deploy to IBM Cloud`` button.

<!-- there are MANY updates necessary here, just screenshots where appropriate -->

## 2. Deploy Application (**hosted**)

[![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM/securitization_blockchain.git&branch=master)

1. We can deploy the application to IBM Cloud, by either leveraging the "Deploy to IBM Cloud" button directly above, or by using the IBM Cloud CLI. Ensure the cli is installed using the prerequisites section above, and then run the following command to deploy the application
```
# Log in using IBM Cloud credentials
bx login

# Push application to IBM Cloud
bx cf push blockchain-securitization --random-route
```

2. To see the app and services created and configured for this Code Pattern, use the IBM Cloud dashboard, or run `bx cf apps` and `bx cf services` in the terminal. The app should be named `securitization-blockchain` with a unique suffix.


## 3. Create Services (**hosted**)

Next, we'll need to deploy our service instances using the IBM Cloud dashboard. This step is only required if you're not deploying the application locally. If you are running everything locally, please skip ahead to the "Local Hyperledger Installation" in step 4

### Blockchain

The IBM Blockchain service can be found by logging in to the IBM Cloud [dashboard](https://console.bluemix.net/), selecting the "Catalog" button, searching for "Blockchain", and clicking on the resulting icon. Or click this [*link*](https://console.bluemix.net/catalog/services/blockchain).

<p align="center">
<img src="https://i.imgur.com/qWQOXq5.png"  data-canonical-src="https://i.imgur.com/qWQOXq5.png">
</p>

After selecting the blockchain icon, a form will be presented for configuring the service name, region, and pricing plan. The default values for these fields can be left as is. Also, be sure that the free pricing tier is selected, which is titled "Starter Membership Plan". If you are using an IBM Cloud Lite account, this plan can be used for free for up to 30 days. After validating that the information in the form is correct, scroll down and click the "Create" button in the lower right corner
<p align="center">
<img src="https://i.imgur.com/ROAjOzr.png"  data-canonical-src="https://i.imgur.com/ROAjOzr.png">
</p>

<!-- Provision the following services:
* [**IBM Blockchain**](https://console.bluemix.net/catalog/services/blockchain)
* [**Watson IoT Platform**](https://console.bluemix.net/catalog/services/internet-of-things-platform) -->

<!-- If you're deploying the application via the "Delivery Pipeline" on IBM Cloud, these services should be created automatically.

If you're manually deploying the application and services, -->

## 4. Upload and Instantiate Chaincode
"Smart contracts", commonly referred to as "Chaincode", can be used to execute business logic and validate incoming requests. In this context, the contracts are used to initialize all participants of the securitization process, define their relationships, and verify transactions. These contracts can be hosted either on IBM Cloud or on a local Hyperledger network managed by Docker.

### IBM Cloud Hosted Hyperledger (**hosted**)
To begin the process of uploading the smart contracts to the hosted blockchain service, we can start by opening the IBM Cloud dashboard, selecting your provisioned Blockchain service, and accessing the blockchain network monitor by clicking "Enter Monitor"
<p align="center">
<img src="https://i.imgur.com/BpUjPhe.png"  data-canonical-src="https://i.imgur.com/BpUjPhe.png" width="650" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Next, click the "Install code" option on the left hand menu, and then the "Install Chaincode" button on the right of the page
<p align="center">
<img src="https://i.imgur.com/HmdDsgm.png"  data-canonical-src="https://i.imgur.com/HmdDsgm.png" width="650" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Enter an id and a version (here we'll use "sec" and "v1"). Then, select the "Choose Files" button to upload the smart contracts, which are titled [lib.go](chaincode/src/lib.go), [read_ledger.go](chaincode/src/read_ledger.go), [write_ledger.go](chaincode/src/write_ledger.go), and [securitization.go](chaincode/src/securitization.go). These files are located in the `chaincode/src` directory of this project

<p align="center">
<img src="https://i.imgur.com/NJgMwPm.png"  data-canonical-src="https://i.imgur.com/NJgMwPm.png" width="650" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Finally, we'll need to Instantiate the chaincode. This can be done by opening the chaincode "Actions" menu and selecting "Instantiate". This will present a form where arguments can be provided to the chaincode `init` function. In this case, we'll just need to provide an integer (we used `"101"`) to the Arguments section, and then click "Next" and then "Submit"
<p align="center">
<img src="https://i.imgur.com/eh1Djmj.png"  data-canonical-src="https://i.imgur.com/eh1Djmj.png" width="450" height="450" style="margin-left: auto; margin-right: auto;">
</p>

### Hyperledger Network Setup (**local**)
<!-- If you're planning to make custom changes to the smart contracts, it may be faster to develop and test chaincode locally before pushing to a hosted service.  -->
As an alternative to the hosted IBM Blockchain service, we can deploy a local Hyperledger network using docker-compose like so

```
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples/chaincode-docker-devmode

# clear your previous network if it exists
docker-compose -f docker-compose-simple.yaml down

# start up a new local hyperledger network
docker-compose -f docker-compose-simple.yaml up
```
By default, this will stay open and aggregate the logs from the container. If you'd prefer it to run in headless mode, please add the `-d` flag to the command

In a separate tab, run the following commands from the *root directory* of this project to copy the chaincode files into the "chaincode" container, build the binary, and start the chaincode service. The last command will run as a daemon, and will not exit
```
docker exec -it chaincode mkdir -p securitization
docker cp ./chaincode/src/. chaincode:/opt/gopath/src/chaincode/securitization/
docker exec -it chaincode bash -c 'cd securitization && go build'
docker exec -it chaincode bash -c 'CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=sec:0 ./securitization/securitization'
```

In a third tab, run the following commands to install and instantiate the chaincode
```
docker exec cli peer chaincode install -p chaincodedev/chaincode/securitization -n sec -v 0
docker exec cli peer chaincode instantiate -n sec  -v 0 -c '{"Args":["101"]}' -C myc
```

Finally, run an invoke command to ensure the chaincode was installed successfully
```
docker exec cli peer chaincode invoke -n sec -c '{"Args":["read_everything"]}' -C myc
```


<!-- ### Manual installation
Otherwise, continue by installing [Node.js](https://nodejs.org/en/) runtime and NPM. Currently the Hyperledger Fabric SDK only appears to work with node v8.9.0+, but [is not yet supported](https://github.com/hyperledger/fabric-sdk-node#build-and-test) on node v9.0+. If your system requires newer versions of node for other projects, we'd suggest using [nvm](https://github.com/creationix/nvm) to easily switch between node versions. We did so with the following commands
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# Place next three lines in ~/.bash_profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v8.9.0
nvm use 8.9.0
```

Install the Monitoring UI node packages by running `npm install` in the project root directory and in the [react-backend](react-backend) directory. Both `python` and `build-essential` are required for these dependencies to install properly:
```
npm install
cd react-backend && npm install
```

Finally, compile the `bundle.js` file
```
cd public
npm run build
``` -->
<!-- Method	| Command	|Comment
--- | --- | ---
Filesystem | `npm run build` | The build command generates the bundle.js file in the public directory. </br>To access the Monitoring UI, go to the `monitoring_ui/public` directory and open the *index.html* file in a browser. -->

<!-- Launch the **Watson Conversation** tool. Use the **import** icon button on the right

Find the local version of [`data/conversation/workspaces/banking.json`](data/conversation/workspaces/banking.json) and select
**Import**. Find the **Workspace ID** by clicking on the context menu of the new
workspace and select **View details**. Save this ID for later.

*Optionally*, to view the conversation dialog select the workspace and choose the
**Dialog** tab, here's a snippet of the dialog: -->

## 5. Run the application (**local**)

1. Make sure the correct version of node is equipped
```
nvm use 8.9.0
```

2. Start the app locally
```
cd sc-ui
npm start | PORT=3001 node react-backend/bin/www
```

If you built the application using docker, then simply run
```
docker run -it -p 3000:3000 -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker:/usr/local/bin/docker securitization_blockchain bash -c 'cd /root/securitization_blockchain/sc-ui ; npm start | PORT=3001 node react-backend/bin/www'
```

<!-- This method is ideal for a development environment but not suitable for a production environment. TODO, this comment is from the original author, would like to understand why-->

2. To access the Securitization application, open the following URL in a browser: `http://localhost:3000/`
<!--Add a section that explains to the reader what typical output looks like, include screenshots -->
<!-- TODO, update dashboard view -->
<p align="center">
<img src="https://i.imgur.com/nljtWdf.png"  data-canonical-src="https://i.imgur.com/nljtWdf.png" width="750" height="450" style="margin-left: auto; margin-right: auto;">
</p>

<!--Include any troubleshooting tips (driver issues, etc)-->

## 6. Obtain service credentials (**hosted**)

This section is only necessary for working on the hosted IBM Cloud blockchain offering. If deploying locally, you can skip to step #7. The credentials for IBM Cloud Blockchain service can be found in the ``Services`` menu in IBM Cloud by selecting the ``Service Credentials`` option for each service. If using the local network,

The Blockchain credentials consist of the `key`, `secret`, and `network_id` parameters.
<!-- ![]("https://i.imgur.com/Qof7sve.png" width="250" height="400") -->
<p align="center">
<img src="https://i.imgur.com/Qof7sve.png"  data-canonical-src="https://i.imgur.com/Qof7sve.png" width="450" height="450" style="margin-left: auto; margin-right: auto;">
</p>

We'll also need to provide the Chaincode Id and Version, which is "sec" and "v1" in this example

The credentials will need to be entered in the configuration form, which can be opened by clicking the button in the upper right of the UI
<p align="center">
<img src="https://i.imgur.com/zsxkXHA.png" width="600" height="450" style="margin-left: auto; margin-right: auto;">
</p>

After submitting this form, the UI will fetch a "connection profile" json file, which contains all information needed by our hyperledger client to connect to the blockchain ledger.

Once the connection profile has been retrieved, a certificate will be generated to allow the application to make administrative requests. These elevated privileges are required to make calls to the chaincode service. This PEM encoded certificate will be output in the terminal logs like so. If deploying on IBM Cloud, this certificate can be found parsing the logs using `bx cf logs <app_name>`, or by opening the developer console in your browser  

<p align="center">
<img src="https://i.imgur.com/Z6WmX59.png" width="600" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Once the PEM certificate is generated, it can be copied and uploaded by visiting the printed url, or by revisiting the Blockchain Monitor, navigating to Members on the left hand menu, and then clicking "Certificates" and "Add Certificate"
<p align="center">
<img src="https://i.imgur.com/kx654rE.png" width="600" height="450" style="margin-left: auto; margin-right: auto;">
</p>


<!-- These credentials will need to be provided to the UI in the next step -->

<!-- We can obtain the Blockchain credentials by downloading

Copy the [`env.sample`](env.sample) to `.env`.

```
$ cp env.sample .env
```
Edit the `.env` file with the necessary settings.

#### `env.sample:`

```
# Replace the credentials here with your own.
# Rename this file to .env before starting the app.

# Watson conversation
CONVERSATION_USERNAME=<add_conversation_username>
CONVERSATION_PASSWORD=<add_conversation_password>
WORKSPACE_ID=<add_conversation_workspace>

# Watson Discovery
DISCOVERY_USERNAME=<add_discovery_username>
DISCOVERY_PASSWORD=<add_discovery_password>
DISCOVERY_ENVIRONMENT_ID=<add_discovery_environment>
DISCOVERY_COLLECTION_ID=<add_discovery_collection>

# Watson Natural Language Understanding
NATURAL_LANGUAGE_UNDERSTANDING_USERNAME=<add_nlu_username>
NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD=<add_nlu_password>

# Watson Tone Analyzer
TONE_ANALYZER_USERNAME=<add_tone_analyzer_username>
TONE_ANALYZER_PASSWORD=<add_tone_analyzer_password>

# Run locally on a non-default port (default is 3000)
# PORT=3000

``` -->

## 7. Application Configuration
<!-- TODO, reword this -->
The securitization flow generally occurs in the following format

1. A homebuyer will apply for financing of an asset via a loan "originator". The loan will have a balance, interest rate, monthly payment, and expected time period for payback (many mortgages are roughly 30 years). A total expected payoff amount will be generated based off this information as well.

2. Once the loan has been approved and processed, the loan originator then finances the asset, and transfers the debt to a "Special Purpose Vehicle", which is a entity that protects the assets even if the originator goes bankrupt.

3. The Asset is then placed into a "Pool" along with other assets. Once Assets have been placed into a pool, a set of "securities" can be generated to allow the pool to become tradable. Each Security can be bought and sold by investors, and has a "Yield" which determines the return each security holder will receive on their investment.

4. The Homebuyer submits payments towards their mortgage.

5. Each payment is split up and distributed amongst investors who own "securities" associated with the pool. When all mortgages in the pool are paid off, each investor should have received their original investment back plus the agreed "Yield" amount. Each payment will also have a processing fee which will be dispersed to the originator

This securitization process can be replicated with this application by visiting the dashboard and creating Originators, Assets, Pools, Securities, and Investors using the provided forms. Each form requests an unique id format with the name of the object type followed by an integer **asset1**, **pool123**, **security15**

First, we'll need to create a loan "Originator", which will require an ID, Processing Fee (percentage), and (optional) Company Name. This form can be loaded by selecting the "Create Originator" button. (Note: There is a known intermittent issue with this Originator creation process, so the initial submission may fail. If this occurs, please try submitting again)

<p align="center">
<img src="https://i.imgur.com/GrNQTyH.png" width="700" height="250" style="margin-left: auto; margin-right: auto;">
</p>

<p align="center">
<img src="https://i.imgur.com/QkGzhRj.png" width="350" height="250" style="margin-left: auto; margin-right: auto;">
</p>

Note that the Balance and Assets fields in the table are initially blank, but will be filled in as we associate assets with the originator. And as the originator receives processing fees and security sale proceeds, their Balance will increase as well

Next, we'll create an Asset, which will require an outstanding balance, interest rate, and a payment period, which defines how many monthly payments they'll need to pay off their entire balance. This can be done by scrolling directly down to the "Assets" Table, clicking the "Create New Asset" button.

<p align="center">
<img src="https://i.imgur.com/BG8JMsq.png" width="350" height="250" style="margin-left: auto; margin-right: auto;">
</p>

Once the Asset has been created, we can also link it to an originator using the "Transfer Asset" button
<p align="center">
<img src="https://i.imgur.com/N6PHrsr.png" width="350" height="250" style="margin-left: auto; margin-right: auto;">
</p>

The resulting table should then reflect the following
<p align="center">
<img src="https://i.imgur.com/ICd3Qt9.png" width="900" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Create an Asset Pool via the "Create Pool" form by providing an ID. We can also transfer our asset(s) to the pool using the "Transfer Asset" button in the Assets table

Create one or more "Securities". The create security form will require a ID, associated Asset Pool, and "Coupon Rate". The Coupon Rate defines the return on investment.

Finally, we can create our Investors, which have the ability to buy and sell securities. This can be done by clicking the "Create Investor" button and providing a unique id. Once the investor is created, we can then buy and sell securities using the respective buttons. So in this example, we'll do so by clicking the "Buy Security" button and providing the Security and Investor Id.

Now we can simulate a mortgage payment and view the corresponding payment distributions. We can do so by scrolling back up to the Assets table selecting the "Process Payment" view, and entering an Asset Id and Payment Amount.

<p align="center">
<img src="https://i.imgur.com/vNDtCsl.png" width="650" height="450" style="margin-left: auto; margin-right: auto;">
</p>

Submitting the payment will then:
- Calculate the payment amount allocated to interest and principal
- Adjust the remaining balance
- Calculate and disperse payment amount owed to security holders and originator
<!-- - Place remainder in Excess Spread -->
Once these calculations are complete, the dashboard tables will then be updated with the latest ledger state

<p align="center">
<img src="https://i.imgur.com/nljtWdf.png" width="700" height="450" style="margin-left: auto; margin-right: auto;">
</p>

# Troubleshooting


* `sendPeersProposal - Promise is rejected: Error: 2 UNKNOWN: chaincode error (status: 500, message: Authorization for GETINSTALLEDCHAINCODES on channel getinstalledchaincodes has been denied with error Failed verifying that proposal's creator satisfies local MSP principal during channelless check policy with policy [Admins]: [This identity is not an admin]`
> This error occurs if the certificate generated by the SDK user has not been uploaded to the peer

* `Error: The gRPC binary module was not installed. This may be fixed by running "npm rebuild"`
> `grpc` is a requirement for the fabric-client SDK. Confirm that it has been installed in the `react_backend` directory with `npm install grpc@1.11.0`

* `error: [client-utils.js]: sendPeersProposal - Promise is rejected: Error: 2 UNKNOWN: chaincode error (status: 500, message: Authorization for GETINSTALLEDCHAINCODES on channel getinstalledchaincodes has been denied with error Failed verifying that proposal's creator satisfies local MSP principal during channelless check policy with policy [Admins]: [This identity is not an admin])
`
> This error occurs if the admin certificate for the hosted IBM Blockchain service has not been uploaded.

* `Objects are not valid as a React child`
> This error occurs if one of the Golang structs defined in the chaincode are invalid. These may not have nested objects. To fix this, clear cookies or open a different browser


<!-- * Error: Environment {GUID} is still not active, retry once status is active

  > This is common during the first run. The app tries to start before the Discovery
environment is fully created. Allow a minute or two to pass. The environment should
be usable on restart. If you used `Deploy to IBM Cloud` the restart should be automatic.

* Error: Only one free environment is allowed per organization

  > To work with a free trial, a small free Discovery environment is created. If you already have
a Discovery environment, this will fail. If you are not using Discovery, check for an old
service thay you may want to delete. Otherwise use the .env DISCOVERY_ENVIRONMENT_ID to tell
the app which environment you want it to use. A collection will be created in this environment
using the default configuration. -->

<!--This can stay as-is if using Deploy to IBM Cloud-->

<!--Include any relevant links-->

# Links

<!-- pick the relevant ones from below -->
# Learn more
* **Blockchain Patterns**: Enjoyed this Code Pattern? Check out our other [Blockchain Patterns](https://developer.ibm.com/code/technologies/blockchain/)

# License
This code pattern is licensed under the Apache Software License, Version 2.  Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
