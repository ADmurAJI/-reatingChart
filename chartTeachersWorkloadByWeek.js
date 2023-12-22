// Массив данных
const data = [
    { week: "Неделя №1", load: 45 },
    { week: "Неделя №2", load: 40 },
    { week: "Неделя №3", load: 35 },
    { week: "Неделя №4", load: 80 },
    { week: "Неделя №5", load: 20 },
    { week: "Сейчас", load: 60 },
];

// Функция для определения цвета в зависимости от количества часов
function getColor(load) {
    if (load < 40) {
        return "#213D9D";
    } else if (load >= 40 && load <= 79) {
        return "#3F6FFA";
    } else {
        return "#152247";
    }
}

// Находим контейнер для диаграммы
const chartContainer = d3.select("#chart-teachers-workload-by-week-container");

// Добавляем стили к контейнеру
chartContainer.style("width", "982px")
    .style("height", "343px")
    .style("border-radius", "20px")
    .style("background", "#F5F9FF");

// Размеры диаграммы и отступы
const width = 982;
const height = 240;
const paddingBottom = 56;
const paddingTop = 62;
const paddingBottomExtra = 50;
const marginLeft = 50;

// Создаем SVG элемент внутри контейнера
const svg = chartContainer.append("svg")
    .attr("width", width)
    .attr("height", height + paddingBottom + paddingTop + paddingBottomExtra);

// Создание шкалы для оси X
const paddingLeft = 295;
const paddingRight = 50;
const xScale = d3.scaleBand()
    .domain(data.map(d => d.week))
    .range([paddingLeft, width - paddingRight])
    .padding(0.2);

// Создание шкалы для оси Y
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.load)])
    .range([height, 0]);

// Создание оси X
const xAxis = d3.axisBottom(xScale);

// Создание оси Y
const yAxis = d3.axisLeft(yScale);

// Добавление оси Y
svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft}, ${paddingTop})`)
    //.call(yAxis);

// Массив с исключительными линиями
const specialLineValues = [40, 60, 80];

// Получаем текущие отметки и добавляем значение 90
const yTicks = yScale.ticks().concat(90);

// Добавление горизонтальных линий
yTicks.forEach(tickValue => {
    const isSpecialLine = specialLineValues.includes(tickValue);
    svg.append("line")
        .attr("x1", marginLeft)
        .attr("x2", width - paddingRight)
        .attr("y1", yScale(tickValue) + paddingTop)
        .attr("y2", yScale(tickValue) + paddingTop)
        .attr("stroke", "#152247")
        .attr("stroke-dasharray", isSpecialLine ? "none" : "5,5")
        .attr("stroke-width", 1)
        .attr("opacity", 0.1);
});

// Создание столбцов диаграммы с присвоением цвета
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.week))
    .attr("y", d => yScale(d.load) + paddingTop)
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.load))
    .attr("fill", d => getColor(d.load))
    .on("mouseover", function (d) {
        d3.select(this).attr("fill", "#6e92f3");
    })
    .on("mouseout", function (d) {
        d3.select(this).attr("fill", getColor(d.load));
    })
    .attr("rx", "6");

// Добавление подписей к столбцам сверху (часы)
svg.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", d => xScale(d.week) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.load) + paddingTop - 20)
    .attr("text-anchor", "middle")
    .text(function (d) {
        if (d.load > 40) {
            return d.load + ' часов'
        } else {
            return ''
        }
    })
    .style("fill", "#828282")
    .style("font-size", "12")

// Добавление подписей к столбцам снизу (недели)
svg.selectAll(".text-week")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", d => xScale(d.week) + xScale.bandwidth() / 2)
    .attr("y", height + paddingTop + 20)
    .attr("text-anchor", "middle")
    .text(d => d.week)
    .style("fill", "#828282")
    .style("font-size", "12")

// Массив с данными для надписей
const labelsData = [
    { text: "Критическая нагрузка школы", yValue: 80 },
    { text: "Желаемая нагрузка школы", yValue: 60 },
    { text: "Желаемая нагрузка", yValue: 45 }
];

// Создаем надписей с помощью цикла
labelsData.forEach(labelData => {
    svg.append("text")
        .attr("class", "critical-label")
        .attr("x", marginLeft)
        .attr("y", yScale(labelData.yValue) + paddingTop)
        .attr("text-anchor", "start")
        .text(labelData.text)
        .style("fill", "#828282")
        .style("font-size", "18px");
});
