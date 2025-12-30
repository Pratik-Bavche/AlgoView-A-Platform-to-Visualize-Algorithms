// Helper to swap
const swap = (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

// --- Sorting Algorithms ---

export const generateBubbleSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;
    let sortedIndices = [];

    steps.push({ array: [...array], comparing: [], swapped: false, sorted: [], description: "Initial State" });

    for (let i = 0; i < n; i++) {
        let hasSwapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapped: false,
                sorted: [...sortedIndices],
                description: `Comparing ${array[j]} and ${array[j + 1]}`
            });

            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                hasSwapped = true;
                steps.push({
                    array: [...array],
                    comparing: [j, j + 1],
                    swapped: true, // Highlights swap
                    sorted: [...sortedIndices],
                    description: `Swapped ${array[j + 1]} and ${array[j]}`
                });
            }
        }
        sortedIndices.push(n - i - 1);
        steps.push({
            array: [...array],
            comparing: [],
            swapped: false,
            sorted: [...sortedIndices],
            description: `${array[n - i - 1]} is sorted`
        });
        if (!hasSwapped) {
            const remaining = [];
            for (let k = 0; k < n - i - 1; k++) remaining.push(k);
            sortedIndices = [...sortedIndices, ...remaining];
            break;
        }
    }
    steps.push({ array: [...array], comparing: [], swapped: false, sorted: [...Array(n).keys()], description: "Sorted!" });
    return steps;
};

export const generateSelectionSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;
    let sortedIndices = [];

    steps.push({ array: [...array], comparing: [], sorted: [], description: "Initial State" });

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        steps.push({ array: [...array], comparing: [minIdx], sorted: [...sortedIndices], description: `Current minimum is ${array[minIdx]} at index ${minIdx}` });

        for (let j = i + 1; j < n; j++) {
            steps.push({ array: [...array], comparing: [minIdx, j], sorted: [...sortedIndices], description: `Comparing minimum ${array[minIdx]} with ${array[j]}` });
            if (array[j] < array[minIdx]) {
                minIdx = j;
                steps.push({ array: [...array], comparing: [minIdx], sorted: [...sortedIndices], description: `New minimum found: ${array[minIdx]}` });
            }
        }

        if (minIdx !== i) {
            swap(array, i, minIdx);
            steps.push({ array: [...array], comparing: [i, minIdx], swapped: true, sorted: [...sortedIndices], description: `Swapped minimum ${array[i]} with ${array[minIdx]}` });
        }
        sortedIndices.push(i);
        steps.push({ array: [...array], comparing: [], sorted: [...sortedIndices], description: `${array[i]} is now sorted` });
    }
    steps.push({ array: [...array], comparing: [], sorted: [...Array(n).keys()], description: "Sorted!" });
    return steps;
};

export const generateInsertionSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    // First element is implicitly sorted
    let sortedIndices = [0];
    steps.push({ array: [...array], comparing: [], sorted: [0], description: "Initial State. Element at 0 is trivially sorted." });

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        steps.push({ array: [...array], comparing: [i], sorted: [...sortedIndices], description: `Selected key ${key} to insert into sorted portion.` });

        while (j >= 0 && array[j] > key) {
            steps.push({ array: [...array], comparing: [j, j + 1], sorted: [...sortedIndices], description: `Comparing ${key} with ${array[j]}` });

            array[j + 1] = array[j];
            steps.push({ array: [...array], comparing: [j, j + 1], swapped: true, sorted: [...sortedIndices], description: `Moved ${array[j]} to right` });

            j = j - 1;
        }
        array[j + 1] = key;
        sortedIndices.push(i); // This simplistic view of "sorted indices" grows, but insertion sort effectively expands the sorted sublist [0..i]

        // Correct sorted indices for visualization: indices 0 to i are sorted
        const currentSorted = Array.from({ length: i + 1 }, (_, k) => k);
        steps.push({ array: [...array], comparing: [], sorted: currentSorted, description: `Inserted ${key} at position ${j + 1}` });
    }
    steps.push({ array: [...array], sorted: [...Array(n).keys()], description: "Sorted!" });
    return steps;
};


// --- Searching Algorithms ---

export const generateLinearSearchSteps = (array, target) => {
    const steps = [];
    steps.push({ array: [...array], comparing: [], description: `Searching for ${target}` });

    for (let i = 0; i < array.length; i++) {
        steps.push({ array: [...array], comparing: [i], description: `Checking index ${i}: ${array[i]}` });
        if (array[i] === target) {
            steps.push({ array: [...array], comparing: [i], found: [i], description: `Found ${target} at index ${i}!` });
            return steps;
        }
    }
    steps.push({ array: [...array], comparing: [], description: `${target} not found in array.` });
    return steps;
};

export const generateBinarySearchSteps = (initialArray, target) => {
    // Binary search requires sorted array. We'll sort a copy for the viz if passed unsorted, 
    // OR arguably we should show it failing if unsorted. 
    // For standard viz, we usually assume sorted input.
    // Let's sort it first and add a step "Sorting array first..."

    const steps = [];
    let array = [...initialArray].sort((a, b) => a - b);
    steps.push({ array: [...array], comparing: [], description: "Binary Search requires a sorted array. (Sorted for visualization)" });

    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // Visualize the current range and mid
        const range = [];
        for (let k = left; k <= right; k++) range.push(k);

        steps.push({
            array: [...array],
            comparing: [mid],
            range: range, // new prop for range highlight
            description: `Checking middle element ${array[mid]} at index ${mid}. Range: [${left}, ${right}]`
        });

        if (array[mid] === target) {
            steps.push({ array: [...array], comparing: [mid], found: [mid], description: `Found ${target} at index ${mid}!` });
            return steps;
        }

        if (array[mid] < target) {
            left = mid + 1;
            steps.push({ array: [...array], comparing: [], description: `${array[mid]} < ${target}. Ignoring left half.` });
        } else {
            right = mid - 1;
            steps.push({ array: [...array], comparing: [], description: `${array[mid]} > ${target}. Ignoring right half.` });
        }
    }

    steps.push({ array: [...array], comparing: [], description: `${target} not found.` });
    return steps;
};

// --- Array Algorithms ---

export const generateFindMaxMinSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;
    let minIdx = 0;
    let maxIdx = 0;

    steps.push({ array: [...array], comparing: [], found: [], description: "Initial State" });

    for (let i = 1; i < n; i++) {
        steps.push({
            array: [...array],
            comparing: [i, minIdx, maxIdx],
            description: `Comparing element at ${i} (${array[i]}) with current min (${array[minIdx]}) and max (${array[maxIdx]})`
        });

        if (array[i] < array[minIdx]) {
            minIdx = i;
            steps.push({ array: [...array], comparing: [i], found: [minIdx, maxIdx], description: `New Minimum found at index ${i}` });
        }
        if (array[i] > array[maxIdx]) {
            maxIdx = i;
            steps.push({ array: [...array], comparing: [i], found: [minIdx, maxIdx], description: `New Maximum found at index ${i}` });
        }
    }

    steps.push({
        array: [...array],
        comparing: [],
        found: [minIdx, maxIdx],
        description: `Done! Min: ${array[minIdx]} (index ${minIdx}), Max: ${array[maxIdx]} (index ${maxIdx})`
    });
    return steps;
};

export const generateReverseArraySteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    let start = 0;
    let end = array.length - 1;

    steps.push({ array: [...array], comparing: [], description: "Initial State" });

    while (start < end) {
        steps.push({
            array: [...array],
            comparing: [start, end],
            description: `Swapping elements at ${start} and ${end}`
        });

        swap(array, start, end);

        steps.push({
            array: [...array],
            comparing: [start, end],
            swapped: true,
            description: `Swapped ${array[start]} and ${array[end]}`
        });

        start++;
        end--;
    }
    steps.push({ array: [...array], comparing: [], sorted: [...Array(array.length).keys()], description: "Array Reversed!" });
    return steps;
};

// --- Array Algorithms (Continued) ---

export const generateTwoSumSteps = (initialArray, target = 9) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    steps.push({ array: [...array], comparing: [], description: `Finding pair with sum ${target}` });

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            steps.push({
                array: [...array],
                comparing: [i, j],
                description: `Checking ${array[i]} + ${array[j]} = ${array[i] + array[j]}`
            });

            if (array[i] + array[j] === target) {
                steps.push({
                    array: [...array],
                    comparing: [i, j],
                    found: [i, j],
                    description: `Found Pair! ${array[i]} + ${array[j]} = ${target}`
                });
                return steps;
            }
        }
    }
    steps.push({ array: [...array], comparing: [], description: "No pair found." });
    return steps;
};

export const generateMoveZerosSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    let lastNonZero = 0;

    steps.push({ array: [...array], comparing: [], description: "Initial State" });

    for (let i = 0; i < array.length; i++) {
        steps.push({ array: [...array], comparing: [i], description: `Checking element at ${i}: ${array[i]}` });

        if (array[i] !== 0) {
            steps.push({ array: [...array], comparing: [i, lastNonZero], description: `${array[i]} is non-zero.` });

            if (i !== lastNonZero) {
                swap(array, i, lastNonZero);
                steps.push({
                    array: [...array],
                    comparing: [i, lastNonZero],
                    swapped: true,
                    description: `Moved ${array[lastNonZero]} to position ${lastNonZero}`
                });
            }
            lastNonZero++;
        }
    }
    steps.push({ array: [...array], sorted: [...Array(array.length).keys()], description: "Zeros moved to end!" });
    return steps;
};

// --- Registry Mapping ---
export const getAlgorithmGenerator = (id) => {
    // Normalize ID safely handling slashes and spaces
    const key = id.toLowerCase().replace(/['\s/]/g, '-');

    // Fallback for rotation
    const generateRotateArraySteps = (arr) => {
        const steps = [];
        const array = [...arr];
        steps.push({ array: [...array], description: "Initial State. Rotating right by 1 for visualization." });
        const last = array[array.length - 1];
        for (let i = array.length - 1; i > 0; i--) {
            steps.push({ array: [...array], comparing: [i, i - 1], description: `Moving ${array[i - 1]} to index ${i}` });
            array[i] = array[i - 1];
            steps.push({ array: [...array], comparing: [i], swapped: true, description: "Moved." });
        }
        array[0] = last;
        steps.push({ array: [...array], comparing: [0], swapped: true, description: `Placed last element ${last} at start.` });
        return steps;
    };

    // Generic Placeholder for unimplemented algorithms
    const generatePlaceholderSteps = (arr, algoName = "this algorithm") => {
        return [{
            array: [...arr],
            comparing: [],
            description: `Visualization for ${algoName.replace(/-/g, ' ')} is under development. coming soon!`
        }];
    };

    const map = {
        // Sorting
        'bubble-sort': { type: 'sorting', func: generateBubbleSortSteps },
        'selection-sort': { type: 'sorting', func: generateSelectionSortSteps },
        'insertion-sort': { type: 'sorting', func: generateInsertionSortSteps },
        'merge-sort': { type: 'sorting', func: (arr) => generatePlaceholderSteps(arr, 'Merge Sort') },
        'quick-sort': { type: 'sorting', func: (arr) => generatePlaceholderSteps(arr, 'Quick Sort') },
        'heap-sort': { type: 'sorting', func: (arr) => generatePlaceholderSteps(arr, 'Heap Sort') },
        'counting-sort': { type: 'sorting', func: (arr) => generatePlaceholderSteps(arr, 'Counting Sort') },
        'radix-sort': { type: 'sorting', func: (arr) => generatePlaceholderSteps(arr, 'Radix Sort') },

        // Searching
        'linear-search': { type: 'searching', func: generateLinearSearchSteps },
        'binary-search': { type: 'searching', func: generateBinarySearchSteps },
        'rotated-search': { type: 'searching', func: generateLinearSearchSteps }, // Fallback to Linear for now
        'ternary-search': { type: 'searching', func: (arr) => generatePlaceholderSteps(arr, 'Ternary Search') },

        // Array
        'find-max-min': { type: 'array', func: generateFindMaxMinSteps },
        'reverse-array': { type: 'array', func: generateReverseArraySteps },
        'rotate-array': { type: 'array', func: generateRotateArraySteps },
        'two-sum': { type: 'searching', func: generateTwoSumSteps },
        'move-zeros': { type: 'array', func: generateMoveZerosSteps },
        'remove-duplicates': { type: 'array', func: generateMoveZerosSteps }, // Placeholder logic using Move Zeros pattern

        // Dynamic Programming (Fallbacks)
        'fibonacci-dp': { type: 'dp', func: (arr) => generatePlaceholderSteps(arr, 'Fibonacci (DP)') },
        'climbing-stairs': { type: 'dp', func: (arr) => generatePlaceholderSteps(arr, 'Climbing Stairs') },
        'coin-change': { type: 'dp', func: (arr) => generatePlaceholderSteps(arr, 'Coin Change') },

        // Graph (Fallbacks)
        'bfs': { type: 'graph', func: (arr) => generatePlaceholderSteps(arr, 'BFS') },
        'dfs': { type: 'graph', func: (arr) => generatePlaceholderSteps(arr, 'DFS') },
        'dijkstra': { type: 'graph', func: (arr) => generatePlaceholderSteps(arr, 'Dijkstra') },

        // Tree (Fallbacks)
        'traversals': { type: 'tree', func: (arr) => generatePlaceholderSteps(arr, 'Tree Traversals') },

        // Stack/Queue
        'valid-parentheses': { type: 'stack', func: (arr) => generatePlaceholderSteps(arr, 'Valid Parentheses') },

        // Linked List
        'reverse-ll': { type: 'linked-list', func: (arr) => generatePlaceholderSteps(arr, 'Reverse Linked List') },

        // Math
        'prime-check': { type: 'math', func: (arr) => generatePlaceholderSteps(arr, 'Prime Check') },

        // Generic Fallback
        'default': { type: 'sorting', func: generateBubbleSortSteps }
    };

    // Dynamic fallback for any unmapped key
    if (!map[key]) {
        return { type: 'unknown', func: (arr) => generatePlaceholderSteps(arr, key) };
    }

    return map[key];
};
