Install dependencies:
   in terminal:
    npm install
    

3.  Configure Environment Variables:
    Create a `.env` file 
    copy this in it:
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/bank_system
    JWT_SECRET=your_super_secret_key
 
    to run the server:
    npm run dev

    for the seed data:
    node seed.js.
    when its created successfully
    npm run dev