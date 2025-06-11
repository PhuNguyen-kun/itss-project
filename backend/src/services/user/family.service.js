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

/**
 * Create a new family
 * @param {string} familyName - Name of the family
 * @returns {Promise<Object>} - Created family object
 * @throws {Error} - If creation fails or invalid name
 */
const createFamily = async (familyName) => {
    const family = await Family.create({
        name: familyName.trim(),
    });

    return family;
};

/**
 * Add a user to an existing family
 * @param {string} familyId - ID of the family to join
 * @param {string} userId - ID of the user joining the family
 * @returns {Promise<Object>} - Updated family object
 * @throws {Error} - If family not found or user already a member
 */
const joinFamily = async (familyId, userId) => {
    // Check if the family exists
    const family = await Family.findById(familyId);

    if (!family) {
        throw new Error("Family not found");
    }

    // Check if the user is already a member
    if (family.members && family.members.includes(userId)) {
        throw new Error("User is already a member of this family");
    }

    // Add the user to the family's members list
    family.members = family.members ? [...family.members, userId] : [userId];

    // Save the updated family
    await family.save();

    return family;
};

module.exports = {
    getAllFamilies,
    getFamilyById,
    getFamilyByUserId,
    createFamily,
};
