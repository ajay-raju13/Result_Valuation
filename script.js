const input = document.getElementById('input-box');
const btn = document.getElementById('button');
const main = document.getElementById('container');

btn.addEventListener('click', function () {
    if (input.files.length === 0) {
        alert("Please select a file.");
    } else {
        let file = input.files[0];
        console.log("Selected file:", file);

        let reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            const rows = contents.trim().split("\n");

            const div = document.createElement('div');
            div.classList.add('table-container');
            main.appendChild(div);

            const table = document.createElement('table');
            table.classList.add('table');
            div.appendChild(table);

            for (let i = 0; i < rows.length; i++) {
                const columns = rows[i].split(",");
                const tr = document.createElement('tr');
                tr.classList = 'tr';

                for (let j = 0; j < columns.length; j++) {
                    const cell = document.createElement(i === 0 ? 'th' : 'td');
                    cell.textContent = columns[j].trim();
                    tr.appendChild(cell);
                }

                table.appendChild(tr);
            }
        };

        reader.readAsText(file);
    }
});
