const input = document.getElementById('input-box');
const addbtn = document.getElementById('button');
const main = document.getElementById('container');
const label = document.createElement('label');

let deleButton = null;

let searchbar = null;

addbtn.addEventListener('click', function () {
    if (input.files.length === 0) {
    alert("Please select a file.");
    
    }else if (document.querySelector('.table')) {
    alert("There is already a table.");
    }
    else {
        
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.readAsText(file);

        reader.onload = function (e) {

            if (!searchbar) {
                searchbar = document.createElement('input');
                searchbar.id = 'search';
                searchbar.setAttribute('placeholder' , 'search');
                label.innerText = 'search  ';
                label.setAttribute('for' , 'search');
                main.appendChild(label);

            }

       searchbar.addEventListener('input', function () {
    const val = searchbar.value.toLowerCase();

    const table = document.querySelector('.table');

    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
        if (index === 0) return;

        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(val)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
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
                    div.remove();
                    deleButton.remove();
                    deleButton = null;
                    searchbar.remove();
                    searchbar = null;
                    label.remove();


                });
                main.appendChild(deleButton);
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
