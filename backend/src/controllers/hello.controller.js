const helloService = require('../services/hello.service');
const asyncHandler = require('../middlewares/asyncHandler');

exports.sayHello = asyncHandler(async (req, res) => {
    const data = helloService.getHelloMessage();
    res.status(200).json(data);
});
