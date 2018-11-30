d3.queue()
    .defer(d3.json, "curl_closed.json")
    .defer(d3.json, "wget_closed.json")
    .defer(d3.json, "aria2_closed.json")
    .await(analyze);

const getTurnAroundTime = (toolObjects, mode) => {
    const objectsByMode = mode ? toolObjects.filter(toolObject => toolObject.pull_request) :
                                    toolObjects.filter(toolObject => !toolObject.pull_request);

    const issueTATs = objectsByMode.filter(toolObject => toolObject.state === "closed")
                        .map(issue => new Date(issue.closed_at) - new Date(issue.created_at));

    const tat = issueTATs.reduce((averageTime, currentTime) => averageTime + currentTime, 0) / (issueTATs.length || 1);
    if (tat/3600000 > 2000) return 2000*3600000;
    return tat;
}

const getD3Data = (curlObjects, wgetObjects, aria2Objects, mode) => [
    {
        tool: "Curl",
        value: getTurnAroundTime(curlObjects, mode)/3600000
    },
    {
        tool: "Wget",
        value: getTurnAroundTime(wgetObjects, mode)/3600000
    },
    {
        tool: "Aria2",
        value: getTurnAroundTime(aria2Objects, mode)/3600000
    }
];

const createAxes = (svg, d3Data, height, width, margin) => {
    const chart = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(d3Data.map((s) => s.tool))
    .padding(0.4)
    
    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 2000]);

    const makeYLines = () => d3.axisLeft()
    .scale(yScale)

    chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    chart.append('g')
    .call(d3.axisLeft(yScale));

    chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )
}

const createBars = (svg, d3Data, height, width, margin) => {
    const chart = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(d3Data.map((s) => s.tool))
    .padding(0.4)
    
    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 2000]);

    const barGroups = chart.selectAll()
    .data(d3Data)
    .enter()
    .append('g')

    barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.tool))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a.tool) - 5)
          .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.value)

        line = chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)

        barGroups.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale(a.tool) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.value) + 30)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => (a.value))

      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a.tool))
          .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
      })

    svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Turn-around time (in hours)')

    svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Tools')

    svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Turnaround analysis')

    svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
    .text('Source: GitHub')
}

function analyze(error, curlObjects, wgetObjects, aria2Objects) {
    if (error) {
        console.log(error);
        return;
    }

    let d3Data = getD3Data(curlObjects, wgetObjects, aria2Objects, 0);

    const margin = 80;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    let svg = d3.select('#container1').append("svg");
    createAxes(svg, d3Data, height, width, margin);
    createBars(svg, d3Data, height, width, margin);

    d3Data = getD3Data(curlObjects, wgetObjects, aria2Objects, 1);
    svg = d3.select('#container2').append("svg");
    createAxes(svg, d3Data, height, width, margin);
    createBars(svg, d3Data, height, width, margin);
}