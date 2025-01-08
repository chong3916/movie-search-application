package movie.time.project.demo.api.responses;

import java.util.ArrayList;

public class KeywordSearchResponse {
    private ArrayList<KeywordResponse> results;
    private int total_results;

    public KeywordSearchResponse(ArrayList<KeywordResponse> results, int total_results){
        this.results = results;
        this.total_results = total_results;
    }

    public void setResults(ArrayList<KeywordResponse> results){ this.results = results; }
    public void setTotalResults(int total_results){ this.total_results = total_results; }
    public ArrayList<KeywordResponse> getResults(){ return results; }
    public int getTotalResults(){ return total_results; }
}
