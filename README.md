## How to clone the repository
git clone <your-repo-url>

## How to run Backend (Expressjs)
1. Go into the project directory
cd backend

2. Initialize Node.js project
npm init -y

3. Install dependencies
npm install express dotenv express-validator
npm install --save-dev nodemon

4. Create .env file
echo PORT=3000 > .env

5. Update package.json:
"scripts": {
   "dev": "nodemon src/server.js"
}

6. Run development server
npm run dev

## How to run run Frontend (Vue3)
1. Go into the project directory
cd frontend

2. Install dependencies
npm install

3. Run development server
npm run dev
