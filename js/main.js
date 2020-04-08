$(document).ready(function () {

    $('button').click(function () {
        acquisizioneEInvioDati();
    });
    $('#aggiorna').click(function () {
        location.reload(true);
    });

    function acquisizioneEInvioDati() {
        var venditoreSelezionato = $('#venditore option:selected').text();
        var dataSelezionata = $('#data').val();
        dataSelezionata = moment(dataSelezionata).format('DD/MM/YYYY');
        // var meseVendita = moment(dataSelezionata).format('DD/MM/YYYY');
        // console.log(meseVendita);
        var inputFatturato = parseInt($('#fatturato').val());
        var objDati = {
            salesman: venditoreSelezionato,
            amount: inputFatturato,
            date: dataSelezionata
        }
        console.log(objDati);
        $.ajax({
            url: "http://157.230.17.132:4018/sales",
            method: "POST",
            data: objDati
        });
    }

// acquisizioneDati();

    var settingsGet = {
      "url": "http://157.230.17.132:4018/sales",
      "method": "GET",
      "timeout": 0,
    };

    $.ajax(settingsGet).done(function (response) {
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
//----------------- INIZIO COSTRUTTORE DATI PRIMO GRAFICO-----------------------//
        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            // console.log(vendita);           // mostro l oggetto della singola vendita
            // console.log(vendita.id);        // mostro l id della singola vendita
            // console.log(vendita.salesman);  // mostro il venditore della singola vendita
            // console.log(vendita.amount);    // mostro il totale della singola vendita
            // console.log(vendita.date);      // mostro la data singola vendita
            var dataVendita = moment(vendita.date, 'DD-MM-YYYY');
            var meseVendita = dataVendita.format('MMMM');
            if (oggettoIntermedio[meseVendita] === undefined) {
                oggettoIntermedio[meseVendita] = 0;
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[meseVendita] += parseInt(vendita.amount);
        }

        var mesi = [];
        var fatturato = [];

        for (var key in oggettoIntermedio) {
            mesi.push(key);
            fatturato.push(oggettoIntermedio[key]);
        }

//----------------- FINE COSTRUTTORE DATI PRIMO GRAFICO-----------------------//


//------------------------- PRIMO GRAFICO LINE--------------------------------//
        var ctx = $('#grafico');
        var chart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: mesi,
            datasets: [{
                label: 'Fatturato Mesi',
                borderColor: 'lightgreen',
                pointBackgroundColor: 'red',
                pointBorderColor: 'lightblue',
                lineTension: 0,
                data: fatturato
            }]
        },
    });
    });
//------------------------- FINE PRIMO GRAFICO LINE---------------------------//
    $.ajax(settingsGet).done(function (response) {
        var vendite = response;

        var oggettoIntermedio = {};

//----------------- INIZIO COSTRUTTORE DATI PRIMO GRAFICO-----------------------//
        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            // console.log(vendita);           // mostro l oggetto della singola vendita
            // console.log(vendita.id);        // mostro l id della singola vendita
            // console.log(vendita.salesman);  // mostro il venditore della singola vendita
            // console.log(vendita.amount);    // mostro il totale della singola vendita
            // console.log(vendita.date);      // mostro la data singola vendita
            var nomeVenditore = vendita.salesman;
            var fatturatoVenditore = parseInt(vendita.amount);
            if (oggettoIntermedio[nomeVenditore] === undefined) {
                oggettoIntermedio[nomeVenditore] = 0;
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[nomeVenditore] += parseInt(vendita.amount);
        }

        var nomiVenditori = [];
        var fatturatoVenditori = [];

        for (var key in oggettoIntermedio) {
            nomiVenditori.push(key);
            // console.log(oggettoIntermedio[key]);
            oggettoIntermedio[key] = ((Math.floor(oggettoIntermedio[key]) / 118940) * 100).toFixed(2);
            fatturatoVenditori.push(oggettoIntermedio[key]);
        }
        // console.log(nomiVenditori);
        // console.log(fatturatoVenditori);
//----------------- FINE COSTRUTTORE DATI SECONDO GRAFICO-----------------------//

//------------------------- PRIMO GRAFICO PIE--------------------------------//
        var ctx = $('#grafico2');
        var chart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: fatturatoVenditori,
                    backgroundColor: ['lightyellow', 'lightgreen', 'lightcoral', 'lightblue']
                }],
                labels: nomiVenditori
            },
            options: {
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                  }
                }
            }
        });
//------------------------- FINE PRIMO GRAFICO PIE---------------------------//
    });

});
