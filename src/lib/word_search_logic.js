// --- Word Search Logic ---
// We need to implement this one too.
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
