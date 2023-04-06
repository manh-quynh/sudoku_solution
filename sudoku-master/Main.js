const generateButton = document.getElementById("generate");
const solveButton = document.getElementById("solve");
const gradeButton = document.getElementById("grade");
const difficulties = Array.from([document.getElementById("easy"),document.getElementById("medium"),document.getElementById("hard")]);
var inputs = document.getElementsByClassName("cell");

var sudoku = [...Array(9)].map(e => Array(9).fill(0));
var indicator = [...Array(9)].map(e => Array(9).fill(0));
var userSolution = [...Array(9)].map(e => Array(9).fill(0));
for(let i=0 ; i<inputs.length ; ++i){
    inputs[i].addEventListener('input', checkInput )
}

function checkInput(e){
    if(e.target.value > 9 || e.target.value < 1){
        e.target.value = '';
    }
    else{
        let temp = e.target.id;
        userSolution[temp[0]][temp[1]] = parseInt(e.target.value);
    }
}
generateButton.addEventListener('click',() => {
    for(let i = 0 ; i<difficulties.length ; ++i){
        if(difficulties[i].value == document.getElementsByClassName("select__trigger").value){
            fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulties[i].id}`)
            .then(respone => (respone.json()))
            .then(data => fillBoard(data['board']))
            .catch(err => alert('there was a problem with puzzle generation'));
        }
    }
});


function clearBoard(){
    for(let i=0 ; i<inputs.length ; ++i){
        inputs[i].value = '';
        inputs[i].readOnly = false;
    }
}

function fillBoard(grid){
    clearBoard();
    sudoku = grid;
    setAux(grid);
    for(var i=0 ; i<9 ; ++i){
        for(var j=0 ; j<9 ; ++j){
            let cell = document.getElementById(i.toString() + j.toString());
            let value = grid[i][j];
            if(value !== 0){
                cell.value = value;
                cell.readOnly = true;
            }
            cell.style.color = '#000';
        }
    }
    solveButton.disabled = false;
    gradeButton.disabled = false;
}


function solve() {
    for (var i = 0; i < sudoku.length; i++) {
        var temp = sudoku[i];
        for (var j = 0; j < temp.length; j++) {
            if (sudoku[i][j] == 0) {
                for (var c = 1; c <= 9; c++) {
                    if (isValidPlacement(i, j, c)) {
                        sudoku[i][j] = c;
                        if (solve()) {
                            return true;
                        }
                        else {
                            sudoku[i][j] = 0;
                        }
                    }

                }
                return false;
            }
        }
    }
    fillSolution();
    return true;
}
function isValidPlacement(row ,col , c){
    for (let i = 0; i < 9; i++) {
        if (sudoku[row][i] == c) {
          return false;
        }
      }
    
      for (let i = 0; i < 9; i++) {
        if (sudoku[i][col] == c) {
          return false;
        }
      }
    
      const x = ~~(row / 3) * 3;
      const y = ~~(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (sudoku[x + i][y + j] == c) {
            return false;
          }
        }
      }
      return true;
}

function fillSolution(){
    for(let i=0 ; i<9 ; ++i){
        for(let j=0 ; j<9 ; ++j){
            let cell = document.getElementById(i.toString() + j.toString());
            if(indicator[i][j] == 1){
                cell.style.color = '#FF0000';
                cell.value = sudoku[i][j];
                cell.readOnly = true;
            }
        }
    }
    solveButton.disabled = true;
    gradeButton.disabled = true;
}

function grade(){
    var rows = [...Array(9)].map(e => Array(9).fill(0));
    var cols = [...Array(9)].map(e => Array(9).fill(0));
    var box = [...Array(9)].map(e => Array(9).fill(0)); 
    for(let i=0 ; i<9 ; ++i){
        for(let j=0 ; j<9 ;++j){
            if(userSolution[i][j] == 0){
                alert('Solution is incomplete');
                return;
            }
            else{
                let num = userSolution[i][j] , k = ~~(i / 3) * 3 + ~~(j / 3);
                if(rows[i][num] || cols[j][num] || box[k][num]){
                    alert('Found a Mistake');
                    return;
                }
                rows[i][num] = cols[j][num] = box[k][num] = 1;
            }
        }
    }
    alert("Congrats!");
}

function setAux(grid){
    indicator = [...Array(9)].map(e => Array(9).fill(0));
    for(var i = 0 ; i<9 ;++i){
        for(var j=0 ; j<9 ; ++j){
            if(grid[i][j] == 0){
                indicator[i][j] = 1;
            }
            userSolution[i][j] = grid[i][j];
        }
    }
}

function close_window(){
    if(confirm("Bạn có chắc muốn thoát hay không?")){
        window.open('','_self').close();
    }
}


// ---------------

for (const dropdown of document.querySelectorAll(".select-wrapper")) {
    dropdown.addEventListener('click', function () {
        this.querySelector('.select').classList.toggle('open');
    })
}
for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.select').querySelector('.select__trigger span').textContent = this.textContent;
        }
    })
}
window.addEventListener('click', function (e) {
    for (const select of document.querySelectorAll('.select')) {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    }
});



