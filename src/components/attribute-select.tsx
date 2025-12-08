import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import type {ControllerRenderProps} from "react-hook-form";
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";

type AttributeSelectProps = {
    name: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    field: ControllerRenderProps<any, string>;
}


export const AttributeSelect = ({ name, options, field } : AttributeSelectProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="mb-4" asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-44 justify-between mr-5",
                        !field.value && "text-muted-foreground"
                    )}
                >
                    {field.value
                        ? options.find((option) => option.value === field.value)?.label
                        : `Select ${name}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="bottom" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandEmpty>No {name} found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <CommandItem
                                value={option.value}
                                key={option.value}
                                onSelect={() => {
                                    field.onChange(option.value)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        options === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>

    )
}