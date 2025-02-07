let xyzSelections = new Set();
let fusionSelections = new Set();
let selectedTargets = new Set();

function initializeApp() {
    createButtons();
    createGrid();
    document.querySelector('#mainGrid tbody').addEventListener('click', handleGridClick);
}

function createButtons() {
    createButtonGroup('xyzRanks', 12, 'xyz');
    createButtonGroup('fusionLevels', 12, 'fusion');
}

function createButtonGroup(containerId, count, type) {
    const container = document.getElementById(containerId);
    for (let i = 1; i <= count; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = i;
        btn.addEventListener('click', (e) => toggleSelection(i, type, e));
        container.appendChild(btn);
    }
}

function toggleSelection(value, type, event) {
    const set = type === 'xyz' ? xyzSelections : fusionSelections;
    const btn = event.target;
    
    set.has(value) ? set.delete(value) : set.add(value);
    btn.classList.toggle(`${type}-selected`, set.has(value));
    updateCombinations();
}

function createGrid() {
    const tbody = document.querySelector('#mainGrid tbody');
    tbody.innerHTML = '';
    
    for (let target = 2; target <= 12; target++) {
        const row = document.createElement('tr');
        
        const targetCell = document.createElement('td');
        targetCell.className = 'target-cell';
        targetCell.textContent = target;
        targetCell.dataset.target = target;
        row.appendChild(targetCell);
        
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
        selectedTargets.has(target) ? selectedTargets.delete(target) : selectedTargets.add(target);
        targetCell.classList.toggle('selected', selectedTargets.has(target));
        updateCombinations();
    }
}

function updateCombinations() {
    document.querySelectorAll('.combos-cell').forEach(cell => {
        cell.innerHTML = '';
        const target = parseInt(cell.previousElementSibling.dataset.target);
        
        for (let x = 1; x < target; x++) {
            const f = target - x;
            if (f < 1 || f > 12) continue;
            
            const comboGroup = document.createElement('div');
            comboGroup.className = 'combo-group';
            
            const isAvailable = xyzSelections.has(x) && fusionSelections.has(f);
            const isHighlighted = selectedTargets.has(target);
            
            comboGroup.classList.toggle('available', isAvailable);
            comboGroup.classList.toggle('target-highlight', isHighlighted);
            
            [ (2 * x) + f, x, f ].forEach((value, index) => {
                const part = document.createElement('span');
                part.className = `combo-part ${['total', 'xyz', 'fusion'][index]}-part`;
                part.textContent = value;
                comboGroup.appendChild(part);
            });
            
            cell.appendChild(comboGroup);
        }
    });
    
    document.getElementById('edCount').textContent = xyzSelections.size * 2 + fusionSelections.size;
    document.getElementById('warning').textContent = 
        xyzSelections.size * 2 + fusionSelections.size > 15 ? 'Extra Deck limit exceeded!' : '';
}

document.addEventListener('DOMContentLoaded', initializeApp);