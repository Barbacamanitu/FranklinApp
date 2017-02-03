import { ParcelPopup } from './ParcelPopup';
import { LayerManager } from './layers/layerManager';
declare var cartodb:any;
export class FranklinMap{
    //Member variables
    lMap:L.Map;
    layerManager:LayerManager;
    constructor(){
        this.lMap = L.map("map", {
            zoom: 11,
            center: [34.4410, -87.8343]
        });
        this.layerManager = new LayerManager(this);
        this.layerManager.loadJsonLayers();
        this.layerManager.loadComplexLayers().then(()=>{
        console.log('loaded complex');});
       /* $(window).keypress((e:JQueryKeyEventObject) => {
            if (e.which == 99){
                this.layerManager.loadComplexLayers().then(()=>{
                    console.log('loaded complex');
                });
            }

            if (e.which == 97){
                console.log(this.layerManager);
            }
        });*/

    }

    getDataFromId(id:number){
        var sql = new cartodb.SQL({ user: 'cartomike' });
        var endpoint = "https://cartomike.carto.com/api/v2/sql/";
            // ownerQ = ownerQ.split("{NAME}").join(name);
        var myQuery = "SELECT *,ST_AsGeoJSON(ST_Centroid(the_geom)) as centroid FROM parcels_carto WHERE cartodb_id = " + id;
        console.log("Making CartoDB GET request for ID: " + id + "...");
        return new Promise((resolve,reject) => {
            $.getJSON(
            endpoint,
            { q: myQuery },
            (data) => resolve(data.rows[0]));
        });       
    }

    openPopup(item:any)
    {
        var coords = JSON.parse(item.centroid).coordinates.reverse();
        this.lMap.setView(coords,16,{animate: false});
        console.log("Should open popup now.");
        console.log("TODO: Add actual popup");
        console.log(item);
        var p = new ParcelPopup(this,item);
        p.open();

    }
    
}