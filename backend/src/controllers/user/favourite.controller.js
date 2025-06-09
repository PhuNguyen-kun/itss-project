const favouriteService = require("../../services/user/favourite.service");

const {
    responseOk,
    responseError,
    paginate,
} = require("../../utils/apiResponse");

const getAllFavorites = async (req, res, next) => {
    try {
        const result = await paginate(req, favouriteService.getAllFavorites);
        return responseOk(
            res,
            result.data,
            "Favorites retrieved successfully",
            200,
            result.pagination
        );
    } catch (error) {
        next(error);
    }
};

const getFavoritesByUserId = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.user_id);
        
        if (String(req.id.id) !== String(userId)) {
            return responseError(res, "Unauthorized", 403);
        }
        

        const result = await paginate(req, (paginationOptions) =>
            favouriteService.getFavoritesByUserId(userId, paginationOptions)
        );

        return responseOk(
            res,
            result.data,
            "Favorites retrieved successfully by user ID",
            200,
            result.pagination
        );
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getAllFavorites,
    getFavoritesByUserId,
};
