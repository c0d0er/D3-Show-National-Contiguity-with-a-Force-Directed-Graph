class ForceGraph extends React.Component{
  componentDidMount() {
    d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',(data)=>{
      let nodes=data.nodes;
      let links=data.links;
      let w=window.innerWidth;
      let h=window.innerHeight;

      console.log(nodes)
      let svg=d3.select('.forcegraph')
                .append('svg')
                .attr('width',w)
                .attr('height', h);


      let forceG = d3.forceSimulation(nodes)
                     .force('link', d3.forceLink().links(links).strength(2.2))
                     .force('charge', d3.forceManyBody().strength(-0.5))
                     .force('center', d3.forceCenter(w/2, h/2))
                     .force('collide', d3.forceCollide(20))
                     .on('tick', ticked);

      let link = svg
                    //.append('g')
                    .selectAll('.links')
                    .data(links)
                    .enter()
                    .append('line')
                    .attr('class', 'link');

      let node = d3//.select('.forcegraph')
                   .select('.flags')
                   //.selectAll('.node')
                   // svg.append('g')
                    //.selectAll('circle')
                    .selectAll('img')
                    .data(nodes)
                    .enter()
                    .append('img')
                    //.append('circle')
                    //.attr('r', 8)
                    .attr('class',d=>'flag flag-'+d.code)
                    //.attr('class', 'node')//disturb firing the image!!!
                    .call(d3.drag()
                            .on('start', dragstarted)
                            .on('drag', dragged)
                            .on('end', dragended)
                            );
  /*var linkedByIndex = {};
    links.forEach(function(d) {

        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    
    
    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
    }
    
    node.on("mouseover", function(d){
        node.classed("node-connected", function(o) {
            return isConnected(d, o) ? true : false;
        });

        link.classed("link-active", function(o) {
            return o.source === d || o.target === d ? true : false;
        });

        d3.select(this).classed('node-active', true);
    }).on("mouseout", function(d){                
        node.attr('class', 'node')
        link.classed("link-active", false);
    });*/
      

          function ticked() {
      link.attr("x1", (d) => d.source.x )
          .attr("y1", (d) => d.source.y )
          .attr("x2", (d) => d.target.x )
          .attr("y2", (d) => d.target.y );
      node.style("left", (d) => d.x +'px')
          .style("top", (d) => d.y+'px' );
      //node.style('left', d => (d.x - 16) + "px")
      //.style('top', d => (d.y - 16) + "px");
    }
  


   function dragstarted(d) {
        if (!d3.event.active) { 
            forceG.alphaTarget(0.3)//0.3
                .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) {
            forceG.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }

    })
  }

  render (){
    return (
      <div className='forcegraph'>
        <div className='flags'>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<ForceGraph/>,
  document.getElementById('app'));
