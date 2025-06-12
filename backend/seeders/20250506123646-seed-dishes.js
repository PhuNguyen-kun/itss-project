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
                        "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/02/25/0/FNK_Bun-Cha_H1_s4x3.jpg.rend.hgtvcom.1280.720.suffix/1614271647270.webp",
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
                        "https://tse1.mm.bing.net/th?id=OIP.yULyHJBaMKJWrNlahtxNDAHaFN&pid=Api&P=0&h=220",
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
                        "https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/trung-chien-nuoc-mam-thumbnail.jpg",
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
                        "https://image-us.eva.vn/upload/3-2022/images/2022-07-28/image25-1659002279-758-width785height437.png",
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
                        "https://sepabayo.com/wp-content/uploads/2021/08/1_XLDN.jpg",
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
                        "https://i.ytimg.com/vi/jZ8OFZt3OzM/maxresdefault.jpg",
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
                        "https://cdn.tgdd.vn/Files/2021/08/06/1373466/huong-dan-lam-mon-salad-dau-giam-thom-ngon-bo-duong-de-lam-tai-nha-202201081510043817.jpeg",
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
                        "https://tse2.mm.bing.net/th?id=OIP.iAz0BZOwbOXW3f5_orHrnQHaHa&pid=Api&P=0&h=220",
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
                        "https://cdn.shortpixel.ai/spai2/w_600+q_glossy+ret_img+to_auto/hungryhuy.com/wp-content/uploads/ca-kho-vietnamese-caramelized-fish-1.jpg",
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
                        "https://yummyday.vn/uploads/images/canh-bi-do-chay-3.jpg",
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
                        "https://tse1.mm.bing.net/th?id=OIP.VPyf2R3CgZFmzIeR_susTgHaE8&pid=Api&P=0&h=220",
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
                        "https://i.ytimg.com/vi/A_o2qfaTgKs/maxresdefault.jpg",
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
                        "https://toplist.vn/images/800px/sup-cua-539467.jpg",
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
                        "https://tse2.mm.bing.net/th?id=OIP.wkskN_E36oJzgEEW_2IliAHaIc&pid=Api&P=0&h=220",
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
                        "https://gofood.vn/uploads/tong-hop-tin-tuc/huong-dan-mon-ngon/mi-y-sot-ca-chua-bo-bam.jpg",
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
                        "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/163065/Originals/cach-nau-canh-rau-ngot-4.jpg",
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
                        "https://tse1.mm.bing.net/th?id=OIP.W5gqQwcH8Nbd8BsxO94jyQHaEL&pid=Api&P=0&h=220",
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
                        "https://cdn-www.vinid.net/2020/04/6372975d-tr%E1%BB%A9ng-g%C3%A0-ta-lu%E1%BB%99c.jpg",
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
                        "https://thekitchencommunity.org/wp-content/uploads/2022/12/image-14.jpeg",
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
                        "https://cookbeo.com/media/2021/01/nem-ran/thumbnails/mon-nem-ran-6-1200.jpg",
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
                        "https://cdn.tgdd.vn/2021/04/CookRecipe/Avatar/canh-cai-ngot-thit-bam-thumbnail-4.jpg",
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
                        "https://cafebiz.cafebizcdn.vn/162123310254002176/2022/12/7/com-tam-suon-bi-cha-trung-anh-hoa-quynh-nguyen-1670317945936565526419-1670385940206-16703859407121546487016-1670395722685-16703957227611562343004.jpg",
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
                        "https://www.cet.edu.vn/wp-content/uploads/2018/04/lam-ga-kho-gung.jpg",
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
                        "https://sieungon.com/wp-content/uploads/2019/12/cong-thuc-nau-mien-ga.jpg",
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
                        "https://tse3.mm.bing.net/th?id=OIP.mzgPpP8Aj8hq5GFtjTO8gwHaHZ&pid=Api&P=0&h=220",
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
                        "https://cdn.tgdd.vn/Files/2019/05/27/1169311/2-cach-nau-chao-trang-ngon-mieng-cung-cac-mon-an-kem-202102261525069386.jpg",
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
                        "https://quangon.vn/resources/2020/05/19/salad-trai-cay-sot-mayonnaise-13.jpg",
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
                        "https://tse1.mm.bing.net/th?id=OIP.Ey9fnXWVTi8MpmQSNU7QTwHaEK&pid=Api",
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
                        "https://cdn.tgdd.vn/2021/01/CookProduct/Untitled-1-1200x676-1.jpg",
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
