let xyzSelections = new Set();
let fusionSelections = new Set();

function initializeApp() {
    createButtons();
    updateGrid();
}

function createButtons() {
    // Create XYZ buttons
    const xyzContainer = document.getElementById('xyzRanks');
    for (let i = 1; i <= 12; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = i;
        btn.addEventListener('click', (event) => toggleSelection(i, 'xyz', event));
        xyzContainer.appendChild(btn);
    }

    // Create Fusion buttons
    const fusionContainer = document.getElementById('fusionLevels');
    for (let i = 1; i <= 12; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = i;
        btn.addEventListener('click', (event) => toggleSelection(i, 'fusion', event));
        fusionContainer.appendChild(btn);
    }
}

function toggleSelection(value, type, event) {
    const set = type === 'xyz' ? xyzSelections : fusionSelections;
    const btn = event.target;
    
    if (set.has(value)) {
        set.delete(value);
        btn.classList.remove(type === 'xyz' ? 'xyz-selected' : 'fusion-selected');
    } else {
        set.add(value);
        btn.classList.add(type === 'xyz' ? 'xyz-selected' : 'fusion-selected');
    }
    updateGrid();
}

function updateGrid() {
    // Update counter and warnings
    const edCount = xyzSelections.size * 2 + fusionSelections.size;
    document.getElementById('edCount').textContent = edCount;
    document.getElementById('warning').textContent = 
        edCount > 15 ? 'Extra Deck limit exceeded!' : '';

    // Generate grid
    const tbody = document.querySelector('#mainGrid tbody');
    tbody.innerHTML = '';
    
    for (let target = 2; target <= 12; target++) {
        const row = document.createElement('tr');
        
        // Target cell
        const targetCell = document.createElement('td');
        targetCell.textContent = target;
        targetCell.className = 'target-cell';
        row.appendChild(targetCell);
        
        // Combinations cell
        const combosCell = document.createElement('td');
        const combinations = [];
        
        for (let x = 1; x < target; x++) {
            const f = target - x;
            if (f < 1 || f > 12) continue;
            
            const total = (2 * x) + f;
            const comboGroup = document.createElement('div');
            comboGroup.className = 'combo-group';
            comboGroup.style.display = 'inline-flex';
          
            // Total part
            const totalPart = document.createElement('span');
            totalPart.className = 'combo-part total-part';
            totalPart.textContent = total;
            
            // XYZ part
            const xyzPart = document.createElement('span');
            xyzPart.className = 'combo-part xyz-part';
            xyzPart.textContent = x;
            
            // Fusion part
            const fusionPart = document.createElement('span');
            fusionPart.className = 'combo-part fusion-part';
            fusionPart.textContent = f;
            
            comboGroup.appendChild(totalPart);
            comboGroup.appendChild(xyzPart);
            comboGroup.appendChild(fusionPart);
            
            if (xyzSelections.has(x) && fusionSelections.has(f)) {
                comboGroup.classList.add('available');
            }
            
            combosCell.appendChild(comboGroup);
        }
        row.appendChild(combosCell);
        tbody.appendChild(row);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);