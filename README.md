# DormDesigner

# Commit Protocol

Each subteam (Frontend, Backend, 3D) has their own branch and consists of 2 members. Each person maintains their own personal branch when developing and pushes only to their subteam's branch. All merge conflicts must be resolved at this level before proceeding. 

To merge a subteam's branch into main, it requires approval from at least 1 representative from each of the other two teams.

# Setup

Clone the project with `git clone https://github.com/escapeprograms/DormDesigner.git`

Inside the `DormDesigner` folder, run `npm run dev set up`.

# Running

Run backend: `node .` in `DormDesigner`
Run frontend: `npm start` in `dorm-designer`
Build frontend: `npm run build` in `dorm-designer`
One-step build and run: `npm run .` in `DormDesigner`

Build the frontend first, then run backend. Running frontend is for development only.

### Database information

This is some information about connecting to MongoDB Atlas, our database solution. 
To run the system while connected to the database:
- Run 'npm install'

Use the seed.js file to add/remove data from the database. 
