import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import styled from "styled-components";

function App() {
  const lineChartElement = useRef(null);
  const [chartData, setChartData] = useState([]);

  const getChartData = useCallback(async () => {
    const data = await fetch(
      "https://motionz-kr.github.io/playground/apis/report.json"
    );
    const parsedData = await data.json();
    const result = parsedData.data;
    console.log(result);
    setChartData(result);
  }, []);

  const createLineSvg = useCallback(() => {
    const cw = lineChartElement.current.clientWidth;
    const cy = lineChartElement.current.clientHeight;
    const phraseSize = Math.floor(cw / (chartData.length + 1));
    const svgElement = [];
    const spanElement = [];
    for (let i = 0; i < chartData.length; i++) {
      if (i + 1 >= chartData.length) {
        svgElement.push(
          <Fragment key={i}>
            <circle
              cx={phraseSize * (i + 1)}
              cy={cy - chartData[i].cycle}
              r="4.5"
              fill="#222"
            ></circle>
          </Fragment>
        );
        spanElement.push(
          <ChartLabel
            type="line"
            top={cy - chartData[i].cycle - 30}
            left={phraseSize * (i + 1) - 10}
            isRed={chartData[i].cycle >= 100}
          >{`${chartData[i].cycle}일`}</ChartLabel>
        );
        break;
      }
      svgElement.push(
        <Fragment key={i}>
          <line
            key={i}
            x1={phraseSize * (i + 1)}
            y1={cy - chartData[i].cycle}
            x2={phraseSize * (i + 2)}
            y2={cy - chartData[i + 1].cycle}
            stroke="#222"
            strokeWidth="2"
          ></line>
          <circle
            cx={phraseSize * (i + 1)}
            cy={cy - chartData[i].cycle}
            r="4.5"
            fill="#222"
          ></circle>
        </Fragment>
      );

      spanElement.push(
        <ChartLabel
          type="line"
          top={cy - chartData[i].cycle - 30}
          left={phraseSize * (i + 1) - 10}
          isRed={chartData[i].cycle >= 100}
        >{`${chartData[i].cycle}일`}</ChartLabel>
      );
    }

    return (
      <>
        {spanElement}
        <svg width={cw} height={cy}>
          {svgElement}
        </svg>
      </>
    );
  }, [chartData]);

  const createBarChart = useCallback(() => {
    const barChartElement = [];
    const maxPeriod = Math.max(...chartData.map((data) => data.period));
    console.log(maxPeriod);
    for (let i = 0; i < chartData.length; i++) {
      const date = chartData[i].startDate.split("-").slice(1).join("/");
      const currentPeriod = chartData[i].period;
      barChartElement.push(
        <BarWrapper>
          <ChartLabel>{`${currentPeriod}일`}</ChartLabel>
          <Bar barHeight={Math.floor((currentPeriod / maxPeriod) * 100)} />
          <DateSpan>{date}</DateSpan>
        </BarWrapper>
      );
    }

    return barChartElement;
  }, [chartData]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);
  useEffect(() => {
    // console.log("hi", chartData);
  }, [chartData]);
  return (
    <Main>
      <h2 className="title">User Report</h2>
      <Canvas>
        <CanvasHeader>
          <div>
            <div className="dot" />
            <span>활동 주기</span>
          </div>
          <div>
            <div className="bar" />
            <span>활동 기간, 시작일</span>
          </div>
        </CanvasHeader>
        <LineTable ref={lineChartElement}>
          {lineChartElement && lineChartElement.current && createLineSvg()}
        </LineTable>
        <BarTable
          $maxWidth={
            lineChartElement &&
            lineChartElement.current &&
            lineChartElement.current.clientWidth
          }
        >
          {createBarChart()}
        </BarTable>
      </Canvas>
    </Main>
  );
}

export default App;

const Main = styled.div`
  padding: 20px;

  .title {
    font-size: 23px;
    font-weight: bold;
    margin: 23px 0px;
  }
`;

const Canvas = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
`;

const CanvasHeader = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;

  div {
    display: flex;
    align-items: center;
  }

  .dot {
    width: 7px;
    height: 7px;
    background-color: black;
    border-radius: 50%;
  }

  .bar {
    width: 20px;
    height: 7px;
    background-color: black;
    border-radius: 14px;
  }

  span {
    font-size: 10px;
    margin: 0px 15px 0px 5px;
    color: #666;
  }
`;
const LineTable = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 180px;
  margin-top: 7px;
  box-sizing: border-box;
`;
const BarTable = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 75px;
  box-sizing: border-box;
  width: 100%;
  height: 180px;
  margin-top: 7px;
`;

const DateSpan = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgb(105, 104, 104);
  margin: 10px 0px 12px 0px;
`;

const BarWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  align-items: center;
`;

const Bar = styled.div`
  border-radius: 10px;
  height: ${({ barHeight }) => `${barHeight}px;`};
  width: 30px;
  margin-top: 7px;
  background-color: rgb(51, 51, 51);
`;

const ChartLabel = styled.span`
  ${({ type, top, left }) => {
    if (type === "line") {
      return `
      position: absolute;
  top: ${top}px;
  left: ${left}px;
      `;
    } else {
      return "";
    }
  }}
  font-weight: bold;
  font-size: 12px;
  color: ${({ isRed }) => (isRed ? `rgb(255,117,102)` : "black")};
`;
