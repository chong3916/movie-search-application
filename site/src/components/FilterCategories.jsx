import {Checkbox, Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React from "react";
import {useSearchContext} from "../contexts/SearchContext";

const searchCategories = ['Keyword', 'Actor', 'Title'];

const FilterCategories = (openSortBy) => {
    const { searchData, setSearchData } = useSearchContext();
    const handleChangeCategory = (category) =>{
        setSearchData({...searchData, searchCategory: category.toLowerCase()})
    };

    return (
        <Collapse in={openSortBy} timeout="auto" unmountOnExit>
            {searchCategories.map((category) => {
                return (<ListItem
                    key={category.toLowerCase()}
                    disablePadding
                >
                    <ListItemButton role={undefined} onClick={() => handleChangeCategory(category)} dense>
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
    );
};

export default FilterCategories;