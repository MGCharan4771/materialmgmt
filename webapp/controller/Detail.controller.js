sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("materialmgmt.controller.Detail", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this.onRouteMatched, this);

                var DetailModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(DetailModel, "DetailModel")
            },
            onRouteMatched: function (oEvent) {
                var materialnumber = oEvent.getParameter("arguments").materialnumber;
                var DetailModel = this.getView().getModel("DetailModel");
                var oModel = this.getView().getModel();
                oModel.read("/Material_detSet('" + materialnumber + "')", {
                    urlParameters: {
                        "$expand": "tomattransdet"
                    },
                    success: function (response) {
                        console.log(response);
                        DetailModel.setProperty("/", response);
                        DetailModel.updateBindings(true);
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                    }.bind(this)
                })
            },
            onPressNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1")
            }
        });
    });
