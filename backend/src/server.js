const app = require("./app");
const config = require("./config/config");

const PORT = process.env.PORT || 3000; // 👈 Thêm PORT ở đây

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const db = require('../models'); // 👈 dòng này thêm vào

db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });
