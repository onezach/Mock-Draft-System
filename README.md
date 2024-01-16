# Fantasy Mock Draft System
## Overview
This system combines React Native, ReactJS, and Python to bring a fantasy drafting experience. The motivation behind the system is for mock drafting for fantasy football. So far, there are three primary components to this system: a mobile client, a desktop/display client, and a server.
## Server - Python
The server is currently run locally from server/server.py. server.py predominately serves as a middleman for the Draft class, where most of the logic for drafting takes place. The necessary environment components can be installs with the provided `environment.yml` file:
```bash
conda env create -f environment.yml
```
### Next Steps
- Incorporate a database and SQL 
- Session management and authentication
## Mobile Client - React Native
The mobile client is the primary user drafting interface. For the time being, it is set up as 1 user drafting for all teams. The user is prompted with a screen that shows which pick is currently up and a set of inputs for the player they want to draft. Upon confirming a pick, the player data is sent to the server, and then the next pick is brought up.
To run:
```bash
cd mobile_client
npm install
npx expo start
```
### Next Steps
- Initialization screen where the number of teams and rounds for a given draft are selected prior to the draft starting (currently this is fixed in the server)
- Multiple users to connect to the same draft and draft independently
- Multiple drafts can take place simultaneously
## Desktop Client - ReactJS
The desktop client serves as a display for the draft currently taking place, i.e. it shows the draft board. It does not have much complex behavior yet besides simply polling the server for updates.
To run:
```bash
cd display_client
npm install
npm start
```
### Next Steps
- Improved visualization
- Drafting client that can take place from desktop, which will require session management on the server end
- A master-client that has full visibility across all clients and power to fix any issues that may come up during the draft process