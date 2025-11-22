import {type FC, useEffect, useState} from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {
    Bold,
    ClassicEditor,
    Code,
    Essentials,
    Font,
    Italic, Paragraph,
    Strikethrough,
    Subscript,
    Superscript,
    Underline
} from "ckeditor5";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {useNavigate} from "react-router";
import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {ProductFormValues} from "@/constants/products.ts";
import {Languages} from "@/constants/global.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {Input} from "@/components/ui/input.tsx";
import {toast} from "sonner";
import {createProduct} from "@/lib/axios.ts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Check, ChevronsUpDown} from "lucide-react";
import type {Category} from "@/types/candle.ts";


type FieldProps = {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
}

type Option = {
    label: string
    value: string
}

const getFrameworks = (categories: Category[]): Option[] => {
    return categories.map((category) => ({
        value: category.id.toString(),
        label: category.name,
    }));
};

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

type ProductFormProps = {
    categories: Category[]
}

const ProductForm: FC<ProductFormProps> = ({ categories }) => {
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()
    const formSchema = z.object({
        category: z.number(),
        content: z.object({
            en: z.object({
                name: z.string().min(1, "Name is required"),
                description: z.string().min(1, "Description is required"),
            }),
            ru: z.object({
                name: z.string().min(1, "Name is required"),
                description: z.string().min(1, "Description is required"),
            }),
            ua: z.object({
                name: z.string().min(1, "Name is required"),
                description: z.string().min(1, "Description is required"),
            }),
        }),
    });

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            category: categories[0]?.id,
            content: {
                en: { name: "", description: "" },
                ru: { name: "", description: "" },
                ua: { name: "", description: "" },
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)

        try {
            await toast.promise(Promise.resolve(await createProduct({ categoryId: values.category, content: values.content})),
                {
                    loading: "Creating product...",
                    success: "Product created successfully!",
                    error: "Something went wrong!",
                }
            );

            navigate(('/products'))
        } catch (e: any) {
            console.error("Error create product", e.response?.data ?? e.message ?? e)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                        <FormItem className="w-80">
                            <FormLabel>Category</FormLabel>
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
                                                ? getFrameworks(categories).find((category: Option) => +category.value === field.value)?.label
                                                : "Select category"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                                        <Command>
                                            {/*<CommandInput placeholder="Search category..." />*/}
                                            {/*<CommandEmpty>No category found.</CommandEmpty>*/}
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {getFrameworks(categories).map((category) => (
                                                    <CommandItem
                                                        value={category.value}
                                                        key={category.value}
                                                        onSelect={() => {
                                                            form.setValue("category", +category.value)
                                                            setIsOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                +category.value === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {category.label}
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
                <Button disabled={form.formState.isSubmitting} type="submit" className='w-20'>Create</Button>
            </form>
        </Form>
    )
}

export default ProductForm