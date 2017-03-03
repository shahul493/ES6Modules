
var dataSet = [
      ["Student", "Student", "1a1", "Primary", "2nd", "1a1", "Primary", "Primary", "Primadssssssssssssry", "Primary", "Primary", "Primary", "Primary", "Primary", "Primary"],
      ["Student", "Student", "1a1", "Primary", "2nd", "1a1", "", "", "", "", "", "Primary", "", "Primary", ""],
      ["Student", "Student", "1a1", "Primary", "2nd", "1a1", "", "", "", "", "", "Primary", "", "Primary", ""],

];

var dataSetma = [
["Subramani", "4th-C", "17M601", "B-M1", "No"],
["Vimal", "5th-D", "17M201", "B-M2", "Yes"],
["Adhi", "6th-E", "17M251", "C-M1", "No"],

];

var datamealnew = [
["12/01/17", "Breakfast", "M1", "Veg", "20"], ["11/01/17", "lunch", "M2", "Veg", "80"], ["14/01/17", "dinner", "M3", "Veg", "30"], ["12/01/17", "Dinner", "M4", "Veg", "50"], ["12/01/17", "Breakfast", "M1", "Veg", "20"]



];


function bindtable() {
    $('#tbl-category').DataTable({
        "sDom": 'rt',
        data: dataSet,
        resize: false,
        "responsive": true,
        columnDefs: [

           { responsivePriority: 1, targets: 0 },
        ]
    });
    $('#tbl-meal-new').DataTable({
        "sDom": 'rt',
        data: datamealnew,
        resize: false,
        "responsive": true,
        columnDefs: [

           { responsivePriority: 1, targets: 0 },
        ]
    });

    $('#tbl-meal-attendance').DataTable({
        "sDom": 'rt',
        data: dataSetma,
        "bAutoWidth": false,
        "scrollX": true,
        "scrollY": "200px",
        
        "paging": false,
        "bScrollCollapse": true,
        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "render": function (data, type, row) {
                // return data + ' (' + row[3] + ')';
                if (row[4] === "No") {
                    return '<label class="checkbox-inline"><input class="chkbx" type="checkbox" data-toggle="toggle"> Absent</label>';
                }
                else
                {
                    return '<label class="checkbox-inline"><input class="chkbx" type="checkbox" checked data-toggle="toggle"> Present</label>';
                }
            },
            
        }],
        "fnDrawCallback": function () {
            $('.chkbx').bootstrapToggle();
        },
    });
}