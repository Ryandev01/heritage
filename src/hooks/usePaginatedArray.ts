import { useState, useEffect } from "react";
import { PaginatedHookType } from "../types/UsePaginatedArray";
import client from '../utils/services/axiosClient';

export const usePaginatedArray = ({
    apiUrl,
    step
}: PaginatedHookType) => {
    const [data, setData] = useState<any>([])
    const paginationStep = step
    const [paginationIndex, setPaginationIndex] = useState<number>(paginationStep)
    const [responseData, setResponseData] = useState<any>([])
    const [hasMoreData, setHasMoreData] = useState<boolean>(true)
    const [loading, setloading] = useState<boolean>(true)

    useEffect(() => {
        setloading(true)
        const controller = new AbortController()
        client.get(apiUrl,
            {
                signal: controller.signal
            }
        )
            .then(res => {
                setloading(false)

                let newData = res.data

                if(newData.length < 20) { /**hardcode repeat of api data */
                    newData = newData.concat(newData).concat(newData).concat(newData)
                } 

                setResponseData(newData.slice(0, 50)) //for testing
                setData(newData.slice(0, paginationIndex))

            })
            .catch(e => {
                setloading(false)

                // cancel the request
                controller.abort()
            })

        return () => {
            controller.abort()
        }

    }, [])



    const fetchData = () => {
        const newpaginationIndex = paginationIndex + paginationStep

        /** hardcode max limit */
        if (newpaginationIndex + step < responseData.length) {
            setData([...data, ...responseData.slice(paginationIndex, newpaginationIndex)])
            setPaginationIndex(newpaginationIndex)
            setHasMoreData(true)
        } else {
            setHasMoreData(false)
        }
    }
    return {
        data,
        setData,
        paginationIndex,
        setPaginationIndex,
        responseData,
        setResponseData,
        hasMoreData,
        setHasMoreData,
        fetchData,
        loading,
        setloading
    }
}
