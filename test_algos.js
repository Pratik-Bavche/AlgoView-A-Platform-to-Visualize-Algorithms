import { generateMergeSortSteps, generateQuickSortSteps } from './src/lib/algorithms.js';

const testMergeSort = () => {
    console.log("Testing Merge Sort...");
    const arr = [5, 3, 8, 4];
    const steps = generateMergeSortSteps(arr);
    steps.forEach((step, i) => {
        console.log(`Step ${i}:`);
        if (typeof step.description === 'object') {
            console.log("  Desc (EN):", step.description.en);
            console.log("  Desc (HI):", step.description.hi);
        } else {
            console.log("  Desc (String):", step.description);
        }
    });
};

const testQuickSort = () => {
    console.log("\nTesting Quick Sort...");
    const arr = [5, 3];
    const steps = generateQuickSortSteps(arr);
    steps.forEach((step, i) => {
        console.log(`Step ${i}:`);
        if (typeof step.description === 'object') {
            console.log("  Desc (EN):", step.description.en);
            console.log("  Desc (HI):", step.description.hi);
        } else {
            console.log("  Desc (String):", step.description);
        }
    });
};

testMergeSort();
testQuickSort();
