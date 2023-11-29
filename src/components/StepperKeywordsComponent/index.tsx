import { ChangeEvent, useState, useEffect, SyntheticEvent } from "react";
import { Box, Chip, Autocomplete, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import styles from "./index.module.css";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { detectLowerCaseStringInArray, handleEnter } from "../../utils/services/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../Common/Loader";
import { getKeywords } from "../../api/keywords";
import { dbIdTypes } from "../../types/Place";
import { InventoryAssociationType, InventoryAssociationType_Event } from "../../types/SearchResultsTabsProps";
import { ClearOutlined } from "@mui/icons-material";

const textInputSxStyles = {
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    border: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root ": {},
  "& .MuiInputBase-input.MuiOutlinedInput-input ": {
    lineHeight: "1.2",
    border: "1.4px solid #fff",
    padding: "0.5em 1em",
    height: "1.4em",
  },
  "& .MuiOutlinedInput-notchedOutline span": {
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    color: "transparent",
  },
};
const commonFormControlSxStyles = {
  width: "100%",
  flexGrow: 0,
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
  },
};


type PropsPassed = {
  onKeyDown: (str: string) => void
  onDelete: (str: string) => void
  currentKeywordArray: string[] | []
  setCurrentKeywordsArray: (arr: string[]) => void
}

type CustomChipTypes = {
  index: number
  item: string
  currentKeywordArray: string[] | []
  onDeleteKeyWord: (value: any) => void
  suggestionSelected: (value: any) => void
}

const CustomChip = ({
  index,
  item,
  currentKeywordArray,
  onDeleteKeyWord,
  suggestionSelected
}: CustomChipTypes) => {
  let isSelected = false

  if (currentKeywordArray.length > 0) {
    // @ts-ignore
    isSelected = currentKeywordArray.includes(item)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSelected) {
      onDeleteKeyWord(item)
    } else {
      suggestionSelected(item)
    }
  }

  return <>
    <Box component="div" key={index} onClick={e => {
      handleClick(e)
    }}>

      <Chip size="small" variant="outlined" label={item}
        deleteIcon={
          isSelected ? <CloseIcon fontSize="small"
            style={{
              color: isSelected ? 'inherit' : 'gray'
            }}
          /> :
            <AddIcon fontSize="small" />
        }
        clickable={true}
        onDelete={e => {
          /**dont delete else icons wont appear */
          handleClick(e)
        }}
        sx={{
          border: isSelected ? '1px solid #000' : '1px dashed gray',
          color: isSelected ? 'inherit' : 'gray',
          borderRadius: '10px'
        }}
      />
    </Box>
  </>

}

export const StepperKeywordsComponent = ({
  onKeyDown,
  onDelete,
  currentKeywordArray,
  setCurrentKeywordsArray
}: PropsPassed) => {

  const [search, setSearch] = useState({
    text: "",
    suggestions: []
  });
  const { addNewItemWindowType, associatedPlaces, associatedEvents } = useSelector((state: RootState) => state.searchResults);
  const [currentlyShownList, setCurrentlyShownList] = useState<string[] | []>([])
  const [preloadedKeywordsList, setPreloadedKeywordsList] = useState<string[] | []>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)

  const apiKeyword: dbIdTypes = addNewItemWindowType === 'Places' ? 'place' : addNewItemWindowType === 'Events' ? 'event' :
    addNewItemWindowType === 'Library' ? 'library' : 'media'

  const [loading, setLoading] = useState<boolean>(false)

  const getCall = async () => {
    try {
      setLoading(true)
      const res = await getKeywords(apiKeyword)
      setLoading(false)
      return res
    } catch (e) {
      return null
    }
  }

  const onTextChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearch(state => ({
      ...state,
      text: e.target.value || ''
    }))

    let newList: string[] | [] = []

    if (value.length > 0) {

      const refList = [...preloadedKeywordsList]

      newList = refList && refList.map((item: string) => item.toLowerCase()).filter((item: string) => item.indexOf(value.toLowerCase()) !== -1)

      setShowList(newList)

    } else {
      newList = [...preloadedKeywordsList]
      setShowList(newList)
    }
  };

  const [showList, setShowList] = useState<Array<string> | []>([])

  const loadKeywordsList = async () => {

    const res = await getCall()

    let displayedKeywords = [...res]

    if (associatedPlaces && (associatedPlaces.length > 0)) {
      associatedPlaces.map((item: InventoryAssociationType) => {
        displayedKeywords = [...displayedKeywords, ...item.keywords]
      })
    }
    if (associatedEvents && (associatedEvents.length > 0)) {
      associatedEvents.map((item: InventoryAssociationType_Event) => {
        displayedKeywords = [...displayedKeywords, ...item.keywords]
      })
    }

    if (res || displayedKeywords) {
      setCurrentlyShownList(createSelectedFirstList([...displayedKeywords]))
      setPreloadedKeywordsList([...displayedKeywords])
      setShowList([...displayedKeywords])
    }
  }

  useEffect(() => {
    loadKeywordsList()
  }, [])


  const createSelectedFirstList = (list: string[] | []) => {
    let newArr: string[] | [] = []

    list.forEach(item => {
      let isSelected = false

      if (currentKeywordArray.length > 0) {
        // @ts-ignore
        isSelected = currentKeywordArray.includes(item)
      }

      if (isSelected) {
        newArr = [item, ...newArr]
      } else {
        newArr = [...newArr, item]
      }

    })

    return newArr
  }

  useEffect(() => {

    let newList: string[] | [] = [...currentlyShownList]

    if (
      (currentKeywordArray.length > 0) &&
      (currentlyShownList.length === 0)
    ) {
      newList = [...currentKeywordArray]
    }

    if (
      (currentKeywordArray.length > 0) &&
      (currentlyShownList.length > 0)
    ) {
      currentKeywordArray.forEach((item: string) => {
        if (!detectLowerCaseStringInArray(item, currentlyShownList)) {

          newList = [item, ...newList]
        }
      })
    }
    setCurrentlyShownList(createSelectedFirstList(newList))


  }, [currentKeywordArray, currentlyShownList.length])

  const suggestionSelected = (value: any) => {

    if (value && (value !== '')) {

      if (!detectLowerCaseStringInArray(value, currentKeywordArray)) {

        setSearch({
          text: "",
          suggestions: []
        });
        onKeyDown(value)

      }
    }

  };

  const onDeleteKeyWord = (value: any) => {

    onDelete(value)

    if (!detectLowerCaseStringInArray(value, preloadedKeywordsList)) {
      setCurrentlyShownList(state => createSelectedFirstList(state.filter(item => item !== value)))
    }
  }

  const handleSelectAll = () => {

    if (currentlyShownList.length > 0) {
      if (!selectAll) { // reverse flag
        setCurrentKeywordsArray(currentlyShownList)
      } else {
        setCurrentKeywordsArray([])
        setCurrentlyShownList(createSelectedFirstList([...preloadedKeywordsList]))
      }
    }

    setSelectAll(state => !state)

  }

  const handleClear = () => {
    setSearch((state) => ({
      ...state,
      text: "",
    }));
    let newList: string[] | [] = [];

    newList = [...preloadedKeywordsList];
    setShowList(newList);
  };

  return (
    <>

      <Box component="div">Make your content discoverable</Box>
      <Box component="div">
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          inputValue={search.text}
          options={showList ? showList.map((option) => option) : []}
          renderInput={(params) => {
            const newObj = { ...params }

            delete newObj.inputProps.value

            return <>
              <TextInput
                {...newObj}
                className={`${styles["english-name"]}`}
                id="keyword-div"
                label="Add Keywords"
                name="keywords"
                value={search.text}
                onChange={onTextChanged}
                onKeyDown={e => {
                  handleEnter(e, () => {
                    suggestionSelected(search.text)
                  });
                }}
                sx={{
                  ...textInputSxStyles,
                }}
                formControlSx={commonFormControlSxStyles}
              />
            </>
          }}
          onChange={(event: SyntheticEvent<Element, Event>, value: string | null) => {
            if (value !== null) {
              suggestionSelected(value)
            }
          }}
          clearIcon={
            <IconButton
              sx={{
                display: search.text.length > 0 ? "visible" : "none",
                top: '-10%',
                padding: 0
              }}
              onClick={() => handleClear()}
            >
              <ClearOutlined fontSize={"small"} sx={{ padding: 0 }} />
            </IconButton>
          }
        />
        <Box component="div">
          <Button
            colors={["#fff", "var(--table-black-text)", "none"]}
            className={`${styles["plain-whitee-btn"]}`}
            label={selectAll ? "Remove all" : "Select all"}
            onClick={e => {
              e.preventDefault()
              handleSelectAll()
            }}
            style={{
              paddingInline: 0,
              paddingBlock: 0,
              marginTop: '1em',
              lineHeight: '1em',
              height: 'fit-content'
            }}
          />
        </Box>
        <Box component="div" style={{
          display: 'flex',
          gap: '5px',
          marginTop: "1em",
          flexWrap: 'wrap'
        }}>
          {
            loading && <Loader />
          }
          {
            currentlyShownList && currentlyShownList.length > 0 && currentlyShownList.map((item: string, index: any) => <>
              <CustomChip
                index={index}
                item={item}
                currentKeywordArray={currentKeywordArray}
                onDeleteKeyWord={onDeleteKeyWord}
                suggestionSelected={suggestionSelected}
              />
            </>
            )
          }
        </Box>
      </Box>
    </>
  );
};