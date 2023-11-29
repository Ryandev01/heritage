import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { RootState } from "../store"
import { setHistoryRedux } from "../store/reducers/searchResultsReducer"
import { tabNameProps } from "../types/SearchResultsTabsProps"

export const useHistory = () => {

    const [historyStack, setHistoryStack] = useState<Array<string> | []>([])
    const { history } = useSelector((state: RootState) => state.searchResults);
    let { tabName } = useParams<{ tabName?: tabNameProps }>();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname, search } = useLocation()

    const navigateTo = (stack: string | { search: string, pathname: string }) => {

        /** navigate to expected path */
        if (typeof stack === 'string') {

            const searchString = search ? search : '' // eg. ?{"refinedSearch":{"period":["Modern"]}}
            dispatch(setHistoryRedux([...history, `${pathname}${searchString}`]))

            navigate(stack, { replace: true })
        }

        if (
            (typeof stack === 'object') &&
            stack.search &&
            stack.pathname
        ) {

            /** set current path as history */
            dispatch(setHistoryRedux([...history, `${pathname}?${stack.search}`]))
            navigate(stack);
        }
    }

    const goBack = () => {

        let newState = [...history]

        if (newState.length > 0) {
            const lastEntry: string | undefined = newState.pop()

            if (lastEntry) {
                navigate(lastEntry, { replace: true })
            } else {
                if (tabName) navigate(`/${tabName}`, { replace: true })
            }
        } else {
            if (tabName) navigate(`/${tabName}`, { replace: true })
        }
        dispatch(setHistoryRedux(newState))

    }

    return {
        stack: historyStack,
        navigateTo: navigateTo,
        goBack: goBack,
    }
}