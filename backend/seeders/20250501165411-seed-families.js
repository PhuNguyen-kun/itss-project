"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "families",
            [
                {
                    name: "Gia đình Minh Anh",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Tùng Lâm",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Hương Lan",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Quang Hải",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Bảo Nam",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Đức Minh",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Linh Chi",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Nam Phong",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Mỹ Duyên",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Sơn Đặng",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Kim Anh",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Văn Khang",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Ngọc Mai",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Hải Sơn",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Thuận Lộc",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Bình An",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Hữu Tài",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Lan Phương",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Quốc Việt",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Tú Anh",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Phúc Sơn",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình An Bình",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Thanh Mai",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Ngọc Sơn",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Bích Phương",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Minh Khang",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Hồng Phúc",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Duy Anh",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Thảo Vy",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Gia đình Trọng Nhân",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("families", null, {});
    },
};
