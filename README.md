## How to clone the repository
git clone <your-repo-url>

## How to run Backend (Expressjs)
**Go into the project directory**
cd backend

** Initialize Node.js project**
npm init -y

**Install dependencies**
npm install express dotenv express-validator
npm install --save-dev nodemon

**Create .env file**
echo PORT=3000 > .env

**Update package.json:**
"scripts": {
   "dev": "nodemon src/server.js"
}

**Run development server**
npm run dev

## How to run run Frontend (Vue3)
**1.Go into the project directory**
cd frontend

**Install dependencies**
npm install

**3.Run development server**
npm run dev
