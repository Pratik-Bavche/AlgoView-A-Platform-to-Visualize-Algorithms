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
