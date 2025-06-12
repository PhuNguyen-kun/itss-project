const app = require("./app");
const config = require("./config/config");
require('dotenv').config(); // Phải đặt ở trên cùng

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
