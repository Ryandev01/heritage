import { Place } from "./Place"
import { Options } from "./RefinedSeachTypes"
import { tabNameProps } from "./SearchResultsTabsProps"
import type { UploadFile } from 'antd/es/upload/interface';

export type CustomDrawerProps = {
    origin: "top" | "right" | "bottom" | "left" | undefined
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export type AddNewItemPaneProps = {
    onClose: () => void
    create?: (options?: any) => Promise<any>
    update?: (options?: any) => Promise<any>
    setSearchValue?: (str: string) => void
}
export type AddNewItemProps = {
    onHide: () => void
    create?: (options?: any) => Promise<any>
    update?: (options?: any) => Promise<any>
    setSearchValue?: (str: string) => void
}

export type StepContentTypes = {
    tabName: tabNameProps | undefined
    options?: Options | null
    places?: Place[] | []
    formState?: any
    setFormState?: React.SetStateAction<any> 
    activeStep: number
    steps: Array<string>
    handleNext: (e: any, data?: InitialValues) => void
    handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    handleBack:  () => void
    uploadImage?:  (options: any) => void
    handleClear?:  (options: any) => void
    formik?:any
}

export type CustomUploadProps = {
    title?: string,
    existingImageUrl?: string,
    uploadImage?: (options: any) => void
    handleDelete?: (file: UploadFile<any>) => void
    defaultImages?: any[]
    accept: string;
}

export type InitialValues = {
    place: string,
    eventDate: Date,
    recordingTeam: string,
    siteDescription: string,
    fieldNarrative: string,
    siteType: string,
    keywords: string,
}