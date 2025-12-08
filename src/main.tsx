import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Candles from "./pages/product-variants";
import ProductVariantCreatePage from "@/pages/product-variants/create.tsx";
import ProductVariantEditPage from "@/pages/product-variants/edit.tsx";
import {Toaster} from "sonner";
import CreateProduct from "@/pages/products/create.tsx";
import Products from "@/pages/products";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="/products">
                    <Route path="new" element={<CreateProduct />} />
                    <Route index element={<Products />} />
                </Route>
                <Route path="/product-variants/:category">
                    <Route index element={<Candles />} />
                    <Route path="new" element={<ProductVariantCreatePage />} />
                    <Route path="edit/:id" element={<ProductVariantEditPage />} />
                </Route>
            </Route>
        </Routes>
        <Toaster position="top-right" richColors />
    </BrowserRouter>,
)
