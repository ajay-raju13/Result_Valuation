const input = document.getElementById('input-box');
const addbtn = document.getElementById('button');
const main = document.getElementById('container');
const label = document.createElement('label');
const topBar = document.querySelector('.top-bar');

let deleButton = null;
let searchbar = null;

// Helper: process CSV text (creates table, search, delete button etc.)
function processCSV(contents) {
    if (!searchbar) {
        searchbar = document.createElement('input');
        searchbar.id = 'search';
        searchbar.setAttribute('placeholder', 'search');
        label.innerText = 'search  ';
        label.setAttribute('for', 'search');
        main.appendChild(label);
    }

    if (!searchbar._hasListener) {
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
        searchbar._hasListener = true;
    }

    if (!searchbar.parentNode) main.appendChild(searchbar);

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
            if (searchbar) {
                searchbar.remove();
                searchbar = null;
            }
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
}

addbtn.addEventListener('click', function () {
    if (input.files.length === 0) {
        alert("Please select a file.");
    } else if (document.querySelector('.table')) {
        alert("There is already a table.");
    } else {
        const file = input.files[0];

        // If Excel file, use SheetJS to convert first sheet to CSV
        if (/\.xlsx?$|\.xls$/i.test(file.name) || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            if (!window.XLSX) {
                alert('Excel parsing library is not loaded. Please check your internet connection.');
                return;
            }
            const r = new FileReader();
            r.readAsArrayBuffer(file);
            r.onload = function(ev) {
                try {
                    const data = new Uint8Array(ev.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.SheetNames[0];
                    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheet]);
                    processCSV(csv);
                } catch (err) {
                    alert('Failed to parse Excel file: ' + err.message);
                }
            };
        } else {
            const r = new FileReader();
            r.readAsText(file);
            r.onload = function(ev) {
                processCSV(ev.target.result);
            };
        }
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
                    const g = cells[i].textContent.trim().toLowerCase();
                    if (g === 'f' || g === 'fail' || g === 'ab') {
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

                // Get subject names and pass/fail counts from the main parsed table
                const mainTable = document.querySelector('.table');
                if (!mainTable) {
                    alert('Main table not found.');
                    return;
                }
                const mainRows = mainTable.querySelectorAll('tr');
                // Use second row for subject names if it exists and has enough cells, otherwise use first row
                const candidate = mainRows[1] && mainRows[1].querySelectorAll('th,td').length > 1 ? mainRows[1] : mainRows[0];
                const headerCells = candidate.querySelectorAll('th,td');
                const subjects = [];
                for (let i = 1; i <= 8; i++) {
                    if (headerCells[i]) subjects.push(headerCells[i].textContent.trim());
                }

                // Determine where data rows start depending on header choice
                const dataStartIndex = (candidate === mainRows[1]) ? 2 : 1;

                // Compute pass/fail counts directly from main table data
                const passCounts = [];
                const failCounts = [];
                for (let col = 1; col <= 8; col++) {
                    let pass = 0;
                    let fail = 0;
                    for (let r = dataStartIndex; r < mainRows.length; r++) {
                        const cells = mainRows[r].querySelectorAll('td');
                        if (!cells || cells.length <= col) continue;
                        const gradeRaw = cells[col].textContent.trim();
                        const grade = gradeRaw.toUpperCase();
                        // Treat 'F' and 'FAIL' as failures; 'AB' also counts as failure.
                        if (grade === 'F' || grade === 'FAIL' || grade === 'AB') {
                            fail++;
                        } else if (grade === 'P' || grade === 'PASS') {
                            // Explicit pass markers
                            pass++;
                        } else if (grade !== '') {
                            // Any other non-empty grade is considered a pass
                            pass++;
                        }
                    }
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

                // Draw total pass and fail percentage at the top using analysed student counts
                // `studentCount`, `passCount` and `failCount` are computed in the outer analyse scope
                const total = studentCount || (passCounts.reduce((a,b)=>a+b,0) + failCounts.reduce((a,b)=>a+b,0));
                const totalPass = typeof passCount === 'number' ? passCount : passCounts.reduce((a, b) => a + b, 0);
                const totalFail = typeof failCount === 'number' ? failCount : failCounts.reduce((a, b) => a + b, 0);
                const overallPass = total > 0 ? (totalPass / total) * 100 : 0;
                const overallFail = total > 0 ? (totalFail / total) * 100 : 0;
                ctx.font = 'bold 20px Segoe UI, Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#1976d2';
                ctx.fillText('Total Pass: ' + overallPass.toFixed(1) + '%', canvas.width / 2 - 120, margin - 30);
                ctx.fillStyle = '#f44336';
                ctx.fillText('Total Fail: ' + overallFail.toFixed(1) + '%', canvas.width / 2 + 120, margin - 30);
            });

            // ...existing code for analyse table creation...
            const tableContainer = document.querySelector('.table-container');
            const analyseTable = document.createElement('table');
            analyseTable.classList.add('table');
            analyseTable.id = 'analyse-table';
            tableContainer.appendChild(analyseTable);
            // ...existing code for header and data rows...
            const headerRow = document.createElement('tr');
            const headings = ['index', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'P', 'F', 'AB', 'FAIL', 'PASS'];
            headings.forEach(heading => {
                const th = document.createElement('th');
                th.textContent = heading;
                headerRow.appendChild(th);
            });
            analyseTable.appendChild(headerRow);

            const mainTable = document.querySelector('.table');
            const mainRows = mainTable.querySelectorAll('tr');
            // choose second row for subject names if present, otherwise first
            const candidateHeaderRow = (mainRows[1] && mainRows[1].querySelectorAll('th,td').length > 1) ? mainRows[1] : mainRows[0];
            const headerCells = candidateHeaderRow.querySelectorAll('th,td');
            const dataStart = (candidateHeaderRow === mainRows[1]) ? 2 : 1;

            for (let col = 1; col <= 8; col++) {
                const dataRow = document.createElement('tr');
                const indexCell = document.createElement('td');
                if (headerCells[col]) {
                    indexCell.textContent = headerCells[col].textContent.trim();
                } else {
                    indexCell.textContent = '';
                }
                dataRow.appendChild(indexCell);

                // Counters for each grade
                let countS = 0, countAplus = 0, countA = 0, countBplus = 0, countB = 0, countCplus = 0;
                let countC = 0, countDplus = 0, countD = 0, countP = 0, countF = 0, countAB = 0;

                for (let r = dataStart; r < mainRows.length; r++) {
                    const cells = mainRows[r].querySelectorAll('td');
                    if (!cells || cells.length <= col) continue;
                    const grade = cells[col].textContent.trim().toUpperCase();
                    switch (grade) {
                        case 'S': countS++; break;
                        case 'A+': countAplus++; break;
                        case 'A': countA++; break;
                        case 'B+': countBplus++; break;
                        case 'B': countB++; break;
                        case 'C+': countCplus++; break;
                        case 'C': countC++; break;
                        case 'D+': countDplus++; break;
                        case 'D': countD++; break;
                        case 'P':
                        case 'PASS': countP++; break;
                        case 'F':
                        case 'FAIL': countF++; break;
                        case 'AB': countAB++; break;
                        default: break;
                    }
                }

                const gradeCounts = [countS, countAplus, countA, countBplus, countB, countCplus, countC, countDplus, countD, countP, countF, countAB];
                gradeCounts.forEach(count => {
                    const cell = document.createElement('td');
                    cell.textContent = count;
                    dataRow.appendChild(cell);
                });

                // Aggregate FAIL = F + AB
                const failTotal = countF + countAB;
                const failCell = document.createElement('td');
                failCell.textContent = failTotal;
                failCell.style.background = '#ffdde0';
                failCell.style.fontWeight = '600';
                dataRow.appendChild(failCell);

                // Aggregate PASS = sum of pass grades
                const passTotal = countS + countAplus + countA + countBplus + countB + countCplus + countC + countDplus + countD + countP;
                const passCell = document.createElement('td');
                passCell.textContent = passTotal;
                passCell.style.background = '#e3ffe6';
                passCell.style.fontWeight = '600';
                dataRow.appendChild(passCell);

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
                
                // Treat the first two rows as headers and don't sort them
                const headerRow1 = rows[0];
                const headerRow2 = rows[1];
                const dataRows = rows.slice(2);
                
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
                
                // Clear the table (except first two header rows)
                rows.slice(2).forEach(row => row.remove());

                // Re-append header rows then sorted rows
                originalTable.appendChild(headerRow1);
                originalTable.appendChild(headerRow2);
                dataRows.forEach(row => originalTable.appendChild(row));
                
                console.log('Table sorted by second-to-last column in descending order');
            });
            
            // CGPA button click functionality
            cgpaBtn.addEventListener('click', function () {
                console.log('CGPA button clicked');
                
                // Get the original table
                const originalTable = document.querySelector('.table');
                const rows = Array.from(originalTable.querySelectorAll('tr'));
                
                // Treat the first two rows as headers and don't sort them
                const headerRow1 = rows[0];
                const headerRow2 = rows[1];
                const dataRows = rows.slice(2);
                
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
                
                // Clear the table (except first two header rows)
                rows.slice(2).forEach(row => row.remove());

                // Re-append header rows then sorted rows
                originalTable.appendChild(headerRow1);
                originalTable.appendChild(headerRow2);
                dataRows.forEach(row => originalTable.appendChild(row));
                
                console.log('Table sorted by last column in descending order');
            });
        });
    }
});
