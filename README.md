Install dependencies:
   in terminal:
    npm install
    

  Configure Environment Variables:
    Create a `.env` file 
    copy this in it:
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/bank_system
    JWT_SECRET=your_super_secret_key
 
  To run server:
    npm run dev

  For the seed data:
    node seed.js.
    when its created successfully
    npm run dev
