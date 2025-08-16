const input = document.getElementById('input-box');
const addbtn = document.getElementById('button');
const main = document.getElementById('container');
const label = document.createElement('label');
const topBar = document.querySelector('.top-bar');

let deleButton = null;
let searchbar = null;

addbtn.addEventListener('click', function () {
    if (input.files.length === 0) {
        alert("Please select a file.");
    } else if (document.querySelector('.table')) {
        alert("There is already a table.");
    } else {
        const file = input.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function (e) {
            if (!searchbar) {
                searchbar = document.createElement('input');
                searchbar.id = 'search';
                searchbar.setAttribute('placeholder', 'search');
                label.innerText = 'search  ';
                label.setAttribute('for', 'search');
                main.appendChild(label);
            }

            searchbar.addEventListener('input', function () {
                const val = searchbar.value.toLowerCase();
                const table = document.querySelector('.table');
                const rows = table.querySelectorAll('tr');

                rows.forEach((row, index) => {
                    if (index === 0) return;
                    const rowText = row.textContent.toLowerCase();
                    row.style.display = rowText.includes(val) ? '' : 'none';
                });
            });

            main.appendChild(searchbar);

            const contents = e.target.result;
            const rows = contents.trim().split("\n");

            const div = document.createElement('div');
            div.classList.add('table-container');
            main.appendChild(div);

            const table = document.createElement('table');
            table.classList.add('table');
            div.appendChild(table);

            if (!deleButton) {
                deleButton = document.createElement('button');
                deleButton.textContent = 'Delete Table';
                deleButton.classList.add('dele');
                deleButton.addEventListener('click', function () {
                    const analyseBoxes = document.querySelectorAll('.analyse-box');
                    analyseBoxes.forEach(box => box.remove());
                    
                    // Remove analysis summary if it exists
                    const analysisSummary = document.querySelector('.analysis-summary');
                    if (analysisSummary) {
                        analysisSummary.remove();
                    }
                    
                    div.remove();
                    deleButton.remove();
                    deleButton = null;
                    searchbar.remove();
                    searchbar = null;
                    label.remove();
                });

                topBar.appendChild(deleButton);
            }

            for (let i = 0; i < rows.length; i++) {
                const columns = rows[i].split(",");
                const tr = document.createElement('tr');

                for (let j = 0; j < columns.length; j++) {
                    const cell = document.createElement(i === 0 ? 'th' : 'td');
                    cell.textContent = columns[j].trim();
                    tr.appendChild(cell);
                }

                table.appendChild(tr);
            }
        };
    }
});

const analyse = document.createElement('button');
analyse.id = 'analyse-btn';
analyse.textContent = 'Analyse';
topBar.appendChild(analyse);

analyse.addEventListener('click', function () {
    let failCount = 0;
    let studentCount = 0;
    let passCount = 0;

    if (input.files.length === 0) {
        alert("Please select a file.");
    } else {
        const analyse_box = document.createElement('div');
        analyse_box.classList = 'analyse-box';
        analyse.appendChild(analyse_box);

        const table = document.querySelector('.table');
        const rows = table.querySelectorAll('tr');

        rows.forEach((row, index) => {
            // Skip the header row (first row with th elements)
            if (index === 0) return;

            // Count only rows that have td elements (data rows)
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                studentCount++;

                for (let i = 1; i < cells.length; i++) {
                    if (cells[i].textContent.trim().toLowerCase() === 'f' || cells[i].textContent.trim().toLowerCase() === 'ab') {
                        failCount++;
                        row.style.backgroundColor = '#ffcccc';
                        break;
                    }
                }
            }
        });

        passCount = studentCount - failCount;

        const analyse_table_btn = document.createElement('button');
        
        analyse_table_btn.textContent = 'Analyse table';
        analyse_table_btn.id = 'analyse-table-btn';
        analyse_box.appendChild(analyse_table_btn);

        const analyse_btn = document.createElement('button');
        analyse_btn.textContent = 'Analyse';
        analyse_btn.id = 'analyse-btn-secondary';
        analyse_box.appendChild(analyse_btn);

        const sort_btn = document.createElement('button');
        sort_btn.textContent = 'Sort';
        sort_btn.id = 'sort-btn';
        analyse_box.appendChild(sort_btn);

        analyse_table_btn.addEventListener('click', function () {
            const tableContainer = document.querySelector('.table-container');
            const analyseTable = document.createElement('table');
            analyseTable.classList.add('table');
            analyseTable.id = 'analyse-table';
            tableContainer.appendChild(analyseTable);
            
            // Create header row with specified headings
            const headerRow = document.createElement('tr');
            const headings = ['index', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'P', 'F', 'AB'];
            
            headings.forEach(heading => {
                const th = document.createElement('th');
                th.textContent = heading;
                headerRow.appendChild(th);
            });
            
            analyseTable.appendChild(headerRow);
            
            // Get the original table's header row (th elements from index 1 to 8)
            const originalTable = document.querySelector('.table');
            const originalHeaderRow = originalTable.querySelector('tr');
            const originalHeaders = originalHeaderRow.querySelectorAll('th');
            
            // Create data rows using original table headers (index 1-8)
            for (let i = 1; i <= 8; i++) {
                const dataRow = document.createElement('tr');
                
                // First cell is the header value from original table (index 1-8)
                const indexCell = document.createElement('td');
                if (originalHeaders[i]) {
                    indexCell.textContent = originalHeaders[i].textContent;
                }
                dataRow.appendChild(indexCell);
                
                // Initialize grade count variables
                let countS = 0, countAplus = 0, countA = 0, countBplus = 0, countB = 0, countCplus = 0;
                let countC = 0, countDplus = 0, countD = 0, countP = 0, countF = 0, countAB = 0;
                
                // Traverse through each row of the original table for this column (index i)
                const originalRows = originalTable.querySelectorAll('tr');
                originalRows.forEach((row, rowIndex) => {
                    // Skip header row
                    if (rowIndex === 0) return;
                    
                    const cells = row.querySelectorAll('td');
                    if (cells[i]) {
                        const grade = cells[i].textContent.trim().toUpperCase();
                        
                        // Count occurrences of each grade
                        switch(grade) {
                            case 'S': countS++; break;
                            case 'A+': countAplus++; break;
                            case 'A': countA++; break;
                            case 'B+': countBplus++; break;
                            case 'B': countB++; break;
                            case 'C+': countCplus++; break;
                            case 'C': countC++; break;
                            case 'D+': countDplus++; break;
                            case 'D': countD++; break;
                            case 'P': countP++; break;
                            case 'F': countF++; break;
                            case 'AB': countAB++; break;
                        }
                    }
                });
                
                // Create cells for each grade with the counted values
                const gradeCounts = [countS, countAplus, countA, countBplus, countB, countCplus, countC, countDplus, countD, countP, countF, countAB];
                
                gradeCounts.forEach(count => {
                    const cell = document.createElement('td');
                    cell.textContent = count;
                    dataRow.appendChild(cell);
                });
                
                analyseTable.appendChild(dataRow);
            }
        });

        analyse_btn.addEventListener('click', function () {
            // Remove existing analysis summary if any
            const existingSummary = document.querySelector('.analysis-summary');
            if (existingSummary) {
                existingSummary.remove();
            }

            // Create analysis summary div
            const analysisSummary = document.createElement('div');
            analysisSummary.classList.add('analysis-summary');
            
            // Create summary content
            const summaryContent = `
                <div class="summary-item">
                    <span class="summary-label">Total Students:</span>
                    <span class="summary-value">${studentCount}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Failed:</span>
                    <span class="summary-value failed">${failCount}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Passed:</span>
                    <span class="summary-value passed">${passCount}</span>
                </div>
            `;
            
            analysisSummary.innerHTML = summaryContent;
            
            topBar.insertBefore(analysisSummary, analyse.nextSibling);
        });

        sort_btn.addEventListener('click', function () {
            // Remove existing GPA box if any
            const existingGpaBox = document.querySelector('.gpa-box');
            if (existingGpaBox) {
                existingGpaBox.remove();
            }

            // Create GPA box div
            const gpaBox = document.createElement('div');
            gpaBox.classList.add('gpa-box');
            
            // Create SGPA button
            const sgpaBtn = document.createElement('button');
            sgpaBtn.textContent = 'SGPA';
            sgpaBtn.id = 'sgpa-btn';
            sgpaBtn.classList.add('gpa-btn');
            
            // Create CGPA button
            const cgpaBtn = document.createElement('button');
            cgpaBtn.textContent = 'CGPA';
            cgpaBtn.id = 'cgpa-btn';
            cgpaBtn.classList.add('gpa-btn');
            
            // Add buttons to the box
            gpaBox.appendChild(sgpaBtn);
            gpaBox.appendChild(cgpaBtn);
            
            // Position the box near the sort button
            analyse_box.appendChild(gpaBox);
            
            // SGPA button click functionality
            sgpaBtn.addEventListener('click', function () {
                console.log('SGPA button clicked');
                
                // Get the original table
                const originalTable = document.querySelector('.table');
                const rows = Array.from(originalTable.querySelectorAll('tr'));
                
                // Skip the header row (first row)
                const headerRow = rows[0];
                const dataRows = rows.slice(1);
                
                // Sort data rows based on second-to-last column value
                dataRows.sort((rowA, rowB) => {
                    const cellsA = rowA.querySelectorAll('td');
                    const cellsB = rowB.querySelectorAll('td');
                    
                    // Get second-to-last column values
                    const valueA = parseFloat(cellsA[cellsA.length - 2].textContent.trim()) || 0;
                    const valueB = parseFloat(cellsB[cellsB.length - 2].textContent.trim()) || 0;
                    
                    // Sort in descending order
                    return valueB - valueA;
                });
                
                // Clear the table (except header)
                dataRows.forEach(row => row.remove());
                
                // Re-append sorted rows
                dataRows.forEach(row => originalTable.appendChild(row));
                
                console.log('Table sorted by second-to-last column in descending order');
            });
            
            // CGPA button click functionality
            cgpaBtn.addEventListener('click', function () {
                console.log('CGPA button clicked');
                
                // Get the original table
                const originalTable = document.querySelector('.table');
                const rows = Array.from(originalTable.querySelectorAll('tr'));
                
                // Skip the header row (first row)
                const headerRow = rows[0];
                const dataRows = rows.slice(1);
                
                // Sort data rows based on last column value
                dataRows.sort((rowA, rowB) => {
                    const cellsA = rowA.querySelectorAll('td');
                    const cellsB = rowB.querySelectorAll('td');
                    
                    // Get last column values
                    const valueA = parseFloat(cellsA[cellsA.length - 1].textContent.trim()) || 0;
                    const valueB = parseFloat(cellsB[cellsB.length - 1].textContent.trim()) || 0;
                    
                    // Sort in descending order
                    return valueB - valueA;
                });
                
                // Clear the table (except header)
                dataRows.forEach(row => row.remove());
                
                // Re-append sorted rows
                dataRows.forEach(row => originalTable.appendChild(row));
                
                console.log('Table sorted by last column in descending order');
            });
        });
    }
});
