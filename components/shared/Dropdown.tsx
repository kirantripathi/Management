import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ICategory } from "@/lib/database/model/category.model"
import { startTransition, useState,useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { createCategory, getAllCategories } from "@/lib/actions/category.action"

type DropDownProps = {
    value?:string,
    onChangeHandler?:(value:string) => void
}


const Dropdown = ({value,onChangeHandler}:DropDownProps) => {

    const [categories,setCategories] = useState<ICategory[]>([]);
    const [newCategory,setNewCategory] = useState<string>("");


    useEffect(() => {
        getAllCategories().then((res) => {
          console.log(res,"See res now")
          res && setCategories(res as ICategory[]);
        })
    },[])



    const handleAddCategory = () => {
      createCategory({categoryName:newCategory.trim()}).then((category) => {
       setCategories((prevState) => [...prevState,category])
        console.log(category,"See the added info")
      })
      .catch((err) => {
        console.log(err,"Seee error while making category")
      })
    }

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
    <SelectTrigger className="select-field">
      <SelectValue placeholder="Cateogry" />
    </SelectTrigger>
    <SelectContent>
 {
    categories.length > 0 && categories.map((item) => (
        <SelectItem key={item?._id} value={item?._id}
        className="select-item p-regular-14"
        >{item?.name}</SelectItem>
    ))
 }
     <AlertDialog>
        <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add new Category
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
            <AlertDialogTitle>New Category</AlertDialogTitle>
            <AlertDialogDescription>
                <Input 
                onChange={e=>setNewCategory(e.target.value)}
                type="text" placeholder="Category name" className="input-field mt-3" />
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction

// By wrapping a portion of your code in startTransition, you indicate to React that updates within that section are less critical
// and it can be deferred if necessary. This helps prevent janky UI interactions and improves the overall perceived performance of your application
            disabled={newCategory.length==0}         
            onClick={() => startTransition(handleAddCategory)}
            >Add</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </SelectContent>
  </Select>
  )
}

export default Dropdown