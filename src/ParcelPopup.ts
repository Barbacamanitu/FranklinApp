import { FranklinMap } from './FranklinMap';
//import txt = require('raw-loader!./pop.html');
export class ParcelPopup {
    lPop:L.Popup;
    data:any;
    map: FranklinMap;
    allowedFields:any;
    constructor(map:FranklinMap,data:any){
        this.lPop = L.popup();
        this.data = data;
        this.map = map;
        this.allowedFields = {
            "fulladdress" : "Address:",
            "parcelnumber" : "Parcel #:",
            "zipcode": "Zip:"
        };
        this.open();
    }

    toTitleCase(str:string)
    {
        return str.replace(/\w\S*/g, function(txt:string){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    open(){
        var coords = JSON.parse(this.data.centroid).coordinates.reverse();
        this.lPop.setLatLng(coords);
        this.map.lMap.setView(coords,16,{animate: true});
        var html = '<div class="popup-container"> <div class="popup-header"> <span class="popup-header-title">Owner</span> <h3 id="owner-name"></h3> </div> <div class="popup-parcel-details"> </div> <a href="#" id="reportLink">More information</a> </div>';
        var el = $(html);
        var details = el.find('.popup-parcel-details');

        var owner = el.find("#owner-name");
        if (this.data.ownername)
        {
            owner.text(this.toTitleCase(this.data.ownername));
        }
        else
        {
            owner.text("");
        }

        for (var property in this.allowedFields)
        {
            if (this.allowedFields.hasOwnProperty(property))
            {
                if (this.data[property] && this.data[property].length > 0)
                {
                    //If property is allowed and included in the item object, create element with details
                    var title = $("<h4></h4>");
                    var desc = $("<p></p>");
                    title.text(this.allowedFields[property]);
                    desc.text(this.data[property]);
                    details.append(title);
                    details.append(desc);
                }

            }
        }

        
        this.lPop.setContent(el.html());
        this.map.lMap.openPopup(this.lPop);

    }
}