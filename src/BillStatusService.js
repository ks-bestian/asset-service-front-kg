import { useStore } from "@/store";

let defaultColors = [
    "#36A2EB", "#FF6384", "#FFCD56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
    "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#3B3EAC", "#0099C6",
    "#DD4477", "#66AA00", "#B82E2E", "#316395", "#994499", "#22AA99", "#AAAA11",
    "#6633CC", "#E67300", "#8B0707", "#329262", "#5574A6", "#651067"
];

export const BillStatusService = {

    async getChartData(statisticsKind, ppslDtFrom, ppslDtTo) {

        const store = useStore();
        const params = {statisticsKind, ppslDtFrom, ppslDtTo};
        const stat = await store.API_LIST('/bill/search/statistics', params)
            .then(res => res.data.data);

        let name;
        if(statisticsKind === 'poly') {
            name = 'polyNm';
        }
        else if(statisticsKind === 'cmt') {
            name = 'cmtNm';
        }
        else if(statisticsKind === 'ppslKnd') {
            name = 'ppslKndNm';
        }
        const ret = {
            labels: stat.map(item => item[name]),
            datasets: [
                {
                    data: stat.map(item => item.cnt),
                    backgroundColor: [],
                }
            ]
        };

        const dataset = ret.datasets[0];
        for(var i = 0; i < dataset.data.length; ++i) {
            dataset.backgroundColor.push(defaultColors[i]);
        }

        return ret;


        // if(chartKind === 'poly') {
        //     return this.getChartDataPoly();
        // }
        // else if(chartKind === 'cmt') {
        //     return this.getChartDataCmt();
        // }
        // else if(chartKind === 'ppslKnd') {
        //     return this.getChartDataPpslKnd();
        // }

    },

    getChartDataPpslKnd() {
        const ret = {
            labels: ['Депутат', '10073', '10286'],
            datasets: [
                {
                    data: [190, 120, 90],
                    backgroundColor: [],
                }
            ]
        };

        const dataset = ret.datasets[0];
        for(var i = 0; i < dataset.data.length; ++i) {
            dataset.backgroundColor.push(defaultColors[i]);
        }

        return ret;
    },

    getChartDataPoly() {
        const ret = {
            labels: ['Ата-Журт Кыргызстан', 'Ишеним', 'Ынтымак', 'Мекенчил', 'Ыйман Нуру', 'Альянс', 'Элдик депутаттык тобу'],
            datasets: [
                {
                    data: [19, 12, 9, 14, 5, 8, 9],
                    backgroundColor: [],
                }
            ]
        };

        const dataset = ret.datasets[0];
        for(var i = 0; i < dataset.data.length; ++i) {
            dataset.backgroundColor.push(defaultColors[i]);
        }

        return ret;
    },

    getChartDataCmt() {
        const ret = {
            labels: ['Комитет по международным делам, обороне, безопасности и миграции', 
                     'Комитет по топливно-энергетическому комплексу, недропользованию и промышленной политике', 
                     'Комитет по конституционному законодательству, государственному устройству, судебно-правовым вопросам и Регламенту Жогорку Кенеша КР', 
                     'Комитет по аграрной политике, водным ресурсам, экологии и региональному развитию', 
                     'Комитет по правопорядку, борьбе с преступностью и противодействию коррупции', 
                     'Комитет по бюджету, экономической и фискальной политике', 
                     'Комитет по социальной политике',
                     'Комитет по транспорту, коммуникациям, архитектуре и строительству'],
            datasets: [
                {
                    data: [19, 12, 9, 14, 5, 8, 9, 11],
                    backgroundColor: [],
                }
            ]
        };

        const dataset = ret.datasets[0];
        for(var i = 0; i < dataset.data.length; ++i) {
            dataset.backgroundColor.push(defaultColors[i]);
        }

        return ret;
    },

    getPieChartOptions() {
        return {
            // Animation: False,

            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 150,
                    top: 50,
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        textAlign: 'left',
                    },
                },
            },
        };
    },

    getBarChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    // right: 150,

                    top: 50,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            barPercentage: 0.5,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                }
            }
        };
    },

    autoWrapLabels(labels, maxWidth) {
        return labels.map(label => {
            // If the label is not a string, or if the length is shorter than the maximum, it is returned as it is

            if (typeof label !== 'string' || label.length <= maxWidth) {
                return label;
            }

            const words = label.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                // If you add words to the current line, if you exceed the maximum length, confirm the current line and start a new line

                if ((currentLine + ' ' + word).trim().length > maxWidth) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }
                currentLine += word + ' ';
            });
            // Last line addition

            lines.push(currentLine.trim());

            // Remove the array elements with only a gap and return the final

            return lines.filter(line => line.length > 0);
        });
    }

};
