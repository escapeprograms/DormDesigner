# DormDesigner

# Commit Protocol

Each subteam (Frontend, Backend, 3D) has their own branch and consists of 2 members. Each person maintains their own personal branch when developing and pushes only to their subteam's branch. All merge conflicts must be resolved at this level before proceeding. 

To merge a subteam's branch into main, it requires approval from at least 1 representative from each of the other two teams.

# Setup

Clone the project with `git clone https://github.com/escapeprograms/DormDesigner.git`

For everyone, inside the `DormDesigner` folder, run `npm i`.

For working on frontend, go into the 'dorm-designer' folder and run `npm i`.

Run `npm i react-scripts` and`npm i react-router-dom` as well.

# Running

Run backend: `node .` in `DormDesigner`
Run frontend: `npm start` in `dorm-designer`
Build frontend: `npm run build` in `dorm-designer`

Build the frontend first, then run backend. Running frontend is for development only.

### Database information

This is some information about connecting to MongoDB Atlas, our database solution. 
To run the system while connected to the database:
- Run 'npm install'
