"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/category.action";
import { ICategory } from "@/lib/database/model/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const CategoryFilter = () => {

    const [categories, setCategories] = useState<ICategory[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const getCategories = async () => {
          const categoryList = await getAllCategories();
    
          categoryList && setCategories(categoryList as ICategory[])
        }
    
        getCategories();
      }, [])

      const onSelectCategory = (category: string) => {
        let newUrl = '';
  
        if(category && category !== 'All') {
          newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'category',
            value: category
          })
        } else {
          newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['category']
          })
        }
  
        router.push(newUrl, { scroll: false });
    }

  return (
    <Select  onValueChange={(value: string) => onSelectCategory(value)}>
    <SelectTrigger className="select-field">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>
    
    {
        categories && categories?.map((item,i) => (
            <SelectItem
            className="select-item p-regular-14"
            key={item._id} value={item.name}>{item.name}</SelectItem>
        ))
    }
       
  
    </SelectContent>
  </Select>
  )
}

export default CategoryFilter