package movie.time.project.demo.api.responses;

// MovieResponse java object to convert json objects
// Variables in class must match with json keys in database
public class PersonSearchResponse {
    private PersonResponse[] results;
    private int total_results;
    private int total_pages;

    public PersonSearchResponse(PersonResponse[] results, int total_results, int total_pages){
        this.results = results;
        this.total_results = total_results;
        this.total_pages = total_pages;
    }
    public PersonResponse[] getResults(){ return results; }
    public int getTotalResults(){ return total_results; }
    public int getTotalPages(){ return total_pages; }
    public void setResults(PersonResponse[] results){ this.results = results; }
    public void setTotalResults(int total_results){ this.total_results = total_results; }
    public void setTotalPages(int total_pages){ this.total_pages = total_pages; }
}