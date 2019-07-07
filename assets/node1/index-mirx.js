var db = firebase.database()
var GLOBAL_takeLastN = 0
var GLOBAL_beginLimit = 0
var GLOBAL_endLimit = 0

async function main() {
    let FETCH_STATUS = false
    let FETCHED_DATA = []
    let FILTERED_DATA = []

    // NGAMBIL SEMUA YG BELUM BELUM
    await db.ref('/2/xlog/sensor').limitToLast(20).once('value', function (snapshot) {
        FETCHED_DATA = []
		
        snapshot.forEach(s => {
            
			FETCHED_DATA.push(s.val())
        })

        if (GLOBAL_takeLastN == 0) {
            GLOBAL_takeLastN = FETCHED_DATA.length
        }

        if (GLOBAL_beginLimit !== 0 && GLOBAL_endLimit !== 0) {
            console.log('here');

            FILTERED_DATA = FETCHED_DATA.slice(GLOBAL_beginLimit, GLOBAL_endLimit)
        } else {
            FILTERED_DATA = FETCHED_DATA.slice(Math.max(FETCHED_DATA.length - GLOBAL_takeLastN, 1))
        }
    })

    // NGAMBIL DATA BARU -> TAMPILIN
    db.ref('/2/xlog/sensor').endAt().limitToLast(1).on('child_added', function (snapshot) {
        if (FETCH_STATUS) {
            const {
                Waktu,
                temperature,
				
            } = snapshot.val()

            //if (parameter.node !== 'Node-01')
              //  return //bawahnya ga dieksekusi
            //}

            chart.data.labels.push(Waktu)
            chart.data.datasets[0].data.push(temperature)

            if (chart.data.datasets[0].data.length > GLOBAL_takeLastN) {
                chart.data.labels.shift()
                chart.data.datasets[0].data.shift()
            }

            chart.update();
        }
        FETCH_STATUS = true
    })

    var ctx = document.getElementById('myChart-x').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: FILTERED_DATA.map(data => data.Waktu),
            datasets: [{
                label: "Suhu Makanan",
                fill: false,
                borderColor: 'rgb(255, 87, 51)',
                data: FILTERED_DATA.map(data => data.temperature),
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

}

main()
