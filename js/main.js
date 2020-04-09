$(document).ready(function () {

    var baseUrl = "http://157.230.17.132:4018/sales";
    stampaGrafici();

    $('button').click(function () {
        var nomeVenditore = $('#venditore').val();
        var dataVendita = $('#data').val();
        var dataVenditaFormattata = moment(dataVendita, 'YYYY-MM-DD').format('DD/MM/YYYY');
        var vendita = $('#fatturato').val();
        $.ajax ({
            url: baseUrl,
            method: 'POST',
            data : {
                salesman: nomeVenditore,
                amount: vendita,
                date: dataVenditaFormattata
            },
            success: function (data) {
                console.log(data);
                stampaGrafici();
            },
            error: function (err) {
                alert('errore');
            }
        });
    })

    function stampaGrafici() {
        $('#container-grafico').empty();
        $('#container-grafico').append('<canvas id="grafico"></canvas><canvas id="grafico2"></canvas>');
        $.ajax ({
            url: baseUrl,
            method: 'GET',
            success: function (data) { // data è un array di oggetti
                // elaboro i dati ricevuti dal server per fare 2 array
                // do in pasto a chartjs i 2 array
                var datiMensili = costruttoreDatiMensili(data); // elaboriamo i dati della GET per renderli digeribili da chartjs (ritorna un oggetto)
                createLineChart(datiMensili.mese, datiMensili.vendite); // diamo in pasto a chartjs la labels e data ricavati dall oggetto datiMensili
                var fatturato = fatturatoTotale(data);
                var datiVenditori = costruttoreDatiVenditori(data, fatturato);
                createPieChart(datiVenditori.venditori, datiVenditori.vendite);

            },
            error: function (err) {
                alert('Errore Api');
            }
        });
    }

    function costruttoreDatiMensili(vendite) {
        var venditeMensili = {
            gennaio: 0,
            febbraio: 0,
            marzo: 0,
            aprile: 0,
            maggio: 0,
            giugno: 0,
            luglio: 0,
            agosto: 0,
            settembre: 0,
            ottobre: 0,
            novembre: 0,
            dicembre: 0
        };
        for (var i = 0; i < vendite.length; i++) {  //ciclo nelle vendite che ho ricevuto dal GET per aggiungere .amount all'oggetto venditeMensili
            var vendita = vendite[i];               // valuto ogni singola vendita
            var dataVendita = vendita.date;         // estrapolo la data dall oggetto vendita
            var meseVendita = moment(dataVendita, 'DD/MM/YYYY').format('MMMM');     // trasformo la data in mese
            venditeMensili[meseVendita] += parseInt(vendita.amount);        // uso il nome del mese ricavato per riconoscore le chiave nell oggetto vendite mensili e aggiungere a questa la vendita appartenente a quel mese
        }
        var arrayMesi = [];     // inizializzo l array per chartJS
        var arrayVendite = [];  // inizializzo l array per chartJS
        for (var nomeMese in venditeMensili) {  // ciclo all interno dell oggetto venditeMensili per trasformare la coppia chiave-valore in due array da dare a chartjs
            arrayMesi.push(nomeMese);           // inserisco il nome del mese nell arrayMesi
            arrayVendite.push(venditeMensili[nomeMese]);    // inserisco nell arrayVendite la somma di tutte le vendite del relativo mese
        }
        return {
            mese: arrayMesi,
            vendite: arrayVendite
        };
    }

    function fatturatoTotale(vendite) {
        var fatturato = 0;
        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            fatturato += parseInt(vendita.amount);
        }
        return fatturato;
    }

    function costruttoreDatiVenditori(vendite, fatturatoAziendale) {
        var venditeVenditori = {};  // creazione oggetto vuoto che assumerà la somme delle vendite annuali di ogni singolo venditore
        for (var i = 0; i < vendite.length; i++) {  // ciclo for nell array della GET
            var vendita = vendite[i];   // consideto il singolo oggetto dell array
            var nomeVenditore = vendita.salesman;   // associo a una variabile il nome del venditore
            if (venditeVenditori[nomeVenditore] === undefined) {    // se non esiste una chiave con il nome di quel venditore
                venditeVenditori[nomeVenditore] = 0;                // inizializzo la chiave con valore 0
            }
            venditeVenditori[nomeVenditore] += parseInt(vendita.amount);    // sommo la vendita dell'oggetto attuale a quel venditore
        }
        var arrayVenditori = [];
        var arrayVendite = [];
        for (var nomeVenditore in venditeVenditori) {
            arrayVenditori.push(nomeVenditore);
            var fatturatoPercentualeVenditore = ((venditeVenditori[nomeVenditore] / fatturatoAziendale) * 100).toFixed(2);
            arrayVendite.push(fatturatoPercentualeVenditore);
        }
        return {
            venditori: arrayVenditori,
            vendite: arrayVendite
        }
    };

    function createLineChart(labels, data) {
        var ctx = $('#grafico');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Fatturato Mesi',
                    borderColor: 'lightgreen',
                    pointBackgroundColor: 'red',
                    pointBorderColor: 'lightblue',
                    lineTension: 0,
                    data: data
                }]
            },
        });
    }

    function createPieChart(arrayLabels, arrayData) {
        var ctx = $('#grafico2');
        var pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: arrayData,
                    backgroundColor: ['Red', 'Yellow','Blue', 'Green'],
                    hoverBackgroundColor: ['lightcoral', 'khaki', 'lightblue', 'lightgreen']
                }],
                labels: arrayLabels
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
    }
});
