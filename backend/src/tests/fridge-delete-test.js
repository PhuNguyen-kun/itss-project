// Test script for fridge delete function
const fridgeService = require("../services/user/fridge.service");

// Test case: Delete from fridge
async function testDeleteFromFridge() {
    try {
        console.log("Testing deleteFromFridge...");
        const deleteData = {
            family_id: 1,
            ingredient_id: 1,
            unit: 1,
        };

        const result = await fridgeService.deleteFromFridge(deleteData);
        console.log("Delete from fridge result:", result);
        console.log("Item deleted successfully:", result > 0 ? "Yes" : "No");
    } catch (error) {
        console.error("Delete from fridge test failed:", error);
    }
}

async function runTests() {
    await testDeleteFromFridge();
    console.log("Delete from fridge test completed.");
}

runTests();
