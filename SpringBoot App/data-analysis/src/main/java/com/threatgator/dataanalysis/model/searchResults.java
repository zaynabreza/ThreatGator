package com.threatgator.dataanalysis.model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class searchResults {

    Map reports = new HashMap<String, String>();

    public JSONObject getSearchResults() throws JSONException, IOException {
        Iterator hmIterator = reports.entrySet().iterator();
        JSONObject j  = new JSONObject();
        while(hmIterator.hasNext()){
            Map.Entry mapElement = (Map.Entry)hmIterator.next();
            j.put((String) mapElement.getKey(), mapElement.getValue());
        }
        return j;
    }
    public void addSearchReports(String report, String hash){
        reports.put(report, hash);
    }

}
