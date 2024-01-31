package edu.usc.csci310.project.demo.api.responses;

// MovieResponse java object to convert json objects
// Variables in class must match with json keys in database
public class MovieResponse {
    private String title;
    private String overview;
    private String poster_path;
    private String id;
    private GenreResponse[] genres;
    private ProductionCompaniesResponse[] production_companies;
    private String release_date;
    private PersonResponse[] cast;
    private String backdrop_path;
    private PersonResponse director;

    public MovieResponse(String overview, String title, String id, String poster_path, GenreResponse[] genres, ProductionCompaniesResponse[] production_companies, String release_date, PersonResponse[] cast, PersonResponse director, String backdrop_path){
        this.title = title;
        this.overview = overview;
        this.id = id;
        this.genres = genres;
        this.production_companies = production_companies;
        this.release_date = release_date;
        this.backdrop_path = backdrop_path;
        this.cast = cast;
        this.director = director;

        if(poster_path == null){
            this.poster_path = null;
        }
        else {
            this.poster_path = "https://image.tmdb.org/t/p/original" + poster_path;
        }

        if(backdrop_path == null) {
            this.backdrop_path = null;
        }
        else{
            this.backdrop_path = "https://image.tmdb.org/t/p/w1280" + backdrop_path;
        }
    }

    public PersonResponse getDirector(){ return director; }
    public String getTitle(){ return title; }
    public String getOverview(){ return overview; }
    public String getPosterPath(){ return poster_path; }
    public String getMovieId(){ return id; }
    public GenreResponse[] getGenres(){ return genres; }
    public ProductionCompaniesResponse[] getProductionCompanies(){ return production_companies; }
    public String getReleaseDate(){ return release_date; }
    public PersonResponse[] getCast(){ return cast; }
    public String getBackdropPath(){ return backdrop_path; }

    public void setTitle(String title){ this.title = title; }
    public void setOverview(String overview){ this.overview = overview; }
    public void setPosterPath(String poster_path){
        if(poster_path != null) {
            this.poster_path = "https://image.tmdb.org/t/p/original" + poster_path;
        }
    }
    public void setMovieId(String id){ this.id = id; }
    public void setGenres(GenreResponse[] genres){ this.genres = genres; }
    public void setProductionCompanies(ProductionCompaniesResponse[] production_companies){ this.production_companies = production_companies; }
    public void setReleaseDate(String release_date){ this.release_date = release_date; }
    public void setCast(PersonResponse[] cast){ this.cast = cast; }
    public void setDirector(PersonResponse director){ this.director = director; }
    public void setBackdropPath(String backdrop_path){
        if(backdrop_path != null) {
            this.backdrop_path = "https://image.tmdb.org/t/p/w1280" + backdrop_path;
        }
    }

}
