import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_iranHigh from "@amcharts/amcharts5-geodata/iranHigh";

const MapChart = ({ volunteerData, setModalData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        wheelY: "zoom",
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_iranHigh,
        valueField: "value",
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      fill: am5.color("#578e7e"),
      stroke: am5.color("#ffffff"),
      strokeWidth: 1,
      interactive: true,
      cursor: "pointer",
    });

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      maxWidth: 200,
      labelText: "{name}",
      direction: "rtl",
      showTooltipOn: "hover",
      animationDuration: 200,
      animationEasing: am5.ease.out(am5.ease.cubic),
    });

    tooltip.label.setAll({
      textAlign: "right",
      fontFamily: "Vazir, Arial, sans-serif",
      fontSize: 14,
      fontWeight: 900,
      fill: am5.color("#fff"),
      maxWidth: 180,
      oversizedBehavior: "wrap",
      lineHeight: am5.percent(130),
    });

    polygonSeries.mapPolygons.template.set("tooltip", tooltip);

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#5A9C4D"),
    });

   
    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      console.log("Click event triggered:", ev);
      console.log("Clicked province data:", ev.target.dataItem.dataContext);
      const data = ev.target.dataItem.dataContext;
      if (data) {
        setModalData(data);
      } else {
        console.error("No province data found in clicked data");
      }
    });

    polygonSeries.mapPolygons.template.events.on("pointerover", (ev) => {
      console.log("Pointer over:", ev.target.dataItem.dataContext);
    });

    polygonSeries.mapPolygons.template.events.on("pointerdown", (ev) => {
      console.log("Pointer down:", ev.target.dataItem.dataContext);
    });

  
    polygonSeries.data.setAll(
      volunteerData.map((item) => {
        const maleData = item.candidates.find((c) => c.gender === "مرد") || {
          unorganized: 0,
        };
        const femaleData = item.candidates.find((c) => c.gender === "زن") || {
          unorganized: 0,
        };
        const maleUnorganized = maleData.unorganized ?? 0;
        const femaleUnorganized = femaleData.unorganized ?? 0;
        const isFullyOrganized =
          maleUnorganized === 0 && femaleUnorganized === 0;
        const isPartiallyOrganized =
          (maleUnorganized === 0 && femaleUnorganized > 0) ||
          (maleUnorganized > 0 && femaleUnorganized === 0);
        return {
          ...item,
          value: isFullyOrganized ? 2 : isPartiallyOrganized ? 1 : 0,
          fill: isFullyOrganized
            ? am5.color("#04364a")
            : isPartiallyOrganized
            ? am5.color("#e55604")
            : am5.color("#578e7e"),
        };
      })
    );

    polygonSeries.events.on("datavalidated", () => {
      console.log("Polygon series data validated");
      polygonSeries.mapPolygons.each((polygon) => {
        const dataItem = polygon.dataItem.dataContext;
        const maleData = dataItem.candidates.find(
          (c) => c.gender === "مرد"
        ) || { unorganized: 0 };
        const femaleData = dataItem.candidates.find(
          (c) => c.gender === "زن"
        ) || { unorganized: 0 };
        const maleUnorganized = maleData.unorganized ?? 0;
        const femaleUnorganized = femaleData.unorganized ?? 0;
        const isFullyOrganized =
          maleUnorganized === 0 && femaleUnorganized === 0;
        const isPartiallyOrganized =
          (maleUnorganized === 0 && femaleUnorganized > 0) ||
          (maleUnorganized > 0 && femaleUnorganized === 0);
        polygon.set(
          "fill",
          isFullyOrganized
            ? am5.color("#578e7e")
            : isPartiallyOrganized
            ? am5.color("#e55604")
            : am5.color("#04364a")
        );
      });
    });

    chart.events.on("datavalidated", () => {
      console.log("Chart data validated");
      chart.goHome();
    });

    chart.events.on("ready", () => {
      console.log("Chart is fully loaded and ready");
    });

    return () => {
      root.dispose();
    };
  }, [volunteerData, setModalData]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapChart;
