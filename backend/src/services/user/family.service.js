const { Family } = require("../../../models");
const { UserResource } = require("../../../src/resources/user.resource");

const getAllFamilies = async (options = {}) => {
    const queryOptions = {
        distinct: true,
    };

    // Add pagination params if provided
    if (options.limit) {
        queryOptions.limit = options.limit;
    }

    if (options.offset !== undefined) {
        queryOptions.offset = options.offset;
    }

    return await Family.findAndCountAll(queryOptions);
};

/**
 * Get family by ID
 * @param {Number} id - Family ID
 * @returns {Promise<Object>} - Family object or null if not found
 */
const getFamilyById = async (id) => {
    return await Family.findByPk(id, {
        include: [
            {
                association: "users",
                attributes: ["id", "full_name", "email"],
            },
        ],
    });
};

/**
 * Get family by user ID
 * @param {Number} userId - User ID
 * @returns {Promise<Object>} - Family object or null if not found
 */
const getFamilyByUserId = async (userId) => {
    const { User } = require("../../../models");

    // Find the user with their family included
    const user = await User.findByPk(userId, {
        include: [
            {
                association: "family",
                include: [
                    {
                        association: "users",
                        UserResource,
                    },
                ],
            },
        ],
    });

    return user ? user.family : null;
};

module.exports = {
    getAllFamilies,
    getFamilyById,
    getFamilyByUserId,
};
