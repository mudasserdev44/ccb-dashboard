// CanadaMap.jsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

export default function CanadaMap({ width = 900, height = 600 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const world = await d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      );

      const countriesFC = topojson.feature(world, world.objects.countries);

      const canada = countriesFC.features.find(
        (f) => String(f.id) === "124" || f.properties && f.properties.iso_a3 === "CAN"
      );

      if (!canada) {
        console.error("Canada feature not found in world-atlas!");
        return;
      }
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const projection = d3.geoMercator().fitSize([width, height], canada);
      const path = d3.geoPath().projection(projection);

      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .append("g")
        .append("path")
        .datum(canada)
        .attr("d", path)
        .attr("fill", "#cfe8df")
        .attr("stroke", "#2b6a4f")
        .attr("stroke-width", 0.7);
    }

    draw();

    return () => {
      cancelled = true;
    };
  }, [width, height]);

  return <svg ref={svgRef} />;
}
