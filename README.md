# Fantasy Mock Draft System
## Overview
This system combines React Native, ReactJS, and Python to bring a fantasy drafting experience. The motivation behind the system is for mock drafting for fantasy football. So far, there are three primary components to this system: a mobile client, a desktop/display client, and a server. This system is currently only runnable on devices sharing a local network. In the App.js files within the `display_client` and `mobile_client` folders, the `SERVER_URL` constants must be changed to align with the Python server.
## Server - Python
The server is currently run locally from `server/server.py` using Flask. `server.py` predominately serves as a middleman for the Draft class, where most of the logic for drafting takes place. The necessary environment components can be installed with the provided `environment.yml` file:
```bash
conda env create -f environment.yml
```
### Next Steps
- Persistence (saving/loading drafts)
- Incorporate a database/SQL for players/drafts
- Session management and authentication
## Mobile Client - React Native
The mobile client is the primary user drafting interface. For the time being, it is set up as 1 user drafting for all teams. The user must first choose to either start a new draft or join an existing one using its draft code. Once inside the draft, the user can begin to make picks using the prompts on the screen. Upon confirming each pick, the player data is sent to the server, and the next pick is brought up.
To run:
```bash
cd mobile_client
npm install
npx expo start
```
### Next Steps
- Multiple users to connect to the same draft and draft independently
## Desktop Client - ReactJS
The desktop client serves as a display for the draft currently taking place, i.e. it shows the draft board. For the time being, all that is required is the draft code for a currently-active draft.
To run:
```bash
cd display_client
npm install
npm start
```
### Next Steps
- Improved visualization
- Drafting client that can take place from desktop, which will require session management on the server end
- A master-client that has full visibility across all clients and power to fix any issues that may come up during the draft process - also in charge of initialization