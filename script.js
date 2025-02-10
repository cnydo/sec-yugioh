let xyzSelections = new Set();
let fusionSelections = new Set();
let selectedTargets = new Set();

function initializeApp() {
    createButtons();
    createNewGrid();
    document.querySelector('#mainGrid tbody').addEventListener('click', handleGridClick);
}

function createButtons() {
    createButtonGroup('xyzRanks', 11, 'xyz');
    createButtonGroup('fusionLevels', 11, 'fusion');
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

function createNewGrid() {
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
        
        // Update legend target color box
        const legendTargetBox = document.querySelector('.legend .color-box.target-part');
        legendTargetBox.classList.toggle('glowing', selectedTargets.size > 0);
        
        updateCombinations();
    }
}

function updateCombinations() {
    document.querySelectorAll('.combos-cell').forEach(cell => {
        cell.innerHTML = '';
        const target = parseInt(cell.previousElementSibling.dataset.target);
        
        for (let x = 1; x < target; x++) {
            const f = target - x;
            if (f < 1 || f > 11) continue;
            
            const comboGroup = document.createElement('div');
            comboGroup.className = 'combo-group';
            
            const isXyzMatch = xyzSelections.has(x);
            const isFusionMatch = fusionSelections.has(f);
            const isHighlighted = selectedTargets.has(target);
            
            // Add individual highlight classes
            if (isXyzMatch) comboGroup.classList.add('xyz-highlight');
            if (isFusionMatch) comboGroup.classList.add('fusion-highlight');
            if (isHighlighted) comboGroup.classList.add('target-highlight');
            
            comboGroup.classList.toggle('fade', 
                (xyzSelections.size > 0 && !isXyzMatch) || 
                (fusionSelections.size > 0 && !isFusionMatch) || 
                (selectedTargets.size > 0 && !isHighlighted)
            );
            
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

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Force reflow
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function initializeClipboard() {
    document.querySelectorAll('[data-clipboard]').forEach(button => {
        button.addEventListener('click', () => {
            const text = button.getAttribute('data-clipboard');
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('Copied to clipboard!');
                })
                .catch(() => {
                    showToast('Failed to copy');
                });
        });
    });
}

function initializeCollapsibles() {
    const coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.textContent = this.textContent.replace('▴', '▾');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.textContent = this.textContent.replace('▾', '▴');
                
                // Force MathJax to reprocess when math section is opened
                if (content.classList.contains('math-content')) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, content]);
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeClipboard();
    initializeCollapsibles();
});