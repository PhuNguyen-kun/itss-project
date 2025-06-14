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

    // Add search functionality
    if (options.search) {
        queryOptions.where = {
            ...queryOptions.where,
            name: { [require("sequelize").Op.like]: `%${options.search}%` },
        };
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
                attributes: ["id", "full_name", "email", "family_role"],
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
 * Update a family
 * @param {Number} id - Family ID
 * @param {Object} data - Family data to update
 * @returns {Promise<Object>} - Updated family object
 * @throws {Error} - If update fails
 */
const updateFamily = async (id, data) => {
    const family = await Family.findByPk(id);

    if (!family) {
        return null;
    }

    await family.update(data);
    return family;
};

/**
 * Delete a family
 * @param {Number} id - Family ID
 * @returns {Promise<boolean>} - True if deletion was successful
 */
const deleteFamily = async (id) => {
    const family = await Family.findByPk(id);

    if (!family) {
        return false;
    }

    // Update all users in this family to have null family_id
    const { User } = require("../../../models");
    await User.update(
        { family_id: null, family_role: null },
        { where: { family_id: id } }
    );

    // Delete the family
    await family.destroy();
    return true;
};

/**
 * Get user by ID
 * @param {Number} id - User ID
 * @returns {Promise<Object>} - User object or null if not found
 */
const getUserById = async (id) => {
    const { User } = require("../../../models");
    return await User.findByPk(id);
};

/**
 * Add members to a family
 * @param {Number} familyId - ID of the family
 * @param {Array<Number>} userIds - Array of user IDs to add to the family
 * @returns {Promise<Object>} - Result object with success and error counts
 */
const addMembersToFamily = async (familyId, userIds) => {
    const { User } = require("../../../models");

    // Check if the family exists
    const family = await Family.findByPk(familyId);

    if (!family) {
        throw new Error("Family not found");
    }

    // Keep track of success and errors
    const result = {
        success: 0,
        errors: 0,
        updatedUsers: [],
    };

    // Update each user's family_id
    for (const userId of userIds) {
        try {
            const user = await User.findByPk(userId);

            if (user && !user.family_id) {
                await user.update({
                    family_id: familyId,
                    family_role: 1, // Set as family member (not housekeeper)
                });

                result.success++;
                result.updatedUsers.push({
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                });
            } else {
                result.errors++;
            }
        } catch (error) {
            result.errors++;
        }
    }

    return result;
};

module.exports = {
    getAllFamilies,
    getFamilyById,
    getFamilyByUserId,
    createFamily,
    updateFamily,
    deleteFamily,
    getUserById,
    addMembersToFamily,
};
