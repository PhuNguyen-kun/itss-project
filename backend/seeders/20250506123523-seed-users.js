"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = [];

        users.push({
            full_name: "Admin",
            email: "admin@gmail.com",
            password: "$2y$12$a1jZ.GtIsbJYKhdpgpyU7eiVwYZwsByvj0BPR9ZdGso22qlMNx9iu",
            phone_number: "0999999999",
            gender: 1,
            birth_date: new Date(1990, 0, 1),
            role: 1, // Admin
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
            google_id: null,
            family_id: null,
            family_role: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const names = [
            "Nguyễn Văn A",
            "Trần Thị B",
            "Lê Văn C",
            "Phạm Thị D",
            "Hoàng Văn E",
            "Vũ Thị F",
            "Bùi Văn G",
            "Đặng Thị H",
            "Đỗ Văn I",
            "Phan Thị J",
            "Trịnh Văn K",
            "Tạ Thị L",
            "Lý Văn M",
            "Dương Thị N",
            "Châu Văn O",
            "Quách Thị P",
            "Lâm Văn Q",
            "Tô Thị R",
            "Tống Văn S",
            "Nông Thị T",
            "La Văn U",
            "Triệu Thị V",
            "Mai Văn W",
            "Trương Thị X",
            "Hà Văn Y",
            "Kiều Thị Z",
            "Lương Văn AA",
            "Cao Thị BB",
            "Hồ Văn CC",
            "Lục Thị DD",
        ];

        const extraNames = [
            "Ngô Thanh Hòa",
            "Nguyễn Khánh Linh",
            "Lê Đức Tài",
            "Phạm Hải Yến",
            "Trần Quang Huy",
            "Đỗ Minh Trang",
            "Bùi Quốc Toản",
            "Lưu Thị Thanh",
            "Nguyễn Đức Anh",
            "Trịnh Thu Hương",
            "Phan Văn Phúc",
            "Tạ Minh Tâm",
            "Nguyễn Thị Hòa",
            "Hồ Văn Lâm",
            "Vũ Ngọc Thủy",
            "Mai Phương Thảo",
            "Dương Công Danh",
            "Trần Ngọc Anh",
            "Lê Bảo Trâm",
            "Nguyễn Hữu Thắng",
            "Đặng Thị Thu",
            "Lý Quốc Vinh",
            "Phạm Minh Nhật",
            "Cao Thị Mai",
            "Ngô Văn Cường",
            "Trịnh Thùy Dung",
            "Tống Văn Lợi",
            "Phan Bảo Khang",
            "Lâm Hồng Nhung",
            "Vũ Trung Kiên",
            "Nguyễn Nhật Hào",
            "Lê Thị Tâm",
            "Đỗ Ngọc Linh",
            "Hoàng Mạnh Tuấn",
            "Nguyễn Kim Duyên",
            "Trương Thị Hà",
            "Nguyễn Quốc Huy",
            "Phạm Hồng Phúc",
            "Lê Quỳnh Anh",
            "Bùi Hải Nam",
            "Trần Minh Đức",
            "Nguyễn Thị Mỹ",
            "Phan Ngọc Tuyết",
            "Lê Văn Lực",
            "Vũ Thị Yến",
            "Nguyễn Văn Tùng",
            "Tạ Thu Minh",
            "Trần Thanh Hương",
            "Phạm Nhật Trường",
            "Ngô Hoài Nam",
            "Hồ Thị Bích",
            "Nguyễn Thị Loan",
            "Trịnh Văn Phong",
            "Nguyễn Hải Đăng",
            "Đặng Quỳnh Nga",
            "Nguyễn Trọng Tín",
            "Phạm Ngọc Hà",
            "Vũ Thanh Tùng",
            "Trần Bảo Hân",
            "Lê Thị Hương",
            "Ngô Thị Lệ",
            "Đặng Hoàng Long",
            "Tạ Minh Quân",
            "Nguyễn Thu Giang",
            "Phạm Tuấn Kiệt",
            "Trương Minh Anh",
            "Phan Quang Dũng",
            "Ngô Bích Ngọc",
            "Lý Thị Nhung",
            "Nguyễn Văn Quý",
            "Đỗ Quốc Thiện",
            "Bùi Thị Hạnh",
            "Hoàng Minh Khôi",
            "Trần Thị Thanh",
            "Lê Quốc Dũng",
            "Nguyễn Ngọc Trinh",
            "Tạ Bảo Nam",
            "Phan Văn Hòa",
            "Nguyễn Thị Kim",
            "Trần Văn Bình",
            "Lê Văn Thành",
            "Vũ Hải Yến",
            "Nguyễn Thị Tuyết",
            "Đỗ Văn Sơn",
            "Cao Đức Mạnh",
            "Nguyễn Thị Trà",
            "Trịnh Hữu Lộc",
            "Phan Thị Hậu",
            "Tô Văn Tài",
            "Nguyễn Văn Tiến",
        ];

        let userId = 1;
        let extraIndex = 0;

        for (let familyId = 1; familyId <= 30; familyId++) {
            // Người đầu tiên (chủ hộ)
            users.push({
                full_name: names[familyId - 1],
                email: `user${userId}@gmail.com`,
                password:
                    "$2y$12$a1jZ.GtIsbJYKhdpgpyU7eiVwYZwsByvj0BPR9ZdGso22qlMNx9iu",
                phone_number: `01234567${String(userId).padStart(2, "0")}`,
                gender: 1,
                birth_date: new Date(1990, 0, (userId % 28) + 1),
                role: 2,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                google_id: null,
                family_id: familyId,
                family_role: 0, // house keeper
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            userId++;

            // 3 thành viên còn lại
            for (let i = 0; i < 3; i++) {
                const fullName = extraNames[extraIndex++];
                users.push({
                    full_name: fullName,
                    email: `user${userId}@gmail.com`,
                    password:
                        "$2y$12$a1jZ.GtIsbJYKhdpgpyU7eiVwYZwsByvj0BPR9ZdGso22qlMNx9iu",
                    phone_number: `01234567${String(userId).padStart(2, "0")}`,
                    gender: (i + 1) % 2 === 0 ? 1 : 0,
                    birth_date: new Date(1990, 0, (userId % 28) + 1),
                    role: 2,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                    google_id: null,
                    family_id: familyId,
                    family_role: 1, // family member
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                userId++;
            }
        }

        await queryInterface.bulkInsert("users", users);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
