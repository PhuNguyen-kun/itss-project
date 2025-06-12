const user = require("../../models/user");
const { getBaseUrl } = require("../utils/url");

function userResource(user) {
    // Use the URL utility function to get the base URL
    const baseUrl = getBaseUrl();
    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        gender: user.gender,
        birth_date: user.birth_date,
        role: user.role,
        avatar_url: user.avatar_url
            ? `http://localhost:3000${user.avatar_url}`
            : null,
        family_id: user.family_id,
        family_role: user.family_role,
    };
}

module.exports = userResource;
