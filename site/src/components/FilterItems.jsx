import {
    Box,
    Checkbox,
    Divider,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import FilterCategories from "./FilterCategories";
import React from "react";
import {useSearchContext} from "../contexts/SearchContext";

const FilterItems = (isMobile, openSortBy, setOpenSortBy) => {
    const { searchData, setSearchData } = useSearchContext();

    const handleSortByClick = () => {
        setOpenSortBy(!openSortBy);
    };

    const handleYearStartFilter = (event) =>{
        setSearchData({...searchData, startYear: event.target.value});
    };

    const handleYearEndFilter = (event) => {
        setSearchData({...searchData, endYear: event.target.value});
    };


    return (
        <Box
            sx={{width: isMobile ? 'auto' : 250}}
            role="presentation"
        >
            <List>
                <ListItemButton onClick={handleSortByClick}>
                    <ListItemText primary="Categories"/>
                    {openSortBy ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <FilterCategories openSortBy={openSortBy}/>
                <Divider/>
                <ListItem>
                    <ListItemButton role={undefined} dense>
                        <InputBase
                            type="number"
                            inputProps={{'aria-label': 'yearStartFilter'}}
                            id="yearStartFilter"
                            value={searchData.startYear}
                            placeholder="Filter start year…"
                            onChange={(event) => {
                                handleYearStartFilter(event)
                            }}/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton role={undefined} dense>
                        <InputBase
                            type="number"
                            inputProps={{'aria-label': 'yearEndFilter'}}
                            id="yearEndFilter"
                            value={searchData.endYear}
                            placeholder="Filter end year…"
                            onChange={(event) => {
                                handleYearEndFilter(event)
                            }}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    /*
    <ListItem disablePadding
                          type="number"
                          component={InputBase}
                          inputProps={{'aria-label': 'yearStartFilter'}}
                          id="yearStartFilter"
                          value={searchData.startYear}
                          placeholder="Filter start year…"
                          onChange={(event) => {
                              handleYearStartFilter(event)
                          }}/>
     */
}

export default FilterItems;