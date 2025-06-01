"use strict";

const { generateSlugFromName } = require("../src/utils/hasSlug");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "dishes",
            [
                {
                    id: 1,
                    name: "Phở bò",
                    slug: generateSlugFromName("Phở bò"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/02/vietnam-pho.png",
                    description: "Món Phở bò thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Phở bò từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: "Bún chả",
                    slug: generateSlugFromName("Bún chả"),
                    image_url:
                        "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/05/29/1660a843b56d4a6f88b326001461a685_Vietnam_101_How_To_Eat_Vietnamese_Food_Like_A_Local_%286%29.jpg",
                    description: "Món Bún chả thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Bún chả từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    name: "Canh chua cá",
                    slug: generateSlugFromName("Canh chua cá"),
                    image_url:
                        "https://media.cnn.com/api/v1/images/stellar/prod/160524092144-vietnam-street-food-bot-chien.jpg?q=w_2000,h_1333,x_0,y_0,c_fill",
                    description: "Món Canh chua cá thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Canh chua cá từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    name: "Trứng chiên",
                    slug: generateSlugFromName("Trứng chiên"),
                    image_url:
                        "https://www.easyridersvietnam.com/wp-content/uploads/2023/03/must-try-dishes-in-vietnam-pho1.jpg",
                    description: "Món Trứng chiên thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Trứng chiên từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    name: "Cơm rang trứng",
                    slug: generateSlugFromName("Cơm rang trứng"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/01/VietnamFood3.png",
                    description: "Món Cơm rang trứng thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Cơm rang trứng từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    name: "Gỏi cuốn",
                    slug: generateSlugFromName("Gỏi cuốn"),
                    image_url:
                        "https://www.matchingfoodandwine.com/files/blogattachments/top/vietnamese-summer-rolls-(1)@2x.jpg",
                    description: "Món Gỏi cuốn thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Gỏi cuốn từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    name: "Mì xào bò",
                    slug: generateSlugFromName("Mì xào bò"),
                    image_url:
                        "https://www.phobynight.com/wp-content/uploads/2023/08/Vegetarian-Pad-Thai-e1691782053841.jpg",
                    description: "Món Mì xào bò thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Mì xào bò từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    name: "Salad dầu giấm",
                    slug: generateSlugFromName("Salad dầu giấm"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/02/vietnam-pho.png",
                    description: "Món Salad dầu giấm thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Salad dầu giấm từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    name: "Cháo gà",
                    slug: generateSlugFromName("Cháo gà"),
                    image_url:
                        "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/05/29/1660a843b56d4a6f88b326001461a685_Vietnam_101_How_To_Eat_Vietnamese_Food_Like_A_Local_%286%29.jpg",
                    description: "Món Cháo gà thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Cháo gà từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    name: "Cá kho",
                    slug: generateSlugFromName("Cá kho"),
                    image_url:
                        "https://media.cnn.com/api/v1/images/stellar/prod/160524092144-vietnam-street-food-bot-chien.jpg?q=w_2000,h_1333,x_0,y_0,c_fill",
                    description: "Món Cá kho thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Cá kho từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    name: "Canh bí đỏ",
                    slug: generateSlugFromName("Canh bí đỏ"),
                    image_url:
                        "https://www.easyridersvietnam.com/wp-content/uploads/2023/03/must-try-dishes-in-vietnam-pho1.jpg",
                    description: "Món Canh bí đỏ thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Canh bí đỏ từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    name: "Bánh mì trứng",
                    slug: generateSlugFromName("Bánh mì trứng"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/01/VietnamFood3.png",
                    description: "Món Bánh mì trứng thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Bánh mì trứng từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    name: "Bún bò Huế",
                    slug: generateSlugFromName("Bún bò Huế"),
                    image_url:
                        "https://www.matchingfoodandwine.com/files/blogattachments/top/vietnamese-summer-rolls-(1)@2x.jpg",
                    description: "Món Bún bò Huế thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Bún bò Huế từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    name: "Súp cua",
                    slug: generateSlugFromName("Súp cua"),
                    image_url:
                        "https://www.phobynight.com/wp-content/uploads/2023/08/Vegetarian-Pad-Thai-e1691782053841.jpg",
                    description: "Món Súp cua thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Súp cua từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    name: "Cơm gà xối mỡ",
                    slug: generateSlugFromName("Cơm gà xối mỡ"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/02/vietnam-pho.png",
                    description: "Món Cơm gà xối mỡ thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Cơm gà xối mỡ từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 16,
                    name: "Mì Ý sốt cà chua",
                    slug: generateSlugFromName("Mì Ý sốt cà chua"),
                    image_url:
                        "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/05/29/1660a843b56d4a6f88b326001461a685_Vietnam_101_How_To_Eat_Vietnamese_Food_Like_A_Local_%286%29.jpg",
                    description: "Món Mì Ý sốt cà chua thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Mì Ý sốt cà chua từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 17,
                    name: "Canh rau ngót",
                    slug: generateSlugFromName("Canh rau ngót"),
                    image_url:
                        "https://media.cnn.com/api/v1/images/stellar/prod/160524092144-vietnam-street-food-bot-chien.jpg?q=w_2000,h_1333,x_0,y_0,c_fill",
                    description: "Món Canh rau ngót thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Canh rau ngót từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 18,
                    name: "Cá chiên giòn",
                    slug: generateSlugFromName("Cá chiên giòn"),
                    image_url:
                        "https://www.easyridersvietnam.com/wp-content/uploads/2023/03/must-try-dishes-in-vietnam-pho1.jpg",
                    description: "Món Cá chiên giòn thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Cá chiên giòn từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 19,
                    name: "Trứng luộc",
                    slug: generateSlugFromName("Trứng luộc"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/01/VietnamFood3.png",
                    description: "Món Trứng luộc thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Trứng luộc từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 20,
                    name: "Bánh xèo",
                    slug: generateSlugFromName("Bánh xèo"),
                    image_url:
                        "https://www.matchingfoodandwine.com/files/blogattachments/top/vietnamese-summer-rolls-(1)@2x.jpg",
                    description: "Món Bánh xèo thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Bánh xèo từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 21,
                    name: "Nem rán",
                    slug: generateSlugFromName("Nem rán"),
                    image_url:
                        "https://www.phobynight.com/wp-content/uploads/2023/08/Vegetarian-Pad-Thai-e1691782053841.jpg",
                    description: "Món Nem rán thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Nem rán từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 22,
                    name: "Canh cải ngọt",
                    slug: generateSlugFromName("Canh cải ngọt"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/02/vietnam-pho.png",
                    description: "Món Canh cải ngọt thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Canh cải ngọt từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 23,
                    name: "Cơm tấm",
                    slug: generateSlugFromName("Cơm tấm"),
                    image_url:
                        "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/05/29/1660a843b56d4a6f88b326001461a685_Vietnam_101_How_To_Eat_Vietnamese_Food_Like_A_Local_%286%29.jpg",
                    description: "Món Cơm tấm thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Cơm tấm từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 24,
                    name: "Gà kho gừng",
                    slug: generateSlugFromName("Gà kho gừng"),
                    image_url:
                        "https://media.cnn.com/api/v1/images/stellar/prod/160524092144-vietnam-street-food-bot-chien.jpg?q=w_2000,h_1333,x_0,y_0,c_fill",
                    description: "Món Gà kho gừng thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Gà kho gừng từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 25,
                    name: "Miến gà",
                    slug: generateSlugFromName("Miến gà"),
                    image_url:
                        "https://www.easyridersvietnam.com/wp-content/uploads/2023/03/must-try-dishes-in-vietnam-pho1.jpg",
                    description: "Món Miến gà thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Miến gà từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 26,
                    name: "Xôi đậu xanh",
                    slug: generateSlugFromName("Xôi đậu xanh"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/01/VietnamFood3.png",
                    description: "Món Xôi đậu xanh thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Xôi đậu xanh từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 27,
                    name: "Cháo trắng",
                    slug: generateSlugFromName("Cháo trắng"),
                    image_url:
                        "https://www.matchingfoodandwine.com/files/blogattachments/top/vietnamese-summer-rolls-(1)@2x.jpg",
                    description: "Món Cháo trắng thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Cháo trắng từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 28,
                    name: "Salad trái cây",
                    slug: generateSlugFromName("Salad trái cây"),
                    image_url:
                        "https://www.phobynight.com/wp-content/uploads/2023/08/Vegetarian-Pad-Thai-e1691782053841.jpg",
                    description: "Món Salad trái cây thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Salad trái cây từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 29,
                    name: "Súp bí đỏ",
                    slug: generateSlugFromName("Súp bí đỏ"),
                    image_url:
                        "https://www.experiencetravelgroup.com/blog/wp-content/uploads/2023/02/vietnam-pho.png",
                    description: "Món Súp bí đỏ thơm ngon hấp dẫn.",
                    instructions: "Hướng dẫn nấu món Súp bí đỏ từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 30,
                    name: "Canh mồng tơi",
                    slug: generateSlugFromName("Canh mồng tơi"),
                    image_url:
                        "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2023/05/29/1660a843b56d4a6f88b326001461a685_Vietnam_101_How_To_Eat_Vietnamese_Food_Like_A_Local_%286%29.jpg",
                    description: "Món Canh mồng tơi thơm ngon hấp dẫn.",
                    instructions:
                        "Hướng dẫn nấu món Canh mồng tơi từng bước một.",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("dishes", null, {});
    },
};
