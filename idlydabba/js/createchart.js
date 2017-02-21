google.charts.load('current', { 'packages': ['corechart'] });

function drawChartsum() {

    var datasum = google.visualization.arrayToDataTable([
      ['Nutient', 'Calories'],
      ['Carbohydrate', 30],
      ['Protein', 50],      
      ['Minerals', 20]
    ]);

    var optionssum = {
        backgroundColor: '#646567',
        fontSize: '16',
        legend: {
            position: 'none'
        },
        width: '100%',
        height: '100%',
        chartArea: {
            //left: "3%",
            //top: "3%",
            height: "100%",
            width: "100%"
        },
        is3D: false
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(datasum, optionssum);
}


function drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Nutient', 'Calories'],
      ['Carbohydrate', 30],
      ['Protein', 40],
      ['Fats', 10],
      ['Minerals', 20]
    ]);

    var options = {
        backgroundColor: '#646567',
        fontSize: '16',
        legend: {
            position: 'none'
        },
        width: '100%',
        height: '100%',
        chartArea: {
            left: "3%",
            top: "3%",
            height: "100%",
            width: "100%"
        },
        is3D: false
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart0'));

    chart.draw(data, options);
}
function drawChart1() {

    var data1 = google.visualization.arrayToDataTable([
      ['Nutient', 'Calories'],
      ['Carbohydrate', 40],
      ['Protein', 50],
      ['Fats', 5],
      ['Minerals', 5]
    ]);

    var options1 = {
        backgroundColor: '#646567',
        fontSize: '16',
        legend: {
            position: 'none'
        },
        width: '100%',
        height: '100%',
        chartArea: {
            left: "3%",
            top: "3%",
            height: "95%",
            width: "95%"
        },
        is3D: false
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart1'));

    chart.draw(data1, options1);
}
function drawChart2() {

    var data2 = google.visualization.arrayToDataTable([
      ['Nutient', 'Calories'],
      ['Carbohydrate', 60],
      ['Protein', 10],
      ['Fats', 5],
      ['Minerals', 25]
    ]);

    var options2 = {
        backgroundColor: '#646567',
        fontSize: '16',
        legend: {
            position: 'none',
        },
        width: '100%',
        height: '100%',
        chartArea: {
            left: "3%",
            top: "3%",
            height: "95%",
            width: "95%"
        },
        is3D: false
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart2'));

    chart.draw(data2, options2);
}

