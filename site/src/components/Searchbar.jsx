import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {DropdownButton, Form, Stack} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

const Searchbar = ({ setBanner }) =>{
    const [searchTerm, setSearchTerm] = useState(""); // Initial search term is blank
    const [searchCategory, setSearchCategory] = useState("keyword"); // Initial search category is movie
    const [startYear, setStartYear] = useState(""); // Initial start year for filter is blank
    const [endYear, setEndYear] = useState(""); // Initial end year for filter is blank
    const navigate = useNavigate();

    // set search category when term is typed
    const handleChangeTerm = (event) =>{
        setSearchTerm(event.target.value);
    };
    const handleYearStartFilter = (event) =>{
        setStartYear(event.target.value);
    };

    const handleYearEndFilter = (event) => {
        setEndYear(event.target.value);
    };

    const handleChangeCategory = (event) =>{
        setSearchCategory(event.target.value);
    };

    const handleSubmit = (event) =>{
        event.preventDefault();
        if(/\S/.test(searchTerm)){
            let searchStartYear = startYear;
            let searchEndYear = endYear;
            if(startYear.length == 0){
                searchStartYear = null;
            }
            if(endYear.length == 0){
                searchEndYear = null;
            }
            setBanner({message: null, variant: null});
            const searchPath = searchTerm.replace(' ', '+'); // replace the space in search term with "+"
            setSearchTerm("");
            setSearchCategory("keyword");
            navigate('/search/' + searchCategory + '/' + searchPath + '/' + searchStartYear + '/' + searchEndYear);
        }
        else{
            setSearchTerm("");
            setSearchCategory("keyword");
            setBanner({message: "Search term can not be empty", variant: "danger"});
            //navigate(".", {state: {paramMessage: "Search term can not be empty", variant: "danger"}});
        }
    }

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
}

export default Searchbar;