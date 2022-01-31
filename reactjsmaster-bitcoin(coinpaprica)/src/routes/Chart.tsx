import { useQuery } from "react-query"
import { fetchCoinHistory } from "../api"
import ApexChart from 'react-apexcharts'
import { useRecoilValue } from "recoil"
import { isDarkAtom } from "../atoms"
interface IHIStorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface ChartProps {
    coinId : string;
}

function Chart ({coinId}:ChartProps) {
    const isDark = useRecoilValue(isDarkAtom)
    const {isLoading, data} = useQuery<IHIStorical[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId))
    return (
        //날짜로 만들기
        <div>
            {isLoading ? "Loading chart..." : <ApexChart type="line" 
            series={[
                {
                    name : "open",
                    data: data?.map(price => price.open)
                },
                {
                    name : "high",
                    data: data?.map(price => price.high)
                },
                {
                    name : "low",
                    data: data?.map(price => price.low)
                },
                {
                    name : "close_pirce",
                    data: data?.map(price => price.close)
                },
            ]}
            options={{
                theme : {
                    mode : isDark ? "dark" : "light"
                },
                chart: {
                    height : 500,
                    width : 500,
                    toolbar: {
                        show : false,
                    },
                    background: "transparent",
                },
                grid : {
                    show: false,
                },
                yaxis: {
                    tickAmount: 3,
                },
                stroke : {
                    curve : "smooth",
                    width : 4,
                },
                // fill : {
                //     type : "gradient",
                //     gradient : { gradientToColors : ["blue"] }
                // },
                // colors : ["white"],
                xaxis : {
                    type : "datetime",
                    categories : data?.map(price => price.time_close)
                },
                tooltip : {
                    y : {
                        formatter : (value) => `$${value.toFixed(3)}` 
                    }
                }
            }}/>}
        </div>   
            )
}
export default Chart