sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    function (Controller, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("materialmgmt.controller.View1", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onRouteMatched, this);

                var TableModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(TableModel, "TableModel")
            },
            onRouteMatched: function () {

            },
            onpressGo: function () {
                var materialnumber = this.getView().byId("idProductId").getValue();
                var aFilters = [];
                if (materialnumber !== "") {
                    aFilters.push(new Filter("MatNo", FilterOperator.Contains, materialnumber))
                }

                var oModel = this.getView().getModel();
                var TableModel = this.getView().getModel("TableModel");
                sap.ui.core.BusyIndicator.show();
                oModel.read("/Material_detSet", {
                    success: function (response) {
                        console.log(response)
                        TableModel.setProperty("/", response);
                        TableModel.updateBindings(true);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (error) {
                        var errormsg = JSON.parse(error.responseText).error.message.value;
                        MessageBox.error(errormsg);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this)
                })
            },
            onPressCreate: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCreate")
            },
            onPressUpdate: function () {
                var table = this.getView().byId("idTable");
                var selectedObj = table.getSelectedItem().getBindingContext("TableModel").getObject();

                if (!this.updateDialog) {
                    this.updateDialog = sap.ui.xmlfragment("materialmgmt.view.fragments.update", this);
                    this.getView().addDependent(this.updateDialog);
                }
                this.updateDialog.open();
                sap.ui.getCore().byId("idUpdateMatNo").setValue(selectedObj.MatNo);
                sap.ui.getCore().byId("idUpdateMatDesc").setValue(selectedObj.MatDes);
                sap.ui.getCore().byId("idUpdateMatType").setValue(selectedObj.MatType);
                sap.ui.getCore().byId("idUpdateIndustry").setValue(selectedObj.Mbrsh);
                sap.ui.getCore().byId("idUpdateMatGrp").setValue(selectedObj.Matkl);
                sap.ui.getCore().byId("idUpdateNetWgt").setValue(selectedObj.Ntgew);

            },
            onPressUpdateRecord: function () {
                var oModel = this.getView().getModel();
                var materialnumber = sap.ui.getCore().byId("idUpdateMatNo").getValue()
                var payload = {
                    "MatNo": materialnumber,
                    "MatDes": sap.ui.getCore().byId("idUpdateMatDesc").getValue(),
                    "MatType": sap.ui.getCore().byId("idUpdateMatType").getValue(),
                    "Mbrsh": sap.ui.getCore().byId("idUpdateIndustry").getValue(),
                    "Matkl": sap.ui.getCore().byId("idUpdateMatGrp").getValue(),
                    "Ntgew": sap.ui.getCore().byId("idUpdateNetWgt").getValue(),
                }

                oModel.update("/Material_detSet('" + materialnumber + "')", payload, {
                    success: function (response) {
                        MessageBox.success("Selected Record is Updated Successfully")
                        this.updateDialog.close();
                        this.getView().byId("idTable").removeSelections(true);
                    }.bind(this),
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            onPressUpdateCancel: function () {
                this.updateDialog.close();
            },
            onPressDelete: function () {
                var table = this.getView().byId("idTable");
                var selectedObj = table.getSelectedItem().getBindingContext("TableModel").getObject();
                var materialnumber = selectedObj.MatNo;

                var oModel = this.getView().getModel();

                oModel.remove("/Material_detSet('" + materialnumber + "')", {
                    success: function (response) {
                        console.log(response)
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            onPressRow: function(oEvent){
                var selectedObj = oEvent.getSource().getBindingContext("TableModel").getObject();
                var metno = selectedObj.MatNo;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail",{
                    materialnumber : metno
                });
            }
        });
    });
