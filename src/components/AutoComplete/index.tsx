import Select from "@mui/material/Select";
import Chip from '@mui/material/Chip';
import { AutoCompleteMultiSelectProps, DropdownCompProps } from "../../types/DropdownComponent";
import { MenuItem, Box, Autocomplete, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import styles from './index.module.css';

const AutoCompleteComponent = ({
  className,
  label,
  placeholder,
  value: values,
  handleChange,
  handleSelectChange,
  itemsList,
  name,
  selectStylesSx,
  formControlSx,
  multiple,
  handleClear
}: AutoCompleteMultiSelectProps) => {
  const staticLabel = label ? label : "select";
  const [focused, setFocused] = useState(false);

  return (
    <div className={className}>
      <FormControl sx={{ minWidth: 120, ...formControlSx }}>
        {
          multiple && <>
            <Box component="div" className={`${styles['autocmplt-container']}`}>
              <Autocomplete
                disablePortal
                multiple
                id="tags-filled"
                options={itemsList.map(item => item.label)}
                onChange={handleSelectChange}
                value={values}
                size="small"
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    option && <Chip size = "small" variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderOption={(props, option) => {
                  return <Box component={"li"}
                    {...props}
                    sx={{
                      textAlign: 'left',
                      paddingInline: '0.5em',
                      paddingBottom: '0.5em',
                      lineHeight: '1.2',
                      '$ :hover': {
                        backgroundColor: 'red'
                      }
                    }}>{option}</Box>
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={staticLabel}
                  />
                )}
                sx={{
                  // '& .MuiInputBase-root.MuiFilledInput-root:before': {
                  //   borderBottom: 'none',
                  //   display:' none'
                  // },
                  // '& .MuiFilledInput-root.MuiInputBase-sizeSmall': {
                  //   paddingLeft: '0.5em',
                  //   paddingTop: '0.55em',
                  //   borderRadius: '0.3em',
                  //   border: '1px solid rgba(0,0,0,0.2)'
                  // },
                  // '& .MuiFormControl-fullWidth.MuiTextField-root': {
                  //   position: 'relative'
                  // },
                  // '& .MuiFormLabel-root.MuiInputLabel-root[data-shrink="false"]': {
                  //   top: '50%',
                  //   transform: 'translate(2%, -50%)',
                  //   paddingLeft: '1em',
                  // },
                  // '& .MuiFormLabel-root.MuiInputLabel-root[data-shrink="true"]': {
                  //   top: '-0.7em',
                  //   background: 'radial-gradient(circle, rgba(0,0,0,0.05) 0.5%, transparent 100%)',
                  //   borderRadius: '4px'
                  // }
                }}
              />
            </Box>
          </>
        }
        {
          !multiple && <>
            {(focused || values) && (
              <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
            )}
            <Select
              labelId={staticLabel}
              id="simple-select"
              multiple={multiple}
              value={values}
              name={name}
              label={staticLabel}
              placeholder={placeholder}
              onChange={handleChange}
              onFocus={(e) => setFocused(true)}
              onBlur={(e) => setFocused(false)}
              displayEmpty
              sx={selectStylesSx}
            // renderValue={(selected: any) => (
            //   <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            //     {selected?.map((value: any) => (
            //       <Chip key={value} label={value} />
            //     ))}
            //   </Box>
            // )}
            // endAdornment={<IconButton sx={{display: values.length>0 ? "visible": "none"}} onClick={handleClear} ><ClearOutlined fontSize={"small"} /></IconButton>}
            >
              <MenuItem disabled value="">
                <em>{staticLabel}</em>
              </MenuItem>
              {itemsList.map((item) => (
                <MenuItem key={item.label} value={item.value}>{item.label}</MenuItem>
              ))}
            </Select>
          </>
        }
      </FormControl>
    </div>
  );
};

export default AutoCompleteComponent;
