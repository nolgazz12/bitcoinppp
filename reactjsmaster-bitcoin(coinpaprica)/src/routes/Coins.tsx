import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"
import { fetchCoins } from "../api"
import { isDarkAtom } from "../atoms"

import Search from "../svg/search.svg"

const Title = styled.h1`
    font-size: 48px;
    color: ${props => props.theme.accentColor};
`
const Container = styled.div`
    padding: 0px 20px;
    max-width : 480px;
    margin : 0 auto;
`
// 위아래 0 좌우 20px 패딩줌

const Header = styled.header`
    margin-top: 5vh;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const CoinList = styled.ul`

`
const Coin = styled.li`
    background-color: white;
    color : ${props => props.theme.textColor};
    margin-bottom: 20px;
    a{
        display: flex;
        align-items: center;
        padding: 10px;
        transition: color 0.3s ease-in;
    }
    &:hover {
        a{
            color : ${(props) => props.theme.accentColor}
        }
    }
`

const Loader = styled.span`
    text-align: center;
    display: block;
`

interface Icoin {
    id : string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
}

const Img = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 10px;
`

const SeachInput = styled.input`
    display: block;
    border: none;
    font-size: 16px;
    color: #212529;
    height: 5vh;
    margin-top : 1vh;
    margin-bottom: 5vh;
`




interface ICoinsProps {
}

interface SearchProps {
    field : string;
    value: string[];
    text : string;
    coin: string;
    results: string[];
    keyword : string;
}

function Coins({} :ICoinsProps) {
    const setterFn = useSetRecoilState(isDarkAtom)
    const { isLoading, data } = useQuery<Icoin[]>("allCoins" , fetchCoins)
    const toggleDarkAtom = () => setterFn((prev) => !prev)
    const coinsArr =  data?.map((v) => v).slice(0,100)

    const [keyword, setKeyword] = useState<SearchProps>();
    const [results, setResult] = useState<SearchProps[]>([]);
    
    const updateField = ({field, value, update = true}:<SearchProps>) => {
        if (update) onSearch(value);
        if (field === 'keyword') {
        setKeyword(value);
        }
        if (field === 'results') {
        setResult(value);
        }
    }

    const onSearch = (text: <SearchProps>) => {
        let results = coinsArr.filter(item => true === matchName(item.name, coinsArr));
        setResult(results);
    };

    const matchName = ({name, keyword}:<SearchProps>) => {
        var keyLen = keyword.length;
        name = name.toLowerCase().substring(0, keyLen);
        if (keyword === "") return false;
        return name === keyword.toString().toLowerCase();
    };

    console.log(coinsArr)
    return (
        <Container>
            <Helmet>
                <title>
                코인
                </title> 
            </Helmet>
            <Header>
                <Title style={{}}>코인마켓</Title>
                <div>
                {/* <SearchBar keyword={keyword} results={results} updateField={updateField}></SearchBar> */}
                </div>
            </Header>
            
            {isLoading ? (<Loader>loading</Loader>) : (<CoinList>
            {data?.slice(0,100).map((coin) =>
                <Coin key={coin.id}>
                <Link to={{
                pathname : `/${coin.id}`,
                state : { name : coin.name}
                }}>
                <Img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLocaleLowerCase()}`} />
                {coin.name} &rarr;</Link>
                </Coin>
            )}
            </CoinList>
            )}
        </Container>
        )
}

export default Coins







