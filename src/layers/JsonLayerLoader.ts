import { NamedLayer } from './namedLayer';
import { IJsonLayer } from './IJsonLayer';
export module JsonLayerLoader{
    export function loadJSONLayers(map:L.Map){
        let json = require('./layers.json');
        let layerDefinitions:Array<IJsonLayer> = json.layers;  
        let namedLayers = new Array<NamedLayer>();

        layerDefinitions.forEach(def => {
            let nl = this.parseJSONLayer(def);
            if (nl.autoAdd){
                nl.layer.addTo(map);
            }
            namedLayers.push(nl);
        });    
        return namedLayers;
    }

    export function parseJSONLayer(layerDef:IJsonLayer){
        var name = layerDef.name;
        var type = layerDef.type;
        var opts = layerDef.layerOptions;
        var autoAdd = layerDef.autoAdd;
        var namedLayer = new NamedLayer(name,type,autoAdd);

        if (type == "tileLayer"){
            namedLayer.layer = L.tileLayer(opts.url,opts);
            return namedLayer;
        }

        if (type == "esriTiledMapLayer"){
            namedLayer.layer = L.esri.tiledMapLayer(opts);
            return namedLayer;
        }

        if (type == "esriDynamic"){
            namedLayer.layer = L.esri.dynamicMapLayer(opts);
            return namedLayer;
        }
    }
}