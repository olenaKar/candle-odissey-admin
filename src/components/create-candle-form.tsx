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
import { Input } from "@/components/ui/input"
import {useState} from "react";
// import axios from "axios";
// import {useNavigate} from "react-router";
import {Languages} from "@/constants/global.ts";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Font, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from 'ckeditor5';
import supabase from "@/lib/supabase";
import { useRef } from 'react';
// import { PointerSensor, useSensor, useSensors} from '@dnd-kit/core';



import 'ckeditor5/ckeditor5.css';
import SortableImages, {type ImageItem} from "@/components/sort-images.tsx";

type CandleFormValues = z.infer<typeof formSchema>

const formSchema = z.object({
    content: z.object({
        en: z.object({
            name: z.string().min(2, "Name must be at least 2 characters."),
            description: z.string().min(2, "Description must be at least 10 characters."),
        }),
        ru: z.object({
            name: z.string().min(2, "Имя должно иметь 2 или более символов."),
            description: z.string().min(2, "Описание должно иметь 10 или более символов."),
        }),
        ua: z.object({
            name: z.string().min(2, "Назва має містити 2 або більше символів."),
            description: z.string().min(2, "Опис має містити 10 або більше символів."),
        })
    }),
    images: z.array(z.file()),
    quantity: z.number().min(1),
    price: z.number().min(0),
    aroma: z.string().min(2, "Aroma is required."),
    color: z.string().min(2, "Color is required."),
})

export function CreateCandleForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<Array<{ path: string, id: string }>>([])
    const mediaInputRef = useRef<HTMLInputElement>(null)
    // const navigate = useNavigate()

    const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL

    const onImagesSort = (images: ImageItem[]) => {
        setImages(images.map(image => ({path: image.src, id: image.id})))
    }

    const form = useForm<CandleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: {
                en: { name: "", description: "" },
                ru: { name: "", description: "" },
                ua: { name: "", description: "" },
            },
            quantity: 1,
            price: 0,
            images: [],
            aroma: 'Vanilla',
            color:
        }
    })

    console.log(images)
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        const imagesData = values.images.map((image, index) => ({...image, sortOrder: index + 1}))
        console.log('values', values)
        try {
            // await axios.post('/api/candles', {
            //     content: {
            //         en: {
            //             name: values.content.en.name,
            //             description: values.content.en.description
            //         },
            //         ru: {
            //             name: values.content.ru.name,
            //             description: values.content.ru.description
            //         },
            //         ua: {
            //             name: values.content.ua.name,
            //             description: values.content.ua.description
            //         },
            //     },
            //     quantity: values.quantity,
            //     price: values.price,
            //        media: imagesData,
            //     // aroma: values.aroma,
            //     // color,
            //     // wick,
            //     //size,
            // })
            // navigate(('/candles'))
        } catch (e) {
            console.error("Error create candle", e)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {
                    Object.values(Languages).map((lang) => (
                        <>
                            <FormField
                                control={form.control}
                                name={`content.${lang}.name`}
                                render={({ field }) => (
                                    <FormItem>
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
                                            <CKEditor
                                                data={field.value}
                                                editor={ ClassicEditor }
                                                onChange={(_, editor) => {
                                                    field.onChange(editor.getData());
                                                }}
                                                config={ {
                                                    licenseKey: 'GPL', // Or 'GPL'.
                                                    plugins: [ Font, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline, Essentials, Paragraph ],
                                                    toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'formatPainter' ],
                                                    initialData: '<p>Hello from CKEditor 5 in React!</p>',
                                                } }
                                                onBlur={field.onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                        )
                    )
                }
                <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input placeholder="Описание" {...field} />
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
                                <Input placeholder="Описание" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='aroma'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Aroma</FormLabel>
                            <FormControl>
                                <Input placeholder="Aroma" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='color'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input placeholder="Color" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='images'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Media</FormLabel>
                            <FormControl>
                                <Input
                                    id="picture"
                                    multiple
                                    ref={el => {
                                    mediaInputRef.current = el
                                    field.ref(el)
                                }}
                                    type="file"
                                    onChange={async (e) => {
                                        const mediaFiles = e.target.files
                                        if (mediaFiles) field.onChange(mediaFiles)
                                        console.log(mediaFiles)
                                        const promises: Promise<{data: {id: string, path: string, fullPath: string}, error: null} | {data: null, error: any}>[] = []

                                        if (mediaFiles) {
                                            Array.from(mediaFiles).forEach((file) => {
                                                promises.push(
                                                    supabase
                                                        .storage
                                                        .from('candles-images')
                                                        .upload(`public/${file.name}`, file, {
                                                            cacheControl: '3600',
                                                            upsert: false
                                                        })
                                                )
                                            })
                                        }
                                        try {
                                            const imagesRes = await Promise.all(promises)
                                            setImages(imagesRes.map(
                                                (item: any ) => ({ path: supabaseUrl + '/storage/v1/object/public/' +item.data?.fullPath,
                                                id: item.data?.id,
                                            })))
                                        } catch (e) {
                                            console.log(e)
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            <SortableImages images={images.map(image => ({id: image.id, src: image.path}))} onChange={onImagesSort}/>
                        </FormItem>
                    )}
                />

                <Button disabled={form.formState.isSubmitting} type="submit">{isLoading ? 'Loading...' : 'Create'}</Button>
            </form>
        </Form>
    )
}