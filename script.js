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
                    // Remove GPA boxes if they exist
                    const gpaBoxes = document.querySelectorAll('.gpa-box');
                    gpaBoxes.forEach(box => box.remove());
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
        // Check if analyse box already exists
        const existingAnalyseBox = document.querySelector('.analyse-box');
        if (existingAnalyseBox) {
            alert("Analyse box already exists");
            return;
        }
        
        const analyse_box = document.createElement('div');
        analyse_box.classList = 'analyse-box';
        topBar.appendChild(analyse_box);

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
            // Check if analysis table already exists
            const existingAnalysisTable = document.querySelector('#analyse-table');
            if (existingAnalysisTable) {
                alert("Analyse table already exists");
                return;
            }

            // Add Analyse Graph button
            const analyse_graph_btn = document.createElement('button');
            analyse_graph_btn.textContent = 'Analyse Graph';
            analyse_graph_btn.id = 'analyse-graph-btn';
            analyse_box.appendChild(analyse_graph_btn);

            analyse_graph_btn.addEventListener('click', function () {
                // Remove existing graph if any
                const existingGraph = document.getElementById('analyse-graph-canvas');
                if (existingGraph) {
                    existingGraph.parentNode.removeChild(existingGraph);
                }

                // Get subject names from main table header (th index 1-8)
                const mainTable = document.querySelector('.table');
                if (!mainTable) {
                    alert('Main table not found.');
                    return;
                }
                const ths = mainTable.querySelectorAll('tr th');
                const subjects = [];
                for (let i = 1; i <= 8; i++) {
                    if (ths[i]) subjects.push(ths[i].textContent.trim());
                }

                // Get pass/fail counts from analyse table
                const analyseTable = document.getElementById('analyse-table');
                if (!analyseTable) {
                    alert('Please generate the analyse table first.');
                    return;
                }
                const rows = analyseTable.querySelectorAll('tr');
                const passCounts = [];
                const failCounts = [];
                for (let i = 1; i <= 8; i++) {
                    const tds = rows[i].querySelectorAll('td');
                    let pass = 0;
                    for (let j = 1; j <= 10; j++) {
                        pass += parseInt(tds[j].textContent) || 0;
                    }
                    let fail = parseInt(tds[11].textContent) || 0;
                    passCounts.push(pass);
                    failCounts.push(fail);
                }

                // Calculate percentages
                const passPercentages = passCounts.map((pass, idx) => {
                    const total = pass + failCounts[idx];
                    return total > 0 ? (pass / total) * 100 : 0;
                });
                const failPercentages = failCounts.map((fail, idx) => {
                    const total = passCounts[idx] + fail;
                    return total > 0 ? (fail / total) * 100 : 0;
                });

                // Create canvas for chart
                const canvas = document.createElement('canvas');
                canvas.id = 'analyse-graph-canvas';
                // Make the graph always fully visible and responsive
                const analyseTableElem = document.getElementById('analyse-table');
                let tableWidth = 900;
                if (analyseTableElem) {
                    const rect = analyseTableElem.getBoundingClientRect();
                    tableWidth = Math.max(rect.width, 900);
                }
                canvas.style.display = 'block';
                canvas.style.margin = '40px auto 0 auto';
                canvas.style.width = '100%';
                canvas.style.maxWidth = tableWidth + 'px';
                canvas.style.minWidth = '600px';
                canvas.width = tableWidth;
                canvas.height = 540;
                // Ensure parent allows horizontal scroll if needed
                if (canvas.parentNode) {
                    canvas.parentNode.style.overflowX = 'auto';
                }
                // Place just after the analyse table
                if (analyseTableElem && analyseTableElem.parentNode) {
                    analyseTableElem.parentNode.insertBefore(canvas, analyseTableElem.nextSibling);
                } else {
                    document.body.appendChild(canvas);
                }

                // Draw bar graph using Canvas API
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Chart settings
                const margin = 60;
                const barWidth = 20;
                const groupWidth = 60;
                const maxBarHeight = canvas.height - 2 * margin;
                const maxY = 100;

                // Draw axes
                ctx.beginPath();
                ctx.moveTo(margin, margin);
                ctx.lineTo(margin, canvas.height - margin);
                ctx.lineTo(canvas.width - margin, canvas.height - margin);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw y-axis labels
                ctx.font = '12px Arial';
                ctx.fillStyle = '#333';
                for (let y = 0; y <= 100; y += 20) {
                    const yPos = canvas.height - margin - (y / maxY) * maxBarHeight;
                    ctx.fillText(y + '%', margin - 40, yPos + 5);
                    ctx.beginPath();
                    ctx.moveTo(margin - 5, yPos);
                    ctx.lineTo(margin, yPos);
                    ctx.stroke();
                }

                // Draw bars
                for (let i = 0; i < subjects.length; i++) {
                    const x0 = margin + groupWidth * i + 20;
                    // Pass bar
                    const passHeight = (passPercentages[i] / maxY) * maxBarHeight;
                    ctx.fillStyle = '#43a047';
                    ctx.fillRect(x0, canvas.height - margin - passHeight, barWidth, passHeight);
                    // Fail bar
                    const failHeight = (failPercentages[i] / maxY) * maxBarHeight;
                    ctx.fillStyle = '#f44336';
                    ctx.fillRect(x0 + barWidth + 5, canvas.height - margin - failHeight, barWidth, failHeight);
                    // Subject label
                    ctx.save();
                    ctx.translate(x0 + barWidth, canvas.height - margin + 20);
                    ctx.rotate(-Math.PI / 6);
                    ctx.textAlign = 'right';
                    ctx.fillStyle = '#1976d2';
                    ctx.font = '12px Arial';
                    ctx.fillText(subjects[i], 0, 0);
                    ctx.restore();
                    // Bar labels
                    ctx.font = 'bold 12px Arial';
                    ctx.fillStyle = '#43a047';
                    ctx.fillText(passPercentages[i].toFixed(1) + '%', x0, canvas.height - margin - passHeight - 8);
                    ctx.fillStyle = '#f44336';
                    ctx.fillText(failPercentages[i].toFixed(1) + '%', x0 + barWidth + 5, canvas.height - margin - failHeight - 8);
                }

                // Draw total pass and fail percentage at the top
                const totalPass = passCounts.reduce((a, b) => a + b, 0);
                const totalFail = failCounts.reduce((a, b) => a + b, 0);
                const total = totalPass + totalFail;
                const overallPass = total > 0 ? (totalPass / total) * 100 : 0;
                const overallFail = total > 0 ? (totalFail / total) * 100 : 0;
                ctx.font = 'bold 20px Segoe UI, Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#43a047';
                ctx.fillText('Total Pass: ' + overallPass.toFixed(1) + '%', canvas.width / 2 - 100, margin - 30);
                ctx.fillStyle = '#f44336';
                ctx.fillText('Total Fail: ' + overallFail.toFixed(1) + '%', canvas.width / 2 + 100, margin - 30);
            });

            // ...existing code for analyse table creation...
            const tableContainer = document.querySelector('.table-container');
            const analyseTable = document.createElement('table');
            analyseTable.classList.add('table');
            analyseTable.id = 'analyse-table';
            tableContainer.appendChild(analyseTable);
            // ...existing code for header and data rows...
            const headerRow = document.createElement('tr');
            const headings = ['index', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'P', 'F', 'AB', 'Total Pass'];
            headings.forEach(heading => {
                const th = document.createElement('th');
                th.textContent = heading;
                headerRow.appendChild(th);
            });
            analyseTable.appendChild(headerRow);
            const originalTable = document.querySelector('.table');
            const originalHeaderRow = originalTable.querySelector('tr');
            const originalHeaders = originalHeaderRow.querySelectorAll('th');
            for (let i = 1; i <= 8; i++) {
                const dataRow = document.createElement('tr');
                const indexCell = document.createElement('td');
                if (originalHeaders[i]) {
                    indexCell.textContent = originalHeaders[i].textContent;
                }
                dataRow.appendChild(indexCell);
                let countS = 0, countAplus = 0, countA = 0, countBplus = 0, countB = 0, countCplus = 0;
                let countC = 0, countDplus = 0, countD = 0, countP = 0, countF = 0, countAB = 0;
                const originalRows = originalTable.querySelectorAll('tr');
                originalRows.forEach((row, rowIndex) => {
                    if (rowIndex === 0) return;
                    const cells = row.querySelectorAll('td');
                    if (cells[i]) {
                        const grade = cells[i].textContent.trim().toUpperCase();
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
                const gradeCounts = [countS, countAplus, countA, countBplus, countB, countCplus, countC, countDplus, countD, countP, countF, countAB];
                gradeCounts.forEach(count => {
                    const cell = document.createElement('td');
                    cell.textContent = count;
                    dataRow.appendChild(cell);
                });
                // Add Total Pass column (sum of all pass grades)
                const totalPass = countS + countAplus + countA + countBplus + countB + countCplus + countC + countDplus + countD + countP;
                const totalPassCell = document.createElement('td');
                totalPassCell.textContent = totalPass;
                totalPassCell.style.fontWeight = 'bold';
                totalPassCell.style.background = '#e3ffe6';
                dataRow.appendChild(totalPassCell);
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
            // Check if GPA box already exists
            const existingGpaBox = document.querySelector('.gpa-box');
            if (existingGpaBox) {
                alert("GPA box already exists");
                return;
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
            
            // Position the box in the top bar
            topBar.appendChild(gpaBox);
            
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
