// Test script for fridge service
const fridgeService = require("../services/user/fridge.service");

// Test case 1: Get family fridge items
async function testGetFamilyFridgeItems() {
    try {
        console.log("Testing getFamilyFridgeItems...");
        // Replace with a valid family ID from your database
        const familyId = 1;

        const result = await fridgeService.getFamilyFridgeItems(familyId);
        console.log(
            "Get family fridge items successful:",
            JSON.stringify(result.slice(0, 3), null, 2) // Show only first 3 items
        );
        console.log(`Total items in fridge: ${result.length}`);
    } catch (error) {
        console.error("Get family fridge items test failed:", error);
    }
}

// Test case 2: Add to fridge
async function testAddToFridge() {
    try {
        console.log("Testing addToFridge...");
        const fridgeData = {
            family_id: 1,
            ingredient_id: 1,
            quantity: 100,
            unit: 1,
        };

        const result = await fridgeService.addToFridge(fridgeData);
        console.log("Add to fridge successful:", result);
    } catch (error) {
        console.error("Add to fridge test failed:", error);
    }
}

async function runTests() {
    await testGetFamilyFridgeItems();
    await testAddToFridge();
    console.log("All fridge service tests completed.");
}

runTests();
