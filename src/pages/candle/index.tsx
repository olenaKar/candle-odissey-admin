import {useParams} from "react-router";

const Candle = () => {
    const params = useParams()
    console.log(params)
    return (
        <div>Candle</div>
    )
}

export default Candle