const user = require("../../models/user");

function userResource(user) {
    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        gender: user.gender,
        birth_date: user.birth_date,
        role: user.role,
        avatar_url: user.avatar_url,
        family_id: user.family_id,
        family_role: user.family_role,
    };
}

module.exports = userResource;
