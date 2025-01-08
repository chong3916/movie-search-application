import {
    Box,
    Checkbox, Collapse,
    Divider,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import React from "react";
import {useSearchContext} from "../contexts/SearchContext";

const searchCategories = ['Keyword', 'Actor', 'Title'];

const FilterItems = (isMobile) => {
    const { searchData, setSearchData } = useSearchContext();
    const [openSortBy, setOpenSortBy] = React.useState(false);

    const handleYearStartFilter = (event) =>{
        setSearchData({...searchData, startYear: event.target.value});
    };

    const handleSortByClick = () => {
        setOpenSortBy(!openSortBy);
    };

    const handleYearEndFilter = (event) => {
        setSearchData({...searchData, endYear: event.target.value});
    };

    const handleChangeCategory = (category) =>{
        setSearchData({...searchData, searchCategory: category.toLowerCase()})
    };


    return (
        <Box
            sx={{width: isMobile ? 'auto' : 250}}
            role="presentation"
        >
            <List>
                <ListItemButton onClick={() => { handleSortByClick() }}>
                    <ListItemText primary="Categories"/>
                    {openSortBy ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={openSortBy} timeout="auto" unmountOnExit>
                    {searchCategories.map((category) => {
                        return (<ListItem
                            key={category.toLowerCase()}
                            disablePadding
                        >
                            <ListItemButton id={category + "Category"} role={undefined} onClick={() => handleChangeCategory(category)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={searchData.searchCategory === category.toLowerCase()}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{'aria-labelledby': category.toLowerCase()}}
                                    />
                                </ListItemIcon>
                                <ListItemText id={category.toLowerCase()} primary={category}/>
                            </ListItemButton>
                        </ListItem>)
                    })}
                </Collapse>
                <Divider/>
                <ListItem>
                    <ListItemButton role={undefined} dense disableRipple>
                        <InputBase
                            type="number"
                            inputProps={{'aria-label': 'yearStartFilter', 'id': 'yearStartFilter'}}
                            value={searchData.startYear}
                            placeholder="Filter start year…"
                            onChange={(event) => {
                                handleYearStartFilter(event)
                            }}/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton role={undefined} dense disableRipple>
                        <InputBase
                            type="number"
                            inputProps={{'aria-label': 'yearEndFilter', 'id': 'yearEndFilter'}}
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
}

export default FilterItems;