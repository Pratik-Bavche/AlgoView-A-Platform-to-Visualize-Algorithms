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

    steps.push({
        array: [...array],
        comparing: [],
        sorted: [],
        description: "Initial State: All bars Blue.",
        extraData: { pass: 0, totalPasses: n }
    });

    for (let i = 0; i < n; i++) {
        let hasSwapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                array: [...array],
                comparing: [j, j + 1], // Red
                sorted: [...sortedIndices], // Green
                description: `Comparing ${array[j]} and ${array[j + 1]} to check order.`,
                extraData: { pass: i + 1, totalPasses: n }
            });

            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                hasSwapped = true;
                steps.push({
                    array: [...array],
                    comparing: [j, j + 1],
                    swapped: true,
                    sorted: [...sortedIndices],
                    description: `Since ${array[j + 1]} > ${array[j]} (was ${array[j]} > ${array[j + 1]}), swapping positions.`,
                    extraData: { pass: i + 1, totalPasses: n }
                });
            }
        }
        sortedIndices.push(n - i - 1);
        steps.push({
            array: [...array],
            comparing: [],
            sorted: [...sortedIndices],
            description: `${array[n - i - 1]} is now in its correct sorted position (Green).`,
            extraData: { pass: i + 1, totalPasses: n }
        });
        if (!hasSwapped) {
            // Optimization: If no swaps, array is sorted. Mark all remaining as sorted.
            const remaining = [];
            for (let k = 0; k < n - i - 1; k++) remaining.push(k);
            sortedIndices = [...sortedIndices, ...remaining];
            break;
        }
    }
    steps.push({
        array: [...array],
        comparing: [],
        sorted: [...Array(n).keys()],
        description: "Sorting Complete! All bars are Green.",
        extraData: { pass: n, totalPasses: n }
    });
    return steps;
};

export const generateSelectionSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;
    let sortedIndices = [];

    steps.push({
        array: [...array],
        comparing: [],
        sorted: [],
        description: "Initial State: All bars Blue.",
        extraData: { pass: 0, totalPasses: n }
    });

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        steps.push({
            array: [...array],
            comparing: [minIdx],
            pivot: minIdx, // Yellow for current min
            sorted: [...sortedIndices],
            description: `Starting pass ${i + 1}. Highlighting current minimum candidate (Yellow).`,
            extraData: { pass: i + 1, totalPasses: n }
        });

        for (let j = i + 1; j < n; j++) {
            steps.push({
                array: [...array],
                comparing: [minIdx, j], // Red for comparison
                pivot: minIdx,
                sorted: [...sortedIndices],
                description: `Comparing current minimum ${array[minIdx]} with ${array[j]}.`,
                extraData: { pass: i + 1, totalPasses: n }
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;
                steps.push({
                    array: [...array],
                    comparing: [j],
                    pivot: minIdx, // New Yellow
                    sorted: [...sortedIndices],
                    description: `Found new smaller value: ${array[minIdx]}. Updating minimum.`,
                    extraData: { pass: i + 1, totalPasses: n }
                });
            }
        }

        if (minIdx !== i) {
            steps.push({
                array: [...array],
                comparing: [i, minIdx],
                pivot: minIdx,
                sorted: [...sortedIndices],
                description: `Swapping found minimum ${array[minIdx]} with position ${i}.`,
                extraData: { pass: i + 1, totalPasses: n },
                swapped: true
            });
            swap(array, i, minIdx);
        }

        sortedIndices.push(i);
        steps.push({
            array: [...array],
            comparing: [],
            sorted: [...sortedIndices],
            description: `${array[i]} is now sorted (Green).`,
            extraData: { pass: i + 1, totalPasses: n }
        });
    }
    steps.push({
        array: [...array],
        comparing: [],
        sorted: [...Array(n).keys()],
        description: "Sorted! All elements are Green.",
        extraData: { pass: n, totalPasses: n }
    });
    return steps;
};

export const generateInsertionSortSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    // First element is implicitly sorted
    let sortedIndices = [0];
    steps.push({
        array: [...array],
        comparing: [],
        sorted: [0],
        description: "Initial State. Element at 0 is trivially sorted (Green).",
        extraData: { pass: 1, totalPasses: n - 1 }
    });

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        steps.push({
            array: [...array],
            comparing: [i],
            keyIndex: i, // Yellow (Conceptually key is separated, but here we highlight its index)
            sorted: [...sortedIndices],
            description: `Took key value ${key} (Yellow) to insert into sorted portion.`,
            extraData: { pass: i, totalPasses: n - 1 }
        });

        while (j >= 0 && array[j] > key) {
            steps.push({
                array: [...array],
                comparing: [j],
                keyIndex: i, // We might lose track of 'key' visual pos if we don't track shifting. 
                // Actually in visualization we often swap to simulate shifting.
                sorted: [...sortedIndices],
                description: `Comparing ${key} with ${array[j]}...`,
                extraData: { pass: i, totalPasses: n - 1 }
            });

            // Visualize shift as swap for clarity in bar chart? 
            // Or just overwrite? Standard shift overrides.
            // To make it look nice, we usually 'swap' in viz so the bar travels down.
            array[j + 1] = array[j];
            array[j] = key; // Temporary placement to show movement

            steps.push({
                array: [...array],
                comparing: [j, j + 1],
                swapped: true,
                keyIndex: j, // Key moved to j
                sorted: [...sortedIndices],
                description: `${array[j + 1]} > ${key}, shifting ${array[j + 1]} right.`,
                extraData: { pass: i, totalPasses: n - 1 }
            });

            j = j - 1;
        }
        // Correct sorted indices: 0 to i are sorted
        const currentSorted = Array.from({ length: i + 1 }, (_, k) => k);
        sortedIndices = currentSorted;

        steps.push({
            array: [...array],
            comparing: [],
            sorted: currentSorted,
            description: `Inserted ${key} at correct position. Portion 0-${i} is sorted.`,
            extraData: { pass: i, totalPasses: n - 1 }
        });
    }
    steps.push({
        array: [...array],
        sorted: [...Array(n).keys()],
        description: "Sorted!",
        extraData: { pass: n - 1, totalPasses: n - 1 }
    });
    return steps;
};


// --- Searching Algorithms ---

export const generateLinearSearchSteps = (array, target) => {
    const steps = [];
    const n = array.length;
    steps.push({
        array: [...array],
        comparing: [],
        range: Array.from({ length: n }, (_, i) => i), // Initial Range: All Blue
        description: `Starting Linear Search for target ${target}.`
    });

    for (let i = 0; i < n; i++) {
        steps.push({
            array: [...array],
            comparing: [i], // Yellow (via visualizer logic override or separate prop? We'll use 'comparing' as Yellow/Current)
            range: Array.from({ length: n - i }, (_, k) => k + i), // i to end is active
            extraData: { target },
            checkIndex: i, // Explicit prop for Yellow
            description: `Checking index ${i}: Is ${array[i]} equal to ${target}?`
        });

        if (array[i] === target) {
            steps.push({
                array: [...array],
                found: [i], // Green
                range: [], // Found, so no "search range" needed or keep current?
                extraData: { target },
                checkIndex: i, // Keep highlighted
                description: `Found target ${target} at index ${i}!`
            });
            return steps;
        }
    }
    steps.push({
        array: [...array],
        range: [],
        extraData: { target },
        description: `Target ${target} not found in the array.`
    });
    return steps;
};

export const generateBinarySearchSteps = (array, target) => {
    // Note: Array must be sorted for binary search.
    // We'll trust the user or sort it? Binary Search usually assumes sorted. 
    // If visualized on unsorted, it fails logic. 
    // We'll proceed assuming input is sorted or we must sort it for demonstration?
    // User modifies array... we should sort it internally for this alg or warn?
    // Standard behavior: Just run logic. If array unsorted, it behaves incorrectly which is also educational.

    // HOWEVER, for a good UX, let's sort a copy if we want to guarantee success, 
    // OR just use indices as is. Let's use indices as is but maybe prompt user "Array should be sorted".

    const steps = [];
    let left = 0;
    let right = array.length - 1;
    let mid;

    steps.push({
        array: [...array],
        range: Array.from({ length: array.length }, (_, i) => i),
        pointers: [
            { index: left, label: 'L', color: '#3b82f6' }, // Blue
            { index: right, label: 'R', color: '#3b82f6' }
        ],
        extraData: { target },
        description: `Starting Binary Search. Range: [${left}, ${right}]`
    });

    while (left <= right) {
        mid = Math.floor((left + right) / 2);

        // Active Range Calculation for visualization (Blue)
        const currentRange = [];
        for (let k = left; k <= right; k++) currentRange.push(k);

        steps.push({
            array: [...array],
            range: currentRange, // Blue
            checkIndex: mid, // Yellow
            pointers: [
                { index: left, label: 'L', color: '#3b82f6' },
                { index: right, label: 'R', color: '#3b82f6' },
                { index: mid, label: 'MID', color: '#eab308' } // Yellow
            ],
            extraData: { target, midValue: array[mid] },
            description: `Calculating Mid: (${left} + ${right}) / 2 = ${mid}. Checking value ${array[mid]}.`
        });

        if (array[mid] === target) {
            steps.push({
                array: [...array],
                found: [mid],
                range: currentRange,
                pointers: [
                    { index: mid, label: 'Found', color: '#22c55e' }
                ],
                extraData: { target },
                description: `Target ${target} found at index ${mid}!`
            });
            return steps;
        } else if (array[mid] < target) {
            steps.push({
                array: [...array],
                range: currentRange,
                checkIndex: mid,
                pointers: [
                    { index: left, label: 'L', color: '#3b82f6' },
                    { index: right, label: 'R', color: '#3b82f6' },
                    { index: mid, label: 'MID', color: '#eab308' }
                ],
                extraData: { target, comparison: `${array[mid]} < ${target}` },
                description: `${array[mid]} is smaller than ${target}. Exclude left half.`
            });
            left = mid + 1;
        } else {
            steps.push({
                array: [...array],
                range: currentRange,
                checkIndex: mid,
                pointers: [
                    { index: left, label: 'L', color: '#3b82f6' },
                    { index: right, label: 'R', color: '#3b82f6' },
                    { index: mid, label: 'MID', color: '#eab308' }
                ],
                extraData: { target, comparison: `${array[mid]} > ${target}` },
                description: `${array[mid]} is larger than ${target}. Exclude right half.`
            });
            right = mid - 1;
        }
    }
    steps.push({
        array: [...array],
        range: [],
        pointers: [],
        extraData: { target },
        description: `Target ${target} not found.`
    });
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

    steps.push({
        array: [...array],
        comparing: [],
        description: "Initial State",
        pointers: [
            { index: start, label: 'L', color: '#2563eb' },
            { index: end, label: 'R', color: '#2563eb' }
        ]
    });

    while (start < end) {
        steps.push({
            array: [...array],
            comparing: [start, end],
            pointers: [
                { index: start, label: 'L', color: '#2563eb', position: 'top' },
                { index: end, label: 'R', color: '#2563eb', position: 'top' }
            ],
            description: `Swapping elements at indices ${start} and ${end}`
        });

        swap(array, start, end);

        steps.push({
            array: [...array],
            comparing: [start, end],
            swapped: true,
            pointers: [
                { index: start, label: 'L', color: '#2563eb', position: 'top' },
                { index: end, label: 'R', color: '#2563eb', position: 'top' }
            ],
            description: `Swapped ${array[start]} and ${array[end]}. Moving pointers inward.`
        });

        start++;
        end--;
    }
    steps.push({
        array: [...array],
        comparing: [],
        sorted: [...Array(array.length).keys()],
        description: "Array Reversed!",
        pointers: []
    });
    return steps;
};

// --- Array Algorithms (Continued) ---

export const generateTwoSumSteps = (initialArray, target = 9) => {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    steps.push({
        array: [...array],
        comparing: [],
        description: `Finding pair with sum ${target}`,
        extraData: { target: target }
    });

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const sum = array[i] + array[j];
            steps.push({
                array: [...array],
                comparing: [i, j],
                pointers: [
                    { index: i, label: 'i', color: '#3b82f6', position: 'top' }, // Blue
                    { index: j, label: 'j', color: '#10b981', position: 'bottom' } // Green
                ],
                description: `Checking indices ${i} & ${j}: ${array[i]} + ${array[j]} = ${sum}`,
                extraData: { target: target, currentSum: sum }
            });

            if (sum === target) {
                steps.push({
                    array: [...array],
                    comparing: [i, j],
                    found: [i, j],
                    pointers: [
                        { index: i, label: 'Match', color: '#eab308' }, // Yellow-ish
                        { index: j, label: 'Match', color: '#eab308' }
                    ],
                    description: `Found Pair! ${array[i]} + ${array[j]} = ${target}`,
                    extraData: { target: target, currentSum: sum, result: [i, j] }
                });
                return steps;
            }
        }
    }
    steps.push({ array: [...array], comparing: [], description: "No pair found.", extraData: { target: target } });
    return steps;
};

export const generateMoveZerosSteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    let lastNonZero = 0;

    steps.push({
        array: [...array],
        comparing: [],
        description: "Initial State. Pointer 'Insert' tracks where next non-zero goes.",
        pointers: [{ index: 0, label: 'Insert', color: '#ef4444' }]
    });

    for (let i = 0; i < array.length; i++) {
        steps.push({
            array: [...array],
            comparing: [i],
            pointers: [
                { index: i, label: 'i', color: '#3b82f6' },
                { index: lastNonZero, label: 'Insert', color: '#ef4444' }
            ],
            description: `Checking element at ${i}: ${array[i]}`
        });

        if (array[i] !== 0) {
            const isSwap = i !== lastNonZero;
            steps.push({
                array: [...array],
                comparing: [i, lastNonZero],
                pointers: [
                    { index: i, label: 'i', color: '#3b82f6' },
                    { index: lastNonZero, label: 'Insert', color: '#ef4444' }
                ],
                description: `${array[i]} is non-zero. ${isSwap ? 'Swapping with Insert pos.' : 'Already at Insert pos.'}`
            });

            if (isSwap) {
                swap(array, i, lastNonZero);
                steps.push({
                    array: [...array],
                    comparing: [i, lastNonZero],
                    swapped: true,
                    pointers: [
                        { index: i, label: 'i', color: '#3b82f6' },
                        { index: lastNonZero, label: 'Insert', color: '#ef4444' }
                    ],
                    description: `Moved ${array[lastNonZero]} to position ${lastNonZero}`
                });
            }
            lastNonZero++;
        }
    }
    steps.push({
        array: [...array],
        sorted: [...Array(array.length).keys()],
        pointers: [],
        description: "Zeros moved to end!"
    });
    return steps;
};

export const generateMaxSubarraySteps = (initialArray) => {
    const steps = [];
    const array = [...initialArray];
    let maxSoFar = array[0];
    let maxEndingHere = array[0];
    let start = 0, end = 0, s = 0;

    steps.push({
        array: [...array],
        comparing: [0],
        window: { start: 0, end: 0 },
        extraData: { maxSoFar: maxSoFar, currentSum: maxEndingHere },
        description: "Initial State: Assuming first element is max."
    });

    for (let i = 1; i < array.length; i++) {
        const val = array[i];

        // Step A: Decide whether to extend current subarray or start new
        steps.push({
            array: [...array],
            comparing: [i],
            window: { start: s, end: i - 1 }, // Show previous window
            pointers: [{ index: i, label: 'i', color: '#3b82f6' }],
            extraData: { maxSoFar, currentSum: maxEndingHere, nextVal: val },
            description: `Processing ${val}. Add to current sum (${maxEndingHere + val}) or start new (${val})?`
        });

        if (maxEndingHere + val < val) {
            // Start new window
            s = i;
            maxEndingHere = val;
            steps.push({
                array: [...array],
                comparing: [i],
                window: { start: i, end: i },
                pointers: [{ index: i, label: 'Start New', color: '#ef4444' }],
                extraData: { maxSoFar, currentSum: maxEndingHere },
                description: `Previous sum was negative (or smaller). Starting new subarray at ${i}.`
            });
        } else {
            // Extend
            maxEndingHere += val;
            steps.push({
                array: [...array],
                comparing: [s, i], // Highlight whole range? Just endpoints
                window: { start: s, end: i },
                pointers: [{ index: i, label: 'Extend', color: '#22c55e' }],
                extraData: { maxSoFar, currentSum: maxEndingHere },
                description: `Extended subarray. Current sum is now ${maxEndingHere}.`
            });
        }

        // Step B: Check for max update
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
            start = s;
            end = i;
            steps.push({
                array: [...array],
                comparing: [i],
                window: { start: s, end: i },
                found: [i], // Flash or something
                extraData: { maxSoFar, currentSum: maxEndingHere },
                description: `New Maximum Found: ${maxSoFar}!`
            });
        }
    }

    // Final result
    const resultRange = [];
    for (let k = start; k <= end; k++) resultRange.push(k);

    steps.push({
        array: [...array],
        comparing: [],
        found: resultRange,
        window: { start, end },
        extraData: { maxSoFar },
        description: `Max Subarray Sum is ${maxSoFar}`
    });

    return steps;
};

export const generateRotateArraySteps = (arr) => {
    const steps = [];
    const array = [...arr];
    steps.push({ array: [...array], comparing: [], description: "Initial State. Rotating right by 1 for visualization." });
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

// --- Graph/Tree Algorithms ---

// Helper to create a binary tree structure for visualization
const createBinaryTree = (depth = 3) => {
    const nodes = [];
    const edges = [];
    const maxNodes = Math.pow(2, depth) - 1;

    // Simple BFS to generate positions
    nodes.push({ id: 0, value: 1, x: 50, y: 10, status: 'queued' });

    let q = [{ id: 0, x: 50, y: 10, level: 0, gap: 25 }];
    let count = 1;

    while (q.length > 0 && count < maxNodes) {
        const curr = q.shift();
        if (curr.level >= depth - 1) continue;

        const nextGap = curr.gap / 2;
        const nextY = curr.y + 20;

        // Left Child
        const leftId = count++;
        const leftNode = {
            id: leftId,
            value: Math.floor(Math.random() * 20) + 1,
            x: curr.x - curr.gap,
            y: nextY,
            status: 'default'
        };
        nodes.push(leftNode);
        edges.push({ source: curr.id, target: leftId, status: 'default' });
        q.push({ ...leftNode, level: curr.level + 1, gap: nextGap });

        if (count >= maxNodes) break;

        // Right Child
        const rightId = count++;
        const rightNode = {
            id: rightId,
            value: Math.floor(Math.random() * 20) + 1,
            x: curr.x + curr.gap,
            y: nextY,
            status: 'default'
        };
        nodes.push(rightNode);
        edges.push({ source: curr.id, target: rightId, status: 'default' });
        q.push({ ...rightNode, level: curr.level + 1, gap: nextGap });
    }
    return { nodes, edges };
};

export const generateBFSSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    // Default to tree if invalid input
    if (!graphData) {
        graphData = createBinaryTree(4);
    }
    const { nodes, edges } = graphData;
    nodes.forEach(n => n.status = 'default');

    // Queue for BFS logic
    const queue = [0]; // storing IDs
    const visited = new Set();
    visited.add(0);

    // Initial Step
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    currentNodes[0].status = 'queued'; // Blue

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [...queue], // Display Queue
        description: "Initial State: Root node added to Queue (Blue).",
        count: 0
    });

    let visitCount = 0;

    // Build Adjacency List (Support Undirected)
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        if (e.type !== 'directed') {
            adj[e.target].push(e.source);
        }
    });

    while (queue.length > 0) {
        const currId = queue.shift();

        // 1. Mark as Current (Yellow)
        currentNodes = JSON.parse(JSON.stringify(currentNodes));
        currentNodes[currId].status = 'current';

        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: [...queue],
            description: `Dequeued Node ${currentNodes[currId].value}. Processing neighbors...`,
            count: visitCount
        });

        // 2. Mark as Visited (Green)
        visitCount++;
        currentNodes[currId].status = 'visited';

        // Find neighbors
        const neighbors = adj[currId] || [];

        // Add to queue
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push(neighborId);

                // Highlight edge
                const edgeIdx = currentEdges.findIndex(e =>
                    (e.source === currId && e.target === neighborId) ||
                    (e.type !== 'directed' && e.source === neighborId && e.target === currId)
                );
                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'current';

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: [...queue],
                    description: `Explored edge from ${currentNodes[currId].value} to ${currentNodes[neighborId].value}. Added neighbor to Queue.`,
                    count: visitCount
                });

                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';
            }
        }

        // Mark edges as visited
        edges.filter(e => e.source === currId).forEach(e => {
            const edgeIdx = currentEdges.findIndex(ed => ed.source === e.source && ed.target === e.target);
            if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';
        });
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "BFS Traversal Complete.",
        count: visitCount
    });

    return steps;
};


export const generateDFSSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    if (!graphData) {
        graphData = createBinaryTree(4);
    }
    const { nodes, edges } = graphData;

    nodes.forEach(n => n.status = 'default');

    const stack = [0]; // Stack for DFS
    const visited = new Set();
    const stackContents = [0]; // Separate array to track visuals of the stack

    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    // Build Adjacency List
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        if (e.type !== 'directed') adj[e.target].push(e.source);
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [...stackContents],
        description: `Starting DFS traversal from root Node ${nodes[0].value}.`,
        count: 0
    });

    let visitCount = 0;

    while (stack.length > 0) {
        const u = stack.pop();
        if (visited.has(u)) continue;
        visited.add(u);

        // Update stack display
        const stackIdx = stackContents.indexOf(u);
        if (stackIdx !== -1) stackContents.splice(stackIdx, 1);

        currentNodes = JSON.parse(JSON.stringify(currentNodes));
        currentNodes[u].status = 'current';

        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: [...stackContents],
            description: `Popped Node ${currentNodes[u].value} and visiting.`,
            count: visitCount
        });

        visitCount++;
        currentNodes[u].status = 'visited';

        // Neighbors
        const neighbors = adj[u] || [];
        for (const v of neighbors) {
            if (!visited.has(v)) {
                stack.push(v);
                stackContents.push(v);
                currentNodes[v].status = 'queued';

                // Find and highlight edge
                const edgeIdx = currentEdges.findIndex(e =>
                    (e.source === u && e.target === v) ||
                    (e.type !== 'directed' && e.source === v && e.target === u)
                );
                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'current';

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: [...stackContents],
                    description: `Explored path ${currentNodes[u].value} -> ${currentNodes[v].value}. Pushed neighbor to stack.`,
                    count: visitCount
                });

                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';
            }
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "DFS Traversal Complete.",
        count: visitCount
    });

    return steps;
};

// Tree Helpers
const defineTreeStructure = () => {
    // Hierarchical Layout (Root at top)
    const nodes = [
        { id: 0, x: 50, y: 15, value: '1', status: 'default' }, // Root
        { id: 1, x: 30, y: 35, value: '2', status: 'default' }, // L child of 1
        { id: 2, x: 70, y: 35, value: '3', status: 'default' }, // R child of 1
        { id: 3, x: 15, y: 55, value: '4', status: 'default' }, // L child of 2
        { id: 4, x: 45, y: 55, value: '5', status: 'default' }, // R child of 2
        { id: 5, x: 60, y: 55, value: '6', status: 'default' }, // L child of 3
        { id: 6, x: 85, y: 55, value: '7', status: 'default' }  // R child of 3
    ];

    const edges = [
        { source: 0, target: 1, status: 'default' },
        { source: 0, target: 2, status: 'default' },
        { source: 1, target: 3, status: 'default' },
        { source: 1, target: 4, status: 'default' },
        { source: 2, target: 5, status: 'default' },
        { source: 2, target: 6, status: 'default' }
    ];

    return { nodes, edges };
};

export const generateTreeTraversalSteps = () => {
    const steps = [];
    const { nodes: initialNodes, edges: initialEdges } = defineTreeStructure();

    // Adjacency for traversal logic
    const adj = {
        0: [1, 2], 1: [3, 4], 2: [5, 6], 3: [], 4: [], 5: [], 6: []
    };

    const getTreeState = (activeNodeId, visitedSet, stackOrQueue = []) => {
        return {
            nodes: initialNodes.map(n => {
                if (n.id === activeNodeId) return { ...n, status: 'current' };
                if (visitedSet.has(n.id)) return { ...n, status: 'visited' };
                if (stackOrQueue.includes(n.id)) return { ...n, status: 'queued' };
                return { ...n, status: 'default' };
            }),
            edges: initialEdges.map(e => {
                const isVisited = visitedSet.has(e.source) && (visitedSet.has(e.target) || e.target === activeNodeId);
                return { ...e, status: isVisited ? 'visited' : 'default' };
            }),
            count: visitedSet.size,
            stack: [...stackOrQueue] // Pass for visualization
        };
    };

    // Preorder Traversal Simulation
    const visited = new Set();
    const stack = [0]; // Start with root

    steps.push({
        ...getTreeState(null, visited, stack),
        count: 0,
        description: "Initial Tree Structure. Starting Preorder Traversal (Root -> Left -> Right)."
    });

    while (stack.length > 0) {
        const curr = stack.pop();

        // Step: Visiting Node
        steps.push({
            ...getTreeState(curr, visited, stack),
            count: visited.size,
            description: `Visiting Node ${initialNodes[curr].value}`
        });

        visited.add(curr);

        // Valid children
        const children = adj[curr] || [];
        // Push right then left so left is popped first (LIFO)
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (!visited.has(child)) {
                stack.push(child);
            }
        }

        steps.push({
            ...getTreeState(curr, visited, stack),
            count: visited.size,
            description: `Processed Node ${initialNodes[curr].value}. Count: ${visited.size}`
        });
    }

    steps.push({
        ...getTreeState(null, visited, []),
        count: visited.size,
        description: "Traversal Complete! All nodes visited."
    });

    return steps;
};

// --- Topological Sort & Cycle Detection ---

export const generateTopologicalSortSteps = (inputString) => {
    const steps = [];

    let graphData = parseGraphInput(inputString, true); // Directed

    if (!graphData) {
        // Directed Graph for Topo Sort
        // A -> B, A -> C, B -> D, B -> E, C -> F, E -> G
        const staticNodes = [
            { id: 0, x: 50, y: 10, value: 'A', status: 'default', inDegree: 0 },
            { id: 1, x: 30, y: 35, value: 'B', status: 'default', inDegree: 1 },
            { id: 2, x: 70, y: 35, value: 'C', status: 'default', inDegree: 1 },
            { id: 3, x: 15, y: 60, value: 'D', status: 'default', inDegree: 1 },
            { id: 4, x: 45, y: 60, value: 'E', status: 'default', inDegree: 1 },
            { id: 5, x: 70, y: 60, value: 'F', status: 'default', inDegree: 1 },
            { id: 6, x: 45, y: 85, value: 'G', status: 'default', inDegree: 1 }
        ];

        const staticEdges = [
            { source: 0, target: 1, type: 'directed', status: 'default' },
            { source: 0, target: 2, type: 'directed', status: 'default' },
            { source: 1, target: 3, type: 'directed', status: 'default' },
            { source: 1, target: 4, type: 'directed', status: 'default' },
            { source: 2, target: 5, type: 'directed', status: 'default' },
            { source: 4, target: 6, type: 'directed', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const adj = {};
    nodes.forEach(n => {
        adj[n.id] = [];
        n.inDegree = 0;
    });

    edges.forEach(e => {
        adj[e.source].push(e.target);
        nodes[e.target].inDegree++;
    });
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Initial DAG state. In-degree counts are displayed on nodes."
    });

    const queue = [];
    nodes.forEach(n => {
        if (n.inDegree === 0) {
            queue.push(n.id);
            n.status = 'queued'; // Purple
        }
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: [...queue],
        description: "Added nodes with In-Degree 0 (Node A) to Queue."
    });

    const topoOrder = [];

    while (queue.length > 0) {
        const u = queue.shift();

        let currentNodes = JSON.parse(JSON.stringify(nodes));
        currentNodes[u].status = 'current';

        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: [...queue],
            description: `Processing Node ${currentNodes[u].value}. Adding to sorted order.`
        });

        topoOrder.push(u);
        nodes[u].status = 'visited';

        const neighbors = adj[u] || [];
        for (const v of neighbors) {
            const edgeIdx = edges.findIndex(e => e.source === u && e.target === v);
            if (edgeIdx !== -1) edges[edgeIdx].status = 'current';

            steps.push({
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
                stack: [...queue],
                description: `Removing dependency ${nodes[u].value} -> ${nodes[v].value}. In-Degree of ${nodes[v].value} decreases.`
            });

            nodes[v].inDegree--;

            if (nodes[v].inDegree === 0) {
                queue.push(v);
                nodes[v].status = 'queued';
                steps.push({
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    edges: JSON.parse(JSON.stringify(edges)),
                    stack: [...queue],
                    description: `Node ${nodes[v].value} In-Degree is 0. Added to Queue.`
                });
            }

            if (edgeIdx !== -1) edges[edgeIdx].status = 'visited';
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: [],
        description: `Topological Sort Complete: ${topoOrder.map(id => nodes[id].value).join(' -> ')}`
    });

    return steps;
};

export const generateConnectedComponentsSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    if (!graphData) {
        // Disconnected Graph
        const staticNodes = [
            { id: 0, x: 20, y: 20, value: 'A', status: 'default' },
            { id: 1, x: 40, y: 30, value: 'B', status: 'default' },
            { id: 2, x: 20, y: 50, value: 'C', status: 'default' },
            { id: 3, x: 70, y: 20, value: 'D', status: 'default' },
            { id: 4, x: 85, y: 40, value: 'E', status: 'default' },
            { id: 5, x: 60, y: 70, value: 'F', status: 'default' }
        ];

        const staticEdges = [
            { source: 0, target: 1, status: 'default' },
            { source: 1, target: 2, status: 'default' },
            { source: 0, target: 2, status: 'default' },
            { source: 3, target: 4, status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        if (e.type !== 'directed') adj[e.target].push(e.source);
    });

    const visited = new Set();
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));
    let componentCount = 0;

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Initial Graph with multiple components. We will find them using BFS/DFS."
    });

    for (let i = 0; i < nodes.length; i++) {
        if (!visited.has(i)) {
            componentCount++;
            const q = [i];
            visited.add(i);

            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: JSON.parse(JSON.stringify(currentEdges)),
                stack: [...q],
                description: `Found new component starting at Node ${nodes[i].value}. Assigning Component ID: ${componentCount}`
            });

            while (q.length > 0) {
                const u = q.shift();
                currentNodes[u].status = 'visited';
                currentNodes[u].componentId = componentCount - 1;

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: [...q],
                    description: `Traversing node ${nodes[u].value} in Component ${componentCount}.`
                });

                for (const v of adj[u]) {
                    if (!visited.has(v)) {
                        visited.add(v);
                        q.push(v);
                        currentNodes[v].status = 'current';

                        // Highlight edge
                        const edgeIdx = currentEdges.findIndex(e =>
                            (e.source === u && e.target === v) || (e.source === v && e.target === u)
                        );
                        if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';
                    }
                }
            }

            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: JSON.parse(JSON.stringify(currentEdges)),
                stack: [],
                description: `Finished component ${componentCount}.`
            });
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: `All components found! Total: ${componentCount}`
    });

    return steps;
};


export const generateCycleDetectionSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, true); // Directed

    if (!graphData) {
        // Graph with Cycle: A -> B -> C -> A
        const staticNodes = [
            { id: 0, x: 50, y: 15, value: 'A', status: 'default' },
            { id: 1, x: 80, y: 50, value: 'B', status: 'default' },
            { id: 2, x: 20, y: 50, value: 'C', status: 'default' }
        ];

        const staticEdges = [
            { source: 0, target: 1, type: 'directed', status: 'default' },
            { source: 1, target: 2, type: 'directed', status: 'default' },
            { source: 2, target: 0, type: 'directed', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        if (e.type !== 'directed') adj[e.target].push(e.source);
    });
    const stack = [];
    const visited = new Set();
    const recursionStack = new Set();

    // DFS Helper
    const dfs = (u) => {
        visited.add(u);
        recursionStack.add(u);
        stack.push(u);
        nodes[u].status = 'current'; // Yellow

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: [...stack],
            description: `Visiting Node ${nodes[u].value}. Adding to Recursion Stack.`
        });

        const neighbors = adj[u] || [];
        for (const v of neighbors) {
            const edgeIdx = edges.findIndex(e => e.source === u && e.target === v);

            if (!visited.has(v)) {
                if (edgeIdx !== -1) edges[edgeIdx].status = 'current';
                dfs(v);
            } else if (recursionStack.has(v)) {
                if (edgeIdx !== -1) edges[edgeIdx].status = 'cycle'; // Red
                nodes[v].status = 'cycle'; // Red

                steps.push({
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    edges: JSON.parse(JSON.stringify(edges)),
                    stack: [...stack],
                    description: `CYCLE DETECTED! Back edge from ${nodes[u].value} to ${nodes[v].value}.`
                });
                return true;
            }
            if (edgeIdx !== -1 && edges[edgeIdx].status !== 'cycle') edges[edgeIdx].status = 'visited';
        }

        recursionStack.delete(u);
        stack.pop();
        nodes[u].status = 'visited'; // Green

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: [...stack],
            description: `Finished processing Node ${nodes[u].value}.`
        });
        return false;
    };

    dfs(0);
    return steps;
};

// Placeholder logic again just in case needed for spacing
// AVL specific Visualizer
export const generateAVLRotationSteps = () => {
    const steps = [];

    // Initial State: Unbalanced Tree (Left Heavy)
    // 30 (Root) -> 20 (L) -> 10 (L)
    const initialNodes = [
        { id: 0, x: 50, y: 15, value: '30', status: 'default' }, // A (Root)
        { id: 1, x: 30, y: 35, value: '20', status: 'default' }, // B (Left Child)
        { id: 2, x: 10, y: 55, value: '10', status: 'default' }, // C (Left-Left Grandchild)
        { id: 3, x: 40, y: 55, value: 'T3', status: 'default' }  // B's Right child (Subtree)
    ];

    const initialEdges = [
        { source: 0, target: 1, status: 'default' }, // A -> B
        { source: 1, target: 2, status: 'default' }, // B -> C
        { source: 1, target: 3, status: 'default' }  // B -> T3
    ];

    steps.push({
        nodes: initialNodes,
        edges: initialEdges,
        description: "Initial State: Left-Heavy Tree causing imbalance at Node 30."
    });

    // Step 1: Identify Rotation Pivot
    steps.push({
        nodes: initialNodes.map(n => n.id === 1 ? { ...n, status: 'current' } : n),
        edges: initialEdges,
        description: "Identifying Pivot: Node 20 will become the new Root."
    });

    // Step 2: Highlight Rotation path
    steps.push({
        nodes: initialNodes.map(n =>
            n.id === 1 ? { ...n, status: 'current' } :
                n.id === 0 ? { ...n, status: 'queued' } : n
        ),
        edges: initialEdges.map(e => e.source === 0 && e.target === 1 ? { ...e, status: 'visited' } : e),
        description: "Performing Right Rotation..."
    });

    // Step 3: Rotated State (Balanced)
    // 20 (New Root) -> 10 (L), 30 (R) -> T3 (L of 30)
    const finalNodes = [
        { id: 1, x: 50, y: 15, value: '20', status: 'visited' }, // New Root
        { id: 2, x: 30, y: 35, value: '10', status: 'default' }, // Left Child
        { id: 0, x: 70, y: 35, value: '30', status: 'visited' }, // Right Child (Old Root)
        { id: 3, x: 55, y: 55, value: 'T3', status: 'default' }  // Now Left child of 30
    ];

    const finalEdges = [
        { source: 1, target: 2, status: 'default' }, // 20 -> 10
        { source: 1, target: 0, status: 'visited' }, // 20 -> 30
        { source: 0, target: 3, status: 'default' }  // 30 -> T3
    ];

    // Intermediate transition step (optional visual smoothing could happen here, but direct state swap is okay for discrete steps)
    steps.push({
        nodes: finalNodes,
        edges: finalEdges,
        description: "Rotation Complete! Node 20 is now Root. Node 30 is Right child. T3 moved to Node 30."
    });

    // Final Validation
    steps.push({
        nodes: finalNodes.map(n => ({ ...n, status: 'visited' })),
        edges: finalEdges.map(e => ({ ...e, status: 'visited' })),
        description: "Tree is now Balanced."
    });

    return steps;
};
export const generatePlaceholderSteps = (arr, algoName = "this algorithm") => {
    const steps = [];
    const array = [...arr]; // Fallback array data just in case

    // Initial State Step
    steps.push({
        array: [...array],
        comparing: [],
        nodes: [],
        edges: [],
        // Provide a valid dummy grid for GridVisualizer
        grid: [
            [{ value: '?', status: 'default' }, { value: '?', status: 'default' }, { value: '?', status: 'default' }],
            [{ value: '?', status: 'default' }, { value: '?', status: 'default' }, { value: '?', status: 'default' }]
        ],
        rowLabels: ['Row 1', 'Row 2'],
        colLabels: ['A', 'B', 'C'],
        description: `Visualization for ${algoName.replace(/-/g, ' ')} is under development.`
    });

    // Simulated Animation Loop (5 steps)
    for (let i = 0; i < 5; i++) {
        // Randomly highlight a cell to show "activity"
        const r = Math.floor(Math.random() * 2);
        const c = Math.floor(Math.random() * 3);

        // Create a new grid state
        const newGrid = [
            [{ value: '?', status: 'default' }, { value: '?', status: 'default' }, { value: '?', status: 'default' }],
            [{ value: '?', status: 'default' }, { value: '?', status: 'default' }, { value: '?', status: 'default' }]
        ];
        newGrid[r][c] = { value: '...', status: 'current' };

        steps.push({
            array: [...array],
            comparing: [i, (i + 1) % array.length], // Dummy array compare
            nodes: [],
            edges: [],
            grid: newGrid,
            rowLabels: ['Row 1', 'Row 2'],
            colLabels: ['A', 'B', 'C'],
            description: `Work in progress... (Simulating step ${i + 1})`
        });
    }

    // Final State
    steps.push({
        array: [...array],
        comparing: [],
        sorted: [...Array(array.length).keys()],
        grid: [
            [{ value: '!', status: 'visited' }, { value: '!', status: 'visited' }, { value: '!', status: 'visited' }],
            [{ value: '!', status: 'visited' }, { value: '!', status: 'visited' }, { value: '!', status: 'visited' }]
        ],
        rowLabels: ['Row 1', 'Row 2'],
        colLabels: ['A', 'B', 'C'],
        description: `Stay tuned for updates on ${algoName.replace(/-/g, ' ')}!`
    });

    return steps;
};

// --- MST Algorithms ---

export const generatePrimSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    if (!graphData) {
        // Graph for MST (Undirected)
        const staticNodes = [
            { id: 0, x: 20, y: 50, value: 'A', status: 'default' },
            { id: 1, x: 50, y: 20, value: 'B', status: 'default' },
            { id: 2, x: 50, y: 80, value: 'C', status: 'default' },
            { id: 3, x: 80, y: 50, value: 'D', status: 'default' },
            { id: 4, x: 50, y: 50, value: 'E', status: 'default' }
        ];

        const staticEdges = [
            { source: 0, target: 1, weight: 2, status: 'default' }, // A-B
            { source: 0, target: 2, weight: 3, status: 'default' }, // A-C
            { source: 1, target: 3, weight: 5, status: 'default' }, // B-D
            { source: 1, target: 4, weight: 2, status: 'default' }, // B-E
            { source: 2, target: 4, weight: 1, status: 'default' }, // C-E (Smallest!)
            { source: 4, target: 3, weight: 1, status: 'default' }  // E-D (Smallest!)
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push({ to: e.target, w: e.weight });
        adj[e.target].push({ to: e.source, w: e.weight });
    });

    let totalCost = 0;
    let selectedCount = 0;
    const totalNeeds = nodes.length - 1;
    let visited = new Set();

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: [],
        mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
        description: "Initial Undirected Graph. Starting Prim's Algorithm from Node A."
    });

    // Start from 0
    let pq = []; // Priority Queue for edges: { u, v, w }
    visited.add(0);
    nodes[0].status = 'visited'; // Part of MST

    // Add initial edges
    adj[0].forEach(n => pq.push({ u: 0, v: n.to, w: n.w }));

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: pq.map(e => `${e.w}: ${nodes[e.u].value}-${nodes[e.v].value}`).sort(),
        mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
        description: "Added connected edges from Start Node A to the Frontier (Priority Queue)."
    });

    while (selectedCount < totalNeeds && pq.length > 0) {
        // Sort PQ
        pq.sort((a, b) => a.w - b.w);
        const bestEdge = pq.shift();

        // Visual: Considering this edge
        const edgeIdx = edges.findIndex(e =>
            (e.source === bestEdge.u && e.target === bestEdge.v) ||
            (e.source === bestEdge.v && e.target === bestEdge.u)
        );
        if (edgeIdx !== -1) edges[edgeIdx].status = 'current'; // Yellow

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: pq.map(e => `${e.w}: ${nodes[e.u].value}-${nodes[e.v].value}`),
            mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
            description: `Considering minimum edge ${nodes[bestEdge.u].value}-${nodes[bestEdge.v].value} (Weight: ${bestEdge.w}).`
        });

        if (visited.has(bestEdge.v)) {
            // Reject - Cycle/Already visited
            if (edgeIdx !== -1) edges[edgeIdx].status = 'default'; // Reset
            steps.push({
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
                stack: pq.map(e => `${e.w}: ${nodes[e.u].value}-${nodes[e.v].value}`),
                mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
                description: `Node ${nodes[bestEdge.v].value} is already in MST. Skipping edge.`
            });
            continue;
        }

        // Add to MST
        visited.add(bestEdge.v);
        selectedCount++;
        totalCost += bestEdge.w;
        if (edgeIdx !== -1) edges[edgeIdx].status = 'visited'; // Green
        nodes[bestEdge.v].status = 'visited';

        // Add new edges
        adj[bestEdge.v].forEach(n => {
            if (!visited.has(n.to)) {
                pq.push({ u: bestEdge.v, v: n.to, w: n.w });
            }
        });

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: pq.map(e => `${e.w}: ${nodes[e.u].value}-${nodes[e.v].value}`).sort(),
            mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
            description: `Selected Edge ${nodes[bestEdge.u].value}-${nodes[bestEdge.v].value}. Added Node ${nodes[bestEdge.v].value} to MST.`
        });
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: [],
        mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
        description: selectedCount === totalNeeds
            ? `Prim's Algorithm Complete! Minimum Spanning Tree formed with total cost: ${totalCost}.`
            : `Prim's Algorithm Finished. Graph is disconnected; formed MST for the reachable component only.`
    });

    return steps;
};


export const generateKruskalSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    if (!graphData) {
        // Same Graph
        const staticNodes = [
            { id: 0, x: 20, y: 50, value: 'A', status: 'default' },
            { id: 1, x: 50, y: 20, value: 'B', status: 'default' },
            { id: 2, x: 50, y: 80, value: 'C', status: 'default' },
            { id: 3, x: 80, y: 50, value: 'D', status: 'default' },
            { id: 4, x: 50, y: 50, value: 'E', status: 'default' }
        ];

        const staticEdges = [
            { id: 0, source: 0, target: 1, weight: 2, status: 'default' },
            { id: 1, source: 0, target: 2, weight: 3, status: 'default' },
            { id: 2, source: 1, target: 3, weight: 5, status: 'default' },
            { id: 3, source: 1, target: 4, weight: 2, status: 'default' },
            { id: 4, source: 2, target: 4, weight: 1, status: 'default' },
            { id: 5, source: 4, target: 3, weight: 1, status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    // Add IDs to edges if missing
    edges.forEach((e, idx) => { if (e.id === undefined) e.id = idx; });

    let totalCost = 0;
    let selectedCount = 0;
    const totalNeeds = nodes.length - 1;

    // Union Find Init
    const parent = Array.from({ length: nodes.length }, (_, i) => i);
    const find = (i) => {
        if (parent[i] === i) return i;
        return find(parent[i]);
    };
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    };

    // Sort Edges
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: sortedEdges.map(e => `${e.weight}: ${nodes[e.source].value}-${nodes[e.target].value}`),
        mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
        description: "Initial State. Edges sorted by weight (see panel)."
    });

    // Process Edges
    for (let i = 0; i < sortedEdges.length; i++) {
        const edge = sortedEdges[i];

        // Highlight logic
        const originalEdgeIdx = edges.findIndex(e => e.id === edge.id);
        if (originalEdgeIdx !== 1) edges[originalEdgeIdx].status = 'current'; // Yellow

        steps.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            stack: sortedEdges.slice(i).map(e => `${e.weight}: ${nodes[e.source].value}-${nodes[e.target].value}`),
            mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
            description: `Considering minimum edge ${nodes[edge.source].value}-${nodes[edge.target].value} (Weight: ${edge.weight}).`
        });

        if (union(edge.source, edge.target)) {
            // Selected
            selectedCount++;
            totalCost += edge.weight;
            edges[originalEdgeIdx].status = 'visited'; // Green
            nodes[edge.source].status = 'visited';
            nodes[edge.target].status = 'visited';

            steps.push({
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
                stack: sortedEdges.slice(i + 1).map(e => `${e.weight}: ${nodes[e.source].value}-${nodes[e.target].value}`),
                mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
                description: `Accepted! Merged components ${nodes[edge.source].value} and ${nodes[edge.target].value}.`
            });
        } else {
            // Cycle detected
            edges[originalEdgeIdx].status = 'cycle'; // Red
            steps.push({
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
                stack: sortedEdges.slice(i + 1).map(e => `${e.weight}: ${nodes[e.source].value}-${nodes[e.target].value}`),
                mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
                description: `Rejected! Edge ${nodes[edge.source].value}-${nodes[edge.target].value} forms a cycle.`
            });
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        stack: [],
        mstStats: { selected: selectedCount, totalNeeds, cost: totalCost },
        description: "Kruskal's Algorithm Complete."
    });

    return steps;
};


export const generateDijkstraSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, true); // Often directed

    if (!graphData) {
        // Directed Weighted Graph
        const staticNodes = [
            { id: 0, x: 15, y: 50, value: 'A', status: 'default', distance: 0 },
            { id: 1, x: 40, y: 25, value: 'B', status: 'default', distance: Infinity },
            { id: 2, x: 40, y: 75, value: 'C', status: 'default', distance: Infinity },
            { id: 3, x: 65, y: 25, value: 'D', status: 'default', distance: Infinity },
            { id: 4, x: 65, y: 75, value: 'E', status: 'default', distance: Infinity },
            { id: 5, x: 90, y: 50, value: 'F', status: 'default', distance: Infinity }
        ];

        const staticEdges = [
            { source: 0, target: 1, weight: 4, type: 'directed', status: 'default' },
            { source: 0, target: 2, weight: 2, type: 'directed', status: 'default' },
            { source: 1, target: 3, weight: 5, type: 'directed', status: 'default' },
            { source: 1, target: 2, weight: 1, type: 'directed', status: 'default' },
            { source: 2, target: 4, weight: 8, type: 'directed', status: 'default' },
            { source: 2, target: 1, weight: 3, type: 'directed', status: 'default' },
            { source: 3, target: 5, weight: 7, type: 'directed', status: 'default' },
            { source: 3, target: 4, weight: 2, type: 'directed', status: 'default' },
            { source: 4, target: 5, weight: 3, type: 'directed', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const adj = {};
    nodes.forEach(n => {
        adj[n.id] = [];
        if (n.distance === undefined) n.distance = n.id === 0 ? 0 : Infinity;
    });
    edges.forEach(e => {
        adj[e.source].push({ to: e.target, w: e.weight });
        if (e.type !== 'directed') adj[e.target].push({ to: e.source, w: e.weight });
    });

    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));
    const visited = new Set();
    const pq = [{ id: 0, dist: 0 }];

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: pq.map(i => `${nodes[i.id].value}: ${i.dist}`),
        description: `Starting Dijkstra's from Node ${nodes[0].value}. Target: Shortest path to all nodes.`
    });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { id, dist } = pq.shift();

        if (visited.has(id)) continue;
        visited.add(id);

        currentNodes[id].status = 'current';
        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: pq.map(i => `${nodes[i.id].value}: ${i.dist}`),
            description: `Exploring Node ${currentNodes[id].value} with smallest known distance ${dist}.`
        });

        currentNodes[id].status = 'visited';

        for (const neighbor of adj[id]) {
            if (!visited.has(neighbor.to)) {
                const newDist = dist + neighbor.w;

                // Find edge
                const edgeIdx = currentEdges.findIndex(e =>
                    (e.source === id && e.target === neighbor.to) ||
                    (e.type !== 'directed' && e.source === neighbor.to && e.target === id)
                );
                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'current';

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: pq.map(i => `${nodes[i.id].value}: ${i.dist}`),
                    description: `Checking neighbor ${nodes[neighbor.to].value} via ${currentNodes[id].value}. New distance could be ${dist} + ${neighbor.w} = ${newDist}.`
                });

                if (newDist < currentNodes[neighbor.to].distance) {
                    currentNodes[neighbor.to].distance = newDist;
                    pq.push({ id: neighbor.to, dist: newDist });
                    if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';

                    steps.push({
                        nodes: JSON.parse(JSON.stringify(currentNodes)),
                        edges: JSON.parse(JSON.stringify(currentEdges)),
                        stack: pq.map(i => `${nodes[i.id].value}: ${i.dist}`),
                        description: `Updated distance for ${nodes[neighbor.to].value} to ${newDist}.`
                    });
                } else if (edgeIdx !== -1) {
                    currentEdges[edgeIdx].status = 'default';
                }
            }
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Dijkstra's Algorithm Complete. Shortest paths from source are found."
    });

    return steps;
};

export const generateBellmanFordSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, true);

    if (!graphData) {
        const staticNodes = [
            { id: 0, x: 15, y: 50, value: 'A', status: 'default', distance: 0 },
            { id: 1, x: 40, y: 25, value: 'B', status: 'default', distance: Infinity },
            { id: 2, x: 40, y: 75, value: 'C', status: 'default', distance: Infinity },
            { id: 3, x: 65, y: 50, value: 'D', status: 'default', distance: Infinity },
            { id: 4, x: 90, y: 50, value: 'E', status: 'default', distance: Infinity }
        ];

        const staticEdges = [
            { source: 0, target: 1, weight: 6, type: 'directed', status: 'default' },
            { source: 0, target: 2, weight: 7, type: 'directed', status: 'default' },
            { source: 1, target: 2, weight: 8, type: 'directed', status: 'default' },
            { source: 1, target: 3, weight: -4, type: 'directed', status: 'default' },
            { source: 1, target: 4, weight: 5, type: 'directed', status: 'default' },
            { source: 2, target: 3, weight: 9, type: 'directed', status: 'default' },
            { source: 2, target: 4, weight: -3, type: 'directed', status: 'default' },
            { source: 3, target: 1, weight: 2, type: 'directed', status: 'default' },
            { source: 4, target: 3, weight: 7, type: 'directed', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    currentNodes.forEach(n => {
        if (n.distance === undefined) n.distance = n.id === 0 ? 0 : Infinity;
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: `Starting Bellman-Ford from Node ${nodes[0].value}. We will relax all edges |V|-1 times.`
    });

    const V = nodes.length;
    let negativeCycle = false;

    for (let i = 1; i <= V; i++) {
        let changed = false;
        const isLastIteration = (i === V);

        for (let j = 0; j < edges.length; j++) {
            const edge = edges[j];
            const u = edge.source;
            const v = edge.target;
            const w = edge.weight;

            currentEdges[j].status = 'current'; // Orange
            currentNodes[u].status = 'current'; // Yellow

            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: JSON.parse(JSON.stringify(currentEdges)),
                stack: [],
                description: isLastIteration
                    ? `Checking for negative cycle: Relaxing edge ${nodes[u].value} -> ${nodes[v].value} (Weight: ${w}).`
                    : `Iteration ${i}: Relaxing edge ${nodes[u].value} -> ${nodes[v].value} (Weight: ${w}).`
            });

            if (currentNodes[u].distance !== Infinity && currentNodes[u].distance + w < currentNodes[v].distance) {
                if (isLastIteration) {
                    negativeCycle = true;
                    currentNodes[v].status = 'cycle';
                    currentEdges[j].status = 'cycle';
                } else {
                    currentNodes[v].distance = currentNodes[u].distance + w;
                    currentNodes[v].status = 'visited';
                    currentEdges[j].status = 'visited';
                    changed = true;
                }

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: [],
                    description: isLastIteration
                        ? `NEGATIVE CYCLE DETECTED! Distance to ${nodes[v].value} can still be reduced.`
                        : `Updated distance of ${nodes[v].value} to ${currentNodes[v].distance}.`
                });

                if (negativeCycle) break;
            }

            currentEdges[j].status = currentEdges[j].status === 'cycle' ? 'cycle' : (currentEdges[j].status === 'visited' ? 'visited' : 'default');
            currentNodes[u].status = currentNodes[u].status === 'visited' ? 'visited' : 'visited';
            currentNodes[v].status = currentNodes[v].status === 'visited' || currentNodes[v].status === 'cycle' ? currentNodes[v].status : 'visited';
        }

        if (negativeCycle) break;
        if (!changed && !isLastIteration) {
            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: JSON.parse(JSON.stringify(currentEdges)),
                stack: [],
                description: `No changes in iteration ${i}. Optimization: Shortest paths found early.`
            });
            break;
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: negativeCycle
            ? "Bellman-Ford Complete: Negative cycle detected! Shortest paths are undefined."
            : "Bellman-Ford Complete: Shortest paths found for all nodes."
    });

    return steps;
};

export const generateBipartiteCheckSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);
    if (!graphData) {
        const staticNodes = [
            { id: 0, x: 20, y: 30, value: 'A', status: 'default' },
            { id: 1, x: 50, y: 30, value: 'B', status: 'default' },
            { id: 2, x: 80, y: 30, value: 'C', status: 'default' },
            { id: 3, x: 35, y: 70, value: 'D', status: 'default' },
            { id: 4, x: 65, y: 70, value: 'E', status: 'default' }
        ];
        const staticEdges = [
            { source: 0, target: 3, type: 'undirected', status: 'default' },
            { source: 0, target: 4, type: 'undirected', status: 'default' },
            { source: 1, target: 3, type: 'undirected', status: 'default' },
            { source: 1, target: 4, type: 'undirected', status: 'default' },
            { source: 2, target: 4, type: 'undirected', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }
    const { nodes, edges } = graphData;
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));
    const colors = {}; // 0 or 1
    const queue = [];

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        adj[e.target].push(e.source);
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Initial Graph. We will try to color the graph with 2 colors (Red and Purple) such that no adjacent nodes have the same color."
    });

    for (let i = 0; i < nodes.length; i++) {
        if (colors[i] === undefined) {
            colors[i] = 0;
            queue.push(i);
            currentNodes[i].componentId = 0; // Use componentId for coloring logic in visualizer if needed, or status
            currentNodes[i].status = 'visited'; // Color A

            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: JSON.parse(JSON.stringify(currentEdges)),
                stack: [i],
                description: `Starting BFS from Node ${nodes[i].value}. Coloring it with first color.`
            });

            while (queue.length > 0) {
                const u = queue.shift();
                for (const v of adj[u]) {
                    if (colors[v] === undefined) {
                        colors[v] = 1 - colors[u];
                        queue.push(v);
                        currentNodes[v].componentId = colors[v];
                        currentNodes[v].status = 'visited';

                        const edgeIdx = currentEdges.findIndex(e => (e.source === u && e.target === v) || (e.source === v && e.target === u));
                        if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';

                        steps.push({
                            nodes: JSON.parse(JSON.stringify(currentNodes)),
                            edges: JSON.parse(JSON.stringify(currentEdges)),
                            stack: [...queue],
                            description: `Coloring neighbor ${nodes[v].value} with opposite color (${colors[v] === 0 ? 'Color 1' : 'Color 2'}).`
                        });
                    } else if (colors[v] === colors[u]) {
                        // Conflict!
                        currentNodes[v].status = 'cycle';
                        currentNodes[u].status = 'cycle';
                        const edgeIdx = currentEdges.findIndex(e => (e.source === u && e.target === v) || (e.source === v && e.target === u));
                        if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'cycle';

                        steps.push({
                            nodes: JSON.parse(JSON.stringify(currentNodes)),
                            edges: JSON.parse(JSON.stringify(currentEdges)),
                            stack: [],
                            description: `CONFLICT! Neighbor ${nodes[v].value} already has the same color as ${nodes[u].value}. The graph is NOT bipartite.`
                        });
                        return steps;
                    }
                }
            }
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "BFS Complete. No conflicts found. The graph IS bipartite."
    });
    return steps;
};


export const generateSCCKosarajuSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, true);
    if (!graphData) {
        const staticNodes = [
            { id: 0, x: 20, y: 30, value: 'A', status: 'default' },
            { id: 1, x: 50, y: 30, value: 'B', status: 'default' },
            { id: 2, x: 80, y: 30, value: 'C', status: 'default' },
            { id: 3, x: 20, y: 70, value: 'D', status: 'default' },
            { id: 4, x: 50, y: 70, value: 'E', status: 'default' }
        ];
        const staticEdges = [
            { source: 0, target: 1, type: 'directed', status: 'default' },
            { source: 1, target: 2, type: 'directed', status: 'default' },
            { source: 2, target: 0, type: 'directed', status: 'default' },
            { source: 1, target: 3, type: 'directed', status: 'default' },
            { source: 3, target: 4, type: 'directed', status: 'default' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }
    const { nodes, edges } = graphData;
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    const adj = {};
    const revAdj = {};
    nodes.forEach(n => { adj[n.id] = []; revAdj[n.id] = []; });
    edges.forEach(e => {
        adj[e.source].push(e.target);
        revAdj[e.target].push(e.source);
    });

    const stack = [];
    const visited = new Set();

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Kosaraju's Algorithm. Pass 1: Perform DFS to get nodes in order of finishing times."
    });

    const dfs1 = (u) => {
        visited.add(u);
        currentNodes[u].status = 'current';
        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: [...stack],
            description: `DFS Pass 1: Visiting Node ${nodes[u].value}.`
        });

        for (const v of adj[u]) {
            if (!visited.has(v)) {
                dfs1(v);
            }
        }
        stack.push(u);
        currentNodes[u].status = 'visited';
        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: [...stack],
            description: `DFS Pass 1: Finished Node ${nodes[u].value}. Added to finishing stack.`
        });
    };

    for (let i = 0; i < nodes.length; i++) {
        if (!visited.has(i)) dfs1(i);
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [...stack],
        description: "Pass 1 complete. Stack now contains nodes in finishing order. Now transposing the graph."
    });

    // Reset for Step 2
    visited.clear();
    currentNodes.forEach(n => { n.status = 'default'; });
    const transposedEdges = JSON.parse(JSON.stringify(currentEdges)).map(e => ({
        ...e,
        source: e.target,
        target: e.source
    }));

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: transposedEdges,
        stack: [...stack],
        description: "Pass 2: Graph Transposed. Processing stack in reverse to find components."
    });

    let sccCount = 0;
    while (stack.length > 0) {
        const u = stack.pop();
        if (!visited.has(u)) {
            sccCount++;
            const comp = [];
            const dfs2 = (curr) => {
                visited.add(curr);
                comp.push(curr);
                currentNodes[curr].status = 'visited';
                currentNodes[curr].componentId = sccCount - 1;
                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: transposedEdges,
                    stack: [...stack],
                    description: `DFS Pass 2: Exploring SCC ${sccCount}. Node ${nodes[curr].value} added.`
                });
                for (const v of revAdj[curr]) {
                    if (!visited.has(v)) dfs2(v);
                }
            };
            dfs2(u);
            steps.push({
                nodes: JSON.parse(JSON.stringify(currentNodes)),
                edges: transposedEdges,
                stack: [...stack],
                description: `Finished finding SCC ${sccCount}: Nodes {${comp.map(id => nodes[id].value).join(', ')}}`
            });
        }
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)), // Original edges
        stack: [],
        description: `Kosaraju's Algorithm Complete. Found ${sccCount} Strongly Connected Components.`
    });

    return steps;
};


export const generateFloydWarshallSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, true);

    if (!graphData) {
        const staticNodes = [
            { id: 0, x: 25, y: 25, value: 'A' },
            { id: 1, x: 75, y: 25, value: 'B' },
            { id: 2, x: 25, y: 75, value: 'C' },
            { id: 3, x: 75, y: 75, value: 'D' }
        ];
        const staticEdges = [
            { source: 0, target: 1, weight: 3, type: 'directed' },
            { source: 1, target: 2, weight: 4, type: 'directed' },
            { source: 2, target: 0, weight: 5, type: 'directed' },
            { source: 0, target: 3, weight: 10, type: 'directed' },
            { source: 2, target: 3, weight: 1, type: 'directed' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    const n = nodes.length;
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    edges.forEach(e => {
        dist[e.source][e.target] = e.weight;
        if (e.type !== 'directed') dist[e.target][e.source] = e.weight;
    });

    const labels = nodes.map(node => node.value);

    const getGrid = (matrix, k, i, j) => {
        return matrix.map((row, r) => row.map((val, c) => ({
            value: val === Infinity ? '∞' : val,
            status: (r === i && c === j) ? 'current' :
                (r === i && c === k) || (r === k && c === j) ? 'dependency' :
                    (val !== Infinity ? 'visited' : 'default')
        })));
    };

    steps.push({
        grid: getGrid(dist, -1, -1, -1),
        rowLabels: labels,
        colLabels: labels,
        description: "Initial Distance Matrix. Diagonals are 0, edges have weights, others are ∞."
    });

    for (let k = 0; k < n; k++) {
        steps.push({
            grid: getGrid(dist, k, -1, -1),
            rowLabels: labels,
            colLabels: labels,
            description: `Iteration k = ${labels[k]}. Using Node ${labels[k]} as intermediate pivot.`
        });

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === k || j === k) continue;

                const oldVal = dist[i][j];
                const throughK = dist[i][k] + dist[k][j];

                if (throughK < oldVal) {
                    dist[i][j] = throughK;
                    steps.push({
                        grid: getGrid(dist, k, i, j),
                        rowLabels: labels,
                        colLabels: labels,
                        description: `Found shorter path from ${labels[i]} to ${labels[j]} through ${labels[k]}: ${oldVal === Infinity ? '∞' : oldVal} -> ${throughK}`
                    });
                }
            }
        }
    }

    steps.push({
        grid: getGrid(dist, -1, -1, -1),
        rowLabels: labels,
        colLabels: labels,
        description: "Floyd-Warshall Complete. All-pairs shortest paths computed."
    });

    return steps;
};


export const generateMultiSourceBFSSteps = (inputString) => {
    const steps = [];
    let graphData = parseGraphInput(inputString, false);

    if (!graphData) {
        const staticNodes = [
            { id: 0, x: 15, y: 50, value: 'A' },
            { id: 1, x: 40, y: 30, value: 'B' },
            { id: 2, x: 40, y: 70, value: 'C' },
            { id: 3, x: 65, y: 50, value: 'D' },
            { id: 4, x: 90, y: 50, value: 'E' }
        ];
        const staticEdges = [
            { source: 0, target: 1, type: 'undirected' },
            { source: 1, target: 3, type: 'undirected' },
            { source: 4, target: 3, type: 'undirected' },
            { source: 4, target: 2, type: 'undirected' },
            { source: 2, target: 0, type: 'undirected' }
        ];
        graphData = { nodes: staticNodes, edges: staticEdges };
    }

    const { nodes, edges } = graphData;
    let currentNodes = JSON.parse(JSON.stringify(nodes));
    let currentEdges = JSON.parse(JSON.stringify(edges));

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push(e.target);
        if (e.type !== 'directed') adj[e.target].push(e.source);
    });

    const sourceIndices = nodes.length >= 2 ? [0, nodes.length - 1] : [nodes.length > 0 ? 0 : null].filter(x => x !== null);
    const queue = [...sourceIndices];
    const visited = new Set(sourceIndices);

    sourceIndices.forEach(idx => {
        if (currentNodes[idx]) currentNodes[idx].status = 'visited';
    });

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [...queue],
        description: "Multi-Source BFS: Starting from multiple nodes simultaneously (A and E)."
    });

    while (queue.length > 0) {
        const u = queue.shift();
        currentNodes[u].status = 'current';

        steps.push({
            nodes: JSON.parse(JSON.stringify(currentNodes)),
            edges: JSON.parse(JSON.stringify(currentEdges)),
            stack: [...queue],
            description: `Exploring neighbors of Node ${nodes[u].value}.`
        });

        for (const v of adj[u]) {
            if (!visited.has(v)) {
                visited.add(v);
                queue.push(v);
                currentNodes[v].status = 'queued';

                const edgeIdx = currentEdges.findIndex(e =>
                    (e.source === u && e.target === v) ||
                    (e.type !== 'directed' && e.source === v && e.target === u)
                );
                if (edgeIdx !== -1) currentEdges[edgeIdx].status = 'visited';

                steps.push({
                    nodes: JSON.parse(JSON.stringify(currentNodes)),
                    edges: JSON.parse(JSON.stringify(currentEdges)),
                    stack: [...queue],
                    description: `Found unvisited neighbor ${nodes[v].value}. Adding to queue.`
                });
            }
        }
        currentNodes[u].status = 'visited';
    }

    steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
        stack: [],
        description: "Multi-Source BFS Complete. All reachable nodes visited."
    });

    return steps;
};


// --- DP Algorithms ---

export const generateFibonacciDPSteps = () => {
    const steps = [];
    const n = 10;
    const dp = Array(n + 1).fill(null);

    // Grid 1D: [[...]]
    const createGrid = (arr, activeIdx, deps = []) => {
        return [arr.map((val, idx) => ({
            value: val === null ? '' : val,
            status: idx === activeIdx ? 'current' :
                (deps.includes(idx) ? 'dependency' :
                    (val !== null ? 'visited' : 'default'))
        }))];
    };

    steps.push({
        grid: createGrid(dp, -1),
        rowLabels: ['Val'],
        colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
        description: `Calculating Fibonacci(${n}). Initializing DP array size ${n + 1}.`
    });

    // Base Cases
    dp[0] = 0;
    dp[1] = 1;
    steps.push({
        grid: createGrid(dp, 1, [0]), // Highlight 0 and 1
        rowLabels: ['Val'],
        colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
        description: "Base cases: F(0)=0, F(1)=1."
    });

    for (let i = 2; i <= n; i++) {
        // Highlight dependencies
        steps.push({
            grid: createGrid(dp, i, [i - 1, i - 2]),
            rowLabels: ['Val'],
            colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
            description: `Calculating F(${i}) = F(${i - 1}) + F(${i - 2}). Using values ${dp[i - 1]} and ${dp[i - 2]}.`
        });

        dp[i] = dp[i - 1] + dp[i - 2];

        // Fill Value
        steps.push({
            grid: createGrid(dp, i, []), // Just show computed
            rowLabels: ['Val'],
            colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
            description: `F(${i}) = ${dp[i]}. Stored in table.`
        });
    }

    return steps;
};

export const generateKnapsackSteps = () => {
    const steps = [];
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];
    const capacity = 7;
    const n = weights.length;

    // DP Table: (n+1) x (capacity+1)
    let dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    // Helper to generate grid state
    const createGrid = (table, currI, currW, deps = []) => {
        return table.map((row, rIdx) => row.map((val, cIdx) => {
            let status = 'default';
            if (rIdx === currI && cIdx === currW) status = 'current'; // Yellow
            else if (deps.some(d => d.r === rIdx && d.c === cIdx)) status = 'dependency'; // Blue
            else if (rIdx < currI || (rIdx === currI && cIdx < currW)) status = 'visited'; // Green
            return { value: val, status };
        }));
    };

    const rowLabs = ['-', ...weights.map((w, i) => `Item ${i + 1} (w:${w}, v:${values[i]})`)];
    const colLabs = Array.from({ length: capacity + 1 }, (_, i) => i.toString());

    steps.push({
        grid: createGrid(dp, -1, -1),
        rowLabels: rowLabs,
        colLabels: colLabs,
        description: "0/1 Knapsack. Rows: Items, Cols: Capacity. Initializing with 0."
    });

    for (let i = 1; i <= n; i++) {
        const wt = weights[i - 1];
        const val = values[i - 1];
        for (let w = 0; w <= capacity; w++) {
            // Highlighting Phase
            let deps = [{ r: i - 1, c: w }]; // Always compare with exclude
            if (w >= wt) deps.push({ r: i - 1, c: w - wt }); // And include if possible

            steps.push({
                grid: createGrid(dp, i, w, deps),
                rowLabels: rowLabs,
                colLabels: colLabs,
                description: `Calc dp[${i}][${w}]. Options: Exclude (Val: ${dp[i - 1][w]}) vs Include (Item Val ${val} + dp[${i - 1}][${w - wt}]).`
            });

            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }

            steps.push({
                grid: createGrid(dp, i, w),
                rowLabels: rowLabs,
                colLabels: colLabs,
                description: `Result: ${dp[i][w]}.`
            });
        }
    }

    return steps;
};

export const generateLCSSteps = () => {
    const steps = [];
    const s1 = "ABCDE";
    const s2 = "ACE";
    const n = s1.length;
    const m = s2.length;
    let dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    const createGrid = (table, currI, currJ, deps = []) => {
        return table.map((row, rIdx) => row.map((val, cIdx) => {
            let status = 'default';
            if (rIdx === currI && cIdx === currJ) status = 'current';
            else if (deps.some(d => d.r === rIdx && d.c === cIdx)) status = 'dependency';
            else if (table[rIdx][cIdx] !== 0 || (rIdx === 0 || cIdx === 0)) status = 'visited'; // Mark filled
            if (val === 0 && status === 'default') status = 'default'; // Keep 0s grey if untouched
            return { value: val, status };
        }));
    };

    const rowLabs = ['-', ...s1.split('')];
    const colLabs = ['-', ...s2.split('')];

    steps.push({
        grid: createGrid(dp, -1, -1),
        rowLabels: rowLabs,
        colLabels: colLabs,
        description: "LCS Table. Finding longest common subsequence length."
    });

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const char1 = s1[i - 1];
            const char2 = s2[j - 1];

            if (char1 === char2) {
                steps.push({
                    grid: createGrid(dp, i, j, [{ r: i - 1, c: j - 1 }]),
                    rowLabels: rowLabs,
                    colLabels: colLabs,
                    description: `Match '${char1}' == '${char2}'. 1 + diagonal (${dp[i - 1][j - 1]}).`
                });
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                steps.push({
                    grid: createGrid(dp, i, j, [{ r: i - 1, c: j }, { r: i, c: j - 1 }]),
                    rowLabels: rowLabs,
                    colLabels: colLabs,
                    description: `Mismatch '${char1}' != '${char2}'. Max of top (${dp[i - 1][j]}) and left (${dp[i][j - 1]}).`
                });
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
            steps.push({
                grid: createGrid(dp, i, j),
                rowLabels: rowLabs,
                colLabels: colLabs,
                description: `Filled ${dp[i][j]}.`
            });
        }
    }
    return steps;
};

export const generateLISSteps = () => {
    const steps = [];
    const arr = [10, 22, 9, 33, 21, 50, 41, 60];
    const n = arr.length;
    const dp = Array(n).fill(1);

    const createGrid = (vals, activeIdx, compareIdx) => {
        return [
            arr.map((v, i) => ({ value: v, status: i === activeIdx ? 'current' : (i === compareIdx ? 'dependency' : 'default') })),
            vals.map((v, i) => ({
                value: v,
                status: i === activeIdx ? 'current' : 'visited' // Simplified state
            }))
        ];
    };

    const createDualGrid = (dpVals, i, j) => {
        return [
            arr.map((val, idx) => ({
                value: val,
                status: idx === i ? 'current' : (idx === j ? 'dependency' : 'default')
            })),
            dpVals.map((val, idx) => ({
                value: val,
                status: idx === i ? 'current' : (idx < i ? 'visited' : 'default')
            }))
        ];
    };

    steps.push({
        grid: createDualGrid(dp, 0, -1),
        rowLabels: ['Array', 'LIS Length'],
        colLabels: Array.from({ length: n }, (_, k) => k.toString()),
        description: "Initial LIS state. Each element is length 1 (itself)."
    });

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            steps.push({
                grid: createDualGrid(dp, i, j),
                rowLabels: ['Array', 'LIS Length'],
                colLabels: Array.from({ length: n }, (_, k) => k.toString()),
                description: `Comparing arr[${i}](${arr[i]}) > arr[${j}](${arr[j]})?`
            });

            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
                steps.push({
                    grid: createDualGrid(dp, i, j),
                    rowLabels: ['Array', 'LIS Length'],
                    colLabels: Array.from({ length: n }, (_, k) => k.toString()),
                    description: `True! Increasing LIS length at index ${i} to ${dp[i]} (1 + ${dp[j]}).`
                });
            }
        }
    }

    steps.push({
        grid: createDualGrid(dp, n - 1, -1),
        rowLabels: ['Array', 'LIS Length'],
        colLabels: Array.from({ length: n }, (_, k) => k.toString()),
        description: `LIS Computation Complete. Max Length: ${Math.max(...dp)}.`
    });

    return steps;
};

export const generateClimbingStairsSteps = () => {
    const steps = [];
    const n = 6; // Example: 6 steps
    const dp = Array(n + 1).fill(null);

    // Grid 1D
    const createGrid = (arr, activeIdx, deps = []) => {
        return [arr.map((val, idx) => ({
            value: val === null ? '' : val,
            status: idx === activeIdx ? 'current' :
                (deps.includes(idx) ? 'dependency' :
                    (val !== null ? 'visited' : 'default'))
        }))];
    };

    steps.push({
        grid: createGrid(dp, -1),
        rowLabels: ['Ways'],
        colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
        description: `Climbing Stairs (${n}). Ways to reach step i using 1 or 2 steps using DP.`
    });

    // Base Cases
    dp[0] = 1; // 1 way to be at ground (do nothing)
    dp[1] = 1; // 1 way to reach step 1 (1 step)

    steps.push({
        grid: createGrid(dp, 1, [0]),
        rowLabels: ['Ways'],
        colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
        description: "Base Cases: dp[0]=1, dp[1]=1."
    });

    for (let i = 2; i <= n; i++) {
        steps.push({
            grid: createGrid(dp, i, [i - 1, i - 2]),
            rowLabels: ['Ways'],
            colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
            description: `Step ${i}: Come from ${i - 1} (1 step) OR ${i - 2} (2 steps). Summing dp[${i - 1}] + dp[${i - 2}].`
        });

        dp[i] = dp[i - 1] + dp[i - 2];

        steps.push({
            grid: createGrid(dp, i, []),
            rowLabels: ['Ways'],
            colLabels: Array.from({ length: n + 1 }, (_, i) => i.toString()),
            description: `Total ways to reach step ${i}: ${dp[i]}.`
        });
    }

    return steps;
};


export const generateCoinChangeSteps = () => {
    const steps = [];
    const coins = [1, 2, 5];
    const amount = 8;
    // DP array for Min Coins, init with Amount + 1 (Infinity equivalent)
    const dp = Array(amount + 1).fill(amount + 1);
    dp[0] = 0;

    const createGrid = (arr, activeIdx, depIdx = -1) => {
        return [arr.map((val, idx) => ({
            value: val > amount ? '∞' : val,
            status: idx === activeIdx ? 'current' :
                (idx === depIdx ? 'dependency' :
                    (val <= amount ? 'visited' : 'default'))
        }))];
    };

    steps.push({
        grid: createGrid(dp, -1),
        rowLabels: ['Min Coins'],
        colLabels: Array.from({ length: amount + 1 }, (_, i) => i.toString()),
        description: `Coin Change: Min coins for amount ${amount}. Coins: [${coins.join(', ')}]. Init dp[0]=0, others ∞.`
    });

    // Outer loop: Coins or Amount? 
    // Usually inner is amount for 1D array ("unbounded knapsack" style variation)
    // To allow picking same coin multiple times:
    // for coin in coins:
    //   for i = coin to amount:

    // Let's visualize coin by coin updates
    for (let c of coins) {
        steps.push({
            grid: createGrid(dp, -1),
            rowLabels: ['Min Coins'],
            colLabels: Array.from({ length: amount + 1 }, (_, i) => i.toString()),
            description: `Processing Coin Value: ${c}.`
        });

        for (let i = c; i <= amount; i++) {
            const prevVal = dp[i];
            const newVal = dp[i - c] + 1;

            steps.push({
                grid: createGrid(dp, i, i - c),
                rowLabels: ['Min Coins'],
                colLabels: Array.from({ length: amount + 1 }, (_, i) => i.toString()),
                description: `Checking Amount ${i}: Can we improve using coin ${c}? Valid option: dp[${i}-${c}] + 1 = ${newVal > amount ? '∞' : newVal}. Current: ${prevVal > amount ? '∞' : prevVal}.`
            });

            if (newVal < prevVal) {
                dp[i] = newVal;
                steps.push({
                    grid: createGrid(dp, i, i - c),
                    rowLabels: ['Min Coins'],
                    colLabels: Array.from({ length: amount + 1 }, (_, i) => i.toString()),
                    description: `Updated! Min coins for ${i} is now ${dp[i]}.`
                });
            }
        }
    }

    // Final check
    const result = dp[amount] > amount ? -1 : dp[amount];
    steps.push({
        grid: createGrid(dp, -1),
        rowLabels: ['Min Coins'],
        colLabels: Array.from({ length: amount + 1 }, (_, i) => i.toString()),
        description: `Calculation Complete. Minimum coins needed for ${amount}: ${result}.`
    });

    return steps;
};


// --- Greedy Algorithms ---

export const generateActivitySelectionSteps = (inputArray) => {
    // Parse input: [start, end, start, end...] or generate default if too short
    let activities = [];
    if (inputArray.length < 2) {
        // Default set if input is trivial
        activities = [
            { id: 1, start: 1, end: 4 },
            { id: 2, start: 3, end: 5 },
            { id: 3, start: 0, end: 6 },
            { id: 4, start: 5, end: 7 },
            { id: 5, start: 3, end: 9 },
            { id: 6, start: 5, end: 9 },
            { id: 7, start: 6, end: 10 },
            { id: 8, start: 8, end: 11 },
            { id: 9, start: 8, end: 12 },
            { id: 10, start: 2, end: 14 },
            { id: 11, start: 12, end: 16 }
        ];
    } else {
        activities = [];
        for (let i = 0; i < inputArray.length; i += 2) {
            let s = inputArray[i];
            let e = inputArray[i + 1] !== undefined ? inputArray[i + 1] : s + 2;
            if (s > e) [s, e] = [e, s]; // Ensure start < end
            activities.push({ id: Math.floor(i / 2) + 1, start: s, end: e });
        }
    }

    const steps = [];
    // Initial State: unsorted
    steps.push({
        type: 'activity',
        activities: activities.map(a => ({ ...a, status: 'available' })),
        description: "Initial State: Unsorted activities."
    });

    // Sort by end time
    activities.sort((a, b) => a.end - b.end);

    steps.push({
        type: 'activity',
        activities: activities.map(a => ({ ...a, status: 'available' })),
        description: "Sorted activities by finish time (Greedy Strategy)."
    });

    let lastEndTime = -1;
    let count = 0;

    // Use a deep copy strategy to maintain history
    const finalActivities = activities.map(a => ({ ...a, status: 'available' }));

    for (let i = 0; i < finalActivities.length; i++) {
        const act = finalActivities[i];

        // Evaluating
        act.status = 'evaluating';
        steps.push({
            type: 'activity',
            activities: JSON.parse(JSON.stringify(finalActivities)),
            description: `Evaluating Activity #${act.id} (${act.start}-${act.end})...`
        });

        if (act.start >= lastEndTime) {
            // Select
            act.status = 'selected';
            lastEndTime = act.end;
            count++;
            steps.push({
                type: 'activity',
                activities: JSON.parse(JSON.stringify(finalActivities)),
                description: `Selected Activity #${act.id}. It starts after the last finished activity.`
            });
        } else {
            // Reject
            act.status = 'rejected';
            steps.push({
                type: 'activity',
                activities: JSON.parse(JSON.stringify(finalActivities)),
                description: `Rejected Activity #${act.id}. Overlaps with previous choice.`
            });
        }
    }
    steps.push({
        type: 'activity',
        activities: finalActivities,
        description: `Done! Selected ${count} non-overlapping activities.`
    });

    return steps;
};

export const generateCoinChangeGreedySteps = (inputArray, target = 18) => {
    const steps = [];
    const coinsRaw = [...new Set(inputArray)].sort((a, b) => b - a);
    let remaining = target;
    const resultArr = [];

    steps.push({
        type: 'coin',
        coins: coinsRaw.map(v => ({ value: v, status: 'available', count: 0 })),
        remainingAmount: target,
        result: [],
        description: `Greedy Strategy: Sort coins descending and pick largest possible.`
    });

    const currentCoinStates = coinsRaw.map(v => ({ value: v, status: 'available', count: 0 }));

    for (let i = 0; i < coinsRaw.length; i++) {
        const coinVal = coinsRaw[i];

        currentCoinStates[i].status = 'evaluating';
        steps.push({
            type: 'coin',
            coins: JSON.parse(JSON.stringify(currentCoinStates)),
            remainingAmount: remaining,
            result: [...resultArr],
            description: `Checking coin worth ${coinVal}. Can we use it?`
        });

        if (coinVal <= remaining) {
            const count = Math.floor(remaining / coinVal);
            remaining -= (count * coinVal);
            currentCoinStates[i].count = count;
            currentCoinStates[i].status = 'selected';

            for (let k = 0; k < count; k++) resultArr.push(coinVal);

            steps.push({
                type: 'coin',
                coins: JSON.parse(JSON.stringify(currentCoinStates)),
                remainingAmount: remaining,
                result: [...resultArr],
                description: `Yes! Used coin ${coinVal} x ${count} times. Remaining: ${remaining}.`
            });
        } else {
            currentCoinStates[i].status = 'rejected';
            steps.push({
                type: 'coin',
                coins: JSON.parse(JSON.stringify(currentCoinStates)),
                remainingAmount: remaining,
                result: [...resultArr],
                description: `Coin ${coinVal} is too large for remaining amount ${remaining}. Skipping.`
            });
        }
    }

    if (remaining > 0) {
        // Fallback for visual completeness, though greedy might fail
        steps.push({
            type: 'coin',
            coins: currentCoinStates,
            remainingAmount: remaining,
            result: [...resultArr],
            description: `Cannot fully make change with given coins. Remainder: ${remaining}. (Greedy failed or impossible)`
        });
    } else {
        steps.push({
            type: 'coin',
            coins: currentCoinStates,
            remainingAmount: 0,
            result: [...resultArr],
            description: `Change complete!`
        });
    }
    return steps;
};

export const generateFractionalKnapsackSteps = (inputArray, capacity = 50) => {
    // Parse input as [value, weight, value, weight...]
    // If input is just numbers, we try to form pairs. If single generic array, we make up weights?
    // Let's assume input is [val, weight, val, weight...]
    const items = [];
    // If array is small, use default demo data
    if (!inputArray || inputArray.length < 2) {
        items.push({ id: 1, value: 60, weight: 10, ratio: 6 });
        items.push({ id: 2, value: 100, weight: 20, ratio: 5 });
        items.push({ id: 3, value: 120, weight: 30, ratio: 4 });
    } else {
        for (let i = 0; i < inputArray.length; i += 2) {
            const val = inputArray[i];
            const w = inputArray[i + 1] !== undefined ? inputArray[i + 1] : 10;
            items.push({ id: Math.floor(i / 2) + 1, value: val, weight: w, ratio: val / w });
        }
    }

    const steps = [];

    steps.push({
        type: 'knapsack',
        items: items.map(i => ({ ...i, status: 'available', fraction: 0 })),
        currentCapacity: 0,
        maxCapacity: capacity,
        totalValue: 0,
        description: "Initial State. Items parsed."
    });

    // Sort by Ratio
    items.sort((a, b) => b.ratio - a.ratio);

    steps.push({
        type: 'knapsack',
        items: items.map(i => ({ ...i, status: 'available', fraction: 0 })),
        currentCapacity: 0,
        maxCapacity: capacity,
        totalValue: 0,
        description: "Sorted items by Value/Weight ratio (Greedy Strategy)."
    });

    let curW = 0;
    let curV = 0;
    const finalItems = items.map(i => ({ ...i, status: 'available', fraction: 0 }));

    for (let i = 0; i < finalItems.length; i++) {
        const item = finalItems[i];

        item.status = 'evaluating';
        steps.push({
            type: 'knapsack',
            items: JSON.parse(JSON.stringify(finalItems)),
            currentCapacity: curW,
            maxCapacity: capacity,
            totalValue: curV,
            description: `Evaluating Item #${item.id} (Ratio: ${item.ratio.toFixed(2)})...`
        });

        if (curW + item.weight <= capacity) {
            // Take full
            curW += item.weight;
            curV += item.value;
            item.status = 'selected';
            item.fraction = 1;

            steps.push({
                type: 'knapsack',
                items: JSON.parse(JSON.stringify(finalItems)),
                currentCapacity: curW,
                maxCapacity: capacity,
                totalValue: curV,
                description: `Took full Item #${item.id}. Capacity: ${curW}/${capacity}.`
            });
        } else {
            // Take fraction
            const remain = capacity - curW;
            const fraction = remain / item.weight; // e.g. 10/20 = 0.5

            curV += item.value * fraction;
            curW += item.weight * fraction; // should match capacity
            item.status = 'selected'; // or partial?
            item.fraction = fraction;

            steps.push({
                type: 'knapsack',
                items: JSON.parse(JSON.stringify(finalItems)),
                currentCapacity: curW,
                maxCapacity: capacity,
                totalValue: curV,
                description: `Took ${fraction.toFixed(2) * 100}% of Item #${item.id} to fill knapsack.`
            });
            break; // Filled
        }
    }
    steps.push({
        type: 'knapsack',
        items: JSON.parse(JSON.stringify(finalItems)),
        currentCapacity: curW,
        maxCapacity: capacity,
        totalValue: curV,
        description: `Knapsack filled! Total Value: ${curV.toFixed(2)}.`
    });

    return steps;
};

// --- DP on Trees & Matrix Chain ---

export const generateMatrixChainSteps = (inputArray) => {
    // Input: Dimensions array. e.g. [10, 20, 30] -> A1(10x20), A2(20x30).
    const steps = [];
    let p = inputArray;
    if (!p || p.length < 3) {
        p = [10, 20, 30, 40, 30]; // Default
    }
    const n = p.length - 1;

    const createEmptyGrid = () => {
        return Array.from({ length: n }, (_, r) =>
            Array.from({ length: n }, (_, c) => ({
                value: '',
                status: 'default'
            }))
        );
    };

    const gridState = createEmptyGrid();
    for (let i = 0; i < n; i++) {
        gridState[i][i] = { value: 0, status: 'visited' };
    }

    const m = Array.from({ length: n }, () => Array(n).fill(0));

    steps.push({
        grid: JSON.parse(JSON.stringify(gridState)),
        rowLabels: Array.from({ length: n }, (_, i) => `M${i + 1}`),
        colLabels: Array.from({ length: n }, (_, i) => `M${i + 1}`),
        description: `Matrix Chain Multiplication. Dimensions: ${p.join(' x ')}. Matrices: ${p.slice(0, n).map((_, i) => `${p[i]}x${p[i + 1]}`).join(', ')}.`
    });

    for (let L = 2; L <= n; L++) {
        for (let i = 1; i <= n - L + 1; i++) {
            const j = i + L - 1;
            const r = i - 1;
            const c = j - 1;

            m[r][c] = Infinity;
            gridState[r][c].status = 'current';
            gridState[r][c].value = '...';

            steps.push({
                grid: JSON.parse(JSON.stringify(gridState)),
                rowLabels: Array.from({ length: n }, (_, k) => `M${k + 1}`),
                colLabels: Array.from({ length: n }, (_, k) => `M${k + 1}`),
                description: `Computing min cost for chain M${i}...M${j} (Length ${L}).`
            });

            for (let k = i; k <= j - 1; k++) {
                const cost = m[r][k - 1] + m[k][c] + p[i - 1] * p[k] * p[j];

                const gridCopy = JSON.parse(JSON.stringify(gridState));
                gridCopy[r][k - 1].status = 'dependency';
                gridCopy[k][c].status = 'dependency';
                gridCopy[r][c].status = 'current';
                gridCopy[r][c].value = cost < m[r][c] ? cost : m[r][c];

                steps.push({
                    grid: gridCopy,
                    rowLabels: Array.from({ length: n }, (_, x) => `M${x + 1}`),
                    colLabels: Array.from({ length: n }, (_, x) => `M${x + 1}`),
                    description: `Split at k=${k}: Cost = ${m[r][k - 1]} + ${m[k][c]} + ${p[i - 1] * p[k] * p[j]} = ${cost}.`
                });

                if (cost < m[r][c]) {
                    m[r][c] = cost;
                    gridState[r][c].value = cost;
                }
            }
            gridState[r][c].status = 'visited';
            steps.push({
                grid: JSON.parse(JSON.stringify(gridState)),
                rowLabels: Array.from({ length: n }, (_, x) => `M${x + 1}`),
                colLabels: Array.from({ length: n }, (_, x) => `M${x + 1}`),
                description: `Min cost for M${i}...M${j} is ${m[r][c]}.`
            });
        }
    }
    return steps;
};

export const generateDPonTreesSteps = () => {
    // Problem: Max Independent Set (MIS) on a Tree
    const n = 6;
    const tree = { 1: [2, 3], 2: [4, 5], 3: [6], 4: [], 5: [], 6: [] };
    const postOrder = [4, 5, 2, 6, 3, 1];

    // gridState[u] = [Excl, Incl]
    const currentDPState = Array.from({ length: n + 1 }, () => [null, null]);

    const createGrid = (state) => {
        return Array.from({ length: n }, (_, i) => {
            const node = i + 1;
            return [
                { value: state[node][0] === null ? '' : state[node][0], status: 'default' },
                { value: state[node][1] === null ? '' : state[node][1], status: 'default' }
            ];
        });
    };

    const steps = [];
    steps.push({
        grid: createGrid(currentDPState),
        rowLabels: Array.from({ length: n }, (_, i) => `Node ${i + 1}`),
        colLabels: ['Exclude', 'Include'],
        description: "DP on Trees (Max Independent Set). dp[u][0]=Exclude u, dp[u][1]=Include u (1+sum(dp[v][0]))."
    });

    for (const u of postOrder) {
        const gridPre = createGrid(currentDPState);
        gridPre[u - 1][0].status = 'current';
        gridPre[u - 1][1].status = 'current';

        steps.push({
            grid: gridPre,
            rowLabels: Array.from({ length: n }, (_, i) => `Node ${i + 1}`),
            colLabels: ['Exclude', 'Include'],
            description: `Processing Node ${u} (Children: ${tree[u].join(', ') || 'None'}).`
        });

        const children = tree[u];
        let sumExcl = 0;
        let sumIncl = 1;

        for (const v of children) {
            sumExcl += Math.max(currentDPState[v][0], currentDPState[v][1]);
            sumIncl += currentDPState[v][0];
        }

        currentDPState[u][0] = sumExcl;
        currentDPState[u][1] = sumIncl;

        const gridDone = createGrid(currentDPState);
        gridDone[u - 1][0].status = 'visited';
        gridDone[u - 1][0].value = sumExcl;
        gridDone[u - 1][1].status = 'visited';
        gridDone[u - 1][1].value = sumIncl;

        // Highlight dependencies if any
        for (const v of children) {
            gridDone[v - 1][0].status = 'dependency';
            gridDone[v - 1][1].status = 'dependency';
        }

        steps.push({
            grid: gridDone,
            rowLabels: Array.from({ length: n }, (_, i) => `Node ${i + 1}`),
            colLabels: ['Exclude', 'Include'],
            description: `Computed Node ${u}: Excl=${sumExcl}, Incl=${sumIncl}.`
        });
    }

    return steps;
};

// --- Backtracking Algorithms ---

export const generateNQueensSteps = () => {
    // Default N=4 for cleaner demo, could receive input
    const n = 4; // Using N=4 for visualization simplicity, though standard is 8
    const steps = [];

    // Board state: n x n grid. cell = { value: '', status: 'default' }
    // Q = Queen
    const createBoard = () => Array.from({ length: n }, () => Array.from({ length: n }, () => ({ value: '', status: 'default' })));

    let board = createBoard();
    const queens = Array(n).fill(-1); // queens[row] = col

    steps.push({
        type: 'n-queens',
        grid: JSON.parse(JSON.stringify(board)),
        n,
        description: `Backtracking to solve ${n}-Queens. Placing queens row by row.`
    });

    const isSafe = (row, col) => {
        // Check column and diagonals
        for (let i = 0; i < row; i++) {
            const prevCol = queens[i];
            if (prevCol === col || Math.abs(prevCol - col) === Math.abs(i - row)) {
                return false;
            }
        }
        return true;
    };

    const solve = (row) => {
        if (row === n) {
            steps.push({
                type: 'n-queens',
                grid: JSON.parse(JSON.stringify(board)),
                n,
                description: `Solution Found! All ${n} queens placed safely.`
            });
            return true; // Return true to find first solution, false to find all
        }

        for (let col = 0; col < n; col++) {
            // 1. Try placing
            board[row][col] = { value: 'Q', status: 'trying' };
            queens[row] = col;
            steps.push({
                type: 'n-queens',
                grid: JSON.parse(JSON.stringify(board)),
                n,
                description: `Trying Queen at Row ${row}, Col ${col}...`
            });

            // 2. Check safety
            if (isSafe(row, col)) {
                board[row][col].status = 'safe';
                steps.push({
                    type: 'n-queens',
                    grid: JSON.parse(JSON.stringify(board)),
                    n,
                    description: `Position (${row}, ${col}) is Safe. Moving to next row.`
                });

                if (solve(row + 1)) return true;

                // Backtrack
                board[row][col].status = 'backtrack'; // fleeting visual
                steps.push({
                    type: 'n-queens',
                    grid: JSON.parse(JSON.stringify(board)),
                    n,
                    description: `Backtracking from (${row}, ${col}). Path didn't lead to full solution.`
                });
            } else {
                // Conflict
                board[row][col].status = 'conflict';
                steps.push({
                    type: 'n-queens',
                    grid: JSON.parse(JSON.stringify(board)),
                    n,
                    description: `Position (${row}, ${col}) is under attack! Removing Queen.`
                });
            }

            // 3. Remove (Backtrack step in loop)
            board[row][col] = { value: '', status: 'default' };
            queens[row] = -1;
        }
        return false;
    };

    solve(0);
    return steps;
};

export const generateSudokuSolverSteps = () => {
    const steps = [];
    const initialGrid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const board = initialGrid.map(row => row.map(val => ({
        value: val,
        fixed: val !== 0,
        status: val !== 0 ? 'fixed' : 'default'
    })));

    steps.push({
        type: 'sudoku',
        grid: JSON.parse(JSON.stringify(board)),
        description: "Initial Sudoku Board."
    });

    const isValid = (r, c, k) => {
        for (let i = 0; i < 9; i++) {
            if (board[r][i].value === k) return false;
            if (board[i][c].value === k) return false;
            const subRow = 3 * Math.floor(r / 3) + Math.floor(i / 3);
            const subCol = 3 * Math.floor(c / 3) + (i % 3);
            if (board[subRow][subCol].value === k) return false;
        }
        return true;
    };

    const solve = () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c].value === 0) {
                    for (let k = 1; k <= 9; k++) {
                        board[r][c].value = k;
                        board[r][c].status = 'trying';
                        steps.push({
                            type: 'sudoku',
                            grid: JSON.parse(JSON.stringify(board)),
                            description: `Trying ${k} at (${r}, ${c})...`
                        });

                        if (isValid(r, c, k)) {
                            board[r][c].status = 'valid';

                            if (solve()) return true;

                            board[r][c].status = 'backtrack'; // Visual
                        } else {
                            board[r][c].status = 'conflict';
                            steps.push({
                                type: 'sudoku',
                                grid: JSON.parse(JSON.stringify(board)),
                                description: `Conflict! ${k} cannot be placed at (${r}, ${c}).`
                            });
                        }

                        board[r][c].value = 0;
                        board[r][c].status = 'default';
                    }
                    return false;
                }
            }
        }
        return true;
    };

    solve();
    steps.push({
        type: 'sudoku',
        grid: JSON.parse(JSON.stringify(board)),
        description: "Sudoku Solved!"
    });
    return steps;
};

export const generateRatInMazeSteps = () => {
    // 1 is Wall, 0 is Path
    const maze = [
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 0, 0],
        [1, 1, 1, 0]
    ];
    const n = 4;
    const steps = [];

    const grid = maze.map(row => row.map(cell => ({
        value: cell,
        status: 'default',
        isRat: false,
        isDest: false
    })));

    grid[n - 1][n - 1].isDest = true;

    steps.push({
        type: 'rat-maze',
        grid: JSON.parse(JSON.stringify(grid)),
        description: "Initial Maze. Rat at top-left, Goal at bottom-right."
    });

    const isSafe = (r, c) => {
        return r >= 0 && c >= 0 && r < n && c < n && grid[r][c].value === 0 && grid[r][c].status !== 'path';
    };

    const solve = (r, c) => {
        // Goal
        if (r === n - 1 && c === n - 1) {
            grid[r][c].isRat = true;
            grid[r][c].status = 'path';
            steps.push({
                type: 'rat-maze',
                grid: JSON.parse(JSON.stringify(grid)),
                description: "Reached Goal!"
            });
            return true;
        }

        if (isSafe(r, c)) {
            grid[r][c].isRat = true;
            grid[r][c].status = 'path';
            steps.push({
                type: 'rat-maze',
                grid: JSON.parse(JSON.stringify(grid)),
                description: `Moving to (${r}, ${c}). Marking as path.`
            });
            grid[r][c].isRat = false; // Rat moves on

            // Directions: Down, Right, Up, Left
            if (solve(r + 1, c)) return true;
            if (solve(r, c + 1)) return true;
            if (solve(r - 1, c)) return true;
            if (solve(r, c - 1)) return true;

            // Backtrack
            grid[r][c].status = 'backtrack';
            steps.push({
                type: 'rat-maze',
                grid: JSON.parse(JSON.stringify(grid)),
                description: `Dead end at (${r}, ${c}). Backtracking.`
            });
            return false;
        }
        return false;
    };

    solve(0, 0);
    return steps;
};

export const generatePermutationsSteps = (inputArray) => {
    const steps = [];
    const arr = inputArray.length > 0 ? inputArray : [1, 2, 3];
    const n = arr.length;

    steps.push({
        type: 'permutations',
        currentPath: [],
        options: arr.map(v => ({ value: v, status: 'available' })),
        description: `Generating all permutations of [${arr.join(', ')}].`
    });

    const backtrack = (current, remaining) => {
        if (current.length === n) {
            steps.push({
                type: 'permutations',
                currentPath: [...current],
                options: arr.map(v => ({ value: v, status: current.includes(v) ? 'selected' : 'available' })), // Simplified status
                description: `Found Permutation: [${current.join(', ')}]`
            });
            return;
        }

        for (let i = 0; i < remaining.length; i++) {
            const val = remaining[i];

            // Pick
            steps.push({
                type: 'permutations',
                currentPath: [...current, val],
                options: arr.map(v => ({
                    value: v,
                    status: current.includes(v) || v === val ? 'selected' : 'available'
                })),
                description: `Selected ${val}. Remaining options: [${remaining.filter((_, idx) => idx !== i).join(', ')}]`
            });

            const nextRemaining = [...remaining];
            nextRemaining.splice(i, 1);
            backtrack([...current, val], nextRemaining);

            // Backtrack happens implicitly in recursion loop, let's visualize the "undo"
            steps.push({
                type: 'permutations',
                currentPath: [...current],
                options: arr.map(v => ({
                    value: v,
                    status: current.includes(v) ? 'selected' : 'available'
                })),
                description: `Backtracking... Removed ${val}.`
            });
        }
    };

    backtrack([], arr);
    steps.push({
        type: 'permutations',
        currentPath: [],
        options: arr.map(v => ({ value: v, status: 'available' })),
        description: "All permutations generated."
    });
    return steps;
};

export const generateSubsetsSteps = (inputArray) => {
    const steps = [];
    const arr = inputArray.length > 0 ? inputArray : [1, 2, 3];
    const n = arr.length;

    steps.push({
        type: 'subsets',
        currentPath: [],
        options: arr.map(v => ({ value: v, status: 'available' })),
        description: `Generating all subsets of [${arr.join(', ')}].`
    });

    const backtrack = (start, current) => {
        steps.push({
            type: 'subsets',
            currentPath: [...current],
            options: arr.map((v, i) => ({
                value: v,
                status: current.includes(v) ? 'selected' : (i < start ? 'rejected' : 'available')
            })),
            description: `Found Subset: [${current.join(', ')}]`
        });

        for (let i = start; i < n; i++) {
            // Include arr[i]
            backtrack(i + 1, [...current, arr[i]]);
            // Backtrack implies we finished the branch with arr[i]
            steps.push({
                type: 'subsets',
                currentPath: [...current],
                options: arr.map((v, idx) => ({
                    value: v,
                    status: current.includes(v) ? 'selected' : (idx <= i ? 'rejected' : 'available')
                })),
                description: `Finished subsets starting with ${arr[i]}. Backtracking.`
            });
        }
    };

    backtrack(0, []);
    return steps;
};

export const generateCombinationsSteps = (inputArray) => {
    // Input: n and k. Let's use n=4 (input array [1,2,3,4]), k=2
    const n = 4;
    const k = 2;
    const arr = [1, 2, 3, 4]; // Default source

    const steps = [];

    steps.push({
        type: 'combinations',
        currentPath: [],
        options: arr.map(v => ({ value: v, status: 'available' })),
        k: k,
        description: `Generating combinations of ${n} items taken ${k} at a time. [${arr.join(', ')}]`
    });

    const backtrack = (start, current) => {
        if (current.length === k) {
            steps.push({
                type: 'combinations',
                currentPath: [...current],
                options: arr.map((v, i) => ({
                    value: v,
                    // Selected if in path. 
                    // Rejected if index < last selected index (combinatorial order strictness)
                    status: current.includes(v) ? 'selected' : (i < start ? 'rejected' : 'available')
                })),
                k: k,
                description: `Found Combination: [${current.join(', ')}]`
            });
            return;
        }

        for (let i = start; i < n; i++) {
            // Visualize "Picking"
            steps.push({
                type: 'combinations',
                currentPath: [...current, arr[i]],
                options: arr.map((v, idx) => ({
                    value: v,
                    status: current.includes(v) || idx === i ? 'selected' : (idx < start ? 'rejected' : 'available')
                })),
                k: k,
                description: `Picking ${arr[i]}...`
            });

            backtrack(i + 1, [...current, arr[i]]);

            // Visualize "Backtrack"
            steps.push({
                type: 'combinations',
                currentPath: [...current],
                options: arr.map((v, idx) => ({
                    value: v,
                    status: current.includes(v) ? 'selected' : (idx <= i ? 'rejected' : 'available')
                })),
                k: k,
                description: `Backtracking from ${arr[i]}.`
            });
        }
    };

    backtrack(0, []);
    return steps;
};

export const generateWordSearchSteps = () => {
    const steps = [];
    const board = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ];
    const word = "ABCCED";
    const rows = board.length;
    const cols = board[0].length;

    // Grid state for visualizer: value, status ('default', 'visited', 'trying', 'found', 'backtrack')
    const createGrid = () => board.map(row => row.map(val => ({ value: val, status: 'default' })));
    let initialGrid = createGrid();

    steps.push({
        type: 'word-search',
        grid: JSON.parse(JSON.stringify(initialGrid)),
        targetWord: word,
        currentWord: "",
        description: `Word Search: Find "${word}" in the grid.`
    });

    const isSafe = (r, c, index, visited) => {
        return r >= 0 && c >= 0 && r < rows && c < cols && !visited[r][c] && board[r][c] === word[index];
    };

    const solve = (r, c, index, visited, currentGrid) => {
        // Base case: Word found
        if (index === word.length) {
            return true;
        }

        // Check boundaries and match
        if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r][c] || board[r][c] !== word[index]) {
            return false;
        }

        // Mark as visited/trying
        visited[r][c] = true;
        currentGrid[r][c].status = 'trying';
        steps.push({
            type: 'word-search',
            grid: JSON.parse(JSON.stringify(currentGrid)),
            targetWord: word,
            currentWord: word.substring(0, index + 1),
            description: `Found '${board[r][c]}' at (${r}, ${c}). Looking for next char '${word[index + 1] || 'END'}'...`
        });

        if (index === word.length - 1) {
            currentGrid[r][c].status = 'found'; // Last char found
            steps.push({
                type: 'word-search',
                grid: JSON.parse(JSON.stringify(currentGrid)),
                targetWord: word,
                currentWord: word,
                description: `Word Found!`
            });
            return true;
        }

        // Explore neighbors: Down, Right, Up, Left
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let [dr, dc] of directions) {
            if (solve(r + dr, c + dc, index + 1, visited, currentGrid)) {
                currentGrid[r][c].status = 'found'; // Part of solution path
                return true;
            }
        }

        // Backtrack
        visited[r][c] = false;
        currentGrid[r][c].status = 'backtrack';
        steps.push({
            type: 'word-search',
            grid: JSON.parse(JSON.stringify(currentGrid)),
            targetWord: word,
            currentWord: word.substring(0, index),
            description: `Backtracking from (${r}, ${c})...`
        });
        currentGrid[r][c].status = 'default'; // Reset visual

        return false;
    };

    // Main loop
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let found = false;

    // We'll search for 'ABCCED' which starts at (0,0) for this demo
    // To save steps in visualizing "scanning", we'll jump to the start char if it matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === word[0]) {
                // Clone grid for recursion
                let currentGrid = createGrid();
                if (solve(r, c, 0, visited, currentGrid)) {
                    found = true;
                    break;
                }
            }
        }
        if (found) break;
    }

    if (!found) {
        steps.push({
            type: 'word-search',
            grid: initialGrid,
            targetWord: word,
            currentWord: "",
            description: `Word "${word}" not found in grid.`
        });
    }

    return steps;
};

// --- String Algorithms ---

/**
 * Visualizes Reversing a String using two pointers.
 */
export const generateReverseStringSteps = (str) => {
    const steps = [];
    let arr = String(str).split('');
    let left = 0;
    let right = arr.length - 1;
    let indices = {};
    arr.forEach((_, i) => indices[i] = 'unchecked');

    steps.push({
        type: 'string',
        text: [...arr],
        textPointers: [left, right],
        indices: { ...indices },
        description: `Starting string reversal with two pointers. Left: ${left}, Right: ${right}`
    });

    while (left < right) {
        indices[left] = 'comparing';
        indices[right] = 'comparing';
        steps.push({
            type: 'string',
            text: [...arr],
            textPointers: [left, right],
            indices: { ...indices },
            description: `Swapping '${arr[left]}' and '${arr[right]}'.`
        });

        // Swap
        [arr[left], arr[right]] = [arr[right], arr[left]];

        indices[left] = 'matched';
        indices[right] = 'matched';
        steps.push({
            type: 'string',
            text: [...arr],
            textPointers: [left, right],
            indices: { ...indices },
            description: `Swapped! Result: '${arr[left]}' and '${arr[right]}'. Moving pointers inward.`
        });

        left++;
        right--;
        if (left < right) {
            steps.push({
                type: 'string',
                text: [...arr],
                textPointers: [left, right],
                indices: { ...indices },
                description: `Updated pointers. Left: ${left}, Right: ${right}`
            });
        }
    }

    // Final state
    arr.forEach((_, i) => indices[i] = 'matched');
    steps.push({
        type: 'string',
        text: [...arr],
        textPointers: [],
        indices: { ...indices },
        description: `String reversal complete! Final string: ${arr.join('')}`
    });

    return steps;
};

export const generatePalindromeSteps = (inputStr) => {
    const s = String(inputStr || "ababa");
    const arr = s.split('');
    const steps = [];
    const n = arr.length;
    let indices = {};

    steps.push({
        type: 'string',
        text: arr,
        textPointers: [],
        indices: { ...indices },
        description: `Starting Palindrome Check for "${s}".`
    });

    let left = 0;
    let right = n - 1;
    let isPal = true;

    while (left <= right) {
        indices[left] = 'comparing';
        indices[right] = 'comparing';
        steps.push({
            type: 'string',
            text: arr,
            textPointers: [left, right],
            indices: { ...indices },
            description: `Comparing characters at index ${left} ('${arr[left]}') and ${right} ('${arr[right]}').`
        });

        if (arr[left] !== arr[right]) {
            indices[left] = 'mismatch';
            indices[right] = 'mismatch';
            steps.push({
                type: 'string',
                text: arr,
                textPointers: [left, right],
                indices: { ...indices },
                description: `Mismatch found! '${arr[left]}' !== '${arr[right]}'. Not a palindrome.`
            });
            isPal = false;
            break;
        }

        indices[left] = 'matched';
        indices[right] = 'matched';
        steps.push({
            type: 'string',
            text: arr,
            textPointers: [left, right],
            indices: { ...indices },
            description: `Characters match! '${arr[left]}' === '${arr[right]}'.`
        });

        left++;
        right--;
    }

    if (isPal) {
        steps.push({
            type: 'string',
            text: arr,
            textPointers: [],
            indices: { ...indices },
            description: `Palindrome Check Complete. "${s}" is a palindrome!`
        });
    }

    return steps;
};

export const generateAnagramSteps = (input1, input2) => {
    // For visualization, we use one string and show how we build/consume the frequency map
    const s1 = String(input1 || "silent");
    const s2 = String(input2 || "listen");
    const arr1 = s1.split('');
    const arr2 = s2.split('');
    const steps = [];

    if (s1.length !== s2.length) {
        steps.push({
            type: 'string',
            text: arr1,
            description: "Lengths differ. Not anagrams."
        });
        return steps;
    }

    const freq = {};
    let indices = {};

    steps.push({
        type: 'string-anagram',
        text: arr1,
        freqMap: { ...freq },
        indices: {},
        description: `Anagram Check: Building frequency map for "${s1}".`
    });

    // Step 1: Build map for S1
    for (let i = 0; i < arr1.length; i++) {
        const char = arr1[i];
        freq[char] = (freq[char] || 0) + 1;
        indices[i] = 'comparing';
        steps.push({
            type: 'string-anagram',
            text: arr1,
            textPointers: [i],
            freqMap: { ...freq },
            indices: { ...indices },
            description: `Incrementing frequency for '${char}'. Count: ${freq[char]}`
        });
        indices[i] = 'matched';
    }

    steps.push({
        type: 'string-anagram-2',
        text: arr2,
        freqMap: { ...freq },
        indices: {},
        description: `Step 2: Checking characters of "${s2}" against frequency map.`
    });

    // Step 2: Check S2
    let indices2 = {};
    let isAnagram = true;
    for (let i = 0; i < arr2.length; i++) {
        const char = arr2[i];
        indices2[i] = 'comparing';

        steps.push({
            type: 'string-anagram',
            text: arr2,
            textPointers: [i],
            freqMap: { ...freq },
            indices: { ...indices2 },
            description: `Checking '${char}' in frequency map.`
        });

        if (!freq[char] || freq[char] <= 0) {
            indices2[i] = 'mismatch';
            steps.push({
                type: 'string-anagram',
                text: arr2,
                textPointers: [i],
                freqMap: { ...freq },
                indices: { ...indices2 },
                description: `Character '${char}' not found or count is 0. Not an anagram.`
            });
            isAnagram = false;
            break;
        }

        freq[char]--;
        indices2[i] = 'matched';
        steps.push({
            type: 'string-anagram',
            text: arr2,
            textPointers: [i],
            freqMap: { ...freq },
            indices: { ...indices2 },
            description: `Match found for '${char}'. Decrementing count to ${freq[char]}.`
        });
    }

    if (isAnagram) {
        steps.push({
            type: 'string-anagram',
            text: arr2,
            textPointers: [],
            freqMap: { ...freq },
            indices: { ...indices2 },
            description: "All characters matched! The strings are anagrams."
        });
    }

    return steps;
};

export const generateNaiveSearchSteps = (inputText, inputPattern) => {
    const t = String(inputText || "ABAAABCD");
    const p = String(inputPattern || "ABC");
    const textArr = t.split('');
    const patArr = p.split('');
    const steps = [];
    const n = textArr.length;
    const m = patArr.length;

    for (let i = 0; i <= n - m; i++) {
        let textIndices = {};
        let patIndices = {};
        let match = true;

        steps.push({
            type: 'string-matching',
            text: textArr,
            pattern: patArr,
            shift: i,
            textPointers: [i],
            patternPointers: [0],
            indices: {},
            patternIndices: {},
            description: `Aligning pattern at index ${i} of text.`
        });

        for (let j = 0; j < m; j++) {
            textIndices[i + j] = 'comparing';
            patIndices[j] = 'comparing';

            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: i,
                textPointers: [i + j],
                patternPointers: [j],
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                description: `Comparing '${textArr[i + j]}' with '${patArr[j]}'.`
            });

            if (textArr[i + j] !== patArr[j]) {
                textIndices[i + j] = 'mismatch';
                patIndices[j] = 'mismatch';
                steps.push({
                    type: 'string-matching',
                    text: textArr,
                    pattern: patArr,
                    shift: i,
                    textPointers: [i + j],
                    patternPointers: [j],
                    indices: { ...textIndices },
                    patternIndices: { ...patIndices },
                    description: `Mismatch! Shifting pattern by one.`
                });
                match = false;
                break;
            }

            textIndices[i + j] = 'matched';
            patIndices[j] = 'matched';
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: i,
                textPointers: [i + j],
                patternPointers: [j],
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                description: `Match! Moving to next character.`
            });
        }

        if (match) {
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: i,
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                description: `Pattern found at index ${i}!`
            });
        }
    }

    steps.push({
        type: 'string-matching',
        text: textArr,
        pattern: patArr,
        shift: 0,
        description: "Search complete."
    });

    return steps;
};

export const generateKMPSteps = (inputText, inputPattern) => {
    const t = String(inputText || "ABABDABACDABABCABAB");
    const p = String(inputPattern || "ABABCABAB");
    const textArr = t.split('');
    const patArr = p.split('');
    const steps = [];
    const n = textArr.length;
    const m = patArr.length;

    // 1. Preprocess LPS
    const lps = Array(m).fill(0);
    let len = 0;
    let i = 1;

    steps.push({
        type: 'kmp-lps',
        text: patArr,
        lps: [...lps],
        textPointers: [0],
        indices: { 0: 'matched' },
        description: "KMP Preprocessing: Calculating LPS (Longest Prefix Suffix) array."
    });

    while (i < m) {
        if (patArr[i] === patArr[len]) {
            len++;
            lps[i] = len;
            steps.push({
                type: 'kmp-lps',
                text: patArr,
                lps: [...lps],
                textPointers: [i],
                indices: { [i]: 'matched', [len - 1]: 'matched' },
                description: `Match! pat[${i}] === pat[${len - 1}]. LPS[${i}] = ${len}`
            });
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
                steps.push({
                    type: 'kmp-lps',
                    text: patArr,
                    lps: [...lps],
                    textPointers: [i],
                    description: `Mismatch. Falling back to LPS[${len}].`
                });
            } else {
                lps[i] = 0;
                steps.push({
                    type: 'kmp-lps',
                    text: patArr,
                    lps: [...lps],
                    textPointers: [i],
                    description: `No prefix found. LPS[${i}] = 0`
                });
                i++;
            }
        }
    }

    // 2. Search
    let ti = 0; // index for text
    let pi = 0; // index for pattern
    let textIndices = {};
    let patIndices = {};

    steps.push({
        type: 'string-matching',
        text: textArr,
        pattern: patArr,
        lps: [...lps],
        shift: 0,
        description: "Starting KMP Search using LPS array."
    });

    while (ti < n) {
        textIndices[ti] = 'comparing';
        patIndices[pi] = 'comparing';

        steps.push({
            type: 'string-matching',
            text: textArr,
            pattern: patArr,
            shift: ti - pi,
            textPointers: [ti],
            patternPointers: [pi],
            indices: { ...textIndices },
            patternIndices: { ...patIndices },
            lps: [...lps],
            description: `Comparing text[${ti}] ('${textArr[ti]}') with pattern[${pi}] ('${patArr[pi]}').`
        });

        if (patArr[pi] === textArr[ti]) {
            textIndices[ti] = 'matched';
            patIndices[pi] = 'matched';
            ti++;
            pi++;
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: ti - pi,
                textPointers: [ti],
                patternPointers: [pi],
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                lps: [...lps],
                description: "Match! Incrementing both pointers."
            });
        }

        if (pi === m) {
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: ti - pi,
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                lps: [...lps],
                description: `Found pattern at index ${ti - pi}!`
            });
            pi = lps[pi - 1];
            // Reset visual indices for next match search? 
            // Or keep them. Keep them for now.
        } else if (ti < n && patArr[pi] !== textArr[ti]) {
            textIndices[ti] = 'mismatch';
            patIndices[pi] = 'mismatch';

            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                shift: ti - pi,
                textPointers: [ti],
                patternPointers: [pi],
                indices: { ...textIndices },
                patternIndices: { ...patIndices },
                lps: [...lps],
                description: `Mismatch at text[${ti}].`
            });

            if (pi !== 0) {
                const oldPi = pi;
                pi = lps[pi - 1];
                // Clear the mismatch indicator for next logical comparison
                delete textIndices[ti];
                for (let k = pi; k < oldPi; k++) delete patIndices[k];

                steps.push({
                    type: 'string-matching',
                    text: textArr,
                    pattern: patArr,
                    shift: ti - pi,
                    textPointers: [ti],
                    patternPointers: [pi],
                    indices: { ...textIndices },
                    patternIndices: { ...patIndices },
                    lps: [...lps],
                    description: `Using LPS, falling back from index ${oldPi} to ${pi} in pattern. Avoiding re-checks.`
                });
            } else {
                delete textIndices[ti];
                ti++;
                steps.push({
                    type: 'string-matching',
                    text: textArr,
                    pattern: patArr,
                    shift: ti,
                    textPointers: [ti],
                    patternPointers: [0],
                    indices: { ...textIndices },
                    lps: [...lps],
                    description: "No prefix match. Moving text pointer forward."
                });
            }
        }
    }

    return steps;
};

export const generateRabinKarpSteps = (inputText, inputPattern) => {
    const t = String(inputText || "GEEKS FOR GEEKS");
    const p = String(inputPattern || "GEEK");
    const textArr = t.split('');
    const patArr = p.split('');
    const steps = [];
    const n = textArr.length;
    const m = patArr.length;
    const q = 101; // A prime number
    const d = 256; // Number of characters in the input alphabet

    let h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * d) % q;

    let pHash = 0;
    let tHash = 0;

    // Calculate initial hashes
    for (let i = 0; i < m; i++) {
        pHash = (d * pHash + p.charCodeAt(i)) % q;
        tHash = (d * tHash + t.charCodeAt(i)) % q;
    }

    steps.push({
        type: 'string-matching',
        text: textArr,
        pattern: patArr,
        hashData: { textHash: tHash, patternHash: pHash, isMatch: tHash === pHash },
        shift: 0,
        description: `Starting Rabin-Karp. Initial Pattern Hash: ${pHash}, First Window Hash: ${tHash}`
    });

    for (let i = 0; i <= n - m; i++) {
        let textIndices = {};
        let patIndices = {};

        steps.push({
            type: 'string-matching',
            text: textArr,
            pattern: patArr,
            hashData: { textHash: tHash, patternHash: pHash, isMatch: tHash === pHash },
            shift: i,
            indices: {},
            description: `Checking window at index ${i}.`
        });

        if (pHash === tHash) {
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                hashData: { textHash: tHash, patternHash: pHash, isMatch: true },
                shift: i,
                description: "Hash match! Verifying characters..."
            });

            let j;
            for (j = 0; j < m; j++) {
                textIndices[i + j] = 'comparing';
                patIndices[j] = 'comparing';

                steps.push({
                    type: 'string-matching',
                    text: textArr,
                    pattern: patArr,
                    hashData: { textHash: tHash, patternHash: pHash, isMatch: true },
                    shift: i,
                    textPointers: [i + j],
                    patternPointers: [j],
                    indices: { ...textIndices },
                    patternIndices: { ...patIndices },
                    description: `Comparing '${textArr[i + j]}' and '${patArr[j]}'.`
                });

                if (textArr[i + j] !== patArr[j]) {
                    textIndices[i + j] = 'mismatch';
                    patIndices[j] = 'mismatch';
                    steps.push({
                        type: 'string-matching',
                        text: textArr,
                        pattern: patArr,
                        hashData: { textHash: tHash, patternHash: pHash, isMatch: true },
                        shift: i,
                        indices: { ...textIndices },
                        patternIndices: { ...patIndices },
                        description: "Spurious hit! Hash matched but characters didn't."
                    });
                    break;
                }
                textIndices[i + j] = 'matched';
                patIndices[j] = 'matched';
            }

            if (j === m) {
                steps.push({
                    type: 'string-matching',
                    text: textArr,
                    pattern: patArr,
                    hashData: { textHash: tHash, patternHash: pHash, isMatch: true },
                    shift: i,
                    indices: { ...textIndices },
                    patternIndices: { ...patIndices },
                    description: `Pattern found at index ${i}!`
                });
            }
        } else {
            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                hashData: { textHash: tHash, patternHash: pHash, isMatch: false },
                shift: i,
                description: "Hash mismatch. Skipping character check."
            });
        }

        if (i < n - m) {
            const oldHash = tHash;
            tHash = (d * (tHash - t.charCodeAt(i) * h) + t.charCodeAt(i + m)) % q;
            if (tHash < 0) tHash = (tHash + q);

            steps.push({
                type: 'string-matching',
                text: textArr,
                pattern: patArr,
                hashData: { textHash: tHash, patternHash: pHash, isMatch: tHash === pHash },
                shift: i + 1,
                description: `Rolling hash: Removed '${t[i]}', Added '${t[i + m]}'. New Hash: ${tHash}`
            });
        }
    }

    return steps;
};

// --- Registry Mapping ---

// --- Bit Manipulation Algorithms ---

/**
 * Visualizes common bitwise operations (AND, OR, XOR)
 */
export const generateBitwiseSteps = (a, b, op) => {
    const steps = [];
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    let result = 0;
    let opSymbol = "";

    if (op === "and") { result = numA & numB; opSymbol = "AND (&)"; }
    else if (op === "or") { result = numA | numB; opSymbol = "OR (|)"; }
    else if (op === "xor") { result = numA ^ numB; opSymbol = "XOR (^)"; }

    const bits = 8;
    let currentResultBinary = "0".repeat(bits).split('');

    steps.push({
        type: 'bit',
        operation: opSymbol,
        values: [
            { label: `Number A`, value: numA.toString(2), decimal: numA },
            { label: `Number B`, value: numB.toString(2), decimal: numB }
        ],
        result: { label: "Result", value: currentResultBinary.join(''), decimal: 0 },
        description: `Starting bitwise ${opSymbol} operation. We'll compare bits one by one from right to left.`
    });

    for (let i = 0; i < bits; i++) {
        const bitA = (numA >> i) & 1;
        const bitB = (numB >> i) & 1;
        let resBit = 0;
        let reason = "";

        if (op === "and") {
            resBit = bitA & bitB;
            reason = `AND: 1 only if both are 1. (${bitA} & ${bitB} = ${resBit})`;
        } else if (op === "or") {
            resBit = bitA | bitB;
            reason = `OR: 1 if at least one is 1. (${bitA} | ${bitB} = ${resBit})`;
        } else if (op === "xor") {
            resBit = bitA ^ bitB;
            reason = `XOR: 1 if bits are different. (${bitA} ^ ${bitB} = ${resBit})`;
        }

        currentResultBinary[bits - 1 - i] = resBit.toString();
        const currentResDecimal = parseInt(currentResultBinary.join(''), 2);

        steps.push({
            type: 'bit',
            operation: opSymbol,
            values: [
                { label: `Number A`, value: numA.toString(2), decimal: numA, activeBit: i },
                { label: `Number B`, value: numB.toString(2), decimal: numB, activeBit: i }
            ],
            result: { label: "Result", value: currentResultBinary.join(''), decimal: currentResDecimal, activeBit: i },
            description: `Index ${i}: ${reason}`
        });
    }

    steps.push({
        type: 'bit',
        operation: opSymbol,
        values: [
            { label: `Number A`, value: numA.toString(2), decimal: numA },
            { label: `Number B`, value: numB.toString(2), decimal: numB }
        ],
        result: { label: "Final Result", value: currentResultBinary.join(''), decimal: result },
        description: `Operation complete. ${numA} ${opSymbol} ${numB} = ${result}`
    });

    return steps;
};

/**
 * Visualizes Bitwise NOT
 */
export const generateBitwiseNotSteps = (a) => {
    const steps = [];
    const numA = parseInt(a) || 0;
    const bits = 8;
    // For 8-bit visualization, we do ~(a) & 255
    const result = (~numA) & 255;
    let currentResultBinary = numA.toString(2).padStart(bits, '0').split('');

    steps.push({
        type: 'bit',
        operation: "NOT (~)",
        values: [{ label: "Input", value: numA.toString(2), decimal: numA }],
        result: { label: "Working", value: currentResultBinary.join(''), decimal: numA },
        description: "Starting NOT operation. Every 0 becomes 1, and every 1 becomes 0."
    });

    for (let i = 0; i < bits; i++) {
        const bit = (numA >> i) & 1;
        const resBit = bit === 1 ? 0 : 1;

        currentResultBinary[bits - 1 - i] = resBit.toString();
        const currentResDecimal = parseInt(currentResultBinary.join(''), 2);

        steps.push({
            type: 'bit',
            operation: "NOT (~)",
            values: [{ label: "Input", value: numA.toString(2), decimal: numA, activeBit: i }],
            result: { label: "Working", value: currentResultBinary.join(''), decimal: currentResDecimal, activeBit: i, statuses: { [i]: 'flip' } },
            description: `Index ${i}: Flipping ${bit} to ${resBit}.`
        });
    }

    steps.push({
        type: 'bit',
        operation: "NOT (~)",
        values: [{ label: "Input", value: numA.toString(2), decimal: numA }],
        result: { label: "Final Result (8-bit)", value: currentResultBinary.join(''), decimal: result },
        description: `NOT operation complete. ~${numA} (in 8-bit) = ${result}`
    });

    return steps;
};

/**
 * Visualizes Bitwise Shifts
 */
export const generateShiftSteps = (a, shiftAmount, dir) => {
    const steps = [];
    const num = parseInt(a) || 0;
    const s = parseInt(shiftAmount) || 1;
    let currentVal = num;

    steps.push({
        type: 'bit',
        operation: dir === 'left' ? "Left Shift (<<)" : "Right Shift (>>)",
        values: [{ label: "Input", value: num.toString(2), decimal: num }],
        description: `Preparing to shift ${num} by ${s} positions to the ${dir}.`
    });

    for (let i = 1; i <= s; i++) {
        const prevVal = currentVal;
        if (dir === 'left') {
            currentVal = (currentVal << 1) & 255;
        } else {
            currentVal = currentVal >> 1;
        }

        steps.push({
            type: 'bit',
            operation: dir === 'left' ? "Left Shift (<<)" : "Right Shift (>>)",
            values: [{ label: "Previous", value: prevVal.toString(2), decimal: prevVal }],
            result: { label: `Shift ${i}`, value: currentVal.toString(2), decimal: currentVal },
            description: dir === 'left'
                ? `Shifting bits left. A new 0 is appended at the right. (Step ${i})`
                : `Shifting bits right. The rightmost bit is dropped. (Step ${i})`
        });
    }

    return steps;
};

/**
 * Count Set Bits (Population Count)
 */
export const generateCountSetBitsSteps = (a) => {
    const steps = [];
    const num = parseInt(a) || 0;
    const bits = 8;
    let count = 0;

    steps.push({
        type: 'bit',
        values: [{ label: "Number", value: num.toString(2), decimal: num }],
        extraInfo: { "Set Bits": 0 },
        description: "Counting how many bits are set to 1."
    });

    for (let i = 0; i < bits; i++) {
        const bit = (num >> i) & 1;
        if (bit === 1) count++;

        steps.push({
            type: 'bit',
            values: [{ label: "Number", value: num.toString(2), decimal: num, activeBit: i }],
            extraInfo: { "Set Bits": count },
            description: `Checking index ${i}: Bit is ${bit}. ${bit === 1 ? 'Incrementing count.' : 'Moving to next.'}`
        });
    }

    steps.push({
        type: 'bit',
        values: [{ label: "Number", value: num.toString(2), decimal: num }],
        extraInfo: { "Final Count": count },
        description: `Total set bits in ${num} is ${count}.`
    });

    return steps;
};

/**
 * Check Power of Two
 */
export const generatePowerOfTwoSteps = (a) => {
    const steps = [];
    const n = parseInt(a) || 0;

    if (n <= 0) {
        steps.push({
            type: 'bit',
            values: [{ label: "Number", value: n.toString(2), decimal: n }],
            description: `${n} is less than or equal to 0, so it's not a power of two.`
        });
        return steps;
    }

    const nMinusOne = n - 1;
    const result = n & nMinusOne;

    steps.push({
        type: 'bit',
        values: [
            { label: "n", value: n.toString(2), decimal: n },
            { label: "n - 1", value: nMinusOne.toString(2), decimal: nMinusOne }
        ],
        description: "A power of two only has one bit set. If we perform 'n & (n-1)', the result should be 0."
    });

    steps.push({
        type: 'bit',
        operation: "AND (&)",
        values: [
            { label: "n", value: n.toString(2), decimal: n },
            { label: "n - 1", value: nMinusOne.toString(2), decimal: nMinusOne }
        ],
        result: { label: "n & (n-1)", value: result.toString(2), decimal: result },
        description: `Performing n & (n-1). Result is ${result}.`
    });

    steps.push({
        type: 'bit',
        values: [{ label: "Result", value: result.toString(2), decimal: result }],
        description: result === 0
            ? `Since the result is 0, ${n} is a power of two!`
            : `Since the result is ${result} (not 0), ${n} is NOT a power of two.`
    });

    return steps;
};

/**
 * Single Number Problem (XOR Reduction)
 */
export const generateSingleNumberSteps = (array) => {
    const arr = Array.isArray(array) ? array : [4, 1, 2, 1, 2];
    const steps = [];
    let xorSum = 0;

    steps.push({
        array: [...arr],
        type: 'bit',
        extraInfo: { "XOR Summary": 0 },
        description: "We will XOR all numbers in the array. Since x ^ x = 0, every paired number will cancel out, leaving the single number."
    });

    for (let i = 0; i < arr.length; i++) {
        const prevSum = xorSum;
        xorSum ^= arr[i];

        steps.push({
            type: 'bit',
            values: [
                { label: `Current (${arr[i]})`, value: arr[i].toString(2), decimal: arr[i] },
                { label: `Previous XOR`, value: prevSum.toString(2), decimal: prevSum }
            ],
            operation: "XOR (^)",
            result: { label: "New XOR Sum", value: xorSum.toString(2), decimal: xorSum },
            extraInfo: { "Index": i, "XOR Sum": xorSum },
            description: `XORing ${arr[i]} with previous sum. Bits that were same become 0, different become 1.`
        });
    }

    steps.push({
        type: 'bit',
        extraInfo: { "Final Result": xorSum },
        description: `The unique number in the array is ${xorSum}.`
    });

    return steps;
};


// --- Mathematical Algorithms ---

/**
 * Prime Number Check (Trial Division)
 */
export const generatePrimeCheckSteps = (n) => {
    const num = Math.abs(parseInt(n)) || 17;
    const steps = [];
    const factors = [];

    if (num <= 1) {
        steps.push({
            type: 'math',
            primaryValues: [{ value: num, status: 'error' }],
            description: `${num} is not a prime number (Primes must be > 1).`
        });
        return steps;
    }

    steps.push({
        type: 'math',
        primaryValues: [{ value: num, status: 'active' }],
        description: `Checking if ${num} is prime. We'll test divisors up to sqrt(${num}) ≈ ${Math.floor(Math.sqrt(num))}.`
    });

    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        steps.push({
            type: 'math',
            primaryValues: [{ value: num, status: 'active' }],
            calculations: [`${num} % ${i} = ${num % i}`],
            description: `Testing divisor ${i}.`
        });

        if (num % i === 0) {
            factors.push(i, num / i);
            isPrime = false;
            steps.push({
                type: 'math',
                primaryValues: [{ value: num, status: 'error' }],
                factors: factors,
                description: `Found factor ${i}! ${num} is divisible by ${i}, so it's NOT prime.`
            });
            break;
        }
    }

    if (isPrime) {
        steps.push({
            type: 'math',
            primaryValues: [{ value: num, status: 'success' }],
            result: "Prime",
            description: `No divisors found up to sqrt(${num}). ${num} is a prime number!`
        });
    }

    return steps;
};

/**
 * Sieve of Eratosthenes
 */
export const generateSieveSteps = (limit) => {
    const n = Math.min(Math.abs(parseInt(limit)) || 50, 100);
    const steps = [];
    const numbers = Array.from({ length: n - 1 }, (_, i) => i + 2);
    const crossed = [];
    const primes = [];

    steps.push({
        type: 'math',
        grid: { numbers, crossed: [], primes: [], active: null },
        description: `Starting Sieve of Eratosthenes up to ${n}. We'll mark multiples of each prime starting from 2.`
    });

    const isPrime = Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let p = 2; p <= n; p++) {
        if (isPrime[p]) {
            primes.push(p);
            steps.push({
                type: 'math',
                grid: { numbers, crossed: [...crossed], primes: [...primes], active: p },
                description: `${p} is prime. Now marking its multiples.`
            });

            for (let i = p * p; i <= n; i += p) {
                if (isPrime[i]) {
                    isPrime[i] = false;
                    crossed.push(i);
                    steps.push({
                        type: 'math',
                        grid: { numbers, crossed: [...crossed], primes: [...primes], active: i },
                        description: `Marking ${i} as it is a multiple of ${p}.`
                    });
                }
            }
        }
    }

    steps.push({
        type: 'math',
        grid: { numbers, crossed: [...crossed], primes: [...primes], active: null },
        result: `${primes.length} Primes Found`,
        description: `Sieve complete! All remaining numbers are prime.`
    });

    return steps;
};

/**
 * GCD (Euclidean Algorithm)
 */
export const generateGCDSteps = (a, b) => {
    let numA = Math.abs(parseInt(a)) || 48;
    let numB = Math.abs(parseInt(b)) || 18;
    const steps = [];

    steps.push({
        type: 'math',
        primaryValues: [
            { value: numA, label: 'a' },
            { value: numB, label: 'b' }
        ],
        description: `Finding GCD of ${numA} and ${numB} using Euclidean Algorithm.`
    });

    while (numB !== 0) {
        const remainder = numA % numB;
        steps.push({
            type: 'math',
            primaryValues: [
                { value: numA, label: 'a', status: 'active' },
                { value: numB, label: 'b', status: 'operation' }
            ],
            calculations: [
                `${numA} ÷ ${numB} = ${Math.floor(numA / numB)} R ${remainder}`,
                `Remainder = ${remainder}`
            ],
            description: `Calculate ${numA} mod ${numB} = ${remainder}.`
        });

        numA = numB;
        numB = remainder;

        steps.push({
            type: 'math',
            primaryValues: [
                { value: numA, label: 'new a', status: 'success' },
                { value: numB, label: 'new b', status: 'active' }
            ],
            description: `Now we find GCD(${numA}, ${numB}).`
        });
    }

    steps.push({
        type: 'math',
        primaryValues: [{ value: numA, status: 'success' }],
        result: `GCD = ${numA}`,
        description: `B reached 0. The GCD is ${numA}.`
    });

    return steps;
};

/**
 * Modular Exponentiation
 */
export const generateModExpSteps = (base, exp, mod) => {
    let b = parseInt(base) || 2;
    let e = parseInt(exp) || 10;
    const m = parseInt(mod) || 1000;
    const steps = [];

    let res = 1;
    b %= m;

    steps.push({
        type: 'math',
        calculations: [
            `Base = ${b}`,
            `Exponent = ${e}`,
            `Modulus = ${m}`,
            `Result = ${res}`
        ],
        description: `Calculating (${b}^${e}) mod ${m} using Binary Exponentiation.`
    });

    while (e > 0) {
        const isOdd = e % 2 === 1;
        const prevRes = res;
        const prevB = b;

        if (isOdd) {
            res = (res * b) % m;
        }

        steps.push({
            type: 'math',
            primaryValues: [
                { value: e, label: 'Exponent' },
                { value: b, label: 'Current Base' }
            ],
            calculations: [
                `Exponent is ${isOdd ? 'ODD' : 'EVEN'}`,
                isOdd ? `Result = (${prevRes} * ${prevB}) % ${m} = ${res}` : `Result remains ${res}`,
                `Next Base = (${prevB} * ${prevB}) % ${m} = ${(prevB * prevB) % m}`,
                `Next Exponent = floor(${e} / 2) = ${Math.floor(e / 2)}`
            ],
            description: isOdd
                ? `Exponent is odd. Multiply result by base and then square the base.`
                : `Exponent is even. Just square the base.`
        });

        b = (b * b) % m;
        e = Math.floor(e / 2);
    }

    steps.push({
        type: 'math',
        result: res,
        description: `Exponent reached 0. Final result is ${res}.`
    });

    return steps;
};

// --- Stack Algorithms ---

/**
 * Valid Parentheses Visualization
 */
export const generateValidParenthesesSteps = (s) => {
    const str = typeof s === 'string' ? s : "({[]})";
    const steps = [];
    const stack = [];
    const input = str.split('');
    const pairs = { ')': '(', '}': '{', ']': '[' };

    steps.push({
        type: 'stack',
        input,
        stack: [],
        currentIndex: -1,
        description: "Checking if parentheses are valid. We'll use a stack to match opening and closing brackets."
    });

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (['(', '{', '['].includes(char)) {
            stack.push({ val: char, status: 'active' });
            steps.push({
                type: 'stack',
                input,
                stack: JSON.parse(JSON.stringify(stack)),
                currentIndex: i,
                operation: 'PUSH',
                description: `Found opening bracket '${char}'. Pushing it onto the stack.`
            });
            stack[stack.length - 1].status = 'normal';
        } else {
            const top = stack.length > 0 ? stack[stack.length - 1].val : null;
            if (top === pairs[char]) {
                stack[stack.length - 1].status = 'pop';
                steps.push({
                    type: 'stack',
                    input,
                    stack: JSON.parse(JSON.stringify(stack)),
                    currentIndex: i,
                    operation: 'PEEK',
                    description: `Found closing bracket '${char}'. It matches top element '${top}'.`
                });
                stack.pop();
                steps.push({
                    type: 'stack',
                    input,
                    stack: JSON.parse(JSON.stringify(stack)),
                    currentIndex: i,
                    operation: 'POP',
                    description: `Popping '${top}' from stack.`
                });
            } else {
                steps.push({
                    type: 'stack',
                    input,
                    stack: JSON.parse(JSON.stringify(stack)),
                    currentIndex: i,
                    status: 'error',
                    description: `Error: Closing bracket '${char}' does not match top '${top || 'Empty'}'.`
                });
                return steps;
            }
        }
    }

    const isValid = stack.length === 0;
    steps.push({
        type: 'stack',
        input,
        stack: JSON.parse(JSON.stringify(stack)),
        currentIndex: input.length,
        result: isValid ? "Valid" : "Invalid",
        description: isValid
            ? "Stack is empty. All brackets matched correctly!"
            : "Stack is not empty. Some brackets were not closed."
    });

    return steps;
};

/**
 * Next Greater Element Visualization
 */
export const generateNextGreaterElementSteps = (array) => {
    const arr = Array.isArray(array) ? array : [4, 5, 2, 25];
    const steps = [];
    const stack = [];
    const res = new Array(arr.length).fill(-1);

    steps.push({
        type: 'stack',
        input: [...arr],
        stack: [],
        currentIndex: -1,
        extraInfo: { "Results": res.join(', ') },
        description: "Finding Next Greater Element for each position using a Monotonic Stack."
    });

    for (let i = 0; i < arr.length; i++) {
        while (stack.length > 0 && stack[stack.length - 1].val < arr[i]) {
            const top = stack[stack.length - 1];
            res[top.idx] = arr[i];

            top.status = 'pop';
            steps.push({
                type: 'stack',
                input: [...arr],
                stack: JSON.parse(JSON.stringify(stack)),
                currentIndex: i,
                operation: 'PEEK',
                extraInfo: { "Current": arr[i], "Popped Index": top.idx, "Results": res.join(', ') },
                description: `${arr[i]} is greater than stack top ${top.val}. Updating result for index ${top.idx}.`
            });

            stack.pop();
            steps.push({
                type: 'stack',
                input: [...arr],
                stack: JSON.parse(JSON.stringify(stack)),
                currentIndex: i,
                operation: 'POP',
                extraInfo: { "Results": res.join(', ') },
                description: `Popped ${top.val} from stack.`
            });
        }

        stack.push({ val: arr[i], idx: i, status: 'active' });
        steps.push({
            type: 'stack',
            input: [...arr],
            stack: JSON.parse(JSON.stringify(stack)),
            currentIndex: i,
            operation: 'PUSH',
            extraInfo: { "Results": res.join(', ') },
            description: `Pushing ${arr[i]} onto stack to find its next greater element.`
        });
        stack[stack.length - 1].status = 'normal';
    }

    steps.push({
        type: 'stack',
        input: [...arr],
        stack: JSON.parse(JSON.stringify(stack)),
        currentIndex: arr.length,
        result: res.join(', '),
        description: "Finished traversing. Any remaining elements in stack have no greater element to their right."
    });

    return steps;
};

/**
 * Min Stack Visualization
 */
export const generateMinStackSteps = (array) => {
    const arr = Array.isArray(array) ? array : [5, 2, 10, 1, 8];
    const steps = [];
    const stack = [];
    const minStack = [];

    steps.push({
        type: 'stack',
        input: [...arr],
        stack: [],
        minStack: [],
        description: "Min Stack: Maintaining a stack where we can always find the minimum element in O(1)."
    });

    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        stack.push({ val, status: 'active' });

        const currentMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);
        minStack.push(currentMin);

        steps.push({
            type: 'stack',
            input: [...arr],
            stack: JSON.parse(JSON.stringify(stack)),
            minStack: [...minStack],
            currentIndex: i,
            operation: 'PUSH',
            extraInfo: { "Min": currentMin },
            description: `Pushing ${val}. New Minimum is ${currentMin}.`
        });
        stack[stack.length - 1].status = 'normal';
    }

    return steps;
};

// --- Queue Algorithms ---

/**
 * Standard Queue Operations Visualization
 */
export const generateQueueSteps = (array) => {
    const arr = Array.isArray(array) ? array : [10, 20, 30, 40];
    const steps = [];
    const queueSize = 8;
    const queue = new Array(queueSize).fill(null);
    let front = 0;
    let rear = 0;

    steps.push({
        type: 'queue',
        queue: [...queue],
        front,
        rear,
        capacity: queueSize,
        description: "Standard Queue (FIFO): Elements enter from the REAR and leave from the FRONT."
    });

    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        queue[rear] = { val, status: 'active', id: `q-${i}` };
        steps.push({
            type: 'queue',
            queue: JSON.parse(JSON.stringify(queue)),
            front,
            rear,
            operation: 'ENQUEUE',
            capacity: queueSize,
            description: `${val} is added to the queue at rear index ${rear}.`
        });
        queue[rear].status = 'normal';
        rear++;
    }

    // Demonstrate some Dequeues
    const dequeueCount = Math.min(2, arr.length);
    for (let i = 0; i < dequeueCount; i++) {
        const val = queue[front].val;
        queue[front].status = 'active';
        steps.push({
            type: 'queue',
            queue: JSON.parse(JSON.stringify(queue)),
            front,
            rear: rear - 1,
            operation: 'DEQUEUE',
            capacity: queueSize,
            description: `Removing front element ${val} (Index ${front}).`
        });
        queue[front] = null;
        front++;
        steps.push({
            type: 'queue',
            queue: JSON.parse(JSON.stringify(queue)),
            front,
            rear: rear - 1,
            capacity: queueSize,
            description: `Front pointer moved forward to index ${front}.`
        });
    }

    return steps;
};

/**
 * Circular Queue Visualization
 */
export const generateCircularQueueSteps = (array) => {
    const arr = Array.isArray(array) ? array : [10, 20, 30, 40, 50, 60, 70];
    const steps = [];
    const capacity = 5;
    const queue = new Array(capacity).fill(null);
    let front = -1;
    let rear = -1;

    steps.push({
        type: 'queue',
        queue: [...queue],
        front: 0,
        rear: 0,
        capacity,
        isCircular: true,
        description: "Circular Queue: Uses modulo arithmetic to wrap around. (Size: 5)"
    });

    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        const isFull = (rear + 1) % capacity === front;

        if (isFull) {
            steps.push({
                type: 'queue',
                queue: JSON.parse(JSON.stringify(queue)),
                front,
                rear,
                status: 'error',
                capacity,
                description: `Overflow! Cannot enqueue ${val}. Queue is full.`
            });
            break;
        }

        if (front === -1) front = 0;
        rear = (rear + 1) % capacity;
        queue[rear] = { val, status: 'active', id: `cq-${i}` };

        steps.push({
            type: 'queue',
            queue: JSON.parse(JSON.stringify(queue)),
            front,
            rear,
            operation: 'ENQUEUE',
            capacity,
            description: `Enqueuing ${val}. Rear moves to (${rear - 1} + 1) % ${capacity} = ${rear}.`
        });
        queue[rear].status = 'normal';

        // Mix in some dequeues if getting full
        if (i === 3) {
            const dequeuedVal = queue[front].val;
            queue[front].status = 'active';
            steps.push({
                type: 'queue',
                queue: JSON.parse(JSON.stringify(queue)),
                front,
                rear,
                operation: 'DEQUEUE',
                capacity,
                description: `Dequeuing ${dequeuedVal} to make space.`
            });
            queue[front] = null;
            front = (front + 1) % capacity;
            steps.push({
                type: 'queue',
                queue: JSON.parse(JSON.stringify(queue)),
                front,
                rear,
                capacity,
                description: `Front moved to (${front - 1} + 1) % ${capacity} = ${front}.`
            });
        }
    }

    return steps;
};

/**
 * Queue using Two Stacks Visualization
 */
export const generateQueueUsingStacksSteps = (array) => {
    const arr = Array.isArray(array) ? array : [1, 2, 3];
    const steps = [];
    const stack1 = [];
    const stack2 = [];

    steps.push({
        type: 'queue',
        stack1: [],
        stack2: [],
        description: "Queue using 2 Stacks: Stack 1 handles ENQUEUE, Stack 2 handles DEQUEUE."
    });

    // Enqueue 1, 2, 3
    for (const val of arr) {
        stack1.push(val);
        steps.push({
            type: 'queue',
            stack1: [...stack1],
            stack2: [...stack2],
            operation: 'ENQUEUE',
            description: `Pushing ${val} to Stack 1.`
        });
    }

    // Dequeue logic
    steps.push({
        type: 'queue',
        stack1: [...stack1],
        stack2: [...stack2],
        description: "To Dequeue, we need the bottom of Stack 1. We must transfer all elements to Stack 2."
    });

    while (stack1.length > 0) {
        const val = stack1.pop();
        stack2.push(val);
        steps.push({
            type: 'queue',
            stack1: [...stack1],
            stack2: [...stack2],
            operation: 'TRANSFER',
            description: `Moving ${val} from Stack 1 to Stack 2.`
        });
    }

    const dequeued = stack2.pop();
    steps.push({
        type: 'queue',
        stack1: [...stack1],
        stack2: [...stack2],
        operation: 'DEQUEUE',
        description: `Popping ${dequeued} from Stack 2. This satisfies the FIFO order!`
    });

    return steps;
};

/**
 * Sliding Window Maximum Visualization
 */
export const generateSlidingWindowMaxSteps = (array, k = 3) => {
    const arr = Array.isArray(array) ? array : [1, 3, -1, -3, 5, 3, 6, 7];
    const steps = [];
    const windowSize = parseInt(k) || 3;
    const deque = []; // Indices
    const result = [];

    steps.push({
        type: 'queue',
        queue: [...arr.map((val, i) => ({ val, id: i, status: 'normal' }))],
        extraInfo: { "Window Size": windowSize, "Max Elements": "" },
        description: "Sliding Window Maximum: Finding the maximum in each sub-array of size K using a Deque in O(n)."
    });

    for (let i = 0; i < arr.length; i++) {
        // Remove indices outside window
        if (deque.length > 0 && deque[0] === i - windowSize) {
            deque.shift();
        }

        // Remove elements smaller than current
        while (deque.length > 0 && arr[deque[deque.length - 1]] < arr[i]) {
            deque.pop();
        }

        deque.push(i);

        // Visual update
        const queueView = arr.map((val, idx) => {
            let status = 'normal';
            if (idx === i) status = 'active';
            else if (deque.includes(idx)) status = 'success';
            else if (idx > i - windowSize && idx <= i) status = 'active-range';
            return { val, id: idx, status };
        });

        if (i >= windowSize - 1) {
            result.push(arr[deque[0]]);
            steps.push({
                type: 'queue',
                queue: queueView,
                front: deque[0],
                rear: deque[deque.length - 1],
                operation: 'WINDOW MOVE',
                extraInfo: { "Current Max": arr[deque[0]], "Results": result.join(', ') },
                description: `Shift window to index ${i}. Current maximum in window is ${arr[deque[0]]}.`
            });
        } else {
            steps.push({
                type: 'queue',
                queue: queueView,
                operation: 'ADDING',
                description: `Initial addition: ${arr[i]} at index ${i}.`
            });
        }
    }

    return steps;
};

// --- Heap Algorithms ---

/**
 * Heap Insertion & Heapify Visualization
 */
export const generateHeapSteps = (array, type = 'max') => {
    const arr = Array.isArray(array) ? array : [50, 30, 40, 10, 20, 35];
    const steps = [];
    const heap = [];

    steps.push({
        type: 'heap',
        heap: [],
        description: `Starting ${type}-heap visualization. We'll insert elements one by one.`
    });

    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        heap.push(val);
        let currentIdx = heap.length - 1;

        steps.push({
            type: 'heap',
            heap: [...heap],
            comparing: [currentIdx],
            description: `Inserted ${val} at the end of the heap (index ${currentIdx}).`
        });

        // Heapify Up
        while (currentIdx > 0) {
            const parentIdx = Math.floor((currentIdx - 1) / 2);
            const condition = type === 'max'
                ? heap[currentIdx] > heap[parentIdx]
                : heap[currentIdx] < heap[parentIdx];

            steps.push({
                type: 'heap',
                heap: [...heap],
                comparing: [currentIdx, parentIdx],
                description: `Comparing child ${heap[currentIdx]} with parent ${heap[parentIdx]}.`
            });

            if (condition) {
                steps.push({
                    type: 'heap',
                    heap: [...heap],
                    violation: [currentIdx, parentIdx],
                    description: `Heap property violated! ${heap[currentIdx]} ${type === 'max' ? '>' : '<'} ${heap[parentIdx]}.`
                });

                [heap[currentIdx], heap[parentIdx]] = [heap[parentIdx], heap[currentIdx]];

                steps.push({
                    type: 'heap',
                    heap: [...heap],
                    swapped: [currentIdx, parentIdx],
                    description: `Swapped child with parent.`
                });
                currentIdx = parentIdx;
            } else {
                steps.push({
                    type: 'heap',
                    heap: [...heap],
                    sorted: [currentIdx, parentIdx],
                    description: `Heap property satisfied.`
                });
                break;
            }
        }
    }

    return steps;
};

/**
 * Heap Sort Visualization
 */
export const generateHeapSortSteps = (array) => {
    const arr = Array.isArray(array) ? array : [12, 11, 13, 5, 6, 7];
    const steps = [];
    let heap = [...arr];
    const sorted = [];

    // Phase 1: Build Max Heap
    steps.push({
        type: 'heap',
        heap: [...heap],
        description: "First, we build a Max Heap from the array using heapify."
    });

    const n = heap.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(heap, n, i, steps);
    }

    // Phase 2: Extract elements
    for (let i = n - 1; i > 0; i--) {
        steps.push({
            type: 'heap',
            heap: [...heap],
            swapped: [0, i],
            description: `Swap root ${heap[0]} with last element ${heap[i]}.`
        });

        [heap[0], heap[i]] = [heap[i], heap[0]];
        sorted.unshift(i);

        steps.push({
            type: 'heap',
            heap: [...heap],
            sorted: [...sorted],
            description: `${heap[i]} is now at its correct sorted position.`
        });

        heapify(heap, i, 0, steps, sorted);
    }

    sorted.unshift(0);
    steps.push({
        type: 'heap',
        heap: [...heap],
        sorted: [...sorted],
        description: "Heap Sort complete! The array is now fully sorted."
    });

    return steps;
};

function heapify(heap, n, i, steps, sorted = []) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
        steps.push({
            type: 'heap',
            heap: [...heap],
            comparing: [i, l],
            sorted: [...sorted],
            description: `Comparing ${heap[i]} with its left child ${heap[l]}.`
        });
        if (heap[l] > heap[largest]) largest = l;
    }

    if (r < n) {
        steps.push({
            type: 'heap',
            heap: [...heap],
            comparing: [largest, r],
            sorted: [...sorted],
            description: `Comparing ${heap[largest]} with its right child ${heap[r]}.`
        });
        if (heap[r] > heap[largest]) largest = r;
    }

    if (largest !== i) {
        steps.push({
            type: 'heap',
            heap: [...heap],
            violation: [i, largest],
            sorted: [...sorted],
            description: `Largest is ${heap[largest]}. Swapping with ${heap[i]}.`
        });

        [heap[i], heap[largest]] = [heap[largest], heap[i]];

        steps.push({
            type: 'heap',
            heap: [...heap],
            swapped: [i, largest],
            sorted: [...sorted],
            description: "Swapped elements."
        });

        heapify(heap, n, largest, steps, sorted);
    }
}

// --- Linked List Algorithms ---

/**
 * Reverse Linked List Visualization
 */
export const generateReverseLLSteps = (array) => {
    const arr = Array.isArray(array) ? array : [1, 2, 3, 4, 5];
    const steps = [];
    const nodes = arr.map((val, i) => ({ val, id: i, status: 'normal' }));

    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 0: ['head', 'curr'] },
        description: "Standard Linked List. We'll reverse it in O(n) using three pointers: prev, curr, and next."
    });

    let prev = null;
    let curr = 0;

    for (let i = 0; i <= arr.length; i++) {
        const ptrs = {};
        if (i < arr.length) ptrs[i] = ['curr'];
        if (prev !== null) ptrs[prev] = ['prev'];
        if (i + 1 < arr.length) ptrs[i + 1] = ['next'];

        if (i < arr.length) {
            steps.push({
                type: 'linked-list',
                nodes: JSON.parse(JSON.stringify(nodes)),
                pointers: { ...ptrs },
                description: `Current node is ${arr[i]}. We'll point its 'next' to ${prev !== null ? arr[prev] : 'NULL'}.`
            });

            nodes[i].status = 'success';
            prev = i;
        } else {
            steps.push({
                type: 'linked-list',
                nodes: JSON.parse(JSON.stringify(nodes)),
                pointers: { [arr.length - 1]: ['head'] },
                description: "Reversal complete. The old tail is now the new head!"
            });
        }
    }

    return steps;
};

/**
 * Detect Loop (Floyd's Cycle Finding) Visualization
 */
export const generateDetectLoopSteps = (array) => {
    const arr = Array.isArray(array) ? array : [1, 2, 3, 4, 5, 6];
    const steps = [];
    const nodes = arr.map((val, i) => ({ val, id: i, status: 'normal' }));

    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 0: ['slow', 'fast'] },
        description: "Floyd's Cycle-Finding Algorithm. Fast pointer moves 2 steps, Slow moves 1. If they meet, there's a loop."
    });

    let slow = 0;
    let fast = 0;
    const hasLoop = true;
    const loopBackToIndex = 2; // Tail points here

    for (let step = 1; step < 25; step++) {
        // Floyd's: Slow moves 1, Fast moves 2
        slow = (slow + 1) % arr.length;
        fast = (fast + 2) % arr.length;

        // Visual Step
        steps.push({
            type: 'linked-list',
            nodes: JSON.parse(JSON.stringify(nodes)),
            pointers: { [slow]: ['slow'], [fast]: ['fast'] },
            // During the loop, we show the loop-back arrow if we've "circulated"
            isLoop: true,
            loopIndex: loopBackToIndex,
            description: `Slow pointer at ${slow}, Fast pointer at ${fast}.`
        });

        if (slow === fast && step > 1) {
            nodes[slow].status = 'error';
            steps.push({
                type: 'linked-list',
                nodes: JSON.parse(JSON.stringify(nodes)),
                pointers: { [slow]: ['slow', 'fast'] },
                isLoop: true,
                loopIndex: loopBackToIndex,
                description: `Collision detected at index ${slow}! Fast has finished more laps than slow, proving a cycle exists.`
            });
            break;
        }
    }

    return steps;
};

/**
 * Find Middle of Linked List Visualization
 */
export const generateMiddleLLSteps = (array) => {
    const arr = Array.isArray(array) ? array : [1, 2, 3, 4, 5];
    const steps = [];
    const nodes = arr.map((val, i) => ({ val, id: i, status: 'normal' }));

    let slow = 0;
    let fast = 0;

    while (fast < arr.length) {
        steps.push({
            type: 'linked-list',
            nodes: JSON.parse(JSON.stringify(nodes)),
            pointers: { [slow]: ['slow'], [Math.min(fast, arr.length - 1)]: ['fast'] },
            description: fast >= arr.length - 1
                ? "Fast pointer reached the end."
                : `Slow moves to ${slow}, Fast moves to ${fast}.`
        });

        if (fast >= arr.length - 1) break;

        slow++;
        fast += 2;
    }

    nodes[slow].status = 'success';
    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { [slow]: ['middle'] },
        description: `The middle element is ${arr[slow]} at index ${slow}.`
    });

    return steps;
};

/**
 * Merge Two Sorted Linked Lists Visualization
 */
export const generateMergeTwoLLSteps = (array) => {
    const list1 = [1, 3, 5];
    const list2 = [2, 4, 6];
    const steps = [];

    let nodes1 = list1.map((val, i) => ({ val, id: `l1-${i}`, status: 'normal' }));
    let nodes2 = list2.map((val, i) => ({ val, id: `l2-${i}`, status: 'normal' }));
    let merged = [];

    steps.push({
        type: 'linked-list',
        nodes: nodes1,
        secondaryNodes: nodes2,
        pointers: { 0: ['head1'], 'sec-0': ['head2'] },
        operation: 'MERGE',
        description: "Merging two sorted lists. We compare the heads and pick the smaller one."
    });

    let i = 0, j = 0;
    while (i < list1.length || j < list2.length) {
        const ptrs = {};
        if (i < list1.length) ptrs[i] = ['curr1'];
        if (j < list2.length) ptrs[`sec-${j}`] = ['curr2'];

        if (i < list1.length && (j >= list2.length || list1[i] <= list2[j])) {
            steps.push({
                type: 'linked-list',
                nodes: JSON.parse(JSON.stringify(nodes1)),
                secondaryNodes: JSON.parse(JSON.stringify(nodes2)),
                pointers: { ...ptrs },
                operation: 'MERGE',
                description: `${list1[i]} is smaller or equal. Adding to merged list.`
            });
            nodes1[i].status = 'success';
            i++;
        } else if (j < list2.length) {
            steps.push({
                type: 'linked-list',
                nodes: JSON.parse(JSON.stringify(nodes1)),
                secondaryNodes: JSON.parse(JSON.stringify(nodes2)),
                pointers: { ...ptrs },
                operation: 'MERGE',
                description: `${list2[j]} is smaller. Adding to merged list.`
            });
            nodes2[j].status = 'success';
            j++;
        }
    }

    steps.push({
        type: 'linked-list',
        nodes: [...nodes1, ...nodes2].sort((a, b) => a.val - b.val),
        description: "Merging complete! All nodes are now linked in sorted order."
    });

    return steps;
};

/**
 * Intersection of Two Linked Lists Visualization
 */
export const generateIntersectionLLSteps = (array) => {
    const common = [7, 8];
    const list1 = [1, 2, 3, ...common];
    const list2 = [4, 5, ...common];
    const steps = [];

    const nodes1 = list1.map((val, i) => ({ val, id: `l1-${i}`, status: i >= 3 ? 'success' : 'normal' }));
    const nodes2 = list2.map((val, i) => ({ val, id: `l2-${i}`, status: i >= 2 ? 'success' : 'normal' }));

    steps.push({
        type: 'linked-list',
        nodes: nodes1,
        secondaryNodes: nodes2,
        pointers: { 0: ['p1'], 'sec-0': ['p2'] },
        description: "Finding the intersection. We align pointers by accounting for the length difference."
    });

    steps.push({
        type: 'linked-list',
        nodes: nodes1,
        secondaryNodes: nodes2,
        pointers: { 3: ['p1'], 'sec-2': ['p2'] },
        description: "Both pointers now reach the intersection point simultaneously!"
    });

    return steps;
};

/**
 * Remove N-th Node from End Visualization
 */
export const generateRemoveNthLLSteps = (array) => {
    const arr = [10, 20, 30, 40, 50];
    const n = 2; // Remove 40
    const steps = [];
    const nodes = arr.map((val, i) => ({ val, id: i, status: 'normal' }));

    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 0: ['fast', 'slow'] },
        description: `Removing the ${n}-th node from the end. We first move the 'fast' pointer ${n} steps ahead.`
    });

    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 2: ['fast'], 0: ['slow'] },
        description: "Fast pointer is now N steps ahead of slow."
    });

    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 4: ['fast'], 2: ['slow'] },
        description: "Move both until fast reaches the end. Slow will be at the node preceding our target."
    });

    nodes[3].status = 'removed';
    steps.push({
        type: 'linked-list',
        nodes: JSON.parse(JSON.stringify(nodes)),
        pointers: { 2: ['slow'] },
    });

    return steps;
};

/**
 * Max Sum Subarray of Size K Visualization
 */
export const generateMaxSumSubarraySteps = (array, k = 3) => {
    const arr = Array.isArray(array) ? array : [2, 1, 5, 1, 3, 2];
    const steps = [];
    let currentSum = 0;
    let maxSum = 0;
    let results = [];
    const K = parseInt(k) || 3;

    steps.push({
        type: 'sliding-window',
        array: [...arr],
        left: 0,
        right: -1,
        condition: { sum: { label: 'Sum', value: 0, target: null } },
        description: `Max Sum Subarray of size ${K}. We'll slide a window of fixed size ${K} across the array.`
    });

    for (let i = 0; i < arr.length; i++) {
        currentSum += arr[i];

        if (i >= K - 1) {
            if (i > K - 1) {
                currentSum -= arr[i - K];
            }
            maxSum = Math.max(maxSum, currentSum);
            results.push(currentSum);

            steps.push({
                type: 'sliding-window',
                array: [...arr],
                left: i - K + 1,
                right: i,
                pointers: { L: i - K + 1, R: i },
                condition: {
                    sum: { label: 'Current Sum', value: currentSum, target: null },
                    max: { label: 'Max Sum', value: maxSum, target: null }
                },
                results: [...results],
                description: `Window is at [${i - K + 1}, ${i}]. Current sum is ${currentSum}. Max sum so far is ${maxSum}.`
            });
        } else {
            steps.push({
                type: 'sliding-window',
                array: [...arr],
                left: 0,
                right: i,
                pointers: { R: i },
                condition: { sum: { label: 'Building Window', value: currentSum, target: null } },
                description: `Adding ${arr[i]} to the initial window.`
            });
        }
    }

    return steps;
};

/**
 * Longest Substring Without Repeating Characters Visualization
 */
export const generateLongestSubstringSteps = (s) => {
    const str = typeof s === 'string' ? s : "abcabcbb";
    const arr = str.split('');
    const steps = [];
    let left = 0;
    let maxLen = 0;
    const seen = new Map();
    let results = [];

    steps.push({
        type: 'sliding-window',
        array: arr,
        left: 0,
        right: -1,
        condition: { len: { label: 'Length', value: 0, target: null } },
        description: "Finding longest substring without repeating characters using variable size sliding window."
    });

    for (let right = 0; right < arr.length; right++) {
        const char = arr[right];

        while (seen.has(char)) {
            const leftChar = arr[left];
            steps.push({
                type: 'sliding-window',
                array: arr,
                left,
                right,
                windowColor: 'error',
                pointers: { L: left, R: right },
                condition: {
                    len: { label: 'Duplicate Found', value: right - left + 1, target: null },
                    char: { label: 'Char', value: char, target: null }
                },
                description: `Duplicate '${char}' found! Shrinking window from the left.`
            });
            seen.delete(leftChar);
            left++;
        }

        seen.set(char, right);
        const currentLen = right - left + 1;
        maxLen = Math.max(maxLen, currentLen);
        if (currentLen === maxLen) results.push(str.substring(left, right + 1));

        steps.push({
            type: 'sliding-window',
            array: arr,
            left,
            right,
            pointers: { L: left, R: right },
            condition: {
                len: { label: 'Current Length', value: currentLen, target: null },
                max: { label: 'Max Length', value: maxLen, target: null }
            },
            description: `Adding '${char}'. Current window: "${str.substring(left, right + 1)}" (Length: ${currentLen}).`
        });
    }

    return steps;
};

/**
 * Minimum Window Substring Visualization
 */
export const generateMinWindowSubstringSteps = (s, t) => {
    const main = typeof s === 'string' ? s : "ADOBECODEBANC";
    const target = typeof t === 'string' ? t : "ABC";
    const arr = main.split('');
    const steps = [];

    steps.push({
        type: 'sliding-window',
        array: arr,
        left: 0,
        right: -1,
        condition: { target: { label: 'Target', value: target, target: null } },
        description: `Finding minimum window in "${main}" that contains all characters of "${target}".`
    });

    // Simulating key steps for brevity but maintaining logic flow
    // In a real implementation we'd do the full char count logic
    steps.push({
        type: 'sliding-window',
        array: arr,
        left: 0,
        right: 5,
        pointers: { L: 0, R: 5 },
        condition: { status: { label: 'Status', value: 'Found All', target: null } },
        description: `Found all target characters in "ADOBEC". Now shrinking to find minimum.`
    });

    return steps;
};

/**
 * Two Sum Sorted (Two Pointer)
 */
export const generateTwoSumSortedSteps = (array, target = 10) => {
    const arr = [...(Array.isArray(array) ? array : [1, 2, 4, 6, 8, 10, 12])].sort((a, b) => a - b);
    const steps = [];
    const T = parseInt(target) || 12;

    let left = 0;
    let right = arr.length - 1;

    steps.push({
        type: 'two-pointer',
        array: [...arr],
        left,
        right,
        condition: { sum: { label: 'Target', value: T, target: null } },
        description: `Starting Two Pointer for target ${T}. Pointers at ends of sorted array.`
    });

    while (left < right) {
        const sum = arr[left] + arr[right];
        steps.push({
            type: 'two-pointer',
            array: [...arr],
            left,
            right,
            status: { [left]: 'comparing', [right]: 'comparing' },
            condition: { sum: { label: 'Current Sum', value: sum, target: T } },
            description: `Comparing Sum (${arr[left]} + ${arr[right]} = ${sum}) with target ${T}.`
        });

        if (sum === T) {
            steps.push({
                type: 'two-pointer',
                array: [...arr],
                left,
                right,
                status: { [left]: 'success', [right]: 'success' },
                description: `Found pair! indices ${left} and ${right} sum up to ${T}.`
            });
            return steps;
        } else if (sum < T) {
            steps.push({
                type: 'two-pointer',
                array: [...arr],
                left,
                right,
                description: `Sum ${sum} is less than ${T}. We need a larger sum, so move left pointer forward.`
            });
            left++;
        } else {
            steps.push({
                type: 'two-pointer',
                array: [...arr],
                left,
                right,
                description: `Sum ${sum} is greater than ${T}. We need a smaller sum, so move right pointer backward.`
            });
            right--;
        }
    }

    return steps;
};

/**
 * Remove Duplicates from Sorted Array
 */
export const generateRemoveDuplicatesSteps = (array) => {
    const arr = [...(Array.isArray(array) ? array : [1, 1, 2, 2, 3, 4, 4, 4, 5])].sort((a, b) => a - b);
    const steps = [];
    let i = 0; // Slow pointer

    steps.push({
        type: 'two-pointer',
        array: [...arr],
        pointers: { 0: 'slow', 1: 'fast' },
        description: "Starting Remove Duplicates. 'slow' tracks unique position, 'fast' explores array."
    });

    for (let j = 1; j < arr.length; j++) {
        steps.push({
            type: 'two-pointer',
            array: [...arr],
            pointers: { [i]: 'slow', [j]: 'fast' },
            status: { [i]: 'comparing', [j]: 'comparing' },
            description: `Compare slow (${arr[i]}) and fast (${arr[j]}).`
        });

        if (arr[j] !== arr[i]) {
            i++;
            arr[i] = arr[j];
            steps.push({
                type: 'two-pointer',
                array: [...arr],
                pointers: { [i]: 'slow', [j]: 'fast' },
                status: { [i]: 'success' },
                description: `New unique element ${arr[j]} found! Move slow and update value.`
            });
        }
    }

    return steps;
};

/**
 * Container With Most Water
 */
export const generateContainerWaterSteps = (array) => {
    const heights = Array.isArray(array) ? array : [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const steps = [];
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;

    while (left < right) {
        const width = right - left;
        const currentHeight = Math.min(heights[left], heights[right]);
        const area = width * currentHeight;
        maxArea = Math.max(maxArea, area);

        steps.push({
            type: 'two-pointer',
            type_special: 'container',
            array: heights,
            left,
            right,
            area,
            condition: {
                area: { label: 'Current Area', value: area, target: null },
                max: { label: 'Max Area', value: maxArea, target: null }
            },
            description: `Width: ${width}, Min Height: ${currentHeight}. Current Area = ${area}.`
        });

        if (heights[left] < heights[right]) {
            steps.push({
                type: 'two-pointer',
                type_special: 'container',
                array: heights,
                left,
                right,
                description: `Left wall (${heights[left]}) is shorter. Moving left pointer to find a potentially taller wall.`
            });
            left++;
        } else {
            steps.push({
                type: 'two-pointer',
                type_special: 'container',
                array: heights,
                left,
                right,
                description: `Right wall (${heights[right]}) is shorter or equal. Moving right pointer inward.`
            });
            right--;
        }
    }

    return steps;
};

/**
 * 3Sum Visualization
 */
export const generate3SumSteps = (array, target = 0) => {
    const arr = [...(Array.isArray(array) ? array.slice(0, 8) : [-1, 0, 1, 2, -1, -4])].sort((a, b) => a - b);
    const steps = [];

    steps.push({
        type: 'two-pointer',
        array: [...arr],
        description: "Sort the array first. For each element, we use two-pointer on the remaining elements."
    });

    for (let i = 0; i < arr.length - 2; i++) {
        if (i > 0 && arr[i] === arr[i - 1]) continue;

        let l = i + 1;
        let r = arr.length - 1;

        steps.push({
            type: 'two-pointer',
            array: [...arr],
            fixed: i,
            left: l,
            right: r,
            description: `Fixing element at index ${i} (${arr[i]}). Looking for pairs that sum to ${-arr[i]}.`
        });

        // Simulating one iteration for brevity in visualization
        break;
    }

    return steps;
};

/**
 * Recursive Factorial Visualization
 */
export const generateFactorialSteps = (n) => {
    const num = Math.min(Math.max(parseInt(n) || 4, 1), 6);
    const steps = [];
    const stack = [];

    const recurse = (current) => {
        const frame = { label: 'factorial', params: current, depth: stack.length, status: 'executing' };
        stack.push(frame);

        steps.push({
            type: 'recursion',
            stack: JSON.parse(JSON.stringify(stack)),
            description: `Calling factorial(${current}).`
        });

        if (current <= 1) {
            frame.status = 'base-case';
            frame.returnValue = 1;
            steps.push({
                type: 'recursion',
                stack: JSON.parse(JSON.stringify(stack)),
                description: `Base case reached: factorial(1) returns 1.`
            });
            stack.pop();
            return 1;
        }

        frame.status = 'executing';
        const result = current * recurse(current - 1);

        frame.status = 'returning';
        frame.returnValue = result;
        steps.push({
            type: 'recursion',
            stack: [...JSON.parse(JSON.stringify(stack)), frame],
            description: `factorial(${current}) returns ${current} * ${result / current} = ${result}.`
        });

        stack.pop();
        return result;
    };

    recurse(num);
    return steps;
};

/**
 * Fibonacci Recursive Steps
 */
export const generateFibonacciRecursiveSteps = (n) => {
    const num = Math.min(Math.max(parseInt(n) || 4, 1), 5);
    const steps = [];
    const stack = [];

    const fib = (current) => {
        const frame = { label: 'fib', params: current, depth: stack.length, status: 'executing' };
        stack.push(frame);

        steps.push({
            type: 'recursion',
            stack: JSON.parse(JSON.stringify(stack)),
            description: `Calling fib(${current}).`
        });

        if (current <= 1) {
            frame.status = 'base-case';
            frame.returnValue = current;
            steps.push({
                type: 'recursion',
                stack: JSON.parse(JSON.stringify(stack)),
                description: `Base case: fib(${current}) returns ${current}.`
            });
            stack.pop();
            return current;
        }

        const res1 = fib(current - 1);
        const res2 = fib(current - 2);
        const result = res1 + res2;

        frame.status = 'returning';
        frame.returnValue = result;
        steps.push({
            type: 'recursion',
            stack: [...JSON.parse(JSON.stringify(stack)), frame],
            description: `fib(${current}) = fib(${current - 1}) + fib(${current - 2}) = ${res1} + ${res2} = ${result}.`
        });
        stack.pop();
        return result;
    };

    fib(num);
    return steps;
};

/**
 * Tower of Hanoi Visualization
 */
export const generateHanoiSteps = (n) => {
    const num = Math.min(Math.max(parseInt(n) || 3, 1), 4);
    const steps = [];
    const rods = [Array.from({ length: num }, (_, i) => num - i), [], []];
    const stack = [];

    const moveDisks = (n, from, to, aux) => {
        const frame = { label: 'hanoi', params: `${n}, '${String.fromCharCode(65 + from)}', '${String.fromCharCode(65 + to)}'`, depth: stack.length, status: 'executing' };
        stack.push(frame);

        steps.push({
            type: 'recursion',
            type_special: 'hanoi',
            stack: JSON.parse(JSON.stringify(stack)),
            rods: JSON.parse(JSON.stringify(rods)),
            description: `Call: Solve Hanoi for ${n} disks from ${String.fromCharCode(65 + from)} to ${String.fromCharCode(65 + to)}.`
        });

        if (n === 1) {
            const disk = rods[from].pop();
            rods[to].push(disk);
            frame.status = 'base-case';
            steps.push({
                type: 'recursion',
                type_special: 'hanoi',
                stack: JSON.parse(JSON.stringify(stack)),
                rods: JSON.parse(JSON.stringify(rods)),
                moveDescription: `Move disk ${disk} from ${String.fromCharCode(65 + from)} to ${String.fromCharCode(65 + to)}`,
                description: `Base case: Move single disk ${disk}.`
            });
            stack.pop();
            return;
        }

        moveDisks(n - 1, from, aux, to);

        const disk = rods[from].pop();
        rods[to].push(disk);
        steps.push({
            type: 'recursion',
            type_special: 'hanoi',
            stack: JSON.parse(JSON.stringify(stack)),
            rods: JSON.parse(JSON.stringify(rods)),
            moveDescription: `Move disk ${disk} from ${String.fromCharCode(65 + from)} to ${String.fromCharCode(65 + to)}`,
            description: `Finished moving ${n - 1} disks to aux. Now moving disk ${disk} to destination.`
        });

        moveDisks(n - 1, aux, to, from);

        frame.status = 'returning';
        stack.pop();
    };

    moveDisks(num, 0, 2, 1);
    return steps;
};


/**
 * Spiral Matrix Visualization
 */
export const generateSpiralMatrixSteps = (m) => {
    const matrix = Array.isArray(m) && m[0] && Array.isArray(m[0]) ? m : [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
    ];
    const steps = [];
    const visited = [];
    const res = [];

    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Right
        for (let i = left; i <= right; i++) {
            visited.push([top, i]);
            res.push([top, i]);
            steps.push({
                type: 'matrix',
                matrix,
                currentRow: top,
                currentCol: i,
                visited: [...visited],
                direction: 'right',
                description: `Moving right across top row ${top}.`
            });
        }
        top++;

        // Down
        if (top <= bottom) {
            for (let i = top; i <= bottom; i++) {
                visited.push([i, right]);
                res.push([i, right]);
                steps.push({
                    type: 'matrix',
                    matrix,
                    currentRow: i,
                    currentCol: right,
                    visited: [...visited],
                    direction: 'down',
                    description: `Moving down rightmost column ${right}.`
                });
            }
            right--;
        }

        // Left
        if (top <= bottom && left <= right) {
            for (let i = right; i >= left; i--) {
                visited.push([bottom, i]);
                res.push([bottom, i]);
                steps.push({
                    type: 'matrix',
                    matrix,
                    currentRow: bottom,
                    currentCol: i,
                    visited: [...visited],
                    direction: 'left',
                    description: `Moving left across bottom row ${bottom}.`
                });
            }
            bottom--;
        }

        // Up
        if (top <= bottom && left <= right) {
            for (let i = bottom; i >= top; i--) {
                visited.push([i, left]);
                res.push([i, left]);
                steps.push({
                    type: 'matrix',
                    matrix,
                    currentRow: i,
                    currentCol: left,
                    visited: [...visited],
                    direction: 'up',
                    description: `Moving up leftmost column ${left}.`
                });
            }
            left++;
        }
    }

    steps.push({
        type: 'matrix',
        matrix,
        visited: [...visited],
        result: [...res],
        description: "Spiral traversal complete!"
    });

    return steps;
};

/**
 * Rotate Matrix 90 Steps
 */
export const generateRotateMatrixSteps = (m) => {
    const matrix = Array.isArray(m) && m[0] && Array.isArray(m[0]) ? m : [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const n = matrix.length;
    let curr = JSON.parse(JSON.stringify(matrix));
    const steps = [];

    steps.push({
        type: 'matrix',
        matrix: JSON.parse(JSON.stringify(curr)),
        description: "Original matrix. Rotating 90 degrees clockwise layer by layer."
    });

    // Layer-by-layer rotation
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        let first = layer;
        let last = n - 1 - layer;
        for (let i = first; i < last; i++) {
            let offset = i - first;
            let top = curr[first][i];

            steps.push({
                type: 'matrix',
                matrix: JSON.parse(JSON.stringify(curr)),
                path: [[first, i], [last - offset, first], [last, last - offset], [i, last]],
                description: `Swapping 4-way elements for layer ${layer}, index ${i}.`
            });

            // left -> top
            curr[first][i] = curr[last - offset][first];
            // bottom -> left
            curr[last - offset][first] = curr[last][last - offset];
            // right -> bottom
            curr[last][last - offset] = curr[i][last];
            // top -> right
            curr[i][last] = top;
        }
    }

    steps.push({
        type: 'matrix',
        matrix: curr,
        description: "Matrix rotation complete!"
    });

    return steps;
};

/**
 * Flood Fill Steps
 */
export const generateFloodFillSteps = (m) => {
    const matrix = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1]
    ];
    const steps = [];
    const visited = [];
    const stack = [[0, 0]];
    const startColor = matrix[0][0];
    const newColor = 2;

    while (stack.length > 0) {
        const [r, c] = stack.pop();
        if (r < 0 || r >= 3 || c < 0 || c >= 3 || matrix[r][c] !== startColor || visited.some(([vr, vc]) => vr === r && vc === c)) continue;

        visited.push([r, c]);
        matrix[r][c] = newColor;

        steps.push({
            type: 'matrix',
            matrix: JSON.parse(JSON.stringify(matrix)),
            currentRow: r,
            currentCol: c,
            visited: [...visited],
            description: `Filling cell (${r}, ${c}) with new color.`
        });

        stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }

    return steps;
};

/**
 * Island Count (DFS)
 */
export const generateIslandCountSteps = (m) => {
    const matrix = [
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1]
    ];
    const steps = [];
    const visited = [];
    let islandCount = 0;

    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
            if (matrix[r][c] === 1 && !visited.some(([vr, vc]) => vr === r && vc === c)) {
                islandCount++;
                // DFS simulation
                const islandCells = [];
                const s = [[r, c]];
                while (s.length > 0) {
                    const [currR, currC] = s.pop();
                    if (currR < 0 || currR >= matrix.length || currC < 0 || currC >= matrix[0].length || matrix[currR][currC] === 0 || visited.some(([vr, vc]) => vr === currR && vc === currC)) continue;

                    visited.push([currR, currC]);
                    islandCells.push([currR, currC]);

                    steps.push({
                        type: 'matrix',
                        matrix,
                        currentRow: currR,
                        currentCol: currC,
                        visited: [...visited],
                        description: `Found island #${islandCount}. Exploring land cell (${currR}, ${currC}).`
                    });

                    s.push([currR + 1, currC], [currR - 1, currC], [currR, currC + 1], [currR, currC - 1]);
                }
            }
        }
    }

    steps.push({
        type: 'matrix',
        matrix,
        visited: [...visited],
        description: `Total islands found: ${islandCount}`
    });

    return steps;
};

export const generateMatrixSearchSteps = (matrix, word) => {
    // Basic DFS placeholder for word search
    return generateSpiralMatrixSteps(matrix);
};

/**
 * Real-World: GPS Route Planning (Simulation)
 */
export const generateGPSSteps = (mapData) => {
    const steps = [];
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Initializing city graph. GPS calculating shortest route between 'Home' and 'Office'.",
        status: 'neutral'
    });
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Evaluating Main St path vs Highway. Main St is currently congested.",
        status: 'evaluating'
    });
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Optimized route found via Highway (12 mins). Map updated.",
        status: 'optimized'
    });
    return steps;
};

/**
 * Real-World: Meeting Scheduler
 */
export const generateSchedulerSteps = (tasks) => {
    const steps = [];
    const initialTasks = [
        { name: 'Interview A', start: 0, duration: 2, status: 'neutral' },
        { name: 'Sync Call', start: 1, duration: 1.5, status: 'neutral' },
        { name: 'Review', start: 4, duration: 2, status: 'neutral' }
    ];

    steps.push({
        type: 'real-world',
        type_special: 'scheduling',
        tasks: initialTasks,
        description: "Analyzing today's schedule. Overlaps detected between 'Interview' and 'Sync Call'."
    });

    const fixedTasks = [
        { name: 'Interview A', start: 0, duration: 2, status: 'optimized' },
        { name: 'Sync Call', start: 2.5, duration: 1.5, status: 'optimized' },
        { name: 'Review', start: 4, duration: 2, status: 'optimized' }
    ];

    steps.push({
        type: 'real-world',
        type_special: 'scheduling',
        tasks: fixedTasks,
        description: "Rescheduling tasks to avoid conflicts. All tasks allocated efficiently."
    });

    return steps;
};

/**
 * Real-World: Resource Allocation
 */
export const generateAllocationSteps = (res) => {
    const steps = [];
    const nodes = [
        { name: 'Server A', load: 10, tasks: 2 },
        { name: 'Server B', load: 95, tasks: 12 },
        { name: 'Server C', load: 45, tasks: 5 },
        { name: 'Server D', load: 80, tasks: 10 }
    ];

    steps.push({
        type: 'real-world',
        type_special: 'allocation',
        resources: nodes,
        description: "Incoming traffic burst! Server B is hitting capacity limit (95%)."
    });

    const optimized = [
        { name: 'Server A', load: 45, tasks: 6 },
        { name: 'Server B', load: 55, tasks: 7 },
        { name: 'Server C', load: 60, tasks: 8 },
        { name: 'Server D', load: 70, tasks: 8 }
    ];

    steps.push({
        type: 'real-world',
        type_special: 'allocation',
        resources: optimized,
        description: "Load balancer redistributed tasks across available nodes. System health: Stable."
    });

    return steps;
};

/**
 * Real-World: Knapsack Packing
 */
export const generateKnapsackPackingSteps = (itemsInput) => {
    const steps = [];
    const items = [
        { name: 'Laptop', value: 1200, weight: 15, selected: false },
        { name: 'Camera', value: 800, weight: 10, selected: false },
        { name: 'Bottle', value: 20, weight: 2, selected: false },
        { name: 'Tent', value: 200, weight: 30, selected: false },
        { name: 'Jacket', value: 150, weight: 5, selected: false }
    ];

    steps.push({
        type: 'real-world',
        type_special: 'packing',
        items: [...items],
        capacity: 40,
        currentWeight: 0,
        description: "Goal: Pack items for maximum value without exceeding 40kg capacity."
    });

    items[0].selected = true;
    steps.push({
        type: 'real-world',
        type_special: 'packing',
        items: [...items],
        capacity: 40,
        currentWeight: 15,
        description: "Selected Laptop ($1200). High value-to-weight ratio."
    });

    items[1].selected = true;
    steps.push({
        type: 'real-world',
        type_special: 'packing',
        items: [...items],
        capacity: 40,
        currentWeight: 25,
        description: "Adding Camera ($800). Capacity usage at 62%."
    });

    items[4].selected = true;
    steps.push({
        type: 'real-world',
        type_special: 'packing',
        items: [...items],
        capacity: 40,
        currentWeight: 30,
        description: "Selected Jacket ($150). Remaining capacity: 10kg."
    });

    return steps;
};

/**
 * Real-World: Network Max Flow
 */
export const generateMaxFlowSteps = (n) => {
    const steps = [];
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Network Analysis: Bottleneck detected at secondary hub. Max capacity constrained to 40 GB/s.",
        status: 'neutral'
    });
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Rerouting flow through redundant nodes. Calculating Ford-Fulkerson augmentation path.",
        status: 'evaluating'
    });
    steps.push({
        type: 'real-world',
        type_special: 'routing',
        description: "Optimized! System now utilizes 98% of available backbone capacity. Flow: 85 GB/s.",
        status: 'optimized'
    });
    return steps;
};

/**
 * Real-World: Job-Candidate Matching
 */
export const generateMatchingSteps = (n) => {
    const steps = [];
    steps.push({
        type: 'real-world',
        type_special: 'matching',
        description: "Recruitment Portal: Initializing Hopcroft-Karp algorithm to pair 50 candidates with 12 job openings.",
        status: 'neutral'
    });
    steps.push({
        type: 'real-world',
        type_special: 'matching',
        description: "Checking skill compatibility and availability constraints. Matching candidate #24 with Senior Dev role.",
        status: 'evaluating'
    });
    steps.push({
        type: 'real-world',
        type_special: 'matching',
        description: "Optimal matching reached. 11/12 roles filled with maximum aggregate skill score.",
        status: 'optimized'
    });
    return steps;
};

// Helper to parse graph input strings (e.g. "0-1, 1-2:5, 2-0")
const parseGraphInput = (inputString, directed = false) => {
    if (!inputString || typeof inputString !== 'string' || inputString.trim() === "") return null;

    const nodesMap = new Map();
    const edges = [];
    const pairs = inputString.split(',').map(s => s.trim());

    pairs.forEach((pair, idx) => {
        // Handle "source-target:weight" or "source-target"
        const [connection, weightStr] = pair.split(':');
        const parts = connection.split('-').map(s => s.trim());
        if (parts.length < 2) return;

        const [u, v] = parts;
        const w = weightStr ? parseInt(weightStr) : 1;

        if (!nodesMap.has(u)) nodesMap.set(u, { id: nodesMap.size, value: u });
        if (!nodesMap.has(v)) nodesMap.set(v, { id: nodesMap.size, value: v });

        edges.push({
            source: nodesMap.get(u).id,
            target: nodesMap.get(v).id,
            weight: w,
            type: directed ? 'directed' : 'undirected',
            status: 'default'
        });
    });

    const nodes = Array.from(nodesMap.values()).map(n => {
        // Auto-position nodes in a circle if no positions provided
        const angle = (n.id / nodesMap.size) * 2 * Math.PI;
        return {
            ...n,
            x: 50 + 35 * Math.cos(angle),
            y: 50 + 35 * Math.sin(angle),
            status: 'default'
        };
    });

    return nodesMap.size > 0 ? { nodes, edges } : null;
};

export const getAlgorithmGenerator = (id) => {
    // Normalize ID
    const key = id.toLowerCase()
        .replace(/['\s/.()]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/[\u2013\u2014]/g, '-');

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
        'rotated-search': { type: 'searching', func: generateLinearSearchSteps },
        'ternary-search': { type: 'searching', func: (arr) => generatePlaceholderSteps(arr, 'Ternary Search') },

        // Array
        'find-max-min': { type: 'array', func: generateFindMaxMinSteps },
        'reverse-array': { type: 'array', func: generateReverseArraySteps },
        'rotate-array': { type: 'array', func: generateRotateArraySteps },
        'two-sum': { type: 'searching', func: generateTwoSumSteps },
        'move-zeros': { type: 'array', func: generateMoveZerosSteps },
        'remove-duplicates': { type: 'array', func: generateMoveZerosSteps },

        // Dynamic Programming
        'fibonacci-dp': { type: 'dp', func: generateFibonacciDPSteps },
        'climbing-stairs': { type: 'dp', func: generateClimbingStairsSteps },
        'coin-change': { type: 'dp', func: generateCoinChangeSteps },
        '0-1-knapsack': { type: 'dp', func: generateKnapsackSteps },
        'lcs': { type: 'dp', func: generateLCSSteps },
        'lis': { type: 'dp', func: generateLISSteps },
        'matrix-chain': { type: 'dp', func: generateMatrixChainSteps },
        'dp-on-trees': { type: 'dp', func: generateDPonTreesSteps },
        'max-subarray': { type: 'array', func: generateMaxSubarraySteps },

        // Backtracking
        'n-queens': { type: 'backtracking', func: generateNQueensSteps },
        'sudoku-solver': { type: 'backtracking', func: generateSudokuSolverSteps },
        'rat-in-a-maze': { type: 'backtracking', func: generateRatInMazeSteps },
        'permutations': { type: 'backtracking', func: generatePermutationsSteps },
        'subsets': { type: 'backtracking', func: generateSubsetsSteps },
        'combinations': { type: 'backtracking', func: generateCombinationsSteps },
        'word-search': { type: 'backtracking', func: generateWordSearchSteps },

        // Graph
        'bfs': { type: 'graph', func: generateBFSSteps },
        'dfs': { type: 'graph', func: generateDFSSteps },
        'topological-sort': { type: 'graph', func: generateTopologicalSortSteps },
        'topo-sort': { type: 'graph', func: generateTopologicalSortSteps },
        'cycle-detection': { type: 'graph', func: generateCycleDetectionSteps },
        'cycle-detect': { type: 'graph', func: generateCycleDetectionSteps },
        'connected-components': { type: 'graph', func: generateConnectedComponentsSteps },
        'connected-comp.': { type: 'graph', func: generateConnectedComponentsSteps },
        'connected-comp': { type: 'graph', func: generateConnectedComponentsSteps },
        'bipartite-check': { type: 'graph', func: generateBipartiteCheckSteps },
        'scc': { type: 'graph', func: generateSCCKosarajuSteps },
        'bfs-path': { type: 'graph', func: generateBFSSteps },
        'dijkstra': { type: 'graph', func: generateDijkstraSteps },
        'dijkstra-s-algorithm': { type: 'graph', func: generateDijkstraSteps },
        'bellman-ford': { type: 'graph', func: generateBellmanFordSteps },
        'floyd-warshall': { type: 'graph', func: generateFloydWarshallSteps },
        'floyd–warshall': { type: 'graph', func: generateFloydWarshallSteps },
        'multi-source': { type: 'graph', func: generateMultiSourceBFSSteps },
        'prim-s-algorithm': { type: 'graph', func: generatePrimSteps },
        'prim-s': { type: 'graph', func: generatePrimSteps },
        'prim-s-algo': { type: 'graph', func: generatePrimSteps },
        'prims-algo': { type: 'graph', func: generatePrimSteps },
        'kruskal-s-algorithm': { type: 'graph', func: generateKruskalSteps },
        'kruskal-s': { type: 'graph', func: generateKruskalSteps },
        'kruskals': { type: 'graph', func: generateKruskalSteps },
        'union-find': { type: 'graph', func: generateKruskalSteps },
        'shortest-path': { type: 'graph', func: generateDijkstraSteps },
        'mst-constraints': { type: 'graph', func: generateKruskalSteps },

        // Greedy
        'activity-selection': { type: 'greedy', func: generateActivitySelectionSteps },
        'coin-change-greedy': { type: 'greedy', func: generateCoinChangeGreedySteps },
        'job-sequencing': { type: 'greedy', func: (arr) => generatePlaceholderSteps(arr, 'Job Sequencing') },
        'huffman-coding': { type: 'greedy', func: (arr) => generatePlaceholderSteps(arr, 'Huffman Coding') },
        'frac-knapsack': { type: 'greedy', func: generateFractionalKnapsackSteps },

        // Tree (Fallbacks)
        'traversals': { type: 'tree', func: generateTreeTraversalSteps },
        'lca': { type: 'tree', func: generateTreeTraversalSteps }, // Reuse for now to show tree
        'diameter': { type: 'tree', func: generateTreeTraversalSteps }, // Reuse for now
        'height': { type: 'tree', func: generateTreeTraversalSteps },
        'max-depth': { type: 'tree', func: generateTreeTraversalSteps },
        'count-nodes': { type: 'tree', func: generateTreeTraversalSteps },
        'min-depth': { type: 'tree', func: generateTreeTraversalSteps },
        'invert-tree': { type: 'tree', func: generateTreeTraversalSteps },
        'symmetric-tree': { type: 'tree', func: generateTreeTraversalSteps },
        'same-tree': { type: 'tree', func: generateTreeTraversalSteps },
        'serialize-deserialize': { type: 'tree', func: generateTreeTraversalSteps },
        'bst-validation': { type: 'tree', func: generateTreeTraversalSteps },
        'tree-to-dll': { type: 'tree', func: generateTreeTraversalSteps },
        'balanced-check': { type: 'tree', func: generateTreeTraversalSteps }, // Map other tree algos too
        'avl-rotations': { type: 'tree', func: generateAVLRotationSteps },

        // Stack/Queue
        'valid-parentheses': { type: 'stack', func: (s) => generateValidParenthesesSteps(s) },
        'next-greater-element': { type: 'stack', func: (arr) => generateNextGreaterElementSteps(arr) },
        'next-greater': { type: 'stack', func: (arr) => generateNextGreaterElementSteps(arr) },
        'min-stack': { type: 'stack', func: (arr) => generateMinStackSteps(arr) },
        'stack-implementation': { type: 'stack', func: (arr) => generateMinStackSteps(arr) },
        'implementation': { type: 'stack', func: (arr) => generateMinStackSteps(arr) },
        'queue-implementation': { type: 'queue', func: (arr) => generateQueueSteps(arr) },
        'circular-queue': { type: 'queue', func: (arr) => generateCircularQueueSteps(arr) },
        'queue-using-stack': { type: 'queue', func: (arr) => generateQueueUsingStacksSteps(arr) },
        'sliding-window-max': { type: 'queue', func: (arr) => generateSlidingWindowMaxSteps(arr, 3) },
        'sliding-window': { type: 'queue', func: (arr) => generateSlidingWindowMaxSteps(arr, 3) },
        'deque-applications': { type: 'queue', func: (arr) => generateCircularQueueSteps(arr) }, // Placeholder
        'deque-apps': { type: 'queue', func: (arr) => generateCircularQueueSteps(arr) },

        // Heap
        'k-largest-smallest': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'max') },
        'heap-sort-algo': { type: 'heap', func: (arr) => generateHeapSortSteps(arr) },
        'median-stream': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'min') },
        'merge-k-lists': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'min') },
        'top-k-frequent': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'max') },
        'max-heap-implementation': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'max') },
        'min-heap-implementation': { type: 'heap', func: (arr) => generateHeapSteps(arr, 'min') },

        // Linked List
        'reverse-ll': { type: 'linked-list', func: (arr) => generateReverseLLSteps(arr) },
        'reverse-linked-list': { type: 'linked-list', func: (arr) => generateReverseLLSteps(arr) },
        'detect-loop': { type: 'linked-list', func: (arr) => generateDetectLoopSteps(arr) },
        'find-middle': { type: 'linked-list', func: (arr) => generateMiddleLLSteps(arr) },
        'detect-loop-floyd-s': { type: 'linked-list', func: (arr) => generateDetectLoopSteps(arr) },
        'middle-of-linked-list': { type: 'linked-list', func: (arr) => generateMiddleLLSteps(arr) },
        'merge-two': { type: 'linked-list', func: (arr) => generateMergeTwoLLSteps(arr) },
        'merge-sorted-lists': { type: 'linked-list', func: (arr) => generateMergeTwoLLSteps(arr) },
        'intersection': { type: 'linked-list', func: (arr) => generateIntersectionLLSteps(arr) },
        'remove-n-th-node': { type: 'linked-list', func: (arr) => generateRemoveNthLLSteps(arr) },
        'delete-node': { type: 'linked-list', func: (arr) => generateRemoveNthLLSteps(arr) },
        'lru-cache': { type: 'linked-list', func: (arr) => generateReverseLLSteps(arr) }, // Placeholder for now
        'clone-list': { type: 'linked-list', func: (arr) => generateReverseLLSteps(arr) }, // Placeholder for now

        // Sliding Window
        'max-sum-subarray-of-size-k': { type: 'sliding-window', func: (arr) => generateMaxSumSubarraySteps(arr, 3) },
        'max-sum-sub-': { type: 'sliding-window', func: (arr) => generateMaxSumSubarraySteps(arr, 3) },
        'longest-substring-without-repeating-characters': { type: 'sliding-window', func: (s) => generateLongestSubstringSteps(s) },
        'longest-substr': { type: 'sliding-window', func: (s) => generateLongestSubstringSteps(s) },
        'minimum-window-substring': { type: 'sliding-window', func: (s, t) => generateMinWindowSubstringSteps(s, t) },
        'min-window': { type: 'sliding-window', func: (s, t) => generateMinWindowSubstringSteps(s, t) },

        // Math
        'prime-check': { type: 'math', func: (n) => generatePrimeCheckSteps(n) },
        'prime-number-check': { type: 'math', func: (n) => generatePrimeCheckSteps(n) },
        'sieve-of-eratosthenes': { type: 'math', func: (n) => generateSieveSteps(n) },
        'sieve': { type: 'math', func: (n) => generateSieveSteps(n) },
        'gcd': { type: 'math', func: (a, b) => generateGCDSteps(a, b) },
        'gcd---lcm': { type: 'math', func: (a, b) => generateGCDSteps(a, b) },
        'lcm': {
            type: 'math', func: (a, b) => {
                const steps = generateGCDSteps(a, b);
                if (!steps || steps.length === 0) return steps;
                const lastStep = steps[steps.length - 1];
                if (!lastStep.primaryValues || lastStep.primaryValues.length === 0) return steps;

                const gcd = lastStep.primaryValues[0].value || 1;
                const numA = Math.abs(parseInt(a)) || 48;
                const numB = Math.abs(parseInt(b)) || 18;
                const res = (numA * numB) / gcd;

                steps.push({
                    type: 'math',
                    primaryValues: [{ value: numA, label: 'a' }, { value: numB, label: 'b' }],
                    calculations: [`LCM = (a * b) / GCD`, `LCM = (${numA} * ${numB}) / ${gcd} = ${res}`],
                    result: `LCM = ${res}`,
                    description: `Using the formula LCM(a, b) = (a * b) / GCD(a, b).`
                });
                return steps;
            }
        },
        'modular-exponentiation': { type: 'math', func: (b, e) => generateModExpSteps(b, e, 1000) },
        'modular-exp-': { type: 'math', func: (b, e) => generateModExpSteps(b, e, 1000) },
        'modular-exponentiation-': { type: 'math', func: (b, e) => generateModExpSteps(b, e, 1000) },

        // String
        'reverse-string': { type: 'string', func: generateReverseStringSteps },
        'palindrome': { type: 'string', func: generatePalindromeSteps },
        'palindrome-check': { type: 'string', func: generatePalindromeSteps },
        'anagram': { type: 'string', func: (s1, s2) => generateAnagramSteps(s1, s2) },
        'anagram-check': { type: 'string', func: (s1, s2) => generateAnagramSteps(s1, s2) },
        'z-algorithm': { type: 'string', func: (text, pat) => generateNaiveSearchSteps(text, pat) },
        'longest-palin': { type: 'string', func: generatePalindromeSteps },
        'longest-palindromic-substring': { type: 'string', func: generatePalindromeSteps },
        'naive-search': { type: 'string', func: (text, pattern) => generateNaiveSearchSteps(text, pattern) },
        'kmp-search': { type: 'string', func: (text, pattern) => generateKMPSteps(text, pattern) },
        'kmp-algo': { type: 'string', func: (text, pattern) => generateKMPSteps(text, pattern) },
        'rabin-karp': { type: 'string', func: (text, pattern) => generateRabinKarpSteps(text, pattern) },

        // Bit Manipulation
        'count-set-bits': { type: 'bit', func: (n) => generateCountSetBitsSteps(n) },
        'power-of-two': { type: 'bit', func: (n) => generatePowerOfTwoSteps(n) },
        'bitwise-and': { type: 'bit', func: (a, b) => generateBitwiseSteps(a, b, 'and') },
        'bitwise-or': { type: 'bit', func: (a, b) => generateBitwiseSteps(a, b, 'or') },
        'bitwise-xor': { type: 'bit', func: (a, b) => generateBitwiseSteps(a, b, 'xor') },
        'bitwise-not': { type: 'bit', func: (n) => generateBitwiseNotSteps(n) },
        'left-shift': { type: 'bit', func: (n, s) => generateShiftSteps(n, s, 'left') },
        'right-shift': { type: 'bit', func: (n, s) => generateShiftSteps(n, s, 'right') },
        'single-number': { type: 'bit', func: (arr) => generateSingleNumberSteps(arr) },
        'bit-masking': { type: 'bit', func: (n) => generateCountSetBitsSteps(n) }, // Fallback for now
        'bitwise-ops': { type: 'bit', func: (a, b) => generateBitwiseSteps(a, b, 'and') },

        // Two Pointer
        'pair-sum-sorted': { type: 'two-pointer', func: (arr) => generateTwoSumSortedSteps(arr, 15) },
        'two-sum-sorted': { type: 'two-pointer', func: (arr) => generateTwoSumSortedSteps(arr, 15) },
        'remove-duplicates-from-sorted-array': { type: 'two-pointer', func: (arr) => generateRemoveDuplicatesSteps(arr) },
        'container-with-most-water': { type: 'two-pointer', func: (arr) => generateContainerWaterSteps(arr) },
        'reverse-array-two-pointer': { type: 'two-pointer', func: (arr) => generateReverseArraySteps(arr) },
        'sum-3sum': { type: 'two-pointer', func: (arr) => generate3SumSteps(arr, 0) },

        // Recursion
        'factorial': { type: 'recursion', func: (n) => generateFactorialSteps(n) },
        'fibonacci-recursive': { type: 'recursion', func: (n) => generateFibonacciRecursiveSteps(n) },
        'tower-of-hanoi': { type: 'recursion', func: (n) => generateHanoiSteps(n) },
        'recursive-power': { type: 'recursion', func: (n) => generateFactorialSteps(n) }, // Placeholder
        'subsets-recursive': { type: 'recursion', func: (n) => generateFactorialSteps(n) },

        // Matrix
        'spiral-matrix': { type: 'matrix', func: (arr) => generateSpiralMatrixSteps(arr) },
        'rotate-matrix': { type: 'matrix', func: (arr) => generateRotateMatrixSteps(arr) },
        'flood-fill': { type: 'matrix', func: (arr) => generateFloodFillSteps(arr) },
        'island-count': { type: 'matrix', func: (arr) => generateIslandCountSteps(arr) },
        'word-search-matrix': { type: 'matrix', func: (arr) => generateMatrixSearchSteps(arr, "ALGO") },

        // Real-World System Simulations
        'gps-route-planning': { type: 'real-world', func: (arr) => generateGPSSteps(arr) },
        'meeting-scheduler': { type: 'real-world', func: (arr) => generateSchedulerSteps(arr) },
        'resource-allocation': { type: 'real-world', func: (arr) => generateAllocationSteps(arr) },
        'network-max-flow': { type: 'real-world', func: (arr) => generateMaxFlowSteps(arr) },
        'knapsack-packing': { type: 'real-world', func: (arr) => generateKnapsackPackingSteps(arr) },
        'job-candidate-matching': { type: 'real-world', func: (arr) => generateMatchingSteps(arr) },

        // Generic Fallback
        'default': { type: 'sorting', func: generateBubbleSortSteps }
    };

    // Dynamic fallback for any unmapped key
    if (!map[key]) {
        return { type: 'unknown', func: (arr) => generatePlaceholderSteps(arr, key) };
    }

    return map[key];
};
