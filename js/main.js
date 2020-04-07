$(document).ready(function () {

    var settings = {
      "url": "http://157.230.17.132:4018/sales",
      "method": "GET",
      "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        var vendite = response;

        var oggettoIntermedio = {
            'gennaio': 0,
            'febbraio': 0,
            'marzo': 0,
            'aprile': 0,
            'maggio': 0,
            'giugno': 0,
            'luglio': 0,
            'agosto': 0,
            'settembre': 0,
            'ottobre': 0,
            'novembre': 0,
            'dicembre': 0
        };

        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            // console.log(vendita);           // mostro l oggetto della singola vendita
            // console.log(vendita.id);        // mostro l id della singola vendita
            // console.log(vendita.salesman);  // mostro il venditore della singola vendita
            // console.log(vendita.amount);    // mostro il totale della singola vendita
            // console.log(vendita.date);      // mostro la data singola vendita
            var dataVendita = moment(vendita.date, 'DD-MM-YYYY');
            console.log(dataVendita);
            var meseVendita = dataVendita.format('MMMM');
            console.log(meseVendita);

            if (oggettoIntermedio[meseVendita] === undefined) {
                oggettoIntermedio[meseVendita] = 0;
            }
            console.log(oggettoIntermedio);
            oggettoIntermedio[meseVendita] += vendita.amount;
        }

        var mesi = [];
        var fatturato = [];

        for (var key in oggettoIntermedio) {
            mesi.push(key);
            fatturato.push(oggettoIntermedio[key]);
        }

        var ctx = $('#grafico');
        var chart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: mesi,
            datasets: [{
                label: 'Fatturato Mensile ',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderColor: 'lightblue',
                pointBackgroundColor: 'red',
                pointBorderColor: 'red',
                data: fatturato
            }]
        },
    });



});















});
