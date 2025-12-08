import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    // CommandEmpty,
    CommandGroup,
    // CommandInput,
    CommandItem,
} from "@/components/ui/command"

import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import supabase from "@/lib/supabase";
import { useRef } from 'react';
import 'ckeditor5/ckeditor5.css';
import SortableImages, {type ImageItem} from "@/components/sort-images.tsx";
import {cn} from "@/lib/utils.ts";
import {type ProductVariantFormValues, getCandleFormSchema} from "@/lib/schemas/candles.ts";
import type {Attribute, Media, Product} from "@/types/candle.ts";
import {toast} from "sonner";
import {
    createProductVariant,
    fetchCategoryAttributes,
    fetchProductsByCategory,
    updateCandle
} from "@/lib/axios.ts";
import {AttributeSelect} from "@/components/attribute-select.tsx";

type Option = {
    label: string
    value: string
}

const getProductOptions = (products: Product[]) => {
    return products.map((product) => ({
        value: product.id.toString(),
        label: product.productContent[0]?.name || "Без названия",
    }));
};

type ProductVariantFormProps = {
    defaultValues?: ProductVariantFormValues & { media: Media[] },
}

export function ProductVariantForm({ defaultValues }: ProductVariantFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [attributes, setAttributes] = useState<Attribute[] | []>([])
    const [products, setProducts] = useState<Product[]>([])
    const [images, setImages] = useState<Array<{ path: string; id: string, altText?: string, meta?: string }>>(
        defaultValues?.media
            ? defaultValues.media.map(m => ({ id: m.id.toString(), path: m.url }))
            : []
    );

    useEffect(() => {
        fetchProductsForm()
        fetchAttributes()
    }, []);
    
    const fetchProductsForm = async () => {
        try {
            const data = await fetchProductsByCategory(1)
            // console.log('API response:', data)
            setProducts(data)
        } catch (e) {
            console.error("Error fetch products", e)
        }
    }

    const fetchAttributes = async () => {
        try {
            const data = await fetchCategoryAttributes({ slug: 'candles' })
            setAttributes(data)
        } catch (e) {
            console.error("Error fetch attributes", e)
        }
    }

    // attributesDefaults должны иметь такую форму:
    //{
    //     "wick": 1,
    //     "size": 4
    // }
    // нам нужна эта переменная 1 раз - чтобы засунуть её в defaultValues для attributes. и нужно
    // засунуть ее в правильном формате ^

    const attributesDefaults: Record<string, number> = {};
    attributes?.forEach(attr => {
        const attrName = attr.name;
        attributesDefaults[attrName] = attr.attributeValues?.[0]?.id;
    });

    const mediaInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
    const formSchema = getCandleFormSchema(Boolean(defaultValues))
    const onImagesSort = (images: ImageItem[]) => {
        setImages(images.map(image => ({path: image.src, id: image.id})))
    }

    const form = useForm<ProductVariantFormValues>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            product: products[0]?.id,
            quantity: 1,
            price: 0,
            images: [],
            // attributes изначально должны иметь правильную форму, а именно - объект такого типа:
            // {
            //     "wick": 2,
            //     "size": 4
            // }
            attributes: attributesDefaults, //@TODO: поставить attributesDefaults сюда вместо объекта
            ...defaultValues
        }
    })
    console.log('attributes ', form.watch('attributes'))
    //     Object.values(form.watch('attributes')))

    const { reset } = form

    useEffect(() => {
        if(defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset]);

    const params = useParams<{id: string, category: string}>()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('values ', values)

        const imagesData = images.map((image, index) => ({
            url: image.path,
            sortOrder: index + 1,
            altText: image.altText ?? '',
            meta: image.meta ?? '',
        }));

        // values.attributes = {
        //     "wick": 1,
        //     "size": 4
        // }

        const payload = {
            quantity: values.quantity,
            price: values.price,
            productId: values.product,
            media: imagesData,
            attributes: Object.values(values.attributes) //@TODO: поменять на реальные
        }

        try {
            await toast.promise(
                Promise.resolve(
                    defaultValues
                        ? await updateCandle(+params.id!, payload)
                        : await createProductVariant(payload)
                ),
                {
                    loading: defaultValues ? "Updating candle..." : "Creating candle...",
                    success: defaultValues
                        ? "Candle updated successfully!"
                        : "Candle created successfully!",
                    error: "Something went wrong!",
                }
            )

            navigate(('/product-variants/candles'))
        } catch (e: any) {
            console.error("Error create candle", e.response?.data ?? e.message ?? e)
        }
    }
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='product'
                    render={({ field }) => (
                        <FormItem className="w-80">
                            <FormLabel>Product</FormLabel>
                            <FormControl>
                                <Popover open={isOpen} onOpenChange={setIsOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={isOpen}
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? getProductOptions(products).find((product: Option) => +product.value === field.value)?.label
                                                : "Select product"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                                        <Command>
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {getProductOptions(products).map((product) => (
                                                    <CommandItem
                                                        value={product.value}
                                                        key={product.value}
                                                        onSelect={() => {
                                                            form.setValue("product", +product.value)
                                                            setIsOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                +product.value === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {product.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    {/*{*/}
                    {/*    Object.values(Languages).map((lang) => (*/}
                    {/*        <Accordion type="single" collapsible className='w-160 border rounded-md'>*/}
                    {/*            <AccordionItem value="item-1">*/}
                    {/*                <AccordionTrigger className="p-2">{lang.toUpperCase()}</AccordionTrigger>*/}
                    {/*                <AccordionContent className="p-2">*/}
                    {/*                    <FormField*/}
                    {/*                        control={form.control}*/}
                    {/*                        name={`content.${lang}.name`}*/}
                    {/*                        render={({ field }) => (*/}
                    {/*                            <FormItem className="pb-4">*/}
                    {/*                                <FormLabel>Name ({lang.toUpperCase()})</FormLabel>*/}
                    {/*                                <FormControl>*/}
                    {/*                                    <Input placeholder="Name" {...field} />*/}
                    {/*                                </FormControl>*/}
                    {/*                                <FormMessage />*/}
                    {/*                            </FormItem>*/}
                    {/*                        )}*/}
                    {/*                    />*/}

                    {/*                    <FormField*/}
                    {/*                        control={form.control}*/}
                    {/*                        name={`content.${lang}.description`}*/}
                    {/*                        render={({ field }) => (*/}
                    {/*                            <FormItem>*/}
                    {/*                                <FormLabel>Description ({lang.toUpperCase()})</FormLabel>*/}
                    {/*                                <FormControl>*/}
                    {/*                                    <CKEditorField field={field}*/}
                    {/*                                    />*/}
                    {/*                                </FormControl>*/}
                    {/*                                <FormMessage />*/}
                    {/*                            </FormItem>*/}
                    {/*                        )}*/}
                    {/*                    />*/}
                    {/*                </AccordionContent>*/}
                    {/*            </AccordionItem>*/}
                    {/*        </Accordion>*/}
                    {/*        )*/}
                    {/*    )*/}
                    {/*}*/}
                <div className='flex'>
                    <FormField
                        control={form.control}
                        name='quantity'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder="Quantity"
                                        className="w-20 mr-5"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            field.onChange(value === '' ? undefined : Number(value))
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder="Price"
                                        className="w-20 mr-5"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            field.onChange(value === '' ? undefined : Number(value))
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex">
                    {attributes && attributes.map(attr => {
                        const name = attr.name;
                        const options = attr.values.map(i => ({label: i.value, value: i.id}));

                        return(
                            <FormField
                                control={form.control}
                                name={`attributes.${name}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{capitalize(name)}</FormLabel>
                                        <FormControl>
                                            <AttributeSelect options={options} name={name} field={field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    })}
                </div>
                {/*<FormField*/}
                {/*    control={form.control}*/}
                {/*    name='aroma'*/}
                {/*    render={({ field }) => (*/}
                {/*        <FormItem className="w-80">*/}
                {/*            <FormLabel>Aroma</FormLabel>*/}
                {/*            <FormControl>*/}
                {/*                <Popover open={openAroma} onOpenChange={setOpenAroma}>*/}
                {/*                    <PopoverTrigger asChild>*/}
                {/*                        <Button*/}
                {/*                            variant="outline"*/}
                {/*                            role="combobox"*/}
                {/*                            aria-expanded={openAroma}*/}
                {/*                            className={cn(*/}
                {/*                                "w-full justify-between",*/}
                {/*                                !field.value && "text-muted-foreground"*/}
                {/*                            )}*/}
                {/*                        >*/}
                {/*                            {field.value*/}
                {/*                                ? getFrameworks(AromaLabels).find((aroma: Option) => aroma.value === field.value)?.label*/}
                {/*                                : "Select aroma"}*/}
                {/*                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />*/}
                {/*                        </Button>*/}
                {/*                    </PopoverTrigger>*/}
                {/*                    <PopoverContent className="w-full p-0" side="bottom" align="start">*/}
                {/*                        <Command>*/}
                {/*                            <CommandInput placeholder="Search aroma..." />*/}
                {/*                            <CommandEmpty>No aroma found.</CommandEmpty>*/}
                {/*                            <CommandGroup className="max-h-60 overflow-y-auto">*/}
                {/*                                {getFrameworks(AromaLabels).map((aroma) => (*/}
                {/*                                    <CommandItem*/}
                {/*                                        value={aroma.label}*/}
                {/*                                        key={aroma.value}*/}
                {/*                                        onSelect={() => {*/}
                {/*                                            form.setValue("aroma", aroma.value)*/}
                {/*                                            setOpenAroma(false)*/}
                {/*                                        }}*/}
                {/*                                    >*/}
                {/*                                        <Check*/}
                {/*                                            className={cn(*/}
                {/*                                                "mr-2 h-4 w-4",*/}
                {/*                                                aroma.value === field.value ? "opacity-100" : "opacity-0"*/}
                {/*                                            )}*/}
                {/*                                        />*/}
                {/*                                        {aroma.label}*/}
                {/*                                    </CommandItem>*/}
                {/*                                ))}*/}
                {/*                            </CommandGroup>*/}
                {/*                        </Command>*/}
                {/*                    </PopoverContent>*/}
                {/*                </Popover>*/}
                {/*            </FormControl>*/}
                {/*            <FormMessage />*/}
                {/*        </FormItem>*/}
                {/*    )}*/}
                {/*/>*/}
                <FormField
                    control={form.control}
                    name='images'
                    render={({ field }) => (
                        <FormItem className="w-160">
                            <FormLabel>Media</FormLabel>
                            <FormControl>
                                <Input
                                    id="picture"
                                    multiple
                                    accept="image/*,video/*"
                                    ref={el => {
                                    mediaInputRef.current = el
                                    field.ref(el)
                                }}
                                    type="file"
                                    onChange={async (e) => {
                                        const mediaFiles = Array.from(e.target.files ?? [])
                                        form.setValue("images", mediaFiles, { shouldValidate: true })
                                        const promises: Promise<{data: {id: string, path: string, fullPath: string}, error: null} | {data: null, error: any}>[] = []
                                        if (mediaFiles) {
                                            Array.from(mediaFiles).forEach((file) => {
                                                const dotIndex = file.name.lastIndexOf(".")
                                                const name = file.name.slice(0, dotIndex)
                                                const extension = file.name.slice(dotIndex + 1)
                                                promises.push(
                                                    supabase
                                                        .storage
                                                        .from('product-variants-images')
                                                        .upload(`public/${name}_${Date.now()}.${extension}`, file, {
                                                            cacheControl: '3600',
                                                            upsert: false
                                                        })
                                                )
                                            })
                                        }
                                        try {
                                            const { data: user } = await supabase.auth.getUser();
                                            console.log(user);

                                            const imagesRes = await Promise.all(promises)

                                            setImages(imagesRes.map(
                                                (item: any ) => ({ path: supabaseUrl + '/storage/v1/object/public/' + item.data?.fullPath,
                                                id: item.data?.id,
                                            })))
                                        } catch (e) {
                                            console.log(e)
                                        }
                                    }}
                                />
                            </FormControl>
                            <p className='text-xs'>Первое фото будет заглавным.</p>
                            <FormMessage />
                            <SortableImages images={images.map(image => ({id: image.id, src: image.path}))} onChange={onImagesSort}/>
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit" className='w-20'>{defaultValues ? 'Save Changes' : 'Create'}</Button>
            </form>
        </Form>
    )
}