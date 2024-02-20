'use client'
// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'

 

type FileUploaderProps = {
    onFieldChange:(value:string) => void;
    imageUrl:string,
    setFiles:Dispatch<SetStateAction<File[]>>
}


const FileUploader = ({ onFieldChange, imageUrl,setFiles}: FileUploaderProps) => {
    //once we select a file it comes on onDrop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    //now changing the field on the form too so we can get imageUrl

    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, []);
 

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  });
 
  return (
    <div
    className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      {
        imageUrl ?
        <div className="flex h-full w-full flex-1 justify-center ">
        <img
          src={imageUrl}
          alt="image"
          width={250}
          height={250}
          className="w-full object-cover object-center"
        />
      </div>
        :
        <div className="flex-center flex-col py-5 text-grey-500">
        <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
        <h3 className="mb-2 mt-2">Drag photo here</h3>
        <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
        <Button type="button" className="rounded-full">
          Select from computer
        </Button>
      </div>
      }
  
     
    </div>
  );
}


export default FileUploader