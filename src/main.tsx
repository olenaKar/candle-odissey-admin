import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Candles from "./pages/candles";
import Candle from "./pages/candle";
import CandleCreatePage from "@/pages/candles/create.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="/candles">
                    <Route index element={<Candles />} />
                    <Route path="/candles/new" element={<CandleCreatePage />} />
                    <Route path=":id" element={<Candle />} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>,
)
