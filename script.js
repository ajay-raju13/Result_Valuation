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

    if (input.files.length === 0) {
        alert("Please select a file.");
    } else {
        const analyse_box = document.createElement('div');
        analyse_box.classList = 'analyse-box';
        analyse.appendChild(analyse_box);

        const table = document.querySelector('.table');
        const rows = table.querySelectorAll('tr');

        rows.forEach((row, index) => {
            if (index === 0) return;

            studentCount++;

            const cells = row.querySelectorAll('td');
            for (let i = 1; i < cells.length; i++) {
                if (cells[i].textContent.trim().toLowerCase() === 'f') {
                    failCount++;
                    row.style.backgroundColor = '#ffcccc';
                    break;
                }
            }
        });

        const analyse_table_btn = document.createElement('button');
        analyse_table_btn.textContent = 'create table';
        analyse_table_btn.id = 'analyse-table-btn';
        analyse_box.appendChild(analyse_table_btn);

        analyse_table_btn.addEventListener('click', function () {
            const tableContainer = document.querySelector('.table-container');
            const analyseTable = document.createElement('table');
            analyseTable.classList.add('table');
            tableContainer.appendChild(analyseTable); 
            console.log(failCount);
            console.log(studentCount);
        });
    }
});
