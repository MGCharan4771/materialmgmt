sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("materialmgmt.controller.Create", {
            onInit: function () {
                var CreateModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(CreateModel, "CreateModel");

                var oLineItemModel = {
                    "aLineItems": []
                }
                var CreateLineItemModel = new sap.ui.model.json.JSONModel(oLineItemModel);
                this.getView().setModel(CreateLineItemModel, "CreateLineItemModel");
            },
            onPressNavBack: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1")
            },
            onPressAdd: function () {
                var CreateLineItemModel = this.getView().getModel("CreateLineItemModel");
                var modelData = CreateLineItemModel.getData().aLineItems;
                modelData.push({
                    "Raube": "",
                    "Tragr": "",
                    "Bwscl": "",
                    "Vhart": "",
                    "Inhal": "",
                    "Mfrnr": ""
                });
                CreateLineItemModel.updateBindings(true);
            },
            onPressDelete: function (oEvent) {
                var CreateLineItemModel = this.getView().getModel("CreateLineItemModel");
                var modelData = CreateLineItemModel.getData().aLineItems;
                var selectedPath = oEvent.getSource().getBindingContext("CreateLineItemModel").getPath();
                var index = Number(selectedPath.split("/")[2]);
                modelData.splice(index, 1);
                CreateLineItemModel.updateBindings(true);
            },
            onPressCreate: function () {
                var oView = this.getView();
                var oModel = this.getView().getModel();
                var CreateModel = this.getView().getModel("CreateModel");
                var CreateLineItemModel = this.getView().getModel("CreateLineItemModel");

                var payload = {
                    "MatDes": CreateModel.getProperty("/MatDes"),
                    "MatType": oView.byId("idCreateMatType").getValue(),
                    "Ersda": new Date(),
                    "Mbrsh": oView.byId("idCreateIndustry").getValue(),
                    "Matkl": oView.byId("idCreateMatGrp").getValue(),
                    "Meins": oView.byId("idCreateBaseUnit").getValue(),
                    "Volum": oView.byId("idCreateVolume").getValue(),
                    "Gewei": oView.byId("idCreateUOW").getValue(),
                    "Voleh": oView.byId("idCreateVolUnit").getValue(),
                    "Prdha": oView.byId("idCreatePrdHier").getValue(),
                    "Ntgew": oView.byId("idCreateNetWeight").getValue(),
                    "tomattransdet" : {
                        "results" : CreateLineItemModel.getData().aLineItems
                    }
                }

                oModel.create("/Material_detSet", payload, {
                    success: function (response) {
                        console.log(response)
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            }
        });
    });
