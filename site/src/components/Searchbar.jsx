import React from "react";
import {useNavigate} from "react-router-dom";
import {
    alpha,
    Drawer,
    IconButton,
    InputBase,
    styled, useMediaQuery
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {useSearchContext} from "../contexts/SearchContext";
import FilterItems from "./FilterItems";
import {useBannerContext} from "../contexts/BannerContext";

const Search = styled('form')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
    padding: '0 1rem',
}));

const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'contents',
    color: 'white',
    pointerEvents: 'all'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '28ch',
            },
        },
    },
}));

const searchCategories = ['keyword', 'actor', 'title'];

const Searchbar = () => {
    const { searchData, setSearchData } = useSearchContext();
    const { bannerData, setBannerData } = useBannerContext();

    const [drawerState, setDrawerState] = React.useState(false);
    const isMobile = !useMediaQuery('(min-width:600px)');
    const navigate = useNavigate();

    // set search category when term is typed
    const handleChangeTerm = (event) =>{
        setSearchData({...searchData, searchTerm: event.target.value});
    };

    const toggleDrawer = (open) => (event) => {
        console.log(isMobile);
        console.log(open);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerState(open);
    };

    const handleSubmit = (event) =>{
        event.preventDefault();
        console.log(searchData);
        if(/\S/.test(searchData.searchTerm)){
            const searchStartYear = searchData.startYear.length === 0 ? null : searchData.startYear;
            const searchEndYear = searchData.endYear.length === 0 ? null : searchData.endYear;
            setBannerData({message: null, variant: null});
            const searchPath = searchData.searchTerm.replace(' ', '+'); // replace the space in search term with "+"
            setSearchData({
                searchTerm: "",
                searchCategory: searchCategories[0],
                startYear: "",
                endYear: ""
            });
            navigate('/search/' + searchData.searchCategory + '/' + searchPath + '/' + searchStartYear + '/' + searchEndYear);
        }
        else{
            setSearchData({...searchData, searchTerm: "", searchCategory: searchCategories[0]});
            setBannerData({message: "Search term can not be empty", variant: "error"});
            //navigate(".", {state: {paramMessage: "Search term can not be empty", variant: "error"}});
        }
    }


    /*
    return(
        <div className="SearchBar" style={{margin: "1%"}}>
            <Form onSubmit={handleSubmit}>
                <Stack direction="horizontal" gap={2}>
                    <Form.Select className="me-auto" value={searchCategory} data-testid="selectCategory" id="searchCategory" onChange={handleChangeCategory}>
                        <option id="keywordCategory" value="keyword">Keyword </option>
                        <option id="actorCategory" value="actor">Actor </option>
                        <option id="titleCategory" value="title">Title </option>
                    </Form.Select>
                    <Form.Control className="me-auto" placeholder="Search Term" id="searchTerm" value={searchTerm} aria-label="searchTerm" onChange={handleChangeTerm} required/>
                    <DropdownButton id="filter" title="Filter" aria-label="filter" autoClose="outside">
                        <DropdownItem as="input" type="number" placeholder="Start Year" value={startYear} aria-label="yearStartFilter" id="yearStartFilter" onChange={handleYearStartFilter}/>
                        <DropdownItem as="input" type="number" placeholder="End Year" value={endYear} aria-label="yearEndFilter" id="yearEndFilter" onChange={handleYearEndFilter}/>
                    </DropdownButton>
                    <Button type="submit" id="submitButton" aria-label="searchSubmit">Submit</Button>
                 </Stack>
            </Form>
        </div>
    );
    */
    /*
    return(
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
                <MenuIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Movie Time"
                id="searchTerm"
                inputProps={{ 'aria-label': 'searchTerm' }}
                value={searchTerm}
                onChange={handleChangeTerm}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );*/
    return (
        <Search onSubmit={handleSubmit}>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white', pointerEvents: 'all' }}>
                <FilterAltIcon/>
            </IconButton>
            <StyledInputBase
                sx={{pointerEvents: 'auto'}}
                value={searchData.searchTerm}
                id="searchTerm"
                onChange={(event) => {
                    handleChangeTerm(event)
                }}
                placeholder="Search…"
                inputProps={{'aria-label': 'searchTerm'}}
            />
            <SearchIconWrapper type="submit" disableRipple>
                <SearchIcon/>
            </SearchIconWrapper>
            <Drawer
                anchor={isMobile ? 'top' : 'left'}
                open={drawerState}
                onClose={toggleDrawer(false)}
            >
                <FilterItems isMobile={isMobile}/>
            </Drawer>
        </Search>
    );
}

export default Searchbar;