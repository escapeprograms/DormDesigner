# DormDesigner

# Commit Protocol

Each subteam (Frontend, Backend, 3D) has their own branch and consists of 2 members. Each person maintains their own personal branch when developing and pushes only to their subteam's branch. All merge conflicts must be resolved at this level before proceeding. 

To merge a subteam's branch into main, it requires approval from at least 1 representative from each of the other two teams.

# Setup

Clone the project with `git clone https://github.com/escapeprograms/DormDesigner.git`

Inside the `DormDesigner` folder, run `npm run "dev set up"`.

# Running
One-step build and run backend: `npm run .` in `DormDesigner`(Run backend locally)

One-step run frontend locally: `npm run 'front end'`.

In development, you can build and run parts separately:

Build frontend: `npm run build` in `dorm-designer`

Run frontend: `npm start` in `dorm-designer`

Run backend: `node .` in `DormDesigner`

# Database
Use the seed.js file to add/remove data from the database. 

# Testing

To run unit tests for designServices.js (one component of our system), run `npm run 'unit test'` in `DormDesigner`.
To run integration tests for our major use case (Logging in and out, Creating and Saving a Dorm Design):
- run `npm run 'front end'` in `DormDesigner` to run the front end.
- run `npx cypress open` in `DormDesigner`. 

# Troubleshooting

If any of the scripts don't work as intended, navigate to root directory (`DormDesigner`) and run `npm i`. Retry desired script.

# More Details on 1.0 Release

Reference our 1.0 documentation: https://docs.google.com/document/d/1hRVvtWmyXj4I55u1QDQDL_f00Ws3bVGsS3SvctE7q_4/edit?tab=t.0#heading=h.qvzv95a5wx8k
