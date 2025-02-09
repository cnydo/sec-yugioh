// State Management
let xyzSelections = new Set();
let fusionSelections = new Set();
let selectedTargets = new Set();

// Initialization
function initializeApp() {
    createButtons();
    createGrid();
    setupEventListeners();
}

// Button Creation
function createButtons() {
    createButtonGroup('xyzRanks', 12, 'xyz');
    createButtonGroup('fusionLevels', 12, 'fusion');
}

function createButtonGroup(containerId, count, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = i;
        btn.addEventListener('click', (e) => toggleSelection(i, type, e));
        container.appendChild(btn);
    }
}

// Selection Handling
function toggleSelection(value, type, event) {
    const set = type === 'xyz' ? xyzSelections : fusionSelections;
    const btn = event.target;
    
    set.has(value) ? set.delete(value) : set.add(value);
    btn.classList.toggle(`${type}-selected`, set.has(value));
    updateCombinations();
}

// Grid Management
function createGrid() {
    const tbody = document.querySelector('#mainGrid tbody');
    tbody.innerHTML = '';
    
    for (let target = 2; target <= 12; target++) {
        const row = document.createElement('tr');
        
        // Target Cell
        const targetCell = document.createElement('td');
        targetCell.className = 'target-cell';
        targetCell.textContent = target;
        targetCell.dataset.target = target;
        row.appendChild(targetCell);
        
        // Combos Cell
        const combosCell = document.createElement('td');
        combosCell.className = 'combos-cell';
        row.appendChild(combosCell);
        
        tbody.appendChild(row);
    }
    updateCombinations();
}

function handleGridClick(event) {
    const targetCell = event.target.closest('.target-cell');
    if (targetCell) {
        const target = parseInt(targetCell.dataset.target);
        selectedTargets.has(target) ? 
            selectedTargets.delete(target) : 
            selectedTargets.add(target);
        targetCell.classList.toggle('selected', selectedTargets.has(target));
        updateCombinations();
    }
}

// Combination Updates
function updateCombinations() {
    document.querySelectorAll('.combos-cell').forEach(cell => {
        cell.innerHTML = '';
        const target = parseInt(cell.previousElementSibling.dataset.target);
        
        for (let x = 1; x < target; x++) {
            const f = target - x;
            if (f < 1 || f > 12) continue;
            
            const comboGroup = createComboGroup(x, f, target);
            cell.appendChild(comboGroup);
        }
    });
    
    updateDeckCounter();
    toggleBlurEffect();
}

function createComboGroup(x, f, target) {
    const comboGroup = document.createElement('div');
    comboGroup.className = 'combo-group';
    
    const isAvailable = xyzSelections.has(x) && fusionSelections.has(f);
    const isHighlighted = selectedTargets.has(target);
    
    comboGroup.classList.toggle('available', isAvailable);
    comboGroup.classList.toggle('target-highlight', isHighlighted);
    
    // Create parts
    const total = (2 * x) + f;
    const parts = [
        { value: total, type: 'total' },
        { value: x, type: 'xyz' },
        { value: f, type: 'fusion' }
    ];
    
    parts.forEach(({ value, type }) => {
        const part = document.createElement('span');
        part.className = `combo-part ${type}-part`;
        part.textContent = value;
        comboGroup.appendChild(part);
    });
    
    return comboGroup;
}

// UI Updates
function updateDeckCounter() {
    const edCount = xyzSelections.size * 2 + fusionSelections.size;
    document.getElementById('edCount').textContent = edCount;
    document.getElementById('warning').textContent = 
        edCount > 15 ? 'Extra Deck limit exceeded!' : '';
}

function toggleBlurEffect() {
    const hasSelections = xyzSelections.size > 0 || fusionSelections.size > 0;
    document.querySelector('.grid').classList.toggle('has-selections', hasSelections);
}

// Event Listeners
function setupEventListeners() {
    // Grid click handler
    document.querySelector('#mainGrid tbody').addEventListener('click', handleGridClick);
    
    // Math section toggle
    document.querySelector('.math-header').addEventListener('click', function() {
        this.closest('.math-section').classList.toggle('open');
    });
}

// Initialize app when ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Add math section toggle
    const mathHeader = document.querySelector('.math-header');
    if (mathHeader) {
        mathHeader.addEventListener('click', function() {
            const section = this.closest('.math-section');
            section.classList.toggle('open');
            
            // Reprocess MathJax when opening
            if (section.classList.contains('open') && window.MathJax) {
                MathJax.typesetPromise([section]);
            }
        });
    }
});