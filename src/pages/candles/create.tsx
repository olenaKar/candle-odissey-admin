import {CandleForm} from "@/components/candle-form.tsx";

const CandleCreatePage = () => {
    return (
        <div>
            <h1 className='font-medium text-xl pb-8'>Create a new candle</h1>
            <CandleForm/>
        </div>
    )
}

export default CandleCreatePage