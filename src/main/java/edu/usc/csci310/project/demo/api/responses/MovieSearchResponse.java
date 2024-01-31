package edu.usc.csci310.project.demo.api.responses;

import java.util.ArrayList;

// MovieSearchResponse java object to convert json objects
// Variables in class must match with json keys in database
public class MovieSearchResponse {
    private ArrayList<MovieResponse> results;
    private int total_results;
    private int total_pages;
    private int last_page;

    public MovieSearchResponse(ArrayList<MovieResponse> results, int total_results, int total_pages, int last_page){
        this.results = results;
        this.total_results = total_results;
        this.total_pages = total_pages;
        this.last_page = last_page;
    }

    public ArrayList<MovieResponse> getResults(){ return results; }
    public int getTotalResults(){ return total_results; }
    public int getTotalPages(){ return total_pages; }
    public int getLastPage(){ return last_page; }

    public void setResults(ArrayList<MovieResponse> results){ this.results = results; }
    public void setTotalResults(int total_results){ this.total_results = total_results; }
    public void setTotalPages(int total_pages){ this.total_pages = total_pages; }
    public void setLastPage(int last_page){ this.last_page = last_page; }
}

