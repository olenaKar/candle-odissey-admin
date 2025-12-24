import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect} from "react";
// import {useState} from "react";
// import {fetchCandleById} from "@/lib/axios.ts";
// import {columns} from "@/components/product-variants-table-columns-data.tsx";
// import {DataTable} from "@/components/product-variants-table.tsx";

const searchSchema = z.object({
    query: z.string().optional().transform(val => val?.trim() || undefined),
});


interface SearchFormProps {
    onSearch: (query: string) => void
    loading?: boolean
    value: string
}

type SearchFormValues = z.infer<typeof searchSchema>

export const SearchForm= ({ onSearch, loading, value }: SearchFormProps)=> {
    const searchForm = useForm({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: value },
    })

    useEffect(() => {
        searchForm.setValue("query", value)
    }, [value, searchForm])

    const onSubmit = (values: SearchFormValues) => {
        console.log("Search query:", values.query)
        if (values.query) {
            onSearch(values?.query.trim())
        }
    }


    return (
      <div>
          <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(onSubmit)} className="flex justify-end space-y-8">
                  <div className="pr-2">
                      <FormField
                          control={searchForm.control}
                          name="query"
                          render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <Input placeholder="Search" disabled={loading} {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                  <Button type="submit" disabled={loading} className="cursor-pointer mr-2">
                      {loading ? "Searching..." : "Search"}
                  </Button>
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                          searchForm.reset({ query: "" })
                          onSearch("")
                      }}
                      disabled={loading}
                  >
                      Clear
                  </Button>
              </form>
          </Form>

      </div>

  )
}
