var db = firebase.database()

var dataTable = null

async function main() {
    let FETCH_STATUS = false
    // let FETCHED_DATA = []
    let index = 1
    await db.ref('/2/xlog/prediction').limitToLast(5000).once('value', function (snapshot) {
        // FETCHED_DATA = []
		
        snapshot.forEach(s => {
            // FETCHED_DATA.push(s.val())
            const {
                Waktu,
                start_temperature,
                duration
				
            } = s.val()

           // if (parameter.node !== 'Node-01') {
             //   return //bawahnya ga dieksekusi
            //}

            const bodyTable = document.getElementById('Prediction')

            const tr = document.createElement('tr')
            const arr = [index, Waktu, start_temperature, duration]
            const tds = []

            arr.map(a => {
                let x = document.createElement('td')

                x.innerText = a
                tds.push(x)
            })

            tds.forEach(td => tr.appendChild(td))

            bodyTable.appendChild(tr)
            index += 1
        })
        dataTable = $('#table_prediction').DataTable({
			"order": [[1, "desc"]]
		});
    })

    db.ref('/2/xlog/prediction').endAt().limitToLast(1).on('child_added', function (snapshot) {
        // biar data terakhir ga kedobel
        if (!FETCH_STATUS) {
            FETCH_STATUS = true
            return
        }

        const {
            Waktu,
		        start_temperature,
            duration
            
        } = snapshot.val()

        //if (parameter.node !== 'Node-01') {
          //  return //bawahnya ga dieksekusi
        //}

        const bodyTable = document.getElementById('Prediction')

        const tr = document.createElement('tr')
        const arr = [index, Waktu, start_temperature, duration]
        const tds = []

        arr.map(a => {
            let x = document.createElement('td')

            x.innerText = a
            tds.push(x)
        })

        tds.forEach(td => tr.appendChild(td))

        // bodyTable.appendChild(tr)
        index += 1
        dataTable.row.add(arr).draw(false)

    })

}

main()
