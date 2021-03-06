import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { RoadMapData } from '../_models/masterdata.model'

@Injectable()
export class MasterService {
    //HttpClient should be passed as a parameter in constructor
    constructor(private http: HttpClient) { }

    //Mention API URL
    private webApiUrl = localStorage.getItem('apiurl');
    //private webApiUrl = localStorage.getItem('apiurl') +"/api/CSV/";
    //Create function to get the data

    public getJSON(): Observable<any[]> {

        let headers = new HttpHeaders();
        //Mention http header details
        let finalheaders = headers.append('Content-Type', 'application/json');
        return this.http.get<any[]>("./assets/apiurl.json", { headers: finalheaders });
           // .catch(this.handleError);

    }

    getRoadMapData(filename): Observable<RoadMapData[]> {
        //Create header object
        let headers = new HttpHeaders();
        //Mention http header details
        let finalheaders = headers.append('Content-Type', 'application/json');
        finalheaders.append("Access-Control-Allow-Origin", "true")
        //Call the get function
        return this.http.get<RoadMapData[]>(this.webApiUrl + "getAllExcelData?filename=" +filename , { headers: finalheaders });
          
    }
    
    uploadSharePointFile(): Observable<RoadMapData[]> {
        //Create header object
        let headers = new HttpHeaders();
        //Mention http header details
        let finalheaders = headers.append('Content-Type', 'application/json');
        finalheaders.append("Access-Control-Allow-Origin", "true")
        //Call the get function
        return this.http.post<any>(this.webApiUrl + "uploadSharePointFile" , { headers: finalheaders });
          
    }
    //Error Handling
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }
}