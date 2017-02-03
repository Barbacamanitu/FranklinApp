import { FranklinMap } from './../FranklinMap';
import {NamedLayer} from './namedLayer';
import {JsonLayerLoader} from './JsonLayerLoader';
declare var cartodb:any;
export class LayerManager{

    namedLayers:Array<NamedLayer>;
    private lMap:L.Map;
    private fMap:FranklinMap;
    constructor(fMap:FranklinMap){
        this.namedLayers = new Array<NamedLayer>();
        this.lMap = fMap.lMap;
        this.fMap = fMap;
    }

    loadJsonLayers(){
        
       let p = new Promise((resolve,reject) => {
           let jLayers = JsonLayerLoader.loadJSONLayers(this.lMap);
           this.namedLayers = this.namedLayers.concat(jLayers);
           resolve(this.namedLayers.length);
       });  
    }


    loadComplexLayers(){
        console.log("Loading complex..");
        let longPromise = new Promise(function(resolve,reject){
            
            setTimeout(() =>{
                console.log("About to fulfill dummy sleep promise");
                resolve();},1000);
        });
        return Promise.all([ this.createCartoLayer() , longPromise ]);
    }

    createCartoLayer(){
        new Promise((resolve,reject) => {
            var layerUrl = 'https://cartomike.carto.com/api/v2/viz/92b6a26e-a3c9-11e6-a4a5-0ecd1babdde5/viz.json';
            cartodb.createLayer(this.lMap, layerUrl, {infowindow: false}).addTo(this.lMap).on('done', (layer:any)=> {
                //Config for this carto layer to make interaction work
                layer.setZIndex(10);
                layer.getSubLayer(1).setInteraction(true);
                
                layer.getSubLayer(1).on('featureClick', (e:any, latlng:Object, pos:Object, data:any, lay:any) => {
                   console.log("CartoDB Layer clicked on.");
                   this.fMap.getDataFromId(data.cartodb_id).then((item) => {this.fMap.openPopup(item);});
                });

                layer.on('mouseover', function() {
                    $('#map').css('cursor','pointer');
                });
                layer.on('mouseout', function() {
                    $('#map').css('cursor','');
                });


                let nl = new NamedLayer("cartoParcelLayer","carto",true);
                nl.layer = layer;
                this.namedLayers.push(nl);
                console.log("About to fulfill carto promise.");
                resolve();
            }).on('error',reject);
        });
    }
}