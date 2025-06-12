// Test script for cart service
const cartService = require("../services/user/cart.service");

// Test case 1: Assign ingredients to family members
async function testAssignIngredientsToFamilyMembers() {
    try {
        console.log("Testing assignIngredientsToFamilyMembers...");
        // Replace with valid family ID and meal plan IDs from your database
        const familyId = 1;
        const mealPlanIds = [1, 2];
        const memberIds = [1, 2]; // Add member IDs

        const result = await cartService.assignIngredientsToFamilyMembers(
            familyId,
            mealPlanIds,
            memberIds
        );
        console.log("Assignment successful:", result);
    } catch (error) {
        console.error("Assignment test failed:", error);
    }
}

// Test case 2: Get cart items by family ID
async function testGetCartItemsByFamilyId() {
    try {
        console.log("Testing getCartItemsByFamilyId...");
        // Replace with a valid family ID from your database
        const familyId = 1;

        const result = await cartService.getCartItemsByFamilyId(familyId);
        console.log(
            "Get cart items successful:",
            JSON.stringify(result, null, 2)
        );
    } catch (error) {
        console.error("Get cart items test failed:", error);
    }
}

// Test case 3: Update cart item status
async function testUpdateCartItemStatus() {
    try {
        console.log("Testing updateCartItemStatus...");
        // Replace with a valid cart item ID from your database
        const cartItemId = 1;
        const status = 1; // Mark as completed

        const result = await cartService.updateCartItemStatus(
            cartItemId,
            status
        );
        console.log("Update cart item status successful:", result);

        // Test the auto-addition to fridge (in the controller)
        console.log(
            "Note: The controller will handle adding this item to the fridge automatically"
        );
        console.log("Cart item ingredient_id:", result.ingredient_id);
        console.log("Cart item quantity:", result.quantity);
        console.log("Cart item unit:", result.unit);
    } catch (error) {
        console.error("Update cart item status test failed:", error);
    }
}

async function runTests() {
    await testAssignIngredientsToFamilyMembers();
    await testGetCartItemsByFamilyId();
    await testUpdateCartItemStatus();
    console.log("All tests completed.");
}

runTests();
