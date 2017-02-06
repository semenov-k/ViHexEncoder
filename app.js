/**
 * Created by Кирилл Семенов on 06.02.2017.
 */
window.onload = function () {
    //General sum
    var general_sum = 0;

    //mouse 'down' watcher
    var mouse_down = false;

    //Map
    const MAP = [
        ['', 'A',  ''],
        ['F', '', 'B'],
        ['', 'G',  ''],
        ['E', '', 'C'],
        ['', 'D',  '']
    ];

    //Sector storage
    var storage = [];

    //Colors
    const ACTIVE_COLOR = 'rgb(255, 250, 133)',
          INACTIVE_COLOR = 'rgb(255, 194, 133)';

    //Sector size
    const VERTICAL = ['20px', '50px'],
          HORIZONTAL = ['50px', '20px'];

    //Data inputs
    var hex_input = document.querySelector('#hex'),
        bin_input = document.querySelector('#bin');

    //Centring root block
    var root = document.querySelector('#root');
    root.style.marginTop = Math.round(window.innerHeight / 2 - root.clientHeight / 2 - 100) + 'px';
    root.style.marginLeft = Math.round(window.innerWidth / 2 - root.clientWidth / 2) + 'px';

    //Input
    function inputData() {
        var bin_number = general_sum.toString(2);
        if(bin_number.length < 8){
            while (bin_number.length != 8){
                bin_number = '0' + bin_number;
            }
        }
        hex_input.value = general_sum.toString(16);
        bin_input.value = bin_number;
    }

    //General mouse handlers
    document.addEventListener('mousedown', function () {
        mouse_down = true;
    });
    document.addEventListener('mouseup', function () {
        mouse_down = false;
    });

    //Additional functions
    function invertState(target, _only_active){
        target.active = !target.active || _only_active;
        if(target.active || _only_active){
            target.style.backgroundColor = ACTIVE_COLOR;
        }else{
            target.style.backgroundColor = INACTIVE_COLOR;
        }
        general_sum = 0;
        storage.forEach(function (item) {
            if(item.active){
                general_sum += getNumber(item);
            }
        });
        inputData();
    }

    function getNumber(target) {
        switch (target.id){
            case 'A': return 64; break;
            case 'B': return 32; break;
            case 'C': return 16; break;
            case 'D': return 8; break;
            case 'E': return 4; break;
            case 'F': return 2; break;
            case 'G': return 1; break;
        }
    }

    //Sector constructor
    var SectorFactory = function(id, orientation){
        var sector = document.createElement('td');
        
        sector.style.backgroundColor = INACTIVE_COLOR;
        sector.active = false;
        sector.id = id;
        sector.className = 'sector';
        sector.innerText = id;

        if(orientation === 'vertical'){
            sector.style.width = VERTICAL[0];
            sector.style.height = VERTICAL[1];
        }else{
            sector.style.width = HORIZONTAL[0];
            sector.style.height = HORIZONTAL[1];
        }

        //Event Listeners
        sector.addEventListener('click', function(e){
            e.preventDefault();
            invertState(e.target);
        });
        sector.addEventListener('mouseover', function (e) {
            if(mouse_down){
                invertState(e.target, true);
            }
        });
        sector.addEventListener('drugstart', function (e) {
            e.preventDefault();
        });

        storage.push(sector);
        return sector;
    };

    inputData();
    //Create table statement
    var container = document.createElement('table');
    MAP.forEach(function (row) {
        var containerRow = document.createElement('tr');
        row.forEach(function (cell, cell_index) {
            if(cell !== ''){
                containerRow.appendChild(
                    SectorFactory(cell, (cell_index % 2 == 0 ? 'vertical' : 'horizontal'))
                );
            }else{
                containerRow.appendChild(
                    document.createElement('td')
                );
            }
        });
        container.appendChild(containerRow);
    });
    document.querySelector('#led').appendChild(container);

    document.querySelector('#clear').addEventListener('click', function (e) {
        e.preventDefault();
        storage.forEach(function (item) {
            item.active = false;
            item.style.backgroundColor = INACTIVE_COLOR;
        });
        general_sum = 0;
        inputData();
    });
    document.querySelector('#copy-hex').addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#hex').select();
        try{
            document.execCommand('copy');
        }catch (err){
            console.error('Unable to copy!');
        }
    });
    document.querySelector('#hex').addEventListener('change', function (e) {
        e.preventDefault();
        inputData();
    });
    document.querySelector('#bin').addEventListener('change', function (e) {
        e.preventDefault();
        inputData();
    });
};