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
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {Languages} from "@/constants/global.ts";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Font, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from 'ckeditor5';
import supabase from "@/lib/supabase";
import { useRef } from 'react';
import 'ckeditor5/ckeditor5.css';
import SortableImages, {type ImageItem} from "@/components/sort-images.tsx";
import {cn} from "@/lib/utils.ts";
import {AromaLabels, ColorsLabels, SizeLabels, WickLabels} from "@/constants/candles.ts";
import {type CandleFormValues, getCandleFormSchema} from "@/lib/schemas/candles.ts";
import type {Media} from "@/types/candle.ts";
import {toast} from "sonner";
import {createCandle, updateCandle} from "@/lib/axios.ts";

type Option = {
    label: string
    value: string
}

const getFrameworks = (category: Record<string, string>) => {
    return Object.entries(category).map(([key, value]) => ({
            value: key,
            label: value,
    }))
}

type CandleFormProps = {
    defaultValues?: CandleFormValues & { media: Media[] }
}

type FieldProps = {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
}

function CKEditorField({ field }: { field: FieldProps }) {
    const [editorData, setEditorData] = useState(field.value);

    useEffect(() => {
        setEditorData(field.value);
    }, [field.value]);

    return (
        <CKEditor
            data={editorData}
            editor={ClassicEditor}
            onChange={(_, editor) => {
                const data = editor.getData();
                setEditorData(data);
                field.onChange(data);
            }}
            onBlur={field.onBlur}
            config={{
                licenseKey: 'GPL',
                plugins: [Font, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline, Essentials, Paragraph],
                toolbar: [
                    'undo',
                    'redo',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'code',
                    'subscript',
                    'superscript',
                    '|',
                    'fontSize',
                    'fontFamily',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'formatPainter',
                ],
            }}
        />
    );
}


export function CandleForm({ defaultValues }: CandleFormProps) {
    const [images, setImages] = useState<Array<{ path: string; id: string, altText?: string, meta?: string }>>(
        defaultValues?.media
            ? defaultValues.media.map(m => ({ id: m.id.toString(), path: m.url }))
            : []
    );

    const mediaInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
    const formSchema = getCandleFormSchema(Boolean(defaultValues))

    const onImagesSort = (images: ImageItem[]) => {
        setImages(images.map(image => ({path: image.src, id: image.id})))
    }

    const form = useForm<CandleFormValues>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            content: {
                en: { name: "", description: "" },
                ru: { name: "", description: "" },
                ua: { name: "", description: "" },
            },
            quantity: 1,
            price: 0,
            images: [],
            aroma: "",
            color: "",
            wick: "",
            size: "",
            ...defaultValues
        }
    })

    const { reset } = form

    useEffect(() => {
        if(defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset]);


    const params = useParams()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const imagesData = images.map((image, index) => ({
            url: image.path,
            sortOrder: index + 1,
            altText: image.altText ?? '',
            meta: image.meta ?? '',
        }));

        const candleData = {...values, media: imagesData}

        try {
            await toast.promise(
                defaultValues
                    ? updateCandle(params.id as string, candleData)
                    : createCandle(candleData),
                {
                    loading: defaultValues ? "Updating candle..." : "Creating candle...",
                    success: defaultValues
                        ? "Candle updated successfully!"
                        : "Candle created successfully!",
                    error: "Something went wrong!",
                }
            )

            navigate(('/candles'))
        } catch (e: any) {
            console.error("Error create candle", e.response?.data ?? e.message ?? e)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {
                        Object.values(Languages).map((lang) => (
                            <Accordion type="single" collapsible className='w-160 border rounded-md'>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-2">{lang.toUpperCase()}</AccordionTrigger>
                                    <AccordionContent className="p-2">
                                        <FormField
                                            control={form.control}
                                            name={`content.${lang}.name`}
                                            render={({ field }) => (
                                                <FormItem className="pb-4">
                                                    <FormLabel>Name ({lang.toUpperCase()})</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`content.${lang}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description ({lang.toUpperCase()})</FormLabel>
                                                    <FormControl>
                                                        <CKEditorField field={field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            )
                        )
                    }

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
                    <FormField
                        control={form.control}
                        name='size'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? getFrameworks(SizeLabels).find((size: Option) => size.value === field.value)?.label
                                                    : "Select size"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" side="bottom" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search size..." />
                                                <CommandEmpty>No size found.</CommandEmpty>
                                                <CommandGroup className="max-h-60 overflow-y-auto">
                                                    {getFrameworks(SizeLabels).map((size) => (
                                                        <CommandItem
                                                            value={size.label}
                                                            key={size.value}
                                                            onSelect={() => {
                                                                form.setValue("size", size.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    size.value === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {size.label}
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
                </div>

                <FormField
                    control={form.control}
                    name='aroma'
                    render={({ field }) => (
                        <FormItem className="w-80">
                            <FormLabel>Aroma</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? getFrameworks(AromaLabels).find((aroma: Option) => aroma.value === field.value)?.label
                                                : "Select aroma"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search aroma..." />
                                            <CommandEmpty>No aroma found.</CommandEmpty>
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {getFrameworks(AromaLabels).map((aroma) => (
                                                    <CommandItem
                                                        value={aroma.label}
                                                        key={aroma.value}
                                                        onSelect={() => {
                                                            form.setValue("aroma", aroma.value)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                aroma.value === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {aroma.label}
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
                <FormField
                    control={form.control}
                    name='wick'
                    render={({ field }) => (
                        <FormItem className="w-80">
                            <FormLabel>Wick</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? getFrameworks(WickLabels).find((wick: Option) => wick.value === field.value)?.label
                                                : "Select wick"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search wick..." />
                                            <CommandEmpty>No wick found.</CommandEmpty>
                                            <CommandGroup>
                                                {getFrameworks(WickLabels).map((wick) => (
                                                    <CommandItem
                                                        value={wick.label}
                                                        key={wick.value}
                                                        onSelect={() => {
                                                            form.setValue("wick", wick.value)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                wick.value === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {wick.label}
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
                <FormField
                    control={form.control}
                    name='color'
                    render={({ field }) => (
                        <FormItem className="w-80">
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? getFrameworks(ColorsLabels).find((color: Option) => color.value === field.value)?.label
                                                : "Select color"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search color..." />
                                            <CommandEmpty>No color found.</CommandEmpty>
                                            <CommandGroup>
                                                {getFrameworks(ColorsLabels).map((color) => (
                                                    <CommandItem
                                                        value={color.label}
                                                        key={color.value}
                                                        onSelect={() => {
                                                            form.setValue("color", color.value)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                color.value === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {color.label}
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
                                                        .from('candles-images')
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